/**
 * 课堂例子1
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
    return end;
  } else {
    return start(char);
  }
}

function end(char) {
  return end;
}

console.log(match("i am a aabc what?"));
