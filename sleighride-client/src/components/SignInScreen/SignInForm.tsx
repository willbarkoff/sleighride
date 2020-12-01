import * as React from "react";
import * as api from "../../api";

import { signInScreenProps } from "../SignInScreen";

export default function SignInForm(props: signInScreenProps): JSX.Element {
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		try {
			await api.POST("auth/login", {
				username: username,
				password: password
			});
			props.reload();
		} catch (e) {
			setError(e);
		}
	};

	return <div className="columns">
		<form className="form column" onSubmit={handleSubmit}>
			{error && <div className="notification is-warning is-light">{error}</div>}
			<div className="field">
				<label className="label">Username</label>
				<div className="control">
					<input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
				</div>
			</div>

			<div className="field">
				<label className="label">Password</label>
				<div className="control">
					<input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
			</div>

			<input type="submit" className="button is-primary" value="Log in!" />
		</form>
		<div className="column">
			<p className="py-2">
				Sign into Sleighride using the form on the left. If you forgot your username or password, contact the organizer of your gift exchange.
			</p>
			<p className="py-2">
				Sleighride is open source software, available on GitHub! <a href="https://willbarkoff.dev/sleighride" target="_blank" rel="noopener noreferrer">Learn more about Sleighride</a>.
			</p>
		</div>
	</div>;
}