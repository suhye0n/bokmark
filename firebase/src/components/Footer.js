import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const Container = styled.div`
    text-align: center;
    padding: 40px;
`;

const FooterLink = styled(Link)`
  color: #ff7895 !important;
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
      <p>북마크 수정, 삭제는 <FooterLink to="mailto:claphyeon@kakao.com">관리자에게 메일</FooterLink> 주세요.</p>
    </Container>
  );
};

export default Footer;
