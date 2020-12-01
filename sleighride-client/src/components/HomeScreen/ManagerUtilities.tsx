import * as React from "react";
import * as api from "../../api";
import { ContextData } from "../App";

export default function ManagerUtilities(): JSX.Element {
	const { refreshContext } = React.useContext(ContextData);
	const [isShuffling, setIsShuffling] = React.useState(false);
	const [error, setError] = React.useState("");

	const shuffle = async () => {
		if (!confirm("Are you sure you'd like to shuffle assignemnts? This cannot be undone.")) {
			return;
		}
		setIsShuffling(true);
		try {
			await api.POST("admin/shuffle", {});
			refreshContext();
		} catch (e) {
			setError(e);
		}
	};

	return <>
		<div className="container">
			<h3 className="is-size-4">Manager Utilities</h3>
			<div className="columns">
				<div className="column">
					<h4 className="is-size-5">List participants</h4>
					<p className="py-2">A pretty GUI hasn't been implemented for this yet :'(.</p>
					<a href={api.baseurl + "/admin/users"} target="_blank" rel="noopener noreferrer" className="button">Open participant list</a>
				</div>
				<div className="column">
					<h4 className="is-size-5">Shuffle assignments</h4>
					{error && <div className="notification is-warning is-light">{error}</div>}
					<p className="py-2">Warning! Shuffling assignments is a potentially destructive action that <u>cannot be undone</u>.</p>
					<button className={`button is-warning ${isShuffling ? "is-loading is-disabled" : ""}`} onClick={shuffle}>Shuffle Assignments</button>
				</div>
			</div>
		</div>
		<hr />
	</>;
}