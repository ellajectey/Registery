import { useEffect } from 'react'

export default function useHeroCanvas(ref) {
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, particles, rafId

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
      particles = Array.from({ length: 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 400 + 100,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 2 + 0.4,
        pulse: Math.random() * Math.PI * 2,
        col: ['#C9A84C', '#7B5EA7', '#3D6B4F'][Math.floor(Math.random() * 3)],
      }))
    }

    const rings = Array.from({ length: 4 }, (_, i) => ({
      rX: 110 + i * 85,
      rY: (110 + i * 85) * 0.38,
      tilt: 0.28 + i * 0.06,
      speed: 0.00028 + i * 0.00009,
      angle: i * Math.PI / 2,
      opacity: 0.075 - i * 0.014,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2

      // Orbital rings
      rings.forEach(r => {
        r.angle += r.speed
        ctx.strokeStyle = `rgba(201,168,76,${r.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(cx, cy, r.rX, r.rY * 0.42, r.tilt, 0, Math.PI * 2)
        ctx.stroke()

        // Moving dot on each ring
        const dx = cx + Math.cos(r.angle) * r.rX
        const dy = cy + Math.sin(r.angle) * r.rY * 0.42
        ctx.fillStyle = `rgba(201,168,76,${r.opacity * 4.5})`
        ctx.beginPath()
        ctx.arc(dx, dy, 2.2, 0, Math.PI * 2)
        ctx.fill()
      })

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.018
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0

        const sc    = 580 / (580 + p.z)
        const alpha = sc * 0.65 * (0.5 + 0.5 * Math.sin(p.pulse))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * sc, 0, Math.PI * 2)
        ctx.fillStyle = p.col + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Soft glow
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * sc * 5)
        g.addColorStop(0, p.col + '1A')
        g.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * sc * 5, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(201,168,76,${0.055 * (1 - d / 110)})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }
      }

      rafId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
    }
  }, [ref])
}
