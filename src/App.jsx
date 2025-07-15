import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import Navbar from "./assets/layout/Navbar";
import Footer from "./assets/layout/Footer";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Todo from "./pages/Todo";
import Account from "./pages/Account";
import { storeContext } from "./assets/context/storeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";

function App() {
  const { isAuth } = useContext(storeContext);
  return (
    <BrowserRouter>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={isAuth ? <Dashboard /> : <Register />}
        />
        <Route path="/login" element={isAuth ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login />} />
        <Route path="/logout" element={isAuth ? <Logout /> : <Login />} />
        <Route path="/todo/:todoId" element={isAuth ? <Todo /> : <Login />} />
        <Route path="/account" element={isAuth ? <Account /> : <Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
