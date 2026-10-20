import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { ArrowRight } from 'lucide-react';
import './DuskFinale.css';

export default function DuskFinale() {
  const navigate = useNavigate();
  return (
    <section className="dusk-finale" aria-label="Closing call to action">
      <div className="container dusk-finale__inner">
        <h2 className="dusk-finale__title">plant your next trip</h2>
        <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />} onClick={() => navigate('/itinerary')}>
          open planner
        </Button>
      </div>
      <footer className="dusk-finale__footer">
        <div className="container">
          <nav className="dusk-finale__links" aria-label="Footer">
            <Link to="/services">services</Link>
            <Link to="/community">community</Link>
            <Link to="/trip-match">trip match</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer">github</a>
          </nav>
          <p className="dusk-finale__note">team abeon · photo placeholders · all data is sample data</p>
        </div>
      </footer>
    </section>
  );
}
