// pages/api/publisher/publishListing.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId } = req.body;

    try {
        // Проверяем, что передан listingId
        if (!listingId) {
            return res.status(400).json({ message: 'Необходимо передать listingId.' });
        }

        // Обновляем статус объявления на опубликованное
        const updatedListing = await prisma.listing.update({
            where: { id: listingId },
            data: { published: true },
        });

        res.status(200).json(updatedListing);
    } catch (error) {
        console.error('Ошибка при публикации объявления:', error);
        res.status(500).json({ message: 'Ошибка при публикации объявления.' });
    }
}
