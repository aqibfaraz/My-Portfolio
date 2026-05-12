import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BlogList from "./blog/BlogList";
import BlogPost from "./blog/BlogPost";

const aqibPhoto = "/aqib-photo.png";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ROLES = [
  "Full-Stack Developer",
  "AI & Automation Engineer",
  "MERN Stack Specialist",
  "Python Scraping Expert",
  "Remote-First Builder",
];

const PROJECTS = [
  {
    id: "01", title: "AI Scraping Engine",
    tags: ["Python", "NLP", "Selenium", "BeautifulSoup"],
    desc: "Automated data pipeline extracting, cleaning and classifying web data at scale using NLP — eliminating 90% of manual data entry.",
    metric: "10× faster", year: "2024",
  },
  {
    id: "02", title: "MERN SaaS Platform",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    desc: "Multi-tenant SaaS with role-based access, real-time dashboards, and billing. Shipped end-to-end in 6 weeks.",
    metric: "6 wk delivery", year: "2024",
  },
  {
    id: "03", title: "Flutter Logistics App",
    tags: ["Flutter", "Dart", "Firebase"],
    desc: "Cross-platform mobile app for real-time logistics tracking with offline support and live map views.",
    metric: "4.8★ rating", year: "2023",
  },
  {
    id: "04", title: "ML Price Predictor",
    tags: ["Python", "Scikit-learn", "FastAPI"],
    desc: "Regression model trained on historical market data served as a live FastAPI endpoint.",
    metric: "82% accuracy", year: "2023",
  },
];

const STACK = [
  { name: "React.js", cat: "Frontend" }, { name: "Node.js", cat: "Backend" },
  { name: "Python", cat: "Backend" }, { name: "Flutter", cat: "Mobile" },
  { name: "MongoDB", cat: "Database" }, { name: "PostgreSQL", cat: "Database" },
  { name: "Selenium", cat: "Automation" }, { name: "BeautifulSoup", cat: "Automation" },
  { name: "NLP / ML", cat: "AI" }, { name: "FastAPI", cat: "Backend" },
  { name: "REST APIs", cat: "Integration" }, { name: "HTML/CSS/JS", cat: "Frontend" },
];

