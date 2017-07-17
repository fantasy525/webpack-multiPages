var template = require('art-template/lib/template-web');
var html = template("demo", { name: "ZZZZ" });
document.getElementById("list").innerHTML = html;
