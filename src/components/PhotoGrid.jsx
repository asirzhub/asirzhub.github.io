import { useState } from 'react'
import styles from '../styles/PhotoGrid.module.css'
import Lightbox from './Lightbox'

function PhotoGrid({ images }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  return (
    <>
      <div className={styles.photoGrid}>
        {images.map((img, i) => (
          <div key={i} className={styles.photoGridItem} onClick={() => setSelectedIndex(i)}>
            <img src={img.src} alt={img.alt} />
          </div>
        ))}
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
