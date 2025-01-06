import { createRoot } from 'react-dom/client';
import './app/layout/styles.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Route.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { store, StoreContext } from './app/stores/store.ts';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId || ''}>
      <StoreContext.Provider value={store}>
        <RouterProvider router={router} />
      </StoreContext.Provider>
    </GoogleOAuthProvider>
  // </React.StrictMode>
); 