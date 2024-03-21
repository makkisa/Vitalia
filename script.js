// get references to all the input elements
const genderInputs = document.querySelectorAll('input[name="sex"]');
const ageRangeInput = document.getElementById('age_range');
const weightInput = document.getElementById('weight');
const heightInput = document.getElementById('height');
const goalInput = document.getElementById('goal');
const physicalBuildInput = document.getElementById('physical-build');
const bodyGoalInput = document.getElementById('body-goal');
const activityInput = document.getElementById('activity');
const preferencesFoodInput = document.getElementById('preferencesFood');
const exerciseTypeInput = document.getElementById('exercise-type');
const suggestionsInput = document.getElementById('suggestions');

// extract values from input elements
let sex;
for (const genderInput of genderInputs) {
  if (genderInput.checked) {
    sex = genderInput.value;
    break;
  }
}

const ageRange = ageRangeInput.value;
const weight = weightInput.value;
const height = heightInput.value;
const goal = goalInput.value;
const physicalBuild = physicalBuildInput.value;
const bodyGoal = bodyGoalInput.value;
const activity = activityInput.value;
const preferencesFood = preferencesFoodInput.value.split(',').map(item => item.trim());
const exerciseType = exerciseTypeInput.value;
const suggestions = suggestionsInput.value;

document.getElementById("submit").addEventListener("click", function () {
  event.preventDefault(); // prevent form submission

    var isValid = true;
    var errorMessages = document.getElementsByClassName("error");

    // hide all error messages and symbols
    for (var i = 0; i < errorMessages.length; i++) {
        errorMessages[i].style.display = "none";
    }

    // validate gender
    var gender = document.querySelector('input[name="sex"]:checked');
    if (!gender) {
        document.getElementById("gender-error").style.display = "inline"; // show error message
        document.getElementById("gender-error").innerHTML = "*"; // display error symbol
        window.scrollTo({
          top: 1050,
          behavior: "smooth"
        });
        isValid = false;
    }

    // validate age
    var age = document.getElementById("age_range").value;
    if (age === "") {
        document.getElementById("age-error").style.display = "inline"; // show error message
        document.getElementById("age-error").innerHTML = "*"; // display error symbol
        window.scrollTo({
          top: 1050,
          behavior: "smooth"
        });
        isValid = false;
    }

    // validate weight
    var weight = document.getElementById("weight").value;
    if (weight === "") {
        document.getElementById("weight-error").style.display = "inline"; // show error message
        document.getElementById("weight-error").innerHTML = "*"; // sisplay error symbol
        window.scrollTo({
          top: 1050,
          behavior: "smooth"
        });
        isValid = false;
    }

    // validate height
    var height = document.getElementById("height").value;
    if (height === "") {
        document.getElementById("height-error").style.display = "inline"; // show error message
        document.getElementById("height-error").innerHTML = "*"; // display error symbol
        window.scrollTo({
          top: 1050,
          behavior: "smooth"
        });
        isValid = false;
    }

    if (isValid) {
      sendToChatGPT();
      startLoadingAnimation();

      window.scrollTo({
        top: 1050,
        behavior: "smooth"
      });
    }
});

// API key
const API_KEY = "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";

async function sendToChatGPT() {
  const mealFrequencyInput = document.getElementById('mealFrequency');
  const mealFrequency = mealFrequencyInput.value;

  // adjust the message template based on the meal frequency
  let mealPlanMessage = '';

  for (let i = 1; i <= mealFrequency; i++) {
    mealPlanMessage += `Meal ${i}:\n`;
    mealPlanMessage += `- [Meal Details] - Calories: [Calorie Count] -Quantity: [Food Quantity] mg\n`;
  }

  const daysTrainInput = document.getElementById('daysTrain');
  const daysTrain = daysTrainInput.value;

  // adjust the message template based on the number of training days
  let scheduleMessage = '';

  for (let i = 1; i <= daysTrain; i++) {
    scheduleMessage += `Day ${i}:\n`;
    for (let j = 1; j <= 6; j++) {
      scheduleMessage += `Exercise ${j}: [Exercise Name] - Reps: [Number of Reps] x Sets: [Number of Sets]- Calories Burned: [Calories Burned]\n`;
    }
  }
  const messagePrompt = `
User Information:
- Sex: ${sex}
- Age Range: ${ageRange}
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Physical Build: ${physicalBuild}
- Body Goal: ${bodyGoal}
- Activity Level: ${activity}
- Preferences Food: ${preferencesFood.join(', ')}
- Exercise Type: ${exerciseType}
- Times Train: ${daysTrain}
- Suggestions: ${suggestions}

Fitness Schedule:
  
  ${scheduleMessage}

Meal Plan:
    
    ${mealPlanMessage}
    take the user inputs seriously and create a fitness schedule and meal plan based on the provided information,ensuring not to neglect any inputs entered by the user. I want you to act as a personal trainer. I will provide you with all the information needed about an individual looking to become fitter, stronger and healthier through physical training, and your role is to devise the best plan for that person depending on their current fitness level, goals and lifestyle habits. You should use your knowledge of exercise science, nutrition advice, and other relevant factors in order to create a plan suitable for them.When the user Preferences Food, such as eggs or any choice the user writes please take that seriously and add the ingredient user wants in evrey meals. Even when user says have Suggestions and suffers from a health problem, please take that into consideration and work according to the user input.`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful fitness assistant." }, { role: "user", content: messagePrompt }],
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    options
  );
  const data = await response.json();
  const messageContent = data.choices[0].message.content;

  // split the message content into an array of lines
  const lines = messageContent.split('\n');

  // create a new HTML element to hold the formatted content
  const contentDisplay = document.getElementById("content-display");
  contentDisplay.innerHTML = '';

  // iterate through the lines and add them as separate paragraphs
  lines.forEach(line => {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    contentDisplay.appendChild(paragraph);
  });
  sendToChatGPTBMI();
}

