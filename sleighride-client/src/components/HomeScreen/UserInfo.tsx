import * as React from "react";
import { SleighrideAPI_user } from "../../api";

interface userInfoProps {
	user: SleighrideAPI_user
}

export default function UserInfo(props: userInfoProps): JSX.Element {
	if (props.user.id < 1) {
		return <div className="notification is-warning is-light">The giftee has not been assigned yet. Contact your organizer for more information.</div>;
	}

	return <div>
		<strong>{props.user.first} {props.user.last}</strong>
		<p>{props.user.addr1}</p>
		<p>{props.user.addr2 ? props.user.addr2 : null}</p>
		<p>{props.user.city}, {props.user.state} {props.user.zip}</p>
	</div>;
}