
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type HeroCarouselItem = {
  title: string;
  caption: string;
  url: string;
  post_slug: string;
}

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [carouselItems, setCarouselItems] = useState<HeroCarouselItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch hero carousel items from centralized media table
  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        console.log('Fetching hero carousel items...');
        // Fetch from the new media table
        const { data, error } = await supabase
          .from('media')
          .select('title, caption, url, post_slug')
          .eq('is_hero_carousel', true)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          console.error('Error fetching hero carousel items:', error);
          return;
        }

        if (data && data.length > 0) {
          setCarouselItems(data);
        } else {
          // Fallback to default slides if no carousel items
          setCarouselItems([
            {
              url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1600&q=80",
              title: "Stories from the Road",
              caption: "Discover our favorite moments across Europe.",
              post_slug: "#"
            },
            {
              url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=1600&q=80",
              title: "Nature's Grandeur",
              caption: "Waves, forests, mountains & wild encounters.",
              post_slug: "#"
            },
            {
              url: "https://zrtgkvpbptxueetuqlmb.supabase.co/storage/v1/object/public/legacy-posts/Great-Wall-20140503-48.jpg",
              title: "Family Journeys",
              caption: "Traveling together, one adventure at a time.",
              post_slug: "#"
            }
          ]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Unexpected error fetching hero carousel items:', err);
        setLoading(false);
      }
    };

    fetchCarouselItems();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % carouselItems.length);
  const prev = () => setCurrent((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  // Auto advance slides
  useEffect(() => {
    if (carouselItems.length <= 1) return;
    
    const timer = setTimeout(() => {
      next();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [current, carouselItems.length]);

  if (loading) {
    return (
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading featured stories...</p>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      {carouselItems.map((item, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 w-full h-full transition-all duration-700 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${item.url})` }}
          >
            <div className="w-full h-full flex items-center justify-center text-white bg-black/40 bg-blend-multiply">
              <div className="max-w-2xl mx-auto text-center px-4">
                <h1 className="font-playfair text-3xl lg:text-5xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                  {item.title}
                </h1>
                <div className="w-16 h-px bg-white/60 mx-auto mb-4" />
                <p className="text-lg lg:text-2xl mb-6 drop-shadow animate-fade-in">
                  {item.caption || "Read more about our journey..."}
                </p>
                <Link to={`/posts/${item.post_slug}`} className="inline-block">
                  <button className="bg-accent hover:bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-lg transition animate-fade-in">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Previous"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-primary rounded-full p-2 shadow transition z-20"
        aria-label="Next"
      >
        <ChevronRight size={28} />
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn("w-3 h-3 rounded-full bg-white/40", i === current && "bg-accent border-2 border-white")}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
