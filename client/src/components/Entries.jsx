import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "./Header";

import API_URL from "../utils/API_URL";
import "../styles/entries.css";

export default function Entries() {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [userEntires, setUserEntires] = useState([]);

	useEffect(() => {
		document.title = "Your Daily Entries | DairyLogs";

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setUser(user);

			const fetchEntries = async () => {
				const data = await getUserEntries(user.username);
				setUserEntires(data || []);
			};

			fetchEntries();
		} else {
			navigate("/login");
		}
	}, []);

	// Server Function
	const getUserEntries = async (data) => {
		try {
			const response = await axios.get(`${API_URL}/api/entries/${data}`);
			// console.log("Response:", response);
			return response.data;
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<Header user={user} linkUrl="/" linkText="Home" />

			<section id="entries">
				<div className="entries_banner">
					{userEntires.length === 0 ? (
						<EntriesEmpty />
					) : (
						<EntriesNotEmpty user={user} userEntires={userEntires} />
					)}
				</div>
			</section>

			<div className="bg-pattern"></div>
		</>
	);
}

function EntriesEmpty() {
	return (
		<>
			<Link to="/newentry" className="entries_empty">
				<img src="/img/empty-folder.svg" alt="Empty" />
				<p>No topics have been added yet.</p>
			</Link>
		</>
	);
}

function EntriesNotEmpty(props) {
	return (
		<>
			<div className="entries_header">
				<h2>
					Your Daily <span>Entries</span>
				</h2>
				<Link to="/newentry">
					<span>Add New Entry</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 448 512"
						fill="currentColor"
					>
						<path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM224 368C237.3 368 248 357.3 248 344V280H312C325.3 280 336 269.3 336 256C336 242.7 325.3 232 312 232H248V168C248 154.7 237.3 144 224 144C210.7 144 200 154.7 200 168V232H136C122.7 232 112 242.7 112 256C112 269.3 122.7 280 136 280H200V344C200 357.3 210.7 368 224 368z" />
					</svg>
				</Link>
			</div>

			<div className="entries_body">
				{props.userEntires.map((entry) => (
					<Link key={entry.entryId} to={`/${props.user.username}/entry/${entry.entryId}`}>
						<h3>{entry.entry}</h3>
						<p>{entry.timestamp}</p>
					</Link>
				))}
			</div>
		</>
	);
}
