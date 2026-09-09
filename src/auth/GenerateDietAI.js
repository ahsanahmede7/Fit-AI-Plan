export default async function GenerateDietAI(profile) {
  try {
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey) {
      console.error("Groq API key is missing.");
      return null;
    }

    const systemPrompt = `
You are an expert nutrition and diet planning assistant.

Create a personalized 7-day diet plan using the user's profile.

STRICT OUTPUT RULES:

- Return ONLY valid JSON.
- No Markdown.
- No code fences.
- No explanation outside JSON.
- Exactly these 7 keys:
  Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.

Each day must contain:
- total_calories
- total_protein_g
- total_carbs_g
- total_fat_g
- water_liters
- tip
- meals

Each day must have exactly 4 meals:
Breakfast, Lunch, Snack, Dinner.

Each meal must contain:
- name
- description
- calories
- protein_g
- carbs_g
- fat_g

Use numbers for calories, protein_g, carbs_g, fat_g and water_liters.

Rules:
- Make meals different throughout the week.
- Respect diet preference.
- Never include foods listed in allergies.
- Consider age, gender, height, weight, target weight, goal, activity level, budget and meals per day.
- Use realistic calories.
- For weight loss use a reasonable calorie deficit.
- For weight gain use a reasonable calorie surplus.
- Do not recommend extreme calorie restriction.
- Prefer commonly available foods.
- Do not provide medical treatment.
- If serious medical conditions are mentioned, recommend consulting a qualified healthcare professional.

The response MUST be valid JSON matching this structure:

{
  "Monday": {
    "total_calories": 0,
    "total_protein_g": 0,
    "total_carbs_g": 0,
    "total_fat_g": 0,
    "water_liters": 0,
    "tip": "",
    "meals": {
      "Breakfast": {
        "name": "",
        "description": "",
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0
      },
      "Lunch": {
        "name": "",
        "description": "",
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0
      },
      "Snack": {
        "name": "",
        "description": "",
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0
      },
      "Dinner": {
        "name": "",
        "description": "",
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0
      }
    }
  }
}

Use exactly the same structure for all 7 days.
`;

    const userPrompt = `
Create my personalized 7-day diet plan.

User Profile:

Age: ${profile?.age ?? "Not provided"}
Gender: ${profile?.gender ?? "Not provided"}
Height: ${profile?.height ?? "Not provided"} cm
Weight: ${profile?.weight ?? "Not provided"} kg
Target Weight: ${profile?.targetWeight ?? "Not provided"} kg
Goal: ${profile?.goal ?? "General fitness"}
Activity Level: ${profile?.activityLevel ?? "Moderately Active"}
Diet Preference: ${profile?.diet ?? "No Preference"}
Allergies: ${profile?.allergies ?? "None"}
Budget: ${profile?.budget ?? "Not provided"}
Meals Per Day: ${profile?.mealsPerDay ?? 4}
Experience: ${profile?.experience ?? "Beginner"}
Workout Location: ${profile?.workoutLocation ?? "Gym"}

Return ONLY valid JSON.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-20b",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],

          temperature: 0.2,

          max_completion_tokens: 12000,

          reasoning_effort: "low",

          response_format: {
            type: "json_object",
          },
        }),
      }
    );

    const data = await response.json();

    // API error
    if (!response.ok) {
      console.error("Groq API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: data?.error,
      });

      return null;
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      console.error("Groq returned an empty response.");
      return null;
    }

    console.log("Raw AI Diet Response:", answer);

    // Convert JSON string → JavaScript object
    let diet;

    try {
      diet = JSON.parse(answer);
    } catch (parseError) {
      console.error("AI returned invalid JSON:", parseError);
      console.error("Raw response:", answer);

      return null;
    }

    // Basic validation
    const requiredDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const missingDays = requiredDays.filter(
      (day) => !diet?.[day]
    );

    if (missingDays.length > 0) {
      console.error(
        "AI diet is missing days:",
        missingDays
      );

      return null;
    }

    // Validate meals
    for (const day of requiredDays) {
      const meals = diet[day]?.meals;

      if (!meals) {
        console.error(
          `Meals missing for ${day}`
        );
        return null;
      }

      const requiredMeals = [
        "Breakfast",
        "Lunch",
        "Snack",
        "Dinner",
      ];

      for (const meal of requiredMeals) {
        if (!meals[meal]) {
          console.error(
            `${meal} missing for ${day}`
          );

          return null;
        }
      }
    }

    console.log("AI Diet successfully generated:", diet);

    return diet;

  } catch (error) {
    console.error(
      "GenerateDietAI Error:",
      error
    );

    return null;
  }
}
