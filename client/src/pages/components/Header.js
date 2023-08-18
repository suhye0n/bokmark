import './Header.css';
import { TbLogout } from 'react-icons/tb';
import { MdPersonOutline, MdLogin, MdPersonAddAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
    const [loginStyle, setLoginStyle] = useState({ display: 'none' });
    const [logoutStyle, setLogoutStyle] = useState({ display: 'inline' });

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    useEffect(() => {
        let isLogin = !!localStorage.getItem('userId');
        if (isLogin == false) {
            setLoginStyle({ display: 'none' });
            setLogoutStyle({ display: 'inline' });
        } else {
            setLoginStyle({ display: 'inline' });
            setLogoutStyle({ display: 'none' });
        }
    }, []);

    return (
        <header id='header'>
            <Link to='/'><h3>bokmark</h3></Link>
            <div className='menu'>
                <div className='login' style={loginStyle}>
                    <Link to='/account'><MdPersonOutline /></Link>
                    <div onClick={logout}><TbLogout /></div>
                </div>
                <div className='logout' style={logoutStyle}>
                    <Link to='/register'><MdPersonAddAlt /></Link>
                    <Link to='/login'><MdLogin /></Link>
                </div>
            </div>
        </header>
    );
}

export default Header;