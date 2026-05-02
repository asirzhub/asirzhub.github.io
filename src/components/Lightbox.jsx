import { useState, useEffect, useRef, useCallback } from 'react'
import styles from '../styles/Lightbox.module.css'
import tagsData from '../data/tags.json'

function getYear(exif) {
  const v = exif?.DateTimeOriginal
  if (!v) return null
  if (v instanceof Date) return String(v.getFullYear())
  const m = String(v).match(/^(\d{4})/)
  return m ? m[1] : null
}

function formatCamera(exif) {
  const make = exif?.Make?.trim()
  const model = exif?.Model?.trim()
  if (!model && !make) return null
  if (!model) return make
  if (!make) return model
  if (model.toLowerCase().startsWith(make.toLowerCase())) return model
  return `${make} ${model}`
}

export default function Lightbox({ images, initialIndex, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const [exifData, setExifData] = useState(null)
  const calcMaxSize = () => Math.min(window.innerHeight - 150, window.innerWidth - 120)
  const [maxSize, setMaxSize] = useState(calcMaxSize)
  const touchStartX = useRef(null)

  const current = images[index]
  const tagEntry = tagsData[current.key] ?? {}

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Recompute max size on resize
  useEffect(() => {
    const onResize = () => setMaxSize(calcMaxSize())
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
        const data = await parse(current.src, {
          pick: ['DateTimeOriginal', 'Make', 'Model', 'LensModel']
        })
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

  const year   = exifData ? getYear(exifData) : null
  const camera = exifData ? formatCamera(exifData) : null
  const lens   = exifData?.LensModel?.trim() || null
  const film   = tagEntry.film || null
  const tags   = tagEntry.tags || []
  const metaFields = [year, camera, lens, film].filter(Boolean)

  return (
    <div className={styles.wrapper}>
      <div className={styles.dimmer} />

      <div
        className={styles.content}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.imageArea} onClick={e => e.stopPropagation()}>
          <div className={styles.imgWrapper} style={{ '--max-size': `${maxSize}px` }}>
            <img src={current.src} alt={current.alt} className={styles.img} draggable={false} />
            <button className={styles.downloadBtn} onClick={handleDownload} aria-label="Download image">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v13M5 13l7 7 7-7M3 21h18" />
              </svg>
              Download (3MP)
            </button>
          </div>

          {(metaFields.length > 0 || tags.length > 0) && (
            <div className={styles.metaPanel}>
              {metaFields.map((v, i) => (
                <span key={i} className={styles.metaItem}>{v}</span>
              ))}
              {tags.map((t, i) => (
                <span key={i} className={styles.tag}>{t}</span>
              ))}
            </div>
          )}

          <div className={styles.controls}>
            <button className={styles.navBtn} onClick={prev} aria-label="Previous image">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button className={styles.closeBtn} onClick={onClose}>Close</button>
            <button className={styles.navBtn} onClick={next} aria-label="Next image">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
