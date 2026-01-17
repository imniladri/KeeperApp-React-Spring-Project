import axios from "axios";

import API_URL from "./API_URL";

const apiClient = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	withCredentials: true,
});

export default apiClient;
