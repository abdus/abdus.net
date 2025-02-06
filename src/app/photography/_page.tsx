'use client';

import { photos } from "@/data/photos";
import { PhotoAlbum } from "@/components/photo-album";
import Container from "@/components/container";
import Header from "@/components/header";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function PhotographyPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const tags = useMemo(() => {
    const allTags = photos.map(p => p.tag).filter(Boolean) as string[];
    return [...new Set(allTags)];
  }, []);

  const filteredPhotos = useMemo(() => {
    if (!selectedTag) return photos;
    return photos.filter(p => p.tag === selectedTag);
  }, [selectedTag]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-black/90 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {photos[0] && (
            <img
              src={photos[0].url}
              alt="Hero"
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>
        <div className="relative text-center text-white space-y-4 px-4">
          <h1 className="text-4xl md:text-5xl font-bold">Photography</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            A collection of moments captured through my lens
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b">
        <Container>
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                "px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap",
                !selectedTag 
                  ? "bg-black text-white" 
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              All Photos
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "px-4 py-2 text-sm rounded-full transition-colors whitespace-nowrap",
                  selectedTag === tag 
                    ? "bg-black text-white" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* Photo Grid */}
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
          {[...filteredPhotos, ...filteredPhotos, ...filteredPhotos, ...filteredPhotos].sort(() => Math.random() > 0.5 ? 1: -1 ).map((photo, i) => {
            // Calculate the span based on the position
            // This creates a more dynamic layout where some images take up more space
            const isLarge = i % 5 === 0 || i % 7 === 0;
            const spanClass = isLarge 
              ? "row-span-2 col-span-1 md:col-span-2 lg:col-span-1"
              : "row-span-1 col-span-1";

            return (
              <div 
                key={photo.url} 
                className={cn(
                  spanClass,
                  "transition-transform duration-300 hover:z-10 hover:scale-[1.02]"
                )}
              >
                <PhotoAlbum {...photo} />
              </div>
            );
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="text-center py-32">
            <p className="text-gray-500">No photos found in this category.</p>
          </div>
        )}
      </Container>
    </div>
  );
}
