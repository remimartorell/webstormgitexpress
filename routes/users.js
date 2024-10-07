const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Stockage en mémoire des utilisateurs
let users = [];

// Secret pour JWT
const JWT_SECRET = 'votre_secret_pour_jwt';

// Endpoint pour l'inscription
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body; // Inclure le rôle (par exemple, "user" ou "admin")

  // Vérifier si l'utilisateur existe déjà
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'Utilisateur déjà existant.' });
  }

  // Hash le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Ajouter l'utilisateur avec le rôle
  users.push({ username, password: hashedPassword, role });
  res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
});

// Endpoint pour la connexion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Trouver l'utilisateur
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect.' });
  }

  // Vérifier le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Utilisateur ou mot de passe incorrect.' });
  }

  // Créer le token JWT avec le rôle de l'utilisateur
  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;