const STATS = [
  { val: "50+", label: "Projects" }, { val: "1+yr", label: "Experience" },
  { val: "3", label: "Continents" }, { val: "100%", label: "Remote" },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useTypewriter(words) {
  const [text, setText] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[wi];
    const isPausing = !del && ci > w.length;
    const delay = isPausing ? 1600 : del ? 42 : 88;
    const t = setTimeout(() => {
      if (isPausing) { setDel(true); return; }
      if (!del && ci <= w.length) { setText(w.slice(0, ci)); setCi(c => c + 1); }
      else if (del && ci >= 0) { setText(w.slice(0, ci)); setCi(c => c - 1); }
      else { setDel(false); setWi(i => (i + 1) % words.length); }
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

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
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

// ─── GRID CANVAS ─────────────────────────────────────────────────────────────
function GridCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf, t = 0;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      t += 0.003;
      ctx.clearRect(0, 0, c.width, c.height);
      const size = 65;
      for (let x = 0; x <= c.width + size; x += size) {
        const wave = Math.sin(t + x * 0.012) * 4;
        ctx.beginPath(); ctx.moveTo(x + wave, 0); ctx.lineTo(x - wave, c.height);
        ctx.strokeStyle = "rgba(0,204,153,0.032)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let y = 0; y <= c.height + size; y += size) {
        const wave = Math.cos(t + y * 0.012) * 4;
        ctx.beginPath(); ctx.moveTo(0, y + wave); ctx.lineTo(c.width, y - wave);
        ctx.strokeStyle = "rgba(0,204,153,0.032)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let x = 0; x < c.width; x += size) {
        for (let y = 0; y < c.height; y += size) {
          const p = (Math.sin(t * 1.8 + x * 0.025 + y * 0.018) + 1) / 2;
          ctx.beginPath(); ctx.arc(x, y, 0.7 + p * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,204,153,${0.03 + p * 0.08})`; ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── PARTICLE NET ─────────────────────────────────────────────────────────────
function ParticleNet({ mouse }) {
  const ref = useRef(null);
  const mouseRef = useRef(mouse);
  useEffect(() => { mouseRef.current = mouse; }, [mouse]);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let raf;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.4 + 0.4,
    }));

    const draw = () => {
      const m = mouseRef.current;
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.width) p.vx *= -1;
        if (p.y < 0 || p.y > c.height) p.vy *= -1;
        const dx = p.x - m.x, dy = p.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) { p.x += dx * 0.015; p.y += dy * 0.015; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,204,153,0.48)"; ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(0,204,153,${0.1 * (1 - d / 120)})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
        const mdx = pts[i].x - m.x, mdy = pts[i].y - m.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 160) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(0,204,153,${0.22 * (1 - md / 160)})`; ctx.lineWidth = 0.9; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
    }} />
  );
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
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
        background: "#00cc99", pointerEvents: "none", zIndex: 9999,
      }} />
      <div style={{
        position: "fixed", left: trail.x - 20, top: trail.y - 20,
        width: 40, height: 40, borderRadius: "50%",
        border: "1px solid rgba(0,204,153,0.35)",
        pointerEvents: "none", zIndex: 9998,
      }} />
    </>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ scrollY, isMobile }) {
  const [open, setOpen] = useState(false);
  const solid = scrollY > 50;
  const links = ["Work", "Stack", "About", "Contact"];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,60px)",
        background: solid ? "rgba(2,6,10,0.95)" : "transparent",
        backdropFilter: solid ? "blur(20px)" : "none",
        borderBottom: solid ? "1px solid rgba(0,204,153,0.07)" : "none",
        transition: "all 0.5s ease",
      }}>
        <a href="/" style={{
          fontFamily: "'Space Mono',monospace", fontSize: 13,
          letterSpacing: "0.24em", color: "#00cc99",
          textTransform: "uppercase", fontWeight: 700,
          textDecoration: "none",
        }}>AF_DEV</a>

        {!isMobile && (
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                fontFamily: "'Space Mono',monospace", fontSize: 11,
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)", textDecoration: "none",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "#00cc99"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{l}</a>
            ))}
            <a href="/blog" style={{
              fontFamily: "'Space Mono',monospace", fontSize: 11,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", textDecoration: "none",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#00cc99"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
            >Blog</a>
          </div>
        )}

        {!isMobile && (
          <a href="mailto:Aqibfahraz@gmail.com" style={{
            fontFamily: "'Space Mono',monospace", fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#02060a", background: "#00cc99",
            padding: "9px 20px", textDecoration: "none", fontWeight: 700,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Hire Me</a>
        )}

        {isMobile && (
          <button onClick={() => setOpen(o => !o)} style={{
            background: "none", border: "none", cursor: "pointer",
            padding: 8, display: "flex", flexDirection: "column", gap: 5,
          }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 1.5, background: "#00cc99",
                transform: open
                  ? (i === 0 ? "rotate(45deg) translate(4px,4px)" : i === 1 ? "scaleX(0)" : "rotate(-45deg) translate(4px,-4px)")
                  : "none",
                transition: "all 0.3s", transformOrigin: "center",
              }} />
            ))}
          </button>
        )}
      </nav>

      {isMobile && open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 499,
          background: "rgba(2,6,10,0.98)",
          borderBottom: "1px solid rgba(0,204,153,0.1)",
          padding: "16px 24px 24px",
          backdropFilter: "blur(20px)",
        }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} style={{
              display: "block", fontFamily: "'Space Mono',monospace",
              fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.55)", textDecoration: "none",
              padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>{l}</a>
          ))}
          <a href="/blog" onClick={() => setOpen(false)} style={{
            display: "block", fontFamily: "'Space Mono',monospace",
            fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)", textDecoration: "none",
            padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>Blog</a>
          <a href="mailto:Aqibfahraz@gmail.com" style={{
            display: "inline-block", marginTop: 20,
            fontFamily: "'Space Mono',monospace", fontSize: 11,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#02060a", background: "#00cc99",
            padding: "12px 26px", textDecoration: "none", fontWeight: 700,
          }}>Hire Me</a>
        </div>
      )}
    </>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ mouse, isMobile }) {
  const typed = useTypewriter(ROLES);
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 150); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" style={{
      position: "relative", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      justifyContent: "center",
      padding: "80px clamp(20px,5vw,60px) 60px",
      overflow: "hidden",
    }}>
      <GridCanvas />
      <ParticleNet mouse={mouse} />

      {/* Orbs */}
      <div style={{
        position: "absolute", top: "18%", right: "10%",
        width: "clamp(200px,30vw,450px)", height: "clamp(200px,30vw,450px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.07) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        animation: "orbFloat 9s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "3%",
        width: "clamp(150px,20vw,300px)", height: "clamp(150px,20vw,300px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.04) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        animation: "orbFloat 7s ease-in-out infinite reverse",
      }} />

      {!isMobile && (
        <div style={{
          position: "absolute", right: "22%", top: 0, bottom: 0,
          width: 1,
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,204,153,0.18) 30%, rgba(0,204,153,0.18) 70%, transparent 100%)",
          zIndex: 0,
        }} />
      )}

      {/* Ghost letters */}
      <div style={{
        position: "absolute", right: isMobile ? "-5%" : "2%", top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "clamp(120px,22vw,320px)", fontWeight: 800,
        color: "rgba(0,204,153,0.022)", lineHeight: 1,
        userSelect: "none", zIndex: 0, letterSpacing: "-0.06em",
        pointerEvents: "none",
      }}>AF</div>

      <div style={{
        position: "relative", zIndex: 2, maxWidth: 860,
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(44px)",
        transition: "all 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}>
        {/* Badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 32,
          opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.25s",
        }}>
          <span style={{ width: 36, height: 1, background: "#00cc99", display: "inline-block", flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Space Mono',monospace", fontSize: "clamp(9px,1.1vw,11px)",
            letterSpacing: "0.28em", color: "#00cc99", textTransform: "uppercase",
          }}>Karachi · Remote · Available Now</span>
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(54px,9vw,112px)", fontWeight: 800,
          lineHeight: 0.92, color: "#eef2f6",
          margin: "0 0 22px", letterSpacing: "-0.035em",
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
          }}>Aqib Faraz - Full-Stack Developer</span>
          <span style={{
            display: "block",
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-28px)",
            transition: "all 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }} aria-hidden="true">Aqib</span>
          <span style={{
            display: "block", color: "#00cc99",
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-28px)",
            transition: "all 0.95s cubic-bezier(0.16,1,0.3,1) 0.22s",
          }} aria-hidden="true">Faraz<span style={{ color: "#eef2f6" }}>.</span></span>
        </h1>

        {/* Typewriter */}
        <div style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(13px,1.8vw,19px)",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 52, minHeight: 30,
          opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.5s",
        }}>
          <span style={{ color: "#00cc99" }}>›</span>{" "}{typed}
          <span style={{
            display: "inline-block", width: 2, height: "1em",
            background: "#00cc99", marginLeft: 3,
            verticalAlign: "middle", animation: "blink 0.85s step-end infinite",
          }} />
        </div>

        {/* CTAs */}
        <div style={{
          display: "flex", gap: 14, flexWrap: "wrap",
          opacity: vis ? 1 : 0, transition: "opacity 0.9s ease 0.7s",
        }}>
          <a href="#work" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(11px,1.2vw,12px)", letterSpacing: "0.18em",
            textTransform: "uppercase", background: "#00cc99", color: "#02060a",
            padding: "14px clamp(22px,2.5vw,32px)", textDecoration: "none", fontWeight: 700,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >View Work ↓</a>
          <a href="mailto:Aqibfahraz@gmail.com" style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(11px,1.2vw,12px)", letterSpacing: "0.18em",
            textTransform: "uppercase", background: "transparent", color: "#eef2f6",
            padding: "14px clamp(22px,2.5vw,32px)", textDecoration: "none", fontWeight: 700,
            border: "1px solid rgba(255,255,255,0.14)", transition: "border-color 0.3s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,204,153,0.5)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"}
          >Get In Touch</a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: 40, left: "clamp(20px,5vw,60px)",
        display: "flex", alignItems: "center", gap: 12, opacity: 0.38, zIndex: 2,
      }}>
        <div style={{
          width: 1, height: 56,
          background: "linear-gradient(to bottom, rgba(0,204,153,0.9), transparent)",
          animation: "scrollPulse 2.2s ease-in-out infinite",
        }} />
        <span style={{
          fontFamily: "'Space Mono',monospace", fontSize: 9,
          letterSpacing: "0.25em", color: "#fff",
          textTransform: "uppercase", writingMode: "vertical-rl",
        }}>Scroll</span>
      </div>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to top, #02060a, transparent)",
        zIndex: 3, pointerEvents: "none",
      }} />
    </section>
  );
}

