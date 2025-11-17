import { useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

// Fallback images for different categories
const fallbackImages = {
  'Handgun': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=300&fit=crop',
  'Rifles Bolt Action': 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=300&fit=crop',
  'Shotguns': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
  'Ammunition': 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=300&h=300&fit=crop',
  'OPTICS': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=300&fit=crop',
  'Accessories': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop',
  'default': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=300&fit=crop'
};

function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.image || fallbackImages[product.category] || fallbackImages.default);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(fallbackImages[product.category] || fallbackImages.default);
    }
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
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Dispatch event to update cart in Header
        window.dispatchEvent(new Event('cartUpdated'));
        if (onAddToCart) {
          onAddToCart();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <img 
            src={imageSrc} 
            alt={product.name}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">${product.price.toFixed(2)}</p>
          {product.stock > 0 ? (
            <span className="stock-status in-stock">In Stock</span>
          ) : (
            <span className="stock-status out-of-stock">Out of Stock</span>
          )}
        </div>
      </Link>
      <button
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;

