import React from 'react';
import errorImage from '../assets/images/error.png';
import './ErrorComponent.css';

const ErrorComponent: React.FC = () => {
    return (
        <div className="error-page">
            <h1>Упс! Что-то пошло не так</h1>
            <img className="error-page__image" src={errorImage} alt="error"/>
        </div>
    );
};

export default ErrorComponent;