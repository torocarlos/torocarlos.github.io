# Artwork gallery

Add images or videos directly to `img`. The gallery creates slides and clickable
thumbnails from the folder, sorted by filename. Prefix filenames with numbers
if you want to control the order.

## GitHub Pages

Upload this project, including `.github/workflows/pages.yml`, to your repository.
In Settings → Pages → Build and deployment, choose **GitHub Actions** as the source.
The workflow scans `img` and publishes the site whenever you push to the default
branch. New media appears after deployment finishes and the page is refreshed.

## Local preview

Run `python3 script/art-media.py --serve 8081`, then open
`http://localhost:8081/art.html`. This server scans the folder on every page load,
so new files appear when you refresh.

If you use another static preview server, run `python3 script/art-media.py` after
adding media to update `img/media.json`. Opening `art.html` directly from disk
uses the original three HTML slides as a fallback because browsers restrict local
file requests.

Supported images: JPG, JPEG, PNG, GIF, WebP, AVIF, SVG.
Supported video filenames: MP4, WebM, OGG, MOV, M4V; playback depends on the browser
and the codec. MP4 is recommended.
