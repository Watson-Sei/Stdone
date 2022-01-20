import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './pages/home';
import Header from './layouts/header';
import { RecoilRoot } from 'recoil';
import Profile from './pages/profile';
import { Private } from './routes/private';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/profile" element={<Private />}>
              <Route index element={<Profile />} />
            </Route>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
