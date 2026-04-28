import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { IdeaModule } from './idea/idea.module';

@Module({
  imports: [PrismaModule, IdeaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
