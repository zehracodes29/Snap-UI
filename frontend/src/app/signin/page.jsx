'use client';
import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      toast.success("Signed in successfully!");
      resetForm();
      // Redirect to dashboard after login
      router.push("/dashboard");
    }
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#111] border border-[#222] rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.08)] p-6 sm:p-8">
        <toaster position="top-right" />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#00ff88]">Sign In</h1>
          <p className="mt-2 text-sm text-gray-400">
            Don't have an account?{" "}
            <a className="text-yellow-400 hover:underline font-medium" href="/signup">
              Sign up here
            </a>
          </p>
        </div>

        {/* Google Sign-in */}
        <div className="mb-5">
          <button
            type="button"
            className="w-full flex justify-center items-center gap-2 py-3 px-4 text-sm font-medium rounded-lg border border-[#222] bg-[#0f0f0f] text-[#bfffc4] shadow hover:shadow-[0_0_12px_rgba(0,255,136,0.08)] transition"
          >
            {/* Google Icon SVG can go here */}
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="py-3 flex items-center text-xs text-gray-500 uppercase before:flex-1 before:border-t before:border-[#222] before:mr-3 after:flex-1 after:border-t after:border-[#222] after:ml-3">
            Or
          </div>
        </div>

        {/* Sign-In Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 border-[#222] rounded text-[#00ff88] focus:ring-[#00ff88]" />
              Remember me
            </label>
            <a href="#" className="text-yellow-400 hover:underline font-medium">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 text-sm font-semibold rounded-lg bg-[#00ff88] text-black hover:bg-green-400 transition shadow-[0_4px_20px_rgba(0,255,136,0.1)]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
