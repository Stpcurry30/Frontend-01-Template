let iframe = document.createElement("iframe");

document.body.innerHTML = "";
document.body.appendChild(iframe);

function happend(ele, eve) {
  return new Promise((resolve, reject) => {
    function handler() {
      resolve();
      ele.removeEventListener(eve);
    }
    ele.addEventListener(eve, handler);
  });
}

iframe.src = "";

var lis = document.getElementById("container").children;

var result = [];

for (let li of lis) {
  if (li.getAttribute("data-tag").match(/css/))
    result.push({
      name: li.children[1].innerText,
      url: li.children[1].children[0].href,
    });
}
console.log(result);
