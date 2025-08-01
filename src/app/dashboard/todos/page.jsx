"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { getStoredTodos, saveTodos } from "../../data/mockDatabase";
import Button from "../../components/ui/Button.jsx";
import ConfirmDialog from "../../components/ui/ConfirmDialog.jsx";
import AddTodoDrawer from "../../components/todos/AddTodoDrawer.jsx";
import EditTodoDrawer from "../../components/todos/EditTodoDrawer.jsx";

export default function TodosPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const allTodos = getStoredTodos();
      const userTodos = allTodos.filter((todo) => todo.userId === user.id);
      setTodos(userTodos);
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Filter todos based on search term and status
    let filtered = todos.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((todo) => todo.status === statusFilter);
    }

    setFilteredTodos(filtered);
  }, [searchTerm, todos, statusFilter]);

  const handleAddTodo = (newTodoData) => {
    const allTodos = getStoredTodos();
    const newTodo = {
      id: allTodos.length + 1,
      ...newTodoData,
      userId: user.id,
      status: "pending",
      createdAt: new Date().toLocaleString(),
    };

    const updatedAllTodos = [...allTodos, newTodo];
    saveTodos(updatedAllTodos);

    const userTodos = updatedAllTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
  };

  const handleEditTodo = (updatedTodo) => {
    const allTodos = getStoredTodos();
    const updatedAllTodos = allTodos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    saveTodos(updatedAllTodos);

    const userTodos = updatedAllTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
    setEditingTodo(null);
  };

  const handleDeleteTodo = (todoId) => {
    const todo = todos.find((t) => t.id === todoId);
    setTodoToDelete(todo);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteTodo = () => {
    if (todoToDelete) {
      const allTodos = getStoredTodos();
      const updatedAllTodos = allTodos.filter(
        (todo) => todo.id !== todoToDelete.id
      );
      saveTodos(updatedAllTodos);

      const userTodos = updatedAllTodos.filter(
        (todo) => todo.userId === user.id
      );
      setTodos(userTodos);
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
    const updatedAllTodos = allTodos.map((todo) => {
      if (todo.id === todoId) {
        return {
          ...todo,
          status: todo.status === "completed" ? "pending" : "completed",
        };
      }
      return todo;
    });
    saveTodos(updatedAllTodos);

    const userTodos = updatedAllTodos.filter((todo) => todo.userId === user.id);
    setTodos(userTodos);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {status === "pending" ? "Pending" : "Completed"}
      </span>
    );
  };

  const formatDate = (dateStr, timeStr) => {
    const [day, month, year] = dateStr.split("/");
    const date = new Date(year, month - 1, day);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${formattedDate} ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={setSearchTerm}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Todos
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Last Updated: {new Date().toLocaleDateString()}{" "}
                {new Date().toLocaleTimeString().slice(0, 5)}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <Button
                onClick={() => setIsAddTodoOpen(true)}
                variant="primary"
                className="bg-green-500 hover:bg-green-600"
              >
                + Add Todo
              </Button>
            </div>
          </div>
        </div>

        {/* Todos Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTodos.map((todo) => (
                  <tr
                    key={todo.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {todo.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {todo.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(todo.dueDate, todo.dueTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(todo.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTodoStatus(todo.id)}
                          className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                          title={
                            todo.status === "completed"
                              ? "Mark as pending"
                              : "Mark as completed"
                          }
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingTodo(todo)}
                          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
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
                ))}
                {filteredTodos.length === 0 && (
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
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
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