// ─── STATS BAR ────────────────────────────────────────────────────────────────
function StatsBar() {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      display: "grid", gridTemplateColumns: "repeat(4,1fr)",
      borderTop: "1px solid rgba(0,204,153,0.09)",
      borderBottom: "1px solid rgba(0,204,153,0.09)",
    }}>
      {STATS.map((s, i) => (
        <div key={i} style={{
          padding: "clamp(20px,4vw,44px) clamp(14px,3vw,40px)",
          borderRight: i < 3 ? "1px solid rgba(0,204,153,0.09)" : "none",
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(22px)",
          transition: `all 0.7s ease ${i * 0.1}s`,
          cursor: "default",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(0,204,153,0.03)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: "clamp(24px,4vw,52px)", fontWeight: 800,
            color: "#00cc99", lineHeight: 1,
          }}>{s.val}</div>
          <div style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(8px,0.9vw,11px)", letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginTop: 8,
          }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── WORK ─────────────────────────────────────────────────────────────────────
function Work() {
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(null);

  return (
    <section id="work" style={{ padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)" }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <SectionLabel num="02" title="Selected Work" />
        <div style={{ marginTop: "clamp(36px,6vw,72px)" }}>
          {PROJECTS.map((p, i) => (
            <div key={p.id}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(36px,5vw,72px) 1fr",
                gap: "clamp(12px,2.5vw,28px)",
                padding: "clamp(18px,3vw,32px) 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: hov === i ? "rgba(0,204,153,0.02)" : "transparent",
                transition: "background 0.35s, opacity 0.7s, transform 0.7s",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateX(-18px)",
                transitionDelay: `${i * 0.1}s`,
              }}>
              <span style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(10px,1.1vw,13px)",
                color: "rgba(0,204,153,0.4)", letterSpacing: "0.1em", paddingTop: 3,
              }}>{p.id}</span>
              <div>
                <div style={{
                  display: "flex", alignItems: "flex-start",
                  justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 10,
                }}>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(17px,2.4vw,27px)", fontWeight: 700,
                    color: hov === i ? "#00cc99" : "#eef2f6",
                    margin: 0, transition: "color 0.3s", letterSpacing: "-0.02em",
                  }}>{p.title}</h3>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                    <span style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "clamp(9px,1vw,11px)", color: "rgba(0,204,153,0.55)",
                      letterSpacing: "0.12em",
                    }}>{p.metric}</span>
                    <span style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "clamp(9px,1vw,11px)", color: "rgba(255,255,255,0.18)",
                      letterSpacing: "0.1em",
                    }}>{p.year}</span>
                  </div>
                </div>
                <p style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(10px,1.2vw,13px)", lineHeight: 1.9,
                  color: "rgba(255,255,255,0.36)", margin: "0 0 14px", maxWidth: 580,
                }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "clamp(8px,0.8vw,9px)", letterSpacing: "0.14em",
                      textTransform: "uppercase", color: "rgba(0,204,153,0.6)",
                      border: "1px solid rgba(0,204,153,0.16)", padding: "3px 9px",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STACK ────────────────────────────────────────────────────────────────────
