import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
    text-align: center;
    padding: 40px;
`;

const Footer = () => {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const nickname = storedUser ? storedUser.nickname : 'Anonymous';

    useEffect(() => {
        if(nickname == "Anonymous") {
          navigate('/login');
        }
    }, []);

  return (
    <Container>
      <p>북마크 수정, 삭제는 관리자에게 메일 주세요.</p>
    </Container>
  );
};

export default Footer;
