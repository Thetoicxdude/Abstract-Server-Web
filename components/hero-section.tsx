"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Copy, Check, MessageCircle, ChevronDown, Users, UserCheck, Clock, Gamepad2, Shield, Zap, Sparkles, Star, Globe, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

const SERVER_IP = "play.abstract.mc"
const DISCORD_LINK = "https://discord.gg/abstract"

// Canvas particle system with mouse interaction
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    alpha: number
    life: number
  }>>([])

  // Shooting stars ref
  const shootingStarsRef = useRef<Array<{
    x: number
    y: number
    length: number
    speed: number
    angle: number
    opacity: number
    thickness: number
    trail: Array<{ x: number; y: number; opacity: number }>
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    const colors = ["rgba(147,51,234,", "rgba(99,102,241,", "rgba(59,130,246,", "rgba(168,85,247,"]
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        life: Math.random() * 100
      })
    }

    // Create shooting star function
    const createShootingStar = () => {
      const startX = Math.random() * canvas.width * 0.8
      const startY = Math.random() * canvas.height * 0.3
      shootingStarsRef.current.push({
        x: startX,
        y: startY,
        length: Math.random() * 150 + 80,
        speed: Math.random() * 20 + 15,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        thickness: Math.random() * 2 + 1,
        trail: []
      })
    }

    // Spawn shooting stars periodically
    const shootingStarInterval = setInterval(() => {
      if (Math.random() > 0.5 && shootingStarsRef.current.length < 5) {
        createShootingStar()
      }
    }, 800)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      
      // Add particles on mouse move
      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          life: 60
        })
      }
    }

    const handleClick = (e: MouseEvent) => {
      // Burst particles on click
      for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2 * i) / 20
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * (Math.random() * 3 + 2),
          vy: Math.sin(angle) * (Math.random() * 3 + 2),
          size: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 80
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between close particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(147,51,234,${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        })
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        // Mouse attraction
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          p.vx += (dx / dist) * 0.02
          p.vy += (dy / dist) * 0.02
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        p.life -= 0.5
        p.alpha = Math.min(p.alpha, p.life / 60)

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle with glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ")"
        ctx.shadowBlur = 15
        ctx.shadowColor = p.color + "0.5)"
        ctx.fill()
        ctx.shadowBlur = 0

        return p.life > 0 || p.alpha > 0.1
      })

      // Maintain minimum particle count
      while (particlesRef.current.length < 60) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.2,
          life: 100 + Math.random() * 100
        })
      }

      // Update and draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter(star => {
        // Add current position to trail
        star.trail.push({ x: star.x, y: star.y, opacity: star.opacity })
        if (star.trail.length > 30) star.trail.shift()

        // Move star
        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed
        star.opacity -= 0.012

        // Draw trail with gradient
        if (star.trail.length > 1) {
          for (let i = 1; i < star.trail.length; i++) {
            const t1 = star.trail[i - 1]
            const t2 = star.trail[i]
            const trailOpacity = (i / star.trail.length) * star.opacity * 0.8
            
            ctx.beginPath()
            ctx.moveTo(t1.x, t1.y)
            ctx.lineTo(t2.x, t2.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${trailOpacity})`
            ctx.lineWidth = star.thickness * (i / star.trail.length)
            ctx.lineCap = "round"
            ctx.stroke()
          }
        }

        // Draw main shooting star head
        const headGradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.thickness * 4
        )
        headGradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        headGradient.addColorStop(0.3, `rgba(200, 180, 255, ${star.opacity * 0.8})`)
        headGradient.addColorStop(1, "transparent")
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.thickness * 4, 0, Math.PI * 2)
        ctx.fillStyle = headGradient
        ctx.fill()

        // Draw core
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.thickness, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Sparkle particles along trail
        if (Math.random() > 0.7) {
          particlesRef.current.push({
            x: star.x + (Math.random() - 0.5) * 10,
            y: star.y + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 0.5,
            color: "rgba(200,180,255,",
            alpha: star.opacity * 0.6,
            life: 30
          })
        }

        return star.opacity > 0 && star.x < canvas.width + 100 && star.y < canvas.height + 100
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      clearInterval(shootingStarInterval)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

// Animated ocean waves with multiple layers
function OceanWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
      {/* Wave layer 1 - slowest, back */}
      <svg className="absolute bottom-0 w-[200%] h-40 animate-[wave-slide_25s_linear_infinite]" viewBox="0 0 2880 140" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.15)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.05)" />
          </linearGradient>
        </defs>
        <path fill="url(#waveGrad1)">
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,60 Q360,100 720,60 T1440,60 T2160,60 T2880,60 L2880,140 L0,140 Z;
              M0,80 Q360,40 720,80 T1440,80 T2160,80 T2880,80 L2880,140 L0,140 Z;
              M0,60 Q360,100 720,60 T1440,60 T2160,60 T2880,60 L2880,140 L0,140 Z
            "
          />
        </path>
      </svg>

      {/* Wave layer 2 - medium */}
      <svg className="absolute bottom-0 w-[200%] h-36 animate-[wave-slide_18s_linear_infinite_reverse]" viewBox="0 0 2880 120" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147,51,234,0.2)" />
            <stop offset="50%" stopColor="rgba(99,102,241,0.2)" />
            <stop offset="100%" stopColor="rgba(147,51,234,0.2)" />
          </linearGradient>
        </defs>
        <path fill="url(#waveGrad2)">
          <animate
            attributeName="d"
            dur="6s"
            repeatCount="indefinite"
            values="
              M0,50 Q240,90 480,50 T960,50 T1440,50 T1920,50 T2400,50 T2880,50 L2880,120 L0,120 Z;
              M0,70 Q240,30 480,70 T960,70 T1440,70 T1920,70 T2400,70 T2880,70 L2880,120 L0,120 Z;
              M0,50 Q240,90 480,50 T960,50 T1440,50 T1920,50 T2400,50 T2880,50 L2880,120 L0,120 Z
            "
          />
        </path>
      </svg>

      {/* Wave layer 3 - fastest, front */}
      <svg className="absolute bottom-0 w-[200%] h-28 animate-[wave-slide_12s_linear_infinite]" viewBox="0 0 2880 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.25)" />
            <stop offset="100%" stopColor="rgba(99,102,241,0.1)" />
          </linearGradient>
        </defs>
        <path fill="url(#waveGrad3)">
          <animate
            attributeName="d"
            dur="4s"
            repeatCount="indefinite"
            values="
              M0,40 Q180,70 360,40 T720,40 T1080,40 T1440,40 T1800,40 T2160,40 T2520,40 T2880,40 L2880,100 L0,100 Z;
              M0,55 Q180,25 360,55 T720,55 T1080,55 T1440,55 T1800,55 T2160,55 T2520,55 T2880,55 L2880,100 L0,100 Z;
              M0,40 Q180,70 360,40 T720,40 T1080,40 T1440,40 T1800,40 T2160,40 T2520,40 T2880,40 L2880,100 L0,100 Z
            "
          />
        </path>
      </svg>

      {/* Foam/sparkle effect on waves */}
      <div className="absolute bottom-16 left-0 right-0 h-8">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/40"
            style={{
              left: `${(i * 5) + Math.random() * 3}%`,
              animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Center Moon with dreamy haze - larger and more prominent
function CenterMoon() {
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleMoonClick = () => {
    const id = Date.now()
    setRipples(prev => [...prev, { id, x: 50, y: 50 }])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id))
    }, 1500)
  }

  return (
    <div 
      className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-700 ease-out z-[5]"
      style={{
        transform: `translate(calc(-50% + ${(mousePos.x - 0.5) * 40}px), calc(-50% + ${(mousePos.y - 0.5) * 40}px))`
      }}
      onClick={handleMoonClick}
    >
      {/* Click ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 pointer-events-none"
          style={{
            animation: "ripple 1.5s ease-out forwards"
          }}
        />
      ))}

      {/* Outermost ethereal glow */}
      <div 
        className="absolute inset-0 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(226,232,240,0.06) 0%, rgba(147,51,234,0.02) 40%, transparent 70%)",
          filter: "blur(80px)",
          animation: "pulse 6s ease-in-out infinite"
        }}
      />
      
      {/* Secondary haze */}
      <div 
        className="absolute inset-0 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(203,213,225,0.1) 0%, rgba(99,102,241,0.04) 50%, transparent 70%)",
          filter: "blur(50px)",
          animation: "pulse 5s ease-in-out infinite reverse"
        }}
      />

      {/* Inner glow ring */}
      <div 
        className="absolute inset-0 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(203,213,225,0.06) 60%, transparent 75%)",
          filter: "blur(30px)",
        }}
      />
      
      {/* Moon body - larger */}
      <div 
        className="relative w-44 h-44 md:w-56 md:h-56 rounded-full transition-transform duration-300 hover:scale-105"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.98) 0%, rgba(226,232,240,0.8) 25%, rgba(203,213,225,0.6) 50%, rgba(148,163,184,0.4) 80%, rgba(100,116,139,0.2) 100%)",
          boxShadow: `
            0 0 100px 50px rgba(226,232,240,0.2),
            0 0 200px 100px rgba(203,213,225,0.1),
            0 0 300px 150px rgba(147,51,234,0.05),
            inset -15px -15px 40px rgba(148,163,184,0.5),
            inset 8px 8px 30px rgba(255,255,255,0.4)
          `
        }}
      >
        {/* Moon craters */}
        <div className="absolute w-8 h-8 rounded-full bg-slate-400/20 top-8 left-12 blur-[2px]" />
        <div className="absolute w-5 h-5 rounded-full bg-slate-400/15 top-16 left-24 blur-[1px]" />
        <div className="absolute w-6 h-6 rounded-full bg-slate-400/15 bottom-12 left-8 blur-[1px]" />
        <div className="absolute w-4 h-4 rounded-full bg-slate-400/10 top-20 right-10 blur-[1px]" />
        <div className="absolute w-3 h-3 rounded-full bg-slate-400/10 bottom-8 right-16 blur-[0.5px]" />
        
        {/* Main highlight */}
        <div 
          className="absolute w-16 h-12 rounded-full top-6 left-8 rotate-[-30deg]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
            filter: "blur(4px)"
          }}
        />

        {/* Secondary highlight */}
        <div 
          className="absolute w-6 h-4 rounded-full top-12 left-20 rotate-[-20deg]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
            filter: "blur(2px)"
          }}
        />
      </div>

      {/* Orbiting stars */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          style={{
            left: "50%",
            top: "50%",
            animation: `orbit${i + 1} ${8 + i * 3}s linear infinite`,
            boxShadow: "0 0 6px 2px rgba(255,255,255,0.5)"
          }}
        />
      ))}
    </div>
  )
}

// Typewriter effect
function TypeWriter({ 
  text, 
  delay = 0, 
  speed = 80,
  onComplete
}: { 
  text: string
  delay?: number
  speed?: number
  onComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let charIndex = 0

    const startTyping = () => {
      if (charIndex <= text.length) {
        setDisplayText(text.slice(0, charIndex))
        charIndex++
        timeout = setTimeout(startTyping, speed + Math.random() * 40)
      } else {
        setIsComplete(true)
        onComplete?.()
      }
    }

    const delayTimeout = setTimeout(startTyping, delay)

    return () => {
      clearTimeout(timeout)
      clearTimeout(delayTimeout)
    }
  }, [text, delay, speed, onComplete])

  useEffect(() => {
    if (!isComplete) {
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev)
      }, 530)
      return () => clearInterval(cursorInterval)
    }
    setShowCursor(false)
  }, [isComplete])

  return (
    <span>
      {displayText}
      <span 
        className={cn(
          "inline-block w-[4px] h-[0.85em] ml-1 bg-purple-400 align-middle transition-opacity",
          showCursor ? "opacity-100" : "opacity-0"
        )}
      />
    </span>
  )
}

// 3D Tilt Card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("")
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / 8
    const rotateY = (centerX - x) / 8

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`)
    setGlare({ 
      x: (x / rect.width) * 100, 
      y: (y / rect.height) * 100,
      opacity: 0.2
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
    setGlare({ x: 50, y: 50, opacity: 0 })
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn("relative transition-transform duration-300 ease-out", className)}
      style={{ transform, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
        }}
      />
    </div>
  )
}

