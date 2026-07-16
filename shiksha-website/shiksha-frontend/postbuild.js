const fs = require("fs");
const angularJson = JSON.parse(fs.readFileSync("angular.json"));
const outputPath = angularJson.projects["shiksha-frontend"].architect.build.options.outputPath;

const healthPath = `${outputPath}/health.json`;
const health = JSON.parse(fs.readFileSync(healthPath));
health.build = process.env.SHIKSHA_COPILOT_BUILD || null;
fs.writeFileSync(healthPath, JSON.stringify(health, null, 2));

fs.writeFileSync(`${outputPath}/staticwebapp.config.json`, JSON.stringify({
    routes: fs.readFileSync(`${outputPath}/_headers`, "utf8").trim().split(/\n\s*\n/).map(block => {
        const [route, ...headers] = block.split("\n");
        return {
            route,
            headers: Object.fromEntries(headers.map(header => {
                const [name, ...value] = header.trim().split(":");
                return [name, value.join(":").trim()];
            }))
        };
    })
}, null, 2));