// import React from 'react'

function Footer() {
  return (
    <footer className="bg-[#111111]  text-[#ffffff] h-20 w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-lg text-white">TaskNest App</h1>
        <p className="text-lg text-gray-400 mt-2">
          Copyright &copy; {new Date().getFullYear()} Todo App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer