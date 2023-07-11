const cheerio = require('cheerio');
const axios = require('axios');

class namedArray {
	name: string;
	array: Array<string>
}

const	arrays:Array<namedArray> = [];

export default async function getList(category:string) {
	let	nameArray = new Array<string>();
	let URL = "https://marvel.fandom.com/wiki/Category:" + category;
	let exists = false;

	for (var array of arrays) {
		if (array.name == category) {
			exists = true;
			nameArray = array.array;
		}
	}
	if (exists == false) {
		var	html = await axios.get(URL)
		.catch(function (error) {
			console.log(error);
		});
		while (1)
		{
			arrays.push({
				name:category,
				array:nameArray
			});
			var	html = await axios.get(URL)
			.catch(function (error) {
				console.log(error);
			});
			const $ = cheerio.load(html.data);
			const list = $("a.category-page__member-link");
			list.each(function (i, elem) {
				if (!$(elem).text().startsWith("Category:") && $(elem).text() != "Character Index")
					nameArray.push($(elem).text())
			})
			const next = $("div.category-page__pagination");
			if (next.length == 0)
				break ;
			const nextButtons = $("div.category-page__pagination").find('a');
	
			var isNext = false;
			nextButtons.each(function (i, elem) {
				if ($(elem).text().includes("Next"))
				{
					URL = $(elem).attr('href');
					isNext = true;
				}
			})
			if (!isNext)
				break ;
		}
	}
	return nameArray;
}
