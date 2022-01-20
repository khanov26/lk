import React, {useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import classNames from "classnames";
import {useAuth} from "../useAuth";
import {Navigate, useLocation, useNavigate} from "react-router-dom";

interface Inputs {
    email: string;
    password: string;
}

interface LocationState {
    from: Location;
}

const LoginForm: React.FC = () => {
    const {register, handleSubmit, formState: {errors}, setError} = useForm<Inputs>({reValidateMode: 'onBlur'});
    const navigate = useNavigate();
    const location = useLocation();
    const {user, login} = useAuth();
    const [loading, setLoading] = useState(false);

    const formFieldsParams = {
        email: register('email', {
            required: 'Необходимо заполнить это поле',
            pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'Неправильный формат email адреса',
            }
        }),
        password: register('password', {
            required: 'Необходимо заполнить это поле',
            minLength: {
                value: 4,
                message: 'Длина пароля не должна быть меньше 4 символов',
            }
        })
    };

    const onSubmit: SubmitHandler<Inputs> = ({email, password}) => {
        setLoading(true);
        login(email, password)
            .then(() => {
                const from = (location.state as LocationState)?.from?.pathname || '/';
                navigate(from, {replace: true});
            })
            .catch(() => {
                setError('email', {});
                setError('password', {});
            }).finally(() => {
                setLoading(false);
        });
    }

    if (user) {
        const from = (location.state as LocationState)?.from?.pathname || '/';
        return <Navigate to={from} replace />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-floating mb-3">
                <input
                    type="text"
                    {...formFieldsParams.email}
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
                    type="password"
                    {...formFieldsParams.password}
                    id="password"
                    placeholder="Пароль"
                    className={classNames({
                        'form-control': true,
                        'is-invalid': errors.password
                    })}
                />
                {errors.password &&
                <div className="invalid-feedback">
                    {errors.password.message}
                </div>
                }
                <label htmlFor="password">Пароль</label>
            </div>

            <button className="w-100 btn btn-lg btn-primary" type="submit" disabled={loading}>Войти</button>
        </form>
    );
};

export default LoginForm;