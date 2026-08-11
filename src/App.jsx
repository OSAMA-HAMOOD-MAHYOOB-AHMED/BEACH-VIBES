import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import { RequireAuth, RequireAdmin } from './components/RouteGuards'
import { LanguageProvider } from './context/LanguageContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'
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
import Brands from './pages/Brands'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import AdminLayout from './pages/admin/AdminLayout'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminMessages from './pages/admin/AdminMessages'
import AdminUsers from './pages/admin/AdminUsers'

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/journal" element={<Journal />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route element={<RequireAuth />}>
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/account" element={<Account />} />
                  </Route>

                  <Route element={<RequireAdmin />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminOrders />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="users" element={<AdminUsers />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}
