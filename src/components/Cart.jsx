import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

// Fallback image
const fallbackImage = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=80&h=80&fit=crop';

function Cart({ cartItems, onClose, onUpdate }) {
  const [items, setItems] = useState(cartItems);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const getImageSrc = (item) => {
    if (imageErrors[item.id] || !item.product?.image) {
      return fallbackImage;
    }
    return item.product.image;
  };

  useEffect(() => {
    setItems(cartItems);
  }, [cartItems]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setItems(updatedCart);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setItems(updatedCart);
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="cart-popup">
        <div className="cart-header">
          <h3>Shopping Cart</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="cart-content">
          <p className="cart-empty">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-popup">
      <div className="cart-header">
        <h3>Shopping Cart</h3>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={getImageSrc(item)}
                alt={item.product.name}
                className="cart-item-image"
                onError={() => handleImageError(item.id)}
                loading="lazy"
              />
              <div className="cart-item-details">
                <h4>{item.product.name}</h4>
                <p>${item.product.price.toFixed(2)} each</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <Link to="/checkout" className="checkout-btn" onClick={onClose}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;

