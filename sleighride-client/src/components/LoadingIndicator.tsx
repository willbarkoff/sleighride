import * as React from "react";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./LoadingIndicator.scss";

interface LoadingIndicatorProps {
	minimal?: boolean
	message?: string
}

const LoadingIndicator = ({ minimal, message }: LoadingIndicatorProps): JSX.Element => <div className={`loadingIndicator ${minimal ? "minimal" : ""}`}>
	<div className="loadingIndicatorContent">
		<FontAwesomeIcon icon={faCircleNotch} spin={true} size={minimal ? undefined : "3x"} />
		{minimal ? " " : <br />}
		<span className={minimal ? "" : "is-size-4"}>{message || "Loading..."}</span>
	</div>
</div>;

export default LoadingIndicator;
