"""Run before publishing, or use --serve 8081 for automatic local folder discovery."""
import argparse
import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import quote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
IMAGES = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'}
VIDEOS = {'.mp4', '.webm', '.ogg', '.mov', '.m4v'}


def media_list():
    items = [
        {'src': 'img-art/' + quote(path.name),
         'type': 'video' if path.suffix.lower() in VIDEOS else 'image'}
        for path in sorted((ROOT / 'img-art').iterdir(), key=lambda p: p.name.lower())
        if path.is_file() and path.suffix.lower() in IMAGES | VIDEOS
    ]
    manifest = ROOT / 'img-art' / 'media.json'
    if manifest.exists():
        previous = json.loads(manifest.read_text())
        order = {item['src']: index for index, item in enumerate(previous)}
        items.sort(key=lambda item: order.get(item['src'], len(order)))
    return items


class GalleryServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        if urlsplit(self.path).path == '/img-art/media.json':
            payload = json.dumps(media_list()).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        else:
            super().do_GET()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--serve', type=int, metavar='PORT')
    args = parser.parse_args()
    (ROOT / 'img-art' / 'media.json').write_text(json.dumps(media_list(), indent=2) + '\n')
    if args.serve:
        print(f'Artwork preview: http://localhost:{args.serve}/art.html', flush=True)
        ThreadingHTTPServer(('127.0.0.1', args.serve), partial(GalleryServer, directory=str(ROOT))).serve_forever()
