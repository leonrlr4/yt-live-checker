from django.test import TransactionTestCase, Client
from django.urls import reverse
from unittest.mock import patch


class LiveStatusTests(TransactionTestCase):
    def setUp(self):
        self.client = Client()

    def test_empty_url(self):
        response = self.client.get(reverse('check_live_status'), {'url': ''})
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {
                             'error': 'Empty URL'})

    def test_invalid_url(self):
        response = self.client.get(
            reverse('check_live_status'), {'url': 'invalidurl'})
        self.assertEqual(response.status_code, 400)
        self.assertJSONEqual(str(response.content, encoding='utf8'), {
                             'error': 'Invalid URL'})

    @patch('monitor.views.yt_dlp.YoutubeDL.extract_info')
    def test_valid_url(self, mock_extract_info):
        mock_extract_info.return_value = {
            'is_live': True,
            'title': 'Live Stream Title',
            'thumbnail': 'http://example.com/thumbnail.jpg'
        }

        response = self.client.get(reverse('check_live_status'), {
                                   'url': 'http://example.com/validurl'})
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'is_live': True, 'title': 'Live Stream Title',
                'thumbnail_url': 'http://example.com/thumbnail.jpg'}
        )
