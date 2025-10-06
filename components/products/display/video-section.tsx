"use client";

interface VideoSectionProps {
  videoUrl?: string | null;
  demoVideoUrl?: string | null;
}

// Helper to extract video ID from URL
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^&\s]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function getVimeoVideoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

function getLoomVideoId(url: string): string | null {
  const match = url.match(/loom\.com\/share\/([^?&\s]+)/);
  return match ? match[1] : null;
}

function VideoEmbed({ url, title }: { url: string; title: string }) {
  let embedUrl: string | null = null;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  } else if (url.includes("vimeo.com")) {
    const videoId = getVimeoVideoId(url);
    if (videoId) {
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
  } else if (url.includes("loom.com")) {
    const videoId = getLoomVideoId(url);
    if (videoId) {
      embedUrl = `https://www.loom.com/embed/${videoId}`;
    }
  }

  if (!embedUrl) {
    return (
      <div className="text-sm text-muted-foreground">
        Unable to embed video. <a href={url} target="_blank" rel="noopener noreferrer" className="underline">Watch here</a>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export function VideoSection({ videoUrl, demoVideoUrl }: VideoSectionProps) {
  // Don't render section if no videos
  if (!videoUrl && !demoVideoUrl) {
    return null;
  }

  return (
    <div className="space-y-6">
      {videoUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Product Video</h3>
          <VideoEmbed url={videoUrl} title="Product Video" />
        </div>
      )}

      {demoVideoUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Demo Video</h3>
          <VideoEmbed url={demoVideoUrl} title="Demo Video" />
        </div>
      )}
    </div>
  );
}
