// pages/api/responses/[id].js
import prisma from '../../../prisma/client';

export default async function handler(req, res) {
  const { id } = req.query; // ID отклика
  const { status } = req.body; // Новый статус

  if (req.method === 'PATCH') {
    const updatedResponse = await prisma.response.update({
      where: { id: Number(id) },
      data: { status },
    });

    return res.status(200).json(updatedResponse);
  }

  res.setHeader('Allow', ['PATCH']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
