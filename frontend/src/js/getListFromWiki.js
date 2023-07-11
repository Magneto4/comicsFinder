import axios from "axios";

export default async function getListFromWiki(category, setList) {
	await axios.get('http://localhost:5000/list/' + category)
	.then(function (response) {
		setList(response.data)
	})
	.catch(function (error) {
		console.log(error);
	});
}
