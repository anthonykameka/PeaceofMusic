import React from "react";

import PropTypes from "prop-types";
const diff = require("diff");
window.diff = diff;

const styles = {
  added: {
    color: "green",
    backgroundColor: "#b5efdb",
    fontWeight: "bold"
  },
  removed: {
    color: "red",
    backgroundColor: "#fec4c0",
    fontWeight: "bold"
  }
};

const Diff = ({ string1 = "", string2 = "", mode = "characters" }) => {
  let groups = [];

  if (mode === "characters") groups = diff.diffChars(string1, string2);
  if (mode === "words") groups = diff.diffWords(string1, string2);

  const mappedNodes = groups.map(group => {
    const { value, added, removed } = group;
    let nodeStyles;
    if (added) nodeStyles = styles.added;
    if (removed) nodeStyles = styles.removed;
    return <span style={nodeStyles}>{value}</span>;
  });

  return <span>{mappedNodes}</span>;
};

Diff.propTypes = {
  string1: PropTypes.string,
  string2: PropTypes.string,
  mode: PropTypes.oneOf(["characters", "words"])
};

export default Diff;