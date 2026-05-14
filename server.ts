import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: '𝗟𝗲𝗮𝗻 𝗙𝗶𝘁 API' });
  });

  // --- AI ROUTES ---
  app.post('/api/ai/analyze-food', async (req, res) => {
    try {
      const { imageUri } = req.body;
      const { analyzeFood } = await import('./src/services/ai.server');
      const result = await analyzeFood(imageUri);
      res.json(result);
    } catch (error) {
      console.error('AI Error (analyze-food):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, userData, history } = req.body;
      const { chatLeanAI } = await import('./src/services/ai.server');
      const result = await chatLeanAI(message, userData, history);
      res.json({ text: result });
    } catch (error) {
      console.error('AI Error (chat):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/generate-recipes', async (req, res) => {
    try {
      const { query } = req.body;
      const { generateRecipes } = await import('./src/services/ai.server');
      const result = await generateRecipes(query);
      res.json(result);
    } catch (error) {
      console.error('AI Error (generate-recipes):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/generate-diet', async (req, res) => {
    try {
      const { userData } = req.body;
      const { generateDietPlan } = await import('./src/services/ai.server');
      const result = await generateDietPlan(userData);
      res.json(result);
    } catch (error) {
      console.error('AI Error (generate-diet):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/fridge-recipes', async (req, res) => {
    try {
      const { ingredients } = req.body;
      const { generateFridgeRecipes } = await import('./src/services/ai.server');
      const result = await generateFridgeRecipes(ingredients);
      res.json(result);
    } catch (error) {
      console.error('AI Error (fridge-recipes):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/workouts', async (req, res) => {
    try {
      const { query, time } = req.body;
      const { generateWorkouts } = await import('./src/services/ai.server');
      const result = await generateWorkouts(query, time);
      res.json(result);
    } catch (error) {
      console.error('AI Error (workouts):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.get('/api/ai/motivation', async (req, res) => {
    try {
      const { generateDailyMotivation } = await import('./src/services/ai.server');
      const result = await generateDailyMotivation();
      res.json({ text: result });
    } catch (error) {
      console.error('AI Error (motivation):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/shopping-list', async (req, res) => {
    try {
      const { goal, currentItems } = req.body;
      const { generateShoppingList } = await import('./src/services/ai.server');
      const result = await generateShoppingList(goal, currentItems);
      res.json(result);
    } catch (error) {
      console.error('AI Error (shopping-list):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/full-diet', async (req, res) => {
    try {
      const { profile, dietType } = req.body;
      const { generateFullDiet } = await import('./src/services/ai.server');
      const result = await generateFullDiet(profile, dietType);
      res.json(result);
    } catch (error) {
      console.error('AI Error (full-diet):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/swap-meal', async (req, res) => {
    try {
      const { currentMeal, dietType } = req.body;
      const { swapMeal } = await import('./src/services/ai.server');
      const result = await swapMeal(currentMeal, dietType);
      res.json(result);
    } catch (error) {
      console.error('AI Error (swap-meal):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  app.post('/api/ai/diet-suggestion', async (req, res) => {
    try {
      const { profile } = req.body;
      const { generateDietSuggestion } = await import('./src/services/ai.server');
      const result = await generateDietSuggestion(profile);
      res.json({ text: result });
    } catch (error) {
      console.error('AI Error (diet-suggestion):', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