function StackSection() {
  const [ref, inView] = useInView();
  const [hov, setHov] = useState(null);

  return (
    <section id="stack" style={{
      padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(0,204,153,0.07)",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(300px,50vw,600px)", height: "clamp(300px,50vw,600px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.04), transparent 65%)",
        pointerEvents: "none",
      }} />
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease", position: "relative",
      }}>
        <SectionLabel num="03" title="Tech Stack" />
        <div style={{
          marginTop: "clamp(36px,6vw,72px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(clamp(110px,13vw,165px),1fr))",
          gap: 1, background: "#02060a",
        }}>
          {STACK.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: hov === i ? "rgba(0,204,153,0.05)" : "#02060a",
                padding: "clamp(16px,2.2vw,26px) clamp(14px,1.8vw,22px)",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "scale(0.9)",
                transition: `background 0.3s, opacity 0.5s ease ${i * 0.035}s, transform 0.5s ease ${i * 0.035}s`,
                cursor: "default",
              }}>
              <div style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(7px,0.75vw,9px)", letterSpacing: "0.28em",
                color: "#00cc99", textTransform: "uppercase", marginBottom: 8, opacity: 0.5,
              }}>{s.cat}</div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: "clamp(13px,1.4vw,16px)", fontWeight: 700,
                color: hov === i ? "#00cc99" : "#eef2f6", transition: "color 0.3s",
              }}>{s.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about" style={{
      padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(0,204,153,0.07)",
    }}>
      <div ref={ref} style={{
        opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(40px)",
        transition: "all 0.8s ease",
      }}>
        <SectionLabel num="04" title="About" />

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
                borderTop: "2px solid #00cc99", borderLeft: "2px solid #00cc99", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", bottom: -8, right: -8, width: 28, height: 28,
                borderBottom: "2px solid #00cc99", borderRight: "2px solid #00cc99", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", top: -8, right: -8, width: 28, height: 28,
                borderTop: "2px solid rgba(0,204,153,0.3)", borderRight: "2px solid rgba(0,204,153,0.3)", zIndex: 2,
              }} />
              <div style={{
                position: "absolute", bottom: -8, left: -8, width: 28, height: 28,
                borderBottom: "2px solid rgba(0,204,153,0.3)", borderLeft: "2px solid rgba(0,204,153,0.3)", zIndex: 2,
              }} />

              {/* Glow behind image */}
              <div style={{
                position: "absolute", inset: -1,
                background: "linear-gradient(135deg, rgba(0,204,153,0.15), transparent 60%)",
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
                border: "1px solid rgba(0,204,153,0.2)",
                padding: "10px 14px", zIndex: 3,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#00cc99",
                  boxShadow: "0 0 10px #00cc99", display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite", flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: "'Space Mono',monospace", fontSize: 9,
                  letterSpacing: "0.2em", color: "#00cc99", textTransform: "uppercase",
                }}>Available for remote work</span>
              </div>
            </div>

            {/* Social Links — inline icons */}
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
                  border: "1px solid rgba(0,204,153,0.16)",
                  color: "rgba(255,255,255,0.5)",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                  background: "transparent",
                  borderRadius: "4px",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#00cc99";
                    e.currentTarget.style.borderColor = "rgba(0,204,153,0.55)";
                    e.currentTarget.style.background = "rgba(0,204,153,0.05)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                    e.currentTarget.style.borderColor = "rgba(0,204,153,0.16)";
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
                USA and Europe-based clients — fully remote, zero timezone excuses.
              </p>
              <p style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: "clamp(11px,1.2vw,13px)", lineHeight: 2.1,
                color: "rgba(255,255,255,0.42)", marginTop: 18,
              }}>
                I specialise in MERN stack, Python automation, AI/ML pipelines,
                and cross-platform Flutter apps. I don't just write code —
                I solve the business problem behind the ticket.
              </p>
            </div>

            {/* Availability card */}
            <div style={{
              border: "1px solid rgba(0,204,153,0.14)",
              padding: "clamp(24px,4vw,40px) clamp(20px,3vw,36px)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(to right, transparent, rgba(0,204,153,0.7), transparent)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 180, height: 180,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,204,153,0.07), transparent 70%)",
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
                textTransform: "uppercase", background: "#00cc99", color: "#02060a",
                padding: "12px 26px", textDecoration: "none", fontWeight: 700,
                display: "inline-block", transition: "opacity 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >Let's Talk →</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, inView] = useInView();
  return (
    <section id="contact" style={{
      padding: "clamp(70px,10vw,140px) clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(0,204,153,0.07)",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "clamp(300px,60vw,700px)", height: "clamp(300px,60vw,700px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.05), transparent 65%)",
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
          color: "rgba(0,204,153,0.55)", textTransform: "uppercase", marginBottom: 28,
        }}>05 — Start a conversation</div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(34px,7vw,88px)", fontWeight: 800,
          color: "#eef2f6", lineHeight: 1, margin: "0 0 20px",
          letterSpacing: "-0.03em",
        }}>
          Ready to build<br />
          <span style={{ color: "#00cc99" }}>something real?</span>
        </h2>
        <p style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(10px,1.1vw,13px)",
          color: "rgba(255,255,255,0.27)", marginBottom: 28,
        }}>Aqibfahraz@gmail.com</p>

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
              border: "1px solid rgba(0,204,153,0.16)",
              transition: "all 0.25s ease",
              background: "transparent",
              borderRadius: "4px",
            }}
              onMouseEnter={e => { 
                e.currentTarget.style.color="#00cc99"; 
                e.currentTarget.style.borderColor="rgba(0,204,153,0.55)"; 
                e.currentTarget.style.background="rgba(0,204,153,0.05)";
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.color="rgba(255,255,255,0.5)"; 
                e.currentTarget.style.borderColor="rgba(0,204,153,0.16)"; 
                e.currentTarget.style.background="transparent";
              }}
              title={x.label}
            >{x.icon}</a>
          ))}
        </div>
        <a href="mailto:Aqibfahraz@gmail.com" style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.18em",
          textTransform: "uppercase", background: "#00cc99", color: "#02060a",
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

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      padding: "22px clamp(20px,5vw,60px)",
      borderTop: "1px solid rgba(0,204,153,0.06)",
      display: "flex", justifyContent: "space-between",
      alignItems: "center", flexWrap: "wrap", gap: 12,
    }}>
      <span style={{
        fontFamily: "'Space Mono',monospace", fontSize: 11,
        color: "rgba(255,255,255,0.16)", letterSpacing: "0.12em",
      }}>© 2025 Aqib Faraz</span>
      <a href="https://aqibfaraz.dev" style={{
        fontFamily: "'Space Mono',monospace", fontSize: 11,
        color: "rgba(0,204,153,0.32)", letterSpacing: "0.15em", textDecoration: "none",
      }}>aqibfaraz.dev</a>
    </footer>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