// Magnetic button
function MagneticButton({ 
  children, 
  onClick, 
  className,
  href
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
  href?: string
}) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    setPosition({ x: x * 0.3, y: y * 0.3 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: position.x === 0 ? "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)" : "none"
  }

  const props = {
    ref: buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
    className,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  }

  if (href) {
    return (
      <a {...props} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button {...props} onClick={onClick}>
      {children}
    </button>
  )
}

// Animated counter
function AnimatedCounter({ 
  value, 
  suffix = "", 
  duration = 2000,
  delay = 0 
}: { 
  value: string
  suffix?: string
  duration?: number
  delay?: number
}) {
  const [display, setDisplay] = useState("0")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return

    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""))
    const hasK = value.includes("K")
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      
      let current = numericValue * eased
      
      if (hasK) {
        setDisplay(current.toFixed(1) + "K")
      } else if (value.includes(".")) {
        setDisplay(current.toFixed(1))
      } else {
        setDisplay(Math.floor(current).toString())
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(value)
      }
    }

    requestAnimationFrame(animate)
  }, [started, value, duration])

  return <span>{display}{suffix}</span>
}

export function HeroSection() {
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [titleComplete, setTitleComplete] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const stats = [
    { icon: Users, value: "127", suffix: "+", label: "玩家在線", color: "from-purple-500 to-violet-600" },
    { icon: UserCheck, value: "5.2K", suffix: "", label: "總註冊", color: "from-blue-500 to-cyan-500" },
    { icon: Clock, value: "99.9", suffix: "%", label: "運行時間", color: "from-indigo-500 to-purple-500" },
  ]

  const serverInfo = [
    { icon: Globe, label: "版本", value: "1.21.4" },
    { icon: Wifi, label: "延遲", value: "12ms" },
  ]

  return (
    <section
      id="home"
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-background to-blue-950/30" />
      
      {/* Interactive particle canvas */}
      <ParticleCanvas />
      
      {/* Center Moon with haze */}
      <CenterMoon />
      
      {/* Ocean waves */}
      <OceanWaves />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Side - Main Content */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg z-10">
            {/* Status badge */}
            <div 
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 transition-all duration-1000",
                "bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20",
                "border border-green-500/30 backdrop-blur-sm",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-xs font-medium text-green-300/90 tracking-wide">
                Server Online
              </span>
            </div>

            {/* Main title */}
            <h1 className="mb-2">
              <span 
                className={cn(
                  "block text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tight",
                  "font-[family-name:var(--font-orbitron)]"
                )}
                style={{
                  background: "linear-gradient(135deg, #c084fc 0%, #818cf8 30%, #60a5fa 60%, #a78bfa 100%)",
                  backgroundSize: "300% 300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "gradient-shift 6s ease infinite",
                  textShadow: "0 0 80px rgba(147,51,234,0.3)"
                }}
              >
                {mounted && (
                  <TypeWriter 
                    text="抽象伺服器" 
                    delay={300} 
                    speed={120}
                    onComplete={() => setTitleComplete(true)}
                  />
                )}
              </span>
            </h1>

            {/* English subtitle */}
            <p 
              className={cn(
                "text-xs tracking-[0.3em] text-purple-300/60 font-[family-name:var(--font-orbitron)] mb-4 transition-all duration-1000",
                titleComplete ? "opacity-100" : "opacity-0"
              )}
            >
              ABSTRACT SERVER
            </p>

            {/* Description */}
            <p 
              className={cn(
                "text-sm md:text-base max-w-md mb-6 leading-relaxed transition-all duration-1000",
                "text-foreground/60",
                titleComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              在<span className="text-purple-400 font-semibold">月色</span>與<span className="text-blue-400 font-semibold">海洋</span>之間，探索無限可能的 Minecraft 世界
            </p>

            {/* Action buttons */}
            <div 
              className={cn(
                "flex flex-col sm:flex-row items-center gap-3 transition-all duration-1000",
                titleComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "400ms" }}
            >
              <TiltCard>
                <MagneticButton
                  onClick={copyIP}
                  className={cn(
                    "group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl",
                    "font-bold text-sm text-white overflow-hidden",
                    "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600",
                    "shadow-[0_0_30px_rgba(147,51,234,0.4)]",
                    "hover:shadow-[0_0_50px_rgba(147,51,234,0.6)]",
                    "transition-shadow duration-300"
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative font-mono tracking-widest">{SERVER_IP}</span>
                  <span className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </span>
                  <div className="absolute inset-0 animate-shimmer" />
                </MagneticButton>
              </TiltCard>

              <TiltCard>
                <MagneticButton
                  href={DISCORD_LINK}
                  className={cn(
                    "group relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl",
                    "font-bold text-sm overflow-hidden",
                    "bg-gradient-to-r from-blue-600/20 to-indigo-600/20",
                    "border border-blue-500/30 backdrop-blur-sm",
                    "hover:border-blue-400/50 hover:bg-blue-500/20",
                    "transition-all duration-300"
                  )}
                >
                  <MessageCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span className="text-blue-100">Discord</span>
                </MagneticButton>
              </TiltCard>
            </div>
          </div>

          {/* Right Side - Stats & Info Cards */}
          <div className="flex flex-col gap-3 w-full max-w-xs z-10">
            {/* Stats cards */}
            {stats.map((stat, index) => (
              <TiltCard key={stat.label}>
                <div 
                  className={cn(
                    "relative p-4 rounded-xl overflow-hidden transition-all duration-700",
                    "bg-gradient-to-br from-white/5 to-white/[0.02]",
                    "border border-white/10 backdrop-blur-md",
                    "hover:border-white/20 hover:from-white/10 hover:to-white/5",
                    titleComplete ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                  )}
                  style={{ transitionDelay: `${600 + index * 150}ms` }}
                >
                  {/* Gradient accent */}
                  <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r", stat.color)} />
                  
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl",
                      "bg-gradient-to-br", stat.color, "bg-opacity-20"
                    )}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white font-[family-name:var(--font-orbitron)]">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={800 + index * 200} />
                      </div>
                      <div className="text-xs text-foreground/50">{stat.label}</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}

            {/* Server info card */}
            <TiltCard>
              <div 
                className={cn(
                  "relative p-4 rounded-xl overflow-hidden transition-all duration-700",
                  "bg-gradient-to-br from-purple-500/10 to-blue-500/10",
                  "border border-purple-500/20 backdrop-blur-md",
                  titleComplete ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                )}
                style={{ transitionDelay: "1050ms" }}
              >
                <div className="flex items-center justify-between">
                  {serverInfo.map((info, i) => (
                    <div key={info.label} className="flex items-center gap-2">
                      <info.icon className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-[10px] text-foreground/40 uppercase tracking-wider">{info.label}</div>
                        <div className="text-sm font-bold text-foreground/80">{info.value}</div>
                      </div>
                      {i === 0 && <div className="w-px h-8 bg-purple-500/20 mx-3" />}
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>

            {/* Quick features */}
            <div 
              className={cn(
                "flex gap-2 transition-all duration-700",
                titleComplete ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
              )}
              style={{ transitionDelay: "1200ms" }}
            >
              {[
                { icon: Gamepad2, label: "原創玩法" },
                { icon: Shield, label: "反作弊" },
                { icon: Zap, label: "低延遲" },
              ].map((feature) => (
                <div 
                  key={feature.label}
                  className="flex-1 flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
                >
                  <feature.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] text-foreground/60">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="text-[10px] text-muted-foreground/40 tracking-[0.3em] uppercase">Scroll</span>
        <div className="relative w-5 h-9 rounded-full border border-purple-500/30 flex justify-center">
          <div 
            className="absolute top-2 w-1 h-2 rounded-full bg-gradient-to-b from-purple-400 to-blue-400"
            style={{
              animation: "scroll-dot 2s ease-in-out infinite"
            }}
          />
        </div>
        <ChevronDown className="w-4 h-4 text-purple-400/50 animate-bounce" />
      </div>

      {/* Keyframe styles */}
      <style jsx>{`
        @keyframes wave-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(72deg) translateX(160px) rotate(-72deg); }
          to { transform: rotate(432deg) translateX(160px) rotate(-432deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(144deg) translateX(180px) rotate(-144deg); }
          to { transform: rotate(504deg) translateX(180px) rotate(-504deg); }
        }
        @keyframes orbit4 {
          from { transform: rotate(216deg) translateX(200px) rotate(-216deg); }
          to { transform: rotate(576deg) translateX(200px) rotate(-576deg); }
        }
        @keyframes orbit5 {
          from { transform: rotate(288deg) translateX(220px) rotate(-288deg); }
          to { transform: rotate(648deg) translateX(220px) rotate(-648deg); }
        }
        @keyframes ripple {
          0% { width: 0; height: 0; opacity: 0.8; }
          100% { width: 400px; height: 400px; opacity: 0; }
        }
        @keyframes scroll-dot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
      `}</style>
    </section>
  )
}
