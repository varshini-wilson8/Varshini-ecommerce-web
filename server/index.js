const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, 'data.json');

function readData(){
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch(e){
    return { products: [], users: [], orders: [], wishlist: [], reviews: [], tickets: [] };
  }
}
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

// Seed data if empty
const seed = {
  products: [
    { id: 1, name: 'Wireless Headphones', price: 1999, rating: 4.4, image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439" },
    { id: 2, name: 'Smartphone X', price: 24999, rating: 4.7, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
    { id: 3, name: 'Laptop Pro 14', price: 89999, rating: 4.6, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
    { id: 4, name: 'Smart Watch', price: 4499, rating: 4.1, image: "https://images.unsplash.com/photo-1519744346366-d4f32b47f8e3" }
  ],
  users: [],
  orders: [],
  wishlist: [],
  reviews: [],
  tickets: []
};

if(!fs.existsSync(DATA_FILE)){
  writeData(seed);
}

// Basic routes
app.get('/api/products', (req, res) => {
  const d = readData();
  res.json(d.products);
});

// Auth: register/login (mock, no passwords hashed - demo only)
app.post('/api/register', (req, res) => {
  const { name, email } = req.body;
  if(!email || !name) return res.status(400).json({ error: 'name and email required' });
  const d = readData();
  if(d.users.find(u => u.email === email)) return res.status(400).json({ error: 'user exists' });
  const user = { id: Date.now(), name, email };
  d.users.push(user);
  writeData(d);
  res.json({ user });
});

app.post('/api/login', (req, res) => {
  const { email } = req.body;
  const d = readData();
  const user = d.users.find(u => u.email === email);
  if(!user) return res.status(400).json({ error: 'user not found' });
  res.json({ user });
});

// Orders
app.get('/api/orders', (req, res) => {
  const d = readData();
  res.json(d.orders);
});
app.post('/api/orders', (req, res) => {
  const d = readData();
  const order = { orderId: Date.now(), ...req.body, orderedAt: new Date().toISOString() };
  d.orders.push(order);
  writeData(d);
  res.json(order);
});

// Wishlist
app.get('/api/wishlist', (req, res) => {
  const d = readData();
  res.json(d.wishlist);
});
app.post('/api/wishlist', (req, res) => {
  const d = readData();
  const item = req.body;
  if(!d.wishlist.find(i=>i.id===item.id)) d.wishlist.push(item);
  writeData(d);
  res.json(d.wishlist);
});
app.delete('/api/wishlist/:id', (req, res) => {
  const d = readData();
  d.wishlist = d.wishlist.filter(i=>String(i.id) !== String(req.params.id));
  writeData(d);
  res.json(d.wishlist);
});

// Reviews
app.get('/api/reviews', (req, res) => {
  const d = readData();
  res.json(d.reviews);
});
app.post('/api/reviews', (req, res) => {
  const d = readData();
  const r = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
  d.reviews.unshift(r);
  writeData(d);
  res.json(r);
});

// Support tickets
app.get('/api/tickets', (req, res) => {
  const d = readData();
  res.json(d.tickets);
});
app.post('/api/tickets', (req, res) => {
  const d = readData();
  const t = { id: Date.now(), ...req.body, status: 'open', createdAt: new Date().toISOString() };
  d.tickets.unshift(t);
  writeData(d);
  res.json(t);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on port', PORT));
