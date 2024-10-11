// pages/api/user.js
import prisma from '../../prisma/client'; // Импортируй клиента Prisma
import jwt from 'jsonwebtoken'; // Импортируем jsonwebtoken для работы с токенами

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]; // Получаем токен

  if (!token) {
    return res.status(401).json({ error: 'Необходима авторизация.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Замените на ваш секрет
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (user) {
      res.status(200).json(user); // Отправляем информацию о пользователе
    } else {
      res.status(404).json({ error: 'Пользователь не найден.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
