import React, { useState, useEffect } from 'react';
import { TbBookmarkPlus, TbEditCircle, TbTrashX } from 'react-icons/tb';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { getDocs, query, addDoc, collection, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
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
    overflow-x: auto;
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

const SortSelect = styled.select`
    display: block;
    padding: 14px;
    margin: 8px 0;
    border: 1px solid #eee;
    border-radius: 5px;
`;

const EditButton = styled.button`
    border: 0;
    cursor: pointer;
    background-color: transparent;
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

const Scrap = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const nickname = storedUser ? storedUser.nickname : 'Anonymous';
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scraps, setScraps] = useState([]);
    const [currentScrapId, setCurrentScrapId] = useState(null);
    const [sortOrder, setSortOrder] = useState('title');

    const [formData, setFormData] = useState({
        user: nickname,
        url: '',
        title: '',
        color: '',
    });

    const fetchScraps = async () => {
        try {
            const scrapsData = await getDocs(query(collection(db, 'scraps')));
            const scrapsArray = [];

            scrapsData.forEach((scrapDoc) => {
                scrapsArray.push({
                    id: scrapDoc.id,
                    ...scrapDoc.data(),
                });
            });

            setScraps(scrapsArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
        fetchScraps();
    }, []);

    const searchQuery = new URLSearchParams(location.search).get('search') || '';
    const color = new URLSearchParams(location.search).get('color') || '';

    const filterScraps = (scraps, query, color) => {
        return scraps.filter((scrap) =>
            scrap.title.toLowerCase().includes(query.toLowerCase()) && (!color || scrap.color === color)
        );
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'scraps', id));
            alert('스크랩이 삭제되었습니다.');
            fetchScraps();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            const fetchScrap = async () => {
                try {
                    const scrapDoc = await getDoc(doc(db, 'scraps', id));
                    if (scrapDoc.exists()) {
                        const scrapData = scrapDoc.data();
                        setFormData({
                            user: nickname,
                            url: scrapData.url || '',
                            title: scrapData.title || '',
                            color: scrapData.color || '',
                        });
                    } else {
                        console.error('북마크를 찾을 수 없습니다.');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchScrap();
        }
    }, [id, nickname]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const newScrapData = {
        user: nickname,
        url: formData.url,
        title: formData.title,
        color: formData.color,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (modalType === 'add') {

                await addDoc(collection(db, 'scraps'), newScrapData);
                alert('스크랩이 등록되었습니다.');
                fetchScraps();
                closeModal();

                setFormData({
                    user: nickname,
                    url: '',
                    title: '',
                    color: '',
                });
            } else if (modalType === 'edit' && currentScrapId) {
                const scrapDocRef = doc(db, 'scraps', currentScrapId);
                await updateDoc(scrapDocRef, {
                    ...newScrapData,
                    updatedAt: new Date()
                });
                alert('스크랩이 수정되었습니다.');
                closeModal();
                fetchScraps();
            }
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

    const openModal = (type, scrapId = null) => {
        setCurrentScrapId(scrapId);
        if (type === 'edit' && scrapId) {
            const scrap = scraps.find(s => s.id === scrapId);
            if (scrap) {
                setFormData({
                    user: nickname,
                    url: scrap.url,
                    title: scrap.title,
                    color: scrap.color
                });
            }
        }
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => {
        setCurrentScrapId(null);
        setModalVisible(false);
        setModalType(null);

        setFormData({
            user: nickname,
            url: '',
            title: '',
            color: '',
        });
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
        <HomeContainer>
            <WriteButton className='add' onClick={() => openModal('add')}><TbBookmarkPlus /></WriteButton>

            <ContainerBox>
                <Title>스크랩</Title>
                <div>
                    <SortSelect onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="title">제목순</option>
                        <option value="latest">최신순</option>
                    </SortSelect>
                </div>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>제목</TableHeader>
                            <TableHeader>라벨</TableHeader>
                            <TableHeader>수정</TableHeader>
                            <TableHeader>삭제</TableHeader>
                        </tr>
                    </thead>
                    <tbody>

                        {sortBookmarks(filterScraps(scraps, searchQuery)).map((scrap) => (
                            <TableRow key={scrap.id}>
                                {scrap.user === nickname && (
                                    <>
                                        <TableCell>
                                            <TitleLink target="_blank" rel="noopener noreferrer" to={`${scrap.url}`}>
                                                <Favicon src={scrap.url + '/favicon.ico'} />
                                                {scrap.title}
                                            </TitleLink>
                                        </TableCell>
                                        <TableCell>{scrap.color}</TableCell>
                                        <TableCell>
                                            <EditButton onClick={() => openModal('edit', scrap.id)}>
                                                <FaEdit />
                                            </EditButton>
                                        </TableCell>
                                        <TableCell>
                                            <EditButton onClick={() => handleDelete(scrap.id)}>
                                                <FaTrashAlt />
                                            </EditButton>
                                        </TableCell>
                                    </>
                                )}
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
                                <option value="red">빨간색</option>
                                <option value="blue">파란색</option>
                                <option value="yellow">노란색</option>
                                <option value="green">초록색</option>
                            </Select>
                            <Button type="submit">{modalType === 'add' ? '추가' : '수정'}</Button>
                            <Button onClick={closeModal}>취소</Button>
                        </form>
                    </Modal>
                </Background>
            )}
        </HomeContainer>
    );
};

export default Scrap;
