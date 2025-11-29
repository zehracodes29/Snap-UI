'use client';
import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      toast.success("Account created successfully!");
      resetForm();
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-[#111] border border-[#222] rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.08)] p-6 sm:p-8">
        <toaster position="top-right" />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#00ff88]">Sign Up</h1>
          <p className="mt-2 text-sm text-gray-400">
            Already have an account?{" "}
            <a className="text-yellow-400 hover:underline font-medium" href="/signin">
              Sign in here
            </a>
          </p>
        </div>

        {/* Google Sign-up */}
        <div className="mb-5">
          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-medium rounded-lg border border-[#222] bg-[#0f0f0f] text-[#bfffc4] shadow hover:shadow-[0_0_12px_rgba(0,255,136,0.08)] transition"
          >
            {/* Google Icon SVG can go here */}
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="py-3 flex items-center text-xs text-gray-500 uppercase before:flex-1 before:border-t before:border-[#222] before:mr-3 after:flex-1 after:border-t after:border-[#222] after:ml-3">
            Or
          </div>
        </div>

        {/* Sign-Up Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-1 text-gray-400">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#222] text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#222] text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#222] text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm mb-1 text-gray-400">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#222] text-[#bfffc4] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00ff88]"
              required
            />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 border-[#222] rounded text-[#00ff88] focus:ring-[#00ff88]"
            />
            <label htmlFor="terms" className="text-sm text-gray-400">
              I accept the{" "}
              <a href="#" className="text-yellow-400 hover:underline font-medium">
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-[#00ff88] text-black hover:bg-green-400 transition shadow-[0_4px_20px_rgba(0,255,136,0.1)]"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
