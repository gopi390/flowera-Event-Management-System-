import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';

const CATEGORIES = [
  'PARTY_HALL', 'MARRIAGE', 'BIRTHDAY', 'FLOWER_DECORATION', 'FOOD_COURT',
  'CATERING', 'DJ', 'PHOTOGRAPHY', 'INVITATION_CARD', 'EVENT_POSTER', 'OTHER',
];

const CATEGORY_LABELS = {
  PARTY_HALL: 'Party Hall / Room',
  MARRIAGE: 'Marriage',
  BIRTHDAY: 'Birthday',
  FLOWER_DECORATION: 'Flower Decoration',
  FOOD_COURT: 'Food Court',
  CATERING: 'Catering',
  DJ: 'DJ & Sound',
  PHOTOGRAPHY: 'Photography',
  INVITATION_CARD: 'Invitation Cards',
  EVENT_POSTER: 'Event Posters',
  OTHER: 'Other',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1478146059778-26028b07395a?w=600&q=80';

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingService, setBookingService] = useState(null);
  const [bookedMsg, setBookedMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const params = category ? { category } : {};
      const res = await api.get('/services', { params });
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [category]);

  const handleBookClick = (service) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingService(service);
  };

  const handleBooked = () => {
    setBookingService(null);
    setBookedMsg('Booking created! Check your Dashboard for status and payment details.');
    setTimeout(() => setBookedMsg(''), 5000);
  };

  return (
    <div className="block container">
      <div className="section-head left">
        <span className="eyebrow">Full catalog</span>
        <h2>Services, pricing & availability</h2>
        <p>Every hall, décor package, and vendor service Flovera offers — book your date directly.</p>
      </div>

      {bookedMsg && <div className="success-msg">{bookedMsg}</div>}

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
      </div>

      {loading ? (
        <p>Loading services…</p>
      ) : services.length === 0 ? (
        <div className="empty-state">No services found in this category yet.</div>
      ) : (
        <div className="grid-3">
          {services.map((s) => (
            <div className="card" key={s.id}>
              <img src={s.imageUrl || FALLBACK_IMAGE} alt="" className="service-image" />
              <div className="card-body">
                <span className="tag">{CATEGORY_LABELS[s.category] || s.category}</span>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                {s.address && <p style={{ fontSize: '0.85rem', marginBottom: 6 }}>📍 {s.address}</p>}
                {s.capacity && <p style={{ fontSize: '0.85rem', marginBottom: 6 }}>👥 Capacity: {s.capacity} guests</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <div className="price">₹{Number(s.price).toLocaleString('en-IN')}<span> /event</span></div>
                  <span className={`badge ${s.available ? 'badge-available' : 'badge-unavailable'}`}>
                    {s.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 14 }}
                  disabled={!s.available}
                  onClick={() => handleBookClick(s)}
                >
                  {s.available ? 'Choose date & book' : 'Currently unavailable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookingService && (
        <BookingModal
          service={bookingService}
          onClose={() => setBookingService(null)}
          onBooked={handleBooked}
        />
      )}
    </div>
  );
}
