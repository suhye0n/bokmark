import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaUtensils, FaBars } from 'react-icons/fa';
import { FiUser, FiLogOut, FiLogIn, FiSearch, FiX } from 'react-icons/fi';
import { MdCardMembership } from 'react-icons/md';

const Backdrop = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 998;
`;

const HeaderContainer = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  padding: ${(props) => (props.scroll ? '0 12px' : '0 48px 195px 48px')};
  justify-content: space-between;
  align-items: center;
  background-color: #ff7895;
  border-radius: ${(props) => (props.scroll ? '0' : '0 0 50% 50%')};
  transition: all 0.4s;
  z-index: ${(props) => (props.scroll ? '30' : '1')};
`;

const CategoryIcon = styled(FaBars)`
  font-size: 1.5rem;
  cursor: pointer;
  color: #f9f9f9;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.show ? '0' : '-400px')};
  height: 100%;
  width: 300px;
  overflow: scroll;
  background-color: #ff7895;
  transition: all 0.4s;
  z-index: 999;
  padding: 50px 30px;
`;

const Category = styled.h1`
  font-size: 1.5rem;

  * {
    color: #f9f9f9 !important;
  }

  a {
    display: block;
    margin: 30px 0;
  }
`;

const SearchModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, ${(props) => (props.show ? '-50%' : '550%')});
  width: 80%;
  max-width: 400px;
  background-color: #FF7895;
  padding: 50px 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease-in-out;
  z-index: 1000;

  input {
    background: transparent !important;
    max-width: calc(100% - 40px) !important;
  }

  * {
    color: #fff !important;
  }
`;

const CloseModalButton = styled.button`
  position: absolute;
  right: 20px;
  top: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const CloseIcon = styled(FiX)`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #f9f9f9;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 32px;
  display: block;
  padding: 8px 12px;
  border: 1px solid #eee;
  border-radius: 50px;
  transition: all .4s;
  background: #f4f4f4;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 5px 10px 5px 36px;
  border: none;
  border-radius: 5px;
  width: 300px;
  font-size: 1rem;
  background: #f4f4f4;
`;

const SearchButton = styled(Link)`
  display: none;
  position: fixed;
  left: 40px;
  bottom: 40px;
  box-shadow: 1px 1px 1px 1px #FF7895;
  padding: 15px 20px;
  text-decoration: none;
  border-radius: 50px;
  border: 1px solid #dee2e6;
  margin-top: 20px;
  font-weight: bold;
  background: #FF7895;
  z-index: 20;
  
  * {
    color: #fff;
    font-size: 30px;
  }

  &:hover {
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: #FF7895;
`;

const MyPageLink = styled(Link)`
  text-decoration: none;
  font-size: 1rem;
  margin-left: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
  
  * {
    color: #f9f9f9 !important;
    margin-left: 13px;
  }
`;

const Member = styled.div`
  text-decoration: none;
  font-size: 1rem;
  margin-left: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
  
  * {
    color: #f9f9f9 !important;
    margin-left: 13px;
  }
`;

const LogoutIcon = styled.span`
  margin-left: 5px;
  color: #f9f9f9;
`;

