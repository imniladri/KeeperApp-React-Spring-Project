import "../styles/maintenance.css";

import { Link } from "react-router-dom";

export default function MaintenanceMode() {
	return (
		<div className="maintenance-banner">
			<img src="/img/maintenance.svg" alt="Maintenance Mode Image" />
			<h2>
				Oops! This Page is under <span>Maintenance Mode</span>
			</h2>
			<p>Please check back later. Thank You.</p>
			<Link to="/">Home</Link>
		</div>
	);
}
