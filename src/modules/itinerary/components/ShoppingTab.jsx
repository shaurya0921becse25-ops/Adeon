import TripIcon from './TripIcon.jsx'

export default function ShoppingTab() {
  return (
    <main className="shopping-page">
      <section className="shopping-empty">
        <span className="shopping-icon"><TripIcon name="shopping" size={30} strokeWidth={1.7} /></span>
        <h1>Make Shopping Now</h1>
      </section>
    </main>
  )
}
