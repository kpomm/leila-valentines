import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import emailjs from '@emailjs/browser'
import './App.css'

function App() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [message, setMessage] = useState('')
  const [messageVisible, setMessageVisible] = useState(false)
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 })
  const [yesClicked, setYesClicked] = useState(false)
  const [noClickCount, setNoClickCount] = useState(0)
  const [imageAnimating, setImageAnimating] = useState(false)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const messageRef = useRef<HTMLDivElement>(null)

  const niceTryMessages = [
    "Nice try! 😊",
    "Not so fast! 💕",
    "Come on, you know you want to! 😉",
    "Try again! 💖",
    "You can't escape! 😄",
    "Almost got it! 😊",
    "Keep trying! 💝",
    "You're so close! 😘",
    "One more time! 💗",
    "I believe in you! 💕",
    "Don't give up! 💪",
    "The button has a mind of its own! 🧠",
    "Nope, not today! 😏",
    "You're persistent, I'll give you that! 😅",
    "Still trying? 😂",
    "This is getting interesting! 🎭",
    "The button says no! 🚫",
    "Nice reflexes, but not fast enough! ⚡",
    "You're making this fun! 🎮",
    "The button is shy! 😳",
    "It's playing hard to get! 💃",
    "Button.exe has stopped responding! 💻",
    "404: Yes button not found! 🔍",
    "The button is on vacation! 🏖️",
    "Error: Cannot click button! ❌",
    "This button is too cool for you! 😎",
    "The button has left the chat! 💬",
    "Button is currently unavailable! 📴"
  ]

  const sendEmail = async (buttonType: 'yes' | 'no') => {
    try {
      // EmailJS configuration
      // You'll need to set up EmailJS and add your service ID, template ID, and public key
      // For now, this will fail silently if not configured
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || ''
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: 'klpommerening@gmail.com',
            button_type: buttonType,
            timestamp: new Date().toISOString(),
            message: buttonType === 'yes' ? 'She said YES! 🎉' : 'She tried to click NO 😄',
            reply_to: 'klpommerening@gmail.com'
          },
          publicKey
        )
      }
    } catch (error) {
      // Silently fail if EmailJS is not configured
      console.log('EmailJS not configured or error:', error)
    }
  }

  const handleNoClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default to avoid any unwanted behaviors on mobile
    e.preventDefault()
    e.stopPropagation()
    
    if (noButtonRef.current) {
      const button = noButtonRef.current
      const buttonRect = button.getBoundingClientRect()
      
      // Calculate random position within viewport bounds
      const padding = window.innerWidth <= 480 ? 15 : 20
      const maxX = Math.max(0, window.innerWidth - buttonRect.width - padding)
      const maxY = Math.max(0, window.innerHeight - buttonRect.height - padding)
      
      // Ensure we don't go negative
      const randomX = Math.max(0, Math.random() * maxX)
      const randomY = Math.max(0, Math.random() * maxY)
      
      setNoButtonPosition({ x: randomX, y: randomY })
      
      // Increment no click count
      setNoClickCount(prev => prev + 1)
      
      // Clear any existing message timeout
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
      
      // Hide any existing message first
      setMessageVisible(false)
      
      // Calculate random position for message within viewport bounds
      // Estimate message size (will be measured if ref exists)
      const estimatedMessageWidth = 200
      const estimatedMessageHeight = 60
      const messagePadding = 20
      const messageMaxX = Math.max(0, window.innerWidth - estimatedMessageWidth - messagePadding)
      const messageMaxY = Math.max(0, window.innerHeight - estimatedMessageHeight - messagePadding)
      
      // Generate random position, avoiding the button area
      const buttonX = buttonRect.left
      const buttonY = buttonRect.top
      const buttonWidth = buttonRect.width
      const buttonHeight = buttonRect.height
      
      let messageRandomX, messageRandomY
      let attempts = 0
      do {
        messageRandomX = Math.random() * messageMaxX
        messageRandomY = Math.random() * messageMaxY
        attempts++
        // Check if position overlaps with button (with some margin)
        const margin = 50
        const overlaps = (
          messageRandomX < buttonX + buttonWidth + margin &&
          messageRandomX + estimatedMessageWidth > buttonX - margin &&
          messageRandomY < buttonY + buttonHeight + margin &&
          messageRandomY + estimatedMessageHeight > buttonY - margin
        )
        if (!overlaps || attempts > 10) break
      } while (attempts < 10)
      
      setMessagePosition({ x: messageRandomX, y: messageRandomY })
      
      // Show random "nice try" message after a brief delay to ensure clean state
      setTimeout(() => {
        const randomMessage = niceTryMessages[Math.floor(Math.random() * niceTryMessages.length)]
        setMessage(randomMessage)
        setMessageVisible(true)
        
        // Hide message after 2 seconds
        messageTimeoutRef.current = setTimeout(() => {
          setMessageVisible(false)
        }, 2000)
      }, 50)
      
      // Send email notification
      sendEmail('no')
    }
  }

  // Auto-bounce the No button around
  useEffect(() => {
    if (yesClicked) return // Don't bounce if yes was clicked
    
    const moveButton = () => {
      if (noButtonRef.current && !yesClicked) {
        const button = noButtonRef.current
        const buttonRect = button.getBoundingClientRect()
        
        // Calculate random position within viewport bounds
        const padding = window.innerWidth <= 480 ? 15 : 20
        const maxX = Math.max(0, window.innerWidth - buttonRect.width - padding)
        const maxY = Math.max(0, window.innerHeight - buttonRect.height - padding)
        
        const randomX = Math.max(0, Math.random() * maxX)
        const randomY = Math.max(0, Math.random() * maxY)
        
        setNoButtonPosition({ x: randomX, y: randomY })
      }
    }
    
    // Ensure button stays within bounds on window resize
    const handleResize = () => {
      if (noButtonRef.current && !yesClicked) {
        // Just move the button to a new position when window resizes
        moveButton()
      }
    }
    
    // Move immediately on mount
    moveButton()
    
    // Then move every 0.8 seconds (higher frequency)
    const interval = setInterval(moveButton, 800)
    
    // Handle window resize
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [yesClicked])

  // Cleanup message timeout on unmount or when yes is clicked
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [])

  const handleYesClick = () => {
    setYesClicked(true)
    // Start image animation immediately
    setImageAnimating(true)
    
    // Stop animation after 5 seconds (matches animation duration)
    setTimeout(() => {
      setImageAnimating(false)
    }, 5000)
    
    // Confetti animation
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)

    // Send email notification
    sendEmail('yes')
  }

  return (
    <div className="valentine-container" ref={containerRef}>
      <div className="content">
        {!yesClicked ? (
          <>
            <div className="image-container">
              <motion.img 
                src="/leila.jpg.png" 
                alt="Leila" 
                className="valentine-image"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeIn" }}
              />
            </div>
            <h1 className="question">Will you be my valentine?</h1>
            <div className="buttons-container">
              <button 
                className="yes-button" 
                onClick={handleYesClick}
              >
                Yes! 💖
              </button>
              <button
                ref={noButtonRef}
                className="no-button"
                onClick={handleNoClick}
                onTouchStart={handleNoClick}
                style={{
                  position: 'fixed',
                  left: `${noButtonPosition.x}px`,
                  top: `${noButtonPosition.y}px`,
                  transition: 'left 0.1s ease-out, top 0.1s ease-out'
                }}
              >
                No
        </button>
            </div>
            <AnimatePresence>
              {messageVisible && (
                <motion.div 
                  ref={messageRef}
                  className="message"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'fixed',
                    left: `${messagePosition.x}px`,
                    top: `${messagePosition.y}px`,
                    transform: 'translate(0, 0)'
                  }}
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="success-message">
            <div className="image-container">
              <motion.img 
                src="/leila.jpg.png" 
                alt="Leila" 
                className="valentine-image success-image"
                initial={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                animate={imageAnimating ? {
                  x: [0, 100, -80, 120, -100, 90, -110, 100, -90, 80, -70, 60, -50, 40, -30, 20, -10, 0],
                  y: [0, -100, -80, -120, -60, -110, -70, -100, -50, -90, -40, -70, -30, -50, -20, -30, -10, 0],
                  rotate: [0, 360, -360, 720, -180, 540, -270, 360, -180, 270, -90, 180, -45, 90, -30, 45, -15, 0],
                  scale: [1, 1.3, 1.1, 1.4, 1.2, 1.35, 1.15, 1.3, 1.1, 1.25, 1.05, 1.2, 1.1, 1.15, 1.05, 1.1, 1.02, 1],
                  opacity: 1
                } : {
                  y: [0, -10, 0],
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  rotate: 0
                }}
                transition={imageAnimating ? {
                  duration: 5,
                  ease: [0.17, 0.67, 0.83, 0.67], // Custom easing for bouncy feel
                  times: [0, 0.055, 0.11, 0.166, 0.222, 0.277, 0.333, 0.388, 0.444, 0.5, 0.555, 0.611, 0.666, 0.722, 0.777, 0.833, 0.888, 1],
                  repeat: 0
                } : {
                  y: {
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0 },
                  x: { duration: 0 },
                  rotate: { duration: 0 },
                  scale: { duration: 0 }
                }}
              />
            </div>
            <h1>Yay! 🎉💕</h1>
            {noClickCount <= 5 ? (
              <>
                <p>I love you! 💕</p>
                <p>Reconsider how many times you clicked the no button xo</p>
              </>
            ) : (
              <>
                <p>How many times did you click no? {noClickCount} {noClickCount === 1 ? 'time' : 'times'}! 😄</p>
                <p>I love you! 😘</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
