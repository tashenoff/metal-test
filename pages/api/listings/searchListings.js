// pages/api/listings/searchListings.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { title } = req.query; // Извлечение параметров поиска

  try {
    const listings = await prisma.listing.findMany({
      where: {
        published: true, // Фильтруем только опубликованные объявления
        title: title ? { contains: title.toLowerCase() } : undefined, // Убираем mode
      },
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error('Ошибка при поиске объявлений:', error);
    res.status(500).json({ message: 'Ошибка при поиске объявлений.' });
  } finally {
    await prisma.$disconnect(); // Закрытие подключения к базе данных
  }
}
