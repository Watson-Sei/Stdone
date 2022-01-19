import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Header from './layouts/header';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
