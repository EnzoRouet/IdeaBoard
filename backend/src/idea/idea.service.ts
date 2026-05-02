import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IdeaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createIdeaDto: CreateIdeaDto) {
    const response = await this.prisma.idea.create({
      data: createIdeaDto,
    });
    return response;
  }

  async findAll() {
    return await this.prisma.idea.findMany();
  }

  async findOne(id: number) {
    const response = await this.prisma.idea.findUnique({ where: { id: id } });
    if (!response) throw new NotFoundException("Cette idée n'existe pas");
    return response;
  }

  async update(id: number, updateIdeaDto: UpdateIdeaDto) {
    await this.findOne(id);
    return await this.prisma.idea.update({
      where: { id: id },
      data: updateIdeaDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prisma.idea.delete({
      where: {
        id: id,
      },
    });
  }
}
