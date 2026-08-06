const { Supplier } = require('../models');

// Get all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['createdAt', 'DESC']] });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching suppliers.', error: error.message });
  }
};

// Get single supplier by ID
exports.getSupplierById = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching supplier details.', error: error.message });
  }
};

// Create new supplier
exports.createSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    const supplier = await Supplier.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    });

    res.status(201).json({ message: 'Supplier created successfully.', supplier });
  } catch (error) {
    res.status(500).json({ message: 'Server error creating supplier.', error: error.message });
  }
};

// Update existing supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    // Backend Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Supplier name is required.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ message: 'Supplier email is required.' });
    }
    if (!phone || phone.trim() === '') {
      return res.status(400).json({ message: 'Supplier phone is required.' });
    }

    supplier.name = name.trim();
    supplier.email = email.trim();
    supplier.phone = phone.trim();

    await supplier.save();

    res.json({ message: 'Supplier updated successfully.', supplier });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating supplier.', error: error.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    await supplier.destroy();
    res.json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting supplier.', error: error.message });
  }
};
