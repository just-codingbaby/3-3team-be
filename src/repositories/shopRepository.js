import prisma from '../config/prisma.js';
import { faker } from '@faker-js/faker';
import { Genre, Grade } from '@prisma/client';
import userService from '../services/userService.js';

async function getAll() {
  const [total, cards] = await Promise.all([
    prisma.card.count(),
    prisma.card.findMany({
      take: 6,
      skip: 0,
      AND: {
        where: {
          grade: {
            equal: 'value',
          },
          // genre, status..
        },
        orderBy: {
          createdAt: 'desc',
          // price: 'asc' | 'desc'
        },
      },
      include: {
        owner: {
          select: {
            nickName: true,
          },
        },
      },
    }),
  ]);
  return { total, cards };
}

async function create() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  let randomUser;

  if (users.length < 1) {
    randomUser = await userService.createUser();
  } else {
    randomUser = faker.helpers.arrayElement(users);
  }

  const randomGenre = faker.helpers.enumValue(Genre);
  const totalQuantity = faker.number.int({ min: 1, max: 3 });
  const remainingQuantity = faker.number.int({ min: 0, max: totalQuantity });

  const mockData = {
    ownerId: randomUser.id,
    name: faker.commerce.productName(),
    price: faker.number.int({ min: 1, max: 10 }),
    grade: faker.helpers.enumValue(Grade),
    genre: randomGenre,
    description: faker.commerce.productDescription(),
    imgUrl: `/images/card/img_default-${randomGenre.toLowerCase()}.webp`,
    remainingQuantity: remainingQuantity,
    totalQuantity: totalQuantity,
  };

  return prisma.card.create({
    data: mockData,
  });
}

export default {
  getAll,
  create,
};