import React, { useState } from 'react';
import axios from 'axios';

function ItemForm() {
  const [mode, setMode] = useState('report'); // 'report' or 'claim'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    status: 'lost',
    date_found_lost: '',
    contact_info: '',
    claim_item_id: ''
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setMessage(null);
    setError(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      status: 'lost',
      date_found_lost: '',
      contact_info: '',
      claim_item_id: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      if (mode === 'report') {
        await axios.post('http://localhost:5000/api/items', formData);
        setMessage('Item reported successfully');
      } else if (mode === 'claim') {
        // Claim item API call - assuming endpoint exists
        await axios.post(`http://localhost:5000/api/items/${formData.claim_item_id}/claim`, { contact_info: formData.contact_info });
        setMessage('Item claimed successfully. Please visit the Lost and Found office to complete the claim process.');
      }
      setFormData({
        title: '',
        description: '',
        category: '',
        location: '',
        status: 'lost',
        date_found_lost: '',
        contact_info: '',
        claim_item_id: ''
      });
    } catch (err) {
      setError('Failed to submit form');
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h2 className="mb-4">{mode === 'report' ? 'Report Lost or Found Item' : 'Claim Found Item'}</h2>
      <div className="mb-3">
        <label className="form-label me-3">Select Mode:</label>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="mode" id="reportMode" value="report" checked={mode === 'report'} onChange={handleModeChange} />
          <label className="form-check-label" htmlFor="reportMode">Report Item</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="mode" id="claimMode" value="claim" checked={mode === 'claim'} onChange={handleModeChange} />
          <label className="form-check-label" htmlFor="claimMode">Claim Item</label>
        </div>
      </div>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {mode === 'report' ? (
          <>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input type="text" name="category" className="form-control" value={formData.category} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date Found/Lost</label>
              <input type="date" name="date_found_lost" className="form-control" value={formData.date_found_lost} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Contact Info</label>
              <input type="text" name="contact_info" className="form-control" value={formData.contact_info} onChange={handleChange} />
            </div>
          </>
        ) : (
          <>
            <div className="mb-3">
              <label className="form-label">Item ID to Claim</label>
              <input type="text" name="claim_item_id" className="form-control" value={formData.claim_item_id} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Your Contact Info</label>
              <input type="text" name="contact_info" className="form-control" value={formData.contact_info} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" className="btn btn-primary">{mode === 'report' ? 'Report Item' : 'Claim Item'}</button>
      </form>
    </div>
  );
}

export default ItemForm;
