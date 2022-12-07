import React from "react";
import { Route, Routes } from "react-router-dom";
import Upload from "../pages/Upload";
import List from "../pages/List";
import Login from "../pages/Login"
import { Input } from "../pages/Input";

const IRoutes = () => {

  return (
    <Routes >
      <Route path="/" element={<Login />} />
      <Route path="/list" element={<List />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/input" element={<Input />} />
    </Routes >
  );
};

export default IRoutes;