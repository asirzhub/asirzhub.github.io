import NavRow from '../components/NavRow'
import photographyBg from '../assets/photography/photography.jpg'
import threedBg from '../assets/3d.png'

function HomePage() {
  return (
    <>
      <NavRow label="Photography" to="/photography" backgroundImage={photographyBg} />
      <NavRow label="3D"          backgroundImage={threedBg} unavailable />
    </>
  )
}

export default HomePage
