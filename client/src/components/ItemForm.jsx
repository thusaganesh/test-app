import React, { useState } from 'react';
import axios from 'axios';
import './ItemForm.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ItemForm() {
  const [form, setForm] = useState({
    Item_no:  '',
    title: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
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
        Item_no: form.Item_no,
        title: form.title,
        description: form.description,
        price: Number(form.price) || 0,
        category: form.category,
        quantity:Number(form.quantity),
        
        imageUrl: form.imageUrl
      };
      const res = await axios.post(`${API}/items`, payload);
      setStatus('saved');
      setForm({ Item_no:'',title: '', description: '', price: '', category: '', quantity:'',imageUrl: '' });
      window.dispatchEvent(new CustomEvent('items:created', { detail: res.data }));
      setTimeout(() => setStatus(null), 1500);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h2>Create Item</h2>
      <div className="grid">
        <div>
          <label>Item NO*</label><br />
          <input name="Item_no" value={form.Item_no} onChange={handleChange} required />
        </div>
        
        <div>
          <label>Title *</label><br />
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Price</label><br />
          <input name="price" value={form.price} onChange={handleChange} />
        </div>
        <div className="span-full">
          <label>Description</label><br />
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div>
          <label>Category</label><br />
          <input name="category" value={form.category} onChange={handleChange} />
        </div>
         <div>
          <label>Quantity</label><br />
          <input name="quantity" value={form.quantity} onChange={handleChange} />
        </div>
         
        <div>
          <label>Image URL</label><br />
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </div>
       
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit">Submit</button>
        {status === 'saving' && <span className="status">Saving…</span>}
        {status === 'saved' && <span className="status saved">Saved</span>}
        {status === 'error' && <span className="status error">Error</span>}
      </div>
    </form>
  );
}
