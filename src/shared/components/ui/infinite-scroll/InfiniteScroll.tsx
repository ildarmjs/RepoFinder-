import React, { useRef, useEffect } from 'react';
import { Spinner } from '../spinner/Spinner';

interface InfiniteScrollProps {
  hasNextPage: boolean | undefined;
  isFetchingMore: boolean;
  fetchMore: () => void;
  endCursor?: string | undefined | null;
  children: React.ReactNode;
}

export const InfiniteScroll = ({
  hasNextPage,
  isFetchingMore,
  fetchMore,
  endCursor,
  children,
}: InfiniteScrollProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingMore) {
          fetchMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef && hasNextPage) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingMore, fetchMore]);

  return (
    <div>
      {children}
      {hasNextPage && <div ref={loadMoreRef} />}
    </div>
  );
};
