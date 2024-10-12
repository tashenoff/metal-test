// pages/api/publisher/listings.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ message: 'Необходимо передать userId.' });
        }

        console.log(`Полученный userId: ${userId}`);

        const listings = await prisma.listing.findMany({
            where: {
                authorId: parseInt(userId, 10), // Убедитесь, что authorId соответствует вашим данным
            },
            select: {
                id: true,
                title: true,
                content: true,
                publishedAt: true,
                published: true,
                deliveryDate: true,
            },
        });

        console.log('Полученные объявления:', listings);

        res.status(200).json(listings);
    } catch (error) {
        console.error('Ошибка при получении объявлений:', error);
        res.status(500).json({ message: 'Ошибка при получении объявлений.' });
    }
}
