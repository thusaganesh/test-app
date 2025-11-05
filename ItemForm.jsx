import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ItemForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('saving');
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        category: form.category,
        imageUrl: form.imageUrl
      };
      const res = await axios.post(`${API}/items`, payload);
      setStatus('saved');
      // reset form
      setForm({ title: '', description: '', price: '', category: '', imageUrl: '' });
      // notify other parts of the app via custom event (simplest cross-component)
      window.dispatchEvent(new CustomEvent('items:created', { detail: res.data }));
      setTimeout(() => setStatus(null), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Create Item</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label>Title *</label><br/>
          <input name="title" value={form.title} onChange={handleChange} required style={{ width: '100%' }}/>
        </div>
        <div>
          <label>Price</label><br/>
          <input name="price" value={form.price} onChange={handleChange} style={{ width: '100%' }}/>
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label>Description</label><br/>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ width: '100%' }} />
        </div>
        <div>
          <label>Category</label><br/>
          <input name="category" value={form.category} onChange={handleChange} style={{ width: '100%' }}/>
        </div>
        <div>
          <label>Image URL</label><br/>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} style={{ width: '100%' }}/>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit">Submit</button>
        {status === 'saving' && <span style={{ marginLeft: 8 }}>Saving…</span>}
        {status === 'saved' && <span style={{ marginLeft: 8, color: 'green' }}>Saved</span>}
        {status === 'error' && <span style={{ marginLeft: 8, color: 'red' }}>Error</span>}
      </div>
    </form>
  );
}
