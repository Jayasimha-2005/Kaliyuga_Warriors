import React, { useEffect, useMemo, useState } from 'react'
import './TextType.css'

function TextType({
  text,
  texts,
  typingSpeed = 50,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  ...props
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const textArray = useMemo(() => {
    const source = Array.isArray(texts) ? texts : Array.isArray(text) ? text : [text || '']
    return source.filter(Boolean)
  }, [text, texts])

  useEffect(() => {
    if (textArray.length === 0) return undefined

    const currentText = textArray[currentTextIndex % textArray.length]
    let timeoutId

    if (!isDeleting && displayedText === currentText) {
      if (!loop && currentTextIndex === textArray.length - 1) {
        setIsComplete(true)
        return undefined
      }

      timeoutId = window.setTimeout(() => {
        setIsDeleting(true)
      }, pauseDuration)
    } else if (isDeleting && displayedText === '') {
      setIsComplete(false)
      setIsDeleting(false)
      setCurrentTextIndex((index) => (index + 1) % textArray.length)
      timeoutId = window.setTimeout(() => {}, 0)
    } else {
      setIsComplete(false)
      timeoutId = window.setTimeout(() => {
        if (isDeleting) {
          setDisplayedText((value) => value.slice(0, -1))
        } else {
          const nextLength = displayedText.length + 1
          setDisplayedText(currentText.slice(0, nextLength))
        }
      }, isDeleting ? deletingSpeed : typingSpeed)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [
    currentTextIndex,
    displayedText,
    isDeleting,
    loop,
    pauseDuration,
    deletingSpeed,
    typingSpeed,
    textArray
  ])

  if (textArray.length === 0) {
    return null
  }

  return (
    <span className={`text-type ${className}`.trim()} {...props}>
      <span className="text-type__content">{displayedText}</span>
      {showCursor && !isComplete && (
        <span
          className="text-type__cursor"
          style={{ animationDuration: `${cursorBlinkDuration}s` }}
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}

export default TextType
