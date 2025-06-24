import { useEffect } from 'react';
import throttle from './throttle';

export function useScrollDirection(onScroll: (direction: 'up' | 'down') => void, delay: number = 300) {
    useEffect(() => {
        const handleScroll = throttle((event: WheelEvent) => {
            if (event.deltaY > 0) {
                onScroll('down');
            } else if (event.deltaY < 0) {
                onScroll('up');
            }
        }, delay);

        window.addEventListener('wheel', handleScroll);

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [onScroll, delay]);
}
