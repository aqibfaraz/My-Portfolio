/*
=================================================================
  PHASE 2 SEO — ON-PAGE CONTENT FOR AQIB FARAZ PORTFOLIO
  Optimized for current React UI structure
=================================================================
  HOW TO USE:
  1. Copy each section below
  2. Paste into your corresponding React component
  3. NO UI/interface changes — just text optimization
=================================================================
*/


/* ---------------------------------------------------------------
   1. HERO SECTION — Typewriter/Animated Role Text
      Location: ROLES array in App.js
   
   CURRENT:
   const ROLES = [
     "Full-Stack Developer",
     "AI & Automation Engineer",
     "MERN Stack Specialist",
     "Python Scraping Expert",
     "Remote-First Builder",
   ];
   
   ✅ ALREADY SEO OPTIMIZED!
   Keep exactly as is — contains all target keywords.
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   2. HERO SUBHEADING (below the typewriter)
      Add this paragraph below the animated role text
   
   SEO CONTENT:
   "I build fast, scalable web applications using React.js, Node.js,
    MongoDB, and Python. Available for remote freelance projects and
    full-time roles with USA & Europe-based companies."
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   3. STATS SECTION — Currently shows 50+ Projects, 1+yr, etc.
      CURRENT:
      const STATS = [
        { val: "50+", label: "Projects" },
        { val: "1+yr", label: "Experience" },
        { val: "3", label: "Continents" },
        { val: "100%", label: "Remote" },
      ];
   
   ✅ ALREADY GOOD!
   Consider adding SEO-friendly labels:
   
   IMPROVED VERSION (optional):
   const STATS = [
     { val: "50+", label: "Full-Stack Projects Completed" },
     { val: "1+yr", label: "MERN Stack Experience" },
     { val: "3", label: "Continents Served Remotely" },
     { val: "100%", label: "Remote Work Available" },
   ];
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   4. PROJECTS SECTION — Your project cards
      Location: PROJECTS array
   
   CURRENT STRUCTURE:
   {
     id: "01",
     title: "AI Scraping Engine",
     tags: ["Python", "NLP", "Selenium", "BeautifulSoup"],
     desc: "Automated data pipeline...",
     metric: "10× faster",
     year: "2024",
   }
   
   IMPROVEMENT: Add more SEO keywords to descriptions
   (Keep same structure, just enhance descriptions)
   
--------------------------------------------------------------- */

PROJECTS ENHANCED FOR SEO:
[
  {
    id: "01",
    title: "AI Scraping Engine — Python & NLP",
    tags: ["Python", "NLP", "Selenium", "BeautifulSoup"],
    desc: "Automated web scraping and data extraction pipeline using Python, Selenium, and NLP. Eliminates 90% of manual data entry for enterprise clients. Built with BeautifulSoup for fast parsing and NLTK for text classification.",
    metric: "10× faster",
    year: "2024",
  },
  {
    id: "02",
    title: "MERN SaaS Platform — React & Node.js",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    desc: "Full-stack SaaS application built with React.js frontend, Node.js/Express backend, and MongoDB database. Multi-tenant architecture with role-based access control, real-time analytics dashboards, and integrated Stripe billing. Shipped in 6 weeks.",
    metric: "6 wk delivery",
    year: "2024",
  },
  {
    id: "03",
    title: "Flutter Logistics App — Cross-Platform Mobile",
    tags: ["Flutter", "Dart", "Firebase"],
    desc: "Cross-platform mobile app for logistics tracking built with Flutter and Dart. Real-time GPS tracking with Firebase backend, offline support, and live map integration. Available on iOS and Android with 4.8★ rating.",
    metric: "4.8★ rating",
    year: "2023",
  },
  {
    id: "04",
    title: "ML Price Predictor — Python Machine Learning",
    tags: ["Python", "Scikit-learn", "FastAPI"],
    desc: "Machine learning regression model for price prediction trained on historical market data. Served via FastAPI REST API endpoint. Built with Python, Scikit-learn, and Pandas for high-accuracy forecasting.",
    metric: "82% accuracy",
    year: "2023",
  },
];


