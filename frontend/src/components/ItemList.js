import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ItemList({ userRole = 'student' }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch items');
      setLoading(false);
    }
  };

  const handleClaim = async (itemId) => {
    setMessage(null);
    setError(null);
    try {
      await axios.post(`http://localhost:5000/api/items/${itemId}/claim`);
      setMessage('Item claimed successfully. Please visit the Lost and Found office to complete the claim process.');
      fetchItems();
    } catch (err) {
      setError('Failed to claim item');
    }
  };

  const handleDelete = async (itemId) => {
    setMessage(null);
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/items/${itemId}`);
      setMessage('Item deleted successfully.');
      fetchItems();
    } catch (err) {
      setError('Failed to delete item');
    }
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h2 className="mb-4">Lost and Found Items</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="row g-4">
          {items.map(item => (
            <div key={item.id} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {item.title} <span className={`badge ${item.status === 'lost' ? 'bg-danger' : 'bg-success'}`}>{item.status}</span>
                  </h5>
                  <p className="card-text">{item.description}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Location:</strong> {item.location}</p>
                  <p><strong>Date:</strong> {item.date_found_lost}</p>
                  <p><strong>Contact:</strong> {item.contact_info}</p>
                  {userRole === 'student' && item.status === 'found' && !item.claimed && (
                    <button className="btn btn-primary" onClick={() => handleClaim(item.id)}>Claim Item</button>
                  )}
                  {userRole === 'admin' && (
                    <>
                      <button className="btn btn-danger me-2" onClick={() => handleDelete(item.id)}>Delete</button>
                      {/* Additional admin controls like edit can be added here */}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemList;
