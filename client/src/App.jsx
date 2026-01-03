import "./styles/settings.css";

import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Entries from "./components/Entries";
import NewEntry from "./components/NewEntry";
import EntryDetails from "./components/EntryDetails";
import NewEntryDetail from "./components/NewEntryDetail";
import Error from "./helpers/ErrorPage";
import MaintenanceMode from "./helpers/MaintenancePage";

export default function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/entries" element={<Entries />} />
				<Route path="/:username/entry" element={<Entries />} />
				<Route
					path="/:username/entry/:entryId"
					element={<EntryDetails />}
				/>
				<Route path="/:username/entry/new" element={<NewEntry />} />
				<Route
					path="/:username/entry/edit/:entryId"
					element={<NewEntry />}
				/>
				<Route
					path="/:username/entry/:entryId/new"
					element={<NewEntryDetail />}
				/>
				<Route
					path="/:username/entry/:entryId/edit/:entryDetailId"
					element={<NewEntryDetail />}
				/>
				<Route path="/maintenance" element={<MaintenanceMode />} />
				<Route path="*" element={<Error />} />
			</Routes>
		</>
	);
}
