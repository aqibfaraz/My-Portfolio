import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CASE_STUDIES from "./caseStudyData";
import BlogNav from "./BlogNav";

function CaseStudyNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="case-nav">
        <Link to="/" className="case-brand"><strong>Aqib Faraz</strong></Link>
        <div className="case-nav-links">
          <a href="/#work-proud" className="case-nav-link">Portfolio <b>+</b></a>
          <a href="/#services" className="case-nav-link">Services <b>+</b></a>
          <a href="/#our-technologies" className="case-nav-link">Technologies</a>
          <Link to="/blog" className="case-nav-link case-nav-active">Blog <b>+</b></Link>
        </div>
        <div className="case-nav-actions">
          <a href="mailto:Aqibfahraz@gmail.com" className="case-talk">Let's Talk</a>
          <a href="/#become-client" className="case-arrow" aria-label="Go to contact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </a>
        </div>
      </nav>
      <div className="case-mobile-dock">
        <button className={`case-menu-toggle${open ? " is-open" : ""}`} onClick={() => setOpen(value => !value)} aria-label="Toggle menu"><span /><span /><span /></button>
        <a href="mailto:Aqibfahraz@gmail.com" aria-label="Email Aqib Faraz" className="case-dock-email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></a>
      </div>
      {open && <div className="case-mobile-menu"><a href="/#work-proud">Portfolio</a><a href="/#services">Services</a><a href="/#our-technologies">Technologies</a><Link to="/blog">Blog</Link><a href="mailto:Aqibfahraz@gmail.com" className="case-talk">Let's Talk</a></div>}
    </>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="case-section-heading">
      <span className="case-rule" />
      <div>
        <span className="case-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function MetaGrid({ study }) {
  const items = [
    ["Project", study.name],
    ["Industry", study.industry],
    ["Category", "Web Development"],
    ["Role", "Web Developer"],
    ["Status", "Completed"],
    ["Live Website", study.url.replace("https://", "")],
  ];
  return (
    <div className="case-meta-grid">
      {items.map(([label, value]) => (
        <div className="case-meta-item" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function CaseStudyPost() {
  const { slug } = useParams();
  const study = CASE_STUDIES.find(item => item.slug === slug);

  useEffect(() => {
    if (study) {
      document.title = study.seoTitle;
      let description = document.querySelector('meta[name="description"]');
      if (!description) {
        description = document.createElement("meta");
        description.name = "description";
        document.head.appendChild(description);
      }
      description.content = study.metaDescription;
    }
    return () => { document.title = "Custom CRM, Design, App & Web Development | Aqib Faraz"; };
  }, [study]);

  if (!study) {
    return (
      <main className="case-page case-not-found">
        <BlogNav />
        <div>
          <span className="case-eyebrow">404 / PROJECT</span>
          <h1>Project not found</h1>
          <Link to="/blog" className="case-button">Back to Projects</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="case-page">
      <style>{`
        .case-page { --accent: #f3f3f3; --hover: #999; --ink: #000; --paper: #eef2f6; background: var(--ink); color: var(--paper); min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .case-page * { box-sizing: border-box; }
        .case-nav { position: fixed; z-index: 20; inset: 0 0 auto; height: 64px; padding: 0 clamp(20px, 5vw, 72px); display: flex; align-items: center; justify-content: space-between; background: rgba(2,6,10,.74); backdrop-filter: blur(22px) saturate(160%); border-bottom: 1px solid rgba(255,255,255,.08); }
        .case-brand { display: inline-flex; flex-direction: column; color: #eef2f6; line-height: 1; text-decoration: none; }
        .case-brand strong { font-size: 19px; letter-spacing: -.02em; }
        .case-brand span { font-size: 9px; letter-spacing: .42em; color: rgba(255,255,255,.6); text-align: right; margin-top: 3px; }
        .case-nav-links, .case-nav-actions { display: flex; align-items: center; gap: clamp(14px, 2.5vw, 36px); }
        .case-nav-link { color: rgba(255,255,255,.5); font: 600 13px 'Plus Jakarta Sans', sans-serif; text-decoration: none; transition: color .2s; }
        .case-nav-link b { font-size: 15px; font-weight: 400; margin-left: 3px; }
        .case-nav-link:hover, .case-nav-active { color: var(--hover); }
        .case-talk { color: #02060a; background: #eef2f6; border-radius: 999px; padding: 10px 22px; font: 700 13px 'Plus Jakarta Sans', sans-serif; text-decoration: none; }
        .case-arrow { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid rgba(255,255,255,.22); border-radius: 50%; color: #eef2f6; text-decoration: none; }
        .case-menu-toggle, .case-mobile-menu, .case-mobile-dock { display: none; }
        .case-menu-toggle { width: 36px; height: 36px; padding: 8px; border: 0; background: transparent; cursor: pointer; }
        .case-menu-toggle span { display: block; height: 1.5px; margin: 4px 0; background: #eef2f6; transition: transform .2s, opacity .2s; }
        .case-menu-toggle.is-open span:nth-child(1) { transform: translateY(5.5px) rotate(45deg); }
        .case-menu-toggle.is-open span:nth-child(2) { opacity: 0; }
        .case-menu-toggle.is-open span:nth-child(3) { transform: translateY(-5.5px) rotate(-45deg); }
        .case-wrap { width: min(1180px, calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 1; }
        .case-hero { padding: 126px 0 82px; display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(300px, .88fr); gap: clamp(40px, 7vw, 110px); align-items: end; }
        .case-breadcrumb { color: rgba(255,255,255,.36); font: 11px 'Space Mono', monospace; letter-spacing: .12em; margin-bottom: 30px; }
        .case-breadcrumb a { color: var(--paper); text-decoration: none; }
        .case-eyebrow { color: var(--accent); display: block; font: 10px 'Space Mono', monospace; letter-spacing: .22em; text-transform: uppercase; }
        .case-hero h1 { font-size: clamp(52px, 8vw, 126px); line-height: .92; letter-spacing: -.065em; margin: 18px 0 30px; max-width: 900px; }
        .case-lede { color: rgba(255,255,255,.64); font: 17px/1.55 'Plus Jakarta Sans', sans-serif; max-width: 680px; margin: 0; }
        .case-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 34px; }
        .case-button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 22px; border: 1px solid #eef2f6; border-radius: 999px; color: #02060a; background: #eef2f6; font: 700 11px 'Space Mono', monospace; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; transition: background .2s, color .2s, border-color .2s; }
        .case-button:hover { background: #bdbdbd; border-color: #bdbdbd; color: var(--ink); }
        .case-button-muted { border-color: rgba(255,255,255,.28); background: transparent; color: rgba(255,255,255,.72); }
        .case-hero-image { min-height: 390px; height: min(48vw, 560px); overflow: hidden; border: 1px solid rgba(255,255,255,.10); background: #0b1418; }
        .case-hero-image img { width: 100%; height: 100%; object-fit: cover; display: block; filter: saturate(.85); }
        .case-meta-grid { display: grid; grid-template-columns: repeat(6, 1fr); border-top: 1px solid rgba(255,255,255,.14); border-bottom: 1px solid rgba(255,255,255,.14); }
        .case-meta-item { padding: 20px 16px 22px; border-right: 1px solid rgba(255,255,255,.10); min-width: 0; }
        .case-meta-item:last-child { border-right: 0; }
        .case-meta-item span { display: block; color: rgba(255,255,255,.38); font: 9px 'Space Mono', monospace; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 9px; }
        .case-meta-item strong { display: block; color: rgba(255,255,255,.82); font-size: 13px; line-height: 1.45; overflow-wrap: anywhere; }
        .case-content { max-width: 900px; margin: 0 auto; padding: 110px 0; }
        .case-section { padding: 0 0 106px; }
        .case-section-heading { display: grid; grid-template-columns: 38px 1fr; gap: 20px; margin-bottom: 34px; }
        .case-rule { width: 32px; height: 1px; margin-top: 9px; background: var(--accent); }
        .case-section-heading h2 { font-size: clamp(36px, 5vw, 72px); letter-spacing: -.055em; line-height: .96; margin: 12px 0 0; }
        .case-copy { color: rgba(255,255,255,.62); font: 15px/1.85 'Plus Jakarta Sans', sans-serif; max-width: 780px; margin: 0 0 20px; }
        .case-feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,.10); border: 1px solid rgba(255,255,255,.10); }
        .case-feature { background: var(--ink); padding: 28px; min-height: 150px; }
        .case-feature-number { color: rgba(255,255,255,.55); font: 11px 'Space Mono', monospace; }
        .case-feature h3 { font-size: 18px; margin: 18px 0 10px; letter-spacing: -.02em; }
        .case-feature p { color: rgba(255,255,255,.48); font: 12px/1.8 'Space Mono', monospace; margin: 0; }
        .case-journey { border-left: 1px solid var(--accent); padding: 14px 0 14px 26px; color: var(--paper); font-size: clamp(20px, 3vw, 34px); line-height: 1.35; letter-spacing: -.03em; }
        .case-role { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; padding: 28px 0; border-top: 1px solid rgba(255,255,255,.13); border-bottom: 1px solid rgba(255,255,255,.13); }
        .case-role h3 { margin: 0; font-size: 22px; }
        .case-role p { margin: 0; color: rgba(255,255,255,.56); font: 13px/1.9 'Space Mono', monospace; }
        .case-tech { padding: 24px; border: 1px dashed rgba(255,255,255,.30); color: rgba(255,255,255,.55); font: 13px 'Space Mono', monospace; }
        .case-gallery { display: grid; grid-template-columns: repeat(12, 1fr); gap: 14px; }
        .case-gallery-item { grid-column: span 4; aspect-ratio: 1.35; overflow: hidden; border: 1px solid rgba(255,255,255,.10); background: #0b1418; position: relative; }
        .case-gallery-item.is-mobile { aspect-ratio: auto; }
        .case-gallery-item:nth-child(1), .case-gallery-item:nth-child(4) { grid-column: span 7; }
        .case-gallery-item:nth-child(2), .case-gallery-item:nth-child(5) { grid-column: span 5; }
        .case-gallery-item img { width: 100%; height: 100%; object-fit: cover; opacity: .82; display: block; }
        .case-gallery-item.is-mobile img { height: auto; object-fit: contain; }
        .case-gallery-label { position: absolute; inset: auto 12px 12px; padding: 7px 9px; background: rgba(2,6,10,.78); color: var(--paper); font: 9px 'Space Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }
        .case-cta { padding: 80px 0 110px; border-top: 1px solid rgba(255,255,255,.15); display: flex; align-items: end; justify-content: space-between; gap: 30px; }
        .case-cta h2 { font-size: clamp(34px, 5vw, 68px); line-height: .98; letter-spacing: -.05em; margin: 12px 0 0; max-width: 680px; }
        .case-live { color: rgba(255,255,255,.54); font: 12px 'Space Mono', monospace; line-height: 1.8; }
        .case-live a { color: var(--paper); text-decoration: none; }
        .case-not-found { display: grid; place-items: center; min-height: 100vh; text-align: center; }
        .case-not-found h1 { font-size: clamp(42px, 7vw, 80px); margin: 14px 0 30px; }
        @media (max-width: 1023px) { .case-nav { padding: 0 clamp(18px, 4vw, 36px); } .case-nav-links, .case-nav-actions { display: none; } .case-mobile-dock { display: flex; position: fixed; z-index: 700; left: 50%; bottom: 18px; transform: translateX(-50%); gap: 4px; padding: 7px; border: 1px solid rgba(255,255,255,.16); border-radius: 999px; background: rgba(18,18,18,.88); backdrop-filter: blur(18px); box-shadow: 0 12px 30px rgba(0,0,0,.36); } .case-mobile-dock .case-menu-toggle { display: grid; place-items: center; } .case-dock-email { width: 54px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: #f3f3f3; } .case-mobile-dock .case-menu-toggle { width: 54px; height: 38px; padding: 8px; border: 0; border-radius: 999px; background: transparent; } .case-mobile-dock .case-menu-toggle.is-open { background: #f3f3f3; } .case-mobile-dock .case-menu-toggle.is-open span { background: #111; } .case-mobile-menu { display: flex; position: fixed; z-index: 699; top: 64px; left: 0; right: 0; flex-direction: column; gap: 0; padding: 12px clamp(20px, 5vw, 40px) 24px; background: rgba(2,6,10,.98); border-bottom: 1px solid rgba(255,255,255,.10); box-shadow: 0 20px 35px rgba(0,0,0,.28); } .case-mobile-menu a { padding: 15px 0; border-bottom: 1px solid rgba(255,255,255,.06); color: rgba(255,255,255,.7); font: 600 14px 'Plus Jakarta Sans', sans-serif; text-decoration: none; } .case-mobile-menu a:hover, .case-mobile-menu a:focus-visible { color: var(--hover); } .case-mobile-menu .case-talk { align-self: flex-start; margin-top: 18px; border: 0; padding: 12px 26px; color: #02060a; } .case-wrap { width: min(100% - 32px, 900px); } .case-hero { grid-template-columns: 1fr; padding-top: 110px; } .case-hero-image { min-height: 300px; height: min(62vw, 520px); } .case-meta-grid { grid-template-columns: repeat(3, 1fr); } .case-meta-item:nth-child(3n) { border-right: 0; } .case-meta-item:nth-child(n+4) { border-top: 1px solid rgba(255,255,255,.10); } .case-content { padding: 76px 0; } .case-section { padding-bottom: 74px; } .case-feature-grid { grid-template-columns: 1fr 1fr; } .case-role { grid-template-columns: 1fr; } .case-gallery-item, .case-gallery-item:nth-child(1), .case-gallery-item:nth-child(2), .case-gallery-item:nth-child(4), .case-gallery-item:nth-child(5) { grid-column: span 6; } .case-cta { display: block; padding-bottom: 80px; } .case-cta .case-button { margin-top: 28px; } }
        @media (max-width: 600px) { .case-wrap { width: min(100% - 32px, 600px); } .case-hero-image { height: 72vw; } .case-meta-grid { grid-template-columns: repeat(2, 1fr); } .case-meta-item:nth-child(even) { border-right: 0; } .case-meta-item:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,.10); } .case-feature-grid { grid-template-columns: 1fr; } .case-gallery-item, .case-gallery-item:nth-child(1), .case-gallery-item:nth-child(2), .case-gallery-item:nth-child(4), .case-gallery-item:nth-child(5) { grid-column: span 12; } }
      `}</style>
      <BlogNav />
      <div className="case-wrap">
        <header className="case-hero">
          <div>
            <div className="case-breadcrumb"><Link to="/">Home</Link> / <Link to="/blog">Projects</Link> / {study.name}</div>
            <span className="case-eyebrow">Case study / {study.category}</span>
            <h1>{study.title}</h1>
            <p className="case-lede">{study.description}</p>
            <div className="case-actions">
              <a className="case-button" href={study.url} target="_blank" rel="noreferrer">View Live Website <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginLeft: 8 }}><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              <Link className="case-button case-button-muted" to="/blog">Back to Projects</Link>
            </div>
          </div>
          <div className="case-hero-image"><img src={study.image} alt={`${study.name} project preview`} /></div>
        </header>
        <MetaGrid study={study} />
        <article className="case-content">
          <section className="case-section">
            <SectionHeading eyebrow="01 / Project overview" title="The work behind the experience" />
            {study.overview.map(paragraph => <p className="case-copy" key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="02 / The challenge" title="Making the next step clear" />
            <p className="case-copy">{study.challenge}</p>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="03 / My approach" title="Structure before decoration" />
            <p className="case-copy">{study.approach}</p>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="04 / Key highlights" title="Details that support discovery" />
            <div className="case-feature-grid">{study.highlights.map(([title, text], index) => <div className="case-feature" key={title}><span className="case-feature-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="05 / User experience" title="A guided path through the content" />
            <p className="case-copy">{study.ux}</p>
            <div className="case-journey">Discover <span aria-hidden="true">→</span> Understand <span aria-hidden="true">→</span> Explore <span aria-hidden="true">→</span> Learn more <span aria-hidden="true">→</span> Take action</div>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="06 / My role" title="Web Developer" />
            <div className="case-role"><h3>My role</h3><p>I focused on the web experience, including layout implementation, responsive behavior, content presentation, navigation structure, and overall interface consistency. My focus was to turn the project requirements and design direction into a polished, usable website experience.</p></div>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="07 / Design & development focus" title="Built for clarity across screens" />
            <p className="case-copy">The implementation emphasized responsive behavior, component consistency, visual hierarchy, content readability, intuitive navigation, a performance-conscious structure, and maintainability. These considerations keep the experience coherent as visitors move between sections and screen sizes.</p>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="08 / Outcome" title="A clearer digital experience" />
            <p className="case-copy">{study.outcome}</p>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="09 / Technologies" title="Technologies used" />
            <div className="case-tech">Technologies: [Add confirmed technologies here]</div>
          </section>
          <section className="case-section">
            <SectionHeading eyebrow="10 / Project gallery" title="Selected views" />
            <div className="case-gallery">{study.gallery.map(([label, image]) => <div className={`case-gallery-item${label === "Mobile view" ? " is-mobile" : ""}`} key={label}><img src={image} alt={`${study.name} ${label}`} /><span className="case-gallery-label">{label}</span></div>)}</div>
          </section>
          <section className="case-cta">
            <div><span className="case-eyebrow">Live project</span><h2>Have a project in mind?</h2><p className="case-live">Visit <a href={study.url} target="_blank" rel="noreferrer">{study.url.replace("https://", "")}</a></p></div>
            <div><p className="case-copy">Let's build a modern, user-focused digital experience for your business.</p><a className="case-button" href="mailto:Aqibfahraz@gmail.com">Let's Work Together</a></div>
          </section>
        </article>
      </div>
    </main>
  );
}

