from django.http import JsonResponse, HttpResponse
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import yt_dlp
import logging

logger = logging.getLogger(__name__)


def get_youtube_info(video_url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info_dict = ydl.extract_info(video_url, download=False)
            return info_dict
        except yt_dlp.DownloadError as e:
            logger.error(f"Failed to download info for {video_url}: {e}")
            return {'error': str(e)}


def check_live_status(request):
    video_url = request.GET.get('url')

    validate = URLValidator()
    try:
        validate(video_url)
    except ValidationError as e:
        logger.error(f"Invalid URL: {video_url}")
        return JsonResponse({'error': 'Invalid URL'}, status=400)

    if not video_url:
        logger.error("Empty URL was provided")
        return JsonResponse({'error': 'Empty URL'}, status=400)

    info_dict = get_youtube_info(video_url)

    if 'error' in info_dict:
        return JsonResponse(info_dict, status=400)

    is_live = info_dict.get('is_live')
    title = info_dict.get('title')
    thumbnail_url = info_dict.get('thumbnail')
    return JsonResponse({'is_live': is_live, 'title': title, 'thumbnail_url': thumbnail_url})


def home(request):
    return HttpResponse("Welcome to the Live Stream Monitor!")
