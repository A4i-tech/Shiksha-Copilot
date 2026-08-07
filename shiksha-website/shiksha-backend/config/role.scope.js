const ROLE_SCOPE_TYPES = Object.freeze(["GLOBAL", "STATE", "ZONE", "DISTRICT", "BLOCK", "SCHOOL", "UNBOUND"]);
const ORGANISATION_SCOPE_TYPES = Object.freeze(ROLE_SCOPE_TYPES.filter((scopeType) => scopeType !== "UNBOUND"));
const REGION_SCOPE_FIELDS = Object.freeze({
  STATE: ["state"],
  ZONE: ["state", "zone"],
  DISTRICT: ["state", "zone", "district"],
  BLOCK: ["state", "zone", "district", "block"],
});

module.exports = { ROLE_SCOPE_TYPES, ORGANISATION_SCOPE_TYPES, REGION_SCOPE_FIELDS };
