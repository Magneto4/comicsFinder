import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import getList from './getList';
import getComics from './getComics';


class Request {
	characters: string;
	writers: string;
	pencilers: string;
	inkers: string;
	colorists: string;
	letterers: string;
	editors: string;
}

class ListRequest {
	category: string;
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
		return await getComics(message);
	}

	@Post('/list')
	async createMessage2(@Body() message: ListRequest){
		return await getList(message.category);
	}
}
