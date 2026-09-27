const fs = require("fs");
const path = require("path");

const buildDir = path.resolve(__dirname, "..", "build");
const indexPath = path.join(buildDir, "index.html");

fs.copyFileSync(indexPath, path.join(buildDir, "404.html"));

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

const sourceHtml = fs.readFileSync(indexPath, "utf8");

function rewriteRelativeAssets(html, prefix) {
	return html.replace(/(src|href)="(?!https?:|#|\/|data:|mailto:)([^"]+)"/g, (_match, attribute, value) => {
		return `${attribute}="${prefix}${value}"`;
	});
}

for (const route of routes) {
	const routeDir = path.join(buildDir, route.path);
	const prefix = "../".repeat(route.path.split("/").length);
	const canonical = `https://aqibfaraz.dev/${route.path}/`;
	const routeHtml = sourceHtml
		.replace(/<title>[^<]*<\/title>/, `<title>${route.title}</title>`)
		.replace(/(<meta name="description" content=")[^"]*(")/, `$1${route.description}$2`)
		.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
		.replace(/(<meta property="og:type" content=")[^"]*(")/, `$1${route.type}$2`)
		.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${route.title}$2`)
		.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${route.description}$2`)
		.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
		.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${route.title}$2`)
		.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${route.description}$2`);
	const routeHtmlWithAssets = rewriteRelativeAssets(routeHtml, prefix);
	fs.mkdirSync(routeDir, { recursive: true });
	fs.writeFileSync(path.join(routeDir, "index.html"), routeHtmlWithAssets);
}