const LoginIcon = styled(FiLogIn)`
  color: #f9f9f9;
  margin-left: 20px;
  cursor: pointer;
  font-size: 24px;
`;

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showPlus, setShowPlus] = useState(false);
    const [scroll, setScroll] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    let lastScrollY = 0;
    let ticking = false;

    const update = () => {
        setScroll(window.scrollY > 10);
        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    };

    useEffect(() => {
        const onScroll = () => {
            lastScrollY = window.scrollY;
            requestTick();
        };

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const nickname = storedUser ? storedUser.nickname : 'Anonymous';
        if(nickname == "수현") {
          setShowPlus(true);
        } else {
          setShowPlus(false);
        }
        setIsLoggedIn(!!user);
    }, []);

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            return;
        }
        navigate(`/?search=${searchTerm}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem("webDrawer");
        setIsLoggedIn(false);
        alert('로그아웃이 완료되었습니다.');
    };

    return (
        <>
            <Backdrop show={showSidebar || showModal} />
            <Sidebar show={showSidebar}>
                <Category>
                    <Link to="/">홈</Link>
                    <Link to="/pocket">웹 서랍</Link>
                    <Link to="/scrap">스크랩</Link>
                    { showPlus &&
                    <>
                    <Link to="/?category=🔗">🔗</Link>
                    <Link to="/?category=🛒">🛒</Link>
                    <Link to="/?category=🗄️">🗄️</Link>
                    <Link to="/?category=⌨️">⌨️</Link>
                    <Link to="/?category=🎮">🎮</Link>
                    </>
                    }
                    <Link to="/?category=">무료 웹 순위</Link>
                    <Link to="/?category=">유료 웹 순위</Link>
                    <Link to="/?category=">요즘 뜨는 웹</Link>
                    <Link to="/?category=게임">게임</Link>
                    <Link to="/?category=개발자 도구">개발자 도구</Link>
                    <Link to="/?category=건강 및 피트니스">건강 및 피트니스</Link>
                    <Link to="/?category=교육">교육</Link>
                    <Link to="/?category=그래픽 및 디자인">그래픽 및 디자인</Link>
                    <Link to="/?category=금융">금융</Link>
                    <Link to="/?category=날씨">날씨</Link>
                    <Link to="/?category=지도">지도</Link>
                    <Link to="/?category=뉴스">뉴스</Link>
                    <Link to="/?category=도서">도서</Link>
                    <Link to="/?category=라이프 스타일">라이프 스타일</Link>
                    <Link to="/?category=비즈니스">비즈니스</Link>
                    <Link to="/?category=사진 및 비디오">사진 및 비디오</Link>
                    <Link to="/?category=생산성">생산성</Link>
                    <Link to="/?category=쇼핑">쇼핑</Link>
                    <Link to="/?category=소셜 네트워킹">소셜 네트워킹</Link>
                    <Link to="/?category=스포츠">스포츠</Link>
                    <Link to="/?category=어린이">어린이</Link>
                    <Link to="/?category=엔터테인먼트">엔터테인먼트</Link>
                    <Link to="/?category=여행">여행</Link>
                    <Link to="/?category=유틸리티">유틸리티</Link>
                    <Link to="/?category=음식 및 음료">음식 및 음료</Link>
                    <Link to="/?category=음악">음악</Link>
                    <Link to="/?category=의료">의료</Link>
                    <Link to="/?category=잡지 및 신문">잡지 및 신문</Link>
                </Category>
                <CloseIcon onClick={toggleSidebar} />
            </Sidebar>
            <HeaderContainer scroll={scroll}>
                <CategoryIcon onClick={toggleSidebar} />
                <SearchContainer>
                    <SearchIcon />
                    <form onSubmit={handleSearchSubmit}>
                        <SearchInput
                            type="text"
                            placeholder="북마크 검색"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearchSubmit(e);
                                }
                            }}
                        />
                    </form>
                </SearchContainer>
                {isLoggedIn ? (
                    <MyPageLink to="/mypage">
                        <FiUser size={24} />
                        <LogoutIcon onClick={handleLogout}>
                            <FiLogOut size={24} />
                        </LogoutIcon>
                    </MyPageLink>
                ) : (
                    <Member>
                        <MdCardMembership size={24} onClick={() => navigate('/signup')} />
                        <LoginIcon onClick={() => navigate('/login')}>
                        </LoginIcon>
                    </Member>
                )}
            </HeaderContainer>
            <SearchModal show={showModal}>
                <form onSubmit={handleSearchSubmit}>
                    <SearchInput
                        type="text"
                        placeholder="북마크 검색"
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearchSubmit(e);
                            }
                        }}
                    />
                </form>
                <CloseModalButton onClick={toggleModal}>
                    <FiX />
                </CloseModalButton>
            </SearchModal>
            <SearchButton onClick={toggleModal}><FiSearch /></SearchButton>
        </>
    );
};

export default Header;
