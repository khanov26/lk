import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../useAuth";
import Contact from "../types/Contact";
import ErrorComponent from "../components/ErrorComponent";
import Spinner from "../components/Spinner";
import ContactInfo from "../components/ContactInfo";

const baseUrl = 'http://localhost:3001/contacts';

const ContactPage: React.FC = () => {
    const {contactId} = useParams();

    const [loading, setLoading] = useState(false);
    const [contact, setContact] = useState<Contact | null>(null);
    const [error, setError] = useState(false);

    const {user, logout} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const url = new URL(`${baseUrl}/${contactId}`);

        setLoading(true);
        fetch(url.toString(), {
            headers: user?.accessToken ? {Authorization: `Bearer ${user.accessToken}`} : undefined
        }).then(response => {
            if (response.status === 401) {
                logout();
                navigate('/login', {replace: true});
            }
            if (response.status === 404) {
                return null;
            }
            return response.json();
        }).then(contact => {
            setContact(contact);
        }).catch(error => {
            console.error(error);
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, [contactId]);

    if (error) {
        return (
            <ErrorComponent/>
        );
    }

    return (
        <div className="container pt-3">
            <div className="d-flex justify-content-center">
                {loading ?
                    <Spinner/> :
                    contact ?
                    <ContactInfo contact={contact}/> :
                    <div className="alert alert-danger" role="alert">
                        Контакт не найден
                    </div>
                }
            </div>
        </div>
    );
};

export default ContactPage;