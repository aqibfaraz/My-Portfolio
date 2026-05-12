import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import BLOG_POSTS from "./blogData";

// ─── REUSED HOOKS ─────────────────────────────────────────────
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

// ─── CURSOR ───────────────────────────────────────────────────
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

// ─── GRID CANVAS ──────────────────────────────────────────────
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

// ─── PARTICLE NET ─────────────────────────────────────────────
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
        if (Math.sqrt(dx * dx + dy * dy) < 90) { p.x += dx * 0.015; p.y += dy * 0.015; }
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

// ─── SIMPLIFIED NAV ──────────────────────────────────────────
function SimpleNav({ isMobile }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 500,
        height: 64, display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,60px)",
        background: "rgba(2,6,10,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,204,153,0.07)",
      }}>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          <a href="/" style={{
            fontFamily: "'Space Mono',monospace", fontSize: 11,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)", textDecoration: "none",
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = "#00cc99"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
          >Home</a>
          <a href="/blog" style={{
            fontFamily: "'Space Mono',monospace", fontSize: 11,
            letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#00cc99", textDecoration: "none",
            transition: "color 0.2s",
          }}>Blog</a>
        </div>

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
          <a href="/" onClick={() => setOpen(false)} style={{
            display: "block", fontFamily: "'Space Mono',monospace",
            fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)", textDecoration: "none",
            padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>Home</a>
          <a href="/blog" onClick={() => setOpen(false)} style={{
            display: "block", fontFamily: "'Space Mono',monospace",
            fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "#00cc99", textDecoration: "none",
            padding: "15px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>Blog</a>
        </div>
      )}
    </>
  );
}

// ─── BLOG POST ────────────────────────────────────────────────
export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [vis, setVis] = useState(false);
  const mouse = useMouse();
  const isMobile = useIsMobile();

  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    setLoading(true);
    setVis(false);
    import(`./posts/${slug}.md`)
      .then(res => fetch(res.default))
      .then(res => res.text())
      .then(text => {
        setContent(text);
        setLoading(false);
        setTimeout(() => setVis(true), 80);
      })
      .catch(() => {
        setContent("# Post not found\n\nThis post does not exist.");
        setLoading(false);
        setTimeout(() => setVis(true), 80);
      });
  }, [slug]);

  if (!post) return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, rgba(0,204,153,0.08), transparent 42%), #02060a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px 24px",
      textAlign: "center",
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
        }}>Post not found</h1>
        <p style={{
          margin: "18px 0 0",
          color: "rgba(255,255,255,0.45)",
          fontFamily: "'Space Mono',monospace",
          fontSize: 13,
          lineHeight: 1.8,
        }}>
          Yeh blog post exist nahi karta.
        </p>
        <Link to="/blog" style={{
          display: "inline-block",
          marginTop: 34,
          fontFamily: "'Space Mono',monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          background: "#00cc99",
          color: "#02060a",
          padding: "14px 24px",
          textDecoration: "none",
          fontWeight: 700,
        }}>Back to Blog</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#02060a", position: "relative" }}>
      {/* Simplified Navigation */}
      <SimpleNav isMobile={isMobile} />

      {/* Animated background */}
      <GridCanvas />
      <ParticleNet mouse={mouse} />

      {/* Custom cursor */}
      <Cursor pos={mouse} isMobile={isMobile} />

      {/* Orb */}
      <div style={{
        position: "fixed", top: "10%", right: "5%",
        width: "clamp(150px,22vw,350px)", height: "clamp(150px,22vw,350px)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,204,153,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        animation: "orbFloat 9s ease-in-out infinite",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 740,
        margin: "0 auto",
        padding: "clamp(100px,14vw,140px) clamp(20px,5vw,60px) 100px",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: "all 0.9s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* ← Back button — proper Link, no browser back needed */}
        <Link
          to="/blog"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "'Space Mono',monospace",
            fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
            textDecoration: "none", marginBottom: "clamp(32px,5vw,52px)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "10px 18px",
            transition: "color 0.2s, border-color 0.2s",
            cursor: "none",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#00cc99";
            e.currentTarget.style.borderColor = "rgba(0,204,153,0.35)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "rgba(255,255,255,0.28)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          ← Back to Blog
        </Link>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(7px,0.8vw,9px)",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "rgba(0,204,153,0.6)",
              border: "1px solid rgba(0,204,153,0.16)",
              padding: "3px 9px",
            }}>{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: "clamp(26px,4.5vw,52px)", fontWeight: 800,
          color: "#eef2f6", margin: "0 0 20px",
          letterSpacing: "-0.03em", lineHeight: 1.15,
        }}>{post.title}</h1>

        {/* Meta */}
        <div style={{
          display: "flex", gap: 20, alignItems: "center",
          fontFamily: "'Space Mono',monospace",
          fontSize: "clamp(9px,1vw,11px)",
          color: "rgba(255,255,255,0.22)",
          letterSpacing: "0.1em",
          marginBottom: "clamp(28px,4vw,44px)",
          paddingBottom: "clamp(20px,3vw,32px)",
          borderBottom: "1px solid rgba(0,204,153,0.1)",
        }}>
          <span>{post.date}</span>
          <span style={{ color: "rgba(0,204,153,0.5)" }}>{post.readTime}</span>
          <span>Aqib Faraz</span>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            fontFamily: "'Space Mono',monospace",
            fontSize: 12, color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.2em",
          }}>Loading...</div>
        )}

        {/* Markdown Content */}
        {!loading && (
          <div className="blog-content">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {/* Bottom nav */}
        <div style={{
          marginTop: "clamp(48px,7vw,80px)",
          paddingTop: "clamp(24px,3vw,36px)",
          borderTop: "1px solid rgba(0,204,153,0.08)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 16,
        }}>
          <Link
            to="/blog"
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.18em",
              textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
              textDecoration: "none", transition: "color 0.2s",
              cursor: "none",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#00cc99"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}
          >← All Posts</Link>

          <a
            href="mailto:Aqibfahraz@gmail.com"
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: "clamp(9px,1vw,11px)", letterSpacing: "0.15em",
              textTransform: "uppercase", color: "#02060a",
              background: "#00cc99", padding: "10px 22px",
              textDecoration: "none", fontWeight: 700,
              transition: "opacity 0.2s", cursor: "none",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >Hire Me</a>
        </div>
      </div>
    </div>
  );
}
