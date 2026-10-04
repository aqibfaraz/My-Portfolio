const fs = require("fs");
const path = require("path");

const buildDir = path.resolve(__dirname, "..", "build");
const indexPath = path.join(buildDir, "index.html");

const routes = [
	{
		path: "blog",
		title: "Web Development Blog & Case Studies | Aqib Faraz",
		description: "Read web development guides and explore React, MERN, Python automation and digital experience case studies by Aqib Faraz.",
		type: "website",
	},
	{
		path: "blog/notes/mern-stack-guide",
		title: "How to Build a Full-Stack App with MERN Stack | Aqib Faraz",
		description: "A practical guide to building production-ready full-stack applications with MongoDB, Express, React and Node.js.",
		type: "article",
	},
	{
		path: "blog/notes/python-web-scraping",
		title: "Python Web Scraping with Selenium & BeautifulSoup | Aqib Faraz",
		description: "Learn automated data extraction with Python, Selenium WebDriver and BeautifulSoup4 in this practical tutorial.",
		type: "article",
	},
	{
		path: "blog/notes/flutter-vs-react-native",
		title: "Flutter vs React Native: Which to Choose? | Aqib Faraz",
		description: "A practical comparison of Flutter and React Native for modern cross-platform mobile app development.",
		type: "article",
	},
	{
		path: "blog/validsoft-web-development",
		title: "ValidSoft Web Development Case Study | Aqib Faraz",
		description: "Explore a digital experience for ValidSoft covering voice AI, identity security, voice biometrics and deepfake detection.",
		type: "article",
	},
	{
		path: "blog/unilock-web-development",
		title: "Unilock Web Development Case Study | Aqib Faraz",
		description: "Explore the web development work behind a product-focused digital experience for Unilock.",
		type: "article",
	},
	{
		path: "blog/socan-web-development",
		title: "SOCAN Web Development Case Study | Aqib Faraz",
		description: "Explore the web development work behind a clear, accessible digital experience for SOCAN.",
		type: "article",
 	},
];

if (!fs.existsSync(buildDir) || !fs.existsSync(indexPath)) {
	console.warn("postbuild skipped: build/index.html not found");
	process.exit(0);
}

const sourceHtml = fs.readFileSync(indexPath, "utf8");

function escapeHtmlAttribute(value) {
	return String(value)
		.replaceAll("&", "&amp;")
		.replaceAll("\"", "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function rewriteRelativeAssets(html, prefix) {
	return html.replace(/(src|href)="(?!https?:|#|\/|data:|mailto:)([^"]+)"/g, (_match, attribute, value) => {
		const rewritten = `${prefix}${value}`.replace(/\/\.\//g, "/");
		return `${attribute}="${rewritten}"`;
	});
}

const fallbackHtml = rewriteRelativeAssets(sourceHtml, "/");
fs.writeFileSync(path.join(buildDir, "404.html"), fallbackHtml);

for (const route of routes) {
	const routeDir = path.join(buildDir, route.path);
	const prefix = "../".repeat(route.path.split("/").length);
	const canonical = `https://aqibfaraz.dev/${route.path}/`;
	const safeTitle = escapeHtmlAttribute(route.title);
	const safeDescription = escapeHtmlAttribute(route.description);
	const safeCanonical = escapeHtmlAttribute(canonical);
	const safeType = escapeHtmlAttribute(route.type);
	const routeHtml = sourceHtml
		.replace(/<title>[^<]*<\/title>/, `<title>${safeTitle}</title>`)
		.replace(/(<meta name="description" content=")[^"]*(")/, `$1${safeDescription}$2`)
		.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${safeCanonical}$2`)
		.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${safeType}$2`)
		.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${safeTitle}$2`)
		.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${safeDescription}$2`)
		.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${safeCanonical}$2`)
		.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${safeTitle}$2`)
		.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${safeDescription}$2`);
	const routeHtmlWithAssets = rewriteRelativeAssets(routeHtml, prefix);
	fs.mkdirSync(routeDir, { recursive: true });
	fs.writeFileSync(path.join(routeDir, "index.html"), routeHtmlWithAssets);
}
