import React, { useState, useCallback, useEffect } from 'react'
import Toast, { registerToastCallback } from './Toast'
import './Toast.css'

function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    registerToastCallback((toast) => {
      setToasts(prev => [...prev, toast])
    })
  }, [])

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
}

export default ToastContainer
