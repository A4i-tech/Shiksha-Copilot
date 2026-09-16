#!/usr/bin/env python3
"""
Import block-level GeoJSON into the analytics DB geo_blocks table.

Usage:
    python import_geo_blocks.py --geojson path/to/blocks.geojson \
        --state "Telangana" \
        --name-field "block_name" \
        --district-field "district_name"

    # Dry-run (print matches without writing):
    python import_geo_blocks.py --geojson ... --state ... --name-field ... --dry-run

Requirements:
    pip install psycopg2-binary python-dotenv

The GeoJSON file must be a FeatureCollection where each Feature has polygon
geometry for one block. You specify which property field holds the block name
(--name-field) and optionally which field holds the district name
(--district-field). If your file does not have district info per feature, use
--district-override "DistrictName" to tag all features with one district, then
re-run per district file.

Name matching:
    Block names in shapefiles rarely match dim_regions.name exactly.
    The script does:
      1. Exact match (case-insensitive)
      2. Strip punctuation + whitespace normalise
      3. Strip common suffixes (mandal, block, taluk, tehsil)
    Unmatched features are written to unmatched.json for manual review.
    You can override individual names with --name-map "shapefile_name=db_name".

Environment variables (or .env file):
    ANALYTICS_DB_HOST     (default: localhost)
    ANALYTICS_DB_PORT     (default: 5432)
    ANALYTICS_DB_NAME     (default: analytics)
    ANALYTICS_DB_USER     (default: analytics)
    ANALYTICS_DB_PASSWORD (required)
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

try:
    import psycopg2
    import psycopg2.extras
except ImportError:
    sys.exit("psycopg2-binary not installed: pip install psycopg2-binary")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv optional


def normalise(name: str) -> str:
    """Lowercase, strip punctuation, collapse whitespace, drop trailing admin suffixes."""
    name = name.lower().strip()
    name = re.sub(r"['''\-\.]", " ", name)
    name = re.sub(r"\s+", " ", name).strip()
    for suffix in ("mandal", "block", "taluk", "tehsil", "taluka", "circle"):
        if name.endswith(f" {suffix}"):
            name = name[: -(len(suffix) + 1)].strip()
    return name


def build_lookup(conn, state: str) -> dict[str, str]:
    """
    Returns {normalised_name -> dim_regions.name} for all blocks in state.
    If state not found, returns all blocks (cross-state import).
    """
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT b.name
            FROM dim_regions b
            JOIN dim_regions d ON b.parent_id = d.region_id AND d.type IN ('district', 'zone')
            JOIN dim_regions s ON d.parent_id = s.region_id AND s.type = 'state'
            WHERE b.type = 'block' AND LOWER(s.name) = LOWER(%s)
            UNION
            -- some hierarchies have state -> district directly
            SELECT b2.name
            FROM dim_regions b2
            JOIN dim_regions d2 ON b2.parent_id = d2.region_id AND d2.type = 'district'
            JOIN dim_regions s2 ON d2.parent_id = s2.region_id AND s2.type = 'state'
            WHERE b2.type = 'block' AND LOWER(s2.name) = LOWER(%s)
            """,
            (state, state),
        )
        rows = cur.fetchall()

    if not rows:
        print(f"[warn] No blocks found for state '{state}'. Importing without dim_regions validation.")
        return {}

    lookup: dict[str, str] = {}
    for (db_name,) in rows:
        lookup[normalise(db_name)] = db_name
    print(f"[info] Loaded {len(lookup)} block names from dim_regions for '{state}'")
    return lookup


def match_name(raw: str, lookup: dict[str, str], overrides: dict[str, str]) -> str | None:
    """Return dim_regions.name for raw shapefile name, or None if no match."""
    if raw in overrides:
        return overrides[raw]
    key = normalise(raw)
    if key in lookup:
        return lookup[key]
    return None


def inject_properties(feature: dict, block_name: str, district_name: str, state_name: str) -> dict:
    """Ensure GeoJSON feature properties contain the names we need for Superset tooltips."""
    props = feature.get("properties") or {}
    props["block_name"] = block_name
    props["district_name"] = district_name
    props["state_name"] = state_name
    feature = dict(feature)
    feature["properties"] = props
    return feature


