import { Test, TestingModule } from '@nestjs/testing';
import { IdeaService } from './idea.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateIdeaDto } from './dto/create-idea.dto';

const mockPrismaService = {
  idea: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('IdeaService', () => {
  let service: IdeaService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdeaService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<IdeaService>(IdeaService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of ideas', async () => {
    // Arrange
    const mockIdeasArray = [
      { id: 1, title: 'Titre de test', content: 'Contenu', author: 'Enzo' },
    ];

    prisma.idea.findMany.mockResolvedValue(mockIdeasArray);

    // Act
    const ideas = await service.findAll();

    // Assert
    expect(ideas).toEqual(mockIdeasArray);
    expect(prisma.idea.findMany).toHaveBeenCalledTimes(1);
  });

  it('should return object that define an idea', async () => {
    // Arrange
    const mockIdeasArray = {
      id: 1,
      title: 'Titre de test',
      content: 'Contenu',
      author: 'Enzo',
    };
    const testID = 1;

    prisma.idea.findUnique.mockResolvedValue(mockIdeasArray);

    // Act
    const idea = await service.findOne(testID);

    // Assert
    expect(idea).toEqual(mockIdeasArray);
    expect(prisma.idea.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should return an 404 error if idea is not found', async () => {
    // Arrange
    prisma.idea.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should create and return the created object', async () => {
    // Arrange
    const createDTO: CreateIdeaDto = {
      title: 'Titre',
      content: "Contenu de cet article d'idée",
      author: 'Enzo',
    };

    const mockIdeaObject = {
      id: 1,
      ...createDTO,
      likes: 0,
      createdAt: '2026-04-28T21:03:33.091Z',
    };

    prisma.idea.create.mockResolvedValue(mockIdeaObject);

    // Act
    const createdIdea = await service.create(createDTO);

    // Assert
    expect(createdIdea).toEqual(mockIdeaObject);
    expect(prisma.idea.create).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException if idea to update is not found', async () => {
    // Arrange
    const updateDTO = { title: 'Nouveau Titre' };
    prisma.idea.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(service.update(999, updateDTO)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update and return the update object', async () => {
    // Arrange
    const updateDTO = { title: 'Nouveau Titre' };

    const existingIdea = {
      id: 1,
      title: 'Ancien Titre',
      content: '...',
      author: 'Enzo',
    };

    const updatedIdea = { ...existingIdea, ...updateDTO };

    prisma.idea.findUnique.mockResolvedValue(existingIdea);
    prisma.idea.update.mockResolvedValue(updatedIdea);

    // Act
    const update = await service.update(1, updateDTO);

    // Assert
    expect(update).toEqual(updatedIdea);
    expect(prisma.idea.update).toHaveBeenCalledTimes(1);
    expect(prisma.idea.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should throw a NotFoundException if idea to remove is not found', async () => {
    // Arrange
    prisma.idea.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should remove and return the remove object', async () => {
    // Arrange
    const existingIdea = {
      id: 1,
      title: 'Ancien Titre',
      content: '...',
      author: 'Enzo',
    };

    prisma.idea.findUnique.mockResolvedValue(existingIdea);
    prisma.idea.delete.mockResolvedValue(existingIdea);

    // Act
    const update = await service.remove(1);

    // Assert
    expect(update).toEqual(existingIdea);
    expect(prisma.idea.delete).toHaveBeenCalledTimes(1);
    expect(prisma.idea.findUnique).toHaveBeenCalledTimes(1);
  });
});
