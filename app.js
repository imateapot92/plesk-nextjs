#!/usr/bin/env node
"use strict";
const _log = _interop_require_wildcard(require("./node_modules/next/dist/build/output/log"));
const _index = _interop_require_default(require("./node_modules/next/dist/compiled/arg/index.js"));
const _constants = require("./node_modules/next/dist/lib/constants");
const _commands = require("./node_modules/next/dist/lib/commands");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop??false);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
[
    "react",
    "react-dom"
].forEach((dependency)=>{
    try {
        // When 'npm link' is used it checks the clone location. Not the project.
        require.resolve(dependency);
    } catch (err) {
        console.warn(`The module '${dependency}' was not found. Next.js requires that you include it in 'dependencies' of your 'package.json'. To add it, run 'npm install ${dependency}'`);
    }
});
const defaultCommand = "start";
const args = (0, _index.default)({
    // Types
    "--version": Boolean,
    "--help": Boolean,
    "--inspect": Boolean,
    // Aliases
    "-v": "--version",
    "-h": "--help"
}, {
    permissive: true
});
// Version is inlined into the file using taskr build pipeline
if (args["--version"]) {
    console.log(`Next.js v${"13.4.1"}`);
    process.exit(0);
}
// Check if we are running `next <subcommand>` or `next`
const foundCommand = Boolean(_commands.commands[args._[0]]);
// Makes sure the `next --help` case is covered
// This help message is only showed for `next --help`
// `next <subcommand> --help` falls through to be handled later
if (!foundCommand && args["--help"]) {
    console.log(`
    Usage
      $ next <command>

    Available commands
      ${Object.keys(_commands.commands).join(", ")}

    Options
      --version, -v   Version number
      --help, -h      Displays this message

    For more information run a command with the --help flag
      $ next build --help
  `);
    process.exit(0);
}
const command = foundCommand ? args._[0] : defaultCommand;
const forwardedArgs = foundCommand ? args._.slice(1) : args._;
if (args["--inspect"]) throw new Error(`--inspect flag is deprecated. Use env variable NODE_OPTIONS instead: NODE_OPTIONS='--inspect' next ${command}`);
// Make sure the `next <subcommand> --help` case is covered
if (args["--help"]) {
    forwardedArgs.push("--help");
}
const defaultEnv = command === "dev" ? "development" : "production";
const standardEnv = [
    "production",
    "development",
    "test"
];
if (process.env.NODE_ENV) {
    const isNotStandard = !standardEnv.includes(process.env.NODE_ENV);
    const shouldWarnCommands = process.env.NODE_ENV === "development" ? [
        "start",
        "build"
    ] : process.env.NODE_ENV === "production" ? [
        "dev"
    ] : [];
    if (isNotStandard || shouldWarnCommands.includes(command)) {
        _log.warn(_constants.NON_STANDARD_NODE_ENV);
    }
}
process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv;
process.env.NEXT_RUNTIME = "nodejs";
// x-ref: https://github.com/vercel/next.js/pull/34688#issuecomment-1047994505
if (process.versions.pnp === "3") {
    const nodeVersionParts = process.versions.node.split(".").map((v)=>Number(v));
    if (nodeVersionParts[0] < 16 || nodeVersionParts[0] === 16 && nodeVersionParts[1] < 14) {
        _log.warn("Node.js 16.14+ is required for Yarn PnP 3.20+. More info: https://github.com/vercel/next.js/pull/34688#issuecomment-1047994505");
    }
}
// Make sure commands gracefully respect termination signals (e.g. from Docker)
// Allow the graceful termination to be manually configurable
if (!process.env.NEXT_MANUAL_SIG_HANDLE && command !== "dev") {
    process.on("SIGTERM", ()=>process.exit(0));
    process.on("SIGINT", ()=>process.exit(0));
}
_commands.commands[command]().then((exec)=>exec(forwardedArgs)).then(()=>{
    if (command === "build") {
        // ensure process exits after build completes so open handles/connections
        // don't cause process to hang
        process.exit(0);
    }
});

//# sourceMappingURL=next.map
