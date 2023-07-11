const axios = require("axios"); 
const cheerio = require("cheerio"); 

class Request {
	characters: string[];
	writers: string[];
	pencilers: string[];
	inkers: string[];
	colorists: string[];
	letterers: string[];
	editors: string[];
}

async function getCharComics(char:string, type:string)
{
	let	comics = new Set<string>();
	let URL = "https://marvel.fandom.com/wiki/Category:" + char.replace(/ /g, '_') + "/" + type;
	
	while (1)
	{
		const	html = await axios.get(URL)
		.catch((err) => {
			console.log("Missing data");
			return comics;
		});
		const $ = cheerio.load(html.data);
		const list = $("a.category-page__member-link");
		list.each(function (i, elem) {
			comics.add($(elem).text())
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
	
	return comics;
}

async function getComicsList(names:string[], type:string)
{
	var	allSets:Array<Set<string>> = [];
	var set:Set<string>;

	for (var name of names) {
		set = await getCharComics(name, type);
		if (set.size == 0) {
			return [];
		}
		allSets.push(set);
	}
	return (allSets);
}

function intersect(set1:Set<string>, set2:Set<string>) {
	set1.forEach(function(item) {
		if(!set2.has(item)) {
			set1.delete(item)
		}
	}
	)
}

export default async function getComics(request:Request) {
	var	allSets:Array<Set<string>> = [];
	var sets:Array<Set<string>> = [];
	
	if (request.characters.length != 0) {
		sets = await getComicsList(request.characters, "Appearances");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.writers.length != 0) {
		sets = await getComicsList(request.writers, "Writer");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.pencilers.length != 0) {
		sets = await getComicsList(request.pencilers, "Penciler");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.inkers.length != 0) {
		sets = await getComicsList(request.inkers, "Inker");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.colorists.length != 0) {
		sets = await getComicsList(request.colorists, "Colorist");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.letterers.length != 0) {
		sets = await getComicsList(request.letterers, "Letterer");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (request.editors.length != 0) {
		sets = await getComicsList(request.editors, "Editor");
		if (sets.length == 0) {
			return "Data missing";
		}
		allSets = allSets.concat(sets);
	}
	if (allSets.length == 0)
		return ("");
	var finalSet = allSets[0];
	for (let i = 1; i < allSets.length; i++) {
		 intersect(finalSet, allSets[i]);
	}
	
	return (Array.from(finalSet));
}
