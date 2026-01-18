import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "../helpers/NavHeader";
import ConfirmModal from "../helpers/ConfirmModal";

import apiClient from "../api/apiClient";
import apiErrorHandler from "../utils/apiErrorHandler";
import { entryObj } from "../utils/entry";
import "../styles/newEntry.css";

export default function NewEntry() {
	const headerProps = {
		auth: [{ link: "/entries", text: "Entries" }],
		noAuth: [{ link: "/login", text: "Login" }],
	};

	const navigate = useNavigate();
	const { username, entryId } = useParams();
	const isEditMode = Boolean(entryId);
	const MAX_LENGTH = 250;

	const [user, setUser] = useState(null);
	const [entryData, setEntryData] = useState(entryObj);
	const [actionInProgress, setActionInProgress] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const [validationError, setValidationError] = useState({
		message: "",
		active: false,
	});

	const [validationWarning, setValidationWarning] = useState({
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

	useEffect(() => {
		if (!validationWarning.active) return;

		const timer = setTimeout(() => {
			setValidationWarning({ message: "", active: false });
		}, 3000);

		return () => clearTimeout(timer);
	}, [validationWarning.active]);

	useEffect(() => {
		document.title = isEditMode
			? "Edit Entry | DiaryLogs"
			: "New Entry | DiaryLogs";

		const user = JSON.parse(localStorage.getItem("user"));

		if (!user || user.username !== username) {
			localStorage.removeItem("user");
			navigate("/login", {
				state: {
					message: "Invalid User Detected.",
					type: "error",
				},
			});
			return;
		}

		setUser(user);

		if (isEditMode && entryId) {
			const fetchEntryData = async () => {
				const data = await getEntryData(entryId);
				setEntryData(data || null);
			};

			fetchEntryData();
		}
	}, [isEditMode, entryId, navigate]);

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

		if (!handleEntryVaidation()) return;

		if (isEditMode) {
			editEntry();
		} else {
			createEntry();
		}
	};

	// Create Entry Logic Function
	const createEntry = () => {
		const currentDate = new Date().toISOString();

		const payload = {
			...entryData,
			user: user,
			createTimestamp: currentDate,
			updateTimestamp: currentDate,
		};

		const validationCheck = handleEntryVaidation();
		if (validationCheck) {
			saveEntry(payload);
		}
	};

	// Edit Entry Logic Function
	const editEntry = () => {
		const payload = {
			...entryData,
			entryId: entryId,
			updateTimestamp: new Date().toISOString(),
		};

		const validationCheck = handleEntryVaidation();
		if (validationCheck) {
			updateEntry(payload);
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
		} else if (entryData.entry.length > MAX_LENGTH) {
			setValidationWarning({
				message: `Entry name cannot exceed ${MAX_LENGTH} characters`,
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
		setActionInProgress(true);

		try {
			const response = await apiClient.post(`/api/entry/new`, data);
			// console.log("Response:", response);
			navigate("/entries");
			return response.data;
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});
			window.scrollTo(0, 0);
		} finally {
			setActionInProgress(false);
		}
	};

	// Server Function
	const updateEntry = async (data) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.put(
				`/api/entry/edit/${entryId}`,
				data,
			);
			// console.log("Response:", response);
			navigate(`/${username}/entry`);
			return response.data;
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});
			window.scrollTo(0, 0);
		} finally {
			setActionInProgress(false);
		}
	};

	// Server Function
	const deleteEntry = async () => {
		setActionInProgress(true);

		try {
			const response = await apiClient.delete(
				`/api/entry/delete/${entryId}`,
			);

			if (response.data === true) {
				navigate(`/${username}/entry`);
			} else {
				setValidationError({
					message: "Error Deleting Entry. Please Try Again!",
					active: true,
				});
				window.scrollTo(0, 0);
			}
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});
			window.scrollTo(0, 0);
		} finally {
			setActionInProgress(false);
			setShowConfirmModal(false);
		}
	};

	// Server Function
	const getEntryData = async (entryId) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.get(`/api/entry/id/${entryId}`);
			// console.log("Response:", response);
			return response.data;
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});
			window.scrollTo(0, 0);

			if (apiErrorMsg.type === "NOT_FOUND") {
				navigate("/entries");
			}
			return;
		} finally {
			setActionInProgress(false);
		}
	};

	return (
		<>
			<Header user={user} headerProps={headerProps} />

			<section id="newEntry" className="newEntry">
				<div className="newEntry_banner">
					<form onSubmit={formSubmitAction}>
						<div className="newEntry_header">
							<h2>
								<span>Entry</span> Name{" "}
								{isEditMode ? "Update" : "New"}
							</h2>

							<div className="actionButtons">
								<button
									type="submit"
									name="submit"
									disabled={actionInProgress}
								>
									<span>
										{isEditMode
											? actionInProgress
												? "Updating..."
												: "Update Entry"
											: actionInProgress
												? "Adding..."
												: "Add Entry"}
									</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
										fill="currentColor"
									>
										<path d="M384 32C419.3 32 448 60.65 448 96V416C448 451.3 419.3 480 384 480H64C28.65 480 0 451.3 0 416V96C0 60.65 28.65 32 64 32H384zM339.8 211.8C350.7 200.9 350.7 183.1 339.8 172.2C328.9 161.3 311.1 161.3 300.2 172.2L192 280.4L147.8 236.2C136.9 225.3 119.1 225.3 108.2 236.2C97.27 247.1 97.27 264.9 108.2 275.8L172.2 339.8C183.1 350.7 200.9 350.7 211.8 339.8L339.8 211.8z" />
									</svg>
								</button>

								{isEditMode && (
									<>
										<button
											type="button"
											className="deleteBtn"
											onClick={() =>
												setShowConfirmModal(true)
											}
											disabled={actionInProgress}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 640 640"
												fill="currentColor"
											>
												<path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
											</svg>
										</button>

										<ConfirmModal
											isActive={showConfirmModal}
											title="Delete Entry & its Details"
											message="This action cannot be undone. Are you sure you want to delete this entry & its details?"
											confirmText={
												actionInProgress
													? "Deleting..."
													: "Delete"
											}
											onConfirm={deleteEntry}
											onCancel={() =>
												setShowConfirmModal(false)
											}
										/>
									</>
								)}
							</div>
						</div>

						<div className="newEntry_input">
							<div className="inputFields">
								<label htmlFor="entry">
									Enter your topic name below:
								</label>

								<label
									className={`charCounter ${
										entryData.entry.length > MAX_LENGTH
											? "warning"
											: ""
									}`}
								>
									{entryData.entry.length > MAX_LENGTH
										? "Character Exceeded! "
										: "Character: "}
									{entryData.entry.length}/{MAX_LENGTH}
								</label>
							</div>

							<div
								className={
									validationError.active
										? "errortext active"
										: "errortext"
								}
							>
								<p className="errormsg">
									{validationError.message}
								</p>
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
									validationWarning.active
										? "warningtext active"
										: "warningtext"
								}
							>
								<p className="warningmsg">
									{validationWarning.message}
								</p>
								<i
									className="bx bx-x closeBtn"
									onClick={() => {
										setValidationWarning({
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
								id="createTimestamp"
								name="createTimestamp"
								value={entryData.createTimestamp}
								readOnly
							/>
							<input
								type="hidden"
								id="updateTimestamp"
								name="updateTimestamp"
								value={entryData.updateTimestamp}
								readOnly
							/>
						</div>
					</form>
				</div>
			</section>

			<div className="bg-pattern"></div>
		</>
	);
}
