import { createContext, useState, useEffect } from "react";

export const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // you used name in Register.jsx but didn't declare it
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [todos, setTodos] = useState([]);
  const [singleTodo, setSingleTodo] = useState(null);
  // const [fetchTodos, setFetchTodos] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("todoApp_token"));


  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  
  function isTokenExpired(token) {
    if (!token) return;
    try {
      const [, payload] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    const localToken = localStorage.getItem("todoApp_token");
    if (!localToken || isTokenExpired(localToken)) {
      setIsAuth(false);
      localStorage.removeItem("todoApp_token"); //remove token from localstorage
      setToken(null);
      
    } else {
      setToken(localToken);
      setIsAuth(true);
      getAllTodos();
    }
  }, []);

  async function getAllTodos() {
    try {
      const response = await fetch(`${apiUrl}/todo/getalltodos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setTodos(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchTodo(id) {
    try {
      const response = await fetch(`${apiUrl}/todo/singletodo/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        setSingleTodo(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // New function to update todo status
  async function updateTodoStatus(id, newStatus) {
    try {
      const response = await fetch(`${apiUrl}/todo/updatetodostatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok && data.todo) {
        setSingleTodo({todo: data.todo});
        return data.todo;
      } else {
        throw new Error(data.message || "Failed to update todo status");
      }
    
    } 
    catch (error) {
      console.error("Error updating todo status:", error);
      throw error;
    }
  }



  const contextObj = {
    isAuth,
    setIsAuth,
    isLoading,
    setIsLoading,
    apiUrl,
    token,
    setToken,
    password,
    setPassword,
    email,
    setEmail,
    name,
    setName,
    todos,
    singleTodo,
    fetchTodo,
    getAllTodos,
    updateTodoStatus,
  };

  return (
    <storeContext.Provider value={contextObj}>{children}</storeContext.Provider>
  );
};
