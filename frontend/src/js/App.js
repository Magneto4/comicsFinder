import UserInput from "./input";
import "../css/App.css"
import Banner from "./Banner";

export default function App() {
	return (<div className="app">
		<Banner />
		<UserInput />
	</div>)
}