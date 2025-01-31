const gen = document.getElementById('gen');

const API_KEY = process.env.API_KEY;

function sendResponse(event) {
    if (event){
        event.preventDefault();
    }
    const responseText = document.getElementById("responseText").value;

    gen.textContent = 'Generating...';

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    {
                        text: `Create a relatively healthy recipe using these ingredients 
                        and try to stick to the given ingredients: ${responseText}. 
                               Format the response as follows:
                               Recipe Name:
                               Ingredients:
                               Instructions:
                               Cooking Time:
                               Servings:`
                    },
                ]
            }]
        })
    })
    .then(response => response.json()) 
    .then(data => {
        console.log('Response from server:', data);

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
            const recipe = data.candidates[0].content.parts[0].text;
            sessionStorage.setItem('recipeData', JSON.stringify(recipe)); 

            window.location.href = '/recipe.html';

        } else {
            console.error('Invalid response format:', data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

document.getElementById('responseForm').addEventListener('submit', sendResponse);
