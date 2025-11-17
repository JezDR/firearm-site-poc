import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    stock: '',
    imageUrl: '',
    imageFile: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: '' // Clear URL if file is selected
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: e.target.value,
      imageFile: null // Clear file if URL is provided
    }));
    setPreviewImage(e.target.value || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stock', formData.stock);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const newProduct = await response.json();
        setSuccessMessage(`Product "${newProduct.name}" created successfully!`);
        setFormData({
          name: '',
          category: '',
          price: '',
          description: '',
          stock: '',
          imageUrl: '',
          imageFile: null
        });
        setPreviewImage(null);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        fetchProducts();
      } else {
        const error = await response.json();
        setErrorMessage(error.error || 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccessMessage('Product deleted successfully!');
        fetchProducts();
      } else {
        setErrorMessage('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Failed to delete product');
    }
  };

  return (
    <div className="admin-page" style={{ padding: '40px 0', background: '#1a1a1a', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fff', fontSize: '32px' }}>Admin Panel</h1>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px',
              background: '#ed5348',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Store
          </button>
        </div>

        {successMessage && (
          <div style={{
            padding: '15px',
            background: '#28a745',
            color: 'white',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div style={{
            padding: '15px',
            background: '#dc3545',
            color: 'white',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {errorMessage}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Create Product Form */}
          <div style={{ background: '#2a2a2a', padding: '30px', borderRadius: '8px' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>Create New Product</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    background: '#1a1a1a',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}>
                  Product Image
                </label>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#999', marginBottom: '8px', fontSize: '14px' }}>
                    Upload Image:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', color: '#999', marginBottom: '8px', fontSize: '14px' }}>
                    Or enter image URL:
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      background: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>
                {previewImage && (
                  <div style={{ marginTop: '15px' }}>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '4px',
                        border: '1px solid #444'
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? '#666' : '#ed5348',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div style={{ background: '#2a2a2a', padding: '30px', borderRadius: '8px', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ color: '#fff', marginBottom: '20px' }}>All Products ({products.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {products.map(product => (
                <div
                  key={product.id}
                  style={{
                    background: '#1a1a1a',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #444',
                    display: 'flex',
                    gap: '15px'
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#fff', marginBottom: '5px', fontSize: '16px' }}>
                      {product.name}
                    </h3>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>
                      {product.category}
                    </p>
                    <p style={{ color: '#ed5348', fontSize: '14px', fontWeight: 'bold' }}>
                      ${product.price.toFixed(2)}
                    </p>
                    <p style={{ color: '#999', fontSize: '12px' }}>
                      Stock: {product.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: '8px 15px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      height: 'fit-content'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
                  No products yet. Create your first product!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;

