import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [bookmarks, setBookmarks] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalBookmarkId, setModalBookmarkId] = useState(null);

    const userId = localStorage.getItem('userId');

    const openModal = (type, bookmarkId = null) => {
        setModalType(type);
        setModalBookmarkId(bookmarkId);
        setModalVisible(true);

        if (type === 'edit' && bookmarkId) {
            const bookmarkToEdit = bookmarks.find((bookmark) => bookmark._id === bookmarkId);
            setUrl(bookmarkToEdit.url);
            setTitle(bookmarkToEdit.title);
        } else {
            setUrl('');
            setTitle('');
        }
    };

    const closeModal = () => {
        setModalVisible(false);
        setModalType(null);
        setModalBookmarkId(null);
        setUrl('');
        setTitle('');
    };

    const handleSubmit = async () => {
        try {
            if (modalType === 'add') {
                const response = await axios.post('http://localhost:3000/addBookmark', {
                    url,
                    title,
                    user: userId,
                });
                console.log(response.data);
            } else if (modalType === 'edit' && modalBookmarkId) {
                const response = await axios.put(`http://localhost:3000/updateBookmark/${modalBookmarkId}`, {
                    title,
                    url
                });
                console.log(response.data);
            }

            closeModal();
            fetchBookmarks();
        } catch (error) {
            console.error(error.response.data.message);
        }
    };

    const handleDeleteClick = async (bookmarkId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/deleteBookmark/${bookmarkId}`);
            console.log(response.data);
            fetchBookmarks();
        } catch (error) {
            console.error(error.response.data.message);
        }
    };


    const fetchBookmarks = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/bookmarks/${userId}`);
            setBookmarks(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [userId]);

    return (
        <div>
            <h2>북마크 리스트</h2>
            <button onClick={() => openModal('add')}>새로운 북마크 추가</button>

            <ul>
                {bookmarks.map((bookmark) => (
                    <li key={bookmark._id}>
                        <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                            {bookmark.title}
                        </a>
                        <button onClick={() => openModal('edit', bookmark._id)}>수정</button>
                        <button onClick={() => handleDeleteClick(bookmark._id)}>삭제</button>
                    </li>
                ))}
            </ul>

            {modalVisible && (
                <div className="modal">
                    <h2>{modalType === 'add' ? '새로운 북마크 추가' : '북마크 수정'}</h2>
                    <input
                        type="text"
                        placeholder="URL 입력"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="제목 입력"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button onClick={handleSubmit}>{modalType === 'add' ? '추가' : '수정'}</button>
                    <button onClick={closeModal}>취소</button>
                </div>
            )}
        </div>
    );
};

export default Main;
