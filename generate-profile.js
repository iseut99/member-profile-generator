// api/generate-profile.js

import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const { companyName, sourceText } = await req.json()

  const prompt = `Write a short, professional company bio for "${companyName}" using this information:\n\n${sourceText}`

  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.7
  })

  const output = chat.choices[0].message.content
  return NextResponse.json({ output })
}
