from rest_framework import serializers, generics
from urllib.parse import urlparse
from .models import Category, Tag, Product, Page, Image, HomePage, MenuItem, Social

class FilteredEmptyDictListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        iterable = super(FilteredEmptyDictListSerializer, self).to_representation(data)
        return [item for item in iterable if item]

class MenuItemChildSerializer(serializers.ModelSerializer):
    page_slug = serializers.SerializerMethodField()
    link = serializers.SerializerMethodField()  # Override the link field
    children = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = ['id', 'title', 'link', 'order', 'parent', 'page_slug', 'newtab', 'children', 'lang']

    def get_page_slug(self, obj):
        return obj.page.slug if obj.page else None

    def get_link(self, obj):
        # Remove the /api/ prefix from the link
        if obj.link and obj.link.startswith('/api/'):
            return obj.link[4:]
        return obj.link

    def get_children(self, obj):
        # Get all child items for this parent
        children = MenuItem.objects.filter(parent=obj.id)
        if children:
            # Serialize the child items recursively
            serializer = MenuItemChildSerializer(children, many=True, context=self.context)
            return serializer.data
        return None

class MenuItemSerializer(MenuItemChildSerializer):
    class Meta(MenuItemChildSerializer.Meta):
        list_serializer_class = FilteredEmptyDictListSerializer

    def to_representation(self, instance):
        # Only represent top-level items
        if instance.parent:
            return {}
        return super(MenuItemSerializer, self).to_representation(instance)

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['title', 'lang', 'slug', 'langslug', 'image']

    def get_image(self, obj):
        if obj.image:
            return obj.image.image.url
        return None

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['title', 'slug']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if representation['image']:
            representation['image'] = instance.image.url
        return representation

class ProductSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField() 

    class Meta:
        model = Product
        fields = '__all__'

    def get_image(self, obj):
        return obj.image_url

class PageSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = '__all__'

    def get_image(self, obj):
        return obj.image_url

class HomePageSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    images = ImageSerializer(many=True, read_only=True) 
    class Meta:
        model = HomePage
        fields = ['id', 'images', 'title', 'pageinfo', 'content', 'lang', 'products']

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

class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Social
        fields = '__all__' 