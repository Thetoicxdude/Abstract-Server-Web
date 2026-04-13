"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play, X, MapPin, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselItem {
  id: number
  src: string
  title: string
  description: string
  location: string
  date: string
}

const carouselItems: CarouselItem[] = [
  { 
    id: 1, 
    src: "/images/server-1.jpg", 
    title: "夢幻城堡",
    description: "由玩家 MoonBuilder 歷時三個月精心打造的中世紀城堡，坐落於懸崖之上俯瞰整片大海，每當月色升起時分外壯觀。",
    location: "北方大陸 · 月光崖",
    date: "2024.01"
  },
  { 
    id: 2, 
    src: "/images/server-2.jpg", 
    title: "星光港口",
    description: "繁忙的貿易港口，連接著伺服器各個區域。黃昏時分，船隻歸港，燈火通明，是玩家們最愛的拍照聖地。",
    location: "東海岸 · 貿易灣",
    date: "2023.11"
  },
  { 
    id: 3, 
    src: "/images/server-3.jpg", 
    title: "月影森林",
    description: "神秘的發光森林，充滿了各種奇幻生物。生物發光的樹木和花朵創造出如夢似幻的氛圍，是冒險者的必經之地。",
    location: "中央大陸 · 幽靈林",
    date: "2023.09"
  },
  { 
    id: 4, 
    src: "/images/server-4.jpg", 
    title: "雲端秘境",
    description: "漂浮在雲層之上的天空城市，由魔法維持懸浮。瀑布從雲端傾瀉而下，橋樑連接各個浮島，令人嘆為觀止。",
    location: "天空領域 · 雲之都",
    date: "2024.02"
  },
  { 
    id: 5, 
    src: "/images/server-5.jpg", 
    title: "深海遺跡",
    description: "古老文明的水下遺跡，珊瑚與海藻環繞著神秘的建築。探索者可以發現隱藏的寶藏和古老的秘密。",
    location: "深海區域 · 亞特蘭提斯",
    date: "2023.12"
  },
  { 
    id: 6, 
    src: "/images/server-6.jpg", 
    title: "極光之巔",
    description: "位於世界最北端的雪山之巔，擁有壯觀的天文觀測台。夜晚極光舞動，是欣賞星空的最佳地點。",
    location: "極北之地 · 永凍峰",
    date: "2024.03"
  },
]

