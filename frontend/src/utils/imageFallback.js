export const FALLBACK_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%231a1e24"><rect width="400" height="500" fill="%231f242c"/><circle cx="200" cy="180" r="70" fill="%23323a46"/><path d="M100 400 C100 300, 300 300, 300 400 Z" fill="%23323a46"/></svg>`;

export function handleImageError(e) {
  if (e.target.src !== FALLBACK_AVATAR) {
    e.target.src = FALLBACK_AVATAR;
  }
}
