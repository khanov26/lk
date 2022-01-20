import React, {createContext, useContext, useState} from "react";

const baseUrl = 'http://localhost:3001'

interface AuthSubject {
    id: number;
    email: string;
    accessToken: string;
}

interface AuthResponse {
    user: {
        id: number;
        email: string;
    };
    accessToken: string;
}

interface AuthContextType {
    user: AuthSubject | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

const getUserFromStorage = (): AuthSubject | null => {
    const userFromStorage = localStorage.getItem('user');
    return userFromStorage ? JSON.parse(userFromStorage) : null;
};

export const AuthProvider: React.FC = (props) => {
    const [user, setUser] = useState<AuthSubject | null>(getUserFromStorage());

    const login = async (email: string, password: string) => {
        const response = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data: AuthResponse = await response.json();
        const currentUser = {
            id: data.user.id,
            email: data.user.email,
            accessToken: data.accessToken,
        } as AuthSubject;
        setUser(currentUser);
        localStorage.setItem('user', JSON.stringify(currentUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {user, login, logout};

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
};

export function useAuth() {
    return useContext(AuthContext);
}