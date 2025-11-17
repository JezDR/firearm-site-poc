import { useState, useEffect } from 'react';
import HomeSlider from '../components/HomeSlider';
import CategoryLinks from '../components/CategoryLinks';
import ProductCarousel from '../components/ProductCarousel';
import SupportSection from '../components/SupportSection';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://localhost:3001/api';

function Home({ searchQuery, selectedCategory }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      
      // Set featured products (first 8)
      setFeaturedProducts(data.slice(0, 8));
      
      // Set new products (last 5, or different selection)
      setNewProducts(data.slice(-5));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCartUpdate = () => {
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <div className="top-container">
        <HomeSlider />
        <CategoryLinks />
      </div>

      {!searchQuery && !selectedCategory && (
        <>
          <ProductCarousel
            title="Featured Products"
            products={featuredProducts}
            onCartUpdate={handleCartUpdate}
          />

          <div style={{ paddingTop: '40px', paddingBottom: '40px', background: '#1a1a1a' }}>
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <h2 className="filter-title" style={{ marginBottom: '30px', textAlign: 'center', color: '#fff' }}>
                    <span className="content">
                      <strong>New Products</strong>
                    </span>
                  </h2>
                  <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                    {newProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleCartUpdate}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SupportSection />
        </>
      )}

      {(searchQuery || selectedCategory) && (
        <div className="container" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          {searchQuery && (
            <p style={{ marginBottom: '20px' }}>
              Search results for: <strong>{searchQuery}</strong>
            </p>
          )}
          {selectedCategory && (
            <p style={{ marginBottom: '20px' }}>
              Category: <strong>{selectedCategory}</strong>
            </p>
          )}
          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
            {[...featuredProducts, ...newProducts].map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleCartUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
