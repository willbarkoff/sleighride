import * as React from "react";
import { SleighrideAPI_note } from "../../../api";

interface conversationProps {
	notes: SleighrideAPI_note[]
}

export default function Conversation(props: conversationProps): JSX.Element {
	return <div className="is-clearfix">
		{props.notes.map((note, i) => <div key={i}>
			<div className={`notification ${note.isSender ? "is-pulled-right is-primary is-light" : "is-pulled-left"}`}>
				{note.content}
			</div>
			<div className="is-clearfix"></div>
		</div>)}
	</div>;
}