def main():
    parser = argparse.ArgumentParser(description="Import block GeoJSON into analytics DB")
    parser.add_argument("--geojson", required=True, help="Path to blocks GeoJSON FeatureCollection")
    parser.add_argument("--state", required=True, help="State name (must match dim_regions)")
    parser.add_argument("--name-field", required=True, help="GeoJSON property key holding block name")
    parser.add_argument("--district-field", default=None, help="GeoJSON property key holding district name")
    parser.add_argument("--district-override", default=None, help="Use this district name for all features")
    parser.add_argument("--name-map", action="append", default=[], metavar="SHP=DB",
                        help="Manual name override: 'Shapefile Name=dim_regions Name' (repeatable)")
    parser.add_argument("--dry-run", action="store_true", help="Print matches without writing to DB")
    parser.add_argument("--clear", action="store_true", help="DELETE existing rows for this state before import")
    args = parser.parse_args()

    if args.district_field is None and args.district_override is None:
        parser.error("Provide --district-field or --district-override")

    overrides = {}
    for mapping in args.name_map:
        if "=" not in mapping:
            parser.error(f"--name-map must be 'SHP_NAME=DB_NAME', got: {mapping}")
        shp, db = mapping.split("=", 1)
        overrides[shp.strip()] = db.strip()

    geojson_path = Path(args.geojson)
    if not geojson_path.exists():
        sys.exit(f"File not found: {geojson_path}")

    with open(geojson_path, encoding="utf-8") as f:
        collection = json.load(f)

    if collection.get("type") != "FeatureCollection":
        sys.exit("GeoJSON must be a FeatureCollection")

    features = collection["features"]
    print(f"[info] {len(features)} features in file")

    conn = psycopg2.connect(
        host=os.getenv("ANALYTICS_DB_HOST", "localhost"),
        port=int(os.getenv("ANALYTICS_DB_PORT", 5432)),
        dbname=os.getenv("ANALYTICS_DB_NAME", "analytics"),
        user=os.getenv("ANALYTICS_DB_USER", "analytics"),
        password=os.getenv("ANALYTICS_DB_PASSWORD", ""),
    )

    lookup = build_lookup(conn, args.state)

    rows = []
    unmatched = []

    for feat in features:
        props = feat.get("properties") or {}
        raw_name = str(props.get(args.name_field, "")).strip()
        if not raw_name:
            unmatched.append({"reason": "empty name", "properties": props})
            continue

        district_name = (
            args.district_override
            if args.district_override
            else str(props.get(args.district_field, "")).strip()
        )

        db_name = match_name(raw_name, lookup, overrides)
        if db_name is None and lookup:
            # If lookup is populated and no match — flag it but still import with raw name
            unmatched.append({"shapefile_name": raw_name, "district": district_name, "properties": props})
            db_name = raw_name  # import anyway; fix via --name-map

        db_name = db_name or raw_name
        enriched = inject_properties(feat, raw_name, district_name, args.state)
        rows.append((raw_name, args.state, district_name, db_name, json.dumps(enriched)))

    print(f"[info] Matched: {len(rows) - len(unmatched)} / {len(features)}")
    print(f"[warn] Unmatched: {len(unmatched)} (will be imported with raw name — check unmatched.json)")

    if unmatched:
        out = Path("unmatched.json")
        out.write_text(json.dumps(unmatched, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"[info] Unmatched details written to {out.resolve()}")

    if args.dry_run:
        print("[dry-run] Sample rows (geo_name, state, district, db_name):")
        for r in rows[:10]:
            print(f"  {r[0]} | {r[1]} | {r[2]} | {r[3]}")
        conn.close()
        return

    with conn:
        with conn.cursor() as cur:
            if args.clear:
                cur.execute("DELETE FROM geo_blocks WHERE LOWER(state_name) = LOWER(%s)", (args.state,))
                print(f"[info] Cleared existing rows for '{args.state}'")

            psycopg2.extras.execute_values(
                cur,
                """
                INSERT INTO geo_blocks (geo_name, state_name, district_name, db_name, geojson)
                VALUES %s
                ON CONFLICT DO NOTHING
                """,
                rows,
                page_size=200,
            )
            print(f"[info] Inserted {cur.rowcount} rows into geo_blocks")

    conn.close()
    print("[done]")


if __name__ == "__main__":
    main()
