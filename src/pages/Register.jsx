import { NavLink } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { storeContext } from "../assets/context/storeContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../assets/layout/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//import toast to component
// import { toast } from "react-toastify";
function Register() {
  const {
    password,
    setPassword,
    email,
    setEmail,
    apiUrl,
    isLoading,
    setIsLoading,
    showPassword,
    setShowPassword,
    name,
    setName,
  } = useContext(storeContext);

  
  useEffect(() => {
    setIsLoading(false);
    
  }, []);

  const navigate = useNavigate();

  function clearForm() {
    setEmail("");
    setPassword("");
  }
  // const [showPassword, setShowPassword] = useState(false);

  async function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);

    // validate form
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (email.length < 6) {
      toast.error("Email must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // console.log(password)
    try {
      const response = await fetch(`${apiUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
        }),
      });
      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        // toast.error(data.message[0].message);
        toast.error(data.message);
        setIsLoading(false);
      }

      if (response.ok) {
        toast.success(data.message);
        clearForm();
        setIsLoading(false);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function togglePassword() {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  if (isLoading) {
    return <Spinner />;
  }

  // console.log(apiUrl)
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[#f3f0f9] text-[#2d2d2d]">
        <div className=" p-12 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">Register on our TaskNext App today</h1>
          <p className="mt-4 mb-8 text-gray-600">
          Let’s get productive.
          </p>
          <h4 className="text-2xl font-bold">
          Create an Account
          </h4>
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

              {/* <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gold-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span> */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                    placeholder="Enter Username"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />

                  {/* <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gold-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </span> */}
                </div>
              </div>

              {/* <i className="fas fa-at absolute right-3 top-3 text-gray-400"></i> */}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
              <i
                className="fas fa-eye absolute right-3 top-3 text-gray-400"
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
              Sign Up
            </button>
            <p className="mt-4 text-center">
              Have an account? <NavLink to="/login">Login</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;