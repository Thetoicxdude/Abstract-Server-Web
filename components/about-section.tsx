"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Compass, Users, Sparkles, Shield, Zap, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Compass,
    title: "無限探索",
    description: "廣闘的世界地圖等待你的足跡",
    color: "from-blue-500 to-cyan-400",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    icon: Users,
    title: "友善社群",
    description: "來自世界各地的玩家在此相聚",
    color: "from-purple-500 to-pink-400",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    icon: Sparkles,
    title: "獨特玩法",
    description: "精心設計的遊戲系統與體驗",
    color: "from-amber-500 to-orange-400",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    icon: Shield,
    title: "安全保障",
    description: "完善的防護機制保護你的作品",
    color: "from-emerald-500 to-teal-400",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  {
    icon: Zap,
    title: "極速體驗",
    description: "高性能伺服器流暢無延遲",
    color: "from-yellow-500 to-lime-400",
    glowColor: "rgba(234, 179, 8, 0.5)",
  },
  {
    icon: Heart,
    title: "用心經營",
    description: "專業團隊持續更新與維護",
    color: "from-rose-500 to-red-400",
    glowColor: "rgba(244, 63, 94, 0.5)",
  },
]

// Animated Counter Component
function AnimatedCounter({ 
  value, 
  isVisible 
}: { 
  value: string
  isVisible: boolean 
}) {
  const [displayValue, setDisplayValue] = useState("0")
  
  useEffect(() => {
    if (!isVisible) return
    
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""))
    const hasK = value.includes("K")
    const hasPlus = value.includes("+")
    const hasPercent = value.includes("%")
    const isTime = value.includes("/")
    
    if (isTime) {
      setTimeout(() => setDisplayValue(value), 500)
      return
    }
    
    let current = 0
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    const interval = duration / steps
    
    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        current = numericValue
        clearInterval(timer)
      }
      
      let formatted = current.toFixed(hasPercent ? 1 : 0)
      if (hasK) formatted += "K"
      if (hasPlus) formatted += "+"
      if (hasPercent) formatted += "%"
      
      setDisplayValue(formatted)
    }, interval)
    
    return () => clearInterval(timer)
  }, [value, isVisible])
  
  return <span>{displayValue}</span>
}

