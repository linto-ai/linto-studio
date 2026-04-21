import type { Component } from "vue"
import {
  ArrowDown,
  Check,
  ChevronDown,
  ClipboardList,
  ClipboardType,
  Copy,
  Download,
  Loader2,
  Pause,
  Play,
  Settings,
  SkipBack,
  SkipForward,
  Users,
  Volume2,
  VolumeX,
  X,
} from "lucide-vue-next"

export const iconMap: Record<string, Component> = {
  "arrow-down": ArrowDown,
  check: Check,
  "chevron-down": ChevronDown,
  "clipboard-list": ClipboardList,
  "clipboard-type": ClipboardType,
  copy: Copy,
  download: Download,
  pause: Pause,
  play: Play,
  settings: Settings,
  "skip-back": SkipBack,
  "skip-forward": SkipForward,
  users: Users,
  volume: Volume2,
  "volume-mute": VolumeX,
  x: X,
  "circle-notch": Loader2,
  spinner: Loader2,
}

export function resolveIcon(name?: string): Component | undefined {
  if (!name) return undefined
  return iconMap[name]
}

export const ICON_SIZES: Record<"sm" | "md" | "lg", number> = {
  sm: 16,
  md: 20,
  lg: 24,
}
