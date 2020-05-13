const http = require("http");

const server = http.createServer((req, res) => {
  console.log("request received!");
  console.log(req.headers);
  res.setHeader("Content-type", "application/json");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});
server.listen(8086);
