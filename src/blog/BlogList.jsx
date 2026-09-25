import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CASE_STUDIES from "./caseStudyData";
import BlogNav from "./BlogNav";

// â”€â”€â”€ REUSED FROM APP.JS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useMouse() {
  const [pos, setPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const h = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const check = () => setM(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrollY;
}

// â”€â”€â”€ CURSOR (same as App.js) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        background: "#f3f3f3", pointerEvents: "none", zIndex: 9999,
      }} />
      <div style={{
        position: "fixed", left: trail.x - 20, top: trail.y - 20,
        width: 40, height: 40, borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.35)",
        pointerEvents: "none", zIndex: 9998,
        transition: "none",
      }} />
    </>
  );
}

// â”€â”€â”€ GRID CANVAS (same as App.js) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        ctx.strokeStyle = "rgba(255,255,255,0.032)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let y = 0; y <= c.height + size; y += size) {
        const wave = Math.cos(t + y * 0.012) * 4;
        ctx.beginPath(); ctx.moveTo(0, y + wave); ctx.lineTo(c.width, y - wave);
        ctx.strokeStyle = "rgba(255,255,255,0.032)"; ctx.lineWidth = 0.5; ctx.stroke();
      }
      for (let x = 0; x < c.width; x += size) {
        for (let y = 0; y < c.height; y += size) {
          const p = (Math.sin(t * 1.8 + x * 0.025 + y * 0.018) + 1) / 2;
          ctx.beginPath(); ctx.arc(x, y, 0.7 + p * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${0.03 + p * 0.08})`; ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// â”€â”€â”€ PARTICLE NET (same as App.js) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        ctx.fillStyle = "rgba(255,255,255,0.48)"; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - d / 120)})`; ctx.lineWidth = 0.7; ctx.stroke();
          }
        }
        const mdx = pts[i].x - m.x, mdy = pts[i].y - m.y;
        const md = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < 160) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(255,255,255,${0.22 * (1 - md / 160)})`; ctx.lineWidth = 0.9; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
    }} />
  );
}

// â”€â”€â”€ PORTFOLIO NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SimpleNav({ isMobile, scrollY }) {
  const [open, setOpen] = useState(false);
  const solid = scrollY > 50;

  return (
    <>
      <nav style={{
        position: "fixed", top: solid ? "clamp(8px,1vw,16px)" : 0,
        left: solid ? "clamp(10px,1.6vw,28px)" : 0,
        right: solid ? "clamp(10px,1.6vw,28px)" : 0, zIndex: 500,
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: solid ? "0 clamp(16px,2.4vw,34px)" : "0 clamp(20px,5vw,60px)",
        background: solid ? "rgba(255,255,255,0.06)" : "rgba(2,6,10,0.74)",
        backdropFilter: "blur(22px) saturate(160%)",
        border: solid ? "1px solid rgba(255,255,255,0.14)" : "1px solid rgba(255,255,255,0.08)",
        borderRadius: solid ? 999 : 0,
        boxShadow: solid ? "0 14px 40px rgba(0,0,0,0.35)" : "none",
        transition: "all .45s cubic-bezier(.25,1,.5,1)",
      }}>
        <a href="/" style={{ display: "inline-block", textDecoration: "none", color: "#eef2f6", fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1 }}>
          <span style={{ display: "block", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Aqib Faraz</span>
        </a>

        {!isMobile && <div style={{ display: "flex", gap: "clamp(14px,2.5vw,36px)", alignItems: "center" }}>
          {["Portfolio", "Services", "Technologies"].map(label => <a key={label} href={label === "Portfolio" ? "/#work-proud" : `/#${label === "Services" ? "services" : "our-technologies"}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{label}{label !== "Technologies" && <span style={{ fontSize: 15, marginLeft: 4 }}>+</span>}</a>)}
          <a href="/blog" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#eef2f6", textDecoration: "none" }}>Blog<span style={{ fontSize: 15, marginLeft: 4 }}>+</span></a>
        </div>}

        {!isMobile && <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a href="mailto:Aqibfahraz@gmail.com" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#02060a", background: "#eef2f6", borderRadius: 999, padding: "10px 22px", textDecoration: "none" }}>Let's Talk</a>
          <a href="/#become-client" aria-label="Go to contact" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.22)", color: "#eef2f6", textDecoration: "none" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
        </div>}

      </nav>

      {isMobile && <div style={{ position: "fixed", zIndex: 700, left: "50%", bottom: 18, transform: "translateX(-50%)", display: "flex", gap: 4, padding: 7, border: "1px solid rgba(255,255,255,0.16)", borderRadius: 999, background: "rgba(18,18,18,0.88)", backdropFilter: "blur(18px)", boxShadow: "0 12px 30px rgba(0,0,0,.36)" }}>
        <button onClick={() => setOpen(o => !o)} aria-label="Toggle menu" style={{ width: 54, height: 38, border: 0, borderRadius: 999, background: open ? "#f3f3f3" : "transparent", color: open ? "#111" : "#f3f3f3", display: "grid", placeItems: "center", cursor: "pointer" }}><span style={{ display: "flex", flexDirection: "column", gap: 4 }}><span style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(2.75px) rotate(45deg)" : "none" }} /><span style={{ width: 22, height: 1.5, background: "currentColor", opacity: open ? 0 : 1 }} /><span style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(-2.75px) rotate(-45deg)" : "none" }} /></span></button>
        <a href="mailto:Aqibfahraz@gmail.com" aria-label="Email Aqib Faraz" style={{ width: 54, height: 38, borderRadius: 999, display: "grid", placeItems: "center", color: "#f3f3f3" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg></a>
      </div>}

      {isMobile && open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 499,
          background: "rgba(2,6,10,0.98)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "16px 24px 24px",
          backdropFilter: "blur(20px)",
        }}>
          {[["Portfolio", "/#work-proud"], ["Services", "/#services"], ["Technologies", "/#our-technologies"], ["Blog", "/blog"]].map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} style={{
            display: "block", fontFamily: "'Space Mono',monospace",
            fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
            color: label === "Blog" ? "#f3f3f3" : "rgba(255,255,255,0.55)", textDecoration: "none",
            padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>{label}</a>)}
          <a href="mailto:Aqibfahraz@gmail.com" style={{ display: "inline-block", marginTop: 20, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 13, fontWeight: 700, color: "#02060a", background: "#eef2f6", borderRadius: 999, padding: "12px 26px", textDecoration: "none" }}>Let's Talk</a>
        </div>
      )}
    </>
  );
}

