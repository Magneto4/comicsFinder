const cheerio = require('cheerio');
const axios = require('axios');

class namedSet {
	name: string;
	set: Set<string>
}

const	sets:Array<namedSet> = [];

export default async function getList(category:string) {
	let	nameSet = new Set<string>();
	let URL = "https://marvel.fandom.com/wiki/Category:" + category;
	let exists = false;

	for (var set of sets) {
		if (set.name == category) {
			exists = true;
			nameSet = set.set;
		}
	}
	if (exists == false) {
		var	html = await axios.get(URL)
		.catch(function (error) {
			console.log(error);
		});
		while (1)
		{
			sets.push({
				name:category,
				set:nameSet
			});
			console.log(URL);
			var	html = await axios.get(URL)
			.catch(function (error) {
				console.log(error);
			});
			const $ = cheerio.load(html.data);
			const list = $("a.category-page__member-link");
			list.each(function (i, elem) {
				if (!$(elem).text().startsWith("Category:"))
					nameSet.add($(elem).text())
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
		nameSet.delete("Character Index");
	}
	let names = "";
	for (let name of nameSet) {
		names += name + ",";
	}
	return names;
}
