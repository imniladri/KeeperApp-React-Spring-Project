import "../styles/home.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../helpers/NavHeader";

export default function Home() {
	const headerProps = {
		auth: [{ link: "/entries", text: "Entries" }],
		noAuth: [{ link: "/login", text: "Login" }],
	};

	const [user, setUser] = useState(null);

	useEffect(() => {
		document.title = "Diary Logs";

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setUser(user);
		}
	}, []);

	return (
		<>
			<Header user={user} headerProps={headerProps} />

			<section id="home">
				<div className="home-banner">
					<div className="banner-content">
						{user ? <HelloUser name={user.name} /> : null}
						<h2>
							Track your <span>Daily Entries</span>
						</h2>
						<p>
							Make your own daily diary logs, and keep a list of
							the everyday doings. No need of pen or paper
							anymore. Write anything anywhere anytime. Just Get
							Started!
						</p>
						{user ? (
							<HomeUserAuthorised />
						) : (
							<HomeUserUnAuthorised />
						)}
					</div>

					<div className="banner-image">
						<img
							src="/img/banner-img.svg"
							alt="Learning Logs Banner"
						/>
					</div>
				</div>
			</section>
		</>
	);
}

function HelloUser(props) {
	return (
		<h5>
			Welcome! <span>{props.name}</span>
		</h5>
	);
}

function HomeUserUnAuthorised() {
	return (
		<>
			<Link to="/register" className="btn" role="button">
				Get Started
			</Link>
			<p className="link-text">
				Already had an account?
				<Link to="/login" role="button">
					Login Here!
				</Link>
			</p>
		</>
	);
}

function HomeUserAuthorised() {
	return (
		<>
			<Link to="/entries" className="btn" role="button">
				Your Entries
			</Link>
		</>
	);
}
