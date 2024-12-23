import { Routes, Route, Outlet } from "react-router-dom";
import {
  CategoriesPage,
  BlogDetails,
  WriterPage,
  LoginPage,
  SignUpPage,
  Home,
} from "./pages";
import { Navbar, Loading } from "./components";
import { useState } from "react";
import useStore from "./store";

function Layout() {
  return (
    <div className="w-full flex flex-col min-h-screen px-4 md:px-10 2xl:px-29=8">
      <Navbar />

      <div>
        <Outlet />
      </div>

      {/* <Footer /> */}
    </div>
  );
}

function App() {
  const { theme, isLoading } = useStore();

  return (
    <main className={theme}>
      <div className="w-full min-h-screen relative bg-white dark:bg-[#020b19]">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/*" element={<Home />} />
            <Route path="/category" element={<CategoriesPage />} />
            <Route path="/:slug/:id?" element={<BlogDetails />} />
            <Route path="/writer/:id" element={<WriterPage />} />
          </Route>

          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/sign-in" element={<LoginPage />} />
        </Routes>

        {isLoading && <Loading />}
      </div>
    </main>
  );
}

export default App;
