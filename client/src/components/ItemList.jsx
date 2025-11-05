import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ItemList.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const newItem = e?.detail;
      if (newItem) setItems(prev => [newItem, ...prev]);
    };
    window.addEventListener('items:created', handler);
    return () => window.removeEventListener('items:created', handler);
  }, []);

  const handleDelete = async id => {
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
    <div className="item-list">
      {items.map(item => (
        <div key={item._id} className="item-card">
          <div className="item-card-image">
            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : <small>No image</small>}
          </div>
          <div className="item-card-content">
            <h3>
              {item.title} <small>{item.category}</small>
            </h3>
            <p>{item.description}</p>
            <div className="item-card-footer">
              <strong>Rs {item.price?.toLocaleString?.() ?? item.price}</strong> &nbsp;
              <span>Quantity: {item.quantity ?? 0}</span>  {/* <-- Added quantity display */}
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
