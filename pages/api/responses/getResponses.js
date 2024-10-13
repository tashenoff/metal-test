// pages/api/responses/getResponses.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    const { responderId } = req.query;

    try {
        const parsedResponderId = parseInt(responderId, 10);

        const responses = await prisma.response.findMany({
            where: {
                responderId: parsedResponderId,
            },
            include: {
                listing: { // Здесь мы включаем связанную модель Listing
                    select: {
                        title: true,
                        content: true,
                        published: true,
                        responses: true,
                        author: { // Включаем информацию об авторе объявления
                            select: {
                                name: true,
                                companyName: true,
                                phoneNumber: true,
                                email: true,
                                companyBIN: true,
                                
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json(responses);
    } catch (error) {
        console.error('Ошибка при получении откликов:', error);
        res.status(500).json({ message: 'Ошибка при получении откликов.' });
    }
}
