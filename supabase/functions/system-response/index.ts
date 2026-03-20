import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { behavior, simulationResult } = await req.json();

    if (!behavior || !simulationResult) {
      return new Response(
        JSON.stringify({ error: "Missing behavior or simulation result" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "System not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `Given this financial behavior: "${behavior}"

And this simulation analysis:
- Individual Impact: ${simulationResult.individual}
- Collective Impact: ${simulationResult.collective}
- Pressure Points: ${simulationResult.pressure}
- Lever for Change: ${simulationResult.lever}

Analyze the systemic risk and generate a system response.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are SOCIETY.EXE — an agentic reality system that observes societal patterns and generates systemic responses. You analyze behaviors at scale and predict system-level consequences. You are calm, precise, and institutional. Never give personal advice.`,
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_system_response",
              description: "Generate a structured system response to a societal behavior pattern",
              parameters: {
                type: "object",
                properties: {
                  risk_level: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Overall systemic risk level of this behavior at scale",
                  },
                  risk_explanation: {
                    type: "string",
                    description: "One sentence explaining why this pattern is concerning at scale (max 120 chars)",
                  },
                  system_actions: {
                    type: "array",
                    items: { type: "string" },
                    description: "Exactly 3 short system status indicators describing what is happening (e.g. 'Spending pressure increasing'). Each max 40 chars.",
                  },
                  if_continues: {
                    type: "string",
                    description: "One sentence: what happens if this pattern continues unchecked (max 100 chars)",
                  },
                  if_shifts: {
                    type: "string",
                    description: "One sentence: what improves if 10% of people shift behavior (max 100 chars)",
                  },
                },
                required: ["risk_level", "risk_explanation", "system_actions", "if_continues", "if_shifts"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_system_response" } },
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (status === 402) {
        return new Response(
          JSON.stringify({ error: "Service credits exhausted." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", status);
      return new Response(
        JSON.stringify({ error: "Unable to generate system response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      // Ensure system_actions has exactly 3 items
      if (result.system_actions && result.system_actions.length > 3) {
        result.system_actions = result.system_actions.slice(0, 3);
      }
      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Failed to parse response" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("System response error:", error);
    return new Response(
      JSON.stringify({ error: "System error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
