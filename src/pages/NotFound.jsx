import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import TicketCard from '../components/common/TicketCard';
import Button from '../components/common/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-page">
      <div className="container not-found-container">
        <TicketCard
          className="not-found-ticket"
          header={
            <div className="not-found-header">
              <span className="not-found-error-code">404</span>
              <span className="not-found-badge">OFF-ROUTE WAYPOINT</span>
            </div>
          }
          stub={
            <div className="not-found-stub">
              <Link to="/">
                <Button variant="primary" size="md" leftIcon={<ArrowLeft size={16} />}>
                  Return to Scheduled Route
                </Button>
              </Link>
            </div>
          }
        >
          <div className="not-found-body">
            <h1 className="not-found-title">Route Not Found on the Timetable</h1>
            <p className="not-found-desc">
              The page or destination you are trying to visit does not exist in our pilot network. Check your route or return to the main timetable.
            </p>
          </div>
        </TicketCard>
      </div>
    </main>
  );
}
