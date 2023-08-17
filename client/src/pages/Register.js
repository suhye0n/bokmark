import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
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
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={onSubmitHandler}>
                <input type="text" id="name" onChange={onNameHandler} />
                <input type="email" id="email" onChange={onEmailHandler} />
                <input type="password" id="password" onChange={onPwHandler} />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Signup;
