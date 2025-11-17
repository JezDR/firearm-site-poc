import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

// Fallback images for different categories
const fallbackImages = {
  'Handgun': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop',
  'Rifles Bolt Action': 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=600&h=600&fit=crop',
  'Shotguns': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
  'Ammunition': 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=600&h=600&fit=crop',
  'OPTICS': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=600&fit=crop',
  'Accessories': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&h=600&fit=crop',
  'default': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&h=600&fit=crop'
};

function ProductDetail({ onCartUpdate }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setImageError(false);
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    if (!imageError && product) {
      setImageError(true);
    }
  };

  const getImageSrc = () => {
    if (!product) return fallbackImages.default;
    if (imageError || !product.image) {
      return fallbackImages[product.category] || fallbackImages.default;
    }
    return product.image;
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        // Dispatch event to update cart in Header
        window.dispatchEvent(new Event('cartUpdated'));
        if (onCartUpdate) {
          onCartUpdate();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found.</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/" className="back-link">← Back to Products</Link>
        <div className="product-detail">
          <div className="product-detail-image">
            <img 
              src={getImageSrc()} 
              alt={product.name}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            {product.stock > 0 ? (
              <>
                <p className="stock-status in-stock">
                  In Stock ({product.stock} available)
                </p>
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>
                <button
                  className="add-to-cart-btn large"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <p className="stock-status out-of-stock">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;

