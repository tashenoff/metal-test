// pages/api/responses/getResponsesCount.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId } = req.query;

    try {
        const parsedListingId = parseInt(listingId, 10);

        const responseCount = await prisma.response.count({
            where: {
                listingId: parsedListingId,
            },
        });

        res.status(200).json({ count: responseCount });
    } catch (error) {
        console.error('Ошибка при получении количества откликов:', error);
        res.status(500).json({ message: 'Ошибка при получении количества откликов.' });
    }
}
