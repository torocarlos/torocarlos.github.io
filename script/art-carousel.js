const gallery = document.querySelector('.art-gallery');

if (gallery) {
  const track = gallery.querySelector('.art-grid');
  let slides = [];
  let buttons = [];
  const modal = document.createElement('dialog');
  modal.className = 'art-lightbox art-carousel';
  modal.setAttribute('aria-label', 'Artwork viewer');
  modal.innerHTML = `<button type="button" class="art-lightbox__close" aria-label="Close artwork viewer">×</button>
    <div class="art-lightbox__stage"></div>
    <div class="art-carousel__controls">
      <button type="button" class="art-carousel__arrow" aria-label="Previous artwork in viewer">←</button>
      <div class="art-carousel__thumbnails" aria-label="Choose an artwork in viewer"></div>
      <button type="button" class="art-carousel__arrow" aria-label="Next artwork in viewer">→</button>
    </div>
    <p class="art-lightbox__count" aria-live="polite"></p>`;
  document.body.append(modal);
  const stage = modal.querySelector('.art-lightbox__stage');
  const modalThumbnails = modal.querySelector('.art-carousel__thumbnails');
  let modalIndex = 0;
  let opener;
  let previousOverflow;

  function showArtwork(index) {
    modalIndex = (index + slides.length) % slides.length;
    stage.querySelector('video')?.pause();
    const media = slides[modalIndex].querySelector('img, video').cloneNode(true);
    if (media.tagName === 'VIDEO') {
      media.controls = false;
      media.muted = false;
      media.tabIndex = 0;
      media.removeAttribute('aria-hidden');
    }
    if (media.tagName === 'VIDEO') {
      const player = document.createElement('div');
      player.className = 'art-video';
      const controls = document.createElement('div');
      controls.className = 'art-video__controls';
      controls.innerHTML = `<button type="button" aria-label="Play video">▶</button>
        <input type="range" class="art-video__seek" aria-label="Video progress" min="0" max="100" step="0.1" value="0">
        <span class="art-video__time">0:00</span>`;
      const play = controls.querySelector('button');
      const playIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M7 4v16l13-8z"/></svg>';
      const pauseIcon = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect fill="currentColor" x="6" y="4" width="4" height="16" rx="1"/><rect fill="currentColor" x="14" y="4" width="4" height="16" rx="1"/></svg>';
      play.innerHTML = playIcon;
      const seek = controls.querySelector('.art-video__seek');
      const time = controls.querySelector('.art-video__time');
      const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
      function togglePlay() {
        if (media.paused) media.play().catch(() => {});
        else media.pause();
      }
      play.addEventListener('click', togglePlay);
      media.addEventListener('click', togglePlay);
      function updatePlayback() {
        play.innerHTML = media.paused ? playIcon : pauseIcon;
        play.setAttribute('aria-label', media.paused ? 'Play video' : 'Pause video');
      }
      media.addEventListener('play', updatePlayback);
      media.addEventListener('pause', updatePlayback);
      media.addEventListener('timeupdate', () => {
        seek.value = media.duration ? media.currentTime / media.duration * 100 : 0;
        time.textContent = formatTime(media.currentTime);
        seek.setAttribute('aria-valuetext', `${formatTime(media.currentTime)} of ${formatTime(Number.isFinite(media.duration) ? media.duration : 0)}`);
      });
      seek.addEventListener('input', () => {
        if (Number.isFinite(media.duration)) media.currentTime = Number(seek.value) / 100 * media.duration;
      });
      media.setAttribute('disablepictureinpicture', '');
      media.setAttribute('disableremoteplayback', '');
      media.setAttribute('controlslist', 'nofullscreen nodownload noplaybackrate noremoteplayback');
      player.append(media, controls);
      stage.replaceChildren(player);
    } else {
      stage.replaceChildren(media);
    }
    modal.querySelector('.art-lightbox__count').textContent = `${modalIndex + 1} / ${slides.length}`;
    [...modalThumbnails.children].forEach((button, i) => {
      if (i === modalIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
    modalThumbnails.children[modalIndex]?.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }

  function openArtwork(index, trigger) {
    opener = trigger;
    track.querySelectorAll('video').forEach(video => video.pause());
    modalThumbnails.replaceChildren();
    buttons.forEach((button, i) => {
      const thumbnail = button.cloneNode(true);
      thumbnail.removeAttribute('aria-controls');
      thumbnail.addEventListener('click', () => showArtwork(i));
      modalThumbnails.append(thumbnail);
    });
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    showArtwork(index);
    modal.querySelector('.art-lightbox__close').focus();
  }
  modal.querySelector('.art-lightbox__close').addEventListener('click', () => modal.close());
  modal.querySelector('[aria-label="Previous artwork in viewer"]').addEventListener('click', () => showArtwork(modalIndex - 1));
  modal.querySelector('[aria-label="Next artwork in viewer"]').addEventListener('click', () => showArtwork(modalIndex + 1));
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('keydown', event => {
    if (['VIDEO', 'INPUT'].includes(event.target.tagName)) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showArtwork(modalIndex + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  modal.addEventListener('close', () => {
    stage.querySelector('video')?.pause();
    stage.replaceChildren();
    document.body.style.overflow = previousOverflow;
    opener?.focus({preventScroll: true});
  });

  function makeGallery() {
    slides = [...track.children];
    buttons = slides.map((slide, index) => {
      const media = slide.querySelector('img, video');
      const src = media.getAttribute('src') || media.querySelector('source')?.getAttribute('src');
      const openButton = document.createElement('button');
      openButton.type = 'button';
      openButton.className = 'art-grid__open';
      openButton.setAttribute('aria-label', `Open artwork ${index + 1} in viewer`);
      media.replaceWith(openButton);
      openButton.append(media);
      if (media.tagName === 'VIDEO') {
        media.controls = false;
        media.muted = true;
        media.playsInline = true;
        media.setAttribute('aria-hidden', 'true');
        media.tabIndex = -1;
        media.preload = 'auto';
        media.src = src + '#t=0.1';
        media.addEventListener('loadedmetadata', () => { media.currentTime = Math.min(0.1, media.duration / 2); }, {once: true});
        const badge = document.createElement('span');
        badge.className = 'video-badge';
        badge.textContent = '▶';
        badge.setAttribute('aria-hidden', 'true');
        openButton.append(badge);
      }
      openButton.addEventListener('click', () => openArtwork(index, openButton));
      const thumbnail = document.createElement('button');
      thumbnail.type = 'button';
      thumbnail.setAttribute('aria-label', `Show artwork ${index + 1}${media.tagName === 'VIDEO' ? ' (video)' : ''}`);
      const preview = media.cloneNode(true);
      preview.setAttribute('aria-hidden', 'true');
      if (preview.tagName === 'IMG') preview.alt = '';
      thumbnail.append(preview);
      if (media.tagName === 'VIDEO') thumbnail.append(openButton.querySelector('.video-badge').cloneNode(true));
      return thumbnail;
    });
  }

  async function loadMedia() {
    try {
      const response = await fetch('img-art/media.json', {cache: 'no-store'});
      if (!response.ok) throw new Error('Media list unavailable');
      const items = await response.json();
      if (!Array.isArray(items) || !items.every(item => typeof item.src === 'string' && item.src.startsWith('img-art/') && ['image', 'video'].includes(item.type))) {
        throw new Error('Invalid media list');
      }
      const fragment = document.createDocumentFragment();
      items.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'art-grid__item';
        const media = document.createElement(item.type === 'video' ? 'video' : 'img');
        media.src = item.src;
        if (item.type === 'video') {
          media.controls = true;
          media.playsInline = true;
          media.preload = 'metadata';
          media.setAttribute('aria-label', `Artwork video ${index + 1}`);
        } else {
          media.alt = `Artwork ${index + 1} by Carlos Toro`;
        }
        slide.append(media);
        fragment.append(slide);
      });
      track.querySelectorAll('video').forEach(video => video.pause());
      track.replaceChildren(fragment);
      track.scrollLeft = 0;
    } catch (error) {
      // Retain the HTML gallery when opening the page directly from disk.
      console.info('Using the artwork gallery included in the HTML.', error.message);
    }
    makeGallery();
  }

  loadMedia();
}
