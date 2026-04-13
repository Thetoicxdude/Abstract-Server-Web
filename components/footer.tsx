"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Moon, Heart, Copy, Check, MessageCircle, Gamepad2, ExternalLink, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const SERVER_IP = "play.abstract.mc"
const DISCORD_LINK = "https://discord.gg/abstract"

export function Footer() {
  const [copied, setCopied] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const footerRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    alpha: number
    hue: number
  }>>([])

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!footerRef.current) return
    const rect = footerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  // Visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener("resize", resize)

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.3 + 0.1,
        hue: 250 + Math.random() * 30
      })
    }

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      time += 0.015

      ctx.clearRect(0, 0, w, h)

      // Nighttime ocean waves at bottom
      for (let wave = 0; wave < 4; wave++) {
        const waveY = h * (0.75 + wave * 0.06)
        const amplitude = 15 - wave * 2
        const baseHue = 250 + Math.sin(time * 0.2 + wave) * 15

        ctx.beginPath()
        ctx.moveTo(0, h)

        for (let x = 0; x <= w; x += 3) {
          const y = waveY +
            Math.sin(x * 0.004 + time * (0.6 - wave * 0.1) + wave) * amplitude +
            Math.sin(x * 0.002 + time * 0.4) * (amplitude * 0.5)
          ctx.lineTo(x, y)
        }

        ctx.lineTo(w, h)
        ctx.closePath()

        const alpha = 0.12 - wave * 0.025
        const gradient = ctx.createLinearGradient(0, waveY, 0, h)
        gradient.addColorStop(0, `hsla(${baseHue}, 30%, 20%, ${alpha})`)
        gradient.addColorStop(1, `hsla(${baseHue + 10}, 25%, 15%, ${alpha * 0.5})`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Central moon reflection
      const moonX = w / 2 + Math.sin(time * 0.3) * 30
      const moonY = h * 0.5

      // Moon reflection pillar
      const pillarGradient = ctx.createLinearGradient(moonX, moonY - 50, moonX, h)
      pillarGradient.addColorStop(0, "rgba(200, 190, 255, 0.08)")
      pillarGradient.addColorStop(0.3, "rgba(180, 170, 240, 0.04)")
      pillarGradient.addColorStop(1, "transparent")
      
      ctx.beginPath()
      ctx.moveTo(moonX - 60, moonY)
      ctx.quadraticCurveTo(moonX - 80, h * 0.75, moonX - 30, h)
      ctx.lineTo(moonX + 30, h)
      ctx.quadraticCurveTo(moonX + 80, h * 0.75, moonX + 60, moonY)
      ctx.closePath()
      ctx.fillStyle = pillarGradient
      ctx.fill()

      // Rippling moon reflection circles
      for (let i = 0; i < 8; i++) {
        const rippleY = moonY + 80 + i * 25 + Math.sin(time * 1.5 + i * 0.5) * 5
        const rippleWidth = 50 - i * 4 + Math.sin(time + i) * 5
        const rippleAlpha = 0.06 - i * 0.006

        ctx.beginPath()
        ctx.ellipse(moonX + Math.sin(time * 0.8 + i) * 10, rippleY, rippleWidth, 3, 0, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 190, 255, ${rippleAlpha})`
        ctx.fill()
      }

      // Water surface sparkles
      for (let i = 0; i < 25; i++) {
        const sparkleX = (i * 80 + time * 20) % (w + 50) - 25
        const sparkleY = h * (0.78 + Math.sin(time * 0.5 + i * 0.8) * 0.08)
        const sparkleAlpha = 0.1 + Math.sin(time * 2.5 + i * 0.7) * 0.08

        ctx.beginPath()
        ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 215, 255, ${sparkleAlpha})`
        ctx.fill()
      }

      // Floating particles
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        gradient.addColorStop(0, `hsla(${p.hue}, 40%, 70%, ${p.alpha})`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Occasional shooting star
      if (Math.random() > 0.997) {
        const startX = Math.random() * w * 0.7
        const startY = Math.random() * h * 0.3
        const length = 40 + Math.random() * 50
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2

        const gradient = ctx.createLinearGradient(
          startX, startY,
          startX + Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        )
        gradient.addColorStop(0, "rgba(220, 215, 255, 0.5)")
        gradient.addColorStop(0.5, "rgba(200, 190, 240, 0.2)")
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <footer
      id="join"
      ref={footerRef}
      className="relative h-screen flex flex-col justify-center items-center px-6 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/40 via-background to-background pointer-events-none" />

      {/* Mouse following glow */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Central Moon with glow */}
        <div className={cn(
          "flex justify-center mb-10 transition-all duration-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}>
          <div className="relative group cursor-pointer">
            {/* Outer glow rings */}
            <div className="absolute -inset-8 rounded-full bg-purple-400/5 blur-3xl animate-pulse" />
            <div className="absolute -inset-4 rounded-full bg-purple-300/10 blur-2xl" />
            
            {/* Moon body */}
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-100/90 via-purple-200/80 to-purple-300/70 flex items-center justify-center shadow-[0_0_80px_rgba(200,180,255,0.3)] group-hover:shadow-[0_0_100px_rgba(200,180,255,0.5)] transition-shadow duration-500">
              {/* Moon craters */}
              <div className="absolute top-4 left-5 w-3 h-3 rounded-full bg-purple-300/30" />
              <div className="absolute top-8 right-6 w-2 h-2 rounded-full bg-purple-300/20" />
              <div className="absolute bottom-6 left-8 w-4 h-4 rounded-full bg-purple-300/25" />
              
              <Moon className="w-10 h-10 text-purple-500/40" />
            </div>

            {/* Orbiting stars */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2"
                style={{
                  animation: `orbit ${6 + i * 2}s linear infinite`,
                  animationDelay: `${i * -2}s`,
                }}
              >
                <Star className="w-2 h-2 text-purple-300 fill-purple-300/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className={cn(
          "text-center mb-10 transition-all duration-700 delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-orbitron)] mb-3">
            <span className="gradient-text">加入我們</span>
          </h2>
          <p className="text-base text-muted-foreground/70">在月色與海洋之間，開啟你的冒險旅程</p>
        </div>

        {/* Join buttons */}
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 transition-all duration-700 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Server IP Button */}
          <button
            onClick={copyIP}
            onMouseEnter={() => setHoveredButton("server")}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative flex items-center justify-between p-6 rounded-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:scale-[1.02] overflow-hidden bg-gradient-to-br from-purple-500/5 to-blue-500/5"
          >
            {/* Background glow on hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 transition-opacity duration-500",
              hoveredButton === "server" ? "opacity-100" : "opacity-0"
            )} />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative flex items-center gap-4">
              {/* Icon with glow */}
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-purple-500/40 blur-xl rounded-full transition-all duration-500",
                  hoveredButton === "server" ? "scale-150 opacity-100" : "scale-100 opacity-50"
                )} />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/30 transition-shadow duration-500">
                  <Gamepad2 className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div className="text-left">
                <div className="text-xs text-purple-300/60 mb-1 tracking-[0.2em] font-medium">MINECRAFT SERVER</div>
                <div className="font-mono font-bold text-xl text-white tracking-wider">{SERVER_IP}</div>
              </div>
            </div>

            <div className={cn(
              "relative flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300",
              copied 
                ? "bg-green-500/20 text-green-400" 
                : "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white"
            )}>
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="text-sm font-bold">已複製</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-sm font-bold">複製 IP</span>
                </>
              )}
            </div>
          </button>

          {/* Discord Button */}
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHoveredButton("discord")}
            onMouseLeave={() => setHoveredButton(null)}
            className="group relative flex items-center justify-between p-6 rounded-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-500 hover:scale-[1.02] overflow-hidden bg-gradient-to-br from-indigo-500/5 to-purple-500/5"
          >
            {/* Background glow on hover */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transition-opacity duration-500",
              hoveredButton === "discord" ? "opacity-100" : "opacity-0"
            )} />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative flex items-center gap-4">
              {/* Icon with glow */}
              <div className="relative">
                <div className={cn(
                  "absolute inset-0 bg-indigo-500/40 blur-xl rounded-full transition-all duration-500",
                  hoveredButton === "discord" ? "scale-150 opacity-100" : "scale-100 opacity-50"
                )} />
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow duration-500">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div className="text-left">
                <div className="text-xs text-indigo-300/60 mb-1 tracking-[0.2em] font-medium">JOIN COMMUNITY</div>
                <div className="font-bold text-xl text-white">Discord 伺服器</div>
              </div>
            </div>

            <div className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
              <ExternalLink className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span className="text-sm font-bold">加入</span>
            </div>
          </a>
        </div>

        {/* Divider */}
        <div className={cn(
          "flex items-center justify-center gap-4 mb-8 transition-all duration-700 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-purple-500/30" />
          <div className="relative">
            <div className="absolute inset-0 bg-purple-400/30 blur-md rounded-full" />
            <Moon className="relative w-4 h-4 text-purple-400/60" />
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-purple-500/30" />
        </div>

        {/* Copyright */}
        <div className={cn(
          "text-center transition-all duration-700 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground/60 mb-3">
            <span className="font-[family-name:var(--font-orbitron)] text-purple-300/50 tracking-wider">抽象伺服器</span>
            <span className="text-purple-500/20">|</span>
            <span className="tracking-wider">ABSTRACT SERVER</span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/40">
            <span>© 2024 抽象伺服器</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              用 <Heart className="w-3 h-3 text-pink-400/50 fill-pink-400/50" /> 打造
            </span>
          </div>
        </div>
      </div>

      {/* CSS for orbit animation */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(55px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(55px) rotate(-360deg);
          }
        }
      `}</style>
    </footer>
  )
}
