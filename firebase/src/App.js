import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Pocket from './components/Pocket';
import Mypage from './components/Mypage';
import Scrap from './components/Scrap';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pocket" element={<Pocket />} />
          <Route path="/pocket" element={<Pocket />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/scrap" element={<Scrap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
