// pages/api/responses/[id].js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
  const { id } = req.query; // Получаем ID отклика из параметров маршрута
  const responseId = parseInt(id);

  try {
    if (req.method === 'PATCH') {
      const { action } = req.body; // Ожидаем, что действие (accept или decline) будет передано в теле запроса

      // Проверяем, существует ли отклик
      const response = await prisma.response.findUnique({ where: { id: responseId } });

      if (!response) {
        return res.status(404).json({ message: 'Отклик не найден.' });
      }

      // Получаем информацию о заявлении
      const listing = await prisma.listing.findUnique({ where: { id: response.listingId } });

      // Проверка владельца объявления
      const userId = 10; // Здесь используйте вашу логику для получения ID пользователя

      if (listing.authorId !== userId) {
        return res.status(403).json({ message: 'Только владелец объявления может принимать или отклонять отклики.' });
      }

      if (action === 'accept') {
        await prisma.response.update({
          where: { id: responseId },
          data: { status: 'approved' },
        });
        return res.status(200).json({ message: 'Отклик принят.' });
      } else if (action === 'decline') {
        await prisma.response.update({
          where: { id: responseId },
          data: { status: 'rejected' },
        });
        return res.status(200).json({ message: 'Отклик отклонён.' });
      } else {
        return res.status(400).json({ message: 'Неверное действие. Используйте accept или decline.' });
      }
    } else {
      res.setHeader('Allow', ['PATCH']);
      return res.status(405).end(`Метод ${req.method} не разрешен.`);
    }
  } catch (error) {
    console.error('Ошибка при обработке запроса:', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера.', error: error.message });
  }
}
