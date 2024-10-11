// pages/api/listings/index.js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const listings = await prisma.listing.findMany();
      return res.json(listings);
    } catch (error) {
      return res.status(500).json({ message: 'Ошибка при получении объявлений.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Метод ${req.method} не разрешен.`);
  }
}
