from django.contrib import admin
from django.forms import widgets
from django.utils.safestring import mark_safe
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group
from .models import Category, Tag, Product, Page, Image, HomePage, MenuItem, Social
from ckeditor.widgets import CKEditorWidget
from django import forms
from django.contrib.admin import AdminSite
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin
from .forms import PageAdminForm, ProductAdminForm
from .widgets import ImageThumbnailSelectWidget, ImageThumbnailWidget

# Define a custom order for apps and models
APP_ORDER = {
    'content': 1,
    'auth': 2,
}

MODEL_ORDER = {
    'user': 1,
    'group': 2,
    'homepage': 1,
    'menuitem': 2,
    'page': 4,
    'product': 3,
    'image': 5,
    'category': 6,
    'tag': 7,
}

class CustomAdminSite(AdminSite):
    def get_app_list(self, request, app_label=None):
        app_dict = self._build_app_dict(request)

        app_list = sorted(app_dict.values(), key=lambda x: APP_ORDER.get(x['app_label'], 999))
        
        for app in app_list:
            app['models'].sort(key=lambda x: MODEL_ORDER.get(x['object_name'].lower(), 999))

        return app_list

my_admin_site = CustomAdminSite(name='my_admin')
my_admin_site.register(User, UserAdmin)
my_admin_site.register(Group, GroupAdmin)

class BaseImageInline(admin.TabularInline):
    extra = 1
    verbose_name = 'Image'
    verbose_name_plural = 'Images'
    readonly_fields = ('image_display',)

    def image_display(self, obj):
        return format_html('<img src="{}" height="50" />', obj.image.image.url) if obj.image else '-'
    image_display.short_description = 'Image Preview'

class ImageInlinePage(BaseImageInline):
    model = Page.images.through

class ImageInlineProduct(BaseImageInline):
    model = Product.images.through

class ImageInlineHomePage(BaseImageInline):
    model = HomePage.images.through

class ImageAdmin(admin.ModelAdmin):
    list_display = ('alt_text', 'image_display')
    readonly_fields = ('image_display',)

    def image_display(self, obj):
        return format_html('<img src="{}" height="50" />', obj.image.url) if obj.image else '-'
    image_display.short_description = 'Image Preview'

class ProductAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    images = forms.ModelChoiceField(queryset=Image.objects.all(),
                                widget=ImageThumbnailWidget,
                                required=False)
    
    class Meta:
        model = Product
        fields = '__all__'

class ProductAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = ProductAdminForm
    inlines = [ImageInlineProduct]
    readonly_fields = ('image_display',)
    filter_horizontal = ('categories',)

    def image_display(self, obj):
        return format_html('<img src="{}" height="50" />', obj.image.image.url) if obj.image else '-'
    image_display.short_description = 'Image Preview'

    fieldsets = (
        ('Product', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'shoplink', 'image', 'image_display', 'content', 'categories'),
        }),
    )
    list_display = ('title', 'lang', 'slug', 'langslug', 'image_display', 'order')
    list_filter = ('lang',)

class PageAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget())
    images = forms.ModelChoiceField(queryset=Image.objects.all(),
                                widget=ImageThumbnailWidget,
                                required=False)
    
    class Meta:
        model = Page
        fields = '__all__'

class PageAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = PageAdminForm
    inlines = [ImageInlinePage]
    readonly_fields = ('image_display',)

    def image_display(self, obj):
        return format_html('<img src="{}" height="50" />', obj.image.image.url) if obj.image else '-'
    image_display.short_description = 'Image Preview'

    fieldsets = (
        ('Page', {
            'fields': ('lang', 'title', 'slug', 'pageinfo', 'langslug', 'image', 'image_display', 'content'),
        }),
    )
    list_display = ('title', 'lang', 'slug', 'langslug', 'image_display', 'order')
    list_filter = ('lang',)

class HomePageAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)
    inlines = [ImageInlineHomePage]
    fieldsets = (
        ('HomePage', {
            'fields': ('lang', 'title', 'pageinfo', 'content', 'products'),
        }),
    )
    list_display = ('title', 'lang')
    list_filter = ('lang',)

class MenuItemForm(forms.ModelForm):
    class Meta:
        model = MenuItem
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(MenuItemForm, self).__init__(*args, **kwargs)
        # Modify the initial value of the link field
        if self.instance.link and self.instance.link.startswith('/api/'):
            self.initial['link'] = self.instance.link[4:]

class MenuItemAdmin(SortableAdminMixin, admin.ModelAdmin):
    form = MenuItemForm
    list_display = ('title', 'lang', 'link', 'parent', 'page', 'order')
    fields = ('lang', 'title', 'order', 'parent', 'link', 'page')
    list_filter = ('lang',)

    @admin.display(description='Link')
    def modified_link(self, obj):
        # Remove the /api/ prefix from the link for the list display
        if obj.link and obj.link.startswith('/api/'):
            return obj.link[4:]
        return obj.link

class SocialAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ('order',)
    fields = ('facebook', 'twitter', 'instagram', 'threads', 'youtube', 'order')

class CategoryAdminForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = '__all__'

class CategoryAdmin(admin.ModelAdmin):
    form = CategoryAdminForm
    list_display = ('title', 'lang', 'slug', 'langslug', 'image_display')  # Add 'langslug' and a method to display the image
    list_filter = ('lang',)

    fieldsets = (
        ('Category', {
            'fields': ('lang', 'title', 'slug', 'langslug', 'image'),  # Add 'langslug' and 'image' fields
        }),
    )

    def image_display(self, obj):
        return format_html('<img src="{}" height="50" />', obj.image.image.url) if obj.image else '-'
    image_display.short_description = 'Image Preview'

my_admin_site.register(MenuItem, MenuItemAdmin)
my_admin_site.register(Category, CategoryAdmin)
my_admin_site.register(Tag)
my_admin_site.register(Product, ProductAdmin)
my_admin_site.register(Page, PageAdmin)
my_admin_site.register(Image, ImageAdmin)
my_admin_site.register(HomePage, HomePageAdmin)
my_admin_site.register(Social, SocialAdmin)
