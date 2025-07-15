// import { NavLink } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { storeContext } from "../assets/context/storeContext";
import Spinner from "../assets/layout/Spinner";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const {
    password,
    setPassword,
    email,
    setEmail,
    apiUrl,
    isLoading,
    setIsLoading,
    setIsAuth,
    // isAuth,
    setToken,
  } = useContext(storeContext);
  const [showPassword, setShowPassword] = useState(false);
  // console.log(apiUrl);

  const navigate = useNavigate();

  

  async function loginUser() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/auth/login`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.status === 200) {
        toast.success("Login Successful");
        //clear inputs
        setEmail("");
        setPassword("");

        //set isAuth to true
        setIsAuth(true);

        //set token in local storage
        localStorage.setItem("todoApp_token", data.access_token);

        //set token in context
        setToken(data.access_token);
        setIsAuth(true);

        //set token in context
        setIsLoading(false);

        //navigate to dashboard
        navigate("/dashboard");
      } else {
        console.log(data);
        toast.error("Login failed. Try Again");
      }

      setIsLoading(false);
    } catch (error) {
      toast.error("Network Error. Try again");
      console.log(error);
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   if (isAuth) {
  //     navigate("/dashboard");
  //   }
  // }, [isAuth]);

  async function submitHandler(e) {
    e.preventDefault();
    loginUser();
  }

  function togglePassword() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
      // setIsLoading(true);
    }
  }
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#ffffff] text-[#2d2d2d]">
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="mt-4 mb-8 text-gray-600">
        Log in to stay on top of your tasks.
        </p>
        {/* <h4 className="text-2xl font-bold">Sign in an account with us today</h4> */}
        <form onSubmit={submitHandler} className="mt-8 space-y-6">
          <div className="relative">
            <input
              type="email"
              className="block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <i className="fas fa-at absolute right-3 top-3 text-gray-400"></i>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <span
              className="absolute inset-y-0 end-0 grid place-content-center px-4"
              onClick={togglePassword}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-black text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Log In
          </button>
          <p className="mt-4 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
