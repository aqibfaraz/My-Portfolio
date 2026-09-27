const SITE_URL = "https://aqibfaraz.dev";
const DEFAULT_TITLE = "Custom CRM, Design, App & Web Development | Aqib Faraz";
const DEFAULT_DESCRIPTION = "Full-Stack Developer from Karachi specializing in MERN stack, React, Node.js, Python automation, Flutter and AI/ML. Available for remote freelance projects worldwide.";
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
  const canonicalUrl = `${SITE_URL}${path}`;
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:type", type);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("property", "og:image", DEFAULT_IMAGE);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", DEFAULT_IMAGE);

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
