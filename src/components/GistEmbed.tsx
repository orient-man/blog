'use client';

import { useEffect, useRef, useState } from 'react';

interface GistEmbedProps {
  /** GitHub Gist ID (e.g., "abc123def456") */
  id: string;
  /** Optional specific file within the gist */
  file?: string;
}

/**
 * GistEmbed — client component that embeds a GitHub Gist via iframe.
 * Falls back to a plain link if the embed fails to load.
 */
export default function GistEmbed({ id, file }: GistEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const gistUrl = file
    ? `https://gist.github.com/${id}.js?file=${encodeURIComponent(file)}`
    : `https://gist.github.com/${id}.js`;

  const gistLink = `https://gist.github.com/${id}${file ? `#file-${file.replace(/\./g, '-').toLowerCase()}` : ''}`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Build a minimal HTML document that loads the Gist script and auto-resizes
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<base target="_parent">
<style>body{margin:0;padding:0;}.gist{margin:0!important;}</style>
</head>
<body>
<script src="${gistUrl}" onerror="parent.postMessage('gist-error','*')"></sc` + `ript>
<script>
window.addEventListener('load',function(){
  var h=document.body.scrollHeight;
  parent.postMessage({type:'gist-resize',height:h},'*');
});
</script>
</body></html>`;

    iframe.srcdoc = html;

    const handleMessage = (e: MessageEvent) => {
      if (e.data === 'gist-error') {
        setFailed(true);
      } else if (e.data?.type === 'gist-resize' && typeof e.data.height === 'number') {
        iframe.style.height = `${e.data.height + 20}px`;
        setLoaded(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [gistUrl]);

  if (failed) {
    return (
      <div className="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded text-sm text-gray-600 dark:text-gray-400">
        <a
          href={gistLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          View Gist on GitHub &rarr;
        </a>
      </div>
    );
  }

  return (
    <div className="my-4 relative">
      {!loaded && (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded h-24 w-full" />
      )}
      <iframe
        ref={iframeRef}
        title={`GitHub Gist ${id}`}
        className="w-full border-0 rounded overflow-hidden"
        style={{
          display: loaded ? 'block' : 'none',
          minHeight: '60px',
        }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
