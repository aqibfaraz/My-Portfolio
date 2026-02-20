import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h3 className="greeting">Hello, I'm</h3>
          <h1 className="name">Aqib Faraz</h1>
          <h2 className="title">Developer</h2>
          <p className="description">
            I create beautiful and functional websites with modern technologies.
            Passionate about building amazing user experiences.
          </p>
          <div className="hero-buttons">
            <a href="#contact" className="btn btn-primary">Freelance Work Available</a>
            <a href="#projects" className="btn btn-secondary">View Work</a>
          </div>
          <div className="social-links">
            <a href="https://github.com/aqibfaraz" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/aqib-faraz-99848638b/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-container">
            <img 
              src="/IMG-20251228-WA0015.jpg" 
              alt="Aqib Faraz" 
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="image-placeholder">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
