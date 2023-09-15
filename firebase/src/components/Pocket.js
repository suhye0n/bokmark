import React, { useState } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: -150px;
  padding: 20px;
  z-index: 10;
  position: relative;
  border-radius: 10px;
  box-shadow: 1px 1px 1px 1px #FF7895;
  background-color: #fff;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #ff7895;
`;

const Pocket = () => {

  return (
    <Container>
      <Title>웹 서랍</Title>
    </Container>
  );
};

export default Pocket;
