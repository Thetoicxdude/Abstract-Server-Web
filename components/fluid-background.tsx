"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  alpha: number
  life: number
  maxLife: number
}

interface Orb {
  x: number
  y: number
  targetX: number
  targetY: number
  radius: number
  color1: string
  color2: string
  phase: number
  speed: number
}

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const particlesRef = useRef<Particle[]>([])
  const orbsRef = useRef<Orb[]>([])
  const frameRef = useRef(0)

  const createOrbs = useCallback((width: number, height: number) => {
    const colors = [
      { c1: "rgba(139, 92, 246, 0.15)", c2: "rgba(139, 92, 246, 0)" },
      { c1: "rgba(59, 130, 246, 0.12)", c2: "rgba(59, 130, 246, 0)" },
      { c1: "rgba(147, 51, 234, 0.1)", c2: "rgba(147, 51, 234, 0)" },
      { c1: "rgba(99, 102, 241, 0.12)", c2: "rgba(99, 102, 241, 0)" },
      { c1: "rgba(168, 85, 247, 0.08)", c2: "rgba(168, 85, 247, 0)" },
    ]

    orbsRef.current = colors.map((c, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      targetX: Math.random() * width,
      targetY: Math.random() * height,
      radius: 200 + Math.random() * 300,
      color1: c.c1,
      color2: c.c2,
      phase: (i / colors.length) * Math.PI * 2,
      speed: 0.0003 + Math.random() * 0.0002,
    }))
  }, [])

  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 2 + 1
    const colors = [
      "rgba(139, 92, 246, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(147, 51, 234, 0.8)",
      "rgba(99, 102, 241, 0.8)",
      "rgba(236, 72, 153, 0.6)",
    ]
    
    particlesRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: 0,
      maxLife: 60 + Math.random() * 60,
    })

    if (particlesRef.current.length > 100) {
      particlesRef.current.shift()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createOrbs(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
      
      if (Math.random() > 0.7) {
        spawnParticle(e.clientX, e.clientY)
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    const handleClick = (e: MouseEvent) => {
      for (let i = 0; i < 15; i++) {
        spawnParticle(e.clientX, e.clientY)
      }
    }

    const animate = (time: number) => {
      frameRef.current = time
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw orbs
      orbsRef.current.forEach((orb) => {
        // Smooth movement toward target
        orb.x += (orb.targetX - orb.x) * 0.002
        orb.y += (orb.targetY - orb.y) * 0.002

        // Add wave motion
        const waveX = Math.sin(time * orb.speed + orb.phase) * 100
        const waveY = Math.cos(time * orb.speed * 0.7 + orb.phase) * 80

        // Update target periodically
        if (Math.random() < 0.001) {
          orb.targetX = Math.random() * canvas.width
          orb.targetY = Math.random() * canvas.height
        }

        // React to mouse
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - orb.x
          const dy = mouseRef.current.y - orb.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 400) {
            orb.x += dx * 0.01
            orb.y += dy * 0.01
          }
        }

        const gradient = ctx.createRadialGradient(
          orb.x + waveX, orb.y + waveY, 0,
          orb.x + waveX, orb.y + waveY, orb.radius
        )
        gradient.addColorStop(0, orb.color1)
        gradient.addColorStop(1, orb.color2)
        
        ctx.beginPath()
        ctx.arc(orb.x + waveX, orb.y + waveY, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        p.vy += 0.02 // gravity
        p.alpha = 1 - p.life / p.maxLife

        if (p.alpha <= 0) return false

        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius * 2
        )
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, `${p.alpha})`))
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        return true
      })

      // Draw connection lines between close particles
      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist / 100) * Math.min(p1.alpha, p2.alpha) * 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("click", handleClick)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("click", handleClick)
      cancelAnimationFrame(animationId)
    }
  }, [createOrbs, spawnParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
      aria-hidden="true"
    />
  )
}
