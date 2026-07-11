# Cooking List App

A simple React + Tailwind single-page app that uses the Gemini API to generate a personalized meal plan, grocery list, substitutions, and budget status.

## Features
- Budget, people count, diet, and cooking time inputs
- Optional ingredient list for smarter planning
- AI-generated breakfast, lunch, dinner, grocery list, substitutions, and cost estimate
- Budget comparison with clear pass/fail feedback
- Loading spinner and graceful error handling

## Local development
1. Install dependencies: npm install
2. Start the dev server: npm run dev
3. Set the Gemini API key in a Vercel environment variable named GEMINI_API_KEY

## Deployment
This app is ready for Vercel. Add the GEMINI_API_KEY environment variable in the Vercel project settings and deploy the repository.
