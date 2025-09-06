const express = require('express');
const app = express();
const path = require('path');
let products = [];

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json()); 

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/saibamais', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'saibamais.html'));
});

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const { name, price, quantity } = req.body;
    if (!name || !price || !quantity) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price, quantity } = req.body;

    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    products[index] = { id, name, price, quantity };
    res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const deleted = products.splice(index, 1);
    res.json({ message: 'Produto removido', produto: deleted[0] });
});


app.listen(8080, () => {
    console.log('Servidor iniciado na porta 8080: http://localhost:8080');
});
