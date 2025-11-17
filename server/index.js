import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db, { initializeDatabase } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const products = stmt.all(...params);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = stmt.get(parseInt(req.params.id));
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  try {
    const stmt = db.prepare('SELECT DISTINCT category FROM products ORDER BY category');
    const rows = stmt.all();
    const categories = rows.map(row => row.category);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Admin: Create new product with image upload
app.post('/api/admin/products', upload.single('image'), (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;
    
    if (!name || !category || !price || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get image URL - either uploaded file or provided URL
    let imageUrl = '';
    if (req.file) {
      // Use uploaded file
      imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      // Use provided URL
      imageUrl = req.body.imageUrl;
    } else {
      // Use fallback based on category
      const fallbackImages = {
        'Handgun': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=300&h=300&fit=crop',
        'Rifles Bolt Action': 'https://images.unsplash.com/photo-1583863788437-e58b9d8f5b1e?w=300&h=300&fit=crop',
        'Shotguns': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',
        'Ammunition': 'https://images.unsplash.com/photo-1544538136-3a3e5c9d5aa6?w=300&h=300&fit=crop',
        'OPTICS': 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&h=300&fit=crop',
        'Accessories': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=300&h=300&fit=crop'
      };
      imageUrl = fallbackImages[category] || fallbackImages['Handgun'];
    }

    const insertStmt = db.prepare(`
      INSERT INTO products (name, category, price, description, image, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insertStmt.run(
      name,
      category,
      parseFloat(price),
      description,
      imageUrl,
      parseInt(stock) || 0
    );

    const newProduct = {
      id: result.lastInsertRowid,
      name,
      category,
      price: parseFloat(price),
      description,
      image: imageUrl,
      stock: parseInt(stock) || 0
    };

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Admin: Update product
app.put('/api/admin/products/:id', upload.single('image'), (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Check if product exists
    const checkStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const existingProduct = checkStmt.get(productId);
    
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const { name, category, price, description, stock } = req.body;
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    
    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (category) {
      updates.push('category = ?');
      values.push(category);
    }
    if (price) {
      updates.push('price = ?');
      values.push(parseFloat(price));
    }
    if (description) {
      updates.push('description = ?');
      values.push(description);
    }
    if (stock !== undefined) {
      updates.push('stock = ?');
      values.push(parseInt(stock));
    }
    
    // Update image if new one uploaded
    if (req.file) {
      updates.push('image = ?');
      values.push(`http://localhost:${PORT}/uploads/${req.file.filename}`);
    } else if (req.body.imageUrl) {
      updates.push('image = ?');
      values.push(req.body.imageUrl);
    }
    
    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(productId);
      
      const updateStmt = db.prepare(`
        UPDATE products 
        SET ${updates.join(', ')}
        WHERE id = ?
      `);
      updateStmt.run(...values);
    }

    // Get updated product
    const getStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = getStmt.get(productId);
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Admin: Delete product
app.delete('/api/admin/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    // Check if product exists
    const checkStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = checkStmt.get(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete product (cart_items will be deleted via CASCADE if foreign keys are enabled)
    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    deleteStmt.run(productId);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Admin: Get all products (for management)
app.get('/api/admin/products', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM products ORDER BY created_at DESC');
    const products = stmt.all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Cart endpoints
app.get('/api/cart', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        ci.id,
        ci.product_id as productId,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.category as product_category,
        p.price as product_price,
        p.image as product_image,
        p.description as product_description,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `);
    const rows = stmt.all();
    
    // Transform rows to match expected format
    const cart = rows.map(row => ({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.product_name,
        category: row.product_category,
        price: row.product_price,
        image: row.product_image,
        description: row.product_description,
        stock: row.product_stock
      }
    }));
    
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists
    const productStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const product = productStmt.get(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already in cart
    const existingStmt = db.prepare('SELECT * FROM cart_items WHERE product_id = ?');
    const existingItem = existingStmt.get(productId);
    
    if (existingItem) {
      // Update quantity
      const updateStmt = db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?');
      updateStmt.run(quantity, existingItem.id);
    } else {
      // Insert new item
      const insertStmt = db.prepare('INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)');
      insertStmt.run(productId, quantity);
    }

    // Return updated cart
    const cartStmt = db.prepare(`
      SELECT 
        ci.id,
        ci.product_id as productId,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.category as product_category,
        p.price as product_price,
        p.image as product_image,
        p.description as product_description,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `);
    const rows = cartStmt.all();
    const cart = rows.map(row => ({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.product_name,
        category: row.product_category,
        price: row.product_price,
        image: row.product_image,
        description: row.product_description,
        stock: row.product_stock
      }
    }));

    res.json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.put('/api/cart/:id', (req, res) => {
  try {
    const { quantity } = req.body;
    const itemId = parseInt(req.params.id);
    
    if (quantity <= 0) {
      // Delete item if quantity is 0 or less
      const deleteStmt = db.prepare('DELETE FROM cart_items WHERE id = ?');
      deleteStmt.run(itemId);
    } else {
      const updateStmt = db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?');
      const result = updateStmt.run(quantity, itemId);
      
      if (result.changes === 0) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
    }

    // Return updated cart
    const cartStmt = db.prepare(`
      SELECT 
        ci.id,
        ci.product_id as productId,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.category as product_category,
        p.price as product_price,
        p.image as product_image,
        p.description as product_description,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `);
    const rows = cartStmt.all();
    const cart = rows.map(row => ({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.product_name,
        category: row.product_category,
        price: row.product_price,
        image: row.product_image,
        description: row.product_description,
        stock: row.product_stock
      }
    }));

    res.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

app.delete('/api/cart/:id', (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const deleteStmt = db.prepare('DELETE FROM cart_items WHERE id = ?');
    const result = deleteStmt.run(itemId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    // Return updated cart
    const cartStmt = db.prepare(`
      SELECT 
        ci.id,
        ci.product_id as productId,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.category as product_category,
        p.price as product_price,
        p.image as product_image,
        p.description as product_description,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      ORDER BY ci.created_at DESC
    `);
    const rows = cartStmt.all();
    const cart = rows.map(row => ({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      product: {
        id: row.product_id,
        name: row.product_name,
        category: row.product_category,
        price: row.product_price,
        image: row.product_image,
        description: row.product_description,
        stock: row.product_stock
      }
    }));

    res.json(cart);
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

app.delete('/api/cart', (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM cart_items');
    deleteStmt.run();
    res.json([]);
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Orders
app.get('/api/orders', (req, res) => {
  try {
    // Get all orders
    const ordersStmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
    const orders = ordersStmt.all();
    
    // Get items for each order
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    
    const ordersWithItems = orders.map(order => {
      const items = itemsStmt.all(order.id).map(item => ({
        id: item.id,
        productId: item.product_id,
        productName: item.product_name,
        productPrice: item.product_price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));
      
      return {
        id: order.id,
        total: order.total,
        status: order.status,
        customerInfo: {
          name: order.customer_name,
          email: order.customer_email,
          address: order.customer_address,
          city: order.customer_city,
          zip: order.customer_zip,
          phone: order.customer_phone
        },
        items,
        createdAt: order.created_at
      };
    });
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { items, customerInfo } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Calculate total
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Insert order
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        total, status, customer_name, customer_email, customer_address,
        customer_city, customer_zip, customer_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const orderResult = insertOrder.run(
      total,
      'pending',
      customerInfo.name,
      customerInfo.email,
      customerInfo.address,
      customerInfo.city,
      customerInfo.zip,
      customerInfo.phone
    );
    
    const orderId = orderResult.lastInsertRowid;

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, product_price, quantity, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const insertItems = db.transaction((items) => {
      for (const item of items) {
        insertItem.run(
          orderId,
          item.product.id,
          item.product.name,
          item.product.price,
          item.quantity,
          item.product.price * item.quantity
        );
      }
    });
    
    insertItems(items);

    // Clear cart
    const clearCart = db.prepare('DELETE FROM cart_items');
    clearCart.run();

    // Get created order with items
    const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
    const orderRow = orderStmt.get(orderId);
    
    const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    const itemsData = itemsStmt.all(orderId).map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      productPrice: item.product_price,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    const order = {
      id: orderRow.id,
      total: orderRow.total,
      status: orderRow.status,
      customerInfo: {
        name: orderRow.customer_name,
        email: orderRow.customer_email,
        address: orderRow.customer_address,
        city: orderRow.customer_city,
        zip: orderRow.customer_zip,
        phone: orderRow.customer_phone
      },
      items: itemsData,
      createdAt: orderRow.created_at
    };

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

