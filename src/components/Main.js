'use client'
import React, {useEffect} from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import '../styles/main.css'

const categories = [
  { id: 1, label: 'ცხელი კერძები', sublabel: 'Hot Dishes',  img: '/cat1.png', href: '/hot-dish' },
  { id: 2, label: 'ცივი კერძები',  sublabel: 'Cold Dishes', img: '/cat2.png', href: '/cold-dish' },
  { id: 3, label: 'გრილი',         sublabel: 'Grill',        img: '/cat3.png', href: '/grill' },
  { id: 4, label: 'ცომეული',       sublabel: 'Pastry',       img: '/cat4.png', href: '/pastry' },
  { id: 5, label: 'დესერტები',     sublabel: 'Desserts',     img: '/cat5.png', href: '/dessert' },
  { id: 6, label: 'სასმელი',       sublabel: 'Drinks',       img: '/cat6.png', href: '/drinks' },
]

export default function Main() {
  const router = useRouter()

  useEffect(() => {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
}, [])
  return (
    <div className="main-container">
      <div className="section-header">
        <div>
          <div className="section-eyebrow">Explore the menu</div>
          <div className="section-title">Our <em>Finest</em><br/>Dishes</div>
        </div>
        <a href="#" className="section-link">Explore</a>
      </div>
      <div className="category-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card" onClick={() => router.push(cat.href)}>
            <div className="category-img-wrap">
              <Image src={cat.img} alt={cat.label} fill style={{ objectFit: 'cover' }} />
            </div>
            <div className="category-label">
              <span className="category-label-text">
                <span className="gold-dot" />
                {cat.label}
              </span>
              <span className="category-label-sub">{cat.sublabel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

