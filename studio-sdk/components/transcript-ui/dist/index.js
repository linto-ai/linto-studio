import * as xc from "vue";
import { shallowReactive as Ls, shallowRef as Lt, ref as _, computed as E, inject as pi, provide as En, h as Ge, defineComponent as $, openBlock as T, createBlock as R, resolveDynamicComponent as Xd, normalizeClass as ht, normalizeStyle as Nn, createElementBlock as B, useSlots as Ug, renderSlot as J, createCommentVNode as H, createTextVNode as ge, toDisplayString as j, createElementVNode as U, Fragment as Pe, renderList as yt, unref as k, withCtx as N, createVNode as q, watchEffect as at, onBeforeUnmount as Ut, effectScope as Gd, getCurrentScope as Yd, onScopeDispose as Zd, getCurrentInstance as cn, customRef as Qd, toValue as Ye, readonly as Wg, watch as Z, nextTick as xe, onMounted as Re, toHandlerKey as jg, camelize as ef, toRef as tf, onUnmounted as gr, toRefs as yr, Comment as Hg, mergeProps as ce, cloneVNode as Kg, reactive as tl, Teleport as Jg, normalizeProps as Mn, guardReactiveProps as mi, markRaw as nl, withKeys as nf, withModifiers as sn, watchPostEffect as rf, shallowReadonly as qn, mergeDefaults as sf, isRef as Xg, createStaticVNode as Gg, render as Sc, useTemplateRef as zt, isMemoSame as Yg, Transition as rl, useId as of, withDirectives as is, vModelSelect as Zg, vModelDynamic as Qg, useModel as ey, vShow as af } from "vue";
import * as W from "yjs";
import { UndoManager as ty, Item as ny, ContentType as ry, Text as iy, XmlElement as sy, Doc as oy } from "yjs";
function ay() {
  const n = /* @__PURE__ */ new Map();
  function e(s, o) {
    let a = n.get(s);
    return a || (a = /* @__PURE__ */ new Set(), n.set(s, a)), a.add(o), () => t(s, o);
  }
  function t(s, o) {
    n.get(s)?.delete(o);
  }
  function r(s, o) {
    n.get(s)?.forEach(
      (a) => a(o)
    );
  }
  function i() {
    n.clear();
  }
  return { on: e, off: t, emit: r, clear: i };
}
const sr = [
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
function ly(n, e, t) {
  const r = sr[n.size % sr.length];
  return { id: e, name: t, color: r };
}
function cy(n, e, t) {
  return !e || n.has(e) ? null : ly(n, e, t ?? e);
}
function ia(n, e) {
  return n.name === e.name && n.color === e.color;
}
function uy(n) {
  const e = Ls(/* @__PURE__ */ new Map());
  function t(a, l) {
    const c = cy(e, a, l);
    c && (e.set(c.id, c), n("speaker:add", { speaker: c }));
  }
  function r(a, l) {
    const c = e.get(a);
    if (!c) return;
    const u = { ...c, ...l };
    ia(c, u) || (e.set(a, u), n("speaker:update", { speaker: u }));
  }
  function i(a) {
    const l = e.get(a.id);
    if (l) {
      if (ia(l, a)) return;
      e.set(a.id, a), n("speaker:update", { speaker: a });
    } else
      e.set(a.id, a), n("speaker:add", { speaker: a });
  }
  function s(a) {
    e.has(a) && (e.delete(a), n("speaker:remove", { speakerId: a }));
  }
  function o() {
    e.clear();
  }
  return { all: e, ensure: t, update: r, updateOrCreate: i, delete: s, clear: o };
}
function dy(n, e) {
  return [...n, e];
}
function fy(n, e) {
  return [...e, ...n];
}
function il(n, e) {
  return n.findIndex((t) => t.id === e);
}
function hy(n, e, t) {
  const r = il(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function py(n, e) {
  const t = il(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function my(n, e, t) {
  const r = il(n, e);
  if (r === -1) return null;
  const i = n[r], s = {
    ...i,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? i.startTime,
    endTime: t[t.length - 1]?.endTime ?? i.endTime
  }, o = n.slice();
  return o[r] = s, { turns: o, updated: s };
}
function sa(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function gy(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = Lt(n.turns), l = /* @__PURE__ */ new Map();
  function c() {
    l.clear();
    const v = a.value;
    for (let w = 0; w < v.length; w++)
      l.set(v[w].id, w);
  }
  c();
  function u(v) {
    t(v.speakerId), l.set(v.id, a.value.length), a.value = dy(a.value, v), e("turn:add", { turn: v, translationId: r });
  }
  function d(v, w) {
    const C = hy(a.value, v, w);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: r }));
  }
  function f(v) {
    const w = py(a.value, v);
    w && (a.value = w, c(), e("turn:remove", { turnId: v, translationId: r }));
  }
  function h(v, w) {
    const C = my(a.value, v, w);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: r }));
  }
  function p(v) {
    sa(v, t), a.value = fy(a.value, v), c();
  }
  function m(v) {
    sa(v, t), a.value = v, c(), e("translation:sync", { translationId: r });
  }
  function g(v) {
    a.value = v, c();
  }
  function y(v) {
    const w = l.get(v.id);
    w !== void 0 ? a.value[w] = v : (l.set(v.id, a.value.length), a.value.push(v));
  }
  function b(v) {
    return l.has(v);
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: a, addTurn: u, prependTurns: p, updateTurn: d, removeTurn: f, updateWords: h, setTurns: m, replaceTurns: g, updateOrCreateTurnSilent: y, hasTurn: b };
}
function Cc(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, a = Ls(/* @__PURE__ */ new Map());
  let l;
  for (const m of n.translations) {
    const g = gy(m, e, t);
    a.set(m.id, g), m.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = _(null), u = _(!1), d = _(!0), f = E(() => c.value ? a.get(c.value) ?? l : l);
  function h(m) {
    const g = m === l.id ? null : m;
    g !== c.value && (c.value = g, e("translation:change", { translationId: f.value.id }));
  }
  function p() {
    for (const m of a.values())
      m.setTurns([]);
    u.value = !1, d.value = !0, e("channel:reset", { channelId: r });
  }
  return {
    id: r,
    name: i,
    description: s,
    duration: o,
    translations: a,
    sourceTranslation: l,
    activeTranslation: f,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: h,
    reset: p
  };
}
function yy(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Tc(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function lf(n, e, t = "*") {
  if (n === "*") return t;
  const r = n.split("-")[0] ?? n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(r) ?? r;
  } catch {
    return n;
  }
}
function vy(n, e, t, r = "*") {
  return [...n].sort(
    (s, o) => Number(o.isSource) - Number(s.isSource)
  ).map((s) => ({
    value: s.id,
    label: s.isSource ? t : s.languages.map((o) => lf(o, e, r)).join(", ")
  }));
}
function by(n, e = 250) {
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
function ss(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
function ky(n, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(n * 1e3));
}
function wy(n) {
  if (typeof n == "number") {
    const t = n < 1e12 ? n * 1e3 : n, r = new Date(t);
    return Number.isNaN(r.getTime()) ? null : r;
  }
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? null : e;
}
function cf(n, e) {
  const t = wy(n);
  return t ? new Intl.DateTimeFormat(e, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(t) : "";
}
function uf(n, e) {
  const t = Math.max(0, Math.round(n / 60));
  if (t < 60)
    return new Intl.NumberFormat(e, {
      style: "unit",
      unit: "minute",
      unitDisplay: "narrow"
    }).format(t);
  const r = Math.floor(t / 60), i = t % 60, s = new Intl.NumberFormat(e, {
    style: "unit",
    unit: "hour",
    unitDisplay: "narrow"
  }).format(r);
  if (i === 0) return s;
  const o = new Intl.NumberFormat(e, {
    style: "unit",
    unit: "minute",
    unitDisplay: "narrow"
  }).format(i);
  return `${s} ${o}`;
}
class Je extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function xy(n) {
  if (n == null || typeof n != "object")
    throw new Je("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new Je("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Je("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Je("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new Je(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Je(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Je(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Je(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Je(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Je(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Je(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Je(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Je(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Je(`${a}.turns`, "must be an array");
    }
  }
}
function Sy(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function sl(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
const Cy = 1;
function df(n, e) {
  if (!sl(n)) return null;
  for (const t of n)
    if (t.startTime - Cy <= e && e <= t.endTime)
      return t.id;
  return null;
}
function lR(n = {}) {
  const e = _(""), t = _(null), r = _(n.activeChannelId ?? ""), i = _(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: a, clear: l } = ay(), c = uy(a), u = c, d = Ls(/* @__PURE__ */ new Map()), f = E(
    () => d.get(r.value) ?? [...d.values()][0]
  );
  function h(x, A) {
    return s(x, (S) => {
      const O = f.value;
      O && S.translationId === O.activeTranslation.value.id && A(S);
    });
  }
  function p(x) {
    e.value = x.title, t.value = x.date ?? null, c.clear(), d.clear();
    for (const A of yy(x))
      u.ensure(A.id, A.name);
    for (const A of x.channels)
      d.set(A.id, Cc(A, a, u.ensure));
    d.size > 0 && !d.has(r.value) && (r.value = d.keys().next().value);
  }
  function m(x) {
    xy(x), p(x);
  }
  function g(x) {
    x !== r.value && (r.value = x, a("channel:change", { channelId: x }));
  }
  function y(x, A) {
    if (d.has(x)) {
      for (const S of A.translations)
        sa(S.turns, u.ensure);
      d.set(x, Cc(A, a, u.ensure)), a("channel:sync", { channelId: x });
    }
  }
  const b = [], v = [];
  function w(x) {
    x.tiptapExtensions && v.push(...x.tiptapExtensions);
    const A = x.install(M);
    A && b.push(A);
  }
  function C() {
    a("destroy", void 0), b.forEach((x) => x()), b.length = 0, l();
  }
  n.document && p(n.document);
  const M = {
    title: e,
    date: t,
    activeChannelId: r,
    capabilities: i,
    pluginExtensions: v,
    speakers: u,
    channels: d,
    activeChannel: f,
    onActiveTranslation: h,
    setDocument: m,
    setActiveChannel: g,
    setChannel: y,
    on: s,
    off: o,
    emit: a,
    use: w,
    destroy: C
  };
  return M;
}
const ff = /* @__PURE__ */ Symbol("core");
function cR(n) {
  En(ff, n);
}
function ze() {
  const n = pi(ff);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const Ty = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Ec = (n) => n === "";
const Ey = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const Mc = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const My = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Ay = (n) => {
  const e = My(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Cr = {
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
const Oy = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = Cr.width,
  color: a = Cr.stroke,
  ...l
}, { slots: c }) => Ge(
  "svg",
  {
    ...Cr,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": Ec(t) || Ec(r) || t === !0 || r === !0 ? Number(i || s || Cr["stroke-width"]) * 24 / Number(o) : i || s || Cr["stroke-width"],
    class: Ey(
      "lucide",
      l.class,
      ...n ? [`lucide-${Mc(Ay(n))}-icon`, `lucide-${Mc(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Ty(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => Ge(...u)), ...c.default ? [c.default()] : []]
);
const fe = (n, e) => (t, { slots: r, attrs: i }) => Ge(
  Oy,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const hf = fe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const pf = fe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Dy = fe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const _y = fe("clipboard-list", [
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
const Py = fe("clipboard-type", [
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
const Ry = fe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Iy = fe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Ny = fe("ellipsis-vertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const $y = fe("file-text", [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
const Ac = fe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const By = fe("message-circle", [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
]);
const mf = fe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const gf = fe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Ly = fe("refresh-cw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const zy = fe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const yf = fe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const vf = fe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const bf = fe("sparkles", [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
]);
const Fy = fe("user-plus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const kf = fe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const wf = fe("volume-2", [
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
const xf = fe("volume-x", [
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
const ol = fe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Vy = {
  "arrow-down": hf,
  check: pf,
  "chevron-down": Dy,
  "clipboard-list": _y,
  "clipboard-type": Py,
  copy: Ry,
  download: Iy,
  pause: mf,
  play: gf,
  settings: zy,
  "skip-back": yf,
  "skip-forward": vf,
  users: kf,
  volume: wf,
  "volume-mute": xf,
  x: ol,
  "circle-notch": Ac,
  spinner: Ac,
  "more-vertical": Ny,
  "user-plus": Fy,
  "file-text": $y,
  "message-circle": By,
  "refresh-cw": Ly,
  sparkles: bf
};
function as(n) {
  if (n)
    return Vy[n];
}
const Sf = {
  sm: 16,
  md: 20,
  lg: 24
}, qy = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Uy = /* @__PURE__ */ $({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = E(() => as(e.name)), r = E(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (T(), R(Xd(t.value), {
      key: 0,
      style: Nn(r.value),
      class: ht(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (T(), B("span", qy, "?"));
  }
}), ne = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, Qn = /* @__PURE__ */ ne(Uy, [["__scopeId", "data-v-210c7f09"]]), Wy = ["type", "disabled", "aria-disabled", "aria-label"], jy = {
  key: 3,
  class: "editor-btn__label"
}, Hy = /* @__PURE__ */ $({
  __name: "Button",
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
    const e = n, t = Ug(), r = E(() => !!as(e.icon)), i = E(() => !!as(e.iconRight)), s = E(() => Sf[e.size]), o = E(() => e.disabled || e.loading), a = E(() => !!e.label || !!t.default), l = E(
      () => e.loading || r.value || !!t.icon
    ), c = E(() => l.value && !a.value), u = E(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      c.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, f) => (T(), B("button", {
      type: n.type,
      class: ht(u.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (T(), R(Qn, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (T(), R(Qn, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? J(d.$slots, "icon", { key: 2 }, void 0, !0) : H("", !0),
      a.value ? (T(), B("span", jy, [
        J(d.$slots, "default", {}, () => [
          ge(j(n.label), 1)
        ], !0)
      ])) : H("", !0),
      i.value ? (T(), R(Qn, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? J(d.$slots, "icon-right", { key: 5 }, void 0, !0) : H("", !0)
    ], 10, Wy));
  }
}), me = /* @__PURE__ */ ne(Hy, [["__scopeId", "data-v-2212567e"]]), Cf = {
  "editor.loading": "Chargement…",
  "editor.loadError": "Erreur de chargement",
  "header.export": "Exporter",
  "header.settings": "Paramètres",
  "header.openSidebar": "Ouvrir le panneau",
  "header.closeSidebar": "Fermer le panneau",
  "sidebar.channel": "Canal",
  "sidebar.speakers": "Intervenants",
  "sidebar.renameSpeaker": "Renommer l'intervenant",
  "form.apply": "Valider",
  "form.cancel": "Annuler",
  "speakerPopover.newSpeaker": "Nouvel intervenant",
  "speakerPopover.newSpeakerPlaceholder": "Nom de l'intervenant…",
  "speakerMenu.openMenu": "Ouvrir le menu",
  "speakerMenu.merge": "Fusionner dans…",
  "mergeDialog.title": "Fusionner l'intervenant",
  "mergeDialog.turnsAffected": "interventions seront réassignées",
  "mergeDialog.targetLabel": "Destinataire",
  "mergeDialog.cancel": "Annuler",
  "mergeDialog.confirm": "Fusionner",
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
  "sidebar.channelSelectLabel": "Sélectionner le canal",
  "sidebar.translation": "Traduction",
  "sidebar.translationLabel": "Traduction",
  "sidebar.translationSelectLabel": "Sélectionner l'original ou la traduction",
  "sidebar.originalLanguage": "Langue originale",
  "language.wildcard": "Multi-langue",
  "select.filter": "Rechercher…",
  "subtitle.exitFullscreen": "Quitter le plein écran",
  "subtitle.show": "Afficher les sous-titres",
  "subtitle.fontSize": "Taille de police",
  "subtitle.showWatermark": "Afficher le filigrane",
  "subtitle.pinWatermark": "Épingler le filigrane",
  "sidebar.subtitle": "Sous-titres",
  "transcription.empty": "Aucune transcription pour le moment",
  "transcription.historyStart": "Début de la transcription",
  "transcription.loadingHistory": "Chargement…",
  "selection.count": "sélectionné(s)",
  "selection.copyText": "Copier le texte",
  "selection.copyWithMetadata": "Copier avec les timestamps",
  "selection.cancel": "Annuler",
  "selection.select": "Sélectionner {name}",
  "selection.deselect": "Désélectionner {name}",
  "header.ask": "Demander",
  "header.speakerCount": "{count} intervenant | {count} intervenants",
  "tabs.transcription": "Transcription",
  "tabs.verbatim": "Verbatim",
  "tabs.aiBadge": "IA",
  "tabs.moreLabel": "Plus",
  "tabs.moreSelect": "Sélectionner…",
  "llmService.regenerate": "Régénérer",
  "llmService.download": "Télécharger",
  "llmService.generated": "Généré par IA",
  "llmService.processing": "Génération en cours…",
  "llmService.queued": "En file d'attente…",
  "llmService.empty": "Aucun contenu — cliquez sur Régénérer pour démarrer.",
  "llmService.error": "Erreur de génération",
  "llmService.errorTemporary": "Nous n'avons pas pu terminer la tâche en raison d'un problème de connexion temporaire avec le service d'intelligence artificielle. Veuillez réessayer dans un moment.",
  "llmService.generate": "Générer le document",
  "llmService.retry": "Réessayer",
  "verbatim.title": "Verbatim",
  "format.docx": "Document Word (.docx)",
  "format.pdf": "PDF (.pdf)",
  "format.txt": "Texte brut (.txt)",
  "format.json": "JSON (.json)",
  "format.whisperx": "WhisperX JSON",
  "time.relative.justNow": "à l'instant",
  "time.relative.minutes": "il y a {n} min",
  "time.relative.hours": "il y a {n} h",
  "time.relative.days": "il y a {n} j"
}, Ky = {
  "editor.loading": "Loading…",
  "editor.loadError": "Loading error",
  "header.export": "Export",
  "header.settings": "Settings",
  "header.openSidebar": "Open panel",
  "header.closeSidebar": "Close panel",
  "sidebar.channel": "Channel",
  "sidebar.speakers": "Speakers",
  "sidebar.renameSpeaker": "Rename speaker",
  "form.apply": "Apply",
  "form.cancel": "Cancel",
  "speakerPopover.newSpeaker": "New speaker",
  "speakerPopover.newSpeakerPlaceholder": "Speaker name…",
  "speakerMenu.openMenu": "Open menu",
  "speakerMenu.merge": "Merge into…",
  "mergeDialog.title": "Merge speaker",
  "mergeDialog.turnsAffected": "turns will be reassigned",
  "mergeDialog.targetLabel": "Target",
  "mergeDialog.cancel": "Cancel",
  "mergeDialog.confirm": "Merge",
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
  "sidebar.channelSelectLabel": "Select a channel",
  "sidebar.translation": "Translation",
  "sidebar.translationLabel": "Translation",
  "sidebar.translationSelectLabel": "Select original/translation",
  "sidebar.originalLanguage": "Original language",
  "language.wildcard": "Multilingual",
  "select.filter": "Search…",
  "subtitle.exitFullscreen": "Exit fullscreen",
  "subtitle.show": "Show subtitles",
  "subtitle.fontSize": "Font size",
  "subtitle.showWatermark": "Show watermark",
  "subtitle.pinWatermark": "Pin watermark",
  "sidebar.subtitle": "Subtitles",
  "transcription.empty": "No transcription yet",
  "transcription.historyStart": "Beginning of transcription",
  "transcription.loadingHistory": "Loading…",
  "selection.count": "selected",
  "selection.copyText": "Copy text",
  "selection.copyWithMetadata": "Copy with timestamps",
  "selection.cancel": "Cancel",
  "selection.select": "Select {name}",
  "selection.deselect": "Deselect {name}",
  "header.ask": "Ask",
  "header.speakerCount": "{count} speaker | {count} speakers",
  "tabs.transcription": "Transcription",
  "tabs.verbatim": "Verbatim",
  "tabs.aiBadge": "AI",
  "tabs.moreLabel": "More",
  "tabs.moreSelect": "Select…",
  "llmService.regenerate": "Regenerate",
  "llmService.download": "Download",
  "llmService.generated": "AI-generated",
  "llmService.processing": "Generating…",
  "llmService.queued": "Queued…",
  "llmService.empty": "No content yet — click Regenerate to start.",
  "llmService.error": "Generation error",
  "llmService.errorTemporary": "We couldn't complete the task due to a temporary connection issue with the model provider. Please try again in a moment.",
  "llmService.generate": "Generate document",
  "llmService.retry": "Retry",
  "verbatim.title": "Verbatim",
  "format.docx": "Word document (.docx)",
  "format.pdf": "PDF (.pdf)",
  "format.txt": "Plain text (.txt)",
  "format.json": "JSON (.json)",
  "format.whisperx": "WhisperX JSON",
  "time.relative.justNow": "just now",
  "time.relative.minutes": "{n} min ago",
  "time.relative.hours": "{n} h ago",
  "time.relative.days": "{n} d ago"
}, Oc = { fr: Cf, en: Ky }, Tf = /* @__PURE__ */ Symbol("i18n");
function Ef(n, e) {
  let t = n;
  if (e && Object.prototype.hasOwnProperty.call(e, "count")) {
    const r = Number(e.count), i = t.split("|").map((s) => s.trim());
    i.length >= 2 && (t = r === 1 ? i[0] : i[1]);
  }
  return e && (t = t.replace(
    /\{(\w+)\}/g,
    (r, i) => Object.prototype.hasOwnProperty.call(e, i) ? String(e[i]) : `{${i}}`
  )), t;
}
function uR(n) {
  const e = E(() => {
    const r = Oc[n.value] ?? Oc.fr;
    return (i, s) => Ef(r[i] ?? i, s);
  }), t = {
    t: (r, i) => e.value(r, i),
    locale: n
  };
  return En(Tf, t), t;
}
function ye() {
  const n = pi(Tf);
  if (n) return n;
  const e = E(() => "fr");
  return {
    t: (t, r) => Ef(Cf[t] ?? t, r),
    locale: e
  };
}
const Jy = { class: "editor-header" }, Xy = { class: "header-main" }, Gy = { class: "document-title" }, Yy = {
  key: 0,
  class: "document-meta"
}, Zy = { class: "header-right" }, Qy = { key: 0 }, ev = /* @__PURE__ */ $({
  __name: "Header",
  props: {
    title: {},
    date: {},
    duration: {},
    speakerCount: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = ye(), i = E(() => e.title.replace(/-/g, " ")), s = E(
      () => e.date != null ? cf(e.date, r.value) : ""
    ), o = E(
      () => uf(e.duration, r.value)
    ), a = E(
      () => t("header.speakerCount", { count: e.speakerCount })
    ), l = E(
      () => [
        s.value,
        o.value,
        a.value
      ].filter(Boolean)
    );
    return (c, u) => (T(), B("header", Jy, [
      U("div", Xy, [
        U("h1", Gy, j(i.value), 1),
        l.value.length ? (T(), B("div", Yy, [
          (T(!0), B(Pe, null, yt(l.value, (d, f) => (T(), B("span", {
            key: f,
            class: "document-meta__part"
          }, j(d), 1))), 128))
        ])) : H("", !0)
      ]),
      U("div", Zy, [
        n.isMobile ? (T(), R(me, {
          key: 0,
          variant: "transparent",
          "aria-label": k(t)("header.openSidebar"),
          onClick: u[0] || (u[0] = (d) => c.$emit("toggleSidebar"))
        }, {
          icon: N(() => [
            q(k(kf), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : H("", !0),
        q(me, {
          variant: "primary",
          "aria-label": k(t)("header.ask"),
          disabled: ""
        }, {
          icon: N(() => [
            q(k(bf), { size: 16 })
          ]),
          default: N(() => [
            n.isMobile ? H("", !0) : (T(), B("span", Qy, j(k(t)("header.ask")), 1))
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), tv = /* @__PURE__ */ ne(ev, [["__scopeId", "data-v-7975aaa4"]]), nv = ["aria-label"], rv = /* @__PURE__ */ $({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (T(), B("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      J(e.$slots, "default", {}, void 0, !0)
    ], 8, nv));
  }
}), iv = /* @__PURE__ */ ne(rv, [["__scopeId", "data-v-732d4c24"]]), sv = ["aria-label"], ov = ["aria-selected", "aria-disabled", "disabled", "onClick"], av = { class: "tab__label" }, lv = /* @__PURE__ */ $({
  __name: "Tabs",
  props: {
    tabs: {},
    modelValue: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e;
    function i(s) {
      s.disabled || s.value !== t.modelValue && r("update:modelValue", s.value);
    }
    return (s, o) => (T(), B("div", {
      class: "tabs",
      role: "tablist",
      "aria-label": n.ariaLabel
    }, [
      (T(!0), B(Pe, null, yt(n.tabs, (a) => (T(), B("button", {
        key: a.value,
        type: "button",
        role: "tab",
        class: ht(["tab", { "tab--active": a.value === n.modelValue }]),
        "aria-selected": a.value === n.modelValue,
        "aria-disabled": a.disabled || void 0,
        disabled: a.disabled,
        onClick: (l) => i(a)
      }, [
        k(as)(a.icon) ? (T(), R(Qn, {
          key: 0,
          name: a.icon,
          size: 16,
          class: "tab__icon"
        }, null, 8, ["name"])) : H("", !0),
        U("span", av, j(a.label), 1),
        a.badge ? (T(), R(iv, {
          key: 1,
          class: "tab__badge"
        }, {
          default: N(() => [
            ge(j(a.badge), 1)
          ]),
          _: 2
        }, 1024)) : H("", !0)
      ], 10, ov))), 128))
    ], 8, sv));
  }
}), cv = /* @__PURE__ */ ne(lv, [["__scopeId", "data-v-24f9730e"]]), Jn = "__transcription__", Wi = "__verbatim__", uv = /* @__PURE__ */ $({
  __name: "TabBar",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = ze(), { t: s } = ye(), o = E(() => {
      const l = i.llmServices?.list.value ?? [];
      return [
        {
          value: Jn,
          label: s("tabs.transcription"),
          icon: "message-circle"
        },
        {
          value: Wi,
          label: s("tabs.verbatim"),
          icon: "file-text"
        },
        ...l.map((c) => ({
          value: c.id,
          label: c.label.value,
          icon: "sparkles",
          badge: s("tabs.aiBadge")
        }))
      ];
    });
    function a(l) {
      l !== t.modelValue && r("update:modelValue", l);
    }
    return (l, c) => k(i).llmServices ? (T(), R(cv, {
      key: 0,
      tabs: o.value,
      "model-value": n.modelValue,
      "onUpdate:modelValue": a
    }, null, 8, ["tabs", "model-value"])) : H("", !0);
  }
}), ko = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, dv = 70, fv = 1e3 / 60, hv = 350;
let ji = !1, Dc = !1;
function pv() {
  Dc || typeof document > "u" || (document.addEventListener("mousedown", () => {
    ji = !0;
  }), document.addEventListener("mouseup", () => {
    ji = !1;
  }), document.addEventListener("click", () => {
    ji = !1;
  }), Dc = !0);
}
const wo = /* @__PURE__ */ new Map();
function xo(...n) {
  const e = {
    damping: ko.damping,
    stiffness: ko.stiffness,
    mass: ko.mass
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
  return wo.has(r) || wo.set(r, Object.freeze({ ...e })), t ? "instant" : wo.get(r);
}
function mv(n = {}) {
  pv();
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
    const O = s();
    for (const D of t) D(O);
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
  function a(O) {
    r.scrollElement && (r.scrollElement.scrollTop = O, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function l() {
    const O = r.scrollElement, D = r.contentElement;
    return !O || !D ? 0 : O.scrollHeight - 1 - O.clientHeight;
  }
  let c;
  function u() {
    const O = r.scrollElement, D = r.contentElement;
    if (!O || !D)
      return 0;
    const I = l();
    if (!e.targetScrollTop)
      return I;
    if (c?.targetScrollTop === I)
      return c.calculatedScrollTop;
    const F = Math.max(
      Math.min(
        e.targetScrollTop(I, {
          scrollElement: O,
          contentElement: D
        }),
        I
      ),
      0
    );
    return c = { targetScrollTop: I, calculatedScrollTop: F }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), F;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= dv;
  }
  function h(O) {
    r.isAtBottom = O, i();
  }
  function p(O) {
    r.escapedFromLock = O, i();
  }
  function m(O) {
    r.isNearBottom = O, i();
  }
  function g() {
    if (!ji || typeof window > "u")
      return !1;
    const O = window.getSelection?.();
    if (!O || !O.rangeCount)
      return !1;
    const D = O.getRangeAt(0), I = r.scrollElement;
    if (!I)
      return !1;
    const F = D.commonAncestorContainer;
    return !!(F && (I.contains(F) || F.contains(I)));
  }
  const y = (O) => {
    if (O.target !== r.scrollElement)
      return;
    const D = o(), I = r.ignoreScrollToTop;
    let F = r.lastScrollTop ?? D;
    r.lastScrollTop = D, r.ignoreScrollToTop = void 0, I && I > D && (F = I), m(f()), setTimeout(() => {
      if (r.resizeDifference || D === I)
        return;
      if (g()) {
        p(!0), h(!1);
        return;
      }
      const L = D > F, G = D < F;
      if (r.animation?.ignoreEscapes) {
        a(F);
        return;
      }
      G && (p(!0), h(!1)), L && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, b = (O) => {
    const D = r.scrollElement;
    if (!D)
      return;
    let I = O.target;
    for (; I && !["scroll", "auto"].includes(getComputedStyle(I).overflow); ) {
      if (!I.parentElement)
        return;
      I = I.parentElement;
    }
    I === D && O.deltaY < 0 && D.scrollHeight > D.clientHeight && !r.animation?.ignoreEscapes && (p(!0), h(!1));
  };
  function v(O, D) {
    w(), r.scrollElement = O, r.contentElement = D, getComputedStyle(O).overflow === "visible" && (O.style.overflow = "auto"), O.addEventListener("scroll", y, { passive: !0 }), O.addEventListener("wheel", b, { passive: !0 });
    let I;
    r.resizeObserver = new ResizeObserver((F) => {
      const L = F[0];
      if (!L)
        return;
      const { height: G } = L.contentRect, ae = G - (I ?? G);
      if (r.resizeDifference = ae, o() > l() && a(l()), m(f()), ae >= 0) {
        const re = xo(
          e,
          I ? e.resize : e.initial
        );
        x({
          animation: re,
          wait: !0,
          preserveScrollPosition: !0,
          duration: re === "instant" ? void 0 : hv
        });
      } else
        f() && (p(!1), h(!0));
      I = G, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === ae && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(D);
  }
  function w() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", y), r.scrollElement.removeEventListener("wheel", b)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function C() {
    w(), t.clear();
  }
  function M(O) {
    e = { ...e, ...O };
  }
  function x(O = {}) {
    const D = typeof O == "string" ? { animation: O } : O;
    D.preserveScrollPosition || h(!0);
    const I = Date.now() + (Number(D.wait) || 0), F = xo(e, D.animation), { ignoreEscapes: L = !1 } = D;
    let G, ae = u();
    D.duration instanceof Promise ? D.duration.finally(() => {
      G = Date.now();
    }) : G = I + (D.duration ?? 0);
    const re = async () => {
      const ue = new Promise((ve) => {
        if (typeof requestAnimationFrame > "u") {
          ve(!1);
          return;
        }
        requestAnimationFrame(() => ve(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const ve = o(), Dt = typeof performance < "u" ? performance.now() : Date.now(), vo = (Dt - (r.lastTick ?? Dt)) / fv;
        if (r.animation ||= { behavior: F, promise: ue, ignoreEscapes: L }, r.animation.behavior === F && (r.lastTick = Dt), g() || I > Date.now())
          return re();
        if (ve < Math.min(ae, u())) {
          if (r.animation?.behavior === F) {
            if (F === "instant")
              return a(u()), re();
            const Sr = F;
            r.velocity = (Sr.damping * r.velocity + Sr.stiffness * d()) / Sr.mass, r.accumulated += r.velocity * vo;
            const Mi = o();
            a(Mi + r.accumulated), o() !== Mi && (r.accumulated = 0);
          }
          return re();
        }
        return G > Date.now() ? (ae = u(), re()) : (r.animation = void 0, o() < u() ? x({
          animation: xo(e, e.resize),
          ignoreEscapes: L,
          duration: Math.max(0, G - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ue.then((ve) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), ve));
    };
    return D.wait !== !0 && (r.animation = void 0), r.animation?.behavior === F ? r.animation.promise : re();
  }
  const A = () => {
    p(!0), h(!1);
  };
  function S(O) {
    return t.add(O), () => t.delete(O);
  }
  return {
    attach: v,
    detach: w,
    destroy: C,
    setOptions: M,
    getState: s,
    onChange: S,
    scrollToBottom: x,
    stopScroll: A
  };
}
function gv(n = {}) {
  const e = _(null), t = _(null), r = _(n.initial !== !1), i = _(!1), s = _(!1), o = mv(n);
  let a = null;
  return at((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), Ut(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: r,
    isNearBottom: i,
    escapedFromLock: s,
    scrollToBottom: (l) => o.scrollToBottom(l),
    stopScroll: () => o.stopScroll(),
    setOptions: (l) => o.setOptions(l)
  };
}
const yv = /* @__PURE__ */ $({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (T(), B("span", {
      class: "speaker-indicator",
      style: Nn({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), zs = /* @__PURE__ */ ne(yv, [["__scopeId", "data-v-9bffeda8"]]), vv = { class: "speaker-label" }, bv = {
  key: 1,
  class: "speaker-name"
}, kv = ["datetime"], wv = { class: "lang" }, xv = /* @__PURE__ */ $({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    startDate: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = ye(), i = E(
      () => lf(e.language, r.value, t("language.wildcard"))
    ), s = E(() => {
      if (e.startTime != null)
        return {
          text: ss(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const a = new Date(e.startDate * 1e3);
        return {
          text: ky(e.startDate, r.value),
          datetime: a.toISOString()
        };
      }
      return null;
    }), o = E(() => e.speaker?.color ?? "transparent");
    return (a, l) => (T(), B("div", vv, [
      n.speaker ? (T(), R(zs, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : H("", !0),
      n.speaker ? (T(), B("span", bv, j(n.speaker.name), 1)) : H("", !0),
      s.value ? (T(), B("time", {
        key: 2,
        class: "timestamp",
        datetime: s.value.datetime
      }, j(s.value.text), 9, kv)) : H("", !0),
      U("span", wv, j(i.value), 1)
    ]));
  }
}), oa = /* @__PURE__ */ ne(xv, [["__scopeId", "data-v-b451886f"]]);
function _c(n) {
  return typeof n == "string" ? `'${n}'` : new Sv().serialize(n);
}
const Sv = /* @__PURE__ */ (function() {
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
      const i = Array.from(r).sort((o, a) => this.compare(o[0], a[0]));
      let s = `${t}{`;
      for (let o = 0; o < i.length; o++) {
        const [a, l] = i[o];
        s += `${this.serialize(a, !0)}:${this.serialize(l)}`, o < i.length - 1 && (s += ",");
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
function aa(n, e) {
  return n === e || _c(n) === _c(e);
}
function kt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = pi(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (En(r, o), o)];
}
function Ze() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Mf(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function ls(n) {
  return n == null;
}
function Pc(n, e) {
  return ls(n) ? !1 : Array.isArray(n) ? n.some((t) => aa(t, e)) : aa(n, e);
}
function al(n) {
  return n ? n.flatMap((e) => e.type === Pe ? al(e.children) : [e]) : [];
}
const Cv = ["INPUT", "TEXTAREA"];
function Tv(n, e, t, r = {}) {
  if (!e || r.enableIgnoredElement && Cv.includes(e.nodeName)) return null;
  const { arrowKeyOptions: i = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: o = [], loop: a = !0, dir: l = "ltr", preventScroll: c = !0, focus: u = !1 } = r, [d, f, h, p, m, g] = [
    n.key === "ArrowRight",
    n.key === "ArrowLeft",
    n.key === "ArrowUp",
    n.key === "ArrowDown",
    n.key === "Home",
    n.key === "End"
  ], y = h || p, b = d || f;
  if (!m && !g && (!y && !b || i === "vertical" && b || i === "horizontal" && y)) return null;
  const v = t ? Array.from(t.querySelectorAll(s)) : o;
  if (!v.length) return null;
  c && n.preventDefault();
  let w = null;
  return b || y ? w = Af(v, e, {
    goForward: y ? p : l === "ltr" ? d : f,
    loop: a
  }) : m ? w = v.at(0) || null : g && (w = v.at(-1) || null), u && w?.focus(), w;
}
function Af(n, e, t, r = n.length) {
  if (--r === 0) return null;
  const i = n.indexOf(e), s = t.goForward ? i + 1 : i - 1;
  if (!t.loop && (s < 0 || s >= n.length)) return null;
  const o = (s + n.length) % n.length, a = n[o];
  return a ? a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false" ? Af(n, a, t, r) : a : null;
}
const [ll] = kt("ConfigProvider");
function Ev(n, e) {
  var t;
  const r = Lt();
  return at(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Wg(r);
}
function Of(n, e) {
  return Yd() ? (Zd(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Mv(n) {
  let e = !1, t;
  const r = Gd(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const un = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Av = (n) => typeof n < "u", Ov = Object.prototype.toString, Dv = (n) => Ov.call(n) === "[object Object]";
function So(n) {
  return Array.isArray(n) ? n : [n];
}
function _v(n) {
  return cn();
}
// @__NO_SIDE_EFFECTS__
function Df(n) {
  if (!un) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = Gd(!0), t = r.run(() => n(...s))), Of(i), t));
}
function Pv(n, e = 1e4) {
  return Qd((t, r) => {
    let i = Ye(n), s;
    const o = () => setTimeout(() => {
      i = Ye(n), r();
    }, Ye(e));
    return Of(() => {
      clearTimeout(s);
    }), {
      get() {
        return t(), i;
      },
      set(a) {
        i = a, r(), clearTimeout(s), s = o();
      }
    };
  });
}
function Rv(n, e) {
  _v() && Ut(n, e);
}
function Iv(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const cl = un ? window : void 0;
function $n(n) {
  var e;
  const t = Ye(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function la(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = E(() => {
    const r = So(Ye(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return Iv(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => $n(s))) !== null && r !== void 0 ? r : [cl].filter((s) => s != null),
      So(Ye(t.value ? n[1] : n[0])),
      So(k(t.value ? n[2] : n[1])),
      Ye(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = Dv(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Nv() {
  const n = Lt(!1), e = cn();
  return e && Re(() => {
    n.value = !0;
  }, e), n;
}
function $v(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Bv(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = cl, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = $v(e);
  return la(i, s, (u) => {
    u.repeat && Ye(a) || l(u) && t(u);
  }, o);
}
function Lv(n) {
  return JSON.parse(JSON.stringify(n));
}
// @__NO_SIDE_EFFECTS__
function gi(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = cn(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (b) => o ? typeof o == "function" ? o(b) : Lv(b) : b, g = () => Av(n[e]) ? m(n[e]) : u, y = (b) => {
    d ? d(b) && h(p, b) : h(p, b);
  };
  if (a) {
    const b = _(g());
    let v = !1;
    return Z(() => n[e], (w) => {
      v || (v = !0, b.value = m(w), xe(() => v = !1));
    }), Z(b, (w) => {
      !v && (w !== n[e] || c) && y(w);
    }, { deep: c }), b;
  } else return E({
    get() {
      return g();
    },
    set(b) {
      y(b);
    }
  });
}
function Co(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function ca(n, e, t = ".", r) {
  if (!Co(e))
    return ca(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : Co(o) && Co(i[s]) ? i[s] = ca(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function zv(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => ca(t, r, "", n), {})
  );
}
const Fv = zv(), Vv = /* @__PURE__ */ Df(() => {
  const n = _(/* @__PURE__ */ new Map()), e = _(), t = E(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), r = ll({ scrollBody: _(!0) }), i = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", e.value = void 0;
  };
  return Z(t, (s, o) => {
    if (!un) return;
    if (!s) {
      o && i();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, l = {
      padding: a,
      margin: 0
    }, c = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Fv({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, l) : l : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), xe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function _f(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Vv();
  t.value.set(e, n ?? !1);
  const r = E({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return Rv(() => {
    t.value.delete(e);
  }), r;
}
function ul(n) {
  const e = ll({ dir: _("ltr") });
  return E(() => n?.value || e.dir?.value || "ltr");
}
function yi(n) {
  const e = cn(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[jg(ef(i))] = (...s) => n(i, ...s);
  }), r;
}
let To = 0;
function qv() {
  at((n) => {
    if (!un) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Rc()), document.body.insertAdjacentElement("beforeend", e[1] ?? Rc()), To++, n(() => {
      To === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), To--;
    });
  });
}
function Rc() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Uv(n) {
  return E(() => Ye(n) ? !!$n(n)?.closest("form") : !0);
}
function he() {
  const n = cn(), e = _(), t = E(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : $n(e)), r = Object.assign({}, n.exposed), i = {};
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
      const a = o.$.exposed, l = Object.assign({}, i);
      for (const c in a) Object.defineProperty(l, c, {
        enumerable: !0,
        configurable: !0,
        get: () => a[c]
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
function Wv(n) {
  const e = cn(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = tf(n);
  return E(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[ef(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function Fs(n, e) {
  const t = Wv(n), r = e ? yi(e) : {};
  return E(() => ({
    ...t.value,
    ...r
  }));
}
var jv = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, Un = /* @__PURE__ */ new WeakMap(), Oi = /* @__PURE__ */ new WeakMap(), Di = {}, Eo = 0, Pf = function(n) {
  return n && (n.host || Pf(n.parentNode));
}, Hv = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = Pf(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Kv = function(n, e, t, r) {
  var i = Hv(e, Array.isArray(n) ? n : [n]);
  Di[t] || (Di[t] = /* @__PURE__ */ new WeakMap());
  var s = Di[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (Un.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Un.set(f, m), s.set(f, g), o.push(f), m === 1 && p && Oi.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return u(e), a.clear(), Eo++, function() {
    o.forEach(function(d) {
      var f = Un.get(d) - 1, h = s.get(d) - 1;
      Un.set(d, f), s.set(d, h), f || (Oi.has(d) || d.removeAttribute(r), Oi.delete(d)), h || d.removeAttribute(t);
    }), Eo--, Eo || (Un = /* @__PURE__ */ new WeakMap(), Un = /* @__PURE__ */ new WeakMap(), Oi = /* @__PURE__ */ new WeakMap(), Di = {});
  };
}, Jv = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = jv(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Kv(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function Rf(n) {
  let e;
  Z(() => $n(n), (t) => {
    t ? e = Jv(t) : e && e();
  }), gr(() => {
    e && e();
  });
}
let Xv = 0;
function Hr(n, e = "reka") {
  if ("useId" in xc) return `${e}-${xc.useId?.()}`;
  const t = ll({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Xv}`;
}
function Gv(n) {
  const e = _(), t = E(() => e.value?.width ?? 0), r = E(() => e.value?.height ?? 0);
  return Re(() => {
    const i = $n(n);
    if (i) {
      e.value = {
        width: i.offsetWidth,
        height: i.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
        let l, c;
        if ("borderBoxSize" in a) {
          const u = a.borderBoxSize, d = Array.isArray(u) ? u[0] : u;
          l = d.inlineSize, c = d.blockSize;
        } else
          l = i.offsetWidth, c = i.offsetHeight;
        e.value = {
          width: l,
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
function Yv(n, e) {
  const t = _(n);
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
function Zv(n) {
  const e = Pv("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Ze(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = eb(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Qv(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function eb(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = Qv(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== t ? l : void 0;
}
function tb(n, e) {
  const t = _({}), r = _("none"), i = _(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? cl, { state: l, dispatch: c } = Yv(s, {
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
    if (un) {
      const y = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(y);
    }
  };
  Z(n, async (g, y) => {
    const b = y !== g;
    if (await xe(), b) {
      const v = r.value, w = _i(e.value);
      g ? (c("MOUNT"), u("enter"), w === "none" && u("after-enter")) : w === "none" || w === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : y && v !== w ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const y = _i(e.value), b = y.includes(CSS.escape(g.animationName)), v = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && b && (u(`after-${v}`), c("ANIMATION_END"), !i.value)) {
      const w = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = w);
      });
    }
    g.target === e.value && y === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = _i(e.value));
  }, h = Z(e, (g, y) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), y?.removeEventListener("animationstart", f), y?.removeEventListener("animationcancel", d), y?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = Z(l, () => {
    const g = _i(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return gr(() => {
    h(), p();
  }), { isPresent: E(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function _i(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Vs = $({
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
    const { present: r, forceMount: i } = yr(n), s = _(), { isPresent: o } = tb(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = al(a || []);
    const l = cn();
    if (a && a?.length > 1) {
      const c = l?.parent?.type.name ? `<${l.parent.type.name} />` : "component";
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
    return () => i.value || r.value || o.value ? Ge(e.default({ present: o.value })[0], { ref: (c) => {
      const u = $n(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const ua = $({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = al(t.default()), i = r.findIndex((l) => l.type !== Hg);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? ce(e, s.props) : e, a = Kg({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), nb = [
  "area",
  "img",
  "input"
], tt = $({
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
    return typeof r == "string" && nb.includes(r) ? () => Ge(r, e) : r !== "template" ? () => Ge(n.as, e, { default: t.default }) : () => Ge(ua, e, { default: t.default });
  }
});
function da() {
  const n = _(), e = E(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : $n(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [dn, rb] = kt("DialogRoot");
var ib = /* @__PURE__ */ $({
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
    const t = n, i = /* @__PURE__ */ gi(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = _(), o = _(), { modal: a } = yr(t);
    return rb({
      open: i,
      modal: a,
      openModal: () => {
        i.value = !0;
      },
      onOpenChange: (l) => {
        i.value = l;
      },
      onOpenToggle: () => {
        i.value = !i.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: o
    }), (l, c) => J(l.$slots, "default", {
      open: k(i),
      close: () => i.value = !1
    });
  }
}), sb = ib, ob = /* @__PURE__ */ $({
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
    he();
    const t = dn();
    return (r, i) => (T(), R(k(tt), ce(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => k(t).onOpenChange(!1))
    }), {
      default: N(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), ab = ob;
const lb = "dismissableLayer.pointerDownOutside", cb = "dismissableLayer.focusOutside";
function If(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function ub(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = _(!1), s = _(() => {
  });
  return at((o) => {
    if (!un || !Ye(t)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (If(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            Mf(lb, n, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (r.removeEventListener("click", s.value), s.value = f, r.addEventListener("click", s.value, { once: !0 })) : f();
        } else r.removeEventListener("click", s.value);
        i.value = !1;
      }
    }, l = window.setTimeout(() => {
      r.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(l), r.removeEventListener("pointerdown", a), r.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    Ye(t) && (i.value = !0);
  } };
}
function db(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = _(!1);
  return at((s) => {
    if (!un || !Ye(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await xe(), await xe();
      const l = a.target;
      !e.value || !l || If(e.value, l) || a.target && !i.value && Mf(cb, n, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Ye(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Ye(t) && (i.value = !1);
    }
  };
}
const lt = tl({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var fb = /* @__PURE__ */ $({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = he(), o = E(() => s.value?.ownerDocument ?? globalThis.document), a = E(() => lt.layersRoot), l = E(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = E(() => lt.layersWithOutsidePointerEventsDisabled.size > 0), u = E(() => {
      const h = Array.from(a.value), [p] = [...lt.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return l.value >= m;
    }), d = ub(async (h) => {
      const p = [...lt.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await xe(), h.defaultPrevented || r("dismiss"));
    }, s), f = db((h) => {
      [...lt.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return Bv("Escape", (h) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), at((h) => {
      s.value && (t.disableOutsidePointerEvents && (lt.layersWithOutsidePointerEventsDisabled.size === 0 && (lt.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), lt.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && lt.layersWithOutsidePointerEventsDisabled.size === 1 && !ls(lt.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = lt.originalBodyPointerEvents);
      }));
    }), at((h) => {
      h(() => {
        s.value && (a.value.delete(s.value), lt.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (T(), R(k(tt), {
      ref: k(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: Nn({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: k(f).onFocusCapture,
      onBlurCapture: k(f).onBlurCapture,
      onPointerdownCapture: k(d).onPointerDownCapture
    }, {
      default: N(() => [J(h.$slots, "default")]),
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
}), Nf = fb;
const hb = /* @__PURE__ */ Mv(() => _([]));
function pb() {
  const n = hb();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = Ic(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = Ic(n.value, e), n.value[0]?.resume();
    }
  };
}
function Ic(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const Mo = "focusScope.autoFocusOnMount", Ao = "focusScope.autoFocusOnUnmount", Nc = {
  bubbles: !1,
  cancelable: !0
};
function mb(n, { select: e = !1 } = {}) {
  const t = Ze();
  for (const r of n)
    if (Ht(r, { select: e }), Ze() !== t) return !0;
}
function gb(n) {
  const e = $f(n), t = $c(e, n), r = $c(e.reverse(), n);
  return [t, r];
}
function $f(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function $c(n, e) {
  for (const t of n) if (!yb(t, { upTo: e })) return t;
}
function yb(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function vb(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Ht(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Ze();
    n.focus({ preventScroll: !0 }), n !== t && vb(n) && e && n.select();
  }
}
var bb = /* @__PURE__ */ $({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = he(), o = _(null), a = pb(), l = tl({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    at((u) => {
      if (!un) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const y = g.target;
        d.contains(y) ? o.value = y : Ht(o.value, { select: !0 });
      }
      function h(g) {
        if (l.paused || !d) return;
        const y = g.relatedTarget;
        y !== null && (d.contains(y) || Ht(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || Ht(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", h);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", h), m.disconnect();
      });
    }), at(async (u) => {
      const d = s.value;
      if (await xe(), !d) return;
      a.add(l);
      const f = Ze();
      if (!d.contains(f)) {
        const p = new CustomEvent(Mo, Nc);
        d.addEventListener(Mo, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (mb($f(d), { select: !0 }), Ze() === f && Ht(d));
      }
      u(() => {
        d.removeEventListener(Mo, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(Ao, Nc), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(Ao, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Ht(f ?? document.body, { select: !0 }), d.removeEventListener(Ao, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = Ze();
      if (d && f) {
        const h = u.currentTarget, [p, m] = gb(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && Ht(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && Ht(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (T(), R(k(tt), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: N(() => [J(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Bf = bb;
const kb = "menu.itemSelect", fa = ["Enter", " "], wb = [
  "ArrowDown",
  "PageUp",
  "Home"
], Lf = [
  "ArrowUp",
  "PageDown",
  "End"
], xb = [...wb, ...Lf];
[...fa], [...fa];
function zf(n) {
  return n ? "open" : "closed";
}
function Sb(n) {
  const e = Ze();
  for (const t of n)
    if (t === e || (t.focus(), Ze() !== e)) return;
}
function Cb(n, e) {
  const { x: t, y: r } = n;
  let i = !1;
  for (let s = 0, o = e.length - 1; s < e.length; o = s++) {
    const a = e[s].x, l = e[s].y, c = e[o].x, u = e[o].y;
    l > r != u > r && t < (c - a) * (r - l) / (u - l) + a && (i = !i);
  }
  return i;
}
function Tb(n, e) {
  if (!e) return !1;
  const t = {
    x: n.clientX,
    y: n.clientY
  };
  return Cb(t, e);
}
function ha(n) {
  return n.pointerType === "mouse";
}
const Eb = "DialogTitle", Mb = "DialogContent";
function Ab({ titleName: n = Eb, contentName: e = Mb, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  Re(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(a));
  });
}
var Ob = /* @__PURE__ */ $({
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
    const t = n, r = e, i = dn(), { forwardRef: s, currentElement: o } = he();
    return i.titleId ||= Hr(void 0, "reka-dialog-title"), i.descriptionId ||= Hr(void 0, "reka-dialog-description"), Re(() => {
      i.contentElement = o, Ze() !== document.body && (i.triggerElement.value = Ze());
    }), process.env.NODE_ENV !== "production" && Ab({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, l) => (T(), R(k(Bf), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: N(() => [q(k(Nf), ce({
        id: k(i).contentId,
        ref: k(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": k(i).descriptionId,
        "aria-labelledby": k(i).titleId,
        "data-state": k(zf)(k(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => k(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: N(() => [J(a.$slots, "default")]),
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
}), Ff = Ob, Db = /* @__PURE__ */ $({
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
    const t = n, r = e, i = dn(), s = yi(r), { forwardRef: o, currentElement: a } = he();
    return Rf(a), (l, c) => (T(), R(Ff, ce({
      ...t,
      ...k(s)
    }, {
      ref: k(o),
      "trap-focus": k(i).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (u.preventDefault(), k(i).triggerElement.value?.focus());
      }),
      onPointerDownOutside: c[1] || (c[1] = (u) => {
        const d = u.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || f) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: N(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), _b = Db, Pb = /* @__PURE__ */ $({
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
    const t = n, i = yi(e);
    he();
    const s = dn(), o = _(!1), a = _(!1);
    return (l, c) => (T(), R(Ff, ce({
      ...t,
      ...k(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || k(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = u.target;
        k(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && a.value && u.preventDefault();
      })
    }), {
      default: N(() => [J(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Rb = Pb, Ib = /* @__PURE__ */ $({
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
    const t = n, r = e, i = dn(), s = yi(r), { forwardRef: o } = he();
    return (a, l) => (T(), R(k(Vs), { present: a.forceMount || k(i).open.value }, {
      default: N(() => [k(i).modal.value ? (T(), R(_b, ce({
        key: 0,
        ref: k(o)
      }, {
        ...t,
        ...k(s),
        ...a.$attrs
      }), {
        default: N(() => [J(a.$slots, "default")]),
        _: 3
      }, 16)) : (T(), R(Rb, ce({
        key: 1,
        ref: k(o)
      }, {
        ...t,
        ...k(s),
        ...a.$attrs
      }), {
        default: N(() => [J(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Nb = Ib, $b = /* @__PURE__ */ $({
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
    const e = dn();
    return _f(!0), he(), (t, r) => (T(), R(k(tt), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": k(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: N(() => [J(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Bb = $b, Lb = /* @__PURE__ */ $({
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
    const e = dn(), { forwardRef: t } = he();
    return (r, i) => k(e)?.modal.value ? (T(), R(k(Vs), {
      key: 0,
      present: r.forceMount || k(e).open.value
    }, {
      default: N(() => [q(Bb, ce(r.$attrs, {
        ref: k(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: N(() => [J(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : H("v-if", !0);
  }
}), zb = Lb, Fb = /* @__PURE__ */ $({
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
    const e = /* @__PURE__ */ Nv();
    return (t, r) => k(e) || t.forceMount ? (T(), R(Jg, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [J(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : H("v-if", !0);
  }
}), Vf = Fb, Vb = /* @__PURE__ */ $({
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
    return (t, r) => (T(), R(k(Vf), Mn(mi(e)), {
      default: N(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qb = Vb, Ub = /* @__PURE__ */ $({
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
    const e = n, t = dn();
    return he(), (r, i) => (T(), R(k(tt), ce(e, { id: k(t).titleId }), {
      default: N(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Wb = Ub;
const Bc = "data-reka-collection-item";
function dl(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = _(/* @__PURE__ */ new Map());
    i = {
      collectionRef: _(),
      itemMap: u
    }, En(r, i);
  } else i = pi(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Bc}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = $({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = da();
      return Z(p, () => {
        i.collectionRef.value = p.value;
      }), () => Ge(ua, {
        ref: h,
        ...f
      }, d);
    }
  }), a = $({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = da();
      return at((m) => {
        if (p.value) {
          const g = nl(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => Ge(ua, {
        ...f,
        [Bc]: "",
        ref: h
      }, d);
    }
  }), l = E(() => Array.from(i.itemMap.value.values())), c = E(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const jb = "rovingFocusGroup.onEntryFocus", Hb = {
  bubbles: !1,
  cancelable: !0
}, Kb = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Jb(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Xb(n, e, t) {
  const r = Jb(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Kb[r];
}
function qf(n, e = !1) {
  const t = Ze();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), Ze() !== t)) return;
}
function Gb(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [Yb, Zb] = kt("RovingFocusGroup");
var Qb = /* @__PURE__ */ $({
  __name: "RovingFocusGroup",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: void 0
    },
    dir: {
      type: String,
      required: !1
    },
    loop: {
      type: Boolean,
      required: !1,
      default: !1
    },
    currentTabStopId: {
      type: [String, null],
      required: !1
    },
    defaultCurrentTabStopId: {
      type: String,
      required: !1
    },
    preventScrollOnEntryFocus: {
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
  emits: ["entryFocus", "update:currentTabStopId"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, { loop: s, orientation: o, dir: a } = yr(r), l = ul(a), c = /* @__PURE__ */ gi(r, "currentTabStopId", i, {
      defaultValue: r.defaultCurrentTabStopId,
      passive: r.currentTabStopId === void 0
    }), u = _(!1), d = _(!1), f = _(0), { getItems: h, CollectionSlot: p } = dl({ isProvider: !0 });
    function m(y) {
      const b = !d.value;
      if (y.currentTarget && y.target === y.currentTarget && b && !u.value) {
        const v = new CustomEvent(jb, Hb);
        if (y.currentTarget.dispatchEvent(v), i("entryFocus", v), !v.defaultPrevented) {
          const w = h().map((S) => S.ref).filter((S) => S.dataset.disabled !== ""), C = w.find((S) => S.getAttribute("data-active") === ""), M = w.find((S) => S.getAttribute("data-highlighted") === ""), x = w.find((S) => S.id === c.value), A = [
            C,
            M,
            x,
            ...w
          ].filter(Boolean);
          qf(A, r.preventScrollOnEntryFocus);
        }
      }
      d.value = !1;
    }
    function g() {
      setTimeout(() => {
        d.value = !1;
      }, 1);
    }
    return e({ getItems: h }), Zb({
      loop: s,
      dir: l,
      orientation: o,
      currentTabStopId: c,
      onItemFocus: (y) => {
        c.value = y;
      },
      onItemShiftTab: () => {
        u.value = !0;
      },
      onFocusableItemAdd: () => {
        f.value++;
      },
      onFocusableItemRemove: () => {
        f.value--;
      }
    }), (y, b) => (T(), R(k(p), null, {
      default: N(() => [q(k(tt), {
        tabindex: u.value || f.value === 0 ? -1 : 0,
        "data-orientation": k(o),
        as: y.as,
        "as-child": y.asChild,
        dir: k(l),
        style: { outline: "none" },
        onMousedown: b[0] || (b[0] = (v) => d.value = !0),
        onMouseup: g,
        onFocus: m,
        onBlur: b[1] || (b[1] = (v) => u.value = !1)
      }, {
        default: N(() => [J(y.$slots, "default")]),
        _: 3
      }, 8, [
        "tabindex",
        "data-orientation",
        "as",
        "as-child",
        "dir"
      ])]),
      _: 3
    }));
  }
}), e0 = Qb, t0 = /* @__PURE__ */ $({
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
    const e = n, t = Yb(), r = Hr(), i = E(() => e.tabStopId || r), s = E(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = dl();
    Re(() => {
      e.focusable && t.onFocusableItemAdd();
    }), gr(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function l(c) {
      if (c.key === "Tab" && c.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const u = Xb(c, t.orientation.value, t.dir.value);
      if (u !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !e.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let d = [...o().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (u === "last") d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const f = d.indexOf(c.currentTarget);
          d = t.loop.value ? Gb(d, f + 1) : d.slice(f + 1);
        }
        xe(() => qf(d));
      }
    }
    return (c, u) => (T(), R(k(a), null, {
      default: N(() => [q(k(tt), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": k(t).orientation.value,
        "data-active": c.active ? "" : void 0,
        "data-disabled": c.focusable ? void 0 : "",
        as: c.as,
        "as-child": c.asChild,
        onMousedown: u[0] || (u[0] = (d) => {
          c.focusable ? k(t).onItemFocus(i.value) : d.preventDefault();
        }),
        onFocus: u[1] || (u[1] = (d) => k(t).onItemFocus(i.value)),
        onKeydown: l
      }, {
        default: N(() => [J(c.$slots, "default")]),
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
}), n0 = t0, r0 = /* @__PURE__ */ $({
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
    return (e, t) => (T(), R(k(tt), {
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
      default: N(() => [J(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), i0 = r0, s0 = /* @__PURE__ */ $({
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
    const e = n, { primitiveElement: t, currentElement: r } = da(), i = E(() => e.checked ?? e.value);
    return Z(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (T(), R(i0, ce({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Lc = s0, o0 = /* @__PURE__ */ $({
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
    const e = n, t = E(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = E(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((i, s) => typeof i == "object" ? Object.entries(i).map(([o, a]) => ({
      name: `${e.name}[${s}][${o}]`,
      value: a
    })) : {
      name: `${e.name}[${s}]`,
      value: i
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([i, s]) => ({
      name: `${e.name}[${i}]`,
      value: s
    })) : []);
    return (i, s) => (T(), B(Pe, null, [H(" We render single input if it's required "), t.value ? (T(), R(Lc, ce({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (T(!0), B(Pe, { key: 1 }, yt(r.value, (o) => (T(), R(Lc, ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), a0 = o0;
const [l0] = kt("CheckboxGroupRoot");
function cs(n) {
  return n === "indeterminate";
}
function Uf(n) {
  return cs(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [c0, u0] = kt("CheckboxRoot");
var d0 = /* @__PURE__ */ $({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = he(), o = l0(null), a = /* @__PURE__ */ gi(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), l = E(() => o?.disabled.value || t.disabled), c = E(() => ls(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : Pc(o.modelValue.value, t.value));
    function u() {
      if (ls(o?.modelValue.value))
        a.value = cs(a.value) ? !0 : !a.value;
      else {
        const h = [...o.modelValue.value || []];
        if (Pc(h, t.value)) {
          const p = h.findIndex((m) => aa(m, t.value));
          h.splice(p, 1);
        } else h.push(t.value);
        o.modelValue.value = h;
      }
    }
    const d = Uv(s), f = E(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return u0({
      disabled: l,
      state: c
    }), (h, p) => (T(), R(Xd(k(o)?.rovingFocus.value ? k(n0) : k(tt)), ce(h.$attrs, {
      id: h.id,
      ref: k(i),
      role: "checkbox",
      "as-child": h.asChild,
      as: h.as,
      type: h.as === "button" ? "button" : void 0,
      "aria-checked": k(cs)(c.value) ? "mixed" : c.value,
      "aria-required": h.required,
      "aria-label": h.$attrs["aria-label"] || f.value,
      "data-state": k(Uf)(c.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: k(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: nf(sn(() => {
      }, ["prevent"]), ["enter"]),
      onClick: u
    }), {
      default: N(() => [J(h.$slots, "default", {
        modelValue: k(a),
        state: c.value
      }), k(d) && h.name && !k(o) ? (T(), R(k(a0), {
        key: 0,
        type: "checkbox",
        checked: !!c.value,
        name: h.name,
        value: h.value,
        disabled: l.value,
        required: h.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : H("v-if", !0)]),
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
}), f0 = d0, h0 = /* @__PURE__ */ $({
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
    const { forwardRef: e } = he(), t = c0();
    return (r, i) => (T(), R(k(Vs), { present: r.forceMount || k(cs)(k(t).state.value) || k(t).state.value === !0 }, {
      default: N(() => [q(k(tt), ce({
        ref: k(e),
        "data-state": k(Uf)(k(t).state.value),
        "data-disabled": k(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: N(() => [J(r.$slots, "default")]),
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
}), p0 = h0;
const [Wf, m0] = kt("PopperRoot");
var g0 = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = _();
    return m0({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => J(t.$slots, "default");
  }
}), y0 = g0, v0 = /* @__PURE__ */ $({
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
    const e = n, { forwardRef: t, currentElement: r } = he(), i = Wf();
    return rf(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (T(), R(k(tt), {
      ref: k(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: N(() => [J(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), b0 = v0;
function k0(n) {
  return n !== null;
}
function w0(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [c, u] = pa(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], f = (i.arrow?.x ?? 0) + a / 2, h = (i.arrow?.y ?? 0) + l / 2;
      let p = "", m = "";
      return c === "bottom" ? (p = o ? d : `${f}px`, m = `${-l}px`) : c === "top" ? (p = o ? d : `${f}px`, m = `${r.floating.height + l}px`) : c === "right" ? (p = `${-l}px`, m = o ? d : `${h}px`) : c === "left" && (p = `${r.floating.width + l}px`, m = o ? d : `${h}px`), { data: {
        x: p,
        y: m
      } };
    }
  };
}
function pa(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const x0 = ["top", "right", "bottom", "left"], on = Math.min, it = Math.max, us = Math.round, Pi = Math.floor, Ct = (n) => ({
  x: n,
  y: n
}), S0 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, C0 = {
  start: "end",
  end: "start"
};
function ma(n, e, t) {
  return it(n, on(e, t));
}
function Ft(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Vt(n) {
  return n.split("-")[0];
}
function vr(n) {
  return n.split("-")[1];
}
function fl(n) {
  return n === "x" ? "y" : "x";
}
function hl(n) {
  return n === "y" ? "height" : "width";
}
const T0 = /* @__PURE__ */ new Set(["top", "bottom"]);
function St(n) {
  return T0.has(Vt(n)) ? "y" : "x";
}
function pl(n) {
  return fl(St(n));
}
function E0(n, e, t) {
  t === void 0 && (t = !1);
  const r = vr(n), i = pl(n), s = hl(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = ds(o)), [o, ds(o)];
}
function M0(n) {
  const e = ds(n);
  return [ga(n), e, ga(e)];
}
function ga(n) {
  return n.replace(/start|end/g, (e) => C0[e]);
}
const zc = ["left", "right"], Fc = ["right", "left"], A0 = ["top", "bottom"], O0 = ["bottom", "top"];
function D0(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? Fc : zc : e ? zc : Fc;
    case "left":
    case "right":
      return e ? A0 : O0;
    default:
      return [];
  }
}
function _0(n, e, t, r) {
  const i = vr(n);
  let s = D0(Vt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(ga)))), s;
}
function ds(n) {
  return n.replace(/left|right|bottom|top/g, (e) => S0[e]);
}
function P0(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function jf(n) {
  return typeof n != "number" ? P0(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function fs(n) {
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
function Vc(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = St(e), o = pl(e), a = hl(o), l = Vt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
  let h;
  switch (l) {
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
  switch (vr(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function R0(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
    platform: s,
    rects: o,
    elements: a,
    strategy: l
  } = n, {
    boundary: c = "clippingAncestors",
    rootBoundary: u = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: h = 0
  } = Ft(e, n), p = jf(h), g = a[f ? d === "floating" ? "reference" : "floating" : d], y = fs(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), b = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, v = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), w = await (s.isElement == null ? void 0 : s.isElement(v)) ? await (s.getScale == null ? void 0 : s.getScale(v)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = fs(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: v,
    strategy: l
  }) : b);
  return {
    top: (y.top - C.top + p.top) / w.y,
    bottom: (C.bottom - y.bottom + p.bottom) / w.y,
    left: (y.left - C.left + p.left) / w.x,
    right: (C.right - y.right + p.right) / w.x
  };
}
const I0 = async (n, e, t) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = t, a = s.filter(Boolean), l = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let c = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: i
  }), {
    x: u,
    y: d
  } = Vc(c, r, l), f = r, h = {}, p = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: y,
      fn: b
    } = a[g], {
      x: v,
      y: w,
      data: C,
      reset: M
    } = await b({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: h,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : R0
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = v ?? u, d = w ?? d, h = {
      ...h,
      [y]: {
        ...h[y],
        ...C
      }
    }, M && p <= 50 && (p++, typeof M == "object" && (M.placement && (f = M.placement), M.rects && (c = M.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : M.rects), {
      x: u,
      y: d
    } = Vc(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, N0 = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: r,
      placement: i,
      rects: s,
      platform: o,
      elements: a,
      middlewareData: l
    } = e, {
      element: c,
      padding: u = 0
    } = Ft(n, e) || {};
    if (c == null)
      return {};
    const d = jf(u), f = {
      x: t,
      y: r
    }, h = pl(i), p = hl(h), m = await o.getDimensions(c), g = h === "y", y = g ? "top" : "left", b = g ? "bottom" : "right", v = g ? "clientHeight" : "clientWidth", w = s.reference[p] + s.reference[h] - f[h] - s.floating[p], C = f[h] - s.reference[h], M = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let x = M ? M[v] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(M))) && (x = a.floating[v] || s.floating[p]);
    const A = w / 2 - C / 2, S = x / 2 - m[p] / 2 - 1, O = on(d[y], S), D = on(d[b], S), I = O, F = x - m[p] - D, L = x / 2 - m[p] / 2 + A, G = ma(I, L, F), ae = !l.arrow && vr(i) != null && L !== G && s.reference[p] / 2 - (L < I ? O : D) - m[p] / 2 < 0, re = ae ? L < I ? L - I : L - F : 0;
    return {
      [h]: f[h] + re,
      data: {
        [h]: G,
        centerOffset: L - G - re,
        ...ae && {
          alignmentOffset: re
        }
      },
      reset: ae
    };
  }
}), $0 = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, r;
      const {
        placement: i,
        middlewareData: s,
        rects: o,
        initialPlacement: a,
        platform: l,
        elements: c
      } = e, {
        mainAxis: u = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: m = !0,
        ...g
      } = Ft(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const y = Vt(i), b = St(a), v = Vt(a) === a, w = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), C = f || (v || !m ? [ds(a)] : M0(a)), M = p !== "none";
      !f && M && C.push(..._0(a, m, p, w));
      const x = [a, ...C], A = await l.detectOverflow(e, g), S = [];
      let O = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && S.push(A[y]), d) {
        const L = E0(i, o, w);
        S.push(A[L[0]], A[L[1]]);
      }
      if (O = [...O, {
        placement: i,
        overflows: S
      }], !S.every((L) => L <= 0)) {
        var D, I;
        const L = (((D = s.flip) == null ? void 0 : D.index) || 0) + 1, G = x[L];
        if (G && (!(d === "alignment" ? b !== St(G) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        O.every((ue) => St(ue.placement) === b ? ue.overflows[0] > 0 : !0)))
          return {
            data: {
              index: L,
              overflows: O
            },
            reset: {
              placement: G
            }
          };
        let ae = (I = O.filter((re) => re.overflows[0] <= 0).sort((re, ue) => re.overflows[1] - ue.overflows[1])[0]) == null ? void 0 : I.placement;
        if (!ae)
          switch (h) {
            case "bestFit": {
              var F;
              const re = (F = O.filter((ue) => {
                if (M) {
                  const ve = St(ue.placement);
                  return ve === b || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ve === "y";
                }
                return !0;
              }).map((ue) => [ue.placement, ue.overflows.filter((ve) => ve > 0).reduce((ve, Dt) => ve + Dt, 0)]).sort((ue, ve) => ue[1] - ve[1])[0]) == null ? void 0 : F[0];
              re && (ae = re);
              break;
            }
            case "initialPlacement":
              ae = a;
              break;
          }
        if (i !== ae)
          return {
            reset: {
              placement: ae
            }
          };
      }
      return {};
    }
  };
};
function qc(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Uc(n) {
  return x0.some((e) => n[e] >= 0);
}
const B0 = function(n) {
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
      } = Ft(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = qc(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Uc(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = qc(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Uc(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Hf = /* @__PURE__ */ new Set(["left", "top"]);
async function L0(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Vt(t), a = vr(t), l = St(t) === "y", c = Hf.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Ft(e, n);
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
  return a && typeof p == "number" && (h = a === "end" ? p * -1 : p), l ? {
    x: h * u,
    y: f * c
  } : {
    x: f * c,
    y: h * u
  };
}
const z0 = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, r;
      const {
        x: i,
        y: s,
        placement: o,
        middlewareData: a
      } = e, l = await L0(e, n);
      return o === ((t = a.offset) == null ? void 0 : t.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + l.x,
        y: s + l.y,
        data: {
          ...l,
          placement: o
        }
      };
    }
  };
}, F0 = function(n) {
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
        crossAxis: a = !1,
        limiter: l = {
          fn: (y) => {
            let {
              x: b,
              y: v
            } = y;
            return {
              x: b,
              y: v
            };
          }
        },
        ...c
      } = Ft(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = St(Vt(i)), h = fl(f);
      let p = u[h], m = u[f];
      if (o) {
        const y = h === "y" ? "top" : "left", b = h === "y" ? "bottom" : "right", v = p + d[y], w = p - d[b];
        p = ma(v, p, w);
      }
      if (a) {
        const y = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", v = m + d[y], w = m - d[b];
        m = ma(v, m, w);
      }
      const g = l.fn({
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
            [f]: a
          }
        }
      };
    }
  };
}, V0 = function(n) {
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
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: c = !0
      } = Ft(n, e), u = {
        x: t,
        y: r
      }, d = St(i), f = fl(d);
      let h = u[f], p = u[d];
      const m = Ft(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const v = f === "y" ? "height" : "width", w = s.reference[f] - s.floating[v] + g.mainAxis, C = s.reference[f] + s.reference[v] - g.mainAxis;
        h < w ? h = w : h > C && (h = C);
      }
      if (c) {
        var y, b;
        const v = f === "y" ? "width" : "height", w = Hf.has(Vt(i)), C = s.reference[d] - s.floating[v] + (w && ((y = o.offset) == null ? void 0 : y[d]) || 0) + (w ? 0 : g.crossAxis), M = s.reference[d] + s.reference[v] + (w ? 0 : ((b = o.offset) == null ? void 0 : b[d]) || 0) - (w ? g.crossAxis : 0);
        p < C ? p = C : p > M && (p = M);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, q0 = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, r;
      const {
        placement: i,
        rects: s,
        platform: o,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...c
      } = Ft(n, e), u = await o.detectOverflow(e, c), d = Vt(i), f = vr(i), h = St(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, y;
      d === "top" || d === "bottom" ? (g = d, y = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (y = d, g = f === "end" ? "top" : "bottom");
      const b = m - u.top - u.bottom, v = p - u.left - u.right, w = on(m - u[g], b), C = on(p - u[y], v), M = !e.middlewareData.shift;
      let x = w, A = C;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (A = v), (r = e.middlewareData.shift) != null && r.enabled.y && (x = b), M && !f) {
        const O = it(u.left, 0), D = it(u.right, 0), I = it(u.top, 0), F = it(u.bottom, 0);
        h ? A = p - 2 * (O !== 0 || D !== 0 ? O + D : it(u.left, u.right)) : x = m - 2 * (I !== 0 || F !== 0 ? I + F : it(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: A,
        availableHeight: x
      });
      const S = await o.getDimensions(a.floating);
      return p !== S.width || m !== S.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function qs() {
  return typeof window < "u";
}
function Bn(n) {
  return ml(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function ot(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ot(n) {
  var e;
  return (e = (ml(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function ml(n) {
  return qs() ? n instanceof Node || n instanceof ot(n).Node : !1;
}
function vt(n) {
  return qs() ? n instanceof Element || n instanceof ot(n).Element : !1;
}
function Et(n) {
  return qs() ? n instanceof HTMLElement || n instanceof ot(n).HTMLElement : !1;
}
function Wc(n) {
  return !qs() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof ot(n).ShadowRoot;
}
const U0 = /* @__PURE__ */ new Set(["inline", "contents"]);
function vi(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = bt(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !U0.has(i);
}
const W0 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function j0(n) {
  return W0.has(Bn(n));
}
const H0 = [":popover-open", ":modal"];
function Us(n) {
  return H0.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const K0 = ["transform", "translate", "scale", "rotate", "perspective"], J0 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], X0 = ["paint", "layout", "strict", "content"];
function gl(n) {
  const e = yl(), t = vt(n) ? bt(n) : n;
  return K0.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || J0.some((r) => (t.willChange || "").includes(r)) || X0.some((r) => (t.contain || "").includes(r));
}
function G0(n) {
  let e = an(n);
  for (; Et(e) && !or(e); ) {
    if (gl(e))
      return e;
    if (Us(e))
      return null;
    e = an(e);
  }
  return null;
}
function yl() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Y0 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function or(n) {
  return Y0.has(Bn(n));
}
function bt(n) {
  return ot(n).getComputedStyle(n);
}
function Ws(n) {
  return vt(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function an(n) {
  if (Bn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Wc(n) && n.host || // Fallback.
    Ot(n)
  );
  return Wc(e) ? e.host : e;
}
function Kf(n) {
  const e = an(n);
  return or(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Et(e) && vi(e) ? e : Kf(e);
}
function Kr(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = Kf(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = ot(i);
  if (s) {
    const a = ya(o);
    return e.concat(o, o.visualViewport || [], vi(i) ? i : [], a && t ? Kr(a) : []);
  }
  return e.concat(i, Kr(i, [], t));
}
function ya(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Jf(n) {
  const e = bt(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = Et(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = us(t) !== s || us(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function vl(n) {
  return vt(n) ? n : n.contextElement;
}
function er(n) {
  const e = vl(n);
  if (!Et(e))
    return Ct(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Jf(e);
  let o = (s ? us(t.width) : t.width) / r, a = (s ? us(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Z0 = /* @__PURE__ */ Ct(0);
function Xf(n) {
  const e = ot(n);
  return !yl() || !e.visualViewport ? Z0 : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Q0(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== ot(n) ? !1 : e;
}
function An(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = vl(n);
  let o = Ct(1);
  e && (r ? vt(r) && (o = er(r)) : o = er(n));
  const a = Q0(s, t, r) ? Xf(s) : Ct(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = ot(s), h = r && vt(r) ? ot(r) : r;
    let p = f, m = ya(p);
    for (; m && r && h !== p; ) {
      const g = er(m), y = m.getBoundingClientRect(), b = bt(m), v = y.left + (m.clientLeft + parseFloat(b.paddingLeft)) * g.x, w = y.top + (m.clientTop + parseFloat(b.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += v, c += w, p = ot(m), m = ya(p);
    }
  }
  return fs({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function js(n, e) {
  const t = Ws(n).scrollLeft;
  return e ? e.left + t : An(Ot(n)).left + t;
}
function Gf(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - js(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function ek(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Ot(r), a = e ? Us(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = Ct(1);
  const u = Ct(0), d = Et(r);
  if ((d || !d && !s) && ((Bn(r) !== "body" || vi(o)) && (l = Ws(r)), Et(r))) {
    const h = An(r);
    c = er(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? Gf(o, l) : Ct(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function tk(n) {
  return Array.from(n.getClientRects());
}
function nk(n) {
  const e = Ot(n), t = Ws(n), r = n.ownerDocument.body, i = it(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = it(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + js(n);
  const a = -t.scrollTop;
  return bt(r).direction === "rtl" && (o += it(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const jc = 25;
function rk(n, e) {
  const t = ot(n), r = Ot(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = yl();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = js(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= jc && (s -= p);
  } else c <= jc && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const ik = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function sk(n, e) {
  const t = An(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = Et(n) ? er(n) : Ct(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Hc(n, e, t) {
  let r;
  if (e === "viewport")
    r = rk(n, t);
  else if (e === "document")
    r = nk(Ot(n));
  else if (vt(e))
    r = sk(e, t);
  else {
    const i = Xf(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return fs(r);
}
function Yf(n, e) {
  const t = an(n);
  return t === e || !vt(t) || or(t) ? !1 : bt(t).position === "fixed" || Yf(t, e);
}
function ok(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Kr(n, [], !1).filter((a) => vt(a) && Bn(a) !== "body"), i = null;
  const s = bt(n).position === "fixed";
  let o = s ? an(n) : n;
  for (; vt(o) && !or(o); ) {
    const a = bt(o), l = gl(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && ik.has(i.position) || vi(o) && !l && Yf(n, o)) ? r = r.filter((u) => u !== o) : i = a, o = an(o);
  }
  return e.set(n, r), r;
}
function ak(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Us(e) ? [] : ok(e, this._c) : [].concat(t), r], a = o[0], l = o.reduce((c, u) => {
    const d = Hc(e, u, i);
    return c.top = it(d.top, c.top), c.right = on(d.right, c.right), c.bottom = on(d.bottom, c.bottom), c.left = it(d.left, c.left), c;
  }, Hc(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function lk(n) {
  const {
    width: e,
    height: t
  } = Jf(n);
  return {
    width: e,
    height: t
  };
}
function ck(n, e, t) {
  const r = Et(e), i = Ot(e), s = t === "fixed", o = An(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Ct(0);
  function c() {
    l.x = js(i);
  }
  if (r || !r && !s)
    if ((Bn(e) !== "body" || vi(i)) && (a = Ws(e)), r) {
      const h = An(e, !0, s, e);
      l.x = h.x + e.clientLeft, l.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? Gf(i, a) : Ct(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Oo(n) {
  return bt(n).position === "static";
}
function Kc(n, e) {
  if (!Et(n) || bt(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Ot(n) === t && (t = t.ownerDocument.body), t;
}
function Zf(n, e) {
  const t = ot(n);
  if (Us(n))
    return t;
  if (!Et(n)) {
    let i = an(n);
    for (; i && !or(i); ) {
      if (vt(i) && !Oo(i))
        return i;
      i = an(i);
    }
    return t;
  }
  let r = Kc(n, e);
  for (; r && j0(r) && Oo(r); )
    r = Kc(r, e);
  return r && or(r) && Oo(r) && !gl(r) ? t : r || G0(n) || t;
}
const uk = async function(n) {
  const e = this.getOffsetParent || Zf, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: ck(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function dk(n) {
  return bt(n).direction === "rtl";
}
const fk = {
  convertOffsetParentRelativeRectToViewportRelativeRect: ek,
  getDocumentElement: Ot,
  getClippingRect: ak,
  getOffsetParent: Zf,
  getElementRects: uk,
  getClientRects: tk,
  getDimensions: lk,
  getScale: er,
  isElement: vt,
  isRTL: dk
};
function Qf(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function hk(n, e) {
  let t = null, r;
  const i = Ot(n);
  function s() {
    var a;
    clearTimeout(r), (a = t) == null || a.disconnect(), t = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = n.getBoundingClientRect(), {
      left: u,
      top: d,
      width: f,
      height: h
    } = c;
    if (a || e(), !f || !h)
      return;
    const p = Pi(d), m = Pi(i.clientWidth - (u + f)), g = Pi(i.clientHeight - (d + h)), y = Pi(u), v = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -y + "px",
      threshold: it(0, on(1, l)) || 1
    };
    let w = !0;
    function C(M) {
      const x = M[0].intersectionRatio;
      if (x !== l) {
        if (!w)
          return o();
        x ? o(!1, x) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !Qf(c, n.getBoundingClientRect()) && o(), w = !1;
    }
    try {
      t = new IntersectionObserver(C, {
        ...v,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(C, v);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function pk(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = vl(n), u = i || s ? [...c ? Kr(c) : [], ...Kr(e)] : [];
  u.forEach((y) => {
    i && y.addEventListener("scroll", t, {
      passive: !0
    }), s && y.addEventListener("resize", t);
  });
  const d = c && a ? hk(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((y) => {
    let [b] = y;
    b && b.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var v;
      (v = h) == null || v.observe(e);
    })), t();
  }), c && !l && h.observe(c), h.observe(e));
  let p, m = l ? An(n) : null;
  l && g();
  function g() {
    const y = An(n);
    m && !Qf(m, y) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    u.forEach((b) => {
      i && b.removeEventListener("scroll", t), s && b.removeEventListener("resize", t);
    }), d?.(), (y = h) == null || y.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const mk = z0, gk = F0, Jc = $0, yk = q0, vk = B0, bk = N0, kk = V0, wk = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: fk,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return I0(n, e, {
    ...i,
    platform: s
  });
};
function xk(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function va(n) {
  if (xk(n)) {
    const e = n.$el;
    return ml(e) && Bn(e) === "#comment" ? null : e;
  }
  return n;
}
function Xn(n) {
  return typeof n == "function" ? n() : k(n);
}
function Sk(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = va(Xn(n.element));
      return t == null ? {} : bk({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function eh(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Xc(n, e) {
  const t = eh(n);
  return Math.round(e * t) / t;
}
function Ck(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = E(() => {
    var x;
    return (x = Xn(t.open)) != null ? x : !0;
  }), s = E(() => Xn(t.middleware)), o = E(() => {
    var x;
    return (x = Xn(t.placement)) != null ? x : "bottom";
  }), a = E(() => {
    var x;
    return (x = Xn(t.strategy)) != null ? x : "absolute";
  }), l = E(() => {
    var x;
    return (x = Xn(t.transform)) != null ? x : !0;
  }), c = E(() => va(n.value)), u = E(() => va(e.value)), d = _(0), f = _(0), h = _(a.value), p = _(o.value), m = Lt({}), g = _(!1), y = E(() => {
    const x = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return x;
    const A = Xc(u.value, d.value), S = Xc(u.value, f.value);
    return l.value ? {
      ...x,
      transform: "translate(" + A + "px, " + S + "px)",
      ...eh(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: A + "px",
      top: S + "px"
    };
  });
  let b;
  function v() {
    if (c.value == null || u.value == null)
      return;
    const x = i.value;
    wk(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((A) => {
      d.value = A.x, f.value = A.y, h.value = A.strategy, p.value = A.placement, m.value = A.middlewareData, g.value = x !== !1;
    });
  }
  function w() {
    typeof b == "function" && (b(), b = void 0);
  }
  function C() {
    if (w(), r === void 0) {
      v();
      return;
    }
    if (c.value != null && u.value != null) {
      b = r(c.value, u.value, v);
      return;
    }
  }
  function M() {
    i.value || (g.value = !1);
  }
  return Z([s, o, a, i], v, {
    flush: "sync"
  }), Z([c, u], C, {
    flush: "sync"
  }), Z(i, M, {
    flush: "sync"
  }), Yd() && Zd(w), {
    x: qn(d),
    y: qn(f),
    strategy: qn(h),
    placement: qn(p),
    middlewareData: qn(m),
    isPositioned: qn(g),
    floatingStyles: y,
    update: v
  };
}
const th = {
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
}, [dR, Tk] = kt("PopperContent");
var Ek = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ sf({
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
  }, { ...th }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Wf(), { forwardRef: s, currentElement: o } = he(), a = _(), l = _(), { width: c, height: u } = Gv(l), d = E(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = E(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = E(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = E(() => ({
      padding: f.value,
      boundary: h.value.filter(k0),
      altBoundary: h.value.length > 0
    })), m = E(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = Ev(() => [
      mk({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Jc({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && gk({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? kk() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Jc({
        ...p.value,
        ...m.value
      }),
      yk({
        ...p.value,
        apply: ({ elements: I, rects: F, availableWidth: L, availableHeight: G }) => {
          const { width: ae, height: re } = F.reference, ue = I.floating.style;
          ue.setProperty("--reka-popper-available-width", `${L}px`), ue.setProperty("--reka-popper-available-height", `${G}px`), ue.setProperty("--reka-popper-anchor-width", `${ae}px`), ue.setProperty("--reka-popper-anchor-height", `${re}px`);
        }
      }),
      l.value && Sk({
        element: l.value,
        padding: t.arrowPadding
      }),
      w0({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && vk({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), y = E(() => t.reference ?? i.anchor.value), { floatingStyles: b, placement: v, isPositioned: w, middlewareData: C } = Ck(y, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...I) => pk(...I, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), M = E(() => pa(v.value)[0]), x = E(() => pa(v.value)[1]);
    rf(() => {
      w.value && r("placed");
    });
    const A = E(() => {
      const I = C.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && I;
    }), S = _("");
    at(() => {
      o.value && (S.value = window.getComputedStyle(o.value).zIndex);
    });
    const O = E(() => C.value.arrow?.x ?? 0), D = E(() => C.value.arrow?.y ?? 0);
    return Tk({
      placedSide: M,
      onArrowChange: (I) => l.value = I,
      arrowX: O,
      arrowY: D,
      shouldHideArrow: A
    }), (I, F) => (T(), B("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Nn({
        ...k(b),
        transform: k(w) ? k(b).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: S.value,
        "--reka-popper-transform-origin": [k(C).transformOrigin?.x, k(C).transformOrigin?.y].join(" "),
        ...k(C).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(k(tt), ce({ ref: k(s) }, I.$attrs, {
      "as-child": t.asChild,
      as: I.as,
      "data-side": M.value,
      "data-align": x.value,
      style: { animation: k(w) ? void 0 : "none" }
    }), {
      default: N(() => [J(I.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Mk = Ek, Ak = /* @__PURE__ */ $({
  __name: "MenuAnchor",
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
    const e = n;
    return (t, r) => (T(), R(k(b0), Mn(mi(e)), {
      default: N(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ok = Ak;
function Dk() {
  const n = _(!1);
  return Re(() => {
    la("keydown", () => {
      n.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), la(["pointerdown", "pointermove"], () => {
      n.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), n;
}
const _k = /* @__PURE__ */ Df(Dk), [Hs, Pk] = kt(["MenuRoot", "MenuSub"], "MenuContext"), [bl, Rk] = kt("MenuRoot");
var Ik = /* @__PURE__ */ $({
  __name: "MenuRoot",
  props: {
    open: {
      type: Boolean,
      required: !1,
      default: !1
    },
    dir: {
      type: String,
      required: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, { modal: i, dir: s } = yr(t), o = ul(s), a = /* @__PURE__ */ gi(t, "open", r), l = _(), c = _k();
    return Pk({
      open: a,
      onOpenChange: (u) => {
        a.value = u;
      },
      content: l,
      onContentChange: (u) => {
        l.value = u;
      }
    }), Rk({
      onClose: () => {
        a.value = !1;
      },
      isUsingKeyboardRef: c,
      dir: o,
      modal: i
    }), (u, d) => (T(), R(k(y0), null, {
      default: N(() => [J(u.$slots, "default")]),
      _: 3
    }));
  }
}), Nk = Ik;
const [nh, $k] = kt("MenuContent");
var Bk = /* @__PURE__ */ $({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ sf({
    loop: {
      type: Boolean,
      required: !1
    },
    disableOutsidePointerEvents: {
      type: Boolean,
      required: !1
    },
    disableOutsideScroll: {
      type: Boolean,
      required: !1
    },
    trapFocus: {
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
    }
  }, { ...th }),
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus",
    "dismiss"
  ],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Hs(), s = bl(), { trapFocus: o, disableOutsidePointerEvents: a, loop: l } = yr(t);
    qv(), _f(a.value);
    const c = _(""), u = _(0), d = _(0), f = _(null), h = _("right"), p = _(0), m = _(null), g = _(), { forwardRef: y, currentElement: b } = he(), { handleTypeaheadSearch: v } = Zv();
    Z(b, (S) => {
      i.onContentChange(S);
    }), gr(() => {
      window.clearTimeout(u.value);
    });
    function w(S) {
      return h.value === f.value?.side && Tb(S, f.value?.area);
    }
    async function C(S) {
      r("openAutoFocus", S), !S.defaultPrevented && (S.preventDefault(), b.value?.focus({ preventScroll: !0 }));
    }
    function M(S) {
      if (S.defaultPrevented) return;
      const D = S.target.closest("[data-reka-menu-content]") === S.currentTarget, I = S.ctrlKey || S.altKey || S.metaKey, F = S.key.length === 1, L = Tv(S, Ze(), b.value, {
        loop: l.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (L) return L?.focus();
      if (S.code === "Space") return;
      const G = g.value?.getItems() ?? [];
      if (D && (S.key === "Tab" && S.preventDefault(), !I && F && v(S.key, G)), S.target !== b.value || !xb.includes(S.key)) return;
      S.preventDefault();
      const ae = [...G.map((re) => re.ref)];
      Lf.includes(S.key) && ae.reverse(), Sb(ae);
    }
    function x(S) {
      S?.currentTarget?.contains?.(S.target) || (window.clearTimeout(u.value), c.value = "");
    }
    function A(S) {
      if (!ha(S)) return;
      const O = S.target, D = p.value !== S.clientX;
      if (S?.currentTarget?.contains(O) && D) {
        const I = S.clientX > p.value ? "right" : "left";
        h.value = I, p.value = S.clientX;
      }
    }
    return $k({
      onItemEnter: (S) => !!w(S),
      onItemLeave: (S) => {
        w(S) || (b.value?.focus(), m.value = null);
      },
      onTriggerLeave: (S) => !!w(S),
      searchRef: c,
      pointerGraceTimerRef: d,
      onPointerGraceIntentChange: (S) => {
        f.value = S;
      }
    }), (S, O) => (T(), R(k(Bf), {
      "as-child": "",
      trapped: k(o),
      onMountAutoFocus: C,
      onUnmountAutoFocus: O[7] || (O[7] = (D) => r("closeAutoFocus", D))
    }, {
      default: N(() => [q(k(Nf), {
        "as-child": "",
        "disable-outside-pointer-events": k(a),
        onEscapeKeyDown: O[2] || (O[2] = (D) => r("escapeKeyDown", D)),
        onPointerDownOutside: O[3] || (O[3] = (D) => r("pointerDownOutside", D)),
        onFocusOutside: O[4] || (O[4] = (D) => r("focusOutside", D)),
        onInteractOutside: O[5] || (O[5] = (D) => r("interactOutside", D)),
        onDismiss: O[6] || (O[6] = (D) => r("dismiss"))
      }, {
        default: N(() => [q(k(e0), {
          ref_key: "rovingFocusGroupRef",
          ref: g,
          "current-tab-stop-id": m.value,
          "onUpdate:currentTabStopId": O[0] || (O[0] = (D) => m.value = D),
          "as-child": "",
          orientation: "vertical",
          dir: k(s).dir.value,
          loop: k(l),
          onEntryFocus: O[1] || (O[1] = (D) => {
            r("entryFocus", D), k(s).isUsingKeyboardRef.value || D.preventDefault();
          })
        }, {
          default: N(() => [q(k(Mk), {
            ref: k(y),
            role: "menu",
            as: S.as,
            "as-child": S.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": k(zf)(k(i).open.value),
            dir: k(s).dir.value,
            side: S.side,
            "side-offset": S.sideOffset,
            align: S.align,
            "align-offset": S.alignOffset,
            "avoid-collisions": S.avoidCollisions,
            "collision-boundary": S.collisionBoundary,
            "collision-padding": S.collisionPadding,
            "arrow-padding": S.arrowPadding,
            "prioritize-position": S.prioritizePosition,
            "position-strategy": S.positionStrategy,
            "update-position-strategy": S.updatePositionStrategy,
            sticky: S.sticky,
            "hide-when-detached": S.hideWhenDetached,
            reference: S.reference,
            onKeydown: M,
            onBlur: x,
            onPointermove: A
          }, {
            default: N(() => [J(S.$slots, "default")]),
            _: 3
          }, 8, [
            "as",
            "as-child",
            "data-state",
            "dir",
            "side",
            "side-offset",
            "align",
            "align-offset",
            "avoid-collisions",
            "collision-boundary",
            "collision-padding",
            "arrow-padding",
            "prioritize-position",
            "position-strategy",
            "update-position-strategy",
            "sticky",
            "hide-when-detached",
            "reference"
          ])]),
          _: 3
        }, 8, [
          "current-tab-stop-id",
          "dir",
          "loop"
        ])]),
        _: 3
      }, 8, ["disable-outside-pointer-events"])]),
      _: 3
    }, 8, ["trapped"]));
  }
}), rh = Bk, Lk = /* @__PURE__ */ $({
  inheritAttrs: !1,
  __name: "MenuItemImpl",
  props: {
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
  setup(n) {
    const e = n, t = nh(), { forwardRef: r } = he(), { CollectionItem: i } = dl(), s = _(!1);
    async function o(l) {
      l.defaultPrevented || ha(l) && (e.disabled ? t.onItemLeave(l) : t.onItemEnter(l) || l.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function a(l) {
      await xe(), !l.defaultPrevented && ha(l) && t.onItemLeave(l);
    }
    return (l, c) => (T(), R(k(i), { value: { textValue: l.textValue } }, {
      default: N(() => [q(k(tt), ce({
        ref: k(r),
        role: "menuitem",
        tabindex: "-1"
      }, l.$attrs, {
        as: l.as,
        "as-child": l.asChild,
        "aria-disabled": l.disabled || void 0,
        "data-disabled": l.disabled ? "" : void 0,
        "data-highlighted": s.value ? "" : void 0,
        onPointermove: o,
        onPointerleave: a,
        onFocus: c[0] || (c[0] = async (u) => {
          await xe(), !(u.defaultPrevented || l.disabled) && (s.value = !0);
        }),
        onBlur: c[1] || (c[1] = async (u) => {
          await xe(), !u.defaultPrevented && (s.value = !1);
        })
      }), {
        default: N(() => [J(l.$slots, "default")]),
        _: 3
      }, 16, [
        "as",
        "as-child",
        "aria-disabled",
        "data-disabled",
        "data-highlighted"
      ])]),
      _: 3
    }, 8, ["value"]));
  }
}), zk = Lk, Fk = /* @__PURE__ */ $({
  __name: "MenuItem",
  props: {
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = he(), o = bl(), a = nh(), l = _(!1);
    async function c() {
      const u = s.value;
      if (!t.disabled && u) {
        const d = new CustomEvent(kb, {
          bubbles: !0,
          cancelable: !0
        });
        r("select", d), await xe(), d.defaultPrevented ? l.value = !1 : o.onClose();
      }
    }
    return (u, d) => (T(), R(zk, ce(t, {
      ref: k(i),
      onClick: c,
      onPointerdown: d[0] || (d[0] = () => {
        l.value = !0;
      }),
      onPointerup: d[1] || (d[1] = async (f) => {
        await xe(), !f.defaultPrevented && (l.value || f.currentTarget?.click());
      }),
      onKeydown: d[2] || (d[2] = async (f) => {
        const h = k(a).searchRef.value !== "";
        u.disabled || h && f.key === " " || k(fa).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: N(() => [J(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Vk = Fk, qk = /* @__PURE__ */ $({
  __name: "MenuRootContentModal",
  props: {
    loop: {
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
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Fs(t, r), s = Hs(), { forwardRef: o, currentElement: a } = he();
    return Rf(a), (l, c) => (T(), R(rh, ce(k(i), {
      ref: k(o),
      "trap-focus": k(s).open.value,
      "disable-outside-pointer-events": k(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: c[0] || (c[0] = (u) => k(s).onOpenChange(!1)),
      onFocusOutside: c[1] || (c[1] = sn((u) => r("focusOutside", u), ["prevent"]))
    }), {
      default: N(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), Uk = qk, Wk = /* @__PURE__ */ $({
  __name: "MenuRootContentNonModal",
  props: {
    loop: {
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
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const i = Fs(n, e), s = Hs();
    return (o, a) => (T(), R(rh, ce(k(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: a[0] || (a[0] = (l) => k(s).onOpenChange(!1))
    }), {
      default: N(() => [J(o.$slots, "default")]),
      _: 3
    }, 16));
  }
}), jk = Wk, Hk = /* @__PURE__ */ $({
  __name: "MenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
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
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "entryFocus",
    "openAutoFocus",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const i = Fs(n, e), s = Hs(), o = bl();
    return (a, l) => (T(), R(k(Vs), { present: a.forceMount || k(s).open.value }, {
      default: N(() => [k(o).modal.value ? (T(), R(Uk, Mn(ce({ key: 0 }, {
        ...a.$attrs,
        ...k(i)
      })), {
        default: N(() => [J(a.$slots, "default")]),
        _: 3
      }, 16)) : (T(), R(jk, Mn(ce({ key: 1 }, {
        ...a.$attrs,
        ...k(i)
      })), {
        default: N(() => [J(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Kk = Hk, Jk = /* @__PURE__ */ $({
  __name: "MenuPortal",
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
    return (t, r) => (T(), R(k(Vf), Mn(mi(e)), {
      default: N(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Xk = Jk;
const [ih, Gk] = kt("DropdownMenuRoot");
var Yk = /* @__PURE__ */ $({
  __name: "DropdownMenuRoot",
  props: {
    defaultOpen: {
      type: Boolean,
      required: !1
    },
    open: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    dir: {
      type: String,
      required: !1
    },
    modal: {
      type: Boolean,
      required: !1,
      default: !0
    }
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e;
    he();
    const i = /* @__PURE__ */ gi(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = _(), { modal: o, dir: a } = yr(t), l = ul(a);
    return Gk({
      open: i,
      onOpenChange: (c) => {
        i.value = c;
      },
      onOpenToggle: () => {
        i.value = !i.value;
      },
      triggerId: "",
      triggerElement: s,
      contentId: "",
      modal: o,
      dir: l
    }), (c, u) => (T(), R(k(Nk), {
      open: k(i),
      "onUpdate:open": u[0] || (u[0] = (d) => Xg(i) ? i.value = d : null),
      dir: k(l),
      modal: k(o)
    }, {
      default: N(() => [J(c.$slots, "default", { open: k(i) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), Zk = Yk, Qk = /* @__PURE__ */ $({
  __name: "DropdownMenuContent",
  props: {
    forceMount: {
      type: Boolean,
      required: !1
    },
    loop: {
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
    }
  },
  emits: [
    "escapeKeyDown",
    "pointerDownOutside",
    "focusOutside",
    "interactOutside",
    "closeAutoFocus"
  ],
  setup(n, { emit: e }) {
    const i = Fs(n, e);
    he();
    const s = ih(), o = _(!1);
    function a(l) {
      l.defaultPrevented || (o.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), o.value = !1, l.preventDefault());
    }
    return s.contentId ||= Hr(void 0, "reka-dropdown-menu-content"), (l, c) => (T(), R(k(Kk), ce(k(i), {
      id: k(s).contentId,
      "aria-labelledby": k(s)?.triggerId,
      style: {
        "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
        "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
        "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
      },
      onCloseAutoFocus: a,
      onInteractOutside: c[0] || (c[0] = (u) => {
        if (u.defaultPrevented) return;
        const d = u.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0, h = d.button === 2 || f;
        (!k(s).modal.value || h) && (o.value = !0), k(s).triggerElement.value?.contains(u.target) && u.preventDefault();
      })
    }), {
      default: N(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), ew = Qk, tw = /* @__PURE__ */ $({
  __name: "DropdownMenuItem",
  props: {
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
    const t = n, i = yi(e);
    return he(), (s, o) => (T(), R(k(Vk), Mn(mi({
      ...t,
      ...k(i)
    })), {
      default: N(() => [J(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), nw = tw, rw = /* @__PURE__ */ $({
  __name: "DropdownMenuPortal",
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
    return (t, r) => (T(), R(k(Xk), Mn(mi(e)), {
      default: N(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), iw = rw, sw = /* @__PURE__ */ $({
  __name: "DropdownMenuTrigger",
  props: {
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
      default: "button"
    }
  },
  setup(n) {
    const e = n, t = ih(), { forwardRef: r, currentElement: i } = he();
    return Re(() => {
      t.triggerElement = i;
    }), t.triggerId ||= Hr(void 0, "reka-dropdown-menu-trigger"), (s, o) => (T(), R(k(Ok), { "as-child": "" }, {
      default: N(() => [q(k(tt), {
        id: k(t).triggerId,
        ref: k(r),
        type: s.as === "button" ? "button" : void 0,
        "as-child": e.asChild,
        as: s.as,
        "aria-haspopup": "menu",
        "aria-expanded": k(t).open.value,
        "aria-controls": k(t).open.value ? k(t).contentId : void 0,
        "data-disabled": s.disabled ? "" : void 0,
        disabled: s.disabled,
        "data-state": k(t).open.value ? "open" : "closed",
        onClick: o[0] || (o[0] = async (a) => {
          !s.disabled && a.button === 0 && a.ctrlKey === !1 && (k(t)?.onOpenToggle(), await xe(), k(t).open.value && a.preventDefault());
        }),
        onKeydown: o[1] || (o[1] = nf((a) => {
          s.disabled || (["Enter", " "].includes(a.key) && k(t).onOpenToggle(), a.key === "ArrowDown" && k(t).onOpenChange(!0), [
            "Enter",
            " ",
            "ArrowDown"
          ].includes(a.key) && a.preventDefault());
        }, [
          "enter",
          "space",
          "arrow-down"
        ]))
      }, {
        default: N(() => [J(s.$slots, "default")]),
        _: 3
      }, 8, [
        "id",
        "type",
        "as-child",
        "as",
        "aria-expanded",
        "aria-controls",
        "data-disabled",
        "disabled",
        "data-state"
      ])]),
      _: 3
    }));
  }
}), ow = sw;
const aw = /* @__PURE__ */ $({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (T(), R(k(f0), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = sn(() => {
      }, ["stop"]))
    }, {
      default: N(() => [
        q(k(p0), { class: "checkbox-indicator" }, {
          default: N(() => [
            q(k(pf), {
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
}), lw = /* @__PURE__ */ ne(aw, [["__scopeId", "data-v-024ee78b"]]), sh = /* @__PURE__ */ Symbol("turnSelection");
function Gc(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function cw(n, e, t) {
  const r = Ls(/* @__PURE__ */ new Map());
  let i = null;
  const s = E(() => r.size), o = E(() => r.size > 0);
  function a(y) {
    return r.has(y);
  }
  function l(y) {
    r.has(y) ? r.delete(y) : r.set(y, !0), i = y;
  }
  function c(y) {
    if (i === null) {
      l(y);
      return;
    }
    const b = n.value.map((x) => x.id), v = b.indexOf(i), w = b.indexOf(y);
    if (v === -1 || w === -1) {
      l(y);
      return;
    }
    const C = Math.min(v, w), M = Math.max(v, w);
    for (let x = C; x <= M; x++) {
      const A = b[x];
      A != null && r.set(A, !0);
    }
  }
  function u() {
    r.clear(), i = null;
  }
  async function d() {
    const b = n.value.filter((v) => r.has(v.id)).map(Gc).join(`

`);
    await navigator.clipboard.writeText(b);
  }
  async function f() {
    const b = n.value.filter((v) => r.has(v.id)).map((v) => {
      const C = (v.speakerId ? e.get(v.speakerId) : void 0)?.name ?? "", M = v.startTime != null ? ss(v.startTime) : "", x = [C, M].filter(Boolean).join(" (") + (M ? ")" : ""), A = Gc(v);
      return x ? `${x}
${A}` : A;
    });
    await navigator.clipboard.writeText(b.join(`

`));
  }
  Z(
    () => n.value,
    (y) => {
      if (r.size === 0) return;
      const b = new Set(y.map((v) => v.id));
      for (const v of [...r.keys()])
        b.has(v) || r.delete(v);
    }
  );
  const h = t.on("channel:change", u), p = t.on("translation:change", u);
  function m(y) {
    y.key === "Escape" && r.size > 0 && u();
  }
  Re(() => {
    document.addEventListener("keydown", m);
  }), Ut(() => {
    document.removeEventListener("keydown", m), h(), p();
  });
  const g = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: c,
    clear: u,
    copyText: d,
    copyWithMetadata: f
  };
  return En(sh, g), g;
}
function oh() {
  const n = pi(sh);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const uw = ["data-turn-active", "aria-selected"], dw = { class: "turn-text" }, fw = ["data-word-active"], hw = /* @__PURE__ */ $({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = ze(), r = oh(), { t: i } = ye(), s = E(() => e.turn.words.length > 0), o = E(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const h = t.audio.currentTime.value, { startTime: p, endTime: m, words: g } = e.turn;
      return p == null || m == null || h < p || h > m ? null : df(g, h);
    }), a = E(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || sl(e.turn.words)) return !1;
      const h = t.audio.currentTime.value;
      return h >= e.turn.startTime && h <= e.turn.endTime;
    }), l = E(() => e.speaker?.color ?? "transparent"), c = E(() => r.isSelected(e.turn.id)), u = E(() => {
      const h = e.speaker?.name ?? "", p = c.value ? "selection.deselect" : "selection.select";
      return i(p).replace("{name}", h);
    });
    function d(h) {
      h.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    function f(h) {
      h.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    return (h, p) => (T(), B("section", {
      class: ht(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: Nn({ "--speaker-color": l.value }),
      "aria-selected": k(r).hasSelection.value ? c.value : void 0
    }, [
      n.partial ? H("", !0) : (T(), B("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        k(r).hasSelection.value ? (T(), R(lw, {
          key: 0,
          "model-value": c.value,
          "aria-label": u.value,
          onClick: sn(f, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : H("", !0),
        q(oa, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          "start-date": n.turn.startDate,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      U("p", dw, [
        s.value ? (T(!0), B(Pe, { key: 0 }, yt(n.turn.words, (m, g) => (T(), B(Pe, {
          key: m.id
        }, [
          U("span", {
            class: ht({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, j(m.text), 11, fw),
          ge(j(g < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (T(), B(Pe, { key: 1 }, [
          ge(j(n.turn.text), 1)
        ], 64)) : H("", !0)
      ])
    ], 14, uw));
  }
}), Yc = /* @__PURE__ */ ne(hw, [["__scopeId", "data-v-7ea6a240"]]), pw = {}, mw = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function gw(n, e) {
  return T(), B("svg", mw, [...e[0] || (e[0] = [
    Gg('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const yw = /* @__PURE__ */ ne(pw, [["render", gw]]), vw = { class: "transcription-empty" }, bw = { class: "message" }, kw = /* @__PURE__ */ $({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = ye();
    return (t, r) => (T(), B("div", vw, [
      q(yw, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      U("p", bw, j(k(e)("transcription.empty")), 1)
    ]));
  }
}), ww = /* @__PURE__ */ ne(kw, [["__scopeId", "data-v-f82737e5"]]), xw = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function Sw(n) {
  const e = ze(), t = _(!0), r = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function i() {
    const u = n.value;
    if (!u || !t.value) return;
    const d = e.audio?.activeTurnId.value, f = u.querySelector("[data-word-active]") ?? (d ? u.querySelector(`[data-turn-id="${d}"]`) : null);
    f && f.scrollIntoView({
      behavior: r ? "instant" : "smooth",
      block: "center"
    });
  }
  Z(
    () => e.audio?.activeWordId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), Z(
    () => e.audio?.activeTurnId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), Z(
    () => e.audio?.isPlaying.value,
    (u) => {
      u && (t.value = !0);
    }
  );
  function s() {
    t.value = !1;
  }
  function o(u) {
    xw.has(u.key) && s();
  }
  function a(u) {
    const d = n.value;
    d && (d.addEventListener("wheel", u, { passive: !0 }), d.addEventListener("touchstart", u, { passive: !0 }), d.addEventListener("pointerdown", u, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function l(u) {
    const d = n.value;
    d && (d.removeEventListener("wheel", u), d.removeEventListener("touchstart", u), d.removeEventListener("pointerdown", u), d.removeEventListener("keydown", o));
  }
  Re(() => {
    a(s);
  }), Ut(() => {
    l(s);
  });
  function c() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: c };
}
function Ee(n) {
  this.content = n;
}
Ee.prototype = {
  constructor: Ee,
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
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new Ee(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new Ee(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new Ee([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new Ee(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new Ee(i);
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
    return n = Ee.from(n), n.size ? new Ee(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = Ee.from(n), n.size ? new Ee(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = Ee.from(n);
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
Ee.from = function(n) {
  if (n instanceof Ee) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new Ee(e);
};
function ah(n, e, t) {
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
      let o = ah(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function lh(n, e, t, r) {
  for (let i = n.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: t, b: r };
    let o = n.child(--i), a = e.child(--s), l = o.nodeSize;
    if (o == a) {
      t -= l, r -= l;
      continue;
    }
    if (!o.sameMarkup(a))
      return { a: t, b: r };
    if (o.isText && o.text != a.text) {
      let c = 0, u = Math.min(o.text.length, a.text.length);
      for (; c < u && o.text[o.text.length - c - 1] == a.text[a.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (o.content.size || a.content.size) {
      let c = lh(o.content, a.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= l, r -= l;
  }
}
class P {
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
    for (let o = 0, a = 0; a < t; o++) {
      let l = this.content[o], c = a + l.nodeSize;
      if (c > e && r(l, i + a, s || null, o) !== !1 && l.content.size) {
        let u = a + 1;
        l.nodesBetween(Math.max(0, e - u), Math.min(l.content.size, t - u), r, i + u);
      }
      a = c;
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
    return this.nodesBetween(e, t, (a, l) => {
      let c = a.isText ? a.text.slice(Math.max(e, l) - l, t - l) : a.isLeaf ? i ? typeof i == "function" ? i(a) : i : a.type.spec.leafText ? a.type.spec.leafText(a) : "" : "";
      a.isBlock && (a.isLeaf && c || a.isTextblock) && r && (o ? o = !1 : s += r), s += c;
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
    return new P(i, this.size + e.size);
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
        let a = this.content[s], l = o + a.nodeSize;
        l > e && ((o < e || l > t) && (a.isText ? a = a.cut(Math.max(0, e - o), Math.min(a.text.length, t - o)) : a = a.cut(Math.max(0, e - o - 1), Math.min(a.content.size, t - o - 1))), r.push(a), i += a.nodeSize), o = l;
      }
    return new P(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? P.empty : e == 0 && t == this.content.length ? this : new P(this.content.slice(e, t));
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
    return i[e] = t, new P(i, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new P([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new P(this.content.concat(e), this.size + e.nodeSize);
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
    return ah(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return lh(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Ri(0, e);
    if (e == this.size)
      return Ri(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? Ri(t + 1, s) : Ri(t, r);
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
      return P.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new P(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return P.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new P(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return P.empty;
    if (e instanceof P)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new P([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
P.empty = new P([], 0);
const Do = { index: 0, offset: 0 };
function Ri(n, e) {
  return Do.index = n, Do.offset = e, Do;
}
function hs(n, e) {
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
      if (!hs(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !hs(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let oe = class ba {
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
    return this == e || this.type == e.type && hs(this.attrs, e.attrs);
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
      return ba.none;
    if (e instanceof ba)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
oe.none = [];
class ps extends Error {
}
class z {
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
    let r = uh(this.content, e + this.openStart, t);
    return r && new z(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new z(ch(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return z.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new z(P.fromJSON(e, t.content), r, i);
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
    return new z(e, r, i);
  }
}
z.empty = new z(P.empty, 0, 0);
function ch(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: a } = n.findIndex(t);
  if (i == e || s.isText) {
    if (a != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(ch(s.content, e - i - 1, t - i - 1)));
}
function uh(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = uh(o.content, e - s - 1, t, o);
  return a && n.replaceChild(i, o.copy(a));
}
function Cw(n, e, t) {
  if (t.openStart > n.depth)
    throw new ps("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new ps("Inconsistent open depths");
  return dh(n, e, t, 0);
}
function dh(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = dh(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, a = o.content;
      return wn(o, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: o, end: a } = Tw(t, n);
      return wn(s, hh(n, o, a, e, r));
    }
  else return wn(s, ms(n, e, r));
}
function fh(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new ps("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ka(n, e, t) {
  let r = n.node(t);
  return fh(r, e.node(t)), r;
}
function kn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Ir(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (kn(n.nodeAfter, r), s++));
  for (let a = s; a < o; a++)
    kn(i.child(a), r);
  e && e.depth == t && e.textOffset && kn(e.nodeBefore, r);
}
function wn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function hh(n, e, t, r, i) {
  let s = n.depth > i && ka(n, e, i + 1), o = r.depth > i && ka(t, r, i + 1), a = [];
  return Ir(null, n, i, a), s && o && e.index(i) == t.index(i) ? (fh(s, o), kn(wn(s, hh(n, e, t, r, i + 1)), a)) : (s && kn(wn(s, ms(n, e, i + 1)), a), Ir(e, t, i, a), o && kn(wn(o, ms(t, r, i + 1)), a)), Ir(r, null, i, a), new P(a);
}
function ms(n, e, t) {
  let r = [];
  if (Ir(null, n, t, r), n.depth > t) {
    let i = ka(n, e, t + 1);
    kn(wn(i, ms(n, e, t + 1)), r);
  }
  return Ir(e, null, t, r), new P(r);
}
function Tw(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(P.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Jr {
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
      let a = r;
      r = i, i = a;
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
        return new gs(this, e, r);
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
      let { index: a, offset: l } = o.content.findIndex(s), c = s - l;
      if (r.push(o, a, i + l), !c || (o = o.child(a), o.isText))
        break;
      s = c - 1, i += l + 1;
    }
    return new Jr(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Zc.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      Zc.set(e, r = new Ew());
    let i = r.elts[r.i] = Jr.resolve(e, t);
    return r.i = (r.i + 1) % Mw, i;
  }
}
class Ew {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const Mw = 12, Zc = /* @__PURE__ */ new WeakMap();
class gs {
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
const Aw = /* @__PURE__ */ Object.create(null);
let It = class wa {
  /**
  @internal
  */
  constructor(e, t, r, i = oe.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || P.empty;
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
    return this.type == e && hs(this.attrs, t || e.defaultAttrs || Aw) && oe.sameSet(this.marks, r || oe.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new wa(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new wa(this.type, this.attrs, this.content, e);
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
      return z.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), a = i.start(o), c = i.node(o).content.cut(i.pos - a, s.pos - a);
    return new z(c, i.depth - o, s.depth - o);
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
    return Cw(this.resolve(e), this.resolve(t), r);
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
    return Jr.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Jr.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), ph(this.marks, e);
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
  canReplace(e, t, r = P.empty, i = 0, s = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, i, s), a = o && o.matchFragment(this.content, t);
    if (!a || !a.validEnd)
      return !1;
    for (let l = i; l < s; l++)
      if (!this.type.allowsMarks(r.child(l).marks))
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
    let i = P.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
It.prototype.text = void 0;
class ys extends It {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : ph(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new ys(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new ys(this.type, this.attrs, e, this.marks);
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
function ph(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class On {
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
    let r = new Ow(e, t);
    if (r.next == null)
      return On.empty;
    let i = mh(r);
    r.next && r.err("Unexpected trailing text");
    let s = $w(Nw(i));
    return Bw(s, r), s;
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
    function s(o, a) {
      let l = o.matchFragment(e, r);
      if (l && (!t || l.validEnd))
        return P.from(a.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: u, next: d } = o.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let f = s(d, a.concat(u));
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
        for (let a = i; a.type; a = a.via)
          o.push(a.type);
        return o.reverse();
      }
      for (let o = 0; o < s.next.length; o++) {
        let { type: a, next: l } = s.next[o];
        !a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!i.type || l.validEnd) && (r.push({ match: a.contentMatch, type: a, via: i }), t[a.name] = !0);
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
On.empty = new On(!0);
class Ow {
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
function mh(n) {
  let e = [];
  do
    e.push(Dw(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Dw(n) {
  let e = [];
  do
    e.push(_w(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function _w(n) {
  let e = Iw(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = Pw(n, e);
    else
      break;
  return e;
}
function Qc(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Pw(n, e) {
  let t = Qc(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Qc(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Rw(n, e) {
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
function Iw(n) {
  if (n.eat("(")) {
    let e = mh(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Rw(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Nw(n) {
  let e = [[]];
  return i(s(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, a, l) {
    let c = { term: l, to: a };
    return e[o].push(c), c;
  }
  function i(o, a) {
    o.forEach((l) => l.to = a);
  }
  function s(o, a) {
    if (o.type == "choice")
      return o.exprs.reduce((l, c) => l.concat(s(c, a)), []);
    if (o.type == "seq")
      for (let l = 0; ; l++) {
        let c = s(o.exprs[l], a);
        if (l == o.exprs.length - 1)
          return c;
        i(c, a = t());
      }
    else if (o.type == "star") {
      let l = t();
      return r(a, l), i(s(o.expr, l), l), [r(l)];
    } else if (o.type == "plus") {
      let l = t();
      return i(s(o.expr, a), l), i(s(o.expr, l), l), [r(l)];
    } else {
      if (o.type == "opt")
        return [r(a)].concat(s(o.expr, a));
      if (o.type == "range") {
        let l = a;
        for (let c = 0; c < o.min; c++) {
          let u = t();
          i(s(o.expr, l), u), l = u;
        }
        if (o.max == -1)
          i(s(o.expr, l), l);
        else
          for (let c = o.min; c < o.max; c++) {
            let u = t();
            r(l, u), i(s(o.expr, l), u), l = u;
          }
        return [r(l)];
      } else {
        if (o.type == "name")
          return [r(a, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function gh(n, e) {
  return e - n;
}
function eu(n, e) {
  let t = [];
  return r(e), t.sort(gh);
  function r(i) {
    let s = n[i];
    if (s.length == 1 && !s[0].term)
      return r(s[0].to);
    t.push(i);
    for (let o = 0; o < s.length; o++) {
      let { term: a, to: l } = s[o];
      !a && t.indexOf(l) == -1 && r(l);
    }
  }
}
function $w(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(eu(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        eu(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new On(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let a = i[o][1].sort(gh);
      s.next.push({ type: i[o][0], next: e[a.join(",")] || t(a) });
    }
    return s;
  }
}
function Bw(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      o.push(l.name), s && !(l.isText || l.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function yh(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function vh(n, e) {
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
function bh(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function kh(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new zw(n, r, e[r]);
  return t;
}
let tu = class wh {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = kh(e, r.attrs), this.defaultAttrs = yh(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == On.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : vh(this.attrs, e);
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
    return new It(this, this.computeAttrs(e), P.from(t), oe.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = P.from(t), this.checkContent(t), new It(this, this.computeAttrs(e), t, oe.setFrom(r));
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
    if (e = this.computeAttrs(e), t = P.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(P.empty, !0);
    return s ? new It(this, e, t.append(s), oe.setFrom(r)) : null;
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
    bh(this.attrs, e, "node", this.name);
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
    e.forEach((s, o) => r[s] = new wh(s, t, o));
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
function Lw(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class zw {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? Lw(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Ks {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = kh(e, i.attrs), this.excluded = null;
    let s = yh(this.attrs);
    this.instance = s ? new oe(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new oe(this, vh(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Ks(s, i++, t, o)), r;
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
    bh(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let xh = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = Ee.from(e.nodes), t.marks = Ee.from(e.marks || {}), this.nodes = tu.compile(this.spec.nodes, this), this.marks = Ks.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", a = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = On.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = a == "_" ? null : a ? nu(this, a.split(" ")) : a == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : nu(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => It.fromJSON(this, i), this.markFromJSON = (i) => oe.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof tu) {
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
    return new ys(r, r.defaultAttrs, e, oe.setFrom(t));
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
function nu(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], s = n.marks[i], o = s;
    if (s)
      t.push(s);
    else
      for (let a in n.marks) {
        let l = n.marks[a];
        (i == "_" || l.spec.group && l.spec.group.split(" ").indexOf(i) > -1) && t.push(o = l);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
function Fw(n) {
  return n.tag != null;
}
function Vw(n) {
  return n.style != null;
}
let Nr = class xa {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (Fw(i))
        this.tags.push(i);
      else if (Vw(i)) {
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
    let r = new iu(this, t, !1);
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
    let r = new iu(this, t, !0);
    return r.addAll(e, oe.none, t.from, t.to), z.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (Ww(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
      let o = this.styles[s], a = o.style;
      if (!(a.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
        if (o.getAttrs) {
          let l = o.getAttrs(t);
          if (l === !1)
            continue;
          o.attrs = l || void 0;
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
        let a = t[o];
        if ((a.priority == null ? 50 : a.priority) < s)
          break;
      }
      t.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = su(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = su(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new xa(e, xa.schemaRules(e)));
  }
};
const Sh = {
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
}, qw = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ch = { ol: !0, ul: !0 }, Xr = 1, Sa = 2, $r = 4;
function ru(n, e, t) {
  return e != null ? (e ? Xr : 0) | (e === "full" ? Sa : 0) : n && n.whitespace == "pre" ? Xr | Sa : t & ~$r;
}
class Ii {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = oe.none, this.match = s || (o & $r ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(P.from(e));
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
    if (!(this.options & Xr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = P.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(P.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Sh.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class iu {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = ru(null, t.preserveWhitespace, 0) | (r ? $r : 0);
    i ? s = new Ii(i.type, i.attrs, oe.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new Ii(null, null, oe.none, !0, null, o) : s = new Ii(e.schema.topNodeType, null, oe.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & Sa ? "full" : this.localPreserveWS || (i.options & Xr) > 0, { schema: o } = this.parser;
    if (s === "full" || i.inlineContext(e) || /[^ \t\r\n\u000c]/.test(r)) {
      if (s)
        if (s === "full")
          r = r.replace(/\r\n?/g, `
`);
        else if (o.linebreakReplacement && /[\r\n]/.test(r) && this.top.findWrapping(o.linebreakReplacement.create())) {
          let a = r.split(/\r?\n|\r/);
          for (let l = 0; l < a.length; l++)
            l && this.insertNode(o.linebreakReplacement.create(), t, !0), a[l] && this.insertNode(o.text(a[l]), t, !/\S/.test(a[l]));
          r = "";
        } else
          r = r.replace(/\r?\n|\r/g, " ");
      else if (r = r.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(r) && this.open == this.nodes.length - 1) {
        let a = i.content[i.content.length - 1], l = e.previousSibling;
        (!a || l && l.nodeName == "BR" || a.isText && /[ \t\r\n\u000c]$/.test(a.text)) && (r = r.slice(1));
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
    let o = e.nodeName.toLowerCase(), a;
    Ch.hasOwnProperty(o) && this.parser.normalizeLists && Uw(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : qw.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, u = this.needsBlock;
      if (Sh.hasOwnProperty(o))
        s.content.length && s.content[0].isInline && this.open && (this.open--, s = this.top), c = !0, s.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e, t);
        break e;
      }
      let d = l && l.skip ? t : this.readStyles(e, t);
      d && this.addAll(e, d), c && this.sync(s), this.needsBlock = u;
    } else {
      let c = this.readStyles(e, t);
      c && this.addElementByRule(e, l, c, l.consuming === !1 ? a : void 0);
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
          for (let a = void 0; ; ) {
            let l = this.parser.matchStyle(s, o, this, a);
            if (!l)
              break;
            if (l.ignore)
              return null;
            if (l.clearMark ? t = t.filter((c) => !l.clearMark(c)) : t = t.concat(this.parser.schema.marks[l.mark].create(l.attrs)), l.consuming === !1)
              a = l;
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
        let l = this.enter(o, t.attrs || null, r, t.preserveWhitespace);
        l && (s = !0, r = l);
      }
    else {
      let l = this.parser.schema.marks[t.mark];
      r = r.concat(l.create(t.attrs));
    }
    let a = this.top;
    if (o && o.isLeaf)
      this.findInside(e);
    else if (i)
      this.addElement(e, r, i);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l, r, !1));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l, r), this.findAround(e, l, !1);
    }
    s && this.sync(a) && this.open--;
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r, i) {
    let s = r || 0;
    for (let o = r ? e.childNodes[r] : e.firstChild, a = i == null ? null : e.childNodes[i]; o != a; o = o.nextSibling, ++s)
      this.findAtPoint(e, s), this.addDOM(o, t);
    this.findAtPoint(e, s);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e, t, r) {
    let i, s;
    for (let o = this.open, a = 0; o >= 0; o--) {
      let l = this.nodes[o], c = l.findWrapping(e);
      if (c && (!i || i.length > c.length + a) && (i = c, s = l, !c.length))
        break;
      if (l.solid) {
        if (r)
          break;
        a += 2;
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
      for (let a of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(a.type) : ou(a.type, e.type)) && (o = a.addToSet(o));
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
    let a = ru(e, s, o.options);
    o.options & $r && o.content.length == 0 && (a |= $r);
    let l = oe.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : ou(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new Ii(e, t, l, i, null, a)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Xr);
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
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (a, l) => {
      for (; a >= 0; a--) {
        let c = t[a];
        if (c == "") {
          if (a == t.length - 1 || a == 0)
            continue;
          for (; l >= s; l--)
            if (o(a - 1, l))
              return !0;
          return !1;
        } else {
          let u = l > 0 || l == 0 && i ? this.nodes[l].type : r && l >= s ? r.node(l - s).type : null;
          if (!u || u.name != c && !u.isInGroup(c))
            return !1;
          l--;
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
function Uw(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ch.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Ww(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function su(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function ou(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let s = [], o = (a) => {
      s.push(a);
      for (let l = 0; l < a.edgeCount; l++) {
        let { type: c, next: u } = a.edge(l);
        if (c == e || s.indexOf(u) < 0 && o(u))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
class Ln {
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
    r || (r = _o(t).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let a = 0, l = 0;
        for (; a < s.length && l < o.marks.length; ) {
          let c = o.marks[l];
          if (!this.marks[c.type.name]) {
            l++;
            continue;
          }
          if (!c.eq(s[a][0]) || c.type.spec.spanning === !1)
            break;
          a++, l++;
        }
        for (; a < s.length; )
          i = s.pop()[1];
        for (; l < o.marks.length; ) {
          let c = o.marks[l++], u = this.serializeMark(c, o.isInline, t);
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
    let { dom: r, contentDOM: i } = Hi(_o(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && Hi(_o(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Hi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Ln(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = au(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return au(e.marks);
  }
}
function au(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function _o(n) {
  return n.document || window.document;
}
const lu = /* @__PURE__ */ new WeakMap();
function jw(n) {
  let e = lu.get(n);
  return e === void 0 && lu.set(n, e = Hw(n)), e;
}
function Hw(n) {
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
function Hi(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = jw(r)) && s.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let o = i.indexOf(" ");
  o > 0 && (t = i.slice(0, o), i = i.slice(o + 1));
  let a, l = t ? n.createElementNS(t, i) : n.createElement(i), c = e[1], u = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    u = 2;
    for (let d in c)
      if (c[d] != null) {
        let f = d.indexOf(" ");
        f > 0 ? l.setAttributeNS(d.slice(0, f), d.slice(f + 1), c[d]) : d == "style" && l.style ? l.style.cssText = c[d] : l.setAttribute(d, c[d]);
      }
  }
  for (let d = u; d < e.length; d++) {
    let f = e[d];
    if (f === 0) {
      if (d < e.length - 1 || d > u)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: l, contentDOM: l };
    } else {
      let { dom: h, contentDOM: p } = Hi(n, f, t, r);
      if (l.appendChild(h), p) {
        if (a)
          throw new RangeError("Multiple content holes");
        a = p;
      }
    }
  }
  return { dom: l, contentDOM: a };
}
const Th = 65535, Eh = Math.pow(2, 16);
function Kw(n, e) {
  return n + e * Eh;
}
function cu(n) {
  return n & Th;
}
function Jw(n) {
  return (n - (n & Th)) / Eh;
}
const Mh = 1, Ah = 2, Ki = 4, Oh = 8;
class Ca {
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
    return (this.delInfo & Oh) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Mh | Ki)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Ah | Ki)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Ki) > 0;
  }
}
class st {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && st.empty)
      return st.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = cu(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Jw(e);
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
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let c = this.ranges[a + s], u = this.ranges[a + o], d = l + c;
      if (e <= d) {
        let f = c ? e == l ? -1 : e == d ? 1 : t : t, h = l + i + (f < 0 ? 0 : u);
        if (r)
          return h;
        let p = e == (t < 0 ? l : d) ? null : Kw(a / 3, e - l), m = e == l ? Ah : e == d ? Mh : Ki;
        return (t < 0 ? e != l : e != d) && (m |= Oh), new Ca(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new Ca(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = cu(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let c = this.ranges[a + s], u = l + c;
      if (e <= u && a == i * 3)
        return !0;
      r += this.ranges[a + o] - c;
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
      let o = this.ranges[i], a = o - (this.inverted ? s : 0), l = o + (this.inverted ? 0 : s), c = this.ranges[i + t], u = this.ranges[i + r];
      e(a, a + c, l, l + u), s += u - c;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new st(this.ranges, !this.inverted);
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
    return e == 0 ? st.empty : new st(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
st.empty = new st([]);
class vs {
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
    return new vs(this._maps, this.mirror, e, t);
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
    let e = new vs();
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
      let o = this._maps[s], a = o.mapResult(e, t);
      if (a.recover != null) {
        let l = this.getMirror(s);
        if (l != null && l > s && l < this.to) {
          s = l, e = this._maps[l].recover(a.recover);
          continue;
        }
      }
      i |= a.delInfo, e = a.pos;
    }
    return r ? e : new Ca(e, i, null);
  }
}
const Po = /* @__PURE__ */ Object.create(null);
class Fe {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return st.empty;
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
    let r = Po[t.stepType];
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
    if (e in Po)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Po[e] = t, t.prototype.jsonID = e, t;
  }
}
class be {
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
    return new be(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new be(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return be.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof ps)
        return be.fail(s.message);
      throw s;
    }
  }
}
function kl(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(kl(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return P.fromArray(r);
}
class Yt extends Fe {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new z(kl(t.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return be.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new gt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Yt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Yt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Yt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Yt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Fe.jsonID("addMark", Yt);
class gt extends Fe {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new z(kl(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return be.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Yt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new gt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof gt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new gt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new gt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Fe.jsonID("removeMark", gt);
class Zt extends Fe {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return be.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return be.fromReplace(e, this.pos, this.pos + 1, new z(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new Zt(this.pos, t.marks[i]);
        return new Zt(this.pos, this.mark);
      }
    }
    return new Dn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Zt(t.pos, this.mark);
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
    return new Zt(t.pos, e.markFromJSON(t.mark));
  }
}
Fe.jsonID("addNodeMark", Zt);
class Dn extends Fe {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return be.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return be.fromReplace(e, this.pos, this.pos + 1, new z(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Zt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Dn(t.pos, this.mark);
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
    return new Dn(t.pos, e.markFromJSON(t.mark));
  }
}
Fe.jsonID("removeNodeMark", Dn);
class we extends Fe {
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
    return this.structure && Ta(e, this.from, this.to) ? be.fail("Structure replace would overwrite content") : be.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new st([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new we(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new we(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof we) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? z.empty : new z(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new we(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? z.empty : new z(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new we(e.from, this.to, t, this.structure);
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
    return new we(t.from, t.to, z.fromJSON(e, t.slice), !!t.structure);
  }
}
Fe.jsonID("replace", we);
class Se extends Fe {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, i, s, o, a = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = a;
  }
  apply(e) {
    if (this.structure && (Ta(e, this.from, this.gapFrom) || Ta(e, this.gapTo, this.to)))
      return be.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return be.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? be.fromReplace(e, this.from, this.to, r) : be.fail("Content does not fit in gap");
  }
  getMap() {
    return new st([
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
    return new Se(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new Se(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new Se(t.from, t.to, t.gapFrom, t.gapTo, z.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Fe.jsonID("replaceAround", Se);
function Ta(n, e, t) {
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
function Xw(n, e, t, r) {
  let i = [], s = [], o, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + l.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new gt(f, h, d[m])));
      a && a.to == f ? a.to = h : s.push(a = new Yt(f, h, r));
    }
  }), i.forEach((l) => n.step(l)), s.forEach((l) => n.step(l));
}
function Gw(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof Ks) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (l || (l = [])).push(u), c = u.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (l = [r]) : l = o.marks;
    if (l && l.length) {
      let c = Math.min(a + o.nodeSize, t);
      for (let u = 0; u < l.length; u++) {
        let d = l[u], f;
        for (let h = 0; h < i.length; h++) {
          let p = i[h];
          p.step == s - 1 && d.eq(i[h].style) && (f = p);
        }
        f ? (f.to = c, f.step = s) : i.push({ style: d, from: Math.max(a, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => n.step(new gt(o.from, o.to, o.style)));
}
function wl(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], a = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let c = s.child(l), u = a + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new we(a, u, z.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new gt(a, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new z(P.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new we(a + f.index, a + f.index + f[0].length, p));
      }
    }
    a = u;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(P.empty, !0);
    n.replace(a, a, new z(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    n.step(o[l]);
}
function Yw(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function br(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), a = n.$from.index(r) + i, l = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(a, l, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Yw(o, a, l))
      break;
    a && (i = 1), l < o.childCount && (s = 1);
  }
  return null;
}
function Zw(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, u = P.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = P.from(r.node(p).copy(u)), d++) : l--;
  let f = P.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = P.from(i.node(p).copy(f)), h++) : c++;
  n.step(new Se(l, c, o, a, new z(u.append(f), d, h), u.size - d, !0));
}
function Dh(n, e, t = null, r = n) {
  let i = Qw(n, e), s = i && ex(r, e);
  return s ? i.map(uu).concat({ type: e, attrs: t }).concat(s.map(uu)) : null;
}
function uu(n) {
  return { type: n, attrs: null };
}
function Qw(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function ex(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function tx(n, e, t) {
  let r = P.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let a = t[o].type.contentMatch.matchFragment(r);
      if (!a || !a.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = P.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new Se(i, s, i, s, new z(r, 0, 0), t.length, !0));
}
function nx(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, a) => {
    let l = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, l) && rx(n.doc, n.mapping.slice(s).map(a), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && Ph(n, o, a, s), wl(n, n.mapping.slice(s).map(a, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(a, 1), f = u.map(a + o.nodeSize, 1);
      return n.step(new Se(d, f, d + 1, f - 1, new z(P.from(r.create(l, null, o.marks)), 0, 0), 1, !0)), c === !0 && _h(n, o, a, s), !1;
    }
  });
}
function _h(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.isText) {
      let o, a = /\r?\n|\r/g;
      for (; o = a.exec(i.text); ) {
        let l = n.mapping.slice(r).map(t + 1 + s + o.index);
        n.replaceWith(l, l + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Ph(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function rx(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function ix(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new Se(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new z(P.from(o), 0, 0), 1, !0));
}
function Nt(n, e, t = 1, r) {
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
  let a = i.indexAfter(s), l = r && r[0];
  return i.node(s).canReplaceWith(a, a, l ? l.type : i.node(s + 1).type);
}
function sx(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = P.empty, o = P.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    s = P.from(i.node(a).copy(s));
    let u = r && r[c];
    o = P.from(u ? u.type.create(u.attrs, o) : i.node(a).copy(o));
  }
  n.step(new we(e, e, new z(s.append(o), t, t), !0));
}
function zn(n, e) {
  let t = n.resolve(e), r = t.index();
  return Rh(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function ox(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function Rh(n, e) {
  return !!(n && e && !n.isLeaf && ox(n, e));
}
function Js(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && Rh(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function ax(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let a = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Ph(n, u.node(), u.before(), a);
  }
  o.inlineContent && wl(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let l = n.mapping.slice(a), c = l.map(e - t);
  if (n.step(new we(c, l.map(e + t, -1), z.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    _h(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function lx(n, e, t) {
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
function cx(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let s = 0; s < t.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let a = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, l = r.index(o) + (a > 0 ? 1 : 0), c = r.node(o), u = !1;
      if (s == 1)
        u = c.canReplace(l, l, i);
      else {
        let d = c.contentMatchAt(l).findWrapping(i.firstChild.type);
        u = d && c.canReplaceWith(l, l, d[0]);
      }
      if (u)
        return a == 0 ? r.pos : a < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function Xs(n, e, t = e, r = z.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Ih(i, s, r) ? new we(e, t, r) : new ux(i, s, r).fit();
}
function Ih(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class ux {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = P.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = P.from(e.node(i).copy(this.placed));
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
    let s = this.placed, o = r.depth, a = i.depth;
    for (; o && a && s.childCount == 1; )
      s = s.firstChild.content, o--, a--;
    let l = new z(s, o, a);
    return e > -1 ? new Se(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new we(r.pos, i.pos, l) : null;
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
        r ? (s = Ro(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let a = this.depth; a >= 0; a--) {
          let { type: l, match: c } = this.frontier[a], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(P.from(o), !1)) : s && l.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, wrap: u };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ro(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new z(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ro(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new z(Ar(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new z(Ar(e, t, 1), t, r);
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
    let o = this.unplaced, a = r ? r.content : o.content, l = o.openStart - e, c = 0, u = [], { match: d, type: f } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        u.push(i.child(m));
      d = d.matchFragment(i);
    }
    let h = a.size + e - (o.content.size - o.openEnd);
    for (; c < a.childCount; ) {
      let m = a.child(c), g = d.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || l == 0 || m.content.size) && (d = g, u.push(Nh(m.mark(f.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? h : -1)));
    }
    let p = c == a.childCount;
    p || (h = -1), this.placed = Or(this.placed, t, P.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = a; m < h; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? z.empty : new z(Ar(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new z(Ar(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Io(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Io(e, t, i, r, s);
      if (o) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], u = Io(e, a, c, l, !0);
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
    t.fit.childCount && (this.placed = Or(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Or(this.placed, this.depth, P.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(P.empty, !0);
    t.childCount && (this.placed = Or(this.placed, this.frontier.length, t));
  }
}
function Ar(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Ar(n.firstChild.content, e - 1, t)));
}
function Or(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Or(n.lastChild.content, e - 1, t)));
}
function Ro(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Nh(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Nh(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(P.empty, !0)))), n.copy(r);
}
function Io(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !dx(t, s.content, o) ? a : null;
}
function dx(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function fx(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function hx(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Ih(i, s, r))
    return n.step(new we(e, t, r));
  let o = Bh(i, s);
  o[o.length - 1] == 0 && o.pop();
  let a = -(i.depth + 1);
  o.unshift(a);
  for (let f = i.depth, h = i.pos - 1; f > 0; f--, h--) {
    let p = i.node(f).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(f) > -1 ? a = f : i.before(f) == h && o.splice(1, 0, -f);
  }
  let l = o.indexOf(a), c = [], u = r.openStart;
  for (let f = r.content, h = 0; ; h++) {
    let p = f.firstChild;
    if (c.push(p), h == r.openStart)
      break;
    f = p.content;
  }
  for (let f = u - 1; f >= 0; f--) {
    let h = c[f], p = fx(h.type);
    if (p && !h.sameMarkup(i.node(Math.abs(a) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + l) % o.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let b = i.node(g - 1), v = i.index(g - 1);
        if (b.canReplaceWith(v, v, p.type, p.marks))
          return n.replace(i.before(g), y ? s.after(g) : t, new z($h(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function $h(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy($h(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(P.empty, !0));
  }
  return n;
}
function px(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = lx(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new z(P.from(r), 0, 0));
}
function mx(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Bh(r, i);
  for (let o = 0; o < s.length; o++) {
    let a = s[o], l = o == s.length - 1;
    if (l && a == 0 || r.node(a).type.contentMatch.validEnd)
      return n.delete(r.start(a), i.end(a));
    if (a > 0 && (l || r.node(a - 1).canReplace(r.index(a - 1), i.indexAfter(a - 1))))
      return n.delete(r.before(a), i.after(a));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && i.end(o) - t != i.depth - o && r.start(o - 1) == i.start(o - 1) && r.node(o - 1).canReplace(r.index(o - 1), i.index(o - 1)))
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function Bh(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class tr extends Fe {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return be.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return be.fromReplace(e, this.pos, this.pos + 1, new z(P.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return st.empty;
  }
  invert(e) {
    return new tr(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new tr(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new tr(t.pos, t.attr, t.value);
  }
}
Fe.jsonID("attr", tr);
class Gr extends Fe {
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
    return be.ok(r);
  }
  getMap() {
    return st.empty;
  }
  invert(e) {
    return new Gr(this.attr, e.attrs[this.attr]);
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
    return new Gr(t.attr, t.value);
  }
}
Fe.jsonID("docAttr", Gr);
let ar = class extends Error {
};
ar = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
ar.prototype = Object.create(Error.prototype);
ar.prototype.constructor = ar;
ar.prototype.name = "TransformError";
class Lh {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new vs();
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
      throw new ar(t.failed);
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
      r && (e = i.map(e, 1), t = i.map(t, -1)), i.forEach((s, o, a, l) => {
        e = Math.min(e, a), t = Math.max(t, l);
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
  replace(e, t = e, r = z.empty) {
    let i = Xs(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new z(P.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, z.empty);
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
    return hx(this, e, t, r), this;
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
    return px(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return mx(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Zw(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return ax(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return tx(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return nx(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return ix(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new tr(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Gr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Zt(e, t)), this;
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
      t.isInSet(r.marks) && this.step(new Dn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new Dn(e, s)), i = s.removeFromSet(i);
      for (let a = o.length - 1; a >= 0; a--)
        this.step(o[a]);
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
    return sx(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Xw(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return Gw(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return wl(this, e, t, r), this;
  }
}
const No = /* @__PURE__ */ Object.create(null);
class Q {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new gx(e.min(t), e.max(t))];
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
  replace(e, t = z.empty) {
    let r = t.content.lastChild, i = null;
    for (let a = 0; a < t.openEnd; a++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let a = 0; a < o.length; a++) {
      let { $from: l, $to: c } = o[a], u = e.mapping.slice(s);
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? z.empty : t), a == 0 && hu(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: a } = i[s], l = e.mapping.slice(r), c = l.map(o.pos), u = l.map(a.pos);
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), hu(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new Y(e) : Gn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Gn(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Gn(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Qe(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Gn(e, e, 0, 0, 1) || new Qe(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Gn(e, e, e.content.size, e.childCount, -1) || new Qe(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = No[t.type];
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
    if (e in No)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return No[e] = t, t.prototype.jsonID = e, t;
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
class gx {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let du = !1;
function fu(n) {
  !du && !n.parent.inlineContent && (du = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class Y extends Q {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    fu(e), fu(t), super(e, t);
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
  replace(e, t = z.empty) {
    if (super.replace(e, t), t == z.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof Y && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Gs(this.anchor, this.head);
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
class Gs {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Gs(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return Y.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class X extends Q {
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
    return r ? Q.near(s) : new X(s);
  }
  content() {
    return new z(P.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof X && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new xl(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new X(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new X(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
X.prototype.visible = !1;
Q.jsonID("node", X);
class xl {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Gs(r, r) : new xl(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && X.isSelectable(r) ? new X(t) : Q.near(t);
  }
}
class Qe extends Q {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = z.empty) {
    if (t == z.empty) {
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
    return new Qe(e);
  }
  map(e) {
    return new Qe(e);
  }
  eq(e) {
    return e instanceof Qe;
  }
  getBookmark() {
    return yx;
  }
}
Q.jsonID("all", Qe);
const yx = {
  map() {
    return this;
  },
  resolve(n) {
    return new Qe(n);
  }
};
function Gn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return Y.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && X.isSelectable(a))
        return X.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = Gn(n, a, t + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function hu(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof we || i instanceof Se))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((a, l, c, u) => {
    o == null && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
const pu = 1, Ni = 2, mu = 4;
class vx extends Lh {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | pu) & ~Ni, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & pu) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Ni, this;
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
    return (this.updated & Ni) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Ni, this.storedMarks = null;
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
    return this.updated |= mu, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & mu) > 0;
  }
}
function gu(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Dr {
  constructor(e, t, r) {
    this.name = e, this.init = gu(t.init, r), this.apply = gu(t.apply, r);
  }
}
const bx = [
  new Dr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Dr("selection", {
    init(n, e) {
      return n.selection || Q.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Dr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Dr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class $o {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = bx.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Dr(r.key, r.spec.state, r));
    });
  }
}
class Zn {
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
        let a = this.config.plugins[o];
        if (a.spec.appendTransaction) {
          let l = i ? i[o].n : 0, c = i ? i[o].state : this, u = l < t.length && a.spec.appendTransaction.call(a, l ? t.slice(l) : t, c, r);
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
    let t = new Zn(this.config), r = this.config.fields;
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
    return new vx(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new $o(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Zn(t);
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
    let t = new $o(this.schema, e.plugins), r = t.fields, i = new Zn(t);
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
    let i = new $o(e.schema, e.plugins), s = new Zn(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = It.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = Q.fromJSON(s.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let a in r) {
            let l = r[a], c = l.spec.state;
            if (l.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, a)) {
              s[o.name] = c.fromJSON.call(l, e, t[a], s);
              return;
            }
          }
        s[o.name] = o.init(e, s);
      }
    }), s;
  }
}
function zh(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = zh(i, e, {})), t[r] = i;
  }
  return t;
}
class Ie {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && zh(e.props, this, this.props), this.key = e.key ? e.key.key : Fh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Bo = /* @__PURE__ */ Object.create(null);
function Fh(n) {
  return n in Bo ? n + "$" + ++Bo[n] : (Bo[n] = 0, n + "$");
}
class nt {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Fh(e);
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
const Sl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Vh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const qh = (n, e, t) => {
  let r = Vh(n, t);
  if (!r)
    return !1;
  let i = Cl(r);
  if (!i) {
    let o = r.blockRange(), a = o && br(o);
    return a == null ? !1 : (e && e(n.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (Zh(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (lr(s, "end") || X.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let a = Xs(n.doc, r.before(o), r.after(o), z.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = n.tr.step(a);
          l.setSelection(lr(s, "end") ? Q.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : X.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, kx = (n, e, t) => {
  let r = Vh(n, t);
  if (!r)
    return !1;
  let i = Cl(r);
  return i ? Uh(n, i, e) : !1;
}, wx = (n, e, t) => {
  let r = jh(n, t);
  if (!r)
    return !1;
  let i = Tl(r);
  return i ? Uh(n, i, e) : !1;
};
function Uh(n, e, t) {
  let r = e.nodeBefore, i = r, s = e.pos - 1;
  for (; !i.isTextblock; s--) {
    if (i.type.spec.isolating)
      return !1;
    let u = i.lastChild;
    if (!u)
      return !1;
    i = u;
  }
  let o = e.nodeAfter, a = o, l = e.pos + 1;
  for (; !a.isTextblock; l++) {
    if (a.type.spec.isolating)
      return !1;
    let u = a.firstChild;
    if (!u)
      return !1;
    a = u;
  }
  let c = Xs(n.doc, s, l, z.empty);
  if (!c || c.from != s || c instanceof we && c.slice.size >= l - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(Y.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function lr(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Wh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = Cl(r);
  }
  let o = s && s.nodeBefore;
  return !o || !X.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(X.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Cl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function jh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Hh = (n, e, t) => {
  let r = jh(n, t);
  if (!r)
    return !1;
  let i = Tl(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Zh(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (lr(s, "start") || X.isSelectable(s))) {
    let o = Xs(n.doc, r.before(), r.after(), z.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = n.tr.step(o);
        a.setSelection(lr(s, "start") ? Q.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : X.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, Kh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = Tl(r);
  }
  let o = s && s.nodeAfter;
  return !o || !X.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(X.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function Tl(n) {
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
const xx = (n, e) => {
  let t = n.selection, r = t instanceof X, i;
  if (r) {
    if (t.node.isTextblock || !zn(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Js(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(X.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, Sx = (n, e) => {
  let t = n.selection, r;
  if (t instanceof X) {
    if (t.node.isTextblock || !zn(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Js(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Cx = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && br(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, Jh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function El(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Tx = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = El(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(Q.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Xh = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Qe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = El(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(o, s.createAndFill());
    a.setSelection(Y.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, Gh = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Nt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && br(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Yh(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof X && e.selection.node.isBlock)
      return !r.parentOffset || !Nt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, a, l = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        l = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), a = El(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1)));
        let m = n && n(i.parent, l, r);
        s.unshift(m || (l && a ? { type: a } : null)), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof Y || e.selection instanceof Qe) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Nt(u.doc, d, s.length, s);
    if (f || (s[0] = a ? { type: a } : null, f = Nt(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !l && c && r.node(o).type != a) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      a && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, a) && u.setNodeMarkup(u.mapping.map(r.before(o)), a);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const Ex = Yh(), Mx = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(X.create(n.doc, i))), !0);
};
function Ax(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || zn(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Zh(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, a, l = i.type.spec.isolating || s.type.spec.isolating;
  if (!l && Ax(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (a = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && a.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = P.empty;
      for (let y = o.length - 1; y >= 0; y--)
        p = P.from(o[y].create(null, p));
      p = P.from(i.copy(p));
      let m = n.tr.step(new Se(e.pos - 1, h, e.pos, h, new z(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && zn(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && l ? null : Q.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && br(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && lr(s, "start", !0) && lr(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let y = P.empty;
        for (let v = p.length - 1; v >= 0; v--)
          y = P.from(p[v].copy(y));
        let b = n.tr.step(new Se(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new z(y, p.length, 0), 0, !0));
        t(b.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Qh(n) {
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
const Ox = Qh(-1), Dx = Qh(1);
function _x(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), a = o && Dh(o, n, e);
    return a ? (r && r(t.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function yu(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let s = 0; s < t.selection.ranges.length && !i; s++) {
      let { $from: { pos: o }, $to: { pos: a } } = t.selection.ranges[s];
      t.doc.nodesBetween(o, a, (l, c) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(n, e)))
          if (l.type == n)
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
        let { $from: { pos: a }, $to: { pos: l } } = t.selection.ranges[o];
        s.setBlockType(a, l, n, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
function Ml(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
Ml(Sl, qh, Wh);
Ml(Sl, Hh, Kh);
Ml(Jh, Xh, Gh, Ex);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Px(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let a = r ? t.tr : null;
    return Rx(a, o, n, e) ? (r && r(a.scrollIntoView()), !0) : !1;
  };
}
function Rx(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = o.resolve(e.start - 2);
    s = new gs(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new gs(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = Dh(s, t, r, e);
  return a ? (n && Ix(n, e, a, i, t), !0) : !1;
}
function Ix(n, e, t, r, i) {
  let s = P.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = P.from(t[u].type.create(t[u].attrs, s));
  n.step(new Se(e.start - (r ? 2 : 0), e.end, e.start, e.end, new z(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let a = t.length - o, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Nt(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function Nx(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? $x(e, t, n, s) : Bx(e, t, s) : !0 : !1;
  };
}
function $x(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new Se(s - 1, o, s, o, new z(P.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new gs(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = br(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return zn(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function Bx(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= i.child(p).nodeSize, r.delete(h - 1, h + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let a = t.startIndex == 0, l = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (a ? 0 : 1), u + 1, o.content.append(l ? P.empty : P.from(i))))
    return !1;
  let d = s.pos, f = d + o.nodeSize;
  return r.step(new Se(d - (a ? 1 : 0), f + (l ? 1 : 0), d + 1, f - 1, new z((a ? P.empty : P.from(i.copy(P.empty))).append(l ? P.empty : P.from(i.copy(P.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function Lx(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let a = s.parent, l = a.child(o - 1);
    if (l.type != n)
      return !1;
    if (t) {
      let c = l.lastChild && l.lastChild.type == a.type, u = P.from(c ? n.create() : null), d = new z(P.from(n.create(null, P.from(a.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new Se(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Oe = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, cr = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ea = null;
const Pt = function(n, e, t) {
  let r = Ea || (Ea = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, zx = function() {
  Ea = null;
}, _n = function(n, e, t, r) {
  return t && (vu(n, e, t, r, -1) || vu(n, e, t, r, 1));
}, Fx = /^(img|br|input|textarea|hr)$/i;
function vu(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : ut(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || bi(n) || Fx.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Oe(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? ut(n) : 0;
    } else
      return !1;
  }
}
function ut(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Vx(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = ut(n);
    } else if (n.parentNode && !bi(n))
      e = Oe(n), n = n.parentNode;
    else
      return null;
  }
}
function qx(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !bi(n))
      e = Oe(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Ux(n, e, t) {
  for (let r = e == 0, i = e == ut(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Oe(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == ut(n);
  }
}
function bi(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Ys = function(n) {
  return n.focusNode && _n(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function pn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function Wx(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function jx(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(ut(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(ut(r.startContainer), r.startOffset) };
  }
}
const Mt = typeof navigator < "u" ? navigator : null, bu = typeof document < "u" ? document : null, fn = Mt && Mt.userAgent || "", Ma = /Edge\/(\d+)/.exec(fn), ep = /MSIE \d/.exec(fn), Aa = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(fn), et = !!(ep || Aa || Ma), en = ep ? document.documentMode : Aa ? +Aa[1] : Ma ? +Ma[1] : 0, dt = !et && /gecko\/(\d+)/i.test(fn);
dt && +(/Firefox\/(\d+)/.exec(fn) || [0, 0])[1];
const Oa = !et && /Chrome\/(\d+)/.exec(fn), _e = !!Oa, tp = Oa ? +Oa[1] : 0, Le = !et && !!Mt && /Apple Computer/.test(Mt.vendor), ur = Le && (/Mobile\/\w+/.test(fn) || !!Mt && Mt.maxTouchPoints > 2), ct = ur || (Mt ? /Mac/.test(Mt.platform) : !1), np = Mt ? /Win/.test(Mt.platform) : !1, Rt = /Android \d/.test(fn), ki = !!bu && "webkitFontSmoothing" in bu.documentElement.style, Hx = ki ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Kx(n) {
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
function _t(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Jx(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function ku(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = cr(o);
      continue;
    }
    let a = o, l = a == s.body, c = l ? Kx(s) : Jx(a), u = 0, d = 0;
    if (e.top < c.top + _t(r, "top") ? d = -(c.top - e.top + _t(i, "top")) : e.bottom > c.bottom - _t(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + _t(i, "top") - c.top : e.bottom - c.bottom + _t(i, "bottom")), e.left < c.left + _t(r, "left") ? u = -(c.left - e.left + _t(i, "left")) : e.right > c.right - _t(r, "right") && (u = e.right - c.right + _t(i, "right")), u || d)
      if (l)
        s.defaultView.scrollBy(u, d);
      else {
        let h = a.scrollLeft, p = a.scrollTop;
        d && (a.scrollTop += d), u && (a.scrollLeft += u);
        let m = a.scrollLeft - h, g = a.scrollTop - p;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let f = l ? "fixed" : getComputedStyle(o).position;
    if (/^(fixed|sticky)$/.test(f))
      break;
    o = f == "absolute" ? o.offsetParent : cr(o);
  }
}
function Xx(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let s = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let a = n.root.elementFromPoint(s, o);
    if (!a || a == n.dom || !n.dom.contains(a))
      continue;
    let l = a.getBoundingClientRect();
    if (l.top >= t - 20) {
      r = a, i = l.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: rp(n.dom) };
}
function rp(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = cr(r))
    ;
  return e;
}
function Gx({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  ip(t, r == 0 ? 0 : r - e);
}
function ip(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let Wn = null;
function Yx(n) {
  if (n.setActive)
    return n.setActive();
  if (Wn)
    return n.focus(Wn);
  let e = rp(n);
  n.focus(Wn == null ? {
    get preventScroll() {
      return Wn = { preventScroll: !0 }, !0;
    }
  } : void 0), Wn || (Wn = !1, ip(e, 0));
}
function sp(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, a = e.top, l, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = Pt(u).getClientRects();
    else
      continue;
    for (let h = 0; h < f.length; h++) {
      let p = f[h];
      if (p.top <= o && p.bottom >= a) {
        o = Math.max(p.bottom, o), a = Math.min(p.top, a);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = u, r = m, i = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (s = d + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else p.top > e.top && !l && p.left <= e.left && p.right >= e.left && (l = u, c = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (s = d + 1);
    }
  }
  return !t && l && (t = l, i = c, r = 0), t && t.nodeType == 3 ? Zx(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : sp(t, i);
}
function Zx(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = Kt(r, 1);
    if (o.top != o.bottom && Al(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function Al(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Qx(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function e1(n, e, t) {
  let { node: r, offset: i } = sp(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function t1(n, e, t, r) {
  let i = -1;
  for (let s = e, o = !1; s != n.dom; ) {
    let a = n.docView.nearestDesc(s, !0), l;
    if (!a)
      return null;
    if (a.dom.nodeType == 1 && (a.node.isBlock && a.parent || !a.contentDOM) && // Ignore elements with zero-size bounding rectangles
    ((l = a.dom.getBoundingClientRect()).width || l.height) && (a.node.isBlock && a.parent && !/^T(R|BODY|HEAD|FOOT)$/.test(a.dom.nodeName) && (!o && l.left > r.left || l.top > r.top ? i = a.posBefore : (!o && l.right < r.left || l.bottom < r.top) && (i = a.posAfter), o = !0), !a.contentDOM && i < 0 && !a.node.isText))
      return (a.node.isBlock ? r.top < (l.top + l.bottom) / 2 : r.left < (l.left + l.right) / 2) ? a.posBefore : a.posAfter;
    s = a.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, -1);
}
function op(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let a = o.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (Al(e, c))
            return op(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function n1(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = jx(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), a;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!Al(e, c) || (o = op(n.dom, e, c), !o))
      return null;
  }
  if (Le)
    for (let c = o; r && c; c = cr(c))
      c.draggable && (r = void 0);
  if (o = Qx(o, e), r) {
    if (dt && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    ki && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? a = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (a = t1(n, r, i, e));
  }
  a == null && (a = e1(n, o, e));
  let l = n.docView.nearestDesc(o, !0);
  return { pos: a, inside: l ? l.posAtStart - l.border : -1 };
}
function wu(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Kt(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (wu(r))
      return r;
  }
  return Array.prototype.find.call(t, wu) || n.getBoundingClientRect();
}
const r1 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ap(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = ki || dt;
  if (r.nodeType == 3)
    if (o && (r1.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = Kt(Pt(r, i, i), t);
      if (dt && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Kt(Pt(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = Kt(Pt(r, i, i + 1), -1);
          if (u.top != l.top)
            return Tr(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, Tr(Kt(Pt(r, l, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == ut(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return Lo(l.getBoundingClientRect(), !1);
    }
    if (s == null && i < ut(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return Lo(l.getBoundingClientRect(), !0);
    }
    return Lo(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == ut(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? Pt(l, ut(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return Tr(Kt(c, 1), !1);
  }
  if (s == null && i < ut(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? Pt(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return Tr(Kt(c, -1), !0);
  }
  return Tr(Kt(r.nodeType == 3 ? Pt(r) : r, -t), t >= 0);
}
function Tr(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Lo(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function lp(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function i1(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return lp(n, e, () => {
    let { node: s } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let a = n.docView.nearestDesc(s, !0);
      if (!a)
        break;
      if (a.node.isBlock) {
        s = a.contentDOM || a.dom;
        break;
      }
      s = a.dom.parentNode;
    }
    let o = ap(n, i.pos, 1);
    for (let a = s.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = Pt(a, 0, a.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < l.length; c++) {
        let u = l[c];
        if (u.bottom > u.top + 1 && (t == "up" ? o.top - u.top > (u.bottom - o.top) * 2 : u.bottom - o.bottom > (o.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const s1 = /[\u0590-\u08ac]/;
function o1(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, a = n.domSelection();
  return a ? !s1.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? s : o : lp(n, e, () => {
    let { focusNode: l, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), f = a.caretBidiLevel;
    a.modify("move", t, "character");
    let h = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !h.contains(p.nodeType == 1 ? p : p.parentNode) || l == p && c == m;
    try {
      a.collapse(u, d), l && (l != u || c != d) && a.extend && a.extend(l, c);
    } catch {
    }
    return f != null && (a.caretBidiLevel = f), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let xu = null, Su = null, Cu = !1;
function a1(n, e, t) {
  return xu == e && Su == t ? Cu : (xu = e, Su = t, Cu = t == "up" || t == "down" ? i1(n, e, t) : o1(n, e, t));
}
const ft = 0, Tu = 1, yn = 2, At = 3;
class wi {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = ft, r.pmViewDesc = this;
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
      i = t > Oe(this.contentDOM);
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
            let a = i.children[o];
            if (a.size) {
              i = a;
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
      let o = this.children[r], a = s + o.size;
      if (a > e || o instanceof up) {
        i = e - s;
        break;
      }
      s = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof cp && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Oe(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Oe(s.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, s = -1;
    for (let o = r, a = 0; ; a++) {
      let l = this.children[a], c = o + l.size;
      if (i == -1 && e <= c) {
        let u = o + l.border;
        if (e >= u && t <= c - l.border && l.node && l.contentDOM && this.contentDOM.contains(l.contentDOM))
          return l.parseRange(e, t, u);
        e = o;
        for (let d = a; d > 0; d--) {
          let f = this.children[d - 1];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(1)) {
            i = Oe(f.dom) + 1;
            break;
          }
          e -= f.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || a == this.children.length - 1)) {
        t = c;
        for (let u = a + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            s = Oe(d.dom);
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
    let a = this.domFromPos(e, e ? -1 : 1), l = t == e ? a : this.domFromPos(t, t ? -1 : 1), c = r.root.getSelection(), u = r.domSelectionRange(), d = !1;
    if ((dt || Le) && e == t) {
      let { node: h, offset: p } = a;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (a = l = { node: g.parentNode, offset: Oe(g) + 1 });
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
    if (dt && u.focusNode && u.focusNode != l.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Le) && _n(a.node, a.offset, u.anchorNode, u.anchorOffset) && _n(l.node, l.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && dt)) {
      c.collapse(a.node, a.offset);
      try {
        e != t && c.extend(l.node, l.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > t) {
        let p = a;
        a = l, l = p;
      }
      let h = document.createRange();
      h.setEnd(l.node, l.offset), h.setStart(a.node, a.offset), c.removeAllRanges(), c.addRange(h);
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
        let a = r + s.border, l = o - s.border;
        if (e >= a && t <= l) {
          this.dirty = e == r || t == o ? yn : Tu, e == a && t == l && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = At : s.markDirty(e - a, t - a);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? yn : At;
      }
      r = o;
    }
    this.dirty = yn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? yn : Tu;
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
class cp extends wi {
  constructor(e, t, r, i) {
    let s, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!s)
        return i;
      if (s.parent)
        return s.parent.posBeforeChild(s);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let a = document.createElement("span");
        a.appendChild(o), o = a;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, s = this;
  }
  matchesWidget(e) {
    return this.dirty == ft && e.type.eq(this.widget.type);
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
class l1 extends wi {
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
class Pn extends wi {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Ln.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new Pn(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & At || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != At && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != ft) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = ft;
    }
  }
  slice(e, t, r) {
    let i = Pn.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = _a(s, t, o, r)), e > 0 && (s = _a(s, 0, e, r));
    for (let a = 0; a < s.length; a++)
      s[a].parent = i;
    return i.children = s, i;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
}
class tn extends wi {
  constructor(e, t, r, i, s, o, a, l, c) {
    super(e, [], s, o), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = a;
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
    let a = s.nodeViews[t.type.name], l, c = a && a(t, s, () => {
      if (!l)
        return o;
      if (l.parent)
        return l.parent.posBeforeChild(l);
    }, r, i), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else u || ({ dom: u, contentDOM: d } = Ln.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = hp(u, r, t), c ? l = new c1(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new Zs(e, t, r, i, u, f, s) : new tn(e, t, r, i, u, d || null, f, s, o + 1);
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
      e.contentElement || (e.getContent = () => P.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == ft && e.eq(this.node) && bs(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, a = s && s.pos < 0, l = new d1(this, o && o.node, e);
    p1(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? oe.none : this.node.child(u).marks, r, e, u), l.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      l.syncToMarks(c.marks, r, e, f);
      let h;
      l.findNodeMatch(c, u, d, f) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = l.findIndexWithChild(s.node)) > -1 && l.updateNodeAt(c, u, d, h, e) || l.updateNextNode(c, u, d, e, f, i) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == yn) && (o && this.protectLocalComposition(e, o), dp(this.contentDOM, this.children, e), ur && m1(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof Y) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, a = g1(this.node.content, o, r - t, i - t);
      return a < 0 ? null : { node: s, pos: a, text: o };
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
    let o = new l1(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = _a(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == At || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = ft;
  }
  updateOuterDeco(e) {
    if (bs(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = fp(this.dom, this.nodeDOM, Da(this.outerDeco, this.node, t), Da(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function Eu(n, e, t, r, i) {
  hp(r, e, n);
  let s = new tn(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Zs extends tn {
  constructor(e, t, r, i, s, o, a) {
    super(e, t, r, i, s, null, o, a, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == At || this.dirty != ft && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != ft || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = ft, !0);
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
    return new Zs(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = At);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class up extends wi {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == ft && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class c1 extends tn {
  constructor(e, t, r, i, s, o, a, l, c, u) {
    super(e, t, r, i, s, o, a, c, u), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == At)
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
function dp(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], a = o.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = Mu(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (o instanceof Pn) {
      let l = r ? r.previousSibling : n.lastChild;
      dp(o.contentDOM, o.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = Mu(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Br = function(n) {
  n && (this.nodeName = n);
};
Br.prototype = /* @__PURE__ */ Object.create(null);
const vn = [new Br()];
function Da(n, e, t) {
  if (n.length == 0)
    return vn;
  let r = t ? vn[0] : new Br(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Br(o.nodeName));
      for (let a in o) {
        let l = o[a];
        l != null && (t && i.length == 1 && i.push(r = new Br(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function fp(n, e, t, r) {
  if (t == vn && r == vn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], a = t[s];
    if (s) {
      let l;
      a && a.nodeName == o.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = vn[0]), i = l;
    }
    u1(i, a || vn[0], o);
  }
  return i;
}
function u1(n, e, t) {
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
function hp(n, e, t) {
  return fp(n, n, vn, Da(e, t, n.nodeType != 1));
}
function bs(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function Mu(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class d1 {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = f1(e.node.content, e);
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
    let s = 0, o = this.stack.length >> 1, a = Math.min(o, e.length);
    for (; s < a && (s == o - 1 ? this.top : this.stack[s + 1 << 1]).matchesMark(e[s]) && e[s].type.spec.spanning !== !1; )
      s++;
    for (; s < o; )
      this.destroyRest(), this.top.dirty = ft, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
    for (; o < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1, c = this.top.children.length;
      i < this.preMatch.index && (c = Math.min(this.index + 3, c));
      for (let u = this.index; u < c; u++) {
        let d = this.top.children[u];
        if (d.matchesMark(e[o]) && !this.isLocked(d.dom)) {
          l = u;
          break;
        }
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let u = Pn.create(this.top, e[o], t, r);
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
      for (let a = this.index, l = Math.min(this.top.children.length, a + 5); a < l; a++) {
        let c = this.top.children[a];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          s = a;
          break;
        }
      }
    return s < 0 ? !1 : (this.destroyBetween(this.index, s), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, s) {
    let o = this.top.children[i];
    return o.dirty == At && o.dom == o.contentDOM && (o.dirty = yn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
    for (let a = this.index; a < this.top.children.length; a++) {
      let l = this.top.children[a];
      if (l instanceof tn) {
        let c = this.preMatch.matched.get(l);
        if (c != null && c != s)
          return !1;
        let u = l.dom, d, f = this.isLocked(u) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != At && bs(t, l.outerDeco));
        if (!f && l.update(e, t, r, i))
          return this.destroyBetween(this.index, a), l.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(l, e, t, r, i, o)))
          return this.destroyBetween(this.index, a), this.top.children[this.index] = d, d.contentDOM && (d.dirty = yn, d.updateChildren(i, o + 1), d.dirty = ft), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !bs(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let a = tn.create(this.top, t, r, i, s, o);
    if (a.contentDOM) {
      a.children = e.children, e.children = [];
      for (let l of a.children)
        l.parent = a;
    }
    return e.destroy(), a;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = tn.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new cp(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Pn; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Zs) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Le || _e) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new up(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function f1(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let a;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Pn)
          t = c, r = c.children.length;
        else {
          a = c, r--;
          break;
        }
      } else {
        if (t == e)
          break e;
        r = t.parent.children.indexOf(t), t = t.parent;
      }
    let l = a.node;
    if (l) {
      if (l != n.child(i - 1))
        break;
      --i, s.set(a, i), o.push(a);
    }
  }
  return { index: i, matched: s, matches: o.reverse() };
}
function h1(n, e) {
  return n.type.side - e.type.side;
}
function p1(n, e, t, r) {
  let i = e.locals(n), s = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, i, e.forChild(s, u), c), s += u.nodeSize;
    }
    return;
  }
  let o = 0, a = [], l = null;
  for (let c = 0; ; ) {
    let u, d;
    for (; o < i.length && i[o].to == s; ) {
      let g = i[o++];
      g.widget && (u ? (d || (d = [u])).push(g) : u = g);
    }
    if (u)
      if (d) {
        d.sort(h1);
        for (let g = 0; g < d.length; g++)
          t(d[g], c, !!l);
      } else
        t(u, c, !!l);
    let f, h;
    if (l)
      h = -1, f = l, l = null;
    else if (c < n.childCount)
      h = c, f = n.child(c++);
    else
      break;
    for (let g = 0; g < a.length; g++)
      a[g].to <= s && a.splice(g--, 1);
    for (; o < i.length && i[o].from <= s && i[o].to > s; )
      a.push(i[o++]);
    let p = s + f.nodeSize;
    if (f.isText) {
      let g = p;
      o < i.length && i[o].from < g && (g = i[o].from);
      for (let y = 0; y < a.length; y++)
        a[y].to < g && (g = a[y].to);
      g < p && (l = f.cut(g - s), f = f.cut(0, g - s), p = g, h = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = f.isInline && !f.isLeaf ? a.filter((g) => !g.inline) : a.slice();
    r(f, m, e.forChild(s, f), h), s = p;
  }
}
function m1(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function g1(n, e, t, r) {
  for (let i = 0, s = 0; i < n.childCount && s <= r; ) {
    let o = n.child(i++), a = s;
    if (s += o.nodeSize, !o.isText)
      continue;
    let l = o.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (s += c.nodeSize, !c.isText)
        break;
      l += c.text;
    }
    if (s >= t) {
      if (s >= r && l.slice(r - e.length - a, r - a) == e)
        return r - e.length;
      let c = a < r ? l.lastIndexOf(e, r - a - 1) : -1;
      if (c >= 0 && c + e.length + a >= t)
        return a + c;
      if (t == r && l.length >= r + e.length - a && l.slice(r - a, r - a + e.length) == e)
        return r;
    }
  }
  return -1;
}
function _a(n, e, t, r, i) {
  let s = [];
  for (let o = 0, a = 0; o < n.length; o++) {
    let l = n[o], c = a, u = a += l.size;
    c >= t || u <= e ? s.push(l) : (c < e && s.push(l.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(l.slice(t - c, l.size, r)));
  }
  return s;
}
function Ol(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let a = r.resolve(o), l, c;
  if (Ys(t)) {
    for (l = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && X.isSelectable(d) && i.parent && !(d.isInline && Ux(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new X(o == f ? a : r.resolve(f));
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
      [l, o] = f == n.state.selection.anchor ? [f, d] : [d, f], a = r.resolve(o);
    } else
      l = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (l < 0)
      return null;
  }
  let u = r.resolve(l);
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < a.pos && !s ? 1 : -1;
    c = Dl(n, u, a, d);
  }
  return c;
}
function pp(n) {
  return n.editable ? n.hasFocus() : gp(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function $t(n, e = !1) {
  let t = n.state.selection;
  if (mp(n, t), !!pp(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && _e) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && _n(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      v1(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      Au && !(t instanceof Y) && (t.$from.parent.inlineContent || (s = Ou(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = Ou(n, t.to))), n.docView.setSelection(r, i, n, e), Au && (s && Du(s), o && Du(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && y1(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const Au = Le || _e && tp < 63;
function Ou(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Le && i && i.contentEditable == "false")
    return zo(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return zo(i);
    if (s)
      return zo(s);
  }
}
function zo(n) {
  return n.contentEditable = "true", Le && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function Du(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function y1(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!pp(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function v1(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Oe(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && et && en <= 11 && (t.disabled = !0, t.disabled = !1);
}
function mp(n, e) {
  if (e instanceof X) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (_u(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    _u(n);
}
function _u(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Dl(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || Y.between(e, t, r);
}
function Pu(n) {
  return n.editable && !n.hasFocus() ? !1 : gp(n);
}
function gp(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function b1(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return _n(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Pa(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && Q.findFrom(s, e);
}
function Jt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Ru(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Jt(n, new Y(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Pa(n.state, e);
        return i && i instanceof X ? Jt(n, i) : !1;
      } else if (!(ct && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let a = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(a)) && !o.contentDOM ? X.isSelectable(s) ? Jt(n, new X(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : ki ? Jt(n, new Y(n.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof X && r.node.isInline)
      return Jt(n, new Y(e > 0 ? r.$to : r.$from));
    {
      let i = Pa(n.state, e);
      return i ? Jt(n, i) : !1;
    }
  }
}
function ks(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Lr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function jn(n, e) {
  return e < 0 ? k1(n) : w1(n);
}
function k1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (dt && t.nodeType == 1 && r < ks(t) && Lr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (Lr(a, -1))
          i = t, s = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (yp(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && Lr(a, -1); )
          i = t.parentNode, s = Oe(a), a = a.previousSibling;
        if (a)
          t = a, r = ks(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Ra(n, t, r) : i && Ra(n, i, s);
}
function w1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = ks(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (Lr(a, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (yp(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && Lr(a, 1); )
          s = a.parentNode, o = Oe(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = ks(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && Ra(n, s, o);
}
function yp(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function x1(n, e) {
  for (; n && e == n.childNodes.length && !bi(n); )
    e = Oe(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function S1(n, e) {
  for (; n && !e && !bi(n); )
    e = Oe(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Ra(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = x1(e, t)) ? (e = o, t = 0) : (s = S1(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Ys(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && $t(n);
  }, 50);
}
function Iu(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(_e || np) && t.parent.inlineContent) {
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
function Nu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y && !r.empty || t.indexOf("s") > -1 || ct && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Pa(n.state, e);
    if (o && o instanceof X)
      return Jt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof Qe ? Q.near(o, e) : Q.findFrom(o, e);
    return a ? Jt(n, a) : !1;
  }
  return !1;
}
function $u(n, e) {
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
function Bu(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function C1(n) {
  if (!Le || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Bu(n, r, "true"), setTimeout(() => Bu(n, r, "false"), 20);
  }
  return !1;
}
function T1(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function E1(n, e) {
  let t = e.keyCode, r = T1(e);
  if (t == 8 || ct && t == 72 && r == "c")
    return $u(n, -1) || jn(n, -1);
  if (t == 46 && !e.shiftKey || ct && t == 68 && r == "c")
    return $u(n, 1) || jn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || ct && t == 66 && r == "c") {
    let i = t == 37 ? Iu(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Ru(n, i, r) || jn(n, i);
  } else if (t == 39 || ct && t == 70 && r == "c") {
    let i = t == 39 ? Iu(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Ru(n, i, r) || jn(n, i);
  } else {
    if (t == 38 || ct && t == 80 && r == "c")
      return Nu(n, -1, r) || jn(n, -1);
    if (t == 40 || ct && t == 78 && r == "c")
      return C1(n) || Nu(n, 1, r) || jn(n, 1);
    if (r == (ct ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function _l(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || Ln.fromSchema(n.state.schema), a = Sp(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = xp[c.nodeName.toLowerCase()]); ) {
    for (let h = u.length - 1; h >= 0; h--) {
      let p = a.createElement(u[h]);
      for (; l.firstChild; )
        p.appendChild(l.firstChild);
      l.appendChild(p), d++;
    }
    c = l.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let f = n.someProp("clipboardTextSerializer", (h) => h(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: f, slice: e };
}
function vp(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!t && !e)
    return null;
  let l = !!e && (r || s || !t);
  if (l) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return a = new z(P.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        a = f(a, n, !0);
      }), a;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      a = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = Ln.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = D1(t), ki && _1(o);
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
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || Nr.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !M1.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = P1(Lu(a, +u[1], +u[2]), u[4]);
  else if (a = z.maxOpen(A1(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, f = 0;
    for (let h = a.content.firstChild; d < a.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = a.content.lastChild; f < a.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    a = Lu(a, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n, l);
  }), a;
}
const M1 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function A1(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), s, o = [];
    if (n.forEach((a) => {
      if (!o)
        return;
      let l = i.findWrapping(a.type), c;
      if (!l)
        return o = null;
      if (c = o.length && s.length && kp(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = wp(o[o.length - 1], s.length));
        let u = bp(a, l);
        o.push(u), i = i.matchType(u.type), s = l;
      }
    }), o)
      return P.from(o);
  }
  return n;
}
function bp(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, P.from(n));
  return n;
}
function kp(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = kp(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(P.from(bp(t, n, i + 1))));
  }
}
function wp(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, wp(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(P.empty, !0);
  return n.copy(t.append(r));
}
function Ia(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, a = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (a = Ia(a, e, t, r, i + 1, s)), i >= t && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(P.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(a));
}
function Lu(n, e, t) {
  return e < n.openStart && (n = new z(Ia(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new z(Ia(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const xp = {
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
let zu = null;
function Sp() {
  return zu || (zu = document.implementation.createHTMLDocument("title"));
}
let Fo = null;
function O1(n) {
  let e = window.trustedTypes;
  return e ? (Fo || (Fo = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Fo.createHTML(n)) : n;
}
function D1(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Sp().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && xp[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = O1(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function _1(n) {
  let e = n.querySelectorAll(_e ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function P1(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: s, openEnd: o } = n;
  for (let a = r.length - 2; a >= 0; a -= 2) {
    let l = t.nodes[r[a]];
    if (!l || l.hasRequiredAttrs())
      break;
    i = P.from(l.create(r[a + 1], i)), s++, o++;
  }
  return new z(i, s, o);
}
const je = {}, He = {}, R1 = { touchstart: !0, touchmove: !0 };
class I1 {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function N1(n) {
  for (let e in je) {
    let t = je[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      B1(n, r) && !Pl(n, r) && (n.editable || !(r.type in He)) && t(n, r);
    }, R1[e] ? { passive: !0 } : void 0);
  }
  Le && n.dom.addEventListener("input", () => null), Na(n);
}
function Qt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function $1(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Na(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Pl(n, r));
  });
}
function Pl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function B1(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function L1(n, e) {
  !Pl(n, e) && je[e.type] && (n.editable || !(e.type in He)) && je[e.type](n, e);
}
He.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Tp(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Rt && _e && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), ur && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, pn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || E1(n, t) ? t.preventDefault() : Qt(n, "key");
};
He.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
He.keypress = (n, e) => {
  let t = e;
  if (Tp(n, t) || !t.charCode || t.ctrlKey && !t.altKey || ct && t.metaKey)
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
function Qs(n) {
  return { left: n.clientX, top: n.clientY };
}
function z1(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Rl(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (a) => o > s.depth ? a(n, t, s.nodeAfter, s.before(o), i, !0) : a(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function nr(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function F1(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && X.isSelectable(r) ? (nr(n, new X(t)), !0) : !1;
}
function V1(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof X && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let a = o > s.depth ? s.nodeAfter : s.node(o);
    if (X.isSelectable(a)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (nr(n, X.create(n.state.doc, i)), !0) : !1;
}
function q1(n, e, t, r, i) {
  return Rl(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? V1(n, t) : F1(n, t));
}
function U1(n, e, t, r) {
  return Rl(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function W1(n, e, t, r) {
  return Rl(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || j1(n, t, r);
}
function j1(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (nr(n, Y.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      nr(n, Y.create(r, a + 1, a + 1 + o.content.size));
    else if (X.isSelectable(o))
      nr(n, X.create(r, a));
    else
      continue;
    return !0;
  }
}
function Il(n) {
  return ws(n);
}
const Cp = ct ? "metaKey" : "ctrlKey";
je.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Il(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && z1(t, n.input.lastClick) && !t[Cp] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Qs(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new H1(n, o, t, !!r)) : (s == "doubleClick" ? U1 : W1)(n, o.pos, o.inside, t) ? t.preventDefault() : Qt(n, "pointer"));
};
class H1 {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Cp], this.allowDefault = r.shiftKey;
    let s, o;
    if (t.inside > -1)
      s = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      s = u.parent, o = u.depth ? u.before() : 0;
    }
    const a = i ? null : r.target, l = a ? e.docView.nearestDesc(a, !0) : null;
    this.target = l && l.nodeDOM.nodeType == 1 ? l.nodeDOM : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof X && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && dt && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Qt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => $t(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Qs(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Qt(this.view, "pointer") : q1(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Le && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    _e && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (nr(this.view, Q.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Qt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Qt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
je.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Il(n), Qt(n, "pointer");
};
je.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Qt(n, "pointer");
};
je.contextmenu = (n) => Il(n);
function Tp(n, e) {
  return n.composing ? !0 : Le && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const K1 = Rt ? 5e3 : -1;
He.compositionstart = He.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof Y && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || _e && np && J1(n)))
      n.markCursor = n.state.storedMarks || t.marks(), ws(n, !0), n.markCursor = null;
    else if (ws(n, !e.selection.empty), dt && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, s = r.focusOffset; i && i.nodeType == 1 && s != 0; ) {
        let o = s < 0 ? i.lastChild : i.childNodes[s - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          let a = n.domSelection();
          a && a.collapse(o, o.nodeValue.length);
          break;
        } else
          i = o, s = -1;
      }
    }
    n.input.composing = !0;
  }
  Ep(n, K1);
};
function J1(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
He.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Ep(n, 20));
};
function Ep(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => ws(n), e));
}
function Mp(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = G1()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function X1(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Vx(e.focusNode, e.focusOffset), r = qx(e.focusNode, e.focusOffset);
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
function G1() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function ws(n, e = !1) {
  if (!(Rt && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Mp(n), e || n.docView && n.docView.dirty) {
      let t = Ol(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Y1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Yr = et && en < 15 || ur && Hx < 604;
je.copy = He.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Yr ? null : t.clipboardData, o = r.content(), { dom: a, text: l } = _l(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : Y1(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Z1(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Q1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Zr(n, r.value, null, i, e) : Zr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Zr(n, e, t, r, i) {
  let s = vp(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, s || z.empty)))
    return !0;
  if (!s)
    return !1;
  let o = Z1(s), a = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Ap(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
He.paste = (n, e) => {
  let t = e;
  if (n.composing && !Rt)
    return;
  let r = Yr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Zr(n, Ap(r), r.getData("text/html"), i, t) ? t.preventDefault() : Q1(n, t);
};
class Op {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const eS = ct ? "altKey" : "ctrlKey";
function Dp(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[eS];
}
je.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Qs(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof X ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = X.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = X.create(n.state.doc, d.posBefore));
    }
  }
  let a = (o || n.state.selection).content(), { dom: l, text: c, slice: u } = _l(n, a);
  (!t.dataTransfer.files.length || !_e || tp > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Yr ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Yr || t.dataTransfer.setData("text/plain", c), n.dragging = new Op(u, Dp(n, t), o);
};
je.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
He.dragover = He.dragenter = (n, e) => e.preventDefault();
He.drop = (n, e) => {
  try {
    tS(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function tS(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Qs(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = vp(n, Ap(e.dataTransfer), Yr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && Dp(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || z.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let a = s ? cx(n.state.doc, i.pos, s) : i.pos;
  a == null && (a = i.pos);
  let l = n.state.tr;
  if (o) {
    let { node: h } = t;
    h ? h.replace(l) : l.deleteSelection();
  }
  let c = l.mapping.map(a), u = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1, d = l.doc;
  if (u ? l.replaceRangeWith(c, c, s.content.firstChild) : l.replaceRange(c, c, s), l.doc.eq(d))
    return;
  let f = l.doc.resolve(c);
  if (u && X.isSelectable(s.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(s.content.firstChild))
    l.setSelection(new X(f));
  else {
    let h = l.mapping.map(a);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((p, m, g, y) => h = y), l.setSelection(Dl(n, f, l.doc.resolve(h)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
je.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && $t(n);
  }, 20));
};
je.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
je.beforeinput = (n, e) => {
  if (_e && Rt && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, pn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in He)
  je[n] = He[n];
function Qr(n, e) {
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
class xs {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || xn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new Xe(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof xs && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Qr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class nn {
  constructor(e, t) {
    this.attrs = e, this.spec = t || xn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new Xe(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof nn && Qr(this.attrs, e.attrs) && Qr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof nn;
  }
  destroy() {
  }
}
class Nl {
  constructor(e, t) {
    this.attrs = e, this.spec = t || xn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new Xe(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Nl && Qr(this.attrs, e.attrs) && Qr(this.spec, e.spec);
  }
  destroy() {
  }
}
class Xe {
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
    return new Xe(e, t, this.type);
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
    return new Xe(e, e, new xs(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new Xe(e, t, new nn(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new Xe(e, t, new Nl(r, i));
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
    return this.type instanceof nn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof xs;
  }
}
const Yn = [], xn = {};
class le {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Yn, this.children = t.length ? t : Yn;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Ss(t, e, 0, xn) : Ne;
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
      let a = this.local[o];
      a.from <= t && a.to >= e && (!s || s(a.spec)) && r.push(a.copy(a.from + i, a.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let a = this.children[o] + 1;
        this.children[o + 2].findInner(e - a, t - a, r, i + a, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Ne || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || xn);
  }
  /**
  @internal
  */
  mapInner(e, t, r, i, s) {
    let o;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a].map(e, r, i);
      l && l.type.valid(t, l) ? (o || (o = [])).push(l) : s.onRemove && s.onRemove(this.local[a].spec);
    }
    return this.children.length ? nS(this.children, o || [], e, t, r, i, s) : o ? new le(o.sort(Sn), Yn) : Ne;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Ne ? le.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (u = Pp(t, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, u, c + 1) : i.splice(s, 0, l, l + a.nodeSize, Ss(u, a, c + 1, xn)), s += 3;
      }
    });
    let o = _p(s ? Rp(t) : t, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new le(o.length ? this.local.concat(o).sort(Sn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Ne ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let o, a = r[s] + t, l = r[s + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > a && d.to < l && (e[u] = null, (o || (o = [])).push(d));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, a + 1);
      c != Ne ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new le(i, r) : Ne;
  }
  forChild(e, t) {
    if (this == Ne)
      return this;
    if (t.isLeaf)
      return le.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < o && l.to > s && l.type instanceof nn) {
        let c = Math.max(s, l.from) - s, u = Math.min(o, l.to) - s;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new le(i.sort(Sn), Yn);
      return r ? new Gt([a, r]) : a;
    }
    return r || Ne;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof le) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return $l(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Ne)
      return Yn;
    if (e.inlineContent || !this.local.some(nn.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof nn || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
le.empty = new le([], []);
le.removeOverlap = $l;
const Ne = le.empty;
class Gt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, xn));
    return Gt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return le.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Ne && (s instanceof Gt ? r = r.concat(s.members) : r.push(s));
    }
    return Gt.from(r);
  }
  eq(e) {
    if (!(e instanceof Gt) || e.members.length != this.members.length)
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
    return t ? $l(r ? t : t.sort(Sn)) : Yn;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Ne;
      case 1:
        return e[0];
      default:
        return new Gt(e.every((t) => t instanceof le) ? e : e.reduce((t, r) => t.concat(r instanceof le ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function nS(n, e, t, r, i, s, o) {
  let a = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let y = 0; y < a.length; y += 3) {
        let b = a[y + 1];
        if (b < 0 || f > b + u - d)
          continue;
        let v = a[y] + u - d;
        h >= v ? a[y + 1] = f <= v ? -2 : -1 : f >= u && g && (a[y] += g, a[y + 1] += g);
      }
      d += g;
    }), u = t.maps[c].map(u, -1);
  }
  let l = !1;
  for (let c = 0; c < a.length; c += 3)
    if (a[c + 1] < 0) {
      if (a[c + 1] == -2) {
        l = !0, a[c + 1] = -1;
        continue;
      }
      let u = t.map(n[c] + s), d = u - i;
      if (d < 0 || d >= r.content.size) {
        l = !0;
        continue;
      }
      let f = t.map(n[c + 1] + s, -1), h = f - i, { index: p, offset: m } = r.content.findIndex(d), g = r.maybeChild(p);
      if (g && m == d && m + g.nodeSize == h) {
        let y = a[c + 2].mapInner(t, g, u + 1, n[c] + s + 1, o);
        y != Ne ? (a[c] = d, a[c + 1] = h, a[c + 2] = y) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = rS(a, n, e, t, i, s, o), u = Ss(c, r, 0, o);
    e = u.local;
    for (let d = 0; d < a.length; d += 3)
      a[d + 1] < 0 && (a.splice(d, 3), d -= 3);
    for (let d = 0, f = 0; d < u.children.length; d += 3) {
      let h = u.children[d];
      for (; f < a.length && a[f] < h; )
        f += 3;
      a.splice(f, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new le(e.sort(Sn), a);
}
function _p(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new Xe(i.from + e, i.to + e, i.type));
  }
  return t;
}
function rS(n, e, t, r, i, s, o) {
  function a(l, c) {
    for (let u = 0; u < l.local.length; u++) {
      let d = l.local[u].map(r, i, c);
      d ? t.push(d) : o.onRemove && o.onRemove(l.local[u].spec);
    }
    for (let u = 0; u < l.children.length; u += 3)
      a(l.children[u + 2], l.children[u] + c + 1);
  }
  for (let l = 0; l < n.length; l += 3)
    n[l + 1] == -1 && a(n[l + 2], e[l] + s + 1);
  return t;
}
function Pp(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Rp(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Ss(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = Pp(n, a, l + t);
    if (c) {
      s = !0;
      let u = Ss(c, a, t + l + 1, r);
      u != Ne && i.push(l, l + a.nodeSize, u);
    }
  });
  let o = _p(s ? Rp(n) : n, -t).sort(Sn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new le(o, i) : Ne;
}
function Sn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function $l(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), Fu(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), Fu(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Fu(n, e, t) {
  for (; e < n.length && Sn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Vo(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Ne && e.push(r);
  }), n.cursorWrapper && e.push(le.create(n.state.doc, [n.cursorWrapper.deco])), Gt.from(e);
}
const iS = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, sS = et && en <= 11;
class oS {
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
class aS {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new oS(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      et && en <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Le && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), sS && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, iS)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (Pu(this.view)) {
      if (this.suppressingSelectionUpdates)
        return $t(this.view);
      if (et && en <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && _n(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = cr(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = cr(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && Pu(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, a = !1, l = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let d = this.registerMutation(t[u], l);
        d && (s = s < 0 ? d.from : Math.min(d.from, s), o = o < 0 ? d.to : Math.max(d.to, o), d.typeOver && (a = !0));
      }
    if (l.some((u) => u.nodeName == "BR") && (e.input.lastKeyCode == 8 || e.input.lastKeyCode == 46)) {
      for (let u of l)
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
    } else if (dt && l.length) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || uS(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ys(r) && (c = Ol(e)) && c.eq(Q.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, $t(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), lS(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, dS(e, l)), this.handleDOMChange(s, o, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || $t(e), this.currentSelection.set(r));
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
      if (et && en <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? Oe(i) + 1 : 0, a = r.localPosFromDOM(e.target, o, -1), l = s && s.parentNode == e.target ? Oe(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
      return { from: a, to: c };
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
let Vu = /* @__PURE__ */ new WeakMap(), qu = !1;
function lS(n) {
  if (!Vu.has(n) && (Vu.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = dt, qu)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), qu = !0;
  }
}
function Uu(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return _n(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function cS(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return Uu(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Uu(n, t) : null;
}
function uS(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function dS(n, e) {
  var t;
  let { focusNode: r, focusOffset: i } = n.domSelectionRange();
  for (let s of e)
    if (((t = s.parentNode) === null || t === void 0 ? void 0 : t.nodeName) == "TR") {
      let o = s.nextSibling;
      for (; o && o.nodeName != "TD" && o.nodeName != "TH"; )
        o = o.nextSibling;
      if (o) {
        let a = o;
        for (; ; ) {
          let l = a.firstChild;
          if (!l || l.nodeType != 1 || l.contentEditable == "false" || /^(BR|IMG)$/.test(l.nodeName))
            break;
          a = l;
        }
        a.insertBefore(s, a.firstChild), r == s && n.domSelection().collapse(s, i);
      } else
        s.parentNode.removeChild(s);
    }
}
function fS(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], Ys(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), _e && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let y = r.childNodes[g - 1], b = y.pmViewDesc;
      if (y.nodeName == "BR" && !b) {
        s = g;
        break;
      }
      if (!b || b.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || Nr.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: hS,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: a };
}
function hS(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Le && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Le && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const pS = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function mS(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let x = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, A = Ol(n, x);
    if (A && !n.state.selection.eq(A)) {
      if (_e && Rt && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (O) => O(n, pn(13, "Enter"))))
        return;
      let S = n.state.tr.setSelection(A);
      x == "pointer" ? S.setMeta("pointer", !0) : x == "key" && S.scrollIntoView(), s && S.setMeta("composition", s), n.dispatch(S);
    }
    return;
  }
  let o = n.state.doc.resolve(e), a = o.sharedDepth(t);
  e = o.before(a + 1), t = n.state.doc.resolve(t).after(a + 1);
  let l = n.state.selection, c = fS(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = vS(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (ur && n.input.lastIOSEnter > Date.now() - 225 || Rt) && i.some((x) => x.nodeType == 1 && !pS.test(x.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (x) => x(n, pn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && l instanceof Y && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (c.sel) {
        let x = Wu(n, n.state.doc, c.sel);
        if (x && !x.eq(n.state.selection)) {
          let A = n.state.tr.setSelection(x);
          s && A.setMeta("composition", s), n.dispatch(A);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof Y && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), et && en <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = u.resolve(p.start), b = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA;
  if ((ur && n.input.lastIOSEnter > Date.now() - 225 && (!b || i.some((x) => x.nodeName == "DIV" || x.nodeName == "P")) || !b && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (x) => x(n, pn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && yS(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (x) => x(n, pn(8, "Backspace")))) {
    Rt && _e && n.domObserver.suppressSelectionUpdates();
    return;
  }
  _e && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Rt && !b && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(x) {
      return x(n, pn(13, "Enter"));
    });
  }, 20));
  let v = p.start, w = p.endA, C = (x) => {
    let A = x || n.state.tr.replace(v, w, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let S = Wu(n, A.doc, c.sel);
      S && !(_e && n.composing && S.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (S.head == v || S.head == A.mapping.map(w) - 1) || et && S.empty && S.head == v) && A.setSelection(S);
    }
    return s && A.setMeta("composition", s), A.scrollIntoView();
  }, M;
  if (b)
    if (m.pos == g.pos) {
      et && en <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => $t(n), 20));
      let x = C(n.state.tr.delete(v, w)), A = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      A && x.ensureMarks(A), n.dispatch(x);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (M = gS(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    ) {
      let x = C(n.state.tr);
      M.type == "add" ? x.addMark(v, w, M.mark) : x.removeMark(v, w, M.mark), n.dispatch(x);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let x = m.parent.textBetween(m.parentOffset, g.parentOffset), A = () => C(n.state.tr.insertText(x, v, w));
      n.someProp("handleTextInput", (S) => S(n, v, w, x, A)) || n.dispatch(A());
    } else
      n.dispatch(C());
  else
    n.dispatch(C());
}
function Wu(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Dl(n, e.resolve(t.anchor), e.resolve(t.head));
}
function gS(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, s = r, o, a, l;
  for (let u = 0; u < r.length; u++)
    i = r[u].removeFromSet(i);
  for (let u = 0; u < t.length; u++)
    s = t[u].removeFromSet(s);
  if (i.length == 1 && s.length == 0)
    a = i[0], o = "add", l = (u) => u.mark(a.addToSet(u.marks));
  else if (i.length == 0 && s.length == 1)
    a = s[0], o = "remove", l = (u) => u.mark(a.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(l(e.child(u)));
  if (P.from(c).eq(n))
    return { mark: a, type: o };
}
function yS(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    qo(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let a = s.nodeAfter;
    return a != null && t == e + a.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(qo(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || qo(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function qo(n, e, t) {
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
function vS(n, e, t, r, i) {
  let s = n.findDiffStart(e, t);
  if (s == null)
    return null;
  let { a: o, b: a } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let l = Math.max(0, s - Math.min(o, a));
    r -= o + l - s;
  }
  if (o < s && n.size < e.size) {
    let l = r <= s && r >= o ? s - r : 0;
    s -= l, s && s < e.size && ju(e.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), a = s + (a - o), o = s;
  } else if (a < s) {
    let l = r <= s && r >= a ? s - r : 0;
    s -= l, s && s < n.size && ju(n.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), o = s + (o - a), a = s;
  }
  return { start: s, endA: o, endB: a };
}
function ju(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Ip {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new I1(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Gu), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Ju(this), Ku(this), this.nodeViews = Xu(this), this.docView = Eu(this.state.doc, Hu(this), Vo(this), this.dom, this), this.domObserver = new aS(this, (r, i, s, o) => mS(this, r, i, s, o)), this.domObserver.start(), N1(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && Na(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Gu), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (Mp(this), o = !0), this.state = e;
    let a = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = Xu(this);
      kS(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (a || t.handleDOMEvents != this._props.handleDOMEvents) && Na(this), this.editable = Ju(this), Ku(this);
    let l = Vo(this), c = Hu(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, l);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && Xx(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (et || _e) && !this.composing && !i.selection.empty && !e.selection.empty && bS(i.selection, e.selection);
      if (d) {
        let p = _e ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = X1(this)), (s || !this.docView.update(e.doc, c, l, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = Eu(e.doc, c, l, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && b1(this)) ? $t(this, h) : (mp(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && Gx(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof X) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && ku(this, t.getBoundingClientRect(), e);
      } else
        ku(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new Op(e.slice, e.move, i < 0 ? void 0 : X.create(this.state.doc, i));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let a = this.directPlugins[o].props[e];
      if (a != null && (i = t ? t(a) : a))
        return i;
    }
    let s = this.state.plugins;
    if (s)
      for (let o = 0; o < s.length; o++) {
        let a = s[o].props[e];
        if (a != null && (i = t ? t(a) : a))
          return i;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (et) {
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
    this.domObserver.stop(), this.editable && Yx(this.dom), $t(this), this.domObserver.start();
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
    return n1(this, e);
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
    return ap(this, e, t);
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
    return a1(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Zr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Zr(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return _l(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && ($1(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Vo(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, zx());
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
    return L1(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Le && this.root.nodeType === 11 && Wx(this.dom.ownerDocument) == this.dom && cS(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Ip.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function Hu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [Xe.node(0, n.state.doc.content.size, e)];
}
function Ku(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: Xe.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Ju(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function bS(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Xu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function kS(n, e) {
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
function Gu(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var ln = {
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
}, Cs = {
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
}, wS = typeof navigator < "u" && /Mac/.test(navigator.platform), xS = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var De = 0; De < 10; De++) ln[48 + De] = ln[96 + De] = String(De);
for (var De = 1; De <= 24; De++) ln[De + 111] = "F" + De;
for (var De = 65; De <= 90; De++)
  ln[De] = String.fromCharCode(De + 32), Cs[De] = String.fromCharCode(De);
for (var Uo in ln) Cs.hasOwnProperty(Uo) || (Cs[Uo] = ln[Uo]);
function SS(n) {
  var e = wS && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || xS && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Cs : ln)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const CS = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), TS = typeof navigator < "u" && /Win/.test(navigator.platform);
function ES(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, s, o;
  for (let a = 0; a < e.length - 1; a++) {
    let l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      o = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      s = !0;
    else if (/^mod$/i.test(l))
      CS ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function MS(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[ES(t)] = n[t];
  return e;
}
function Wo(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function AS(n) {
  return new Ie({ props: { handleKeyDown: OS(n) } });
}
function OS(n) {
  let e = MS(n);
  return function(t, r) {
    let i = SS(r), s, o = e[Wo(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[Wo(i, r, !1)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(TS && r.ctrlKey && r.altKey) && (s = ln[r.keyCode]) && s != i) {
        let a = e[Wo(s, r)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var DS = Object.defineProperty, Bl = (n, e) => {
  for (var t in e)
    DS(n, t, { get: e[t], enumerable: !0 });
};
function eo(n) {
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
var to = class {
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
      Object.entries(n).map(([o, a]) => [o, (...c) => {
        const u = a(...c)(s);
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
    const { rawCommands: t, editor: r, state: i } = this, { view: s } = r, o = [], a = !!n, l = n || i.tr, c = () => (!a && e && !l.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(l), o.every((d) => d === !0)), u = {
      ...Object.fromEntries(
        Object.entries(t).map(([d, f]) => [d, (...p) => {
          const m = this.buildProps(l, e), g = f(...p)(m);
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
        Object.entries(e).map(([a, l]) => [a, (...c) => l(...c)({ ...s, dispatch: void 0 })])
      ),
      chain: () => this.createChain(i, r)
    };
  }
  buildProps(n, e = !0) {
    const { rawCommands: t, editor: r, state: i } = this, { view: s } = r, o = {
      tr: n,
      editor: r,
      view: s,
      state: eo({
        state: i,
        transaction: n
      }),
      dispatch: e ? () => {
      } : void 0,
      chain: () => this.createChain(n, e),
      can: () => this.createCan(n),
      get commands() {
        return Object.fromEntries(
          Object.entries(t).map(([a, l]) => [a, (...c) => l(...c)(o)])
        );
      }
    };
    return o;
  }
}, Np = {};
Bl(Np, {
  blur: () => _S,
  clearContent: () => PS,
  clearNodes: () => RS,
  command: () => IS,
  createParagraphNear: () => NS,
  cut: () => $S,
  deleteCurrentNode: () => BS,
  deleteNode: () => LS,
  deleteRange: () => zS,
  deleteSelection: () => FS,
  enter: () => VS,
  exitCode: () => qS,
  extendMarkRange: () => US,
  first: () => WS,
  focus: () => HS,
  forEach: () => KS,
  insertContent: () => JS,
  insertContentAt: () => YS,
  joinBackward: () => eC,
  joinDown: () => QS,
  joinForward: () => tC,
  joinItemBackward: () => nC,
  joinItemForward: () => rC,
  joinTextblockBackward: () => iC,
  joinTextblockForward: () => sC,
  joinUp: () => ZS,
  keyboardShortcut: () => aC,
  lift: () => lC,
  liftEmptyBlock: () => cC,
  liftListItem: () => uC,
  newlineInCode: () => dC,
  resetAttributes: () => fC,
  scrollIntoView: () => hC,
  selectAll: () => pC,
  selectNodeBackward: () => mC,
  selectNodeForward: () => gC,
  selectParentNode: () => yC,
  selectTextblockEnd: () => vC,
  selectTextblockStart: () => bC,
  setContent: () => kC,
  setMark: () => zC,
  setMeta: () => FC,
  setNode: () => VC,
  setNodeSelection: () => qC,
  setTextDirection: () => UC,
  setTextSelection: () => WC,
  sinkListItem: () => jC,
  splitBlock: () => HC,
  splitListItem: () => KC,
  toggleList: () => JC,
  toggleMark: () => XC,
  toggleNode: () => GC,
  toggleWrap: () => YC,
  undoInputRule: () => ZC,
  unsetAllMarks: () => QC,
  unsetMark: () => eT,
  unsetTextDirection: () => tT,
  updateAttributes: () => nT,
  wrapIn: () => rT,
  wrapInList: () => iT
});
var _S = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), PS = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), RS = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = br(h);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, IS = (n) => (e) => n(e), NS = () => ({ state: n, dispatch: e }) => Xh(n, e), $S = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new Y(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, BS = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let s = i.depth; s > 0; s -= 1)
    if (i.node(s).type === r.type) {
      if (e) {
        const a = i.before(s), l = i.after(s);
        n.delete(a, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
};
function Ce(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var LS = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = Ce(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const l = s.before(o), c = s.after(o);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, zS = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, FS = () => ({ state: n, dispatch: e }) => Sl(n, e), VS = () => ({ commands: n }) => n.keyboardShortcut("Enter"), qS = () => ({ state: n, dispatch: e }) => Tx(n, e);
function Ll(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function Ts(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Ll(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function $p(n, e, t = {}) {
  return n.find((r) => r.type === e && Ts(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Yu(n, e, t = {}) {
  return !!$p(n, e, t);
}
function Bp(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !$p([...i.node.marks], e, t)))
    return;
  let o = i.index, a = n.start() + i.offset, l = o + 1, c = a + i.node.nodeSize;
  for (; o > 0 && Yu([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, a -= n.parent.child(o).nodeSize;
  for (; l < n.parent.childCount && Yu([...n.parent.child(l).marks], e, t); )
    c += n.parent.child(l).nodeSize, l += 1;
  return {
    from: a,
    to: c
  };
}
function Wt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var US = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = Wt(n, r.schema), { doc: o, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = Bp(l, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = Y.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, WS = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Lp(n) {
  return n instanceof Y;
}
function bn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function zp(n, e = null) {
  if (!e)
    return null;
  const t = Q.atStart(n), r = Q.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? Y.create(n, bn(0, i, s), bn(n.content.size, i, s)) : Y.create(n, bn(e, i, s), bn(e, i, s));
}
function $a() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function ei() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function jS() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var HS = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (ei() || $a()) && r.dom.focus(), jS() && !ei() && !$a() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !Lp(t.state.selection))
    return o(), !0;
  const a = zp(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, KS = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), JS = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Fp = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Fp(r);
  }
  return n;
};
function $i(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Fp(t);
}
function ti(n, e, t) {
  if (n instanceof It || n instanceof P)
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
        return P.fromArray(n.map((a) => e.nodeFromJSON(a)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (s) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), ti("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, a = "";
      const l = new xh({
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
                getAttrs: (c) => (o = !0, a = typeof c == "string" ? c : c.outerHTML, null)
              }
            ]
          }
        })
      });
      if (t.slice ? Nr.fromSchema(l).parseSlice($i(n), t.parseOptions) : Nr.fromSchema(l).parse($i(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${a}`)
        });
    }
    const s = Nr.fromSchema(e);
    return t.slice ? s.parseSlice($i(n), t.parseOptions).content : s.parse($i(n), t.parseOptions);
  }
  return ti("", e, t);
}
function XS(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof we || i instanceof Se))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
var GS = (n) => !("type" in n), YS = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
  var o;
  if (i) {
    t = {
      parseOptions: s.options.parseOptions,
      updateSelection: !0,
      applyInputRules: !1,
      applyPasteRules: !1,
      ...t
    };
    let a;
    const l = (g) => {
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
        ti(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        l(g);
      }
    try {
      a = ti(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return l(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((GS(a) ? a : [a]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof P) {
        let g = "";
        e.forEach((y) => {
          y.text && (g += y.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = a;
      const g = r.doc.resolve(u), y = g.node(), b = g.parentOffset === 0, v = y.isText || y.isTextblock, w = y.content.size > 0;
      b && v && w && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && XS(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, ZS = () => ({ state: n, dispatch: e }) => xx(n, e), QS = () => ({ state: n, dispatch: e }) => Sx(n, e), eC = () => ({ state: n, dispatch: e }) => qh(n, e), tC = () => ({ state: n, dispatch: e }) => Hh(n, e), nC = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Js(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, rC = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Js(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, iC = () => ({ state: n, dispatch: e }) => kx(n, e), sC = () => ({ state: n, dispatch: e }) => wx(n, e);
function Vp() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function oC(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, s, o;
  for (let a = 0; a < e.length - 1; a += 1) {
    const l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      o = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      s = !0;
    else if (/^mod$/i.test(l))
      ei() || Vp() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var aC = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = oC(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, a));
  });
  return l?.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function ni(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? Ce(e, n.schema) : null, a = [];
  n.doc.nodesBetween(r, i, (d, f) => {
    if (d.isText)
      return;
    const h = Math.max(r, f), p = Math.min(i, f + d.nodeSize);
    a.push({
      node: d,
      from: h,
      to: p
    });
  });
  const l = i - r, c = a.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => Ts(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
var lC = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Ce(n, t.schema);
  return ni(t, i, e) ? Cx(t, r) : !1;
}, cC = () => ({ state: n, dispatch: e }) => Gh(n, e), uC = (n) => ({ state: e, dispatch: t }) => {
  const r = Ce(n, e.schema);
  return Nx(r)(e, t);
}, dC = () => ({ state: n, dispatch: e }) => Jh(n, e);
function no(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Zu(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var fC = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = no(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Ce(n, r.schema)), a === "mark" && (o = Wt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (l = !0, i && t.setNodeMarkup(d, void 0, Zu(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (l = !0, i && t.addMark(d, d + u.nodeSize, o.create(Zu(f.attrs, e))));
      });
    });
  }), l;
}, hC = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), pC = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new Qe(n.doc);
    n.setSelection(t);
  }
  return !0;
}, mC = () => ({ state: n, dispatch: e }) => Wh(n, e), gC = () => ({ state: n, dispatch: e }) => Kh(n, e), yC = () => ({ state: n, dispatch: e }) => Mx(n, e), vC = () => ({ state: n, dispatch: e }) => Dx(n, e), bC = () => ({ state: n, dispatch: e }) => Ox(n, e);
function Ba(n, e, t = {}, r = {}) {
  return ti(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var kC = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: a }) => {
  const { doc: l } = s;
  if (r.preserveWhitespace !== "full") {
    const c = Ba(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, l.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: l.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function qp(n, e) {
  const t = Wt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function wC(n, e) {
  const t = new Lh(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function xC(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function SC(n, e) {
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
function zl(n) {
  return (e) => SC(e.$from, n);
}
function K(n, e, t) {
  return n.config[e] === void 0 && n.parent ? K(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? K(n.parent, e, t) : null
  }) : n.config[e];
}
function Fl(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = K(e, "addExtensions", t);
    return r ? [e, ...Fl(r())] : e;
  }).flat(10);
}
function Vl(n, e) {
  const t = Ln.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function Up(n) {
  return typeof n == "function";
}
function de(n, e = void 0, ...t) {
  return Up(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function CC(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function dr(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Wp(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = dr(n), i = [...t, ...r], s = {
    default: null,
    validate: void 0,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  }, o = t.filter((c) => c.name !== "text").map((c) => c.name), a = r.map((c) => c.name), l = [...o, ...a];
  return n.forEach((c) => {
    const u = {
      name: c.name,
      options: c.options,
      storage: c.storage,
      extensions: i
    }, d = K(
      c,
      "addGlobalAttributes",
      u
    );
    if (!d)
      return;
    d().forEach((h) => {
      let p;
      Array.isArray(h.types) ? p = h.types : h.types === "*" ? p = l : h.types === "nodes" ? p = o : h.types === "marks" ? p = a : p = [], p.forEach((m) => {
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
    }, d = K(
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
function TC(n) {
  const e = [];
  let t = "", r = !1, i = !1, s = 0;
  const o = n.length;
  for (let a = 0; a < o; a += 1) {
    const l = n[a];
    if (l === "'" && !i) {
      r = !r, t += l;
      continue;
    }
    if (l === '"' && !r) {
      i = !i, t += l;
      continue;
    }
    if (!r && !i) {
      if (l === "(") {
        s += 1, t += l;
        continue;
      }
      if (l === ")" && s > 0) {
        s -= 1, t += l;
        continue;
      }
      if (l === ";" && s === 0) {
        e.push(t), t = "";
        continue;
      }
    }
    t += l;
  }
  return t && e.push(t), e;
}
function Qu(n) {
  const e = [], t = TC(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const a = s.slice(0, o).trim(), l = s.slice(o + 1).trim();
    a && l && e.push([a, l]);
  }
  return e;
}
function jp(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      if (i === "class") {
        const a = s ? String(s).split(" ") : [], l = r[i] ? r[i].split(" ") : [], c = a.filter((u) => !l.includes(u));
        r[i] = [...l, ...c].join(" ");
      } else if (i === "style") {
        const a = new Map([...Qu(r[i]), ...Qu(s)]);
        r[i] = Array.from(a.entries()).map(([l, c]) => `${l}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function Es(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => jp(t, r), {});
}
function EC(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function ed(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const a = o.attribute.parseHTML ? o.attribute.parseHTML(t) : EC(t.getAttribute(o.name));
        return a == null ? s : {
          ...s,
          [o.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function td(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && CC(t) ? !1 : t != null)
  );
}
function nd(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function Hp(n, e) {
  var t;
  const r = Wp(n), { nodeExtensions: i, markExtensions: s } = dr(n), o = (t = i.find((c) => K(c, "topNode"))) == null ? void 0 : t.name, a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((y) => y.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((y, b) => {
        const v = K(b, "extendNodeSchema", d);
        return {
          ...y,
          ...v ? v(c) : {}
        };
      }, {}), h = td({
        ...f,
        content: de(K(c, "content", d)),
        marks: de(K(c, "marks", d)),
        group: de(K(c, "group", d)),
        inline: de(K(c, "inline", d)),
        atom: de(K(c, "atom", d)),
        selectable: de(K(c, "selectable", d)),
        draggable: de(K(c, "draggable", d)),
        code: de(K(c, "code", d)),
        whitespace: de(K(c, "whitespace", d)),
        linebreakReplacement: de(
          K(c, "linebreakReplacement", d)
        ),
        defining: de(K(c, "defining", d)),
        isolating: de(K(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(nd))
      }), p = de(K(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (y) => ed(y, u)
      ));
      const m = K(c, "renderHTML", d);
      m && (h.toDOM = (y) => m({
        node: y,
        HTMLAttributes: Es(y, u)
      }));
      const g = K(c, "renderText", d);
      return g && (h.toText = g), [c.name, h];
    })
  ), l = Object.fromEntries(
    s.map((c) => {
      const u = r.filter((g) => g.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((g, y) => {
        const b = K(y, "extendMarkSchema", d);
        return {
          ...g,
          ...b ? b(c) : {}
        };
      }, {}), h = td({
        ...f,
        inclusive: de(K(c, "inclusive", d)),
        excludes: de(K(c, "excludes", d)),
        group: de(K(c, "group", d)),
        spanning: de(K(c, "spanning", d)),
        code: de(K(c, "code", d)),
        attrs: Object.fromEntries(u.map(nd))
      }), p = de(K(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => ed(g, u)
      ));
      const m = K(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: Es(g, u)
      })), [c.name, h];
    })
  );
  return new xh({
    topNode: o,
    nodes: a,
    marks: l
  });
}
function MC(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function zr(n) {
  return n.sort((t, r) => {
    const i = K(t, "priority") || 100, s = K(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function ql(n) {
  const e = zr(Fl(n)), t = MC(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function AC(n, e) {
  const t = ql(n);
  return Hp(t, e);
}
function Kp(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = t || {};
  let a = "";
  return n.nodesBetween(r, i, (l, c, u, d) => {
    var f;
    l.isBlock && c > r && (a += s);
    const h = o?.[l.type.name];
    if (h)
      return u && (a += h({
        node: l,
        pos: c,
        parent: u,
        index: d,
        range: e
      })), !1;
    l.isText && (a += (f = l?.text) == null ? void 0 : f.slice(Math.max(r, c) - c, i - c));
  }), a;
}
function OC(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Kp(n, t, e);
}
function Jp(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function DC(n, e) {
  const t = Ce(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function _C(n, e) {
  const t = no(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? DC(n, e) : t === "mark" ? qp(n, e) : {};
}
function PC(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function RC(n) {
  const e = PC(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function IC(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((a, l) => {
        o.push({ from: a, to: l });
      });
    else {
      const { from: a, to: l } = t[s];
      if (a === void 0 || l === void 0)
        return;
      o.push({ from: a, to: l });
    }
    o.forEach(({ from: a, to: l }) => {
      const c = e.slice(s).map(a, -1), u = e.slice(s).map(l), d = e.invert().map(c, -1), f = e.invert().map(u);
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
  }), RC(r);
}
function Er(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Ji(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var NC = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (i, s, o, a) => {
    var l, c;
    const u = ((c = (l = i.type.spec).toText) == null ? void 0 : c.call(l, {
      node: i,
      pos: s,
      parent: o,
      index: a
    })) || i.textContent || "%leaf%";
    t += i.isAtom && !i.isText ? u : u.slice(0, Math.max(0, r - s));
  }), t;
};
function La(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? Wt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => Ts(d.attrs, t, { strict: !1 }));
  let o = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(h, g), b = Math.min(p, g + m.nodeSize), v = b - y;
      o += v, a.push(
        ...m.marks.map((w) => ({
          mark: w,
          from: y,
          to: b
        }))
      );
    });
  }), o === 0)
    return !1;
  const l = a.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => Ts(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function $C(n, e, t = {}) {
  if (!e)
    return ni(n, null, t) || La(n, null, t);
  const r = no(e, n.schema);
  return r === "node" ? ni(n, e, t) : r === "mark" ? La(n, e, t) : !1;
}
function rd(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function id(n, e) {
  const { nodeExtensions: t } = dr(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = de(K(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Ul(n, {
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
      i !== !1 && (Ul(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var Wl = class Xp {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new Xp(e.position);
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
function Gp(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new Wl(t.pos),
    mapResult: t
  };
}
function BC(n) {
  return new Wl(n);
}
function LC(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Lp(i) && (s = i.$cursor), s) {
    const a = (r = n.storedMarks) != null ? r : s.marks();
    return s.parent.type.allowsMarkType(t) && (!!t.isInSet(a) || !a.some((c) => c.type.excludes(t)));
  }
  const { ranges: o } = i;
  return o.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(a.pos, l.pos, (u, d, f) => {
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
var zC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: a } = s, l = Wt(n, r.schema);
  if (i)
    if (o) {
      const c = qp(r, l);
      t.addStoredMark(
        l.create({
          ...c,
          ...e
        })
      );
    } else
      a.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, h) => {
          const p = Math.max(h, u), m = Math.min(h + f.nodeSize, d);
          f.marks.find((y) => y.type === l) ? f.marks.forEach((y) => {
            l === y.type && t.addMark(
              p,
              m,
              l.create({
                ...y.attrs,
                ...e
              })
            );
          }) : t.addMark(p, m, l.create(e));
        });
      });
  return LC(r, t, l);
}, FC = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), VC = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = Ce(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: a }) => yu(s, { ...o, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => yu(s, { ...o, ...e })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, qC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = bn(n, 0, r.content.size), s = X.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, UC = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, a;
  return typeof e == "number" ? (o = e, a = e) : e && "from" in e && "to" in e ? (o = e.from, a = e.to) : (o = s.from, a = s.to), i && t.doc.nodesBetween(o, a, (l, c) => {
    l.isText || t.setNodeMarkup(c, void 0, {
      ...l.attrs,
      dir: n
    });
  }), !0;
}, WC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = Y.atStart(r).from, a = Y.atEnd(r).to, l = bn(i, o, a), c = bn(s, o, a), u = Y.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, jC = (n) => ({ state: e, dispatch: t }) => {
  const r = Ce(n, e.schema);
  return Lx(r)(e, t);
};
function sd(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var HC = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, u = Ji(c, a.node().type.name, a.node().attrs);
  if (s instanceof X && s.node.isBlock)
    return !a.parentOffset || !Nt(o, a.pos) ? !1 : (r && (n && sd(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const d = l.parentOffset === l.parent.content.size, f = a.depth === 0 ? void 0 : xC(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Nt(e.doc, e.mapping.map(a.pos), 1, h);
  if (!h && !p && Nt(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof Y && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, h), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), g = e.doc.resolve(m);
      a.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && sd(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, KC = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const a = Ce(n, r.schema), { $from: l, $to: c } = r.selection, u = r.selection.node;
  if (u && u.isBlock || l.depth < 2 || !l.sameParent(c))
    return !1;
  const d = l.node(-1);
  if (d.type !== a)
    return !1;
  const f = s.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== a || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (i) {
      let y = P.empty;
      const b = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let A = l.depth - b; A >= l.depth - 3; A -= 1)
        y = P.from(l.node(A).copy(y));
      const v = (
        // eslint-disable-next-line no-nested-ternary
        l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3
      ), w = {
        ...Ji(f, l.node().type.name, l.node().attrs),
        ...e
      }, C = ((o = a.contentMatch.defaultType) == null ? void 0 : o.createAndFill(w)) || void 0;
      y = y.append(P.from(a.createAndFill(null, C) || void 0));
      const M = l.before(l.depth - (b - 1));
      t.replace(M, l.after(-v), new z(y, 4 - b, 0));
      let x = -1;
      t.doc.nodesBetween(M, t.doc.content.size, (A, S) => {
        if (x > -1)
          return !1;
        A.isTextblock && A.content.size === 0 && (x = S + 1);
      }), x > -1 && t.setSelection(Y.near(t.doc.resolve(x))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === l.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Ji(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Ji(f, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const g = h ? [
    { type: a, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: a, attrs: p }];
  if (!Nt(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: y, storedMarks: b } = r, { splittableMarks: v } = s.extensionManager, w = b || y.$to.parentOffset && y.$from.marks();
    if (t.split(l.pos, 2, g).scrollIntoView(), !w || !i)
      return !0;
    const C = w.filter((M) => v.includes(M.type.name));
    t.ensureMarks(C);
  }
  return !0;
}, jo = (n, e) => {
  const t = zl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && zn(n.doc, t.pos) && n.join(t.pos), !0;
}, Ho = (n, e) => {
  const t = zl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && zn(n.doc, r) && n.join(r), !0;
}, JC = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = Ce(n, o.schema), p = Ce(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: b } = m, v = y.blockRange(b), w = g || m.$to.parentOffset && m.$from.marks();
  if (!v)
    return !1;
  const C = zl((M) => id(M.type.name, d))(m);
  if (v.depth >= 1 && C && v.depth - C.depth <= 1) {
    if (C.node.type === h)
      return c.liftListItem(p);
    if (id(C.node.type.name, d) && h.validContent(C.node.content) && a)
      return l().command(() => (s.setNodeMarkup(C.pos, h), !0)).command(() => jo(s, h)).command(() => Ho(s, h)).run();
  }
  return !t || !w || !a ? l().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => jo(s, h)).command(() => Ho(s, h)).run() : l().command(() => {
    const M = u().wrapInList(h, r), x = w.filter((A) => f.includes(A.type.name));
    return s.ensureMarks(x), M ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => jo(s, h)).command(() => Ho(s, h)).run();
}, XC = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = Wt(n, r.schema);
  return La(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, GC = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = Ce(n, r.schema), o = Ce(e, r.schema), a = ni(r, s, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), a ? i.setNode(o, l) : i.setNode(s, { ...l, ...t });
}, YC = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = Ce(n, t.schema);
  return ni(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, ZC = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(n))) {
      if (e) {
        const o = n.tr, a = s.transform;
        for (let l = a.steps.length - 1; l >= 0; l -= 1)
          o.step(a.steps[l].invert(a.docs[l]));
        if (s.text) {
          const l = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, n.schema.text(s.text, l));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, QC = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, eT = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = t, l = Wt(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = a;
    const p = (s = c.marks().find((g) => g.type === l)) == null ? void 0 : s.attrs, m = Bp(c, l, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, tT = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (a, l) => {
    if (a.isText)
      return;
    const c = { ...a.attrs };
    delete c.dir, e.setNodeMarkup(l, void 0, c);
  }), !0;
}, nT = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = no(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Ce(n, r.schema)), a === "mark" && (o = Wt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let f, h, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, y) => {
      s && s === g.type && (l = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g);
    }) : r.doc.nodesBetween(u, d, (g, y) => {
      y < u && s && s === g.type && (l = !0, p = Math.max(y, u), m = Math.min(y + g.nodeSize, d), f = y, h = g), y >= u && y <= d && (s && s === g.type && (l = !0, i && t.setNodeMarkup(y, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((b) => {
        if (o === b.type && (l = !0, i)) {
          const v = Math.max(y, u), w = Math.min(y + g.nodeSize, d);
          t.addMark(
            v,
            w,
            o.create({
              ...b.attrs,
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
  }), l;
}, rT = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Ce(n, t.schema);
  return _x(i, e)(t, r);
}, iT = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Ce(n, t.schema);
  return Px(i, e)(t, r);
}, sT = class {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  once(e, t) {
    const r = (...i) => {
      this.off(e, r), t.apply(this, i);
    };
    return this.on(e, r);
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}, oT = (n, e) => {
  if (Ll(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Bi(n) {
  var e;
  const { editor: t, from: r, to: i, text: s, rules: o, plugin: a } = n, { view: l } = t;
  if (l.composing)
    return !1;
  const c = l.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || (e = c.nodeBefore || c.nodeAfter) != null && e.marks.find((f) => f.type.spec.code)
  )
    return !1;
  let u = !1;
  const d = NC(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = oT(d, f.find);
    if (!h)
      return;
    const p = l.state.tr, m = eo({
      state: l.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: y, chain: b, can: v } = new to({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: y,
      chain: b,
      can: v
    }) === null || !p.steps.length || (f.undoable && p.setMeta(a, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), l.dispatch(p), u = !0);
  }), u;
}
function aT(n) {
  const { editor: e, rules: t } = n, r = new Ie({
    state: {
      init() {
        return null;
      },
      apply(i, s, o) {
        const a = i.getMeta(r);
        if (a)
          return a;
        const l = i.getMeta("applyInputRules");
        return l && setTimeout(() => {
          let { text: u } = l;
          typeof u == "string" ? u = u : u = Vl(P.from(u), o.schema);
          const { from: d } = l, f = d + u.length;
          Bi({
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
      handleTextInput(i, s, o, a) {
        return Bi({
          editor: e,
          from: s,
          to: o,
          text: a,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: s } = i.state.selection;
          s && Bi({
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
        return o ? Bi({
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
function lT(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Li(n) {
  return lT(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Yp(n, e) {
  const t = { ...n };
  return Li(n) && Li(e) && Object.keys(e).forEach((r) => {
    Li(e[r]) && Li(n[r]) ? t[r] = Yp(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var jl = class {
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
      ...de(
        K(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...de(
        K(this, "addStorage", {
          name: this.name,
          options: this.options
        })
      ) || {}
    };
  }
  configure(n = {}) {
    const e = this.extend({
      ...this.config,
      addOptions: () => Yp(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, cT = class Zp extends jl {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Zp(t);
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const o = i.marks();
      if (!!!o.find((c) => c?.type.name === t.name))
        return !1;
      const l = o.find((c) => c?.type.name === t.name);
      return l && r.removeStoredMark(l), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
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
function uT(n) {
  return typeof n == "number";
}
var dT = (n, e, t) => {
  if (Ll(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function fT(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: a } = n, { commands: l, chain: c, can: u } = new to({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, y, b, v;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const w = (v = (b = (y = h.content) == null ? void 0 : y.size) != null ? b : h.nodeSize) != null ? v : 0, C = Math.max(r, p), M = Math.min(i, p + w);
    if (C >= M)
      return;
    const x = h.isText ? h.text || "" : h.textBetween(C - p, M - p, void 0, "￼");
    dT(x, s.find, o).forEach((S) => {
      if (S.index === void 0)
        return;
      const O = C + S.index + 1, D = O + S[0].length, I = {
        from: t.tr.mapping.map(O),
        to: t.tr.mapping.map(D)
      }, F = s.handler({
        state: t,
        range: I,
        match: S,
        commands: l,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: a
      });
      d.push(F);
    });
  }), d.every((h) => h !== null);
}
var zi = null, hT = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function pT(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, s = !1, o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, a;
  try {
    a = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  } catch {
    a = null;
  }
  const l = ({
    state: u,
    from: d,
    to: f,
    rule: h,
    pasteEvt: p
  }) => {
    const m = u.tr, g = eo({
      state: u,
      transaction: m
    });
    if (!(!fT({
      editor: e,
      state: g,
      from: Math.max(d - 1, 0),
      to: f.b - 1,
      rule: h,
      pasteEvent: p,
      dropEvent: a
    }) || !m.steps.length)) {
      try {
        a = typeof DragEvent < "u" ? new DragEvent("drop") : null;
      } catch {
        a = null;
      }
      return o = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null, m;
    }
  };
  return t.map((u) => new Ie({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (zi = e);
      }, h = () => {
        zi && (zi = null);
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
          if (s = r === d.dom.parentElement, a = f, !s) {
            const h = zi;
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
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, y = p.getMeta("applyPasteRules"), b = !!y;
      if (!m && !g && !b)
        return;
      if (b) {
        let { text: C } = y;
        typeof C == "string" ? C = C : C = Vl(P.from(C), h.schema);
        const { from: M } = y, x = M + C.length, A = hT(C);
        return l({
          rule: u,
          state: h,
          from: M,
          to: { b: x },
          pasteEvt: A
        });
      }
      const v = f.doc.content.findDiffStart(h.doc.content), w = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!uT(v) || !w || v === w.b))
        return l({
          rule: u,
          state: h,
          from: v,
          to: w,
          pasteEvt: o
        });
    }
  }));
}
var ro = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = ql(n), this.schema = Hp(this.extensions, e), this.setupExtensions();
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
        type: Er(e.name, this.schema)
      }, r = K(e, "addCommands", t);
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
    return zr([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: Er(r.name, this.schema)
      }, s = [], o = K(
        r,
        "addKeyboardShortcuts",
        i
      );
      let a = {};
      if (r.type === "mark" && K(r, "exitable", i) && (a.ArrowRight = () => cT.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        a = { ...a, ...f };
      }
      const l = AS(a);
      s.push(l);
      const c = K(r, "addInputRules", i);
      if (rd(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = aT({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = K(r, "addPasteRules", i);
      if (rd(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = pT({ editor: n, rules: f });
          s.push(...h);
        }
      }
      const d = K(
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
    return Wp(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = dr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!K(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Ce(t.name, this.schema)
        }, s = K(t, "addNodeView", i);
        if (!s)
          return [];
        const o = s();
        if (!o)
          return [];
        const a = (l, c, u, d, f) => {
          const h = Es(l, r);
          return o({
            // pass-through
            node: l,
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
        return [t.name, a];
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
    return zr([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: Er(i.name, this.schema)
      }, o = K(
        i,
        "dispatchTransaction",
        s
      );
      return o ? (a) => {
        o.call(s, { transaction: a, next: r });
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
    return zr([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: Er(i.name, this.schema)
        }, o = K(
          i,
          "transformPastedHTML",
          s
        );
        return o ? (a, l) => {
          const c = r(a, l);
          return o.call(s, c);
        } : r;
      },
      n || ((r) => r)
    );
  }
  get markViews() {
    const { editor: n } = this, { markExtensions: e } = dr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!K(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Wt(t.name, this.schema)
        }, s = K(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (a, l, c) => {
          const u = Es(a, r);
          return s()({
            // pass-through
            mark: a,
            view: l,
            inline: c,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: u,
            updateAttributes: (d) => {
              AT(a, n, d);
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
        type: Er(e.name, this.schema)
      };
      e.type === "mark" && ((t = de(K(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = K(e, "onBeforeCreate", r), s = K(e, "onCreate", r), o = K(e, "onUpdate", r), a = K(
        e,
        "onSelectionUpdate",
        r
      ), l = K(e, "onTransaction", r), c = K(e, "onFocus", r), u = K(e, "onBlur", r), d = K(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), a && this.editor.on("selectionUpdate", a), l && this.editor.on("transaction", l), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
ro.resolve = ql;
ro.sort = zr;
ro.flatten = Fl;
var mT = {};
Bl(mT, {
  ClipboardTextSerializer: () => em,
  Commands: () => tm,
  Delete: () => nm,
  Drop: () => rm,
  Editable: () => im,
  FocusEvents: () => om,
  Keymap: () => am,
  Paste: () => lm,
  Tabindex: () => cm,
  TextDirection: () => um,
  focusEventsPluginKey: () => sm
});
var rt = class Qp extends jl {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Qp(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, em = rt.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new Ie({
        key: new nt("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), a = Math.max(...s.map((u) => u.$to.pos)), l = Jp(t);
            return Kp(r, { from: o, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), tm = rt.create({
  name: "commands",
  addCommands() {
    return {
      ...Np
    };
  }
}), nm = rt.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, a, l, c;
      if ((c = (l = (a = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : a.filterTransaction) == null ? void 0 : l.call(a, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = wC(n.before, [n, ...e]);
      IC(u).forEach((h) => {
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
        if (h instanceof gt) {
          const y = f.slice(p).map(h.from, -1), b = f.slice(p).map(h.to), v = f.invert().map(y, -1), w = f.invert().map(b), C = (m = u.doc.nodeAt(y - 1)) == null ? void 0 : m.marks.some((x) => x.eq(h.mark)), M = (g = u.doc.nodeAt(b)) == null ? void 0 : g.marks.some((x) => x.eq(h.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: h.mark,
            from: h.from,
            to: h.to,
            deletedRange: {
              from: v,
              to: w
            },
            newRange: {
              from: y,
              to: b
            },
            partial: !!(M || C),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (i = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || i ? setTimeout(s, 0) : s();
  }
}), rm = rt.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new Ie({
        key: new nt("tiptapDrop"),
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
}), im = rt.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Ie({
        key: new nt("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), sm = new nt("focusEvents"), om = rt.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Ie({
        key: sm,
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
}), am = rt.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, y = m && p.parent.childCount === 1 ? g === d.pos : Q.atStart(c).from === f;
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
    return ei() || Vp() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Ie({
        key: new nt("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: a } = e.selection, l = Q.atStart(e.doc).from, c = Q.atEnd(e.doc).to;
          if (s || !(o === l && a === c) || !Ul(t.doc))
            return;
          const f = t.tr, h = eo({
            state: t,
            transaction: f
          }), { commands: p } = new to({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), lm = rt.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new Ie({
        key: new nt("tiptapPaste"),
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
}), cm = rt.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Ie({
        key: new nt("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), um = rt.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = dr(this.extensions);
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
      new Ie({
        key: new nt("textDirection"),
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
}), gT = class _r {
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
    return new _r(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new _r(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new _r(e, this.editor);
  }
  get children() {
    const e = [];
    return this.node.content.forEach((t, r) => {
      const i = t.isBlock && !t.isTextblock, s = t.isAtom && !t.isText, o = t.isInline, a = this.pos + r + (s ? 0 : 1);
      if (a < 0 || a > this.resolvedPos.doc.nodeSize - 2)
        return;
      const l = this.resolvedPos.doc.resolve(a);
      if (!i && !o && l.depth <= this.depth)
        return;
      const c = new _r(l, this.editor, i, i || o ? t : null);
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
          for (let a = 0; a < o.length; a += 1) {
            const l = o[a];
            if (s[l] !== t[l])
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
      r && i.length > 0 || (o.node.type.name === e && s.every((l) => t[l] === o.node.attrs[l]) && i.push(o), !(r && i.length > 0) && (i = i.concat(o.querySelectorAll(e, t, r))));
    }), i;
  }
  setAttribute(e) {
    const { tr: t } = this.editor.state;
    t.setNodeMarkup(this.from, void 0, {
      ...this.node.attrs,
      ...e
    }), this.editor.view.dispatch(t);
  }
}, yT = `.ProseMirror {
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
function vT(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var bT = class extends sT {
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
      getUpdatedPosition: Gp,
      createMappablePosition: BC
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = zp(t, this.options.autofocus);
    this.editorState = Zn.create({
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
    this.options.injectCSS && typeof document < "u" && (this.css = vT(yT, this.options.injectNonce));
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
    const r = Up(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
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
      r = r.filter((a) => !a.key.startsWith(o));
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
      im,
      em.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      tm,
      om,
      am,
      cm,
      rm,
      lm,
      nm,
      um.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new ro(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new to({
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
      e = Ba(this.options.content, this.schema, this.options.parseOptions, {
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
      }), e = Ba(this.options.content, this.schema, this.options.parseOptions, {
        errorOnInvalidContent: !1
      });
    }
    return e;
  }
  /**
   * Creates a ProseMirror view.
   */
  createView(e) {
    const { editorProps: t, enableExtensionDispatchTransaction: r } = this.options, i = t.dispatchTransaction || this.dispatchTransaction.bind(this), s = r ? this.extensionManager.dispatchTransaction(i) : i, o = t.transformPastedHTML, a = this.extensionManager.transformPastedHTML(o);
    this.editorView = new Ip(e, {
      ...t,
      attributes: {
        // add `role="textbox"` to the editor element
        role: "textbox",
        ...t?.attributes
      },
      dispatchTransaction: s,
      transformPastedHTML: a,
      state: this.editorState,
      markViews: this.extensionManager.markViews,
      nodeViews: this.extensionManager.nodeViews
    });
    const l = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(l), this.prependClass(), this.injectCSS();
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
    const a = r.findLast((u) => u.getMeta("focus") || u.getMeta("blur")), l = a?.getMeta("focus"), c = a?.getMeta("blur");
    l && this.emit("focus", {
      editor: this,
      event: l.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: a
    }), c && this.emit("blur", {
      editor: this,
      event: c.event,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      transaction: a
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
    return _C(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return $C(this.state, r, i);
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
    return Vl(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return OC(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...Jp(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Ul(this.state.doc);
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
    return new gT(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, kT = {};
Bl(kT, {
  createAtomBlockMarkdownSpec: () => wT,
  createBlockMarkdownSpec: () => xT,
  createInlineMarkdownSpec: () => TT,
  parseAttributes: () => Hl,
  parseIndentedBlocks: () => ET,
  renderNestedMarkdownContent: () => MT,
  serializeAttributes: () => Kl
});
function Hl(n) {
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
  const l = r.replace(/(?:^|\s)\.([a-zA-Z][\w-]*)/g, "").replace(/(?:^|\s)#([a-zA-Z][\w-]*)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
  return l && l.split(/\s+/).filter(Boolean).forEach((u) => {
    u.match(/^[a-zA-Z][\w-]*$/) && (e[u] = !0);
  }), e;
}
function Kl(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function wT(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = Hl,
    serializeAttributes: i = Kl,
    defaultAttributes: s = {},
    requiredAttributes: o = [],
    allowedAttributes: a
  } = n, l = t || e, c = (u) => {
    if (!a)
      return u;
    const d = {};
    return a.forEach((f) => {
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
        const f = new RegExp(`^:::${l}(?:\\s|$)`, "m"), h = (d = u.match(f)) == null ? void 0 : d.index;
        return h !== void 0 ? h : -1;
      },
      tokenize(u, d, f) {
        const h = new RegExp(`^:::${l}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), p = u.match(h);
        if (!p)
          return;
        const m = p[1] || "", g = r(m);
        if (!o.find((b) => !(b in g)))
          return {
            type: e,
            raw: p[0],
            attributes: g
          };
      }
    },
    renderMarkdown: (u) => {
      const d = c(u.attrs || {}), f = i(d), h = f ? ` {${f}}` : "";
      return `:::${l}${h} :::`;
    }
  };
}
function xT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Hl,
    serializeAttributes: s = Kl,
    defaultAttributes: o = {},
    content: a = "block",
    allowedAttributes: l
  } = n, c = t || e, u = (d) => {
    if (!l)
      return d;
    const f = {};
    return l.forEach((h) => {
      h in d && (f[h] = d[h]);
    }), f;
  };
  return {
    parseMarkdown: (d, f) => {
      let h;
      if (r) {
        const m = r(d);
        h = typeof m == "string" ? [{ type: "text", text: m }] : m;
      } else a === "block" ? h = f.parseChildren(d.tokens || []) : h = f.parseInline(d.tokens || []);
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
        const [y, b = ""] = g, v = i(b);
        let w = 1;
        const C = y.length;
        let M = "";
        const x = /^:::([\w-]*)(\s.*)?/gm, A = d.slice(C);
        for (x.lastIndex = 0; ; ) {
          const S = x.exec(A);
          if (S === null)
            break;
          const O = S.index, D = S[1];
          if (!((p = S[2]) != null && p.endsWith(":::"))) {
            if (D)
              w += 1;
            else if (w -= 1, w === 0) {
              const I = A.slice(0, O);
              M = I.trim();
              const F = d.slice(0, C + O + S[0].length);
              let L = [];
              if (M)
                if (a === "block")
                  for (L = h.blockTokens(I), L.forEach((G) => {
                    G.text && (!G.tokens || G.tokens.length === 0) && (G.tokens = h.inlineTokens(G.text));
                  }); L.length > 0; ) {
                    const G = L[L.length - 1];
                    if (G.type === "paragraph" && (!G.text || G.text.trim() === ""))
                      L.pop();
                    else
                      break;
                  }
                else
                  L = h.inlineTokens(M);
              return {
                type: e,
                raw: F,
                attributes: v,
                content: M,
                tokens: L
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
function ST(n) {
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
function CT(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function TT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = ST,
    serializeAttributes: s = CT,
    defaultAttributes: o = {},
    selfClosing: a = !1,
    allowedAttributes: l
  } = n, c = t || e, u = (f) => {
    if (!l)
      return f;
    const h = {};
    return l.forEach((p) => {
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
      if (a)
        return h.createNode(e, p);
      const m = r ? r(f) : f.content || "";
      return m ? h.createNode(e, p, [h.createTextNode(m)]) : h.createNode(e, p, []);
    },
    markdownTokenizer: {
      name: e,
      level: "inline",
      start(f) {
        const h = a ? new RegExp(`\\[${d}\\s*[^\\]]*\\]`) : new RegExp(`\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), p = f.match(h), m = p?.index;
        return m !== void 0 ? m : -1;
      },
      tokenize(f, h, p) {
        const m = a ? new RegExp(`^\\[${d}\\s*([^\\]]*)\\]`) : new RegExp(`^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`), g = f.match(m);
        if (!g)
          return;
        let y = "", b = "";
        if (a) {
          const [, w] = g;
          b = w;
        } else {
          const [, w, C] = g;
          b = w, y = C || "";
        }
        const v = i(b.trim());
        return {
          type: e,
          raw: g[0],
          content: y.trim(),
          attributes: v
        };
      }
    },
    renderMarkdown: (f) => {
      let h = "";
      r ? h = r(f) : f.content && f.content.length > 0 && (h = f.content.filter((y) => y.type === "text").map((y) => y.text).join(""));
      const p = u(f.attrs || {}), m = s(p), g = m ? ` ${m}` : "";
      return a ? `[${c}${g}]` : `[${c}${g}]${h}[/${c}]`;
    }
  };
}
function ET(n, e, t) {
  var r, i, s, o;
  const a = n.split(`
`), l = [];
  let c = "", u = 0;
  const d = e.baseIndentSize || 2;
  for (; u < a.length; ) {
    const f = a[u], h = f.match(e.itemPattern);
    if (!h) {
      if (l.length > 0)
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
    for (u += 1; u < a.length; ) {
      const C = a[u];
      if (C.trim() === "") {
        const x = a.slice(u + 1).findIndex((O) => O.trim() !== "");
        if (x === -1)
          break;
        if ((((i = (r = a[u + 1 + x].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          y.push(C), c = `${c}${C}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = C.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        y.push(C), c = `${c}${C}
`, u += 1;
      else
        break;
    }
    let b;
    const v = y.slice(1);
    if (v.length > 0) {
      const C = v.map((M) => M.slice(m + d)).join(`
`);
      C.trim() && (e.customNestedParser ? b = e.customNestedParser(C) : b = t.blockTokens(C));
    }
    const w = e.createToken(p, b);
    l.push(w);
  }
  if (l.length !== 0)
    return {
      items: l,
      raw: c
    };
}
function MT(n, e, t, r) {
  if (!n || !Array.isArray(n.content))
    return "";
  const i = typeof t == "function" ? t(r) : t, [s, ...o] = n.content, a = e.renderChildren([s]);
  let l = `${i}${a}`;
  return o && o.length > 0 && o.forEach((c, u) => {
    var d, f;
    const h = (f = (d = e.renderChild) == null ? void 0 : d.call(e, c, u + 1)) != null ? f : e.renderChildren([c]);
    if (h != null) {
      const p = h.split(`
`).map((m) => m ? e.indent(m) : e.indent("")).join(`
`);
      l += c.type === "paragraph" ? `

${p}` : `
${p}`;
    }
  }), l;
}
function AT(n, e, t = {}) {
  const { state: r } = e, { doc: i, tr: s } = r, o = n;
  i.descendants((a, l) => {
    const c = s.mapping.map(l), u = s.mapping.map(l) + a.nodeSize;
    let d = null;
    if (a.marks.forEach((h) => {
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
var Jl = class dm extends jl {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new dm(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, OT = class {
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
    var e, t, r, i, s, o, a;
    const { view: l } = this.editor, c = n.target, u = c.nodeType === 3 ? (e = c.parentElement) == null ? void 0 : e.closest("[data-drag-handle]") : c.closest("[data-drag-handle]");
    if (!this.dom || (t = this.contentDOM) != null && t.contains(c) || !u)
      return;
    let d = 0, f = 0;
    if (this.dom !== u) {
      const b = this.dom.getBoundingClientRect(), v = u.getBoundingClientRect(), w = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, C = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = v.x - b.x + w, f = v.y - b.y + C;
    }
    const h = this.dom.cloneNode(!0);
    try {
      const b = this.dom.getBoundingClientRect();
      h.style.width = `${Math.round(b.width)}px`, h.style.height = `${Math.round(b.height)}px`, h.style.boxSizing = "border-box", h.style.pointerEvents = "none";
    } catch {
    }
    let p = null;
    try {
      p = document.createElement("div"), p.style.position = "absolute", p.style.top = "-9999px", p.style.left = "-9999px", p.style.pointerEvents = "none", p.appendChild(h), document.body.appendChild(p), (a = n.dataTransfer) == null || a.setDragImage(h, d, f);
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
    const g = X.create(l.state.doc, m), y = l.state.tr.setSelection(g);
    l.dispatch(y);
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
    const { isEditable: a } = this.editor, { isDragging: l } = this, c = !!this.node.type.spec.draggable, u = X.isSelectable(this.node), d = n.type === "copy", f = n.type === "paste", h = n.type === "cut", p = n.type === "mousedown";
    if (!c && u && i && n.target === this.dom && n.preventDefault(), c && i && !l && n.target === this.dom)
      return n.preventDefault(), !1;
    if (c && a && !l && p) {
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
    return !(l || s || d || f || h || p && u);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(n) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (ei() || $a()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
function od(n) {
  return Qd((e, t) => ({
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
var DT = class extends bT {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = od(this.view.state), this.reactiveExtensionStorage = od(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), nl(this);
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
}, _T = $({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = _(), t = cn();
    return at(() => {
      const r = n.editor;
      r && r.options.element && e.value && xe(() => {
        var i;
        if (!e.value || !((i = r.view.dom) != null && i.parentNode))
          return;
        const s = k(e.value);
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
    }), Ut(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return Ge("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), PT = $({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return Ge(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), RT = $({
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
    return Ge(
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
}), IT = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = nl(n), this.el = document.createElement("div"), this.props = tl(e), this.renderedComponent = this.renderComponent();
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
    let n = Ge(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && Sc(n, this.el), { vNode: n, destroy: () => {
      this.el && Sc(null, this.el), this.el = null, n = null;
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
    return Ge(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var NT = class extends OT {
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
    this.decorationClasses = _(this.getDecorationClasses());
    const t = $({
      extends: { ...this.component },
      props: Object.keys(n),
      template: this.component.template,
      setup: (r) => {
        var i, s;
        return En("onDragStart", e), En("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new IT(t, {
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
function $T(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new NT(r, t, e);
  };
}
const BT = { class: "transcription-panel" }, LT = {
  ref: "scrollContainer",
  class: "scroll-container"
}, zT = { class: "turns-container" }, FT = {
  key: 0,
  class: "history-loading",
  role: "status"
}, VT = {
  key: 1,
  class: "history-start"
}, qT = /* @__PURE__ */ $({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = ye(), r = ze(), i = zt("scrollContainer"), s = E(() => {
      const x = r.live?.partial.value ?? null;
      return x === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: x,
        words: [],
        language: r.activeChannel.value?.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = E(() => r.transcriptionEditor?.tiptapEditor.value), a = E(() => r.live?.hasLiveUpdate.value ?? !1), l = E(() => r.audio?.isPlaying.value ?? !1), c = E(
      () => r.activeChannel.value?.activeTranslation.value
    ), u = E(() => r.activeChannel.value), d = E(
      () => u.value?.isLoadingHistory.value ?? !1
    ), f = E(
      () => u.value?.hasMoreHistory.value ?? !1
    ), { isFollowing: h, resumeFollow: p } = Sw(i), { scrollRef: m, contentRef: g, isAtBottom: y, scrollToBottom: b } = gv();
    Re(() => {
      r.transcriptionEditor || (m.value = i.value, g.value = i.value?.querySelector(".turns-container") ?? null);
    });
    const v = E(
      () => !h.value && l.value || !y.value && a.value
    );
    function w() {
      l.value ? p() : b();
    }
    const C = by(() => {
      const x = u.value;
      if (!x?.hasMoreHistory.value || x.isLoadingHistory.value || e.turns.length === 0) return;
      const A = c.value;
      A && r.emit("scroll:top", { translationId: A.id });
    }, 500);
    function M() {
      const x = i.value;
      x && x.scrollTop < 100 && C();
    }
    return Z(
      () => e.turns,
      (x, A) => {
        const S = x.length, O = A.length;
        if (S > O && !y.value && x[0]?.id != A[0]?.id) {
          const D = S - O, I = e.turns[D]?.id;
          if (!I || !m.value) return;
          xe(() => {
            m.value?.querySelector(
              `[data-turn-id="${I}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), Re(() => {
      i.value?.addEventListener("scroll", M, {
        passive: !0
      });
    }), Ut(() => {
      i.value?.removeEventListener("scroll", M);
    }), (x, A) => (T(), B("article", BT, [
      U("div", LT, [
        U("div", zT, [
          d.value ? (T(), B("div", FT, [...A[2] || (A[2] = [
            U("progress", null, null, -1)
          ])])) : H("", !0),
          !f.value && n.turns.length > 0 ? (T(), B("div", VT, j(k(t)("transcription.historyStart")), 1)) : H("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (T(), R(ww, {
            key: 2,
            class: "transcription-empty"
          })) : H("", !0),
          o.value ? (T(), R(k(_T), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (T(!0), B(Pe, { key: 4 }, yt(n.turns, (S, O, D, I) => {
            const F = [
              S,
              n.speakers.get(S.speakerId ?? ""),
              a.value && !s.value && O === n.turns.length - 1
            ];
            if (I && I.key === S.id && Yg(I, F)) return I;
            const L = (T(), R(Yc, {
              "data-turn-id": S.id,
              key: S.id,
              turn: S,
              speaker: S.speakerId ? n.speakers.get(S.speakerId) : void 0,
              live: a.value && !s.value && O === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return L.memo = F, L;
          }, A, 0), 128)),
          s.value ? (T(), R(Yc, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : H("", !0)
        ]),
        q(rl, { name: "fade-slide" }, {
          default: N(() => [
            v.value ? (T(), R(me, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": k(t)("transcription.resumeScroll"),
              onClick: w
            }, {
              icon: N(() => [
                q(k(hf), { size: 14 })
              ]),
              default: N(() => [
                ge(" " + j(k(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : H("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), ad = /* @__PURE__ */ ne(qT, [["__scopeId", "data-v-86da3525"]]), UT = {
  key: 0,
  class: "popover-list__items"
}, WT = {
  key: 0,
  class: "popover-list__divider"
}, jT = { class: "popover-list__footer" }, Xl = /* @__PURE__ */ $({
  __name: "PopoverList",
  props: {
    items: {},
    itemKey: {},
    isCurrent: {},
    align: { default: "start" },
    side: { default: "bottom" },
    sideOffset: { default: 4 },
    open: { type: Boolean }
  },
  emits: ["select", "update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = _(!1), s = E({
      get: () => t.open !== void 0 ? i.value : t.open,
      set: (a) => {
        i.value = a, r("update:open", a);
      }
    });
    function o(a, l) {
      return t.itemKey ? t.itemKey(a) : l;
    }
    return (a, l) => (T(), R(k(Zk), {
      open: s.value,
      "onUpdate:open": l[0] || (l[0] = (c) => s.value = c)
    }, {
      default: N(() => [
        q(k(ow), { "as-child": "" }, {
          default: N(() => [
            J(a.$slots, "trigger")
          ]),
          _: 3
        }),
        q(k(iw), { disabled: "" }, {
          default: N(() => [
            q(k(ew), {
              class: "popover-list",
              "position-strategy": "absolute",
              side: n.side,
              align: n.align,
              "side-offset": n.sideOffset
            }, {
              default: N(() => [
                n.items.length > 0 ? (T(), B("ul", UT, [
                  (T(!0), B(Pe, null, yt(n.items, (c, u) => (T(), R(k(nw), {
                    key: o(c, u),
                    as: "li",
                    class: ht(["popover-list__item", { "popover-list__item--current": n.isCurrent?.(c) }]),
                    onSelect: (d) => r("select", c)
                  }, {
                    default: N(() => [
                      J(a.$slots, "item", { item: c })
                    ]),
                    _: 2
                  }, 1032, ["class", "onSelect"]))), 128))
                ])) : H("", !0),
                a.$slots.footer ? (T(), B(Pe, { key: 1 }, [
                  n.items.length > 0 ? (T(), B("div", WT)) : H("", !0),
                  U("div", jT, [
                    J(a.$slots, "footer")
                  ])
                ], 64)) : H("", !0)
              ]),
              _: 3
            }, 8, ["side", "align", "side-offset"])
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["open"]));
  }
}), HT = /* @__PURE__ */ $({
  __name: "DownloadMenu",
  props: {
    formats: {},
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = ye();
    function s(o) {
      r("select", o.format);
    }
    return (o, a) => (T(), R(Xl, {
      items: t.formats,
      "item-key": (l) => l.format,
      align: "end",
      onSelect: s
    }, {
      trigger: N(() => [
        q(me, {
          variant: "primary",
          icon: "download",
          "icon-right": "chevron-down",
          disabled: n.disabled,
          loading: n.loading
        }, {
          default: N(() => [
            ge(j(k(i)("llmService.download")), 1)
          ]),
          _: 1
        }, 8, ["disabled", "loading"])
      ]),
      item: N(({ item: l }) => [
        U("span", null, j(k(i)(l.labelKey)), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), KT = ["data-status"], JT = {
  class: "document-article__toolbar",
  role: "toolbar"
}, XT = { class: "document-article__body" }, GT = {
  key: 0,
  class: "document-article__center document-article__center--processing",
  role: "status",
  "aria-live": "polite"
}, YT = ["value"], ZT = {
  key: 0,
  class: "document-article__progress-value"
}, QT = {
  key: 1,
  class: "document-article__center document-article__center--error",
  role: "alert"
}, eE = { class: "document-article__error-text" }, tE = /* @__PURE__ */ $({
  __name: "DocumentArticle",
  props: {
    status: { default: "done" },
    progress: {},
    errorMessage: {},
    showRegenerate: { type: Boolean, default: !1 },
    formats: {}
  },
  emits: ["regenerate", "export"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = ye(), s = E(
      () => t.errorMessage || i("llmService.errorTemporary")
    ), o = E(() => {
      const a = t.progress;
      return a == null || !Number.isFinite(a) ? null : Math.max(0, Math.min(100, Math.round(a)));
    });
    return (a, l) => (T(), B("article", {
      class: "document-article",
      "data-status": t.status
    }, [
      U("div", JT, [
        t.showRegenerate ? (T(), R(me, {
          key: 0,
          variant: "tertiary",
          icon: "refresh-cw",
          loading: t.status === "processing",
          disabled: t.status === "processing",
          onClick: l[0] || (l[0] = (c) => r("regenerate"))
        }, {
          default: N(() => [
            ge(j(k(i)("llmService.regenerate")), 1)
          ]),
          _: 1
        }, 8, ["loading", "disabled"])) : H("", !0),
        t.formats ? (T(), R(HT, {
          key: 1,
          formats: t.formats,
          disabled: t.status === "processing",
          onSelect: l[1] || (l[1] = (c) => r("export", c))
        }, null, 8, ["formats", "disabled"])) : (T(), R(me, {
          key: 2,
          variant: "primary",
          icon: "download",
          disabled: t.status === "processing",
          onClick: l[2] || (l[2] = (c) => r("export"))
        }, {
          default: N(() => [
            ge(j(k(i)("llmService.download")), 1)
          ]),
          _: 1
        }, 8, ["disabled"]))
      ]),
      U("div", XT, [
        t.status === "processing" ? (T(), B("div", GT, [
          q(Qn, {
            name: "spinner",
            spin: "",
            size: 24
          }),
          U("progress", {
            class: "document-article__progress",
            max: 100,
            value: o.value ?? void 0
          }, null, 8, YT),
          o.value !== null ? (T(), B("span", ZT, j(o.value) + "% ", 1)) : H("", !0)
        ])) : t.status === "error" ? (T(), B("div", QT, [
          U("p", eE, j(s.value), 1),
          t.showRegenerate ? (T(), R(me, {
            key: 0,
            variant: "primary",
            icon: "refresh-cw",
            onClick: l[3] || (l[3] = (c) => r("regenerate"))
          }, {
            default: N(() => [
              ge(j(k(i)("llmService.retry")), 1)
            ]),
            _: 1
          })) : H("", !0)
        ])) : J(a.$slots, "default", { key: 2 }, void 0, !0)
      ])
    ], 8, KT));
  }
}), fm = /* @__PURE__ */ ne(tE, [["__scopeId", "data-v-606c0e96"]]), nE = { class: "verbatim-panel" }, rE = { class: "verbatim-panel__header" }, iE = { class: "verbatim-panel__doc-title" }, sE = {
  key: 0,
  class: "verbatim-panel__subtitle"
}, oE = { class: "verbatim-panel__turns" }, aE = { class: "verbatim-panel__speaker" }, lE = { class: "verbatim-panel__speaker-name" }, cE = { class: "verbatim-panel__text" }, uE = /* @__PURE__ */ $({
  __name: "VerbatimPanel",
  setup(n) {
    const e = ze(), { t, locale: r } = ye(), i = [
      { format: "docx", labelKey: "format.docx" },
      { format: "pdf", labelKey: "format.pdf" },
      { format: "txt", labelKey: "format.txt" },
      { format: "json", labelKey: "format.json" },
      { format: "whisperx", labelKey: "format.whisperx" }
    ], s = E(
      () => e.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), o = e.speakers.all, a = E(() => e.title.value), l = E(() => e.date.value), c = E(() => e.activeChannel.value?.duration ?? 0), u = E(() => o.size), d = E(
      () => l.value != null ? cf(l.value, r.value) : ""
    ), f = E(
      () => uf(c.value, r.value)
    ), h = E(
      () => t("header.speakerCount", { count: u.value })
    ), p = E(
      () => [
        d.value,
        f.value,
        h.value
      ].filter(Boolean)
    );
    function m(v) {
      return v == null ? "" : o.get(v)?.name ?? v;
    }
    function g(v) {
      if (v != null)
        return o.get(v)?.color;
    }
    function y(v) {
      return v.text != null ? v.text : v.words.map((w) => w.text).join(" ");
    }
    function b(v) {
      v && e.emit("verbatim:export", { format: v });
    }
    return (v, w) => (T(), B("section", nE, [
      q(fm, {
        formats: i,
        onExport: b
      }, {
        default: N(() => [
          U("header", rE, [
            U("h1", iE, j(a.value), 1),
            p.value.length ? (T(), B("p", sE, [
              (T(!0), B(Pe, null, yt(p.value, (C, M) => (T(), B("span", {
                key: M,
                class: "verbatim-panel__subtitle-part"
              }, j(C), 1))), 128))
            ])) : H("", !0)
          ]),
          U("ul", oE, [
            (T(!0), B(Pe, null, yt(s.value, (C) => (T(), B("li", {
              key: C.id,
              class: "verbatim-panel__turn"
            }, [
              U("div", aE, [
                C.speakerId ? (T(), R(zs, {
                  key: 0,
                  color: g(C.speakerId) ?? "#888"
                }, null, 8, ["color"])) : H("", !0),
                U("span", lE, j(m(C.speakerId)), 1)
              ]),
              U("p", cE, j(y(C)), 1)
            ]))), 128))
          ])
        ]),
        _: 1
      })
    ]));
  }
}), dE = /* @__PURE__ */ ne(uE, [["__scopeId", "data-v-656ca386"]]);
function Gl() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Fn = Gl();
function hm(n) {
  Fn = n;
}
var mn = { exec: () => null };
function ee(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (i, s) => {
    let o = typeof s == "string" ? s : s.source;
    return o = o.replace($e.caret, "$1"), t = t.replace(i, o), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var fE = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), $e = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`), htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}>`) }, hE = /^(?:[ \t]*(?:\n|$))+/, pE = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, mE = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, xi = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, gE = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Yl = / {0,3}(?:[*+-]|\d{1,9}[.)])/, pm = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, mm = ee(pm).replace(/bull/g, Yl).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), yE = ee(pm).replace(/bull/g, Yl).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Zl = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, vE = /^[^\n]+/, Ql = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, bE = ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Ql).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), kE = ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Yl).getRegex(), io = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ec = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, wE = ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ec).replace("tag", io).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), gm = ee(Zl).replace("hr", xi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", io).getRegex(), xE = ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", gm).getRegex(), tc = { blockquote: xE, code: pE, def: bE, fences: mE, heading: gE, hr: xi, html: wE, lheading: mm, list: kE, newline: hE, paragraph: gm, table: mn, text: vE }, ld = ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", xi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", io).getRegex(), SE = { ...tc, lheading: yE, table: ld, paragraph: ee(Zl).replace("hr", xi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ld).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", io).getRegex() }, CE = { ...tc, html: ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ec).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: mn, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ee(Zl).replace("hr", xi).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", mm).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, TE = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, EE = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ym = /^( {2,}|\\)\n(?!\s*$)/, ME = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, kr = /[\p{P}\p{S}]/u, so = /[\s\p{P}\p{S}]/u, nc = /[^\s\p{P}\p{S}]/u, AE = ee(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, so).getRegex(), vm = /(?!~)[\p{P}\p{S}]/u, OE = /(?!~)[\s\p{P}\p{S}]/u, DE = /(?:[^\s\p{P}\p{S}]|~)/u, _E = ee(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", fE ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), bm = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, PE = ee(bm, "u").replace(/punct/g, kr).getRegex(), RE = ee(bm, "u").replace(/punct/g, vm).getRegex(), km = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", IE = ee(km, "gu").replace(/notPunctSpace/g, nc).replace(/punctSpace/g, so).replace(/punct/g, kr).getRegex(), NE = ee(km, "gu").replace(/notPunctSpace/g, DE).replace(/punctSpace/g, OE).replace(/punct/g, vm).getRegex(), $E = ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, nc).replace(/punctSpace/g, so).replace(/punct/g, kr).getRegex(), BE = ee(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, kr).getRegex(), LE = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", zE = ee(LE, "gu").replace(/notPunctSpace/g, nc).replace(/punctSpace/g, so).replace(/punct/g, kr).getRegex(), FE = ee(/\\(punct)/, "gu").replace(/punct/g, kr).getRegex(), VE = ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), qE = ee(ec).replace("(?:-->|$)", "-->").getRegex(), UE = ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", qE).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Ms = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, WE = ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Ms).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), wm = ee(/^!?\[(label)\]\[(ref)\]/).replace("label", Ms).replace("ref", Ql).getRegex(), xm = ee(/^!?\[(ref)\](?:\[\])?/).replace("ref", Ql).getRegex(), jE = ee("reflink|nolink(?!\\()", "g").replace("reflink", wm).replace("nolink", xm).getRegex(), cd = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, rc = { _backpedal: mn, anyPunctuation: FE, autolink: VE, blockSkip: _E, br: ym, code: EE, del: mn, delLDelim: mn, delRDelim: mn, emStrongLDelim: PE, emStrongRDelimAst: IE, emStrongRDelimUnd: $E, escape: TE, link: WE, nolink: xm, punctuation: AE, reflink: wm, reflinkSearch: jE, tag: UE, text: ME, url: mn }, HE = { ...rc, link: ee(/^!?\[(label)\]\((.*?)\)/).replace("label", Ms).getRegex(), reflink: ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Ms).getRegex() }, za = { ...rc, emStrongRDelimAst: NE, emStrongLDelim: RE, delLDelim: BE, delRDelim: zE, url: ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", cd).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", cd).getRegex() }, KE = { ...za, br: ee(ym).replace("{2,}", "*").getRegex(), text: ee(za.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Fi = { normal: tc, gfm: SE, pedantic: CE }, Mr = { normal: rc, gfm: za, breaks: KE, pedantic: HE }, JE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ud = (n) => JE[n];
function xt(n, e) {
  if (e) {
    if ($e.escapeTest.test(n)) return n.replace($e.escapeReplace, ud);
  } else if ($e.escapeTestNoEncode.test(n)) return n.replace($e.escapeReplaceNoEncode, ud);
  return n;
}
function dd(n) {
  try {
    n = encodeURI(n).replace($e.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function fd(n, e) {
  let t = n.replace($e.findPipe, (s, o, a) => {
    let l = !1, c = o;
    for (; --c >= 0 && a[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), r = t.split($e.splitPipe), i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; i < r.length; i++) r[i] = r[i].trim().replace($e.slashPipe, "|");
  return r;
}
function jt(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function hd(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && $e.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function XE(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function GE(n, e = 0) {
  let t = e, r = "";
  for (let i of n) if (i === "	") {
    let s = 4 - t % 4;
    r += " ".repeat(s), t += s;
  } else r += i, t++;
  return r;
}
function pd(n, e, t, r, i) {
  let s = e.href, o = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let l = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: s, title: o, text: a, tokens: r.inlineTokens(a) };
  return r.state.inLink = !1, l;
}
function YE(n, e, t) {
  let r = n.match(t.other.indentCodeCompensation);
  if (r === null) return e;
  let i = r[1];
  return e.split(`
`).map((s) => {
    let o = s.match(t.other.beginningSpace);
    if (o === null) return s;
    let [a] = o;
    return a.length >= i.length ? s.slice(i.length) : s;
  }).join(`
`);
}
var As = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Fn;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let r = this.options.pedantic ? t[0] : hd(t[0]), i = r.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r, codeBlockStyle: "indented", text: i };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let r = t[0], i = YE(r, t[3] || "", this.rules);
      return { type: "code", raw: r, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let r = t[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = jt(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: jt(t[0], `
`), depth: t[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: jt(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let r = jt(t[0], `
`).split(`
`), i = "", s = "", o = [];
      for (; r.length > 0; ) {
        let a = !1, l = [], c;
        for (c = 0; c < r.length; c++) if (this.rules.other.blockquoteStart.test(r[c])) l.push(r[c]), a = !0;
        else if (!a) l.push(r[c]);
        else break;
        r = r.slice(c);
        let u = l.join(`
`), d = u.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${u}` : u, s = s ? `${s}
${d}` : d;
        let f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(d, o, !0), this.lexer.state.top = f, r.length === 0) break;
        let h = o.at(-1);
        if (h?.type === "code") break;
        if (h?.type === "blockquote") {
          let p = h, m = p.raw + `
` + r.join(`
`), g = this.blockquote(m);
          o[o.length - 1] = g, i = i.substring(0, i.length - p.raw.length) + g.raw, s = s.substring(0, s.length - p.text.length) + g.text;
          break;
        } else if (h?.type === "list") {
          let p = h, m = p.raw + `
` + r.join(`
`), g = this.list(m);
          o[o.length - 1] = g, i = i.substring(0, i.length - h.raw.length) + g.raw, s = s.substring(0, s.length - p.raw.length) + g.raw, r = m.substring(o.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: o, text: s };
    }
  }
  list(e) {
    let t = this.rules.block.list.exec(e);
    if (t) {
      let r = t[1].trim(), i = r.length > 1, s = { type: "list", raw: "", ordered: i, start: i ? +r.slice(0, -1) : "", loose: !1, items: [] };
      r = i ? `\\d{1,9}\\${r.slice(-1)}` : `\\${r}`, this.options.pedantic && (r = i ? r : "[*+-]");
      let o = this.rules.other.listItemRegex(r), a = !1;
      for (; e; ) {
        let c = !1, u = "", d = "";
        if (!(t = o.exec(e)) || this.rules.block.hr.test(e)) break;
        u = t[0], e = e.substring(u.length);
        let f = GE(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], p = !f.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, d = f.trimStart()) : p ? m = t[1].length + 1 : (m = f.search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, d = f.slice(m), m += t[1].length), p && this.rules.other.blankLine.test(h) && (u += h + `
`, e = e.substring(h.length + 1), c = !0), !c) {
          let g = this.rules.other.nextBulletRegex(m), y = this.rules.other.hrRegex(m), b = this.rules.other.fencesBeginRegex(m), v = this.rules.other.headingBeginRegex(m), w = this.rules.other.htmlBeginRegex(m), C = this.rules.other.blockquoteBeginRegex(m);
          for (; e; ) {
            let M = e.split(`
`, 1)[0], x;
            if (h = M, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), x = h) : x = h.replace(this.rules.other.tabCharGlobal, "    "), b.test(h) || v.test(h) || w.test(h) || C.test(h) || g.test(h) || y.test(h)) break;
            if (x.search(this.rules.other.nonSpaceChar) >= m || !h.trim()) d += `
` + x.slice(m);
            else {
              if (p || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(f) || v.test(f) || y.test(f)) break;
              d += `
` + h;
            }
            p = !h.trim(), u += M + `
`, e = e.substring(M.length + 1), f = x.slice(m);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(u) && (a = !0)), s.items.push({ type: "list_item", raw: u, task: !!this.options.gfm && this.rules.other.listIsTask.test(d), loose: !1, text: d, tokens: [] }), s.raw += u;
      }
      let l = s.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let c of s.items) {
        if (this.lexer.state.top = !1, c.tokens = this.lexer.blockTokens(c.text, []), c.task) {
          if (c.text = c.text.replace(this.rules.other.listReplaceTask, ""), c.tokens[0]?.type === "text" || c.tokens[0]?.type === "paragraph") {
            c.tokens[0].raw = c.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), c.tokens[0].text = c.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let d = this.lexer.inlineQueue.length - 1; d >= 0; d--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)) {
              this.lexer.inlineQueue[d].src = this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let u = this.rules.other.listTaskCheckbox.exec(c.raw);
          if (u) {
            let d = { type: "checkbox", raw: u[0] + " ", checked: u[0] !== "[ ]" };
            c.checked = d.checked, s.loose ? c.tokens[0] && ["paragraph", "text"].includes(c.tokens[0].type) && "tokens" in c.tokens[0] && c.tokens[0].tokens ? (c.tokens[0].raw = d.raw + c.tokens[0].raw, c.tokens[0].text = d.raw + c.tokens[0].text, c.tokens[0].tokens.unshift(d)) : c.tokens.unshift({ type: "paragraph", raw: d.raw, text: d.raw, tokens: [d] }) : c.tokens.unshift(d);
          }
        }
        if (!s.loose) {
          let u = c.tokens.filter((f) => f.type === "space"), d = u.length > 0 && u.some((f) => this.rules.other.anyLine.test(f.raw));
          s.loose = d;
        }
      }
      if (s.loose) for (let c of s.items) {
        c.loose = !0;
        for (let u of c.tokens) u.type === "text" && (u.type = "paragraph");
      }
      return s;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let r = hd(t[0]);
      return { type: "html", block: !0, raw: r, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: r };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let r = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: r, raw: jt(t[0], `
`), href: i, title: s };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let r = fd(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: jt(t[0], `
`), header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? o.align.push("left") : o.align.push(null);
      for (let a = 0; a < r.length; a++) o.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: o.align[a] });
      for (let a of s) o.rows.push(fd(a, o.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: o.align[c] })));
      return o;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let r = t[1].trim();
      return { type: "heading", raw: jt(t[0], `
`), depth: t[2].charAt(0) === "=" ? 1 : 2, text: r, tokens: this.lexer.inline(r) };
    }
  }
  paragraph(e) {
    let t = this.rules.block.paragraph.exec(e);
    if (t) {
      let r = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
      return { type: "paragraph", raw: t[0], text: r, tokens: this.lexer.inline(r) };
    }
  }
  text(e) {
    let t = this.rules.block.text.exec(e);
    if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
  }
  escape(e) {
    let t = this.rules.inline.escape.exec(e);
    if (t) return { type: "escape", raw: t[0], text: t[1] };
  }
  tag(e) {
    let t = this.rules.inline.tag.exec(e);
    if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: t[0] };
  }
  link(e) {
    let t = this.rules.inline.link.exec(e);
    if (t) {
      let r = t[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(r)) {
        if (!this.rules.other.endAngleBracket.test(r)) return;
        let o = jt(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = XE(t[2], "()");
        if (o === -2) return;
        if (o > -1) {
          let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + o;
          t[2] = t[2].substring(0, o), t[0] = t[0].substring(0, a).trim(), t[3] = "";
        }
      }
      let i = t[2], s = "";
      if (this.options.pedantic) {
        let o = this.rules.other.pedanticHrefTitle.exec(i);
        o && (i = o[1], s = o[3]);
      } else s = t[3] ? t[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), pd(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
    }
  }
  reflink(e, t) {
    let r;
    if ((r = this.rules.inline.reflink.exec(e)) || (r = this.rules.inline.nolink.exec(e))) {
      let i = (r[2] || r[1]).replace(this.rules.other.multipleSpaceGlobal, " "), s = t[i.toLowerCase()];
      if (!s) {
        let o = r[0].charAt(0);
        return { type: "text", raw: o, text: o };
      }
      return pd(r, s, r[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[3]) || !r || this.rules.inline.punctuation.exec(r))) {
      let s = [...i[0]].length - 1, o, a, l = s, c = 0, u = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (u.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = u.exec(t)) !== null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o) continue;
        if (a = [...o].length, i[3] || i[4]) {
          l += a;
          continue;
        } else if ((i[5] || i[6]) && s % 3 && !((s + a) % 3)) {
          c += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l + c);
        let d = [...i[0]][0].length, f = e.slice(0, s + i.index + d + a);
        if (Math.min(s, a) % 2) {
          let p = f.slice(1, -1);
          return { type: "em", raw: f, text: p, tokens: this.lexer.inlineTokens(p) };
        }
        let h = f.slice(2, -2);
        return { type: "strong", raw: f, text: h, tokens: this.lexer.inlineTokens(h) };
      }
    }
  }
  codespan(e) {
    let t = this.rules.inline.code.exec(e);
    if (t) {
      let r = t[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(r), s = this.rules.other.startingSpaceChar.test(r) && this.rules.other.endingSpaceChar.test(r);
      return i && s && (r = r.substring(1, r.length - 1)), { type: "codespan", raw: t[0], text: r };
    }
  }
  br(e) {
    let t = this.rules.inline.br.exec(e);
    if (t) return { type: "br", raw: t[0] };
  }
  del(e, t, r = "") {
    let i = this.rules.inline.delLDelim.exec(e);
    if (i && (!i[1] || !r || this.rules.inline.punctuation.exec(r))) {
      let s = [...i[0]].length - 1, o, a, l = s, c = this.rules.inline.delRDelim;
      for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = c.exec(t)) !== null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o || (a = [...o].length, a !== s)) continue;
        if (i[3] || i[4]) {
          l += a;
          continue;
        }
        if (l -= a, l > 0) continue;
        a = Math.min(a, a + l);
        let u = [...i[0]][0].length, d = e.slice(0, s + i.index + u + a), f = d.slice(s, -s);
        return { type: "del", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  autolink(e) {
    let t = this.rules.inline.autolink.exec(e);
    if (t) {
      let r, i;
      return t[2] === "@" ? (r = t[1], i = "mailto:" + r) : (r = t[1], i = r), { type: "link", raw: t[0], text: r, href: i, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  url(e) {
    let t;
    if (t = this.rules.inline.url.exec(e)) {
      let r, i;
      if (t[2] === "@") r = t[0], i = "mailto:" + r;
      else {
        let s;
        do
          s = t[0], t[0] = this.rules.inline._backpedal.exec(t[0])?.[0] ?? "";
        while (s !== t[0]);
        r = t[0], t[1] === "www." ? i = "http://" + t[0] : i = t[0];
      }
      return { type: "link", raw: t[0], text: r, href: i, tokens: [{ type: "text", raw: r, text: r }] };
    }
  }
  inlineText(e) {
    let t = this.rules.inline.text.exec(e);
    if (t) {
      let r = this.lexer.state.inRawBlock;
      return { type: "text", raw: t[0], text: t[0], escaped: r };
    }
  }
}, pt = class Fa {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Fn, this.options.tokenizer = this.options.tokenizer || new As(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: $e, block: Fi.normal, inline: Mr.normal };
    this.options.pedantic ? (t.block = Fi.pedantic, t.inline = Mr.pedantic) : this.options.gfm && (t.block = Fi.gfm, this.options.breaks ? t.inline = Mr.breaks : t.inline = Mr.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Fi, inline: Mr };
  }
  static lex(e, t) {
    return new Fa(t).lex(e);
  }
  static lexInline(e, t) {
    return new Fa(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace($e.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace($e.tabCharGlobal, "    ").replace($e.spaceLine, ""));
    let i = 1 / 0;
    for (; e; ) {
      if (e.length < i) i = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      let s;
      if (this.options.extensions?.block?.some((a) => (s = a.call({ lexer: this }, e, t)) ? (e = e.substring(s.raw.length), t.push(s), !0) : !1)) continue;
      if (s = this.tokenizer.space(e)) {
        e = e.substring(s.raw.length);
        let a = t.at(-1);
        s.raw.length === 1 && a !== void 0 ? a.raw += `
` : t.push(s);
        continue;
      }
      if (s = this.tokenizer.code(e)) {
        e = e.substring(s.raw.length);
        let a = t.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.at(-1).src = a.text) : t.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.list(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.html(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.def(e)) {
        e = e.substring(s.raw.length);
        let a = t.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = { href: s.href, title: s.title }, t.push(s));
        continue;
      }
      if (s = this.tokenizer.table(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(e)) {
        e = e.substring(s.raw.length), t.push(s);
        continue;
      }
      let o = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, l = e.slice(1), c;
        this.options.extensions.startBlock.forEach((u) => {
          c = u.call({ lexer: this }, l), typeof c == "number" && c >= 0 && (a = Math.min(a, c));
        }), a < 1 / 0 && a >= 0 && (o = e.substring(0, a + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(o))) {
        let a = t.at(-1);
        r && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(s), r = o.length !== e.length, e = e.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(e)) {
        e = e.substring(s.raw.length);
        let a = t.at(-1);
        a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : t.push(s);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return this.state.top = !0, t;
  }
  inline(e, t = []) {
    return this.inlineQueue.push({ src: e, tokens: t }), t;
  }
  inlineTokens(e, t = []) {
    this.tokenizer.lexer = this;
    let r = e, i = null;
    if (this.tokens.links) {
      let c = Object.keys(this.tokens.links);
      if (c.length > 0) for (; (i = this.tokenizer.rules.inline.reflinkSearch.exec(r)) !== null; ) c.includes(i[0].slice(i[0].lastIndexOf("[") + 1, -1)) && (r = r.slice(0, i.index) + "[" + "a".repeat(i[0].length - 2) + "]" + r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (i = this.tokenizer.rules.inline.anyPunctuation.exec(r)) !== null; ) r = r.slice(0, i.index) + "++" + r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let s;
    for (; (i = this.tokenizer.rules.inline.blockSkip.exec(r)) !== null; ) s = i[2] ? i[2].length : 0, r = r.slice(0, i.index + s) + "[" + "a".repeat(i[0].length - s - 2) + "]" + r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let o = !1, a = "", l = 1 / 0;
    for (; e; ) {
      if (e.length < l) l = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      o || (a = ""), o = !1;
      let c;
      if (this.options.extensions?.inline?.some((d) => (c = d.call({ lexer: this }, e, t)) ? (e = e.substring(c.raw.length), t.push(c), !0) : !1)) continue;
      if (c = this.tokenizer.escape(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.tag(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.link(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(c.raw.length);
        let d = t.at(-1);
        c.type === "text" && d?.type === "text" ? (d.raw += c.raw, d.text += c.text) : t.push(c);
        continue;
      }
      if (c = this.tokenizer.emStrong(e, r, a)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.codespan(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.br(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.del(e, r, a)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (c = this.tokenizer.autolink(e)) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      if (!this.state.inLink && (c = this.tokenizer.url(e))) {
        e = e.substring(c.raw.length), t.push(c);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let d = 1 / 0, f = e.slice(1), h;
        this.options.extensions.startInline.forEach((p) => {
          h = p.call({ lexer: this }, f), typeof h == "number" && h >= 0 && (d = Math.min(d, h));
        }), d < 1 / 0 && d >= 0 && (u = e.substring(0, d + 1));
      }
      if (c = this.tokenizer.inlineText(u)) {
        e = e.substring(c.raw.length), c.raw.slice(-1) !== "_" && (a = c.raw.slice(-1)), o = !0;
        let d = t.at(-1);
        d?.type === "text" ? (d.raw += c.raw, d.text += c.text) : t.push(c);
        continue;
      }
      if (e) {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
    }
    return t;
  }
  infiniteLoopError(e) {
    let t = "Infinite loop on byte: " + e;
    if (this.options.silent) console.error(t);
    else throw new Error(t);
  }
}, Os = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Fn;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: r }) {
    let i = (t || "").match($e.notSpaceStart)?.[0], s = e.replace($e.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + xt(i) + '">' + (r ? s : xt(s, !0)) + `</code></pre>
` : "<pre><code>" + (r ? s : xt(s, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: e }) {
    return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
  }
  html({ text: e }) {
    return e;
  }
  def(e) {
    return "";
  }
  heading({ tokens: e, depth: t }) {
    return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
  }
  hr(e) {
    return `<hr>
`;
  }
  list(e) {
    let t = e.ordered, r = e.start, i = "";
    for (let a = 0; a < e.items.length; a++) {
      let l = e.items[a];
      i += this.listitem(l);
    }
    let s = t ? "ol" : "ul", o = t && r !== 1 ? ' start="' + r + '"' : "";
    return "<" + s + o + `>
` + i + "</" + s + `>
`;
  }
  listitem(e) {
    return `<li>${this.parser.parse(e.tokens)}</li>
`;
  }
  checkbox({ checked: e }) {
    return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: e }) {
    return `<p>${this.parser.parseInline(e)}</p>
`;
  }
  table(e) {
    let t = "", r = "";
    for (let s = 0; s < e.header.length; s++) r += this.tablecell(e.header[s]);
    t += this.tablerow({ text: r });
    let i = "";
    for (let s = 0; s < e.rows.length; s++) {
      let o = e.rows[s];
      r = "";
      for (let a = 0; a < o.length; a++) r += this.tablecell(o[a]);
      i += this.tablerow({ text: r });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: e }) {
    return `<tr>
${e}</tr>
`;
  }
  tablecell(e) {
    let t = this.parser.parseInline(e.tokens), r = e.header ? "th" : "td";
    return (e.align ? `<${r} align="${e.align}">` : `<${r}>`) + t + `</${r}>
`;
  }
  strong({ tokens: e }) {
    return `<strong>${this.parser.parseInline(e)}</strong>`;
  }
  em({ tokens: e }) {
    return `<em>${this.parser.parseInline(e)}</em>`;
  }
  codespan({ text: e }) {
    return `<code>${xt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: r }) {
    let i = this.parser.parseInline(r), s = dd(e);
    if (s === null) return i;
    e = s;
    let o = '<a href="' + e + '"';
    return t && (o += ' title="' + xt(t) + '"'), o += ">" + i + "</a>", o;
  }
  image({ href: e, title: t, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let s = dd(e);
    if (s === null) return xt(r);
    e = s;
    let o = `<img src="${e}" alt="${xt(r)}"`;
    return t && (o += ` title="${xt(t)}"`), o += ">", o;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : xt(e.text);
  }
}, ic = class {
  strong({ text: n }) {
    return n;
  }
  em({ text: n }) {
    return n;
  }
  codespan({ text: n }) {
    return n;
  }
  del({ text: n }) {
    return n;
  }
  html({ text: n }) {
    return n;
  }
  text({ text: n }) {
    return n;
  }
  link({ text: n }) {
    return "" + n;
  }
  image({ text: n }) {
    return "" + n;
  }
  br() {
    return "";
  }
  checkbox({ raw: n }) {
    return n;
  }
}, mt = class Va {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Fn, this.options.renderer = this.options.renderer || new Os(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new ic();
  }
  static parse(e, t) {
    return new Va(t).parse(e);
  }
  static parseInline(e, t) {
    return new Va(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(o.type)) {
          t += a || "";
          continue;
        }
      }
      let s = i;
      switch (s.type) {
        case "space": {
          t += this.renderer.space(s);
          break;
        }
        case "hr": {
          t += this.renderer.hr(s);
          break;
        }
        case "heading": {
          t += this.renderer.heading(s);
          break;
        }
        case "code": {
          t += this.renderer.code(s);
          break;
        }
        case "table": {
          t += this.renderer.table(s);
          break;
        }
        case "blockquote": {
          t += this.renderer.blockquote(s);
          break;
        }
        case "list": {
          t += this.renderer.list(s);
          break;
        }
        case "checkbox": {
          t += this.renderer.checkbox(s);
          break;
        }
        case "html": {
          t += this.renderer.html(s);
          break;
        }
        case "def": {
          t += this.renderer.def(s);
          break;
        }
        case "paragraph": {
          t += this.renderer.paragraph(s);
          break;
        }
        case "text": {
          t += this.renderer.text(s);
          break;
        }
        default: {
          let o = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(o), "";
          throw new Error(o);
        }
      }
    }
    return t;
  }
  parseInline(e, t = this.renderer) {
    this.renderer.parser = this;
    let r = "";
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      if (this.options.extensions?.renderers?.[s.type]) {
        let a = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          r += a || "";
          continue;
        }
      }
      let o = s;
      switch (o.type) {
        case "escape": {
          r += t.text(o);
          break;
        }
        case "html": {
          r += t.html(o);
          break;
        }
        case "link": {
          r += t.link(o);
          break;
        }
        case "image": {
          r += t.image(o);
          break;
        }
        case "checkbox": {
          r += t.checkbox(o);
          break;
        }
        case "strong": {
          r += t.strong(o);
          break;
        }
        case "em": {
          r += t.em(o);
          break;
        }
        case "codespan": {
          r += t.codespan(o);
          break;
        }
        case "br": {
          r += t.br(o);
          break;
        }
        case "del": {
          r += t.del(o);
          break;
        }
        case "text": {
          r += t.text(o);
          break;
        }
        default: {
          let a = 'Token with "' + o.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return r;
  }
}, Pr = class {
  options;
  block;
  constructor(n) {
    this.options = n || Fn;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(n) {
    return n;
  }
  postprocess(n) {
    return n;
  }
  processAllTokens(n) {
    return n;
  }
  emStrongMask(n) {
    return n;
  }
  provideLexer(n = this.block) {
    return n ? pt.lex : pt.lexInline;
  }
  provideParser(n = this.block) {
    return n ? mt.parse : mt.parseInline;
  }
}, ZE = class {
  defaults = Gl();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = mt;
  Renderer = Os;
  TextRenderer = ic;
  Lexer = pt;
  Tokenizer = As;
  Hooks = Pr;
  constructor(...n) {
    this.use(...n);
  }
  walkTokens(n, e) {
    let t = [];
    for (let r of n) switch (t = t.concat(e.call(this, r)), r.type) {
      case "table": {
        let i = r;
        for (let s of i.header) t = t.concat(this.walkTokens(s.tokens, e));
        for (let s of i.rows) for (let o of s) t = t.concat(this.walkTokens(o.tokens, e));
        break;
      }
      case "list": {
        let i = r;
        t = t.concat(this.walkTokens(i.items, e));
        break;
      }
      default: {
        let i = r;
        this.defaults.extensions?.childTokens?.[i.type] ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
          let o = i[s].flat(1 / 0);
          t = t.concat(this.walkTokens(o, e));
        }) : i.tokens && (t = t.concat(this.walkTokens(i.tokens, e)));
      }
    }
    return t;
  }
  use(...n) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return n.forEach((t) => {
      let r = { ...t };
      if (r.async = this.defaults.async || r.async || !1, t.extensions && (t.extensions.forEach((i) => {
        if (!i.name) throw new Error("extension name required");
        if ("renderer" in i) {
          let s = e.renderers[i.name];
          s ? e.renderers[i.name] = function(...o) {
            let a = i.renderer.apply(this, o);
            return a === !1 && (a = s.apply(this, o)), a;
          } : e.renderers[i.name] = i.renderer;
        }
        if ("tokenizer" in i) {
          if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = e[i.level];
          s ? s.unshift(i.tokenizer) : e[i.level] = [i.tokenizer], i.start && (i.level === "block" ? e.startBlock ? e.startBlock.push(i.start) : e.startBlock = [i.start] : i.level === "inline" && (e.startInline ? e.startInline.push(i.start) : e.startInline = [i.start]));
        }
        "childTokens" in i && i.childTokens && (e.childTokens[i.name] = i.childTokens);
      }), r.extensions = e), t.renderer) {
        let i = this.defaults.renderer || new Os(this.defaults);
        for (let s in t.renderer) {
          if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let o = s, a = t.renderer[o], l = i[o];
          i[o] = (...c) => {
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u || "";
          };
        }
        r.renderer = i;
      }
      if (t.tokenizer) {
        let i = this.defaults.tokenizer || new As(this.defaults);
        for (let s in t.tokenizer) {
          if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let o = s, a = t.tokenizer[o], l = i[o];
          i[o] = (...c) => {
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
          };
        }
        r.tokenizer = i;
      }
      if (t.hooks) {
        let i = this.defaults.hooks || new Pr();
        for (let s in t.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o = s, a = t.hooks[o], l = i[o];
          Pr.passThroughHooks.has(s) ? i[o] = (c) => {
            if (this.defaults.async && Pr.passThroughHooksRespectAsync.has(s)) return (async () => {
              let d = await a.call(i, c);
              return l.call(i, d);
            })();
            let u = a.call(i, c);
            return l.call(i, u);
          } : i[o] = (...c) => {
            if (this.defaults.async) return (async () => {
              let d = await a.apply(i, c);
              return d === !1 && (d = await l.apply(i, c)), d;
            })();
            let u = a.apply(i, c);
            return u === !1 && (u = l.apply(i, c)), u;
          };
        }
        r.hooks = i;
      }
      if (t.walkTokens) {
        let i = this.defaults.walkTokens, s = t.walkTokens;
        r.walkTokens = function(o) {
          let a = [];
          return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
        };
      }
      this.defaults = { ...this.defaults, ...r };
    }), this;
  }
  setOptions(n) {
    return this.defaults = { ...this.defaults, ...n }, this;
  }
  lexer(n, e) {
    return pt.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return mt.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, i = { ...this.defaults, ...r }, s = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = n), i.async) return (async () => {
        let o = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(n) : n ? pt.lex : pt.lexInline)(o, i), l = i.hooks ? await i.hooks.processAllTokens(a) : a;
        i.walkTokens && await Promise.all(this.walkTokens(l, i.walkTokens));
        let c = await (i.hooks ? await i.hooks.provideParser(n) : n ? mt.parse : mt.parseInline)(l, i);
        return i.hooks ? await i.hooks.postprocess(c) : c;
      })().catch(s);
      try {
        i.hooks && (e = i.hooks.preprocess(e));
        let o = (i.hooks ? i.hooks.provideLexer(n) : n ? pt.lex : pt.lexInline)(e, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let a = (i.hooks ? i.hooks.provideParser(n) : n ? mt.parse : mt.parseInline)(o, i);
        return i.hooks && (a = i.hooks.postprocess(a)), a;
      } catch (o) {
        return s(o);
      }
    };
  }
  onError(n, e) {
    return (t) => {
      if (t.message += `
Please report this to https://github.com/markedjs/marked.`, n) {
        let r = "<p>An error occurred:</p><pre>" + xt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Rn = new ZE();
function ie(n, e) {
  return Rn.parse(n, e);
}
ie.options = ie.setOptions = function(n) {
  return Rn.setOptions(n), ie.defaults = Rn.defaults, hm(ie.defaults), ie;
};
ie.getDefaults = Gl;
ie.defaults = Fn;
ie.use = function(...n) {
  return Rn.use(...n), ie.defaults = Rn.defaults, hm(ie.defaults), ie;
};
ie.walkTokens = function(n, e) {
  return Rn.walkTokens(n, e);
};
ie.parseInline = Rn.parseInline;
ie.Parser = mt;
ie.parser = mt.parse;
ie.Renderer = Os;
ie.TextRenderer = ic;
ie.Lexer = pt;
ie.lexer = pt.lex;
ie.Tokenizer = As;
ie.Hooks = Pr;
ie.parse = ie;
ie.options;
ie.setOptions;
ie.use;
ie.walkTokens;
ie.parseInline;
mt.parse;
pt.lex;
const QE = ["innerHTML"], eM = /* @__PURE__ */ $({
  __name: "MarkdownView",
  props: {
    source: {}
  },
  setup(n) {
    const e = n, t = E(() => e.source ? ie.parse(e.source, { async: !1 }) : "");
    return (r, i) => (T(), B("div", {
      class: "markdown-view",
      innerHTML: t.value
    }, null, 8, QE));
  }
}), tM = /* @__PURE__ */ ne(eM, [["__scopeId", "data-v-d5b7846c"]]), nM = { class: "llm-service-panel" }, rM = {
  key: 1,
  class: "llm-service-panel__empty"
}, iM = /* @__PURE__ */ $({
  __name: "LLMServicePanel",
  props: {
    service: {}
  },
  setup(n) {
    const e = n, t = ze(), { t: r } = ye(), i = E(() => {
      const c = e.service.status.value;
      return c === "queued" || c === "processing" ? "processing" : c === "error" ? "error" : "done";
    }), s = E(() => e.service.progress.value), o = E(() => e.service.content.value);
    function a() {
      t.emit("llmService:regenerate", { id: e.service.id });
    }
    function l() {
      t.emit("llmService:export", { id: e.service.id });
    }
    return (c, u) => (T(), B("section", nM, [
      q(fm, {
        status: i.value,
        progress: s.value,
        "show-regenerate": "",
        onRegenerate: a,
        onExport: l
      }, {
        default: N(() => [
          o.value ? (T(), R(tM, {
            key: 0,
            source: o.value
          }, null, 8, ["source"])) : (T(), B("div", rM, [
            q(me, {
              variant: "primary",
              icon: "sparkles",
              onClick: a
            }, {
              default: N(() => [
                ge(j(k(r)("llmService.generate")), 1)
              ]),
              _: 1
            })
          ]))
        ]),
        _: 1
      }, 8, ["status", "progress"])
    ]));
  }
}), sM = /* @__PURE__ */ ne(iM, [["__scopeId", "data-v-715aa58a"]]), oM = { class: "switch" }, aM = ["id", "checked"], lM = ["for"], cM = /* @__PURE__ */ $({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? of();
    return (s, o) => (T(), B("div", oM, [
      U("input", {
        type: "checkbox",
        id: k(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, aM),
      U("label", { for: k(i) }, [...o[1] || (o[1] = [
        U("div", { class: "switch-slider" }, null, -1)
      ])], 8, lM)
    ]));
  }
}), Ko = /* @__PURE__ */ ne(cM, [["__scopeId", "data-v-2aa0332f"]]), uM = {
  key: 0,
  class: "form-field__header"
}, dM = ["for"], fM = {
  key: 0,
  class: "form-field__required",
  "aria-hidden": "true"
}, hM = { class: "form-field__input-wrapper" }, pM = ["id", "disabled", "required", "aria-required", "aria-invalid", "aria-describedby"], mM = ["value"], gM = ["type", "id", "disabled", "readonly", "placeholder", "autocomplete", "required", "aria-required", "aria-invalid", "aria-describedby"], yM = {
  key: 3,
  class: "form-field__actions"
}, vM = {
  key: 4,
  class: "form-field__actions form-field__actions--placeholder",
  "aria-hidden": "true"
}, bM = ["id"], kM = { class: "form-field__error" }, wM = /* @__PURE__ */ $({
  __name: "FormInput",
  props: {
    field: {},
    modelValue: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    focus: { type: Boolean },
    withConfirmation: { type: Boolean },
    inline: { type: Boolean },
    fullWidth: { type: Boolean },
    size: { default: "md" },
    textarea: { type: Boolean },
    code: { type: Boolean },
    select: { type: Boolean },
    options: {},
    inputId: {}
  },
  emits: ["update:modelValue", "input", "on-confirm", "on-cancel", "keydown", "blur", "focus"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, { t: s } = ye(), o = of(), a = E(() => r.inputId ?? o), l = zt("input"), c = r.modelValue ?? r.field.value ?? "", u = _(c), d = _(c), f = E(() => r.disabled ?? r.field.disabled ?? !1), h = E(() => r.field.required ?? !1), p = E(() => r.field.error ?? null), m = E(() => !!p.value), g = E(() => r.field.type ?? "text"), y = E(() => r.field.placeholder ?? void 0), b = E(() => r.field.autocomplete ?? void 0), v = E(() => u.value !== d.value), w = E(
      () => r.withConfirmation && v.value
    ), C = E(() => ({
      "form-field": !0,
      [`form-field--${r.size}`]: !0,
      "form-field--inline": r.inline,
      "form-field--disabled": f.value,
      "form-field--error": m.value,
      "form-field--with-confirmation": r.withConfirmation
    })), M = E(() => ({
      "form-field__input": !0,
      "form-field__input--fullwidth": r.fullWidth,
      "form-field__input--error": m.value
    }));
    Z(
      () => r.modelValue,
      (D) => {
        D !== void 0 && D !== u.value && (u.value = D, d.value = D);
      }
    ), Z(
      () => r.field.value,
      (D) => {
        r.modelValue === void 0 && D !== void 0 && D !== u.value && (u.value = D, d.value = D);
      }
    );
    function x() {
      r.withConfirmation || (i("update:modelValue", u.value), i("input", u.value));
    }
    function A() {
      v.value && (d.value = u.value, i("update:modelValue", u.value), i("input", u.value), i("on-confirm"));
    }
    function S() {
      v.value && (u.value = d.value), i("on-cancel");
    }
    function O(D) {
      i("keydown", D), !(!r.withConfirmation || D.defaultPrevented) && (D.key === "Enter" && v.value ? (D.preventDefault(), A()) : D.key === "Escape" && (D.preventDefault(), S()));
    }
    return Re(() => {
      r.focus && l.value?.focus();
    }), e({
      focus: () => l.value?.focus(),
      blur: () => l.value?.blur(),
      select: () => l.value?.select()
    }), (D, I) => (T(), B("div", {
      class: ht(C.value)
    }, [
      n.field.label ? (T(), B("div", uM, [
        U("label", {
          class: "form-field__label",
          for: a.value
        }, [
          ge(j(n.field.label) + " ", 1),
          h.value ? (T(), B("span", fM, "*")) : H("", !0)
        ], 8, dM),
        J(D.$slots, "content-after-label", {}, void 0, !0)
      ])) : H("", !0),
      U("div", hM, [
        J(D.$slots, "default", {}, void 0, !0),
        D.$slots["custom-input"] ? J(D.$slots, "custom-input", {
          key: 0,
          id: a.value,
          disabled: f.value
        }, void 0, !0) : n.select ? is((T(), B("select", ce({
          key: 1,
          ref: "input",
          "onUpdate:modelValue": I[0] || (I[0] = (F) => u.value = F),
          class: [M.value, "form-field__input--select"],
          id: a.value,
          disabled: f.value,
          required: h.value,
          "aria-required": h.value || void 0,
          "aria-invalid": m.value || void 0,
          "aria-describedby": m.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onChange: x,
          onKeydown: O,
          onBlur: I[1] || (I[1] = (F) => i("blur", F)),
          onFocus: I[2] || (I[2] = (F) => i("focus", F))
        }), [
          (T(!0), B(Pe, null, yt(n.options, (F) => (T(), B("option", {
            key: F.value,
            value: F.value
          }, j(F.label), 9, mM))), 128))
        ], 16, pM)), [
          [Zg, u.value]
        ]) : is((T(), B("input", ce({
          key: 2,
          ref: "input",
          "onUpdate:modelValue": I[3] || (I[3] = (F) => u.value = F),
          class: M.value,
          type: g.value,
          id: a.value,
          disabled: f.value,
          readonly: n.readonly,
          placeholder: y.value,
          autocomplete: b.value,
          required: h.value,
          "aria-required": h.value || void 0,
          "aria-invalid": m.value || void 0,
          "aria-describedby": m.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onInput: x,
          onKeydown: O,
          onBlur: I[4] || (I[4] = (F) => i("blur", F)),
          onFocus: I[5] || (I[5] = (F) => i("focus", F))
        }), null, 16, gM)), [
          [Qg, u.value]
        ]),
        w.value ? (T(), B("div", yM, [
          q(me, {
            icon: "x",
            variant: "tertiary",
            size: n.size,
            "aria-label": k(s)("form.cancel"),
            onMousedown: I[6] || (I[6] = sn(() => {
            }, ["prevent"])),
            onClick: S
          }, null, 8, ["size", "aria-label"]),
          q(me, {
            icon: "check",
            variant: "primary",
            size: n.size,
            "aria-label": k(s)("form.apply"),
            onMousedown: I[7] || (I[7] = sn(() => {
            }, ["prevent"])),
            onClick: A
          }, null, 8, ["size", "aria-label"])
        ])) : n.withConfirmation ? (T(), B("div", vM)) : H("", !0),
        J(D.$slots, "content-after-input", {}, void 0, !0)
      ]),
      J(D.$slots, "content-bottom-input", {}, void 0, !0),
      m.value ? (T(), B("div", {
        key: 1,
        id: `${a.value}-error`,
        class: "form-field__info"
      }, [
        U("span", kM, j(p.value), 1)
      ], 8, bM)) : H("", !0)
    ], 2));
  }
}), Si = /* @__PURE__ */ ne(wM, [["__scopeId", "data-v-31189879"]]), xM = ["disabled", "aria-label"], SM = /* @__PURE__ */ $({
  __name: "EditableText",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue", "commit", "cancel"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = _(!1), s = _(t.modelValue), o = zt("input"), a = E(() => ({
      placeholder: t.placeholder,
      customParams: t.ariaLabel ? { "aria-label": t.ariaLabel } : void 0
    }));
    Z(
      () => t.modelValue,
      (f) => {
        i.value || (s.value = f);
      }
    );
    async function l() {
      t.disabled || (s.value = t.modelValue, i.value = !0, await xe(), o.value?.focus(), o.value?.select());
    }
    function c() {
      if (!i.value) return;
      const f = s.value.trim();
      i.value = !1, !(!f || f === t.modelValue) && (r("update:modelValue", f), r("commit", f));
    }
    function u() {
      i.value && (i.value = !1, s.value = t.modelValue, r("cancel"));
    }
    function d(f) {
      f.key === "Enter" ? (f.preventDefault(), c()) : f.key === "Escape" && (f.preventDefault(), u());
    }
    return (f, h) => i.value ? (T(), R(Si, {
      key: 0,
      ref: "input",
      modelValue: s.value,
      "onUpdate:modelValue": h[0] || (h[0] = (p) => s.value = p),
      field: a.value,
      size: "sm",
      "full-width": "",
      onKeydown: d,
      onBlur: c
    }, null, 8, ["modelValue", "field"])) : (T(), B("button", {
      key: 1,
      type: "button",
      class: "editable-text-display",
      disabled: n.disabled,
      "aria-label": n.ariaLabel,
      onClick: l
    }, j(n.modelValue || n.placeholder), 9, xM));
  }
}), CM = /* @__PURE__ */ ne(SM, [["__scopeId", "data-v-511d4fb4"]]), TM = /* @__PURE__ */ $({
  __name: "SpeakerMenu",
  emits: ["merge"],
  setup(n, { emit: e }) {
    const t = e, { t: r } = ye(), i = E(() => [
      { id: "merge", label: r("speakerMenu.merge") }
    ]);
    function s(o) {
      o.id === "merge" && t("merge");
    }
    return (o, a) => (T(), R(Xl, {
      items: i.value,
      "item-key": (l) => l.id,
      align: "end",
      onSelect: s
    }, {
      trigger: N(() => [
        q(me, {
          icon: "more-vertical",
          variant: "transparent",
          "aria-label": k(r)("speakerMenu.openMenu")
        }, null, 8, ["aria-label"])
      ]),
      item: N(({ item: l }) => [
        U("span", null, j(l.label), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
});
function EM(n) {
  const e = n.speakers.all.size;
  return sr[e % sr.length];
}
function Sm(n, e) {
  let t = null;
  return n.state.doc.descendants((r, i) => {
    if (t !== null) return !1;
    if (r.type.name === "turn" && r.attrs.id === e)
      return t = i, !1;
  }), t;
}
function Cm(n, e) {
  const t = [];
  return n.state.doc.descendants((r, i) => {
    r.type.name === "turn" && r.attrs.speakerId === e && t.push({ pos: i, turnId: r.attrs.id, attrs: { ...r.attrs } });
  }), t;
}
function MM(n, e) {
  return Cm(n, e).length;
}
function AM(n, e, t) {
  const r = t.trim(), i = n.speakers.all.get(e);
  if (!i || !r || r === i.name) return;
  const s = n.transcriptionEditor?.speakersMap;
  if (s && s.doc) {
    const o = {
      type: "speaker:rename",
      speakerId: e,
      from: i.name,
      to: r
    };
    s.doc.transact(() => {
      const a = s.get(e);
      a && s.set(e, { ...a, name: r });
    }, o);
  } else
    n.speakers.update(e, { name: r });
}
function OM(n, e, t) {
  const r = n.transcriptionEditor?.tiptapEditor.value;
  if (!r) return;
  const i = Sm(r, e);
  if (i === null) return;
  const s = r.state.doc.nodeAt(i)?.attrs.speakerId ?? null;
  if (s === t) return;
  const o = {
    type: "turn:reassign",
    turnId: e,
    from: s,
    to: t
  }, a = n.transcriptionEditor?.doc, l = () => {
    const c = r.state.tr.setNodeAttribute(i, "speakerId", t);
    r.view.dispatch(c);
  };
  a ? a.transact(l, o) : l();
}
function DM(n, e, t) {
  const r = t.trim();
  if (!r) return null;
  const i = n.transcriptionEditor?.tiptapEditor.value, s = n.transcriptionEditor?.speakersMap, o = n.transcriptionEditor?.doc;
  if (!i || !s || !o) return null;
  const a = Sm(i, e);
  if (a === null) return null;
  const l = crypto.randomUUID(), c = EM(n), u = {
    type: "speaker:create-and-assign",
    speakerId: l,
    name: r,
    turnId: e
  };
  return o.transact(() => {
    s.set(l, { name: r, color: c });
    const d = i.state.tr.setNodeAttribute(a, "speakerId", l);
    i.view.dispatch(d);
  }, u), l;
}
function _M(n, e, t) {
  if (e === t) return;
  const r = n.transcriptionEditor?.tiptapEditor.value, i = n.transcriptionEditor?.speakersMap, s = n.transcriptionEditor?.doc;
  if (!r || !i || !s || !i.has(e) || !i.has(t)) return;
  const o = Cm(r, e), a = {
    type: "speaker:merge",
    from: e,
    to: t,
    affectedTurnIds: o.map((l) => l.turnId)
  };
  s.transact(() => {
    if (o.length > 0) {
      let l = r.state.tr;
      for (const c of o)
        l = l.setNodeAttribute(c.pos, "speakerId", t);
      r.view.dispatch(l);
    }
    i.delete(e);
  }, a);
}
const PM = { class: "merge-dialog-title" }, RM = { class: "merge-dialog-description" }, IM = { class: "merge-dialog-actions" }, NM = /* @__PURE__ */ $({
  __name: "MergeDialog",
  props: {
    open: { type: Boolean },
    fromSpeakerId: {}
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = ze(), { t: s } = ye(), o = zt("dialog"), a = _(""), l = E(
      () => t.fromSpeakerId ? i.speakers.all.get(t.fromSpeakerId) : void 0
    ), c = E(
      () => Array.from(i.speakers.all.values()).filter(
        (m) => m.id !== t.fromSpeakerId
      )
    ), u = E(
      () => c.value.map((m) => ({ value: m.id, label: m.name }))
    ), d = E(() => ({
      label: s("mergeDialog.targetLabel"),
      required: !0
    })), f = E(() => {
      const m = i.transcriptionEditor?.tiptapEditor.value;
      return !m || !t.fromSpeakerId ? 0 : MM(m, t.fromSpeakerId);
    });
    Z(
      () => t.open,
      (m) => {
        m ? (a.value = c.value[0]?.id ?? "", o.value?.showModal()) : o.value?.close();
      }
    );
    function h() {
      r("update:open", !1);
    }
    function p() {
      !t.fromSpeakerId || !a.value || (_M(i, t.fromSpeakerId, a.value), r("update:open", !1));
    }
    return (m, g) => (T(), B("dialog", {
      ref: "dialog",
      class: "merge-dialog",
      onClose: h,
      onCancel: sn(h, ["prevent"])
    }, [
      l.value ? (T(), B("form", {
        key: 0,
        class: "merge-dialog-form",
        onSubmit: sn(p, ["prevent"])
      }, [
        U("h2", PM, j(k(s)("mergeDialog.title")), 1),
        U("p", RM, [
          U("strong", null, j(l.value.name), 1),
          ge(" · " + j(f.value) + " " + j(k(s)("mergeDialog.turnsAffected")), 1)
        ]),
        q(Si, {
          select: "",
          field: d.value,
          options: u.value,
          modelValue: a.value,
          "onUpdate:modelValue": g[0] || (g[0] = (y) => a.value = y)
        }, null, 8, ["field", "options", "modelValue"]),
        U("div", IM, [
          q(me, {
            variant: "tertiary",
            type: "button",
            onClick: h
          }, {
            default: N(() => [
              ge(j(k(s)("mergeDialog.cancel")), 1)
            ]),
            _: 1
          }),
          q(me, {
            variant: "primary",
            type: "submit",
            disabled: !a.value
          }, {
            default: N(() => [
              ge(j(k(s)("mergeDialog.confirm")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : H("", !0)
    ], 544));
  }
}), $M = /* @__PURE__ */ ne(NM, [["__scopeId", "data-v-be330083"]]), Tm = /* @__PURE__ */ $({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = ye(), s = E(
      () => t.channels.map((a) => ({ value: a.id, label: a.name }))
    ), o = E(() => ({ label: i("sidebar.channelSelectLabel") }));
    return (a, l) => (T(), R(Si, {
      select: "",
      field: o.value,
      options: s.value,
      "model-value": n.selectedChannelId,
      "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedChannelId", c))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), Em = /* @__PURE__ */ $({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = ye(), o = E(
      () => vy(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    ), a = E(() => ({ label: i("sidebar.translationSelectLabel") }));
    return (l, c) => (T(), R(Si, {
      select: "",
      field: a.value,
      options: o.value,
      "model-value": n.selectedTranslationId,
      "onUpdate:modelValue": c[0] || (c[0] = (u) => r("update:selectedTranslationId", u))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), BM = { class: "speaker-sidebar" }, LM = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, zM = { class: "sidebar-title" }, FM = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, VM = { class: "sidebar-title" }, qM = {
  key: 2,
  class: "sidebar-section"
}, UM = { class: "sidebar-title" }, WM = { class: "subtitle-toggle" }, jM = { class: "subtitle-toggle-label" }, HM = { class: "subtitle-slider" }, KM = { class: "subtitle-slider-label" }, JM = { class: "subtitle-slider-value" }, XM = ["value", "disabled"], GM = {
  key: 0,
  class: "subtitle-toggle"
}, YM = { class: "subtitle-toggle-label" }, ZM = {
  key: 1,
  class: "subtitle-toggle"
}, QM = { class: "subtitle-toggle-label" }, eA = {
  key: 3,
  class: "sidebar-section"
}, tA = { class: "sidebar-title" }, nA = { class: "speaker-list" }, rA = /* @__PURE__ */ $({
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
    const e = ze(), { t } = ye(), r = E(() => e.capabilities.value.speakers === "edit"), i = _(!1), s = _(null);
    function o(l, c) {
      AM(e, l, c);
    }
    function a(l) {
      s.value = l, i.value = !0;
    }
    return (l, c) => (T(), B("aside", BM, [
      n.channels.length > 1 ? (T(), B("section", LM, [
        U("h2", zM, j(k(t)("sidebar.channel")), 1),
        q(Tm, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": c[0] || (c[0] = (u) => l.$emit("update:selectedChannelId", u))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : H("", !0),
      n.translations.length > 1 ? (T(), B("section", FM, [
        U("h2", VM, j(k(t)("sidebar.translation")), 1),
        q(Em, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": c[1] || (c[1] = (u) => l.$emit("update:selectedTranslationId", u))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : H("", !0),
      k(e).subtitle ? (T(), B("section", qM, [
        U("h2", UM, j(k(t)("sidebar.subtitle")), 1),
        U("div", WM, [
          U("span", jM, j(k(t)("subtitle.show")), 1),
          q(Ko, {
            modelValue: k(e).subtitle.isVisible.value,
            "onUpdate:modelValue": c[2] || (c[2] = (u) => k(e).subtitle.isVisible.value = u)
          }, null, 8, ["modelValue"])
        ]),
        U("label", HM, [
          U("span", KM, [
            ge(j(k(t)("subtitle.fontSize")) + " ", 1),
            U("span", JM, j(k(e).subtitle.fontSize.value) + "px", 1)
          ]),
          U("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: k(e).subtitle.fontSize.value,
            disabled: !k(e).subtitle.isVisible.value,
            onInput: c[3] || (c[3] = (u) => k(e).subtitle.fontSize.value = Number(u.target.value))
          }, null, 40, XM)
        ]),
        k(e).subtitle.watermark && !k(e).subtitle.watermark.readonly ? (T(), B("div", GM, [
          U("span", YM, j(k(t)("subtitle.showWatermark")), 1),
          q(Ko, {
            modelValue: k(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": c[4] || (c[4] = (u) => k(e).subtitle.watermark.display.value = u),
            disabled: !k(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : H("", !0),
        k(e).subtitle.watermark && !k(e).subtitle.watermark.readonly && k(e).subtitle.watermark.display.value ? (T(), B("div", ZM, [
          U("span", QM, j(k(t)("subtitle.pinWatermark")), 1),
          q(Ko, {
            modelValue: k(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": c[5] || (c[5] = (u) => k(e).subtitle.watermark.pinned.value = u),
            disabled: !k(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : H("", !0)
      ])) : H("", !0),
      n.speakers.length ? (T(), B("section", eA, [
        U("h2", tA, j(k(t)("sidebar.speakers")), 1),
        U("ul", nA, [
          (T(!0), B(Pe, null, yt(n.speakers, (u) => (T(), B("li", {
            key: u.id,
            class: "speaker-item"
          }, [
            q(zs, {
              color: u.color
            }, null, 8, ["color"]),
            q(CM, {
              class: "speaker-name",
              "model-value": u.name,
              disabled: !r.value,
              "aria-label": k(t)("sidebar.renameSpeaker"),
              onCommit: (d) => o(u.id, d)
            }, null, 8, ["model-value", "disabled", "aria-label", "onCommit"]),
            r.value && n.speakers.length > 1 ? (T(), R(TM, {
              key: 0,
              "speaker-name": u.name,
              onMerge: (d) => a(u.id)
            }, null, 8, ["speaker-name", "onMerge"])) : H("", !0)
          ]))), 128))
        ])
      ])) : H("", !0),
      r.value ? (T(), R($M, {
        key: 4,
        open: i.value,
        "onUpdate:open": c[6] || (c[6] = (u) => i.value = u),
        "from-speaker-id": s.value
      }, null, 8, ["open", "from-speaker-id"])) : H("", !0)
    ]));
  }
}), md = /* @__PURE__ */ ne(rA, [["__scopeId", "data-v-6ea39002"]]), iA = /* @__PURE__ */ $({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = ey(n, "open"), { t } = ye();
    return (r, i) => (T(), R(k(sb), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: N(() => [
        q(k(qb), { disabled: "" }, {
          default: N(() => [
            q(k(zb), { class: "editor-overlay" }),
            q(k(Nb), { class: "sidebar-drawer" }, {
              default: N(() => [
                q(k(Wb), { class: "sr-only" }, {
                  default: N(() => [
                    ge(j(k(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(k(ab), {
                  class: "sidebar-close",
                  "aria-label": k(t)("header.closeSidebar")
                }, {
                  default: N(() => [
                    q(k(ol), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                J(r.$slots, "default")
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
}), sA = { class: "player-controls" }, oA = { class: "controls-left" }, aA = { class: "controls-time" }, lA = { class: "time-display" }, cA = { class: "time-display" }, uA = { class: "controls-right" }, dA = ["value", "aria-label", "disabled"], fA = /* @__PURE__ */ $({
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
    const t = e, { t: r } = ye(), i = _(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (T(), B("div", sA, [
      U("div", oA, [
        q(me, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": k(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: N(() => [
            q(k(yf), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(me, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? k(r)("player.pause") : k(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: N(() => [
            n.isPlaying ? (T(), R(k(mf), {
              key: 0,
              size: 20
            })) : (T(), R(k(gf), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(me, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": k(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: N(() => [
            q(k(vf), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      U("div", aA, [
        U("time", lA, j(n.currentTime), 1),
        a[7] || (a[7] = U("span", { class: "time-separator" }, "/", -1)),
        U("time", cA, j(n.duration), 1)
      ]),
      U("div", uA, [
        U("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          q(me, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? k(r)("player.unmute") : k(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: N(() => [
              n.isMuted ? (T(), R(k(xf), {
                key: 0,
                size: 16
              })) : (T(), R(k(wf), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          is(U("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": k(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, dA), [
            [af, i.value]
          ])
        ], 32),
        q(me, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": k(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: N(() => [
            ge(j(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), hA = /* @__PURE__ */ ne(fA, [["__scopeId", "data-v-99f700b1"]]);
function We(n, e, t, r) {
  return new (t || (t = Promise))((function(i, s) {
    function o(c) {
      try {
        l(r.next(c));
      } catch (u) {
        s(u);
      }
    }
    function a(c) {
      try {
        l(r.throw(c));
      } catch (u) {
        s(u);
      }
    }
    function l(c) {
      var u;
      c.done ? i(c.value) : (u = c.value, u instanceof t ? u : new t((function(d) {
        d(u);
      }))).then(o, a);
    }
    l((r = r.apply(n, e || [])).next());
  }));
}
let Ci = class {
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
const Vi = { decode: function(n, e) {
  return We(this, void 0, void 0, (function* () {
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
      for (let a = 0; a < s; a++) {
        const l = Math.abs(i[a]);
        l > o && (o = l);
      }
      for (const a of r) for (let l = 0; l < s; l++) a[l] /= o;
    }
  })(n);
  const t = n.map(((r) => r instanceof Float32Array ? r : Float32Array.from(r)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (r) => {
    const i = t[r];
    if (!i) throw new Error(`Channel ${r} not found`);
    return i;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Mm(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Mm(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function gd(n, e, t) {
  const r = Mm(n, e || {});
  return t?.appendChild(r), r;
}
var pA = Object.freeze({ __proto__: null, createElement: gd, default: gd });
const mA = { fetchBlob: function(n, e, t) {
  return We(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      We(this, void 0, void 0, (function* () {
        if (!i.body || !i.headers) return;
        const o = i.body.getReader(), a = Number(i.headers.get("Content-Length")) || 0;
        let l = 0;
        const c = (u) => {
          l += u?.length || 0;
          const d = Math.round(l / a * 100);
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
function pe(n) {
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
function gn(n, e) {
  const t = pe(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Xt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class gA extends Ci {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = pe(!1), this._currentTime = pe(0), this._duration = pe(0), this._volume = pe(this.media.volume), this._muted = pe(this.media.muted), this._playbackRate = pe(this.media.playbackRate || 1), this._seeking = pe(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    return We(this, void 0, void 0, (function* () {
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
function yA({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function vA({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function yd(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function Am(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function vd(n, e) {
  if (!Am(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function bd({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function Om(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function bA(n) {
  const e = pe({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = gn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = gn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), Om(e);
  } };
}
class kA extends Ci {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = yd(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = yd(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = bA(this.scrollContainer);
    const e = Xt((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = pe(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let h = f.clientX, p = f.clientY, m = !1;
        const g = Date.now(), y = t.getBoundingClientRect(), { left: b, top: v } = y, w = (S) => {
          if (S.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const O = S.clientX, D = S.clientY, I = O - h, F = D - p;
          (m || Math.abs(I) > i || Math.abs(F) > i) && (S.preventDefault(), S.stopPropagation(), m || (a.set({ type: "start", x: h - b, y: p - v }), m = !0), a.set({ type: "move", x: O - b, y: D - v, deltaX: I, deltaY: F }), h = O, p = D);
        }, C = (S) => {
          if (l.delete(S.pointerId), m) {
            const O = S.clientX, D = S.clientY;
            a.set({ type: "end", x: O - b, y: D - v });
          }
          u();
        }, M = (S) => {
          l.delete(S.pointerId), S.relatedTarget && S.relatedTarget !== document.documentElement || C(S);
        }, x = (S) => {
          m && (S.stopPropagation(), S.preventDefault());
        }, A = (S) => {
          S.defaultPrevented || l.size > 1 || m && S.preventDefault();
        };
        document.addEventListener("pointermove", w), document.addEventListener("pointerup", C), document.addEventListener("pointerout", M), document.addEventListener("pointercancel", M), document.addEventListener("touchmove", A, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", M), document.removeEventListener("pointercancel", M), document.removeEventListener("touchmove", A), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), l.clear(), Om(a);
      } };
    })(this.wrapper);
    const e = Xt((() => {
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
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: a, numberOfChannels: l, defaultHeight: c = 128 }) {
      if (s == null) return c;
      const u = Number(s);
      if (!isNaN(u)) return u;
      if (s === "auto") {
        const d = a || c;
        return o?.every(((f) => !f.overlay)) ? d / l : d;
      }
      return c;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: i, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(r, i, s) {
      if (!Array.isArray(r)) return r || "";
      if (r.length === 0) return "#999";
      if (r.length < 2) return r[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), l = s ?? o.height * i, c = a.createLinearGradient(0, 0, 0, l || i), u = 1 / (r.length - 1);
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
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: p, height: m, length: g, options: y, pixelRatio: b }) {
      const v = m / 2, w = y.barWidth ? y.barWidth * b : 1, C = y.barGap ? y.barGap * b : y.barWidth ? w / 2 : 0, M = w + C || 1;
      return { halfHeight: v, barWidth: w, barGap: C, barRadius: y.barRadius || 0, barMinHeight: y.barMinHeight ? y.barMinHeight * b : 0, barIndexScale: g > 0 ? p / M / g : 0, barSpacing: M };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: y, halfHeight: b, vScale: v, canvasHeight: w, barAlign: C, barMinHeight: M }) {
      const x = p[0] || [], A = p[1] || x, S = x.length, O = [];
      let D = 0, I = 0, F = 0;
      for (let L = 0; L <= S; L++) {
        const G = Math.round(L * m);
        if (G > D) {
          const { topHeight: ue, totalHeight: ve } = yA({ maxTop: I, maxBottom: F, halfHeight: b, vScale: v, barMinHeight: M, barAlign: C }), Dt = vA({ barAlign: C, halfHeight: b, topHeight: ue, totalHeight: ve, canvasHeight: w });
          O.push({ x: D * g, y: Dt, width: y, height: ve }), D = G, I = 0, F = 0;
        }
        const ae = Math.abs(x[L] || 0), re = Math.abs(A[L] || 0);
        ae > I && (I = ae), re > F && (F = re);
      }
      return O;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const p of h) c && "roundRect" in r ? r.roundRect(p.x, p.y, p.width, p.height, c) : r.rect(p.x, p.y, p.width, p.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, h = l[0] || [];
      return [h, l[1] || h].map(((p, m) => {
        const g = p.length, y = g ? c / g : 0, b = f, v = m === 0 ? -1 : 1, w = [{ x: 0, y: b }];
        let C = 0, M = 0;
        for (let x = 0; x <= g; x++) {
          const A = Math.round(x * y);
          if (A > C) {
            const O = b + (Math.round(M * f * d) || 1) * v;
            w.push({ x: C, y: O }), C = A, M = 0;
          }
          const S = Math.abs(p[x] || 0);
          S > M && (M = S);
        }
        return w.push({ x: C, y: b }), w;
      }));
    })({ channelData: e, width: s, height: o, vScale: i });
    r.beginPath();
    for (const l of a) if (l.length) {
      r.moveTo(l[0].x, l[0].y);
      for (let c = 1; c < l.length; c++) {
        const u = l[c];
        r.lineTo(u.x, u.y);
      }
    }
    r.fill(), r.closePath();
  }
  renderWaveform(e, t, r) {
    if (r.fillStyle = this.convertColorValues(t.waveColor, r), t.renderFunction) return void t.renderFunction(e, r);
    const i = (function({ channelData: s, barHeight: o, normalize: a, maxPeak: l }) {
      var c;
      const u = o || 1;
      if (!a) return u;
      const d = s[0];
      if (!d || d.length === 0) return u;
      let f = l ?? 0;
      if (!l) for (let h = 0; h < d.length; h++) {
        const p = (c = d[h]) !== null && c !== void 0 ? c : 0, m = Math.abs(p);
        m > f && (f = m);
      }
      return f ? u / f : u;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Am(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
  }
  renderSingleCanvas(e, t, r, i, s, o, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(r * l), c.height = Math.round(i * l), c.style.width = `${r}px`, c.style.height = `${i}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (t.renderFunction ? (u.fillStyle = this.convertColorValues(t.waveColor, u), t.renderFunction(e, u)) : this.renderWaveform(e, t, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), f = d.getContext("2d");
      f.drawImage(c, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(t.progressColor, f), f.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, r, i, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = r / a, u = (function({ clientWidth: p, totalWidth: m, options: g }) {
      return vd(Math.min(8e3, p, m), g);
    })({ clientWidth: l, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = vd(g, t), g <= 0) return;
      const y = (function({ channelData: b, offset: v, clampedWidth: w, totalWidth: C }) {
        return b.map(((M) => {
          const x = Math.floor(v / C * M.length), A = Math.floor((v + w) / C * M.length);
          return M.slice(x, A);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(y, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (bd({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), bd({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
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
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, s && i > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, r, l, a, c);
  }
  render(e) {
    return We(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: f, pixelRatio: h }) {
        const p = Math.ceil(c * u), m = p > d, g = !!(f && !m);
        return { scrollWidth: p, isScrollable: m, useParentWidth: g, width: (g ? d : p) * h };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: i, fillParent: this.options.fillParent, pixelRatio: r });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let c = 0; c < e.numberOfChannels; c++) {
        const u = Object.assign(Object.assign({}, this.options), (t = this.options.splitChannels) === null || t === void 0 ? void 0 : t[c]);
        this.renderChannel([e.getChannelData(c)], u, l, c);
      }
      else {
        const c = [e.getChannelData(0)];
        e.numberOfChannels > 1 && c.push(e.getChannelData(1)), this.renderChannel(c, this.options, l, 0);
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
    const { scrollLeft: r, scrollWidth: i, clientWidth: s } = this.scrollContainer, o = e * i, a = r, l = r + s, c = s / 2;
    if (this.isDragging)
      o + 30 > l ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > l) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? c : 0));
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
    return We(this, void 0, void 0, (function* () {
      const i = this.canvasWrapper.querySelectorAll("canvas");
      if (!i.length) throw new Error("No waveform data");
      if (r === "dataURL") {
        const s = Array.from(i).map(((o) => o.toDataURL(e, t)));
        return Promise.resolve(s);
      }
      return Promise.all(Array.from(i).map(((s) => new Promise(((o, a) => {
        s.toBlob(((l) => {
          l ? o(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class wA extends Ci {
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
class Jo extends Ci {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return We(this, void 0, void 0, (function* () {
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
    return We(this, void 0, void 0, (function* () {
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
    return We(this, void 0, void 0, (function* () {
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
const xA = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class ri extends gA {
  static create(e) {
    return new ri(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new Jo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, xA, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, h;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : pe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : pe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : pe(!1), y = (d = a?.isSeeking) !== null && d !== void 0 ? d : pe(!1), b = (f = a?.volume) !== null && f !== void 0 ? f : pe(1), v = (h = a?.playbackRate) !== null && h !== void 0 ? h : pe(1), w = pe(null), C = pe(null), M = pe(""), x = pe(0), A = pe(0), S = gn((() => !g.value), [g]), O = gn((() => w.value !== null), [w]), D = gn((() => O.value && m.value > 0), [O, m]), I = gn((() => p.value), [p]), F = gn((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: S, isSeeking: y, volume: b, playbackRate: v, audioBuffer: w, peaks: C, url: M, zoom: x, scrollPosition: A, canPlay: O, isReady: D, progress: I, progressPercent: F }, actions: { setCurrentTime: (L) => {
        const G = Math.max(0, Math.min(m.value || 1 / 0, L));
        p.set(G);
      }, setDuration: (L) => {
        m.set(Math.max(0, L));
      }, setPlaying: (L) => {
        g.set(L);
      }, setSeeking: (L) => {
        y.set(L);
      }, setVolume: (L) => {
        const G = Math.max(0, Math.min(1, L));
        b.set(G);
      }, setPlaybackRate: (L) => {
        const G = Math.max(0.1, Math.min(16, L));
        v.set(G);
      }, setAudioBuffer: (L) => {
        w.set(L), L && m.set(L.duration);
      }, setPeaks: (L) => {
        C.set(L);
      }, setUrl: (L) => {
        M.set(L);
      }, setZoom: (L) => {
        x.set(Math.max(0, L));
      }, setScrollPosition: (L) => {
        A.set(Math.max(0, L));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new wA();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new kA(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const o = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (o || a && l) && this.load(o, a, l).catch(((c) => {
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
      r.push(Xt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Xt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Xt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Xt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Xt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Xt((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Vi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Vi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return We(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        t = yield mA.fetchBlob(e, l, a);
        const c = this.options.blobMimeType;
        c && (t = new Blob([t], { type: c }));
      }
      this.setSrc(e, t);
      const o = yield new Promise(((a) => {
        const l = i || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof Jo && (a.duration = o);
      }
      if (r) this.decodedData = Vi.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Vi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return We(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return We(this, void 0, void 0, (function* () {
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
      const a = this.decodedData.getChannelData(o), l = [], c = a.length / t;
      for (let u = 0; u < t; u++) {
        const d = a.slice(Math.floor(u * c), Math.ceil((u + 1) * c));
        let f = 0;
        for (let h = 0; h < d.length; h++) {
          const p = d[h];
          Math.abs(p) > Math.abs(f) && (f = p);
        }
        l.push(Math.round(f * r) / r);
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
    const r = Object.create(null, { play: { get: () => super.play } });
    return We(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof Jo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return We(this, void 0, void 0, (function* () {
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
    return We(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
ri.BasePlugin = class extends Ci {
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
}, ri.dom = pA;
class Dm {
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
class SA extends Dm {
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
function _m(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(_m(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Rr(n, e, t) {
  const r = _m(n, e || {});
  return t?.appendChild(r), r;
}
function Pm(n) {
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
function Xi(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Hn(n, e) {
  const t = Pm(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function hn(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Gi(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = Pm(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: y } = m, b = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - p < i) return;
      const A = x.clientX, S = x.clientY, O = A - d, D = S - f;
      (h || Math.abs(O) > t || Math.abs(D) > t) && (x.preventDefault(), x.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - y }), h = !0), s.set({ type: "move", x: A - g, y: S - y, deltaX: O, deltaY: D }), d = A, f = S);
    }, v = (x) => {
      if (o.delete(x.pointerId), h) {
        const A = x.clientX, S = x.clientY;
        s.set({ type: "end", x: A - g, y: S - y });
      }
      l();
    }, w = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || v(x);
    }, C = (x) => {
      h && (x.stopPropagation(), x.preventDefault());
    }, M = (x) => {
      x.defaultPrevented || o.size > 1 || h && x.preventDefault();
    };
    document.addEventListener("pointermove", b), document.addEventListener("pointerup", v), document.addEventListener("pointerout", w), document.addEventListener("pointercancel", w), document.addEventListener("touchmove", M, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", v), document.removeEventListener("pointerout", w), document.removeEventListener("pointercancel", w), document.removeEventListener("touchmove", M), setTimeout((() => {
        document.removeEventListener("click", C, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", c), o.clear(), hn(s);
  } };
}
class kd extends Dm {
  constructor(e, t, r = 0) {
    var i, s, o, a, l, c, u, d, f, h;
    super(), this.totalDuration = t, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (h = e.contentEditable) !== null && h !== void 0 ? h : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Rr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Rr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Gi(r, { threshold: 1 }), o = Gi(i, { threshold: 1 }), a = Xi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Xi((() => {
      const c = o.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "end") : c.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), l(), s.cleanup(), o.cleanup();
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
    const i = Rr("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Hn(e, "click"), r = Hn(e, "mouseenter"), i = Hn(e, "mouseleave"), s = Hn(e, "dblclick"), o = Hn(e, "pointerdown"), a = Hn(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), h(), hn(t), hn(r), hn(i), hn(s), hn(o), hn(a);
    }));
    const p = Gi(e), m = Xi((() => {
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
    let a = t && t !== "start" ? this.start : this.start + o, l = t && t !== "end" ? this.end : this.end + o;
    const c = r !== void 0;
    c && this.updatingSide && this.updatingSide !== t && (this.updatingSide === "start" ? a = r : l = r), a = Math.max(0, a), l = Math.min(this.totalDuration, l);
    const u = l - a;
    this.updatingSide = t;
    const d = u >= this.minLength && u <= this.maxLength;
    a <= l && (d || c) && (this.start = a, this.end = l, this.renderPosition(), this.emit("update", t));
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
        this.content = Rr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class sc extends SA {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new sc(e);
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
    return Rr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const a = i.getBoundingClientRect(), l = e.element.getBoundingClientRect(), c = l.left - a.left, u = l.right - a.left;
    c < 0 ? i.scrollLeft += c : u > s && (i.scrollLeft += u - s);
  }
  virtualAppend(e, t, r) {
    const i = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), c = Math.round(e.start / l * a), u = c + (Math.round((e.end - e.start) / l * a) || 1) > o && c < o + s;
      u && !r.parentElement ? t.appendChild(r) : !u && r.parentElement && r.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      i();
      const s = this.wavesurfer.on("scroll", i), o = this.wavesurfer.on("zoom", i), a = this.wavesurfer.on("resize", i);
      this.subscriptions.push(s, o, a), e.once("remove", (() => {
        s(), o(), a();
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new kd(e, i, s);
    return this.emit("region-initialized", o), i ? this.saveRegion(o) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      o._setTotalDuration(a), this.saveRegion(o);
    }))), o;
  }
  enableDragSelection(e, t = 3) {
    var r;
    const i = (r = this.wavesurfer) === null || r === void 0 ? void 0 : r.getWrapper();
    if (!(i && i instanceof HTMLElement)) return () => {
    };
    let s = null, o = 0, a = 0;
    const l = Gi(i, { threshold: t }), c = Xi((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * h;
        const g = f.x / m * h, y = (f.x + 5) / m * h;
        s = new kd(Object.assign(Object.assign({}, e), { start: g, end: y }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else f.type === "move" && f.deltaX !== void 0 ? s && s._onUpdate(f.deltaX, f.x > o ? "end" : "start", a) : f.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
    }), [l.signal]);
    return () => {
      c(), l.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((e) => e.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
}
const Xo = [0.5, 0.75, 1, 1.25, 1.5, 2];
function CA(n) {
  const { containerRef: e, audioSrc: t } = n, r = ze();
  if (!r.audio)
    throw new Error("useAudioPlayer requires the audio plugin (core.audio)");
  const i = r.audio, s = Lt(null), o = Lt(null), a = i.currentTime, l = i.isPlaying, c = _(0), u = _(!1), d = _(!1), f = _(null), h = _(1), p = _(1), m = _(!1), g = E(
    () => ss(a.value)
  ), y = E(() => ss(c.value)), b = /* @__PURE__ */ new Map(), v = [];
  function w(V) {
    const te = o.value;
    if (!te) return;
    if (V.startTime == null || V.endTime == null) {
      C(V.id);
      return;
    }
    const Ve = V.speakerId ? r.speakers.all.get(V.speakerId) : void 0;
    if (!Ve || !V.speakerId) {
      C(V.id);
      return;
    }
    const qe = Tc(Ve.color, 0.25), Ai = b.get(V.id);
    if (Ai) {
      Ai.region.setOptions({
        start: V.startTime,
        end: V.endTime,
        color: qe
      }), Ai.region.element?.style.setProperty(
        "--region-color",
        Ve.color
      ), Ai.speakerId = V.speakerId;
      return;
    }
    const wc = te.addRegion({
      start: V.startTime,
      end: V.endTime,
      color: qe,
      drag: !1,
      resize: !1
    });
    wc.element?.style.setProperty("--region-color", Ve.color), b.set(V.id, { region: wc, speakerId: V.speakerId });
  }
  function C(V) {
    const te = b.get(V);
    te && (te.region.remove(), b.delete(V));
  }
  function M() {
    for (const { region: V } of b.values()) V.remove();
    b.clear();
  }
  function x() {
    M();
    const V = r.activeChannel.value?.activeTranslation.value.turns.value ?? [];
    for (const te of V) w(te);
  }
  function A({ turn: V }) {
    w(V);
  }
  function S({ turn: V }) {
    const te = b.get(V.id);
    if (te) {
      const Ve = te.region.start === V.startTime && te.region.end === V.endTime, qe = te.speakerId === V.speakerId;
      if (Ve && qe) return;
    }
    w(V);
  }
  function O({ turnId: V }) {
    C(V);
  }
  function D({ speaker: V }) {
    console.log("plop");
    const te = Tc(V.color, 0.25);
    for (const [, Ve] of b)
      Ve.speakerId === V.id && (Ve.region.setOptions({ color: te }), Ve.region.element?.style.setProperty("--region-color", V.color));
  }
  function I({
    speakerId: V
  }) {
    for (const [te, Ve] of [...b])
      Ve.speakerId === V && C(te);
  }
  function F() {
    x();
  }
  function L() {
    x();
  }
  function G() {
    M();
  }
  function ae() {
    v.push(r.onActiveTranslation("turn:add", A)), v.push(r.onActiveTranslation("turn:update", S)), v.push(r.onActiveTranslation("turn:remove", O)), v.push(r.on("speaker:update", D)), v.push(r.on("speaker:remove", I)), v.push(r.on("translation:sync", F)), v.push(r.on("translation:change", L)), v.push(r.on("channel:reset", G));
  }
  function re() {
    for (const V of v) V();
    v.length = 0;
  }
  function ue() {
    const V = s.value;
    V && (u.value = !0, d.value = !1, f.value = null, c.value = V.getDuration(), x(), ae());
  }
  function ve(V) {
    a.value = V;
  }
  function Dt() {
    l.value = !0;
  }
  function vo() {
    l.value = !1;
  }
  function Sr() {
    l.value = !1;
  }
  function Mi(V) {
    d.value = !1, u.value = !1, f.value = V?.message ?? "Failed to load audio";
  }
  function Ng(V, te) {
    bc(), d.value = !0, u.value = !1, f.value = null;
    const Ve = sc.create();
    o.value = Ve;
    const qe = ri.create({
      container: V,
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
      renderFunction: Sy,
      url: te,
      plugins: [Ve]
    });
    qe.setVolume(h.value), qe.setPlaybackRate(p.value), qe.setMuted(m.value), qe.on("ready", ue), qe.on("timeupdate", ve), qe.on("play", Dt), qe.on("pause", vo), qe.on("finish", Sr), qe.on("error", Mi), s.value = qe;
  }
  function bc() {
    re(), M(), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  function $g() {
    s.value?.play();
  }
  function Bg() {
    s.value?.pause();
  }
  function Lg() {
    s.value?.playPause();
  }
  function bo(V) {
    const te = s.value;
    !te || c.value === 0 || te.setTime(Math.max(0, Math.min(V, c.value)));
  }
  function zg(V) {
    bo(a.value + V);
  }
  function Fg(V) {
    const te = s.value;
    te && (h.value = V, te.setVolume(V), V > 0 && m.value && (m.value = !1, te.setMuted(!1)));
  }
  function Vg() {
    const V = s.value;
    V && (m.value = !m.value, V.setMuted(m.value));
  }
  function kc(V) {
    const te = s.value;
    te && (p.value = V, te.setPlaybackRate(V));
  }
  function qg() {
    const te = (Xo.indexOf(
      p.value
    ) + 1) % Xo.length;
    kc(Xo[te] ?? 1);
  }
  return Z(
    [e, t],
    ([V, te]) => {
      V && te && Ng(V, te);
    },
    { immediate: !0 }
  ), i.setSeekHandler(bo), Ut(() => {
    i.setSeekHandler(null), bc();
  }), {
    currentTime: a,
    duration: c,
    isPlaying: l,
    isReady: u,
    isLoading: d,
    loadError: f,
    volume: h,
    playbackRate: p,
    isMuted: m,
    formattedCurrentTime: g,
    formattedDuration: y,
    play: $g,
    pause: Bg,
    togglePlay: Lg,
    seekTo: bo,
    skip: zg,
    setVolume: Fg,
    setPlaybackRate: kc,
    cyclePlaybackRate: qg,
    toggleMute: Vg
  };
}
const TA = { class: "audio-player" }, EA = /* @__PURE__ */ $({
  __name: "AudioPlayer",
  props: {
    audioSrc: {}
  },
  setup(n, { expose: e }) {
    const t = n, r = _(null), {
      isPlaying: i,
      isReady: s,
      isLoading: o,
      volume: a,
      playbackRate: l,
      isMuted: c,
      formattedCurrentTime: u,
      formattedDuration: d,
      togglePlay: f,
      seekTo: h,
      pause: p,
      skip: m,
      setVolume: g,
      cyclePlaybackRate: y,
      toggleMute: b
    } = CA({
      containerRef: r,
      audioSrc: tf(() => t.audioSrc)
    });
    return e({ seekTo: h, pause: p }), (v, w) => (T(), B("footer", TA, [
      U("div", {
        ref_key: "waveformRef",
        ref: r,
        class: ht(["waveform-container", { "waveform-container--loading": k(o) }])
      }, null, 2),
      q(hA, {
        "is-playing": k(i),
        "current-time": k(u),
        duration: k(d),
        volume: k(a),
        "playback-rate": k(l),
        "is-muted": k(c),
        "is-ready": k(s),
        onTogglePlay: k(f),
        onSkipBack: w[0] || (w[0] = (C) => k(m)(-10)),
        onSkipForward: w[1] || (w[1] = (C) => k(m)(10)),
        "onUpdate:volume": k(g),
        onToggleMute: k(b),
        onCyclePlaybackRate: k(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), MA = /* @__PURE__ */ ne(EA, [["__scopeId", "data-v-810ae1d6"]]);
class AA {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), a = this.removeEmpty(this.tokenize(s, r)), l = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, l, r, i);
  }
  diffWithOptionsObj(e, t, r, i) {
    var s;
    const o = (b) => {
      if (b = this.postProcess(b, r), i) {
        setTimeout(function() {
          i(b);
        }, 0);
        return;
      } else
        return b;
    }, a = t.length, l = e.length;
    let c = 1, u = a + l;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(h[0], t, e, 0, r);
    if (h[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(h[0].lastComponent, t, e));
    let m = -1 / 0, g = 1 / 0;
    const y = () => {
      for (let b = Math.max(m, -c); b <= Math.min(g, c); b += 2) {
        let v;
        const w = h[b - 1], C = h[b + 1];
        w && (h[b - 1] = void 0);
        let M = !1;
        if (C) {
          const A = C.oldPos - b;
          M = C && 0 <= A && A < a;
        }
        const x = w && w.oldPos + 1 < l;
        if (!M && !x) {
          h[b] = void 0;
          continue;
        }
        if (!x || M && w.oldPos < C.oldPos ? v = this.addToPath(C, !0, !1, 0, r) : v = this.addToPath(w, !1, !0, 1, r), p = this.extractCommon(v, t, e, b, r), v.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(v.lastComponent, t, e)) || !0;
        h[b] = v, v.oldPos + 1 >= l && (g = Math.min(g, b - 1)), p + 1 >= a && (m = Math.max(m, b + 1));
      }
      c++;
    };
    if (i)
      (function b() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          y() || b();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const b = y();
        if (b)
          return b;
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
    const o = t.length, a = r.length;
    let l = e.oldPos, c = l - i, u = 0;
    for (; c + 1 < o && l + 1 < a && this.equals(r[l + 1], t[c + 1], s); )
      c++, l++, u++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return u && !s.oneChangePerToken && (e.lastComponent = { count: u, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = l, c;
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
    let a = 0, l = 0, c = 0;
    for (; a < o; a++) {
      const u = i[a];
      if (u.removed)
        u.value = this.join(r.slice(c, c + u.count)), c += u.count;
      else {
        if (!u.added && this.useLongestToken) {
          let d = t.slice(l, l + u.count);
          d = d.map(function(f, h) {
            const p = r[c + h];
            return p.length > f.length ? p : f;
          }), u.value = this.join(d);
        } else
          u.value = this.join(t.slice(l, l + u.count));
        l += u.count, u.added || (c += u.count);
      }
    }
    return i;
  }
}
class OA extends AA {
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
const DA = new OA();
function _A(n, e, t) {
  return DA.diff(n, e, t);
}
function Go({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = _A(i, s, {
    comparator: RA
  }), a = PA(o), l = [...e];
  let c = [...e], u = 0;
  for (const h of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in h && h.replaced)
      c = Yi(
        c,
        l[0],
        h.countAdded - h.countRemoved
      ), u += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const p = h;
      u += p.count, c = Yi(
        c,
        l[0],
        -p.count
      );
    } else if ("added" in h && h.added) {
      const p = h;
      c = Yi(
        c,
        l[0],
        p.count
      );
    } else
      u += h.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const p = Rm(
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
function PA(n) {
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
function Yi(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function Rm(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    Yi(
      Rm(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function RA(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class IA {
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
  setFontSize(e, t) {
    this.fontSize = e, this.lineHeight = t, this.resetDrawing(), this.onResize();
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
class NA extends IA {
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
    this.resetAll(), this.currentState = Go(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = Go(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = Go(
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
function Im(n) {
  const e = ze();
  let t = null;
  Re(() => {
    n.canvasRef.value && (t = new NA(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), Z([n.fontSize, n.lineHeight], ([l, c]) => {
    t && t.setFontSize(l, c);
  }), Z(
    () => e.live?.partial.value,
    (l) => {
      l && t && t.newPartial(l);
    }
  );
  const r = e.onActiveTranslation("turn:add", ({ turn: l }) => {
    if (!t) return;
    const c = l.words.length > 0 ? l.words.map((u) => u.text).join(" ") : l.text ?? "";
    c && t.newFinal(c);
  });
  function i() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const s = e.on("translation:change", i), o = e.on("translation:sync", i), a = e.on("channel:sync", i);
  gr(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
function Nm(n) {
  const e = _(!1);
  let t = null, r = null;
  function i() {
    t && (clearTimeout(t), t = null), r && (clearTimeout(r), r = null);
  }
  function s() {
    !n || !n.display.value || (e.value = !0, n.pinned.value || (r = setTimeout(o, n.duration.value * 1e3)));
  }
  function o() {
    e.value = !1, !(!n || !n.display.value || n.pinned.value) && (t = setTimeout(s, n.frequency.value * 1e3));
  }
  function a() {
    if (i(), !n || !n.display.value) {
      e.value = !1;
      return;
    }
    if (n.pinned.value) {
      e.value = !0;
      return;
    }
    e.value = !1, t = setTimeout(s, n.frequency.value * 1e3);
  }
  return n && Z(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), Re(a), Ut(i), { visible: e };
}
const wd = /\$(\w+)/g;
function $A(n, e) {
  const t = [];
  let r = 0, i;
  for (wd.lastIndex = 0; (i = wd.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const BA = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, LA = ["src", "alt"], zA = { key: 1 }, FA = /* @__PURE__ */ $({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = ze().subtitle?.watermark, r = E(() => t ? $A(t.content.value, t.tokens.value) : []);
    return (i, s) => (T(), R(rl, { name: "watermark" }, {
      default: N(() => [
        n.visible && k(t) ? (T(), B("div", BA, [
          (T(!0), B(Pe, null, yt(r.value, (o, a) => (T(), B(Pe, { key: a }, [
            o.type === "token" ? (T(), B("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, LA)) : (T(), B("span", zA, j(o.value), 1))
          ], 64))), 128))
        ])) : H("", !0)
      ]),
      _: 1
    }));
  }
}), $m = /* @__PURE__ */ ne(FA, [["__scopeId", "data-v-b8c2ff2b"]]), VA = ["height"], qA = /* @__PURE__ */ $({
  __name: "SubtitleBanner",
  setup(n) {
    const e = ze(), t = zt("canvas"), r = E(() => e.subtitle?.fontSize.value ?? 40), i = E(() => 1.2 * r.value), s = E(() => 2.4 * r.value);
    Im({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = Nm(
      e.subtitle?.watermark
    );
    return (a, l) => (T(), B("div", {
      class: "subtitle-banner",
      style: Nn({ height: s.value + "px" })
    }, [
      U("canvas", {
        ref: "canvas",
        class: ht(["subtitle-canvas", { "subtitle-canvas--shrunk": k(o) }]),
        height: s.value
      }, null, 10, VA),
      q($m, { visible: k(o) }, null, 8, ["visible"])
    ], 4));
  }
}), UA = /* @__PURE__ */ ne(qA, [["__scopeId", "data-v-f62eaf60"]]), WA = {
  ref: "container",
  class: "subtitle-fullscreen"
}, jA = ["aria-label"], HA = /* @__PURE__ */ $({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = ze(), { t } = ye(), r = zt("container"), i = zt("canvas"), s = E(() => e.subtitle?.fontSize.value ?? 48), o = E(() => 1.2 * s.value);
    Im({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = Nm(
      e.subtitle?.watermark
    );
    Re(async () => {
      const u = r.value;
      if (u) {
        try {
          await u.requestFullscreen();
        } catch (d) {
          console.warn("Fullscreen API not supported:", d);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function l() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    Re(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function c() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return gr(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, d) => (T(), B("div", WA, [
      U("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": k(t)("subtitle.exitFullscreen"),
        onClick: c
      }, [
        q(k(ol), { size: 24 })
      ], 8, jA),
      U("canvas", {
        ref: "canvas",
        class: ht(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": k(a) }])
      }, null, 2),
      q($m, { visible: k(a) }, null, 8, ["visible"])
    ], 512));
  }
}), KA = /* @__PURE__ */ ne(HA, [["__scopeId", "data-v-e3ae14e0"]]), JA = /* @__PURE__ */ $({
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
    const t = n, r = _(!1);
    let i;
    async function s() {
      if (!r.value)
        try {
          await t.copyFn(), r.value = !0, i = setTimeout(() => {
            r.value = !1;
          }, 2e3);
        } catch (l) {
          console.error(l);
        }
    }
    e({
      reset: () => {
        r.value = !1, clearTimeout(i);
      }
    });
    const o = E(() => r.value ? "check" : t.icon), a = E(() => Sf[t.size ?? "sm"]);
    return (l, c) => (T(), R(me, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: ht({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: N(() => [
        q(rl, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: N(() => [
            (T(), R(Qn, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: N(() => [
        J(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), xd = /* @__PURE__ */ ne(JA, [["__scopeId", "data-v-0077b14e"]]), XA = ["aria-label"], GA = { class: "selection-count" }, YA = { class: "selection-actions" }, ZA = /* @__PURE__ */ $({
  __name: "SelectionActionBar",
  setup(n) {
    const e = oh(), { t } = ye();
    return (r, i) => k(e).hasSelection.value ? (T(), B("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": k(t)("selection.count")
    }, [
      U("span", GA, j(k(e).count.value) + " " + j(k(t)("selection.count")), 1),
      U("div", YA, [
        q(xd, {
          icon: "clipboard-type",
          "copy-fn": k(e).copyText,
          variant: "secondary"
        }, {
          default: N(() => [
            ge(j(k(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(xd, {
          icon: "clipboard-list",
          "copy-fn": k(e).copyWithMetadata
        }, {
          default: N(() => [
            ge(j(k(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(me, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => k(e).clear())
        }, {
          default: N(() => [
            ge(j(k(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, XA)) : H("", !0);
  }
}), QA = /* @__PURE__ */ ne(ZA, [["__scopeId", "data-v-1c5a7d10"]]), eO = "(max-width: 767px)";
function tO() {
  const n = _(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return Re(() => {
    e = window.matchMedia(eO), n.value = e.matches, e.addEventListener("change", t);
  }), Ut(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const nO = { class: "editor-layout" }, rO = { class: "editor-body" }, iO = {
  key: 5,
  class: "mobile-selectors"
}, sO = /* @__PURE__ */ $({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = ze(), { isMobile: r } = tO(), i = _(!1), s = _(Jn), o = E(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), a = t.speakers.all;
    cw(o, a, t);
    const l = E(() => [...t.channels.values()]), c = E(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), u = E(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), d = E(() => Array.from(a.values())), f = E(() => s.value === Jn), h = E(() => s.value === Wi), p = E(() => f.value || h.value ? null : t.llmServices?.get(s.value) ?? null);
    Z(s, (b) => {
      t.llmServices && (b === Jn || b === Wi ? t.llmServices.setActive(null) : t.llmServices.setActive(b));
    }), Z(
      () => t.llmServices?.list.value.map((b) => b.id).join("|"),
      () => {
        s.value !== Jn && s.value !== Wi && !t.llmServices?.get(s.value) && (s.value = Jn);
      }
    );
    const m = zt("audioPlayer");
    Z(
      () => t.activeChannelId.value,
      () => {
        m.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), Z(f, (b) => {
      b || m.value?.pause();
    });
    function g(b) {
      t.setActiveChannel(b);
    }
    function y(b) {
      t.activeChannel.value?.setActiveTranslation(b);
    }
    return (b, v) => (T(), B("div", nO, [
      e.showHeader ? (T(), R(tv, {
        key: 0,
        title: k(t).title.value,
        date: k(t).date.value,
        duration: k(t).activeChannel.value?.duration ?? 0,
        "speaker-count": k(a).size,
        "is-mobile": k(r),
        onToggleSidebar: v[0] || (v[0] = (w) => i.value = !i.value)
      }, null, 8, ["title", "date", "duration", "speaker-count", "is-mobile"])) : H("", !0),
      q(uv, {
        modelValue: s.value,
        "onUpdate:modelValue": v[1] || (v[1] = (w) => s.value = w)
      }, null, 8, ["modelValue"]),
      f.value ? (T(), R(QA, { key: 1 })) : H("", !0),
      U("main", rO, [
        f.value ? (T(), R(ad, {
          key: 0,
          turns: o.value,
          speakers: k(a)
        }, null, 8, ["turns", "speakers"])) : h.value ? (T(), R(dE, { key: 1 })) : p.value ? (T(), R(sM, {
          key: p.value.id,
          service: p.value
        }, null, 8, ["service"])) : (T(), R(ad, {
          key: 3,
          turns: o.value,
          speakers: k(a)
        }, null, 8, ["turns", "speakers"])),
        k(r) ? H("", !0) : (T(), R(md, {
          key: 4,
          speakers: d.value,
          channels: l.value,
          "selected-channel-id": k(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        k(r) ? (T(), R(iA, {
          key: 5,
          open: i.value,
          "onUpdate:open": v[2] || (v[2] = (w) => i.value = w)
        }, {
          default: N(() => [
            q(md, {
              speakers: d.value,
              channels: l.value,
              "selected-channel-id": k(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": u.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": y
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : H("", !0)
      ]),
      k(t).audio?.src.value ? is((T(), R(MA, {
        key: 2,
        ref: "audioPlayer",
        "audio-src": k(t).audio.src.value
      }, null, 8, ["audio-src"])), [
        [af, f.value]
      ]) : H("", !0),
      k(t).subtitle?.isVisible.value && !k(r) && !k(t).subtitle.isFullscreen.value ? (T(), R(UA, { key: 3 })) : H("", !0),
      k(t).subtitle?.isFullscreen.value ? (T(), R(KA, { key: 4 })) : H("", !0),
      k(r) && (l.value.length > 1 || c.value.length > 1) ? (T(), B("div", iO, [
        l.value.length > 1 ? (T(), R(Tm, {
          key: 0,
          channels: l.value,
          "selected-channel-id": k(t).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : H("", !0),
        c.value.length > 1 ? (T(), R(Em, {
          key: 1,
          translations: c.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["translations", "selected-translation-id"])) : H("", !0)
      ])) : H("", !0)
    ]));
  }
}), vR = /* @__PURE__ */ ne(sO, [["__scopeId", "data-v-51c8d17a"]]);
function bR(n = {}) {
  return {
    name: "audio",
    install(e) {
      const t = _(0), r = _(!1), i = _(null), s = _(null);
      let o = null;
      const a = E(
        () => e.activeChannel.value?.activeTranslation.value.audio ?? null
      ), l = _(null);
      let c = null;
      function u() {
        c && (URL.revokeObjectURL(c), c = null);
      }
      const d = Z(
        a,
        async (y) => {
          if (u(), l.value = null, !!y)
            try {
              const b = n.resolveSrc ? await n.resolveSrc(y) : y.src;
              l.value = b, b.startsWith("blob:") && (c = b);
            } catch (b) {
              console.error("[audio] resolveSrc failed", b);
            }
        },
        { immediate: !0 }
      ), f = E(() => l.value), h = at(() => {
        if (!r.value) return;
        const y = t.value, b = e.activeChannel.value?.activeTranslation.value;
        if (b) {
          for (const v of b.turns.value)
            if (v.startTime != null && v.endTime != null && y >= v.startTime && y <= v.endTime) {
              s.value = v.id, i.value = sl(v.words) ? df(v.words, y) : null;
              return;
            }
        }
      });
      function p(y) {
        o?.(y);
      }
      function m(y) {
        o = y;
      }
      const g = {
        currentTime: t,
        isPlaying: r,
        src: f,
        activeWordId: i,
        activeTurnId: s,
        seekTo: p,
        setSeekHandler: m
      };
      return e.audio = g, () => {
        d(), h(), u(), e.audio = void 0;
      };
    }
  };
}
var Bm = Jl.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const In = Math.floor, oO = Math.abs, rn = (n, e) => n < e ? n : e, fr = (n, e) => n > e ? n : e, aO = (n) => n !== 0 ? n < 0 : 1 / n < 0, lO = 64, ii = 128, cO = 1 << 29, Sd = 63, Fr = 127, uO = 2147483647, Cd = Number.MAX_SAFE_INTEGER, Td = Number.MIN_SAFE_INTEGER, dO = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && In(n) === n), fO = () => /* @__PURE__ */ new Set(), oc = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, Lm = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, hO = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, oo = Array.isArray, zm = String.fromCharCode, pO = (n) => n.toLowerCase(), mO = /^\s*/g, gO = (n) => n.replace(mO, ""), yO = /([A-Z])/g, Ed = (n, e) => gO(n.replace(yO, (t) => `${e}${pO(t)}`)), vO = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, si = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), bO = (n) => si.encode(n), kO = si ? bO : vO;
let Yo = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Yo && Yo.decode(new Uint8Array()).length === 1 && (Yo = null);
const wO = (n, e) => hO(e, () => n).join("");
let xO = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const SO = () => new xO(), CO = (n) => {
  const e = SO();
  return n(e), EO(e);
}, TO = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, EO = (n) => {
  const e = new Uint8Array(TO(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, MO = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(fr(t, e) * 2), n.cpos = 0);
}, Me = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, oi = (n, e) => {
  for (; e > Fr; )
    Me(n, ii | Fr & e), e = In(e / 128);
  Me(n, Fr & e);
}, AO = (n, e) => {
  const t = aO(e);
  for (t && (e = -e), Me(n, (e > Sd ? ii : 0) | (t ? lO : 0) | Sd & e), e = In(e / 64); e > 0; )
    Me(n, (e > Fr ? ii : 0) | Fr & e), e = In(e / 128);
}, qa = new Uint8Array(3e4), OO = qa.length / 3, DO = (n, e) => {
  if (e.length < OO) {
    const t = si.encodeInto(e, qa).written || 0;
    oi(n, t);
    for (let r = 0; r < t; r++)
      Me(n, qa[r]);
  } else
    Fm(n, kO(e));
}, _O = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  oi(n, r);
  for (let i = 0; i < r; i++)
    Me(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Md = si && /** @type {any} */
si.encodeInto ? DO : _O, PO = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = rn(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(fr(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, Fm = (n, e) => {
  oi(n, e.byteLength), PO(n, e);
}, ac = (n, e) => {
  MO(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, RO = (n, e) => ac(n, 4).setFloat32(0, e, !1), IO = (n, e) => ac(n, 8).setFloat64(0, e, !1), NO = (n, e) => (
  /** @type {any} */
  ac(n, 8).setBigInt64(0, e, !1)
), Ad = new DataView(new ArrayBuffer(4)), $O = (n) => (Ad.setFloat32(0, n), Ad.getFloat32(0) === n), Ua = (n, e) => {
  switch (typeof e) {
    case "string":
      Me(n, 119), Md(n, e);
      break;
    case "number":
      dO(e) && oO(e) <= uO ? (Me(n, 125), AO(n, e)) : $O(e) ? (Me(n, 124), RO(n, e)) : (Me(n, 123), IO(n, e));
      break;
    case "bigint":
      Me(n, 122), NO(n, e);
      break;
    case "object":
      if (e === null)
        Me(n, 126);
      else if (oo(e)) {
        Me(n, 117), oi(n, e.length);
        for (let t = 0; t < e.length; t++)
          Ua(n, e[t]);
      } else if (e instanceof Uint8Array)
        Me(n, 116), Fm(n, e);
      else {
        Me(n, 118);
        const t = Object.keys(e);
        oi(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          Md(n, i), Ua(n, e[i]);
        }
      }
      break;
    case "boolean":
      Me(n, e ? 120 : 121);
      break;
    default:
      Me(n, 127);
  }
}, ao = (n) => new Error(n), Vm = () => {
  throw ao("Method unimplemented");
}, lo = () => {
  throw ao("Unexpected case");
}, Zi = () => /* @__PURE__ */ new Map(), qm = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, ai = /* @__PURE__ */ Symbol("Equality"), BO = (n, e) => n === e || !!n?.[ai]?.(e) || !1, LO = (n) => typeof n == "object", Um = Object.keys, Od = (n) => Um(n).length, Ti = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, Wm = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Qi = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[ai] != null)
    return n[ai](e);
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
        if (!e.has(t) || !Qi(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (Od(n) !== Od(e))
        return !1;
      for (const t in n)
        if (!Wm(n, t) || !Qi(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Qi(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, zO = (n, e) => e.includes(n), FO = () => {
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
}, VO = /[\uD800-\uDBFF]/, qO = /[\uDC00-\uDFFF]/, UO = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && VO.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && qO.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, WO = UO, jO = Math.random, HO = (n) => n[In(jO() * n.length)], Dd = (n) => n === void 0 ? null : n;
class KO {
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
let jm = new KO(), JO = !0;
try {
  typeof localStorage < "u" && localStorage && (jm = localStorage, JO = !1);
} catch {
}
const XO = jm, hr = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Hm = typeof window < "u" && typeof document < "u" && !hr;
let wt;
const GO = () => {
  if (wt === void 0)
    if (hr) {
      wt = Zi();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && wt.set(e, ""), e = r) : e !== null && (wt.set(e, r), e = null);
      }
      e !== null && wt.set(e, "");
    } else typeof location == "object" ? (wt = Zi(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        wt.set(`--${Ed(e, "-")}`, t), wt.set(`-${Ed(e, "-")}`, t);
      }
    })) : wt = Zi();
  return wt;
}, Wa = (n) => GO().has(n), ja = (n) => Dd(hr ? process.env[n.toUpperCase().replaceAll("-", "_")] : XO.getItem(n)), Km = (n) => Wa("--" + n) || ja(n) !== null, YO = Km("production"), ZO = hr && zO(process.env.FORCE_COLOR, ["true", "1", "2"]);
ZO || !Wa("--no-colors") && // @todo deprecate --no-colors
!Km("no-color") && (!hr || process.stdout.isTTY) && (!hr || Wa("--color") || ja("COLORTERM") !== null || (ja("TERM") || "").includes("color"));
const QO = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += zm(n[t]);
  return btoa(e);
}, eD = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), tD = Hm ? QO : eD, nD = (n) => CO((e) => Ua(e, n)), _d = (n) => n.next() >= 0.5, Zo = (n, e, t) => In(n.next() * (t + 1 - e) + e), Jm = (n, e, t) => In(n.next() * (t + 1 - e) + e), lc = (n, e, t) => Jm(n, e, t), rD = (n) => zm(lc(n, 97, 122)), iD = (n, e = 0, t = 20) => {
  const r = lc(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += rD(n);
  return i;
}, Qo = (n, e) => e[lc(n, 0, e.length - 1)], sD = /* @__PURE__ */ Symbol("0schema");
class oD {
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
      e.push(wO(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Ha = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[ai] ? BO(n, e) : oo(n) ? oc(
  n,
  (t) => Lm(e, (r) => Ha(t, r))
) : LO(n) ? Ti(
  n,
  (t, r) => Ha(t, e[r])
) : !1;
class Ke {
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
      this.constructor._dilutes && ([r, t] = [t, r]), Ha(t, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Qi(this.shape, e.shape);
  }
  [sD]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [ai](e) {
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
    Vm();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return wr(this, po);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Ym(
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
    return Pd(e, this), /** @type {any} */
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
    return Pd(e, this), e;
  }
}
class cc extends Ke {
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
const ke = (n, e = null) => new cc(n, e);
ke(cc);
class uc extends Ke {
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
const Te = (n) => new uc(n);
ke(uc);
class co extends Ke {
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
const uo = (...n) => new co(n), Xm = ke(co), aD = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Gm = (n) => {
  if (pr.check(n))
    return [aD(n)];
  if (Xm.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if (og.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (ag.check(n))
    return [".*"];
  if (Ds.check(n))
    return n.shape.map(Gm).flat(1);
  lo();
};
class lD extends Ke {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Gm).map((t) => `(${t.join("|")})`).join("") + "$");
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
ke(lD);
const cD = /* @__PURE__ */ Symbol("optional");
class Ym extends Ke {
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
  get [cD]() {
    return !0;
  }
}
const uD = ke(Ym);
class dD extends Ke {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
ke(dD);
class fo extends Ke {
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
    return new fo(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : Ti(this.shape, (r, i) => {
      const s = this._isPartial && !Wm(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const fD = (n) => (
  /** @type {any} */
  new fo(n)
), hD = ke(fo), pD = Te((n) => n != null && (n.constructor === Object || n.constructor == null));
class Zm extends Ke {
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
    return e != null && Ti(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const Qm = (n, e) => new Zm(n, e), mD = ke(Zm);
class eg extends Ke {
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
    return e != null && Ti(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const gD = (...n) => new eg(n);
ke(eg);
class tg extends Ke {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new dc(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = oo(e) && oc(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const ng = (...n) => new tg(n), yD = ke(tg), vD = Te((n) => oo(n));
class rg extends Ke {
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
const bD = (n, e = null) => new rg(n, e);
ke(rg);
const kD = bD(Ke);
class wD extends Ke {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = gD(...e.slice(-1)), this.res = e[this.len];
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
const xD = ke(wD), SD = Te((n) => typeof n == "function");
class CD extends Ke {
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
    const r = oc(this.shape, (i) => i.check(e, t));
    return !r && t?.extend(null, "Intersectinon", typeof e), r;
  }
}
ke(CD, (n) => n.shape.length > 0);
class dc extends Ke {
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
    const r = Lm(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const wr = (...n) => n.findIndex((e) => Ds.check(e)) >= 0 ? wr(...n.map((e) => li(e)).map((e) => Ds.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new dc(n), Ds = (
  /** @type {Schema<$Union<any>>} */
  ke(dc)
), ig = () => !0, _s = Te(ig), TD = (
  /** @type {Schema<Schema<any>>} */
  ke(uc, (n) => n.shape === ig)
), fc = Te((n) => typeof n == "bigint"), ED = (
  /** @type {Schema<Schema<BigInt>>} */
  Te((n) => n === fc)
), sg = Te((n) => typeof n == "symbol");
Te((n) => n === sg);
const rr = Te((n) => typeof n == "number"), og = (
  /** @type {Schema<Schema<number>>} */
  Te((n) => n === rr)
), pr = Te((n) => typeof n == "string"), ag = (
  /** @type {Schema<Schema<string>>} */
  Te((n) => n === pr)
), ho = Te((n) => typeof n == "boolean"), MD = (
  /** @type {Schema<Schema<Boolean>>} */
  Te((n) => n === ho)
), lg = uo(void 0);
ke(co, (n) => n.shape.length === 1 && n.shape[0] === void 0);
uo(void 0);
const po = uo(null), AD = (
  /** @type {Schema<Schema<null>>} */
  ke(co, (n) => n.shape.length === 1 && n.shape[0] === null)
);
ke(Uint8Array);
ke(cc, (n) => n.shape === Uint8Array);
const OD = wr(rr, pr, po, lg, fc, ho, sg);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    ng(_s)
  ), e = (
    /** @type {$Record<$string,$any>} */
    Qm(pr, _s)
  ), t = wr(rr, pr, po, ho, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const li = (n) => {
  if (kD.check(n))
    return (
      /** @type {any} */
      n
    );
  if (pD.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = li(n[t]);
    return (
      /** @type {any} */
      fD(e)
    );
  } else {
    if (vD.check(n))
      return (
        /** @type {any} */
        wr(...n.map(li))
      );
    if (OD.check(n))
      return (
        /** @type {any} */
        uo(n)
      );
    if (SD.check(n))
      return (
        /** @type {any} */
        ke(
          /** @type {any} */
          n
        )
      );
  }
  lo();
}, Pd = YO ? () => {
} : (n, e) => {
  const t = new oD();
  if (!e.check(n, t))
    throw ao(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class DD {
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
    return this.patterns.push({ if: li(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(_s, e);
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
        throw ao("Unhandled pattern");
      }
    );
  }
}
const _D = (n) => new DD(
  /** @type {any} */
  n
), cg = (
  /** @type {any} */
  _D(
    /** @type {Schema<prng.PRNG>} */
    _s
  ).if(og, (n, e) => Zo(e, Td, Cd)).if(ag, (n, e) => iD(e)).if(MD, (n, e) => _d(e)).if(ED, (n, e) => BigInt(Zo(e, Td, Cd))).if(Ds, (n, e) => Kn(e, Qo(e, n.shape))).if(hD, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (uD.check(i)) {
        if (_d(e))
          continue;
        i = i.shape;
      }
      t[r] = cg(i, e);
    }
    return t;
  }).if(yD, (n, e) => {
    const t = [], r = Jm(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push(Kn(e, n.shape));
    return t;
  }).if(Xm, (n, e) => Qo(e, n.shape)).if(AD, (n, e) => null).if(xD, (n, e) => {
    const t = Kn(e, n.res);
    return () => t;
  }).if(TD, (n, e) => Kn(e, Qo(e, [
    rr,
    pr,
    po,
    lg,
    fc,
    ho,
    ng(rr),
    Qm(wr("a", "b", "c"), rr)
  ]))).if(mD, (n, e) => {
    const t = {}, r = Zo(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = Kn(e, n.shape.keys), o = Kn(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), Kn = (n, e) => (
  /** @type {any} */
  cg(li(e), n)
), Ei = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Te((n) => n.nodeType === ND);
typeof DOMParser < "u" && new DOMParser();
Te((n) => n.nodeType === PD);
Te((n) => n.nodeType === RD);
const PD = Ei.ELEMENT_NODE, RD = Ei.TEXT_NODE, ID = Ei.DOCUMENT_NODE, ND = Ei.DOCUMENT_FRAGMENT_NODE;
Te((n) => n.nodeType === ID);
const $D = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, BD = $D(clearTimeout), hc = (n, e) => new BD(setTimeout(e, n)), Tt = (n, e) => n >>> e | n << 32 - e, LD = (n) => Tt(n, 2) ^ Tt(n, 13) ^ Tt(n, 22), zD = (n) => Tt(n, 6) ^ Tt(n, 11) ^ Tt(n, 25), FD = (n) => Tt(n, 7) ^ Tt(n, 18) ^ n >>> 3, VD = (n) => Tt(n, 17) ^ Tt(n, 19) ^ n >>> 10, qD = new Uint32Array([
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
]), UD = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class WD {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set(UD), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = VD(t[d - 2]) + t[d - 7] + FD(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], l = e[5], c = e[6], u = e[7];
    for (let d = 0, f, h; d < 64; d++)
      f = u + zD(a) + (a & l ^ ~a & c) + qD[d] + t[d] >>> 0, h = LD(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = l, l = a, a = o + f >>> 0, o = s, s = i, i = r, r = f + h >>> 0;
    e[0] += r, e[1] += i, e[2] += s, e[3] += o, e[4] += a, e[5] += l, e[6] += c, e[7] += u;
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
        this._W[o] |= ii << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= ii << (3 - t % 4) * 8), this._W[14] = e.byteLength / cO, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let a = 0; a < 4; a++)
        s[o * 4 + a] = this._H[o] >>> (3 - a) * 8;
    return s;
  }
}
const jD = (n) => new WD().digest(n), se = new nt("y-sync"), Bt = new nt("y-undo"), qi = new nt("yjs-cursor"), HD = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, KD = (n) => tD(HD(jD(nD(n)))), Ps = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !W.isDeleted(e.ds, n.id), JD = [{ light: "#ecd44433", dark: "#ecd444" }], XD = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = fO();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, HO(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, GD = (n, {
  colors: e = JD,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const a = new QD(n, s), l = new Ie({
    props: {
      editable: (c) => {
        const u = se.getState(c);
        return u.snapshot == null && u.prevSnapshot == null;
      }
    },
    key: se,
    state: {
      /**
       * @returns {any}
       */
      init: (c, u) => ({
        type: n,
        doc: n.doc,
        binding: a,
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
        const d = c.getMeta(se);
        if (d !== void 0) {
          u = Object.assign({}, u);
          for (const f in d)
            u[f] = d[f];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, a.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && hc(0, () => {
          a.prosemirrorView != null && (d.restore == null ? a._renderSnapshot(
            d.snapshot,
            d.prevSnapshot,
            u
          ) : (a._renderSnapshot(
            d.snapshot,
            d.snapshot,
            u
          ), delete u.restore, delete u.snapshot, delete u.prevSnapshot, a.mux(() => {
            a._prosemirrorChanged(
              a.prosemirrorView.state.doc
            );
          })));
        }), u;
      }
    },
    view: (c) => (a.initView(c), s == null && a._forceRerender(), i(), {
      update: () => {
        const u = l.getState(c.state);
        if (u.snapshot == null && u.prevSnapshot == null && // If the content doesn't change initially, we don't render anything to Yjs
        // If the content was cleared by a user action, we want to catch the change and
        // represent it in Yjs
        (o || c.state.doc.content.findDiffStart(
          c.state.doc.type.createAndFill().content
        ) !== null)) {
          if (o = !0, u.addToHistory === !1 && !u.isChangeOrigin) {
            const d = Bt.getState(c.state), f = d && d.undoManager;
            f && f.stopCapturing();
          }
          a.mux(() => {
            u.doc.transact((d) => {
              d.meta.set("addToHistory", u.addToHistory), a._prosemirrorChanged(c.state.doc);
            }, se);
          });
        }
      },
      destroy: () => {
        a.destroy();
      }
    })
  });
  return l;
}, YD = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new Qe(n.doc));
    else if (e.type === "node") {
      const r = Cn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection(ZD(n, r));
    } else {
      const r = Cn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = Cn(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(Y.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, ZD = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? X.create(n.doc, e) : Y.near(t);
}, Ka = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: ui(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: ui(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class QD {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = FO(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Ka(
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
    return this.prosemirrorView.hasFocus() ? (Hm && this._domSelectionInView === null && (hc(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = Ei.documentElement;
    return i.bottom >= 0 && i.right >= 0 && i.left <= (window.innerWidth || s.clientWidth || 0) && i.top <= (window.innerHeight || s.clientHeight || 0);
  }
  /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */
  renderSnapshot(e, t) {
    t || (t = W.createSnapshot(W.createDeleteSet(), /* @__PURE__ */ new Map())), this.prosemirrorView.dispatch(
      this._tr.setMeta(se, { snapshot: e, prevSnapshot: t })
    );
  }
  unrenderSnapshot() {
    this.mapping.clear(), this.mux(() => {
      const e = this.type.toArray().map(
        (r) => es(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(P.from(e), 0, 0)
      );
      t.setMeta(se, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => es(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(P.from(t), 0, 0)
      );
      if (e) {
        const i = rn(fr(e.anchor, 0), r.doc.content.size), s = rn(fr(e.head, 0), r.doc.content.size);
        r.setSelection(Y.create(r.doc, i, s));
      }
      this.prosemirrorView.dispatch(
        r.setMeta(se, { isChangeOrigin: !0, binding: this })
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
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && lo(), i = new W.Doc({ gc: !1 }), W.applyUpdateV2(i, t), t = W.snapshot(i), W.applyUpdateV2(i, e), e = W.snapshot(i), s._item === null) {
        const o = Array.from(this.doc.share.keys()).find(
          (a) => this.doc.share.get(a) === this.type
        );
        s = i.getXmlFragment(o);
      } else {
        const o = i.store.clients.get(s._item.id.client) ?? [], a = W.findIndexSS(
          o,
          s._item.id.clock
        );
        s = /** @type {Y.XmlFragment} */
        /** @type {Y.ContentType} */
        /** @type {Y.Item} */
        o[a].content.type;
      }
    this.mapping.clear(), this.mux(() => {
      i.transact((o) => {
        const a = r.permanentUserData;
        a && a.dss.forEach((d) => {
          W.iterateDeletedStructs(o, d, (f) => {
          });
        });
        const l = (d, f) => {
          const h = d === "added" ? a.getUserByClientId(f.client) : a.getUserByDeletedId(f);
          return {
            user: h,
            type: d,
            color: XD(
              r.colorMapping,
              r.colors,
              h
            )
          };
        }, c = W.typeListToArraySnapshot(
          s,
          new W.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || Ps(d._item, e) || Ps(d._item, t) ? es(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          l
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new z(P.from(c), 0, 0)
        );
        this.prosemirrorView.dispatch(
          u.setMeta(se, { isChangeOrigin: !0 })
        );
      }, se);
    });
  }
  /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */
  _typeChanged(e, t) {
    if (this.prosemirrorView == null) return;
    const r = se.getState(this.prosemirrorView.state);
    if (e.length === 0 || r.snapshot != null || r.prevSnapshot != null) {
      this.renderSnapshot(r.snapshot, r.prevSnapshot);
      return;
    }
    this.mux(() => {
      const i = (a, l) => this.mapping.delete(l);
      W.iterateDeletedStructs(
        t,
        t.deleteSet,
        (a) => {
          if (a.constructor === W.Item) {
            const l = (
              /** @type {Y.ContentType} */
              /** @type {Y.Item} */
              a.content.type
            );
            l && this.mapping.delete(l);
          }
        }
      ), t.changed.forEach(i), t.changedParentTypes.forEach(i);
      const s = this.type.toArray().map(
        (a) => ug(
          /** @type {Y.XmlElement | Y.XmlHook} */
          a,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((a) => a !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(P.from(s), 0, 0)
      );
      YD(o, this.beforeTransactionSelection, this), o = o.setMeta(se, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof W.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      Is(this.doc, this.type, e, this), this.beforeTransactionSelection = Ka(
        this,
        this.prosemirrorView.state
      );
    }, se);
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
const ug = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof W.XmlElement)
      return es(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw Vm();
  }
  return o;
}, es = (n, e, t, r, i, s) => {
  const o = [], a = (l) => {
    if (l instanceof W.XmlElement) {
      const c = ug(
        l,
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
        l._item.right?.content?.type
      );
      c instanceof W.Text && !c._item.deleted && c._item.id.client === c.doc.clientID && (l.applyDelta([
        { retain: l.length },
        ...c.toDelta()
      ]), c.doc.transact((d) => {
        c._item.delete(d);
      }));
      const u = e_(
        l,
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
  r === void 0 || i === void 0 ? n.toArray().forEach(a) : W.typeListToArraySnapshot(n, new W.Snapshot(i.ds, r.sv)).forEach(a);
  try {
    const l = n.getAttributes(r);
    r !== void 0 && (Ps(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? Ps(
      /** @type {Y.Item} */
      n._item,
      i
    ) || (l.ychange = s ? s(
      "added",
      /** @type {Y.Item} */
      n._item.id
    ) : { type: "added" }) : l.ychange = s ? s(
      "removed",
      /** @type {Y.Item} */
      n._item.id
    ) : { type: "removed" });
    const c = e.node(n.nodeName, l, o);
    return t.mapping.set(n, c), c;
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, se), t.mapping.delete(n), null;
  }
}, e_ = (n, e, t, r, i, s) => {
  const o = [], a = n.toDelta(r, i, s);
  try {
    for (let l = 0; l < a.length; l++) {
      const c = a[l];
      o.push(e.text(c.insert, o_(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, se), null;
  }
  return o;
}, t_ = (n, e) => {
  const t = new W.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: hg(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, n_ = (n, e) => {
  const t = new W.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    mo(n).map(
      (r) => Ja(r, e)
    )
  ), e.mapping.set(t, n), t;
}, Ja = (n, e) => n instanceof Array ? t_(n, e) : n_(n, e), Rd = (n) => typeof n == "object" && n !== null, pc = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], a = e[s];
    r = s === "ychange" || o === a || Rd(o) && Rd(a) && pc(o, a);
  }
  return r;
}, mo = (n) => {
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
}, dg = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && Um(r.attributes || {}).length === e[i].marks.length && Ti(r.attributes, (s, o) => {
      const a = fg(o), l = e[i].marks;
      return l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      ) ? pc(s, l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      )?.attrs) : !1;
    })
  );
}, ci = (n, e) => {
  if (n instanceof W.XmlElement && !(e instanceof Array) && Xa(n, e)) {
    const t = mo(e);
    return n._length === t.length && pc(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => ci(r, t[i])
    );
  }
  return n instanceof W.XmlText && e instanceof Array && dg(n, e);
}, Rs = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), Id = (n, e, t) => {
  const r = n.toArray(), i = mo(e), s = i.length, o = r.length, a = rn(o, s);
  let l = 0, c = 0, u = !1;
  for (; l < a; l++) {
    const d = r[l], f = i[l];
    if (Rs(t.mapping.get(d), f))
      u = !0;
    else if (!ci(d, f))
      break;
  }
  for (; l + c < a; c++) {
    const d = r[o - c - 1], f = i[s - c - 1];
    if (Rs(t.mapping.get(d), f))
      u = !0;
    else if (!ci(d, f))
      break;
  }
  return {
    equalityFactor: l + c,
    foundMappedChild: u
  };
}, r_ = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof W.ContentString ? e += t.content.str : t.content instanceof W.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, i_ = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = r_(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, hg(c.marks, t))
  })), { insert: o, remove: a, index: l } = WO(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(l, a), n.insert(l, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, s_ = /(.*)(--[a-zA-Z0-9+/=]{8})$/, fg = (n) => s_.exec(n)?.[1] ?? n, o_ = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(fg(r), n[r]));
  return t;
}, hg = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = qm(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${KD(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, Is = (n, e, t, r) => {
  if (e instanceof W.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof W.XmlElement) {
    const d = e.getAttributes(), f = t.attrs;
    for (const h in f)
      f[h] !== null ? d[h] !== f[h] && h !== "ychange" && e.setAttribute(h, f[h]) : e.removeAttribute(h);
    for (const h in d)
      f[h] === void 0 && e.removeAttribute(h);
  }
  const i = mo(t), s = i.length, o = e.toArray(), a = o.length, l = rn(s, a);
  let c = 0, u = 0;
  for (; c < l; c++) {
    const d = o[c], f = i[c];
    if (!Rs(r.mapping.get(d), f))
      if (ci(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  for (; u + c + 1 < l; u++) {
    const d = o[a - u - 1], f = i[s - u - 1];
    if (!Rs(r.mapping.get(d), f))
      if (ci(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  n.transact(() => {
    for (; a - c - u > 0 && s - c - u > 0; ) {
      const f = o[c], h = i[c], p = o[a - u - 1], m = i[s - u - 1];
      if (f instanceof W.XmlText && h instanceof Array)
        dg(f, h) || i_(f, h, r), c += 1;
      else {
        let g = f instanceof W.XmlElement && Xa(f, h), y = p instanceof W.XmlElement && Xa(p, m);
        if (g && y) {
          const b = Id(
            /** @type {Y.XmlElement} */
            f,
            /** @type {PModel.Node} */
            h,
            r
          ), v = Id(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          b.foundMappedChild && !v.foundMappedChild ? y = !1 : !b.foundMappedChild && v.foundMappedChild || b.equalityFactor < v.equalityFactor ? g = !1 : y = !1;
        }
        g ? (Is(
          n,
          /** @type {Y.XmlFragment} */
          f,
          /** @type {PModel.Node} */
          h,
          r
        ), c += 1) : y ? (Is(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          Ja(h, r)
        ]), c += 1);
      }
    }
    const d = a - c - u;
    if (a === 1 && s === 0 && o[0] instanceof W.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((f) => r.mapping.delete(f)), e.delete(c, d)), c + u < s) {
      const f = [];
      for (let h = c; h < s - u; h++)
        f.push(Ja(i[h], r));
      e.insert(c, f);
    }
  }, se);
}, Xa = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let Vr = null;
const a_ = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    Vr
  );
  Vr = null, n.forEach((e, t) => {
    const r = t.state.tr, i = se.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, l_ = (n, e, t) => {
  Vr || (Vr = /* @__PURE__ */ new Map(), hc(0, a_)), qm(Vr, n, Zi).set(e, t);
}, ui = (n, e, t) => {
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
      throw lo();
    if (n === 0 && r.constructor !== W.XmlText && r !== e)
      return c_(r._item.parent, r._item);
  }
  return W.createRelativePositionFromTypeIndex(e, e._length, -1);
}, c_ = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = W.findRootTypeKey(n) : t = W.createID(n._item.id.client, n._item.id.clock), new W.RelativePosition(t, r, e.id);
}, Cn = (n, e, t, r) => {
  const i = W.createAbsolutePositionFromRelativePosition(t, n);
  if (i === null || i.type !== e && !W.isParentOf(e, i.type._item))
    return null;
  let s = i.type, o = 0;
  if (s.constructor === W.XmlText)
    o = i.index;
  else if (s._item === null || !s._item.deleted) {
    let a = s._first, l = 0;
    for (; l < s._length && l < i.index && a !== null; ) {
      if (!a.deleted) {
        const c = (
          /** @type {Y.ContentType} */
          a.content.type
        );
        l++, c instanceof W.XmlText ? o += c._length : o += /** @type {any} */
        r.get(c).nodeSize;
      }
      a = /** @type {Y.Item} */
      a.right;
    }
    o += 1;
  }
  for (; s !== e && s._item !== null; ) {
    const a = s._item.parent;
    if (a._item === null || !a._item.deleted) {
      o += 1;
      let l = (
        /** @type {Y.AbstractType} */
        a._first
      );
      for (; l !== null; ) {
        const c = (
          /** @type {Y.ContentType} */
          l.content.type
        );
        if (c === s)
          break;
        l.deleted || (c instanceof W.XmlText ? o += c._length : o += /** @type {any} */
        r.get(c).nodeSize), l = l.right;
      }
    }
    s = /** @type {Y.AbstractType} */
    a;
  }
  return o - 1;
};
function u_(n, e) {
  const t = e || new W.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return Is(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function d_(n, e, t) {
  const r = It.fromJSON(n, e);
  return u_(r, t);
}
const f_ = (n, e, t) => n !== e, h_ = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, p_ = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), m_ = /^#[0-9a-fA-F]{6}$/, Nd = (n, e, t, r, i) => {
  const s = se.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return le.create(n.doc, []);
  const o = s.doc, a = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? le.create(n.doc, []) : (e.getStates().forEach((l, c) => {
    if (t(o.clientID, c, l) && l.cursor != null) {
      const u = l.user || {};
      u.color == null ? u.color = "#ffa500" : m_.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = Cn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.anchor),
        s.binding.mapping
      ), f = Cn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.head),
        s.binding.mapping
      );
      if (d !== null && f !== null) {
        const h = fr(n.doc.content.size - 1, 0);
        d = rn(d, h), f = rn(f, h), a.push(
          Xe.widget(f, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = rn(d, f), m = fr(d, f);
        a.push(
          Xe.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), le.create(n.doc, a));
}, g_ = (n, {
  awarenessStateFilter: e = f_,
  cursorBuilder: t = h_,
  selectionBuilder: r = p_,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new Ie({
  key: qi,
  state: {
    init(o, a) {
      return Nd(
        a,
        n,
        e,
        t,
        r
      );
    },
    apply(o, a, l, c) {
      const u = se.getState(c), d = o.getMeta(qi);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? Nd(
        c,
        n,
        e,
        t,
        r
      ) : a.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => qi.getState(o)
  },
  view: (o) => {
    const a = () => {
      o.docView && l_(o, qi, { awarenessUpdated: !0 });
    }, l = () => {
      const c = se.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), f = ui(
          d.anchor,
          c.type,
          c.binding.mapping
        ), h = ui(
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
      } else u.cursor != null && Cn(
        c.doc,
        c.type,
        W.createRelativePositionFromJSON(u.cursor.anchor),
        c.binding.mapping
      ) !== null && n.setLocalStateField(s, null);
    };
    return n.on("change", a), o.dom.addEventListener("focusin", l), o.dom.addEventListener("focusout", l), {
      update: l,
      destroy: () => {
        o.dom.removeEventListener("focusin", l), o.dom.removeEventListener("focusout", l), n.off("change", a), n.setLocalStateField(s, null);
      }
    };
  }
}), y_ = (n) => {
  const e = Bt.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, v_ = (n) => {
  const e = Bt.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, b_ = /* @__PURE__ */ new Set(["paragraph"]), k_ = (n, e) => !(n instanceof ny) || !(n.content instanceof ry) || !(n.content.type instanceof iy || n.content.type instanceof sy && e.has(n.content.type.nodeName)) || n.content.type._length === 0, w_ = ({ protectedNodes: n = b_, trackedOrigins: e = [], undoManager: t = null } = {}) => new Ie({
  key: Bt,
  state: {
    init: (r, i) => {
      const s = se.getState(i), o = t || new ty(s.type, {
        trackedOrigins: new Set([se].concat(e)),
        deleteFilter: (a) => k_(a, n),
        captureTransaction: (a) => a.meta.get("addToHistory") !== !1
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
      const a = se.getState(o).binding, l = i.undoManager, c = l.undoStack.length > 0, u = l.redoStack.length > 0;
      return a ? {
        undoManager: l,
        prevSel: Ka(a, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: l.undoStack.length > 0,
        hasRedoOps: l.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = se.getState(r.state), s = Bt.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const a = i.binding;
      a && o.meta.set(a, Bt.getState(r.state).prevSel);
    }), s.on("stack-item-popped", ({ stackItem: o }) => {
      const a = i.binding;
      a && (a.beforeTransactionSelection = o.meta.get(a) || a.beforeTransactionSelection);
    }), {
      destroy: () => {
        s.destroy();
      }
    };
  }
});
function pg(n) {
  return !!n.getMeta(se);
}
function x_(n, e) {
  const t = se.getState(n);
  return Cn(t.doc, t.type, e, t.binding.mapping) || 0;
}
function mg(n, e) {
  const t = se.getState(n);
  return ui(e, t.type, t.binding.mapping);
}
var ts = class gg extends Wl {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new gg(e.position, e.yRelativePosition);
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
function S_(n, e) {
  const t = mg(e, n);
  return new ts(n, t);
}
function C_(n, e, t) {
  const r = n instanceof ts ? n.yRelativePosition : null;
  if (pg(e) && r) {
    const o = x_(t, r);
    return {
      position: new ts(o, r),
      mapResult: null
    };
  }
  const i = Gp(n, e), s = i.position.position;
  return {
    position: new ts(
      s,
      r ?? mg(t, s)
    ),
    mapResult: i.mapResult
  };
}
var T_ = rt.create({
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
    this.editor.utils.getUpdatedPosition = (n, e) => C_(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => S_(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Bt.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? y_(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Bt.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? v_(e) : !0)
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
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = w_(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Bt.getState(s.state);
      o.restore && (o.restore(), o.restore = () => {
      });
      const a = t ? t(s) : void 0;
      return {
        destroy: () => {
          const l = o.trackedOrigins.has(o), c = o._observers;
          o.restore = () => {
            l && o.trackedOrigins.add(o), o.doc.on("afterTransaction", o.afterTransactionHandler), o._observers = c;
          }, a?.destroy && a.destroy();
        }
      };
    };
    const r = {
      ...this.options.ySyncOptions,
      onFirstRender: this.options.onFirstRender
    };
    return [
      GD(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new Ie({
        key: new nt("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!pg(s))
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
                var a;
                (a = n.doc) == null || a.destroy();
              }
            }), !1;
          }
        }
      })
    ].filter(Boolean);
  }
});
const E_ = Math.floor, M_ = (n, e) => n < e ? n : e, A_ = (n, e) => n > e ? n : e, yg = 128, ns = 127, O_ = Number.MAX_SAFE_INTEGER, D_ = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, di = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), __ = (n) => di.encode(n), P_ = di ? __ : D_;
let qr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
qr && qr.decode(new Uint8Array()).length === 1 && (qr = null);
const Ns = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, go = (n, e) => {
  for (; e > ns; )
    Ns(n, yg | ns & e), e = E_(e / 128);
  Ns(n, ns & e);
}, Ga = new Uint8Array(3e4), R_ = Ga.length / 3, I_ = (n, e) => {
  if (e.length < R_) {
    const t = di.encodeInto(e, Ga).written || 0;
    go(n, t);
    for (let r = 0; r < t; r++)
      Ns(n, Ga[r]);
  } else
    L_(n, P_(e));
}, N_ = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  go(n, r);
  for (let i = 0; i < r; i++)
    Ns(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, $_ = di && /** @type {any} */
di.encodeInto ? I_ : N_, B_ = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = M_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(A_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, L_ = (n, e) => {
  go(n, e.byteLength), B_(n, e);
}, vg = (n) => new Error(n), z_ = vg("Unexpected end of array"), F_ = vg("Integer out of Range"), V_ = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, q_ = (n) => V_(n, mc(n)), $d = (n) => n.arr[n.pos++], mc = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & ns) * t, t *= 128, i < yg)
      return e;
    if (e > O_)
      throw F_;
  }
  throw z_;
}, U_ = (n) => {
  let e = mc(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint($d(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint($d(n));
    else
      for (; e > 0; ) {
        const r = e < 1e4 ? e : 1e4, i = n.arr.subarray(n.pos, n.pos + r);
        n.pos += r, t += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          i
        ), e -= r;
      }
    return decodeURIComponent(escape(t));
  }
}, W_ = (n) => (
  /** @type any */
  qr.decode(q_(n))
), Bd = qr ? W_ : U_;
var ir;
(function(n) {
  n[n.Token = 0] = "Token", n[n.PermissionDenied = 1] = "PermissionDenied", n[n.Authenticated = 2] = "Authenticated";
})(ir || (ir = {}));
const j_ = (n, e) => {
  go(n, ir.Token), $_(n, e);
}, H_ = (n, e, t, r) => {
  switch (mc(n)) {
    case ir.Token: {
      e();
      break;
    }
    case ir.PermissionDenied: {
      t(Bd(n));
      break;
    }
    case ir.Authenticated: {
      r(Bd(n));
      break;
    }
  }
}, Ld = (n) => Array.from(n.entries()).map(([e, t]) => ({
  clientId: e,
  ...t
}));
var Ya;
(function(n) {
  n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed";
})(Ya || (Ya = {}));
function K_(n) {
  return n || (n = {}), {
    delay: n.delay === void 0 ? 200 : n.delay,
    initialDelay: n.initialDelay === void 0 ? 0 : n.initialDelay,
    minDelay: n.minDelay === void 0 ? 0 : n.minDelay,
    maxDelay: n.maxDelay === void 0 ? 0 : n.maxDelay,
    factor: n.factor === void 0 ? 0 : n.factor,
    maxAttempts: n.maxAttempts === void 0 ? 3 : n.maxAttempts,
    timeout: n.timeout === void 0 ? 0 : n.timeout,
    jitter: n.jitter === !0,
    initialJitter: n.initialJitter === !0,
    handleError: n.handleError === void 0 ? null : n.handleError,
    handleTimeout: n.handleTimeout === void 0 ? null : n.handleTimeout,
    beforeAttempt: n.beforeAttempt === void 0 ? null : n.beforeAttempt,
    calculateDelay: n.calculateDelay === void 0 ? null : n.calculateDelay
  };
}
async function ea(n) {
  return new Promise((e) => setTimeout(e, n));
}
function J_(n, e) {
  let t = e.delay;
  if (t === 0)
    return 0;
  if (e.factor && (t *= Math.pow(e.factor, n.attemptNum - 1), e.maxDelay !== 0 && (t = Math.min(t, e.maxDelay))), e.jitter) {
    const r = Math.ceil(e.minDelay), i = Math.floor(t);
    t = Math.floor(Math.random() * (i - r + 1)) + r;
  }
  return Math.round(t);
}
async function X_(n, e) {
  const t = K_(e);
  for (const a of [
    "delay",
    "initialDelay",
    "minDelay",
    "maxDelay",
    "maxAttempts",
    "timeout"
  ]) {
    const l = t[a];
    if (!Number.isInteger(l) || l < 0)
      throw new Error(`Value for ${a} must be an integer greater than or equal to 0`);
  }
  if (t.factor.constructor !== Number || t.factor < 0)
    throw new Error("Value for factor must be a number greater than or equal to 0");
  if (t.delay < t.minDelay)
    throw new Error(`delay cannot be less than minDelay (delay: ${t.delay}, minDelay: ${t.minDelay}`);
  const r = {
    attemptNum: 0,
    attemptsRemaining: t.maxAttempts ? t.maxAttempts : -1,
    aborted: !1,
    abort() {
      r.aborted = !0;
    }
  }, i = t.calculateDelay || J_;
  async function s() {
    if (t.beforeAttempt && t.beforeAttempt(r, t), r.aborted) {
      const l = new Error("Attempt aborted");
      throw l.code = "ATTEMPT_ABORTED", l;
    }
    const a = async (l) => {
      if (t.handleError && await t.handleError(l, r, t), r.aborted || r.attemptsRemaining === 0)
        throw l;
      r.attemptNum++;
      const c = i(r, t);
      return c && await ea(c), s();
    };
    return r.attemptsRemaining > 0 && r.attemptsRemaining--, t.timeout ? new Promise((l, c) => {
      const u = setTimeout(() => {
        if (t.handleTimeout)
          try {
            l(t.handleTimeout(r, t));
          } catch (d) {
            c(d);
          }
        else {
          const d = new Error(`Retry timeout (attemptNum: ${r.attemptNum}, timeout: ${t.timeout})`);
          d.code = "ATTEMPT_TIMEOUT", c(d);
        }
      }, t.timeout);
      n(r, t).then((d) => {
        clearTimeout(u), l(d);
      }).catch((d) => {
        clearTimeout(u), a(d).then(l).catch(c);
      });
    }) : n(r, t).catch(a);
  }
  const o = t.calculateDelay ? t.calculateDelay(r, t) : t.initialDelay;
  if (o && await ea(o), r.attemptNum < 1 && t.initialJitter) {
    const a = i(r, t);
    a && await ea(a);
  }
  return s();
}
const bg = Math.floor, G_ = (n, e) => n < e ? n : e, Y_ = (n, e) => n > e ? n : e, Z_ = 64, $s = 128, Q_ = 63, Ur = 127, kg = Number.MAX_SAFE_INTEGER, eP = () => /* @__PURE__ */ new Set(), tP = Array.from, nP = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, fi = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), rP = (n) => fi.encode(n), iP = fi ? rP : nP;
let Wr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Wr && Wr.decode(new Uint8Array()).length === 1 && (Wr = null);
class sP {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const gc = () => new sP(), wg = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, yc = (n) => {
  const e = new Uint8Array(wg(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, Bs = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Be = (n, e) => {
  for (; e > Ur; )
    Bs(n, $s | Ur & e), e = bg(e / 128);
  Bs(n, Ur & e);
}, Za = new Uint8Array(3e4), oP = Za.length / 3, aP = (n, e) => {
  if (e.length < oP) {
    const t = fi.encodeInto(e, Za).written || 0;
    Be(n, t);
    for (let r = 0; r < t; r++)
      Bs(n, Za[r]);
  } else
    xr(n, iP(e));
}, lP = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Be(n, r);
  for (let i = 0; i < r; i++)
    Bs(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, qt = fi && /** @type {any} */
fi.encodeInto ? aP : lP, cP = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = G_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(Y_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, xr = (n, e) => {
  Be(n, e.byteLength), cP(n, e);
}, xg = (n) => new Error(n), Sg = xg("Unexpected end of array"), Cg = xg("Integer out of Range");
class uP {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const Tg = (n) => new uP(n), dP = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, yo = (n) => dP(n, Tn(n)), zd = (n) => n.arr[n.pos++], Tn = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Ur) * t, t *= 128, i < $s)
      return e;
    if (e > kg)
      throw Cg;
  }
  throw Sg;
}, fP = (n) => {
  let e = n.arr[n.pos++], t = e & Q_, r = 64;
  const i = (e & Z_) > 0 ? -1 : 1;
  if ((e & $s) === 0)
    return i * t;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    if (e = n.arr[n.pos++], t = t + (e & Ur) * r, r *= 128, e < $s)
      return i * t;
    if (t > kg)
      throw Cg;
  }
  throw Sg;
}, hP = (n) => {
  let e = Tn(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(zd(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(zd(n));
    else
      for (; e > 0; ) {
        const r = e < 1e4 ? e : 1e4, i = n.arr.subarray(n.pos, n.pos + r);
        n.pos += r, t += String.fromCodePoint.apply(
          null,
          /** @type {any} */
          i
        ), e -= r;
      }
    return decodeURIComponent(escape(t));
  }
}, pP = (n) => (
  /** @type any */
  Wr.decode(yo(n))
), hi = Wr ? pP : hP, mP = (n) => {
  const e = n.pos, t = hi(n);
  return n.pos = e, t;
}, mr = Date.now, ta = () => /* @__PURE__ */ new Map(), gP = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
};
class yP {
  constructor() {
    this._observers = ta();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, t) {
    gP(this._observers, e, eP).add(t);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  once(e, t) {
    const r = (...i) => {
      this.off(e, r), t(...i);
    };
    this.on(e, r);
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  off(e, t) {
    const r = this._observers.get(e);
    r !== void 0 && (r.delete(t), r.size === 0 && this._observers.delete(e));
  }
  /**
   * Emit a named event. All registered event listeners that listen to the
   * specified name will receive the event.
   *
   * @todo This should catch exceptions
   *
   * @param {N} name The event name.
   * @param {Array<any>} args The arguments that are applied to the event listener.
   */
  emit(e, t) {
    return tP((this._observers.get(e) || ta()).values()).forEach((r) => r(...t));
  }
  destroy() {
    this._observers = ta();
  }
}
const vP = Object.keys, Fd = (n) => vP(n).length, bP = (n, e) => Object.prototype.hasOwnProperty.call(n, e), kP = (n, e) => n === e, jr = (n, e) => {
  if (n == null || e == null)
    return kP(n, e);
  if (n.constructor !== e.constructor)
    return !1;
  if (n === e)
    return !0;
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
        if (!e.has(t) || !jr(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case Object:
      if (Fd(n) !== Fd(e))
        return !1;
      for (const t in n)
        if (!bP(n, t) || !jr(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!jr(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, na = 3e4;
class wP extends yP {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const t = mr();
      this.getLocalState() !== null && na / 2 <= t - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && na <= t - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && rs(this, r, "timeout");
    }, bg(na / 10)), e.on("destroy", () => {
      this.destroy();
    }), this.setLocalState({});
  }
  destroy() {
    this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
  }
  /**
   * @return {Object<string,any>|null}
   */
  getLocalState() {
    return this.states.get(this.clientID) || null;
  }
  /**
   * @param {Object<string,any>|null} state
   */
  setLocalState(e) {
    const t = this.clientID, r = this.meta.get(t), i = r === void 0 ? 0 : r.clock + 1, s = this.states.get(t);
    e === null ? this.states.delete(t) : this.states.set(t, e), this.meta.set(t, {
      clock: i,
      lastUpdated: mr()
    });
    const o = [], a = [], l = [], c = [];
    e === null ? c.push(t) : s == null ? e != null && o.push(t) : (a.push(t), jr(s, e) || l.push(t)), (o.length > 0 || l.length > 0 || c.length > 0) && this.emit("change", [{ added: o, updated: l, removed: c }, "local"]), this.emit("update", [{ added: o, updated: a, removed: c }, "local"]);
  }
  /**
   * @param {string} field
   * @param {any} value
   */
  setLocalStateField(e, t) {
    const r = this.getLocalState();
    r !== null && this.setLocalState({
      ...r,
      [e]: t
    });
  }
  /**
   * @return {Map<number,Object<string,any>>}
   */
  getStates() {
    return this.states;
  }
}
const rs = (n, e, t) => {
  const r = [];
  for (let i = 0; i < e.length; i++) {
    const s = e[i];
    if (n.states.has(s)) {
      if (n.states.delete(s), s === n.clientID) {
        const o = (
          /** @type {MetaClientState} */
          n.meta.get(s)
        );
        n.meta.set(s, {
          clock: o.clock + 1,
          lastUpdated: mr()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: r }, t]), n.emit("update", [{ added: [], updated: [], removed: r }, t]));
}, Qa = (n, e, t = n.states) => {
  const r = e.length, i = gc();
  Be(i, r);
  for (let s = 0; s < r; s++) {
    const o = e[s], a = t.get(o) || null, l = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    Be(i, o), Be(i, l), qt(i, JSON.stringify(a));
  }
  return yc(i);
}, xP = (n, e, t) => {
  const r = Tg(e), i = mr(), s = [], o = [], a = [], l = [], c = Tn(r);
  for (let u = 0; u < c; u++) {
    const d = Tn(r);
    let f = Tn(r);
    const h = JSON.parse(hi(r)), p = n.meta.get(d), m = n.states.get(d), g = p === void 0 ? 0 : p.clock;
    (g < f || g === f && h === null && n.states.has(d)) && (h === null ? d === n.clientID && n.getLocalState() != null ? f++ : n.states.delete(d) : n.states.set(d, h), n.meta.set(d, {
      clock: f,
      lastUpdated: i
    }), p === void 0 && h !== null ? s.push(d) : p !== void 0 && h === null ? l.push(d) : h !== null && (jr(h, m) || a.push(d), o.push(d)));
  }
  (s.length > 0 || a.length > 0 || l.length > 0) && n.emit("change", [{
    added: s,
    updated: a,
    removed: l
  }, t]), (s.length > 0 || o.length > 0 || l.length > 0) && n.emit("update", [{
    added: s,
    updated: o,
    removed: l
  }, t]);
};
class Eg {
  constructor() {
    this.callbacks = {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
class el {
  constructor(e) {
    this.data = e, this.encoder = gc(), this.decoder = Tg(new Uint8Array(this.data));
  }
  peekVarString() {
    return mP(this.decoder);
  }
  readVarUint() {
    return Tn(this.decoder);
  }
  readVarString() {
    return hi(this.decoder);
  }
  readVarUint8Array() {
    return yo(this.decoder);
  }
  writeVarUint(e) {
    return Be(this.encoder, e);
  }
  writeVarString(e) {
    return qt(this.encoder, e);
  }
  writeVarUint8Array(e) {
    return xr(this.encoder, e);
  }
  length() {
    return wg(this.encoder);
  }
}
var Ae;
(function(n) {
  n[n.Sync = 0] = "Sync", n[n.Awareness = 1] = "Awareness", n[n.Auth = 2] = "Auth", n[n.QueryAwareness = 3] = "QueryAwareness", n[n.Stateless = 5] = "Stateless", n[n.CLOSE = 7] = "CLOSE", n[n.SyncStatus = 8] = "SyncStatus";
})(Ae || (Ae = {}));
var Ue;
(function(n) {
  n.Connecting = "connecting", n.Connected = "connected", n.Disconnected = "disconnected";
})(Ue || (Ue = {}));
class Vn {
  constructor() {
    this.encoder = gc();
  }
  get(e) {
    return e.encoder;
  }
  toUint8Array() {
    return yc(this.encoder);
  }
}
class SP extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.CLOSE, this.description = "Ask the server to close the connection";
  }
  get(e) {
    return qt(this.encoder, e.documentName), Be(this.encoder, this.type), this.encoder;
  }
}
class CP extends Eg {
  constructor(e) {
    super(), this.messageQueue = [], this.configuration = {
      url: "",
      autoConnect: !0,
      preserveTrailingSlash: !1,
      // @ts-ignore
      document: void 0,
      WebSocketPolyfill: void 0,
      // TODO: this should depend on awareness.outdatedTime
      messageReconnectTimeout: 3e4,
      // 1 second
      delay: 1e3,
      // instant
      initialDelay: 0,
      // double the delay each time
      factor: 2,
      // unlimited retries
      maxAttempts: 0,
      // wait at least 1 second
      minDelay: 1e3,
      // at least every 30 seconds
      maxDelay: 3e4,
      // randomize
      jitter: !0,
      // retry forever
      timeout: 0,
      onOpen: () => null,
      onConnect: () => null,
      onMessage: () => null,
      onOutgoingMessage: () => null,
      onStatus: () => null,
      onDisconnect: () => null,
      onClose: () => null,
      onDestroy: () => null,
      onAwarenessUpdate: () => null,
      onAwarenessChange: () => null,
      handleTimeout: null,
      providerMap: /* @__PURE__ */ new Map()
    }, this.webSocket = null, this.webSocketHandlers = {}, this.shouldConnect = !0, this.status = Ue.Disconnected, this.lastMessageReceived = 0, this.identifier = 0, this.intervals = {
      connectionChecker: null
    }, this.connectionAttempt = null, this.receivedOnOpenPayload = void 0, this.closeTries = 0, this.setConfiguration(e), this.configuration.WebSocketPolyfill = e.WebSocketPolyfill ? e.WebSocketPolyfill : WebSocket, this.on("open", this.configuration.onOpen), this.on("open", this.onOpen.bind(this)), this.on("connect", this.configuration.onConnect), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("status", this.configuration.onStatus), this.on("disconnect", this.configuration.onDisconnect), this.on("close", this.configuration.onClose), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("close", this.onClose.bind(this)), this.on("message", this.onMessage.bind(this)), this.intervals.connectionChecker = setInterval(this.checkConnection.bind(this), this.configuration.messageReconnectTimeout / 10), this.shouldConnect && this.connect();
  }
  async onOpen(e) {
    this.status = Ue.Connected, this.emit("status", { status: Ue.Connected }), this.cancelWebsocketRetry = void 0, this.receivedOnOpenPayload = e;
  }
  attach(e) {
    this.configuration.providerMap.set(e.configuration.name, e), this.status === Ue.Disconnected && this.shouldConnect && this.connect(), this.receivedOnOpenPayload && this.status === Ue.Connected && e.onOpen(this.receivedOnOpenPayload);
  }
  detach(e) {
    this.configuration.providerMap.has(e.configuration.name) && (e.send(SP, {
      documentName: e.configuration.name
    }), this.configuration.providerMap.delete(e.configuration.name));
  }
  setConfiguration(e = {}) {
    this.configuration = { ...this.configuration, ...e }, this.configuration.autoConnect || (this.shouldConnect = !1);
  }
  async connect() {
    if (this.status === Ue.Connected)
      return;
    this.cancelWebsocketRetry && (this.cancelWebsocketRetry(), this.cancelWebsocketRetry = void 0), this.receivedOnOpenPayload = void 0, this.shouldConnect = !0;
    const e = () => {
      let i = !1;
      return {
        retryPromise: X_(this.createWebSocketConnection.bind(this), {
          delay: this.configuration.delay,
          initialDelay: this.configuration.initialDelay,
          factor: this.configuration.factor,
          maxAttempts: this.configuration.maxAttempts,
          minDelay: this.configuration.minDelay,
          maxDelay: this.configuration.maxDelay,
          jitter: this.configuration.jitter,
          timeout: this.configuration.timeout,
          handleTimeout: this.configuration.handleTimeout,
          beforeAttempt: (o) => {
            (!this.shouldConnect || i) && o.abort();
          }
        }).catch((o) => {
          if (o && o.code !== "ATTEMPT_ABORTED")
            throw o;
        }),
        cancelFunc: () => {
          i = !0;
        }
      };
    }, { retryPromise: t, cancelFunc: r } = e();
    return this.cancelWebsocketRetry = r, t;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  attachWebSocketListeners(e, t) {
    const { identifier: r } = e, i = (c) => this.emit("message", c), s = (c) => this.emit("close", { event: c }), o = (c) => this.emit("open", c), a = (c) => {
      t(c);
    };
    this.webSocketHandlers[r] = {
      message: i,
      close: s,
      open: o,
      error: a
    };
    const l = this.webSocketHandlers[e.identifier];
    Object.keys(l).forEach((c) => {
      e.addEventListener(c, l[c]);
    });
  }
  cleanupWebSocket() {
    if (!this.webSocket)
      return;
    const { identifier: e } = this.webSocket, t = this.webSocketHandlers[e];
    Object.keys(t).forEach((r) => {
      var i;
      (i = this.webSocket) === null || i === void 0 || i.removeEventListener(r, t[r]), delete this.webSocketHandlers[e];
    }), this.webSocket.close(), this.webSocket = null;
  }
  createWebSocketConnection() {
    return new Promise((e, t) => {
      this.webSocket && (this.messageQueue = [], this.cleanupWebSocket()), this.lastMessageReceived = 0, this.identifier += 1;
      const r = new this.configuration.WebSocketPolyfill(this.url);
      r.binaryType = "arraybuffer", r.identifier = this.identifier, this.attachWebSocketListeners(r, t), this.webSocket = r, this.status = Ue.Connecting, this.emit("status", { status: Ue.Connecting }), this.connectionAttempt = {
        resolve: e,
        reject: t
      };
    });
  }
  onMessage(e) {
    var t;
    this.resolveConnectionAttempt(), this.lastMessageReceived = mr();
    const i = new el(e.data).peekVarString();
    (t = this.configuration.providerMap.get(i)) === null || t === void 0 || t.onMessage(e);
  }
  resolveConnectionAttempt() {
    this.connectionAttempt && (this.connectionAttempt.resolve(), this.connectionAttempt = null, this.status = Ue.Connected, this.emit("status", { status: Ue.Connected }), this.emit("connect"), this.messageQueue.forEach((e) => this.send(e)), this.messageQueue = []);
  }
  stopConnectionAttempt() {
    this.connectionAttempt = null;
  }
  rejectConnectionAttempt() {
    var e;
    (e = this.connectionAttempt) === null || e === void 0 || e.reject(), this.connectionAttempt = null;
  }
  checkConnection() {
    var e;
    this.status === Ue.Connected && this.lastMessageReceived && (this.configuration.messageReconnectTimeout >= mr() - this.lastMessageReceived || (this.closeTries += 1, this.closeTries > 2 ? (this.onClose({
      event: {
        code: 4408,
        reason: "forced"
      }
    }), this.closeTries = 0) : ((e = this.webSocket) === null || e === void 0 || e.close(), this.messageQueue = [])));
  }
  get serverUrl() {
    if (this.configuration.preserveTrailingSlash)
      return this.configuration.url;
    let e = this.configuration.url;
    for (; e[e.length - 1] === "/"; )
      e = e.slice(0, e.length - 1);
    return e;
  }
  get url() {
    return this.serverUrl;
  }
  disconnect() {
    if (this.shouldConnect = !1, this.webSocket !== null)
      try {
        this.webSocket.close(), this.messageQueue = [];
      } catch (e) {
        console.error(e);
      }
  }
  send(e) {
    var t;
    ((t = this.webSocket) === null || t === void 0 ? void 0 : t.readyState) === Ya.Open ? this.webSocket.send(e) : this.messageQueue.push(e);
  }
  onClose({ event: e }) {
    this.closeTries = 0, this.cleanupWebSocket(), this.connectionAttempt && this.rejectConnectionAttempt(), this.status = Ue.Disconnected, this.emit("status", { status: Ue.Disconnected }), this.emit("disconnect", { event: e }), !this.cancelWebsocketRetry && this.shouldConnect && setTimeout(() => {
      this.connect();
    }, this.configuration.delay);
  }
  destroy() {
    this.emit("destroy"), clearInterval(this.intervals.connectionChecker), this.stopConnectionAttempt(), this.disconnect(), this.removeAllListeners(), this.cleanupWebSocket();
  }
}
const Mg = 0, vc = 1, Ag = 2, TP = (n, e) => {
  Be(n, Mg);
  const t = W.encodeStateVector(e);
  xr(n, t);
}, EP = (n, e, t) => {
  Be(n, vc), xr(n, W.encodeStateAsUpdate(e, t));
}, MP = (n, e, t) => EP(e, t, yo(n)), Og = (n, e, t) => {
  try {
    W.applyUpdate(e, yo(n), t);
  } catch (r) {
    console.error("Caught error while handling a Yjs update", r);
  }
}, AP = (n, e) => {
  Be(n, Ag), xr(n, e);
}, OP = Og, DP = (n, e, t, r) => {
  const i = Tn(n);
  switch (i) {
    case Mg:
      MP(n, e, t);
      break;
    case vc:
      Og(n, t, r);
      break;
    case Ag:
      OP(n, t, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
class _P {
  constructor(e) {
    this.message = e;
  }
  apply(e, t) {
    const { message: r } = this, i = r.readVarUint(), s = r.length();
    switch (i) {
      case Ae.Sync:
        this.applySyncMessage(e, t);
        break;
      case Ae.Awareness:
        this.applyAwarenessMessage(e);
        break;
      case Ae.Auth:
        this.applyAuthMessage(e);
        break;
      case Ae.QueryAwareness:
        this.applyQueryAwarenessMessage(e);
        break;
      case Ae.Stateless:
        e.receiveStateless(hi(r.decoder));
        break;
      case Ae.SyncStatus:
        this.applySyncStatusMessage(e, fP(r.decoder) === 1);
        break;
      case Ae.CLOSE:
        const o = {
          code: 1e3,
          reason: hi(r.decoder),
          // @ts-ignore
          target: e.configuration.websocketProvider.webSocket,
          type: "close"
        };
        e.onClose(), e.configuration.onClose({ event: o }), e.forwardClose({ event: o });
        break;
      default:
        throw new Error(`Can’t apply message of unknown type: ${i}`);
    }
    r.length() > s + 1 && e.send(Vn, { encoder: r.encoder });
  }
  applySyncMessage(e, t) {
    const { message: r } = this;
    r.writeVarUint(Ae.Sync);
    const i = DP(r.decoder, r.encoder, e.document, e);
    t && i === vc && (e.synced = !0);
  }
  applySyncStatusMessage(e, t) {
    t && e.decrementUnsyncedChanges();
  }
  applyAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    xP(e.awareness, t.readVarUint8Array(), e);
  }
  applyAuthMessage(e) {
    const { message: t } = this;
    H_(t.decoder, e.sendToken.bind(e), e.permissionDeniedHandler.bind(e), e.authenticatedHandler.bind(e));
  }
  applyQueryAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    t.writeVarUint(Ae.Awareness), t.writeVarUint8Array(Qa(e.awareness, Array.from(e.awareness.getStates().keys())));
  }
}
class PP {
  constructor(e, t = {}) {
    this.message = new e(), this.encoder = this.message.get(t);
  }
  create() {
    return yc(this.encoder);
  }
  send(e) {
    e?.send(this.create());
  }
}
class RP extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.Auth, this.description = "Authentication";
  }
  get(e) {
    if (typeof e.token > "u")
      throw new Error("The authentication message requires `token` as an argument.");
    return qt(this.encoder, e.documentName), Be(this.encoder, this.type), j_(this.encoder, e.token), this.encoder;
  }
}
class Vd extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.Awareness, this.description = "Awareness states update";
  }
  get(e) {
    if (typeof e.awareness > "u")
      throw new Error("The awareness message requires awareness as an argument");
    if (typeof e.clients > "u")
      throw new Error("The awareness message requires clients as an argument");
    qt(this.encoder, e.documentName), Be(this.encoder, this.type);
    let t;
    return e.states === void 0 ? t = Qa(e.awareness, e.clients) : t = Qa(e.awareness, e.clients, e.states), xr(this.encoder, t), this.encoder;
  }
}
class IP extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.Stateless, this.description = "A stateless message";
  }
  get(e) {
    var t;
    return qt(this.encoder, e.documentName), Be(this.encoder, this.type), qt(this.encoder, (t = e.payload) !== null && t !== void 0 ? t : ""), this.encoder;
  }
}
class qd extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.Sync, this.description = "First sync step";
  }
  get(e) {
    if (typeof e.document > "u")
      throw new Error("The sync step one message requires document as an argument");
    return qt(this.encoder, e.documentName), Be(this.encoder, this.type), TP(this.encoder, e.document), this.encoder;
  }
}
class NP extends Vn {
  constructor() {
    super(...arguments), this.type = Ae.Sync, this.description = "A document update";
  }
  get(e) {
    return qt(this.encoder, e.documentName), Be(this.encoder, this.type), AP(this.encoder, e.update), this.encoder;
  }
}
class $P extends Error {
  constructor() {
    super(...arguments), this.code = 1001;
  }
}
class BP extends Eg {
  constructor(e) {
    var t, r, i;
    super(), this.configuration = {
      name: "",
      // @ts-ignore
      document: void 0,
      // @ts-ignore
      awareness: void 0,
      token: null,
      forceSyncInterval: !1,
      onAuthenticated: () => null,
      onAuthenticationFailed: () => null,
      onOpen: () => null,
      onConnect: () => null,
      onMessage: () => null,
      onOutgoingMessage: () => null,
      onSynced: () => null,
      onStatus: () => null,
      onDisconnect: () => null,
      onClose: () => null,
      onDestroy: () => null,
      onAwarenessUpdate: () => null,
      onAwarenessChange: () => null,
      onStateless: () => null,
      onUnsyncedChanges: () => null
    }, this.isSynced = !1, this.unsyncedChanges = 0, this.isAuthenticated = !1, this.authorizedScope = void 0, this.manageSocket = !1, this._isAttached = !1, this.intervals = {
      forceSync: null
    }, this.boundDocumentUpdateHandler = this.documentUpdateHandler.bind(this), this.boundAwarenessUpdateHandler = this.awarenessUpdateHandler.bind(this), this.boundPageHide = this.pageHide.bind(this), this.boundOnOpen = this.onOpen.bind(this), this.boundOnClose = this.onClose.bind(this), this.forwardConnect = () => this.emit("connect"), this.forwardStatus = (s) => this.emit("status", s), this.forwardClose = (s) => this.emit("close", s), this.forwardDisconnect = (s) => this.emit("disconnect", s), this.forwardDestroy = () => this.emit("destroy"), this.setConfiguration(e), this.configuration.document = e.document ? e.document : new W.Doc(), this.configuration.awareness = e.awareness !== void 0 ? e.awareness : new wP(this.document), this.on("open", this.configuration.onOpen), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("synced", this.configuration.onSynced), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("stateless", this.configuration.onStateless), this.on("unsyncedChanges", this.configuration.onUnsyncedChanges), this.on("authenticated", this.configuration.onAuthenticated), this.on("authenticationFailed", this.configuration.onAuthenticationFailed), (t = this.awareness) === null || t === void 0 || t.on("update", () => {
      this.emit("awarenessUpdate", {
        states: Ld(this.awareness.getStates())
      });
    }), (r = this.awareness) === null || r === void 0 || r.on("change", () => {
      this.emit("awarenessChange", {
        states: Ld(this.awareness.getStates())
      });
    }), this.document.on("update", this.boundDocumentUpdateHandler), (i = this.awareness) === null || i === void 0 || i.on("update", this.boundAwarenessUpdateHandler), this.registerEventListeners(), this.configuration.forceSyncInterval && typeof this.configuration.forceSyncInterval == "number" && (this.intervals.forceSync = setInterval(this.forceSync.bind(this), this.configuration.forceSyncInterval)), this.manageSocket && this.attach();
  }
  setConfiguration(e = {}) {
    e.websocketProvider || (this.manageSocket = !0, this.configuration.websocketProvider = new CP(e)), this.configuration = { ...this.configuration, ...e };
  }
  get document() {
    return this.configuration.document;
  }
  get isAttached() {
    return this._isAttached;
  }
  get awareness() {
    return this.configuration.awareness;
  }
  get hasUnsyncedChanges() {
    return this.unsyncedChanges > 0;
  }
  resetUnsyncedChanges() {
    this.unsyncedChanges = 1, this.emit("unsyncedChanges", { number: this.unsyncedChanges });
  }
  incrementUnsyncedChanges() {
    this.unsyncedChanges += 1, this.emit("unsyncedChanges", { number: this.unsyncedChanges });
  }
  decrementUnsyncedChanges() {
    this.unsyncedChanges > 0 && (this.unsyncedChanges -= 1), this.unsyncedChanges === 0 && (this.synced = !0), this.emit("unsyncedChanges", { number: this.unsyncedChanges });
  }
  forceSync() {
    this.resetUnsyncedChanges(), this.send(qd, {
      document: this.document,
      documentName: this.configuration.name
    });
  }
  pageHide() {
    this.awareness && rs(this.awareness, [this.document.clientID], "page hide");
  }
  registerEventListeners() {
    typeof window > "u" || !("addEventListener" in window) || window.addEventListener("pagehide", this.boundPageHide);
  }
  sendStateless(e) {
    this.send(IP, {
      documentName: this.configuration.name,
      payload: e
    });
  }
  async sendToken() {
    let e;
    try {
      e = await this.getToken();
    } catch (t) {
      this.permissionDeniedHandler(`Failed to get token during sendToken(): ${t}`);
      return;
    }
    this.send(RP, {
      token: e ?? "",
      documentName: this.configuration.name
    });
  }
  documentUpdateHandler(e, t) {
    t !== this && (this.incrementUnsyncedChanges(), this.send(NP, { update: e, documentName: this.configuration.name }));
  }
  awarenessUpdateHandler({ added: e, updated: t, removed: r }, i) {
    const s = e.concat(t).concat(r);
    this.send(Vd, {
      awareness: this.awareness,
      clients: s,
      documentName: this.configuration.name
    });
  }
  /**
   * Indicates whether a first handshake with the server has been established
   *
   * Note: this does not mean all updates from the client have been persisted to the backend. For this,
   * use `hasUnsyncedChanges`.
   */
  get synced() {
    return this.isSynced;
  }
  set synced(e) {
    this.isSynced !== e && (this.isSynced = e, e && this.emit("synced", { state: e }));
  }
  receiveStateless(e) {
    this.emit("stateless", { payload: e });
  }
  // not needed, but provides backward compatibility with e.g. lexical/yjs
  async connect() {
    if (this.manageSocket)
      return this.configuration.websocketProvider.connect();
    console.warn("HocuspocusProvider::connect() is deprecated and does not do anything. Please connect/disconnect on the websocketProvider, or attach/deattach providers.");
  }
  disconnect() {
    if (this.manageSocket)
      return this.configuration.websocketProvider.disconnect();
    console.warn("HocuspocusProvider::disconnect() is deprecated and does not do anything. Please connect/disconnect on the websocketProvider, or attach/deattach providers.");
  }
  async onOpen(e) {
    this.isAuthenticated = !1, this.emit("open", { event: e }), await this.sendToken(), this.startSync();
  }
  async getToken() {
    return typeof this.configuration.token == "function" ? await this.configuration.token() : this.configuration.token;
  }
  startSync() {
    this.resetUnsyncedChanges(), this.send(qd, {
      document: this.document,
      documentName: this.configuration.name
    }), this.awareness && this.awareness.getLocalState() !== null && this.send(Vd, {
      awareness: this.awareness,
      clients: [this.document.clientID],
      documentName: this.configuration.name
    });
  }
  send(e, t) {
    if (!this._isAttached)
      return;
    const r = new PP(e, t);
    this.emit("outgoingMessage", { message: r.message }), r.send(this.configuration.websocketProvider);
  }
  onMessage(e) {
    const t = new el(e.data), r = t.readVarString();
    t.writeVarString(r), this.emit("message", { event: e, message: new el(e.data) }), new _P(t).apply(this, !0);
  }
  onClose() {
    this.isAuthenticated = !1, this.synced = !1, this.awareness && rs(this.awareness, Array.from(this.awareness.getStates().keys()).filter((e) => e !== this.document.clientID), this);
  }
  destroy() {
    this.emit("destroy"), this.intervals.forceSync && clearInterval(this.intervals.forceSync), this.awareness && (rs(this.awareness, [this.document.clientID], "provider destroy"), this.awareness.off("update", this.boundAwarenessUpdateHandler), this.awareness.destroy()), this.document.off("update", this.boundDocumentUpdateHandler), this.removeAllListeners(), this.detach(), this.manageSocket && this.configuration.websocketProvider.destroy(), !(typeof window > "u" || !("removeEventListener" in window)) && window.removeEventListener("pagehide", this.boundPageHide);
  }
  detach() {
    this.configuration.websocketProvider.off("connect", this.configuration.onConnect), this.configuration.websocketProvider.off("connect", this.forwardConnect), this.configuration.websocketProvider.off("status", this.forwardStatus), this.configuration.websocketProvider.off("status", this.configuration.onStatus), this.configuration.websocketProvider.off("open", this.boundOnOpen), this.configuration.websocketProvider.off("close", this.boundOnClose), this.configuration.websocketProvider.off("close", this.configuration.onClose), this.configuration.websocketProvider.off("close", this.forwardClose), this.configuration.websocketProvider.off("disconnect", this.configuration.onDisconnect), this.configuration.websocketProvider.off("disconnect", this.forwardDisconnect), this.configuration.websocketProvider.off("destroy", this.configuration.onDestroy), this.configuration.websocketProvider.off("destroy", this.forwardDestroy), this.configuration.websocketProvider.detach(this), this._isAttached = !1;
  }
  attach() {
    this._isAttached || (this.configuration.websocketProvider.on("connect", this.configuration.onConnect), this.configuration.websocketProvider.on("connect", this.forwardConnect), this.configuration.websocketProvider.on("status", this.configuration.onStatus), this.configuration.websocketProvider.on("status", this.forwardStatus), this.configuration.websocketProvider.on("open", this.boundOnOpen), this.configuration.websocketProvider.on("close", this.boundOnClose), this.configuration.websocketProvider.on("close", this.configuration.onClose), this.configuration.websocketProvider.on("close", this.forwardClose), this.configuration.websocketProvider.on("disconnect", this.configuration.onDisconnect), this.configuration.websocketProvider.on("disconnect", this.forwardDisconnect), this.configuration.websocketProvider.on("destroy", this.configuration.onDestroy), this.configuration.websocketProvider.on("destroy", this.forwardDestroy), this.configuration.websocketProvider.attach(this), this._isAttached = !0);
  }
  permissionDeniedHandler(e) {
    this.emit("authenticationFailed", { reason: e }), this.isAuthenticated = !1;
  }
  authenticatedHandler(e) {
    this.isAuthenticated = !0, this.authorizedScope = e, this.emit("authenticated", { scope: e });
  }
  setAwarenessField(e, t) {
    if (!this.awareness)
      throw new $P(`Cannot set awareness field "${e}" to ${JSON.stringify(t)}. You have disabled Awareness for this provider by explicitly passing awareness: null in the provider configuration.`);
    this.awareness.setLocalStateField(e, t);
  }
}
const Dg = Jl.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), LP = {
  type: "button",
  class: "speaker-popover-trigger"
}, zP = { class: "speaker-popover-name" }, FP = /* @__PURE__ */ $({
  __name: "SpeakerPopover",
  props: {
    turnId: {},
    currentSpeakerId: {}
  },
  setup(n) {
    const e = n, t = ze(), { t: r } = ye(), i = _(!1), s = _(!1), o = _(""), a = zt("newInput"), l = E(() => Array.from(t.speakers.all.values())), c = E(() => ({
      placeholder: r("speakerPopover.newSpeakerPlaceholder"),
      customParams: { "aria-label": r("speakerPopover.newSpeaker") }
    }));
    Z(i, (m) => {
      m || (s.value = !1, o.value = "");
    });
    async function u() {
      s.value = !0, o.value = "", await xe(), a.value?.focus();
    }
    function d(m) {
      m.id !== e.currentSpeakerId && OM(t, e.turnId, m.id), i.value = !1;
    }
    function f() {
      const m = o.value.trim();
      if (!m) {
        s.value = !1;
        return;
      }
      DM(t, e.turnId, m), i.value = !1;
    }
    function h(m) {
      m.stopPropagation();
    }
    function p() {
      s.value = !1;
    }
    return (m, g) => (T(), R(Xl, {
      open: i.value,
      "onUpdate:open": g[1] || (g[1] = (y) => i.value = y),
      items: l.value,
      "item-key": (y) => y.id,
      "is-current": (y) => y.id === n.currentSpeakerId,
      onSelect: d
    }, {
      trigger: N(() => [
        U("button", LP, [
          J(m.$slots, "default", {}, void 0, !0)
        ])
      ]),
      item: N(({ item: y }) => [
        q(zs, {
          color: y.color
        }, null, 8, ["color"]),
        U("span", zP, j(y.name), 1)
      ]),
      footer: N(() => [
        s.value ? (T(), R(Si, {
          key: 1,
          ref: "newInput",
          modelValue: o.value,
          "onUpdate:modelValue": g[0] || (g[0] = (y) => o.value = y),
          field: c.value,
          size: "sm",
          "full-width": "",
          "with-confirmation": "",
          onKeydown: h,
          onOnConfirm: f,
          onOnCancel: p
        }, null, 8, ["modelValue", "field"])) : (T(), R(me, {
          key: 0,
          icon: "user-plus",
          variant: "transparent",
          block: "",
          onClick: u
        }, {
          default: N(() => [
            ge(j(k(r)("speakerPopover.newSpeaker")), 1)
          ]),
          _: 1
        }))
      ]),
      _: 3
    }, 8, ["open", "items", "item-key", "is-current"]));
  }
}), VP = /* @__PURE__ */ ne(FP, [["__scopeId", "data-v-68980c2e"]]), qP = {
  contenteditable: "false",
  class: "turn-header"
}, UP = /* @__PURE__ */ $({
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
    const e = n, t = ze(), r = E(() => {
      const a = e.node.attrs.speakerId;
      return a ? t.speakers.all.get(a) : void 0;
    }), i = E(() => r.value?.color ?? "transparent"), s = E(
      () => t.capabilities.value.speakers === "edit"
    ), o = E(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: a, endTime: l } = e.node.attrs;
      if (a == null || l == null) return !1;
      const c = t.audio.currentTime.value;
      return c >= a && c <= l;
    });
    return (a, l) => (T(), R(k(RT), {
      as: "section",
      class: ht(["turn", { "turn--active": o.value }]),
      style: Nn({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: N(() => [
        U("div", qP, [
          s.value ? (T(), R(VP, {
            key: 0,
            "turn-id": n.node.attrs.id,
            "current-speaker-id": n.node.attrs.speakerId
          }, {
            default: N(() => [
              q(oa, {
                speaker: r.value,
                "start-time": n.node.attrs.startTime,
                language: n.node.attrs.language
              }, null, 8, ["speaker", "start-time", "language"])
            ]),
            _: 1
          }, 8, ["turn-id", "current-speaker-id"])) : (T(), R(oa, {
            key: 1,
            speaker: r.value,
            "start-time": n.node.attrs.startTime,
            language: n.node.attrs.language
          }, null, 8, ["speaker", "start-time", "language"]))
        ]),
        q(k(PT), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), WP = /* @__PURE__ */ ne(UP, [["__scopeId", "data-v-b54c3232"]]), _g = Jl.create({
  name: "turn",
  group: "block",
  content: "inline*",
  addAttributes() {
    return {
      id: { default: null },
      speakerId: { default: null },
      startTime: { default: void 0 },
      endTime: { default: void 0 },
      startDate: { default: void 0 },
      endDate: { default: void 0 },
      language: { default: "" }
    };
  },
  parseHTML() {
    return [{ tag: 'section[data-type="turn"]' }];
  },
  renderHTML({ HTMLAttributes: n }) {
    return [
      "section",
      jp(n, { "data-type": "turn" }),
      0
    ];
  },
  addKeyboardShortcuts() {
    const n = Yh((e) => e.type.name !== "turn" ? null : {
      type: e.type,
      attrs: {
        ...e.attrs,
        id: crypto.randomUUID(),
        startTime: void 0,
        endTime: void 0
      }
    });
    return {
      Enter: ({ editor: e }) => n(e.state, e.view.dispatch)
    };
  },
  addNodeView() {
    return $T(WP);
  }
}), jP = new nt("storeSync"), HP = rt.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new Ie({
        key: jP,
        appendTransaction(t, r, i) {
          if (r.doc.eq(i.doc)) return null;
          if (!t.some(
            (a) => a.getMeta(se)
          )) {
            const a = XP(i);
            if (a) return a;
          }
          const o = e();
          return o && KP(i.doc, r.doc, o, n), null;
        }
      })
    ];
  }
});
function KP(n, e, t, r) {
  const i = t.id, s = /* @__PURE__ */ new Map();
  e.forEach((l) => {
    l.type.name === "turn" && s.set(l.attrs.id, l);
  });
  const o = new Map(
    t.turns.value.map((l) => [l.id, l])
  ), a = /* @__PURE__ */ new Set();
  n.forEach((l) => {
    if (l.type.name !== "turn") return;
    const c = l.attrs.id;
    a.add(c);
    const u = s.get(c), d = o.get(c);
    if (u === l && d) return;
    const f = JP(l);
    if (!d) {
      t.updateOrCreateTurnSilent(f), r.emit("turn:add", { turn: f, translationId: i });
      return;
    }
    const h = d.text ?? d.words.map((m) => m.text).join(" "), p = f.text === h ? { ...f, words: d.words } : f;
    GP(d, p) && t.updateTurn(c, p);
  });
  for (const [l] of o)
    a.has(l) || t.removeTurn(l);
}
function JP(n) {
  return {
    id: n.attrs.id,
    speakerId: n.attrs.speakerId ?? null,
    text: n.textContent || null,
    words: [],
    startTime: n.attrs.startTime,
    endTime: n.attrs.endTime,
    startDate: n.attrs.startDate,
    endDate: n.attrs.endDate,
    language: n.attrs.language ?? ""
  };
}
function XP(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  if (n.doc.forEach((i, s) => {
    if (i.type.name !== "turn") return;
    const o = i.attrs.id;
    o && (e.has(o) ? t.push({ pos: s, attrs: i.attrs }) : e.add(o));
  }), t.length === 0) return null;
  const r = n.tr;
  for (const { pos: i, attrs: s } of t)
    r.setNodeMarkup(i, void 0, { ...s, id: crypto.randomUUID() });
  return r.setMeta("addToHistory", !1), r;
}
function GP(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const Ui = new nt("wordHighlight"), YP = rt.create({
  name: "wordHighlight",
  addProseMirrorPlugins() {
    const { core: n } = this.options, e = this.editor;
    function t() {
      const i = n.audio?.activeWordId.value;
      if (!i) return le.empty;
      const s = n.activeChannel.value?.activeTranslation.value;
      if (!s) return le.empty;
      const o = e.state.doc;
      let a = le.empty;
      return o.forEach((l, c) => {
        if (l.type.name !== "turn") return;
        const u = s.turns.value.find((h) => h.id === l.attrs.id);
        if (!u) return;
        const d = l.textContent;
        let f = 0;
        for (const h of u.words) {
          const p = d.indexOf(h.text, f);
          if (p === -1) break;
          if (h.id === i) {
            const m = c + 1 + p, g = m + h.text.length;
            a = le.create(o, [
              Xe.inline(m, g, {
                class: "word--active",
                "data-word-active": ""
              })
            ]);
            return;
          }
          f = p + h.text.length;
        }
      }), a;
    }
    let r = null;
    return [
      new Ie({
        key: Ui,
        state: {
          init() {
            return le.empty;
          },
          apply(i, s) {
            return i.getMeta(Ui) ? t() : i.docChanged ? s.map(i.mapping, i.doc) : s;
          }
        },
        props: {
          decorations(i) {
            return Ui.getState(i);
          }
        },
        view() {
          return r = Z(
            () => n.audio?.activeWordId.value,
            () => {
              const i = e.state.tr.setMeta(Ui, !0);
              e.view.dispatch(i);
            }
          ), {
            destroy() {
              r?.();
            }
          };
        }
      })
    ];
  }
}), ZP = rt.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      n.setLocalStateField("user", e);
      const t = /* @__PURE__ */ new Map();
      return [
        g_(n, {
          cursorBuilder: (r, i) => QP(t, r, i)
        })
      ];
    }
  }
);
function QP(n, e, t) {
  let r = n.get(t);
  if (!r) {
    r = document.createElement("span"), r.classList.add("collaboration-cursor__caret");
    const o = document.createElement("div");
    o.classList.add("collaboration-cursor__label"), r.appendChild(o), n.set(t, r);
  }
  const i = String(e.color ?? "#999");
  r.style.borderColor = i;
  const s = r.firstElementChild;
  return s.style.backgroundColor = i, s.textContent = String(e.name ?? "Anonymous"), r;
}
function eR(n) {
  return {
    type: "doc",
    content: n.map((e) => tR(e))
  };
}
function tR(n) {
  const e = n.words.length > 0 ? n.words.map((t) => t.text).join(" ") : n.text ?? "";
  return {
    type: "turn",
    attrs: {
      id: n.id,
      speakerId: n.speakerId,
      startTime: n.startTime,
      endTime: n.endTime,
      startDate: n.startDate,
      endDate: n.endDate,
      language: n.language
    },
    content: e ? [{ type: "text", text: e }] : void 0
  };
}
function Pg(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function xR(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(Pg), o = s[0]?.startTime ?? i.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
    return {
      id: i.turn_id,
      speakerId: i.speaker_id || null,
      text: s.length > 0 ? null : i.segment,
      words: s,
      ...o !== void 0 && { startTime: o },
      ...a !== void 0 && { endTime: a },
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
const Rg = "speakers";
function nR(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e ^ n.charCodeAt(t);
  return sr[(e >>> 0) % sr.length];
}
function Ud(n, e, t) {
  return e.color ?? t?.color ?? nR(n);
}
function Wd(n) {
  const { core: e, ydoc: t, translation: r, seedFromCore: i } = n, s = t.getMap(Rg);
  if (i) {
    const d = /* @__PURE__ */ new Set();
    for (const f of r.turns.value)
      f.speakerId && d.add(f.speakerId);
    t.transact(() => {
      for (const f of d) {
        if (s.has(f)) continue;
        const h = e.speakers.all.get(f);
        h && s.set(f, { name: h.name, color: h.color });
      }
    });
  }
  for (const [d, f] of s.entries()) {
    const h = Ud(d, f, e.speakers.all.get(d));
    e.speakers.updateOrCreate({ id: d, name: f.name, color: h });
  }
  const o = (d) => {
    d.changes.keys.forEach((f, h) => {
      if (f.action === "delete")
        e.speakers.delete(h);
      else {
        const p = s.get(h);
        if (!p) return;
        const m = Ud(h, p, e.speakers.all.get(h));
        e.speakers.updateOrCreate({ id: h, name: p.name, color: m });
      }
    });
  };
  s.observe(o);
  const a = (d) => {
    const f = s.get(d.id);
    f && ia(f, d) || s.set(d.id, { name: d.name, color: d.color });
  }, l = e.on("speaker:add", ({ speaker: d }) => a(d)), c = e.on("speaker:update", ({ speaker: d }) => a(d)), u = e.on("speaker:remove", ({ speakerId: d }) => {
    s.delete(d);
  });
  return () => {
    s.unobserve(o), l(), c(), u();
  };
}
function SR(n = {}) {
  const {
    collab: e,
    field: t = "default",
    user: r = { name: "Anonymous", color: "#999999" }
  } = n;
  return {
    name: "transcriptionEditor",
    install(i) {
      const s = Lt(void 0), o = _([]), a = _(!1), l = [], c = [];
      let u = null, d = null;
      const f = {
        tiptapEditor: s,
        get doc() {
          return d;
        },
        get fragment() {
          return d.getXmlFragment(t);
        },
        get speakersMap() {
          return d?.getMap(Rg) ?? null;
        },
        users: o,
        isConnected: a,
        updateUser(g) {
          u?.awareness && (Object.assign(r, g), u.awareness.setLocalStateField("user", r));
        }
      };
      i.transcriptionEditor = f;
      function h() {
        s.value?.destroy(), s.value = void 0, c.forEach((g) => g()), c.length = 0, u && (u.destroy(), u = null), d && (d.destroy(), d = null), a.value = !1, o.value = [];
      }
      function p(g, y) {
        h();
        const b = new oy();
        if (d = b, e) {
          const v = new BP({
            url: e.url,
            name: g,
            token: e.token,
            document: b,
            onSynced() {
              a.value = !0;
            },
            onDisconnect() {
              a.value = !1;
            },
            onAwarenessUpdate({ states: C }) {
              o.value = C.map((M) => ({
                clientId: M.clientId,
                ...M.user
              }));
            },
            onStateless({ payload: C }) {
              rR(C, y);
            }
          });
          u = v;
          const w = Z(a, (C) => {
            C && (w(), c.push(
              Wd({ core: i, ydoc: b, translation: y, seedFromCore: !1 })
            ), Hd(i, n, b, t, s, v.awareness, l));
          }, { immediate: !0 });
          l.push(w);
        } else {
          const v = b.getXmlFragment(t), w = eR(y.turns.value), C = AC([Dg, _g, Bm]);
          d_(C, w, v), a.value = !0, c.push(
            Wd({ core: i, ydoc: b, translation: y, seedFromCore: !0 })
          ), Hd(i, n, b, t, s, null, l);
        }
      }
      const m = Z(
        () => i.activeChannel.value,
        (g) => {
          if (!g) return;
          m();
          const y = E(
            () => i.activeChannel.value.activeTranslation.value
          );
          p(y.value.id, y.value);
          const b = Z(
            () => y.value.id,
            (v) => {
              p(v, y.value);
            }
          );
          l.push(b);
        },
        { immediate: !0 }
      );
      return () => {
        m(), l.forEach((g) => g()), h(), i.transcriptionEditor = void 0;
      };
    }
  };
}
function rR(n, e) {
  let t;
  try {
    t = JSON.parse(n);
  } catch {
    return;
  }
  if (!(!t || t.type !== "timestamps_recalc" || !Array.isArray(t.turns)))
    for (const r of t.turns) {
      if (!r || !r.turn_id || !Array.isArray(r.words)) continue;
      const i = e.turns.value.find((l) => l.id === r.turn_id);
      if (!i) continue;
      const s = r.words.map(Pg), o = jd(
        s.filter((l) => l.text !== "").map((l) => l.text).join(" ")
      ), a = jd(
        i.text ?? i.words.map((l) => l.text).join(" ")
      );
      o === a && e.updateWords(r.turn_id, s);
    }
}
function jd(n) {
  return n.replace(/\s+/g, " ").trim();
}
function Hd(n, e, t, r, i, s, o) {
  const a = E(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    Dg,
    _g,
    Bm,
    T_.configure({
      document: t,
      field: r
    }),
    HP.configure({
      store: n,
      getTranslation: () => a.value
    }),
    YP.configure({ core: n }),
    ...n.pluginExtensions
  ];
  s && l.push(
    ZP.configure({
      awareness: s,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  ), i.value = new DT({
    extensions: l
  });
  const c = n.on("translation:sync", () => {
    console.warn(
      "[transcriptionEditor] translation:sync is not supported while the editor is active"
    );
  }), u = n.on("channel:sync", () => {
    console.warn(
      "[transcriptionEditor] channel:sync is not supported while the editor is active"
    );
  });
  o.push(c, u);
}
function Kd(n) {
  const e = n.words.length > 0;
  return {
    id: n.turnId,
    speakerId: n.speakerId,
    text: e ? null : n.text ?? null,
    words: n.words,
    startTime: n.startTime,
    endTime: n.endTime,
    startDate: n.startDate,
    endDate: n.endDate,
    language: n.language
  };
}
function ra(n, e) {
  return {
    id: n.turnId,
    speakerId: n.speakerId,
    text: e.text,
    words: [],
    startTime: n.startTime,
    endTime: n.endTime,
    startDate: n.startDate,
    endDate: n.endDate,
    language: e.language
  };
}
function CR() {
  return {
    name: "live",
    install(n) {
      const e = Lt(null), t = _(!1);
      t.value = !0;
      function r() {
        e.value = null;
      }
      function i(v, w) {
        if (n.activeChannelId.value !== w) return;
        const C = n.activeChannel.value;
        if (!C) return;
        const M = C.activeTranslation.value;
        if (M.isSource) {
          if (v.text == null) return;
          e.value = v.text;
        } else if (v.translations) {
          const x = v.translations.find(
            (A) => A.translationId === M.id
          );
          e.value = x?.text ?? null;
        } else
          return;
      }
      let s = null;
      function o() {
        s === null && (s = setTimeout(() => {
          s = null, r();
        }, 150));
      }
      function a() {
        s !== null && (clearTimeout(s), s = null);
      }
      function l(v, w) {
        v.hasTurn(w.id) ? v.updateTurn(w.id, w) : v.addTurn(w);
      }
      function c(v, w) {
        v.speakerId && n.speakers.ensure(v.speakerId);
        const C = n.channels.get(w);
        if (!C) {
          f();
          return;
        }
        if (v.text != null && l(
          C.sourceTranslation,
          Kd(v)
        ), v.translations)
          for (const x of v.translations) {
            const A = C.translations.get(x.translationId);
            A && l(
              A,
              ra(v, x)
            );
          }
        n.activeChannel.value?.activeTranslation.value?.isSource && f();
      }
      function u(v, w) {
        d([v], w);
      }
      function d(v, w) {
        const C = n.channels.get(w);
        if (!C) return;
        const M = /* @__PURE__ */ new Set();
        for (const S of v)
          S.speakerId && !M.has(S.speakerId) && (M.add(S.speakerId), n.speakers.ensure(S.speakerId));
        const x = [];
        for (const S of v)
          S.text != null && x.push(Kd(S));
        x.length > 0 && C.sourceTranslation.prependTurns(x);
        const A = /* @__PURE__ */ new Map();
        for (const S of v)
          if (S.translations)
            for (const O of S.translations) {
              let D = A.get(O.translationId);
              D || (D = [], A.set(O.translationId, D)), D.push(ra(S, O));
            }
        for (const [S, O] of A) {
          const D = C.translations.get(S);
          D && D.prependTurns(O);
        }
      }
      function f() {
        a(), r();
      }
      function h(v) {
        const w = n.activeChannel.value;
        if (!w) return;
        const C = w.activeTranslation.value;
        if (!v.final && C.languages.includes(v.language))
          e.value = v.text;
        else if (v.final) {
          const M = w.translations.get(v.language);
          if (M) {
            const x = ra(
              { ...v },
              v
            );
            M === C ? l(M, x) : M.updateOrCreateTurnSilent(x);
          }
          C.languages.includes(v.language) && f();
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
      ), b = n.on("channel:sync", o);
      return n.live = p, () => {
        f(), m(), g(), y(), b(), n.live = void 0;
      };
    }
  };
}
function TR(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = _(n.fontSize ?? 40), r = _(!0), i = _(!1);
      let s;
      const o = [];
      if (n.watermark) {
        const l = n.watermark;
        s = {
          display: _(l.display ?? !1),
          pinned: _(l.pinned ?? !1),
          content: _(l.content ?? ""),
          frequency: _(l.frequency ?? 30),
          duration: _(l.duration ?? 5),
          tokens: _(l.tokens ?? {}),
          readonly: l.readonly ?? !1
        }, o.push(
          Z(
            s.display,
            (c) => e.emit("watermark:display", { display: c })
          ),
          Z(
            s.pinned,
            (c) => e.emit("watermark:pin", { pinned: c })
          )
        );
      }
      const a = {
        fontSize: t,
        isVisible: r,
        isFullscreen: i,
        enterFullscreen() {
          i.value = !0;
        },
        exitFullscreen() {
          i.value = !1;
        },
        watermark: s
      };
      return e.subtitle = a, () => {
        r.value = !1, i.value = !1, o.forEach((l) => l()), e.subtitle = void 0;
      };
    }
  };
}
function iR(n) {
  return {
    id: n.id,
    label: _(n.label),
    description: _(n.description ?? null),
    content: _(n.content ?? ""),
    status: _(n.status ?? "idle"),
    progress: _(n.progress ?? 0),
    phase: _(n.phase ?? null),
    error: _(n.error ?? null),
    lastUpdate: _(n.lastUpdate ?? null)
  };
}
function Jd(n) {
  return !Number.isFinite(n) || n < 0 ? 0 : n > 100 ? 100 : n;
}
function ER() {
  return {
    name: "llmServices",
    install(n) {
      const e = /* @__PURE__ */ new Map(), t = Lt([]), r = _(null);
      function i() {
        t.value = Array.from(e.values());
      }
      function s(b) {
        return e.get(b);
      }
      function o(b) {
        const v = e.get(b.id);
        if (v)
          return b.label !== void 0 && (v.label.value = b.label), b.description !== void 0 && (v.description.value = b.description), b.content !== void 0 && (v.content.value = b.content), b.status !== void 0 && (v.status.value = b.status), b.progress !== void 0 && (v.progress.value = Jd(b.progress)), b.phase !== void 0 && (v.phase.value = b.phase), b.error !== void 0 && (v.error.value = b.error), b.lastUpdate !== void 0 && (v.lastUpdate.value = b.lastUpdate), v;
        const w = iR(b);
        return e.set(b.id, w), i(), w;
      }
      function a(b) {
        e.delete(b) && (r.value === b && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function l() {
        e.size === 0 && r.value === null || (e.clear(), r.value !== null && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function c(b) {
        return e.get(b);
      }
      function u(b) {
        b !== null && !e.has(b) || r.value !== b && (r.value = b, n.emit("llmService:active", { id: b }));
      }
      function d(b, v) {
        const w = s(b);
        w && (w.label.value = v);
      }
      function f(b, v) {
        const w = s(b);
        w && (w.status.value = v, v !== "error" && (w.error.value = null), v === "complete" && (w.progress.value = 100, w.phase.value = null));
      }
      function h(b, v, w) {
        const C = s(b);
        C && (C.progress.value = Jd(v), w !== void 0 && (C.phase.value = w));
      }
      function p(b, v, w) {
        const C = s(b);
        C && (C.content.value = v, C.lastUpdate.value = w ?? Date.now());
      }
      function m(b, v) {
        const w = s(b);
        w && (w.error.value = v, v && (w.status.value = "error"));
      }
      const g = E(() => {
        const b = r.value;
        return b === null ? null : e.get(b) ?? null;
      }), y = {
        list: t,
        activeId: r,
        active: g,
        setActive: u,
        register: o,
        unregister: a,
        clear: l,
        get: c,
        setLabel: d,
        setStatus: f,
        setProgress: h,
        setContent: p,
        setError: m
      };
      return n.llmServices = y, () => {
        e.clear(), t.value = [], r.value = null, n.llmServices = void 0;
      };
    }
  };
}
let Ig = 0;
function sR(n) {
  return {
    id: `w_${Ig++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function MR(n) {
  Ig = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = s.words.map(sR);
    return {
      id: `turn_${o}`,
      speakerId: s.speaker ?? null,
      text: a.length > 0 ? null : s.text,
      words: a,
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
  Je as DocumentValidationError,
  vR as Layout,
  bR as createAudioPlugin,
  lR as createCore,
  ER as createLLMServicesPlugin,
  CR as createLivePlugin,
  TR as createSubtitlePlugin,
  SR as createTranscriptionEditorPlugin,
  xR as mapApiDocument,
  MR as mapWhisperXDocument,
  cR as provideCore,
  uR as provideI18n,
  ze as useCore,
  xy as validateEditorDocument
};
