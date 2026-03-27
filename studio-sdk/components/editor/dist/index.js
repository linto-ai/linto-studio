import * as Kn from "vue";
import { shallowReactive as An, ref as A, computed as P, inject as Ht, provide as Vt, h as De, defineComponent as F, openBlock as E, createElementBlock as W, renderSlot as V, useSlots as zs, normalizeClass as Bt, createCommentVNode as K, createElementVNode as H, toDisplayString as Y, createVNode as q, withCtx as O, createTextVNode as de, createBlock as M, unref as p, watchEffect as ye, onBeforeUnmount as _t, normalizeStyle as lt, Fragment as ve, renderList as Ye, createStaticVNode as Ns, useTemplateRef as vt, onMounted as oe, watch as Z, nextTick as se, Transition as Ws, useId as Hs, customRef as Vs, toValue as le, getCurrentScope as Di, onScopeDispose as Ri, effectScope as Mi, getCurrentInstance as Ge, shallowRef as rt, readonly as js, toHandlerKey as Us, camelize as $i, toRef as Lt, onUnmounted as ut, toRefs as ct, Comment as Ks, mergeProps as Q, cloneVNode as Xs, reactive as Bi, Teleport as qi, normalizeProps as On, guardReactiveProps as In, markRaw as Ys, watchPostEffect as Fi, shallowReadonly as tt, mergeDefaults as Gs, withKeys as gt, withModifiers as Fe, watchSyncEffect as Js, withMemo as Zs, resolveDynamicComponent as Qs, useModel as eo, withDirectives as to, vShow as no, triggerRef as Xn } from "vue";
function io() {
  const n = /* @__PURE__ */ new Map();
  function e(o, r) {
    let a = n.get(o);
    return a || (a = /* @__PURE__ */ new Set(), n.set(o, a)), a.add(r), () => t(o, r);
  }
  function t(o, r) {
    n.get(o)?.delete(r);
  }
  function i(o, r) {
    n.get(o)?.forEach(
      (a) => a(r)
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
function so(n, e, t) {
  const i = Yn[n.size % Yn.length];
  return { id: e, name: t, color: i };
}
function oo(n, e, t) {
  return !e || n.has(e) ? null : so(n, e, t ?? e);
}
function ro(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function ao(n) {
  const e = An(/* @__PURE__ */ new Map());
  function t(o, r) {
    const a = oo(e, o, r);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(o, r) {
    const a = ro(e, o, r);
    a && (e.set(o, a), n("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: s };
}
function lo(n, e) {
  return [...n, e];
}
function uo(n, e) {
  return [...e, ...n];
}
function co(n, e, t) {
  const i = n.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const s = { ...n[i], ...t, id: e };
  return {
    turns: n.map((o, r) => r === i ? s : o),
    updated: s
  };
}
function fo(n, e) {
  const t = n.findIndex((i) => i.id === e);
  return t === -1 ? null : n.filter((i, s) => s !== t);
}
function po(n, e, t) {
  const i = n.findIndex((r) => r.id === e);
  if (i === -1) return null;
  const s = n[i], o = {
    ...s,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? s.startTime,
    endTime: t[t.length - 1]?.endTime ?? s.endTime
  };
  return {
    turns: n.map((r, a) => a === i ? o : r),
    updated: o
  };
}
function yn(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function ho(n, e, t) {
  const { id: i, languages: s, isSource: o, audio: r } = n, a = A(n.turns);
  function l(f) {
    t(f.speakerId), a.value = lo(a.value, f), e("turn:add", { turn: f, translationId: i });
  }
  function u(f, g) {
    const v = co(a.value, f, g);
    v && (a.value = v.turns, e("turn:update", { turn: v.updated, translationId: i }));
  }
  function c(f) {
    const g = fo(a.value, f);
    g && (a.value = g, e("turn:remove", { turnId: f, translationId: i }));
  }
  function d(f, g) {
    const v = po(a.value, f, g);
    v && (a.value = v.turns, e("turn:update", { turn: v.updated, translationId: i }));
  }
  function h(f) {
    yn(f, t), a.value = uo(a.value, f);
  }
  function m(f) {
    yn(f, t), a.value = f, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: s, isSource: o, audio: r, turns: a, addTurn: l, prependTurns: h, updateTurn: u, removeTurn: c, updateWords: d, setTurns: m };
}
function Gn(n, e, t) {
  const { id: i, name: s, description: o, duration: r } = n, a = An(/* @__PURE__ */ new Map());
  let l;
  for (const g of n.translations) {
    const v = ho(g, e, t);
    a.set(g.id, v), g.isSource && !l && (l = v);
  }
  l || (l = a.values().next().value);
  const u = A(null), c = A(!1), d = A(!0), h = P(() => u.value ? a.get(u.value) ?? l : l);
  function m(g) {
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
    description: o,
    duration: r,
    translations: a,
    sourceTranslation: l,
    activeTranslation: h,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: m,
    reset: f
  };
}
function mo(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, s] of n.speakers)
    e.add(i), t.push({ id: i, name: s.name });
  for (const i of n.channels)
    for (const s of i.translations)
      for (const o of s.turns)
        o.speakerId && !e.has(o.speakerId) && (e.add(o.speakerId), t.push({ id: o.speakerId, name: o.speakerId }));
  return t;
}
function vo(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), o = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${o}, ${e})`;
}
function Ln(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function zi(n, e, t, i = "*") {
  return n.map((s) => ({
    value: s.id,
    label: s.languages.map((o) => Ln(o, e, i)).join(", ") + (s.isSource ? ` (${t})` : "")
  }));
}
function go(n, e = 250) {
  let t = !1, i = null;
  return (...s) => {
    if (t) {
      i = s;
      return;
    }
    t = !0, n(...s), setTimeout(() => {
      if (t = !1, i !== null) {
        const o = i;
        i = null, n(...o);
      }
    }, e);
  };
}
function qt(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), s = e % 60, o = String(i).padStart(2, "0"), r = String(s).padStart(2, "0");
  return t > 0 ? `${t}:${o}:${r}` : `${o}:${r}`;
}
class ce extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function yo(n) {
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
    for (let o = 0; o < i.translations.length; o++) {
      const r = i.translations[o], a = `${s}.translations[${o}]`;
      if (r == null || typeof r != "object")
        throw new ce(a, "must be a non-null object");
      if (typeof r.id != "string")
        throw new ce(`${a}.id`, "must be a string");
      if (!Array.isArray(r.languages))
        throw new ce(`${a}.languages`, "must be an array");
      if (typeof r.isSource != "boolean")
        throw new ce(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(r.turns))
        throw new ce(`${a}.turns`, "must be an array");
    }
  }
}
function bo(n, e) {
  const { width: t, height: i } = e.canvas, s = n[0], o = s.length / t, r = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += r * 2) {
    const l = Math.floor(a * o), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0), c = c + r, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0);
  }
  e.stroke(), e.closePath();
}
function Ni(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function wo(n, e) {
  if (!Ni(n)) return null;
  let t = 0, i = n.length - 1;
  for (; t <= i; ) {
    const s = t + i >>> 1, o = n[s];
    if (e < o.startTime)
      i = s - 1;
    else if (e > o.endTime)
      t = s + 1;
    else
      return o.id;
  }
  return null;
}
function Ld(n = {}) {
  const e = A(""), t = A(n.activeChannelId ?? ""), i = A(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: r, clear: a } = io(), l = ao(r), u = l, c = An(/* @__PURE__ */ new Map()), d = P(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function h(C, b) {
    return s(C, (I) => {
      I.translationId === d.value.activeTranslation.value.id && b(I);
    });
  }
  function m(C) {
    e.value = C.title, l.clear(), c.clear();
    for (const b of mo(C))
      u.ensure(b.id, b.name);
    for (const b of C.channels)
      c.set(b.id, Gn(b, r, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function f(C) {
    yo(C), m(C);
  }
  function g(C) {
    C !== t.value && (t.value = C, r("channel:change", { channelId: C }));
  }
  function v(C, b) {
    if (c.has(C)) {
      for (const I of b.translations)
        yn(I.turns, u.ensure);
      c.set(C, Gn(b, r, u.ensure)), r("channel:sync", { channelId: C });
    }
  }
  const _ = [], w = [];
  function S(C) {
    C.tiptapExtensions && w.push(...C.tiptapExtensions);
    const b = C.install(x);
    b && _.push(b);
  }
  function y() {
    r("destroy", void 0), _.forEach((C) => C()), _.length = 0, a();
  }
  n.document && m(n.document);
  const x = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    pluginExtensions: w,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: f,
    setActiveChannel: g,
    setChannel: v,
    on: s,
    off: o,
    emit: r,
    use: S,
    destroy: y
  };
  return x;
}
const Wi = /* @__PURE__ */ Symbol("editorStore");
function Dd(n) {
  Vt(Wi, n);
}
function Je() {
  const n = Ht(Wi);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const So = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Jn = (n) => n === "";
const Co = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const Zn = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const xo = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const _o = (n) => {
  const e = xo(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var pt = {
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
const Eo = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: s,
  "stroke-width": o,
  size: r = pt.width,
  color: a = pt.stroke,
  ...l
}, { slots: u }) => De(
  "svg",
  {
    ...pt,
    ...l,
    width: r,
    height: r,
    stroke: a,
    "stroke-width": Jn(t) || Jn(i) || t === !0 || i === !0 ? Number(s || o || pt["stroke-width"]) * 24 / Number(r) : s || o || pt["stroke-width"],
    class: Co(
      "lucide",
      l.class,
      ...n ? [`lucide-${Zn(_o(n))}-icon`, `lucide-${Zn(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !So(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => De(...c)), ...u.default ? [u.default()] : []]
);
const he = (n, e) => (t, { slots: i, attrs: s }) => De(
  Eo,
  {
    ...s,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const ko = he("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Hi = he("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const To = he("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Qn = he("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Po = he("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Ao = he("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Oo = he("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Io = he("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Lo = he("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Do = he("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Ro = he("volume-2", [
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
const Mo = he("volume-x", [
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
const Vi = he("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), $o = ["aria-label"], Bo = /* @__PURE__ */ F({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (E(), W("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      V(e.$slots, "default", {}, void 0, !0)
    ], 8, $o));
  }
}), re = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, s] of e)
    t[i] = s;
  return t;
}, bn = /* @__PURE__ */ re(Bo, [["__scopeId", "data-v-3d3f8eba"]]), qo = ["disabled", "aria-label"], Fo = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, zo = /* @__PURE__ */ F({
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
    return (o, r) => (E(), W("button", {
      type: "button",
      class: Bt(s.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      o.$slots.icon ? (E(), W("span", Fo, [
        V(o.$slots, "icon", {}, void 0, !0)
      ])) : K("", !0),
      V(o.$slots, "default", {}, void 0, !0)
    ], 10, qo));
  }
}), Ee = /* @__PURE__ */ re(zo, [["__scopeId", "data-v-9ebbb489"]]), ji = {
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
}, No = {
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
}, ei = { fr: ji, en: No }, Ui = /* @__PURE__ */ Symbol("i18n");
function Rd(n) {
  const e = P(() => {
    const i = ei[n.value] ?? ei.fr;
    return (s) => i[s] ?? s;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return Vt(Ui, t), t;
}
function xe() {
  const n = Ht(Ui);
  if (n) return n;
  const e = P(() => "fr");
  return {
    t: (t) => ji[t] ?? t,
    locale: e
  };
}
const Wo = { class: "editor-header" }, Ho = { class: "header-left" }, Vo = { class: "document-title" }, jo = { class: "badges" }, Uo = ["datetime"], Ko = { class: "header-right" }, Xo = /* @__PURE__ */ F({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = xe(), s = P(() => Ln(e.language, i.value, t("language.wildcard"))), o = P(() => qt(e.duration)), r = P(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), W("header", Wo, [
      H("div", Ho, [
        H("h1", Vo, Y(r.value), 1),
        H("div", jo, [
          q(bn, null, {
            default: O(() => [
              de(Y(s.value), 1)
            ]),
            _: 1
          }),
          q(bn, null, {
            default: O(() => [
              H("time", {
                datetime: `PT${n.duration}S`
              }, Y(o.value), 9, Uo)
            ]),
            _: 1
          })
        ])
      ]),
      H("div", Ko, [
        n.isMobile ? (E(), M(Ee, {
          key: 0,
          variant: "ghost",
          "aria-label": p(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: O(() => [
            q(p(Do), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (E(), M(Ee, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": p(t)("header.export")
        }, {
          icon: O(() => [
            q(p(Qn), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (E(), M(Ee, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: O(() => [
            q(p(Qn), { size: 16 })
          ]),
          default: O(() => [
            de(" " + Y(p(t)("header.export")), 1)
          ]),
          _: 1
        })),
        q(Ee, {
          variant: "ghost",
          disabled: "",
          "aria-label": p(t)("header.settings")
        }, {
          icon: O(() => [
            q(p(Oo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Yo = /* @__PURE__ */ re(Xo, [["__scopeId", "data-v-f16781f3"]]), sn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Go = 70, Jo = 1e3 / 60, Zo = 350;
let Dt = !1, ti = !1;
function Qo() {
  ti || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Dt = !0;
  }), document.addEventListener("mouseup", () => {
    Dt = !1;
  }), document.addEventListener("click", () => {
    Dt = !1;
  }), ti = !0);
}
const on = /* @__PURE__ */ new Map();
function rn(...n) {
  const e = {
    damping: sn.damping,
    stiffness: sn.stiffness,
    mass: sn.mass
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
  return on.has(i) || on.set(i, Object.freeze({ ...e })), t ? "instant" : on.get(i);
}
function er(n = {}) {
  Qo();
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
    const k = o();
    for (const D of t) D(k);
  }
  function o() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function r() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(k) {
    i.scrollElement && (i.scrollElement.scrollTop = k, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const k = i.scrollElement, D = i.contentElement;
    return !k || !D ? 0 : k.scrollHeight - 1 - k.clientHeight;
  }
  let u;
  function c() {
    const k = i.scrollElement, D = i.contentElement;
    if (!k || !D)
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
          contentElement: D
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
    return c() - r();
  }
  function h() {
    return d() <= Go;
  }
  function m(k) {
    i.isAtBottom = k, s();
  }
  function f(k) {
    i.escapedFromLock = k, s();
  }
  function g(k) {
    i.isNearBottom = k, s();
  }
  function v() {
    if (!Dt || typeof window > "u")
      return !1;
    const k = window.getSelection?.();
    if (!k || !k.rangeCount)
      return !1;
    const D = k.getRangeAt(0), R = i.scrollElement;
    if (!R)
      return !1;
    const z = D.commonAncestorContainer;
    return !!(z && (R.contains(z) || z.contains(R)));
  }
  const _ = (k) => {
    if (k.target !== i.scrollElement)
      return;
    const D = r(), R = i.ignoreScrollToTop;
    let z = i.lastScrollTop ?? D;
    i.lastScrollTop = D, i.ignoreScrollToTop = void 0, R && R > D && (z = R), g(h()), setTimeout(() => {
      if (i.resizeDifference || D === R)
        return;
      if (v()) {
        f(!0), m(!1);
        return;
      }
      const L = D > z, $ = D < z;
      if (i.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      $ && (f(!0), m(!1)), L && f(!1), !i.escapedFromLock && h() && m(!0);
    }, 1);
  }, w = (k) => {
    const D = i.scrollElement;
    if (!D)
      return;
    let R = k.target;
    for (; R && !["scroll", "auto"].includes(getComputedStyle(R).overflow); ) {
      if (!R.parentElement)
        return;
      R = R.parentElement;
    }
    R === D && k.deltaY < 0 && D.scrollHeight > D.clientHeight && !i.animation?.ignoreEscapes && (f(!0), m(!1));
  };
  function S(k, D) {
    y(), i.scrollElement = k, i.contentElement = D, getComputedStyle(k).overflow === "visible" && (k.style.overflow = "auto"), k.addEventListener("scroll", _, { passive: !0 }), k.addEventListener("wheel", w, { passive: !0 });
    let R;
    i.resizeObserver = new ResizeObserver((z) => {
      const L = z[0];
      if (!L)
        return;
      const { height: $ } = L.contentRect, X = $ - (R ?? $);
      if (i.resizeDifference = X, r() > l() && a(l()), g(h()), X >= 0) {
        const j = rn(
          e,
          R ? e.resize : e.initial
        );
        b({
          animation: j,
          wait: !0,
          preserveScrollPosition: !0,
          duration: j === "instant" ? void 0 : Zo
        });
      } else
        h() && (f(!1), m(!0));
      R = $, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === X && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(D);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", _), i.scrollElement.removeEventListener("wheel", w)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function x() {
    y(), t.clear();
  }
  function C(k) {
    e = { ...e, ...k };
  }
  function b(k = {}) {
    const D = typeof k == "string" ? { animation: k } : k;
    D.preserveScrollPosition || m(!0);
    const R = Date.now() + (Number(D.wait) || 0), z = rn(e, D.animation), { ignoreEscapes: L = !1 } = D;
    let $, X = c();
    D.duration instanceof Promise ? D.duration.finally(() => {
      $ = Date.now();
    }) : $ = R + (D.duration ?? 0);
    const j = async () => {
      const G = new Promise((ee) => {
        if (typeof requestAnimationFrame > "u") {
          ee(!1);
          return;
        }
        requestAnimationFrame(() => ee(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const ee = r(), ue = typeof performance < "u" ? performance.now() : Date.now(), Qe = (ue - (i.lastTick ?? ue)) / Jo;
        if (i.animation ||= { behavior: z, promise: G, ignoreEscapes: L }, i.animation.behavior === z && (i.lastTick = ue), v() || R > Date.now())
          return j();
        if (ee < Math.min(X, c())) {
          if (i.animation?.behavior === z) {
            if (z === "instant")
              return a(c()), j();
            const be = z;
            i.velocity = (be.damping * i.velocity + be.stiffness * d()) / be.mass, i.accumulated += i.velocity * Qe;
            const et = r();
            a(et + i.accumulated), r() !== et && (i.accumulated = 0);
          }
          return j();
        }
        return $ > Date.now() ? (X = c(), j()) : (i.animation = void 0, r() < c() ? b({
          animation: rn(e, e.resize),
          ignoreEscapes: L,
          duration: Math.max(0, $ - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return G.then((ee) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ee));
    };
    return D.wait !== !0 && (i.animation = void 0), i.animation?.behavior === z ? i.animation.promise : j();
  }
  const I = () => {
    f(!0), m(!1);
  };
  function T(k) {
    return t.add(k), () => t.delete(k);
  }
  return {
    attach: S,
    detach: y,
    destroy: x,
    setOptions: C,
    getState: o,
    onChange: T,
    scrollToBottom: b,
    stopScroll: I
  };
}
function tr(n = {}) {
  const e = A(null), t = A(null), i = A(n.initial !== !1), s = A(!1), o = A(!1), r = er(n);
  let a = null;
  return ye((l) => {
    !e.value || !t.value || (r.attach(e.value, t.value), a = r.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, o.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, r.detach();
    }));
  }), _t(() => {
    r.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: i,
    isNearBottom: s,
    escapedFromLock: o,
    scrollToBottom: (l) => r.scrollToBottom(l),
    stopScroll: () => r.stopScroll(),
    setOptions: (l) => r.setOptions(l)
  };
}
const nr = /* @__PURE__ */ F({
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
}), Ki = /* @__PURE__ */ re(nr, [["__scopeId", "data-v-9bffeda8"]]), ir = { class: "speaker-label" }, sr = {
  key: 1,
  class: "speaker-name"
}, or = ["datetime"], rr = /* @__PURE__ */ F({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = xe(), s = P(
      () => Ln(e.language, i.value, t("language.wildcard"))
    ), o = P(
      () => e.startTime != null ? qt(e.startTime) : null
    ), r = P(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = P(() => e.speaker?.color ?? "transparent");
    return (l, u) => (E(), W("div", ir, [
      n.speaker ? (E(), M(Ki, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (E(), W("span", sr, Y(n.speaker.name), 1)) : K("", !0),
      o.value ? (E(), W("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value
      }, Y(o.value), 9, or)) : K("", !0),
      q(bn, null, {
        default: O(() => [
          de(Y(s.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), ar = /* @__PURE__ */ re(rr, [["__scopeId", "data-v-0fb7fa1e"]]), lr = ["data-turn-active"], ur = { class: "turn-text" }, cr = ["data-word-active"], dr = /* @__PURE__ */ F({
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
      return l == null || u == null || a < l || a > u ? null : wo(c, a);
    }), o = P(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Ni(e.turn.words)) return !1;
      const a = t.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), r = P(() => e.speaker?.color ?? "transparent");
    return (a, l) => (E(), W("section", {
      class: Bt(["turn", { "turn--active": o.value, "turn--partial": n.partial }]),
      "data-turn-active": o.value || n.partial || n.live || void 0,
      style: lt({ "--speaker-color": r.value })
    }, [
      n.partial ? K("", !0) : (E(), M(ar, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      H("p", ur, [
        i.value ? (E(!0), W(ve, { key: 0 }, Ye(n.turn.words, (u, c) => (E(), W(ve, {
          key: u.id
        }, [
          H("span", {
            class: Bt({ "word--active": u.id === s.value }),
            "data-word-active": u.id === s.value || void 0
          }, Y(u.text), 11, cr),
          de(Y(c < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), W(ve, { key: 1 }, [
          de(Y(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, lr));
  }
}), ni = /* @__PURE__ */ re(dr, [["__scopeId", "data-v-e8530a49"]]), fr = {}, pr = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function hr(n, e) {
  return E(), W("svg", pr, [...e[0] || (e[0] = [
    Ns('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const mr = /* @__PURE__ */ re(fr, [["render", hr]]), vr = { class: "transcription-empty" }, gr = { class: "message" }, yr = /* @__PURE__ */ F({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = xe();
    return (t, i) => (E(), W("div", vr, [
      q(mr, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      H("p", gr, Y(p(e)("transcription.empty")), 1)
    ]));
  }
}), br = /* @__PURE__ */ re(yr, [["__scopeId", "data-v-f82737e5"]]), wr = { class: "transcription-panel" }, Sr = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Cr = { class: "turns-container" }, xr = {
  key: 0,
  class: "history-loading",
  role: "status"
}, _r = {
  key: 1,
  class: "history-start"
}, Er = /* @__PURE__ */ F({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = xe(), i = Je(), s = vt("scrollContainer"), o = P(() => {
      const w = i.live?.partial.value ?? null;
      return w === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: w,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), r = P(() => i.live?.hasLiveUpdate.value ?? !1), a = P(() => i.audio?.isPlaying.value ?? !1), l = P(
      () => i.activeChannel.value.activeTranslation.value
    ), u = P(() => i.activeChannel.value), c = P(
      () => u.value.isLoadingHistory.value
    ), d = P(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: m, isAtBottom: f, scrollToBottom: g } = tr();
    oe(() => {
      h.value = s.value, m.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const v = go(() => {
      const w = u.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function _() {
      const w = s.value;
      w && w.scrollTop < 100 && v();
    }
    return Z(
      () => e.turns,
      (w, S) => {
        const y = w.length, x = S.length;
        if (y > x && !f.value && w[0]?.id != S[0]?.id) {
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
    ), oe(() => {
      s.value?.addEventListener("scroll", _, {
        passive: !0
      });
    }), _t(() => {
      s.value?.removeEventListener("scroll", _);
    }), (w, S) => (E(), W("article", wr, [
      H("div", Sr, [
        H("div", Cr, [
          c.value ? (E(), W("div", xr, [...S[1] || (S[1] = [
            H("progress", null, null, -1)
          ])])) : K("", !0),
          !d.value && n.turns.length > 0 ? (E(), W("div", _r, Y(p(t)("transcription.historyStart")), 1)) : K("", !0),
          n.turns.length === 0 && !c.value ? (E(), M(br, {
            key: 2,
            class: "transcription-empty"
          })) : K("", !0),
          (E(!0), W(ve, null, Ye(n.turns, (y, x) => (E(), M(ni, {
            "data-turn-id": y.id,
            key: y.id,
            turn: y,
            speaker: y.speakerId ? n.speakers.get(y.speakerId) : void 0,
            live: r.value && !o.value && x === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          o.value ? (E(), M(ni, {
            key: "__partial__",
            turn: o.value,
            partial: ""
          }, null, 8, ["turn"])) : K("", !0)
        ]),
        q(Ws, { name: "fade-slide" }, {
          default: O(() => [
            !p(f) && (a.value || r.value) ? (E(), M(Ee, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": p(t)("transcription.resumeScroll"),
              onClick: S[0] || (S[0] = (y) => p(g)())
            }, {
              icon: O(() => [
                q(p(ko), { size: 14 })
              ]),
              default: O(() => [
                de(" " + Y(p(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : K("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), kr = /* @__PURE__ */ re(Er, [["__scopeId", "data-v-fce2d218"]]), Tr = { class: "switch" }, Pr = ["id", "checked"], Ar = ["for"], Or = /* @__PURE__ */ F({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = t.id ?? Hs();
    return (o, r) => (E(), W("div", Tr, [
      H("input", {
        type: "checkbox",
        id: p(s),
        checked: n.modelValue,
        onChange: r[0] || (r[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Pr),
      H("label", { for: p(s) }, [...r[1] || (r[1] = [
        H("div", { class: "switch-slider" }, null, -1)
      ])], 8, Ar)
    ]));
  }
}), Ir = /* @__PURE__ */ re(Or, [["__scopeId", "data-v-2aa0332f"]]), Lr = "(max-width: 767px)";
function Xi() {
  const n = A(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return oe(() => {
    e = window.matchMedia(Lr), n.value = e.matches, e.addEventListener("change", t);
  }), _t(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function ii(n) {
  return typeof n == "string" ? `'${n}'` : new Dr().serialize(n);
}
const Dr = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, i) {
      const s = typeof t, o = typeof i;
      return s === "string" && o === "string" ? t.localeCompare(i) : s === "number" && o === "number" ? t - i : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(i, !0));
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
      const s = t.constructor, o = s === Object || s === void 0 ? "" : s.name;
      if (o !== "" && globalThis[o] === s) return this.serializeBuiltInType(o, t);
      if (typeof t.toJSON == "function") {
        const r = t.toJSON();
        return o + (r !== null && typeof r == "object" ? this.$object(r) : `(${this.serialize(r)})`);
      }
      return this.serializeObjectEntries(o, Object.entries(t));
    }
    serializeBuiltInType(t, i) {
      const s = this["$" + t];
      if (s) return s.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(t, i.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, i) {
      const s = Array.from(i).sort((r, a) => this.compare(r[0], a[0]));
      let o = `${t}{`;
      for (let r = 0; r < s.length; r++) {
        const [a, l] = s[r];
        o += `${this.serialize(a, !0)}:${this.serialize(l)}`, r < s.length - 1 && (o += ",");
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
function Ft(n, e) {
  return n === e || ii(n) === ii(e);
}
function Rr(n, e, t) {
  const i = n.findIndex((a) => Ft(a, e)), s = n.findIndex((a) => Ft(a, t));
  if (i === -1 || s === -1) return [];
  const [o, r] = [i, s].sort((a, l) => a - l);
  return n.slice(o, r + 1);
}
function si(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function Oe(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(r) => {
    const a = Ht(i, r);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (r) => (Vt(i, r), r)];
}
function ge() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function jt(n, e, t) {
  const i = t.originalEvent.target, s = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && i.addEventListener(n, e, { once: !0 }), i.dispatchEvent(s);
}
function wn(n) {
  return n == null;
}
function Dn(n) {
  return n ? n.flatMap((e) => e.type === ve ? Dn(e.children) : [e]) : [];
}
const [Ut] = Oe("ConfigProvider");
function Mr(n, e) {
  var t;
  const i = rt();
  return ye(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), js(i);
}
function Kt(n, e) {
  return Di() ? (Ri(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function an() {
  const n = /* @__PURE__ */ new Set(), e = (o) => {
    n.delete(o);
  };
  return {
    on: (o) => {
      n.add(o);
      const r = () => e(o);
      return Kt(r), { off: r };
    },
    off: e,
    trigger: (...o) => Promise.all(Array.from(n).map((r) => r(...o))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function $r(n) {
  let e = !1, t;
  const i = Mi(!0);
  return ((...s) => (e || (t = i.run(() => n(...s)), e = !0), t));
}
const $e = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Br = (n) => typeof n < "u", qr = Object.prototype.toString, Fr = (n) => qr.call(n) === "[object Object]", oi = /* @__PURE__ */ zr();
function zr() {
  var n, e, t;
  return $e && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function ln(n) {
  return Array.isArray(n) ? n : [n];
}
function Nr(n) {
  return Ge();
}
// @__NO_SIDE_EFFECTS__
function Wr(n) {
  if (!$e) return n;
  let e = 0, t, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...o) => (e += 1, i || (i = Mi(!0), t = i.run(() => n(...o))), Kt(s), t));
}
function Yi(n, e = 1e4) {
  return Vs((t, i) => {
    let s = le(n), o;
    const r = () => setTimeout(() => {
      s = le(n), i();
    }, le(e));
    return Kt(() => {
      clearTimeout(o);
    }), {
      get() {
        return t(), s;
      },
      set(a) {
        s = a, i(), clearTimeout(o), o = r();
      }
    };
  });
}
function Hr(n, e) {
  Nr() && _t(n, e);
}
function Vr(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const Xt = $e ? window : void 0;
function Pe(n) {
  var e;
  const t = le(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Gi(...n) {
  const e = (i, s, o, r) => (i.addEventListener(s, o, r), () => i.removeEventListener(s, o, r)), t = P(() => {
    const i = ln(le(n[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return Vr(() => {
    var i, s;
    return [
      (i = (s = t.value) === null || s === void 0 ? void 0 : s.map((o) => Pe(o))) !== null && i !== void 0 ? i : [Xt].filter((o) => o != null),
      ln(le(t.value ? n[1] : n[0])),
      ln(p(t.value ? n[2] : n[1])),
      le(t.value ? n[3] : n[2])
    ];
  }, ([i, s, o, r], a, l) => {
    if (!i?.length || !s?.length || !o?.length) return;
    const u = Fr(r) ? { ...r } : r, c = i.flatMap((d) => s.flatMap((h) => o.map((m) => e(d, h, m, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Ji() {
  const n = rt(!1), e = Ge();
  return e && oe(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function jr(n) {
  const e = /* @__PURE__ */ Ji();
  return P(() => (e.value, !!n()));
}
function Ur(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Kr(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: s = Xt, eventName: o = "keydown", passive: r = !1, dedupe: a = !1 } = i, l = Ur(e);
  return Gi(s, o, (c) => {
    c.repeat && le(a) || l(c) && t(c);
  }, r);
}
function Xr(n) {
  return JSON.parse(JSON.stringify(n));
}
function Yr(n, e, t = {}) {
  const { window: i = Xt, ...s } = t;
  let o;
  const r = /* @__PURE__ */ jr(() => i && "ResizeObserver" in i), a = () => {
    o && (o.disconnect(), o = void 0);
  }, l = Z(P(() => {
    const c = le(n);
    return Array.isArray(c) ? c.map((d) => Pe(d)) : [Pe(c)];
  }), (c) => {
    if (a(), r.value && i) {
      o = new ResizeObserver(e);
      for (const d of c) d && o.observe(d, s);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Kt(u), {
    isSupported: r,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function yt(n, e, t, i = {}) {
  var s, o;
  const { clone: r = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Ge(), m = t || h?.emit || (h == null || (s = h.$emit) === null || s === void 0 ? void 0 : s.bind(h)) || (h == null || (o = h.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(h?.proxy));
  let f = l;
  e || (e = "modelValue"), f = f || `update:${e.toString()}`;
  const g = (w) => r ? typeof r == "function" ? r(w) : Xr(w) : w, v = () => Br(n[e]) ? g(n[e]) : c, _ = (w) => {
    d ? d(w) && m(f, w) : m(f, w);
  };
  if (a) {
    const w = A(v());
    let S = !1;
    return Z(() => n[e], (y) => {
      S || (S = !0, w.value = g(y), se(() => S = !1));
    }), Z(w, (y) => {
      !S && (y !== n[e] || u) && _(y);
    }, { deep: u }), w;
  } else return P({
    get() {
      return v();
    },
    set(w) {
      _(w);
    }
  });
}
function un(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Sn(n, e, t = ".", i) {
  if (!un(e))
    return Sn(n, {}, t, i);
  const s = Object.assign({}, e);
  for (const o in n) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const r = n[o];
    r != null && (i && i(s, o, r, t) || (Array.isArray(r) && Array.isArray(s[o]) ? s[o] = [...r, ...s[o]] : un(r) && un(s[o]) ? s[o] = Sn(
      r,
      s[o],
      (t ? `${t}.` : "") + o.toString(),
      i
    ) : s[o] = r));
  }
  return s;
}
function Gr(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => Sn(t, i, "", n), {})
  );
}
const Jr = Gr(), Zr = /* @__PURE__ */ Wr(() => {
  const n = A(/* @__PURE__ */ new Map()), e = A(), t = P(() => {
    for (const r of n.value.values()) if (r) return !0;
    return !1;
  }), i = Ut({ scrollBody: A(!0) });
  let s = null;
  const o = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", oi && s?.(), e.value = void 0;
  };
  return Z(t, (r, a) => {
    if (!$e) return;
    if (!r) {
      a && o();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Jr({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), oi && (s = Gi(document, "touchmove", (d) => Qr(d), { passive: !1 })), se(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function Zi(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Zr();
  t.value.set(e, n ?? !1);
  const i = P({
    get: () => t.value.get(e) ?? !1,
    set: (s) => t.value.set(e, s)
  });
  return Hr(() => {
    t.value.delete(e);
  }), i;
}
function Qi(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Qi(t);
  }
}
function Qr(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && Qi(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function es(n) {
  const e = Ut({ dir: A("ltr") });
  return P(() => n?.value || e.dir?.value || "ltr");
}
function Yt(n) {
  const e = Ge(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((s) => {
    i[Us($i(s))] = (...o) => n(s, ...o);
  }), i;
}
let cn = 0;
function ea() {
  ye((n) => {
    if (!$e) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ri()), document.body.insertAdjacentElement("beforeend", e[1] ?? ri()), cn++, n(() => {
      cn === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), cn--;
    });
  });
}
function ri() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function ts(n) {
  return P(() => le(n) ? !!Pe(n)?.closest("form") : !0);
}
function ie() {
  const n = Ge(), e = A(), t = P(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Pe(e)), i = Object.assign({}, n.exposed), s = {};
  for (const r in n.props) Object.defineProperty(s, r, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[r]
  });
  if (Object.keys(i).length > 0) for (const r in i) Object.defineProperty(s, r, {
    enumerable: !0,
    configurable: !0,
    get: () => i[r]
  });
  Object.defineProperty(s, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = s;
  function o(r) {
    if (e.value = r, !!r && (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => r instanceof Element ? r : r.$el
    }), !(r instanceof Element) && !Object.hasOwn(r, "$el"))) {
      const a = r.$.exposed, l = Object.assign({}, s);
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
function Rn(n) {
  const e = Ge(), t = Object.keys(e?.type.props ?? {}).reduce((s, o) => {
    const r = (e?.type.props[o]).default;
    return r !== void 0 && (s[o] = r), s;
  }, {}), i = Lt(n);
  return P(() => {
    const s = {}, o = e?.vnode.props ?? {};
    return Object.keys(o).forEach((r) => {
      s[$i(r)] = o[r];
    }), Object.keys({
      ...t,
      ...s
    }).reduce((r, a) => (i.value[a] !== void 0 && (r[a] = i.value[a]), r), {});
  });
}
function ta(n, e) {
  const t = Rn(n), i = e ? Yt(e) : {};
  return P(() => ({
    ...t.value,
    ...i
  }));
}
var na = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, nt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakMap(), Pt = {}, dn = 0, ns = function(n) {
  return n && (n.host || ns(n.parentNode));
}, ia = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = ns(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, sa = function(n, e, t, i) {
  var s = ia(e, Array.isArray(n) ? n : [n]);
  Pt[t] || (Pt[t] = /* @__PURE__ */ new WeakMap());
  var o = Pt[t], r = [], a = /* @__PURE__ */ new Set(), l = new Set(s), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  s.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var m = h.getAttribute(i), f = m !== null && m !== "false", g = (nt.get(h) || 0) + 1, v = (o.get(h) || 0) + 1;
          nt.set(h, g), o.set(h, v), r.push(h), g === 1 && f && Tt.set(h, !0), v === 1 && h.setAttribute(t, "true"), f || h.setAttribute(i, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", h, _);
        }
    });
  };
  return c(e), a.clear(), dn++, function() {
    r.forEach(function(d) {
      var h = nt.get(d) - 1, m = o.get(d) - 1;
      nt.set(d, h), o.set(d, m), h || (Tt.has(d) || d.removeAttribute(i), Tt.delete(d)), m || d.removeAttribute(t);
    }), dn--, dn || (nt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ new WeakMap(), Pt = {});
  };
}, oa = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), s = na(n);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), sa(i, s, t, "aria-hidden")) : function() {
    return null;
  };
};
function is(n) {
  let e;
  Z(() => Pe(n), (t) => {
    t ? e = oa(t) : e && e();
  }), ut(() => {
    e && e();
  });
}
let ra = 0;
function bt(n, e = "reka") {
  if ("useId" in Kn) return `${e}-${Kn.useId?.()}`;
  const t = Ut({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++ra}`;
}
function aa() {
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
function la(n) {
  const e = A(), t = P(() => e.value?.width ?? 0), i = P(() => e.value?.height ?? 0);
  return oe(() => {
    const s = Pe(n);
    if (s) {
      e.value = {
        width: s.offsetWidth,
        height: s.offsetHeight
      };
      const o = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length) return;
        const a = r[0];
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
      return o.observe(s, { box: "border-box" }), () => o.unobserve(s);
    } else e.value = void 0;
  }), {
    width: t,
    height: i
  };
}
function ua(n, e) {
  const t = A(n);
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
function Mn(n) {
  const e = Yi("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (s, o) => {
      e.value = e.value + s;
      {
        const r = ge(), a = o.map((h) => ({
          ...h,
          textValue: h.value?.textValue ?? h.ref.textContent?.trim() ?? ""
        })), l = a.find((h) => h.ref === r), u = a.map((h) => h.textValue), c = da(u, e.value, l?.textValue), d = a.find((h) => h.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function ca(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function da(n, e, t) {
  const s = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, o = t ? n.indexOf(t) : -1;
  let r = ca(n, Math.max(o, 0));
  s.length === 1 && (r = r.filter((u) => u !== t));
  const l = r.find((u) => u.toLowerCase().startsWith(s.toLowerCase()));
  return l !== t ? l : void 0;
}
function fa(n, e) {
  const t = A({}), i = A("none"), s = A(n), o = n.value ? "mounted" : "unmounted";
  let r;
  const a = e.value?.ownerDocument.defaultView ?? Xt, { state: l, dispatch: u } = ua(o, {
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
    const w = _ !== v;
    if (await se(), w) {
      const S = i.value, y = At(e.value);
      v ? (u("MOUNT"), c("enter"), y === "none" && c("after-enter")) : y === "none" || y === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : _ && S !== y ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (v) => {
    const _ = At(e.value), w = _.includes(CSS.escape(v.animationName)), S = l.value === "mounted" ? "enter" : "leave";
    if (v.target === e.value && w && (c(`after-${S}`), u("ANIMATION_END"), !s.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", r = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    v.target === e.value && _ === "none" && u("ANIMATION_END");
  }, h = (v) => {
    v.target === e.value && (i.value = At(e.value));
  }, m = Z(e, (v, _) => {
    v ? (t.value = getComputedStyle(v), v.addEventListener("animationstart", h), v.addEventListener("animationcancel", d), v.addEventListener("animationend", d)) : (u("ANIMATION_END"), r !== void 0 && a?.clearTimeout(r), _?.removeEventListener("animationstart", h), _?.removeEventListener("animationcancel", d), _?.removeEventListener("animationend", d));
  }, { immediate: !0 }), f = Z(l, () => {
    const v = At(e.value);
    i.value = l.value === "mounted" ? v : "none";
  });
  return ut(() => {
    m(), f();
  }), { isPresent: P(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function At(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var $n = F({
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
    const { present: i, forceMount: s } = ct(n), o = A(), { isPresent: r } = fa(i, o);
    t({ present: r });
    let a = e.default({ present: r.value });
    a = Dn(a || []);
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
    return () => s.value || i.value || r.value ? De(e.default({ present: r.value })[0], { ref: (u) => {
      const c = Pe(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? o.value = c.firstElementChild : o.value = c), c;
    } }) : null;
  }
});
const Cn = F({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Dn(t.default()), s = i.findIndex((l) => l.type !== Ks);
      if (s === -1) return i;
      const o = i[s];
      delete o.props?.ref;
      const r = o.props ? Q(e, o.props) : e, a = Xs({
        ...o,
        props: {}
      }, r);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), pa = [
  "area",
  "img",
  "input"
], te = F({
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
    return typeof i == "string" && pa.includes(i) ? () => De(i, e) : i !== "template" ? () => De(n.as, e, { default: t.default }) : () => De(Cn, e, { default: t.default });
  }
});
function wt() {
  const n = A(), e = P(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Pe(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [We, ha] = Oe("DialogRoot");
var ma = /* @__PURE__ */ F({
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
    const t = n, s = /* @__PURE__ */ yt(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), o = A(), r = A(), { modal: a } = ct(t);
    return ha({
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
      triggerElement: o,
      contentElement: r
    }), (l, u) => V(l.$slots, "default", {
      open: p(s),
      close: () => s.value = !1
    });
  }
}), ss = ma, va = /* @__PURE__ */ F({
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
    const t = We();
    return (i, s) => (E(), M(p(te), Q(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (o) => p(t).onOpenChange(!1))
    }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), ga = va;
const ya = "dismissableLayer.pointerDownOutside", ba = "dismissableLayer.focusOutside";
function os(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), s = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || s.indexOf(i) < s.indexOf(t)));
}
function wa(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1), o = A(() => {
  });
  return ye((r) => {
    if (!$e || !le(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (os(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let h = function() {
            jt(ya, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", o.value), o.value = h, i.addEventListener("click", o.value, { once: !0 })) : h();
        } else i.removeEventListener("click", o.value);
        s.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    r(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", o.value);
    });
  }), { onPointerDownCapture: () => {
    le(t) && (s.value = !0);
  } };
}
function Sa(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1);
  return ye((o) => {
    if (!$e || !le(t)) return;
    const r = async (a) => {
      if (!e?.value) return;
      await se(), await se();
      const l = a.target;
      !e.value || !l || os(e.value, l) || a.target && !s.value && jt(ba, n, { originalEvent: a });
    };
    i.addEventListener("focusin", r), o(() => i.removeEventListener("focusin", r));
  }), {
    onFocusCapture: () => {
      le(t) && (s.value = !0);
    },
    onBlurCapture: () => {
      le(t) && (s.value = !1);
    }
  };
}
const me = Bi({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Ca = /* @__PURE__ */ F({
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
    const t = n, i = e, { forwardRef: s, currentElement: o } = ie(), r = P(() => o.value?.ownerDocument ?? globalThis.document), a = P(() => me.layersRoot), l = P(() => o.value ? Array.from(a.value).indexOf(o.value) : -1), u = P(() => me.layersWithOutsidePointerEventsDisabled.size > 0), c = P(() => {
      const m = Array.from(a.value), [f] = [...me.layersWithOutsidePointerEventsDisabled].slice(-1), g = m.indexOf(f);
      return l.value >= g;
    }), d = wa(async (m) => {
      const f = [...me.branches].some((g) => g?.contains(m.target));
      !c.value || f || (i("pointerDownOutside", m), i("interactOutside", m), await se(), m.defaultPrevented || i("dismiss"));
    }, o), h = Sa((m) => {
      [...me.branches].some((g) => g?.contains(m.target)) || (i("focusOutside", m), i("interactOutside", m), m.defaultPrevented || i("dismiss"));
    }, o);
    return Kr("Escape", (m) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", m), m.defaultPrevented || i("dismiss"));
    }), ye((m) => {
      o.value && (t.disableOutsidePointerEvents && (me.layersWithOutsidePointerEventsDisabled.size === 0 && (me.originalBodyPointerEvents = r.value.body.style.pointerEvents, r.value.body.style.pointerEvents = "none"), me.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), m(() => {
        t.disableOutsidePointerEvents && me.layersWithOutsidePointerEventsDisabled.size === 1 && !wn(me.originalBodyPointerEvents) && (r.value.body.style.pointerEvents = me.originalBodyPointerEvents);
      }));
    }), ye((m) => {
      m(() => {
        o.value && (a.value.delete(o.value), me.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (m, f) => (E(), M(p(te), {
      ref: p(s),
      "as-child": m.asChild,
      as: m.as,
      "data-dismissable-layer": "",
      style: lt({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: p(h).onFocusCapture,
      onBlurCapture: p(h).onBlurCapture,
      onPointerdownCapture: p(d).onPointerDownCapture
    }, {
      default: O(() => [V(m.$slots, "default")]),
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
}), rs = Ca;
const xa = /* @__PURE__ */ $r(() => A([]));
function _a() {
  const n = xa();
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
const fn = "focusScope.autoFocusOnMount", pn = "focusScope.autoFocusOnUnmount", li = {
  bubbles: !1,
  cancelable: !0
};
function Ea(n, { select: e = !1 } = {}) {
  const t = ge();
  for (const i of n)
    if (Be(i, { select: e }), ge() !== t) return !0;
}
function ka(n) {
  const e = as(n), t = ui(e, n), i = ui(e.reverse(), n);
  return [t, i];
}
function as(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function ui(n, e) {
  for (const t of n) if (!Ta(t, { upTo: e })) return t;
}
function Ta(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Pa(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Be(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = ge();
    n.focus({ preventScroll: !0 }), n !== t && Pa(n) && e && n.select();
  }
}
var Aa = /* @__PURE__ */ F({
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
    const t = n, i = e, { currentRef: s, currentElement: o } = ie(), r = A(null), a = _a(), l = Bi({
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
      const d = o.value;
      if (!t.trapped) return;
      function h(v) {
        if (l.paused || !d) return;
        const _ = v.target;
        d.contains(_) ? r.value = _ : Be(r.value, { select: !0 });
      }
      function m(v) {
        if (l.paused || !d) return;
        const _ = v.relatedTarget;
        _ !== null && (d.contains(_) || Be(r.value, { select: !0 }));
      }
      function f(v) {
        d.contains(r.value) || Be(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", m);
      const g = new MutationObserver(f);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", m), g.disconnect();
      });
    }), ye(async (c) => {
      const d = o.value;
      if (await se(), !d) return;
      a.add(l);
      const h = ge();
      if (!d.contains(h)) {
        const f = new CustomEvent(fn, li);
        d.addEventListener(fn, (g) => i("mountAutoFocus", g)), d.dispatchEvent(f), f.defaultPrevented || (Ea(as(d), { select: !0 }), ge() === h && Be(d));
      }
      c(() => {
        d.removeEventListener(fn, (v) => i("mountAutoFocus", v));
        const f = new CustomEvent(pn, li), g = (v) => {
          i("unmountAutoFocus", v);
        };
        d.addEventListener(pn, g), d.dispatchEvent(f), setTimeout(() => {
          f.defaultPrevented || Be(h ?? document.body, { select: !0 }), d.removeEventListener(pn, g), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = ge();
      if (d && h) {
        const m = c.currentTarget, [f, g] = ka(m);
        f && g ? !c.shiftKey && h === g ? (c.preventDefault(), t.loop && Be(f, { select: !0 })) : c.shiftKey && h === f && (c.preventDefault(), t.loop && Be(g, { select: !0 })) : h === m && c.preventDefault();
      }
    }
    return (c, d) => (E(), M(p(te), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), ls = Aa;
function Oa(n) {
  return n ? "open" : "closed";
}
function ci(n) {
  const e = ge();
  for (const t of n)
    if (t === e || (t.focus(), ge() !== e)) return;
}
const Ia = "DialogTitle", La = "DialogContent";
function Da({ titleName: n = Ia, contentName: e = La, componentLink: t = "dialog.html#title", titleId: i, descriptionId: s, contentElement: o }) {
  const r = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  oe(() => {
    document.getElementById(i) || console.warn(r);
    const u = o.value?.getAttribute("aria-describedby");
    s && u && (document.getElementById(s) || console.warn(a));
  });
}
var Ra = /* @__PURE__ */ F({
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
    const t = n, i = e, s = We(), { forwardRef: o, currentElement: r } = ie();
    return s.titleId ||= bt(void 0, "reka-dialog-title"), s.descriptionId ||= bt(void 0, "reka-dialog-description"), oe(() => {
      s.contentElement = r, ge() !== document.body && (s.triggerElement.value = ge());
    }), process.env.NODE_ENV !== "production" && Da({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: s.titleId,
      descriptionId: s.descriptionId,
      contentElement: r
    }), (a, l) => (E(), M(p(ls), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: O(() => [q(p(rs), Q({
        id: p(s).contentId,
        ref: p(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": p(s).descriptionId,
        "aria-labelledby": p(s).titleId,
        "data-state": p(Oa)(p(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => p(s).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: O(() => [V(a.$slots, "default")]),
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
}), us = Ra, Ma = /* @__PURE__ */ F({
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
    const t = n, i = e, s = We(), o = Yt(i), { forwardRef: r, currentElement: a } = ie();
    return is(a), (l, u) => (E(), M(us, Q({
      ...t,
      ...p(o)
    }, {
      ref: p(r),
      "trap-focus": p(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), p(s).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || h) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), $a = Ma, Ba = /* @__PURE__ */ F({
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
    const t = n, s = Yt(e);
    ie();
    const o = We(), r = A(!1), a = A(!1);
    return (l, u) => (E(), M(us, Q({
      ...t,
      ...p(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (r.value || p(o).triggerElement.value?.focus(), c.preventDefault()), r.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (r.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        p(o).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qa = Ba, Fa = /* @__PURE__ */ F({
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
    const t = n, i = e, s = We(), o = Yt(i), { forwardRef: r } = ie();
    return (a, l) => (E(), M(p($n), { present: a.forceMount || p(s).open.value }, {
      default: O(() => [p(s).modal.value ? (E(), M($a, Q({
        key: 0,
        ref: p(r)
      }, {
        ...t,
        ...p(o),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), M(qa, Q({
        key: 1,
        ref: p(r)
      }, {
        ...t,
        ...p(o),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), cs = Fa, za = /* @__PURE__ */ F({
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
    const e = We();
    return Zi(!0), ie(), (t, i) => (E(), M(p(te), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": p(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Na = za, Wa = /* @__PURE__ */ F({
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
    const e = We(), { forwardRef: t } = ie();
    return (i, s) => p(e)?.modal.value ? (E(), M(p($n), {
      key: 0,
      present: i.forceMount || p(e).open.value
    }, {
      default: O(() => [q(Na, Q(i.$attrs, {
        ref: p(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: O(() => [V(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : K("v-if", !0);
  }
}), ds = Wa, Ha = /* @__PURE__ */ F({
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
    const e = /* @__PURE__ */ Ji();
    return (t, i) => p(e) || t.forceMount ? (E(), M(qi, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [V(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : K("v-if", !0);
  }
}), fs = Ha, Va = /* @__PURE__ */ F({
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
    return (t, i) => (E(), M(p(fs), On(In(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ps = Va, ja = /* @__PURE__ */ F({
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
    const e = n, t = We();
    return ie(), (i, s) => (E(), M(p(te), Q(e, { id: p(t).titleId }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), hs = ja;
const di = "data-reka-collection-item";
function He(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let s;
  if (t) {
    const c = A(/* @__PURE__ */ new Map());
    s = {
      collectionRef: A(),
      itemMap: c
    }, Vt(i, s);
  } else s = Ht(i);
  const o = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${di}]`)), f = Array.from(s.itemMap.value.values()).sort((g, v) => h.indexOf(g.ref) - h.indexOf(v.ref));
    return c ? f : f.filter((g) => g.ref.dataset.disabled !== "");
  }, r = F({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: m, currentElement: f } = wt();
      return Z(f, () => {
        s.collectionRef.value = f.value;
      }), () => De(Cn, {
        ref: m,
        ...h
      }, d);
    }
  }), a = F({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: m, currentElement: f } = wt();
      return ye((g) => {
        if (f.value) {
          const v = Ys(f.value);
          s.itemMap.value.set(v, {
            ref: f.value,
            value: c.value
          }), g(() => s.itemMap.value.delete(v));
        }
      }), () => De(Cn, {
        ...h,
        [di]: "",
        ref: m
      }, d);
    }
  }), l = P(() => Array.from(s.itemMap.value.values())), u = P(() => s.itemMap.value.size);
  return {
    getItems: o,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: r,
    CollectionItem: a
  };
}
const Ua = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ka(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Xa(n, e, t) {
  const i = Ka(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return Ua[i];
}
var Ya = /* @__PURE__ */ F({
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
    return (e, t) => (E(), M(p(te), {
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
      default: O(() => [V(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), ms = Ya, Ga = /* @__PURE__ */ F({
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
    const e = n, { primitiveElement: t, currentElement: i } = wt(), s = P(() => e.checked ?? e.value);
    return Z(s, (o, r) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && o !== r) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, o), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (o, r) => (E(), M(ms, Q({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...o.$attrs
    }, { as: "input" }), null, 16));
  }
}), fi = Ga, Ja = /* @__PURE__ */ F({
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
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((s, o) => typeof s == "object" ? Object.entries(s).map(([r, a]) => ({
      name: `${e.name}[${o}][${r}]`,
      value: a
    })) : {
      name: `${e.name}[${o}]`,
      value: s
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([s, o]) => ({
      name: `${e.name}[${s}]`,
      value: o
    })) : []);
    return (s, o) => (E(), W(ve, null, [K(" We render single input if it's required "), t.value ? (E(), M(fi, Q({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (E(!0), W(ve, { key: 1 }, Ye(i.value, (r) => (E(), M(fi, Q({ key: r.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Za = Ja;
const [vs, Qa] = Oe("PopperRoot");
var el = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = A();
    return Qa({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => V(t.$slots, "default");
  }
}), tl = el, nl = /* @__PURE__ */ F({
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
    const e = n, { forwardRef: t, currentElement: i } = ie(), s = vs();
    return Fi(() => {
      s.onAnchorChange(e.reference ?? i.value);
    }), (o, r) => (E(), M(p(te), {
      ref: p(t),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: O(() => [V(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), il = nl;
function sl(n) {
  return n !== null;
}
function ol(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: s } = e, r = s.arrow?.centerOffset !== 0, a = r ? 0 : n.arrowWidth, l = r ? 0 : n.arrowHeight, [u, c] = xn(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], h = (s.arrow?.x ?? 0) + a / 2, m = (s.arrow?.y ?? 0) + l / 2;
      let f = "", g = "";
      return u === "bottom" ? (f = r ? d : `${h}px`, g = `${-l}px`) : u === "top" ? (f = r ? d : `${h}px`, g = `${i.floating.height + l}px`) : u === "right" ? (f = `${-l}px`, g = r ? d : `${m}px`) : u === "left" && (f = `${i.floating.width + l}px`, g = r ? d : `${m}px`), { data: {
        x: f,
        y: g
      } };
    }
  };
}
function xn(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const rl = ["top", "right", "bottom", "left"], ze = Math.min, fe = Math.max, zt = Math.round, Ot = Math.floor, Te = (n) => ({
  x: n,
  y: n
}), al = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, ll = {
  start: "end",
  end: "start"
};
function _n(n, e, t) {
  return fe(n, ze(e, t));
}
function Re(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Me(n) {
  return n.split("-")[0];
}
function dt(n) {
  return n.split("-")[1];
}
function Bn(n) {
  return n === "x" ? "y" : "x";
}
function qn(n) {
  return n === "y" ? "height" : "width";
}
const ul = /* @__PURE__ */ new Set(["top", "bottom"]);
function ke(n) {
  return ul.has(Me(n)) ? "y" : "x";
}
function Fn(n) {
  return Bn(ke(n));
}
function cl(n, e, t) {
  t === void 0 && (t = !1);
  const i = dt(n), s = Fn(n), o = qn(s);
  let r = s === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (r = Nt(r)), [r, Nt(r)];
}
function dl(n) {
  const e = Nt(n);
  return [En(n), e, En(e)];
}
function En(n) {
  return n.replace(/start|end/g, (e) => ll[e]);
}
const pi = ["left", "right"], hi = ["right", "left"], fl = ["top", "bottom"], pl = ["bottom", "top"];
function hl(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? hi : pi : e ? pi : hi;
    case "left":
    case "right":
      return e ? fl : pl;
    default:
      return [];
  }
}
function ml(n, e, t, i) {
  const s = dt(n);
  let o = hl(Me(n), t === "start", i);
  return s && (o = o.map((r) => r + "-" + s), e && (o = o.concat(o.map(En)))), o;
}
function Nt(n) {
  return n.replace(/left|right|bottom|top/g, (e) => al[e]);
}
function vl(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function gs(n) {
  return typeof n != "number" ? vl(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Wt(n) {
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
  const o = ke(e), r = Fn(e), a = qn(r), l = Me(e), u = o === "y", c = i.x + i.width / 2 - s.width / 2, d = i.y + i.height / 2 - s.height / 2, h = i[a] / 2 - s[a] / 2;
  let m;
  switch (l) {
    case "top":
      m = {
        x: c,
        y: i.y - s.height
      };
      break;
    case "bottom":
      m = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      m = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      m = {
        x: i.x - s.width,
        y: d
      };
      break;
    default:
      m = {
        x: i.x,
        y: i.y
      };
  }
  switch (dt(e)) {
    case "start":
      m[r] -= h * (t && u ? -1 : 1);
      break;
    case "end":
      m[r] += h * (t && u ? -1 : 1);
      break;
  }
  return m;
}
async function gl(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: i,
    y: s,
    platform: o,
    rects: r,
    elements: a,
    strategy: l
  } = n, {
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: h = !1,
    padding: m = 0
  } = Re(e, n), f = gs(m), v = a[h ? d === "floating" ? "reference" : "floating" : d], _ = Wt(await o.getClippingRect({
    element: (t = await (o.isElement == null ? void 0 : o.isElement(v))) == null || t ? v : v.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), w = d === "floating" ? {
    x: i,
    y: s,
    width: r.floating.width,
    height: r.floating.height
  } : r.reference, S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), y = await (o.isElement == null ? void 0 : o.isElement(S)) ? await (o.getScale == null ? void 0 : o.getScale(S)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, x = Wt(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: S,
    strategy: l
  }) : w);
  return {
    top: (_.top - x.top + f.top) / y.y,
    bottom: (x.bottom - _.bottom + f.bottom) / y.y,
    left: (_.left - x.left + f.left) / y.x,
    right: (x.right - _.right + f.right) / y.x
  };
}
const yl = async (n, e, t) => {
  const {
    placement: i = "bottom",
    strategy: s = "absolute",
    middleware: o = [],
    platform: r
  } = t, a = o.filter(Boolean), l = await (r.isRTL == null ? void 0 : r.isRTL(e));
  let u = await r.getElementRects({
    reference: n,
    floating: e,
    strategy: s
  }), {
    x: c,
    y: d
  } = mi(u, i, l), h = i, m = {}, f = 0;
  for (let v = 0; v < a.length; v++) {
    var g;
    const {
      name: _,
      fn: w
    } = a[v], {
      x: S,
      y,
      data: x,
      reset: C
    } = await w({
      x: c,
      y: d,
      initialPlacement: i,
      placement: h,
      strategy: s,
      middlewareData: m,
      rects: u,
      platform: {
        ...r,
        detectOverflow: (g = r.detectOverflow) != null ? g : gl
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = S ?? c, d = y ?? d, m = {
      ...m,
      [_]: {
        ...m[_],
        ...x
      }
    }, C && f <= 50 && (f++, typeof C == "object" && (C.placement && (h = C.placement), C.rects && (u = C.rects === !0 ? await r.getElementRects({
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
    middlewareData: m
  };
}, bl = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: i,
      placement: s,
      rects: o,
      platform: r,
      elements: a,
      middlewareData: l
    } = e, {
      element: u,
      padding: c = 0
    } = Re(n, e) || {};
    if (u == null)
      return {};
    const d = gs(c), h = {
      x: t,
      y: i
    }, m = Fn(s), f = qn(m), g = await r.getDimensions(u), v = m === "y", _ = v ? "top" : "left", w = v ? "bottom" : "right", S = v ? "clientHeight" : "clientWidth", y = o.reference[f] + o.reference[m] - h[m] - o.floating[f], x = h[m] - o.reference[m], C = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(u));
    let b = C ? C[S] : 0;
    (!b || !await (r.isElement == null ? void 0 : r.isElement(C))) && (b = a.floating[S] || o.floating[f]);
    const I = y / 2 - x / 2, T = b / 2 - g[f] / 2 - 1, k = ze(d[_], T), D = ze(d[w], T), R = k, z = b - g[f] - D, L = b / 2 - g[f] / 2 + I, $ = _n(R, L, z), X = !l.arrow && dt(s) != null && L !== $ && o.reference[f] / 2 - (L < R ? k : D) - g[f] / 2 < 0, j = X ? L < R ? L - R : L - z : 0;
    return {
      [m]: h[m] + j,
      data: {
        [m]: $,
        centerOffset: L - $ - j,
        ...X && {
          alignmentOffset: j
        }
      },
      reset: X
    };
  }
}), wl = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: s,
        middlewareData: o,
        rects: r,
        initialPlacement: a,
        platform: l,
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: h,
        fallbackStrategy: m = "bestFit",
        fallbackAxisSideDirection: f = "none",
        flipAlignment: g = !0,
        ...v
      } = Re(n, e);
      if ((t = o.arrow) != null && t.alignmentOffset)
        return {};
      const _ = Me(s), w = ke(a), S = Me(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), x = h || (S || !g ? [Nt(a)] : dl(a)), C = f !== "none";
      !h && C && x.push(...ml(a, g, f, y));
      const b = [a, ...x], I = await l.detectOverflow(e, v), T = [];
      let k = ((i = o.flip) == null ? void 0 : i.overflows) || [];
      if (c && T.push(I[_]), d) {
        const L = cl(s, r, y);
        T.push(I[L[0]], I[L[1]]);
      }
      if (k = [...k, {
        placement: s,
        overflows: T
      }], !T.every((L) => L <= 0)) {
        var D, R;
        const L = (((D = o.flip) == null ? void 0 : D.index) || 0) + 1, $ = b[L];
        if ($ && (!(d === "alignment" ? w !== ke($) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        k.every((G) => ke(G.placement) === w ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: L,
              overflows: k
            },
            reset: {
              placement: $
            }
          };
        let X = (R = k.filter((j) => j.overflows[0] <= 0).sort((j, G) => j.overflows[1] - G.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!X)
          switch (m) {
            case "bestFit": {
              var z;
              const j = (z = k.filter((G) => {
                if (C) {
                  const ee = ke(G.placement);
                  return ee === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ee === "y";
                }
                return !0;
              }).map((G) => [G.placement, G.overflows.filter((ee) => ee > 0).reduce((ee, ue) => ee + ue, 0)]).sort((G, ee) => G[1] - ee[1])[0]) == null ? void 0 : z[0];
              j && (X = j);
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
const Sl = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: i
      } = e, {
        strategy: s = "referenceHidden",
        ...o
      } = Re(n, e);
      switch (s) {
        case "referenceHidden": {
          const r = await i.detectOverflow(e, {
            ...o,
            elementContext: "reference"
          }), a = vi(r, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: gi(a)
            }
          };
        }
        case "escaped": {
          const r = await i.detectOverflow(e, {
            ...o,
            altBoundary: !0
          }), a = vi(r, t.floating);
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
}, ys = /* @__PURE__ */ new Set(["left", "top"]);
async function Cl(n, e) {
  const {
    placement: t,
    platform: i,
    elements: s
  } = n, o = await (i.isRTL == null ? void 0 : i.isRTL(s.floating)), r = Me(t), a = dt(t), l = ke(t) === "y", u = ys.has(r) ? -1 : 1, c = o && l ? -1 : 1, d = Re(e, n);
  let {
    mainAxis: h,
    crossAxis: m,
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
  return a && typeof f == "number" && (m = a === "end" ? f * -1 : f), l ? {
    x: m * c,
    y: h * u
  } : {
    x: h * u,
    y: m * c
  };
}
const xl = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, i;
      const {
        x: s,
        y: o,
        placement: r,
        middlewareData: a
      } = e, l = await Cl(e, n);
      return r === ((t = a.offset) == null ? void 0 : t.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: s + l.x,
        y: o + l.y,
        data: {
          ...l,
          placement: r
        }
      };
    }
  };
}, _l = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: i,
        placement: s,
        platform: o
      } = e, {
        mainAxis: r = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (_) => {
            let {
              x: w,
              y: S
            } = _;
            return {
              x: w,
              y: S
            };
          }
        },
        ...u
      } = Re(n, e), c = {
        x: t,
        y: i
      }, d = await o.detectOverflow(e, u), h = ke(Me(s)), m = Bn(h);
      let f = c[m], g = c[h];
      if (r) {
        const _ = m === "y" ? "top" : "left", w = m === "y" ? "bottom" : "right", S = f + d[_], y = f - d[w];
        f = _n(S, f, y);
      }
      if (a) {
        const _ = h === "y" ? "top" : "left", w = h === "y" ? "bottom" : "right", S = g + d[_], y = g - d[w];
        g = _n(S, g, y);
      }
      const v = l.fn({
        ...e,
        [m]: f,
        [h]: g
      });
      return {
        ...v,
        data: {
          x: v.x - t,
          y: v.y - i,
          enabled: {
            [m]: r,
            [h]: a
          }
        }
      };
    }
  };
}, El = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: i,
        placement: s,
        rects: o,
        middlewareData: r
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: u = !0
      } = Re(n, e), c = {
        x: t,
        y: i
      }, d = ke(s), h = Bn(d);
      let m = c[h], f = c[d];
      const g = Re(a, e), v = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const S = h === "y" ? "height" : "width", y = o.reference[h] - o.floating[S] + v.mainAxis, x = o.reference[h] + o.reference[S] - v.mainAxis;
        m < y ? m = y : m > x && (m = x);
      }
      if (u) {
        var _, w;
        const S = h === "y" ? "width" : "height", y = ys.has(Me(s)), x = o.reference[d] - o.floating[S] + (y && ((_ = r.offset) == null ? void 0 : _[d]) || 0) + (y ? 0 : v.crossAxis), C = o.reference[d] + o.reference[S] + (y ? 0 : ((w = r.offset) == null ? void 0 : w[d]) || 0) - (y ? v.crossAxis : 0);
        f < x ? f = x : f > C && (f = C);
      }
      return {
        [h]: m,
        [d]: f
      };
    }
  };
}, kl = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: s,
        rects: o,
        platform: r,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...u
      } = Re(n, e), c = await r.detectOverflow(e, u), d = Me(s), h = dt(s), m = ke(s) === "y", {
        width: f,
        height: g
      } = o.floating;
      let v, _;
      d === "top" || d === "bottom" ? (v = d, _ = h === (await (r.isRTL == null ? void 0 : r.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, v = h === "end" ? "top" : "bottom");
      const w = g - c.top - c.bottom, S = f - c.left - c.right, y = ze(g - c[v], w), x = ze(f - c[_], S), C = !e.middlewareData.shift;
      let b = y, I = x;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (I = S), (i = e.middlewareData.shift) != null && i.enabled.y && (b = w), C && !h) {
        const k = fe(c.left, 0), D = fe(c.right, 0), R = fe(c.top, 0), z = fe(c.bottom, 0);
        m ? I = f - 2 * (k !== 0 || D !== 0 ? k + D : fe(c.left, c.right)) : b = g - 2 * (R !== 0 || z !== 0 ? R + z : fe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: I,
        availableHeight: b
      });
      const T = await r.getDimensions(a.floating);
      return f !== T.width || g !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Gt() {
  return typeof window < "u";
}
function Ze(n) {
  return zn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function pe(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ie(n) {
  var e;
  return (e = (zn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function zn(n) {
  return Gt() ? n instanceof Node || n instanceof pe(n).Node : !1;
}
function Se(n) {
  return Gt() ? n instanceof Element || n instanceof pe(n).Element : !1;
}
function Ae(n) {
  return Gt() ? n instanceof HTMLElement || n instanceof pe(n).HTMLElement : !1;
}
function yi(n) {
  return !Gt() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof pe(n).ShadowRoot;
}
const Tl = /* @__PURE__ */ new Set(["inline", "contents"]);
function Et(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: s
  } = Ce(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !Tl.has(s);
}
const Pl = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Al(n) {
  return Pl.has(Ze(n));
}
const Ol = [":popover-open", ":modal"];
function Jt(n) {
  return Ol.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Il = ["transform", "translate", "scale", "rotate", "perspective"], Ll = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Dl = ["paint", "layout", "strict", "content"];
function Nn(n) {
  const e = Wn(), t = Se(n) ? Ce(n) : n;
  return Il.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || Ll.some((i) => (t.willChange || "").includes(i)) || Dl.some((i) => (t.contain || "").includes(i));
}
function Rl(n) {
  let e = Ne(n);
  for (; Ae(e) && !at(e); ) {
    if (Nn(e))
      return e;
    if (Jt(e))
      return null;
    e = Ne(e);
  }
  return null;
}
function Wn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Ml = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function at(n) {
  return Ml.has(Ze(n));
}
function Ce(n) {
  return pe(n).getComputedStyle(n);
}
function Zt(n) {
  return Se(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ne(n) {
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
function bs(n) {
  const e = Ne(n);
  return at(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Ae(e) && Et(e) ? e : bs(e);
}
function St(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const s = bs(n), o = s === ((i = n.ownerDocument) == null ? void 0 : i.body), r = pe(s);
  if (o) {
    const a = kn(r);
    return e.concat(r, r.visualViewport || [], Et(s) ? s : [], a && t ? St(a) : []);
  }
  return e.concat(s, St(s, [], t));
}
function kn(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function ws(n) {
  const e = Ce(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const s = Ae(n), o = s ? n.offsetWidth : t, r = s ? n.offsetHeight : i, a = zt(t) !== o || zt(i) !== r;
  return a && (t = o, i = r), {
    width: t,
    height: i,
    $: a
  };
}
function Hn(n) {
  return Se(n) ? n : n.contextElement;
}
function ot(n) {
  const e = Hn(n);
  if (!Ae(e))
    return Te(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: s,
    $: o
  } = ws(e);
  let r = (o ? zt(t.width) : t.width) / i, a = (o ? zt(t.height) : t.height) / s;
  return (!r || !Number.isFinite(r)) && (r = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: r,
    y: a
  };
}
const $l = /* @__PURE__ */ Te(0);
function Ss(n) {
  const e = pe(n);
  return !Wn() || !e.visualViewport ? $l : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Bl(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== pe(n) ? !1 : e;
}
function Xe(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), o = Hn(n);
  let r = Te(1);
  e && (i ? Se(i) && (r = ot(i)) : r = ot(n));
  const a = Bl(o, t, i) ? Ss(o) : Te(0);
  let l = (s.left + a.x) / r.x, u = (s.top + a.y) / r.y, c = s.width / r.x, d = s.height / r.y;
  if (o) {
    const h = pe(o), m = i && Se(i) ? pe(i) : i;
    let f = h, g = kn(f);
    for (; g && i && m !== f; ) {
      const v = ot(g), _ = g.getBoundingClientRect(), w = Ce(g), S = _.left + (g.clientLeft + parseFloat(w.paddingLeft)) * v.x, y = _.top + (g.clientTop + parseFloat(w.paddingTop)) * v.y;
      l *= v.x, u *= v.y, c *= v.x, d *= v.y, l += S, u += y, f = pe(g), g = kn(f);
    }
  }
  return Wt({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function Qt(n, e) {
  const t = Zt(n).scrollLeft;
  return e ? e.left + t : Xe(Ie(n)).left + t;
}
function Cs(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - Qt(n, t), s = t.top + e.scrollTop;
  return {
    x: i,
    y: s
  };
}
function ql(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: s
  } = n;
  const o = s === "fixed", r = Ie(i), a = e ? Jt(e.floating) : !1;
  if (i === r || a && o)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Te(1);
  const c = Te(0), d = Ae(i);
  if ((d || !d && !o) && ((Ze(i) !== "body" || Et(r)) && (l = Zt(i)), Ae(i))) {
    const m = Xe(i);
    u = ot(i), c.x = m.x + i.clientLeft, c.y = m.y + i.clientTop;
  }
  const h = r && !d && !o ? Cs(r, l) : Te(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + h.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + h.y
  };
}
function Fl(n) {
  return Array.from(n.getClientRects());
}
function zl(n) {
  const e = Ie(n), t = Zt(n), i = n.ownerDocument.body, s = fe(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), o = fe(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let r = -t.scrollLeft + Qt(n);
  const a = -t.scrollTop;
  return Ce(i).direction === "rtl" && (r += fe(e.clientWidth, i.clientWidth) - s), {
    width: s,
    height: o,
    x: r,
    y: a
  };
}
const bi = 25;
function Nl(n, e) {
  const t = pe(n), i = Ie(n), s = t.visualViewport;
  let o = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (s) {
    o = s.width, r = s.height;
    const c = Wn();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  const u = Qt(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, h = getComputedStyle(d), m = c.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, f = Math.abs(i.clientWidth - d.clientWidth - m);
    f <= bi && (o -= f);
  } else u <= bi && (o += u);
  return {
    width: o,
    height: r,
    x: a,
    y: l
  };
}
const Wl = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Hl(n, e) {
  const t = Xe(n, !0, e === "fixed"), i = t.top + n.clientTop, s = t.left + n.clientLeft, o = Ae(n) ? ot(n) : Te(1), r = n.clientWidth * o.x, a = n.clientHeight * o.y, l = s * o.x, u = i * o.y;
  return {
    width: r,
    height: a,
    x: l,
    y: u
  };
}
function wi(n, e, t) {
  let i;
  if (e === "viewport")
    i = Nl(n, t);
  else if (e === "document")
    i = zl(Ie(n));
  else if (Se(e))
    i = Hl(e, t);
  else {
    const s = Ss(n);
    i = {
      x: e.x - s.x,
      y: e.y - s.y,
      width: e.width,
      height: e.height
    };
  }
  return Wt(i);
}
function xs(n, e) {
  const t = Ne(n);
  return t === e || !Se(t) || at(t) ? !1 : Ce(t).position === "fixed" || xs(t, e);
}
function Vl(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = St(n, [], !1).filter((a) => Se(a) && Ze(a) !== "body"), s = null;
  const o = Ce(n).position === "fixed";
  let r = o ? Ne(n) : n;
  for (; Se(r) && !at(r); ) {
    const a = Ce(r), l = Nn(r);
    !l && a.position === "fixed" && (s = null), (o ? !l && !s : !l && a.position === "static" && !!s && Wl.has(s.position) || Et(r) && !l && xs(n, r)) ? i = i.filter((c) => c !== r) : s = a, r = Ne(r);
  }
  return e.set(n, i), i;
}
function jl(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: s
  } = n;
  const r = [...t === "clippingAncestors" ? Jt(e) ? [] : Vl(e, this._c) : [].concat(t), i], a = r[0], l = r.reduce((u, c) => {
    const d = wi(e, c, s);
    return u.top = fe(d.top, u.top), u.right = ze(d.right, u.right), u.bottom = ze(d.bottom, u.bottom), u.left = fe(d.left, u.left), u;
  }, wi(e, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Ul(n) {
  const {
    width: e,
    height: t
  } = ws(n);
  return {
    width: e,
    height: t
  };
}
function Kl(n, e, t) {
  const i = Ae(e), s = Ie(e), o = t === "fixed", r = Xe(n, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Te(0);
  function u() {
    l.x = Qt(s);
  }
  if (i || !i && !o)
    if ((Ze(e) !== "body" || Et(s)) && (a = Zt(e)), i) {
      const m = Xe(e, !0, o, e);
      l.x = m.x + e.clientLeft, l.y = m.y + e.clientTop;
    } else s && u();
  o && !i && s && u();
  const c = s && !i && !o ? Cs(s, a) : Te(0), d = r.left + a.scrollLeft - l.x - c.x, h = r.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: h,
    width: r.width,
    height: r.height
  };
}
function hn(n) {
  return Ce(n).position === "static";
}
function Si(n, e) {
  if (!Ae(n) || Ce(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Ie(n) === t && (t = t.ownerDocument.body), t;
}
function _s(n, e) {
  const t = pe(n);
  if (Jt(n))
    return t;
  if (!Ae(n)) {
    let s = Ne(n);
    for (; s && !at(s); ) {
      if (Se(s) && !hn(s))
        return s;
      s = Ne(s);
    }
    return t;
  }
  let i = Si(n, e);
  for (; i && Al(i) && hn(i); )
    i = Si(i, e);
  return i && at(i) && hn(i) && !Nn(i) ? t : i || Rl(n) || t;
}
const Xl = async function(n) {
  const e = this.getOffsetParent || _s, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: Kl(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Yl(n) {
  return Ce(n).direction === "rtl";
}
const Gl = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ql,
  getDocumentElement: Ie,
  getClippingRect: jl,
  getOffsetParent: _s,
  getElementRects: Xl,
  getClientRects: Fl,
  getDimensions: Ul,
  getScale: ot,
  isElement: Se,
  isRTL: Yl
};
function Es(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Jl(n, e) {
  let t = null, i;
  const s = Ie(n);
  function o() {
    var a;
    clearTimeout(i), (a = t) == null || a.disconnect(), t = null;
  }
  function r(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const u = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: h,
      height: m
    } = u;
    if (a || e(), !h || !m)
      return;
    const f = Ot(d), g = Ot(s.clientWidth - (c + h)), v = Ot(s.clientHeight - (d + m)), _ = Ot(c), S = {
      rootMargin: -f + "px " + -g + "px " + -v + "px " + -_ + "px",
      threshold: fe(0, ze(1, l)) || 1
    };
    let y = !0;
    function x(C) {
      const b = C[0].intersectionRatio;
      if (b !== l) {
        if (!y)
          return r();
        b ? r(!1, b) : i = setTimeout(() => {
          r(!1, 1e-7);
        }, 1e3);
      }
      b === 1 && !Es(u, n.getBoundingClientRect()) && r(), y = !1;
    }
    try {
      t = new IntersectionObserver(x, {
        ...S,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(x, S);
    }
    t.observe(n);
  }
  return r(!0), o;
}
function Zl(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: o = !0,
    elementResize: r = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Hn(n), c = s || o ? [...u ? St(u) : [], ...St(e)] : [];
  c.forEach((_) => {
    s && _.addEventListener("scroll", t, {
      passive: !0
    }), o && _.addEventListener("resize", t);
  });
  const d = u && a ? Jl(u, t) : null;
  let h = -1, m = null;
  r && (m = new ResizeObserver((_) => {
    let [w] = _;
    w && w.target === u && m && (m.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var S;
      (S = m) == null || S.observe(e);
    })), t();
  }), u && !l && m.observe(u), m.observe(e));
  let f, g = l ? Xe(n) : null;
  l && v();
  function v() {
    const _ = Xe(n);
    g && !Es(g, _) && t(), g = _, f = requestAnimationFrame(v);
  }
  return t(), () => {
    var _;
    c.forEach((w) => {
      s && w.removeEventListener("scroll", t), o && w.removeEventListener("resize", t);
    }), d?.(), (_ = m) == null || _.disconnect(), m = null, l && cancelAnimationFrame(f);
  };
}
const Ql = xl, eu = _l, Ci = wl, tu = kl, nu = Sl, iu = bl, su = El, ou = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), s = {
    platform: Gl,
    ...t
  }, o = {
    ...s.platform,
    _c: i
  };
  return yl(n, e, {
    ...s,
    platform: o
  });
};
function ru(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Tn(n) {
  if (ru(n)) {
    const e = n.$el;
    return zn(e) && Ze(e) === "#comment" ? null : e;
  }
  return n;
}
function st(n) {
  return typeof n == "function" ? n() : p(n);
}
function au(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Tn(st(n.element));
      return t == null ? {} : iu({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function ks(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function xi(n, e) {
  const t = ks(n);
  return Math.round(e * t) / t;
}
function lu(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, s = P(() => {
    var b;
    return (b = st(t.open)) != null ? b : !0;
  }), o = P(() => st(t.middleware)), r = P(() => {
    var b;
    return (b = st(t.placement)) != null ? b : "bottom";
  }), a = P(() => {
    var b;
    return (b = st(t.strategy)) != null ? b : "absolute";
  }), l = P(() => {
    var b;
    return (b = st(t.transform)) != null ? b : !0;
  }), u = P(() => Tn(n.value)), c = P(() => Tn(e.value)), d = A(0), h = A(0), m = A(a.value), f = A(r.value), g = rt({}), v = A(!1), _ = P(() => {
    const b = {
      position: m.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return b;
    const I = xi(c.value, d.value), T = xi(c.value, h.value);
    return l.value ? {
      ...b,
      transform: "translate(" + I + "px, " + T + "px)",
      ...ks(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: m.value,
      left: I + "px",
      top: T + "px"
    };
  });
  let w;
  function S() {
    if (u.value == null || c.value == null)
      return;
    const b = s.value;
    ou(u.value, c.value, {
      middleware: o.value,
      placement: r.value,
      strategy: a.value
    }).then((I) => {
      d.value = I.x, h.value = I.y, m.value = I.strategy, f.value = I.placement, g.value = I.middlewareData, v.value = b !== !1;
    });
  }
  function y() {
    typeof w == "function" && (w(), w = void 0);
  }
  function x() {
    if (y(), i === void 0) {
      S();
      return;
    }
    if (u.value != null && c.value != null) {
      w = i(u.value, c.value, S);
      return;
    }
  }
  function C() {
    s.value || (v.value = !1);
  }
  return Z([o, r, a, s], S, {
    flush: "sync"
  }), Z([u, c], x, {
    flush: "sync"
  }), Z(s, C, {
    flush: "sync"
  }), Di() && Ri(y), {
    x: tt(d),
    y: tt(h),
    strategy: tt(m),
    placement: tt(f),
    middlewareData: tt(g),
    isPositioned: tt(v),
    floatingStyles: _,
    update: S
  };
}
const uu = {
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
}, [Md, cu] = Oe("PopperContent");
var du = /* @__PURE__ */ F({
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
  }, { ...uu }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = vs(), { forwardRef: o, currentElement: r } = ie(), a = A(), l = A(), { width: u, height: c } = la(l), d = P(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), h = P(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), m = P(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), f = P(() => ({
      padding: h.value,
      boundary: m.value.filter(sl),
      altBoundary: m.value.length > 0
    })), g = P(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), v = Mr(() => [
      Ql({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Ci({
        ...f.value,
        ...g.value
      }),
      t.avoidCollisions && eu({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? su() : void 0,
        ...f.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Ci({
        ...f.value,
        ...g.value
      }),
      tu({
        ...f.value,
        apply: ({ elements: R, rects: z, availableWidth: L, availableHeight: $ }) => {
          const { width: X, height: j } = z.reference, G = R.floating.style;
          G.setProperty("--reka-popper-available-width", `${L}px`), G.setProperty("--reka-popper-available-height", `${$}px`), G.setProperty("--reka-popper-anchor-width", `${X}px`), G.setProperty("--reka-popper-anchor-height", `${j}px`);
        }
      }),
      l.value && au({
        element: l.value,
        padding: t.arrowPadding
      }),
      ol({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && nu({
        strategy: "referenceHidden",
        ...f.value
      })
    ]), _ = P(() => t.reference ?? s.anchor.value), { floatingStyles: w, placement: S, isPositioned: y, middlewareData: x } = lu(_, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => Zl(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: v
    }), C = P(() => xn(S.value)[0]), b = P(() => xn(S.value)[1]);
    Fi(() => {
      y.value && i("placed");
    });
    const I = P(() => {
      const R = x.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), T = A("");
    ye(() => {
      r.value && (T.value = window.getComputedStyle(r.value).zIndex);
    });
    const k = P(() => x.value.arrow?.x ?? 0), D = P(() => x.value.arrow?.y ?? 0);
    return cu({
      placedSide: C,
      onArrowChange: (R) => l.value = R,
      arrowX: k,
      arrowY: D,
      shouldHideArrow: I
    }), (R, z) => (E(), W("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: lt({
        ...p(w),
        transform: p(y) ? p(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: T.value,
        "--reka-popper-transform-origin": [p(x).transformOrigin?.x, p(x).transformOrigin?.y].join(" "),
        ...p(x).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(p(te), Q({ ref: p(o) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": C.value,
      "data-align": b.value,
      style: { animation: p(y) ? void 0 : "none" }
    }), {
      default: O(() => [V(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), fu = du;
function pu(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => mt(i, e, t)) : mt(n, e, t);
}
function mt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ft(n, e);
}
const [Vn, hu] = Oe("ListboxRoot");
var mu = /* @__PURE__ */ F({
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
    const i = n, s = t, { multiple: o, highlightOnHover: r, orientation: a, disabled: l, selectionBehavior: u, dir: c } = ct(i), { getItems: d } = He({ isProvider: !0 }), { handleTypeaheadSearch: h } = Mn(), { primitiveElement: m, currentElement: f } = wt(), g = aa(), v = es(c), _ = ts(f), w = A(), S = A(!1), y = A(!0), x = /* @__PURE__ */ yt(i, "modelValue", s, {
      defaultValue: i.defaultValue ?? (o.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function C(B) {
      if (S.value = !0, i.multiple) {
        const N = Array.isArray(x.value) ? [...x.value] : [], U = N.findIndex((J) => mt(J, B, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? N.push(B) : N.splice(U, 1), x.value = N) : (x.value = [B], w.value = B);
      } else i.selectionBehavior === "toggle" && mt(x.value, B, i.by) ? x.value = void 0 : x.value = B;
      setTimeout(() => {
        S.value = !1;
      }, 1);
    }
    const b = A(null), I = A(null), T = A(!1), k = A(!1), D = /* @__PURE__ */ an(), R = /* @__PURE__ */ an(), z = /* @__PURE__ */ an();
    function L() {
      return d().map((B) => B.ref).filter((B) => B.dataset.disabled !== "");
    }
    function $(B, N = !0) {
      if (!B) return;
      b.value = B, y.value && b.value.focus(), N && b.value.scrollIntoView({ block: "nearest" });
      const U = d().find((J) => J.ref === B);
      s("highlight", U);
    }
    function X(B) {
      if (T.value) z.trigger(B);
      else {
        const N = d().find((U) => mt(U.value, B, i.by));
        N && (b.value = N.ref, $(N.ref));
      }
    }
    function j(B) {
      b.value && b.value.isConnected && (B.preventDefault(), B.stopPropagation(), k.value || b.value.click());
    }
    function G(B) {
      if (y.value) {
        if (S.value = !0, T.value) R.trigger(B);
        else {
          const N = B.altKey || B.ctrlKey || B.metaKey;
          if (N && B.key === "a" && o.value) {
            const U = d(), J = U.map((_e) => _e.value);
            x.value = [...J], B.preventDefault(), $(U[U.length - 1].ref);
          } else if (!N) {
            const U = h(B.key, d());
            U && $(U);
          }
        }
        setTimeout(() => {
          S.value = !1;
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
        const B = new KeyboardEvent("keydown", { key: "PageUp" });
        je(B);
      });
    }
    function be(B) {
      const N = b.value;
      N?.isConnected && (I.value = N), b.value = null, s("leave", B);
    }
    function et(B) {
      const N = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (B.currentTarget?.dispatchEvent(N), s("entryFocus", N), !N.defaultPrevented)
        if (I.value) $(I.value);
        else {
          const U = L()?.[0];
          $(U);
        }
    }
    function je(B) {
      const N = Xa(B, a.value, v.value);
      if (!N) return;
      let U = L();
      if (b.value) {
        if (N === "last") U.reverse();
        else if (N === "prev" || N === "next") {
          N === "prev" && U.reverse();
          const J = U.indexOf(b.value);
          U = U.slice(J + 1);
        }
        tn(B, U[0]);
      }
      if (U.length) {
        const J = !b.value && N === "prev" ? U.length - 1 : 0;
        $(U[J]);
      }
      if (T.value) return R.trigger(B);
    }
    function tn(B, N) {
      if (!(T.value || i.selectionBehavior !== "replace" || !o.value || !Array.isArray(x.value) || (B.altKey || B.ctrlKey || B.metaKey) && !B.shiftKey) && B.shiftKey) {
        const J = d().filter((Le) => Le.ref.dataset.disabled !== "");
        let _e = J.find((Le) => Le.ref === N)?.value;
        if (B.key === g.END ? _e = J[J.length - 1].value : B.key === g.HOME && (_e = J[0].value), !_e || !w.value) return;
        const ft = Rr(J.map((Le) => Le.value), w.value, _e);
        x.value = ft;
      }
    }
    async function nn(B) {
      if (await se(), T.value) D.trigger(B);
      else {
        const N = L(), U = N.find((J) => J.dataset.state === "checked");
        U ? $(U) : N.length && $(N[0]);
      }
    }
    return Z(x, () => {
      S.value || se(() => {
        nn();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: b,
      highlightItem: X,
      highlightFirstItem: Qe,
      highlightSelected: nn,
      getItems: d
    }), hu({
      modelValue: x,
      onValueChange: C,
      multiple: o,
      orientation: a,
      dir: v,
      disabled: l,
      highlightOnHover: r,
      highlightedElement: b,
      isVirtual: T,
      virtualFocusHook: D,
      virtualKeydownHook: R,
      virtualHighlightHook: z,
      by: i.by,
      firstValue: w,
      selectionBehavior: u,
      focusable: y,
      onLeave: be,
      onEnter: et,
      changeHighlight: $,
      onKeydownEnter: j,
      onKeydownNavigation: je,
      onKeydownTypeAhead: G,
      onCompositionStart: ee,
      onCompositionEnd: ue,
      highlightFirstItem: Qe
    }), (B, N) => (E(), M(p(te), {
      ref_key: "primitiveElement",
      ref: m,
      as: B.as,
      "as-child": B.asChild,
      dir: p(v),
      "data-disabled": p(l) ? "" : void 0,
      onPointerleave: be,
      onFocusout: N[0] || (N[0] = async (U) => {
        const J = U.relatedTarget || U.target;
        await se(), b.value && p(f) && !p(f).contains(J) && be(U);
      })
    }, {
      default: O(() => [V(B.$slots, "default", { modelValue: p(x) }), p(_) && B.name ? (E(), M(p(Za), {
        key: 0,
        name: B.name,
        value: p(x),
        disabled: p(l),
        required: B.required
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
}), vu = mu, gu = /* @__PURE__ */ F({
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
    const { CollectionSlot: e } = He(), t = Vn(), i = Yi(!1, 10);
    return (s, o) => (E(), M(p(e), null, {
      default: O(() => [q(p(te), {
        role: "listbox",
        as: s.as,
        "as-child": s.asChild,
        tabindex: p(t).focusable.value ? p(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": p(t).orientation.value,
        "aria-multiselectable": !!p(t).multiple.value,
        "data-orientation": p(t).orientation.value,
        onMousedown: o[0] || (o[0] = Fe((r) => i.value = !0, ["left"])),
        onFocus: o[1] || (o[1] = (r) => {
          p(i) || p(t).onEnter(r);
        }),
        onKeydown: [
          o[2] || (o[2] = gt((r) => {
            p(t).orientation.value === "vertical" && (r.key === "ArrowLeft" || r.key === "ArrowRight") || p(t).orientation.value === "horizontal" && (r.key === "ArrowUp" || r.key === "ArrowDown") || (r.preventDefault(), p(t).focusable.value && p(t).onKeydownNavigation(r));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          gt(p(t).onKeydownEnter, ["enter"]),
          p(t).onKeydownTypeAhead
        ]
      }, {
        default: O(() => [V(s.$slots, "default")]),
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
}), yu = gu, bu = /* @__PURE__ */ F({
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
    const t = n, s = /* @__PURE__ */ yt(t, "modelValue", e, {
      defaultValue: "",
      passive: t.modelValue === void 0
    }), o = Vn(), { primitiveElement: r, currentElement: a } = wt(), l = P(() => t.disabled || o.disabled.value || !1), u = A();
    return Js(() => u.value = o.highlightedElement.value?.id), oe(() => {
      o.focusable.value = !1, setTimeout(() => {
        t.autoFocus && a.value?.focus();
      }, 1);
    }), ut(() => {
      o.focusable.value = !0;
    }), (c, d) => (E(), M(p(te), {
      ref_key: "primitiveElement",
      ref: r,
      as: c.as,
      "as-child": c.asChild,
      value: p(s),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": u.value,
      type: "text",
      onKeydown: [gt(Fe(p(o).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), gt(p(o).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (h) => {
        s.value = h.target.value, p(o).highlightFirstItem();
      }),
      onCompositionstart: p(o).onCompositionStart,
      onCompositionend: p(o).onCompositionEnd
    }, {
      default: O(() => [V(c.$slots, "default", { modelValue: p(s) })]),
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
}), wu = bu;
const Su = "listbox.select", [Cu, xu] = Oe("ListboxItem");
var _u = /* @__PURE__ */ F({
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
    const t = n, i = e, s = bt(void 0, "reka-listbox-item"), { CollectionItem: o } = He(), { forwardRef: r, currentElement: a } = ie(), l = Vn(), u = P(() => a.value === l.highlightedElement.value), c = P(() => pu(l.modelValue.value, t.value, l.by)), d = P(() => l.disabled.value || t.disabled);
    async function h(f) {
      i("select", f), !f?.defaultPrevented && !d.value && f && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function m(f) {
      const g = {
        originalEvent: f,
        value: t.value
      };
      jt(Su, h, g);
    }
    return xu({ isSelected: c }), (f, g) => (E(), M(p(o), { value: f.value }, {
      default: O(() => [Zs([u.value, c.value], () => q(p(te), Q({ id: p(s) }, f.$attrs, {
        ref: p(r),
        role: "option",
        tabindex: p(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: f.as,
        "as-child": f.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: m,
        onKeydown: gt(Fe(m, ["prevent"]), ["space"]),
        onPointermove: g[0] || (g[0] = () => {
          p(l).highlightedElement.value !== p(a) && p(l).highlightOnHover.value && !p(l).focusable.value && p(l).changeHighlight(p(a), !1);
        })
      }), {
        default: O(() => [V(f.$slots, "default")]),
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
}), Eu = _u, ku = /* @__PURE__ */ F({
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
    const t = Cu();
    return (i, s) => p(t).isSelected.value ? (E(), M(p(te), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), Tu = ku;
function Pu(n) {
  const e = Ut({ nonce: A() });
  return P(() => n?.value || e.nonce?.value);
}
const Au = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Ou = [" ", "Enter"], we = 10;
function Ct(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => Pn(i, e, t)) : Pn(n, e, t);
}
function Pn(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ft(n, e);
}
function Iu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Lu = {
  key: 0,
  value: ""
}, [Ve, Ts] = Oe("SelectRoot");
var Du = /* @__PURE__ */ F({
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
    const t = n, i = e, { required: s, disabled: o, multiple: r, dir: a } = ct(t), l = /* @__PURE__ */ yt(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (r.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ yt(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = A(), d = A(), h = A({
      x: 0,
      y: 0
    }), m = P(() => r.value && Array.isArray(l.value) ? l.value?.length === 0 : wn(l.value));
    He({ isProvider: !0 });
    const f = es(a), g = ts(c), v = A(/* @__PURE__ */ new Set()), _ = P(() => Array.from(v.value).map((y) => y.value).join(";"));
    function w(y) {
      if (r.value) {
        const x = Array.isArray(l.value) ? [...l.value] : [], C = x.findIndex((b) => Pn(b, y, t.by));
        C === -1 ? x.push(y) : x.splice(C, 1), l.value = [...x];
      } else l.value = y;
    }
    function S(y) {
      return Array.from(v.value).find((x) => Ct(y, x.value, t.by));
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
      onValueChange: w,
      by: t.by,
      open: u,
      multiple: r,
      required: s,
      onOpenChange: (y) => {
        u.value = y;
      },
      dir: f,
      triggerPointerDownPosRef: h,
      disabled: o,
      isEmptyModelValue: m,
      optionsSet: v,
      onOptionAdd: (y) => {
        const x = S(y.value);
        x && v.value.delete(x), v.value.add(y);
      },
      onOptionRemove: (y) => {
        const x = S(y.value);
        x && v.value.delete(x);
      }
    }), (y, x) => (E(), M(p(tl), null, {
      default: O(() => [V(y.$slots, "default", {
        modelValue: p(l),
        open: p(u)
      }), p(g) ? (E(), M($u, {
        key: _.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: p(r),
        required: p(s),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: p(o),
        value: p(l)
      }, {
        default: O(() => [p(wn)(p(l)) ? (E(), W("option", Lu)) : K("v-if", !0), (E(!0), W(ve, null, Ye(Array.from(v.value), (C) => (E(), W("option", Q({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
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
}), Ru = Du, Mu = /* @__PURE__ */ F({
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
    const e = n, t = A(), i = Ve();
    Z(() => e.value, (o, r) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (o !== r && u && t.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(t.value, o), t.value.dispatchEvent(c);
      }
    });
    function s(o) {
      i.onValueChange(o.target.value);
    }
    return (o, r) => (E(), M(p(ms), { "as-child": "" }, {
      default: O(() => [H("select", Q({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: s }), [V(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), $u = Mu, Bu = /* @__PURE__ */ F({
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
    const t = Rn(n);
    return (i, s) => (E(), M(p(fu), Q(p(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qu = Bu;
const Fu = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [en, Ps] = Oe("SelectContent");
var zu = /* @__PURE__ */ F({
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
    const t = n, i = e, s = Ve();
    ea(), Zi(t.bodyLock);
    const { CollectionSlot: o, getItems: r } = He(), a = A();
    is(a);
    const { search: l, handleTypeaheadSearch: u } = Mn(), c = A(), d = A(), h = A(), m = A(!1), f = A(!1), g = A(!1);
    function v() {
      d.value && a.value && ci([d.value, a.value]);
    }
    Z(m, () => {
      v();
    });
    const { onOpenChange: _, triggerPointerDownPosRef: w } = s;
    ye((C) => {
      if (!a.value) return;
      let b = {
        x: 0,
        y: 0
      };
      const I = (k) => {
        b = {
          x: Math.abs(Math.round(k.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(k.pageY) - (w.value?.y ?? 0))
        };
      }, T = (k) => {
        k.pointerType !== "touch" && (b.x <= 10 && b.y <= 10 ? k.preventDefault() : a.value?.contains(k.target) || _(!1), document.removeEventListener("pointermove", I), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", I), document.addEventListener("pointerup", T, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function S(C) {
      const b = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !b && C.key.length === 1 && u(C.key, r()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let T = [...r().map((k) => k.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const k = C.target, D = T.indexOf(k);
          T = T.slice(D + 1);
        }
        setTimeout(() => ci(T)), C.preventDefault();
      }
    }
    const y = P(() => t.position === "popper" ? t : {}), x = Rn(y.value);
    return Ps({
      content: a,
      viewport: c,
      onViewportChange: (C) => {
        c.value = C;
      },
      itemRefCallback: (C, b, I) => {
        const T = !f.value && !I, k = Ct(s.modelValue.value, b, s.by);
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
      itemTextRefCallback: (C, b, I) => {
        const T = !f.value && !I;
        (Ct(s.modelValue.value, b, s.by) || T) && (h.value = C);
      },
      focusSelectedItem: v,
      position: t.position,
      isPositioned: m,
      searchRef: l
    }), (C, b) => (E(), M(p(o), null, {
      default: O(() => [q(p(ls), {
        "as-child": "",
        onMountAutoFocus: b[6] || (b[6] = Fe(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: b[7] || (b[7] = (I) => {
          i("closeAutoFocus", I), !I.defaultPrevented && (p(s).triggerElement.value?.focus({ preventScroll: !0 }), I.preventDefault());
        })
      }, {
        default: O(() => [q(p(rs), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: b[2] || (b[2] = Fe(() => {
          }, ["prevent"])),
          onDismiss: b[3] || (b[3] = (I) => p(s).onOpenChange(!1)),
          onEscapeKeyDown: b[4] || (b[4] = (I) => i("escapeKeyDown", I)),
          onPointerDownOutside: b[5] || (b[5] = (I) => i("pointerDownOutside", I))
        }, {
          default: O(() => [(E(), M(Qs(C.position === "popper" ? qu : ju), Q({
            ...C.$attrs,
            ...p(x)
          }, {
            id: p(s).contentId,
            ref: (I) => {
              const T = p(Pe)(I);
              T?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = T.firstElementChild : a.value = T;
            },
            role: "listbox",
            "data-state": p(s).open.value ? "open" : "closed",
            dir: p(s).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: b[0] || (b[0] = Fe(() => {
            }, ["prevent"])),
            onPlaced: b[1] || (b[1] = (I) => m.value = !0),
            onKeydown: S
          }), {
            default: O(() => [V(C.$slots, "default")]),
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
}), Nu = zu;
const [Wu, Hu] = Oe("SelectItemAlignedPosition");
var Vu = /* @__PURE__ */ F({
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
    const t = n, i = e, { getItems: s } = He(), o = Ve(), r = en(), a = A(!1), l = A(!0), u = A(), { forwardRef: c, currentElement: d } = ie(), { viewport: h, selectedItem: m, selectedItemText: f, focusSelectedItem: g } = r;
    function v() {
      if (o.triggerElement.value && o.valueElement.value && u.value && d.value && h?.value && m?.value && f?.value) {
        const S = o.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), x = o.valueElement.value.getBoundingClientRect(), C = f.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const B = C.left - y.left, N = x.left - B, U = S.left - N, J = S.width + U, _e = Math.max(J, y.width), ft = window.innerWidth - we, Le = si(N, we, Math.max(we, ft - _e));
          u.value.style.minWidth = `${J}px`, u.value.style.left = `${Le}px`;
        } else {
          const B = y.right - C.right, N = window.innerWidth - x.right - B, U = window.innerWidth - S.right - N, J = S.width + U, _e = Math.max(J, y.width), ft = window.innerWidth - we, Le = si(N, we, Math.max(we, ft - _e));
          u.value.style.minWidth = `${J}px`, u.value.style.right = `${Le}px`;
        }
        const b = s().map((B) => B.ref), I = window.innerHeight - we * 2, T = h.value.scrollHeight, k = window.getComputedStyle(d.value), D = Number.parseInt(k.borderTopWidth, 10), R = Number.parseInt(k.paddingTop, 10), z = Number.parseInt(k.borderBottomWidth, 10), L = Number.parseInt(k.paddingBottom, 10), $ = D + R + T + L + z, X = Math.min(m.value.offsetHeight * 5, $), j = window.getComputedStyle(h.value), G = Number.parseInt(j.paddingTop, 10), ee = Number.parseInt(j.paddingBottom, 10), ue = S.top + S.height / 2 - we, Qe = I - ue, be = m.value.offsetHeight / 2, et = m.value.offsetTop + be, je = D + R + et, tn = $ - je;
        if (je <= ue) {
          const B = m.value === b[b.length - 1];
          u.value.style.bottom = "0px";
          const N = d.value.clientHeight - h.value.offsetTop - h.value.offsetHeight, U = Math.max(Qe, be + (B ? ee : 0) + N + z), J = je + U;
          u.value.style.height = `${J}px`;
        } else {
          const B = m.value === b[0];
          u.value.style.top = "0px";
          const U = Math.max(ue, D + h.value.offsetTop + (B ? G : 0) + be) + tn;
          u.value.style.height = `${U}px`, h.value.scrollTop = je - ue + h.value.offsetTop;
        }
        u.value.style.margin = `${we}px 0`, u.value.style.minHeight = `${X}px`, u.value.style.maxHeight = `${I}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const _ = A("");
    oe(async () => {
      await se(), v(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(S) {
      S && l.value === !0 && (v(), g?.(), l.value = !1);
    }
    return Yr(o.triggerElement, () => {
      v();
    }), Hu({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: w
    }), (S, y) => (E(), W("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: lt({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: _.value
      })
    }, [q(p(te), Q({
      ref: p(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...S.$attrs,
      ...t
    }), {
      default: O(() => [V(S.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), ju = Vu, Uu = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Ts(n.context), Ps(Fu), (t, i) => V(t.$slots, "default");
  }
}), Ku = Uu;
const Xu = { key: 1 };
var Yu = /* @__PURE__ */ F({
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
    const t = n, s = ta(t, e), o = Ve(), r = A();
    oe(() => {
      r.value = new DocumentFragment();
    });
    const a = A(), l = P(() => t.forceMount || o.open.value), u = A(l.value);
    return Z(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (E(), M(p($n), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: O(() => [q(Nu, On(In({
        ...p(s),
        ...c.$attrs
      })), {
        default: O(() => [V(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : r.value ? (E(), W("div", Xu, [(E(), M(qi, { to: r.value }, [q(Ku, { context: p(o) }, {
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), Gu = Yu, Ju = /* @__PURE__ */ F({
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
    return (e, t) => (E(), M(p(te), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: O(() => [V(e.$slots, "default", {}, () => [t[0] || (t[0] = de("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Zu = Ju;
const [As, Qu] = Oe("SelectItem");
var ec = /* @__PURE__ */ F({
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
    const t = n, i = e, { disabled: s } = ct(t), o = Ve(), r = en(), { forwardRef: a, currentElement: l } = ie(), { CollectionItem: u } = He(), c = P(() => Ct(o.modelValue?.value, t.value, o.by)), d = A(!1), h = A(t.textValue ?? ""), m = bt(void 0, "reka-select-item-text"), f = "select.select";
    async function g(y) {
      if (y.defaultPrevented) return;
      const x = {
        originalEvent: y,
        value: t.value
      };
      jt(f, v, x);
    }
    async function v(y) {
      await se(), i("select", y), !y.defaultPrevented && (s.value || (o.onValueChange(t.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function _(y) {
      await se(), !y.defaultPrevented && (s.value ? r.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(y) {
      await se(), !y.defaultPrevented && y.currentTarget === ge() && r.onItemLeave?.();
    }
    async function S(y) {
      await se(), !(y.defaultPrevented || r.searchRef?.value !== "" && y.key === " ") && (Ou.includes(y.key) && g(y), y.key === " " && y.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return oe(() => {
      l.value && r.itemRefCallback(l.value, t.value, t.disabled);
    }), Qu({
      value: t.value,
      disabled: s,
      textId: m,
      isSelected: c,
      onItemTextChange: (y) => {
        h.value = ((h.value || y?.textContent) ?? "").trim();
      }
    }), (y, x) => (E(), M(p(u), { value: { textValue: h.value } }, {
      default: O(() => [q(p(te), {
        ref: p(a),
        role: "option",
        "aria-labelledby": p(m),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": p(s) || void 0,
        "data-disabled": p(s) ? "" : void 0,
        tabindex: p(s) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: x[0] || (x[0] = (C) => d.value = !0),
        onBlur: x[1] || (x[1] = (C) => d.value = !1),
        onPointerup: g,
        onPointerdown: x[2] || (x[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: x[3] || (x[3] = Fe(() => {
        }, ["prevent", "stop"])),
        onPointermove: _,
        onPointerleave: w,
        onKeydown: S
      }, {
        default: O(() => [V(y.$slots, "default")]),
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
}), tc = ec, nc = /* @__PURE__ */ F({
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
    return (i, s) => p(t).isSelected.value ? (E(), M(p(te), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), ic = nc, sc = /* @__PURE__ */ F({
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
    const e = n, t = Ve(), i = en(), s = As(), { forwardRef: o, currentElement: r } = ie(), a = P(() => ({
      value: s.value,
      disabled: s.disabled.value,
      textContent: r.value?.textContent ?? s.value?.toString() ?? ""
    }));
    return oe(() => {
      r.value && (s.onItemTextChange(r.value), i.itemTextRefCallback(r.value, s.value, s.disabled.value), t.onOptionAdd(a.value));
    }), ut(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (E(), M(p(te), Q({
      id: p(s).textId,
      ref: p(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), oc = sc, rc = /* @__PURE__ */ F({
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
    return (t, i) => (E(), M(p(fs), On(In(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ac = rc, lc = /* @__PURE__ */ F({
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
    const e = n, t = Ve(), { forwardRef: i, currentElement: s } = ie(), o = P(() => t.disabled?.value || e.disabled);
    t.contentId ||= bt(void 0, "reka-select-content"), oe(() => {
      t.onTriggerChange(s.value);
    });
    const { getItems: r } = He(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = Mn();
    function c() {
      o.value || (t.onOpenChange(!0), u());
    }
    function d(h) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(h.pageX),
        y: Math.round(h.pageY)
      };
    }
    return (h, m) => (E(), M(p(il), {
      "as-child": "",
      reference: h.reference
    }, {
      default: O(() => [q(p(te), {
        ref: p(i),
        role: "combobox",
        type: h.as === "button" ? "button" : void 0,
        "aria-controls": p(t).contentId,
        "aria-expanded": p(t).open.value || !1,
        "aria-required": p(t).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: p(t)?.dir.value,
        "data-state": p(t)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": p(Iu)(p(t).modelValue?.value) ? "" : void 0,
        "as-child": h.asChild,
        as: h.as,
        onClick: m[0] || (m[0] = (f) => {
          f?.currentTarget?.focus();
        }),
        onPointerdown: m[1] || (m[1] = (f) => {
          if (f.pointerType === "touch") return f.preventDefault();
          const g = f.target;
          g.hasPointerCapture(f.pointerId) && g.releasePointerCapture(f.pointerId), f.button === 0 && f.ctrlKey === !1 && (d(f), f.preventDefault());
        }),
        onPointerup: m[2] || (m[2] = Fe((f) => {
          f.pointerType === "touch" && d(f);
        }, ["prevent"])),
        onKeydown: m[3] || (m[3] = (f) => {
          const g = p(a) !== "";
          !(f.ctrlKey || f.altKey || f.metaKey) && f.key.length === 1 && g && f.key === " " || (p(l)(f.key, p(r)()), p(Au).includes(f.key) && (c(), f.preventDefault()));
        })
      }, {
        default: O(() => [V(h.$slots, "default")]),
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
}), uc = lc, cc = /* @__PURE__ */ F({
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
    const e = n, { forwardRef: t, currentElement: i } = ie(), s = Ve();
    oe(() => {
      s.valueElement = i;
    });
    const o = P(() => {
      let a = [];
      const l = Array.from(s.optionsSet.value), u = (c) => l.find((d) => Ct(c, d.value, s.by));
      return Array.isArray(s.modelValue.value) ? a = s.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(s.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), r = P(() => o.value.length ? o.value.join(", ") : e.placeholder);
    return (a, l) => (E(), M(p(te), {
      ref: p(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: O(() => [V(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: p(s).modelValue.value
      }, () => [de(Y(r.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), dc = cc, fc = /* @__PURE__ */ F({
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
    const e = n, { nonce: t } = ct(e), i = Pu(t), s = en(), o = s.position === "item-aligned" ? Wu() : void 0, { forwardRef: r, currentElement: a } = ie();
    oe(() => {
      s?.onViewportChange(a.value);
    });
    const l = A(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: h, contentWrapper: m } = o ?? {};
      if (h?.value && m?.value) {
        const f = Math.abs(l.value - d.scrollTop);
        if (f > 0) {
          const g = window.innerHeight - we * 2, v = Number.parseFloat(m.value.style.minHeight), _ = Number.parseFloat(m.value.style.height), w = Math.max(v, _);
          if (w < g) {
            const S = w + f, y = Math.min(g, S), x = S - y;
            m.value.style.height = `${y}px`, m.value.style.bottom === "0px" && (d.scrollTop = x > 0 ? x : 0, m.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (E(), W(ve, null, [q(p(te), Q({
      ref: p(r),
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
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 16), q(p(te), {
      as: "style",
      nonce: p(i)
    }, {
      default: O(() => d[0] || (d[0] = [de(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), pc = fc;
const hc = { class: "sidebar-select" }, mc = /* @__PURE__ */ F({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e;
    return (i, s) => (E(), W("div", hc, [
      q(p(Ru), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
      }, {
        default: O(() => [
          q(p(uc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: O(() => [
              q(p(dc), { class: "sidebar-select-trigger-label" }),
              q(p(Zu), null, {
                default: O(() => [
                  q(p(To), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          q(p(ac), { disabled: "" }, {
            default: O(() => [
              q(p(Gu), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: O(() => [
                  q(p(pc), null, {
                    default: O(() => [
                      (E(!0), W(ve, null, Ye(n.items, (o) => (E(), M(p(tc), {
                        key: o.value,
                        value: o.value,
                        class: "sidebar-select-item"
                      }, {
                        default: O(() => [
                          q(p(ic), { class: "sidebar-select-item-indicator" }, {
                            default: O(() => [
                              q(p(Hi), { size: 14 })
                            ]),
                            _: 1
                          }),
                          q(p(oc), null, {
                            default: O(() => [
                              de(Y(o.label), 1)
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
}), vc = { class: "sidebar-select" }, gc = ["aria-label"], yc = { class: "sidebar-select-trigger-label" }, bc = 7, wc = /* @__PURE__ */ F({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: s } = xe(), o = A(!1), r = P(
      () => t.items.find((l) => l.value === t.selectedValue)?.label ?? ""
    );
    function a(l) {
      i("update:selectedValue", l), o.value = !1;
    }
    return (l, u) => (E(), W("div", vc, [
      H("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: u[0] || (u[0] = (c) => o.value = !0)
      }, [
        H("span", yc, Y(r.value), 1)
      ], 8, gc),
      q(p(ss), {
        open: o.value,
        "onUpdate:open": u[2] || (u[2] = (c) => o.value = c)
      }, {
        default: O(() => [
          q(p(ps), { disabled: "" }, {
            default: O(() => [
              q(p(ds), { class: "editor-overlay" }),
              q(p(cs), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: O(() => [
                  q(p(hs), { class: "sr-only" }, {
                    default: O(() => [
                      de(Y(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  u[3] || (u[3] = H("div", { class: "sheet-handle" }, null, -1)),
                  q(p(vu), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": u[1] || (u[1] = (c) => a(c))
                  }, {
                    default: O(() => [
                      n.items.length > bc ? (E(), M(p(wu), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: p(s)("select.filter")
                      }, null, 8, ["placeholder"])) : K("", !0),
                      q(p(yu), { class: "sheet-list" }, {
                        default: O(() => [
                          (E(!0), W(ve, null, Ye(n.items, (c) => (E(), M(p(Eu), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: O(() => [
                              q(p(Tu), { class: "sheet-item-indicator" }, {
                                default: O(() => [
                                  q(p(Hi), { size: 16 })
                                ]),
                                _: 1
                              }),
                              H("span", null, Y(c.label), 1)
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
    const t = e, { isMobile: i } = Xi();
    return (s, o) => p(i) ? (E(), M(wc, Q({ key: 0 }, s.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (r) => t("update:selectedValue", r))
    }), null, 16)) : (E(), M(mc, Q({ key: 1 }, s.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (r) => t("update:selectedValue", r))
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
    const t = n, i = e, { t: s } = xe(), o = P(
      () => t.channels.map((r) => ({ value: r.id, label: r.name }))
    );
    return (r, a) => (E(), M(jn, {
      items: o.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: p(s)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Sc = { class: "speaker-sidebar" }, Cc = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, xc = { class: "sidebar-title" }, _c = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Ec = { class: "sidebar-title" }, kc = {
  key: 2,
  class: "sidebar-section"
}, Tc = { class: "sidebar-title" }, Pc = { class: "subtitle-toggle" }, Ac = { class: "subtitle-toggle-label" }, Oc = { class: "subtitle-slider" }, Ic = { class: "subtitle-slider-label" }, Lc = { class: "subtitle-slider-value" }, Dc = ["value", "disabled"], Rc = {
  key: 3,
  class: "sidebar-section"
}, Mc = { class: "sidebar-title" }, $c = { class: "speaker-list" }, Bc = { class: "speaker-name" }, qc = /* @__PURE__ */ F({
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
    const e = n, t = Je(), { t: i, locale: s } = xe(), o = P(
      () => zi(e.translations, s.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (r, a) => (E(), W("aside", Sc, [
      n.channels.length > 1 ? (E(), W("section", Cc, [
        H("h2", xc, Y(p(i)("sidebar.channel")), 1),
        q(Os, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => r.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (E(), W("section", _c, [
        H("h2", Ec, Y(p(i)("sidebar.translation")), 1),
        q(jn, {
          items: o.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => r.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      p(t).subtitle ? (E(), W("section", kc, [
        H("h2", Tc, Y(p(i)("sidebar.subtitle")), 1),
        H("div", Pc, [
          H("span", Ac, Y(p(i)("subtitle.show")), 1),
          q(Ir, {
            modelValue: p(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => p(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        H("label", Oc, [
          H("span", Ic, [
            de(Y(p(i)("subtitle.fontSize")) + " ", 1),
            H("span", Lc, Y(p(t).subtitle.fontSize.value) + "px", 1)
          ]),
          H("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: p(t).subtitle.fontSize.value,
            disabled: !p(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => p(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Dc)
        ])
      ])) : K("", !0),
      n.speakers.length ? (E(), W("section", Rc, [
        H("h2", Mc, Y(p(i)("sidebar.speakers")), 1),
        H("ul", $c, [
          (E(!0), W(ve, null, Ye(n.speakers, (l) => (E(), W("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            q(Ki, {
              color: l.color
            }, null, 8, ["color"]),
            H("span", Bc, Y(l.name), 1)
          ]))), 128))
        ])
      ])) : K("", !0)
    ]));
  }
}), _i = /* @__PURE__ */ re(qc, [["__scopeId", "data-v-0a4624c1"]]), Fc = /* @__PURE__ */ F({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = eo(n, "open"), { t } = xe();
    return (i, s) => (E(), M(p(ss), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (o) => e.value = o)
    }, {
      default: O(() => [
        q(p(ps), { disabled: "" }, {
          default: O(() => [
            q(p(ds), { class: "editor-overlay" }),
            q(p(cs), { class: "sidebar-drawer" }, {
              default: O(() => [
                q(p(hs), { class: "sr-only" }, {
                  default: O(() => [
                    de(Y(p(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(p(ga), {
                  class: "sidebar-close",
                  "aria-label": p(t)("header.closeSidebar")
                }, {
                  default: O(() => [
                    q(p(Vi), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                V(i.$slots, "default")
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
}), zc = { class: "player-controls" }, Nc = { class: "controls-left" }, Wc = { class: "controls-time" }, Hc = { class: "time-display" }, Vc = { class: "time-display" }, jc = { class: "controls-right" }, Uc = ["value", "aria-label", "disabled"], Kc = /* @__PURE__ */ F({
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
    const t = e, { t: i } = xe(), s = A(!1);
    function o(r) {
      const a = r.target;
      t("update:volume", parseFloat(a.value));
    }
    return (r, a) => (E(), W("div", zc, [
      H("div", Nc, [
        q(Ee, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": p(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: O(() => [
            q(p(Io), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(Ee, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? p(i)("player.pause") : p(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: O(() => [
            n.isPlaying ? (E(), M(p(Po), {
              key: 0,
              size: 20
            })) : (E(), M(p(Ao), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(Ee, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": p(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: O(() => [
            q(p(Lo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      H("div", Wc, [
        H("time", Hc, Y(n.currentTime), 1),
        a[7] || (a[7] = H("span", { class: "time-separator" }, "/", -1)),
        H("time", Vc, Y(n.duration), 1)
      ]),
      H("div", jc, [
        H("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          q(Ee, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? p(i)("player.unmute") : p(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: O(() => [
              n.isMuted ? (E(), M(p(Mo), {
                key: 0,
                size: 16
              })) : (E(), M(p(Ro), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          to(H("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": p(i)("player.volume"),
            disabled: !n.isReady,
            onInput: o
          }, null, 40, Uc), [
            [no, s.value]
          ])
        ], 32),
        q(Ee, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": p(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: O(() => [
            de(Y(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Xc = /* @__PURE__ */ re(Kc, [["__scopeId", "data-v-02ebaa64"]]);
function ae(n, e, t, i) {
  return new (t || (t = Promise))((function(s, o) {
    function r(u) {
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
      u.done ? s(u.value) : (c = u.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(r, a);
    }
    l((i = i.apply(n, e || [])).next());
  }));
}
let kt = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...o) => {
        this.un(e, s), t(...o);
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
const It = { decode: function(n, e) {
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
    if (s.some(((o) => o > 1 || o < -1))) {
      const o = s.length;
      let r = 0;
      for (let a = 0; a < o; a++) {
        const l = Math.abs(s[a]);
        l > r && (r = l);
      }
      for (const a of i) for (let l = 0; l < o; l++) a[l] /= r;
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
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [o, r] of Object.entries(s)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Is(o, r));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function Ei(n, e, t) {
  const i = Is(n, e || {});
  return t?.appendChild(i), i;
}
var Yc = Object.freeze({ __proto__: null, createElement: Ei, default: Ei });
const Gc = { fetchBlob: function(n, e, t) {
  return ae(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(s, o) {
      ae(this, void 0, void 0, (function* () {
        if (!s.body || !s.headers) return;
        const r = s.body.getReader(), a = Number(s.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          o(d);
        };
        try {
          for (; ; ) {
            const c = yield r.read();
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
function ne(n) {
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
function Ke(n, e) {
  const t = ne(n());
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
  }, s = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((o) => o()));
  };
}
class Jc extends kt {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = ne(!1), this._currentTime = ne(0), this._duration = ne(0), this._volume = ne(this.media.volume), this._muted = ne(this.media.muted), this._playbackRate = ne(this.media.playbackRate || 1), this._seeking = ne(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
function Zc({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: s = 0, barAlign: o }) {
  let r = Math.round(n * t * i), a = r + Math.round(e * t * i) || 1;
  return a < s && (a = s, o || (r = a / 2)), { topHeight: r, totalHeight: a };
}
function Qc({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: s }) {
  return n === "top" ? 0 : n === "bottom" ? s - i : e - t;
}
function ki(n, e, t) {
  const i = e - n.left, s = t - n.top;
  return [i / n.width, s / n.height];
}
function Ls(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Ti(n, e) {
  if (!Ls(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Pi({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, s = Math.floor(i * t);
  return [s - 1, s, s + 1];
}
function Ds(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function ed(n) {
  const e = ne({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ke((() => (function(o) {
    const { scrollLeft: r, scrollWidth: a, clientWidth: l } = o;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = r / a, c = (r + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Ke((() => (function(o) {
    return { left: o.scrollLeft, right: o.scrollLeft + o.clientWidth };
  })(e.value)), [e]), s = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", s, { passive: !0 }), { scrollData: e, percentages: t, bounds: i, cleanup: () => {
    n.removeEventListener("scroll", s), Ds(e);
  } };
}
class td extends kt {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [s, o] = this.initHtml();
    i.appendChild(s), this.container = s, this.scrollContainer = o.querySelector(".scroll"), this.wrapper = o.querySelector(".wrapper"), this.canvasWrapper = o.querySelector(".canvases"), this.progressWrapper = o.querySelector(".progress"), this.cursor = o.querySelector(".cursor"), t && o.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [s, o] = ki(i, t.clientX, t.clientY);
      this.emit("click", s, o);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [s, o] = ki(i, t.clientX, t.clientY);
      this.emit("dblclick", s, o);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = ed(this.scrollContainer);
    const e = qe((() => {
      const { startX: t, endX: i } = this.scrollStream.percentages.value, { left: s, right: o } = this.scrollStream.bounds.value;
      this.emit("scroll", t, i, s, o);
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
      const { threshold: s = 3, mouseButton: o = 0, touchDelay: r = 100 } = i, a = ne(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== o || (l.set(h.pointerId, h), l.size > 1)) return;
        let m = h.clientX, f = h.clientY, g = !1;
        const v = Date.now(), _ = t.getBoundingClientRect(), { left: w, top: S } = _, y = (T) => {
          if (T.defaultPrevented || l.size > 1 || u && Date.now() - v < r) return;
          const k = T.clientX, D = T.clientY, R = k - m, z = D - f;
          (g || Math.abs(R) > s || Math.abs(z) > s) && (T.preventDefault(), T.stopPropagation(), g || (a.set({ type: "start", x: m - w, y: f - S }), g = !0), a.set({ type: "move", x: k - w, y: D - S, deltaX: R, deltaY: z }), m = k, f = D);
        }, x = (T) => {
          if (l.delete(T.pointerId), g) {
            const k = T.clientX, D = T.clientY;
            a.set({ type: "end", x: k - w, y: D - S });
          }
          c();
        }, C = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || x(T);
        }, b = (T) => {
          g && (T.stopPropagation(), T.preventDefault());
        }, I = (T) => {
          T.defaultPrevented || l.size > 1 || g && T.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", x), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", I, { passive: !1 }), document.addEventListener("click", b, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", I), setTimeout((() => {
            document.removeEventListener("click", b, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), Ds(a);
      } };
    })(this.wrapper);
    const e = qe((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const i = this.wrapper.getBoundingClientRect().width, s = (o = t.x / i) < 0 ? 0 : o > 1 ? 1 : o;
      var o;
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
    return this.timeouts.push(s), () => new Promise(((o, r) => {
      s(), i = r, t = setTimeout((() => {
        t = void 0, i = void 0, o();
      }), e);
    }));
  }
  getHeight(e, t) {
    var i;
    const s = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: o, optionsSplitChannels: r, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (o == null) return u;
      const c = Number(o);
      if (!isNaN(c)) return c;
      if (o === "auto") {
        const d = a || u;
        return r?.every(((h) => !h.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: s, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(i, s, o) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const r = document.createElement("canvas"), a = r.getContext("2d"), l = o ?? r.height * s, u = a.createLinearGradient(0, 0, 0, l || s), c = 1 / (i.length - 1);
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
    const { width: o, height: r } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: f, height: g, length: v, options: _, pixelRatio: w }) {
      const S = g / 2, y = _.barWidth ? _.barWidth * w : 1, x = _.barGap ? _.barGap * w : _.barWidth ? y / 2 : 0, C = y + x || 1;
      return { halfHeight: S, barWidth: y, barGap: x, barRadius: _.barRadius || 0, barMinHeight: _.barMinHeight ? _.barMinHeight * w : 0, barIndexScale: v > 0 ? f / C / v : 0, barSpacing: C };
    })({ width: o, height: r, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), m = (function({ channelData: f, barIndexScale: g, barSpacing: v, barWidth: _, halfHeight: w, vScale: S, canvasHeight: y, barAlign: x, barMinHeight: C }) {
      const b = f[0] || [], I = f[1] || b, T = b.length, k = [];
      let D = 0, R = 0, z = 0;
      for (let L = 0; L <= T; L++) {
        const $ = Math.round(L * g);
        if ($ > D) {
          const { topHeight: G, totalHeight: ee } = Zc({ maxTop: R, maxBottom: z, halfHeight: w, vScale: S, barMinHeight: C, barAlign: x }), ue = Qc({ barAlign: x, halfHeight: w, topHeight: G, totalHeight: ee, canvasHeight: y });
          k.push({ x: D * v, y: ue, width: _, height: ee }), D = $, R = 0, z = 0;
        }
        const X = Math.abs(b[L] || 0), j = Math.abs(I[L] || 0);
        X > R && (R = X), j > z && (z = j);
      }
      return k;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: r, barAlign: t.barAlign, barMinHeight: h });
    i.beginPath();
    for (const f of m) u && "roundRect" in i ? i.roundRect(f.x, f.y, f.width, f.height, u) : i.rect(f.x, f.y, f.width, f.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, s) {
    const { width: o, height: r } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, m = l[0] || [];
      return [m, l[1] || m].map(((f, g) => {
        const v = f.length, _ = v ? u / v : 0, w = h, S = g === 0 ? -1 : 1, y = [{ x: 0, y: w }];
        let x = 0, C = 0;
        for (let b = 0; b <= v; b++) {
          const I = Math.round(b * _);
          if (I > x) {
            const k = w + (Math.round(C * h * d) || 1) * S;
            y.push({ x, y: k }), x = I, C = 0;
          }
          const T = Math.abs(f[b] || 0);
          T > C && (C = T);
        }
        return y.push({ x, y: w }), y;
      }));
    })({ channelData: e, width: o, height: r, vScale: s });
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
    const s = (function({ channelData: o, barHeight: r, normalize: a, maxPeak: l }) {
      var u;
      const c = r || 1;
      if (!a) return c;
      const d = o[0];
      if (!d || d.length === 0) return c;
      let h = l ?? 0;
      if (!l) for (let m = 0; m < d.length; m++) {
        const f = (u = d[m]) !== null && u !== void 0 ? u : 0, g = Math.abs(f);
        g > h && (h = g);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Ls(t) ? this.renderBarWaveform(e, t, i, s) : this.renderLineWaveform(e, t, i, s);
  }
  renderSingleCanvas(e, t, i, s, o, r, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(s * l), u.style.width = `${i}px`, u.style.height = `${s}px`, u.style.left = `${Math.round(o)}px`, r.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), h = d.getContext("2d");
      h.drawImage(u, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(t.progressColor, h), h.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, s, o, r) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: f, totalWidth: g, options: v }) {
      return Ti(Math.min(8e3, f, g), v);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const h = (f) => {
      if (f < 0 || f >= m || d[f]) return;
      d[f] = !0;
      const g = f * c;
      let v = Math.min(u - g, c);
      if (v = Ti(v, t), v <= 0) return;
      const _ = (function({ channelData: w, offset: S, clampedWidth: y, totalWidth: x }) {
        return w.map(((C) => {
          const b = Math.floor(S / x * C.length), I = Math.floor((S + y) / x * C.length);
          return C.slice(b, I);
        }));
      })({ channelData: e, offset: g, clampedWidth: v, totalWidth: u });
      this.renderSingleCanvas(_, t, v, s, g, o, r);
    }, m = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let f = 0; f < m; f++) h(f);
      return;
    }
    if (Pi({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: m }).forEach(((f) => h(f))), m > 1) {
      const f = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", r.innerHTML = "", d = {}), Pi({ scrollLeft: g, totalWidth: u, numCanvases: m }).forEach(((v) => h(v)));
      }));
      this.unsubscribeOnScroll.push(f);
    }
  }
  renderChannel(e, t, i, s) {
    var { overlay: o } = t, r = (function(c, d) {
      var h = {};
      for (var m in c) Object.prototype.hasOwnProperty.call(c, m) && d.indexOf(m) < 0 && (h[m] = c[m]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var f = 0;
        for (m = Object.getOwnPropertySymbols(c); f < m.length; f++) d.indexOf(m[f]) < 0 && Object.prototype.propertyIsEnumerable.call(c, m[f]) && (h[m[f]] = c[m[f]]);
      }
      return h;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(r.height, r.splitChannels);
    a.style.height = `${l}px`, o && s > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, r, i, l, a, u);
  }
  render(e) {
    return ae(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: r, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: m }) {
        const f = Math.ceil(u * c), g = f > d, v = !!(h && !g);
        return { scrollWidth: f, isScrollable: g, useParentWidth: v, width: (v ? d : f) * m };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: s, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = r, this.wrapper.style.width = a ? "100%" : `${o}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
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
      const { right: i } = this.progressWrapper.getBoundingClientRect(), s = (function(o) {
        const r = 2 * o;
        return (r < 0 ? Math.floor(r) : Math.ceil(r)) / 2;
      })(i - t);
      this.scrollContainer.scrollLeft += s;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: i, scrollWidth: s, clientWidth: o } = this.scrollContainer, r = e * s, a = i, l = i + o, u = o / 2;
    if (this.isDragging)
      r + 30 > l ? this.scrollContainer.scrollLeft += 30 : r - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (r < a || r > l) && (this.scrollContainer.scrollLeft = r - (this.options.autoCenter ? u : 0));
      const c = r - i - u;
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
        const o = Array.from(s).map(((r) => r.toDataURL(e, t)));
        return Promise.resolve(o);
      }
      return Promise.all(Array.from(s).map(((o) => new Promise(((r, a) => {
        o.toBlob(((l) => {
          l ? r(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class nd extends kt {
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
class mn extends kt {
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
const id = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class xt extends Jc {
  static create(e) {
    return new xt(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new mn() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, id, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, h, m;
      const f = (l = a?.currentTime) !== null && l !== void 0 ? l : ne(0), g = (u = a?.duration) !== null && u !== void 0 ? u : ne(0), v = (c = a?.isPlaying) !== null && c !== void 0 ? c : ne(!1), _ = (d = a?.isSeeking) !== null && d !== void 0 ? d : ne(!1), w = (h = a?.volume) !== null && h !== void 0 ? h : ne(1), S = (m = a?.playbackRate) !== null && m !== void 0 ? m : ne(1), y = ne(null), x = ne(null), C = ne(""), b = ne(0), I = ne(0), T = Ke((() => !v.value), [v]), k = Ke((() => y.value !== null), [y]), D = Ke((() => k.value && g.value > 0), [k, g]), R = Ke((() => f.value), [f]), z = Ke((() => g.value > 0 ? f.value / g.value : 0), [f, g]);
      return { state: { currentTime: f, duration: g, isPlaying: v, isPaused: T, isSeeking: _, volume: w, playbackRate: S, audioBuffer: y, peaks: x, url: C, zoom: b, scrollPosition: I, canPlay: k, isReady: D, progress: R, progressPercent: z }, actions: { setCurrentTime: (L) => {
        const $ = Math.max(0, Math.min(g.value || 1 / 0, L));
        f.set($);
      }, setDuration: (L) => {
        g.set(Math.max(0, L));
      }, setPlaying: (L) => {
        v.set(L);
      }, setSeeking: (L) => {
        _.set(L);
      }, setVolume: (L) => {
        const $ = Math.max(0, Math.min(1, L));
        w.set($);
      }, setPlaybackRate: (L) => {
        const $ = Math.max(0.1, Math.min(16, L));
        S.set($);
      }, setAudioBuffer: (L) => {
        y.set(L), L && g.set(L.duration);
      }, setPeaks: (L) => {
        x.set(L);
      }, setUrl: (L) => {
        C.set(L);
      }, setZoom: (L) => {
        b.set(Math.max(0, L));
      }, setScrollPosition: (L) => {
        I.set(Math.max(0, L));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new nd();
    const o = t ? void 0 : this.getMediaElement();
    this.renderer = new td(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const r = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (r || a && l) && this.load(r, a, l).catch(((u) => {
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
        const r = e.isPlaying.value;
        t.emit(r ? "play" : "pause");
      }), [e.isPlaying])), i.push(qe((() => {
        const r = e.currentTime.value;
        t.emit("timeupdate", r), e.isPlaying.value && t.emit("audioprocess", r);
      }), [e.currentTime, e.isPlaying])), i.push(qe((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let s = !1;
      i.push(qe((() => {
        e.isReady.value && !s && (s = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let o = !1;
      return i.push(qe((() => {
        const r = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        o && !r && u && t.emit("finish"), o = r && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(qe((() => {
        const r = e.zoom.value;
        r > 0 && t.emit("zoom", r);
      }), [e.zoom])), () => {
        i.forEach(((r) => r()));
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
      const o = this.getDuration();
      this.emit("scroll", e * o, t * o, i, s);
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
        let o = 0;
        const r = this.options.dragToSeek;
        this.isPlaying() ? o = 0 : r === !0 ? o = 200 : r && typeof r == "object" && (o = (s = r.debounceTime) !== null && s !== void 0 ? s : 200), e = setTimeout((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = It.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = It.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
      var o;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (o = this.abortController) === null || o === void 0 || o.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield Gc.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (t = new Blob([t], { type: u }));
      }
      this.setSrc(e, t);
      const r = yield new Promise(((a) => {
        const l = s || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof mn && (a.duration = r);
      }
      if (i) this.decodedData = It.createBuffer(i, r || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield It.decode(a, this.options.sampleRate);
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
    const s = Math.min(e, this.decodedData.numberOfChannels), o = [];
    for (let r = 0; r < s; r++) {
      const a = this.decodedData.getChannelData(r), l = [], u = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let h = 0;
        for (let m = 0; m < d.length; m++) {
          const f = d[m];
          Math.abs(f) > Math.abs(h) && (h = f);
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
    return ae(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const s = yield i.play.call(this);
      return t != null && (this.media instanceof mn ? this.media.stopAt(t) : this.stopAtPosition = t), s;
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
xt.BasePlugin = class extends kt {
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
}, xt.dom = Yc;
class Rs {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const s = (...o) => {
        this.un(e, s), t(...o);
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
class sd extends Rs {
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
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [o, r] of Object.entries(s)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Ms(o, r));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function ht(n, e, t) {
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
function Rt(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, s = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((o) => o()));
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
function Ue(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Mt(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, o = $s(null), r = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (r.set(c.pointerId, c), r.size > 1)) return;
    let d = c.clientX, h = c.clientY, m = !1;
    const f = Date.now(), g = n.getBoundingClientRect(), { left: v, top: _ } = g, w = (b) => {
      if (b.defaultPrevented || r.size > 1 || a && Date.now() - f < s) return;
      const I = b.clientX, T = b.clientY, k = I - d, D = T - h;
      (m || Math.abs(k) > t || Math.abs(D) > t) && (b.preventDefault(), b.stopPropagation(), m || (o.set({ type: "start", x: d - v, y: h - _ }), m = !0), o.set({ type: "move", x: I - v, y: T - _, deltaX: k, deltaY: D }), d = I, h = T);
    }, S = (b) => {
      if (r.delete(b.pointerId), m) {
        const I = b.clientX, T = b.clientY;
        o.set({ type: "end", x: I - v, y: T - _ });
      }
      l();
    }, y = (b) => {
      r.delete(b.pointerId), b.relatedTarget && b.relatedTarget !== document.documentElement || S(b);
    }, x = (b) => {
      m && (b.stopPropagation(), b.preventDefault());
    }, C = (b) => {
      b.defaultPrevented || r.size > 1 || m && b.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", S), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", x, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: o, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), r.clear(), Ue(o);
  } };
}
class Ai extends Rs {
  constructor(e, t, i = 0) {
    var s, o, r, a, l, u, c, d, h, m;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (r = e.resize) === null || r === void 0 || r, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (m = e.contentEditable) !== null && m !== void 0 ? m : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ht("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = ht("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = Mt(i, { threshold: 1 }), r = Mt(s, { threshold: 1 }), a = Rt((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [o.signal]), l = Rt((() => {
      const u = r.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [r.signal]);
    this.subscriptions.push((() => {
      a(), l(), o.cleanup(), r.cleanup();
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
    const s = ht("div", { style: { position: "absolute", top: `${t}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = it(e, "click"), i = it(e, "mouseenter"), s = it(e, "mouseleave"), o = it(e, "dblclick"), r = it(e, "pointerdown"), a = it(e, "pointerup"), l = t.subscribe(((v) => v && this.emit("click", v))), u = i.subscribe(((v) => v && this.emit("over", v))), c = s.subscribe(((v) => v && this.emit("leave", v))), d = o.subscribe(((v) => v && this.emit("dblclick", v))), h = r.subscribe(((v) => v && this.toggleCursor(!0))), m = a.subscribe(((v) => v && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), m(), Ue(t), Ue(i), Ue(s), Ue(o), Ue(r), Ue(a);
    }));
    const f = Mt(e), g = Rt((() => {
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
    const { width: o } = this.element.parentElement.getBoundingClientRect(), r = e / o * this.totalDuration;
    let a = t && t !== "start" ? this.start : this.start + r, l = t && t !== "end" ? this.end : this.end + r;
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
        this.content = ht("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Un extends sd {
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
    return ht("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, i = t.getBoundingClientRect(), s = this.regions.map(((o) => {
        if (o === e || !o.content) return 0;
        const r = o.content.getBoundingClientRect();
        return i.left < r.left + r.width && r.left < i.left + i.width ? r.height : 0;
      })).reduce(((o, r) => o + r), 0);
      t.style.marginTop = `${s}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, i;
    if (!e.element) return;
    const s = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!s) return;
    const { clientWidth: o, scrollWidth: r } = s;
    if (r <= o) return;
    const a = s.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? s.scrollLeft += u : c > o && (s.scrollLeft += c - o);
  }
  virtualAppend(e, t, i) {
    const s = () => {
      if (!this.wavesurfer) return;
      const o = this.wavesurfer.getWidth(), r = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > r && u < r + o;
      c && !i.parentElement ? t.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      s();
      const o = this.wavesurfer.on("scroll", s), r = this.wavesurfer.on("zoom", s), a = this.wavesurfer.on("resize", s);
      this.subscriptions.push(o, r, a), e.once("remove", (() => {
        o(), r(), a();
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
    const s = this.wavesurfer.getDuration(), o = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, r = new Ai(e, s, o);
    return this.emit("region-initialized", r), s ? this.saveRegion(r) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      r._setTotalDuration(a), this.saveRegion(r);
    }))), r;
  }
  enableDragSelection(e, t = 3) {
    var i;
    const s = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(s && s instanceof HTMLElement)) return () => {
    };
    let o = null, r = 0, a = 0;
    const l = Mt(s, { threshold: t }), u = Rt((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (r = h.x, !this.wavesurfer) return;
        const m = this.wavesurfer.getDuration(), f = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = r / g * m;
        const v = h.x / g * m, _ = (h.x + 5) / g * m;
        o = new Ai(Object.assign(Object.assign({}, e), { start: v, end: _ }), m, f), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
      } else h.type === "move" && h.deltaX !== void 0 ? o && o._onUpdate(h.deltaX, h.x > r ? "end" : "start", a) : h.type === "end" && o && (this.saveRegion(o), o.updatingSide = void 0, o = null);
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
const vn = [0.5, 0.75, 1, 1.25, 1.5, 2];
function od(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: s } = n, o = rt(null), r = rt(null), a = A(0), l = A(0), u = A(!1), c = A(!1), d = A(!1), h = A(1), m = A(1), f = A(!1), g = P(() => qt(a.value)), v = P(() => qt(l.value));
  function _(L, $) {
    R(), d.value = !0, c.value = !1;
    const X = Un.create();
    r.value = X;
    const j = xt.create({
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
      renderFunction: bo,
      url: $,
      plugins: [X]
    });
    j.on("ready", () => {
      c.value = !0, d.value = !1, l.value = j.getDuration(), w();
    }), j.on("timeupdate", (G) => {
      a.value = G;
    }), j.on("play", () => {
      u.value = !0;
    }), j.on("pause", () => {
      u.value = !1;
    }), j.on("finish", () => {
      u.value = !1;
    }), o.value = j;
  }
  function w() {
    const L = r.value;
    if (L) {
      L.clearRegions();
      for (const $ of i.value) {
        const X = $.speakerId ? s.value.get($.speakerId) : void 0;
        if (!X || $.startTime == null || $.endTime == null) continue;
        const j = X.color;
        L.addRegion({
          start: $.startTime,
          end: $.endTime,
          color: vo(j, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", j);
      }
    }
  }
  function S() {
    o.value?.play();
  }
  function y() {
    o.value?.pause();
  }
  function x() {
    o.value?.playPause();
  }
  function C(L) {
    const $ = o.value;
    !$ || l.value === 0 || $.setTime(L);
  }
  function b(L) {
    C(Math.max(0, Math.min(a.value + L, l.value)));
  }
  function I(L) {
    const $ = o.value;
    $ && (h.value = L, $.setVolume(L), L > 0 && f.value && (f.value = !1, $.setMuted(!1)));
  }
  function T() {
    const L = o.value;
    L && (f.value = !f.value, L.setMuted(f.value));
  }
  function k(L) {
    const $ = o.value;
    $ && (m.value = L, $.setPlaybackRate(L));
  }
  function D() {
    const $ = (vn.indexOf(
      m.value
    ) + 1) % vn.length;
    k(vn[$] ?? 1);
  }
  function R() {
    z !== null && (clearTimeout(z), z = null), o.value && (o.value.destroy(), o.value = null, r.value = null);
  }
  Z(
    [e, t],
    ([L, $]) => {
      L && $ && _(L, $);
    },
    { immediate: !0 }
  );
  let z = null;
  return Z([i, s], () => {
    c.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, w();
    }, 150));
  }), _t(() => {
    R();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: m,
    isMuted: f,
    formattedCurrentTime: g,
    formattedDuration: v,
    play: S,
    pause: y,
    togglePlay: x,
    seekTo: C,
    skip: b,
    setVolume: I,
    setPlaybackRate: k,
    cyclePlaybackRate: D,
    toggleMute: T
  };
}
const rd = { class: "audio-player" }, ad = /* @__PURE__ */ F({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, s = t, o = A(null), {
      isPlaying: r,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: m,
      formattedDuration: f,
      togglePlay: g,
      seekTo: v,
      pause: _,
      skip: w,
      setVolume: S,
      cyclePlaybackRate: y,
      toggleMute: x
    } = od({
      containerRef: o,
      audioSrc: Lt(() => i.audioSrc),
      turns: Lt(() => i.turns),
      speakers: Lt(() => i.speakers)
    });
    return Z(h, (C) => s("timeupdate", C)), Z(r, (C) => s("playStateChange", C)), e({ seekTo: v, pause: _ }), (C, b) => (E(), W("footer", rd, [
      H("div", {
        ref_key: "waveformRef",
        ref: o,
        class: Bt(["waveform-container", { "waveform-container--loading": p(l) }])
      }, null, 2),
      q(Xc, {
        "is-playing": p(r),
        "current-time": p(m),
        duration: p(f),
        volume: p(u),
        "playback-rate": p(c),
        "is-muted": p(d),
        "is-ready": p(a),
        onTogglePlay: p(g),
        onSkipBack: b[0] || (b[0] = (I) => p(w)(-10)),
        onSkipForward: b[1] || (b[1] = (I) => p(w)(10)),
        "onUpdate:volume": p(S),
        onToggleMute: p(x),
        onCyclePlaybackRate: p(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), ld = /* @__PURE__ */ re(ad, [["__scopeId", "data-v-9248e45e"]]);
class ud {
  diff(e, t, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const o = this.castInput(e, i), r = this.castInput(t, i), a = this.removeEmpty(this.tokenize(o, i)), l = this.removeEmpty(this.tokenize(r, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, t, i, s) {
    var o;
    const r = (w) => {
      if (w = this.postProcess(w, i), s) {
        setTimeout(function() {
          s(w);
        }, 0);
        return;
      } else
        return w;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (o = i.timeout) !== null && o !== void 0 ? o : 1 / 0, h = Date.now() + d, m = [{ oldPos: -1, lastComponent: void 0 }];
    let f = this.extractCommon(m[0], t, e, 0, i);
    if (m[0].oldPos + 1 >= l && f + 1 >= a)
      return r(this.buildValues(m[0].lastComponent, t, e));
    let g = -1 / 0, v = 1 / 0;
    const _ = () => {
      for (let w = Math.max(g, -u); w <= Math.min(v, u); w += 2) {
        let S;
        const y = m[w - 1], x = m[w + 1];
        y && (m[w - 1] = void 0);
        let C = !1;
        if (x) {
          const I = x.oldPos - w;
          C = x && 0 <= I && I < a;
        }
        const b = y && y.oldPos + 1 < l;
        if (!C && !b) {
          m[w] = void 0;
          continue;
        }
        if (!b || C && y.oldPos < x.oldPos ? S = this.addToPath(x, !0, !1, 0, i) : S = this.addToPath(y, !1, !0, 1, i), f = this.extractCommon(S, t, e, w, i), S.oldPos + 1 >= l && f + 1 >= a)
          return r(this.buildValues(S.lastComponent, t, e)) || !0;
        m[w] = S, S.oldPos + 1 >= l && (v = Math.min(v, w - 1)), f + 1 >= a && (g = Math.max(g, w + 1));
      }
      u++;
    };
    if (s)
      (function w() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return s(void 0);
          _() || w();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= h; ) {
        const w = _();
        if (w)
          return w;
      }
  }
  addToPath(e, t, i, s, o) {
    const r = e.lastComponent;
    return r && !o.oneChangePerToken && r.added === t && r.removed === i ? {
      oldPos: e.oldPos + s,
      lastComponent: { count: r.count + 1, added: t, removed: i, previousComponent: r.previousComponent }
    } : {
      oldPos: e.oldPos + s,
      lastComponent: { count: 1, added: t, removed: i, previousComponent: r }
    };
  }
  extractCommon(e, t, i, s, o) {
    const r = t.length, a = i.length;
    let l = e.oldPos, u = l - s, c = 0;
    for (; u + 1 < r && l + 1 < a && this.equals(i[l + 1], t[u + 1], o); )
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
    const s = [];
    let o;
    for (; e; )
      s.push(e), o = e.previousComponent, delete e.previousComponent, e = o;
    s.reverse();
    const r = s.length;
    let a = 0, l = 0, u = 0;
    for (; a < r; a++) {
      const c = s[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(l, l + c.count);
          d = d.map(function(h, m) {
            const f = i[u + m];
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
class cd extends ud {
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
const dd = new cd();
function fd(n, e, t) {
  return dd.diff(n, e, t);
}
function gn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), o = t.split(" "), r = fd(s, o, {
    comparator: hd
  }), a = pd(r), l = [...e];
  let u = [...e], c = 0;
  for (const m of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in m && m.replaced)
      u = $t(
        u,
        l[0],
        m.countAdded - m.countRemoved
      ), c += m.countRemoved;
    else if ("removed" in m && m.removed) {
      const f = m;
      c += f.count, u = $t(
        u,
        l[0],
        -f.count
      );
    } else if ("added" in m && m.added) {
      const f = m;
      u = $t(
        u,
        l[0],
        f.count
      );
    } else
      c += m.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = o.slice(d).join(" ");
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
function pd(n) {
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
function $t(n, e, t) {
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
    $t(
      Bs(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function hd(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(t.length, i.length);
  let o = 0;
  for (let a = 0; a < s; a++)
    t[a] === i[a] && o++;
  return o / t.length > 0.8;
}
class md {
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
    font: o = "Arial",
    paddingInline: r = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = i, this.color = s, this.font = o, this.paddingInline = r, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
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
class vd extends md {
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
    this.resetAll(), this.currentState = gn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = gn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = gn(
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
  oe(() => {
    n.canvasRef.value && (t = new vd(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), Z(
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
  function s() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const o = e.on("translation:sync", s), r = e.on("channel:sync", s);
  ut(() => {
    i(), o(), r(), t?.dispose(), t = null;
  });
}
const gd = ["height"], yd = /* @__PURE__ */ F({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Je(), t = vt("canvas"), i = P(() => e.subtitle?.fontSize.value ?? 40), s = P(() => 1.2 * i.value), o = P(() => 2.4 * i.value);
    return qs({
      canvasRef: t,
      fontSize: i.value,
      lineHeight: s.value
    }), (r, a) => (E(), W("div", {
      class: "subtitle-banner",
      style: lt({ height: o.value + "px" })
    }, [
      H("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: o.value
      }, null, 8, gd)
    ], 4));
  }
}), bd = /* @__PURE__ */ re(yd, [["__scopeId", "data-v-b80652cd"]]), wd = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Sd = ["aria-label"], Cd = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Oi = 48, xd = /* @__PURE__ */ F({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Je(), { t } = xe(), i = vt("container"), s = vt("canvas");
    qs({
      canvasRef: s,
      fontSize: Oi,
      lineHeight: 1.2 * Oi
    }), oe(async () => {
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
    oe(() => {
      document.addEventListener("fullscreenchange", o);
    });
    function r() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return ut(() => {
      document.removeEventListener("fullscreenchange", o);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (E(), W("div", wd, [
      H("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": p(t)("subtitle.exitFullscreen"),
        onClick: r
      }, [
        q(p(Vi), { size: 24 })
      ], 8, Sd),
      H("canvas", Cd, null, 512)
    ], 512));
  }
}), _d = /* @__PURE__ */ re(xd, [["__scopeId", "data-v-cfe63125"]]), Ed = { class: "editor-layout" }, kd = { class: "editor-body" }, Td = {
  key: 4,
  class: "mobile-selectors"
}, Pd = /* @__PURE__ */ F({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Je(), { t: i, locale: s } = xe(), { isMobile: o } = Xi(), r = A(!1), a = P(() => t.activeChannel.value.activeTranslation.value.turns.value), l = t.speakers.all, u = P(() => [...t.channels.values()]), c = P(() => [...t.activeChannel.value.translations.values()]), d = P(() => t.activeChannel.value.activeTranslation.value.id), h = P(() => Array.from(l.values())), m = vt("audioPlayer");
    function f(w) {
      t.audio && (t.audio.currentTime.value = w);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        m.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), r.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((w) => m.value?.seekTo(w));
    const g = P(
      () => zi(
        c.value,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function v(w) {
      t.setActiveChannel(w);
    }
    function _(w) {
      t.activeChannel.value.setActiveTranslation(w);
    }
    return (w, S) => (E(), W("div", Ed, [
      e.showHeader ? (E(), M(Yo, {
        key: 0,
        title: p(t).title.value,
        duration: p(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": p(o),
        onToggleSidebar: S[0] || (S[0] = (y) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      H("main", kd, [
        q(kr, {
          turns: a.value,
          speakers: p(l)
        }, null, 8, ["turns", "speakers"]),
        p(o) ? K("", !0) : (E(), M(_i, {
          key: 0,
          speakers: h.value,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": v,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        p(o) ? (E(), M(Fc, {
          key: 1,
          open: r.value,
          "onUpdate:open": S[1] || (S[1] = (y) => r.value = y)
        }, {
          default: O(() => [
            q(_i, {
              speakers: h.value,
              channels: u.value,
              "selected-channel-id": p(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": v,
              "onUpdate:selectedTranslationId": _
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : K("", !0)
      ]),
      p(t).audio?.src.value ? (E(), M(ld, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": p(t).audio.src.value,
        turns: a.value,
        speakers: p(l),
        onTimeupdate: f,
        onPlayStateChange: S[2] || (S[2] = (y) => {
          p(t).audio && (p(t).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      p(t).subtitle?.isVisible.value && !p(o) && !p(t).subtitle.isFullscreen.value ? (E(), M(bd, { key: 2 })) : K("", !0),
      p(t).subtitle?.isFullscreen.value ? (E(), M(_d, { key: 3 })) : K("", !0),
      p(o) ? (E(), W("div", Td, [
        u.value.length > 1 ? (E(), M(Os, {
          key: 0,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          "onUpdate:selectedChannelId": v
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (E(), M(jn, {
          key: 1,
          items: g.value,
          "selected-value": d.value,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": _
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), Bd = /* @__PURE__ */ re(Pd, [["__scopeId", "data-v-084c0e7c"]]);
function qd() {
  return {
    name: "audio",
    install(n) {
      const e = A(0), t = A(!1);
      let i = null;
      const s = P(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function o(l) {
        i?.(l);
      }
      function r(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: t,
        src: s,
        seekTo: o,
        setSeekHandler: r
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
function Li(n, e) {
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
function Fd() {
  return {
    name: "live",
    install(n) {
      const e = rt(null), t = A(!1);
      t.value = !0;
      function i() {
        e.value = null, Xn(e);
      }
      function s(S, y) {
        if (n.activeChannelId.value !== y) return;
        const x = n.activeChannel.value.activeTranslation.value;
        if (x.isSource) {
          if (S.text == null) return;
          e.value = S.text;
        } else if (S.translations) {
          const C = S.translations.find(
            (b) => b.translationId === x.id
          );
          e.value = C?.text ?? null;
        } else
          return;
        Xn(e);
      }
      let o = null;
      function r() {
        o === null && (o = setTimeout(() => {
          o = null, i();
        }, 150));
      }
      function a() {
        o !== null && (clearTimeout(o), o = null);
      }
      function l(S, y) {
        S.turns.value.some((C) => C.id === y.id) ? S.updateTurn(y.id, y) : S.addTurn(y);
      }
      function u(S, y) {
        S.speakerId && n.speakers.ensure(S.speakerId);
        const x = n.channels.get(y);
        if (!x) {
          h();
          return;
        }
        if (S.text != null && l(x.sourceTranslation, Ii(S)), S.translations)
          for (const C of S.translations) {
            const b = x.translations.get(C.translationId);
            b && l(b, Li(S, C));
          }
        h();
      }
      function c(S, y) {
        d([S], y);
      }
      function d(S, y) {
        const x = n.channels.get(y);
        if (!x) return;
        const C = /* @__PURE__ */ new Set();
        for (const T of S)
          T.speakerId && !C.has(T.speakerId) && (C.add(T.speakerId), n.speakers.ensure(T.speakerId));
        const b = [];
        for (const T of S)
          T.text != null && b.push(Ii(T));
        b.length > 0 && x.sourceTranslation.prependTurns(b);
        const I = /* @__PURE__ */ new Map();
        for (const T of S)
          if (T.translations)
            for (const k of T.translations) {
              let D = I.get(k.translationId);
              D || (D = [], I.set(k.translationId, D)), D.push(Li(T, k));
            }
        for (const [T, k] of I) {
          const D = x.translations.get(T);
          D && D.prependTurns(k);
        }
      }
      function h() {
        a(), i();
      }
      function m(S) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const f = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: s,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: m
      }, g = n.on("channel:change", h), v = n.on("translation:change", h), _ = n.on("translation:sync", r), w = n.on("channel:sync", r);
      return n.live = f, () => {
        h(), g(), v(), _(), w(), n.live = void 0;
      };
    }
  };
}
function zd(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = A(n.fontSize ?? 40), i = A(!0), s = A(!1), o = {
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
      return e.subtitle = o, () => {
        i.value = !1, s.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function Ad(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function Nd(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.speakers)
    e.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: ""
    });
  const t = n.text.map((s) => {
    const o = s.words.map(Ad), r = o[0]?.startTime ?? s.stime, a = o.length > 0 ? o[o.length - 1].endTime ?? s.etime : s.etime;
    return {
      id: s.turn_id,
      speakerId: s.speaker_id || null,
      text: o.length > 0 ? null : s.segment,
      words: o,
      ...r !== void 0 && { startTime: r },
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
function Od(n) {
  return {
    id: `w_${Fs++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function Wd(n) {
  Fs = 0;
  const e = /* @__PURE__ */ new Map();
  for (const o of n.segments)
    o.speaker && !e.has(o.speaker) && e.set(o.speaker, {
      id: o.speaker,
      name: o.speaker,
      color: ""
    });
  const t = n.language ?? "fr", i = n.segments.map((o, r) => {
    const a = o.words.map(Od);
    return {
      id: `turn_${r}`,
      speakerId: o.speaker ?? null,
      text: a.length > 0 ? null : o.text,
      words: a,
      startTime: o.start,
      endTime: o.end,
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
  Bd as EditorLayout,
  qd as createAudioPlugin,
  Ld as createEditorStore,
  Fd as createLivePlugin,
  zd as createSubtitlePlugin,
  Nd as mapApiDocument,
  Wd as mapWhisperXDocument,
  Dd as provideEditorStore,
  Rd as provideI18n,
  Je as useEditorStore,
  yo as validateEditorDocument
};
