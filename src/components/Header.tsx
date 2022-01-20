import React from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../useAuth";
import {ReactComponent as UserIcon} from 'bootstrap-icons/icons/person-circle.svg';

const Header: React.FC = () => {
    const {user, logout} = useAuth();

    const navigate = useNavigate();

    const handleLoginButtonClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        navigate('/login');
    };

    const handleLogoutButtonClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        logout();
        navigate('/');
    };

    const handleNavLinkClassName = (props: { isActive: boolean }): string => {
        return `nav-link px-2 ${props.isActive ? 'text-secondary' : 'text-white'}`;
    }

    return (
        <header className="p-3 bg-dark text-white">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li>
                            <NavLink to="/" className={handleNavLinkClassName}>Главная</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contacts" className={handleNavLinkClassName}>Контакты</NavLink>
                        </li>
                    </ul>

                    {user ?
                        <>
                            <div className="me-2">
                                <span className="me-1"><UserIcon style={{width: '1.2rem', height: '1.2rem'}}/></span>
                                <span>{user.email}</span>
                            </div>
                            <button type="button" className="btn btn-outline-light me-2"
                                    onClick={handleLogoutButtonClick}>Выйти
                            </button>
                        </> :
                        <button type="button" className="btn btn-outline-light me-2"
                                onClick={handleLoginButtonClick}>Войти
                        </button>
                    }
                </div>
            </div>
        </header>
    );
};

export default Header;