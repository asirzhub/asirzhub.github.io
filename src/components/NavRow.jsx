import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/NavRow.module.css'

function NavRow({ label, to, rowClass, backgroundImage, unavailable }) {
  const [loaded, setLoaded] = useState(!backgroundImage)

  const onDone = () => setLoaded(true)

  const className = [
    styles.navRow,
    rowClass ? styles[rowClass] : '',
    unavailable ? styles.unavailable : '',
    loaded ? styles.loaded : '',
  ].filter(Boolean).join(' ')

  const rowStyle  = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  const labelStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined

  const preloader = backgroundImage
    ? <img src={backgroundImage} onLoad={onDone} onError={onDone} alt="" className={styles.preloader} />
    : null

  const label_ = <span className={styles.label} style={labelStyle}>{label}</span>

  if (unavailable) {
    return <div className={className} style={rowStyle}>{preloader}{label_}</div>
  }

  return (
    <Link to={to} className={className} style={rowStyle}>
      {preloader}{label_}
    </Link>
  )
}

export default NavRow
