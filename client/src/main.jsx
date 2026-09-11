import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { SavedMoviesProvider } from './context/SavedMoviesContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedMoviesProvider>
          <App />
        </SavedMoviesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
