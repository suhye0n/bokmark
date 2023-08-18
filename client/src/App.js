import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Header from './pages/components/Header';
import './App.css';

const App = () => {
  return (
    <div id="app">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          <Route path='/account' element={<Account />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
