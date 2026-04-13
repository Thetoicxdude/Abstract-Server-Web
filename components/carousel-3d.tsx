"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselItem {
  id: number
  src: string
  title: string
}

const carouselItems: CarouselItem[] = [
  { id: 1, src: "/images/server-1.jpg", title: "夢幻城堡" },
  { id: 2, src: "/images/server-2.jpg", title: "星光港口" },
  { id: 3, src: "/images/server-3.jpg", title: "月影森林" },
  { id: 4, src: "/images/server-4.jpg", title: "雲端秘境" },
  { id: 5, src: "/images/server-5.jpg", title: "深海遺跡" },
  { id: 6, src: "/images/server-6.jpg", title: "極光之巔" },
]

export function Carousel3D() {
  const [rotation, setRotation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentRotation, setCurrentRotation] = useState(0)

  const itemCount = carouselItems.length
  const angleStep = 360 / itemCount
  const radius = 280

  useEffect(() => {
    if (!isPlaying || isDragging) return

    const interval = setInterval(() => {
      setRotation(prev => prev - 0.3)
    }, 30)

    return () => clearInterval(interval)
  }, [isPlaying, isDragging])

  const handlePrev = useCallback(() => {
    setRotation(prev => prev + angleStep)
  }, [angleStep])

  const handleNext = useCallback(() => {
    setRotation(prev => prev - angleStep)
  }, [angleStep])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setCurrentRotation(rotation)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - startX
    setRotation(currentRotation + deltaX * 0.3)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setCurrentRotation(rotation)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.touches[0].clientX - startX
    setRotation(currentRotation + deltaX * 0.3)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="relative w-full py-4">
      {/* Carousel Container */}
      <div
        className="relative mx-auto h-[280px] md:h-[320px] perspective-1000 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute left-1/2 top-1/2 preserve-3d transition-transform duration-100"
          style={{
            transform: `translateX(-50%) translateY(-50%) rotateY(${rotation}deg)`,
          }}
        >
          {carouselItems.map((item, index) => {
            const angle = index * angleStep
            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[200px] md:w-[260px] h-[130px] md:h-[160px] -translate-x-1/2 -translate-y-1/2 preserve-3d"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                }}
              >
                <div className="relative w-full h-full group">
                  {/* Image Container */}
                  <div className="relative w-full h-full rounded-2xl overflow-hidden glass animate-pulse-glow">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 280px, 350px"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <h3 className="text-sm font-bold text-foreground text-center gradient-text">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  {/* Reflection */}
                  <div
                    className="absolute top-full left-0 right-0 h-[60px] rounded-xl overflow-hidden opacity-30 blur-sm"
                    style={{
                      transform: "scaleY(-1)",
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
                      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
                    }}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 280px, 350px"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full glass hover:bg-primary/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={cn(
            "p-2.5 rounded-full transition-all duration-300",
            isPlaying ? "glass hover:bg-primary/20" : "bg-primary/30 hover:bg-primary/40"
          )}
          aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-foreground" />
          ) : (
            <Play className="w-4 h-4 text-foreground" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-full glass hover:bg-primary/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Carousel Indicators */}
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
                "w-2 h-2 rounded-full transition-all duration-300",
                isActive ? "w-8 bg-primary" : "bg-foreground/30 hover:bg-foreground/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}
