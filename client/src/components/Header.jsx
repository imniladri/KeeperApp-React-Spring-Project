import "../styles/header.css";

import { Link, useNavigate } from "react-router-dom";

export default function Header(props) {
    return (
        <header id="header">
            <nav>
                <div className="nav-brand">
                    <Link to="/">
                        <img src="/img/logo-light.svg" alt="Logo" />
                        <span>DairyLogs</span>
                    </Link>
                </div>

                <div className="nav-items">
                    {props.user ? (
                        <HeaderUserAuthorised />
                    ) : (
                        <HeaderUserUnAuthorised
                            linkUrl={props.linkUrl}
                            linkText={props.linkText}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
}

function HeaderUserUnAuthorised(props) {
    return (
        <Link to={props.linkUrl} className="nav-btn">
            {props.linkText}
        </Link>
    );
}

function HeaderUserAuthorised() {
    const navigate = useNavigate();

    const logoutUser = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <>
            <Link to="/dashboard" className="nav-btn">
                <i className="bx bxs-user"></i>
            </Link>
            <button className="nav-btn" role="button" onClick={logoutUser}>
                Logout
            </button>
        </>
    );
}
