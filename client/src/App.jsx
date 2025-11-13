import React, { useEffect, useState } from 'react'
import * as api from './api'

export default function App(){
  const [route, setRoute] = useState('home')
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [reviews, setReviews] = useState([])
  const [tickets, setTickets] = useState([])

  useEffect(()=>{ api.fetchProducts().then(setProducts); api.getWishlist().then(setWishlist); api.getReviews().then(setReviews); api.getOrders().then(setOrders); api.getTickets().then(setTickets); },[])

  async function handleRegister(data){ const res = await api.register(data); if(res.user) { setUser(res.user); setRoute('account'); } else alert(res.error || 'Register failed') }
  async function handleLogin(data){ const res = await api.login(data); if(res.user){ setUser(res.user); setRoute('account'); } else alert(res.error || 'Login failed') }
  async function handleBuy(p){ const ord = await api.createOrder({ ...p, user: user ? user.email : 'guest' }); setOrders([ord, ...orders]); alert('Order placed') }
  async function addToWishlist(p){ await api.addWishlist(p); api.getWishlist().then(setWishlist); alert('Added to wishlist') }
  async function removeFromWishlist(id){ await api.removeWishlist(id); api.getWishlist().then(setWishlist); }

  return (<div className='app'>

    <header className='header'>
      <div className='brand' onClick={()=>setRoute('home')}>Varsha Myshop</div>
      <nav className='nav'>
        <button onClick={()=>setRoute('home')}>Home</button>
        <button onClick={()=>setRoute('products')}>Products</button>
        <button onClick={()=>setRoute('contact')}>Contact Us</button>
        <button onClick={()=>setRoute('about')}>About Us</button>
      </nav>
      <div className='actions'>
        <button onClick={()=>setRoute('account')}>Account</button>
        {user ? <span>Hi, {user.name}</span> : <><button onClick={()=>setRoute('login')}>Login</button><button onClick={()=>setRoute('register')}>Register</button></>}
      </div>
    </header>

    <main className='container'>
      {route==='home' && <Home products={products} onView={() => setRoute('products')} />}
      {route==='products' && <Products products={products} onBuy={handleBuy} onAddToWishlist={addToWishlist} />}
      {route==='contact' && <Contact />}
      {route==='about' && <About />}
      {route==='login' && <Auth mode='login' onSubmit={handleLogin} />}
      {route==='register' && <Auth mode='register' onSubmit={handleRegister} />}
      {route==='account' && <Account user={user} orders={orders} wishlist={wishlist} reviews={reviews} tickets={tickets} onRemoveWishlist={removeFromWishlist} onAddReview={async (r)=>{ await api.postReview(r); api.getReviews().then(setReviews); }} onCreateTicket={async (t)=>{ await api.postTicket(t); api.getTickets().then(setTickets); }} />}
    </main>

  </div>)
}

function Home({ products, onView }){
  return (<section><h2>Welcome to MyShop</h2><button onClick={onView}>Shop Now</button><div className='grid'>{products.slice(0,4).map(p=>(<div key={p.id} className='card'><div>{p.name}</div><div>₹{p.price}</div></div>))}</div></section>)
}

function Products({ products, onBuy, onAddToWishlist }){
  return (<section><h2>Products</h2><div className='grid'>{products.map(p=>(<div className='card' key={p.id}><div>{p.name}</div><div>₹{p.price}</div><div className='actions'><button onClick={()=>onAddToWishlist(p)}>Wishlist</button><button onClick={()=>onBuy(p)}>Buy</button></div></div>))}</div></section>)
}

function Contact(){ return <section><h2>Contact Us</h2><p>Email: support@myshop.example</p></section> }
function About(){ return <section><h2>About</h2><p>Demo E-Commerce portal.</p></section> }

function Auth({ mode, onSubmit }){
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  function change(e){ setForm({...form, [e.target.name]: e.target.value}) }
  function submit(e){ e && e.preventDefault(); if(mode==='register' && (!form.name||!form.email)) return alert('name and email required'); if(!form.email) return alert('email required'); onSubmit({ name: form.name || form.email.split('@')[0], email: form.email }) }
  return (<form className='card auth' onSubmit={submit}><h3>{mode==='register'?'Register':'Login'}</h3>{mode==='register' && <input name='name' value={form.name} onChange={change} placeholder='Full name'/>}<input name='email' value={form.email} onChange={change} placeholder='Email' /><input name='password' type='password' value={form.password} onChange={change} placeholder='Password' /><button type='submit'>{mode==='register'?'Register':'Login'}</button></form>)
}

function Account({ user, orders, wishlist, reviews, tickets, onRemoveWishlist, onAddReview, onCreateTicket }){
  const [tab, setTab] = useState('orders')
  return (<div><h2>Account</h2><div>Signed in as {user?user.email:'Guest'}</div><div className='tabs'><button onClick={()=>setTab('orders')}>Orders</button><button onClick={()=>setTab('wishlist')}>Wishlist</button><button onClick={()=>setTab('reviews')}>Reviews</button><button onClick={()=>setTab('support')}>Customer Care</button></div><div className='panel'>{tab==='orders' && <div>{orders.length?orders.map(o=>(<div key={o.orderId} className='card'>{o.name} - ₹{o.price}</div>)):'No orders'}</div>}{tab==='wishlist' && <div>{wishlist.length?wishlist.map(w=>(<div key={w.id} className='card'>{w.name}<button onClick={()=>onRemoveWishlist(w.id)}>Remove</button></div>)):'Empty'}</div>}{tab==='reviews' && <Reviews reviews={reviews} onAdd={onAddReview} />}{tab==='support' && <Support tickets={tickets} onCreate={onCreateTicket} />}</div></div>)
}

function Reviews({ reviews, onAdd }){
  const [text, setText] = useState(''); const [rating, setRating] = useState(5)
  function submit(){ if(!text) return alert('write a review'); onAdd({ text, rating }); setText('') }
  return (<div><div><textarea value={text} onChange={e=>setText(e.target.value)} /></div><div><select value={rating} onChange={e=>setRating(Number(e.target.value))}>{[5,4,3,2,1].map(r=><option key={r} value={r}>{r}</option>)}</select><button onClick={submit}>Submit</button></div><div>{reviews.length?reviews.map(r=>(<div key={r.id} className='card'>{r.rating}⭐ - {r.text}</div>)):'No reviews'}</div></div>)
}

function Support({ tickets, onCreate }){ const [msg, setMsg]=useState('') ; function create(){ if(!msg) return alert('describe issue'); onCreate({ message: msg }); setMsg('') } return (<div><div><textarea value={msg} onChange={e=>setMsg(e.target.value)} /></div><button onClick={create}>Create Ticket</button><div>{tickets.length?tickets.map(t=>(<div key={t.id} className='card'>#{t.id} - {t.message}</div>)):'No tickets'}</div></div>) }
