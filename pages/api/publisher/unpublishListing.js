// pages/api/publisher/unpublishListing.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId } = req.body;

    try {
        // Проверяем, что передан listingId
        if (!listingId) {
            return res.status(400).json({ message: 'Необходимо передать listingId.' });
        }

        // Обновляем статус объявления на не опубликованное
        const updatedListing = await prisma.listing.update({
            where: { id: listingId },
            data: { published: false },
        });

        res.status(200).json(updatedListing);
    } catch (error) {
        console.error('Ошибка при снятии объявления с публикации:', error);
        res.status(500).json({ message: 'Ошибка при снятии объявления с публикации.' });
    }
}
