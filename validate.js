import https from "https";

const CONTROL_PLANE_URL =
  "https://raw.githubusercontent.com/Wynergy-Fibre-Solutions/wfsl-control-plane/main/governance/repo-classification.json";

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(JSON.parse(data)));
      })
      .on("error", reject);
  });
}

async function run() {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] || "local-run";
  const registry = await fetchJSON(CONTROL_PLANE_URL);

  const classification = registry.repos[repo];

  console.log("WFSL Repo Validator");
  console.log("------------------");
  console.log("Repo:", repo);

  if (!classification) {
    console.log("Status: FAIL");
    console.log("Reason: Repo not declared in control plane");
    process.exit(1);
  }

  console.log("Declared class:", classification);
  console.log("Status: PASS");
}

run().catch((err) => {
  console.error("Validator error:", err.message);
  process.exit(1);
});
