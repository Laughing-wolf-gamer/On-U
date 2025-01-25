import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 uses `createRoot`
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
// import { positions, transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { ToastProvider } from './Contaxt/ToastProvider';



// Ensure the root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create the root using React 18
  root.render(
    <Provider store={store}>
      <React.StrictMode>
        <ToastProvider>
          <App />
        </ToastProvider>
      </React.StrictMode>
    </Provider>
  );
} else {
  console.error('Root element not found!');
}
