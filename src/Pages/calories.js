export const calculateCalories = (profile) => {
  const {
    age,
    gender,
    height,
    weight,
    activityLevel,
    goal,
  } = profile;

  // BMR
  let bmr;

  if (gender === "Male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier
  const activityMultiplier = {
    "Sedentary": 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
    "Extremely Active": 1.9,
  };

  const maintenanceCalories =
    bmr * (activityMultiplier[activityLevel] || 1.2);

  // Goal adjustment
  let calories = maintenanceCalories;

  if (goal === "Weight Loss") {
    calories -= 500;
  } else if (goal === "Weight Gain") {
    calories += 300;
  }

  return Math.round(calories);
};