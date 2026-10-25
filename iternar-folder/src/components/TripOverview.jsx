import TripIcon from './TripIcon.jsx'

const sampleTrips = [
  { city: 'Kyoto', country: 'Japan', dates: 'Oct 18 – Oct 24', days: '7 days', color: 'lavender' },
  { city: 'Lisbon', country: 'Portugal', dates: 'Nov 03 – Nov 07', days: '5 days', color: 'peach' },
  { city: 'Copenhagen', country: 'Denmark', dates: 'Dec 12 – Dec 16', days: '5 days', color: 'mint' },
]

export default function TripOverview() {
  return (
    <main className="overview-page">
      <div className="overview-heading">
        <div>
          <span className="eyebrow">YOUR JOURNEYS</span>
          <h1>Overview</h1>
          <p className="overview-subtitle">A little inspiration for where to go next.</p>
        </div>
        <button type="button" className="primary-button">
          <TripIcon name="plus" size={16} />
          New trip
        </button>
      </div>

      <section className="overview-stats" aria-label="Trip highlights">
        <div className="stat-card">
          <span className="stat-icon stat-icon-lavender"><TripIcon name="plan" size={18} /></span>
          <span className="stat-value">3</span>
          <span className="stat-label">Trips planned</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-peach"><TripIcon name="calendar" size={18} /></span>
          <span className="stat-value">17</span>
          <span className="stat-label">Days exploring</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon stat-icon-mint"><TripIcon name="pin" size={18} /></span>
          <span className="stat-value">6</span>
          <span className="stat-label">Places to discover</span>
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h2>Upcoming trips</h2>
          <p>Placeholder trips for your next adventures</p>
        </div>
        <button type="button" className="text-button">View all <span aria-hidden="true">→</span></button>
      </div>

      <section className="sample-trip-grid" aria-label="Sample trips">
        {sampleTrips.map((trip, index) => (
          <article className="sample-trip-card" key={trip.city}>
            <div className={`sample-trip-art ${trip.color}`}>
              <span className="trip-art-sun" />
              <span className="trip-art-hill hill-back" />
              <span className="trip-art-hill hill-front" />
              <span className="trip-art-index">0{index + 1}</span>
            </div>
            <div className="sample-trip-info">
              <div>
                <span className="sample-trip-country">{trip.country}</span>
                <h3>{trip.city}</h3>
              </div>
              <span className="trip-days">{trip.days}</span>
              <div className="sample-trip-dates"><TripIcon name="calendar" size={14} />{trip.dates}</div>
            </div>
          </article>
        ))}
      </section>
      <p className="placeholder-note">Overview uses sample information only. Your itinerary starts empty.</p>
    </main>
  )
}
