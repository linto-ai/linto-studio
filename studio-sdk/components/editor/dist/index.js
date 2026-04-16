import * as ei from "vue";
import { shallowReactive as Xt, shallowRef as Xe, ref as I, computed as k, inject as Tt, provide as Pt, defineComponent as $, openBlock as E, createElementBlock as N, renderSlot as V, h as Me, createBlock as M, resolveDynamicComponent as Dn, normalizeClass as ut, normalizeStyle as Je, useSlots as ts, createCommentVNode as K, createTextVNode as ae, toDisplayString as X, createElementVNode as W, createVNode as B, withCtx as O, unref as p, watchEffect as we, onBeforeUnmount as pt, Fragment as be, customRef as ns, toValue as ce, getCurrentScope as Ni, onScopeDispose as Wi, effectScope as Vi, getCurrentInstance as Ze, readonly as is, watch as Z, nextTick as re, onMounted as oe, toHandlerKey as os, camelize as Hi, toRef as $t, onUnmounted as ht, toRefs as vt, Comment as ss, mergeProps as Q, cloneVNode as rs, reactive as ji, Teleport as Ui, normalizeProps as $n, guardReactiveProps as Bn, markRaw as as, renderList as Qe, withKeys as Wt, withModifiers as Pe, watchPostEffect as Ki, shallowReadonly as ot, mergeDefaults as ls, withMemo as us, createStaticVNode as cs, useTemplateRef as St, isMemoSame as ds, Transition as Xi, useId as fs, useModel as ps, withDirectives as hs, vShow as vs } from "vue";
function ms() {
  const n = /* @__PURE__ */ new Map();
  function e(s, r) {
    let a = n.get(s);
    return a || (a = /* @__PURE__ */ new Set(), n.set(s, a)), a.add(r), () => t(s, r);
  }
  function t(s, r) {
    n.get(s)?.delete(r);
  }
  function i(s, r) {
    n.get(s)?.forEach(
      (a) => a(r)
    );
  }
  function o() {
    n.clear();
  }
  return { on: e, off: t, emit: i, clear: o };
}
const ti = [
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
function gs(n, e, t) {
  const i = ti[n.size % ti.length];
  return { id: e, name: t, color: i };
}
function ys(n, e, t) {
  return !e || n.has(e) ? null : gs(n, e, t ?? e);
}
function bs(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function ws(n) {
  const e = Xt(/* @__PURE__ */ new Map());
  function t(s, r) {
    const a = ys(e, s, r);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(s, r) {
    const a = bs(e, s, r);
    a && (e.set(s, a), n("speaker:update", { speaker: a }));
  }
  function o() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: o };
}
function Ss(n, e) {
  return [...n, e];
}
function Cs(n, e) {
  return [...e, ...n];
}
function qn(n, e) {
  return n.findIndex((t) => t.id === e);
}
function xs(n, e, t) {
  const i = qn(n, e);
  if (i === -1) return null;
  const o = { ...n[i], ...t, id: e }, s = n.slice();
  return s[i] = o, { turns: s, updated: o };
}
function _s(n, e) {
  const t = qn(n, e);
  return t === -1 ? null : n.filter((i, o) => o !== t);
}
function Es(n, e, t) {
  const i = qn(n, e);
  if (i === -1) return null;
  const o = n[i], s = {
    ...o,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? o.startTime,
    endTime: t[t.length - 1]?.endTime ?? o.endTime
  }, r = n.slice();
  return r[i] = s, { turns: r, updated: s };
}
function En(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function ks(n, e, t) {
  const { id: i, languages: o, isSource: s, audio: r } = n, a = Xe(n.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const m = a.value;
    for (let g = 0; g < m.length; g++)
      l.set(m[g].id, g);
  }
  u();
  function c(m) {
    t(m.speakerId), l.set(m.id, a.value.length), a.value = Ss(a.value, m), e("turn:add", { turn: m, translationId: i });
  }
  function d(m, g) {
    const C = xs(a.value, m, g);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function h(m) {
    const g = _s(a.value, m);
    g && (a.value = g, u(), e("turn:remove", { turnId: m, translationId: i }));
  }
  function f(m, g) {
    const C = Es(a.value, m, g);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function v(m) {
    En(m, t), a.value = Cs(a.value, m), u();
  }
  function b(m) {
    En(m, t), a.value = m, u(), e("translation:sync", { translationId: i });
  }
  function y(m) {
    a.value = m, u();
  }
  function _(m) {
    const g = l.get(m.id);
    g !== void 0 ? a.value[g] = m : (l.set(m.id, a.value.length), a.value.push(m));
  }
  function S(m) {
    return l.has(m);
  }
  return { id: i, languages: o, isSource: s, audio: r, turns: a, addTurn: c, prependTurns: v, updateTurn: d, removeTurn: h, updateWords: f, setTurns: b, replaceTurns: y, updateOrCreateTurnSilent: _, hasTurn: S };
}
function ni(n, e, t) {
  const { id: i, name: o, description: s, duration: r } = n, a = Xt(/* @__PURE__ */ new Map());
  let l;
  for (const b of n.translations) {
    const y = ks(b, e, t);
    a.set(b.id, y), b.isSource && !l && (l = y);
  }
  l || (l = a.values().next().value);
  const u = I(null), c = I(!1), d = I(!0), h = k(() => u.value ? a.get(u.value) ?? l : l);
  function f(b) {
    const y = b === l.id ? null : b;
    y !== u.value && (u.value = y, e("translation:change", { translationId: h.value.id }));
  }
  function v() {
    for (const b of a.values())
      b.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: o,
    description: s,
    duration: r,
    translations: a,
    sourceTranslation: l,
    activeTranslation: h,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: v
  };
}
function Ts(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, o] of n.speakers)
    e.add(i), t.push({ id: i, name: o.name });
  for (const i of n.channels)
    for (const o of i.translations)
      for (const s of o.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Ps(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), o = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${o}, ${s}, ${e})`;
}
function Fn(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function Yi(n, e, t, i = "*") {
  return n.map((o) => ({
    value: o.id,
    label: o.languages.map((s) => Fn(s, e, i)).join(", ") + (o.isSource ? ` (${t})` : "")
  }));
}
function As(n, e = 250) {
  let t = !1, i = null;
  return (...o) => {
    if (t) {
      i = o;
      return;
    }
    t = !0, n(...o), setTimeout(() => {
      if (t = !1, i !== null) {
        const s = i;
        i = null, n(...s);
      }
    }, e);
  };
}
function Ct(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), o = e % 60, s = String(i).padStart(2, "0"), r = String(o).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${r}` : `${s}:${r}`;
}
class fe extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Is(n) {
  if (n == null || typeof n != "object")
    throw new fe("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new fe("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new fe("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new fe("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const i = e.channels[t], o = `channels[${t}]`;
    if (i == null || typeof i != "object")
      throw new fe(o, "must be a non-null object");
    if (typeof i.id != "string")
      throw new fe(`${o}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new fe(`${o}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new fe(`${o}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new fe(`${o}.translations`, "must be an array");
    for (let s = 0; s < i.translations.length; s++) {
      const r = i.translations[s], a = `${o}.translations[${s}]`;
      if (r == null || typeof r != "object")
        throw new fe(a, "must be a non-null object");
      if (typeof r.id != "string")
        throw new fe(`${a}.id`, "must be a string");
      if (!Array.isArray(r.languages))
        throw new fe(`${a}.languages`, "must be an array");
      if (typeof r.isSource != "boolean")
        throw new fe(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(r.turns))
        throw new fe(`${a}.turns`, "must be an array");
    }
  }
}
function Os(n, e) {
  const { width: t, height: i } = e.canvas, o = n[0], s = o.length / t, r = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += r * 2) {
    const l = Math.floor(a * s), u = Math.abs(o[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0), c = c + r, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0);
  }
  e.stroke(), e.closePath();
}
function Gi(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function Rs(n, e) {
  if (!Gi(n)) return null;
  let t = 0, i = n.length - 1;
  for (; t <= i; ) {
    const o = t + i >>> 1, s = n[o];
    if (e < s.startTime)
      i = o - 1;
    else if (e > s.endTime)
      t = o + 1;
    else
      return s.id;
  }
  return null;
}
function pf(n = {}) {
  const e = I(""), t = I(n.activeChannelId ?? ""), i = I(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: o, off: s, emit: r, clear: a } = ms(), l = ws(r), u = l, c = Xt(/* @__PURE__ */ new Map()), d = k(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function h(x, w) {
    return o(x, (A) => {
      A.translationId === d.value.activeTranslation.value.id && w(A);
    });
  }
  function f(x) {
    e.value = x.title, l.clear(), c.clear();
    for (const w of Ts(x))
      u.ensure(w.id, w.name);
    for (const w of x.channels)
      c.set(w.id, ni(w, r, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function v(x) {
    Is(x), f(x);
  }
  function b(x) {
    x !== t.value && (t.value = x, r("channel:change", { channelId: x }));
  }
  function y(x, w) {
    if (c.has(x)) {
      for (const A of w.translations)
        En(A.turns, u.ensure);
      c.set(x, ni(w, r, u.ensure)), r("channel:sync", { channelId: x });
    }
  }
  const _ = [], S = [];
  function m(x) {
    x.tiptapExtensions && S.push(...x.tiptapExtensions);
    const w = x.install(C);
    w && _.push(w);
  }
  function g() {
    r("destroy", void 0), _.forEach((x) => x()), _.length = 0, a();
  }
  n.document && f(n.document);
  const C = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    pluginExtensions: S,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: v,
    setActiveChannel: b,
    setChannel: y,
    on: o,
    off: s,
    emit: r,
    use: m,
    destroy: g
  };
  return C;
}
const Ji = /* @__PURE__ */ Symbol("editorStore");
function hf(n) {
  Pt(Ji, n);
}
function et() {
  const n = Tt(Ji);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const Ls = ["aria-label"], Ms = /* @__PURE__ */ $({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (E(), N("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      V(e.$slots, "default", {}, void 0, !0)
    ], 8, Ls));
  }
}), se = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, o] of e)
    t[i] = o;
  return t;
}, ii = /* @__PURE__ */ se(Ms, [["__scopeId", "data-v-3d3f8eba"]]);
const Ds = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const oi = (n) => n === "";
const $s = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const si = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Bs = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const qs = (n) => {
  const e = Bs(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var yt = {
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
const Fs = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: o,
  "stroke-width": s,
  size: r = yt.width,
  color: a = yt.stroke,
  ...l
}, { slots: u }) => Me(
  "svg",
  {
    ...yt,
    ...l,
    width: r,
    height: r,
    stroke: a,
    "stroke-width": oi(t) || oi(i) || t === !0 || i === !0 ? Number(o || s || yt["stroke-width"]) * 24 / Number(r) : o || s || yt["stroke-width"],
    class: $s(
      "lucide",
      l.class,
      ...n ? [`lucide-${si(qs(n))}-icon`, `lucide-${si(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !Ds(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Me(...c)), ...u.default ? [u.default()] : []]
);
const le = (n, e) => (t, { slots: i, attrs: o }) => Me(
  Fs,
  {
    ...o,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const zs = le("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Yt = le("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Zi = le("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Ns = le("clipboard-list", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M12 11h4", key: "1jrz19" }],
  ["path", { d: "M12 16h4", key: "n85exb" }],
  ["path", { d: "M8 11h.01", key: "1dfujw" }],
  ["path", { d: "M8 16h.01", key: "18s6g9" }]
]);
const Ws = le("clipboard-type", [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ],
  ["path", { d: "M9 12v-1h6v1", key: "iehl6m" }],
  ["path", { d: "M11 17h2", key: "12w5me" }],
  ["path", { d: "M12 11v6", key: "1bwqyc" }]
]);
const Vs = le("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Hs = le("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const ri = le("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const js = le("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Us = le("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Ks = le("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Xs = le("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Ys = le("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Gs = le("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Js = le("volume-2", [
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
const Zs = le("volume-x", [
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
const zn = le("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Qs = {
  "arrow-down": zs,
  check: Yt,
  "chevron-down": Zi,
  "clipboard-list": Ns,
  "clipboard-type": Ws,
  copy: Vs,
  download: Hs,
  pause: js,
  play: Us,
  settings: Ks,
  "skip-back": Xs,
  "skip-forward": Ys,
  users: Gs,
  volume: Js,
  "volume-mute": Zs,
  x: zn,
  "circle-notch": ri,
  spinner: ri
};
function kn(n) {
  if (n)
    return Qs[n];
}
const Qi = {
  sm: 16,
  md: 20,
  lg: 24
}, er = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, tr = /* @__PURE__ */ $({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = k(() => kn(e.name)), i = k(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (o, s) => t.value ? (E(), M(Dn(t.value), {
      key: 0,
      style: Je(i.value),
      class: ut(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (E(), N("span", er, "?"));
  }
}), Bt = /* @__PURE__ */ se(tr, [["__scopeId", "data-v-210c7f09"]]), nr = ["type", "disabled", "aria-disabled", "aria-label"], ir = {
  key: 3,
  class: "editor-btn__label"
}, or = /* @__PURE__ */ $({
  __name: "EditorButton",
  props: {
    label: {},
    icon: {},
    iconRight: {},
    variant: { default: "tertiary" },
    intent: { default: "default" },
    size: { default: "sm" },
    disabled: { type: Boolean, default: !1 },
    loading: { type: Boolean, default: !1 },
    block: { type: Boolean, default: !1 },
    type: { default: "button" },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = ts(), i = k(() => !!kn(e.icon)), o = k(() => !!kn(e.iconRight)), s = k(() => Qi[e.size]), r = k(() => e.disabled || e.loading), a = k(() => !!e.label || !!t.default), l = k(
      () => e.loading || i.value || !!t.icon
    ), u = k(() => l.value && !a.value), c = k(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      u.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, h) => (E(), N("button", {
      type: n.type,
      class: ut(c.value),
      disabled: r.value,
      "aria-disabled": r.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (E(), M(Bt, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : i.value ? (E(), M(Bt, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? V(d.$slots, "icon", { key: 2 }, void 0, !0) : K("", !0),
      a.value ? (E(), N("span", ir, [
        V(d.$slots, "default", {}, () => [
          ae(X(n.label), 1)
        ], !0)
      ])) : K("", !0),
      o.value ? (E(), M(Bt, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? V(d.$slots, "icon-right", { key: 5 }, void 0, !0) : K("", !0)
    ], 10, nr));
  }
}), ye = /* @__PURE__ */ se(or, [["__scopeId", "data-v-88f77497"]]), eo = {
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
  "transcription.loadingHistory": "Chargement…",
  "selection.count": "sélectionné(s)",
  "selection.copyText": "Copier le texte",
  "selection.copyWithMetadata": "Copier avec métadonnées",
  "selection.cancel": "Annuler",
  "selection.select": "Sélectionner {name}",
  "selection.deselect": "Désélectionner {name}"
}, sr = {
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
  "transcription.loadingHistory": "Loading…",
  "selection.count": "selected",
  "selection.copyText": "Copy text",
  "selection.copyWithMetadata": "Copy with metadata",
  "selection.cancel": "Cancel",
  "selection.select": "Select {name}",
  "selection.deselect": "Deselect {name}"
}, ai = { fr: eo, en: sr }, to = /* @__PURE__ */ Symbol("i18n");
function vf(n) {
  const e = k(() => {
    const i = ai[n.value] ?? ai.fr;
    return (o) => i[o] ?? o;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return Pt(to, t), t;
}
function Se() {
  const n = Tt(to);
  if (n) return n;
  const e = k(() => "fr");
  return {
    t: (t) => eo[t] ?? t,
    locale: e
  };
}
const rr = { class: "editor-header" }, ar = { class: "header-left" }, lr = { class: "document-title" }, ur = { class: "badges" }, cr = ["datetime"], dr = { class: "header-right" }, fr = /* @__PURE__ */ $({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = Se(), o = k(() => Fn(e.language, i.value, t("language.wildcard"))), s = k(() => Ct(e.duration)), r = k(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), N("header", rr, [
      W("div", ar, [
        W("h1", lr, X(r.value), 1),
        W("div", ur, [
          B(ii, null, {
            default: O(() => [
              ae(X(o.value), 1)
            ]),
            _: 1
          }),
          B(ii, null, {
            default: O(() => [
              W("time", {
                datetime: `PT${n.duration}S`
              }, X(s.value), 9, cr)
            ]),
            _: 1
          })
        ])
      ]),
      W("div", dr, [
        n.isMobile ? (E(), M(ye, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": p(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (E(), M(ye, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": p(t)("header.export")
        }, null, 8, ["aria-label"])) : (E(), M(ye, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: O(() => [
            ae(X(p(t)("header.export")), 1)
          ]),
          _: 1
        })),
        B(ye, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": p(t)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), pr = /* @__PURE__ */ se(fr, [["__scopeId", "data-v-c5fd975f"]]), cn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, hr = 70, vr = 1e3 / 60, mr = 350;
let qt = !1, li = !1;
function gr() {
  li || typeof document > "u" || (document.addEventListener("mousedown", () => {
    qt = !0;
  }), document.addEventListener("mouseup", () => {
    qt = !1;
  }), document.addEventListener("click", () => {
    qt = !1;
  }), li = !0);
}
const dn = /* @__PURE__ */ new Map();
function fn(...n) {
  const e = {
    damping: cn.damping,
    stiffness: cn.stiffness,
    mass: cn.mass
  };
  let t = !1;
  for (const o of n) {
    if (o === "instant") {
      t = !0;
      continue;
    }
    typeof o != "object" || !o || (t = !1, e.damping = o.damping ?? e.damping, e.stiffness = o.stiffness ?? e.stiffness, e.mass = o.mass ?? e.mass);
  }
  const i = JSON.stringify(e);
  return dn.has(i) || dn.set(i, Object.freeze({ ...e })), t ? "instant" : dn.get(i);
}
function yr(n = {}) {
  gr();
  let e = { ...n };
  const t = /* @__PURE__ */ new Set(), i = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function o() {
    const T = s();
    for (const L of t) L(T);
  }
  function s() {
    return {
      isAtBottom: i.isAtBottom || i.isNearBottom,
      isNearBottom: i.isNearBottom,
      escapedFromLock: i.escapedFromLock
    };
  }
  function r() {
    return i.scrollElement?.scrollTop ?? 0;
  }
  function a(T) {
    i.scrollElement && (i.scrollElement.scrollTop = T, i.ignoreScrollToTop = i.scrollElement.scrollTop);
  }
  function l() {
    const T = i.scrollElement, L = i.contentElement;
    return !T || !L ? 0 : T.scrollHeight - 1 - T.clientHeight;
  }
  let u;
  function c() {
    const T = i.scrollElement, L = i.contentElement;
    if (!T || !L)
      return 0;
    const D = l();
    if (!e.targetScrollTop)
      return D;
    if (u?.targetScrollTop === D)
      return u.calculatedScrollTop;
    const z = Math.max(
      Math.min(
        e.targetScrollTop(D, {
          scrollElement: T,
          contentElement: L
        }),
        D
      ),
      0
    );
    return u = { targetScrollTop: D, calculatedScrollTop: z }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), z;
  }
  function d() {
    return c() - r();
  }
  function h() {
    return d() <= hr;
  }
  function f(T) {
    i.isAtBottom = T, o();
  }
  function v(T) {
    i.escapedFromLock = T, o();
  }
  function b(T) {
    i.isNearBottom = T, o();
  }
  function y() {
    if (!qt || typeof window > "u")
      return !1;
    const T = window.getSelection?.();
    if (!T || !T.rangeCount)
      return !1;
    const L = T.getRangeAt(0), D = i.scrollElement;
    if (!D)
      return !1;
    const z = L.commonAncestorContainer;
    return !!(z && (D.contains(z) || z.contains(D)));
  }
  const _ = (T) => {
    if (T.target !== i.scrollElement)
      return;
    const L = r(), D = i.ignoreScrollToTop;
    let z = i.lastScrollTop ?? L;
    i.lastScrollTop = L, i.ignoreScrollToTop = void 0, D && D > L && (z = D), b(h()), setTimeout(() => {
      if (i.resizeDifference || L === D)
        return;
      if (y()) {
        v(!0), f(!1);
        return;
      }
      const R = L > z, q = L < z;
      if (i.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      q && (v(!0), f(!1)), R && v(!1), !i.escapedFromLock && h() && f(!0);
    }, 1);
  }, S = (T) => {
    const L = i.scrollElement;
    if (!L)
      return;
    let D = T.target;
    for (; D && !["scroll", "auto"].includes(getComputedStyle(D).overflow); ) {
      if (!D.parentElement)
        return;
      D = D.parentElement;
    }
    D === L && T.deltaY < 0 && L.scrollHeight > L.clientHeight && !i.animation?.ignoreEscapes && (v(!0), f(!1));
  };
  function m(T, L) {
    g(), i.scrollElement = T, i.contentElement = L, getComputedStyle(T).overflow === "visible" && (T.style.overflow = "auto"), T.addEventListener("scroll", _, { passive: !0 }), T.addEventListener("wheel", S, { passive: !0 });
    let D;
    i.resizeObserver = new ResizeObserver((z) => {
      const R = z[0];
      if (!R)
        return;
      const { height: q } = R.contentRect, Y = q - (D ?? q);
      if (i.resizeDifference = Y, r() > l() && a(l()), b(h()), Y >= 0) {
        const j = fn(
          e,
          D ? e.resize : e.initial
        );
        w({
          animation: j,
          wait: !0,
          preserveScrollPosition: !0,
          duration: j === "instant" ? void 0 : mr
        });
      } else
        h() && (v(!1), f(!0));
      D = q, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === Y && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(L);
  }
  function g() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", _), i.scrollElement.removeEventListener("wheel", S)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function C() {
    g(), t.clear();
  }
  function x(T) {
    e = { ...e, ...T };
  }
  function w(T = {}) {
    const L = typeof T == "string" ? { animation: T } : T;
    L.preserveScrollPosition || f(!0);
    const D = Date.now() + (Number(L.wait) || 0), z = fn(e, L.animation), { ignoreEscapes: R = !1 } = L;
    let q, Y = c();
    L.duration instanceof Promise ? L.duration.finally(() => {
      q = Date.now();
    }) : q = D + (L.duration ?? 0);
    const j = async () => {
      const G = new Promise((te) => {
        if (typeof requestAnimationFrame > "u") {
          te(!1);
          return;
        }
        requestAnimationFrame(() => te(!0));
      }).then(() => {
        if (!i.isAtBottom)
          return i.animation = void 0, !1;
        const te = r(), de = typeof performance < "u" ? performance.now() : Date.now(), nt = (de - (i.lastTick ?? de)) / vr;
        if (i.animation ||= { behavior: z, promise: G, ignoreEscapes: R }, i.animation.behavior === z && (i.lastTick = de), y() || D > Date.now())
          return j();
        if (te < Math.min(Y, c())) {
          if (i.animation?.behavior === z) {
            if (z === "instant")
              return a(c()), j();
            const Ce = z;
            i.velocity = (Ce.damping * i.velocity + Ce.stiffness * d()) / Ce.mass, i.accumulated += i.velocity * nt;
            const it = r();
            a(it + i.accumulated), r() !== it && (i.accumulated = 0);
          }
          return j();
        }
        return q > Date.now() ? (Y = c(), j()) : (i.animation = void 0, r() < c() ? w({
          animation: fn(e, e.resize),
          ignoreEscapes: R,
          duration: Math.max(0, q - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return G.then((te) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), te));
    };
    return L.wait !== !0 && (i.animation = void 0), i.animation?.behavior === z ? i.animation.promise : j();
  }
  const A = () => {
    v(!0), f(!1);
  };
  function P(T) {
    return t.add(T), () => t.delete(T);
  }
  return {
    attach: m,
    detach: g,
    destroy: C,
    setOptions: x,
    getState: s,
    onChange: P,
    scrollToBottom: w,
    stopScroll: A
  };
}
function br(n = {}) {
  const e = I(null), t = I(null), i = I(n.initial !== !1), o = I(!1), s = I(!1), r = yr(n);
  let a = null;
  return we((l) => {
    !e.value || !t.value || (r.attach(e.value, t.value), a = r.onChange((u) => {
      i.value = u.isAtBottom, o.value = u.isNearBottom, s.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, r.detach();
    }));
  }), pt(() => {
    r.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: i,
    isNearBottom: o,
    escapedFromLock: s,
    scrollToBottom: (l) => r.scrollToBottom(l),
    stopScroll: () => r.stopScroll(),
    setOptions: (l) => r.setOptions(l)
  };
}
const wr = /* @__PURE__ */ $({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (E(), N("span", {
      class: "speaker-indicator",
      style: Je({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), no = /* @__PURE__ */ se(wr, [["__scopeId", "data-v-9bffeda8"]]), Sr = { class: "speaker-label" }, Cr = {
  key: 1,
  class: "speaker-name"
}, xr = ["datetime"], _r = { class: "lang" }, Er = /* @__PURE__ */ $({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = Se(), o = k(
      () => Fn(
        e.language,
        i.value,
        t("language.wildcard")
      )
    ), s = k(
      () => e.startTime != null ? Ct(e.startTime) : null
    ), r = k(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = k(() => e.speaker?.color ?? "transparent");
    return (l, u) => (E(), N("div", Sr, [
      n.speaker ? (E(), M(no, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (E(), N("span", Cr, X(n.speaker.name), 1)) : K("", !0),
      s.value ? (E(), N("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value
      }, X(s.value), 9, xr)) : K("", !0),
      W("span", _r, X(o.value), 1)
    ]));
  }
}), kr = /* @__PURE__ */ se(Er, [["__scopeId", "data-v-64a75575"]]);
function ui(n) {
  return typeof n == "string" ? `'${n}'` : new Tr().serialize(n);
}
const Tr = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, i) {
      const o = typeof t, s = typeof i;
      return o === "string" && s === "string" ? t.localeCompare(i) : o === "number" && s === "number" ? t - i : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(i, !0));
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
      const o = t.constructor, s = o === Object || o === void 0 ? "" : o.name;
      if (s !== "" && globalThis[s] === o) return this.serializeBuiltInType(s, t);
      if (typeof t.toJSON == "function") {
        const r = t.toJSON();
        return s + (r !== null && typeof r == "object" ? this.$object(r) : `(${this.serialize(r)})`);
      }
      return this.serializeObjectEntries(s, Object.entries(t));
    }
    serializeBuiltInType(t, i) {
      const o = this["$" + t];
      if (o) return o.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(t, i.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, i) {
      const o = Array.from(i).sort((r, a) => this.compare(r[0], a[0]));
      let s = `${t}{`;
      for (let r = 0; r < o.length; r++) {
        const [a, l] = o[r];
        s += `${this.serialize(a, !0)}:${this.serialize(l)}`, r < o.length - 1 && (s += ",");
      }
      return s + "}";
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
      for (let o = 0; o < t.length; o++) i += this.serialize(t[o]), o < t.length - 1 && (i += ",");
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
      return `Set${this.$Array(Array.from(t).sort((i, o) => this.compare(i, o)))}`;
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
function Ye(n, e) {
  return n === e || ui(n) === ui(e);
}
function Pr(n, e, t) {
  const i = n.findIndex((a) => Ye(a, e)), o = n.findIndex((a) => Ye(a, t));
  if (i === -1 || o === -1) return [];
  const [s, r] = [i, o].sort((a, l) => a - l);
  return n.slice(s, r + 1);
}
function ci(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function me(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(r) => {
    const a = Tt(i, r);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (r) => (Pt(i, r), r)];
}
function pe() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Gt(n, e, t) {
  const i = t.originalEvent.target, o = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && i.addEventListener(n, e, { once: !0 }), i.dispatchEvent(o);
}
function ct(n) {
  return n == null;
}
function di(n, e) {
  return ct(n) ? !1 : Array.isArray(n) ? n.some((t) => Ye(t, e)) : Ye(n, e);
}
function Nn(n) {
  return n ? n.flatMap((e) => e.type === be ? Nn(e.children) : [e]) : [];
}
const [Jt] = me("ConfigProvider");
function Ar(n, e) {
  var t;
  const i = Xe();
  return we(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), is(i);
}
function Zt(n, e) {
  return Ni() ? (Wi(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function pn() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const r = () => e(s);
      return Zt(r), { off: r };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((r) => r(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Ir(n) {
  let e = !1, t;
  const i = Vi(!0);
  return ((...o) => (e || (t = i.run(() => n(...o)), e = !0), t));
}
const Be = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Or = (n) => typeof n < "u", Rr = Object.prototype.toString, Lr = (n) => Rr.call(n) === "[object Object]", fi = /* @__PURE__ */ Mr();
function Mr() {
  var n, e, t;
  return Be && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function hn(n) {
  return Array.isArray(n) ? n : [n];
}
function Dr(n) {
  return Ze();
}
// @__NO_SIDE_EFFECTS__
function $r(n) {
  if (!Be) return n;
  let e = 0, t, i;
  const o = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...s) => (e += 1, i || (i = Vi(!0), t = i.run(() => n(...s))), Zt(o), t));
}
function io(n, e = 1e4) {
  return ns((t, i) => {
    let o = ce(n), s;
    const r = () => setTimeout(() => {
      o = ce(n), i();
    }, ce(e));
    return Zt(() => {
      clearTimeout(s);
    }), {
      get() {
        return t(), o;
      },
      set(a) {
        o = a, i(), clearTimeout(s), s = r();
      }
    };
  });
}
function Br(n, e) {
  Dr() && pt(n, e);
}
function qr(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const Qt = Be ? window : void 0;
function Ie(n) {
  var e;
  const t = ce(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function oo(...n) {
  const e = (i, o, s, r) => (i.addEventListener(o, s, r), () => i.removeEventListener(o, s, r)), t = k(() => {
    const i = hn(ce(n[0])).filter((o) => o != null);
    return i.every((o) => typeof o != "string") ? i : void 0;
  });
  return qr(() => {
    var i, o;
    return [
      (i = (o = t.value) === null || o === void 0 ? void 0 : o.map((s) => Ie(s))) !== null && i !== void 0 ? i : [Qt].filter((s) => s != null),
      hn(ce(t.value ? n[1] : n[0])),
      hn(p(t.value ? n[2] : n[1])),
      ce(t.value ? n[3] : n[2])
    ];
  }, ([i, o, s, r], a, l) => {
    if (!i?.length || !o?.length || !s?.length) return;
    const u = Lr(r) ? { ...r } : r, c = i.flatMap((d) => o.flatMap((h) => s.map((f) => e(d, h, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function so() {
  const n = Xe(!1), e = Ze();
  return e && oe(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function Fr(n) {
  const e = /* @__PURE__ */ so();
  return k(() => (e.value, !!n()));
}
function zr(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Nr(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: o = Qt, eventName: s = "keydown", passive: r = !1, dedupe: a = !1 } = i, l = zr(e);
  return oo(o, s, (c) => {
    c.repeat && ce(a) || l(c) && t(c);
  }, r);
}
function Wr(n) {
  return JSON.parse(JSON.stringify(n));
}
function Vr(n, e, t = {}) {
  const { window: i = Qt, ...o } = t;
  let s;
  const r = /* @__PURE__ */ Fr(() => i && "ResizeObserver" in i), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = Z(k(() => {
    const c = ce(n);
    return Array.isArray(c) ? c.map((d) => Ie(d)) : [Ie(c)];
  }), (c) => {
    if (a(), r.value && i) {
      s = new ResizeObserver(e);
      for (const d of c) d && s.observe(d, o);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Zt(u), {
    isSupported: r,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function xt(n, e, t, i = {}) {
  var o, s;
  const { clone: r = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, h = Ze(), f = t || h?.emit || (h == null || (o = h.$emit) === null || o === void 0 ? void 0 : o.bind(h)) || (h == null || (s = h.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(h?.proxy));
  let v = l;
  e || (e = "modelValue"), v = v || `update:${e.toString()}`;
  const b = (S) => r ? typeof r == "function" ? r(S) : Wr(S) : S, y = () => Or(n[e]) ? b(n[e]) : c, _ = (S) => {
    d ? d(S) && f(v, S) : f(v, S);
  };
  if (a) {
    const S = I(y());
    let m = !1;
    return Z(() => n[e], (g) => {
      m || (m = !0, S.value = b(g), re(() => m = !1));
    }), Z(S, (g) => {
      !m && (g !== n[e] || u) && _(g);
    }, { deep: u }), S;
  } else return k({
    get() {
      return y();
    },
    set(S) {
      _(S);
    }
  });
}
function vn(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Tn(n, e, t = ".", i) {
  if (!vn(e))
    return Tn(n, {}, t, i);
  const o = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const r = n[s];
    r != null && (i && i(o, s, r, t) || (Array.isArray(r) && Array.isArray(o[s]) ? o[s] = [...r, ...o[s]] : vn(r) && vn(o[s]) ? o[s] = Tn(
      r,
      o[s],
      (t ? `${t}.` : "") + s.toString(),
      i
    ) : o[s] = r));
  }
  return o;
}
function Hr(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => Tn(t, i, "", n), {})
  );
}
const jr = Hr(), Ur = /* @__PURE__ */ $r(() => {
  const n = I(/* @__PURE__ */ new Map()), e = I(), t = k(() => {
    for (const r of n.value.values()) if (r) return !0;
    return !1;
  }), i = Jt({ scrollBody: I(!0) });
  let o = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", fi && o?.(), e.value = void 0;
  };
  return Z(t, (r, a) => {
    if (!Be) return;
    if (!r) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? jr({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), fi && (o = oo(document, "touchmove", (d) => Kr(d), { passive: !1 })), re(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function ro(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Ur();
  t.value.set(e, n ?? !1);
  const i = k({
    get: () => t.value.get(e) ?? !1,
    set: (o) => t.value.set(e, o)
  });
  return Br(() => {
    t.value.delete(e);
  }), i;
}
function ao(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : ao(t);
  }
}
function Kr(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && ao(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function lo(n) {
  const e = Jt({ dir: I("ltr") });
  return k(() => n?.value || e.dir?.value || "ltr");
}
function en(n) {
  const e = Ze(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((o) => {
    i[os(Hi(o))] = (...s) => n(o, ...s);
  }), i;
}
let mn = 0;
function Xr() {
  we((n) => {
    if (!Be) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? pi()), document.body.insertAdjacentElement("beforeend", e[1] ?? pi()), mn++, n(() => {
      mn === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), mn--;
    });
  });
}
function pi() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Wn(n) {
  return k(() => ce(n) ? !!Ie(n)?.closest("form") : !0);
}
function ne() {
  const n = Ze(), e = I(), t = k(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Ie(e)), i = Object.assign({}, n.exposed), o = {};
  for (const r in n.props) Object.defineProperty(o, r, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[r]
  });
  if (Object.keys(i).length > 0) for (const r in i) Object.defineProperty(o, r, {
    enumerable: !0,
    configurable: !0,
    get: () => i[r]
  });
  Object.defineProperty(o, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = o;
  function s(r) {
    if (e.value = r, !!r && (Object.defineProperty(o, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => r instanceof Element ? r : r.$el
    }), !(r instanceof Element) && !Object.hasOwn(r, "$el"))) {
      const a = r.$.exposed, l = Object.assign({}, o);
      for (const u in a) Object.defineProperty(l, u, {
        enumerable: !0,
        configurable: !0,
        get: () => a[u]
      });
      n.exposed = l;
    }
  }
  return {
    forwardRef: s,
    currentRef: e,
    currentElement: t
  };
}
function Vn(n) {
  const e = Ze(), t = Object.keys(e?.type.props ?? {}).reduce((o, s) => {
    const r = (e?.type.props[s]).default;
    return r !== void 0 && (o[s] = r), o;
  }, {}), i = $t(n);
  return k(() => {
    const o = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((r) => {
      o[Hi(r)] = s[r];
    }), Object.keys({
      ...t,
      ...o
    }).reduce((r, a) => (i.value[a] !== void 0 && (r[a] = i.value[a]), r), {});
  });
}
function Yr(n, e) {
  const t = Vn(n), i = e ? en(e) : {};
  return k(() => ({
    ...t.value,
    ...i
  }));
}
var Gr = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, st = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), Rt = {}, gn = 0, uo = function(n) {
  return n && (n.host || uo(n.parentNode));
}, Jr = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = uo(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Zr = function(n, e, t, i) {
  var o = Jr(e, Array.isArray(n) ? n : [n]);
  Rt[t] || (Rt[t] = /* @__PURE__ */ new WeakMap());
  var s = Rt[t], r = [], a = /* @__PURE__ */ new Set(), l = new Set(o), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  o.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        c(h);
      else
        try {
          var f = h.getAttribute(i), v = f !== null && f !== "false", b = (st.get(h) || 0) + 1, y = (s.get(h) || 0) + 1;
          st.set(h, b), s.set(h, y), r.push(h), b === 1 && v && Ot.set(h, !0), y === 1 && h.setAttribute(t, "true"), v || h.setAttribute(i, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", h, _);
        }
    });
  };
  return c(e), a.clear(), gn++, function() {
    r.forEach(function(d) {
      var h = st.get(d) - 1, f = s.get(d) - 1;
      st.set(d, h), s.set(d, f), h || (Ot.has(d) || d.removeAttribute(i), Ot.delete(d)), f || d.removeAttribute(t);
    }), gn--, gn || (st = /* @__PURE__ */ new WeakMap(), st = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), Rt = {});
  };
}, Qr = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), o = Gr(n);
  return o ? (i.push.apply(i, Array.from(o.querySelectorAll("[aria-live], script"))), Zr(i, o, t, "aria-hidden")) : function() {
    return null;
  };
};
function co(n) {
  let e;
  Z(() => Ie(n), (t) => {
    t ? e = Qr(t) : e && e();
  }), ht(() => {
    e && e();
  });
}
let ea = 0;
function dt(n, e = "reka") {
  if ("useId" in ei) return `${e}-${ei.useId?.()}`;
  const t = Jt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++ea}`;
}
function ta() {
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
function na(n) {
  const e = I(), t = k(() => e.value?.width ?? 0), i = k(() => e.value?.height ?? 0);
  return oe(() => {
    const o = Ie(n);
    if (o) {
      e.value = {
        width: o.offsetWidth,
        height: o.offsetHeight
      };
      const s = new ResizeObserver((r) => {
        if (!Array.isArray(r) || !r.length) return;
        const a = r[0];
        let l, u;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          l = d.inlineSize, u = d.blockSize;
        } else
          l = o.offsetWidth, u = o.offsetHeight;
        e.value = {
          width: l,
          height: u
        };
      });
      return s.observe(o, { box: "border-box" }), () => s.unobserve(o);
    } else e.value = void 0;
  }), {
    width: t,
    height: i
  };
}
function ia(n, e) {
  const t = I(n);
  function i(s) {
    return e[t.value][s] ?? t.value;
  }
  return {
    state: t,
    dispatch: (s) => {
      t.value = i(s);
    }
  };
}
function Hn(n) {
  const e = io("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (o, s) => {
      e.value = e.value + o;
      {
        const r = pe(), a = s.map((h) => ({
          ...h,
          textValue: h.value?.textValue ?? h.ref.textContent?.trim() ?? ""
        })), l = a.find((h) => h.ref === r), u = a.map((h) => h.textValue), c = sa(u, e.value, l?.textValue), d = a.find((h) => h.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function oa(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function sa(n, e, t) {
  const o = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let r = oa(n, Math.max(s, 0));
  o.length === 1 && (r = r.filter((u) => u !== t));
  const l = r.find((u) => u.toLowerCase().startsWith(o.toLowerCase()));
  return l !== t ? l : void 0;
}
function ra(n, e) {
  const t = I({}), i = I("none"), o = I(n), s = n.value ? "mounted" : "unmounted";
  let r;
  const a = e.value?.ownerDocument.defaultView ?? Qt, { state: l, dispatch: u } = ia(s, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (y) => {
    if (Be) {
      const _ = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(_);
    }
  };
  Z(n, async (y, _) => {
    const S = _ !== y;
    if (await re(), S) {
      const m = i.value, g = Lt(e.value);
      y ? (u("MOUNT"), c("enter"), g === "none" && c("after-enter")) : g === "none" || g === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : _ && m !== g ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const _ = Lt(e.value), S = _.includes(CSS.escape(y.animationName)), m = l.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && S && (c(`after-${m}`), u("ANIMATION_END"), !o.value)) {
      const g = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", r = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = g);
      });
    }
    y.target === e.value && _ === "none" && u("ANIMATION_END");
  }, h = (y) => {
    y.target === e.value && (i.value = Lt(e.value));
  }, f = Z(e, (y, _) => {
    y ? (t.value = getComputedStyle(y), y.addEventListener("animationstart", h), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (u("ANIMATION_END"), r !== void 0 && a?.clearTimeout(r), _?.removeEventListener("animationstart", h), _?.removeEventListener("animationcancel", d), _?.removeEventListener("animationend", d));
  }, { immediate: !0 }), v = Z(l, () => {
    const y = Lt(e.value);
    i.value = l.value === "mounted" ? y : "none";
  });
  return ht(() => {
    f(), v();
  }), { isPresent: k(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Lt(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var tn = $({
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
    const { present: i, forceMount: o } = vt(n), s = I(), { isPresent: r } = ra(i, s);
    t({ present: r });
    let a = e.default({ present: r.value });
    a = Nn(a || []);
    const l = Ze();
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
    return () => o.value || i.value || r.value ? Me(e.default({ present: r.value })[0], { ref: (u) => {
      const c = Ie(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const Pn = $({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Nn(t.default()), o = i.findIndex((l) => l.type !== ss);
      if (o === -1) return i;
      const s = i[o];
      delete s.props?.ref;
      const r = s.props ? Q(e, s.props) : e, a = rs({
        ...s,
        props: {}
      }, r);
      return i.length === 1 ? a : (i[o] = a, i);
    };
  }
}), aa = [
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
    return typeof i == "string" && aa.includes(i) ? () => Me(i, e) : i !== "template" ? () => Me(n.as, e, { default: t.default }) : () => Me(Pn, e, { default: t.default });
  }
});
function Vt() {
  const n = I(), e = k(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Ie(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Ve, la] = me("DialogRoot");
var ua = /* @__PURE__ */ $({
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
    const t = n, o = /* @__PURE__ */ xt(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = I(), r = I(), { modal: a } = vt(t);
    return la({
      open: o,
      modal: a,
      openModal: () => {
        o.value = !0;
      },
      onOpenChange: (l) => {
        o.value = l;
      },
      onOpenToggle: () => {
        o.value = !o.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: r
    }), (l, u) => V(l.$slots, "default", {
      open: p(o),
      close: () => o.value = !1
    });
  }
}), fo = ua, ca = /* @__PURE__ */ $({
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
    ne();
    const t = Ve();
    return (i, o) => (E(), M(p(ee), Q(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: o[0] || (o[0] = (s) => p(t).onOpenChange(!1))
    }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), da = ca;
const fa = "dismissableLayer.pointerDownOutside", pa = "dismissableLayer.focusOutside";
function po(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), o = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || o.indexOf(i) < o.indexOf(t)));
}
function ha(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, o = I(!1), s = I(() => {
  });
  return we((r) => {
    if (!Be || !ce(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (po(e.value, c)) {
          o.value = !1;
          return;
        }
        if (u.target && !o.value) {
          let h = function() {
            Gt(fa, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", s.value), s.value = h, i.addEventListener("click", s.value, { once: !0 })) : h();
        } else i.removeEventListener("click", s.value);
        o.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    r(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    ce(t) && (o.value = !0);
  } };
}
function va(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, o = I(!1);
  return we((s) => {
    if (!Be || !ce(t)) return;
    const r = async (a) => {
      if (!e?.value) return;
      await re(), await re();
      const l = a.target;
      !e.value || !l || po(e.value, l) || a.target && !o.value && Gt(pa, n, { originalEvent: a });
    };
    i.addEventListener("focusin", r), s(() => i.removeEventListener("focusin", r));
  }), {
    onFocusCapture: () => {
      ce(t) && (o.value = !0);
    },
    onBlurCapture: () => {
      ce(t) && (o.value = !1);
    }
  };
}
const ge = ji({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ma = /* @__PURE__ */ $({
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
    const t = n, i = e, { forwardRef: o, currentElement: s } = ne(), r = k(() => s.value?.ownerDocument ?? globalThis.document), a = k(() => ge.layersRoot), l = k(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), u = k(() => ge.layersWithOutsidePointerEventsDisabled.size > 0), c = k(() => {
      const f = Array.from(a.value), [v] = [...ge.layersWithOutsidePointerEventsDisabled].slice(-1), b = f.indexOf(v);
      return l.value >= b;
    }), d = ha(async (f) => {
      const v = [...ge.branches].some((b) => b?.contains(f.target));
      !c.value || v || (i("pointerDownOutside", f), i("interactOutside", f), await re(), f.defaultPrevented || i("dismiss"));
    }, s), h = va((f) => {
      [...ge.branches].some((b) => b?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, s);
    return Nr("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), we((f) => {
      s.value && (t.disableOutsidePointerEvents && (ge.layersWithOutsidePointerEventsDisabled.size === 0 && (ge.originalBodyPointerEvents = r.value.body.style.pointerEvents, r.value.body.style.pointerEvents = "none"), ge.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), f(() => {
        t.disableOutsidePointerEvents && ge.layersWithOutsidePointerEventsDisabled.size === 1 && !ct(ge.originalBodyPointerEvents) && (r.value.body.style.pointerEvents = ge.originalBodyPointerEvents);
      }));
    }), we((f) => {
      f(() => {
        s.value && (a.value.delete(s.value), ge.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (f, v) => (E(), M(p(ee), {
      ref: p(o),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: Je({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: p(h).onFocusCapture,
      onBlurCapture: p(h).onBlurCapture,
      onPointerdownCapture: p(d).onPointerDownCapture
    }, {
      default: O(() => [V(f.$slots, "default")]),
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
}), ho = ma;
const ga = /* @__PURE__ */ Ir(() => I([]));
function ya() {
  const n = ga();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = hi(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = hi(n.value, e), n.value[0]?.resume();
    }
  };
}
function hi(n, e) {
  const t = [...n], i = t.indexOf(e);
  return i !== -1 && t.splice(i, 1), t;
}
const yn = "focusScope.autoFocusOnMount", bn = "focusScope.autoFocusOnUnmount", vi = {
  bubbles: !1,
  cancelable: !0
};
function ba(n, { select: e = !1 } = {}) {
  const t = pe();
  for (const i of n)
    if (Fe(i, { select: e }), pe() !== t) return !0;
}
function wa(n) {
  const e = vo(n), t = mi(e, n), i = mi(e.reverse(), n);
  return [t, i];
}
function vo(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const o = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || o ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function mi(n, e) {
  for (const t of n) if (!Sa(t, { upTo: e })) return t;
}
function Sa(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Ca(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Fe(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = pe();
    n.focus({ preventScroll: !0 }), n !== t && Ca(n) && e && n.select();
  }
}
var xa = /* @__PURE__ */ $({
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
    const t = n, i = e, { currentRef: o, currentElement: s } = ne(), r = I(null), a = ya(), l = ji({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    we((c) => {
      if (!Be) return;
      const d = s.value;
      if (!t.trapped) return;
      function h(y) {
        if (l.paused || !d) return;
        const _ = y.target;
        d.contains(_) ? r.value = _ : Fe(r.value, { select: !0 });
      }
      function f(y) {
        if (l.paused || !d) return;
        const _ = y.relatedTarget;
        _ !== null && (d.contains(_) || Fe(r.value, { select: !0 }));
      }
      function v(y) {
        d.contains(r.value) || Fe(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", f);
      const b = new MutationObserver(v);
      d && b.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", f), b.disconnect();
      });
    }), we(async (c) => {
      const d = s.value;
      if (await re(), !d) return;
      a.add(l);
      const h = pe();
      if (!d.contains(h)) {
        const v = new CustomEvent(yn, vi);
        d.addEventListener(yn, (b) => i("mountAutoFocus", b)), d.dispatchEvent(v), v.defaultPrevented || (ba(vo(d), { select: !0 }), pe() === h && Fe(d));
      }
      c(() => {
        d.removeEventListener(yn, (y) => i("mountAutoFocus", y));
        const v = new CustomEvent(bn, vi), b = (y) => {
          i("unmountAutoFocus", y);
        };
        d.addEventListener(bn, b), d.dispatchEvent(v), setTimeout(() => {
          v.defaultPrevented || Fe(h ?? document.body, { select: !0 }), d.removeEventListener(bn, b), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, h = pe();
      if (d && h) {
        const f = c.currentTarget, [v, b] = wa(f);
        v && b ? !c.shiftKey && h === b ? (c.preventDefault(), t.loop && Fe(v, { select: !0 })) : c.shiftKey && h === v && (c.preventDefault(), t.loop && Fe(b, { select: !0 })) : h === f && c.preventDefault();
      }
    }
    return (c, d) => (E(), M(p(ee), {
      ref_key: "currentRef",
      ref: o,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), mo = xa;
function _a(n) {
  return n ? "open" : "closed";
}
function gi(n) {
  const e = pe();
  for (const t of n)
    if (t === e || (t.focus(), pe() !== e)) return;
}
const Ea = "DialogTitle", ka = "DialogContent";
function Ta({ titleName: n = Ea, contentName: e = ka, componentLink: t = "dialog.html#title", titleId: i, descriptionId: o, contentElement: s }) {
  const r = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  oe(() => {
    document.getElementById(i) || console.warn(r);
    const u = s.value?.getAttribute("aria-describedby");
    o && u && (document.getElementById(o) || console.warn(a));
  });
}
var Pa = /* @__PURE__ */ $({
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
    const t = n, i = e, o = Ve(), { forwardRef: s, currentElement: r } = ne();
    return o.titleId ||= dt(void 0, "reka-dialog-title"), o.descriptionId ||= dt(void 0, "reka-dialog-description"), oe(() => {
      o.contentElement = r, pe() !== document.body && (o.triggerElement.value = pe());
    }), process.env.NODE_ENV !== "production" && Ta({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: o.titleId,
      descriptionId: o.descriptionId,
      contentElement: r
    }), (a, l) => (E(), M(p(mo), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: O(() => [B(p(ho), Q({
        id: p(o).contentId,
        ref: p(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": p(o).descriptionId,
        "aria-labelledby": p(o).titleId,
        "data-state": p(_a)(p(o).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => p(o).onOpenChange(!1)),
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
}), go = Pa, Aa = /* @__PURE__ */ $({
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
    const t = n, i = e, o = Ve(), s = en(i), { forwardRef: r, currentElement: a } = ne();
    return co(a), (l, u) => (E(), M(go, Q({
      ...t,
      ...p(s)
    }, {
      ref: p(r),
      "trap-focus": p(o).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), p(o).triggerElement.value?.focus());
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
}), Ia = Aa, Oa = /* @__PURE__ */ $({
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
    const t = n, o = en(e);
    ne();
    const s = Ve(), r = I(!1), a = I(!1);
    return (l, u) => (E(), M(go, Q({
      ...t,
      ...p(o)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (r.value || p(s).triggerElement.value?.focus(), c.preventDefault()), r.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (r.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        p(s).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ra = Oa, La = /* @__PURE__ */ $({
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
    const t = n, i = e, o = Ve(), s = en(i), { forwardRef: r } = ne();
    return (a, l) => (E(), M(p(tn), { present: a.forceMount || p(o).open.value }, {
      default: O(() => [p(o).modal.value ? (E(), M(Ia, Q({
        key: 0,
        ref: p(r)
      }, {
        ...t,
        ...p(s),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), M(Ra, Q({
        key: 1,
        ref: p(r)
      }, {
        ...t,
        ...p(s),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), yo = La, Ma = /* @__PURE__ */ $({
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
    const e = Ve();
    return ro(!0), ne(), (t, i) => (E(), M(p(ee), {
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
}), Da = Ma, $a = /* @__PURE__ */ $({
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
    const e = Ve(), { forwardRef: t } = ne();
    return (i, o) => p(e)?.modal.value ? (E(), M(p(tn), {
      key: 0,
      present: i.forceMount || p(e).open.value
    }, {
      default: O(() => [B(Da, Q(i.$attrs, {
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
}), bo = $a, Ba = /* @__PURE__ */ $({
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
    const e = /* @__PURE__ */ so();
    return (t, i) => p(e) || t.forceMount ? (E(), M(Ui, {
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
}), wo = Ba, qa = /* @__PURE__ */ $({
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
    return (t, i) => (E(), M(p(wo), $n(Bn(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), So = qa, Fa = /* @__PURE__ */ $({
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
    const e = n, t = Ve();
    return ne(), (i, o) => (E(), M(p(ee), Q(e, { id: p(t).titleId }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Co = Fa;
const yi = "data-reka-collection-item";
function qe(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let o;
  if (t) {
    const c = I(/* @__PURE__ */ new Map());
    o = {
      collectionRef: I(),
      itemMap: c
    }, Pt(i, o);
  } else o = Tt(i);
  const s = (c = !1) => {
    const d = o.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${yi}]`)), v = Array.from(o.itemMap.value.values()).sort((b, y) => h.indexOf(b.ref) - h.indexOf(y.ref));
    return c ? v : v.filter((b) => b.ref.dataset.disabled !== "");
  }, r = $({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: v } = Vt();
      return Z(v, () => {
        o.collectionRef.value = v.value;
      }), () => Me(Pn, {
        ref: f,
        ...h
      }, d);
    }
  }), a = $({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: v } = Vt();
      return we((b) => {
        if (v.value) {
          const y = as(v.value);
          o.itemMap.value.set(y, {
            ref: v.value,
            value: c.value
          }), b(() => o.itemMap.value.delete(y));
        }
      }), () => Me(Pn, {
        ...h,
        [yi]: "",
        ref: f
      }, d);
    }
  }), l = k(() => Array.from(o.itemMap.value.values())), u = k(() => o.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: r,
    CollectionItem: a
  };
}
const za = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Na(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function xo(n, e, t) {
  const i = Na(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return za[i];
}
function Wa(n, e = !1) {
  const t = pe();
  for (const i of n)
    if (i === t || (i.focus({ preventScroll: e }), pe() !== t)) return;
}
function Va(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
const [Ha] = me("RovingFocusGroup");
var ja = /* @__PURE__ */ $({
  __name: "RovingFocusItem",
  props: {
    tabStopId: {
      type: String,
      required: !1
    },
    focusable: {
      type: Boolean,
      required: !1,
      default: !0
    },
    active: {
      type: Boolean,
      required: !1
    },
    allowShiftKey: {
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
      default: "span"
    }
  },
  setup(n) {
    const e = n, t = Ha(), i = dt(), o = k(() => e.tabStopId || i), s = k(() => t.currentTabStopId.value === o.value), { getItems: r, CollectionItem: a } = qe();
    oe(() => {
      e.focusable && t.onFocusableItemAdd();
    }), ht(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function l(u) {
      if (u.key === "Tab" && u.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (u.target !== u.currentTarget) return;
      const c = xo(u, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (u.metaKey || u.ctrlKey || u.altKey || !e.allowShiftKey && u.shiftKey) return;
        u.preventDefault();
        let d = [...r().map((h) => h.ref).filter((h) => h.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const h = d.indexOf(u.currentTarget);
          d = t.loop.value ? Va(d, h + 1) : d.slice(h + 1);
        }
        re(() => Wa(d));
      }
    }
    return (u, c) => (E(), M(p(a), null, {
      default: O(() => [B(p(ee), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": p(t).orientation.value,
        "data-active": u.active ? "" : void 0,
        "data-disabled": u.focusable ? void 0 : "",
        as: u.as,
        "as-child": u.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          u.focusable ? p(t).onItemFocus(o.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => p(t).onItemFocus(o.value)),
        onKeydown: l
      }, {
        default: O(() => [V(u.$slots, "default")]),
        _: 3
      }, 8, [
        "tabindex",
        "data-orientation",
        "data-active",
        "data-disabled",
        "as",
        "as-child"
      ])]),
      _: 3
    }));
  }
}), Ua = ja, Ka = /* @__PURE__ */ $({
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
    return (e, t) => (E(), M(p(ee), {
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
}), _o = Ka, Xa = /* @__PURE__ */ $({
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
    const e = n, { primitiveElement: t, currentElement: i } = Vt(), o = k(() => e.checked ?? e.value);
    return Z(o, (s, r) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && s !== r) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        c.call(a, s), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (s, r) => (E(), M(_o, Q({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), bi = Xa, Ya = /* @__PURE__ */ $({
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
    const e = n, t = k(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = k(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((o, s) => typeof o == "object" ? Object.entries(o).map(([r, a]) => ({
      name: `${e.name}[${s}][${r}]`,
      value: a
    })) : {
      name: `${e.name}[${s}]`,
      value: o
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([o, s]) => ({
      name: `${e.name}[${o}]`,
      value: s
    })) : []);
    return (o, s) => (E(), N(be, null, [K(" We render single input if it's required "), t.value ? (E(), M(bi, Q({ key: o.name }, {
      ...e,
      ...o.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"])) : (E(!0), N(be, { key: 1 }, Qe(i.value, (r) => (E(), M(bi, Q({ key: r.name }, { ref_for: !0 }, {
      ...e,
      ...o.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Eo = Ya;
const [Ga] = me("CheckboxGroupRoot");
function Ht(n) {
  return n === "indeterminate";
}
function ko(n) {
  return Ht(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [Ja, Za] = me("CheckboxRoot");
var Qa = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "CheckboxRoot",
  props: {
    defaultValue: {
      type: [Boolean, String],
      required: !1
    },
    modelValue: {
      type: [
        Boolean,
        String,
        null
      ],
      required: !1,
      default: void 0
    },
    disabled: {
      type: Boolean,
      required: !1
    },
    value: {
      type: null,
      required: !1,
      default: "on"
    },
    id: {
      type: String,
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
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, { forwardRef: o, currentElement: s } = ne(), r = Ga(null), a = /* @__PURE__ */ xt(t, "modelValue", i, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), l = k(() => r?.disabled.value || t.disabled), u = k(() => ct(r?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : di(r.modelValue.value, t.value));
    function c() {
      if (ct(r?.modelValue.value))
        a.value = Ht(a.value) ? !0 : !a.value;
      else {
        const f = [...r.modelValue.value || []];
        if (di(f, t.value)) {
          const v = f.findIndex((b) => Ye(b, t.value));
          f.splice(v, 1);
        } else f.push(t.value);
        r.modelValue.value = f;
      }
    }
    const d = Wn(s), h = k(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Za({
      disabled: l,
      state: u
    }), (f, v) => (E(), M(Dn(p(r)?.rovingFocus.value ? p(Ua) : p(ee)), Q(f.$attrs, {
      id: f.id,
      ref: p(o),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": p(Ht)(u.value) ? "mixed" : u.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || h.value,
      "data-state": p(ko)(u.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: p(r)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: Wt(Pe(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: O(() => [V(f.$slots, "default", {
        modelValue: p(a),
        state: u.value
      }), p(d) && f.name && !p(r) ? (E(), M(p(Eo), {
        key: 0,
        type: "checkbox",
        checked: !!u.value,
        name: f.name,
        value: f.value,
        disabled: l.value,
        required: f.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : K("v-if", !0)]),
      _: 3
    }, 16, [
      "id",
      "as-child",
      "as",
      "type",
      "aria-checked",
      "aria-required",
      "aria-label",
      "data-state",
      "data-disabled",
      "disabled",
      "focusable",
      "onKeydown"
    ]));
  }
}), el = Qa, tl = /* @__PURE__ */ $({
  __name: "CheckboxIndicator",
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
      required: !1,
      default: "span"
    }
  },
  setup(n) {
    const { forwardRef: e } = ne(), t = Ja();
    return (i, o) => (E(), M(p(tn), { present: i.forceMount || p(Ht)(p(t).state.value) || p(t).state.value === !0 }, {
      default: O(() => [B(p(ee), Q({
        ref: p(e),
        "data-state": p(ko)(p(t).state.value),
        "data-disabled": p(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": i.asChild,
        as: i.as
      }, i.$attrs), {
        default: O(() => [V(i.$slots, "default")]),
        _: 3
      }, 16, [
        "data-state",
        "data-disabled",
        "as-child",
        "as"
      ])]),
      _: 3
    }, 8, ["present"]));
  }
}), nl = tl;
const [To, il] = me("PopperRoot");
var ol = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = I();
    return il({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => V(t.$slots, "default");
  }
}), sl = ol, rl = /* @__PURE__ */ $({
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
    const e = n, { forwardRef: t, currentElement: i } = ne(), o = To();
    return Ki(() => {
      o.onAnchorChange(e.reference ?? i.value);
    }), (s, r) => (E(), M(p(ee), {
      ref: p(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: O(() => [V(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), al = rl;
function ll(n) {
  return n !== null;
}
function ul(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: o } = e, r = o.arrow?.centerOffset !== 0, a = r ? 0 : n.arrowWidth, l = r ? 0 : n.arrowHeight, [u, c] = An(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], h = (o.arrow?.x ?? 0) + a / 2, f = (o.arrow?.y ?? 0) + l / 2;
      let v = "", b = "";
      return u === "bottom" ? (v = r ? d : `${h}px`, b = `${-l}px`) : u === "top" ? (v = r ? d : `${h}px`, b = `${i.floating.height + l}px`) : u === "right" ? (v = `${-l}px`, b = r ? d : `${f}px`) : u === "left" && (v = `${i.floating.width + l}px`, b = r ? d : `${f}px`), { data: {
        x: v,
        y: b
      } };
    }
  };
}
function An(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const cl = ["top", "right", "bottom", "left"], Ne = Math.min, he = Math.max, jt = Math.round, Mt = Math.floor, Ae = (n) => ({
  x: n,
  y: n
}), dl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, fl = {
  start: "end",
  end: "start"
};
function In(n, e, t) {
  return he(n, Ne(e, t));
}
function De(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function $e(n) {
  return n.split("-")[0];
}
function mt(n) {
  return n.split("-")[1];
}
function jn(n) {
  return n === "x" ? "y" : "x";
}
function Un(n) {
  return n === "y" ? "height" : "width";
}
const pl = /* @__PURE__ */ new Set(["top", "bottom"]);
function Te(n) {
  return pl.has($e(n)) ? "y" : "x";
}
function Kn(n) {
  return jn(Te(n));
}
function hl(n, e, t) {
  t === void 0 && (t = !1);
  const i = mt(n), o = Kn(n), s = Un(o);
  let r = o === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (r = Ut(r)), [r, Ut(r)];
}
function vl(n) {
  const e = Ut(n);
  return [On(n), e, On(e)];
}
function On(n) {
  return n.replace(/start|end/g, (e) => fl[e]);
}
const wi = ["left", "right"], Si = ["right", "left"], ml = ["top", "bottom"], gl = ["bottom", "top"];
function yl(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? Si : wi : e ? wi : Si;
    case "left":
    case "right":
      return e ? ml : gl;
    default:
      return [];
  }
}
function bl(n, e, t, i) {
  const o = mt(n);
  let s = yl($e(n), t === "start", i);
  return o && (s = s.map((r) => r + "-" + o), e && (s = s.concat(s.map(On)))), s;
}
function Ut(n) {
  return n.replace(/left|right|bottom|top/g, (e) => dl[e]);
}
function wl(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Po(n) {
  return typeof n != "number" ? wl(n) : {
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
    height: o
  } = n;
  return {
    width: i,
    height: o,
    top: t,
    left: e,
    right: e + i,
    bottom: t + o,
    x: e,
    y: t
  };
}
function Ci(n, e, t) {
  let {
    reference: i,
    floating: o
  } = n;
  const s = Te(e), r = Kn(e), a = Un(r), l = $e(e), u = s === "y", c = i.x + i.width / 2 - o.width / 2, d = i.y + i.height / 2 - o.height / 2, h = i[a] / 2 - o[a] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: c,
        y: i.y - o.height
      };
      break;
    case "bottom":
      f = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      f = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      f = {
        x: i.x - o.width,
        y: d
      };
      break;
    default:
      f = {
        x: i.x,
        y: i.y
      };
  }
  switch (mt(e)) {
    case "start":
      f[r] -= h * (t && u ? -1 : 1);
      break;
    case "end":
      f[r] += h * (t && u ? -1 : 1);
      break;
  }
  return f;
}
async function Sl(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: i,
    y: o,
    platform: s,
    rects: r,
    elements: a,
    strategy: l
  } = n, {
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: h = !1,
    padding: f = 0
  } = De(e, n), v = Po(f), y = a[h ? d === "floating" ? "reference" : "floating" : d], _ = Kt(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(y))) == null || t ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), S = d === "floating" ? {
    x: i,
    y: o,
    width: r.floating.width,
    height: r.floating.height
  } : r.reference, m = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), g = await (s.isElement == null ? void 0 : s.isElement(m)) ? await (s.getScale == null ? void 0 : s.getScale(m)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = Kt(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: m,
    strategy: l
  }) : S);
  return {
    top: (_.top - C.top + v.top) / g.y,
    bottom: (C.bottom - _.bottom + v.bottom) / g.y,
    left: (_.left - C.left + v.left) / g.x,
    right: (C.right - _.right + v.right) / g.x
  };
}
const Cl = async (n, e, t) => {
  const {
    placement: i = "bottom",
    strategy: o = "absolute",
    middleware: s = [],
    platform: r
  } = t, a = s.filter(Boolean), l = await (r.isRTL == null ? void 0 : r.isRTL(e));
  let u = await r.getElementRects({
    reference: n,
    floating: e,
    strategy: o
  }), {
    x: c,
    y: d
  } = Ci(u, i, l), h = i, f = {}, v = 0;
  for (let y = 0; y < a.length; y++) {
    var b;
    const {
      name: _,
      fn: S
    } = a[y], {
      x: m,
      y: g,
      data: C,
      reset: x
    } = await S({
      x: c,
      y: d,
      initialPlacement: i,
      placement: h,
      strategy: o,
      middlewareData: f,
      rects: u,
      platform: {
        ...r,
        detectOverflow: (b = r.detectOverflow) != null ? b : Sl
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = m ?? c, d = g ?? d, f = {
      ...f,
      [_]: {
        ...f[_],
        ...C
      }
    }, x && v <= 50 && (v++, typeof x == "object" && (x.placement && (h = x.placement), x.rects && (u = x.rects === !0 ? await r.getElementRects({
      reference: n,
      floating: e,
      strategy: o
    }) : x.rects), {
      x: c,
      y: d
    } = Ci(u, h, l)), y = -1);
  }
  return {
    x: c,
    y: d,
    placement: h,
    strategy: o,
    middlewareData: f
  };
}, xl = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: i,
      placement: o,
      rects: s,
      platform: r,
      elements: a,
      middlewareData: l
    } = e, {
      element: u,
      padding: c = 0
    } = De(n, e) || {};
    if (u == null)
      return {};
    const d = Po(c), h = {
      x: t,
      y: i
    }, f = Kn(o), v = Un(f), b = await r.getDimensions(u), y = f === "y", _ = y ? "top" : "left", S = y ? "bottom" : "right", m = y ? "clientHeight" : "clientWidth", g = s.reference[v] + s.reference[f] - h[f] - s.floating[v], C = h[f] - s.reference[f], x = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(u));
    let w = x ? x[m] : 0;
    (!w || !await (r.isElement == null ? void 0 : r.isElement(x))) && (w = a.floating[m] || s.floating[v]);
    const A = g / 2 - C / 2, P = w / 2 - b[v] / 2 - 1, T = Ne(d[_], P), L = Ne(d[S], P), D = T, z = w - b[v] - L, R = w / 2 - b[v] / 2 + A, q = In(D, R, z), Y = !l.arrow && mt(o) != null && R !== q && s.reference[v] / 2 - (R < D ? T : L) - b[v] / 2 < 0, j = Y ? R < D ? R - D : R - z : 0;
    return {
      [f]: h[f] + j,
      data: {
        [f]: q,
        centerOffset: R - q - j,
        ...Y && {
          alignmentOffset: j
        }
      },
      reset: Y
    };
  }
}), _l = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: o,
        middlewareData: s,
        rects: r,
        initialPlacement: a,
        platform: l,
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: h,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: b = !0,
        ...y
      } = De(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const _ = $e(o), S = Te(a), m = $e(a) === a, g = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), C = h || (m || !b ? [Ut(a)] : vl(a)), x = v !== "none";
      !h && x && C.push(...bl(a, b, v, g));
      const w = [a, ...C], A = await l.detectOverflow(e, y), P = [];
      let T = ((i = s.flip) == null ? void 0 : i.overflows) || [];
      if (c && P.push(A[_]), d) {
        const R = hl(o, r, g);
        P.push(A[R[0]], A[R[1]]);
      }
      if (T = [...T, {
        placement: o,
        overflows: P
      }], !P.every((R) => R <= 0)) {
        var L, D;
        const R = (((L = s.flip) == null ? void 0 : L.index) || 0) + 1, q = w[R];
        if (q && (!(d === "alignment" ? S !== Te(q) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        T.every((G) => Te(G.placement) === S ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: R,
              overflows: T
            },
            reset: {
              placement: q
            }
          };
        let Y = (D = T.filter((j) => j.overflows[0] <= 0).sort((j, G) => j.overflows[1] - G.overflows[1])[0]) == null ? void 0 : D.placement;
        if (!Y)
          switch (f) {
            case "bestFit": {
              var z;
              const j = (z = T.filter((G) => {
                if (x) {
                  const te = Te(G.placement);
                  return te === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  te === "y";
                }
                return !0;
              }).map((G) => [G.placement, G.overflows.filter((te) => te > 0).reduce((te, de) => te + de, 0)]).sort((G, te) => G[1] - te[1])[0]) == null ? void 0 : z[0];
              j && (Y = j);
              break;
            }
            case "initialPlacement":
              Y = a;
              break;
          }
        if (o !== Y)
          return {
            reset: {
              placement: Y
            }
          };
      }
      return {};
    }
  };
};
function xi(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function _i(n) {
  return cl.some((e) => n[e] >= 0);
}
const El = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: i
      } = e, {
        strategy: o = "referenceHidden",
        ...s
      } = De(n, e);
      switch (o) {
        case "referenceHidden": {
          const r = await i.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = xi(r, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: _i(a)
            }
          };
        }
        case "escaped": {
          const r = await i.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = xi(r, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: _i(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ao = /* @__PURE__ */ new Set(["left", "top"]);
async function kl(n, e) {
  const {
    placement: t,
    platform: i,
    elements: o
  } = n, s = await (i.isRTL == null ? void 0 : i.isRTL(o.floating)), r = $e(t), a = mt(t), l = Te(t) === "y", u = Ao.has(r) ? -1 : 1, c = s && l ? -1 : 1, d = De(e, n);
  let {
    mainAxis: h,
    crossAxis: f,
    alignmentAxis: v
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof v == "number" && (f = a === "end" ? v * -1 : v), l ? {
    x: f * c,
    y: h * u
  } : {
    x: h * u,
    y: f * c
  };
}
const Tl = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, i;
      const {
        x: o,
        y: s,
        placement: r,
        middlewareData: a
      } = e, l = await kl(e, n);
      return r === ((t = a.offset) == null ? void 0 : t.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: o + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: r
        }
      };
    }
  };
}, Pl = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: i,
        placement: o,
        platform: s
      } = e, {
        mainAxis: r = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (_) => {
            let {
              x: S,
              y: m
            } = _;
            return {
              x: S,
              y: m
            };
          }
        },
        ...u
      } = De(n, e), c = {
        x: t,
        y: i
      }, d = await s.detectOverflow(e, u), h = Te($e(o)), f = jn(h);
      let v = c[f], b = c[h];
      if (r) {
        const _ = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", m = v + d[_], g = v - d[S];
        v = In(m, v, g);
      }
      if (a) {
        const _ = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", m = b + d[_], g = b - d[S];
        b = In(m, b, g);
      }
      const y = l.fn({
        ...e,
        [f]: v,
        [h]: b
      });
      return {
        ...y,
        data: {
          x: y.x - t,
          y: y.y - i,
          enabled: {
            [f]: r,
            [h]: a
          }
        }
      };
    }
  };
}, Al = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: i,
        placement: o,
        rects: s,
        middlewareData: r
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: u = !0
      } = De(n, e), c = {
        x: t,
        y: i
      }, d = Te(o), h = jn(d);
      let f = c[h], v = c[d];
      const b = De(a, e), y = typeof b == "number" ? {
        mainAxis: b,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...b
      };
      if (l) {
        const m = h === "y" ? "height" : "width", g = s.reference[h] - s.floating[m] + y.mainAxis, C = s.reference[h] + s.reference[m] - y.mainAxis;
        f < g ? f = g : f > C && (f = C);
      }
      if (u) {
        var _, S;
        const m = h === "y" ? "width" : "height", g = Ao.has($e(o)), C = s.reference[d] - s.floating[m] + (g && ((_ = r.offset) == null ? void 0 : _[d]) || 0) + (g ? 0 : y.crossAxis), x = s.reference[d] + s.reference[m] + (g ? 0 : ((S = r.offset) == null ? void 0 : S[d]) || 0) - (g ? y.crossAxis : 0);
        v < C ? v = C : v > x && (v = x);
      }
      return {
        [h]: f,
        [d]: v
      };
    }
  };
}, Il = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: o,
        rects: s,
        platform: r,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...u
      } = De(n, e), c = await r.detectOverflow(e, u), d = $e(o), h = mt(o), f = Te(o) === "y", {
        width: v,
        height: b
      } = s.floating;
      let y, _;
      d === "top" || d === "bottom" ? (y = d, _ = h === (await (r.isRTL == null ? void 0 : r.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, y = h === "end" ? "top" : "bottom");
      const S = b - c.top - c.bottom, m = v - c.left - c.right, g = Ne(b - c[y], S), C = Ne(v - c[_], m), x = !e.middlewareData.shift;
      let w = g, A = C;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (A = m), (i = e.middlewareData.shift) != null && i.enabled.y && (w = S), x && !h) {
        const T = he(c.left, 0), L = he(c.right, 0), D = he(c.top, 0), z = he(c.bottom, 0);
        f ? A = v - 2 * (T !== 0 || L !== 0 ? T + L : he(c.left, c.right)) : w = b - 2 * (D !== 0 || z !== 0 ? D + z : he(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: A,
        availableHeight: w
      });
      const P = await r.getDimensions(a.floating);
      return v !== P.width || b !== P.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function nn() {
  return typeof window < "u";
}
function tt(n) {
  return Xn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function ve(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Re(n) {
  var e;
  return (e = (Xn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Xn(n) {
  return nn() ? n instanceof Node || n instanceof ve(n).Node : !1;
}
function _e(n) {
  return nn() ? n instanceof Element || n instanceof ve(n).Element : !1;
}
function Oe(n) {
  return nn() ? n instanceof HTMLElement || n instanceof ve(n).HTMLElement : !1;
}
function Ei(n) {
  return !nn() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof ve(n).ShadowRoot;
}
const Ol = /* @__PURE__ */ new Set(["inline", "contents"]);
function At(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: o
  } = Ee(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !Ol.has(o);
}
const Rl = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Ll(n) {
  return Rl.has(tt(n));
}
const Ml = [":popover-open", ":modal"];
function on(n) {
  return Ml.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Dl = ["transform", "translate", "scale", "rotate", "perspective"], $l = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Bl = ["paint", "layout", "strict", "content"];
function Yn(n) {
  const e = Gn(), t = _e(n) ? Ee(n) : n;
  return Dl.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || $l.some((i) => (t.willChange || "").includes(i)) || Bl.some((i) => (t.contain || "").includes(i));
}
function ql(n) {
  let e = We(n);
  for (; Oe(e) && !ft(e); ) {
    if (Yn(e))
      return e;
    if (on(e))
      return null;
    e = We(e);
  }
  return null;
}
function Gn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Fl = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function ft(n) {
  return Fl.has(tt(n));
}
function Ee(n) {
  return ve(n).getComputedStyle(n);
}
function sn(n) {
  return _e(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function We(n) {
  if (tt(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ei(n) && n.host || // Fallback.
    Re(n)
  );
  return Ei(e) ? e.host : e;
}
function Io(n) {
  const e = We(n);
  return ft(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Oe(e) && At(e) ? e : Io(e);
}
function _t(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const o = Io(n), s = o === ((i = n.ownerDocument) == null ? void 0 : i.body), r = ve(o);
  if (s) {
    const a = Rn(r);
    return e.concat(r, r.visualViewport || [], At(o) ? o : [], a && t ? _t(a) : []);
  }
  return e.concat(o, _t(o, [], t));
}
function Rn(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Oo(n) {
  const e = Ee(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const o = Oe(n), s = o ? n.offsetWidth : t, r = o ? n.offsetHeight : i, a = jt(t) !== s || jt(i) !== r;
  return a && (t = s, i = r), {
    width: t,
    height: i,
    $: a
  };
}
function Jn(n) {
  return _e(n) ? n : n.contextElement;
}
function lt(n) {
  const e = Jn(n);
  if (!Oe(e))
    return Ae(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: o,
    $: s
  } = Oo(e);
  let r = (s ? jt(t.width) : t.width) / i, a = (s ? jt(t.height) : t.height) / o;
  return (!r || !Number.isFinite(r)) && (r = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: r,
    y: a
  };
}
const zl = /* @__PURE__ */ Ae(0);
function Ro(n) {
  const e = ve(n);
  return !Gn() || !e.visualViewport ? zl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Nl(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== ve(n) ? !1 : e;
}
function Ge(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const o = n.getBoundingClientRect(), s = Jn(n);
  let r = Ae(1);
  e && (i ? _e(i) && (r = lt(i)) : r = lt(n));
  const a = Nl(s, t, i) ? Ro(s) : Ae(0);
  let l = (o.left + a.x) / r.x, u = (o.top + a.y) / r.y, c = o.width / r.x, d = o.height / r.y;
  if (s) {
    const h = ve(s), f = i && _e(i) ? ve(i) : i;
    let v = h, b = Rn(v);
    for (; b && i && f !== v; ) {
      const y = lt(b), _ = b.getBoundingClientRect(), S = Ee(b), m = _.left + (b.clientLeft + parseFloat(S.paddingLeft)) * y.x, g = _.top + (b.clientTop + parseFloat(S.paddingTop)) * y.y;
      l *= y.x, u *= y.y, c *= y.x, d *= y.y, l += m, u += g, v = ve(b), b = Rn(v);
    }
  }
  return Kt({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function rn(n, e) {
  const t = sn(n).scrollLeft;
  return e ? e.left + t : Ge(Re(n)).left + t;
}
function Lo(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - rn(n, t), o = t.top + e.scrollTop;
  return {
    x: i,
    y: o
  };
}
function Wl(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: o
  } = n;
  const s = o === "fixed", r = Re(i), a = e ? on(e.floating) : !1;
  if (i === r || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Ae(1);
  const c = Ae(0), d = Oe(i);
  if ((d || !d && !s) && ((tt(i) !== "body" || At(r)) && (l = sn(i)), Oe(i))) {
    const f = Ge(i);
    u = lt(i), c.x = f.x + i.clientLeft, c.y = f.y + i.clientTop;
  }
  const h = r && !d && !s ? Lo(r, l) : Ae(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + h.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + h.y
  };
}
function Vl(n) {
  return Array.from(n.getClientRects());
}
function Hl(n) {
  const e = Re(n), t = sn(n), i = n.ownerDocument.body, o = he(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), s = he(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let r = -t.scrollLeft + rn(n);
  const a = -t.scrollTop;
  return Ee(i).direction === "rtl" && (r += he(e.clientWidth, i.clientWidth) - o), {
    width: o,
    height: s,
    x: r,
    y: a
  };
}
const ki = 25;
function jl(n, e) {
  const t = ve(n), i = Re(n), o = t.visualViewport;
  let s = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (o) {
    s = o.width, r = o.height;
    const c = Gn();
    (!c || c && e === "fixed") && (a = o.offsetLeft, l = o.offsetTop);
  }
  const u = rn(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, h = getComputedStyle(d), f = c.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, v = Math.abs(i.clientWidth - d.clientWidth - f);
    v <= ki && (s -= v);
  } else u <= ki && (s += u);
  return {
    width: s,
    height: r,
    x: a,
    y: l
  };
}
const Ul = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Kl(n, e) {
  const t = Ge(n, !0, e === "fixed"), i = t.top + n.clientTop, o = t.left + n.clientLeft, s = Oe(n) ? lt(n) : Ae(1), r = n.clientWidth * s.x, a = n.clientHeight * s.y, l = o * s.x, u = i * s.y;
  return {
    width: r,
    height: a,
    x: l,
    y: u
  };
}
function Ti(n, e, t) {
  let i;
  if (e === "viewport")
    i = jl(n, t);
  else if (e === "document")
    i = Hl(Re(n));
  else if (_e(e))
    i = Kl(e, t);
  else {
    const o = Ro(n);
    i = {
      x: e.x - o.x,
      y: e.y - o.y,
      width: e.width,
      height: e.height
    };
  }
  return Kt(i);
}
function Mo(n, e) {
  const t = We(n);
  return t === e || !_e(t) || ft(t) ? !1 : Ee(t).position === "fixed" || Mo(t, e);
}
function Xl(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = _t(n, [], !1).filter((a) => _e(a) && tt(a) !== "body"), o = null;
  const s = Ee(n).position === "fixed";
  let r = s ? We(n) : n;
  for (; _e(r) && !ft(r); ) {
    const a = Ee(r), l = Yn(r);
    !l && a.position === "fixed" && (o = null), (s ? !l && !o : !l && a.position === "static" && !!o && Ul.has(o.position) || At(r) && !l && Mo(n, r)) ? i = i.filter((c) => c !== r) : o = a, r = We(r);
  }
  return e.set(n, i), i;
}
function Yl(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: o
  } = n;
  const r = [...t === "clippingAncestors" ? on(e) ? [] : Xl(e, this._c) : [].concat(t), i], a = r[0], l = r.reduce((u, c) => {
    const d = Ti(e, c, o);
    return u.top = he(d.top, u.top), u.right = Ne(d.right, u.right), u.bottom = Ne(d.bottom, u.bottom), u.left = he(d.left, u.left), u;
  }, Ti(e, a, o));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Gl(n) {
  const {
    width: e,
    height: t
  } = Oo(n);
  return {
    width: e,
    height: t
  };
}
function Jl(n, e, t) {
  const i = Oe(e), o = Re(e), s = t === "fixed", r = Ge(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ae(0);
  function u() {
    l.x = rn(o);
  }
  if (i || !i && !s)
    if ((tt(e) !== "body" || At(o)) && (a = sn(e)), i) {
      const f = Ge(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else o && u();
  s && !i && o && u();
  const c = o && !i && !s ? Lo(o, a) : Ae(0), d = r.left + a.scrollLeft - l.x - c.x, h = r.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: h,
    width: r.width,
    height: r.height
  };
}
function wn(n) {
  return Ee(n).position === "static";
}
function Pi(n, e) {
  if (!Oe(n) || Ee(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Re(n) === t && (t = t.ownerDocument.body), t;
}
function Do(n, e) {
  const t = ve(n);
  if (on(n))
    return t;
  if (!Oe(n)) {
    let o = We(n);
    for (; o && !ft(o); ) {
      if (_e(o) && !wn(o))
        return o;
      o = We(o);
    }
    return t;
  }
  let i = Pi(n, e);
  for (; i && Ll(i) && wn(i); )
    i = Pi(i, e);
  return i && ft(i) && wn(i) && !Yn(i) ? t : i || ql(n) || t;
}
const Zl = async function(n) {
  const e = this.getOffsetParent || Do, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: Jl(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Ql(n) {
  return Ee(n).direction === "rtl";
}
const eu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Wl,
  getDocumentElement: Re,
  getClippingRect: Yl,
  getOffsetParent: Do,
  getElementRects: Zl,
  getClientRects: Vl,
  getDimensions: Gl,
  getScale: lt,
  isElement: _e,
  isRTL: Ql
};
function $o(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function tu(n, e) {
  let t = null, i;
  const o = Re(n);
  function s() {
    var a;
    clearTimeout(i), (a = t) == null || a.disconnect(), t = null;
  }
  function r(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const u = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: h,
      height: f
    } = u;
    if (a || e(), !h || !f)
      return;
    const v = Mt(d), b = Mt(o.clientWidth - (c + h)), y = Mt(o.clientHeight - (d + f)), _ = Mt(c), m = {
      rootMargin: -v + "px " + -b + "px " + -y + "px " + -_ + "px",
      threshold: he(0, Ne(1, l)) || 1
    };
    let g = !0;
    function C(x) {
      const w = x[0].intersectionRatio;
      if (w !== l) {
        if (!g)
          return r();
        w ? r(!1, w) : i = setTimeout(() => {
          r(!1, 1e-7);
        }, 1e3);
      }
      w === 1 && !$o(u, n.getBoundingClientRect()) && r(), g = !1;
    }
    try {
      t = new IntersectionObserver(C, {
        ...m,
        // Handle <iframe>s
        root: o.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(C, m);
    }
    t.observe(n);
  }
  return r(!0), s;
}
function nu(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: o = !0,
    ancestorResize: s = !0,
    elementResize: r = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Jn(n), c = o || s ? [...u ? _t(u) : [], ..._t(e)] : [];
  c.forEach((_) => {
    o && _.addEventListener("scroll", t, {
      passive: !0
    }), s && _.addEventListener("resize", t);
  });
  const d = u && a ? tu(u, t) : null;
  let h = -1, f = null;
  r && (f = new ResizeObserver((_) => {
    let [S] = _;
    S && S.target === u && f && (f.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var m;
      (m = f) == null || m.observe(e);
    })), t();
  }), u && !l && f.observe(u), f.observe(e));
  let v, b = l ? Ge(n) : null;
  l && y();
  function y() {
    const _ = Ge(n);
    b && !$o(b, _) && t(), b = _, v = requestAnimationFrame(y);
  }
  return t(), () => {
    var _;
    c.forEach((S) => {
      o && S.removeEventListener("scroll", t), s && S.removeEventListener("resize", t);
    }), d?.(), (_ = f) == null || _.disconnect(), f = null, l && cancelAnimationFrame(v);
  };
}
const iu = Tl, ou = Pl, Ai = _l, su = Il, ru = El, au = xl, lu = Al, uu = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), o = {
    platform: eu,
    ...t
  }, s = {
    ...o.platform,
    _c: i
  };
  return Cl(n, e, {
    ...o,
    platform: s
  });
};
function cu(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Ln(n) {
  if (cu(n)) {
    const e = n.$el;
    return Xn(e) && tt(e) === "#comment" ? null : e;
  }
  return n;
}
function at(n) {
  return typeof n == "function" ? n() : p(n);
}
function du(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Ln(at(n.element));
      return t == null ? {} : au({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Bo(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ii(n, e) {
  const t = Bo(n);
  return Math.round(e * t) / t;
}
function fu(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, o = k(() => {
    var w;
    return (w = at(t.open)) != null ? w : !0;
  }), s = k(() => at(t.middleware)), r = k(() => {
    var w;
    return (w = at(t.placement)) != null ? w : "bottom";
  }), a = k(() => {
    var w;
    return (w = at(t.strategy)) != null ? w : "absolute";
  }), l = k(() => {
    var w;
    return (w = at(t.transform)) != null ? w : !0;
  }), u = k(() => Ln(n.value)), c = k(() => Ln(e.value)), d = I(0), h = I(0), f = I(a.value), v = I(r.value), b = Xe({}), y = I(!1), _ = k(() => {
    const w = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return w;
    const A = Ii(c.value, d.value), P = Ii(c.value, h.value);
    return l.value ? {
      ...w,
      transform: "translate(" + A + "px, " + P + "px)",
      ...Bo(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: A + "px",
      top: P + "px"
    };
  });
  let S;
  function m() {
    if (u.value == null || c.value == null)
      return;
    const w = o.value;
    uu(u.value, c.value, {
      middleware: s.value,
      placement: r.value,
      strategy: a.value
    }).then((A) => {
      d.value = A.x, h.value = A.y, f.value = A.strategy, v.value = A.placement, b.value = A.middlewareData, y.value = w !== !1;
    });
  }
  function g() {
    typeof S == "function" && (S(), S = void 0);
  }
  function C() {
    if (g(), i === void 0) {
      m();
      return;
    }
    if (u.value != null && c.value != null) {
      S = i(u.value, c.value, m);
      return;
    }
  }
  function x() {
    o.value || (y.value = !1);
  }
  return Z([s, r, a, o], m, {
    flush: "sync"
  }), Z([u, c], C, {
    flush: "sync"
  }), Z(o, x, {
    flush: "sync"
  }), Ni() && Wi(g), {
    x: ot(d),
    y: ot(h),
    strategy: ot(f),
    placement: ot(v),
    middlewareData: ot(b),
    isPositioned: ot(y),
    floatingStyles: _,
    update: m
  };
}
const pu = {
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
}, [mf, hu] = me("PopperContent");
var vu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ ls({
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
  }, { ...pu }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, o = To(), { forwardRef: s, currentElement: r } = ne(), a = I(), l = I(), { width: u, height: c } = na(l), d = k(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), h = k(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), f = k(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), v = k(() => ({
      padding: h.value,
      boundary: f.value.filter(ll),
      altBoundary: f.value.length > 0
    })), b = k(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), y = Ar(() => [
      iu({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Ai({
        ...v.value,
        ...b.value
      }),
      t.avoidCollisions && ou({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? lu() : void 0,
        ...v.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Ai({
        ...v.value,
        ...b.value
      }),
      su({
        ...v.value,
        apply: ({ elements: D, rects: z, availableWidth: R, availableHeight: q }) => {
          const { width: Y, height: j } = z.reference, G = D.floating.style;
          G.setProperty("--reka-popper-available-width", `${R}px`), G.setProperty("--reka-popper-available-height", `${q}px`), G.setProperty("--reka-popper-anchor-width", `${Y}px`), G.setProperty("--reka-popper-anchor-height", `${j}px`);
        }
      }),
      l.value && du({
        element: l.value,
        padding: t.arrowPadding
      }),
      ul({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && ru({
        strategy: "referenceHidden",
        ...v.value
      })
    ]), _ = k(() => t.reference ?? o.anchor.value), { floatingStyles: S, placement: m, isPositioned: g, middlewareData: C } = fu(_, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...D) => nu(...D, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: y
    }), x = k(() => An(m.value)[0]), w = k(() => An(m.value)[1]);
    Ki(() => {
      g.value && i("placed");
    });
    const A = k(() => {
      const D = C.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && D;
    }), P = I("");
    we(() => {
      r.value && (P.value = window.getComputedStyle(r.value).zIndex);
    });
    const T = k(() => C.value.arrow?.x ?? 0), L = k(() => C.value.arrow?.y ?? 0);
    return hu({
      placedSide: x,
      onArrowChange: (D) => l.value = D,
      arrowX: T,
      arrowY: L,
      shouldHideArrow: A
    }), (D, z) => (E(), N("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Je({
        ...p(S),
        transform: p(g) ? p(S).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: P.value,
        "--reka-popper-transform-origin": [p(C).transformOrigin?.x, p(C).transformOrigin?.y].join(" "),
        ...p(C).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [B(p(ee), Q({ ref: p(s) }, D.$attrs, {
      "as-child": t.asChild,
      as: D.as,
      "data-side": x.value,
      "data-align": w.value,
      style: { animation: p(g) ? void 0 : "none" }
    }), {
      default: O(() => [V(D.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), mu = vu;
function gu(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => wt(i, e, t)) : wt(n, e, t);
}
function wt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ye(n, e);
}
const [qo, yu] = me("ListboxRoot");
var bu = /* @__PURE__ */ $({
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
    const i = n, o = t, { multiple: s, highlightOnHover: r, orientation: a, disabled: l, selectionBehavior: u, dir: c } = vt(i), { getItems: d } = qe({ isProvider: !0 }), { handleTypeaheadSearch: h } = Hn(), { primitiveElement: f, currentElement: v } = Vt(), b = ta(), y = lo(c), _ = Wn(v), S = I(), m = I(!1), g = I(!0), C = /* @__PURE__ */ xt(i, "modelValue", o, {
      defaultValue: i.defaultValue ?? (s.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function x(F) {
      if (m.value = !0, i.multiple) {
        const H = Array.isArray(C.value) ? [...C.value] : [], U = H.findIndex((J) => wt(J, F, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? H.push(F) : H.splice(U, 1), C.value = H) : (C.value = [F], S.value = F);
      } else i.selectionBehavior === "toggle" && wt(C.value, F, i.by) ? C.value = void 0 : C.value = F;
      setTimeout(() => {
        m.value = !1;
      }, 1);
    }
    const w = I(null), A = I(null), P = I(!1), T = I(!1), L = /* @__PURE__ */ pn(), D = /* @__PURE__ */ pn(), z = /* @__PURE__ */ pn();
    function R() {
      return d().map((F) => F.ref).filter((F) => F.dataset.disabled !== "");
    }
    function q(F, H = !0) {
      if (!F) return;
      w.value = F, g.value && w.value.focus(), H && w.value.scrollIntoView({ block: "nearest" });
      const U = d().find((J) => J.ref === F);
      o("highlight", U);
    }
    function Y(F) {
      if (P.value) z.trigger(F);
      else {
        const H = d().find((U) => wt(U.value, F, i.by));
        H && (w.value = H.ref, q(H.ref));
      }
    }
    function j(F) {
      w.value && w.value.isConnected && (F.preventDefault(), F.stopPropagation(), T.value || w.value.click());
    }
    function G(F) {
      if (g.value) {
        if (m.value = !0, P.value) D.trigger(F);
        else {
          const H = F.altKey || F.ctrlKey || F.metaKey;
          if (H && F.key === "a" && s.value) {
            const U = d(), J = U.map((ke) => ke.value);
            C.value = [...J], F.preventDefault(), q(U[U.length - 1].ref);
          } else if (!H) {
            const U = h(F.key, d());
            U && q(U);
          }
        }
        setTimeout(() => {
          m.value = !1;
        }, 1);
      }
    }
    function te() {
      T.value = !0;
    }
    function de() {
      re(() => {
        T.value = !1;
      });
    }
    function nt() {
      re(() => {
        const F = new KeyboardEvent("keydown", { key: "PageUp" });
        je(F);
      });
    }
    function Ce(F) {
      const H = w.value;
      H?.isConnected && (A.value = H), w.value = null, o("leave", F);
    }
    function it(F) {
      const H = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (F.currentTarget?.dispatchEvent(H), o("entryFocus", H), !H.defaultPrevented)
        if (A.value) q(A.value);
        else {
          const U = R()?.[0];
          q(U);
        }
    }
    function je(F) {
      const H = xo(F, a.value, y.value);
      if (!H) return;
      let U = R();
      if (w.value) {
        if (H === "last") U.reverse();
        else if (H === "prev" || H === "next") {
          H === "prev" && U.reverse();
          const J = U.indexOf(w.value);
          U = U.slice(J + 1);
        }
        ln(F, U[0]);
      }
      if (U.length) {
        const J = !w.value && H === "prev" ? U.length - 1 : 0;
        q(U[J]);
      }
      if (P.value) return D.trigger(F);
    }
    function ln(F, H) {
      if (!(P.value || i.selectionBehavior !== "replace" || !s.value || !Array.isArray(C.value) || (F.altKey || F.ctrlKey || F.metaKey) && !F.shiftKey) && F.shiftKey) {
        const J = d().filter((Le) => Le.ref.dataset.disabled !== "");
        let ke = J.find((Le) => Le.ref === H)?.value;
        if (F.key === b.END ? ke = J[J.length - 1].value : F.key === b.HOME && (ke = J[0].value), !ke || !S.value) return;
        const gt = Pr(J.map((Le) => Le.value), S.value, ke);
        C.value = gt;
      }
    }
    async function un(F) {
      if (await re(), P.value) L.trigger(F);
      else {
        const H = R(), U = H.find((J) => J.dataset.state === "checked");
        U ? q(U) : H.length && q(H[0]);
      }
    }
    return Z(C, () => {
      m.value || re(() => {
        un();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: w,
      highlightItem: Y,
      highlightFirstItem: nt,
      highlightSelected: un,
      getItems: d
    }), yu({
      modelValue: C,
      onValueChange: x,
      multiple: s,
      orientation: a,
      dir: y,
      disabled: l,
      highlightOnHover: r,
      highlightedElement: w,
      isVirtual: P,
      virtualFocusHook: L,
      virtualKeydownHook: D,
      virtualHighlightHook: z,
      by: i.by,
      firstValue: S,
      selectionBehavior: u,
      focusable: g,
      onLeave: Ce,
      onEnter: it,
      changeHighlight: q,
      onKeydownEnter: j,
      onKeydownNavigation: je,
      onKeydownTypeAhead: G,
      onCompositionStart: te,
      onCompositionEnd: de,
      highlightFirstItem: nt
    }), (F, H) => (E(), M(p(ee), {
      ref_key: "primitiveElement",
      ref: f,
      as: F.as,
      "as-child": F.asChild,
      dir: p(y),
      "data-disabled": p(l) ? "" : void 0,
      onPointerleave: Ce,
      onFocusout: H[0] || (H[0] = async (U) => {
        const J = U.relatedTarget || U.target;
        await re(), w.value && p(v) && !p(v).contains(J) && Ce(U);
      })
    }, {
      default: O(() => [V(F.$slots, "default", { modelValue: p(C) }), p(_) && F.name ? (E(), M(p(Eo), {
        key: 0,
        name: F.name,
        value: p(C),
        disabled: p(l),
        required: F.required
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
}), wu = bu, Su = /* @__PURE__ */ $({
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
    const { CollectionSlot: e } = qe(), t = qo(), i = io(!1, 10);
    return (o, s) => (E(), M(p(e), null, {
      default: O(() => [B(p(ee), {
        role: "listbox",
        as: o.as,
        "as-child": o.asChild,
        tabindex: p(t).focusable.value ? p(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": p(t).orientation.value,
        "aria-multiselectable": !!p(t).multiple.value,
        "data-orientation": p(t).orientation.value,
        onMousedown: s[0] || (s[0] = Pe((r) => i.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (r) => {
          p(i) || p(t).onEnter(r);
        }),
        onKeydown: [
          s[2] || (s[2] = Wt((r) => {
            p(t).orientation.value === "vertical" && (r.key === "ArrowLeft" || r.key === "ArrowRight") || p(t).orientation.value === "horizontal" && (r.key === "ArrowUp" || r.key === "ArrowDown") || (r.preventDefault(), p(t).focusable.value && p(t).onKeydownNavigation(r));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Wt(p(t).onKeydownEnter, ["enter"]),
          p(t).onKeydownTypeAhead
        ]
      }, {
        default: O(() => [V(o.$slots, "default")]),
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
}), Cu = Su;
const xu = "listbox.select", [_u, Eu] = me("ListboxItem");
var ku = /* @__PURE__ */ $({
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
    const t = n, i = e, o = dt(void 0, "reka-listbox-item"), { CollectionItem: s } = qe(), { forwardRef: r, currentElement: a } = ne(), l = qo(), u = k(() => a.value === l.highlightedElement.value), c = k(() => gu(l.modelValue.value, t.value, l.by)), d = k(() => l.disabled.value || t.disabled);
    async function h(v) {
      i("select", v), !v?.defaultPrevented && !d.value && v && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function f(v) {
      const b = {
        originalEvent: v,
        value: t.value
      };
      Gt(xu, h, b);
    }
    return Eu({ isSelected: c }), (v, b) => (E(), M(p(s), { value: v.value }, {
      default: O(() => [us([u.value, c.value], () => B(p(ee), Q({ id: p(o) }, v.$attrs, {
        ref: p(r),
        role: "option",
        tabindex: p(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: v.as,
        "as-child": v.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: f,
        onKeydown: Wt(Pe(f, ["prevent"]), ["space"]),
        onPointermove: b[0] || (b[0] = () => {
          p(l).highlightedElement.value !== p(a) && p(l).highlightOnHover.value && !p(l).focusable.value && p(l).changeHighlight(p(a), !1);
        })
      }), {
        default: O(() => [V(v.$slots, "default")]),
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
      ]), b, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Tu = ku, Pu = /* @__PURE__ */ $({
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
    ne();
    const t = _u();
    return (i, o) => p(t).isSelected.value ? (E(), M(p(ee), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), Au = Pu;
function Iu(n) {
  const e = Jt({ nonce: I() });
  return k(() => n?.value || e.nonce?.value);
}
const Ou = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Ru = [" ", "Enter"], xe = 10;
function Et(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => Mn(i, e, t)) : Mn(n, e, t);
}
function Mn(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ye(n, e);
}
function Lu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Mu = {
  key: 0,
  value: ""
}, [He, Fo] = me("SelectRoot");
var Du = /* @__PURE__ */ $({
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
    const t = n, i = e, { required: o, disabled: s, multiple: r, dir: a } = vt(t), l = /* @__PURE__ */ xt(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (r.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ xt(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = I(), d = I(), h = I({
      x: 0,
      y: 0
    }), f = k(() => r.value && Array.isArray(l.value) ? l.value?.length === 0 : ct(l.value));
    qe({ isProvider: !0 });
    const v = lo(a), b = Wn(c), y = I(/* @__PURE__ */ new Set()), _ = k(() => Array.from(y.value).map((g) => g.value).join(";"));
    function S(g) {
      if (r.value) {
        const C = Array.isArray(l.value) ? [...l.value] : [], x = C.findIndex((w) => Mn(w, g, t.by));
        x === -1 ? C.push(g) : C.splice(x, 1), l.value = [...C];
      } else l.value = g;
    }
    function m(g) {
      return Array.from(y.value).find((C) => Et(g, C.value, t.by));
    }
    return Fo({
      triggerElement: c,
      onTriggerChange: (g) => {
        c.value = g;
      },
      valueElement: d,
      onValueElementChange: (g) => {
        d.value = g;
      },
      contentId: "",
      modelValue: l,
      onValueChange: S,
      by: t.by,
      open: u,
      multiple: r,
      required: o,
      onOpenChange: (g) => {
        u.value = g;
      },
      dir: v,
      triggerPointerDownPosRef: h,
      disabled: s,
      isEmptyModelValue: f,
      optionsSet: y,
      onOptionAdd: (g) => {
        const C = m(g.value);
        C && y.value.delete(C), y.value.add(g);
      },
      onOptionRemove: (g) => {
        const C = m(g.value);
        C && y.value.delete(C);
      }
    }), (g, C) => (E(), M(p(sl), null, {
      default: O(() => [V(g.$slots, "default", {
        modelValue: p(l),
        open: p(u)
      }), p(b) ? (E(), M(qu, {
        key: _.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: p(r),
        required: p(o),
        name: g.name,
        autocomplete: g.autocomplete,
        disabled: p(s),
        value: p(l)
      }, {
        default: O(() => [p(ct)(p(l)) ? (E(), N("option", Mu)) : K("v-if", !0), (E(!0), N(be, null, Qe(Array.from(y.value), (x) => (E(), N("option", Q({ key: x.value ?? "" }, { ref_for: !0 }, x), null, 16))), 128))]),
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
}), $u = Du, Bu = /* @__PURE__ */ $({
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
    const e = n, t = I(), i = He();
    Z(() => e.value, (s, r) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== r && u && t.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(t.value, s), t.value.dispatchEvent(c);
      }
    });
    function o(s) {
      i.onValueChange(s.target.value);
    }
    return (s, r) => (E(), M(p(_o), { "as-child": "" }, {
      default: O(() => [W("select", Q({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: o }), [V(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), qu = Bu, Fu = /* @__PURE__ */ $({
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
      default: xe
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
    return (i, o) => (E(), M(p(mu), Q(p(t), { style: {
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
}), zu = Fu;
const Nu = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [an, zo] = me("SelectContent");
var Wu = /* @__PURE__ */ $({
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
    const t = n, i = e, o = He();
    Xr(), ro(t.bodyLock);
    const { CollectionSlot: s, getItems: r } = qe(), a = I();
    co(a);
    const { search: l, handleTypeaheadSearch: u } = Hn(), c = I(), d = I(), h = I(), f = I(!1), v = I(!1), b = I(!1);
    function y() {
      d.value && a.value && gi([d.value, a.value]);
    }
    Z(f, () => {
      y();
    });
    const { onOpenChange: _, triggerPointerDownPosRef: S } = o;
    we((x) => {
      if (!a.value) return;
      let w = {
        x: 0,
        y: 0
      };
      const A = (T) => {
        w = {
          x: Math.abs(Math.round(T.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(T.pageY) - (S.value?.y ?? 0))
        };
      }, P = (T) => {
        T.pointerType !== "touch" && (w.x <= 10 && w.y <= 10 ? T.preventDefault() : a.value?.contains(T.target) || _(!1), document.removeEventListener("pointermove", A), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", A), document.addEventListener("pointerup", P, {
        capture: !0,
        once: !0
      })), x(() => {
        document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", P, { capture: !0 });
      });
    });
    function m(x) {
      const w = x.ctrlKey || x.altKey || x.metaKey;
      if (x.key === "Tab" && x.preventDefault(), !w && x.key.length === 1 && u(x.key, r()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(x.key)) {
        let P = [...r().map((T) => T.ref)];
        if (["ArrowUp", "End"].includes(x.key) && (P = P.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(x.key)) {
          const T = x.target, L = P.indexOf(T);
          P = P.slice(L + 1);
        }
        setTimeout(() => gi(P)), x.preventDefault();
      }
    }
    const g = k(() => t.position === "popper" ? t : {}), C = Vn(g.value);
    return zo({
      content: a,
      viewport: c,
      onViewportChange: (x) => {
        c.value = x;
      },
      itemRefCallback: (x, w, A) => {
        const P = !v.value && !A, T = Et(o.modelValue.value, w, o.by);
        if (o.multiple.value) {
          if (b.value) return;
          (T || P) && (d.value = x, T && (b.value = !0));
        } else (T || P) && (d.value = x);
        P && (v.value = !0);
      },
      selectedItem: d,
      selectedItemText: h,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (x, w, A) => {
        const P = !v.value && !A;
        (Et(o.modelValue.value, w, o.by) || P) && (h.value = x);
      },
      focusSelectedItem: y,
      position: t.position,
      isPositioned: f,
      searchRef: l
    }), (x, w) => (E(), M(p(s), null, {
      default: O(() => [B(p(mo), {
        "as-child": "",
        onMountAutoFocus: w[6] || (w[6] = Pe(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: w[7] || (w[7] = (A) => {
          i("closeAutoFocus", A), !A.defaultPrevented && (p(o).triggerElement.value?.focus({ preventScroll: !0 }), A.preventDefault());
        })
      }, {
        default: O(() => [B(p(ho), {
          "as-child": "",
          "disable-outside-pointer-events": x.disableOutsidePointerEvents,
          onFocusOutside: w[2] || (w[2] = Pe(() => {
          }, ["prevent"])),
          onDismiss: w[3] || (w[3] = (A) => p(o).onOpenChange(!1)),
          onEscapeKeyDown: w[4] || (w[4] = (A) => i("escapeKeyDown", A)),
          onPointerDownOutside: w[5] || (w[5] = (A) => i("pointerDownOutside", A))
        }, {
          default: O(() => [(E(), M(Dn(x.position === "popper" ? zu : Ku), Q({
            ...x.$attrs,
            ...p(C)
          }, {
            id: p(o).contentId,
            ref: (A) => {
              const P = p(Ie)(A);
              P?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = P.firstElementChild : a.value = P;
            },
            role: "listbox",
            "data-state": p(o).open.value ? "open" : "closed",
            dir: p(o).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: w[0] || (w[0] = Pe(() => {
            }, ["prevent"])),
            onPlaced: w[1] || (w[1] = (A) => f.value = !0),
            onKeydown: m
          }), {
            default: O(() => [V(x.$slots, "default")]),
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
}), Vu = Wu;
const [Hu, ju] = me("SelectItemAlignedPosition");
var Uu = /* @__PURE__ */ $({
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
    const t = n, i = e, { getItems: o } = qe(), s = He(), r = an(), a = I(!1), l = I(!0), u = I(), { forwardRef: c, currentElement: d } = ne(), { viewport: h, selectedItem: f, selectedItemText: v, focusSelectedItem: b } = r;
    function y() {
      if (s.triggerElement.value && s.valueElement.value && u.value && d.value && h?.value && f?.value && v?.value) {
        const m = s.triggerElement.value.getBoundingClientRect(), g = d.value.getBoundingClientRect(), C = s.valueElement.value.getBoundingClientRect(), x = v.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const F = x.left - g.left, H = C.left - F, U = m.left - H, J = m.width + U, ke = Math.max(J, g.width), gt = window.innerWidth - xe, Le = ci(H, xe, Math.max(xe, gt - ke));
          u.value.style.minWidth = `${J}px`, u.value.style.left = `${Le}px`;
        } else {
          const F = g.right - x.right, H = window.innerWidth - C.right - F, U = window.innerWidth - m.right - H, J = m.width + U, ke = Math.max(J, g.width), gt = window.innerWidth - xe, Le = ci(H, xe, Math.max(xe, gt - ke));
          u.value.style.minWidth = `${J}px`, u.value.style.right = `${Le}px`;
        }
        const w = o().map((F) => F.ref), A = window.innerHeight - xe * 2, P = h.value.scrollHeight, T = window.getComputedStyle(d.value), L = Number.parseInt(T.borderTopWidth, 10), D = Number.parseInt(T.paddingTop, 10), z = Number.parseInt(T.borderBottomWidth, 10), R = Number.parseInt(T.paddingBottom, 10), q = L + D + P + R + z, Y = Math.min(f.value.offsetHeight * 5, q), j = window.getComputedStyle(h.value), G = Number.parseInt(j.paddingTop, 10), te = Number.parseInt(j.paddingBottom, 10), de = m.top + m.height / 2 - xe, nt = A - de, Ce = f.value.offsetHeight / 2, it = f.value.offsetTop + Ce, je = L + D + it, ln = q - je;
        if (je <= de) {
          const F = f.value === w[w.length - 1];
          u.value.style.bottom = "0px";
          const H = d.value.clientHeight - h.value.offsetTop - h.value.offsetHeight, U = Math.max(nt, Ce + (F ? te : 0) + H + z), J = je + U;
          u.value.style.height = `${J}px`;
        } else {
          const F = f.value === w[0];
          u.value.style.top = "0px";
          const U = Math.max(de, L + h.value.offsetTop + (F ? G : 0) + Ce) + ln;
          u.value.style.height = `${U}px`, h.value.scrollTop = je - de + h.value.offsetTop;
        }
        u.value.style.margin = `${xe}px 0`, u.value.style.minHeight = `${Y}px`, u.value.style.maxHeight = `${A}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const _ = I("");
    oe(async () => {
      await re(), y(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(m) {
      m && l.value === !0 && (y(), b?.(), l.value = !1);
    }
    return Vr(s.triggerElement, () => {
      y();
    }), ju({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (m, g) => (E(), N("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: Je({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: _.value
      })
    }, [B(p(ee), Q({
      ref: p(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...m.$attrs,
      ...t
    }), {
      default: O(() => [V(m.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Ku = Uu, Xu = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Fo(n.context), zo(Nu), (t, i) => V(t.$slots, "default");
  }
}), Yu = Xu;
const Gu = { key: 1 };
var Ju = /* @__PURE__ */ $({
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
    const t = n, o = Yr(t, e), s = He(), r = I();
    oe(() => {
      r.value = new DocumentFragment();
    });
    const a = I(), l = k(() => t.forceMount || s.open.value), u = I(l.value);
    return Z(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (E(), M(p(tn), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: O(() => [B(Vu, $n(Bn({
        ...p(o),
        ...c.$attrs
      })), {
        default: O(() => [V(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : r.value ? (E(), N("div", Gu, [(E(), M(Ui, { to: r.value }, [B(Yu, { context: p(s) }, {
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), Zu = Ju, Qu = /* @__PURE__ */ $({
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
    return (e, t) => (E(), M(p(ee), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: O(() => [V(e.$slots, "default", {}, () => [t[0] || (t[0] = ae("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), ec = Qu;
const [No, tc] = me("SelectItem");
var nc = /* @__PURE__ */ $({
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
    const t = n, i = e, { disabled: o } = vt(t), s = He(), r = an(), { forwardRef: a, currentElement: l } = ne(), { CollectionItem: u } = qe(), c = k(() => Et(s.modelValue?.value, t.value, s.by)), d = I(!1), h = I(t.textValue ?? ""), f = dt(void 0, "reka-select-item-text"), v = "select.select";
    async function b(g) {
      if (g.defaultPrevented) return;
      const C = {
        originalEvent: g,
        value: t.value
      };
      Gt(v, y, C);
    }
    async function y(g) {
      await re(), i("select", g), !g.defaultPrevented && (o.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function _(g) {
      await re(), !g.defaultPrevented && (o.value ? r.onItemLeave?.() : g.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(g) {
      await re(), !g.defaultPrevented && g.currentTarget === pe() && r.onItemLeave?.();
    }
    async function m(g) {
      await re(), !(g.defaultPrevented || r.searchRef?.value !== "" && g.key === " ") && (Ru.includes(g.key) && b(g), g.key === " " && g.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return oe(() => {
      l.value && r.itemRefCallback(l.value, t.value, t.disabled);
    }), tc({
      value: t.value,
      disabled: o,
      textId: f,
      isSelected: c,
      onItemTextChange: (g) => {
        h.value = ((h.value || g?.textContent) ?? "").trim();
      }
    }), (g, C) => (E(), M(p(u), { value: { textValue: h.value } }, {
      default: O(() => [B(p(ee), {
        ref: p(a),
        role: "option",
        "aria-labelledby": p(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": p(o) || void 0,
        "data-disabled": p(o) ? "" : void 0,
        tabindex: p(o) ? void 0 : -1,
        as: g.as,
        "as-child": g.asChild,
        onFocus: C[0] || (C[0] = (x) => d.value = !0),
        onBlur: C[1] || (C[1] = (x) => d.value = !1),
        onPointerup: b,
        onPointerdown: C[2] || (C[2] = (x) => {
          x.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: C[3] || (C[3] = Pe(() => {
        }, ["prevent", "stop"])),
        onPointermove: _,
        onPointerleave: S,
        onKeydown: m
      }, {
        default: O(() => [V(g.$slots, "default")]),
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
}), ic = nc, oc = /* @__PURE__ */ $({
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
    const e = n, t = No();
    return (i, o) => p(t).isSelected.value ? (E(), M(p(ee), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), sc = oc, rc = /* @__PURE__ */ $({
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
    const e = n, t = He(), i = an(), o = No(), { forwardRef: s, currentElement: r } = ne(), a = k(() => ({
      value: o.value,
      disabled: o.disabled.value,
      textContent: r.value?.textContent ?? o.value?.toString() ?? ""
    }));
    return oe(() => {
      r.value && (o.onItemTextChange(r.value), i.itemTextRefCallback(r.value, o.value, o.disabled.value), t.onOptionAdd(a.value));
    }), ht(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (E(), M(p(ee), Q({
      id: p(o).textId,
      ref: p(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), ac = rc, lc = /* @__PURE__ */ $({
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
    return (t, i) => (E(), M(p(wo), $n(Bn(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), uc = lc, cc = /* @__PURE__ */ $({
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
    const e = n, t = He(), { forwardRef: i, currentElement: o } = ne(), s = k(() => t.disabled?.value || e.disabled);
    t.contentId ||= dt(void 0, "reka-select-content"), oe(() => {
      t.onTriggerChange(o.value);
    });
    const { getItems: r } = qe(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = Hn();
    function c() {
      s.value || (t.onOpenChange(!0), u());
    }
    function d(h) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(h.pageX),
        y: Math.round(h.pageY)
      };
    }
    return (h, f) => (E(), M(p(al), {
      "as-child": "",
      reference: h.reference
    }, {
      default: O(() => [B(p(ee), {
        ref: p(i),
        role: "combobox",
        type: h.as === "button" ? "button" : void 0,
        "aria-controls": p(t).contentId,
        "aria-expanded": p(t).open.value || !1,
        "aria-required": p(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: p(t)?.dir.value,
        "data-state": p(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": p(Lu)(p(t).modelValue?.value) ? "" : void 0,
        "as-child": h.asChild,
        as: h.as,
        onClick: f[0] || (f[0] = (v) => {
          v?.currentTarget?.focus();
        }),
        onPointerdown: f[1] || (f[1] = (v) => {
          if (v.pointerType === "touch") return v.preventDefault();
          const b = v.target;
          b.hasPointerCapture(v.pointerId) && b.releasePointerCapture(v.pointerId), v.button === 0 && v.ctrlKey === !1 && (d(v), v.preventDefault());
        }),
        onPointerup: f[2] || (f[2] = Pe((v) => {
          v.pointerType === "touch" && d(v);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (v) => {
          const b = p(a) !== "";
          !(v.ctrlKey || v.altKey || v.metaKey) && v.key.length === 1 && b && v.key === " " || (p(l)(v.key, p(r)()), p(Ou).includes(v.key) && (c(), v.preventDefault()));
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
}), dc = cc, fc = /* @__PURE__ */ $({
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
    const e = n, { forwardRef: t, currentElement: i } = ne(), o = He();
    oe(() => {
      o.valueElement = i;
    });
    const s = k(() => {
      let a = [];
      const l = Array.from(o.optionsSet.value), u = (c) => l.find((d) => Et(c, d.value, o.by));
      return Array.isArray(o.modelValue.value) ? a = o.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(o.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), r = k(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (E(), M(p(ee), {
      ref: p(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: O(() => [V(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: p(o).modelValue.value
      }, () => [ae(X(r.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), pc = fc, hc = /* @__PURE__ */ $({
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
    const e = n, { nonce: t } = vt(e), i = Iu(t), o = an(), s = o.position === "item-aligned" ? Hu() : void 0, { forwardRef: r, currentElement: a } = ne();
    oe(() => {
      o?.onViewportChange(a.value);
    });
    const l = I(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: h, contentWrapper: f } = s ?? {};
      if (h?.value && f?.value) {
        const v = Math.abs(l.value - d.scrollTop);
        if (v > 0) {
          const b = window.innerHeight - xe * 2, y = Number.parseFloat(f.value.style.minHeight), _ = Number.parseFloat(f.value.style.height), S = Math.max(y, _);
          if (S < b) {
            const m = S + v, g = Math.min(b, m), C = m - g;
            f.value.style.height = `${g}px`, f.value.style.bottom === "0px" && (d.scrollTop = C > 0 ? C : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (E(), N(be, null, [B(p(ee), Q({
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
    }, 16), B(p(ee), {
      as: "style",
      nonce: p(i)
    }, {
      default: O(() => d[0] || (d[0] = [ae(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), vc = hc;
const mc = /* @__PURE__ */ $({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (E(), M(p(el), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (i) => e.$emit("update:modelValue", !!i)),
      onClick: t[1] || (t[1] = Pe(() => {
      }, ["stop"]))
    }, {
      default: O(() => [
        B(p(nl), { class: "checkbox-indicator" }, {
          default: O(() => [
            B(p(Yt), {
              size: 12,
              "stroke-width": 3
            })
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["model-value", "aria-label"]));
  }
}), gc = /* @__PURE__ */ se(mc, [["__scopeId", "data-v-024ee78b"]]), Wo = /* @__PURE__ */ Symbol("turnSelection");
function Oi(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function yc(n, e, t) {
  const i = Xt(/* @__PURE__ */ new Map());
  let o = null;
  const s = k(() => i.size), r = k(() => i.size > 0);
  function a(_) {
    return i.has(_);
  }
  function l(_) {
    i.has(_) ? i.delete(_) : i.set(_, !0), o = _;
  }
  function u(_) {
    if (o === null) {
      l(_);
      return;
    }
    const S = n.value.map((w) => w.id), m = S.indexOf(o), g = S.indexOf(_);
    if (m === -1 || g === -1) {
      l(_);
      return;
    }
    const C = Math.min(m, g), x = Math.max(m, g);
    for (let w = C; w <= x; w++) {
      const A = S[w];
      A != null && i.set(A, !0);
    }
  }
  function c() {
    i.clear(), o = null;
  }
  async function d() {
    const S = n.value.filter((m) => i.has(m.id)).map(Oi).join(`

`);
    await navigator.clipboard.writeText(S);
  }
  async function h() {
    const S = n.value.filter((m) => i.has(m.id)).map((m) => {
      const C = (m.speakerId ? e.get(m.speakerId) : void 0)?.name ?? "", x = m.startTime != null ? Ct(m.startTime) : "", w = [C, x].filter(Boolean).join(" (") + (x ? ")" : ""), A = Oi(m);
      return w ? `${w}
${A}` : A;
    });
    await navigator.clipboard.writeText(S.join(`

`));
  }
  Z(
    () => n.value,
    (_) => {
      if (i.size === 0) return;
      const S = new Set(_.map((m) => m.id));
      for (const m of [...i.keys()])
        S.has(m) || i.delete(m);
    }
  );
  const f = t.on("channel:change", c), v = t.on("translation:change", c);
  function b(_) {
    _.key === "Escape" && i.size > 0 && c();
  }
  oe(() => {
    document.addEventListener("keydown", b);
  }), pt(() => {
    document.removeEventListener("keydown", b), f(), v();
  });
  const y = {
    count: s,
    hasSelection: r,
    isSelected: a,
    toggle: l,
    selectRange: u,
    clear: c,
    copyText: d,
    copyWithMetadata: h
  };
  return Pt(Wo, y), y;
}
function Vo() {
  const n = Tt(Wo);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const bc = ["data-turn-active", "aria-selected"], wc = { class: "turn-text" }, Sc = ["data-word-active"], Cc = /* @__PURE__ */ $({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = et(), i = Vo(), { t: o } = Se(), s = k(() => e.turn.words.length > 0), r = k(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const f = t.audio.currentTime.value, { startTime: v, endTime: b, words: y } = e.turn;
      return v == null || b == null || f < v || f > b ? null : Rs(y, f);
    }), a = k(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Gi(e.turn.words)) return !1;
      const f = t.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = k(() => e.speaker?.color ?? "transparent"), u = k(() => i.isSelected(e.turn.id)), c = k(() => {
      const f = e.speaker?.name ?? "", v = u.value ? "selection.deselect" : "selection.select";
      return o(v).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function h(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, v) => (E(), N("section", {
      class: ut(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: Je({ "--speaker-color": l.value }),
      "aria-selected": p(i).hasSelection.value ? u.value : void 0
    }, [
      n.partial ? K("", !0) : (E(), N("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        p(i).hasSelection.value ? (E(), M(gc, {
          key: 0,
          "model-value": u.value,
          "aria-label": c.value,
          onClick: Pe(h, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : K("", !0),
        B(kr, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      W("p", wc, [
        s.value ? (E(!0), N(be, { key: 0 }, Qe(n.turn.words, (b, y) => (E(), N(be, {
          key: b.id
        }, [
          W("span", {
            class: ut({ "word--active": b.id === r.value }),
            "data-word-active": b.id === r.value || void 0
          }, X(b.text), 11, Sc),
          ae(X(y < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), N(be, { key: 1 }, [
          ae(X(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, bc));
  }
}), Ri = /* @__PURE__ */ se(Cc, [["__scopeId", "data-v-a69afe32"]]), xc = {}, _c = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Ec(n, e) {
  return E(), N("svg", _c, [...e[0] || (e[0] = [
    cs('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const kc = /* @__PURE__ */ se(xc, [["render", Ec]]), Tc = { class: "transcription-empty" }, Pc = { class: "message" }, Ac = /* @__PURE__ */ $({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = Se();
    return (t, i) => (E(), N("div", Tc, [
      B(kc, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      W("p", Pc, X(p(e)("transcription.empty")), 1)
    ]));
  }
}), Ic = /* @__PURE__ */ se(Ac, [["__scopeId", "data-v-f82737e5"]]), Oc = { class: "transcription-panel" }, Rc = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Lc = { class: "turns-container" }, Mc = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Dc = {
  key: 1,
  class: "history-start"
}, $c = /* @__PURE__ */ $({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = Se(), i = et(), o = St("scrollContainer"), s = k(() => {
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
    }), r = k(() => i.live?.hasLiveUpdate.value ?? !1), a = k(() => i.audio?.isPlaying.value ?? !1), l = k(
      () => i.activeChannel.value.activeTranslation.value
    ), u = k(() => i.activeChannel.value), c = k(
      () => u.value.isLoadingHistory.value
    ), d = k(() => u.value.hasMoreHistory.value), { scrollRef: h, contentRef: f, isAtBottom: v, scrollToBottom: b } = br();
    oe(() => {
      h.value = o.value, f.value = o.value?.querySelector(".turns-container") ?? null;
    });
    const y = As(() => {
      const S = u.value;
      S.hasMoreHistory.value && (S.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function _() {
      const S = o.value;
      S && S.scrollTop < 100 && y();
    }
    return Z(
      () => e.turns,
      (S, m) => {
        const g = S.length, C = m.length;
        if (g > C && !v.value && S[0]?.id != m[0]?.id) {
          const x = g - C, w = e.turns[x]?.id;
          if (!w || !h.value) return;
          re(() => {
            h.value?.querySelector(
              `[data-turn-id="${w}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), oe(() => {
      o.value?.addEventListener("scroll", _, {
        passive: !0
      });
    }), pt(() => {
      o.value?.removeEventListener("scroll", _);
    }), (S, m) => (E(), N("article", Oc, [
      W("div", Rc, [
        W("div", Lc, [
          c.value ? (E(), N("div", Mc, [...m[3] || (m[3] = [
            W("progress", null, null, -1)
          ])])) : K("", !0),
          !d.value && n.turns.length > 0 ? (E(), N("div", Dc, X(p(t)("transcription.historyStart")), 1)) : K("", !0),
          n.turns.length === 0 && !c.value && !s.value ? (E(), M(Ic, {
            key: 2,
            class: "transcription-empty"
          })) : K("", !0),
          (E(!0), N(be, null, Qe(n.turns, (g, C, x, w) => {
            const A = [g, n.speakers.get(g.speakerId ?? ""), r.value && !s.value && C === n.turns.length - 1];
            if (w && w.key === g.id && ds(w, A)) return w;
            const P = (E(), M(Ri, {
              "data-turn-id": g.id,
              key: g.id,
              turn: g,
              speaker: g.speakerId ? n.speakers.get(g.speakerId) : void 0,
              live: r.value && !s.value && C === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return P.memo = A, P;
          }, m, 0), 128)),
          s.value ? (E(), M(Ri, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : K("", !0)
        ]),
        B(Xi, { name: "fade-slide" }, {
          default: O(() => [
            !p(v) && (a.value || r.value) ? (E(), M(ye, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": p(t)("transcription.resumeScroll"),
              onClick: m[2] || (m[2] = (g) => p(b)())
            }, {
              default: O(() => [
                ae(X(p(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : K("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Bc = /* @__PURE__ */ se($c, [["__scopeId", "data-v-49c5b0cc"]]), qc = { class: "switch" }, Fc = ["id", "checked"], zc = ["for"], Nc = /* @__PURE__ */ $({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, o = t.id ?? fs();
    return (s, r) => (E(), N("div", qc, [
      W("input", {
        type: "checkbox",
        id: p(o),
        checked: n.modelValue,
        onChange: r[0] || (r[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Fc),
      W("label", { for: p(o) }, [...r[1] || (r[1] = [
        W("div", { class: "switch-slider" }, null, -1)
      ])], 8, zc)
    ]));
  }
}), Wc = /* @__PURE__ */ se(Nc, [["__scopeId", "data-v-2aa0332f"]]), Vc = "(max-width: 767px)";
function Ho() {
  const n = I(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return oe(() => {
    e = window.matchMedia(Vc), n.value = e.matches, e.addEventListener("change", t);
  }), pt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const Hc = /* @__PURE__ */ $({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, i = I(), o = I([]);
    return oe(() => {
      const s = i.value?.closest(".speaker-sidebar");
      s && (o.value = [s]);
    }), (s, r) => (E(), N("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      B(p($u), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (a) => t("update:selectedValue", a))
      }, {
        default: O(() => [
          B(p(dc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: O(() => [
              B(p(pc), { class: "sidebar-select-trigger-label" }),
              B(p(ec), null, {
                default: O(() => [
                  B(p(Zi), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          B(p(uc), { disabled: "" }, {
            default: O(() => [
              B(p(Zu), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": o.value
              }, {
                default: O(() => [
                  B(p(vc), null, {
                    default: O(() => [
                      (E(!0), N(be, null, Qe(n.items, (a) => (E(), M(p(ic), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: O(() => [
                          B(p(sc), { class: "sidebar-select-item-indicator" }, {
                            default: O(() => [
                              B(p(Yt), { size: 14 })
                            ]),
                            _: 1
                          }),
                          B(p(ac), null, {
                            default: O(() => [
                              ae(X(a.label), 1)
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
}), jc = { class: "sidebar-select" }, Uc = ["aria-label"], Kc = { class: "sidebar-select-trigger-label" }, Xc = /* @__PURE__ */ $({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, o = I(!1), s = k(
      () => t.items.find((a) => a.value === t.selectedValue)?.label ?? ""
    );
    function r(a) {
      i("update:selectedValue", a), o.value = !1;
    }
    return (a, l) => (E(), N("div", jc, [
      W("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (u) => o.value = !0)
      }, [
        W("span", Kc, X(s.value), 1)
      ], 8, Uc),
      B(p(fo), {
        open: o.value,
        "onUpdate:open": l[2] || (l[2] = (u) => o.value = u)
      }, {
        default: O(() => [
          B(p(So), { disabled: "" }, {
            default: O(() => [
              B(p(bo), { class: "editor-overlay" }),
              B(p(yo), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: O(() => [
                  B(p(Co), { class: "sr-only" }, {
                    default: O(() => [
                      ae(X(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = W("div", { class: "sheet-handle" }, null, -1)),
                  B(p(wu), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (u) => r(u))
                  }, {
                    default: O(() => [
                      B(p(Cu), { class: "sheet-list" }, {
                        default: O(() => [
                          (E(!0), N(be, null, Qe(n.items, (u) => (E(), M(p(Tu), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: O(() => [
                              B(p(Au), { class: "sheet-item-indicator" }, {
                                default: O(() => [
                                  B(p(Yt), { size: 16 })
                                ]),
                                _: 1
                              }),
                              W("span", null, X(u.label), 1)
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
}), Zn = /* @__PURE__ */ $({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Ho();
    return (o, s) => p(i) ? (E(), M(Xc, Q({ key: 0 }, o.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (r) => t("update:selectedValue", r))
    }), null, 16)) : (E(), M(Hc, Q({ key: 1 }, o.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (r) => t("update:selectedValue", r))
    }), null, 16));
  }
}), jo = /* @__PURE__ */ $({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: o } = Se(), s = k(
      () => t.channels.map((r) => ({ value: r.id, label: r.name }))
    );
    return (r, a) => (E(), M(Zn, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: p(o)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Yc = { class: "speaker-sidebar" }, Gc = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Jc = { class: "sidebar-title" }, Zc = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Qc = { class: "sidebar-title" }, ed = {
  key: 2,
  class: "sidebar-section"
}, td = { class: "sidebar-title" }, nd = { class: "subtitle-toggle" }, id = { class: "subtitle-toggle-label" }, od = { class: "subtitle-slider" }, sd = { class: "subtitle-slider-label" }, rd = { class: "subtitle-slider-value" }, ad = ["value", "disabled"], ld = {
  key: 3,
  class: "sidebar-section"
}, ud = { class: "sidebar-title" }, cd = { class: "speaker-list" }, dd = { class: "speaker-name" }, fd = /* @__PURE__ */ $({
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
    const e = n, t = et(), { t: i, locale: o } = Se(), s = k(
      () => Yi(e.translations, o.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (r, a) => (E(), N("aside", Yc, [
      n.channels.length > 1 ? (E(), N("section", Gc, [
        W("h2", Jc, X(p(i)("sidebar.channel")), 1),
        B(jo, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => r.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (E(), N("section", Zc, [
        W("h2", Qc, X(p(i)("sidebar.translation")), 1),
        B(Zn, {
          items: s.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => r.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      p(t).subtitle ? (E(), N("section", ed, [
        W("h2", td, X(p(i)("sidebar.subtitle")), 1),
        W("div", nd, [
          W("span", id, X(p(i)("subtitle.show")), 1),
          B(Wc, {
            modelValue: p(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => p(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        W("label", od, [
          W("span", sd, [
            ae(X(p(i)("subtitle.fontSize")) + " ", 1),
            W("span", rd, X(p(t).subtitle.fontSize.value) + "px", 1)
          ]),
          W("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: p(t).subtitle.fontSize.value,
            disabled: !p(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => p(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, ad)
        ])
      ])) : K("", !0),
      n.speakers.length ? (E(), N("section", ld, [
        W("h2", ud, X(p(i)("sidebar.speakers")), 1),
        W("ul", cd, [
          (E(!0), N(be, null, Qe(n.speakers, (l) => (E(), N("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            B(no, {
              color: l.color
            }, null, 8, ["color"]),
            W("span", dd, X(l.name), 1)
          ]))), 128))
        ])
      ])) : K("", !0)
    ]));
  }
}), Li = /* @__PURE__ */ se(fd, [["__scopeId", "data-v-0a4624c1"]]), pd = /* @__PURE__ */ $({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = ps(n, "open"), { t } = Se();
    return (i, o) => (E(), M(p(fo), {
      open: e.value,
      "onUpdate:open": o[0] || (o[0] = (s) => e.value = s)
    }, {
      default: O(() => [
        B(p(So), { disabled: "" }, {
          default: O(() => [
            B(p(bo), { class: "editor-overlay" }),
            B(p(yo), { class: "sidebar-drawer" }, {
              default: O(() => [
                B(p(Co), { class: "sr-only" }, {
                  default: O(() => [
                    ae(X(p(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                B(p(da), {
                  class: "sidebar-close",
                  "aria-label": p(t)("header.closeSidebar")
                }, {
                  default: O(() => [
                    B(p(zn), { size: 20 })
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
}), hd = { class: "player-controls" }, vd = { class: "controls-left" }, md = { class: "controls-time" }, gd = { class: "time-display" }, yd = { class: "time-display" }, bd = { class: "controls-right" }, wd = ["value", "aria-label", "disabled"], Sd = /* @__PURE__ */ $({
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
    const t = e, { t: i } = Se(), o = I(!1);
    function s(r) {
      const a = r.target;
      t("update:volume", parseFloat(a.value));
    }
    return (r, a) => (E(), N("div", hd, [
      W("div", vd, [
        B(ye, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": p(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        B(ye, {
          variant: "transparent",
          icon: n.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": n.isPlaying ? p(i)("player.pause") : p(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        B(ye, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": p(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      W("div", md, [
        W("time", gd, X(n.currentTime), 1),
        a[7] || (a[7] = W("span", { class: "time-separator" }, "/", -1)),
        W("time", yd, X(n.duration), 1)
      ]),
      W("div", bd, [
        W("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => o.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => o.value = !1)
        }, [
          B(ye, {
            variant: "transparent",
            icon: n.isMuted ? "volume-mute" : "volume",
            "aria-label": n.isMuted ? p(i)("player.unmute") : p(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          hs(W("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": p(i)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, wd), [
            [vs, o.value]
          ])
        ], 32),
        B(ye, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": p(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: O(() => [
            ae(X(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), Cd = /* @__PURE__ */ se(Sd, [["__scopeId", "data-v-2dcb93b1"]]);
function ue(n, e, t, i) {
  return new (t || (t = Promise))((function(o, s) {
    function r(u) {
      try {
        l(i.next(u));
      } catch (c) {
        s(c);
      }
    }
    function a(u) {
      try {
        l(i.throw(u));
      } catch (c) {
        s(c);
      }
    }
    function l(u) {
      var c;
      u.done ? o(u.value) : (c = u.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(r, a);
    }
    l((i = i.apply(n, e || [])).next());
  }));
}
let It = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const o = (...s) => {
        this.un(e, o), t(...s);
      };
      return this.listeners[e].add(o), () => this.un(e, o);
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
const Dt = { decode: function(n, e) {
  return ue(this, void 0, void 0, (function* () {
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
    const o = i[0];
    if (o.some(((s) => s > 1 || s < -1))) {
      const s = o.length;
      let r = 0;
      for (let a = 0; a < s; a++) {
        const l = Math.abs(o[a]);
        l > r && (r = l);
      }
      for (const a of i) for (let l = 0; l < s; l++) a[l] /= r;
    }
  })(n);
  const t = n.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (i) => {
    const o = t[i];
    if (!o) throw new Error(`Channel ${i} not found`);
    return o;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Uo(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, o] of Object.entries(e)) if (i === "children" && o) for (const [s, r] of Object.entries(o)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Uo(s, r));
  else i === "style" ? Object.assign(t.style, o) : i === "textContent" ? t.textContent = o : t.setAttribute(i, o.toString());
  return t;
}
function Mi(n, e, t) {
  const i = Uo(n, e || {});
  return t?.appendChild(i), i;
}
var xd = Object.freeze({ __proto__: null, createElement: Mi, default: Mi });
const _d = { fetchBlob: function(n, e, t) {
  return ue(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(o, s) {
      ue(this, void 0, void 0, (function* () {
        if (!o.body || !o.headers) return;
        const r = o.body.getReader(), a = Number(o.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          s(d);
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
function ie(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((o) => o(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Ke(n, e) {
  const t = ie(n());
  return e.forEach(((i) => i.subscribe((() => {
    const o = n();
    Object.is(t.value, o) || t.set(o);
  })))), { get value() {
    return t.value;
  }, subscribe: (i) => t.subscribe(i) };
}
function ze(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, o = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), o.forEach(((s) => s()));
  };
}
class Ed extends It {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = ie(!1), this._currentTime = ie(0), this._duration = ie(0), this._volume = ie(this.media.volume), this._muted = ie(this.media.muted), this._playbackRate = ie(this.media.playbackRate || 1), this._seeking = ie(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    const o = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (i && this.media.removeAttribute("src"), o || e) try {
      this.media.src = o;
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
    return ue(this, void 0, void 0, (function* () {
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
function kd({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: o = 0, barAlign: s }) {
  let r = Math.round(n * t * i), a = r + Math.round(e * t * i) || 1;
  return a < o && (a = o, s || (r = a / 2)), { topHeight: r, totalHeight: a };
}
function Td({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: o }) {
  return n === "top" ? 0 : n === "bottom" ? o - i : e - t;
}
function Di(n, e, t) {
  const i = e - n.left, o = t - n.top;
  return [i / n.width, o / n.height];
}
function Ko(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function $i(n, e) {
  if (!Ko(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Bi({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, o = Math.floor(i * t);
  return [o - 1, o, o + 1];
}
function Xo(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Pd(n) {
  const e = ie({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ke((() => (function(s) {
    const { scrollLeft: r, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = r / a, c = (r + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Ke((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), o = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", o, { passive: !0 }), { scrollData: e, percentages: t, bounds: i, cleanup: () => {
    n.removeEventListener("scroll", o), Xo(e);
  } };
}
class Ad extends It {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [o, s] = this.initHtml();
    i.appendChild(o), this.container = o, this.scrollContainer = s.querySelector(".scroll"), this.wrapper = s.querySelector(".wrapper"), this.canvasWrapper = s.querySelector(".canvases"), this.progressWrapper = s.querySelector(".progress"), this.cursor = s.querySelector(".cursor"), t && s.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [o, s] = Di(i, t.clientX, t.clientY);
      this.emit("click", o, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [o, s] = Di(i, t.clientX, t.clientY);
      this.emit("dblclick", o, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = Pd(this.scrollContainer);
    const e = ze((() => {
      const { startX: t, endX: i } = this.scrollStream.percentages.value, { left: o, right: s } = this.scrollStream.bounds.value;
      this.emit("scroll", t, i, o, s);
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
      const { threshold: o = 3, mouseButton: s = 0, touchDelay: r = 100 } = i, a = ie(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (h) => {
        if (h.button !== s || (l.set(h.pointerId, h), l.size > 1)) return;
        let f = h.clientX, v = h.clientY, b = !1;
        const y = Date.now(), _ = t.getBoundingClientRect(), { left: S, top: m } = _, g = (P) => {
          if (P.defaultPrevented || l.size > 1 || u && Date.now() - y < r) return;
          const T = P.clientX, L = P.clientY, D = T - f, z = L - v;
          (b || Math.abs(D) > o || Math.abs(z) > o) && (P.preventDefault(), P.stopPropagation(), b || (a.set({ type: "start", x: f - S, y: v - m }), b = !0), a.set({ type: "move", x: T - S, y: L - m, deltaX: D, deltaY: z }), f = T, v = L);
        }, C = (P) => {
          if (l.delete(P.pointerId), b) {
            const T = P.clientX, L = P.clientY;
            a.set({ type: "end", x: T - S, y: L - m });
          }
          c();
        }, x = (P) => {
          l.delete(P.pointerId), P.relatedTarget && P.relatedTarget !== document.documentElement || C(P);
        }, w = (P) => {
          b && (P.stopPropagation(), P.preventDefault());
        }, A = (P) => {
          P.defaultPrevented || l.size > 1 || b && P.preventDefault();
        };
        document.addEventListener("pointermove", g), document.addEventListener("pointerup", C), document.addEventListener("pointerout", x), document.addEventListener("pointercancel", x), document.addEventListener("touchmove", A, { passive: !1 }), document.addEventListener("click", w, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", g), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", x), document.removeEventListener("pointercancel", x), document.removeEventListener("touchmove", A), setTimeout((() => {
            document.removeEventListener("click", w, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), Xo(a);
      } };
    })(this.wrapper);
    const e = ze((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const i = this.wrapper.getBoundingClientRect().width, o = (s = t.x / i) < 0 ? 0 : s > 1 ? 1 : s;
      var s;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", o)) : t.type === "move" ? this.emit("drag", o) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", o));
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
    const o = () => {
      t && (clearTimeout(t), t = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(o), () => new Promise(((s, r) => {
      o(), i = r, t = setTimeout((() => {
        t = void 0, i = void 0, s();
      }), e);
    }));
  }
  getHeight(e, t) {
    var i;
    const o = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: s, optionsSplitChannels: r, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (s == null) return u;
      const c = Number(s);
      if (!isNaN(c)) return c;
      if (s === "auto") {
        const d = a || u;
        return r?.every(((h) => !h.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: o, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(i, o, s) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const r = document.createElement("canvas"), a = r.getContext("2d"), l = s ?? r.height * o, u = a.createLinearGradient(0, 0, 0, l || o), c = 1 / (i.length - 1);
      return i.forEach(((d, h) => {
        u.addColorStop(h * c, d);
      })), u;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, i, o) {
    const { width: s, height: r } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: h } = (function({ width: v, height: b, length: y, options: _, pixelRatio: S }) {
      const m = b / 2, g = _.barWidth ? _.barWidth * S : 1, C = _.barGap ? _.barGap * S : _.barWidth ? g / 2 : 0, x = g + C || 1;
      return { halfHeight: m, barWidth: g, barGap: C, barRadius: _.barRadius || 0, barMinHeight: _.barMinHeight ? _.barMinHeight * S : 0, barIndexScale: y > 0 ? v / x / y : 0, barSpacing: x };
    })({ width: s, height: r, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: v, barIndexScale: b, barSpacing: y, barWidth: _, halfHeight: S, vScale: m, canvasHeight: g, barAlign: C, barMinHeight: x }) {
      const w = v[0] || [], A = v[1] || w, P = w.length, T = [];
      let L = 0, D = 0, z = 0;
      for (let R = 0; R <= P; R++) {
        const q = Math.round(R * b);
        if (q > L) {
          const { topHeight: G, totalHeight: te } = kd({ maxTop: D, maxBottom: z, halfHeight: S, vScale: m, barMinHeight: x, barAlign: C }), de = Td({ barAlign: C, halfHeight: S, topHeight: G, totalHeight: te, canvasHeight: g });
          T.push({ x: L * y, y: de, width: _, height: te }), L = q, D = 0, z = 0;
        }
        const Y = Math.abs(w[R] || 0), j = Math.abs(A[R] || 0);
        Y > D && (D = Y), j > z && (z = j);
      }
      return T;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: o, canvasHeight: r, barAlign: t.barAlign, barMinHeight: h });
    i.beginPath();
    for (const v of f) u && "roundRect" in i ? i.roundRect(v.x, v.y, v.width, v.height, u) : i.rect(v.x, v.y, v.width, v.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, o) {
    const { width: s, height: r } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const h = c / 2, f = l[0] || [];
      return [f, l[1] || f].map(((v, b) => {
        const y = v.length, _ = y ? u / y : 0, S = h, m = b === 0 ? -1 : 1, g = [{ x: 0, y: S }];
        let C = 0, x = 0;
        for (let w = 0; w <= y; w++) {
          const A = Math.round(w * _);
          if (A > C) {
            const T = S + (Math.round(x * h * d) || 1) * m;
            g.push({ x: C, y: T }), C = A, x = 0;
          }
          const P = Math.abs(v[w] || 0);
          P > x && (x = P);
        }
        return g.push({ x: C, y: S }), g;
      }));
    })({ channelData: e, width: s, height: r, vScale: o });
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
    const o = (function({ channelData: s, barHeight: r, normalize: a, maxPeak: l }) {
      var u;
      const c = r || 1;
      if (!a) return c;
      const d = s[0];
      if (!d || d.length === 0) return c;
      let h = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const v = (u = d[f]) !== null && u !== void 0 ? u : 0, b = Math.abs(v);
        b > h && (h = b);
      }
      return h ? c / h : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Ko(t) ? this.renderBarWaveform(e, t, i, o) : this.renderLineWaveform(e, t, i, o);
  }
  renderSingleCanvas(e, t, i, o, s, r, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(o * l), u.style.width = `${i}px`, u.style.height = `${o}px`, u.style.left = `${Math.round(s)}px`, r.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), h = d.getContext("2d");
      h.drawImage(u, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(t.progressColor, h), h.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, o, s, r) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: v, totalWidth: b, options: y }) {
      return $i(Math.min(8e3, v, b), y);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const h = (v) => {
      if (v < 0 || v >= f || d[v]) return;
      d[v] = !0;
      const b = v * c;
      let y = Math.min(u - b, c);
      if (y = $i(y, t), y <= 0) return;
      const _ = (function({ channelData: S, offset: m, clampedWidth: g, totalWidth: C }) {
        return S.map(((x) => {
          const w = Math.floor(m / C * x.length), A = Math.floor((m + g) / C * x.length);
          return x.slice(w, A);
        }));
      })({ channelData: e, offset: b, clampedWidth: y, totalWidth: u });
      this.renderSingleCanvas(_, t, y, o, b, s, r);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let v = 0; v < f; v++) h(v);
      return;
    }
    if (Bi({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((v) => h(v))), f > 1) {
      const v = this.on("scroll", (() => {
        const { scrollLeft: b } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", r.innerHTML = "", d = {}), Bi({ scrollLeft: b, totalWidth: u, numCanvases: f }).forEach(((y) => h(y)));
      }));
      this.unsubscribeOnScroll.push(v);
    }
  }
  renderChannel(e, t, i, o) {
    var { overlay: s } = t, r = (function(c, d) {
      var h = {};
      for (var f in c) Object.prototype.hasOwnProperty.call(c, f) && d.indexOf(f) < 0 && (h[f] = c[f]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var v = 0;
        for (f = Object.getOwnPropertySymbols(c); v < f.length; v++) d.indexOf(f[v]) < 0 && Object.prototype.propertyIsEnumerable.call(c, f[v]) && (h[f[v]] = c[f[v]]);
      }
      return h;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(r.height, r.splitChannels);
    a.style.height = `${l}px`, s && o > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, r, i, l, a, u);
  }
  render(e) {
    return ue(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), o = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: r, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: h, pixelRatio: f }) {
        const v = Math.ceil(u * c), b = v > d, y = !!(h && !b);
        return { scrollWidth: v, isScrollable: b, useParentWidth: y, width: (y ? d : v) * f };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: o, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = r, this.wrapper.style.width = a ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
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
      const { right: i } = this.progressWrapper.getBoundingClientRect(), o = (function(s) {
        const r = 2 * s;
        return (r < 0 ? Math.floor(r) : Math.ceil(r)) / 2;
      })(i - t);
      this.scrollContainer.scrollLeft += o;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: i, scrollWidth: o, clientWidth: s } = this.scrollContainer, r = e * o, a = i, l = i + s, u = s / 2;
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
    return ue(this, void 0, void 0, (function* () {
      const o = this.canvasWrapper.querySelectorAll("canvas");
      if (!o.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const s = Array.from(o).map(((r) => r.toDataURL(e, t)));
        return Promise.resolve(s);
      }
      return Promise.all(Array.from(o).map(((s) => new Promise(((r, a) => {
        s.toBlob(((l) => {
          l ? r(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class Id extends It {
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
class Sn extends It {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return ue(this, void 0, void 0, (function* () {
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
    return ue(this, void 0, void 0, (function* () {
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
    return ue(this, void 0, void 0, (function* () {
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
const Od = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class kt extends Ed {
  static create(e) {
    return new kt(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new Sn() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Od, e);
    const { state: i, actions: o } = (function(a) {
      var l, u, c, d, h, f;
      const v = (l = a?.currentTime) !== null && l !== void 0 ? l : ie(0), b = (u = a?.duration) !== null && u !== void 0 ? u : ie(0), y = (c = a?.isPlaying) !== null && c !== void 0 ? c : ie(!1), _ = (d = a?.isSeeking) !== null && d !== void 0 ? d : ie(!1), S = (h = a?.volume) !== null && h !== void 0 ? h : ie(1), m = (f = a?.playbackRate) !== null && f !== void 0 ? f : ie(1), g = ie(null), C = ie(null), x = ie(""), w = ie(0), A = ie(0), P = Ke((() => !y.value), [y]), T = Ke((() => g.value !== null), [g]), L = Ke((() => T.value && b.value > 0), [T, b]), D = Ke((() => v.value), [v]), z = Ke((() => b.value > 0 ? v.value / b.value : 0), [v, b]);
      return { state: { currentTime: v, duration: b, isPlaying: y, isPaused: P, isSeeking: _, volume: S, playbackRate: m, audioBuffer: g, peaks: C, url: x, zoom: w, scrollPosition: A, canPlay: T, isReady: L, progress: D, progressPercent: z }, actions: { setCurrentTime: (R) => {
        const q = Math.max(0, Math.min(b.value || 1 / 0, R));
        v.set(q);
      }, setDuration: (R) => {
        b.set(Math.max(0, R));
      }, setPlaying: (R) => {
        y.set(R);
      }, setSeeking: (R) => {
        _.set(R);
      }, setVolume: (R) => {
        const q = Math.max(0, Math.min(1, R));
        S.set(q);
      }, setPlaybackRate: (R) => {
        const q = Math.max(0.1, Math.min(16, R));
        m.set(q);
      }, setAudioBuffer: (R) => {
        g.set(R), R && b.set(R.duration);
      }, setPeaks: (R) => {
        C.set(R);
      }, setUrl: (R) => {
        x.set(R);
      }, setZoom: (R) => {
        w.set(Math.max(0, R));
      }, setScrollPosition: (R) => {
        A.set(Math.max(0, R));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = o, this.timer = new Id();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new Ad(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      i.push(ze((() => {
        const r = e.isPlaying.value;
        t.emit(r ? "play" : "pause");
      }), [e.isPlaying])), i.push(ze((() => {
        const r = e.currentTime.value;
        t.emit("timeupdate", r), e.isPlaying.value && t.emit("audioprocess", r);
      }), [e.currentTime, e.isPlaying])), i.push(ze((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let o = !1;
      i.push(ze((() => {
        e.isReady.value && !o && (o = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return i.push(ze((() => {
        const r = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        s && !r && u && t.emit("finish"), s = r && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(ze((() => {
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
    })), this.renderer.on("scroll", ((e, t, i, o) => {
      const s = this.getDuration();
      this.emit("scroll", e * s, t * s, i, o);
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
        var o;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let s = 0;
        const r = this.options.dragToSeek;
        this.isPlaying() ? s = 0 : r === !0 ? s = 200 : r && typeof r == "object" && (s = (o = r.debounceTime) !== null && o !== void 0 ? o : 200), e = setTimeout((() => {
          this.seekTo(i);
        }), s), this.emit("interaction", i * this.getDuration()), this.emit("drag", i);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Dt.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Dt.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
  loadAudio(e, t, i, o) {
    return ue(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield _d.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (t = new Blob([t], { type: u }));
      }
      this.setSrc(e, t);
      const r = yield new Promise(((a) => {
        const l = o || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof Sn && (a.duration = r);
      }
      if (i) this.decodedData = Dt.createBuffer(i, r || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Dt.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, i) {
    return ue(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, i);
      } catch (o) {
        throw this.emit("error", o), o;
      }
    }));
  }
  loadBlob(e, t, i) {
    return ue(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, i);
      } catch (o) {
        throw this.emit("error", o), o;
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
    const o = Math.min(e, this.decodedData.numberOfChannels), s = [];
    for (let r = 0; r < o; r++) {
      const a = this.decodedData.getChannelData(r), l = [], u = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let h = 0;
        for (let f = 0; f < d.length; f++) {
          const v = d[f];
          Math.abs(v) > Math.abs(h) && (h = v);
        }
        l.push(Math.round(h * i) / i);
      }
      s.push(l);
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
    const i = Object.create(null, { play: { get: () => super.play } });
    return ue(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const o = yield i.play.call(this);
      return t != null && (this.media instanceof Sn ? this.media.stopAt(t) : this.stopAtPosition = t), o;
    }));
  }
  playPause() {
    return ue(this, void 0, void 0, (function* () {
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
    return ue(this, arguments, void 0, (function* (e = "image/png", t = 1, i = "dataURL") {
      return this.renderer.exportImage(e, t, i);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
kt.BasePlugin = class extends It {
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
}, kt.dom = xd;
class Yo {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const o = (...s) => {
        this.un(e, o), t(...s);
      };
      return this.listeners[e].add(o), () => this.un(e, o);
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
class Rd extends Yo {
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
function Go(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, o] of Object.entries(e)) if (i === "children" && o) for (const [s, r] of Object.entries(o)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Go(s, r));
  else i === "style" ? Object.assign(t.style, o) : i === "textContent" ? t.textContent = o : t.setAttribute(i, o.toString());
  return t;
}
function bt(n, e, t) {
  const i = Go(n, e || {});
  return t?.appendChild(i), i;
}
function Jo(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((o) => o(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Ft(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, o = e.map(((s) => s.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), o.forEach(((s) => s()));
  };
}
function rt(n, e) {
  const t = Jo(null), i = (o) => {
    t.set(o);
  };
  return n.addEventListener(e, i), t._cleanup = () => {
    n.removeEventListener(e, i);
  }, t;
}
function Ue(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function zt(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: o = 100 } = e, s = Jo(null), r = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (r.set(c.pointerId, c), r.size > 1)) return;
    let d = c.clientX, h = c.clientY, f = !1;
    const v = Date.now(), b = n.getBoundingClientRect(), { left: y, top: _ } = b, S = (w) => {
      if (w.defaultPrevented || r.size > 1 || a && Date.now() - v < o) return;
      const A = w.clientX, P = w.clientY, T = A - d, L = P - h;
      (f || Math.abs(T) > t || Math.abs(L) > t) && (w.preventDefault(), w.stopPropagation(), f || (s.set({ type: "start", x: d - y, y: h - _ }), f = !0), s.set({ type: "move", x: A - y, y: P - _, deltaX: T, deltaY: L }), d = A, h = P);
    }, m = (w) => {
      if (r.delete(w.pointerId), f) {
        const A = w.clientX, P = w.clientY;
        s.set({ type: "end", x: A - y, y: P - _ });
      }
      l();
    }, g = (w) => {
      r.delete(w.pointerId), w.relatedTarget && w.relatedTarget !== document.documentElement || m(w);
    }, C = (w) => {
      f && (w.stopPropagation(), w.preventDefault());
    }, x = (w) => {
      w.defaultPrevented || r.size > 1 || f && w.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", m), document.addEventListener("pointerout", g), document.addEventListener("pointercancel", g), document.addEventListener("touchmove", x, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", m), document.removeEventListener("pointerout", g), document.removeEventListener("pointercancel", g), document.removeEventListener("touchmove", x), setTimeout((() => {
        document.removeEventListener("click", C, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), r.clear(), Ue(s);
  } };
}
class qi extends Yo {
  constructor(e, t, i = 0) {
    var o, s, r, a, l, u, c, d, h, f;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((o = e.end) !== null && o !== void 0 ? o : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (r = e.resize) === null || r === void 0 || r, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = bt("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), o = bt("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = zt(i, { threshold: 1 }), r = zt(o, { threshold: 1 }), a = Ft((() => {
      const u = s.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Ft((() => {
      const u = r.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [r.signal]);
    this.subscriptions.push((() => {
      a(), l(), s.cleanup(), r.cleanup();
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
    const o = bt("div", { style: { position: "absolute", top: `${t}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(o), o;
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
    const t = rt(e, "click"), i = rt(e, "mouseenter"), o = rt(e, "mouseleave"), s = rt(e, "dblclick"), r = rt(e, "pointerdown"), a = rt(e, "pointerup"), l = t.subscribe(((y) => y && this.emit("click", y))), u = i.subscribe(((y) => y && this.emit("over", y))), c = o.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), h = r.subscribe(((y) => y && this.toggleCursor(!0))), f = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), h(), f(), Ue(t), Ue(i), Ue(o), Ue(s), Ue(r), Ue(a);
    }));
    const v = zt(e), b = Ft((() => {
      const y = v.signal.value;
      y && (y.type === "start" ? this.toggleCursor(!0) : y.type === "move" && y.deltaX !== void 0 ? this.onMove(y.deltaX) : y.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [v.signal]);
    this.subscriptions.push((() => {
      b(), v.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (y) => this.onContentClick(y), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, i) {
    var o;
    if (!(!((o = this.element) === null || o === void 0) && o.parentElement)) return;
    const { width: s } = this.element.parentElement.getBoundingClientRect(), r = e / s * this.totalDuration;
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
        this.content = bt("div", { style: { padding: `0.2em ${i ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (i) => this.onContentClick(i), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var t, i;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const o = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : o ? this.start : this.end), this.renderPosition(), this.setPart();
      }
      if (e.content && this.setContent(e.content), e.id && (this.id = e.id, this.setPart()), e.resize !== void 0 && e.resize !== this.resize) {
        const o = this.start === this.end;
        this.resize = e.resize, this.resize && !o ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      e.resizeStart !== void 0 && (this.resizeStart = e.resizeStart), e.resizeEnd !== void 0 && (this.resizeEnd = e.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = !0, this.emit("remove"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class Qn extends Rd {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Qn(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((i) => i._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const i = this.regions.filter(((o) => o.start <= t && (o.end === o.start ? o.start + 0.05 : o.end) >= t));
      i.forEach(((o) => {
        e.includes(o) || this.emit("region-in", o);
      })), e.forEach(((o) => {
        i.includes(o) || this.emit("region-out", o);
      })), e = i;
    })));
  }
  initRegionsContainer() {
    return bt("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, i = t.getBoundingClientRect(), o = this.regions.map(((s) => {
        if (s === e || !s.content) return 0;
        const r = s.content.getBoundingClientRect();
        return i.left < r.left + r.width && r.left < i.left + i.width ? r.height : 0;
      })).reduce(((s, r) => s + r), 0);
      t.style.marginTop = `${o}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, i;
    if (!e.element) return;
    const o = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!o) return;
    const { clientWidth: s, scrollWidth: r } = o;
    if (r <= s) return;
    const a = o.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? o.scrollLeft += u : c > s && (o.scrollLeft += c - s);
  }
  virtualAppend(e, t, i) {
    const o = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), r = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > r && u < r + s;
      c && !i.parentElement ? t.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      o();
      const s = this.wavesurfer.on("scroll", o), r = this.wavesurfer.on("zoom", o), a = this.wavesurfer.on("resize", o);
      this.subscriptions.push(s, r, a), e.once("remove", (() => {
        s(), r(), a();
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
      var o;
      (o = this.wavesurfer) === null || o === void 0 || o.play(e.start, i);
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
    const o = this.wavesurfer.getDuration(), s = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, r = new qi(e, o, s);
    return this.emit("region-initialized", r), o ? this.saveRegion(r) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      r._setTotalDuration(a), this.saveRegion(r);
    }))), r;
  }
  enableDragSelection(e, t = 3) {
    var i;
    const o = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(o && o instanceof HTMLElement)) return () => {
    };
    let s = null, r = 0, a = 0;
    const l = zt(o, { threshold: t }), u = Ft((() => {
      var c, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (r = h.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), v = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: b } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = r / b * f;
        const y = h.x / b * f, _ = (h.x + 5) / b * f;
        s = new qi(Object.assign(Object.assign({}, e), { start: y, end: _ }), f, v), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else h.type === "move" && h.deltaX !== void 0 ? s && s._onUpdate(h.deltaX, h.x > r ? "end" : "start", a) : h.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
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
function Ld(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: o } = n, s = Xe(null), r = Xe(null), a = I(0), l = I(0), u = I(!1), c = I(!1), d = I(!1), h = I(1), f = I(1), v = I(!1), b = k(() => Ct(a.value)), y = k(() => Ct(l.value));
  function _(R, q) {
    D(), d.value = !0, c.value = !1;
    const Y = Qn.create();
    r.value = Y;
    const j = kt.create({
      container: R,
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
      renderFunction: Os,
      url: q,
      plugins: [Y]
    });
    j.on("ready", () => {
      c.value = !0, d.value = !1, l.value = j.getDuration(), S();
    }), j.on("timeupdate", (G) => {
      a.value = G;
    }), j.on("play", () => {
      u.value = !0;
    }), j.on("pause", () => {
      u.value = !1;
    }), j.on("finish", () => {
      u.value = !1;
    }), s.value = j;
  }
  function S() {
    const R = r.value;
    if (R) {
      R.clearRegions();
      for (const q of i.value) {
        const Y = q.speakerId ? o.value.get(q.speakerId) : void 0;
        if (!Y || q.startTime == null || q.endTime == null) continue;
        const j = Y.color;
        R.addRegion({
          start: q.startTime,
          end: q.endTime,
          color: Ps(j, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", j);
      }
    }
  }
  function m() {
    s.value?.play();
  }
  function g() {
    s.value?.pause();
  }
  function C() {
    s.value?.playPause();
  }
  function x(R) {
    const q = s.value;
    !q || l.value === 0 || q.setTime(R);
  }
  function w(R) {
    x(Math.max(0, Math.min(a.value + R, l.value)));
  }
  function A(R) {
    const q = s.value;
    q && (h.value = R, q.setVolume(R), R > 0 && v.value && (v.value = !1, q.setMuted(!1)));
  }
  function P() {
    const R = s.value;
    R && (v.value = !v.value, R.setMuted(v.value));
  }
  function T(R) {
    const q = s.value;
    q && (f.value = R, q.setPlaybackRate(R));
  }
  function L() {
    const q = (Cn.indexOf(
      f.value
    ) + 1) % Cn.length;
    T(Cn[q] ?? 1);
  }
  function D() {
    z !== null && (clearTimeout(z), z = null), s.value && (s.value.destroy(), s.value = null, r.value = null);
  }
  Z(
    [e, t],
    ([R, q]) => {
      R && q && _(R, q);
    },
    { immediate: !0 }
  );
  let z = null;
  return Z([i, o], () => {
    c.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, S();
    }, 150));
  }), pt(() => {
    D();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: h,
    playbackRate: f,
    isMuted: v,
    formattedCurrentTime: b,
    formattedDuration: y,
    play: m,
    pause: g,
    togglePlay: C,
    seekTo: x,
    skip: w,
    setVolume: A,
    setPlaybackRate: T,
    cyclePlaybackRate: L,
    toggleMute: P
  };
}
const Md = { class: "audio-player" }, Dd = /* @__PURE__ */ $({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, o = t, s = I(null), {
      isPlaying: r,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: f,
      formattedDuration: v,
      togglePlay: b,
      seekTo: y,
      pause: _,
      skip: S,
      setVolume: m,
      cyclePlaybackRate: g,
      toggleMute: C
    } = Ld({
      containerRef: s,
      audioSrc: $t(() => i.audioSrc),
      turns: $t(() => i.turns),
      speakers: $t(() => i.speakers)
    });
    return Z(h, (x) => o("timeupdate", x)), Z(r, (x) => o("playStateChange", x)), e({ seekTo: y, pause: _ }), (x, w) => (E(), N("footer", Md, [
      W("div", {
        ref_key: "waveformRef",
        ref: s,
        class: ut(["waveform-container", { "waveform-container--loading": p(l) }])
      }, null, 2),
      B(Cd, {
        "is-playing": p(r),
        "current-time": p(f),
        duration: p(v),
        volume: p(u),
        "playback-rate": p(c),
        "is-muted": p(d),
        "is-ready": p(a),
        onTogglePlay: p(b),
        onSkipBack: w[0] || (w[0] = (A) => p(S)(-10)),
        onSkipForward: w[1] || (w[1] = (A) => p(S)(10)),
        "onUpdate:volume": p(m),
        onToggleMute: p(C),
        onCyclePlaybackRate: p(g)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), $d = /* @__PURE__ */ se(Dd, [["__scopeId", "data-v-9248e45e"]]);
class Bd {
  diff(e, t, i = {}) {
    let o;
    typeof i == "function" ? (o = i, i = {}) : "callback" in i && (o = i.callback);
    const s = this.castInput(e, i), r = this.castInput(t, i), a = this.removeEmpty(this.tokenize(s, i)), l = this.removeEmpty(this.tokenize(r, i));
    return this.diffWithOptionsObj(a, l, i, o);
  }
  diffWithOptionsObj(e, t, i, o) {
    var s;
    const r = (S) => {
      if (S = this.postProcess(S, i), o) {
        setTimeout(function() {
          o(S);
        }, 0);
        return;
      } else
        return S;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (s = i.timeout) !== null && s !== void 0 ? s : 1 / 0, h = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let v = this.extractCommon(f[0], t, e, 0, i);
    if (f[0].oldPos + 1 >= l && v + 1 >= a)
      return r(this.buildValues(f[0].lastComponent, t, e));
    let b = -1 / 0, y = 1 / 0;
    const _ = () => {
      for (let S = Math.max(b, -u); S <= Math.min(y, u); S += 2) {
        let m;
        const g = f[S - 1], C = f[S + 1];
        g && (f[S - 1] = void 0);
        let x = !1;
        if (C) {
          const A = C.oldPos - S;
          x = C && 0 <= A && A < a;
        }
        const w = g && g.oldPos + 1 < l;
        if (!x && !w) {
          f[S] = void 0;
          continue;
        }
        if (!w || x && g.oldPos < C.oldPos ? m = this.addToPath(C, !0, !1, 0, i) : m = this.addToPath(g, !1, !0, 1, i), v = this.extractCommon(m, t, e, S, i), m.oldPos + 1 >= l && v + 1 >= a)
          return r(this.buildValues(m.lastComponent, t, e)) || !0;
        f[S] = m, m.oldPos + 1 >= l && (y = Math.min(y, S - 1)), v + 1 >= a && (b = Math.max(b, S + 1));
      }
      u++;
    };
    if (o)
      (function S() {
        setTimeout(function() {
          if (u > c || Date.now() > h)
            return o(void 0);
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
  addToPath(e, t, i, o, s) {
    const r = e.lastComponent;
    return r && !s.oneChangePerToken && r.added === t && r.removed === i ? {
      oldPos: e.oldPos + o,
      lastComponent: { count: r.count + 1, added: t, removed: i, previousComponent: r.previousComponent }
    } : {
      oldPos: e.oldPos + o,
      lastComponent: { count: 1, added: t, removed: i, previousComponent: r }
    };
  }
  extractCommon(e, t, i, o, s) {
    const r = t.length, a = i.length;
    let l = e.oldPos, u = l - o, c = 0;
    for (; u + 1 < r && l + 1 < a && this.equals(i[l + 1], t[u + 1], s); )
      u++, l++, c++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !s.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, u;
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
    const o = [];
    let s;
    for (; e; )
      o.push(e), s = e.previousComponent, delete e.previousComponent, e = s;
    o.reverse();
    const r = o.length;
    let a = 0, l = 0, u = 0;
    for (; a < r; a++) {
      const c = o[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(l, l + c.count);
          d = d.map(function(h, f) {
            const v = i[u + f];
            return v.length > h.length ? v : h;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return o;
  }
}
class qd extends Bd {
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
const Fd = new qd();
function zd(n, e, t) {
  return Fd.diff(n, e, t);
}
function xn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const o = n.split(" "), s = t.split(" "), r = zd(o, s, {
    comparator: Wd
  }), a = Nd(r), l = [...e];
  let u = [...e], c = 0;
  for (const f of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      u = Nt(
        u,
        l[0],
        f.countAdded - f.countRemoved
      ), c += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const v = f;
      c += v.count, u = Nt(
        u,
        l[0],
        -v.count
      );
    } else if ("added" in f && f.added) {
      const v = f;
      u = Nt(
        u,
        l[0],
        v.count
      );
    } else
      c += f.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, h = s.slice(d).join(" ");
  if (i(h)) {
    const v = Zo(
      h,
      i
    ).map(
      (b) => b + d
    );
    u = u.concat(v);
  }
  return {
    previousIndexes: u,
    previousText: t
  };
}
function Nd(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (t + 1 < n.length) {
      const o = n[t + 1];
      if (o.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: o.added ?? !1,
          countRemoved: i.count,
          countAdded: o.count
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
function Zo(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let i;
  for (i = 0; i < t.length; i++) {
    const o = t.slice(0, i).join(" ");
    if (e(o)) break;
  }
  return [i - 1].concat(
    Nt(
      Zo(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function Wd(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), o = Math.min(t.length, i.length);
  let s = 0;
  for (let a = 0; a < o; a++)
    t[a] === i[a] && s++;
  return s / t.length > 0.8;
}
class Vd {
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
    color: o = "white",
    font: s = "Arial",
    paddingInline: r = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = i, this.color = o, this.font = s, this.paddingInline = r, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  setFontSize(e, t) {
    this.fontSize = e, this.lineHeight = t, this.resetDrawing(), this.onResize();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, t, i) {
    const o = this.canvas.getContext("2d");
    o.font = `${this.fontSize}px ${this.font}`, o.fillStyle = this.color, o.fillText(e, t + this.paddingInline, i);
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
class Hd extends Vd {
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
    this.resetAll(), this.currentState = xn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = xn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = xn(
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
function Qo(n) {
  const e = et();
  let t = null;
  oe(() => {
    n.canvasRef.value && (t = new Hd(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), Z([n.fontSize, n.lineHeight], ([l, u]) => {
    t && t.setFontSize(l, u);
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
  function o() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const s = e.on("translation:change", o), r = e.on("translation:sync", o), a = e.on("channel:sync", o);
  ht(() => {
    i(), s(), r(), a(), t?.dispose(), t = null;
  });
}
const jd = ["height"], Ud = /* @__PURE__ */ $({
  __name: "SubtitleBanner",
  setup(n) {
    const e = et(), t = St("canvas"), i = k(() => e.subtitle?.fontSize.value ?? 40), o = k(() => 1.2 * i.value), s = k(() => 2.4 * i.value);
    return Qo({
      canvasRef: t,
      fontSize: i,
      lineHeight: o
    }), (r, a) => (E(), N("div", {
      class: "subtitle-banner",
      style: Je({ height: s.value + "px" })
    }, [
      W("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, jd)
    ], 4));
  }
}), Kd = /* @__PURE__ */ se(Ud, [["__scopeId", "data-v-30da75ad"]]), Xd = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Yd = ["aria-label"], Gd = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Jd = /* @__PURE__ */ $({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = et(), { t } = Se(), i = St("container"), o = St("canvas"), s = k(() => e.subtitle?.fontSize.value ?? 48), r = k(() => 1.2 * s.value);
    Qo({
      canvasRef: o,
      fontSize: s,
      lineHeight: r
    }), oe(async () => {
      const u = i.value;
      if (u) {
        try {
          await u.requestFullscreen();
        } catch (c) {
          console.warn("Fullscreen API not supported:", c);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function a() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    oe(() => {
      document.addEventListener("fullscreenchange", a);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return ht(() => {
      document.removeEventListener("fullscreenchange", a);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, c) => (E(), N("div", Xd, [
      W("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": p(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        B(p(zn), { size: 24 })
      ], 8, Yd),
      W("canvas", Gd, null, 512)
    ], 512));
  }
}), Zd = /* @__PURE__ */ se(Jd, [["__scopeId", "data-v-442e31fd"]]), Qd = /* @__PURE__ */ $({
  __name: "CopyButton",
  props: {
    icon: { default: "copy" },
    copyFn: {},
    variant: {},
    size: {},
    disabled: { type: Boolean },
    block: { type: Boolean },
    ariaLabel: {}
  },
  setup(n, { expose: e }) {
    const t = n, i = I(!1);
    let o;
    async function s() {
      if (!i.value)
        try {
          await t.copyFn(), i.value = !0, o = setTimeout(() => {
            i.value = !1;
          }, 2e3);
        } catch (l) {
          console.error(l);
        }
    }
    e({
      reset: () => {
        i.value = !1, clearTimeout(o);
      }
    });
    const r = k(() => i.value ? "check" : t.icon), a = k(() => Qi[t.size ?? "sm"]);
    return (l, u) => (E(), M(ye, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: ut({ "copy-btn--copied": i.value }),
      onClick: s
    }, {
      icon: O(() => [
        B(Xi, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: O(() => [
            (E(), M(Bt, {
              key: r.value,
              name: r.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: O(() => [
        V(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Fi = /* @__PURE__ */ se(Qd, [["__scopeId", "data-v-eed7503d"]]), ef = ["aria-label"], tf = { class: "selection-count" }, nf = { class: "selection-actions" }, of = /* @__PURE__ */ $({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Vo(), { t } = Se();
    return (i, o) => p(e).hasSelection.value ? (E(), N("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": p(t)("selection.count")
    }, [
      W("span", tf, X(p(e).count.value) + " " + X(p(t)("selection.count")), 1),
      W("div", nf, [
        B(Fi, {
          icon: "clipboard-type",
          "copy-fn": p(e).copyText,
          variant: "secondary"
        }, {
          default: O(() => [
            ae(X(p(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        B(Fi, {
          icon: "clipboard-list",
          "copy-fn": p(e).copyWithMetadata
        }, {
          default: O(() => [
            ae(X(p(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        B(ye, {
          variant: "transparent",
          icon: "x",
          onClick: o[0] || (o[0] = (s) => p(e).clear())
        }, {
          default: O(() => [
            ae(X(p(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, ef)) : K("", !0);
  }
}), sf = /* @__PURE__ */ se(of, [["__scopeId", "data-v-7569d6ad"]]), rf = { class: "editor-layout" }, af = { class: "editor-body" }, lf = {
  key: 4,
  class: "mobile-selectors"
}, uf = /* @__PURE__ */ $({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = et(), { t: i, locale: o } = Se(), { isMobile: s } = Ho(), r = I(!1), a = k(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), l = t.speakers.all;
    yc(a, l, t);
    const u = k(() => [...t.channels.values()]), c = k(() => [
      ...t.activeChannel.value.translations.values()
    ]), d = k(
      () => t.activeChannel.value.activeTranslation.value.id
    ), h = k(() => Array.from(l.values())), f = St("audioPlayer");
    function v(S) {
      t.audio && (t.audio.currentTime.value = S);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        f.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), r.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((S) => f.value?.seekTo(S));
    const b = k(
      () => Yi(
        c.value,
        o.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function y(S) {
      t.setActiveChannel(S);
    }
    function _(S) {
      t.activeChannel.value.setActiveTranslation(S);
    }
    return (S, m) => (E(), N("div", rf, [
      e.showHeader ? (E(), M(pr, {
        key: 0,
        title: p(t).title.value,
        duration: p(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": p(s),
        onToggleSidebar: m[0] || (m[0] = (g) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      B(sf),
      W("main", af, [
        B(Bc, {
          turns: a.value,
          speakers: p(l)
        }, null, 8, ["turns", "speakers"]),
        p(s) ? K("", !0) : (E(), M(Li, {
          key: 0,
          speakers: h.value,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": y,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        p(s) ? (E(), M(pd, {
          key: 1,
          open: r.value,
          "onUpdate:open": m[1] || (m[1] = (g) => r.value = g)
        }, {
          default: O(() => [
            B(Li, {
              speakers: h.value,
              channels: u.value,
              "selected-channel-id": p(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": y,
              "onUpdate:selectedTranslationId": _
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : K("", !0)
      ]),
      p(t).audio?.src.value ? (E(), M($d, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": p(t).audio.src.value,
        turns: a.value,
        speakers: p(l),
        onTimeupdate: v,
        onPlayStateChange: m[2] || (m[2] = (g) => {
          p(t).audio && (p(t).audio.isPlaying.value = g);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      p(t).subtitle?.isVisible.value && !p(s) && !p(t).subtitle.isFullscreen.value ? (E(), M(Kd, { key: 2 })) : K("", !0),
      p(t).subtitle?.isFullscreen.value ? (E(), M(Zd, { key: 3 })) : K("", !0),
      p(s) && (u.value.length > 1 || c.value.length > 1) ? (E(), N("div", lf, [
        u.value.length > 1 ? (E(), M(jo, {
          key: 0,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          "onUpdate:selectedChannelId": y
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (E(), M(Zn, {
          key: 1,
          items: b.value,
          "selected-value": d.value,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": _
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), yf = /* @__PURE__ */ se(uf, [["__scopeId", "data-v-145fbff1"]]);
function bf() {
  return {
    name: "audio",
    install(n) {
      const e = I(0), t = I(!1);
      let i = null;
      const o = k(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function s(l) {
        i?.(l);
      }
      function r(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: t,
        src: o,
        seekTo: s,
        setSeekHandler: r
      };
      return n.audio = a, () => {
        n.audio = void 0;
      };
    }
  };
}
function zi(n) {
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
function _n(n, e) {
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
function wf() {
  return {
    name: "live",
    install(n) {
      const e = Xe(null), t = I(!1);
      t.value = !0;
      function i() {
        e.value = null;
      }
      function o(m, g) {
        if (n.activeChannelId.value !== g) return;
        const C = n.activeChannel.value.activeTranslation.value;
        if (C.isSource) {
          if (m.text == null) return;
          e.value = m.text;
        } else if (m.translations) {
          const x = m.translations.find(
            (w) => w.translationId === C.id
          );
          e.value = x?.text ?? null;
        } else
          return;
      }
      let s = null;
      function r() {
        s === null && (s = setTimeout(() => {
          s = null, i();
        }, 150));
      }
      function a() {
        s !== null && (clearTimeout(s), s = null);
      }
      function l(m, g) {
        m.hasTurn(g.id) ? m.updateTurn(g.id, g) : m.addTurn(g);
      }
      function u(m, g) {
        m.speakerId && n.speakers.ensure(m.speakerId);
        const C = n.channels.get(g);
        if (!C) {
          h();
          return;
        }
        if (m.text != null && l(
          C.sourceTranslation,
          zi(m)
        ), m.translations)
          for (const w of m.translations) {
            const A = C.translations.get(w.translationId);
            A && l(
              A,
              _n(m, w)
            );
          }
        n.activeChannel.value.activeTranslation.value.isSource && h();
      }
      function c(m, g) {
        d([m], g);
      }
      function d(m, g) {
        const C = n.channels.get(g);
        if (!C) return;
        const x = /* @__PURE__ */ new Set();
        for (const P of m)
          P.speakerId && !x.has(P.speakerId) && (x.add(P.speakerId), n.speakers.ensure(P.speakerId));
        const w = [];
        for (const P of m)
          P.text != null && w.push(zi(P));
        w.length > 0 && C.sourceTranslation.prependTurns(w);
        const A = /* @__PURE__ */ new Map();
        for (const P of m)
          if (P.translations)
            for (const T of P.translations) {
              let L = A.get(T.translationId);
              L || (L = [], A.set(T.translationId, L)), L.push(_n(P, T));
            }
        for (const [P, T] of A) {
          const L = C.translations.get(P);
          L && L.prependTurns(T);
        }
      }
      function h() {
        a(), i();
      }
      function f(m) {
        const g = n.activeChannel.value.activeTranslation.value, C = n.activeChannel.value;
        if (!m.final && g.languages.includes(m.language))
          e.value = m.text;
        else if (m.final) {
          const x = C.translations.get(m.language);
          if (x) {
            const w = _n(
              { ...m },
              m
            );
            x === g ? l(x, w) : x.updateOrCreateTurnSilent(w);
          }
          g.languages.includes(m.language) && h();
        }
      }
      const v = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: o,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: f
      }, b = n.on(
        "channel:change",
        h
      ), y = n.on(
        "translation:change",
        h
      ), _ = n.on(
        "translation:sync",
        r
      ), S = n.on("channel:sync", r);
      return n.live = v, () => {
        h(), b(), y(), _(), S(), n.live = void 0;
      };
    }
  };
}
function Sf(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = I(n.fontSize ?? 40), i = I(!0), o = I(!1), s = {
        fontSize: t,
        isVisible: i,
        isFullscreen: o,
        enterFullscreen() {
          o.value = !0;
        },
        exitFullscreen() {
          o.value = !1;
        }
      };
      return e.subtitle = s, () => {
        i.value = !1, o.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function cf(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function Cf(n) {
  const e = /* @__PURE__ */ new Map();
  for (const o of n.speakers)
    e.set(o.speaker_id, {
      id: o.speaker_id,
      name: o.speaker_name,
      color: ""
    });
  const t = n.text.map((o) => {
    const s = o.words.map(cf), r = s[0]?.startTime ?? o.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? o.etime : o.etime;
    return {
      id: o.turn_id,
      speakerId: o.speaker_id || null,
      text: s.length > 0 ? null : o.segment,
      words: s,
      ...r !== void 0 && { startTime: r },
      ...a !== void 0 && { endTime: a },
      language: o.language
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
let es = 0;
function df(n) {
  return {
    id: `w_${es++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function xf(n) {
  es = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", i = n.segments.map((s, r) => {
    const a = s.words.map(df);
    return {
      id: `turn_${r}`,
      speakerId: s.speaker ?? null,
      text: a.length > 0 ? null : s.text,
      words: a,
      startTime: s.start,
      endTime: s.end,
      language: t
    };
  }), o = n.segments.length > 0 ? n.segments[n.segments.length - 1].end : 0;
  return {
    title: "",
    speakers: e,
    channels: [
      {
        id: "default",
        name: "Canal 1",
        duration: o,
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
  fe as DocumentValidationError,
  yf as EditorLayout,
  bf as createAudioPlugin,
  pf as createEditorStore,
  wf as createLivePlugin,
  Sf as createSubtitlePlugin,
  Cf as mapApiDocument,
  xf as mapWhisperXDocument,
  hf as provideEditorStore,
  vf as provideI18n,
  et as useEditorStore,
  Is as validateEditorDocument
};
