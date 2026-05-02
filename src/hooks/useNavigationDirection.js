import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

const getDepth = (pathname) =>
  pathname === '/' ? 0 : pathname.split('/').filter(Boolean).length

export function useNavigationDirection() {
  const location = useLocation()
  const prevPathRef = useRef(location.pathname)
  const directionRef = useRef('forward')

  if (prevPathRef.current !== location.pathname) {
    const prevDepth = getDepth(prevPathRef.current)
    const newDepth = getDepth(location.pathname)
    directionRef.current = newDepth >= prevDepth ? 'forward' : 'back'
    prevPathRef.current = location.pathname
  }

  return directionRef.current
}
