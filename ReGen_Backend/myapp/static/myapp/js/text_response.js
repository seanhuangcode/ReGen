function sendResponse() {
    const responseText = document.getElementById("responseText").value;

    fetch('http://localhost:8000/gen_from_text/', {
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        alert('Response sent successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
    window.location.href = 'http://localhost:8000/gen_from_text/';
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}