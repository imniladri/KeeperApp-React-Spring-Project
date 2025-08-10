import "../styles/error.css";

import { Link } from "react-router-dom";

export default function Error() {
    return (
        <div className="error-banner">
            <img src="/img/error.svg" alt="Error Image" />
            <h2>
                Oops! <span>Error 404</span>
            </h2>
            <p>The item you requested is not available.</p>
            <Link to="/">Home</Link>
        </div>
    );
}
