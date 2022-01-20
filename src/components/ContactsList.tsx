import React, {useState} from 'react';
import Contact from "../types/Contact";
import {ReactComponent as EditIcon} from 'bootstrap-icons/icons/pencil-square.svg';
import {ReactComponent as DeleteIcon} from 'bootstrap-icons/icons/trash.svg';
import {ReactComponent as SaveIcon} from 'bootstrap-icons/icons/check.svg';
import {ReactComponent as CancelIcon} from 'bootstrap-icons/icons/x.svg';
import {SubmitHandler, useForm} from "react-hook-form";
import './ContactsList.css';
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

interface Props {
    contacts: Contact[];
    onDelete: (contact: Contact) => void;
    onUpdate: (contact: Contact) => void;
    searchTerm?: string;
}

const ContactsList: React.FC<Props> = ({contacts, onDelete, onUpdate, searchTerm}) => {
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const navigate = useNavigate();

    const handleContactClick = (contact: Contact) => (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.closest('.control-buttons')) {
            return;
        }
        navigate(String(contact.id));
    };

    const handleDeleteButtonClick = (contact: Contact) => () => {
        if (!window.confirm(`Уверены, что хотите удалить контакт ${contact.firstname} ${contact.lastname}?`)) {
            return;
        }
        onDelete(contact);
    };

    const handleEditButtonClick = (contact: Contact) => () => {
        reset();
        setEditingContact(contact);
    };

    const handleCancelButtonClick = () => {
        setEditingContact(null);
        reset();
    };

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<Contact>({reValidateMode: 'onBlur'});

    const contactFieldsParams: Record<keyof Contact, ReturnType<typeof register>> = {
        id: register('id'),
        firstname: register('firstname', {
            required: 'Обязательно для заполнения',
            pattern: {
                value: /^[a-zа-я\s-]+$/i,
                message: 'Имя должно содержать только буквы'
            }
        }),
        lastname: register('lastname', {
            required: 'Обязательно для заполнения',
            pattern: {
                value: /^[a-zа-я\s-]+$/i,
                message: 'Фамилия должна содержать только буквы'
            }
        }),
        email: register('email', {
            required: 'Обязательно для заполнения',
            pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Неправильный формат email адреса'
            }
        }),
        city: register('city', {
            required: 'Обязательно для заполнения',
            pattern: {
                value: /^[a-zа-я\s-]+$/i,
                message: 'Город должен содержать только буквы'
            }
        }),
        zip: register('zip', {
            required: 'Обязательно для заполнения',
            pattern: {
                value: /^\d{5}$/i,
                message: 'Индекс должен содержать 5 цифр'
            }
        }),
    };

    const showLabel = (label: string) => {
        if (!searchTerm) {
            return label;
        }

        const searchPattern = new RegExp(searchTerm, 'i');
        const match = label.match(searchPattern);
        if (!match) {
            return label;
        }

        return (
            <>
                {label.slice(0, match.index)}
                <span className="search-match">{match[0]}</span>
                {label.slice(match.index! + searchTerm.length)}
            </>
        );
    };

    const switchInputOrLabel = (fieldName: keyof Contact, contact: Contact, fieldType = 'text') => {
        return editingContact === contact ?
            <>
                <input
                    type={fieldType}
                    {...contactFieldsParams[fieldName]}
                    className={classNames({
                        'form-control': true,
                        'is-invalid': errors[fieldName]
                    })}
                    defaultValue={contact[fieldName]}
                />
                {errors[fieldName] &&
                <div className="invalid-feedback">
                    {errors[fieldName]?.message}
                </div>
                }
            </> :
            showLabel(String(contact[fieldName]))
    };

    const updateContact: SubmitHandler<Contact> = (contact) => {
        onUpdate(contact);
        setEditingContact(null);
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped contacts-list-table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Имя</th>
                    <th scope="col">Фамилия</th>
                    <th scope="col">Email адрес</th>
                    <th scope="col">Город</th>
                    <th scope="col">Индекс</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {contacts.map(contact => (
                    <tr key={contact.id} onClick={handleContactClick(contact)}>
                        <th scope="row">
                            {contact.id}
                            {editingContact === contact &&
                                <input
                                    type="hidden"
                                    {...contactFieldsParams.id}
                                    className="form-control"
                                    defaultValue={contact.id}
                                />
                            }
                        </th>
                        <td>{switchInputOrLabel('firstname', contact)}</td>
                        <td>{switchInputOrLabel('lastname', contact)}</td>
                        <td>{switchInputOrLabel('email', contact)}</td>
                        <td>{switchInputOrLabel('city', contact)}</td>
                        <td>{switchInputOrLabel('zip', contact)}</td>

                        <td className="control-buttons">
                            {contact === editingContact ?
                                <>
                                    <button
                                        onClick={handleSubmit(updateContact)}
                                        className="btn btn-sm btn-success me-2"
                                        title="Сохранить">
                                        <SaveIcon/>
                                    </button>

                                    <button
                                        onClick={handleCancelButtonClick}
                                        className="btn btn-sm btn-danger"
                                        title="Отменить"
                                    >
                                        <CancelIcon/>
                                    </button>
                                </> :
                                <>
                                <span onClick={handleEditButtonClick(contact)} className="p-2">
                                    <EditIcon/>
                                </span>
                                    <span onClick={handleDeleteButtonClick(contact)} className="p-2">
                                    <DeleteIcon fill="red"/>
                                </span>
                                </>
                            }

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContactsList;