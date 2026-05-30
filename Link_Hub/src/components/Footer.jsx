import React from 'react'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer glass">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Link Hub</h3>
            <p>Manage and share your links effortlessly</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Dashboard</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#github" className="social-icon">
                <FaGithub />
              </a>
              <a href="#twitter" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#linkedin" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Link Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
