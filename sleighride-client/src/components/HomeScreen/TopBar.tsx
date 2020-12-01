import { faSleigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as api from "../../api";
import { ContextData } from "../App";

export default function TopBar(): JSX.Element {
	const { context, refreshContext } = React.useContext(ContextData);
	const [loggingOut, setLoggingOut] = React.useState(false);

	const logOut = async () => {
		setLoggingOut(true);
		await api.POST("auth/logout", {});
		refreshContext();
	};

	return <div className="container">
		<div className="columns">
			<div className="column">
				<h1 className="title"><FontAwesomeIcon icon={faSleigh} className="has-text-primary" /> Sleighride {context.isManager && <span className="tag is-primary">Organizer</span>}
				</h1>
				<h2 className="subtitle">Hi, {context.user.first}</h2>
			</div>
			<div className="column is-one-fifth">
				<button className={`button is-fullwidth is-warning ${loggingOut ? "is-disabled is-loading" : ""}`} onClick={logOut}>Log out</button>
			</div>
		</div>
	</div>;
}