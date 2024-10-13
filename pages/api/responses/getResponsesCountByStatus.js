// pages/api/responses/getResponsesCountByStatus.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { listingId } = req.query;

    try {
        const parsedListingId = parseInt(listingId, 10);

        const responseCounts = await prisma.response.groupBy({
            by: ['status'],
            where: {
                listingId: parsedListingId,
            },
            _count: {
                status: true,
            },
        });

        // Преобразуем данные в удобный формат
        const counts = {
            processed: 0, // Обработанные отклики
            rejected: 0,
            pending: 0,
        };

        responseCounts.forEach((item) => {
            if (item.status === 'approved') { // Исправлено на 'approved'
                counts.processed = item._count.status; // Увеличиваем счетчик обработанных
            } else if (item.status === 'rejected') {
                counts.rejected = item._count.status;
            } else if (item.status === 'pending') {
                counts.pending = item._count.status;
            }
        });

        res.status(200).json(counts);
    } catch (error) {
        console.error('Ошибка при получении количества откликов по статусу:', error);
        res.status(500).json({ message: 'Ошибка при получении количества откликов по статусу.' });
    }
}
