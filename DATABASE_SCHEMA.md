# Database Schema Documentation

This document describes the database schema used in the online store application. The current implementation uses SQLite, but this schema can be easily migrated to MySQL or other SQL databases.

## Database: store.db (SQLite)

### Table: products

Stores all product information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique product identifier |
| name | TEXT | NOT NULL | Product name |
| category | TEXT | NOT NULL | Product category (e.g., "Handgun", "Ammunition") |
| price | REAL | NOT NULL | Product price (decimal number) |
| description | TEXT | NOT NULL | Product description |
| image | TEXT | NOT NULL | Product image URL or path |
| stock | INTEGER | DEFAULT 0 | Available stock quantity |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record last update timestamp |

**Indexes:**
- Primary key on `id`
- Consider adding index on `category` for faster category filtering

**MySQL Migration Notes:**
- `INTEGER` → `INT` or `BIGINT`
- `TEXT` → `VARCHAR(255)` or `TEXT`
- `REAL` → `DECIMAL(10, 2)` for price
- `AUTOINCREMENT` → `AUTO_INCREMENT`
- `DATETIME DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` or `DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`

---

### Table: cart_items

Stores items in the shopping cart (session-based).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique cart item identifier |
| product_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to products.id |
| quantity | INTEGER | NOT NULL, DEFAULT 1 | Quantity of product in cart |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Foreign Keys:**
- `product_id` → `products(id)` ON DELETE CASCADE

**MySQL Migration Notes:**
- Add `session_id` or `user_id` column for multi-user support
- Consider adding `updated_at` column
- `ON DELETE CASCADE` works the same in MySQL

---

### Table: orders

Stores customer order information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique order identifier |
| total | REAL | NOT NULL | Total order amount |
| status | TEXT | DEFAULT 'pending' | Order status (pending, processing, shipped, completed, cancelled) |
| customer_name | TEXT | NOT NULL | Customer full name |
| customer_email | TEXT | NOT NULL | Customer email address |
| customer_address | TEXT | NOT NULL | Customer street address |
| customer_city | TEXT | NOT NULL | Customer city |
| customer_zip | TEXT | NOT NULL | Customer ZIP/postal code |
| customer_phone | TEXT | NOT NULL | Customer phone number |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Order creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Order last update timestamp |

**Indexes:**
- Primary key on `id`
- Consider adding index on `customer_email` for customer lookup
- Consider adding index on `status` for filtering orders by status
- Consider adding index on `created_at` for date range queries

**MySQL Migration Notes:**
- `REAL` → `DECIMAL(10, 2)` for total
- `TEXT` → `VARCHAR(255)` for most fields, `TEXT` for address
- `status` → `ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled')` or `VARCHAR(20)`
- Consider adding `user_id` column if implementing user accounts

---

### Table: order_items

Stores individual items within each order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique order item identifier |
| order_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to orders.id |
| product_id | INTEGER | NOT NULL, FOREIGN KEY | Reference to products.id |
| product_name | TEXT | NOT NULL | Product name at time of order (snapshot) |
| product_price | REAL | NOT NULL | Product price at time of order (snapshot) |
| quantity | INTEGER | NOT NULL | Quantity ordered |
| subtotal | REAL | NOT NULL | Line item total (product_price * quantity) |

**Foreign Keys:**
- `order_id` → `orders(id)` ON DELETE CASCADE
- `product_id` → `products(id)`

**Indexes:**
- Primary key on `id`
- Consider adding index on `order_id` for faster order item retrieval

**MySQL Migration Notes:**
- `REAL` → `DECIMAL(10, 2)` for prices
- `TEXT` → `VARCHAR(255)` for product_name
- Note: `product_name` and `product_price` are stored as snapshots to preserve order history even if product details change

---

## Relationships

```
products (1) ──< (many) cart_items
products (1) ──< (many) order_items
orders (1) ──< (many) order_items
```

## MySQL Migration SQL

Here's a sample MySQL migration script:

```sql
-- Products table
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(500) NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Cart items table
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_city VARCHAR(100) NOT NULL,
  customer_zip VARCHAR(20) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (customer_email),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Future Enhancements

Consider adding these tables for a more complete e-commerce system:

1. **users** - User accounts and authentication
2. **sessions** - Session management for cart persistence
3. **product_images** - Multiple images per product
4. **product_reviews** - Customer reviews and ratings
5. **categories** - Hierarchical category structure
6. **inventory_log** - Inventory change history
7. **payments** - Payment transaction records
8. **shipping_addresses** - Saved shipping addresses per user

