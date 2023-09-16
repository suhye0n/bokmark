import React, { useState, useEffect } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getDocs, query, addDoc, collection, doc, getDoc, setDoc, updateDoc, FieldValue, deleteField } from 'firebase/firestore';
import { db } from '../firebase';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Favicon = styled.img`
    height: 18px;
    margin: 0 10px -2px 0;
`;

const Container = styled.div`
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
    margin-top: -150px;
    z-index: 10;
    position: relative;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #ff7895;
    text-align: center;
`;

const LoginBox = styled.div`
    padding: 70px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px #FF7895;
    background-color: #fff;
    margin-bottom: 20px;
`;

const ContainerBox = styled.div`
    padding: 20px;
    border-radius: 10px;
    box-shadow: 1px 1px 1px 1px #FF7895;
    background-color: #fff;
    margin-bottom: 20px;
    overflow-x: auto;
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

const DrawerBtn = styled.button`
    background-color: transparent;
    border: none;
    transition: 0.4s;
    cursor: pointer;
    &:hover {
        opacity: 0.7;
    }
`;

const Select = styled.select`
    display: block;
    padding: 14px;
    margin: 8px 0;
    border: 1px solid #eee;
    border-radius: 5px;
`;

const Pocket = () => {
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const nickname = storedUser ? storedUser.nickname : 'Anonymous';
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [showPlus, setShowPlus] = useState(false);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [sortOrder, setSortOrder] = useState('title');

    const [formData, setFormData] = useState({
        user: nickname,
        url: '',
        title: '',
        category: '',
    });

    useEffect(() => {
        const savedWebDrawer = localStorage.getItem("webDrawer");
        if (savedWebDrawer) {
            setUserBookmarks(JSON.parse(savedWebDrawer));
        }
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
        if (nickname == "수현") {
            setShowPlus(true);
        } else {
            setShowPlus(false);
        }
        const fetchWebDrawer = async () => {
            try {
                const userDrawerDocRef = doc(db, 'webDrawer', nickname);
                const userDrawerSnap = await getDoc(userDrawerDocRef);

                if (userDrawerSnap.exists()) {
                    const drawerData = userDrawerSnap.data();
                    const drawerKeys = Object.keys(drawerData).filter(key => drawerData[key] === true);
                    setUserBookmarks(drawerKeys);
                }
            } catch (error) {
                console.error("Error fetching web drawer: ", error);
            }
        };

        fetchWebDrawer();
        fetchBookmarks();
    }, []);

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

    if (nickname === 'Anonymous') {
        return (
            <Container>
                <LoginBox>북마크를 열람하려면 로그인이 필요합니다.</LoginBox>
            </Container>
        );
    }

    const addToWebDrawer = async (bookmarkId) => {
        try {
            const userDrawerDocRef = doc(db, 'webDrawer', nickname);
            await setDoc(userDrawerDocRef, {
                [bookmarkId]: true,
            }, { merge: true });

            const bookmarkDocRef = doc(db, 'bookmarks', bookmarkId);
            const snap = await getDoc(bookmarkDocRef);
            if (snap.exists()) {
                const currentCount = snap.data().webDrawerCount || 0;
                await updateDoc(bookmarkDocRef, {
                    webDrawerCount: currentCount + 1
                });
            }

            setUserBookmarks([...userBookmarks, bookmarkId]);
            localStorage.setItem("webDrawer", JSON.stringify([...userBookmarks, bookmarkId]));
            fetchBookmarks();
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromWebDrawer = async (bookmarkId) => {
        try {
            const userDrawerDocRef = doc(db, 'webDrawer', nickname);
            const bookmarkField = `${bookmarkId}`;

            await updateDoc(userDrawerDocRef, {
                [bookmarkField]: deleteField()
            });

            const bookmarkDocRef = doc(db, 'bookmarks', bookmarkId);
            const snap = await getDoc(bookmarkDocRef);
            if (snap.exists()) {
                const currentCount = snap.data().webDrawerCount || 0;
                await updateDoc(bookmarkDocRef, {
                    webDrawerCount: currentCount - 1
                });
            }

            const updatedBookmarks = userBookmarks.filter(id => id !== bookmarkId);
            setUserBookmarks(updatedBookmarks);
            fetchBookmarks();
        } catch (error) {
            console.error(error);
        }
    };

    const sortBookmarks = (bookmarks) => {
        if (sortOrder === 'title') {
          return bookmarks.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortOrder === 'latest') {
          return bookmarks.sort((a, b) => b.id.localeCompare(a.id));
        }
        return bookmarks;
      };

    return (
        <Container>
            <ContainerBox>
            <Title>웹 서랍</Title>
                <div>
                    <Select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="title">제목순</option>
                        <option value="latest">최신순</option>
                    </Select>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>번호</TableHeader>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>카테고리</TableHeader>
                            <TableHeader>웹서랍</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortBookmarks(filterBookmarks(bookmarks, searchQuery, category))
                        .filter((bookmark) => userBookmarks.includes(bookmark.id))
                        .map((bookmark, index) => (
                                <TableRow key={bookmark.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                            <Favicon src={bookmark.url + 'favicon.ico'} onerror={'%PUBLIC_URL%/ico.ico'} />
                                            {bookmark.title}
                                        </TitleLink>
                                    </TableCell>
                                    <TableCell>{bookmark.category}</TableCell>
                                    <TableCell>
                                        {userBookmarks.includes(bookmark.id) ? (
                                            <DrawerBtn onClick={() => removeFromWebDrawer(bookmark.id)}><FaBookmark /></DrawerBtn>
                                        ) : (
                                            <DrawerBtn onClick={() => addToWebDrawer(bookmark.id)}><FaRegBookmark /></DrawerBtn>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}

                    </tbody>
                </Table>
            </ContainerBox>
        </Container>
    );
};

export default Pocket;
