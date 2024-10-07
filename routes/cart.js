const express = require('express');
const router = express.Router();

// Stockage en mémoire pour le panier
let cart = [];

// Ajouter un article au panier (POST /cart)
router.post('/', (req, res) => {
    const { id, name, description, price } = req.body;
    const article = { id, name, description, price };
    cart.push(article);
    res.status(201).json({ message: 'Article ajouté au panier', cart });
});

// Obtenir tous les articles du panier (GET /cart)
router.get('/', (req, res) => {
    res.json(cart);
});

// Supprimer tous les articles du panier (DELETE /cart)
router.delete('/', (req, res) => {
    cart = [];
    res.json({ message: 'Panier vidé' });
});

module.exports = router;
