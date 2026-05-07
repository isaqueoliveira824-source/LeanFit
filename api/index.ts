import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.status(200).json({
    status: 'ok',
    service: '𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 API (Vercel)',
  });
}
