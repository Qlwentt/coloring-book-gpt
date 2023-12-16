const esbuild = require("esbuild");
require("dotenv").config();
const args = process.argv.slice(2);

const options = {
  entryPoints: ["app/javascript/*.*"],
  outdir: "app/assets/builds",
  bundle: true,
  sourcemap: true,
  publicPath: "/assets",
  loader: { ".js": "jsx" },
  define: {
    "process.env.API_URL": JSON.stringify(process.env.API_URL),
  },
};

async function main() {
  if (args.includes("--watch")) {
    const instance = await esbuild.context(options);

    await instance.watch();

    console.log("watching...");
  } else {
    await esbuild.build(options);

    exit(0);
  }
}
main().catch((e) => {
  console.error(e);
  exit(1);
});
