const EOF = Symbol("EOF"); // End Of File
let currentToken = null,
  currentAttribute = null;

function emit(token) {
  // if (token.type != "text") {
  console.log(token);
  // }
}

function data(char) {
  if (char == "<") {
    return tagOpen;
  } else if (char == EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: char });
    return data;
  }
}

function tagOpen(char) {
  if (char == "/") {
    return endTagOpen;
  } else if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(char);
  } else {
    return;
  }
}

function endTagOpen(char) {
  if (char.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(char);
  } else if (char == ">") {
    // return data;
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
    currentToken.tagName += char;
    return tagName;
  } else if (char === ">") {
    emit(currentToken);
    return data;
  } else {
    return tagName;
  }
}

function beforeAttributeName(char) {
  if (char.match(/^[\t\f\n ]$/)) {
    return beforeAttributeName;
  } else if (char == "/" || char == ">" || char == EOF) {
    // emit(currentToken);
    // return data;
    return afterAttributeName(char);
  } else if (char == "=") {
    // return beforeAttributeName;
  } else {
    // return beforeAttributeName;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(char);
  }
}

function attributeName(char) {
  if (char.match(/^[\t\f\n ]$/) || char === "/" || char == ">" || char == EOF) {
    return afterAttributeName;
  } else if (char == "=") {
    return beforeAttributeValue;
  } else if (char == '"' || char == "'" || char == "<") {
  } else {
    currentAttribute.name += char;
    return attributeName;
  }
}

function beforeAttributeValue(char) {
  if (char.match(/^[\t\f\n ]$/) || char === "/" || char == ">" || char == EOF) {
    return beforeAttributeValue;
  } else if (char == '"') {
    return doubleQuoteAttributeValue;
  } else if (char == "'") {
    return singleQuoteAttributeValue;
  } else {
    return unQuoteAttributeValue;
  }
}

function afterAttributeName(char) {}

function doubleQuoteAttributeValue() {}
function singleQuoteAttributeValue() {}
function unQuoteAttributeValue() {}

function selfClosingStartTag(char) {
  if (char == ">") {
    currentToken.isSelfClosing = true;
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
