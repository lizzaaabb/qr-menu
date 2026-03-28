'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import '../styles/hero.css'

const images = [
  '/menu1.png',
  '/menu2.png',
  '/menu3.png',
  '/menu4.png',
  '/menu2.png',
  '/menu3.png',
]

const GAP = 12
const DESKTOP_PEEK = 20

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [slidesPerView, setSlidesPerView] = useState(1)

  // Use refs for layout values so applyTransform never has stale data
  const slideWidthRef = useRef(0)
  const peekRef = useRef(DESKTOP_PEEK)

  const carouselRef = useRef(null)
  const trackRef = useRef(null)
  const dragStart = useRef(null)
  const dragOffset = useRef(0)
  const isDragging = useRef(false)
  const autoplayRef = useRef(null)
  const currentRef = useRef(0)

  const maxIndexRef = useRef(0)

  const getStepWidth = () => slideWidthRef.current + GAP

  const applyTransform = (index, extraOffset = 0) => {
    if (!trackRef.current || slideWidthRef.current === 0) return
    const x = peekRef.current - index * getStepWidth() + extraOffset
    trackRef.current.style.transform = `translateX(${x}px)`
  }

  const calculateSizes = useCallback(() => {
    if (!carouselRef.current) return
    const containerWidth = carouselRef.current.offsetWidth
    const isMobile = window.innerWidth <= 768

    let newSlideWidth, newPeek, newPerView

    if (isMobile) {
      newPerView = 1
      // Exact formula: peek + slideWidth + GAP + peek = containerWidth
      // Use 10% of container as peek so it's visually balanced
      newPeek = Math.round(containerWidth * 0.10)
      newSlideWidth = containerWidth - newPeek * 2 - GAP
    } else {
      newPerView = 2
      newPeek = DESKTOP_PEEK
      // PEEK + slide + GAP + slide + PEEK = containerWidth
      newSlideWidth = (containerWidth - newPeek * 2 - GAP) / 2
    }

    // Write to refs immediately — no async state lag
    slideWidthRef.current = newSlideWidth
    peekRef.current = newPeek
    maxIndexRef.current = images.length - newPerView

    // Apply widths to DOM slides directly
    if (trackRef.current) {
      const slides = trackRef.current.querySelectorAll('.hero-slide')
      slides.forEach(s => { s.style.width = `${newSlideWidth}px` })
    }

    setSlidesPerView(newPerView)

    // Re-apply transform with fresh values right away
    applyTransform(currentRef.current)
  }, [])

  useEffect(() => {
    calculateSizes()
    window.addEventListener('resize', calculateSizes)
    return () => window.removeEventListener('resize', calculateSizes)
  }, [calculateSizes])

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(index, maxIndexRef.current))
    currentRef.current = clamped
    setCurrent(clamped)
  }

  const resetAutoplay = () => {
    clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      const next = currentRef.current >= maxIndexRef.current ? 0 : currentRef.current + 1
      goTo(next)
    }, 1900)
  }

  useEffect(() => {
    resetAutoplay()
    return () => clearInterval(autoplayRef.current)
  }, [slidesPerView])

  useEffect(() => {
    if (!trackRef.current || slideWidthRef.current === 0) return
    trackRef.current.classList.add('animated')
    applyTransform(current)
  }, [current])

  const onDragStart = (clientX) => {
    isDragging.current = true
    dragStart.current = clientX
    dragOffset.current = 0
    if (trackRef.current) trackRef.current.classList.remove('animated')
    clearInterval(autoplayRef.current)
  }

  const onDragMove = (clientX) => {
    if (!isDragging.current) return
    dragOffset.current = clientX - dragStart.current
    applyTransform(current, dragOffset.current)
  }

  const onDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (trackRef.current) trackRef.current.classList.add('animated')

    const threshold = getStepWidth() * 0.3
    if (dragOffset.current < -threshold) {
      goTo(current + 1)
    } else if (dragOffset.current > threshold) {
      goTo(current - 1)
    } else {
      applyTransform(current)
    }

    dragOffset.current = 0
    resetAutoplay()
  }

  const maxIndex = images.length - slidesPerView

  return (
    <div
      className="hero-carousel"
      ref={carouselRef}
      onMouseDown={e => onDragStart(e.clientX)}
      onMouseMove={e => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={e => onDragStart(e.touches[0].clientX)}
      onTouchMove={e => { e.preventDefault(); onDragMove(e.touches[0].clientX) }}
      onTouchEnd={onDragEnd}
      style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
    >
      <div className="hero-eyebrow">Chef's Selection</div>
      <div className="hero-track animated" ref={trackRef}>
        {images.map((img, i) => (
          <div key={i} className="hero-slide">
            <Image
              src={img}
              alt={`slide ${i + 1}`}
              fill
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
              priority={i === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="hero-dots">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => { goTo(i); resetAutoplay() }}
          />
        ))}
      </div>
    </div>
  )
}