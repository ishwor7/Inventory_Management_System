import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import './ProductListPage.css';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, suppRes] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/suppliers')
      ]);
      setProducts(prodRes.data);
      setSuppliers(suppRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data from server.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/products/${id}`);
      setMessage('Product deleted successfully.');
      setProducts(products.filter((prod) => prod.id !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete product.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Filter products by search query & supplier filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSupplier = selectedSupplier
      ? String(product.supplierId) === String(selectedSupplier)
      : true;
    return matchesSearch && matchesSupplier;
  });

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h2>Products</h2>
          <Link to="/products/add" className="btn btn-primary">Add Product</Link>
        </div>

        {message && <div className="alert-success">{message}</div>}
        {error && <div className="alert-danger">{error}</div>}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.target.value)}
            className="supplier-select"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((supp) => (
              <option key={supp.id} value={supp.id}>
                {supp.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Supplier</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => {
                    const isLowStock = product.quantity < 5;
                    const imageUrl = product.image
                      ? `http://localhost:5000/uploads/${product.image}`
                      : 'https://via.placeholder.com/50';

                    return (
                      <tr key={product.id} className={isLowStock ? 'low-stock-row' : ''}>
                        <td>
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        </td>
                        <td>{product.name}</td>
                        <td>Rs.{Number(product.price).toFixed(2)}</td>
                        <td>
                          {product.quantity}
                          {isLowStock && <span className="low-stock-badge"> (Low)</span>}
                        </td>
                        <td>{product.Supplier ? product.Supplier.name : 'N/A'}</td>
                        <td className="actions-cell">
                          <Link
                            to={`/products/view/${product.id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            View
                          </Link>
                          <Link
                            to={`/products/edit/${product.id}`}
                            className="btn btn-primary btn-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
