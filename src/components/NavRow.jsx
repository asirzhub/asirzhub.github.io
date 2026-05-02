import { Link } from 'react-router-dom'
import styles from '../styles/NavRow.module.css'

function NavRow({ label, to, rowClass, backgroundImage, unavailable }) {
  const className = [
    styles.navRow,
    rowClass ? styles[rowClass] : '',
    unavailable ? styles.unavailable : '',
  ].join(' ')

  const rowStyle  = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  const labelStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : undefined

  const label_ = <span className={styles.label} style={labelStyle}>{label}</span>

  if (unavailable) {
    return <div className={className} style={rowStyle}>{label_}</div>
  }

  return (
    <Link to={to} className={className} style={rowStyle}>
      {label_}
    </Link>
  )
}

export default NavRow
