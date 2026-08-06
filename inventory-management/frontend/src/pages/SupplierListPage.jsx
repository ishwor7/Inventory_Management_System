import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import './SupplierListPage.css';

const SupplierListPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/suppliers');
      setSuppliers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load suppliers.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/suppliers/${id}`);
      setMessage('Supplier deleted successfully.');
      setSuppliers(suppliers.filter((s) => s.id !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete supplier.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>Suppliers</h2>
          <Link to="/suppliers/add" className="btn btn-primary">Add Supplier</Link>
        </div>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-danger">{error}</div>}

        {loading ? (
          <p>Loading suppliers...</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No suppliers found.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id}>
                      <td>{supplier.name}</td>
                      <td>{supplier.email}</td>
                      <td>{supplier.phone}</td>
                      <td className="actions-cell">
                        <Link
                          to={`/suppliers/edit/${supplier.id}`}
                          className="btn btn-primary btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierListPage;
