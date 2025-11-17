import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      background: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=1140&h=500&fit=crop',
      productImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=400&fit=crop',
      brand: 'SIG SAUER',
      title: 'P365 XL',
      subtitle: 'WITH MANUAL SAFETY',
      buttonText: 'VIEW NOW',
      buttonLink: '/category/Handgun'
    },
    {
      id: 2,
      background: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=1140&h=500&fit=crop',
      productImage: 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=400&h=400&fit=crop',
      brand: 'CZ',
      title: 'P10C',
      subtitle: 'TACTICAL PISTOL',
      buttonText: 'BUY NOW',
      buttonLink: '/category/Handgun',
      price: '$1,200'
    },
    {
      id: 3,
      background: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1140&h=500&fit=crop',
      productImage: 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=400&h=400&fit=crop',
      brand: 'GLOCK',
      title: '17/19',
      subtitle: 'GEN 5 SERIES',
      buttonText: 'BROWSE GEN5',
      buttonLink: '/category/Handgun'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div id="slideshow" className="homepage-slider-container">
      <div id="homepage-slider" className="homepage-slider">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slider-item ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.background})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: index === currentSlide ? 'block' : 'none'
            }}
          >
            <div className="container" style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center' }}>
              {slide.productImage && (
                <div style={{ position: 'absolute', left: '10%', zIndex: 2, width: '400px' }}>
                  <img 
                    src={slide.productImage} 
                    alt={slide.title}
                    style={{ width: '100%', height: 'auto', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
                  />
                </div>
              )}
              <div
                className="slider-content"
                style={{
                  position: 'absolute',
                  zIndex: 3,
                  top: '40%',
                  right: '5%',
                  textAlign: 'right'
                }}
              >
                {slide.brand && (
                  <div style={{ color: '#fff', fontSize: '24px', fontFamily: 'Oswald, sans-serif', marginBottom: '10px', letterSpacing: '2px' }}>
                    {slide.brand}
                  </div>
                )}
                <h2 style={{ fontWeight: 'bold', color: '#fbad36', fontFamily: 'Oswald, sans-serif', fontSize: '64px', marginBottom: '10px', lineHeight: '1' }}>
                  {slide.title}
                </h2>
                <span style={{ fontWeight: 'normal', color: '#fff', fontSize: '18px', display: 'block', marginBottom: '20px', letterSpacing: '1px' }}>
                  {slide.subtitle}
                  {slide.price && <><br style={{ marginTop: '5px' }} /><span style={{ color: '#0e2f40', fontSize: '14px' }}>{slide.price}</span></>}
                </span>
                <Link
                  to={slide.buttonLink}
                  className="btn btn-default"
                  style={{
                    backgroundColor: '#ed5348',
                    color: 'white',
                    padding: '12px 30px',
                    textDecoration: 'none',
                    display: 'inline-block',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#d43d32'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#ed5348'}
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
        <div className="slider-dots" style={{ textAlign: 'center', padding: '20px' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentSlide ? '#ed5348' : '#ccc',
                margin: '0 5px',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeSlider;

