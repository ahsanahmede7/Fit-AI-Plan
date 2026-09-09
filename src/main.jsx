import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Rout from './auth/Rout.jsx'
import store from './redux/store.js'
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const query = new QueryClient()
createRoot(document.getElementById('root')).render(
<BrowserRouter>
<QueryClientProvider client={query}>
  <Provider store={store}>

    <Rout/>
</Provider>
</QueryClientProvider>
  
  </BrowserRouter>
)
