import { LucideIcon } from 'lucide-react'
import {
  Heart,
  Brain,
  Target,
  Search,
  Flower2,
  BookOpen,
  Users,
  MessageCircle,
  Sparkles,
  Activity,
  TrendingUp,
  Calendar,
  Moon,
  Sun,
  Cloud,
  Coffee,
  Music,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AlertCircle,
  Briefcase,
  HelpCircle,
  Sunrise,
  Droplets,
  Footprints,
  BookHeart,
  PhoneOff,
} from 'lucide-react'

// Type-safe icon mapping
export const iconMap: Record<string, LucideIcon> = {
  Heart,
  Brain,
  Target,
  Search,
  Flower2,
  BookOpen,
  Users,
  MessageCircle,
  Sparkles,
  Activity,
  TrendingUp,
  Calendar,
  Moon,
  Sun,
  Cloud,
  Coffee,
  Music,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  AlertCircle,
  Briefcase,
  HelpCircle,
  Sunrise,
  Droplets,
  Footprints,
  BookHeart,
  PhoneOff,
}

// Type-safe helper function to get icon
export function getIcon(iconName: string): LucideIcon | undefined {
  return iconMap[iconName]
}

// Type guard to check if icon exists
export function hasIcon(iconName: string): iconName is keyof typeof iconMap {
  return iconName in iconMap
}
