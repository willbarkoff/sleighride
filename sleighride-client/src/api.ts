export const baseurl = process.env.API_BASEURL || "http://localhost:4853";

const formURLEncode = function (body: Record<string, string>): string {
	if (!body) {
		return "";
	}

	let paramStr = "";

	let first = true;
	for (const key in body) {
		const value = body[key];
		if (first) {
			first = false;
		} else {
			paramStr += "&";
		}
		paramStr += key;
		paramStr += "=";
		paramStr += encodeURIComponent(value);
	}

	return paramStr;
};

export const GET = async function <T>(endpoint: string): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, { credentials: "include" });
	const json = await response.json() as SleighrideAPI_response;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export const POST = async function <T>(endpoint: string, body: Record<string, string>): Promise<T> {
	const response = await fetch(baseurl + "/" + endpoint, {
		method: "POST",
		body: formURLEncode(body),
		headers: {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
		},
		credentials: "include"
	});
	const json = await response.json() as SleighrideAPI_response;

	if (json.status == "error") {
		throw json.error;
	}

	return json.data as T;
};

export interface SleighrideAPI_response {
	status: string;
	error?: string;
	data?: any;
}
export interface SleighrideAPI_user {
	id: number;
	first: string;
	last: string;
	addr1: string;
	addr2?: string;
	city: string;
	state: string;
	zip: string;
}
export interface SleighrideAPI_message {
	id: string;
	content: string;
}
export interface SleighrideAPI_contextData {
	user: SleighrideAPI_user;
	assignedUser: SleighrideAPI_user;
	isManager: boolean;
}

export interface SleighrideAPI_note {
	isSender: boolean;
	content: string;
	datetime: string;
}

export interface SleighrideAPI_notesData {
	santaConversation: SleighrideAPI_note[];
	recipientConversation: SleighrideAPI_note[];
}
