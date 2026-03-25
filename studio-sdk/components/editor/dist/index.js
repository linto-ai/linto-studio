import * as oi from "vue";
import { shallowReactive as Bn, ref as k, computed as A, inject as Xt, provide as Yt, h as $e, defineComponent as $, openBlock as x, createElementBlock as H, renderSlot as z, useSlots as no, normalizeClass as Wt, createCommentVNode as X, createElementVNode as V, toDisplayString as J, createVNode as M, withCtx as T, createTextVNode as ue, createBlock as R, unref as f, Fragment as he, watch as te, customRef as io, toValue as se, getCurrentScope as Ki, onScopeDispose as Xi, onBeforeUnmount as kt, effectScope as Yi, getCurrentInstance as Qe, shallowRef as dt, watchEffect as ae, readonly as ro, nextTick as oe, onMounted as ne, toHandlerKey as oo, camelize as Gi, toRef as Bt, onUnmounted as Ee, toRefs as Fe, Comment as so, mergeProps as K, cloneVNode as ao, normalizeStyle as Re, reactive as Ji, Teleport as Zi, normalizeProps as qn, guardReactiveProps as Fn, markRaw as lo, renderList as et, watchPostEffect as Qi, shallowReadonly as st, mergeDefaults as uo, withKeys as yt, withModifiers as He, watchSyncEffect as co, withMemo as fo, resolveDynamicComponent as po, useTemplateRef as bt, Transition as ho, useId as vo, useModel as mo, withDirectives as go, vShow as yo, triggerRef as si } from "vue";
function bo() {
  const n = /* @__PURE__ */ new Map();
  function e(o, s) {
    let a = n.get(o);
    return a || (a = /* @__PURE__ */ new Set(), n.set(o, a)), a.add(s), () => t(o, s);
  }
  function t(o, s) {
    n.get(o)?.delete(s);
  }
  function i(o, s) {
    n.get(o)?.forEach(
      (a) => a(s)
    );
  }
  function r() {
    n.clear();
  }
  return { on: e, off: t, emit: i, clear: r };
}
const ai = [
  "#4E79A7",
  // bleu
  "#F28E2B",
  // orange
  "#59A14F",
  // vert
  "#E15759",
  // rouge
  "#B07AA1",
  // violet
  "#76B7B2",
  // turquoise
  "#FF9DA7",
  // rose
  "#9C755F",
  // brun
  "#BAB0AC",
  // gris chaud
  "#4E4CD2"
  // indigo
];
function wo(n, e, t) {
  const i = ai[n.size % ai.length];
  return { id: e, name: t, color: i };
}
function So(n, e, t) {
  return !e || n.has(e) ? null : wo(n, e, t ?? e);
}
function _o(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function Co(n) {
  const e = Bn(/* @__PURE__ */ new Map());
  function t(o, s) {
    const a = So(e, o, s);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(o, s) {
    const a = _o(e, o, s);
    a && (e.set(o, a), n("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: r };
}
function Eo(n, e) {
  return [...n, e];
}
function xo(n, e) {
  return [...e, ...n];
}
function To(n, e, t) {
  const i = n.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const r = { ...n[i], ...t, id: e };
  return {
    turns: n.map((o, s) => s === i ? r : o),
    updated: r
  };
}
function ko(n, e) {
  const t = n.findIndex((i) => i.id === e);
  return t === -1 ? null : n.filter((i, r) => r !== t);
}
function Po(n, e, t) {
  const i = n.findIndex((s) => s.id === e);
  if (i === -1) return null;
  const r = n[i], o = {
    ...r,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? r.startTime,
    endTime: t[t.length - 1]?.endTime ?? r.endTime
  };
  return {
    turns: n.map((s, a) => a === i ? o : s),
    updated: o
  };
}
function xn(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function Ao(n, e, t) {
  const { id: i, languages: r, isSource: o, audio: s } = n, a = k(n.turns);
  function l(p) {
    t(p.speakerId), a.value = Eo(a.value, p), e("turn:add", { turn: p, translationId: i });
  }
  function u(p, g) {
    const m = To(a.value, p, g);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function c(p) {
    const g = ko(a.value, p);
    g && (a.value = g, e("turn:remove", { turnId: p, translationId: i }));
  }
  function d(p, g) {
    const m = Po(a.value, p, g);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function h(p) {
    xn(p, t), a.value = xo(a.value, p);
  }
  function v(p) {
    xn(p, t), a.value = p, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: r, isSource: o, audio: s, turns: a, addTurn: l, prependTurns: h, updateTurn: u, removeTurn: c, updateWords: d, setTurns: v };
}
function li(n, e, t) {
  const { id: i, name: r, description: o, duration: s } = n, a = Bn(/* @__PURE__ */ new Map());
  let l;
  for (const p of n.translations) {
    const g = Ao(p, e, t);
    a.set(p.id, g), p.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const u = k(null), c = k(!1), d = k(!0), h = A(() => u.value ? a.get(u.value) ?? l : l);
  function v(p) {
    const g = p === l.id ? null : p;
    g !== u.value && (u.value = g, e("translation:change", { translationId: h.value.id }));
  }
  return {
    id: i,
    name: r,
    description: o,
    duration: s,
    translations: a,
    sourceTranslation: l,
    activeTranslation: h,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: v
  };
}
function Oo(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, r] of n.speakers)
    e.add(i), t.push({ id: i, name: r.name });
  for (const i of n.channels)
    for (const r of i.translations)
      for (const o of r.turns)
        o.speakerId && !e.has(o.speakerId) && (e.add(o.speakerId), t.push({ id: o.speakerId, name: o.speakerId }));
  return t;
}
function Lo(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), r = parseInt(t.substring(2, 4), 16), o = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${o}, ${e})`;
}
function zn(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function er(n, e, t, i = "*") {
  return n.map((r) => ({
    value: r.id,
    label: r.languages.map((o) => zn(o, e, i)).join(", ") + (r.isSource ? ` (${t})` : "")
  }));
}
function Ro(n, e = 250) {
  let t = !1, i = null;
  return (...r) => {
    if (t) {
      i = r;
      return;
    }
    t = !0, n(...r), setTimeout(() => {
      if (t = !1, i !== null) {
        const o = i;
        i = null, n(...o);
      }
    }, e);
  };
}
function Ht(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, o = String(i).padStart(2, "0"), s = String(r).padStart(2, "0");
  return t > 0 ? `${t}:${o}:${s}` : `${o}:${s}`;
}
class de extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Io(n) {
  if (n == null || typeof n != "object")
    throw new de("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new de("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new de("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new de("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const i = e.channels[t], r = `channels[${t}]`;
    if (i == null || typeof i != "object")
      throw new de(r, "must be a non-null object");
    if (typeof i.id != "string")
      throw new de(`${r}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new de(`${r}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new de(`${r}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new de(`${r}.translations`, "must be an array");
    for (let o = 0; o < i.translations.length; o++) {
      const s = i.translations[o], a = `${r}.translations[${o}]`;
      if (s == null || typeof s != "object")
        throw new de(a, "must be a non-null object");
      if (typeof s.id != "string")
        throw new de(`${a}.id`, "must be a string");
      if (!Array.isArray(s.languages))
        throw new de(`${a}.languages`, "must be an array");
      if (typeof s.isSource != "boolean")
        throw new de(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(s.turns))
        throw new de(`${a}.turns`, "must be an array");
    }
  }
}
function Do(n, e) {
  const { width: t, height: i } = e.canvas, r = n[0], o = r.length / t, s = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += s * 2) {
    const l = Math.floor(a * o), u = Math.abs(r[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + s, 0), c = c + s, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + s, 0);
  }
  e.stroke(), e.closePath();
}
function tr(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function Mo(n, e) {
  if (!tr(n)) return null;
  let t = 0, i = n.length - 1;
  for (; t <= i; ) {
    const r = t + i >>> 1, o = n[r];
    if (e < o.startTime)
      i = r - 1;
    else if (e > o.endTime)
      t = r + 1;
    else
      return o.id;
  }
  return null;
}
function cf(n = {}) {
  const e = k(""), t = k(n.activeChannelId ?? ""), i = k(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: o, emit: s, clear: a } = bo(), l = Co(s), u = l, c = Bn(/* @__PURE__ */ new Map()), d = A(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function h(_, E) {
    return r(_, (C) => {
      C.translationId === d.value.activeTranslation.value.id && E(C);
    });
  }
  function v(_) {
    e.value = _.title, l.clear(), c.clear();
    for (const E of Oo(_))
      u.ensure(E.id, E.name);
    for (const E of _.channels)
      c.set(E.id, li(E, s, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function p(_) {
    Io(_), v(_);
  }
  function g(_) {
    _ !== t.value && (t.value = _, s("channel:change", { channelId: _ }));
  }
  function m(_, E) {
    if (c.has(_)) {
      for (const C of E.translations)
        xn(C.turns, u.ensure);
      c.set(_, li(E, s, u.ensure)), s("channel:sync", { channelId: _ });
    }
  }
  const w = [];
  function S(_) {
    const E = _.install(b);
    E && w.push(E);
  }
  function y() {
    s("destroy", void 0), w.forEach((_) => _()), w.length = 0, a();
  }
  n.document && v(n.document);
  const b = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: p,
    setActiveChannel: g,
    setChannel: m,
    on: r,
    off: o,
    emit: s,
    use: S,
    destroy: y
  };
  return b;
}
const nr = /* @__PURE__ */ Symbol("editorStore");
function df(n) {
  Yt(nr, n);
}
function tt() {
  const n = Xt(nr);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const $o = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ui = (n) => n === "";
const Bo = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const ci = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const qo = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const Fo = (n) => {
  const e = qo(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var vt = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
const zo = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": o,
  size: s = vt.width,
  color: a = vt.stroke,
  ...l
}, { slots: u }) => $e(
  "svg",
  {
    ...vt,
    ...l,
    width: s,
    height: s,
    stroke: a,
    "stroke-width": ui(t) || ui(i) || t === !0 || i === !0 ? Number(r || o || vt["stroke-width"]) * 24 / Number(s) : r || o || vt["stroke-width"],
    class: Bo(
      "lucide",
      l.class,
      ...n ? [`lucide-${ci(Fo(n))}-icon`, `lucide-${ci(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !$o(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => $e(...c)), ...u.default ? [u.default()] : []]
);
const me = (n, e) => (t, { slots: i, attrs: r }) => $e(
  zo,
  {
    ...r,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const No = me("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const ir = me("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Wo = me("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const di = me("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Ho = me("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Vo = me("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const jo = me("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Uo = me("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Ko = me("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Xo = me("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Yo = me("volume-2", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
]);
const Go = me("volume-x", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
]);
const rr = me("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Jo = ["aria-label"], Zo = /* @__PURE__ */ $({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (x(), H("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      z(e.$slots, "default", {}, void 0, !0)
    ], 8, Jo));
  }
}), fe = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, r] of e)
    t[i] = r;
  return t;
}, Tn = /* @__PURE__ */ fe(Zo, [["__scopeId", "data-v-3d3f8eba"]]), Qo = ["disabled", "aria-label"], es = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, ts = /* @__PURE__ */ $({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = no(), i = A(() => !!t.icon && !t.default), r = A(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (o, s) => (x(), H("button", {
      type: "button",
      class: Wt(r.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      o.$slots.icon ? (x(), H("span", es, [
        z(o.$slots, "icon", {}, void 0, !0)
      ])) : X("", !0),
      z(o.$slots, "default", {}, void 0, !0)
    ], 10, Qo));
  }
}), ke = /* @__PURE__ */ fe(ts, [["__scopeId", "data-v-9ebbb489"]]), or = {
  "editor.loading": "Chargement…",
  "editor.loadError": "Erreur de chargement",
  "header.export": "Exporter",
  "header.settings": "Paramètres",
  "header.openSidebar": "Ouvrir le panneau",
  "header.closeSidebar": "Fermer le panneau",
  "sidebar.channel": "Canal",
  "sidebar.speakers": "Intervenants",
  "player.play": "Lecture",
  "player.pause": "Pause",
  "player.skipBack": "Reculer de 10 secondes",
  "player.skipForward": "Avancer de 10 secondes",
  "player.volume": "Volume",
  "player.mute": "Couper le son",
  "player.unmute": "Réactiver le son",
  "player.speed": "Vitesse de lecture",
  "transcription.resumeScroll": "Reprendre le suivi",
  "header.channelLabel": "Sélectionner un canal",
  "sidebar.translation": "Traduction",
  "sidebar.translationLabel": "Traduction",
  "sidebar.originalLanguage": "original",
  "language.wildcard": "Multi-langue",
  "select.filter": "Rechercher…",
  "subtitle.exitFullscreen": "Quitter le plein écran",
  "subtitle.show": "Afficher les sous-titres",
  "subtitle.fontSize": "Taille de police",
  "sidebar.subtitle": "Sous-titres",
  "transcription.historyStart": "Début de la transcription",
  "transcription.loadingHistory": "Chargement…"
}, ns = {
  "editor.loading": "Loading…",
  "editor.loadError": "Loading error",
  "header.export": "Export",
  "header.settings": "Settings",
  "header.openSidebar": "Open panel",
  "header.closeSidebar": "Close panel",
  "sidebar.channel": "Channel",
  "sidebar.speakers": "Speakers",
  "player.play": "Play",
  "player.pause": "Pause",
  "player.skipBack": "Skip back 10 seconds",
  "player.skipForward": "Skip forward 10 seconds",
  "player.volume": "Volume",
  "player.mute": "Mute",
  "player.unmute": "Unmute",
  "player.speed": "Playback speed",
  "transcription.resumeScroll": "Resume follow",
  "header.channelLabel": "Select a channel",
  "sidebar.translation": "Translation",
  "sidebar.translationLabel": "Translation",
  "sidebar.originalLanguage": "original",
  "language.wildcard": "Multilingual",
  "select.filter": "Search…",
  "subtitle.exitFullscreen": "Exit fullscreen",
  "subtitle.show": "Show subtitles",
  "subtitle.fontSize": "Font size",
  "sidebar.subtitle": "Subtitles",
  "transcription.historyStart": "Beginning of transcription",
  "transcription.loadingHistory": "Loading…"
}, fi = { fr: or, en: ns }, sr = /* @__PURE__ */ Symbol("i18n");
function ff(n) {
  const e = A(() => {
    const i = fi[n.value] ?? fi.fr;
    return (r) => i[r] ?? r;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return Yt(sr, t), t;
}
function Ie() {
  const n = Xt(sr);
  if (n) return n;
  const e = A(() => "fr");
  return {
    t: (t) => or[t] ?? t,
    locale: e
  };
}
const is = { class: "editor-header" }, rs = { class: "header-left" }, os = { class: "document-title" }, ss = { class: "badges" }, as = ["datetime"], ls = { class: "header-right" }, us = /* @__PURE__ */ $({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = Ie(), r = A(() => zn(e.language, i.value, t("language.wildcard"))), o = A(() => Ht(e.duration)), s = A(() => e.title.replace(/-/g, " "));
    return (a, l) => (x(), H("header", is, [
      V("div", rs, [
        V("h1", os, J(s.value), 1),
        V("div", ss, [
          M(Tn, null, {
            default: T(() => [
              ue(J(r.value), 1)
            ]),
            _: 1
          }),
          M(Tn, null, {
            default: T(() => [
              V("time", {
                datetime: `PT${n.duration}S`
              }, J(o.value), 9, as)
            ]),
            _: 1
          })
        ])
      ]),
      V("div", ls, [
        n.isMobile ? (x(), R(ke, {
          key: 0,
          variant: "ghost",
          "aria-label": f(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: T(() => [
            M(f(Xo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : X("", !0),
        n.isMobile ? (x(), R(ke, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": f(t)("header.export")
        }, {
          icon: T(() => [
            M(f(di), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (x(), R(ke, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: T(() => [
            M(f(di), { size: 16 })
          ]),
          default: T(() => [
            ue(" " + J(f(t)("header.export")), 1)
          ]),
          _: 1
        })),
        M(ke, {
          variant: "ghost",
          disabled: "",
          "aria-label": f(t)("header.settings")
        }, {
          icon: T(() => [
            M(f(jo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), cs = /* @__PURE__ */ fe(us, [["__scopeId", "data-v-f16781f3"]]);
function pi(n) {
  return typeof n == "string" ? `'${n}'` : new ds().serialize(n);
}
const ds = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, i) {
      const r = typeof t, o = typeof i;
      return r === "string" && o === "string" ? t.localeCompare(i) : r === "number" && o === "number" ? t - i : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(i, !0));
    }
    serialize(t, i) {
      if (t === null) return "null";
      switch (typeof t) {
        case "string":
          return i ? t : `'${t}'`;
        case "bigint":
          return `${t}n`;
        case "object":
          return this.$object(t);
        case "function":
          return this.$function(t);
      }
      return String(t);
    }
    serializeObject(t) {
      const i = Object.prototype.toString.call(t);
      if (i !== "[object Object]") return this.serializeBuiltInType(i.length < 10 ? `unknown:${i}` : i.slice(8, -1), t);
      const r = t.constructor, o = r === Object || r === void 0 ? "" : r.name;
      if (o !== "" && globalThis[o] === r) return this.serializeBuiltInType(o, t);
      if (typeof t.toJSON == "function") {
        const s = t.toJSON();
        return o + (s !== null && typeof s == "object" ? this.$object(s) : `(${this.serialize(s)})`);
      }
      return this.serializeObjectEntries(o, Object.entries(t));
    }
    serializeBuiltInType(t, i) {
      const r = this["$" + t];
      if (r) return r.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(t, i.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, i) {
      const r = Array.from(i).sort((s, a) => this.compare(s[0], a[0]));
      let o = `${t}{`;
      for (let s = 0; s < r.length; s++) {
        const [a, l] = r[s];
        o += `${this.serialize(a, !0)}:${this.serialize(l)}`, s < r.length - 1 && (o += ",");
      }
      return o + "}";
    }
    $object(t) {
      let i = this.#e.get(t);
      return i === void 0 && (this.#e.set(t, `#${this.#e.size}`), i = this.serializeObject(t), this.#e.set(t, i)), i;
    }
    $function(t) {
      const i = Function.prototype.toString.call(t);
      return i.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${i.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(t) {
      let i = "[";
      for (let r = 0; r < t.length; r++) i += this.serialize(t[r]), r < t.length - 1 && (i += ",");
      return i + "]";
    }
    $Date(t) {
      try {
        return `Date(${t.toISOString()})`;
      } catch {
        return "Date(null)";
      }
    }
    $ArrayBuffer(t) {
      return `ArrayBuffer[${new Uint8Array(t).join(",")}]`;
    }
    $Set(t) {
      return `Set${this.$Array(Array.from(t).sort((i, r) => this.compare(i, r)))}`;
    }
    $Map(t) {
      return this.serializeObjectEntries("Map", t.entries());
    }
  }
  for (const e of ["Error", "RegExp", "URL"]) n.prototype["$" + e] = function(t) {
    return `${e}(${t})`;
  };
  for (const e of ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]) n.prototype["$" + e] = function(t) {
    return `${e}[${t.join(",")}]`;
  };
  for (const e of ["BigInt64Array", "BigUint64Array"]) n.prototype["$" + e] = function(t) {
    return `${e}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
  };
  return n;
})();
function Vt(n, e) {
  return n === e || pi(n) === pi(e);
}
function fs(n, e, t) {
  const i = n.findIndex((a) => Vt(a, e)), r = n.findIndex((a) => Vt(a, t));
  if (i === -1 || r === -1) return [];
  const [o, s] = [i, r].sort((a, l) => a - l);
  return n.slice(o, s + 1);
}
function kn(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function ge(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(s) => {
    const a = Xt(i, s);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (s) => (Yt(i, s), s)];
}
function be() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Gt(n, e, t) {
  const i = t.originalEvent.target, r = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && i.addEventListener(n, e, { once: !0 }), i.dispatchEvent(r);
}
function Pn(n) {
  return n == null;
}
function Nn(n) {
  return n ? n.flatMap((e) => e.type === he ? Nn(e.children) : [e]) : [];
}
const [Jt] = ge("ConfigProvider");
function ps(n, e) {
  var t;
  const i = dt();
  return ae(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), ro(i);
}
function Zt(n, e) {
  return Ki() ? (Xi(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function dn() {
  const n = /* @__PURE__ */ new Set(), e = (o) => {
    n.delete(o);
  };
  return {
    on: (o) => {
      n.add(o);
      const s = () => e(o);
      return Zt(s), { off: s };
    },
    off: e,
    trigger: (...o) => Promise.all(Array.from(n).map((s) => s(...o))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function hs(n) {
  let e = !1, t;
  const i = Yi(!0);
  return ((...r) => (e || (t = i.run(() => n(...r)), e = !0), t));
}
const ze = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const vs = (n) => typeof n < "u", ms = Object.prototype.toString, gs = (n) => ms.call(n) === "[object Object]", hi = () => {
}, vi = /* @__PURE__ */ ys();
function ys() {
  var n, e, t;
  return ze && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function bs(n, e) {
  function t(...i) {
    return new Promise((r, o) => {
      Promise.resolve(n(() => e.apply(this, i), {
        fn: e,
        thisArg: this,
        args: i
      })).then(r).catch(o);
    });
  }
  return t;
}
function ws(n, e = {}) {
  let t, i, r = hi;
  const o = (l) => {
    clearTimeout(l), r(), r = hi;
  };
  let s;
  return (l) => {
    const u = se(n), c = se(e.maxWait);
    return t && o(t), u <= 0 || c !== void 0 && c <= 0 ? (i && (o(i), i = void 0), Promise.resolve(l())) : new Promise((d, h) => {
      r = e.rejectOnCancel ? h : d, s = l, c && !i && (i = setTimeout(() => {
        t && o(t), i = void 0, d(s());
      }, c)), t = setTimeout(() => {
        i && o(i), i = void 0, d(l());
      }, u);
    });
  };
}
function fn(n) {
  return Array.isArray(n) ? n : [n];
}
function Ss(n) {
  return Qe();
}
// @__NO_SIDE_EFFECTS__
function _s(n) {
  if (!ze) return n;
  let e = 0, t, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...o) => (e += 1, i || (i = Yi(!0), t = i.run(() => n(...o))), Zt(r), t));
}
function ar(n, e = 1e4) {
  return io((t, i) => {
    let r = se(n), o;
    const s = () => setTimeout(() => {
      r = se(n), i();
    }, se(e));
    return Zt(() => {
      clearTimeout(o);
    }), {
      get() {
        return t(), r;
      },
      set(a) {
        r = a, i(), clearTimeout(o), o = s();
      }
    };
  });
}
// @__NO_SIDE_EFFECTS__
function Wn(n, e = 200, t = {}) {
  return bs(ws(e, t), n);
}
function Cs(n, e) {
  Ss() && kt(n, e);
}
function Es(n, e, t) {
  return te(n, e, {
    ...t,
    immediate: !0
  });
}
function xs(n, e, t) {
  return te(n, e, {
    ...t,
    once: !0
  });
}
const Qt = ze ? window : void 0;
function Oe(n) {
  var e;
  const t = se(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function lr(...n) {
  const e = (i, r, o, s) => (i.addEventListener(r, o, s), () => i.removeEventListener(r, o, s)), t = A(() => {
    const i = fn(se(n[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return Es(() => {
    var i, r;
    return [
      (i = (r = t.value) === null || r === void 0 ? void 0 : r.map((o) => Oe(o))) !== null && i !== void 0 ? i : [Qt].filter((o) => o != null),
      fn(se(t.value ? n[1] : n[0])),
      fn(f(t.value ? n[2] : n[1])),
      se(t.value ? n[3] : n[2])
    ];
  }, ([i, r, o, s], a, l) => {
    if (!i?.length || !r?.length || !o?.length) return;
    const u = gs(s) ? { ...s } : s, c = i.flatMap((d) => r.flatMap((h) => o.map((v) => e(d, h, v, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function ur() {
  const n = dt(!1), e = Qe();
  return e && ne(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function Ts(n) {
  const e = /* @__PURE__ */ ur();
  return A(() => (e.value, !!n()));
}
function ks(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Ps(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: r = Qt, eventName: o = "keydown", passive: s = !1, dedupe: a = !1 } = i, l = ks(e);
  return lr(r, o, (c) => {
    c.repeat && se(a) || l(c) && t(c);
  }, s);
}
function As(n) {
  return JSON.parse(JSON.stringify(n));
}
function wt(n, e, t = {}) {
  const { window: i = Qt, ...r } = t;
  let o;
  const s = /* @__PURE__ */ Ts(() => i && "ResizeObserver" in i), a = () => {
    o && (o.disconnect(), o = void 0);
  }, l = te(A(() => {
    const c = se(n);
    return Array.isArray(c) ? c.map((d) => Oe(d)) : [Oe(c)];
  }), (c) => {
    if (a(), s.value && i) {
      o = new ResizeObserver(e);
      for (const d of c) d && o.observe(d, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Zt(u), {
    isSupported: s,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function St(n, e, t, i = {}) {
  var r, o;
  const { clone: s = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Qe(), v = t || h?.emit || (h == null || (r = h.$emit) === null || r === void 0 ? void 0 : r.bind(h)) || (h == null || (o = h.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(h?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const g = (S) => s ? typeof s == "function" ? s(S) : As(S) : S, m = () => vs(n[e]) ? g(n[e]) : c, w = (S) => {
    d ? d(S) && v(p, S) : v(p, S);
  };
  if (a) {
    const S = k(m());
    let y = !1;
    return te(() => n[e], (b) => {
      y || (y = !0, S.value = g(b), oe(() => y = !1));
    }), te(S, (b) => {
      !y && (b !== n[e] || u) && w(b);
    }, { deep: u }), S;
  } else return A({
    get() {
      return m();
    },
    set(S) {
      w(S);
    }
  });
}
function pn(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function An(n, e, t = ".", i) {
  if (!pn(e))
    return An(n, {}, t, i);
  const r = Object.assign({}, e);
  for (const o in n) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const s = n[o];
    s != null && (i && i(r, o, s, t) || (Array.isArray(s) && Array.isArray(r[o]) ? r[o] = [...s, ...r[o]] : pn(s) && pn(r[o]) ? r[o] = An(
      s,
      r[o],
      (t ? `${t}.` : "") + o.toString(),
      i
    ) : r[o] = s));
  }
  return r;
}
function Os(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => An(t, i, "", n), {})
  );
}
const Ls = Os(), Rs = /* @__PURE__ */ _s(() => {
  const n = k(/* @__PURE__ */ new Map()), e = k(), t = A(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), i = Jt({ scrollBody: k(!0) });
  let r = null;
  const o = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", vi && r?.(), e.value = void 0;
  };
  return te(t, (s, a) => {
    if (!ze) return;
    if (!s) {
      a && o();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Ls({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), vi && (r = lr(document, "touchmove", (d) => Is(d), { passive: !1 })), oe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function cr(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Rs();
  t.value.set(e, n ?? !1);
  const i = A({
    get: () => t.value.get(e) ?? !1,
    set: (r) => t.value.set(e, r)
  });
  return Cs(() => {
    t.value.delete(e);
  }), i;
}
function dr(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : dr(t);
  }
}
function Is(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && dr(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Hn(n) {
  const e = Jt({ dir: k("ltr") });
  return A(() => n?.value || e.dir?.value || "ltr");
}
function en(n) {
  const e = Qe(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((r) => {
    i[oo(Gi(r))] = (...o) => n(r, ...o);
  }), i;
}
let hn = 0;
function Ds() {
  ae((n) => {
    if (!ze) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? mi()), document.body.insertAdjacentElement("beforeend", e[1] ?? mi()), hn++, n(() => {
      hn === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), hn--;
    });
  });
}
function mi() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function fr(n) {
  return A(() => se(n) ? !!Oe(n)?.closest("form") : !0);
}
function Y() {
  const n = Qe(), e = k(), t = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Oe(e)), i = Object.assign({}, n.exposed), r = {};
  for (const s in n.props) Object.defineProperty(r, s, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[s]
  });
  if (Object.keys(i).length > 0) for (const s in i) Object.defineProperty(r, s, {
    enumerable: !0,
    configurable: !0,
    get: () => i[s]
  });
  Object.defineProperty(r, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = r;
  function o(s) {
    if (e.value = s, !!s && (Object.defineProperty(r, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => s instanceof Element ? s : s.$el
    }), !(s instanceof Element) && !Object.hasOwn(s, "$el"))) {
      const a = s.$.exposed, l = Object.assign({}, r);
      for (const u in a) Object.defineProperty(l, u, {
        enumerable: !0,
        configurable: !0,
        get: () => a[u]
      });
      n.exposed = l;
    }
  }
  return {
    forwardRef: o,
    currentRef: e,
    currentElement: t
  };
}
function Vn(n) {
  const e = Qe(), t = Object.keys(e?.type.props ?? {}).reduce((r, o) => {
    const s = (e?.type.props[o]).default;
    return s !== void 0 && (r[o] = s), r;
  }, {}), i = Bt(n);
  return A(() => {
    const r = {}, o = e?.vnode.props ?? {};
    return Object.keys(o).forEach((s) => {
      r[Gi(s)] = o[s];
    }), Object.keys({
      ...t,
      ...r
    }).reduce((s, a) => (i.value[a] !== void 0 && (s[a] = i.value[a]), s), {});
  });
}
function Ms(n, e) {
  const t = Vn(n), i = e ? en(e) : {};
  return A(() => ({
    ...t.value,
    ...i
  }));
}
var $s = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, at = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = {}, vn = 0, pr = function(n) {
  return n && (n.host || pr(n.parentNode));
}, Bs = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = pr(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, qs = function(n, e, t, i) {
  var r = Bs(e, Array.isArray(n) ? n : [n]);
  Rt[t] || (Rt[t] = /* @__PURE__ */ new WeakMap());
  var o = Rt[t], s = [], a = /* @__PURE__ */ new Set(), l = new Set(r), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  r.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var v = h.getAttribute(i), p = v !== null && v !== "false", g = (at.get(h) || 0) + 1, m = (o.get(h) || 0) + 1;
          at.set(h, g), o.set(h, m), s.push(h), g === 1 && p && Lt.set(h, !0), m === 1 && h.setAttribute(t, "true"), p || h.setAttribute(i, "true");
        } catch (w) {
          console.error("aria-hidden: cannot operate on ", h, w);
        }
    });
  };
  return c(e), a.clear(), vn++, function() {
    s.forEach(function(d) {
      var h = at.get(d) - 1, v = o.get(d) - 1;
      at.set(d, h), o.set(d, v), h || (Lt.has(d) || d.removeAttribute(i), Lt.delete(d)), v || d.removeAttribute(t);
    }), vn--, vn || (at = /* @__PURE__ */ new WeakMap(), at = /* @__PURE__ */ new WeakMap(), Lt = /* @__PURE__ */ new WeakMap(), Rt = {});
  };
}, Fs = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), r = $s(n);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), qs(i, r, t, "aria-hidden")) : function() {
    return null;
  };
};
function hr(n) {
  let e;
  te(() => Oe(n), (t) => {
    t ? e = Fs(t) : e && e();
  }), Ee(() => {
    e && e();
  });
}
let zs = 0;
function _t(n, e = "reka") {
  if ("useId" in oi) return `${e}-${oi.useId?.()}`;
  const t = Jt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++zs}`;
}
function Ns() {
  return {
    ALT: "Alt",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ARROW_UP: "ArrowUp",
    BACKSPACE: "Backspace",
    CAPS_LOCK: "CapsLock",
    CONTROL: "Control",
    DELETE: "Delete",
    END: "End",
    ENTER: "Enter",
    ESCAPE: "Escape",
    F1: "F1",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    HOME: "Home",
    META: "Meta",
    PAGE_DOWN: "PageDown",
    PAGE_UP: "PageUp",
    SHIFT: "Shift",
    SPACE: " ",
    TAB: "Tab",
    CTRL: "Control",
    ASTERISK: "*",
    SPACE_CODE: "Space"
  };
}
function Ws(n) {
  const e = k(), t = A(() => e.value?.width ?? 0), i = A(() => e.value?.height ?? 0);
  return ne(() => {
    const r = Oe(n);
    if (r) {
      e.value = {
        width: r.offsetWidth,
        height: r.offsetHeight
      };
      const o = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length) return;
        const a = s[0];
        let l, u;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          l = d.inlineSize, u = d.blockSize;
        } else
          l = r.offsetWidth, u = r.offsetHeight;
        e.value = {
          width: l,
          height: u
        };
      });
      return o.observe(r, { box: "border-box" }), () => o.unobserve(r);
    } else e.value = void 0;
  }), {
    width: t,
    height: i
  };
}
function jn(n, e) {
  const t = k(n);
  function i(o) {
    return e[t.value][o] ?? t.value;
  }
  return {
    state: t,
    dispatch: (o) => {
      t.value = i(o);
    }
  };
}
function Un(n) {
  const e = ar("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, o) => {
      e.value = e.value + r;
      {
        const s = be(), a = o.map((h) => ({
          ...h,
          textValue: h.value?.textValue ?? h.ref.textContent?.trim() ?? ""
        })), l = a.find((h) => h.ref === s), u = a.map((h) => h.textValue), c = Vs(u, e.value, l?.textValue), d = a.find((h) => h.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Hs(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function Vs(n, e, t) {
  const r = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, o = t ? n.indexOf(t) : -1;
  let s = Hs(n, Math.max(o, 0));
  r.length === 1 && (s = s.filter((u) => u !== t));
  const l = s.find((u) => u.toLowerCase().startsWith(r.toLowerCase()));
  return l !== t ? l : void 0;
}
function js(n, e) {
  const t = k({}), i = k("none"), r = k(n), o = n.value ? "mounted" : "unmounted";
  let s;
  const a = e.value?.ownerDocument.defaultView ?? Qt, { state: l, dispatch: u } = jn(o, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (m) => {
    if (ze) {
      const w = new CustomEvent(m, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(w);
    }
  };
  te(n, async (m, w) => {
    const S = w !== m;
    if (await oe(), S) {
      const y = i.value, b = It(e.value);
      m ? (u("MOUNT"), c("enter"), b === "none" && c("after-enter")) : b === "none" || b === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : w && y !== b ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (m) => {
    const w = It(e.value), S = w.includes(CSS.escape(m.animationName)), y = l.value === "mounted" ? "enter" : "leave";
    if (m.target === e.value && S && (c(`after-${y}`), u("ANIMATION_END"), !r.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", s = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    m.target === e.value && w === "none" && u("ANIMATION_END");
  }, h = (m) => {
    m.target === e.value && (i.value = It(e.value));
  }, v = te(e, (m, w) => {
    m ? (t.value = getComputedStyle(m), m.addEventListener("animationstart", h), m.addEventListener("animationcancel", d), m.addEventListener("animationend", d)) : (u("ANIMATION_END"), s !== void 0 && a?.clearTimeout(s), w?.removeEventListener("animationstart", h), w?.removeEventListener("animationcancel", d), w?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = te(l, () => {
    const m = It(e.value);
    i.value = l.value === "mounted" ? m : "none";
  });
  return Ee(() => {
    v(), p();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function It(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var nt = $({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: !0
    },
    forceMount: { type: Boolean }
  },
  slots: {},
  setup(n, { slots: e, expose: t }) {
    const { present: i, forceMount: r } = Fe(n), o = k(), { isPresent: s } = js(i, o);
    t({ present: s });
    let a = e.default({ present: s.value });
    a = Nn(a || []);
    const l = Qe();
    if (a && a?.length > 1) {
      const u = l?.parent?.type.name ? `<${l.parent.type.name} />` : "component";
      throw new Error([
        `Detected an invalid children for \`${u}\` for  \`Presence\` component.`,
        "",
        "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
        "You can apply a few solutions:",
        ["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((c) => `  - ${c}`).join(`
`)
      ].join(`
`));
    }
    return () => r.value || i.value || s.value ? $e(e.default({ present: s.value })[0], { ref: (u) => {
      const c = Oe(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? o.value = c.firstElementChild : o.value = c), c;
    } }) : null;
  }
});
const On = $({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Nn(t.default()), r = i.findIndex((l) => l.type !== so);
      if (r === -1) return i;
      const o = i[r];
      delete o.props?.ref;
      const s = o.props ? K(e, o.props) : e, a = ao({
        ...o,
        props: {}
      }, s);
      return i.length === 1 ? a : (i[r] = a, i);
    };
  }
}), Us = [
  "area",
  "img",
  "input"
], ee = $({
  name: "Primitive",
  inheritAttrs: !1,
  props: {
    asChild: {
      type: Boolean,
      default: !1
    },
    as: {
      type: [String, Object],
      default: "div"
    }
  },
  setup(n, { attrs: e, slots: t }) {
    const i = n.asChild ? "template" : n.as;
    return typeof i == "string" && Us.includes(i) ? () => $e(i, e) : i !== "template" ? () => $e(n.as, e, { default: t.default }) : () => $e(On, e, { default: t.default });
  }
});
function Ct() {
  const n = k(), e = A(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Oe(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Ue, Ks] = ge("DialogRoot");
var Xs = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "DialogRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: !1,
      default: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = /* @__PURE__ */ St(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), o = k(), s = k(), { modal: a } = Fe(t);
    return Ks({
      open: r,
      modal: a,
      openModal: () => {
        r.value = !0;
      },
      onOpenChange: (l) => {
        r.value = l;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: o,
      contentElement: s
    }), (l, u) => z(l.$slots, "default", {
      open: f(r),
      close: () => r.value = !1
    });
  }
}), vr = Xs, Ys = /* @__PURE__ */ $({
  __name: "DialogClose",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(n) {
    const e = n;
    Y();
    const t = Ue();
    return (i, r) => (x(), R(f(ee), K(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (o) => f(t).onOpenChange(!1))
    }), {
      default: T(() => [z(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Gs = Ys;
const Js = "dismissableLayer.pointerDownOutside", Zs = "dismissableLayer.focusOutside";
function mr(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), r = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || r.indexOf(i) < r.indexOf(t)));
}
function Qs(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = k(!1), o = k(() => {
  });
  return ae((s) => {
    if (!ze || !se(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (mr(e.value, c)) {
          r.value = !1;
          return;
        }
        if (u.target && !r.value) {
          let h = function() {
            Gt(Js, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", o.value), o.value = h, i.addEventListener("click", o.value, { once: !0 })) : h();
        } else i.removeEventListener("click", o.value);
        r.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    s(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", o.value);
    });
  }), { onPointerDownCapture: () => {
    se(t) && (r.value = !0);
  } };
}
function ea(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = k(!1);
  return ae((o) => {
    if (!ze || !se(t)) return;
    const s = async (a) => {
      if (!e?.value) return;
      await oe(), await oe();
      const l = a.target;
      !e.value || !l || mr(e.value, l) || a.target && !r.value && Gt(Zs, n, { originalEvent: a });
    };
    i.addEventListener("focusin", s), o(() => i.removeEventListener("focusin", s));
  }), {
    onFocusCapture: () => {
      se(t) && (r.value = !0);
    },
    onBlurCapture: () => {
      se(t) && (r.value = !1);
    }
  };
}
const ye = Ji({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ta = /* @__PURE__ */ $({
  __name: "DismissableLayer",
  props: {
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "dismiss"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, { forwardRef: r, currentElement: o } = Y(), s = A(() => o.value?.ownerDocument ?? globalThis.document), a = A(() => ye.layersRoot), l = A(() => o.value ? Array.from(a.value).indexOf(o.value) : -1), u = A(() => ye.layersWithOutsidePointerEventsDisabled.size > 0), c = A(() => {
      const v = Array.from(a.value), [p] = [...ye.layersWithOutsidePointerEventsDisabled].slice(-1), g = v.indexOf(p);
      return l.value >= g;
    }), d = Qs(async (v) => {
      const p = [...ye.branches].some((g) => g?.contains(v.target));
      !c.value || p || (i("pointerDownOutside", v), i("interactOutside", v), await oe(), v.defaultPrevented || i("dismiss"));
    }, o), h = ea((v) => {
      [...ye.branches].some((g) => g?.contains(v.target)) || (i("focusOutside", v), i("interactOutside", v), v.defaultPrevented || i("dismiss"));
    }, o);
    return Ps("Escape", (v) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", v), v.defaultPrevented || i("dismiss"));
    }), ae((v) => {
      o.value && (t.disableOutsidePointerEvents && (ye.layersWithOutsidePointerEventsDisabled.size === 0 && (ye.originalBodyPointerEvents = s.value.body.style.pointerEvents, s.value.body.style.pointerEvents = "none"), ye.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), v(() => {
        t.disableOutsidePointerEvents && ye.layersWithOutsidePointerEventsDisabled.size === 1 && !Pn(ye.originalBodyPointerEvents) && (s.value.body.style.pointerEvents = ye.originalBodyPointerEvents);
      }));
    }), ae((v) => {
      v(() => {
        o.value && (a.value.delete(o.value), ye.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (v, p) => (x(), R(f(ee), {
      ref: f(r),
      "as-child": v.asChild,
      as: v.as,
      "data-dismissable-layer": "",
      style: Re({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: f(h).onFocusCapture,
      onBlurCapture: f(h).onBlurCapture,
      onPointerdownCapture: f(d).onPointerDownCapture
    }, {
      default: T(() => [z(v.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "style",
      "onFocusCapture",
      "onBlurCapture",
      "onPointerdownCapture"
    ]));
  }
}), gr = ta;
const na = /* @__PURE__ */ hs(() => k([]));
function ia() {
  const n = na();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = gi(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = gi(n.value, e), n.value[0]?.resume();
    }
  };
}
function gi(n, e) {
  const t = [...n], i = t.indexOf(e);
  return i !== -1 && t.splice(i, 1), t;
}
const mn = "focusScope.autoFocusOnMount", gn = "focusScope.autoFocusOnUnmount", yi = {
  bubbles: !1,
  cancelable: !0
};
function ra(n, { select: e = !1 } = {}) {
  const t = be();
  for (const i of n)
    if (Ne(i, { select: e }), be() !== t) return !0;
}
function oa(n) {
  const e = yr(n), t = bi(e, n), i = bi(e.reverse(), n);
  return [t, i];
}
function yr(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function bi(n, e) {
  for (const t of n) if (!sa(t, { upTo: e })) return t;
}
function sa(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function aa(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Ne(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = be();
    n.focus({ preventScroll: !0 }), n !== t && aa(n) && e && n.select();
  }
}
var la = /* @__PURE__ */ $({
  __name: "FocusScope",
  props: {
    loop: {
      type: Boolean,
      required: !1,
      default: !1
    },
    trapped: {
      type: Boolean,
      required: !1,
      default: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["mountAutoFocus", "unmountAutoFocus"],
  setup(n, { emit: e }) {
    const t = n, i = e, { currentRef: r, currentElement: o } = Y(), s = k(null), a = ia(), l = Ji({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ae((c) => {
      if (!ze) return;
      const d = o.value;
      if (!t.trapped) return;
      function h(m) {
        if (l.paused || !d) return;
        const w = m.target;
        d.contains(w) ? s.value = w : Ne(s.value, { select: !0 });
      }
      function v(m) {
        if (l.paused || !d) return;
        const w = m.relatedTarget;
        w !== null && (d.contains(w) || Ne(s.value, { select: !0 }));
      }
      function p(m) {
        d.contains(s.value) || Ne(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", v);
      const g = new MutationObserver(p);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", v), g.disconnect();
      });
    }), ae(async (c) => {
      const d = o.value;
      if (await oe(), !d) return;
      a.add(l);
      const h = be();
      if (!d.contains(h)) {
        const p = new CustomEvent(mn, yi);
        d.addEventListener(mn, (g) => i("mountAutoFocus", g)), d.dispatchEvent(p), p.defaultPrevented || (ra(yr(d), { select: !0 }), be() === h && Ne(d));
      }
      c(() => {
        d.removeEventListener(mn, (m) => i("mountAutoFocus", m));
        const p = new CustomEvent(gn, yi), g = (m) => {
          i("unmountAutoFocus", m);
        };
        d.addEventListener(gn, g), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Ne(h ?? document.body, { select: !0 }), d.removeEventListener(gn, g), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = be();
      if (d && h) {
        const v = c.currentTarget, [p, g] = oa(v);
        p && g ? !c.shiftKey && h === g ? (c.preventDefault(), t.loop && Ne(p, { select: !0 })) : c.shiftKey && h === p && (c.preventDefault(), t.loop && Ne(g, { select: !0 })) : h === v && c.preventDefault();
      }
    }
    return (c, d) => (x(), R(f(ee), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: T(() => [z(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), br = la;
function ua(n) {
  return n ? "open" : "closed";
}
function wi(n) {
  const e = be();
  for (const t of n)
    if (t === e || (t.focus(), be() !== e)) return;
}
const ca = "DialogTitle", da = "DialogContent";
function fa({ titleName: n = ca, contentName: e = da, componentLink: t = "dialog.html#title", titleId: i, descriptionId: r, contentElement: o }) {
  const s = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  ne(() => {
    document.getElementById(i) || console.warn(s);
    const u = o.value?.getAttribute("aria-describedby");
    r && u && (document.getElementById(r) || console.warn(a));
  });
}
var pa = /* @__PURE__ */ $({
  __name: "DialogContentImpl",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = Ue(), { forwardRef: o, currentElement: s } = Y();
    return r.titleId ||= _t(void 0, "reka-dialog-title"), r.descriptionId ||= _t(void 0, "reka-dialog-description"), ne(() => {
      r.contentElement = s, be() !== document.body && (r.triggerElement.value = be());
    }), process.env.NODE_ENV !== "production" && fa({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: r.titleId,
      descriptionId: r.descriptionId,
      contentElement: s
    }), (a, l) => (x(), R(f(br), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: T(() => [M(f(gr), K({
        id: f(r).contentId,
        ref: f(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": f(r).descriptionId,
        "aria-labelledby": f(r).titleId,
        "data-state": f(ua)(f(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => f(r).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: T(() => [z(a.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "as",
        "as-child",
        "disable-outside-pointer-events",
        "aria-describedby",
        "aria-labelledby",
        "data-state"
      ])]),
      _: 3
    }, 8, ["trapped"]));
  }
}), wr = pa, ha = /* @__PURE__ */ $({
  __name: "DialogContentModal",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = Ue(), o = en(i), { forwardRef: s, currentElement: a } = Y();
    return hr(a), (l, u) => (x(), R(wr, K({
      ...t,
      ...f(o)
    }, {
      ref: f(s),
      "trap-focus": f(r).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), f(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || h) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: T(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), va = ha, ma = /* @__PURE__ */ $({
  __name: "DialogContentNonModal",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const t = n, r = en(e);
    Y();
    const o = Ue(), s = k(!1), a = k(!1);
    return (l, u) => (x(), R(wr, K({
      ...t,
      ...f(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (s.value || f(o).triggerElement.value?.focus(), c.preventDefault()), s.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (s.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        f(o).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: T(() => [z(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ga = ma, ya = /* @__PURE__ */ $({
  __name: "DialogContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = Ue(), o = en(i), { forwardRef: s } = Y();
    return (a, l) => (x(), R(f(nt), { present: a.forceMount || f(r).open.value }, {
      default: T(() => [f(r).modal.value ? (x(), R(va, K({
        key: 0,
        ref: f(s)
      }, {
        ...t,
        ...f(o),
        ...a.$attrs
      }), {
        default: T(() => [z(a.$slots, "default")]),
        _: 3
      }, 16)) : (x(), R(ga, K({
        key: 1,
        ref: f(s)
      }, {
        ...t,
        ...f(o),
        ...a.$attrs
      }), {
        default: T(() => [z(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Sr = ya, ba = /* @__PURE__ */ $({
  __name: "DialogOverlayImpl",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = Ue();
    return cr(!0), Y(), (t, i) => (x(), R(f(ee), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": f(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: T(() => [z(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), wa = ba, Sa = /* @__PURE__ */ $({
  __name: "DialogOverlay",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = Ue(), { forwardRef: t } = Y();
    return (i, r) => f(e)?.modal.value ? (x(), R(f(nt), {
      key: 0,
      present: i.forceMount || f(e).open.value
    }, {
      default: T(() => [M(wa, K(i.$attrs, {
        ref: f(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: T(() => [z(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : X("v-if", !0);
  }
}), _r = Sa, _a = /* @__PURE__ */ $({
  __name: "Teleport",
  props: {
    to: {
      type: null,
      required: !1,
      default: "body"
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(n) {
    const e = /* @__PURE__ */ ur();
    return (t, i) => f(e) || t.forceMount ? (x(), R(Zi, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [z(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : X("v-if", !0);
  }
}), Cr = _a, Ca = /* @__PURE__ */ $({
  __name: "DialogPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(n) {
    const e = n;
    return (t, i) => (x(), R(f(Cr), qn(Fn(e)), {
      default: T(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Er = Ca, Ea = /* @__PURE__ */ $({
  __name: "DialogTitle",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "h2"
    }
  },
  setup(n) {
    const e = n, t = Ue();
    return Y(), (i, r) => (x(), R(f(ee), K(e, { id: f(t).titleId }), {
      default: T(() => [z(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), xr = Ea;
const Si = "data-reka-collection-item";
function Ke(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let r;
  if (t) {
    const c = k(/* @__PURE__ */ new Map());
    r = {
      collectionRef: k(),
      itemMap: c
    }, Yt(i, r);
  } else r = Xt(i);
  const o = (c = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${Si}]`)), p = Array.from(r.itemMap.value.values()).sort((g, m) => h.indexOf(g.ref) - h.indexOf(m.ref));
    return c ? p : p.filter((g) => g.ref.dataset.disabled !== "");
  }, s = $({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: v, currentElement: p } = Ct();
      return te(p, () => {
        r.collectionRef.value = p.value;
      }), () => $e(On, {
        ref: v,
        ...h
      }, d);
    }
  }), a = $({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: v, currentElement: p } = Ct();
      return ae((g) => {
        if (p.value) {
          const m = lo(p.value);
          r.itemMap.value.set(m, {
            ref: p.value,
            value: c.value
          }), g(() => r.itemMap.value.delete(m));
        }
      }), () => $e(On, {
        ...h,
        [Si]: "",
        ref: v
      }, d);
    }
  }), l = A(() => Array.from(r.itemMap.value.values())), u = A(() => r.itemMap.value.size);
  return {
    getItems: o,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: s,
    CollectionItem: a
  };
}
const xa = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ta(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function ka(n, e, t) {
  const i = Ta(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return xa[i];
}
var Pa = /* @__PURE__ */ $({
  __name: "VisuallyHidden",
  props: {
    feature: {
      type: String,
      required: !1,
      default: "focusable"
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    return (e, t) => (x(), R(f(ee), {
      as: e.as,
      "as-child": e.asChild,
      "aria-hidden": e.feature === "focusable" ? "true" : void 0,
      "data-hidden": e.feature === "fully-hidden" ? "" : void 0,
      tabindex: e.feature === "fully-hidden" ? "-1" : void 0,
      style: {
        position: "absolute",
        border: 0,
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
        wordWrap: "normal",
        top: "-1px",
        left: "-1px"
      }
    }, {
      default: T(() => [z(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Tr = Pa, Aa = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "VisuallyHiddenInputBubble",
  props: {
    name: {
      type: String,
      required: !0
    },
    value: {
      type: null,
      required: !0
    },
    checked: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    required: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    feature: {
      type: String,
      required: !1,
      default: "fully-hidden"
    }
  },
  setup(n) {
    const e = n, { primitiveElement: t, currentElement: i } = Ct(), r = A(() => e.checked ?? e.value);
    return te(r, (o, s) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && o !== s) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, o), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (o, s) => (x(), R(Tr, K({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...o.$attrs
    }, { as: "input" }), null, 16));
  }
}), _i = Aa, Oa = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "VisuallyHiddenInput",
  props: {
    name: {
      type: String,
      required: !0
    },
    value: {
      type: null,
      required: !0
    },
    checked: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    required: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    feature: {
      type: String,
      required: !1,
      default: "fully-hidden"
    }
  },
  setup(n) {
    const e = n, t = A(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = A(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((r, o) => typeof r == "object" ? Object.entries(r).map(([s, a]) => ({
      name: `${e.name}[${o}][${s}]`,
      value: a
    })) : {
      name: `${e.name}[${o}]`,
      value: r
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([r, o]) => ({
      name: `${e.name}[${r}]`,
      value: o
    })) : []);
    return (r, o) => (x(), H(he, null, [X(" We render single input if it's required "), t.value ? (x(), R(_i, K({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (x(!0), H(he, { key: 1 }, et(i.value, (s) => (x(), R(_i, K({ key: s.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), La = Oa;
const [kr, Ra] = ge("PopperRoot");
var Ia = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = k();
    return Ra({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => z(t.$slots, "default");
  }
}), Da = Ia, Ma = /* @__PURE__ */ $({
  __name: "PopperAnchor",
  props: {
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = n, { forwardRef: t, currentElement: i } = Y(), r = kr();
    return Qi(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (o, s) => (x(), R(f(ee), {
      ref: f(t),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: T(() => [z(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), $a = Ma;
function Ba(n) {
  return n !== null;
}
function qa(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: r } = e, s = r.arrow?.centerOffset !== 0, a = s ? 0 : n.arrowWidth, l = s ? 0 : n.arrowHeight, [u, c] = Ln(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], h = (r.arrow?.x ?? 0) + a / 2, v = (r.arrow?.y ?? 0) + l / 2;
      let p = "", g = "";
      return u === "bottom" ? (p = s ? d : `${h}px`, g = `${-l}px`) : u === "top" ? (p = s ? d : `${h}px`, g = `${i.floating.height + l}px`) : u === "right" ? (p = `${-l}px`, g = s ? d : `${v}px`) : u === "left" && (p = `${i.floating.width + l}px`, g = s ? d : `${v}px`), { data: {
        x: p,
        y: g
      } };
    }
  };
}
function Ln(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Fa = ["top", "right", "bottom", "left"], Ve = Math.min, pe = Math.max, jt = Math.round, Dt = Math.floor, Ae = (n) => ({
  x: n,
  y: n
}), za = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Na = {
  start: "end",
  end: "start"
};
function Rn(n, e, t) {
  return pe(n, Ve(e, t));
}
function Be(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function qe(n) {
  return n.split("-")[0];
}
function pt(n) {
  return n.split("-")[1];
}
function Kn(n) {
  return n === "x" ? "y" : "x";
}
function Xn(n) {
  return n === "y" ? "height" : "width";
}
const Wa = /* @__PURE__ */ new Set(["top", "bottom"]);
function Pe(n) {
  return Wa.has(qe(n)) ? "y" : "x";
}
function Yn(n) {
  return Kn(Pe(n));
}
function Ha(n, e, t) {
  t === void 0 && (t = !1);
  const i = pt(n), r = Yn(n), o = Xn(r);
  let s = r === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (s = Ut(s)), [s, Ut(s)];
}
function Va(n) {
  const e = Ut(n);
  return [In(n), e, In(e)];
}
function In(n) {
  return n.replace(/start|end/g, (e) => Na[e]);
}
const Ci = ["left", "right"], Ei = ["right", "left"], ja = ["top", "bottom"], Ua = ["bottom", "top"];
function Ka(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? Ei : Ci : e ? Ci : Ei;
    case "left":
    case "right":
      return e ? ja : Ua;
    default:
      return [];
  }
}
function Xa(n, e, t, i) {
  const r = pt(n);
  let o = Ka(qe(n), t === "start", i);
  return r && (o = o.map((s) => s + "-" + r), e && (o = o.concat(o.map(In)))), o;
}
function Ut(n) {
  return n.replace(/left|right|bottom|top/g, (e) => za[e]);
}
function Ya(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Pr(n) {
  return typeof n != "number" ? Ya(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Kt(n) {
  const {
    x: e,
    y: t,
    width: i,
    height: r
  } = n;
  return {
    width: i,
    height: r,
    top: t,
    left: e,
    right: e + i,
    bottom: t + r,
    x: e,
    y: t
  };
}
function xi(n, e, t) {
  let {
    reference: i,
    floating: r
  } = n;
  const o = Pe(e), s = Yn(e), a = Xn(s), l = qe(e), u = o === "y", c = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, h = i[a] / 2 - r[a] / 2;
  let v;
  switch (l) {
    case "top":
      v = {
        x: c,
        y: i.y - r.height
      };
      break;
    case "bottom":
      v = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      v = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      v = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      v = {
        x: i.x,
        y: i.y
      };
  }
  switch (pt(e)) {
    case "start":
      v[s] -= h * (t && u ? -1 : 1);
      break;
    case "end":
      v[s] += h * (t && u ? -1 : 1);
      break;
  }
  return v;
}
async function Ga(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: i,
    y: r,
    platform: o,
    rects: s,
    elements: a,
    strategy: l
  } = n, {
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: h = !1,
    padding: v = 0
  } = Be(e, n), p = Pr(v), m = a[h ? d === "floating" ? "reference" : "floating" : d], w = Kt(await o.getClippingRect({
    element: (t = await (o.isElement == null ? void 0 : o.isElement(m))) == null || t ? m : m.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), S = d === "floating" ? {
    x: i,
    y: r,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, y = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), b = await (o.isElement == null ? void 0 : o.isElement(y)) ? await (o.getScale == null ? void 0 : o.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = Kt(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: y,
    strategy: l
  }) : S);
  return {
    top: (w.top - _.top + p.top) / b.y,
    bottom: (_.bottom - w.bottom + p.bottom) / b.y,
    left: (w.left - _.left + p.left) / b.x,
    right: (_.right - w.right + p.right) / b.x
  };
}
const Ja = async (n, e, t) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: o = [],
    platform: s
  } = t, a = o.filter(Boolean), l = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let u = await s.getElementRects({
    reference: n,
    floating: e,
    strategy: r
  }), {
    x: c,
    y: d
  } = xi(u, i, l), h = i, v = {}, p = 0;
  for (let m = 0; m < a.length; m++) {
    var g;
    const {
      name: w,
      fn: S
    } = a[m], {
      x: y,
      y: b,
      data: _,
      reset: E
    } = await S({
      x: c,
      y: d,
      initialPlacement: i,
      placement: h,
      strategy: r,
      middlewareData: v,
      rects: u,
      platform: {
        ...s,
        detectOverflow: (g = s.detectOverflow) != null ? g : Ga
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = y ?? c, d = b ?? d, v = {
      ...v,
      [w]: {
        ...v[w],
        ..._
      }
    }, E && p <= 50 && (p++, typeof E == "object" && (E.placement && (h = E.placement), E.rects && (u = E.rects === !0 ? await s.getElementRects({
      reference: n,
      floating: e,
      strategy: r
    }) : E.rects), {
      x: c,
      y: d
    } = xi(u, h, l)), m = -1);
  }
  return {
    x: c,
    y: d,
    placement: h,
    strategy: r,
    middlewareData: v
  };
}, Za = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: i,
      placement: r,
      rects: o,
      platform: s,
      elements: a,
      middlewareData: l
    } = e, {
      element: u,
      padding: c = 0
    } = Be(n, e) || {};
    if (u == null)
      return {};
    const d = Pr(c), h = {
      x: t,
      y: i
    }, v = Yn(r), p = Xn(v), g = await s.getDimensions(u), m = v === "y", w = m ? "top" : "left", S = m ? "bottom" : "right", y = m ? "clientHeight" : "clientWidth", b = o.reference[p] + o.reference[v] - h[v] - o.floating[p], _ = h[v] - o.reference[v], E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u));
    let C = E ? E[y] : 0;
    (!C || !await (s.isElement == null ? void 0 : s.isElement(E))) && (C = a.floating[y] || o.floating[p]);
    const I = b / 2 - _ / 2, O = C / 2 - g[p] / 2 - 1, P = Ve(d[w], O), D = Ve(d[S], O), B = P, N = C - g[p] - D, L = C / 2 - g[p] / 2 + I, q = Rn(B, L, N), G = !l.arrow && pt(r) != null && L !== q && o.reference[p] / 2 - (L < B ? P : D) - g[p] / 2 < 0, j = G ? L < B ? L - B : L - N : 0;
    return {
      [v]: h[v] + j,
      data: {
        [v]: q,
        centerOffset: L - q - j,
        ...G && {
          alignmentOffset: j
        }
      },
      reset: G
    };
  }
}), Qa = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: r,
        middlewareData: o,
        rects: s,
        initialPlacement: a,
        platform: l,
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: h,
        fallbackStrategy: v = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: g = !0,
        ...m
      } = Be(n, e);
      if ((t = o.arrow) != null && t.alignmentOffset)
        return {};
      const w = qe(r), S = Pe(a), y = qe(a) === a, b = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), _ = h || (y || !g ? [Ut(a)] : Va(a)), E = p !== "none";
      !h && E && _.push(...Xa(a, g, p, b));
      const C = [a, ..._], I = await l.detectOverflow(e, m), O = [];
      let P = ((i = o.flip) == null ? void 0 : i.overflows) || [];
      if (c && O.push(I[w]), d) {
        const L = Ha(r, s, b);
        O.push(I[L[0]], I[L[1]]);
      }
      if (P = [...P, {
        placement: r,
        overflows: O
      }], !O.every((L) => L <= 0)) {
        var D, B;
        const L = (((D = o.flip) == null ? void 0 : D.index) || 0) + 1, q = C[L];
        if (q && (!(d === "alignment" ? S !== Pe(q) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        P.every((Z) => Pe(Z.placement) === S ? Z.overflows[0] > 0 : !0)))
          return {
            data: {
              index: L,
              overflows: P
            },
            reset: {
              placement: q
            }
          };
        let G = (B = P.filter((j) => j.overflows[0] <= 0).sort((j, Z) => j.overflows[1] - Z.overflows[1])[0]) == null ? void 0 : B.placement;
        if (!G)
          switch (v) {
            case "bestFit": {
              var N;
              const j = (N = P.filter((Z) => {
                if (E) {
                  const ie = Pe(Z.placement);
                  return ie === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ie === "y";
                }
                return !0;
              }).map((Z) => [Z.placement, Z.overflows.filter((ie) => ie > 0).reduce((ie, ce) => ie + ce, 0)]).sort((Z, ie) => Z[1] - ie[1])[0]) == null ? void 0 : N[0];
              j && (G = j);
              break;
            }
            case "initialPlacement":
              G = a;
              break;
          }
        if (r !== G)
          return {
            reset: {
              placement: G
            }
          };
      }
      return {};
    }
  };
};
function Ti(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function ki(n) {
  return Fa.some((e) => n[e] >= 0);
}
const el = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: i
      } = e, {
        strategy: r = "referenceHidden",
        ...o
      } = Be(n, e);
      switch (r) {
        case "referenceHidden": {
          const s = await i.detectOverflow(e, {
            ...o,
            elementContext: "reference"
          }), a = Ti(s, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: ki(a)
            }
          };
        }
        case "escaped": {
          const s = await i.detectOverflow(e, {
            ...o,
            altBoundary: !0
          }), a = Ti(s, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: ki(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ar = /* @__PURE__ */ new Set(["left", "top"]);
async function tl(n, e) {
  const {
    placement: t,
    platform: i,
    elements: r
  } = n, o = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), s = qe(t), a = pt(t), l = Pe(t) === "y", u = Ar.has(s) ? -1 : 1, c = o && l ? -1 : 1, d = Be(e, n);
  let {
    mainAxis: h,
    crossAxis: v,
    alignmentAxis: p
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof p == "number" && (v = a === "end" ? p * -1 : p), l ? {
    x: v * c,
    y: h * u
  } : {
    x: h * u,
    y: v * c
  };
}
const nl = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, i;
      const {
        x: r,
        y: o,
        placement: s,
        middlewareData: a
      } = e, l = await tl(e, n);
      return s === ((t = a.offset) == null ? void 0 : t.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: r + l.x,
        y: o + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, il = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: i,
        placement: r,
        platform: o
      } = e, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (w) => {
            let {
              x: S,
              y
            } = w;
            return {
              x: S,
              y
            };
          }
        },
        ...u
      } = Be(n, e), c = {
        x: t,
        y: i
      }, d = await o.detectOverflow(e, u), h = Pe(qe(r)), v = Kn(h);
      let p = c[v], g = c[h];
      if (s) {
        const w = v === "y" ? "top" : "left", S = v === "y" ? "bottom" : "right", y = p + d[w], b = p - d[S];
        p = Rn(y, p, b);
      }
      if (a) {
        const w = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", y = g + d[w], b = g - d[S];
        g = Rn(y, g, b);
      }
      const m = l.fn({
        ...e,
        [v]: p,
        [h]: g
      });
      return {
        ...m,
        data: {
          x: m.x - t,
          y: m.y - i,
          enabled: {
            [v]: s,
            [h]: a
          }
        }
      };
    }
  };
}, rl = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: i,
        placement: r,
        rects: o,
        middlewareData: s
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: u = !0
      } = Be(n, e), c = {
        x: t,
        y: i
      }, d = Pe(r), h = Kn(d);
      let v = c[h], p = c[d];
      const g = Be(a, e), m = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const y = h === "y" ? "height" : "width", b = o.reference[h] - o.floating[y] + m.mainAxis, _ = o.reference[h] + o.reference[y] - m.mainAxis;
        v < b ? v = b : v > _ && (v = _);
      }
      if (u) {
        var w, S;
        const y = h === "y" ? "width" : "height", b = Ar.has(qe(r)), _ = o.reference[d] - o.floating[y] + (b && ((w = s.offset) == null ? void 0 : w[d]) || 0) + (b ? 0 : m.crossAxis), E = o.reference[d] + o.reference[y] + (b ? 0 : ((S = s.offset) == null ? void 0 : S[d]) || 0) - (b ? m.crossAxis : 0);
        p < _ ? p = _ : p > E && (p = E);
      }
      return {
        [h]: v,
        [d]: p
      };
    }
  };
}, ol = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: r,
        rects: o,
        platform: s,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...u
      } = Be(n, e), c = await s.detectOverflow(e, u), d = qe(r), h = pt(r), v = Pe(r) === "y", {
        width: p,
        height: g
      } = o.floating;
      let m, w;
      d === "top" || d === "bottom" ? (m = d, w = h === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (w = d, m = h === "end" ? "top" : "bottom");
      const S = g - c.top - c.bottom, y = p - c.left - c.right, b = Ve(g - c[m], S), _ = Ve(p - c[w], y), E = !e.middlewareData.shift;
      let C = b, I = _;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (I = y), (i = e.middlewareData.shift) != null && i.enabled.y && (C = S), E && !h) {
        const P = pe(c.left, 0), D = pe(c.right, 0), B = pe(c.top, 0), N = pe(c.bottom, 0);
        v ? I = p - 2 * (P !== 0 || D !== 0 ? P + D : pe(c.left, c.right)) : C = g - 2 * (B !== 0 || N !== 0 ? B + N : pe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: I,
        availableHeight: C
      });
      const O = await s.getDimensions(a.floating);
      return p !== O.width || g !== O.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function tn() {
  return typeof window < "u";
}
function it(n) {
  return Gn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function ve(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function De(n) {
  var e;
  return (e = (Gn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Gn(n) {
  return tn() ? n instanceof Node || n instanceof ve(n).Node : !1;
}
function _e(n) {
  return tn() ? n instanceof Element || n instanceof ve(n).Element : !1;
}
function Le(n) {
  return tn() ? n instanceof HTMLElement || n instanceof ve(n).HTMLElement : !1;
}
function Pi(n) {
  return !tn() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof ve(n).ShadowRoot;
}
const sl = /* @__PURE__ */ new Set(["inline", "contents"]);
function Pt(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: r
  } = Ce(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !sl.has(r);
}
const al = /* @__PURE__ */ new Set(["table", "td", "th"]);
function ll(n) {
  return al.has(it(n));
}
const ul = [":popover-open", ":modal"];
function nn(n) {
  return ul.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const cl = ["transform", "translate", "scale", "rotate", "perspective"], dl = ["transform", "translate", "scale", "rotate", "perspective", "filter"], fl = ["paint", "layout", "strict", "content"];
function Jn(n) {
  const e = Zn(), t = _e(n) ? Ce(n) : n;
  return cl.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || dl.some((i) => (t.willChange || "").includes(i)) || fl.some((i) => (t.contain || "").includes(i));
}
function pl(n) {
  let e = je(n);
  for (; Le(e) && !ft(e); ) {
    if (Jn(e))
      return e;
    if (nn(e))
      return null;
    e = je(e);
  }
  return null;
}
function Zn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const hl = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function ft(n) {
  return hl.has(it(n));
}
function Ce(n) {
  return ve(n).getComputedStyle(n);
}
function rn(n) {
  return _e(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function je(n) {
  if (it(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Pi(n) && n.host || // Fallback.
    De(n)
  );
  return Pi(e) ? e.host : e;
}
function Or(n) {
  const e = je(n);
  return ft(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Le(e) && Pt(e) ? e : Or(e);
}
function Et(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const r = Or(n), o = r === ((i = n.ownerDocument) == null ? void 0 : i.body), s = ve(r);
  if (o) {
    const a = Dn(s);
    return e.concat(s, s.visualViewport || [], Pt(r) ? r : [], a && t ? Et(a) : []);
  }
  return e.concat(r, Et(r, [], t));
}
function Dn(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Lr(n) {
  const e = Ce(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Le(n), o = r ? n.offsetWidth : t, s = r ? n.offsetHeight : i, a = jt(t) !== o || jt(i) !== s;
  return a && (t = o, i = s), {
    width: t,
    height: i,
    $: a
  };
}
function Qn(n) {
  return _e(n) ? n : n.contextElement;
}
function ct(n) {
  const e = Qn(n);
  if (!Le(e))
    return Ae(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: o
  } = Lr(e);
  let s = (o ? jt(t.width) : t.width) / i, a = (o ? jt(t.height) : t.height) / r;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const vl = /* @__PURE__ */ Ae(0);
function Rr(n) {
  const e = ve(n);
  return !Zn() || !e.visualViewport ? vl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function ml(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== ve(n) ? !1 : e;
}
function Ze(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const r = n.getBoundingClientRect(), o = Qn(n);
  let s = Ae(1);
  e && (i ? _e(i) && (s = ct(i)) : s = ct(n));
  const a = ml(o, t, i) ? Rr(o) : Ae(0);
  let l = (r.left + a.x) / s.x, u = (r.top + a.y) / s.y, c = r.width / s.x, d = r.height / s.y;
  if (o) {
    const h = ve(o), v = i && _e(i) ? ve(i) : i;
    let p = h, g = Dn(p);
    for (; g && i && v !== p; ) {
      const m = ct(g), w = g.getBoundingClientRect(), S = Ce(g), y = w.left + (g.clientLeft + parseFloat(S.paddingLeft)) * m.x, b = w.top + (g.clientTop + parseFloat(S.paddingTop)) * m.y;
      l *= m.x, u *= m.y, c *= m.x, d *= m.y, l += y, u += b, p = ve(g), g = Dn(p);
    }
  }
  return Kt({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function on(n, e) {
  const t = rn(n).scrollLeft;
  return e ? e.left + t : Ze(De(n)).left + t;
}
function Ir(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - on(n, t), r = t.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function gl(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: r
  } = n;
  const o = r === "fixed", s = De(i), a = e ? nn(e.floating) : !1;
  if (i === s || a && o)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Ae(1);
  const c = Ae(0), d = Le(i);
  if ((d || !d && !o) && ((it(i) !== "body" || Pt(s)) && (l = rn(i)), Le(i))) {
    const v = Ze(i);
    u = ct(i), c.x = v.x + i.clientLeft, c.y = v.y + i.clientTop;
  }
  const h = s && !d && !o ? Ir(s, l) : Ae(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + h.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + h.y
  };
}
function yl(n) {
  return Array.from(n.getClientRects());
}
function bl(n) {
  const e = De(n), t = rn(n), i = n.ownerDocument.body, r = pe(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), o = pe(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let s = -t.scrollLeft + on(n);
  const a = -t.scrollTop;
  return Ce(i).direction === "rtl" && (s += pe(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: o,
    x: s,
    y: a
  };
}
const Ai = 25;
function wl(n, e) {
  const t = ve(n), i = De(n), r = t.visualViewport;
  let o = i.clientWidth, s = i.clientHeight, a = 0, l = 0;
  if (r) {
    o = r.width, s = r.height;
    const c = Zn();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const u = on(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, h = getComputedStyle(d), v = c.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, p = Math.abs(i.clientWidth - d.clientWidth - v);
    p <= Ai && (o -= p);
  } else u <= Ai && (o += u);
  return {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
const Sl = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function _l(n, e) {
  const t = Ze(n, !0, e === "fixed"), i = t.top + n.clientTop, r = t.left + n.clientLeft, o = Le(n) ? ct(n) : Ae(1), s = n.clientWidth * o.x, a = n.clientHeight * o.y, l = r * o.x, u = i * o.y;
  return {
    width: s,
    height: a,
    x: l,
    y: u
  };
}
function Oi(n, e, t) {
  let i;
  if (e === "viewport")
    i = wl(n, t);
  else if (e === "document")
    i = bl(De(n));
  else if (_e(e))
    i = _l(e, t);
  else {
    const r = Rr(n);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return Kt(i);
}
function Dr(n, e) {
  const t = je(n);
  return t === e || !_e(t) || ft(t) ? !1 : Ce(t).position === "fixed" || Dr(t, e);
}
function Cl(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = Et(n, [], !1).filter((a) => _e(a) && it(a) !== "body"), r = null;
  const o = Ce(n).position === "fixed";
  let s = o ? je(n) : n;
  for (; _e(s) && !ft(s); ) {
    const a = Ce(s), l = Jn(s);
    !l && a.position === "fixed" && (r = null), (o ? !l && !r : !l && a.position === "static" && !!r && Sl.has(r.position) || Pt(s) && !l && Dr(n, s)) ? i = i.filter((c) => c !== s) : r = a, s = je(s);
  }
  return e.set(n, i), i;
}
function El(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: r
  } = n;
  const s = [...t === "clippingAncestors" ? nn(e) ? [] : Cl(e, this._c) : [].concat(t), i], a = s[0], l = s.reduce((u, c) => {
    const d = Oi(e, c, r);
    return u.top = pe(d.top, u.top), u.right = Ve(d.right, u.right), u.bottom = Ve(d.bottom, u.bottom), u.left = pe(d.left, u.left), u;
  }, Oi(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function xl(n) {
  const {
    width: e,
    height: t
  } = Lr(n);
  return {
    width: e,
    height: t
  };
}
function Tl(n, e, t) {
  const i = Le(e), r = De(e), o = t === "fixed", s = Ze(n, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ae(0);
  function u() {
    l.x = on(r);
  }
  if (i || !i && !o)
    if ((it(e) !== "body" || Pt(r)) && (a = rn(e)), i) {
      const v = Ze(e, !0, o, e);
      l.x = v.x + e.clientLeft, l.y = v.y + e.clientTop;
    } else r && u();
  o && !i && r && u();
  const c = r && !i && !o ? Ir(r, a) : Ae(0), d = s.left + a.scrollLeft - l.x - c.x, h = s.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: h,
    width: s.width,
    height: s.height
  };
}
function yn(n) {
  return Ce(n).position === "static";
}
function Li(n, e) {
  if (!Le(n) || Ce(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return De(n) === t && (t = t.ownerDocument.body), t;
}
function Mr(n, e) {
  const t = ve(n);
  if (nn(n))
    return t;
  if (!Le(n)) {
    let r = je(n);
    for (; r && !ft(r); ) {
      if (_e(r) && !yn(r))
        return r;
      r = je(r);
    }
    return t;
  }
  let i = Li(n, e);
  for (; i && ll(i) && yn(i); )
    i = Li(i, e);
  return i && ft(i) && yn(i) && !Jn(i) ? t : i || pl(n) || t;
}
const kl = async function(n) {
  const e = this.getOffsetParent || Mr, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: Tl(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Pl(n) {
  return Ce(n).direction === "rtl";
}
const Al = {
  convertOffsetParentRelativeRectToViewportRelativeRect: gl,
  getDocumentElement: De,
  getClippingRect: El,
  getOffsetParent: Mr,
  getElementRects: kl,
  getClientRects: yl,
  getDimensions: xl,
  getScale: ct,
  isElement: _e,
  isRTL: Pl
};
function $r(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Ol(n, e) {
  let t = null, i;
  const r = De(n);
  function o() {
    var a;
    clearTimeout(i), (a = t) == null || a.disconnect(), t = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const u = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: h,
      height: v
    } = u;
    if (a || e(), !h || !v)
      return;
    const p = Dt(d), g = Dt(r.clientWidth - (c + h)), m = Dt(r.clientHeight - (d + v)), w = Dt(c), y = {
      rootMargin: -p + "px " + -g + "px " + -m + "px " + -w + "px",
      threshold: pe(0, Ve(1, l)) || 1
    };
    let b = !0;
    function _(E) {
      const C = E[0].intersectionRatio;
      if (C !== l) {
        if (!b)
          return s();
        C ? s(!1, C) : i = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      C === 1 && !$r(u, n.getBoundingClientRect()) && s(), b = !1;
    }
    try {
      t = new IntersectionObserver(_, {
        ...y,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(_, y);
    }
    t.observe(n);
  }
  return s(!0), o;
}
function Ll(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Qn(n), c = r || o ? [...u ? Et(u) : [], ...Et(e)] : [];
  c.forEach((w) => {
    r && w.addEventListener("scroll", t, {
      passive: !0
    }), o && w.addEventListener("resize", t);
  });
  const d = u && a ? Ol(u, t) : null;
  let h = -1, v = null;
  s && (v = new ResizeObserver((w) => {
    let [S] = w;
    S && S.target === u && v && (v.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var y;
      (y = v) == null || y.observe(e);
    })), t();
  }), u && !l && v.observe(u), v.observe(e));
  let p, g = l ? Ze(n) : null;
  l && m();
  function m() {
    const w = Ze(n);
    g && !$r(g, w) && t(), g = w, p = requestAnimationFrame(m);
  }
  return t(), () => {
    var w;
    c.forEach((S) => {
      r && S.removeEventListener("scroll", t), o && S.removeEventListener("resize", t);
    }), d?.(), (w = v) == null || w.disconnect(), v = null, l && cancelAnimationFrame(p);
  };
}
const Rl = nl, Il = il, Ri = Qa, Dl = ol, Ml = el, $l = Za, Bl = rl, ql = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: Al,
    ...t
  }, o = {
    ...r.platform,
    _c: i
  };
  return Ja(n, e, {
    ...r,
    platform: o
  });
};
function Fl(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Mn(n) {
  if (Fl(n)) {
    const e = n.$el;
    return Gn(e) && it(e) === "#comment" ? null : e;
  }
  return n;
}
function ut(n) {
  return typeof n == "function" ? n() : f(n);
}
function zl(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Mn(ut(n.element));
      return t == null ? {} : $l({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Br(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ii(n, e) {
  const t = Br(n);
  return Math.round(e * t) / t;
}
function Nl(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, r = A(() => {
    var C;
    return (C = ut(t.open)) != null ? C : !0;
  }), o = A(() => ut(t.middleware)), s = A(() => {
    var C;
    return (C = ut(t.placement)) != null ? C : "bottom";
  }), a = A(() => {
    var C;
    return (C = ut(t.strategy)) != null ? C : "absolute";
  }), l = A(() => {
    var C;
    return (C = ut(t.transform)) != null ? C : !0;
  }), u = A(() => Mn(n.value)), c = A(() => Mn(e.value)), d = k(0), h = k(0), v = k(a.value), p = k(s.value), g = dt({}), m = k(!1), w = A(() => {
    const C = {
      position: v.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return C;
    const I = Ii(c.value, d.value), O = Ii(c.value, h.value);
    return l.value ? {
      ...C,
      transform: "translate(" + I + "px, " + O + "px)",
      ...Br(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: v.value,
      left: I + "px",
      top: O + "px"
    };
  });
  let S;
  function y() {
    if (u.value == null || c.value == null)
      return;
    const C = r.value;
    ql(u.value, c.value, {
      middleware: o.value,
      placement: s.value,
      strategy: a.value
    }).then((I) => {
      d.value = I.x, h.value = I.y, v.value = I.strategy, p.value = I.placement, g.value = I.middlewareData, m.value = C !== !1;
    });
  }
  function b() {
    typeof S == "function" && (S(), S = void 0);
  }
  function _() {
    if (b(), i === void 0) {
      y();
      return;
    }
    if (u.value != null && c.value != null) {
      S = i(u.value, c.value, y);
      return;
    }
  }
  function E() {
    r.value || (m.value = !1);
  }
  return te([o, s, a, r], y, {
    flush: "sync"
  }), te([u, c], _, {
    flush: "sync"
  }), te(r, E, {
    flush: "sync"
  }), Ki() && Xi(b), {
    x: st(d),
    y: st(h),
    strategy: st(v),
    placement: st(p),
    middlewareData: st(g),
    isPositioned: st(m),
    floatingStyles: w,
    update: y
  };
}
const Wl = {
  side: "bottom",
  sideOffset: 0,
  sideFlip: !0,
  align: "center",
  alignOffset: 0,
  alignFlip: !0,
  arrowPadding: 0,
  hideShiftedArrow: !0,
  avoidCollisions: !0,
  collisionBoundary: () => [],
  collisionPadding: 0,
  sticky: "partial",
  hideWhenDetached: !1,
  positionStrategy: "fixed",
  updatePositionStrategy: "optimized",
  prioritizePosition: !1
}, [pf, Hl] = ge("PopperContent");
var Vl = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ uo({
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  }, { ...Wl }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, r = kr(), { forwardRef: o, currentElement: s } = Y(), a = k(), l = k(), { width: u, height: c } = Ws(l), d = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), h = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), v = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = A(() => ({
      padding: h.value,
      boundary: v.value.filter(Ba),
      altBoundary: v.value.length > 0
    })), g = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), m = ps(() => [
      Rl({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Ri({
        ...p.value,
        ...g.value
      }),
      t.avoidCollisions && Il({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? Bl() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Ri({
        ...p.value,
        ...g.value
      }),
      Dl({
        ...p.value,
        apply: ({ elements: B, rects: N, availableWidth: L, availableHeight: q }) => {
          const { width: G, height: j } = N.reference, Z = B.floating.style;
          Z.setProperty("--reka-popper-available-width", `${L}px`), Z.setProperty("--reka-popper-available-height", `${q}px`), Z.setProperty("--reka-popper-anchor-width", `${G}px`), Z.setProperty("--reka-popper-anchor-height", `${j}px`);
        }
      }),
      l.value && zl({
        element: l.value,
        padding: t.arrowPadding
      }),
      qa({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Ml({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), w = A(() => t.reference ?? r.anchor.value), { floatingStyles: S, placement: y, isPositioned: b, middlewareData: _ } = Nl(w, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...B) => Ll(...B, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: m
    }), E = A(() => Ln(y.value)[0]), C = A(() => Ln(y.value)[1]);
    Qi(() => {
      b.value && i("placed");
    });
    const I = A(() => {
      const B = _.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && B;
    }), O = k("");
    ae(() => {
      s.value && (O.value = window.getComputedStyle(s.value).zIndex);
    });
    const P = A(() => _.value.arrow?.x ?? 0), D = A(() => _.value.arrow?.y ?? 0);
    return Hl({
      placedSide: E,
      onArrowChange: (B) => l.value = B,
      arrowX: P,
      arrowY: D,
      shouldHideArrow: I
    }), (B, N) => (x(), H("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Re({
        ...f(S),
        transform: f(b) ? f(S).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: O.value,
        "--reka-popper-transform-origin": [f(_).transformOrigin?.x, f(_).transformOrigin?.y].join(" "),
        ...f(_).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [M(f(ee), K({ ref: f(o) }, B.$attrs, {
      "as-child": t.asChild,
      as: B.as,
      "data-side": E.value,
      "data-align": C.value,
      style: { animation: f(b) ? void 0 : "none" }
    }), {
      default: T(() => [z(B.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), jl = Vl;
function Ul(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => gt(i, e, t)) : gt(n, e, t);
}
function gt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Vt(n, e);
}
const [ei, Kl] = ge("ListboxRoot");
var Xl = /* @__PURE__ */ $({
  __name: "ListboxRoot",
  props: {
    modelValue: {
      type: null,
      required: !1
    },
    defaultValue: {
      type: null,
      required: !1
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    orientation: {
      type: String,
      required: !1,
      default: "vertical"
    },
    dir: {
      type: String,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    selectionBehavior: {
      type: String,
      required: !1,
      default: "toggle"
    },
    highlightOnHover: {
      type: Boolean,
      required: !1
    },
    by: {
      type: [String, Function],
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "update:modelValue",
    "highlight",
    "entryFocus",
    "leave"
  ],
  setup(n, { expose: e, emit: t }) {
    const i = n, r = t, { multiple: o, highlightOnHover: s, orientation: a, disabled: l, selectionBehavior: u, dir: c } = Fe(i), { getItems: d } = Ke({ isProvider: !0 }), { handleTypeaheadSearch: h } = Un(), { primitiveElement: v, currentElement: p } = Ct(), g = Ns(), m = Hn(c), w = fr(p), S = k(), y = k(!1), b = k(!0), _ = /* @__PURE__ */ St(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (o.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function E(F) {
      if (y.value = !0, i.multiple) {
        const W = Array.isArray(_.value) ? [..._.value] : [], U = W.findIndex((Q) => gt(Q, F, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? W.push(F) : W.splice(U, 1), _.value = W) : (_.value = [F], S.value = F);
      } else i.selectionBehavior === "toggle" && gt(_.value, F, i.by) ? _.value = void 0 : _.value = F;
      setTimeout(() => {
        y.value = !1;
      }, 1);
    }
    const C = k(null), I = k(null), O = k(!1), P = k(!1), D = /* @__PURE__ */ dn(), B = /* @__PURE__ */ dn(), N = /* @__PURE__ */ dn();
    function L() {
      return d().map((F) => F.ref).filter((F) => F.dataset.disabled !== "");
    }
    function q(F, W = !0) {
      if (!F) return;
      C.value = F, b.value && C.value.focus(), W && C.value.scrollIntoView({ block: "nearest" });
      const U = d().find((Q) => Q.ref === F);
      r("highlight", U);
    }
    function G(F) {
      if (O.value) N.trigger(F);
      else {
        const W = d().find((U) => gt(U.value, F, i.by));
        W && (C.value = W.ref, q(W.ref));
      }
    }
    function j(F) {
      C.value && C.value.isConnected && (F.preventDefault(), F.stopPropagation(), P.value || C.value.click());
    }
    function Z(F) {
      if (b.value) {
        if (y.value = !0, O.value) B.trigger(F);
        else {
          const W = F.altKey || F.ctrlKey || F.metaKey;
          if (W && F.key === "a" && o.value) {
            const U = d(), Q = U.map((Te) => Te.value);
            _.value = [...Q], F.preventDefault(), q(U[U.length - 1].ref);
          } else if (!W) {
            const U = h(F.key, d());
            U && q(U);
          }
        }
        setTimeout(() => {
          y.value = !1;
        }, 1);
      }
    }
    function ie() {
      P.value = !0;
    }
    function ce() {
      oe(() => {
        P.value = !1;
      });
    }
    function rt() {
      oe(() => {
        const F = new KeyboardEvent("keydown", { key: "PageUp" });
        Ye(F);
      });
    }
    function we(F) {
      const W = C.value;
      W?.isConnected && (I.value = W), C.value = null, r("leave", F);
    }
    function ot(F) {
      const W = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (F.currentTarget?.dispatchEvent(W), r("entryFocus", W), !W.defaultPrevented)
        if (I.value) q(I.value);
        else {
          const U = L()?.[0];
          q(U);
        }
    }
    function Ye(F) {
      const W = ka(F, a.value, m.value);
      if (!W) return;
      let U = L();
      if (C.value) {
        if (W === "last") U.reverse();
        else if (W === "prev" || W === "next") {
          W === "prev" && U.reverse();
          const Q = U.indexOf(C.value);
          U = U.slice(Q + 1);
        }
        un(F, U[0]);
      }
      if (U.length) {
        const Q = !C.value && W === "prev" ? U.length - 1 : 0;
        q(U[Q]);
      }
      if (O.value) return B.trigger(F);
    }
    function un(F, W) {
      if (!(O.value || i.selectionBehavior !== "replace" || !o.value || !Array.isArray(_.value) || (F.altKey || F.ctrlKey || F.metaKey) && !F.shiftKey) && F.shiftKey) {
        const Q = d().filter((Me) => Me.ref.dataset.disabled !== "");
        let Te = Q.find((Me) => Me.ref === W)?.value;
        if (F.key === g.END ? Te = Q[Q.length - 1].value : F.key === g.HOME && (Te = Q[0].value), !Te || !S.value) return;
        const ht = fs(Q.map((Me) => Me.value), S.value, Te);
        _.value = ht;
      }
    }
    async function cn(F) {
      if (await oe(), O.value) D.trigger(F);
      else {
        const W = L(), U = W.find((Q) => Q.dataset.state === "checked");
        U ? q(U) : W.length && q(W[0]);
      }
    }
    return te(_, () => {
      y.value || oe(() => {
        cn();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: C,
      highlightItem: G,
      highlightFirstItem: rt,
      highlightSelected: cn,
      getItems: d
    }), Kl({
      modelValue: _,
      onValueChange: E,
      multiple: o,
      orientation: a,
      dir: m,
      disabled: l,
      highlightOnHover: s,
      highlightedElement: C,
      isVirtual: O,
      virtualFocusHook: D,
      virtualKeydownHook: B,
      virtualHighlightHook: N,
      by: i.by,
      firstValue: S,
      selectionBehavior: u,
      focusable: b,
      onLeave: we,
      onEnter: ot,
      changeHighlight: q,
      onKeydownEnter: j,
      onKeydownNavigation: Ye,
      onKeydownTypeAhead: Z,
      onCompositionStart: ie,
      onCompositionEnd: ce,
      highlightFirstItem: rt
    }), (F, W) => (x(), R(f(ee), {
      ref_key: "primitiveElement",
      ref: v,
      as: F.as,
      "as-child": F.asChild,
      dir: f(m),
      "data-disabled": f(l) ? "" : void 0,
      onPointerleave: we,
      onFocusout: W[0] || (W[0] = async (U) => {
        const Q = U.relatedTarget || U.target;
        await oe(), C.value && f(p) && !f(p).contains(Q) && we(U);
      })
    }, {
      default: T(() => [z(F.$slots, "default", { modelValue: f(_) }), f(w) && F.name ? (x(), R(f(La), {
        key: 0,
        name: F.name,
        value: f(_),
        disabled: f(l),
        required: F.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : X("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), Yl = Xl, Gl = /* @__PURE__ */ $({
  __name: "ListboxContent",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const { CollectionSlot: e } = Ke(), t = ei(), i = ar(!1, 10);
    return (r, o) => (x(), R(f(e), null, {
      default: T(() => [M(f(ee), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: f(t).focusable.value ? f(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": f(t).orientation.value,
        "aria-multiselectable": !!f(t).multiple.value,
        "data-orientation": f(t).orientation.value,
        onMousedown: o[0] || (o[0] = He((s) => i.value = !0, ["left"])),
        onFocus: o[1] || (o[1] = (s) => {
          f(i) || f(t).onEnter(s);
        }),
        onKeydown: [
          o[2] || (o[2] = yt((s) => {
            f(t).orientation.value === "vertical" && (s.key === "ArrowLeft" || s.key === "ArrowRight") || f(t).orientation.value === "horizontal" && (s.key === "ArrowUp" || s.key === "ArrowDown") || (s.preventDefault(), f(t).focusable.value && f(t).onKeydownNavigation(s));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          yt(f(t).onKeydownEnter, ["enter"]),
          f(t).onKeydownTypeAhead
        ]
      }, {
        default: T(() => [z(r.$slots, "default")]),
        _: 3
      }, 8, [
        "as",
        "as-child",
        "tabindex",
        "aria-orientation",
        "aria-multiselectable",
        "data-orientation",
        "onKeydown"
      ])]),
      _: 3
    }));
  }
}), Jl = Gl, Zl = /* @__PURE__ */ $({
  __name: "ListboxFilter",
  props: {
    modelValue: {
      type: String,
      required: !1
    },
    autoFocus: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = /* @__PURE__ */ St(t, "modelValue", e, {
      defaultValue: "",
      passive: t.modelValue === void 0
    }), o = ei(), { primitiveElement: s, currentElement: a } = Ct(), l = A(() => t.disabled || o.disabled.value || !1), u = k();
    return co(() => u.value = o.highlightedElement.value?.id), ne(() => {
      o.focusable.value = !1, setTimeout(() => {
        t.autoFocus && a.value?.focus();
      }, 1);
    }), Ee(() => {
      o.focusable.value = !0;
    }), (c, d) => (x(), R(f(ee), {
      ref_key: "primitiveElement",
      ref: s,
      as: c.as,
      "as-child": c.asChild,
      value: f(r),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": u.value,
      type: "text",
      onKeydown: [yt(He(f(o).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), yt(f(o).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (h) => {
        r.value = h.target.value, f(o).highlightFirstItem();
      }),
      onCompositionstart: f(o).onCompositionStart,
      onCompositionend: f(o).onCompositionEnd
    }, {
      default: T(() => [z(c.$slots, "default", { modelValue: f(r) })]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "value",
      "disabled",
      "data-disabled",
      "aria-disabled",
      "aria-activedescendant",
      "onKeydown",
      "onCompositionstart",
      "onCompositionend"
    ]));
  }
}), Ql = Zl;
const eu = "listbox.select", [tu, nu] = ge("ListboxItem");
var iu = /* @__PURE__ */ $({
  __name: "ListboxItem",
  props: {
    value: {
      type: null,
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "div"
    }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, i = e, r = _t(void 0, "reka-listbox-item"), { CollectionItem: o } = Ke(), { forwardRef: s, currentElement: a } = Y(), l = ei(), u = A(() => a.value === l.highlightedElement.value), c = A(() => Ul(l.modelValue.value, t.value, l.by)), d = A(() => l.disabled.value || t.disabled);
    async function h(p) {
      i("select", p), !p?.defaultPrevented && !d.value && p && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function v(p) {
      const g = {
        originalEvent: p,
        value: t.value
      };
      Gt(eu, h, g);
    }
    return nu({ isSelected: c }), (p, g) => (x(), R(f(o), { value: p.value }, {
      default: T(() => [fo([u.value, c.value], () => M(f(ee), K({ id: f(r) }, p.$attrs, {
        ref: f(s),
        role: "option",
        tabindex: f(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: p.as,
        "as-child": p.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: v,
        onKeydown: yt(He(v, ["prevent"]), ["space"]),
        onPointermove: g[0] || (g[0] = () => {
          f(l).highlightedElement.value !== f(a) && f(l).highlightOnHover.value && !f(l).focusable.value && f(l).changeHighlight(f(a), !1);
        })
      }), {
        default: T(() => [z(p.$slots, "default")]),
        _: 3
      }, 16, [
        "id",
        "tabindex",
        "aria-selected",
        "as",
        "as-child",
        "disabled",
        "data-disabled",
        "data-highlighted",
        "data-state",
        "onKeydown"
      ]), g, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), ru = iu, ou = /* @__PURE__ */ $({
  __name: "ListboxItemIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    const e = n;
    Y();
    const t = tu();
    return (i, r) => f(t).isSelected.value ? (x(), R(f(ee), K({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: T(() => [z(i.$slots, "default")]),
      _: 3
    }, 16)) : X("v-if", !0);
  }
}), su = ou;
function qr(n) {
  const e = Jt({ nonce: k() });
  return A(() => n?.value || e.nonce?.value);
}
const [xe, au] = ge("ScrollAreaRoot");
var lu = /* @__PURE__ */ $({
  __name: "ScrollAreaRoot",
  props: {
    type: {
      type: String,
      required: !1,
      default: "hover"
    },
    dir: {
      type: String,
      required: !1
    },
    scrollHideDelay: {
      type: Number,
      required: !1,
      default: 600
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n, { expose: e }) {
    const t = n, i = k(0), r = k(0), o = k(), s = k(), a = k(), l = k(), u = k(!1), c = k(!1), { type: d, dir: h, scrollHideDelay: v } = Fe(t), p = Hn(h);
    function g() {
      o.value?.scrollTo({ top: 0 });
    }
    function m() {
      o.value?.scrollTo({
        top: 0,
        left: 0
      });
    }
    e({
      viewport: o,
      scrollTop: g,
      scrollTopLeft: m
    });
    const { forwardRef: w, currentElement: S } = Y();
    return au({
      type: d,
      dir: p,
      scrollHideDelay: v,
      scrollArea: S,
      viewport: o,
      onViewportChange: (y) => {
        o.value = y || void 0;
      },
      content: s,
      onContentChange: (y) => {
        s.value = y;
      },
      scrollbarX: a,
      scrollbarXEnabled: u,
      scrollbarY: l,
      scrollbarYEnabled: c,
      onScrollbarXChange: (y) => {
        a.value = y || void 0;
      },
      onScrollbarYChange: (y) => {
        l.value = y || void 0;
      },
      onScrollbarXEnabledChange: (y) => {
        u.value = y;
      },
      onScrollbarYEnabledChange: (y) => {
        c.value = y;
      },
      onCornerWidthChange: (y) => {
        i.value = y;
      },
      onCornerHeightChange: (y) => {
        r.value = y;
      }
    }), (y, b) => (x(), R(f(ee), {
      ref: f(w),
      "as-child": t.asChild,
      as: y.as,
      dir: f(p),
      style: Re({
        position: "relative",
        "--reka-scroll-area-corner-width": `${i.value}px`,
        "--reka-scroll-area-corner-height": `${r.value}px`
      })
    }, {
      default: T(() => [z(y.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "dir",
      "style"
    ]));
  }
}), uu = lu;
function Fr(n, e) {
  return (t) => {
    if (n[0] === n[1] || e[0] === e[1]) return e[0];
    const i = (e[1] - e[0]) / (n[1] - n[0]);
    return e[0] + i * (t - n[0]);
  };
}
function sn(n) {
  const e = zr(n.viewport, n.content), t = n.scrollbar.paddingStart + n.scrollbar.paddingEnd, i = (n.scrollbar.size - t) * e;
  return Math.max(i, 18);
}
function zr(n, e) {
  const t = n / e;
  return Number.isNaN(t) ? 0 : t;
}
function cu(n, e = () => {
}) {
  let t = {
    left: n.scrollLeft,
    top: n.scrollTop
  }, i = 0;
  return (function r() {
    const o = {
      left: n.scrollLeft,
      top: n.scrollTop
    }, s = t.left !== o.left, a = t.top !== o.top;
    (s || a) && e(), t = o, i = window.requestAnimationFrame(r);
  })(), () => window.cancelAnimationFrame(i);
}
function Di(n, e, t = "ltr") {
  const i = sn(e), r = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = e.scrollbar.size - r, s = e.content - e.viewport, a = o - i, l = t === "ltr" ? [0, s] : [s * -1, 0], u = kn(n, l[0], l[1]);
  return Fr([0, s], [0, a])(u);
}
function Mt(n) {
  return n ? Number.parseInt(n, 10) : 0;
}
function du(n, e, t, i = "ltr") {
  const r = sn(t), o = r / 2, s = e || o, a = r - s, l = t.scrollbar.paddingStart + s, u = t.scrollbar.size - t.scrollbar.paddingEnd - a, c = t.content - t.viewport, d = i === "ltr" ? [0, c] : [c * -1, 0];
  return Fr([l, u], d)(n);
}
function Mi(n, e) {
  return n > 0 && n < e;
}
var fu = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarX",
  setup(n) {
    const e = xe(), t = an(), { forwardRef: i, currentElement: r } = Y();
    ne(() => {
      r.value && e.onScrollbarXChange(r.value);
    });
    const o = A(() => t.sizes.value);
    return (s, a) => (x(), R(Nr, {
      ref: f(i),
      "is-horizontal": !0,
      "data-orientation": "horizontal",
      style: Re({
        bottom: 0,
        left: f(e).dir.value === "rtl" ? "var(--reka-scroll-area-corner-width)" : 0,
        right: f(e).dir.value === "ltr" ? "var(--reka-scroll-area-corner-width)" : 0,
        "--reka-scroll-area-thumb-width": o.value ? `${f(sn)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => f(t).onDragScroll(l.x))
    }, {
      default: T(() => [z(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), pu = fu, hu = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarY",
  setup(n) {
    const e = xe(), t = an(), { forwardRef: i, currentElement: r } = Y();
    ne(() => {
      r.value && e.onScrollbarYChange(r.value);
    });
    const o = A(() => t.sizes.value);
    return (s, a) => (x(), R(Nr, {
      ref: f(i),
      "is-horizontal": !1,
      "data-orientation": "vertical",
      style: Re({
        top: 0,
        right: f(e).dir.value === "ltr" ? 0 : void 0,
        left: f(e).dir.value === "rtl" ? 0 : void 0,
        bottom: "var(--reka-scroll-area-corner-height)",
        "--reka-scroll-area-thumb-height": o.value ? `${f(sn)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => f(t).onDragScroll(l.y))
    }, {
      default: T(() => [z(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), vu = hu, mu = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarAuto",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = xe(), t = At(), { forwardRef: i } = Y(), r = k(!1), o = /* @__PURE__ */ Wn(() => {
      if (e.viewport.value) {
        const s = e.viewport.value.offsetWidth < e.viewport.value.scrollWidth, a = e.viewport.value.offsetHeight < e.viewport.value.scrollHeight;
        r.value = t.isHorizontal.value ? s : a;
      }
    }, 10);
    return ne(() => o()), wt(e.viewport, o), wt(e.content, o), (s, a) => (x(), R(f(nt), { present: s.forceMount || r.value }, {
      default: T(() => [M(ni, K(s.$attrs, {
        ref: f(i),
        "data-state": r.value ? "visible" : "hidden"
      }), {
        default: T(() => [z(s.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), ti = mu, gu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarGlimpse",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = xe(), t = At(), { forwardRef: i } = Y(), { state: r, dispatch: o } = jn("hidden", {
      hidden: {
        POINTER_ENTER: "glimpse",
        SCROLL: "scrolling"
      },
      glimpse: {
        HIDE: "hidden",
        POINTER_LEAVE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "glimpse"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    }), s = A(() => r.value !== "hidden");
    function a() {
      o("POINTER_ENTER");
    }
    function l() {
      o("POINTER_LEAVE");
    }
    const u = /* @__PURE__ */ Wn(() => o("SCROLL_END"), 100);
    return ae((c) => {
      if (r.value === "glimpse") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        c(() => {
          window.clearTimeout(d);
        });
      }
    }), ae((c) => {
      if (r.value === "idle") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        c(() => {
          window.clearTimeout(d);
        });
      }
    }), ae((c) => {
      const d = e.viewport.value, h = t.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (d) {
        let v = d[h];
        const p = () => {
          const g = d[h];
          v !== g && (o("SCROLL"), u()), v = g;
        };
        d.addEventListener("scroll", p), c(() => {
          d.removeEventListener("scroll", p);
        });
      }
    }), ne(() => {
      const c = e.scrollArea.value;
      c && (c.addEventListener("pointerenter", a), c.addEventListener("pointerleave", l));
    }), Ee(() => {
      const c = e.scrollArea.value;
      c && (c.removeEventListener("pointerenter", a), c.removeEventListener("pointerleave", l));
    }), (c, d) => (x(), R(f(nt), { present: c.forceMount || s.value }, {
      default: T(() => [M(ti, K(c.$attrs, {
        ref: f(i),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: T(() => [z(c.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), yu = gu, bu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarHover",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = xe(), { forwardRef: t } = Y();
    let i;
    const r = k(!1);
    function o() {
      window.clearTimeout(i), r.value = !0;
    }
    function s() {
      i = window.setTimeout(() => {
        r.value = !1;
      }, e.scrollHideDelay.value);
    }
    return ne(() => {
      const a = e.scrollArea.value;
      a && (a.addEventListener("pointerenter", o), a.addEventListener("pointerleave", s));
    }), Ee(() => {
      const a = e.scrollArea.value;
      a && (window.clearTimeout(i), a.removeEventListener("pointerenter", o), a.removeEventListener("pointerleave", s));
    }), (a, l) => (x(), R(f(nt), { present: a.forceMount || r.value }, {
      default: T(() => [M(ti, K(a.$attrs, {
        ref: f(t),
        "data-state": r.value ? "visible" : "hidden"
      }), {
        default: T(() => [z(a.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), wu = bu, Su = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarScroll",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = xe(), t = At(), { forwardRef: i } = Y(), { state: r, dispatch: o } = jn("hidden", {
      hidden: { SCROLL: "scrolling" },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    }), s = A(() => r.value !== "hidden");
    ae((l) => {
      if (r.value === "idle") {
        const u = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        l(() => {
          window.clearTimeout(u);
        });
      }
    });
    const a = /* @__PURE__ */ Wn(() => o("SCROLL_END"), 100);
    return ae((l) => {
      const u = e.viewport.value, c = t.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (u) {
        let d = u[c];
        const h = () => {
          const v = u[c];
          d !== v && (o("SCROLL"), a()), d = v;
        };
        u.addEventListener("scroll", h), l(() => {
          u.removeEventListener("scroll", h);
        });
      }
    }), (l, u) => (x(), R(f(nt), { present: l.forceMount || s.value }, {
      default: T(() => [M(ni, K(l.$attrs, {
        ref: f(i),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: T(() => [z(l.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), _u = Su;
const [At, Cu] = ge("ScrollAreaScrollbar");
var Eu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbar",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: "vertical"
    },
    forceMount: {
      type: Boolean,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "div"
    }
  },
  setup(n) {
    const e = n, { forwardRef: t } = Y(), i = xe(), r = A(() => e.orientation === "horizontal");
    te(r, () => {
      r.value ? i.onScrollbarXEnabledChange(!0) : i.onScrollbarYEnabledChange(!0);
    }, { immediate: !0 }), Ee(() => {
      i.onScrollbarXEnabledChange(!1), i.onScrollbarYEnabledChange(!1);
    });
    const { orientation: o, forceMount: s, asChild: a, as: l } = Fe(e);
    return Cu({
      orientation: o,
      forceMount: s,
      isHorizontal: r,
      as: l,
      asChild: a
    }), (u, c) => f(i).type.value === "hover" ? (x(), R(wu, K({ key: 0 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "scroll" ? (x(), R(_u, K({ key: 1 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "glimpse" ? (x(), R(yu, K({ key: 2 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "auto" ? (x(), R(ti, K({ key: 3 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "always" ? (x(), R(ni, K({ key: 4 }, u.$attrs, {
      ref: f(t),
      "data-state": "visible"
    }), {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 16)) : X("v-if", !0);
  }
}), xu = Eu;
const [an, Tu] = ge("ScrollAreaScrollbarVisible");
var ku = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarVisible",
  setup(n) {
    const e = xe(), t = At(), { forwardRef: i } = Y(), r = k({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    }), o = A(() => {
      const w = zr(r.value.viewport, r.value.content);
      return w > 0 && w < 1;
    }), s = k(), a = k(0);
    function l(w, S) {
      if (v.value) {
        const y = e.viewport.value.scrollLeft + w.deltaY;
        e.viewport.value.scrollLeft = y, Mi(y, S) && w.preventDefault();
      } else {
        const y = e.viewport.value.scrollTop + w.deltaY;
        e.viewport.value.scrollTop = y, Mi(y, S) && w.preventDefault();
      }
    }
    function u(w, S) {
      v.value ? a.value = S.x : a.value = S.y;
    }
    function c(w) {
      a.value = 0;
    }
    function d(w) {
      r.value = w;
    }
    function h(w, S) {
      return du(w, a.value, r.value, S);
    }
    const v = A(() => t.isHorizontal.value);
    function p(w) {
      v.value ? e.viewport.value.scrollLeft = h(w, e.dir.value) : e.viewport.value.scrollTop = h(w);
    }
    function g() {
      if (v.value) {
        if (e.viewport.value && s.value) {
          const w = e.viewport.value.scrollLeft, S = Di(w, r.value, e.dir.value);
          s.value.style.transform = `translate3d(${S}px, 0, 0)`;
        }
      } else if (e.viewport.value && s.value) {
        const w = e.viewport.value.scrollTop, S = Di(w, r.value);
        s.value.style.transform = `translate3d(0, ${S}px, 0)`;
      }
    }
    function m(w) {
      s.value = w;
    }
    return Tu({
      sizes: r,
      hasThumb: o,
      handleWheelScroll: l,
      handleThumbDown: u,
      handleThumbUp: c,
      handleSizeChange: d,
      onThumbPositionChange: g,
      onThumbChange: m,
      onDragScroll: p
    }), (w, S) => v.value ? (x(), R(pu, K({ key: 0 }, w.$attrs, { ref: f(i) }), {
      default: T(() => [z(w.$slots, "default")]),
      _: 3
    }, 16)) : (x(), R(vu, K({ key: 1 }, w.$attrs, { ref: f(i) }), {
      default: T(() => [z(w.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ni = ku, Pu = /* @__PURE__ */ $({
  __name: "ScrollAreaScrollbarImpl",
  props: { isHorizontal: {
    type: Boolean,
    required: !0
  } },
  emits: [
    "onDragScroll",
    "onWheelScroll",
    "onThumbPointerDown"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = xe(), o = an(), s = At(), { forwardRef: a, currentElement: l } = Y(), u = k(""), c = k();
    function d(w) {
      if (c.value) {
        const S = w.clientX - c.value?.left, y = w.clientY - c.value?.top;
        i("onDragScroll", {
          x: S,
          y
        });
      }
    }
    function h(w) {
      w.button === 0 && (w.target.setPointerCapture(w.pointerId), c.value = l.value.getBoundingClientRect(), u.value = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", r.viewport && (r.viewport.value.style.scrollBehavior = "auto"), d(w));
    }
    function v(w) {
      d(w);
    }
    function p(w) {
      const S = w.target;
      S.hasPointerCapture(w.pointerId) && S.releasePointerCapture(w.pointerId), document.body.style.webkitUserSelect = u.value, r.viewport && (r.viewport.value.style.scrollBehavior = ""), c.value = void 0;
    }
    function g(w) {
      const S = w.target, y = l.value?.contains(S), b = o.sizes.value.content - o.sizes.value.viewport;
      y && o.handleWheelScroll(w, b);
    }
    ne(() => {
      document.addEventListener("wheel", g, { passive: !1 });
    }), Ee(() => {
      document.removeEventListener("wheel", g);
    });
    function m() {
      l.value && (t.isHorizontal ? o.handleSizeChange({
        content: r.viewport.value?.scrollWidth ?? 0,
        viewport: r.viewport.value?.offsetWidth ?? 0,
        scrollbar: {
          size: l.value.clientWidth ?? 0,
          paddingStart: Mt(getComputedStyle(l.value).paddingLeft),
          paddingEnd: Mt(getComputedStyle(l.value).paddingRight)
        }
      }) : o.handleSizeChange({
        content: r.viewport.value?.scrollHeight ?? 0,
        viewport: r.viewport.value?.offsetHeight ?? 0,
        scrollbar: {
          size: l.value?.clientHeight ?? 0,
          paddingStart: Mt(getComputedStyle(l.value).paddingTop),
          paddingEnd: Mt(getComputedStyle(l.value).paddingBottom)
        }
      }), o.onThumbPositionChange());
    }
    return wt(l, m), wt(r.content, m), (w, S) => (x(), R(f(ee), {
      ref: f(a),
      style: { position: "absolute" },
      "data-scrollbarimpl": "",
      as: f(s).as.value,
      "as-child": f(s).asChild.value,
      onPointerdown: h,
      onPointermove: v,
      onPointerup: p
    }, {
      default: T(() => [z(w.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Nr = Pu, Au = /* @__PURE__ */ $({
  __name: "ScrollAreaThumb",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = n, t = xe(), i = an();
    function r(h) {
      const p = h.target.getBoundingClientRect(), g = h.clientX - p.left, m = h.clientY - p.top;
      i.handleThumbDown(h, {
        x: g,
        y: m
      });
    }
    function o(h) {
      i.handleThumbUp(h);
    }
    const { forwardRef: s, currentElement: a } = Y(), l = k(), u = A(() => t.viewport.value);
    function c() {
      if (!l.value) {
        const h = cu(u.value, i.onThumbPositionChange);
        l.value = h, i.onThumbPositionChange();
      }
    }
    const d = A(() => i.sizes.value);
    return xs(d, () => {
      i.onThumbChange(a.value), u.value && (i.onThumbPositionChange(), u.value.addEventListener("scroll", c));
    }), Ee(() => {
      u.value.removeEventListener("scroll", c), t.viewport.value?.removeEventListener("scroll", c);
    }), (h, v) => (x(), R(f(ee), {
      ref: f(s),
      "data-state": f(i).hasThumb ? "visible" : "hidden",
      style: {
        width: "var(--reka-scroll-area-thumb-width)",
        height: "var(--reka-scroll-area-thumb-height)"
      },
      "as-child": e.asChild,
      as: h.as,
      onPointerdown: r,
      onPointerup: o
    }, {
      default: T(() => [z(h.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "as-child",
      "as"
    ]));
  }
}), Ou = Au, Lu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "ScrollAreaViewport",
  props: {
    nonce: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n, { expose: e }) {
    const t = n, { nonce: i } = Fe(t), r = qr(i), o = xe(), s = k();
    ne(() => {
      o.onViewportChange(s.value), o.onContentChange(l.value);
    }), e({ viewportElement: s });
    const { forwardRef: a, currentElement: l } = Y();
    return (u, c) => (x(), H(he, null, [V("div", K({
      ref_key: "viewportElement",
      ref: s,
      "data-reka-scroll-area-viewport": "",
      style: {
        overflowX: f(o).scrollbarXEnabled.value ? "scroll" : "hidden",
        overflowY: f(o).scrollbarYEnabled.value ? "scroll" : "hidden"
      }
    }, u.$attrs, { tabindex: 0 }), [M(f(ee), {
      ref: f(a),
      style: Re({ minWidth: f(o).scrollbarXEnabled.value ? "fit-content" : void 0 }),
      "as-child": t.asChild,
      as: u.as
    }, {
      default: T(() => [z(u.$slots, "default")]),
      _: 3
    }, 8, [
      "style",
      "as-child",
      "as"
    ])], 16), M(f(ee), {
      as: "style",
      nonce: f(r)
    }, {
      default: T(() => c[0] || (c[0] = [ue(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-scroll-area-viewport] { scrollbar-width:none; -ms-overflow-style:none; -webkit-overflow-scrolling:touch; } [data-reka-scroll-area-viewport]::-webkit-scrollbar { display:none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Ru = Lu;
const Iu = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Du = [" ", "Enter"], Se = 10;
function xt(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => $n(i, e, t)) : $n(n, e, t);
}
function $n(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Vt(n, e);
}
function Mu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const $u = {
  key: 0,
  value: ""
}, [Xe, Wr] = ge("SelectRoot");
var Bu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    defaultOpen: {
      type: Boolean,
      required: !1
    },
    defaultValue: {
      type: null,
      required: !1
    },
    modelValue: {
      type: null,
      required: !1,
      default: void 0
    },
    by: {
      type: [String, Function],
      required: !1
    },
    dir: {
      type: String,
      required: !1
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    autocomplete: {
      type: String,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    }
  },
  emits: ["update:modelValue", "update:open"],
  setup(n, { emit: e }) {
    const t = n, i = e, { required: r, disabled: o, multiple: s, dir: a } = Fe(t), l = /* @__PURE__ */ St(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (s.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ St(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = k(), d = k(), h = k({
      x: 0,
      y: 0
    }), v = A(() => s.value && Array.isArray(l.value) ? l.value?.length === 0 : Pn(l.value));
    Ke({ isProvider: !0 });
    const p = Hn(a), g = fr(c), m = k(/* @__PURE__ */ new Set()), w = A(() => Array.from(m.value).map((b) => b.value).join(";"));
    function S(b) {
      if (s.value) {
        const _ = Array.isArray(l.value) ? [...l.value] : [], E = _.findIndex((C) => $n(C, b, t.by));
        E === -1 ? _.push(b) : _.splice(E, 1), l.value = [..._];
      } else l.value = b;
    }
    function y(b) {
      return Array.from(m.value).find((_) => xt(b, _.value, t.by));
    }
    return Wr({
      triggerElement: c,
      onTriggerChange: (b) => {
        c.value = b;
      },
      valueElement: d,
      onValueElementChange: (b) => {
        d.value = b;
      },
      contentId: "",
      modelValue: l,
      onValueChange: S,
      by: t.by,
      open: u,
      multiple: s,
      required: r,
      onOpenChange: (b) => {
        u.value = b;
      },
      dir: p,
      triggerPointerDownPosRef: h,
      disabled: o,
      isEmptyModelValue: v,
      optionsSet: m,
      onOptionAdd: (b) => {
        const _ = y(b.value);
        _ && m.value.delete(_), m.value.add(b);
      },
      onOptionRemove: (b) => {
        const _ = y(b.value);
        _ && m.value.delete(_);
      }
    }), (b, _) => (x(), R(f(Da), null, {
      default: T(() => [z(b.$slots, "default", {
        modelValue: f(l),
        open: f(u)
      }), f(g) ? (x(), R(zu, {
        key: w.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: f(s),
        required: f(r),
        name: b.name,
        autocomplete: b.autocomplete,
        disabled: f(o),
        value: f(l)
      }, {
        default: T(() => [f(Pn)(f(l)) ? (x(), H("option", $u)) : X("v-if", !0), (x(!0), H(he, null, et(Array.from(m.value), (E) => (x(), H("option", K({ key: E.value ?? "" }, { ref_for: !0 }, E), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : X("v-if", !0)]),
      _: 3
    }));
  }
}), qu = Bu, Fu = /* @__PURE__ */ $({
  __name: "BubbleSelect",
  props: {
    autocomplete: {
      type: String,
      required: !1
    },
    autofocus: {
      type: Boolean,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    form: {
      type: String,
      required: !1
    },
    multiple: {
      type: Boolean,
      required: !1
    },
    name: {
      type: String,
      required: !1
    },
    required: {
      type: Boolean,
      required: !1
    },
    size: {
      type: Number,
      required: !1
    },
    value: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = n, t = k(), i = Xe();
    te(() => e.value, (o, s) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (o !== s && u && t.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(t.value, o), t.value.dispatchEvent(c);
      }
    });
    function r(o) {
      i.onValueChange(o.target.value);
    }
    return (o, s) => (x(), R(f(Tr), { "as-child": "" }, {
      default: T(() => [V("select", K({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: r }), [z(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), zu = Fu, Nu = /* @__PURE__ */ $({
  __name: "SelectPopperPosition",
  props: {
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1,
      default: Se
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const t = Vn(n);
    return (i, r) => (x(), R(f(jl), K(f(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: T(() => [z(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wu = Nu;
const Hu = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [ln, Hr] = ge("SelectContent");
var Vu = /* @__PURE__ */ $({
  __name: "SelectContentImpl",
  props: {
    position: {
      type: String,
      required: !1,
      default: "item-aligned"
    },
    bodyLock: {
      type: Boolean,
      required: !1,
      default: !0
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1,
      default: "start"
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = Xe();
    Ds(), cr(t.bodyLock);
    const { CollectionSlot: o, getItems: s } = Ke(), a = k();
    hr(a);
    const { search: l, handleTypeaheadSearch: u } = Un(), c = k(), d = k(), h = k(), v = k(!1), p = k(!1), g = k(!1);
    function m() {
      d.value && a.value && wi([d.value, a.value]);
    }
    te(v, () => {
      m();
    });
    const { onOpenChange: w, triggerPointerDownPosRef: S } = r;
    ae((E) => {
      if (!a.value) return;
      let C = {
        x: 0,
        y: 0
      };
      const I = (P) => {
        C = {
          x: Math.abs(Math.round(P.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(P.pageY) - (S.value?.y ?? 0))
        };
      }, O = (P) => {
        P.pointerType !== "touch" && (C.x <= 10 && C.y <= 10 ? P.preventDefault() : a.value?.contains(P.target) || w(!1), document.removeEventListener("pointermove", I), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", I), document.addEventListener("pointerup", O, {
        capture: !0,
        once: !0
      })), E(() => {
        document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", O, { capture: !0 });
      });
    });
    function y(E) {
      const C = E.ctrlKey || E.altKey || E.metaKey;
      if (E.key === "Tab" && E.preventDefault(), !C && E.key.length === 1 && u(E.key, s()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(E.key)) {
        let O = [...s().map((P) => P.ref)];
        if (["ArrowUp", "End"].includes(E.key) && (O = O.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(E.key)) {
          const P = E.target, D = O.indexOf(P);
          O = O.slice(D + 1);
        }
        setTimeout(() => wi(O)), E.preventDefault();
      }
    }
    const b = A(() => t.position === "popper" ? t : {}), _ = Vn(b.value);
    return Hr({
      content: a,
      viewport: c,
      onViewportChange: (E) => {
        c.value = E;
      },
      itemRefCallback: (E, C, I) => {
        const O = !p.value && !I, P = xt(r.modelValue.value, C, r.by);
        if (r.multiple.value) {
          if (g.value) return;
          (P || O) && (d.value = E, P && (g.value = !0));
        } else (P || O) && (d.value = E);
        O && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: h,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (E, C, I) => {
        const O = !p.value && !I;
        (xt(r.modelValue.value, C, r.by) || O) && (h.value = E);
      },
      focusSelectedItem: m,
      position: t.position,
      isPositioned: v,
      searchRef: l
    }), (E, C) => (x(), R(f(o), null, {
      default: T(() => [M(f(br), {
        "as-child": "",
        onMountAutoFocus: C[6] || (C[6] = He(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: C[7] || (C[7] = (I) => {
          i("closeAutoFocus", I), !I.defaultPrevented && (f(r).triggerElement.value?.focus({ preventScroll: !0 }), I.preventDefault());
        })
      }, {
        default: T(() => [M(f(gr), {
          "as-child": "",
          "disable-outside-pointer-events": E.disableOutsidePointerEvents,
          onFocusOutside: C[2] || (C[2] = He(() => {
          }, ["prevent"])),
          onDismiss: C[3] || (C[3] = (I) => f(r).onOpenChange(!1)),
          onEscapeKeyDown: C[4] || (C[4] = (I) => i("escapeKeyDown", I)),
          onPointerDownOutside: C[5] || (C[5] = (I) => i("pointerDownOutside", I))
        }, {
          default: T(() => [(x(), R(po(E.position === "popper" ? Wu : Yu), K({
            ...E.$attrs,
            ...f(_)
          }, {
            id: f(r).contentId,
            ref: (I) => {
              const O = f(Oe)(I);
              O?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = O.firstElementChild : a.value = O;
            },
            role: "listbox",
            "data-state": f(r).open.value ? "open" : "closed",
            dir: f(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: C[0] || (C[0] = He(() => {
            }, ["prevent"])),
            onPlaced: C[1] || (C[1] = (I) => v.value = !0),
            onKeydown: y
          }), {
            default: T(() => [z(E.$slots, "default")]),
            _: 3
          }, 16, [
            "id",
            "data-state",
            "dir",
            "onKeydown"
          ]))]),
          _: 3
        }, 8, ["disable-outside-pointer-events"])]),
        _: 3
      })]),
      _: 3
    }));
  }
}), ju = Vu;
const [Uu, Ku] = ge("SelectItemAlignedPosition");
var Xu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectItemAlignedPosition",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, { getItems: r } = Ke(), o = Xe(), s = ln(), a = k(!1), l = k(!0), u = k(), { forwardRef: c, currentElement: d } = Y(), { viewport: h, selectedItem: v, selectedItemText: p, focusSelectedItem: g } = s;
    function m() {
      if (o.triggerElement.value && o.valueElement.value && u.value && d.value && h?.value && v?.value && p?.value) {
        const y = o.triggerElement.value.getBoundingClientRect(), b = d.value.getBoundingClientRect(), _ = o.valueElement.value.getBoundingClientRect(), E = p.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const F = E.left - b.left, W = _.left - F, U = y.left - W, Q = y.width + U, Te = Math.max(Q, b.width), ht = window.innerWidth - Se, Me = kn(W, Se, Math.max(Se, ht - Te));
          u.value.style.minWidth = `${Q}px`, u.value.style.left = `${Me}px`;
        } else {
          const F = b.right - E.right, W = window.innerWidth - _.right - F, U = window.innerWidth - y.right - W, Q = y.width + U, Te = Math.max(Q, b.width), ht = window.innerWidth - Se, Me = kn(W, Se, Math.max(Se, ht - Te));
          u.value.style.minWidth = `${Q}px`, u.value.style.right = `${Me}px`;
        }
        const C = r().map((F) => F.ref), I = window.innerHeight - Se * 2, O = h.value.scrollHeight, P = window.getComputedStyle(d.value), D = Number.parseInt(P.borderTopWidth, 10), B = Number.parseInt(P.paddingTop, 10), N = Number.parseInt(P.borderBottomWidth, 10), L = Number.parseInt(P.paddingBottom, 10), q = D + B + O + L + N, G = Math.min(v.value.offsetHeight * 5, q), j = window.getComputedStyle(h.value), Z = Number.parseInt(j.paddingTop, 10), ie = Number.parseInt(j.paddingBottom, 10), ce = y.top + y.height / 2 - Se, rt = I - ce, we = v.value.offsetHeight / 2, ot = v.value.offsetTop + we, Ye = D + B + ot, un = q - Ye;
        if (Ye <= ce) {
          const F = v.value === C[C.length - 1];
          u.value.style.bottom = "0px";
          const W = d.value.clientHeight - h.value.offsetTop - h.value.offsetHeight, U = Math.max(rt, we + (F ? ie : 0) + W + N), Q = Ye + U;
          u.value.style.height = `${Q}px`;
        } else {
          const F = v.value === C[0];
          u.value.style.top = "0px";
          const U = Math.max(ce, D + h.value.offsetTop + (F ? Z : 0) + we) + un;
          u.value.style.height = `${U}px`, h.value.scrollTop = Ye - ce + h.value.offsetTop;
        }
        u.value.style.margin = `${Se}px 0`, u.value.style.minHeight = `${G}px`, u.value.style.maxHeight = `${I}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const w = k("");
    ne(async () => {
      await oe(), m(), d.value && (w.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(y) {
      y && l.value === !0 && (m(), g?.(), l.value = !1);
    }
    return wt(o.triggerElement, () => {
      m();
    }), Ku({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (y, b) => (x(), H("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: Re({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: w.value
      })
    }, [M(f(ee), K({
      ref: f(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...y.$attrs,
      ...t
    }), {
      default: T(() => [z(y.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Yu = Xu, Gu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Wr(n.context), Hr(Hu), (t, i) => z(t.$slots, "default");
  }
}), Ju = Gu;
const Zu = { key: 1 };
var Qu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    position: {
      type: String,
      required: !1
    },
    bodyLock: {
      type: Boolean,
      required: !1
    },
    side: {
      type: null,
      required: !1
    },
    sideOffset: {
      type: Number,
      required: !1
    },
    sideFlip: {
      type: Boolean,
      required: !1
    },
    align: {
      type: null,
      required: !1
    },
    alignOffset: {
      type: Number,
      required: !1
    },
    alignFlip: {
      type: Boolean,
      required: !1
    },
    avoidCollisions: {
      type: Boolean,
      required: !1
    },
    collisionBoundary: {
      type: null,
      required: !1
    },
    collisionPadding: {
      type: [Number, Object],
      required: !1
    },
    arrowPadding: {
      type: Number,
      required: !1
    },
    hideShiftedArrow: {
      type: Boolean,
      required: !1
    },
    sticky: {
      type: String,
      required: !1
    },
    hideWhenDetached: {
      type: Boolean,
      required: !1
    },
    positionStrategy: {
      type: String,
      required: !1
    },
    updatePositionStrategy: {
      type: String,
      required: !1
    },
    disableUpdateOnLayoutShift: {
      type: Boolean,
      required: !1
    },
    prioritizePosition: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    }
  },
  emits: [
    "closeAutoFocus",
    "escapeKeyDown",
    "pointerDownOutside"
  ],
  setup(n, { emit: e }) {
    const t = n, r = Ms(t, e), o = Xe(), s = k();
    ne(() => {
      s.value = new DocumentFragment();
    });
    const a = k(), l = A(() => t.forceMount || o.open.value), u = k(l.value);
    return te(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (x(), R(f(nt), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: T(() => [M(ju, qn(Fn({
        ...f(r),
        ...c.$attrs
      })), {
        default: T(() => [z(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : s.value ? (x(), H("div", Zu, [(x(), R(Zi, { to: s.value }, [M(Ju, { context: f(o) }, {
      default: T(() => [z(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : X("v-if", !0);
  }
}), ec = Qu, tc = /* @__PURE__ */ $({
  __name: "SelectIcon",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    return (e, t) => (x(), R(f(ee), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: T(() => [z(e.$slots, "default", {}, () => [t[0] || (t[0] = ue("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), nc = tc;
const [Vr, ic] = ge("SelectItem");
var rc = /* @__PURE__ */ $({
  __name: "SelectItem",
  props: {
    value: {
      type: null,
      required: !0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    textValue: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, i = e, { disabled: r } = Fe(t), o = Xe(), s = ln(), { forwardRef: a, currentElement: l } = Y(), { CollectionItem: u } = Ke(), c = A(() => xt(o.modelValue?.value, t.value, o.by)), d = k(!1), h = k(t.textValue ?? ""), v = _t(void 0, "reka-select-item-text"), p = "select.select";
    async function g(b) {
      if (b.defaultPrevented) return;
      const _ = {
        originalEvent: b,
        value: t.value
      };
      Gt(p, m, _);
    }
    async function m(b) {
      await oe(), i("select", b), !b.defaultPrevented && (r.value || (o.onValueChange(t.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function w(b) {
      await oe(), !b.defaultPrevented && (r.value ? s.onItemLeave?.() : b.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(b) {
      await oe(), !b.defaultPrevented && b.currentTarget === be() && s.onItemLeave?.();
    }
    async function y(b) {
      await oe(), !(b.defaultPrevented || s.searchRef?.value !== "" && b.key === " ") && (Du.includes(b.key) && g(b), b.key === " " && b.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return ne(() => {
      l.value && s.itemRefCallback(l.value, t.value, t.disabled);
    }), ic({
      value: t.value,
      disabled: r,
      textId: v,
      isSelected: c,
      onItemTextChange: (b) => {
        h.value = ((h.value || b?.textContent) ?? "").trim();
      }
    }), (b, _) => (x(), R(f(u), { value: { textValue: h.value } }, {
      default: T(() => [M(f(ee), {
        ref: f(a),
        role: "option",
        "aria-labelledby": f(v),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": f(r) || void 0,
        "data-disabled": f(r) ? "" : void 0,
        tabindex: f(r) ? void 0 : -1,
        as: b.as,
        "as-child": b.asChild,
        onFocus: _[0] || (_[0] = (E) => d.value = !0),
        onBlur: _[1] || (_[1] = (E) => d.value = !1),
        onPointerup: g,
        onPointerdown: _[2] || (_[2] = (E) => {
          E.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: _[3] || (_[3] = He(() => {
        }, ["prevent", "stop"])),
        onPointermove: w,
        onPointerleave: S,
        onKeydown: y
      }, {
        default: T(() => [z(b.$slots, "default")]),
        _: 3
      }, 8, [
        "aria-labelledby",
        "data-highlighted",
        "aria-selected",
        "data-state",
        "aria-disabled",
        "data-disabled",
        "tabindex",
        "as",
        "as-child"
      ])]),
      _: 3
    }, 8, ["value"]));
  }
}), oc = rc, sc = /* @__PURE__ */ $({
  __name: "SelectItemIndicator",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    const e = n, t = Vr();
    return (i, r) => f(t).isSelected.value ? (x(), R(f(ee), K({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: T(() => [z(i.$slots, "default")]),
      _: 3
    }, 16)) : X("v-if", !0);
  }
}), ac = sc, lc = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectItemText",
  props: {
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    const e = n, t = Xe(), i = ln(), r = Vr(), { forwardRef: o, currentElement: s } = Y(), a = A(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: s.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return ne(() => {
      s.value && (r.onItemTextChange(s.value), i.itemTextRefCallback(s.value, r.value, r.disabled.value), t.onOptionAdd(a.value));
    }), Ee(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (x(), R(f(ee), K({
      id: f(r).textId,
      ref: f(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: T(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), uc = lc, cc = /* @__PURE__ */ $({
  __name: "SelectPortal",
  props: {
    to: {
      type: null,
      required: !1
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    defer: {
      type: Boolean,
      required: !1
    },
    forceMount: {
      type: Boolean,
      required: !1
    }
  },
  setup(n) {
    const e = n;
    return (t, i) => (x(), R(f(Cr), qn(Fn(e)), {
      default: T(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), dc = cc, fc = /* @__PURE__ */ $({
  __name: "SelectTrigger",
  props: {
    disabled: {
      type: Boolean,
      required: !1
    },
    reference: {
      type: null,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "button"
    }
  },
  setup(n) {
    const e = n, t = Xe(), { forwardRef: i, currentElement: r } = Y(), o = A(() => t.disabled?.value || e.disabled);
    t.contentId ||= _t(void 0, "reka-select-content"), ne(() => {
      t.onTriggerChange(r.value);
    });
    const { getItems: s } = Ke(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = Un();
    function c() {
      o.value || (t.onOpenChange(!0), u());
    }
    function d(h) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(h.pageX),
        y: Math.round(h.pageY)
      };
    }
    return (h, v) => (x(), R(f($a), {
      "as-child": "",
      reference: h.reference
    }, {
      default: T(() => [M(f(ee), {
        ref: f(i),
        role: "combobox",
        type: h.as === "button" ? "button" : void 0,
        "aria-controls": f(t).contentId,
        "aria-expanded": f(t).open.value || !1,
        "aria-required": f(t).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: f(t)?.dir.value,
        "data-state": f(t)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": f(Mu)(f(t).modelValue?.value) ? "" : void 0,
        "as-child": h.asChild,
        as: h.as,
        onClick: v[0] || (v[0] = (p) => {
          p?.currentTarget?.focus();
        }),
        onPointerdown: v[1] || (v[1] = (p) => {
          if (p.pointerType === "touch") return p.preventDefault();
          const g = p.target;
          g.hasPointerCapture(p.pointerId) && g.releasePointerCapture(p.pointerId), p.button === 0 && p.ctrlKey === !1 && (d(p), p.preventDefault());
        }),
        onPointerup: v[2] || (v[2] = He((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: v[3] || (v[3] = (p) => {
          const g = f(a) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && g && p.key === " " || (f(l)(p.key, f(s)()), f(Iu).includes(p.key) && (c(), p.preventDefault()));
        })
      }, {
        default: T(() => [z(h.$slots, "default")]),
        _: 3
      }, 8, [
        "type",
        "aria-controls",
        "aria-expanded",
        "aria-required",
        "disabled",
        "dir",
        "data-state",
        "data-disabled",
        "data-placeholder",
        "as-child",
        "as"
      ])]),
      _: 3
    }, 8, ["reference"]));
  }
}), pc = fc, hc = /* @__PURE__ */ $({
  __name: "SelectValue",
  props: {
    placeholder: {
      type: String,
      required: !1,
      default: ""
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    const e = n, { forwardRef: t, currentElement: i } = Y(), r = Xe();
    ne(() => {
      r.valueElement = i;
    });
    const o = A(() => {
      let a = [];
      const l = Array.from(r.optionsSet.value), u = (c) => l.find((d) => xt(c, d.value, r.by));
      return Array.isArray(r.modelValue.value) ? a = r.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(r.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), s = A(() => o.value.length ? o.value.join(", ") : e.placeholder);
    return (a, l) => (x(), R(f(ee), {
      ref: f(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: T(() => [z(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: f(r).modelValue.value
      }, () => [ue(J(s.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), vc = hc, mc = /* @__PURE__ */ $({
  __name: "SelectViewport",
  props: {
    nonce: {
      type: String,
      required: !1
    },
    asChild: {
      type: Boolean,
      required: !1
    },
    as: {
      type: null,
      required: !1
    }
  },
  setup(n) {
    const e = n, { nonce: t } = Fe(e), i = qr(t), r = ln(), o = r.position === "item-aligned" ? Uu() : void 0, { forwardRef: s, currentElement: a } = Y();
    ne(() => {
      r?.onViewportChange(a.value);
    });
    const l = k(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: h, contentWrapper: v } = o ?? {};
      if (h?.value && v?.value) {
        const p = Math.abs(l.value - d.scrollTop);
        if (p > 0) {
          const g = window.innerHeight - Se * 2, m = Number.parseFloat(v.value.style.minHeight), w = Number.parseFloat(v.value.style.height), S = Math.max(m, w);
          if (S < g) {
            const y = S + p, b = Math.min(g, y), _ = y - b;
            v.value.style.height = `${b}px`, v.value.style.bottom === "0px" && (d.scrollTop = _ > 0 ? _ : 0, v.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (x(), H(he, null, [M(f(ee), K({
      ref: f(s),
      "data-reka-select-viewport": "",
      role: "presentation"
    }, {
      ...c.$attrs,
      ...e
    }, {
      style: {
        position: "relative",
        flex: 1,
        overflow: "hidden auto"
      },
      onScroll: u
    }), {
      default: T(() => [z(c.$slots, "default")]),
      _: 3
    }, 16), M(f(ee), {
      as: "style",
      nonce: f(i)
    }, {
      default: T(() => d[0] || (d[0] = [ue(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), gc = mc;
const bn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, yc = 70, bc = 1e3 / 60, wc = 350;
let qt = !1, $i = !1;
function Sc() {
  $i || typeof document > "u" || (document.addEventListener("mousedown", () => {
    qt = !0;
  }), document.addEventListener("mouseup", () => {
    qt = !1;
  }), document.addEventListener("click", () => {
    qt = !1;
  }), $i = !0);
}
const wn = /* @__PURE__ */ new Map();
function Sn(...n) {
  const e = {
    damping: bn.damping,
    stiffness: bn.stiffness,
    mass: bn.mass
  };
  let t = !1;
  for (const r of n) {
    if (r === "instant") {
      t = !0;
      continue;
    }
    typeof r != "object" || !r || (t = !1, e.damping = r.damping ?? e.damping, e.stiffness = r.stiffness ?? e.stiffness, e.mass = r.mass ?? e.mass);
  }
  const i = JSON.stringify(e);
  return wn.has(i) || wn.set(i, Object.freeze({ ...e })), t ? "instant" : wn.get(i);
}
function _c(n = {}) {
  Sc();
  let e = { ...n };
  const t = /* @__PURE__ */ new Set(), i = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function r() {
    const P = o();
    for (const D of t) D(P);
  }
  function o() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function s() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(P) {
    i.scrollElement && (i.scrollElement.scrollTop = P, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const P = i.scrollElement, D = i.contentElement;
    return !P || !D ? 0 : P.scrollHeight - 1 - P.clientHeight;
  }
  let u;
  function c() {
    const P = i.scrollElement, D = i.contentElement;
    if (!P || !D)
      return 0;
    const B = l();
    if (!e.targetScrollTop)
      return B;
    if (u?.targetScrollTop === B)
      return u.calculatedScrollTop;
    const N = Math.max(
      Math.min(
        e.targetScrollTop(B, {
          scrollElement: P,
          contentElement: D
        }),
        B
      ),
      0
    );
    return u = { targetScrollTop: B, calculatedScrollTop: N }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), N;
  }
  function d() {
    return c() - s();
  }
  function h() {
    return d() <= yc;
  }
  function v(P) {
    i.isAtBottom = P, r();
  }
  function p(P) {
    i.escapedFromLock = P, r();
  }
  function g(P) {
    i.isNearBottom = P, r();
  }
  function m() {
    if (!qt || typeof window > "u")
      return !1;
    const P = window.getSelection?.();
    if (!P || !P.rangeCount)
      return !1;
    const D = P.getRangeAt(0), B = i.scrollElement;
    if (!B)
      return !1;
    const N = D.commonAncestorContainer;
    return !!(N && (B.contains(N) || N.contains(B)));
  }
  const w = (P) => {
    if (P.target !== i.scrollElement)
      return;
    const D = s(), B = i.ignoreScrollToTop;
    let N = i.lastScrollTop ?? D;
    i.lastScrollTop = D, i.ignoreScrollToTop = void 0, B && B > D && (N = B), g(h()), setTimeout(() => {
      if (i.resizeDifference || D === B)
        return;
      if (m()) {
        p(!0), v(!1);
        return;
      }
      const L = D > N, q = D < N;
      if (i.animation?.ignoreEscapes) {
        a(N);
        return;
      }
      q && (p(!0), v(!1)), L && p(!1), !i.escapedFromLock && h() && v(!0);
    }, 1);
  }, S = (P) => {
    const D = i.scrollElement;
    if (!D)
      return;
    let B = P.target;
    for (; B && !["scroll", "auto"].includes(getComputedStyle(B).overflow); ) {
      if (!B.parentElement)
        return;
      B = B.parentElement;
    }
    B === D && P.deltaY < 0 && D.scrollHeight > D.clientHeight && !i.animation?.ignoreEscapes && (p(!0), v(!1));
  };
  function y(P, D) {
    b(), i.scrollElement = P, i.contentElement = D, getComputedStyle(P).overflow === "visible" && (P.style.overflow = "auto"), P.addEventListener("scroll", w, { passive: !0 }), P.addEventListener("wheel", S, { passive: !0 });
    let B;
    i.resizeObserver = new ResizeObserver((N) => {
      const L = N[0];
      if (!L)
        return;
      const { height: q } = L.contentRect, G = q - (B ?? q);
      if (i.resizeDifference = G, s() > l() && a(l()), g(h()), G >= 0) {
        const j = Sn(
          e,
          B ? e.resize : e.initial
        );
        C({
          animation: j,
          wait: !0,
          preserveScrollPosition: !0,
          duration: j === "instant" ? void 0 : wc
        });
      } else
        h() && (p(!1), v(!0));
      B = q, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === G && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(D);
  }
  function b() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", w), i.scrollElement.removeEventListener("wheel", S)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function _() {
    b(), t.clear();
  }
  function E(P) {
    e = { ...e, ...P };
  }
  function C(P = {}) {
    const D = typeof P == "string" ? { animation: P } : P;
    D.preserveScrollPosition || v(!0);
    const B = Date.now() + (Number(D.wait) || 0), N = Sn(e, D.animation), { ignoreEscapes: L = !1 } = D;
    let q, G = c();
    D.duration instanceof Promise ? D.duration.finally(() => {
      q = Date.now();
    }) : q = B + (D.duration ?? 0);
    const j = async () => {
      const Z = new Promise((ie) => {
        if (typeof requestAnimationFrame > "u") {
          ie(!1);
          return;
        }
        requestAnimationFrame(() => ie(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const ie = s(), ce = typeof performance < "u" ? performance.now() : Date.now(), rt = (ce - (i.lastTick ?? ce)) / bc;
        if (i.animation ||= { behavior: N, promise: Z, ignoreEscapes: L }, i.animation.behavior === N && (i.lastTick = ce), m() || B > Date.now())
          return j();
        if (ie < Math.min(G, c())) {
          if (i.animation?.behavior === N) {
            if (N === "instant")
              return a(c()), j();
            const we = N;
            i.velocity = (we.damping * i.velocity + we.stiffness * d()) / we.mass, i.accumulated += i.velocity * rt;
            const ot = s();
            a(ot + i.accumulated), s() !== ot && (i.accumulated = 0);
          }
          return j();
        }
        return q > Date.now() ? (G = c(), j()) : (i.animation = void 0, s() < c() ? C({
          animation: Sn(e, e.resize),
          ignoreEscapes: L,
          duration: Math.max(0, q - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return Z.then((ie) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ie));
    };
    return D.wait !== !0 && (i.animation = void 0), i.animation?.behavior === N ? i.animation.promise : j();
  }
  const I = () => {
    p(!0), v(!1);
  };
  function O(P) {
    return t.add(P), () => t.delete(P);
  }
  return {
    attach: y,
    detach: b,
    destroy: _,
    setOptions: E,
    getState: o,
    onChange: O,
    scrollToBottom: C,
    stopScroll: I
  };
}
function Cc(n = {}) {
  const e = k(null), t = k(null), i = k(n.initial !== !1), r = k(!1), o = k(!1), s = _c(n);
  let a = null;
  return ae((l) => {
    !e.value || !t.value || (s.attach(e.value, t.value), a = s.onChange((u) => {
      i.value = u.isAtBottom, r.value = u.isNearBottom, o.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, s.detach();
    }));
  }), kt(() => {
    s.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: i,
    isNearBottom: r,
    escapedFromLock: o,
    scrollToBottom: (l) => s.scrollToBottom(l),
    stopScroll: () => s.stopScroll(),
    setOptions: (l) => s.setOptions(l)
  };
}
const Ec = /* @__PURE__ */ $({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (x(), H("span", {
      class: "speaker-indicator",
      style: Re({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), jr = /* @__PURE__ */ fe(Ec, [["__scopeId", "data-v-9bffeda8"]]), xc = { class: "speaker-label" }, Tc = {
  key: 1,
  class: "speaker-name"
}, kc = ["datetime"], Pc = /* @__PURE__ */ $({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = Ie(), r = A(
      () => zn(e.language, i.value, t("language.wildcard"))
    ), o = A(
      () => e.startTime != null ? Ht(e.startTime) : null
    ), s = A(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = A(() => e.speaker?.color ?? "transparent");
    return (l, u) => (x(), H("div", xc, [
      n.speaker ? (x(), R(jr, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : X("", !0),
      n.speaker ? (x(), H("span", Tc, J(n.speaker.name), 1)) : X("", !0),
      o.value ? (x(), H("time", {
        key: 2,
        class: "timestamp",
        datetime: s.value
      }, J(o.value), 9, kc)) : X("", !0),
      M(Tn, null, {
        default: T(() => [
          ue(J(r.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Ac = /* @__PURE__ */ fe(Pc, [["__scopeId", "data-v-0fb7fa1e"]]), Oc = ["data-turn-active"], Lc = { class: "turn-text" }, Rc = ["data-word-active"], Ic = /* @__PURE__ */ $({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = tt(), i = A(() => e.turn.words.length > 0), r = A(() => {
      if (!t.audio?.src.value || !i.value) return null;
      const a = t.audio.currentTime.value, { startTime: l, endTime: u, words: c } = e.turn;
      return l == null || u == null || a < l || a > u ? null : Mo(c, a);
    }), o = A(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || tr(e.turn.words)) return !1;
      const a = t.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), s = A(() => e.speaker?.color ?? "transparent");
    return (a, l) => (x(), H("section", {
      class: Wt(["turn", { "turn--active": o.value, "turn--partial": n.partial }]),
      "data-turn-active": o.value || n.partial || n.live || void 0,
      style: Re({ "--speaker-color": s.value })
    }, [
      n.partial ? X("", !0) : (x(), R(Ac, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      V("p", Lc, [
        i.value ? (x(!0), H(he, { key: 0 }, et(n.turn.words, (u, c) => (x(), H(he, {
          key: u.id
        }, [
          V("span", {
            class: Wt({ "word--active": u.id === r.value }),
            "data-word-active": u.id === r.value || void 0
          }, J(u.text), 11, Rc),
          ue(J(c < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (x(), H(he, { key: 1 }, [
          ue(J(n.turn.text), 1)
        ], 64)) : X("", !0)
      ])
    ], 14, Oc));
  }
}), Bi = /* @__PURE__ */ fe(Ic, [["__scopeId", "data-v-bf56e6fe"]]), Dc = {
  ref: "panel",
  class: "transcription-panel"
}, Mc = { class: "turns-container" }, $c = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Bc = {
  key: 1,
  class: "history-start"
}, qc = /* @__PURE__ */ $({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = Ie(), i = tt(), r = bt("panel"), o = A(() => {
      const y = i.live?.partial.value ?? null;
      return y === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: y,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), s = A(() => i.live?.hasLiveUpdate.value ?? !1), a = A(() => i.audio?.isPlaying.value ?? !1), l = A(() => i.activeChannel.value.activeTranslation.value), u = A(() => i.activeChannel.value), c = A(() => u.value.isLoadingHistory.value), d = A(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: v, isAtBottom: p, scrollToBottom: g } = Cc();
    ne(() => {
      h.value = r.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, v.value = r.value?.querySelector(".turns-container") ?? null;
    });
    let m = null;
    const w = Ro(() => {
      const y = u.value;
      y.hasMoreHistory.value && (y.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function S() {
      m && m.scrollTop < 100 && w();
    }
    return ne(() => {
      m = r.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, m && m.addEventListener("scroll", S, { passive: !0 });
    }), kt(() => {
      m && (m.removeEventListener("scroll", S), m = null);
    }), (y, b) => (x(), H("article", Dc, [
      M(f(uu), { class: "scroll-root" }, {
        default: T(() => [
          M(f(Ru), { class: "scroll-viewport" }, {
            default: T(() => [
              V("div", Mc, [
                c.value ? (x(), H("div", $c, [...b[1] || (b[1] = [
                  V("progress", null, null, -1)
                ])])) : X("", !0),
                !d.value && n.turns.length > 0 ? (x(), H("div", Bc, J(f(t)("transcription.historyStart")), 1)) : X("", !0),
                (x(!0), H(he, null, et(n.turns, (_, E) => (x(), R(Bi, {
                  key: _.id,
                  turn: _,
                  speaker: _.speakerId ? n.speakers.get(_.speakerId) : void 0,
                  live: s.value && !o.value && E === n.turns.length - 1
                }, null, 8, ["turn", "speaker", "live"]))), 128)),
                o.value ? (x(), R(Bi, {
                  key: "__partial__",
                  turn: o.value,
                  partial: ""
                }, null, 8, ["turn"])) : X("", !0)
              ])
            ]),
            _: 1
          }),
          M(f(xu), {
            class: "scrollbar",
            orientation: "vertical"
          }, {
            default: T(() => [
              M(f(Ou), { class: "scrollbar-thumb" })
            ]),
            _: 1
          }),
          M(ho, { name: "fade-slide" }, {
            default: T(() => [
              !f(p) && (a.value || s.value) ? (x(), R(ke, {
                key: 0,
                size: "sm",
                class: "resume-scroll-btn",
                "aria-label": f(t)("transcription.resumeScroll"),
                onClick: b[0] || (b[0] = (_) => f(g)())
              }, {
                icon: T(() => [
                  M(f(No), { size: 14 })
                ]),
                default: T(() => [
                  ue(" " + J(f(t)("transcription.resumeScroll")), 1)
                ]),
                _: 1
              }, 8, ["aria-label"])) : X("", !0)
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 512));
  }
}), Fc = /* @__PURE__ */ fe(qc, [["__scopeId", "data-v-807738b2"]]), zc = { class: "switch" }, Nc = ["id", "checked"], Wc = ["for"], Hc = /* @__PURE__ */ $({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, r = t.id ?? vo();
    return (o, s) => (x(), H("div", zc, [
      V("input", {
        type: "checkbox",
        id: f(r),
        checked: n.modelValue,
        onChange: s[0] || (s[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Nc),
      V("label", { for: f(r) }, [...s[1] || (s[1] = [
        V("div", { class: "switch-slider" }, null, -1)
      ])], 8, Wc)
    ]));
  }
}), Vc = /* @__PURE__ */ fe(Hc, [["__scopeId", "data-v-2aa0332f"]]), jc = "(max-width: 767px)";
function Ur() {
  const n = k(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return ne(() => {
    e = window.matchMedia(jc), n.value = e.matches, e.addEventListener("change", t);
  }), kt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const Uc = { class: "sidebar-select" }, Kc = /* @__PURE__ */ $({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e;
    return (i, r) => (x(), H("div", Uc, [
      M(f(qu), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (o) => t("update:selectedValue", o))
      }, {
        default: T(() => [
          M(f(pc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: T(() => [
              M(f(vc), { class: "sidebar-select-trigger-label" }),
              M(f(nc), null, {
                default: T(() => [
                  M(f(Wo), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          M(f(dc), { disabled: "" }, {
            default: T(() => [
              M(f(ec), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: T(() => [
                  M(f(gc), null, {
                    default: T(() => [
                      (x(!0), H(he, null, et(n.items, (o) => (x(), R(f(oc), {
                        key: o.value,
                        value: o.value,
                        class: "sidebar-select-item"
                      }, {
                        default: T(() => [
                          M(f(ac), { class: "sidebar-select-item-indicator" }, {
                            default: T(() => [
                              M(f(ir), { size: 14 })
                            ]),
                            _: 1
                          }),
                          M(f(uc), null, {
                            default: T(() => [
                              ue(J(o.label), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["value"]))), 128))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["model-value"])
    ]));
  }
}), Xc = { class: "sidebar-select" }, Yc = ["aria-label"], Gc = { class: "sidebar-select-trigger-label" }, Jc = 7, Zc = /* @__PURE__ */ $({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: r } = Ie(), o = k(!1), s = A(
      () => t.items.find((l) => l.value === t.selectedValue)?.label ?? ""
    );
    function a(l) {
      i("update:selectedValue", l), o.value = !1;
    }
    return (l, u) => (x(), H("div", Xc, [
      V("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: u[0] || (u[0] = (c) => o.value = !0)
      }, [
        V("span", Gc, J(s.value), 1)
      ], 8, Yc),
      M(f(vr), {
        open: o.value,
        "onUpdate:open": u[2] || (u[2] = (c) => o.value = c)
      }, {
        default: T(() => [
          M(f(Er), { disabled: "" }, {
            default: T(() => [
              M(f(_r), { class: "editor-overlay" }),
              M(f(Sr), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: T(() => [
                  M(f(xr), { class: "sr-only" }, {
                    default: T(() => [
                      ue(J(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  u[3] || (u[3] = V("div", { class: "sheet-handle" }, null, -1)),
                  M(f(Yl), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": u[1] || (u[1] = (c) => a(c))
                  }, {
                    default: T(() => [
                      n.items.length > Jc ? (x(), R(f(Ql), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: f(r)("select.filter")
                      }, null, 8, ["placeholder"])) : X("", !0),
                      M(f(Jl), { class: "sheet-list" }, {
                        default: T(() => [
                          (x(!0), H(he, null, et(n.items, (c) => (x(), R(f(ru), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: T(() => [
                              M(f(su), { class: "sheet-item-indicator" }, {
                                default: T(() => [
                                  M(f(ir), { size: 16 })
                                ]),
                                _: 1
                              }),
                              V("span", null, J(c.label), 1)
                            ]),
                            _: 2
                          }, 1032, ["value"]))), 128))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }, 8, ["model-value"])
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["open"])
    ]));
  }
}), ii = /* @__PURE__ */ $({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Ur();
    return (r, o) => f(i) ? (x(), R(Zc, K({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (s) => t("update:selectedValue", s))
    }), null, 16)) : (x(), R(Kc, K({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (s) => t("update:selectedValue", s))
    }), null, 16));
  }
}), Kr = /* @__PURE__ */ $({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: r } = Ie(), o = A(
      () => t.channels.map((s) => ({ value: s.id, label: s.name }))
    );
    return (s, a) => (x(), R(ii, {
      items: o.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: f(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Qc = { class: "speaker-sidebar" }, ed = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, td = { class: "sidebar-title" }, nd = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, id = { class: "sidebar-title" }, rd = {
  key: 2,
  class: "sidebar-section"
}, od = { class: "sidebar-title" }, sd = { class: "subtitle-toggle" }, ad = { class: "subtitle-toggle-label" }, ld = { class: "subtitle-slider" }, ud = { class: "subtitle-slider-label" }, cd = { class: "subtitle-slider-value" }, dd = ["value", "disabled"], fd = {
  key: 3,
  class: "sidebar-section"
}, pd = { class: "sidebar-title" }, hd = { class: "speaker-list" }, vd = { class: "speaker-name" }, md = /* @__PURE__ */ $({
  __name: "SpeakerSidebar",
  props: {
    speakers: {},
    channels: {},
    selectedChannelId: {},
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedChannelId", "update:selectedTranslationId"],
  setup(n) {
    const e = n, t = tt(), { t: i, locale: r } = Ie(), o = A(
      () => er(e.translations, r.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (s, a) => (x(), H("aside", Qc, [
      n.channels.length > 1 ? (x(), H("section", ed, [
        V("h2", td, J(f(i)("sidebar.channel")), 1),
        M(Kr, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => s.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : X("", !0),
      n.translations.length > 1 ? (x(), H("section", nd, [
        V("h2", id, J(f(i)("sidebar.translation")), 1),
        M(ii, {
          items: o.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: f(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => s.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : X("", !0),
      f(t).subtitle ? (x(), H("section", rd, [
        V("h2", od, J(f(i)("sidebar.subtitle")), 1),
        V("div", sd, [
          V("span", ad, J(f(i)("subtitle.show")), 1),
          M(Vc, {
            modelValue: f(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => f(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        V("label", ld, [
          V("span", ud, [
            ue(J(f(i)("subtitle.fontSize")) + " ", 1),
            V("span", cd, J(f(t).subtitle.fontSize.value) + "px", 1)
          ]),
          V("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: f(t).subtitle.fontSize.value,
            disabled: !f(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => f(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, dd)
        ])
      ])) : X("", !0),
      n.speakers.length ? (x(), H("section", fd, [
        V("h2", pd, J(f(i)("sidebar.speakers")), 1),
        V("ul", hd, [
          (x(!0), H(he, null, et(n.speakers, (l) => (x(), H("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            M(jr, {
              color: l.color
            }, null, 8, ["color"]),
            V("span", vd, J(l.name), 1)
          ]))), 128))
        ])
      ])) : X("", !0)
    ]));
  }
}), qi = /* @__PURE__ */ fe(md, [["__scopeId", "data-v-0a4624c1"]]), gd = /* @__PURE__ */ $({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = mo(n, "open"), { t } = Ie();
    return (i, r) => (x(), R(f(vr), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (o) => e.value = o)
    }, {
      default: T(() => [
        M(f(Er), { disabled: "" }, {
          default: T(() => [
            M(f(_r), { class: "editor-overlay" }),
            M(f(Sr), { class: "sidebar-drawer" }, {
              default: T(() => [
                M(f(xr), { class: "sr-only" }, {
                  default: T(() => [
                    ue(J(f(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                M(f(Gs), {
                  class: "sidebar-close",
                  "aria-label": f(t)("header.closeSidebar")
                }, {
                  default: T(() => [
                    M(f(rr), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                z(i.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open"]));
  }
}), yd = { class: "player-controls" }, bd = { class: "controls-left" }, wd = { class: "controls-time" }, Sd = { class: "time-display" }, _d = { class: "time-display" }, Cd = { class: "controls-right" }, Ed = ["value", "aria-label", "disabled"], xd = /* @__PURE__ */ $({
  __name: "AudioPlayerControls",
  props: {
    isPlaying: { type: Boolean },
    currentTime: {},
    duration: {},
    volume: {},
    playbackRate: {},
    isMuted: { type: Boolean },
    isReady: { type: Boolean }
  },
  emits: ["togglePlay", "skipBack", "skipForward", "update:volume", "toggleMute", "cyclePlaybackRate"],
  setup(n, { emit: e }) {
    const t = e, { t: i } = Ie(), r = k(!1);
    function o(s) {
      const a = s.target;
      t("update:volume", parseFloat(a.value));
    }
    return (s, a) => (x(), H("div", yd, [
      V("div", bd, [
        M(ke, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": f(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: T(() => [
            M(f(Uo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        M(ke, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? f(i)("player.pause") : f(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: T(() => [
            n.isPlaying ? (x(), R(f(Ho), {
              key: 0,
              size: 20
            })) : (x(), R(f(Vo), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        M(ke, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": f(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: T(() => [
            M(f(Ko), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      V("div", wd, [
        V("time", Sd, J(n.currentTime), 1),
        a[7] || (a[7] = V("span", { class: "time-separator" }, "/", -1)),
        V("time", _d, J(n.duration), 1)
      ]),
      V("div", Cd, [
        V("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          M(ke, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? f(i)("player.unmute") : f(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: T(() => [
              n.isMuted ? (x(), R(f(Go), {
                key: 0,
                size: 16
              })) : (x(), R(f(Yo), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          go(V("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": f(i)("player.volume"),
            disabled: !n.isReady,
            onInput: o
          }, null, 40, Ed), [
            [yo, r.value]
          ])
        ], 32),
        M(ke, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": f(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: T(() => [
            ue(J(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Td = /* @__PURE__ */ fe(xd, [["__scopeId", "data-v-02ebaa64"]]);
function le(n, e, t, i) {
  return new (t || (t = Promise))((function(r, o) {
    function s(u) {
      try {
        l(i.next(u));
      } catch (c) {
        o(c);
      }
    }
    function a(u) {
      try {
        l(i.throw(u));
      } catch (c) {
        o(c);
      }
    }
    function l(u) {
      var c;
      u.done ? r(u.value) : (c = u.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(s, a);
    }
    l((i = i.apply(n, e || [])).next());
  }));
}
let Ot = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...o) => {
        this.un(e, r), t(...o);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var i;
    (i = this.listeners[e]) === null || i === void 0 || i.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((i) => i(...t)));
  }
};
const $t = { decode: function(n, e) {
  return le(this, void 0, void 0, (function* () {
    const t = new AudioContext({ sampleRate: e });
    try {
      return yield t.decodeAudioData(n);
    } finally {
      t.close();
    }
  }));
}, createBuffer: function(n, e) {
  if (!n || n.length === 0) throw new Error("channelData must be a non-empty array");
  if (e <= 0) throw new Error("duration must be greater than 0");
  if (typeof n[0] == "number" && (n = [n]), !n[0] || n[0].length === 0) throw new Error("channelData must contain non-empty channel arrays");
  (function(i) {
    const r = i[0];
    if (r.some(((o) => o > 1 || o < -1))) {
      const o = r.length;
      let s = 0;
      for (let a = 0; a < o; a++) {
        const l = Math.abs(r[a]);
        l > s && (s = l);
      }
      for (const a of i) for (let l = 0; l < o; l++) a[l] /= s;
    }
  })(n);
  const t = n.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (i) => {
    const r = t[i];
    if (!r) throw new Error(`Channel ${i} not found`);
    return r;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Xr(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [o, s] of Object.entries(r)) s instanceof Node ? t.appendChild(s) : typeof s == "string" ? t.appendChild(document.createTextNode(s)) : t.appendChild(Xr(o, s));
  else i === "style" ? Object.assign(t.style, r) : i === "textContent" ? t.textContent = r : t.setAttribute(i, r.toString());
  return t;
}
function Fi(n, e, t) {
  const i = Xr(n, e || {});
  return t?.appendChild(i), i;
}
var kd = Object.freeze({ __proto__: null, createElement: Fi, default: Fi });
const Pd = { fetchBlob: function(n, e, t) {
  return le(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(r, o) {
      le(this, void 0, void 0, (function* () {
        if (!r.body || !r.headers) return;
        const s = r.body.getReader(), a = Number(r.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          o(d);
        };
        try {
          for (; ; ) {
            const c = yield s.read();
            if (c.done) break;
            u(c.value);
          }
        } catch (c) {
          console.warn("Progress tracking error:", c);
        }
      }));
    })(i.clone(), e), i.blob();
  }));
} };
function re(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Je(n, e) {
  const t = re(n());
  return e.forEach(((i) => i.subscribe((() => {
    const r = n();
    Object.is(t.value, r) || t.set(r);
  })))), { get value() {
    return t.value;
  }, subscribe: (i) => t.subscribe(i) };
}
function We(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, r = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), r.forEach(((o) => o()));
  };
}
class Ad extends Ot {
  get isPlayingSignal() {
    return this._isPlaying;
  }
  get currentTimeSignal() {
    return this._currentTime;
  }
  get durationSignal() {
    return this._duration;
  }
  get volumeSignal() {
    return this._volume;
  }
  get mutedSignal() {
    return this._muted;
  }
  get playbackRateSignal() {
    return this._playbackRate;
  }
  get seekingSignal() {
    return this._seeking;
  }
  constructor(e) {
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = re(!1), this._currentTime = re(0), this._duration = re(0), this._volume = re(this.media.volume), this._muted = re(this.media.muted), this._playbackRate = re(this.media.playbackRate || 1), this._seeking = re(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
      e.playbackRate != null && (this.media.playbackRate = e.playbackRate);
    }), { once: !0 });
  }
  setupReactiveMediaEvents() {
    this.reactiveMediaEventCleanups.push(this.onMediaEvent("play", (() => {
      this._isPlaying.set(!0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("pause", (() => {
      this._isPlaying.set(!1);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ended", (() => {
      this._isPlaying.set(!1);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("timeupdate", (() => {
      this._currentTime.set(this.media.currentTime);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("durationchange", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("loadedmetadata", (() => {
      this._duration.set(this.media.duration || 0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeking", (() => {
      this._seeking.set(!0);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("seeked", (() => {
      this._seeking.set(!1);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("volumechange", (() => {
      this._volume.set(this.media.volume), this._muted.set(this.media.muted);
    }))), this.reactiveMediaEventCleanups.push(this.onMediaEvent("ratechange", (() => {
      this._playbackRate.set(this.media.playbackRate);
    })));
  }
  onMediaEvent(e, t, i) {
    return this.media.addEventListener(e, t, i), () => this.media.removeEventListener(e, t, i);
  }
  getSrc() {
    return this.media.currentSrc || this.media.src || "";
  }
  revokeSrc() {
    const e = this.getSrc();
    e.startsWith("blob:") && URL.revokeObjectURL(e);
  }
  canPlayType(e) {
    return this.media.canPlayType(e) !== "";
  }
  setSrc(e, t) {
    const i = this.getSrc();
    if (e && i === e) return;
    this.revokeSrc();
    const r = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (i && this.media.removeAttribute("src"), r || e) try {
      this.media.src = r;
    } catch {
      this.media.src = e;
    }
  }
  destroy() {
    this.reactiveMediaEventCleanups.forEach(((e) => e())), this.reactiveMediaEventCleanups = [], this.isExternalMedia || (this.media.pause(), this.revokeSrc(), this.media.removeAttribute("src"), this.media.load(), this.media.remove());
  }
  setMediaElement(e) {
    this.reactiveMediaEventCleanups.forEach(((t) => t())), this.reactiveMediaEventCleanups = [], this.media = e, this.setupReactiveMediaEvents();
  }
  play() {
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.media.play();
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        throw e;
      }
    }));
  }
  pause() {
    this.media.pause();
  }
  isPlaying() {
    return !this.media.paused && !this.media.ended;
  }
  setTime(e) {
    this.media.currentTime = Math.max(0, Math.min(e, this.getDuration()));
  }
  getDuration() {
    return this.media.duration;
  }
  getCurrentTime() {
    return this.media.currentTime;
  }
  getVolume() {
    return this.media.volume;
  }
  setVolume(e) {
    this.media.volume = e;
  }
  getMuted() {
    return this.media.muted;
  }
  setMuted(e) {
    this.media.muted = e;
  }
  getPlaybackRate() {
    return this.media.playbackRate;
  }
  isSeeking() {
    return this.media.seeking;
  }
  setPlaybackRate(e, t) {
    t != null && (this.media.preservesPitch = t), this.media.playbackRate = e;
  }
  getMediaElement() {
    return this.media;
  }
  setSinkId(e) {
    return this.media.setSinkId(e);
  }
}
function Od({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: r = 0, barAlign: o }) {
  let s = Math.round(n * t * i), a = s + Math.round(e * t * i) || 1;
  return a < r && (a = r, o || (s = a / 2)), { topHeight: s, totalHeight: a };
}
function Ld({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: r }) {
  return n === "top" ? 0 : n === "bottom" ? r - i : e - t;
}
function zi(n, e, t) {
  const i = e - n.left, r = t - n.top;
  return [i / n.width, r / n.height];
}
function Yr(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Ni(n, e) {
  if (!Yr(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Wi({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, r = Math.floor(i * t);
  return [r - 1, r, r + 1];
}
function Gr(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Rd(n) {
  const e = re({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Je((() => (function(o) {
    const { scrollLeft: s, scrollWidth: a, clientWidth: l } = o;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = s / a, c = (s + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Je((() => (function(o) {
    return { left: o.scrollLeft, right: o.scrollLeft + o.clientWidth };
  })(e.value)), [e]), r = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", r, { passive: !0 }), { scrollData: e, percentages: t, bounds: i, cleanup: () => {
    n.removeEventListener("scroll", r), Gr(e);
  } };
}
class Id extends Ot {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [r, o] = this.initHtml();
    i.appendChild(r), this.container = r, this.scrollContainer = o.querySelector(".scroll"), this.wrapper = o.querySelector(".wrapper"), this.canvasWrapper = o.querySelector(".canvases"), this.progressWrapper = o.querySelector(".progress"), this.cursor = o.querySelector(".cursor"), t && o.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [r, o] = zi(i, t.clientX, t.clientY);
      this.emit("click", r, o);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [r, o] = zi(i, t.clientX, t.clientY);
      this.emit("dblclick", r, o);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Rd(this.scrollContainer);
    const e = We((() => {
      const { startX: t, endX: i } = this.scrollStream.percentages.value, { left: r, right: o } = this.scrollStream.bounds.value;
      this.emit("scroll", t, i, r, o);
    }), [this.scrollStream.percentages, this.scrollStream.bounds]);
    if (this.subscriptions.push(e), typeof ResizeObserver == "function") {
      const t = this.createDelay(100);
      this.resizeObserver = new ResizeObserver((() => {
        t().then((() => this.onContainerResize())).catch((() => {
        }));
      })), this.resizeObserver.observe(this.scrollContainer);
    }
  }
  onContainerResize() {
    const e = this.parent.clientWidth;
    e === this.lastContainerWidth && this.options.height !== "auto" || (this.lastContainerWidth = e, this.reRender(), this.emit("resize"));
  }
  initDrag() {
    if (this.dragStream) return;
    this.dragStream = (function(t, i = {}) {
      const { threshold: r = 3, mouseButton: o = 0, touchDelay: s = 100 } = i, a = re(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== o || (l.set(h.pointerId, h), l.size > 1)) return;
        let v = h.clientX, p = h.clientY, g = !1;
        const m = Date.now(), w = t.getBoundingClientRect(), { left: S, top: y } = w, b = (O) => {
          if (O.defaultPrevented || l.size > 1 || u && Date.now() - m < s) return;
          const P = O.clientX, D = O.clientY, B = P - v, N = D - p;
          (g || Math.abs(B) > r || Math.abs(N) > r) && (O.preventDefault(), O.stopPropagation(), g || (a.set({ type: "start", x: v - S, y: p - y }), g = !0), a.set({ type: "move", x: P - S, y: D - y, deltaX: B, deltaY: N }), v = P, p = D);
        }, _ = (O) => {
          if (l.delete(O.pointerId), g) {
            const P = O.clientX, D = O.clientY;
            a.set({ type: "end", x: P - S, y: D - y });
          }
          c();
        }, E = (O) => {
          l.delete(O.pointerId), O.relatedTarget && O.relatedTarget !== document.documentElement || _(O);
        }, C = (O) => {
          g && (O.stopPropagation(), O.preventDefault());
        }, I = (O) => {
          O.defaultPrevented || l.size > 1 || g && O.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", _), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", I, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", I), setTimeout((() => {
            document.removeEventListener("click", C, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), Gr(a);
      } };
    })(this.wrapper);
    const e = We((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const i = this.wrapper.getBoundingClientRect().width, r = (o = t.x / i) < 0 ? 0 : o > 1 ? 1 : o;
      var o;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", r)) : t.type === "move" ? this.emit("drag", r) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", r));
    }), [this.dragStream.signal]);
    this.subscriptions.push(e);
  }
  initHtml() {
    const e = document.createElement("div"), t = e.attachShadow({ mode: "open" }), i = this.options.cspNonce && typeof this.options.cspNonce == "string" ? this.options.cspNonce.replace(/"/g, "") : "";
    return t.innerHTML = `
      <style${i ? ` nonce="${i}"` : ""}>
        :host {
          user-select: none;
          min-width: 1px;
        }
        :host audio {
          display: block;
          width: 100%;
        }
        :host .scroll {
          overflow-x: auto;
          overflow-y: hidden;
          width: 100%;
          position: relative;
        }
        :host .noScrollbar {
          scrollbar-color: transparent;
          scrollbar-width: none;
        }
        :host .noScrollbar::-webkit-scrollbar {
          display: none;
          -webkit-appearance: none;
        }
        :host .wrapper {
          position: relative;
          overflow: visible;
          z-index: 2;
        }
        :host .canvases {
          min-height: ${this.getHeight(this.options.height, this.options.splitChannels)}px;
          pointer-events: none;
        }
        :host .canvases > div {
          position: relative;
        }
        :host canvas {
          display: block;
          position: absolute;
          top: 0;
          image-rendering: pixelated;
        }
        :host .progress {
          pointer-events: none;
          position: absolute;
          z-index: 2;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          overflow: hidden;
        }
        :host .progress > div {
          position: relative;
        }
        :host .cursor {
          pointer-events: none;
          position: absolute;
          z-index: 5;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: 2px;
        }
      </style>

      <div class="scroll" part="scroll">
        <div class="wrapper" part="wrapper">
          <div class="canvases" part="canvases"></div>
          <div class="progress" part="progress"></div>
          <div class="cursor" part="cursor"></div>
        </div>
      </div>
    `, [e, t];
  }
  setOptions(e) {
    if (this.options.container !== e.container) {
      const t = this.parentFromOptionsContainer(e.container);
      t.appendChild(this.container), this.parent = t;
    }
    e.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.options = e, this.reRender();
  }
  getWrapper() {
    return this.wrapper;
  }
  getWidth() {
    return this.scrollContainer.clientWidth;
  }
  getScroll() {
    return this.scrollContainer.scrollLeft;
  }
  setScroll(e) {
    this.scrollContainer.scrollLeft = e;
  }
  setScrollPercentage(e) {
    const { scrollWidth: t } = this.scrollContainer, i = t * e;
    this.setScroll(i);
  }
  destroy() {
    var e;
    this.subscriptions.forEach(((t) => t())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), (e = this.unsubscribeOnScroll) === null || e === void 0 || e.forEach(((t) => t())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(e = 10) {
    let t, i;
    const r = () => {
      t && (clearTimeout(t), t = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(r), () => new Promise(((o, s) => {
      r(), i = s, t = setTimeout((() => {
        t = void 0, i = void 0, o();
      }), e);
    }));
  }
  getHeight(e, t) {
    var i;
    const r = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: o, optionsSplitChannels: s, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (o == null) return u;
      const c = Number(o);
      if (!isNaN(c)) return c;
      if (o === "auto") {
        const d = a || u;
        return s?.every(((h) => !h.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: r, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(i, r, o) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const s = document.createElement("canvas"), a = s.getContext("2d"), l = o ?? s.height * r, u = a.createLinearGradient(0, 0, 0, l || r), c = 1 / (i.length - 1);
      return i.forEach(((d, h) => {
        u.addColorStop(h * c, d);
      })), u;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, i, r) {
    const { width: o, height: s } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: p, height: g, length: m, options: w, pixelRatio: S }) {
      const y = g / 2, b = w.barWidth ? w.barWidth * S : 1, _ = w.barGap ? w.barGap * S : w.barWidth ? b / 2 : 0, E = b + _ || 1;
      return { halfHeight: y, barWidth: b, barGap: _, barRadius: w.barRadius || 0, barMinHeight: w.barMinHeight ? w.barMinHeight * S : 0, barIndexScale: m > 0 ? p / E / m : 0, barSpacing: E };
    })({ width: o, height: s, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), v = (function({ channelData: p, barIndexScale: g, barSpacing: m, barWidth: w, halfHeight: S, vScale: y, canvasHeight: b, barAlign: _, barMinHeight: E }) {
      const C = p[0] || [], I = p[1] || C, O = C.length, P = [];
      let D = 0, B = 0, N = 0;
      for (let L = 0; L <= O; L++) {
        const q = Math.round(L * g);
        if (q > D) {
          const { topHeight: Z, totalHeight: ie } = Od({ maxTop: B, maxBottom: N, halfHeight: S, vScale: y, barMinHeight: E, barAlign: _ }), ce = Ld({ barAlign: _, halfHeight: S, topHeight: Z, totalHeight: ie, canvasHeight: b });
          P.push({ x: D * m, y: ce, width: w, height: ie }), D = q, B = 0, N = 0;
        }
        const G = Math.abs(C[L] || 0), j = Math.abs(I[L] || 0);
        G > B && (B = G), j > N && (N = j);
      }
      return P;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: r, canvasHeight: s, barAlign: t.barAlign, barMinHeight: h });
    i.beginPath();
    for (const p of v) u && "roundRect" in i ? i.roundRect(p.x, p.y, p.width, p.height, u) : i.rect(p.x, p.y, p.width, p.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, r) {
    const { width: o, height: s } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, v = l[0] || [];
      return [v, l[1] || v].map(((p, g) => {
        const m = p.length, w = m ? u / m : 0, S = h, y = g === 0 ? -1 : 1, b = [{ x: 0, y: S }];
        let _ = 0, E = 0;
        for (let C = 0; C <= m; C++) {
          const I = Math.round(C * w);
          if (I > _) {
            const P = S + (Math.round(E * h * d) || 1) * y;
            b.push({ x: _, y: P }), _ = I, E = 0;
          }
          const O = Math.abs(p[C] || 0);
          O > E && (E = O);
        }
        return b.push({ x: _, y: S }), b;
      }));
    })({ channelData: e, width: o, height: s, vScale: r });
    i.beginPath();
    for (const l of a) if (l.length) {
      i.moveTo(l[0].x, l[0].y);
      for (let u = 1; u < l.length; u++) {
        const c = l[u];
        i.lineTo(c.x, c.y);
      }
    }
    i.fill(), i.closePath();
  }
  renderWaveform(e, t, i) {
    if (i.fillStyle = this.convertColorValues(t.waveColor, i), t.renderFunction) return void t.renderFunction(e, i);
    const r = (function({ channelData: o, barHeight: s, normalize: a, maxPeak: l }) {
      var u;
      const c = s || 1;
      if (!a) return c;
      const d = o[0];
      if (!d || d.length === 0) return c;
      let h = l ?? 0;
      if (!l) for (let v = 0; v < d.length; v++) {
        const p = (u = d[v]) !== null && u !== void 0 ? u : 0, g = Math.abs(p);
        g > h && (h = g);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Yr(t) ? this.renderBarWaveform(e, t, i, r) : this.renderLineWaveform(e, t, i, r);
  }
  renderSingleCanvas(e, t, i, r, o, s, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(r * l), u.style.width = `${i}px`, u.style.height = `${r}px`, u.style.left = `${Math.round(o)}px`, s.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), h = d.getContext("2d");
      h.drawImage(u, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(t.progressColor, h), h.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, r, o, s) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: p, totalWidth: g, options: m }) {
      return Ni(Math.min(8e3, p, g), m);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const h = (p) => {
      if (p < 0 || p >= v || d[p]) return;
      d[p] = !0;
      const g = p * c;
      let m = Math.min(u - g, c);
      if (m = Ni(m, t), m <= 0) return;
      const w = (function({ channelData: S, offset: y, clampedWidth: b, totalWidth: _ }) {
        return S.map(((E) => {
          const C = Math.floor(y / _ * E.length), I = Math.floor((y + b) / _ * E.length);
          return E.slice(C, I);
        }));
      })({ channelData: e, offset: g, clampedWidth: m, totalWidth: u });
      this.renderSingleCanvas(w, t, m, r, g, o, s);
    }, v = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let p = 0; p < v; p++) h(p);
      return;
    }
    if (Wi({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: v }).forEach(((p) => h(p))), v > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", s.innerHTML = "", d = {}), Wi({ scrollLeft: g, totalWidth: u, numCanvases: v }).forEach(((m) => h(m)));
      }));
      this.unsubscribeOnScroll.push(p);
    }
  }
  renderChannel(e, t, i, r) {
    var { overlay: o } = t, s = (function(c, d) {
      var h = {};
      for (var v in c) Object.prototype.hasOwnProperty.call(c, v) && d.indexOf(v) < 0 && (h[v] = c[v]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var p = 0;
        for (v = Object.getOwnPropertySymbols(c); p < v.length; p++) d.indexOf(v[p]) < 0 && Object.prototype.propertyIsEnumerable.call(c, v[p]) && (h[v[p]] = c[v[p]]);
      }
      return h;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(s.height, s.splitChannels);
    a.style.height = `${l}px`, o && r > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, s, i, l, a, u);
  }
  render(e) {
    return le(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), r = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: s, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: v }) {
        const p = Math.ceil(u * c), g = p > d, m = !!(h && !g);
        return { scrollWidth: p, isScrollable: g, useParentWidth: m, width: (m ? d : p) * v };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: r, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = s, this.wrapper.style.width = a ? "100%" : `${o}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
        const c = Object.assign(Object.assign({}, this.options), (t = this.options.splitChannels) === null || t === void 0 ? void 0 : t[u]);
        this.renderChannel([e.getChannelData(u)], c, l, u);
      }
      else {
        const u = [e.getChannelData(0)];
        e.numberOfChannels > 1 && u.push(e.getChannelData(1)), this.renderChannel(u, this.options, l, 0);
      }
      Promise.resolve().then((() => this.emit("rendered")));
    }));
  }
  reRender() {
    if (this.unsubscribeOnScroll.forEach(((i) => i())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: t } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: i } = this.progressWrapper.getBoundingClientRect(), r = (function(o) {
        const s = 2 * o;
        return (s < 0 ? Math.floor(s) : Math.ceil(s)) / 2;
      })(i - t);
      this.scrollContainer.scrollLeft += r;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: i, scrollWidth: r, clientWidth: o } = this.scrollContainer, s = e * r, a = i, l = i + o, u = o / 2;
    if (this.isDragging)
      s + 30 > l ? this.scrollContainer.scrollLeft += 30 : s - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (s < a || s > l) && (this.scrollContainer.scrollLeft = s - (this.options.autoCenter ? u : 0));
      const c = s - i - u;
      t && this.options.autoCenter && c > 0 && (this.scrollContainer.scrollLeft += c);
    }
  }
  renderProgress(e, t) {
    if (isNaN(e)) return;
    const i = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${i}% 0%, 100% 0%, 100% 100%, ${i}% 100%)`, this.progressWrapper.style.width = `${i}%`, this.cursor.style.left = `${i}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, t);
  }
  exportImage(e, t, i) {
    return le(this, void 0, void 0, (function* () {
      const r = this.canvasWrapper.querySelectorAll("canvas");
      if (!r.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const o = Array.from(r).map(((s) => s.toDataURL(e, t)));
        return Promise.resolve(o);
      }
      return Promise.all(Array.from(r).map(((o) => new Promise(((s, a) => {
        o.toBlob(((l) => {
          l ? s(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class Dd extends Ot {
  constructor() {
    super(...arguments), this.animationFrameId = null, this.isRunning = !1;
  }
  start() {
    if (this.isRunning) return;
    this.isRunning = !0;
    const e = () => {
      this.isRunning && (this.emit("tick"), this.animationFrameId = requestAnimationFrame(e));
    };
    e();
  }
  stop() {
    this.isRunning = !1, this.animationFrameId !== null && (cancelAnimationFrame(this.animationFrameId), this.animationFrameId = null);
  }
  destroy() {
    this.stop();
  }
}
class _n extends Ot {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return le(this, void 0, void 0, (function* () {
    }));
  }
  get src() {
    return this.currentSrc;
  }
  set src(e) {
    if (this.currentSrc = e, this._duration = void 0, !e) return this.buffer = null, void this.emit("emptied");
    fetch(e).then(((t) => {
      if (t.status >= 400) throw new Error(`Failed to fetch ${e}: ${t.status} (${t.statusText})`);
      return t.arrayBuffer();
    })).then(((t) => this.currentSrc !== e ? null : this.audioContext.decodeAudioData(t))).then(((t) => {
      this.currentSrc === e && (this.buffer = t, this.emit("loadedmetadata"), this.emit("canplay"), this.autoplay && this.play());
    })).catch(((t) => {
      console.error("WebAudioPlayer load error:", t);
    }));
  }
  _play() {
    if (!this.paused) return;
    this.paused = !1, this.bufferNode && (this.bufferNode.onended = null, this.bufferNode.disconnect()), this.bufferNode = this.audioContext.createBufferSource(), this.buffer && (this.bufferNode.buffer = this.buffer), this.bufferNode.playbackRate.value = this._playbackRate, this.bufferNode.connect(this.gainNode);
    let e = this.playedDuration * this._playbackRate;
    (e >= this.duration || e < 0) && (e = 0, this.playedDuration = 0), this.bufferNode.start(this.audioContext.currentTime, e), this.playStartTime = this.audioContext.currentTime, this.bufferNode.onended = () => {
      this.currentTime >= this.duration && (this.pause(), this.emit("ended"));
    };
  }
  _pause() {
    var e;
    this.paused = !0, (e = this.bufferNode) === null || e === void 0 || e.stop(), this.playedDuration += this.audioContext.currentTime - this.playStartTime;
  }
  play() {
    return le(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(e) {
    const t = e - this.currentTime, i = this.bufferNode;
    i?.stop(this.audioContext.currentTime + t), i?.addEventListener("ended", (() => {
      i === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: !0 });
  }
  setSinkId(e) {
    return le(this, void 0, void 0, (function* () {
      return this.audioContext.setSinkId(e);
    }));
  }
  get playbackRate() {
    return this._playbackRate;
  }
  set playbackRate(e) {
    this._playbackRate = e, this.bufferNode && (this.bufferNode.playbackRate.value = e);
  }
  get currentTime() {
    return (this.paused ? this.playedDuration : this.playedDuration + (this.audioContext.currentTime - this.playStartTime)) * this._playbackRate;
  }
  set currentTime(e) {
    const t = !this.paused;
    t && this._pause(), this.playedDuration = e / this._playbackRate, t && this._play(), this.emit("seeking"), this.emit("timeupdate");
  }
  get duration() {
    var e, t;
    return (e = this._duration) !== null && e !== void 0 ? e : ((t = this.buffer) === null || t === void 0 ? void 0 : t.duration) || 0;
  }
  set duration(e) {
    this._duration = e;
  }
  get volume() {
    return this.gainNode.gain.value;
  }
  set volume(e) {
    this.gainNode.gain.value = e, this.emit("volumechange");
  }
  get muted() {
    return this._muted;
  }
  set muted(e) {
    this._muted !== e && (this._muted = e, this._muted ? this.gainNode.disconnect() : this.gainNode.connect(this.audioContext.destination));
  }
  canPlayType(e) {
    return /^(audio|video)\//.test(e);
  }
  getGainNode() {
    return this.gainNode;
  }
  getChannelData() {
    const e = [];
    if (!this.buffer) return e;
    const t = this.buffer.numberOfChannels;
    for (let i = 0; i < t; i++) e.push(this.buffer.getChannelData(i));
    return e;
  }
  removeAttribute(e) {
    switch (e) {
      case "src":
        this.src = "";
        break;
      case "playbackRate":
        this.playbackRate = 0;
        break;
      case "currentTime":
        this.currentTime = 0;
        break;
      case "duration":
        this.duration = 0;
        break;
      case "volume":
        this.volume = 0;
        break;
      case "muted":
        this.muted = !1;
    }
  }
}
const Md = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Tt extends Ad {
  static create(e) {
    return new Tt(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new _n() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Md, e);
    const { state: i, actions: r } = (function(a) {
      var l, u, c, d, h, v;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : re(0), g = (u = a?.duration) !== null && u !== void 0 ? u : re(0), m = (c = a?.isPlaying) !== null && c !== void 0 ? c : re(!1), w = (d = a?.isSeeking) !== null && d !== void 0 ? d : re(!1), S = (h = a?.volume) !== null && h !== void 0 ? h : re(1), y = (v = a?.playbackRate) !== null && v !== void 0 ? v : re(1), b = re(null), _ = re(null), E = re(""), C = re(0), I = re(0), O = Je((() => !m.value), [m]), P = Je((() => b.value !== null), [b]), D = Je((() => P.value && g.value > 0), [P, g]), B = Je((() => p.value), [p]), N = Je((() => g.value > 0 ? p.value / g.value : 0), [p, g]);
      return { state: { currentTime: p, duration: g, isPlaying: m, isPaused: O, isSeeking: w, volume: S, playbackRate: y, audioBuffer: b, peaks: _, url: E, zoom: C, scrollPosition: I, canPlay: P, isReady: D, progress: B, progressPercent: N }, actions: { setCurrentTime: (L) => {
        const q = Math.max(0, Math.min(g.value || 1 / 0, L));
        p.set(q);
      }, setDuration: (L) => {
        g.set(Math.max(0, L));
      }, setPlaying: (L) => {
        m.set(L);
      }, setSeeking: (L) => {
        w.set(L);
      }, setVolume: (L) => {
        const q = Math.max(0, Math.min(1, L));
        S.set(q);
      }, setPlaybackRate: (L) => {
        const q = Math.max(0.1, Math.min(16, L));
        y.set(q);
      }, setAudioBuffer: (L) => {
        b.set(L), L && g.set(L.duration);
      }, setPeaks: (L) => {
        _.set(L);
      }, setUrl: (L) => {
        E.set(L);
      }, setZoom: (L) => {
        C.set(Math.max(0, L));
      }, setScrollPosition: (L) => {
        I.set(Math.max(0, L));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new Dd();
    const o = t ? void 0 : this.getMediaElement();
    this.renderer = new Id(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const s = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (s || a && l) && this.load(s, a, l).catch(((u) => {
        this.emit("error", u instanceof Error ? u : new Error(String(u)));
      }));
    }));
  }
  updateProgress(e = this.getCurrentTime()) {
    return this.renderer.renderProgress(e / this.getDuration(), this.isPlaying()), e;
  }
  initTimerEvents() {
    this.subscriptions.push(this.timer.on("tick", (() => {
      if (!this.isSeeking()) {
        const e = this.updateProgress();
        this.emit("timeupdate", e), this.emit("audioprocess", e), this.stopAtPosition != null && this.isPlaying() && e >= this.stopAtPosition && this.pause();
      }
    })));
  }
  initReactiveState() {
    this.reactiveCleanups.push((function(e, t) {
      const i = [];
      i.push(We((() => {
        const s = e.isPlaying.value;
        t.emit(s ? "play" : "pause");
      }), [e.isPlaying])), i.push(We((() => {
        const s = e.currentTime.value;
        t.emit("timeupdate", s), e.isPlaying.value && t.emit("audioprocess", s);
      }), [e.currentTime, e.isPlaying])), i.push(We((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(We((() => {
        e.isReady.value && !r && (r = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let o = !1;
      return i.push(We((() => {
        const s = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        o && !s && u && t.emit("finish"), o = s && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(We((() => {
        const s = e.zoom.value;
        s > 0 && t.emit("zoom", s);
      }), [e.zoom])), () => {
        i.forEach(((s) => s()));
      };
    })(this.wavesurferState, { emit: this.emit.bind(this) }));
  }
  initPlayerEvents() {
    this.isPlaying() && (this.emit("play"), this.timer.start()), this.mediaSubscriptions.push(this.onMediaEvent("timeupdate", (() => {
      const e = this.updateProgress();
      this.emit("timeupdate", e);
    })), this.onMediaEvent("play", (() => {
      this.emit("play"), this.timer.start();
    })), this.onMediaEvent("pause", (() => {
      this.emit("pause"), this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("emptied", (() => {
      this.timer.stop(), this.stopAtPosition = null;
    })), this.onMediaEvent("ended", (() => {
      this.emit("timeupdate", this.getDuration()), this.emit("finish"), this.stopAtPosition = null;
    })), this.onMediaEvent("seeking", (() => {
      this.emit("seeking", this.getCurrentTime());
    })), this.onMediaEvent("error", (() => {
      var e;
      this.emit("error", (e = this.getMediaElement().error) !== null && e !== void 0 ? e : new Error("Media error")), this.stopAtPosition = null;
    })));
  }
  initRendererEvents() {
    this.subscriptions.push(this.renderer.on("click", ((e, t) => {
      this.options.interact && (this.seekTo(e), this.emit("interaction", e * this.getDuration()), this.emit("click", e, t));
    })), this.renderer.on("dblclick", ((e, t) => {
      this.emit("dblclick", e, t);
    })), this.renderer.on("scroll", ((e, t, i, r) => {
      const o = this.getDuration();
      this.emit("scroll", e * o, t * o, i, r);
    })), this.renderer.on("render", (() => {
      this.emit("redraw");
    })), this.renderer.on("rendered", (() => {
      this.emit("redrawcomplete");
    })), this.renderer.on("dragstart", ((e) => {
      this.emit("dragstart", e);
    })), this.renderer.on("dragend", ((e) => {
      this.emit("dragend", e);
    })), this.renderer.on("resize", (() => {
      this.emit("resize");
    })));
    {
      let e;
      const t = this.renderer.on("drag", ((i) => {
        var r;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let o = 0;
        const s = this.options.dragToSeek;
        this.isPlaying() ? o = 0 : s === !0 ? o = 200 : s && typeof s == "object" && (o = (r = s.debounceTime) !== null && r !== void 0 ? r : 200), e = setTimeout((() => {
          this.seekTo(i);
        }), o), this.emit("interaction", i * this.getDuration()), this.emit("drag", i);
      }));
      this.subscriptions.push((() => {
        clearTimeout(e), t();
      }));
    }
  }
  initPlugins() {
    var e;
    !((e = this.options.plugins) === null || e === void 0) && e.length && this.options.plugins.forEach(((t) => {
      this.registerPlugin(t);
    }));
  }
  unsubscribePlayerEvents() {
    this.mediaSubscriptions.forEach(((e) => e())), this.mediaSubscriptions = [];
  }
  setOptions(e) {
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = $t.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = $t.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
  }
  registerPlugin(e) {
    if (this.plugins.includes(e)) return e;
    e._init(this), this.plugins.push(e);
    const t = e.once("destroy", (() => {
      this.plugins = this.plugins.filter(((i) => i !== e)), this.subscriptions = this.subscriptions.filter(((i) => i !== t));
    }));
    return this.subscriptions.push(t), e;
  }
  unregisterPlugin(e) {
    this.plugins = this.plugins.filter(((t) => t !== e)), e.destroy();
  }
  getWrapper() {
    return this.renderer.getWrapper();
  }
  getWidth() {
    return this.renderer.getWidth();
  }
  getScroll() {
    return this.renderer.getScroll();
  }
  setScroll(e) {
    return this.renderer.setScroll(e);
  }
  setScrollTime(e) {
    const t = e / this.getDuration();
    this.renderer.setScrollPercentage(t);
  }
  getActivePlugins() {
    return this.plugins;
  }
  loadAudio(e, t, i, r) {
    return le(this, void 0, void 0, (function* () {
      var o;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (o = this.abortController) === null || o === void 0 || o.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield Pd.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (t = new Blob([t], { type: u }));
      }
      this.setSrc(e, t);
      const s = yield new Promise(((a) => {
        const l = r || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof _n && (a.duration = s);
      }
      if (i) this.decodedData = $t.createBuffer(i, s || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield $t.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, i) {
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, i);
      } catch (r) {
        throw this.emit("error", r), r;
      }
    }));
  }
  loadBlob(e, t, i) {
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, i);
      } catch (r) {
        throw this.emit("error", r), r;
      }
    }));
  }
  zoom(e) {
    if (!this.decodedData) throw new Error("No audio loaded");
    this.renderer.zoom(e), this.emit("zoom", e);
  }
  getDecodedData() {
    return this.decodedData;
  }
  exportPeaks({ channels: e = 2, maxLength: t = 8e3, precision: i = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const r = Math.min(e, this.decodedData.numberOfChannels), o = [];
    for (let s = 0; s < r; s++) {
      const a = this.decodedData.getChannelData(s), l = [], u = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let h = 0;
        for (let v = 0; v < d.length; v++) {
          const p = d[v];
          Math.abs(p) > Math.abs(h) && (h = p);
        }
        l.push(Math.round(h * i) / i);
      }
      o.push(l);
    }
    return o;
  }
  getDuration() {
    let e = super.getDuration() || 0;
    return e !== 0 && e !== 1 / 0 || !this.decodedData || (e = this.decodedData.duration), e;
  }
  toggleInteraction(e) {
    this.options.interact = e;
  }
  setTime(e) {
    this.stopAtPosition = null, super.setTime(e), this.updateProgress(e), this.emit("timeupdate", e);
  }
  seekTo(e) {
    const t = this.getDuration() * e;
    this.setTime(t);
  }
  play(e, t) {
    const i = Object.create(null, { play: { get: () => super.play } });
    return le(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const r = yield i.play.call(this);
      return t != null && (this.media instanceof _n ? this.media.stopAt(t) : this.stopAtPosition = t), r;
    }));
  }
  playPause() {
    return le(this, void 0, void 0, (function* () {
      return this.isPlaying() ? this.pause() : this.play();
    }));
  }
  stop() {
    this.pause(), this.setTime(0);
  }
  skip(e) {
    this.setTime(this.getCurrentTime() + e);
  }
  empty() {
    this.load("", [[0]], 1e-3);
  }
  setMediaElement(e) {
    this.unsubscribePlayerEvents(), super.setMediaElement(e), this.initPlayerEvents();
  }
  exportImage() {
    return le(this, arguments, void 0, (function* (e = "image/png", t = 1, i = "dataURL") {
      return this.renderer.exportImage(e, t, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Tt.BasePlugin = class extends Ot {
  constructor(n) {
    super(), this.subscriptions = [], this.isDestroyed = !1, this.options = n;
  }
  onInit() {
  }
  _init(n) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = !1), this.wavesurfer = n, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((n) => n())), this.subscriptions = [], this.isDestroyed = !0, this.wavesurfer = void 0;
  }
}, Tt.dom = kd;
class Jr {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...o) => {
        this.un(e, r), t(...o);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var i;
    (i = this.listeners[e]) === null || i === void 0 || i.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((i) => i(...t)));
  }
}
class $d extends Jr {
  constructor(e) {
    super(), this.subscriptions = [], this.isDestroyed = !1, this.options = e;
  }
  onInit() {
  }
  _init(e) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = !1), this.wavesurfer = e, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.isDestroyed = !0, this.wavesurfer = void 0;
  }
}
function Zr(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [o, s] of Object.entries(r)) s instanceof Node ? t.appendChild(s) : typeof s == "string" ? t.appendChild(document.createTextNode(s)) : t.appendChild(Zr(o, s));
  else i === "style" ? Object.assign(t.style, r) : i === "textContent" ? t.textContent = r : t.setAttribute(i, r.toString());
  return t;
}
function mt(n, e, t) {
  const i = Zr(n, e || {});
  return t?.appendChild(i), i;
}
function Qr(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Ft(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, r = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), r.forEach(((o) => o()));
  };
}
function lt(n, e) {
  const t = Qr(null), i = (r) => {
    t.set(r);
  };
  return n.addEventListener(e, i), t._cleanup = () => {
    n.removeEventListener(e, i);
  }, t;
}
function Ge(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function zt(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, o = Qr(null), s = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (s.set(c.pointerId, c), s.size > 1)) return;
    let d = c.clientX, h = c.clientY, v = !1;
    const p = Date.now(), g = n.getBoundingClientRect(), { left: m, top: w } = g, S = (C) => {
      if (C.defaultPrevented || s.size > 1 || a && Date.now() - p < r) return;
      const I = C.clientX, O = C.clientY, P = I - d, D = O - h;
      (v || Math.abs(P) > t || Math.abs(D) > t) && (C.preventDefault(), C.stopPropagation(), v || (o.set({ type: "start", x: d - m, y: h - w }), v = !0), o.set({ type: "move", x: I - m, y: O - w, deltaX: P, deltaY: D }), d = I, h = O);
    }, y = (C) => {
      if (s.delete(C.pointerId), v) {
        const I = C.clientX, O = C.clientY;
        o.set({ type: "end", x: I - m, y: O - w });
      }
      l();
    }, b = (C) => {
      s.delete(C.pointerId), C.relatedTarget && C.relatedTarget !== document.documentElement || y(C);
    }, _ = (C) => {
      v && (C.stopPropagation(), C.preventDefault());
    }, E = (C) => {
      C.defaultPrevented || s.size > 1 || v && C.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", y), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", y), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", E), setTimeout((() => {
        document.removeEventListener("click", _, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: o, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), s.clear(), Ge(o);
  } };
}
class Hi extends Jr {
  constructor(e, t, i = 0) {
    var r, o, s, a, l, u, c, d, h, v;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (s = e.resize) === null || s === void 0 || s, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (v = e.contentEditable) !== null && v !== void 0 ? v : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
  }
  clampPosition(e) {
    return Math.max(0, Math.min(this.totalDuration, e));
  }
  setPart() {
    var e;
    const t = this.start === this.end;
    (e = this.element) === null || e === void 0 || e.setAttribute("part", `${t ? "marker" : "region"} ${this.id}`);
  }
  addResizeHandles(e) {
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = mt("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = mt("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = zt(i, { threshold: 1 }), s = zt(r, { threshold: 1 }), a = Ft((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [o.signal]), l = Ft((() => {
      const u = s.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [s.signal]);
    this.subscriptions.push((() => {
      a(), l(), o.cleanup(), s.cleanup();
    }));
  }
  removeResizeHandles(e) {
    const t = e.querySelector('[part*="region-handle-left"]'), i = e.querySelector('[part*="region-handle-right"]');
    t && e.removeChild(t), i && e.removeChild(i);
  }
  initElement() {
    if (this.isRemoved) return null;
    const e = this.start === this.end;
    let t = 0, i = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (i = 100 / this.numberOfChannels, t = i * this.channelIdx);
    const r = mt("div", { style: { position: "absolute", top: `${t}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(r), r;
  }
  renderPosition() {
    if (!this.element) return;
    const e = this.start / this.totalDuration, t = (this.totalDuration - this.end) / this.totalDuration;
    this.element.style.left = 100 * e + "%", this.element.style.right = 100 * t + "%";
  }
  toggleCursor(e) {
    var t;
    this.drag && (!((t = this.element) === null || t === void 0) && t.style) && (this.element.style.cursor = e ? "grabbing" : "grab");
  }
  initMouseEvents() {
    const { element: e } = this;
    if (!e) return;
    const t = lt(e, "click"), i = lt(e, "mouseenter"), r = lt(e, "mouseleave"), o = lt(e, "dblclick"), s = lt(e, "pointerdown"), a = lt(e, "pointerup"), l = t.subscribe(((m) => m && this.emit("click", m))), u = i.subscribe(((m) => m && this.emit("over", m))), c = r.subscribe(((m) => m && this.emit("leave", m))), d = o.subscribe(((m) => m && this.emit("dblclick", m))), h = s.subscribe(((m) => m && this.toggleCursor(!0))), v = a.subscribe(((m) => m && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), v(), Ge(t), Ge(i), Ge(r), Ge(o), Ge(s), Ge(a);
    }));
    const p = zt(e), g = Ft((() => {
      const m = p.signal.value;
      m && (m.type === "start" ? this.toggleCursor(!0) : m.type === "move" && m.deltaX !== void 0 ? this.onMove(m.deltaX) : m.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [p.signal]);
    this.subscriptions.push((() => {
      g(), p.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (m) => this.onContentClick(m), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, i) {
    var r;
    if (!(!((r = this.element) === null || r === void 0) && r.parentElement)) return;
    const { width: o } = this.element.parentElement.getBoundingClientRect(), s = e / o * this.totalDuration;
    let a = t && t !== "start" ? this.start : this.start + s, l = t && t !== "end" ? this.end : this.end + s;
    const u = i !== void 0;
    u && this.updatingSide && this.updatingSide !== t && (this.updatingSide === "start" ? a = i : l = i), a = Math.max(0, a), l = Math.min(this.totalDuration, l);
    const c = l - a;
    this.updatingSide = t;
    const d = c >= this.minLength && c <= this.maxLength;
    a <= l && (d || u) && (this.start = a, this.end = l, this.renderPosition(), this.emit("update", t));
  }
  onMove(e) {
    this.drag && this._onUpdate(e);
  }
  onResize(e, t) {
    this.resize && (this.resizeStart || t !== "start") && (this.resizeEnd || t !== "end") && this._onUpdate(e, t);
  }
  onEndResizing(e) {
    this.resize && (this.emit("update-end", e), this.updatingSide = void 0);
  }
  onContentClick(e) {
    e.stopPropagation(), e.target.focus(), this.emit("click", e);
  }
  onContentBlur() {
    this.emit("update-end");
  }
  _setTotalDuration(e) {
    this.totalDuration = e, this.renderPosition();
  }
  play(e) {
    this.emit("play", e && this.end !== this.start ? this.end : void 0);
  }
  getContent(e = !1) {
    var t;
    return e ? this.content || void 0 : this.element instanceof HTMLElement ? ((t = this.content) === null || t === void 0 ? void 0 : t.innerHTML) || void 0 : "";
  }
  setContent(e) {
    var t;
    if (this.element) if (this.content && this.contentEditable && (this.contentClickListener && this.content.removeEventListener("click", this.contentClickListener), this.contentBlurListener && this.content.removeEventListener("blur", this.contentBlurListener)), (t = this.content) === null || t === void 0 || t.remove(), e) {
      if (typeof e == "string") {
        const i = this.start === this.end;
        this.content = mt("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (i) => this.onContentClick(i), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var t, i;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const r = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : r ? this.start : this.end), this.renderPosition(), this.setPart();
      }
      if (e.content && this.setContent(e.content), e.id && (this.id = e.id, this.setPart()), e.resize !== void 0 && e.resize !== this.resize) {
        const r = this.start === this.end;
        this.resize = e.resize, this.resize && !r ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      e.resizeStart !== void 0 && (this.resizeStart = e.resizeStart), e.resizeEnd !== void 0 && (this.resizeEnd = e.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = !0, this.emit("remove"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class ri extends $d {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new ri(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((i) => i._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const i = this.regions.filter(((r) => r.start <= t && (r.end === r.start ? r.start + 0.05 : r.end) >= t));
      i.forEach(((r) => {
        e.includes(r) || this.emit("region-in", r);
      })), e.forEach(((r) => {
        i.includes(r) || this.emit("region-out", r);
      })), e = i;
    })));
  }
  initRegionsContainer() {
    return mt("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, i = t.getBoundingClientRect(), r = this.regions.map(((o) => {
        if (o === e || !o.content) return 0;
        const s = o.content.getBoundingClientRect();
        return i.left < s.left + s.width && s.left < i.left + i.width ? s.height : 0;
      })).reduce(((o, s) => o + s), 0);
      t.style.marginTop = `${r}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, i;
    if (!e.element) return;
    const r = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!r) return;
    const { clientWidth: o, scrollWidth: s } = r;
    if (s <= o) return;
    const a = r.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? r.scrollLeft += u : c > o && (r.scrollLeft += c - o);
  }
  virtualAppend(e, t, i) {
    const r = () => {
      if (!this.wavesurfer) return;
      const o = this.wavesurfer.getWidth(), s = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > s && u < s + o;
      c && !i.parentElement ? t.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      r();
      const o = this.wavesurfer.on("scroll", r), s = this.wavesurfer.on("zoom", r), a = this.wavesurfer.on("resize", r);
      this.subscriptions.push(o, s, a), e.once("remove", (() => {
        o(), s(), a();
      }));
    }), 0);
  }
  saveRegion(e) {
    if (!e.element) return;
    this.virtualAppend(e, this.regionsContainer, e.element), this.avoidOverlapping(e), this.regions.push(e);
    const t = [e.on("update", ((i) => {
      i || this.adjustScroll(e), this.emit("region-update", e, i);
    })), e.on("update-end", ((i) => {
      this.avoidOverlapping(e), this.emit("region-updated", e, i);
    })), e.on("play", ((i) => {
      var r;
      (r = this.wavesurfer) === null || r === void 0 || r.play(e.start, i);
    })), e.on("click", ((i) => {
      this.emit("region-clicked", e, i);
    })), e.on("dblclick", ((i) => {
      this.emit("region-double-clicked", e, i);
    })), e.on("content-changed", (() => {
      this.emit("region-content-changed", e);
    })), e.once("remove", (() => {
      t.forEach(((i) => i())), this.regions = this.regions.filter(((i) => i !== e)), this.emit("region-removed", e);
    }))];
    this.subscriptions.push(...t), this.emit("region-created", e);
  }
  addRegion(e) {
    var t, i;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const r = this.wavesurfer.getDuration(), o = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, s = new Hi(e, r, o);
    return this.emit("region-initialized", s), r ? this.saveRegion(s) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      s._setTotalDuration(a), this.saveRegion(s);
    }))), s;
  }
  enableDragSelection(e, t = 3) {
    var i;
    const r = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(r && r instanceof HTMLElement)) return () => {
    };
    let o = null, s = 0, a = 0;
    const l = zt(r, { threshold: t }), u = Ft((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (s = h.x, !this.wavesurfer) return;
        const v = this.wavesurfer.getDuration(), p = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = s / g * v;
        const m = h.x / g * v, w = (h.x + 5) / g * v;
        o = new Hi(Object.assign(Object.assign({}, e), { start: m, end: w }), v, p), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
      } else h.type === "move" && h.deltaX !== void 0 ? o && o._onUpdate(h.deltaX, h.x > s ? "end" : "start", a) : h.type === "end" && o && (this.saveRegion(o), o.updatingSide = void 0, o = null);
    }), [l.signal]);
    return () => {
      u(), l.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((e) => e.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
}
const Cn = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Bd(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: r } = n, o = dt(null), s = dt(null), a = k(0), l = k(0), u = k(!1), c = k(!1), d = k(!1), h = k(1), v = k(1), p = k(!1), g = A(() => Ht(a.value)), m = A(() => Ht(l.value));
  function w(L, q) {
    B(), d.value = !0, c.value = !1;
    const G = ri.create();
    s.value = G;
    const j = Tt.create({
      container: L,
      height: 32,
      waveColor: "#000000ff",
      progressColor: "#5f5f5fff",
      cursorColor: "red",
      cursorWidth: 2,
      barWidth: 3,
      barGap: 2,
      barRadius: 3,
      barHeight: 0.8,
      normalize: !0,
      backend: "MediaElement",
      renderFunction: Do,
      url: q,
      plugins: [G]
    });
    j.on("ready", () => {
      c.value = !0, d.value = !1, l.value = j.getDuration(), S();
    }), j.on("timeupdate", (Z) => {
      a.value = Z;
    }), j.on("play", () => {
      u.value = !0;
    }), j.on("pause", () => {
      u.value = !1;
    }), j.on("finish", () => {
      u.value = !1;
    }), o.value = j;
  }
  function S() {
    const L = s.value;
    if (L) {
      L.clearRegions();
      for (const q of i.value) {
        const G = q.speakerId ? r.value.get(q.speakerId) : void 0;
        if (!G || q.startTime == null || q.endTime == null) continue;
        const j = G.color;
        L.addRegion({
          start: q.startTime,
          end: q.endTime,
          color: Lo(j, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", j);
      }
    }
  }
  function y() {
    o.value?.play();
  }
  function b() {
    o.value?.pause();
  }
  function _() {
    o.value?.playPause();
  }
  function E(L) {
    const q = o.value;
    !q || l.value === 0 || q.setTime(L);
  }
  function C(L) {
    E(Math.max(0, Math.min(a.value + L, l.value)));
  }
  function I(L) {
    const q = o.value;
    q && (h.value = L, q.setVolume(L), L > 0 && p.value && (p.value = !1, q.setMuted(!1)));
  }
  function O() {
    const L = o.value;
    L && (p.value = !p.value, L.setMuted(p.value));
  }
  function P(L) {
    const q = o.value;
    q && (v.value = L, q.setPlaybackRate(L));
  }
  function D() {
    const q = (Cn.indexOf(
      v.value
    ) + 1) % Cn.length;
    P(Cn[q] ?? 1);
  }
  function B() {
    N !== null && (clearTimeout(N), N = null), o.value && (o.value.destroy(), o.value = null, s.value = null);
  }
  te(
    [e, t],
    ([L, q]) => {
      L && q && w(L, q);
    },
    { immediate: !0 }
  );
  let N = null;
  return te([i, r], () => {
    c.value && (N !== null && clearTimeout(N), N = setTimeout(() => {
      N = null, S();
    }, 150));
  }), kt(() => {
    B();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: v,
    isMuted: p,
    formattedCurrentTime: g,
    formattedDuration: m,
    play: y,
    pause: b,
    togglePlay: _,
    seekTo: E,
    skip: C,
    setVolume: I,
    setPlaybackRate: P,
    cyclePlaybackRate: D,
    toggleMute: O
  };
}
const qd = { class: "audio-player" }, Fd = /* @__PURE__ */ $({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, r = t, o = k(null), {
      isPlaying: s,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: v,
      formattedDuration: p,
      togglePlay: g,
      seekTo: m,
      pause: w,
      skip: S,
      setVolume: y,
      cyclePlaybackRate: b,
      toggleMute: _
    } = Bd({
      containerRef: o,
      audioSrc: Bt(() => i.audioSrc),
      turns: Bt(() => i.turns),
      speakers: Bt(() => i.speakers)
    });
    return te(h, (E) => r("timeupdate", E)), te(s, (E) => r("playStateChange", E)), e({ seekTo: m, pause: w }), (E, C) => (x(), H("footer", qd, [
      V("div", {
        ref_key: "waveformRef",
        ref: o,
        class: Wt(["waveform-container", { "waveform-container--loading": f(l) }])
      }, null, 2),
      M(Td, {
        "is-playing": f(s),
        "current-time": f(v),
        duration: f(p),
        volume: f(u),
        "playback-rate": f(c),
        "is-muted": f(d),
        "is-ready": f(a),
        onTogglePlay: f(g),
        onSkipBack: C[0] || (C[0] = (I) => f(S)(-10)),
        onSkipForward: C[1] || (C[1] = (I) => f(S)(10)),
        "onUpdate:volume": f(y),
        onToggleMute: f(_),
        onCyclePlaybackRate: f(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), zd = /* @__PURE__ */ fe(Fd, [["__scopeId", "data-v-9248e45e"]]);
class Nd {
  diff(e, t, i = {}) {
    let r;
    typeof i == "function" ? (r = i, i = {}) : "callback" in i && (r = i.callback);
    const o = this.castInput(e, i), s = this.castInput(t, i), a = this.removeEmpty(this.tokenize(o, i)), l = this.removeEmpty(this.tokenize(s, i));
    return this.diffWithOptionsObj(a, l, i, r);
  }
  diffWithOptionsObj(e, t, i, r) {
    var o;
    const s = (S) => {
      if (S = this.postProcess(S, i), r) {
        setTimeout(function() {
          r(S);
        }, 0);
        return;
      } else
        return S;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (o = i.timeout) !== null && o !== void 0 ? o : 1 / 0, h = Date.now() + d, v = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(v[0], t, e, 0, i);
    if (v[0].oldPos + 1 >= l && p + 1 >= a)
      return s(this.buildValues(v[0].lastComponent, t, e));
    let g = -1 / 0, m = 1 / 0;
    const w = () => {
      for (let S = Math.max(g, -u); S <= Math.min(m, u); S += 2) {
        let y;
        const b = v[S - 1], _ = v[S + 1];
        b && (v[S - 1] = void 0);
        let E = !1;
        if (_) {
          const I = _.oldPos - S;
          E = _ && 0 <= I && I < a;
        }
        const C = b && b.oldPos + 1 < l;
        if (!E && !C) {
          v[S] = void 0;
          continue;
        }
        if (!C || E && b.oldPos < _.oldPos ? y = this.addToPath(_, !0, !1, 0, i) : y = this.addToPath(b, !1, !0, 1, i), p = this.extractCommon(y, t, e, S, i), y.oldPos + 1 >= l && p + 1 >= a)
          return s(this.buildValues(y.lastComponent, t, e)) || !0;
        v[S] = y, y.oldPos + 1 >= l && (m = Math.min(m, S - 1)), p + 1 >= a && (g = Math.max(g, S + 1));
      }
      u++;
    };
    if (r)
      (function S() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return r(void 0);
          w() || S();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= h; ) {
        const S = w();
        if (S)
          return S;
      }
  }
  addToPath(e, t, i, r, o) {
    const s = e.lastComponent;
    return s && !o.oneChangePerToken && s.added === t && s.removed === i ? {
      oldPos: e.oldPos + r,
      lastComponent: { count: s.count + 1, added: t, removed: i, previousComponent: s.previousComponent }
    } : {
      oldPos: e.oldPos + r,
      lastComponent: { count: 1, added: t, removed: i, previousComponent: s }
    };
  }
  extractCommon(e, t, i, r, o) {
    const s = t.length, a = i.length;
    let l = e.oldPos, u = l - r, c = 0;
    for (; u + 1 < s && l + 1 < a && this.equals(i[l + 1], t[u + 1], o); )
      u++, l++, c++, o.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !o.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, u;
  }
  equals(e, t, i) {
    return i.comparator ? i.comparator(e, t) : e === t || !!i.ignoreCase && e.toLowerCase() === t.toLowerCase();
  }
  removeEmpty(e) {
    const t = [];
    for (let i = 0; i < e.length; i++)
      e[i] && t.push(e[i]);
    return t;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  castInput(e, t) {
    return e;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tokenize(e, t) {
    return Array.from(e);
  }
  join(e) {
    return e.join("");
  }
  postProcess(e, t) {
    return e;
  }
  get useLongestToken() {
    return !1;
  }
  buildValues(e, t, i) {
    const r = [];
    let o;
    for (; e; )
      r.push(e), o = e.previousComponent, delete e.previousComponent, e = o;
    r.reverse();
    const s = r.length;
    let a = 0, l = 0, u = 0;
    for (; a < s; a++) {
      const c = r[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(l, l + c.count);
          d = d.map(function(h, v) {
            const p = i[u + v];
            return p.length > h.length ? p : h;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return r;
  }
}
class Wd extends Nd {
  tokenize(e) {
    return e.slice();
  }
  join(e) {
    return e;
  }
  removeEmpty(e) {
    return e;
  }
}
const Hd = new Wd();
function Vd(n, e, t) {
  return Hd.diff(n, e, t);
}
function En({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const r = n.split(" "), o = t.split(" "), s = Vd(r, o, {
    comparator: Ud
  }), a = jd(s), l = [...e];
  let u = [...e], c = 0;
  for (const v of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in v && v.replaced)
      u = Nt(
        u,
        l[0],
        v.countAdded - v.countRemoved
      ), c += v.countRemoved;
    else if ("removed" in v && v.removed) {
      const p = v;
      c += p.count, u = Nt(
        u,
        l[0],
        -p.count
      );
    } else if ("added" in v && v.added) {
      const p = v;
      u = Nt(
        u,
        l[0],
        p.count
      );
    } else
      c += v.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = o.slice(d).join(" ");
  if (i(h)) {
    const p = eo(
      h,
      i
    ).map(
      (g) => g + d
    );
    u = u.concat(p);
  }
  return {
    previousIndexes: u,
    previousText: t
  };
}
function jd(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (t + 1 < n.length) {
      const r = n[t + 1];
      if (r.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: r.added ?? !1,
          countRemoved: i.count,
          countAdded: r.count
        }), t++;
        continue;
      }
    }
    e.push(i);
  }
  return e;
}
function Nt(n, e, t) {
  return n.map((i) => i >= e ? i + t : i);
}
function eo(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let i;
  for (i = 0; i < t.length; i++) {
    const r = t.slice(0, i).join(" ");
    if (e(r)) break;
  }
  return [i - 1].concat(
    Nt(
      eo(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function Ud(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(t.length, i.length);
  let o = 0;
  for (let a = 0; a < r; a++)
    t[a] === i[a] && o++;
  return o / t.length > 0.8;
}
class Kd {
  canvas;
  fontSize;
  lineHeight;
  color;
  font;
  paddingInline;
  isResizing = !1;
  resizeObserver;
  constructor(e, {
    fontSize: t = 40,
    lineHeight: i = 50,
    color: r = "white",
    font: o = "Arial",
    paddingInline: s = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = i, this.color = r, this.font = o, this.paddingInline = s, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, t, i) {
    const r = this.canvas.getContext("2d");
    r.font = `${this.fontSize}px ${this.font}`, r.fillStyle = this.color, r.fillText(e, t + this.paddingInline, i);
  }
  drawFirstLine(e) {
    this.drawText(e, 0, this.fontSize);
  }
  drawSecondLine(e) {
    this.drawText(e, 0, this.fontSize + this.lineHeight);
  }
  onResize() {
  }
}
class Xd extends Kd {
  currentState = { previousText: "", previousIndexes: [] };
  previousState = { previousText: "", previousIndexes: [] };
  constructor(e, t) {
    super(e, t);
  }
  resetAll() {
    this.currentState = { previousText: "", previousIndexes: [] }, this.previousState = { previousText: "", previousIndexes: [] };
  }
  onResize() {
    const e = this.currentState.previousText;
    this.resetAll(), this.currentState = En(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = En(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = En(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw(), this.resetState());
  }
  resetState() {
    this.previousState = this.currentState, this.currentState = { previousText: "", previousIndexes: [] };
  }
  draw() {
    this.resetDrawing();
    let e = "", t = "";
    this.currentState.previousIndexes.length === 0 ? (e = this.getLastLineOfState(this.previousState), t = this.currentState.previousText) : (e = this.getSecondLastLineOfState(this.currentState), t = this.getLastLineOfState(this.currentState)), this.drawFirstLine(e), this.drawSecondLine(t);
  }
  getLastLineOfState(e) {
    if (e.previousIndexes.length === 0) return e.previousText;
    const t = e.previousIndexes[e.previousIndexes.length - 1];
    return e.previousText.split(" ").slice(t).join(" ");
  }
  getSecondLastLineOfState(e) {
    if (e.previousIndexes.length === 0) return "";
    const t = e.previousIndexes[e.previousIndexes.length - 1];
    let i = 0;
    return e.previousIndexes.length > 1 && (i = e.previousIndexes[e.previousIndexes.length - 2]), e.previousText.split(" ").slice(i, t).join(" ");
  }
  computeIfTextIsTooLong(e) {
    const t = this.canvas.getContext("2d");
    t.font = `${this.fontSize}px ${this.font}`;
    const i = this.canvas.width - 2 * this.paddingInline;
    return t.measureText(e).width > i;
  }
}
function to(n) {
  const e = tt();
  let t = null;
  ne(() => {
    n.canvasRef.value && (t = new Xd(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), te(
    () => e.live?.partial.value,
    (a) => {
      a && t && t.newPartial(a);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: a }) => {
    if (!t) return;
    const l = a.words.length > 0 ? a.words.map((u) => u.text).join(" ") : a.text ?? "";
    l && t.newFinal(l);
  });
  function r() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const o = e.on("translation:sync", r), s = e.on("channel:sync", r);
  Ee(() => {
    i(), o(), s(), t?.dispose(), t = null;
  });
}
const Yd = ["height"], Gd = /* @__PURE__ */ $({
  __name: "SubtitleBanner",
  setup(n) {
    const e = tt(), t = bt("canvas"), i = A(() => e.subtitle?.fontSize.value ?? 40), r = A(() => 1.2 * i.value), o = A(() => 2.4 * i.value);
    return to({
      canvasRef: t,
      fontSize: i.value,
      lineHeight: r.value
    }), (s, a) => (x(), H("div", {
      class: "subtitle-banner",
      style: Re({ height: o.value + "px" })
    }, [
      V("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: o.value
      }, null, 8, Yd)
    ], 4));
  }
}), Jd = /* @__PURE__ */ fe(Gd, [["__scopeId", "data-v-b80652cd"]]), Zd = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Qd = ["aria-label"], ef = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Vi = 48, tf = /* @__PURE__ */ $({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = tt(), { t } = Ie(), i = bt("container"), r = bt("canvas");
    to({
      canvasRef: r,
      fontSize: Vi,
      lineHeight: 1.2 * Vi
    }), ne(async () => {
      const a = i.value;
      if (a) {
        try {
          await a.requestFullscreen();
        } catch (l) {
          console.warn("Fullscreen API not supported:", l);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function o() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    ne(() => {
      document.addEventListener("fullscreenchange", o);
    });
    function s() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Ee(() => {
      document.removeEventListener("fullscreenchange", o);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (x(), H("div", Zd, [
      V("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": f(t)("subtitle.exitFullscreen"),
        onClick: s
      }, [
        M(f(rr), { size: 24 })
      ], 8, Qd),
      V("canvas", ef, null, 512)
    ], 512));
  }
}), nf = /* @__PURE__ */ fe(tf, [["__scopeId", "data-v-cfe63125"]]), rf = { class: "editor-layout" }, of = { class: "editor-body" }, sf = {
  key: 4,
  class: "mobile-selectors"
}, af = /* @__PURE__ */ $({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = tt(), { t: i, locale: r } = Ie(), { isMobile: o } = Ur(), s = k(!1), a = A(() => t.activeChannel.value.activeTranslation.value.turns.value), l = t.speakers.all, u = A(() => [...t.channels.values()]), c = A(() => [...t.activeChannel.value.translations.values()]), d = A(() => t.activeChannel.value.activeTranslation.value.id), h = A(() => Array.from(l.values())), v = bt("audioPlayer");
    function p(S) {
      t.audio && (t.audio.currentTime.value = S);
    }
    te(
      () => t.activeChannelId.value,
      () => {
        v.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), s.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((S) => v.value?.seekTo(S));
    const g = A(
      () => er(
        c.value,
        r.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function m(S) {
      t.setActiveChannel(S);
    }
    function w(S) {
      t.activeChannel.value.setActiveTranslation(S);
    }
    return (S, y) => (x(), H("div", rf, [
      e.showHeader ? (x(), R(cs, {
        key: 0,
        title: f(t).title.value,
        duration: f(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": f(o),
        onToggleSidebar: y[0] || (y[0] = (b) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : X("", !0),
      V("main", of, [
        M(Fc, {
          turns: a.value,
          speakers: f(l)
        }, null, 8, ["turns", "speakers"]),
        f(o) ? X("", !0) : (x(), R(qi, {
          key: 0,
          speakers: h.value,
          channels: u.value,
          "selected-channel-id": f(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": m,
          "onUpdate:selectedTranslationId": w
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        f(o) ? (x(), R(gd, {
          key: 1,
          open: s.value,
          "onUpdate:open": y[1] || (y[1] = (b) => s.value = b)
        }, {
          default: T(() => [
            M(qi, {
              speakers: h.value,
              channels: u.value,
              "selected-channel-id": f(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": m,
              "onUpdate:selectedTranslationId": w
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : X("", !0)
      ]),
      f(t).audio?.src.value ? (x(), R(zd, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": f(t).audio.src.value,
        turns: a.value,
        speakers: f(l),
        onTimeupdate: p,
        onPlayStateChange: y[2] || (y[2] = (b) => {
          f(t).audio && (f(t).audio.isPlaying.value = b);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : X("", !0),
      f(t).subtitle?.isVisible.value && !f(o) && !f(t).subtitle.isFullscreen.value ? (x(), R(Jd, { key: 2 })) : X("", !0),
      f(t).subtitle?.isFullscreen.value ? (x(), R(nf, { key: 3 })) : X("", !0),
      f(o) ? (x(), H("div", sf, [
        u.value.length > 1 ? (x(), R(Kr, {
          key: 0,
          channels: u.value,
          "selected-channel-id": f(t).activeChannelId.value,
          "onUpdate:selectedChannelId": m
        }, null, 8, ["channels", "selected-channel-id"])) : X("", !0),
        c.value.length > 1 ? (x(), R(ii, {
          key: 1,
          items: g.value,
          "selected-value": d.value,
          ariaLabel: f(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": w
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : X("", !0)
      ])) : X("", !0)
    ]));
  }
}), vf = /* @__PURE__ */ fe(af, [["__scopeId", "data-v-084c0e7c"]]);
function mf() {
  return {
    name: "audio",
    install(n) {
      const e = k(0), t = k(!1);
      let i = null;
      const r = A(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function o(l) {
        i?.(l);
      }
      function s(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: t,
        src: r,
        seekTo: o,
        setSeekHandler: s
      };
      return n.audio = a, () => {
        n.audio = void 0;
      };
    }
  };
}
function ji(n) {
  const e = n.words.length > 0;
  return {
    id: n.turnId,
    speakerId: n.speakerId,
    text: e ? null : n.text ?? null,
    words: n.words,
    startTime: n.startTime,
    endTime: n.endTime,
    language: n.language
  };
}
function Ui(n, e) {
  return {
    id: n.turnId,
    speakerId: n.speakerId,
    text: e.text,
    words: [],
    startTime: n.startTime,
    endTime: n.endTime,
    language: e.language
  };
}
function gf() {
  return {
    name: "live",
    install(n) {
      const e = dt(null), t = k(!1);
      t.value = !0;
      function i() {
        e.value = null, si(e);
      }
      function r(y, b) {
        if (n.activeChannelId.value !== b) return;
        const _ = n.activeChannel.value.activeTranslation.value;
        if (_.isSource) {
          if (y.text == null) return;
          e.value = y.text;
        } else if (y.translations) {
          const E = y.translations.find(
            (C) => C.translationId === _.id
          );
          e.value = E?.text ?? null;
        } else
          return;
        si(e);
      }
      let o = null;
      function s() {
        o === null && (o = setTimeout(() => {
          o = null, i();
        }, 150));
      }
      function a() {
        o !== null && (clearTimeout(o), o = null);
      }
      function l(y, b) {
        y.turns.value.some((E) => E.id === b.id) ? y.updateTurn(b.id, b) : y.addTurn(b);
      }
      function u(y, b) {
        y.speakerId && n.speakers.ensure(y.speakerId);
        const _ = n.channels.get(b);
        if (!_) {
          h();
          return;
        }
        if (y.text != null && l(_.sourceTranslation, ji(y)), y.translations)
          for (const E of y.translations) {
            const C = _.translations.get(E.translationId);
            C && l(C, Ui(y, E));
          }
        h();
      }
      function c(y, b) {
        d([y], b);
      }
      function d(y, b) {
        const _ = n.channels.get(b);
        if (!_) return;
        const E = /* @__PURE__ */ new Set();
        for (const O of y)
          O.speakerId && !E.has(O.speakerId) && (E.add(O.speakerId), n.speakers.ensure(O.speakerId));
        const C = [];
        for (const O of y)
          O.text != null && C.push(ji(O));
        C.length > 0 && _.sourceTranslation.prependTurns(C);
        const I = /* @__PURE__ */ new Map();
        for (const O of y)
          if (O.translations)
            for (const P of O.translations) {
              let D = I.get(P.translationId);
              D || (D = [], I.set(P.translationId, D)), D.push(Ui(O, P));
            }
        for (const [O, P] of I) {
          const D = _.translations.get(O);
          D && D.prependTurns(P);
        }
      }
      function h() {
        a(), i();
      }
      function v(y) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const p = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: r,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: v
      }, g = n.on("channel:change", h), m = n.on("translation:change", h), w = n.on("translation:sync", s), S = n.on("channel:sync", s);
      return n.live = p, () => {
        h(), g(), m(), w(), S(), n.live = void 0;
      };
    }
  };
}
function yf(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = k(n.fontSize ?? 40), i = k(!0), r = k(!1), o = {
        fontSize: t,
        isVisible: i,
        isFullscreen: r,
        enterFullscreen() {
          r.value = !0;
        },
        exitFullscreen() {
          r.value = !1;
        }
      };
      return e.subtitle = o, () => {
        i.value = !1, r.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function lf(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function bf(n) {
  const e = /* @__PURE__ */ new Map();
  for (const r of n.speakers)
    e.set(r.speaker_id, {
      id: r.speaker_id,
      name: r.speaker_name,
      color: ""
    });
  const t = n.text.map((r) => {
    const o = r.words.map(lf), s = o[0]?.startTime ?? r.stime, a = o.length > 0 ? o[o.length - 1].endTime ?? r.etime : r.etime;
    return {
      id: r.turn_id,
      speakerId: r.speaker_id || null,
      text: o.length > 0 ? null : r.segment,
      words: o,
      ...s !== void 0 && { startTime: s },
      ...a !== void 0 && { endTime: a },
      language: r.language
    };
  }), i = n.metadata.transcription.lang ?? n.text[0]?.language ?? "fr";
  return {
    title: n.name,
    description: n.description,
    speakers: e,
    channels: [
      {
        id: "default",
        name: "Canal 1",
        duration: n.metadata.audio.duration,
        translations: [
          {
            id: "source",
            languages: [i],
            isSource: !0,
            audio: {
              src: n.metadata.audio.filepath,
              filename: n.metadata.audio.filename
            },
            turns: t
          }
        ]
      }
    ]
  };
}
export {
  de as DocumentValidationError,
  vf as EditorLayout,
  mf as createAudioPlugin,
  cf as createEditorStore,
  gf as createLivePlugin,
  yf as createSubtitlePlugin,
  bf as mapApiDocument,
  df as provideEditorStore,
  ff as provideI18n,
  tt as useEditorStore,
  Io as validateEditorDocument
};
