export type Category = 'سجلات ادارية' | 'ملازم دراسية' | 'خطط يومية' | 'سجلات الدرجات';

export type FieldType = 
  | 'teacherName' 
  | 'principalName' 
  | 'section' 
  | 'year' 
  | 'schoolName' 
  | 'regNum' 
  | 'directorate';

export const FIELD_LABELS: Record<FieldType, string> = {
  teacherName: 'اسم المدرس',
  principalName: 'اسم مدير المدرسة',
  section: 'الشعبة',
  year: 'السنة الدراسية',
  schoolName: 'اسم المدرسة',
  regNum: 'رقم السجل',
  directorate: 'اسم المديرية'
};

export interface TextElement {
  id: string;
  type: FieldType;
  label: string;
  value: string;
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  color: string;
  fontFamily: string;
  width?: number;
}

export interface LogoElement {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number; // in px
  height: number; // in px
}

export interface Template {
  id: string;
  title: string;
  imageUrl: string;
  category: Category;
  elements: TextElement[];
  logo?: LogoElement;
  createdAt: number;
}

export const CATEGORIES: Category[] = [
  'سجلات ادارية', 
  'ملازم دراسية', 
  'خطط يومية', 
  'سجلات الدرجات'
];