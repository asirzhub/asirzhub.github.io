import { useState } from 'react'
import styles from '../styles/PhotoGrid.module.css'
import Lightbox from './Lightbox'

function PhotoGrid({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [loaded, setLoaded] = useState(() => new Set())

  const total      = images.length
  const someLoaded = loaded.size > 0
  const allLoaded  = loaded.size >= total

  const onImageDone = (i) => setLoaded(prev => new Set(prev).add(i))

  return (
    <>
      <div className={styles.gridWrapper}>
        {!allLoaded && (
          <div className={styles.loadBarTrack}>
            <div className={`${styles.loadBar} ${someLoaded ? styles.loadBarDim : ''}`} />
          </div>
        )}
        <div className={styles.photoGrid}>
          {images.map((img, i) => (
            <div key={img.key ?? i} className={styles.photoGridItem} onClick={() => setSelectedIndex(i)}>
              <img
                src={img.src}
                alt={img.alt}
                className={loaded.has(i) ? styles.imgVisible : undefined}
                onLoad={() => onImageDone(i)}
                onError={() => onImageDone(i)}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}

export default PhotoGrid
