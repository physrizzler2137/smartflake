'use client';

import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fly-in-from-left' | 'fly-in-from-right' | 'zoom-in-out' | 'fade-in-up' | 'revolve-in-from-left' | 'revolve-in-from-right';

type AnimatedWrapperProps = {
  children: React.ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
};

export function AnimatedWrapper({ children, className, animation = 'fade-in-up', delay = 0 }: AnimatedWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (entry.isIntersecting) {
          // Set a new timeout to show the element
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, delay);
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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);
  
  let animationClass = '';
  switch(animation) {
    case 'fly-in-from-left':
      animationClass = 'animate-fly-in-from-left';
      break;
    case 'fly-in-from-right':
      animationClass = 'animate-fly-in-from-right';
      break;
    case 'zoom-in-out':
      animationClass = 'animate-zoom-in-out';
      break;
    case 'fade-in-up':
      animationClass = 'animate-fade-in-up';
      break;
    case 'revolve-in-from-left':
      animationClass = 'animate-revolve-in-from-left';
      break;
    case 'revolve-in-from-right':
      animationClass = 'animate-revolve-in-from-right';
      break;
  }

  return (
    <div
      ref={ref}
      className={cn(
        'ease-out', 
        isVisible ? animationClass : 'opacity-0', 
        className
      )}
    >
      {children}
    </div>
  );
}
