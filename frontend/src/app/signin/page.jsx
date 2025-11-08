'use client';
import React from "react";
import { useFormik } from "formik";
import toast from "react-hot-toast";

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      toast.success("Data submitted successfully!");

      // send values to backend here...
      resetForm();
    }

  });

  return (
    <div className="max-w-lg mx-auto min-h-screen mt-7 bg-white border border-gray-200 rounded-xl shadow-md">
      <toaster position="top-right" />
      <div className="p-4 sm:p-7">
        {/* Header */}
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-gray-800">Sign up</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <a className="text-blue-600 hover:underline font-medium" href="#">
              Sign in here
            </a>
          </p>
        </div>

        {/* Google Button */}
        <div className="mt-5">
          <button
            type="button"
            className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow hover:bg-gray-50"
          >
            {/* SVG omitted for brevity */}
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:mr-6 after:flex-1 after:border-t after:border-gray-200 after:ml-6">
            Or
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm">
                  I accept the{" "}
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
