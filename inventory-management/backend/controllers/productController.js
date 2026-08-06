const { Product, Supplier } = require('../models');

// Get all products (with optional search and supplier filter)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Supplier, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products.', error: error.message });
  }
};

// Get single product details
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Supplier, attributes: ['id', 'name'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching product.', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;

    // Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Product description is required.' });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === null || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }
    if (!image || image.trim() === '') {
      return res.status(400).json({ message: 'Product image is required when creating a new product.' });
    }

    const supplierExists = await Supplier.findByPk(supplierId);
    if (!supplierExists) {
      return res.status(400).json({ message: 'Selected supplier does not exist.' });
    }

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      quantity: Number(quantity),
      supplierId: Number(supplierId),
      image: image.trim()
    });

    const fullProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name'] }]
    });

    res.status(201).json({ message: 'Product created successfully.', product: fullProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating product.', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, supplierId, image } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Product name is required.' });
    }
    if (!description || description.trim() === '') {
      return res.status(400).json({ message: 'Product description is required.' });
    }
    if (price === undefined || price === null || Number(price) < 0) {
      return res.status(400).json({ message: 'Price cannot be negative.' });
    }
    if (quantity === undefined || quantity === null || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative.' });
    }
    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier must be selected.' });
    }

    const supplierExists = await Supplier.findByPk(supplierId);
    if (!supplierExists) {
      return res.status(400).json({ message: 'Selected supplier does not exist.' });
    }

    product.name = name.trim();
    product.description = description.trim();
    product.price = Number(price);
    product.quantity = Number(quantity);
    product.supplierId = Number(supplierId);

    // Image is optional when updating
    if (image && image.trim() !== '') {
      product.image = image.trim();
    }

    await product.save();

    const fullProduct = await Product.findByPk(product.id, {
      include: [{ model: Supplier, attributes: ['id', 'name'] }]
    });

    res.json({ message: 'Product updated successfully.', product: fullProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product.', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product.', error: error.message });
  }
};
