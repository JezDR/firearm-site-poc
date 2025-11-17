import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-content">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order.</p>
          <p>Order ID: #{orderId}</p>
          <p>You will receive a confirmation email shortly.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;

