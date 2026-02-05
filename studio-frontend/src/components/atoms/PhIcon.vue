<template>
  <component
    v-if="iconComponent"
    :is="iconComponent"
    :weight="weight"
    :mirrored="mirrored"
    :class="['icon-svg', size, color, animation]"
    :style="{ color: computedColor, ...style }"
  />
  <span v-else class="icon-svg missing-icon" :class="[size, color]">?</span>
</template>

<script>
import {
  PhAppleLogo,
  PhArrowClockwise,
  PhArrowLeft,
  PhArrowLineDown,
  PhArrowLineLeft,
  PhArrowLineUp,
  PhArrowRight,
  PhArrowSquareUp,
  PhArrowsClockwise,
  PhBell,
  PhBracketsCurly,
  PhBroadcast,
  PhBuildings,
  PhCaretDown,
  PhCaretDoubleLeft,
  PhCaretUp,
  PhChartPie,
  PhCheck,
  PhCheckCircle,
  PhCircle,
  PhCircleNotch,
  PhClipboard,
  PhClock,
  PhClosedCaptioning,
  PhCopy,
  PhCreditCard,
  PhDotsThree,
  PhDownload,
  PhDownloadSimple,
  PhEquals,
  PhExport,
  PhEye,
  PhEyeSlash,
  PhFile,
  PhFileAudio,
  PhFileCsv,
  PhFileText,
  PhFileVideo,
  PhFileXls,
  PhFloppyDisk,
  PhGear,
  PhGlobeHemisphereWest,
  PhGraduationCap,
  PhHouse,
  PhInfo,
  PhKey,
  PhLink,
  PhList,
  PhMagnifyingGlass,
  PhMegaphone,
  PhMicrophone,
  PhMinusCircle,
  PhNotebook,
  PhPaperPlaneTilt,
  PhPause,
  PhPencil,
  PhPencilSimple,
  PhPlay,
  PhPlugsConnected,
  PhPlus,
  PhPlusCircle,
  PhPushPin,
  PhPushPinSlash,
  PhRecord,
  PhShareNetwork,
  PhShieldCheck,
  PhShieldSlash,
  PhShieldWarning,
  PhSignOut,
  PhSkipBack,
  PhSkipForward,
  PhSmileyBlank,
  PhSparkle,
  PhSpinner,
  PhSpinnerGap,
  PhStar,
  PhStop,
  PhSwap,
  PhTag,
  PhTranslate,
  PhTrash,
  PhTray,
  PhUpload,
  PhUser,
  PhUserSwitch,
  PhUsers,
  PhWarning,
  PhWarningCircle,
  PhWaves,
  PhWebcam,
  PhWrench,
  PhX,
  PhXCircle,
} from 'phosphor-vue';

