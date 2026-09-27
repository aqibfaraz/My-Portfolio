const SITE_URL = "https://aqibfaraz.dev";
const DEFAULT_TITLE = "Aqib Faraz | Web, CRM, App & Automation Developer";
const DEFAULT_DESCRIPTION = "Aqib Faraz is a Karachi-based full-stack developer building websites, CRM systems, e-commerce platforms, mobile apps and automation solutions for clients worldwide.";
const DEFAULT_IMAGE = `${SITE_URL}/new%20projects.jpg`;

function setMeta(attribute, value, content) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function setPageMetadata({ title, description, path = "/", type = "website" }) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${normalizedPath}`;
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:type", type);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("property", "og:image", DEFAULT_IMAGE);
  setMeta("property", "og:image:alt", "Aqib Faraz - Full-Stack Developer");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", DEFAULT_IMAGE);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:image:alt", "Aqib Faraz - Full-Stack Developer");

  if (type === "article") {
    setMeta("property", "article:author", "Aqib Faraz");
  }

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

export function resetPageMetadata() {
  setPageMetadata({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION });
}
