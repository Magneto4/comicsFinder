import axios from "axios";

export default async function getListFromWiki(category, list) {
	const body = {
		category: category,
	}
	await axios.post('http://127.0.0.1:8000/list', body)
	.then(function (response) {
		var array = response.data.split(",");
		if (array[array.length - 1] === "")
			array.pop();
		for (var elem of array) {
			list.push(elem);
		}
	})
	.catch(function (error) {
		console.log(error);
	});
}
