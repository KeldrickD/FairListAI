import { ComponentType, SVGProps } from 'react';

declare module 'lucide-react' {
  interface Props extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  
  // Declare lucide icons as React components
  export type LucideIcon = ComponentType<Props>;
  export type LucideProps = Props;
  
  // Common icons used in the project
  export const Home: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const Plus: LucideIcon;
  export const Search: LucideIcon;
  export const CheckSquare: LucideIcon;
  export const User: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const X: LucideIcon;
  export const Menu: LucideIcon;
  export const Link: LucideIcon;
  export const Loader2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Check: LucideIcon;
  export const Circle: LucideIcon;
  export const Dot: LucideIcon;
  export const GripVertical: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Building: LucideIcon;
  export const Shield: LucideIcon;
  export const BarChart: LucideIcon;
  export const Share2: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Copy: LucideIcon;
  export const Lightbulb: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Video: LucideIcon;
  export const Crown: LucideIcon;
  export const FileText: LucideIcon;
  export const PieChart: LucideIcon;
  export const List: LucideIcon;
  export const Edit: LucideIcon;
  export const Trash2: LucideIcon;
  export const Download: LucideIcon;
  export const Save: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Lock: LucideIcon;
  export const Filter: LucideIcon;
  export const Star: LucideIcon;
  export const InfoIcon: LucideIcon;
  export const Building2: LucideIcon;
} 