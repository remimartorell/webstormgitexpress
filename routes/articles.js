const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Créer un article (POST /articles)
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Lire tous les articles (GET /articles)
router.get('/', async (req, res) => {
    try {
        const { sort, limit } = req.query;
        const sortOptions = sort ? sort.split(',').join(' ') : '';
        const products = await Product.find().sort(sortOptions).limit(parseInt(limit) || 0);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Compter le nombre d'articles (GET /articles/count)
router.get('/count', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mettre à jour un article (PUT /articles/:id)
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Supprimer un article (DELETE /articles/:id)
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        res.json({ message: 'Article supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lire un article par ID (GET /articles/:id)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;