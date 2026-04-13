"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Crown, Gem, Star, Zap, Shield, Gift, Heart, Diamond, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const storeItems = [
  {
    id: 1,
    name: "VIP",
    price: "$9.99",
    period: "/月",
    icon: Crown,
    color: "from-amber-400 via-yellow-500 to-orange-500",
    glowColor: "251,191,36",
    features: ["專屬稱號", "優先進入", "每日獎勵", "VIP 聊天室"],
  },
  {
    id: 2,
    name: "MVP",
    price: "$19.99",
    period: "/月",
    icon: Gem,
    color: "from-purple-400 via-fuchsia-500 to-pink-500",
    glowColor: "192,132,252",
    features: ["VIP 全部權益", "專屬皮膚", "飛行權限", "傳送功能", "粒子特效"],
    popular: true,
  },
  {
    id: 3,
    name: "MVP+",
    price: "$29.99",
    period: "/月",
    icon: Diamond,
    color: "from-cyan-400 via-blue-500 to-indigo-500",
    glowColor: "56,189,248",
    features: ["MVP 全部權益", "無限傳送", "私人領地", "專屬特效", "優先支援"],
  },
]

export function StoreSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  // Rainbow Ocean Canvas
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

    // Floating particles
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      hue: number
      alpha: number
    }> = []
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -Math.random() * 0.8 - 0.2,
        hue: Math.random() * 360,
        alpha: Math.random() * 0.8 + 0.2,
      })
    }

    const drawRainbowOcean = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      // Deep space gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h)
      bgGradient.addColorStop(0, "#0a0015")
      bgGradient.addColorStop(0.3, "#0f0525")
      bgGradient.addColorStop(0.6, "#150a35")
      bgGradient.addColorStop(1, "#0a0a20")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, w, h)

      // Moonlit ocean waves - purple/blue night theme with subtle color shift
      const waveCount = 5
      for (let wave = 0; wave < waveCount; wave++) {
        const waveY = h * (0.7 + wave * 0.06)
        const amplitude = 25 - wave * 3
        // Slow subtle hue shift between purple (270) and blue (220)
        const baseHue = 245 + Math.sin(time * 0.3 + wave * 0.5) * 25
        
        ctx.beginPath()
        ctx.moveTo(0, h)
        
        for (let x = 0; x <= w; x += 3) {
          const y = waveY +
            Math.sin(x * 0.005 + time * (0.8 - wave * 0.05) + wave) * amplitude +
            Math.sin(x * 0.003 + time * 0.5 + wave * 2) * (amplitude * 0.5)
          
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(w, h)
        ctx.closePath()
        
        // Nighttime ocean gradient - very subtle purple to blue
        const waveGradient = ctx.createLinearGradient(0, waveY - amplitude, w, waveY + amplitude)
        const alpha = 0.1 - wave * 0.015
        
        waveGradient.addColorStop(0, `hsla(${baseHue - 20}, 25%, 18%, ${alpha})`)
        waveGradient.addColorStop(0.3, `hsla(${baseHue}, 22%, 16%, ${alpha})`)
        waveGradient.addColorStop(0.6, `hsla(${baseHue + 15}, 24%, 17%, ${alpha})`)
        waveGradient.addColorStop(1, `hsla(${baseHue + 30}, 25%, 18%, ${alpha})`)
        
        ctx.fillStyle = waveGradient
        ctx.fill()
      }

      // Moonlight reflection on water - very subtle
      const moonReflectionX = w * 0.5 + Math.sin(time * 0.3) * 50
      const moonReflectionY = h * 0.78
      const reflectionGradient = ctx.createRadialGradient(
        moonReflectionX, moonReflectionY, 0,
        moonReflectionX, moonReflectionY, 120
      )
      reflectionGradient.addColorStop(0, "rgba(200, 210, 255, 0.04)")
      reflectionGradient.addColorStop(0.3, "rgba(180, 190, 230, 0.02)")
      reflectionGradient.addColorStop(1, "transparent")
      ctx.fillStyle = reflectionGradient
      ctx.fillRect(0, h * 0.7, w, h * 0.3)

      // Subtle water sparkles - very faint moonlight glints
      for (let i = 0; i < 12; i++) {
        const sparkleX = (time * 20 + i * 150) % (w + 100) - 50
        const sparkleY = h * (0.8 + Math.sin(time * 0.6 + i * 0.7) * 0.08)
        const sparkleSize = 0.8 + Math.sin(time * 1.5 + i) * 0.3
        const sparkleAlpha = 0.06 + Math.sin(time * 2 + i * 0.5) * 0.03
        
        ctx.beginPath()
        ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 210, 230, ${sparkleAlpha})`
        ctx.fill()
      }

      // Floating particles - faint night sky stars
      particles.forEach(p => {
        p.x += p.speedX * 0.3
        p.y += p.speedY * 0.3
        
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        
        // Very faint purple/blue particles
        const particleHue = 250 + (p.hue % 30) - 15
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `hsla(${particleHue}, 25%, 50%, ${p.alpha * 0.08})`)
        gradient.addColorStop(1, "transparent")
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Rare faint shooting star
      if (Math.random() > 0.998) {
        const startX = Math.random() * w * 0.7
        const startY = Math.random() * h * 0.2
        const length = 50 + Math.random() * 60
        const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.15
        
        const gradient = ctx.createLinearGradient(
          startX, startY,
          startX + Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        )
        gradient.addColorStop(0, "rgba(200, 210, 230, 0.4)")
        gradient.addColorStop(0.4, "rgba(180, 190, 220, 0.2)")
        gradient.addColorStop(1, "transparent")
        
        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(
          startX + Math.cos(angle) * length,
          startY + Math.sin(angle) * length
        )
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1
        ctx.lineCap = "round"
        ctx.stroke()
      }

      time += 0.015
      animationId = requestAnimationFrame(drawRainbowOcean)
    }

    drawRainbowOcean()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <section
      id="store"
      ref={sectionRef}
      className="relative h-screen flex flex-col justify-center px-4 md:px-8 pt-20 pb-10 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Rainbow Ocean Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating orbs following mouse - subtle */}
      <div 
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(59,130,246,0.06) 40%, transparent 70%)",
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          filter: "blur(100px)",
        }}
      />
      <div 
        className="absolute w-[250px] h-[250px] rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(180,160,220,0.08) 0%, transparent 60%)",
          left: mousePos.x - 125,
          top: mousePos.y - 125,
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className={cn(
          "text-center mb-10 transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
            <Gift className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-white/80 tracking-wider font-[family-name:var(--font-orbitron)]">STORE & SPONSOR</span>
            <Heart className="w-5 h-5 text-pink-400 animate-pulse" />
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-[family-name:var(--font-orbitron)]">
            <span className="bg-gradient-to-r from-amber-400 via-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
              商城 / 贊助
            </span>
          </h2>
        </div>

        {/* Cards Grid - Larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {storeItems.map((item, index) => {
            const Icon = item.icon
            const isHovered = hoveredCard === item.id
            
            return (
              <div
                key={item.id}
                className={cn(
                  "relative group cursor-pointer transition-all duration-500",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                  item.popular && "md:-translate-y-4 md:scale-105"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Popular badge */}
                {item.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30">
                    <Zap className="w-4 h-4" />
                    最受歡迎
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                {/* Card glow */}
                <div
                  className={cn(
                    "absolute -inset-2 rounded-3xl transition-all duration-500",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    background: `radial-gradient(circle at center, rgba(${item.glowColor},0.5), transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                />

                {/* Rainbow animated border for popular */}
                {item.popular && (
                  <div 
                    className="absolute -inset-[2px] rounded-2xl opacity-80"
                    style={{
                      background: "linear-gradient(90deg, #f59e0b, #ec4899, #a855f7, #3b82f6, #10b981, #f59e0b)",
                      backgroundSize: "300% 100%",
                      animation: "gradient-flow 2s linear infinite",
                    }}
                  />
                )}

                {/* Card body */}
                <div className={cn(
                  "relative rounded-2xl p-6 lg:p-8 h-full",
                  "bg-gradient-to-br from-white/10 to-white/5",
                  "border border-white/10 backdrop-blur-md",
                  "hover:border-white/30 transition-all duration-500",
                  isHovered && "transform scale-[1.03] shadow-2xl"
                )}>
                  {/* Shine effect */}
                  <div 
                    className={cn(
                      "absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    )}
                  >
                    <div 
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      }}
                    />
                  </div>

                  {/* Icon and name */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={cn(
                        "w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                        item.color
                      )}
                      style={{ boxShadow: `0 8px 32px rgba(${item.glowColor},0.5)` }}
                    >
                      <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-black text-white font-[family-name:var(--font-orbitron)]">
                        {item.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                          {item.price}
                        </span>
                        <span className="text-sm text-white/50">{item.period}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {item.features.map((feature, i) => (
                      <li 
                        key={i} 
                        className="flex items-center gap-3 text-sm lg:text-base text-white/80 group-hover:text-white transition-colors"
                      >
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center bg-gradient-to-br", item.color)}>
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Purchase button */}
                  <button className={cn(
                    "w-full py-3 lg:py-4 rounded-xl text-base lg:text-lg font-bold transition-all duration-300",
                    "bg-gradient-to-r text-white relative overflow-hidden group/btn",
                    item.color,
                    "hover:shadow-xl hover:scale-[1.02]"
                  )}
                  style={{ boxShadow: `0 4px 24px rgba(${item.glowColor},0.4)` }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      立即購買
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sponsor note */}
        <div className={cn(
          "mt-8 text-center transition-all duration-700 delay-500",
          isVisible ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-sm text-white/40 flex items-center justify-center gap-3">
            <Shield className="w-4 h-4 text-purple-400" />
            所有贊助皆用於伺服器維護與開發
            <Shield className="w-4 h-4 text-blue-400" />
          </p>
        </div>
      </div>

      {/* Inline styles for animation */}
      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
