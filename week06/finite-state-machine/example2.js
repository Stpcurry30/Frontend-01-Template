/**
 * 课堂例子abcabcabx
 */

function match(str) {
  let state = start;
  for (let char of str) {
    state = state(char);
  }
  return state === end;
}

function start(char) {
  if (char === "a") {
    return toB;
  } else {
    return start;
  }
}

function toB(char) {
  if (char === "b") {
    return toC;
  } else {
    return start(char);
  }
}

function toC(char) {
  if (char === "c") {
    return toA2;
  } else {
    return start(char);
  }
}

function toA2(char) {
  if (char === "a") {
    return toB2;
  } else {
    return start(char);
  }
}

function toB2(char) {
  if (char === "b") {
    return toX;
  } else {
    return start(char);
  }
}

function toX(char) {
  if (char === "x") {
    return end;
  } else {
    return toC(char);
  }
}

function end() {
  return end;
}

console.log(match("abcabcabx"));
