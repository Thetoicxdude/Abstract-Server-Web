"use client"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "revealing" | "complete">("loading")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Particles
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      hue: number
      trail: Array<{ x: number; y: number }>
    }> = []

    // Create initial particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.8 + 0.2,
        hue: Math.random() * 60 + 240, // Purple to blue
        trail: []
      })
    }

    // Shooting stars
    const shootingStars: Array<{
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
      active: boolean
    }> = []

    const createShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: 0,
        length: Math.random() * 100 + 50,
        speed: Math.random() * 15 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.5,
        opacity: 1,
        active: true
      })
    }

    // Moon
    const moon = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.4,
      radius: 60,
      glow: 0
    }

    let animationId: number
    let time = 0

    const animate = () => {
      ctx.fillStyle = "rgba(10, 5, 25, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.016

      // Update and draw particles
      particles.forEach((p) => {
        // Add current position to trail
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 10) p.trail.shift()

        // Move towards center during loading
        const centerX = canvas.width / 2
        const centerY = canvas.height / 2
        const dx = centerX - p.x
        const dy = centerY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (phase === "loading" && dist > 100) {
          p.x += dx * 0.002
          p.y += dy * 0.002
        } else if (phase === "revealing") {
          // Explode outward
          p.x -= dx * 0.05
          p.y -= dy * 0.05
        }

        p.x += p.speedX + Math.sin(time + p.y * 0.01) * 0.5
        p.y += p.speedY + Math.cos(time + p.x * 0.01) * 0.5

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw trail
        if (p.trail.length > 1) {
          ctx.beginPath()
          ctx.moveTo(p.trail[0].x, p.trail[0].y)
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y)
          }
          ctx.strokeStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.3})`
          ctx.lineWidth = p.size * 0.5
          ctx.stroke()
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`
        ctx.fill()

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4)
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.5})`)
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Shooting stars
      if (Math.random() < 0.02) createShootingStar()

      shootingStars.forEach((star, index) => {
        if (!star.active) return

        star.x += Math.cos(star.angle) * star.speed
        star.y += Math.sin(star.angle) * star.speed
        star.opacity -= 0.015

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          star.active = false
          return
        }

        // Draw shooting star
        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        )
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Head glow
        const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 10)
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        headGlow.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(star.x, star.y, 10, 0, Math.PI * 2)
        ctx.fillStyle = headGlow
        ctx.fill()
      })

      // Draw moon with glow
      moon.glow = 0.5 + Math.sin(time * 2) * 0.2

      // Outer glow layers
      for (let i = 5; i > 0; i--) {
        const gradient = ctx.createRadialGradient(
          moon.x, moon.y, moon.radius,
          moon.x, moon.y, moon.radius + i * 40
        )
        gradient.addColorStop(0, `rgba(200, 180, 255, ${0.1 * moon.glow / i})`)
        gradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(moon.x, moon.y, moon.radius + i * 40, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Moon body
      const moonGradient = ctx.createRadialGradient(
        moon.x - 20, moon.y - 20, 0,
        moon.x, moon.y, moon.radius
      )
      moonGradient.addColorStop(0, "#f0f0ff")
      moonGradient.addColorStop(0.5, "#d0d0e8")
      moonGradient.addColorStop(1, "#a0a0c0")
      ctx.beginPath()
      ctx.arc(moon.x, moon.y, moon.radius, 0, Math.PI * 2)
      ctx.fillStyle = moonGradient
      ctx.fill()

      // Moon craters
      const craters = [
        { x: -15, y: -20, r: 8 },
        { x: 20, y: 10, r: 12 },
        { x: -5, y: 25, r: 6 },
        { x: 25, y: -15, r: 5 },
      ]
      craters.forEach((crater) => {
        ctx.beginPath()
        ctx.arc(moon.x + crater.x, moon.y + crater.y, crater.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(150, 150, 180, 0.3)"
        ctx.fill()
      })

      // Clean up inactive shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        if (!shootingStars[i].active) shootingStars.splice(i, 1)
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      moon.x = canvas.width * 0.5
      moon.y = canvas.height * 0.4
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [phase])

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase("revealing")
          setTimeout(() => {
            setPhase("complete")
            setTimeout(onComplete, 500)
          }, 1000)
          return 100
        }
        return prev + Math.random() * 3 + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  if (phase === "complete") return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden",
        "bg-[#0a0518]",
        phase === "revealing" && "animate-out fade-out duration-1000"
      )}
    >
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Mouse follow glow */}
      <div
        className="pointer-events-none fixed w-[600px] h-[600px] rounded-full opacity-30 transition-all duration-300 ease-out"
        style={{
          left: mousePos.x - 300,
          top: mousePos.y - 300,
          background: "radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(59,130,246,0.2) 40%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo / Title */}
        <div className="relative mb-12">
          {/* Orbiting rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute w-40 h-40 rounded-full border border-purple-500/30"
              style={{
                animation: "spin 8s linear infinite",
              }}
            >
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
            <div
              className="absolute w-52 h-52 rounded-full border border-blue-500/20"
              style={{
                animation: "spin 12s linear infinite reverse",
              }}
            >
              <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
            </div>
            <div
              className="absolute w-64 h-64 rounded-full border border-purple-400/10"
              style={{
                animation: "spin 20s linear infinite",
              }}
            >
              <div className="absolute -top-1 left-1/2 w-1 h-1 bg-purple-300 rounded-full shadow-[0_0_6px_rgba(196,181,253,0.8)]" />
            </div>
          </div>

          {/* Main title */}
          <h1
            className={cn(
              "relative text-5xl md:text-7xl font-black tracking-tighter",
              "font-[family-name:var(--font-orbitron)]",
              "bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent",
              "bg-[length:200%_100%]",
              "drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            )}
            style={{
              animation: "gradient-shift 3s ease infinite",
            }}
          >
            抽象伺服器
          </h1>
        </div>

        {/* Loading bar container */}
        <div className="relative w-80 md:w-96">
          {/* Progress text */}
          <div className="flex justify-between mb-2 text-xs font-[family-name:var(--font-orbitron)]">
            <span className="text-purple-300/80 tracking-wider">LOADING</span>
            <span className="text-blue-300/80 tabular-nums">{Math.min(100, Math.floor(progress))}%</span>
          </div>

          {/* Progress bar background */}
          <div className="relative h-2 rounded-full bg-white/5 backdrop-blur-sm overflow-hidden">
            {/* Animated background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(139,92,246,0.1) 10px, rgba(139,92,246,0.1) 20px)",
                animation: "slide 1s linear infinite",
              }}
            />

            {/* Progress fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-100 ease-out"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: "linear-gradient(90deg, #8b5cf6, #3b82f6, #8b5cf6)",
                backgroundSize: "200% 100%",
                animation: "gradient-shift 2s ease infinite",
                boxShadow: "0 0 20px rgba(139,92,246,0.6), 0 0 40px rgba(59,130,246,0.4)",
              }}
            />

            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                animation: "shimmer 2s infinite",
              }}
            />

            {/* Glowing tip */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-100"
              style={{
                left: `calc(${Math.min(100, progress)}% - 8px)`,
                background: "radial-gradient(circle, white 0%, rgba(139,92,246,0.8) 50%, transparent 70%)",
                boxShadow: "0 0 15px rgba(255,255,255,0.8), 0 0 30px rgba(139,92,246,0.6)",
              }}
            />
          </div>

          {/* Loading stages */}
          <div className="flex justify-between mt-4 text-[10px] text-muted-foreground/50 font-[family-name:var(--font-orbitron)] tracking-wider">
            <span className={cn(progress > 0 && "text-purple-400/80")}>INIT</span>
            <span className={cn(progress > 25 && "text-purple-400/80")}>ASSETS</span>
            <span className={cn(progress > 50 && "text-blue-400/80")}>WORLD</span>
            <span className={cn(progress > 75 && "text-blue-400/80")}>RENDER</span>
            <span className={cn(progress >= 100 && "text-green-400/80")}>READY</span>
          </div>
        </div>

        {/* Tip text */}
        <p className="mt-10 text-sm text-muted-foreground/60 text-center max-w-md px-4">
          <span className="text-purple-400/80">TIP:</span>{" "}
          在月色與海洋之間，探索無限可能
        </p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-purple-500/20 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-blue-500/20 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-blue-500/20 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-purple-500/20 rounded-br-lg" />

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes slide {
          from { transform: translateX(-20px); }
          to { transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
