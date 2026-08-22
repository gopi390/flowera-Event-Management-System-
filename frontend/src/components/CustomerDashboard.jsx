import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/me');
      setData(res.data);
    } catch (err) {
      setError('Could not load your dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    setCancellingId(id);
    try {
      await api.patch(`/bookings/${id}/cancel`);
      await load();
    } catch (err) {
      window.alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const bookings = data?.bookings || [];
  const activeCount = bookings.filter((b) => b.booking.status !== 'CANCELLED').length;
  const totalDue = bookings.reduce((sum, b) => sum + (b.invoice?.dueAmount || 0), 0);

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="user-block">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <nav className="dash-nav">
          <button className="active">My bookings</button>
          <Link to="/services"><button style={{ width: '100%', textAlign: 'left' }}>Book a new service</button></Link>
        </nav>
      </aside>

      <main className="dash-main">
        <div className="section-head left">
          <span className="eyebrow">Your dashboard</span>
          <h2>My bookings & payments</h2>
        </div>

        <div className="stat-row">
          <div className="stat-card"><strong>{bookings.length}</strong><span>Total bookings</span></div>
          <div className="stat-card"><strong>{activeCount}</strong><span>Active bookings</span></div>
          <div className="stat-card"><strong>₹{totalDue.toLocaleString('en-IN')}</strong><span>Total due</span></div>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : error ? (
          <div className="error-msg">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state card">
            <div className="card-body">
              <h3>No bookings yet</h3>
              <p>Browse services and book your first event with Flovera.</p>
              <Link to="/services" className="btn btn-gold">Browse services</Link>
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Event date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Due</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(({ booking, invoice }) => (
                <tr key={booking.id}>
                  <td>{booking.service?.name}</td>
                  <td>{booking.eventDate}</td>
                  <td>{booking.eventType}</td>
                  <td>₹{Number(booking.amount).toLocaleString('en-IN')}</td>
                  <td><span className={`status-pill status-${booking.status}`}>{booking.status}</span></td>
                  <td>
                    {invoice?.paymentStatus
                      ? <span className={`status-pill status-${invoice.paymentStatus}`}>{invoice.paymentStatus}</span>
                      : '—'}
                  </td>
                  <td>{invoice?.dueAmount != null ? `₹${Number(invoice.dueAmount).toLocaleString('en-IN')}` : '—'}</td>
                  <td>
                    {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => cancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? 'Cancelling…' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
