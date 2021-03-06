const EOF = Symbol("EOF"); // End Of File
let currentToken = null,
  currentAttribute = null;
// 默认父元素
let stack = [{ type: "document", children: [] }];
let currentTextNode, element;

function emit(token) {
  // 父级元素
  let top = stack[stack.length - 1];
  if (token.type == "startTag") {
    element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let n in token) {
      // 遍历设置属性
      if (n != "type" && n != "tagName") {
        element.attributes.push({ name: n, value: token[n] });
      }
    }
    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("tag start & tag end doesn't match ");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
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
    emit({ type: "text", content: char });
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
    return afterAttributeName(char);
  } else if (char == "=") {
    return beforeAttributeValue;
  } else if (char == '"' || char == "'" || char == "<") {
  } else if (char == "\u0000") {
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
    return unQuoteAttributeValue(char);
  }
}

function afterAttributeName(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (char == "/") {
    return selfClosingStartTag;
  } else if (char == "=") {
    return beforeAttributeValue;
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char == EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName;
  }
}

function doubleQuoteAttributeValue(char) {
  if (char == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (char == "\u0000") {
  } else if (char == EOF) {
  } else {
    currentAttribute.value += char;
    return doubleQuoteAttributeValue;
  }
}
function singleQuoteAttributeValue(char) {
  if (char == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuoteAttributeValue;
  } else if (char == "\u0000") {
  } else if (char == EOF) {
  } else {
    currentAttribute.value += char;
    return doubleQuoteAttributeValue;
  }
}
function unQuoteAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (char == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char == "\u0000") {
  } else if (char == '"' || char == "'" || char == "<" || char == "=" || char == "`") {
  } else if (char == EOF) {
  } else {
    currentAttribute.value += char;
    return unQuoteAttributeValue;
  }
}

function afterQuoteAttributeValue(char) {
  if (char.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (char == "/") {
    return selfClosingStartTag;
  } else if (char == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (char == EOF) {
  } else {
    currentAttribute.value += char;
    return doubleQuoteAttributeValue;
  }
}

function selfClosingStartTag(char) {
  if (char == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
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
  return stack[0];
};
