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
import Donate from './pages/donate';
import { IsAccount } from './routes/isAccount';

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
            <Route path="/:number([0-9]{1,3})" element={<></>} />
            <Route path="/:id" element={<IsAccount />}>
              <Route index element={<Donate />} />
            </Route>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
)
