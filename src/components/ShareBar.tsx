"use client";

import { useState } from "react";

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(title);

  const twitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  function shareDiscord() {
    // Copy link first then open Discord in a new tab to make pasting easy
    copy().finally(() => {
      try {
        window.open('https://discord.com/channels/@me', '_blank', 'noopener,noreferrer');
      } catch {}
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // noop
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={copy} className="px-3 py-1.5 rounded-md border text-sm bg-white">
        {copied ? "Link copied" : "Copy link"}
      </button>
      <a className="px-3 py-1.5 rounded-md border text-sm bg-white" href={twitter} target="_blank" rel="noopener noreferrer">Share on X</a>
      <a className="px-3 py-1.5 rounded-md border text-sm bg-white" href={facebook} target="_blank" rel="noopener noreferrer">Share on Facebook</a>
    </div>
  );
}


