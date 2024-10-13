// pages/api/responder/[id].js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const responder = await prisma.user.findUnique({
                where: { id: Number(id) },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    companyName: true,
                    role: true,
                    city: true, // Убедись, что это поле существует в базе данных
                },
            });

            if (!responder || responder.role !== 'responder') {
                return res.status(404).json({ message: 'Респондент не найден или не является респондентом' });
            }

            return res.status(200).json(responder);
        } catch (error) {
            console.error('Ошибка при запросе респондента:', error);
            return res.status(500).json({ message: 'Ошибка сервера', error });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Метод ${req.method} не разрешен`);
    }
}
