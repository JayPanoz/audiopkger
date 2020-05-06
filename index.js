const minimist = require("minimist");
const error = require("./utils/console/error");
const messenger = require("./data/messages");

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  
  let cmd = args._[0] || "help";

  if (args.version || args.v) {
    cmd = "version";
  }

  if (args.help || args.h) {
    cmd = "help";
  }

  switch (cmd) {
    case "help":
      require("./cmds/help")();
      break;
    case "init":
      require("./cmds/init")();
      break;
    case "package":
      require("./cmds/package")(args);
      break;
    case "toc":
      require("./cmds/toc")();
      break;
    case "version":
      require("./cmds/version")();
      break;
    default:
      error(messenger().error.cmd(cmd), true);
      break;
  }
}