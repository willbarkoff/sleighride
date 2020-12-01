import { faSleigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

import "./SignInScreen.scss";
import RegisterForm from "./SignInScreen/RegisterForm";
import SignInForm from "./SignInScreen/SignInForm";

export interface signInScreenProps {
	reload(): void
}

export default function SignInScreen(props: signInScreenProps): JSX.Element {
	const [isRegister, setIsRegister] = React.useState(false);

	return <section className="section">
		<div className="container is-sign-in-header">
			<h1 className="title"><FontAwesomeIcon icon={faSleigh} className="has-text-primary" /> Sleighride</h1>
			<h1 className="subtitle">Secret Santa for friends</h1>
		</div>
		<div className="container">
			<div className="tabs">
				<ul>
					<li className={!isRegister ? "is-active" : ""}>
						<a onClick={() => setIsRegister(false)}>Sign in</a>
					</li>
					<li className={isRegister ? "is-active" : ""}>
						<a onClick={() => setIsRegister(true)}>Register</a>
					</li>
				</ul>
			</div>
			{isRegister ? <RegisterForm reload={props.reload} /> : <SignInForm reload={props.reload} />}
		</div>
	</section>;
}