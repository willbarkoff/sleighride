import * as React from "react";
import { ContextData } from "../App";
import ManagerUtilities from "./ManagerUtilities";
import Messaging from "./Messaging";
import TopBar from "./TopBar";
import UserInfo from "./UserInfo";

export default function HomeScreen(): JSX.Element {
	const { context } = React.useContext(ContextData);


	return <section className="section">
		<TopBar />
		<hr />
		<div className="container">
			<div className="columns">
				<div className="column">
					<h3 className="is-size-4">Your Information</h3>
					<UserInfo user={context.user} />
				</div>
				<div className="column">
					<h3 className="is-size-4">Giftee Information</h3>
					<UserInfo user={context.assignedUser} />
				</div>
				<div className="column">
					<h3 className="is-size-4">Helpful Links</h3>
					<ul>
						<li><a href="https://www.ups.com/ship/guided/origin" target="_blank" rel="noopener noreferrer">UPS Ship Online</a></li>
						<li><a href="https://www.fedex.com/lite/lite-ship.html" target="_blank" rel="noopener noreferrer">FedEx Lite Ship</a></li>
						<li><a href="https://cns.usps.com/" target="_blank" rel="noopener noreferrer">USPS Click-N-Ship</a></li>
						<li><a href="https://store.usps.com/store/results/free-shipping-supplies/shipping-supplies/_/N-alnx4jZ7d0v8v" target="_blank" rel="noopener noreferrer">Free USPS Shipping Supplies</a></li>
					</ul>
				</div>
			</div>
		</div>
		<hr />
		{context.isManager && <ManagerUtilities />}
		<div className="container">
			<h3 className="is-size-4">Messaging</h3>
			<Messaging />
		</div>
	</section>;
}