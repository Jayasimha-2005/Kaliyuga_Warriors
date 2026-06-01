import React, { useState } from 'react'
import { FaInstagram } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  // try multiple logo sources: prefer the file present in public/assets, then fallback names
  const logoCandidates = [
    '/assets/KaliYuga_Warriors-logo.png',
    '/assets/kaliyuga-logo.png',
    '/assets/kaliyuga-logo.svg'
  ]
  const [logoIndex, setLogoIndex] = useState(0)
  const [logoFailed, setLogoFailed] = useState(false)

  return (
    <footer className="footer glass">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section brand">
            <div className="brand-inner">
              {/* Prefer external SVG logo; fall back to inline SVG if it fails */}
              {!logoFailed ? (
                <img
                  src={logoCandidates[logoIndex]}
                  alt="Kaliyugawarriors logo"
                  className="footer-logo"
                  onError={() => {
                    const next = logoIndex + 1
                    if (next < logoCandidates.length) {
                      setLogoIndex(next)
                    } else {
                      setLogoFailed(true)
                    }
                  }}
                />
              ) : (
                <svg
                  className="footer-logo"
                  width="56"
                  height="56"
                  viewBox="0 0 120 120"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Kaliyugawarriors logo"
                >
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#0ea5ff" />
                    </linearGradient>
                  </defs>
                  <rect width="120" height="120" rx="18" fill="#071133" />
                  <circle cx="60" cy="40" r="34" fill="url(#g1)" opacity="0.12" />
                  <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize="48" fontWeight="800" fill="#0f172a">KW</text>
                </svg>
              )}

              <div>
                <h3><span className="brand-name">Kaliyugawarriors</span></h3>
                <p>Manage and share your links effortlessly</p>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Dashboard</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a
                href="https://www.instagram.com/kaliyugawarriors?igsh=MTE5eW5jcXh5cXo2bA=="
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Kaliyugawarriors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
