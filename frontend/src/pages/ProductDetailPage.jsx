import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load product details.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="alert-danger">{error || 'Product not found.'}</div>
          <button onClick={() => navigate('/products')} className="btn btn-secondary">
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : 'https://via.placeholder.com/250';

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card detail-card">
          <h2>{product.name}</h2>
          <div className="detail-content">
            <div className="detail-image-container">
              <img src={imageUrl} alt={product.name} className="detail-image" />
            </div>
            <div className="detail-info">
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> Rs.{Number(product.price).toFixed(2)}</p>
              <p><strong>Quantity:</strong> {product.quantity}</p>
              <p><strong>Supplier Name:</strong> {product.Supplier ? product.Supplier.name : 'N/A'}</p>
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button onClick={() => navigate('/products')} className="btn btn-secondary">
              Back
            </button>
            <Link to={`/products/edit/${product.id}`} className="btn btn-primary">
              Edit Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
