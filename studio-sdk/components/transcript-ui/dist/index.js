import * as Yo from "vue";
import { shallowReactive as io, ref as P, computed as D, inject as wi, provide as Ln, h as ze, defineComponent as $, openBlock as O, createElementBlock as U, renderSlot as X, useSlots as gf, normalizeClass as cr, createCommentVNode as Q, createElementVNode as K, toDisplayString as te, createVNode as z, withCtx as I, createTextVNode as Ve, createBlock as F, unref as y, watchEffect as Ue, onBeforeUnmount as Hn, normalizeStyle as vn, Fragment as Ge, renderList as bn, createStaticVNode as yf, useTemplateRef as ur, onMounted as xe, watch as se, nextTick as ge, Transition as vf, useId as bf, customRef as wf, toValue as Re, getCurrentScope as Ja, onScopeDispose as Xa, effectScope as Ya, getCurrentInstance as Ut, shallowRef as fn, readonly as xf, toHandlerKey as Sf, camelize as Ga, toRef as Hr, onUnmounted as Er, toRefs as jn, Comment as kf, mergeProps as oe, cloneVNode as Cf, reactive as so, Teleport as Za, normalizeProps as oo, guardReactiveProps as lo, markRaw as Qa, watchPostEffect as ec, shallowReadonly as En, mergeDefaults as Ef, withKeys as Ts, withModifiers as on, withMemo as Tf, resolveDynamicComponent as Mf, useModel as Of, withDirectives as Af, vShow as Df, render as Go, triggerRef as Zo } from "vue";
function Pf() {
  const n = /* @__PURE__ */ new Map();
  function e(s, o) {
    let l = n.get(s);
    return l || (l = /* @__PURE__ */ new Set(), n.set(s, l)), l.add(o), () => t(s, o);
  }
  function t(s, o) {
    n.get(s)?.delete(o);
  }
  function r(s, o) {
    n.get(s)?.forEach(
      (l) => l(o)
    );
  }
  function i() {
    n.clear();
  }
  return { on: e, off: t, emit: r, clear: i };
}
const Qo = [
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
function Nf(n, e, t) {
  const r = Qo[n.size % Qo.length];
  return { id: e, name: t, color: r };
}
function If(n, e, t) {
  return !e || n.has(e) ? null : Nf(n, e, t ?? e);
}
function Rf(n, e, t) {
  const r = n.get(e);
  return r ? { ...r, ...t } : null;
}
function _f(n) {
  const e = io(/* @__PURE__ */ new Map());
  function t(s, o) {
    const l = If(e, s, o);
    l && (e.set(l.id, l), n("speaker:add", { speaker: l }));
  }
  function r(s, o) {
    const l = Rf(e, s, o);
    l && (e.set(s, l), n("speaker:update", { speaker: l }));
  }
  function i() {
    e.clear();
  }
  return { all: e, ensure: t, update: r, clear: i };
}
function Bf(n, e) {
  return [...n, e];
}
function Lf(n, e) {
  return [...e, ...n];
}
function $f(n, e, t) {
  const r = n.findIndex((s) => s.id === e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e };
  return {
    turns: n.map((s, o) => o === r ? i : s),
    updated: i
  };
}
function zf(n, e) {
  const t = n.findIndex((r) => r.id === e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function Ff(n, e, t) {
  const r = n.findIndex((o) => o.id === e);
  if (r === -1) return null;
  const i = n[r], s = {
    ...i,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? i.startTime,
    endTime: t[t.length - 1]?.endTime ?? i.endTime
  };
  return {
    turns: n.map((o, l) => l === r ? s : o),
    updated: s
  };
}
function Ms(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function Vf(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, l = P(n.turns);
  function a(p) {
    t(p.speakerId), l.value = Bf(l.value, p), e("turn:add", { turn: p, translationId: r });
  }
  function c(p, m) {
    const g = $f(l.value, p, m);
    g && (l.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function u(p) {
    const m = zf(l.value, p);
    m && (l.value = m, e("turn:remove", { turnId: p, translationId: r }));
  }
  function d(p, m) {
    const g = Ff(l.value, p, m);
    g && (l.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function f(p) {
    Ms(p, t), l.value = Lf(l.value, p);
  }
  function h(p) {
    Ms(p, t), l.value = p, e("translation:sync", { translationId: r });
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: l, addTurn: a, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: h };
}
function el(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, l = io(/* @__PURE__ */ new Map());
  let a;
  for (const m of n.translations) {
    const g = Vf(m, e, t);
    l.set(m.id, g), m.isSource && !a && (a = g);
  }
  a || (a = l.values().next().value);
  const c = P(null), u = P(!1), d = P(!0), f = D(() => c.value ? l.get(c.value) ?? a : a);
  function h(m) {
    const g = m === a.id ? null : m;
    g !== c.value && (c.value = g, e("translation:change", { translationId: f.value.id }));
  }
  function p() {
    for (const m of l.values())
      m.setTurns([]);
    u.value = !1, d.value = !0, e("channel:reset", { channelId: r });
  }
  return {
    id: r,
    name: i,
    description: s,
    duration: o,
    translations: l,
    sourceTranslation: a,
    activeTranslation: f,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: h,
    reset: p
  };
}
function qf(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Wf(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function ao(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function tc(n, e, t, r = "*") {
  return n.map((i) => ({
    value: i.id,
    label: i.languages.map((s) => ao(s, e, r)).join(", ") + (i.isSource ? ` (${t})` : "")
  }));
}
function Hf(n, e = 250) {
  let t = !1, r = null;
  return (...i) => {
    if (t) {
      r = i;
      return;
    }
    t = !0, n(...i), setTimeout(() => {
      if (t = !1, r !== null) {
        const s = r;
        r = null, n(...s);
      }
    }, e);
  };
}
function Qr(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
class $e extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function jf(n) {
  if (n == null || typeof n != "object")
    throw new $e("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new $e("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new $e("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new $e("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new $e(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new $e(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new $e(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new $e(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new $e(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], l = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new $e(l, "must be a non-null object");
      if (typeof o.id != "string")
        throw new $e(`${l}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new $e(`${l}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new $e(`${l}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new $e(`${l}.turns`, "must be an array");
    }
  }
}
function Uf(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let l = 0; l < t; l += o * 2) {
    const a = Math.floor(l * s), c = Math.abs(i[a] ?? 0);
    let u = l, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function nc(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function Kf(n, e) {
  if (!nc(n)) return null;
  let t = 0, r = n.length - 1;
  for (; t <= r; ) {
    const i = t + r >>> 1, s = n[i];
    if (e < s.startTime)
      r = i - 1;
    else if (e > s.endTime)
      t = i + 1;
    else
      return s.id;
  }
  return null;
}
function U1(n = {}) {
  const e = P(""), t = P(n.activeChannelId ?? ""), r = P(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: l } = Pf(), a = _f(o), c = a, u = io(/* @__PURE__ */ new Map()), d = D(
    () => u.get(t.value) ?? [...u.values()][0]
  );
  function f(C, S) {
    return i(C, (T) => {
      T.translationId === d.value.activeTranslation.value.id && S(T);
    });
  }
  function h(C) {
    e.value = C.title, a.clear(), u.clear();
    for (const S of qf(C))
      c.ensure(S.id, S.name);
    for (const S of C.channels)
      u.set(S.id, el(S, o, c.ensure));
    u.size > 0 && !u.has(t.value) && (t.value = u.keys().next().value);
  }
  function p(C) {
    jf(C), h(C);
  }
  function m(C) {
    C !== t.value && (t.value = C, o("channel:change", { channelId: C }));
  }
  function g(C, S) {
    if (u.has(C)) {
      for (const T of S.translations)
        Ms(T.turns, c.ensure);
      u.set(C, el(S, o, c.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const v = [], w = [];
  function x(C) {
    C.tiptapExtensions && w.push(...C.tiptapExtensions);
    const S = C.install(k);
    S && v.push(S);
  }
  function b() {
    o("destroy", void 0), v.forEach((C) => C()), v.length = 0, l();
  }
  n.document && h(n.document);
  const k = {
    title: e,
    activeChannelId: t,
    capabilities: r,
    pluginExtensions: w,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: f,
    setDocument: p,
    setActiveChannel: m,
    setChannel: g,
    on: i,
    off: s,
    emit: o,
    use: x,
    destroy: b
  };
  return k;
}
const rc = /* @__PURE__ */ Symbol("core");
function K1(n) {
  Ln(rc, n);
}
function Kt() {
  const n = wi(rc);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const Jf = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const tl = (n) => n === "";
const Xf = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const nl = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Yf = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Gf = (n) => {
  const e = Yf(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Xn = {
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
const Zf = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = Xn.width,
  color: l = Xn.stroke,
  ...a
}, { slots: c }) => ze(
  "svg",
  {
    ...Xn,
    ...a,
    width: o,
    height: o,
    stroke: l,
    "stroke-width": tl(t) || tl(r) || t === !0 || r === !0 ? Number(i || s || Xn["stroke-width"]) * 24 / Number(o) : i || s || Xn["stroke-width"],
    class: Xf(
      "lucide",
      a.class,
      ...n ? [`lucide-${nl(Gf(n))}-icon`, `lucide-${nl(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Jf(a) && { "aria-hidden": "true" }
  },
  [...e.map((u) => ze(...u)), ...c.default ? [c.default()] : []]
);
const Ke = (n, e) => (t, { slots: r, attrs: i }) => ze(
  Zf,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const Qf = Ke("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const ic = Ke("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const eh = Ke("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const rl = Ke("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const th = Ke("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const nh = Ke("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const rh = Ke("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const ih = Ke("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const sh = Ke("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const oh = Ke("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const lh = Ke("volume-2", [
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
const ah = Ke("volume-x", [
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
const sc = Ke("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), ch = ["aria-label"], uh = /* @__PURE__ */ $({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (O(), U("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      X(e.$slots, "default", {}, void 0, !0)
    ], 8, ch));
  }
}), Me = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, Os = /* @__PURE__ */ Me(uh, [["__scopeId", "data-v-732d4c24"]]), dh = ["disabled", "aria-label"], fh = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, hh = /* @__PURE__ */ $({
  __name: "Button",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = gf(), r = D(() => !!t.icon && !t.default), i = D(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      r.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (O(), U("button", {
      type: "button",
      class: cr(i.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      s.$slots.icon ? (O(), U("span", fh, [
        X(s.$slots, "icon", {}, void 0, !0)
      ])) : Q("", !0),
      X(s.$slots, "default", {}, void 0, !0)
    ], 10, dh));
  }
}), ct = /* @__PURE__ */ Me(hh, [["__scopeId", "data-v-d2460090"]]), oc = {
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
}, ph = {
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
}, il = { fr: oc, en: ph }, lc = /* @__PURE__ */ Symbol("i18n");
function J1(n) {
  const e = D(() => {
    const r = il[n.value] ?? il.fr;
    return (i) => r[i] ?? i;
  }), t = {
    t: (r) => e.value(r),
    locale: n
  };
  return Ln(lc, t), t;
}
function gt() {
  const n = wi(lc);
  if (n) return n;
  const e = D(() => "fr");
  return {
    t: (t) => oc[t] ?? t,
    locale: e
  };
}
const mh = { class: "editor-header" }, gh = { class: "header-left" }, yh = { class: "document-title" }, vh = { class: "badges" }, bh = ["datetime"], wh = { class: "header-right" }, xh = /* @__PURE__ */ $({
  __name: "Header",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = gt(), i = D(() => ao(e.language, r.value, t("language.wildcard"))), s = D(() => Qr(e.duration)), o = D(() => e.title.replace(/-/g, " "));
    return (l, a) => (O(), U("header", mh, [
      K("div", gh, [
        K("h1", yh, te(o.value), 1),
        K("div", vh, [
          z(Os, null, {
            default: I(() => [
              Ve(te(i.value), 1)
            ]),
            _: 1
          }),
          z(Os, null, {
            default: I(() => [
              K("time", {
                datetime: `PT${n.duration}S`
              }, te(s.value), 9, bh)
            ]),
            _: 1
          })
        ])
      ]),
      K("div", wh, [
        n.isMobile ? (O(), F(ct, {
          key: 0,
          variant: "ghost",
          "aria-label": y(t)("header.openSidebar"),
          onClick: a[0] || (a[0] = (c) => l.$emit("toggleSidebar"))
        }, {
          icon: I(() => [
            z(y(oh), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : Q("", !0),
        n.isMobile ? (O(), F(ct, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": y(t)("header.export")
        }, {
          icon: I(() => [
            z(y(rl), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (O(), F(ct, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: I(() => [
            z(y(rl), { size: 16 })
          ]),
          default: I(() => [
            Ve(" " + te(y(t)("header.export")), 1)
          ]),
          _: 1
        })),
        z(ct, {
          variant: "ghost",
          disabled: "",
          "aria-label": y(t)("header.settings")
        }, {
          icon: I(() => [
            z(y(rh), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Sh = /* @__PURE__ */ Me(xh, [["__scopeId", "data-v-fce7f10f"]]), ji = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, kh = 70, Ch = 1e3 / 60, Eh = 350;
let jr = !1, sl = !1;
function Th() {
  sl || typeof document > "u" || (document.addEventListener("mousedown", () => {
    jr = !0;
  }), document.addEventListener("mouseup", () => {
    jr = !1;
  }), document.addEventListener("click", () => {
    jr = !1;
  }), sl = !0);
}
const Ui = /* @__PURE__ */ new Map();
function Ki(...n) {
  const e = {
    damping: ji.damping,
    stiffness: ji.stiffness,
    mass: ji.mass
  };
  let t = !1;
  for (const i of n) {
    if (i === "instant") {
      t = !0;
      continue;
    }
    typeof i != "object" || !i || (t = !1, e.damping = i.damping ?? e.damping, e.stiffness = i.stiffness ?? e.stiffness, e.mass = i.mass ?? e.mass);
  }
  const r = JSON.stringify(e);
  return Ui.has(r) || Ui.set(r, Object.freeze({ ...e })), t ? "instant" : Ui.get(r);
}
function Mh(n = {}) {
  Th();
  let e = { ...n };
  const t = /* @__PURE__ */ new Set(), r = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function i() {
    const M = s();
    for (const R of t) R(M);
  }
  function s() {
    return {
      isAtBottom: r.isAtBottom || r.isNearBottom,
      isNearBottom: r.isNearBottom,
      escapedFromLock: r.escapedFromLock
    };
  }
  function o() {
    return r.scrollElement?.scrollTop ?? 0;
  }
  function l(M) {
    r.scrollElement && (r.scrollElement.scrollTop = M, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function a() {
    const M = r.scrollElement, R = r.contentElement;
    return !M || !R ? 0 : M.scrollHeight - 1 - M.clientHeight;
  }
  let c;
  function u() {
    const M = r.scrollElement, R = r.contentElement;
    if (!M || !R)
      return 0;
    const _ = a();
    if (!e.targetScrollTop)
      return _;
    if (c?.targetScrollTop === _)
      return c.calculatedScrollTop;
    const q = Math.max(
      Math.min(
        e.targetScrollTop(_, {
          scrollElement: M,
          contentElement: R
        }),
        _
      ),
      0
    );
    return c = { targetScrollTop: _, calculatedScrollTop: q }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), q;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= kh;
  }
  function h(M) {
    r.isAtBottom = M, i();
  }
  function p(M) {
    r.escapedFromLock = M, i();
  }
  function m(M) {
    r.isNearBottom = M, i();
  }
  function g() {
    if (!jr || typeof window > "u")
      return !1;
    const M = window.getSelection?.();
    if (!M || !M.rangeCount)
      return !1;
    const R = M.getRangeAt(0), _ = r.scrollElement;
    if (!_)
      return !1;
    const q = R.commonAncestorContainer;
    return !!(q && (_.contains(q) || q.contains(_)));
  }
  const v = (M) => {
    if (M.target !== r.scrollElement)
      return;
    const R = o(), _ = r.ignoreScrollToTop;
    let q = r.lastScrollTop ?? R;
    r.lastScrollTop = R, r.ignoreScrollToTop = void 0, _ && _ > R && (q = _), m(f()), setTimeout(() => {
      if (r.resizeDifference || R === _)
        return;
      if (g()) {
        p(!0), h(!1);
        return;
      }
      const N = R > q, B = R < q;
      if (r.animation?.ignoreEscapes) {
        l(q);
        return;
      }
      B && (p(!0), h(!1)), N && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, w = (M) => {
    const R = r.scrollElement;
    if (!R)
      return;
    let _ = M.target;
    for (; _ && !["scroll", "auto"].includes(getComputedStyle(_).overflow); ) {
      if (!_.parentElement)
        return;
      _ = _.parentElement;
    }
    _ === R && M.deltaY < 0 && R.scrollHeight > R.clientHeight && !r.animation?.ignoreEscapes && (p(!0), h(!1));
  };
  function x(M, R) {
    b(), r.scrollElement = M, r.contentElement = R, getComputedStyle(M).overflow === "visible" && (M.style.overflow = "auto"), M.addEventListener("scroll", v, { passive: !0 }), M.addEventListener("wheel", w, { passive: !0 });
    let _;
    r.resizeObserver = new ResizeObserver((q) => {
      const N = q[0];
      if (!N)
        return;
      const { height: B } = N.contentRect, ee = B - (_ ?? B);
      if (r.resizeDifference = ee, o() > a() && l(a()), m(f()), ee >= 0) {
        const J = Ki(
          e,
          _ ? e.resize : e.initial
        );
        S({
          animation: J,
          wait: !0,
          preserveScrollPosition: !0,
          duration: J === "instant" ? void 0 : Eh
        });
      } else
        f() && (p(!1), h(!0));
      _ = B, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === ee && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(R);
  }
  function b() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", v), r.scrollElement.removeEventListener("wheel", w)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function k() {
    b(), t.clear();
  }
  function C(M) {
    e = { ...e, ...M };
  }
  function S(M = {}) {
    const R = typeof M == "string" ? { animation: M } : M;
    R.preserveScrollPosition || h(!0);
    const _ = Date.now() + (Number(R.wait) || 0), q = Ki(e, R.animation), { ignoreEscapes: N = !1 } = R;
    let B, ee = u();
    R.duration instanceof Promise ? R.duration.finally(() => {
      B = Date.now();
    }) : B = _ + (R.duration ?? 0);
    const J = async () => {
      const ne = new Promise((ce) => {
        if (typeof requestAnimationFrame > "u") {
          ce(!1);
          return;
        }
        requestAnimationFrame(() => ce(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const ce = o(), Le = typeof performance < "u" ? performance.now() : Date.now(), kn = (Le - (r.lastTick ?? Le)) / Ch;
        if (r.animation ||= { behavior: q, promise: ne, ignoreEscapes: N }, r.animation.behavior === q && (r.lastTick = Le), g() || _ > Date.now())
          return J();
        if (ce < Math.min(ee, u())) {
          if (r.animation?.behavior === q) {
            if (q === "instant")
              return l(u()), J();
            const tt = q;
            r.velocity = (tt.damping * r.velocity + tt.stiffness * d()) / tt.mass, r.accumulated += r.velocity * kn;
            const Cn = o();
            l(Cn + r.accumulated), o() !== Cn && (r.accumulated = 0);
          }
          return J();
        }
        return B > Date.now() ? (ee = u(), J()) : (r.animation = void 0, o() < u() ? S({
          animation: Ki(e, e.resize),
          ignoreEscapes: N,
          duration: Math.max(0, B - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ne.then((ce) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), ce));
    };
    return R.wait !== !0 && (r.animation = void 0), r.animation?.behavior === q ? r.animation.promise : J();
  }
  const T = () => {
    p(!0), h(!1);
  };
  function E(M) {
    return t.add(M), () => t.delete(M);
  }
  return {
    attach: x,
    detach: b,
    destroy: k,
    setOptions: C,
    getState: s,
    onChange: E,
    scrollToBottom: S,
    stopScroll: T
  };
}
function Oh(n = {}) {
  const e = P(null), t = P(null), r = P(n.initial !== !1), i = P(!1), s = P(!1), o = Mh(n);
  let l = null;
  return Ue((a) => {
    !e.value || !t.value || (o.attach(e.value, t.value), l = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), a(() => {
      l?.(), l = null, o.detach();
    }));
  }), Hn(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: r,
    isNearBottom: i,
    escapedFromLock: s,
    scrollToBottom: (a) => o.scrollToBottom(a),
    stopScroll: () => o.stopScroll(),
    setOptions: (a) => o.setOptions(a)
  };
}
const Ah = /* @__PURE__ */ $({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (O(), U("span", {
      class: "speaker-indicator",
      style: vn({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), ac = /* @__PURE__ */ Me(Ah, [["__scopeId", "data-v-9bffeda8"]]), Dh = { class: "speaker-label" }, Ph = {
  key: 1,
  class: "speaker-name"
}, Nh = ["datetime"], Ih = /* @__PURE__ */ $({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = gt(), i = D(
      () => ao(e.language, r.value, t("language.wildcard"))
    ), s = D(
      () => e.startTime != null ? Qr(e.startTime) : null
    ), o = D(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), l = D(() => e.speaker?.color ?? "transparent");
    return (a, c) => (O(), U("div", Dh, [
      n.speaker ? (O(), F(ac, {
        key: 0,
        color: l.value
      }, null, 8, ["color"])) : Q("", !0),
      n.speaker ? (O(), U("span", Ph, te(n.speaker.name), 1)) : Q("", !0),
      s.value ? (O(), U("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, te(s.value), 9, Nh)) : Q("", !0),
      z(Os, null, {
        default: I(() => [
          Ve(te(i.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), cc = /* @__PURE__ */ Me(Ih, [["__scopeId", "data-v-8bb5c8bd"]]), Rh = ["data-turn-active"], _h = { class: "turn-text" }, Bh = ["data-word-active"], Lh = /* @__PURE__ */ $({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Kt(), r = D(() => e.turn.words.length > 0), i = D(() => {
      if (!t.audio?.src.value || !r.value) return null;
      const l = t.audio.currentTime.value, { startTime: a, endTime: c, words: u } = e.turn;
      return a == null || c == null || l < a || l > c ? null : Kf(u, l);
    }), s = D(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || nc(e.turn.words)) return !1;
      const l = t.audio.currentTime.value;
      return l >= e.turn.startTime && l <= e.turn.endTime;
    }), o = D(() => e.speaker?.color ?? "transparent");
    return (l, a) => (O(), U("section", {
      class: cr(["turn", { "turn--active": s.value, "turn--partial": n.partial }]),
      "data-turn-active": s.value || n.partial || n.live || void 0,
      style: vn({ "--speaker-color": o.value })
    }, [
      n.partial ? Q("", !0) : (O(), F(cc, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      K("p", _h, [
        r.value ? (O(!0), U(Ge, { key: 0 }, bn(n.turn.words, (c, u) => (O(), U(Ge, {
          key: c.id
        }, [
          K("span", {
            class: cr({ "word--active": c.id === i.value }),
            "data-word-active": c.id === i.value || void 0
          }, te(c.text), 11, Bh),
          Ve(te(u < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (O(), U(Ge, { key: 1 }, [
          Ve(te(n.turn.text), 1)
        ], 64)) : Q("", !0)
      ])
    ], 14, Rh));
  }
}), ol = /* @__PURE__ */ Me(Lh, [["__scopeId", "data-v-8d148b2f"]]), $h = {}, zh = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Fh(n, e) {
  return O(), U("svg", zh, [...e[0] || (e[0] = [
    yf('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Vh = /* @__PURE__ */ Me($h, [["render", Fh]]), qh = { class: "transcription-empty" }, Wh = { class: "message" }, Hh = /* @__PURE__ */ $({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = gt();
    return (t, r) => (O(), U("div", qh, [
      z(Vh, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      K("p", Wh, te(y(e)("transcription.empty")), 1)
    ]));
  }
}), jh = /* @__PURE__ */ Me(Hh, [["__scopeId", "data-v-f82737e5"]]), Uh = { class: "transcription-panel" }, Kh = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Jh = { class: "turns-container" }, Xh = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Yh = {
  key: 1,
  class: "history-start"
}, Gh = /* @__PURE__ */ $({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = gt(), r = Kt(), i = ur("scrollContainer"), s = D(() => {
      const w = r.live?.partial.value ?? null;
      return w === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: w,
        words: [],
        language: r.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = D(() => r.live?.hasLiveUpdate.value ?? !1), l = D(() => r.audio?.isPlaying.value ?? !1), a = D(
      () => r.activeChannel.value.activeTranslation.value
    ), c = D(() => r.activeChannel.value), u = D(
      () => c.value.isLoadingHistory.value
    ), d = D(() => c.value.hasMoreHistory.value), { scrollRef: f, contentRef: h, isAtBottom: p, scrollToBottom: m } = Oh();
    xe(() => {
      f.value = i.value, h.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const g = Hf(() => {
      const w = c.value;
      w.hasMoreHistory.value && (w.isLoadingHistory.value || e.turns.length !== 0 && r.emit("scroll:top", { translationId: a.value.id }));
    }, 500);
    function v() {
      const w = i.value;
      w && w.scrollTop < 100 && g();
    }
    return se(
      () => e.turns,
      (w, x) => {
        const b = w.length, k = x.length;
        if (b > k && !p.value && w[0]?.id != x[0]?.id) {
          const C = b - k, S = e.turns[C]?.id;
          if (!S || !f.value) return;
          ge(() => {
            f.value?.querySelector(
              `[data-turn-id="${S}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), xe(() => {
      i.value?.addEventListener("scroll", v, {
        passive: !0
      });
    }), Hn(() => {
      i.value?.removeEventListener("scroll", v);
    }), (w, x) => (O(), U("article", Uh, [
      K("div", Kh, [
        K("div", Jh, [
          u.value ? (O(), U("div", Xh, [...x[1] || (x[1] = [
            K("progress", null, null, -1)
          ])])) : Q("", !0),
          !d.value && n.turns.length > 0 ? (O(), U("div", Yh, te(y(t)("transcription.historyStart")), 1)) : Q("", !0),
          n.turns.length === 0 && !u.value && !s.value ? (O(), F(jh, {
            key: 2,
            class: "transcription-empty"
          })) : Q("", !0),
          (O(!0), U(Ge, null, bn(n.turns, (b, k) => (O(), F(ol, {
            "data-turn-id": b.id,
            key: b.id,
            turn: b,
            speaker: b.speakerId ? n.speakers.get(b.speakerId) : void 0,
            live: o.value && !s.value && k === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (O(), F(ol, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : Q("", !0)
        ]),
        z(vf, { name: "fade-slide" }, {
          default: I(() => [
            !y(p) && (l.value || o.value) ? (O(), F(ct, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": y(t)("transcription.resumeScroll"),
              onClick: x[0] || (x[0] = (b) => y(m)())
            }, {
              icon: I(() => [
                z(y(Qf), { size: 14 })
              ]),
              default: I(() => [
                Ve(" " + te(y(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : Q("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Zh = /* @__PURE__ */ Me(Gh, [["__scopeId", "data-v-3fec478f"]]), Qh = { class: "switch" }, ep = ["id", "checked"], tp = ["for"], np = /* @__PURE__ */ $({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? bf();
    return (s, o) => (O(), U("div", Qh, [
      K("input", {
        type: "checkbox",
        id: y(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (l) => r("update:modelValue", l.target.checked))
      }, null, 40, ep),
      K("label", { for: y(i) }, [...o[1] || (o[1] = [
        K("div", { class: "switch-slider" }, null, -1)
      ])], 8, tp)
    ]));
  }
}), rp = /* @__PURE__ */ Me(np, [["__scopeId", "data-v-2aa0332f"]]), ip = "(max-width: 767px)";
function uc() {
  const n = P(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return xe(() => {
    e = window.matchMedia(ip), n.value = e.matches, e.addEventListener("change", t);
  }), Hn(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function ll(n) {
  return typeof n == "string" ? `'${n}'` : new sp().serialize(n);
}
const sp = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, r) {
      const i = typeof t, s = typeof r;
      return i === "string" && s === "string" ? t.localeCompare(r) : i === "number" && s === "number" ? t - r : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(r, !0));
    }
    serialize(t, r) {
      if (t === null) return "null";
      switch (typeof t) {
        case "string":
          return r ? t : `'${t}'`;
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
      const r = Object.prototype.toString.call(t);
      if (r !== "[object Object]") return this.serializeBuiltInType(r.length < 10 ? `unknown:${r}` : r.slice(8, -1), t);
      const i = t.constructor, s = i === Object || i === void 0 ? "" : i.name;
      if (s !== "" && globalThis[s] === i) return this.serializeBuiltInType(s, t);
      if (typeof t.toJSON == "function") {
        const o = t.toJSON();
        return s + (o !== null && typeof o == "object" ? this.$object(o) : `(${this.serialize(o)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(t));
    }
    serializeBuiltInType(t, r) {
      const i = this["$" + t];
      if (i) return i.call(this, r);
      if (typeof r?.entries == "function") return this.serializeObjectEntries(t, r.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, r) {
      const i = Array.from(r).sort((o, l) => this.compare(o[0], l[0]));
      let s = `${t}{`;
      for (let o = 0; o < i.length; o++) {
        const [l, a] = i[o];
        s += `${this.serialize(l, !0)}:${this.serialize(a)}`, o < i.length - 1 && (s += ",");
      }
      return s + "}";
    }
    $object(t) {
      let r = this.#e.get(t);
      return r === void 0 && (this.#e.set(t, `#${this.#e.size}`), r = this.serializeObject(t), this.#e.set(t, r)), r;
    }
    $function(t) {
      const r = Function.prototype.toString.call(t);
      return r.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${r.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(t) {
      let r = "[";
      for (let i = 0; i < t.length; i++) r += this.serialize(t[i]), i < t.length - 1 && (r += ",");
      return r + "]";
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
      return `Set${this.$Array(Array.from(t).sort((r, i) => this.compare(r, i)))}`;
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
function ei(n, e) {
  return n === e || ll(n) === ll(e);
}
function op(n, e, t) {
  const r = n.findIndex((l) => ei(l, e)), i = n.findIndex((l) => ei(l, t));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((l, a) => l - a);
  return n.slice(s, o + 1);
}
function al(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function yt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const l = wi(r, o);
    if (l || l === null) return l;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Ln(r, o), o)];
}
function Ze() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function xi(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function As(n) {
  return n == null;
}
function co(n) {
  return n ? n.flatMap((e) => e.type === Ge ? co(e.children) : [e]) : [];
}
const [Si] = yt("ConfigProvider");
function lp(n, e) {
  var t;
  const r = fn();
  return Ue(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), xf(r);
}
function ki(n, e) {
  return Ja() ? (Xa(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Ji() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const o = () => e(s);
      return ki(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((o) => o(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function ap(n) {
  let e = !1, t;
  const r = Ya(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Mt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const cp = (n) => typeof n < "u", up = Object.prototype.toString, dp = (n) => up.call(n) === "[object Object]", cl = /* @__PURE__ */ fp();
function fp() {
  var n, e, t;
  return Mt && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function Xi(n) {
  return Array.isArray(n) ? n : [n];
}
function hp(n) {
  return Ut();
}
// @__NO_SIDE_EFFECTS__
function pp(n) {
  if (!Mt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = Ya(!0), t = r.run(() => n(...s))), ki(i), t));
}
function dc(n, e = 1e4) {
  return wf((t, r) => {
    let i = Re(n), s;
    const o = () => setTimeout(() => {
      i = Re(n), r();
    }, Re(e));
    return ki(() => {
      clearTimeout(s);
    }), {
      get() {
        return t(), i;
      },
      set(l) {
        i = l, r(), clearTimeout(s), s = o();
      }
    };
  });
}
function mp(n, e) {
  hp() && Hn(n, e);
}
function gp(n, e, t) {
  return se(n, e, {
    ...t,
    immediate: !0
  });
}
const Ci = Mt ? window : void 0;
function ft(n) {
  var e;
  const t = Re(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function fc(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = D(() => {
    const r = Xi(Re(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return gp(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => ft(s))) !== null && r !== void 0 ? r : [Ci].filter((s) => s != null),
      Xi(Re(t.value ? n[1] : n[0])),
      Xi(y(t.value ? n[2] : n[1])),
      Re(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], l, a) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = dp(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    a(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function hc() {
  const n = fn(!1), e = Ut();
  return e && xe(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function yp(n) {
  const e = /* @__PURE__ */ hc();
  return D(() => (e.value, !!n()));
}
function vp(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function bp(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = Ci, eventName: s = "keydown", passive: o = !1, dedupe: l = !1 } = r, a = vp(e);
  return fc(i, s, (u) => {
    u.repeat && Re(l) || a(u) && t(u);
  }, o);
}
function wp(n) {
  return JSON.parse(JSON.stringify(n));
}
function xp(n, e, t = {}) {
  const { window: r = Ci, ...i } = t;
  let s;
  const o = /* @__PURE__ */ yp(() => r && "ResizeObserver" in r), l = () => {
    s && (s.disconnect(), s = void 0);
  }, a = se(D(() => {
    const u = Re(n);
    return Array.isArray(u) ? u.map((d) => ft(d)) : [ft(u)];
  }), (u) => {
    if (l(), o.value && r) {
      s = new ResizeObserver(e);
      for (const d of u) d && s.observe(d, i);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    l(), a();
  };
  return ki(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ti(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: l = !1, eventName: a, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = Ut(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = a;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : wp(w) : w, g = () => cp(n[e]) ? m(n[e]) : u, v = (w) => {
    d ? d(w) && h(p, w) : h(p, w);
  };
  if (l) {
    const w = P(g());
    let x = !1;
    return se(() => n[e], (b) => {
      x || (x = !0, w.value = m(b), ge(() => x = !1));
    }), se(w, (b) => {
      !x && (b !== n[e] || c) && v(b);
    }, { deep: c }), w;
  } else return D({
    get() {
      return g();
    },
    set(w) {
      v(w);
    }
  });
}
function Yi(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Ds(n, e, t = ".", r) {
  if (!Yi(e))
    return Ds(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : Yi(o) && Yi(i[s]) ? i[s] = Ds(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function Sp(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => Ds(t, r, "", n), {})
  );
}
const kp = Sp(), Cp = /* @__PURE__ */ pp(() => {
  const n = P(/* @__PURE__ */ new Map()), e = P(), t = D(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), r = Si({ scrollBody: P(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", cl && i?.(), e.value = void 0;
  };
  return se(t, (o, l) => {
    if (!Mt) return;
    if (!o) {
      l && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: a,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? kp({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), cl && (i = fc(document, "touchmove", (d) => Ep(d), { passive: !1 })), ge(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function pc(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Cp();
  t.value.set(e, n ?? !1);
  const r = D({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return mp(() => {
    t.value.delete(e);
  }), r;
}
function mc(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : mc(t);
  }
}
function Ep(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && mc(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function gc(n) {
  const e = Si({ dir: P("ltr") });
  return D(() => n?.value || e.dir?.value || "ltr");
}
function Ei(n) {
  const e = Ut(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[Sf(Ga(i))] = (...s) => n(i, ...s);
  }), r;
}
let Gi = 0;
function Tp() {
  Ue((n) => {
    if (!Mt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ul()), document.body.insertAdjacentElement("beforeend", e[1] ?? ul()), Gi++, n(() => {
      Gi === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Gi--;
    });
  });
}
function ul() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function yc(n) {
  return D(() => Re(n) ? !!ft(n)?.closest("form") : !0);
}
function pe() {
  const n = Ut(), e = P(), t = D(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : ft(e)), r = Object.assign({}, n.exposed), i = {};
  for (const o in n.props) Object.defineProperty(i, o, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[o]
  });
  if (Object.keys(r).length > 0) for (const o in r) Object.defineProperty(i, o, {
    enumerable: !0,
    configurable: !0,
    get: () => r[o]
  });
  Object.defineProperty(i, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = i;
  function s(o) {
    if (e.value = o, !!o && (Object.defineProperty(i, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => o instanceof Element ? o : o.$el
    }), !(o instanceof Element) && !Object.hasOwn(o, "$el"))) {
      const l = o.$.exposed, a = Object.assign({}, i);
      for (const c in l) Object.defineProperty(a, c, {
        enumerable: !0,
        configurable: !0,
        get: () => l[c]
      });
      n.exposed = a;
    }
  }
  return {
    forwardRef: s,
    currentRef: e,
    currentElement: t
  };
}
function uo(n) {
  const e = Ut(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Hr(n);
  return D(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[Ga(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, l) => (r.value[l] !== void 0 && (o[l] = r.value[l]), o), {});
  });
}
function Mp(n, e) {
  const t = uo(n), r = e ? Ei(e) : {};
  return D(() => ({
    ...t.value,
    ...r
  }));
}
var Op = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, Tn = /* @__PURE__ */ new WeakMap(), Pr = /* @__PURE__ */ new WeakMap(), Nr = {}, Zi = 0, vc = function(n) {
  return n && (n.host || vc(n.parentNode));
}, Ap = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = vc(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Dp = function(n, e, t, r) {
  var i = Ap(e, Array.isArray(n) ? n : [n]);
  Nr[t] || (Nr[t] = /* @__PURE__ */ new WeakMap());
  var s = Nr[t], o = [], l = /* @__PURE__ */ new Set(), a = new Set(i), c = function(d) {
    !d || l.has(d) || (l.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || a.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (l.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (Tn.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Tn.set(f, m), s.set(f, g), o.push(f), m === 1 && p && Pr.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (v) {
          console.error("aria-hidden: cannot operate on ", f, v);
        }
    });
  };
  return u(e), l.clear(), Zi++, function() {
    o.forEach(function(d) {
      var f = Tn.get(d) - 1, h = s.get(d) - 1;
      Tn.set(d, f), s.set(d, h), f || (Pr.has(d) || d.removeAttribute(r), Pr.delete(d)), h || d.removeAttribute(t);
    }), Zi--, Zi || (Tn = /* @__PURE__ */ new WeakMap(), Tn = /* @__PURE__ */ new WeakMap(), Pr = /* @__PURE__ */ new WeakMap(), Nr = {});
  };
}, Pp = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = Op(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Dp(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function bc(n) {
  let e;
  se(() => ft(n), (t) => {
    t ? e = Pp(t) : e && e();
  }), Er(() => {
    e && e();
  });
}
let Np = 0;
function dr(n, e = "reka") {
  if ("useId" in Yo) return `${e}-${Yo.useId?.()}`;
  const t = Si({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Np}`;
}
function Ip() {
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
function Rp(n) {
  const e = P(), t = D(() => e.value?.width ?? 0), r = D(() => e.value?.height ?? 0);
  return xe(() => {
    const i = ft(n);
    if (i) {
      e.value = {
        width: i.offsetWidth,
        height: i.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const l = o[0];
        let a, c;
        if ("borderBoxSize" in l) {
          const u = l.borderBoxSize, d = Array.isArray(u) ? u[0] : u;
          a = d.inlineSize, c = d.blockSize;
        } else
          a = i.offsetWidth, c = i.offsetHeight;
        e.value = {
          width: a,
          height: c
        };
      });
      return s.observe(i, { box: "border-box" }), () => s.unobserve(i);
    } else e.value = void 0;
  }), {
    width: t,
    height: r
  };
}
function _p(n, e) {
  const t = P(n);
  function r(s) {
    return e[t.value][s] ?? t.value;
  }
  return {
    state: t,
    dispatch: (s) => {
      t.value = r(s);
    }
  };
}
function fo(n) {
  const e = dc("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Ze(), l = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), a = l.find((f) => f.ref === o), c = l.map((f) => f.textValue), u = Lp(c, e.value, a?.textValue), d = l.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Bp(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function Lp(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = Bp(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const a = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return a !== t ? a : void 0;
}
function $p(n, e) {
  const t = P({}), r = P("none"), i = P(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const l = e.value?.ownerDocument.defaultView ?? Ci, { state: a, dispatch: c } = _p(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), u = (g) => {
    if (Mt) {
      const v = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(v);
    }
  };
  se(n, async (g, v) => {
    const w = v !== g;
    if (await ge(), w) {
      const x = r.value, b = Ir(e.value);
      g ? (c("MOUNT"), u("enter"), b === "none" && u("after-enter")) : b === "none" || b === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : v && x !== b ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const v = Ir(e.value), w = v.includes(CSS.escape(g.animationName)), x = a.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && w && (u(`after-${x}`), c("ANIMATION_END"), !i.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = l?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    g.target === e.value && v === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = Ir(e.value));
  }, h = se(e, (g, v) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && l?.clearTimeout(o), v?.removeEventListener("animationstart", f), v?.removeEventListener("animationcancel", d), v?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = se(a, () => {
    const g = Ir(e.value);
    r.value = a.value === "mounted" ? g : "none";
  });
  return Er(() => {
    h(), p();
  }), { isPresent: D(() => ["mounted", "unmountSuspended"].includes(a.value)) };
}
function Ir(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var ho = $({
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
    const { present: r, forceMount: i } = jn(n), s = P(), { isPresent: o } = $p(r, s);
    t({ present: o });
    let l = e.default({ present: o.value });
    l = co(l || []);
    const a = Ut();
    if (l && l?.length > 1) {
      const c = a?.parent?.type.name ? `<${a.parent.type.name} />` : "component";
      throw new Error([
        `Detected an invalid children for \`${c}\` for  \`Presence\` component.`,
        "",
        "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
        "You can apply a few solutions:",
        ["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((u) => `  - ${u}`).join(`
`)
      ].join(`
`));
    }
    return () => i.value || r.value || o.value ? ze(e.default({ present: o.value })[0], { ref: (c) => {
      const u = ft(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const Ps = $({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = co(t.default()), i = r.findIndex((a) => a.type !== kf);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? oe(e, s.props) : e, l = Cf({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? l : (r[i] = l, r);
    };
  }
}), zp = [
  "area",
  "img",
  "input"
], fe = $({
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
    const r = n.asChild ? "template" : n.as;
    return typeof r == "string" && zp.includes(r) ? () => ze(r, e) : r !== "template" ? () => ze(n.as, e, { default: t.default }) : () => ze(Ps, e, { default: t.default });
  }
});
function ni() {
  const n = P(), e = D(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : ft(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Jt, Fp] = yt("DialogRoot");
var Vp = /* @__PURE__ */ $({
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
    const t = n, i = /* @__PURE__ */ ti(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), o = P(), { modal: l } = jn(t);
    return Fp({
      open: i,
      modal: l,
      openModal: () => {
        i.value = !0;
      },
      onOpenChange: (a) => {
        i.value = a;
      },
      onOpenToggle: () => {
        i.value = !i.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: o
    }), (a, c) => X(a.$slots, "default", {
      open: y(i),
      close: () => i.value = !1
    });
  }
}), wc = Vp, qp = /* @__PURE__ */ $({
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
    pe();
    const t = Jt();
    return (r, i) => (O(), F(y(fe), oe(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => y(t).onOpenChange(!1))
    }), {
      default: I(() => [X(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Wp = qp;
const Hp = "dismissableLayer.pointerDownOutside", jp = "dismissableLayer.focusOutside";
function xc(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function Up(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1), s = P(() => {
  });
  return Ue((o) => {
    if (!Mt || !Re(t)) return;
    const l = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (xc(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            xi(Hp, n, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (r.removeEventListener("click", s.value), s.value = f, r.addEventListener("click", s.value, { once: !0 })) : f();
        } else r.removeEventListener("click", s.value);
        i.value = !1;
      }
    }, a = window.setTimeout(() => {
      r.addEventListener("pointerdown", l);
    }, 0);
    o(() => {
      window.clearTimeout(a), r.removeEventListener("pointerdown", l), r.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    Re(t) && (i.value = !0);
  } };
}
function Kp(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1);
  return Ue((s) => {
    if (!Mt || !Re(t)) return;
    const o = async (l) => {
      if (!e?.value) return;
      await ge(), await ge();
      const a = l.target;
      !e.value || !a || xc(e.value, a) || l.target && !i.value && xi(jp, n, { originalEvent: l });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Re(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Re(t) && (i.value = !1);
    }
  };
}
const Je = so({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Jp = /* @__PURE__ */ $({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = pe(), o = D(() => s.value?.ownerDocument ?? globalThis.document), l = D(() => Je.layersRoot), a = D(() => s.value ? Array.from(l.value).indexOf(s.value) : -1), c = D(() => Je.layersWithOutsidePointerEventsDisabled.size > 0), u = D(() => {
      const h = Array.from(l.value), [p] = [...Je.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return a.value >= m;
    }), d = Up(async (h) => {
      const p = [...Je.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await ge(), h.defaultPrevented || r("dismiss"));
    }, s), f = Kp((h) => {
      [...Je.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return bp("Escape", (h) => {
      a.value === l.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), Ue((h) => {
      s.value && (t.disableOutsidePointerEvents && (Je.layersWithOutsidePointerEventsDisabled.size === 0 && (Je.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Je.layersWithOutsidePointerEventsDisabled.add(s.value)), l.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && Je.layersWithOutsidePointerEventsDisabled.size === 1 && !As(Je.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Je.originalBodyPointerEvents);
      }));
    }), Ue((h) => {
      h(() => {
        s.value && (l.value.delete(s.value), Je.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (O(), F(y(fe), {
      ref: y(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: vn({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: y(f).onFocusCapture,
      onBlurCapture: y(f).onBlurCapture,
      onPointerdownCapture: y(d).onPointerDownCapture
    }, {
      default: I(() => [X(h.$slots, "default")]),
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
}), Sc = Jp;
const Xp = /* @__PURE__ */ ap(() => P([]));
function Yp() {
  const n = Xp();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = dl(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = dl(n.value, e), n.value[0]?.resume();
    }
  };
}
function dl(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const Qi = "focusScope.autoFocusOnMount", es = "focusScope.autoFocusOnUnmount", fl = {
  bubbles: !1,
  cancelable: !0
};
function Gp(n, { select: e = !1 } = {}) {
  const t = Ze();
  for (const r of n)
    if (At(r, { select: e }), Ze() !== t) return !0;
}
function Zp(n) {
  const e = kc(n), t = hl(e, n), r = hl(e.reverse(), n);
  return [t, r];
}
function kc(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function hl(n, e) {
  for (const t of n) if (!Qp(t, { upTo: e })) return t;
}
function Qp(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function em(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function At(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Ze();
    n.focus({ preventScroll: !0 }), n !== t && em(n) && e && n.select();
  }
}
var tm = /* @__PURE__ */ $({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = pe(), o = P(null), l = Yp(), a = so({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    Ue((u) => {
      if (!Mt) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(g) {
        if (a.paused || !d) return;
        const v = g.target;
        d.contains(v) ? o.value = v : At(o.value, { select: !0 });
      }
      function h(g) {
        if (a.paused || !d) return;
        const v = g.relatedTarget;
        v !== null && (d.contains(v) || At(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || At(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", h);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", h), m.disconnect();
      });
    }), Ue(async (u) => {
      const d = s.value;
      if (await ge(), !d) return;
      l.add(a);
      const f = Ze();
      if (!d.contains(f)) {
        const p = new CustomEvent(Qi, fl);
        d.addEventListener(Qi, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (Gp(kc(d), { select: !0 }), Ze() === f && At(d));
      }
      u(() => {
        d.removeEventListener(Qi, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(es, fl), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(es, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || At(f ?? document.body, { select: !0 }), d.removeEventListener(es, m), l.remove(a);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || a.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = Ze();
      if (d && f) {
        const h = u.currentTarget, [p, m] = Zp(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && At(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && At(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (O(), F(y(fe), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: I(() => [X(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Cc = tm;
function nm(n) {
  return n ? "open" : "closed";
}
function pl(n) {
  const e = Ze();
  for (const t of n)
    if (t === e || (t.focus(), Ze() !== e)) return;
}
const rm = "DialogTitle", im = "DialogContent";
function sm({ titleName: n = rm, contentName: e = im, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, l = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  xe(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(l));
  });
}
var om = /* @__PURE__ */ $({
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
    const t = n, r = e, i = Jt(), { forwardRef: s, currentElement: o } = pe();
    return i.titleId ||= dr(void 0, "reka-dialog-title"), i.descriptionId ||= dr(void 0, "reka-dialog-description"), xe(() => {
      i.contentElement = o, Ze() !== document.body && (i.triggerElement.value = Ze());
    }), process.env.NODE_ENV !== "production" && sm({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (l, a) => (O(), F(y(Cc), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: a[5] || (a[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: a[6] || (a[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: I(() => [z(y(Sc), oe({
        id: y(i).contentId,
        ref: y(s),
        as: l.as,
        "as-child": l.asChild,
        "disable-outside-pointer-events": l.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": y(i).descriptionId,
        "aria-labelledby": y(i).titleId,
        "data-state": y(nm)(y(i).open.value)
      }, l.$attrs, {
        onDismiss: a[0] || (a[0] = (c) => y(i).onOpenChange(!1)),
        onEscapeKeyDown: a[1] || (a[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: a[2] || (a[2] = (c) => r("focusOutside", c)),
        onInteractOutside: a[3] || (a[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: a[4] || (a[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: I(() => [X(l.$slots, "default")]),
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
}), Ec = om, lm = /* @__PURE__ */ $({
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
    const t = n, r = e, i = Jt(), s = Ei(r), { forwardRef: o, currentElement: l } = pe();
    return bc(l), (a, c) => (O(), F(Ec, oe({
      ...t,
      ...y(s)
    }, {
      ref: y(o),
      "trap-focus": y(i).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (u.preventDefault(), y(i).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || f) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: I(() => [X(a.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), am = lm, cm = /* @__PURE__ */ $({
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
    const t = n, i = Ei(e);
    pe();
    const s = Jt(), o = P(!1), l = P(!1);
    return (a, c) => (O(), F(Ec, oe({
      ...t,
      ...y(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || y(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, l.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (l.value = !0));
        const d = u.target;
        y(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && l.value && u.preventDefault();
      })
    }), {
      default: I(() => [X(a.$slots, "default")]),
      _: 3
    }, 16));
  }
}), um = cm, dm = /* @__PURE__ */ $({
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
    const t = n, r = e, i = Jt(), s = Ei(r), { forwardRef: o } = pe();
    return (l, a) => (O(), F(y(ho), { present: l.forceMount || y(i).open.value }, {
      default: I(() => [y(i).modal.value ? (O(), F(am, oe({
        key: 0,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...l.$attrs
      }), {
        default: I(() => [X(l.$slots, "default")]),
        _: 3
      }, 16)) : (O(), F(um, oe({
        key: 1,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...l.$attrs
      }), {
        default: I(() => [X(l.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Tc = dm, fm = /* @__PURE__ */ $({
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
    const e = Jt();
    return pc(!0), pe(), (t, r) => (O(), F(y(fe), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": y(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: I(() => [X(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), hm = fm, pm = /* @__PURE__ */ $({
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
    const e = Jt(), { forwardRef: t } = pe();
    return (r, i) => y(e)?.modal.value ? (O(), F(y(ho), {
      key: 0,
      present: r.forceMount || y(e).open.value
    }, {
      default: I(() => [z(hm, oe(r.$attrs, {
        ref: y(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: I(() => [X(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : Q("v-if", !0);
  }
}), Mc = pm, mm = /* @__PURE__ */ $({
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
    const e = /* @__PURE__ */ hc();
    return (t, r) => y(e) || t.forceMount ? (O(), F(Za, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [X(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : Q("v-if", !0);
  }
}), Oc = mm, gm = /* @__PURE__ */ $({
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
    return (t, r) => (O(), F(y(Oc), oo(lo(e)), {
      default: I(() => [X(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ac = gm, ym = /* @__PURE__ */ $({
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
    const e = n, t = Jt();
    return pe(), (r, i) => (O(), F(y(fe), oe(e, { id: y(t).titleId }), {
      default: I(() => [X(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Dc = ym;
const ml = "data-reka-collection-item";
function Xt(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = P(/* @__PURE__ */ new Map());
    i = {
      collectionRef: P(),
      itemMap: u
    }, Ln(r, i);
  } else i = wi(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${ml}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = $({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = ni();
      return se(p, () => {
        i.collectionRef.value = p.value;
      }), () => ze(Ps, {
        ref: h,
        ...f
      }, d);
    }
  }), l = $({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = ni();
      return Ue((m) => {
        if (p.value) {
          const g = Qa(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => ze(Ps, {
        ...f,
        [ml]: "",
        ref: h
      }, d);
    }
  }), a = D(() => Array.from(i.itemMap.value.values())), c = D(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: a,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: l
  };
}
const vm = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function bm(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function wm(n, e, t) {
  const r = bm(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return vm[r];
}
var xm = /* @__PURE__ */ $({
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
    return (e, t) => (O(), F(y(fe), {
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
      default: I(() => [X(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Pc = xm, Sm = /* @__PURE__ */ $({
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
    const e = n, { primitiveElement: t, currentElement: r } = ni(), i = D(() => e.checked ?? e.value);
    return se(i, (s, o) => {
      if (!r.value) return;
      const l = r.value, a = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(l, s), l.dispatchEvent(d), l.dispatchEvent(f);
      }
    }), (s, o) => (O(), F(Pc, oe({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), gl = Sm, km = /* @__PURE__ */ $({
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
    const e = n, t = D(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = D(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((i, s) => typeof i == "object" ? Object.entries(i).map(([o, l]) => ({
      name: `${e.name}[${s}][${o}]`,
      value: l
    })) : {
      name: `${e.name}[${s}]`,
      value: i
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([i, s]) => ({
      name: `${e.name}[${i}]`,
      value: s
    })) : []);
    return (i, s) => (O(), U(Ge, null, [Q(" We render single input if it's required "), t.value ? (O(), F(gl, oe({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (O(!0), U(Ge, { key: 1 }, bn(r.value, (o) => (O(), F(gl, oe({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Cm = km;
const [Nc, Em] = yt("PopperRoot");
var Tm = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = P();
    return Em({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => X(t.$slots, "default");
  }
}), Mm = Tm, Om = /* @__PURE__ */ $({
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
    const e = n, { forwardRef: t, currentElement: r } = pe(), i = Nc();
    return ec(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (O(), F(y(fe), {
      ref: y(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: I(() => [X(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Am = Om;
function Dm(n) {
  return n !== null;
}
function Pm(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, l = o ? 0 : n.arrowWidth, a = o ? 0 : n.arrowHeight, [c, u] = Ns(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (i.arrow?.x ?? 0) + l / 2, h = (i.arrow?.y ?? 0) + a / 2;
      let p = "", m = "";
      return c === "bottom" ? (p = o ? d : `${f}px`, m = `${-a}px`) : c === "top" ? (p = o ? d : `${f}px`, m = `${r.floating.height + a}px`) : c === "right" ? (p = `${-a}px`, m = o ? d : `${h}px`) : c === "left" && (p = `${r.floating.width + a}px`, m = o ? d : `${h}px`), { data: {
        x: p,
        y: m
      } };
    }
  };
}
function Ns(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Nm = ["top", "right", "bottom", "left"], Wt = Math.min, qe = Math.max, ri = Math.round, Rr = Math.floor, dt = (n) => ({
  x: n,
  y: n
}), Im = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Rm = {
  start: "end",
  end: "start"
};
function Is(n, e, t) {
  return qe(n, Wt(e, t));
}
function Et(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Tt(n) {
  return n.split("-")[0];
}
function Un(n) {
  return n.split("-")[1];
}
function po(n) {
  return n === "x" ? "y" : "x";
}
function mo(n) {
  return n === "y" ? "height" : "width";
}
const _m = /* @__PURE__ */ new Set(["top", "bottom"]);
function ut(n) {
  return _m.has(Tt(n)) ? "y" : "x";
}
function go(n) {
  return po(ut(n));
}
function Bm(n, e, t) {
  t === void 0 && (t = !1);
  const r = Un(n), i = go(n), s = mo(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = ii(o)), [o, ii(o)];
}
function Lm(n) {
  const e = ii(n);
  return [Rs(n), e, Rs(e)];
}
function Rs(n) {
  return n.replace(/start|end/g, (e) => Rm[e]);
}
const yl = ["left", "right"], vl = ["right", "left"], $m = ["top", "bottom"], zm = ["bottom", "top"];
function Fm(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? vl : yl : e ? yl : vl;
    case "left":
    case "right":
      return e ? $m : zm;
    default:
      return [];
  }
}
function Vm(n, e, t, r) {
  const i = Un(n);
  let s = Fm(Tt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(Rs)))), s;
}
function ii(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Im[e]);
}
function qm(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Ic(n) {
  return typeof n != "number" ? qm(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function si(n) {
  const {
    x: e,
    y: t,
    width: r,
    height: i
  } = n;
  return {
    width: r,
    height: i,
    top: t,
    left: e,
    right: e + r,
    bottom: t + i,
    x: e,
    y: t
  };
}
function bl(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = ut(e), o = go(e), l = mo(o), a = Tt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[l] / 2 - i[l] / 2;
  let h;
  switch (a) {
    case "top":
      h = {
        x: u,
        y: r.y - i.height
      };
      break;
    case "bottom":
      h = {
        x: u,
        y: r.y + r.height
      };
      break;
    case "right":
      h = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      h = {
        x: r.x - i.width,
        y: d
      };
      break;
    default:
      h = {
        x: r.x,
        y: r.y
      };
  }
  switch (Un(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function Wm(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
    platform: s,
    rects: o,
    elements: l,
    strategy: a
  } = n, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: h = 0
  } = Et(e, n), p = Ic(h), g = l[f ? d === "floating" ? "reference" : "floating" : d], v = si(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(l.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: a
  })), w = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l.floating)), b = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = si(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: l,
    rect: w,
    offsetParent: x,
    strategy: a
  }) : w);
  return {
    top: (v.top - k.top + p.top) / b.y,
    bottom: (k.bottom - v.bottom + p.bottom) / b.y,
    left: (v.left - k.left + p.left) / b.x,
    right: (k.right - v.right + p.right) / b.x
  };
}
const Hm = async (n, e, t) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = t, l = s.filter(Boolean), a = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: i
  }), {
    x: u,
    y: d
  } = bl(c, r, a), f = r, h = {}, p = 0;
  for (let g = 0; g < l.length; g++) {
    var m;
    const {
      name: v,
      fn: w
    } = l[g], {
      x,
      y: b,
      data: k,
      reset: C
    } = await w({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: h,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : Wm
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = x ?? u, d = b ?? d, h = {
      ...h,
      [v]: {
        ...h[v],
        ...k
      }
    }, C && p <= 50 && (p++, typeof C == "object" && (C.placement && (f = C.placement), C.rects && (c = C.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : C.rects), {
      x: u,
      y: d
    } = bl(c, f, a)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, jm = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: r,
      placement: i,
      rects: s,
      platform: o,
      elements: l,
      middlewareData: a
    } = e, {
      element: c,
      padding: u = 0
    } = Et(n, e) || {};
    if (c == null)
      return {};
    const d = Ic(u), f = {
      x: t,
      y: r
    }, h = go(i), p = mo(h), m = await o.getDimensions(c), g = h === "y", v = g ? "top" : "left", w = g ? "bottom" : "right", x = g ? "clientHeight" : "clientWidth", b = s.reference[p] + s.reference[h] - f[h] - s.floating[p], k = f[h] - s.reference[h], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let S = C ? C[x] : 0;
    (!S || !await (o.isElement == null ? void 0 : o.isElement(C))) && (S = l.floating[x] || s.floating[p]);
    const T = b / 2 - k / 2, E = S / 2 - m[p] / 2 - 1, M = Wt(d[v], E), R = Wt(d[w], E), _ = M, q = S - m[p] - R, N = S / 2 - m[p] / 2 + T, B = Is(_, N, q), ee = !a.arrow && Un(i) != null && N !== B && s.reference[p] / 2 - (N < _ ? M : R) - m[p] / 2 < 0, J = ee ? N < _ ? N - _ : N - q : 0;
    return {
      [h]: f[h] + J,
      data: {
        [h]: B,
        centerOffset: N - B - J,
        ...ee && {
          alignmentOffset: J
        }
      },
      reset: ee
    };
  }
}), Um = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, r;
      const {
        placement: i,
        middlewareData: s,
        rects: o,
        initialPlacement: l,
        platform: a,
        elements: c
      } = e, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: m = !0,
        ...g
      } = Et(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const v = Tt(i), w = ut(l), x = Tt(l) === l, b = await (a.isRTL == null ? void 0 : a.isRTL(c.floating)), k = f || (x || !m ? [ii(l)] : Lm(l)), C = p !== "none";
      !f && C && k.push(...Vm(l, m, p, b));
      const S = [l, ...k], T = await a.detectOverflow(e, g), E = [];
      let M = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && E.push(T[v]), d) {
        const N = Bm(i, o, b);
        E.push(T[N[0]], T[N[1]]);
      }
      if (M = [...M, {
        placement: i,
        overflows: E
      }], !E.every((N) => N <= 0)) {
        var R, _;
        const N = (((R = s.flip) == null ? void 0 : R.index) || 0) + 1, B = S[N];
        if (B && (!(d === "alignment" ? w !== ut(B) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((ne) => ut(ne.placement) === w ? ne.overflows[0] > 0 : !0)))
          return {
            data: {
              index: N,
              overflows: M
            },
            reset: {
              placement: B
            }
          };
        let ee = (_ = M.filter((J) => J.overflows[0] <= 0).sort((J, ne) => J.overflows[1] - ne.overflows[1])[0]) == null ? void 0 : _.placement;
        if (!ee)
          switch (h) {
            case "bestFit": {
              var q;
              const J = (q = M.filter((ne) => {
                if (C) {
                  const ce = ut(ne.placement);
                  return ce === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ce === "y";
                }
                return !0;
              }).map((ne) => [ne.placement, ne.overflows.filter((ce) => ce > 0).reduce((ce, Le) => ce + Le, 0)]).sort((ne, ce) => ne[1] - ce[1])[0]) == null ? void 0 : q[0];
              J && (ee = J);
              break;
            }
            case "initialPlacement":
              ee = l;
              break;
          }
        if (i !== ee)
          return {
            reset: {
              placement: ee
            }
          };
      }
      return {};
    }
  };
};
function wl(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function xl(n) {
  return Nm.some((e) => n[e] >= 0);
}
const Km = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: r
      } = e, {
        strategy: i = "referenceHidden",
        ...s
      } = Et(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), l = wl(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: l,
              referenceHidden: xl(l)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), l = wl(o, t.floating);
          return {
            data: {
              escapedOffsets: l,
              escaped: xl(l)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Rc = /* @__PURE__ */ new Set(["left", "top"]);
async function Jm(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Tt(t), l = Un(t), a = ut(t) === "y", c = Rc.has(o) ? -1 : 1, u = s && a ? -1 : 1, d = Et(e, n);
  let {
    mainAxis: f,
    crossAxis: h,
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
  return l && typeof p == "number" && (h = l === "end" ? p * -1 : p), a ? {
    x: h * u,
    y: f * c
  } : {
    x: f * c,
    y: h * u
  };
}
const Xm = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, r;
      const {
        x: i,
        y: s,
        placement: o,
        middlewareData: l
      } = e, a = await Jm(e, n);
      return o === ((t = l.offset) == null ? void 0 : t.placement) && (r = l.arrow) != null && r.alignmentOffset ? {} : {
        x: i + a.x,
        y: s + a.y,
        data: {
          ...a,
          placement: o
        }
      };
    }
  };
}, Ym = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: r,
        placement: i,
        platform: s
      } = e, {
        mainAxis: o = !0,
        crossAxis: l = !1,
        limiter: a = {
          fn: (v) => {
            let {
              x: w,
              y: x
            } = v;
            return {
              x: w,
              y: x
            };
          }
        },
        ...c
      } = Et(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = ut(Tt(i)), h = po(f);
      let p = u[h], m = u[f];
      if (o) {
        const v = h === "y" ? "top" : "left", w = h === "y" ? "bottom" : "right", x = p + d[v], b = p - d[w];
        p = Is(x, p, b);
      }
      if (l) {
        const v = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", x = m + d[v], b = m - d[w];
        m = Is(x, m, b);
      }
      const g = a.fn({
        ...e,
        [h]: p,
        [f]: m
      });
      return {
        ...g,
        data: {
          x: g.x - t,
          y: g.y - r,
          enabled: {
            [h]: o,
            [f]: l
          }
        }
      };
    }
  };
}, Gm = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: r,
        placement: i,
        rects: s,
        middlewareData: o
      } = e, {
        offset: l = 0,
        mainAxis: a = !0,
        crossAxis: c = !0
      } = Et(n, e), u = {
        x: t,
        y: r
      }, d = ut(i), f = po(d);
      let h = u[f], p = u[d];
      const m = Et(l, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (a) {
        const x = f === "y" ? "height" : "width", b = s.reference[f] - s.floating[x] + g.mainAxis, k = s.reference[f] + s.reference[x] - g.mainAxis;
        h < b ? h = b : h > k && (h = k);
      }
      if (c) {
        var v, w;
        const x = f === "y" ? "width" : "height", b = Rc.has(Tt(i)), k = s.reference[d] - s.floating[x] + (b && ((v = o.offset) == null ? void 0 : v[d]) || 0) + (b ? 0 : g.crossAxis), C = s.reference[d] + s.reference[x] + (b ? 0 : ((w = o.offset) == null ? void 0 : w[d]) || 0) - (b ? g.crossAxis : 0);
        p < k ? p = k : p > C && (p = C);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, Zm = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, r;
      const {
        placement: i,
        rects: s,
        platform: o,
        elements: l
      } = e, {
        apply: a = () => {
        },
        ...c
      } = Et(n, e), u = await o.detectOverflow(e, c), d = Tt(i), f = Un(i), h = ut(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, v;
      d === "top" || d === "bottom" ? (g = d, v = f === (await (o.isRTL == null ? void 0 : o.isRTL(l.floating)) ? "start" : "end") ? "left" : "right") : (v = d, g = f === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, x = p - u.left - u.right, b = Wt(m - u[g], w), k = Wt(p - u[v], x), C = !e.middlewareData.shift;
      let S = b, T = k;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (T = x), (r = e.middlewareData.shift) != null && r.enabled.y && (S = w), C && !f) {
        const M = qe(u.left, 0), R = qe(u.right, 0), _ = qe(u.top, 0), q = qe(u.bottom, 0);
        h ? T = p - 2 * (M !== 0 || R !== 0 ? M + R : qe(u.left, u.right)) : S = m - 2 * (_ !== 0 || q !== 0 ? _ + q : qe(u.top, u.bottom));
      }
      await a({
        ...e,
        availableWidth: T,
        availableHeight: S
      });
      const E = await o.getDimensions(l.floating);
      return p !== E.width || m !== E.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Ti() {
  return typeof window < "u";
}
function wn(n) {
  return yo(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function He(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function vt(n) {
  var e;
  return (e = (yo(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function yo(n) {
  return Ti() ? n instanceof Node || n instanceof He(n).Node : !1;
}
function st(n) {
  return Ti() ? n instanceof Element || n instanceof He(n).Element : !1;
}
function ht(n) {
  return Ti() ? n instanceof HTMLElement || n instanceof He(n).HTMLElement : !1;
}
function Sl(n) {
  return !Ti() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof He(n).ShadowRoot;
}
const Qm = /* @__PURE__ */ new Set(["inline", "contents"]);
function Tr(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = ot(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !Qm.has(i);
}
const eg = /* @__PURE__ */ new Set(["table", "td", "th"]);
function tg(n) {
  return eg.has(wn(n));
}
const ng = [":popover-open", ":modal"];
function Mi(n) {
  return ng.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const rg = ["transform", "translate", "scale", "rotate", "perspective"], ig = ["transform", "translate", "scale", "rotate", "perspective", "filter"], sg = ["paint", "layout", "strict", "content"];
function vo(n) {
  const e = bo(), t = st(n) ? ot(n) : n;
  return rg.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || ig.some((r) => (t.willChange || "").includes(r)) || sg.some((r) => (t.contain || "").includes(r));
}
function og(n) {
  let e = Ht(n);
  for (; ht(e) && !$n(e); ) {
    if (vo(e))
      return e;
    if (Mi(e))
      return null;
    e = Ht(e);
  }
  return null;
}
function bo() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const lg = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function $n(n) {
  return lg.has(wn(n));
}
function ot(n) {
  return He(n).getComputedStyle(n);
}
function Oi(n) {
  return st(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ht(n) {
  if (wn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Sl(n) && n.host || // Fallback.
    vt(n)
  );
  return Sl(e) ? e.host : e;
}
function _c(n) {
  const e = Ht(n);
  return $n(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : ht(e) && Tr(e) ? e : _c(e);
}
function fr(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = _c(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = He(i);
  if (s) {
    const l = _s(o);
    return e.concat(o, o.visualViewport || [], Tr(i) ? i : [], l && t ? fr(l) : []);
  }
  return e.concat(i, fr(i, [], t));
}
function _s(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Bc(n) {
  const e = ot(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = ht(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, l = ri(t) !== s || ri(r) !== o;
  return l && (t = s, r = o), {
    width: t,
    height: r,
    $: l
  };
}
function wo(n) {
  return st(n) ? n : n.contextElement;
}
function Rn(n) {
  const e = wo(n);
  if (!ht(e))
    return dt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Bc(e);
  let o = (s ? ri(t.width) : t.width) / r, l = (s ? ri(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: o,
    y: l
  };
}
const ag = /* @__PURE__ */ dt(0);
function Lc(n) {
  const e = He(n);
  return !bo() || !e.visualViewport ? ag : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function cg(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== He(n) ? !1 : e;
}
function hn(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = wo(n);
  let o = dt(1);
  e && (r ? st(r) && (o = Rn(r)) : o = Rn(n));
  const l = cg(s, t, r) ? Lc(s) : dt(0);
  let a = (i.left + l.x) / o.x, c = (i.top + l.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = He(s), h = r && st(r) ? He(r) : r;
    let p = f, m = _s(p);
    for (; m && r && h !== p; ) {
      const g = Rn(m), v = m.getBoundingClientRect(), w = ot(m), x = v.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, b = v.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      a *= g.x, c *= g.y, u *= g.x, d *= g.y, a += x, c += b, p = He(m), m = _s(p);
    }
  }
  return si({
    width: u,
    height: d,
    x: a,
    y: c
  });
}
function Ai(n, e) {
  const t = Oi(n).scrollLeft;
  return e ? e.left + t : hn(vt(n)).left + t;
}
function $c(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Ai(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function ug(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = vt(r), l = e ? Mi(e.floating) : !1;
  if (r === o || l && s)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = dt(1);
  const u = dt(0), d = ht(r);
  if ((d || !d && !s) && ((wn(r) !== "body" || Tr(o)) && (a = Oi(r)), ht(r))) {
    const h = hn(r);
    c = Rn(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? $c(o, a) : dt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - a.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - a.scrollTop * c.y + u.y + f.y
  };
}
function dg(n) {
  return Array.from(n.getClientRects());
}
function fg(n) {
  const e = vt(n), t = Oi(n), r = n.ownerDocument.body, i = qe(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = qe(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Ai(n);
  const l = -t.scrollTop;
  return ot(r).direction === "rtl" && (o += qe(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: l
  };
}
const kl = 25;
function hg(n, e) {
  const t = He(n), r = vt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, l = 0, a = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = bo();
    (!u || u && e === "fixed") && (l = i.offsetLeft, a = i.offsetTop);
  }
  const c = Ai(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= kl && (s -= p);
  } else c <= kl && (s += c);
  return {
    width: s,
    height: o,
    x: l,
    y: a
  };
}
const pg = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function mg(n, e) {
  const t = hn(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = ht(n) ? Rn(n) : dt(1), o = n.clientWidth * s.x, l = n.clientHeight * s.y, a = i * s.x, c = r * s.y;
  return {
    width: o,
    height: l,
    x: a,
    y: c
  };
}
function Cl(n, e, t) {
  let r;
  if (e === "viewport")
    r = hg(n, t);
  else if (e === "document")
    r = fg(vt(n));
  else if (st(e))
    r = mg(e, t);
  else {
    const i = Lc(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return si(r);
}
function zc(n, e) {
  const t = Ht(n);
  return t === e || !st(t) || $n(t) ? !1 : ot(t).position === "fixed" || zc(t, e);
}
function gg(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = fr(n, [], !1).filter((l) => st(l) && wn(l) !== "body"), i = null;
  const s = ot(n).position === "fixed";
  let o = s ? Ht(n) : n;
  for (; st(o) && !$n(o); ) {
    const l = ot(o), a = vo(o);
    !a && l.position === "fixed" && (i = null), (s ? !a && !i : !a && l.position === "static" && !!i && pg.has(i.position) || Tr(o) && !a && zc(n, o)) ? r = r.filter((u) => u !== o) : i = l, o = Ht(o);
  }
  return e.set(n, r), r;
}
function yg(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Mi(e) ? [] : gg(e, this._c) : [].concat(t), r], l = o[0], a = o.reduce((c, u) => {
    const d = Cl(e, u, i);
    return c.top = qe(d.top, c.top), c.right = Wt(d.right, c.right), c.bottom = Wt(d.bottom, c.bottom), c.left = qe(d.left, c.left), c;
  }, Cl(e, l, i));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function vg(n) {
  const {
    width: e,
    height: t
  } = Bc(n);
  return {
    width: e,
    height: t
  };
}
function bg(n, e, t) {
  const r = ht(e), i = vt(e), s = t === "fixed", o = hn(n, !0, s, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = dt(0);
  function c() {
    a.x = Ai(i);
  }
  if (r || !r && !s)
    if ((wn(e) !== "body" || Tr(i)) && (l = Oi(e)), r) {
      const h = hn(e, !0, s, e);
      a.x = h.x + e.clientLeft, a.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? $c(i, l) : dt(0), d = o.left + l.scrollLeft - a.x - u.x, f = o.top + l.scrollTop - a.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function ts(n) {
  return ot(n).position === "static";
}
function El(n, e) {
  if (!ht(n) || ot(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return vt(n) === t && (t = t.ownerDocument.body), t;
}
function Fc(n, e) {
  const t = He(n);
  if (Mi(n))
    return t;
  if (!ht(n)) {
    let i = Ht(n);
    for (; i && !$n(i); ) {
      if (st(i) && !ts(i))
        return i;
      i = Ht(i);
    }
    return t;
  }
  let r = El(n, e);
  for (; r && tg(r) && ts(r); )
    r = El(r, e);
  return r && $n(r) && ts(r) && !vo(r) ? t : r || og(n) || t;
}
const wg = async function(n) {
  const e = this.getOffsetParent || Fc, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: bg(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function xg(n) {
  return ot(n).direction === "rtl";
}
const Sg = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ug,
  getDocumentElement: vt,
  getClippingRect: yg,
  getOffsetParent: Fc,
  getElementRects: wg,
  getClientRects: dg,
  getDimensions: vg,
  getScale: Rn,
  isElement: st,
  isRTL: xg
};
function Vc(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function kg(n, e) {
  let t = null, r;
  const i = vt(n);
  function s() {
    var l;
    clearTimeout(r), (l = t) == null || l.disconnect(), t = null;
  }
  function o(l, a) {
    l === void 0 && (l = !1), a === void 0 && (a = 1), s();
    const c = n.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: h
    } = c;
    if (l || e(), !f || !h)
      return;
    const p = Rr(d), m = Rr(i.clientWidth - (u + f)), g = Rr(i.clientHeight - (d + h)), v = Rr(u), x = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -v + "px",
      threshold: qe(0, Wt(1, a)) || 1
    };
    let b = !0;
    function k(C) {
      const S = C[0].intersectionRatio;
      if (S !== a) {
        if (!b)
          return o();
        S ? o(!1, S) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      S === 1 && !Vc(c, n.getBoundingClientRect()) && o(), b = !1;
    }
    try {
      t = new IntersectionObserver(k, {
        ...x,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(k, x);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function Cg(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = r, c = wo(n), u = i || s ? [...c ? fr(c) : [], ...fr(e)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", t, {
      passive: !0
    }), s && v.addEventListener("resize", t);
  });
  const d = c && l ? kg(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((v) => {
    let [w] = v;
    w && w.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = h) == null || x.observe(e);
    })), t();
  }), c && !a && h.observe(c), h.observe(e));
  let p, m = a ? hn(n) : null;
  a && g();
  function g() {
    const v = hn(n);
    m && !Vc(m, v) && t(), m = v, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var v;
    u.forEach((w) => {
      i && w.removeEventListener("scroll", t), s && w.removeEventListener("resize", t);
    }), d?.(), (v = h) == null || v.disconnect(), h = null, a && cancelAnimationFrame(p);
  };
}
const Eg = Xm, Tg = Ym, Tl = Um, Mg = Zm, Og = Km, Ag = jm, Dg = Gm, Pg = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: Sg,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return Hm(n, e, {
    ...i,
    platform: s
  });
};
function Ng(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Bs(n) {
  if (Ng(n)) {
    const e = n.$el;
    return yo(e) && wn(e) === "#comment" ? null : e;
  }
  return n;
}
function Dn(n) {
  return typeof n == "function" ? n() : y(n);
}
function Ig(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Bs(Dn(n.element));
      return t == null ? {} : Ag({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function qc(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ml(n, e) {
  const t = qc(n);
  return Math.round(e * t) / t;
}
function Rg(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = D(() => {
    var S;
    return (S = Dn(t.open)) != null ? S : !0;
  }), s = D(() => Dn(t.middleware)), o = D(() => {
    var S;
    return (S = Dn(t.placement)) != null ? S : "bottom";
  }), l = D(() => {
    var S;
    return (S = Dn(t.strategy)) != null ? S : "absolute";
  }), a = D(() => {
    var S;
    return (S = Dn(t.transform)) != null ? S : !0;
  }), c = D(() => Bs(n.value)), u = D(() => Bs(e.value)), d = P(0), f = P(0), h = P(l.value), p = P(o.value), m = fn({}), g = P(!1), v = D(() => {
    const S = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return S;
    const T = Ml(u.value, d.value), E = Ml(u.value, f.value);
    return a.value ? {
      ...S,
      transform: "translate(" + T + "px, " + E + "px)",
      ...qc(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: T + "px",
      top: E + "px"
    };
  });
  let w;
  function x() {
    if (c.value == null || u.value == null)
      return;
    const S = i.value;
    Pg(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: l.value
    }).then((T) => {
      d.value = T.x, f.value = T.y, h.value = T.strategy, p.value = T.placement, m.value = T.middlewareData, g.value = S !== !1;
    });
  }
  function b() {
    typeof w == "function" && (w(), w = void 0);
  }
  function k() {
    if (b(), r === void 0) {
      x();
      return;
    }
    if (c.value != null && u.value != null) {
      w = r(c.value, u.value, x);
      return;
    }
  }
  function C() {
    i.value || (g.value = !1);
  }
  return se([s, o, l, i], x, {
    flush: "sync"
  }), se([c, u], k, {
    flush: "sync"
  }), se(i, C, {
    flush: "sync"
  }), Ja() && Xa(b), {
    x: En(d),
    y: En(f),
    strategy: En(h),
    placement: En(p),
    middlewareData: En(m),
    isPositioned: En(g),
    floatingStyles: v,
    update: x
  };
}
const _g = {
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
}, [X1, Bg] = yt("PopperContent");
var Lg = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Ef({
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
  }, { ..._g }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Nc(), { forwardRef: s, currentElement: o } = pe(), l = P(), a = P(), { width: c, height: u } = Rp(a), d = D(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = D(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = D(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = D(() => ({
      padding: f.value,
      boundary: h.value.filter(Dm),
      altBoundary: h.value.length > 0
    })), m = D(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = lp(() => [
      Eg({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Tl({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && Tg({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? Dg() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Tl({
        ...p.value,
        ...m.value
      }),
      Mg({
        ...p.value,
        apply: ({ elements: _, rects: q, availableWidth: N, availableHeight: B }) => {
          const { width: ee, height: J } = q.reference, ne = _.floating.style;
          ne.setProperty("--reka-popper-available-width", `${N}px`), ne.setProperty("--reka-popper-available-height", `${B}px`), ne.setProperty("--reka-popper-anchor-width", `${ee}px`), ne.setProperty("--reka-popper-anchor-height", `${J}px`);
        }
      }),
      a.value && Ig({
        element: a.value,
        padding: t.arrowPadding
      }),
      Pm({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && Og({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), v = D(() => t.reference ?? i.anchor.value), { floatingStyles: w, placement: x, isPositioned: b, middlewareData: k } = Rg(v, l, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (..._) => Cg(..._, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), C = D(() => Ns(x.value)[0]), S = D(() => Ns(x.value)[1]);
    ec(() => {
      b.value && r("placed");
    });
    const T = D(() => {
      const _ = k.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && _;
    }), E = P("");
    Ue(() => {
      o.value && (E.value = window.getComputedStyle(o.value).zIndex);
    });
    const M = D(() => k.value.arrow?.x ?? 0), R = D(() => k.value.arrow?.y ?? 0);
    return Bg({
      placedSide: C,
      onArrowChange: (_) => a.value = _,
      arrowX: M,
      arrowY: R,
      shouldHideArrow: T
    }), (_, q) => (O(), U("div", {
      ref_key: "floatingRef",
      ref: l,
      "data-reka-popper-content-wrapper": "",
      style: vn({
        ...y(w),
        transform: y(b) ? y(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: E.value,
        "--reka-popper-transform-origin": [y(k).transformOrigin?.x, y(k).transformOrigin?.y].join(" "),
        ...y(k).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [z(y(fe), oe({ ref: y(s) }, _.$attrs, {
      "as-child": t.asChild,
      as: _.as,
      "data-side": C.value,
      "data-align": S.value,
      style: { animation: y(b) ? void 0 : "none" }
    }), {
      default: I(() => [X(_.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), $g = Lg;
function zg(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => rr(r, e, t)) : rr(n, e, t);
}
function rr(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : ei(n, e);
}
const [Wc, Fg] = yt("ListboxRoot");
var Vg = /* @__PURE__ */ $({
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
    const r = n, i = t, { multiple: s, highlightOnHover: o, orientation: l, disabled: a, selectionBehavior: c, dir: u } = jn(r), { getItems: d } = Xt({ isProvider: !0 }), { handleTypeaheadSearch: f } = fo(), { primitiveElement: h, currentElement: p } = ni(), m = Ip(), g = gc(u), v = yc(p), w = P(), x = P(!1), b = P(!0), k = /* @__PURE__ */ ti(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function C(V) {
      if (x.value = !0, r.multiple) {
        const j = Array.isArray(k.value) ? [...k.value] : [], Y = j.findIndex((re) => rr(re, V, r.by));
        r.selectionBehavior === "toggle" ? (Y === -1 ? j.push(V) : j.splice(Y, 1), k.value = j) : (k.value = [V], w.value = V);
      } else r.selectionBehavior === "toggle" && rr(k.value, V, r.by) ? k.value = void 0 : k.value = V;
      setTimeout(() => {
        x.value = !1;
      }, 1);
    }
    const S = P(null), T = P(null), E = P(!1), M = P(!1), R = /* @__PURE__ */ Ji(), _ = /* @__PURE__ */ Ji(), q = /* @__PURE__ */ Ji();
    function N() {
      return d().map((V) => V.ref).filter((V) => V.dataset.disabled !== "");
    }
    function B(V, j = !0) {
      if (!V) return;
      S.value = V, b.value && S.value.focus(), j && S.value.scrollIntoView({ block: "nearest" });
      const Y = d().find((re) => re.ref === V);
      i("highlight", Y);
    }
    function ee(V) {
      if (E.value) q.trigger(V);
      else {
        const j = d().find((Y) => rr(Y.value, V, r.by));
        j && (S.value = j.ref, B(j.ref));
      }
    }
    function J(V) {
      S.value && S.value.isConnected && (V.preventDefault(), V.stopPropagation(), M.value || S.value.click());
    }
    function ne(V) {
      if (b.value) {
        if (x.value = !0, E.value) _.trigger(V);
        else {
          const j = V.altKey || V.ctrlKey || V.metaKey;
          if (j && V.key === "a" && s.value) {
            const Y = d(), re = Y.map((lt) => lt.value);
            k.value = [...re], V.preventDefault(), B(Y[Y.length - 1].ref);
          } else if (!j) {
            const Y = f(V.key, d());
            Y && B(Y);
          }
        }
        setTimeout(() => {
          x.value = !1;
        }, 1);
      }
    }
    function ce() {
      M.value = !0;
    }
    function Le() {
      ge(() => {
        M.value = !1;
      });
    }
    function kn() {
      ge(() => {
        const V = new KeyboardEvent("keydown", { key: "PageUp" });
        Zt(V);
      });
    }
    function tt(V) {
      const j = S.value;
      j?.isConnected && (T.value = j), S.value = null, i("leave", V);
    }
    function Cn(V) {
      const j = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (V.currentTarget?.dispatchEvent(j), i("entryFocus", j), !j.defaultPrevented)
        if (T.value) B(T.value);
        else {
          const Y = N()?.[0];
          B(Y);
        }
    }
    function Zt(V) {
      const j = wm(V, l.value, g.value);
      if (!j) return;
      let Y = N();
      if (S.value) {
        if (j === "last") Y.reverse();
        else if (j === "prev" || j === "next") {
          j === "prev" && Y.reverse();
          const re = Y.indexOf(S.value);
          Y = Y.slice(re + 1);
        }
        Wi(V, Y[0]);
      }
      if (Y.length) {
        const re = !S.value && j === "prev" ? Y.length - 1 : 0;
        B(Y[re]);
      }
      if (E.value) return _.trigger(V);
    }
    function Wi(V, j) {
      if (!(E.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(k.value) || (V.altKey || V.ctrlKey || V.metaKey) && !V.shiftKey) && V.shiftKey) {
        const re = d().filter((bt) => bt.ref.dataset.disabled !== "");
        let lt = re.find((bt) => bt.ref === j)?.value;
        if (V.key === m.END ? lt = re[re.length - 1].value : V.key === m.HOME && (lt = re[0].value), !lt || !w.value) return;
        const Jn = op(re.map((bt) => bt.value), w.value, lt);
        k.value = Jn;
      }
    }
    async function Hi(V) {
      if (await ge(), E.value) R.trigger(V);
      else {
        const j = N(), Y = j.find((re) => re.dataset.state === "checked");
        Y ? B(Y) : j.length && B(j[0]);
      }
    }
    return se(k, () => {
      x.value || ge(() => {
        Hi();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: S,
      highlightItem: ee,
      highlightFirstItem: kn,
      highlightSelected: Hi,
      getItems: d
    }), Fg({
      modelValue: k,
      onValueChange: C,
      multiple: s,
      orientation: l,
      dir: g,
      disabled: a,
      highlightOnHover: o,
      highlightedElement: S,
      isVirtual: E,
      virtualFocusHook: R,
      virtualKeydownHook: _,
      virtualHighlightHook: q,
      by: r.by,
      firstValue: w,
      selectionBehavior: c,
      focusable: b,
      onLeave: tt,
      onEnter: Cn,
      changeHighlight: B,
      onKeydownEnter: J,
      onKeydownNavigation: Zt,
      onKeydownTypeAhead: ne,
      onCompositionStart: ce,
      onCompositionEnd: Le,
      highlightFirstItem: kn
    }), (V, j) => (O(), F(y(fe), {
      ref_key: "primitiveElement",
      ref: h,
      as: V.as,
      "as-child": V.asChild,
      dir: y(g),
      "data-disabled": y(a) ? "" : void 0,
      onPointerleave: tt,
      onFocusout: j[0] || (j[0] = async (Y) => {
        const re = Y.relatedTarget || Y.target;
        await ge(), S.value && y(p) && !y(p).contains(re) && tt(Y);
      })
    }, {
      default: I(() => [X(V.$slots, "default", { modelValue: y(k) }), y(v) && V.name ? (O(), F(y(Cm), {
        key: 0,
        name: V.name,
        value: y(k),
        disabled: y(a),
        required: V.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : Q("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), qg = Vg, Wg = /* @__PURE__ */ $({
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
    const { CollectionSlot: e } = Xt(), t = Wc(), r = dc(!1, 10);
    return (i, s) => (O(), F(y(e), null, {
      default: I(() => [z(y(fe), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: y(t).focusable.value ? y(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": y(t).orientation.value,
        "aria-multiselectable": !!y(t).multiple.value,
        "data-orientation": y(t).orientation.value,
        onMousedown: s[0] || (s[0] = on((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          y(r) || y(t).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = Ts((o) => {
            y(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || y(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), y(t).focusable.value && y(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Ts(y(t).onKeydownEnter, ["enter"]),
          y(t).onKeydownTypeAhead
        ]
      }, {
        default: I(() => [X(i.$slots, "default")]),
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
}), Hg = Wg;
const jg = "listbox.select", [Ug, Kg] = yt("ListboxItem");
var Jg = /* @__PURE__ */ $({
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
    const t = n, r = e, i = dr(void 0, "reka-listbox-item"), { CollectionItem: s } = Xt(), { forwardRef: o, currentElement: l } = pe(), a = Wc(), c = D(() => l.value === a.highlightedElement.value), u = D(() => zg(a.modelValue.value, t.value, a.by)), d = D(() => a.disabled.value || t.disabled);
    async function f(p) {
      r("select", p), !p?.defaultPrevented && !d.value && p && (a.onValueChange(t.value), a.changeHighlight(l.value));
    }
    function h(p) {
      const m = {
        originalEvent: p,
        value: t.value
      };
      xi(jg, f, m);
    }
    return Kg({ isSelected: u }), (p, m) => (O(), F(y(s), { value: p.value }, {
      default: I(() => [Tf([c.value, u.value], () => z(y(fe), oe({ id: y(i) }, p.$attrs, {
        ref: y(o),
        role: "option",
        tabindex: y(a).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: p.as,
        "as-child": p.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: h,
        onKeydown: Ts(on(h, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          y(a).highlightedElement.value !== y(l) && y(a).highlightOnHover.value && !y(a).focusable.value && y(a).changeHighlight(y(l), !1);
        })
      }), {
        default: I(() => [X(p.$slots, "default")]),
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
      ]), m, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Xg = Jg, Yg = /* @__PURE__ */ $({
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
    pe();
    const t = Ug();
    return (r, i) => y(t).isSelected.value ? (O(), F(y(fe), oe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [X(r.$slots, "default")]),
      _: 3
    }, 16)) : Q("v-if", !0);
  }
}), Gg = Yg;
function Zg(n) {
  const e = Si({ nonce: P() });
  return D(() => n?.value || e.nonce?.value);
}
const Qg = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], ey = [" ", "Enter"], nt = 10;
function hr(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => Ls(r, e, t)) : Ls(n, e, t);
}
function Ls(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : ei(n, e);
}
function ty(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const ny = {
  key: 0,
  value: ""
}, [Yt, Hc] = yt("SelectRoot");
var ry = /* @__PURE__ */ $({
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
    const t = n, r = e, { required: i, disabled: s, multiple: o, dir: l } = jn(t), a = /* @__PURE__ */ ti(t, "modelValue", r, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ ti(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), u = P(), d = P(), f = P({
      x: 0,
      y: 0
    }), h = D(() => o.value && Array.isArray(a.value) ? a.value?.length === 0 : As(a.value));
    Xt({ isProvider: !0 });
    const p = gc(l), m = yc(u), g = P(/* @__PURE__ */ new Set()), v = D(() => Array.from(g.value).map((b) => b.value).join(";"));
    function w(b) {
      if (o.value) {
        const k = Array.isArray(a.value) ? [...a.value] : [], C = k.findIndex((S) => Ls(S, b, t.by));
        C === -1 ? k.push(b) : k.splice(C, 1), a.value = [...k];
      } else a.value = b;
    }
    function x(b) {
      return Array.from(g.value).find((k) => hr(b, k.value, t.by));
    }
    return Hc({
      triggerElement: u,
      onTriggerChange: (b) => {
        u.value = b;
      },
      valueElement: d,
      onValueElementChange: (b) => {
        d.value = b;
      },
      contentId: "",
      modelValue: a,
      onValueChange: w,
      by: t.by,
      open: c,
      multiple: o,
      required: i,
      onOpenChange: (b) => {
        c.value = b;
      },
      dir: p,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: h,
      optionsSet: g,
      onOptionAdd: (b) => {
        const k = x(b.value);
        k && g.value.delete(k), g.value.add(b);
      },
      onOptionRemove: (b) => {
        const k = x(b.value);
        k && g.value.delete(k);
      }
    }), (b, k) => (O(), F(y(Mm), null, {
      default: I(() => [X(b.$slots, "default", {
        modelValue: y(a),
        open: y(c)
      }), y(m) ? (O(), F(oy, {
        key: v.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: y(o),
        required: y(i),
        name: b.name,
        autocomplete: b.autocomplete,
        disabled: y(s),
        value: y(a)
      }, {
        default: I(() => [y(As)(y(a)) ? (O(), U("option", ny)) : Q("v-if", !0), (O(!0), U(Ge, null, bn(Array.from(g.value), (C) => (O(), U("option", oe({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : Q("v-if", !0)]),
      _: 3
    }));
  }
}), iy = ry, sy = /* @__PURE__ */ $({
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
    const e = n, t = P(), r = Yt();
    se(() => e.value, (s, o) => {
      const l = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (s !== o && c && t.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(t.value, s), t.value.dispatchEvent(u);
      }
    });
    function i(s) {
      r.onValueChange(s.target.value);
    }
    return (s, o) => (O(), F(y(Pc), { "as-child": "" }, {
      default: I(() => [K("select", oe({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: i }), [X(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), oy = sy, ly = /* @__PURE__ */ $({
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
      default: nt
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
    const t = uo(n);
    return (r, i) => (O(), F(y($g), oe(y(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: I(() => [X(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ay = ly;
const cy = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Di, jc] = yt("SelectContent");
var uy = /* @__PURE__ */ $({
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
    const t = n, r = e, i = Yt();
    Tp(), pc(t.bodyLock);
    const { CollectionSlot: s, getItems: o } = Xt(), l = P();
    bc(l);
    const { search: a, handleTypeaheadSearch: c } = fo(), u = P(), d = P(), f = P(), h = P(!1), p = P(!1), m = P(!1);
    function g() {
      d.value && l.value && pl([d.value, l.value]);
    }
    se(h, () => {
      g();
    });
    const { onOpenChange: v, triggerPointerDownPosRef: w } = i;
    Ue((C) => {
      if (!l.value) return;
      let S = {
        x: 0,
        y: 0
      };
      const T = (M) => {
        S = {
          x: Math.abs(Math.round(M.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(M.pageY) - (w.value?.y ?? 0))
        };
      }, E = (M) => {
        M.pointerType !== "touch" && (S.x <= 10 && S.y <= 10 ? M.preventDefault() : l.value?.contains(M.target) || v(!1), document.removeEventListener("pointermove", T), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", T), document.addEventListener("pointerup", E, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", E, { capture: !0 });
      });
    });
    function x(C) {
      const S = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !S && C.key.length === 1 && c(C.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let E = [...o().map((M) => M.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (E = E.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const M = C.target, R = E.indexOf(M);
          E = E.slice(R + 1);
        }
        setTimeout(() => pl(E)), C.preventDefault();
      }
    }
    const b = D(() => t.position === "popper" ? t : {}), k = uo(b.value);
    return jc({
      content: l,
      viewport: u,
      onViewportChange: (C) => {
        u.value = C;
      },
      itemRefCallback: (C, S, T) => {
        const E = !p.value && !T, M = hr(i.modelValue.value, S, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (M || E) && (d.value = C, M && (m.value = !0));
        } else (M || E) && (d.value = C);
        E && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        l.value?.focus();
      },
      itemTextRefCallback: (C, S, T) => {
        const E = !p.value && !T;
        (hr(i.modelValue.value, S, i.by) || E) && (f.value = C);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: h,
      searchRef: a
    }), (C, S) => (O(), F(y(s), null, {
      default: I(() => [z(y(Cc), {
        "as-child": "",
        onMountAutoFocus: S[6] || (S[6] = on(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: S[7] || (S[7] = (T) => {
          r("closeAutoFocus", T), !T.defaultPrevented && (y(i).triggerElement.value?.focus({ preventScroll: !0 }), T.preventDefault());
        })
      }, {
        default: I(() => [z(y(Sc), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: S[2] || (S[2] = on(() => {
          }, ["prevent"])),
          onDismiss: S[3] || (S[3] = (T) => y(i).onOpenChange(!1)),
          onEscapeKeyDown: S[4] || (S[4] = (T) => r("escapeKeyDown", T)),
          onPointerDownOutside: S[5] || (S[5] = (T) => r("pointerDownOutside", T))
        }, {
          default: I(() => [(O(), F(Mf(C.position === "popper" ? ay : my), oe({
            ...C.$attrs,
            ...y(k)
          }, {
            id: y(i).contentId,
            ref: (T) => {
              const E = y(ft)(T);
              E?.hasAttribute("data-reka-popper-content-wrapper") ? l.value = E.firstElementChild : l.value = E;
            },
            role: "listbox",
            "data-state": y(i).open.value ? "open" : "closed",
            dir: y(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: S[0] || (S[0] = on(() => {
            }, ["prevent"])),
            onPlaced: S[1] || (S[1] = (T) => h.value = !0),
            onKeydown: x
          }), {
            default: I(() => [X(C.$slots, "default")]),
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
}), dy = uy;
const [fy, hy] = yt("SelectItemAlignedPosition");
var py = /* @__PURE__ */ $({
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
    const t = n, r = e, { getItems: i } = Xt(), s = Yt(), o = Di(), l = P(!1), a = P(!0), c = P(), { forwardRef: u, currentElement: d } = pe(), { viewport: f, selectedItem: h, selectedItemText: p, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && h?.value && p?.value) {
        const x = s.triggerElement.value.getBoundingClientRect(), b = d.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const V = C.left - b.left, j = k.left - V, Y = x.left - j, re = x.width + Y, lt = Math.max(re, b.width), Jn = window.innerWidth - nt, bt = al(j, nt, Math.max(nt, Jn - lt));
          c.value.style.minWidth = `${re}px`, c.value.style.left = `${bt}px`;
        } else {
          const V = b.right - C.right, j = window.innerWidth - k.right - V, Y = window.innerWidth - x.right - j, re = x.width + Y, lt = Math.max(re, b.width), Jn = window.innerWidth - nt, bt = al(j, nt, Math.max(nt, Jn - lt));
          c.value.style.minWidth = `${re}px`, c.value.style.right = `${bt}px`;
        }
        const S = i().map((V) => V.ref), T = window.innerHeight - nt * 2, E = f.value.scrollHeight, M = window.getComputedStyle(d.value), R = Number.parseInt(M.borderTopWidth, 10), _ = Number.parseInt(M.paddingTop, 10), q = Number.parseInt(M.borderBottomWidth, 10), N = Number.parseInt(M.paddingBottom, 10), B = R + _ + E + N + q, ee = Math.min(h.value.offsetHeight * 5, B), J = window.getComputedStyle(f.value), ne = Number.parseInt(J.paddingTop, 10), ce = Number.parseInt(J.paddingBottom, 10), Le = x.top + x.height / 2 - nt, kn = T - Le, tt = h.value.offsetHeight / 2, Cn = h.value.offsetTop + tt, Zt = R + _ + Cn, Wi = B - Zt;
        if (Zt <= Le) {
          const V = h.value === S[S.length - 1];
          c.value.style.bottom = "0px";
          const j = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, Y = Math.max(kn, tt + (V ? ce : 0) + j + q), re = Zt + Y;
          c.value.style.height = `${re}px`;
        } else {
          const V = h.value === S[0];
          c.value.style.top = "0px";
          const Y = Math.max(Le, R + f.value.offsetTop + (V ? ne : 0) + tt) + Wi;
          c.value.style.height = `${Y}px`, f.value.scrollTop = Zt - Le + f.value.offsetTop;
        }
        c.value.style.margin = `${nt}px 0`, c.value.style.minHeight = `${ee}px`, c.value.style.maxHeight = `${T}px`, r("placed"), requestAnimationFrame(() => l.value = !0);
      }
    }
    const v = P("");
    xe(async () => {
      await ge(), g(), d.value && (v.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(x) {
      x && a.value === !0 && (g(), m?.(), a.value = !1);
    }
    return xp(s.triggerElement, () => {
      g();
    }), hy({
      contentWrapper: c,
      shouldExpandOnScrollRef: l,
      onScrollButtonChange: w
    }), (x, b) => (O(), U("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: vn({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: v.value
      })
    }, [z(y(fe), oe({
      ref: y(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...x.$attrs,
      ...t
    }), {
      default: I(() => [X(x.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), my = py, gy = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Hc(n.context), jc(cy), (t, r) => X(t.$slots, "default");
  }
}), yy = gy;
const vy = { key: 1 };
var by = /* @__PURE__ */ $({
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
    const t = n, i = Mp(t, e), s = Yt(), o = P();
    xe(() => {
      o.value = new DocumentFragment();
    });
    const l = P(), a = D(() => t.forceMount || s.open.value), c = P(a.value);
    return se(a, () => {
      setTimeout(() => c.value = a.value);
    }), (u, d) => a.value || c.value || l.value?.present ? (O(), F(y(ho), {
      key: 0,
      ref_key: "presenceRef",
      ref: l,
      present: a.value
    }, {
      default: I(() => [z(dy, oo(lo({
        ...y(i),
        ...u.$attrs
      })), {
        default: I(() => [X(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (O(), U("div", vy, [(O(), F(Za, { to: o.value }, [z(yy, { context: y(s) }, {
      default: I(() => [X(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : Q("v-if", !0);
  }
}), wy = by, xy = /* @__PURE__ */ $({
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
    return (e, t) => (O(), F(y(fe), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: I(() => [X(e.$slots, "default", {}, () => [t[0] || (t[0] = Ve("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Sy = xy;
const [Uc, ky] = yt("SelectItem");
var Cy = /* @__PURE__ */ $({
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
    const t = n, r = e, { disabled: i } = jn(t), s = Yt(), o = Di(), { forwardRef: l, currentElement: a } = pe(), { CollectionItem: c } = Xt(), u = D(() => hr(s.modelValue?.value, t.value, s.by)), d = P(!1), f = P(t.textValue ?? ""), h = dr(void 0, "reka-select-item-text"), p = "select.select";
    async function m(b) {
      if (b.defaultPrevented) return;
      const k = {
        originalEvent: b,
        value: t.value
      };
      xi(p, g, k);
    }
    async function g(b) {
      await ge(), r("select", b), !b.defaultPrevented && (i.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function v(b) {
      await ge(), !b.defaultPrevented && (i.value ? o.onItemLeave?.() : b.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(b) {
      await ge(), !b.defaultPrevented && b.currentTarget === Ze() && o.onItemLeave?.();
    }
    async function x(b) {
      await ge(), !(b.defaultPrevented || o.searchRef?.value !== "" && b.key === " ") && (ey.includes(b.key) && m(b), b.key === " " && b.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return xe(() => {
      a.value && o.itemRefCallback(a.value, t.value, t.disabled);
    }), ky({
      value: t.value,
      disabled: i,
      textId: h,
      isSelected: u,
      onItemTextChange: (b) => {
        f.value = ((f.value || b?.textContent) ?? "").trim();
      }
    }), (b, k) => (O(), F(y(c), { value: { textValue: f.value } }, {
      default: I(() => [z(y(fe), {
        ref: y(l),
        role: "option",
        "aria-labelledby": y(h),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": y(i) || void 0,
        "data-disabled": y(i) ? "" : void 0,
        tabindex: y(i) ? void 0 : -1,
        as: b.as,
        "as-child": b.asChild,
        onFocus: k[0] || (k[0] = (C) => d.value = !0),
        onBlur: k[1] || (k[1] = (C) => d.value = !1),
        onPointerup: m,
        onPointerdown: k[2] || (k[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: k[3] || (k[3] = on(() => {
        }, ["prevent", "stop"])),
        onPointermove: v,
        onPointerleave: w,
        onKeydown: x
      }, {
        default: I(() => [X(b.$slots, "default")]),
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
}), Ey = Cy, Ty = /* @__PURE__ */ $({
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
    const e = n, t = Uc();
    return (r, i) => y(t).isSelected.value ? (O(), F(y(fe), oe({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [X(r.$slots, "default")]),
      _: 3
    }, 16)) : Q("v-if", !0);
  }
}), My = Ty, Oy = /* @__PURE__ */ $({
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
    const e = n, t = Yt(), r = Di(), i = Uc(), { forwardRef: s, currentElement: o } = pe(), l = D(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return xe(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), t.onOptionAdd(l.value));
    }), Er(() => {
      t.onOptionRemove(l.value);
    }), (a, c) => (O(), F(y(fe), oe({
      id: y(i).textId,
      ref: y(s)
    }, {
      ...e,
      ...a.$attrs
    }), {
      default: I(() => [X(a.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Ay = Oy, Dy = /* @__PURE__ */ $({
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
    return (t, r) => (O(), F(y(Oc), oo(lo(e)), {
      default: I(() => [X(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Py = Dy, Ny = /* @__PURE__ */ $({
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
    const e = n, t = Yt(), { forwardRef: r, currentElement: i } = pe(), s = D(() => t.disabled?.value || e.disabled);
    t.contentId ||= dr(void 0, "reka-select-content"), xe(() => {
      t.onTriggerChange(i.value);
    });
    const { getItems: o } = Xt(), { search: l, handleTypeaheadSearch: a, resetTypeahead: c } = fo();
    function u() {
      s.value || (t.onOpenChange(!0), c());
    }
    function d(f) {
      u(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, h) => (O(), F(y(Am), {
      "as-child": "",
      reference: f.reference
    }, {
      default: I(() => [z(y(fe), {
        ref: y(r),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": y(t).contentId,
        "aria-expanded": y(t).open.value || !1,
        "aria-required": y(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: y(t)?.dir.value,
        "data-state": y(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": y(ty)(y(t).modelValue?.value) ? "" : void 0,
        "as-child": f.asChild,
        as: f.as,
        onClick: h[0] || (h[0] = (p) => {
          p?.currentTarget?.focus();
        }),
        onPointerdown: h[1] || (h[1] = (p) => {
          if (p.pointerType === "touch") return p.preventDefault();
          const m = p.target;
          m.hasPointerCapture(p.pointerId) && m.releasePointerCapture(p.pointerId), p.button === 0 && p.ctrlKey === !1 && (d(p), p.preventDefault());
        }),
        onPointerup: h[2] || (h[2] = on((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: h[3] || (h[3] = (p) => {
          const m = y(l) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && m && p.key === " " || (y(a)(p.key, y(o)()), y(Qg).includes(p.key) && (u(), p.preventDefault()));
        })
      }, {
        default: I(() => [X(f.$slots, "default")]),
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
}), Iy = Ny, Ry = /* @__PURE__ */ $({
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
    const e = n, { forwardRef: t, currentElement: r } = pe(), i = Yt();
    xe(() => {
      i.valueElement = r;
    });
    const s = D(() => {
      let l = [];
      const a = Array.from(i.optionsSet.value), c = (u) => a.find((d) => hr(u, d.value, i.by));
      return Array.isArray(i.modelValue.value) ? l = i.modelValue.value.map((u) => c(u)?.textContent ?? "") : l = [c(i.modelValue.value)?.textContent ?? ""], l.filter(Boolean);
    }), o = D(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (l, a) => (O(), F(y(fe), {
      ref: y(t),
      as: l.as,
      "as-child": l.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: I(() => [X(l.$slots, "default", {
        selectedLabel: s.value,
        modelValue: y(i).modelValue.value
      }, () => [Ve(te(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), _y = Ry, By = /* @__PURE__ */ $({
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
    const e = n, { nonce: t } = jn(e), r = Zg(t), i = Di(), s = i.position === "item-aligned" ? fy() : void 0, { forwardRef: o, currentElement: l } = pe();
    xe(() => {
      i?.onViewportChange(l.value);
    });
    const a = P(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: h } = s ?? {};
      if (f?.value && h?.value) {
        const p = Math.abs(a.value - d.scrollTop);
        if (p > 0) {
          const m = window.innerHeight - nt * 2, g = Number.parseFloat(h.value.style.minHeight), v = Number.parseFloat(h.value.style.height), w = Math.max(g, v);
          if (w < m) {
            const x = w + p, b = Math.min(m, x), k = x - b;
            h.value.style.height = `${b}px`, h.value.style.bottom === "0px" && (d.scrollTop = k > 0 ? k : 0, h.value.style.justifyContent = "flex-end");
          }
        }
      }
      a.value = d.scrollTop;
    }
    return (u, d) => (O(), U(Ge, null, [z(y(fe), oe({
      ref: y(o),
      "data-reka-select-viewport": "",
      role: "presentation"
    }, {
      ...u.$attrs,
      ...e
    }, {
      style: {
        position: "relative",
        flex: 1,
        overflow: "hidden auto"
      },
      onScroll: c
    }), {
      default: I(() => [X(u.$slots, "default")]),
      _: 3
    }, 16), z(y(fe), {
      as: "style",
      nonce: y(r)
    }, {
      default: I(() => d[0] || (d[0] = [Ve(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Ly = By;
const $y = /* @__PURE__ */ $({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, r = P(), i = P([]);
    return xe(() => {
      const s = r.value?.closest(".speaker-sidebar");
      s && (i.value = [s]);
    }), (s, o) => (O(), U("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: r
    }, [
      z(y(iy), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (l) => t("update:selectedValue", l))
      }, {
        default: I(() => [
          z(y(Iy), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: I(() => [
              z(y(_y), { class: "sidebar-select-trigger-label" }),
              z(y(Sy), null, {
                default: I(() => [
                  z(y(eh), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          z(y(Py), { disabled: "" }, {
            default: I(() => [
              z(y(wy), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": i.value
              }, {
                default: I(() => [
                  z(y(Ly), null, {
                    default: I(() => [
                      (O(!0), U(Ge, null, bn(n.items, (l) => (O(), F(y(Ey), {
                        key: l.value,
                        value: l.value,
                        class: "sidebar-select-item"
                      }, {
                        default: I(() => [
                          z(y(My), { class: "sidebar-select-item-indicator" }, {
                            default: I(() => [
                              z(y(ic), { size: 14 })
                            ]),
                            _: 1
                          }),
                          z(y(Ay), null, {
                            default: I(() => [
                              Ve(te(l.label), 1)
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
}), zy = { class: "sidebar-select" }, Fy = ["aria-label"], Vy = { class: "sidebar-select-trigger-label" }, qy = /* @__PURE__ */ $({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = P(!1), s = D(
      () => t.items.find((l) => l.value === t.selectedValue)?.label ?? ""
    );
    function o(l) {
      r("update:selectedValue", l), i.value = !1;
    }
    return (l, a) => (O(), U("div", zy, [
      K("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: a[0] || (a[0] = (c) => i.value = !0)
      }, [
        K("span", Vy, te(s.value), 1)
      ], 8, Fy),
      z(y(wc), {
        open: i.value,
        "onUpdate:open": a[2] || (a[2] = (c) => i.value = c)
      }, {
        default: I(() => [
          z(y(Ac), { disabled: "" }, {
            default: I(() => [
              z(y(Mc), { class: "editor-overlay" }),
              z(y(Tc), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: I(() => [
                  z(y(Dc), { class: "sr-only" }, {
                    default: I(() => [
                      Ve(te(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  a[3] || (a[3] = K("div", { class: "sheet-handle" }, null, -1)),
                  z(y(qg), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": a[1] || (a[1] = (c) => o(c))
                  }, {
                    default: I(() => [
                      z(y(Hg), { class: "sheet-list" }, {
                        default: I(() => [
                          (O(!0), U(Ge, null, bn(n.items, (c) => (O(), F(y(Xg), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: I(() => [
                              z(y(Gg), { class: "sheet-item-indicator" }, {
                                default: I(() => [
                                  z(y(ic), { size: 16 })
                                ]),
                                _: 1
                              }),
                              K("span", null, te(c.label), 1)
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
}), xo = /* @__PURE__ */ $({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: r } = uc();
    return (i, s) => y(r) ? (O(), F(qy, oe({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
    }), null, 16)) : (O(), F($y, oe({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => t("update:selectedValue", o))
    }), null, 16));
  }
}), Kc = /* @__PURE__ */ $({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = gt(), s = D(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, l) => (O(), F(xo, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: y(i)("header.channelLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (a) => r("update:selectedChannelId", a))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Wy = { class: "speaker-sidebar" }, Hy = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, jy = { class: "sidebar-title" }, Uy = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Ky = { class: "sidebar-title" }, Jy = {
  key: 2,
  class: "sidebar-section"
}, Xy = { class: "sidebar-title" }, Yy = { class: "subtitle-toggle" }, Gy = { class: "subtitle-toggle-label" }, Zy = { class: "subtitle-slider" }, Qy = { class: "subtitle-slider-label" }, ev = { class: "subtitle-slider-value" }, tv = ["value", "disabled"], nv = {
  key: 3,
  class: "sidebar-section"
}, rv = { class: "sidebar-title" }, iv = { class: "speaker-list" }, sv = { class: "speaker-name" }, ov = /* @__PURE__ */ $({
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
    const e = n, t = Kt(), { t: r, locale: i } = gt(), s = D(
      () => tc(e.translations, i.value, r("sidebar.originalLanguage"), r("language.wildcard"))
    );
    return (o, l) => (O(), U("aside", Wy, [
      n.channels.length > 1 ? (O(), U("section", Hy, [
        K("h2", jy, te(y(r)("sidebar.channel")), 1),
        z(Kc, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": l[0] || (l[0] = (a) => o.$emit("update:selectedChannelId", a))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : Q("", !0),
      n.translations.length > 1 ? (O(), U("section", Uy, [
        K("h2", Ky, te(y(r)("sidebar.translation")), 1),
        z(xo, {
          items: s.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: y(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": l[1] || (l[1] = (a) => o.$emit("update:selectedTranslationId", a))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : Q("", !0),
      y(t).subtitle ? (O(), U("section", Jy, [
        K("h2", Xy, te(y(r)("sidebar.subtitle")), 1),
        K("div", Yy, [
          K("span", Gy, te(y(r)("subtitle.show")), 1),
          z(rp, {
            modelValue: y(t).subtitle.isVisible.value,
            "onUpdate:modelValue": l[2] || (l[2] = (a) => y(t).subtitle.isVisible.value = a)
          }, null, 8, ["modelValue"])
        ]),
        K("label", Zy, [
          K("span", Qy, [
            Ve(te(y(r)("subtitle.fontSize")) + " ", 1),
            K("span", ev, te(y(t).subtitle.fontSize.value) + "px", 1)
          ]),
          K("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: y(t).subtitle.fontSize.value,
            disabled: !y(t).subtitle.isVisible.value,
            onInput: l[3] || (l[3] = (a) => y(t).subtitle.fontSize.value = Number(a.target.value))
          }, null, 40, tv)
        ])
      ])) : Q("", !0),
      n.speakers.length ? (O(), U("section", nv, [
        K("h2", rv, te(y(r)("sidebar.speakers")), 1),
        K("ul", iv, [
          (O(!0), U(Ge, null, bn(n.speakers, (a) => (O(), U("li", {
            key: a.id,
            class: "speaker-item"
          }, [
            z(ac, {
              color: a.color
            }, null, 8, ["color"]),
            K("span", sv, te(a.name), 1)
          ]))), 128))
        ])
      ])) : Q("", !0)
    ]));
  }
}), Ol = /* @__PURE__ */ Me(ov, [["__scopeId", "data-v-6e6fa62e"]]), lv = /* @__PURE__ */ $({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = Of(n, "open"), { t } = gt();
    return (r, i) => (O(), F(y(wc), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: I(() => [
        z(y(Ac), { disabled: "" }, {
          default: I(() => [
            z(y(Mc), { class: "editor-overlay" }),
            z(y(Tc), { class: "sidebar-drawer" }, {
              default: I(() => [
                z(y(Dc), { class: "sr-only" }, {
                  default: I(() => [
                    Ve(te(y(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                z(y(Wp), {
                  class: "sidebar-close",
                  "aria-label": y(t)("header.closeSidebar")
                }, {
                  default: I(() => [
                    z(y(sc), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                X(r.$slots, "default")
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
}), av = { class: "player-controls" }, cv = { class: "controls-left" }, uv = { class: "controls-time" }, dv = { class: "time-display" }, fv = { class: "time-display" }, hv = { class: "controls-right" }, pv = ["value", "aria-label", "disabled"], mv = /* @__PURE__ */ $({
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
    const t = e, { t: r } = gt(), i = P(!1);
    function s(o) {
      const l = o.target;
      t("update:volume", parseFloat(l.value));
    }
    return (o, l) => (O(), U("div", av, [
      K("div", cv, [
        z(ct, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: l[0] || (l[0] = (a) => t("skipBack"))
        }, {
          icon: I(() => [
            z(y(ih), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        z(ct, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? y(r)("player.pause") : y(r)("player.play"),
          disabled: !n.isReady,
          onClick: l[1] || (l[1] = (a) => t("togglePlay"))
        }, {
          icon: I(() => [
            n.isPlaying ? (O(), F(y(th), {
              key: 0,
              size: 20
            })) : (O(), F(y(nh), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        z(ct, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: l[2] || (l[2] = (a) => t("skipForward"))
        }, {
          icon: I(() => [
            z(y(sh), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      K("div", uv, [
        K("time", dv, te(n.currentTime), 1),
        l[7] || (l[7] = K("span", { class: "time-separator" }, "/", -1)),
        K("time", fv, te(n.duration), 1)
      ]),
      K("div", hv, [
        K("div", {
          class: "volume-group",
          onMouseenter: l[4] || (l[4] = (a) => i.value = !0),
          onMouseleave: l[5] || (l[5] = (a) => i.value = !1)
        }, [
          z(ct, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? y(r)("player.unmute") : y(r)("player.mute"),
            disabled: !n.isReady,
            onClick: l[3] || (l[3] = (a) => t("toggleMute"))
          }, {
            icon: I(() => [
              n.isMuted ? (O(), F(y(ah), {
                key: 0,
                size: 16
              })) : (O(), F(y(lh), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Af(K("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": y(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, pv), [
            [Df, i.value]
          ])
        ], 32),
        z(ct, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": y(r)("player.speed"),
          disabled: !n.isReady,
          onClick: l[6] || (l[6] = (a) => t("cyclePlaybackRate"))
        }, {
          default: I(() => [
            Ve(te(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), gv = /* @__PURE__ */ Me(mv, [["__scopeId", "data-v-89b8138f"]]);
function Ne(n, e, t, r) {
  return new (t || (t = Promise))((function(i, s) {
    function o(c) {
      try {
        a(r.next(c));
      } catch (u) {
        s(u);
      }
    }
    function l(c) {
      try {
        a(r.throw(c));
      } catch (u) {
        s(u);
      }
    }
    function a(c) {
      var u;
      c.done ? i(c.value) : (u = c.value, u instanceof t ? u : new t((function(d) {
        d(u);
      }))).then(o, l);
    }
    a((r = r.apply(n, e || [])).next());
  }));
}
let Mr = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...s) => {
        this.un(e, i), t(...s);
      };
      return this.listeners[e].add(i), () => this.un(e, i);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var r;
    (r = this.listeners[e]) === null || r === void 0 || r.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((r) => r(...t)));
  }
};
const _r = { decode: function(n, e) {
  return Ne(this, void 0, void 0, (function* () {
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
  (function(r) {
    const i = r[0];
    if (i.some(((s) => s > 1 || s < -1))) {
      const s = i.length;
      let o = 0;
      for (let l = 0; l < s; l++) {
        const a = Math.abs(i[l]);
        a > o && (o = a);
      }
      for (const l of r) for (let a = 0; a < s; a++) l[a] /= o;
    }
  })(n);
  const t = n.map(((r) => r instanceof Float32Array ? r : Float32Array.from(r)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (r) => {
    const i = t[r];
    if (!i) throw new Error(`Channel ${r} not found`);
    return i;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Jc(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Jc(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Al(n, e, t) {
  const r = Jc(n, e || {});
  return t?.appendChild(r), r;
}
var yv = Object.freeze({ __proto__: null, createElement: Al, default: Al });
const vv = { fetchBlob: function(n, e, t) {
  return Ne(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Ne(this, void 0, void 0, (function* () {
        if (!i.body || !i.headers) return;
        const o = i.body.getReader(), l = Number(i.headers.get("Content-Length")) || 0;
        let a = 0;
        const c = (u) => {
          a += u?.length || 0;
          const d = Math.round(a / l * 100);
          s(d);
        };
        try {
          for (; ; ) {
            const u = yield o.read();
            if (u.done) break;
            c(u.value);
          }
        } catch (u) {
          console.warn("Progress tracking error:", u);
        }
      }));
    })(r.clone(), e), r.blob();
  }));
} };
function de(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(r) {
    Object.is(e, r) || (e = r, t.forEach(((i) => i(e))));
  }, update(r) {
    this.set(r(e));
  }, subscribe: (r) => (t.add(r), () => t.delete(r)) };
}
function en(n, e) {
  const t = de(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Pt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class bv extends Mr {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = de(!1), this._currentTime = de(0), this._duration = de(0), this._volume = de(this.media.volume), this._muted = de(this.media.muted), this._playbackRate = de(this.media.playbackRate || 1), this._seeking = de(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
  onMediaEvent(e, t, r) {
    return this.media.addEventListener(e, t, r), () => this.media.removeEventListener(e, t, r);
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
    const r = this.getSrc();
    if (e && r === e) return;
    this.revokeSrc();
    const i = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (r && this.media.removeAttribute("src"), i || e) try {
      this.media.src = i;
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
    return Ne(this, void 0, void 0, (function* () {
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
function wv({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), l = o + Math.round(e * t * r) || 1;
  return l < i && (l = i, s || (o = l / 2)), { topHeight: o, totalHeight: l };
}
function xv({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function Dl(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function Xc(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Pl(n, e) {
  if (!Xc(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function Nl({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function Yc(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Sv(n) {
  const e = de({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = en((() => (function(s) {
    const { scrollLeft: o, scrollWidth: l, clientWidth: a } = s;
    if (l === 0) return { startX: 0, endX: 1 };
    const c = o / l, u = (o + a) / l;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = en((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), Yc(e);
  } };
}
class kv extends Mr {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const r = this.parentFromOptionsContainer(e.container);
    this.parent = r;
    const [i, s] = this.initHtml();
    r.appendChild(i), this.container = i, this.scrollContainer = s.querySelector(".scroll"), this.wrapper = s.querySelector(".wrapper"), this.canvasWrapper = s.querySelector(".canvases"), this.progressWrapper = s.querySelector(".progress"), this.cursor = s.querySelector(".cursor"), t && s.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Dl(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Dl(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Sv(this.scrollContainer);
    const e = Pt((() => {
      const { startX: t, endX: r } = this.scrollStream.percentages.value, { left: i, right: s } = this.scrollStream.bounds.value;
      this.emit("scroll", t, r, i, s);
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
    this.dragStream = (function(t, r = {}) {
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, l = de(null), a = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (a.set(f.pointerId, f), a.size > 1)) return;
        let h = f.clientX, p = f.clientY, m = !1;
        const g = Date.now(), v = t.getBoundingClientRect(), { left: w, top: x } = v, b = (E) => {
          if (E.defaultPrevented || a.size > 1 || c && Date.now() - g < o) return;
          const M = E.clientX, R = E.clientY, _ = M - h, q = R - p;
          (m || Math.abs(_) > i || Math.abs(q) > i) && (E.preventDefault(), E.stopPropagation(), m || (l.set({ type: "start", x: h - w, y: p - x }), m = !0), l.set({ type: "move", x: M - w, y: R - x, deltaX: _, deltaY: q }), h = M, p = R);
        }, k = (E) => {
          if (a.delete(E.pointerId), m) {
            const M = E.clientX, R = E.clientY;
            l.set({ type: "end", x: M - w, y: R - x });
          }
          u();
        }, C = (E) => {
          a.delete(E.pointerId), E.relatedTarget && E.relatedTarget !== document.documentElement || k(E);
        }, S = (E) => {
          m && (E.stopPropagation(), E.preventDefault());
        }, T = (E) => {
          E.defaultPrevented || a.size > 1 || m && E.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", k), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", k), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", T), setTimeout((() => {
            document.removeEventListener("click", S, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: l, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), a.clear(), Yc(l);
      } };
    })(this.wrapper);
    const e = Pt((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const r = this.wrapper.getBoundingClientRect().width, i = (s = t.x / r) < 0 ? 0 : s > 1 ? 1 : s;
      var s;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", i)) : t.type === "move" ? this.emit("drag", i) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", i));
    }), [this.dragStream.signal]);
    this.subscriptions.push(e);
  }
  initHtml() {
    const e = document.createElement("div"), t = e.attachShadow({ mode: "open" }), r = this.options.cspNonce && typeof this.options.cspNonce == "string" ? this.options.cspNonce.replace(/"/g, "") : "";
    return t.innerHTML = `
      <style${r ? ` nonce="${r}"` : ""}>
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
    const { scrollWidth: t } = this.scrollContainer, r = t * e;
    this.setScroll(r);
  }
  destroy() {
    var e;
    this.subscriptions.forEach(((t) => t())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), (e = this.unsubscribeOnScroll) === null || e === void 0 || e.forEach(((t) => t())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(e = 10) {
    let t, r;
    const i = () => {
      t && (clearTimeout(t), t = void 0), r && (r(), r = void 0);
    };
    return this.timeouts.push(i), () => new Promise(((s, o) => {
      i(), r = o, t = setTimeout((() => {
        t = void 0, r = void 0, s();
      }), e);
    }));
  }
  getHeight(e, t) {
    var r;
    const i = ((r = this.audioData) === null || r === void 0 ? void 0 : r.numberOfChannels) || 1;
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: l, numberOfChannels: a, defaultHeight: c = 128 }) {
      if (s == null) return c;
      const u = Number(s);
      if (!isNaN(u)) return u;
      if (s === "auto") {
        const d = l || c;
        return o?.every(((f) => !f.overlay)) ? d / a : d;
      }
      return c;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: i, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(r, i, s) {
      if (!Array.isArray(r)) return r || "";
      if (r.length === 0) return "#999";
      if (r.length < 2) return r[0] || "";
      const o = document.createElement("canvas"), l = o.getContext("2d"), a = s ?? o.height * i, c = l.createLinearGradient(0, 0, 0, a || i), u = 1 / (r.length - 1);
      return r.forEach(((d, f) => {
        c.addColorStop(f * u, d);
      })), c;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, { halfHeight: l, barWidth: a, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: p, height: m, length: g, options: v, pixelRatio: w }) {
      const x = m / 2, b = v.barWidth ? v.barWidth * w : 1, k = v.barGap ? v.barGap * w : v.barWidth ? b / 2 : 0, C = b + k || 1;
      return { halfHeight: x, barWidth: b, barGap: k, barRadius: v.barRadius || 0, barMinHeight: v.barMinHeight ? v.barMinHeight * w : 0, barIndexScale: g > 0 ? p / C / g : 0, barSpacing: C };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: v, halfHeight: w, vScale: x, canvasHeight: b, barAlign: k, barMinHeight: C }) {
      const S = p[0] || [], T = p[1] || S, E = S.length, M = [];
      let R = 0, _ = 0, q = 0;
      for (let N = 0; N <= E; N++) {
        const B = Math.round(N * m);
        if (B > R) {
          const { topHeight: ne, totalHeight: ce } = wv({ maxTop: _, maxBottom: q, halfHeight: w, vScale: x, barMinHeight: C, barAlign: k }), Le = xv({ barAlign: k, halfHeight: w, topHeight: ne, totalHeight: ce, canvasHeight: b });
          M.push({ x: R * g, y: Le, width: v, height: ce }), R = B, _ = 0, q = 0;
        }
        const ee = Math.abs(S[N] || 0), J = Math.abs(T[N] || 0);
        ee > _ && (_ = ee), J > q && (q = J);
      }
      return M;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: a, halfHeight: l, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const p of h) c && "roundRect" in r ? r.roundRect(p.x, p.y, p.width, p.height, c) : r.rect(p.x, p.y, p.width, p.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, l = (function({ channelData: a, width: c, height: u, vScale: d }) {
      const f = u / 2, h = a[0] || [];
      return [h, a[1] || h].map(((p, m) => {
        const g = p.length, v = g ? c / g : 0, w = f, x = m === 0 ? -1 : 1, b = [{ x: 0, y: w }];
        let k = 0, C = 0;
        for (let S = 0; S <= g; S++) {
          const T = Math.round(S * v);
          if (T > k) {
            const M = w + (Math.round(C * f * d) || 1) * x;
            b.push({ x: k, y: M }), k = T, C = 0;
          }
          const E = Math.abs(p[S] || 0);
          E > C && (C = E);
        }
        return b.push({ x: k, y: w }), b;
      }));
    })({ channelData: e, width: s, height: o, vScale: i });
    r.beginPath();
    for (const a of l) if (a.length) {
      r.moveTo(a[0].x, a[0].y);
      for (let c = 1; c < a.length; c++) {
        const u = a[c];
        r.lineTo(u.x, u.y);
      }
    }
    r.fill(), r.closePath();
  }
  renderWaveform(e, t, r) {
    if (r.fillStyle = this.convertColorValues(t.waveColor, r), t.renderFunction) return void t.renderFunction(e, r);
    const i = (function({ channelData: s, barHeight: o, normalize: l, maxPeak: a }) {
      var c;
      const u = o || 1;
      if (!l) return u;
      const d = s[0];
      if (!d || d.length === 0) return u;
      let f = a ?? 0;
      if (!a) for (let h = 0; h < d.length; h++) {
        const p = (c = d[h]) !== null && c !== void 0 ? c : 0, m = Math.abs(p);
        m > f && (f = m);
      }
      return f ? u / f : u;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Xc(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
  }
  renderSingleCanvas(e, t, r, i, s, o, l) {
    const a = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(r * a), c.height = Math.round(i * a), c.style.width = `${r}px`, c.style.height = `${i}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (t.renderFunction ? (u.fillStyle = this.convertColorValues(t.waveColor, u), t.renderFunction(e, u)) : this.renderWaveform(e, t, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), f = d.getContext("2d");
      f.drawImage(c, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(t.progressColor, f), f.fillRect(0, 0, c.width, c.height), l.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, r, i, s, o) {
    const l = this.getPixelRatio(), { clientWidth: a } = this.scrollContainer, c = r / l, u = (function({ clientWidth: p, totalWidth: m, options: g }) {
      return Pl(Math.min(8e3, p, m), g);
    })({ clientWidth: a, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = Pl(g, t), g <= 0) return;
      const v = (function({ channelData: w, offset: x, clampedWidth: b, totalWidth: k }) {
        return w.map(((C) => {
          const S = Math.floor(x / k * C.length), T = Math.floor((x + b) / k * C.length);
          return C.slice(S, T);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(v, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (Nl({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Nl({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
      }));
      this.unsubscribeOnScroll.push(p);
    }
  }
  renderChannel(e, t, r, i) {
    var { overlay: s } = t, o = (function(u, d) {
      var f = {};
      for (var h in u) Object.prototype.hasOwnProperty.call(u, h) && d.indexOf(h) < 0 && (f[h] = u[h]);
      if (u != null && typeof Object.getOwnPropertySymbols == "function") {
        var p = 0;
        for (h = Object.getOwnPropertySymbols(u); p < h.length; p++) d.indexOf(h[p]) < 0 && Object.prototype.propertyIsEnumerable.call(u, h[p]) && (f[h[p]] = u[h[p]]);
      }
      return f;
    })(t, ["overlay"]);
    const l = document.createElement("div"), a = this.getHeight(o.height, o.splitChannels);
    l.style.height = `${a}px`, s && i > 0 && (l.style.marginTop = `-${a}px`), this.canvasWrapper.style.minHeight = `${a}px`, this.canvasWrapper.appendChild(l);
    const c = l.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, r, a, l, c);
  }
  render(e) {
    return Ne(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: l, width: a } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: f, pixelRatio: h }) {
        const p = Math.ceil(c * u), m = p > d, g = !!(f && !m);
        return { scrollWidth: p, isScrollable: m, useParentWidth: g, width: (g ? d : p) * h };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: i, fillParent: this.options.fillParent, pixelRatio: r });
      if (this.isScrollable = o, this.wrapper.style.width = l ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let c = 0; c < e.numberOfChannels; c++) {
        const u = Object.assign(Object.assign({}, this.options), (t = this.options.splitChannels) === null || t === void 0 ? void 0 : t[c]);
        this.renderChannel([e.getChannelData(c)], u, a, c);
      }
      else {
        const c = [e.getChannelData(0)];
        e.numberOfChannels > 1 && c.push(e.getChannelData(1)), this.renderChannel(c, this.options, a, 0);
      }
      Promise.resolve().then((() => this.emit("rendered")));
    }));
  }
  reRender() {
    if (this.unsubscribeOnScroll.forEach(((r) => r())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: t } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: r } = this.progressWrapper.getBoundingClientRect(), i = (function(s) {
        const o = 2 * s;
        return (o < 0 ? Math.floor(o) : Math.ceil(o)) / 2;
      })(r - t);
      this.scrollContainer.scrollLeft += i;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: r, scrollWidth: i, clientWidth: s } = this.scrollContainer, o = e * i, l = r, a = r + s, c = s / 2;
    if (this.isDragging)
      o + 30 > a ? this.scrollContainer.scrollLeft += 30 : o - 30 < l && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < l || o > a) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? c : 0));
      const u = o - r - c;
      t && this.options.autoCenter && u > 0 && (this.scrollContainer.scrollLeft += u);
    }
  }
  renderProgress(e, t) {
    if (isNaN(e)) return;
    const r = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${r}% 0%, 100% 0%, 100% 100%, ${r}% 100%)`, this.progressWrapper.style.width = `${r}%`, this.cursor.style.left = `${r}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, t);
  }
  exportImage(e, t, r) {
    return Ne(this, void 0, void 0, (function* () {
      const i = this.canvasWrapper.querySelectorAll("canvas");
      if (!i.length) throw new Error("No waveform data");
      if (r === "dataURL") {
        const s = Array.from(i).map(((o) => o.toDataURL(e, t)));
        return Promise.resolve(s);
      }
      return Promise.all(Array.from(i).map(((s) => new Promise(((o, l) => {
        s.toBlob(((a) => {
          a ? o(a) : l(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class Cv extends Mr {
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
class ns extends Mr {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Ne(this, void 0, void 0, (function* () {
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
    return Ne(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(e) {
    const t = e - this.currentTime, r = this.bufferNode;
    r?.stop(this.audioContext.currentTime + t), r?.addEventListener("ended", (() => {
      r === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: !0 });
  }
  setSinkId(e) {
    return Ne(this, void 0, void 0, (function* () {
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
    for (let r = 0; r < t; r++) e.push(this.buffer.getChannelData(r));
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
const Ev = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class pr extends bv {
  static create(e) {
    return new pr(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new ns() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Ev, e);
    const { state: r, actions: i } = (function(l) {
      var a, c, u, d, f, h;
      const p = (a = l?.currentTime) !== null && a !== void 0 ? a : de(0), m = (c = l?.duration) !== null && c !== void 0 ? c : de(0), g = (u = l?.isPlaying) !== null && u !== void 0 ? u : de(!1), v = (d = l?.isSeeking) !== null && d !== void 0 ? d : de(!1), w = (f = l?.volume) !== null && f !== void 0 ? f : de(1), x = (h = l?.playbackRate) !== null && h !== void 0 ? h : de(1), b = de(null), k = de(null), C = de(""), S = de(0), T = de(0), E = en((() => !g.value), [g]), M = en((() => b.value !== null), [b]), R = en((() => M.value && m.value > 0), [M, m]), _ = en((() => p.value), [p]), q = en((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: E, isSeeking: v, volume: w, playbackRate: x, audioBuffer: b, peaks: k, url: C, zoom: S, scrollPosition: T, canPlay: M, isReady: R, progress: _, progressPercent: q }, actions: { setCurrentTime: (N) => {
        const B = Math.max(0, Math.min(m.value || 1 / 0, N));
        p.set(B);
      }, setDuration: (N) => {
        m.set(Math.max(0, N));
      }, setPlaying: (N) => {
        g.set(N);
      }, setSeeking: (N) => {
        v.set(N);
      }, setVolume: (N) => {
        const B = Math.max(0, Math.min(1, N));
        w.set(B);
      }, setPlaybackRate: (N) => {
        const B = Math.max(0.1, Math.min(16, N));
        x.set(B);
      }, setAudioBuffer: (N) => {
        b.set(N), N && m.set(N.duration);
      }, setPeaks: (N) => {
        k.set(N);
      }, setUrl: (N) => {
        C.set(N);
      }, setZoom: (N) => {
        S.set(Math.max(0, N));
      }, setScrollPosition: (N) => {
        T.set(Math.max(0, N));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new Cv();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new kv(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const o = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: l, duration: a } = this.options;
      (o || l && a) && this.load(o, l, a).catch(((c) => {
        this.emit("error", c instanceof Error ? c : new Error(String(c)));
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
      const r = [];
      r.push(Pt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Pt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Pt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Pt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Pt((() => {
        const o = e.isPlaying.value, l = e.currentTime.value, a = e.duration.value, c = a > 0 && l >= a;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Pt((() => {
        const o = e.zoom.value;
        o > 0 && t.emit("zoom", o);
      }), [e.zoom])), () => {
        r.forEach(((o) => o()));
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
    })), this.renderer.on("scroll", ((e, t, r, i) => {
      const s = this.getDuration();
      this.emit("scroll", e * s, t * s, r, i);
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
      const t = this.renderer.on("drag", ((r) => {
        var i;
        if (!this.options.interact) return;
        this.renderer.renderProgress(r), clearTimeout(e);
        let s = 0;
        const o = this.options.dragToSeek;
        this.isPlaying() ? s = 0 : o === !0 ? s = 200 : o && typeof o == "object" && (s = (i = o.debounceTime) !== null && i !== void 0 ? i : 200), e = setTimeout((() => {
          this.seekTo(r);
        }), s), this.emit("interaction", r * this.getDuration()), this.emit("drag", r);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = _r.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = _r.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
  }
  registerPlugin(e) {
    if (this.plugins.includes(e)) return e;
    e._init(this), this.plugins.push(e);
    const t = e.once("destroy", (() => {
      this.plugins = this.plugins.filter(((r) => r !== e)), this.subscriptions = this.subscriptions.filter(((r) => r !== t));
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
  loadAudio(e, t, r, i) {
    return Ne(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const l = this.options.fetchParams || {};
        window.AbortController && !l.signal && (this.abortController = new AbortController(), l.signal = this.abortController.signal);
        const a = (u) => this.emit("loading", u);
        t = yield vv.fetchBlob(e, a, l);
        const c = this.options.blobMimeType;
        c && (t = new Blob([t], { type: c }));
      }
      this.setSrc(e, t);
      const o = yield new Promise(((l) => {
        const a = i || this.getDuration();
        a ? l(a) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => l(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const l = this.getMediaElement();
        l instanceof ns && (l.duration = o);
      }
      if (r) this.decodedData = _r.createBuffer(r, o || 0);
      else if (t) {
        const l = yield t.arrayBuffer();
        this.decodedData = yield _r.decode(l, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return Ne(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return Ne(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
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
  exportPeaks({ channels: e = 2, maxLength: t = 8e3, precision: r = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const i = Math.min(e, this.decodedData.numberOfChannels), s = [];
    for (let o = 0; o < i; o++) {
      const l = this.decodedData.getChannelData(o), a = [], c = l.length / t;
      for (let u = 0; u < t; u++) {
        const d = l.slice(Math.floor(u * c), Math.ceil((u + 1) * c));
        let f = 0;
        for (let h = 0; h < d.length; h++) {
          const p = d[h];
          Math.abs(p) > Math.abs(f) && (f = p);
        }
        a.push(Math.round(f * r) / r);
      }
      s.push(a);
    }
    return s;
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
    const r = Object.create(null, { play: { get: () => super.play } });
    return Ne(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof ns ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return Ne(this, void 0, void 0, (function* () {
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
    return Ne(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
pr.BasePlugin = class extends Mr {
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
}, pr.dom = yv;
class Gc {
  constructor() {
    this.listeners = {};
  }
  on(e, t, r) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), r?.once) {
      const i = (...s) => {
        this.un(e, i), t(...s);
      };
      return this.listeners[e].add(i), () => this.un(e, i);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var r;
    (r = this.listeners[e]) === null || r === void 0 || r.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((r) => r(...t)));
  }
}
class Tv extends Gc {
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
function Zc(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Zc(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Zn(n, e, t) {
  const r = Zc(n, e || {});
  return t?.appendChild(r), r;
}
function Qc(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(r) {
    Object.is(e, r) || (e = r, t.forEach(((i) => i(e))));
  }, update(r) {
    this.set(r(e));
  }, subscribe: (r) => (t.add(r), () => t.delete(r)) };
}
function Ur(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Mn(n, e) {
  const t = Qc(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function Qt(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Kr(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = Qc(null), o = /* @__PURE__ */ new Map(), l = matchMedia("(pointer: coarse)").matches;
  let a = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: v } = m, w = (S) => {
      if (S.defaultPrevented || o.size > 1 || l && Date.now() - p < i) return;
      const T = S.clientX, E = S.clientY, M = T - d, R = E - f;
      (h || Math.abs(M) > t || Math.abs(R) > t) && (S.preventDefault(), S.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - v }), h = !0), s.set({ type: "move", x: T - g, y: E - v, deltaX: M, deltaY: R }), d = T, f = E);
    }, x = (S) => {
      if (o.delete(S.pointerId), h) {
        const T = S.clientX, E = S.clientY;
        s.set({ type: "end", x: T - g, y: E - v });
      }
      a();
    }, b = (S) => {
      o.delete(S.pointerId), S.relatedTarget && S.relatedTarget !== document.documentElement || x(S);
    }, k = (S) => {
      h && (S.stopPropagation(), S.preventDefault());
    }, C = (S) => {
      S.defaultPrevented || o.size > 1 || h && S.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", x), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), a = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", k, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    a(), n.removeEventListener("pointerdown", c), o.clear(), Qt(s);
  } };
}
class Il extends Gc {
  constructor(e, t, r = 0) {
    var i, s, o, l, a, c, u, d, f, h;
    super(), this.totalDuration = t, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (l = e.resizeStart) === null || l === void 0 || l, this.resizeEnd = (a = e.resizeEnd) === null || a === void 0 || a, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (h = e.contentEditable) !== null && h !== void 0 ? h : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Zn("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Zn("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Kr(r, { threshold: 1 }), o = Kr(i, { threshold: 1 }), l = Ur((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), a = Ur((() => {
      const c = o.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "end") : c.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      l(), a(), s.cleanup(), o.cleanup();
    }));
  }
  removeResizeHandles(e) {
    const t = e.querySelector('[part*="region-handle-left"]'), r = e.querySelector('[part*="region-handle-right"]');
    t && e.removeChild(t), r && e.removeChild(r);
  }
  initElement() {
    if (this.isRemoved) return null;
    const e = this.start === this.end;
    let t = 0, r = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (r = 100 / this.numberOfChannels, t = r * this.channelIdx);
    const i = Zn("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(i), i;
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
    const t = Mn(e, "click"), r = Mn(e, "mouseenter"), i = Mn(e, "mouseleave"), s = Mn(e, "dblclick"), o = Mn(e, "pointerdown"), l = Mn(e, "pointerup"), a = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = l.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      a(), c(), u(), d(), f(), h(), Qt(t), Qt(r), Qt(i), Qt(s), Qt(o), Qt(l);
    }));
    const p = Kr(e), m = Ur((() => {
      const g = p.signal.value;
      g && (g.type === "start" ? this.toggleCursor(!0) : g.type === "move" && g.deltaX !== void 0 ? this.onMove(g.deltaX) : g.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [p.signal]);
    this.subscriptions.push((() => {
      m(), p.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (g) => this.onContentClick(g), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, r) {
    var i;
    if (!(!((i = this.element) === null || i === void 0) && i.parentElement)) return;
    const { width: s } = this.element.parentElement.getBoundingClientRect(), o = e / s * this.totalDuration;
    let l = t && t !== "start" ? this.start : this.start + o, a = t && t !== "end" ? this.end : this.end + o;
    const c = r !== void 0;
    c && this.updatingSide && this.updatingSide !== t && (this.updatingSide === "start" ? l = r : a = r), l = Math.max(0, l), a = Math.min(this.totalDuration, a);
    const u = a - l;
    this.updatingSide = t;
    const d = u >= this.minLength && u <= this.maxLength;
    l <= a && (d || c) && (this.start = l, this.end = a, this.renderPosition(), this.emit("update", t));
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
        const r = this.start === this.end;
        this.content = Zn("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (r) => this.onContentClick(r), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var t, r;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const i = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : i ? this.start : this.end), this.renderPosition(), this.setPart();
      }
      if (e.content && this.setContent(e.content), e.id && (this.id = e.id, this.setPart()), e.resize !== void 0 && e.resize !== this.resize) {
        const i = this.start === this.end;
        this.resize = e.resize, this.resize && !i ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      e.resizeStart !== void 0 && (this.resizeStart = e.resizeStart), e.resizeEnd !== void 0 && (this.resizeEnd = e.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = !0, this.emit("remove"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class So extends Tv {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new So(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((r) => r._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const r = this.regions.filter(((i) => i.start <= t && (i.end === i.start ? i.start + 0.05 : i.end) >= t));
      r.forEach(((i) => {
        e.includes(i) || this.emit("region-in", i);
      })), e.forEach(((i) => {
        r.includes(i) || this.emit("region-out", i);
      })), e = r;
    })));
  }
  initRegionsContainer() {
    return Zn("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, r = t.getBoundingClientRect(), i = this.regions.map(((s) => {
        if (s === e || !s.content) return 0;
        const o = s.content.getBoundingClientRect();
        return r.left < o.left + o.width && o.left < r.left + r.width ? o.height : 0;
      })).reduce(((s, o) => s + o), 0);
      t.style.marginTop = `${i}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, r;
    if (!e.element) return;
    const i = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || r === void 0 ? void 0 : r.parentElement;
    if (!i) return;
    const { clientWidth: s, scrollWidth: o } = i;
    if (o <= s) return;
    const l = i.getBoundingClientRect(), a = e.element.getBoundingClientRect(), c = a.left - l.left, u = a.right - l.left;
    c < 0 ? i.scrollLeft += c : u > s && (i.scrollLeft += u - s);
  }
  virtualAppend(e, t, r) {
    const i = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), l = t.clientWidth, a = this.wavesurfer.getDuration(), c = Math.round(e.start / a * l), u = c + (Math.round((e.end - e.start) / a * l) || 1) > o && c < o + s;
      u && !r.parentElement ? t.appendChild(r) : !u && r.parentElement && r.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      i();
      const s = this.wavesurfer.on("scroll", i), o = this.wavesurfer.on("zoom", i), l = this.wavesurfer.on("resize", i);
      this.subscriptions.push(s, o, l), e.once("remove", (() => {
        s(), o(), l();
      }));
    }), 0);
  }
  saveRegion(e) {
    if (!e.element) return;
    this.virtualAppend(e, this.regionsContainer, e.element), this.avoidOverlapping(e), this.regions.push(e);
    const t = [e.on("update", ((r) => {
      r || this.adjustScroll(e), this.emit("region-update", e, r);
    })), e.on("update-end", ((r) => {
      this.avoidOverlapping(e), this.emit("region-updated", e, r);
    })), e.on("play", ((r) => {
      var i;
      (i = this.wavesurfer) === null || i === void 0 || i.play(e.start, r);
    })), e.on("click", ((r) => {
      this.emit("region-clicked", e, r);
    })), e.on("dblclick", ((r) => {
      this.emit("region-double-clicked", e, r);
    })), e.on("content-changed", (() => {
      this.emit("region-content-changed", e);
    })), e.once("remove", (() => {
      t.forEach(((r) => r())), this.regions = this.regions.filter(((r) => r !== e)), this.emit("region-removed", e);
    }))];
    this.subscriptions.push(...t), this.emit("region-created", e);
  }
  addRegion(e) {
    var t, r;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Il(e, i, s);
    return this.emit("region-initialized", o), i ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((l) => {
      o._setTotalDuration(l), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, t = 3) {
    var r;
    const i = (r = this.wavesurfer) === null || r === void 0 ? void 0 : r.getWrapper();
    if (!(i && i instanceof HTMLElement)) return () => {
    };
    let s = null, o = 0, l = 0;
    const a = Kr(i, { threshold: t }), c = Ur((() => {
      var u, d;
      const f = a.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        l = o / m * h;
        const g = f.x / m * h, v = (f.x + 5) / m * h;
        s = new Il(Object.assign(Object.assign({}, e), { start: g, end: v }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else f.type === "move" && f.deltaX !== void 0 ? s && s._onUpdate(f.deltaX, f.x > o ? "end" : "start", l) : f.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
    }), [a.signal]);
    return () => {
      c(), a.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((e) => e.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
}
const rs = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Mv(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = fn(null), o = fn(null), l = P(0), a = P(0), c = P(!1), u = P(!1), d = P(!1), f = P(1), h = P(1), p = P(!1), m = D(() => Qr(l.value)), g = D(() => Qr(a.value));
  function v(N, B) {
    _(), d.value = !0, u.value = !1;
    const ee = So.create();
    o.value = ee;
    const J = pr.create({
      container: N,
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
      renderFunction: Uf,
      url: B,
      plugins: [ee]
    });
    J.on("ready", () => {
      u.value = !0, d.value = !1, a.value = J.getDuration(), w();
    }), J.on("timeupdate", (ne) => {
      l.value = ne;
    }), J.on("play", () => {
      c.value = !0;
    }), J.on("pause", () => {
      c.value = !1;
    }), J.on("finish", () => {
      c.value = !1;
    }), s.value = J;
  }
  function w() {
    const N = o.value;
    if (N) {
      N.clearRegions();
      for (const B of r.value) {
        const ee = B.speakerId ? i.value.get(B.speakerId) : void 0;
        if (!ee || B.startTime == null || B.endTime == null) continue;
        const J = ee.color;
        N.addRegion({
          start: B.startTime,
          end: B.endTime,
          color: Wf(J, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", J);
      }
    }
  }
  function x() {
    s.value?.play();
  }
  function b() {
    s.value?.pause();
  }
  function k() {
    s.value?.playPause();
  }
  function C(N) {
    const B = s.value;
    !B || a.value === 0 || B.setTime(N);
  }
  function S(N) {
    C(Math.max(0, Math.min(l.value + N, a.value)));
  }
  function T(N) {
    const B = s.value;
    B && (f.value = N, B.setVolume(N), N > 0 && p.value && (p.value = !1, B.setMuted(!1)));
  }
  function E() {
    const N = s.value;
    N && (p.value = !p.value, N.setMuted(p.value));
  }
  function M(N) {
    const B = s.value;
    B && (h.value = N, B.setPlaybackRate(N));
  }
  function R() {
    const B = (rs.indexOf(
      h.value
    ) + 1) % rs.length;
    M(rs[B] ?? 1);
  }
  function _() {
    q !== null && (clearTimeout(q), q = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  se(
    [e, t],
    ([N, B]) => {
      N && B && v(N, B);
    },
    { immediate: !0 }
  );
  let q = null;
  return se([r, i], () => {
    u.value && (q !== null && clearTimeout(q), q = setTimeout(() => {
      q = null, w();
    }, 150));
  }), Hn(() => {
    _();
  }), {
    currentTime: l,
    duration: a,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: f,
    playbackRate: h,
    isMuted: p,
    formattedCurrentTime: m,
    formattedDuration: g,
    play: x,
    pause: b,
    togglePlay: k,
    seekTo: C,
    skip: S,
    setVolume: T,
    setPlaybackRate: M,
    cyclePlaybackRate: R,
    toggleMute: E
  };
}
const Ov = { class: "audio-player" }, Av = /* @__PURE__ */ $({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, s = P(null), {
      isPlaying: o,
      isReady: l,
      isLoading: a,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: f,
      formattedCurrentTime: h,
      formattedDuration: p,
      togglePlay: m,
      seekTo: g,
      pause: v,
      skip: w,
      setVolume: x,
      cyclePlaybackRate: b,
      toggleMute: k
    } = Mv({
      containerRef: s,
      audioSrc: Hr(() => r.audioSrc),
      turns: Hr(() => r.turns),
      speakers: Hr(() => r.speakers)
    });
    return se(f, (C) => i("timeupdate", C)), se(o, (C) => i("playStateChange", C)), e({ seekTo: g, pause: v }), (C, S) => (O(), U("footer", Ov, [
      K("div", {
        ref_key: "waveformRef",
        ref: s,
        class: cr(["waveform-container", { "waveform-container--loading": y(a) }])
      }, null, 2),
      z(gv, {
        "is-playing": y(o),
        "current-time": y(h),
        duration: y(p),
        volume: y(c),
        "playback-rate": y(u),
        "is-muted": y(d),
        "is-ready": y(l),
        onTogglePlay: y(m),
        onSkipBack: S[0] || (S[0] = (T) => y(w)(-10)),
        onSkipForward: S[1] || (S[1] = (T) => y(w)(10)),
        "onUpdate:volume": y(x),
        onToggleMute: y(k),
        onCyclePlaybackRate: y(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Dv = /* @__PURE__ */ Me(Av, [["__scopeId", "data-v-9248e45e"]]);
class Pv {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), l = this.removeEmpty(this.tokenize(s, r)), a = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(l, a, r, i);
  }
  diffWithOptionsObj(e, t, r, i) {
    var s;
    const o = (w) => {
      if (w = this.postProcess(w, r), i) {
        setTimeout(function() {
          i(w);
        }, 0);
        return;
      } else
        return w;
    }, l = t.length, a = e.length;
    let c = 1, u = l + a;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(h[0], t, e, 0, r);
    if (h[0].oldPos + 1 >= a && p + 1 >= l)
      return o(this.buildValues(h[0].lastComponent, t, e));
    let m = -1 / 0, g = 1 / 0;
    const v = () => {
      for (let w = Math.max(m, -c); w <= Math.min(g, c); w += 2) {
        let x;
        const b = h[w - 1], k = h[w + 1];
        b && (h[w - 1] = void 0);
        let C = !1;
        if (k) {
          const T = k.oldPos - w;
          C = k && 0 <= T && T < l;
        }
        const S = b && b.oldPos + 1 < a;
        if (!C && !S) {
          h[w] = void 0;
          continue;
        }
        if (!S || C && b.oldPos < k.oldPos ? x = this.addToPath(k, !0, !1, 0, r) : x = this.addToPath(b, !1, !0, 1, r), p = this.extractCommon(x, t, e, w, r), x.oldPos + 1 >= a && p + 1 >= l)
          return o(this.buildValues(x.lastComponent, t, e)) || !0;
        h[w] = x, x.oldPos + 1 >= a && (g = Math.min(g, w - 1)), p + 1 >= l && (m = Math.max(m, w + 1));
      }
      c++;
    };
    if (i)
      (function w() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          v() || w();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const w = v();
        if (w)
          return w;
      }
  }
  addToPath(e, t, r, i, s) {
    const o = e.lastComponent;
    return o && !s.oneChangePerToken && o.added === t && o.removed === r ? {
      oldPos: e.oldPos + i,
      lastComponent: { count: o.count + 1, added: t, removed: r, previousComponent: o.previousComponent }
    } : {
      oldPos: e.oldPos + i,
      lastComponent: { count: 1, added: t, removed: r, previousComponent: o }
    };
  }
  extractCommon(e, t, r, i, s) {
    const o = t.length, l = r.length;
    let a = e.oldPos, c = a - i, u = 0;
    for (; c + 1 < o && a + 1 < l && this.equals(r[a + 1], t[c + 1], s); )
      c++, a++, u++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return u && !s.oneChangePerToken && (e.lastComponent = { count: u, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = a, c;
  }
  equals(e, t, r) {
    return r.comparator ? r.comparator(e, t) : e === t || !!r.ignoreCase && e.toLowerCase() === t.toLowerCase();
  }
  removeEmpty(e) {
    const t = [];
    for (let r = 0; r < e.length; r++)
      e[r] && t.push(e[r]);
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
  buildValues(e, t, r) {
    const i = [];
    let s;
    for (; e; )
      i.push(e), s = e.previousComponent, delete e.previousComponent, e = s;
    i.reverse();
    const o = i.length;
    let l = 0, a = 0, c = 0;
    for (; l < o; l++) {
      const u = i[l];
      if (u.removed)
        u.value = this.join(r.slice(c, c + u.count)), c += u.count;
      else {
        if (!u.added && this.useLongestToken) {
          let d = t.slice(a, a + u.count);
          d = d.map(function(f, h) {
            const p = r[c + h];
            return p.length > f.length ? p : f;
          }), u.value = this.join(d);
        } else
          u.value = this.join(t.slice(a, a + u.count));
        a += u.count, u.added || (c += u.count);
      }
    }
    return i;
  }
}
class Nv extends Pv {
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
const Iv = new Nv();
function Rv(n, e, t) {
  return Iv.diff(n, e, t);
}
function is({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = Rv(i, s, {
    comparator: Bv
  }), l = _v(o), a = [...e];
  let c = [...e], u = 0;
  for (const h of l) {
    do
      if (u < a[0]) break;
    while (a.shift() !== void 0);
    if (a.length === 0) break;
    if ("replaced" in h && h.replaced)
      c = Jr(
        c,
        a[0],
        h.countAdded - h.countRemoved
      ), u += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const p = h;
      u += p.count, c = Jr(
        c,
        a[0],
        -p.count
      );
    } else if ("added" in h && h.added) {
      const p = h;
      c = Jr(
        c,
        a[0],
        p.count
      );
    } else
      u += h.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const p = eu(
      f,
      r
    ).map(
      (m) => m + d
    );
    c = c.concat(p);
  }
  return {
    previousIndexes: c,
    previousText: t
  };
}
function _v(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t];
    if (!r.removed) {
      e.push(r);
      continue;
    }
    if (t + 1 < n.length) {
      const i = n[t + 1];
      if (i.added) {
        e.push({
          replaced: !0,
          removed: r.removed ?? !1,
          added: i.added ?? !1,
          countRemoved: r.count,
          countAdded: i.count
        }), t++;
        continue;
      }
    }
    e.push(r);
  }
  return e;
}
function Jr(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function eu(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    Jr(
      eu(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function Bv(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let l = 0; l < i; l++)
    t[l] === r[l] && s++;
  return s / t.length > 0.8;
}
class Lv {
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
    lineHeight: r = 50,
    color: i = "white",
    font: s = "Arial",
    paddingInline: o = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = r, this.color = i, this.font = s, this.paddingInline = o, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, t, r) {
    const i = this.canvas.getContext("2d");
    i.font = `${this.fontSize}px ${this.font}`, i.fillStyle = this.color, i.fillText(e, t + this.paddingInline, r);
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
class $v extends Lv {
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
    this.resetAll(), this.currentState = is(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = is(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = is(
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
    let r = 0;
    return e.previousIndexes.length > 1 && (r = e.previousIndexes[e.previousIndexes.length - 2]), e.previousText.split(" ").slice(r, t).join(" ");
  }
  computeIfTextIsTooLong(e) {
    const t = this.canvas.getContext("2d");
    t.font = `${this.fontSize}px ${this.font}`;
    const r = this.canvas.width - 2 * this.paddingInline;
    return t.measureText(e).width > r;
  }
}
function tu(n) {
  const e = Kt();
  let t = null;
  xe(() => {
    n.canvasRef.value && (t = new $v(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), se(
    () => e.live?.partial.value,
    (a) => {
      a && t && t.newPartial(a);
    }
  );
  const r = e.onActiveTranslation("turn:add", ({ turn: a }) => {
    if (!t) return;
    const c = a.words.length > 0 ? a.words.map((u) => u.text).join(" ") : a.text ?? "";
    c && t.newFinal(c);
  });
  function i() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const s = e.on("translation:change", i), o = e.on("translation:sync", i), l = e.on("channel:sync", i);
  Er(() => {
    r(), s(), o(), l(), t?.dispose(), t = null;
  });
}
const zv = ["height"], Fv = /* @__PURE__ */ $({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Kt(), t = ur("canvas"), r = D(() => e.subtitle?.fontSize.value ?? 40), i = D(() => 1.2 * r.value), s = D(() => 2.4 * r.value);
    return tu({
      canvasRef: t,
      fontSize: r.value,
      lineHeight: i.value
    }), (o, l) => (O(), U("div", {
      class: "subtitle-banner",
      style: vn({ height: s.value + "px" })
    }, [
      K("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, zv)
    ], 4));
  }
}), Vv = /* @__PURE__ */ Me(Fv, [["__scopeId", "data-v-69ab661c"]]), qv = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Wv = ["aria-label"], Hv = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Rl = 48, jv = /* @__PURE__ */ $({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Kt(), { t } = gt(), r = ur("container"), i = ur("canvas");
    tu({
      canvasRef: i,
      fontSize: Rl,
      lineHeight: 1.2 * Rl
    }), xe(async () => {
      const l = r.value;
      if (l) {
        try {
          await l.requestFullscreen();
        } catch (a) {
          console.warn("Fullscreen API not supported:", a);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function s() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    xe(() => {
      document.addEventListener("fullscreenchange", s);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Er(() => {
      document.removeEventListener("fullscreenchange", s);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (l, a) => (O(), U("div", qv, [
      K("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": y(t)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        z(y(sc), { size: 24 })
      ], 8, Wv),
      K("canvas", Hv, null, 512)
    ], 512));
  }
}), Uv = /* @__PURE__ */ Me(jv, [["__scopeId", "data-v-dde0e356"]]), Kv = { class: "editor-layout" }, Jv = { class: "editor-body" }, Xv = {
  key: 4,
  class: "mobile-selectors"
}, Yv = /* @__PURE__ */ $({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Kt(), { t: r, locale: i } = gt(), { isMobile: s } = uc(), o = P(!1), l = D(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), a = t.speakers.all, c = D(() => [...t.channels.values()]), u = D(() => [
      ...t.activeChannel.value.translations.values()
    ]), d = D(
      () => t.activeChannel.value.activeTranslation.value.id
    ), f = D(() => Array.from(a.values())), h = ur("audioPlayer");
    function p(w) {
      t.audio && (t.audio.currentTime.value = w);
    }
    se(
      () => t.activeChannelId.value,
      () => {
        h.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), o.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((w) => h.value?.seekTo(w));
    const m = D(
      () => tc(
        u.value,
        i.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    function g(w) {
      t.setActiveChannel(w);
    }
    function v(w) {
      t.activeChannel.value.setActiveTranslation(w);
    }
    return (w, x) => (O(), U("div", Kv, [
      e.showHeader ? (O(), F(Sh, {
        key: 0,
        title: y(t).title.value,
        duration: y(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": y(s),
        onToggleSidebar: x[0] || (x[0] = (b) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : Q("", !0),
      K("main", Jv, [
        z(Zh, {
          turns: l.value,
          speakers: y(a)
        }, null, 8, ["turns", "speakers"]),
        y(s) ? Q("", !0) : (O(), F(Ol, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": y(t).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": v
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        y(s) ? (O(), F(lv, {
          key: 1,
          open: o.value,
          "onUpdate:open": x[1] || (x[1] = (b) => o.value = b)
        }, {
          default: I(() => [
            z(Ol, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": y(t).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": v
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : Q("", !0)
      ]),
      y(t).audio?.src.value ? (O(), F(Dv, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": y(t).audio.src.value,
        turns: l.value,
        speakers: y(a),
        onTimeupdate: p,
        onPlayStateChange: x[2] || (x[2] = (b) => {
          y(t).audio && (y(t).audio.isPlaying.value = b);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : Q("", !0),
      y(t).subtitle?.isVisible.value && !y(s) && !y(t).subtitle.isFullscreen.value ? (O(), F(Vv, { key: 2 })) : Q("", !0),
      y(t).subtitle?.isFullscreen.value ? (O(), F(Uv, { key: 3 })) : Q("", !0),
      y(s) && (c.value.length > 1 || u.value.length > 1) ? (O(), U("div", Xv, [
        c.value.length > 1 ? (O(), F(Kc, {
          key: 0,
          channels: c.value,
          "selected-channel-id": y(t).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : Q("", !0),
        u.value.length > 1 ? (O(), F(xo, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: y(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": v
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : Q("", !0)
      ])) : Q("", !0)
    ]));
  }
}), G1 = /* @__PURE__ */ Me(Yv, [["__scopeId", "data-v-82b5e48c"]]);
function Z1() {
  return {
    name: "audio",
    install(n) {
      const e = P(0), t = P(!1);
      let r = null;
      const i = D(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function s(a) {
        r?.(a);
      }
      function o(a) {
        r = a;
      }
      const l = {
        currentTime: e,
        isPlaying: t,
        src: i,
        seekTo: s,
        setSeekHandler: o
      };
      return n.audio = l, () => {
        n.audio = void 0;
      };
    }
  };
}
function ke(n) {
  this.content = n;
}
ke.prototype = {
  constructor: ke,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n) return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), s = r.content.slice();
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new ke(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new ke(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new ke([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new ke(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new ke(i);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = ke.from(n), n.size ? new ke(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = ke.from(n), n.size ? new ke(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = ke.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
ke.from = function(n) {
  if (n instanceof ke) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new ke(e);
};
function nu(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), s = e.child(r);
    if (i == s) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(s))
      return t;
    if (i.isText && i.text != s.text) {
      for (let o = 0; i.text[o] == s.text[o]; o++)
        t++;
      return t;
    }
    if (i.content.size || s.content.size) {
      let o = nu(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function ru(n, e, t, r) {
  for (let i = n.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: t, b: r };
    let o = n.child(--i), l = e.child(--s), a = o.nodeSize;
    if (o == l) {
      t -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: t, b: r };
    if (o.isText && o.text != l.text) {
      let c = 0, u = Math.min(o.text.length, l.text.length);
      for (; c < u && o.text[o.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = ru(o.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
class A {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, i = 0, s) {
    for (let o = 0, l = 0; l < t; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, i + l, s || null, o) !== !1 && a.content.size) {
        let u = l + 1;
        a.nodesBetween(Math.max(0, e - u), Math.min(a.content.size, t - u), r, i + u);
      }
      l = c;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, i) {
    let s = "", o = !0;
    return this.nodesBetween(e, t, (l, a) => {
      let c = l.isText ? l.text.slice(Math.max(e, a) - a, t - a) : l.isLeaf ? i ? typeof i == "function" ? i(l) : i : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && c || l.isTextblock) && r && (o ? o = !1 : s += r), s += c;
    }, 0), s;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), s = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), s = 1); s < e.content.length; s++)
      i.push(e.content[s]);
    return new A(i, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let s = 0, o = 0; o < t; s++) {
        let l = this.content[s], a = o + l.nodeSize;
        a > e && ((o < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, t - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, t - o - 1))), r.push(l), i += l.nodeSize), o = a;
      }
    return new A(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? A.empty : e == 0 && t == this.content.length ? this : new A(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), s = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new A(i, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new A([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new A(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return nu(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return ru(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Br(0, e);
    if (e == this.size)
      return Br(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? Br(t + 1, s) : Br(t, r);
      r = s;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return A.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new A(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return A.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new A(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return A.empty;
    if (e instanceof A)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new A([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
A.empty = new A([], 0);
const ss = { index: 0, offset: 0 };
function Br(n, e) {
  return ss.index = n, ss.offset = e, ss;
}
function oi(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!oi(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !oi(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let ie = class $s {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      if (this.eq(s))
        return e;
      if (this.type.excludes(s.type))
        t || (t = e.slice(0, i));
      else {
        if (s.type.excludes(this.type))
          return e;
        !r && s.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(s);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && oi(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    let i = r.create(t.attrs);
    return r.checkAttrs(i.attrs), i;
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return $s.none;
    if (e instanceof $s)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
ie.none = [];
class li extends Error {
}
class L {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = su(this.content, e + this.openStart, t);
    return r && new L(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new L(iu(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return L.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new L(A.fromJSON(e, t.content), r, i);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let s = e.firstChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.firstChild)
      r++;
    for (let s = e.lastChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.lastChild)
      i++;
    return new L(e, r, i);
  }
}
L.empty = new L(A.empty, 0, 0);
function iu(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (i == e || s.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(iu(s.content, e - i - 1, t - i - 1)));
}
function su(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = su(o.content, e - s - 1, t, o);
  return l && n.replaceChild(i, o.copy(l));
}
function Gv(n, e, t) {
  if (t.openStart > n.depth)
    throw new li("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new li("Inconsistent open depths");
  return ou(n, e, t, 0);
}
function ou(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = ou(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return an(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = Zv(t, n);
      return an(s, au(n, o, l, e, r));
    }
  else return an(s, ai(n, e, r));
}
function lu(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new li("Cannot join " + e.type.name + " onto " + n.type.name);
}
function zs(n, e, t) {
  let r = n.node(t);
  return lu(r, e.node(t)), r;
}
function ln(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function ir(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (ln(n.nodeAfter, r), s++));
  for (let l = s; l < o; l++)
    ln(i.child(l), r);
  e && e.depth == t && e.textOffset && ln(e.nodeBefore, r);
}
function an(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function au(n, e, t, r, i) {
  let s = n.depth > i && zs(n, e, i + 1), o = r.depth > i && zs(t, r, i + 1), l = [];
  return ir(null, n, i, l), s && o && e.index(i) == t.index(i) ? (lu(s, o), ln(an(s, au(n, e, t, r, i + 1)), l)) : (s && ln(an(s, ai(n, e, i + 1)), l), ir(e, t, i, l), o && ln(an(o, ai(t, r, i + 1)), l)), ir(r, null, i, l), new A(l);
}
function ai(n, e, t) {
  let r = [];
  if (ir(null, n, t, r), n.depth > t) {
    let i = zs(n, e, t + 1);
    ln(an(i, ai(n, e, t + 1)), r);
  }
  return ir(e, null, t, r), new A(r);
}
function Zv(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(A.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class mr {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let s = 0; s < e; s++)
      i += r.child(s).nodeSize;
    return i;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return ie.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = i, i = l;
    }
    let s = r.marks;
    for (var o = 0; o < s.length; o++)
      s[o].type.spec.inclusive === !1 && (!i || !s[o].isInSet(i.marks)) && (s = s[o--].removeFromSet(s));
    return s;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var s = 0; s < r.length; s++)
      r[s].type.spec.inclusive === !1 && (!i || !r[s].isInSet(i.marks)) && (r = r[s--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new ci(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, s = t;
    for (let o = e; ; ) {
      let { index: l, offset: a } = o.content.findIndex(s), c = s - a;
      if (r.push(o, l, i + a), !c || (o = o.child(l), o.isText))
        break;
      s = c - 1, i += a + 1;
    }
    return new mr(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = _l.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      _l.set(e, r = new Qv());
    let i = r.elts[r.i] = mr.resolve(e, t);
    return r.i = (r.i + 1) % eb, i;
  }
}
class Qv {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const eb = 12, _l = /* @__PURE__ */ new WeakMap();
class ci {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const tb = /* @__PURE__ */ Object.create(null);
let $t = class Fs {
  /**
  @internal
  */
  constructor(e, t, r, i = ie.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || A.empty;
  }
  /**
  The array of this node's child nodes.
  */
  get children() {
    return this.content.content;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](https://prosemirror.net/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec.leafText) will be used.
  */
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && oi(this.attrs, t || e.defaultAttrs || tb) && ie.sameSet(this.marks, r || ie.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Fs(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Fs(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return L.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), l = i.start(o), c = i.node(o).content.cut(i.pos - l, s.pos - l);
    return new L(c, i.depth - o, s.depth - o);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return Gv(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return mr.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return mr.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (s) => (r.isInSet(s.marks) && (i = !0), !i)), i;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), cu(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = A.empty, i = 0, s = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, i, s), l = o && o.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = i; a < s; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let s = this.contentMatchAt(e).matchType(r), o = s && s.matchFragment(this.content, t);
    return o ? o.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise an exception when they do not.
  */
  check() {
    this.type.checkContent(this.content), this.type.checkAttrs(this.attrs);
    let e = ie.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!ie.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = A.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
$t.prototype.text = void 0;
class ui extends $t {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : cu(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new ui(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new ui(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function cu(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class pn {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new nb(e, t);
    if (r.next == null)
      return pn.empty;
    let i = uu(r);
    r.next && r.err("Unexpected trailing text");
    let s = cb(ab(i));
    return ub(s, r), s;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let s = t; i && s < r; s++)
      i = i.matchType(e.child(s).type);
    return i;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function s(o, l) {
      let a = o.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return A.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: u, next: d } = o.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let f = s(d, l.concat(u));
          if (f)
            return f;
        }
      }
      return null;
    }
    return s(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), s = i.match;
      if (s.matchType(e)) {
        let o = [];
        for (let l = i; l.type; l = l.via)
          o.push(l.type);
        return o.reverse();
      }
      for (let o = 0; o < s.next.length; o++) {
        let { type: l, next: a } = s.next[o];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!i.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: i }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let s = i + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        s += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return s;
    }).join(`
`);
  }
}
pn.empty = new pn(!0);
class nb {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function uu(n) {
  let e = [];
  do
    e.push(rb(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function rb(n) {
  let e = [];
  do
    e.push(ib(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function ib(n) {
  let e = lb(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = sb(n, e);
    else
      break;
  return e;
}
function Bl(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function sb(n, e) {
  let t = Bl(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Bl(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function ob(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let s in t) {
    let o = t[s];
    o.isInGroup(e) && i.push(o);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function lb(n) {
  if (n.eat("(")) {
    let e = uu(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = ob(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function ab(n) {
  let e = [[]];
  return i(s(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, l, a) {
    let c = { term: a, to: l };
    return e[o].push(c), c;
  }
  function i(o, l) {
    o.forEach((a) => a.to = l);
  }
  function s(o, l) {
    if (o.type == "choice")
      return o.exprs.reduce((a, c) => a.concat(s(c, l)), []);
    if (o.type == "seq")
      for (let a = 0; ; a++) {
        let c = s(o.exprs[a], l);
        if (a == o.exprs.length - 1)
          return c;
        i(c, l = t());
      }
    else if (o.type == "star") {
      let a = t();
      return r(l, a), i(s(o.expr, a), a), [r(a)];
    } else if (o.type == "plus") {
      let a = t();
      return i(s(o.expr, l), a), i(s(o.expr, a), a), [r(a)];
    } else {
      if (o.type == "opt")
        return [r(l)].concat(s(o.expr, l));
      if (o.type == "range") {
        let a = l;
        for (let c = 0; c < o.min; c++) {
          let u = t();
          i(s(o.expr, a), u), a = u;
        }
        if (o.max == -1)
          i(s(o.expr, a), a);
        else
          for (let c = o.min; c < o.max; c++) {
            let u = t();
            r(a, u), i(s(o.expr, a), u), a = u;
          }
        return [r(a)];
      } else {
        if (o.type == "name")
          return [r(l, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function du(n, e) {
  return e - n;
}
function Ll(n, e) {
  let t = [];
  return r(e), t.sort(du);
  function r(i) {
    let s = n[i];
    if (s.length == 1 && !s[0].term)
      return r(s[0].to);
    t.push(i);
    for (let o = 0; o < s.length; o++) {
      let { term: l, to: a } = s[o];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function cb(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Ll(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == l && (c = i[u][1]);
        Ll(n, a).forEach((u) => {
          c || i.push([l, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new pn(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let l = i[o][1].sort(du);
      s.next.push({ type: i[o][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function ub(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      o.push(a.name), s && !(a.isText || a.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function fu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function hu(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let s = n[r];
      if (s.hasDefault)
        i = s.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function pu(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function mu(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new fb(n, r, e[r]);
  return t;
}
let $l = class gu {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = mu(e, r.attrs), this.defaultAttrs = fu(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == pn.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  Return true when this node type is part of the given
  [group](https://prosemirror.net/docs/ref/#model.NodeSpec.group).
  */
  isInGroup(e) {
    return this.groups.indexOf(e) > -1;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : hu(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new $t(this, this.computeAttrs(e), A.from(t), ie.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = A.from(t), this.checkContent(t), new $t(this, this.computeAttrs(e), t, ie.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = A.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(A.empty, !0);
    return s ? new $t(this, e, t.append(s), ie.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  @internal
  */
  checkAttrs(e) {
    pu(this.attrs, e, "node", this.name);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : ie.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new gu(s, t, o));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let s in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
function db(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class fb {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? db(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Pi {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = mu(e, i.attrs), this.excluded = null;
    let s = fu(this.attrs);
    this.instance = s ? new ie(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new ie(this, hu(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Pi(s, i++, t, o)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  @internal
  */
  checkAttrs(e) {
    pu(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class yu {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = ke.from(e.nodes), t.marks = ke.from(e.marks || {}), this.nodes = $l.compile(this.spec.nodes, this), this.marks = Pi.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", l = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = pn.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = l == "_" ? null : l ? zl(this, l.split(" ")) : l == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : zl(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => $t.fromJSON(this, i), this.markFromJSON = (i) => ie.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof $l) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new ui(r, r.defaultAttrs, e, ie.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function zl(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], s = n.marks[i], o = s;
    if (s)
      t.push(s);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (i == "_" || a.spec.group && a.spec.group.split(" ").indexOf(i) > -1) && t.push(o = a);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function hb(n) {
  return n.tag != null;
}
function pb(n) {
  return n.style != null;
}
class zt {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (hb(i))
        this.tags.push(i);
      else if (pb(i)) {
        let s = /[^=]*/.exec(i.style)[0];
        r.indexOf(s) < 0 && r.push(s), this.styles.push(i);
      }
    }), this.normalizeLists = !this.tags.some((i) => {
      if (!/^(ul|ol)\b/.test(i.tag) || !i.node)
        return !1;
      let s = e.nodes[i.node];
      return s.contentMatch.matchType(s);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Vl(this, t, !1);
    return r.addAll(e, ie.none, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Vl(this, t, !0);
    return r.addAll(e, ie.none, t.from, t.to), L.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (yb(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
        if (s.getAttrs) {
          let o = s.getAttrs(e);
          if (o === !1)
            continue;
          s.attrs = o || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, i) {
    for (let s = i ? this.styles.indexOf(i) + 1 : 0; s < this.styles.length; s++) {
      let o = this.styles[s], l = o.style;
      if (!(l.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (o.getAttrs) {
          let a = o.getAttrs(t);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let s = i.priority == null ? 50 : i.priority, o = 0;
      for (; o < t.length; o++) {
        let l = t[o];
        if ((l.priority == null ? 50 : l.priority) < s)
          break;
      }
      t.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = ql(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = ql(o)), o.node || o.ignore || o.mark || (o.node = i);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.GenericParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new zt(e, zt.schemaRules(e)));
  }
}
const vu = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, mb = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, bu = { ol: !0, ul: !0 }, gr = 1, Vs = 2, sr = 4;
function Fl(n, e, t) {
  return e != null ? (e ? gr : 0) | (e === "full" ? Vs : 0) : n && n.whitespace == "pre" ? gr | Vs : t & ~sr;
}
class Lr {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = ie.none, this.match = s || (o & sr ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(A.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & gr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = A.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(A.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !vu.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Vl {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = Fl(null, t.preserveWhitespace, 0) | (r ? sr : 0);
    i ? s = new Lr(i.type, i.attrs, ie.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new Lr(null, null, ie.none, !0, null, o) : s = new Lr(e.schema.topNodeType, null, ie.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e, t) {
    e.nodeType == 3 ? this.addTextNode(e, t) : e.nodeType == 1 && this.addElement(e, t);
  }
  addTextNode(e, t) {
    let r = e.nodeValue, i = this.top, s = i.options & Vs ? "full" : this.localPreserveWS || (i.options & gr) > 0, { schema: o } = this.parser;
    if (s === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (s)
        if (s === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (o.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(o.linebreakReplacement.create())) {
          let l = r.split(/\r?\n|\r/);
          for (let a = 0; a < l.length; a++)
            a && this.insertNode(o.linebreakReplacement.create(), t, !0), l[a] && this.insertNode(o.text(l[a]), t, !/\S/.test(l[a]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let l = i.content[i.content.length - 1], a = e.previousSibling;
        (!l || a && a.nodeName == "BR" || l.isText && /[ \t\r\n\u000c]$/.test(l.text)) && (r = r.slice(1));
      }
      r && this.insertNode(o.text(r), t, !/\S/.test(r)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t, r) {
    let i = this.localPreserveWS, s = this.top;
    (e.tagName == "PRE" || /pre/.test(e.style && e.style.whiteSpace)) && (this.localPreserveWS = !0);
    let o = e.nodeName.toLowerCase(), l;
    bu.hasOwnProperty(o) && this.parser.normalizeLists && gb(e);
    let a = this.options.ruleFromNode && this.options.ruleFromNode(e) || (l = this.parser.matchTag(e, this, r));
    e: if (a ? a.ignore : mb.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!a || a.skip || a.closeParent) {
      a && a.closeParent ? this.open = Math.max(0, this.open - 1) : a && a.skip.nodeType && (e = a.skip);
      let c, u = this.needsBlock;
      if (vu.hasOwnProperty(o))
        s.content.length && s.content[0].isInline && this.open && (this.open--, s = this.top), c = !0, s.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let d = a && a.skip ? t : this.readStyles(e, t);
      d && this.addAll(e, d), c && this.sync(s), this.needsBlock = u;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, a, c, a.consuming === !1 ? l : void 0);
    }
    this.localPreserveWS = i;
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e, t) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`), t);
  }
  // Called for ignored nodes
  ignoreFallback(e, t) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"), t, !0);
  }
  // Run any style parser associated with the node's styles. Either
  // return an updated array of marks, or null to indicate some of the
  // styles had a rule with `ignore` set.
  readStyles(e, t) {
    let r = e.style;
    if (r && r.length)
      for (let i = 0; i < this.parser.matchedStyles.length; i++) {
        let s = this.parser.matchedStyles[i], o = r.getPropertyValue(s);
        if (o)
          for (let l = void 0; ; ) {
            let a = this.parser.matchStyle(s, o, this, l);
            if (!a)
              break;
            if (a.ignore)
              return null;
            if (a.clearMark ? t = t.filter((c) => !a.clearMark(c)) : t = t.concat(this.parser.schema.marks[a.mark].create(a.attrs)), a.consuming === !1)
              l = a;
            else
              break;
          }
      }
    return t;
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r, i) {
    let s, o;
    if (t.node)
      if (o = this.parser.schema.nodes[t.node], o.isLeaf)
        this.insertNode(o.create(t.attrs), r, e.nodeName == "BR") || this.leafFallback(e, r);
      else {
        let a = this.enter(o, t.attrs || null, r, t.preserveWhitespace);
        a && (s = !0, r = a);
      }
    else {
      let a = this.parser.schema.marks[t.mark];
      r = r.concat(a.create(t.attrs));
    }
    let l = this.top;
    if (o && o.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, r, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a, r, !1));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a, r), this.findAround(e, a, !1);
    }
    s && this.sync(l) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, i) {
    let s = r || 0;
    for (let o = r ? e.childNodes[r] : e.firstChild, l = i == null ? null : e.childNodes[i]; o != l; o = o.nextSibling, ++s)
      this.findAtPoint(e, s), this.addDOM(o, t);
    this.findAtPoint(e, s);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let i, s;
    for (let o = this.open, l = 0; o >= 0; o--) {
      let a = this.nodes[o], c = a.findWrapping(e);
      if (c && (!i || i.length > c.length + l) && (i = c, s = a, !c.length))
        break;
      if (a.solid) {
        if (r)
          break;
        l += 2;
      }
    }
    if (!i)
      return null;
    this.sync(s);
    for (let o = 0; o < i.length; o++)
      t = this.enterInner(i[o], null, t, !1);
    return t;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e, t, r) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let s = this.textblockFromContext();
      s && (t = this.enterInner(s, null, t));
    }
    let i = this.findPlace(e, t, r);
    if (i) {
      this.closeExtra();
      let s = this.top;
      s.match && (s.match = s.match.matchType(e.type));
      let o = ie.none;
      for (let l of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(l.type) : Wl(l.type, e.type)) && (o = l.addToSet(o));
      return s.content.push(e.mark(o)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r, i) {
    let s = this.findPlace(e.create(t), r, !1);
    return s && (s = this.enterInner(e, t, r, !0, i)), s;
  }
  // Open a node of the given type
  enterInner(e, t, r, i = !1, s) {
    this.closeExtra();
    let o = this.top;
    o.match = o.match && o.match.matchType(e);
    let l = Fl(e, s, o.options);
    o.options & sr && o.content.length == 0 && (l |= sr);
    let a = ie.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : Wl(c.type, e)) ? (a = c.addToSet(a), !1) : !0), this.nodes.push(new Lr(e, t, a, i, null, l)), this.open++, r;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(!!(this.isOpen || this.options.topOpen));
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) {
      if (this.nodes[t] == e)
        return this.open = t, !0;
      this.localPreserveWS && (this.nodes[t].options |= gr);
    }
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= s; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let u = a > 0 || a == 0 && i ? this.nodes[a].type : r && a >= s ? r.node(a - s).type : null;
          if (!u || u.name != c && !u.isInGroup(c))
            return !1;
          a--;
        }
      }
      return !0;
    };
    return o(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
}
function gb(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && bu.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function yb(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function ql(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Wl(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let s = [], o = (l) => {
      s.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: u } = l.edge(a);
        if (c == e || s.indexOf(u) < 0 && o(u))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
class xn {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = ls(t).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < s.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(s[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < s.length; )
          i = s.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], u = this.serializeMark(c, o.isInline, t);
          u && (s.push([c, i]), i.appendChild(u.dom), i = u.contentDOM || u.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(o, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: i } = Xr(ls(t), this.nodes[e.type.name](e), null, e.attrs);
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let s = this.serializeMark(e.marks[i], e.isInline, t);
      s && ((s.contentDOM || s.dom).appendChild(r), r = s.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && Xr(ls(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Xr(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new xn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Hl(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Hl(e.marks);
  }
}
function Hl(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function ls(n) {
  return n.document || window.document;
}
const jl = /* @__PURE__ */ new WeakMap();
function vb(n) {
  let e = jl.get(n);
  return e === void 0 && jl.set(n, e = bb(n)), e;
}
function bb(n) {
  let e = null;
  function t(r) {
    if (r && typeof r == "object")
      if (Array.isArray(r))
        if (typeof r[0] == "string")
          e || (e = []), e.push(r);
        else
          for (let i = 0; i < r.length; i++)
            t(r[i]);
      else
        for (let i in r)
          t(r[i]);
  }
  return t(n), e;
}
function Xr(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = vb(r)) && s.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let o = i.indexOf(" ");
  o > 0 && (t = i.slice(0, o), i = i.slice(o + 1));
  let l, a = t ? n.createElementNS(t, i) : n.createElement(i), c = e[1], u = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    u = 2;
    for (let d in c)
      if (c[d] != null) {
        let f = d.indexOf(" ");
        f > 0 ? a.setAttributeNS(d.slice(0, f), d.slice(f + 1), c[d]) : d == "style" && a.style ? a.style.cssText = c[d] : a.setAttribute(d, c[d]);
      }
  }
  for (let d = u; d < e.length; d++) {
    let f = e[d];
    if (f === 0) {
      if (d < e.length - 1 || d > u)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: a, contentDOM: a };
    } else {
      let { dom: h, contentDOM: p } = Xr(n, f, t, r);
      if (a.appendChild(h), p) {
        if (l)
          throw new RangeError("Multiple content holes");
        l = p;
      }
    }
  }
  return { dom: a, contentDOM: l };
}
const wu = 65535, xu = Math.pow(2, 16);
function wb(n, e) {
  return n + e * xu;
}
function Ul(n) {
  return n & wu;
}
function xb(n) {
  return (n - (n & wu)) / xu;
}
const Su = 1, ku = 2, Yr = 4, Cu = 8;
class qs {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Cu) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Su | Yr)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (ku | Yr)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Yr) > 0;
  }
}
class We {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && We.empty)
      return We.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Ul(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + xb(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0, s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], u = this.ranges[l + o], d = a + c;
      if (e <= d) {
        let f = c ? e == a ? -1 : e == d ? 1 : t : t, h = a + i + (f < 0 ? 0 : u);
        if (r)
          return h;
        let p = e == (t < 0 ? a : d) ? null : wb(l / 3, e - a), m = e == a ? ku : e == d ? Su : Yr;
        return (t < 0 ? e != a : e != d) && (m |= Cu), new qs(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new qs(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Ul(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], u = a + c;
      if (e <= u && l == i * 3)
        return !0;
      r += this.ranges[l + o] - c;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, s = 0; i < this.ranges.length; i += 3) {
      let o = this.ranges[i], l = o - (this.inverted ? s : 0), a = o + (this.inverted ? 0 : s), c = this.ranges[i + t], u = this.ranges[i + r];
      e(l, l + c, a, a + u), s += u - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new We(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? We.empty : new We(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
We.empty = new We([]);
class yr {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e, t, r = 0, i = e ? e.length : 0) {
    this.mirror = t, this.from = r, this.to = i, this._maps = e || [], this.ownData = !(e || t);
  }
  /**
  The step maps in this mapping.
  */
  get maps() {
    return this._maps;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new yr(this._maps, this.mirror, e, t);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.ownData || (this._maps = this._maps.slice(), this.mirror = this.mirror && this.mirror.slice(), this.ownData = !0), this.to = this._maps.push(e), t != null && this.setMirror(this._maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this._maps.length; t < e._maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this._maps.length + e._maps.length; t >= 0; t--) {
      let i = e.getMirror(t);
      this.appendMap(e._maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new yr();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this._maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let i = 0;
    for (let s = this.from; s < this.to; s++) {
      let o = this._maps[s], l = o.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(s);
        if (a != null && a > s && a < this.to) {
          s = a, e = this._maps[a].recover(l.recover);
          continue;
        }
      }
      i |= l.delInfo, e = l.pos;
    }
    return r ? e : new qs(e, i, null);
  }
}
const as = /* @__PURE__ */ Object.create(null);
class De {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return We.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = as[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in as)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return as[e] = t, t.prototype.jsonID = e, t;
  }
}
class he {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new he(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new he(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return he.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof li)
        return he.fail(s.message);
      throw s;
    }
  }
}
function ko(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(ko(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return A.fromArray(r);
}
class _t extends De {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new L(ko(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return he.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new it(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new _t(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof _t && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new _t(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new _t(t.from, t.to, e.markFromJSON(t.mark));
  }
}
De.jsonID("addMark", _t);
class it extends De {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new L(ko(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return he.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new _t(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new it(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof it && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new it(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new it(t.from, t.to, e.markFromJSON(t.mark));
  }
}
De.jsonID("removeMark", it);
class Bt extends De {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return he.fromReplace(e, this.pos, this.pos + 1, new L(A.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new Bt(this.pos, t.marks[i]);
        return new Bt(this.pos, this.mark);
      }
    }
    return new mn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Bt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Bt(t.pos, e.markFromJSON(t.mark));
  }
}
De.jsonID("addNodeMark", Bt);
class mn extends De {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return he.fromReplace(e, this.pos, this.pos + 1, new L(A.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Bt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new mn(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new mn(t.pos, e.markFromJSON(t.mark));
  }
}
De.jsonID("removeNodeMark", mn);
class ve extends De {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && Ws(e, this.from, this.to) ? he.fail("Structure replace would overwrite content") : he.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new We([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new ve(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new ve(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof ve) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? L.empty : new L(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new ve(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? L.empty : new L(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new ve(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new ve(t.from, t.to, L.fromJSON(e, t.slice), !!t.structure);
  }
}
De.jsonID("replace", ve);
class be extends De {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, s, o, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Ws(e, this.from, this.gapFrom) || Ws(e, this.gapTo, this.to)))
      return he.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return he.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? he.fromReplace(e, this.from, this.to, r) : he.fail("Content does not fit in gap");
  }
  getMap() {
    return new We([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new be(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new be(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new be(t.from, t.to, t.gapFrom, t.gapTo, L.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
De.jsonID("replaceAround", be);
function Ws(n, e, t) {
  let r = n.resolve(e), i = t - e, s = r.depth;
  for (; i > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
    s--, i--;
  if (i > 0) {
    let o = r.node(s).maybeChild(r.indexAfter(s));
    for (; i > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, i--;
    }
  }
  return !1;
}
function Sb(n, e, t, r) {
  let i = [], s = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, u) => {
    if (!a.isInline)
      return;
    let d = a.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + a.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new it(f, h, d[m])));
      l && l.to == f ? l.to = h : s.push(l = new _t(f, h, r));
    }
  }), i.forEach((a) => n.step(a)), s.forEach((a) => n.step(a));
}
function kb(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    s++;
    let a = null;
    if (r instanceof Pi) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, t);
      for (let u = 0; u < a.length; u++) {
        let d = a[u], f;
        for (let h = 0; h < i.length; h++) {
          let p = i[h];
          p.step == s - 1 && d.eq(i[h].style) && (f = p);
        }
        f ? (f.to = c, f.step = s) : i.push({ style: d, from: Math.max(l, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => n.step(new it(o.from, o.to, o.style)));
}
function Co(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < s.childCount; a++) {
    let c = s.child(a), u = l + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new ve(l, u, L.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new it(l, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new L(A.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new ve(l + f.index, l + f.index + f[0].length, p));
      }
    }
    l = u;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(A.empty, !0);
    n.replace(l, l, new L(a, 0, 0));
  }
  for (let a = o.length - 1; a >= 0; a--)
    n.step(o[a]);
}
function Cb(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Kn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), l = n.$from.index(r) + i, a = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(l, a, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Cb(o, l, a))
      break;
    l && (i = 1), a < o.childCount && (s = 1);
  }
  return null;
}
function Eb(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), l = i.after(s + 1), a = o, c = l, u = A.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = A.from(r.node(p).copy(u)), d++) : a--;
  let f = A.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = A.from(i.node(p).copy(f)), h++) : c++;
  n.step(new be(a, c, o, l, new L(u.append(f), d, h), u.size - d, !0));
}
function Eu(n, e, t = null, r = n) {
  let i = Tb(n, e), s = i && Mb(r, e);
  return s ? i.map(Kl).concat({ type: e, attrs: t }).concat(s.map(Kl)) : null;
}
function Kl(n) {
  return { type: n, attrs: null };
}
function Tb(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function Mb(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function Ob(n, e, t) {
  let r = A.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = A.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new be(i, s, i, s, new L(r, 0, 0), t.length, !0));
}
function Ab(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    let a = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, a) && Db(n.doc, n.mapping.slice(s).map(l), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && Mu(n, o, l, s), Co(n, n.mapping.slice(s).map(l, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(l, 1), f = u.map(l + o.nodeSize, 1);
      return n.step(new be(d, f, d + 1, f - 1, new L(A.from(r.create(a, null, o.marks)), 0, 0), 1, !0)), c === !0 && Tu(n, o, l, s), !1;
    }
  });
}
function Tu(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.isText) {
      let o, l = /\r?\n|\r/g;
      for (; o = l.exec(i.text); ) {
        let a = n.mapping.slice(r).map(t + 1 + s + o.index);
        n.replaceWith(a, a + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Mu(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Db(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Pb(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new be(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new L(A.from(o), 0, 0), 1, !0));
}
function kt(n, e, t = 1, r) {
  let i = n.resolve(e), s = i.depth - t, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, u = t - 2; c > s; c--, u--) {
    let d = i.node(c), f = i.index(c);
    if (d.type.spec.isolating)
      return !1;
    let h = d.content.cutByIndex(f, d.childCount), p = r && r[u + 1];
    p && (h = h.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[u] || d;
    if (!d.canReplace(f + 1, d.childCount) || !m.type.validContent(h))
      return !1;
  }
  let l = i.indexAfter(s), a = r && r[0];
  return i.node(s).canReplaceWith(l, l, a ? a.type : i.node(s + 1).type);
}
function Nb(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = A.empty, o = A.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    s = A.from(i.node(l).copy(s));
    let u = r && r[c];
    o = A.from(u ? u.type.create(u.attrs, o) : i.node(l).copy(o));
  }
  n.step(new ve(e, e, new L(s.append(o), t, t), !0));
}
function Sn(n, e) {
  let t = n.resolve(e), r = t.index();
  return Ou(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Ib(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function Ou(n, e) {
  return !!(n && e && !n.isLeaf && Ib(n, e));
}
function Ni(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, l = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), l++, o = r.node(i).maybeChild(l)) : (s = r.node(i).maybeChild(l - 1), o = r.node(i + 1)), s && !s.isTextblock && Ou(s, o) && r.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Rb(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let l = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Mu(n, u.node(), u.before(), l);
  }
  o.inlineContent && Co(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let a = n.mapping.slice(l), c = a.map(e - t);
  if (n.step(new ve(c, a.map(e + t, -1), L.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Tu(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function _b(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.index(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.before(i + 1);
      if (s > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.indexAfter(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.after(i + 1);
      if (s < r.node(i).childCount)
        return null;
    }
  return null;
}
function Au(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let s = 0; s < t.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), u = !1;
      if (s == 1)
        u = c.canReplace(a, a, i);
      else {
        let d = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        u = d && c.canReplaceWith(a, a, d[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function Ii(n, e, t = e, r = L.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Du(i, s, r) ? new ve(e, t, r) : new Bb(i, s, r).fit();
}
function Du(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Bb {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = A.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = A.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let s = this.placed, o = r.depth, l = i.depth;
    for (; o && l && s.childCount == 1; )
      s = s.firstChild.content, o--, l--;
    let a = new L(s, o, l);
    return e > -1 ? new be(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new ve(r.pos, i.pos, a) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, i = this.unplaced.openEnd; r < e; r++) {
      let s = t.firstChild;
      if (t.childCount > 1 && (i = 0), s.type.spec.isolating && i <= r) {
        e = r;
        break;
      }
      t = s.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let i, s = null;
        r ? (s = cs(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(A.from(o), !1)) : s && a.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: u };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = cs(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new L(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = cs(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new L(Qn(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new L(Qn(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: s }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (s)
      for (let m = 0; m < s.length; m++)
        this.openFrontierNode(s[m]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, u = [], { match: d, type: f } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        u.push(i.child(m));
      d = d.matchFragment(i);
    }
    let h = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c), g = d.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || a == 0 || m.content.size) && (d = g, u.push(Pu(m.mark(f.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? h : -1)));
    }
    let p = c == l.childCount;
    p || (h = -1), this.placed = er(this.placed, t, A.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < h; m++) {
      let v = g.lastChild;
      this.frontier.push({ type: v.type, match: v.contentMatchAt(v.childCount) }), g = v.content;
    }
    this.unplaced = p ? e == 0 ? L.empty : new L(Qn(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new L(Qn(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !us(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = us(e, t, i, r, s);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], u = us(e, l, c, a, !0);
          if (!u || u.childCount)
            continue e;
        }
        return { depth: t, fit: o, move: s ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = er(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = er(this.placed, this.depth, A.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(A.empty, !0);
    t.childCount && (this.placed = er(this.placed, this.frontier.length, t));
  }
}
function Qn(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Qn(n.firstChild.content, e - 1, t)));
}
function er(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(er(n.lastChild.content, e - 1, t)));
}
function cs(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Pu(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Pu(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(A.empty, !0)))), n.copy(r);
}
function us(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, o);
  return l && !Lb(t, s.content, o) ? l : null;
}
function Lb(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function $b(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function zb(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Du(i, s, r))
    return n.step(new ve(e, t, r));
  let o = Iu(i, s);
  o[o.length - 1] == 0 && o.pop();
  let l = -(i.depth + 1);
  o.unshift(l);
  for (let f = i.depth, h = i.pos - 1; f > 0; f--, h--) {
    let p = i.node(f).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(f) > -1 ? l = f : i.before(f) == h && o.splice(1, 0, -f);
  }
  let a = o.indexOf(l), c = [], u = r.openStart;
  for (let f = r.content, h = 0; ; h++) {
    let p = f.firstChild;
    if (c.push(p), h == r.openStart)
      break;
    f = p.content;
  }
  for (let f = u - 1; f >= 0; f--) {
    let h = c[f], p = $b(h.type);
    if (p && !h.sameMarkup(i.node(Math.abs(l) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + a) % o.length], v = !0;
        g < 0 && (v = !1, g = -g);
        let w = i.node(g - 1), x = i.index(g - 1);
        if (w.canReplaceWith(x, x, p.type, p.marks))
          return n.replace(i.before(g), v ? s.after(g) : t, new L(Nu(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function Nu(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(Nu(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(A.empty, !0));
  }
  return n;
}
function Fb(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = _b(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new L(A.from(r), 0, 0));
}
function Vb(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Iu(r, i);
  for (let o = 0; o < s.length; o++) {
    let l = s[o], a = o == s.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), i.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1))))
      return n.delete(r.before(l), i.after(l));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && i.end(o) - t != i.depth - o && r.start(o - 1) == i.start(o - 1) && r.node(o - 1).canReplace(r.index(o - 1), i.index(o - 1)))
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function Iu(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class _n extends De {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return he.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return he.fromReplace(e, this.pos, this.pos + 1, new L(A.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return We.empty;
  }
  invert(e) {
    return new _n(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new _n(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new _n(t.pos, t.attr, t.value);
  }
}
De.jsonID("attr", _n);
class vr extends De {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e.attrs)
      t[i] = e.attrs[i];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return he.ok(r);
  }
  getMap() {
    return We.empty;
  }
  invert(e) {
    return new vr(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new vr(t.attr, t.value);
  }
}
De.jsonID("docAttr", vr);
let zn = class extends Error {
};
zn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
zn.prototype = Object.create(Error.prototype);
zn.prototype.constructor = zn;
zn.prototype.name = "TransformError";
class Ru {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new yr();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new zn(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  Return a single range, in post-transform document positions,
  that covers all content changed by this transform. Returns null
  if no replacements are made. Note that this will ignore changes
  that add/remove marks without replacing the underlying content.
  */
  changedRange() {
    let e = 1e9, t = -1e9;
    for (let r = 0; r < this.mapping.maps.length; r++) {
      let i = this.mapping.maps[r];
      r && (e = i.map(e, 1), t = i.map(t, -1)), i.forEach((s, o, l, a) => {
        e = Math.min(e, l), t = Math.max(t, a);
      });
    }
    return e == 1e9 ? null : { from: e, to: t };
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = L.empty) {
    let i = Ii(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new L(A.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, L.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return zb(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return Fb(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Vb(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Eb(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Rb(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return Ob(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Ab(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Pb(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new _n(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new vr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Bt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof ie)
      t.isInSet(r.marks) && this.step(new mn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new mn(e, s)), i = s.removeFromSet(i);
      for (let l = o.length - 1; l >= 0; l--)
        this.step(o[l]);
    }
    return this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split (with the outermost nodes coming first).
  */
  split(e, t = 1, r) {
    return Nb(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Sb(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return kb(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Co(this, e, t, r), this;
  }
}
const ds = /* @__PURE__ */ Object.create(null);
class Z {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new qb(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = L.empty) {
    let r = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], u = e.mapping.slice(s);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? L.empty : t), l == 0 && Yl(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: l } = i[s], a = e.mapping.slice(r), c = a.map(o.pos), u = a.map(l.pos);
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), Yl(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new G(e) : Pn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Pn(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Pn(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
      if (o)
        return o;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new je(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Pn(e, e, 0, 0, 1) || new je(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Pn(e, e, e.content.size, e.childCount, -1) || new je(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = ds[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in ds)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return ds[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return G.between(this.$anchor, this.$head).getBookmark();
  }
}
Z.prototype.visible = !0;
class qb {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Jl = !1;
function Xl(n) {
  !Jl && !n.parent.inlineContent && (Jl = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class G extends Z {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Xl(e), Xl(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return Z.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new G(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = L.empty) {
    if (super.replace(e, t), t == L.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof G && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ri(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new G(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let s = Z.findFrom(t, r, !0) || Z.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return Z.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (Z.findFrom(e, -r, !0) || Z.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new G(e, t);
  }
}
Z.jsonID("text", G);
class Ri {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Ri(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return G.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class H extends Z {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), s = e.resolve(i);
    return r ? Z.near(s) : new H(s);
  }
  content() {
    return new L(A.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof H && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Eo(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new H(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new H(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
H.prototype.visible = !1;
Z.jsonID("node", H);
class Eo {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Ri(r, r) : new Eo(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && H.isSelectable(r) ? new H(t) : Z.near(t);
  }
}
class je extends Z {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = L.empty) {
    if (t == L.empty) {
      e.delete(0, e.doc.content.size);
      let r = Z.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new je(e);
  }
  map(e) {
    return new je(e);
  }
  eq(e) {
    return e instanceof je;
  }
  getBookmark() {
    return Wb;
  }
}
Z.jsonID("all", je);
const Wb = {
  map() {
    return this;
  },
  resolve(n) {
    return new je(n);
  }
};
function Pn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return G.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!s && H.isSelectable(l))
        return H.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Pn(n, l, t + i, i < 0 ? l.childCount : 0, i, s);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function Yl(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof ve || i instanceof be))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), n.setSelection(Z.near(n.doc.resolve(o), t));
}
const Gl = 1, $r = 2, Zl = 4;
class Hb extends Ru {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Gl) & ~$r, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Gl) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= $r, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return ie.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & $r) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~$r, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || ie.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), !e)
        return this.deleteRange(t, r);
      let s = this.storedMarks;
      if (!s) {
        let o = this.doc.resolve(t);
        s = r == t ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, s)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(Z.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= Zl, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Zl) > 0;
  }
}
function Ql(n, e) {
  return !e || !n ? n : n.bind(e);
}
class tr {
  constructor(e, t, r) {
    this.name = e, this.init = Ql(t.init, r), this.apply = Ql(t.apply, r);
  }
}
const jb = [
  new tr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new tr("selection", {
    init(n, e) {
      return n.selection || Z.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new tr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new tr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class fs {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = jb.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new tr(r.key, r.spec.state, r));
    });
  }
}
class In {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let s = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let l = this.config.plugins[o];
        if (l.spec.appendTransaction) {
          let a = i ? i[o].n : 0, c = i ? i[o].state : this, u = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (u && r.filterTransaction(u, o)) {
            if (u.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let d = 0; d < this.config.plugins.length; d++)
                i.push(d < o ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), s = !0;
          }
          i && (i[o] = { state: r, n: t.length });
        }
      }
      if (!s)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new In(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let s = r[i];
      t[s.name] = s.apply(e, this[s.name], this, t);
    }
    return t;
  }
  /**
  Accessor that constructs and returns a new [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Hb(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new fs(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new In(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new fs(this.schema, e.plugins), r = t.fields, i = new In(t);
    for (let s = 0; s < r.length; s++) {
      let o = r[s].name;
      i[o] = this.hasOwnProperty(o) ? this[o] : r[s].init(e, i);
    }
    return i;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let i = e[r], s = i.spec.state;
        s && s.toJSON && (t[r] = s.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new fs(e.schema, e.plugins), s = new In(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = $t.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = Z.fromJSON(s.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              s[o.name] = c.fromJSON.call(a, e, t[l], s);
              return;
            }
          }
        s[o.name] = o.init(e, s);
      }
    }), s;
  }
}
function _u(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = _u(i, e, {})), t[r] = i;
  }
  return t;
}
class me {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && _u(e.props, this, this.props), this.key = e.key ? e.key.key : Bu("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const hs = /* @__PURE__ */ Object.create(null);
function Bu(n) {
  return n in hs ? n + "$" + ++hs[n] : (hs[n] = 0, n + "$");
}
class Pe {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Bu(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const To = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Lu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const $u = (n, e, t) => {
  let r = Lu(n, t);
  if (!r)
    return !1;
  let i = Mo(r);
  if (!i) {
    let o = r.blockRange(), l = o && Kn(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (Ku(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Fn(s, "end") || H.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let l = Ii(n.doc, r.before(o), r.after(o), L.empty);
      if (l && l.slice.size < l.to - l.from) {
        if (e) {
          let a = n.tr.step(l);
          a.setSelection(Fn(s, "end") ? Z.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : H.create(a.doc, i.pos - s.nodeSize)), e(a.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Ub = (n, e, t) => {
  let r = Lu(n, t);
  if (!r)
    return !1;
  let i = Mo(r);
  return i ? zu(n, i, e) : !1;
}, Kb = (n, e, t) => {
  let r = Vu(n, t);
  if (!r)
    return !1;
  let i = Oo(r);
  return i ? zu(n, i, e) : !1;
};
function zu(n, e, t) {
  let r = e.nodeBefore, i = r, s = e.pos - 1;
  for (; !i.isTextblock; s--) {
    if (i.type.spec.isolating)
      return !1;
    let u = i.lastChild;
    if (!u)
      return !1;
    i = u;
  }
  let o = e.nodeAfter, l = o, a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating)
      return !1;
    let u = l.firstChild;
    if (!u)
      return !1;
    l = u;
  }
  let c = Ii(n.doc, s, a, L.empty);
  if (!c || c.from != s || c instanceof ve && c.slice.size >= a - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(G.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function Fn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Fu = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = Mo(r);
  }
  let o = s && s.nodeBefore;
  return !o || !H.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(H.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Mo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Vu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const qu = (n, e, t) => {
  let r = Vu(n, t);
  if (!r)
    return !1;
  let i = Oo(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Ku(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Fn(s, "start") || H.isSelectable(s))) {
    let o = Ii(n.doc, r.before(), r.after(), L.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(Fn(s, "start") ? Z.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : H.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, Wu = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = Oo(r);
  }
  let o = s && s.nodeAfter;
  return !o || !H.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(H.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function Oo(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Jb = (n, e) => {
  let t = n.selection, r = t instanceof H, i;
  if (r) {
    if (t.node.isTextblock || !Sn(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Ni(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(H.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, Xb = (n, e) => {
  let t = n.selection, r;
  if (t instanceof H) {
    if (t.node.isTextblock || !Sn(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ni(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Yb = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && Kn(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, Hu = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Ao(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Gb = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = Ao(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(Z.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, ju = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof je || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = Ao(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = n.tr.insert(o, s.createAndFill());
    l.setSelection(G.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Uu = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (kt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Kn(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Zb(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof H && e.selection.node.isBlock)
      return !r.parentOffset || !kt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, l, a = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        a = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), l = Ao(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1))), s.unshift(a && l ? { type: l } : null), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof G || e.selection instanceof je) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = kt(u.doc, d, s.length, s);
    if (f || (s[0] = l ? { type: l } : null, f = kt(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !a && c && r.node(o).type != l) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      l && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, l) && u.setNodeMarkup(u.mapping.map(r.before(o)), l);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const Qb = Zb(), e0 = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(H.create(n.doc, i))), !0);
};
function t0(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Sn(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Ku(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, l, a = i.type.spec.isolating || s.type.spec.isolating;
  if (!a && t0(n, e, t))
    return !0;
  let c = !a && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (l = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && l.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = A.empty;
      for (let v = o.length - 1; v >= 0; v--)
        p = A.from(o[v].create(null, p));
      p = A.from(i.copy(p));
      let m = n.tr.step(new be(e.pos - 1, h, e.pos, h, new L(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && Sn(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && a ? null : Z.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && Kn(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && Fn(s, "start", !0) && Fn(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let v = A.empty;
        for (let x = p.length - 1; x >= 0; x--)
          v = A.from(p[x].copy(v));
        let w = n.tr.step(new be(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new L(v, p.length, 0), 0, !0));
        t(w.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ju(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection(G.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const n0 = Ju(-1), r0 = Ju(1);
function i0(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = o && Eu(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function ea(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let s = 0; s < t.selection.ranges.length && !i; s++) {
      let { $from: { pos: o }, $to: { pos: l } } = t.selection.ranges[s];
      t.doc.nodesBetween(o, l, (a, c) => {
        if (i)
          return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n)
            i = !0;
          else {
            let u = t.doc.resolve(c), d = u.index();
            i = u.parent.canReplaceWith(d, d + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let s = t.tr;
      for (let o = 0; o < t.selection.ranges.length; o++) {
        let { $from: { pos: l }, $to: { pos: a } } = t.selection.ranges[o];
        s.setBlockType(l, a, n, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
function Do(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
Do(To, $u, Fu);
Do(To, qu, Wu);
Do(Hu, ju, Uu, Qb);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function s0(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let l = r ? t.tr : null;
    return o0(l, o, n, e) ? (r && r(l.scrollIntoView()), !0) : !1;
  };
}
function o0(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let a = o.resolve(e.start - 2);
    s = new ci(a, a, e.depth), e.endIndex < e.parent.childCount && (e = new ci(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let l = Eu(s, t, r, e);
  return l ? (n && l0(n, e, l, i, t), !0) : !1;
}
function l0(n, e, t, r, i) {
  let s = A.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = A.from(t[u].type.create(t[u].attrs, s));
  n.step(new be(e.start - (r ? 2 : 0), e.end, e.start, e.end, new L(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && kt(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return n;
}
function a0(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? c0(e, t, n, s) : u0(e, t, s) : !0 : !1;
  };
}
function c0(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new be(s - 1, o, s, o, new L(A.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ci(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const l = Kn(r);
  if (l == null)
    return !1;
  i.lift(r, l);
  let a = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return Sn(i.doc, a.pos) && a.nodeBefore.type == a.nodeAfter.type && i.join(a.pos), e(i.scrollIntoView()), !0;
}
function u0(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= i.child(p).nodeSize, r.delete(h - 1, h + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? A.empty : A.from(i))))
    return !1;
  let d = s.pos, f = d + o.nodeSize;
  return r.step(new be(d - (l ? 1 : 0), f + (a ? 1 : 0), d + 1, f - 1, new L((l ? A.empty : A.from(i.copy(A.empty))).append(a ? A.empty : A.from(i.copy(A.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function d0(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let l = s.parent, a = l.child(o - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, u = A.from(c ? n.create() : null), d = new L(A.from(n.create(null, A.from(l.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new be(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Ce = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Vn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Hs = null;
const xt = function(n, e, t) {
  let r = Hs || (Hs = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, f0 = function() {
  Hs = null;
}, gn = function(n, e, t, r) {
  return t && (ta(n, e, t, r, -1) || ta(n, e, t, r, 1));
}, h0 = /^(img|br|input|textarea|hr)$/i;
function ta(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : Ye(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || Or(n) || h0.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Ce(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? Ye(n) : 0;
    } else
      return !1;
  }
}
function Ye(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function p0(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = Ye(n);
    } else if (n.parentNode && !Or(n))
      e = Ce(n), n = n.parentNode;
    else
      return null;
  }
}
function m0(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Or(n))
      e = Ce(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function g0(n, e, t) {
  for (let r = e == 0, i = e == Ye(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Ce(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == Ye(n);
  }
}
function Or(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const _i = function(n) {
  return n.focusNode && gn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function tn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function y0(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function v0(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(Ye(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(Ye(r.startContainer), r.startOffset) };
  }
}
const pt = typeof navigator < "u" ? navigator : null, na = typeof document < "u" ? document : null, Gt = pt && pt.userAgent || "", js = /Edge\/(\d+)/.exec(Gt), Xu = /MSIE \d/.exec(Gt), Us = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Gt), Fe = !!(Xu || Us || js), Ft = Xu ? document.documentMode : Us ? +Us[1] : js ? +js[1] : 0, Qe = !Fe && /gecko\/(\d+)/i.test(Gt);
Qe && +(/Firefox\/(\d+)/.exec(Gt) || [0, 0])[1];
const Ks = !Fe && /Chrome\/(\d+)/.exec(Gt), Te = !!Ks, Yu = Ks ? +Ks[1] : 0, Ae = !Fe && !!pt && /Apple Computer/.test(pt.vendor), qn = Ae && (/Mobile\/\w+/.test(Gt) || !!pt && pt.maxTouchPoints > 2), Xe = qn || (pt ? /Mac/.test(pt.platform) : !1), Gu = pt ? /Win/.test(pt.platform) : !1, St = /Android \d/.test(Gt), Ar = !!na && "webkitFontSmoothing" in na.documentElement.style, b0 = Ar ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function w0(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function wt(n, e) {
  return typeof n == "number" ? n : n[e];
}
function x0(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function ra(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = Vn(o);
      continue;
    }
    let l = o, a = l == s.body, c = a ? w0(s) : x0(l), u = 0, d = 0;
    if (e.top < c.top + wt(r, "top") ? d = -(c.top - e.top + wt(i, "top")) : e.bottom > c.bottom - wt(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + wt(i, "top") - c.top : e.bottom - c.bottom + wt(i, "bottom")), e.left < c.left + wt(r, "left") ? u = -(c.left - e.left + wt(i, "left")) : e.right > c.right - wt(r, "right") && (u = e.right - c.right + wt(i, "right")), u || d)
      if (a)
        s.defaultView.scrollBy(u, d);
      else {
        let h = l.scrollLeft, p = l.scrollTop;
        d && (l.scrollTop += d), u && (l.scrollLeft += u);
        let m = l.scrollLeft - h, g = l.scrollTop - p;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let f = a ? "fixed" : getComputedStyle(o).position;
    if (/^(fixed|sticky)$/.test(f))
      break;
    o = f == "absolute" ? o.offsetParent : Vn(o);
  }
}
function S0(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let s = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let l = n.root.elementFromPoint(s, o);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, i = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: Zu(n.dom) };
}
function Zu(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Vn(r))
    ;
  return e;
}
function k0({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Qu(t, r == 0 ? 0 : r - e);
}
function Qu(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let On = null;
function C0(n) {
  if (n.setActive)
    return n.setActive();
  if (On)
    return n.focus(On);
  let e = Zu(n);
  n.focus(On == null ? {
    get preventScroll() {
      return On = { preventScroll: !0 }, !0;
    }
  } : void 0), On || (On = !1, Qu(e, 0));
}
function ed(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, l = e.top, a, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = xt(u).getClientRects();
    else
      continue;
    for (let h = 0; h < f.length; h++) {
      let p = f[h];
      if (p.top <= o && p.bottom >= l) {
        o = Math.max(p.bottom, o), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = u, r = m, i = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (s = d + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !a && p.left <= e.left && p.right >= e.left && (a = u, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (s = d + 1);
    }
  }
  return !t && a && (t = a, i = c, r = 0), t && t.nodeType == 3 ? E0(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : ed(t, i);
}
function E0(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = Dt(r, 1);
    if (o.top != o.bottom && Po(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function Po(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function T0(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function M0(n, e, t) {
  let { node: r, offset: i } = ed(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function O0(n, e, t, r) {
  let i = -1;
  for (let s = e, o = !1; s != n.dom; ) {
    let l = n.docView.nearestDesc(s, !0), a;
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent || !l.contentDOM) && // Ignore elements with zero-size bounding rectangles
    ((a = l.dom.getBoundingClientRect()).width || a.height) && (l.node.isBlock && l.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(l.dom.nodeName) && (!o && a.left > r.left || a.top > r.top ? i = l.posBefore : (!o && a.right < r.left || a.bottom < r.top) && (i = l.posAfter), o = !0), !l.contentDOM && i < 0 && !l.node.isText))
      return (l.node.isBlock ? r.top < (a.top + a.bottom) / 2 : r.left < (a.left + a.right) / 2) ? l.posBefore : l.posAfter;
    s = l.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function td(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (Po(e, c))
            return td(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function A0(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = v0(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!Po(e, c) || (o = td(n.dom, e, c), !o))
      return null;
  }
  if (Ae)
    for (let c = o; r && c; c = Vn(c))
      c.draggable && (r = void 0);
  if (o = T0(o, e), r) {
    if (Qe && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    Ar && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (l = O0(n, r, i, e));
  }
  l == null && (l = M0(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function ia(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Dt(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (ia(r))
      return r;
  }
  return Array.prototype.find.call(t, ia) || n.getBoundingClientRect();
}
const D0 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function nd(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Ar || Qe;
  if (r.nodeType == 3)
    if (o && (D0.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let a = Dt(xt(r, i, i), t);
      if (Qe && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Dt(xt(r, i - 1, i - 1), -1);
        if (c.top == a.top) {
          let u = Dt(xt(r, i, i + 1), -1);
          if (u.top != a.top)
            return Yn(u, u.left < c.left);
        }
      }
      return a;
    } else {
      let a = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (a--, u = 1) : t < 0 ? a-- : c++, Yn(Dt(xt(r, a, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == Ye(r))) {
      let a = r.childNodes[i - 1];
      if (a.nodeType == 1)
        return ps(a.getBoundingClientRect(), !1);
    }
    if (s == null && i < Ye(r)) {
      let a = r.childNodes[i];
      if (a.nodeType == 1)
        return ps(a.getBoundingClientRect(), !0);
    }
    return ps(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == Ye(r))) {
    let a = r.childNodes[i - 1], c = a.nodeType == 3 ? xt(a, Ye(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return Yn(Dt(c, 1), !1);
  }
  if (s == null && i < Ye(r)) {
    let a = r.childNodes[i];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? xt(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return Yn(Dt(c, -1), !0);
  }
  return Yn(Dt(r.nodeType == 3 ? xt(r) : r, -t), t >= 0);
}
function Yn(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function ps(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function rd(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function P0(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return rd(n, e, () => {
    let { node: s } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(s, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        s = l.contentDOM || l.dom;
        break;
      }
      s = l.dom.parentNode;
    }
    let o = nd(n, i.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = xt(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < a.length; c++) {
        let u = a[c];
        if (u.bottom > u.top + 1 && (t == "up" ? o.top - u.top > (u.bottom - o.top) * 2 : u.bottom - o.bottom > (o.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const N0 = /[\u0590-\u08ac]/;
function I0(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, l = n.domSelection();
  return l ? !N0.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : o : rd(n, e, () => {
    let { focusNode: a, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), f = l.caretBidiLevel;
    l.modify("move", t, "character");
    let h = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !h.contains(p.nodeType == 1 ? p : p.parentNode) || a == p && c == m;
    try {
      l.collapse(u, d), a && (a != u || c != d) && l.extend && l.extend(a, c);
    } catch {
    }
    return f != null && (l.caretBidiLevel = f), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let sa = null, oa = null, la = !1;
function R0(n, e, t) {
  return sa == e && oa == t ? la : (sa = e, oa = t, la = t == "up" || t == "down" ? P0(n, e, t) : I0(n, e, t));
}
const et = 0, aa = 1, nn = 2, mt = 3;
class Dr {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = et, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule() {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.previousSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.previousSibling;
        return s ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.nextSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.nextSibling;
        return s ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > Ce(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !1;
            break;
          }
          if (s.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !0;
            break;
          }
          if (s.nextSibling)
            break;
        }
    }
    return i ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let s = this.getDesc(i), o;
      if (s && (!t || s.node))
        if (r && (o = s.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return s;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let s = this.getDesc(i);
      if (s)
        return s.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], s = r + i.size;
      if (r == e && s != r) {
        for (; !i.border && i.children.length; )
          for (let o = 0; o < i.children.length; o++) {
            let l = i.children[o];
            if (l.size) {
              i = l;
              break;
            }
          }
        return i;
      }
      if (e < s)
        return i.descAt(e - r - i.border);
      r = s;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, i = 0;
    for (let s = 0; r < this.children.length; r++) {
      let o = this.children[r], l = s + o.size;
      if (l > e || o instanceof sd) {
        i = e - s;
        break;
      }
      s = l;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof id && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Ce(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Ce(s.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, s = -1;
    for (let o = r, l = 0; ; l++) {
      let a = this.children[l], c = o + a.size;
      if (i == -1 && e <= c) {
        let u = o + a.border;
        if (e >= u && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, u);
        e = o;
        for (let d = l; d > 0; d--) {
          let f = this.children[d - 1];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(1)) {
            i = Ce(f.dom) + 1;
            break;
          }
          e -= f.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let u = l + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            s = Ce(d.dom);
            break;
          }
          t += d.size;
        }
        s == -1 && (s = this.contentDOM.childNodes.length);
        break;
      }
      o = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: s };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, i = !1) {
    let s = Math.min(e, t), o = Math.max(e, t);
    for (let h = 0, p = 0; h < this.children.length; h++) {
      let m = this.children[h], g = p + m.size;
      if (s > p && o < g)
        return m.setSelection(e - p - m.border, t - p - m.border, r, i);
      p = g;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.root.getSelection(), u = r.domSelectionRange(), d = !1;
    if ((Qe || Ae) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (l = a = { node: g.parentNode, offset: Ce(g) + 1 });
              break;
            }
            let v = m.pmViewDesc;
            if (v && v.node && v.node.isBlock)
              break;
          }
      } else {
        let m = h.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (Qe && u.focusNode && u.focusNode != a.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Ae) && gn(l.node, l.offset, u.anchorNode, u.anchorOffset) && gn(a.node, a.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && Qe)) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > t) {
        let p = l;
        l = a, a = p;
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset), h.setStart(l.node, l.offset), c.removeAllRanges(), c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let s = this.children[i], o = r + s.size;
      if (r == o ? e <= o && t >= r : e < o && t > r) {
        let l = r + s.border, a = o - s.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == o ? nn : aa, e == l && t == a && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = mt : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? nn : mt;
      }
      r = o;
    }
    this.dirty = nn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? nn : aa;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  get ignoreForSelection() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class id extends Dr {
  constructor(e, t, r, i) {
    let s, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!s)
        return i;
      if (s.parent)
        return s.parent.posBeforeChild(s);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(o), o = l;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, s = this;
  }
  matchesWidget(e) {
    return this.dirty == et && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get ignoreForSelection() {
    return !!this.widget.type.spec.relaxedSide;
  }
  get side() {
    return this.widget.type.side;
  }
}
class _0 extends Dr {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class yn extends Dr {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = xn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new yn(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & mt || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != mt && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != et) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = et;
    }
  }
  slice(e, t, r) {
    let i = yn.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = Xs(s, t, o, r)), e > 0 && (s = Xs(s, 0, e, r));
    for (let l = 0; l < s.length; l++)
      s[l].parent = i;
    return i.children = s, i;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
}
class Vt extends Dr {
  constructor(e, t, r, i, s, o, l, a, c) {
    super(e, [], s, o), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = l;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, i, s, o) {
    let l = s.nodeViews[t.type.name], a, c = l && l(t, s, () => {
      if (!a)
        return o;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, i), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else u || ({ dom: u, contentDOM: d } = xn.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = ad(u, r, t), c ? a = new B0(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new Bi(e, t, r, i, u, f, s) : new Vt(e, t, r, i, u, d || null, f, s, o + 1);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => A.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == et && e.eq(this.node) && di(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, l = s && s.pos < 0, a = new $0(this, o && o.node, e);
    V0(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && a.syncToMarks(u == this.node.childCount ? ie.none : this.node.child(u).marks, r, e, u), a.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      a.syncToMarks(c.marks, r, e, f);
      let h;
      a.findNodeMatch(c, u, d, f) || l && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = a.findIndexWithChild(s.node)) > -1 && a.updateNodeAt(c, u, d, h, e) || a.updateNextNode(c, u, d, e, f, i) || a.addNode(c, u, d, e, i), i += c.nodeSize;
    }), a.syncToMarks([], r, e, 0), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == nn) && (o && this.protectLocalComposition(e, o), od(this.contentDOM, this.children, e), qn && q0(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof G) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, l = W0(this.node.content, o, r - t, i - t);
      return l < 0 ? null : { node: s, pos: l, text: o };
    } else
      return { node: s, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let s = t;
    for (; s.parentNode != this.contentDOM; s = s.parentNode) {
      for (; s.previousSibling; )
        s.parentNode.removeChild(s.previousSibling);
      for (; s.nextSibling; )
        s.parentNode.removeChild(s.nextSibling);
      s.pmViewDesc && (s.pmViewDesc = void 0);
    }
    let o = new _0(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = Xs(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == mt || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = et;
  }
  updateOuterDeco(e) {
    if (di(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = ld(this.dom, this.nodeDOM, Js(this.outerDeco, this.node, t), Js(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.nodeDOM.draggable = !0));
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && (this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.nodeDOM.removeAttribute("draggable"));
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function ca(n, e, t, r, i) {
  ad(r, e, n);
  let s = new Vt(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Bi extends Vt {
  constructor(e, t, r, i, s, o, l) {
    super(e, t, r, i, s, null, o, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == mt || this.dirty != et && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != et || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = et, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t), s = document.createTextNode(i.text);
    return new Bi(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = mt);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class sd extends Dr {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == et && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class B0 extends Vt {
  constructor(e, t, r, i, s, o, l, a, c, u) {
    super(e, t, r, i, s, o, l, c, u), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == mt)
      return !1;
    if (this.spec.update && (this.node.type == e.type || this.spec.multiType)) {
      let s = this.spec.update(e, t, r);
      return s && this.updateInner(e, t, r, i), s;
    } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r.root) : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function od(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = ua(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(l, r);
    if (o instanceof yn) {
      let a = r ? r.previousSibling : n.lastChild;
      od(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = ua(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const or = function(n) {
  n && (this.nodeName = n);
};
or.prototype = /* @__PURE__ */ Object.create(null);
const rn = [new or()];
function Js(n, e, t) {
  if (n.length == 0)
    return rn;
  let r = t ? rn[0] : new or(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new or(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && i.length == 1 && i.push(r = new or(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function ld(n, e, t, r) {
  if (t == rn && r == rn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], l = t[s];
    if (s) {
      let a;
      l && l.nodeName == o.nodeName && i != n && (a = i.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(i), l = rn[0]), i = a;
    }
    L0(i, l || rn[0], o);
  }
  return i;
}
function L0(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let s = 0; s < r.length; s++)
      i.indexOf(r[s]) == -1 && n.classList.remove(r[s]);
    for (let s = 0; s < i.length; s++)
      r.indexOf(i[s]) == -1 && n.classList.add(i[s]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function ad(n, e, t) {
  return ld(n, n, rn, Js(e, t, n.nodeType != 1));
}
function di(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function ua(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class $0 {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = z0(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r, i) {
    let s = 0, o = this.stack.length >> 1, l = Math.min(o, e.length);
    for (; s < l && (s == o - 1 ? this.top : this.stack[s + 1 << 1]).matchesMark(e[s]) && e[s].type.spec.spanning !== !1; )
      s++;
    for (; s < o; )
      this.destroyRest(), this.top.dirty = et, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
    for (; o < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let a = -1, c = this.top.children.length;
      i < this.preMatch.index && (c = Math.min(this.index + 3, c));
      for (let u = this.index; u < c; u++) {
        let d = this.top.children[u];
        if (d.matchesMark(e[o]) && !this.isLocked(d.dom)) {
          a = u;
          break;
        }
      }
      if (a > -1)
        a > this.index && (this.changed = !0, this.destroyBetween(this.index, a)), this.top = this.top.children[this.index];
      else {
        let u = yn.create(this.top, e[o], t, r);
        this.top.children.splice(this.index, 0, u), this.top = u, this.changed = !0;
      }
      this.index = 0, o++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, i) {
    let s = -1, o;
    if (i >= this.preMatch.index && (o = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && o.matchesNode(e, t, r))
      s = this.top.children.indexOf(o, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          s = l;
          break;
        }
      }
    return s < 0 ? !1 : (this.destroyBetween(this.index, s), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, s) {
    let o = this.top.children[i];
    return o.dirty == mt && o.dom == o.contentDOM && (o.dirty = nn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, i, s, o) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof Vt) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != s)
          return !1;
        let u = a.dom, d, f = this.isLocked(u) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != mt && di(t, a.outerDeco));
        if (!f && a.update(e, t, r, i))
          return this.destroyBetween(this.index, l), a.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(a, e, t, r, i, o)))
          return this.destroyBetween(this.index, l), this.top.children[this.index] = d, d.contentDOM && (d.dirty = nn, d.updateChildren(i, o + 1), d.dirty = et), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !di(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let l = Vt.create(this.top, t, r, i, s, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = Vt.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new id(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof yn; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Bi) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Ae || Te) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new sd(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function z0(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof yn)
          t = c, r = c.children.length;
        else {
          l = c, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let a = l.node;
    if (a) {
      if (a != n.child(i - 1))
        break;
      --i, s.set(l, i), o.push(l);
    }
  }
  return { index: i, matched: s, matches: o.reverse() };
}
function F0(n, e) {
  return n.type.side - e.type.side;
}
function V0(n, e, t, r) {
  let i = e.locals(n), s = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, i, e.forChild(s, u), c), s += u.nodeSize;
    }
    return;
  }
  let o = 0, l = [], a = null;
  for (let c = 0; ; ) {
    let u, d;
    for (; o < i.length && i[o].to == s; ) {
      let g = i[o++];
      g.widget && (u ? (d || (d = [u])).push(g) : u = g);
    }
    if (u)
      if (d) {
        d.sort(F0);
        for (let g = 0; g < d.length; g++)
          t(d[g], c, !!a);
      } else
        t(u, c, !!a);
    let f, h;
    if (a)
      h = -1, f = a, a = null;
    else if (c < n.childCount)
      h = c, f = n.child(c++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= s && l.splice(g--, 1);
    for (; o < i.length && i[o].from <= s && i[o].to > s; )
      l.push(i[o++]);
    let p = s + f.nodeSize;
    if (f.isText) {
      let g = p;
      o < i.length && i[o].from < g && (g = i[o].from);
      for (let v = 0; v < l.length; v++)
        l[v].to < g && (g = l[v].to);
      g < p && (a = f.cut(g - s), f = f.cut(0, g - s), p = g, h = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = f.isInline && !f.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(f, m, e.forChild(s, f), h), s = p;
  }
}
function q0(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function W0(n, e, t, r) {
  for (let i = 0, s = 0; i < n.childCount && s <= r; ) {
    let o = n.child(i++), l = s;
    if (s += o.nodeSize, !o.isText)
      continue;
    let a = o.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (s += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (s >= t) {
      if (s >= r && a.slice(r - e.length - l, r - l) == e)
        return r - e.length;
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t)
        return l + c;
      if (t == r && a.length >= r + e.length - l && a.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Xs(n, e, t, r, i) {
  let s = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, u = l += a.size;
    c >= t || u <= e ? s.push(a) : (c < e && s.push(a.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(a.slice(t - c, a.size, r)));
  }
  return s;
}
function No(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (_i(t)) {
    for (a = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && H.isSelectable(d) && i.parent && !(d.isInline && g0(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new H(o == f ? l : r.resolve(f));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let d = o, f = o;
      for (let h = 0; h < t.rangeCount; h++) {
        let p = t.getRangeAt(h);
        d = Math.min(d, n.docView.posFromDOM(p.startContainer, p.startOffset, 1)), f = Math.max(f, n.docView.posFromDOM(p.endContainer, p.endOffset, -1));
      }
      if (d < 0)
        return null;
      [a, o] = f == n.state.selection.anchor ? [f, d] : [d, f], l = r.resolve(o);
    } else
      a = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (a < 0)
      return null;
  }
  let u = r.resolve(a);
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < l.pos && !s ? 1 : -1;
    c = Io(n, u, l, d);
  }
  return c;
}
function cd(n) {
  return n.editable ? n.hasFocus() : dd(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Ct(n, e = !1) {
  let t = n.state.selection;
  if (ud(n, t), !!cd(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Te) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && gn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      j0(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      da && !(t instanceof G) && (t.$from.parent.inlineContent || (s = fa(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = fa(n, t.to))), n.docView.setSelection(r, i, n, e), da && (s && ha(s), o && ha(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && H0(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const da = Ae || Te && Yu < 63;
function fa(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Ae && i && i.contentEditable == "false")
    return ms(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return ms(i);
    if (s)
      return ms(s);
  }
}
function ms(n) {
  return n.contentEditable = "true", Ae && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function ha(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function H0(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!cd(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function j0(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Ce(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && Fe && Ft <= 11 && (t.disabled = !0, t.disabled = !1);
}
function ud(n, e) {
  if (e instanceof H) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (pa(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    pa(n);
}
function pa(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Io(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || G.between(e, t, r);
}
function ma(n) {
  return n.editable && !n.hasFocus() ? !1 : dd(n);
}
function dd(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function U0(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return gn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ys(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && Z.findFrom(s, e);
}
function Nt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function ga(n, e, t) {
  let r = n.state.selection;
  if (r instanceof G)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Nt(n, new G(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Ys(n.state, e);
        return i && i instanceof H ? Nt(n, i) : !1;
      } else if (!(Xe && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let l = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? H.isSelectable(s) ? Nt(n, new H(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : Ar ? Nt(n, new G(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof H && r.node.isInline)
      return Nt(n, new G(e > 0 ? r.$to : r.$from));
    {
      let i = Ys(n.state, e);
      return i ? Nt(n, i) : !1;
    }
  }
}
function fi(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function lr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function An(n, e) {
  return e < 0 ? K0(n) : J0(n);
}
function K0(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (Qe && t.nodeType == 1 && r < fi(t) && lr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (lr(l, -1))
          i = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (fd(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && lr(l, -1); )
          i = t.parentNode, s = Ce(l), l = l.previousSibling;
        if (l)
          t = l, r = fi(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Gs(n, t, r) : i && Gs(n, i, s);
}
function J0(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = fi(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (lr(l, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (fd(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && lr(l, 1); )
          s = l.parentNode, o = Ce(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, i = fi(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && Gs(n, s, o);
}
function fd(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function X0(n, e) {
  for (; n && e == n.childNodes.length && !Or(n); )
    e = Ce(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function Y0(n, e) {
  for (; n && !e && !Or(n); )
    e = Ce(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Gs(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = X0(e, t)) ? (e = o, t = 0) : (s = Y0(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (_i(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Ct(n);
  }, 50);
}
function ya(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Te || Gu) && t.parent.inlineContent) {
    let i = n.coordsAtPos(e);
    if (e > t.start()) {
      let s = n.coordsAtPos(e - 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left < i.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let s = n.coordsAtPos(e + 1), o = (s.top + s.bottom) / 2;
      if (o > i.top && o < i.bottom && Math.abs(s.left - i.left) > 1)
        return s.left > i.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function va(n, e, t) {
  let r = n.state.selection;
  if (r instanceof G && !r.empty || t.indexOf("s") > -1 || Xe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Ys(n.state, e);
    if (o && o instanceof H)
      return Nt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, l = r instanceof je ? Z.near(o, e) : Z.findFrom(o, e);
    return l ? Nt(n, l) : !1;
  }
  return !1;
}
function ba(n, e) {
  if (!(n.state.selection instanceof G))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let s = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (s && !s.isText) {
    let o = n.state.tr;
    return e < 0 ? o.delete(t.pos - s.nodeSize, t.pos) : o.delete(t.pos, t.pos + s.nodeSize), n.dispatch(o), !0;
  }
  return !1;
}
function wa(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function G0(n) {
  if (!Ae || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    wa(n, r, "true"), setTimeout(() => wa(n, r, "false"), 20);
  }
  return !1;
}
function Z0(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function Q0(n, e) {
  let t = e.keyCode, r = Z0(e);
  if (t == 8 || Xe && t == 72 && r == "c")
    return ba(n, -1) || An(n, -1);
  if (t == 46 && !e.shiftKey || Xe && t == 68 && r == "c")
    return ba(n, 1) || An(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || Xe && t == 66 && r == "c") {
    let i = t == 37 ? ya(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return ga(n, i, r) || An(n, i);
  } else if (t == 39 || Xe && t == 70 && r == "c") {
    let i = t == 39 ? ya(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return ga(n, i, r) || An(n, i);
  } else {
    if (t == 38 || Xe && t == 80 && r == "c")
      return va(n, -1, r) || An(n, -1);
    if (t == 40 || Xe && t == 78 && r == "c")
      return G0(n) || va(n, 1, r) || An(n, 1);
    if (r == (Xe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Ro(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || xn.fromSchema(n.state.schema), l = vd(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = yd[c.nodeName.toLowerCase()]); ) {
    for (let h = u.length - 1; h >= 0; h--) {
      let p = l.createElement(u[h]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), d++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let f = n.someProp("clipboardTextSerializer", (h) => h(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: f, slice: e };
}
function hd(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = !!e && (r || s || !t);
  if (a) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return l = new L(A.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        l = f(l, n, !0);
      }), l;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      l = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = xn.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = rw(t), Ar && iw(o);
  let c = o && o.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0; d--) {
      let f = o.firstChild;
      for (; f && f.nodeType != 1; )
        f = f.nextSibling;
      if (!f)
        break;
      o = f;
    }
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || zt.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !ew.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = sw(xa(l, +u[1], +u[2]), u[4]);
  else if (l = L.maxOpen(tw(l.content, i), !0), l.openStart || l.openEnd) {
    let d = 0, f = 0;
    for (let h = l.content.firstChild; d < l.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = l.content.lastChild; f < l.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    l = xa(l, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    l = d(l, n, a);
  }), l;
}
const ew = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function tw(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), s, o = [];
    if (n.forEach((l) => {
      if (!o)
        return;
      let a = i.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && s.length && md(a, s, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = gd(o[o.length - 1], s.length));
        let u = pd(l, a);
        o.push(u), i = i.matchType(u.type), s = a;
      }
    }), o)
      return A.from(o);
  }
  return n;
}
function pd(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, A.from(n));
  return n;
}
function md(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = md(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(A.from(pd(t, n, i + 1))));
  }
}
function gd(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, gd(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(A.empty, !0);
  return n.copy(t.append(r));
}
function Zs(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (l = Zs(l, e, t, r, i + 1, s)), i >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, s <= i).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(A.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function xa(n, e, t) {
  return e < n.openStart && (n = new L(Zs(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new L(Zs(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const yd = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let Sa = null;
function vd() {
  return Sa || (Sa = document.implementation.createHTMLDocument("title"));
}
let gs = null;
function nw(n) {
  let e = window.trustedTypes;
  return e ? (gs || (gs = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), gs.createHTML(n)) : n;
}
function rw(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = vd().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && yd[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = nw(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function iw(n) {
  let e = n.querySelectorAll(Te ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function sw(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: s, openEnd: o } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    i = A.from(a.create(r[l + 1], i)), s++, o++;
  }
  return new L(i, s, o);
}
const _e = {}, Be = {}, ow = { touchstart: !0, touchmove: !0 };
class lw {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function aw(n) {
  for (let e in _e) {
    let t = _e[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      uw(n, r) && !_o(n, r) && (n.editable || !(r.type in Be)) && t(n, r);
    }, ow[e] ? { passive: !0 } : void 0);
  }
  Ae && n.dom.addEventListener("input", () => null), Qs(n);
}
function Lt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function cw(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Qs(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => _o(n, r));
  });
}
function _o(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function uw(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function dw(n, e) {
  !_o(n, e) && _e[e.type] && (n.editable || !(e.type in Be)) && _e[e.type](n, e);
}
Be.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !wd(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(St && Te && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), qn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, tn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || Q0(n, t) ? t.preventDefault() : Lt(n, "key");
};
Be.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Be.keypress = (n, e) => {
  let t = e;
  if (wd(n, t) || !t.charCode || t.ctrlKey && !t.altKey || Xe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof G) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), s = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i, s)) && n.dispatch(s()), t.preventDefault();
  }
};
function Li(n) {
  return { left: n.clientX, top: n.clientY };
}
function fw(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Bo(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > s.depth ? l(n, t, s.nodeAfter, s.before(o), i, !0) : l(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Bn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function hw(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && H.isSelectable(r) ? (Bn(n, new H(t)), !0) : !1;
}
function pw(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof H && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let l = o > s.depth ? s.nodeAfter : s.node(o);
    if (H.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (Bn(n, H.create(n.state.doc, i)), !0) : !1;
}
function mw(n, e, t, r, i) {
  return Bo(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? pw(n, t) : hw(n, t));
}
function gw(n, e, t, r) {
  return Bo(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function yw(n, e, t, r) {
  return Bo(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || vw(n, t, r);
}
function vw(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Bn(n, G.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), l = i.before(s);
    if (o.inlineContent)
      Bn(n, G.create(r, l + 1, l + 1 + o.content.size));
    else if (H.isSelectable(o))
      Bn(n, H.create(r, l));
    else
      continue;
    return !0;
  }
}
function Lo(n) {
  return hi(n);
}
const bd = Xe ? "metaKey" : "ctrlKey";
_e.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Lo(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && fw(t, n.input.lastClick) && !t[bd] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Li(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new bw(n, o, t, !!r)) : (s == "doubleClick" ? gw : yw)(n, o.pos, o.inside, t) ? t.preventDefault() : Lt(n, "pointer"));
};
class bw {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[bd], this.allowDefault = r.shiftKey;
    let s, o;
    if (t.inside > -1)
      s = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      s = u.parent, o = u.depth ? u.before() : 0;
    }
    const l = i ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a && a.nodeDOM.nodeType == 1 ? a.nodeDOM : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof H && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Qe && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Lt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Ct(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Li(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Lt(this.view, "pointer") : mw(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Ae && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Te && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Bn(this.view, Z.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Lt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Lt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
_e.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Lo(n), Lt(n, "pointer");
};
_e.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Lt(n, "pointer");
};
_e.contextmenu = (n) => Lo(n);
function wd(n, e) {
  return n.composing ? !0 : Ae && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const ww = St ? 5e3 : -1;
Be.compositionstart = Be.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof G && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Te && Gu && xw(n)))
      n.markCursor = n.state.storedMarks || t.marks(), hi(n, !0), n.markCursor = null;
    else if (hi(n, !e.selection.empty), Qe && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, s = r.focusOffset; i && i.nodeType == 1 && s != 0; ) {
        let o = s < 0 ? i.lastChild : i.childNodes[s - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          let l = n.domSelection();
          l && l.collapse(o, o.nodeValue.length);
          break;
        } else
          i = o, s = -1;
      }
    }
    n.input.composing = !0;
  }
  xd(n, ww);
};
function xw(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Be.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, xd(n, 20));
};
function xd(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => hi(n), e));
}
function Sd(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = kw()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function Sw(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = p0(e.focusNode, e.focusOffset), r = m0(e.focusNode, e.focusOffset);
  if (t && r && t != r) {
    let i = r.pmViewDesc, s = n.domObserver.lastChangedTextNode;
    if (t == s || r == s)
      return s;
    if (!i || !i.isText(r.nodeValue))
      return r;
    if (n.input.compositionNode == r) {
      let o = t.pmViewDesc;
      if (!(!o || !o.isText(t.nodeValue)))
        return r;
    }
  }
  return t || r;
}
function kw() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function hi(n, e = !1) {
  if (!(St && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Sd(n), e || n.docView && n.docView.dirty) {
      let t = No(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Cw(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const br = Fe && Ft < 15 || qn && b0 < 604;
_e.copy = Be.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = br ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = Ro(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", a)) : Cw(n, l), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Ew(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Tw(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? wr(n, r.value, null, i, e) : wr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function wr(n, e, t, r, i) {
  let s = hd(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, i, s || L.empty)))
    return !0;
  if (!s)
    return !1;
  let o = Ew(s), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function kd(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Be.paste = (n, e) => {
  let t = e;
  if (n.composing && !St)
    return;
  let r = br ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && wr(n, kd(r), r.getData("text/html"), i, t) ? t.preventDefault() : Tw(n, t);
};
class Cd {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const Mw = Xe ? "altKey" : "ctrlKey";
function Ed(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[Mw];
}
_e.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Li(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof H ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = H.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = H.create(n.state.doc, d.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: u } = Ro(n, l);
  (!t.dataTransfer.files.length || !Te || Yu > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(br ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", br || t.dataTransfer.setData("text/plain", c), n.dragging = new Cd(u, Ed(n, t), o);
};
_e.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Be.dragover = Be.dragenter = (n, e) => e.preventDefault();
Be.drop = (n, e) => {
  try {
    Ow(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function Ow(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Li(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = hd(n, kd(e.dataTransfer), br ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && Ed(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || L.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let l = s ? Au(n.state.doc, i.pos, s) : i.pos;
  l == null && (l = i.pos);
  let a = n.state.tr;
  if (o) {
    let { node: h } = t;
    h ? h.replace(a) : a.deleteSelection();
  }
  let c = a.mapping.map(l), u = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1, d = a.doc;
  if (u ? a.replaceRangeWith(c, c, s.content.firstChild) : a.replaceRange(c, c, s), a.doc.eq(d))
    return;
  let f = a.doc.resolve(c);
  if (u && H.isSelectable(s.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(s.content.firstChild))
    a.setSelection(new H(f));
  else {
    let h = a.mapping.map(l);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((p, m, g, v) => h = v), a.setSelection(Io(n, f, a.doc.resolve(h)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
}
_e.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Ct(n);
  }, 20));
};
_e.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
_e.beforeinput = (n, e) => {
  if (Te && St && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, tn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Be)
  _e[n] = Be[n];
function xr(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class pi {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || cn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new Ie(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof pi && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && xr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class qt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || cn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new Ie(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof qt && xr(this.attrs, e.attrs) && xr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof qt;
  }
  destroy() {
  }
}
class $o {
  constructor(e, t) {
    this.attrs = e, this.spec = t || cn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new Ie(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof $o && xr(this.attrs, e.attrs) && xr(this.spec, e.spec);
  }
  destroy() {
  }
}
class Ie {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new Ie(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new Ie(e, e, new pi(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new Ie(e, t, new qt(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new Ie(e, t, new $o(r, i));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof qt;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof pi;
  }
}
const Nn = [], cn = {};
class ae {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Nn, this.children = t.length ? t : Nn;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? mi(t, e, 0, cn) : Oe;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let i = [];
    return this.findInner(e ?? 0, t ?? 1e9, i, 0, r), i;
  }
  findInner(e, t, r, i, s) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= t && l.to >= e && (!s || s(l.spec)) && r.push(l.copy(l.from + i, l.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, t - l, r, i + l, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Oe || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || cn);
  }
  /**
  @internal
  */
  mapInner(e, t, r, i, s) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(t, a) ? (o || (o = [])).push(a) : s.onRemove && s.onRemove(this.local[l].spec);
    }
    return this.children.length ? Aw(this.children, o || [], e, t, r, i, s) : o ? new ae(o.sort(un), Nn) : Oe;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Oe ? ae.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = Md(t, l, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < a; )
          s += 3;
        i[s] == a ? i[s + 2] = i[s + 2].addInner(l, u, c + 1) : i.splice(s, 0, a, a + l.nodeSize, mi(u, l, c + 1, cn)), s += 3;
      }
    });
    let o = Td(s ? Od(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new ae(o.length ? this.local.concat(o).sort(un) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Oe ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let o, l = r[s] + t, a = r[s + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > l && d.to < a && (e[u] = null, (o || (o = [])).push(d));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, l + 1);
      c != Oe ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let l = 0; l < i.length; l++)
            i[l].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new ae(i, r) : Oe;
  }
  forChild(e, t) {
    if (this == Oe)
      return this;
    if (t.isLeaf)
      return ae.empty;
    let r, i;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > s && a.type instanceof qt) {
        let c = Math.max(s, a.from) - s, u = Math.min(o, a.to) - s;
        c < u && (i || (i = [])).push(a.copy(c, u));
      }
    }
    if (i) {
      let l = new ae(i.sort(un), Nn);
      return r ? new Rt([l, r]) : l;
    }
    return r || Oe;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof ae) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return zo(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Oe)
      return Nn;
    if (e.inlineContent || !this.local.some(qt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof qt || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
ae.empty = new ae([], []);
ae.removeOverlap = zo;
const Oe = ae.empty;
class Rt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, cn));
    return Rt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return ae.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Oe && (s instanceof Rt ? r = r.concat(s.members) : r.push(s));
    }
    return Rt.from(r);
  }
  eq(e) {
    if (!(e instanceof Rt) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].localsInner(e);
      if (s.length)
        if (!t)
          t = s;
        else {
          r && (t = t.slice(), r = !1);
          for (let o = 0; o < s.length; o++)
            t.push(s[o]);
        }
    }
    return t ? zo(r ? t : t.sort(un)) : Nn;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Oe;
      case 1:
        return e[0];
      default:
        return new Rt(e.every((t) => t instanceof ae) ? e : e.reduce((t, r) => t.concat(r instanceof ae ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function Aw(n, e, t, r, i, s, o) {
  let l = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let v = 0; v < l.length; v += 3) {
        let w = l[v + 1];
        if (w < 0 || f > w + u - d)
          continue;
        let x = l[v] + u - d;
        h >= x ? l[v + 1] = f <= x ? -2 : -1 : f >= u && g && (l[v] += g, l[v + 1] += g);
      }
      d += g;
    }), u = t.maps[c].map(u, -1);
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        a = !0, l[c + 1] = -1;
        continue;
      }
      let u = t.map(n[c] + s), d = u - i;
      if (d < 0 || d >= r.content.size) {
        a = !0;
        continue;
      }
      let f = t.map(n[c + 1] + s, -1), h = f - i, { index: p, offset: m } = r.content.findIndex(d), g = r.maybeChild(p);
      if (g && m == d && m + g.nodeSize == h) {
        let v = l[c + 2].mapInner(t, g, u + 1, n[c] + s + 1, o);
        v != Oe ? (l[c] = d, l[c + 1] = h, l[c + 2] = v) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = Dw(l, n, e, t, i, s, o), u = mi(c, r, 0, o);
    e = u.local;
    for (let d = 0; d < l.length; d += 3)
      l[d + 1] < 0 && (l.splice(d, 3), d -= 3);
    for (let d = 0, f = 0; d < u.children.length; d += 3) {
      let h = u.children[d];
      for (; f < l.length && l[f] < h; )
        f += 3;
      l.splice(f, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new ae(e.sort(un), l);
}
function Td(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new Ie(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Dw(n, e, t, r, i, s, o) {
  function l(a, c) {
    for (let u = 0; u < a.local.length; u++) {
      let d = a.local[u].map(r, i, c);
      d ? t.push(d) : o.onRemove && o.onRemove(a.local[u].spec);
    }
    for (let u = 0; u < a.children.length; u += 3)
      l(a.children[u + 2], a.children[u] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + s + 1);
  return t;
}
function Md(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Od(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function mi(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((l, a) => {
    let c = Md(n, l, a + t);
    if (c) {
      s = !0;
      let u = mi(c, l, t + a + 1, r);
      u != Oe && i.push(a, a + l.nodeSize, u);
    }
  });
  let o = Td(s ? Od(n) : n, -t).sort(un);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || i.length ? new ae(o, i) : Oe;
}
function un(n, e) {
  return n.from - e.from || n.to - e.to;
}
function zo(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), ka(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), ka(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ka(n, e, t) {
  for (; e < n.length && un(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function ys(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Oe && e.push(r);
  }), n.cursorWrapper && e.push(ae.create(n.state.doc, [n.cursorWrapper.deco])), Rt.from(e);
}
const Pw = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Nw = Fe && Ft <= 11;
class Iw {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class Rw {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Iw(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      Fe && Ft <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Ae && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), Nw && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Pw)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (ma(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Ct(this.view);
      if (Fe && Ft <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && gn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let s = e.focusNode; s; s = Vn(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = Vn(s))
      if (t.has(s)) {
        r = s;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (i && i.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && ma(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, l = !1, a = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let d = this.registerMutation(t[u], a);
        d && (s = s < 0 ? d.from : Math.min(d.from, s), o = o < 0 ? d.to : Math.max(d.to, o), d.typeOver && (l = !0));
      }
    if (a.some((u) => u.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46)) {
      for (let u of a)
        if (u.nodeName == "BR" && u.parentNode) {
          let d = u.nextSibling;
          for (; d && d.nodeType == 1; ) {
            if (d.contentEditable == "false") {
              u.parentNode.removeChild(u);
              break;
            }
            d = d.firstChild;
          }
        }
    } else if (Qe && a.length) {
      let u = a.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || Lw(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && _i(r) && (c = No(e)) && c.eq(Z.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Ct(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), _w(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, $w(e, a)), this.handleDOMChange(s, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Ct(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++) {
        let d = e.addedNodes[u];
        t.push(d), d.nodeType == 3 && (this.lastChangedTextNode = d);
      }
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling, s = e.nextSibling;
      if (Fe && Ft <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? Ce(i) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = s && s.parentNode == e.target ? Ce(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : (this.lastChangedTextNode = e.target, {
      from: r.posAtStart,
      to: r.posAtEnd,
      // An event was generated for a text change that didn't change
      // any text. Mark the dom change to fall back to assuming the
      // selection was typed over with an identical value if it can't
      // find another change.
      typeOver: e.target.nodeValue == e.oldValue
    });
  }
}
let Ca = /* @__PURE__ */ new WeakMap(), Ea = !1;
function _w(n) {
  if (!Ca.has(n) && (Ca.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Qe, Ea)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Ea = !0;
  }
}
function Ta(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return gn(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function Bw(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return Ta(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Ta(n, t) : null;
}
function Lw(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function $w(n, e) {
  var t;
  let { focusNode: r, focusOffset: i } = n.domSelectionRange();
  for (let s of e)
    if (((t = s.parentNode) === null || t === void 0 ? void 0 : t.nodeName) == "TR") {
      let o = s.nextSibling;
      for (; o && o.nodeName != "TD" && o.nodeName != "TH"; )
        o = o.nextSibling;
      if (o) {
        let l = o;
        for (; ; ) {
          let a = l.firstChild;
          if (!a || a.nodeType != 1 || a.contentEditable == "false" || /^(BR|IMG)$/.test(a.nodeName))
            break;
          l = a;
        }
        l.insertBefore(s, l.firstChild), r == s && n.domSelection().collapse(s, i);
      } else
        s.parentNode.removeChild(s);
    }
}
function zw(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelectionRange(), c, u = a.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: a.anchorOffset }], _i(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), Te && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let v = r.childNodes[g - 1], w = v.pmViewDesc;
      if (v.nodeName == "BR" && !w) {
        s = g;
        break;
      }
      if (!w || w.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || zt.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: Fw,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, v = c[1] && c[1].pos;
    v == null && (v = g), p = { anchor: g + o, head: v + o };
  }
  return { doc: m, sel: p, from: o, to: l };
}
function Fw(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Ae && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Ae && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Vw = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function qw(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let S = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, T = No(n, S);
    if (T && !n.state.selection.eq(T)) {
      if (Te && St && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (M) => M(n, tn(13, "Enter"))))
        return;
      let E = n.state.tr.setSelection(T);
      S == "pointer" ? E.setMeta("pointer", !0) : S == "key" && E.scrollIntoView(), s && E.setMeta("composition", s), n.dispatch(E);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = zw(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = jw(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (qn && n.input.lastIOSEnter > Date.now() - 225 || St) && i.some((S) => S.nodeType == 1 && !Vw.test(S.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (S) => S(n, tn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof G && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let S = Ma(n, n.state.doc, c.sel);
        if (S && !S.eq(n.state.selection)) {
          let T = n.state.tr.setSelection(S);
          s && T.setMeta("composition", s), n.dispatch(T);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof G && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), Fe && Ft <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), v = u.resolve(p.start), w = m.sameParent(g) && m.parent.inlineContent && v.end() >= p.endA;
  if ((qn && n.input.lastIOSEnter > Date.now() - 225 && (!w || i.some((S) => S.nodeName == "DIV" || S.nodeName == "P")) || !w && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (S) => S(n, tn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && Hw(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (S) => S(n, tn(8, "Backspace")))) {
    St && Te && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Te && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), St && !w && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(S) {
      return S(n, tn(13, "Enter"));
    });
  }, 20));
  let x = p.start, b = p.endA, k = (S) => {
    let T = S || n.state.tr.replace(x, b, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let E = Ma(n, T.doc, c.sel);
      E && !(Te && n.composing && E.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (E.head == x || E.head == T.mapping.map(b) - 1) || Fe && E.empty && E.head == x) && T.setSelection(E);
    }
    return s && T.setMeta("composition", s), T.scrollIntoView();
  }, C;
  if (w)
    if (m.pos == g.pos) {
      Fe && Ft <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Ct(n), 20));
      let S = k(n.state.tr.delete(x, b)), T = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      T && S.ensureMarks(T), n.dispatch(S);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (C = Ww(m.parent.content.cut(m.parentOffset, g.parentOffset), v.parent.content.cut(v.parentOffset, p.endA - v.start())))
    ) {
      let S = k(n.state.tr);
      C.type == "add" ? S.addMark(x, b, C.mark) : S.removeMark(x, b, C.mark), n.dispatch(S);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let S = m.parent.textBetween(m.parentOffset, g.parentOffset), T = () => k(n.state.tr.insertText(S, x, b));
      n.someProp("handleTextInput", (E) => E(n, x, b, S, T)) || n.dispatch(T());
    } else
      n.dispatch(k());
  else
    n.dispatch(k());
}
function Ma(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Io(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Ww(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, s = r, o, l, a;
  for (let u = 0; u < r.length; u++)
    i = r[u].removeFromSet(i);
  for (let u = 0; u < t.length; u++)
    s = t[u].removeFromSet(s);
  if (i.length == 1 && s.length == 0)
    l = i[0], o = "add", a = (u) => u.mark(l.addToSet(u.marks));
  else if (i.length == 0 && s.length == 1)
    l = s[0], o = "remove", a = (u) => u.mark(l.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(a(e.child(u)));
  if (A.from(c).eq(n))
    return { mark: l, type: o };
}
function Hw(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    vs(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = s.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(vs(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || vs(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function vs(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let s = n.node(r).maybeChild(n.indexAfter(r));
    for (; s && !s.isLeaf; )
      s = s.firstChild, i++;
  }
  return i;
}
function jw(n, e, t, r, i) {
  let s = n.findDiffStart(e, t);
  if (s == null)
    return null;
  let { a: o, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let a = Math.max(0, s - Math.min(o, l));
    r -= o + a - s;
  }
  if (o < s && n.size < e.size) {
    let a = r <= s && r >= o ? s - r : 0;
    s -= a, s && s < e.size && Oa(e.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), l = s + (l - o), o = s;
  } else if (l < s) {
    let a = r <= s && r >= l ? s - r : 0;
    s -= a, s && s < n.size && Oa(n.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), o = s + (o - l), l = s;
  }
  return { start: s, endA: o, endB: l };
}
function Oa(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Ad {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new lw(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Ia), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Pa(this), Da(this), this.nodeViews = Na(this), this.docView = ca(this.state.doc, Aa(this), ys(this), this.dom, this), this.domObserver = new Rw(this, (r, i, s, o) => qw(this, r, i, s, o)), this.domObserver.start(), aw(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Qs(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Ia), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let i = this.state, s = !1, o = !1;
    e.storedMarks && this.composing && (Sd(this), o = !0), this.state = e;
    let l = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = Na(this);
      Kw(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Qs(this), this.editable = Pa(this), Da(this);
    let a = ys(this), c = Aa(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, a);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && S0(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (Fe || Te) && !this.composing && !i.selection.empty && !e.selection.empty && Uw(i.selection, e.selection);
      if (d) {
        let p = Te ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = Sw(this)), (s || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = ca(e.doc, c, a, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && U0(this)) ? Ct(this, h) : (ud(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && k0(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof H) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && ra(this, t.getBoundingClientRect(), e);
      } else
        ra(this, this.coordsAtPos(this.state.selection.head, 1), e);
    }
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, i = -1;
    if (r.from < this.state.doc.content.size && this.state.doc.nodeAt(r.from) == r.node)
      i = r.from;
    else {
      let s = r.from + (this.state.doc.content.size - t.doc.content.size);
      (s > 0 && s < this.state.doc.content.size && this.state.doc.nodeAt(s)) == r.node && (i = s);
    }
    this.dragging = new Cd(e.slice, e.move, i < 0 ? void 0 : H.create(this.state.doc, i));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let l = this.directPlugins[o].props[e];
      if (l != null && (i = t ? t(l) : l))
        return i;
    }
    let s = this.state.plugins;
    if (s)
      for (let o = 0; o < s.length; o++) {
        let l = s[o].props[e];
        if (l != null && (i = t ? t(l) : l))
          return i;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (Fe) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && C0(this.dom), Ct(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return A0(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return nd(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return R0(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return wr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return wr(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Serialize the given slice as it would be if it was copied from
  this editor. Returns a DOM element that contains a
  representation of the slice as its children, a textual
  representation, and the transformed slice (which can be
  different from the given input due to hooks like
  [`transformCopied`](https://prosemirror.net/docs/ref/#view.EditorProps.transformCopied)).
  */
  serializeForClipboard(e) {
    return Ro(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (cw(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ys(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, f0());
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return dw(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Ae && this.root.nodeType === 11 && y0(this.dom.ownerDocument) == this.dom && Bw(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Ad.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function Aa(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [Ie.node(0, n.state.doc.content.size, e)];
}
function Da(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: Ie.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Pa(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Uw(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Na(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Kw(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function Ia(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var jt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, gi = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Jw = typeof navigator < "u" && /Mac/.test(navigator.platform), Xw = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ee = 0; Ee < 10; Ee++) jt[48 + Ee] = jt[96 + Ee] = String(Ee);
for (var Ee = 1; Ee <= 24; Ee++) jt[Ee + 111] = "F" + Ee;
for (var Ee = 65; Ee <= 90; Ee++)
  jt[Ee] = String.fromCharCode(Ee + 32), gi[Ee] = String.fromCharCode(Ee);
for (var bs in jt) gi.hasOwnProperty(bs) || (gi[bs] = jt[bs]);
function Yw(n) {
  var e = Jw && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Xw && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? gi : jt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Gw = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Zw = typeof navigator < "u" && /Win/.test(navigator.platform);
function Qw(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      Gw ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function ex(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Qw(t)] = n[t];
  return e;
}
function ws(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function tx(n) {
  return new me({ props: { handleKeyDown: Dd(n) } });
}
function Dd(n) {
  let e = ex(n);
  return function(t, r) {
    let i = Yw(r), s, o = e[ws(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[ws(i, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(Zw && r.ctrlKey && r.altKey) && (s = jt[r.keyCode]) && s != i) {
        let l = e[ws(s, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var nx = Object.defineProperty, Fo = (n, e) => {
  for (var t in e)
    nx(n, t, { get: e[t], enumerable: !0 });
};
function $i(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: s } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return s;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, s = t.storedMarks, t;
    }
  };
}
var zi = class {
  constructor(n) {
    this.editor = n.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = n.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: n, editor: e, state: t } = this, { view: r } = e, { tr: i } = t, s = this.buildProps(i);
    return Object.fromEntries(
      Object.entries(n).map(([o, l]) => [o, (...c) => {
        const u = l(...c)(s);
        return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), u;
      }])
    );
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(n, e = !0) {
    const { rawCommands: t, editor: r, state: i } = this, { view: s } = r, o = [], l = !!n, a = n || i.tr, c = () => (!l && e && !a.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(a), o.every((d) => d === !0)), u = {
      ...Object.fromEntries(
        Object.entries(t).map(([d, f]) => [d, (...p) => {
          const m = this.buildProps(a, e), g = f(...p)(m);
          return o.push(g), u;
        }])
      ),
      run: c
    };
    return u;
  }
  createCan(n) {
    const { rawCommands: e, state: t } = this, r = !1, i = n || t.tr, s = this.buildProps(i, r);
    return {
      ...Object.fromEntries(
        Object.entries(e).map(([l, a]) => [l, (...c) => a(...c)({ ...s, dispatch: void 0 })])
      ),
      chain: () => this.createChain(i, r)
    };
  }
  buildProps(n, e = !0) {
    const { rawCommands: t, editor: r, state: i } = this, { view: s } = r, o = {
      tr: n,
      editor: r,
      view: s,
      state: $i({
        state: i,
        transaction: n
      }),
      dispatch: e ? () => {
      } : void 0,
      chain: () => this.createChain(n, e),
      can: () => this.createCan(n),
      get commands() {
        return Object.fromEntries(
          Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)(o)])
        );
      }
    };
    return o;
  }
}, Pd = {};
Fo(Pd, {
  blur: () => rx,
  clearContent: () => ix,
  clearNodes: () => sx,
  command: () => ox,
  createParagraphNear: () => lx,
  cut: () => ax,
  deleteCurrentNode: () => cx,
  deleteNode: () => ux,
  deleteRange: () => dx,
  deleteSelection: () => fx,
  enter: () => hx,
  exitCode: () => px,
  extendMarkRange: () => mx,
  first: () => gx,
  focus: () => vx,
  forEach: () => bx,
  insertContent: () => wx,
  insertContentAt: () => kx,
  joinBackward: () => Tx,
  joinDown: () => Ex,
  joinForward: () => Mx,
  joinItemBackward: () => Ox,
  joinItemForward: () => Ax,
  joinTextblockBackward: () => Dx,
  joinTextblockForward: () => Px,
  joinUp: () => Cx,
  keyboardShortcut: () => Ix,
  lift: () => Rx,
  liftEmptyBlock: () => _x,
  liftListItem: () => Bx,
  newlineInCode: () => Lx,
  resetAttributes: () => $x,
  scrollIntoView: () => zx,
  selectAll: () => Fx,
  selectNodeBackward: () => Vx,
  selectNodeForward: () => qx,
  selectParentNode: () => Wx,
  selectTextblockEnd: () => Hx,
  selectTextblockStart: () => jx,
  setContent: () => Ux,
  setMark: () => hS,
  setMeta: () => pS,
  setNode: () => mS,
  setNodeSelection: () => gS,
  setTextDirection: () => yS,
  setTextSelection: () => vS,
  sinkListItem: () => bS,
  splitBlock: () => wS,
  splitListItem: () => xS,
  toggleList: () => SS,
  toggleMark: () => kS,
  toggleNode: () => CS,
  toggleWrap: () => ES,
  undoInputRule: () => TS,
  unsetAllMarks: () => MS,
  unsetMark: () => OS,
  unsetTextDirection: () => AS,
  updateAttributes: () => DS,
  wrapIn: () => PS,
  wrapInList: () => NS
});
var rx = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), ix = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), sx = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(a)), f = c.resolve(u.map(a + l.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = Kn(h);
      if (l.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, ox = (n) => (e) => n(e), lx = () => ({ state: n, dispatch: e }) => ju(n, e), ax = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new G(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, cx = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let s = i.depth; s > 0; s -= 1)
    if (i.node(s).type === r.type) {
      if (e) {
        const l = i.before(s), a = i.after(s);
        n.delete(l, a).scrollIntoView();
      }
      return !0;
    }
  return !1;
};
function Se(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var ux = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = Se(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const a = s.before(o), c = s.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, dx = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, fx = () => ({ state: n, dispatch: e }) => To(n, e), hx = () => ({ commands: n }) => n.keyboardShortcut("Enter"), px = () => ({ state: n, dispatch: e }) => Gb(n, e);
function Vo(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function yi(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Vo(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Nd(n, e, t = {}) {
  return n.find((r) => r.type === e && yi(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Ra(n, e, t = {}) {
  return !!Nd(n, e, t);
}
function Id(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !Nd([...i.node.marks], e, t)))
    return;
  let o = i.index, l = n.start() + i.offset, a = o + 1, c = l + i.node.nodeSize;
  for (; o > 0 && Ra([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, l -= n.parent.child(o).nodeSize;
  for (; a < n.parent.childCount && Ra([...n.parent.child(a).marks], e, t); )
    c += n.parent.child(a).nodeSize, a += 1;
  return {
    from: l,
    to: c
  };
}
function Ot(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var mx = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = Ot(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: u } = l;
  if (i) {
    const d = Id(a, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = G.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, gx = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Rd(n) {
  return n instanceof G;
}
function sn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function _d(n, e = null) {
  if (!e)
    return null;
  const t = Z.atStart(n), r = Z.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? G.create(n, sn(0, i, s), sn(n.content.size, i, s)) : G.create(n, sn(e, i, s), sn(e, i, s));
}
function eo() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Sr() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function yx() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var vx = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (Sr() || eo()) && r.dom.focus(), yx() && !Sr() && !eo() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !Rd(t.state.selection))
    return o(), !0;
  const l = _d(i.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return s && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, bx = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), wx = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Bd = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Bd(r);
  }
  return n;
};
function zr(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Bd(t);
}
function kr(n, e, t) {
  if (n instanceof $t || n instanceof A)
    return n;
  t = {
    slice: !0,
    parseOptions: {},
    ...t
  };
  const r = typeof n == "object" && n !== null, i = typeof n == "string";
  if (r)
    try {
      if (Array.isArray(n) && n.length > 0)
        return A.fromArray(n.map((l) => e.nodeFromJSON(l)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (s) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), kr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, l = "";
      const a = new yu({
        topNode: e.spec.topNode,
        marks: e.spec.marks,
        // Prosemirror's schemas are executed such that: the last to execute, matches last
        // This means that we can add a catch-all node at the end of the schema to catch any content that we don't know how to handle
        nodes: e.spec.nodes.append({
          __tiptap__private__unknown__catch__all__node: {
            content: "inline*",
            group: "block",
            parseDOM: [
              {
                tag: "*",
                getAttrs: (c) => (o = !0, l = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? zt.fromSchema(a).parseSlice(zr(n), t.parseOptions) : zt.fromSchema(a).parse(zr(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${l}`)
        });
    }
    const s = zt.fromSchema(e);
    return t.slice ? s.parseSlice(zr(n), t.parseOptions).content : s.parse(zr(n), t.parseOptions);
  }
  return kr("", e, t);
}
function xx(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof ve || i instanceof be))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(Z.near(n.doc.resolve(o), t));
}
var Sx = (n) => !("type" in n), kx = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
  var o;
  if (i) {
    t = {
      parseOptions: s.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let l;
    const a = (g) => {
      s.emit("contentError", {
        editor: s,
        error: g,
        disableCollaboration: () => {
          "collaboration" in s.storage && typeof s.storage.collaboration == "object" && s.storage.collaboration && (s.storage.collaboration.isDisabled = !0);
        }
      });
    }, c = {
      preserveWhitespace: "full",
      ...t.parseOptions
    };
    if (!t.errorOnInvalidContent && !s.options.enableContentCheck && s.options.emitContentError)
      try {
        kr(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        a(g);
      }
    try {
      l = kr(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return a(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((Sx(l) ? l : [l]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof A) {
        let g = "";
        e.forEach((v) => {
          v.text && (g += v.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = l;
      const g = r.doc.resolve(u), v = g.node(), w = g.parentOffset === 0, x = v.isText || v.isTextblock, b = v.content.size > 0;
      w && x && b && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && xx(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, Cx = () => ({ state: n, dispatch: e }) => Jb(n, e), Ex = () => ({ state: n, dispatch: e }) => Xb(n, e), Tx = () => ({ state: n, dispatch: e }) => $u(n, e), Mx = () => ({ state: n, dispatch: e }) => qu(n, e), Ox = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ni(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Ax = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ni(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Dx = () => ({ state: n, dispatch: e }) => Ub(n, e), Px = () => ({ state: n, dispatch: e }) => Kb(n, e);
function Ld() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Nx(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      Sr() || Ld() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var Ix = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = Nx(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a?.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function Cr(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? Se(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, i, (d, f) => {
    if (d.isText)
      return;
    const h = Math.max(r, f), p = Math.min(i, f + d.nodeSize);
    l.push({
      node: d,
      from: h,
      to: p
    });
  });
  const a = i - r, c = l.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => yi(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= a;
}
var Rx = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return Cr(t, i, e) ? Yb(t, r) : !1;
}, _x = () => ({ state: n, dispatch: e }) => Uu(n, e), Bx = (n) => ({ state: e, dispatch: t }) => {
  const r = Se(n, e.schema);
  return a0(r)(e, t);
}, Lx = () => ({ state: n, dispatch: e }) => Hu(n, e);
function Fi(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function _a(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var $x = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = Fi(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (s = Se(n, r.schema)), l === "mark" && (o = Ot(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (a = !0, i && t.setNodeMarkup(d, void 0, _a(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (a = !0, i && t.addMark(d, d + u.nodeSize, o.create(_a(f.attrs, e))));
      });
    });
  }), a;
}, zx = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Fx = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new je(n.doc);
    n.setSelection(t);
  }
  return !0;
}, Vx = () => ({ state: n, dispatch: e }) => Fu(n, e), qx = () => ({ state: n, dispatch: e }) => Wu(n, e), Wx = () => ({ state: n, dispatch: e }) => e0(n, e), Hx = () => ({ state: n, dispatch: e }) => r0(n, e), jx = () => ({ state: n, dispatch: e }) => n0(n, e);
function to(n, e, t = {}, r = {}) {
  return kr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var Ux = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: l }) => {
  const { doc: a } = s;
  if (r.preserveWhitespace !== "full") {
    const c = to(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, a.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), l.insertContentAt({ from: 0, to: a.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function $d(n, e) {
  const t = Ot(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function Kx(n, e) {
  const t = new Ru(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function Jx(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function Xx(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function qo(n) {
  return (e) => Xx(e.$from, n);
}
function W(n, e, t) {
  return n.config[e] === void 0 && n.parent ? W(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? W(n.parent, e, t) : null
  }) : n.config[e];
}
function Wo(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = W(e, "addExtensions", t);
    return r ? [e, ...Wo(r())] : e;
  }).flat(10);
}
function Ho(n, e) {
  const t = xn.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function zd(n) {
  return typeof n == "function";
}
function le(n, e = void 0, ...t) {
  return zd(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Yx(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Wn(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Fd(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Wn(n), i = [...t, ...r], s = {
    default: null,
    validate: void 0,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  }, o = t.filter((c) => c.name !== "text").map((c) => c.name), l = r.map((c) => c.name), a = [...o, ...l];
  return n.forEach((c) => {
    const u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      extensions: i
    }, d = W(
      c,
      "addGlobalAttributes",
      u
    );
    if (!d)
      return;
    d().forEach((h) => {
      let p;
      Array.isArray(h.types) ? p = h.types : h.types === "*" ? p = a : h.types === "nodes" ? p = o : h.types === "marks" ? p = l : p = [], p.forEach((m) => {
        Object.entries(h.attributes).forEach(([g, v]) => {
          e.push({
            type: m,
            name: g,
            attribute: {
              ...s,
              ...v
            }
          });
        });
      });
    });
  }), i.forEach((c) => {
    const u = {
      name: c.name,
      options: c.options,
      storage: c.storage
    }, d = W(
      c,
      "addAttributes",
      u
    );
    if (!d)
      return;
    const f = d();
    Object.entries(f).forEach(([h, p]) => {
      const m = {
        ...s,
        ...p
      };
      typeof m?.default == "function" && (m.default = m.default()), m?.isRequired && m?.default === void 0 && delete m.default, e.push({
        type: c.name,
        name: h,
        attribute: m
      });
    });
  }), e;
}
function Gx(n) {
  const e = [];
  let t = "", r = !1, i = !1, s = 0;
  const o = n.length;
  for (let l = 0; l < o; l += 1) {
    const a = n[l];
    if (a === "'" && !i) {
      r = !r, t += a;
      continue;
    }
    if (a === '"' && !r) {
      i = !i, t += a;
      continue;
    }
    if (!r && !i) {
      if (a === "(") {
        s += 1, t += a;
        continue;
      }
      if (a === ")" && s > 0) {
        s -= 1, t += a;
        continue;
      }
      if (a === ";" && s === 0) {
        e.push(t), t = "";
        continue;
      }
    }
    t += a;
  }
  return t && e.push(t), e;
}
function Ba(n) {
  const e = [], t = Gx(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const l = s.slice(0, o).trim(), a = s.slice(o + 1).trim();
    l && a && e.push([l, a]);
  }
  return e;
}
function Vd(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      if (i === "class") {
        const l = s ? String(s).split(" ") : [], a = r[i] ? r[i].split(" ") : [], c = l.filter((u) => !a.includes(u));
        r[i] = [...a, ...c].join(" ");
      } else if (i === "style") {
        const l = new Map([...Ba(r[i]), ...Ba(s)]);
        r[i] = Array.from(l.entries()).map(([a, c]) => `${a}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function vi(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => Vd(t, r), {});
}
function Zx(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function La(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : Zx(t.getAttribute(o.name));
        return l == null ? s : {
          ...s,
          [o.name]: l
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function $a(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && Yx(t) ? !1 : t != null)
  );
}
function za(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function Qx(n, e) {
  var t;
  const r = Fd(n), { nodeExtensions: i, markExtensions: s } = Wn(n), o = (t = i.find((c) => W(c, "topNode"))) == null ? void 0 : t.name, l = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((v) => v.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((v, w) => {
        const x = W(w, "extendNodeSchema", d);
        return {
          ...v,
          ...x ? x(c) : {}
        };
      }, {}), h = $a({
        ...f,
        content: le(W(c, "content", d)),
        marks: le(W(c, "marks", d)),
        group: le(W(c, "group", d)),
        inline: le(W(c, "inline", d)),
        atom: le(W(c, "atom", d)),
        selectable: le(W(c, "selectable", d)),
        draggable: le(W(c, "draggable", d)),
        code: le(W(c, "code", d)),
        whitespace: le(W(c, "whitespace", d)),
        linebreakReplacement: le(
          W(c, "linebreakReplacement", d)
        ),
        defining: le(W(c, "defining", d)),
        isolating: le(W(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(za))
      }), p = le(W(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (v) => La(v, u)
      ));
      const m = W(c, "renderHTML", d);
      m && (h.toDOM = (v) => m({
        node: v,
        HTMLAttributes: vi(v, u)
      }));
      const g = W(c, "renderText", d);
      return g && (h.toText = g), [c.name, h];
    })
  ), a = Object.fromEntries(
    s.map((c) => {
      const u = r.filter((g) => g.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((g, v) => {
        const w = W(v, "extendMarkSchema", d);
        return {
          ...g,
          ...w ? w(c) : {}
        };
      }, {}), h = $a({
        ...f,
        inclusive: le(W(c, "inclusive", d)),
        excludes: le(W(c, "excludes", d)),
        group: le(W(c, "group", d)),
        spanning: le(W(c, "spanning", d)),
        code: le(W(c, "code", d)),
        attrs: Object.fromEntries(u.map(za))
      }), p = le(W(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => La(g, u)
      ));
      const m = W(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: vi(g, u)
      })), [c.name, h];
    })
  );
  return new yu({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function eS(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function ar(n) {
  return n.sort((t, r) => {
    const i = W(t, "priority") || 100, s = W(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function qd(n) {
  const e = ar(Wo(n)), t = eS(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function Wd(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = t || {};
  let l = "";
  return n.nodesBetween(r, i, (a, c, u, d) => {
    var f;
    a.isBlock && c > r && (l += s);
    const h = o?.[a.type.name];
    if (h)
      return u && (l += h({
        node: a,
        pos: c,
        parent: u,
        index: d,
        range: e
      })), !1;
    a.isText && (l += (f = a?.text) == null ? void 0 : f.slice(Math.max(r, c) - c, i - c));
  }), l;
}
function tS(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Wd(n, t, e);
}
function Hd(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function nS(n, e) {
  const t = Se(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (l) => {
    s.push(l);
  });
  const o = s.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function rS(n, e) {
  const t = Fi(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? nS(n, e) : t === "mark" ? $d(n, e) : {};
}
function iS(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function sS(n) {
  const e = iS(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function oS(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[s];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(s).map(l, -1), u = e.slice(s).map(a), d = e.invert().map(c, -1), f = e.invert().map(u);
      r.push({
        oldRange: {
          from: d,
          to: f
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), sS(r);
}
function Gn(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Gr(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var lS = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (i, s, o, l) => {
    var a, c;
    const u = ((c = (a = i.type.spec).toText) == null ? void 0 : c.call(a, {
      node: i,
      pos: s,
      parent: o,
      index: l
    })) || i.textContent || "%leaf%";
    t += i.isAtom && !i.isText ? u : u.slice(0, Math.max(0, r - s));
  }), t;
};
function no(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? Ot(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => yi(d.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const v = Math.max(h, g), w = Math.min(p, g + m.nodeSize), x = w - v;
      o += x, l.push(
        ...m.marks.map((b) => ({
          mark: b,
          from: v,
          to: w
        }))
      );
    });
  }), o === 0)
    return !1;
  const a = l.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => yi(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = l.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function aS(n, e, t = {}) {
  if (!e)
    return Cr(n, null, t) || no(n, null, t);
  const r = Fi(e, n.schema);
  return r === "node" ? Cr(n, e, t) : r === "mark" ? no(n, e, t) : !1;
}
function Fa(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Va(n, e) {
  const { nodeExtensions: t } = Wn(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = le(W(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Vi(n, {
  checkChildren: e = !0,
  ignoreWhitespace: t = !1
} = {}) {
  var r;
  if (t) {
    if (n.type.name === "hardBreak")
      return !0;
    if (n.isText)
      return !/\S/.test((r = n.text) != null ? r : "");
  }
  if (n.isText)
    return !n.text;
  if (n.isAtom || n.isLeaf)
    return !1;
  if (n.content.childCount === 0)
    return !0;
  if (e) {
    let i = !0;
    return n.content.forEach((s) => {
      i !== !1 && (Vi(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
function cS(n) {
  return n instanceof H;
}
var jd = class Ud {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new Ud(e.position);
  }
  /**
   * Converts the MappablePosition to a JSON object.
   */
  toJSON() {
    return {
      position: this.position
    };
  }
};
function uS(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new jd(t.pos),
    mapResult: t
  };
}
function dS(n) {
  return new jd(n);
}
function fS(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Rd(i) && (s = i.$cursor), s) {
    const l = (r = n.storedMarks) != null ? r : s.marks();
    return s.parent.type.allowsMarkType(t) && (!!t.isInSet(l) || !l.some((c) => c.type.excludes(t)));
  }
  const { ranges: o } = i;
  return o.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(l.pos, a.pos, (u, d, f) => {
      if (c)
        return !1;
      if (u.isInline) {
        const h = !f || f.type.allowsMarkType(t), p = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = h && p;
      }
      return !c;
    }), c;
  });
}
var hS = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: l } = s, a = Ot(n, r.schema);
  if (i)
    if (o) {
      const c = $d(r, a);
      t.addStoredMark(
        a.create({
          ...c,
          ...e
        })
      );
    } else
      l.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, h) => {
          const p = Math.max(h, u), m = Math.min(h + f.nodeSize, d);
          f.marks.find((v) => v.type === a) ? f.marks.forEach((v) => {
            a === v.type && t.addMark(
              p,
              m,
              a.create({
                ...v.attrs,
                ...e
              })
            );
          }) : t.addMark(p, m, a.create(e));
        });
      });
  return fS(r, t, a);
}, pS = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), mS = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = Se(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: l }) => ea(s, { ...o, ...e })(t) ? !0 : l.clearNodes()).command(({ state: l }) => ea(s, { ...o, ...e })(l, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, gS = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = sn(n, 0, r.content.size), s = H.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, yS = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, l;
  return typeof e == "number" ? (o = e, l = e) : e && "from" in e && "to" in e ? (o = e.from, l = e.to) : (o = s.from, l = s.to), i && t.doc.nodesBetween(o, l, (a, c) => {
    a.isText || t.setNodeMarkup(c, void 0, {
      ...a.attrs,
      dir: n
    });
  }), !0;
}, vS = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = G.atStart(r).from, l = G.atEnd(r).to, a = sn(i, o, l), c = sn(s, o, l), u = G.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, bS = (n) => ({ state: e, dispatch: t }) => {
  const r = Se(n, e.schema);
  return d0(r)(e, t);
};
function qa(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var wS = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: l, $to: a } = s, c = i.extensionManager.attributes, u = Gr(c, l.node().type.name, l.node().attrs);
  if (s instanceof H && s.node.isBlock)
    return !l.parentOffset || !kt(o, l.pos) ? !1 : (r && (n && qa(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  const d = a.parentOffset === a.parent.content.size, f = l.depth === 0 ? void 0 : Jx(l.node(-1).contentMatchAt(l.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = kt(e.doc, e.mapping.map(l.pos), 1, h);
  if (!h && !p && kt(e.doc, e.mapping.map(l.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof G && e.deleteSelection(), e.split(e.mapping.map(l.pos), 1, h), f && !d && !l.parentOffset && l.parent.type !== f)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(l.before()), f);
    }
    n && qa(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, xS = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const l = Se(n, r.schema), { $from: a, $to: c } = r.selection, u = r.selection.node;
  if (u && u.isBlock || a.depth < 2 || !a.sameParent(c))
    return !1;
  const d = a.node(-1);
  if (d.type !== l)
    return !1;
  const f = s.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== l || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (i) {
      let v = A.empty;
      const w = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let T = a.depth - w; T >= a.depth - 3; T -= 1)
        v = A.from(a.node(T).copy(v));
      const x = (
        // eslint-disable-next-line no-nested-ternary
        a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3
      ), b = {
        ...Gr(f, a.node().type.name, a.node().attrs),
        ...e
      }, k = ((o = l.contentMatch.defaultType) == null ? void 0 : o.createAndFill(b)) || void 0;
      v = v.append(A.from(l.createAndFill(null, k) || void 0));
      const C = a.before(a.depth - (w - 1));
      t.replace(C, a.after(-x), new L(v, 4 - w, 0));
      let S = -1;
      t.doc.nodesBetween(C, t.doc.content.size, (T, E) => {
        if (S > -1)
          return !1;
        T.isTextblock && T.content.size === 0 && (S = E + 1);
      }), S > -1 && t.setSelection(G.near(t.doc.resolve(S))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === a.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Gr(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Gr(f, a.node().type.name, a.node().attrs),
    ...e
  };
  t.delete(a.pos, c.pos);
  const g = h ? [
    { type: l, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: l, attrs: p }];
  if (!kt(t.doc, a.pos, 2))
    return !1;
  if (i) {
    const { selection: v, storedMarks: w } = r, { splittableMarks: x } = s.extensionManager, b = w || v.$to.parentOffset && v.$from.marks();
    if (t.split(a.pos, 2, g).scrollIntoView(), !b || !i)
      return !0;
    const k = b.filter((C) => x.includes(C.type.name));
    t.ensureMarks(k);
  }
  return !0;
}, xs = (n, e) => {
  const t = qo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Sn(n.doc, t.pos) && n.join(t.pos), !0;
}, Ss = (n, e) => {
  const t = qo((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Sn(n.doc, r) && n.join(r), !0;
}, SS = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = Se(n, o.schema), p = Se(e, o.schema), { selection: m, storedMarks: g } = o, { $from: v, $to: w } = m, x = v.blockRange(w), b = g || m.$to.parentOffset && m.$from.marks();
  if (!x)
    return !1;
  const k = qo((C) => Va(C.type.name, d))(m);
  if (x.depth >= 1 && k && x.depth - k.depth <= 1) {
    if (k.node.type === h)
      return c.liftListItem(p);
    if (Va(k.node.type.name, d) && h.validContent(k.node.content) && l)
      return a().command(() => (s.setNodeMarkup(k.pos, h), !0)).command(() => xs(s, h)).command(() => Ss(s, h)).run();
  }
  return !t || !b || !l ? a().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => xs(s, h)).command(() => Ss(s, h)).run() : a().command(() => {
    const C = u().wrapInList(h, r), S = b.filter((T) => f.includes(T.type.name));
    return s.ensureMarks(S), C ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => xs(s, h)).command(() => Ss(s, h)).run();
}, kS = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = Ot(n, r.schema);
  return no(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, CS = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = Se(n, r.schema), o = Se(e, r.schema), l = Cr(r, s, t);
  let a;
  return r.selection.$anchor.sameParent(r.selection.$head) && (a = r.selection.$anchor.parent.attrs), l ? i.setNode(o, a) : i.setNode(s, { ...a, ...t });
}, ES = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = Se(n, t.schema);
  return Cr(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, TS = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(n))) {
      if (e) {
        const o = n.tr, l = s.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (s.text) {
          const a = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, n.schema.text(s.text, a));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, MS = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, OS = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = Ot(n, r.schema), { $from: c, empty: u, ranges: d } = l;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = l;
    const p = (s = c.marks().find((g) => g.type === a)) == null ? void 0 : s.attrs, m = Id(c, a, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, a);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, AS = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (l, a) => {
    if (l.isText)
      return;
    const c = { ...l.attrs };
    delete c.dir, e.setNodeMarkup(a, void 0, c);
  }), !0;
}, DS = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = Fi(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (s = Se(n, r.schema)), l === "mark" && (o = Ot(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let f, h, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, v) => {
      s && s === g.type && (a = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), f = v, h = g);
    }) : r.doc.nodesBetween(u, d, (g, v) => {
      v < u && s && s === g.type && (a = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), f = v, h = g), v >= u && v <= d && (s && s === g.type && (a = !0, i && t.setNodeMarkup(v, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((w) => {
        if (o === w.type && (a = !0, i)) {
          const x = Math.max(v, u), b = Math.min(v + g.nodeSize, d);
          t.addMark(
            x,
            b,
            o.create({
              ...w.attrs,
              ...e
            })
          );
        }
      }));
    }), h && (f !== void 0 && i && t.setNodeMarkup(f, void 0, {
      ...h.attrs,
      ...e
    }), o && h.marks.length && h.marks.forEach((g) => {
      o === g.type && i && t.addMark(
        p,
        m,
        o.create({
          ...g.attrs,
          ...e
        })
      );
    }));
  }), a;
}, PS = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return i0(i, e)(t, r);
}, NS = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return s0(i, e)(t, r);
}, IS = class {
  constructor() {
    this.callbacks = {};
  }
  on(n, e) {
    return this.callbacks[n] || (this.callbacks[n] = []), this.callbacks[n].push(e), this;
  }
  emit(n, ...e) {
    const t = this.callbacks[n];
    return t && t.forEach((r) => r.apply(this, e)), this;
  }
  off(n, e) {
    const t = this.callbacks[n];
    return t && (e ? this.callbacks[n] = t.filter((r) => r !== e) : delete this.callbacks[n]), this;
  }
  once(n, e) {
    const t = (...r) => {
      this.off(n, t), e.apply(this, r);
    };
    return this.on(n, t);
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}, RS = (n, e) => {
  if (Vo(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Fr(n) {
  var e;
  const { editor: t, from: r, to: i, text: s, rules: o, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || (e = c.nodeBefore || c.nodeAfter) != null && e.marks.find((f) => f.type.spec.code)
  )
    return !1;
  let u = !1;
  const d = lS(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = RS(d, f.find);
    if (!h)
      return;
    const p = a.state.tr, m = $i({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: v, chain: w, can: x } = new zi({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: v,
      chain: w,
      can: x
    }) === null || !p.steps.length || (f.undoable && p.setMeta(l, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), a.dispatch(p), u = !0);
  }), u;
}
function _S(n) {
  const { editor: e, rules: t } = n, r = new me({
    state: {
      init() {
        return null;
      },
      apply(i, s, o) {
        const l = i.getMeta(r);
        if (l)
          return l;
        const a = i.getMeta("applyInputRules");
        return a && setTimeout(() => {
          let { text: u } = a;
          typeof u == "string" ? u = u : u = Ho(A.from(u), o.schema);
          const { from: d } = a, f = d + u.length;
          Fr({
            editor: e,
            from: d,
            to: f,
            text: u,
            rules: t,
            plugin: r
          });
        }), i.selectionSet || i.docChanged ? null : s;
      }
    },
    props: {
      handleTextInput(i, s, o, l) {
        return Fr({
          editor: e,
          from: s,
          to: o,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: s } = i.state.selection;
          s && Fr({
            editor: e,
            from: s.pos,
            to: s.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      // add support for input rules to trigger on enter
      // this is useful for example for code blocks
      handleKeyDown(i, s) {
        if (s.key !== "Enter")
          return !1;
        const { $cursor: o } = i.state.selection;
        return o ? Fr({
          editor: e,
          from: o.pos,
          to: o.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    // @ts-ignore
    isInputRules: !0
  });
  return r;
}
function BS(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Vr(n) {
  return BS(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Kd(n, e) {
  const t = { ...n };
  return Vr(n) && Vr(e) && Object.keys(e).forEach((r) => {
    Vr(e[r]) && Vr(n[r]) ? t[r] = Kd(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var jo = class {
  constructor(n = {}) {
    this.type = "extendable", this.parent = null, this.child = null, this.name = "", this.config = {
      name: this.name
    }, this.config = {
      ...this.config,
      ...n
    }, this.name = this.config.name;
  }
  get options() {
    return {
      ...le(
        W(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...le(
        W(this, "addStorage", {
          name: this.name,
          options: this.options
        })
      ) || {}
    };
  }
  configure(n = {}) {
    const e = this.extend({
      ...this.config,
      addOptions: () => Kd(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, LS = class Jd extends jo {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Jd(t);
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const o = i.marks();
      if (!!!o.find((c) => c?.type.name === t.name))
        return !1;
      const a = o.find((c) => c?.type.name === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
};
function $S(n) {
  return typeof n == "number";
}
var zS = (n, e, t) => {
  if (Vo(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function FS(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: u } = new zi({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, v, w, x;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const b = (x = (w = (v = h.content) == null ? void 0 : v.size) != null ? w : h.nodeSize) != null ? x : 0, k = Math.max(r, p), C = Math.min(i, p + b);
    if (k >= C)
      return;
    const S = h.isText ? h.text || "" : h.textBetween(k - p, C - p, void 0, "￼");
    zS(S, s.find, o).forEach((E) => {
      if (E.index === void 0)
        return;
      const M = k + E.index + 1, R = M + E[0].length, _ = {
        from: t.tr.mapping.map(M),
        to: t.tr.mapping.map(R)
      }, q = s.handler({
        state: t,
        range: _,
        match: E,
        commands: a,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: l
      });
      d.push(q);
    });
  }), d.every((h) => h !== null);
}
var qr = null, VS = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function qS(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, s = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, l;
  try {
    l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  } catch {
    l = null;
  }
  const a = ({
    state: u,
    from: d,
    to: f,
    rule: h,
    pasteEvt: p
  }) => {
    const m = u.tr, g = $i({
      state: u,
      transaction: m
    });
    if (!(!FS({
      editor: e,
      state: g,
      from: Math.max(d - 1, 0),
      to: f.b - 1,
      rule: h,
      pasteEvent: p,
      dropEvent: l
    }) || !m.steps.length)) {
      try {
        l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
      } catch {
        l = null;
      }
      return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, m;
    }
  };
  return t.map((u) => new me({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (qr = e);
      }, h = () => {
        qr && (qr = null);
      };
      return window.addEventListener("dragstart", f), window.addEventListener("dragend", h), {
        destroy() {
          window.removeEventListener("dragstart", f), window.removeEventListener("dragend", h);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (d, f) => {
          if (s = r === d.dom.parentElement, l = f, !s) {
            const h = qr;
            h?.isEditable && setTimeout(() => {
              const p = h.state.selection;
              p && h.commands.deleteRange({ from: p.from, to: p.to });
            }, 10);
          }
          return !1;
        },
        paste: (d, f) => {
          var h;
          const p = (h = f.clipboardData) == null ? void 0 : h.getData("text/html");
          return o = f, i = !!p?.includes("data-pm-slice"), !1;
        }
      }
    },
    appendTransaction: (d, f, h) => {
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, v = p.getMeta("applyPasteRules"), w = !!v;
      if (!m && !g && !w)
        return;
      if (w) {
        let { text: k } = v;
        typeof k == "string" ? k = k : k = Ho(A.from(k), h.schema);
        const { from: C } = v, S = C + k.length, T = VS(k);
        return a({
          rule: u,
          state: h,
          from: C,
          to: { b: S },
          pasteEvt: T
        });
      }
      const x = f.doc.content.findDiffStart(h.doc.content), b = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!$S(x) || !b || x === b.b))
        return a({
          rule: u,
          state: h,
          from: x,
          to: b,
          pasteEvt: o
        });
    }
  }));
}
var qi = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = qd(n), this.schema = Qx(this.extensions, e), this.setupExtensions();
  }
  /**
   * Get all commands from the extensions.
   * @returns An object with all commands where the key is the command name and the value is the command function
   */
  get commands() {
    return this.extensions.reduce((n, e) => {
      const t = {
        name: e.name,
        options: e.options,
        storage: this.editor.extensionStorage[e.name],
        editor: this.editor,
        type: Gn(e.name, this.schema)
      }, r = W(e, "addCommands", t);
      return r ? {
        ...n,
        ...r()
      } : n;
    }, {});
  }
  /**
   * Get all registered Prosemirror plugins from the extensions.
   * @returns An array of Prosemirror plugins
   */
  get plugins() {
    const { editor: n } = this;
    return ar([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: Gn(r.name, this.schema)
      }, s = [], o = W(
        r,
        "addKeyboardShortcuts",
        i
      );
      let l = {};
      if (r.type === "mark" && W(r, "exitable", i) && (l.ArrowRight = () => LS.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        l = { ...l, ...f };
      }
      const a = tx(l);
      s.push(a);
      const c = W(r, "addInputRules", i);
      if (Fa(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = _S({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = W(r, "addPasteRules", i);
      if (Fa(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = qS({ editor: n, rules: f });
          s.push(...h);
        }
      }
      const d = W(
        r,
        "addProseMirrorPlugins",
        i
      );
      if (d) {
        const f = d();
        s.push(...f);
      }
      return s;
    });
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return Fd(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = Wn(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!W(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Se(t.name, this.schema)
        }, s = W(t, "addNodeView", i);
        if (!s)
          return [];
        const o = s();
        if (!o)
          return [];
        const l = (a, c, u, d, f) => {
          const h = vi(a, r);
          return o({
            // pass-through
            node: a,
            view: c,
            getPos: u,
            decorations: d,
            innerDecorations: f,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: h
          });
        };
        return [t.name, l];
      })
    );
  }
  /**
   * Get the composed dispatchTransaction function from all extensions.
   * @param baseDispatch The base dispatch function (e.g. from the editor or user props)
   * @returns A composed dispatch function
   */
  dispatchTransaction(n) {
    const { editor: e } = this;
    return ar([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: Gn(i.name, this.schema)
      }, o = W(
        i,
        "dispatchTransaction",
        s
      );
      return o ? (l) => {
        o.call(s, { transaction: l, next: r });
      } : r;
    }, n);
  }
  /**
   * Get the composed transformPastedHTML function from all extensions.
   * @param baseTransform The base transform function (e.g. from the editor props)
   * @returns A composed transform function that chains all extension transforms
   */
  transformPastedHTML(n) {
    const { editor: e } = this;
    return ar([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: Gn(i.name, this.schema)
        }, o = W(
          i,
          "transformPastedHTML",
          s
        );
        return o ? (l, a) => {
          const c = r(l, a);
          return o.call(s, c);
        } : r;
      },
      n || ((r) => r)
    );
  }
  get markViews() {
    const { editor: n } = this, { markExtensions: e } = Wn(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!W(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Ot(t.name, this.schema)
        }, s = W(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (l, a, c) => {
          const u = vi(l, r);
          return s()({
            // pass-through
            mark: l,
            view: a,
            inline: c,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: u,
            updateAttributes: (d) => {
              n1(l, n, d);
            }
          });
        };
        return [t.name, o];
      })
    );
  }
  /**
   * Go through all extensions, create extension storages & setup marks
   * & bind editor event listener.
   */
  setupExtensions() {
    const n = this.extensions;
    this.editor.extensionStorage = Object.fromEntries(
      n.map((e) => [e.name, e.storage])
    ), n.forEach((e) => {
      var t;
      const r = {
        name: e.name,
        options: e.options,
        storage: this.editor.extensionStorage[e.name],
        editor: this.editor,
        type: Gn(e.name, this.schema)
      };
      e.type === "mark" && ((t = le(W(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = W(e, "onBeforeCreate", r), s = W(e, "onCreate", r), o = W(e, "onUpdate", r), l = W(
        e,
        "onSelectionUpdate",
        r
      ), a = W(e, "onTransaction", r), c = W(e, "onFocus", r), u = W(e, "onBlur", r), d = W(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
qi.resolve = qd;
qi.sort = ar;
qi.flatten = Wo;
var WS = {};
Fo(WS, {
  ClipboardTextSerializer: () => Yd,
  Commands: () => Gd,
  Delete: () => Zd,
  Drop: () => Qd,
  Editable: () => ef,
  FocusEvents: () => nf,
  Keymap: () => rf,
  Paste: () => sf,
  Tabindex: () => of,
  TextDirection: () => lf,
  focusEventsPluginKey: () => tf
});
var ye = class Xd extends jo {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Xd(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, Yd = ye.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), l = Math.max(...s.map((u) => u.$to.pos)), a = Hd(t);
            return Wd(r, { from: o, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), Gd = ye.create({
  name: "commands",
  addCommands() {
    return {
      ...Pd
    };
  }
}), Zd = ye.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, l, a, c;
      if ((c = (a = (l = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : l.filterTransaction) == null ? void 0 : a.call(l, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = Kx(n.before, [n, ...e]);
      oS(u).forEach((h) => {
        u.mapping.mapResult(h.oldRange.from).deletedAfter && u.mapping.mapResult(h.oldRange.to).deletedBefore && u.before.nodesBetween(h.oldRange.from, h.oldRange.to, (p, m) => {
          const g = m + p.nodeSize - 2, v = h.oldRange.from <= m && g <= h.oldRange.to;
          this.editor.emit("delete", {
            type: "node",
            node: p,
            from: m,
            to: g,
            newFrom: u.mapping.map(m),
            newTo: u.mapping.map(g),
            deletedRange: h.oldRange,
            newRange: h.newRange,
            partial: !v,
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        });
      });
      const f = u.mapping;
      u.steps.forEach((h, p) => {
        var m, g;
        if (h instanceof it) {
          const v = f.slice(p).map(h.from, -1), w = f.slice(p).map(h.to), x = f.invert().map(v, -1), b = f.invert().map(w), k = (m = u.doc.nodeAt(v - 1)) == null ? void 0 : m.marks.some((S) => S.eq(h.mark)), C = (g = u.doc.nodeAt(w)) == null ? void 0 : g.marks.some((S) => S.eq(h.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: h.mark,
            from: h.from,
            to: h.to,
            deletedRange: {
              from: x,
              to: b
            },
            newRange: {
              from: v,
              to: w
            },
            partial: !!(C || k),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (i = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || i ? setTimeout(s, 0) : s();
  }
}), Qd = ye.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("tiptapDrop"),
        props: {
          handleDrop: (n, e, t, r) => {
            this.editor.emit("drop", {
              editor: this.editor,
              event: e,
              slice: t,
              moved: r
            });
          }
        }
      })
    ];
  }
}), ef = ye.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), tf = new Pe("focusEvents"), nf = ye.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new me({
        key: tf,
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), rf = ye.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: d } = a, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? l.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, v = m && p.parent.childCount === 1 ? g === d.pos : Z.atStart(c).from === f;
        return !u || !h.type.isTextblock || h.textContent.length || !v || v && d.parent.type.name === "paragraph" ? !1 : o.clearNodes();
      }),
      () => o.deleteSelection(),
      () => o.joinBackward(),
      () => o.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: o }) => [
      () => o.deleteSelection(),
      () => o.deleteCurrentNode(),
      () => o.joinForward(),
      () => o.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: o }) => [
        () => o.newlineInCode(),
        () => o.createParagraphNear(),
        () => o.liftEmptyBlock(),
        () => o.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, s = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Sr() || Ld() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new me({
        key: new Pe("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: l } = e.selection, a = Z.atStart(e.doc).from, c = Z.atEnd(e.doc).to;
          if (s || !(o === a && l === c) || !Vi(t.doc))
            return;
          const f = t.tr, h = $i({
            state: t,
            transaction: f
          }), { commands: p } = new zi({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), sf = ye.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("tiptapPaste"),
        props: {
          handlePaste: (n, e, t) => {
            this.editor.emit("paste", {
              editor: this.editor,
              event: e,
              slice: t
            });
          }
        }
      })
    ];
  }
}), of = ye.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), lf = ye.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = Wn(this.extensions);
    return [
      {
        types: n.filter((e) => e.name !== "text").map((e) => e.name),
        attributes: {
          dir: {
            default: this.options.direction,
            parseHTML: (e) => {
              const t = e.getAttribute("dir");
              return t && (t === "ltr" || t === "rtl" || t === "auto") ? t : this.options.direction;
            },
            renderHTML: (e) => e.dir ? {
              dir: e.dir
            } : {}
          }
        }
      }
    ];
  },
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("textDirection"),
        props: {
          attributes: () => {
            const n = this.options.direction;
            return n ? {
              dir: n
            } : {};
          }
        }
      })
    ];
  }
}), HS = class nr {
  constructor(e, t, r = !1, i = null) {
    this.currentNode = null, this.actualDepth = null, this.isBlock = r, this.resolvedPos = e, this.editor = t, this.currentNode = i;
  }
  get name() {
    return this.node.type.name;
  }
  get node() {
    return this.currentNode || this.resolvedPos.node();
  }
  get element() {
    return this.editor.view.domAtPos(this.pos).node;
  }
  get depth() {
    var e;
    return (e = this.actualDepth) != null ? e : this.resolvedPos.depth;
  }
  get pos() {
    return this.resolvedPos.pos;
  }
  get content() {
    return this.node.content;
  }
  set content(e) {
    let t = this.from, r = this.to;
    if (this.isBlock) {
      if (this.content.size === 0) {
        console.error(`You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`);
        return;
      }
      t = this.from + 1, r = this.to - 1;
    }
    this.editor.commands.insertContentAt({ from: t, to: r }, e);
  }
  get attributes() {
    return this.node.attrs;
  }
  get textContent() {
    return this.node.textContent;
  }
  get size() {
    return this.node.nodeSize;
  }
  get from() {
    return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
  }
  get range() {
    return {
      from: this.from,
      to: this.to
    };
  }
  get to() {
    return this.isBlock ? this.pos + this.size : this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
  }
  get parent() {
    if (this.depth === 0)
      return null;
    const e = this.resolvedPos.start(this.resolvedPos.depth - 1), t = this.resolvedPos.doc.resolve(e);
    return new nr(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new nr(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new nr(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const i = t.isBlock && !t.isTextblock, s = t.isAtom && !t.isText, o = t.isInline, l = this.pos + r + (s ? 0 : 1);
      if (l < 0 || l > this.resolvedPos.doc.nodeSize - 2)
        return;
      const a = this.resolvedPos.doc.resolve(l);
      if (!i && !o && a.depth <= this.depth)
        return;
      const c = new nr(a, this.editor, i, i || o ? t : null);
      i && (c.actualDepth = this.depth + 1), e.push(c);
    }), e;
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get lastChild() {
    const e = this.children;
    return e[e.length - 1] || null;
  }
  closest(e, t = {}) {
    let r = null, i = this.parent;
    for (; i && !r; ) {
      if (i.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const s = i.node.attrs, o = Object.keys(t);
          for (let l = 0; l < o.length; l += 1) {
            const a = o[l];
            if (s[a] !== t[a])
              break;
          }
        } else
          r = i;
      i = i.parent;
    }
    return r;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, r = !1) {
    let i = [];
    if (!this.children || this.children.length === 0)
      return i;
    const s = Object.keys(t);
    return this.children.forEach((o) => {
      r && i.length > 0 || (o.node.type.name === e && s.every((a) => t[a] === o.node.attrs[a]) && i.push(o), !(r && i.length > 0) && (i = i.concat(o.querySelectorAll(e, t, r))));
    }), i;
  }
  setAttribute(e) {
    const { tr: t } = this.editor.state;
    t.setNodeMarkup(this.from, void 0, {
      ...this.node.attrs,
      ...e
    }), this.editor.view.dispatch(t);
  }
}, jS = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 0 !important;
  height: 0 !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}`;
function US(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var KS = class extends IS {
  constructor(n = {}) {
    super(), this.css = null, this.className = "tiptap", this.editorView = null, this.isFocused = !1, this.isInitialized = !1, this.extensionStorage = {}, this.instanceId = Math.random().toString(36).slice(2, 9), this.options = {
      element: typeof document < "u" ? document.createElement("div") : null,
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      textDirection: void 0,
      editorProps: {},
      parseOptions: {},
      coreExtensionOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      enableContentCheck: !1,
      emitContentError: !1,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onMount: () => null,
      onUnmount: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null,
      onContentError: ({ error: r }) => {
        throw r;
      },
      onPaste: () => null,
      onDrop: () => null,
      onDelete: () => null,
      enableExtensionDispatchTransaction: !0
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
      getUpdatedPosition: uS,
      createMappablePosition: dS
    }, this.setOptions(n), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: r, slice: i, moved: s }) => this.options.onDrop(r, i, s)), this.on("paste", ({ event: r, slice: i }) => this.options.onPaste(r, i)), this.on("delete", this.options.onDelete);
    const e = this.createDoc(), t = _d(e, this.options.autofocus);
    this.editorState = In.create({
      doc: e,
      schema: this.schema,
      selection: t || void 0
    }), this.options.element && this.mount(this.options.element);
  }
  /**
   * Attach the editor to the DOM, creating a new editor view.
   */
  mount(n) {
    if (typeof document > "u")
      throw new Error(
        "[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment."
      );
    this.createView(n), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
      this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
    }, 0);
  }
  /**
   * Remove the editor from the DOM, but still allow remounting at a different point in time
   */
  unmount() {
    if (this.editorView) {
      const n = this.editorView.dom;
      n?.editor && delete n.editor, this.editorView.destroy();
    }
    if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length)
      try {
        typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
      } catch (n) {
        console.warn("Failed to remove CSS element:", n);
      }
    this.css = null, this.emit("unmount", { editor: this });
  }
  /**
   * Returns the editor storage.
   */
  get storage() {
    return this.extensionStorage;
  }
  /**
   * An object of all registered commands.
   */
  get commands() {
    return this.commandManager.commands;
  }
  /**
   * Create a command chain to call multiple commands at once.
   */
  chain() {
    return this.commandManager.chain();
  }
  /**
   * Check if a command or a command chain can be executed. Without executing it.
   */
  can() {
    return this.commandManager.can();
  }
  /**
   * Inject CSS styles.
   */
  injectCSS() {
    this.options.injectCSS && typeof document < "u" && (this.css = US(jS, this.options.injectNonce));
  }
  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  setOptions(n = {}) {
    this.options = {
      ...this.options,
      ...n
    }, !(!this.editorView || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  /**
   * Update editable state of the editor.
   */
  setEditable(n, e = !0) {
    this.setOptions({ editable: n }), e && this.emit("update", { editor: this, transaction: this.state.tr, appendedTransactions: [] });
  }
  /**
   * Returns whether the editor is editable.
   */
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  /**
   * Returns the editor view.
   */
  get view() {
    return this.editorView ? this.editorView : new Proxy(
      {
        state: this.editorState,
        updateState: (n) => {
          this.editorState = n;
        },
        dispatch: (n) => {
          this.dispatchTransaction(n);
        },
        // Stub some commonly accessed properties to prevent errors
        composing: !1,
        dragging: null,
        editable: !0,
        isDestroyed: !1
      },
      {
        get: (n, e) => {
          if (this.editorView)
            return this.editorView[e];
          if (e === "state")
            return this.editorState;
          if (e in n)
            return Reflect.get(n, e);
          throw new Error(
            `[tiptap error]: The editor view is not available. Cannot access view['${e}']. The editor may not be mounted yet.`
          );
        }
      }
    );
  }
  /**
   * Returns the editor state.
   */
  get state() {
    return this.editorView && (this.editorState = this.view.state), this.editorState;
  }
  /**
   * Register a ProseMirror plugin.
   *
   * @param plugin A ProseMirror plugin
   * @param handlePlugins Control how to merge the plugin into the existing plugins.
   * @returns The new editor state
   */
  registerPlugin(n, e) {
    const t = zd(e) ? e(n, [...this.state.plugins]) : [...this.state.plugins, n], r = this.state.reconfigure({ plugins: t });
    return this.view.updateState(r), r;
  }
  /**
   * Unregister a ProseMirror plugin.
   *
   * @param nameOrPluginKeyToRemove The plugins name
   * @returns The new editor state or undefined if the editor is destroyed
   */
  unregisterPlugin(n) {
    if (this.isDestroyed)
      return;
    const e = this.state.plugins;
    let t = e;
    if ([].concat(n).forEach((i) => {
      const s = typeof i == "string" ? `${i}$` : i.key;
      t = t.filter((o) => !o.key.startsWith(s));
    }), e.length === t.length)
      return;
    const r = this.state.reconfigure({
      plugins: t
    });
    return this.view.updateState(r), r;
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var n, e;
    const r = [...this.options.enableCoreExtensions ? [
      ef,
      Yd.configure({
        blockSeparator: (e = (n = this.options.coreExtensionOptions) == null ? void 0 : n.clipboardTextSerializer) == null ? void 0 : e.blockSeparator
      }),
      Gd,
      nf,
      rf,
      of,
      Qd,
      sf,
      Zd,
      lf.configure({
        direction: this.options.textDirection
      })
    ].filter((i) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[i.name] !== !1 : !0) : [], ...this.options.extensions].filter((i) => ["extension", "node", "mark"].includes(i?.type));
    this.extensionManager = new qi(r, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new zi({
      editor: this
    });
  }
  /**
   * Creates a ProseMirror schema.
   */
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  /**
   * Creates the initial document.
   */
  createDoc() {
    let n;
    try {
      n = to(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: this.options.enableContentCheck
      });
    } catch (e) {
      if (!(e instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(e.message))
        throw e;
      this.emit("contentError", {
        editor: this,
        error: e,
        disableCollaboration: () => {
          "collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((t) => t.name !== "collaboration"), this.createExtensionManager();
        }
      }), n = to(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: !1
      });
    }
    return n;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView(n) {
    const { editorProps: e, enableExtensionDispatchTransaction: t } = this.options, r = e.dispatchTransaction || this.dispatchTransaction.bind(this), i = t ? this.extensionManager.dispatchTransaction(r) : r, s = e.transformPastedHTML, o = this.extensionManager.transformPastedHTML(s);
    this.editorView = new Ad(n, {
      ...e,
      attributes: {
        // add `role="textbox"` to the editor element
        role: "textbox",
        ...e?.attributes
      },
      dispatchTransaction: i,
      transformPastedHTML: o,
      state: this.editorState,
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
    const l = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(l), this.prependClass(), this.injectCSS();
    const a = this.view.dom;
    a.editor = this;
  }
  /**
   * Creates all node and mark views.
   */
  createNodeViews() {
    this.view.isDestroyed || this.view.setProps({
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
  }
  /**
   * Prepend class name to element.
   */
  prependClass() {
    this.view.dom.className = `${this.className} ${this.view.dom.className}`;
  }
  captureTransaction(n) {
    this.isCapturingTransaction = !0, n(), this.isCapturingTransaction = !1;
    const e = this.capturedTransaction;
    return this.capturedTransaction = null, e;
  }
  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  dispatchTransaction(n) {
    if (this.view.isDestroyed)
      return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = n;
        return;
      }
      n.steps.forEach((c) => {
        var u;
        return (u = this.capturedTransaction) == null ? void 0 : u.step(c);
      });
      return;
    }
    const { state: e, transactions: t } = this.state.applyTransaction(n), r = !this.state.selection.eq(e.selection), i = t.includes(n), s = this.state;
    if (this.emit("beforeTransaction", {
      editor: this,
      transaction: n,
      nextState: e
    }), !i)
      return;
    this.view.updateState(e), this.emit("transaction", {
      editor: this,
      transaction: n,
      appendedTransactions: t.slice(1)
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: n
    });
    const o = t.findLast((c) => c.getMeta("focus") || c.getMeta("blur")), l = o?.getMeta("focus"), a = o?.getMeta("blur");
    l && this.emit("focus", {
      editor: this,
      event: l.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: o
    }), a && this.emit("blur", {
      editor: this,
      event: a.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: o
    }), !(n.getMeta("preventUpdate") || !t.some((c) => c.docChanged) || s.doc.eq(e.doc)) && this.emit("update", {
      editor: this,
      transaction: n,
      appendedTransactions: t.slice(1)
    });
  }
  /**
   * Get attributes of the currently selected node or mark.
   */
  getAttributes(n) {
    return rS(this.state, n);
  }
  isActive(n, e) {
    const t = typeof n == "string" ? n : null, r = typeof n == "string" ? e : n;
    return aS(this.state, t, r);
  }
  /**
   * Get the document as JSON.
   */
  getJSON() {
    return this.state.doc.toJSON();
  }
  /**
   * Get the document as HTML.
   */
  getHTML() {
    return Ho(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(n) {
    const { blockSeparator: e = `

`, textSerializers: t = {} } = n || {};
    return tS(this.state.doc, {
      blockSeparator: e,
      textSerializers: {
        ...Hd(this.schema),
        ...t
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Vi(this.state.doc);
  }
  /**
   * Destroy the editor.
   */
  destroy() {
    this.emit("destroy"), this.unmount(), this.removeAllListeners();
  }
  /**
   * Check if the editor is already destroyed.
   */
  get isDestroyed() {
    var n, e;
    return (e = (n = this.editorView) == null ? void 0 : n.isDestroyed) != null ? e : !0;
  }
  $node(n, e) {
    var t;
    return ((t = this.$doc) == null ? void 0 : t.querySelector(n, e)) || null;
  }
  $nodes(n, e) {
    var t;
    return ((t = this.$doc) == null ? void 0 : t.querySelectorAll(n, e)) || null;
  }
  $pos(n) {
    const e = this.state.doc.resolve(n);
    return new HS(e, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, JS = {};
Fo(JS, {
  createAtomBlockMarkdownSpec: () => XS,
  createBlockMarkdownSpec: () => YS,
  createInlineMarkdownSpec: () => QS,
  parseAttributes: () => Uo,
  parseIndentedBlocks: () => e1,
  renderNestedMarkdownContent: () => t1,
  serializeAttributes: () => Ko
});
function Uo(n) {
  if (!n?.trim())
    return {};
  const e = {}, t = [], r = n.replace(/["']([^"']*)["']/g, (c) => (t.push(c), `__QUOTED_${t.length - 1}__`)), i = r.match(/(?:^|\s)\.([a-zA-Z][\w-]*)/g);
  if (i) {
    const c = i.map((u) => u.trim().slice(1));
    e.class = c.join(" ");
  }
  const s = r.match(/(?:^|\s)#([a-zA-Z][\w-]*)/);
  s && (e.id = s[1]);
  const o = /([a-zA-Z][\w-]*)\s*=\s*(__QUOTED_\d+__)/g;
  Array.from(r.matchAll(o)).forEach(([, c, u]) => {
    var d;
    const f = parseInt(((d = u.match(/__QUOTED_(\d+)__/)) == null ? void 0 : d[1]) || "0", 10), h = t[f];
    h && (e[c] = h.slice(1, -1));
  });
  const a = r.replace(/(?:^|\s)\.([a-zA-Z][\w-]*)/g, "").replace(/(?:^|\s)#([a-zA-Z][\w-]*)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
  return a && a.split(/\s+/).filter(Boolean).forEach((u) => {
    u.match(/^[a-zA-Z][\w-]*$/) && (e[u] = !0);
  }), e;
}
function Ko(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function XS(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = Uo,
    serializeAttributes: i = Ko,
    defaultAttributes: s = {},
    requiredAttributes: o = [],
    allowedAttributes: l
  } = n, a = t || e, c = (u) => {
    if (!l)
      return u;
    const d = {};
    return l.forEach((f) => {
      f in u && (d[f] = u[f]);
    }), d;
  };
  return {
    parseMarkdown: (u, d) => {
      const f = { ...s, ...u.attributes };
      return d.createNode(e, f, []);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(u) {
        var d;
        const f = new RegExp(`^:::${a}(?:\\s|$)`, "m"), h = (d = u.match(f)) == null ? void 0 : d.index;
        return h !== void 0 ? h : -1;
      },
      tokenize(u, d, f) {
        const h = new RegExp(`^:::${a}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), p = u.match(h);
        if (!p)
          return;
        const m = p[1] || "", g = r(m);
        if (!o.find((w) => !(w in g)))
          return {
            type: e,
            raw: p[0],
            attributes: g
          };
      }
    },
    renderMarkdown: (u) => {
      const d = c(u.attrs || {}), f = i(d), h = f ? ` {${f}}` : "";
      return `:::${a}${h} :::`;
    }
  };
}
function YS(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Uo,
    serializeAttributes: s = Ko,
    defaultAttributes: o = {},
    content: l = "block",
    allowedAttributes: a
  } = n, c = t || e, u = (d) => {
    if (!a)
      return d;
    const f = {};
    return a.forEach((h) => {
      h in d && (f[h] = d[h]);
    }), f;
  };
  return {
    parseMarkdown: (d, f) => {
      let h;
      if (r) {
        const m = r(d);
        h = typeof m == "string" ? [{ type: "text", text: m }] : m;
      } else l === "block" ? h = f.parseChildren(d.tokens || []) : h = f.parseInline(d.tokens || []);
      const p = { ...o, ...d.attributes };
      return f.createNode(e, p, h);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(d) {
        var f;
        const h = new RegExp(`^:::${c}`, "m"), p = (f = d.match(h)) == null ? void 0 : f.index;
        return p !== void 0 ? p : -1;
      },
      tokenize(d, f, h) {
        var p;
        const m = new RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*\\n`), g = d.match(m);
        if (!g)
          return;
        const [v, w = ""] = g, x = i(w);
        let b = 1;
        const k = v.length;
        let C = "";
        const S = /^:::([\w-]*)(\s.*)?/gm, T = d.slice(k);
        for (S.lastIndex = 0; ; ) {
          const E = S.exec(T);
          if (E === null)
            break;
          const M = E.index, R = E[1];
          if (!((p = E[2]) != null && p.endsWith(":::"))) {
            if (R)
              b += 1;
            else if (b -= 1, b === 0) {
              const _ = T.slice(0, M);
              C = _.trim();
              const q = d.slice(0, k + M + E[0].length);
              let N = [];
              if (C)
                if (l === "block")
                  for (N = h.blockTokens(_), N.forEach((B) => {
                    B.text && (!B.tokens || B.tokens.length === 0) && (B.tokens = h.inlineTokens(B.text));
                  }); N.length > 0; ) {
                    const B = N[N.length - 1];
                    if (B.type === "paragraph" && (!B.text || B.text.trim() === ""))
                      N.pop();
                    else
                      break;
                  }
                else
                  N = h.inlineTokens(C);
              return {
                type: e,
                raw: q,
                attributes: x,
                content: C,
                tokens: N
              };
            }
          }
        }
      }
    },
    renderMarkdown: (d, f) => {
      const h = u(d.attrs || {}), p = s(h), m = p ? ` {${p}}` : "", g = f.renderChildren(d.content || [], `

`);
      return `:::${c}${m}

${g}

:::`;
    }
  };
}
function GS(n) {
  if (!n.trim())
    return {};
  const e = {}, t = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;
  let r = t.exec(n);
  for (; r !== null; ) {
    const [, i, s, o] = r;
    e[i] = s || o, r = t.exec(n);
  }
  return e;
}
function ZS(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function QS(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = GS,
    serializeAttributes: s = ZS,
    defaultAttributes: o = {},
    selfClosing: l = !1,
    allowedAttributes: a
  } = n, c = t || e, u = (f) => {
    if (!a)
      return f;
    const h = {};
    return a.forEach((p) => {
      const m = typeof p == "string" ? p : p.name, g = typeof p == "string" ? void 0 : p.skipIfDefault;
      if (m in f) {
        const v = f[m];
        if (g !== void 0 && v === g)
          return;
        h[m] = v;
      }
    }), h;
  }, d = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    parseMarkdown: (f, h) => {
      const p = { ...o, ...f.attributes };
      if (l)
        return h.createNode(e, p);
      const m = r ? r(f) : f.content || "";
      return m ? h.createNode(e, p, [h.createTextNode(m)]) : h.createNode(e, p, []);
    },
    markdownTokenizer: {
      name: e,
      level: "inline",
      start(f) {
        const h = l ? new RegExp(`\\[${d}\\s*[^\\]]*\\]`) : new RegExp(`\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), p = f.match(h), m = p?.index;
        return m !== void 0 ? m : -1;
      },
      tokenize(f, h, p) {
        const m = l ? new RegExp(`^\\[${d}\\s*([^\\]]*)\\]`) : new RegExp(`^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`), g = f.match(m);
        if (!g)
          return;
        let v = "", w = "";
        if (l) {
          const [, b] = g;
          w = b;
        } else {
          const [, b, k] = g;
          w = b, v = k || "";
        }
        const x = i(w.trim());
        return {
          type: e,
          raw: g[0],
          content: v.trim(),
          attributes: x
        };
      }
    },
    renderMarkdown: (f) => {
      let h = "";
      r ? h = r(f) : f.content && f.content.length > 0 && (h = f.content.filter((v) => v.type === "text").map((v) => v.text).join(""));
      const p = u(f.attrs || {}), m = s(p), g = m ? ` ${m}` : "";
      return l ? `[${c}${g}]` : `[${c}${g}]${h}[/${c}]`;
    }
  };
}
function e1(n, e, t) {
  var r, i, s, o;
  const l = n.split(`
`), a = [];
  let c = "", u = 0;
  const d = e.baseIndentSize || 2;
  for (; u < l.length; ) {
    const f = l[u], h = f.match(e.itemPattern);
    if (!h) {
      if (a.length > 0)
        break;
      if (f.trim() === "") {
        u += 1, c = `${c}${f}
`;
        continue;
      } else
        return;
    }
    const p = e.extractItemData(h), { indentLevel: m, mainContent: g } = p;
    c = `${c}${f}
`;
    const v = [g];
    for (u += 1; u < l.length; ) {
      const k = l[u];
      if (k.trim() === "") {
        const S = l.slice(u + 1).findIndex((M) => M.trim() !== "");
        if (S === -1)
          break;
        if ((((i = (r = l[u + 1 + S].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          v.push(k), c = `${c}${k}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = k.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        v.push(k), c = `${c}${k}
`, u += 1;
      else
        break;
    }
    let w;
    const x = v.slice(1);
    if (x.length > 0) {
      const k = x.map((C) => C.slice(m + d)).join(`
`);
      k.trim() && (e.customNestedParser ? w = e.customNestedParser(k) : w = t.blockTokens(k));
    }
    const b = e.createToken(p, w);
    a.push(b);
  }
  if (a.length !== 0)
    return {
      items: a,
      raw: c
    };
}
function t1(n, e, t, r) {
  if (!n || !Array.isArray(n.content))
    return "";
  const i = typeof t == "function" ? t(r) : t, [s, ...o] = n.content, l = e.renderChildren([s]);
  let a = `${i}${l}`;
  return o && o.length > 0 && o.forEach((c, u) => {
    var d, f;
    const h = (f = (d = e.renderChild) == null ? void 0 : d.call(e, c, u + 1)) != null ? f : e.renderChildren([c]);
    if (h != null) {
      const p = h.split(`
`).map((m) => m ? e.indent(m) : e.indent("")).join(`
`);
      a += c.type === "paragraph" ? `

${p}` : `
${p}`;
    }
  }), a;
}
function n1(n, e, t = {}) {
  const { state: r } = e, { doc: i, tr: s } = r, o = n;
  i.descendants((l, a) => {
    const c = s.mapping.map(a), u = s.mapping.map(a) + l.nodeSize;
    let d = null;
    if (l.marks.forEach((h) => {
      if (h !== o)
        return !1;
      d = h;
    }), !d)
      return;
    let f = !1;
    if (Object.keys(t).forEach((h) => {
      t[h] !== d.attrs[h] && (f = !0);
    }), f) {
      const h = n.type.create({
        ...n.attrs,
        ...t
      });
      s.removeMark(c, u, n.type), s.addMark(c, u, h);
    }
  }), s.docChanged && e.view.dispatch(s);
}
var Jo = class af extends jo {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new af(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, r1 = class {
  constructor(n, e, t) {
    this.isDragging = !1, this.component = n, this.editor = e.editor, this.options = {
      stopEvent: null,
      ignoreMutation: null,
      ...t
    }, this.extension = e.extension, this.node = e.node, this.decorations = e.decorations, this.innerDecorations = e.innerDecorations, this.view = e.view, this.HTMLAttributes = e.HTMLAttributes, this.getPos = e.getPos, this.mount();
  }
  mount() {
  }
  get dom() {
    return this.editor.view.dom;
  }
  get contentDOM() {
    return null;
  }
  onDragStart(n) {
    var e, t, r, i, s, o, l;
    const { view: a } = this.editor, c = n.target, u = c.nodeType === 3 ? (e = c.parentElement) == null ? void 0 : e.closest("[data-drag-handle]") : c.closest("[data-drag-handle]");
    if (!this.dom || (t = this.contentDOM) != null && t.contains(c) || !u)
      return;
    let d = 0, f = 0;
    if (this.dom !== u) {
      const w = this.dom.getBoundingClientRect(), x = u.getBoundingClientRect(), b = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, k = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = x.x - w.x + b, f = x.y - w.y + k;
    }
    const h = this.dom.cloneNode(!0);
    try {
      const w = this.dom.getBoundingClientRect();
      h.style.width = `${Math.round(w.width)}px`, h.style.height = `${Math.round(w.height)}px`, h.style.boxSizing = "border-box", h.style.pointerEvents = "none";
    } catch {
    }
    let p = null;
    try {
      p = document.createElement("div"), p.style.position = "absolute", p.style.top = "-9999px", p.style.left = "-9999px", p.style.pointerEvents = "none", p.appendChild(h), document.body.appendChild(p), (l = n.dataTransfer) == null || l.setDragImage(h, d, f);
    } finally {
      p && setTimeout(() => {
        try {
          p?.remove();
        } catch {
        }
      }, 0);
    }
    const m = this.getPos();
    if (typeof m != "number")
      return;
    const g = H.create(a.state.doc, m), v = a.state.tr.setSelection(g);
    a.dispatch(v);
  }
  stopEvent(n) {
    var e;
    if (!this.dom)
      return !1;
    if (typeof this.options.stopEvent == "function")
      return this.options.stopEvent({ event: n });
    const t = n.target;
    if (!(this.dom.contains(t) && !((e = this.contentDOM) != null && e.contains(t))))
      return !1;
    const i = n.type.startsWith("drag"), s = n.type === "drop";
    if ((["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(t.tagName) || t.isContentEditable) && !s && !i)
      return !0;
    const { isEditable: l } = this.editor, { isDragging: a } = this, c = !!this.node.type.spec.draggable, u = H.isSelectable(this.node), d = n.type === "copy", f = n.type === "paste", h = n.type === "cut", p = n.type === "mousedown";
    if (!c && u && i && n.target === this.dom && n.preventDefault(), c && i && !a && n.target === this.dom)
      return n.preventDefault(), !1;
    if (c && l && !a && p) {
      const m = t.closest("[data-drag-handle]");
      m && (this.dom === m || this.dom.contains(m)) && (this.isDragging = !0, document.addEventListener(
        "dragend",
        () => {
          this.isDragging = !1;
        },
        { once: !0 }
      ), document.addEventListener(
        "drop",
        () => {
          this.isDragging = !1;
        },
        { once: !0 }
      ), document.addEventListener(
        "mouseup",
        () => {
          this.isDragging = !1;
        },
        { once: !0 }
      ));
    }
    return !(a || s || d || f || h || p && u);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(n) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (Sr() || eo()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
  }
  /**
   * Update the attributes of the prosemirror node.
   */
  updateAttributes(n) {
    this.editor.commands.command(({ tr: e }) => {
      const t = this.getPos();
      return typeof t != "number" ? !1 : (e.setNodeMarkup(t, void 0, {
        ...this.node.attrs,
        ...n
      }), !0);
    });
  }
  /**
   * Delete the node.
   */
  deleteNode() {
    const n = this.getPos();
    if (typeof n != "number")
      return;
    const e = n + this.node.nodeSize;
    this.editor.commands.deleteRange({ from: n, to: e });
  }
}, i1 = Jo.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
function s1(n = {}) {
  return new me({
    view(e) {
      return new o1(e, n);
    }
  });
}
class o1 {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((i) => {
      let s = (o) => {
        this[i](o);
      };
      return e.dom.addEventListener(i, s), { name: i, handler: s };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, r, i = this.editorView.dom, s = i.getBoundingClientRect(), o = s.width / i.offsetWidth, l = s.height / i.offsetHeight;
    if (t) {
      let d = e.nodeBefore, f = e.nodeAfter;
      if (d || f) {
        let h = this.editorView.nodeDOM(this.cursorPos - (d ? d.nodeSize : 0));
        if (h) {
          let p = h.getBoundingClientRect(), m = d ? p.bottom : p.top;
          d && f && (m = (m + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2);
          let g = this.width / 2 * l;
          r = { left: p.left, right: p.right, top: m - g, bottom: m + g };
        }
      }
    }
    if (!r) {
      let d = this.editorView.coordsAtPos(this.cursorPos), f = this.width / 2 * o;
      r = { left: d.left - f, right: d.left + f, top: d.top, bottom: d.bottom };
    }
    let a = this.editorView.dom.offsetParent;
    this.element || (this.element = a.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let c, u;
    if (!a || a == document.body && getComputedStyle(a).position == "static")
      c = -pageXOffset, u = -pageYOffset;
    else {
      let d = a.getBoundingClientRect(), f = d.width / a.offsetWidth, h = d.height / a.offsetHeight;
      c = d.left - a.scrollLeft * f, u = d.top - a.scrollTop * h;
    }
    this.element.style.left = (r.left - c) / o + "px", this.element.style.top = (r.top - u) / l + "px", this.element.style.width = (r.right - r.left) / o + "px", this.element.style.height = (r.bottom - r.top) / l + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), i = r && r.type.spec.disableDropCursor, s = typeof i == "function" ? i(this.editorView, t, e) : i;
    if (t && !s) {
      let o = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let l = Au(this.editorView.state.doc, o, this.editorView.dragging.slice);
        l != null && (o = l);
      }
      this.setCursor(o), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    this.editorView.dom.contains(e.relatedTarget) || this.setCursor(null);
  }
}
class ue extends Z {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return ue.valid(r) ? new ue(r) : Z.near(r);
  }
  content() {
    return L.empty;
  }
  eq(e) {
    return e instanceof ue && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new ue(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new Xo(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.inlineContent || !l1(e) || !a1(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = t.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e: for (; ; ) {
      if (!r && ue.valid(e))
        return e;
      let i = e.pos, s = null;
      for (let o = e.depth; ; o--) {
        let l = e.node(o);
        if (t > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
          s = l.child(t > 0 ? e.indexAfter(o) : e.index(o) - 1);
          break;
        } else if (o == 0)
          return null;
        i += t;
        let a = e.doc.resolve(i);
        if (ue.valid(a))
          return a;
      }
      for (; ; ) {
        let o = t > 0 ? s.firstChild : s.lastChild;
        if (!o) {
          if (s.isAtom && !s.isText && !H.isSelectable(s)) {
            e = e.doc.resolve(i + s.nodeSize * t), r = !1;
            continue e;
          }
          break;
        }
        s = o, i += t;
        let l = e.doc.resolve(i);
        if (ue.valid(l))
          return l;
      }
      return null;
    }
  }
}
ue.prototype.visible = !1;
ue.findFrom = ue.findGapCursorFrom;
Z.jsonID("gapcursor", ue);
class Xo {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Xo(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return ue.valid(t) ? new ue(t) : Z.near(t);
  }
}
function cf(n) {
  return n.isAtom || n.spec.isolating || n.spec.createGapCursor;
}
function l1(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || cf(i.type))
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function a1(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || cf(i.type))
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function c1() {
  return new me({
    props: {
      decorations: h1,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && ue.valid(t) ? new ue(t) : null;
      },
      handleClick: d1,
      handleKeyDown: u1,
      handleDOMEvents: { beforeinput: f1 }
    }
  });
}
const u1 = Dd({
  ArrowLeft: Wr("horiz", -1),
  ArrowRight: Wr("horiz", 1),
  ArrowUp: Wr("vert", -1),
  ArrowDown: Wr("vert", 1)
});
function Wr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, s) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof G) {
      if (!s.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = ue.findGapCursorFrom(l, e, a);
    return c ? (i && i(r.tr.setSelection(new ue(c))), !0) : !1;
  };
}
function d1(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!ue.valid(r))
    return !1;
  let i = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return i && i.inside > -1 && H.isSelectable(n.state.doc.nodeAt(i.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new ue(r))), !0);
}
function f1(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof ue))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = A.empty;
  for (let o = r.length - 1; o >= 0; o--)
    i = A.from(r[o].createAndFill(null, i));
  let s = n.state.tr.replace(t.pos, t.pos, new L(i, 0, 0));
  return s.setSelection(G.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
}
function h1(n) {
  if (!(n.selection instanceof ue))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", ae.create(n.doc, [Ie.widget(n.selection.head, e, { key: "gapcursor" })]);
}
var bi = 200, we = function() {
};
we.prototype.append = function(e) {
  return e.length ? (e = we.from(e), !this.length && e || e.length < bi && this.leafAppend(e) || this.length < bi && e.leafPrepend(this) || this.appendInner(e)) : this;
};
we.prototype.prepend = function(e) {
  return e.length ? we.from(e).append(this) : this;
};
we.prototype.appendInner = function(e) {
  return new p1(this, e);
};
we.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? we.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
we.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
we.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
we.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(s, o) {
    return i.push(e(s, o));
  }, t, r), i;
};
we.from = function(e) {
  return e instanceof we ? e : e && e.length ? new uf(e) : we.empty;
};
var uf = /* @__PURE__ */ (function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, s) {
    return i == 0 && s == this.length ? this : new e(this.values.slice(i, s));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, s, o, l) {
    for (var a = s; a < o; a++)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, s, o, l) {
    for (var a = s - 1; a >= o; a--)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= bi)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= bi)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
})(we);
we.empty = new uf([]);
var p1 = /* @__PURE__ */ (function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i < l && this.left.forEachInner(r, i, Math.min(s, l), o) === !1 || s > l && this.right.forEachInner(r, Math.max(i - l, 0), Math.min(this.length, s) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i > l && this.right.forEachInvertedInner(r, i - l, Math.max(s, l) - l, o + l) === !1 || s < l && this.left.forEachInvertedInner(r, Math.min(i, l), s, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var s = this.left.length;
    return i <= s ? this.left.slice(r, i) : r >= s ? this.right.slice(r - s, i - s) : this.left.slice(r, s).append(this.right.slice(0, i - s));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
})(we);
const m1 = 500;
class rt {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, s;
    t && (i = this.remapping(r, this.items.length), s = i.maps.length);
    let o = e.tr, l, a, c = [], u = [];
    return this.items.forEach((d, f) => {
      if (!d.step) {
        i || (i = this.remapping(r, f + 1), s = i.maps.length), s--, u.push(d);
        return;
      }
      if (i) {
        u.push(new at(d.map));
        let h = d.step.map(i.slice(s)), p;
        h && o.maybeStep(h).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new at(p, void 0, void 0, c.length + u.length))), s--, p && i.appendMap(p, s);
      } else
        o.maybeStep(d.step);
      if (d.selection)
        return l = i ? d.selection.map(i.slice(s)) : d.selection, a = new rt(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, i) {
    let s = [], o = this.eventCount, l = this.items, a = !i && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let d = e.steps[u].invert(e.docs[u]), f = new at(e.mapping.maps[u], d, t), h;
      (h = a && a.merge(f)) && (f = h, u ? s.pop() : l = l.slice(0, l.length - 1)), s.push(f), t && (o++, t = void 0), i || (a = f);
    }
    let c = o - r.depth;
    return c > y1 && (l = g1(l, c), o -= c), new rt(l.append(s), o);
  }
  remapping(e, t) {
    let r = new yr();
    return this.items.forEach((i, s) => {
      let o = i.mirrorOffset != null && s - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, o);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new rt(this.items.append(e.map((t) => new at(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), s = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((f) => {
      f.selection && l--;
    }, i);
    let a = t;
    this.items.forEach((f) => {
      let h = s.getMirror(--a);
      if (h == null)
        return;
      o = Math.min(o, h);
      let p = s.maps[h];
      if (f.step) {
        let m = e.steps[h].invert(e.docs[h]), g = f.selection && f.selection.map(s.slice(a + 1, h));
        g && l++, r.push(new at(p, m, g));
      } else
        r.push(new at(p));
    }, i);
    let c = [];
    for (let f = t; f < o; f++)
      c.push(new at(s.maps[f]));
    let u = this.items.slice(0, i).append(c).append(r), d = new rt(u, l);
    return d.emptyItemCount() > m1 && (d = d.compress(this.items.length - r.length)), d;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, i = [], s = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        i.push(o), o.selection && s++;
      else if (o.step) {
        let a = o.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let u = o.selection && o.selection.map(t.slice(r));
          u && s++;
          let d = new at(c.invert(), a, u), f, h = i.length - 1;
          (f = i.length && i[h].merge(d)) ? i[h] = f : i.push(d);
        }
      } else o.map && r--;
    }, this.items.length, 0), new rt(we.from(i.reverse()), s);
  }
}
rt.empty = new rt(we.empty, 0);
function g1(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class at {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new at(t.getMap().invert(), t, this.selection);
    }
  }
}
class It {
  constructor(e, t, r, i, s) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i, this.prevComposition = s;
  }
}
const y1 = 20;
function v1(n, e, t, r) {
  let i = t.getMeta(dn), s;
  if (i)
    return i.historyState;
  t.getMeta(x1) && (n = new It(n.done, n.undone, null, 0, -1));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(dn))
    return o.getMeta(dn).redo ? new It(n.done.addTransform(t, void 0, r, Zr(e)), n.undone, Wa(t.mapping.maps), n.prevTime, n.prevComposition) : new It(n.done, n.undone.addTransform(t, void 0, r, Zr(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), a = n.prevTime == 0 || !o && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !b1(t, n.prevRanges)), c = o ? ks(n.prevRanges, t.mapping) : Wa(t.mapping.maps);
    return new It(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, Zr(e)), rt.empty, c, t.time, l ?? n.prevComposition);
  } else return (s = t.getMeta("rebased")) ? new It(n.done.rebased(t, s), n.undone.rebased(t, s), ks(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new It(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), ks(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function b1(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let s = 0; s < e.length; s += 2)
      r <= e[s + 1] && i >= e[s] && (t = !0);
  }), t;
}
function Wa(n) {
  let e = [];
  for (let t = n.length - 1; t >= 0 && e.length == 0; t--)
    n[t].forEach((r, i, s, o) => e.push(s, o));
  return e;
}
function ks(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), s = e.map(n[r + 1], -1);
    i <= s && t.push(i, s);
  }
  return t;
}
function w1(n, e, t) {
  let r = Zr(e), i = dn.get(e).spec.config, s = (t ? n.undone : n.done).popEvent(e, r);
  if (!s)
    return null;
  let o = s.selection.resolve(s.transform.doc), l = (t ? n.done : n.undone).addTransform(s.transform, e.selection.getBookmark(), i, r), a = new It(t ? l : s.remaining, t ? s.remaining : l, null, 0, -1);
  return s.transform.setSelection(o).setMeta(dn, { redo: t, historyState: a });
}
let Cs = !1, Ha = null;
function Zr(n) {
  let e = n.plugins;
  if (Ha != e) {
    Cs = !1, Ha = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Cs = !0;
        break;
      }
  }
  return Cs;
}
const dn = new Pe("history"), x1 = new Pe("closeHistory");
function S1(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new me({
    key: dn,
    state: {
      init() {
        return new It(rt.empty, rt.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return v1(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? ff : r == "historyRedo" ? hf : null;
          return !i || !e.editable ? !1 : (t.preventDefault(), i(e.state, e.dispatch));
        }
      }
    }
  });
}
function df(n, e) {
  return (t, r) => {
    let i = dn.getState(t);
    if (!i || (n ? i.undone : i.done).eventCount == 0)
      return !1;
    if (r) {
      let s = w1(i, t, n);
      s && r(e ? s.scrollIntoView() : s);
    }
    return !0;
  };
}
const ff = df(!1, !0), hf = df(!0, !0);
ye.create({
  name: "characterCount",
  addOptions() {
    return {
      limit: null,
      mode: "textSize",
      textCounter: (n) => n.length,
      wordCounter: (n) => n.split(" ").filter((e) => e !== "").length
    };
  },
  addStorage() {
    return {
      characters: () => 0,
      words: () => 0
    };
  },
  onBeforeCreate() {
    this.storage.characters = (n) => {
      const e = n?.node || this.editor.state.doc;
      if ((n?.mode || this.options.mode) === "textSize") {
        const r = e.textBetween(0, e.content.size, void 0, " ");
        return this.options.textCounter(r);
      }
      return e.nodeSize;
    }, this.storage.words = (n) => {
      const e = n?.node || this.editor.state.doc, t = e.textBetween(0, e.content.size, " ", " ");
      return this.options.wordCounter(t);
    };
  },
  addProseMirrorPlugins() {
    let n = !1;
    return [
      new me({
        key: new Pe("characterCount"),
        appendTransaction: (e, t, r) => {
          if (n)
            return;
          const i = this.options.limit;
          if (i == null || i === 0) {
            n = !0;
            return;
          }
          const s = this.storage.characters({ node: r.doc });
          if (s > i) {
            const o = s - i, l = 0, a = o;
            console.warn(
              `[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`
            );
            const c = r.tr.deleteRange(l, a);
            return n = !0, c;
          }
          n = !0;
        },
        filterTransaction: (e, t) => {
          const r = this.options.limit;
          if (!e.docChanged || r === 0 || r === null || r === void 0)
            return !0;
          const i = this.storage.characters({ node: t.doc }), s = this.storage.characters({ node: e.doc });
          if (s <= r || i > r && s > r && s <= i)
            return !0;
          if (i > r && s > r && s > i || !e.getMeta("paste"))
            return !1;
          const l = e.selection.$head.pos, a = s - r, c = l - a, u = l;
          return e.deleteRange(c, u), !(this.storage.characters({ node: e.doc }) > r);
        }
      })
    ];
  }
});
ye.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [s1(this.options)];
  }
});
ye.create({
  name: "focus",
  addOptions() {
    return {
      className: "has-focus",
      mode: "all"
    };
  },
  addProseMirrorPlugins() {
    return [
      new me({
        key: new Pe("focus"),
        props: {
          decorations: ({ doc: n, selection: e }) => {
            const { isEditable: t, isFocused: r } = this.editor, { anchor: i } = e, s = [];
            if (!t || !r)
              return ae.create(n, []);
            let o = 0;
            this.options.mode === "deepest" && n.descendants((a, c) => {
              if (a.isText)
                return;
              if (!(i >= c && i <= c + a.nodeSize - 1))
                return !1;
              o += 1;
            });
            let l = 0;
            return n.descendants((a, c) => {
              if (a.isText || !(i >= c && i <= c + a.nodeSize - 1))
                return !1;
              if (l += 1, this.options.mode === "deepest" && o - l > 0 || this.options.mode === "shallowest" && l > 1)
                return this.options.mode === "deepest";
              s.push(
                Ie.node(c, c + a.nodeSize, {
                  class: this.options.className
                })
              );
            }), ae.create(n, s);
          }
        }
      })
    ];
  }
});
ye.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [c1()];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = le(W(n, "allowGapCursor", t))) != null ? e : null
    };
  }
});
var ja = "placeholder";
function k1(n) {
  return n.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/^[0-9-]+/, "").replace(/^-+/, "").toLowerCase();
}
ye.create({
  name: "placeholder",
  addOptions() {
    return {
      emptyEditorClass: "is-editor-empty",
      emptyNodeClass: "is-empty",
      dataAttribute: ja,
      placeholder: "Write something …",
      showOnlyWhenEditable: !0,
      showOnlyCurrent: !0,
      includeChildren: !1
    };
  },
  addProseMirrorPlugins() {
    const n = this.options.dataAttribute ? `data-${k1(this.options.dataAttribute)}` : `data-${ja}`;
    return [
      new me({
        key: new Pe("placeholder"),
        props: {
          decorations: ({ doc: e, selection: t }) => {
            const r = this.editor.isEditable || !this.options.showOnlyWhenEditable, { anchor: i } = t, s = [];
            if (!r)
              return null;
            const o = this.editor.isEmpty;
            return e.descendants((l, a) => {
              const c = i >= a && i <= a + l.nodeSize, u = !l.isLeaf && Vi(l);
              if (!l.type.isTextblock)
                return this.options.includeChildren;
              if ((c || !this.options.showOnlyCurrent) && u) {
                const d = [this.options.emptyNodeClass];
                o && d.push(this.options.emptyEditorClass);
                const f = Ie.node(a, a + l.nodeSize, {
                  class: d.join(" "),
                  [n]: typeof this.options.placeholder == "function" ? this.options.placeholder({
                    editor: this.editor,
                    node: l,
                    pos: a,
                    hasAnchor: c
                  }) : this.options.placeholder
                });
                s.push(f);
              }
              return this.options.includeChildren;
            }), ae.create(e, s);
          }
        }
      })
    ];
  }
});
ye.create({
  name: "selection",
  addOptions() {
    return {
      className: "selection"
    };
  },
  addProseMirrorPlugins() {
    const { editor: n, options: e } = this;
    return [
      new me({
        key: new Pe("selection"),
        props: {
          decorations(t) {
            return t.selection.empty || n.isFocused || !n.isEditable || cS(t.selection) || n.view.dragging ? null : ae.create(t.doc, [
              Ie.inline(t.selection.from, t.selection.to, {
                class: e.className
              })
            ]);
          }
        }
      })
    ];
  }
});
var C1 = "skipTrailingNode";
function Ua({ types: n, node: e }) {
  return e && Array.isArray(n) && n.includes(e.type) || e?.type === n;
}
ye.create({
  name: "trailingNode",
  addOptions() {
    return {
      node: void 0,
      notAfter: []
    };
  },
  addProseMirrorPlugins() {
    var n;
    const e = new Pe(this.name), t = this.options.node || ((n = this.editor.schema.topNodeType.contentMatch.defaultType) == null ? void 0 : n.name) || "paragraph", r = Object.entries(this.editor.schema.nodes).map(([, i]) => i).filter((i) => (this.options.notAfter || []).concat(t).includes(i.name));
    return [
      new me({
        key: e,
        appendTransaction: (i, s, o) => {
          const { doc: l, tr: a, schema: c } = o, u = e.getState(o), d = l.content.size, f = c.nodes[t];
          if (!i.some((h) => h.getMeta(C1)) && u)
            return a.insert(d, f.create());
        },
        state: {
          init: (i, s) => {
            const o = s.tr.doc.lastChild;
            return !Ua({ node: o, types: r });
          },
          apply: (i, s) => {
            if (!i.docChanged || i.getMeta("__uniqueIDTransaction"))
              return s;
            const o = i.doc.lastChild;
            return !Ua({ node: o, types: r });
          }
        }
      })
    ];
  }
});
var E1 = ye.create({
  name: "undoRedo",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => ff(n, e),
      redo: () => ({ state: n, dispatch: e }) => hf(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [S1(this.options)];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-y": () => this.editor.commands.redo(),
      // Russian keyboard layouts
      "Mod-я": () => this.editor.commands.undo(),
      "Shift-Mod-я": () => this.editor.commands.redo()
    };
  }
});
const T1 = Jo.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
});
$({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = P(), t = Ut();
    return Ue(() => {
      const r = n.editor;
      r && r.options.element && e.value && ge(() => {
        var i;
        if (!e.value || !((i = r.view.dom) != null && i.parentNode))
          return;
        const s = y(e.value);
        e.value.append(...r.view.dom.parentNode.childNodes), r.contentComponent = t.ctx._, t && (r.appContext = {
          ...t.appContext,
          // Vue internally uses prototype chain to forward/shadow injects across the entire component chain
          // so don't use object spread operator or 'Object.assign' and just set `provides` as is on editor's appContext
          // @ts-expect-error forward instance's 'provides' into appContext
          provides: t.provides
        }), r.setOptions({
          element: s
        }), r.createNodeViews();
      });
    }), Hn(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return ze("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
});
var M1 = $({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return ze(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), O1 = $({
  name: "NodeViewWrapper",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  inject: ["onDragStart", "decorationClasses"],
  render() {
    var n, e;
    return ze(
      this.as,
      {
        // @ts-ignore
        class: this.decorationClasses,
        style: {
          whiteSpace: "normal"
        },
        "data-node-view-wrapper": "",
        // @ts-ignore (https://github.com/vuejs/vue-next/issues/3031)
        onDragstart: this.onDragStart
      },
      (e = (n = this.$slots).default) == null ? void 0 : e.call(n)
    );
  }
}), A1 = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = Qa(n), this.el = document.createElement("div"), this.props = so(e), this.renderedComponent = this.renderComponent();
  }
  get element() {
    return this.renderedComponent.el;
  }
  get ref() {
    var n, e, t, r;
    return (e = (n = this.renderedComponent.vNode) == null ? void 0 : n.component) != null && e.exposed ? this.renderedComponent.vNode.component.exposed : (r = (t = this.renderedComponent.vNode) == null ? void 0 : t.component) == null ? void 0 : r.proxy;
  }
  renderComponent() {
    if (this.destroyed)
      return this.renderedComponent;
    let n = ze(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && Go(n, this.el), { vNode: n, destroy: () => {
      this.el && Go(null, this.el), this.el = null, n = null;
    }, el: this.el ? this.el.firstElementChild : null };
  }
  updateProps(n = {}) {
    this.destroyed || (Object.entries(n).forEach(([e, t]) => {
      this.props[e] = t;
    }), this.renderComponent());
  }
  destroy() {
    this.destroyed || (this.destroyed = !0, this.renderedComponent.destroy());
  }
};
$({
  name: "MarkViewContent",
  props: {
    as: {
      type: String,
      default: "span"
    }
  },
  render() {
    return ze(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var D1 = class extends r1 {
  constructor() {
    super(...arguments), this.cachedExtensionWithSyncedStorage = null;
  }
  /**
   * Returns a proxy of the extension that redirects storage access to the editor's mutable storage.
   * This preserves the original prototype chain (instanceof checks, methods like configure/extend work).
   * Cached to avoid proxy creation on every update.
   */
  get extensionWithSyncedStorage() {
    if (!this.cachedExtensionWithSyncedStorage) {
      const n = this.editor, e = this.extension;
      this.cachedExtensionWithSyncedStorage = new Proxy(e, {
        get(t, r, i) {
          var s;
          return r === "storage" ? (s = n.storage[e.name]) != null ? s : {} : Reflect.get(t, r, i);
        }
      });
    }
    return this.cachedExtensionWithSyncedStorage;
  }
  mount() {
    const n = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      view: this.view,
      selected: !1,
      extension: this.extensionWithSyncedStorage,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (r = {}) => this.updateAttributes(r),
      deleteNode: () => this.deleteNode()
    }, e = this.onDragStart.bind(this);
    this.decorationClasses = P(this.getDecorationClasses());
    const t = $({
      extends: { ...this.component },
      props: Object.keys(n),
      template: this.component.template,
      setup: (r) => {
        var i, s;
        return Ln("onDragStart", e), Ln("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
          expose: () => {
          }
        });
      },
      // add support for scoped styles
      // @ts-ignore
      // eslint-disable-next-line
      __scopeId: this.component.__scopeId,
      // add support for CSS Modules
      // @ts-ignore
      // eslint-disable-next-line
      __cssModules: this.component.__cssModules,
      // add support for vue devtools
      // @ts-ignore
      // eslint-disable-next-line
      __name: this.component.__name,
      // @ts-ignore
      // eslint-disable-next-line
      __file: this.component.__file
    });
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new A1(t, {
      editor: this.editor,
      props: n
    });
  }
  /**
   * Return the DOM element.
   * This is the element that will be used to display the node view.
   */
  get dom() {
    if (!this.renderer.element || !this.renderer.element.hasAttribute("data-node-view-wrapper"))
      throw Error("Please use the NodeViewWrapper component for your node view.");
    return this.renderer.element;
  }
  /**
   * Return the content DOM element.
   * This is the element that will be used to display the rich-text content of the node.
   */
  get contentDOM() {
    return this.node.isLeaf ? null : this.dom.querySelector("[data-node-view-content]");
  }
  /**
   * On editor selection update, check if the node is selected.
   * If it is, call `selectNode`, otherwise call `deselectNode`.
   */
  handleSelectionUpdate() {
    const { from: n, to: e } = this.editor.state.selection, t = this.getPos();
    if (typeof t == "number")
      if (n <= t && e >= t + this.node.nodeSize) {
        if (this.renderer.props.selected)
          return;
        this.selectNode();
      } else {
        if (!this.renderer.props.selected)
          return;
        this.deselectNode();
      }
  }
  /**
   * On update, update the React component.
   * To prevent unnecessary updates, the `update` option can be used.
   */
  update(n, e, t) {
    const r = (i) => {
      this.decorationClasses.value = this.getDecorationClasses(), this.renderer.updateProps(i);
    };
    if (typeof this.options.update == "function") {
      const i = this.node, s = this.decorations, o = this.innerDecorations;
      return this.node = n, this.decorations = e, this.innerDecorations = t, this.options.update({
        oldNode: i,
        oldDecorations: s,
        newNode: n,
        newDecorations: e,
        oldInnerDecorations: o,
        innerDecorations: t,
        updateProps: () => r({ node: n, decorations: e, innerDecorations: t, extension: this.extensionWithSyncedStorage })
      });
    }
    return n.type !== this.node.type ? !1 : (n === this.node && this.decorations === e && this.innerDecorations === t || (this.node = n, this.decorations = e, this.innerDecorations = t, r({ node: n, decorations: e, innerDecorations: t, extension: this.extensionWithSyncedStorage })), !0);
  }
  /**
   * Select the node.
   * Add the `selected` prop and the `ProseMirror-selectednode` class.
   */
  selectNode() {
    this.renderer.updateProps({
      selected: !0
    }), this.renderer.element && this.renderer.element.classList.add("ProseMirror-selectednode");
  }
  /**
   * Deselect the node.
   * Remove the `selected` prop and the `ProseMirror-selectednode` class.
   */
  deselectNode() {
    this.renderer.updateProps({
      selected: !1
    }), this.renderer.element && this.renderer.element.classList.remove("ProseMirror-selectednode");
  }
  getDecorationClasses() {
    return this.decorations.flatMap((n) => n.type.attrs.class).join(" ");
  }
  destroy() {
    this.renderer.destroy(), this.editor.off("selectionUpdate", this.handleSelectionUpdate);
  }
};
function P1(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new D1(r, t, e);
  };
}
const N1 = /* @__PURE__ */ $({
  __name: "TurnNodeView",
  props: {
    decorations: {},
    selected: { type: Boolean },
    updateAttributes: { type: Function },
    deleteNode: { type: Function },
    node: {},
    view: {},
    getPos: {},
    innerDecorations: {},
    editor: {},
    extension: {},
    HTMLAttributes: {}
  },
  setup(n) {
    const e = n, t = Kt(), r = D(() => {
      const o = e.node.attrs.speakerId;
      return o ? t.speakers.all.get(o) : void 0;
    }), i = D(() => r.value?.color ?? "transparent"), s = D(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: o, endTime: l } = e.node.attrs;
      if (o == null || l == null) return !1;
      const a = t.audio.currentTime.value;
      return a >= o && a <= l;
    });
    return (o, l) => (O(), F(y(O1), {
      as: "section",
      class: cr(["turn", { "turn--active": s.value }]),
      style: vn({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: I(() => [
        z(cc, {
          speaker: r.value,
          "start-time": n.node.attrs.startTime,
          language: n.node.attrs.language
        }, null, 8, ["speaker", "start-time", "language"]),
        z(y(M1), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), I1 = /* @__PURE__ */ Me(N1, [["__scopeId", "data-v-2f484deb"]]), R1 = Jo.create({
  name: "turn",
  group: "block",
  content: "inline*",
  addAttributes() {
    return {
      id: { default: null },
      speakerId: { default: null },
      startTime: { default: void 0 },
      endTime: { default: void 0 },
      language: { default: "" }
    };
  },
  parseHTML() {
    return [{ tag: 'section[data-type="turn"]' }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return [
      "section",
      Vd(n, { "data-type": "turn" }),
      0
    ];
  },
  addNodeView() {
    return P1(I1);
  }
});
function _1(n) {
  const e = [];
  return n.forEach((t) => {
    if (t.type.name !== "turn") return;
    const r = t.textContent;
    e.push({
      id: t.attrs.id,
      speakerId: t.attrs.speakerId ?? null,
      text: r || null,
      words: [],
      startTime: t.attrs.startTime,
      endTime: t.attrs.endTime,
      language: t.attrs.language ?? ""
    });
  }), e;
}
const B1 = new Pe("storeSync");
let ro = !1;
function L1(n) {
  ro = !0;
  try {
    n();
  } finally {
    ro = !1;
  }
}
const $1 = ye.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new me({
        key: B1,
        appendTransaction(t, r, i) {
          if (ro || r.doc.eq(i.doc)) return null;
          const s = e();
          return s && z1(i.doc, s, n), null;
        }
      })
    ];
  }
});
function z1(n, e, t) {
  const r = _1(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((f) => f.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), l = e.id, a = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    a.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: l });
  for (const c of o) {
    const u = s.get(c.id);
    u ? F1(u, c) && t.emit("turn:update", { turn: c, translationId: l }) : t.emit("turn:add", { turn: c, translationId: l });
  }
  e.turns.value = o;
}
function F1(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
function pf(n) {
  return {
    type: "doc",
    content: n.map((e) => V1(e))
  };
}
function V1(n) {
  const e = n.words.length > 0 ? n.words.map((t) => t.text).join(" ") : n.text ?? "";
  return {
    type: "turn",
    attrs: {
      id: n.id,
      speakerId: n.speakerId,
      startTime: n.startTime,
      endTime: n.endTime,
      language: n.language
    },
    content: e ? [{ type: "text", text: e }] : void 0
  };
}
function Q1() {
  return {
    name: "transcriptionEditor",
    install(n) {
      const e = D(
        () => n.activeChannel.value.activeTranslation.value
      ), t = pf(e.value.turns.value), r = n.pluginExtensions.some(
        (d) => d.name === "collaboration" || d.name === "history"
      ), i = [
        T1,
        R1,
        i1,
        ...r ? [] : [E1],
        $1.configure({
          store: n,
          getTranslation: () => e.value
        })
      ], s = fn(
        new KS({
          content: t,
          extensions: [...i, ...n.pluginExtensions]
        })
      );
      let o = e.value.id;
      const l = se(
        () => e.value.id,
        (d) => {
          d !== o && (o = d, q1(s.value, e.value.turns.value));
        }
      ), a = n.on("translation:sync", () => {
        console.warn("[transcriptionEditor plugin] translation:sync is not supported while the transcriptionEditor plugin is active");
      }), c = n.on("channel:sync", () => {
        console.warn("[transcriptionEditor plugin] channel:sync is not supported while the transcriptionEditor plugin is active");
      }), u = { editor: s };
      return n.transcriptionEditor = u, () => {
        l(), a(), c(), s.value?.destroy(), n.transcriptionEditor = void 0;
      };
    }
  };
}
function q1(n, e) {
  if (!n) return;
  const t = pf(e);
  L1(() => {
    n.commands.setContent(t);
  });
}
function Ka(n) {
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
function Es(n, e) {
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
function ek() {
  return {
    name: "live",
    install(n) {
      const e = fn(null), t = P(!1);
      t.value = !0;
      function r() {
        e.value = null, Zo(e);
      }
      function i(x, b) {
        if (n.activeChannelId.value !== b) return;
        const k = n.activeChannel.value.activeTranslation.value;
        if (k.isSource) {
          if (x.text == null) return;
          e.value = x.text;
        } else if (x.translations) {
          const C = x.translations.find(
            (S) => S.translationId === k.id
          );
          e.value = C?.text ?? null;
        } else
          return;
        Zo(e);
      }
      let s = null;
      function o() {
        s === null && (s = setTimeout(() => {
          s = null, r();
        }, 150));
      }
      function l() {
        s !== null && (clearTimeout(s), s = null);
      }
      function a(x, b) {
        x.turns.value.some((C) => C.id === b.id) ? x.updateTurn(b.id, b) : x.addTurn(b);
      }
      function c(x, b) {
        x.speakerId && n.speakers.ensure(x.speakerId);
        const k = n.channels.get(b);
        if (!k) {
          f();
          return;
        }
        if (x.text != null && a(
          k.sourceTranslation,
          Ka(x)
        ), x.translations)
          for (const C of x.translations) {
            const S = k.translations.get(C.translationId);
            S && a(
              S,
              Es(x, C)
            );
          }
        f();
      }
      function u(x, b) {
        d([x], b);
      }
      function d(x, b) {
        const k = n.channels.get(b);
        if (!k) return;
        const C = /* @__PURE__ */ new Set();
        for (const E of x)
          E.speakerId && !C.has(E.speakerId) && (C.add(E.speakerId), n.speakers.ensure(E.speakerId));
        const S = [];
        for (const E of x)
          E.text != null && S.push(Ka(E));
        S.length > 0 && k.sourceTranslation.prependTurns(S);
        const T = /* @__PURE__ */ new Map();
        for (const E of x)
          if (E.translations)
            for (const M of E.translations) {
              let R = T.get(M.translationId);
              R || (R = [], T.set(M.translationId, R)), R.push(Es(E, M));
            }
        for (const [E, M] of T) {
          const R = k.translations.get(E);
          R && R.prependTurns(M);
        }
      }
      function f() {
        l(), r();
      }
      function h(x) {
        const b = n.activeChannel.value.activeTranslation.value, k = n.activeChannel.value;
        if (!x.final && b.languages.includes(x.language))
          e.value = x.text;
        else if (x.final) {
          const C = k.translations.get(x.language);
          C && a(
            C,
            Es({ ...x }, x)
          );
        }
      }
      const p = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: i,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: h
      }, m = n.on(
        "channel:change",
        f
      ), g = n.on(
        "translation:change",
        f
      ), v = n.on(
        "translation:sync",
        o
      ), w = n.on("channel:sync", o);
      return n.live = p, () => {
        f(), m(), g(), v(), w(), n.live = void 0;
      };
    }
  };
}
function tk(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = P(n.fontSize ?? 40), r = P(!0), i = P(!1), s = {
        fontSize: t,
        isVisible: r,
        isFullscreen: i,
        enterFullscreen() {
          i.value = !0;
        },
        exitFullscreen() {
          i.value = !1;
        }
      };
      return e.subtitle = s, () => {
        r.value = !1, i.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function W1(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function nk(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(W1), o = s[0]?.startTime ?? i.stime, l = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
    return {
      id: i.turn_id,
      speakerId: i.speaker_id || null,
      text: s.length > 0 ? null : i.segment,
      words: s,
      ...o !== void 0 && { startTime: o },
      ...l !== void 0 && { endTime: l },
      language: i.language
    };
  }), r = n.metadata.transcription.lang ?? n.text[0]?.language ?? "fr";
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
            languages: [r],
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
let mf = 0;
function H1(n) {
  return {
    id: `w_${mf++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function rk(n) {
  mf = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const l = s.words.map(H1);
    return {
      id: `turn_${o}`,
      speakerId: s.speaker ?? null,
      text: l.length > 0 ? null : s.text,
      words: l,
      startTime: s.start,
      endTime: s.end,
      language: t
    };
  }), i = n.segments.length > 0 ? n.segments[n.segments.length - 1].end : 0;
  return {
    title: "",
    speakers: e,
    channels: [
      {
        id: "default",
        name: "Canal 1",
        duration: i,
        translations: [
          {
            id: "source",
            languages: [t],
            isSource: !0,
            turns: r
          }
        ]
      }
    ]
  };
}
export {
  $e as DocumentValidationError,
  G1 as Layout,
  Z1 as createAudioPlugin,
  U1 as createCore,
  ek as createLivePlugin,
  tk as createSubtitlePlugin,
  Q1 as createTranscriptionEditorPlugin,
  nk as mapApiDocument,
  rk as mapWhisperXDocument,
  K1 as provideCore,
  J1 as provideI18n,
  Kt as useCore,
  jf as validateEditorDocument
};
