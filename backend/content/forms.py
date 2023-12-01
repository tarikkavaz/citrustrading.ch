from django import forms
from .models import Page, Product, Image
from .widgets import ImageThumbnailSelectWidget, ImageThumbnailWidget
from .widgets import ImageThumbnailMultipleSelectWidget
from ckeditor.widgets import CKEditorWidget

class PageAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget(), required=False)
    image = forms.ModelChoiceField(queryset=Image.objects.all(),
                                  widget=ImageThumbnailWidget,
                                  required=False)

    class Meta:
        model = Page
        fields = '__all__'

class ProductAdminForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditorWidget(), required=False)
    image = forms.ModelChoiceField(queryset=Image.objects.all(),
                                  widget=ImageThumbnailWidget,
                                  required=False)

    class Meta:
        model = Product
        fields = '__all__'