import * as Kn from "vue";
import { shallowReactive as On, ref as A, computed as P, inject as Wt, provide as Ht, h as Le, defineComponent as F, openBlock as E, createElementBlock as W, renderSlot as j, useSlots as zs, normalizeClass as Rt, createCommentVNode as K, createElementVNode as H, toDisplayString as Y, createVNode as B, withCtx as I, createTextVNode as de, createBlock as q, unref as m, watchEffect as ye, onBeforeUnmount as wt, normalizeStyle as lt, Fragment as ve, renderList as Ye, createStaticVNode as Ns, useTemplateRef as mt, onMounted as re, watch as Z, nextTick as se, Transition as Ws, useId as Hs, customRef as Vs, toValue as le, getCurrentScope as Di, onScopeDispose as Li, effectScope as Ri, getCurrentInstance as Ge, shallowRef as ot, readonly as js, toHandlerKey as Us, camelize as Mi, toRef as At, onUnmounted as St, toRefs as ut, Comment as Ks, mergeProps as Q, cloneVNode as Xs, reactive as $i, Teleport as Bi, normalizeProps as In, guardReactiveProps as Dn, markRaw as Ys, watchPostEffect as qi, shallowReadonly as tt, mergeDefaults as Gs, withKeys as yn, withModifiers as Ke, withMemo as Js, resolveDynamicComponent as Zs, useModel as Qs, withDirectives as er, vShow as tr, triggerRef as Xn } from "vue";
function nr() {
  const n = /* @__PURE__ */ new Map();
  function e(r, o) {
    let a = n.get(r);
    return a || (a = /* @__PURE__ */ new Set(), n.set(r, a)), a.add(o), () => t(r, o);
  }
  function t(r, o) {
    n.get(r)?.delete(o);
  }
  function i(r, o) {
    n.get(r)?.forEach(
      (a) => a(o)
    );
  }
  function s() {
    n.clear();
  }
  return { on: e, off: t, emit: i, clear: s };
}
const Yn = [
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
function ir(n, e, t) {
  const i = Yn[n.size % Yn.length];
  return { id: e, name: t, color: i };
}
function sr(n, e, t) {
  return !e || n.has(e) ? null : ir(n, e, t ?? e);
}
function rr(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function or(n) {
  const e = On(/* @__PURE__ */ new Map());
  function t(r, o) {
    const a = sr(e, r, o);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(r, o) {
    const a = rr(e, r, o);
    a && (e.set(r, a), n("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: s };
}
function ar(n, e) {
  return [...n, e];
}
function lr(n, e) {
  return [...e, ...n];
}
function ur(n, e, t) {
  const i = n.findIndex((r) => r.id === e);
  if (i === -1) return null;
  const s = { ...n[i], ...t, id: e };
  return {
    turns: n.map((r, o) => o === i ? s : r),
    updated: s
  };
}
function cr(n, e) {
  const t = n.findIndex((i) => i.id === e);
  return t === -1 ? null : n.filter((i, s) => s !== t);
}
function dr(n, e, t) {
  const i = n.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const s = n[i], r = {
    ...s,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? s.startTime,
    endTime: t[t.length - 1]?.endTime ?? s.endTime
  };
  return {
    turns: n.map((o, a) => a === i ? r : o),
    updated: r
  };
}
function bn(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function fr(n, e, t) {
  const { id: i, languages: s, isSource: r, audio: o } = n, a = A(n.turns);
  function l(f) {
    t(f.speakerId), a.value = ar(a.value, f), e("turn:add", { turn: f, translationId: i });
  }
  function u(f, g) {
    const v = ur(a.value, f, g);
    v && (a.value = v.turns, e("turn:update", { turn: v.updated, translationId: i }));
  }
  function c(f) {
    const g = cr(a.value, f);
    g && (a.value = g, e("turn:remove", { turnId: f, translationId: i }));
  }
  function d(f, g) {
    const v = dr(a.value, f, g);
    v && (a.value = v.turns, e("turn:update", { turn: v.updated, translationId: i }));
  }
  function h(f) {
    bn(f, t), a.value = lr(a.value, f);
  }
  function p(f) {
    bn(f, t), a.value = f, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: s, isSource: r, audio: o, turns: a, addTurn: l, prependTurns: h, updateTurn: u, removeTurn: c, updateWords: d, setTurns: p };
}
function Gn(n, e, t) {
  const { id: i, name: s, description: r, duration: o } = n, a = On(/* @__PURE__ */ new Map());
  let l;
  for (const g of n.translations) {
    const v = fr(g, e, t);
    a.set(g.id, v), g.isSource && !l && (l = v);
  }
  l || (l = a.values().next().value);
  const u = A(null), c = A(!1), d = A(!0), h = P(() => u.value ? a.get(u.value) ?? l : l);
  function p(g) {
    const v = g === l.id ? null : g;
    v !== u.value && (u.value = v, e("translation:change", { translationId: h.value.id }));
  }
  function f() {
    for (const g of a.values())
      g.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: s,
    description: r,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: h,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: p,
    reset: f
  };
}
function pr(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, s] of n.speakers)
    e.add(i), t.push({ id: i, name: s.name });
  for (const i of n.channels)
    for (const s of i.translations)
      for (const r of s.turns)
        r.speakerId && !e.has(r.speakerId) && (e.add(r.speakerId), t.push({ id: r.speakerId, name: r.speakerId }));
  return t;
}
function hr(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), r = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${r}, ${e})`;
}
function Ln(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function Fi(n, e, t, i = "*") {
  return n.map((s) => ({
    value: s.id,
    label: s.languages.map((r) => Ln(r, e, i)).join(", ") + (s.isSource ? ` (${t})` : "")
  }));
}
function mr(n, e = 250) {
  let t = !1, i = null;
  return (...s) => {
    if (t) {
      i = s;
      return;
    }
    t = !0, n(...s), setTimeout(() => {
      if (t = !1, i !== null) {
        const r = i;
        i = null, n(...r);
      }
    }, e);
  };
}
function Mt(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), s = e % 60, r = String(i).padStart(2, "0"), o = String(s).padStart(2, "0");
  return t > 0 ? `${t}:${r}:${o}` : `${r}:${o}`;
}
class ce extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function vr(n) {
  if (n == null || typeof n != "object")
    throw new ce("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new ce("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new ce("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new ce("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const i = e.channels[t], s = `channels[${t}]`;
    if (i == null || typeof i != "object")
      throw new ce(s, "must be a non-null object");
    if (typeof i.id != "string")
      throw new ce(`${s}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new ce(`${s}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new ce(`${s}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new ce(`${s}.translations`, "must be an array");
    for (let r = 0; r < i.translations.length; r++) {
      const o = i.translations[r], a = `${s}.translations[${r}]`;
      if (o == null || typeof o != "object")
        throw new ce(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new ce(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new ce(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new ce(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new ce(`${a}.turns`, "must be an array");
    }
  }
}
function gr(n, e) {
  const { width: t, height: i } = e.canvas, s = n[0], r = s.length / t, o = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * r), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0), c = c + o, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + o, 0);
  }
  e.stroke(), e.closePath();
}
function zi(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function yr(n, e) {
  if (!zi(n)) return null;
  let t = 0, i = n.length - 1;
  for (; t <= i; ) {
    const s = t + i >>> 1, r = n[s];
    if (e < r.startTime)
      i = s - 1;
    else if (e > r.endTime)
      t = s + 1;
    else
      return r.id;
  }
  return null;
}
function Td(n = {}) {
  const e = A(""), t = A(n.activeChannelId ?? ""), i = A(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: r, emit: o, clear: a } = nr(), l = or(o), u = l, c = On(/* @__PURE__ */ new Map()), d = P(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function h(C, b) {
    return s(C, (O) => {
      O.translationId === d.value.activeTranslation.value.id && b(O);
    });
  }
  function p(C) {
    e.value = C.title, l.clear(), c.clear();
    for (const b of pr(C))
      u.ensure(b.id, b.name);
    for (const b of C.channels)
      c.set(b.id, Gn(b, o, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function f(C) {
    vr(C), p(C);
  }
  function g(C) {
    C !== t.value && (t.value = C, o("channel:change", { channelId: C }));
  }
  function v(C, b) {
    if (c.has(C)) {
      for (const O of b.translations)
        bn(O.turns, u.ensure);
      c.set(C, Gn(b, o, u.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const _ = [], S = [];
  function w(C) {
    C.tiptapExtensions && S.push(...C.tiptapExtensions);
    const b = C.install(x);
    b && _.push(b);
  }
  function y() {
    o("destroy", void 0), _.forEach((C) => C()), _.length = 0, a();
  }
  n.document && p(n.document);
  const x = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    pluginExtensions: S,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: f,
    setActiveChannel: g,
    setChannel: v,
    on: s,
    off: r,
    emit: o,
    use: w,
    destroy: y
  };
  return x;
}
const Ni = /* @__PURE__ */ Symbol("editorStore");
function Pd(n) {
  Ht(Ni, n);
}
function Je() {
  const n = Wt(Ni);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const br = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Jn = (n) => n === "";
const wr = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const Zn = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Sr = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const Cr = (n) => {
  const e = Sr(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var ft = {
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
const xr = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: s,
  "stroke-width": r,
  size: o = ft.width,
  color: a = ft.stroke,
  ...l
}, { slots: u }) => Le(
  "svg",
  {
    ...ft,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": Jn(t) || Jn(i) || t === !0 || i === !0 ? Number(s || r || ft["stroke-width"]) * 24 / Number(o) : s || r || ft["stroke-width"],
    class: wr(
      "lucide",
      l.class,
      ...n ? [`lucide-${Zn(Cr(n))}-icon`, `lucide-${Zn(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !br(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Le(...c)), ...u.default ? [u.default()] : []]
);
const he = (n, e) => (t, { slots: i, attrs: s }) => Le(
  xr,
  {
    ...s,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const _r = he("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Wi = he("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Er = he("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Qn = he("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const kr = he("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Tr = he("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Pr = he("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Ar = he("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Or = he("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Ir = he("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Dr = he("volume-2", [
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
const Lr = he("volume-x", [
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
const Hi = he("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Rr = ["aria-label"], Mr = /* @__PURE__ */ F({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (E(), W("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      j(e.$slots, "default", {}, void 0, !0)
    ], 8, Rr));
  }
}), oe = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, s] of e)
    t[i] = s;
  return t;
}, wn = /* @__PURE__ */ oe(Mr, [["__scopeId", "data-v-3d3f8eba"]]), $r = ["disabled", "aria-label"], Br = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, qr = /* @__PURE__ */ F({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = zs(), i = P(() => !!t.icon && !t.default), s = P(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (r, o) => (E(), W("button", {
      type: "button",
      class: Rt(s.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      r.$slots.icon ? (E(), W("span", Br, [
        j(r.$slots, "icon", {}, void 0, !0)
      ])) : K("", !0),
      j(r.$slots, "default", {}, void 0, !0)
    ], 10, $r));
  }
}), _e = /* @__PURE__ */ oe(qr, [["__scopeId", "data-v-9ebbb489"]]), Vi = {
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
  "transcription.empty": "Aucune transcription pour le moment",
  "transcription.historyStart": "Début de la transcription",
  "transcription.loadingHistory": "Chargement…"
}, Fr = {
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
  "transcription.empty": "No transcription yet",
  "transcription.historyStart": "Beginning of transcription",
  "transcription.loadingHistory": "Loading…"
}, ei = { fr: Vi, en: Fr }, ji = /* @__PURE__ */ Symbol("i18n");
function Ad(n) {
  const e = P(() => {
    const i = ei[n.value] ?? ei.fr;
    return (s) => i[s] ?? s;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return Ht(ji, t), t;
}
function Ae() {
  const n = Wt(ji);
  if (n) return n;
  const e = P(() => "fr");
  return {
    t: (t) => Vi[t] ?? t,
    locale: e
  };
}
const zr = { class: "editor-header" }, Nr = { class: "header-left" }, Wr = { class: "document-title" }, Hr = { class: "badges" }, Vr = ["datetime"], jr = { class: "header-right" }, Ur = /* @__PURE__ */ F({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = Ae(), s = P(() => Ln(e.language, i.value, t("language.wildcard"))), r = P(() => Mt(e.duration)), o = P(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), W("header", zr, [
      H("div", Nr, [
        H("h1", Wr, Y(o.value), 1),
        H("div", Hr, [
          B(wn, null, {
            default: I(() => [
              de(Y(s.value), 1)
            ]),
            _: 1
          }),
          B(wn, null, {
            default: I(() => [
              H("time", {
                datetime: `PT${n.duration}S`
              }, Y(r.value), 9, Vr)
            ]),
            _: 1
          })
        ])
      ]),
      H("div", jr, [
        n.isMobile ? (E(), q(_e, {
          key: 0,
          variant: "ghost",
          "aria-label": m(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: I(() => [
            B(m(Ir), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (E(), q(_e, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": m(t)("header.export")
        }, {
          icon: I(() => [
            B(m(Qn), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (E(), q(_e, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: I(() => [
            B(m(Qn), { size: 16 })
          ]),
          default: I(() => [
            de(" " + Y(m(t)("header.export")), 1)
          ]),
          _: 1
        })),
        B(_e, {
          variant: "ghost",
          disabled: "",
          "aria-label": m(t)("header.settings")
        }, {
          icon: I(() => [
            B(m(Pr), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Kr = /* @__PURE__ */ oe(Ur, [["__scopeId", "data-v-f16781f3"]]), nn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Xr = 70, Yr = 1e3 / 60, Gr = 350;
let Ot = !1, ti = !1;
function Jr() {
  ti || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Ot = !0;
  }), document.addEventListener("mouseup", () => {
    Ot = !1;
  }), document.addEventListener("click", () => {
    Ot = !1;
  }), ti = !0);
}
const sn = /* @__PURE__ */ new Map();
function rn(...n) {
  const e = {
    damping: nn.damping,
    stiffness: nn.stiffness,
    mass: nn.mass
  };
  let t = !1;
  for (const s of n) {
    if (s === "instant") {
      t = !0;
      continue;
    }
    typeof s != "object" || !s || (t = !1, e.damping = s.damping ?? e.damping, e.stiffness = s.stiffness ?? e.stiffness, e.mass = s.mass ?? e.mass);
  }
  const i = JSON.stringify(e);
  return sn.has(i) || sn.set(i, Object.freeze({ ...e })), t ? "instant" : sn.get(i);
}
function Zr(n = {}) {
  Jr();
  let e = { ...n };
  const t = /* @__PURE__ */ new Set(), i = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function s() {
    const k = r();
    for (const L of t) L(k);
  }
  function r() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function o() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(k) {
    i.scrollElement && (i.scrollElement.scrollTop = k, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const k = i.scrollElement, L = i.contentElement;
    return !k || !L ? 0 : k.scrollHeight - 1 - k.clientHeight;
  }
  let u;
  function c() {
    const k = i.scrollElement, L = i.contentElement;
    if (!k || !L)
      return 0;
    const R = l();
    if (!e.targetScrollTop)
      return R;
    if (u?.targetScrollTop === R)
      return u.calculatedScrollTop;
    const z = Math.max(
      Math.min(
        e.targetScrollTop(R, {
          scrollElement: k,
          contentElement: L
        }),
        R
      ),
      0
    );
    return u = { targetScrollTop: R, calculatedScrollTop: z }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), z;
  }
  function d() {
    return c() - o();
  }
  function h() {
    return d() <= Xr;
  }
  function p(k) {
    i.isAtBottom = k, s();
  }
  function f(k) {
    i.escapedFromLock = k, s();
  }
  function g(k) {
    i.isNearBottom = k, s();
  }
  function v() {
    if (!Ot || typeof window > "u")
      return !1;
    const k = window.getSelection?.();
    if (!k || !k.rangeCount)
      return !1;
    const L = k.getRangeAt(0), R = i.scrollElement;
    if (!R)
      return !1;
    const z = L.commonAncestorContainer;
    return !!(z && (R.contains(z) || z.contains(R)));
  }
  const _ = (k) => {
    if (k.target !== i.scrollElement)
      return;
    const L = o(), R = i.ignoreScrollToTop;
    let z = i.lastScrollTop ?? L;
    i.lastScrollTop = L, i.ignoreScrollToTop = void 0, R && R > L && (z = R), g(h()), setTimeout(() => {
      if (i.resizeDifference || L === R)
        return;
      if (v()) {
        f(!0), p(!1);
        return;
      }
      const D = L > z, M = L < z;
      if (i.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      M && (f(!0), p(!1)), D && f(!1), !i.escapedFromLock && h() && p(!0);
    }, 1);
  }, S = (k) => {
    const L = i.scrollElement;
    if (!L)
      return;
    let R = k.target;
    for (; R && !["scroll", "auto"].includes(getComputedStyle(R).overflow); ) {
      if (!R.parentElement)
        return;
      R = R.parentElement;
    }
    R === L && k.deltaY < 0 && L.scrollHeight > L.clientHeight && !i.animation?.ignoreEscapes && (f(!0), p(!1));
  };
  function w(k, L) {
    y(), i.scrollElement = k, i.contentElement = L, getComputedStyle(k).overflow === "visible" && (k.style.overflow = "auto"), k.addEventListener("scroll", _, { passive: !0 }), k.addEventListener("wheel", S, { passive: !0 });
    let R;
    i.resizeObserver = new ResizeObserver((z) => {
      const D = z[0];
      if (!D)
        return;
      const { height: M } = D.contentRect, X = M - (R ?? M);
      if (i.resizeDifference = X, o() > l() && a(l()), g(h()), X >= 0) {
        const V = rn(
          e,
          R ? e.resize : e.initial
        );
        b({
          animation: V,
          wait: !0,
          preserveScrollPosition: !0,
          duration: V === "instant" ? void 0 : Gr
        });
      } else
        h() && (f(!1), p(!0));
      R = M, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === X && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(L);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", _), i.scrollElement.removeEventListener("wheel", S)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function x() {
    y(), t.clear();
  }
  function C(k) {
    e = { ...e, ...k };
  }
  function b(k = {}) {
    const L = typeof k == "string" ? { animation: k } : k;
    L.preserveScrollPosition || p(!0);
    const R = Date.now() + (Number(L.wait) || 0), z = rn(e, L.animation), { ignoreEscapes: D = !1 } = L;
    let M, X = c();
    L.duration instanceof Promise ? L.duration.finally(() => {
      M = Date.now();
    }) : M = R + (L.duration ?? 0);
    const V = async () => {
      const G = new Promise((ee) => {
        if (typeof requestAnimationFrame > "u") {
          ee(!1);
          return;
        }
        requestAnimationFrame(() => ee(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const ee = o(), ue = typeof performance < "u" ? performance.now() : Date.now(), Qe = (ue - (i.lastTick ?? ue)) / Yr;
        if (i.animation ||= { behavior: z, promise: G, ignoreEscapes: D }, i.animation.behavior === z && (i.lastTick = ue), v() || R > Date.now())
          return V();
        if (ee < Math.min(X, c())) {
          if (i.animation?.behavior === z) {
            if (z === "instant")
              return a(c()), V();
            const be = z;
            i.velocity = (be.damping * i.velocity + be.stiffness * d()) / be.mass, i.accumulated += i.velocity * Qe;
            const et = o();
            a(et + i.accumulated), o() !== et && (i.accumulated = 0);
          }
          return V();
        }
        return M > Date.now() ? (X = c(), V()) : (i.animation = void 0, o() < c() ? b({
          animation: rn(e, e.resize),
          ignoreEscapes: D,
          duration: Math.max(0, M - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return G.then((ee) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ee));
    };
    return L.wait !== !0 && (i.animation = void 0), i.animation?.behavior === z ? i.animation.promise : V();
  }
  const O = () => {
    f(!0), p(!1);
  };
  function T(k) {
    return t.add(k), () => t.delete(k);
  }
  return {
    attach: w,
    detach: y,
    destroy: x,
    setOptions: C,
    getState: r,
    onChange: T,
    scrollToBottom: b,
    stopScroll: O
  };
}
function Qr(n = {}) {
  const e = A(null), t = A(null), i = A(n.initial !== !1), s = A(!1), r = A(!1), o = Zr(n);
  let a = null;
  return ye((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, r.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), wt(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: i,
    isNearBottom: s,
    escapedFromLock: r,
    scrollToBottom: (l) => o.scrollToBottom(l),
    stopScroll: () => o.stopScroll(),
    setOptions: (l) => o.setOptions(l)
  };
}
const eo = /* @__PURE__ */ F({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (E(), W("span", {
      class: "speaker-indicator",
      style: lt({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Ui = /* @__PURE__ */ oe(eo, [["__scopeId", "data-v-9bffeda8"]]), to = { class: "speaker-label" }, no = {
  key: 1,
  class: "speaker-name"
}, io = ["datetime"], so = /* @__PURE__ */ F({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = Ae(), s = P(
      () => Ln(e.language, i.value, t("language.wildcard"))
    ), r = P(
      () => e.startTime != null ? Mt(e.startTime) : null
    ), o = P(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = P(() => e.speaker?.color ?? "transparent");
    return (l, u) => (E(), W("div", to, [
      n.speaker ? (E(), q(Ui, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (E(), W("span", no, Y(n.speaker.name), 1)) : K("", !0),
      r.value ? (E(), W("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, Y(r.value), 9, io)) : K("", !0),
      B(wn, null, {
        default: I(() => [
          de(Y(s.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), ro = /* @__PURE__ */ oe(so, [["__scopeId", "data-v-0fb7fa1e"]]), oo = ["data-turn-active"], ao = { class: "turn-text" }, lo = ["data-word-active"], uo = /* @__PURE__ */ F({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Je(), i = P(() => e.turn.words.length > 0), s = P(() => {
      if (!t.audio?.src.value || !i.value) return null;
      const a = t.audio.currentTime.value, { startTime: l, endTime: u, words: c } = e.turn;
      return l == null || u == null || a < l || a > u ? null : yr(c, a);
    }), r = P(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || zi(e.turn.words)) return !1;
      const a = t.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), o = P(() => e.speaker?.color ?? "transparent");
    return (a, l) => (E(), W("section", {
      class: Rt(["turn", { "turn--active": r.value, "turn--partial": n.partial }]),
      "data-turn-active": r.value || n.partial || n.live || void 0,
      style: lt({ "--speaker-color": o.value })
    }, [
      n.partial ? K("", !0) : (E(), q(ro, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      H("p", ao, [
        i.value ? (E(!0), W(ve, { key: 0 }, Ye(n.turn.words, (u, c) => (E(), W(ve, {
          key: u.id
        }, [
          H("span", {
            class: Rt({ "word--active": u.id === s.value }),
            "data-word-active": u.id === s.value || void 0
          }, Y(u.text), 11, lo),
          de(Y(c < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), W(ve, { key: 1 }, [
          de(Y(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, oo));
  }
}), ni = /* @__PURE__ */ oe(uo, [["__scopeId", "data-v-e8530a49"]]), co = {}, fo = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function po(n, e) {
  return E(), W("svg", fo, [...e[0] || (e[0] = [
    Ns('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const ho = /* @__PURE__ */ oe(co, [["render", po]]), mo = { class: "transcription-empty" }, vo = { class: "message" }, go = /* @__PURE__ */ F({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = Ae();
    return (t, i) => (E(), W("div", mo, [
      B(ho, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      H("p", vo, Y(m(e)("transcription.empty")), 1)
    ]));
  }
}), yo = /* @__PURE__ */ oe(go, [["__scopeId", "data-v-f82737e5"]]), bo = { class: "transcription-panel" }, wo = {
  ref: "scrollContainer",
  class: "scroll-container"
}, So = { class: "turns-container" }, Co = {
  key: 0,
  class: "history-loading",
  role: "status"
}, xo = {
  key: 1,
  class: "history-start"
}, _o = /* @__PURE__ */ F({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = Ae(), i = Je(), s = mt("scrollContainer"), r = P(() => {
      const S = i.live?.partial.value ?? null;
      return S === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: S,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = P(() => i.live?.hasLiveUpdate.value ?? !1), a = P(() => i.audio?.isPlaying.value ?? !1), l = P(
      () => i.activeChannel.value.activeTranslation.value
    ), u = P(() => i.activeChannel.value), c = P(
      () => u.value.isLoadingHistory.value
    ), d = P(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: p, isAtBottom: f, scrollToBottom: g } = Qr();
    re(() => {
      h.value = s.value, p.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const v = mr(() => {
      const S = u.value;
      S.hasMoreHistory.value && (S.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function _() {
      const S = s.value;
      S && S.scrollTop < 100 && v();
    }
    return Z(
      () => e.turns,
      (S, w) => {
        const y = S.length, x = w.length;
        if (y > x && !f.value && S[0]?.id != w[0]?.id) {
          const C = y - x, b = e.turns[C]?.id;
          if (!b || !h.value) return;
          se(() => {
            h.value?.querySelector(
              `[data-turn-id="${b}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), re(() => {
      s.value?.addEventListener("scroll", _, {
        passive: !0
      });
    }), wt(() => {
      s.value?.removeEventListener("scroll", _);
    }), (S, w) => (E(), W("article", bo, [
      H("div", wo, [
        H("div", So, [
          c.value ? (E(), W("div", Co, [...w[1] || (w[1] = [
            H("progress", null, null, -1)
          ])])) : K("", !0),
          !d.value && n.turns.length > 0 ? (E(), W("div", xo, Y(m(t)("transcription.historyStart")), 1)) : K("", !0),
          n.turns.length === 0 && !c.value && !r.value ? (E(), q(yo, {
            key: 2,
            class: "transcription-empty"
          })) : K("", !0),
          (E(!0), W(ve, null, Ye(n.turns, (y, x) => (E(), q(ni, {
            "data-turn-id": y.id,
            key: y.id,
            turn: y,
            speaker: y.speakerId ? n.speakers.get(y.speakerId) : void 0,
            live: o.value && !r.value && x === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          r.value ? (E(), q(ni, {
            key: "__partial__",
            turn: r.value,
            partial: ""
          }, null, 8, ["turn"])) : K("", !0)
        ]),
        B(Ws, { name: "fade-slide" }, {
          default: I(() => [
            !m(f) && (a.value || o.value) ? (E(), q(_e, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": m(t)("transcription.resumeScroll"),
              onClick: w[0] || (w[0] = (y) => m(g)())
            }, {
              icon: I(() => [
                B(m(_r), { size: 14 })
              ]),
              default: I(() => [
                de(" " + Y(m(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : K("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Eo = /* @__PURE__ */ oe(_o, [["__scopeId", "data-v-1b44d24d"]]), ko = { class: "switch" }, To = ["id", "checked"], Po = ["for"], Ao = /* @__PURE__ */ F({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = t.id ?? Hs();
    return (r, o) => (E(), W("div", ko, [
      H("input", {
        type: "checkbox",
        id: m(s),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, To),
      H("label", { for: m(s) }, [...o[1] || (o[1] = [
        H("div", { class: "switch-slider" }, null, -1)
      ])], 8, Po)
    ]));
  }
}), Oo = /* @__PURE__ */ oe(Ao, [["__scopeId", "data-v-2aa0332f"]]), Io = "(max-width: 767px)";
function Ki() {
  const n = A(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return re(() => {
    e = window.matchMedia(Io), n.value = e.matches, e.addEventListener("change", t);
  }), wt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function ii(n) {
  return typeof n == "string" ? `'${n}'` : new Do().serialize(n);
}
const Do = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, i) {
      const s = typeof t, r = typeof i;
      return s === "string" && r === "string" ? t.localeCompare(i) : s === "number" && r === "number" ? t - i : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(i, !0));
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
      const s = t.constructor, r = s === Object || s === void 0 ? "" : s.name;
      if (r !== "" && globalThis[r] === s) return this.serializeBuiltInType(r, t);
      if (typeof t.toJSON == "function") {
        const o = t.toJSON();
        return r + (o !== null && typeof o == "object" ? this.$object(o) : `(${this.serialize(o)})`);
      }
      return this.serializeObjectEntries(r, Object.entries(t));
    }
    serializeBuiltInType(t, i) {
      const s = this["$" + t];
      if (s) return s.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(t, i.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, i) {
      const s = Array.from(i).sort((o, a) => this.compare(o[0], a[0]));
      let r = `${t}{`;
      for (let o = 0; o < s.length; o++) {
        const [a, l] = s[o];
        r += `${this.serialize(a, !0)}:${this.serialize(l)}`, o < s.length - 1 && (r += ",");
      }
      return r + "}";
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
      for (let s = 0; s < t.length; s++) i += this.serialize(t[s]), s < t.length - 1 && (i += ",");
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
      return `Set${this.$Array(Array.from(t).sort((i, s) => this.compare(i, s)))}`;
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
function $t(n, e) {
  return n === e || ii(n) === ii(e);
}
function Lo(n, e, t) {
  const i = n.findIndex((a) => $t(a, e)), s = n.findIndex((a) => $t(a, t));
  if (i === -1 || s === -1) return [];
  const [r, o] = [i, s].sort((a, l) => a - l);
  return n.slice(r, o + 1);
}
function si(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function Oe(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(o) => {
    const a = Wt(i, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Ht(i, o), o)];
}
function ge() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Vt(n, e, t) {
  const i = t.originalEvent.target, s = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && i.addEventListener(n, e, { once: !0 }), i.dispatchEvent(s);
}
function Sn(n) {
  return n == null;
}
function Rn(n) {
  return n ? n.flatMap((e) => e.type === ve ? Rn(e.children) : [e]) : [];
}
const [jt] = Oe("ConfigProvider");
function Ro(n, e) {
  var t;
  const i = ot();
  return ye(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), js(i);
}
function Ut(n, e) {
  return Di() ? (Li(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function on() {
  const n = /* @__PURE__ */ new Set(), e = (r) => {
    n.delete(r);
  };
  return {
    on: (r) => {
      n.add(r);
      const o = () => e(r);
      return Ut(o), { off: o };
    },
    off: e,
    trigger: (...r) => Promise.all(Array.from(n).map((o) => o(...r))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Mo(n) {
  let e = !1, t;
  const i = Ri(!0);
  return ((...s) => (e || (t = i.run(() => n(...s)), e = !0), t));
}
const $e = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const $o = (n) => typeof n < "u", Bo = Object.prototype.toString, qo = (n) => Bo.call(n) === "[object Object]", ri = /* @__PURE__ */ Fo();
function Fo() {
  var n, e, t;
  return $e && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function an(n) {
  return Array.isArray(n) ? n : [n];
}
function zo(n) {
  return Ge();
}
// @__NO_SIDE_EFFECTS__
function No(n) {
  if (!$e) return n;
  let e = 0, t, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...r) => (e += 1, i || (i = Ri(!0), t = i.run(() => n(...r))), Ut(s), t));
}
function Xi(n, e = 1e4) {
  return Vs((t, i) => {
    let s = le(n), r;
    const o = () => setTimeout(() => {
      s = le(n), i();
    }, le(e));
    return Ut(() => {
      clearTimeout(r);
    }), {
      get() {
        return t(), s;
      },
      set(a) {
        s = a, i(), clearTimeout(r), r = o();
      }
    };
  });
}
function Wo(n, e) {
  zo() && wt(n, e);
}
function Ho(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const Kt = $e ? window : void 0;
function Te(n) {
  var e;
  const t = le(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Yi(...n) {
  const e = (i, s, r, o) => (i.addEventListener(s, r, o), () => i.removeEventListener(s, r, o)), t = P(() => {
    const i = an(le(n[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return Ho(() => {
    var i, s;
    return [
      (i = (s = t.value) === null || s === void 0 ? void 0 : s.map((r) => Te(r))) !== null && i !== void 0 ? i : [Kt].filter((r) => r != null),
      an(le(t.value ? n[1] : n[0])),
      an(m(t.value ? n[2] : n[1])),
      le(t.value ? n[3] : n[2])
    ];
  }, ([i, s, r, o], a, l) => {
    if (!i?.length || !s?.length || !r?.length) return;
    const u = qo(o) ? { ...o } : o, c = i.flatMap((d) => s.flatMap((h) => r.map((p) => e(d, h, p, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Gi() {
  const n = ot(!1), e = Ge();
  return e && re(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function Vo(n) {
  const e = /* @__PURE__ */ Gi();
  return P(() => (e.value, !!n()));
}
function jo(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Uo(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: s = Kt, eventName: r = "keydown", passive: o = !1, dedupe: a = !1 } = i, l = jo(e);
  return Yi(s, r, (c) => {
    c.repeat && le(a) || l(c) && t(c);
  }, o);
}
function Ko(n) {
  return JSON.parse(JSON.stringify(n));
}
function Xo(n, e, t = {}) {
  const { window: i = Kt, ...s } = t;
  let r;
  const o = /* @__PURE__ */ Vo(() => i && "ResizeObserver" in i), a = () => {
    r && (r.disconnect(), r = void 0);
  }, l = Z(P(() => {
    const c = le(n);
    return Array.isArray(c) ? c.map((d) => Te(d)) : [Te(c)];
  }), (c) => {
    if (a(), o.value && i) {
      r = new ResizeObserver(e);
      for (const d of c) d && r.observe(d, s);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Ut(u), {
    isSupported: o,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function Bt(n, e, t, i = {}) {
  var s, r;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Ge(), p = t || h?.emit || (h == null || (s = h.$emit) === null || s === void 0 ? void 0 : s.bind(h)) || (h == null || (r = h.proxy) === null || r === void 0 || (r = r.$emit) === null || r === void 0 ? void 0 : r.bind(h?.proxy));
  let f = l;
  e || (e = "modelValue"), f = f || `update:${e.toString()}`;
  const g = (S) => o ? typeof o == "function" ? o(S) : Ko(S) : S, v = () => $o(n[e]) ? g(n[e]) : c, _ = (S) => {
    d ? d(S) && p(f, S) : p(f, S);
  };
  if (a) {
    const S = A(v());
    let w = !1;
    return Z(() => n[e], (y) => {
      w || (w = !0, S.value = g(y), se(() => w = !1));
    }), Z(S, (y) => {
      !w && (y !== n[e] || u) && _(y);
    }, { deep: u }), S;
  } else return P({
    get() {
      return v();
    },
    set(S) {
      _(S);
    }
  });
}
function ln(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Cn(n, e, t = ".", i) {
  if (!ln(e))
    return Cn(n, {}, t, i);
  const s = Object.assign({}, e);
  for (const r in n) {
    if (r === "__proto__" || r === "constructor")
      continue;
    const o = n[r];
    o != null && (i && i(s, r, o, t) || (Array.isArray(o) && Array.isArray(s[r]) ? s[r] = [...o, ...s[r]] : ln(o) && ln(s[r]) ? s[r] = Cn(
      o,
      s[r],
      (t ? `${t}.` : "") + r.toString(),
      i
    ) : s[r] = o));
  }
  return s;
}
function Yo(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => Cn(t, i, "", n), {})
  );
}
const Go = Yo(), Jo = /* @__PURE__ */ No(() => {
  const n = A(/* @__PURE__ */ new Map()), e = A(), t = P(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), i = jt({ scrollBody: A(!0) });
  let s = null;
  const r = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ri && s?.(), e.value = void 0;
  };
  return Z(t, (o, a) => {
    if (!$e) return;
    if (!o) {
      a && r();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Go({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ri && (s = Yi(document, "touchmove", (d) => Zo(d), { passive: !1 })), se(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function Ji(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Jo();
  t.value.set(e, n ?? !1);
  const i = P({
    get: () => t.value.get(e) ?? !1,
    set: (s) => t.value.set(e, s)
  });
  return Wo(() => {
    t.value.delete(e);
  }), i;
}
function Zi(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Zi(t);
  }
}
function Zo(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && Zi(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Qi(n) {
  const e = jt({ dir: A("ltr") });
  return P(() => n?.value || e.dir?.value || "ltr");
}
function Xt(n) {
  const e = Ge(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((s) => {
    i[Us(Mi(s))] = (...r) => n(s, ...r);
  }), i;
}
let un = 0;
function Qo() {
  ye((n) => {
    if (!$e) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? oi()), document.body.insertAdjacentElement("beforeend", e[1] ?? oi()), un++, n(() => {
      un === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), un--;
    });
  });
}
function oi() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function es(n) {
  return P(() => le(n) ? !!Te(n)?.closest("form") : !0);
}
function ie() {
  const n = Ge(), e = A(), t = P(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Te(e)), i = Object.assign({}, n.exposed), s = {};
  for (const o in n.props) Object.defineProperty(s, o, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[o]
  });
  if (Object.keys(i).length > 0) for (const o in i) Object.defineProperty(s, o, {
    enumerable: !0,
    configurable: !0,
    get: () => i[o]
  });
  Object.defineProperty(s, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = s;
  function r(o) {
    if (e.value = o, !!o && (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => o instanceof Element ? o : o.$el
    }), !(o instanceof Element) && !Object.hasOwn(o, "$el"))) {
      const a = o.$.exposed, l = Object.assign({}, s);
      for (const u in a) Object.defineProperty(l, u, {
        enumerable: !0,
        configurable: !0,
        get: () => a[u]
      });
      n.exposed = l;
    }
  }
  return {
    forwardRef: r,
    currentRef: e,
    currentElement: t
  };
}
function Mn(n) {
  const e = Ge(), t = Object.keys(e?.type.props ?? {}).reduce((s, r) => {
    const o = (e?.type.props[r]).default;
    return o !== void 0 && (s[r] = o), s;
  }, {}), i = At(n);
  return P(() => {
    const s = {}, r = e?.vnode.props ?? {};
    return Object.keys(r).forEach((o) => {
      s[Mi(o)] = r[o];
    }), Object.keys({
      ...t,
      ...s
    }).reduce((o, a) => (i.value[a] !== void 0 && (o[a] = i.value[a]), o), {});
  });
}
function ea(n, e) {
  const t = Mn(n), i = e ? Xt(e) : {};
  return P(() => ({
    ...t.value,
    ...i
  }));
}
var ta = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, nt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), Et = {}, cn = 0, ts = function(n) {
  return n && (n.host || ts(n.parentNode));
}, na = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = ts(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, ia = function(n, e, t, i) {
  var s = na(e, Array.isArray(n) ? n : [n]);
  Et[t] || (Et[t] = /* @__PURE__ */ new WeakMap());
  var r = Et[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(s), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  s.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var p = h.getAttribute(i), f = p !== null && p !== "false", g = (nt.get(h) || 0) + 1, v = (r.get(h) || 0) + 1;
          nt.set(h, g), r.set(h, v), o.push(h), g === 1 && f && _t.set(h, !0), v === 1 && h.setAttribute(t, "true"), f || h.setAttribute(i, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", h, _);
        }
    });
  };
  return c(e), a.clear(), cn++, function() {
    o.forEach(function(d) {
      var h = nt.get(d) - 1, p = r.get(d) - 1;
      nt.set(d, h), r.set(d, p), h || (_t.has(d) || d.removeAttribute(i), _t.delete(d)), p || d.removeAttribute(t);
    }), cn--, cn || (nt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ new WeakMap(), Et = {});
  };
}, sa = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), s = ta(n);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), ia(i, s, t, "aria-hidden")) : function() {
    return null;
  };
};
function ns(n) {
  let e;
  Z(() => Te(n), (t) => {
    t ? e = sa(t) : e && e();
  }), St(() => {
    e && e();
  });
}
let ra = 0;
function vt(n, e = "reka") {
  if ("useId" in Kn) return `${e}-${Kn.useId?.()}`;
  const t = jt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++ra}`;
}
function oa() {
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
function aa(n) {
  const e = A(), t = P(() => e.value?.width ?? 0), i = P(() => e.value?.height ?? 0);
  return re(() => {
    const s = Te(n);
    if (s) {
      e.value = {
        width: s.offsetWidth,
        height: s.offsetHeight
      };
      const r = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
        let l, u;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          l = d.inlineSize, u = d.blockSize;
        } else
          l = s.offsetWidth, u = s.offsetHeight;
        e.value = {
          width: l,
          height: u
        };
      });
      return r.observe(s, { box: "border-box" }), () => r.unobserve(s);
    } else e.value = void 0;
  }), {
    width: t,
    height: i
  };
}
function la(n, e) {
  const t = A(n);
  function i(r) {
    return e[t.value][r] ?? t.value;
  }
  return {
    state: t,
    dispatch: (r) => {
      t.value = i(r);
    }
  };
}
function $n(n) {
  const e = Xi("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (s, r) => {
      e.value = e.value + s;
      {
        const o = ge(), a = r.map((h) => ({
          ...h,
          textValue: h.value?.textValue ?? h.ref.textContent?.trim() ?? ""
        })), l = a.find((h) => h.ref === o), u = a.map((h) => h.textValue), c = ca(u, e.value, l?.textValue), d = a.find((h) => h.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function ua(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function ca(n, e, t) {
  const s = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, r = t ? n.indexOf(t) : -1;
  let o = ua(n, Math.max(r, 0));
  s.length === 1 && (o = o.filter((u) => u !== t));
  const l = o.find((u) => u.toLowerCase().startsWith(s.toLowerCase()));
  return l !== t ? l : void 0;
}
function da(n, e) {
  const t = A({}), i = A("none"), s = A(n), r = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Kt, { state: l, dispatch: u } = la(r, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (v) => {
    if ($e) {
      const _ = new CustomEvent(v, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(_);
    }
  };
  Z(n, async (v, _) => {
    const S = _ !== v;
    if (await se(), S) {
      const w = i.value, y = kt(e.value);
      v ? (u("MOUNT"), c("enter"), y === "none" && c("after-enter")) : y === "none" || y === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : _ && w !== y ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (v) => {
    const _ = kt(e.value), S = _.includes(CSS.escape(v.animationName)), w = l.value === "mounted" ? "enter" : "leave";
    if (v.target === e.value && S && (c(`after-${w}`), u("ANIMATION_END"), !s.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    v.target === e.value && _ === "none" && u("ANIMATION_END");
  }, h = (v) => {
    v.target === e.value && (i.value = kt(e.value));
  }, p = Z(e, (v, _) => {
    v ? (t.value = getComputedStyle(v), v.addEventListener("animationstart", h), v.addEventListener("animationcancel", d), v.addEventListener("animationend", d)) : (u("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), _?.removeEventListener("animationstart", h), _?.removeEventListener("animationcancel", d), _?.removeEventListener("animationend", d));
  }, { immediate: !0 }), f = Z(l, () => {
    const v = kt(e.value);
    i.value = l.value === "mounted" ? v : "none";
  });
  return St(() => {
    p(), f();
  }), { isPresent: P(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function kt(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Bn = F({
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
    const { present: i, forceMount: s } = ut(n), r = A(), { isPresent: o } = da(i, r);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = Rn(a || []);
    const l = Ge();
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
    return () => s.value || i.value || o.value ? Le(e.default({ present: o.value })[0], { ref: (u) => {
      const c = Te(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? r.value = c.firstElementChild : r.value = c), c;
    } }) : null;
  }
});
const xn = F({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Rn(t.default()), s = i.findIndex((l) => l.type !== Ks);
      if (s === -1) return i;
      const r = i[s];
      delete r.props?.ref;
      const o = r.props ? Q(e, r.props) : e, a = Xs({
        ...r,
        props: {}
      }, o);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), fa = [
  "area",
  "img",
  "input"
], ne = F({
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
    return typeof i == "string" && fa.includes(i) ? () => Le(i, e) : i !== "template" ? () => Le(n.as, e, { default: t.default }) : () => Le(xn, e, { default: t.default });
  }
});
function qt() {
  const n = A(), e = P(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Te(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Ne, pa] = Oe("DialogRoot");
var ha = /* @__PURE__ */ F({
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
    const t = n, s = /* @__PURE__ */ Bt(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), r = A(), o = A(), { modal: a } = ut(t);
    return pa({
      open: s,
      modal: a,
      openModal: () => {
        s.value = !0;
      },
      onOpenChange: (l) => {
        s.value = l;
      },
      onOpenToggle: () => {
        s.value = !s.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: r,
      contentElement: o
    }), (l, u) => j(l.$slots, "default", {
      open: m(s),
      close: () => s.value = !1
    });
  }
}), is = ha, ma = /* @__PURE__ */ F({
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
    ie();
    const t = Ne();
    return (i, s) => (E(), q(m(ne), Q(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (r) => m(t).onOpenChange(!1))
    }), {
      default: I(() => [j(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), va = ma;
const ga = "dismissableLayer.pointerDownOutside", ya = "dismissableLayer.focusOutside";
function ss(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), s = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || s.indexOf(i) < s.indexOf(t)));
}
function ba(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1), r = A(() => {
  });
  return ye((o) => {
    if (!$e || !le(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (ss(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let h = function() {
            Vt(ga, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", r.value), r.value = h, i.addEventListener("click", r.value, { once: !0 })) : h();
        } else i.removeEventListener("click", r.value);
        s.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", r.value);
    });
  }), { onPointerDownCapture: () => {
    le(t) && (s.value = !0);
  } };
}
function wa(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1);
  return ye((r) => {
    if (!$e || !le(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await se(), await se();
      const l = a.target;
      !e.value || !l || ss(e.value, l) || a.target && !s.value && Vt(ya, n, { originalEvent: a });
    };
    i.addEventListener("focusin", o), r(() => i.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      le(t) && (s.value = !0);
    },
    onBlurCapture: () => {
      le(t) && (s.value = !1);
    }
  };
}
const me = $i({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Sa = /* @__PURE__ */ F({
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
    const t = n, i = e, { forwardRef: s, currentElement: r } = ie(), o = P(() => r.value?.ownerDocument ?? globalThis.document), a = P(() => me.layersRoot), l = P(() => r.value ? Array.from(a.value).indexOf(r.value) : -1), u = P(() => me.layersWithOutsidePointerEventsDisabled.size > 0), c = P(() => {
      const p = Array.from(a.value), [f] = [...me.layersWithOutsidePointerEventsDisabled].slice(-1), g = p.indexOf(f);
      return l.value >= g;
    }), d = ba(async (p) => {
      const f = [...me.branches].some((g) => g?.contains(p.target));
      !c.value || f || (i("pointerDownOutside", p), i("interactOutside", p), await se(), p.defaultPrevented || i("dismiss"));
    }, r), h = wa((p) => {
      [...me.branches].some((g) => g?.contains(p.target)) || (i("focusOutside", p), i("interactOutside", p), p.defaultPrevented || i("dismiss"));
    }, r);
    return Uo("Escape", (p) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", p), p.defaultPrevented || i("dismiss"));
    }), ye((p) => {
      r.value && (t.disableOutsidePointerEvents && (me.layersWithOutsidePointerEventsDisabled.size === 0 && (me.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), me.layersWithOutsidePointerEventsDisabled.add(r.value)), a.value.add(r.value), p(() => {
        t.disableOutsidePointerEvents && me.layersWithOutsidePointerEventsDisabled.size === 1 && !Sn(me.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = me.originalBodyPointerEvents);
      }));
    }), ye((p) => {
      p(() => {
        r.value && (a.value.delete(r.value), me.layersWithOutsidePointerEventsDisabled.delete(r.value));
      });
    }), (p, f) => (E(), q(m(ne), {
      ref: m(s),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: lt({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: m(h).onFocusCapture,
      onBlurCapture: m(h).onBlurCapture,
      onPointerdownCapture: m(d).onPointerDownCapture
    }, {
      default: I(() => [j(p.$slots, "default")]),
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
}), rs = Sa;
const Ca = /* @__PURE__ */ Mo(() => A([]));
function xa() {
  const n = Ca();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = ai(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = ai(n.value, e), n.value[0]?.resume();
    }
  };
}
function ai(n, e) {
  const t = [...n], i = t.indexOf(e);
  return i !== -1 && t.splice(i, 1), t;
}
const dn = "focusScope.autoFocusOnMount", fn = "focusScope.autoFocusOnUnmount", li = {
  bubbles: !1,
  cancelable: !0
};
function _a(n, { select: e = !1 } = {}) {
  const t = ge();
  for (const i of n)
    if (Be(i, { select: e }), ge() !== t) return !0;
}
function Ea(n) {
  const e = os(n), t = ui(e, n), i = ui(e.reverse(), n);
  return [t, i];
}
function os(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function ui(n, e) {
  for (const t of n) if (!ka(t, { upTo: e })) return t;
}
function ka(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Ta(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Be(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = ge();
    n.focus({ preventScroll: !0 }), n !== t && Ta(n) && e && n.select();
  }
}
var Pa = /* @__PURE__ */ F({
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
    const t = n, i = e, { currentRef: s, currentElement: r } = ie(), o = A(null), a = xa(), l = $i({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    ye((c) => {
      if (!$e) return;
      const d = r.value;
      if (!t.trapped) return;
      function h(v) {
        if (l.paused || !d) return;
        const _ = v.target;
        d.contains(_) ? o.value = _ : Be(o.value, { select: !0 });
      }
      function p(v) {
        if (l.paused || !d) return;
        const _ = v.relatedTarget;
        _ !== null && (d.contains(_) || Be(o.value, { select: !0 }));
      }
      function f(v) {
        d.contains(o.value) || Be(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", p);
      const g = new MutationObserver(f);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", p), g.disconnect();
      });
    }), ye(async (c) => {
      const d = r.value;
      if (await se(), !d) return;
      a.add(l);
      const h = ge();
      if (!d.contains(h)) {
        const f = new CustomEvent(dn, li);
        d.addEventListener(dn, (g) => i("mountAutoFocus", g)), d.dispatchEvent(f), f.defaultPrevented || (_a(os(d), { select: !0 }), ge() === h && Be(d));
      }
      c(() => {
        d.removeEventListener(dn, (v) => i("mountAutoFocus", v));
        const f = new CustomEvent(fn, li), g = (v) => {
          i("unmountAutoFocus", v);
        };
        d.addEventListener(fn, g), d.dispatchEvent(f), setTimeout(() => {
          f.defaultPrevented || Be(h ?? document.body, { select: !0 }), d.removeEventListener(fn, g), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = ge();
      if (d && h) {
        const p = c.currentTarget, [f, g] = Ea(p);
        f && g ? !c.shiftKey && h === g ? (c.preventDefault(), t.loop && Be(f, { select: !0 })) : c.shiftKey && h === f && (c.preventDefault(), t.loop && Be(g, { select: !0 })) : h === p && c.preventDefault();
      }
    }
    return (c, d) => (E(), q(m(ne), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: I(() => [j(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), as = Pa;
function Aa(n) {
  return n ? "open" : "closed";
}
function ci(n) {
  const e = ge();
  for (const t of n)
    if (t === e || (t.focus(), ge() !== e)) return;
}
const Oa = "DialogTitle", Ia = "DialogContent";
function Da({ titleName: n = Oa, contentName: e = Ia, componentLink: t = "dialog.html#title", titleId: i, descriptionId: s, contentElement: r }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  re(() => {
    document.getElementById(i) || console.warn(o);
    const u = r.value?.getAttribute("aria-describedby");
    s && u && (document.getElementById(s) || console.warn(a));
  });
}
var La = /* @__PURE__ */ F({
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
    const t = n, i = e, s = Ne(), { forwardRef: r, currentElement: o } = ie();
    return s.titleId ||= vt(void 0, "reka-dialog-title"), s.descriptionId ||= vt(void 0, "reka-dialog-description"), re(() => {
      s.contentElement = o, ge() !== document.body && (s.triggerElement.value = ge());
    }), process.env.NODE_ENV !== "production" && Da({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: s.titleId,
      descriptionId: s.descriptionId,
      contentElement: o
    }), (a, l) => (E(), q(m(as), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: I(() => [B(m(rs), Q({
        id: m(s).contentId,
        ref: m(r),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": m(s).descriptionId,
        "aria-labelledby": m(s).titleId,
        "data-state": m(Aa)(m(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => m(s).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: I(() => [j(a.$slots, "default")]),
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
}), ls = La, Ra = /* @__PURE__ */ F({
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
    const t = n, i = e, s = Ne(), r = Xt(i), { forwardRef: o, currentElement: a } = ie();
    return ns(a), (l, u) => (E(), q(ls, Q({
      ...t,
      ...m(r)
    }, {
      ref: m(o),
      "trap-focus": m(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), m(s).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || h) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: I(() => [j(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Ma = Ra, $a = /* @__PURE__ */ F({
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
    const t = n, s = Xt(e);
    ie();
    const r = Ne(), o = A(!1), a = A(!1);
    return (l, u) => (E(), q(ls, Q({
      ...t,
      ...m(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (o.value || m(r).triggerElement.value?.focus(), c.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (o.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        m(r).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: I(() => [j(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ba = $a, qa = /* @__PURE__ */ F({
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
    const t = n, i = e, s = Ne(), r = Xt(i), { forwardRef: o } = ie();
    return (a, l) => (E(), q(m(Bn), { present: a.forceMount || m(s).open.value }, {
      default: I(() => [m(s).modal.value ? (E(), q(Ma, Q({
        key: 0,
        ref: m(o)
      }, {
        ...t,
        ...m(r),
        ...a.$attrs
      }), {
        default: I(() => [j(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), q(Ba, Q({
        key: 1,
        ref: m(o)
      }, {
        ...t,
        ...m(r),
        ...a.$attrs
      }), {
        default: I(() => [j(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), us = qa, Fa = /* @__PURE__ */ F({
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
    const e = Ne();
    return Ji(!0), ie(), (t, i) => (E(), q(m(ne), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": m(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: I(() => [j(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), za = Fa, Na = /* @__PURE__ */ F({
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
    const e = Ne(), { forwardRef: t } = ie();
    return (i, s) => m(e)?.modal.value ? (E(), q(m(Bn), {
      key: 0,
      present: i.forceMount || m(e).open.value
    }, {
      default: I(() => [B(za, Q(i.$attrs, {
        ref: m(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: I(() => [j(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : K("v-if", !0);
  }
}), cs = Na, Wa = /* @__PURE__ */ F({
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
    const e = /* @__PURE__ */ Gi();
    return (t, i) => m(e) || t.forceMount ? (E(), q(Bi, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [j(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : K("v-if", !0);
  }
}), ds = Wa, Ha = /* @__PURE__ */ F({
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
    return (t, i) => (E(), q(m(ds), In(Dn(e)), {
      default: I(() => [j(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), fs = Ha, Va = /* @__PURE__ */ F({
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
    const e = n, t = Ne();
    return ie(), (i, s) => (E(), q(m(ne), Q(e, { id: m(t).titleId }), {
      default: I(() => [j(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), ps = Va;
const di = "data-reka-collection-item";
function We(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let s;
  if (t) {
    const c = A(/* @__PURE__ */ new Map());
    s = {
      collectionRef: A(),
      itemMap: c
    }, Ht(i, s);
  } else s = Wt(i);
  const r = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${di}]`)), f = Array.from(s.itemMap.value.values()).sort((g, v) => h.indexOf(g.ref) - h.indexOf(v.ref));
    return c ? f : f.filter((g) => g.ref.dataset.disabled !== "");
  }, o = F({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: p, currentElement: f } = qt();
      return Z(f, () => {
        s.collectionRef.value = f.value;
      }), () => Le(xn, {
        ref: p,
        ...h
      }, d);
    }
  }), a = F({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: p, currentElement: f } = qt();
      return ye((g) => {
        if (f.value) {
          const v = Ys(f.value);
          s.itemMap.value.set(v, {
            ref: f.value,
            value: c.value
          }), g(() => s.itemMap.value.delete(v));
        }
      }), () => Le(xn, {
        ...h,
        [di]: "",
        ref: p
      }, d);
    }
  }), l = P(() => Array.from(s.itemMap.value.values())), u = P(() => s.itemMap.value.size);
  return {
    getItems: r,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const ja = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ua(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Ka(n, e, t) {
  const i = Ua(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return ja[i];
}
var Xa = /* @__PURE__ */ F({
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
    return (e, t) => (E(), q(m(ne), {
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
      default: I(() => [j(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), hs = Xa, Ya = /* @__PURE__ */ F({
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
    const e = n, { primitiveElement: t, currentElement: i } = qt(), s = P(() => e.checked ?? e.value);
    return Z(s, (r, o) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && r !== o) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, r), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (r, o) => (E(), q(hs, Q({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...r.$attrs
    }, { as: "input" }), null, 16));
  }
}), fi = Ya, Ga = /* @__PURE__ */ F({
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
    const e = n, t = P(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = P(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((s, r) => typeof s == "object" ? Object.entries(s).map(([o, a]) => ({
      name: `${e.name}[${r}][${o}]`,
      value: a
    })) : {
      name: `${e.name}[${r}]`,
      value: s
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([s, r]) => ({
      name: `${e.name}[${s}]`,
      value: r
    })) : []);
    return (s, r) => (E(), W(ve, null, [K(" We render single input if it's required "), t.value ? (E(), q(fi, Q({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (E(!0), W(ve, { key: 1 }, Ye(i.value, (o) => (E(), q(fi, Q({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Ja = Ga;
const [ms, Za] = Oe("PopperRoot");
var Qa = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = A();
    return Za({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => j(t.$slots, "default");
  }
}), el = Qa, tl = /* @__PURE__ */ F({
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
    const e = n, { forwardRef: t, currentElement: i } = ie(), s = ms();
    return qi(() => {
      s.onAnchorChange(e.reference ?? i.value);
    }), (r, o) => (E(), q(m(ne), {
      ref: m(t),
      as: r.as,
      "as-child": r.asChild
    }, {
      default: I(() => [j(r.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), nl = tl;
function il(n) {
  return n !== null;
}
function sl(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: s } = e, o = s.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [u, c] = _n(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], h = (s.arrow?.x ?? 0) + a / 2, p = (s.arrow?.y ?? 0) + l / 2;
      let f = "", g = "";
      return u === "bottom" ? (f = o ? d : `${h}px`, g = `${-l}px`) : u === "top" ? (f = o ? d : `${h}px`, g = `${i.floating.height + l}px`) : u === "right" ? (f = `${-l}px`, g = o ? d : `${p}px`) : u === "left" && (f = `${i.floating.width + l}px`, g = o ? d : `${p}px`), { data: {
        x: f,
        y: g
      } };
    }
  };
}
function _n(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const rl = ["top", "right", "bottom", "left"], Fe = Math.min, fe = Math.max, Ft = Math.round, Tt = Math.floor, ke = (n) => ({
  x: n,
  y: n
}), ol = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, al = {
  start: "end",
  end: "start"
};
function En(n, e, t) {
  return fe(n, Fe(e, t));
}
function Re(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Me(n) {
  return n.split("-")[0];
}
function ct(n) {
  return n.split("-")[1];
}
function qn(n) {
  return n === "x" ? "y" : "x";
}
function Fn(n) {
  return n === "y" ? "height" : "width";
}
const ll = /* @__PURE__ */ new Set(["top", "bottom"]);
function Ee(n) {
  return ll.has(Me(n)) ? "y" : "x";
}
function zn(n) {
  return qn(Ee(n));
}
function ul(n, e, t) {
  t === void 0 && (t = !1);
  const i = ct(n), s = zn(n), r = Fn(s);
  let o = s === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[r] > e.floating[r] && (o = zt(o)), [o, zt(o)];
}
function cl(n) {
  const e = zt(n);
  return [kn(n), e, kn(e)];
}
function kn(n) {
  return n.replace(/start|end/g, (e) => al[e]);
}
const pi = ["left", "right"], hi = ["right", "left"], dl = ["top", "bottom"], fl = ["bottom", "top"];
function pl(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? hi : pi : e ? pi : hi;
    case "left":
    case "right":
      return e ? dl : fl;
    default:
      return [];
  }
}
function hl(n, e, t, i) {
  const s = ct(n);
  let r = pl(Me(n), t === "start", i);
  return s && (r = r.map((o) => o + "-" + s), e && (r = r.concat(r.map(kn)))), r;
}
function zt(n) {
  return n.replace(/left|right|bottom|top/g, (e) => ol[e]);
}
function ml(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function vs(n) {
  return typeof n != "number" ? ml(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Nt(n) {
  const {
    x: e,
    y: t,
    width: i,
    height: s
  } = n;
  return {
    width: i,
    height: s,
    top: t,
    left: e,
    right: e + i,
    bottom: t + s,
    x: e,
    y: t
  };
}
function mi(n, e, t) {
  let {
    reference: i,
    floating: s
  } = n;
  const r = Ee(e), o = zn(e), a = Fn(o), l = Me(e), u = r === "y", c = i.x + i.width / 2 - s.width / 2, d = i.y + i.height / 2 - s.height / 2, h = i[a] / 2 - s[a] / 2;
  let p;
  switch (l) {
    case "top":
      p = {
        x: c,
        y: i.y - s.height
      };
      break;
    case "bottom":
      p = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      p = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      p = {
        x: i.x - s.width,
        y: d
      };
      break;
    default:
      p = {
        x: i.x,
        y: i.y
      };
  }
  switch (ct(e)) {
    case "start":
      p[o] -= h * (t && u ? -1 : 1);
      break;
    case "end":
      p[o] += h * (t && u ? -1 : 1);
      break;
  }
  return p;
}
async function vl(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: i,
    y: s,
    platform: r,
    rects: o,
    elements: a,
    strategy: l
  } = n, {
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: h = !1,
    padding: p = 0
  } = Re(e, n), f = vs(p), v = a[h ? d === "floating" ? "reference" : "floating" : d], _ = Nt(await r.getClippingRect({
    element: (t = await (r.isElement == null ? void 0 : r.isElement(v))) == null || t ? v : v.contextElement || await (r.getDocumentElement == null ? void 0 : r.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), S = d === "floating" ? {
    x: i,
    y: s,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, w = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(a.floating)), y = await (r.isElement == null ? void 0 : r.isElement(w)) ? await (r.getScale == null ? void 0 : r.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, x = Nt(r.convertOffsetParentRelativeRectToViewportRelativeRect ? await r.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: w,
    strategy: l
  }) : S);
  return {
    top: (_.top - x.top + f.top) / y.y,
    bottom: (x.bottom - _.bottom + f.bottom) / y.y,
    left: (_.left - x.left + f.left) / y.x,
    right: (x.right - _.right + f.right) / y.x
  };
}
const gl = async (n, e, t) => {
  const {
    placement: i = "bottom",
    strategy: s = "absolute",
    middleware: r = [],
    platform: o
  } = t, a = r.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let u = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: s
  }), {
    x: c,
    y: d
  } = mi(u, i, l), h = i, p = {}, f = 0;
  for (let v = 0; v < a.length; v++) {
    var g;
    const {
      name: _,
      fn: S
    } = a[v], {
      x: w,
      y,
      data: x,
      reset: C
    } = await S({
      x: c,
      y: d,
      initialPlacement: i,
      placement: h,
      strategy: s,
      middlewareData: p,
      rects: u,
      platform: {
        ...o,
        detectOverflow: (g = o.detectOverflow) != null ? g : vl
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = w ?? c, d = y ?? d, p = {
      ...p,
      [_]: {
        ...p[_],
        ...x
      }
    }, C && f <= 50 && (f++, typeof C == "object" && (C.placement && (h = C.placement), C.rects && (u = C.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: s
    }) : C.rects), {
      x: c,
      y: d
    } = mi(u, h, l)), v = -1);
  }
  return {
    x: c,
    y: d,
    placement: h,
    strategy: s,
    middlewareData: p
  };
}, yl = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: i,
      placement: s,
      rects: r,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: u,
      padding: c = 0
    } = Re(n, e) || {};
    if (u == null)
      return {};
    const d = vs(c), h = {
      x: t,
      y: i
    }, p = zn(s), f = Fn(p), g = await o.getDimensions(u), v = p === "y", _ = v ? "top" : "left", S = v ? "bottom" : "right", w = v ? "clientHeight" : "clientWidth", y = r.reference[f] + r.reference[p] - h[p] - r.floating[f], x = h[p] - r.reference[p], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(u));
    let b = C ? C[w] : 0;
    (!b || !await (o.isElement == null ? void 0 : o.isElement(C))) && (b = a.floating[w] || r.floating[f]);
    const O = y / 2 - x / 2, T = b / 2 - g[f] / 2 - 1, k = Fe(d[_], T), L = Fe(d[S], T), R = k, z = b - g[f] - L, D = b / 2 - g[f] / 2 + O, M = En(R, D, z), X = !l.arrow && ct(s) != null && D !== M && r.reference[f] / 2 - (D < R ? k : L) - g[f] / 2 < 0, V = X ? D < R ? D - R : D - z : 0;
    return {
      [p]: h[p] + V,
      data: {
        [p]: M,
        centerOffset: D - M - V,
        ...X && {
          alignmentOffset: V
        }
      },
      reset: X
    };
  }
}), bl = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: s,
        middlewareData: r,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: h,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: f = "none",
        flipAlignment: g = !0,
        ...v
      } = Re(n, e);
      if ((t = r.arrow) != null && t.alignmentOffset)
        return {};
      const _ = Me(s), S = Ee(a), w = Me(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), x = h || (w || !g ? [zt(a)] : cl(a)), C = f !== "none";
      !h && C && x.push(...hl(a, g, f, y));
      const b = [a, ...x], O = await l.detectOverflow(e, v), T = [];
      let k = ((i = r.flip) == null ? void 0 : i.overflows) || [];
      if (c && T.push(O[_]), d) {
        const D = ul(s, o, y);
        T.push(O[D[0]], O[D[1]]);
      }
      if (k = [...k, {
        placement: s,
        overflows: T
      }], !T.every((D) => D <= 0)) {
        var L, R;
        const D = (((L = r.flip) == null ? void 0 : L.index) || 0) + 1, M = b[D];
        if (M && (!(d === "alignment" ? S !== Ee(M) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        k.every((G) => Ee(G.placement) === S ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: k
            },
            reset: {
              placement: M
            }
          };
        let X = (R = k.filter((V) => V.overflows[0] <= 0).sort((V, G) => V.overflows[1] - G.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!X)
          switch (p) {
            case "bestFit": {
              var z;
              const V = (z = k.filter((G) => {
                if (C) {
                  const ee = Ee(G.placement);
                  return ee === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ee === "y";
                }
                return !0;
              }).map((G) => [G.placement, G.overflows.filter((ee) => ee > 0).reduce((ee, ue) => ee + ue, 0)]).sort((G, ee) => G[1] - ee[1])[0]) == null ? void 0 : z[0];
              V && (X = V);
              break;
            }
            case "initialPlacement":
              X = a;
              break;
          }
        if (s !== X)
          return {
            reset: {
              placement: X
            }
          };
      }
      return {};
    }
  };
};
function vi(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function gi(n) {
  return rl.some((e) => n[e] >= 0);
}
const wl = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: i
      } = e, {
        strategy: s = "referenceHidden",
        ...r
      } = Re(n, e);
      switch (s) {
        case "referenceHidden": {
          const o = await i.detectOverflow(e, {
            ...r,
            elementContext: "reference"
          }), a = vi(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: gi(a)
            }
          };
        }
        case "escaped": {
          const o = await i.detectOverflow(e, {
            ...r,
            altBoundary: !0
          }), a = vi(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: gi(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, gs = /* @__PURE__ */ new Set(["left", "top"]);
async function Sl(n, e) {
  const {
    placement: t,
    platform: i,
    elements: s
  } = n, r = await (i.isRTL == null ? void 0 : i.isRTL(s.floating)), o = Me(t), a = ct(t), l = Ee(t) === "y", u = gs.has(o) ? -1 : 1, c = r && l ? -1 : 1, d = Re(e, n);
  let {
    mainAxis: h,
    crossAxis: p,
    alignmentAxis: f
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof f == "number" && (p = a === "end" ? f * -1 : f), l ? {
    x: p * c,
    y: h * u
  } : {
    x: h * u,
    y: p * c
  };
}
const Cl = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, i;
      const {
        x: s,
        y: r,
        placement: o,
        middlewareData: a
      } = e, l = await Sl(e, n);
      return o === ((t = a.offset) == null ? void 0 : t.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: s + l.x,
        y: r + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, xl = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: i,
        placement: s,
        platform: r
      } = e, {
        mainAxis: o = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (_) => {
            let {
              x: S,
              y: w
            } = _;
            return {
              x: S,
              y: w
            };
          }
        },
        ...u
      } = Re(n, e), c = {
        x: t,
        y: i
      }, d = await r.detectOverflow(e, u), h = Ee(Me(s)), p = qn(h);
      let f = c[p], g = c[h];
      if (o) {
        const _ = p === "y" ? "top" : "left", S = p === "y" ? "bottom" : "right", w = f + d[_], y = f - d[S];
        f = En(w, f, y);
      }
      if (a) {
        const _ = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", w = g + d[_], y = g - d[S];
        g = En(w, g, y);
      }
      const v = l.fn({
        ...e,
        [p]: f,
        [h]: g
      });
      return {
        ...v,
        data: {
          x: v.x - t,
          y: v.y - i,
          enabled: {
            [p]: o,
            [h]: a
          }
        }
      };
    }
  };
}, _l = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: i,
        placement: s,
        rects: r,
        middlewareData: o
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: u = !0
      } = Re(n, e), c = {
        x: t,
        y: i
      }, d = Ee(s), h = qn(d);
      let p = c[h], f = c[d];
      const g = Re(a, e), v = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const w = h === "y" ? "height" : "width", y = r.reference[h] - r.floating[w] + v.mainAxis, x = r.reference[h] + r.reference[w] - v.mainAxis;
        p < y ? p = y : p > x && (p = x);
      }
      if (u) {
        var _, S;
        const w = h === "y" ? "width" : "height", y = gs.has(Me(s)), x = r.reference[d] - r.floating[w] + (y && ((_ = o.offset) == null ? void 0 : _[d]) || 0) + (y ? 0 : v.crossAxis), C = r.reference[d] + r.reference[w] + (y ? 0 : ((S = o.offset) == null ? void 0 : S[d]) || 0) - (y ? v.crossAxis : 0);
        f < x ? f = x : f > C && (f = C);
      }
      return {
        [h]: p,
        [d]: f
      };
    }
  };
}, El = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: s,
        rects: r,
        platform: o,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...u
      } = Re(n, e), c = await o.detectOverflow(e, u), d = Me(s), h = ct(s), p = Ee(s) === "y", {
        width: f,
        height: g
      } = r.floating;
      let v, _;
      d === "top" || d === "bottom" ? (v = d, _ = h === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, v = h === "end" ? "top" : "bottom");
      const S = g - c.top - c.bottom, w = f - c.left - c.right, y = Fe(g - c[v], S), x = Fe(f - c[_], w), C = !e.middlewareData.shift;
      let b = y, O = x;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (O = w), (i = e.middlewareData.shift) != null && i.enabled.y && (b = S), C && !h) {
        const k = fe(c.left, 0), L = fe(c.right, 0), R = fe(c.top, 0), z = fe(c.bottom, 0);
        p ? O = f - 2 * (k !== 0 || L !== 0 ? k + L : fe(c.left, c.right)) : b = g - 2 * (R !== 0 || z !== 0 ? R + z : fe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: O,
        availableHeight: b
      });
      const T = await o.getDimensions(a.floating);
      return f !== T.width || g !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Yt() {
  return typeof window < "u";
}
function Ze(n) {
  return Nn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function pe(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ie(n) {
  var e;
  return (e = (Nn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Nn(n) {
  return Yt() ? n instanceof Node || n instanceof pe(n).Node : !1;
}
function Se(n) {
  return Yt() ? n instanceof Element || n instanceof pe(n).Element : !1;
}
function Pe(n) {
  return Yt() ? n instanceof HTMLElement || n instanceof pe(n).HTMLElement : !1;
}
function yi(n) {
  return !Yt() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof pe(n).ShadowRoot;
}
const kl = /* @__PURE__ */ new Set(["inline", "contents"]);
function Ct(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: s
  } = Ce(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !kl.has(s);
}
const Tl = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Pl(n) {
  return Tl.has(Ze(n));
}
const Al = [":popover-open", ":modal"];
function Gt(n) {
  return Al.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Ol = ["transform", "translate", "scale", "rotate", "perspective"], Il = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Dl = ["paint", "layout", "strict", "content"];
function Wn(n) {
  const e = Hn(), t = Se(n) ? Ce(n) : n;
  return Ol.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || Il.some((i) => (t.willChange || "").includes(i)) || Dl.some((i) => (t.contain || "").includes(i));
}
function Ll(n) {
  let e = ze(n);
  for (; Pe(e) && !at(e); ) {
    if (Wn(e))
      return e;
    if (Gt(e))
      return null;
    e = ze(e);
  }
  return null;
}
function Hn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Rl = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function at(n) {
  return Rl.has(Ze(n));
}
function Ce(n) {
  return pe(n).getComputedStyle(n);
}
function Jt(n) {
  return Se(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function ze(n) {
  if (Ze(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    yi(n) && n.host || // Fallback.
    Ie(n)
  );
  return yi(e) ? e.host : e;
}
function ys(n) {
  const e = ze(n);
  return at(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Pe(e) && Ct(e) ? e : ys(e);
}
function gt(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const s = ys(n), r = s === ((i = n.ownerDocument) == null ? void 0 : i.body), o = pe(s);
  if (r) {
    const a = Tn(o);
    return e.concat(o, o.visualViewport || [], Ct(s) ? s : [], a && t ? gt(a) : []);
  }
  return e.concat(s, gt(s, [], t));
}
function Tn(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function bs(n) {
  const e = Ce(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const s = Pe(n), r = s ? n.offsetWidth : t, o = s ? n.offsetHeight : i, a = Ft(t) !== r || Ft(i) !== o;
  return a && (t = r, i = o), {
    width: t,
    height: i,
    $: a
  };
}
function Vn(n) {
  return Se(n) ? n : n.contextElement;
}
function rt(n) {
  const e = Vn(n);
  if (!Pe(e))
    return ke(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: s,
    $: r
  } = bs(e);
  let o = (r ? Ft(t.width) : t.width) / i, a = (r ? Ft(t.height) : t.height) / s;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Ml = /* @__PURE__ */ ke(0);
function ws(n) {
  const e = pe(n);
  return !Hn() || !e.visualViewport ? Ml : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function $l(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== pe(n) ? !1 : e;
}
function Xe(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), r = Vn(n);
  let o = ke(1);
  e && (i ? Se(i) && (o = rt(i)) : o = rt(n));
  const a = $l(r, t, i) ? ws(r) : ke(0);
  let l = (s.left + a.x) / o.x, u = (s.top + a.y) / o.y, c = s.width / o.x, d = s.height / o.y;
  if (r) {
    const h = pe(r), p = i && Se(i) ? pe(i) : i;
    let f = h, g = Tn(f);
    for (; g && i && p !== f; ) {
      const v = rt(g), _ = g.getBoundingClientRect(), S = Ce(g), w = _.left + (g.clientLeft + parseFloat(S.paddingLeft)) * v.x, y = _.top + (g.clientTop + parseFloat(S.paddingTop)) * v.y;
      l *= v.x, u *= v.y, c *= v.x, d *= v.y, l += w, u += y, f = pe(g), g = Tn(f);
    }
  }
  return Nt({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function Zt(n, e) {
  const t = Jt(n).scrollLeft;
  return e ? e.left + t : Xe(Ie(n)).left + t;
}
function Ss(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - Zt(n, t), s = t.top + e.scrollTop;
  return {
    x: i,
    y: s
  };
}
function Bl(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: s
  } = n;
  const r = s === "fixed", o = Ie(i), a = e ? Gt(e.floating) : !1;
  if (i === o || a && r)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = ke(1);
  const c = ke(0), d = Pe(i);
  if ((d || !d && !r) && ((Ze(i) !== "body" || Ct(o)) && (l = Jt(i)), Pe(i))) {
    const p = Xe(i);
    u = rt(i), c.x = p.x + i.clientLeft, c.y = p.y + i.clientTop;
  }
  const h = o && !d && !r ? Ss(o, l) : ke(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + h.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + h.y
  };
}
function ql(n) {
  return Array.from(n.getClientRects());
}
function Fl(n) {
  const e = Ie(n), t = Jt(n), i = n.ownerDocument.body, s = fe(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), r = fe(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let o = -t.scrollLeft + Zt(n);
  const a = -t.scrollTop;
  return Ce(i).direction === "rtl" && (o += fe(e.clientWidth, i.clientWidth) - s), {
    width: s,
    height: r,
    x: o,
    y: a
  };
}
const bi = 25;
function zl(n, e) {
  const t = pe(n), i = Ie(n), s = t.visualViewport;
  let r = i.clientWidth, o = i.clientHeight, a = 0, l = 0;
  if (s) {
    r = s.width, o = s.height;
    const c = Hn();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  const u = Zt(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, h = getComputedStyle(d), p = c.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, f = Math.abs(i.clientWidth - d.clientWidth - p);
    f <= bi && (r -= f);
  } else u <= bi && (r += u);
  return {
    width: r,
    height: o,
    x: a,
    y: l
  };
}
const Nl = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Wl(n, e) {
  const t = Xe(n, !0, e === "fixed"), i = t.top + n.clientTop, s = t.left + n.clientLeft, r = Pe(n) ? rt(n) : ke(1), o = n.clientWidth * r.x, a = n.clientHeight * r.y, l = s * r.x, u = i * r.y;
  return {
    width: o,
    height: a,
    x: l,
    y: u
  };
}
function wi(n, e, t) {
  let i;
  if (e === "viewport")
    i = zl(n, t);
  else if (e === "document")
    i = Fl(Ie(n));
  else if (Se(e))
    i = Wl(e, t);
  else {
    const s = ws(n);
    i = {
      x: e.x - s.x,
      y: e.y - s.y,
      width: e.width,
      height: e.height
    };
  }
  return Nt(i);
}
function Cs(n, e) {
  const t = ze(n);
  return t === e || !Se(t) || at(t) ? !1 : Ce(t).position === "fixed" || Cs(t, e);
}
function Hl(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = gt(n, [], !1).filter((a) => Se(a) && Ze(a) !== "body"), s = null;
  const r = Ce(n).position === "fixed";
  let o = r ? ze(n) : n;
  for (; Se(o) && !at(o); ) {
    const a = Ce(o), l = Wn(o);
    !l && a.position === "fixed" && (s = null), (r ? !l && !s : !l && a.position === "static" && !!s && Nl.has(s.position) || Ct(o) && !l && Cs(n, o)) ? i = i.filter((c) => c !== o) : s = a, o = ze(o);
  }
  return e.set(n, i), i;
}
function Vl(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: s
  } = n;
  const o = [...t === "clippingAncestors" ? Gt(e) ? [] : Hl(e, this._c) : [].concat(t), i], a = o[0], l = o.reduce((u, c) => {
    const d = wi(e, c, s);
    return u.top = fe(d.top, u.top), u.right = Fe(d.right, u.right), u.bottom = Fe(d.bottom, u.bottom), u.left = fe(d.left, u.left), u;
  }, wi(e, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function jl(n) {
  const {
    width: e,
    height: t
  } = bs(n);
  return {
    width: e,
    height: t
  };
}
function Ul(n, e, t) {
  const i = Pe(e), s = Ie(e), r = t === "fixed", o = Xe(n, !0, r, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = ke(0);
  function u() {
    l.x = Zt(s);
  }
  if (i || !i && !r)
    if ((Ze(e) !== "body" || Ct(s)) && (a = Jt(e)), i) {
      const p = Xe(e, !0, r, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
    } else s && u();
  r && !i && s && u();
  const c = s && !i && !r ? Ss(s, a) : ke(0), d = o.left + a.scrollLeft - l.x - c.x, h = o.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: h,
    width: o.width,
    height: o.height
  };
}
function pn(n) {
  return Ce(n).position === "static";
}
function Si(n, e) {
  if (!Pe(n) || Ce(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Ie(n) === t && (t = t.ownerDocument.body), t;
}
function xs(n, e) {
  const t = pe(n);
  if (Gt(n))
    return t;
  if (!Pe(n)) {
    let s = ze(n);
    for (; s && !at(s); ) {
      if (Se(s) && !pn(s))
        return s;
      s = ze(s);
    }
    return t;
  }
  let i = Si(n, e);
  for (; i && Pl(i) && pn(i); )
    i = Si(i, e);
  return i && at(i) && pn(i) && !Wn(i) ? t : i || Ll(n) || t;
}
const Kl = async function(n) {
  const e = this.getOffsetParent || xs, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: Ul(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Xl(n) {
  return Ce(n).direction === "rtl";
}
const Yl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Bl,
  getDocumentElement: Ie,
  getClippingRect: Vl,
  getOffsetParent: xs,
  getElementRects: Kl,
  getClientRects: ql,
  getDimensions: jl,
  getScale: rt,
  isElement: Se,
  isRTL: Xl
};
function _s(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Gl(n, e) {
  let t = null, i;
  const s = Ie(n);
  function r() {
    var a;
    clearTimeout(i), (a = t) == null || a.disconnect(), t = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), r();
    const u = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: h,
      height: p
    } = u;
    if (a || e(), !h || !p)
      return;
    const f = Tt(d), g = Tt(s.clientWidth - (c + h)), v = Tt(s.clientHeight - (d + p)), _ = Tt(c), w = {
      rootMargin: -f + "px " + -g + "px " + -v + "px " + -_ + "px",
      threshold: fe(0, Fe(1, l)) || 1
    };
    let y = !0;
    function x(C) {
      const b = C[0].intersectionRatio;
      if (b !== l) {
        if (!y)
          return o();
        b ? o(!1, b) : i = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      b === 1 && !_s(u, n.getBoundingClientRect()) && o(), y = !1;
    }
    try {
      t = new IntersectionObserver(x, {
        ...w,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(x, w);
    }
    t.observe(n);
  }
  return o(!0), r;
}
function Jl(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: r = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Vn(n), c = s || r ? [...u ? gt(u) : [], ...gt(e)] : [];
  c.forEach((_) => {
    s && _.addEventListener("scroll", t, {
      passive: !0
    }), r && _.addEventListener("resize", t);
  });
  const d = u && a ? Gl(u, t) : null;
  let h = -1, p = null;
  o && (p = new ResizeObserver((_) => {
    let [S] = _;
    S && S.target === u && p && (p.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var w;
      (w = p) == null || w.observe(e);
    })), t();
  }), u && !l && p.observe(u), p.observe(e));
  let f, g = l ? Xe(n) : null;
  l && v();
  function v() {
    const _ = Xe(n);
    g && !_s(g, _) && t(), g = _, f = requestAnimationFrame(v);
  }
  return t(), () => {
    var _;
    c.forEach((S) => {
      s && S.removeEventListener("scroll", t), r && S.removeEventListener("resize", t);
    }), d?.(), (_ = p) == null || _.disconnect(), p = null, l && cancelAnimationFrame(f);
  };
}
const Zl = Cl, Ql = xl, Ci = bl, eu = El, tu = wl, nu = yl, iu = _l, su = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), s = {
    platform: Yl,
    ...t
  }, r = {
    ...s.platform,
    _c: i
  };
  return gl(n, e, {
    ...s,
    platform: r
  });
};
function ru(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Pn(n) {
  if (ru(n)) {
    const e = n.$el;
    return Nn(e) && Ze(e) === "#comment" ? null : e;
  }
  return n;
}
function st(n) {
  return typeof n == "function" ? n() : m(n);
}
function ou(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Pn(st(n.element));
      return t == null ? {} : nu({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Es(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function xi(n, e) {
  const t = Es(n);
  return Math.round(e * t) / t;
}
function au(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, s = P(() => {
    var b;
    return (b = st(t.open)) != null ? b : !0;
  }), r = P(() => st(t.middleware)), o = P(() => {
    var b;
    return (b = st(t.placement)) != null ? b : "bottom";
  }), a = P(() => {
    var b;
    return (b = st(t.strategy)) != null ? b : "absolute";
  }), l = P(() => {
    var b;
    return (b = st(t.transform)) != null ? b : !0;
  }), u = P(() => Pn(n.value)), c = P(() => Pn(e.value)), d = A(0), h = A(0), p = A(a.value), f = A(o.value), g = ot({}), v = A(!1), _ = P(() => {
    const b = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return b;
    const O = xi(c.value, d.value), T = xi(c.value, h.value);
    return l.value ? {
      ...b,
      transform: "translate(" + O + "px, " + T + "px)",
      ...Es(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: O + "px",
      top: T + "px"
    };
  });
  let S;
  function w() {
    if (u.value == null || c.value == null)
      return;
    const b = s.value;
    su(u.value, c.value, {
      middleware: r.value,
      placement: o.value,
      strategy: a.value
    }).then((O) => {
      d.value = O.x, h.value = O.y, p.value = O.strategy, f.value = O.placement, g.value = O.middlewareData, v.value = b !== !1;
    });
  }
  function y() {
    typeof S == "function" && (S(), S = void 0);
  }
  function x() {
    if (y(), i === void 0) {
      w();
      return;
    }
    if (u.value != null && c.value != null) {
      S = i(u.value, c.value, w);
      return;
    }
  }
  function C() {
    s.value || (v.value = !1);
  }
  return Z([r, o, a, s], w, {
    flush: "sync"
  }), Z([u, c], x, {
    flush: "sync"
  }), Z(s, C, {
    flush: "sync"
  }), Di() && Li(y), {
    x: tt(d),
    y: tt(h),
    strategy: tt(p),
    placement: tt(f),
    middlewareData: tt(g),
    isPositioned: tt(v),
    floatingStyles: _,
    update: w
  };
}
const lu = {
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
}, [Od, uu] = Oe("PopperContent");
var cu = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Gs({
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
  }, { ...lu }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = ms(), { forwardRef: r, currentElement: o } = ie(), a = A(), l = A(), { width: u, height: c } = aa(l), d = P(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), h = P(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), p = P(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), f = P(() => ({
      padding: h.value,
      boundary: p.value.filter(il),
      altBoundary: p.value.length > 0
    })), g = P(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), v = Ro(() => [
      Zl({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Ci({
        ...f.value,
        ...g.value
      }),
      t.avoidCollisions && Ql({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? iu() : void 0,
        ...f.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Ci({
        ...f.value,
        ...g.value
      }),
      eu({
        ...f.value,
        apply: ({ elements: R, rects: z, availableWidth: D, availableHeight: M }) => {
          const { width: X, height: V } = z.reference, G = R.floating.style;
          G.setProperty("--reka-popper-available-width", `${D}px`), G.setProperty("--reka-popper-available-height", `${M}px`), G.setProperty("--reka-popper-anchor-width", `${X}px`), G.setProperty("--reka-popper-anchor-height", `${V}px`);
        }
      }),
      l.value && ou({
        element: l.value,
        padding: t.arrowPadding
      }),
      sl({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && tu({
        strategy: "referenceHidden",
        ...f.value
      })
    ]), _ = P(() => t.reference ?? s.anchor.value), { floatingStyles: S, placement: w, isPositioned: y, middlewareData: x } = au(_, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => Jl(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: v
    }), C = P(() => _n(w.value)[0]), b = P(() => _n(w.value)[1]);
    qi(() => {
      y.value && i("placed");
    });
    const O = P(() => {
      const R = x.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), T = A("");
    ye(() => {
      o.value && (T.value = window.getComputedStyle(o.value).zIndex);
    });
    const k = P(() => x.value.arrow?.x ?? 0), L = P(() => x.value.arrow?.y ?? 0);
    return uu({
      placedSide: C,
      onArrowChange: (R) => l.value = R,
      arrowX: k,
      arrowY: L,
      shouldHideArrow: O
    }), (R, z) => (E(), W("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: lt({
        ...m(S),
        transform: m(y) ? m(S).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: T.value,
        "--reka-popper-transform-origin": [m(x).transformOrigin?.x, m(x).transformOrigin?.y].join(" "),
        ...m(x).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [B(m(ne), Q({ ref: m(r) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": C.value,
      "data-align": b.value,
      style: { animation: m(y) ? void 0 : "none" }
    }), {
      default: I(() => [j(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), du = cu;
function fu(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => ht(i, e, t)) : ht(n, e, t);
}
function ht(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : $t(n, e);
}
const [ks, pu] = Oe("ListboxRoot");
var hu = /* @__PURE__ */ F({
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
    const i = n, s = t, { multiple: r, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: u, dir: c } = ut(i), { getItems: d } = We({ isProvider: !0 }), { handleTypeaheadSearch: h } = $n(), { primitiveElement: p, currentElement: f } = qt(), g = oa(), v = Qi(c), _ = es(f), S = A(), w = A(!1), y = A(!0), x = /* @__PURE__ */ Bt(i, "modelValue", s, {
      defaultValue: i.defaultValue ?? (r.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function C($) {
      if (w.value = !0, i.multiple) {
        const N = Array.isArray(x.value) ? [...x.value] : [], U = N.findIndex((J) => ht(J, $, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? N.push($) : N.splice(U, 1), x.value = N) : (x.value = [$], S.value = $);
      } else i.selectionBehavior === "toggle" && ht(x.value, $, i.by) ? x.value = void 0 : x.value = $;
      setTimeout(() => {
        w.value = !1;
      }, 1);
    }
    const b = A(null), O = A(null), T = A(!1), k = A(!1), L = /* @__PURE__ */ on(), R = /* @__PURE__ */ on(), z = /* @__PURE__ */ on();
    function D() {
      return d().map(($) => $.ref).filter(($) => $.dataset.disabled !== "");
    }
    function M($, N = !0) {
      if (!$) return;
      b.value = $, y.value && b.value.focus(), N && b.value.scrollIntoView({ block: "nearest" });
      const U = d().find((J) => J.ref === $);
      s("highlight", U);
    }
    function X($) {
      if (T.value) z.trigger($);
      else {
        const N = d().find((U) => ht(U.value, $, i.by));
        N && (b.value = N.ref, M(N.ref));
      }
    }
    function V($) {
      b.value && b.value.isConnected && ($.preventDefault(), $.stopPropagation(), k.value || b.value.click());
    }
    function G($) {
      if (y.value) {
        if (w.value = !0, T.value) R.trigger($);
        else {
          const N = $.altKey || $.ctrlKey || $.metaKey;
          if (N && $.key === "a" && r.value) {
            const U = d(), J = U.map((xe) => xe.value);
            x.value = [...J], $.preventDefault(), M(U[U.length - 1].ref);
          } else if (!N) {
            const U = h($.key, d());
            U && M(U);
          }
        }
        setTimeout(() => {
          w.value = !1;
        }, 1);
      }
    }
    function ee() {
      k.value = !0;
    }
    function ue() {
      se(() => {
        k.value = !1;
      });
    }
    function Qe() {
      se(() => {
        const $ = new KeyboardEvent("keydown", { key: "PageUp" });
        Ve($);
      });
    }
    function be($) {
      const N = b.value;
      N?.isConnected && (O.value = N), b.value = null, s("leave", $);
    }
    function et($) {
      const N = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if ($.currentTarget?.dispatchEvent(N), s("entryFocus", N), !N.defaultPrevented)
        if (O.value) M(O.value);
        else {
          const U = D()?.[0];
          M(U);
        }
    }
    function Ve($) {
      const N = Ka($, a.value, v.value);
      if (!N) return;
      let U = D();
      if (b.value) {
        if (N === "last") U.reverse();
        else if (N === "prev" || N === "next") {
          N === "prev" && U.reverse();
          const J = U.indexOf(b.value);
          U = U.slice(J + 1);
        }
        en($, U[0]);
      }
      if (U.length) {
        const J = !b.value && N === "prev" ? U.length - 1 : 0;
        M(U[J]);
      }
      if (T.value) return R.trigger($);
    }
    function en($, N) {
      if (!(T.value || i.selectionBehavior !== "replace" || !r.value || !Array.isArray(x.value) || ($.altKey || $.ctrlKey || $.metaKey) && !$.shiftKey) && $.shiftKey) {
        const J = d().filter((De) => De.ref.dataset.disabled !== "");
        let xe = J.find((De) => De.ref === N)?.value;
        if ($.key === g.END ? xe = J[J.length - 1].value : $.key === g.HOME && (xe = J[0].value), !xe || !S.value) return;
        const dt = Lo(J.map((De) => De.value), S.value, xe);
        x.value = dt;
      }
    }
    async function tn($) {
      if (await se(), T.value) L.trigger($);
      else {
        const N = D(), U = N.find((J) => J.dataset.state === "checked");
        U ? M(U) : N.length && M(N[0]);
      }
    }
    return Z(x, () => {
      w.value || se(() => {
        tn();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: b,
      highlightItem: X,
      highlightFirstItem: Qe,
      highlightSelected: tn,
      getItems: d
    }), pu({
      modelValue: x,
      onValueChange: C,
      multiple: r,
      orientation: a,
      dir: v,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: b,
      isVirtual: T,
      virtualFocusHook: L,
      virtualKeydownHook: R,
      virtualHighlightHook: z,
      by: i.by,
      firstValue: S,
      selectionBehavior: u,
      focusable: y,
      onLeave: be,
      onEnter: et,
      changeHighlight: M,
      onKeydownEnter: V,
      onKeydownNavigation: Ve,
      onKeydownTypeAhead: G,
      onCompositionStart: ee,
      onCompositionEnd: ue,
      highlightFirstItem: Qe
    }), ($, N) => (E(), q(m(ne), {
      ref_key: "primitiveElement",
      ref: p,
      as: $.as,
      "as-child": $.asChild,
      dir: m(v),
      "data-disabled": m(l) ? "" : void 0,
      onPointerleave: be,
      onFocusout: N[0] || (N[0] = async (U) => {
        const J = U.relatedTarget || U.target;
        await se(), b.value && m(f) && !m(f).contains(J) && be(U);
      })
    }, {
      default: I(() => [j($.$slots, "default", { modelValue: m(x) }), m(_) && $.name ? (E(), q(m(Ja), {
        key: 0,
        name: $.name,
        value: m(x),
        disabled: m(l),
        required: $.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : K("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), mu = hu, vu = /* @__PURE__ */ F({
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
    const { CollectionSlot: e } = We(), t = ks(), i = Xi(!1, 10);
    return (s, r) => (E(), q(m(e), null, {
      default: I(() => [B(m(ne), {
        role: "listbox",
        as: s.as,
        "as-child": s.asChild,
        tabindex: m(t).focusable.value ? m(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": m(t).orientation.value,
        "aria-multiselectable": !!m(t).multiple.value,
        "data-orientation": m(t).orientation.value,
        onMousedown: r[0] || (r[0] = Ke((o) => i.value = !0, ["left"])),
        onFocus: r[1] || (r[1] = (o) => {
          m(i) || m(t).onEnter(o);
        }),
        onKeydown: [
          r[2] || (r[2] = yn((o) => {
            m(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || m(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), m(t).focusable.value && m(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          yn(m(t).onKeydownEnter, ["enter"]),
          m(t).onKeydownTypeAhead
        ]
      }, {
        default: I(() => [j(s.$slots, "default")]),
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
}), gu = vu;
const yu = "listbox.select", [bu, wu] = Oe("ListboxItem");
var Su = /* @__PURE__ */ F({
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
    const t = n, i = e, s = vt(void 0, "reka-listbox-item"), { CollectionItem: r } = We(), { forwardRef: o, currentElement: a } = ie(), l = ks(), u = P(() => a.value === l.highlightedElement.value), c = P(() => fu(l.modelValue.value, t.value, l.by)), d = P(() => l.disabled.value || t.disabled);
    async function h(f) {
      i("select", f), !f?.defaultPrevented && !d.value && f && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function p(f) {
      const g = {
        originalEvent: f,
        value: t.value
      };
      Vt(yu, h, g);
    }
    return wu({ isSelected: c }), (f, g) => (E(), q(m(r), { value: f.value }, {
      default: I(() => [Js([u.value, c.value], () => B(m(ne), Q({ id: m(s) }, f.$attrs, {
        ref: m(o),
        role: "option",
        tabindex: m(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: f.as,
        "as-child": f.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: p,
        onKeydown: yn(Ke(p, ["prevent"]), ["space"]),
        onPointermove: g[0] || (g[0] = () => {
          m(l).highlightedElement.value !== m(a) && m(l).highlightOnHover.value && !m(l).focusable.value && m(l).changeHighlight(m(a), !1);
        })
      }), {
        default: I(() => [j(f.$slots, "default")]),
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
}), Cu = Su, xu = /* @__PURE__ */ F({
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
    ie();
    const t = bu();
    return (i, s) => m(t).isSelected.value ? (E(), q(m(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [j(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), _u = xu;
function Eu(n) {
  const e = jt({ nonce: A() });
  return P(() => n?.value || e.nonce?.value);
}
const ku = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Tu = [" ", "Enter"], we = 10;
function yt(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => An(i, e, t)) : An(n, e, t);
}
function An(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : $t(n, e);
}
function Pu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Au = {
  key: 0,
  value: ""
}, [He, Ts] = Oe("SelectRoot");
var Ou = /* @__PURE__ */ F({
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
    const t = n, i = e, { required: s, disabled: r, multiple: o, dir: a } = ut(t), l = /* @__PURE__ */ Bt(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ Bt(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = A(), d = A(), h = A({
      x: 0,
      y: 0
    }), p = P(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : Sn(l.value));
    We({ isProvider: !0 });
    const f = Qi(a), g = es(c), v = A(/* @__PURE__ */ new Set()), _ = P(() => Array.from(v.value).map((y) => y.value).join(";"));
    function S(y) {
      if (o.value) {
        const x = Array.isArray(l.value) ? [...l.value] : [], C = x.findIndex((b) => An(b, y, t.by));
        C === -1 ? x.push(y) : x.splice(C, 1), l.value = [...x];
      } else l.value = y;
    }
    function w(y) {
      return Array.from(v.value).find((x) => yt(y, x.value, t.by));
    }
    return Ts({
      triggerElement: c,
      onTriggerChange: (y) => {
        c.value = y;
      },
      valueElement: d,
      onValueElementChange: (y) => {
        d.value = y;
      },
      contentId: "",
      modelValue: l,
      onValueChange: S,
      by: t.by,
      open: u,
      multiple: o,
      required: s,
      onOpenChange: (y) => {
        u.value = y;
      },
      dir: f,
      triggerPointerDownPosRef: h,
      disabled: r,
      isEmptyModelValue: p,
      optionsSet: v,
      onOptionAdd: (y) => {
        const x = w(y.value);
        x && v.value.delete(x), v.value.add(y);
      },
      onOptionRemove: (y) => {
        const x = w(y.value);
        x && v.value.delete(x);
      }
    }), (y, x) => (E(), q(m(el), null, {
      default: I(() => [j(y.$slots, "default", {
        modelValue: m(l),
        open: m(u)
      }), m(g) ? (E(), q(Lu, {
        key: _.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: m(o),
        required: m(s),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: m(r),
        value: m(l)
      }, {
        default: I(() => [m(Sn)(m(l)) ? (E(), W("option", Au)) : K("v-if", !0), (E(!0), W(ve, null, Ye(Array.from(v.value), (C) => (E(), W("option", Q({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : K("v-if", !0)]),
      _: 3
    }));
  }
}), Iu = Ou, Du = /* @__PURE__ */ F({
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
    const e = n, t = A(), i = He();
    Z(() => e.value, (r, o) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (r !== o && u && t.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(t.value, r), t.value.dispatchEvent(c);
      }
    });
    function s(r) {
      i.onValueChange(r.target.value);
    }
    return (r, o) => (E(), q(m(hs), { "as-child": "" }, {
      default: I(() => [H("select", Q({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: s }), [j(r.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Lu = Du, Ru = /* @__PURE__ */ F({
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
      default: we
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
    const t = Mn(n);
    return (i, s) => (E(), q(m(du), Q(m(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: I(() => [j(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Mu = Ru;
const $u = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Qt, Ps] = Oe("SelectContent");
var Bu = /* @__PURE__ */ F({
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
    const t = n, i = e, s = He();
    Qo(), Ji(t.bodyLock);
    const { CollectionSlot: r, getItems: o } = We(), a = A();
    ns(a);
    const { search: l, handleTypeaheadSearch: u } = $n(), c = A(), d = A(), h = A(), p = A(!1), f = A(!1), g = A(!1);
    function v() {
      d.value && a.value && ci([d.value, a.value]);
    }
    Z(p, () => {
      v();
    });
    const { onOpenChange: _, triggerPointerDownPosRef: S } = s;
    ye((C) => {
      if (!a.value) return;
      let b = {
        x: 0,
        y: 0
      };
      const O = (k) => {
        b = {
          x: Math.abs(Math.round(k.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(k.pageY) - (S.value?.y ?? 0))
        };
      }, T = (k) => {
        k.pointerType !== "touch" && (b.x <= 10 && b.y <= 10 ? k.preventDefault() : a.value?.contains(k.target) || _(!1), document.removeEventListener("pointermove", O), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", O), document.addEventListener("pointerup", T, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", O), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function w(C) {
      const b = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !b && C.key.length === 1 && u(C.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let T = [...o().map((k) => k.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const k = C.target, L = T.indexOf(k);
          T = T.slice(L + 1);
        }
        setTimeout(() => ci(T)), C.preventDefault();
      }
    }
    const y = P(() => t.position === "popper" ? t : {}), x = Mn(y.value);
    return Ps({
      content: a,
      viewport: c,
      onViewportChange: (C) => {
        c.value = C;
      },
      itemRefCallback: (C, b, O) => {
        const T = !f.value && !O, k = yt(s.modelValue.value, b, s.by);
        if (s.multiple.value) {
          if (g.value) return;
          (k || T) && (d.value = C, k && (g.value = !0));
        } else (k || T) && (d.value = C);
        T && (f.value = !0);
      },
      selectedItem: d,
      selectedItemText: h,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (C, b, O) => {
        const T = !f.value && !O;
        (yt(s.modelValue.value, b, s.by) || T) && (h.value = C);
      },
      focusSelectedItem: v,
      position: t.position,
      isPositioned: p,
      searchRef: l
    }), (C, b) => (E(), q(m(r), null, {
      default: I(() => [B(m(as), {
        "as-child": "",
        onMountAutoFocus: b[6] || (b[6] = Ke(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: b[7] || (b[7] = (O) => {
          i("closeAutoFocus", O), !O.defaultPrevented && (m(s).triggerElement.value?.focus({ preventScroll: !0 }), O.preventDefault());
        })
      }, {
        default: I(() => [B(m(rs), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: b[2] || (b[2] = Ke(() => {
          }, ["prevent"])),
          onDismiss: b[3] || (b[3] = (O) => m(s).onOpenChange(!1)),
          onEscapeKeyDown: b[4] || (b[4] = (O) => i("escapeKeyDown", O)),
          onPointerDownOutside: b[5] || (b[5] = (O) => i("pointerDownOutside", O))
        }, {
          default: I(() => [(E(), q(Zs(C.position === "popper" ? Mu : Wu), Q({
            ...C.$attrs,
            ...m(x)
          }, {
            id: m(s).contentId,
            ref: (O) => {
              const T = m(Te)(O);
              T?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = T.firstElementChild : a.value = T;
            },
            role: "listbox",
            "data-state": m(s).open.value ? "open" : "closed",
            dir: m(s).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: b[0] || (b[0] = Ke(() => {
            }, ["prevent"])),
            onPlaced: b[1] || (b[1] = (O) => p.value = !0),
            onKeydown: w
          }), {
            default: I(() => [j(C.$slots, "default")]),
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
}), qu = Bu;
const [Fu, zu] = Oe("SelectItemAlignedPosition");
var Nu = /* @__PURE__ */ F({
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
    const t = n, i = e, { getItems: s } = We(), r = He(), o = Qt(), a = A(!1), l = A(!0), u = A(), { forwardRef: c, currentElement: d } = ie(), { viewport: h, selectedItem: p, selectedItemText: f, focusSelectedItem: g } = o;
    function v() {
      if (r.triggerElement.value && r.valueElement.value && u.value && d.value && h?.value && p?.value && f?.value) {
        const w = r.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), x = r.valueElement.value.getBoundingClientRect(), C = f.value.getBoundingClientRect();
        if (r.dir.value !== "rtl") {
          const $ = C.left - y.left, N = x.left - $, U = w.left - N, J = w.width + U, xe = Math.max(J, y.width), dt = window.innerWidth - we, De = si(N, we, Math.max(we, dt - xe));
          u.value.style.minWidth = `${J}px`, u.value.style.left = `${De}px`;
        } else {
          const $ = y.right - C.right, N = window.innerWidth - x.right - $, U = window.innerWidth - w.right - N, J = w.width + U, xe = Math.max(J, y.width), dt = window.innerWidth - we, De = si(N, we, Math.max(we, dt - xe));
          u.value.style.minWidth = `${J}px`, u.value.style.right = `${De}px`;
        }
        const b = s().map(($) => $.ref), O = window.innerHeight - we * 2, T = h.value.scrollHeight, k = window.getComputedStyle(d.value), L = Number.parseInt(k.borderTopWidth, 10), R = Number.parseInt(k.paddingTop, 10), z = Number.parseInt(k.borderBottomWidth, 10), D = Number.parseInt(k.paddingBottom, 10), M = L + R + T + D + z, X = Math.min(p.value.offsetHeight * 5, M), V = window.getComputedStyle(h.value), G = Number.parseInt(V.paddingTop, 10), ee = Number.parseInt(V.paddingBottom, 10), ue = w.top + w.height / 2 - we, Qe = O - ue, be = p.value.offsetHeight / 2, et = p.value.offsetTop + be, Ve = L + R + et, en = M - Ve;
        if (Ve <= ue) {
          const $ = p.value === b[b.length - 1];
          u.value.style.bottom = "0px";
          const N = d.value.clientHeight - h.value.offsetTop - h.value.offsetHeight, U = Math.max(Qe, be + ($ ? ee : 0) + N + z), J = Ve + U;
          u.value.style.height = `${J}px`;
        } else {
          const $ = p.value === b[0];
          u.value.style.top = "0px";
          const U = Math.max(ue, L + h.value.offsetTop + ($ ? G : 0) + be) + en;
          u.value.style.height = `${U}px`, h.value.scrollTop = Ve - ue + h.value.offsetTop;
        }
        u.value.style.margin = `${we}px 0`, u.value.style.minHeight = `${X}px`, u.value.style.maxHeight = `${O}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const _ = A("");
    re(async () => {
      await se(), v(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(w) {
      w && l.value === !0 && (v(), g?.(), l.value = !1);
    }
    return Xo(r.triggerElement, () => {
      v();
    }), zu({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (w, y) => (E(), W("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: lt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: _.value
      })
    }, [B(m(ne), Q({
      ref: m(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...w.$attrs,
      ...t
    }), {
      default: I(() => [j(w.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Wu = Nu, Hu = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Ts(n.context), Ps($u), (t, i) => j(t.$slots, "default");
  }
}), Vu = Hu;
const ju = { key: 1 };
var Uu = /* @__PURE__ */ F({
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
    const t = n, s = ea(t, e), r = He(), o = A();
    re(() => {
      o.value = new DocumentFragment();
    });
    const a = A(), l = P(() => t.forceMount || r.open.value), u = A(l.value);
    return Z(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (E(), q(m(Bn), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: I(() => [B(qu, In(Dn({
        ...m(s),
        ...c.$attrs
      })), {
        default: I(() => [j(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (E(), W("div", ju, [(E(), q(Bi, { to: o.value }, [B(Vu, { context: m(r) }, {
      default: I(() => [j(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), Ku = Uu, Xu = /* @__PURE__ */ F({
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
    return (e, t) => (E(), q(m(ne), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: I(() => [j(e.$slots, "default", {}, () => [t[0] || (t[0] = de("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Yu = Xu;
const [As, Gu] = Oe("SelectItem");
var Ju = /* @__PURE__ */ F({
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
    const t = n, i = e, { disabled: s } = ut(t), r = He(), o = Qt(), { forwardRef: a, currentElement: l } = ie(), { CollectionItem: u } = We(), c = P(() => yt(r.modelValue?.value, t.value, r.by)), d = A(!1), h = A(t.textValue ?? ""), p = vt(void 0, "reka-select-item-text"), f = "select.select";
    async function g(y) {
      if (y.defaultPrevented) return;
      const x = {
        originalEvent: y,
        value: t.value
      };
      Vt(f, v, x);
    }
    async function v(y) {
      await se(), i("select", y), !y.defaultPrevented && (s.value || (r.onValueChange(t.value), r.multiple.value || r.onOpenChange(!1)));
    }
    async function _(y) {
      await se(), !y.defaultPrevented && (s.value ? o.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(y) {
      await se(), !y.defaultPrevented && y.currentTarget === ge() && o.onItemLeave?.();
    }
    async function w(y) {
      await se(), !(y.defaultPrevented || o.searchRef?.value !== "" && y.key === " ") && (Tu.includes(y.key) && g(y), y.key === " " && y.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return re(() => {
      l.value && o.itemRefCallback(l.value, t.value, t.disabled);
    }), Gu({
      value: t.value,
      disabled: s,
      textId: p,
      isSelected: c,
      onItemTextChange: (y) => {
        h.value = ((h.value || y?.textContent) ?? "").trim();
      }
    }), (y, x) => (E(), q(m(u), { value: { textValue: h.value } }, {
      default: I(() => [B(m(ne), {
        ref: m(a),
        role: "option",
        "aria-labelledby": m(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": m(s) || void 0,
        "data-disabled": m(s) ? "" : void 0,
        tabindex: m(s) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: x[0] || (x[0] = (C) => d.value = !0),
        onBlur: x[1] || (x[1] = (C) => d.value = !1),
        onPointerup: g,
        onPointerdown: x[2] || (x[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: x[3] || (x[3] = Ke(() => {
        }, ["prevent", "stop"])),
        onPointermove: _,
        onPointerleave: S,
        onKeydown: w
      }, {
        default: I(() => [j(y.$slots, "default")]),
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
}), Zu = Ju, Qu = /* @__PURE__ */ F({
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
    const e = n, t = As();
    return (i, s) => m(t).isSelected.value ? (E(), q(m(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [j(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), ec = Qu, tc = /* @__PURE__ */ F({
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
    const e = n, t = He(), i = Qt(), s = As(), { forwardRef: r, currentElement: o } = ie(), a = P(() => ({
      value: s.value,
      disabled: s.disabled.value,
      textContent: o.value?.textContent ?? s.value?.toString() ?? ""
    }));
    return re(() => {
      o.value && (s.onItemTextChange(o.value), i.itemTextRefCallback(o.value, s.value, s.disabled.value), t.onOptionAdd(a.value));
    }), St(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (E(), q(m(ne), Q({
      id: m(s).textId,
      ref: m(r)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: I(() => [j(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), nc = tc, ic = /* @__PURE__ */ F({
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
    return (t, i) => (E(), q(m(ds), In(Dn(e)), {
      default: I(() => [j(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), sc = ic, rc = /* @__PURE__ */ F({
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
    const e = n, t = He(), { forwardRef: i, currentElement: s } = ie(), r = P(() => t.disabled?.value || e.disabled);
    t.contentId ||= vt(void 0, "reka-select-content"), re(() => {
      t.onTriggerChange(s.value);
    });
    const { getItems: o } = We(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = $n();
    function c() {
      r.value || (t.onOpenChange(!0), u());
    }
    function d(h) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(h.pageX),
        y: Math.round(h.pageY)
      };
    }
    return (h, p) => (E(), q(m(nl), {
      "as-child": "",
      reference: h.reference
    }, {
      default: I(() => [B(m(ne), {
        ref: m(i),
        role: "combobox",
        type: h.as === "button" ? "button" : void 0,
        "aria-controls": m(t).contentId,
        "aria-expanded": m(t).open.value || !1,
        "aria-required": m(t).required?.value,
        "aria-autocomplete": "none",
        disabled: r.value,
        dir: m(t)?.dir.value,
        "data-state": m(t)?.open.value ? "open" : "closed",
        "data-disabled": r.value ? "" : void 0,
        "data-placeholder": m(Pu)(m(t).modelValue?.value) ? "" : void 0,
        "as-child": h.asChild,
        as: h.as,
        onClick: p[0] || (p[0] = (f) => {
          f?.currentTarget?.focus();
        }),
        onPointerdown: p[1] || (p[1] = (f) => {
          if (f.pointerType === "touch") return f.preventDefault();
          const g = f.target;
          g.hasPointerCapture(f.pointerId) && g.releasePointerCapture(f.pointerId), f.button === 0 && f.ctrlKey === !1 && (d(f), f.preventDefault());
        }),
        onPointerup: p[2] || (p[2] = Ke((f) => {
          f.pointerType === "touch" && d(f);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (f) => {
          const g = m(a) !== "";
          !(f.ctrlKey || f.altKey || f.metaKey) && f.key.length === 1 && g && f.key === " " || (m(l)(f.key, m(o)()), m(ku).includes(f.key) && (c(), f.preventDefault()));
        })
      }, {
        default: I(() => [j(h.$slots, "default")]),
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
}), oc = rc, ac = /* @__PURE__ */ F({
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
    const e = n, { forwardRef: t, currentElement: i } = ie(), s = He();
    re(() => {
      s.valueElement = i;
    });
    const r = P(() => {
      let a = [];
      const l = Array.from(s.optionsSet.value), u = (c) => l.find((d) => yt(c, d.value, s.by));
      return Array.isArray(s.modelValue.value) ? a = s.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(s.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = P(() => r.value.length ? r.value.join(", ") : e.placeholder);
    return (a, l) => (E(), q(m(ne), {
      ref: m(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": r.value.length ? void 0 : e.placeholder
    }, {
      default: I(() => [j(a.$slots, "default", {
        selectedLabel: r.value,
        modelValue: m(s).modelValue.value
      }, () => [de(Y(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), lc = ac, uc = /* @__PURE__ */ F({
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
    const e = n, { nonce: t } = ut(e), i = Eu(t), s = Qt(), r = s.position === "item-aligned" ? Fu() : void 0, { forwardRef: o, currentElement: a } = ie();
    re(() => {
      s?.onViewportChange(a.value);
    });
    const l = A(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: h, contentWrapper: p } = r ?? {};
      if (h?.value && p?.value) {
        const f = Math.abs(l.value - d.scrollTop);
        if (f > 0) {
          const g = window.innerHeight - we * 2, v = Number.parseFloat(p.value.style.minHeight), _ = Number.parseFloat(p.value.style.height), S = Math.max(v, _);
          if (S < g) {
            const w = S + f, y = Math.min(g, w), x = w - y;
            p.value.style.height = `${y}px`, p.value.style.bottom === "0px" && (d.scrollTop = x > 0 ? x : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (E(), W(ve, null, [B(m(ne), Q({
      ref: m(o),
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
      default: I(() => [j(c.$slots, "default")]),
      _: 3
    }, 16), B(m(ne), {
      as: "style",
      nonce: m(i)
    }, {
      default: I(() => d[0] || (d[0] = [de(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), cc = uc;
const dc = /* @__PURE__ */ F({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, i = A(), s = A([]);
    return re(() => {
      const r = i.value?.closest(".speaker-sidebar");
      r && (s.value = [r]);
    }), (r, o) => (E(), W("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      B(m(Iu), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (a) => t("update:selectedValue", a))
      }, {
        default: I(() => [
          B(m(oc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: I(() => [
              B(m(lc), { class: "sidebar-select-trigger-label" }),
              B(m(Yu), null, {
                default: I(() => [
                  B(m(Er), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          B(m(sc), { disabled: "" }, {
            default: I(() => [
              B(m(Ku), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": s.value
              }, {
                default: I(() => [
                  B(m(cc), null, {
                    default: I(() => [
                      (E(!0), W(ve, null, Ye(n.items, (a) => (E(), q(m(Zu), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: I(() => [
                          B(m(ec), { class: "sidebar-select-item-indicator" }, {
                            default: I(() => [
                              B(m(Wi), { size: 14 })
                            ]),
                            _: 1
                          }),
                          B(m(nc), null, {
                            default: I(() => [
                              de(Y(a.label), 1)
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
              }, 8, ["collision-boundary"])
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["model-value"])
    ], 512));
  }
}), fc = { class: "sidebar-select" }, pc = ["aria-label"], hc = { class: "sidebar-select-trigger-label" }, mc = /* @__PURE__ */ F({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = A(!1), r = P(
      () => t.items.find((a) => a.value === t.selectedValue)?.label ?? ""
    );
    function o(a) {
      i("update:selectedValue", a), s.value = !1;
    }
    return (a, l) => (E(), W("div", fc, [
      H("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (u) => s.value = !0)
      }, [
        H("span", hc, Y(r.value), 1)
      ], 8, pc),
      B(m(is), {
        open: s.value,
        "onUpdate:open": l[2] || (l[2] = (u) => s.value = u)
      }, {
        default: I(() => [
          B(m(fs), { disabled: "" }, {
            default: I(() => [
              B(m(cs), { class: "editor-overlay" }),
              B(m(us), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: I(() => [
                  B(m(ps), { class: "sr-only" }, {
                    default: I(() => [
                      de(Y(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = H("div", { class: "sheet-handle" }, null, -1)),
                  B(m(mu), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (u) => o(u))
                  }, {
                    default: I(() => [
                      B(m(gu), { class: "sheet-list" }, {
                        default: I(() => [
                          (E(!0), W(ve, null, Ye(n.items, (u) => (E(), q(m(Cu), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: I(() => [
                              B(m(_u), { class: "sheet-item-indicator" }, {
                                default: I(() => [
                                  B(m(Wi), { size: 16 })
                                ]),
                                _: 1
                              }),
                              H("span", null, Y(u.label), 1)
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
}), jn = /* @__PURE__ */ F({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Ki();
    return (s, r) => m(i) ? (E(), q(mc, Q({ key: 0 }, s.$props, {
      "onUpdate:selectedValue": r[0] || (r[0] = (o) => t("update:selectedValue", o))
    }), null, 16)) : (E(), q(dc, Q({ key: 1 }, s.$props, {
      "onUpdate:selectedValue": r[1] || (r[1] = (o) => t("update:selectedValue", o))
    }), null, 16));
  }
}), Os = /* @__PURE__ */ F({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: s } = Ae(), r = P(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (E(), q(jn, {
      items: r.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: m(s)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), vc = { class: "speaker-sidebar" }, gc = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, yc = { class: "sidebar-title" }, bc = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, wc = { class: "sidebar-title" }, Sc = {
  key: 2,
  class: "sidebar-section"
}, Cc = { class: "sidebar-title" }, xc = { class: "subtitle-toggle" }, _c = { class: "subtitle-toggle-label" }, Ec = { class: "subtitle-slider" }, kc = { class: "subtitle-slider-label" }, Tc = { class: "subtitle-slider-value" }, Pc = ["value", "disabled"], Ac = {
  key: 3,
  class: "sidebar-section"
}, Oc = { class: "sidebar-title" }, Ic = { class: "speaker-list" }, Dc = { class: "speaker-name" }, Lc = /* @__PURE__ */ F({
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
    const e = n, t = Je(), { t: i, locale: s } = Ae(), r = P(
      () => Fi(e.translations, s.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (o, a) => (E(), W("aside", vc, [
      n.channels.length > 1 ? (E(), W("section", gc, [
        H("h2", yc, Y(m(i)("sidebar.channel")), 1),
        B(Os, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (E(), W("section", bc, [
        H("h2", wc, Y(m(i)("sidebar.translation")), 1),
        B(jn, {
          items: r.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: m(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      m(t).subtitle ? (E(), W("section", Sc, [
        H("h2", Cc, Y(m(i)("sidebar.subtitle")), 1),
        H("div", xc, [
          H("span", _c, Y(m(i)("subtitle.show")), 1),
          B(Oo, {
            modelValue: m(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => m(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        H("label", Ec, [
          H("span", kc, [
            de(Y(m(i)("subtitle.fontSize")) + " ", 1),
            H("span", Tc, Y(m(t).subtitle.fontSize.value) + "px", 1)
          ]),
          H("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: m(t).subtitle.fontSize.value,
            disabled: !m(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => m(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Pc)
        ])
      ])) : K("", !0),
      n.speakers.length ? (E(), W("section", Ac, [
        H("h2", Oc, Y(m(i)("sidebar.speakers")), 1),
        H("ul", Ic, [
          (E(!0), W(ve, null, Ye(n.speakers, (l) => (E(), W("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            B(Ui, {
              color: l.color
            }, null, 8, ["color"]),
            H("span", Dc, Y(l.name), 1)
          ]))), 128))
        ])
      ])) : K("", !0)
    ]));
  }
}), _i = /* @__PURE__ */ oe(Lc, [["__scopeId", "data-v-0a4624c1"]]), Rc = /* @__PURE__ */ F({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = Qs(n, "open"), { t } = Ae();
    return (i, s) => (E(), q(m(is), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (r) => e.value = r)
    }, {
      default: I(() => [
        B(m(fs), { disabled: "" }, {
          default: I(() => [
            B(m(cs), { class: "editor-overlay" }),
            B(m(us), { class: "sidebar-drawer" }, {
              default: I(() => [
                B(m(ps), { class: "sr-only" }, {
                  default: I(() => [
                    de(Y(m(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                B(m(va), {
                  class: "sidebar-close",
                  "aria-label": m(t)("header.closeSidebar")
                }, {
                  default: I(() => [
                    B(m(Hi), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                j(i.$slots, "default")
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
}), Mc = { class: "player-controls" }, $c = { class: "controls-left" }, Bc = { class: "controls-time" }, qc = { class: "time-display" }, Fc = { class: "time-display" }, zc = { class: "controls-right" }, Nc = ["value", "aria-label", "disabled"], Wc = /* @__PURE__ */ F({
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
    const t = e, { t: i } = Ae(), s = A(!1);
    function r(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (E(), W("div", Mc, [
      H("div", $c, [
        B(_e, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": m(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: I(() => [
            B(m(Ar), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        B(_e, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? m(i)("player.pause") : m(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: I(() => [
            n.isPlaying ? (E(), q(m(kr), {
              key: 0,
              size: 20
            })) : (E(), q(m(Tr), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        B(_e, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": m(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: I(() => [
            B(m(Or), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      H("div", Bc, [
        H("time", qc, Y(n.currentTime), 1),
        a[7] || (a[7] = H("span", { class: "time-separator" }, "/", -1)),
        H("time", Fc, Y(n.duration), 1)
      ]),
      H("div", zc, [
        H("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          B(_e, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? m(i)("player.unmute") : m(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: I(() => [
              n.isMuted ? (E(), q(m(Lr), {
                key: 0,
                size: 16
              })) : (E(), q(m(Dr), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          er(H("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": m(i)("player.volume"),
            disabled: !n.isReady,
            onInput: r
          }, null, 40, Nc), [
            [tr, s.value]
          ])
        ], 32),
        B(_e, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": m(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: I(() => [
            de(Y(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Hc = /* @__PURE__ */ oe(Wc, [["__scopeId", "data-v-02ebaa64"]]);
function ae(n, e, t, i) {
  return new (t || (t = Promise))((function(s, r) {
    function o(u) {
      try {
        l(i.next(u));
      } catch (c) {
        r(c);
      }
    }
    function a(u) {
      try {
        l(i.throw(u));
      } catch (c) {
        r(c);
      }
    }
    function l(u) {
      var c;
      u.done ? s(u.value) : (c = u.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(o, a);
    }
    l((i = i.apply(n, e || [])).next());
  }));
}
let xt = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...r) => {
        this.un(e, s), t(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
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
const Pt = { decode: function(n, e) {
  return ae(this, void 0, void 0, (function* () {
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
    const s = i[0];
    if (s.some(((r) => r > 1 || r < -1))) {
      const r = s.length;
      let o = 0;
      for (let a = 0; a < r; a++) {
        const l = Math.abs(s[a]);
        l > o && (o = l);
      }
      for (const a of i) for (let l = 0; l < r; l++) a[l] /= o;
    }
  })(n);
  const t = n.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (i) => {
    const s = t[i];
    if (!s) throw new Error(`Channel ${i} not found`);
    return s;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Is(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Is(r, o));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function Ei(n, e, t) {
  const i = Is(n, e || {});
  return t?.appendChild(i), i;
}
var Vc = Object.freeze({ __proto__: null, createElement: Ei, default: Ei });
const jc = { fetchBlob: function(n, e, t) {
  return ae(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(s, r) {
      ae(this, void 0, void 0, (function* () {
        if (!s.body || !s.headers) return;
        const o = s.body.getReader(), a = Number(s.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          r(d);
        };
        try {
          for (; ; ) {
            const c = yield o.read();
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
function te(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((s) => s(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Ue(n, e) {
  const t = te(n());
  return e.forEach(((i) => i.subscribe((() => {
    const s = n();
    Object.is(t.value, s) || t.set(s);
  })))), { get value() {
    return t.value;
  }, subscribe: (i) => t.subscribe(i) };
}
function qe(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, s = e.map(((r) => r.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((r) => r()));
  };
}
class Uc extends xt {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = te(!1), this._currentTime = te(0), this._duration = te(0), this._volume = te(this.media.volume), this._muted = te(this.media.muted), this._playbackRate = te(this.media.playbackRate || 1), this._seeking = te(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    const s = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (i && this.media.removeAttribute("src"), s || e) try {
      this.media.src = s;
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
    return ae(this, void 0, void 0, (function* () {
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
function Kc({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: s = 0, barAlign: r }) {
  let o = Math.round(n * t * i), a = o + Math.round(e * t * i) || 1;
  return a < s && (a = s, r || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function Xc({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: s }) {
  return n === "top" ? 0 : n === "bottom" ? s - i : e - t;
}
function ki(n, e, t) {
  const i = e - n.left, s = t - n.top;
  return [i / n.width, s / n.height];
}
function Ds(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Ti(n, e) {
  if (!Ds(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Pi({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, s = Math.floor(i * t);
  return [s - 1, s, s + 1];
}
function Ls(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Yc(n) {
  const e = te({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ue((() => (function(r) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = r;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = o / a, c = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Ue((() => (function(r) {
    return { left: r.scrollLeft, right: r.scrollLeft + r.clientWidth };
  })(e.value)), [e]), s = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", s, { passive: !0 }), { scrollData: e, percentages: t, bounds: i, cleanup: () => {
    n.removeEventListener("scroll", s), Ls(e);
  } };
}
class Gc extends xt {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [s, r] = this.initHtml();
    i.appendChild(s), this.container = s, this.scrollContainer = r.querySelector(".scroll"), this.wrapper = r.querySelector(".wrapper"), this.canvasWrapper = r.querySelector(".canvases"), this.progressWrapper = r.querySelector(".progress"), this.cursor = r.querySelector(".cursor"), t && r.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = ki(i, t.clientX, t.clientY);
      this.emit("click", s, r);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [s, r] = ki(i, t.clientX, t.clientY);
      this.emit("dblclick", s, r);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Yc(this.scrollContainer);
    const e = qe((() => {
      const { startX: t, endX: i } = this.scrollStream.percentages.value, { left: s, right: r } = this.scrollStream.bounds.value;
      this.emit("scroll", t, i, s, r);
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
      const { threshold: s = 3, mouseButton: r = 0, touchDelay: o = 100 } = i, a = te(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== r || (l.set(h.pointerId, h), l.size > 1)) return;
        let p = h.clientX, f = h.clientY, g = !1;
        const v = Date.now(), _ = t.getBoundingClientRect(), { left: S, top: w } = _, y = (T) => {
          if (T.defaultPrevented || l.size > 1 || u && Date.now() - v < o) return;
          const k = T.clientX, L = T.clientY, R = k - p, z = L - f;
          (g || Math.abs(R) > s || Math.abs(z) > s) && (T.preventDefault(), T.stopPropagation(), g || (a.set({ type: "start", x: p - S, y: f - w }), g = !0), a.set({ type: "move", x: k - S, y: L - w, deltaX: R, deltaY: z }), p = k, f = L);
        }, x = (T) => {
          if (l.delete(T.pointerId), g) {
            const k = T.clientX, L = T.clientY;
            a.set({ type: "end", x: k - S, y: L - w });
          }
          c();
        }, C = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || x(T);
        }, b = (T) => {
          g && (T.stopPropagation(), T.preventDefault());
        }, O = (T) => {
          T.defaultPrevented || l.size > 1 || g && T.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", x), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", O, { passive: !1 }), document.addEventListener("click", b, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", O), setTimeout((() => {
            document.removeEventListener("click", b, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), Ls(a);
      } };
    })(this.wrapper);
    const e = qe((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const i = this.wrapper.getBoundingClientRect().width, s = (r = t.x / i) < 0 ? 0 : r > 1 ? 1 : r;
      var r;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", s)) : t.type === "move" ? this.emit("drag", s) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", s));
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
    const s = () => {
      t && (clearTimeout(t), t = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(s), () => new Promise(((r, o) => {
      s(), i = o, t = setTimeout((() => {
        t = void 0, i = void 0, r();
      }), e);
    }));
  }
  getHeight(e, t) {
    var i;
    const s = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: r, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (r == null) return u;
      const c = Number(r);
      if (!isNaN(c)) return c;
      if (r === "auto") {
        const d = a || u;
        return o?.every(((h) => !h.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: s, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(i, s, r) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = r ?? o.height * s, u = a.createLinearGradient(0, 0, 0, l || s), c = 1 / (i.length - 1);
      return i.forEach(((d, h) => {
        u.addColorStop(h * c, d);
      })), u;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, i, s) {
    const { width: r, height: o } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: f, height: g, length: v, options: _, pixelRatio: S }) {
      const w = g / 2, y = _.barWidth ? _.barWidth * S : 1, x = _.barGap ? _.barGap * S : _.barWidth ? y / 2 : 0, C = y + x || 1;
      return { halfHeight: w, barWidth: y, barGap: x, barRadius: _.barRadius || 0, barMinHeight: _.barMinHeight ? _.barMinHeight * S : 0, barIndexScale: v > 0 ? f / C / v : 0, barSpacing: C };
    })({ width: r, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: f, barIndexScale: g, barSpacing: v, barWidth: _, halfHeight: S, vScale: w, canvasHeight: y, barAlign: x, barMinHeight: C }) {
      const b = f[0] || [], O = f[1] || b, T = b.length, k = [];
      let L = 0, R = 0, z = 0;
      for (let D = 0; D <= T; D++) {
        const M = Math.round(D * g);
        if (M > L) {
          const { topHeight: G, totalHeight: ee } = Kc({ maxTop: R, maxBottom: z, halfHeight: S, vScale: w, barMinHeight: C, barAlign: x }), ue = Xc({ barAlign: x, halfHeight: S, topHeight: G, totalHeight: ee, canvasHeight: y });
          k.push({ x: L * v, y: ue, width: _, height: ee }), L = M, R = 0, z = 0;
        }
        const X = Math.abs(b[D] || 0), V = Math.abs(O[D] || 0);
        X > R && (R = X), V > z && (z = V);
      }
      return k;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: o, barAlign: t.barAlign, barMinHeight: h });
    i.beginPath();
    for (const f of p) u && "roundRect" in i ? i.roundRect(f.x, f.y, f.width, f.height, u) : i.rect(f.x, f.y, f.width, f.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, s) {
    const { width: r, height: o } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, p = l[0] || [];
      return [p, l[1] || p].map(((f, g) => {
        const v = f.length, _ = v ? u / v : 0, S = h, w = g === 0 ? -1 : 1, y = [{ x: 0, y: S }];
        let x = 0, C = 0;
        for (let b = 0; b <= v; b++) {
          const O = Math.round(b * _);
          if (O > x) {
            const k = S + (Math.round(C * h * d) || 1) * w;
            y.push({ x, y: k }), x = O, C = 0;
          }
          const T = Math.abs(f[b] || 0);
          T > C && (C = T);
        }
        return y.push({ x, y: S }), y;
      }));
    })({ channelData: e, width: r, height: o, vScale: s });
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
    const s = (function({ channelData: r, barHeight: o, normalize: a, maxPeak: l }) {
      var u;
      const c = o || 1;
      if (!a) return c;
      const d = r[0];
      if (!d || d.length === 0) return c;
      let h = l ?? 0;
      if (!l) for (let p = 0; p < d.length; p++) {
        const f = (u = d[p]) !== null && u !== void 0 ? u : 0, g = Math.abs(f);
        g > h && (h = g);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Ds(t) ? this.renderBarWaveform(e, t, i, s) : this.renderLineWaveform(e, t, i, s);
  }
  renderSingleCanvas(e, t, i, s, r, o, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(s * l), u.style.width = `${i}px`, u.style.height = `${s}px`, u.style.left = `${Math.round(r)}px`, o.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), h = d.getContext("2d");
      h.drawImage(u, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(t.progressColor, h), h.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, s, r, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: f, totalWidth: g, options: v }) {
      return Ti(Math.min(8e3, f, g), v);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const h = (f) => {
      if (f < 0 || f >= p || d[f]) return;
      d[f] = !0;
      const g = f * c;
      let v = Math.min(u - g, c);
      if (v = Ti(v, t), v <= 0) return;
      const _ = (function({ channelData: S, offset: w, clampedWidth: y, totalWidth: x }) {
        return S.map(((C) => {
          const b = Math.floor(w / x * C.length), O = Math.floor((w + y) / x * C.length);
          return C.slice(b, O);
        }));
      })({ channelData: e, offset: g, clampedWidth: v, totalWidth: u });
      this.renderSingleCanvas(_, t, v, s, g, r, o);
    }, p = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let f = 0; f < p; f++) h(f);
      return;
    }
    if (Pi({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: p }).forEach(((f) => h(f))), p > 1) {
      const f = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (r.innerHTML = "", o.innerHTML = "", d = {}), Pi({ scrollLeft: g, totalWidth: u, numCanvases: p }).forEach(((v) => h(v)));
      }));
      this.unsubscribeOnScroll.push(f);
    }
  }
  renderChannel(e, t, i, s) {
    var { overlay: r } = t, o = (function(c, d) {
      var h = {};
      for (var p in c) Object.prototype.hasOwnProperty.call(c, p) && d.indexOf(p) < 0 && (h[p] = c[p]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var f = 0;
        for (p = Object.getOwnPropertySymbols(c); f < p.length; f++) d.indexOf(p[f]) < 0 && Object.prototype.propertyIsEnumerable.call(c, p[f]) && (h[p[f]] = c[p[f]]);
      }
      return h;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, r && s > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, o, i, l, a, u);
  }
  render(e) {
    return ae(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: r, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: p }) {
        const f = Math.ceil(u * c), g = f > d, v = !!(h && !g);
        return { scrollWidth: f, isScrollable: g, useParentWidth: v, width: (v ? d : f) * p };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: s, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${r}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
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
      const { right: i } = this.progressWrapper.getBoundingClientRect(), s = (function(r) {
        const o = 2 * r;
        return (o < 0 ? Math.floor(o) : Math.ceil(o)) / 2;
      })(i - t);
      this.scrollContainer.scrollLeft += s;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: i, scrollWidth: s, clientWidth: r } = this.scrollContainer, o = e * s, a = i, l = i + r, u = r / 2;
    if (this.isDragging)
      o + 30 > l ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > l) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? u : 0));
      const c = o - i - u;
      t && this.options.autoCenter && c > 0 && (this.scrollContainer.scrollLeft += c);
    }
  }
  renderProgress(e, t) {
    if (isNaN(e)) return;
    const i = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${i}% 0%, 100% 0%, 100% 100%, ${i}% 100%)`, this.progressWrapper.style.width = `${i}%`, this.cursor.style.left = `${i}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, t);
  }
  exportImage(e, t, i) {
    return ae(this, void 0, void 0, (function* () {
      const s = this.canvasWrapper.querySelectorAll("canvas");
      if (!s.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const r = Array.from(s).map(((o) => o.toDataURL(e, t)));
        return Promise.resolve(r);
      }
      return Promise.all(Array.from(s).map(((r) => new Promise(((o, a) => {
        r.toBlob(((l) => {
          l ? o(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class Jc extends xt {
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
class hn extends xt {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return ae(this, void 0, void 0, (function* () {
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
    return ae(this, void 0, void 0, (function* () {
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
    return ae(this, void 0, void 0, (function* () {
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
const Zc = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class bt extends Uc {
  static create(e) {
    return new bt(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new hn() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Zc, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, h, p;
      const f = (l = a?.currentTime) !== null && l !== void 0 ? l : te(0), g = (u = a?.duration) !== null && u !== void 0 ? u : te(0), v = (c = a?.isPlaying) !== null && c !== void 0 ? c : te(!1), _ = (d = a?.isSeeking) !== null && d !== void 0 ? d : te(!1), S = (h = a?.volume) !== null && h !== void 0 ? h : te(1), w = (p = a?.playbackRate) !== null && p !== void 0 ? p : te(1), y = te(null), x = te(null), C = te(""), b = te(0), O = te(0), T = Ue((() => !v.value), [v]), k = Ue((() => y.value !== null), [y]), L = Ue((() => k.value && g.value > 0), [k, g]), R = Ue((() => f.value), [f]), z = Ue((() => g.value > 0 ? f.value / g.value : 0), [f, g]);
      return { state: { currentTime: f, duration: g, isPlaying: v, isPaused: T, isSeeking: _, volume: S, playbackRate: w, audioBuffer: y, peaks: x, url: C, zoom: b, scrollPosition: O, canPlay: k, isReady: L, progress: R, progressPercent: z }, actions: { setCurrentTime: (D) => {
        const M = Math.max(0, Math.min(g.value || 1 / 0, D));
        f.set(M);
      }, setDuration: (D) => {
        g.set(Math.max(0, D));
      }, setPlaying: (D) => {
        v.set(D);
      }, setSeeking: (D) => {
        _.set(D);
      }, setVolume: (D) => {
        const M = Math.max(0, Math.min(1, D));
        S.set(M);
      }, setPlaybackRate: (D) => {
        const M = Math.max(0.1, Math.min(16, D));
        w.set(M);
      }, setAudioBuffer: (D) => {
        y.set(D), D && g.set(D.duration);
      }, setPeaks: (D) => {
        x.set(D);
      }, setUrl: (D) => {
        C.set(D);
      }, setZoom: (D) => {
        b.set(Math.max(0, D));
      }, setScrollPosition: (D) => {
        O.set(Math.max(0, D));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new Jc();
    const r = t ? void 0 : this.getMediaElement();
    this.renderer = new Gc(this.options, r), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const o = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (o || a && l) && this.load(o, a, l).catch(((u) => {
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
      i.push(qe((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), i.push(qe((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), i.push(qe((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let s = !1;
      i.push(qe((() => {
        e.isReady.value && !s && (s = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let r = !1;
      return i.push(qe((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        r && !o && u && t.emit("finish"), r = o && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(qe((() => {
        const o = e.zoom.value;
        o > 0 && t.emit("zoom", o);
      }), [e.zoom])), () => {
        i.forEach(((o) => o()));
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
    })), this.renderer.on("scroll", ((e, t, i, s) => {
      const r = this.getDuration();
      this.emit("scroll", e * r, t * r, i, s);
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
        var s;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let r = 0;
        const o = this.options.dragToSeek;
        this.isPlaying() ? r = 0 : o === !0 ? r = 200 : o && typeof o == "object" && (r = (s = o.debounceTime) !== null && s !== void 0 ? s : 200), e = setTimeout((() => {
          this.seekTo(i);
        }), r), this.emit("interaction", i * this.getDuration()), this.emit("drag", i);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Pt.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Pt.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
  loadAudio(e, t, i, s) {
    return ae(this, void 0, void 0, (function* () {
      var r;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (r = this.abortController) === null || r === void 0 || r.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield jc.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (t = new Blob([t], { type: u }));
      }
      this.setSrc(e, t);
      const o = yield new Promise(((a) => {
        const l = s || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof hn && (a.duration = o);
      }
      if (i) this.decodedData = Pt.createBuffer(i, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Pt.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, i) {
    return ae(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, i);
      } catch (s) {
        throw this.emit("error", s), s;
      }
    }));
  }
  loadBlob(e, t, i) {
    return ae(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, i);
      } catch (s) {
        throw this.emit("error", s), s;
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
    const s = Math.min(e, this.decodedData.numberOfChannels), r = [];
    for (let o = 0; o < s; o++) {
      const a = this.decodedData.getChannelData(o), l = [], u = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let h = 0;
        for (let p = 0; p < d.length; p++) {
          const f = d[p];
          Math.abs(f) > Math.abs(h) && (h = f);
        }
        l.push(Math.round(h * i) / i);
      }
      r.push(l);
    }
    return r;
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
    return ae(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const s = yield i.play.call(this);
      return t != null && (this.media instanceof hn ? this.media.stopAt(t) : this.stopAtPosition = t), s;
    }));
  }
  playPause() {
    return ae(this, void 0, void 0, (function* () {
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
    return ae(this, arguments, void 0, (function* (e = "image/png", t = 1, i = "dataURL") {
      return this.renderer.exportImage(e, t, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
bt.BasePlugin = class extends xt {
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
}, bt.dom = Vc;
class Rs {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...r) => {
        this.un(e, s), t(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
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
class Qc extends Rs {
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
function Ms(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [r, o] of Object.entries(s)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Ms(r, o));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function pt(n, e, t) {
  const i = Ms(n, e || {});
  return t?.appendChild(i), i;
}
function $s(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((s) => s(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function It(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, s = e.map(((r) => r.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((r) => r()));
  };
}
function it(n, e) {
  const t = $s(null), i = (s) => {
    t.set(s);
  };
  return n.addEventListener(e, i), t._cleanup = () => {
    n.removeEventListener(e, i);
  }, t;
}
function je(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Dt(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, r = $s(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, h = c.clientY, p = !1;
    const f = Date.now(), g = n.getBoundingClientRect(), { left: v, top: _ } = g, S = (b) => {
      if (b.defaultPrevented || o.size > 1 || a && Date.now() - f < s) return;
      const O = b.clientX, T = b.clientY, k = O - d, L = T - h;
      (p || Math.abs(k) > t || Math.abs(L) > t) && (b.preventDefault(), b.stopPropagation(), p || (r.set({ type: "start", x: d - v, y: h - _ }), p = !0), r.set({ type: "move", x: O - v, y: T - _, deltaX: k, deltaY: L }), d = O, h = T);
    }, w = (b) => {
      if (o.delete(b.pointerId), p) {
        const O = b.clientX, T = b.clientY;
        r.set({ type: "end", x: O - v, y: T - _ });
      }
      l();
    }, y = (b) => {
      o.delete(b.pointerId), b.relatedTarget && b.relatedTarget !== document.documentElement || w(b);
    }, x = (b) => {
      p && (b.stopPropagation(), b.preventDefault());
    }, C = (b) => {
      b.defaultPrevented || o.size > 1 || p && b.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", w), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", w), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", x, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: r, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), o.clear(), je(r);
  } };
}
class Ai extends Rs {
  constructor(e, t, i = 0) {
    var s, r, o, a, l, u, c, d, h, p;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (r = e.drag) === null || r === void 0 || r, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = pt("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = pt("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), r = Dt(i, { threshold: 1 }), o = Dt(s, { threshold: 1 }), a = It((() => {
      const u = r.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [r.signal]), l = It((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), l(), r.cleanup(), o.cleanup();
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
    const s = pt("div", { style: { position: "absolute", top: `${t}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(s), s;
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
    const t = it(e, "click"), i = it(e, "mouseenter"), s = it(e, "mouseleave"), r = it(e, "dblclick"), o = it(e, "pointerdown"), a = it(e, "pointerup"), l = t.subscribe(((v) => v && this.emit("click", v))), u = i.subscribe(((v) => v && this.emit("over", v))), c = s.subscribe(((v) => v && this.emit("leave", v))), d = r.subscribe(((v) => v && this.emit("dblclick", v))), h = o.subscribe(((v) => v && this.toggleCursor(!0))), p = a.subscribe(((v) => v && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), p(), je(t), je(i), je(s), je(r), je(o), je(a);
    }));
    const f = Dt(e), g = It((() => {
      const v = f.signal.value;
      v && (v.type === "start" ? this.toggleCursor(!0) : v.type === "move" && v.deltaX !== void 0 ? this.onMove(v.deltaX) : v.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [f.signal]);
    this.subscriptions.push((() => {
      g(), f.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (v) => this.onContentClick(v), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, i) {
    var s;
    if (!(!((s = this.element) === null || s === void 0) && s.parentElement)) return;
    const { width: r } = this.element.parentElement.getBoundingClientRect(), o = e / r * this.totalDuration;
    let a = t && t !== "start" ? this.start : this.start + o, l = t && t !== "end" ? this.end : this.end + o;
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
        this.content = pt("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (i) => this.onContentClick(i), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var t, i;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const s = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : s ? this.start : this.end), this.renderPosition(), this.setPart();
      }
      if (e.content && this.setContent(e.content), e.id && (this.id = e.id, this.setPart()), e.resize !== void 0 && e.resize !== this.resize) {
        const s = this.start === this.end;
        this.resize = e.resize, this.resize && !s ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      e.resizeStart !== void 0 && (this.resizeStart = e.resizeStart), e.resizeEnd !== void 0 && (this.resizeEnd = e.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = !0, this.emit("remove"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class Un extends Qc {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Un(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((i) => i._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const i = this.regions.filter(((s) => s.start <= t && (s.end === s.start ? s.start + 0.05 : s.end) >= t));
      i.forEach(((s) => {
        e.includes(s) || this.emit("region-in", s);
      })), e.forEach(((s) => {
        i.includes(s) || this.emit("region-out", s);
      })), e = i;
    })));
  }
  initRegionsContainer() {
    return pt("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, i = t.getBoundingClientRect(), s = this.regions.map(((r) => {
        if (r === e || !r.content) return 0;
        const o = r.content.getBoundingClientRect();
        return i.left < o.left + o.width && o.left < i.left + i.width ? o.height : 0;
      })).reduce(((r, o) => r + o), 0);
      t.style.marginTop = `${s}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, i;
    if (!e.element) return;
    const s = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!s) return;
    const { clientWidth: r, scrollWidth: o } = s;
    if (o <= r) return;
    const a = s.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? s.scrollLeft += u : c > r && (s.scrollLeft += c - r);
  }
  virtualAppend(e, t, i) {
    const s = () => {
      if (!this.wavesurfer) return;
      const r = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > o && u < o + r;
      c && !i.parentElement ? t.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      s();
      const r = this.wavesurfer.on("scroll", s), o = this.wavesurfer.on("zoom", s), a = this.wavesurfer.on("resize", s);
      this.subscriptions.push(r, o, a), e.once("remove", (() => {
        r(), o(), a();
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
      var s;
      (s = this.wavesurfer) === null || s === void 0 || s.play(e.start, i);
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
    const s = this.wavesurfer.getDuration(), r = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, o = new Ai(e, s, r);
    return this.emit("region-initialized", o), s ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      o._setTotalDuration(a), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, t = 3) {
    var i;
    const s = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(s && s instanceof HTMLElement)) return () => {
    };
    let r = null, o = 0, a = 0;
    const l = Dt(s, { threshold: t }), u = It((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (o = h.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), f = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / g * p;
        const v = h.x / g * p, _ = (h.x + 5) / g * p;
        r = new Ai(Object.assign(Object.assign({}, e), { start: v, end: _ }), p, f), this.emit("region-initialized", r), r.element && this.regionsContainer.appendChild(r.element);
      } else h.type === "move" && h.deltaX !== void 0 ? r && r._onUpdate(h.deltaX, h.x > o ? "end" : "start", a) : h.type === "end" && r && (this.saveRegion(r), r.updatingSide = void 0, r = null);
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
const mn = [0.5, 0.75, 1, 1.25, 1.5, 2];
function ed(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: s } = n, r = ot(null), o = ot(null), a = A(0), l = A(0), u = A(!1), c = A(!1), d = A(!1), h = A(1), p = A(1), f = A(!1), g = P(() => Mt(a.value)), v = P(() => Mt(l.value));
  function _(D, M) {
    R(), d.value = !0, c.value = !1;
    const X = Un.create();
    o.value = X;
    const V = bt.create({
      container: D,
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
      renderFunction: gr,
      url: M,
      plugins: [X]
    });
    V.on("ready", () => {
      c.value = !0, d.value = !1, l.value = V.getDuration(), S();
    }), V.on("timeupdate", (G) => {
      a.value = G;
    }), V.on("play", () => {
      u.value = !0;
    }), V.on("pause", () => {
      u.value = !1;
    }), V.on("finish", () => {
      u.value = !1;
    }), r.value = V;
  }
  function S() {
    const D = o.value;
    if (D) {
      D.clearRegions();
      for (const M of i.value) {
        const X = M.speakerId ? s.value.get(M.speakerId) : void 0;
        if (!X || M.startTime == null || M.endTime == null) continue;
        const V = X.color;
        D.addRegion({
          start: M.startTime,
          end: M.endTime,
          color: hr(V, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", V);
      }
    }
  }
  function w() {
    r.value?.play();
  }
  function y() {
    r.value?.pause();
  }
  function x() {
    r.value?.playPause();
  }
  function C(D) {
    const M = r.value;
    !M || l.value === 0 || M.setTime(D);
  }
  function b(D) {
    C(Math.max(0, Math.min(a.value + D, l.value)));
  }
  function O(D) {
    const M = r.value;
    M && (h.value = D, M.setVolume(D), D > 0 && f.value && (f.value = !1, M.setMuted(!1)));
  }
  function T() {
    const D = r.value;
    D && (f.value = !f.value, D.setMuted(f.value));
  }
  function k(D) {
    const M = r.value;
    M && (p.value = D, M.setPlaybackRate(D));
  }
  function L() {
    const M = (mn.indexOf(
      p.value
    ) + 1) % mn.length;
    k(mn[M] ?? 1);
  }
  function R() {
    z !== null && (clearTimeout(z), z = null), r.value && (r.value.destroy(), r.value = null, o.value = null);
  }
  Z(
    [e, t],
    ([D, M]) => {
      D && M && _(D, M);
    },
    { immediate: !0 }
  );
  let z = null;
  return Z([i, s], () => {
    c.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, S();
    }, 150));
  }), wt(() => {
    R();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: p,
    isMuted: f,
    formattedCurrentTime: g,
    formattedDuration: v,
    play: w,
    pause: y,
    togglePlay: x,
    seekTo: C,
    skip: b,
    setVolume: O,
    setPlaybackRate: k,
    cyclePlaybackRate: L,
    toggleMute: T
  };
}
const td = { class: "audio-player" }, nd = /* @__PURE__ */ F({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, s = t, r = A(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: p,
      formattedDuration: f,
      togglePlay: g,
      seekTo: v,
      pause: _,
      skip: S,
      setVolume: w,
      cyclePlaybackRate: y,
      toggleMute: x
    } = ed({
      containerRef: r,
      audioSrc: At(() => i.audioSrc),
      turns: At(() => i.turns),
      speakers: At(() => i.speakers)
    });
    return Z(h, (C) => s("timeupdate", C)), Z(o, (C) => s("playStateChange", C)), e({ seekTo: v, pause: _ }), (C, b) => (E(), W("footer", td, [
      H("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Rt(["waveform-container", { "waveform-container--loading": m(l) }])
      }, null, 2),
      B(Hc, {
        "is-playing": m(o),
        "current-time": m(p),
        duration: m(f),
        volume: m(u),
        "playback-rate": m(c),
        "is-muted": m(d),
        "is-ready": m(a),
        onTogglePlay: m(g),
        onSkipBack: b[0] || (b[0] = (O) => m(S)(-10)),
        onSkipForward: b[1] || (b[1] = (O) => m(S)(10)),
        "onUpdate:volume": m(w),
        onToggleMute: m(x),
        onCyclePlaybackRate: m(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), id = /* @__PURE__ */ oe(nd, [["__scopeId", "data-v-9248e45e"]]);
class sd {
  diff(e, t, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const r = this.castInput(e, i), o = this.castInput(t, i), a = this.removeEmpty(this.tokenize(r, i)), l = this.removeEmpty(this.tokenize(o, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, t, i, s) {
    var r;
    const o = (S) => {
      if (S = this.postProcess(S, i), s) {
        setTimeout(function() {
          s(S);
        }, 0);
        return;
      } else
        return S;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (r = i.timeout) !== null && r !== void 0 ? r : 1 / 0, h = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let f = this.extractCommon(p[0], t, e, 0, i);
    if (p[0].oldPos + 1 >= l && f + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, t, e));
    let g = -1 / 0, v = 1 / 0;
    const _ = () => {
      for (let S = Math.max(g, -u); S <= Math.min(v, u); S += 2) {
        let w;
        const y = p[S - 1], x = p[S + 1];
        y && (p[S - 1] = void 0);
        let C = !1;
        if (x) {
          const O = x.oldPos - S;
          C = x && 0 <= O && O < a;
        }
        const b = y && y.oldPos + 1 < l;
        if (!C && !b) {
          p[S] = void 0;
          continue;
        }
        if (!b || C && y.oldPos < x.oldPos ? w = this.addToPath(x, !0, !1, 0, i) : w = this.addToPath(y, !1, !0, 1, i), f = this.extractCommon(w, t, e, S, i), w.oldPos + 1 >= l && f + 1 >= a)
          return o(this.buildValues(w.lastComponent, t, e)) || !0;
        p[S] = w, w.oldPos + 1 >= l && (v = Math.min(v, S - 1)), f + 1 >= a && (g = Math.max(g, S + 1));
      }
      u++;
    };
    if (s)
      (function S() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return s(void 0);
          _() || S();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= h; ) {
        const S = _();
        if (S)
          return S;
      }
  }
  addToPath(e, t, i, s, r) {
    const o = e.lastComponent;
    return o && !r.oneChangePerToken && o.added === t && o.removed === i ? {
      oldPos: e.oldPos + s,
      lastComponent: { count: o.count + 1, added: t, removed: i, previousComponent: o.previousComponent }
    } : {
      oldPos: e.oldPos + s,
      lastComponent: { count: 1, added: t, removed: i, previousComponent: o }
    };
  }
  extractCommon(e, t, i, s, r) {
    const o = t.length, a = i.length;
    let l = e.oldPos, u = l - s, c = 0;
    for (; u + 1 < o && l + 1 < a && this.equals(i[l + 1], t[u + 1], r); )
      u++, l++, c++, r.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !r.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, u;
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
    const s = [];
    let r;
    for (; e; )
      s.push(e), r = e.previousComponent, delete e.previousComponent, e = r;
    s.reverse();
    const o = s.length;
    let a = 0, l = 0, u = 0;
    for (; a < o; a++) {
      const c = s[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(l, l + c.count);
          d = d.map(function(h, p) {
            const f = i[u + p];
            return f.length > h.length ? f : h;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return s;
  }
}
class rd extends sd {
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
const od = new rd();
function ad(n, e, t) {
  return od.diff(n, e, t);
}
function vn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), r = t.split(" "), o = ad(s, r, {
    comparator: ud
  }), a = ld(o), l = [...e];
  let u = [...e], c = 0;
  for (const p of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in p && p.replaced)
      u = Lt(
        u,
        l[0],
        p.countAdded - p.countRemoved
      ), c += p.countRemoved;
    else if ("removed" in p && p.removed) {
      const f = p;
      c += f.count, u = Lt(
        u,
        l[0],
        -f.count
      );
    } else if ("added" in p && p.added) {
      const f = p;
      u = Lt(
        u,
        l[0],
        f.count
      );
    } else
      c += p.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = r.slice(d).join(" ");
  if (i(h)) {
    const f = Bs(
      h,
      i
    ).map(
      (g) => g + d
    );
    u = u.concat(f);
  }
  return {
    previousIndexes: u,
    previousText: t
  };
}
function ld(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (t + 1 < n.length) {
      const s = n[t + 1];
      if (s.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: s.added ?? !1,
          countRemoved: i.count,
          countAdded: s.count
        }), t++;
        continue;
      }
    }
    e.push(i);
  }
  return e;
}
function Lt(n, e, t) {
  return n.map((i) => i >= e ? i + t : i);
}
function Bs(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let i;
  for (i = 0; i < t.length; i++) {
    const s = t.slice(0, i).join(" ");
    if (e(s)) break;
  }
  return [i - 1].concat(
    Lt(
      Bs(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function ud(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(t.length, i.length);
  let r = 0;
  for (let a = 0; a < s; a++)
    t[a] === i[a] && r++;
  return r / t.length > 0.8;
}
class cd {
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
    color: s = "white",
    font: r = "Arial",
    paddingInline: o = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = i, this.color = s, this.font = r, this.paddingInline = o, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
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
    const s = this.canvas.getContext("2d");
    s.font = `${this.fontSize}px ${this.font}`, s.fillStyle = this.color, s.fillText(e, t + this.paddingInline, i);
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
class dd extends cd {
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
    this.resetAll(), this.currentState = vn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = vn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = vn(
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
function qs(n) {
  const e = Je();
  let t = null;
  re(() => {
    n.canvasRef.value && (t = new dd(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), Z(
    () => e.live?.partial.value,
    (l) => {
      l && t && t.newPartial(l);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: l }) => {
    if (!t) return;
    const u = l.words.length > 0 ? l.words.map((c) => c.text).join(" ") : l.text ?? "";
    u && t.newFinal(u);
  });
  function s() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const r = e.on("translation:change", s), o = e.on("translation:sync", s), a = e.on("channel:sync", s);
  St(() => {
    i(), r(), o(), a(), t?.dispose(), t = null;
  });
}
const fd = ["height"], pd = /* @__PURE__ */ F({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Je(), t = mt("canvas"), i = P(() => e.subtitle?.fontSize.value ?? 40), s = P(() => 1.2 * i.value), r = P(() => 2.4 * i.value);
    return qs({
      canvasRef: t,
      fontSize: i.value,
      lineHeight: s.value
    }), (o, a) => (E(), W("div", {
      class: "subtitle-banner",
      style: lt({ height: r.value + "px" })
    }, [
      H("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: r.value
      }, null, 8, fd)
    ], 4));
  }
}), hd = /* @__PURE__ */ oe(pd, [["__scopeId", "data-v-b80652cd"]]), md = {
  ref: "container",
  class: "subtitle-fullscreen"
}, vd = ["aria-label"], gd = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Oi = 48, yd = /* @__PURE__ */ F({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Je(), { t } = Ae(), i = mt("container"), s = mt("canvas");
    qs({
      canvasRef: s,
      fontSize: Oi,
      lineHeight: 1.2 * Oi
    }), re(async () => {
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
    function r() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    re(() => {
      document.addEventListener("fullscreenchange", r);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return St(() => {
      document.removeEventListener("fullscreenchange", r);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (E(), W("div", md, [
      H("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": m(t)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        B(m(Hi), { size: 24 })
      ], 8, vd),
      H("canvas", gd, null, 512)
    ], 512));
  }
}), bd = /* @__PURE__ */ oe(yd, [["__scopeId", "data-v-cfe63125"]]), wd = { class: "editor-layout" }, Sd = { class: "editor-body" }, Cd = {
  key: 4,
  class: "mobile-selectors"
}, xd = /* @__PURE__ */ F({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Je(), { t: i, locale: s } = Ae(), { isMobile: r } = Ki(), o = A(!1), a = P(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), l = t.speakers.all, u = P(() => [...t.channels.values()]), c = P(() => [
      ...t.activeChannel.value.translations.values()
    ]), d = P(
      () => t.activeChannel.value.activeTranslation.value.id
    ), h = P(() => Array.from(l.values())), p = mt("audioPlayer");
    function f(S) {
      t.audio && (t.audio.currentTime.value = S);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        p.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), o.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((S) => p.value?.seekTo(S));
    const g = P(
      () => Fi(
        c.value,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function v(S) {
      t.setActiveChannel(S);
    }
    function _(S) {
      t.activeChannel.value.setActiveTranslation(S);
    }
    return (S, w) => (E(), W("div", wd, [
      e.showHeader ? (E(), q(Kr, {
        key: 0,
        title: m(t).title.value,
        duration: m(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": m(r),
        onToggleSidebar: w[0] || (w[0] = (y) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      H("main", Sd, [
        B(Eo, {
          turns: a.value,
          speakers: m(l)
        }, null, 8, ["turns", "speakers"]),
        m(r) ? K("", !0) : (E(), q(_i, {
          key: 0,
          speakers: h.value,
          channels: u.value,
          "selected-channel-id": m(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": v,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        m(r) ? (E(), q(Rc, {
          key: 1,
          open: o.value,
          "onUpdate:open": w[1] || (w[1] = (y) => o.value = y)
        }, {
          default: I(() => [
            B(_i, {
              speakers: h.value,
              channels: u.value,
              "selected-channel-id": m(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": v,
              "onUpdate:selectedTranslationId": _
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : K("", !0)
      ]),
      m(t).audio?.src.value ? (E(), q(id, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": m(t).audio.src.value,
        turns: a.value,
        speakers: m(l),
        onTimeupdate: f,
        onPlayStateChange: w[2] || (w[2] = (y) => {
          m(t).audio && (m(t).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      m(t).subtitle?.isVisible.value && !m(r) && !m(t).subtitle.isFullscreen.value ? (E(), q(hd, { key: 2 })) : K("", !0),
      m(t).subtitle?.isFullscreen.value ? (E(), q(bd, { key: 3 })) : K("", !0),
      m(r) && (u.value.length > 1 || c.value.length > 1) ? (E(), W("div", Cd, [
        u.value.length > 1 ? (E(), q(Os, {
          key: 0,
          channels: u.value,
          "selected-channel-id": m(t).activeChannelId.value,
          "onUpdate:selectedChannelId": v
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (E(), q(jn, {
          key: 1,
          items: g.value,
          "selected-value": d.value,
          ariaLabel: m(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": _
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), Dd = /* @__PURE__ */ oe(xd, [["__scopeId", "data-v-1771a042"]]);
function Ld() {
  return {
    name: "audio",
    install(n) {
      const e = A(0), t = A(!1);
      let i = null;
      const s = P(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function r(l) {
        i?.(l);
      }
      function o(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: t,
        src: s,
        seekTo: r,
        setSeekHandler: o
      };
      return n.audio = a, () => {
        n.audio = void 0;
      };
    }
  };
}
function Ii(n) {
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
function gn(n, e) {
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
function Rd() {
  return {
    name: "live",
    install(n) {
      const e = ot(null), t = A(!1);
      t.value = !0;
      function i() {
        e.value = null, Xn(e);
      }
      function s(w, y) {
        if (n.activeChannelId.value !== y) return;
        const x = n.activeChannel.value.activeTranslation.value;
        if (x.isSource) {
          if (w.text == null) return;
          e.value = w.text;
        } else if (w.translations) {
          const C = w.translations.find(
            (b) => b.translationId === x.id
          );
          e.value = C?.text ?? null;
        } else
          return;
        Xn(e);
      }
      let r = null;
      function o() {
        r === null && (r = setTimeout(() => {
          r = null, i();
        }, 150));
      }
      function a() {
        r !== null && (clearTimeout(r), r = null);
      }
      function l(w, y) {
        w.turns.value.some((C) => C.id === y.id) ? w.updateTurn(y.id, y) : w.addTurn(y);
      }
      function u(w, y) {
        w.speakerId && n.speakers.ensure(w.speakerId);
        const x = n.channels.get(y);
        if (!x) {
          h();
          return;
        }
        if (w.text != null && l(
          x.sourceTranslation,
          Ii(w)
        ), w.translations)
          for (const C of w.translations) {
            const b = x.translations.get(C.translationId);
            b && l(
              b,
              gn(w, C)
            );
          }
        h();
      }
      function c(w, y) {
        d([w], y);
      }
      function d(w, y) {
        const x = n.channels.get(y);
        if (!x) return;
        const C = /* @__PURE__ */ new Set();
        for (const T of w)
          T.speakerId && !C.has(T.speakerId) && (C.add(T.speakerId), n.speakers.ensure(T.speakerId));
        const b = [];
        for (const T of w)
          T.text != null && b.push(Ii(T));
        b.length > 0 && x.sourceTranslation.prependTurns(b);
        const O = /* @__PURE__ */ new Map();
        for (const T of w)
          if (T.translations)
            for (const k of T.translations) {
              let L = O.get(k.translationId);
              L || (L = [], O.set(k.translationId, L)), L.push(gn(T, k));
            }
        for (const [T, k] of O) {
          const L = x.translations.get(T);
          L && L.prependTurns(k);
        }
      }
      function h() {
        a(), i();
      }
      function p(w) {
        const y = n.activeChannel.value.activeTranslation.value, x = n.activeChannel.value;
        if (!w.final && y.languages.includes(w.language))
          e.value = w.text;
        else if (w.final) {
          const C = x.translations.get(w.language);
          C && l(
            C,
            gn({ ...w }, w)
          );
        }
      }
      const f = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: s,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: p
      }, g = n.on(
        "channel:change",
        h
      ), v = n.on(
        "translation:change",
        h
      ), _ = n.on(
        "translation:sync",
        o
      ), S = n.on("channel:sync", o);
      return n.live = f, () => {
        h(), g(), v(), _(), S(), n.live = void 0;
      };
    }
  };
}
function Md(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = A(n.fontSize ?? 40), i = A(!0), s = A(!1), r = {
        fontSize: t,
        isVisible: i,
        isFullscreen: s,
        enterFullscreen() {
          s.value = !0;
        },
        exitFullscreen() {
          s.value = !1;
        }
      };
      return e.subtitle = r, () => {
        i.value = !1, s.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function _d(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function $d(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.speakers)
    e.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: ""
    });
  const t = n.text.map((s) => {
    const r = s.words.map(_d), o = r[0]?.startTime ?? s.stime, a = r.length > 0 ? r[r.length - 1].endTime ?? s.etime : s.etime;
    return {
      id: s.turn_id,
      speakerId: s.speaker_id || null,
      text: r.length > 0 ? null : s.segment,
      words: r,
      ...o !== void 0 && { startTime: o },
      ...a !== void 0 && { endTime: a },
      language: s.language
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
let Fs = 0;
function Ed(n) {
  return {
    id: `w_${Fs++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function Bd(n) {
  Fs = 0;
  const e = /* @__PURE__ */ new Map();
  for (const r of n.segments)
    r.speaker && !e.has(r.speaker) && e.set(r.speaker, {
      id: r.speaker,
      name: r.speaker,
      color: ""
    });
  const t = n.language ?? "fr", i = n.segments.map((r, o) => {
    const a = r.words.map(Ed);
    return {
      id: `turn_${o}`,
      speakerId: r.speaker ?? null,
      text: a.length > 0 ? null : r.text,
      words: a,
      startTime: r.start,
      endTime: r.end,
      language: t
    };
  }), s = n.segments.length > 0 ? n.segments[n.segments.length - 1].end : 0;
  return {
    title: "",
    speakers: e,
    channels: [
      {
        id: "default",
        name: "Canal 1",
        duration: s,
        translations: [
          {
            id: "source",
            languages: [t],
            isSource: !0,
            turns: i
          }
        ]
      }
    ]
  };
}
export {
  ce as DocumentValidationError,
  Dd as EditorLayout,
  Ld as createAudioPlugin,
  Td as createEditorStore,
  Rd as createLivePlugin,
  Md as createSubtitlePlugin,
  $d as mapApiDocument,
  Bd as mapWhisperXDocument,
  Pd as provideEditorStore,
  Ad as provideI18n,
  Je as useEditorStore,
  vr as validateEditorDocument
};
