export default async function GenerateAI(profile) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-20b",

          temperature: 0.4,

          max_tokens: 2500,

          response_format: {
            type: "json_object",
          },

          messages: [
            {
              role: "system",

              content: `
You are an expert gym trainer.

Create a personalized 5-day workout plan based on the user's profile.

IMPORTANT:

1. Create exactly these 5 days:
Monday, Tuesday, Wednesday, Thursday, Friday.

2. Saturday and Sunday must NOT be included.

3. Each day MUST contain exactly 2 exercises.

4. Each day must have different exercises.

5. Match the workout with:
- Goal
- Weight
- Height
- Experience
- Activity level
- Equipment
- Injuries
- Workout duration

6. Avoid exercises that conflict with injuries.

7. Keep the workout safe and suitable for the user's experience level.

8. Return ONLY valid JSON.

9. Do NOT include Markdown or explanations.

Use EXACTLY this structure:

{
  "Monday": {
    "focus": "",
    "duration_minutes": 0,
    "exercises": [
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      },
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      }
    ]
  },

  "Tuesday": {
    "focus": "",
    "duration_minutes": 0,
    "exercises": [
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      },
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      }
    ]
  },

  "Wednesday": {
    "focus": "",
    "duration_minutes": 0,
    "exercises": [
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      },
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      }
    ]
  },

  "Thursday": {
    "focus": "",
    "duration_minutes": 0,
    "exercises": [
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      },
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      }
    ]
  },

  "Friday": {
    "focus": "",
    "duration_minutes": 0,
    "exercises": [
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      },
      {
        "name": "",
        "sets": 0,
        "reps": "",
        "rest_seconds": 0
      }
    ]
  }
}

Remember:
- Exactly 5 days.
- Exactly 2 exercises per day.
- No Saturday/Sunday.
- Complete JSON only.
`,
            },

            {
              role: "user",

              content: `
Create my 5-day workout plan.

Age: ${profile?.age ?? "Not provided"}
Gender: ${profile?.gender ?? "Not provided"}
Height: ${profile?.height ?? "Not provided"} cm
Weight: ${profile?.weight ?? "Not provided"} kg
Target Weight: ${profile?.targetWeight ?? "Not provided"} kg
Goal: ${profile?.goal ?? "General fitness"}
Activity Level: ${profile?.activityLevel ?? "Moderately Active"}
Experience: ${profile?.experience ?? "Beginner"}
Equipment: ${profile?.equipment ?? "Gym equipment"}
Workout Location: ${profile?.workoutLocation ?? "Gym"}
Workout Duration: ${profile?.workoutDuration ?? 60} minutes
Injuries: ${profile?.injuries ?? "None"}

Give exactly 2 exercises for each day.
`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      return null;
    }

    const answer = data.choices?.[0]?.message?.content;

    console.log("AI Response:", answer);

    return answer;

  } catch (error) {
    console.error("GenerateAI Error:", error);
    return null;
  }
}