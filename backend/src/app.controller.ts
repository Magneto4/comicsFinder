import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import getList from './getList';
import getComics from './getComics';
import { promises as fsPromises } from 'fs';

class Request {
	characters: string[];
	colorists: string[];
	editors: string[];
	inkers: string[];
	letterers: string[];
	pencilers: string[];
	writers: string[];
}

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return "this is a test string";
	}

	@Post('/appearances')
	async createMessage(@Body() message: Request){
		console.log(message);
		try {
			//save search to file. Not very clean, but a database would be too much work and unnecessary
			var file = "/home/magneto/data/history";
			var date = new Date();
			var content: string = date + ": " + JSON.stringify(message) + "\n";
			await fsPromises.writeFile(file, content, {
				flag: 'w',
			});
		} catch (err) {
			console.log(err);
			return 'Something went wrong';
		}
		return await getComics(message);
	}

	@Get('/list/:category')
	async createMessage2(@Param('category') category: string) {
		return await getList(category);
	}

	@Get('/list/Marvel_Staff/:category')
	async createMessage3(@Param('category') category: string) {
		return await getList("Marvel_Staff/" + category);
	}
}
