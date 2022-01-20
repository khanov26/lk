import React from 'react';
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ContactsPage from "./pages/ContactsPage";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import {AuthProvider} from "./useAuth";
import ContactPage from "./pages/ContactPage";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header/>

                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>

                    <Route path="/contacts" element={<RequireAuth/>}>
                        <Route path=":contactId" element={<ContactPage/>}/>
                        <Route index element={<ContactsPage/>}/>
                    </Route>
                </Routes>

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
