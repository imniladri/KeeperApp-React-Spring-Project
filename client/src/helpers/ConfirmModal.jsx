import "../styles/modal.css";

export default function ConfirmModal({
	isActive,
	title = "Confirm Action",
	message = "Are you sure you want to proceed?",
	confirmText = "Confirm",
	cancelText = "Cancel",
	onConfirm,
	onCancel,
	actionInProgress,
}) {
	if (!isActive) return null;

	return (
		<>
			<section
				className={isActive ? "modalOverlay active" : "modalOverlay"}
			>
				<div className="modalBox">
					<h3 className="modalHead">{title}</h3>
					<p className="modalPara">{message}</p>

					<div className="modalActions">
						<button
							type="button"
							className="btn cancel"
							onClick={onCancel}
							disabled={actionInProgress}
						>
							{cancelText}
						</button>

						<button
							type="button"
							className="btn confirm"
							onClick={onConfirm}
							disabled={actionInProgress}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</section>
		</>
	);
}
