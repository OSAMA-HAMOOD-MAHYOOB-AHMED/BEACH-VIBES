import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { ProductsProvider } from './context/ProductsContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import Collections from './pages/Collections'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Journal from './pages/Journal'
import Contact from './pages/Contact'

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </CartProvider>
    </ProductsProvider>
  )
}
