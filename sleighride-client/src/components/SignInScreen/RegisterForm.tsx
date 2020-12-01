import * as React from "react";
import * as api from "../../api";

import { signInScreenProps } from "../SignInScreen";

export default function RegisterForm(props: signInScreenProps): JSX.Element {
	const [fname, setFname] = React.useState("");
	const [lname, setLname] = React.useState("");
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [addr1, setAddr1] = React.useState("");
	const [addr2, setAddr2] = React.useState("");
	const [city, setCity] = React.useState("");
	const [state, setState] = React.useState("");
	const [zip, setZip] = React.useState("");
	const [secretCode, setSecretCode] = React.useState("");
	const [error, setError] = React.useState("");

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (password != confirmPassword) {
			setError("The passwords you entered didn't match");
			return;
		}

		try {
			await api.POST("auth/register", {
				fname: fname,
				lname: lname,
				username: username,
				password: password,
				addr1: addr1,
				addr2: addr2,
				city: city,
				state: state,
				zip: zip,
				secretCode: secretCode
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
				<div className="field-body">
					<div className="field">
						<label className="label">First name</label>
						<div className="control">
							<input className="input" type="text" value={fname} onChange={(e) => setFname(e.target.value)} required />
						</div>
					</div>
					<div className="field">
						<label className="label">Last name</label>
						<div className="control">
							<input className="input" type="text" value={lname} onChange={(e) => setLname(e.target.value)} required />
						</div>
					</div>
				</div>
			</div>

			<div className="field">
				<label className="label">Username</label>
				<div className="control">
					<input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
				</div>
				<p className="help">Your username must be between 1 and 20 characters, and must be unique. You will use it to sign in.</p>
			</div>

			<div className="field">
				<div className="field-body">
					<div className="field">
						<label className="label">Password</label>
						<div className="control">
							<input className="input" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
					</div>
					<div className="field">
						<label className="label">Confirm Password</label>
						<div className="control">
							<input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
						</div>
					</div>
				</div>
				<p className="help">Your password must contain at least one letter, one number, and must be at least 8 characters long.</p>
			</div>

			<div className="field">
				<label className="label">Address line 1</label>
				<div className="control">
					<input className="input" type="text" value={addr1} onChange={(e) => setAddr1(e.target.value)} required />
				</div>
			</div>

			<div className="field">
				<label className="label">Address line 2</label>
				<div className="control">
					<input className="input" type="text" value={addr2} onChange={(e) => setAddr2(e.target.value)} />
				</div>
				<p className="help">If you're not sure what to put here, leave it blank.</p>
			</div>

			<div className="field">
				<div className="field-body">
					<div className="field">
						<label className="label">City</label>
						<div className="control">
							<input className="input" type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
						</div>
					</div>
					<div className="field">
						<label className="label">State</label>
						<div className="control">
							<input className="input" type="text" value={state} maxLength={2} minLength={2} onChange={(e) => setState(e.target.value.toUpperCase())} required />
						</div>
						<p className="help">Type the two-letter abbreviation for your state.</p>
					</div>
					<div className="field">
						<label className="label">ZIP Code</label>
						<div className="control">
							<input className="input" type="text" value={zip} maxLength={5} minLength={5} onChange={(e) => setZip(e.target.value)} required />
						</div>
					</div>
				</div>
			</div>

			<div className="field">
				<label className="label">Secret Code</label>
				<div className="control">
					<input className="input" type="text" value={secretCode} onChange={(e) => setSecretCode(e.target.value)} required />
				</div>
				<p className="help">This should have been provided by the organizer of your gift exchange. If you don't have it, reach out to them.</p>
			</div>

			<input type="submit" className="button is-primary" value="Register!" />
		</form>
		<div className="column">
			<p className="py-2">
				Register for Sleighride using the form on the left. If you forgot your username or password, contact the organizer of your gift exchange.
			</p>
			<p className="py-2">
				The organizer of your gift exchange can access all of this information, with the exception of your password, which is kept secret.
				Your name and address can also be accessed by the person who is assigned to send you the gift. Apart from that, none of your information
				is shared.
			</p>
			<p className="py-2">
				Sleighride is open source software, available on GitHub! <a href="https://willbarkoff.dev/sleighride" target="_blank" rel="noopener noreferrer">Learn more about Sleighride</a>.
			</p>
		</div>
	</div>;
}