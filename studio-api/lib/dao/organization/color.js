const MATERIAL_COLORS = [
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
]

const COLOR = Object.freeze({
  MATERIAL_COLORS,
  validate: (color) => {
    return MATERIAL_COLORS.includes(color)
  },
  getRandomColor: () => {
    return MATERIAL_COLORS[Math.floor(Math.random() * MATERIAL_COLORS.length)]
  },
  default: () => {
    return {}
  },
  defaultTag: () => {},
  defaultCategory: () => {},
})

module.exports = COLOR
