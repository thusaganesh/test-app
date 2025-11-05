import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/items`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    const handler = e => {
      // when a new item is created by the form we optimistically add it
      const newItem = e?.detail;
      if (newItem) setItems(prev => [newItem, ...prev]);
    };
    window.addEventListener('items:created', handler);
    return () => window.removeEventListener('items:created', handler);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete item?')) return;
    try {
      await axios.delete(`${API}/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading items…</div>;

  if (!items.length) return <div>No items yet. Add one above.</div>;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {items.map(item => (
        <div key={item._id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 6, display: 'flex', gap: 12 }}>
          <div style={{ width: 120, height: 80, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <small>No image</small>}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>{item.title} <small style={{ color: '#666' }}>{item.category}</small></h3>
            <p style={{ margin: '6px 0' }}>{item.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Rs {item.price?.toLocaleString?.() ?? item.price}</strong>
              <div>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
