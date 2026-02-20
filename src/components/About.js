import React from 'react';
import { FaCode, FaLaptopCode, FaRocket } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              Hi! I'm a passionate developer with expertise in building modern web applications. 
              I love creating user-friendly interfaces and solving complex problems with clean code.
            </p>
            <p className="about-description">
              With a strong foundation in both frontend and backend technologies, I bring ideas to life 
              by crafting responsive and performant applications that deliver great user experiences.
            </p>
          </div>
          <div className="about-cards">
            <div className="about-card">
              <div className="card-icon">
                <FaCode />
              </div>
              <h3>Clean Code</h3>
              <p>Writing maintainable and efficient code following best practices</p>
            </div>
            <div className="about-card">
              <div className="card-icon">
                <FaLaptopCode />
              </div>
              <h3>Responsive Design</h3>
              <p>Creating beautiful experiences across all devices and screen sizes</p>
            </div>
            <div className="about-card">
              <div className="card-icon">
                <FaRocket />
              </div>
              <h3>Fast Performance</h3>
              <p>Building optimized applications for speed and performance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
