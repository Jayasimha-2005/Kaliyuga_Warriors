import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaLink, FaSignOutAlt, FaHome, FaSpinner, FaEllipsisV, FaTimes } from 'react-icons/fa'
import { useAuth } from '../hooks/useCustomHooks'
import { subscribeToLinks } from '../services/linkService'
import AddLinkForm from '../components/AddLinkForm'
import EditLinkModal from '../components/EditLinkModal'
import LinksTable from '../components/LinksTable'
import ToastContainer from '../components/ToastContainer'
import { showToast } from '../components/Toast'
import './AdminDashboard.css'

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('add')
  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [editingLink, setEditingLink] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Subscribe to real-time links updates
  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToLinks(user.uid, (updatedLinks) => {
      setLinks(updatedLinks)
      setLinksLoading(false)
    })

    return unsubscribe
  }, [user])

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      showToast('👋 Logged out successfully', 'success')
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      showToast('Failed to logout', 'error')
    }
  }

  // Handle edit
  const handleEdit = (link) => {
    setEditingLink(link)
    setShowEditModal(true)
  }

  return (
    <div className="admin-dashboard fade-in">
      <ToastContainer />

      {/* Sidebar */}
      <aside className={`sidebar glass ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <button
              type="button"
              className="sidebar-collapse-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <FaEllipsisV /> : <FaTimes />}
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-title">ADMIN MENU</div>
              
              <button
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('overview')
                  setSidebarOpen(false)
                }}
              >
                <FaHome />
                <span>Overview</span>
              </button>

              <button
                className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('add')
                  setSidebarOpen(false)
                }}
              >
                <FaPlus />
                <span>Add Link</span>
              </button>

              <button
                className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('manage')
                  setSidebarOpen(false)
                }}
              >
                <FaLink />
                <span>Manage Links</span>
              </button>
            </div>

            <div className="nav-group">
              <div className="nav-group-title">ACCOUNT</div>
              
              <div className="user-info">
                <div className="user-avatar">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <p className="user-name">Admin</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>

              <button
                className="nav-link logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Welcome back!</h1>
                <p>Manage your links efficiently</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaLink />
                  </div>
                  <div className="stat-body">
                    <h3>{links.length}</h3>
                    <p>Total Links</p>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaPlus />
                  </div>
                  <div className="stat-body">
                    <h3>{links.filter(l => !l.isPublished).length}</h3>
                    <p>Drafts</p>
                  </div>
                </div>

                <div className="stat-card glass">
                  <div className="stat-icon">
                    <FaLink />
                  </div>
                  <div className="stat-body">
                    <h3>{links.filter(l => l.isPublished).length}</h3>
                    <p>Published</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <button
                  className="action-btn primary"
                  onClick={() => setActiveTab('add')}
                >
                  <FaPlus /> Add New Link
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => setActiveTab('manage')}
                >
                  <FaLink /> Manage Links
                </button>
              </div>
            </div>
          )}

          {/* Add Link Tab */}
          {activeTab === 'add' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Add New Link</h1>
                <p>Create a new link entry</p>
              </div>
              <AddLinkForm
                onLinkAdded={() => {
                  setActiveTab('manage')
                }}
              />
            </div>
          )}

          {/* Manage Links Tab */}
          {activeTab === 'manage' && (
            <div className="dashboard-content">
              <div className="dashboard-header">
                <h1>Manage Links</h1>
                <p>View, edit, and manage all your links</p>
              </div>
              <LinksTable
                links={links}
                loading={linksLoading}
                onEdit={handleEdit}
                onRefresh={() => {}} // Real-time subscription handles refresh
              />
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <EditLinkModal
          link={editingLink}
          onClose={() => {
            setShowEditModal(false)
            setEditingLink(null)
          }}
          onLinkUpdated={() => {}}
        />
      )}

      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

export default AdminDashboard
