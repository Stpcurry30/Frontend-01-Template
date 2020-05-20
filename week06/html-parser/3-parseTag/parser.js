const EOF = Symbol("EOF"); // End Of File
let currentToken = null;

function data(char) {
  if (char == "<") {
    return tagOpen;
  } else if (char == EOF) {
    return;
  } else {
    return data;
  }
}

function tagOpen(char) {
  if (char == "/") {
    return endTagOpen;
  } else if (char.match(/^[a-zA-Z]$/)) {
    return tagName(char);
  } else {
    return;
  }
}

function endTagOpen(char) {
  if (char == ">") {
    return data;
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(char);
  } else if (char == EOF) {
  } else {
  }
}

function tagName(char) {
  if (char.match(/^[\t\f\n ]$/)) {
    return beforeAttributeName;
  } else if (char === "/") {
    return selfClosingStartTag;
  } else if (char.match(/^[a-zA-Z]$/)) {
    return tagName;
  } else if (char === ">") {
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(char) {
  if (char.match(/^[\t\f\n ]$/)) {
    return beforeAttributeName;
  } else if (char == ">") {
    return data;
  } else if (char == "=") {
    return beforeAttributeName;
  } else {
    return beforeAttributeName;
  }
}

function selfClosingStartTag(char) {
  if (char == ">") {
    currentToken.isSelfClosingTag = true;
    return data;
  } else if (char == EOF) {
  } else {
  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data;
  for (let char of html) {
    state = state(char);
  }
  state = state(EOF);
};
