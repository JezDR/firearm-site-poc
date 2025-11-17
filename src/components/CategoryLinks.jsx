import { Link } from 'react-router-dom';

function CategoryLinks() {
  const categories = [
    {
      name: 'HANDGUNS',
      link: '/category/Handgun',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=200&fit=crop',
      buttonText: 'SHOP NOW'
    },
    {
      name: 'AMMO',
      link: '/category/Ammunition',
      image: 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=300&h=200&fit=crop',
      buttonText: 'SHOP NOW'
    },
    {
      name: 'RIFLES',
      link: '/category/Rifles%20Bolt%20Action',
      image: 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=200&fit=crop',
      buttonText: 'SHOP NOW'
    }
  ];

  return (
    <div className="single-images" style={{ paddingBottom: '20px', paddingTop: '20px', background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)' }}>
      <div className="container">
        <div className="row" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          {categories.map((category) => (
            <div
              key={category.name}
              className="category-block"
              style={{
                position: 'relative',
                maxWidth: '300px',
                width: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                background: '#2a2a2a',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              <Link to={category.link} className="image-link" style={{ display: 'block', position: 'relative' }}>
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  padding: '20px',
                  textAlign: 'center'
                }}>
                  <h3 style={{
                    color: '#ed5348',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}>
                    {category.name}
                  </h3>
                  <div style={{
                    backgroundColor: '#000',
                    color: '#fff',
                    padding: '10px 25px',
                    display: 'inline-block',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    letterSpacing: '1px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#ed5348'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
                  >
                    {category.buttonText}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryLinks;