function SectionLabel({ num, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{
        fontFamily: "'Space Mono',monospace",
        fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em",
        color: "rgba(0,204,153,0.4)", textTransform: "uppercase",
      }}>{num}</span>
      <span style={{
        width: 44, height: 1, background: "rgba(0,204,153,0.22)",
        display: "inline-block", flexShrink: 0,
      }} />
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        fontSize: "clamp(24px,4vw,48px)", fontWeight: 800,
        color: "#eef2f6", margin: 0, letterSpacing: "-0.025em",
      }}>{title}</h2>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function Home({ mouse, scrollY, isMobile }) {
  return (
    <>
      <Hero mouse={mouse} isMobile={isMobile} />
      <StatsBar />
      <Work />
      <StackSection />
      <About />
      <Contact />
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
      background: "radial-gradient(circle at top, rgba(0,204,153,0.08), transparent 42%), #02060a",
      color: "#eef2f6",
    }}>
      <div style={{ maxWidth: 620 }}>
        <div style={{
          fontFamily: "'Space Mono',monospace",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#00cc99",
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
            background: "#00cc99",
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

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const mouse = useMouse();
  const scrollY = useScrollY();
  const isMobile = useIsMobile();

  return (
    <Router>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Syne:wght@400;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: #02060a;
          color: #eef2f6;
          overflow-x: hidden;
          cursor: ${isMobile ? "auto" : "none"};
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #02060a; }
        ::-webkit-scrollbar-thumb { background: rgba(0,204,153,0.3); border-radius: 2px; }
        a { cursor: none; }
        
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
          color: #00ff88;
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
          color: #00cc99;
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
          color: #00cc99;
        }
        
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes scrollPulse {
          0%,100%{opacity:.38;transform:scaleY(1)}
          50%{opacity:.85;transform:scaleY(1.18)}
        }
        @keyframes pulse {
          0%,100%{box-shadow:0 0 6px #00cc99,0 0 12px rgba(0,204,153,0.3)}
          50%{box-shadow:0 0 14px #00cc99,0 0 28px rgba(0,204,153,0.4)}
        }
        @keyframes orbFloat {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(18px,-14px) scale(1.03)}
          66%{transform:translate(-12px,18px) scale(0.97)}
        }
      `}</style>

      <Cursor pos={mouse} isMobile={isMobile} />
      <Nav scrollY={scrollY} isMobile={isMobile} />

      <Routes>
        <Route path="/" element={<Home mouse={mouse} scrollY={scrollY} isMobile={isMobile} />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
