import React, { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './App.css';

const skills = [
  {
    name: 'React.js',
    pct: 80,
    desc: 'Building reusable components and modern UIs with clean state management.'
  },
  {
    name: 'JavaScript',
    pct: 85,
    desc: 'Dynamic client-side and server-side scripting across projects.'
  },
  {
    name: 'HTML5 / CSS3',
    pct: 92,
    desc: 'Semantic markup, responsive layouts and polished styling.'
  },
  {
    name: 'Node.js / Express',
    pct: 65,
    desc: 'REST APIs and backend services for web and mobile apps.'
  },
  {
    name: 'Python (NLP / ML)',
    pct: 75,
    desc: 'NLP models, machine learning, data analysis and automation scripts.'
  },
  {
    name: 'Flutter',
    pct: 60,
    desc: 'Cross-platform mobile apps with backend API integration.'
  },
  {
    name: 'Automation / Scraping',
    pct: 70,
    desc: 'Selenium and BeautifulSoup for automated workflows and data extraction.'
  },
  {
    name: 'Git & Database',
    pct: 80,
    desc: 'Version control, data modeling and query optimization.'
  }
];

const projects = [
  {
    num: '01',
    name: 'Registration Form App',
    problem: 'Forms without validation lead to bad data and poor user experience.',
    solution:
      'Built a fully responsive form with client-side validation, reduced invalid submissions and improved data accuracy.',
    tags: ['JavaScript', 'HTML5', 'CSS3']
  },
  {
    num: '02',
    name: 'Voting System Web App',
    problem: 'Online voting is vulnerable to duplicate entries and data tampering.',
    solution:
      'Built a secure platform with user authentication, vote management, and duplicate-prevention logic ensuring data integrity.',
    tags: ['Node.js', 'JavaScript', 'Database']
  },
  {
    num: '03',
    name: 'Language Identifier (NLP)',
    problem: "Detecting language from raw text manually doesn't scale.",
    solution:
      'Trained a classification model using NLP techniques to automatically identify language from text input with high accuracy.',
    tags: ['Python', 'NLP', 'Machine Learning']
  },
  {
    num: '04',
    name: 'USA Data Manipulation',
    problem: 'Large raw datasets are messy and extremely slow to process manually.',
    solution:
      'Automated data cleaning, transformation and insight extraction, eliminating hours of repetitive manual work.',
    tags: ['Python', 'Pandas', 'Data Analysis']
  },
  {
    num: '05',
    name: 'Secure Notepad',
    problem: 'Most local note apps store sensitive data as plain text, a real security risk.',
    solution:
      'Built an encrypted note-taking app that protects sensitive data locally using strong encryption techniques.',
    tags: ['Python', 'Encryption', 'Security']
  },
  {
    num: '06',
    name: 'Flutter Backend Integration',
    problem: 'Mobile apps without proper backend sync face data inconsistency and slow performance.',
    solution:
      'Connected Flutter app to a Node.js backend via REST APIs, handled real-time data flow and improved app performance.',
    tags: ['Flutter', 'Node.js', 'REST API']
  }
];

const experienceItems = [
  'Delivered freelance projects for multiple clients across web and mobile from requirement gathering to deployment.',
  'Built and deployed full-stack applications end-to-end covering frontend, backend, and database layers.',
  'Developed AI/NLP systems for intelligent text classification and automated data processing at scale.',
  'Implemented secure authentication and encryption systems across multiple real-world projects.',
  'Automated manual workflows using Python, Selenium and BeautifulSoup to save repetitive effort.',
  'Delivered cross-platform solutions spanning web, mobile and AI with strong focus on performance.'
];

function App() {
  const starsCanvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = cursorRingRef.current;

    if (!cursor || !ring) {
      return undefined;
    }

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let frameId = 0;

    const onMove = (event) => {
      mx = event.clientX;
      my = event.clientY;
    };

    const animateCursor = () => {
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      frameId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', onMove);
    animateCursor();

    const interactives = Array.from(document.querySelectorAll('a, button'));

    const growRing = () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
    };

    const shrinkRing = () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
    };

    interactives.forEach((el) => {
      el.addEventListener('mouseenter', growRing);
      el.addEventListener('mouseleave', shrinkRing);
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', growRing);
        el.removeEventListener('mouseleave', shrinkRing);
      });
    };
  }, []);

  useEffect(() => {
    const canvas = starsCanvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let frameId = 0;
    let stars = [];

    const initStars = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.6 + 0.2
      }));
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.o += (Math.random() - 0.5) * 0.02;
        star.o = Math.max(0.1, Math.min(0.8, star.o));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,230,255,${star.o})`;
        ctx.fill();
      });

      frameId = requestAnimationFrame(drawStars);
    };

    initStars();
    drawStars();

    window.addEventListener('resize', initStars);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', initStars);
    };
  }, []);

  useEffect(() => {
    const reveals = Array.from(document.querySelectorAll('.reveal'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Number(entry.target.getAttribute('data-delay') || 0) * 80;
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => revealObserver.observe(el));

    const skillItems = Array.from(document.querySelectorAll('.skill-item'));

    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target.querySelector('.skill-fill');
            if (fill) {
              const widthValue = fill.getAttribute('data-width');
              fill.style.width = `${widthValue}%`;
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    skillItems.forEach((el) => skillObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      skillObserver.disconnect();
    };
  }, []);

  return (
    <>
      <canvas id="stars" ref={starsCanvasRef} />
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      <svg className="shape" style={{ top: '20%', right: '8%', animationDelay: '0s' }} width="80" height="80" viewBox="0 0 80 80">
        <polygon points="40,5 75,20 75,60 40,75 5,60 5,20" fill="none" stroke="#00e5ff" strokeWidth="1.5" />
      </svg>
      <svg className="shape" style={{ top: '55%', right: '3%', animationDelay: '2s', animationDuration: '10s' }} width="50" height="50" viewBox="0 0 50 50">
        <rect x="10" y="10" width="30" height="30" fill="none" stroke="#ff4f7b" strokeWidth="1.5" transform="rotate(20,25,25)" />
      </svg>
      <svg className="shape" style={{ top: '75%', left: '4%', animationDelay: '4s' }} width="60" height="60" viewBox="0 0 60 60">
        <polygon points="30,5 55,50 5,50" fill="none" stroke="#00bfa5" strokeWidth="1.5" />
      </svg>

      <nav>
        <div className="nav-logo">Aqib Faraz</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="hero">
        <div className="hero-inner">
          <div className="hero-tag"><span /> Full-Stack Developer</div>
          <h1 className="hero-h1">Hi, I&apos;m<br /><span className="name-highlight">Aqib Faraz</span></h1>
          <p className="hero-sub">
            I build real solutions, web apps, mobile applications, and AI-powered tools. Delivered for multiple clients.
            Focused on clean code, real impact, and scalable architecture.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-outline">Hire Me</a>
          </div>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>

      <section id="about">
        <div className="section-wrap">
          <div className="section-label reveal">About Me</div>
          <h2 className="section-title reveal">Problem-first.<br />Solution-driven.</h2>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                I&apos;m a <strong>Full-Stack Developer</strong> with hands-on freelance experience across web, mobile, and AI domains.
                I&apos;ve worked with <strong>multiple clients</strong> to deliver functional, scalable applications.
              </p>
              <p>
                My approach is not just about building features, it is about <strong>understanding the problem first</strong>, then engineering
                the right solution. From secure backend systems to intelligent NLP tools and responsive frontends.
              </p>
              <p>Clean code, real impact, scalable architecture, that is how I work.</p>
            </div>
            <div className="about-stats reveal">
              <div className="stat-card"><div className="stat-num">6+</div><div className="stat-lbl">Projects Delivered</div></div>
              <div className="stat-card"><div className="stat-num">3+</div><div className="stat-lbl">Domains Covered</div></div>
              <div className="stat-card"><div className="stat-num">8+</div><div className="stat-lbl">Technologies Used</div></div>
              <div className="stat-card"><div className="stat-num">∞</div><div className="stat-lbl">Problems Solved</div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills">
        <div className="section-wrap">
          <div className="section-label reveal">Tech Stack</div>
          <h2 className="section-title reveal">What I Work With</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <div className="skill-item reveal" data-delay={index} key={skill.name}>
                <div className="skill-top">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-pct">{skill.pct}%</span>
                </div>
                <div className="skill-bar">
                  <div className="skill-fill" data-width={skill.pct} />
                </div>
                <div className="skill-desc">{skill.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects">
        <div className="section-wrap">
          <div className="section-label reveal">Work</div>
          <h2 className="section-title reveal">Projects &amp; Solutions</h2>
          <div className="projects-grid">
            {projects.map((project) => (
              <div className="project-card reveal" key={project.num}>
                <div className="project-num">{project.num}</div>
                <div className="project-name">{project.name}</div>
                <div className="project-problem">
                  <div className="problem-label">Problem</div>
                  <div className="problem-text">{project.problem}</div>
                </div>
                <div className="project-solution">
                  <div className="solution-label">Solution</div>
                  <div className="solution-text">{project.solution}</div>
                </div>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={`${project.num}-${tag}`}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience">
        <div className="section-wrap">
          <div className="section-label reveal">Background</div>
          <h2 className="section-title reveal">Experience &amp; Achievements</h2>
          <div className="exp-list">
            {experienceItems.map((item, index) => (
              <div className="exp-card reveal" key={index}>
                <div className="exp-dot" />
                <div className="exp-text">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="section-wrap">
          <div className="contact-inner">
            <div className="contact-cta reveal">
              <div className="section-label">Contact</div>
              <h3>Let&apos;s build something<br /><span>meaningful.</span></h3>
              <p>
                Available for freelance projects in web, mobile, and AI development. Let&apos;s talk about your idea and
                turn it into a working solution.
              </p>
              <a href="mailto:Aqibfahraz@gmail.com" className="btn-primary">Send Email</a>
            </div>
            <div className="contact-info reveal">
              <a href="mailto:Aqibfahraz@gmail.com" className="contact-item">
                <div className="contact-icon">📧</div>
                Aqibfahraz@gmail.com
              </a>
              <a href="tel:+923033961515" className="contact-item">
                <div className="contact-icon">📞</div>
                +92 303 3961515
              </a>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                Karachi, Pakistan
              </div>
              <a href="https://github.com/aqibfaraz" target="_blank" rel="noreferrer" className="contact-item">
                <div className="contact-icon"><FaGithub aria-hidden="true" /></div>
                github.com/aqibfaraz
              </a>
              <a href="https://www.linkedin.com/in/aqib-faraz-99848638b/" target="_blank" rel="noreferrer" className="contact-item">
                <div className="contact-icon"><FaLinkedin aria-hidden="true" /></div>
                linkedin.com/in/aqib-faraz-99848638b
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        Designed &amp; Built by <span>Aqib Faraz</span> - Full-Stack &amp; AI Developer
      </footer>
    </>
  );
}

export default App;
