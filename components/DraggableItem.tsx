import React, { useState, useEffect, useRef } from 'react';

interface DraggableItemProps {
  x: number;
  y: number;
  onDrag: (x: number, y: number) => void;
  onSelect?: () => void;
  isSelected?: boolean;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  x,
  y,
  onDrag,
  onSelect,
  isSelected,
  children,
  containerRef
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent deselecting when clicking the item
    if (onSelect) onSelect();
    
    setIsDragging(true);
    setOffset({
      x: e.clientX - x,
      y: e.clientY - y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;

      onDrag(newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, offset, onDrag, containerRef]);

  return (
    <div
      ref={itemRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move select-none transition-shadow ${
        isSelected ? 'ring-2 ring-accent ring-offset-1 ring-offset-transparent z-50' : 'z-10 hover:ring-1 hover:ring-white/30'
      }`}
      style={{
        left: x,
        top: y,
        touchAction: 'none' // Prevent scrolling on touch devices while dragging
      }}
    >
      {children}
    </div>
  );
};