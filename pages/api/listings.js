// pages/api/listings.js
import prisma from '../../prisma/client'; // Импортируй клиента Prisma
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, content } = req.body;
    const token = req.headers.authorization?.split(' ')[1]; // Получаем токен

    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация.' });
    }

    try {
      // Декодируем токен и получаем пользователя
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на ваш секрет
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      // Проверяем, является ли пользователь PUBLISHER
      if (user.role !== 'PUBLISHER') {
        return res.status(403).json({ error: 'У вас нет прав для добавления объявлений.' });
      }

      // Создаем объявление
      const listing = await prisma.listing.create({
        data: {
          title,
          content,
          author: {
            connect: { id: user.id }, // Подключаем пользователя к объявлению
          },
        },
      });
      res.status(201).json(listing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const listings = await prisma.listing.findMany({
      include: {
        author: true,
      },
    });
    res.status(200).json(listings);
  } else {
    res.status(405).json({ error: 'Метод не разрешен.' });
  }
}
