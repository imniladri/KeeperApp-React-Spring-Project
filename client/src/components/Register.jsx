import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../helpers/NavHeader";

import API_URL from "../utils/API_URL";
import { userObj } from "../utils/user";
import "../styles/auth.css";

export default function Register() {
	const headerProps = {
		auth: [{ link: "/", text: "Home" }],
		noAuth: [
			{ link: "/login", text: "Login" },
			{ link: "/", text: "Home" },
		],
	};

	const navigate = useNavigate();

	const [user, setUser] = useState(null);

	useEffect(() => {
		document.title = "Registration | DiaryLogs";

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setUser(user);
			navigate("/");
		}
	}, []);

	const [registerUserData, setRegisterUserData] = useState(userObj);

	const [validationError, setValidationError] = useState({
		message: "",
		active: false,
	});

	const [validationSuccess, setValidationSuccess] = useState({
		message: "",
		active: false,
	});

	// Input Field Update Function
	const inputOnChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		setRegisterUserData({
			...registerUserData,
			[name]: value,
		});
	};

	// Form Submit Function
	const formSubmitAction = (event) => {
		event.preventDefault();

		const payload = {
			...registerUserData,
			timestamp: new Date().toISOString(),
		};

		const validationCheck = handleRegister();
		if (validationCheck) {
			registerUser(payload);
		}
	};

	// Register Validation Function
	const handleRegister = () => {
		if (registerUserData.name.trim() === "") {
			setValidationError({
				message: "Your Name Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else if (registerUserData.email.trim() === "") {
			setValidationError({
				message: "Your Email Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else if (registerUserData.username.trim() === "") {
			setValidationError({
				message: "Username Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else if (registerUserData.password.trim() === "") {
			setValidationError({
				message: "Password Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else if (registerUserData.dob.trim().length === 0) {
			setValidationError({
				message: "Your DOB Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else {
			return true;
		}
	};

	// Server Function
	const registerUser = async (data) => {
		try {
			const isEmailExist = await axios.get(
				`${API_URL}/api/user/validate/email/${data.email}`
			);
			const isUsernameExist = await axios.get(
				`${API_URL}/api/user/validate/username/${data.username}`
			);

			if (
				isEmailExist.data.status === 400 ||
				isUsernameExist.data.status === 400
			) {
				setValidationError({
					message: "Internal Server Error. Please try again later.",
					active: true,
				});
				window.scrollTo(0, 0);
				return;
			}

			if (isEmailExist.data) {
				setValidationError({
					message: "Email Already Registered!",
					active: true,
				});
				window.scrollTo(0, 0);
				return;
			}
			if (isUsernameExist.data) {
				setValidationError({
					message: "Username Already Registered!",
					active: true,
				});
				window.scrollTo(0, 0);
				return;
			}

			const response = await axios.post(
				`${API_URL}/api/user/register`,
				data
			);
			// console.log("Response:", response);
			if (
				response.data.username === registerUserData.username &&
				response.data !== null
			) {
				setValidationSuccess({
					message: "Registration Successful! Redirecting to Login...",
					active: true,
				});
				window.scrollTo(0, 0);
				setTimeout(() => {
					navigate("/login");
				}, 3000);
			} else if (response.data.status === 400) {
				setValidationError({
					message: "Internal Server Error. Please try again later.",
					active: true,
				});
				window.scrollTo(0, 0);
				return;
			} else {
				setValidationError({
					message: "Registration Failed! Please try again.",
					active: true,
				});
				window.scrollTo(0, 0);
				return;
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<Header user={user} headerProps={headerProps} />

			<section id="authentication">
				<div className="authentication">
					<h2>
						<span>Register</span> a new user
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

					<div
						className={
							validationSuccess.active
								? "successtext active"
								: "successtext"
						}
					>
						<p className="successmsg">{validationSuccess.message}</p>
						<i
							className="bx bx-x closeBtn"
							onClick={() => {
								setValidationSuccess({
									message: "",
									active: false,
								});
							}}
						></i>
					</div>

					<form onSubmit={formSubmitAction}>
						<div className="form-field">
							<label htmlFor="name">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={registerUserData.name}
								onChange={inputOnChange}
							/>
						</div>

						<div className="form-field">
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={registerUserData.email}
								onChange={inputOnChange}
							/>
						</div>

						<div className="form-field">
							<label htmlFor="username">Username</label>
							<input
								type="text"
								id="username"
								name="username"
								value={registerUserData.username}
								onChange={inputOnChange}
							/>
						</div>

						<div className="form-field">
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								value={registerUserData.password}
								onChange={inputOnChange}
							/>
						</div>

						<div className="form-field">
							<label htmlFor="dob">Date of Birth</label>
							<input
								type="date"
								id="dob"
								name="dob"
								value={registerUserData.dob}
								onChange={inputOnChange}
							/>
						</div>

						<input
							type="hidden"
							id="timestamp"
							name="timestamp"
							value={registerUserData.timestamp}
							readOnly
						/>

						<button type="submit">Register Now</button>
					</form>

					<hr />
					<p>
						Already have a account?
						<Link to="/login" className="link" role="button">
							Log In
						</Link>
					</p>
				</div>
			</section>

			<div className="bg-pattern"></div>
		</>
	);
}
