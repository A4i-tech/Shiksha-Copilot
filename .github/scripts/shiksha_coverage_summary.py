import json
import os
import sys

def find_file(root_dir, filename):
    """Recursively find a file in a directory."""
    for dirpath, _, filenames in os.walk(root_dir):
        if filename in filenames:
            return os.path.join(dirpath, filename)
    return None

def extract_python_coverage(coverage_dir):
    """Extract coverage data from Python (pytest-cov) JSON report."""
    json_file = os.path.join(coverage_dir, 'coverage.json')
    if not os.path.exists(json_file):
        json_file = find_file(coverage_dir, 'coverage.json')

    if json_file and os.path.exists(json_file):
        try:
            with open(json_file, 'r') as f:
                data = json.load(f)
            return {
                'lines': round(data['totals']['percent_covered'], 1),
                'statements': round(data['totals']['percent_covered'], 1),
                'functions': 0,
                'branches': round(data['totals']['percent_covered'], 1)
            }
        except Exception:
            return None
    return None

def extract_node_coverage(coverage_dir):
    """Extract coverage data from Node.js (Jest) JSON summary report."""
    potential_files = [
        os.path.join(coverage_dir, 'coverage-summary.json'),
        os.path.join(coverage_dir, 'coverage', 'coverage-summary.json'),
    ]

    summary_file = next((f for f in potential_files if os.path.exists(f)), None)
    if not summary_file:
        summary_file = find_file(coverage_dir, 'coverage-summary.json')

    if summary_file and os.path.exists(summary_file):
        try:
            with open(summary_file, 'r') as f:
                data = json.load(f)
            total = data.get('total', {})
            return {
                'lines': round(total.get('lines', {}).get('pct', 0), 1),
                'statements': round(total.get('statements', {}).get('pct', 0), 1),
                'functions': round(total.get('functions', {}).get('pct', 0), 1),
                'branches': round(total.get('branches', {}).get('pct', 0), 1)
            }
        except Exception:
            return None
    return None

# Services configuration
services = {
    'shiksha-api/app-service': {
        'type': 'python',
        'display_name': 'Shiksha API (App Service)',
        'paths': ['coverage-artifacts/api', 'shiksha-api/app-service']
    },
    'shiksha-backend': {
        'type': 'node',
        'display_name': 'Shiksha Backend',
        'paths': ['coverage-artifacts/backend', 'shiksha-website/shiksha-backend']
    }
}

coverage_data = {}

for service, config in services.items():
    coverage = None
    for search_root in config['paths']:
        if os.path.exists(search_root):
            if config['type'] == 'python':
                coverage = extract_python_coverage(search_root)
            else:
                coverage = extract_node_coverage(search_root)
            if coverage:
                break

    if coverage:
        coverage_data[service] = {
            'coverage': coverage,
            'display_name': config['display_name']
        }

# Generate markdown report
report = "## 📊 Shiksha Services - Test Coverage Report\n\n"

if not coverage_data:
    report += "⚠️ **No coverage data found**\n\n"
    report += "Ensure CI workflows completed successfully and uploaded coverage artifacts.\n"
else:
    report += f"**Services with coverage: {len(coverage_data)}/{len(services)}**\n\n"
    report += "| Service | Lines | Statements | Functions | Branches | Status |\n"
    report += "|---------|-------|------------|-----------|----------|--------|\n"

    for service, data in coverage_data.items():
        cov = data['coverage']
        name = data['display_name']

        status = ("🟢 Excellent" if cov['lines'] >= 80 else
                 "🟡 Good" if cov['lines'] >= 60 else
                 "🟠 Fair" if cov['lines'] >= 40 else "🔴 Needs Work")

        func_str = f"{cov['functions']}%" if cov['functions'] > 0 else "N/A"
        branch_str = f"{cov['branches']}%" if cov['branches'] > 0 else "N/A"

        report += f"| {name} | {cov['lines']}% | {cov['statements']}% | {func_str} | {branch_str} | {status} |\n"

    for service, config in services.items():
        if service not in coverage_data:
            report += f"| {config['display_name']} | No data | No data | No data | No data | ⚫ Not Available |\n"

    report += "\n### 📈 Detailed Coverage Breakdown\n\n"
    for service, data in coverage_data.items():
        cov = data['coverage']
        report += f"#### {data['display_name']}\n\n"
        report += f"- **Lines:** {cov['lines']}%\n"
        report += f"- **Statements:** {cov['statements']}%\n"
        if cov['functions'] > 0:
            report += f"- **Functions:** {cov['functions']}%\n"
        if cov['branches'] > 0:
            report += f"- **Branches:** {cov['branches']}%\n"
        report += "\n"

report += "---\n*📌 Coverage badges update on main branch | 🔗 View HTML reports in workflow artifacts*\n"

# Write report to file
with open('shiksha_coverage_report.md', 'w') as f:
    f.write(report)

# Write outputs for GitHub Actions
if output_file := os.environ.get('GITHUB_OUTPUT'):
    with open(output_file, 'a') as f:
        f.write(f"services_tested={len(coverage_data)}\n")
        f.write(f"total_services={len(services)}\n")
        for service, data in coverage_data.items():
            key = service.replace('/', '_').replace('-', '_')
            f.write(f"{key}_coverage={data['coverage']['lines']}\n")

# Exit with appropriate status
sys.exit(0 if coverage_data else 1)
