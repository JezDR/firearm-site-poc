import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function Navigation({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <nav className="main-nav">
      <div className="container">
        <div className="menu-wrapper">
          <ul className="menu">
            <li className="menu-item">
              <Link to="/">Home</Link>
            </li>
            {categories.map((category) => (
              <li
                key={category}
                className="menu-item menu-item-has-children"
                onMouseEnter={() => setActiveDropdown(category)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={`/category/${encodeURIComponent(category)}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Link>
                {activeDropdown === category && (
                  <div className="nav-sublist-dropdown">
                    <div className="container">
                      <ul>
                        <li className="menu-item">
                          <Link
                            to={`/category/${encodeURIComponent(category)}`}
                            onClick={() => handleCategoryClick(category)}
                          >
                            View All {category}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;

