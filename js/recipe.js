window.addEventListener('DOMContentLoaded', function() {
    const imageData = sessionStorage.getItem('imageData');
    const recipeData = sessionStorage.getItem('recipeData');

    if (imageData && recipeData) {
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.src = imageData;
        }

        const recipeDiv = document.getElementById('recipe');
        if (recipeDiv) {
            recipeDiv.innerHTML = formatRecipe(JSON.parse(recipeData));
        }

        sessionStorage.removeItem('imageData');
        sessionStorage.removeItem('recipeData');
    } else if (recipeData) {
        const recipeDiv = document.getElementById('recipe');
        if (recipeDiv) {
            recipeDiv.innerHTML = formatRecipe(JSON.parse(recipeData));
        }

        sessionStorage.removeItem('recipeData');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const recipeContent = document.querySelector('.recipe-content');
    
    if (recipeContent) {
        recipeContent.innerHTML = formatRecipe(recipeContent.innerHTML);
    }
});

function formatRecipe(recipeText) {
    return recipeText.split('\n')
        .map(line => {
            if (line.toLowerCase().includes('recipe name:')) {
                return `<h1>${line}</h1>`;
            } else if (line.toLowerCase().includes('ingredients:')) {
                return `<h2>${line}</h2>`;
            } else if (line.toLowerCase().includes('instructions:')) {
                return `<h2>${line}</h2>`;
            } else if (line.toLowerCase().includes('cooking time:')) {
                return `<h2>${line}</h2>`;
            } else if (line.toLowerCase().includes('servings:')) {
                return `<h2>${line}</h2>`;
            } else if (line.trim()) {
                return `<p>${line}</p>`;
            }
            return '';
        })
        .join('');
}