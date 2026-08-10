import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import './ProductForm.css';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, suppRes] = await Promise.all([
          axiosClient.get(`/products/${id}`),
          axiosClient.get('/suppliers')
        ]);

        const prod = prodRes.data;
        setName(prod.name);
        setDescription(prod.description);
        setPrice(prod.price);
        setQuantity(prod.quantity);
        setSupplierId(prod.supplierId);
        setCurrentImage(prod.image);
        setSuppliers(suppRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Frontend Validations
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (price === '' || Number(price) < 0) {
      setError('Price cannot be negative.');
      return;
    }
    if (quantity === '' || Number(quantity) < 0) {
      setError('Quantity cannot be negative.');
      return;
    }
    if (!supplierId) {
      setError('Supplier must be selected.');
      return;
    }

    try {
      setSubmitting(true);
      let updatedFilename = currentImage;

      // If a new image was selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await axiosClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        updatedFilename = uploadRes.data.filename;
      }

      await axiosClient.put(`/products/${id}`, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        quantity: Number(quantity),
        supplierId: Number(supplierId),
        image: updatedFilename
      });

      navigate('/products');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to update product.');
      }
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="card form-card">
          <h2>Edit Product</h2>
          {error && <div className="alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (Rs.) *</label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div className="form-group">
              <label htmlFor="supplierId">Supplier *</label>
              <select
                id="supplierId"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supp) => (
                  <option key={supp.id} value={supp.id}>
                    {supp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Replace Image (Optional)</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {currentImage && (
                <div className="current-image-preview">
                  <p><small>Current Image:</small></p>
                  <img
                    src={`http://localhost:5000/uploads/${currentImage}`}
                    alt="Current product"
                  />
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Product'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/products')}
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

export default EditProductPage;
