import NavRow from '../components/NavRow'

const categoryBgs = import.meta.glob(
  '../assets/photography/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
)

function bgFor(category) {
  const entry = Object.entries(categoryBgs)
    .find(([p]) => p.match(new RegExp(`/photography/${category}\\.[^/]+$`)))
  return entry?.at(1).default
}

function PhotographyPage() {
  return (
    <>
      <NavRow label="Event"     to="/photography/event"     backgroundImage={bgFor('event')} />
      <NavRow label="Portraits" to="/photography/portraits" backgroundImage={bgFor('portraits')} />
      <NavRow label="Places"    to="/photography/places"    backgroundImage={bgFor('places')} />
      <NavRow label="Other"     to="/photography/other"     backgroundImage={bgFor('other')} />
    </>
  )
}

export default PhotographyPage
