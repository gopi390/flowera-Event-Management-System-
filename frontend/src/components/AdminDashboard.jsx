import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ServiceFormModal from './ServiceFormModal';

const TABS = ['Overview', 'Services', 'Bookings', 'Invoices & Payments', 'Customers'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('Overview');

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="user-block">
          <strong>{user.name}</strong>
          <span>{user.email} · Admin</span>
        </div>
        <nav className="dash-nav">
          {TABS.map((t) => (
            <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
          ))}
        </nav>
      </aside>

      <main className="dash-main">
        {tab === 'Overview' && <Overview />}
        {tab === 'Services' && <ServicesPanel />}
        {tab === 'Bookings' && <BookingsPanel />}
        {tab === 'Invoices & Payments' && <InvoicesPanel />}
        {tab === 'Customers' && <CustomersPanel />}
      </main>
    </div>
  );
}

// ---------------- Overview ----------------
function Overview() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api.get('/admin/summary').then((res) => setSummary(res.data));
  }, []);

  return (
    <div>
      <div className="section-head left">
        <span className="eyebrow">Admin control</span>
        <h2>Business overview</h2>
      </div>
      {summary ? (
        <div className="stat-row">
          <div className="stat-card"><strong>{summary.totalBookings}</strong><span>Total bookings</span></div>
          <div className="stat-card"><strong>{summary.totalCustomers}</strong><span>Customers</span></div>
          <div className="stat-card"><strong>₹{Number(summary.totalRevenue).toLocaleString('en-IN')}</strong><span>Revenue collected</span></div>
          <div className="stat-card"><strong>₹{Number(summary.totalDue).toLocaleString('en-IN')}</strong><span>Payments due</span></div>
        </div>
      ) : <p>Loading…</p>}
      <div className="card">
        <div className="card-body">
          <h3>Admin controls at a glance</h3>
          <p style={{ marginBottom: 0 }}>
            Use <strong>Services</strong> to add/edit offerings, toggle availability, and set the advance
            payment limit for each. Use <strong>Bookings</strong> to confirm or cancel customer requests.
            Use <strong>Invoices & Payments</strong> — visible only in this admin panel — to record payments
            and track dues per booking.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- Services ----------------
function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleAvailability = async (s) => {
    try {
      await api.patch(`/services/${s.id}/availability`, { available: !s.available });
      load();
    } catch {
      setError('Could not update availability.');
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/services/${s.id}`);
      load();
    } catch {
      setError('Could not delete this service (it may have existing bookings).');
    }
  };

  return (
    <div>
      <div className="section-head left" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="eyebrow">Manage catalog</span>
          <h2>Services</h2>
        </div>
        <button className="btn btn-gold" onClick={() => setEditing({})}>+ Add service</button>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? <p>Loading…</p> : (
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Category</th><th>Price</th><th>Payment limit</th><th>Available</th><th></th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>₹{Number(s.price).toLocaleString('en-IN')}</td>
                <td>{s.paymentLimit != null ? `₹${Number(s.paymentLimit).toLocaleString('en-IN')}` : '—'}</td>
                <td>
                  <span className={`badge ${s.available ? 'badge-available' : 'badge-unavailable'}`}>
                    {s.available ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(s)}>Edit</button>
                  <button className="btn btn-outline btn-sm" onClick={() => toggleAvailability(s)}>
                    {s.available ? 'Disable' : 'Enable'}
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing !== null && (
        <ServiceFormModal
          service={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

// ---------------- Bookings ----------------
const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="section-head left">
        <span className="eyebrow">All customer requests</span>
        <h2>Bookings</h2>
      </div>
      {loading ? <p>Loading…</p> : bookings.length === 0 ? (
        <div className="empty-state">No bookings yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Customer</th><th>Service</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Update</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.customer?.name}<br /><span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.customer?.email}</span></td>
                <td>{b.service?.name}</td>
                <td>{b.eventDate}</td>
                <td>{b.eventType}</td>
                <td>₹{Number(b.amount).toLocaleString('en-IN')}</td>
                <td><span className={`status-pill status-${b.status}`}>{b.status}</span></td>
                <td>
                  <select
                    value={b.status}
                    disabled={updatingId === b.id}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------- Invoices & Payments (admin-only) ----------------
function InvoicesPanel() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payAmount, setPayAmount] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/invoices');
      setInvoices(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const recordPayment = async (invoiceId) => {
    const amount = parseFloat(payAmount[invoiceId]);
    if (!amount || amount <= 0) {
      setError('Enter a valid payment amount.');
      return;
    }
    setError('');
    setSavingId(invoiceId);
    try {
      await api.patch(`/admin/invoices/${invoiceId}/pay`, { paidAmount: amount });
      setPayAmount((prev) => ({ ...prev, [invoiceId]: '' }));
      load();
    } catch {
      setError('Could not record payment.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <div className="section-head left">
        <span className="eyebrow">Admin panel only</span>
        <h2>Invoices & payments</h2>
        <p>Payment amounts, limits, and invoices are visible only here — customers see their own status in their dashboard, never other customers' data.</p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? <p>Loading…</p> : invoices.length === 0 ? (
        <div className="empty-state">No invoices yet.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Booking</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th>Record payment</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>#{inv.booking?.id} — {inv.booking?.service?.name}<br />
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inv.booking?.customer?.name}</span>
                </td>
                <td>₹{Number(inv.totalAmount).toLocaleString('en-IN')}</td>
                <td>₹{Number(inv.paidAmount).toLocaleString('en-IN')}</td>
                <td>₹{Number(inv.dueAmount).toLocaleString('en-IN')}</td>
                <td><span className={`status-pill status-${inv.paymentStatus}`}>{inv.paymentStatus}</span></td>
                <td>
                  {inv.paymentStatus !== 'PAID' ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="number"
                        min="0"
                        placeholder="Amount"
                        style={{ width: 100, padding: '6px 10px', borderRadius: 6, border: '1px solid var(--line)' }}
                        value={payAmount[inv.id] || ''}
                        onChange={(e) => setPayAmount((prev) => ({ ...prev, [inv.id]: e.target.value }))}
                      />
                      <button
                        className="btn btn-gold btn-sm"
                        disabled={savingId === inv.id}
                        onClick={() => recordPayment(inv.id)}
                      >
                        {savingId === inv.id ? '…' : 'Record'}
                      </button>
                    </div>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------- Customers ----------------
function CustomersPanel() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/customers').then((res) => setCustomers(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="section-head left">
        <span className="eyebrow">Everyone using Flovera</span>
        <h2>Customers</h2>
      </div>
      {loading ? <p>Loading…</p> : (
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.phone || '—'}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
