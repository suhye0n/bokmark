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
    margin: 10px;
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

    const [formData, setFormData] = useState({
        user: nickname,
        url: '',
        color: '',
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
                            color: bookmarkData.color || '',
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
                color: formData.color,
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
                navigate('/');
            } else {
                await addDoc(collection(db, 'bookmarks'), newBookmarkData);
                alert('북마크가 등록되었습니다.');
                navigate('/');
            }

            setFormData({
                user: nickname,
                url: '',
                title: '',
                category: '',
                color: '',
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
                            <TableHeader>작성자</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {filterBookmarks(bookmarks, searchQuery, category).map((bookmark) => (
                            <TableRow key={bookmark.id}>
                                <TableCell>
                                    <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                        <Favicon src={bookmark.url + '/favicon.ico'} />
                                        {bookmark.title}
                                    </TitleLink>
                                </TableCell>
                                <TableCell>{bookmark.user}</TableCell>
                            </TableRow>
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
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>-- 색상 선택 --</option>
                                <option value="red">red</option>
                                <option value="yellow">yellow</option>
                                <option value="pink">pink</option>
                                <option value="black">black</option>
                            </Select>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>-- 카테고리 선택 --</option>
                                <option value="🔗">🔗</option>
                                <option value="🛒">🛒</option>
                                <option value="🗄️">🗄️</option>
                                <option value="⌨️">⌨️</option>
                                <option value="🎮">🎮</option>
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
