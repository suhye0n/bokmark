import axios from 'axios';

const Account = () => {
    const userId = localStorage.getItem('userId');

    const handleWithdraw = async () => {
        try {
            const response = await axios.delete(`http://localhost:3000/withdraw/${userId}`);
            console.log(response.data);
            localStorage.clear();
            alert('회원 탈퇴가 완료되었습니다.');
            window.location.href = '/login';
        } catch (error) {
            console.error(error.response.data.message);
        }
    }

    return (
        <div id="account">
            <button onClick={handleWithdraw}>회원 탈퇴</button>
        </div>
    );
}

export default Account;