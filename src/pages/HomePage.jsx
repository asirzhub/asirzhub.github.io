import NavRow from '../components/NavRow'
import photographyBg from '../assets/photography/photography.jpg'

function HomePage() {
  return (
    <>
      <NavRow label="Photography" to="/photography" backgroundImage={photographyBg} />
    </>
  )
}

export default HomePage
