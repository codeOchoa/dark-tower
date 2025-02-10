import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productsFile = path.join(__dirname, '../data/products.json');

// Function write/read products
const readProducts = () => {
    if (!fs.existsSync(productsFile)) return [];
    return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
};

const writeProducts = (data) => {
    fs.writeFileSync(productsFile, JSON.stringify(data, null, 2));
};

// Function ?limit optional
router.get('/', (req, res) => {
    let products = readProducts();
    const { limit } = req.query;
    if (limit) products = products.slice(0, parseInt(limit));
    res.json(products);
});

// GET product for ID
router.get('/:pid', (req, res) => {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
});

// Add prdocut
router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || stock === undefined || !category)
        return res.status(400).json({ error: "Todos los campos son obligatorios excepto thumbnails" });

    const products = readProducts();
    const newProduct = {
        id: (products.length + 1).toString(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

// Refresh products
router.put('/:pid', (req, res) => {
    let products = readProducts();
    const index = products.findIndex(p => p.id === req.params.pid);
    if (index === -1) return res.status(404).json({ error: "Product not found" });

    const { id, ...updatedFields } = req.body;
    products[index] = { ...products[index], ...updatedFields };
    writeProducts(products);
    res.json(products[index]);
});

// Remove product
router.delete('/:pid', (req, res) => {
    let products = readProducts();
    const filteredProducts = products.filter(p => p.id !== req.params.pid);
    if (filteredProducts.length === products.length)
        return res.status(404).json({ error: "Product not found" });

    writeProducts(filteredProducts);
    res.json({ message: "Product removed" });
});

export default router;
