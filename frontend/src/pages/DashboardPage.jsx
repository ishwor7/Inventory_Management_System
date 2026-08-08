import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './DashboardPage.css';

const DashboardPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <h2>Dashboard</h2>
        <p className="subtitle">Welcome to the Inventory Management System.</p>

        <div className="dashboard-cards">
          <div className="card dashboard-card">
            <h3>Manage Products</h3>
            <p>View, add, edit, or remove inventory products.</p>
            <Link to="/products" className="btn btn-primary">Go to Products</Link>
          </div>

          <div className="card dashboard-card">
            <h3>Manage Suppliers</h3>
            <p>View, add, edit, or delete supplier contacts.</p>
            <Link to="/suppliers" className="btn btn-primary">Go to Suppliers</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
