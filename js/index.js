const video = document.getElementById('video');
const startVideoBtn = document.getElementById('start-video-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const canvas = document.getElementById('canvas');
const retakeBtn = document.getElementById('retake-photo-btn');
const genBtn = document.getElementById('gen');
const imgUpload = document.getElementById('upload-image');
let stream;

startVideoBtn.addEventListener('click', function () {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
      takePhotoBtn.style.display = 'inline'; 
      startVideoBtn.style.display = 'none';  
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
    });
});

takePhotoBtn.addEventListener('click', function () {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  stream.getTracks().forEach(track => track.stop());

  retakeBtn.style.display = 'inline';
  canvas.style.display = 'block'; 
  canvas.style.width = '640px'; 
  canvas.style.height = '480px';
  takePhotoBtn.style.display = 'none'; 
  video.style.display = 'none'; 

  console.log('Canvas should be visible now');
  console.log('Canvas display style:', canvas.style.display);
  console.log('Canvas width:', canvas.style.width);
  console.log('Canvas height:', canvas.style.height);
}); 

retakeBtn.addEventListener('click', function () {
  canvas.style.display = 'none';
  retakeBtn.style.display = 'none';
  takePhotoBtn.style.display = 'inline';
  video.style.display = 'inline'; // Show the video element

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      video.srcObject = stream;
    })
    .catch(err => {
      console.error('Error accessing webcam:', err);
    });
});

genBtn.addEventListener('click', function () {
  const imageData = canvas.toDataURL('image/png');
  const API_KEY = 'AIzaSyD7rQq_zCe6BoDoeDJjVBEAlVc3GkLoFFA';

  const base64Image = imageData.split(',')[1];

  genBtn.textContent = 'Generating...';

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
  });
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
