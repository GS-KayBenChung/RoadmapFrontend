import React from 'react';
import { createRoot } from 'react-dom/client';
import './app/layout/styles.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Route.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { UserProvider } from './userContext.tsx';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="36494825135-hb6snjuupfv7r5pqdupedv1u1oklvj44.apps.googleusercontent.com">
      {/* <StoreContext.Provider value={store}> */}
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      {/* </StoreContext.Provider> */}
    </GoogleOAuthProvider>
  </React.StrictMode>
);
