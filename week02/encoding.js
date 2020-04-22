function str2utf8(strList = "") {
  let st = "";
  let resultArr = [];
  for (let item of strList) {
    // console.log(item.toString().codePointAt(0));
    st = item.toString().codePointAt(0);
    if (st <= 128) {
      st = "0" + st.toString(2);
      let re = "\\x" + bin2hex(st);
      resultArr.push(re);
    } else if (128 < st && st <= 2048) {
      st = st.toString(2);
      let st1 = "110" + st.substr(0, 5);
      let st2 = "10" + st.substr(5);
      let re1 = "\\x" + bin2hex(st1);
      let re2 = "\\x" + bin2hex(st2);
      resultArr = resultArr.concat([re1, re2]);
    } else if (2048 < st && st < 63488) {
      st = st.toString(2);
      let st1 = "1110" + st.substr(0, 4);
      let st2 = "10" + st.substr(4, 9);
      let st3 = "10" + st.substr(9);
      let re1 = "\\x" + bin2hex(st1);
      let re2 = "\\x" + bin2hex(st2);
      let re3 = "\\x" + bin2hex(st3);
      console.log("re1:" + re1);
      console.log("re2:" + re2);
      console.log("re3:" + re3);
    } else {
      st = st.toString(2);
      let st1 = "11110" + st.substr(0, 3);
      let st2 = "10" + st.substr(3, 8);
      let st3 = "10" + st.substr(8, 14);
      let st4 = "10" + st.substr(14);
      let re1 = "\\x" + bin2hex(st1);
      let re2 = "\\x" + bin2hex(st2);
      let re3 = "\\x" + bin2hex(st3);
      let re4 = "\\x" + bin2hex(st4);
      resultArr = resultArr.concat([re1, re2, re3, re4]);
    }
  }
  console.log(resultArr.join(""));
}
function bin2hex(str) {
  let hex_array = [
    { key: 0, val: "0000" },
    { key: 1, val: "0001" },
    { key: 2, val: "0010" },
    { key: 3, val: "0011" },
    { key: 4, val: "0100" },
    { key: 5, val: "0101" },
    { key: 6, val: "0110" },
    { key: 7, val: "0111" },
    { key: 8, val: "1000" },
    { key: 9, val: "1001" },
    { key: "a", val: "1010" },
    { key: "b", val: "1011" },
    { key: "c", val: "1100" },
    { key: "d", val: "1101" },
    { key: "e", val: "1110" },
    { key: "f", val: "1111" },
  ];
  let value = "";
  let list = [];
  if (str.length % 4 !== 0) {
    let a = "0000";
    let b = a.substring(0, 4 - (str.length % 4));
    str = b.concat(str);
  }
  while (str.length > 4) {
    list.push(str.substring(0, 4));
    str = str.substring(4);
  }
  list.push(str);
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < hex_array.length; j++) {
      if (list[i] == hex_array[j].val) {
        value = value.concat(hex_array[j].key);
        break;
      }
    }
  }
  return value;
}
str2utf8("winter is comming");
