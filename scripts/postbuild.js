const fs = require("fs");
const path = require("path");

const buildDir = path.resolve(__dirname, "..", "build");
const indexPath = path.join(buildDir, "index.html");

fs.copyFileSync(indexPath, path.join(buildDir, "404.html"));

const routePaths = [
	"blog",
	"blog/notes/mern-stack-guide",
	"blog/notes/python-web-scraping",
	"blog/notes/flutter-vs-react-native",
	"blog/validsoft-web-development",
	"blog/unilock-web-development",
	"blog/socan-web-development",
];

const sourceHtml = fs.readFileSync(indexPath, "utf8");

function rewriteRelativeAssets(html, prefix) {
	return html.replace(/(src|href)="(?!https?:|#|\/|data:|mailto:)([^"]+)"/g, (_match, attribute, value) => {
		return `${attribute}="${prefix}${value}"`;
	});
}

for (const routePath of routePaths) {
	const routeDir = path.join(buildDir, routePath);
	const prefix = "../".repeat(routePath.split("/").length);
	fs.mkdirSync(routeDir, { recursive: true });
	fs.writeFileSync(path.join(routeDir, "index.html"), rewriteRelativeAssets(sourceHtml, prefix));
}
