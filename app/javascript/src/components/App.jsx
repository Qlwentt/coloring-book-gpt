import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Books from "./pages/Books";
import Book from "./pages/Book";
import NavBar from "./nav/NavBar";

export default function App() {
  const user = window.USER;
  return (
    <>
      {user && <NavBar />}
      <Routes>
        <Route path="/" element={user ? <Home /> : <SignIn />} />
        <Route path="/books" element={user ? <Books /> : <SignIn />} />
        <Route path="/books/:id" element={user ? <Book /> : <SignIn />} />
      </Routes>
    </>
  );
}
