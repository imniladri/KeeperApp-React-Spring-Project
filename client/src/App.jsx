import "./styles/settings.css";

import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Entries from "./components/Entries";
import Error from "./components/Error";
import NewEntry from "./components/NewEntry";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/entries" element={<Entries />} />
                <Route path="/newentry" element={<NewEntry />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </>
    );
}