const ICON_MAP = {
  AppleLogo: PhAppleLogo,
  ArrowClockwise: PhArrowClockwise,
  ArrowLeft: PhArrowLeft,
  ArrowLineDown: PhArrowLineDown,
  ArrowLineLeft: PhArrowLineLeft,
  ArrowLineUp: PhArrowLineUp,
  ArrowRight: PhArrowRight,
  ArrowSquareUp: PhArrowSquareUp,
  ArrowsClockwise: PhArrowsClockwise,
  Bell: PhBell,
  BracketsCurly: PhBracketsCurly,
  Broadcast: PhBroadcast,
  Buildings: PhBuildings,
  CaretDown: PhCaretDown,
  CaretDoubleLeft: PhCaretDoubleLeft,
  CaretUp: PhCaretUp,
  ChartPie: PhChartPie,
  Check: PhCheck,
  CheckCircle: PhCheckCircle,
  Circle: PhCircle,
  CircleNotch: PhCircleNotch,
  Clipboard: PhClipboard,
  Clock: PhClock,
  ClosedCaptioning: PhClosedCaptioning,
  Copy: PhCopy,
  CreditCard: PhCreditCard,
  DotsThree: PhDotsThree,
  Download: PhDownload,
  DownloadSimple: PhDownloadSimple,
  Equals: PhEquals,
  Export: PhExport,
  Eye: PhEye,
  EyeSlash: PhEyeSlash,
  File: PhFile,
  FileAudio: PhFileAudio,
  FileCsv: PhFileCsv,
  FileText: PhFileText,
  FileVideo: PhFileVideo,
  FileXls: PhFileXls,
  FloppyDisk: PhFloppyDisk,
  Gear: PhGear,
  GlobeHemisphereWest: PhGlobeHemisphereWest,
  GraduationCap: PhGraduationCap,
  House: PhHouse,
  Info: PhInfo,
  Key: PhKey,
  Link: PhLink,
  List: PhList,
  MagnifyingGlass: PhMagnifyingGlass,
  Megaphone: PhMegaphone,
  Microphone: PhMicrophone,
  MinusCircle: PhMinusCircle,
  Notebook: PhNotebook,
  PaperPlaneTilt: PhPaperPlaneTilt,
  Pause: PhPause,
  Pencil: PhPencil,
  PencilSimple: PhPencilSimple,
  Play: PhPlay,
  PlugsConnected: PhPlugsConnected,
  Plus: PhPlus,
  PlusCircle: PhPlusCircle,
  PushPin: PhPushPin,
  PushPinSlash: PhPushPinSlash,
  Record: PhRecord,
  ShareNetwork: PhShareNetwork,
  ShieldCheck: PhShieldCheck,
  ShieldSlash: PhShieldSlash,
  ShieldWarning: PhShieldWarning,
  SignOut: PhSignOut,
  SkipBack: PhSkipBack,
  SkipForward: PhSkipForward,
  SmileyBlank: PhSmileyBlank,
  Sparkle: PhSparkle,
  Spinner: PhSpinner,
  SpinnerGap: PhSpinnerGap,
  Star: PhStar,
  Stop: PhStop,
  Swap: PhSwap,
  Tag: PhTag,
  Translate: PhTranslate,
  Trash: PhTrash,
  Tray: PhTray,
  Upload: PhUpload,
  User: PhUser,
  UserSwitch: PhUserSwitch,
  Users: PhUsers,
  Warning: PhWarning,
  WarningCircle: PhWarningCircle,
  Waves: PhWaves,
  Webcam: PhWebcam,
  Wrench: PhWrench,
  X: PhX,
  XCircle: PhXCircle,
};

export default {
  name: 'PhIcon',
  props: {
    name: { type: String, required: true }, // ex: 'house', 'user', 'arrow-left'
    size: { type: [String, Number], default: 'sm' }, // xs, sm, md, lg, xl
    color: { type: String, default: '' }, // primary, secondary, etc.
    weight: { type: String, default: 'fill' }, // thin, light, regular, bold, fill, duotone
    mirrored: { type: Boolean, default: false },
    animation: { type: String, default: '' } // spin, pulse
  },
  computed: {
    iconComponent() {
      const camelCase = this.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      const pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
      return ICON_MAP[pascalCase] || null;
    },
    style() {
      const size = Number(this.size)
      if (size) {
        return {
          width: size + 'px',
          height: size + 'px',
        }
      }
      return {}
    },
    computedColor() {
      return this.color || 'currentColor';
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  background: none;

  :deep(svg) {
    fill: currentColor;
  }

  &.pulse :deep(svg) {
    animation: pulse 2s infinite;
  }

  &.spin :deep(svg) {
    animation: spin 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: scale(0.6);
    }
    50% {
      transform: scale(1);
    }
    100% {
      transform: scale(0.8);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &.lg {
    width: 24px;
    height: 24px;
  }

  &.md {
    width: 20px;
    height: 20px;
  }

  &.sm {
    width: 16px;
    height: 16px;
  }

  &.xs {
    width: 12px;
    height: 12px;
  }

  /* Color variants */
  &.primary {
    color: var(--primary-color);
  }

  &.secondary {
    color: var(--secondary-color);
  }

  &.tertiary {
    color: var(--tertiary-color);
  }

  &.neutral {
    color: var(--neutral-80);
  }
}

.missing-icon {
  font-size: 1.2em;
  opacity: 0.5;
}
</style> 