FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
ENV DJANGO_SETTINGS_MODULE=yt_livestream_monitor.settings
RUN python manage.py collectstatic --no-input
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