async function sendToChatGPTBMI() {
  const genderInputsBMI = document.querySelectorAll('input[name="sex"]');
  const ageRangeInputBMI = document.getElementById('age_range');
  const weightInputBMI = document.getElementById('weight');
  const heightInputBMI = document.getElementById('height');
  const activityInputBMI = document.getElementById('activity');
  const goalInputBMI = document.getElementById('goal');

  const ageRangeBMI = ageRangeInputBMI.value;
  const weightBMI = weightInputBMI.value;
  const heightBMI = heightInputBMI.value;
  const activityBMI = activityInputBMI.value;
  const goalBMI = goalInputBMI.value;

  let sexBMI;
  for (const genderInputBMI of genderInputsBMI) {
    if (genderInputBMI.checked) {
      sexBMI = genderInputBMI.value;
      break;
    }
  }
  const messagePromptBMI = `
Age: [${ageRangeBMI}]
Sex: [${sexBMI}]
Height: [${heightBMI} cm] 
Weight: [${weightBMI} kg]
Activity Level: [${activityBMI}]
Goal: ${goalBMI}
just show me Results in response . 
Results:
- Your BMI: [BMI]
- Estimated Daily Caloric Intake: [Estimated Caloric Intake]
-Energy intake to your goal: [Calories Burned]
- Body Status: [Body Status]

Please note that these calculations are based on established scientific formulas and principles. We are providing you with the BMI value without disclosing the specific calculation method. Additionally, we have assessed your body status based on six metrics:
1. extreme weak
2. weak
3. normal
4. overweight
5. obesity
6. extreme obesity

Your safety and progress are our top priorities. Based on this assessment, we recommend a daily caloric intake and expenditure that aligns with your goals. Thank you for entrusting us with your fitness journey.
`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful fitness assistant." }, { role: "user", content: messagePromptBMI }],
    }),
  };

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    options
  );
  const data = await response.json();
  const messageContent = data.choices[0].message.content;

  // split the message content into an array of lines
  const lines = messageContent.split('\n');

  // create a new HTML element to hold the formatted content
  const contentDisplay = document.getElementById("BMI-display");
  contentDisplay.innerHTML = '';

  // iterate through the lines and add them as separate paragraphs
  lines.forEach(line => {
    const paragraph = document.createElement('p');
    paragraph.textContent = line;
    contentDisplay.appendChild(paragraph);
  });
  stopLoadingAnimation();
}

// function to start the loading animation
function startLoadingAnimation() {
  // create overlay element
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  document.body.appendChild(overlay);

  // create loading animation element with GIF
  const ringElement = document.createElement('div');
  ringElement.style.borderColor = '#DBAA39';
  ringElement.classList.add('ring');

  // apply circular mask to the GIF
  const gifElement = document.createElement('img');
  gifElement.src = 'loading.gif';
  gifElement.alt = 'loading';
  gifElement.style.borderRadius = '50%';
  gifElement.style.width = '100px';
  gifElement.style.height = '100px';
  gifElement.style.borderColor = '#DBAA39';

  // append the GIF element to the ring element
  ringElement.appendChild(gifElement);

  // set CSS properties for overlay
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0, 0, 0, 0.5)'; // semi-transparent black background
  overlay.style.zIndex = '9998'; // lower z-index to keep it behind loading animation

  // set CSS properties for loading animation
  ringElement.style.position = 'fixed'; // set position to fixed
  ringElement.style.top = '50%';
  ringElement.style.left = '50%';
  ringElement.style.transform = 'translate(-50%,-50%)';
  ringElement.style.zIndex = '9999'; // higher z-index to keep it on top

  // append the ring element to the body
  document.body.appendChild(ringElement);
}

// function to stop the loading animation
function stopLoadingAnimation() {
  const overlay = document.querySelector('.overlay');
  const ringElement = document.querySelector('.ring');

  overlay.remove();
  ringElement.remove();
}