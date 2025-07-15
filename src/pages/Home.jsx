import React from 'react'
import { Link } from "react-router-dom";


function Home() {
  return (
    <div className="flex flex-col items-start justify-center bg-purple-500 p-6 md:p-12 h-150">
      <h1 className="text-6xl font-bold text-white mb-4">Your Day Starts Here</h1>
      <p className="text-2xl text-white mb-6">Turn chaos into clarity—one task at a time</p>
      <div className="flex space-x-4">
        <Link to="/login" className="bg-white text-purple-500 font-semibold py-2 px-4 rounded hover:bg-gray-200">Login</Link>
        <Link to="/register" className="bg-white text-purple-500 font-semibold py-2 px-4 rounded hover:bg-gray-200">Register</Link>
        
      </div>
    </div>
  )
}

export default Home
