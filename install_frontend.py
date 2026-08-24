import subprocess
import os
import sys

frontend_dir = os.path.abspath("frontend")
npm_cli = r"C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js"

# Try registry with retries
cmd = [
    "node", npm_cli, "install",
    "--registry=https://registry.npmjs.org/",
    "--fetch-retries=5",
    "--fetch-retry-mintimeout=5000",
    "--no-audit",
    "--no-fund"
]

print(f"Running npm install with retries...", flush=True)
res = subprocess.run(cmd, cwd=frontend_dir, stdin=subprocess.DEVNULL, capture_output=True, text=True)

print("Return code:", res.returncode)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)

if res.returncode != 0:
    print("Trying backup mirror registry...", flush=True)
    cmd2 = [
        "node", npm_cli, "install",
        "--registry=https://registry.npmmirror.com",
        "--no-audit",
        "--no-fund"
    ]
    res2 = subprocess.run(cmd2, cwd=frontend_dir, stdin=subprocess.DEVNULL, capture_output=True, text=True)
    print("Mirror Return code:", res2.returncode)
    print("Mirror STDOUT:", res2.stdout)
    print("Mirror STDERR:", res2.stderr)
