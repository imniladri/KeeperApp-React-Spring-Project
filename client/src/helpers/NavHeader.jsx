import "../styles/header.css";

import { Link, useNavigate } from "react-router-dom";

export default function Header(props) {
	return (
		<header id="header">
			<nav>
				<div className="nav-brand">
					<Link to="/">
						<img src="/img/logo-light.svg" alt="Logo" />
						<span>DiaryLogs</span>
					</Link>
				</div>

				<div className="nav-items">
					{props.user ? (
						<HeaderUserAuthorised
							headerProps={props.headerProps.auth}
						/>
					) : (
						<HeaderUserUnAuthorised
							headerProps={props.headerProps.noAuth}
						/>
					)}
				</div>
			</nav>
		</header>
	);
}

function HeaderUserUnAuthorised(props) {
	return (
		<>
			{props.headerProps
				? props.headerProps.map((item, index) => (
						<Link to={item.link} className="nav-btn" key={index}>
							{item.text}
						</Link>
				  ))
				: null}
		</>
	);
}

function HeaderUserAuthorised(props) {
	const navigate = useNavigate();

	const logoutUser = () => {
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<>
			<Link to="/maintenance" className="nav-btn icon-btn"> {/* /dashboard */}
				<i className="bx bxs-user"></i>
			</Link>

			{props.headerProps
				? props.headerProps.map((item, index) => (
						<Link to={item.link} className="nav-btn" key={index}>
							{item.text}
						</Link>
				  ))
				: null}

			<button className="nav-btn" role="button" onClick={logoutUser}>
				Logout
			</button>
		</>
	);
}
