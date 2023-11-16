from rest_framework import viewsets, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Tag, Page, Product, Image, HomePage, MenuItem, Social
from .serializers import CategorySerializer, TagSerializer, ProductSerializer, PageSerializer, ImageSerializer, HomePageSerializer, MenuItemSerializer, SocialSerializer

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        category = Category.objects.get(slug=slug)
        return Product.objects.filter(categories=category)

class TagProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        tag = Tag.objects.get(slug=slug)
        return Product.objects.filter(tags=tag)

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        if 'category_slug' in self.kwargs:
            queryset = queryset.filter(categories__slug=self.kwargs['category_slug'])
        if 'tag_slug' in self.kwargs:
            queryset = queryset.filter(tags__slug=self.kwargs['tag_slug'])
        return queryset

    @action(detail=False, url_path='(?P<slug>[-\w]+)', methods=['get'])
    def by_slug(self, request, slug=None, *args, **kwargs):
        product = self.get_queryset().filter(slug=slug).first()
        if product:
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not found."}, status=404)

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PageSerializer

    def get_queryset(self):
        queryset = Page.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        if 'category_slug' in self.kwargs:
            queryset = queryset.filter(categories__slug=self.kwargs['category_slug'])
        if 'tag_slug' in self.kwargs:
            queryset = queryset.filter(tags__slug=self.kwargs['tag_slug'])
        return queryset
    
    @action(detail=False, url_path='(?P<slug>[-\w]+)', methods=['get'])
    def by_slug(self, request, slug=None, *args, **kwargs):
        product = self.get_queryset().filter(slug=slug).first()
        if product:
            serializer = self.get_serializer(product)
            return Response(serializer.data)
        else:
            return Response({"detail": "Not found."}, status=404)

class ImageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

class HomePageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = HomePageSerializer

    def get_queryset(self):
        queryset = HomePage.objects.all()
        if 'lang' in self.kwargs:
            queryset = queryset.filter(lang=self.kwargs['lang'])
        return queryset

class SocialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Social.objects.all()
    serializer_class = SocialSerializer