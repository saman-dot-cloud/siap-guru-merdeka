import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Memanggil komponen utama Freebuff
import './index.css';     // KUNCI UTAMA: Memaksa Vite memproses Tailwind CSS v4

// Memicu render visual ke browser
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
