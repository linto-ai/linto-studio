import * as sa from "vue";
import { shallowReactive as nl, ref as P, computed as A, inject as Zi, provide as jn, h as Ve, defineComponent as L, openBlock as O, createElementBlock as K, renderSlot as G, useSlots as op, normalizeClass as Cr, createCommentVNode as ee, createElementVNode as J, toDisplayString as ne, createVNode as F, withCtx as N, createTextVNode as He, createBlock as z, unref as v, watchEffect as je, onBeforeUnmount as kn, normalizeStyle as Cn, Fragment as tt, renderList as Tn, createStaticVNode as lp, watch as re, onMounted as ve, markRaw as rl, reactive as il, render as oa, getCurrentInstance as Gt, nextTick as ye, customRef as hu, useTemplateRef as Tr, Transition as ap, useId as cp, toValue as Ie, getCurrentScope as pu, onScopeDispose as mu, effectScope as gu, shallowRef as gn, readonly as up, toHandlerKey as dp, camelize as yu, toRef as hi, onUnmounted as Ur, toRefs as tr, Comment as fp, mergeProps as ce, cloneVNode as hp, Teleport as vu, normalizeProps as sl, guardReactiveProps as ol, watchPostEffect as bu, shallowReadonly as Pn, mergeDefaults as pp, withKeys as po, withModifiers as un, withMemo as mp, resolveDynamicComponent as gp, useModel as yp, withDirectives as vp, vShow as bp, triggerRef as la } from "vue";
import * as W from "yjs";
import { UndoManager as wp, Item as xp, ContentType as Sp, Text as kp, XmlElement as Cp, Doc as Tp } from "yjs";
function Ep() {
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
const aa = [
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
function Mp(n, e, t) {
  const r = aa[n.size % aa.length];
  return { id: e, name: t, color: r };
}
function Op(n, e, t) {
  return !e || n.has(e) ? null : Mp(n, e, t ?? e);
}
function Ap(n, e, t) {
  const r = n.get(e);
  return r ? { ...r, ...t } : null;
}
function Dp(n) {
  const e = nl(/* @__PURE__ */ new Map());
  function t(s, o) {
    const l = Op(e, s, o);
    l && (e.set(l.id, l), n("speaker:add", { speaker: l }));
  }
  function r(s, o) {
    const l = Ap(e, s, o);
    l && (e.set(s, l), n("speaker:update", { speaker: l }));
  }
  function i() {
    e.clear();
  }
  return { all: e, ensure: t, update: r, clear: i };
}
function Pp(n, e) {
  return [...n, e];
}
function _p(n, e) {
  return [...e, ...n];
}
function Np(n, e, t) {
  const r = n.findIndex((s) => s.id === e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e };
  return {
    turns: n.map((s, o) => o === r ? i : s),
    updated: i
  };
}
function Ip(n, e) {
  const t = n.findIndex((r) => r.id === e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function Rp(n, e, t) {
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
function mo(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function $p(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, l = P(n.turns);
  function a(p) {
    t(p.speakerId), l.value = Pp(l.value, p), e("turn:add", { turn: p, translationId: r });
  }
  function c(p, m) {
    const g = Np(l.value, p, m);
    g && (l.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function u(p) {
    const m = Ip(l.value, p);
    m && (l.value = m, e("turn:remove", { turnId: p, translationId: r }));
  }
  function d(p, m) {
    const g = Rp(l.value, p, m);
    g && (l.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function f(p) {
    mo(p, t), l.value = _p(l.value, p);
  }
  function h(p) {
    mo(p, t), l.value = p, e("translation:sync", { translationId: r });
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: l, addTurn: a, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: h };
}
function ca(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, l = nl(/* @__PURE__ */ new Map());
  let a;
  for (const m of n.translations) {
    const g = $p(m, e, t);
    l.set(m.id, g), m.isSource && !a && (a = g);
  }
  a || (a = l.values().next().value);
  const c = P(null), u = P(!1), d = P(!0), f = A(() => c.value ? l.get(c.value) ?? a : a);
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
function Bp(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Lp(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function ll(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function wu(n, e, t, r = "*") {
  return n.map((i) => ({
    value: i.id,
    label: i.languages.map((s) => ll(s, e, r)).join(", ") + (i.isSource ? ` (${t})` : "")
  }));
}
function Fp(n, e = 250) {
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
function Ti(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
class Fe extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function zp(n) {
  if (n == null || typeof n != "object")
    throw new Fe("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new Fe("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Fe("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Fe("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new Fe(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Fe(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Fe(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Fe(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Fe(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], l = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Fe(l, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Fe(`${l}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Fe(`${l}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Fe(`${l}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Fe(`${l}.turns`, "must be an array");
    }
  }
}
function Vp(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let l = 0; l < t; l += o * 2) {
    const a = Math.floor(l * s), c = Math.abs(i[a] ?? 0);
    let u = l, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function Ei(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function go(n, e) {
  if (!Ei(n)) return null;
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
function XE(n = {}) {
  const e = P(""), t = P(n.activeChannelId ?? ""), r = P(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: l } = Ep(), a = Dp(o), c = a, u = nl(/* @__PURE__ */ new Map()), d = A(
    () => u.get(t.value) ?? [...u.values()][0]
  );
  function f(C, x) {
    return i(C, (E) => {
      const T = d.value;
      T && E.translationId === T.activeTranslation.value.id && x(E);
    });
  }
  function h(C) {
    e.value = C.title, a.clear(), u.clear();
    for (const x of Bp(C))
      c.ensure(x.id, x.name);
    for (const x of C.channels)
      u.set(x.id, ca(x, o, c.ensure));
    u.size > 0 && !u.has(t.value) && (t.value = u.keys().next().value);
  }
  function p(C) {
    zp(C), h(C);
  }
  function m(C) {
    C !== t.value && (t.value = C, o("channel:change", { channelId: C }));
  }
  function g(C, x) {
    if (u.has(C)) {
      for (const E of x.translations)
        mo(E.turns, c.ensure);
      u.set(C, ca(x, o, c.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const y = [], w = [];
  function S(C) {
    C.tiptapExtensions && w.push(...C.tiptapExtensions);
    const x = C.install(k);
    x && y.push(x);
  }
  function b() {
    o("destroy", void 0), y.forEach((C) => C()), y.length = 0, l();
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
    use: S,
    destroy: b
  };
  return k;
}
const xu = /* @__PURE__ */ Symbol("core");
function YE(n) {
  jn(xu, n);
}
function Nt() {
  const n = Zi(xu);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const qp = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const ua = (n) => n === "";
const Wp = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const da = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Hp = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const jp = (n) => {
  const e = Hp(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var or = {
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
const Up = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = or.width,
  color: l = or.stroke,
  ...a
}, { slots: c }) => Ve(
  "svg",
  {
    ...or,
    ...a,
    width: o,
    height: o,
    stroke: l,
    "stroke-width": ua(t) || ua(r) || t === !0 || r === !0 ? Number(i || s || or["stroke-width"]) * 24 / Number(o) : i || s || or["stroke-width"],
    class: Wp(
      "lucide",
      a.class,
      ...n ? [`lucide-${da(jp(n))}-icon`, `lucide-${da(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !qp(a) && { "aria-hidden": "true" }
  },
  [...e.map((u) => Ve(...u)), ...c.default ? [c.default()] : []]
);
const Ge = (n, e) => (t, { slots: r, attrs: i }) => Ve(
  Up,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const Kp = Ge("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Su = Ge("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Jp = Ge("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const fa = Ge("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Xp = Ge("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Yp = Ge("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Gp = Ge("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Zp = Ge("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Qp = Ge("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const em = Ge("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const tm = Ge("volume-2", [
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
const nm = Ge("volume-x", [
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
const ku = Ge("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), rm = ["aria-label"], im = /* @__PURE__ */ L({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (O(), K("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      G(e.$slots, "default", {}, void 0, !0)
    ], 8, rm));
  }
}), Oe = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, yo = /* @__PURE__ */ Oe(im, [["__scopeId", "data-v-732d4c24"]]), sm = ["disabled", "aria-label"], om = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, lm = /* @__PURE__ */ L({
  __name: "Button",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = op(), r = A(() => !!t.icon && !t.default), i = A(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      r.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (O(), K("button", {
      type: "button",
      class: Cr(i.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      s.$slots.icon ? (O(), K("span", om, [
        G(s.$slots, "icon", {}, void 0, !0)
      ])) : ee("", !0),
      G(s.$slots, "default", {}, void 0, !0)
    ], 10, sm));
  }
}), ft = /* @__PURE__ */ Oe(lm, [["__scopeId", "data-v-d2460090"]]), Cu = {
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
}, am = {
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
}, ha = { fr: Cu, en: am }, Tu = /* @__PURE__ */ Symbol("i18n");
function GE(n) {
  const e = A(() => {
    const r = ha[n.value] ?? ha.fr;
    return (i) => r[i] ?? i;
  }), t = {
    t: (r) => e.value(r),
    locale: n
  };
  return jn(Tu, t), t;
}
function wt() {
  const n = Zi(Tu);
  if (n) return n;
  const e = A(() => "fr");
  return {
    t: (t) => Cu[t] ?? t,
    locale: e
  };
}
const cm = { class: "editor-header" }, um = { class: "header-left" }, dm = { class: "document-title" }, fm = { class: "badges" }, hm = ["datetime"], pm = { class: "header-right" }, mm = /* @__PURE__ */ L({
  __name: "Header",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = wt(), i = A(() => ll(e.language, r.value, t("language.wildcard"))), s = A(() => Ti(e.duration)), o = A(() => e.title.replace(/-/g, " "));
    return (l, a) => (O(), K("header", cm, [
      J("div", um, [
        J("h1", dm, ne(o.value), 1),
        J("div", fm, [
          F(yo, null, {
            default: N(() => [
              He(ne(i.value), 1)
            ]),
            _: 1
          }),
          F(yo, null, {
            default: N(() => [
              J("time", {
                datetime: `PT${n.duration}S`
              }, ne(s.value), 9, hm)
            ]),
            _: 1
          })
        ])
      ]),
      J("div", pm, [
        n.isMobile ? (O(), z(ft, {
          key: 0,
          variant: "ghost",
          "aria-label": v(t)("header.openSidebar"),
          onClick: a[0] || (a[0] = (c) => l.$emit("toggleSidebar"))
        }, {
          icon: N(() => [
            F(v(em), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : ee("", !0),
        n.isMobile ? (O(), z(ft, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(t)("header.export")
        }, {
          icon: N(() => [
            F(v(fa), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (O(), z(ft, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: N(() => [
            F(v(fa), { size: 16 })
          ]),
          default: N(() => [
            He(" " + ne(v(t)("header.export")), 1)
          ]),
          _: 1
        })),
        F(ft, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(t)("header.settings")
        }, {
          icon: N(() => [
            F(v(Gp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), gm = /* @__PURE__ */ Oe(mm, [["__scopeId", "data-v-fce7f10f"]]), _s = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, ym = 70, vm = 1e3 / 60, bm = 350;
let pi = !1, pa = !1;
function wm() {
  pa || typeof document > "u" || (document.addEventListener("mousedown", () => {
    pi = !0;
  }), document.addEventListener("mouseup", () => {
    pi = !1;
  }), document.addEventListener("click", () => {
    pi = !1;
  }), pa = !0);
}
const Ns = /* @__PURE__ */ new Map();
function Is(...n) {
  const e = {
    damping: _s.damping,
    stiffness: _s.stiffness,
    mass: _s.mass
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
  return Ns.has(r) || Ns.set(r, Object.freeze({ ...e })), t ? "instant" : Ns.get(r);
}
function xm(n = {}) {
  wm();
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
    for (const I of t) I(M);
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
    const M = r.scrollElement, I = r.contentElement;
    return !M || !I ? 0 : M.scrollHeight - 1 - M.clientHeight;
  }
  let c;
  function u() {
    const M = r.scrollElement, I = r.contentElement;
    if (!M || !I)
      return 0;
    const R = a();
    if (!e.targetScrollTop)
      return R;
    if (c?.targetScrollTop === R)
      return c.calculatedScrollTop;
    const q = Math.max(
      Math.min(
        e.targetScrollTop(R, {
          scrollElement: M,
          contentElement: I
        }),
        R
      ),
      0
    );
    return c = { targetScrollTop: R, calculatedScrollTop: q }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), q;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= ym;
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
    if (!pi || typeof window > "u")
      return !1;
    const M = window.getSelection?.();
    if (!M || !M.rangeCount)
      return !1;
    const I = M.getRangeAt(0), R = r.scrollElement;
    if (!R)
      return !1;
    const q = I.commonAncestorContainer;
    return !!(q && (R.contains(q) || q.contains(R)));
  }
  const y = (M) => {
    if (M.target !== r.scrollElement)
      return;
    const I = o(), R = r.ignoreScrollToTop;
    let q = r.lastScrollTop ?? I;
    r.lastScrollTop = I, r.ignoreScrollToTop = void 0, R && R > I && (q = R), m(f()), setTimeout(() => {
      if (r.resizeDifference || I === R)
        return;
      if (g()) {
        p(!0), h(!1);
        return;
      }
      const _ = I > q, $ = I < q;
      if (r.animation?.ignoreEscapes) {
        l(q);
        return;
      }
      $ && (p(!0), h(!1)), _ && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, w = (M) => {
    const I = r.scrollElement;
    if (!I)
      return;
    let R = M.target;
    for (; R && !["scroll", "auto"].includes(getComputedStyle(R).overflow); ) {
      if (!R.parentElement)
        return;
      R = R.parentElement;
    }
    R === I && M.deltaY < 0 && I.scrollHeight > I.clientHeight && !r.animation?.ignoreEscapes && (p(!0), h(!1));
  };
  function S(M, I) {
    b(), r.scrollElement = M, r.contentElement = I, getComputedStyle(M).overflow === "visible" && (M.style.overflow = "auto"), M.addEventListener("scroll", y, { passive: !0 }), M.addEventListener("wheel", w, { passive: !0 });
    let R;
    r.resizeObserver = new ResizeObserver((q) => {
      const _ = q[0];
      if (!_)
        return;
      const { height: $ } = _.contentRect, te = $ - (R ?? $);
      if (r.resizeDifference = te, o() > a() && l(a()), m(f()), te >= 0) {
        const X = Is(
          e,
          R ? e.resize : e.initial
        );
        x({
          animation: X,
          wait: !0,
          preserveScrollPosition: !0,
          duration: X === "instant" ? void 0 : bm
        });
      } else
        f() && (p(!1), h(!0));
      R = $, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === te && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(I);
  }
  function b() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", y), r.scrollElement.removeEventListener("wheel", w)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function k() {
    b(), t.clear();
  }
  function C(M) {
    e = { ...e, ...M };
  }
  function x(M = {}) {
    const I = typeof M == "string" ? { animation: M } : M;
    I.preserveScrollPosition || h(!0);
    const R = Date.now() + (Number(I.wait) || 0), q = Is(e, I.animation), { ignoreEscapes: _ = !1 } = I;
    let $, te = u();
    I.duration instanceof Promise ? I.duration.finally(() => {
      $ = Date.now();
    }) : $ = R + (I.duration ?? 0);
    const X = async () => {
      const ie = new Promise((de) => {
        if (typeof requestAnimationFrame > "u") {
          de(!1);
          return;
        }
        requestAnimationFrame(() => de(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const de = o(), Le = typeof performance < "u" ? performance.now() : Date.now(), An = (Le - (r.lastTick ?? Le)) / vm;
        if (r.animation ||= { behavior: q, promise: ie, ignoreEscapes: _ }, r.animation.behavior === q && (r.lastTick = Le), g() || R > Date.now())
          return X();
        if (de < Math.min(te, u())) {
          if (r.animation?.behavior === q) {
            if (q === "instant")
              return l(u()), X();
            const st = q;
            r.velocity = (st.damping * r.velocity + st.stiffness * d()) / st.mass, r.accumulated += r.velocity * An;
            const Dn = o();
            l(Dn + r.accumulated), o() !== Dn && (r.accumulated = 0);
          }
          return X();
        }
        return $ > Date.now() ? (te = u(), X()) : (r.animation = void 0, o() < u() ? x({
          animation: Is(e, e.resize),
          ignoreEscapes: _,
          duration: Math.max(0, $ - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ie.then((de) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), de));
    };
    return I.wait !== !0 && (r.animation = void 0), r.animation?.behavior === q ? r.animation.promise : X();
  }
  const E = () => {
    p(!0), h(!1);
  };
  function T(M) {
    return t.add(M), () => t.delete(M);
  }
  return {
    attach: S,
    detach: b,
    destroy: k,
    setOptions: C,
    getState: s,
    onChange: T,
    scrollToBottom: x,
    stopScroll: E
  };
}
function Sm(n = {}) {
  const e = P(null), t = P(null), r = P(n.initial !== !1), i = P(!1), s = P(!1), o = xm(n);
  let l = null;
  return je((a) => {
    !e.value || !t.value || (o.attach(e.value, t.value), l = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), a(() => {
      l?.(), l = null, o.detach();
    }));
  }), kn(() => {
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
const km = /* @__PURE__ */ L({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (O(), K("span", {
      class: "speaker-indicator",
      style: Cn({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Eu = /* @__PURE__ */ Oe(km, [["__scopeId", "data-v-9bffeda8"]]), Cm = { class: "speaker-label" }, Tm = {
  key: 1,
  class: "speaker-name"
}, Em = ["datetime"], Mm = /* @__PURE__ */ L({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = wt(), i = A(
      () => ll(e.language, r.value, t("language.wildcard"))
    ), s = A(
      () => e.startTime != null ? Ti(e.startTime) : null
    ), o = A(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), l = A(() => e.speaker?.color ?? "transparent");
    return (a, c) => (O(), K("div", Cm, [
      n.speaker ? (O(), z(Eu, {
        key: 0,
        color: l.value
      }, null, 8, ["color"])) : ee("", !0),
      n.speaker ? (O(), K("span", Tm, ne(n.speaker.name), 1)) : ee("", !0),
      s.value ? (O(), K("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, ne(s.value), 9, Em)) : ee("", !0),
      F(yo, null, {
        default: N(() => [
          He(ne(i.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), Mu = /* @__PURE__ */ Oe(Mm, [["__scopeId", "data-v-8bb5c8bd"]]), Om = ["data-turn-active"], Am = { class: "turn-text" }, Dm = ["data-word-active"], Pm = /* @__PURE__ */ L({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Nt(), r = A(() => e.turn.words.length > 0), i = A(() => {
      if (!t.audio?.src.value || !r.value) return null;
      const l = t.audio.currentTime.value, { startTime: a, endTime: c, words: u } = e.turn;
      return a == null || c == null || l < a || l > c ? null : go(u, l);
    }), s = A(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Ei(e.turn.words)) return !1;
      const l = t.audio.currentTime.value;
      return l >= e.turn.startTime && l <= e.turn.endTime;
    }), o = A(() => e.speaker?.color ?? "transparent");
    return (l, a) => (O(), K("section", {
      class: Cr(["turn", { "turn--active": s.value, "turn--partial": n.partial }]),
      "data-turn-active": s.value || n.partial || n.live || void 0,
      style: Cn({ "--speaker-color": o.value })
    }, [
      n.partial ? ee("", !0) : (O(), z(Mu, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      J("p", Am, [
        r.value ? (O(!0), K(tt, { key: 0 }, Tn(n.turn.words, (c, u) => (O(), K(tt, {
          key: c.id
        }, [
          J("span", {
            class: Cr({ "word--active": c.id === i.value }),
            "data-word-active": c.id === i.value || void 0
          }, ne(c.text), 11, Dm),
          He(ne(u < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (O(), K(tt, { key: 1 }, [
          He(ne(n.turn.text), 1)
        ], 64)) : ee("", !0)
      ])
    ], 14, Om));
  }
}), ma = /* @__PURE__ */ Oe(Pm, [["__scopeId", "data-v-8d148b2f"]]), _m = {}, Nm = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Im(n, e) {
  return O(), K("svg", Nm, [...e[0] || (e[0] = [
    lp('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Rm = /* @__PURE__ */ Oe(_m, [["render", Im]]), $m = { class: "transcription-empty" }, Bm = { class: "message" }, Lm = /* @__PURE__ */ L({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = wt();
    return (t, r) => (O(), K("div", $m, [
      F(Rm, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      J("p", Bm, ne(v(e)("transcription.empty")), 1)
    ]));
  }
}), Fm = /* @__PURE__ */ Oe(Lm, [["__scopeId", "data-v-f82737e5"]]), zm = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function Vm(n, e) {
  const t = Nt(), r = P(!0), i = A(() => {
    if (!t.audio?.isPlaying.value) return null;
    const f = t.audio.currentTime.value;
    for (const h of e.value)
      if (h.startTime != null && h.endTime != null && f >= h.startTime && f <= h.endTime)
        return h.id;
    return null;
  }), s = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function o() {
    console.log("scroll");
    const f = n.value;
    if (!f || !i.value) return;
    const h = f.querySelector("[data-word-active]") ?? f.querySelector(
      `[data-turn-id="${i.value}"]`
    );
    h && h.scrollIntoView({
      block: "center",
      behavior: s ? "instant" : "smooth"
    });
  }
  re(i, (f) => {
    console.log("active", f), !(!f || !r.value) && o();
  }), re(
    () => t.audio?.isPlaying.value,
    (f) => {
      f && (r.value = !0);
    }
  );
  function l() {
    r.value = !1;
  }
  function a(f) {
    zm.has(f.key) && l();
  }
  function c(f) {
    n.value?.addEventListener("wheel", f, { passive: !0 }), n.value?.addEventListener("touchstart", f, {
      passive: !0
    }), n.value?.addEventListener("pointerdown", f, {
      passive: !0
    }), n.value?.addEventListener("keydown", a);
  }
  function u(f) {
    n.value?.removeEventListener("wheel", f), n.value?.removeEventListener("touchstart", f), n.value?.removeEventListener("pointerdown", f), n.value?.removeEventListener("keydown", a);
  }
  ve(() => {
    c(l);
  }), kn(() => {
    u(l);
  });
  function d() {
    r.value = !0, o();
  }
  return { isFollowing: r, activeTurnId: i, resumeFollow: d };
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
function Ou(n, e, t) {
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
      let o = Ou(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function Au(n, e, t, r) {
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
      let c = Au(o.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
class D {
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
    return new D(i, this.size + e.size);
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
    return new D(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? D.empty : e == 0 && t == this.content.length ? this : new D(this.content.slice(e, t));
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
    return i[e] = t, new D(i, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new D([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new D(this.content.concat(e), this.size + e.nodeSize);
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
    return Ou(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Au(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return ei(0, e);
    if (e == this.size)
      return ei(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? ei(t + 1, s) : ei(t, r);
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
      return D.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new D(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return D.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new D(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return D.empty;
    if (e instanceof D)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new D([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
D.empty = new D([], 0);
const Rs = { index: 0, offset: 0 };
function ei(n, e) {
  return Rs.index = n, Rs.offset = e, Rs;
}
function Mi(n, e) {
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
      if (!Mi(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Mi(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let oe = class vo {
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
    return this == e || this.type == e.type && Mi(this.attrs, e.attrs);
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
      return vo.none;
    if (e instanceof vo)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
oe.none = [];
class Oi extends Error {
}
class B {
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
    let r = Pu(this.content, e + this.openStart, t);
    return r && new B(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new B(Du(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return B.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new B(D.fromJSON(e, t.content), r, i);
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
    return new B(e, r, i);
  }
}
B.empty = new B(D.empty, 0, 0);
function Du(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (i == e || s.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Du(s.content, e - i - 1, t - i - 1)));
}
function Pu(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = Pu(o.content, e - s - 1, t, o);
  return l && n.replaceChild(i, o.copy(l));
}
function qm(n, e, t) {
  if (t.openStart > n.depth)
    throw new Oi("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Oi("Inconsistent open depths");
  return _u(n, e, t, 0);
}
function _u(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = _u(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return fn(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = Wm(t, n);
      return fn(s, Iu(n, o, l, e, r));
    }
  else return fn(s, Ai(n, e, r));
}
function Nu(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Oi("Cannot join " + e.type.name + " onto " + n.type.name);
}
function bo(n, e, t) {
  let r = n.node(t);
  return Nu(r, e.node(t)), r;
}
function dn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function mr(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (dn(n.nodeAfter, r), s++));
  for (let l = s; l < o; l++)
    dn(i.child(l), r);
  e && e.depth == t && e.textOffset && dn(e.nodeBefore, r);
}
function fn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Iu(n, e, t, r, i) {
  let s = n.depth > i && bo(n, e, i + 1), o = r.depth > i && bo(t, r, i + 1), l = [];
  return mr(null, n, i, l), s && o && e.index(i) == t.index(i) ? (Nu(s, o), dn(fn(s, Iu(n, e, t, r, i + 1)), l)) : (s && dn(fn(s, Ai(n, e, i + 1)), l), mr(e, t, i, l), o && dn(fn(o, Ai(t, r, i + 1)), l)), mr(r, null, i, l), new D(l);
}
function Ai(n, e, t) {
  let r = [];
  if (mr(null, n, t, r), n.depth > t) {
    let i = bo(n, e, t + 1);
    dn(fn(i, Ai(n, e, t + 1)), r);
  }
  return mr(e, null, t, r), new D(r);
}
function Wm(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(D.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Er {
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
      return oe.none;
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
        return new Di(this, e, r);
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
    return new Er(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = ga.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      ga.set(e, r = new Hm());
    let i = r.elts[r.i] = Er.resolve(e, t);
    return r.i = (r.i + 1) % jm, i;
  }
}
class Hm {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const jm = 12, ga = /* @__PURE__ */ new WeakMap();
class Di {
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
const Um = /* @__PURE__ */ Object.create(null);
let Mt = class wo {
  /**
  @internal
  */
  constructor(e, t, r, i = oe.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || D.empty;
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
    return this.type == e && Mi(this.attrs, t || e.defaultAttrs || Um) && oe.sameSet(this.marks, r || oe.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new wo(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new wo(this.type, this.attrs, this.content, e);
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
      return B.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), l = i.start(o), c = i.node(o).content.cut(i.pos - l, s.pos - l);
    return new B(c, i.depth - o, s.depth - o);
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
    return qm(this.resolve(e), this.resolve(t), r);
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
    return Er.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Er.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ru(this.marks, e);
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
  canReplace(e, t, r = D.empty, i = 0, s = r.childCount) {
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
    let e = oe.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!oe.sameSet(e, this.marks))
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
    let i = D.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
Mt.prototype.text = void 0;
class Pi extends Mt {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ru(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new Pi(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Pi(this.type, this.attrs, e, this.marks);
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
function Ru(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class yn {
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
    let r = new Km(e, t);
    if (r.next == null)
      return yn.empty;
    let i = $u(r);
    r.next && r.err("Unexpected trailing text");
    let s = eg(Qm(i));
    return tg(s, r), s;
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
        return D.from(l.map((c) => c.createAndFill()));
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
yn.empty = new yn(!0);
class Km {
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
function $u(n) {
  let e = [];
  do
    e.push(Jm(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Jm(n) {
  let e = [];
  do
    e.push(Xm(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Xm(n) {
  let e = Zm(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = Ym(n, e);
    else
      break;
  return e;
}
function ya(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Ym(n, e) {
  let t = ya(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = ya(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Gm(n, e) {
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
function Zm(n) {
  if (n.eat("(")) {
    let e = $u(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Gm(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Qm(n) {
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
function Bu(n, e) {
  return e - n;
}
function va(n, e) {
  let t = [];
  return r(e), t.sort(Bu);
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
function eg(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(va(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == l && (c = i[u][1]);
        va(n, a).forEach((u) => {
          c || i.push([l, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new yn(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let l = i[o][1].sort(Bu);
      s.next.push({ type: i[o][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function tg(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      o.push(a.name), s && !(a.isText || a.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Lu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Fu(n, e) {
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
function zu(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function Vu(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new rg(n, r, e[r]);
  return t;
}
let ba = class qu {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Vu(e, r.attrs), this.defaultAttrs = Lu(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == yn.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Fu(this.attrs, e);
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
    return new Mt(this, this.computeAttrs(e), D.from(t), oe.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = D.from(t), this.checkContent(t), new Mt(this, this.computeAttrs(e), t, oe.setFrom(r));
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
    if (e = this.computeAttrs(e), t = D.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(D.empty, !0);
    return s ? new Mt(this, e, t.append(s), oe.setFrom(r)) : null;
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
    zu(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : oe.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new qu(s, t, o));
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
function ng(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class rg {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? ng(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Qi {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Vu(e, i.attrs), this.excluded = null;
    let s = Lu(this.attrs);
    this.instance = s ? new oe(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new oe(this, Fu(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Qi(s, i++, t, o)), r;
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
    zu(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let Wu = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = ke.from(e.nodes), t.marks = ke.from(e.marks || {}), this.nodes = ba.compile(this.spec.nodes, this), this.marks = Qi.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", l = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = yn.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = l == "_" ? null : l ? wa(this, l.split(" ")) : l == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : wa(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => Mt.fromJSON(this, i), this.markFromJSON = (i) => oe.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof ba) {
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
    return new Pi(r, r.defaultAttrs, e, oe.setFrom(t));
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
};
function wa(n, e) {
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
function ig(n) {
  return n.tag != null;
}
function sg(n) {
  return n.style != null;
}
let gr = class xo {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (ig(i))
        this.tags.push(i);
      else if (sg(i)) {
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
    let r = new Sa(this, t, !1);
    return r.addAll(e, oe.none, t.from, t.to), r.finish();
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
    let r = new Sa(this, t, !0);
    return r.addAll(e, oe.none, t.from, t.to), B.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (ag(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(o = ka(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = ka(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new xo(e, xo.schemaRules(e)));
  }
};
const Hu = {
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
}, og = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, ju = { ol: !0, ul: !0 }, Mr = 1, So = 2, yr = 4;
function xa(n, e, t) {
  return e != null ? (e ? Mr : 0) | (e === "full" ? So : 0) : n && n.whitespace == "pre" ? Mr | So : t & ~yr;
}
class ti {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = oe.none, this.match = s || (o & yr ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(D.from(e));
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
    if (!(this.options & Mr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = D.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(D.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Hu.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Sa {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = xa(null, t.preserveWhitespace, 0) | (r ? yr : 0);
    i ? s = new ti(i.type, i.attrs, oe.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new ti(null, null, oe.none, !0, null, o) : s = new ti(e.schema.topNodeType, null, oe.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & So ? "full" : this.localPreserveWS || (i.options & Mr) > 0, { schema: o } = this.parser;
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
    ju.hasOwnProperty(o) && this.parser.normalizeLists && lg(e);
    let a = this.options.ruleFromNode && this.options.ruleFromNode(e) || (l = this.parser.matchTag(e, this, r));
    e: if (a ? a.ignore : og.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!a || a.skip || a.closeParent) {
      a && a.closeParent ? this.open = Math.max(0, this.open - 1) : a && a.skip.nodeType && (e = a.skip);
      let c, u = this.needsBlock;
      if (Hu.hasOwnProperty(o))
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
      let o = oe.none;
      for (let l of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(l.type) : Ca(l.type, e.type)) && (o = l.addToSet(o));
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
    let l = xa(e, s, o.options);
    o.options & yr && o.content.length == 0 && (l |= yr);
    let a = oe.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : Ca(c.type, e)) ? (a = c.addToSet(a), !1) : !0), this.nodes.push(new ti(e, t, a, i, null, l)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Mr);
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
function lg(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && ju.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function ag(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function ka(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Ca(n, e) {
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
class En {
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
    r || (r = $s(t).createDocumentFragment());
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
    let { dom: r, contentDOM: i } = mi($s(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && mi($s(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return mi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new En(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Ta(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Ta(e.marks);
  }
}
function Ta(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function $s(n) {
  return n.document || window.document;
}
const Ea = /* @__PURE__ */ new WeakMap();
function cg(n) {
  let e = Ea.get(n);
  return e === void 0 && Ea.set(n, e = ug(n)), e;
}
function ug(n) {
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
function mi(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = cg(r)) && s.indexOf(e) > -1)
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
      let { dom: h, contentDOM: p } = mi(n, f, t, r);
      if (a.appendChild(h), p) {
        if (l)
          throw new RangeError("Multiple content holes");
        l = p;
      }
    }
  }
  return { dom: a, contentDOM: l };
}
const Uu = 65535, Ku = Math.pow(2, 16);
function dg(n, e) {
  return n + e * Ku;
}
function Ma(n) {
  return n & Uu;
}
function fg(n) {
  return (n - (n & Uu)) / Ku;
}
const Ju = 1, Xu = 2, gi = 4, Yu = 8;
class ko {
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
    return (this.delInfo & Yu) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Ju | gi)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Xu | gi)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & gi) > 0;
  }
}
class Xe {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && Xe.empty)
      return Xe.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Ma(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + fg(e);
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
        let p = e == (t < 0 ? a : d) ? null : dg(l / 3, e - a), m = e == a ? Xu : e == d ? Ju : gi;
        return (t < 0 ? e != a : e != d) && (m |= Yu), new ko(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new ko(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Ma(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
    return new Xe(this.ranges, !this.inverted);
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
    return e == 0 ? Xe.empty : new Xe(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
Xe.empty = new Xe([]);
class _i {
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
    return new _i(this._maps, this.mirror, e, t);
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
    let e = new _i();
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
    return r ? e : new ko(e, i, null);
  }
}
const Bs = /* @__PURE__ */ Object.create(null);
class _e {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return Xe.empty;
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
    let r = Bs[t.stepType];
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
    if (e in Bs)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Bs[e] = t, t.prototype.jsonID = e, t;
  }
}
class pe {
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
    return new pe(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new pe(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return pe.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof Oi)
        return pe.fail(s.message);
      throw s;
    }
  }
}
function al(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(al(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return D.fromArray(r);
}
class Vt extends _e {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new B(al(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new lt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Vt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Vt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Vt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Vt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
_e.jsonID("addMark", Vt);
class lt extends _e {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new B(al(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Vt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new lt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof lt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new lt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new lt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
_e.jsonID("removeMark", lt);
class qt extends _e {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return pe.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return pe.fromReplace(e, this.pos, this.pos + 1, new B(D.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new qt(this.pos, t.marks[i]);
        return new qt(this.pos, this.mark);
      }
    }
    return new vn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new qt(t.pos, this.mark);
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
    return new qt(t.pos, e.markFromJSON(t.mark));
  }
}
_e.jsonID("addNodeMark", qt);
class vn extends _e {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return pe.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return pe.fromReplace(e, this.pos, this.pos + 1, new B(D.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new qt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new vn(t.pos, this.mark);
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
    return new vn(t.pos, e.markFromJSON(t.mark));
  }
}
_e.jsonID("removeNodeMark", vn);
class be extends _e {
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
    return this.structure && Co(e, this.from, this.to) ? pe.fail("Structure replace would overwrite content") : pe.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new Xe([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new be(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new be(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof be) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? B.empty : new B(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new be(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? B.empty : new B(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new be(e.from, this.to, t, this.structure);
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
    return new be(t.from, t.to, B.fromJSON(e, t.slice), !!t.structure);
  }
}
_e.jsonID("replace", be);
class we extends _e {
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
    if (this.structure && (Co(e, this.from, this.gapFrom) || Co(e, this.gapTo, this.to)))
      return pe.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return pe.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? pe.fromReplace(e, this.from, this.to, r) : pe.fail("Content does not fit in gap");
  }
  getMap() {
    return new Xe([
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
    return new we(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new we(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new we(t.from, t.to, t.gapFrom, t.gapTo, B.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
_e.jsonID("replaceAround", we);
function Co(n, e, t) {
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
function hg(n, e, t, r) {
  let i = [], s = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, u) => {
    if (!a.isInline)
      return;
    let d = a.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + a.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new lt(f, h, d[m])));
      l && l.to == f ? l.to = h : s.push(l = new Vt(f, h, r));
    }
  }), i.forEach((a) => n.step(a)), s.forEach((a) => n.step(a));
}
function pg(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    s++;
    let a = null;
    if (r instanceof Qi) {
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
  }), i.forEach((o) => n.step(new lt(o.from, o.to, o.style)));
}
function cl(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], l = e + 1;
  for (let a = 0; a < s.childCount; a++) {
    let c = s.child(a), u = l + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new be(l, u, B.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new lt(l, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new B(D.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new be(l + f.index, l + f.index + f[0].length, p));
      }
    }
    l = u;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(D.empty, !0);
    n.replace(l, l, new B(a, 0, 0));
  }
  for (let a = o.length - 1; a >= 0; a--)
    n.step(o[a]);
}
function mg(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function nr(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), l = n.$from.index(r) + i, a = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(l, a, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !mg(o, l, a))
      break;
    l && (i = 1), a < o.childCount && (s = 1);
  }
  return null;
}
function gg(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), l = i.after(s + 1), a = o, c = l, u = D.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = D.from(r.node(p).copy(u)), d++) : a--;
  let f = D.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = D.from(i.node(p).copy(f)), h++) : c++;
  n.step(new we(a, c, o, l, new B(u.append(f), d, h), u.size - d, !0));
}
function Gu(n, e, t = null, r = n) {
  let i = yg(n, e), s = i && vg(r, e);
  return s ? i.map(Oa).concat({ type: e, attrs: t }).concat(s.map(Oa)) : null;
}
function Oa(n) {
  return { type: n, attrs: null };
}
function yg(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function vg(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function bg(n, e, t) {
  let r = D.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = D.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new we(i, s, i, s, new B(r, 0, 0), t.length, !0));
}
function wg(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    let a = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, a) && xg(n.doc, n.mapping.slice(s).map(l), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && Qu(n, o, l, s), cl(n, n.mapping.slice(s).map(l, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(l, 1), f = u.map(l + o.nodeSize, 1);
      return n.step(new we(d, f, d + 1, f - 1, new B(D.from(r.create(a, null, o.marks)), 0, 0), 1, !0)), c === !0 && Zu(n, o, l, s), !1;
    }
  });
}
function Zu(n, e, t, r) {
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
function Qu(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function xg(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Sg(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new we(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new B(D.from(o), 0, 0), 1, !0));
}
function Ot(n, e, t = 1, r) {
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
function kg(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = D.empty, o = D.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    s = D.from(i.node(l).copy(s));
    let u = r && r[c];
    o = D.from(u ? u.type.create(u.attrs, o) : i.node(l).copy(o));
  }
  n.step(new be(e, e, new B(s.append(o), t, t), !0));
}
function Mn(n, e) {
  let t = n.resolve(e), r = t.index();
  return ed(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Cg(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function ed(n, e) {
  return !!(n && e && !n.isLeaf && Cg(n, e));
}
function es(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, l = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), l++, o = r.node(i).maybeChild(l)) : (s = r.node(i).maybeChild(l - 1), o = r.node(i + 1)), s && !s.isTextblock && ed(s, o) && r.node(i).canReplace(l, l + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Tg(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let l = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Qu(n, u.node(), u.before(), l);
  }
  o.inlineContent && cl(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let a = n.mapping.slice(l), c = a.map(e - t);
  if (n.step(new be(c, a.map(e + t, -1), B.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Zu(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function Eg(n, e, t) {
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
function Mg(n, e, t) {
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
function ts(n, e, t = e, r = B.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return td(i, s, r) ? new be(e, t, r) : new Og(i, s, r).fit();
}
function td(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Og {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = D.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = D.from(e.node(i).copy(this.placed));
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
    let a = new B(s, o, l);
    return e > -1 ? new we(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new be(r.pos, i.pos, a) : null;
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
        r ? (s = Ls(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(D.from(o), !1)) : s && a.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: u };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ls(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new B(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ls(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new B(ur(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new B(ur(e, t, 1), t, r);
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
      c++, (c > 1 || a == 0 || m.content.size) && (d = g, u.push(nd(m.mark(f.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? h : -1)));
    }
    let p = c == l.childCount;
    p || (h = -1), this.placed = dr(this.placed, t, D.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < h; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? B.empty : new B(ur(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new B(ur(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Fs(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Fs(e, t, i, r, s);
      if (o) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l], u = Fs(e, l, c, a, !0);
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
    t.fit.childCount && (this.placed = dr(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = dr(this.placed, this.depth, D.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(D.empty, !0);
    t.childCount && (this.placed = dr(this.placed, this.frontier.length, t));
  }
}
function ur(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(ur(n.firstChild.content, e - 1, t)));
}
function dr(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(dr(n.lastChild.content, e - 1, t)));
}
function Ls(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function nd(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, nd(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(D.empty, !0)))), n.copy(r);
}
function Fs(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, o);
  return l && !Ag(t, s.content, o) ? l : null;
}
function Ag(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Dg(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Pg(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (td(i, s, r))
    return n.step(new be(e, t, r));
  let o = id(i, s);
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
    let h = c[f], p = Dg(h.type);
    if (p && !h.sameMarkup(i.node(Math.abs(l) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + a) % o.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let w = i.node(g - 1), S = i.index(g - 1);
        if (w.canReplaceWith(S, S, p.type, p.marks))
          return n.replace(i.before(g), y ? s.after(g) : t, new B(rd(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function rd(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(rd(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(D.empty, !0));
  }
  return n;
}
function _g(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Eg(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new B(D.from(r), 0, 0));
}
function Ng(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = id(r, i);
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
function id(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class Vn extends _e {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return pe.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return pe.fromReplace(e, this.pos, this.pos + 1, new B(D.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return Xe.empty;
  }
  invert(e) {
    return new Vn(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Vn(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Vn(t.pos, t.attr, t.value);
  }
}
_e.jsonID("attr", Vn);
class Or extends _e {
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
    return pe.ok(r);
  }
  getMap() {
    return Xe.empty;
  }
  invert(e) {
    return new Or(this.attr, e.attrs[this.attr]);
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
    return new Or(t.attr, t.value);
  }
}
_e.jsonID("docAttr", Or);
let Un = class extends Error {
};
Un = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Un.prototype = Object.create(Error.prototype);
Un.prototype.constructor = Un;
Un.prototype.name = "TransformError";
class sd {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new _i();
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
      throw new Un(t.failed);
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
  replace(e, t = e, r = B.empty) {
    let i = ts(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new B(D.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, B.empty);
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
    return Pg(this, e, t, r), this;
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
    return _g(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Ng(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return gg(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Tg(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return bg(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return wg(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Sg(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Vn(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Or(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new qt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof oe)
      t.isInSet(r.marks) && this.step(new vn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new vn(e, s)), i = s.removeFromSet(i);
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
    return kg(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return hg(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return pg(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return cl(this, e, t, r), this;
  }
}
const zs = /* @__PURE__ */ Object.create(null);
class Q {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new Ig(e.min(t), e.max(t))];
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
  replace(e, t = B.empty) {
    let r = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], u = e.mapping.slice(s);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? B.empty : t), l == 0 && Pa(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), Pa(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new Y(e) : Bn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Bn(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Bn(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new qe(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Bn(e, e, 0, 0, 1) || new qe(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Bn(e, e, e.content.size, e.childCount, -1) || new qe(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = zs[t.type];
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
    if (e in zs)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return zs[e] = t, t.prototype.jsonID = e, t;
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
    return Y.between(this.$anchor, this.$head).getBookmark();
  }
}
Q.prototype.visible = !0;
class Ig {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Aa = !1;
function Da(n) {
  !Aa && !n.parent.inlineContent && (Aa = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class Y extends Q {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Da(e), Da(t), super(e, t);
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
      return Q.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new Y(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = B.empty) {
    if (super.replace(e, t), t == B.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof Y && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new ns(this.anchor, this.head);
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
    return new Y(e.resolve(t.anchor), e.resolve(t.head));
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
      let s = Q.findFrom(t, r, !0) || Q.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return Q.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (Q.findFrom(e, -r, !0) || Q.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new Y(e, t);
  }
}
Q.jsonID("text", Y);
class ns {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new ns(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return Y.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class j extends Q {
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
    return r ? Q.near(s) : new j(s);
  }
  content() {
    return new B(D.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof j && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new ul(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new j(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new j(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
j.prototype.visible = !1;
Q.jsonID("node", j);
class ul {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new ns(r, r) : new ul(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && j.isSelectable(r) ? new j(t) : Q.near(t);
  }
}
class qe extends Q {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = B.empty) {
    if (t == B.empty) {
      e.delete(0, e.doc.content.size);
      let r = Q.atStart(e.doc);
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
    return new qe(e);
  }
  map(e) {
    return new qe(e);
  }
  eq(e) {
    return e instanceof qe;
  }
  getBookmark() {
    return Rg;
  }
}
Q.jsonID("all", qe);
const Rg = {
  map() {
    return this;
  },
  resolve(n) {
    return new qe(n);
  }
};
function Bn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return Y.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!s && j.isSelectable(l))
        return j.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Bn(n, l, t + i, i < 0 ? l.childCount : 0, i, s);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function Pa(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof be || i instanceof we))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
const _a = 1, ni = 2, Na = 4;
class $g extends sd {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | _a) & ~ni, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & _a) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= ni, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return oe.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & ni) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~ni, this.storedMarks = null;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || oe.none))), r.replaceWith(this, e), this;
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
      return this.replaceRangeWith(t, r, i.text(e, s)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(Q.near(this.selection.$to)), this;
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
    return this.updated |= Na, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Na) > 0;
  }
}
function Ia(n, e) {
  return !e || !n ? n : n.bind(e);
}
class fr {
  constructor(e, t, r) {
    this.name = e, this.init = Ia(t.init, r), this.apply = Ia(t.apply, r);
  }
}
const Bg = [
  new fr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new fr("selection", {
    init(n, e) {
      return n.selection || Q.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new fr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new fr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class Vs {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Bg.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new fr(r.key, r.spec.state, r));
    });
  }
}
class zn {
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
    let t = new zn(this.config), r = this.config.fields;
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
    return new $g(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new Vs(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new zn(t);
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
    let t = new Vs(this.schema, e.plugins), r = t.fields, i = new zn(t);
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
    let i = new Vs(e.schema, e.plugins), s = new zn(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = Mt.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = Q.fromJSON(s.doc, t.selection);
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
function od(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = od(i, e, {})), t[r] = i;
  }
  return t;
}
class Ae {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && od(e.props, this, this.props), this.key = e.key ? e.key.key : ld("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const qs = /* @__PURE__ */ Object.create(null);
function ld(n) {
  return n in qs ? n + "$" + ++qs[n] : (qs[n] = 0, n + "$");
}
class Ue {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = ld(e);
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
const dl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function ad(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const cd = (n, e, t) => {
  let r = ad(n, t);
  if (!r)
    return !1;
  let i = fl(r);
  if (!i) {
    let o = r.blockRange(), l = o && nr(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (vd(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (Kn(s, "end") || j.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let l = ts(n.doc, r.before(o), r.after(o), B.empty);
      if (l && l.slice.size < l.to - l.from) {
        if (e) {
          let a = n.tr.step(l);
          a.setSelection(Kn(s, "end") ? Q.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : j.create(a.doc, i.pos - s.nodeSize)), e(a.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, Lg = (n, e, t) => {
  let r = ad(n, t);
  if (!r)
    return !1;
  let i = fl(r);
  return i ? ud(n, i, e) : !1;
}, Fg = (n, e, t) => {
  let r = fd(n, t);
  if (!r)
    return !1;
  let i = hl(r);
  return i ? ud(n, i, e) : !1;
};
function ud(n, e, t) {
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
  let c = ts(n.doc, s, a, B.empty);
  if (!c || c.from != s || c instanceof be && c.slice.size >= a - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(Y.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function Kn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const dd = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = fl(r);
  }
  let o = s && s.nodeBefore;
  return !o || !j.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(j.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function fl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function fd(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const hd = (n, e, t) => {
  let r = fd(n, t);
  if (!r)
    return !1;
  let i = hl(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (vd(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (Kn(s, "start") || j.isSelectable(s))) {
    let o = ts(n.doc, r.before(), r.after(), B.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(Kn(s, "start") ? Q.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : j.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, pd = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = hl(r);
  }
  let o = s && s.nodeAfter;
  return !o || !j.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(j.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function hl(n) {
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
const zg = (n, e) => {
  let t = n.selection, r = t instanceof j, i;
  if (r) {
    if (t.node.isTextblock || !Mn(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = es(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(j.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, Vg = (n, e) => {
  let t = n.selection, r;
  if (t instanceof j) {
    if (t.node.isTextblock || !Mn(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = es(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, qg = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && nr(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, md = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function pl(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Wg = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = pl(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(Q.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, gd = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof qe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = pl(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = n.tr.insert(o, s.createAndFill());
    l.setSelection(Y.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, yd = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Ot(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && nr(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Hg(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof j && e.selection.node.isBlock)
      return !r.parentOffset || !Ot(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, l, a = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        a = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), l = pl(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1))), s.unshift(a && l ? { type: l } : null), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof Y || e.selection instanceof qe) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Ot(u.doc, d, s.length, s);
    if (f || (s[0] = l ? { type: l } : null, f = Ot(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !a && c && r.node(o).type != l) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      l && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, l) && u.setNodeMarkup(u.mapping.map(r.before(o)), l);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const jg = Hg(), Ug = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(j.create(n.doc, i))), !0);
};
function Kg(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Mn(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function vd(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, l, a = i.type.spec.isolating || s.type.spec.isolating;
  if (!a && Kg(n, e, t))
    return !0;
  let c = !a && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (l = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && l.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = D.empty;
      for (let y = o.length - 1; y >= 0; y--)
        p = D.from(o[y].create(null, p));
      p = D.from(i.copy(p));
      let m = n.tr.step(new we(e.pos - 1, h, e.pos, h, new B(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && Mn(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && a ? null : Q.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && nr(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && Kn(s, "start", !0) && Kn(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let y = D.empty;
        for (let S = p.length - 1; S >= 0; S--)
          y = D.from(p[S].copy(y));
        let w = n.tr.step(new we(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new B(y, p.length, 0), 0, !0));
        t(w.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function bd(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection(Y.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const Jg = bd(-1), Xg = bd(1);
function Yg(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = o && Gu(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Ra(n, e = null) {
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
function ml(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
ml(dl, cd, dd);
ml(dl, hd, pd);
ml(md, gd, yd, jg);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Gg(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let l = r ? t.tr : null;
    return Zg(l, o, n, e) ? (r && r(l.scrollIntoView()), !0) : !1;
  };
}
function Zg(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let a = o.resolve(e.start - 2);
    s = new Di(a, a, e.depth), e.endIndex < e.parent.childCount && (e = new Di(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let l = Gu(s, t, r, e);
  return l ? (n && Qg(n, e, l, i, t), !0) : !1;
}
function Qg(n, e, t, r, i) {
  let s = D.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = D.from(t[u].type.create(t[u].attrs, s));
  n.step(new we(e.start - (r ? 2 : 0), e.end, e.start, e.end, new B(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Ot(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return n;
}
function ey(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? ty(e, t, n, s) : ny(e, t, s) : !0 : !1;
  };
}
function ty(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new we(s - 1, o, s, o, new B(D.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Di(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const l = nr(r);
  if (l == null)
    return !1;
  i.lift(r, l);
  let a = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return Mn(i.doc, a.pos) && a.nodeBefore.type == a.nodeAfter.type && i.join(a.pos), e(i.scrollIntoView()), !0;
}
function ny(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= i.child(p).nodeSize, r.delete(h - 1, h + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? D.empty : D.from(i))))
    return !1;
  let d = s.pos, f = d + o.nodeSize;
  return r.step(new we(d - (l ? 1 : 0), f + (a ? 1 : 0), d + 1, f - 1, new B((l ? D.empty : D.from(i.copy(D.empty))).append(a ? D.empty : D.from(i.copy(D.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function ry(n) {
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
      let c = a.lastChild && a.lastChild.type == l.type, u = D.from(c ? n.create() : null), d = new B(D.from(n.create(null, D.from(l.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new we(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Te = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Jn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let To = null;
const Tt = function(n, e, t) {
  let r = To || (To = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, iy = function() {
  To = null;
}, bn = function(n, e, t, r) {
  return t && ($a(n, e, t, r, -1) || $a(n, e, t, r, 1));
}, sy = /^(img|br|input|textarea|hr)$/i;
function $a(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : et(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || Kr(n) || sy.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Te(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? et(n) : 0;
    } else
      return !1;
  }
}
function et(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function oy(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = et(n);
    } else if (n.parentNode && !Kr(n))
      e = Te(n), n = n.parentNode;
    else
      return null;
  }
}
function ly(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !Kr(n))
      e = Te(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function ay(n, e, t) {
  for (let r = e == 0, i = e == et(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Te(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == et(n);
  }
}
function Kr(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const rs = function(n) {
  return n.focusNode && bn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function sn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function cy(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function uy(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(et(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(et(r.startContainer), r.startOffset) };
  }
}
const gt = typeof navigator < "u" ? navigator : null, Ba = typeof document < "u" ? document : null, Zt = gt && gt.userAgent || "", Eo = /Edge\/(\d+)/.exec(Zt), wd = /MSIE \d/.exec(Zt), Mo = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Zt), We = !!(wd || Mo || Eo), Ht = wd ? document.documentMode : Mo ? +Mo[1] : Eo ? +Eo[1] : 0, nt = !We && /gecko\/(\d+)/i.test(Zt);
nt && +(/Firefox\/(\d+)/.exec(Zt) || [0, 0])[1];
const Oo = !We && /Chrome\/(\d+)/.exec(Zt), Me = !!Oo, xd = Oo ? +Oo[1] : 0, Pe = !We && !!gt && /Apple Computer/.test(gt.vendor), Xn = Pe && (/Mobile\/\w+/.test(Zt) || !!gt && gt.maxTouchPoints > 2), Qe = Xn || (gt ? /Mac/.test(gt.platform) : !1), Sd = gt ? /Win/.test(gt.platform) : !1, Et = /Android \d/.test(Zt), Jr = !!Ba && "webkitFontSmoothing" in Ba.documentElement.style, dy = Jr ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function fy(n) {
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
function Ct(n, e) {
  return typeof n == "number" ? n : n[e];
}
function hy(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function La(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = Jn(o);
      continue;
    }
    let l = o, a = l == s.body, c = a ? fy(s) : hy(l), u = 0, d = 0;
    if (e.top < c.top + Ct(r, "top") ? d = -(c.top - e.top + Ct(i, "top")) : e.bottom > c.bottom - Ct(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + Ct(i, "top") - c.top : e.bottom - c.bottom + Ct(i, "bottom")), e.left < c.left + Ct(r, "left") ? u = -(c.left - e.left + Ct(i, "left")) : e.right > c.right - Ct(r, "right") && (u = e.right - c.right + Ct(i, "right")), u || d)
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
    o = f == "absolute" ? o.offsetParent : Jn(o);
  }
}
function py(n) {
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
  return { refDOM: r, refTop: i, stack: kd(n.dom) };
}
function kd(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Jn(r))
    ;
  return e;
}
function my({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Cd(t, r == 0 ? 0 : r - e);
}
function Cd(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let _n = null;
function gy(n) {
  if (n.setActive)
    return n.setActive();
  if (_n)
    return n.focus(_n);
  let e = kd(n);
  n.focus(_n == null ? {
    get preventScroll() {
      return _n = { preventScroll: !0 }, !0;
    }
  } : void 0), _n || (_n = !1, Cd(e, 0));
}
function Td(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, l = e.top, a, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = Tt(u).getClientRects();
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
  return !t && a && (t = a, i = c, r = 0), t && t.nodeType == 3 ? yy(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Td(t, i);
}
function yy(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = $t(r, 1);
    if (o.top != o.bottom && gl(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function gl(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function vy(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function by(n, e, t) {
  let { node: r, offset: i } = Td(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function wy(n, e, t, r) {
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
function Ed(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (gl(e, c))
            return Ed(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function xy(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = uy(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!gl(e, c) || (o = Ed(n.dom, e, c), !o))
      return null;
  }
  if (Pe)
    for (let c = o; r && c; c = Jn(c))
      c.draggable && (r = void 0);
  if (o = vy(o, e), r) {
    if (nt && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    Jr && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (l = wy(n, r, i, e));
  }
  l == null && (l = by(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function Fa(n) {
  return n.top < n.bottom || n.left < n.right;
}
function $t(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Fa(r))
      return r;
  }
  return Array.prototype.find.call(t, Fa) || n.getBoundingClientRect();
}
const Sy = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Md(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = Jr || nt;
  if (r.nodeType == 3)
    if (o && (Sy.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let a = $t(Tt(r, i, i), t);
      if (nt && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = $t(Tt(r, i - 1, i - 1), -1);
        if (c.top == a.top) {
          let u = $t(Tt(r, i, i + 1), -1);
          if (u.top != a.top)
            return lr(u, u.left < c.left);
        }
      }
      return a;
    } else {
      let a = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (a--, u = 1) : t < 0 ? a-- : c++, lr($t(Tt(r, a, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == et(r))) {
      let a = r.childNodes[i - 1];
      if (a.nodeType == 1)
        return Ws(a.getBoundingClientRect(), !1);
    }
    if (s == null && i < et(r)) {
      let a = r.childNodes[i];
      if (a.nodeType == 1)
        return Ws(a.getBoundingClientRect(), !0);
    }
    return Ws(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == et(r))) {
    let a = r.childNodes[i - 1], c = a.nodeType == 3 ? Tt(a, et(a) - (o ? 0 : 1)) : a.nodeType == 1 && (a.nodeName != "BR" || !a.nextSibling) ? a : null;
    if (c)
      return lr($t(c, 1), !1);
  }
  if (s == null && i < et(r)) {
    let a = r.childNodes[i];
    for (; a.pmViewDesc && a.pmViewDesc.ignoreForCoords; )
      a = a.nextSibling;
    let c = a ? a.nodeType == 3 ? Tt(a, 0, o ? 0 : 1) : a.nodeType == 1 ? a : null : null;
    if (c)
      return lr($t(c, -1), !0);
  }
  return lr($t(r.nodeType == 3 ? Tt(r) : r, -t), t >= 0);
}
function lr(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Ws(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function Od(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function ky(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return Od(n, e, () => {
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
    let o = Md(n, i.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = Tt(l, 0, l.nodeValue.length).getClientRects();
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
const Cy = /[\u0590-\u08ac]/;
function Ty(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, l = n.domSelection();
  return l ? !Cy.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : o : Od(n, e, () => {
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
let za = null, Va = null, qa = !1;
function Ey(n, e, t) {
  return za == e && Va == t ? qa : (za = e, Va = t, qa = t == "up" || t == "down" ? ky(n, e, t) : Ty(n, e, t));
}
const rt = 0, Wa = 1, ln = 2, yt = 3;
class Xr {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = rt, r.pmViewDesc = this;
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
      i = t > Te(this.contentDOM);
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
      if (l > e || o instanceof Dd) {
        i = e - s;
        break;
      }
      s = l;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof Ad && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Te(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Te(s.dom) : this.contentDOM.childNodes.length };
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
            i = Te(f.dom) + 1;
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
            s = Te(d.dom);
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
    if ((nt || Pe) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (l = a = { node: g.parentNode, offset: Te(g) + 1 });
              break;
            }
            let y = m.pmViewDesc;
            if (y && y.node && y.node.isBlock)
              break;
          }
      } else {
        let m = h.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (nt && u.focusNode && u.focusNode != a.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Pe) && bn(l.node, l.offset, u.anchorNode, u.anchorOffset) && bn(a.node, a.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && nt)) {
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
          this.dirty = e == r || t == o ? ln : Wa, e == l && t == a && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = yt : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? ln : yt;
      }
      r = o;
    }
    this.dirty = ln;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? ln : Wa;
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
class Ad extends Xr {
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
    return this.dirty == rt && e.type.eq(this.widget.type);
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
class My extends Xr {
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
class wn extends Xr {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = En.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new wn(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & yt || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != yt && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != rt) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = rt;
    }
  }
  slice(e, t, r) {
    let i = wn.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = Do(s, t, o, r)), e > 0 && (s = Do(s, 0, e, r));
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
class jt extends Xr {
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
    } else u || ({ dom: u, contentDOM: d } = En.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = Nd(u, r, t), c ? a = new Oy(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new is(e, t, r, i, u, f, s) : new jt(e, t, r, i, u, d || null, f, s, o + 1);
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
      e.contentElement || (e.getContent = () => D.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == rt && e.eq(this.node) && Ni(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, l = s && s.pos < 0, a = new Dy(this, o && o.node, e);
    Ny(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && a.syncToMarks(u == this.node.childCount ? oe.none : this.node.child(u).marks, r, e, u), a.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      a.syncToMarks(c.marks, r, e, f);
      let h;
      a.findNodeMatch(c, u, d, f) || l && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = a.findIndexWithChild(s.node)) > -1 && a.updateNodeAt(c, u, d, h, e) || a.updateNextNode(c, u, d, e, f, i) || a.addNode(c, u, d, e, i), i += c.nodeSize;
    }), a.syncToMarks([], r, e, 0), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == ln) && (o && this.protectLocalComposition(e, o), Pd(this.contentDOM, this.children, e), Xn && Iy(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof Y) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, l = Ry(this.node.content, o, r - t, i - t);
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
    let o = new My(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = Do(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == yt || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = rt;
  }
  updateOuterDeco(e) {
    if (Ni(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = _d(this.dom, this.nodeDOM, Ao(this.outerDeco, this.node, t), Ao(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function Ha(n, e, t, r, i) {
  Nd(r, e, n);
  let s = new jt(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class is extends jt {
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
    return this.dirty == yt || this.dirty != rt && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != rt || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = rt, !0);
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
    return new is(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = yt);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class Dd extends Xr {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == rt && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Oy extends jt {
  constructor(e, t, r, i, s, o, l, a, c, u) {
    super(e, t, r, i, s, o, l, c, u), this.spec = a;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == yt)
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
function Pd(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = ja(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(l, r);
    if (o instanceof wn) {
      let a = r ? r.previousSibling : n.lastChild;
      Pd(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = ja(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const vr = function(n) {
  n && (this.nodeName = n);
};
vr.prototype = /* @__PURE__ */ Object.create(null);
const an = [new vr()];
function Ao(n, e, t) {
  if (n.length == 0)
    return an;
  let r = t ? an[0] : new vr(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new vr(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && i.length == 1 && i.push(r = new vr(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function _d(n, e, t, r) {
  if (t == an && r == an)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], l = t[s];
    if (s) {
      let a;
      l && l.nodeName == o.nodeName && i != n && (a = i.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(i), l = an[0]), i = a;
    }
    Ay(i, l || an[0], o);
  }
  return i;
}
function Ay(n, e, t) {
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
function Nd(n, e, t) {
  return _d(n, n, an, Ao(e, t, n.nodeType != 1));
}
function Ni(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function ja(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Dy {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Py(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = rt, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
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
        let u = wn.create(this.top, e[o], t, r);
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
    return o.dirty == yt && o.dom == o.contentDOM && (o.dirty = ln), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (a instanceof jt) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != s)
          return !1;
        let u = a.dom, d, f = this.isLocked(u) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != yt && Ni(t, a.outerDeco));
        if (!f && a.update(e, t, r, i))
          return this.destroyBetween(this.index, l), a.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(a, e, t, r, i, o)))
          return this.destroyBetween(this.index, l), this.top.children[this.index] = d, d.contentDOM && (d.dirty = ln, d.updateChildren(i, o + 1), d.dirty = rt), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Ni(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let l = jt.create(this.top, t, r, i, s, o);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let a of l.children)
        a.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = jt.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new Ad(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof wn; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof is) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Pe || Me) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new Dd(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Py(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let l;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof wn)
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
function _y(n, e) {
  return n.type.side - e.type.side;
}
function Ny(n, e, t, r) {
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
        d.sort(_y);
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
      for (let y = 0; y < l.length; y++)
        l[y].to < g && (g = l[y].to);
      g < p && (a = f.cut(g - s), f = f.cut(0, g - s), p = g, h = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = f.isInline && !f.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(f, m, e.forChild(s, f), h), s = p;
  }
}
function Iy(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Ry(n, e, t, r) {
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
function Do(n, e, t, r, i) {
  let s = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, u = l += a.size;
    c >= t || u <= e ? s.push(a) : (c < e && s.push(a.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(a.slice(t - c, a.size, r)));
  }
  return s;
}
function yl(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (rs(t)) {
    for (a = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && j.isSelectable(d) && i.parent && !(d.isInline && ay(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new j(o == f ? l : r.resolve(f));
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
    c = vl(n, u, l, d);
  }
  return c;
}
function Id(n) {
  return n.editable ? n.hasFocus() : $d(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function At(n, e = !1) {
  let t = n.state.selection;
  if (Rd(n, t), !!Id(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Me) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && bn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      By(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      Ua && !(t instanceof Y) && (t.$from.parent.inlineContent || (s = Ka(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = Ka(n, t.to))), n.docView.setSelection(r, i, n, e), Ua && (s && Ja(s), o && Ja(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && $y(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const Ua = Pe || Me && xd < 63;
function Ka(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Pe && i && i.contentEditable == "false")
    return Hs(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return Hs(i);
    if (s)
      return Hs(s);
  }
}
function Hs(n) {
  return n.contentEditable = "true", Pe && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function Ja(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function $y(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!Id(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function By(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Te(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && We && Ht <= 11 && (t.disabled = !0, t.disabled = !1);
}
function Rd(n, e) {
  if (e instanceof j) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (Xa(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    Xa(n);
}
function Xa(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function vl(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || Y.between(e, t, r);
}
function Ya(n) {
  return n.editable && !n.hasFocus() ? !1 : $d(n);
}
function $d(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Ly(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return bn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Po(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && Q.findFrom(s, e);
}
function Lt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Ga(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Lt(n, new Y(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Po(n.state, e);
        return i && i instanceof j ? Lt(n, i) : !1;
      } else if (!(Qe && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let l = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? j.isSelectable(s) ? Lt(n, new j(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : Jr ? Lt(n, new Y(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof j && r.node.isInline)
      return Lt(n, new Y(e > 0 ? r.$to : r.$from));
    {
      let i = Po(n.state, e);
      return i ? Lt(n, i) : !1;
    }
  }
}
function Ii(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function br(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Nn(n, e) {
  return e < 0 ? Fy(n) : zy(n);
}
function Fy(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (nt && t.nodeType == 1 && r < Ii(t) && br(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (br(l, -1))
          i = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (Bd(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && br(l, -1); )
          i = t.parentNode, s = Te(l), l = l.previousSibling;
        if (l)
          t = l, r = Ii(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? _o(n, t, r) : i && _o(n, i, s);
}
function zy(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = Ii(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (br(l, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (Bd(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && br(l, 1); )
          s = l.parentNode, o = Te(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, i = Ii(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && _o(n, s, o);
}
function Bd(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Vy(n, e) {
  for (; n && e == n.childNodes.length && !Kr(n); )
    e = Te(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function qy(n, e) {
  for (; n && !e && !Kr(n); )
    e = Te(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function _o(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = Vy(e, t)) ? (e = o, t = 0) : (s = qy(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (rs(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && At(n);
  }, 50);
}
function Za(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Me || Sd) && t.parent.inlineContent) {
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
function Qa(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y && !r.empty || t.indexOf("s") > -1 || Qe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Po(n.state, e);
    if (o && o instanceof j)
      return Lt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, l = r instanceof qe ? Q.near(o, e) : Q.findFrom(o, e);
    return l ? Lt(n, l) : !1;
  }
  return !1;
}
function ec(n, e) {
  if (!(n.state.selection instanceof Y))
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
function tc(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function Wy(n) {
  if (!Pe || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    tc(n, r, "true"), setTimeout(() => tc(n, r, "false"), 20);
  }
  return !1;
}
function Hy(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function jy(n, e) {
  let t = e.keyCode, r = Hy(e);
  if (t == 8 || Qe && t == 72 && r == "c")
    return ec(n, -1) || Nn(n, -1);
  if (t == 46 && !e.shiftKey || Qe && t == 68 && r == "c")
    return ec(n, 1) || Nn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || Qe && t == 66 && r == "c") {
    let i = t == 37 ? Za(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Ga(n, i, r) || Nn(n, i);
  } else if (t == 39 || Qe && t == 70 && r == "c") {
    let i = t == 39 ? Za(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Ga(n, i, r) || Nn(n, i);
  } else {
    if (t == 38 || Qe && t == 80 && r == "c")
      return Qa(n, -1, r) || Nn(n, -1);
    if (t == 40 || Qe && t == 78 && r == "c")
      return Wy(n) || Qa(n, 1, r) || Nn(n, 1);
    if (r == (Qe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function bl(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || En.fromSchema(n.state.schema), l = Wd(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = qd[c.nodeName.toLowerCase()]); ) {
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
function Ld(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = !!e && (r || s || !t);
  if (a) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return l = new B(D.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        l = f(l, n, !0);
      }), l;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      l = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = En.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = Xy(t), Jr && Yy(o);
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
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || gr.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !Uy.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = Gy(nc(l, +u[1], +u[2]), u[4]);
  else if (l = B.maxOpen(Ky(l.content, i), !0), l.openStart || l.openEnd) {
    let d = 0, f = 0;
    for (let h = l.content.firstChild; d < l.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = l.content.lastChild; f < l.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    l = nc(l, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    l = d(l, n, a);
  }), l;
}
const Uy = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Ky(n, e) {
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
      if (c = o.length && s.length && zd(a, s, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Vd(o[o.length - 1], s.length));
        let u = Fd(l, a);
        o.push(u), i = i.matchType(u.type), s = a;
      }
    }), o)
      return D.from(o);
  }
  return n;
}
function Fd(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, D.from(n));
  return n;
}
function zd(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = zd(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(D.from(Fd(t, n, i + 1))));
  }
}
function Vd(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Vd(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(D.empty, !0);
  return n.copy(t.append(r));
}
function No(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (l = No(l, e, t, r, i + 1, s)), i >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, s <= i).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(D.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function nc(n, e, t) {
  return e < n.openStart && (n = new B(No(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new B(No(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const qd = {
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
let rc = null;
function Wd() {
  return rc || (rc = document.implementation.createHTMLDocument("title"));
}
let js = null;
function Jy(n) {
  let e = window.trustedTypes;
  return e ? (js || (js = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), js.createHTML(n)) : n;
}
function Xy(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Wd().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && qd[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = Jy(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function Yy(n) {
  let e = n.querySelectorAll(Me ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Gy(n, e) {
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
    i = D.from(a.create(r[l + 1], i)), s++, o++;
  }
  return new B(i, s, o);
}
const Re = {}, $e = {}, Zy = { touchstart: !0, touchmove: !0 };
class Qy {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function ev(n) {
  for (let e in Re) {
    let t = Re[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      nv(n, r) && !wl(n, r) && (n.editable || !(r.type in $e)) && t(n, r);
    }, Zy[e] ? { passive: !0 } : void 0);
  }
  Pe && n.dom.addEventListener("input", () => null), Io(n);
}
function Wt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function tv(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Io(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => wl(n, r));
  });
}
function wl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function nv(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function rv(n, e) {
  !wl(n, e) && Re[e.type] && (n.editable || !(e.type in $e)) && Re[e.type](n, e);
}
$e.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !jd(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Et && Me && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), Xn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, sn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || jy(n, t) ? t.preventDefault() : Wt(n, "key");
};
$e.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
$e.keypress = (n, e) => {
  let t = e;
  if (jd(n, t) || !t.charCode || t.ctrlKey && !t.altKey || Qe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof Y) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), s = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i, s)) && n.dispatch(s()), t.preventDefault();
  }
};
function ss(n) {
  return { left: n.clientX, top: n.clientY };
}
function iv(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function xl(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > s.depth ? l(n, t, s.nodeAfter, s.before(o), i, !0) : l(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function qn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function sv(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && j.isSelectable(r) ? (qn(n, new j(t)), !0) : !1;
}
function ov(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof j && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let l = o > s.depth ? s.nodeAfter : s.node(o);
    if (j.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (qn(n, j.create(n.state.doc, i)), !0) : !1;
}
function lv(n, e, t, r, i) {
  return xl(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? ov(n, t) : sv(n, t));
}
function av(n, e, t, r) {
  return xl(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function cv(n, e, t, r) {
  return xl(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || uv(n, t, r);
}
function uv(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (qn(n, Y.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), l = i.before(s);
    if (o.inlineContent)
      qn(n, Y.create(r, l + 1, l + 1 + o.content.size));
    else if (j.isSelectable(o))
      qn(n, j.create(r, l));
    else
      continue;
    return !0;
  }
}
function Sl(n) {
  return Ri(n);
}
const Hd = Qe ? "metaKey" : "ctrlKey";
Re.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Sl(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && iv(t, n.input.lastClick) && !t[Hd] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(ss(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new dv(n, o, t, !!r)) : (s == "doubleClick" ? av : cv)(n, o.pos, o.inside, t) ? t.preventDefault() : Wt(n, "pointer"));
};
class dv {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Hd], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof j && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && nt && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Wt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => At(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(ss(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Wt(this.view, "pointer") : lv(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Pe && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Me && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (qn(this.view, Q.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Wt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Wt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Re.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Sl(n), Wt(n, "pointer");
};
Re.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Wt(n, "pointer");
};
Re.contextmenu = (n) => Sl(n);
function jd(n, e) {
  return n.composing ? !0 : Pe && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const fv = Et ? 5e3 : -1;
$e.compositionstart = $e.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof Y && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Me && Sd && hv(n)))
      n.markCursor = n.state.storedMarks || t.marks(), Ri(n, !0), n.markCursor = null;
    else if (Ri(n, !e.selection.empty), nt && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  Ud(n, fv);
};
function hv(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
$e.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Ud(n, 20));
};
function Ud(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Ri(n), e));
}
function Kd(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = mv()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function pv(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = oy(e.focusNode, e.focusOffset), r = ly(e.focusNode, e.focusOffset);
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
function mv() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Ri(n, e = !1) {
  if (!(Et && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Kd(n), e || n.docView && n.docView.dirty) {
      let t = yl(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function gv(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Ar = We && Ht < 15 || Xn && dy < 604;
Re.copy = $e.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Ar ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = bl(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", a)) : gv(n, l), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function yv(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function vv(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Dr(n, r.value, null, i, e) : Dr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Dr(n, e, t, r, i) {
  let s = Ld(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, i, s || B.empty)))
    return !0;
  if (!s)
    return !1;
  let o = yv(s), l = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Jd(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
$e.paste = (n, e) => {
  let t = e;
  if (n.composing && !Et)
    return;
  let r = Ar ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Dr(n, Jd(r), r.getData("text/html"), i, t) ? t.preventDefault() : vv(n, t);
};
class Xd {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const bv = Qe ? "altKey" : "ctrlKey";
function Yd(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[bv];
}
Re.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(ss(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof j ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = j.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = j.create(n.state.doc, d.posBefore));
    }
  }
  let l = (o || n.state.selection).content(), { dom: a, text: c, slice: u } = bl(n, l);
  (!t.dataTransfer.files.length || !Me || xd > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Ar ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Ar || t.dataTransfer.setData("text/plain", c), n.dragging = new Xd(u, Yd(n, t), o);
};
Re.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
$e.dragover = $e.dragenter = (n, e) => e.preventDefault();
$e.drop = (n, e) => {
  try {
    wv(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function wv(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(ss(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = Ld(n, Jd(e.dataTransfer), Ar ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && Yd(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || B.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let l = s ? Mg(n.state.doc, i.pos, s) : i.pos;
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
  if (u && j.isSelectable(s.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(s.content.firstChild))
    a.setSelection(new j(f));
  else {
    let h = a.mapping.map(l);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((p, m, g, y) => h = y), a.setSelection(vl(n, f, a.doc.resolve(h)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
}
Re.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && At(n);
  }, 20));
};
Re.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
Re.beforeinput = (n, e) => {
  if (Me && Et && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, sn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in $e)
  Re[n] = $e[n];
function Pr(n, e) {
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
class $i {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || hn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new ze(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof $i && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Pr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Ut {
  constructor(e, t) {
    this.attrs = e, this.spec = t || hn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new ze(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Ut && Pr(this.attrs, e.attrs) && Pr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Ut;
  }
  destroy() {
  }
}
class kl {
  constructor(e, t) {
    this.attrs = e, this.spec = t || hn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new ze(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof kl && Pr(this.attrs, e.attrs) && Pr(this.spec, e.spec);
  }
  destroy() {
  }
}
class ze {
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
    return new ze(e, t, this.type);
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
    return new ze(e, e, new $i(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new ze(e, t, new Ut(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new ze(e, t, new kl(r, i));
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
    return this.type instanceof Ut;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof $i;
  }
}
const Ln = [], hn = {};
class ae {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Ln, this.children = t.length ? t : Ln;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Bi(t, e, 0, hn) : De;
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
    return this == De || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || hn);
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
    return this.children.length ? xv(this.children, o || [], e, t, r, i, s) : o ? new ae(o.sort(pn), Ln) : De;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == De ? ae.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (u = Zd(t, l, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < a; )
          s += 3;
        i[s] == a ? i[s + 2] = i[s + 2].addInner(l, u, c + 1) : i.splice(s, 0, a, a + l.nodeSize, Bi(u, l, c + 1, hn)), s += 3;
      }
    });
    let o = Gd(s ? Qd(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new ae(o.length ? this.local.concat(o).sort(pn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == De ? this : this.removeInner(e, 0);
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
      c != De ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let l = 0; l < i.length; l++)
            i[l].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new ae(i, r) : De;
  }
  forChild(e, t) {
    if (this == De)
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
      if (a.from < o && a.to > s && a.type instanceof Ut) {
        let c = Math.max(s, a.from) - s, u = Math.min(o, a.to) - s;
        c < u && (i || (i = [])).push(a.copy(c, u));
      }
    }
    if (i) {
      let l = new ae(i.sort(pn), Ln);
      return r ? new zt([l, r]) : l;
    }
    return r || De;
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
    return Cl(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == De)
      return Ln;
    if (e.inlineContent || !this.local.some(Ut.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Ut || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
ae.empty = new ae([], []);
ae.removeOverlap = Cl;
const De = ae.empty;
class zt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, hn));
    return zt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return ae.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != De && (s instanceof zt ? r = r.concat(s.members) : r.push(s));
    }
    return zt.from(r);
  }
  eq(e) {
    if (!(e instanceof zt) || e.members.length != this.members.length)
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
    return t ? Cl(r ? t : t.sort(pn)) : Ln;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return De;
      case 1:
        return e[0];
      default:
        return new zt(e.every((t) => t instanceof ae) ? e : e.reduce((t, r) => t.concat(r instanceof ae ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function xv(n, e, t, r, i, s, o) {
  let l = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let y = 0; y < l.length; y += 3) {
        let w = l[y + 1];
        if (w < 0 || f > w + u - d)
          continue;
        let S = l[y] + u - d;
        h >= S ? l[y + 1] = f <= S ? -2 : -1 : f >= u && g && (l[y] += g, l[y + 1] += g);
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
        let y = l[c + 2].mapInner(t, g, u + 1, n[c] + s + 1, o);
        y != De ? (l[c] = d, l[c + 1] = h, l[c + 2] = y) : (l[c + 1] = -2, a = !0);
      } else
        a = !0;
    }
  if (a) {
    let c = Sv(l, n, e, t, i, s, o), u = Bi(c, r, 0, o);
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
  return new ae(e.sort(pn), l);
}
function Gd(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new ze(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Sv(n, e, t, r, i, s, o) {
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
function Zd(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Qd(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Bi(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((l, a) => {
    let c = Zd(n, l, a + t);
    if (c) {
      s = !0;
      let u = Bi(c, l, t + a + 1, r);
      u != De && i.push(a, a + l.nodeSize, u);
    }
  });
  let o = Gd(s ? Qd(n) : n, -t).sort(pn);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || i.length ? new ae(o, i) : De;
}
function pn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Cl(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), ic(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), ic(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ic(n, e, t) {
  for (; e < n.length && pn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Us(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != De && e.push(r);
  }), n.cursorWrapper && e.push(ae.create(n.state.doc, [n.cursorWrapper.deco])), zt.from(e);
}
const kv = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Cv = We && Ht <= 11;
class Tv {
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
class Ev {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Tv(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      We && Ht <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Pe && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), Cv && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, kv)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (Ya(this.view)) {
      if (this.suppressingSelectionUpdates)
        return At(this.view);
      if (We && Ht <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && bn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = Jn(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = Jn(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && Ya(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, l = !1, a = [];
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
    } else if (nt && a.length) {
      let u = a.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || Av(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && rs(r) && (c = yl(e)) && c.eq(Q.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, At(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), Mv(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Dv(e, a)), this.handleDOMChange(s, o, l, a), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || At(e), this.currentSelection.set(r));
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
      if (We && Ht <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? Te(i) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = s && s.parentNode == e.target ? Te(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
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
let sc = /* @__PURE__ */ new WeakMap(), oc = !1;
function Mv(n) {
  if (!sc.has(n) && (sc.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = nt, oc)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), oc = !0;
  }
}
function lc(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return bn(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function Ov(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return lc(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? lc(n, t) : null;
}
function Av(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Dv(n, e) {
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
function Pv(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelectionRange(), c, u = a.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: a.anchorOffset }], rs(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), Me && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let y = r.childNodes[g - 1], w = y.pmViewDesc;
      if (y.nodeName == "BR" && !w) {
        s = g;
        break;
      }
      if (!w || w.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || gr.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: _v,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: l };
}
function _v(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Pe && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Pe && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Nv = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Iv(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let x = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, E = yl(n, x);
    if (E && !n.state.selection.eq(E)) {
      if (Me && Et && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (M) => M(n, sn(13, "Enter"))))
        return;
      let T = n.state.tr.setSelection(E);
      x == "pointer" ? T.setMeta("pointer", !0) : x == "key" && T.scrollIntoView(), s && T.setMeta("composition", s), n.dispatch(T);
    }
    return;
  }
  let o = n.state.doc.resolve(e), l = o.sharedDepth(t);
  e = o.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let a = n.state.selection, c = Pv(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = Bv(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (Xn && n.input.lastIOSEnter > Date.now() - 225 || Et) && i.some((x) => x.nodeType == 1 && !Nv.test(x.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (x) => x(n, sn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof Y && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let x = ac(n, n.state.doc, c.sel);
        if (x && !x.eq(n.state.selection)) {
          let E = n.state.tr.setSelection(x);
          s && E.setMeta("composition", s), n.dispatch(E);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof Y && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), We && Ht <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = u.resolve(p.start), w = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA;
  if ((Xn && n.input.lastIOSEnter > Date.now() - 225 && (!w || i.some((x) => x.nodeName == "DIV" || x.nodeName == "P")) || !w && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (x) => x(n, sn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && $v(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (x) => x(n, sn(8, "Backspace")))) {
    Et && Me && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Me && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Et && !w && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(x) {
      return x(n, sn(13, "Enter"));
    });
  }, 20));
  let S = p.start, b = p.endA, k = (x) => {
    let E = x || n.state.tr.replace(S, b, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let T = ac(n, E.doc, c.sel);
      T && !(Me && n.composing && T.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (T.head == S || T.head == E.mapping.map(b) - 1) || We && T.empty && T.head == S) && E.setSelection(T);
    }
    return s && E.setMeta("composition", s), E.scrollIntoView();
  }, C;
  if (w)
    if (m.pos == g.pos) {
      We && Ht <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => At(n), 20));
      let x = k(n.state.tr.delete(S, b)), E = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      E && x.ensureMarks(E), n.dispatch(x);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (C = Rv(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    ) {
      let x = k(n.state.tr);
      C.type == "add" ? x.addMark(S, b, C.mark) : x.removeMark(S, b, C.mark), n.dispatch(x);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let x = m.parent.textBetween(m.parentOffset, g.parentOffset), E = () => k(n.state.tr.insertText(x, S, b));
      n.someProp("handleTextInput", (T) => T(n, S, b, x, E)) || n.dispatch(E());
    } else
      n.dispatch(k());
  else
    n.dispatch(k());
}
function ac(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : vl(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Rv(n, e) {
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
  if (D.from(c).eq(n))
    return { mark: l, type: o };
}
function $v(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Ks(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let l = s.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(Ks(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Ks(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Ks(n, e, t) {
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
function Bv(n, e, t, r, i) {
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
    s -= a, s && s < e.size && cc(e.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), l = s + (l - o), o = s;
  } else if (l < s) {
    let a = r <= s && r >= l ? s - r : 0;
    s -= a, s && s < n.size && cc(n.textBetween(s - 1, s + 1)) && (s += a ? 1 : -1), o = s + (o - l), l = s;
  }
  return { start: s, endA: o, endB: l };
}
function cc(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class ef {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Qy(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(pc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = fc(this), dc(this), this.nodeViews = hc(this), this.docView = Ha(this.state.doc, uc(this), Us(this), this.dom, this), this.domObserver = new Ev(this, (r, i, s, o) => Iv(this, r, i, s, o)), this.domObserver.start(), ev(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && Io(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(pc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (Kd(this), o = !0), this.state = e;
    let l = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = hc(this);
      Fv(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Io(this), this.editable = fc(this), dc(this);
    let a = Us(this), c = uc(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, a);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && py(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (We || Me) && !this.composing && !i.selection.empty && !e.selection.empty && Lv(i.selection, e.selection);
      if (d) {
        let p = Me ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = pv(this)), (s || !this.docView.update(e.doc, c, a, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = Ha(e.doc, c, a, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Ly(this)) ? At(this, h) : (Rd(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && my(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof j) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && La(this, t.getBoundingClientRect(), e);
      } else
        La(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new Xd(e.slice, e.move, i < 0 ? void 0 : j.create(this.state.doc, i));
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
    if (We) {
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
    this.domObserver.stop(), this.editable && gy(this.dom), At(this), this.domObserver.start();
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
    return xy(this, e);
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
    return Md(this, e, t);
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
    return Ey(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Dr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Dr(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return bl(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (tv(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Us(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, iy());
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
    return rv(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Pe && this.root.nodeType === 11 && cy(this.dom.ownerDocument) == this.dom && Ov(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
ef.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function uc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [ze.node(0, n.state.doc.content.size, e)];
}
function dc(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: ze.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function fc(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Lv(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function hc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Fv(n, e) {
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
function pc(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var Jt = {
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
}, Li = {
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
}, zv = typeof navigator < "u" && /Mac/.test(navigator.platform), Vv = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ee = 0; Ee < 10; Ee++) Jt[48 + Ee] = Jt[96 + Ee] = String(Ee);
for (var Ee = 1; Ee <= 24; Ee++) Jt[Ee + 111] = "F" + Ee;
for (var Ee = 65; Ee <= 90; Ee++)
  Jt[Ee] = String.fromCharCode(Ee + 32), Li[Ee] = String.fromCharCode(Ee);
for (var Js in Jt) Li.hasOwnProperty(Js) || (Li[Js] = Jt[Js]);
function qv(n) {
  var e = zv && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Vv && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Li : Jt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Wv = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Hv = typeof navigator < "u" && /Win/.test(navigator.platform);
function jv(n) {
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
      Wv ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function Uv(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[jv(t)] = n[t];
  return e;
}
function Xs(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Kv(n) {
  return new Ae({ props: { handleKeyDown: Jv(n) } });
}
function Jv(n) {
  let e = Uv(n);
  return function(t, r) {
    let i = qv(r), s, o = e[Xs(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let l = e[Xs(i, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(Hv && r.ctrlKey && r.altKey) && (s = Jt[r.keyCode]) && s != i) {
        let l = e[Xs(s, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var Xv = Object.defineProperty, Tl = (n, e) => {
  for (var t in e)
    Xv(n, t, { get: e[t], enumerable: !0 });
};
function ls(n) {
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
var as = class {
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
      state: ls({
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
}, tf = {};
Tl(tf, {
  blur: () => Yv,
  clearContent: () => Gv,
  clearNodes: () => Zv,
  command: () => Qv,
  createParagraphNear: () => eb,
  cut: () => tb,
  deleteCurrentNode: () => nb,
  deleteNode: () => rb,
  deleteRange: () => ib,
  deleteSelection: () => sb,
  enter: () => ob,
  exitCode: () => lb,
  extendMarkRange: () => ab,
  first: () => cb,
  focus: () => db,
  forEach: () => fb,
  insertContent: () => hb,
  insertContentAt: () => gb,
  joinBackward: () => bb,
  joinDown: () => vb,
  joinForward: () => wb,
  joinItemBackward: () => xb,
  joinItemForward: () => Sb,
  joinTextblockBackward: () => kb,
  joinTextblockForward: () => Cb,
  joinUp: () => yb,
  keyboardShortcut: () => Eb,
  lift: () => Mb,
  liftEmptyBlock: () => Ob,
  liftListItem: () => Ab,
  newlineInCode: () => Db,
  resetAttributes: () => Pb,
  scrollIntoView: () => _b,
  selectAll: () => Nb,
  selectNodeBackward: () => Ib,
  selectNodeForward: () => Rb,
  selectParentNode: () => $b,
  selectTextblockEnd: () => Bb,
  selectTextblockStart: () => Lb,
  setContent: () => Fb,
  setMark: () => i0,
  setMeta: () => s0,
  setNode: () => o0,
  setNodeSelection: () => l0,
  setTextDirection: () => a0,
  setTextSelection: () => c0,
  sinkListItem: () => u0,
  splitBlock: () => d0,
  splitListItem: () => f0,
  toggleList: () => h0,
  toggleMark: () => p0,
  toggleNode: () => m0,
  toggleWrap: () => g0,
  undoInputRule: () => y0,
  unsetAllMarks: () => v0,
  unsetMark: () => b0,
  unsetTextDirection: () => w0,
  updateAttributes: () => x0,
  wrapIn: () => S0,
  wrapInList: () => k0
});
var Yv = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), Gv = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), Zv = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(a)), f = c.resolve(u.map(a + l.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = nr(h);
      if (l.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, Qv = (n) => (e) => n(e), eb = () => ({ state: n, dispatch: e }) => gd(n, e), tb = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new Y(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, nb = () => ({ tr: n, dispatch: e }) => {
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
function xe(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var rb = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = xe(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const a = s.before(o), c = s.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, ib = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, sb = () => ({ state: n, dispatch: e }) => dl(n, e), ob = () => ({ commands: n }) => n.keyboardShortcut("Enter"), lb = () => ({ state: n, dispatch: e }) => Wg(n, e);
function El(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function Fi(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : El(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function nf(n, e, t = {}) {
  return n.find((r) => r.type === e && Fi(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function mc(n, e, t = {}) {
  return !!nf(n, e, t);
}
function rf(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !nf([...i.node.marks], e, t)))
    return;
  let o = i.index, l = n.start() + i.offset, a = o + 1, c = l + i.node.nodeSize;
  for (; o > 0 && mc([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, l -= n.parent.child(o).nodeSize;
  for (; a < n.parent.childCount && mc([...n.parent.child(a).marks], e, t); )
    c += n.parent.child(a).nodeSize, a += 1;
  return {
    from: l,
    to: c
  };
}
function It(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var ab = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = It(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: u } = l;
  if (i) {
    const d = rf(a, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = Y.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, cb = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function sf(n) {
  return n instanceof Y;
}
function cn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function of(n, e = null) {
  if (!e)
    return null;
  const t = Q.atStart(n), r = Q.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? Y.create(n, cn(0, i, s), cn(n.content.size, i, s)) : Y.create(n, cn(e, i, s), cn(e, i, s));
}
function Ro() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function _r() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function ub() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var db = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (_r() || Ro()) && r.dom.focus(), ub() && !_r() && !Ro() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !sf(t.state.selection))
    return o(), !0;
  const l = of(i.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return s && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, fb = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), hb = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), lf = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && lf(r);
  }
  return n;
};
function ri(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return lf(t);
}
function Nr(n, e, t) {
  if (n instanceof Mt || n instanceof D)
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
        return D.fromArray(n.map((l) => e.nodeFromJSON(l)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (s) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), Nr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, l = "";
      const a = new Wu({
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
      if (t.slice ? gr.fromSchema(a).parseSlice(ri(n), t.parseOptions) : gr.fromSchema(a).parse(ri(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${l}`)
        });
    }
    const s = gr.fromSchema(e);
    return t.slice ? s.parseSlice(ri(n), t.parseOptions).content : s.parse(ri(n), t.parseOptions);
  }
  return Nr("", e, t);
}
function pb(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof be || i instanceof we))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
var mb = (n) => !("type" in n), gb = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
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
        Nr(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        a(g);
      }
    try {
      l = Nr(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return a(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((mb(l) ? l : [l]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof D) {
        let g = "";
        e.forEach((y) => {
          y.text && (g += y.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = l;
      const g = r.doc.resolve(u), y = g.node(), w = g.parentOffset === 0, S = y.isText || y.isTextblock, b = y.content.size > 0;
      w && S && b && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && pb(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, yb = () => ({ state: n, dispatch: e }) => zg(n, e), vb = () => ({ state: n, dispatch: e }) => Vg(n, e), bb = () => ({ state: n, dispatch: e }) => cd(n, e), wb = () => ({ state: n, dispatch: e }) => hd(n, e), xb = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = es(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Sb = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = es(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, kb = () => ({ state: n, dispatch: e }) => Lg(n, e), Cb = () => ({ state: n, dispatch: e }) => Fg(n, e);
function af() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Tb(n) {
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
      _r() || af() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var Eb = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = Tb(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
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
function Ir(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? xe(e, n.schema) : null, l = [];
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
  const a = i - r, c = l.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => Fi(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= a;
}
var Mb = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return Ir(t, i, e) ? qg(t, r) : !1;
}, Ob = () => ({ state: n, dispatch: e }) => yd(n, e), Ab = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return ey(r)(e, t);
}, Db = () => ({ state: n, dispatch: e }) => md(n, e);
function cs(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function gc(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var Pb = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = cs(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (s = xe(n, r.schema)), l === "mark" && (o = It(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (a = !0, i && t.setNodeMarkup(d, void 0, gc(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (a = !0, i && t.addMark(d, d + u.nodeSize, o.create(gc(f.attrs, e))));
      });
    });
  }), a;
}, _b = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Nb = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new qe(n.doc);
    n.setSelection(t);
  }
  return !0;
}, Ib = () => ({ state: n, dispatch: e }) => dd(n, e), Rb = () => ({ state: n, dispatch: e }) => pd(n, e), $b = () => ({ state: n, dispatch: e }) => Ug(n, e), Bb = () => ({ state: n, dispatch: e }) => Xg(n, e), Lb = () => ({ state: n, dispatch: e }) => Jg(n, e);
function $o(n, e, t = {}, r = {}) {
  return Nr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var Fb = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: l }) => {
  const { doc: a } = s;
  if (r.preserveWhitespace !== "full") {
    const c = $o(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, a.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), l.insertContentAt({ from: 0, to: a.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function cf(n, e) {
  const t = It(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function zb(n, e) {
  const t = new sd(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function Vb(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function qb(n, e) {
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
function Ml(n) {
  return (e) => qb(e.$from, n);
}
function H(n, e, t) {
  return n.config[e] === void 0 && n.parent ? H(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? H(n.parent, e, t) : null
  }) : n.config[e];
}
function Ol(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = H(e, "addExtensions", t);
    return r ? [e, ...Ol(r())] : e;
  }).flat(10);
}
function Al(n, e) {
  const t = En.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function uf(n) {
  return typeof n == "function";
}
function ue(n, e = void 0, ...t) {
  return uf(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Wb(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Yn(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function df(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = Yn(n), i = [...t, ...r], s = {
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
    }, d = H(
      c,
      "addGlobalAttributes",
      u
    );
    if (!d)
      return;
    d().forEach((h) => {
      let p;
      Array.isArray(h.types) ? p = h.types : h.types === "*" ? p = a : h.types === "nodes" ? p = o : h.types === "marks" ? p = l : p = [], p.forEach((m) => {
        Object.entries(h.attributes).forEach(([g, y]) => {
          e.push({
            type: m,
            name: g,
            attribute: {
              ...s,
              ...y
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
    }, d = H(
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
function Hb(n) {
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
function yc(n) {
  const e = [], t = Hb(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const l = s.slice(0, o).trim(), a = s.slice(o + 1).trim();
    l && a && e.push([l, a]);
  }
  return e;
}
function ff(...n) {
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
        const l = new Map([...yc(r[i]), ...yc(s)]);
        r[i] = Array.from(l.entries()).map(([a, c]) => `${a}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function zi(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => ff(t, r), {});
}
function jb(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function vc(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : jb(t.getAttribute(o.name));
        return l == null ? s : {
          ...s,
          [o.name]: l
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function bc(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && Wb(t) ? !1 : t != null)
  );
}
function wc(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function hf(n, e) {
  var t;
  const r = df(n), { nodeExtensions: i, markExtensions: s } = Yn(n), o = (t = i.find((c) => H(c, "topNode"))) == null ? void 0 : t.name, l = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((y) => y.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((y, w) => {
        const S = H(w, "extendNodeSchema", d);
        return {
          ...y,
          ...S ? S(c) : {}
        };
      }, {}), h = bc({
        ...f,
        content: ue(H(c, "content", d)),
        marks: ue(H(c, "marks", d)),
        group: ue(H(c, "group", d)),
        inline: ue(H(c, "inline", d)),
        atom: ue(H(c, "atom", d)),
        selectable: ue(H(c, "selectable", d)),
        draggable: ue(H(c, "draggable", d)),
        code: ue(H(c, "code", d)),
        whitespace: ue(H(c, "whitespace", d)),
        linebreakReplacement: ue(
          H(c, "linebreakReplacement", d)
        ),
        defining: ue(H(c, "defining", d)),
        isolating: ue(H(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(wc))
      }), p = ue(H(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (y) => vc(y, u)
      ));
      const m = H(c, "renderHTML", d);
      m && (h.toDOM = (y) => m({
        node: y,
        HTMLAttributes: zi(y, u)
      }));
      const g = H(c, "renderText", d);
      return g && (h.toText = g), [c.name, h];
    })
  ), a = Object.fromEntries(
    s.map((c) => {
      const u = r.filter((g) => g.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((g, y) => {
        const w = H(y, "extendMarkSchema", d);
        return {
          ...g,
          ...w ? w(c) : {}
        };
      }, {}), h = bc({
        ...f,
        inclusive: ue(H(c, "inclusive", d)),
        excludes: ue(H(c, "excludes", d)),
        group: ue(H(c, "group", d)),
        spanning: ue(H(c, "spanning", d)),
        code: ue(H(c, "code", d)),
        attrs: Object.fromEntries(u.map(wc))
      }), p = ue(H(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => vc(g, u)
      ));
      const m = H(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: zi(g, u)
      })), [c.name, h];
    })
  );
  return new Wu({
    topNode: o,
    nodes: l,
    marks: a
  });
}
function Ub(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function wr(n) {
  return n.sort((t, r) => {
    const i = H(t, "priority") || 100, s = H(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function Dl(n) {
  const e = wr(Ol(n)), t = Ub(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function Kb(n, e) {
  const t = Dl(n);
  return hf(t, e);
}
function pf(n, e, t) {
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
function Jb(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return pf(n, t, e);
}
function mf(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function Xb(n, e) {
  const t = xe(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (l) => {
    s.push(l);
  });
  const o = s.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function Yb(n, e) {
  const t = cs(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? Xb(n, e) : t === "mark" ? cf(n, e) : {};
}
function Gb(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function Zb(n) {
  const e = Gb(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function Qb(n) {
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
  }), Zb(r);
}
function ar(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function yi(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var e0 = (n, e = 500) => {
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
function Bo(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? It(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => Fi(d.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(h, g), w = Math.min(p, g + m.nodeSize), S = w - y;
      o += S, l.push(
        ...m.marks.map((b) => ({
          mark: b,
          from: y,
          to: w
        }))
      );
    });
  }), o === 0)
    return !1;
  const a = l.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => Fi(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = l.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
function t0(n, e, t = {}) {
  if (!e)
    return Ir(n, null, t) || Bo(n, null, t);
  const r = cs(e, n.schema);
  return r === "node" ? Ir(n, e, t) : r === "mark" ? Bo(n, e, t) : !1;
}
function xc(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Sc(n, e) {
  const { nodeExtensions: t } = Yn(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = ue(H(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Pl(n, {
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
      i !== !1 && (Pl(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var _l = class gf {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new gf(e.position);
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
function yf(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new _l(t.pos),
    mapResult: t
  };
}
function n0(n) {
  return new _l(n);
}
function r0(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (sf(i) && (s = i.$cursor), s) {
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
var i0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: l } = s, a = It(n, r.schema);
  if (i)
    if (o) {
      const c = cf(r, a);
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
          f.marks.find((y) => y.type === a) ? f.marks.forEach((y) => {
            a === y.type && t.addMark(
              p,
              m,
              a.create({
                ...y.attrs,
                ...e
              })
            );
          }) : t.addMark(p, m, a.create(e));
        });
      });
  return r0(r, t, a);
}, s0 = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), o0 = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = xe(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: l }) => Ra(s, { ...o, ...e })(t) ? !0 : l.clearNodes()).command(({ state: l }) => Ra(s, { ...o, ...e })(l, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, l0 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = cn(n, 0, r.content.size), s = j.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, a0 = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, l;
  return typeof e == "number" ? (o = e, l = e) : e && "from" in e && "to" in e ? (o = e.from, l = e.to) : (o = s.from, l = s.to), i && t.doc.nodesBetween(o, l, (a, c) => {
    a.isText || t.setNodeMarkup(c, void 0, {
      ...a.attrs,
      dir: n
    });
  }), !0;
}, c0 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = Y.atStart(r).from, l = Y.atEnd(r).to, a = cn(i, o, l), c = cn(s, o, l), u = Y.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, u0 = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return ry(r)(e, t);
};
function kc(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var d0 = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: l, $to: a } = s, c = i.extensionManager.attributes, u = yi(c, l.node().type.name, l.node().attrs);
  if (s instanceof j && s.node.isBlock)
    return !l.parentOffset || !Ot(o, l.pos) ? !1 : (r && (n && kc(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  const d = a.parentOffset === a.parent.content.size, f = l.depth === 0 ? void 0 : Vb(l.node(-1).contentMatchAt(l.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Ot(e.doc, e.mapping.map(l.pos), 1, h);
  if (!h && !p && Ot(e.doc, e.mapping.map(l.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof Y && e.deleteSelection(), e.split(e.mapping.map(l.pos), 1, h), f && !d && !l.parentOffset && l.parent.type !== f)) {
      const m = e.mapping.map(l.before()), g = e.doc.resolve(m);
      l.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(l.before()), f);
    }
    n && kc(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, f0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const l = xe(n, r.schema), { $from: a, $to: c } = r.selection, u = r.selection.node;
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
      let y = D.empty;
      const w = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let E = a.depth - w; E >= a.depth - 3; E -= 1)
        y = D.from(a.node(E).copy(y));
      const S = (
        // eslint-disable-next-line no-nested-ternary
        a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3
      ), b = {
        ...yi(f, a.node().type.name, a.node().attrs),
        ...e
      }, k = ((o = l.contentMatch.defaultType) == null ? void 0 : o.createAndFill(b)) || void 0;
      y = y.append(D.from(l.createAndFill(null, k) || void 0));
      const C = a.before(a.depth - (w - 1));
      t.replace(C, a.after(-S), new B(y, 4 - w, 0));
      let x = -1;
      t.doc.nodesBetween(C, t.doc.content.size, (E, T) => {
        if (x > -1)
          return !1;
        E.isTextblock && E.content.size === 0 && (x = T + 1);
      }), x > -1 && t.setSelection(Y.near(t.doc.resolve(x))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === a.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...yi(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...yi(f, a.node().type.name, a.node().attrs),
    ...e
  };
  t.delete(a.pos, c.pos);
  const g = h ? [
    { type: l, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: l, attrs: p }];
  if (!Ot(t.doc, a.pos, 2))
    return !1;
  if (i) {
    const { selection: y, storedMarks: w } = r, { splittableMarks: S } = s.extensionManager, b = w || y.$to.parentOffset && y.$from.marks();
    if (t.split(a.pos, 2, g).scrollIntoView(), !b || !i)
      return !0;
    const k = b.filter((C) => S.includes(C.type.name));
    t.ensureMarks(k);
  }
  return !0;
}, Ys = (n, e) => {
  const t = Ml((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Mn(n.doc, t.pos) && n.join(t.pos), !0;
}, Gs = (n, e) => {
  const t = Ml((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Mn(n.doc, r) && n.join(r), !0;
}, h0 = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: l, chain: a, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = xe(n, o.schema), p = xe(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: w } = m, S = y.blockRange(w), b = g || m.$to.parentOffset && m.$from.marks();
  if (!S)
    return !1;
  const k = Ml((C) => Sc(C.type.name, d))(m);
  if (S.depth >= 1 && k && S.depth - k.depth <= 1) {
    if (k.node.type === h)
      return c.liftListItem(p);
    if (Sc(k.node.type.name, d) && h.validContent(k.node.content) && l)
      return a().command(() => (s.setNodeMarkup(k.pos, h), !0)).command(() => Ys(s, h)).command(() => Gs(s, h)).run();
  }
  return !t || !b || !l ? a().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => Ys(s, h)).command(() => Gs(s, h)).run() : a().command(() => {
    const C = u().wrapInList(h, r), x = b.filter((E) => f.includes(E.type.name));
    return s.ensureMarks(x), C ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => Ys(s, h)).command(() => Gs(s, h)).run();
}, p0 = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = It(n, r.schema);
  return Bo(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, m0 = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = xe(n, r.schema), o = xe(e, r.schema), l = Ir(r, s, t);
  let a;
  return r.selection.$anchor.sameParent(r.selection.$head) && (a = r.selection.$anchor.parent.attrs), l ? i.setNode(o, a) : i.setNode(s, { ...a, ...t });
}, g0 = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = xe(n, t.schema);
  return Ir(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, y0 = () => ({ state: n, dispatch: e }) => {
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
}, v0 = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, b0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = It(n, r.schema), { $from: c, empty: u, ranges: d } = l;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = l;
    const p = (s = c.marks().find((g) => g.type === a)) == null ? void 0 : s.attrs, m = rf(c, a, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, a);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, w0 = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (l, a) => {
    if (l.isText)
      return;
    const c = { ...l.attrs };
    delete c.dir, e.setNodeMarkup(a, void 0, c);
  }), !0;
}, x0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = cs(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!l)
    return !1;
  l === "node" && (s = xe(n, r.schema)), l === "mark" && (o = It(n, r.schema));
  let a = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let f, h, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, y) => {
      s && s === g.type && (a = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g);
    }) : r.doc.nodesBetween(u, d, (g, y) => {
      y < u && s && s === g.type && (a = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g), y >= u && y <= d && (s && s === g.type && (a = !0, i && t.setNodeMarkup(y, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((w) => {
        if (o === w.type && (a = !0, i)) {
          const S = Math.max(y, u), b = Math.min(y + g.nodeSize, d);
          t.addMark(
            S,
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
}, S0 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return Yg(i, e)(t, r);
}, k0 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return Gg(i, e)(t, r);
}, C0 = class {
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
}, T0 = (n, e) => {
  if (El(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function ii(n) {
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
  const d = e0(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = T0(d, f.find);
    if (!h)
      return;
    const p = a.state.tr, m = ls({
      state: a.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: y, chain: w, can: S } = new as({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: y,
      chain: w,
      can: S
    }) === null || !p.steps.length || (f.undoable && p.setMeta(l, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), a.dispatch(p), u = !0);
  }), u;
}
function E0(n) {
  const { editor: e, rules: t } = n, r = new Ae({
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
          typeof u == "string" ? u = u : u = Al(D.from(u), o.schema);
          const { from: d } = a, f = d + u.length;
          ii({
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
        return ii({
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
          s && ii({
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
        return o ? ii({
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
function M0(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function si(n) {
  return M0(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function vf(n, e) {
  const t = { ...n };
  return si(n) && si(e) && Object.keys(e).forEach((r) => {
    si(e[r]) && si(n[r]) ? t[r] = vf(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var Nl = class {
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
      ...ue(
        H(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...ue(
        H(this, "addStorage", {
          name: this.name,
          options: this.options
        })
      ) || {}
    };
  }
  configure(n = {}) {
    const e = this.extend({
      ...this.config,
      addOptions: () => vf(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, O0 = class bf extends Nl {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new bf(t);
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
function A0(n) {
  return typeof n == "number";
}
var D0 = (n, e, t) => {
  if (El(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function P0(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: l } = n, { commands: a, chain: c, can: u } = new as({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, y, w, S;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const b = (S = (w = (y = h.content) == null ? void 0 : y.size) != null ? w : h.nodeSize) != null ? S : 0, k = Math.max(r, p), C = Math.min(i, p + b);
    if (k >= C)
      return;
    const x = h.isText ? h.text || "" : h.textBetween(k - p, C - p, void 0, "￼");
    D0(x, s.find, o).forEach((T) => {
      if (T.index === void 0)
        return;
      const M = k + T.index + 1, I = M + T[0].length, R = {
        from: t.tr.mapping.map(M),
        to: t.tr.mapping.map(I)
      }, q = s.handler({
        state: t,
        range: R,
        match: T,
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
var oi = null, _0 = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function N0(n) {
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
    const m = u.tr, g = ls({
      state: u,
      transaction: m
    });
    if (!(!P0({
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
  return t.map((u) => new Ae({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (oi = e);
      }, h = () => {
        oi && (oi = null);
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
            const h = oi;
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
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, y = p.getMeta("applyPasteRules"), w = !!y;
      if (!m && !g && !w)
        return;
      if (w) {
        let { text: k } = y;
        typeof k == "string" ? k = k : k = Al(D.from(k), h.schema);
        const { from: C } = y, x = C + k.length, E = _0(k);
        return a({
          rule: u,
          state: h,
          from: C,
          to: { b: x },
          pasteEvt: E
        });
      }
      const S = f.doc.content.findDiffStart(h.doc.content), b = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!A0(S) || !b || S === b.b))
        return a({
          rule: u,
          state: h,
          from: S,
          to: b,
          pasteEvt: o
        });
    }
  }));
}
var us = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = Dl(n), this.schema = hf(this.extensions, e), this.setupExtensions();
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
        type: ar(e.name, this.schema)
      }, r = H(e, "addCommands", t);
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
    return wr([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: ar(r.name, this.schema)
      }, s = [], o = H(
        r,
        "addKeyboardShortcuts",
        i
      );
      let l = {};
      if (r.type === "mark" && H(r, "exitable", i) && (l.ArrowRight = () => O0.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        l = { ...l, ...f };
      }
      const a = Kv(l);
      s.push(a);
      const c = H(r, "addInputRules", i);
      if (xc(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = E0({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = H(r, "addPasteRules", i);
      if (xc(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = N0({ editor: n, rules: f });
          s.push(...h);
        }
      }
      const d = H(
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
    return df(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = Yn(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!H(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: xe(t.name, this.schema)
        }, s = H(t, "addNodeView", i);
        if (!s)
          return [];
        const o = s();
        if (!o)
          return [];
        const l = (a, c, u, d, f) => {
          const h = zi(a, r);
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
    return wr([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: ar(i.name, this.schema)
      }, o = H(
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
    return wr([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: ar(i.name, this.schema)
        }, o = H(
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
    const { editor: n } = this, { markExtensions: e } = Yn(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!H(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: It(t.name, this.schema)
        }, s = H(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (l, a, c) => {
          const u = zi(l, r);
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
              K0(l, n, d);
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
        type: ar(e.name, this.schema)
      };
      e.type === "mark" && ((t = ue(H(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = H(e, "onBeforeCreate", r), s = H(e, "onCreate", r), o = H(e, "onUpdate", r), l = H(
        e,
        "onSelectionUpdate",
        r
      ), a = H(e, "onTransaction", r), c = H(e, "onFocus", r), u = H(e, "onBlur", r), d = H(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), l && this.editor.on("selectionUpdate", l), a && this.editor.on("transaction", a), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
us.resolve = Dl;
us.sort = wr;
us.flatten = Ol;
var I0 = {};
Tl(I0, {
  ClipboardTextSerializer: () => xf,
  Commands: () => Sf,
  Delete: () => kf,
  Drop: () => Cf,
  Editable: () => Tf,
  FocusEvents: () => Mf,
  Keymap: () => Of,
  Paste: () => Af,
  Tabindex: () => Df,
  TextDirection: () => Pf,
  focusEventsPluginKey: () => Ef
});
var Ke = class wf extends Nl {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new wf(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, xf = Ke.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new Ae({
        key: new Ue("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), l = Math.max(...s.map((u) => u.$to.pos)), a = mf(t);
            return pf(r, { from: o, to: l }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), Sf = Ke.create({
  name: "commands",
  addCommands() {
    return {
      ...tf
    };
  }
}), kf = Ke.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, l, a, c;
      if ((c = (a = (l = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : l.filterTransaction) == null ? void 0 : a.call(l, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = zb(n.before, [n, ...e]);
      Qb(u).forEach((h) => {
        u.mapping.mapResult(h.oldRange.from).deletedAfter && u.mapping.mapResult(h.oldRange.to).deletedBefore && u.before.nodesBetween(h.oldRange.from, h.oldRange.to, (p, m) => {
          const g = m + p.nodeSize - 2, y = h.oldRange.from <= m && g <= h.oldRange.to;
          this.editor.emit("delete", {
            type: "node",
            node: p,
            from: m,
            to: g,
            newFrom: u.mapping.map(m),
            newTo: u.mapping.map(g),
            deletedRange: h.oldRange,
            newRange: h.newRange,
            partial: !y,
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        });
      });
      const f = u.mapping;
      u.steps.forEach((h, p) => {
        var m, g;
        if (h instanceof lt) {
          const y = f.slice(p).map(h.from, -1), w = f.slice(p).map(h.to), S = f.invert().map(y, -1), b = f.invert().map(w), k = (m = u.doc.nodeAt(y - 1)) == null ? void 0 : m.marks.some((x) => x.eq(h.mark)), C = (g = u.doc.nodeAt(w)) == null ? void 0 : g.marks.some((x) => x.eq(h.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: h.mark,
            from: h.from,
            to: h.to,
            deletedRange: {
              from: S,
              to: b
            },
            newRange: {
              from: y,
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
}), Cf = Ke.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new Ae({
        key: new Ue("tiptapDrop"),
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
}), Tf = Ke.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Ae({
        key: new Ue("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Ef = new Ue("focusEvents"), Mf = Ke.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Ae({
        key: Ef,
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
}), Of = Ke.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: d } = a, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? l.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, y = m && p.parent.childCount === 1 ? g === d.pos : Q.atStart(c).from === f;
        return !u || !h.type.isTextblock || h.textContent.length || !y || y && d.parent.type.name === "paragraph" ? !1 : o.clearNodes();
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
    return _r() || af() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Ae({
        key: new Ue("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: l } = e.selection, a = Q.atStart(e.doc).from, c = Q.atEnd(e.doc).to;
          if (s || !(o === a && l === c) || !Pl(t.doc))
            return;
          const f = t.tr, h = ls({
            state: t,
            transaction: f
          }), { commands: p } = new as({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), Af = Ke.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new Ae({
        key: new Ue("tiptapPaste"),
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
}), Df = Ke.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Ae({
        key: new Ue("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), Pf = Ke.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = Yn(this.extensions);
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
      new Ae({
        key: new Ue("textDirection"),
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
}), R0 = class hr {
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
    return new hr(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new hr(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new hr(e, this.editor);
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
      const c = new hr(a, this.editor, i, i || o ? t : null);
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
}, $0 = `.ProseMirror {
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
function B0(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var L0 = class extends C0 {
  constructor(e = {}) {
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
      onContentError: ({ error: i }) => {
        throw i;
      },
      onPaste: () => null,
      onDrop: () => null,
      onDelete: () => null,
      enableExtensionDispatchTransaction: !0
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.utils = {
      getUpdatedPosition: yf,
      createMappablePosition: n0
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = of(t, this.options.autofocus);
    this.editorState = zn.create({
      doc: t,
      schema: this.schema,
      selection: r || void 0
    }), this.options.element && this.mount(this.options.element);
  }
  /**
   * Attach the editor to the DOM, creating a new editor view.
   */
  mount(e) {
    if (typeof document > "u")
      throw new Error(
        "[tiptap error]: The editor cannot be mounted because there is no 'document' defined in this environment."
      );
    this.createView(e), this.emit("mount", { editor: this }), this.css && !document.head.contains(this.css) && document.head.appendChild(this.css), window.setTimeout(() => {
      this.isDestroyed || (this.options.autofocus !== !1 && this.options.autofocus !== null && this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }), this.isInitialized = !0);
    }, 0);
  }
  /**
   * Remove the editor from the DOM, but still allow remounting at a different point in time
   */
  unmount() {
    if (this.editorView) {
      const e = this.editorView.dom;
      e?.editor && delete e.editor, this.editorView.destroy();
    }
    if (this.editorView = null, this.isInitialized = !1, this.css && !document.querySelectorAll(`.${this.className}`).length)
      try {
        typeof this.css.remove == "function" ? this.css.remove() : this.css.parentNode && this.css.parentNode.removeChild(this.css);
      } catch (e) {
        console.warn("Failed to remove CSS element:", e);
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
    this.options.injectCSS && typeof document < "u" && (this.css = B0($0, this.options.injectNonce));
  }
  /**
   * Update editor options.
   *
   * @param options A list of options
   */
  setOptions(e = {}) {
    this.options = {
      ...this.options,
      ...e
    }, !(!this.editorView || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  /**
   * Update editable state of the editor.
   */
  setEditable(e, t = !0) {
    this.setOptions({ editable: e }), t && this.emit("update", { editor: this, transaction: this.state.tr, appendedTransactions: [] });
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
        updateState: (e) => {
          this.editorState = e;
        },
        dispatch: (e) => {
          this.dispatchTransaction(e);
        },
        // Stub some commonly accessed properties to prevent errors
        composing: !1,
        dragging: null,
        editable: !0,
        isDestroyed: !1
      },
      {
        get: (e, t) => {
          if (this.editorView)
            return this.editorView[t];
          if (t === "state")
            return this.editorState;
          if (t in e)
            return Reflect.get(e, t);
          throw new Error(
            `[tiptap error]: The editor view is not available. Cannot access view['${t}']. The editor may not be mounted yet.`
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
  registerPlugin(e, t) {
    const r = uf(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
    return this.view.updateState(i), i;
  }
  /**
   * Unregister a ProseMirror plugin.
   *
   * @param nameOrPluginKeyToRemove The plugins name
   * @returns The new editor state or undefined if the editor is destroyed
   */
  unregisterPlugin(e) {
    if (this.isDestroyed)
      return;
    const t = this.state.plugins;
    let r = t;
    if ([].concat(e).forEach((s) => {
      const o = typeof s == "string" ? `${s}$` : s.key;
      r = r.filter((l) => !l.key.startsWith(o));
    }), t.length === r.length)
      return;
    const i = this.state.reconfigure({
      plugins: r
    });
    return this.view.updateState(i), i;
  }
  /**
   * Creates an extension manager.
   */
  createExtensionManager() {
    var e, t;
    const i = [...this.options.enableCoreExtensions ? [
      Tf,
      xf.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      Sf,
      Mf,
      Of,
      Df,
      Cf,
      Af,
      kf,
      Pf.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new us(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new as({
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
    let e;
    try {
      e = $o(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: this.options.enableContentCheck
      });
    } catch (t) {
      if (!(t instanceof Error) || !["[tiptap error]: Invalid JSON content", "[tiptap error]: Invalid HTML content"].includes(t.message))
        throw t;
      this.emit("contentError", {
        editor: this,
        error: t,
        disableCollaboration: () => {
          "collaboration" in this.storage && typeof this.storage.collaboration == "object" && this.storage.collaboration && (this.storage.collaboration.isDisabled = !0), this.options.extensions = this.options.extensions.filter((r) => r.name !== "collaboration"), this.createExtensionManager();
        }
      }), e = $o(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: !1
      });
    }
    return e;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView(e) {
    const { editorProps: t, enableExtensionDispatchTransaction: r } = this.options, i = t.dispatchTransaction || this.dispatchTransaction.bind(this), s = r ? this.extensionManager.dispatchTransaction(i) : i, o = t.transformPastedHTML, l = this.extensionManager.transformPastedHTML(o);
    this.editorView = new ef(e, {
      ...t,
      attributes: {
        // add `role="textbox"` to the editor element
        role: "textbox",
        ...t?.attributes
      },
      dispatchTransaction: s,
      transformPastedHTML: l,
      state: this.editorState,
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
    const a = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(a), this.prependClass(), this.injectCSS();
    const c = this.view.dom;
    c.editor = this;
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
  captureTransaction(e) {
    this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
    const t = this.capturedTransaction;
    return this.capturedTransaction = null, t;
  }
  /**
   * The callback over which to send transactions (state updates) produced by the view.
   *
   * @param transaction An editor state transaction
   */
  dispatchTransaction(e) {
    if (this.view.isDestroyed)
      return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((u) => {
        var d;
        return (d = this.capturedTransaction) == null ? void 0 : d.step(u);
      });
      return;
    }
    const { state: t, transactions: r } = this.state.applyTransaction(e), i = !this.state.selection.eq(t.selection), s = r.includes(e), o = this.state;
    if (this.emit("beforeTransaction", {
      editor: this,
      transaction: e,
      nextState: t
    }), !s)
      return;
    this.view.updateState(t), this.emit("transaction", {
      editor: this,
      transaction: e,
      appendedTransactions: r.slice(1)
    }), i && this.emit("selectionUpdate", {
      editor: this,
      transaction: e
    });
    const l = r.findLast((u) => u.getMeta("focus") || u.getMeta("blur")), a = l?.getMeta("focus"), c = l?.getMeta("blur");
    a && this.emit("focus", {
      editor: this,
      event: a.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: l
    }), c && this.emit("blur", {
      editor: this,
      event: c.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: l
    }), !(e.getMeta("preventUpdate") || !r.some((u) => u.docChanged) || o.doc.eq(t.doc)) && this.emit("update", {
      editor: this,
      transaction: e,
      appendedTransactions: r.slice(1)
    });
  }
  /**
   * Get attributes of the currently selected node or mark.
   */
  getAttributes(e) {
    return Yb(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return t0(this.state, r, i);
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
    return Al(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return Jb(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...mf(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Pl(this.state.doc);
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
    var e, t;
    return (t = (e = this.editorView) == null ? void 0 : e.isDestroyed) != null ? t : !0;
  }
  $node(e, t) {
    var r;
    return ((r = this.$doc) == null ? void 0 : r.querySelector(e, t)) || null;
  }
  $nodes(e, t) {
    var r;
    return ((r = this.$doc) == null ? void 0 : r.querySelectorAll(e, t)) || null;
  }
  $pos(e) {
    const t = this.state.doc.resolve(e);
    return new R0(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, F0 = {};
Tl(F0, {
  createAtomBlockMarkdownSpec: () => z0,
  createBlockMarkdownSpec: () => V0,
  createInlineMarkdownSpec: () => H0,
  parseAttributes: () => Il,
  parseIndentedBlocks: () => j0,
  renderNestedMarkdownContent: () => U0,
  serializeAttributes: () => Rl
});
function Il(n) {
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
function Rl(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function z0(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = Il,
    serializeAttributes: i = Rl,
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
function V0(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Il,
    serializeAttributes: s = Rl,
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
        const [y, w = ""] = g, S = i(w);
        let b = 1;
        const k = y.length;
        let C = "";
        const x = /^:::([\w-]*)(\s.*)?/gm, E = d.slice(k);
        for (x.lastIndex = 0; ; ) {
          const T = x.exec(E);
          if (T === null)
            break;
          const M = T.index, I = T[1];
          if (!((p = T[2]) != null && p.endsWith(":::"))) {
            if (I)
              b += 1;
            else if (b -= 1, b === 0) {
              const R = E.slice(0, M);
              C = R.trim();
              const q = d.slice(0, k + M + T[0].length);
              let _ = [];
              if (C)
                if (l === "block")
                  for (_ = h.blockTokens(R), _.forEach(($) => {
                    $.text && (!$.tokens || $.tokens.length === 0) && ($.tokens = h.inlineTokens($.text));
                  }); _.length > 0; ) {
                    const $ = _[_.length - 1];
                    if ($.type === "paragraph" && (!$.text || $.text.trim() === ""))
                      _.pop();
                    else
                      break;
                  }
                else
                  _ = h.inlineTokens(C);
              return {
                type: e,
                raw: q,
                attributes: S,
                content: C,
                tokens: _
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
function q0(n) {
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
function W0(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function H0(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = q0,
    serializeAttributes: s = W0,
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
        const y = f[m];
        if (g !== void 0 && y === g)
          return;
        h[m] = y;
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
        let y = "", w = "";
        if (l) {
          const [, b] = g;
          w = b;
        } else {
          const [, b, k] = g;
          w = b, y = k || "";
        }
        const S = i(w.trim());
        return {
          type: e,
          raw: g[0],
          content: y.trim(),
          attributes: S
        };
      }
    },
    renderMarkdown: (f) => {
      let h = "";
      r ? h = r(f) : f.content && f.content.length > 0 && (h = f.content.filter((y) => y.type === "text").map((y) => y.text).join(""));
      const p = u(f.attrs || {}), m = s(p), g = m ? ` ${m}` : "";
      return l ? `[${c}${g}]` : `[${c}${g}]${h}[/${c}]`;
    }
  };
}
function j0(n, e, t) {
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
    const y = [g];
    for (u += 1; u < l.length; ) {
      const k = l[u];
      if (k.trim() === "") {
        const x = l.slice(u + 1).findIndex((M) => M.trim() !== "");
        if (x === -1)
          break;
        if ((((i = (r = l[u + 1 + x].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          y.push(k), c = `${c}${k}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = k.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        y.push(k), c = `${c}${k}
`, u += 1;
      else
        break;
    }
    let w;
    const S = y.slice(1);
    if (S.length > 0) {
      const k = S.map((C) => C.slice(m + d)).join(`
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
function U0(n, e, t, r) {
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
function K0(n, e, t = {}) {
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
var $l = class _f extends Nl {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new _f(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, J0 = class {
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
      const w = this.dom.getBoundingClientRect(), S = u.getBoundingClientRect(), b = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, k = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = S.x - w.x + b, f = S.y - w.y + k;
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
    const g = j.create(a.state.doc, m), y = a.state.tr.setSelection(g);
    a.dispatch(y);
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
    const { isEditable: l } = this.editor, { isDragging: a } = this, c = !!this.node.type.spec.draggable, u = j.isSelectable(this.node), d = n.type === "copy", f = n.type === "paste", h = n.type === "cut", p = n.type === "mousedown";
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
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (_r() || Ro()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
};
function Cc(n) {
  return hu((e, t) => ({
    get() {
      return e(), n;
    },
    set(r) {
      n = r, requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          t();
        });
      });
    }
  }));
}
var X0 = class extends L0 {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = Cc(this.view.state), this.reactiveExtensionStorage = Cc(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), rl(this);
  }
  get state() {
    return this.reactiveState ? this.reactiveState.value : this.view.state;
  }
  get storage() {
    return this.reactiveExtensionStorage ? this.reactiveExtensionStorage.value : super.storage;
  }
  /**
   * Register a ProseMirror plugin.
   */
  registerPlugin(n, e) {
    const t = super.registerPlugin(n, e);
    return this.reactiveState && (this.reactiveState.value = t), t;
  }
  /**
   * Unregister a ProseMirror plugin.
   */
  unregisterPlugin(n) {
    const e = super.unregisterPlugin(n);
    return this.reactiveState && e && (this.reactiveState.value = e), e;
  }
}, Y0 = L({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = P(), t = Gt();
    return je(() => {
      const r = n.editor;
      r && r.options.element && e.value && ye(() => {
        var i;
        if (!e.value || !((i = r.view.dom) != null && i.parentNode))
          return;
        const s = v(e.value);
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
    }), kn(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return Ve("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), G0 = L({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return Ve(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), Z0 = L({
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
    return Ve(
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
}), Q0 = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = rl(n), this.el = document.createElement("div"), this.props = il(e), this.renderedComponent = this.renderComponent();
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
    let n = Ve(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && oa(n, this.el), { vNode: n, destroy: () => {
      this.el && oa(null, this.el), this.el = null, n = null;
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
L({
  name: "MarkViewContent",
  props: {
    as: {
      type: String,
      default: "span"
    }
  },
  render() {
    return Ve(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var ew = class extends J0 {
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
    const t = L({
      extends: { ...this.component },
      props: Object.keys(n),
      template: this.component.template,
      setup: (r) => {
        var i, s;
        return jn("onDragStart", e), jn("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new Q0(t, {
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
function tw(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new ew(r, t, e);
  };
}
const nw = { class: "transcription-panel" }, rw = {
  ref: "scrollContainer",
  class: "scroll-container"
}, iw = { class: "turns-container" }, sw = {
  key: 0,
  class: "history-loading",
  role: "status"
}, ow = {
  key: 1,
  class: "history-start"
}, lw = /* @__PURE__ */ L({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = wt(), r = Nt(), i = Tr("scrollContainer"), s = A(() => {
      const E = r.live?.partial.value ?? null;
      return E === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: E,
        words: [],
        language: r.activeChannel.value?.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = A(() => r.transcriptionEditor?.tiptapEditor.value), l = A(() => r.live?.hasLiveUpdate.value ?? !1), a = A(() => r.audio?.isPlaying.value ?? !1), c = A(
      () => r.activeChannel.value?.activeTranslation.value
    ), u = A(() => r.activeChannel.value), d = A(
      () => u.value?.isLoadingHistory.value ?? !1
    ), f = A(() => u.value?.hasMoreHistory.value ?? !1), h = A(() => e.turns), { isFollowing: p, resumeFollow: m } = Vm(
      i,
      h
    ), { scrollRef: g, contentRef: y, isAtBottom: w, scrollToBottom: S } = Sm();
    ve(() => {
      g.value = i.value, y.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const b = A(
      () => !p.value && a.value || !w.value && l.value
    );
    function k() {
      a.value ? m() : S();
    }
    const C = Fp(() => {
      const E = u.value;
      if (!E?.hasMoreHistory.value || E.isLoadingHistory.value || e.turns.length === 0) return;
      const T = c.value;
      T && r.emit("scroll:top", { translationId: T.id });
    }, 500);
    function x() {
      const E = i.value;
      E && E.scrollTop < 100 && C();
    }
    return re(
      () => e.turns,
      (E, T) => {
        const M = E.length, I = T.length;
        if (M > I && !w.value && E[0]?.id != T[0]?.id) {
          const R = M - I, q = e.turns[R]?.id;
          if (!q || !g.value) return;
          ye(() => {
            g.value?.querySelector(
              `[data-turn-id="${q}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), ve(() => {
      i.value?.addEventListener("scroll", x, {
        passive: !0
      });
    }), kn(() => {
      i.value?.removeEventListener("scroll", x);
    }), (E, T) => (O(), K("article", nw, [
      J("div", rw, [
        J("div", iw, [
          d.value ? (O(), K("div", sw, [...T[0] || (T[0] = [
            J("progress", null, null, -1)
          ])])) : ee("", !0),
          !f.value && n.turns.length > 0 ? (O(), K("div", ow, ne(v(t)("transcription.historyStart")), 1)) : ee("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (O(), z(Fm, {
            key: 2,
            class: "transcription-empty"
          })) : ee("", !0),
          o.value ? (O(), z(v(Y0), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (O(!0), K(tt, { key: 4 }, Tn(n.turns, (M, I) => (O(), z(ma, {
            "data-turn-id": M.id,
            key: M.id,
            turn: M,
            speaker: M.speakerId ? n.speakers.get(M.speakerId) : void 0,
            live: l.value && !s.value && I === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (O(), z(ma, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : ee("", !0)
        ]),
        F(ap, { name: "fade-slide" }, {
          default: N(() => [
            b.value ? (O(), z(ft, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": v(t)("transcription.resumeScroll"),
              onClick: k
            }, {
              icon: N(() => [
                F(v(Kp), { size: 14 })
              ]),
              default: N(() => [
                He(" " + ne(v(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : ee("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), aw = /* @__PURE__ */ Oe(lw, [["__scopeId", "data-v-ea05652a"]]), cw = { class: "switch" }, uw = ["id", "checked"], dw = ["for"], fw = /* @__PURE__ */ L({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? cp();
    return (s, o) => (O(), K("div", cw, [
      J("input", {
        type: "checkbox",
        id: v(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (l) => r("update:modelValue", l.target.checked))
      }, null, 40, uw),
      J("label", { for: v(i) }, [...o[1] || (o[1] = [
        J("div", { class: "switch-slider" }, null, -1)
      ])], 8, dw)
    ]));
  }
}), hw = /* @__PURE__ */ Oe(fw, [["__scopeId", "data-v-2aa0332f"]]), pw = "(max-width: 767px)";
function Nf() {
  const n = P(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return ve(() => {
    e = window.matchMedia(pw), n.value = e.matches, e.addEventListener("change", t);
  }), kn(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function Tc(n) {
  return typeof n == "string" ? `'${n}'` : new mw().serialize(n);
}
const mw = /* @__PURE__ */ (function() {
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
function Vi(n, e) {
  return n === e || Tc(n) === Tc(e);
}
function gw(n, e, t) {
  const r = n.findIndex((l) => Vi(l, e)), i = n.findIndex((l) => Vi(l, t));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((l, a) => l - a);
  return n.slice(s, o + 1);
}
function Ec(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function xt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const l = Zi(r, o);
    if (l || l === null) return l;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (jn(r, o), o)];
}
function it() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function ds(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function Lo(n) {
  return n == null;
}
function Bl(n) {
  return n ? n.flatMap((e) => e.type === tt ? Bl(e.children) : [e]) : [];
}
const [fs] = xt("ConfigProvider");
function yw(n, e) {
  var t;
  const r = gn();
  return je(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), up(r);
}
function hs(n, e) {
  return pu() ? (mu(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Zs() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const o = () => e(s);
      return hs(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((o) => o(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function vw(n) {
  let e = !1, t;
  const r = gu(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Rt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const bw = (n) => typeof n < "u", ww = Object.prototype.toString, xw = (n) => ww.call(n) === "[object Object]", Mc = /* @__PURE__ */ Sw();
function Sw() {
  var n, e, t;
  return Rt && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function Qs(n) {
  return Array.isArray(n) ? n : [n];
}
function kw(n) {
  return Gt();
}
// @__NO_SIDE_EFFECTS__
function Cw(n) {
  if (!Rt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = gu(!0), t = r.run(() => n(...s))), hs(i), t));
}
function If(n, e = 1e4) {
  return hu((t, r) => {
    let i = Ie(n), s;
    const o = () => setTimeout(() => {
      i = Ie(n), r();
    }, Ie(e));
    return hs(() => {
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
function Tw(n, e) {
  kw() && kn(n, e);
}
function Ew(n, e, t) {
  return re(n, e, {
    ...t,
    immediate: !0
  });
}
const ps = Rt ? window : void 0;
function vt(n) {
  var e;
  const t = Ie(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Rf(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = A(() => {
    const r = Qs(Ie(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return Ew(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => vt(s))) !== null && r !== void 0 ? r : [ps].filter((s) => s != null),
      Qs(Ie(t.value ? n[1] : n[0])),
      Qs(v(t.value ? n[2] : n[1])),
      Ie(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], l, a) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = xw(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    a(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function $f() {
  const n = gn(!1), e = Gt();
  return e && ve(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function Mw(n) {
  const e = /* @__PURE__ */ $f();
  return A(() => (e.value, !!n()));
}
function Ow(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Aw(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = ps, eventName: s = "keydown", passive: o = !1, dedupe: l = !1 } = r, a = Ow(e);
  return Rf(i, s, (u) => {
    u.repeat && Ie(l) || a(u) && t(u);
  }, o);
}
function Dw(n) {
  return JSON.parse(JSON.stringify(n));
}
function Pw(n, e, t = {}) {
  const { window: r = ps, ...i } = t;
  let s;
  const o = /* @__PURE__ */ Mw(() => r && "ResizeObserver" in r), l = () => {
    s && (s.disconnect(), s = void 0);
  }, a = re(A(() => {
    const u = Ie(n);
    return Array.isArray(u) ? u.map((d) => vt(d)) : [vt(u)];
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
  return hs(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function qi(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: l = !1, eventName: a, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = Gt(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = a;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : Dw(w) : w, g = () => bw(n[e]) ? m(n[e]) : u, y = (w) => {
    d ? d(w) && h(p, w) : h(p, w);
  };
  if (l) {
    const w = P(g());
    let S = !1;
    return re(() => n[e], (b) => {
      S || (S = !0, w.value = m(b), ye(() => S = !1));
    }), re(w, (b) => {
      !S && (b !== n[e] || c) && y(b);
    }, { deep: c }), w;
  } else return A({
    get() {
      return g();
    },
    set(w) {
      y(w);
    }
  });
}
function eo(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Fo(n, e, t = ".", r) {
  if (!eo(e))
    return Fo(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : eo(o) && eo(i[s]) ? i[s] = Fo(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function _w(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => Fo(t, r, "", n), {})
  );
}
const Nw = _w(), Iw = /* @__PURE__ */ Cw(() => {
  const n = P(/* @__PURE__ */ new Map()), e = P(), t = A(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), r = fs({ scrollBody: P(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", Mc && i?.(), e.value = void 0;
  };
  return re(t, (o, l) => {
    if (!Rt) return;
    if (!o) {
      l && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: a,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Nw({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), Mc && (i = Rf(document, "touchmove", (d) => Rw(d), { passive: !1 })), ye(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function Bf(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Iw();
  t.value.set(e, n ?? !1);
  const r = A({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return Tw(() => {
    t.value.delete(e);
  }), r;
}
function Lf(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Lf(t);
  }
}
function Rw(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && Lf(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Ff(n) {
  const e = fs({ dir: P("ltr") });
  return A(() => n?.value || e.dir?.value || "ltr");
}
function ms(n) {
  const e = Gt(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[dp(yu(i))] = (...s) => n(i, ...s);
  }), r;
}
let to = 0;
function $w() {
  je((n) => {
    if (!Rt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Oc()), document.body.insertAdjacentElement("beforeend", e[1] ?? Oc()), to++, n(() => {
      to === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), to--;
    });
  });
}
function Oc() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function zf(n) {
  return A(() => Ie(n) ? !!vt(n)?.closest("form") : !0);
}
function me() {
  const n = Gt(), e = P(), t = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : vt(e)), r = Object.assign({}, n.exposed), i = {};
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
function Ll(n) {
  const e = Gt(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = hi(n);
  return A(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[yu(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, l) => (r.value[l] !== void 0 && (o[l] = r.value[l]), o), {});
  });
}
function Bw(n, e) {
  const t = Ll(n), r = e ? ms(e) : {};
  return A(() => ({
    ...t.value,
    ...r
  }));
}
var Lw = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, In = /* @__PURE__ */ new WeakMap(), li = /* @__PURE__ */ new WeakMap(), ai = {}, no = 0, Vf = function(n) {
  return n && (n.host || Vf(n.parentNode));
}, Fw = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = Vf(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, zw = function(n, e, t, r) {
  var i = Fw(e, Array.isArray(n) ? n : [n]);
  ai[t] || (ai[t] = /* @__PURE__ */ new WeakMap());
  var s = ai[t], o = [], l = /* @__PURE__ */ new Set(), a = new Set(i), c = function(d) {
    !d || l.has(d) || (l.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || a.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (l.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (In.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          In.set(f, m), s.set(f, g), o.push(f), m === 1 && p && li.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return u(e), l.clear(), no++, function() {
    o.forEach(function(d) {
      var f = In.get(d) - 1, h = s.get(d) - 1;
      In.set(d, f), s.set(d, h), f || (li.has(d) || d.removeAttribute(r), li.delete(d)), h || d.removeAttribute(t);
    }), no--, no || (In = /* @__PURE__ */ new WeakMap(), In = /* @__PURE__ */ new WeakMap(), li = /* @__PURE__ */ new WeakMap(), ai = {});
  };
}, Vw = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = Lw(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), zw(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function qf(n) {
  let e;
  re(() => vt(n), (t) => {
    t ? e = Vw(t) : e && e();
  }), Ur(() => {
    e && e();
  });
}
let qw = 0;
function Rr(n, e = "reka") {
  if ("useId" in sa) return `${e}-${sa.useId?.()}`;
  const t = fs({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++qw}`;
}
function Ww() {
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
function Hw(n) {
  const e = P(), t = A(() => e.value?.width ?? 0), r = A(() => e.value?.height ?? 0);
  return ve(() => {
    const i = vt(n);
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
function jw(n, e) {
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
function Fl(n) {
  const e = If("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = it(), l = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), a = l.find((f) => f.ref === o), c = l.map((f) => f.textValue), u = Kw(c, e.value, a?.textValue), d = l.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Uw(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function Kw(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = Uw(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const a = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return a !== t ? a : void 0;
}
function Jw(n, e) {
  const t = P({}), r = P("none"), i = P(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const l = e.value?.ownerDocument.defaultView ?? ps, { state: a, dispatch: c } = jw(s, {
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
    if (Rt) {
      const y = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(y);
    }
  };
  re(n, async (g, y) => {
    const w = y !== g;
    if (await ye(), w) {
      const S = r.value, b = ci(e.value);
      g ? (c("MOUNT"), u("enter"), b === "none" && u("after-enter")) : b === "none" || b === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : y && S !== b ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const y = ci(e.value), w = y.includes(CSS.escape(g.animationName)), S = a.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && w && (u(`after-${S}`), c("ANIMATION_END"), !i.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = l?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    g.target === e.value && y === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = ci(e.value));
  }, h = re(e, (g, y) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && l?.clearTimeout(o), y?.removeEventListener("animationstart", f), y?.removeEventListener("animationcancel", d), y?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = re(a, () => {
    const g = ci(e.value);
    r.value = a.value === "mounted" ? g : "none";
  });
  return Ur(() => {
    h(), p();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(a.value)) };
}
function ci(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var zl = L({
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
    const { present: r, forceMount: i } = tr(n), s = P(), { isPresent: o } = Jw(r, s);
    t({ present: o });
    let l = e.default({ present: o.value });
    l = Bl(l || []);
    const a = Gt();
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
    return () => i.value || r.value || o.value ? Ve(e.default({ present: o.value })[0], { ref: (c) => {
      const u = vt(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const zo = L({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = Bl(t.default()), i = r.findIndex((a) => a.type !== fp);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? ce(e, s.props) : e, l = hp({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? l : (r[i] = l, r);
    };
  }
}), Xw = [
  "area",
  "img",
  "input"
], he = L({
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
    return typeof r == "string" && Xw.includes(r) ? () => Ve(r, e) : r !== "template" ? () => Ve(n.as, e, { default: t.default }) : () => Ve(zo, e, { default: t.default });
  }
});
function Wi() {
  const n = P(), e = A(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : vt(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Qt, Yw] = xt("DialogRoot");
var Gw = /* @__PURE__ */ L({
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
    const t = n, i = /* @__PURE__ */ qi(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), o = P(), { modal: l } = tr(t);
    return Yw({
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
    }), (a, c) => G(a.$slots, "default", {
      open: v(i),
      close: () => i.value = !1
    });
  }
}), Wf = Gw, Zw = /* @__PURE__ */ L({
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
    me();
    const t = Qt();
    return (r, i) => (O(), z(v(he), ce(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => v(t).onOpenChange(!1))
    }), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Qw = Zw;
const ex = "dismissableLayer.pointerDownOutside", tx = "dismissableLayer.focusOutside";
function Hf(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function nx(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1), s = P(() => {
  });
  return je((o) => {
    if (!Rt || !Ie(t)) return;
    const l = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Hf(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            ds(ex, n, d);
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
    Ie(t) && (i.value = !0);
  } };
}
function rx(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1);
  return je((s) => {
    if (!Rt || !Ie(t)) return;
    const o = async (l) => {
      if (!e?.value) return;
      await ye(), await ye();
      const a = l.target;
      !e.value || !a || Hf(e.value, a) || l.target && !i.value && ds(tx, n, { originalEvent: l });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Ie(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Ie(t) && (i.value = !1);
    }
  };
}
const Ze = il({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ix = /* @__PURE__ */ L({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = me(), o = A(() => s.value?.ownerDocument ?? globalThis.document), l = A(() => Ze.layersRoot), a = A(() => s.value ? Array.from(l.value).indexOf(s.value) : -1), c = A(() => Ze.layersWithOutsidePointerEventsDisabled.size > 0), u = A(() => {
      const h = Array.from(l.value), [p] = [...Ze.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return a.value >= m;
    }), d = nx(async (h) => {
      const p = [...Ze.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await ye(), h.defaultPrevented || r("dismiss"));
    }, s), f = rx((h) => {
      [...Ze.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return Aw("Escape", (h) => {
      a.value === l.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), je((h) => {
      s.value && (t.disableOutsidePointerEvents && (Ze.layersWithOutsidePointerEventsDisabled.size === 0 && (Ze.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Ze.layersWithOutsidePointerEventsDisabled.add(s.value)), l.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && Ze.layersWithOutsidePointerEventsDisabled.size === 1 && !Lo(Ze.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Ze.originalBodyPointerEvents);
      }));
    }), je((h) => {
      h(() => {
        s.value && (l.value.delete(s.value), Ze.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (O(), z(v(he), {
      ref: v(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: Cn({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: v(f).onFocusCapture,
      onBlurCapture: v(f).onBlurCapture,
      onPointerdownCapture: v(d).onPointerDownCapture
    }, {
      default: N(() => [G(h.$slots, "default")]),
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
}), jf = ix;
const sx = /* @__PURE__ */ vw(() => P([]));
function ox() {
  const n = sx();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = Ac(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = Ac(n.value, e), n.value[0]?.resume();
    }
  };
}
function Ac(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const ro = "focusScope.autoFocusOnMount", io = "focusScope.autoFocusOnUnmount", Dc = {
  bubbles: !1,
  cancelable: !0
};
function lx(n, { select: e = !1 } = {}) {
  const t = it();
  for (const r of n)
    if (Bt(r, { select: e }), it() !== t) return !0;
}
function ax(n) {
  const e = Uf(n), t = Pc(e, n), r = Pc(e.reverse(), n);
  return [t, r];
}
function Uf(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function Pc(n, e) {
  for (const t of n) if (!cx(t, { upTo: e })) return t;
}
function cx(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function ux(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Bt(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = it();
    n.focus({ preventScroll: !0 }), n !== t && ux(n) && e && n.select();
  }
}
var dx = /* @__PURE__ */ L({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = me(), o = P(null), l = ox(), a = il({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    je((u) => {
      if (!Rt) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(g) {
        if (a.paused || !d) return;
        const y = g.target;
        d.contains(y) ? o.value = y : Bt(o.value, { select: !0 });
      }
      function h(g) {
        if (a.paused || !d) return;
        const y = g.relatedTarget;
        y !== null && (d.contains(y) || Bt(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || Bt(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", h);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", h), m.disconnect();
      });
    }), je(async (u) => {
      const d = s.value;
      if (await ye(), !d) return;
      l.add(a);
      const f = it();
      if (!d.contains(f)) {
        const p = new CustomEvent(ro, Dc);
        d.addEventListener(ro, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (lx(Uf(d), { select: !0 }), it() === f && Bt(d));
      }
      u(() => {
        d.removeEventListener(ro, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(io, Dc), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(io, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Bt(f ?? document.body, { select: !0 }), d.removeEventListener(io, m), l.remove(a);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || a.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = it();
      if (d && f) {
        const h = u.currentTarget, [p, m] = ax(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && Bt(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && Bt(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (O(), z(v(he), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: N(() => [G(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Kf = dx;
function fx(n) {
  return n ? "open" : "closed";
}
function _c(n) {
  const e = it();
  for (const t of n)
    if (t === e || (t.focus(), it() !== e)) return;
}
const hx = "DialogTitle", px = "DialogContent";
function mx({ titleName: n = hx, contentName: e = px, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, l = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  ve(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(l));
  });
}
var gx = /* @__PURE__ */ L({
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
    const t = n, r = e, i = Qt(), { forwardRef: s, currentElement: o } = me();
    return i.titleId ||= Rr(void 0, "reka-dialog-title"), i.descriptionId ||= Rr(void 0, "reka-dialog-description"), ve(() => {
      i.contentElement = o, it() !== document.body && (i.triggerElement.value = it());
    }), process.env.NODE_ENV !== "production" && mx({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (l, a) => (O(), z(v(Kf), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: a[5] || (a[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: a[6] || (a[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: N(() => [F(v(jf), ce({
        id: v(i).contentId,
        ref: v(s),
        as: l.as,
        "as-child": l.asChild,
        "disable-outside-pointer-events": l.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(i).descriptionId,
        "aria-labelledby": v(i).titleId,
        "data-state": v(fx)(v(i).open.value)
      }, l.$attrs, {
        onDismiss: a[0] || (a[0] = (c) => v(i).onOpenChange(!1)),
        onEscapeKeyDown: a[1] || (a[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: a[2] || (a[2] = (c) => r("focusOutside", c)),
        onInteractOutside: a[3] || (a[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: a[4] || (a[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: N(() => [G(l.$slots, "default")]),
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
}), Jf = gx, yx = /* @__PURE__ */ L({
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
    const t = n, r = e, i = Qt(), s = ms(r), { forwardRef: o, currentElement: l } = me();
    return qf(l), (a, c) => (O(), z(Jf, ce({
      ...t,
      ...v(s)
    }, {
      ref: v(o),
      "trap-focus": v(i).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (u.preventDefault(), v(i).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || f) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: N(() => [G(a.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), vx = yx, bx = /* @__PURE__ */ L({
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
    const t = n, i = ms(e);
    me();
    const s = Qt(), o = P(!1), l = P(!1);
    return (a, c) => (O(), z(Jf, ce({
      ...t,
      ...v(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || v(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, l.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (l.value = !0));
        const d = u.target;
        v(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && l.value && u.preventDefault();
      })
    }), {
      default: N(() => [G(a.$slots, "default")]),
      _: 3
    }, 16));
  }
}), wx = bx, xx = /* @__PURE__ */ L({
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
    const t = n, r = e, i = Qt(), s = ms(r), { forwardRef: o } = me();
    return (l, a) => (O(), z(v(zl), { present: l.forceMount || v(i).open.value }, {
      default: N(() => [v(i).modal.value ? (O(), z(vx, ce({
        key: 0,
        ref: v(o)
      }, {
        ...t,
        ...v(s),
        ...l.$attrs
      }), {
        default: N(() => [G(l.$slots, "default")]),
        _: 3
      }, 16)) : (O(), z(wx, ce({
        key: 1,
        ref: v(o)
      }, {
        ...t,
        ...v(s),
        ...l.$attrs
      }), {
        default: N(() => [G(l.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Xf = xx, Sx = /* @__PURE__ */ L({
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
    const e = Qt();
    return Bf(!0), me(), (t, r) => (O(), z(v(he), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": v(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: N(() => [G(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), kx = Sx, Cx = /* @__PURE__ */ L({
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
    const e = Qt(), { forwardRef: t } = me();
    return (r, i) => v(e)?.modal.value ? (O(), z(v(zl), {
      key: 0,
      present: r.forceMount || v(e).open.value
    }, {
      default: N(() => [F(kx, ce(r.$attrs, {
        ref: v(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: N(() => [G(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : ee("v-if", !0);
  }
}), Yf = Cx, Tx = /* @__PURE__ */ L({
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
    const e = /* @__PURE__ */ $f();
    return (t, r) => v(e) || t.forceMount ? (O(), z(vu, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [G(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : ee("v-if", !0);
  }
}), Gf = Tx, Ex = /* @__PURE__ */ L({
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
    return (t, r) => (O(), z(v(Gf), sl(ol(e)), {
      default: N(() => [G(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Zf = Ex, Mx = /* @__PURE__ */ L({
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
    const e = n, t = Qt();
    return me(), (r, i) => (O(), z(v(he), ce(e, { id: v(t).titleId }), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Qf = Mx;
const Nc = "data-reka-collection-item";
function en(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = P(/* @__PURE__ */ new Map());
    i = {
      collectionRef: P(),
      itemMap: u
    }, jn(r, i);
  } else i = Zi(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Nc}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = L({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = Wi();
      return re(p, () => {
        i.collectionRef.value = p.value;
      }), () => Ve(zo, {
        ref: h,
        ...f
      }, d);
    }
  }), l = L({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = Wi();
      return je((m) => {
        if (p.value) {
          const g = rl(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => Ve(zo, {
        ...f,
        [Nc]: "",
        ref: h
      }, d);
    }
  }), a = A(() => Array.from(i.itemMap.value.values())), c = A(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: a,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: l
  };
}
const Ox = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Ax(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Dx(n, e, t) {
  const r = Ax(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Ox[r];
}
var Px = /* @__PURE__ */ L({
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
    return (e, t) => (O(), z(v(he), {
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
      default: N(() => [G(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), eh = Px, _x = /* @__PURE__ */ L({
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
    const e = n, { primitiveElement: t, currentElement: r } = Wi(), i = A(() => e.checked ?? e.value);
    return re(i, (s, o) => {
      if (!r.value) return;
      const l = r.value, a = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(l, s), l.dispatchEvent(d), l.dispatchEvent(f);
      }
    }), (s, o) => (O(), z(eh, ce({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Ic = _x, Nx = /* @__PURE__ */ L({
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
    const e = n, t = A(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = A(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (i, s) => (O(), K(tt, null, [ee(" We render single input if it's required "), t.value ? (O(), z(Ic, ce({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (O(!0), K(tt, { key: 1 }, Tn(r.value, (o) => (O(), z(Ic, ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Ix = Nx;
const [th, Rx] = xt("PopperRoot");
var $x = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = P();
    return Rx({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => G(t.$slots, "default");
  }
}), Bx = $x, Lx = /* @__PURE__ */ L({
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
    const e = n, { forwardRef: t, currentElement: r } = me(), i = th();
    return bu(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (O(), z(v(he), {
      ref: v(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: N(() => [G(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Fx = Lx;
function zx(n) {
  return n !== null;
}
function Vx(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, l = o ? 0 : n.arrowWidth, a = o ? 0 : n.arrowHeight, [c, u] = Vo(t), d = {
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
function Vo(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const qx = ["top", "right", "bottom", "left"], Xt = Math.min, Je = Math.max, Hi = Math.round, ui = Math.floor, pt = (n) => ({
  x: n,
  y: n
}), Wx = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Hx = {
  start: "end",
  end: "start"
};
function qo(n, e, t) {
  return Je(n, Xt(e, t));
}
function Pt(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function _t(n) {
  return n.split("-")[0];
}
function rr(n) {
  return n.split("-")[1];
}
function Vl(n) {
  return n === "x" ? "y" : "x";
}
function ql(n) {
  return n === "y" ? "height" : "width";
}
const jx = /* @__PURE__ */ new Set(["top", "bottom"]);
function ht(n) {
  return jx.has(_t(n)) ? "y" : "x";
}
function Wl(n) {
  return Vl(ht(n));
}
function Ux(n, e, t) {
  t === void 0 && (t = !1);
  const r = rr(n), i = Wl(n), s = ql(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = ji(o)), [o, ji(o)];
}
function Kx(n) {
  const e = ji(n);
  return [Wo(n), e, Wo(e)];
}
function Wo(n) {
  return n.replace(/start|end/g, (e) => Hx[e]);
}
const Rc = ["left", "right"], $c = ["right", "left"], Jx = ["top", "bottom"], Xx = ["bottom", "top"];
function Yx(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? $c : Rc : e ? Rc : $c;
    case "left":
    case "right":
      return e ? Jx : Xx;
    default:
      return [];
  }
}
function Gx(n, e, t, r) {
  const i = rr(n);
  let s = Yx(_t(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(Wo)))), s;
}
function ji(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Wx[e]);
}
function Zx(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function nh(n) {
  return typeof n != "number" ? Zx(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Ui(n) {
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
function Bc(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = ht(e), o = Wl(e), l = ql(o), a = _t(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[l] / 2 - i[l] / 2;
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
  switch (rr(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function Qx(n, e) {
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
  } = Pt(e, n), p = nh(h), g = l[f ? d === "floating" ? "reference" : "floating" : d], y = Ui(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(l.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: a
  })), w = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, S = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(l.floating)), b = await (s.isElement == null ? void 0 : s.isElement(S)) ? await (s.getScale == null ? void 0 : s.getScale(S)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = Ui(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: l,
    rect: w,
    offsetParent: S,
    strategy: a
  }) : w);
  return {
    top: (y.top - k.top + p.top) / b.y,
    bottom: (k.bottom - y.bottom + p.bottom) / b.y,
    left: (y.left - k.left + p.left) / b.x,
    right: (k.right - y.right + p.right) / b.x
  };
}
const eS = async (n, e, t) => {
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
  } = Bc(c, r, a), f = r, h = {}, p = 0;
  for (let g = 0; g < l.length; g++) {
    var m;
    const {
      name: y,
      fn: w
    } = l[g], {
      x: S,
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
        detectOverflow: (m = o.detectOverflow) != null ? m : Qx
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = S ?? u, d = b ?? d, h = {
      ...h,
      [y]: {
        ...h[y],
        ...k
      }
    }, C && p <= 50 && (p++, typeof C == "object" && (C.placement && (f = C.placement), C.rects && (c = C.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : C.rects), {
      x: u,
      y: d
    } = Bc(c, f, a)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, tS = (n) => ({
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
    } = Pt(n, e) || {};
    if (c == null)
      return {};
    const d = nh(u), f = {
      x: t,
      y: r
    }, h = Wl(i), p = ql(h), m = await o.getDimensions(c), g = h === "y", y = g ? "top" : "left", w = g ? "bottom" : "right", S = g ? "clientHeight" : "clientWidth", b = s.reference[p] + s.reference[h] - f[h] - s.floating[p], k = f[h] - s.reference[h], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let x = C ? C[S] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(C))) && (x = l.floating[S] || s.floating[p]);
    const E = b / 2 - k / 2, T = x / 2 - m[p] / 2 - 1, M = Xt(d[y], T), I = Xt(d[w], T), R = M, q = x - m[p] - I, _ = x / 2 - m[p] / 2 + E, $ = qo(R, _, q), te = !a.arrow && rr(i) != null && _ !== $ && s.reference[p] / 2 - (_ < R ? M : I) - m[p] / 2 < 0, X = te ? _ < R ? _ - R : _ - q : 0;
    return {
      [h]: f[h] + X,
      data: {
        [h]: $,
        centerOffset: _ - $ - X,
        ...te && {
          alignmentOffset: X
        }
      },
      reset: te
    };
  }
}), nS = function(n) {
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
      } = Pt(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const y = _t(i), w = ht(l), S = _t(l) === l, b = await (a.isRTL == null ? void 0 : a.isRTL(c.floating)), k = f || (S || !m ? [ji(l)] : Kx(l)), C = p !== "none";
      !f && C && k.push(...Gx(l, m, p, b));
      const x = [l, ...k], E = await a.detectOverflow(e, g), T = [];
      let M = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && T.push(E[y]), d) {
        const _ = Ux(i, o, b);
        T.push(E[_[0]], E[_[1]]);
      }
      if (M = [...M, {
        placement: i,
        overflows: T
      }], !T.every((_) => _ <= 0)) {
        var I, R;
        const _ = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, $ = x[_];
        if ($ && (!(d === "alignment" ? w !== ht($) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((ie) => ht(ie.placement) === w ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: _,
              overflows: M
            },
            reset: {
              placement: $
            }
          };
        let te = (R = M.filter((X) => X.overflows[0] <= 0).sort((X, ie) => X.overflows[1] - ie.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!te)
          switch (h) {
            case "bestFit": {
              var q;
              const X = (q = M.filter((ie) => {
                if (C) {
                  const de = ht(ie.placement);
                  return de === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  de === "y";
                }
                return !0;
              }).map((ie) => [ie.placement, ie.overflows.filter((de) => de > 0).reduce((de, Le) => de + Le, 0)]).sort((ie, de) => ie[1] - de[1])[0]) == null ? void 0 : q[0];
              X && (te = X);
              break;
            }
            case "initialPlacement":
              te = l;
              break;
          }
        if (i !== te)
          return {
            reset: {
              placement: te
            }
          };
      }
      return {};
    }
  };
};
function Lc(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Fc(n) {
  return qx.some((e) => n[e] >= 0);
}
const rS = function(n) {
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
      } = Pt(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), l = Lc(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: l,
              referenceHidden: Fc(l)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), l = Lc(o, t.floating);
          return {
            data: {
              escapedOffsets: l,
              escaped: Fc(l)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, rh = /* @__PURE__ */ new Set(["left", "top"]);
async function iS(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = _t(t), l = rr(t), a = ht(t) === "y", c = rh.has(o) ? -1 : 1, u = s && a ? -1 : 1, d = Pt(e, n);
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
const sS = function(n) {
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
      } = e, a = await iS(e, n);
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
}, oS = function(n) {
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
          fn: (y) => {
            let {
              x: w,
              y: S
            } = y;
            return {
              x: w,
              y: S
            };
          }
        },
        ...c
      } = Pt(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = ht(_t(i)), h = Vl(f);
      let p = u[h], m = u[f];
      if (o) {
        const y = h === "y" ? "top" : "left", w = h === "y" ? "bottom" : "right", S = p + d[y], b = p - d[w];
        p = qo(S, p, b);
      }
      if (l) {
        const y = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", S = m + d[y], b = m - d[w];
        m = qo(S, m, b);
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
}, lS = function(n) {
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
      } = Pt(n, e), u = {
        x: t,
        y: r
      }, d = ht(i), f = Vl(d);
      let h = u[f], p = u[d];
      const m = Pt(l, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (a) {
        const S = f === "y" ? "height" : "width", b = s.reference[f] - s.floating[S] + g.mainAxis, k = s.reference[f] + s.reference[S] - g.mainAxis;
        h < b ? h = b : h > k && (h = k);
      }
      if (c) {
        var y, w;
        const S = f === "y" ? "width" : "height", b = rh.has(_t(i)), k = s.reference[d] - s.floating[S] + (b && ((y = o.offset) == null ? void 0 : y[d]) || 0) + (b ? 0 : g.crossAxis), C = s.reference[d] + s.reference[S] + (b ? 0 : ((w = o.offset) == null ? void 0 : w[d]) || 0) - (b ? g.crossAxis : 0);
        p < k ? p = k : p > C && (p = C);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, aS = function(n) {
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
      } = Pt(n, e), u = await o.detectOverflow(e, c), d = _t(i), f = rr(i), h = ht(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, y;
      d === "top" || d === "bottom" ? (g = d, y = f === (await (o.isRTL == null ? void 0 : o.isRTL(l.floating)) ? "start" : "end") ? "left" : "right") : (y = d, g = f === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, S = p - u.left - u.right, b = Xt(m - u[g], w), k = Xt(p - u[y], S), C = !e.middlewareData.shift;
      let x = b, E = k;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (E = S), (r = e.middlewareData.shift) != null && r.enabled.y && (x = w), C && !f) {
        const M = Je(u.left, 0), I = Je(u.right, 0), R = Je(u.top, 0), q = Je(u.bottom, 0);
        h ? E = p - 2 * (M !== 0 || I !== 0 ? M + I : Je(u.left, u.right)) : x = m - 2 * (R !== 0 || q !== 0 ? R + q : Je(u.top, u.bottom));
      }
      await a({
        ...e,
        availableWidth: E,
        availableHeight: x
      });
      const T = await o.getDimensions(l.floating);
      return p !== T.width || m !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function gs() {
  return typeof window < "u";
}
function On(n) {
  return Hl(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Ye(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function St(n) {
  var e;
  return (e = (Hl(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Hl(n) {
  return gs() ? n instanceof Node || n instanceof Ye(n).Node : !1;
}
function at(n) {
  return gs() ? n instanceof Element || n instanceof Ye(n).Element : !1;
}
function bt(n) {
  return gs() ? n instanceof HTMLElement || n instanceof Ye(n).HTMLElement : !1;
}
function zc(n) {
  return !gs() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof Ye(n).ShadowRoot;
}
const cS = /* @__PURE__ */ new Set(["inline", "contents"]);
function Yr(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = ct(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !cS.has(i);
}
const uS = /* @__PURE__ */ new Set(["table", "td", "th"]);
function dS(n) {
  return uS.has(On(n));
}
const fS = [":popover-open", ":modal"];
function ys(n) {
  return fS.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const hS = ["transform", "translate", "scale", "rotate", "perspective"], pS = ["transform", "translate", "scale", "rotate", "perspective", "filter"], mS = ["paint", "layout", "strict", "content"];
function jl(n) {
  const e = Ul(), t = at(n) ? ct(n) : n;
  return hS.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || pS.some((r) => (t.willChange || "").includes(r)) || mS.some((r) => (t.contain || "").includes(r));
}
function gS(n) {
  let e = Yt(n);
  for (; bt(e) && !Gn(e); ) {
    if (jl(e))
      return e;
    if (ys(e))
      return null;
    e = Yt(e);
  }
  return null;
}
function Ul() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const yS = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Gn(n) {
  return yS.has(On(n));
}
function ct(n) {
  return Ye(n).getComputedStyle(n);
}
function vs(n) {
  return at(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Yt(n) {
  if (On(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    zc(n) && n.host || // Fallback.
    St(n)
  );
  return zc(e) ? e.host : e;
}
function ih(n) {
  const e = Yt(n);
  return Gn(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : bt(e) && Yr(e) ? e : ih(e);
}
function $r(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = ih(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = Ye(i);
  if (s) {
    const l = Ho(o);
    return e.concat(o, o.visualViewport || [], Yr(i) ? i : [], l && t ? $r(l) : []);
  }
  return e.concat(i, $r(i, [], t));
}
function Ho(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function sh(n) {
  const e = ct(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = bt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, l = Hi(t) !== s || Hi(r) !== o;
  return l && (t = s, r = o), {
    width: t,
    height: r,
    $: l
  };
}
function Kl(n) {
  return at(n) ? n : n.contextElement;
}
function Wn(n) {
  const e = Kl(n);
  if (!bt(e))
    return pt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = sh(e);
  let o = (s ? Hi(t.width) : t.width) / r, l = (s ? Hi(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!l || !Number.isFinite(l)) && (l = 1), {
    x: o,
    y: l
  };
}
const vS = /* @__PURE__ */ pt(0);
function oh(n) {
  const e = Ye(n);
  return !Ul() || !e.visualViewport ? vS : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function bS(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== Ye(n) ? !1 : e;
}
function xn(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = Kl(n);
  let o = pt(1);
  e && (r ? at(r) && (o = Wn(r)) : o = Wn(n));
  const l = bS(s, t, r) ? oh(s) : pt(0);
  let a = (i.left + l.x) / o.x, c = (i.top + l.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = Ye(s), h = r && at(r) ? Ye(r) : r;
    let p = f, m = Ho(p);
    for (; m && r && h !== p; ) {
      const g = Wn(m), y = m.getBoundingClientRect(), w = ct(m), S = y.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, b = y.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      a *= g.x, c *= g.y, u *= g.x, d *= g.y, a += S, c += b, p = Ye(m), m = Ho(p);
    }
  }
  return Ui({
    width: u,
    height: d,
    x: a,
    y: c
  });
}
function bs(n, e) {
  const t = vs(n).scrollLeft;
  return e ? e.left + t : xn(St(n)).left + t;
}
function lh(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - bs(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function wS(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = St(r), l = e ? ys(e.floating) : !1;
  if (r === o || l && s)
    return t;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = pt(1);
  const u = pt(0), d = bt(r);
  if ((d || !d && !s) && ((On(r) !== "body" || Yr(o)) && (a = vs(r)), bt(r))) {
    const h = xn(r);
    c = Wn(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? lh(o, a) : pt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - a.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - a.scrollTop * c.y + u.y + f.y
  };
}
function xS(n) {
  return Array.from(n.getClientRects());
}
function SS(n) {
  const e = St(n), t = vs(n), r = n.ownerDocument.body, i = Je(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = Je(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + bs(n);
  const l = -t.scrollTop;
  return ct(r).direction === "rtl" && (o += Je(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: l
  };
}
const Vc = 25;
function kS(n, e) {
  const t = Ye(n), r = St(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, l = 0, a = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = Ul();
    (!u || u && e === "fixed") && (l = i.offsetLeft, a = i.offsetTop);
  }
  const c = bs(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= Vc && (s -= p);
  } else c <= Vc && (s += c);
  return {
    width: s,
    height: o,
    x: l,
    y: a
  };
}
const CS = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function TS(n, e) {
  const t = xn(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = bt(n) ? Wn(n) : pt(1), o = n.clientWidth * s.x, l = n.clientHeight * s.y, a = i * s.x, c = r * s.y;
  return {
    width: o,
    height: l,
    x: a,
    y: c
  };
}
function qc(n, e, t) {
  let r;
  if (e === "viewport")
    r = kS(n, t);
  else if (e === "document")
    r = SS(St(n));
  else if (at(e))
    r = TS(e, t);
  else {
    const i = oh(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return Ui(r);
}
function ah(n, e) {
  const t = Yt(n);
  return t === e || !at(t) || Gn(t) ? !1 : ct(t).position === "fixed" || ah(t, e);
}
function ES(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = $r(n, [], !1).filter((l) => at(l) && On(l) !== "body"), i = null;
  const s = ct(n).position === "fixed";
  let o = s ? Yt(n) : n;
  for (; at(o) && !Gn(o); ) {
    const l = ct(o), a = jl(o);
    !a && l.position === "fixed" && (i = null), (s ? !a && !i : !a && l.position === "static" && !!i && CS.has(i.position) || Yr(o) && !a && ah(n, o)) ? r = r.filter((u) => u !== o) : i = l, o = Yt(o);
  }
  return e.set(n, r), r;
}
function MS(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? ys(e) ? [] : ES(e, this._c) : [].concat(t), r], l = o[0], a = o.reduce((c, u) => {
    const d = qc(e, u, i);
    return c.top = Je(d.top, c.top), c.right = Xt(d.right, c.right), c.bottom = Xt(d.bottom, c.bottom), c.left = Je(d.left, c.left), c;
  }, qc(e, l, i));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function OS(n) {
  const {
    width: e,
    height: t
  } = sh(n);
  return {
    width: e,
    height: t
  };
}
function AS(n, e, t) {
  const r = bt(e), i = St(e), s = t === "fixed", o = xn(n, !0, s, e);
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = pt(0);
  function c() {
    a.x = bs(i);
  }
  if (r || !r && !s)
    if ((On(e) !== "body" || Yr(i)) && (l = vs(e)), r) {
      const h = xn(e, !0, s, e);
      a.x = h.x + e.clientLeft, a.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? lh(i, l) : pt(0), d = o.left + l.scrollLeft - a.x - u.x, f = o.top + l.scrollTop - a.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function so(n) {
  return ct(n).position === "static";
}
function Wc(n, e) {
  if (!bt(n) || ct(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return St(n) === t && (t = t.ownerDocument.body), t;
}
function ch(n, e) {
  const t = Ye(n);
  if (ys(n))
    return t;
  if (!bt(n)) {
    let i = Yt(n);
    for (; i && !Gn(i); ) {
      if (at(i) && !so(i))
        return i;
      i = Yt(i);
    }
    return t;
  }
  let r = Wc(n, e);
  for (; r && dS(r) && so(r); )
    r = Wc(r, e);
  return r && Gn(r) && so(r) && !jl(r) ? t : r || gS(n) || t;
}
const DS = async function(n) {
  const e = this.getOffsetParent || ch, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: AS(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function PS(n) {
  return ct(n).direction === "rtl";
}
const _S = {
  convertOffsetParentRelativeRectToViewportRelativeRect: wS,
  getDocumentElement: St,
  getClippingRect: MS,
  getOffsetParent: ch,
  getElementRects: DS,
  getClientRects: xS,
  getDimensions: OS,
  getScale: Wn,
  isElement: at,
  isRTL: PS
};
function uh(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function NS(n, e) {
  let t = null, r;
  const i = St(n);
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
    const p = ui(d), m = ui(i.clientWidth - (u + f)), g = ui(i.clientHeight - (d + h)), y = ui(u), S = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -y + "px",
      threshold: Je(0, Xt(1, a)) || 1
    };
    let b = !0;
    function k(C) {
      const x = C[0].intersectionRatio;
      if (x !== a) {
        if (!b)
          return o();
        x ? o(!1, x) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !uh(c, n.getBoundingClientRect()) && o(), b = !1;
    }
    try {
      t = new IntersectionObserver(k, {
        ...S,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(k, S);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function IS(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: l = typeof IntersectionObserver == "function",
    animationFrame: a = !1
  } = r, c = Kl(n), u = i || s ? [...c ? $r(c) : [], ...$r(e)] : [];
  u.forEach((y) => {
    i && y.addEventListener("scroll", t, {
      passive: !0
    }), s && y.addEventListener("resize", t);
  });
  const d = c && l ? NS(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((y) => {
    let [w] = y;
    w && w.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var S;
      (S = h) == null || S.observe(e);
    })), t();
  }), c && !a && h.observe(c), h.observe(e));
  let p, m = a ? xn(n) : null;
  a && g();
  function g() {
    const y = xn(n);
    m && !uh(m, y) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    u.forEach((w) => {
      i && w.removeEventListener("scroll", t), s && w.removeEventListener("resize", t);
    }), d?.(), (y = h) == null || y.disconnect(), h = null, a && cancelAnimationFrame(p);
  };
}
const RS = sS, $S = oS, Hc = nS, BS = aS, LS = rS, FS = tS, zS = lS, VS = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: _S,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return eS(n, e, {
    ...i,
    platform: s
  });
};
function qS(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function jo(n) {
  if (qS(n)) {
    const e = n.$el;
    return Hl(e) && On(e) === "#comment" ? null : e;
  }
  return n;
}
function Fn(n) {
  return typeof n == "function" ? n() : v(n);
}
function WS(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = jo(Fn(n.element));
      return t == null ? {} : FS({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function dh(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function jc(n, e) {
  const t = dh(n);
  return Math.round(e * t) / t;
}
function HS(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = A(() => {
    var x;
    return (x = Fn(t.open)) != null ? x : !0;
  }), s = A(() => Fn(t.middleware)), o = A(() => {
    var x;
    return (x = Fn(t.placement)) != null ? x : "bottom";
  }), l = A(() => {
    var x;
    return (x = Fn(t.strategy)) != null ? x : "absolute";
  }), a = A(() => {
    var x;
    return (x = Fn(t.transform)) != null ? x : !0;
  }), c = A(() => jo(n.value)), u = A(() => jo(e.value)), d = P(0), f = P(0), h = P(l.value), p = P(o.value), m = gn({}), g = P(!1), y = A(() => {
    const x = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return x;
    const E = jc(u.value, d.value), T = jc(u.value, f.value);
    return a.value ? {
      ...x,
      transform: "translate(" + E + "px, " + T + "px)",
      ...dh(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: E + "px",
      top: T + "px"
    };
  });
  let w;
  function S() {
    if (c.value == null || u.value == null)
      return;
    const x = i.value;
    VS(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: l.value
    }).then((E) => {
      d.value = E.x, f.value = E.y, h.value = E.strategy, p.value = E.placement, m.value = E.middlewareData, g.value = x !== !1;
    });
  }
  function b() {
    typeof w == "function" && (w(), w = void 0);
  }
  function k() {
    if (b(), r === void 0) {
      S();
      return;
    }
    if (c.value != null && u.value != null) {
      w = r(c.value, u.value, S);
      return;
    }
  }
  function C() {
    i.value || (g.value = !1);
  }
  return re([s, o, l, i], S, {
    flush: "sync"
  }), re([c, u], k, {
    flush: "sync"
  }), re(i, C, {
    flush: "sync"
  }), pu() && mu(b), {
    x: Pn(d),
    y: Pn(f),
    strategy: Pn(h),
    placement: Pn(p),
    middlewareData: Pn(m),
    isPositioned: Pn(g),
    floatingStyles: y,
    update: S
  };
}
const jS = {
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
}, [eM, US] = xt("PopperContent");
var KS = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ pp({
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
  }, { ...jS }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = th(), { forwardRef: s, currentElement: o } = me(), l = P(), a = P(), { width: c, height: u } = Hw(a), d = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = A(() => ({
      padding: f.value,
      boundary: h.value.filter(zx),
      altBoundary: h.value.length > 0
    })), m = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = yw(() => [
      RS({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Hc({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && $S({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? zS() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Hc({
        ...p.value,
        ...m.value
      }),
      BS({
        ...p.value,
        apply: ({ elements: R, rects: q, availableWidth: _, availableHeight: $ }) => {
          const { width: te, height: X } = q.reference, ie = R.floating.style;
          ie.setProperty("--reka-popper-available-width", `${_}px`), ie.setProperty("--reka-popper-available-height", `${$}px`), ie.setProperty("--reka-popper-anchor-width", `${te}px`), ie.setProperty("--reka-popper-anchor-height", `${X}px`);
        }
      }),
      a.value && WS({
        element: a.value,
        padding: t.arrowPadding
      }),
      Vx({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && LS({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), y = A(() => t.reference ?? i.anchor.value), { floatingStyles: w, placement: S, isPositioned: b, middlewareData: k } = HS(y, l, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => IS(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), C = A(() => Vo(S.value)[0]), x = A(() => Vo(S.value)[1]);
    bu(() => {
      b.value && r("placed");
    });
    const E = A(() => {
      const R = k.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), T = P("");
    je(() => {
      o.value && (T.value = window.getComputedStyle(o.value).zIndex);
    });
    const M = A(() => k.value.arrow?.x ?? 0), I = A(() => k.value.arrow?.y ?? 0);
    return US({
      placedSide: C,
      onArrowChange: (R) => a.value = R,
      arrowX: M,
      arrowY: I,
      shouldHideArrow: E
    }), (R, q) => (O(), K("div", {
      ref_key: "floatingRef",
      ref: l,
      "data-reka-popper-content-wrapper": "",
      style: Cn({
        ...v(w),
        transform: v(b) ? v(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: T.value,
        "--reka-popper-transform-origin": [v(k).transformOrigin?.x, v(k).transformOrigin?.y].join(" "),
        ...v(k).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [F(v(he), ce({ ref: v(s) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": C.value,
      "data-align": x.value,
      style: { animation: v(b) ? void 0 : "none" }
    }), {
      default: N(() => [G(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), JS = KS;
function XS(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => xr(r, e, t)) : xr(n, e, t);
}
function xr(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Vi(n, e);
}
const [fh, YS] = xt("ListboxRoot");
var GS = /* @__PURE__ */ L({
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
    const r = n, i = t, { multiple: s, highlightOnHover: o, orientation: l, disabled: a, selectionBehavior: c, dir: u } = tr(r), { getItems: d } = en({ isProvider: !0 }), { handleTypeaheadSearch: f } = Fl(), { primitiveElement: h, currentElement: p } = Wi(), m = Ww(), g = Ff(u), y = zf(p), w = P(), S = P(!1), b = P(!0), k = /* @__PURE__ */ qi(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function C(V) {
      if (S.value = !0, r.multiple) {
        const U = Array.isArray(k.value) ? [...k.value] : [], Z = U.findIndex((se) => xr(se, V, r.by));
        r.selectionBehavior === "toggle" ? (Z === -1 ? U.push(V) : U.splice(Z, 1), k.value = U) : (k.value = [V], w.value = V);
      } else r.selectionBehavior === "toggle" && xr(k.value, V, r.by) ? k.value = void 0 : k.value = V;
      setTimeout(() => {
        S.value = !1;
      }, 1);
    }
    const x = P(null), E = P(null), T = P(!1), M = P(!1), I = /* @__PURE__ */ Zs(), R = /* @__PURE__ */ Zs(), q = /* @__PURE__ */ Zs();
    function _() {
      return d().map((V) => V.ref).filter((V) => V.dataset.disabled !== "");
    }
    function $(V, U = !0) {
      if (!V) return;
      x.value = V, b.value && x.value.focus(), U && x.value.scrollIntoView({ block: "nearest" });
      const Z = d().find((se) => se.ref === V);
      i("highlight", Z);
    }
    function te(V) {
      if (T.value) q.trigger(V);
      else {
        const U = d().find((Z) => xr(Z.value, V, r.by));
        U && (x.value = U.ref, $(U.ref));
      }
    }
    function X(V) {
      x.value && x.value.isConnected && (V.preventDefault(), V.stopPropagation(), M.value || x.value.click());
    }
    function ie(V) {
      if (b.value) {
        if (S.value = !0, T.value) R.trigger(V);
        else {
          const U = V.altKey || V.ctrlKey || V.metaKey;
          if (U && V.key === "a" && s.value) {
            const Z = d(), se = Z.map((ut) => ut.value);
            k.value = [...se], V.preventDefault(), $(Z[Z.length - 1].ref);
          } else if (!U) {
            const Z = f(V.key, d());
            Z && $(Z);
          }
        }
        setTimeout(() => {
          S.value = !1;
        }, 1);
      }
    }
    function de() {
      M.value = !0;
    }
    function Le() {
      ye(() => {
        M.value = !1;
      });
    }
    function An() {
      ye(() => {
        const V = new KeyboardEvent("keydown", { key: "PageUp" });
        nn(V);
      });
    }
    function st(V) {
      const U = x.value;
      U?.isConnected && (E.value = U), x.value = null, i("leave", V);
    }
    function Dn(V) {
      const U = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (V.currentTarget?.dispatchEvent(U), i("entryFocus", U), !U.defaultPrevented)
        if (E.value) $(E.value);
        else {
          const Z = _()?.[0];
          $(Z);
        }
    }
    function nn(V) {
      const U = Dx(V, l.value, g.value);
      if (!U) return;
      let Z = _();
      if (x.value) {
        if (U === "last") Z.reverse();
        else if (U === "prev" || U === "next") {
          U === "prev" && Z.reverse();
          const se = Z.indexOf(x.value);
          Z = Z.slice(se + 1);
        }
        Ds(V, Z[0]);
      }
      if (Z.length) {
        const se = !x.value && U === "prev" ? Z.length - 1 : 0;
        $(Z[se]);
      }
      if (T.value) return R.trigger(V);
    }
    function Ds(V, U) {
      if (!(T.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(k.value) || (V.altKey || V.ctrlKey || V.metaKey) && !V.shiftKey) && V.shiftKey) {
        const se = d().filter((kt) => kt.ref.dataset.disabled !== "");
        let ut = se.find((kt) => kt.ref === U)?.value;
        if (V.key === m.END ? ut = se[se.length - 1].value : V.key === m.HOME && (ut = se[0].value), !ut || !w.value) return;
        const sr = gw(se.map((kt) => kt.value), w.value, ut);
        k.value = sr;
      }
    }
    async function Ps(V) {
      if (await ye(), T.value) I.trigger(V);
      else {
        const U = _(), Z = U.find((se) => se.dataset.state === "checked");
        Z ? $(Z) : U.length && $(U[0]);
      }
    }
    return re(k, () => {
      S.value || ye(() => {
        Ps();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: x,
      highlightItem: te,
      highlightFirstItem: An,
      highlightSelected: Ps,
      getItems: d
    }), YS({
      modelValue: k,
      onValueChange: C,
      multiple: s,
      orientation: l,
      dir: g,
      disabled: a,
      highlightOnHover: o,
      highlightedElement: x,
      isVirtual: T,
      virtualFocusHook: I,
      virtualKeydownHook: R,
      virtualHighlightHook: q,
      by: r.by,
      firstValue: w,
      selectionBehavior: c,
      focusable: b,
      onLeave: st,
      onEnter: Dn,
      changeHighlight: $,
      onKeydownEnter: X,
      onKeydownNavigation: nn,
      onKeydownTypeAhead: ie,
      onCompositionStart: de,
      onCompositionEnd: Le,
      highlightFirstItem: An
    }), (V, U) => (O(), z(v(he), {
      ref_key: "primitiveElement",
      ref: h,
      as: V.as,
      "as-child": V.asChild,
      dir: v(g),
      "data-disabled": v(a) ? "" : void 0,
      onPointerleave: st,
      onFocusout: U[0] || (U[0] = async (Z) => {
        const se = Z.relatedTarget || Z.target;
        await ye(), x.value && v(p) && !v(p).contains(se) && st(Z);
      })
    }, {
      default: N(() => [G(V.$slots, "default", { modelValue: v(k) }), v(y) && V.name ? (O(), z(v(Ix), {
        key: 0,
        name: V.name,
        value: v(k),
        disabled: v(a),
        required: V.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : ee("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), ZS = GS, QS = /* @__PURE__ */ L({
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
    const { CollectionSlot: e } = en(), t = fh(), r = If(!1, 10);
    return (i, s) => (O(), z(v(e), null, {
      default: N(() => [F(v(he), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: v(t).focusable.value ? v(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(t).orientation.value,
        "aria-multiselectable": !!v(t).multiple.value,
        "data-orientation": v(t).orientation.value,
        onMousedown: s[0] || (s[0] = un((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          v(r) || v(t).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = po((o) => {
            v(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || v(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), v(t).focusable.value && v(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          po(v(t).onKeydownEnter, ["enter"]),
          v(t).onKeydownTypeAhead
        ]
      }, {
        default: N(() => [G(i.$slots, "default")]),
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
}), e1 = QS;
const t1 = "listbox.select", [n1, r1] = xt("ListboxItem");
var i1 = /* @__PURE__ */ L({
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
    const t = n, r = e, i = Rr(void 0, "reka-listbox-item"), { CollectionItem: s } = en(), { forwardRef: o, currentElement: l } = me(), a = fh(), c = A(() => l.value === a.highlightedElement.value), u = A(() => XS(a.modelValue.value, t.value, a.by)), d = A(() => a.disabled.value || t.disabled);
    async function f(p) {
      r("select", p), !p?.defaultPrevented && !d.value && p && (a.onValueChange(t.value), a.changeHighlight(l.value));
    }
    function h(p) {
      const m = {
        originalEvent: p,
        value: t.value
      };
      ds(t1, f, m);
    }
    return r1({ isSelected: u }), (p, m) => (O(), z(v(s), { value: p.value }, {
      default: N(() => [mp([c.value, u.value], () => F(v(he), ce({ id: v(i) }, p.$attrs, {
        ref: v(o),
        role: "option",
        tabindex: v(a).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: p.as,
        "as-child": p.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: h,
        onKeydown: po(un(h, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(a).highlightedElement.value !== v(l) && v(a).highlightOnHover.value && !v(a).focusable.value && v(a).changeHighlight(v(l), !1);
        })
      }), {
        default: N(() => [G(p.$slots, "default")]),
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
}), s1 = i1, o1 = /* @__PURE__ */ L({
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
    me();
    const t = n1();
    return (r, i) => v(t).isSelected.value ? (O(), z(v(he), ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16)) : ee("v-if", !0);
  }
}), l1 = o1;
function a1(n) {
  const e = fs({ nonce: P() });
  return A(() => n?.value || e.nonce?.value);
}
const c1 = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], u1 = [" ", "Enter"], ot = 10;
function Br(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => Uo(r, e, t)) : Uo(n, e, t);
}
function Uo(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Vi(n, e);
}
function d1(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const f1 = {
  key: 0,
  value: ""
}, [tn, hh] = xt("SelectRoot");
var h1 = /* @__PURE__ */ L({
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
    const t = n, r = e, { required: i, disabled: s, multiple: o, dir: l } = tr(t), a = /* @__PURE__ */ qi(t, "modelValue", r, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ qi(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), u = P(), d = P(), f = P({
      x: 0,
      y: 0
    }), h = A(() => o.value && Array.isArray(a.value) ? a.value?.length === 0 : Lo(a.value));
    en({ isProvider: !0 });
    const p = Ff(l), m = zf(u), g = P(/* @__PURE__ */ new Set()), y = A(() => Array.from(g.value).map((b) => b.value).join(";"));
    function w(b) {
      if (o.value) {
        const k = Array.isArray(a.value) ? [...a.value] : [], C = k.findIndex((x) => Uo(x, b, t.by));
        C === -1 ? k.push(b) : k.splice(C, 1), a.value = [...k];
      } else a.value = b;
    }
    function S(b) {
      return Array.from(g.value).find((k) => Br(b, k.value, t.by));
    }
    return hh({
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
        const k = S(b.value);
        k && g.value.delete(k), g.value.add(b);
      },
      onOptionRemove: (b) => {
        const k = S(b.value);
        k && g.value.delete(k);
      }
    }), (b, k) => (O(), z(v(Bx), null, {
      default: N(() => [G(b.$slots, "default", {
        modelValue: v(a),
        open: v(c)
      }), v(m) ? (O(), z(g1, {
        key: y.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(i),
        name: b.name,
        autocomplete: b.autocomplete,
        disabled: v(s),
        value: v(a)
      }, {
        default: N(() => [v(Lo)(v(a)) ? (O(), K("option", f1)) : ee("v-if", !0), (O(!0), K(tt, null, Tn(Array.from(g.value), (C) => (O(), K("option", ce({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : ee("v-if", !0)]),
      _: 3
    }));
  }
}), p1 = h1, m1 = /* @__PURE__ */ L({
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
    const e = n, t = P(), r = tn();
    re(() => e.value, (s, o) => {
      const l = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (s !== o && c && t.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(t.value, s), t.value.dispatchEvent(u);
      }
    });
    function i(s) {
      r.onValueChange(s.target.value);
    }
    return (s, o) => (O(), z(v(eh), { "as-child": "" }, {
      default: N(() => [J("select", ce({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: i }), [G(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), g1 = m1, y1 = /* @__PURE__ */ L({
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
      default: ot
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
    const t = Ll(n);
    return (r, i) => (O(), z(v(JS), ce(v(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), v1 = y1;
const b1 = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [ws, ph] = xt("SelectContent");
var w1 = /* @__PURE__ */ L({
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
    const t = n, r = e, i = tn();
    $w(), Bf(t.bodyLock);
    const { CollectionSlot: s, getItems: o } = en(), l = P();
    qf(l);
    const { search: a, handleTypeaheadSearch: c } = Fl(), u = P(), d = P(), f = P(), h = P(!1), p = P(!1), m = P(!1);
    function g() {
      d.value && l.value && _c([d.value, l.value]);
    }
    re(h, () => {
      g();
    });
    const { onOpenChange: y, triggerPointerDownPosRef: w } = i;
    je((C) => {
      if (!l.value) return;
      let x = {
        x: 0,
        y: 0
      };
      const E = (M) => {
        x = {
          x: Math.abs(Math.round(M.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(M.pageY) - (w.value?.y ?? 0))
        };
      }, T = (M) => {
        M.pointerType !== "touch" && (x.x <= 10 && x.y <= 10 ? M.preventDefault() : l.value?.contains(M.target) || y(!1), document.removeEventListener("pointermove", E), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", E), document.addEventListener("pointerup", T, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function S(C) {
      const x = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !x && C.key.length === 1 && c(C.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let T = [...o().map((M) => M.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (T = T.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const M = C.target, I = T.indexOf(M);
          T = T.slice(I + 1);
        }
        setTimeout(() => _c(T)), C.preventDefault();
      }
    }
    const b = A(() => t.position === "popper" ? t : {}), k = Ll(b.value);
    return ph({
      content: l,
      viewport: u,
      onViewportChange: (C) => {
        u.value = C;
      },
      itemRefCallback: (C, x, E) => {
        const T = !p.value && !E, M = Br(i.modelValue.value, x, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (M || T) && (d.value = C, M && (m.value = !0));
        } else (M || T) && (d.value = C);
        T && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        l.value?.focus();
      },
      itemTextRefCallback: (C, x, E) => {
        const T = !p.value && !E;
        (Br(i.modelValue.value, x, i.by) || T) && (f.value = C);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: h,
      searchRef: a
    }), (C, x) => (O(), z(v(s), null, {
      default: N(() => [F(v(Kf), {
        "as-child": "",
        onMountAutoFocus: x[6] || (x[6] = un(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: x[7] || (x[7] = (E) => {
          r("closeAutoFocus", E), !E.defaultPrevented && (v(i).triggerElement.value?.focus({ preventScroll: !0 }), E.preventDefault());
        })
      }, {
        default: N(() => [F(v(jf), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: x[2] || (x[2] = un(() => {
          }, ["prevent"])),
          onDismiss: x[3] || (x[3] = (E) => v(i).onOpenChange(!1)),
          onEscapeKeyDown: x[4] || (x[4] = (E) => r("escapeKeyDown", E)),
          onPointerDownOutside: x[5] || (x[5] = (E) => r("pointerDownOutside", E))
        }, {
          default: N(() => [(O(), z(gp(C.position === "popper" ? v1 : T1), ce({
            ...C.$attrs,
            ...v(k)
          }, {
            id: v(i).contentId,
            ref: (E) => {
              const T = v(vt)(E);
              T?.hasAttribute("data-reka-popper-content-wrapper") ? l.value = T.firstElementChild : l.value = T;
            },
            role: "listbox",
            "data-state": v(i).open.value ? "open" : "closed",
            dir: v(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: x[0] || (x[0] = un(() => {
            }, ["prevent"])),
            onPlaced: x[1] || (x[1] = (E) => h.value = !0),
            onKeydown: S
          }), {
            default: N(() => [G(C.$slots, "default")]),
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
}), x1 = w1;
const [S1, k1] = xt("SelectItemAlignedPosition");
var C1 = /* @__PURE__ */ L({
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
    const t = n, r = e, { getItems: i } = en(), s = tn(), o = ws(), l = P(!1), a = P(!0), c = P(), { forwardRef: u, currentElement: d } = me(), { viewport: f, selectedItem: h, selectedItemText: p, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && h?.value && p?.value) {
        const S = s.triggerElement.value.getBoundingClientRect(), b = d.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const V = C.left - b.left, U = k.left - V, Z = S.left - U, se = S.width + Z, ut = Math.max(se, b.width), sr = window.innerWidth - ot, kt = Ec(U, ot, Math.max(ot, sr - ut));
          c.value.style.minWidth = `${se}px`, c.value.style.left = `${kt}px`;
        } else {
          const V = b.right - C.right, U = window.innerWidth - k.right - V, Z = window.innerWidth - S.right - U, se = S.width + Z, ut = Math.max(se, b.width), sr = window.innerWidth - ot, kt = Ec(U, ot, Math.max(ot, sr - ut));
          c.value.style.minWidth = `${se}px`, c.value.style.right = `${kt}px`;
        }
        const x = i().map((V) => V.ref), E = window.innerHeight - ot * 2, T = f.value.scrollHeight, M = window.getComputedStyle(d.value), I = Number.parseInt(M.borderTopWidth, 10), R = Number.parseInt(M.paddingTop, 10), q = Number.parseInt(M.borderBottomWidth, 10), _ = Number.parseInt(M.paddingBottom, 10), $ = I + R + T + _ + q, te = Math.min(h.value.offsetHeight * 5, $), X = window.getComputedStyle(f.value), ie = Number.parseInt(X.paddingTop, 10), de = Number.parseInt(X.paddingBottom, 10), Le = S.top + S.height / 2 - ot, An = E - Le, st = h.value.offsetHeight / 2, Dn = h.value.offsetTop + st, nn = I + R + Dn, Ds = $ - nn;
        if (nn <= Le) {
          const V = h.value === x[x.length - 1];
          c.value.style.bottom = "0px";
          const U = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, Z = Math.max(An, st + (V ? de : 0) + U + q), se = nn + Z;
          c.value.style.height = `${se}px`;
        } else {
          const V = h.value === x[0];
          c.value.style.top = "0px";
          const Z = Math.max(Le, I + f.value.offsetTop + (V ? ie : 0) + st) + Ds;
          c.value.style.height = `${Z}px`, f.value.scrollTop = nn - Le + f.value.offsetTop;
        }
        c.value.style.margin = `${ot}px 0`, c.value.style.minHeight = `${te}px`, c.value.style.maxHeight = `${E}px`, r("placed"), requestAnimationFrame(() => l.value = !0);
      }
    }
    const y = P("");
    ve(async () => {
      await ye(), g(), d.value && (y.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(S) {
      S && a.value === !0 && (g(), m?.(), a.value = !1);
    }
    return Pw(s.triggerElement, () => {
      g();
    }), k1({
      contentWrapper: c,
      shouldExpandOnScrollRef: l,
      onScrollButtonChange: w
    }), (S, b) => (O(), K("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: Cn({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: y.value
      })
    }, [F(v(he), ce({
      ref: v(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...S.$attrs,
      ...t
    }), {
      default: N(() => [G(S.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), T1 = C1, E1 = /* @__PURE__ */ L({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return hh(n.context), ph(b1), (t, r) => G(t.$slots, "default");
  }
}), M1 = E1;
const O1 = { key: 1 };
var A1 = /* @__PURE__ */ L({
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
    const t = n, i = Bw(t, e), s = tn(), o = P();
    ve(() => {
      o.value = new DocumentFragment();
    });
    const l = P(), a = A(() => t.forceMount || s.open.value), c = P(a.value);
    return re(a, () => {
      setTimeout(() => c.value = a.value);
    }), (u, d) => a.value || c.value || l.value?.present ? (O(), z(v(zl), {
      key: 0,
      ref_key: "presenceRef",
      ref: l,
      present: a.value
    }, {
      default: N(() => [F(x1, sl(ol({
        ...v(i),
        ...u.$attrs
      })), {
        default: N(() => [G(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (O(), K("div", O1, [(O(), z(vu, { to: o.value }, [F(M1, { context: v(s) }, {
      default: N(() => [G(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : ee("v-if", !0);
  }
}), D1 = A1, P1 = /* @__PURE__ */ L({
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
    return (e, t) => (O(), z(v(he), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: N(() => [G(e.$slots, "default", {}, () => [t[0] || (t[0] = He("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), _1 = P1;
const [mh, N1] = xt("SelectItem");
var I1 = /* @__PURE__ */ L({
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
    const t = n, r = e, { disabled: i } = tr(t), s = tn(), o = ws(), { forwardRef: l, currentElement: a } = me(), { CollectionItem: c } = en(), u = A(() => Br(s.modelValue?.value, t.value, s.by)), d = P(!1), f = P(t.textValue ?? ""), h = Rr(void 0, "reka-select-item-text"), p = "select.select";
    async function m(b) {
      if (b.defaultPrevented) return;
      const k = {
        originalEvent: b,
        value: t.value
      };
      ds(p, g, k);
    }
    async function g(b) {
      await ye(), r("select", b), !b.defaultPrevented && (i.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function y(b) {
      await ye(), !b.defaultPrevented && (i.value ? o.onItemLeave?.() : b.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(b) {
      await ye(), !b.defaultPrevented && b.currentTarget === it() && o.onItemLeave?.();
    }
    async function S(b) {
      await ye(), !(b.defaultPrevented || o.searchRef?.value !== "" && b.key === " ") && (u1.includes(b.key) && m(b), b.key === " " && b.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return ve(() => {
      a.value && o.itemRefCallback(a.value, t.value, t.disabled);
    }), N1({
      value: t.value,
      disabled: i,
      textId: h,
      isSelected: u,
      onItemTextChange: (b) => {
        f.value = ((f.value || b?.textContent) ?? "").trim();
      }
    }), (b, k) => (O(), z(v(c), { value: { textValue: f.value } }, {
      default: N(() => [F(v(he), {
        ref: v(l),
        role: "option",
        "aria-labelledby": v(h),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": v(i) || void 0,
        "data-disabled": v(i) ? "" : void 0,
        tabindex: v(i) ? void 0 : -1,
        as: b.as,
        "as-child": b.asChild,
        onFocus: k[0] || (k[0] = (C) => d.value = !0),
        onBlur: k[1] || (k[1] = (C) => d.value = !1),
        onPointerup: m,
        onPointerdown: k[2] || (k[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: k[3] || (k[3] = un(() => {
        }, ["prevent", "stop"])),
        onPointermove: y,
        onPointerleave: w,
        onKeydown: S
      }, {
        default: N(() => [G(b.$slots, "default")]),
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
}), R1 = I1, $1 = /* @__PURE__ */ L({
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
    const e = n, t = mh();
    return (r, i) => v(t).isSelected.value ? (O(), z(v(he), ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16)) : ee("v-if", !0);
  }
}), B1 = $1, L1 = /* @__PURE__ */ L({
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
    const e = n, t = tn(), r = ws(), i = mh(), { forwardRef: s, currentElement: o } = me(), l = A(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return ve(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), t.onOptionAdd(l.value));
    }), Ur(() => {
      t.onOptionRemove(l.value);
    }), (a, c) => (O(), z(v(he), ce({
      id: v(i).textId,
      ref: v(s)
    }, {
      ...e,
      ...a.$attrs
    }), {
      default: N(() => [G(a.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), F1 = L1, z1 = /* @__PURE__ */ L({
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
    return (t, r) => (O(), z(v(Gf), sl(ol(e)), {
      default: N(() => [G(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), V1 = z1, q1 = /* @__PURE__ */ L({
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
    const e = n, t = tn(), { forwardRef: r, currentElement: i } = me(), s = A(() => t.disabled?.value || e.disabled);
    t.contentId ||= Rr(void 0, "reka-select-content"), ve(() => {
      t.onTriggerChange(i.value);
    });
    const { getItems: o } = en(), { search: l, handleTypeaheadSearch: a, resetTypeahead: c } = Fl();
    function u() {
      s.value || (t.onOpenChange(!0), c());
    }
    function d(f) {
      u(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, h) => (O(), z(v(Fx), {
      "as-child": "",
      reference: f.reference
    }, {
      default: N(() => [F(v(he), {
        ref: v(r),
        role: "combobox",
        type: f.as === "button" ? "button" : void 0,
        "aria-controls": v(t).contentId,
        "aria-expanded": v(t).open.value || !1,
        "aria-required": v(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: v(t)?.dir.value,
        "data-state": v(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": v(d1)(v(t).modelValue?.value) ? "" : void 0,
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
        onPointerup: h[2] || (h[2] = un((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: h[3] || (h[3] = (p) => {
          const m = v(l) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && m && p.key === " " || (v(a)(p.key, v(o)()), v(c1).includes(p.key) && (u(), p.preventDefault()));
        })
      }, {
        default: N(() => [G(f.$slots, "default")]),
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
}), W1 = q1, H1 = /* @__PURE__ */ L({
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
    const e = n, { forwardRef: t, currentElement: r } = me(), i = tn();
    ve(() => {
      i.valueElement = r;
    });
    const s = A(() => {
      let l = [];
      const a = Array.from(i.optionsSet.value), c = (u) => a.find((d) => Br(u, d.value, i.by));
      return Array.isArray(i.modelValue.value) ? l = i.modelValue.value.map((u) => c(u)?.textContent ?? "") : l = [c(i.modelValue.value)?.textContent ?? ""], l.filter(Boolean);
    }), o = A(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (l, a) => (O(), z(v(he), {
      ref: v(t),
      as: l.as,
      "as-child": l.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: N(() => [G(l.$slots, "default", {
        selectedLabel: s.value,
        modelValue: v(i).modelValue.value
      }, () => [He(ne(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), j1 = H1, U1 = /* @__PURE__ */ L({
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
    const e = n, { nonce: t } = tr(e), r = a1(t), i = ws(), s = i.position === "item-aligned" ? S1() : void 0, { forwardRef: o, currentElement: l } = me();
    ve(() => {
      i?.onViewportChange(l.value);
    });
    const a = P(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: h } = s ?? {};
      if (f?.value && h?.value) {
        const p = Math.abs(a.value - d.scrollTop);
        if (p > 0) {
          const m = window.innerHeight - ot * 2, g = Number.parseFloat(h.value.style.minHeight), y = Number.parseFloat(h.value.style.height), w = Math.max(g, y);
          if (w < m) {
            const S = w + p, b = Math.min(m, S), k = S - b;
            h.value.style.height = `${b}px`, h.value.style.bottom === "0px" && (d.scrollTop = k > 0 ? k : 0, h.value.style.justifyContent = "flex-end");
          }
        }
      }
      a.value = d.scrollTop;
    }
    return (u, d) => (O(), K(tt, null, [F(v(he), ce({
      ref: v(o),
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
      default: N(() => [G(u.$slots, "default")]),
      _: 3
    }, 16), F(v(he), {
      as: "style",
      nonce: v(r)
    }, {
      default: N(() => d[0] || (d[0] = [He(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), K1 = U1;
const J1 = /* @__PURE__ */ L({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, r = P(), i = P([]);
    return ve(() => {
      const s = r.value?.closest(".speaker-sidebar");
      s && (i.value = [s]);
    }), (s, o) => (O(), K("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: r
    }, [
      F(v(p1), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (l) => t("update:selectedValue", l))
      }, {
        default: N(() => [
          F(v(W1), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: N(() => [
              F(v(j1), { class: "sidebar-select-trigger-label" }),
              F(v(_1), null, {
                default: N(() => [
                  F(v(Jp), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          F(v(V1), { disabled: "" }, {
            default: N(() => [
              F(v(D1), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": i.value
              }, {
                default: N(() => [
                  F(v(K1), null, {
                    default: N(() => [
                      (O(!0), K(tt, null, Tn(n.items, (l) => (O(), z(v(R1), {
                        key: l.value,
                        value: l.value,
                        class: "sidebar-select-item"
                      }, {
                        default: N(() => [
                          F(v(B1), { class: "sidebar-select-item-indicator" }, {
                            default: N(() => [
                              F(v(Su), { size: 14 })
                            ]),
                            _: 1
                          }),
                          F(v(F1), null, {
                            default: N(() => [
                              He(ne(l.label), 1)
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
}), X1 = { class: "sidebar-select" }, Y1 = ["aria-label"], G1 = { class: "sidebar-select-trigger-label" }, Z1 = /* @__PURE__ */ L({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = P(!1), s = A(
      () => t.items.find((l) => l.value === t.selectedValue)?.label ?? ""
    );
    function o(l) {
      r("update:selectedValue", l), i.value = !1;
    }
    return (l, a) => (O(), K("div", X1, [
      J("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: a[0] || (a[0] = (c) => i.value = !0)
      }, [
        J("span", G1, ne(s.value), 1)
      ], 8, Y1),
      F(v(Wf), {
        open: i.value,
        "onUpdate:open": a[2] || (a[2] = (c) => i.value = c)
      }, {
        default: N(() => [
          F(v(Zf), { disabled: "" }, {
            default: N(() => [
              F(v(Yf), { class: "editor-overlay" }),
              F(v(Xf), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: N(() => [
                  F(v(Qf), { class: "sr-only" }, {
                    default: N(() => [
                      He(ne(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  a[3] || (a[3] = J("div", { class: "sheet-handle" }, null, -1)),
                  F(v(ZS), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": a[1] || (a[1] = (c) => o(c))
                  }, {
                    default: N(() => [
                      F(v(e1), { class: "sheet-list" }, {
                        default: N(() => [
                          (O(!0), K(tt, null, Tn(n.items, (c) => (O(), z(v(s1), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: N(() => [
                              F(v(l1), { class: "sheet-item-indicator" }, {
                                default: N(() => [
                                  F(v(Su), { size: 16 })
                                ]),
                                _: 1
                              }),
                              J("span", null, ne(c.label), 1)
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
}), Jl = /* @__PURE__ */ L({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: r } = Nf();
    return (i, s) => v(r) ? (O(), z(Z1, ce({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
    }), null, 16)) : (O(), z(J1, ce({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => t("update:selectedValue", o))
    }), null, 16));
  }
}), gh = /* @__PURE__ */ L({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = wt(), s = A(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, l) => (O(), z(Jl, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: v(i)("header.channelLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (a) => r("update:selectedChannelId", a))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Q1 = { class: "speaker-sidebar" }, ek = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, tk = { class: "sidebar-title" }, nk = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, rk = { class: "sidebar-title" }, ik = {
  key: 2,
  class: "sidebar-section"
}, sk = { class: "sidebar-title" }, ok = { class: "subtitle-toggle" }, lk = { class: "subtitle-toggle-label" }, ak = { class: "subtitle-slider" }, ck = { class: "subtitle-slider-label" }, uk = { class: "subtitle-slider-value" }, dk = ["value", "disabled"], fk = {
  key: 3,
  class: "sidebar-section"
}, hk = { class: "sidebar-title" }, pk = { class: "speaker-list" }, mk = { class: "speaker-name" }, gk = /* @__PURE__ */ L({
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
    const e = n, t = Nt(), { t: r, locale: i } = wt(), s = A(
      () => wu(e.translations, i.value, r("sidebar.originalLanguage"), r("language.wildcard"))
    );
    return (o, l) => (O(), K("aside", Q1, [
      n.channels.length > 1 ? (O(), K("section", ek, [
        J("h2", tk, ne(v(r)("sidebar.channel")), 1),
        F(gh, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": l[0] || (l[0] = (a) => o.$emit("update:selectedChannelId", a))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : ee("", !0),
      n.translations.length > 1 ? (O(), K("section", nk, [
        J("h2", rk, ne(v(r)("sidebar.translation")), 1),
        F(Jl, {
          items: s.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": l[1] || (l[1] = (a) => o.$emit("update:selectedTranslationId", a))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : ee("", !0),
      v(t).subtitle ? (O(), K("section", ik, [
        J("h2", sk, ne(v(r)("sidebar.subtitle")), 1),
        J("div", ok, [
          J("span", lk, ne(v(r)("subtitle.show")), 1),
          F(hw, {
            modelValue: v(t).subtitle.isVisible.value,
            "onUpdate:modelValue": l[2] || (l[2] = (a) => v(t).subtitle.isVisible.value = a)
          }, null, 8, ["modelValue"])
        ]),
        J("label", ak, [
          J("span", ck, [
            He(ne(v(r)("subtitle.fontSize")) + " ", 1),
            J("span", uk, ne(v(t).subtitle.fontSize.value) + "px", 1)
          ]),
          J("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(t).subtitle.fontSize.value,
            disabled: !v(t).subtitle.isVisible.value,
            onInput: l[3] || (l[3] = (a) => v(t).subtitle.fontSize.value = Number(a.target.value))
          }, null, 40, dk)
        ])
      ])) : ee("", !0),
      n.speakers.length ? (O(), K("section", fk, [
        J("h2", hk, ne(v(r)("sidebar.speakers")), 1),
        J("ul", pk, [
          (O(!0), K(tt, null, Tn(n.speakers, (a) => (O(), K("li", {
            key: a.id,
            class: "speaker-item"
          }, [
            F(Eu, {
              color: a.color
            }, null, 8, ["color"]),
            J("span", mk, ne(a.name), 1)
          ]))), 128))
        ])
      ])) : ee("", !0)
    ]));
  }
}), Uc = /* @__PURE__ */ Oe(gk, [["__scopeId", "data-v-6e6fa62e"]]), yk = /* @__PURE__ */ L({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = yp(n, "open"), { t } = wt();
    return (r, i) => (O(), z(v(Wf), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: N(() => [
        F(v(Zf), { disabled: "" }, {
          default: N(() => [
            F(v(Yf), { class: "editor-overlay" }),
            F(v(Xf), { class: "sidebar-drawer" }, {
              default: N(() => [
                F(v(Qf), { class: "sr-only" }, {
                  default: N(() => [
                    He(ne(v(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                F(v(Qw), {
                  class: "sidebar-close",
                  "aria-label": v(t)("header.closeSidebar")
                }, {
                  default: N(() => [
                    F(v(ku), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                G(r.$slots, "default")
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
}), vk = { class: "player-controls" }, bk = { class: "controls-left" }, wk = { class: "controls-time" }, xk = { class: "time-display" }, Sk = { class: "time-display" }, kk = { class: "controls-right" }, Ck = ["value", "aria-label", "disabled"], Tk = /* @__PURE__ */ L({
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
    const t = e, { t: r } = wt(), i = P(!1);
    function s(o) {
      const l = o.target;
      t("update:volume", parseFloat(l.value));
    }
    return (o, l) => (O(), K("div", vk, [
      J("div", bk, [
        F(ft, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: l[0] || (l[0] = (a) => t("skipBack"))
        }, {
          icon: N(() => [
            F(v(Zp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        F(ft, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? v(r)("player.pause") : v(r)("player.play"),
          disabled: !n.isReady,
          onClick: l[1] || (l[1] = (a) => t("togglePlay"))
        }, {
          icon: N(() => [
            n.isPlaying ? (O(), z(v(Xp), {
              key: 0,
              size: 20
            })) : (O(), z(v(Yp), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        F(ft, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: l[2] || (l[2] = (a) => t("skipForward"))
        }, {
          icon: N(() => [
            F(v(Qp), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      J("div", wk, [
        J("time", xk, ne(n.currentTime), 1),
        l[7] || (l[7] = J("span", { class: "time-separator" }, "/", -1)),
        J("time", Sk, ne(n.duration), 1)
      ]),
      J("div", kk, [
        J("div", {
          class: "volume-group",
          onMouseenter: l[4] || (l[4] = (a) => i.value = !0),
          onMouseleave: l[5] || (l[5] = (a) => i.value = !1)
        }, [
          F(ft, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? v(r)("player.unmute") : v(r)("player.mute"),
            disabled: !n.isReady,
            onClick: l[3] || (l[3] = (a) => t("toggleMute"))
          }, {
            icon: N(() => [
              n.isMuted ? (O(), z(v(nm), {
                key: 0,
                size: 16
              })) : (O(), z(v(tm), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          vp(J("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": v(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, Ck), [
            [bp, i.value]
          ])
        ], 32),
        F(ft, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(r)("player.speed"),
          disabled: !n.isReady,
          onClick: l[6] || (l[6] = (a) => t("cyclePlaybackRate"))
        }, {
          default: N(() => [
            He(ne(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Ek = /* @__PURE__ */ Oe(Tk, [["__scopeId", "data-v-89b8138f"]]);
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
let Gr = class {
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
const di = { decode: function(n, e) {
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
function yh(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(yh(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Kc(n, e, t) {
  const r = yh(n, e || {});
  return t?.appendChild(r), r;
}
var Mk = Object.freeze({ __proto__: null, createElement: Kc, default: Kc });
const Ok = { fetchBlob: function(n, e, t) {
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
function fe(n) {
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
function on(n, e) {
  const t = fe(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Ft(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class Ak extends Gr {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = fe(!1), this._currentTime = fe(0), this._duration = fe(0), this._volume = fe(this.media.volume), this._muted = fe(this.media.muted), this._playbackRate = fe(this.media.playbackRate || 1), this._seeking = fe(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
function Dk({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), l = o + Math.round(e * t * r) || 1;
  return l < i && (l = i, s || (o = l / 2)), { topHeight: o, totalHeight: l };
}
function Pk({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function Jc(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function vh(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Xc(n, e) {
  if (!vh(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function Yc({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function bh(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function _k(n) {
  const e = fe({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = on((() => (function(s) {
    const { scrollLeft: o, scrollWidth: l, clientWidth: a } = s;
    if (l === 0) return { startX: 0, endX: 1 };
    const c = o / l, u = (o + a) / l;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = on((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), bh(e);
  } };
}
class Nk extends Gr {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Jc(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Jc(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = _k(this.scrollContainer);
    const e = Ft((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, l = fe(null), a = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (a.set(f.pointerId, f), a.size > 1)) return;
        let h = f.clientX, p = f.clientY, m = !1;
        const g = Date.now(), y = t.getBoundingClientRect(), { left: w, top: S } = y, b = (T) => {
          if (T.defaultPrevented || a.size > 1 || c && Date.now() - g < o) return;
          const M = T.clientX, I = T.clientY, R = M - h, q = I - p;
          (m || Math.abs(R) > i || Math.abs(q) > i) && (T.preventDefault(), T.stopPropagation(), m || (l.set({ type: "start", x: h - w, y: p - S }), m = !0), l.set({ type: "move", x: M - w, y: I - S, deltaX: R, deltaY: q }), h = M, p = I);
        }, k = (T) => {
          if (a.delete(T.pointerId), m) {
            const M = T.clientX, I = T.clientY;
            l.set({ type: "end", x: M - w, y: I - S });
          }
          u();
        }, C = (T) => {
          a.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || k(T);
        }, x = (T) => {
          m && (T.stopPropagation(), T.preventDefault());
        }, E = (T) => {
          T.defaultPrevented || a.size > 1 || m && T.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", k), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", k), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", E), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: l, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), a.clear(), bh(l);
      } };
    })(this.wrapper);
    const e = Ft((() => {
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
    const { width: s, height: o } = r.canvas, { halfHeight: l, barWidth: a, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: p, height: m, length: g, options: y, pixelRatio: w }) {
      const S = m / 2, b = y.barWidth ? y.barWidth * w : 1, k = y.barGap ? y.barGap * w : y.barWidth ? b / 2 : 0, C = b + k || 1;
      return { halfHeight: S, barWidth: b, barGap: k, barRadius: y.barRadius || 0, barMinHeight: y.barMinHeight ? y.barMinHeight * w : 0, barIndexScale: g > 0 ? p / C / g : 0, barSpacing: C };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: y, halfHeight: w, vScale: S, canvasHeight: b, barAlign: k, barMinHeight: C }) {
      const x = p[0] || [], E = p[1] || x, T = x.length, M = [];
      let I = 0, R = 0, q = 0;
      for (let _ = 0; _ <= T; _++) {
        const $ = Math.round(_ * m);
        if ($ > I) {
          const { topHeight: ie, totalHeight: de } = Dk({ maxTop: R, maxBottom: q, halfHeight: w, vScale: S, barMinHeight: C, barAlign: k }), Le = Pk({ barAlign: k, halfHeight: w, topHeight: ie, totalHeight: de, canvasHeight: b });
          M.push({ x: I * g, y: Le, width: y, height: de }), I = $, R = 0, q = 0;
        }
        const te = Math.abs(x[_] || 0), X = Math.abs(E[_] || 0);
        te > R && (R = te), X > q && (q = X);
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
        const g = p.length, y = g ? c / g : 0, w = f, S = m === 0 ? -1 : 1, b = [{ x: 0, y: w }];
        let k = 0, C = 0;
        for (let x = 0; x <= g; x++) {
          const E = Math.round(x * y);
          if (E > k) {
            const M = w + (Math.round(C * f * d) || 1) * S;
            b.push({ x: k, y: M }), k = E, C = 0;
          }
          const T = Math.abs(p[x] || 0);
          T > C && (C = T);
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
    vh(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
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
      return Xc(Math.min(8e3, p, m), g);
    })({ clientWidth: a, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = Xc(g, t), g <= 0) return;
      const y = (function({ channelData: w, offset: S, clampedWidth: b, totalWidth: k }) {
        return w.map(((C) => {
          const x = Math.floor(S / k * C.length), E = Math.floor((S + b) / k * C.length);
          return C.slice(x, E);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(y, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (Yc({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Yc({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
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
class Ik extends Gr {
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
class oo extends Gr {
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
const Rk = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Lr extends Ak {
  static create(e) {
    return new Lr(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new oo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Rk, e);
    const { state: r, actions: i } = (function(l) {
      var a, c, u, d, f, h;
      const p = (a = l?.currentTime) !== null && a !== void 0 ? a : fe(0), m = (c = l?.duration) !== null && c !== void 0 ? c : fe(0), g = (u = l?.isPlaying) !== null && u !== void 0 ? u : fe(!1), y = (d = l?.isSeeking) !== null && d !== void 0 ? d : fe(!1), w = (f = l?.volume) !== null && f !== void 0 ? f : fe(1), S = (h = l?.playbackRate) !== null && h !== void 0 ? h : fe(1), b = fe(null), k = fe(null), C = fe(""), x = fe(0), E = fe(0), T = on((() => !g.value), [g]), M = on((() => b.value !== null), [b]), I = on((() => M.value && m.value > 0), [M, m]), R = on((() => p.value), [p]), q = on((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: T, isSeeking: y, volume: w, playbackRate: S, audioBuffer: b, peaks: k, url: C, zoom: x, scrollPosition: E, canPlay: M, isReady: I, progress: R, progressPercent: q }, actions: { setCurrentTime: (_) => {
        const $ = Math.max(0, Math.min(m.value || 1 / 0, _));
        p.set($);
      }, setDuration: (_) => {
        m.set(Math.max(0, _));
      }, setPlaying: (_) => {
        g.set(_);
      }, setSeeking: (_) => {
        y.set(_);
      }, setVolume: (_) => {
        const $ = Math.max(0, Math.min(1, _));
        w.set($);
      }, setPlaybackRate: (_) => {
        const $ = Math.max(0.1, Math.min(16, _));
        S.set($);
      }, setAudioBuffer: (_) => {
        b.set(_), _ && m.set(_.duration);
      }, setPeaks: (_) => {
        k.set(_);
      }, setUrl: (_) => {
        C.set(_);
      }, setZoom: (_) => {
        x.set(Math.max(0, _));
      }, setScrollPosition: (_) => {
        E.set(Math.max(0, _));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new Ik();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new Nk(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      r.push(Ft((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Ft((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Ft((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Ft((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Ft((() => {
        const o = e.isPlaying.value, l = e.currentTime.value, a = e.duration.value, c = a > 0 && l >= a;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Ft((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = di.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = di.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
        t = yield Ok.fetchBlob(e, a, l);
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
        l instanceof oo && (l.duration = o);
      }
      if (r) this.decodedData = di.createBuffer(r, o || 0);
      else if (t) {
        const l = yield t.arrayBuffer();
        this.decodedData = yield di.decode(l, this.options.sampleRate);
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
      return t != null && (this.media instanceof oo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
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
Lr.BasePlugin = class extends Gr {
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
}, Lr.dom = Mk;
class wh {
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
class $k extends wh {
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
function xh(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(xh(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function pr(n, e, t) {
  const r = xh(n, e || {});
  return t?.appendChild(r), r;
}
function Sh(n) {
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
function vi(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Rn(n, e) {
  const t = Sh(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function rn(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function bi(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = Sh(null), o = /* @__PURE__ */ new Map(), l = matchMedia("(pointer: coarse)").matches;
  let a = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: y } = m, w = (x) => {
      if (x.defaultPrevented || o.size > 1 || l && Date.now() - p < i) return;
      const E = x.clientX, T = x.clientY, M = E - d, I = T - f;
      (h || Math.abs(M) > t || Math.abs(I) > t) && (x.preventDefault(), x.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - y }), h = !0), s.set({ type: "move", x: E - g, y: T - y, deltaX: M, deltaY: I }), d = E, f = T);
    }, S = (x) => {
      if (o.delete(x.pointerId), h) {
        const E = x.clientX, T = x.clientY;
        s.set({ type: "end", x: E - g, y: T - y });
      }
      a();
    }, b = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || S(x);
    }, k = (x) => {
      h && (x.stopPropagation(), x.preventDefault());
    }, C = (x) => {
      x.defaultPrevented || o.size > 1 || h && x.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", S), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), a = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", k, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    a(), n.removeEventListener("pointerdown", c), o.clear(), rn(s);
  } };
}
class Gc extends wh {
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = pr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = pr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = bi(r, { threshold: 1 }), o = bi(i, { threshold: 1 }), l = vi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), a = vi((() => {
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
    const i = pr("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Rn(e, "click"), r = Rn(e, "mouseenter"), i = Rn(e, "mouseleave"), s = Rn(e, "dblclick"), o = Rn(e, "pointerdown"), l = Rn(e, "pointerup"), a = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = l.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      a(), c(), u(), d(), f(), h(), rn(t), rn(r), rn(i), rn(s), rn(o), rn(l);
    }));
    const p = bi(e), m = vi((() => {
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
        this.content = pr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Xl extends $k {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Xl(e);
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
    return pr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Gc(e, i, s);
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
    const a = bi(i, { threshold: t }), c = vi((() => {
      var u, d;
      const f = a.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        l = o / m * h;
        const g = f.x / m * h, y = (f.x + 5) / m * h;
        s = new Gc(Object.assign(Object.assign({}, e), { start: g, end: y }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const lo = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Bk(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = gn(null), o = gn(null), l = P(0), a = P(0), c = P(!1), u = P(!1), d = P(!1), f = P(1), h = P(1), p = P(!1), m = A(() => Ti(l.value)), g = A(() => Ti(a.value));
  function y(_, $) {
    R(), d.value = !0, u.value = !1;
    const te = Xl.create();
    o.value = te;
    const X = Lr.create({
      container: _,
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
      renderFunction: Vp,
      url: $,
      plugins: [te]
    });
    X.on("ready", () => {
      u.value = !0, d.value = !1, a.value = X.getDuration(), w();
    }), X.on("timeupdate", (ie) => {
      l.value = ie;
    }), X.on("play", () => {
      c.value = !0;
    }), X.on("pause", () => {
      c.value = !1;
    }), X.on("finish", () => {
      c.value = !1;
    }), s.value = X;
  }
  function w() {
    const _ = o.value;
    if (_) {
      _.clearRegions();
      for (const $ of r.value) {
        const te = $.speakerId ? i.value.get($.speakerId) : void 0;
        if (!te || $.startTime == null || $.endTime == null) continue;
        const X = te.color;
        _.addRegion({
          start: $.startTime,
          end: $.endTime,
          color: Lp(X, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", X);
      }
    }
  }
  function S() {
    s.value?.play();
  }
  function b() {
    s.value?.pause();
  }
  function k() {
    s.value?.playPause();
  }
  function C(_) {
    const $ = s.value;
    !$ || a.value === 0 || $.setTime(_);
  }
  function x(_) {
    C(Math.max(0, Math.min(l.value + _, a.value)));
  }
  function E(_) {
    const $ = s.value;
    $ && (f.value = _, $.setVolume(_), _ > 0 && p.value && (p.value = !1, $.setMuted(!1)));
  }
  function T() {
    const _ = s.value;
    _ && (p.value = !p.value, _.setMuted(p.value));
  }
  function M(_) {
    const $ = s.value;
    $ && (h.value = _, $.setPlaybackRate(_));
  }
  function I() {
    const $ = (lo.indexOf(
      h.value
    ) + 1) % lo.length;
    M(lo[$] ?? 1);
  }
  function R() {
    q !== null && (clearTimeout(q), q = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  re(
    [e, t],
    ([_, $]) => {
      _ && $ && y(_, $);
    },
    { immediate: !0 }
  );
  let q = null;
  return re([r, i], () => {
    u.value && (q !== null && clearTimeout(q), q = setTimeout(() => {
      q = null, w();
    }, 150));
  }), kn(() => {
    R();
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
    play: S,
    pause: b,
    togglePlay: k,
    seekTo: C,
    skip: x,
    setVolume: E,
    setPlaybackRate: M,
    cyclePlaybackRate: I,
    toggleMute: T
  };
}
const Lk = { class: "audio-player" }, Fk = /* @__PURE__ */ L({
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
      pause: y,
      skip: w,
      setVolume: S,
      cyclePlaybackRate: b,
      toggleMute: k
    } = Bk({
      containerRef: s,
      audioSrc: hi(() => r.audioSrc),
      turns: hi(() => r.turns),
      speakers: hi(() => r.speakers)
    });
    return re(f, (C) => i("timeupdate", C)), re(o, (C) => i("playStateChange", C)), e({ seekTo: g, pause: y }), (C, x) => (O(), K("footer", Lk, [
      J("div", {
        ref_key: "waveformRef",
        ref: s,
        class: Cr(["waveform-container", { "waveform-container--loading": v(a) }])
      }, null, 2),
      F(Ek, {
        "is-playing": v(o),
        "current-time": v(h),
        duration: v(p),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(l),
        onTogglePlay: v(m),
        onSkipBack: x[0] || (x[0] = (E) => v(w)(-10)),
        onSkipForward: x[1] || (x[1] = (E) => v(w)(10)),
        "onUpdate:volume": v(S),
        onToggleMute: v(k),
        onCyclePlaybackRate: v(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), zk = /* @__PURE__ */ Oe(Fk, [["__scopeId", "data-v-9248e45e"]]);
class Vk {
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
    const y = () => {
      for (let w = Math.max(m, -c); w <= Math.min(g, c); w += 2) {
        let S;
        const b = h[w - 1], k = h[w + 1];
        b && (h[w - 1] = void 0);
        let C = !1;
        if (k) {
          const E = k.oldPos - w;
          C = k && 0 <= E && E < l;
        }
        const x = b && b.oldPos + 1 < a;
        if (!C && !x) {
          h[w] = void 0;
          continue;
        }
        if (!x || C && b.oldPos < k.oldPos ? S = this.addToPath(k, !0, !1, 0, r) : S = this.addToPath(b, !1, !0, 1, r), p = this.extractCommon(S, t, e, w, r), S.oldPos + 1 >= a && p + 1 >= l)
          return o(this.buildValues(S.lastComponent, t, e)) || !0;
        h[w] = S, S.oldPos + 1 >= a && (g = Math.min(g, w - 1)), p + 1 >= l && (m = Math.max(m, w + 1));
      }
      c++;
    };
    if (i)
      (function w() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          y() || w();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const w = y();
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
class qk extends Vk {
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
const Wk = new qk();
function Hk(n, e, t) {
  return Wk.diff(n, e, t);
}
function ao({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = Hk(i, s, {
    comparator: Uk
  }), l = jk(o), a = [...e];
  let c = [...e], u = 0;
  for (const h of l) {
    do
      if (u < a[0]) break;
    while (a.shift() !== void 0);
    if (a.length === 0) break;
    if ("replaced" in h && h.replaced)
      c = wi(
        c,
        a[0],
        h.countAdded - h.countRemoved
      ), u += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const p = h;
      u += p.count, c = wi(
        c,
        a[0],
        -p.count
      );
    } else if ("added" in h && h.added) {
      const p = h;
      c = wi(
        c,
        a[0],
        p.count
      );
    } else
      u += h.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const p = kh(
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
function jk(n) {
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
function wi(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function kh(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    wi(
      kh(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function Uk(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let l = 0; l < i; l++)
    t[l] === r[l] && s++;
  return s / t.length > 0.8;
}
class Kk {
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
class Jk extends Kk {
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
    this.resetAll(), this.currentState = ao(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = ao(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = ao(
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
function Ch(n) {
  const e = Nt();
  let t = null;
  ve(() => {
    n.canvasRef.value && (t = new Jk(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), re(
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
  Ur(() => {
    r(), s(), o(), l(), t?.dispose(), t = null;
  });
}
const Xk = ["height"], Yk = /* @__PURE__ */ L({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Nt(), t = Tr("canvas"), r = A(() => e.subtitle?.fontSize.value ?? 40), i = A(() => 1.2 * r.value), s = A(() => 2.4 * r.value);
    return Ch({
      canvasRef: t,
      fontSize: r.value,
      lineHeight: i.value
    }), (o, l) => (O(), K("div", {
      class: "subtitle-banner",
      style: Cn({ height: s.value + "px" })
    }, [
      J("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, Xk)
    ], 4));
  }
}), Gk = /* @__PURE__ */ Oe(Yk, [["__scopeId", "data-v-69ab661c"]]), Zk = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Qk = ["aria-label"], eC = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Zc = 48, tC = /* @__PURE__ */ L({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Nt(), { t } = wt(), r = Tr("container"), i = Tr("canvas");
    Ch({
      canvasRef: i,
      fontSize: Zc,
      lineHeight: 1.2 * Zc
    }), ve(async () => {
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
    ve(() => {
      document.addEventListener("fullscreenchange", s);
    });
    function o() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Ur(() => {
      document.removeEventListener("fullscreenchange", s);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (l, a) => (O(), K("div", Zk, [
      J("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(t)("subtitle.exitFullscreen"),
        onClick: o
      }, [
        F(v(ku), { size: 24 })
      ], 8, Qk),
      J("canvas", eC, null, 512)
    ], 512));
  }
}), nC = /* @__PURE__ */ Oe(tC, [["__scopeId", "data-v-dde0e356"]]), rC = { class: "editor-layout" }, iC = { class: "editor-body" }, sC = {
  key: 4,
  class: "mobile-selectors"
}, oC = /* @__PURE__ */ L({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Nt(), { t: r, locale: i } = wt(), { isMobile: s } = Nf(), o = P(!1), l = A(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), a = t.speakers.all, c = A(() => [...t.channels.values()]), u = A(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), d = A(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), f = A(() => Array.from(a.values())), h = Tr("audioPlayer");
    function p(w) {
      t.audio && (t.audio.currentTime.value = w);
    }
    re(
      () => t.activeChannelId.value,
      () => {
        h.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), o.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((w) => h.value?.seekTo(w));
    const m = A(
      () => wu(
        u.value,
        i.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    function g(w) {
      t.setActiveChannel(w);
    }
    function y(w) {
      t.activeChannel.value?.setActiveTranslation(w);
    }
    return (w, S) => (O(), K("div", rC, [
      e.showHeader ? (O(), z(gm, {
        key: 0,
        title: v(t).title.value,
        duration: v(t).activeChannel.value?.duration ?? 0,
        language: d.value,
        "is-mobile": v(s),
        onToggleSidebar: S[0] || (S[0] = (b) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : ee("", !0),
      J("main", iC, [
        F(aw, {
          turns: l.value,
          speakers: v(a)
        }, null, 8, ["turns", "speakers"]),
        v(s) ? ee("", !0) : (O(), z(Uc, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": v(t).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(s) ? (O(), z(yk, {
          key: 1,
          open: o.value,
          "onUpdate:open": S[1] || (S[1] = (b) => o.value = b)
        }, {
          default: N(() => [
            F(Uc, {
              speakers: f.value,
              channels: c.value,
              "selected-channel-id": v(t).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": y
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : ee("", !0)
      ]),
      v(t).audio?.src.value ? (O(), z(zk, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(t).audio.src.value,
        turns: l.value,
        speakers: v(a),
        onTimeupdate: p,
        onPlayStateChange: S[2] || (S[2] = (b) => {
          v(t).audio && (v(t).audio.isPlaying.value = b);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : ee("", !0),
      v(t).subtitle?.isVisible.value && !v(s) && !v(t).subtitle.isFullscreen.value ? (O(), z(Gk, { key: 2 })) : ee("", !0),
      v(t).subtitle?.isFullscreen.value ? (O(), z(nC, { key: 3 })) : ee("", !0),
      v(s) && (c.value.length > 1 || u.value.length > 1) ? (O(), K("div", sC, [
        c.value.length > 1 ? (O(), z(gh, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(t).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : ee("", !0),
        u.value.length > 1 ? (O(), z(Jl, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": y
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : ee("", !0)
      ])) : ee("", !0)
    ]));
  }
}), nM = /* @__PURE__ */ Oe(oC, [["__scopeId", "data-v-8dfbbd79"]]);
function rM() {
  return {
    name: "audio",
    install(n) {
      const e = P(0), t = P(!1);
      let r = null;
      const i = A(
        () => n.activeChannel.value?.activeTranslation.value.audio?.src ?? null
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
var lC = $l.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const Sn = Math.floor, aC = Math.abs, Kt = (n, e) => n < e ? n : e, Zn = (n, e) => n > e ? n : e, cC = (n) => n !== 0 ? n < 0 : 1 / n < 0, uC = 64, Fr = 128, dC = 1 << 29, Qc = 63, Sr = 127, fC = 2147483647, eu = Number.MAX_SAFE_INTEGER, tu = Number.MIN_SAFE_INTEGER, hC = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && Sn(n) === n), pC = () => /* @__PURE__ */ new Set(), Yl = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, Th = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, mC = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, xs = Array.isArray, Eh = String.fromCharCode, gC = (n) => n.toLowerCase(), yC = /^\s*/g, vC = (n) => n.replace(yC, ""), bC = /([A-Z])/g, nu = (n, e) => vC(n.replace(bC, (t) => `${e}${gC(t)}`)), wC = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, zr = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), xC = (n) => zr.encode(n), SC = zr ? xC : wC;
let co = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
co && co.decode(new Uint8Array()).length === 1 && (co = null);
const kC = (n, e) => mC(e, () => n).join("");
class CC {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const TC = () => new CC(), EC = (n) => {
  const e = TC();
  return n(e), OC(e);
}, MC = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, OC = (n) => {
  const e = new Uint8Array(MC(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, AC = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(Zn(t, e) * 2), n.cpos = 0);
}, Ce = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Vr = (n, e) => {
  for (; e > Sr; )
    Ce(n, Fr | Sr & e), e = Sn(e / 128);
  Ce(n, Sr & e);
}, DC = (n, e) => {
  const t = cC(e);
  for (t && (e = -e), Ce(n, (e > Qc ? Fr : 0) | (t ? uC : 0) | Qc & e), e = Sn(e / 64); e > 0; )
    Ce(n, (e > Sr ? Fr : 0) | Sr & e), e = Sn(e / 128);
}, Ko = new Uint8Array(3e4), PC = Ko.length / 3, _C = (n, e) => {
  if (e.length < PC) {
    const t = zr.encodeInto(e, Ko).written || 0;
    Vr(n, t);
    for (let r = 0; r < t; r++)
      Ce(n, Ko[r]);
  } else
    Mh(n, SC(e));
}, NC = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Vr(n, r);
  for (let i = 0; i < r; i++)
    Ce(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, ru = zr && /** @type {any} */
zr.encodeInto ? _C : NC, IC = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = Kt(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(Zn(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, Mh = (n, e) => {
  Vr(n, e.byteLength), IC(n, e);
}, Gl = (n, e) => {
  AC(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, RC = (n, e) => Gl(n, 4).setFloat32(0, e, !1), $C = (n, e) => Gl(n, 8).setFloat64(0, e, !1), BC = (n, e) => (
  /** @type {any} */
  Gl(n, 8).setBigInt64(0, e, !1)
), iu = new DataView(new ArrayBuffer(4)), LC = (n) => (iu.setFloat32(0, n), iu.getFloat32(0) === n), Jo = (n, e) => {
  switch (typeof e) {
    case "string":
      Ce(n, 119), ru(n, e);
      break;
    case "number":
      hC(e) && aC(e) <= fC ? (Ce(n, 125), DC(n, e)) : LC(e) ? (Ce(n, 124), RC(n, e)) : (Ce(n, 123), $C(n, e));
      break;
    case "bigint":
      Ce(n, 122), BC(n, e);
      break;
    case "object":
      if (e === null)
        Ce(n, 126);
      else if (xs(e)) {
        Ce(n, 117), Vr(n, e.length);
        for (let t = 0; t < e.length; t++)
          Jo(n, e[t]);
      } else if (e instanceof Uint8Array)
        Ce(n, 116), Mh(n, e);
      else {
        Ce(n, 118);
        const t = Object.keys(e);
        Vr(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          ru(n, i), Jo(n, e[i]);
        }
      }
      break;
    case "boolean":
      Ce(n, e ? 120 : 121);
      break;
    default:
      Ce(n, 127);
  }
}, Ss = (n) => new Error(n), Oh = () => {
  throw Ss("Method unimplemented");
}, ks = () => {
  throw Ss("Unexpected case");
}, xi = () => /* @__PURE__ */ new Map(), Ah = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, qr = /* @__PURE__ */ Symbol("Equality"), FC = (n, e) => n === e || !!n?.[qr]?.(e) || !1, zC = (n) => typeof n == "object", Dh = Object.keys, su = (n) => Dh(n).length, Zr = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, Ph = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Si = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[qr] != null)
    return n[qr](e);
  switch (n.constructor) {
    case ArrayBuffer:
      n = new Uint8Array(n), e = new Uint8Array(e);
    // eslint-disable-next-line no-fallthrough
    case Uint8Array: {
      if (n.byteLength !== e.byteLength)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (n[t] !== e[t])
          return !1;
      break;
    }
    case Set: {
      if (n.size !== e.size)
        return !1;
      for (const t of n)
        if (!e.has(t))
          return !1;
      break;
    }
    case Map: {
      if (n.size !== e.size)
        return !1;
      for (const t of n.keys())
        if (!e.has(t) || !Si(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (su(n) !== su(e))
        return !1;
      for (const t in n)
        if (!Ph(n, t) || !Si(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Si(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, VC = (n, e) => e.includes(n), qC = () => {
  let n = !0;
  return (e, t) => {
    if (n) {
      n = !1;
      try {
        e();
      } finally {
        n = !0;
      }
    } else t !== void 0 && t();
  };
}, WC = /[\uD800-\uDBFF]/, HC = /[\uDC00-\uDFFF]/, jC = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && WC.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && HC.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, UC = jC, KC = Math.random, JC = (n) => n[Sn(KC() * n.length)], ou = (n) => n === void 0 ? null : n;
class XC {
  constructor() {
    this.map = /* @__PURE__ */ new Map();
  }
  /**
   * @param {string} key
   * @param {any} newValue
   */
  setItem(e, t) {
    this.map.set(e, t);
  }
  /**
   * @param {string} key
   */
  getItem(e) {
    return this.map.get(e);
  }
}
let _h = new XC(), YC = !0;
try {
  typeof localStorage < "u" && localStorage && (_h = localStorage, YC = !1);
} catch {
}
const GC = _h, Qn = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Nh = typeof window < "u" && typeof document < "u" && !Qn;
let dt;
const ZC = () => {
  if (dt === void 0)
    if (Qn) {
      dt = xi();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && dt.set(e, ""), e = r) : e !== null && (dt.set(e, r), e = null);
      }
      e !== null && dt.set(e, "");
    } else typeof location == "object" ? (dt = xi(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        dt.set(`--${nu(e, "-")}`, t), dt.set(`-${nu(e, "-")}`, t);
      }
    })) : dt = xi();
  return dt;
}, Xo = (n) => ZC().has(n), Yo = (n) => ou(Qn ? process.env[n.toUpperCase().replaceAll("-", "_")] : GC.getItem(n)), Ih = (n) => Xo("--" + n) || Yo(n) !== null, QC = Ih("production"), eT = Qn && VC(process.env.FORCE_COLOR, ["true", "1", "2"]);
eT || !Xo("--no-colors") && // @todo deprecate --no-colors
!Ih("no-color") && (!Qn || process.stdout.isTTY) && (!Qn || Xo("--color") || Yo("COLORTERM") !== null || (Yo("TERM") || "").includes("color"));
const tT = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += Eh(n[t]);
  return btoa(e);
}, nT = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), rT = Nh ? tT : nT, iT = (n) => EC((e) => Jo(e, n)), lu = (n) => n.next() >= 0.5, uo = (n, e, t) => Sn(n.next() * (t + 1 - e) + e), Rh = (n, e, t) => Sn(n.next() * (t + 1 - e) + e), Zl = (n, e, t) => Rh(n, e, t), sT = (n) => Eh(Zl(n, 97, 122)), oT = (n, e = 0, t = 20) => {
  const r = Zl(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += sT(n);
  return i;
}, fo = (n, e) => e[Zl(n, 0, e.length - 1)], lT = /* @__PURE__ */ Symbol("0schema");
class aT {
  constructor() {
    this._rerrs = [];
  }
  /**
   * @param {string?} path
   * @param {string} expected
   * @param {string} has
   * @param {string?} message
   */
  extend(e, t, r, i = null) {
    this._rerrs.push({ path: e, expected: t, has: r, message: i });
  }
  toString() {
    const e = [];
    for (let t = this._rerrs.length - 1; t > 0; t--) {
      const r = this._rerrs[t];
      e.push(kC(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Go = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[qr] ? FC(n, e) : xs(n) ? Yl(
  n,
  (t) => Th(e, (r) => Go(t, r))
) : zC(n) ? Zr(
  n,
  (t, r) => Go(t, e[r])
) : !1;
class Be {
  // this.shape must not be defined on Schema. Otherwise typecheck on metatypes (e.g. $$object) won't work as expected anymore
  /**
   * If true, the more things are added to the shape the more objects this schema will accept (e.g.
   * union). By default, the more objects are added, the the fewer objects this schema will accept.
   * @protected
   */
  static _dilutes = !1;
  /**
   * @param {Schema<any>} other
   */
  extends(e) {
    let [t, r] = [
      /** @type {any} */
      this.shape,
      /** @type {any} */
      e.shape
    ];
    return (
      /** @type {typeof Schema<any>} */
      this.constructor._dilutes && ([r, t] = [t, r]), Go(t, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Si(this.shape, e.shape);
  }
  [lT]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [qr](e) {
    return this.equals(
      /** @type {any} */
      e
    );
  }
  /**
   * Use `schema.validate(obj)` with a typed parameter that is already of typed to be an instance of
   * Schema. Validate will check the structure of the parameter and return true iff the instance
   * really is an instance of Schema.
   *
   * @param {T} o
   * @return {boolean}
   */
  validate(e) {
    return this.check(e);
  }
  /* c8 ignore start */
  /**
   * Similar to validate, but this method accepts untyped parameters.
   *
   * @param {any} _o
   * @param {ValidationError} [_err]
   * @return {_o is T}
   */
  check(e, t) {
    Oh();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return ir(this, Os);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Lh(
      /** @type {Schema<T>} */
      this
    );
  }
  /**
   * Cast a variable to a specific type. Returns the casted value, or throws an exception otherwise.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check only if not in a production environment.
   *
   * @template OO
   * @param {OO} o
   * @return {Extract<OO, T> extends never ? T : (OO extends Array<never> ? T : Extract<OO,T>)}
   */
  cast(e) {
    return au(e, this), /** @type {any} */
    e;
  }
  /**
   * EXPECTO PATRONUM!! 🪄
   * This function protects against type errors. Though it may not work in the real world.
   *
   * "After all this time?"
   * "Always." - Snape, talking about type safety
   *
   * Ensures that a variable is a a specific type. Returns the value, or throws an exception if the assertion check failed.
   * Use this if you know that the type is of a specific type and you just want to convince the type
   * system.
   *
   * Can be useful when defining lambdas: `s.lambda(s.$number, s.$void).expect((n) => n + 1)`
   *
   * **Do not rely on these error messages!**
   * Performs an assertion check if not in a production environment.
   *
   * @param {T} o
   * @return {o extends T ? T : never}
   */
  expect(e) {
    return au(e, this), e;
  }
}
class Ql extends Be {
  /**
   * @param {C} c
   * @param {((o:Instance<C>)=>boolean)|null} check
   */
  constructor(e, t) {
    super(), this.shape = e, this._c = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is C extends ((...args:any[]) => infer T) ? T : (C extends (new (...args:any[]) => any) ? InstanceType<C> : never)} o
   */
  check(e, t = void 0) {
    const r = e?.constructor === this.shape && (this._c == null || this._c(e));
    return !r && t?.extend(null, this.shape.name, e?.constructor.name, e?.constructor !== this.shape ? "Constructor match failed" : "Check failed"), r;
  }
}
const ge = (n, e = null) => new Ql(n, e);
ge(Ql);
class ea extends Be {
  /**
   * @param {(o:any) => boolean} check
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is any}
   */
  check(e, t) {
    const r = this.shape(e);
    return !r && t?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), r;
  }
}
const Se = (n) => new ea(n);
ge(ea);
class Cs extends Be {
  /**
   * @param {Array<T>} literals
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   *
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is T}
   */
  check(e, t) {
    const r = this.shape.some((i) => i === e);
    return !r && t?.extend(null, this.shape.join(" | "), e.toString()), r;
  }
}
const Ts = (...n) => new Cs(n), $h = ge(Cs), cT = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Bh = (n) => {
  if (er.check(n))
    return [cT(n)];
  if ($h.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if (Kh.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (Jh.check(n))
    return [".*"];
  if (Ki.check(n))
    return n.shape.map(Bh).flat(1);
  ks();
};
class uT extends Be {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Bh).map((t) => `(${t.join("|")})`).join("") + "$");
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is CastStringTemplateArgsToTemplate<T>}
   */
  check(e, t) {
    const r = this._r.exec(e) != null;
    return !r && t?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), r;
  }
}
ge(uT);
const dT = /* @__PURE__ */ Symbol("optional");
class Lh extends Be {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is (Unwrap<S>|undefined)}
   */
  check(e, t) {
    const r = e === void 0 || this.shape.check(e);
    return !r && t?.extend(null, "undefined (optional)", "()"), r;
  }
  get [dT]() {
    return !0;
  }
}
const fT = ge(Lh);
class hT extends Be {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
ge(hT);
class Es extends Be {
  /**
   * @param {S} shape
   * @param {boolean} partial
   */
  constructor(e, t = !1) {
    super(), this.shape = e, this._isPartial = t;
  }
  static _dilutes = !0;
  /**
   * @type {Schema<Partial<$ObjectToType<S>>>}
   */
  get partial() {
    return new Es(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : Zr(this.shape, (r, i) => {
      const s = this._isPartial && !Ph(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const pT = (n) => (
  /** @type {any} */
  new Es(n)
), mT = ge(Es), gT = Se((n) => n != null && (n.constructor === Object || n.constructor == null));
class Fh extends Be {
  /**
   * @param {Keys} keys
   * @param {Values} values
   */
  constructor(e, t) {
    super(), this.shape = {
      keys: e,
      values: t
    };
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [key in Unwrap<Keys>]: Unwrap<Values> }}
   */
  check(e, t) {
    return e != null && Zr(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const zh = (n, e) => new Fh(n, e), yT = ge(Fh);
class Vh extends Be {
  /**
   * @param {S} shape
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is { [K in keyof S]: S[K] extends Schema<infer Type> ? Type : never }}
   */
  check(e, t) {
    return e != null && Zr(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const vT = (...n) => new Vh(n);
ge(Vh);
class qh extends Be {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new ta(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = xs(e) && Yl(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const Wh = (...n) => new qh(n), bT = ge(qh), wT = Se((n) => xs(n));
class Hh extends Be {
  /**
   * @param {new (...args:any) => T} constructor
   * @param {((o:T) => boolean)|null} check
   */
  constructor(e, t) {
    super(), this.shape = e, this._c = t;
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is T}
   */
  check(e, t) {
    const r = e instanceof this.shape && (this._c == null || this._c(e));
    return !r && t?.extend(null, this.shape.name, e?.constructor.name), r;
  }
}
const xT = (n, e = null) => new Hh(n, e);
ge(Hh);
const ST = xT(Be);
class kT extends Be {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = vT(...e.slice(-1)), this.res = e[this.len];
  }
  /**
   * @param {any} f
   * @param {ValidationError} err
   * @return {f is _LArgsToLambdaDef<Args>}
   */
  check(e, t) {
    const r = e.constructor === Function && e.length <= this.len;
    return !r && t?.extend(null, "function", typeof e), r;
  }
}
const CT = ge(kT), TT = Se((n) => typeof n == "function");
class ET extends Be {
  /**
   * @param {T} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Intersect<UnwrapArray<T>>}
   */
  check(e, t) {
    const r = Yl(this.shape, (i) => i.check(e, t));
    return !r && t?.extend(null, "Intersectinon", typeof e), r;
  }
}
ge(ET, (n) => n.shape.length > 0);
class ta extends Be {
  static _dilutes = !0;
  /**
   * @param {Array<Schema<S>>} v
   */
  constructor(e) {
    super(), this.shape = e;
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is S}
   */
  check(e, t) {
    const r = Th(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const ir = (...n) => n.findIndex((e) => Ki.check(e)) >= 0 ? ir(...n.map((e) => Wr(e)).map((e) => Ki.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new ta(n), Ki = (
  /** @type {Schema<$Union<any>>} */
  ge(ta)
), jh = () => !0, Ji = Se(jh), MT = (
  /** @type {Schema<Schema<any>>} */
  ge(ea, (n) => n.shape === jh)
), na = Se((n) => typeof n == "bigint"), OT = (
  /** @type {Schema<Schema<BigInt>>} */
  Se((n) => n === na)
), Uh = Se((n) => typeof n == "symbol");
Se((n) => n === Uh);
const Hn = Se((n) => typeof n == "number"), Kh = (
  /** @type {Schema<Schema<number>>} */
  Se((n) => n === Hn)
), er = Se((n) => typeof n == "string"), Jh = (
  /** @type {Schema<Schema<string>>} */
  Se((n) => n === er)
), Ms = Se((n) => typeof n == "boolean"), AT = (
  /** @type {Schema<Schema<Boolean>>} */
  Se((n) => n === Ms)
), Xh = Ts(void 0);
ge(Cs, (n) => n.shape.length === 1 && n.shape[0] === void 0);
Ts(void 0);
const Os = Ts(null), DT = (
  /** @type {Schema<Schema<null>>} */
  ge(Cs, (n) => n.shape.length === 1 && n.shape[0] === null)
);
ge(Uint8Array);
ge(Ql, (n) => n.shape === Uint8Array);
const PT = ir(Hn, er, Os, Xh, na, Ms, Uh);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    Wh(Ji)
  ), e = (
    /** @type {$Record<$string,$any>} */
    zh(er, Ji)
  ), t = ir(Hn, er, Os, Ms, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const Wr = (n) => {
  if (ST.check(n))
    return (
      /** @type {any} */
      n
    );
  if (gT.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = Wr(n[t]);
    return (
      /** @type {any} */
      pT(e)
    );
  } else {
    if (wT.check(n))
      return (
        /** @type {any} */
        ir(...n.map(Wr))
      );
    if (PT.check(n))
      return (
        /** @type {any} */
        Ts(n)
      );
    if (TT.check(n))
      return (
        /** @type {any} */
        ge(
          /** @type {any} */
          n
        )
      );
  }
  ks();
}, au = QC ? () => {
} : (n, e) => {
  const t = new aT();
  if (!e.check(n, t))
    throw Ss(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class _T {
  /**
   * @param {Schema<State>} [$state]
   */
  constructor(e) {
    this.patterns = [], this.$state = e;
  }
  /**
   * @template P
   * @template R
   * @param {P} pattern
   * @param {(o:NoInfer<Unwrap<ReadSchema<P>>>,s:State)=>R} handler
   * @return {PatternMatcher<State,Patterns|Pattern<Unwrap<ReadSchema<P>>,R>>}
   */
  if(e, t) {
    return this.patterns.push({ if: Wr(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(Ji, e);
  }
  /**
   * @return {State extends undefined
   *   ? <In extends Unwrap<Patterns['if']>>(o:In,state?:undefined)=>PatternMatchResult<Patterns,In>
   *   : <In extends Unwrap<Patterns['if']>>(o:In,state:State)=>PatternMatchResult<Patterns,In>}
   */
  done() {
    return (
      /** @type {any} */
      (e, t) => {
        for (let r = 0; r < this.patterns.length; r++) {
          const i = this.patterns[r];
          if (i.if.check(e))
            return i.h(e, t);
        }
        throw Ss("Unhandled pattern");
      }
    );
  }
}
const NT = (n) => new _T(
  /** @type {any} */
  n
), Yh = (
  /** @type {any} */
  NT(
    /** @type {Schema<prng.PRNG>} */
    Ji
  ).if(Kh, (n, e) => uo(e, tu, eu)).if(Jh, (n, e) => oT(e)).if(AT, (n, e) => lu(e)).if(OT, (n, e) => BigInt(uo(e, tu, eu))).if(Ki, (n, e) => $n(e, fo(e, n.shape))).if(mT, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (fT.check(i)) {
        if (lu(e))
          continue;
        i = i.shape;
      }
      t[r] = Yh(i, e);
    }
    return t;
  }).if(bT, (n, e) => {
    const t = [], r = Rh(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push($n(e, n.shape));
    return t;
  }).if($h, (n, e) => fo(e, n.shape)).if(DT, (n, e) => null).if(CT, (n, e) => {
    const t = $n(e, n.res);
    return () => t;
  }).if(MT, (n, e) => $n(e, fo(e, [
    Hn,
    er,
    Os,
    Xh,
    na,
    Ms,
    Wh(Hn),
    zh(ir("a", "b", "c"), Hn)
  ]))).if(yT, (n, e) => {
    const t = {}, r = uo(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = $n(e, n.shape.keys), o = $n(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), $n = (n, e) => (
  /** @type {any} */
  Yh(Wr(e), n)
), Qr = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Se((n) => n.nodeType === BT);
typeof DOMParser < "u" && new DOMParser();
Se((n) => n.nodeType === IT);
Se((n) => n.nodeType === RT);
const IT = Qr.ELEMENT_NODE, RT = Qr.TEXT_NODE, $T = Qr.DOCUMENT_NODE, BT = Qr.DOCUMENT_FRAGMENT_NODE;
Se((n) => n.nodeType === $T);
const LT = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, FT = LT(clearTimeout), ra = (n, e) => new FT(setTimeout(e, n)), mt = (n, e) => n >>> e | n << 32 - e, zT = (n) => mt(n, 2) ^ mt(n, 13) ^ mt(n, 22), VT = (n) => mt(n, 6) ^ mt(n, 11) ^ mt(n, 25), qT = (n) => mt(n, 7) ^ mt(n, 18) ^ n >>> 3, WT = (n) => mt(n, 17) ^ mt(n, 19) ^ n >>> 10, HT = new Uint32Array([
  1116352408,
  1899447441,
  3049323471,
  3921009573,
  961987163,
  1508970993,
  2453635748,
  2870763221,
  3624381080,
  310598401,
  607225278,
  1426881987,
  1925078388,
  2162078206,
  2614888103,
  3248222580,
  3835390401,
  4022224774,
  264347078,
  604807628,
  770255983,
  1249150122,
  1555081692,
  1996064986,
  2554220882,
  2821834349,
  2952996808,
  3210313671,
  3336571891,
  3584528711,
  113926993,
  338241895,
  666307205,
  773529912,
  1294757372,
  1396182291,
  1695183700,
  1986661051,
  2177026350,
  2456956037,
  2730485921,
  2820302411,
  3259730800,
  3345764771,
  3516065817,
  3600352804,
  4094571909,
  275423344,
  430227734,
  506948616,
  659060556,
  883997877,
  958139571,
  1322822218,
  1537002063,
  1747873779,
  1955562222,
  2024104815,
  2227730452,
  2361852424,
  2428436474,
  2756734187,
  3204031479,
  3329325298
]), jT = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class UT {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set(jT), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = WT(t[d - 2]) + t[d - 7] + qT(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], l = e[4], a = e[5], c = e[6], u = e[7];
    for (let d = 0, f, h; d < 64; d++)
      f = u + VT(l) + (l & a ^ ~l & c) + HT[d] + t[d] >>> 0, h = zT(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = a, a = l, l = o + f >>> 0, o = s, s = i, i = r, r = f + h >>> 0;
    e[0] += r, e[1] += i, e[2] += s, e[3] += o, e[4] += l, e[5] += a, e[6] += c, e[7] += u;
  }
  /**
   * Returns a 32-byte hash.
   *
   * @param {Uint8Array} data
   */
  digest(e) {
    let t = 0;
    for (; t + 56 <= e.length; ) {
      let o = 0;
      for (; o < 16 && t + 3 < e.length; o++)
        this._W[o] = e[t++] << 24 | e[t++] << 16 | e[t++] << 8 | e[t++];
      if (t % 64 !== 0) {
        for (this._W.fill(0, o, 16); t < e.length; )
          this._W[o] |= e[t] << (3 - t % 4) * 8, t++;
        this._W[o] |= Fr << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= Fr << (3 - t % 4) * 8), this._W[14] = e.byteLength / dC, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let l = 0; l < 4; l++)
        s[o * 4 + l] = this._H[o] >>> (3 - l) * 8;
    return s;
  }
}
const KT = (n) => new UT().digest(n), le = new Ue("y-sync"), Dt = new Ue("y-undo"), fi = new Ue("yjs-cursor"), JT = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, XT = (n) => rT(JT(KT(iT(n)))), Xi = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !W.isDeleted(e.ds, n.id), YT = [{ light: "#ecd44433", dark: "#ecd444" }], GT = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = pC();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, JC(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, ZT = (n, {
  colors: e = YT,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const l = new tE(n, s), a = new Ae({
    props: {
      editable: (c) => {
        const u = le.getState(c);
        return u.snapshot == null && u.prevSnapshot == null;
      }
    },
    key: le,
    state: {
      /**
       * @returns {any}
       */
      init: (c, u) => ({
        type: n,
        doc: n.doc,
        binding: l,
        snapshot: null,
        prevSnapshot: null,
        isChangeOrigin: !1,
        isUndoRedoOperation: !1,
        addToHistory: !0,
        colors: e,
        colorMapping: t,
        permanentUserData: r
      }),
      apply: (c, u) => {
        const d = c.getMeta(le);
        if (d !== void 0) {
          u = Object.assign({}, u);
          for (const f in d)
            u[f] = d[f];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, l.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && ra(0, () => {
          l.prosemirrorView != null && (d.restore == null ? l._renderSnapshot(
            d.snapshot,
            d.prevSnapshot,
            u
          ) : (l._renderSnapshot(
            d.snapshot,
            d.snapshot,
            u
          ), delete u.restore, delete u.snapshot, delete u.prevSnapshot, l.mux(() => {
            l._prosemirrorChanged(
              l.prosemirrorView.state.doc
            );
          })));
        }), u;
      }
    },
    view: (c) => (l.initView(c), s == null && l._forceRerender(), i(), {
      update: () => {
        const u = a.getState(c.state);
        if (u.snapshot == null && u.prevSnapshot == null && // If the content doesn't change initially, we don't render anything to Yjs
        // If the content was cleared by a user action, we want to catch the change and
        // represent it in Yjs
        (o || c.state.doc.content.findDiffStart(
          c.state.doc.type.createAndFill().content
        ) !== null)) {
          if (o = !0, u.addToHistory === !1 && !u.isChangeOrigin) {
            const d = Dt.getState(c.state), f = d && d.undoManager;
            f && f.stopCapturing();
          }
          l.mux(() => {
            u.doc.transact((d) => {
              d.meta.set("addToHistory", u.addToHistory), l._prosemirrorChanged(c.state.doc);
            }, le);
          });
        }
      },
      destroy: () => {
        l.destroy();
      }
    })
  });
  return a;
}, QT = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new qe(n.doc));
    else if (e.type === "node") {
      const r = mn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection(eE(n, r));
    } else {
      const r = mn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = mn(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(Y.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, eE = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? j.create(n.doc, e) : Y.near(t);
}, Zo = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: jr(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: jr(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class tE {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = qC(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Zo(
        this,
        this.prosemirrorView.state
      ));
    }, this.afterAllTransactions = () => {
      this.beforeTransactionSelection = null;
    }, this._domSelectionInView = null;
  }
  /**
   * Create a transaction for changing the prosemirror state.
   *
   * @returns
   */
  get _tr() {
    return this.prosemirrorView.state.tr.setMeta("addToHistory", !1);
  }
  _isLocalCursorInView() {
    return this.prosemirrorView.hasFocus() ? (Nh && this._domSelectionInView === null && (ra(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = Qr.documentElement;
    return i.bottom >= 0 && i.right >= 0 && i.left <= (window.innerWidth || s.clientWidth || 0) && i.top <= (window.innerHeight || s.clientHeight || 0);
  }
  /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */
  renderSnapshot(e, t) {
    t || (t = W.createSnapshot(W.createDeleteSet(), /* @__PURE__ */ new Map())), this.prosemirrorView.dispatch(
      this._tr.setMeta(le, { snapshot: e, prevSnapshot: t })
    );
  }
  unrenderSnapshot() {
    this.mapping.clear(), this.mux(() => {
      const e = this.type.toArray().map(
        (r) => ki(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new B(D.from(e), 0, 0)
      );
      t.setMeta(le, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => ki(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new B(D.from(t), 0, 0)
      );
      if (e) {
        const i = Kt(Zn(e.anchor, 0), r.doc.content.size), s = Kt(Zn(e.head, 0), r.doc.content.size);
        r.setSelection(Y.create(r.doc, i, s));
      }
      this.prosemirrorView.dispatch(
        r.setMeta(le, { isChangeOrigin: !0, binding: this })
      );
    });
  }
  /**
   * @param {Y.Snapshot|Uint8Array} snapshot
   * @param {Y.Snapshot|Uint8Array} prevSnapshot
   * @param {Object} pluginState
   */
  _renderSnapshot(e, t, r) {
    let i = this.doc, s = this.type;
    if (e || (e = W.snapshot(this.doc)), e instanceof Uint8Array || t instanceof Uint8Array)
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && ks(), i = new W.Doc({ gc: !1 }), W.applyUpdateV2(i, t), t = W.snapshot(i), W.applyUpdateV2(i, e), e = W.snapshot(i), s._item === null) {
        const o = Array.from(this.doc.share.keys()).find(
          (l) => this.doc.share.get(l) === this.type
        );
        s = i.getXmlFragment(o);
      } else {
        const o = i.store.clients.get(s._item.id.client) ?? [], l = W.findIndexSS(
          o,
          s._item.id.clock
        );
        s = /** @type {Y.XmlFragment} */
        /** @type {Y.ContentType} */
        /** @type {Y.Item} */
        o[l].content.type;
      }
    this.mapping.clear(), this.mux(() => {
      i.transact((o) => {
        const l = r.permanentUserData;
        l && l.dss.forEach((d) => {
          W.iterateDeletedStructs(o, d, (f) => {
          });
        });
        const a = (d, f) => {
          const h = d === "added" ? l.getUserByClientId(f.client) : l.getUserByDeletedId(f);
          return {
            user: h,
            type: d,
            color: GT(
              r.colorMapping,
              r.colors,
              h
            )
          };
        }, c = W.typeListToArraySnapshot(
          s,
          new W.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || Xi(d._item, e) || Xi(d._item, t) ? ki(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          a
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new B(D.from(c), 0, 0)
        );
        this.prosemirrorView.dispatch(
          u.setMeta(le, { isChangeOrigin: !0 })
        );
      }, le);
    });
  }
  /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */
  _typeChanged(e, t) {
    if (this.prosemirrorView == null) return;
    const r = le.getState(this.prosemirrorView.state);
    if (e.length === 0 || r.snapshot != null || r.prevSnapshot != null) {
      this.renderSnapshot(r.snapshot, r.prevSnapshot);
      return;
    }
    this.mux(() => {
      const i = (l, a) => this.mapping.delete(a);
      W.iterateDeletedStructs(
        t,
        t.deleteSet,
        (l) => {
          if (l.constructor === W.Item) {
            const a = (
              /** @type {Y.ContentType} */
              /** @type {Y.Item} */
              l.content.type
            );
            a && this.mapping.delete(a);
          }
        }
      ), t.changed.forEach(i), t.changedParentTypes.forEach(i);
      const s = this.type.toArray().map(
        (l) => Gh(
          /** @type {Y.XmlElement | Y.XmlHook} */
          l,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((l) => l !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new B(D.from(s), 0, 0)
      );
      QT(o, this.beforeTransactionSelection, this), o = o.setMeta(le, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof W.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      Gi(this.doc, this.type, e, this), this.beforeTransactionSelection = Zo(
        this,
        this.prosemirrorView.state
      );
    }, le);
  }
  /**
   * View is ready to listen to changes. Register observers.
   * @param {any} prosemirrorView
   */
  initView(e) {
    this.prosemirrorView != null && this.destroy(), this.prosemirrorView = e, this.doc.on("beforeAllTransactions", this.beforeAllTransactions), this.doc.on("afterAllTransactions", this.afterAllTransactions), this.type.observeDeep(this._observeFunction);
  }
  destroy() {
    this.prosemirrorView != null && (this.prosemirrorView = null, this.type.unobserveDeep(this._observeFunction), this.doc.off("beforeAllTransactions", this.beforeAllTransactions), this.doc.off("afterAllTransactions", this.afterAllTransactions));
  }
}
const Gh = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof W.XmlElement)
      return ki(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw Oh();
  }
  return o;
}, ki = (n, e, t, r, i, s) => {
  const o = [], l = (a) => {
    if (a instanceof W.XmlElement) {
      const c = Gh(
        a,
        e,
        t,
        r,
        i,
        s
      );
      c !== null && o.push(c);
    } else {
      const c = (
        /** @type {Y.ContentType} */
        a._item.right?.content?.type
      );
      c instanceof W.Text && !c._item.deleted && c._item.id.client === c.doc.clientID && (a.applyDelta([
        { retain: a.length },
        ...c.toDelta()
      ]), c.doc.transact((d) => {
        c._item.delete(d);
      }));
      const u = nE(
        a,
        e,
        t,
        r,
        i,
        s
      );
      u !== null && u.forEach((d) => {
        d !== null && o.push(d);
      });
    }
  };
  r === void 0 || i === void 0 ? n.toArray().forEach(l) : W.typeListToArraySnapshot(n, new W.Snapshot(i.ds, r.sv)).forEach(l);
  try {
    const a = n.getAttributes(r);
    r !== void 0 && (Xi(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? Xi(
      /** @type {Y.Item} */
      n._item,
      i
    ) || (a.ychange = s ? s(
      "added",
      /** @type {Y.Item} */
      n._item.id
    ) : { type: "added" }) : a.ychange = s ? s(
      "removed",
      /** @type {Y.Item} */
      n._item.id
    ) : { type: "removed" });
    const c = e.node(n.nodeName, a, o);
    return t.mapping.set(n, c), c;
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, le), t.mapping.delete(n), null;
  }
}, nE = (n, e, t, r, i, s) => {
  const o = [], l = n.toDelta(r, i, s);
  try {
    for (let a = 0; a < l.length; a++) {
      const c = l[a];
      o.push(e.text(c.insert, aE(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, le), null;
  }
  return o;
}, rE = (n, e) => {
  const t = new W.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: ep(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, iE = (n, e) => {
  const t = new W.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    As(n).map(
      (r) => Qo(r, e)
    )
  ), e.mapping.set(t, n), t;
}, Qo = (n, e) => n instanceof Array ? rE(n, e) : iE(n, e), cu = (n) => typeof n == "object" && n !== null, ia = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], l = e[s];
    r = s === "ychange" || o === l || cu(o) && cu(l) && ia(o, l);
  }
  return r;
}, As = (n) => {
  const e = n.content.content, t = [];
  for (let r = 0; r < e.length; r++) {
    const i = e[r];
    if (i.isText) {
      const s = [];
      for (let o = e[r]; r < e.length && o.isText; o = e[++r])
        s.push(o);
      r--, t.push(s);
    } else
      t.push(i);
  }
  return t;
}, Zh = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && Dh(r.attributes || {}).length === e[i].marks.length && Zr(r.attributes, (s, o) => {
      const l = Qh(o), a = e[i].marks;
      return a.find(
        /** @param {any} mark */
        (u) => u.type.name === l
      ) ? ia(s, a.find(
        /** @param {any} mark */
        (u) => u.type.name === l
      )?.attrs) : !1;
    })
  );
}, Hr = (n, e) => {
  if (n instanceof W.XmlElement && !(e instanceof Array) && el(n, e)) {
    const t = As(e);
    return n._length === t.length && ia(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => Hr(r, t[i])
    );
  }
  return n instanceof W.XmlText && e instanceof Array && Zh(n, e);
}, Yi = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), uu = (n, e, t) => {
  const r = n.toArray(), i = As(e), s = i.length, o = r.length, l = Kt(o, s);
  let a = 0, c = 0, u = !1;
  for (; a < l; a++) {
    const d = r[a], f = i[a];
    if (Yi(t.mapping.get(d), f))
      u = !0;
    else if (!Hr(d, f))
      break;
  }
  for (; a + c < l; c++) {
    const d = r[o - c - 1], f = i[s - c - 1];
    if (Yi(t.mapping.get(d), f))
      u = !0;
    else if (!Hr(d, f))
      break;
  }
  return {
    equalityFactor: a + c,
    foundMappedChild: u
  };
}, sE = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof W.ContentString ? e += t.content.str : t.content instanceof W.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, oE = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = sE(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, ep(c.marks, t))
  })), { insert: o, remove: l, index: a } = UC(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(a, l), n.insert(a, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, lE = /(.*)(--[a-zA-Z0-9+/=]{8})$/, Qh = (n) => lE.exec(n)?.[1] ?? n, aE = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(Qh(r), n[r]));
  return t;
}, ep = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = Ah(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${XT(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, Gi = (n, e, t, r) => {
  if (e instanceof W.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof W.XmlElement) {
    const d = e.getAttributes(), f = t.attrs;
    for (const h in f)
      f[h] !== null ? d[h] !== f[h] && h !== "ychange" && e.setAttribute(h, f[h]) : e.removeAttribute(h);
    for (const h in d)
      f[h] === void 0 && e.removeAttribute(h);
  }
  const i = As(t), s = i.length, o = e.toArray(), l = o.length, a = Kt(s, l);
  let c = 0, u = 0;
  for (; c < a; c++) {
    const d = o[c], f = i[c];
    if (!Yi(r.mapping.get(d), f))
      if (Hr(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  for (; u + c + 1 < a; u++) {
    const d = o[l - u - 1], f = i[s - u - 1];
    if (!Yi(r.mapping.get(d), f))
      if (Hr(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  n.transact(() => {
    for (; l - c - u > 0 && s - c - u > 0; ) {
      const f = o[c], h = i[c], p = o[l - u - 1], m = i[s - u - 1];
      if (f instanceof W.XmlText && h instanceof Array)
        Zh(f, h) || oE(f, h, r), c += 1;
      else {
        let g = f instanceof W.XmlElement && el(f, h), y = p instanceof W.XmlElement && el(p, m);
        if (g && y) {
          const w = uu(
            /** @type {Y.XmlElement} */
            f,
            /** @type {PModel.Node} */
            h,
            r
          ), S = uu(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          w.foundMappedChild && !S.foundMappedChild ? y = !1 : !w.foundMappedChild && S.foundMappedChild || w.equalityFactor < S.equalityFactor ? g = !1 : y = !1;
        }
        g ? (Gi(
          n,
          /** @type {Y.XmlFragment} */
          f,
          /** @type {PModel.Node} */
          h,
          r
        ), c += 1) : y ? (Gi(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          Qo(h, r)
        ]), c += 1);
      }
    }
    const d = l - c - u;
    if (l === 1 && s === 0 && o[0] instanceof W.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((f) => r.mapping.delete(f)), e.delete(c, d)), c + u < s) {
      const f = [];
      for (let h = c; h < s - u; h++)
        f.push(Qo(i[h], r));
      e.insert(c, f);
    }
  }, le);
}, el = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let kr = null;
const cE = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    kr
  );
  kr = null, n.forEach((e, t) => {
    const r = t.state.tr, i = le.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, uE = (n, e, t) => {
  kr || (kr = /* @__PURE__ */ new Map(), ra(0, cE)), Ah(kr, n, xi).set(e, t);
}, jr = (n, e, t) => {
  if (n === 0)
    return W.createRelativePositionFromTypeIndex(e, 0, -1);
  let r = e._first === null ? null : (
    /** @type {Y.ContentType} */
    e._first.content.type
  );
  for (; r !== null && e !== r; ) {
    if (r instanceof W.XmlText) {
      if (r._length >= n)
        return W.createRelativePositionFromTypeIndex(r, n, -1);
      if (n -= r._length, r._item !== null && r._item.next !== null)
        r = /** @type {Y.ContentType} */
        r._item.next.content.type;
      else {
        do
          r = r._item === null ? null : r._item.parent, n--;
        while (r !== e && r !== null && r._item !== null && r._item.next === null);
        r !== null && r !== e && (r = r._item === null ? null : (
          /** @type {Y.ContentType} */
          /** @type Y.Item */
          r._item.next.content.type
        ));
      }
    } else {
      const i = (
        /** @type {any} */
        (t.get(r) || { nodeSize: 0 }).nodeSize
      );
      if (r._first !== null && n < i)
        r = /** @type {Y.ContentType} */
        r._first.content.type, n--;
      else {
        if (n === 1 && r._length === 0 && i > 1)
          return new W.RelativePosition(r._item === null ? null : r._item.id, r._item === null ? W.findRootTypeKey(r) : null, null);
        if (n -= i, r._item !== null && r._item.next !== null)
          r = /** @type {Y.ContentType} */
          r._item.next.content.type;
        else {
          if (n === 0)
            return r = r._item === null ? r : r._item.parent, new W.RelativePosition(r._item === null ? null : r._item.id, r._item === null ? W.findRootTypeKey(r) : null, null);
          do
            r = /** @type {Y.Item} */
            r._item.parent, n--;
          while (r !== e && /** @type {Y.Item} */
          r._item.next === null);
          r !== e && (r = /** @type {Y.ContentType} */
          /** @type {Y.Item} */
          /** @type {Y.Item} */
          r._item.next.content.type);
        }
      }
    }
    if (r === null)
      throw ks();
    if (n === 0 && r.constructor !== W.XmlText && r !== e)
      return dE(r._item.parent, r._item);
  }
  return W.createRelativePositionFromTypeIndex(e, e._length, -1);
}, dE = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = W.findRootTypeKey(n) : t = W.createID(n._item.id.client, n._item.id.clock), new W.RelativePosition(t, r, e.id);
}, mn = (n, e, t, r) => {
  const i = W.createAbsolutePositionFromRelativePosition(t, n);
  if (i === null || i.type !== e && !W.isParentOf(e, i.type._item))
    return null;
  let s = i.type, o = 0;
  if (s.constructor === W.XmlText)
    o = i.index;
  else if (s._item === null || !s._item.deleted) {
    let l = s._first, a = 0;
    for (; a < s._length && a < i.index && l !== null; ) {
      if (!l.deleted) {
        const c = (
          /** @type {Y.ContentType} */
          l.content.type
        );
        a++, c instanceof W.XmlText ? o += c._length : o += /** @type {any} */
        r.get(c).nodeSize;
      }
      l = /** @type {Y.Item} */
      l.right;
    }
    o += 1;
  }
  for (; s !== e && s._item !== null; ) {
    const l = s._item.parent;
    if (l._item === null || !l._item.deleted) {
      o += 1;
      let a = (
        /** @type {Y.AbstractType} */
        l._first
      );
      for (; a !== null; ) {
        const c = (
          /** @type {Y.ContentType} */
          a.content.type
        );
        if (c === s)
          break;
        a.deleted || (c instanceof W.XmlText ? o += c._length : o += /** @type {any} */
        r.get(c).nodeSize), a = a.right;
      }
    }
    s = /** @type {Y.AbstractType} */
    l;
  }
  return o - 1;
};
function fE(n, e) {
  const t = e || new W.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return Gi(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function hE(n, e, t) {
  const r = Mt.fromJSON(n, e);
  return fE(r, t);
}
const pE = (n, e, t) => n !== e, mE = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, gE = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), yE = /^#[0-9a-fA-F]{6}$/, du = (n, e, t, r, i) => {
  const s = le.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return ae.create(n.doc, []);
  const o = s.doc, l = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? ae.create(n.doc, []) : (e.getStates().forEach((a, c) => {
    if (t(o.clientID, c, a) && a.cursor != null) {
      const u = a.user || {};
      u.color == null ? u.color = "#ffa500" : yE.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = mn(
        o,
        s.type,
        W.createRelativePositionFromJSON(a.cursor.anchor),
        s.binding.mapping
      ), f = mn(
        o,
        s.type,
        W.createRelativePositionFromJSON(a.cursor.head),
        s.binding.mapping
      );
      if (d !== null && f !== null) {
        const h = Zn(n.doc.content.size - 1, 0);
        d = Kt(d, h), f = Kt(f, h), l.push(
          ze.widget(f, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = Kt(d, f), m = Zn(d, f);
        l.push(
          ze.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), ae.create(n.doc, l));
}, vE = (n, {
  awarenessStateFilter: e = pE,
  cursorBuilder: t = mE,
  selectionBuilder: r = gE,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new Ae({
  key: fi,
  state: {
    init(o, l) {
      return du(
        l,
        n,
        e,
        t,
        r
      );
    },
    apply(o, l, a, c) {
      const u = le.getState(c), d = o.getMeta(fi);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? du(
        c,
        n,
        e,
        t,
        r
      ) : l.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => fi.getState(o)
  },
  view: (o) => {
    const l = () => {
      o.docView && uE(o, fi, { awarenessUpdated: !0 });
    }, a = () => {
      const c = le.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), f = jr(
          d.anchor,
          c.type,
          c.binding.mapping
        ), h = jr(
          d.head,
          c.type,
          c.binding.mapping
        );
        (u.cursor == null || !W.compareRelativePositions(
          W.createRelativePositionFromJSON(u.cursor.anchor),
          f
        ) || !W.compareRelativePositions(
          W.createRelativePositionFromJSON(u.cursor.head),
          h
        )) && n.setLocalStateField(s, {
          anchor: f,
          head: h
        });
      } else u.cursor != null && mn(
        c.doc,
        c.type,
        W.createRelativePositionFromJSON(u.cursor.anchor),
        c.binding.mapping
      ) !== null && n.setLocalStateField(s, null);
    };
    return n.on("change", l), o.dom.addEventListener("focusin", a), o.dom.addEventListener("focusout", a), {
      update: a,
      destroy: () => {
        o.dom.removeEventListener("focusin", a), o.dom.removeEventListener("focusout", a), n.off("change", l), n.setLocalStateField(s, null);
      }
    };
  }
}), bE = (n) => {
  const e = Dt.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, wE = (n) => {
  const e = Dt.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, xE = /* @__PURE__ */ new Set(["paragraph"]), SE = (n, e) => !(n instanceof xp) || !(n.content instanceof Sp) || !(n.content.type instanceof kp || n.content.type instanceof Cp && e.has(n.content.type.nodeName)) || n.content.type._length === 0, kE = ({ protectedNodes: n = xE, trackedOrigins: e = [], undoManager: t = null } = {}) => new Ae({
  key: Dt,
  state: {
    init: (r, i) => {
      const s = le.getState(i), o = t || new wp(s.type, {
        trackedOrigins: new Set([le].concat(e)),
        deleteFilter: (l) => SE(l, n),
        captureTransaction: (l) => l.meta.get("addToHistory") !== !1
      });
      return {
        undoManager: o,
        prevSel: null,
        hasUndoOps: o.undoStack.length > 0,
        hasRedoOps: o.redoStack.length > 0
      };
    },
    /**
     * @returns {any}
     */
    apply: (r, i, s, o) => {
      const l = le.getState(o).binding, a = i.undoManager, c = a.undoStack.length > 0, u = a.redoStack.length > 0;
      return l ? {
        undoManager: a,
        prevSel: Zo(l, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: a.undoStack.length > 0,
        hasRedoOps: a.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = le.getState(r.state), s = Dt.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const l = i.binding;
      l && o.meta.set(l, Dt.getState(r.state).prevSel);
    }), s.on("stack-item-popped", ({ stackItem: o }) => {
      const l = i.binding;
      l && (l.beforeTransactionSelection = o.meta.get(l) || l.beforeTransactionSelection);
    }), {
      destroy: () => {
        s.destroy();
      }
    };
  }
});
function tp(n) {
  return !!n.getMeta(le);
}
function CE(n, e) {
  const t = le.getState(n);
  return mn(t.doc, t.type, e, t.binding.mapping) || 0;
}
function np(n, e) {
  const t = le.getState(n);
  return jr(e, t.type, t.binding.mapping);
}
var Ci = class rp extends _l {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new rp(e.position, e.yRelativePosition);
  }
  /**
   * Converts the CollaborationMappablePosition to a JSON object.
   */
  toJSON() {
    return {
      position: this.position,
      yRelativePosition: this.yRelativePosition
    };
  }
};
function TE(n, e) {
  const t = np(e, n);
  return new Ci(n, t);
}
function EE(n, e, t) {
  const r = n instanceof Ci ? n.yRelativePosition : null;
  if (tp(e) && r) {
    const o = CE(t, r);
    return {
      position: new Ci(o, r),
      mapResult: null
    };
  }
  const i = yf(n, e), s = i.position.position;
  return {
    position: new Ci(
      s,
      r ?? np(t, s)
    ),
    mapResult: i.mapResult
  };
}
var ME = Ke.create({
  name: "collaboration",
  priority: 1e3,
  addOptions() {
    return {
      document: null,
      field: "default",
      fragment: null,
      provider: null
    };
  },
  addStorage() {
    return {
      isDisabled: !1
    };
  },
  onCreate() {
    this.editor.extensionManager.extensions.find((n) => n.name === "undoRedo") && console.warn(
      '[tiptap warn]: "@tiptap/extension-collaboration" comes with its own history support and is not compatible with "@tiptap/extension-undo-redo".'
    );
  },
  onBeforeCreate() {
    this.editor.utils.getUpdatedPosition = (n, e) => EE(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => TE(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Dt.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? bE(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Dt.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? wE(e) : !0)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Mod-y": () => this.editor.commands.redo(),
      "Shift-Mod-z": () => this.editor.commands.redo()
    };
  },
  addProseMirrorPlugins() {
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = kE(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Dt.getState(s.state);
      o.restore && (o.restore(), o.restore = () => {
      });
      const l = t ? t(s) : void 0;
      return {
        destroy: () => {
          const a = o.trackedOrigins.has(o), c = o._observers;
          o.restore = () => {
            a && o.trackedOrigins.add(o), o.doc.on("afterTransaction", o.afterTransactionHandler), o._observers = c;
          }, l?.destroy && l.destroy();
        }
      };
    };
    const r = {
      ...this.options.ySyncOptions,
      onFirstRender: this.options.onFirstRender
    };
    return [
      ZT(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new Ae({
        key: new Ue("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!tp(s))
            return !0;
          if (this.storage.isDisabled)
            return !1;
          if (!s.docChanged)
            return !0;
          try {
            return s.doc.check(), !0;
          } catch (o) {
            return this.storage.isDisabled = !0, this.editor.emit("contentError", {
              error: o,
              editor: this.editor,
              disableCollaboration: () => {
                var l;
                (l = n.doc) == null || l.destroy();
              }
            }), !1;
          }
        }
      })
    ].filter(Boolean);
  }
});
const OE = $l.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), AE = /* @__PURE__ */ L({
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
    const e = n, t = Nt(), r = A(() => {
      const o = e.node.attrs.speakerId;
      return o ? t.speakers.all.get(o) : void 0;
    }), i = A(() => r.value?.color ?? "transparent"), s = A(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: o, endTime: l } = e.node.attrs;
      if (o == null || l == null) return !1;
      const a = t.audio.currentTime.value;
      return a >= o && a <= l;
    });
    return (o, l) => (O(), z(v(Z0), {
      as: "section",
      class: Cr(["turn", { "turn--active": s.value }]),
      style: Cn({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: N(() => [
        F(Mu, {
          speaker: r.value,
          "start-time": n.node.attrs.startTime,
          language: n.node.attrs.language
        }, null, 8, ["speaker", "start-time", "language"]),
        F(v(G0), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), DE = /* @__PURE__ */ Oe(AE, [["__scopeId", "data-v-9437fb29"]]), PE = $l.create({
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
      ff(n, { "data-type": "turn" }),
      0
    ];
  },
  addNodeView() {
    return tw(DE);
  }
});
function _E(n) {
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
const NE = new Ue("storeSync");
let tl = !1;
function IE(n) {
  tl = !0;
  try {
    n();
  } finally {
    tl = !1;
  }
}
const RE = Ke.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new Ae({
        key: NE,
        appendTransaction(t, r, i) {
          if (tl || r.doc.eq(i.doc)) return null;
          const s = e();
          return s && $E(i.doc, s, n), null;
        }
      })
    ];
  }
});
function $E(n, e, t) {
  const r = _E(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((f) => f.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), l = e.id, a = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    a.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: l });
  for (const c of o) {
    const u = s.get(c.id);
    u ? BE(u, c) && t.emit("turn:update", { turn: c, translationId: l }) : t.emit("turn:add", { turn: c, translationId: l });
  }
  e.turns.value = o;
}
function BE(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const cr = new Ue("wordHighlight"), LE = Ke.create({
  name: "wordHighlight",
  addProseMirrorPlugins() {
    const { core: n } = this.options, e = this.editor;
    let t = null;
    function r() {
      if (!n.audio?.isPlaying.value) return ae.empty;
      const u = n.audio.currentTime.value, d = n.activeChannel.value?.activeTranslation.value;
      if (!d) return ae.empty;
      const f = e.state.doc;
      let h = ae.empty;
      return f.forEach((p, m) => {
        if (p.type.name !== "turn") return;
        const g = d.turns.value.find(
          (C) => C.id === p.attrs.id
        );
        if (!g || !Ei(g.words)) return;
        const { startTime: y, endTime: w } = g;
        if (y == null || w == null || u < y || u > w) return;
        const S = go(g.words, u);
        if (!S) return;
        const b = p.textContent;
        let k = 0;
        for (const C of g.words) {
          const x = b.indexOf(C.text, k);
          if (x === -1) break;
          if (C.id === S) {
            const E = m + 1 + x, T = E + C.text.length;
            h = ae.create(f, [
              ze.inline(E, T, {
                class: "word--active",
                "data-word-active": ""
              })
            ]);
            return;
          }
          k = x + C.text.length;
        }
      }), h;
    }
    let i = null, s = !1;
    function o() {
      if (!s) return;
      const u = n.audio.currentTime.value, d = n.activeChannel.value?.activeTranslation.value;
      let f = null;
      if (d) {
        for (const h of d.turns.value)
          if (h.startTime != null && h.endTime != null && u >= h.startTime && u <= h.endTime && Ei(h.words)) {
            f = go(h.words, u);
            break;
          }
      }
      if (f !== t) {
        t = f;
        const h = e.state.tr.setMeta(cr, !0);
        e.view.dispatch(h);
      }
      i = requestAnimationFrame(o);
    }
    function l() {
      s || (s = !0, i = requestAnimationFrame(o));
    }
    function a() {
      if (s = !1, i != null && (cancelAnimationFrame(i), i = null), t !== null) {
        t = null;
        const u = e.state.tr.setMeta(cr, !0);
        e.view.dispatch(u);
      }
    }
    let c = null;
    return [
      new Ae({
        key: cr,
        state: {
          init() {
            return ae.empty;
          },
          apply(u, d) {
            return u.getMeta(cr) ? r() : u.docChanged ? d.map(u.mapping, u.doc) : d;
          }
        },
        props: {
          decorations(u) {
            return cr.getState(u);
          }
        },
        view() {
          return c = je(() => {
            n.audio?.isPlaying.value ? l() : a();
          }), {
            destroy() {
              c?.(), a();
            }
          };
        }
      })
    ];
  }
}), FE = Ke.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      return n.setLocalStateField("user", e), [
        vE(n, {
          cursorBuilder: zE
        })
      ];
    }
  }
);
function zE(n) {
  const e = document.createElement("span");
  e.classList.add("collaboration-cursor__caret"), e.style.borderColor = String(n.color ?? "#999");
  const t = document.createElement("div");
  return t.classList.add("collaboration-cursor__label"), t.style.backgroundColor = String(n.color ?? "#999"), t.textContent = String(n.name ?? "Anonymous"), e.appendChild(t), e;
}
function ip(n) {
  return {
    type: "doc",
    content: n.map((e) => VE(e))
  };
}
function VE(n) {
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
function sM(n = {}) {
  const {
    document: e,
    awareness: t,
    field: r = "default",
    user: i = { name: "Anonymous", color: "#999999" },
    isConnected: s
  } = n, o = e ?? new Tp(), l = o.getXmlFragment(r), a = P([]), c = s ?? P(!1);
  return {
    name: "transcriptionEditor",
    install(u) {
      const d = gn(void 0), f = [];
      if (t) {
        const g = () => {
          a.value = HE(t.states);
        };
        t.on("update", g), g(), f.push(() => t.off("update", g));
      }
      const p = {
        tiptapEditor: d,
        doc: o,
        fragment: l,
        users: a,
        isConnected: c,
        updateUser: (g) => {
          t && (Object.assign(i, g), t.setLocalStateField("user", i));
        }
      };
      u.transcriptionEditor = p;
      const m = re(
        () => u.activeChannel.value,
        (g) => {
          g && (m(), qE(u, n, o, r, d, f));
        },
        { immediate: !0 }
      );
      return () => {
        m(), f.forEach((g) => g()), d.value?.destroy(), e || o.destroy(), u.transcriptionEditor = void 0;
      };
    }
  };
}
function qE(n, e, t, r, i, s) {
  const o = A(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    OE,
    PE,
    lC,
    ME.configure({
      document: t,
      field: r
    }),
    RE.configure({
      store: n,
      getTranslation: () => o.value
    }),
    LE.configure({ core: n }),
    ...n.pluginExtensions
  ];
  e.awareness && l.push(
    FE.configure({
      awareness: e.awareness,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  );
  const a = t.getXmlFragment(r);
  if (a.length === 0) {
    const h = ip(o.value.turns.value), p = Kb(l);
    hE(p, h, a);
  }
  i.value = new X0({
    extensions: l
  });
  let c = o.value.id;
  const u = re(
    () => o.value.id,
    (h) => {
      h !== c && (c = h, WE(i.value, o.value.turns.value));
    }
  ), d = n.on("translation:sync", () => {
    console.warn(
      "[transcriptionEditor] translation:sync is not supported while the editor is active"
    );
  }), f = n.on("channel:sync", () => {
    console.warn(
      "[transcriptionEditor] channel:sync is not supported while the editor is active"
    );
  });
  s.push(u, d, f);
}
function WE(n, e) {
  if (!n) return;
  const t = ip(e);
  IE(() => {
    n.commands.setContent(t);
  });
}
function HE(n) {
  return Array.from(n.entries()).map(([e, t]) => ({
    clientId: e,
    ...t.user
  }));
}
function fu(n) {
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
function ho(n, e) {
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
function oM() {
  return {
    name: "live",
    install(n) {
      const e = gn(null), t = P(!1);
      t.value = !0;
      function r() {
        e.value = null, la(e);
      }
      function i(S, b) {
        if (n.activeChannelId.value !== b) return;
        const k = n.activeChannel.value;
        if (!k) return;
        const C = k.activeTranslation.value;
        if (C.isSource) {
          if (S.text == null) return;
          e.value = S.text;
        } else if (S.translations) {
          const x = S.translations.find(
            (E) => E.translationId === C.id
          );
          e.value = x?.text ?? null;
        } else
          return;
        la(e);
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
      function a(S, b) {
        S.turns.value.some((C) => C.id === b.id) ? S.updateTurn(b.id, b) : S.addTurn(b);
      }
      function c(S, b) {
        S.speakerId && n.speakers.ensure(S.speakerId);
        const k = n.channels.get(b);
        if (!k) {
          f();
          return;
        }
        if (S.text != null && a(
          k.sourceTranslation,
          fu(S)
        ), S.translations)
          for (const C of S.translations) {
            const x = k.translations.get(C.translationId);
            x && a(
              x,
              ho(S, C)
            );
          }
        f();
      }
      function u(S, b) {
        d([S], b);
      }
      function d(S, b) {
        const k = n.channels.get(b);
        if (!k) return;
        const C = /* @__PURE__ */ new Set();
        for (const T of S)
          T.speakerId && !C.has(T.speakerId) && (C.add(T.speakerId), n.speakers.ensure(T.speakerId));
        const x = [];
        for (const T of S)
          T.text != null && x.push(fu(T));
        x.length > 0 && k.sourceTranslation.prependTurns(x);
        const E = /* @__PURE__ */ new Map();
        for (const T of S)
          if (T.translations)
            for (const M of T.translations) {
              let I = E.get(M.translationId);
              I || (I = [], E.set(M.translationId, I)), I.push(ho(T, M));
            }
        for (const [T, M] of E) {
          const I = k.translations.get(T);
          I && I.prependTurns(M);
        }
      }
      function f() {
        l(), r();
      }
      function h(S) {
        const b = n.activeChannel.value;
        if (!b) return;
        const k = b.activeTranslation.value;
        if (!S.final && k.languages.includes(S.language))
          e.value = S.text;
        else if (S.final) {
          const C = b.translations.get(S.language);
          C && a(
            C,
            ho({ ...S }, S)
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
      ), y = n.on(
        "translation:sync",
        o
      ), w = n.on("channel:sync", o);
      return n.live = p, () => {
        f(), m(), g(), y(), w(), n.live = void 0;
      };
    }
  };
}
function lM(n = {}) {
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
function jE(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function aM(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(jE), o = s[0]?.startTime ?? i.stime, l = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
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
let sp = 0;
function UE(n) {
  return {
    id: `w_${sp++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function cM(n) {
  sp = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const l = s.words.map(UE);
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
  Fe as DocumentValidationError,
  nM as Layout,
  rM as createAudioPlugin,
  XE as createCore,
  oM as createLivePlugin,
  lM as createSubtitlePlugin,
  sM as createTranscriptionEditorPlugin,
  aM as mapApiDocument,
  cM as mapWhisperXDocument,
  YE as provideCore,
  GE as provideI18n,
  Nt as useCore,
  zp as validateEditorDocument
};
