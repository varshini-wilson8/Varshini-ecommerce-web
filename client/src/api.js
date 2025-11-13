const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export async function fetchProducts(){
  const res = await fetch(API_BASE + '/products');
  return res.json();
}
export async function register(user){ const res = await fetch(API_BASE + '/register',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(user)}); return res.json(); }
export async function login(data){ const res = await fetch(API_BASE + '/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}); return res.json(); }
export async function getOrders(){ const res = await fetch(API_BASE + '/orders'); return res.json(); }
export async function createOrder(order){ const res = await fetch(API_BASE + '/orders',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(order)}); return res.json(); }
export async function getWishlist(){ const res = await fetch(API_BASE + '/wishlist'); return res.json(); }
export async function addWishlist(item){ const res = await fetch(API_BASE + '/wishlist',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(item)}); return res.json(); }
export async function removeWishlist(id){ const res = await fetch(API_BASE + '/wishlist/' + id,{method:'DELETE'}); return res.json(); }
export async function getReviews(){ const res = await fetch(API_BASE + '/reviews'); return res.json(); }
export async function postReview(r){ const res = await fetch(API_BASE + '/reviews',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(r)}); return res.json(); }
export async function getTickets(){ const res = await fetch(API_BASE + '/tickets'); return res.json(); }
export async function postTicket(t){ const res = await fetch(API_BASE + '/tickets',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(t)}); return res.json(); }
