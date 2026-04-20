"use client";

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimatedTitleProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedTitle({ children, className }: AnimatedTitleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer after first animation for performance
          if(ref.current) observer.unobserve(ref.current);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <h2
        ref={ref}
        className={cn(
            isVisible ? 'animate-fade-in-up' : 'opacity-0', // Animate when visible
            className
        )}
    >
        {children}
    </h2>
  );
}
