import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "./Header";

import API_URL from "../utils/API_URL";
import { entryObj } from "../utils/entry";
import "../styles/newEntry.css";

export default function NewEntry() {
	const navigate = useNavigate();

	const [user, setUser] = useState(null);

	const [entryData, setEntryData] = useState(entryObj);

	const [validationError, setValidationError] = useState({
		message: "",
		active: false,
	});

	useEffect(() => {
		document.title = "New Entry | DairyLogs";

		const user = JSON.parse(localStorage.getItem("user"));
		if (user) {
			setUser(user);
		} else {
			navigate("/login");
		}
	}, []);

	// Input Field Update Function
	const inputOnChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		setEntryData({
			...entryData,
			[name]: value,
		});
	};

	// Form Submit Function
	const formSubmitAction = (event) => {
		event.preventDefault();

		const payload = {
			...entryData,
			user: user,
			timestamp: new Date().toISOString(),
		};

		const validationCheck = handleEntryVaidation();
		if (validationCheck) {
			saveEntry(payload);
		}
	};

	// Entry Validation Function
	const handleEntryVaidation = () => {
		if (entryData.entry.trim() === "") {
			setValidationError({
				message: "Entry Topic Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else {
			return true;
		}
	};

	// Server Function
	const saveEntry = async (data) => {
		try {
			console.log(data);
			const response = await axios.post(`${API_URL}/api/newentry`, data);
			// console.log("Response:", response);
            navigate("/entries");
			return response.data;
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<>
			<Header user={user} linkUrl="/" linkText="Home" />

			<section id="entries" className="newEntry">
				<div className="entries_banner">
					<form onSubmit={formSubmitAction}>
						<div className="entries_header">
							<h2>
								<span>Entry</span> Name
							</h2>
							<button type="submit" name="submit">
								<span>Add Now</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 448 512"
									fill="currentColor"
								>
									<path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z" />
								</svg>
							</button>
						</div>

						<div className="entry_input">
							<label htmlFor="entry">
								Enter your topic name below:
							</label>
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
							<input
								type="text"
								id="entry"
								placeholder="Type here..."
								name="entry"
								value={entryData.entry}
								onChange={inputOnChange}
							/>
							<input
								type="hidden"
								id="timestamp"
								name="timestamp"
								value={entryData.timestamp}
								readOnly
							/>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}
