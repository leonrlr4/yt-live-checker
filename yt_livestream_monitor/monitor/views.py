from django.http import JsonResponse
from django.http import HttpResponse
import yt_dlp


def home(request):
    return HttpResponse("Welcome to the Live Stream Monitor!")


def check_live_status(request):
    video_url = request.GET.get('url')
    print(video_url)
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'skip_download': True,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info_dict = ydl.extract_info(video_url, download=False)
            is_live = info_dict.get('is_live')
            return JsonResponse({'is_live': is_live})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
