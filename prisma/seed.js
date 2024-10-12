const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Удаляем всех пользователей и объявления
  await prisma.user.deleteMany({});
  await prisma.listing.deleteMany({});

  // Хэшируем пароль
  const hashedPassword = await bcrypt.hash('admin', 10);

  // Создаем пользователя с ролью PUBLISHER (у него не будет баллов)
  const publisher = await prisma.user.create({
    data: {
      email: 'a@p.com',
      password: hashedPassword,
      role: 'PUBLISHER',
      points: null, // Нет баллов
      companyName: 'Publisher Company', // Название компании
      companyBIN: '123456789', // БИН компании
    },
  });

  // Создаем пользователя с ролью RESPONDER (у него 10 баллов по умолчанию)
  const responder = await prisma.user.create({
    data: {
      email: 'a@r.com',
      password: hashedPassword,
      role: 'RESPONDER',
      points: 10, // 10 баллов
      companyName: 'Responder Company', // Название компании
      companyBIN: '987654321', // БИН компании
    },
  });

  // Создаем несколько объявлений
  const listings = await prisma.listing.createMany({
    data: [
      {
        title: 'Первое объявление',
        content: 'Содержимое первого объявления',
        published: true,
        authorId: publisher.id, // Указываем автора объявления
      },
      {
        title: 'Второе объявление',
        content: 'Содержимое второго объявления',
        published: false,
        authorId: publisher.id,
      },
      {
        title: 'Третье объявление',
        content: 'Содержимое третьего объявления',
        published: true,
        authorId: publisher.id,
      },
    ],
  });

  console.log('Users and listings created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
