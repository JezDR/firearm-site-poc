import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';

function ProductCarousel({ title, products, onCartUpdate }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const scrollLeft = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollAmount = currentIndex * (100 / itemsPerView);
      scrollContainerRef.current.style.transform = `translateX(-${scrollAmount}%)`;
    }
  }, [currentIndex, itemsPerView]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="product-carousel-section" style={{ paddingTop: '40px', paddingBottom: '40px', backgroundColor: '#f7f7f7', marginTop: '34px' }}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2 className="filter-title" style={{ marginBottom: '30px', textAlign: 'center' }}>
              <span className="content">
                <strong>{title}</strong>
              </span>
            </h2>
            <div className="carousel-wrapper" style={{ position: 'relative' }}>
              <button
                className="carousel-nav carousel-prev"
                onClick={scrollLeft}
                disabled={currentIndex === 0}
                style={{
                  position: 'absolute',
                  left: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ed5348',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentIndex === 0 ? 0.5 : 1,
                  zIndex: 10
                }}
              >
                ‹
              </button>
              <div
                className="carousel-container"
                style={{
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <div
                  ref={scrollContainerRef}
                  className="carousel-track"
                  style={{
                    display: 'flex',
                    transition: 'transform 0.5s ease',
                    gap: '20px'
                  }}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="carousel-item"
                      style={{
                        minWidth: `calc(${100 / itemsPerView}% - 15px)`,
                        flexShrink: 0
                      }}
                    >
                      <ProductCard product={product} onAddToCart={onCartUpdate} />
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="carousel-nav carousel-next"
                onClick={scrollRight}
                disabled={currentIndex >= maxIndex}
                style={{
                  position: 'absolute',
                  right: '-50px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#ed5348',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: currentIndex >= maxIndex ? 'not-allowed' : 'pointer',
                  opacity: currentIndex >= maxIndex ? 0.5 : 1,
                  zIndex: 10
                }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCarousel;

