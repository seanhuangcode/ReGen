function getCSRFToken() {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/);
    console.log('CSRF Token:', csrfToken ? csrfToken[1] : 'Not found');
    return csrfToken ? csrfToken[1] : null;
}

const csrftoken = getCSRFToken();
const upload = document.getElementById("img_upload")
const gen = document.getElementById("gen")
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

            const blob = dataURItoBlob(imageData); 
            
            const formData = new FormData();
            formData.append('image', blob, 'photo.png');

            console.log("FormData ready for upload:", formData);

            fetch('http://localhost:8000/gen_from_img/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,  
                },
                body: formData,
                credentials: 'same-origin', 
            })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
            })
            .catch(error => {
                console.error('Error uploading image:', error);
            });
        };

        reader.readAsDataURL(file); 
    };
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