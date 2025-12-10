import React from 'react';
import { Template, TextElement, LogoElement, FIELD_LABELS, FieldType, CATEGORIES, Category } from '../types';
import { FONTS, COLORS, CM_TO_PX } from '../constants';
import { IconDownload, IconUpload, IconTrash } from './Icons';

interface SidebarProps {
  mode: 'admin' | 'user';
  template: Template;
  selectedElementId: string | null;
  selectedType: 'text' | 'logo' | null;
  
  // Actions
  onUpdateTextElement: (id: string, updates: Partial<TextElement>) => void;
  onUpdateLogoElement: (updates: Partial<LogoElement>) => void;
  onAddTextElement: (type: FieldType) => void;
  onAddLogo: (url: string) => void;
  onDownload: () => void;
  onSaveTemplate: () => void;
  onDeleteTemplate?: () => void;
  onBack: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mode,
  template,
  selectedElementId,
  selectedType,
  onUpdateTextElement,
  onUpdateLogoElement,
  onAddTextElement,
  onAddLogo,
  onDownload,
  onSaveTemplate,
  onDeleteTemplate,
  onBack
}) => {
  
  const selectedTextElement = template.elements.find(e => e.id === selectedElementId);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onAddLogo(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-80 bg-slate-800 border-r border-slate-700 flex flex-col h-full overflow-y-auto shrink-0 shadow-xl z-20 print:hidden">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-400">
          {mode === 'admin' ? 'لوحة التحكم' : 'تعديل المستند'}
        </h2>
        <button onClick={onBack} className="text-slate-400 hover:text-white text-sm">
          عودة للقائمة
        </button>
      </div>

      <div className="flex-1 p-4 space-y-6">
        
        {/* ---- SELECTION EDITOR ---- */}
        {selectedType === 'text' && selectedTextElement && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="text-sm font-semibold text-blue-300 border-b border-slate-600 pb-2">
              تعديل: {selectedTextElement.label}
            </h3>

            {/* Content Input */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">النص</label>
              <input 
                type="text" 
                value={selectedTextElement.value}
                onChange={(e) => onUpdateTextElement(selectedTextElement.id, { value: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Font Size */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">الحجم</label>
                <input 
                  type="number" 
                  value={selectedTextElement.fontSize}
                  onChange={(e) => onUpdateTextElement(selectedTextElement.id, { fontSize: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
                />
              </div>
              
              {/* Font Weight */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">السمك</label>
                <select 
                  value={selectedTextElement.fontWeight}
                  onChange={(e) => onUpdateTextElement(selectedTextElement.id, { fontWeight: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
                >
                  <option value="normal">عادي</option>
                  <option value="bold">عريض</option>
                  <option value="700">سميك</option>
                </select>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">نوع الخط</label>
              <select 
                value={selectedTextElement.fontFamily}
                onChange={(e) => onUpdateTextElement(selectedTextElement.id, { fontFamily: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-xs text-slate-400 mb-1">اللون</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    className={`w-6 h-6 rounded-full border border-slate-500 ${selectedTextElement.color === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => onUpdateTextElement(selectedTextElement.id, { color: c })}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedType === 'logo' && template.logo && (
          <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 space-y-4 animate-in fade-in slide-in-from-right-4">
             <h3 className="text-sm font-semibold text-blue-300 border-b border-slate-600 pb-2">
              تعديل الشعار (اللوكو)
            </h3>
            
            <div>
               <label className="block text-xs text-slate-400 mb-1">القطر (بالبكسل)</label>
               <input 
                  type="range" 
                  min="50" 
                  max="300"
                  value={template.logo.width}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateLogoElement({ width: val, height: val });
                  }}
                  className="w-full accent-blue-500"
                />
                <div className="text-center text-xs text-slate-400 mt-1">{Math.round(template.logo.width / CM_TO_PX * 10) / 10} سم</div>
            </div>
          </div>
        )}

        {/* ---- ADD FIELDS (Admin Only) ---- */}
        {mode === 'admin' && !selectedElementId && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">إضافة حقول</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(FIELD_LABELS) as FieldType[]).map((fieldKey) => (
                <button
                  key={fieldKey}
                  onClick={() => onAddTextElement(fieldKey)}
                  className="bg-slate-700 hover:bg-slate-600 text-xs py-2 px-1 rounded text-slate-200 transition-colors border border-slate-600"
                >
                  + {FIELD_LABELS[fieldKey]}
                </button>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-300 mt-6">الشعار</h3>
            {!template.logo ? (
              <div className="space-y-2">
                 <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700 hover:bg-slate-600 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IconUpload className="w-6 h-6 mb-2 text-slate-400" />
                        <p className="text-xs text-slate-400">رفع شعار من الجهاز</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </label>
                <div className="text-center text-slate-500 text-xs">- أو -</div>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="رابط Imgur مباشر" 
                    id="imgur-logo-input"
                    className="flex-1 bg-slate-900 border border-slate-600 text-xs p-2 rounded text-white"
                   />
                   <button 
                    onClick={() => {
                        const val = (document.getElementById('imgur-logo-input') as HTMLInputElement).value;
                        if(val) onAddLogo(val);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs"
                   >
                     إضافة
                   </button>
                </div>
              </div>
            ) : (
               <div className="bg-green-900/30 border border-green-800 p-2 rounded text-center text-green-400 text-sm">
                 تم إضافة الشعار
               </div>
            )}
          </div>
        )}

        {/* ---- GENERAL INFO (User Mode) ---- */}
        {mode === 'user' && !selectedElementId && (
          <div className="text-center text-slate-400 py-10">
            <p>انقر على أي نص في الصورة لتعديله.</p>
            <p className="text-xs mt-2">يمكنك تحريك النصوص وتغيير ألوانها.</p>
          </div>
        )}

      </div>

      {/* ---- ACTIONS FOOTER ---- */}
      <div className="p-4 border-t border-slate-700 space-y-3 bg-slate-900/50">
        {mode === 'admin' && (
            <button 
                onClick={onSaveTemplate}
                className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-green-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
                <span>حفظ القالب</span>
            </button>
        )}
        
        {mode === 'admin' && onDeleteTemplate && (
            <button 
                onClick={onDeleteTemplate}
                className="w-full bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold shadow-lg shadow-red-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
                <IconTrash className="w-4 h-4" />
                <span>حذف القالب</span>
            </button>
        )}

        {mode === 'user' && (
            <button 
                onClick={onDownload}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
                <IconDownload className="w-5 h-5" />
                <span>تصدير الصورة المعدلة</span>
            </button>
        )}
      </div>
    </div>
  );
};
