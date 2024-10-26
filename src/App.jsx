import {useEffect, useState} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Product from "./pages/Product";
import "./index.css";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";
import ContryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import {CitiesProvider} from "../context/CitiesContext";
import {AuthProvider} from "../context/FakeAuthContext";
import ProtectRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="pricing" element={<Pricing />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route
              path="app"
              element={
                <ProtectRoute>
                  <AppLayout />
                </ProtectRoute>
              }>
              <Route index element={<Navigate replace to="cities" />}></Route>
              <Route path="cities" element={<CityList></CityList>}></Route>
              <Route path="cities/:id" element={<City />}></Route>
              <Route
                path="countries"
                element={<ContryList></ContryList>}></Route>
              <Route path="form" element={<Form />}></Route>
            </Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
