from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
from django.core.files.base import ContentFile
import google.generativeai as genai

from PIL import Image
import io
import base64

def index(request):
    return render(request, 'myapp/index.html')

def take_image(request):
    return render(request, "myapp/take_image.html")

def choice(request):
    return render(request, "myapp/choice.html")

def text_response(request):
    return render(request, "myapp/text_response.html")

@csrf_exempt  

def gen_from_img(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']

        image_name = image.name

        pil_img = Image.open(image)

        image_byte_array = io.BytesIO()
        pil_img.save(image_byte_array, format="PNG")  
        image_byte_array = image_byte_array.getvalue()

        genai.configure(api_key="")

        model = genai.GenerativeModel(model_name="gemini-1.5-pro")

        image_data = base64.b64encode(image_byte_array).decode('utf-8')
        prompt = "Generate a delicious yet healthy recipe of all the food in this image with minimal extra ingredients. Type the word \'NO\' if there is not enough food to make a recipe"

        data = [{'mime_type': 'image/png', 'data': image_data}, prompt]

        response = model.generate_content(data)

        print(response.text)
    
        context = {
        'recipe': response
            }
        return render(request, 'myapp/recipe.html', context)
    
    return JsonResponse({'message': 'No image uploa sid9fsdofodshfdois ded.'}, status=400)