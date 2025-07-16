// import React from 'react'
import { useParams } from "react-router-dom";
import { storeContext } from "../assets/context/storeContext";
import { useContext, useEffect, useState } from "react";
import Spinner from "../assets/layout/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Todo() {
  const { isLoading, setIsLoading, fetchTodo, singleTodo, updateTodoStatus } =
    useContext(storeContext);

  const params = useParams();

  const todoId = params.todoId;

  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (todoId) {
      fetchTodo(todoId);
    }
  }, [todoId]);

  if (isLoading || !singleTodo) {
    return <Spinner />;
  }

  if (!singleTodo || !singleTodo.todo) {
    return <h1>Todo not found</h1>;
    // console.log(singleTodo);
  }
  const { title, description, isComplete, status } = singleTodo.todo;

  const handleStatusChange = async (newStatus) => {
    const confirmation = window.confirm(
      `Are you sure you want to update the status to ${newStatus}?`
    );
    if (!confirmation) return;

    setUpdating(true);

    try {
      await updateTodoStatus(todoId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      TodoId: {todoId}
      {singleTodo === null ? (
        <h1>Todo not found</h1>
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="lg:col-start-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {singleTodo.todo.title}
            </h2>
            <p className="mt-4 italic text-2xl text-gray-500">
              {singleTodo.todo.description}
            </p>
            <p className="mt-6 text-lg">
              Status:{" "}
              <span
                className={` px-3 py-1 rounded-full font-bold ${
                  status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : status === "In-progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {status}
              </span>
            </p>
            <p className="mt-2">
              Completed:{" "}
              <span className={isComplete ? "text-green-600" : "text-red-600"}>
                {isComplete ? "Yes ✅" : "No ❌"}
              </span>
            </p>
            {/* { Buttons to change status } */}
            <div className="mt-6 space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => handleStatusChange("Pending")}
              >
                Mark as Pending
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() => handleStatusChange("In-progress")}
              >
                Mark as In Progress
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => handleStatusChange("Completed")}
              >
                Mark as Completed
              </button>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-start-2 lg:row-start-1">
            <img
              src="https://picsum.photos/250/150"
              alt="Todo cover"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/dashboard");
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 w-50 cursor-pointer"
          >
            Go back to Dashboard
          </button>
        </div>
      )}
    </>
  );
}

export default Todo;
