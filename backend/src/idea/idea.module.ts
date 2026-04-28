import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [IdeaController],
  providers: [IdeaService],
  imports: [PrismaModule],
})
export class IdeaModule {}
