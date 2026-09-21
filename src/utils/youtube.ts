/**
 * Utilitário para manipulação e extração de URLs do YouTube
 */

export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  // Limpa espaços
  const trimmed = url.trim();

  // Padrão 1: youtu.be/ID
  const shortRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const shortMatch = trimmed.match(shortRegex);
  if (shortMatch && shortMatch[1]) return shortMatch[1];

  // Padrão 2: youtube.com/watch?v=ID ou youtube.com/embed/ID ou youtube.com/shorts/ID
  const fullRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const fullMatch = trimmed.match(fullRegex);
  if (fullMatch && fullMatch[1]) return fullMatch[1];

  // Se o usuário colou apenas o ID direto de 11 caracteres
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
}

export function getYouTubeThumbnail(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
