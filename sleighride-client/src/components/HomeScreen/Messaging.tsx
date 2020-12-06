import * as React from "react";
import * as api from "../../api";
import { ContextData } from "../App";
import LoadingIndicator from "../LoadingIndicator";
import Conversation from "./messaging/Conversation";
import Textbox from "./messaging/Textbox";


export default function Messaging(): JSX.Element {
	const { context } = React.useContext(ContextData);
	const [toSanta, setToSanta] = React.useState(true);
	const [error, setError] = React.useState("");
	const [notes, setNotes] = React.useState(null as null | api.SleighrideAPI_notesData);
	const [loading, setLoading] = React.useState(false);

	const getMessages = async () => {
		setLoading(true);
		try {
			const notesResp = await api.GET<api.SleighrideAPI_notesData>("notes/get");
			setNotes(notesResp);
		} catch (e) {
			setError(e);
		} finally {
			setLoading(false);
		}
	};

	if (!loading && !notes && !error) {
		getMessages();
	}

	const reloadConversation = () => {
		setLoading(false);
		setNotes(null);
	};

	return <>
		<p className="py-2">
			Write back and forth between your giftee or your gift giver! Note that as of right now, messaging is asynchronious, meaning that you won't be notified
			of new messages, and you will need to refresh the page to see them. I hope to add email/push notifications soon!
		</p>
		<div className="columns">
			<aside className="menu column is-one-fifth">
				<ul className="menu-list">
					<li><a className={toSanta ? "is-active" : ""} onClick={() => setToSanta(true)}>To my gift giver</a></li>
					<li><a className={!toSanta ? "is-active" : ""} onClick={() => setToSanta(false)}>To {context.assignedUser.first}</a></li>
				</ul>
			</aside>
			<div className="column">
				{error && <div className="notification is-warning is-light">{error}</div>}
				{!notes ? <LoadingIndicator /> : <Conversation notes={toSanta ? notes.santaConversation : notes.recipientConversation} />}
				<Textbox toSanta={toSanta} reloadConversation={reloadConversation} />
			</div>
		</div>
	</>;
}