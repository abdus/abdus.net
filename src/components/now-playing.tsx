'use client'

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface NowPlayingData {
  album: string;
  albumImageUrl: string;
  artist: string;
  isPlaying: boolean;
  songUrl: string;
  title: string;
}

type PropTypes = {
  className?: string;
}

export default function NowPlaying(props: PropTypes) {
  const [data, setData] = useState<NowPlayingData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing');
        const data = await response.json();
        setData(data);
        // Add a small delay before showing the component for a smoother effect
        setTimeout(() => setIsVisible(data.isPlaying), 200);
      } catch (error) {
        console.error('Error fetching now playing:', error);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!data?.isPlaying) {
    return null;
  }

  return (
    <a 
      href={data.songUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={cn(
        'w-full md:max-w-xs p-4 rounded-xl bg-white shadow-lg border',
        'transition-all duration-500 ease-in-out transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
        props.className
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Album Art */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img
              src={data.albumImageUrl}
              alt={data.album}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className='w-full'>
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {data.title}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {data.artist}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {data.album}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
