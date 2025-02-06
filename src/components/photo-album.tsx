'use client';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description: string;
  url: string;
  tag?: string;
  alternateUrls?: { title: string; url: string }[];
  cameraInfo?: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    exposure: string;
    iso: string;
  };
};

export function PhotoAlbum(props: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div 
          className="relative w-full h-full cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Loading Skeleton */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
          )}
          
          {/* Image */}
          <img
            src={props.url}
            alt={props.title}
            onLoad={() => setIsLoading(false)}
            className={cn(
              "w-full h-full rounded-lg object-cover",
              "transition-all duration-300",
              isLoading ? "opacity-0" : "opacity-100",
              "group-hover:brightness-90"
            )}
          />

          {/* Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
              "p-4 flex flex-col justify-end",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="text-white">
              <h3 className="text-lg font-medium leading-tight">{props.title}</h3>
              {props.tag && (
                <span className="inline-block text-sm opacity-75 mt-1">
                  {props.tag}
                </span>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="w-full max-w-5xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{props.title}</DialogTitle>

        <div className="relative">
          <img
            src={props.url}
            alt={props.title}
            className="w-full h-auto object-contain rounded-lg"
          />
          
          {/* Modal Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
            <h2 className="text-2xl font-medium mb-2">{props.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{props.description}</p>
            
            {props.cameraInfo && (
              <div className="flex items-center gap-4 text-sm overflow-x-auto pb-2">
                <Camera className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{props.cameraInfo.camera}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">{props.cameraInfo.lens}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">f/{props.cameraInfo.aperture.replace('f/', '')}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">{props.cameraInfo.exposure}</span>
                <span className="text-gray-400">•</span>
                <span className="whitespace-nowrap">ISO {props.cameraInfo.iso}</span>
              </div>
            )}

            {props.alternateUrls && props.alternateUrls.length > 0 && (
              <div className="mt-4 flex gap-3">
                {props.alternateUrls.map((alt, i) => (
                  <a
                    key={i}
                    href={alt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {alt.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
