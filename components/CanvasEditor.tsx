import React, { useRef, useState } from 'react';
import { Template, TextElement, LogoElement, FIELD_LABELS, FieldType } from '../types';
import { DraggableItem } from './DraggableItem';
import { IconTrash } from './Icons';

interface CanvasEditorProps {
  template: Template;
  mode: 'admin' | 'user';
  selectedElementId: string | null;
  onSelectElement: (id: string | null, type: 'text' | 'logo') => void;
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onUpdateLogoElement: (updates: Partial<LogoElement>) => void;
  onDeleteElement?: (id: string, type: 'text' | 'logo') => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  template,
  mode,
  selectedElementId,
  onSelectElement,
  onUpdateTextElement,
  onUpdateLogoElement,
  onDeleteElement
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Using inline-block so the container shrinks to fit the image width, removing extra whitespace.
  // Removed bg-white so there's no white box behind.

  return (
    <div className="relative w-full h-full overflow-auto bg-slate-900/50 flex justify-center items-start p-4 rounded-lg border border-slate-700 shadow-inner">
      <div 
        ref={containerRef}
        className="relative shadow-2xl origin-top inline-block"
        onClick={() => onSelectElement(null, 'text')} // Deselect on clicking empty space
      >
        {/* Background Image */}
        <img 
          src={template.imageUrl} 
          alt="Document Template" 
          className="max-w-none block select-none pointer-events-none"
          onLoad={() => setImgLoaded(true)}
          style={{ maxWidth: '100%', maxHeight: '80vh' }} 
        />

        {imgLoaded && (
          <>
            {/* Logo Layer */}
            {template.logo && (
              <DraggableItem
                x={template.logo.x}
                y={template.logo.y}
                onDrag={(x, y) => onUpdateLogoElement({ x, y })}
                onSelect={() => onSelectElement(template.logo!.id, 'logo')}
                isSelected={selectedElementId === template.logo.id}
                containerRef={containerRef}
              >
                <div 
                  className="relative group"
                  style={{ 
                    width: template.logo.width, 
                    height: template.logo.height 
                  }}
                >
                  <img 
                    src={template.logo.url} 
                    alt="Logo" 
                    className="w-full h-full object-contain pointer-events-none" 
                  />
                  
                  {/* Delete Button (Admin Only) */}
                  {mode === 'admin' && selectedElementId === template.logo.id && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onDeleteElement?.(template.logo!.id, 'logo');
                       }}
                       className="absolute -top-3 -right-3 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm"
                     >
                       <IconTrash className="w-3 h-3" />
                     </button>
                  )}
                </div>
              </DraggableItem>
            )}

            {/* Text Elements Layer */}
            {template.elements.map((el) => (
              <DraggableItem
                key={el.id}
                x={el.x}
                y={el.y}
                onDrag={(x, y) => onUpdateTextElement(el.id, { x, y })}
                onSelect={() => onSelectElement(el.id, 'text')}
                isSelected={selectedElementId === el.id}
                containerRef={containerRef}
              >
                <div className="relative group">
                  <div
                    style={{
                      fontSize: `${el.fontSize}px`,
                      fontWeight: el.fontWeight,
                      color: el.color,
                      fontFamily: el.fontFamily,
                      whiteSpace: 'nowrap',
                      padding: '4px',
                      border: mode === 'admin' ? '1px dashed rgba(255, 255, 255, 0.5)' : 'none',
                      backgroundColor: 'transparent',
                      textShadow: mode === 'admin' ? '0 0 2px rgba(0,0,0,0.5)' : 'none'
                    }}
                  >
                    {/* Display ONLY the value, no labels */}
                    {el.value}
                  </div>

                   {/* Delete Button (Admin Only) */}
                   {mode === 'admin' && selectedElementId === el.id && (
                     <button
                       onClick={(e) => {
                         e.stopPropagation();
                         onDeleteElement?.(el.id, 'text');
                       }}
                       className="absolute -top-3 -right-3 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 shadow-sm z-50"
                     >
                       <IconTrash className="w-3 h-3" />
                     </button>
                  )}
                </div>
              </DraggableItem>
            ))}
          </>
        )}
      </div>
    </div>
  );
};