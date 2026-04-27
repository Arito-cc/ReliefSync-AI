import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export const getBestVolunteerAI = async (task, candidates) => {
  try {
    // 🔥 SAFETY: no candidates
    if (!candidates || candidates.length === 0) {
      return {
        name: null,
        reason: "No candidates available",
      };
    }

    // 🔥 NO API KEY → fallback immediately (CRITICAL)
    if (!genAI) {
      return {
        name: candidates[0].name,
        reason: "Fallback: AI disabled (no API key)",
      };
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
You are an AI disaster response coordinator.

Task:
Title: ${task.title}
Skill: ${task.requiredSkill}
Priority: ${task.priority}

Volunteers:
${candidates
  .map(
    (v, i) =>
      `${i + 1}. ${v.name} | Skills: ${v.skills.join(
        ", "
      )} | Available: ${v.availability}`
  )
  .join("\n")}

Choose the BEST volunteer.

Return ONLY JSON:
{
  "name": "volunteer name",
  "reason": "short reason"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 🔥 HARDENED PARSER
    let parsed;

    try {
      const cleaned = text
        .replace(/```json|```/g, "")
        .replace(/\n/g, " ")
        .trim();

      // try direct parse
      parsed = JSON.parse(cleaned);

    } catch {
      // 🔥 fallback: extract JSON manually
      const match = text.match(/\{.*\}/s);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("AI response not parsable");
      }
    }

    // 🔥 FINAL VALIDATION
    if (!parsed?.name) {
      throw new Error("Invalid AI output");
    }

    return {
      name: parsed.name,
      reason: parsed.reason || "AI selected",
    };

  } catch (err) {
    console.log("AI ERROR:", err.message);

    // 🔥 ALWAYS SAFE FALLBACK (NO BREAKING SYSTEM)
    return {
      name: candidates[0].name,
      reason: "Fallback: rule-based selection",
    };
  }
};