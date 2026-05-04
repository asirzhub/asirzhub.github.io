import { Outlet, useLocation, useParams } from 'react-router-dom'
import { useNavigationDirection } from '../hooks/useNavigationDirection'
import { CATEGORY_TITLES } from '../data/categories'
import Breadcrumb from './Breadcrumb'
import pageStyles from '../styles/PageTransition.module.css'

const PAGE_DESCRIPTIONS = {
  '/':               'This is a portfolio of my creative work.',
  '/photography':    'Browse photos, organized by category.',
  'event':           'Moments captured at events.',
  'portraits':       'Pictures focused on people.',
  'places':          'Photos focused on locations.',
  'other':           'Miscellaneous and experimental photos.',
}

function getCrumbs(pathname, params) {
  if (pathname === '/')
    return [{ label: 'Asir Zaki' }]
  if (pathname === '/photography')
    return [{ label: 'Asir Zaki', to: '/' }, { label: 'Photography' }]
  if (params.category)
    return [
      { label: 'Asir Zaki',   to: '/' },
      { label: 'Photography', to: '/photography' },
      { label: CATEGORY_TITLES[params.category] || params.category },
    ]
  return [{ label: 'Asir Zaki' }]
}

function getDescription(pathname, params) {
  if (params.category) return PAGE_DESCRIPTIONS[params.category] ?? null
  return PAGE_DESCRIPTIONS[pathname] ?? null
}

export default function PersistentLayout() {
  const location  = useLocation()
  const params    = useParams()
  const direction = useNavigationDirection()

  return (
    <>
      <Breadcrumb
        crumbs={getCrumbs(location.pathname, params)}
        description={getDescription(location.pathname, params)}
        animKey={location.pathname}
      />
      <div style={{ overflow: 'hidden' }}>
        <div key={location.pathname} className={pageStyles[direction]}>
          <Outlet />
        </div>
      </div>
    </>
  )
}
