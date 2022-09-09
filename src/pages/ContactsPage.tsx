import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Contact from "../types/Contact";
import ContactsList from "../components/ContactsList";
import Spinner from "../components/Spinner";
import Pagination from "../components/Pagination";
import ErrorComponent from "../components/ErrorComponent";
import {useAuth} from "../useAuth";
import {useNavigate, useSearchParams} from "react-router-dom";
import AddContactForm from "../components/AddContactForm";
import Search from "../components/Search";
import {debounce} from 'lodash';
import './ContactsPage.css';

const baseUrl = 'http://localhost:3001/contacts'

const ContactsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [error, setError] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(Number(searchParams.get('page') || 1));
    const [totalContactsQuantity, setTotalContactsQuantity] = useState(0);

    const handlePageChange = React.useCallback((page: number) => {
        setPage(page);
    }, []);

    const [searchTerm, setSearchTerm] = useState(decodeURI(searchParams.get('search') || ''));

    const handleSearchTermUpdate = useMemo(() => debounce((searchTerm: string) => {
        setSearchTerm(searchTerm.trim());
        setPage(1);
    }, 300), []);

    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const CONTACTS_PER_PAGE = 10;

    const getContacts = useCallback(() => {
        const url = new URL(baseUrl);
        url.searchParams.set('_page', String(page));
        url.searchParams.set('_limit', String(CONTACTS_PER_PAGE));
        url.searchParams.set('q', encodeURI(searchTerm));

        setLoading(true);
        fetch(url.toString(), {
            headers: user?.accessToken ? {Authorization: `Bearer ${user.accessToken}`} : undefined
        }).then(response => {
            if (response.status === 401) {
                logout();
                navigate('/login', {replace: true});
            }
            const totalQuantity = Number(response.headers.get('X-Total-Count'));
            setTotalContactsQuantity(totalQuantity);

            return response.json();
        }).then(contacts => {
            setContacts(contacts);
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setError(true);
        });
    }, [logout, navigate, page, searchTerm, user?.accessToken]);

    const deleteContact = useCallback((contact: Contact) => {
        const url = new URL(`${baseUrl}/${contact.id}`);
        fetch(url.toString(), {
            method: 'DELETE',
            headers: user?.accessToken ? {Authorization: `Bearer ${user.accessToken}`} : undefined
        }).then(response => {
            if (response.status === 401) {
                logout();
                navigate('/login', {replace: true});
            }
            getContacts();
        }).catch(error => {
            console.error(error);
        });
    }, [getContacts, logout, navigate, user?.accessToken]);

    const updateContact = (contact: Contact) => {
        const url = new URL(`${baseUrl}/${contact.id}`);
        const authHeader = user?.accessToken ? {Authorization: `Bearer ${user.accessToken}`} : undefined;
        fetch(url.toString(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader
            },
            body: JSON.stringify({
                firstname: contact.firstname,
                lastname: contact.lastname,
                email: contact.email,
                city: contact.city,
                zip: contact.zip,
            }),
        }).then(response => {
            if (response.status === 401) {
                logout();
                navigate('/login', {replace: true});
            }
            return response.json();
        }).then((updatedContact: Contact) => {
            setContacts(contacts.map(contact => {
                if (contact.id === updatedContact.id) {
                    return updatedContact;
                }

                return contact;
            }));
        });
    };

    const addContact = useCallback((contactData: Omit<Contact, 'id'>) => {
        const url = new URL(baseUrl);
        const authHeader = user?.accessToken ? {Authorization: `Bearer ${user.accessToken}`} : undefined;
        fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader
            },
            body: JSON.stringify(contactData),
        }).then(response => {
            if (response.status === 401) {
                logout();
                navigate('/login', {replace: true});
            }
            return response.json();
        }).then((contact: Contact) => {
            navigate(`${contact.id}`);
        });

    }, [logout, navigate, user?.accessToken]);

    useEffect(() => {
        const newSearchParams = new URLSearchParams();

        if (searchTerm) {
            newSearchParams.set('search', encodeURI(searchTerm));
        }
        
        if (page > 1) {
            newSearchParams.set('page', String(page));
        }

        setSearchParams(newSearchParams, {replace: true});
    }, [page, searchTerm, setSearchParams]);

    useEffect(() => {
        getContacts();
    }, [getContacts]);

    if (error) {
        return (
            <ErrorComponent/>
        );
    }

    return (
        <div className="container pt-3">
            <h1>Контакты</h1>
            <Search defaultValue={searchTerm} onChange={handleSearchTermUpdate}/>
            <AddContactForm onAdd={addContact}/>

            {loading ?
                <div className="d-flex justify-content-center">
                    <Spinner/>
                </div> :
                <>
                    <ContactsList
                        contacts={contacts}
                        onDelete={deleteContact}
                        onUpdate={updateContact}
                        searchTerm={searchTerm}
                    />
                    <Pagination
                        elementPerPage={CONTACTS_PER_PAGE}
                        totalElementsQuantity={totalContactsQuantity}
                        maxPageQuantity={5}
                        currentPage={page}
                        onPageChange={handlePageChange}
                    />
                </>
            }
        </div>
    );
};

export default ContactsPage;