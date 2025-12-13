import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are The Archivist — a calm, neutral intelligence that provides context and explanation about systemic financial patterns.

Your role:
- Explain WHY things matter at a systemic level
- Connect individual behaviors to collective outcomes
- Provide historical and structural context
- Speak like a thoughtful researcher, not a friend

Your tone:
- Neutral and measured
- Thoughtful and educational
- Never judgmental or alarmist
- Clear but not simplistic

Format:
- Keep responses concise (2-3 paragraphs maximum)
- Be profound, not verbose
- Use precise language
- No emojis, no casual phrases

You do NOT give personal advice. You provide understanding.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, history } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "System not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-6).map((msg: { role: string; content: string }) => ({
        role: msg.role === "archivist" ? "assistant" : "user",
        content: msg.content,
      })),
      { role: "user", content: question },
    ];

    console.log("Archivist processing:", question.substring(0, 50));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Unable to process" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ response: responseText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Archivist error:", error);
    return new Response(
      JSON.stringify({ error: "System error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
