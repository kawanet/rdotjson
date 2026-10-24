// get-string.js

exports.getString = getString;

function getString(item) {
  const buffer = [];
  const nodeLength = item.childNodes && item.childNodes.length;
  const edgeSpace = (nodeLength > 1) ? " " : "";
  const unescapeMap = {"\\n": "\n", "\\t": "\t"};

  parseNodes(item.childNodes, false);

  return buffer.join("");

  function parseNodes(nodes, isCDATA) {
    if (!nodes) return;

    [].forEach.call(nodes, function(node) {
      if (node.type === "cdata") {
        isCDATA = true;
      }

      if (node.type !== "text") {
        parseNodes(node.childNodes, isCDATA);
        return;
      }

      let val = node.data;
      let quoted;

      if (isCDATA) {
        // trim left leading spaces
        val = val.replace(/^[ \t\n\r\f\v]+/, edgeSpace);

        // trim right trailing spaces
        val = val.replace(/[ \t\n\r\f\v]+$/, edgeSpace);

        // unescape
        val = val.replace(/(\\u[0-9a-fA-F]{4}|\\.)/g, unescape);
      } else {
        const sp = val.split(/(\\u[0-9a-fA-F]{4}|\\.|")/);
        const last = sp.length - 1;
        val = sp.map(function(str, idx) {
          if (str === '"') {
            quoted = !quoted;
            str = ""; // ignore double-quote character
          } else if (str[0] === "\\") {
            str = unescape(str);
          } else if (!quoted) {
            // trim left leading spaces
            if (idx === 0) {
              str = str.replace(/^[ \t\n\r\f\v]+/, edgeSpace);
            }

            // fold intermediate spaces
            str = str.replace(/[ \t\n\r\f\v]+/g, " ");

            // trim right trailing spaces
            if (idx === last) {
              str = str.replace(/[ \t\n\r\f\v]+$/, edgeSpace);
            }
          }
          return str;
        }).join("");
      }

      buffer.push(val);
    });
  }

  // \n and \t, \uXXXX as the character, any other \X as X
  function unescape(str) {
    if (unescapeMap[str]) return unescapeMap[str];
    if (str.length === 6 && str[1] === "u") return String.fromCharCode(parseInt(str.substr(2), 16));
    return str[1] || "";
  }
}
