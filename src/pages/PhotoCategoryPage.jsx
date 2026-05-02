import { useParams, Navigate } from 'react-router-dom'
import { CATEGORY_TITLES } from '../data/categories'
import PhotoGrid from '../components/PhotoGrid'

const allImages = import.meta.glob(
  '../assets/photography/**/*',
  { eager: true }
)

function getImages(category) {
  return Object.entries(allImages)
    .filter(([path]) => path.includes(`/photography/${category}/`))
    .map(([path, mod]) => ({
      src: mod.default,
      alt: path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    }))
}

function PhotoCategoryPage() {
  const { category } = useParams()

  if (!CATEGORY_TITLES[category]) return <Navigate to="/photography" replace />

  return <PhotoGrid images={getImages(category)} />
}

export default PhotoCategoryPage
