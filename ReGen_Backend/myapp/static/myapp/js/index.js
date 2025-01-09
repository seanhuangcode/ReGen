const video = document.getElementById('video');
const startVideoBtn = document.getElementById('start-video-btn');
const takePhotoBtn = document.getElementById('take-photo-btn');
const canvas = document.getElementById('canvas');
const retakeBtn = document.getElementById('retake-photo-btn');
const genBtn = document.getElementById('gen');
const imgUpload = document.getElementById('upload-image')
let stream;

console.log(retakeBtn);

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

  retakeBtn.style.display = 'inline';
  canvas.style.display = 'inline';
  takePhotoBtn.style.display = 'none'; 

});

retakeBtn.addEventListener('click', function () {
  canvas.style.display = 'none';
  retakeBtn.style.display = 'none';
  takePhotoBtn.style.display = 'inline';
});

genBtn.addEventListener('click', function () {
  const imageData = canvas.toDataURL('image/png');
  const blob = dataURItoBlob(imageData);
  const formData = new FormData();

  formData.append('image', blob, 'photo.png'); 

  fetch('http://localhost:8000/gen_from_img/', {
    method: 'POST', 
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log('Response from server:', data);
    })
    .catch(error => {
      console.error('Error uploading image:', error);
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
