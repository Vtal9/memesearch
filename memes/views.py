from django.shortcuts import render



from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import viewsets

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Memes
from .serializers import *
# Create your views here.

...

@api_view(['GET', 'POST', 'update'])
def memes_list(request):
    """
 List  customers, or create a new customer.
 """
    if request.method == 'GET':
        data = []
        meme = Memes.objects.all()
        page = request.GET.get('id',1)
        try:
            data = paginator.page(page)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)

        serializer = MemesSerializer(data,context={'request': request} ,many=True)
        if data.has_next():
            nextPage = data.next_page_number()
        if data.has_previous():
            previousPage = data.previous_page_number()

        return Response({'data': serializer.data , 'count': paginator.count, 'numpages' : paginator.num_pages, 'nextlink': '/api/customers/?page=' + str(nextPage), 'prevlink': '/api/customers/?page=' + str(previousPage)})

    elif request.method == 'POST':
        serializer = MemesSerializer(data=request.data)
        if serializer.is_valid():
            newid = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'update':
        try:
            meme = Memes.objects.get(id=id)
            meme.textDescription = request.data.get("textDescription")	
            meme.imageDescription = request.data.get("imageDescription")
            meme.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Memes.DoesNotExist:
            return HttpResponseNotFound("<h2>meme not found</h2>")
