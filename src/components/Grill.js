'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import '../styles/cold.css'

const dishes = [
  { id: 1, label: 'სტეიკი',          sublabel: 'Steak', img: '/grill1.png', desc: 'რომენის სალათა, კრუტონები, პარმეზანი', price: '18' },
  { id: 2, label: 'ნეკნი', sublabel: 'BBQ Pork Ribs',  img: '/grill2.png', desc: 'პომიდორი, კიტრი, ფეტა, ზეითუნი',      price: '16' },
  { id: 3, label: 'ქათამი',            sublabel: 'Grilled Chicken Fillet',          img: '/grill3.png', desc: 'ახალი ბოსტნეული, სალსა, ავოკადო',     price: '14' },
  { id: 4, label: 'მწვადი',         sublabel: 'Skewers',       img: '/grill4.png', desc: 'მოცარელა, პომიდორი, ბაზილიკი',        price: '15' },
]

function Grill() {
  const router = useRouter()
  const [active, setActive] = useState(null)

  return (
    <div className="cold-wrap">

      {/* Header */}
      <div className="cold-hd">
        <button className="cold-back" onClick={() => router.push('/')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="cold-hd-center">
          <div className="cold-eyebrow">BBQ Grill</div>
          <div className="cold-title">გრილი <em>ბარბექიუ</em></div>
        </div>
        <div className="cold-badge">{dishes.length}</div>
      </div>

      {/* Ornament */}
      <div className="cold-orn">
        <span className="cold-orn-dot" />
        <span className="cold-orn-line" />
        <span className="cold-orn-diamond">◆</span>
        <span className="cold-orn-line" />
        <span className="cold-orn-dot" />
      </div>

      {/* Grid */}
      <div className="cold-grid">
        {dishes.map((dish, i) => (
          <div
            key={dish.id}
            className={`cold-card${active === dish.id ? ' cold-card--active' : ''}`}
            onMouseEnter={() => setActive(dish.id)}
            onMouseLeave={() => setActive(null)}
          >
            {/* Image */}
            <div className="cold-card-img">
              <Image src={dish.img} alt={dish.label} fill style={{ objectFit: 'cover' }} />
              <div className="cold-card-vignette" />
              <span className="cold-card-num">0{i + 1}</span>
              <div className="cold-card-corner" />
            </div>

            {/* Body */}
            <div className="cold-card-body">
              <div className="cold-card-sub">{dish.sublabel}</div>
              <div className="cold-card-name">{dish.label}</div>
              <div className="cold-card-divider" />
              <div className="cold-card-desc">{dish.desc}</div>
              <div className="cold-card-footer">
                <span className="cold-card-price">
                  <span className="cold-card-lari">₾</span>{dish.price}
                </span>
                <span className="cold-card-dot" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Grill