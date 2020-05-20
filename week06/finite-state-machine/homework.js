/**
 * abababx
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
    return toA3;
  } else {
    return start(char);
  }
}

function toA3(char) {
  if (char === "a") {
    return toB3;
  } else {
    return start(char);
  }
}

function toB3(char) {
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
    return toB(char);
  }
}

function end() {
  return end;
}

console.log(match("abababx"));
