import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';

import Home from './components/HomePage';
import OrderCheckout from './components/order-management/orderCheckout/orderCheckout';
import SelectOrder from './components/order-management/selectOrder/selectOrder';
import Cart from './components/order-management/Cart/Cart';
import Register from './components/order-management/Register/Register';
import Login from './components/order-management/Login/Login';
import Status from './components/order-management/Status/Status';
import Menu from './components/order-management/Menu/Menu';

import DeliveryLogin from './components/delivery-management/delivery-login/DeliveryLogin';
import DeliveryRegister from './components/delivery-management/delivery-login/DeliveryRegister';
import DeliveryDashboard from './components/delivery-management/delivery-dashboard/DeliveryDashboard';

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MenuPage from "./pages/MenuPage";
import Restaurants from "./pages/Restaurants.jsx";
import AddRestaurant from "./pages/AddRestaurant.jsx";
import EditRestaurant from './pages/EditRestaurant.jsx';
import AddMenuPage from "./pages/AddMenuPage.jsx";
import EditMenuItem from './pages/EditMenuItem.jsx';
import Restaurants_user from './pages/Restaurants_user.jsx'
import MenuPage_user from './pages/MenuPage_user.jsx'

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Order Service Routes */}
        <Route path="/order" element={<OrderCheckout />} />
        <Route path="/order-menu" element={<Menu />} />
        <Route path="/select-order" element={<SelectOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-register" element={<Register />} />
        <Route path="/order-login" element={<Login />} />
        <Route path="/status" element={<Status />} />

        {/* Delivery Service Routes */}
        <Route path="/delivery" element={<DeliveryLogin />} />
        <Route path="/delivery-register" element={<DeliveryRegister />} />
        <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />

        {/* Restaurant  Service Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu/:id" element={<MenuPage />} />
        <Route path="/menu_user/:id" element={<MenuPage_user />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants_user" element={<Restaurants_user />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/edit-restaurant/:id" element={<EditRestaurant />} />
        <Route path="/restaurants/:restaurantId/add-menu" element={<AddMenuPage />} />
        <Route path="/menu/:restaurantId/edit/:menuId" element={<EditMenuItem />} />

      </Routes>
    </Router>
  );
}

export default App;
