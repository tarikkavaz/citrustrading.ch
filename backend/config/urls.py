from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from content.views import (
    CategoryViewSet, 
    TagViewSet, 
    TagProductsView, 
    ProductViewSet, 
    PageViewSet, 
    ImageViewSet, 
    HomePageViewSet, 
    MenuItemViewSet, 
    SocialViewSet
)
from content.admin import my_admin_site

router = DefaultRouter()
router.register(r'homepage', HomePageViewSet, basename='homepage')
router.register(r'menuitems', MenuItemViewSet, basename='menuitem')
router.register(r'pages', PageViewSet, basename='page')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'social', SocialViewSet, basename='social')

urlpatterns = [
    path('', include(router.urls)), 
    path('admin/', my_admin_site.urls),
    path('api/', include(router.urls)),
    path('api/<str:lang>/homepage/', HomePageViewSet.as_view({'get': 'list'}), name='homepage-list'),
    
    path('api/<str:lang>/products/', ProductViewSet.as_view({'get': 'list'}), name='product-list'),
    path('api/<str:lang>/product/<str:slug>/', ProductViewSet.as_view({'get': 'by_slug'}), name='product-detail'),
    
    path('api/<str:lang>/pages/', PageViewSet.as_view({'get': 'list'}), name='page-list'),
    path('api/<str:lang>/page/<str:slug>/', PageViewSet.as_view({'get': 'by_slug'}), name='page-detail'),
    
    path('api/<str:lang>/categories/', CategoryViewSet.as_view({'get': 'list'}), name='categories-list'),
    path('api/<str:lang>/category/<str:slug>/', CategoryViewSet.as_view({'get': 'list'}), name='category-detail'),
    
    path('api/<str:lang>/tags/<str:slug>/', TagProductsView.as_view(), name='tag-products'),
    
    path('api/social/', SocialViewSet.as_view({'get': 'retrieve'}), name='social-detail'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
