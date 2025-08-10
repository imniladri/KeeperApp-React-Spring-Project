import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "./Header";

import API_URL from "../utils/API_URL";

import "../styles/auth.css";

export default function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        document.title = "Login | DairyLogs";

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUser(user);
            navigate("/");
        }
    }, []);

    const [loginUserData, setLoginUserData] = useState({
        username: "",
        password: "",
    });

    const [validationError, setValidationError] = useState({
        message: "",
        active: false,
    });

    // Input Field Update Function
    const inputOnChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setLoginUserData({
            ...loginUserData,
            [name]: value,
        });
    };

    // Form Submit Function
    const formSubmitAction = async (event) => {
        event.preventDefault();

        if (
            loginUserData.username.trim() === "" ||
            loginUserData.password.trim() === ""
        ) {
            setValidationError({
                message: "Required Username & Password",
                active: true,
            });
        } else {
            const user = await loginUser(loginUserData);
            handleLogin(user);
        }
    };

    // Login Validation Function
    const handleLogin = (user) => {
        if (user.status === 404) {
            setValidationError({
                message: "Invalid Username or Password. Please try again.",
                active: true,
            });
            return;
        }
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
    };

    // Server Function
    const loginUser = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, data);
            // console.log("Response:", response);
            return response.data;
        } catch (error) {

            console.error("Error:", error);
        }
    };

    return (
        <>
            <Header user={user} linkUrl="/" linkText="Home" />

            <section id="authentication">
                <div className="authentication">
                    <h2>
                        <span>Login</span> Back
                    </h2>

                    <div
                        className={
                            validationError.active
                                ? "errortext active"
                                : "errortext"
                        }
                    >
                        <p>{validationError.message}</p>
                        <i
                            className="bx bx-x closeBtn"
                            onClick={() => {
                                setValidationError({
                                    message: "",
                                    active: false,
                                });
                            }}
                        ></i>
                    </div>

                    <form onSubmit={formSubmitAction}>
                        <div className="form-field">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={loginUserData.username}
                                onChange={inputOnChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginUserData.password}
                                onChange={inputOnChange}
                            />
                        </div>

                        <button type="submit">Sign In</button>
                    </form>

                    <hr />
                    <p>
                        Don’t have an account?
                        <Link to="/register" className="link" role="button">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </section>

            <div className="bg-pattern"></div>
        </>
    );
}
