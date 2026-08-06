import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import './SupplierForm.css';

const AddSupplierPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!name.trim()) {
      setError('Supplier name is required.');
      return;
    }
    if (!email.trim()) {
      setError('Supplier email is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Supplier phone is required.');
      return;
    }

    try {
      setSubmitting(true);
      await axiosClient.post('/suppliers', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      });
      navigate('/suppliers');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create supplier.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card supplier-form-card">
          <h2>Add Supplier</h2>
          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter supplier email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter supplier phone"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Supplier'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/suppliers')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSupplierPage;
