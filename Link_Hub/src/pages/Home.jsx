import React from 'react'
import { FaPlus, FaLink, FaShareAlt, FaChartBar } from 'react-icons/fa'
import './Home.css'

function Home() {
  return (
    <div className="home-container fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Link Hub</h1>
          <p>Manage, organize, and share your links with ease</p>
          <button className="cta-button">Get Started</button>
        </div>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card glass glass-hover">
            <div className="feature-icon">
              <FaLink />
            </div>
            <h3>Link Management</h3>
            <p>Create, organize, and manage all your important links in one place</p>
          </div>

          <div className="feature-card glass glass-hover">
            <div className="feature-icon">
              <FaShareAlt />
            </div>
            <h3>Easy Sharing</h3>
            <p>Share your link collections with others using simple, shareable URLs</p>
          </div>

          <div className="feature-card glass glass-hover">
            <div className="feature-icon">
              <FaChartBar />
            </div>
            <h3>Analytics</h3>
            <p>Track link clicks and get insights into your most used links</p>
          </div>

          <div className="feature-card glass glass-hover">
            <div className="feature-icon">
              <FaPlus />
            </div>
            <h3>Custom Collections</h3>
            <p>Group links into categories and create custom collections for better organization</p>
          </div>
        </div>
      </section>

      <section className="dashboard-preview">
        <div className="preview-card glass">
          <h2>Your Dashboard</h2>
          <div className="dashboard-placeholder">
            <div className="placeholder-item glass"></div>
            <div className="placeholder-item glass"></div>
            <div className="placeholder-item glass"></div>
          </div>
          <p>Access your dashboard to manage all your links and collections</p>
        </div>
      </section>
    </div>
  )
}

export default Home
