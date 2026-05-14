import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { url, method } = req;
  const aiPath = url?.replace('/api/ai/', '');

  if (!url?.startsWith('/api/ai/')) {
    if (url === '/api/health') {
       return res.status(200).json({ status: 'ok', service: '𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 API (Vercel)' });
    }
    return res.status(404).json({ error: 'Not Found' });
  }

  try {
    const keyExists = !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
    console.log(`[AI API] Request to ${aiPath} - Key configured: ${keyExists}`);

    const { 
      analyzeFood, 
      chatLeanAI, 
      generateRecipes, 
      generateDietPlan, 
      generateFridgeRecipes, 
      generateWorkouts, 
      generateDailyMotivation, 
      generateShoppingList, 
      generateFullDiet, 
      swapMeal, 
      generateDietSuggestion 
    } = await import('./ai-logic');

    if (method === 'POST') {
      switch (aiPath) {
        case 'analyze-food':
          return res.json(await analyzeFood(req.body.imageUri));
        case 'chat':
          return res.json({ text: await chatLeanAI(req.body.message, req.body.userData, req.body.history) });
        case 'generate-recipes':
          return res.json(await generateRecipes(req.body.query));
        case 'generate-diet':
          return res.json(await generateDietPlan(req.body.userData));
        case 'fridge-recipes':
          return res.json(await generateFridgeRecipes(req.body.ingredients));
        case 'workouts':
          return res.json(await generateWorkouts(req.body.query, req.body.time));
        case 'shopping-list':
          return res.json(await generateShoppingList(req.body.goal, req.body.currentItems));
        case 'full-diet':
          return res.json(await generateFullDiet(req.body.profile, req.body.dietType));
        case 'swap-meal':
          return res.json(await swapMeal(req.body.currentMeal, req.body.dietType));
        case 'diet-suggestion':
          return res.json({ text: await generateDietSuggestion(req.body.profile) });
        default:
          return res.status(404).json({ error: 'AI Endpoint Not Found' });
      }
    } else if (method === 'GET') {
      if (aiPath === 'motivation') {
        return res.json({ text: await generateDailyMotivation() });
      }
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error(`AI Error (${aiPath}):`, error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
}
