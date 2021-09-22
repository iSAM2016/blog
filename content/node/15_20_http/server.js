let http = require("http");

let server = http.createServer((res, req) => {
  let arr = [];
  req.on("data", data => {
    arr.push(data);
  });
  req.on("end", params => {
    let r = Buffer.concat(arr).toString();
    if (req.headersSent["content-type"] == "x-www-form-urlencoded") {
      let querystring = require("querystring");
      console.log(querystring.parse(r));
    } else if (req.headers["content-type"] === "application/json") {
      console.log(JSON.parse(r));
    } else {
      console.log(r);
    }
    req("饿死了");
  });
});

server.listen(3000);
