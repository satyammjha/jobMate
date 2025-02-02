import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';

const apiKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;
ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={apiKey} >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ClerkProvider>
);