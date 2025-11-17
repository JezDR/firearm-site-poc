import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';

function Category() {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName || '');

  return (
    <div className="category-page">
      <div className="container">
        <h1>{decodedCategory}</h1>
        <ProductList category={decodedCategory} />
      </div>
    </div>
  );
}

export default Category;

