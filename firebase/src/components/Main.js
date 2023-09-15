import React, { useState, useEffect } from 'react';
import { TbBookmarkPlus, TbEditCircle, TbTrashX } from 'react-icons/tb';
import { getDocs, query, addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Favicon = styled.img`
    height: 18px;
    margin: 0 10px -2px 0;
`;

const HomeContainer = styled.div`
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    margin-top: -150px;
    z-index: 10;
    position: relative;
`;

const ContainerBox = styled.div`
    padding: 20px;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px #FF7895;
    background-color: #fff;
    margin-bottom: 20px;
`;

const Background = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .8);
`;

const Modal = styled.div`
    z-index: 999;
    position: fixed;
    margin: 0px auto;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50% );
    border-radius: 5px;
    width: 80%;
    max-width: 800px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px #FF7895;
    background-color: #fff;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    text-align: center;
`;

const TableHeader = styled.th`
  padding: 10px;
  fort-weight: bold;
  border-bottom: 1px solid #dee2e6;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
`;

const TitleLink = styled(Link)`
  text-decoration: none;
`;

const WriteButton = styled(Link)`
  position: fixed;
  right: 40px;
  bottom: 40px;
  box-shadow: 1px 1px 1px 1px #FF7895;
  padding: 15px 20px;
  text-decoration: none;
  border-radius: 50px;
  border: 1px solid #dee2e6;
  margin-top: 20px;
  font-weight: bold;
  background: #FF7895;
  
  * {
    color: #fff;
    font-size: 30px;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const Input = styled.input`
  display: block;
  padding: 14px;
  margin: 8px 0;
  width: calc(100% - 30px);
  border: 1px solid #eee;
  border-radius: 5px;
`;

const Select = styled.select`
    display: block;
  padding: 14px;
  margin: 8px 0;
  width: 100%;
  border: 1px solid #eee;
  border-radius: 5px;
`;

const Button = styled.button`
    padding: 13px 25px;
    margin-right: 10px;
    font-size: 1rem;
    background-color: #ff7895;
    color: white;
    border: none;
    border-radius: 0.3rem;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`;

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const nickname = storedUser ? storedUser.nickname : 'Anonymous';
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [showPlus, setShowPlus] = useState(false);

    const [formData, setFormData] = useState({
        user: nickname,
        url: '',
        title: '',
        category: '',
    });

    const fetchBookmarks = async () => {
        try {
            const bookmarksData = await getDocs(query(collection(db, 'bookmarks')));
            const bookmarksArray = [];

            bookmarksData.forEach((bookmarkDoc) => {
                bookmarksArray.push({
                    id: bookmarkDoc.id,
                    ...bookmarkDoc.data(),
                });
            });

            setBookmarks(bookmarksArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
        fetchBookmarks();
        if(nickname == "수현") {
          setShowPlus(true);
        } else {
          setShowPlus(false);
        }
    }, []);

    const searchQuery = new URLSearchParams(location.search).get('search') || '';
    const category = new URLSearchParams(location.search).get('category') || '';

    const filterBookmarks = (bookmarks, query, category) => {
        return bookmarks.filter((bookmark) =>
            bookmark.title.toLowerCase().includes(query.toLowerCase()) && (!category || bookmark.category === category)
        );
    };

    useEffect(() => {
        if (id) {
            const fetchbookmark = async () => {
                try {
                    const bookmarkDoc = await getDoc(doc(db, 'bookmarks', id));
                    if (bookmarkDoc.exists()) {
                        const bookmarkData = bookmarkDoc.data();
                        setFormData({
                            user: nickname,
                            url: bookmarkData.url || '',
                            title: bookmarkData.title || '',
                            category: bookmarkData.category || '',
                        });
                    } else {
                        console.error('북마크를 찾을 수 없습니다.');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchbookmark();
        }
    }, [id, nickname]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newBookmarkData = {
                user: nickname,
                url: formData.url,
                title: formData.title,
                category: formData.category,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            if (id) {
                const bookmarkDocRef = doc(db, 'bookmarks', id);
                await updateDoc(bookmarkDocRef, {
                    ...newBookmarkData,
                    updatedAt: new Date()
                });
                alert('북마크가 수정되었습니다.');
                closeModal();
            } else {
                await addDoc(collection(db, 'bookmarks'), newBookmarkData);
                alert('북마크가 등록되었습니다.');
                closeModal();
            }

            setFormData({
                user: nickname,
                url: '',
                title: '',
                category: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (nickname === 'Anonymous') {
        return (
            <div>
                <p>글을 쓰려면 로그인이 필요합니다.</p>
            </div>
        );
    }

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalType(null);
    };

    return (
        <HomeContainer>
            <WriteButton className='add' onClick={() => openModal('add')}><TbBookmarkPlus /></WriteButton>

            <ContainerBox>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>카테고리</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {filterBookmarks(bookmarks, searchQuery, category).map((bookmark) => (
                            <>
                            <TableRow key={bookmark.id}>
                            {showPlus && bookmark.category == "🎮" && 
                            <>
                                <TableCell>
                                    <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                        <Favicon src={bookmark.url + '/favicon.ico'} />
                                        {bookmark.title}
                                    </TitleLink>
                                </TableCell>
                                <TableCell>{bookmark.category}</TableCell>
                                </>
                            }
                            </TableRow>
                            <TableRow key={bookmark.id}>
                            {showPlus && bookmark.category == "🔗" && 
                            <>
                                <TableCell>
                                    <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                        <Favicon src={bookmark.url + '/favicon.ico'} />
                                        {bookmark.title}
                                    </TitleLink>
                                </TableCell>
                                <TableCell>{bookmark.category}</TableCell>
                                </>
                            }
                            </TableRow>
                            {bookmark.category !== "🎮" && bookmark.category !== "🔗" && 
                            <>
                                <TableRow key={bookmark.id}>
                                    <TableCell>
                                        <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                            <Favicon src={bookmark.url + '/favicon.ico'} />
                                            {bookmark.title}
                                        </TitleLink>
                                    </TableCell>
                                    <TableCell>{bookmark.category}</TableCell>
                                </TableRow>
                            </>
                            }
                            </>
                        ))}
                    </tbody>
                </Table>
            </ContainerBox>

            {modalVisible && (
                <Background>
                    <Modal>
                        <form onSubmit={handleSubmit}>
                            <Input
                                type="text"
                                name="url"
                                placeholder="링크"
                                value={formData.url}
                                onChange={handleInputChange}
                            />
                            <Input
                                type="text"
                                name="title"
                                placeholder="제목"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>-- 카테고리 선택 --</option>
                                { showPlus &&
                                <>
                                <option value="🔗">🔗</option>
                                <option value="🛒">🛒</option>
                                <option value="🗄️">🗄️</option>
                                <option value="⌨️">⌨️</option>
                                <option value="🎮">🎮</option>
                                </>
                                }
                                <option value="게임">게임</option>
                                <option value="개발자 도구">개발자 도구</option>
                                <option value="건강 및 피트니스">건강 및 피트니스</option>
                                <option value="교육">교육</option>
                                <option value="그래픽 및 디자인">그래픽 및 디자인</option>
                                <option value="금융">금융</option>
                                <option value="날씨">날씨</option>
                                <option value="지도">지도</option>
                                <option value="뉴스">뉴스</option>
                                <option value="도서">도서</option>
                                <option value="라이프 스타일">라이프 스타일</option>
                                <option value="비즈니스">비즈니스</option>
                                <option value="사진 및 비디오">사진 및 비디오</option>
                                <option value="생산성">생산성</option>
                                <option value="쇼핑">쇼핑</option>
                                <option value="소셜 네트워킹">소셜 네트워킹</option>
                                <option value="스포츠">스포츠</option>
                                <option value="어린이">어린이</option>
                                <option value="엔터테인먼트">엔터테인먼트</option>
                                <option value="여행">여행</option>
                                <option value="유틸리티">유틸리티</option>
                                <option value="음식 및 음료">음식 및 음료</option>
                                <option value="음악">음악</option>
                                <option value="의료">의료</option>
                                <option value="잡지 및 신문">잡지 및 신문</option>
                            </Select>
                            <Button type="submit">완료</Button>
                            <Button onClick={closeModal}>취소</Button>
                        </form>
                    </Modal>
                </Background>
            )}
        </HomeContainer>
    );
};

export default Main;