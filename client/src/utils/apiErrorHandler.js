export default function apiErrorHandler(error) {
	// 🚫 Server down / CORS / Network
	if (error.code === "ERR_NETWORK") {
		return {
			type: "NETWORK",
			message: "Server is not reachable. Please try again later.",
		};
	}

	// 🚫 Timeout
	if (error.code === "ECONNABORTED") {
		return {
			type: "TIMEOUT",
			message: "Request timed out. Please retry.",
		};
	}

	if (!error.response) {
		return {
			type: "UNKNOWN",
			message: "Unexpected error occurred.",
		};
	}

	const { status, data } = error.response;

	if (status === 401) {
		return {
			type: "UNAUTHORIZED",
			message: "Session expired. Please login again.",
		};
	}

	if (status === 403) {
		return {
			type: "FORBIDDEN",
			message: "You are not allowed to perform this action.",
		};
	}

	if (status === 404) {
		return {
			type: "NOT_FOUND",
			message: "Requested resource not found.",
		};
	}

	if (status >= 500) {
		return {
			type: "SERVER",
			message: "Server error. Please try again later.",
		};
	}

	return {
		type: "ERROR",
		message: data?.message || "Something went wrong.",
	};
}
