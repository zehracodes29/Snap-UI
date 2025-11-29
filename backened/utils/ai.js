
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // store your key in .env
});

const openai = new OpenAIApi(configuration);

async function generateAIUI(prompt) {
  const systemPrompt = `
You are an expert React and Tailwind developer.
Generate a complete React component based on the user's prompt.
Only return valid JSX/React code. No explanations.
`;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { generateAIUI };
