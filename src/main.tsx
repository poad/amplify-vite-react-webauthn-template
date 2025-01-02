import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './index.css';

Amplify.configure(outputs);

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Authenticator.Provider>
        <App />
      </Authenticator.Provider>
    </React.StrictMode>,
  );
}
