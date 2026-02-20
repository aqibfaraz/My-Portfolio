import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo">
          <h2>My Portfolio</h2>
        </div>
        
        <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <li>
            <Link to="home" smooth={true} duration={500} onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="about" smooth={true} duration={500} onClick={toggleMenu}>
              About
            </Link>
          </li>
          <li>
            <Link to="skills" smooth={true} duration={500} onClick={toggleMenu}>
              Skills
            </Link>
          </li>
          <li>
            <Link to="projects" smooth={true} duration={500} onClick={toggleMenu}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="contact" smooth={true} duration={500} onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>

        <div className="hamburger" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
