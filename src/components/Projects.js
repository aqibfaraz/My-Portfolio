import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'Registration Form App',
      description: 'A comprehensive user registration form application with validation and data management features.',
      technologies: ['JavaScript', 'HTML', 'CSS'],
      github: 'https://github.com/aqibfaraz/registration-form-app',
      demo: 'https://github.com/aqibfaraz/registration-form-app'
    },
    {
      title: 'Voting System Web Dev Project',
      description: 'A complete web-based voting system with secure authentication and real-time vote counting.',
      technologies: ['JavaScript', 'Node.js', 'Database'],
      github: 'https://github.com/aqibfaraz/Voting-System-Web-Dev-Project',
      demo: 'https://github.com/aqibfaraz/Voting-System-Web-Dev-Project'
    },
    {
      title: 'Language Identifier NLP Project',
      description: 'Natural Language Processing project that identifies and classifies different languages from text input.',
      technologies: ['Python', 'NLP', 'Machine Learning'],
      github: 'https://github.com/aqibfaraz/Language-Identifier-NLP-Project',
      demo: 'https://github.com/aqibfaraz/Language-Identifier-NLP-Project'
    },
    {
      title: 'USA Data Manipulation Project',
      description: 'Data analysis and manipulation project focused on USA datasets with visualization and insights.',
      technologies: ['Python', 'Pandas', 'Data Analysis'],
      github: 'https://github.com/aqibfaraz/USA-Data-Manipulation-Project',
      demo: 'https://github.com/aqibfaraz/USA-Data-Manipulation-Project'
    },
    {
      title: 'Secure Noted Pad',
      description: 'Information Security project featuring encrypted notepad with secure data storage and password protection.',
      technologies: ['Python', 'Encryption', 'Security'],
      github: 'https://github.com/aqibfaraz/Secure-Noted-Pad-Infomation-Security-Project',
      demo: 'https://github.com/aqibfaraz/Secure-Noted-Pad-Infomation-Security-Project'
    },
    {
      title: 'Flutter Backend',
      description: 'Backend service built for Flutter applications with REST API endpoints and database integration.',
      technologies: ['JavaScript', 'Node.js', 'API'],
      github: 'https://github.com/aqibfaraz/Flutter-backend',
      demo: 'https://github.com/aqibfaraz/Flutter-backend'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaGithub /> Code
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaExternalLinkAlt /> Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
