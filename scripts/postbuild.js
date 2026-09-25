const fs = require("fs");
const path = require("path");

const buildDir = path.resolve(__dirname, "..", "build");
const blogDir = path.join(buildDir, "blog");
const indexPath = path.join(buildDir, "index.html");

fs.copyFileSync(indexPath, path.join(buildDir, "404.html"));
fs.mkdirSync(blogDir, { recursive: true });
const blogIndexPath = path.join(blogDir, "index.html");
const blogIndex = fs.readFileSync(indexPath, "utf8")
	.replace(/(src|href)="static\//g, '$1="../static/')
	.replace(/(src|href)="([^./][^"]*)"/g, '$1="../$2"');
fs.writeFileSync(blogIndexPath, blogIndex);
