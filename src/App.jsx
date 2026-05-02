import { Routes, Route } from 'react-router-dom'
import PersistentLayout from './components/PersistentLayout'
import HomePage from './pages/HomePage'
import PhotographyPage from './pages/PhotographyPage'
import PhotoCategoryPage from './pages/PhotoCategoryPage'

function App() {
  return (
    <Routes>
      <Route element={<PersistentLayout />}>
        <Route path="/"                      element={<HomePage />} />
        <Route path="/photography"           element={<PhotographyPage />} />
        <Route path="/photography/:category" element={<PhotoCategoryPage />} />
      </Route>
    </Routes>
  )
}

export default App
