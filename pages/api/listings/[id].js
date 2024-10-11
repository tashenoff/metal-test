// pages/api/listings/[id].js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const listing = await prisma.listing.findUnique({
        where: {
          id: parseInt(id), // Преобразуем id в число
        },
      });

      if (!listing) {
        return res.status(404).json({ message: 'Объявление не найдено.' });
      }

      return res.json(listing);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении объявления.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Метод ${req.method} не разрешен.`);
  }
}
