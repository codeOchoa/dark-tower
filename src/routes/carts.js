import { Router } from 'express';
import fs from "node:fs";
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const cartsFile = path.join(__dirname, '../data/cart.json');
const productsFile = path.join(__dirname, '../data/products.json');

// Funciones auxiliares para leer y escribir archivos
const readCarts = () => {
    if (!fs.existsSync(cartsFile)) return [];
    return JSON.parse(fs.readFileSync(cartsFile, 'utf-8'));
};

const writeCarts = (data) => {
    fs.writeFileSync(cartsFile, JSON.stringify(data, null, 2));
};

const readProducts = () => {
    if (!fs.existsSync(productsFile)) return [];
    return JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
};

// Crear un carrito nuevo
router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = { id: (carts.length + 1).toString(), products: [] };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

// Obtener un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (!cart) return res.status(404).json({ error: "Cart not found" });
    res.json(cart);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const products = readProducts();

    const cartIndex = carts.findIndex(c => c.id === req.params.cid);
    if (cartIndex === -1) return res.status(404).json({ error: "Cart not found" });

    const productExists = products.some(p => p.id === req.params.pid);
    if (!productExists) return res.status(404).json({ error: "Producto no encontrado" });

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === req.params.pid);

    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    writeCarts(carts);
    res.json(cart);
});

export default router;
