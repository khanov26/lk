import React from 'react';
import Contact from "../types/Contact";

interface Props {
    contact: Contact;
}

const ContactInfo: React.FC<Props> = ({contact}) => {
    return (
        <dl className="row">
            <dt className="col-6">ID</dt>
            <dd className="col-6">{contact.id}</dd>
            <dt className="col-6">Имя</dt>
            <dd className="col-6">{contact.firstname}</dd>
            <dt className="col-6">Фамилия</dt>
            <dd className="col-6">{contact.lastname}</dd>
            <dt className="col-6">Email адрес</dt>
            <dd className="col-6">{contact.email}</dd>
            <dt className="col-6">Город</dt>
            <dd className="col-6">{contact.city}</dd>
            <dt className="col-6">Индекс</dt>
            <dd className="col-6">{contact.zip}</dd>
        </dl>
    );
};

export default ContactInfo;