import { useState } from 'react';
import api from '../api/axios';

const EVENT_TYPES = ['Marriage', 'Birthday', 'Reception', 'Corporate', 'Other'];

export default function BookingModal({ service, onClose, onBooked }) {
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Marriage');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!eventDate) {
      setError('Please choose an event date.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/bookings', {
        serviceId: service.id,
        eventDate,
        eventType,
        notes,
      });
      onBooked();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create booking. Please try another date.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Book {service.name}</h3>
        <p style={{ marginBottom: 20 }}>
          {service.address ? `${service.address} · ` : ''}₹{Number(service.price).toLocaleString('en-IN')}
        </p>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="eventDate">Event date</label>
            <input
              id="eventDate"
              type="date"
              min={today}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="eventType">Event type</label>
            <select id="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="notes">Notes (optional)</label>
            <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Guest count, special requests, etc." />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Booking…' : 'Confirm booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
