import { useEffect, useState } from "react";

const links = [
  ["Portfolio", "/#work-proud"],
  ["Services", "/#services"],
  ["Technologies", "/#our-technologies"],
  ["Blog", "/blog"],
];

export default function BlogNav() {
  const [scrollY, setScrollY] = useState(0);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY);
      setCompact(window.innerWidth <= 1024);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrolled = scrollY > 30;
  const edgeGap = compact && window.innerWidth > 767 ? 24 : "clamp(6px,1.5vw,16px)";
  const closeMenu = () => setOpen(false);

  return (
    <>
      <nav style={{
        position: "fixed", zIndex: 500, top: scrolled ? "clamp(8px,1vw,16px)" : 0,
        left: scrolled && !compact ? "clamp(10px,1.6vw,28px)" : 0,
        right: scrolled && !compact ? "clamp(10px,1.6vw,28px)" : 0,
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: scrolled ? "0 clamp(16px,2.4vw,34px)" : "0 clamp(20px,5vw,60px)",
        background: scrolled && !compact ? "rgba(255,255,255,0.06)" : "rgba(2,6,10,0.74)",
        backdropFilter: "blur(22px) saturate(160%)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: scrolled && !compact ? 999 : 0,
        opacity: compact && scrolled ? 0 : 1, pointerEvents: compact && scrolled ? "none" : "auto",
        transition: "all .45s cubic-bezier(.25,1,.5,1)",
      }}>
        <a href="/" style={{ color: "#eef2f6", textDecoration: "none", font: "800 17px 'Plus Jakarta Sans', sans-serif" }}>Aqib Faraz</a>
        {!compact && <div style={{ display: "flex", gap: "clamp(14px,2.5vw,36px)" }}>
          {links.map(([label, href]) => <a key={label} href={href} style={{ color: label === "Blog" ? "#eef2f6" : "rgba(255,255,255,.55)", textDecoration: "none", font: "600 13px 'Plus Jakarta Sans', sans-serif" }}>{label}</a>)}
        </div>}
        {!compact && <a href="mailto:Aqibfahraz@gmail.com" style={{ color: "#02060a", background: "#eef2f6", borderRadius: 999, padding: "10px 22px", textDecoration: "none", font: "700 13px 'Plus Jakarta Sans', sans-serif" }}>Let's Talk</a>}
        {compact && !scrolled && <button type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Open menu"} style={{ width: 42, height: 38, display: "grid", placeItems: "center", border: 0, background: "transparent", color: "#eef2f6" }}><span style={{ display: "flex", flexDirection: "column", gap: 5 }}><i style={{ width: 25, height: 1.5, background: "currentColor", transform: open ? "translateY(3.25px) rotate(45deg)" : "none", transition: "transform .25s" }} /><i style={{ width: 25, height: 1.5, background: "currentColor", transform: open ? "translateY(-3.25px) rotate(-45deg)" : "none", transition: "transform .25s" }} /></span></button>}
      </nav>

      {compact && scrolled && <div style={{ position: "fixed", zIndex: 700, left: edgeGap, right: edgeGap, bottom: compact && window.innerWidth > 767 ? 16 : 10, display: "flex", justifyContent: "center", gap: 16, padding: "7px 0", border: "1px solid rgba(255,255,255,.12)", borderRadius: 999, background: "rgba(18,18,18,.35)", backdropFilter: "blur(18px)" }}>
        <button type="button" onClick={() => setOpen(value => !value)} aria-label={open ? "Close menu" : "Open menu"} style={{ width: 54, height: 38, border: 0, background: "transparent", color: "#f3f3f3" }}><span style={{ display: "flex", flexDirection: "column", gap: 5 }}><i style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(3.25px) rotate(45deg)" : "none", transition: "transform .25s" }} /><i style={{ width: 22, height: 1.5, background: "currentColor", transform: open ? "translateY(-3.25px) rotate(-45deg)" : "none", transition: "transform .25s" }} /></span></button>
        <a href="mailto:Aqibfahraz@gmail.com" aria-label="Email Aqib Faraz" style={{ width: 54, height: 38, display: "grid", placeItems: "center", color: "#f3f3f3" }}>✉</a>
      </div>}

      {compact && open && <div style={{ position: "fixed", zIndex: 800, top: scrolled ? 18 : 70, left: "clamp(8px,3vw,24px)", right: "clamp(8px,3vw,24px)", bottom: scrolled ? 70 : 18, display: "flex", flexDirection: "column", background: "#f5f5f3", borderRadius: 6, padding: "24px clamp(22px,6vw,44px) 26px", boxShadow: "0 20px 60px rgba(0,0,0,.42)" }}>
        {links.map(([label, href]) => <a key={label} href={href} onClick={closeMenu} style={{ padding: "18px 0", borderBottom: "1px solid rgba(0,0,0,.1)", color: "#111", textDecoration: "none", font: "600 15px 'Plus Jakarta Sans', sans-serif" }}>{label}</a>)}
        <a href="mailto:Aqibfahraz@gmail.com" style={{ alignSelf: "flex-start", marginTop: 20, color: "#fff", background: "#02060a", borderRadius: 999, padding: "12px 26px", textDecoration: "none", font: "700 13px 'Plus Jakarta Sans', sans-serif" }}>Let's Talk</a>
      </div>}
    </>
  );
}
