const esbuild = require("esbuild");
const args = process.argv.slice(2);

const options = {
  entryPoints: ["app/javascript/*.*"],
  outdir: "app/assets/builds",
  bundle: true,
  sourcemap: true,
  publicPath: "/assets",
  loader: { ".js": "jsx" },
};

async function main() {
  if (args.includes("--watch")) {
    const instance = await esbuild.context(options);

    await instance.watch();

    console.log("watching...");
  } else {
    await esbuild.build(options);

    process.exit(0);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
