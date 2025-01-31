const upload = document.getElementById("img_upload");
const gen = document.getElementById("gen");
let file = null;

upload.addEventListener("change", function(event) {
    file = event.target.files[0]; 

    if (file) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var preview = document.getElementById("preview");
            preview.src = e.target.result; 
            preview.style.height = "16vh";
            preview.style.width = "auto";
            preview.style.borderRadius = "20px";
        };

        reader.readAsDataURL(file); 
    }
});

gen.addEventListener('click', function () {
    if (file != null) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const imageData = e.target.result; 
            const API_KEY = '';

            const blob = dataURItoBlob(imageData);

            const base64Image = imageData.split(',')[1];

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
                                text: `Create a relatively healthy recipe using the ingredients 
                                in the image and try to stick to the given ingredients. 
                                Please start the recipe with the title.
                                       Format the response as follows:
                                       Recipe Name:
                                       Ingredients:
                                       Instructions:
                                       Cooking Time:
                                       Servings:`
                            },
                            {
                                inline_data: {
                                    mime_type: "image/png", 
                                    data: base64Image
                                }
                            }
                        ]
                    }]
                })
            })
            .then(response => response.json()) 
            .then(data => {
                console.log('Response from server:', data);

                if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                    const recipe = data.candidates[0].content.parts[0].text;
                    sessionStorage.setItem('imageData', imageData); 
                    sessionStorage.setItem('recipeData', JSON.stringify(recipe));

                    window.location.href = '../html/recipe.html';
                } else {
                    console.error('Invalid response format:', data);
                }
            })
            .catch(error => {
                console.error('Error generating recipe:', error); 
            })
            .finally(() => {
                // Reset button text
                gen.textContent = 'Generate!';
            });
        };

        reader.readAsDataURL(file); 
    }
});
  
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}