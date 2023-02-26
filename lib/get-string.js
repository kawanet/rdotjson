// get-string.js

exports.getString = getString;

function getString(item) {
  const buffer = [];
  const nodeLength = item.childNodes && item.childNodes.length;
  const edgeSpace = (nodeLength > 1) ? " " : "";
  const unescapeMap = {"\\n": "\n"};

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
        val = val.replace(/^\s+/, edgeSpace);

        // trim right trailing spaces
        val = val.replace(/\s+$/, edgeSpace);

        // unescape
        val = val.replace(/(\\.)/g, function(match) {
          return unescapeMap[match] || match[1] || "";
        });
      } else {
        const sp = val.split(/(\\.|")/);
        const last = sp.length - 1;
        val = sp.map(function(str, idx) {
          if (str === '"') {
            quoted = !quoted;
            str = ""; // ignore double-quote character
          } else if (unescapeMap[str]) {
            str = unescapeMap[str]; // unescape
          } else if (str[0] === "\\") {
            str = str[1]; // unescape
          } else if (!quoted) {
            // trim left leading spaces
            if (idx === 0) {
              str = str.replace(/^\s+/, edgeSpace);
            }

            // fold intermediate spaces
            str = str.replace(/\s+/g, " ");

            // trim right trailing spaces
            if (idx === last) {
              str = str.replace(/\s+$/, edgeSpace);
            }
          }
          return str;
        }).join("");
      }

      buffer.push(val);
    });
  }
}