export function ShowcaseSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [selectedItem, setSelectedItem] = useState<CarouselItem | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const itemCount = carouselItems.length
  const angleStep = 360 / itemCount
  const radius = 300

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

  // Auto rotation
  useEffect(() => {
    if (!isPlaying || isDragging || selectedItem) return

    const interval = setInterval(() => {
      setRotation(prev => prev - 0.2)
    }, 30)

    return () => clearInterval(interval)
  }, [isPlaying, isDragging, selectedItem])

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  // Canvas water reflection effect
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

    let time = 0
    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      // Draw water surface with waves
      const waveHeight = canvas.height * 0.65
      
      // Multiple wave layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.3
        const layerAlpha = 0.03 - layer * 0.008
        
        ctx.beginPath()
        ctx.moveTo(0, waveHeight)
        
        for (let x = 0; x <= canvas.width; x += 5) {
          const y = waveHeight + 
            Math.sin(x * 0.01 + time + layerOffset) * 8 +
            Math.sin(x * 0.02 + time * 1.5 + layerOffset) * 4 +
            Math.sin(x * 0.005 + time * 0.5 + layerOffset) * 12
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()
        
        const gradient = ctx.createLinearGradient(0, waveHeight, 0, canvas.height)
        gradient.addColorStop(0, `rgba(100, 150, 255, ${layerAlpha})`)
        gradient.addColorStop(0.3, `rgba(139, 92, 246, ${layerAlpha * 0.8})`)
        gradient.addColorStop(1, `rgba(30, 50, 100, ${layerAlpha * 0.5})`)
        
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Sparkles on water
      for (let i = 0; i < 20; i++) {
        const sparkleX = (Math.sin(time * 0.5 + i * 0.5) * 0.5 + 0.5) * canvas.width
        const sparkleY = waveHeight + 20 + Math.sin(time + i) * 30 + i * 8
        const sparkleSize = Math.sin(time * 2 + i) * 1.5 + 2
        const sparkleAlpha = (Math.sin(time * 3 + i * 0.7) * 0.5 + 0.5) * 0.6
        
        if (sparkleY < canvas.height) {
          ctx.beginPath()
          ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 220, 255, ${sparkleAlpha})`
          ctx.fill()
        }
      }

      // Moon reflection
      const moonReflectX = canvas.width / 2 + Math.sin(time * 0.3) * 20
      const moonReflectY = waveHeight + 50
      
      for (let i = 0; i < 8; i++) {
        const rippleY = moonReflectY + i * 15
        const rippleWidth = 60 + i * 20 + Math.sin(time + i) * 10
        const rippleAlpha = 0.15 - i * 0.015
        
        if (rippleY < canvas.height) {
          ctx.beginPath()
          ctx.ellipse(moonReflectX, rippleY, rippleWidth, 3, 0, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 180, 255, ${rippleAlpha})`
          ctx.fill()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handlePrev = useCallback(() => {
    setRotation(prev => prev + angleStep)
  }, [angleStep])

  const handleNext = useCallback(() => {
    setRotation(prev => prev - angleStep)
  }, [angleStep])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (selectedItem) return
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentRotation(rotation)
  }

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    setRotation(currentRotation + deltaX * 0.3)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleItemClick = (item: CarouselItem) => {
    setSelectedItem(item)
    setIsPlaying(false)
  }

  return (
    <section
      id="showcase"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen flex flex-col justify-center px-6 pt-14 pb-8 overflow-hidden"
    >
      {/* Water reflection canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Background gradient orbs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-1000 ease-out opacity-50"
        style={{
          left: mousePos.x - 250,
          top: mousePos.y - 250,
          background: "radial-gradient(circle, rgba(100, 150, 255, 0.1) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Moon in background */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-200/30 to-blue-200/20 blur-2xl scale-150" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-purple-300/10 blur-xl" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-100/30 to-white/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-4 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <span 
            className={cn(
              "inline-block px-4 py-1.5 rounded-full text-xs text-primary mb-2",
              "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30",
              "font-[family-name:var(--font-orbitron)]"
            )}
          >
            SHOWCASE
          </span>
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-black mb-2",
              "font-[family-name:var(--font-orbitron)]"
            )}
          >
            <span className="gradient-text">伺服器展示</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            探索玩家們精心打造的建築傑作，點擊查看詳情
          </p>
        </div>

        {/* 3D Carousel */}
        <div
          className={cn(
            "transition-all duration-700 delay-200",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <div className="relative w-full py-2">
            {/* Carousel Container */}
            <div
              className="relative mx-auto h-[300px] md:h-[340px] cursor-grab active:cursor-grabbing"
              style={{ perspective: "1200px" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleDragMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="absolute left-1/2 top-1/2 transition-transform duration-100"
                style={{
                  transform: `translateX(-50%) translateY(-50%) rotateY(${rotation}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {carouselItems.map((item, index) => {
                  const angle = index * angleStep
                  return (
                    <div
                      key={item.id}
                      className="absolute left-1/2 top-1/2 w-[220px] md:w-[280px] h-[140px] md:h-[175px] -translate-x-1/2 -translate-y-1/2"
                      style={{
                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div 
                        className="relative w-full h-full group cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        {/* Image Container */}
                        <div 
                          className={cn(
                            "relative w-full h-full rounded-xl overflow-hidden",
                            "border-2 border-white/10 hover:border-purple-500/50",
                            "transition-all duration-500",
                            "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
                            "hover:shadow-[0_0_50px_rgba(139,92,246,0.4)]",
                            "hover:scale-105"
                          )}
                        >
                          <Image
                            src={item.src}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 220px, 280px"
                          />
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          {/* Title */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h3 className="text-sm font-bold text-white text-center drop-shadow-lg">
                              {item.title}
                            </h3>
                          </div>
                          {/* Click hint */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                            <span className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                              點擊查看
                            </span>
                          </div>
                        </div>

                        {/* Water Reflection */}
                        <div
                          className="absolute top-full left-0 right-0 h-[70px] rounded-xl overflow-hidden pointer-events-none"
                          style={{
                            transform: "scaleY(-1) translateY(-4px)",
                            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%)",
                            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%)",
                            filter: "blur(2px)",
                          }}
                        >
                          <Image
                            src={item.src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 220px, 280px"
                            aria-hidden="true"
                          />
                          {/* Water ripple overlay */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,150,255,0.03) 2px, rgba(100,150,255,0.03) 4px)",
                              animation: "wave 3s ease-in-out infinite",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <button
                onClick={handlePrev}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-300",
                  "bg-white/5 border border-white/10 backdrop-blur-sm",
                  "hover:bg-purple-500/20 hover:border-purple-500/50 hover:scale-110",
                  "active:scale-95"
                )}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={cn(
                  "p-3 rounded-full transition-all duration-300",
                  "border backdrop-blur-sm",
                  isPlaying 
                    ? "bg-white/5 border-white/10 hover:bg-purple-500/20" 
                    : "bg-purple-500/30 border-purple-500/50",
                  "hover:scale-110 active:scale-95"
                )}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>

              <button
                onClick={handleNext}
                className={cn(
                  "p-2.5 rounded-full transition-all duration-300",
                  "bg-white/5 border border-white/10 backdrop-blur-sm",
                  "hover:bg-purple-500/20 hover:border-purple-500/50 hover:scale-110",
                  "active:scale-95"
                )}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {carouselItems.map((_, index) => {
                const itemAngle = index * angleStep
                const normalizedRotation = ((rotation % 360) + 360) % 360
                const diff = Math.abs(normalizedRotation - (360 - itemAngle)) % 360
                const isActive = diff < angleStep / 2 || diff > 360 - angleStep / 2

                return (
                  <button
                    key={index}
                    onClick={() => setRotation(-index * angleStep)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      isActive 
                        ? "w-8 bg-gradient-to-r from-purple-500 to-blue-500" 
                        : "w-1.5 bg-white/30 hover:bg-white/50"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedItem(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          {/* Content - Left/Right Layout */}
          <div 
            className={cn(
              "relative max-w-5xl w-full max-h-[85vh] overflow-hidden rounded-2xl",
              "bg-gradient-to-br from-purple-900/50 to-blue-900/50",
              "border border-white/10 backdrop-blur-xl",
              "shadow-[0_0_100px_rgba(139,92,246,0.3)]",
              "animate-in fade-in zoom-in-95 duration-300",
              "flex flex-col md:flex-row"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className={cn(
                "absolute top-4 right-4 z-10 p-2 rounded-full",
                "bg-black/50 backdrop-blur-sm border border-white/20",
                "hover:bg-white/20 transition-colors",
                "text-white"
              )}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left - Image */}
            <div className="relative w-full md:w-3/5 aspect-video md:aspect-auto md:h-auto min-h-[200px] md:min-h-[400px]">
              <Image
                src={selectedItem.src}
                alt={selectedItem.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
              {/* Subtle overlay for text readability on mobile */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 hidden md:block" />
            </div>

            {/* Right - Info */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-black/20 to-purple-900/20">
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-black mb-4 font-[family-name:var(--font-orbitron)] gradient-text">
                {selectedItem.title}
              </h3>
              
              {/* Meta info */}
              <div className="flex flex-col gap-3 mb-6">
                <span className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-lg bg-purple-500/20">
                    <MapPin className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-foreground/80">{selectedItem.location}</span>
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <div className="p-1.5 rounded-lg bg-blue-500/20">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-foreground/80">{selectedItem.date}</span>
                </span>
              </div>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mb-6 rounded-full" />

              {/* Description */}
              <p className="text-foreground/70 leading-relaxed text-sm md:text-base">
                {selectedItem.description}
              </p>

              {/* Decorative element */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <span className="text-xs text-muted-foreground font-[family-name:var(--font-orbitron)] tracking-wider">
                  ABSTRACT SERVER
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
