import React, {useLayoutEffect, useState} from 'react';
import {Modal} from 'bootstrap';
import {SubmitHandler, useForm} from "react-hook-form";
import Contact from "../types/Contact";
import classNames from "classnames";

interface Props {
    onAdd: (contactData: Omit<Contact, 'id'>) => void;
}

const AddContactForm: React.FC<Props> = ({onAdd}) => {
    const [saving, setSaving] = useState(false);

    const {
        register,
        formState: {errors},
        handleSubmit
    } = useForm<Omit<Contact, 'id'>>({reValidateMode: 'onBlur'});

    const contactFieldsParams: Record<Exclude<keyof Contact, 'id'>, ReturnType<typeof register>> = {
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

    const onSubmit: SubmitHandler<Omit<Contact, 'id'>> = (contactData) => {
        setSaving(true);
        onAdd(contactData);
    };

    useLayoutEffect(() => {
        return () => {
            const modalInstance = Modal.getInstance('#addContactModal');
            modalInstance?.hide();
        };
    }, []);

    return (
        <>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addContactModal">
                Добавить контакт
            </button>

            <div className="modal fade" id="addContactModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Новый контакт</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"/>
                        </div>
                        <div className="modal-body">
                            <form>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            {...contactFieldsParams.firstname}
                                            id="firstname"
                                            placeholder="Имя"
                                            className={classNames({
                                                'form-control': true,
                                                'is-invalid': errors.firstname
                                            })}
                                        />
                                        {errors.firstname &&
                                        <div className="invalid-feedback">
                                            {errors.firstname.message}
                                        </div>
                                        }
                                        <label htmlFor="firstname">Имя</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            {...contactFieldsParams.lastname}
                                            id="lastname"
                                            placeholder="Фамилия"
                                            className={classNames({
                                                'form-control': true,
                                                'is-invalid': errors.lastname
                                            })}
                                        />
                                        {errors.lastname &&
                                        <div className="invalid-feedback">
                                            {errors.lastname.message}
                                        </div>
                                        }
                                        <label htmlFor="firstname">Фамилия</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            {...contactFieldsParams.email}
                                            id="email"
                                            placeholder="Email адрес"
                                            className={classNames({
                                                'form-control': true,
                                                'is-invalid': errors.email
                                            })}
                                        />
                                        {errors.email &&
                                        <div className="invalid-feedback">
                                            {errors.email.message}
                                        </div>
                                        }
                                        <label htmlFor="email">Email адрес</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            {...contactFieldsParams.city}
                                            id="city"
                                            placeholder="Город"
                                            className={classNames({
                                                'form-control': true,
                                                'is-invalid': errors.city
                                            })}
                                        />
                                        {errors.city &&
                                        <div className="invalid-feedback">
                                            {errors.city.message}
                                        </div>
                                        }
                                        <label htmlFor="city">Город</label>
                                    </div>

                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            {...contactFieldsParams.zip}
                                            id="zip"
                                            placeholder="Индекс"
                                            className={classNames({
                                                'form-control': true,
                                                'is-invalid': errors.zip
                                            })}
                                        />
                                        {errors.zip &&
                                        <div className="invalid-feedback">
                                            {errors.zip.message}
                                        </div>
                                        }
                                        <label htmlFor="zip">Индекс</label>
                                    </div>
                                </form>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ?
                                    <>
                                        <span className="spinner-border spinner-border-sm me-1" role="status"/>
                                        Сохранение...
                                    </> :
                                    <>Сохранить</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default React.memo(AddContactForm);