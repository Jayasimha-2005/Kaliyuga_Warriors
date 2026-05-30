import React, { useState, useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'
import './Toast.css'

let toastId = 0
let toastCallback = null

/**
 * Register callback to show toast
 */
export const registerToastCallback = (callback) => {
  toastCallback = callback
}

/**
 * Show toast notification
 */
export const showToast = (message, type = 'success', duration = 3000) => {
  if (toastCallback) {
    toastCallback({
      id: ++toastId,
      message,
      type,
      duration
    })
  }
}

function Toast({ toast, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.duration, onClose])

  const toastClass = `toast toast-${toast.type} ${isVisible ? 'show' : 'hide'}`

  return (
    <div className={toastClass}>
      <div className="toast-icon">
        {toast.type === 'success' && <FaCheckCircle />}
        {toast.type === 'error' && <FaExclamationCircle />}
      </div>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => setIsVisible(false)}>
        <FaTimes />
      </button>
    </div>
  )
}

export default Toast
