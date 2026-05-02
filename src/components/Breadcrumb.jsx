import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import styles from '../styles/Breadcrumb.module.css'

function Breadcrumb({ crumbs, animKey }) {
  return (
    <div className={styles.breadcrumb}>
      <span key={animKey} className={styles.crumbsFade}>
        {crumbs.map((crumb, i) => (
          <Fragment key={i}>
            {i > 0 && <span className={styles.sep}>/</span>}
            {crumb.to
              ? <Link to={crumb.to}>{crumb.label}</Link>
              : <span className={styles.current}>{crumb.label}</span>
            }
          </Fragment>
        ))}
      </span>
    </div>
  )
}

export default Breadcrumb