/* ---------------------------------------------------------------
   5. SKILLS/TECH STACK SECTION
      Location: STACK array
   
   CURRENT:
   const STACK = [
     { name: "React.js", cat: "Frontend" },
     { name: "Node.js", cat: "Backend" },
     ...
   ];
   
   ✅ ALREADY SEO OPTIMIZED!
   Keep exactly as is — all major keywords included.
   
   Note: When displaying, make sure to include category labels
   in HTML (e.g., <span>Frontend:</span> React.js, etc.)
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   6. ABOUT SECTION (Add to your website if not present)
      
   SEO CONTENT:
   
   <h2>Full-Stack Developer Based in Karachi, Pakistan</h2>
   <p>
     I'm Aqib Faraz, a Full-Stack Developer specializing in the MERN 
     stack (React.js, Node.js, MongoDB, Express.js). I build scalable 
     web applications, Python automation tools, and cross-platform 
     Flutter apps. With experience in AI integration, web scraping, 
     and NLP pipelines, I deliver production-grade solutions for 
     remote-first companies in the USA, UK, and Europe.
   </p>
   
   Keywords: MERN stack, React developer, Node.js, Python automation,
   Flutter developer, AI, web scraping, NLP, remote developer
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   7. CTA BUTTON TEXT
      Replace generic buttons with SEO-optimized text
   
   INSTEAD OF:     USE:
   "Contact"    →  "Hire Me for Remote Work"
   "Let's Talk" →  "Get a Free Consultation"
   "Message"    →  "Start Your Project"
   "View More"  →  "View My Full-Stack Projects"
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   8. IMAGE ALT TEXT
      Add to all images throughout the site
   
   CURRENT:
   <img src={aqibPhoto} alt="" />
   
   IMPROVED:
   <img src={aqibPhoto} alt="Aqib Faraz - Full-Stack Developer from Karachi" />
   
   For project screenshots:
   <img src={project.image} alt={`${project.title} - Built with ${project.tags.join(', ')}`} />
   
   For skill icons:
   <img src="react-icon.svg" alt="React.js" />
   <img src="node-icon.svg" alt="Node.js" />
   <img src="mongodb-icon.svg" alt="MongoDB" />
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   9. SEMANTIC HTML STRUCTURE
      Make sure your components use these tags:
   
   <h1>Full-Stack Developer — MERN, React, Node.js & Python</h1>
   
   <section>
     <h2>My Tech Stack</h2>
     <ul>
       <li>React.js</li>
       <li>Node.js</li>
       ...
     </ul>
   </section>
   
   <section>
     <h2>Featured Projects</h2>
     <article>
       <h3>Project Name — Tech Stack</h3>
       <p>Description with keywords...</p>
     </article>
   </section>
   
   <section>
     <h2>Hire Me — Let's Work Together</h2>
     <button>Get Started</button>
   </section>
   
--------------------------------------------------------------- */


/* ---------------------------------------------------------------
   10. METADATA ADDITIONS
       Already added to public/index.html:
       
   ✅ Title: "Aqib Faraz | Full-Stack & AI Developer"
   ✅ Meta Description: Full details included
   ✅ Keywords Meta: MERN, React, Python, etc.
   ✅ Open Graph Tags: For social sharing
   ✅ JSON-LD Schema: Structured data
   ✅ robots.txt: Search engine crawling
   ✅ sitemap.xml: All pages indexed
   
   STATUS: Complete! ✓
   
--------------------------------------------------------------- */


/*
=================================================================
SUMMARY OF SEO IMPROVEMENTS MADE:
=================================================================

✅ Header Tags (index.html):
   - Title, Description, Keywords
   - Open Graph & Twitter Cards
   - JSON-LD Schema

✅ Robots.txt:
   - Proper crawling rules
   - Sitemap reference

✅ Sitemap.xml:
   - Homepage included
   - Update frequency set

✅ To Implement in Components:
   1. Add H2 headings to each section
   2. Enhance project descriptions (see above)
   3. Add descriptive alt text to images
   4. Use semantic HTML (h1, h2, article, section)
   5. Update button text to be descriptive
   6. Add "About" section with keyword-rich paragraph

=================================================================
NEXT STEPS:
=================================================================
1. Copy the PROJECTS ENHANCED array above
2. Replace current PROJECTS in App.js
3. Add <h2> tags to sections with content from guide
4. Add alt text to all images
5. Update button text
6. Test website at: http://localhost:3000

All changes maintain your current UI/design!
No functionality or interface changes needed.
*/
