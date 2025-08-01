"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import SocialButton from "../components/ui/SocialButton.jsx";
import { getStoredUsers, saveUsers } from "../data/mockDatabase";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError("Please agree to Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call - User will be created with "user" role by default
    setTimeout(() => {
      const users = getStoredUsers();
      const existingUser = users.find((u) => u.email === formData.email);

      if (existingUser) {
        setError("User with this email already exists");
        setIsLoading(false);
        return;
      }

      const newUser = {
        id: users.length + 1,
        name: formData.fullName,
        email: formData.email,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
        role: "user", // Default role assignment
        lastLogin: new Date().toLocaleString(),
        isActive: true,
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      login(newUser);
      router.push("/dashboard");
    }, 1000);
  };

  const handleGoogleSignUp = () => {
    // Simulate Google sign up with a new user
    const users = getStoredUsers();
    const newUser = {
      id: users.length + 1,
      name: "Google User",
      email: "google.user@gmail.com",
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
      role: "user",
      lastLogin: new Date().toLocaleString(),
      isActive: true,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    login(newUser);
    router.push("/dashboard");
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              GREEDYGAME
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              ®
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You&apos;re one click away
            <br />
            from less busywork
          </h1>
        </div>

        {/* Google Sign Up */}
        <SocialButton provider="google" onClick={handleGoogleSignUp} />

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address *"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Terms and Privacy */}
          <div className="flex items-start">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
              required
            />
            <label className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              I Agree to{" "}
              <Link
                href="/terms"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || !agreeToTerms}
          >
            {isLoading ? "Creating account..." : "Get Started"}
          </Button>
        </form>

        {/* Sign in link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Note about default role */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By registering, you&apos;ll be assigned a standard user role by
            default
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function RegisterPage() {
  return <RegisterContent />;
}
