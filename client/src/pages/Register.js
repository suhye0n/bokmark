import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    }

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    }

    const onPwHandler = (e) => {
        setPassword(e.currentTarget.value);
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const requestBody = {
            name: name,
            email: email,
            password: password,
        };

        try {
            const response = await axios.post('http://localhost:3000/register', requestBody);
            console.log(response.data);
            alert('회원가입이 완료되었습니다.');
            window.location.href = '/login';
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        let isLogin = !!localStorage.getItem('userId');
        if (isLogin !== false) {
            window.location.href = '/';
        } else {
        }
    }, []);

    return (
        <div className='form'>
            <h2>회원가입</h2>
            <form onSubmit={onSubmitHandler}>
                <input type="text" id="name" onChange={onNameHandler} placeholder='닉네임' />
                <input type="email" id="email" onChange={onEmailHandler} placeholder='이메일' />
                <input type="password" id="password" onChange={onPwHandler} placeholder='비밀번호' />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Register;
