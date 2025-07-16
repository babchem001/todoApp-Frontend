import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { storeContext } from "../assets/context/storeContext";
import { toast } from "react-toastify";
import Spinner from "../assets/layout/Spinner";

function Dashboard() {
  const { token, apiUrl, todos, getAllTodos, isLoading, setIsLoading } =
    useContext(storeContext);

  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todoId, setTodoId] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllTodos();
  }, []);

  function clearForm() {
    setTitle("");
    setDescription("");
    setTodoId("");
    setEditMode(false);
  }

  async function createTodo() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/todo/createtodo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();
      if (response.status === 201) {
        toast.success(data.message);
        clearForm();
        getAllTodos();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function updateHandler() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/todo/updatetodo/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          title: title, 
          description: description,
          todoId: Number(todoId),
         }),
      });

      const data = await response.json();
      if (response.status === 203) {
        toast.success(data.message);
        getAllTodos();
        clearForm();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function deleteTodo(todoId) {
    try {
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this Task?"
      );
      if (!userConfirmed) {
        toast.error("Deletion cancelled");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${apiUrl}/todo/deletetodo/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.message);
        getAllTodos();
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function updateStatus(todoId, newStatus) {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/todo/updatetodostatus/${todoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`Status updated to ${newStatus}`);
        getAllTodos();
      } else {
        toast.error("Failed to update task status");
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error occurred");
      setIsLoading(false);
    }
  }



  function submitHandler(e) {
    e.preventDefault();
    editMode ? updateHandler() : createTodo();
  }

  const filteredTodos =
    filter === "all" ? todos : todos.filter((todo) => todo.status === filter);

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto mt-20 bg-[#f3f0f9] t-[#2d2d2d]">
      <h1 className="text-3xl font-bold mt-20">Dashboard</h1>

      <form
        className="bg-white shadow-md mt-14 rounded px-8 pt-6 pb-8 mb-4 mx-auto w-1/2"
        onSubmit={submitHandler}
      >
        <h2 className="text-2xl font-bold mb-4">
          {editMode ? "Edit Task" : "Add Task"}
        </h2>

        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`font-bold py-2 px-4 rounded focus:outline-none ${
            editMode
              ? "bg-yellow-400 hover:bg-yellow-500 text-black"
              : "bg-blue-500 hover:bg-blue-700 text-white"
          }`}
        >
          {editMode ? "Update Task" : "Add Task"}
        </button>
      </form>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-2">
        {["all", "Pending", "In-progress", "Completed"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded text-white ${
              type === "all"
                ? "bg-blue-600"
                : type === "Pending"
                ? "bg-gray-600"
                : type === "In-progress"
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4">Task List</h2>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="py-3 px-6">Title</th>
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  No tasks found for this filter.
                </td>
              </tr>
            ) : (
              filteredTodos.map((todo) => (
                <tr key={todo.id} 
                className="bg-white border-b"
                >
                  <td className="py-4 px-6">{todo.title}</td>
                  <td className="py-4 px-6">{todo.description}</td>
                  <td className="py-4 px-6 capitalize font-semibold">
                    <span
                      className={
                        todo.status === "Completed"
                          ? "text-green-600"
                          : todo.status === "In-progress"
                          ? "text-yellow-500"
                          : "text-gray-500"
                      }
                    >
                      {todo.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <Link
                      to={`/todo/${todo?.id}`}
                      className="block text-white bg-blue-700 hover:bg-blue-800 font-medium rounded px-3 py-1 text-center mb-1"
                    >
                      View more
                    </Link>
                    <button
                      onClick={() => {
                        setEditMode(true);
                        setTitle(todo.title);
                        setDescription(todo.description);
                        setTodoId(todo.id);
                      }}
                      className="block w-full text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded px-3 py-1 text-center mb-1"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="block w-full text-white bg-red-700 hover:bg-red-800 font-medium rounded px-3 py-1 text-center mb-1"
                    >
                      Delete
                    </button>

                    {/* Status Buttons */}
                    <div className="flex gap-1 flex-wrap">
                      {["Pending", "In-progress", "Completed"].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(todo.id, status)}
                          className={`text-xs px-2 py-1 rounded ${
                            status === "Pending"
                              ? "bg-gray-300 text-gray-800"
                              : status === "In-progress"
                              ? "bg-yellow-400 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;