// Magnetic Feature Card
function FeatureCard({
  feature,
  index,
  isVisible,
}: {
  feature: (typeof features)[0]
  index: number
  isVisible: boolean
}) {
  const Icon = feature.icon
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Create burst particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }))
    setParticles(prev => [...prev, ...newParticles])
    
    // Clean up particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)))
    }, 1000)
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }) }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className={cn(
        "group relative p-4 rounded-xl overflow-hidden cursor-pointer",
        "bg-gradient-to-br from-white/5 to-white/[0.02]",
        "border border-white/10 backdrop-blur-md",
        "transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}
      style={{
        transitionDelay: `${index * 80}ms`,
        transform: isHovered 
          ? `perspective(1000px) rotateX(${mousePos.y * -10}deg) rotateY(${mousePos.x * 10}deg) scale(1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        boxShadow: isHovered ? `0 20px 40px ${feature.glowColor}` : "none",
      }}
    >
      {/* Click particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y }}
        >
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${feature.glowColor}, white)`,
                animation: `particle-burst-${i} 0.8s ease-out forwards`,
              }}
            />
          ))}
        </div>
      ))}

      {/* Animated gradient background */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isHovered && "opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, ${feature.glowColor} 0%, transparent 60%)`,
        }}
      />

      {/* Icon with glow and rotation */}
      <div className="relative mb-3 z-10">
        <div 
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500",
            "bg-gradient-to-br",
            feature.color
          )}
          style={{
            boxShadow: isHovered ? `0 0 30px ${feature.glowColor}` : `0 0 10px ${feature.glowColor}`,
            transform: isHovered ? "scale(1.15) rotate(6deg)" : "scale(1) rotate(0deg)",
          }}
        >
          <Icon 
            className={cn(
              "w-5 h-5 text-white transition-transform duration-500",
            )}
          />
        </div>
        
        {/* Orbiting dot */}
        {isHovered && (
          <div 
            className="absolute w-2 h-2 rounded-full bg-white/80"
            style={{
              animation: "orbit 2s linear infinite",
              top: "50%",
              left: "50%",
              transformOrigin: "0 0",
            }}
          />
        )}
      </div>

      {/* Content */}
      <h3 
        className={cn(
          "text-sm font-bold mb-1 transition-all duration-300 z-10 relative",
          "font-[family-name:var(--font-orbitron)]",
          "text-white"
        )}
        style={{
          textShadow: isHovered ? `0 0 20px ${feature.glowColor}` : "none",
        }}
      >
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed z-10 relative">
        {feature.description}
      </p>

      {/* Animated border */}
      <div 
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: isHovered 
            ? `linear-gradient(${90 + mousePos.x * 45}deg, ${feature.glowColor} 0%, transparent 50%, ${feature.glowColor} 100%)` 
            : "transparent",
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
          opacity: isHovered ? 0.5 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Bottom line animation */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 h-0.5 transition-all duration-500",
          "bg-gradient-to-r",
          feature.color
        )}
        style={{
          width: isHovered ? "100%" : "0%",
        }}
      />

      {/* Shine effect */}
      <div 
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered && "opacity-100"
        )}
        style={{
          background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)`,
          backgroundSize: "200% 100%",
          animation: isHovered ? "shine 1.5s infinite" : "none",
        }}
      />
    </div>
  )
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <>
      {/* Hexagon */}
      <div 
        className="absolute top-16 left-[10%] animate-float"
        style={{ animationDelay: "0s" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="opacity-20">
          <polygon 
            points="30,5 55,20 55,45 30,60 5,45 5,20" 
            fill="none" 
            stroke="url(#hexGradient)" 
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Triangle */}
      <div 
        className="absolute bottom-24 right-[15%] animate-float"
        style={{ animationDelay: "1s" }}
      >
        <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-20">
          <polygon 
            points="25,5 45,45 5,45" 
            fill="none" 
            stroke="url(#triGradient)" 
            strokeWidth="1"
          />
          <defs>
            <linearGradient id="triGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Circle with orbit */}
      <div 
        className="absolute top-[40%] right-[8%] animate-float"
        style={{ animationDelay: "2s" }}
      >
        <div className="relative">
          <div className="w-8 h-8 rounded-full border border-purple-500/30" />
          <div 
            className="absolute w-2 h-2 rounded-full bg-purple-400/60"
            style={{
              animation: "orbit 4s linear infinite",
              top: "50%",
              left: "50%",
            }}
          />
        </div>
      </div>

      {/* Square */}
      <div 
        className="absolute top-[30%] left-[5%] animate-float"
        style={{ animationDelay: "0.5s", animationDuration: "8s" }}
      >
        <div 
          className="w-10 h-10 border border-blue-500/20 rotate-45"
          style={{
            animation: "spin 20s linear infinite",
          }}
        />
      </div>

      {/* Dots pattern */}
      <div className="absolute bottom-[20%] left-[20%] opacity-30">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, i) => (
            <div 
              key={i}
              className="w-1 h-1 rounded-full bg-purple-400"
              style={{
                animation: `pulse 2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  // Canvas particle system with wave effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    interface Particle {
      x: number
      y: number
      baseY: number
      vx: number
      size: number
      color: string
      alpha: number
      pulse: number
      waveOffset: number
      waveSpeed: number
    }

    const particles: Particle[] = []
    const colors = [
      "rgba(139, 92, 246, ",
      "rgba(59, 130, 246, ",
      "rgba(236, 72, 153, ",
      "rgba(34, 211, 238, ",
    ]

    // Create particles in wave pattern
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      particles.push({
        x,
        y,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.02 + 0.01,
      })
    }

    let time = 0
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      particles.forEach((p, i) => {
        // Wave motion
        p.x += p.vx
        p.y = p.baseY + Math.sin(time * 2 + p.waveOffset) * 15
        p.pulse += 0.02

        // Wrap around
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0

        const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
        gradient.addColorStop(0, p.color + pulseAlpha + ")")
        gradient.addColorStop(1, p.color + "0)")
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + pulseAlpha + ")"
        ctx.fill()

        // Connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = 0.1 * (1 - dist / 100)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            const lineGradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y)
            lineGradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`)
            lineGradient.addColorStop(1, `rgba(59, 130, 246, ${alpha})`)
            ctx.strokeStyle = lineGradient
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen flex flex-col justify-center px-6 py-10 overflow-hidden"
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Interactive gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          left: mousePos.x - 150 + 50,
          top: mousePos.y - 150 - 50,
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />

      {/* Floating geometric shapes */}
      <FloatingShapes />

      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"
          style={{ animation: "pulse 8s ease-in-out infinite" }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"
          style={{ animation: "pulse 8s ease-in-out infinite", animationDelay: "4s" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-6 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span 
            className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs text-primary mb-3",
              "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30",
              "font-[family-name:var(--font-orbitron)]",
              "animate-pulse"
            )}
          >
            ABOUT US
          </span>
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-black mb-3",
              "font-[family-name:var(--font-orbitron)]"
            )}
            style={{
              background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 5s ease infinite",
            }}
          >
            關於我們
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            抽象伺服器誕生於對 Minecraft 的熱愛，致力於打造夢幻世界
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Animated Stats */}
        <div
          className={cn(
            "grid grid-cols-4 gap-3 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: "500ms" }}
        >
          {[
            { value: "1000+", label: "活躍玩家", color: "from-purple-500 to-violet-500" },
            { value: "50+", label: "獨特地標", color: "from-blue-500 to-cyan-500" },
            { value: "99.9%", label: "在線時間", color: "from-emerald-500 to-teal-500" },
            { value: "24/7", label: "全天候支援", color: "from-amber-500 to-orange-500" },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className={cn(
                "relative text-center p-3 rounded-xl overflow-hidden group cursor-default",
                "bg-gradient-to-br from-white/5 to-white/[0.02]",
                "border border-white/10 backdrop-blur-sm",
                "transition-all duration-300 hover:scale-105 hover:border-white/20"
              )}
            >
              <div 
                className={cn(
                  "absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r transition-all duration-500",
                  stat.color
                )}
                style={{
                  transform: "scaleX(0)",
                  animation: isVisible ? "scaleIn 0.5s ease-out forwards" : "none",
                  animationDelay: "0.8s",
                }}
              />
              
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
              
              <div 
                className={cn(
                  "text-lg md:text-xl font-black mb-0.5",
                  "font-[family-name:var(--font-orbitron)] text-white"
                )}
              >
                <AnimatedCounter value={stat.value} isVisible={isVisible} />
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }
        
        @keyframes shine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes scaleIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(45deg); }
          to { transform: rotate(405deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        ${[...Array(8)].map((_, i) => `
          @keyframes particle-burst-${i} {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(${Math.cos(i * 45 * Math.PI / 180) * 40}px, ${Math.sin(i * 45 * Math.PI / 180) * 40}px) scale(0);
              opacity: 0;
            }
          }
        `).join("\n")}
      `}</style>
    </section>
  )
}
