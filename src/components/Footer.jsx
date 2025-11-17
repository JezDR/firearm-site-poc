import { Link } from 'react-router-dom';

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer">
        <div className="footer-middle">
          <div className="container">
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
              <div className="col-md-3" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ opacity: 0.45, fontSize: '24px', fontWeight: 'bold' }}>
                  Online Store
                </div>
              </div>
              <div className="col-md-4">
                <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>About Us</h3>
                <p style={{ lineHeight: '1.6', color: '#666' }}>
                  Your trusted online store offering a wide selection of quality products.
                  With a focus on quality, security, and expert support, we serve customers
                  with everything needed for their shopping needs.
                </p>
              </div>
              <div className="col-md-5">
                <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>Contact Us</h3>
                <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  <div className="col-sm-6">
                    <h5 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>ADDRESS:</h5>
                    <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                      123 Main Street, City, State 12345
                    </p>
                    <h5 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>PHONE:</h5>
                    <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                      (555) 123-4567<br />
                      Please call during business hours
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <h5 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>EMAIL:</h5>
                    <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                      sales@onlinestore.com
                    </p>
                    <h5 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>SHOP HOURS:</h5>
                    <p style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
                      Mon-Thu: 9:00 AM - 5:00 PM<br />
                      Fri: 9:00 AM - 4:30 PM<br />
                      Sat: 9:00 AM - 11:00 AM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-middle footer-middle-2">
          <div className="container">
            <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', paddingTop: '30px', borderTop: '1px solid #ddd' }}>
              <div className="col-md-3">
                <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>My Account</h3>
                <ul className="links" style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '8px' }}>
                    <Link to="/login" style={{ color: '#666', textDecoration: 'none' }}>Sign In</Link>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <Link to="/checkout" style={{ color: '#666', textDecoration: 'none' }}>View Cart</Link>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <Link to="/account" style={{ color: '#666', textDecoration: 'none' }}>My Wishlist</Link>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    <Link to="/orders" style={{ color: '#666', textDecoration: 'none' }}>Track My Order</Link>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  <div className="col-md-6">
                    <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Information</h3>
                    <ul className="links" style={{ listStyle: 'none', padding: 0 }}>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/about" style={{ color: '#666', textDecoration: 'none' }}>About Us</Link>
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/privacy" style={{ color: '#666', textDecoration: 'none' }}>Privacy Policy</Link>
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/terms" style={{ color: '#666', textDecoration: 'none' }}>Terms & Conditions</Link>
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/contact" style={{ color: '#666', textDecoration: 'none' }}>Contact Us</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>Customer Service</h3>
                    <ul className="links" style={{ listStyle: 'none', padding: 0 }}>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/shipping" style={{ color: '#666', textDecoration: 'none' }}>Shipping Info</Link>
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/returns" style={{ color: '#666', textDecoration: 'none' }}>Returns</Link>
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <Link to="/faq" style={{ color: '#666', textDecoration: 'none' }}>FAQ</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom" style={{ backgroundColor: '#333', color: '#fff', padding: '20px 0', marginTop: '30px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', fontSize: '14px' }}>
              © {new Date().getFullYear()} Online Store. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;

