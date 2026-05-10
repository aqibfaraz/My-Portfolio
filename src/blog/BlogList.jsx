import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import BLOG_POSTS from "./blogData";

// ─── REUSED FROM APP.JS ────────────────────────────────────────
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
    const check = () => setM(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return m;
}

// ─── CURSOR (same as App.js) ──────────────────────────────────
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
        transition: "none",
      }} />
    </>
  );
}

// ─── GRID CANVAS (same as App.js) ────────────────────────────
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
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }} />
  );
}

// ─── PARTICLE NET (same as App.js) ───────────────────────────
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
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
    }} />
  );
}

// ─── BLOG LIST ────────────────────────────────────────────────
export default function BlogList() {
  const mouse = useMouse();
  const isMobile = useIsMobile();
  const [hov, setHov] = useState(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVis(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#02060a", position: "relative" }}>
      {/* Animated background */}
      <GridCanvas />
      <ParticleNet mouse={mouse} />

      {/* Custom cursor */}
      <Cursor pos={mouse} isMobile={isMobile} />

      {/* Orb decoration */}
      <div style={{
        position: "fixed", top: "15%", right: "8%",
        width: "clamp(200px,28vw,400px)", height: "clamp(200px,28vw,400px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.06) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        animation: "orbFloat 9s ease-in-out infinite",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 860,
        margin: "0 auto",
        padding: "clamp(100px,14vw,140px) clamp(20px,5vw,60px) 80px",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(32px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <span style={{ width: 36, height: 1, background: "#00cc99", display: "inline-block" }} />
          <span style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.28em",
            color: "#00cc99", textTransform: "uppercase",
          }}>Writing & Tutorials</span>
        </div>

        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(38px,7vw,80px)", fontWeight: 800,
          color: "#eef2f6", margin: "0 0 16px",
          letterSpacing: "-0.035em", lineHeight: 0.95,
        }}>Blog</h1>

        <p style={{
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(11px,1.3vw,13px)",
          color: "rgba(255,255,255,0.32)",
          letterSpacing: "0.04em", lineHeight: 1.8,
          marginBottom: "clamp(40px,7vw,72px)",
          maxWidth: 520,
        }}>
          Tutorials and guides on MERN stack, Python automation, Flutter, and AI development.
        </p>

        {/* Divider */}
        <div style={{
          height: 1,
          background: "linear-gradient(to right, rgba(0,204,153,0.3), transparent)",
          marginBottom: "clamp(32px,5vw,56px)",
        }} />

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {BLOG_POSTS.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: "none", cursor: "none" }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            >
              <article style={{
                padding: "clamp(22px,3.5vw,36px) 0",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: hov === i ? "rgba(0,204,153,0.02)" : "transparent",
                transition: "background 0.3s, opacity 0.7s, transform 0.7s",
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "translateX(-18px)",
                transitionDelay: `${0.1 + i * 0.08}s`,
                display: "grid",
                gridTemplateColumns: "clamp(36px,5vw,64px) 1fr",
                gap: "clamp(12px,2.5vw,28px)",
                alignItems: "start",
              }}>
                {/* Number */}
                <span style={{
                  fontFamily: "'Space Mono',monospace",
                  fontSize: "clamp(10px,1.1vw,12px)",
                  color: "rgba(0,204,153,0.4)",
                  letterSpacing: "0.1em",
                  paddingTop: 4,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  {/* Tags */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{
                        fontFamily: "'Space Mono',monospace",
                        fontSize: "clamp(7px,0.8vw,9px)",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "rgba(0,204,153,0.6)",
                        border: "1px solid rgba(0,204,153,0.16)",
                        padding: "3px 9px",
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(17px,2.4vw,26px)", fontWeight: 700,
                    color: hov === i ? "#00cc99" : "#eef2f6",
                    margin: "0 0 10px", letterSpacing: "-0.02em",
                    transition: "color 0.3s",
                  }}>{post.title}</h2>

                  {/* Excerpt */}
                  <p style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(10px,1.1vw,12px)", lineHeight: 1.9,
                    color: "rgba(255,255,255,0.32)",
                    margin: "0 0 14px", maxWidth: 580,
                  }}>{post.excerpt}</p>

                  {/* Meta */}
                  <div style={{
                    display: "flex", gap: 20, alignItems: "center",
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "clamp(9px,1vw,11px)",
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.1em",
                  }}>
                    <span>{post.date}</span>
                    <span style={{ color: "rgba(0,204,153,0.4)" }}>{post.readTime}</span>
                    <span style={{
                      color: hov === i ? "#00cc99" : "rgba(255,255,255,0.18)",
                      transition: "color 0.3s",
                      marginLeft: "auto",
                    }}>Read →</span>
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
