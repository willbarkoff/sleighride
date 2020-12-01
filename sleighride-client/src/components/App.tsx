import * as React from "react";
import * as API from "../api";
import { SleighrideAPI_contextData } from "../api";

import "./App.scss";
import HomeScreen from "./HomeScreen/HomeScreen";
import LoadingIndicator from "./LoadingIndicator";
import SignInScreen from "./SignInScreen";

// FIXME: should have default value
//@ts-expect-error see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
export const ContextData = React.createContext<contextData>();

interface contextData {
	context: SleighrideAPI_contextData
	refreshContext(): void
}

async function getContext(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setContext: React.Dispatch<React.SetStateAction<null | SleighrideAPI_contextData>>) {
	try {
		const contextData = await API.GET<SleighrideAPI_contextData>("context");
		setContext(contextData);
	} catch {
		// ignore this
	} finally {
		setIsLoading(false);
	}
}


export default function App(): JSX.Element {
	const [isLoading, setIsLoading] = React.useState(true);
	const [context, setContext] = React.useState(null as null | SleighrideAPI_contextData);

	const reload = () => setIsLoading(true);

	if (isLoading) {
		getContext(setIsLoading, setContext);
		return <LoadingIndicator />;
	}

	if (!context) {
		return <SignInScreen reload={reload} />;
	}

	return <ContextData.Provider value={{
		context: context,
		refreshContext: () => {
			setContext(null);
			setIsLoading(true);
			getContext(setIsLoading, setContext);
		}
	}}>
		<HomeScreen />
	</ContextData.Provider>;
}