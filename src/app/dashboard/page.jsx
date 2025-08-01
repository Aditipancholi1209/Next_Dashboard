"use client";

import { useAuth } from "../context/AuthContext.jsx";
import DashboardLayout from "../components/layout/DashboardLayout.jsx";
import { useEffect, useState } from "react";
import { getStoredTodos, saveTodos } from "../data/mockDatabase";
import Button from "../components/ui/Button.jsx";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import AddTodoDrawer from "../components/todos/AddTodoDrawer.jsx";
import EditTodoDrawer from "../components/todos/EditTodoDrawer.jsx";

function DashboardContent() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      const allTodos = getStoredTodos();
      const userTodos = allTodos.filter((todo) => todo.userId === user.id);

      setTodos(userTodos);
      setStats({
        total: userTodos.length,
        upcoming: userTodos.filter((todo) => todo.status === "pending").length,
        completed: userTodos.filter((todo) => todo.status === "completed")
          .length,
      });
    }
  }, [user]);

  // Filter todos based on search and status
  useEffect(() => {
    let filtered = todos;

    if (searchTerm) {
      filtered = filtered.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }

    setFilteredTodos(filtered);
  }, [todos, searchTerm, statusFilter]);

  const handleAddTodo = (newTodo) => {
    const allTodos = getStoredTodos();
    const todoWithId = {
      ...newTodo,
      id: Date.now(),
      userId: user.id,
      createdAt: new Date().toLocaleString(),
      status: "pending",
    };
    const updatedTodos = [...allTodos, todoWithId];
    saveTodos(updatedTodos);

    // Update local state
    const userTodos = updatedTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
    setStats({
      total: userTodos.length,
      upcoming: userTodos.filter((todo) => todo.status === "pending").length,
      completed: userTodos.filter((todo) => todo.status === "completed").length,
    });
  };

  const handleEditTodo = (editedTodo) => {
    const allTodos = getStoredTodos();
    const updatedTodos = allTodos.map((todo) =>
      todo.id === editedTodo.id ? editedTodo : todo
    );
    saveTodos(updatedTodos);

    // Update local state
    const userTodos = updatedTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
    setStats({
      total: userTodos.length,
      upcoming: userTodos.filter((todo) => todo.status === "pending").length,
      completed: userTodos.filter((todo) => todo.status === "completed").length,
    });
  };

  const handleDeleteTodo = (todoId) => {
    const todo = todos.find((t) => t.id === todoId);
    setTodoToDelete(todo);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      const allTodos = getStoredTodos();
      const updatedTodos = allTodos.filter(
        (todo) => todo.id !== todoToDelete.id
      );
      saveTodos(updatedTodos);

      // Update local state
      const userTodos = updatedTodos.filter((todo) => todo.userId === user.id);
      setTodos(userTodos);
      setStats({
        total: userTodos.length,
        upcoming: userTodos.filter((todo) => todo.status === "pending").length,
        completed: userTodos.filter((todo) => todo.status === "completed")
          .length,
      });
    }
    setDeleteConfirmOpen(false);
    setTodoToDelete(null);
  };

  const cancelDeleteTodo = () => {
    setDeleteConfirmOpen(false);
    setTodoToDelete(null);
  };

  const toggleTodoStatus = (todoId) => {
    const allTodos = getStoredTodos();
    const updatedTodos = allTodos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          status: todo.status === "pending" ? "completed" : "pending",
        };
      }
      return todo;
    });
    saveTodos(updatedTodos);

    // Update local state
    const userTodos = updatedTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
    setStats({
      total: userTodos.length,
      upcoming: userTodos.filter((todo) => todo.status === "pending").length,
      completed: userTodos.filter((todo) => todo.status === "completed").length,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Hello, {user?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Last Login time: {user?.lastLogin}
              </p>
            </div>
            <div className="text-right"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  All Todos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.upcoming}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Todos Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Todos
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last Updated {new Date().toLocaleDateString()}{" "}
                  {new Date().toLocaleTimeString().slice(0, 5)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <Button
                  onClick={() => setIsAddTodoOpen(true)}
                  className="flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Todo
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTodos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          No todos found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm || statusFilter !== "all"
                            ? "Try adjusting your search or filters."
                            : "Get started by creating your first todo."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTodos.map((todo) => (
                    <tr
                      key={todo.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {todo.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {todo.description}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {todo.dueDate}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {todo.dueTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleTodoStatus(todo.id)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 hover:scale-105 ${getStatusColor(
                            todo.status
                          )}`}
                          title={`Mark as ${
                            todo.status === "pending" ? "completed" : "pending"
                          }`}
                        >
                          {todo.status === "completed"
                            ? "Completed"
                            : "Pending"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingTodo(todo)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors duration-200"
                            title="Edit todo"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
                            title="Delete todo"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Todo Drawer */}
      <AddTodoDrawer
        isOpen={isAddTodoOpen}
        onClose={() => setIsAddTodoOpen(false)}
        onAddTodo={handleAddTodo}
      />

      {/* Edit Todo Drawer */}
      {editingTodo && (
        <EditTodoDrawer
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          onEditTodo={handleEditTodo}
          todo={editingTodo}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={cancelDeleteTodo}
        onConfirm={confirmDeleteTodo}
        title="Delete Todo"
        message={`Are you sure you want to delete "${todoToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </DashboardLayout>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
