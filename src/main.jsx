import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { store } from './store/store.js'
import './index.css'

// Experiment 3 — Provider setup
// Provider wraps the application to connect Redux Toolkit store.
// AuthProvider wraps authentication state (Experiment 2) independently.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)

