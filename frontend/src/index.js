import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store'
import { Provider } from 'react-redux'
import {positions, transitions, Provider as Alertprovider} from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import { ToastProvider } from './Contaxt/ToastProvider';
import { SessionStorageProvider } from './Contaxt/SessionStorageContext';
import { LocationContextProvider } from './Contaxt/LocationContext';
import { SettingsProvider } from './Contaxt/SettingsContext';

const option = {
  timeout: 2000,
  position: positions.TOP_CENTER,
  transition: transitions.SCALE
 
}


ReactDOM.render(
    <Provider store={store}>
      <Alertprovider template={AlertTemplate} {...option}>
        <React.StrictMode >
            <ToastProvider>
              <SessionStorageProvider>
                <LocationContextProvider>
                    <SettingsProvider>
                        <App />
                    </SettingsProvider>
                </LocationContextProvider>
              </SessionStorageProvider>
            </ToastProvider>
        </React.StrictMode>
      </Alertprovider>
    </Provider>,
  document.getElementById('root')
);
