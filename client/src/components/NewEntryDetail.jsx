import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "../helpers/NavHeader";
import Footer from "../helpers/Footer";
import ConfirmModal from "../helpers/ConfirmModal";

import apiClient from "../api/apiClient";
import apiErrorHandler from "../utils/apiErrorHandler";
import { entryDetailObj } from "../utils/entryDetail";
import "../styles/newEntryDetail.css";

export default function NewEntryDetail() {
	const navigate = useNavigate();
	const { username, entryId, entryDetailId } = useParams();
	const isEditMode = Boolean(entryDetailId);
	const MAX_LENGTH = 10000;

	const headerProps = {
		auth: [
			{ link: "/entries", text: "Entries" },
			{
				link: `/${username}/entry/${entryId}`,
				text: "Entry Details",
			},
		],
		noAuth: [{ link: "/login", text: "Login" }],
	};

	const [user, setUser] = useState(null);
	const [entryData, setEntryData] = useState(null);
	const [entryDetailData, setEntryDetailData] = useState(entryDetailObj);
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
			? "Edit Entry Detail | DiaryLogs"
			: "New Entry Detail | DiaryLogs";

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

		if (isEditMode && entryDetailId) {
			const fetchEntryDetailData = async () => {
				const data = await getEntryDetailData(entryDetailId);
				setEntryDetailData(data || null);
			};

			fetchEntryDetailData();
		}

		const fetchEntryData = async () => {
			const data = await getEntryData(entryId);
			setEntryData(data || null);
		};

		fetchEntryData();
	}, [isEditMode, entryDetailId, entryId, navigate]);

	// Input Field Update Function
	const inputOnChange = (event) => {
		const name = event.target.name;
		const value = event.target.value;

		setEntryDetailData({
			...entryDetailData,
			[name]: value,
		});
	};

	// Form Submit Function
	const formSubmitAction = (event) => {
		event.preventDefault();

		if (!handleEntryDetailsValidation()) return;

		if (isEditMode) {
			editEntryDetail();
		} else {
			createEntryDetail();
		}
	};

	// Create Entry Details Logic Function
	const createEntryDetail = () => {
		const currentDate = new Date().toISOString();

		const payload = {
			...entryDetailData,
			entry: entryData,
			createTimestamp: currentDate,
			updateTimestamp: currentDate,
		};

		const validationCheck = handleEntryDetailsValidation();
		if (validationCheck) {
			saveEntryDetail(payload);
		}
	};

	// Edit Entry Details Logic Function
	const editEntryDetail = () => {
		const payload = {
			...entryDetailData,
			entryDetailId: entryDetailId,
			updateTimestamp: new Date().toISOString(),
		};

		const validationCheck = handleEntryDetailsValidation();
		if (validationCheck) {
			updateEntryDetail(payload);
		}
	};

	// Entry Validation Function
	const handleEntryDetailsValidation = () => {
		if (entryDetailData.entryContent.trim() === "") {
			setValidationError({
				message: "Entry Details Required!",
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else if (entryDetailData.entryContent.length > MAX_LENGTH) {
			setValidationWarning({
				message: `Entry detail cannot exceed ${MAX_LENGTH} characters`,
				active: true,
			});
			window.scrollTo(0, 0);
			return false;
		} else {
			return true;
		}
	};

	// Server Function
	const saveEntryDetail = async (data) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.post(
				`/api/entry/new/detail`,
				data,
			);
			// console.log("Response:", response);
			navigate(`/${username}/entry/${entryId}`);
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
	const updateEntryDetail = async (data) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.put(
				`/api/entry/edit/detail/${entryDetailId}`,
				data,
			);
			// console.log("Response:", response);
			navigate(`/${username}/entry/${entryId}`);
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
	const deleteEntryDetail = async () => {
		setActionInProgress(true);

		try {
			const response = await apiClient.delete(
				`/api/entry/delete/detail/${entryDetailId}`,
			);

			if (response.data === true) {
				navigate(`/${username}/entry/${entryId}`);
			} else {
				setValidationError({
					message: "Error Deleting Entry Detail. Please Try Again!",
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

	// Server Function
	const getEntryDetailData = async (entryDetailId) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.get(
				`/api/entry/detail/id/${entryDetailId}`,
			);
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

			<section id="newEntryDetail" className="newEntryDetail">
				<div className="newEntryDetail_banner">
					<form onSubmit={formSubmitAction}>
						<div className="newEntryDetail_header">
							<h2>
								<Link to={`/${username}/entry/${entryId}`}>
									{entryData ? entryData.entry : "Loading..."}
								</Link>
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
												: "Update Entry Detail"
											: actionInProgress
												? "Saving..."
												: "Save Entry Detail"}
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
											title="Delete Entry Detail"
											message="This action cannot be undone. Are you sure you want to delete this entry detail?"
											confirmText={
												actionInProgress
													? "Deleting..."
													: "Delete"
											}
											onConfirm={deleteEntryDetail}
											onCancel={() =>
												setShowConfirmModal(false)
											}
										/>
									</>
								)}
							</div>
						</div>

						<div className="newEntryDetail_input">
							<div className="inputFields">
								<label htmlFor="entryContent">
									Add new details for{" "}
									<span>
										{entryData
											? entryData.entry
											: "Loading..."}
									</span>{" "}
									below:
								</label>

								<label
									className={`charCounter ${
										entryDetailData.entryContent.length >
										MAX_LENGTH
											? "warning"
											: ""
									}`}
								>
									{entryDetailData.entryContent.length >
									MAX_LENGTH
										? "Character Exceeded! "
										: "Character: "}
									{entryDetailData.entryContent.length}/
									{MAX_LENGTH}
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

							<textarea
								id="entryContent"
								name="entryContent"
								placeholder="Type here..."
								value={entryDetailData.entryContent}
								onChange={inputOnChange}
								rows={
									entryDetailData.entryContent.split("\n")
										.length < 10
										? entryDetailData.entryContent.split(
												"\n",
											).length + 10
										: 20
								}
							></textarea>

							<input
								type="hidden"
								id="createTimestamp"
								name="createTimestamp"
								value={entryDetailData.createTimestamp}
								readOnly
							/>
							<input
								type="hidden"
								id="updateTimestamp"
								name="updateTimestamp"
								value={entryDetailData.updateTimestamp}
								readOnly
							/>
						</div>
					</form>
				</div>
			</section>

            <Footer />

			<div className="bg-pattern"></div>
		</>
	);
}
