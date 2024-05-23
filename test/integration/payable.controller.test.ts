import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { PrismaAssignorRepository } from '../../src/infra/repository/prisma-assignor.repository';

describe('Teste de Integração - PayableController', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    prisma = module.get<PrismaClient>(PrismaClient);

    await app.init();
  });

  afterAll(async () => {
    app.close();
  });

  it('deve criar um cedente com recebíveis quando chamado a rota "/integrations/payable', async () => {
    const input = {
      document: '389.967.700-51',
      email: 'joe.doe@email.com',
      phone: '(11) 99657-1123',
      name: 'Joe Doe',
      receivables: [
        {
          value: 100000,
          emissionDate: new Date(),
        },
      ],
    };

    await request(app.getHttpServer())
      .post('/integrations/payable')
      .send(input)
      .expect(HttpStatus.CREATED);

    const created = await prisma.assignor.findUnique({
      where: { document: input.document.replace(/\D/g, '') },
      include: { receivables: true },
    });

    expect(created).toBeDefined();
    expect(created.receivables.length).toStrictEqual(1);
  });
});
