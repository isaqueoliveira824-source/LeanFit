import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { url } = req;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  const pathname = url.split('?')[0];

  if (pathname === '/api/health') {
    return res.status(200).json({ status: 'ok', service: '𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 API (Vercel)' });
  }

  return res.status(404).json({ error: 'API route not found' });
}

