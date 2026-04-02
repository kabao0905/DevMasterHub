// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — Django Curriculum (Backend)
// ═══════════════════════════════════════════════════════════════
const DATA_DJANGO = {
  id:'django', name:'Django', icon:'🐍', color:'#092E20',
  gradient:'linear-gradient(135deg,#092E20,#44B78B)',
  category:'backend',
  description:'Python web framework — batteries included, ORM, admin panel',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'Django fundamentals',lessons:[
      {id:'intro',title:'Django Overview & Project Setup',
       theory:'<p><b>Django</b> = Python web framework "for perfectionists with deadlines". MVT (Model-View-Template) architecture, ORM tích hợp, admin panel tự động.</p>',
       code:'# Install\n# pip install django\n# django-admin startproject myproject\n# cd myproject\n# python manage.py startapp blog\n\n# blog/views.py\nfrom django.http import JsonResponse\nfrom django.shortcuts import render\n\ndef home(request):\n    return render(request, \'blog/home.html\', {\n        \'title\': \'Welcome to Django\',\n        \'posts\': Post.objects.all()\n    })\n\ndef api_posts(request):\n    posts = list(Post.objects.values(\'id\', \'title\', \'created_at\'))\n    return JsonResponse({\'posts\': posts})\n\n# blog/urls.py\nfrom django.urls import path\nfrom . import views\nurlpatterns = [\n    path(\'\', views.home, name=\'home\'),\n    path(\'api/posts/\', views.api_posts, name=\'api_posts\'),\n]',
       lang:'python',
       keyPoints:['MVT architecture','django-admin CLI','URL routing','View functions'],
       exercise:'Tạo Django project mới với home page'},
      {id:'models',title:'Models & Django ORM',
       theory:'<p>Django ORM map Python classes → database tables. Migrations tự động.</p>',
       code:'# blog/models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Category(models.Model):\n    name = models.CharField(max_length=100)\n    slug = models.SlugField(unique=True)\n\n    class Meta:\n        verbose_name_plural = \'Categories\'\n\n    def __str__(self):\n        return self.name\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)\n    published = models.BooleanField(default=False)\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)\n\n    class Meta:\n        ordering = [\'-created_at\']\n\n# Queries\nPost.objects.filter(published=True).order_by(\'-created_at\')[:10]\nPost.objects.select_related(\'author\', \'category\').all()\nPost.objects.aggregate(total=Count(\'id\'))',
       lang:'python',
       keyPoints:['Model fields & relationships','Migrations system','QuerySet API','select_related / prefetch_related'],
       exercise:'Tạo Blog models với Category, Tag, Comment'},
      {id:'templates',title:'Templates & Static Files',
       theory:'<p>Django template language: inheritance, filters, tags, static files.</p>',
       code:'<!-- templates/base.html -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>{% block title %}My Site{% endblock %}</title>\n  {% load static %}\n  <link rel="stylesheet" href="{% static \'css/style.css\' %}">\n</head>\n<body>\n  <nav>\n    <a href="{% url \'home\' %}">Home</a>\n    {% if user.is_authenticated %}\n      <span>{{ user.username }}</span>\n    {% endif %}\n  </nav>\n\n  {% block content %}{% endblock %}\n</body>\n</html>\n\n<!-- templates/blog/post_list.html -->\n{% extends \'base.html\' %}\n{% block title %}Blog Posts{% endblock %}\n{% block content %}\n  {% for post in posts %}\n    <article>\n      <h2>{{ post.title }}</h2>\n      <p>{{ post.content|truncatewords:30 }}</p>\n      <small>{{ post.created_at|date:"M d, Y" }}</small>\n    </article>\n  {% empty %}\n    <p>No posts yet.</p>\n  {% endfor %}\n{% endblock %}',
       lang:'markup',
       keyPoints:['Template inheritance {% extends %}','URL tags {% url %}','Filters: |truncatewords, |date','Static files {% static %}'],
       exercise:'Tạo base template và blog listing page'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Forms, Auth & Admin',lessons:[
      {id:'forms',title:'Django Forms & Validation',
       theory:'<p>Django Forms: ModelForm, validation, CSRF protection, file uploads.</p>',
       code:'# blog/forms.py\nfrom django import forms\nfrom .models import Post\n\nclass PostForm(forms.ModelForm):\n    class Meta:\n        model = Post\n        fields = [\'title\', \'content\', \'category\']\n        widgets = {\n            \'title\': forms.TextInput(attrs={\'class\': \'form-control\'}),\n            \'content\': forms.Textarea(attrs={\'rows\': 5}),\n        }\n\n    def clean_title(self):\n        title = self.cleaned_data[\'title\']\n        if len(title) < 5:\n            raise forms.ValidationError(\'Title must be at least 5 chars\')\n        return title\n\n# blog/views.py\ndef create_post(request):\n    if request.method == \'POST\':\n        form = PostForm(request.POST)\n        if form.is_valid():\n            post = form.save(commit=False)\n            post.author = request.user\n            post.save()\n            return redirect(\'post_detail\', pk=post.pk)\n    else:\n        form = PostForm()\n    return render(request, \'blog/create.html\', {\'form\': form})',
       lang:'python',
       keyPoints:['ModelForm auto-generation','Custom validation clean_*','CSRF protection','File upload handling'],
       exercise:'Tạo form cho tạo và edit blog post'},
      {id:'auth',title:'Authentication & Authorization',
       theory:'<p>Django auth: built-in user model, login/logout views, permissions, decorators.</p>',
       code:'# urls.py\nfrom django.contrib.auth import views as auth_views\n\nurlpatterns = [\n    path(\'login/\', auth_views.LoginView.as_view(), name=\'login\'),\n    path(\'logout/\', auth_views.LogoutView.as_view(), name=\'logout\'),\n    path(\'register/\', views.register, name=\'register\'),\n]\n\n# views.py\nfrom django.contrib.auth.decorators import login_required\nfrom django.contrib.auth.mixins import LoginRequiredMixin\n\n@login_required\ndef profile(request):\n    return render(request, \'profile.html\')\n\nclass PostCreateView(LoginRequiredMixin, CreateView):\n    model = Post\n    fields = [\'title\', \'content\']\n\n    def form_valid(self, form):\n        form.instance.author = self.request.user\n        return super().form_valid(form)',
       lang:'python',
       keyPoints:['Built-in auth views','@login_required decorator','User model customization','Permission system'],
       exercise:'Implement registration, login, profile views'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'REST API & Class-Based Views',lessons:[
      {id:'drf',title:'Django REST Framework',
       theory:'<p>DRF = xây dựng REST API mạnh mẽ. Serializers, viewsets, authentication.</p>',
       code:'# serializers.py\nfrom rest_framework import serializers\nfrom .models import Post\n\nclass PostSerializer(serializers.ModelSerializer):\n    author_name = serializers.CharField(source=\'author.username\', read_only=True)\n\n    class Meta:\n        model = Post\n        fields = [\'id\', \'title\', \'content\', \'author_name\', \'created_at\']\n\n# views.py\nfrom rest_framework import viewsets, permissions\n\nclass PostViewSet(viewsets.ModelViewSet):\n    queryset = Post.objects.select_related(\'author\').all()\n    serializer_class = PostSerializer\n    permission_classes = [permissions.IsAuthenticatedOrReadOnly]\n\n    def perform_create(self, serializer):\n        serializer.save(author=self.request.user)\n\n# urls.py\nfrom rest_framework.routers import DefaultRouter\nrouter = DefaultRouter()\nrouter.register(\'posts\', PostViewSet)\nurlpatterns += router.urls',
       lang:'python',
       keyPoints:['Serializers = data validation','ViewSets = CRUD auto','Router = URL generation','Permission classes'],
       exercise:'Build REST API cho blog với CRUD + auth'},
      {id:'cbv',title:'Class-Based Views & Mixins',
       theory:'<p>CBVs: reusable, composable views. ListView, DetailView, CreateView, UpdateView, DeleteView.</p>',
       code:'from django.views.generic import ListView, DetailView, CreateView\nfrom django.contrib.auth.mixins import LoginRequiredMixin\n\nclass PostListView(ListView):\n    model = Post\n    template_name = \'blog/post_list.html\'\n    context_object_name = \'posts\'\n    paginate_by = 10\n    ordering = [\'-created_at\']\n\n    def get_queryset(self):\n        qs = super().get_queryset().filter(published=True)\n        category = self.request.GET.get(\'category\')\n        if category:\n            qs = qs.filter(category__slug=category)\n        return qs\n\nclass PostDetailView(DetailView):\n    model = Post\n    template_name = \'blog/post_detail.html\'\n\n    def get_context_data(self, **kwargs):\n        context = super().get_context_data(**kwargs)\n        context[\'related\'] = Post.objects.filter(\n            category=self.object.category\n        ).exclude(pk=self.object.pk)[:3]\n        return context',
       lang:'python',
       keyPoints:['Generic views (ListView, etc.)','Customizing get_queryset','Extra context data','Pagination built-in'],
       exercise:'Chuyển function views sang class-based views'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Performance & Caching',lessons:[
      {id:'perf',title:'Performance Optimization',
       theory:'<p>Django performance: query optimization, caching, database indexing, async views.</p>',
       code:'# Query optimization\nfrom django.db.models import Prefetch, Count, Q\n\n# N+1 problem → select_related / prefetch_related\nposts = Post.objects.select_related(\'author\', \'category\').prefetch_related(\n    Prefetch(\'comments\', queryset=Comment.objects.select_related(\'user\'))\n).annotate(comment_count=Count(\'comments\'))\n\n# Caching\nfrom django.core.cache import cache\nfrom django.views.decorators.cache import cache_page\n\n@cache_page(60 * 15)  # 15 minutes\ndef popular_posts(request):\n    posts = cache.get(\'popular_posts\')\n    if not posts:\n        posts = Post.objects.filter(published=True).order_by(\'-views\')[:10]\n        cache.set(\'popular_posts\', posts, 300)\n    return render(request, \'popular.html\', {\'posts\': posts})\n\n# Async views (Django 4.1+)\nasync def async_api(request):\n    data = await sync_to_async(get_data)()\n    return JsonResponse(data)',
       lang:'python',
       keyPoints:['select_related / prefetch_related','Cache framework','Database indexing','Async views'],
       exercise:'Optimize blog queries và add caching'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Deployment & Scaling',lessons:[
      {id:'deploy',title:'Production Deployment',
       theory:'<p>Django deployment: Gunicorn + Nginx, Docker, environment variables, security checklist.</p>',
       code:'# settings/production.py\nimport os\nfrom .base import *\n\nDEBUG = False\nALLOWED_HOSTS = os.environ.get(\'ALLOWED_HOSTS\', \'\').split(\',\')\nSECRET_KEY = os.environ[\'SECRET_KEY\']\n\n# Database\nDATABASES = {\n    \'default\': {\n        \'ENGINE\': \'django.db.backends.postgresql\',\n        \'NAME\': os.environ[\'DB_NAME\'],\n        \'USER\': os.environ[\'DB_USER\'],\n        \'HOST\': os.environ[\'DB_HOST\'],\n    }\n}\n\n# Security\nSECURE_SSL_REDIRECT = True\nSESSION_COOKIE_SECURE = True\nCSRF_COOKIE_SECURE = True\nSECURE_HSTS_SECONDS = 31536000\n\n# Static files\nSTATIC_ROOT = os.path.join(BASE_DIR, \'staticfiles\')\nSTATICFILES_STORAGE = \'whitenoise.storage.CompressedManifestStaticFilesStorage\'\n\n# Dockerfile\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY requirements.txt .\n# RUN pip install -r requirements.txt\n# COPY . .\n# CMD ["gunicorn", "myproject.wsgi:application", "--bind", "0.0.0.0:8000"]',
       lang:'python',
       keyPoints:['Environment variables','Security checklist','Gunicorn + Nginx','Docker containerization'],
       exercise:'Dockerize Django app cho production'}
    ]}
  ]
};
