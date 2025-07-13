'use client';

import { cn } from '@/lib/utils';
import { animate, stagger } from 'motion';
import { splitText } from 'motion-plus';
import { useEffect, useRef } from 'react';

export default function SplitText({
  text,
  textClassName,
}: {
  text?: string;
  textClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current || !h1Ref.current) return;

      // Show the container after fonts are loaded
      containerRef.current.style.visibility = 'visible';

      const { words } = splitText(h1Ref.current);

      // Animate the words in the h1
      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
          type: 'spring',
          duration: 2,
          bounce: 0,
          delay: stagger(0.05),
        }
      );
    });
  }, [text]);

  return (
    <div className="split-text-container" ref={containerRef}>
      <h1
        ref={h1Ref}
        className={cn(
          'split-text-heading mb-6 text-2xl leading-tight font-bold text-white',
          textClassName
        )}
      >
        {text}
      </h1>
      <Stylesheet />
    </div>
  );
}

function Stylesheet() {
  return (
    <style>{`
            .split-text-container {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                text-align: left;
                visibility: hidden;
                position: relative;
                z-index: 1;
            }

            .split-text-heading {
                width: 100%;
            }

            .split-word {
                will-change: transform, opacity;
                display: inline-block;
            }
        `}</style>
  );
}
