import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import Header from "../helpers/NavHeader";
import Footer from "../helpers/Footer";
import ConfirmModal from "../helpers/ConfirmModal";
import LoadingSkeleton from "../helpers/LoadingSkeleton";

import apiClient from "../api/apiClient";
import apiErrorHandler from "../utils/apiErrorHandler";
import "../styles/entries.css";

export default function Entries() {
	const headerProps = {
		auth: [{ link: "/", text: "Home" }],
		noAuth: [{ link: "/login", text: "Login" }],
	};

	const navigate = useNavigate();
	const location = useLocation();

	const [user, setUser] = useState(null);
	const [userEntires, setUserEntires] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [actionInProgress, setActionInProgress] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedEntryId, setSelectedEntryId] = useState(null);

	const [validationSuccess, setValidationSuccess] = useState({
		message: "",
		active: false,
	});

	const [validationError, setValidationError] = useState({
		message: "",
		active: false,
	});

	useEffect(() => {
		if (!validationSuccess.active) return;

		const timer = setTimeout(() => {
			setValidationSuccess({ message: "", active: false });
		}, 3000);

		return () => clearTimeout(timer);
	}, [validationSuccess.active]);

	useEffect(() => {
		if (!validationError.active) return;

		const timer = setTimeout(() => {
			setValidationError({ message: "", active: false });
		}, 3000);

		return () => clearTimeout(timer);
	}, [validationError.active]);

	useEffect(() => {
		document.title = "All Entries | DiaryLogs";

		const user = JSON.parse(localStorage.getItem("user"));

		if (!user) {
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

		const fetchEntries = async () => {
			try {
				const data = await getUserEntries(user.username);
				setUserEntires(data || []);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEntries();
	}, []);

	useEffect(() => {
		const toastState = location.state;
		if (!toastState?.message) return;

		if (toastState.type === "success") {
			setValidationSuccess({
				message: toastState.message,
				active: true,
			});
		} else {
			setValidationError({
				message: toastState.message,
				active: true,
			});
		}

		// Clear the history state so refresh doesn't trigger again
		window.history.replaceState({}, document.title);
		window.scrollTo(0, 0);
	}, [location.state]);

	// Server Function
	const getUserEntries = async (username) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.get(`/api/entry/user/${username}`);
			// console.log("Response:", response);
			return response.data;
		} catch (error) {
			// console.error("Error:", error);
			const apiErrorMsg = apiErrorHandler(error);
			if (apiErrorMsg.type === "NETWORK") {
				navigate("/");
			}

			setValidationError({
				message: apiErrorMsg.message,
				active: true,
			});
			window.scrollTo(0, 0);

			if (apiErrorMsg.type === "UNAUTHORIZED") {
				navigate("/login");
			}
			return;
		} finally {
			setActionInProgress(false);
		}
	};

	// Server Function
	const handleDeleteEntry = async (entryId) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.delete(
				`/api/entry/delete/${entryId}`,
			);

			if (response.data === true) {
				// Remove deleted item from state (NO page reload)
				setUserEntires((prev) =>
					prev.filter((d) => d.entryId !== entryId),
				);
				setValidationSuccess({
					message: "Entry Deleted Successfully!",
					active: true,
				});
				window.scrollTo(0, 0);
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

	return (
		<>
			<Header user={user} headerProps={headerProps} />

			<section id="entries">
				<div className="entries_banner">
					{user &&
						(isLoading ? (
							<LoadingSkeleton />
						) : userEntires.length === 0 ? (
							<EntriesEmpty user={user} />
						) : (
							<EntriesNotEmpty
								user={user}
								userEntires={userEntires}
								onDelete={handleDeleteEntry}
								validationSuccess={validationSuccess}
								setValidationSuccess={setValidationSuccess}
								validationError={validationError}
								setValidationError={setValidationError}
								actionInProgress={actionInProgress}
								showConfirmModal={showConfirmModal}
								setShowConfirmModal={setShowConfirmModal}
								selectedEntryId={selectedEntryId}
								setSelectedEntryId={setSelectedEntryId}
							/>
						))}
				</div>
			</section>

            <Footer />

			<div className="bg-pattern"></div>
		</>
	);
}

function EntriesEmpty({ user }) {
	return (
		<>
			<div className="entries_header">
				<h2>
					Your Daily <span>Entries</span>
				</h2>
			</div>

			<div className="entries_body">
				<Link
					to={`/${user.username}/entry/new`}
					className="entries_empty"
				>
					<img src="/img/empty-folder.svg" alt="Empty" />
					<p>No new entries have been added yet. Click here to add one.</p>
				</Link>
			</div>
		</>
	);
}

function EntriesNotEmpty({
	user,
	userEntires,
	onDelete,
	validationSuccess,
	setValidationSuccess,
	validationError,
	setValidationError,
	actionInProgress,
	showConfirmModal,
	setShowConfirmModal,
	selectedEntryId,
	setSelectedEntryId,
}) {
	return (
		<>
			<div className="entries_header">
				<h2>
					Your Daily <span>Entries</span>
				</h2>
				<Link to={`/${user.username}/entry/new`}>
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

			<div
				className={
					validationError.active ? "errortext active" : "errortext"
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

			<div className="entries_body">
				<div className="entries_tabs">

                </div>

				{userEntires.map((entry) => (
					<div className="entries_content" key={entry.entryId}>
						<Link
							to={`/${user.username}/entry/${entry.entryId}`}
							className="viewBtn"
						>
							<h3>{entry.entry}</h3>
							<p>
								{entry.updateTimestamp !==
								entry.createTimestamp ? (
									<>
										{new Date(
											entry.updateTimestamp,
										).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
										<span>Updated On</span>
									</>
								) : (
									<>
										{new Date(
											entry.createTimestamp,
										).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
										<span>Created On</span>
									</>
								)}
							</p>
						</Link>

						<div className="actionButtons">
							<Link
								to={`/${user.username}/entry/edit/${entry.entryId}`}
								className="editBtn"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 640"
									fill="currentColor"
								>
									<path d="M128.1 64C92.8 64 64.1 92.7 64.1 128L64.1 512C64.1 547.3 92.8 576 128.1 576L274.3 576L285.2 521.5C289.5 499.8 300.2 479.9 315.8 464.3L448 332.1L448 234.6C448 217.6 441.3 201.3 429.3 189.3L322.8 82.7C310.8 70.7 294.5 64 277.6 64L128.1 64zM389.6 240L296.1 240C282.8 240 272.1 229.3 272.1 216L272.1 122.5L389.6 240zM332.3 530.9L320.4 590.5C320.2 591.4 320.1 592.4 320.1 593.4C320.1 601.4 326.6 608 334.7 608C335.7 608 336.6 607.9 337.6 607.7L397.2 595.8C409.6 593.3 421 587.2 429.9 578.3L548.8 459.4L468.8 379.4L349.9 498.3C341 507.2 334.9 518.6 332.4 531zM600.1 407.9C622.2 385.8 622.2 350 600.1 327.9C578 305.8 542.2 305.8 520.1 327.9L491.3 356.7L571.3 436.7L600.1 407.9z" />
								</svg>
							</Link>

							<button
								type="button"
								className="bookmarkBtn" //isBookmarked
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 640 640"
									fill="currentColor"
								>
									{/* <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" /> */}
									<path d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128zM192 112C183.2 112 176 119.2 176 128L176 515.2L293.4 437C309.5 426.3 330.5 426.3 346.6 437L464 515.2L464 128C464 119.2 456.8 112 448 112L192 112z" />
								</svg>
							</button>

							<button
								type="button"
								className="deleteBtn"
								onClick={() => {
									setSelectedEntryId(entry.entryId);
									setShowConfirmModal(true);
								}}
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
						</div>
					</div>
				))}
			</div>

			<ConfirmModal
				isActive={showConfirmModal}
				title="Delete Entry & its Details"
				message="This action cannot be undone. Are you sure you want to delete this entry & its details?"
				confirmText={actionInProgress ? "Deleting..." : "Delete"}
				onConfirm={() => onDelete(selectedEntryId)}
				onCancel={() => setShowConfirmModal(false)}
				actionInProgress={actionInProgress}
			/>
		</>
	);
}
