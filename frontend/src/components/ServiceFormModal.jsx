import { useState } from 'react';
import api from '../api/axios';

const CATEGORIES = [
  'PARTY_HALL', 'MARRIAGE', 'BIRTHDAY', 'FLOWER_DECORATION', 'FOOD_COURT',
  'CATERING', 'DJ', 'PHOTOGRAPHY', 'INVITATION_CARD', 'EVENT_POSTER', 'OTHER',
];

const empty = {
  name: '', category: 'PARTY_HALL', description: '', price: '', imageUrl: '',
  address: '', capacity: '', paymentLimit: '', available: true,
};

export default function ServiceFormModal({ service, onClose, onSaved }) {
  const isNew = !service?.id;
  const [form, setForm] = useState(() => ({
    ...empty,
    ...service,
    price: service?.price ?? '',
    capacity: service?.capacity ?? '',
    paymentLimit: service?.paymentLimit ?? '',
  }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        price: parseFloat(form.price),
        imageUrl: form.imageUrl,
        address: form.address,
        capacity: form.capacity ? parseInt(form.capacity, 10) : null,
        paymentLimit: form.paymentLimit ? parseFloat(form.paymentLimit) : null,
        available: form.available,
      };
      if (isNew) {
        await api.post('/services', payload);
      } else {
        await api.put(`/services/${service.id}`, payload);
      }
      onSaved();
    } catch {
      setError('Could not save the service. Please check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <h3>{isNew ? 'Add service' : `Edit ${service.name}`}</h3>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={set('name')} required />
          </div>
          <div className="field">
            <label>Category</label>
            <select value={form.category} onChange={set('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replaceAll('_', ' ')}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={set('description')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Price (₹)</label>
              <input type="number" min="0" value={form.price} onChange={set('price')} required />
            </div>
            <div className="field">
              <label>Payment limit (₹, advance cap)</label>
              <input type="number" min="0" value={form.paymentLimit} onChange={set('paymentLimit')} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Capacity (for halls)</label>
              <input type="number" min="0" value={form.capacity} onChange={set('capacity')} />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={set('address')} />
            </div>
          </div>
          <div className="field">
            <label>Image URL</label>
            <input value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
              type="checkbox"
              id="available"
              checked={!!form.available}
              onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              style={{ width: 'auto' }}
            />
            <label htmlFor="available" style={{ marginBottom: 0 }}>Available for booking</label>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold" style={{ flex: 1 }} disabled={saving}>
              {saving ? 'Saving…' : 'Save service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
