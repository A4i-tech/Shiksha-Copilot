const fs = require("fs");
const angularJson = JSON.parse(fs.readFileSync("angular.json"));
const outputPath = angularJson.projects["shiksha-frontend"].architect.build.options.outputPath;

const healthPath = `${outputPath}/health.json`;
const health = JSON.parse(fs.readFileSync(healthPath));
health.build = process.env.SHIKSHA_COPILOT_BUILD || null;
fs.writeFileSync(healthPath, JSON.stringify(health, null, 2));