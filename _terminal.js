import * as GG from "./node_modules/xterm/lib/xterm.js";

var head = document.getElementsByTagName("HEAD")[0];
var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "./node_modules/xterm/css/xterm.css";
head.appendChild(link);

// https://github.com/xtermjs/xterm.js/blob/master/demo/client.ts
// https://github.com/xtermjs/xtermjs.org/blob/master/js/demo.js#:~:text=var-,commands,-%3D%20%7B
const terminal = document.getElementById("terminal");
if (terminal.childNodes.length === 0) {
  var term = new Terminal();
  term.open(terminal);
  term.write("Node $ ");
  term.focus();
  term.prompt = () => {
    command = "";
    term.write("\r\n> ");
  };
  const commands = {};
  console.log("Yes in file", GG);
  console.log(term.onData);
  var command = "";
  function runCommand(term, text) {
    console.log("Got command:", text);
    // const command = text.trim().split(" ")[0];
    // if (command.length > 0) {
    //   term.writeln("");
    //   if (command in commands) {
    //     commands[command].f();
    //     return;
    //   }
    //   term.writeln(`${command}: command not found`);
    // }
    let output = "";
    try {
      const fn = new Function("return " + text);
      output = fn().toString();
    } catch (e) {
      output = e.toString();
    }
    term.write("\r\n");
    term.writeln(output);
    term.prompt();
  }

  // term.onKey((e) => {
  //   const ev = e.domEvent;
  //   const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

  //   if (ev.keyCode === 13) {
  //     term.prompt();
  //   } else if (ev.keyCode === 8) {
  //     // Do not delete the prompt
  //     if (term._core.buffer.x > 2) {
  //       term.write("\b \b");
  //     }
  //   } else if (printable) {
  //     term.write(e.key);
  //   }
  // });
  term.onData((e) => {
    switch (e) {
      case "\u0003": // Ctrl+C
        term.write("^C");
        prompt(term);
        break;
      case "\r": // Enter
        runCommand(term, command);
        command = "";
        break;
      case "\u007F": // Backspace (DEL)
        // Do not delete the prompt
        if (term._core.buffer.x > 2) {
          term.write("\b \b");
          if (command.length > 0) {
            command = command.substr(0, command.length - 1);
          }
        }
        break;
      default: // Print all other characters for demo
        if (
          (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) ||
          e >= "\u00a0"
        ) {
          command += e;
          term.write(e);
        }
    }
  });
}
