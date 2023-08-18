import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, password });
      console.log(response.data);

      if (response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        alert('로그인이 완료되었습니다.');
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
      let isLogin = !!localStorage.getItem('userId');
      if (isLogin !== false) {
          window.location.href = '/';
      } else {
      }
  }, []);

  return (
    <div className='form'>
      <h2>로그인</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Login;
