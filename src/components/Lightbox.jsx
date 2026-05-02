import { useState, useEffect, useRef, useCallback } from 'react'
import styles from '../styles/Lightbox.module.css'

function formatDateTaken(exif) {
  // Only trust DateTimeOriginal — the actual shutter-press timestamp.
  // DateTime is often the file-write date; DateTimeDigitized is scanner/import time.
  const v = exif?.DateTimeOriginal
  if (!v) return null
  if (v instanceof Date)
    return v.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  // Raw string form: "YYYY:MM:DD HH:MM:SS"
  const m = String(v).match(/^(\d{4}):(\d{2}):(\d{2})/)
  if (!m) return null
  return new Date(`${m[1]}-${m[2]}-${m[3]}`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const [exifData, setExifData] = useState(null)
  const [maxSize, setMaxSize] = useState(() => window.innerHeight - 150)
  const touchStartX = useRef(null)

  const current = images[index]

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Recompute max size on resize
  useEffect(() => {
    const onResize = () => setMaxSize(window.innerHeight - 150)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Load EXIF when image changes
  useEffect(() => {
    setExifData(null)
    let cancelled = false
    ;(async () => {
      try {
        const { parse } = await import('exifr')
        const data = await parse(current.src, { pick: ['DateTimeOriginal'] })
        if (!cancelled) setExifData(data ?? {})
      } catch {
        if (!cancelled) setExifData({})
      }
    })()
    return () => { cancelled = true }
  }, [current.src])

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  const handleDownload = async (e) => {
    e.stopPropagation()
    const ext = (current.src.split('.').pop().split('?')[0] || 'jpg').toLowerCase()
    const base = current.alt
      ? current.alt.trim().replace(/\s+/g, '-').toLowerCase()
      : 'photo'
    const filename = `${base}.${ext}`
    try {
      const res = await fetch(current.src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      window.open(current.src, '_blank')
    }
  }

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50) prev()
    else if (dx < -50) next()
    touchStartX.current = null
  }

  return (
    <div className={styles.wrapper}>
      {/* Glowing background thumbnail — sits under the dimmer */}
      <div className={styles.bg}>
        <img src={current.src} alt="" className={styles.bgImg} draggable={false} />
      </div>
      <div className={styles.dimmer} />

      {/* Clickable overlay — click anywhere here to close */}
      <div
        className={styles.content}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Date taken — top centre, only rendered when available */}
        {formatDateTaken(exifData) && (
          <div className={styles.dateLine} onClick={e => e.stopPropagation()}>
            {formatDateTaken(exifData)}
          </div>
        )}

        {/* Prev / image / next */}
        <button
          className={styles.navBtn}
          onClick={e => { e.stopPropagation(); prev() }}
          aria-label="Previous image"
        >&#8249;</button>

        <div
          className={styles.imgWrapper}
          style={{ width: maxSize, height: maxSize }}
          onClick={e => e.stopPropagation()}
        >
          <img src={current.src} alt={current.alt} className={styles.img} draggable={false} />
          <button className={styles.downloadBtn} onClick={handleDownload} aria-label="Download image">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13M5 13l7 7 7-7M3 21h18" />
            </svg>
            Download
          </button>
        </div>

        <button
          className={styles.navBtn}
          onClick={e => { e.stopPropagation(); next() }}
          aria-label="Next image"
        >&#8250;</button>
      </div>
    </div>
  )
}
