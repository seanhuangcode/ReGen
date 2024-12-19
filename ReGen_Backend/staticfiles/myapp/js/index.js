const video = document.getElementById('video');
const startVideoBtn = document.getElementById('start-video-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const canvas = document.getElementById('canvas');
const photo = document.getElementById('photo');
const saveBtn = document.getElementById('save-btn');
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

  const imageData = canvas.toDataURL('image/png');
  photo.src = imageData;
  photo.style.display = 'block'; 

  saveBtn.style.display = 'inline';
});

saveBtn.addEventListener('click', function () {
  const imageData = photo.src;

  fetch('/save-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: imageData })
  })
  .then(response => response.json())
  .then(data => {
    alert('Image saved successfully!');
  })
  .catch(error => {
    console.error('Error saving image:', error);
  });
});