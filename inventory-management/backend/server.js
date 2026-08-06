const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const { sequelize, User, Supplier, Product } = require('./models');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static route for serving uploaded images
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/upload', uploadRoutes);

// Default Admin Seeding Function
const seedAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword
      });
      console.log('Default admin user created (username: admin, password: admin123).');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Database connection & Server initialization
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synced successfully with SQLite.');
    await seedAdminUser();
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
  });