// â”€â”€â”€ BLOG LIST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function BlogList() {
  const mouse = useMouse();
  const isMobile = useIsMobile();
  const scrollY = useScrollY();
  const [hov, setHov] = useState(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", position: "relative" }}>
      {/* Simplified Navigation */}
      <BlogNav />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1320,
        margin: "0 auto",
        padding: "clamp(130px,15vw,180px) clamp(20px,5vw,60px) 110px",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(32px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ width: 44, height: 2, background: "#f3f3f3", display: "inline-block" }} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.28em",
            color: "#f3f3f3", textTransform: "uppercase",
          }}>Selected project work</span>
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(38px,7vw,80px)", fontWeight: 800,
          color: "#eef2f6", margin: "0 0 16px",
          letterSpacing: "-0.035em", lineHeight: 0.95,
        }}>PROJECTS. CASE STUDIES.</h1>

        <p style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(17px,2vw,25px)",
          color: "rgba(255,255,255,0.62)",
          letterSpacing: "-0.02em", lineHeight: 1.45,
          marginBottom: "clamp(40px,7vw,72px)",
          maxWidth: 520,
        }}>
          Case studies from my web development work, alongside practical notes on the tools and ideas I use.
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "rgba(255,255,255,0.2)",
          marginBottom: "clamp(32px,5vw,56px)",
        }} />

        <div style={{
          fontFamily: "'Space Mono',monospace", fontSize: 10,
          letterSpacing: "0.22em", textTransform: "uppercase",
          color: "#f3f3f3", marginBottom: 8,
        }}>WE ARE PROUD</div>

        {/* Case studies */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {CASE_STUDIES.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <article style={{
                padding: "clamp(22px,3.5vw,36px) 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: hov === i ? "rgba(255,255,255,0.035)" : "transparent",
                transition: "background 0.3s, opacity 0.7s, transform 0.7s",
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "translateX(-18px)",
                transitionDelay: `${0.1 + i * 0.08}s`,
                display: "grid",
                gridTemplateColumns: isMobile ? "30px 100px 1fr" : "clamp(36px,5vw,64px) minmax(220px,28vw) 1fr",
                gap: "clamp(12px,2.5vw,28px)",
                alignItems: "start",
              }}>
                {/* Number */}
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(10px,1.1vw,12px)",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.1em",
                  paddingTop: 4,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <img src={post.image} alt={`${post.name} project preview`} style={{
                  width: "100%", aspectRatio: "1.35", objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.16)", opacity: 0.92,
                }} />

                <div>
                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {[post.category, post.industry].map(tag => (
                      <span key={tag} style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "clamp(7px,0.8vw,9px)",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.7)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        padding: "3px 9px",
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(24px,3.2vw,48px)", fontWeight: 700,
                    color: hov === i ? "#999999" : "#eef2f6",
                    margin: "0 0 10px", letterSpacing: "-0.045em", lineHeight: 1.04,
                    transition: "color 0.3s",
                  }}>{post.title}</h2>

                  {/* Excerpt */}
                  <p style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(10px,1.1vw,12px)", lineHeight: 1.9,
                    color: "rgba(255,255,255,0.32)",
                    margin: "0 0 14px", maxWidth: 580,
                  }}>{post.description}</p>

                  {/* Meta */}
                  <div style={{
                    display: "flex", gap: 20, alignItems: "center",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(9px,1vw,11px)",
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.1em",
                  }}>
                    <span>Case study</span>
                    <span style={{ color: "rgba(255,255,255,0.48)" }}>Web Developer</span>
                    <span style={{
                      color: hov === i ? "#999999" : "rgba(255,255,255,0.18)",
                      transition: "color 0.3s",
                      marginLeft: "auto",
                    }}>View <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ verticalAlign: "-2px", marginLeft: 4 }}><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

