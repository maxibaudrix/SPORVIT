import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, buildUserPrompt } from "@/lib/ai/planningPrompts";

export async function POST(req: NextRequest) {
  try {
    const context = await req.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY no configurada");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // CORRECCIÓN: Estructura correcta para el SDK @google/genai
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ 
        role: "user", 
        parts: [{ text: buildUserPrompt(context) }] 
      }],
      config: {
        // La instrucción del sistema ahora se pasa como un objeto Content dentro de config
        systemInstruction: {
          parts: [{ text: getSystemPrompt() }]
        },
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    // CORRECCIÓN: Acceso seguro al contenido generado
    const planText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!planText) {
      throw new Error("La IA no devolvió contenido");
    }

    const plan = JSON.parse(planText);

    return NextResponse.json({
      success: true,
      plan: plan,
      redirectTo: "/onboarding/welcome"
    });

  } catch (error: any) {
    console.error("🔴 [SERVER ERROR]:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: "Error en la IA: " + error.message 
    }, { status: 500 });
  }
}