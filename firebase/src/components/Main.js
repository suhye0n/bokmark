import React, { useState, useEffect } from 'react';
import { TbBookmarkPlus } from 'react-icons/tb';
import { MdOutlineReportGmailerrorred } from 'react-icons/md';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { getDocs, query, addDoc, collection, doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
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

const DrawerBtn = styled.button`
background-color: transparent;
border: none;
transition: 0.4s;
cursor: pointer;
&:hover {
    opacity: 0.7;
}
`;

const SortSelect = styled.select`
    display: block;
    padding: 14px;
    margin: 8px 0;
    border: 1px solid #eee;
    border-radius: 5px;
`;

const Main = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const nickname = storedUser ? storedUser.nickname : 'Anonymous';
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportVisible, setReportVisible] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportBookmarkId, setReportBookmarkId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bookmarks, setBookmarks] = useState([]);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [sortOrder, setSortOrder] = useState('title');

    const [formData, setFormData] = useState({
        user: nickname,
        url: '',
        title: '',
        category: '',
        favicon: '',
    });

    useEffect(() => {
        const savedWebDrawer = localStorage.getItem("webDrawer");
        if (savedWebDrawer) {
            setUserBookmarks(JSON.parse(savedWebDrawer));
        }
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
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
                favicon: formData.url + 'favicon.ico',
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
                fetchBookmarks();
                closeModal();
            }

            setFormData({
                user: nickname,
                url: '',
                title: '',
                category: '',
                favicon: '',
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (nickname === 'Anonymous') {
        return (
            <HomeContainer>
                <LoginBox>북마크를 열람하려면 로그인이 필요합니다.</LoginBox>
            </HomeContainer>
        );
    }

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const openReport = (bookmarkId) => {
        setReportBookmarkId(bookmarkId);
        setReportVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalType(null);
    };

    const closeReport = () => {
        setReportVisible(false);
    };

    const handleReportSubmit = async (e) => {
        e.preventDefault();

        if (reportReason.trim() === "") {
            alert("신고 사유를 입력해주세요.");
            return;
        }

        const bookmark = bookmarks.find(bm => bm.id === reportBookmarkId);

        try {
            await addDoc(collection(db, 'reports'), {
                bookmarkId: reportBookmarkId,
                bookmarkTitle: bookmark.title,
                bookmarkUrl: bookmark.url,
                reason: reportReason,
                timestamp: new Date()
            });

            const bookmarkDocRef = doc(db, 'bookmarks', reportBookmarkId);
            const snap = await getDoc(bookmarkDocRef);
            if (snap.exists()) {
                const currentReportCount = snap.data().reportCount || 0;
                await updateDoc(bookmarkDocRef, {
                    reportCount: currentReportCount + 1
                });
            }

            alert("신고가 접수되었습니다.");
            setReportReason('');
            closeReport();
        } catch (error) {
            console.error(error);
        }
    };

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
        if (sortOrder === 'popularity') {
            return bookmarks.sort((a, b) => {
                const webDrawerCountA = a.webDrawerCount || 0;
                const webDrawerCountB = b.webDrawerCount || 0;
                return webDrawerCountB - webDrawerCountA;
            });
        }
        return bookmarks;
    };

    return (
        <HomeContainer>
            <WriteButton className='add' onClick={() => openModal('add')}><TbBookmarkPlus /></WriteButton>

            <ContainerBox>
                <div>
                    <SortSelect onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="title">제목순</option>
                        <option value="latest">최신순</option>
                        <option value="popularity">인기순</option>
                    </SortSelect>
                </div>
                <Table>
                    <thead>
                        <tr>
                            {/*<TableHeader>번호</TableHeader>*/}
                            <TableHeader>제목</TableHeader>
                            {/*<TableHeader>카테고리</TableHeader>*/}
                            <TableHeader>웹서랍 수</TableHeader>
                            <TableHeader>웹서랍</TableHeader>
                            <TableHeader>신고</TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {sortBookmarks(filterBookmarks(bookmarks, searchQuery, category)).map((bookmark, index) => (
                            <>
                                <TableRow key={bookmark.id}>
                                    {/*<TableCell>{index + 1}</TableCell>*/}
                                    <TableCell>
                                        <TitleLink target="_blank" rel="noopener noreferrer" to={`${bookmark.url}`}>
                                            <Favicon src={bookmark.favicon} onerror={'%PUBLIC_URL%/ico.ico'} />
                                            {bookmark.title}
                                        </TitleLink>
                                    </TableCell>
                                    {/*<TableCell>{bookmark.category}</TableCell>*/}
                                    <TableCell>{bookmark.webDrawerCount || 0}</TableCell>
                                    <TableCell>
                                        {userBookmarks.includes(bookmark.id) ? (
                                            <DrawerBtn onClick={() => removeFromWebDrawer(bookmark.id)}><FaBookmark /></DrawerBtn>
                                        ) : (
                                            <DrawerBtn onClick={() => addToWebDrawer(bookmark.id)}><FaRegBookmark /></DrawerBtn>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DrawerBtn>
                                            <MdOutlineReportGmailerrorred onClick={() => openReport(bookmark.id)} />
                                        </DrawerBtn>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </tbody>
                </Table>
            </ContainerBox>

            {modalVisible && (
                <Background>
                    <Modal>
                        {/* 수정: 이미 존재하는 url은 등록하지 못하도록.. */}
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


            {reportVisible && (
                <Background>
                    <Modal>
                        <form onSubmit={handleReportSubmit}>
                            <Input
                                type="text"
                                placeholder="신고 사유"
                                value={reportReason}
                                onChange={e => setReportReason(e.target.value)}
                            />
                            <Button type="submit">완료</Button>
                            <Button onClick={closeReport}>취소</Button>
                        </form>
                    </Modal>
                </Background>
            )}
        </HomeContainer>
    );
};

export default Main;