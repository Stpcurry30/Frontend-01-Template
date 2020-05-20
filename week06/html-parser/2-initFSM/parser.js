const EOF = Symbol("EOF"); // End Of File

function data(char) {}

module.exports.parseHTML = function parseHTML() {
  let state = data;
  for (let char of html) {
    state = state(char);
  }
  state = state(EOF);
};
