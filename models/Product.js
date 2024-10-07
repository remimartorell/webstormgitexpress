const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Ajouter l'auto-incrémentation pour le champ "id"
productSchema.plugin(AutoIncrement, { inc_field: 'ObjectId' });

module.exports = mongoose.model('Product', productSchema);