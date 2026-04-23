import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FridgeProvider } from './context/FridgeContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Scanning from './pages/Scanning';
import Report from './pages/Report';
import Recipe from './pages/Recipe';
import Recipes from './pages/Recipes';
import Inventory from './pages/Inventory';
import Profile from './pages/Profile';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FridgeProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/report" element={<Report />} />
            <Route path="/recipe" element={<Recipe />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/scanning" element={<Scanning />} />
        </Routes>
      </FridgeProvider>
    </BrowserRouter>
  </StrictMode>,
);
