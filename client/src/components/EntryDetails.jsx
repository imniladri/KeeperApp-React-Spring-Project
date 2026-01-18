import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Header from "../helpers/NavHeader";
import ConfirmModal from "../helpers/ConfirmModal";
import LoadingSkeleton from "../helpers/LoadingSkeleton";

import apiClient from "../api/apiClient";
import apiErrorHandler from "../utils/apiErrorHandler";
import "../styles/entryDetails.css";

export default function EntryDetails() {
	const headerProps = {
		auth: [{ link: "/entries", text: "Entries" }],
		noAuth: [{ link: "/login", text: "Login" }],
	};

	const navigate = useNavigate();

	const [user, setUser] = useState(null);
	const [entryData, setEntryData] = useState(null);
	const [entryDetails, setEntryDetails] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [actionInProgress, setActionInProgress] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [selectedEntryDetailId, setSelectedEntryDetailId] = useState(null);

	const { username, entryId } = useParams();

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
		document.title = "All Entry Details | DiaryLogs";

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

		const fetchEntryData = async () => {
			const data = await getEntryData(entryId);
			setEntryData(data || null);

			if (data.status === 404) {
				navigate("/entries", {
					state: {
						message: "Entry not found or deleted.",
						type: "error",
					},
				});
				return;
			}
		};

		const fetchEntryDetails = async () => {
			const data = await getEntryDetails(entryId);
			setEntryDetails(data || []);
		};

		Promise.all([fetchEntryData(), fetchEntryDetails()]).finally(() =>
			setIsLoading(false),
		);
	}, [entryId, navigate]);

	const isBootLoading = isLoading || !entryData;

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
			if (apiErrorMsg.type === "NETWORK") {
				navigate("/");
			}

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
	const getEntryDetails = async (entryId) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.get(
				`/api/entry/details/${entryId}`,
			);
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

			if (apiErrorMsg.type === "NOT_FOUND") {
				navigate("/entries");
			}
			return;
		} finally {
			setActionInProgress(false);
		}
	};

	// Server Function
	const handleDeleteEntryDetail = async (entryDetailId) => {
		setActionInProgress(true);

		try {
			const response = await apiClient.delete(
				`/api/entry/delete/detail/${entryDetailId}`,
			);

			if (response.data === true) {
				// Remove deleted item from state (NO page reload)
				setEntryDetails((prev) =>
					prev.filter((d) => d.entryDetailId !== entryDetailId),
				);
				setValidationSuccess({
					message: "Entry Detail Deleted Successfully!",
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

			<section id="entryDetails">
				<div className="entryDetails_banner">
					{user &&
						(isBootLoading ? (
							<LoadingSkeleton />
						) : entryDetails.length === 0 ? (
							<EntryDetailsEmpty
								username={username}
								entryId={entryId}
								entryData={entryData}
								isLoading={isLoading}
							/>
						) : (
							<EntryDetailsNotEmpty
								username={username}
								entryId={entryId}
								entryData={entryData}
								entryDetails={entryDetails}
								onDelete={handleDeleteEntryDetail}
								validationSuccess={validationSuccess}
								setValidationSuccess={setValidationSuccess}
								validationError={validationError}
								setValidationError={setValidationError}
								actionInProgress={actionInProgress}
								showConfirmModal={showConfirmModal}
								setShowConfirmModal={setShowConfirmModal}
								selectedEntryDetailId={selectedEntryDetailId}
								setSelectedEntryDetailId={
									setSelectedEntryDetailId
								}
							/>
						))}
				</div>
			</section>

			<div className="bg-pattern"></div>
		</>
	);
}

function EntryDetailsEmpty({ username, entryId, entryData, isLoading }) {
	return (
		<>
			<div className="entryDetails_header">
				<h2>
					<span>Entry Name</span>
					{entryData ? entryData.entry : "Loading..."}
				</h2>
			</div>

			<div className="entryDetails_body">
				<Link
					to={`/${username}/entry/${entryId}/new`}
					className="entryDetails_empty"
				>
					<img src="/img/empty-folder.svg" alt="Empty" />
					<p>No details have been added yet for this Entry.</p>
				</Link>
			</div>
		</>
	);
}

function EntryDetailsNotEmpty({
	username,
	entryId,
	entryData,
	entryDetails,
	onDelete,
	validationSuccess,
	setValidationSuccess,
	validationError,
	setValidationError,
	actionInProgress,
	showConfirmModal,
	setShowConfirmModal,
	selectedEntryDetailId,
	setSelectedEntryDetailId,
}) {
	return (
		<>
			<div className="entryDetails_header">
				<h2>
					<span>Entry</span>
					{entryData ? entryData.entry : "Loading..."}
				</h2>

				<Link to={`/${username}/entry/${entryId}/new`}>
					<span>Add New Details</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 576 512"
						fill="currentColor"
					>
						<path d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V198.6C310.1 219.5 256 287.4 256 368C256 427.1 285.1 479.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256zM288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368zM448 303.1C448 295.2 440.8 287.1 432 287.1C423.2 287.1 416 295.2 416 303.1V351.1H368C359.2 351.1 352 359.2 352 367.1C352 376.8 359.2 383.1 368 383.1H416V431.1C416 440.8 423.2 447.1 432 447.1C440.8 447.1 448 440.8 448 431.1V383.1H496C504.8 383.1 512 376.8 512 367.1C512 359.2 504.8 351.1 496 351.1H448V303.1z" />
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

			<div className="entryDetails_body">
				{entryDetails.map((detail) => (
					<div
						className="card entryDetails_content"
						key={detail.entryDetailId}
					>
						<div className="card-header">
							<h6>
								{detail.updateTimestamp !==
								detail.createTimestamp ? (
									<>
										<span>Updated On</span>
										{new Date(detail.updateTimestamp)
											.toLocaleString("en-IN", {
												month: "short",
												day: "2-digit",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
												hour12: false,
												timeZone: "UTC",
												timeZoneName: "short",
											})
											.replace(",", "")}
									</>
								) : (
									<>
										<span>Created On</span>
										{new Date(detail.createTimestamp)
											.toLocaleString("en-IN", {
												month: "short",
												day: "2-digit",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
												hour12: false,
												timeZone: "UTC",
												timeZoneName: "short",
											})
											.replace(",", "")}
									</>
								)}
							</h6>

							<div className="actionButtons">
								<Link
									to={`/${username}/entry/${entryId}/edit/${detail.entryDetailId}`}
								>
									<span>Edit Entry Detail</span>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										fill="currentColor"
									>
										<path d="M373.1 24.97C401.2-3.147 446.8-3.147 474.9 24.97L487 37.09C515.1 65.21 515.1 110.8 487 138.9L289.8 336.2C281.1 344.8 270.4 351.1 258.6 354.5L158.6 383.1C150.2 385.5 141.2 383.1 135 376.1C128.9 370.8 126.5 361.8 128.9 353.4L157.5 253.4C160.9 241.6 167.2 230.9 175.8 222.2L373.1 24.97zM440.1 58.91C431.6 49.54 416.4 49.54 407 58.91L377.9 88L424 134.1L453.1 104.1C462.5 95.6 462.5 80.4 453.1 71.03L440.1 58.91zM203.7 266.6L186.9 325.1L245.4 308.3C249.4 307.2 252.9 305.1 255.8 302.2L390.1 168L344 121.9L209.8 256.2C206.9 259.1 204.8 262.6 203.7 266.6zM200 64C213.3 64 224 74.75 224 88C224 101.3 213.3 112 200 112H88C65.91 112 48 129.9 48 152V424C48 446.1 65.91 464 88 464H360C382.1 464 400 446.1 400 424V312C400 298.7 410.7 288 424 288C437.3 288 448 298.7 448 312V424C448 472.6 408.6 512 360 512H88C39.4 512 0 472.6 0 424V152C0 103.4 39.4 64 88 64H200z" />
									</svg>
								</Link>

								<button
									type="button"
									className="deleteBtn"
									onClick={() => {
										setSelectedEntryDetailId(
											detail.entryDetailId,
										);
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
						<div className="card-body">
							<p>{detail.entryContent}</p>
						</div>
					</div>
				))}
			</div>

			<ConfirmModal
				isActive={showConfirmModal}
				title="Delete Entry Detail"
				message="This action cannot be undone. Are you sure you want to delete this entry detail?"
				confirmText={actionInProgress ? "Deleting..." : "Delete"}
				onConfirm={() => onDelete(selectedEntryDetailId)}
				onCancel={() => setShowConfirmModal(false)}
			/>
		</>
	);
}
