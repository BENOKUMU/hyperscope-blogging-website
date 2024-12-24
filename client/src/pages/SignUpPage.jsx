import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Toaster, toast } from "sonner";
import { Link } from "react-router-dom";
import { Logo, Button, Divider, Inputbox } from "../components";
import { BiImage } from "react-icons/bi";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const API_URI = import.meta.env.VITE_API_URI;

const SignUpPage = () => {
  const user = {};

  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState("");
  const [fileURL, setFileURL] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await fetch(`${API_URI}/auth/google-signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.access_token }),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Google signup successful");
          window.location.replace("/");
        } else {
          toast.error(result.message || "Google signup failed");
        }
      } catch (error) {
        toast.error("An error occurred during Google signup");
      }
    },
    onError: () => {
      toast.error("Google signup failed");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const res = await fetch(`${API_URI}/auth/register`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Signup successful");
        window.location.replace("/sign-in");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      toast.error("An error occurred during signup");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  if (user.token) window.location.replace("/");
  toast.success("login")

  return (
    <div className="flex w-full h-[100vh]">
      <div className="hidden md:flex flex-col gap-y-4 w-1/3 h-full bg-black items-center justify-center">
        {fileURL && (
          <img
            src={fileURL || file}
            alt=""
            className="w-16 h-16 rounded-full"
          />
        )}
        <Logo type="signin" />
        <span className="text-xl font-semibold text-white">Welcome👍</span>
      </div>
      <div className="flex w-full md:w-2/3 h-full bg-white dark:bg-gradient-to-b md:dark:bg-gradient-to-r from-black via-[#071b3e] to-black items-center px-4 md:px-20 lg:px-40">
        <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4 sm:px-0 lg:px-8">
          <div className="block mb-10 md:hidden -ml-8">
            <Logo />
          </div>
          <div className="w-full space-y-6 flex flex-col justify-start">
            <div className="max-w-md w-full flex gap-3 md:gap-4 items-center justify-center mb-12">
              {showForm && (
                <IoArrowBackCircleSharp
                  className="text-2xl lg:text-3xl cursor-pointer text-gray-800 dark:text-gray-400"
                  onClick={() => setShowForm(false)}
                />
              )}
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">
                Sign up for an account
              </h2>
            </div>
            {showForm ? (
              <form
                className="max-w-md w-full mt-8 space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col rounded-md shadow-sm space-y-px gap-6 mb-8">
                  <div className="w-full flex gap-4">
                    <Inputbox
                      label="First Name"
                      name="firstName"
                      type="text"
                      isRequired={true}
                      placeholder="First Name"
                      value={data.firstName}
                      onChange={handleChange}
                    />
                    <Inputbox
                      label="Last Name"
                      name="lastName"
                      type="text"
                      isRequired={true}
                      placeholder="Last Name"
                      value={data.lastName}
                      onChange={handleChange}
                    />
                  </div>
                  <Inputbox
                    type="email"
                    label="Email Address"
                    name="email"
                    value={data?.email}
                    isRequired={true}
                    placeholder="you@example.com"
                    onChange={handleChange}
                  />
                  <Inputbox
                    label="Password"
                    name="password"
                    type="password"
                    isRequired={true}
                    placeholder="Password"
                    value={data?.password}
                    onChange={handleChange}
                  />
                  <div className="flex items-center">
                    <label
                      htmlFor="imgUpload"
                      className="flex items-center gap-1 text-base text-black dark:text-gray-500 cursor-pointer"
                    >
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        data-max-size="1024"
                        accept=".jpg, .png, .jpeg"
                      />
                      <BiImage />
                    </label>
                  </div>
                </div>

                <Button
                  label="Create Account"
                  type="submit"
                  styles="group relative w-full flex justify-center py-2.5 2xl:py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black dark:bg-rose-800 hover:bg-rose-700 focus:outline-none"
                />
              </form>
            ) : (
              <div className="max-w-md w-full space-y-8">
                <Button
                  onClick={() => googleLogin()}
                  label="Sign Up with Google"
                  icon={<FcGoogle className="text-xl" />}
                  styles="w-full flex flex-row-reverse gap-4 bg-black dark:bg-transparent dark:border text-white px-5 py-2.5 rounded-full"
                />
                <Divider label="OR" />

                <Button
                  onClick={() => setShowForm(true)}
                  label="Continue with email"
                  styles="w-full gap-4 bg-white text-black dark:bg-rose-800 dark:text-white px-5 py-2.5 rounded-full border dark:border-none border-gray-300"
                />
              </div>
            )}
            <p className="max-w-md w-full text-center text-gray-600 dark:text-gray-300">
              Dont't have an account?{" "}
              <Link to="/sign-in" className="text-rose-800 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default SignUpPage;
