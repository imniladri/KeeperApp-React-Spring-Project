import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../helpers/NavHeader";

import apiClient from "../api/apiClient";
import apiErrorHandler from "../utils/apiErrorHandler";

import "../styles/auth.css";

export default function Login() {
	const headerProps = {
		auth: [{ link: "/", text: "Home" }],
		noAuth: [
			{ link: "/register", text: "Register" },
			{ link: "/", text: "Home" },
		],
	};

	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [actionInProgress, setActionInProgress] = useState(false);

	const [loginUserData, setLoginUserData] = useState({
		username: "",
		password: "",
	});

	useEffect(() => {
		document.title = "Login | DiaryLogs";

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setUser(user);
			navigate("/");
		}
	}, []);

	const [validationError, setValidationError] = useState({
		message: "",
		active: false,
	});

	useEffect(() => {
		if (!validationError.active) return;

		const timer = setTimeout(() => {
			setValidationError({ message: "", active: false });
		}, 3000);

		return () => clearTimeout(timer);
	}, [validationError.active]);

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
		if (loginUserData.username === user.username && user !== null) {
			localStorage.setItem("user", JSON.stringify(user));
			navigate("/");
		} else if (user.status === 400) {
			setValidationError({
				message: "Internal Server Error. Please try again later.",
				active: true,
			});
		} else if (user.status === 401) {
			setValidationError({
				message: "Invalid Username or Password. Please try again.",
				active: true,
			});
		} else if (user.status === 404) {
			setValidationError({
				message: "User not found. Please register first.",
				active: true,
			});
		} else {
			setValidationError({
				message:
					"An unexpected error occurred. Please try again later.",
				active: true,
			});
		}
		return;
	};

	// Server Function
	const loginUser = async (data) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.post(`/api/user/login`, data);
			// console.log("Response:", response);
			return response.data;
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});

			if (apiErrorMsg.type === "UNAUTHORIZED") {
				navigate("/login");
			}
			return;
		} finally {
			setActionInProgress(false);
		}
	};

	return (
		<>
			<Header user={user} headerProps={headerProps} />

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
						<p className="errormsg">{validationError.message}</p>
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

						<button type="submit" disabled={actionInProgress}>
							{actionInProgress ? "Signing In..." : "Sign In"}
						</button>
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
