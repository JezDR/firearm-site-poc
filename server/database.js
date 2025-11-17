import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'store.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initializeDatabase() {
  // Products table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cart items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_address TEXT NOT NULL,
      customer_city TEXT NOT NULL,
      customer_zip TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Order items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Insert initial products if table is empty
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (productCount.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (name, category, price, description, image, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const initialProducts = [
      ['Handgun Model X', 'Handgun', 1299.99, 'High-quality handgun for sport and self-defense.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=300&fit=crop', 15],
      ['Rifle Bolt Action Pro', 'Rifles Bolt Action', 1899.99, 'Precision bolt action rifle for hunting.', 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=300&fit=crop', 8],
      ['Shotgun Classic', 'Shotguns', 899.99, 'Reliable shotgun for sport shooting.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', 12],
      ['Ammunition Pack 9mm', 'Ammunition', 49.99, 'Premium 9mm ammunition pack (50 rounds).', 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=300&h=300&fit=crop', 100],
      ['Tactical Scope', 'OPTICS', 299.99, 'High-precision tactical scope.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=300&fit=crop', 25],
      ['Tactical Holster', 'Accessories', 79.99, 'Durable tactical holster.', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop', 30],
      ['Compact Pistol', 'Handgun', 899.99, 'Compact design perfect for concealed carry.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=300&fit=crop', 20],
      ['Hunting Rifle', 'Rifles Bolt Action', 2199.99, 'Professional grade hunting rifle with precision optics.', 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=300&fit=crop', 10],
      ['Sport Shotgun', 'Shotguns', 1299.99, 'Competition-grade sporting shotgun.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', 7],
      ['Premium Ammunition .45', 'Ammunition', 59.99, 'Premium .45 caliber ammunition (50 rounds).', 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=300&h=300&fit=crop', 150],
      ['Red Dot Sight', 'OPTICS', 199.99, 'High-quality red dot reflex sight.', 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=300&fit=crop', 35],
      ['Tactical Belt', 'Accessories', 89.99, 'Heavy-duty tactical belt with quick-release.', 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop', 25],
      ['Revolver Classic', 'Handgun', 1099.99, 'Classic revolver design with modern reliability.', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=300&fit=crop', 18],
      ['Long Range Rifle', 'Rifles Bolt Action', 2499.99, 'Long-range precision rifle for competitive shooting.', 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=300&fit=crop', 5],
      ['Tactical Shotgun', 'Shotguns', 1499.99, 'Tactical shotgun with extended magazine capacity.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', 9]
    ];

    const insertMany = db.transaction((products) => {
      for (const product of products) {
        insertProduct.run(...product);
      }
    });

    insertMany(initialProducts);
  }
}

export default db;

