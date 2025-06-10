import {SimpleFsDeno} from "../simple_fs_deno/mod.ts";

const name = "AljoschaMeyer.github.io";
const pagesBranch = "master";
const srcBranch = "macros";
const tmpDir = ".tmp_dir_website_publishing_script";

const fs = new SimpleFsDeno("..");

await run("deno", ["task", "build"]);
fs.copySync(`${name}/build`, tmpDir, "assertive");
fs.ensureNotSync(`${tmpDir}/.git`);
await run("git", ["checkout", pagesBranch]);

for (const file of fs.lsSync(name)) {
    if (file !== ".git") {
        fs.removeSync(`${name}/${file}`);
    }
}

for (const file of fs.lsSync(tmpDir)) {
    if (file !== ".git") {
        fs.moveSync(`${tmpDir}/${file}`, `${name}/${file}`);
    }
}

fs.removeSync(tmpDir);

await run("git", ["add", "-A"]);
await run("git", ["commit", "-am",  "Publish changes"]);
await run("git", ["push"]);
await run("git", ["checkout", srcBranch]);

async function run(cmd: string, args: string[]) {
    const child = new Deno.Command(cmd, {"args": args}).spawn();
    const status = await child.status;

    if (!status.success) {
        throw [cmd, args, status];
    }
}