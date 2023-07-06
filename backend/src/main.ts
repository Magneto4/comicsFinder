import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getList from './getList';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require("cors");
  app.use(cors({
	origin: 'http://localhost:5000'
  }));
  getList("Characters");
  getList("Marvel_Staff/Writers");
  getList("Marvel_Staff/Pencilers");
  getList("Marvel_Staff/Inkers");
  getList("Marvel_Staff/Colorists");
  getList("Marvel_Staff/Letterers");
  getList("Marvel_Staff/Editors");
  await app.listen(8000);
}
bootstrap();
