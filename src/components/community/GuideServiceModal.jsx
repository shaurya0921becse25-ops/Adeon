import React, { useState } from 'react';
import { PILOT_CITY_NAMES } from '../../data/destinations';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormField from '../common/FormField';
import './GuideServiceModal.css';

export default function GuideServiceModal({ isOpen, onClose }) {
  const { showToast } = useToast();
  const [serviceType, setServiceType] = useState('Walking Tour & Navigation');
  const [city, setCity] = useState('Shimla');
  const [priceBand, setPriceBand] = useState('₹1,500 – ₹2,500 per half day');
  const [pitch, setPitch] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Guide service listing submitted (Demo stub)', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Offer a Local Guide Service"
      subtitle="Local Guide feature: Publish verified walking tours, transit navigation, and neighborhood advisory services."
      size="md"
    >
      <form onSubmit={handleSubmit} className="guide-service-form">
        <FormField
          as="select"
          label="Service Type"
          required
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
        >
          <option value="Walking Tour & Navigation">Heritage Walking Tour & Transit Navigation</option>
          <option value="Market & Food Guide">Local Markets & Street Food Escort</option>
          <option value="Logistics Advisory">Pre-Trip Custom Timetable Review</option>
          <option value="Offbeat Trail Trek">Mountain Trail & Forest Walk</option>
        </FormField>

        <FormField
          as="select"
          label="City Base"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          {PILOT_CITY_NAMES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </FormField>

        <FormField
          label="Price Band"
          required
          value={priceBand}
          onChange={(e) => setPriceBand(e.target.value)}
          placeholder="e.g. ₹1,500 – ₹2,500 per group"
        />

        <FormField
          as="textarea"
          label="Short Pitch & Availability"
          required
          rows={3}
          placeholder="Describe your local focus (e.g. 'Born in Old Shimla. I navigate Cart Road traffic bottlenecks and historic British heritage corridors.')"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
        />

        <div className="guide-service-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Publish Guide Listing (Demo)
          </Button>
        </div>
      </form>
    </Modal>
  );
}
