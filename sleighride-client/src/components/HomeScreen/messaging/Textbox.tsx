import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import * as React from "react";
import * as api from "../../../api";

interface textboxProps {
	toSanta: boolean
	reloadConversation(): void

}

export default function Textbox(props: textboxProps): JSX.Element {
	const [message, setMessage] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
	const [shouldAutofocus, setShouldAutofocus] = React.useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		try {
			await api.POST("notes/send", {
				sendTo: props.toSanta ? "santa" : "recipient",
				content: message
			});
		} catch (e) {
			alert(e);
		} finally {
			setMessage("");
			setIsLoading(false);
			setShouldAutofocus(true);
			props.reloadConversation();
		}
	};


	return <>
		<div className={`modal ${showEmojiPicker ? "is-active" : ""}`}>
			<div className="modal-background"></div>
			<div className="modal-content">
				{/* @ts-expect-error because typings are incorret */}
				<Picker emoji=":sled:" title="Pick an emoji" autoFocus onSelect={(emoji) => { setShowEmojiPicker(false); setMessage(message + emoji.native); }} style={{ width: "100%" }} />
			</div>
			<button className="modal-close is-large" onClick={() => setShowEmojiPicker(false)} aria-label="close"></button>
		</div>
		<form className="field has-addons" onSubmit={handleSubmit}>
			<div className="control">
				<button type="button" className="button" disabled={isLoading} onClick={(e) => {
					e.preventDefault();
					setShowEmojiPicker(true);
				}}>
					<FontAwesomeIcon icon={faSmile} />
				</button>
			</div>
			<div className="control is-expanded">
				<input className="input" type="text" placeholder="Hi there..." value={message} onChange={(e) => setMessage(e.target.value)} disabled={isLoading} required autoFocus={shouldAutofocus} />
			</div>
			<div className="control">
				<button type="submit" className={`button is-primary ${isLoading ? "is-loading" : ""}`} disabled={isLoading}>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			</div>
		</form>
	</>;
}

