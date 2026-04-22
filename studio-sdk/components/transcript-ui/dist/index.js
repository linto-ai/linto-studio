import * as Jl from "vue";
import { shallowReactive as Ts, shallowRef as nn, ref as D, computed as A, inject as fi, provide as Tn, h as je, defineComponent as B, openBlock as M, createElementBlock as U, renderSlot as j, createBlock as L, resolveDynamicComponent as Fa, normalizeClass as $t, normalizeStyle as an, useSlots as qm, createCommentVNode as Y, createTextVNode as we, toDisplayString as G, createElementVNode as K, createVNode as $, withCtx as P, unref as y, watchEffect as Ge, onBeforeUnmount as zt, Fragment as Ke, customRef as md, toValue as Fe, getCurrentScope as gd, onScopeDispose as yd, effectScope as vd, getCurrentInstance as ln, readonly as Wm, watch as te, nextTick as ye, onMounted as me, toHandlerKey as Um, camelize as bd, toRef as Ni, onUnmounted as hr, toRefs as pr, Comment as Hm, mergeProps as le, cloneVNode as jm, reactive as za, Teleport as wd, normalizeProps as Va, guardReactiveProps as qa, markRaw as Wa, renderList as cn, withKeys as Xi, withModifiers as bt, watchPostEffect as Sd, shallowReadonly as zn, mergeDefaults as Km, withMemo as Jm, createStaticVNode as Xm, render as Xl, useTemplateRef as qr, isMemoSame as Ym, Transition as Ua, useId as Gm, createSlots as Yl, useModel as Qm, withDirectives as Zm, vShow as eg } from "vue";
import * as W from "yjs";
import { UndoManager as tg, Item as ng, ContentType as rg, Text as ig, XmlElement as sg, Doc as og } from "yjs";
function ag() {
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
const Gl = [
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
function lg(n, e, t) {
  const r = Gl[n.size % Gl.length];
  return { id: e, name: t, color: r };
}
function cg(n, e, t) {
  return !e || n.has(e) ? null : lg(n, e, t ?? e);
}
function Jo(n, e) {
  return n.name === e.name && n.color === e.color;
}
function ug(n) {
  const e = Ts(/* @__PURE__ */ new Map());
  function t(a, l) {
    const c = cg(e, a, l);
    c && (e.set(c.id, c), n("speaker:add", { speaker: c }));
  }
  function r(a, l) {
    const c = e.get(a);
    if (!c) return;
    const u = { ...c, ...l };
    Jo(c, u) || (e.set(a, u), n("speaker:update", { speaker: u }));
  }
  function i(a) {
    const l = e.get(a.id);
    if (l) {
      if (Jo(l, a)) return;
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
function dg(n, e) {
  return [...n, e];
}
function fg(n, e) {
  return [...e, ...n];
}
function Ha(n, e) {
  return n.findIndex((t) => t.id === e);
}
function hg(n, e, t) {
  const r = Ha(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function pg(n, e) {
  const t = Ha(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function mg(n, e, t) {
  const r = Ha(n, e);
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
function Xo(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function gg(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = nn(n.turns), l = /* @__PURE__ */ new Map();
  function c() {
    l.clear();
    const b = a.value;
    for (let w = 0; w < b.length; w++)
      l.set(b[w].id, w);
  }
  c();
  function u(b) {
    t(b.speakerId), l.set(b.id, a.value.length), a.value = dg(a.value, b), e("turn:add", { turn: b, translationId: r });
  }
  function d(b, w) {
    const x = hg(a.value, b, w);
    x && (a.value = x.turns, e("turn:update", { turn: x.updated, translationId: r }));
  }
  function h(b) {
    const w = pg(a.value, b);
    w && (a.value = w, c(), e("turn:remove", { turnId: b, translationId: r }));
  }
  function f(b, w) {
    const x = mg(a.value, b, w);
    x && (a.value = x.turns, e("turn:update", { turn: x.updated, translationId: r }));
  }
  function p(b) {
    Xo(b, t), a.value = fg(a.value, b), c();
  }
  function m(b) {
    Xo(b, t), a.value = b, c(), e("translation:sync", { translationId: r });
  }
  function g(b) {
    a.value = b, c();
  }
  function v(b) {
    const w = l.get(b.id);
    w !== void 0 ? a.value[w] = b : (l.set(b.id, a.value.length), a.value.push(b));
  }
  function S(b) {
    return l.has(b);
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: a, addTurn: u, prependTurns: p, updateTurn: d, removeTurn: h, updateWords: f, setTurns: m, replaceTurns: g, updateOrCreateTurnSilent: v, hasTurn: S };
}
function Ql(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, a = Ts(/* @__PURE__ */ new Map());
  let l;
  for (const m of n.translations) {
    const g = gg(m, e, t);
    a.set(m.id, g), m.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = D(null), u = D(!1), d = D(!0), h = A(() => c.value ? a.get(c.value) ?? l : l);
  function f(m) {
    const g = m === l.id ? null : m;
    g !== c.value && (c.value = g, e("translation:change", { translationId: h.value.id }));
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
    activeTranslation: h,
    isLoadingHistory: u,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: p
  };
}
function yg(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function vg(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Ar(n, e, t = "*") {
  if (n === "*") return t;
  const r = n.split("-")[0] ?? n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(r) ?? r;
  } catch {
    return n;
  }
}
function bg(n, e, t, r = "*") {
  return [...n].sort((i, s) => {
    if (i.isSource) return -1;
    if (s.isSource) return 1;
    const o = Ar(
      i.languages[0] ?? "",
      e,
      r
    ), a = Ar(
      s.languages[0] ?? "",
      e,
      r
    );
    return o.localeCompare(a, e);
  }).map((i) => ({
    value: i.id,
    label: i.languages.map((s) => Ar(s, e, r)).join(", "),
    ...i.isSource && { originalLabel: t }
  }));
}
function wg(n, e = 250) {
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
function Wr(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
class Ue extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Sg(n) {
  if (n == null || typeof n != "object")
    throw new Ue("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new Ue("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Ue("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Ue("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new Ue(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Ue(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Ue(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Ue(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Ue(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Ue(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Ue(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Ue(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Ue(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Ue(`${a}.turns`, "must be an array");
    }
  }
}
function kg(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function ja(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
const xg = 1;
function kd(n, e) {
  if (!ja(n)) return null;
  for (const t of n)
    if (t.startTime - xg <= e && e <= t.endTime)
      return t.id;
  return null;
}
function cD(n = {}) {
  const e = D(""), t = D(n.activeChannelId ?? ""), r = D(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: a } = ag(), l = ug(o), c = l, u = Ts(/* @__PURE__ */ new Map()), d = A(
    () => u.get(t.value) ?? [...u.values()][0]
  );
  function h(C, k) {
    return i(C, (T) => {
      const E = d.value;
      E && T.translationId === E.activeTranslation.value.id && k(T);
    });
  }
  function f(C) {
    e.value = C.title, l.clear(), u.clear();
    for (const k of yg(C))
      c.ensure(k.id, k.name);
    for (const k of C.channels)
      u.set(k.id, Ql(k, o, c.ensure));
    u.size > 0 && !u.has(t.value) && (t.value = u.keys().next().value);
  }
  function p(C) {
    Sg(C), f(C);
  }
  function m(C) {
    C !== t.value && (t.value = C, o("channel:change", { channelId: C }));
  }
  function g(C, k) {
    if (u.has(C)) {
      for (const T of k.translations)
        Xo(T.turns, c.ensure);
      u.set(C, Ql(k, o, c.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const v = [], S = [];
  function b(C) {
    C.tiptapExtensions && S.push(...C.tiptapExtensions);
    const k = C.install(x);
    k && v.push(k);
  }
  function w() {
    o("destroy", void 0), v.forEach((C) => C()), v.length = 0, a();
  }
  n.document && f(n.document);
  const x = {
    title: e,
    activeChannelId: t,
    capabilities: r,
    pluginExtensions: S,
    speakers: c,
    channels: u,
    activeChannel: d,
    onActiveTranslation: h,
    setDocument: p,
    setActiveChannel: m,
    setChannel: g,
    on: i,
    off: s,
    emit: o,
    use: b,
    destroy: w
  };
  return x;
}
const xd = /* @__PURE__ */ Symbol("core");
function uD(n) {
  Tn(xd, n);
}
function Et() {
  const n = fi(xd);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const Cg = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Zl = (n) => n === "";
const Tg = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const ec = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Eg = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Mg = (n) => {
  const e = Eg(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var wr = {
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
const Ag = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = wr.width,
  color: a = wr.stroke,
  ...l
}, { slots: c }) => je(
  "svg",
  {
    ...wr,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": Zl(t) || Zl(r) || t === !0 || r === !0 ? Number(i || s || wr["stroke-width"]) * 24 / Number(o) : i || s || wr["stroke-width"],
    class: Tg(
      "lucide",
      l.class,
      ...n ? [`lucide-${ec(Mg(n))}-icon`, `lucide-${ec(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Cg(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => je(...u)), ...c.default ? [c.default()] : []]
);
const Pe = (n, e) => (t, { slots: r, attrs: i }) => je(
  Ag,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const Cd = Pe("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Es = Pe("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Td = Pe("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Og = Pe("clipboard-list", [
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
const Dg = Pe("clipboard-type", [
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
const Pg = Pe("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Yo = Pe("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const tc = Pe("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ed = Pe("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Md = Pe("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Ad = Pe("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Od = Pe("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Dd = Pe("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Pd = Pe("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const _d = Pe("volume-2", [
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
const Id = Pe("volume-x", [
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
const Ka = Pe("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), _g = ["aria-label"], Ig = /* @__PURE__ */ B({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (M(), U("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      j(e.$slots, "default", {}, void 0, !0)
    ], 8, _g));
  }
}), fe = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, nc = /* @__PURE__ */ fe(Ig, [["__scopeId", "data-v-732d4c24"]]), Ng = {
  "arrow-down": Cd,
  check: Es,
  "chevron-down": Td,
  "clipboard-list": Og,
  "clipboard-type": Dg,
  copy: Pg,
  download: Yo,
  pause: Ed,
  play: Md,
  settings: Ad,
  "skip-back": Od,
  "skip-forward": Dd,
  users: Pd,
  volume: _d,
  "volume-mute": Id,
  x: Ka,
  "circle-notch": tc,
  spinner: tc
};
function Go(n) {
  if (n)
    return Ng[n];
}
const Nd = {
  sm: 16,
  md: 20,
  lg: 24
}, Rg = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, $g = /* @__PURE__ */ B({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = A(() => Go(e.name)), r = A(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (M(), L(Fa(t.value), {
      key: 0,
      style: an(r.value),
      class: $t(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (M(), U("span", Rg, "?"));
  }
}), Ri = /* @__PURE__ */ fe($g, [["__scopeId", "data-v-210c7f09"]]), Lg = ["type", "disabled", "aria-disabled", "aria-label"], Bg = {
  key: 3,
  class: "editor-btn__label"
}, Fg = /* @__PURE__ */ B({
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
    const e = n, t = qm(), r = A(() => !!Go(e.icon)), i = A(() => !!Go(e.iconRight)), s = A(() => Nd[e.size]), o = A(() => e.disabled || e.loading), a = A(() => !!e.label || !!t.default), l = A(
      () => e.loading || r.value || !!t.icon
    ), c = A(() => l.value && !a.value), u = A(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      c.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, h) => (M(), U("button", {
      type: n.type,
      class: $t(u.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (M(), L(Ri, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (M(), L(Ri, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? j(d.$slots, "icon", { key: 2 }, void 0, !0) : Y("", !0),
      a.value ? (M(), U("span", Bg, [
        j(d.$slots, "default", {}, () => [
          we(G(n.label), 1)
        ], !0)
      ])) : Y("", !0),
      i.value ? (M(), L(Ri, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? j(d.$slots, "icon-right", { key: 5 }, void 0, !0) : Y("", !0)
    ], 10, Lg));
  }
}), ot = /* @__PURE__ */ fe(Fg, [["__scopeId", "data-v-2212567e"]]), Rd = {
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
  "selection.deselect": "Désélectionner {name}"
}, zg = {
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
  "selection.deselect": "Deselect {name}"
}, rc = { fr: Rd, en: zg }, $d = /* @__PURE__ */ Symbol("i18n");
function dD(n) {
  const e = A(() => {
    const r = rc[n.value] ?? rc.fr;
    return (i) => r[i] ?? i;
  }), t = {
    t: (r) => e.value(r),
    locale: n
  };
  return Tn($d, t), t;
}
function ut() {
  const n = fi($d);
  if (n) return n;
  const e = A(() => "fr");
  return {
    t: (t) => Rd[t] ?? t,
    locale: e
  };
}
const Vg = { class: "editor-header" }, qg = { class: "header-left" }, Wg = { class: "document-title" }, Ug = { class: "badges" }, Hg = ["datetime"], jg = { class: "header-right" }, Kg = /* @__PURE__ */ B({
  __name: "Header",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = ut(), i = A(() => Ar(e.language, r.value, t("language.wildcard"))), s = A(() => Wr(e.duration)), o = A(() => e.title.replace(/-/g, " "));
    return (a, l) => (M(), U("header", Vg, [
      K("div", qg, [
        K("h1", Wg, G(o.value), 1),
        K("div", Ug, [
          $(nc, null, {
            default: P(() => [
              we(G(i.value), 1)
            ]),
            _: 1
          }),
          $(nc, null, {
            default: P(() => [
              K("time", {
                datetime: `PT${n.duration}S`
              }, G(s.value), 9, Hg)
            ]),
            _: 1
          })
        ])
      ]),
      K("div", jg, [
        n.isMobile ? (M(), L(ot, {
          key: 0,
          variant: "transparent",
          "aria-label": y(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: P(() => [
            $(y(Pd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : Y("", !0),
        n.isMobile ? (M(), L(ot, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": y(t)("header.export")
        }, {
          icon: P(() => [
            $(y(Yo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (M(), L(ot, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: P(() => [
            $(y(Yo), { size: 16 })
          ]),
          default: P(() => [
            we(" " + G(y(t)("header.export")), 1)
          ]),
          _: 1
        })),
        $(ot, {
          variant: "transparent",
          disabled: "",
          "aria-label": y(t)("header.settings")
        }, {
          icon: P(() => [
            $(y(Ad), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Jg = /* @__PURE__ */ fe(Kg, [["__scopeId", "data-v-4da31078"]]), lo = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Xg = 70, Yg = 1e3 / 60, Gg = 350;
let $i = !1, ic = !1;
function Qg() {
  ic || typeof document > "u" || (document.addEventListener("mousedown", () => {
    $i = !0;
  }), document.addEventListener("mouseup", () => {
    $i = !1;
  }), document.addEventListener("click", () => {
    $i = !1;
  }), ic = !0);
}
const co = /* @__PURE__ */ new Map();
function uo(...n) {
  const e = {
    damping: lo.damping,
    stiffness: lo.stiffness,
    mass: lo.mass
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
  return co.has(r) || co.set(r, Object.freeze({ ...e })), t ? "instant" : co.get(r);
}
function Zg(n = {}) {
  Qg();
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
    for (const N of t) N(O);
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
    const O = r.scrollElement, N = r.contentElement;
    return !O || !N ? 0 : O.scrollHeight - 1 - O.clientHeight;
  }
  let c;
  function u() {
    const O = r.scrollElement, N = r.contentElement;
    if (!O || !N)
      return 0;
    const R = l();
    if (!e.targetScrollTop)
      return R;
    if (c?.targetScrollTop === R)
      return c.calculatedScrollTop;
    const q = Math.max(
      Math.min(
        e.targetScrollTop(R, {
          scrollElement: O,
          contentElement: N
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
  function h() {
    return d() <= Xg;
  }
  function f(O) {
    r.isAtBottom = O, i();
  }
  function p(O) {
    r.escapedFromLock = O, i();
  }
  function m(O) {
    r.isNearBottom = O, i();
  }
  function g() {
    if (!$i || typeof window > "u")
      return !1;
    const O = window.getSelection?.();
    if (!O || !O.rangeCount)
      return !1;
    const N = O.getRangeAt(0), R = r.scrollElement;
    if (!R)
      return !1;
    const q = N.commonAncestorContainer;
    return !!(q && (R.contains(q) || q.contains(R)));
  }
  const v = (O) => {
    if (O.target !== r.scrollElement)
      return;
    const N = o(), R = r.ignoreScrollToTop;
    let q = r.lastScrollTop ?? N;
    r.lastScrollTop = N, r.ignoreScrollToTop = void 0, R && R > N && (q = R), m(h()), setTimeout(() => {
      if (r.resizeDifference || N === R)
        return;
      if (g()) {
        p(!0), f(!1);
        return;
      }
      const I = N > q, F = N < q;
      if (r.animation?.ignoreEscapes) {
        a(q);
        return;
      }
      F && (p(!0), f(!1)), I && p(!1), !r.escapedFromLock && h() && f(!0);
    }, 1);
  }, S = (O) => {
    const N = r.scrollElement;
    if (!N)
      return;
    let R = O.target;
    for (; R && !["scroll", "auto"].includes(getComputedStyle(R).overflow); ) {
      if (!R.parentElement)
        return;
      R = R.parentElement;
    }
    R === N && O.deltaY < 0 && N.scrollHeight > N.clientHeight && !r.animation?.ignoreEscapes && (p(!0), f(!1));
  };
  function b(O, N) {
    w(), r.scrollElement = O, r.contentElement = N, getComputedStyle(O).overflow === "visible" && (O.style.overflow = "auto"), O.addEventListener("scroll", v, { passive: !0 }), O.addEventListener("wheel", S, { passive: !0 });
    let R;
    r.resizeObserver = new ResizeObserver((q) => {
      const I = q[0];
      if (!I)
        return;
      const { height: F } = I.contentRect, re = F - (R ?? F);
      if (r.resizeDifference = re, o() > l() && a(l()), m(h()), re >= 0) {
        const Q = uo(
          e,
          R ? e.resize : e.initial
        );
        k({
          animation: Q,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Q === "instant" ? void 0 : Gg
        });
      } else
        h() && (p(!1), f(!0));
      R = F, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === re && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(N);
  }
  function w() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", v), r.scrollElement.removeEventListener("wheel", S)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function x() {
    w(), t.clear();
  }
  function C(O) {
    e = { ...e, ...O };
  }
  function k(O = {}) {
    const N = typeof O == "string" ? { animation: O } : O;
    N.preserveScrollPosition || f(!0);
    const R = Date.now() + (Number(N.wait) || 0), q = uo(e, N.animation), { ignoreEscapes: I = !1 } = N;
    let F, re = u();
    N.duration instanceof Promise ? N.duration.finally(() => {
      F = Date.now();
    }) : F = R + (N.duration ?? 0);
    const Q = async () => {
      const ie = new Promise((he) => {
        if (typeof requestAnimationFrame > "u") {
          he(!1);
          return;
        }
        requestAnimationFrame(() => he(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const he = o(), We = typeof performance < "u" ? performance.now() : Date.now(), Bn = (We - (r.lastTick ?? We)) / Yg;
        if (r.animation ||= { behavior: q, promise: ie, ignoreEscapes: I }, r.animation.behavior === q && (r.lastTick = We), g() || R > Date.now())
          return Q();
        if (he < Math.min(re, u())) {
          if (r.animation?.behavior === q) {
            if (q === "instant")
              return a(u()), Q();
            const dt = q;
            r.velocity = (dt.damping * r.velocity + dt.stiffness * d()) / dt.mass, r.accumulated += r.velocity * Bn;
            const Fn = o();
            a(Fn + r.accumulated), o() !== Fn && (r.accumulated = 0);
          }
          return Q();
        }
        return F > Date.now() ? (re = u(), Q()) : (r.animation = void 0, o() < u() ? k({
          animation: uo(e, e.resize),
          ignoreEscapes: I,
          duration: Math.max(0, F - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ie.then((he) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), he));
    };
    return N.wait !== !0 && (r.animation = void 0), r.animation?.behavior === q ? r.animation.promise : Q();
  }
  const T = () => {
    p(!0), f(!1);
  };
  function E(O) {
    return t.add(O), () => t.delete(O);
  }
  return {
    attach: b,
    detach: w,
    destroy: x,
    setOptions: C,
    getState: s,
    onChange: E,
    scrollToBottom: k,
    stopScroll: T
  };
}
function ey(n = {}) {
  const e = D(null), t = D(null), r = D(n.initial !== !1), i = D(!1), s = D(!1), o = Zg(n);
  let a = null;
  return Ge((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), zt(() => {
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
const ty = /* @__PURE__ */ B({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (M(), U("span", {
      class: "speaker-indicator",
      style: an({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Ld = /* @__PURE__ */ fe(ty, [["__scopeId", "data-v-9bffeda8"]]), ny = { class: "speaker-label" }, ry = {
  key: 1,
  class: "speaker-name"
}, iy = ["datetime"], sy = { class: "lang" }, oy = /* @__PURE__ */ B({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = ut(), i = A(
      () => Ar(e.language, r.value, t("language.wildcard"))
    ), s = A(
      () => e.startTime != null ? Wr(e.startTime) : null
    ), o = A(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = A(() => e.speaker?.color ?? "transparent");
    return (l, c) => (M(), U("div", ny, [
      n.speaker ? (M(), L(Ld, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : Y("", !0),
      n.speaker ? (M(), U("span", ry, G(n.speaker.name), 1)) : Y("", !0),
      s.value ? (M(), U("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, G(s.value), 9, iy)) : Y("", !0),
      K("span", sy, G(i.value), 1)
    ]));
  }
}), Bd = /* @__PURE__ */ fe(oy, [["__scopeId", "data-v-98e1fa13"]]);
function sc(n) {
  return typeof n == "string" ? `'${n}'` : new ay().serialize(n);
}
const ay = /* @__PURE__ */ (function() {
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
function En(n, e) {
  return n === e || sc(n) === sc(e);
}
function ly(n, e, t) {
  const r = n.findIndex((a) => En(a, e)), i = n.findIndex((a) => En(a, t));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((a, l) => a - l);
  return n.slice(s, o + 1);
}
function oc(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function rt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = fi(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Tn(r, o), o)];
}
function Je() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Ms(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function tr(n) {
  return n == null;
}
function ac(n, e) {
  return tr(n) ? !1 : Array.isArray(n) ? n.some((t) => En(t, e)) : En(n, e);
}
function Ja(n) {
  return n ? n.flatMap((e) => e.type === Ke ? Ja(e.children) : [e]) : [];
}
const [As] = rt("ConfigProvider");
function cy(n, e) {
  var t;
  const r = nn();
  return Ge(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Wm(r);
}
function Os(n, e) {
  return gd() ? (yd(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function fo() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const o = () => e(s);
      return Os(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((o) => o(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function uy(n) {
  let e = !1, t;
  const r = vd(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Vt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const dy = (n) => typeof n < "u", fy = Object.prototype.toString, hy = (n) => fy.call(n) === "[object Object]", lc = /* @__PURE__ */ py();
function py() {
  var n, e, t;
  return Vt && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function ho(n) {
  return Array.isArray(n) ? n : [n];
}
function my(n) {
  return ln();
}
// @__NO_SIDE_EFFECTS__
function gy(n) {
  if (!Vt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = vd(!0), t = r.run(() => n(...s))), Os(i), t));
}
function Fd(n, e = 1e4) {
  return md((t, r) => {
    let i = Fe(n), s;
    const o = () => setTimeout(() => {
      i = Fe(n), r();
    }, Fe(e));
    return Os(() => {
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
function yy(n, e) {
  my() && zt(n, e);
}
function vy(n, e, t) {
  return te(n, e, {
    ...t,
    immediate: !0
  });
}
const Ds = Vt ? window : void 0;
function kt(n) {
  var e;
  const t = Fe(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function zd(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = A(() => {
    const r = ho(Fe(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return vy(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => kt(s))) !== null && r !== void 0 ? r : [Ds].filter((s) => s != null),
      ho(Fe(t.value ? n[1] : n[0])),
      ho(y(t.value ? n[2] : n[1])),
      Fe(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = hy(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((h) => s.map((f) => e(d, h, f, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Vd() {
  const n = nn(!1), e = ln();
  return e && me(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function by(n) {
  const e = /* @__PURE__ */ Vd();
  return A(() => (e.value, !!n()));
}
function wy(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Sy(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = Ds, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = wy(e);
  return zd(i, s, (u) => {
    u.repeat && Fe(a) || l(u) && t(u);
  }, o);
}
function ky(n) {
  return JSON.parse(JSON.stringify(n));
}
function xy(n, e, t = {}) {
  const { window: r = Ds, ...i } = t;
  let s;
  const o = /* @__PURE__ */ by(() => r && "ResizeObserver" in r), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = te(A(() => {
    const u = Fe(n);
    return Array.isArray(u) ? u.map((d) => kt(d)) : [kt(u)];
  }), (u) => {
    if (a(), o.value && r) {
      s = new ResizeObserver(e);
      for (const d of u) d && s.observe(d, i);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), c = () => {
    a(), l();
  };
  return Os(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function Ur(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, h = ln(), f = t || h?.emit || (h == null || (i = h.$emit) === null || i === void 0 ? void 0 : i.bind(h)) || (h == null || (s = h.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(h?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (S) => o ? typeof o == "function" ? o(S) : ky(S) : S, g = () => dy(n[e]) ? m(n[e]) : u, v = (S) => {
    d ? d(S) && f(p, S) : f(p, S);
  };
  if (a) {
    const S = D(g());
    let b = !1;
    return te(() => n[e], (w) => {
      b || (b = !0, S.value = m(w), ye(() => b = !1));
    }), te(S, (w) => {
      !b && (w !== n[e] || c) && v(w);
    }, { deep: c }), S;
  } else return A({
    get() {
      return g();
    },
    set(S) {
      v(S);
    }
  });
}
function po(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Qo(n, e, t = ".", r) {
  if (!po(e))
    return Qo(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : po(o) && po(i[s]) ? i[s] = Qo(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function Cy(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => Qo(t, r, "", n), {})
  );
}
const Ty = Cy(), Ey = /* @__PURE__ */ gy(() => {
  const n = D(/* @__PURE__ */ new Map()), e = D(), t = A(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), r = As({ scrollBody: D(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", lc && i?.(), e.value = void 0;
  };
  return te(t, (o, a) => {
    if (!Vt) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Ty({
      padding: r.scrollBody.value.padding === !0 ? l : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? l : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), lc && (i = zd(document, "touchmove", (d) => My(d), { passive: !1 })), ye(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function qd(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Ey();
  t.value.set(e, n ?? !1);
  const r = A({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return yy(() => {
    t.value.delete(e);
  }), r;
}
function Wd(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Wd(t);
  }
}
function My(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && Wd(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Ud(n) {
  const e = As({ dir: D("ltr") });
  return A(() => n?.value || e.dir?.value || "ltr");
}
function Ps(n) {
  const e = ln(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[Um(bd(i))] = (...s) => n(i, ...s);
  }), r;
}
let mo = 0;
function Ay() {
  Ge((n) => {
    if (!Vt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? cc()), document.body.insertAdjacentElement("beforeend", e[1] ?? cc()), mo++, n(() => {
      mo === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), mo--;
    });
  });
}
function cc() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Xa(n) {
  return A(() => Fe(n) ? !!kt(n)?.closest("form") : !0);
}
function ge() {
  const n = ln(), e = D(), t = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : kt(e)), r = Object.assign({}, n.exposed), i = {};
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
function Ya(n) {
  const e = ln(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Ni(n);
  return A(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[bd(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function Oy(n, e) {
  const t = Ya(n), r = e ? Ps(e) : {};
  return A(() => ({
    ...t.value,
    ...r
  }));
}
var Dy = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, Vn = /* @__PURE__ */ new WeakMap(), wi = /* @__PURE__ */ new WeakMap(), Si = {}, go = 0, Hd = function(n) {
  return n && (n.host || Hd(n.parentNode));
}, Py = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = Hd(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, _y = function(n, e, t, r) {
  var i = Py(e, Array.isArray(n) ? n : [n]);
  Si[t] || (Si[t] = /* @__PURE__ */ new WeakMap());
  var s = Si[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(h) {
      if (a.has(h))
        u(h);
      else
        try {
          var f = h.getAttribute(r), p = f !== null && f !== "false", m = (Vn.get(h) || 0) + 1, g = (s.get(h) || 0) + 1;
          Vn.set(h, m), s.set(h, g), o.push(h), m === 1 && p && wi.set(h, !0), g === 1 && h.setAttribute(t, "true"), p || h.setAttribute(r, "true");
        } catch (v) {
          console.error("aria-hidden: cannot operate on ", h, v);
        }
    });
  };
  return u(e), a.clear(), go++, function() {
    o.forEach(function(d) {
      var h = Vn.get(d) - 1, f = s.get(d) - 1;
      Vn.set(d, h), s.set(d, f), h || (wi.has(d) || d.removeAttribute(r), wi.delete(d)), f || d.removeAttribute(t);
    }), go--, go || (Vn = /* @__PURE__ */ new WeakMap(), Vn = /* @__PURE__ */ new WeakMap(), wi = /* @__PURE__ */ new WeakMap(), Si = {});
  };
}, Iy = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = Dy(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), _y(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function jd(n) {
  let e;
  te(() => kt(n), (t) => {
    t ? e = Iy(t) : e && e();
  }), hr(() => {
    e && e();
  });
}
let Ny = 0;
function nr(n, e = "reka") {
  if ("useId" in Jl) return `${e}-${Jl.useId?.()}`;
  const t = As({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Ny}`;
}
function Ry() {
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
function $y(n) {
  const e = D(), t = A(() => e.value?.width ?? 0), r = A(() => e.value?.height ?? 0);
  return me(() => {
    const i = kt(n);
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
function Ly(n, e) {
  const t = D(n);
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
function Ga(n) {
  const e = Fd("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Je(), a = s.map((h) => ({
          ...h,
          textValue: h.value?.textValue ?? h.ref.textContent?.trim() ?? ""
        })), l = a.find((h) => h.ref === o), c = a.map((h) => h.textValue), u = Fy(c, e.value, l?.textValue), d = a.find((h) => h.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function By(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function Fy(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = By(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== t ? l : void 0;
}
function zy(n, e) {
  const t = D({}), r = D("none"), i = D(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Ds, { state: l, dispatch: c } = Ly(s, {
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
    if (Vt) {
      const v = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(v);
    }
  };
  te(n, async (g, v) => {
    const S = v !== g;
    if (await ye(), S) {
      const b = r.value, w = ki(e.value);
      g ? (c("MOUNT"), u("enter"), w === "none" && u("after-enter")) : w === "none" || w === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : v && b !== w ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const v = ki(e.value), S = v.includes(CSS.escape(g.animationName)), b = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && S && (u(`after-${b}`), c("ANIMATION_END"), !i.value)) {
      const w = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = w);
      });
    }
    g.target === e.value && v === "none" && c("ANIMATION_END");
  }, h = (g) => {
    g.target === e.value && (r.value = ki(e.value));
  }, f = te(e, (g, v) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", h), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), v?.removeEventListener("animationstart", h), v?.removeEventListener("animationcancel", d), v?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = te(l, () => {
    const g = ki(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return hr(() => {
    f(), p();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function ki(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var _s = B({
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
    const { present: r, forceMount: i } = pr(n), s = D(), { isPresent: o } = zy(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = Ja(a || []);
    const l = ln();
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
    return () => i.value || r.value || o.value ? je(e.default({ present: o.value })[0], { ref: (c) => {
      const u = kt(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const Zo = B({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = Ja(t.default()), i = r.findIndex((l) => l.type !== Hm);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? le(e, s.props) : e, a = jm({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), Vy = [
  "area",
  "img",
  "input"
], de = B({
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
    return typeof r == "string" && Vy.includes(r) ? () => je(r, e) : r !== "template" ? () => je(n.as, e, { default: t.default }) : () => je(Zo, e, { default: t.default });
  }
});
function Yi() {
  const n = D(), e = A(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : kt(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [un, qy] = rt("DialogRoot");
var Wy = /* @__PURE__ */ B({
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
    const t = n, i = /* @__PURE__ */ Ur(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = D(), o = D(), { modal: a } = pr(t);
    return qy({
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
    }), (l, c) => j(l.$slots, "default", {
      open: y(i),
      close: () => i.value = !1
    });
  }
}), Kd = Wy, Uy = /* @__PURE__ */ B({
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
    ge();
    const t = un();
    return (r, i) => (M(), L(y(de), le(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => y(t).onOpenChange(!1))
    }), {
      default: P(() => [j(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Hy = Uy;
const jy = "dismissableLayer.pointerDownOutside", Ky = "dismissableLayer.focusOutside";
function Jd(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function Jy(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1), s = D(() => {
  });
  return Ge((o) => {
    if (!Vt || !Fe(t)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Jd(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let h = function() {
            Ms(jy, n, d);
          };
          const d = { originalEvent: c };
          c.pointerType === "touch" ? (r.removeEventListener("click", s.value), s.value = h, r.addEventListener("click", s.value, { once: !0 })) : h();
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
    Fe(t) && (i.value = !0);
  } };
}
function Xy(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1);
  return Ge((s) => {
    if (!Vt || !Fe(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await ye(), await ye();
      const l = a.target;
      !e.value || !l || Jd(e.value, l) || a.target && !i.value && Ms(Ky, n, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Fe(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Fe(t) && (i.value = !1);
    }
  };
}
const it = za({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Yy = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ge(), o = A(() => s.value?.ownerDocument ?? globalThis.document), a = A(() => it.layersRoot), l = A(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = A(() => it.layersWithOutsidePointerEventsDisabled.size > 0), u = A(() => {
      const f = Array.from(a.value), [p] = [...it.layersWithOutsidePointerEventsDisabled].slice(-1), m = f.indexOf(p);
      return l.value >= m;
    }), d = Jy(async (f) => {
      const p = [...it.branches].some((m) => m?.contains(f.target));
      !u.value || p || (r("pointerDownOutside", f), r("interactOutside", f), await ye(), f.defaultPrevented || r("dismiss"));
    }, s), h = Xy((f) => {
      [...it.branches].some((m) => m?.contains(f.target)) || (r("focusOutside", f), r("interactOutside", f), f.defaultPrevented || r("dismiss"));
    }, s);
    return Sy("Escape", (f) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", f), f.defaultPrevented || r("dismiss"));
    }), Ge((f) => {
      s.value && (t.disableOutsidePointerEvents && (it.layersWithOutsidePointerEventsDisabled.size === 0 && (it.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), it.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), f(() => {
        t.disableOutsidePointerEvents && it.layersWithOutsidePointerEventsDisabled.size === 1 && !tr(it.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = it.originalBodyPointerEvents);
      }));
    }), Ge((f) => {
      f(() => {
        s.value && (a.value.delete(s.value), it.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (f, p) => (M(), L(y(de), {
      ref: y(i),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: an({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: y(h).onFocusCapture,
      onBlurCapture: y(h).onBlurCapture,
      onPointerdownCapture: y(d).onPointerDownCapture
    }, {
      default: P(() => [j(f.$slots, "default")]),
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
}), Xd = Yy;
const Gy = /* @__PURE__ */ uy(() => D([]));
function Qy() {
  const n = Gy();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = uc(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = uc(n.value, e), n.value[0]?.resume();
    }
  };
}
function uc(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const yo = "focusScope.autoFocusOnMount", vo = "focusScope.autoFocusOnUnmount", dc = {
  bubbles: !1,
  cancelable: !0
};
function Zy(n, { select: e = !1 } = {}) {
  const t = Je();
  for (const r of n)
    if (Ut(r, { select: e }), Je() !== t) return !0;
}
function ev(n) {
  const e = Yd(n), t = fc(e, n), r = fc(e.reverse(), n);
  return [t, r];
}
function Yd(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function fc(n, e) {
  for (const t of n) if (!tv(t, { upTo: e })) return t;
}
function tv(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function nv(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Ut(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Je();
    n.focus({ preventScroll: !0 }), n !== t && nv(n) && e && n.select();
  }
}
var rv = /* @__PURE__ */ B({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = ge(), o = D(null), a = Qy(), l = za({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    Ge((u) => {
      if (!Vt) return;
      const d = s.value;
      if (!t.trapped) return;
      function h(g) {
        if (l.paused || !d) return;
        const v = g.target;
        d.contains(v) ? o.value = v : Ut(o.value, { select: !0 });
      }
      function f(g) {
        if (l.paused || !d) return;
        const v = g.relatedTarget;
        v !== null && (d.contains(v) || Ut(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || Ut(d);
      }
      document.addEventListener("focusin", h), document.addEventListener("focusout", f);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", h), document.removeEventListener("focusout", f), m.disconnect();
      });
    }), Ge(async (u) => {
      const d = s.value;
      if (await ye(), !d) return;
      a.add(l);
      const h = Je();
      if (!d.contains(h)) {
        const p = new CustomEvent(yo, dc);
        d.addEventListener(yo, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (Zy(Yd(d), { select: !0 }), Je() === h && Ut(d));
      }
      u(() => {
        d.removeEventListener(yo, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(vo, dc), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(vo, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Ut(h ?? document.body, { select: !0 }), d.removeEventListener(vo, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, h = Je();
      if (d && h) {
        const f = u.currentTarget, [p, m] = ev(f);
        p && m ? !u.shiftKey && h === m ? (u.preventDefault(), t.loop && Ut(p, { select: !0 })) : u.shiftKey && h === p && (u.preventDefault(), t.loop && Ut(m, { select: !0 })) : h === f && u.preventDefault();
      }
    }
    return (u, d) => (M(), L(y(de), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: P(() => [j(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Gd = rv;
function iv(n) {
  return n ? "open" : "closed";
}
function hc(n) {
  const e = Je();
  for (const t of n)
    if (t === e || (t.focus(), Je() !== e)) return;
}
const sv = "DialogTitle", ov = "DialogContent";
function av({ titleName: n = sv, contentName: e = ov, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  me(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(a));
  });
}
var lv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = un(), { forwardRef: s, currentElement: o } = ge();
    return i.titleId ||= nr(void 0, "reka-dialog-title"), i.descriptionId ||= nr(void 0, "reka-dialog-description"), me(() => {
      i.contentElement = o, Je() !== document.body && (i.triggerElement.value = Je());
    }), process.env.NODE_ENV !== "production" && av({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, l) => (M(), L(y(Gd), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: P(() => [$(y(Xd), le({
        id: y(i).contentId,
        ref: y(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": y(i).descriptionId,
        "aria-labelledby": y(i).titleId,
        "data-state": y(iv)(y(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => y(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: P(() => [j(a.$slots, "default")]),
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
}), Qd = lv, cv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = un(), s = Ps(r), { forwardRef: o, currentElement: a } = ge();
    return jd(a), (l, c) => (M(), L(Qd, le({
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
        const d = u.detail.originalEvent, h = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || h) && u.preventDefault();
      }),
      onFocusOutside: c[2] || (c[2] = (u) => {
        u.preventDefault();
      })
    }), {
      default: P(() => [j(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), uv = cv, dv = /* @__PURE__ */ B({
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
    const t = n, i = Ps(e);
    ge();
    const s = un(), o = D(!1), a = D(!1);
    return (l, c) => (M(), L(Qd, le({
      ...t,
      ...y(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || y(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = u.target;
        y(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && a.value && u.preventDefault();
      })
    }), {
      default: P(() => [j(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), fv = dv, hv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = un(), s = Ps(r), { forwardRef: o } = ge();
    return (a, l) => (M(), L(y(_s), { present: a.forceMount || y(i).open.value }, {
      default: P(() => [y(i).modal.value ? (M(), L(uv, le({
        key: 0,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...a.$attrs
      }), {
        default: P(() => [j(a.$slots, "default")]),
        _: 3
      }, 16)) : (M(), L(fv, le({
        key: 1,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...a.$attrs
      }), {
        default: P(() => [j(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Zd = hv, pv = /* @__PURE__ */ B({
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
    const e = un();
    return qd(!0), ge(), (t, r) => (M(), L(y(de), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": y(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: P(() => [j(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), mv = pv, gv = /* @__PURE__ */ B({
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
    const e = un(), { forwardRef: t } = ge();
    return (r, i) => y(e)?.modal.value ? (M(), L(y(_s), {
      key: 0,
      present: r.forceMount || y(e).open.value
    }, {
      default: P(() => [$(mv, le(r.$attrs, {
        ref: y(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: P(() => [j(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : Y("v-if", !0);
  }
}), ef = gv, yv = /* @__PURE__ */ B({
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
    const e = /* @__PURE__ */ Vd();
    return (t, r) => y(e) || t.forceMount ? (M(), L(wd, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [j(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : Y("v-if", !0);
  }
}), tf = yv, vv = /* @__PURE__ */ B({
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
    return (t, r) => (M(), L(y(tf), Va(qa(e)), {
      default: P(() => [j(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), nf = vv, bv = /* @__PURE__ */ B({
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
    const e = n, t = un();
    return ge(), (r, i) => (M(), L(y(de), le(e, { id: y(t).titleId }), {
      default: P(() => [j(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), rf = bv;
const pc = "data-reka-collection-item";
function qt(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = D(/* @__PURE__ */ new Map());
    i = {
      collectionRef: D(),
      itemMap: u
    }, Tn(r, i);
  } else i = fi(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const h = Array.from(d.querySelectorAll(`[${pc}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => h.indexOf(m.ref) - h.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = B({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Yi();
      return te(p, () => {
        i.collectionRef.value = p.value;
      }), () => je(Zo, {
        ref: f,
        ...h
      }, d);
    }
  }), a = B({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: h }) {
      const { primitiveElement: f, currentElement: p } = Yi();
      return Ge((m) => {
        if (p.value) {
          const g = Wa(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => je(Zo, {
        ...h,
        [pc]: "",
        ref: f
      }, d);
    }
  }), l = A(() => Array.from(i.itemMap.value.values())), c = A(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const wv = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Sv(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function sf(n, e, t) {
  const r = Sv(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return wv[r];
}
function kv(n, e = !1) {
  const t = Je();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), Je() !== t)) return;
}
function xv(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [Cv] = rt("RovingFocusGroup");
var Tv = /* @__PURE__ */ B({
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
    const e = n, t = Cv(), r = nr(), i = A(() => e.tabStopId || r), s = A(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = qt();
    me(() => {
      e.focusable && t.onFocusableItemAdd();
    }), hr(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function l(c) {
      if (c.key === "Tab" && c.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const u = sf(c, t.orientation.value, t.dir.value);
      if (u !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !e.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let d = [...o().map((h) => h.ref).filter((h) => h.dataset.disabled !== "")];
        if (u === "last") d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const h = d.indexOf(c.currentTarget);
          d = t.loop.value ? xv(d, h + 1) : d.slice(h + 1);
        }
        ye(() => kv(d));
      }
    }
    return (c, u) => (M(), L(y(a), null, {
      default: P(() => [$(y(de), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": y(t).orientation.value,
        "data-active": c.active ? "" : void 0,
        "data-disabled": c.focusable ? void 0 : "",
        as: c.as,
        "as-child": c.asChild,
        onMousedown: u[0] || (u[0] = (d) => {
          c.focusable ? y(t).onItemFocus(i.value) : d.preventDefault();
        }),
        onFocus: u[1] || (u[1] = (d) => y(t).onItemFocus(i.value)),
        onKeydown: l
      }, {
        default: P(() => [j(c.$slots, "default")]),
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
}), Ev = Tv, Mv = /* @__PURE__ */ B({
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
    return (e, t) => (M(), L(y(de), {
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
      default: P(() => [j(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), of = Mv, Av = /* @__PURE__ */ B({
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
    const e = n, { primitiveElement: t, currentElement: r } = Yi(), i = A(() => e.checked ?? e.value);
    return te(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), h = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(h);
      }
    }), (s, o) => (M(), L(of, le({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), mc = Av, Ov = /* @__PURE__ */ B({
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
    return (i, s) => (M(), U(Ke, null, [Y(" We render single input if it's required "), t.value ? (M(), L(mc, le({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (M(!0), U(Ke, { key: 1 }, cn(r.value, (o) => (M(), L(mc, le({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), af = Ov;
const [Dv] = rt("CheckboxGroupRoot");
function Gi(n) {
  return n === "indeterminate";
}
function lf(n) {
  return Gi(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [Pv, _v] = rt("CheckboxRoot");
var Iv = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ge(), o = Dv(null), a = /* @__PURE__ */ Ur(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), l = A(() => o?.disabled.value || t.disabled), c = A(() => tr(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : ac(o.modelValue.value, t.value));
    function u() {
      if (tr(o?.modelValue.value))
        a.value = Gi(a.value) ? !0 : !a.value;
      else {
        const f = [...o.modelValue.value || []];
        if (ac(f, t.value)) {
          const p = f.findIndex((m) => En(m, t.value));
          f.splice(p, 1);
        } else f.push(t.value);
        o.modelValue.value = f;
      }
    }
    const d = Xa(s), h = A(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return _v({
      disabled: l,
      state: c
    }), (f, p) => (M(), L(Fa(y(o)?.rovingFocus.value ? y(Ev) : y(de)), le(f.$attrs, {
      id: f.id,
      ref: y(i),
      role: "checkbox",
      "as-child": f.asChild,
      as: f.as,
      type: f.as === "button" ? "button" : void 0,
      "aria-checked": y(Gi)(c.value) ? "mixed" : c.value,
      "aria-required": f.required,
      "aria-label": f.$attrs["aria-label"] || h.value,
      "data-state": y(lf)(c.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: y(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: Xi(bt(() => {
      }, ["prevent"]), ["enter"]),
      onClick: u
    }), {
      default: P(() => [j(f.$slots, "default", {
        modelValue: y(a),
        state: c.value
      }), y(d) && f.name && !y(o) ? (M(), L(y(af), {
        key: 0,
        type: "checkbox",
        checked: !!c.value,
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
      ])) : Y("v-if", !0)]),
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
}), Nv = Iv, Rv = /* @__PURE__ */ B({
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
    const { forwardRef: e } = ge(), t = Pv();
    return (r, i) => (M(), L(y(_s), { present: r.forceMount || y(Gi)(y(t).state.value) || y(t).state.value === !0 }, {
      default: P(() => [$(y(de), le({
        ref: y(e),
        "data-state": y(lf)(y(t).state.value),
        "data-disabled": y(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: P(() => [j(r.$slots, "default")]),
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
}), $v = Rv;
const [cf, Lv] = rt("PopperRoot");
var Bv = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = D();
    return Lv({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => j(t.$slots, "default");
  }
}), Fv = Bv, zv = /* @__PURE__ */ B({
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
    const e = n, { forwardRef: t, currentElement: r } = ge(), i = cf();
    return Sd(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (M(), L(y(de), {
      ref: y(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: P(() => [j(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Vv = zv;
function qv(n) {
  return n !== null;
}
function Wv(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [c, u] = ea(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[u], h = (i.arrow?.x ?? 0) + a / 2, f = (i.arrow?.y ?? 0) + l / 2;
      let p = "", m = "";
      return c === "bottom" ? (p = o ? d : `${h}px`, m = `${-l}px`) : c === "top" ? (p = o ? d : `${h}px`, m = `${r.floating.height + l}px`) : c === "right" ? (p = `${-l}px`, m = o ? d : `${f}px`) : c === "left" && (p = `${r.floating.width + l}px`, m = o ? d : `${f}px`), { data: {
        x: p,
        y: m
      } };
    }
  };
}
function ea(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Uv = ["top", "right", "bottom", "left"], rn = Math.min, et = Math.max, Qi = Math.round, xi = Math.floor, wt = (n) => ({
  x: n,
  y: n
}), Hv = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, jv = {
  start: "end",
  end: "start"
};
function ta(n, e, t) {
  return et(n, rn(e, t));
}
function Lt(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Bt(n) {
  return n.split("-")[0];
}
function mr(n) {
  return n.split("-")[1];
}
function Qa(n) {
  return n === "x" ? "y" : "x";
}
function Za(n) {
  return n === "y" ? "height" : "width";
}
const Kv = /* @__PURE__ */ new Set(["top", "bottom"]);
function vt(n) {
  return Kv.has(Bt(n)) ? "y" : "x";
}
function el(n) {
  return Qa(vt(n));
}
function Jv(n, e, t) {
  t === void 0 && (t = !1);
  const r = mr(n), i = el(n), s = Za(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Zi(o)), [o, Zi(o)];
}
function Xv(n) {
  const e = Zi(n);
  return [na(n), e, na(e)];
}
function na(n) {
  return n.replace(/start|end/g, (e) => jv[e]);
}
const gc = ["left", "right"], yc = ["right", "left"], Yv = ["top", "bottom"], Gv = ["bottom", "top"];
function Qv(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? yc : gc : e ? gc : yc;
    case "left":
    case "right":
      return e ? Yv : Gv;
    default:
      return [];
  }
}
function Zv(n, e, t, r) {
  const i = mr(n);
  let s = Qv(Bt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(na)))), s;
}
function Zi(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Hv[e]);
}
function eb(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function uf(n) {
  return typeof n != "number" ? eb(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function es(n) {
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
function vc(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = vt(e), o = el(e), a = Za(o), l = Bt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, h = r[a] / 2 - i[a] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: u,
        y: r.y - i.height
      };
      break;
    case "bottom":
      f = {
        x: u,
        y: r.y + r.height
      };
      break;
    case "right":
      f = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      f = {
        x: r.x - i.width,
        y: d
      };
      break;
    default:
      f = {
        x: r.x,
        y: r.y
      };
  }
  switch (mr(e)) {
    case "start":
      f[o] -= h * (t && c ? -1 : 1);
      break;
    case "end":
      f[o] += h * (t && c ? -1 : 1);
      break;
  }
  return f;
}
async function tb(n, e) {
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
    altBoundary: h = !1,
    padding: f = 0
  } = Lt(e, n), p = uf(f), g = a[h ? d === "floating" ? "reference" : "floating" : d], v = es(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), S = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, b = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), w = await (s.isElement == null ? void 0 : s.isElement(b)) ? await (s.getScale == null ? void 0 : s.getScale(b)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, x = es(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: b,
    strategy: l
  }) : S);
  return {
    top: (v.top - x.top + p.top) / w.y,
    bottom: (x.bottom - v.bottom + p.bottom) / w.y,
    left: (v.left - x.left + p.left) / w.x,
    right: (x.right - v.right + p.right) / w.x
  };
}
const nb = async (n, e, t) => {
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
  } = vc(c, r, l), h = r, f = {}, p = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: v,
      fn: S
    } = a[g], {
      x: b,
      y: w,
      data: x,
      reset: C
    } = await S({
      x: u,
      y: d,
      initialPlacement: r,
      placement: h,
      strategy: i,
      middlewareData: f,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : tb
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = b ?? u, d = w ?? d, f = {
      ...f,
      [v]: {
        ...f[v],
        ...x
      }
    }, C && p <= 50 && (p++, typeof C == "object" && (C.placement && (h = C.placement), C.rects && (c = C.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : C.rects), {
      x: u,
      y: d
    } = vc(c, h, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: h,
    strategy: i,
    middlewareData: f
  };
}, rb = (n) => ({
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
    } = Lt(n, e) || {};
    if (c == null)
      return {};
    const d = uf(u), h = {
      x: t,
      y: r
    }, f = el(i), p = Za(f), m = await o.getDimensions(c), g = f === "y", v = g ? "top" : "left", S = g ? "bottom" : "right", b = g ? "clientHeight" : "clientWidth", w = s.reference[p] + s.reference[f] - h[f] - s.floating[p], x = h[f] - s.reference[f], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let k = C ? C[b] : 0;
    (!k || !await (o.isElement == null ? void 0 : o.isElement(C))) && (k = a.floating[b] || s.floating[p]);
    const T = w / 2 - x / 2, E = k / 2 - m[p] / 2 - 1, O = rn(d[v], E), N = rn(d[S], E), R = O, q = k - m[p] - N, I = k / 2 - m[p] / 2 + T, F = ta(R, I, q), re = !l.arrow && mr(i) != null && I !== F && s.reference[p] / 2 - (I < R ? O : N) - m[p] / 2 < 0, Q = re ? I < R ? I - R : I - q : 0;
    return {
      [f]: h[f] + Q,
      data: {
        [f]: F,
        centerOffset: I - F - Q,
        ...re && {
          alignmentOffset: Q
        }
      },
      reset: re
    };
  }
}), ib = function(n) {
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
        fallbackPlacements: h,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: m = !0,
        ...g
      } = Lt(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const v = Bt(i), S = vt(a), b = Bt(a) === a, w = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), x = h || (b || !m ? [Zi(a)] : Xv(a)), C = p !== "none";
      !h && C && x.push(...Zv(a, m, p, w));
      const k = [a, ...x], T = await l.detectOverflow(e, g), E = [];
      let O = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && E.push(T[v]), d) {
        const I = Jv(i, o, w);
        E.push(T[I[0]], T[I[1]]);
      }
      if (O = [...O, {
        placement: i,
        overflows: E
      }], !E.every((I) => I <= 0)) {
        var N, R;
        const I = (((N = s.flip) == null ? void 0 : N.index) || 0) + 1, F = k[I];
        if (F && (!(d === "alignment" ? S !== vt(F) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        O.every((ie) => vt(ie.placement) === S ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: I,
              overflows: O
            },
            reset: {
              placement: F
            }
          };
        let re = (R = O.filter((Q) => Q.overflows[0] <= 0).sort((Q, ie) => Q.overflows[1] - ie.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!re)
          switch (f) {
            case "bestFit": {
              var q;
              const Q = (q = O.filter((ie) => {
                if (C) {
                  const he = vt(ie.placement);
                  return he === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  he === "y";
                }
                return !0;
              }).map((ie) => [ie.placement, ie.overflows.filter((he) => he > 0).reduce((he, We) => he + We, 0)]).sort((ie, he) => ie[1] - he[1])[0]) == null ? void 0 : q[0];
              Q && (re = Q);
              break;
            }
            case "initialPlacement":
              re = a;
              break;
          }
        if (i !== re)
          return {
            reset: {
              placement: re
            }
          };
      }
      return {};
    }
  };
};
function bc(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function wc(n) {
  return Uv.some((e) => n[e] >= 0);
}
const sb = function(n) {
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
      } = Lt(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = bc(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: wc(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = bc(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: wc(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, df = /* @__PURE__ */ new Set(["left", "top"]);
async function ob(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Bt(t), a = mr(t), l = vt(t) === "y", c = df.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Lt(e, n);
  let {
    mainAxis: h,
    crossAxis: f,
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
  return a && typeof p == "number" && (f = a === "end" ? p * -1 : p), l ? {
    x: f * u,
    y: h * c
  } : {
    x: h * c,
    y: f * u
  };
}
const ab = function(n) {
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
      } = e, l = await ob(e, n);
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
}, lb = function(n) {
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
          fn: (v) => {
            let {
              x: S,
              y: b
            } = v;
            return {
              x: S,
              y: b
            };
          }
        },
        ...c
      } = Lt(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), h = vt(Bt(i)), f = Qa(h);
      let p = u[f], m = u[h];
      if (o) {
        const v = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", b = p + d[v], w = p - d[S];
        p = ta(b, p, w);
      }
      if (a) {
        const v = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", b = m + d[v], w = m - d[S];
        m = ta(b, m, w);
      }
      const g = l.fn({
        ...e,
        [f]: p,
        [h]: m
      });
      return {
        ...g,
        data: {
          x: g.x - t,
          y: g.y - r,
          enabled: {
            [f]: o,
            [h]: a
          }
        }
      };
    }
  };
}, cb = function(n) {
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
      } = Lt(n, e), u = {
        x: t,
        y: r
      }, d = vt(i), h = Qa(d);
      let f = u[h], p = u[d];
      const m = Lt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const b = h === "y" ? "height" : "width", w = s.reference[h] - s.floating[b] + g.mainAxis, x = s.reference[h] + s.reference[b] - g.mainAxis;
        f < w ? f = w : f > x && (f = x);
      }
      if (c) {
        var v, S;
        const b = h === "y" ? "width" : "height", w = df.has(Bt(i)), x = s.reference[d] - s.floating[b] + (w && ((v = o.offset) == null ? void 0 : v[d]) || 0) + (w ? 0 : g.crossAxis), C = s.reference[d] + s.reference[b] + (w ? 0 : ((S = o.offset) == null ? void 0 : S[d]) || 0) - (w ? g.crossAxis : 0);
        p < x ? p = x : p > C && (p = C);
      }
      return {
        [h]: f,
        [d]: p
      };
    }
  };
}, ub = function(n) {
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
      } = Lt(n, e), u = await o.detectOverflow(e, c), d = Bt(i), h = mr(i), f = vt(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, v;
      d === "top" || d === "bottom" ? (g = d, v = h === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (v = d, g = h === "end" ? "top" : "bottom");
      const S = m - u.top - u.bottom, b = p - u.left - u.right, w = rn(m - u[g], S), x = rn(p - u[v], b), C = !e.middlewareData.shift;
      let k = w, T = x;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (T = b), (r = e.middlewareData.shift) != null && r.enabled.y && (k = S), C && !h) {
        const O = et(u.left, 0), N = et(u.right, 0), R = et(u.top, 0), q = et(u.bottom, 0);
        f ? T = p - 2 * (O !== 0 || N !== 0 ? O + N : et(u.left, u.right)) : k = m - 2 * (R !== 0 || q !== 0 ? R + q : et(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: T,
        availableHeight: k
      });
      const E = await o.getDimensions(a.floating);
      return p !== E.width || m !== E.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Is() {
  return typeof window < "u";
}
function In(n) {
  return tl(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function nt(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Mt(n) {
  var e;
  return (e = (tl(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function tl(n) {
  return Is() ? n instanceof Node || n instanceof nt(n).Node : !1;
}
function pt(n) {
  return Is() ? n instanceof Element || n instanceof nt(n).Element : !1;
}
function xt(n) {
  return Is() ? n instanceof HTMLElement || n instanceof nt(n).HTMLElement : !1;
}
function Sc(n) {
  return !Is() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof nt(n).ShadowRoot;
}
const db = /* @__PURE__ */ new Set(["inline", "contents"]);
function hi(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = mt(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !db.has(i);
}
const fb = /* @__PURE__ */ new Set(["table", "td", "th"]);
function hb(n) {
  return fb.has(In(n));
}
const pb = [":popover-open", ":modal"];
function Ns(n) {
  return pb.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const mb = ["transform", "translate", "scale", "rotate", "perspective"], gb = ["transform", "translate", "scale", "rotate", "perspective", "filter"], yb = ["paint", "layout", "strict", "content"];
function nl(n) {
  const e = rl(), t = pt(n) ? mt(n) : n;
  return mb.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || gb.some((r) => (t.willChange || "").includes(r)) || yb.some((r) => (t.contain || "").includes(r));
}
function vb(n) {
  let e = sn(n);
  for (; xt(e) && !rr(e); ) {
    if (nl(e))
      return e;
    if (Ns(e))
      return null;
    e = sn(e);
  }
  return null;
}
function rl() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const bb = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function rr(n) {
  return bb.has(In(n));
}
function mt(n) {
  return nt(n).getComputedStyle(n);
}
function Rs(n) {
  return pt(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function sn(n) {
  if (In(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Sc(n) && n.host || // Fallback.
    Mt(n)
  );
  return Sc(e) ? e.host : e;
}
function ff(n) {
  const e = sn(n);
  return rr(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : xt(e) && hi(e) ? e : ff(e);
}
function Hr(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = ff(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = nt(i);
  if (s) {
    const a = ra(o);
    return e.concat(o, o.visualViewport || [], hi(i) ? i : [], a && t ? Hr(a) : []);
  }
  return e.concat(i, Hr(i, [], t));
}
function ra(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function hf(n) {
  const e = mt(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = xt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = Qi(t) !== s || Qi(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function il(n) {
  return pt(n) ? n : n.contextElement;
}
function Yn(n) {
  const e = il(n);
  if (!xt(e))
    return wt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = hf(e);
  let o = (s ? Qi(t.width) : t.width) / r, a = (s ? Qi(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const wb = /* @__PURE__ */ wt(0);
function pf(n) {
  const e = nt(n);
  return !rl() || !e.visualViewport ? wb : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Sb(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== nt(n) ? !1 : e;
}
function Mn(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = il(n);
  let o = wt(1);
  e && (r ? pt(r) && (o = Yn(r)) : o = Yn(n));
  const a = Sb(s, t, r) ? pf(s) : wt(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const h = nt(s), f = r && pt(r) ? nt(r) : r;
    let p = h, m = ra(p);
    for (; m && r && f !== p; ) {
      const g = Yn(m), v = m.getBoundingClientRect(), S = mt(m), b = v.left + (m.clientLeft + parseFloat(S.paddingLeft)) * g.x, w = v.top + (m.clientTop + parseFloat(S.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += b, c += w, p = nt(m), m = ra(p);
    }
  }
  return es({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function $s(n, e) {
  const t = Rs(n).scrollLeft;
  return e ? e.left + t : Mn(Mt(n)).left + t;
}
function mf(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - $s(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function kb(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Mt(r), a = e ? Ns(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = wt(1);
  const u = wt(0), d = xt(r);
  if ((d || !d && !s) && ((In(r) !== "body" || hi(o)) && (l = Rs(r)), xt(r))) {
    const f = Mn(r);
    c = Yn(r), u.x = f.x + r.clientLeft, u.y = f.y + r.clientTop;
  }
  const h = o && !d && !s ? mf(o, l) : wt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + u.x + h.x,
    y: t.y * c.y - l.scrollTop * c.y + u.y + h.y
  };
}
function xb(n) {
  return Array.from(n.getClientRects());
}
function Cb(n) {
  const e = Mt(n), t = Rs(n), r = n.ownerDocument.body, i = et(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = et(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + $s(n);
  const a = -t.scrollTop;
  return mt(r).direction === "rtl" && (o += et(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const kc = 25;
function Tb(n, e) {
  const t = nt(n), r = Mt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = rl();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = $s(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, h = getComputedStyle(d), f = u.compatMode === "CSS1Compat" && parseFloat(h.marginLeft) + parseFloat(h.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - f);
    p <= kc && (s -= p);
  } else c <= kc && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const Eb = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Mb(n, e) {
  const t = Mn(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = xt(n) ? Yn(n) : wt(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function xc(n, e, t) {
  let r;
  if (e === "viewport")
    r = Tb(n, t);
  else if (e === "document")
    r = Cb(Mt(n));
  else if (pt(e))
    r = Mb(e, t);
  else {
    const i = pf(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return es(r);
}
function gf(n, e) {
  const t = sn(n);
  return t === e || !pt(t) || rr(t) ? !1 : mt(t).position === "fixed" || gf(t, e);
}
function Ab(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Hr(n, [], !1).filter((a) => pt(a) && In(a) !== "body"), i = null;
  const s = mt(n).position === "fixed";
  let o = s ? sn(n) : n;
  for (; pt(o) && !rr(o); ) {
    const a = mt(o), l = nl(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && Eb.has(i.position) || hi(o) && !l && gf(n, o)) ? r = r.filter((u) => u !== o) : i = a, o = sn(o);
  }
  return e.set(n, r), r;
}
function Ob(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Ns(e) ? [] : Ab(e, this._c) : [].concat(t), r], a = o[0], l = o.reduce((c, u) => {
    const d = xc(e, u, i);
    return c.top = et(d.top, c.top), c.right = rn(d.right, c.right), c.bottom = rn(d.bottom, c.bottom), c.left = et(d.left, c.left), c;
  }, xc(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function Db(n) {
  const {
    width: e,
    height: t
  } = hf(n);
  return {
    width: e,
    height: t
  };
}
function Pb(n, e, t) {
  const r = xt(e), i = Mt(e), s = t === "fixed", o = Mn(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = wt(0);
  function c() {
    l.x = $s(i);
  }
  if (r || !r && !s)
    if ((In(e) !== "body" || hi(i)) && (a = Rs(e)), r) {
      const f = Mn(e, !0, s, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? mf(i, a) : wt(0), d = o.left + a.scrollLeft - l.x - u.x, h = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: h,
    width: o.width,
    height: o.height
  };
}
function bo(n) {
  return mt(n).position === "static";
}
function Cc(n, e) {
  if (!xt(n) || mt(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Mt(n) === t && (t = t.ownerDocument.body), t;
}
function yf(n, e) {
  const t = nt(n);
  if (Ns(n))
    return t;
  if (!xt(n)) {
    let i = sn(n);
    for (; i && !rr(i); ) {
      if (pt(i) && !bo(i))
        return i;
      i = sn(i);
    }
    return t;
  }
  let r = Cc(n, e);
  for (; r && hb(r) && bo(r); )
    r = Cc(r, e);
  return r && rr(r) && bo(r) && !nl(r) ? t : r || vb(n) || t;
}
const _b = async function(n) {
  const e = this.getOffsetParent || yf, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: Pb(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Ib(n) {
  return mt(n).direction === "rtl";
}
const Nb = {
  convertOffsetParentRelativeRectToViewportRelativeRect: kb,
  getDocumentElement: Mt,
  getClippingRect: Ob,
  getOffsetParent: yf,
  getElementRects: _b,
  getClientRects: xb,
  getDimensions: Db,
  getScale: Yn,
  isElement: pt,
  isRTL: Ib
};
function vf(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Rb(n, e) {
  let t = null, r;
  const i = Mt(n);
  function s() {
    var a;
    clearTimeout(r), (a = t) == null || a.disconnect(), t = null;
  }
  function o(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), s();
    const c = n.getBoundingClientRect(), {
      left: u,
      top: d,
      width: h,
      height: f
    } = c;
    if (a || e(), !h || !f)
      return;
    const p = xi(d), m = xi(i.clientWidth - (u + h)), g = xi(i.clientHeight - (d + f)), v = xi(u), b = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -v + "px",
      threshold: et(0, rn(1, l)) || 1
    };
    let w = !0;
    function x(C) {
      const k = C[0].intersectionRatio;
      if (k !== l) {
        if (!w)
          return o();
        k ? o(!1, k) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      k === 1 && !vf(c, n.getBoundingClientRect()) && o(), w = !1;
    }
    try {
      t = new IntersectionObserver(x, {
        ...b,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(x, b);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function $b(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = il(n), u = i || s ? [...c ? Hr(c) : [], ...Hr(e)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", t, {
      passive: !0
    }), s && v.addEventListener("resize", t);
  });
  const d = c && a ? Rb(c, t) : null;
  let h = -1, f = null;
  o && (f = new ResizeObserver((v) => {
    let [S] = v;
    S && S.target === c && f && (f.unobserve(e), cancelAnimationFrame(h), h = requestAnimationFrame(() => {
      var b;
      (b = f) == null || b.observe(e);
    })), t();
  }), c && !l && f.observe(c), f.observe(e));
  let p, m = l ? Mn(n) : null;
  l && g();
  function g() {
    const v = Mn(n);
    m && !vf(m, v) && t(), m = v, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var v;
    u.forEach((S) => {
      i && S.removeEventListener("scroll", t), s && S.removeEventListener("resize", t);
    }), d?.(), (v = f) == null || v.disconnect(), f = null, l && cancelAnimationFrame(p);
  };
}
const Lb = ab, Bb = lb, Tc = ib, Fb = ub, zb = sb, Vb = rb, qb = cb, Wb = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: Nb,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return nb(n, e, {
    ...i,
    platform: s
  });
};
function Ub(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function ia(n) {
  if (Ub(n)) {
    const e = n.$el;
    return tl(e) && In(e) === "#comment" ? null : e;
  }
  return n;
}
function jn(n) {
  return typeof n == "function" ? n() : y(n);
}
function Hb(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = ia(jn(n.element));
      return t == null ? {} : Vb({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function bf(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ec(n, e) {
  const t = bf(n);
  return Math.round(e * t) / t;
}
function jb(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = A(() => {
    var k;
    return (k = jn(t.open)) != null ? k : !0;
  }), s = A(() => jn(t.middleware)), o = A(() => {
    var k;
    return (k = jn(t.placement)) != null ? k : "bottom";
  }), a = A(() => {
    var k;
    return (k = jn(t.strategy)) != null ? k : "absolute";
  }), l = A(() => {
    var k;
    return (k = jn(t.transform)) != null ? k : !0;
  }), c = A(() => ia(n.value)), u = A(() => ia(e.value)), d = D(0), h = D(0), f = D(a.value), p = D(o.value), m = nn({}), g = D(!1), v = A(() => {
    const k = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return k;
    const T = Ec(u.value, d.value), E = Ec(u.value, h.value);
    return l.value ? {
      ...k,
      transform: "translate(" + T + "px, " + E + "px)",
      ...bf(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: T + "px",
      top: E + "px"
    };
  });
  let S;
  function b() {
    if (c.value == null || u.value == null)
      return;
    const k = i.value;
    Wb(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((T) => {
      d.value = T.x, h.value = T.y, f.value = T.strategy, p.value = T.placement, m.value = T.middlewareData, g.value = k !== !1;
    });
  }
  function w() {
    typeof S == "function" && (S(), S = void 0);
  }
  function x() {
    if (w(), r === void 0) {
      b();
      return;
    }
    if (c.value != null && u.value != null) {
      S = r(c.value, u.value, b);
      return;
    }
  }
  function C() {
    i.value || (g.value = !1);
  }
  return te([s, o, a, i], b, {
    flush: "sync"
  }), te([c, u], x, {
    flush: "sync"
  }), te(i, C, {
    flush: "sync"
  }), gd() && yd(w), {
    x: zn(d),
    y: zn(h),
    strategy: zn(f),
    placement: zn(p),
    middlewareData: zn(m),
    isPositioned: zn(g),
    floatingStyles: v,
    update: b
  };
}
const Kb = {
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
}, [fD, Jb] = rt("PopperContent");
var Xb = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Km({
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
  }, { ...Kb }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = cf(), { forwardRef: s, currentElement: o } = ge(), a = D(), l = D(), { width: c, height: u } = $y(l), d = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), h = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), f = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = A(() => ({
      padding: h.value,
      boundary: f.value.filter(qv),
      altBoundary: f.value.length > 0
    })), m = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = cy(() => [
      Lb({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Tc({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && Bb({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? qb() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Tc({
        ...p.value,
        ...m.value
      }),
      Fb({
        ...p.value,
        apply: ({ elements: R, rects: q, availableWidth: I, availableHeight: F }) => {
          const { width: re, height: Q } = q.reference, ie = R.floating.style;
          ie.setProperty("--reka-popper-available-width", `${I}px`), ie.setProperty("--reka-popper-available-height", `${F}px`), ie.setProperty("--reka-popper-anchor-width", `${re}px`), ie.setProperty("--reka-popper-anchor-height", `${Q}px`);
        }
      }),
      l.value && Hb({
        element: l.value,
        padding: t.arrowPadding
      }),
      Wv({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && zb({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), v = A(() => t.reference ?? i.anchor.value), { floatingStyles: S, placement: b, isPositioned: w, middlewareData: x } = jb(v, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => $b(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), C = A(() => ea(b.value)[0]), k = A(() => ea(b.value)[1]);
    Sd(() => {
      w.value && r("placed");
    });
    const T = A(() => {
      const R = x.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), E = D("");
    Ge(() => {
      o.value && (E.value = window.getComputedStyle(o.value).zIndex);
    });
    const O = A(() => x.value.arrow?.x ?? 0), N = A(() => x.value.arrow?.y ?? 0);
    return Jb({
      placedSide: C,
      onArrowChange: (R) => l.value = R,
      arrowX: O,
      arrowY: N,
      shouldHideArrow: T
    }), (R, q) => (M(), U("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: an({
        ...y(S),
        transform: y(w) ? y(S).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: E.value,
        "--reka-popper-transform-origin": [y(x).transformOrigin?.x, y(x).transformOrigin?.y].join(" "),
        ...y(x).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [$(y(de), le({ ref: y(s) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": C.value,
      "data-align": k.value,
      style: { animation: y(w) ? void 0 : "none" }
    }), {
      default: P(() => [j(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Yb = Xb;
function Gb(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => Or(r, e, t)) : Or(n, e, t);
}
function Or(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : En(n, e);
}
const [wf, Qb] = rt("ListboxRoot");
var Zb = /* @__PURE__ */ B({
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
    const r = n, i = t, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = pr(r), { getItems: d } = qt({ isProvider: !0 }), { handleTypeaheadSearch: h } = Ga(), { primitiveElement: f, currentElement: p } = Yi(), m = Ry(), g = Ud(u), v = Xa(p), S = D(), b = D(!1), w = D(!0), x = /* @__PURE__ */ Ur(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function C(V) {
      if (b.value = !0, r.multiple) {
        const X = Array.isArray(x.value) ? [...x.value] : [], ee = X.findIndex((se) => Or(se, V, r.by));
        r.selectionBehavior === "toggle" ? (ee === -1 ? X.push(V) : X.splice(ee, 1), x.value = X) : (x.value = [V], S.value = V);
      } else r.selectionBehavior === "toggle" && Or(x.value, V, r.by) ? x.value = void 0 : x.value = V;
      setTimeout(() => {
        b.value = !1;
      }, 1);
    }
    const k = D(null), T = D(null), E = D(!1), O = D(!1), N = /* @__PURE__ */ fo(), R = /* @__PURE__ */ fo(), q = /* @__PURE__ */ fo();
    function I() {
      return d().map((V) => V.ref).filter((V) => V.dataset.disabled !== "");
    }
    function F(V, X = !0) {
      if (!V) return;
      k.value = V, w.value && k.value.focus(), X && k.value.scrollIntoView({ block: "nearest" });
      const ee = d().find((se) => se.ref === V);
      i("highlight", ee);
    }
    function re(V) {
      if (E.value) q.trigger(V);
      else {
        const X = d().find((ee) => Or(ee.value, V, r.by));
        X && (k.value = X.ref, F(X.ref));
      }
    }
    function Q(V) {
      k.value && k.value.isConnected && (V.preventDefault(), V.stopPropagation(), O.value || k.value.click());
    }
    function ie(V) {
      if (w.value) {
        if (b.value = !0, E.value) R.trigger(V);
        else {
          const X = V.altKey || V.ctrlKey || V.metaKey;
          if (X && V.key === "a" && s.value) {
            const ee = d(), se = ee.map((gt) => gt.value);
            x.value = [...se], V.preventDefault(), F(ee[ee.length - 1].ref);
          } else if (!X) {
            const ee = h(V.key, d());
            ee && F(ee);
          }
        }
        setTimeout(() => {
          b.value = !1;
        }, 1);
      }
    }
    function he() {
      O.value = !0;
    }
    function We() {
      ye(() => {
        O.value = !1;
      });
    }
    function Bn() {
      ye(() => {
        const V = new KeyboardEvent("keydown", { key: "PageUp" });
        fn(V);
      });
    }
    function dt(V) {
      const X = k.value;
      X?.isConnected && (T.value = X), k.value = null, i("leave", V);
    }
    function Fn(V) {
      const X = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (V.currentTarget?.dispatchEvent(X), i("entryFocus", X), !X.defaultPrevented)
        if (T.value) F(T.value);
        else {
          const ee = I()?.[0];
          F(ee);
        }
    }
    function fn(V) {
      const X = sf(V, a.value, g.value);
      if (!X) return;
      let ee = I();
      if (k.value) {
        if (X === "last") ee.reverse();
        else if (X === "prev" || X === "next") {
          X === "prev" && ee.reverse();
          const se = ee.indexOf(k.value);
          ee = ee.slice(se + 1);
        }
        oo(V, ee[0]);
      }
      if (ee.length) {
        const se = !k.value && X === "prev" ? ee.length - 1 : 0;
        F(ee[se]);
      }
      if (E.value) return R.trigger(V);
    }
    function oo(V, X) {
      if (!(E.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(x.value) || (V.altKey || V.ctrlKey || V.metaKey) && !V.shiftKey) && V.shiftKey) {
        const se = d().filter((At) => At.ref.dataset.disabled !== "");
        let gt = se.find((At) => At.ref === X)?.value;
        if (V.key === m.END ? gt = se[se.length - 1].value : V.key === m.HOME && (gt = se[0].value), !gt || !S.value) return;
        const br = ly(se.map((At) => At.value), S.value, gt);
        x.value = br;
      }
    }
    async function ao(V) {
      if (await ye(), E.value) N.trigger(V);
      else {
        const X = I(), ee = X.find((se) => se.dataset.state === "checked");
        ee ? F(ee) : X.length && F(X[0]);
      }
    }
    return te(x, () => {
      b.value || ye(() => {
        ao();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: k,
      highlightItem: re,
      highlightFirstItem: Bn,
      highlightSelected: ao,
      getItems: d
    }), Qb({
      modelValue: x,
      onValueChange: C,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: k,
      isVirtual: E,
      virtualFocusHook: N,
      virtualKeydownHook: R,
      virtualHighlightHook: q,
      by: r.by,
      firstValue: S,
      selectionBehavior: c,
      focusable: w,
      onLeave: dt,
      onEnter: Fn,
      changeHighlight: F,
      onKeydownEnter: Q,
      onKeydownNavigation: fn,
      onKeydownTypeAhead: ie,
      onCompositionStart: he,
      onCompositionEnd: We,
      highlightFirstItem: Bn
    }), (V, X) => (M(), L(y(de), {
      ref_key: "primitiveElement",
      ref: f,
      as: V.as,
      "as-child": V.asChild,
      dir: y(g),
      "data-disabled": y(l) ? "" : void 0,
      onPointerleave: dt,
      onFocusout: X[0] || (X[0] = async (ee) => {
        const se = ee.relatedTarget || ee.target;
        await ye(), k.value && y(p) && !y(p).contains(se) && dt(ee);
      })
    }, {
      default: P(() => [j(V.$slots, "default", { modelValue: y(x) }), y(v) && V.name ? (M(), L(y(af), {
        key: 0,
        name: V.name,
        value: y(x),
        disabled: y(l),
        required: V.required
      }, null, 8, [
        "name",
        "value",
        "disabled",
        "required"
      ])) : Y("v-if", !0)]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "dir",
      "data-disabled"
    ]));
  }
}), e0 = Zb, t0 = /* @__PURE__ */ B({
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
    const { CollectionSlot: e } = qt(), t = wf(), r = Fd(!1, 10);
    return (i, s) => (M(), L(y(e), null, {
      default: P(() => [$(y(de), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: y(t).focusable.value ? y(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": y(t).orientation.value,
        "aria-multiselectable": !!y(t).multiple.value,
        "data-orientation": y(t).orientation.value,
        onMousedown: s[0] || (s[0] = bt((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          y(r) || y(t).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = Xi((o) => {
            y(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || y(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), y(t).focusable.value && y(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Xi(y(t).onKeydownEnter, ["enter"]),
          y(t).onKeydownTypeAhead
        ]
      }, {
        default: P(() => [j(i.$slots, "default")]),
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
}), n0 = t0;
const r0 = "listbox.select", [i0, s0] = rt("ListboxItem");
var o0 = /* @__PURE__ */ B({
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
    const t = n, r = e, i = nr(void 0, "reka-listbox-item"), { CollectionItem: s } = qt(), { forwardRef: o, currentElement: a } = ge(), l = wf(), c = A(() => a.value === l.highlightedElement.value), u = A(() => Gb(l.modelValue.value, t.value, l.by)), d = A(() => l.disabled.value || t.disabled);
    async function h(p) {
      r("select", p), !p?.defaultPrevented && !d.value && p && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function f(p) {
      const m = {
        originalEvent: p,
        value: t.value
      };
      Ms(r0, h, m);
    }
    return s0({ isSelected: u }), (p, m) => (M(), L(y(s), { value: p.value }, {
      default: P(() => [Jm([c.value, u.value], () => $(y(de), le({ id: y(i) }, p.$attrs, {
        ref: y(o),
        role: "option",
        tabindex: y(l).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: p.as,
        "as-child": p.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: f,
        onKeydown: Xi(bt(f, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          y(l).highlightedElement.value !== y(a) && y(l).highlightOnHover.value && !y(l).focusable.value && y(l).changeHighlight(y(a), !1);
        })
      }), {
        default: P(() => [j(p.$slots, "default")]),
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
}), a0 = o0, l0 = /* @__PURE__ */ B({
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
    ge();
    const t = i0();
    return (r, i) => y(t).isSelected.value ? (M(), L(y(de), le({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: P(() => [j(r.$slots, "default")]),
      _: 3
    }, 16)) : Y("v-if", !0);
  }
}), c0 = l0;
function u0(n) {
  const e = As({ nonce: D() });
  return A(() => n?.value || e.nonce?.value);
}
const d0 = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], f0 = [" ", "Enter"], ft = 10;
function ts(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => sa(r, e, t)) : sa(n, e, t);
}
function sa(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : En(n, e);
}
function h0(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const p0 = {
  key: 0,
  value: ""
}, [Nn, Sf] = rt("SelectRoot");
var m0 = /* @__PURE__ */ B({
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
    const t = n, r = e, { required: i, disabled: s, multiple: o, dir: a } = pr(t), l = /* @__PURE__ */ Ur(t, "modelValue", r, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ Ur(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), u = D(), d = D(), h = D({
      x: 0,
      y: 0
    }), f = A(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : tr(l.value));
    qt({ isProvider: !0 });
    const p = Ud(a), m = Xa(u), g = D(/* @__PURE__ */ new Set()), v = A(() => Array.from(g.value).map((w) => w.value).join(";"));
    function S(w) {
      if (o.value) {
        const x = Array.isArray(l.value) ? [...l.value] : [], C = x.findIndex((k) => sa(k, w, t.by));
        C === -1 ? x.push(w) : x.splice(C, 1), l.value = [...x];
      } else l.value = w;
    }
    function b(w) {
      return Array.from(g.value).find((x) => ts(w, x.value, t.by));
    }
    return Sf({
      triggerElement: u,
      onTriggerChange: (w) => {
        u.value = w;
      },
      valueElement: d,
      onValueElementChange: (w) => {
        d.value = w;
      },
      contentId: "",
      modelValue: l,
      onValueChange: S,
      by: t.by,
      open: c,
      multiple: o,
      required: i,
      onOpenChange: (w) => {
        c.value = w;
      },
      dir: p,
      triggerPointerDownPosRef: h,
      disabled: s,
      isEmptyModelValue: f,
      optionsSet: g,
      onOptionAdd: (w) => {
        const x = b(w.value);
        x && g.value.delete(x), g.value.add(w);
      },
      onOptionRemove: (w) => {
        const x = b(w.value);
        x && g.value.delete(x);
      }
    }), (w, x) => (M(), L(y(Fv), null, {
      default: P(() => [j(w.$slots, "default", {
        modelValue: y(l),
        open: y(c)
      }), y(m) ? (M(), L(v0, {
        key: v.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: y(o),
        required: y(i),
        name: w.name,
        autocomplete: w.autocomplete,
        disabled: y(s),
        value: y(l)
      }, {
        default: P(() => [y(tr)(y(l)) ? (M(), U("option", p0)) : Y("v-if", !0), (M(!0), U(Ke, null, cn(Array.from(g.value), (C) => (M(), U("option", le({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
        _: 1
      }, 8, [
        "multiple",
        "required",
        "name",
        "autocomplete",
        "disabled",
        "value"
      ])) : Y("v-if", !0)]),
      _: 3
    }));
  }
}), g0 = m0, y0 = /* @__PURE__ */ B({
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
    const e = n, t = D(), r = Nn();
    te(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && t.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(t.value, s), t.value.dispatchEvent(u);
      }
    });
    function i(s) {
      r.onValueChange(s.target.value);
    }
    return (s, o) => (M(), L(y(of), { "as-child": "" }, {
      default: P(() => [K("select", le({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: i }), [j(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), v0 = y0, b0 = /* @__PURE__ */ B({
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
      default: ft
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
    const t = Ya(n);
    return (r, i) => (M(), L(y(Yb), le(y(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: P(() => [j(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), w0 = b0;
const S0 = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Ls, kf] = rt("SelectContent");
var k0 = /* @__PURE__ */ B({
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
    const t = n, r = e, i = Nn();
    Ay(), qd(t.bodyLock);
    const { CollectionSlot: s, getItems: o } = qt(), a = D();
    jd(a);
    const { search: l, handleTypeaheadSearch: c } = Ga(), u = D(), d = D(), h = D(), f = D(!1), p = D(!1), m = D(!1);
    function g() {
      d.value && a.value && hc([d.value, a.value]);
    }
    te(f, () => {
      g();
    });
    const { onOpenChange: v, triggerPointerDownPosRef: S } = i;
    Ge((C) => {
      if (!a.value) return;
      let k = {
        x: 0,
        y: 0
      };
      const T = (O) => {
        k = {
          x: Math.abs(Math.round(O.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(O.pageY) - (S.value?.y ?? 0))
        };
      }, E = (O) => {
        O.pointerType !== "touch" && (k.x <= 10 && k.y <= 10 ? O.preventDefault() : a.value?.contains(O.target) || v(!1), document.removeEventListener("pointermove", T), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", T), document.addEventListener("pointerup", E, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", T), document.removeEventListener("pointerup", E, { capture: !0 });
      });
    });
    function b(C) {
      const k = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !k && C.key.length === 1 && c(C.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let E = [...o().map((O) => O.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (E = E.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const O = C.target, N = E.indexOf(O);
          E = E.slice(N + 1);
        }
        setTimeout(() => hc(E)), C.preventDefault();
      }
    }
    const w = A(() => t.position === "popper" ? t : {}), x = Ya(w.value);
    return kf({
      content: a,
      viewport: u,
      onViewportChange: (C) => {
        u.value = C;
      },
      itemRefCallback: (C, k, T) => {
        const E = !p.value && !T, O = ts(i.modelValue.value, k, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (O || E) && (d.value = C, O && (m.value = !0));
        } else (O || E) && (d.value = C);
        E && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: h,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (C, k, T) => {
        const E = !p.value && !T;
        (ts(i.modelValue.value, k, i.by) || E) && (h.value = C);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: f,
      searchRef: l
    }), (C, k) => (M(), L(y(s), null, {
      default: P(() => [$(y(Gd), {
        "as-child": "",
        onMountAutoFocus: k[6] || (k[6] = bt(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: k[7] || (k[7] = (T) => {
          r("closeAutoFocus", T), !T.defaultPrevented && (y(i).triggerElement.value?.focus({ preventScroll: !0 }), T.preventDefault());
        })
      }, {
        default: P(() => [$(y(Xd), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: k[2] || (k[2] = bt(() => {
          }, ["prevent"])),
          onDismiss: k[3] || (k[3] = (T) => y(i).onOpenChange(!1)),
          onEscapeKeyDown: k[4] || (k[4] = (T) => r("escapeKeyDown", T)),
          onPointerDownOutside: k[5] || (k[5] = (T) => r("pointerDownOutside", T))
        }, {
          default: P(() => [(M(), L(Fa(C.position === "popper" ? w0 : M0), le({
            ...C.$attrs,
            ...y(x)
          }, {
            id: y(i).contentId,
            ref: (T) => {
              const E = y(kt)(T);
              E?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = E.firstElementChild : a.value = E;
            },
            role: "listbox",
            "data-state": y(i).open.value ? "open" : "closed",
            dir: y(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: k[0] || (k[0] = bt(() => {
            }, ["prevent"])),
            onPlaced: k[1] || (k[1] = (T) => f.value = !0),
            onKeydown: b
          }), {
            default: P(() => [j(C.$slots, "default")]),
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
}), x0 = k0;
const [C0, T0] = rt("SelectItemAlignedPosition");
var E0 = /* @__PURE__ */ B({
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
    const t = n, r = e, { getItems: i } = qt(), s = Nn(), o = Ls(), a = D(!1), l = D(!0), c = D(), { forwardRef: u, currentElement: d } = ge(), { viewport: h, selectedItem: f, selectedItemText: p, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && h?.value && f?.value && p?.value) {
        const b = s.triggerElement.value.getBoundingClientRect(), w = d.value.getBoundingClientRect(), x = s.valueElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const V = C.left - w.left, X = x.left - V, ee = b.left - X, se = b.width + ee, gt = Math.max(se, w.width), br = window.innerWidth - ft, At = oc(X, ft, Math.max(ft, br - gt));
          c.value.style.minWidth = `${se}px`, c.value.style.left = `${At}px`;
        } else {
          const V = w.right - C.right, X = window.innerWidth - x.right - V, ee = window.innerWidth - b.right - X, se = b.width + ee, gt = Math.max(se, w.width), br = window.innerWidth - ft, At = oc(X, ft, Math.max(ft, br - gt));
          c.value.style.minWidth = `${se}px`, c.value.style.right = `${At}px`;
        }
        const k = i().map((V) => V.ref), T = window.innerHeight - ft * 2, E = h.value.scrollHeight, O = window.getComputedStyle(d.value), N = Number.parseInt(O.borderTopWidth, 10), R = Number.parseInt(O.paddingTop, 10), q = Number.parseInt(O.borderBottomWidth, 10), I = Number.parseInt(O.paddingBottom, 10), F = N + R + E + I + q, re = Math.min(f.value.offsetHeight * 5, F), Q = window.getComputedStyle(h.value), ie = Number.parseInt(Q.paddingTop, 10), he = Number.parseInt(Q.paddingBottom, 10), We = b.top + b.height / 2 - ft, Bn = T - We, dt = f.value.offsetHeight / 2, Fn = f.value.offsetTop + dt, fn = N + R + Fn, oo = F - fn;
        if (fn <= We) {
          const V = f.value === k[k.length - 1];
          c.value.style.bottom = "0px";
          const X = d.value.clientHeight - h.value.offsetTop - h.value.offsetHeight, ee = Math.max(Bn, dt + (V ? he : 0) + X + q), se = fn + ee;
          c.value.style.height = `${se}px`;
        } else {
          const V = f.value === k[0];
          c.value.style.top = "0px";
          const ee = Math.max(We, N + h.value.offsetTop + (V ? ie : 0) + dt) + oo;
          c.value.style.height = `${ee}px`, h.value.scrollTop = fn - We + h.value.offsetTop;
        }
        c.value.style.margin = `${ft}px 0`, c.value.style.minHeight = `${re}px`, c.value.style.maxHeight = `${T}px`, r("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const v = D("");
    me(async () => {
      await ye(), g(), d.value && (v.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(b) {
      b && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return xy(s.triggerElement, () => {
      g();
    }), T0({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (b, w) => (M(), U("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: an({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: v.value
      })
    }, [$(y(de), le({
      ref: y(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...b.$attrs,
      ...t
    }), {
      default: P(() => [j(b.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), M0 = E0, A0 = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Sf(n.context), kf(S0), (t, r) => j(t.$slots, "default");
  }
}), O0 = A0;
const D0 = { key: 1 };
var P0 = /* @__PURE__ */ B({
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
    const t = n, i = Oy(t, e), s = Nn(), o = D();
    me(() => {
      o.value = new DocumentFragment();
    });
    const a = D(), l = A(() => t.forceMount || s.open.value), c = D(l.value);
    return te(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (M(), L(y(_s), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: P(() => [$(x0, Va(qa({
        ...y(i),
        ...u.$attrs
      })), {
        default: P(() => [j(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (M(), U("div", D0, [(M(), L(wd, { to: o.value }, [$(O0, { context: y(s) }, {
      default: P(() => [j(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : Y("v-if", !0);
  }
}), _0 = P0, I0 = /* @__PURE__ */ B({
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
    return (e, t) => (M(), L(y(de), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: P(() => [j(e.$slots, "default", {}, () => [t[0] || (t[0] = we("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), N0 = I0;
const [xf, R0] = rt("SelectItem");
var $0 = /* @__PURE__ */ B({
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
    const t = n, r = e, { disabled: i } = pr(t), s = Nn(), o = Ls(), { forwardRef: a, currentElement: l } = ge(), { CollectionItem: c } = qt(), u = A(() => ts(s.modelValue?.value, t.value, s.by)), d = D(!1), h = D(t.textValue ?? ""), f = nr(void 0, "reka-select-item-text"), p = "select.select";
    async function m(w) {
      if (w.defaultPrevented) return;
      const x = {
        originalEvent: w,
        value: t.value
      };
      Ms(p, g, x);
    }
    async function g(w) {
      await ye(), r("select", w), !w.defaultPrevented && (i.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function v(w) {
      await ye(), !w.defaultPrevented && (i.value ? o.onItemLeave?.() : w.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(w) {
      await ye(), !w.defaultPrevented && w.currentTarget === Je() && o.onItemLeave?.();
    }
    async function b(w) {
      await ye(), !(w.defaultPrevented || o.searchRef?.value !== "" && w.key === " ") && (f0.includes(w.key) && m(w), w.key === " " && w.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return me(() => {
      l.value && o.itemRefCallback(l.value, t.value, t.disabled);
    }), R0({
      value: t.value,
      disabled: i,
      textId: f,
      isSelected: u,
      onItemTextChange: (w) => {
        h.value = ((h.value || w?.textContent) ?? "").trim();
      }
    }), (w, x) => (M(), L(y(c), { value: { textValue: h.value } }, {
      default: P(() => [$(y(de), {
        ref: y(a),
        role: "option",
        "aria-labelledby": y(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": y(i) || void 0,
        "data-disabled": y(i) ? "" : void 0,
        tabindex: y(i) ? void 0 : -1,
        as: w.as,
        "as-child": w.asChild,
        onFocus: x[0] || (x[0] = (C) => d.value = !0),
        onBlur: x[1] || (x[1] = (C) => d.value = !1),
        onPointerup: m,
        onPointerdown: x[2] || (x[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: x[3] || (x[3] = bt(() => {
        }, ["prevent", "stop"])),
        onPointermove: v,
        onPointerleave: S,
        onKeydown: b
      }, {
        default: P(() => [j(w.$slots, "default")]),
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
}), L0 = $0, B0 = /* @__PURE__ */ B({
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
    const e = n, t = xf();
    return (r, i) => y(t).isSelected.value ? (M(), L(y(de), le({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: P(() => [j(r.$slots, "default")]),
      _: 3
    }, 16)) : Y("v-if", !0);
  }
}), F0 = B0, z0 = /* @__PURE__ */ B({
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
    const e = n, t = Nn(), r = Ls(), i = xf(), { forwardRef: s, currentElement: o } = ge(), a = A(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return me(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), t.onOptionAdd(a.value));
    }), hr(() => {
      t.onOptionRemove(a.value);
    }), (l, c) => (M(), L(y(de), le({
      id: y(i).textId,
      ref: y(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: P(() => [j(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), V0 = z0, q0 = /* @__PURE__ */ B({
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
    return (t, r) => (M(), L(y(tf), Va(qa(e)), {
      default: P(() => [j(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), W0 = q0, U0 = /* @__PURE__ */ B({
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
    const e = n, t = Nn(), { forwardRef: r, currentElement: i } = ge(), s = A(() => t.disabled?.value || e.disabled);
    t.contentId ||= nr(void 0, "reka-select-content"), me(() => {
      t.onTriggerChange(i.value);
    });
    const { getItems: o } = qt(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = Ga();
    function u() {
      s.value || (t.onOpenChange(!0), c());
    }
    function d(h) {
      u(), t.triggerPointerDownPosRef.value = {
        x: Math.round(h.pageX),
        y: Math.round(h.pageY)
      };
    }
    return (h, f) => (M(), L(y(Vv), {
      "as-child": "",
      reference: h.reference
    }, {
      default: P(() => [$(y(de), {
        ref: y(r),
        role: "combobox",
        type: h.as === "button" ? "button" : void 0,
        "aria-controls": y(t).contentId,
        "aria-expanded": y(t).open.value || !1,
        "aria-required": y(t).required?.value,
        "aria-autocomplete": "none",
        disabled: s.value,
        dir: y(t)?.dir.value,
        "data-state": y(t)?.open.value ? "open" : "closed",
        "data-disabled": s.value ? "" : void 0,
        "data-placeholder": y(h0)(y(t).modelValue?.value) ? "" : void 0,
        "as-child": h.asChild,
        as: h.as,
        onClick: f[0] || (f[0] = (p) => {
          p?.currentTarget?.focus();
        }),
        onPointerdown: f[1] || (f[1] = (p) => {
          if (p.pointerType === "touch") return p.preventDefault();
          const m = p.target;
          m.hasPointerCapture(p.pointerId) && m.releasePointerCapture(p.pointerId), p.button === 0 && p.ctrlKey === !1 && (d(p), p.preventDefault());
        }),
        onPointerup: f[2] || (f[2] = bt((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (p) => {
          const m = y(a) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && m && p.key === " " || (y(l)(p.key, y(o)()), y(d0).includes(p.key) && (u(), p.preventDefault()));
        })
      }, {
        default: P(() => [j(h.$slots, "default")]),
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
}), H0 = U0, j0 = /* @__PURE__ */ B({
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
    const e = n, { nonce: t } = pr(e), r = u0(t), i = Ls(), s = i.position === "item-aligned" ? C0() : void 0, { forwardRef: o, currentElement: a } = ge();
    me(() => {
      i?.onViewportChange(a.value);
    });
    const l = D(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: h, contentWrapper: f } = s ?? {};
      if (h?.value && f?.value) {
        const p = Math.abs(l.value - d.scrollTop);
        if (p > 0) {
          const m = window.innerHeight - ft * 2, g = Number.parseFloat(f.value.style.minHeight), v = Number.parseFloat(f.value.style.height), S = Math.max(g, v);
          if (S < m) {
            const b = S + p, w = Math.min(m, b), x = b - w;
            f.value.style.height = `${w}px`, f.value.style.bottom === "0px" && (d.scrollTop = x > 0 ? x : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (M(), U(Ke, null, [$(y(de), le({
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
      default: P(() => [j(u.$slots, "default")]),
      _: 3
    }, 16), $(y(de), {
      as: "style",
      nonce: y(r)
    }, {
      default: P(() => d[0] || (d[0] = [we(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), K0 = j0;
const J0 = /* @__PURE__ */ B({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (M(), L(y(Nv), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = bt(() => {
      }, ["stop"]))
    }, {
      default: P(() => [
        $(y($v), { class: "checkbox-indicator" }, {
          default: P(() => [
            $(y(Es), {
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
}), X0 = /* @__PURE__ */ fe(J0, [["__scopeId", "data-v-024ee78b"]]), Cf = /* @__PURE__ */ Symbol("turnSelection");
function Mc(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function Y0(n, e, t) {
  const r = Ts(/* @__PURE__ */ new Map());
  let i = null;
  const s = A(() => r.size), o = A(() => r.size > 0);
  function a(v) {
    return r.has(v);
  }
  function l(v) {
    r.has(v) ? r.delete(v) : r.set(v, !0), i = v;
  }
  function c(v) {
    if (i === null) {
      l(v);
      return;
    }
    const S = n.value.map((k) => k.id), b = S.indexOf(i), w = S.indexOf(v);
    if (b === -1 || w === -1) {
      l(v);
      return;
    }
    const x = Math.min(b, w), C = Math.max(b, w);
    for (let k = x; k <= C; k++) {
      const T = S[k];
      T != null && r.set(T, !0);
    }
  }
  function u() {
    r.clear(), i = null;
  }
  async function d() {
    const S = n.value.filter((b) => r.has(b.id)).map(Mc).join(`

`);
    await navigator.clipboard.writeText(S);
  }
  async function h() {
    const S = n.value.filter((b) => r.has(b.id)).map((b) => {
      const x = (b.speakerId ? e.get(b.speakerId) : void 0)?.name ?? "", C = b.startTime != null ? Wr(b.startTime) : "", k = [x, C].filter(Boolean).join(" (") + (C ? ")" : ""), T = Mc(b);
      return k ? `${k}
${T}` : T;
    });
    await navigator.clipboard.writeText(S.join(`

`));
  }
  te(
    () => n.value,
    (v) => {
      if (r.size === 0) return;
      const S = new Set(v.map((b) => b.id));
      for (const b of [...r.keys()])
        S.has(b) || r.delete(b);
    }
  );
  const f = t.on("channel:change", u), p = t.on("translation:change", u);
  function m(v) {
    v.key === "Escape" && r.size > 0 && u();
  }
  me(() => {
    document.addEventListener("keydown", m);
  }), zt(() => {
    document.removeEventListener("keydown", m), f(), p();
  });
  const g = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: c,
    clear: u,
    copyText: d,
    copyWithMetadata: h
  };
  return Tn(Cf, g), g;
}
function Tf() {
  const n = fi(Cf);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const G0 = ["data-turn-active", "aria-selected"], Q0 = { class: "turn-text" }, Z0 = ["data-word-active"], ew = /* @__PURE__ */ B({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Et(), r = Tf(), { t: i } = ut(), s = A(() => e.turn.words.length > 0), o = A(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const f = t.audio.currentTime.value, { startTime: p, endTime: m, words: g } = e.turn;
      return p == null || m == null || f < p || f > m ? null : kd(g, f);
    }), a = A(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || ja(e.turn.words)) return !1;
      const f = t.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = A(() => e.speaker?.color ?? "transparent"), c = A(() => r.isSelected(e.turn.id)), u = A(() => {
      const f = e.speaker?.name ?? "", p = c.value ? "selection.deselect" : "selection.select";
      return i(p).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    function h(f) {
      f.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    return (f, p) => (M(), U("section", {
      class: $t(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: an({ "--speaker-color": l.value }),
      "aria-selected": y(r).hasSelection.value ? c.value : void 0
    }, [
      n.partial ? Y("", !0) : (M(), U("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        y(r).hasSelection.value ? (M(), L(X0, {
          key: 0,
          "model-value": c.value,
          "aria-label": u.value,
          onClick: bt(h, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : Y("", !0),
        $(Bd, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      K("p", Q0, [
        s.value ? (M(!0), U(Ke, { key: 0 }, cn(n.turn.words, (m, g) => (M(), U(Ke, {
          key: m.id
        }, [
          K("span", {
            class: $t({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, G(m.text), 11, Z0),
          we(G(g < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (M(), U(Ke, { key: 1 }, [
          we(G(n.turn.text), 1)
        ], 64)) : Y("", !0)
      ])
    ], 14, G0));
  }
}), Ac = /* @__PURE__ */ fe(ew, [["__scopeId", "data-v-e96e61a0"]]), tw = {}, nw = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function rw(n, e) {
  return M(), U("svg", nw, [...e[0] || (e[0] = [
    Xm('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const iw = /* @__PURE__ */ fe(tw, [["render", rw]]), sw = { class: "transcription-empty" }, ow = { class: "message" }, aw = /* @__PURE__ */ B({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = ut();
    return (t, r) => (M(), U("div", sw, [
      $(iw, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      K("p", ow, G(y(e)("transcription.empty")), 1)
    ]));
  }
}), lw = /* @__PURE__ */ fe(aw, [["__scopeId", "data-v-f82737e5"]]), cw = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function uw(n) {
  const e = Et(), t = D(!0), r = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function i() {
    const u = n.value;
    if (!u || !t.value) return;
    const d = e.audio?.activeTurnId.value, h = u.querySelector("[data-word-active]") ?? (d ? u.querySelector(`[data-turn-id="${d}"]`) : null);
    h && h.scrollIntoView({
      behavior: r ? "instant" : "smooth",
      block: "center"
    });
  }
  te(
    () => e.audio?.activeWordId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), te(
    () => e.audio?.activeTurnId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), te(
    () => e.audio?.isPlaying.value,
    (u) => {
      u && (t.value = !0);
    }
  );
  function s() {
    t.value = !1;
  }
  function o(u) {
    cw.has(u.key) && s();
  }
  function a(u) {
    const d = n.value;
    d && (d.addEventListener("wheel", u, { passive: !0 }), d.addEventListener("touchstart", u, { passive: !0 }), d.addEventListener("pointerdown", u, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function l(u) {
    const d = n.value;
    d && (d.removeEventListener("wheel", u), d.removeEventListener("touchstart", u), d.removeEventListener("pointerdown", u), d.removeEventListener("keydown", o));
  }
  me(() => {
    a(s);
  }), zt(() => {
    l(s);
  });
  function c() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: c };
}
function Te(n) {
  this.content = n;
}
Te.prototype = {
  constructor: Te,
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
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new Te(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new Te(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new Te([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new Te(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new Te(i);
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
    return n = Te.from(n), n.size ? new Te(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = Te.from(n), n.size ? new Te(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = Te.from(n);
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
Te.from = function(n) {
  if (n instanceof Te) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new Te(e);
};
function Ef(n, e, t) {
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
      let o = Ef(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function Mf(n, e, t, r) {
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
      let c = Mf(o.content, a.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= l, r -= l;
  }
}
class _ {
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
    return new _(i, this.size + e.size);
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
    return new _(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? _.empty : e == 0 && t == this.content.length ? this : new _(this.content.slice(e, t));
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
    return i[e] = t, new _(i, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new _([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new _(this.content.concat(e), this.size + e.nodeSize);
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
    return Ef(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Mf(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Ci(0, e);
    if (e == this.size)
      return Ci(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? Ci(t + 1, s) : Ci(t, r);
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
      return _.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new _(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return _.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new _(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return _.empty;
    if (e instanceof _)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new _([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
_.empty = new _([], 0);
const wo = { index: 0, offset: 0 };
function Ci(n, e) {
  return wo.index = n, wo.offset = e, wo;
}
function ns(n, e) {
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
      if (!ns(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !ns(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let ae = class oa {
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
    return this == e || this.type == e.type && ns(this.attrs, e.attrs);
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
      return oa.none;
    if (e instanceof oa)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
ae.none = [];
class rs extends Error {
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
    let r = Of(this.content, e + this.openStart, t);
    return r && new z(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new z(Af(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
    return new z(_.fromJSON(e, t.content), r, i);
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
z.empty = new z(_.empty, 0, 0);
function Af(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: a } = n.findIndex(t);
  if (i == e || s.isText) {
    if (a != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Af(s.content, e - i - 1, t - i - 1)));
}
function Of(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = Of(o.content, e - s - 1, t, o);
  return a && n.replaceChild(i, o.copy(a));
}
function dw(n, e, t) {
  if (t.openStart > n.depth)
    throw new rs("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new rs("Inconsistent open depths");
  return Df(n, e, t, 0);
}
function Df(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = Df(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, a = o.content;
      return wn(o, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: o, end: a } = fw(t, n);
      return wn(s, _f(n, o, a, e, r));
    }
  else return wn(s, is(n, e, r));
}
function Pf(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new rs("Cannot join " + e.type.name + " onto " + n.type.name);
}
function aa(n, e, t) {
  let r = n.node(t);
  return Pf(r, e.node(t)), r;
}
function bn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Dr(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (bn(n.nodeAfter, r), s++));
  for (let a = s; a < o; a++)
    bn(i.child(a), r);
  e && e.depth == t && e.textOffset && bn(e.nodeBefore, r);
}
function wn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function _f(n, e, t, r, i) {
  let s = n.depth > i && aa(n, e, i + 1), o = r.depth > i && aa(t, r, i + 1), a = [];
  return Dr(null, n, i, a), s && o && e.index(i) == t.index(i) ? (Pf(s, o), bn(wn(s, _f(n, e, t, r, i + 1)), a)) : (s && bn(wn(s, is(n, e, i + 1)), a), Dr(e, t, i, a), o && bn(wn(o, is(t, r, i + 1)), a)), Dr(r, null, i, a), new _(a);
}
function is(n, e, t) {
  let r = [];
  if (Dr(null, n, t, r), n.depth > t) {
    let i = aa(n, e, t + 1);
    bn(wn(i, is(n, e, t + 1)), r);
  }
  return Dr(e, null, t, r), new _(r);
}
function fw(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(_.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class jr {
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
      return ae.none;
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
        return new ss(this, e, r);
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
    return new jr(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Oc.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      Oc.set(e, r = new hw());
    let i = r.elts[r.i] = jr.resolve(e, t);
    return r.i = (r.i + 1) % pw, i;
  }
}
class hw {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const pw = 12, Oc = /* @__PURE__ */ new WeakMap();
class ss {
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
const mw = /* @__PURE__ */ Object.create(null);
let _t = class la {
  /**
  @internal
  */
  constructor(e, t, r, i = ae.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || _.empty;
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
    return this.type == e && ns(this.attrs, t || e.defaultAttrs || mw) && ae.sameSet(this.marks, r || ae.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new la(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new la(this.type, this.attrs, this.content, e);
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
    return dw(this.resolve(e), this.resolve(t), r);
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
    return jr.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return jr.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), If(this.marks, e);
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
  canReplace(e, t, r = _.empty, i = 0, s = r.childCount) {
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
    let e = ae.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!ae.sameSet(e, this.marks))
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
    let i = _.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
_t.prototype.text = void 0;
class as extends _t {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : If(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new as(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new as(this.type, this.attrs, e, this.marks);
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
function If(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class An {
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
    let r = new gw(e, t);
    if (r.next == null)
      return An.empty;
    let i = Nf(r);
    r.next && r.err("Unexpected trailing text");
    let s = xw(kw(i));
    return Cw(s, r), s;
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
        return _.from(a.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: u, next: d } = o.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let h = s(d, a.concat(u));
          if (h)
            return h;
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
An.empty = new An(!0);
class gw {
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
function Nf(n) {
  let e = [];
  do
    e.push(yw(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function yw(n) {
  let e = [];
  do
    e.push(vw(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function vw(n) {
  let e = Sw(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = bw(n, e);
    else
      break;
  return e;
}
function Dc(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function bw(n, e) {
  let t = Dc(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Dc(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function ww(n, e) {
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
function Sw(n) {
  if (n.eat("(")) {
    let e = Nf(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = ww(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function kw(n) {
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
function Rf(n, e) {
  return e - n;
}
function Pc(n, e) {
  let t = [];
  return r(e), t.sort(Rf);
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
function xw(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Pc(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        Pc(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new An(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let a = i[o][1].sort(Rf);
      s.next.push({ type: i[o][0], next: e[a.join(",")] || t(a) });
    }
    return s;
  }
}
function Cw(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      o.push(l.name), s && !(l.isText || l.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function $f(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Lf(n, e) {
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
function Bf(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function Ff(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new Ew(n, r, e[r]);
  return t;
}
let _c = class zf {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Ff(e, r.attrs), this.defaultAttrs = $f(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == An.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Lf(this.attrs, e);
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
    return new _t(this, this.computeAttrs(e), _.from(t), ae.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = _.from(t), this.checkContent(t), new _t(this, this.computeAttrs(e), t, ae.setFrom(r));
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
    if (e = this.computeAttrs(e), t = _.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(_.empty, !0);
    return s ? new _t(this, e, t.append(s), ae.setFrom(r)) : null;
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
    Bf(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : ae.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new zf(s, t, o));
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
function Tw(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class Ew {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? Tw(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Bs {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Ff(e, i.attrs), this.excluded = null;
    let s = $f(this.attrs);
    this.instance = s ? new ae(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new ae(this, Lf(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Bs(s, i++, t, o)), r;
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
    Bf(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let Vf = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = Te.from(e.nodes), t.marks = Te.from(e.marks || {}), this.nodes = _c.compile(this.spec.nodes, this), this.marks = Bs.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", a = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = An.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = a == "_" ? null : a ? Ic(this, a.split(" ")) : a == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : Ic(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => _t.fromJSON(this, i), this.markFromJSON = (i) => ae.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof _c) {
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
    return new as(r, r.defaultAttrs, e, ae.setFrom(t));
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
function Ic(n, e) {
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
function Mw(n) {
  return n.tag != null;
}
function Aw(n) {
  return n.style != null;
}
let Pr = class ca {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (Mw(i))
        this.tags.push(i);
      else if (Aw(i)) {
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
    let r = new Rc(this, t, !1);
    return r.addAll(e, ae.none, t.from, t.to), r.finish();
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
    let r = new Rc(this, t, !0);
    return r.addAll(e, ae.none, t.from, t.to), z.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (Pw(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(o = $c(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = $c(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new ca(e, ca.schemaRules(e)));
  }
};
const qf = {
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
}, Ow = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Wf = { ol: !0, ul: !0 }, Kr = 1, ua = 2, _r = 4;
function Nc(n, e, t) {
  return e != null ? (e ? Kr : 0) | (e === "full" ? ua : 0) : n && n.whitespace == "pre" ? Kr | ua : t & ~_r;
}
class Ti {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = ae.none, this.match = s || (o & _r ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(_.from(e));
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
    if (!(this.options & Kr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = _.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(_.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !qf.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Rc {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = Nc(null, t.preserveWhitespace, 0) | (r ? _r : 0);
    i ? s = new Ti(i.type, i.attrs, ae.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new Ti(null, null, ae.none, !0, null, o) : s = new Ti(e.schema.topNodeType, null, ae.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & ua ? "full" : this.localPreserveWS || (i.options & Kr) > 0, { schema: o } = this.parser;
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
    Wf.hasOwnProperty(o) && this.parser.normalizeLists && Dw(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : Ow.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, u = this.needsBlock;
      if (qf.hasOwnProperty(o))
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
      let o = ae.none;
      for (let a of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(a.type) : Lc(a.type, e.type)) && (o = a.addToSet(o));
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
    let a = Nc(e, s, o.options);
    o.options & _r && o.content.length == 0 && (a |= _r);
    let l = ae.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : Lc(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new Ti(e, t, l, i, null, a)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Kr);
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
function Dw(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Wf.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Pw(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function $c(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Lc(n, e) {
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
class Rn {
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
    r || (r = So(t).createDocumentFragment());
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
    let { dom: r, contentDOM: i } = Li(So(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && Li(So(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Li(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Rn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Bc(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Bc(e.marks);
  }
}
function Bc(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function So(n) {
  return n.document || window.document;
}
const Fc = /* @__PURE__ */ new WeakMap();
function _w(n) {
  let e = Fc.get(n);
  return e === void 0 && Fc.set(n, e = Iw(n)), e;
}
function Iw(n) {
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
function Li(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = _w(r)) && s.indexOf(e) > -1)
    throw new RangeError("Using an array from an attribute object as a DOM spec. This may be an attempted cross site scripting attack.");
  let o = i.indexOf(" ");
  o > 0 && (t = i.slice(0, o), i = i.slice(o + 1));
  let a, l = t ? n.createElementNS(t, i) : n.createElement(i), c = e[1], u = 1;
  if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
    u = 2;
    for (let d in c)
      if (c[d] != null) {
        let h = d.indexOf(" ");
        h > 0 ? l.setAttributeNS(d.slice(0, h), d.slice(h + 1), c[d]) : d == "style" && l.style ? l.style.cssText = c[d] : l.setAttribute(d, c[d]);
      }
  }
  for (let d = u; d < e.length; d++) {
    let h = e[d];
    if (h === 0) {
      if (d < e.length - 1 || d > u)
        throw new RangeError("Content hole must be the only child of its parent node");
      return { dom: l, contentDOM: l };
    } else {
      let { dom: f, contentDOM: p } = Li(n, h, t, r);
      if (l.appendChild(f), p) {
        if (a)
          throw new RangeError("Multiple content holes");
        a = p;
      }
    }
  }
  return { dom: l, contentDOM: a };
}
const Uf = 65535, Hf = Math.pow(2, 16);
function Nw(n, e) {
  return n + e * Hf;
}
function zc(n) {
  return n & Uf;
}
function Rw(n) {
  return (n - (n & Uf)) / Hf;
}
const jf = 1, Kf = 2, Bi = 4, Jf = 8;
class da {
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
    return (this.delInfo & Jf) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (jf | Bi)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Kf | Bi)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & Bi) > 0;
  }
}
class tt {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && tt.empty)
      return tt.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = zc(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Rw(e);
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
        let h = c ? e == l ? -1 : e == d ? 1 : t : t, f = l + i + (h < 0 ? 0 : u);
        if (r)
          return f;
        let p = e == (t < 0 ? l : d) ? null : Nw(a / 3, e - l), m = e == l ? Kf : e == d ? jf : Bi;
        return (t < 0 ? e != l : e != d) && (m |= Jf), new da(f, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new da(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = zc(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
    return new tt(this.ranges, !this.inverted);
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
    return e == 0 ? tt.empty : new tt(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
tt.empty = new tt([]);
class ls {
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
    return new ls(this._maps, this.mirror, e, t);
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
    let e = new ls();
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
    return r ? e : new da(e, i, null);
  }
}
const ko = /* @__PURE__ */ Object.create(null);
class $e {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return tt.empty;
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
    let r = ko[t.stepType];
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
    if (e in ko)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return ko[e] = t, t.prototype.jsonID = e, t;
  }
}
class ve {
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
    return new ve(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new ve(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, i) {
    try {
      return ve.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof rs)
        return ve.fail(s.message);
      throw s;
    }
  }
}
function sl(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(sl(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return _.fromArray(r);
}
class Xt extends $e {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new z(sl(t.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return ve.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new ht(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Xt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Xt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Xt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Xt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
$e.jsonID("addMark", Xt);
class ht extends $e {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new z(sl(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return ve.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Xt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ht(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ht && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ht(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new ht(t.from, t.to, e.markFromJSON(t.mark));
  }
}
$e.jsonID("removeMark", ht);
class Yt extends $e {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return ve.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return ve.fromReplace(e, this.pos, this.pos + 1, new z(_.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new Yt(this.pos, t.marks[i]);
        return new Yt(this.pos, this.mark);
      }
    }
    return new On(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Yt(t.pos, this.mark);
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
    return new Yt(t.pos, e.markFromJSON(t.mark));
  }
}
$e.jsonID("addNodeMark", Yt);
class On extends $e {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return ve.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return ve.fromReplace(e, this.pos, this.pos + 1, new z(_.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Yt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new On(t.pos, this.mark);
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
    return new On(t.pos, e.markFromJSON(t.mark));
  }
}
$e.jsonID("removeNodeMark", On);
class Se extends $e {
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
    return this.structure && fa(e, this.from, this.to) ? ve.fail("Structure replace would overwrite content") : ve.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new tt([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Se(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new Se(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof Se) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? z.empty : new z(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Se(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? z.empty : new z(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Se(e.from, this.to, t, this.structure);
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
    return new Se(t.from, t.to, z.fromJSON(e, t.slice), !!t.structure);
  }
}
$e.jsonID("replace", Se);
class ke extends $e {
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
    if (this.structure && (fa(e, this.from, this.gapFrom) || fa(e, this.gapTo, this.to)))
      return ve.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return ve.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? ve.fromReplace(e, this.from, this.to, r) : ve.fail("Content does not fit in gap");
  }
  getMap() {
    return new tt([
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
    return new ke(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new ke(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new ke(t.from, t.to, t.gapFrom, t.gapTo, z.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
$e.jsonID("replaceAround", ke);
function fa(n, e, t) {
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
function $w(n, e, t, r) {
  let i = [], s = [], o, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), f = Math.min(c + l.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == h && o.mark.eq(d[m]) ? o.to = f : i.push(o = new ht(h, f, d[m])));
      a && a.to == h ? a.to = f : s.push(a = new Xt(h, f, r));
    }
  }), i.forEach((l) => n.step(l)), s.forEach((l) => n.step(l));
}
function Lw(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof Bs) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (l || (l = [])).push(u), c = u.removeFromSet(c);
    } else r ? r.isInSet(o.marks) && (l = [r]) : l = o.marks;
    if (l && l.length) {
      let c = Math.min(a + o.nodeSize, t);
      for (let u = 0; u < l.length; u++) {
        let d = l[u], h;
        for (let f = 0; f < i.length; f++) {
          let p = i[f];
          p.step == s - 1 && d.eq(i[f].style) && (h = p);
        }
        h ? (h.to = c, h.step = s) : i.push({ style: d, from: Math.max(a, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => n.step(new ht(o.from, o.to, o.style)));
}
function ol(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], a = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let c = s.child(l), u = a + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new Se(a, u, z.empty));
    else {
      r = d;
      for (let h = 0; h < c.marks.length; h++)
        t.allowsMarkType(c.marks[h].type) || n.step(new ht(a, u, c.marks[h]));
      if (i && c.isText && t.whitespace != "pre") {
        let h, f = /\r?\n|\r/g, p;
        for (; h = f.exec(c.text); )
          p || (p = new z(_.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new Se(a + h.index, a + h.index + h[0].length, p));
      }
    }
    a = u;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(_.empty, !0);
    n.replace(a, a, new z(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    n.step(o[l]);
}
function Bw(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function gr(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), a = n.$from.index(r) + i, l = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(a, l, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Bw(o, a, l))
      break;
    a && (i = 1), l < o.childCount && (s = 1);
  }
  return null;
}
function Fw(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, u = _.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = _.from(r.node(p).copy(u)), d++) : l--;
  let h = _.empty, f = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, h = _.from(i.node(p).copy(h)), f++) : c++;
  n.step(new ke(l, c, o, a, new z(u.append(h), d, f), u.size - d, !0));
}
function Xf(n, e, t = null, r = n) {
  let i = zw(n, e), s = i && Vw(r, e);
  return s ? i.map(Vc).concat({ type: e, attrs: t }).concat(s.map(Vc)) : null;
}
function Vc(n) {
  return { type: n, attrs: null };
}
function zw(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function Vw(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function qw(n, e, t) {
  let r = _.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let a = t[o].type.contentMatch.matchFragment(r);
      if (!a || !a.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = _.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new ke(i, s, i, s, new z(r, 0, 0), t.length, !0));
}
function Ww(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, a) => {
    let l = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, l) && Uw(n.doc, n.mapping.slice(s).map(a), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let f = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        f && !p ? c = !1 : !f && p && (c = !0);
      }
      c === !1 && Gf(n, o, a, s), ol(n, n.mapping.slice(s).map(a, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(a, 1), h = u.map(a + o.nodeSize, 1);
      return n.step(new ke(d, h, d + 1, h - 1, new z(_.from(r.create(l, null, o.marks)), 0, 0), 1, !0)), c === !0 && Yf(n, o, a, s), !1;
    }
  });
}
function Yf(n, e, t, r) {
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
function Gf(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Uw(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Hw(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new ke(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new z(_.from(o), 0, 0), 1, !0));
}
function It(n, e, t = 1, r) {
  let i = n.resolve(e), s = i.depth - t, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, u = t - 2; c > s; c--, u--) {
    let d = i.node(c), h = i.index(c);
    if (d.type.spec.isolating)
      return !1;
    let f = d.content.cutByIndex(h, d.childCount), p = r && r[u + 1];
    p && (f = f.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[u] || d;
    if (!d.canReplace(h + 1, d.childCount) || !m.type.validContent(f))
      return !1;
  }
  let a = i.indexAfter(s), l = r && r[0];
  return i.node(s).canReplaceWith(a, a, l ? l.type : i.node(s + 1).type);
}
function jw(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = _.empty, o = _.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    s = _.from(i.node(a).copy(s));
    let u = r && r[c];
    o = _.from(u ? u.type.create(u.attrs, o) : i.node(a).copy(o));
  }
  n.step(new Se(e, e, new z(s.append(o), t, t), !0));
}
function $n(n, e) {
  let t = n.resolve(e), r = t.index();
  return Qf(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Kw(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function Qf(n, e) {
  return !!(n && e && !n.isLeaf && Kw(n, e));
}
function Fs(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && Qf(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Jw(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let a = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    Gf(n, u.node(), u.before(), a);
  }
  o.inlineContent && ol(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let l = n.mapping.slice(a), c = l.map(e - t);
  if (n.step(new Se(c, l.map(e + t, -1), z.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Yf(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function Xw(n, e, t) {
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
function Yw(n, e, t) {
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
function zs(n, e, t = e, r = z.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Zf(i, s, r) ? new Se(e, t, r) : new Gw(i, s, r).fit();
}
function Zf(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Gw {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = _.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = _.from(e.node(i).copy(this.placed));
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
    return e > -1 ? new ke(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new Se(r.pos, i.pos, l) : null;
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
        r ? (s = xo(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let a = this.depth; a >= 0; a--) {
          let { type: l, match: c } = this.frontier[a], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(_.from(o), !1)) : s && l.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, wrap: u };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = xo(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new z(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = xo(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new z(xr(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new z(xr(e, t, 1), t, r);
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
    let o = this.unplaced, a = r ? r.content : o.content, l = o.openStart - e, c = 0, u = [], { match: d, type: h } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        u.push(i.child(m));
      d = d.matchFragment(i);
    }
    let f = a.size + e - (o.content.size - o.openEnd);
    for (; c < a.childCount; ) {
      let m = a.child(c), g = d.matchType(m.type);
      if (!g)
        break;
      c++, (c > 1 || l == 0 || m.content.size) && (d = g, u.push(eh(m.mark(h.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? f : -1)));
    }
    let p = c == a.childCount;
    p || (f = -1), this.placed = Cr(this.placed, t, _.from(u)), this.frontier[t].match = d, p && f < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = a; m < f; m++) {
      let v = g.lastChild;
      this.frontier.push({ type: v.type, match: v.contentMatchAt(v.childCount) }), g = v.content;
    }
    this.unplaced = p ? e == 0 ? z.empty : new z(xr(o.content, e - 1, 1), e - 1, f < 0 ? o.openEnd : e - 1) : new z(xr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Co(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Co(e, t, i, r, s);
      if (o) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], u = Co(e, a, c, l, !0);
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
    t.fit.childCount && (this.placed = Cr(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Cr(this.placed, this.depth, _.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(_.empty, !0);
    t.childCount && (this.placed = Cr(this.placed, this.frontier.length, t));
  }
}
function xr(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(xr(n.firstChild.content, e - 1, t)));
}
function Cr(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Cr(n.lastChild.content, e - 1, t)));
}
function xo(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function eh(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, eh(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(_.empty, !0)))), n.copy(r);
}
function Co(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !Qw(t, s.content, o) ? a : null;
}
function Qw(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Zw(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function eS(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Zf(i, s, r))
    return n.step(new Se(e, t, r));
  let o = nh(i, s);
  o[o.length - 1] == 0 && o.pop();
  let a = -(i.depth + 1);
  o.unshift(a);
  for (let h = i.depth, f = i.pos - 1; h > 0; h--, f--) {
    let p = i.node(h).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(h) > -1 ? a = h : i.before(h) == f && o.splice(1, 0, -h);
  }
  let l = o.indexOf(a), c = [], u = r.openStart;
  for (let h = r.content, f = 0; ; f++) {
    let p = h.firstChild;
    if (c.push(p), f == r.openStart)
      break;
    h = p.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let f = c[h], p = Zw(f.type);
    if (p && !f.sameMarkup(i.node(Math.abs(a) - 1)))
      u = h;
    else if (p || !f.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let f = (h + u + 1) % (r.openStart + 1), p = c[f];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + l) % o.length], v = !0;
        g < 0 && (v = !1, g = -g);
        let S = i.node(g - 1), b = i.index(g - 1);
        if (S.canReplaceWith(b, b, p.type, p.marks))
          return n.replace(i.before(g), v ? s.after(g) : t, new z(th(r.content, 0, r.openStart, f), f, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let h = o.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); h--) {
    let f = o[h];
    f < 0 || (e = i.before(f), t = s.after(f));
  }
}
function th(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(th(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(_.empty, !0));
  }
  return n;
}
function tS(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Xw(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new z(_.from(r), 0, 0));
}
function nS(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = nh(r, i);
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
function nh(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class Gn extends $e {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return ve.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return ve.fromReplace(e, this.pos, this.pos + 1, new z(_.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return tt.empty;
  }
  invert(e) {
    return new Gn(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Gn(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Gn(t.pos, t.attr, t.value);
  }
}
$e.jsonID("attr", Gn);
class Jr extends $e {
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
    return ve.ok(r);
  }
  getMap() {
    return tt.empty;
  }
  invert(e) {
    return new Jr(this.attr, e.attrs[this.attr]);
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
    return new Jr(t.attr, t.value);
  }
}
$e.jsonID("docAttr", Jr);
let ir = class extends Error {
};
ir = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
ir.prototype = Object.create(Error.prototype);
ir.prototype.constructor = ir;
ir.prototype.name = "TransformError";
class rh {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new ls();
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
      throw new ir(t.failed);
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
    let i = zs(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new z(_.from(r), 0, 0));
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
    return eS(this, e, t, r), this;
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
    return tS(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return nS(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Fw(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Jw(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return qw(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Ww(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Hw(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Gn(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Jr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Yt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof ae)
      t.isInSet(r.marks) && this.step(new On(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new On(e, s)), i = s.removeFromSet(i);
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
    return jw(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return $w(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return Lw(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return ol(this, e, t, r), this;
  }
}
const To = /* @__PURE__ */ Object.create(null);
class ne {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new rS(e.min(t), e.max(t))];
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
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? z.empty : t), a == 0 && Uc(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), Uc(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new Z(e) : Kn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Kn(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Kn(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Xe(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Kn(e, e, 0, 0, 1) || new Xe(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Kn(e, e, e.content.size, e.childCount, -1) || new Xe(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = To[t.type];
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
    if (e in To)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return To[e] = t, t.prototype.jsonID = e, t;
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
    return Z.between(this.$anchor, this.$head).getBookmark();
  }
}
ne.prototype.visible = !0;
class rS {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let qc = !1;
function Wc(n) {
  !qc && !n.parent.inlineContent && (qc = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class Z extends ne {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Wc(e), Wc(t), super(e, t);
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
      return ne.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new Z(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = z.empty) {
    if (super.replace(e, t), t == z.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof Z && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Vs(this.anchor, this.head);
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
    return new Z(e.resolve(t.anchor), e.resolve(t.head));
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
      let s = ne.findFrom(t, r, !0) || ne.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return ne.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (ne.findFrom(e, -r, !0) || ne.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new Z(e, t);
  }
}
ne.jsonID("text", Z);
class Vs {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Vs(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return Z.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class J extends ne {
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
    return r ? ne.near(s) : new J(s);
  }
  content() {
    return new z(_.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof J && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new al(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new J(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new J(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
J.prototype.visible = !1;
ne.jsonID("node", J);
class al {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Vs(r, r) : new al(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && J.isSelectable(r) ? new J(t) : ne.near(t);
  }
}
class Xe extends ne {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = z.empty) {
    if (t == z.empty) {
      e.delete(0, e.doc.content.size);
      let r = ne.atStart(e.doc);
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
    return new Xe(e);
  }
  map(e) {
    return new Xe(e);
  }
  eq(e) {
    return e instanceof Xe;
  }
  getBookmark() {
    return iS;
  }
}
ne.jsonID("all", Xe);
const iS = {
  map() {
    return this;
  },
  resolve(n) {
    return new Xe(n);
  }
};
function Kn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return Z.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && J.isSelectable(a))
        return J.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = Kn(n, a, t + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function Uc(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof Se || i instanceof ke))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((a, l, c, u) => {
    o == null && (o = u);
  }), n.setSelection(ne.near(n.doc.resolve(o), t));
}
const Hc = 1, Ei = 2, jc = 4;
class sS extends rh {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Hc) & ~Ei, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Hc) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Ei, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return ae.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & Ei) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Ei, this.storedMarks = null;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || ae.none))), r.replaceWith(this, e), this;
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
      return this.replaceRangeWith(t, r, i.text(e, s)), !this.selection.empty && this.selection.to == t + e.length && this.setSelection(ne.near(this.selection.$to)), this;
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
    return this.updated |= jc, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & jc) > 0;
  }
}
function Kc(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Tr {
  constructor(e, t, r) {
    this.name = e, this.init = Kc(t.init, r), this.apply = Kc(t.apply, r);
  }
}
const oS = [
  new Tr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Tr("selection", {
    init(n, e) {
      return n.selection || ne.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Tr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Tr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class Eo {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = oS.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Tr(r.key, r.spec.state, r));
    });
  }
}
class Xn {
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
    let t = new Xn(this.config), r = this.config.fields;
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
    return new sS(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new Eo(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Xn(t);
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
    let t = new Eo(this.schema, e.plugins), r = t.fields, i = new Xn(t);
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
    let i = new Eo(e.schema, e.plugins), s = new Xn(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = _t.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = ne.fromJSON(s.doc, t.selection);
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
function ih(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = ih(i, e, {})), t[r] = i;
  }
  return t;
}
class _e {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && ih(e.props, this, this.props), this.key = e.key ? e.key.key : sh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Mo = /* @__PURE__ */ Object.create(null);
function sh(n) {
  return n in Mo ? n + "$" + ++Mo[n] : (Mo[n] = 0, n + "$");
}
class Qe {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = sh(e);
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
const ll = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function oh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const ah = (n, e, t) => {
  let r = oh(n, t);
  if (!r)
    return !1;
  let i = cl(r);
  if (!i) {
    let o = r.blockRange(), a = o && gr(o);
    return a == null ? !1 : (e && e(n.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (yh(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (sr(s, "end") || J.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let a = zs(n.doc, r.before(o), r.after(o), z.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = n.tr.step(a);
          l.setSelection(sr(s, "end") ? ne.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : J.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, aS = (n, e, t) => {
  let r = oh(n, t);
  if (!r)
    return !1;
  let i = cl(r);
  return i ? lh(n, i, e) : !1;
}, lS = (n, e, t) => {
  let r = uh(n, t);
  if (!r)
    return !1;
  let i = ul(r);
  return i ? lh(n, i, e) : !1;
};
function lh(n, e, t) {
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
  let c = zs(n.doc, s, l, z.empty);
  if (!c || c.from != s || c instanceof Se && c.slice.size >= l - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(Z.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function sr(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const ch = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = cl(r);
  }
  let o = s && s.nodeBefore;
  return !o || !J.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(J.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function cl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function uh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const dh = (n, e, t) => {
  let r = uh(n, t);
  if (!r)
    return !1;
  let i = ul(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (yh(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (sr(s, "start") || J.isSelectable(s))) {
    let o = zs(n.doc, r.before(), r.after(), z.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = n.tr.step(o);
        a.setSelection(sr(s, "start") ? ne.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : J.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, fh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = ul(r);
  }
  let o = s && s.nodeAfter;
  return !o || !J.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(J.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function ul(n) {
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
const cS = (n, e) => {
  let t = n.selection, r = t instanceof J, i;
  if (r) {
    if (t.node.isTextblock || !$n(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Fs(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(J.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, uS = (n, e) => {
  let t = n.selection, r;
  if (t instanceof J) {
    if (t.node.isTextblock || !$n(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Fs(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, dS = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && gr(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, hh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function dl(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const fS = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = dl(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(ne.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, ph = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Xe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = dl(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(o, s.createAndFill());
    a.setSelection(Z.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, mh = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (It(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && gr(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function gh(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof J && e.selection.node.isBlock)
      return !r.parentOffset || !It(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, a, l = !1, c = !1;
    for (let f = r.depth; ; f--)
      if (r.node(f).isBlock) {
        l = r.end(f) == r.pos + (r.depth - f), c = r.start(f) == r.pos - (r.depth - f), a = dl(r.node(f - 1).contentMatchAt(r.indexAfter(f - 1)));
        let m = n && n(i.parent, l, r);
        s.unshift(m || (l && a ? { type: a } : null)), o = f;
        break;
      } else {
        if (f == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof Z || e.selection instanceof Xe) && u.deleteSelection();
    let d = u.mapping.map(r.pos), h = It(u.doc, d, s.length, s);
    if (h || (s[0] = a ? { type: a } : null, h = It(u.doc, d, s.length, s)), !h)
      return !1;
    if (u.split(d, s.length, s), !l && c && r.node(o).type != a) {
      let f = u.mapping.map(r.before(o)), p = u.doc.resolve(f);
      a && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, a) && u.setNodeMarkup(u.mapping.map(r.before(o)), a);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const hS = gh(), pS = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(J.create(n.doc, i))), !0);
};
function mS(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || $n(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function yh(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, a, l = i.type.spec.isolating || s.type.spec.isolating;
  if (!l && mS(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (a = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && a.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let f = e.pos + s.nodeSize, p = _.empty;
      for (let v = o.length - 1; v >= 0; v--)
        p = _.from(o[v].create(null, p));
      p = _.from(i.copy(p));
      let m = n.tr.step(new ke(e.pos - 1, f, e.pos, f, new z(p, 1, 0), o.length, !0)), g = m.doc.resolve(f + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && $n(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && l ? null : ne.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), h = d && gr(d);
  if (h != null && h >= e.depth)
    return t && t(n.tr.lift(d, h).scrollIntoView()), !0;
  if (c && sr(s, "start", !0) && sr(i, "end")) {
    let f = i, p = [];
    for (; p.push(f), !f.isTextblock; )
      f = f.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (f.canReplace(f.childCount, f.childCount, m.content)) {
      if (t) {
        let v = _.empty;
        for (let b = p.length - 1; b >= 0; b--)
          v = _.from(p[b].copy(v));
        let S = n.tr.step(new ke(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new z(v, p.length, 0), 0, !0));
        t(S.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function vh(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection(Z.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const gS = vh(-1), yS = vh(1);
function vS(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), a = o && Xf(o, n, e);
    return a ? (r && r(t.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function Jc(n, e = null) {
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
function fl(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
fl(ll, ah, ch);
fl(ll, dh, fh);
fl(hh, ph, mh, hS);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function bS(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let a = r ? t.tr : null;
    return wS(a, o, n, e) ? (r && r(a.scrollIntoView()), !0) : !1;
  };
}
function wS(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = o.resolve(e.start - 2);
    s = new ss(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new ss(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = Xf(s, t, r, e);
  return a ? (n && SS(n, e, a, i, t), !0) : !1;
}
function SS(n, e, t, r, i) {
  let s = _.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = _.from(t[u].type.create(t[u].attrs, s));
  n.step(new ke(e.start - (r ? 2 : 0), e.end, e.start, e.end, new z(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let a = t.length - o, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, h = !0; u < d; u++, h = !1)
    !h && It(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function kS(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? xS(e, t, n, s) : CS(e, t, s) : !0 : !1;
  };
}
function xS(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new ke(s - 1, o, s, o, new z(_.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ss(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = gr(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return $n(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function CS(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let f = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    f -= i.child(p).nodeSize, r.delete(f - 1, f + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let a = t.startIndex == 0, l = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (a ? 0 : 1), u + 1, o.content.append(l ? _.empty : _.from(i))))
    return !1;
  let d = s.pos, h = d + o.nodeSize;
  return r.step(new ke(d - (a ? 1 : 0), h + (l ? 1 : 0), d + 1, h - 1, new z((a ? _.empty : _.from(i.copy(_.empty))).append(l ? _.empty : _.from(i.copy(_.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function TS(n) {
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
      let c = l.lastChild && l.lastChild.type == a.type, u = _.from(c ? n.create() : null), d = new z(_.from(n.create(null, _.from(a.type.create(null, u)))), c ? 3 : 1, 0), h = s.start, f = s.end;
      t(e.tr.step(new ke(h - (c ? 3 : 1), f, h, f, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Ae = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, or = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let ha = null;
const Dt = function(n, e, t) {
  let r = ha || (ha = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, ES = function() {
  ha = null;
}, Dn = function(n, e, t, r) {
  return t && (Xc(n, e, t, r, -1) || Xc(n, e, t, r, 1));
}, MS = /^(img|br|input|textarea|hr)$/i;
function Xc(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : at(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || pi(n) || MS.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Ae(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? at(n) : 0;
    } else
      return !1;
  }
}
function at(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function AS(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = at(n);
    } else if (n.parentNode && !pi(n))
      e = Ae(n), n = n.parentNode;
    else
      return null;
  }
}
function OS(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !pi(n))
      e = Ae(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function DS(n, e, t) {
  for (let r = e == 0, i = e == at(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Ae(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == at(n);
  }
}
function pi(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const qs = function(n) {
  return n.focusNode && Dn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function pn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function PS(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function _S(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(at(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(at(r.startContainer), r.startOffset) };
  }
}
const Ct = typeof navigator < "u" ? navigator : null, Yc = typeof document < "u" ? document : null, dn = Ct && Ct.userAgent || "", pa = /Edge\/(\d+)/.exec(dn), bh = /MSIE \d/.exec(dn), ma = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(dn), Ye = !!(bh || ma || pa), Qt = bh ? document.documentMode : ma ? +ma[1] : pa ? +pa[1] : 0, lt = !Ye && /gecko\/(\d+)/i.test(dn);
lt && +(/Firefox\/(\d+)/.exec(dn) || [0, 0])[1];
const ga = !Ye && /Chrome\/(\d+)/.exec(dn), De = !!ga, wh = ga ? +ga[1] : 0, Re = !Ye && !!Ct && /Apple Computer/.test(Ct.vendor), ar = Re && (/Mobile\/\w+/.test(dn) || !!Ct && Ct.maxTouchPoints > 2), st = ar || (Ct ? /Mac/.test(Ct.platform) : !1), Sh = Ct ? /Win/.test(Ct.platform) : !1, Pt = /Android \d/.test(dn), mi = !!Yc && "webkitFontSmoothing" in Yc.documentElement.style, IS = mi ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function NS(n) {
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
function Ot(n, e) {
  return typeof n == "number" ? n : n[e];
}
function RS(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function Gc(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = or(o);
      continue;
    }
    let a = o, l = a == s.body, c = l ? NS(s) : RS(a), u = 0, d = 0;
    if (e.top < c.top + Ot(r, "top") ? d = -(c.top - e.top + Ot(i, "top")) : e.bottom > c.bottom - Ot(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + Ot(i, "top") - c.top : e.bottom - c.bottom + Ot(i, "bottom")), e.left < c.left + Ot(r, "left") ? u = -(c.left - e.left + Ot(i, "left")) : e.right > c.right - Ot(r, "right") && (u = e.right - c.right + Ot(i, "right")), u || d)
      if (l)
        s.defaultView.scrollBy(u, d);
      else {
        let f = a.scrollLeft, p = a.scrollTop;
        d && (a.scrollTop += d), u && (a.scrollLeft += u);
        let m = a.scrollLeft - f, g = a.scrollTop - p;
        e = { left: e.left - m, top: e.top - g, right: e.right - m, bottom: e.bottom - g };
      }
    let h = l ? "fixed" : getComputedStyle(o).position;
    if (/^(fixed|sticky)$/.test(h))
      break;
    o = h == "absolute" ? o.offsetParent : or(o);
  }
}
function $S(n) {
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
  return { refDOM: r, refTop: i, stack: kh(n.dom) };
}
function kh(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = or(r))
    ;
  return e;
}
function LS({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  xh(t, r == 0 ? 0 : r - e);
}
function xh(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let qn = null;
function BS(n) {
  if (n.setActive)
    return n.setActive();
  if (qn)
    return n.focus(qn);
  let e = kh(n);
  n.focus(qn == null ? {
    get preventScroll() {
      return qn = { preventScroll: !0 }, !0;
    }
  } : void 0), qn || (qn = !1, xh(e, 0));
}
function Ch(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, a = e.top, l, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let h;
    if (u.nodeType == 1)
      h = u.getClientRects();
    else if (u.nodeType == 3)
      h = Dt(u).getClientRects();
    else
      continue;
    for (let f = 0; f < h.length; f++) {
      let p = h[f];
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
  return !t && l && (t = l, i = c, r = 0), t && t.nodeType == 3 ? FS(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Ch(t, i);
}
function FS(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = Ht(r, 1);
    if (o.top != o.bottom && hl(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function hl(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function zS(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function VS(n, e, t) {
  let { node: r, offset: i } = Ch(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function qS(n, e, t, r) {
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
function Th(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let a = o.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (hl(e, c))
            return Th(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function WS(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = _S(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), a;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!hl(e, c) || (o = Th(n.dom, e, c), !o))
      return null;
  }
  if (Re)
    for (let c = o; r && c; c = or(c))
      c.draggable && (r = void 0);
  if (o = zS(o, e), r) {
    if (lt && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    mi && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? a = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (a = qS(n, r, i, e));
  }
  a == null && (a = VS(n, o, e));
  let l = n.docView.nearestDesc(o, !0);
  return { pos: a, inside: l ? l.posAtStart - l.border : -1 };
}
function Qc(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Ht(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Qc(r))
      return r;
  }
  return Array.prototype.find.call(t, Qc) || n.getBoundingClientRect();
}
const US = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Eh(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = mi || lt;
  if (r.nodeType == 3)
    if (o && (US.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = Ht(Dt(r, i, i), t);
      if (lt && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Ht(Dt(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = Ht(Dt(r, i, i + 1), -1);
          if (u.top != l.top)
            return Sr(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, Sr(Ht(Dt(r, l, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == at(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return Ao(l.getBoundingClientRect(), !1);
    }
    if (s == null && i < at(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return Ao(l.getBoundingClientRect(), !0);
    }
    return Ao(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == at(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? Dt(l, at(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return Sr(Ht(c, 1), !1);
  }
  if (s == null && i < at(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? Dt(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return Sr(Ht(c, -1), !0);
  }
  return Sr(Ht(r.nodeType == 3 ? Dt(r) : r, -t), t >= 0);
}
function Sr(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Ao(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function Mh(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function HS(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return Mh(n, e, () => {
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
    let o = Eh(n, i.pos, 1);
    for (let a = s.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = Dt(a, 0, a.nodeValue.length).getClientRects();
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
const jS = /[\u0590-\u08ac]/;
function KS(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, a = n.domSelection();
  return a ? !jS.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? s : o : Mh(n, e, () => {
    let { focusNode: l, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), h = a.caretBidiLevel;
    a.modify("move", t, "character");
    let f = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !f.contains(p.nodeType == 1 ? p : p.parentNode) || l == p && c == m;
    try {
      a.collapse(u, d), l && (l != u || c != d) && a.extend && a.extend(l, c);
    } catch {
    }
    return h != null && (a.caretBidiLevel = h), g;
  }) : r.pos == r.start() || r.pos == r.end();
}
let Zc = null, eu = null, tu = !1;
function JS(n, e, t) {
  return Zc == e && eu == t ? tu : (Zc = e, eu = t, tu = t == "up" || t == "down" ? HS(n, e, t) : KS(n, e, t));
}
const ct = 0, nu = 1, gn = 2, Tt = 3;
class gi {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = ct, r.pmViewDesc = this;
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
      i = t > Ae(this.contentDOM);
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
      if (a > e || o instanceof Oh) {
        i = e - s;
        break;
      }
      s = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof Ah && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Ae(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Ae(s.dom) : this.contentDOM.childNodes.length };
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
          let h = this.children[d - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            i = Ae(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || a == this.children.length - 1)) {
        t = c;
        for (let u = a + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            s = Ae(d.dom);
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
    for (let f = 0, p = 0; f < this.children.length; f++) {
      let m = this.children[f], g = p + m.size;
      if (s > p && o < g)
        return m.setSelection(e - p - m.border, t - p - m.border, r, i);
      p = g;
    }
    let a = this.domFromPos(e, e ? -1 : 1), l = t == e ? a : this.domFromPos(t, t ? -1 : 1), c = r.root.getSelection(), u = r.domSelectionRange(), d = !1;
    if ((lt || Re) && e == t) {
      let { node: f, offset: p } = a;
      if (f.nodeType == 3) {
        if (d = !!(p && f.nodeValue[p - 1] == `
`), d && p == f.nodeValue.length)
          for (let m = f, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (a = l = { node: g.parentNode, offset: Ae(g) + 1 });
              break;
            }
            let v = m.pmViewDesc;
            if (v && v.node && v.node.isBlock)
              break;
          }
      } else {
        let m = f.childNodes[p - 1];
        d = m && (m.nodeName == "BR" || m.contentEditable == "false");
      }
    }
    if (lt && u.focusNode && u.focusNode != l.node && u.focusNode.nodeType == 1) {
      let f = u.focusNode.childNodes[u.focusOffset];
      f && f.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Re) && Dn(a.node, a.offset, u.anchorNode, u.anchorOffset) && Dn(l.node, l.offset, u.focusNode, u.focusOffset))
      return;
    let h = !1;
    if ((c.extend || e == t) && !(d && lt)) {
      c.collapse(a.node, a.offset);
      try {
        e != t && c.extend(l.node, l.offset), h = !0;
      } catch {
      }
    }
    if (!h) {
      if (e > t) {
        let p = a;
        a = l, l = p;
      }
      let f = document.createRange();
      f.setEnd(l.node, l.offset), f.setStart(a.node, a.offset), c.removeAllRanges(), c.addRange(f);
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
          this.dirty = e == r || t == o ? gn : nu, e == a && t == l && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = Tt : s.markDirty(e - a, t - a);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? gn : Tt;
      }
      r = o;
    }
    this.dirty = gn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? gn : nu;
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
class Ah extends gi {
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
    return this.dirty == ct && e.type.eq(this.widget.type);
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
class XS extends gi {
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
class Pn extends gi {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Rn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new Pn(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & Tt || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != Tt && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != ct) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = ct;
    }
  }
  slice(e, t, r) {
    let i = Pn.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = va(s, t, o, r)), e > 0 && (s = va(s, 0, e, r));
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
class Zt extends gi {
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
    } else u || ({ dom: u, contentDOM: d } = Rn.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let h = u;
    return u = _h(u, r, t), c ? l = new YS(e, t, r, i, u, d || null, h, c, s, o + 1) : t.isText ? new Ws(e, t, r, i, u, h, s) : new Zt(e, t, r, i, u, d || null, h, s, o + 1);
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
      e.contentElement || (e.getContent = () => _.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == ct && e.eq(this.node) && cs(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, a = s && s.pos < 0, l = new QS(this, o && o.node, e);
    tk(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? ae.none : this.node.child(u).marks, r, e, u), l.placeWidget(c, e, i);
    }, (c, u, d, h) => {
      l.syncToMarks(c.marks, r, e, h);
      let f;
      l.findNodeMatch(c, u, d, h) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (f = l.findIndexWithChild(s.node)) > -1 && l.updateNodeAt(c, u, d, f, e) || l.updateNextNode(c, u, d, e, h, i) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == gn) && (o && this.protectLocalComposition(e, o), Dh(this.contentDOM, this.children, e), ar && nk(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof Z) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, a = rk(this.node.content, o, r - t, i - t);
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
    let o = new XS(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = va(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == Tt || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = ct;
  }
  updateOuterDeco(e) {
    if (cs(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = Ph(this.dom, this.nodeDOM, ya(this.outerDeco, this.node, t), ya(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function ru(n, e, t, r, i) {
  _h(r, e, n);
  let s = new Zt(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Ws extends Zt {
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
    return this.dirty == Tt || this.dirty != ct && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != ct || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = ct, !0);
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
    return new Ws(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Tt);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class Oh extends gi {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == ct && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class YS extends Zt {
  constructor(e, t, r, i, s, o, a, l, c, u) {
    super(e, t, r, i, s, o, a, c, u), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == Tt)
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
function Dh(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], a = o.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = iu(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (o instanceof Pn) {
      let l = r ? r.previousSibling : n.lastChild;
      Dh(o.contentDOM, o.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = iu(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Ir = function(n) {
  n && (this.nodeName = n);
};
Ir.prototype = /* @__PURE__ */ Object.create(null);
const yn = [new Ir()];
function ya(n, e, t) {
  if (n.length == 0)
    return yn;
  let r = t ? yn[0] : new Ir(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Ir(o.nodeName));
      for (let a in o) {
        let l = o[a];
        l != null && (t && i.length == 1 && i.push(r = new Ir(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function Ph(n, e, t, r) {
  if (t == yn && r == yn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], a = t[s];
    if (s) {
      let l;
      a && a.nodeName == o.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = yn[0]), i = l;
    }
    GS(i, a || yn[0], o);
  }
  return i;
}
function GS(n, e, t) {
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
function _h(n, e, t) {
  return Ph(n, n, yn, ya(e, t, n.nodeType != 1));
}
function cs(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function iu(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class QS {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = ZS(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = ct, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
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
    return o.dirty == Tt && o.dom == o.contentDOM && (o.dirty = gn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (l instanceof Zt) {
        let c = this.preMatch.matched.get(l);
        if (c != null && c != s)
          return !1;
        let u = l.dom, d, h = this.isLocked(u) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != Tt && cs(t, l.outerDeco));
        if (!h && l.update(e, t, r, i))
          return this.destroyBetween(this.index, a), l.dom != u && (this.changed = !0), this.index++, !0;
        if (!h && (d = this.recreateWrapper(l, e, t, r, i, o)))
          return this.destroyBetween(this.index, a), this.top.children[this.index] = d, d.contentDOM && (d.dirty = gn, d.updateChildren(i, o + 1), d.dirty = ct), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !cs(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let a = Zt.create(this.top, t, r, i, s, o);
    if (a.contentDOM) {
      a.children = e.children, e.children = [];
      for (let l of a.children)
        l.parent = a;
    }
    return e.destroy(), a;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = Zt.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new Ah(this.top, e, t, r);
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
    !(e instanceof Ws) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Re || De) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new Oh(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function ZS(n, e) {
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
function ek(n, e) {
  return n.type.side - e.type.side;
}
function tk(n, e, t, r) {
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
        d.sort(ek);
        for (let g = 0; g < d.length; g++)
          t(d[g], c, !!l);
      } else
        t(u, c, !!l);
    let h, f;
    if (l)
      f = -1, h = l, l = null;
    else if (c < n.childCount)
      f = c, h = n.child(c++);
    else
      break;
    for (let g = 0; g < a.length; g++)
      a[g].to <= s && a.splice(g--, 1);
    for (; o < i.length && i[o].from <= s && i[o].to > s; )
      a.push(i[o++]);
    let p = s + h.nodeSize;
    if (h.isText) {
      let g = p;
      o < i.length && i[o].from < g && (g = i[o].from);
      for (let v = 0; v < a.length; v++)
        a[v].to < g && (g = a[v].to);
      g < p && (l = h.cut(g - s), h = h.cut(0, g - s), p = g, f = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = h.isInline && !h.isLeaf ? a.filter((g) => !g.inline) : a.slice();
    r(h, m, e.forChild(s, h), f), s = p;
  }
}
function nk(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function rk(n, e, t, r) {
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
function va(n, e, t, r, i) {
  let s = [];
  for (let o = 0, a = 0; o < n.length; o++) {
    let l = n[o], c = a, u = a += l.size;
    c >= t || u <= e ? s.push(l) : (c < e && s.push(l.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(l.slice(t - c, l.size, r)));
  }
  return s;
}
function pl(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let a = r.resolve(o), l, c;
  if (qs(t)) {
    for (l = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && J.isSelectable(d) && i.parent && !(d.isInline && DS(t.focusNode, t.focusOffset, i.dom))) {
      let h = i.posBefore;
      c = new J(o == h ? a : r.resolve(h));
    }
  } else {
    if (t instanceof n.dom.ownerDocument.defaultView.Selection && t.rangeCount > 1) {
      let d = o, h = o;
      for (let f = 0; f < t.rangeCount; f++) {
        let p = t.getRangeAt(f);
        d = Math.min(d, n.docView.posFromDOM(p.startContainer, p.startOffset, 1)), h = Math.max(h, n.docView.posFromDOM(p.endContainer, p.endOffset, -1));
      }
      if (d < 0)
        return null;
      [l, o] = h == n.state.selection.anchor ? [h, d] : [d, h], a = r.resolve(o);
    } else
      l = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (l < 0)
      return null;
  }
  let u = r.resolve(l);
  if (!c) {
    let d = e == "pointer" || n.state.selection.head < a.pos && !s ? 1 : -1;
    c = ml(n, u, a, d);
  }
  return c;
}
function Ih(n) {
  return n.editable ? n.hasFocus() : Rh(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Nt(n, e = !1) {
  let t = n.state.selection;
  if (Nh(n, t), !!Ih(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && De) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Dn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      sk(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      su && !(t instanceof Z) && (t.$from.parent.inlineContent || (s = ou(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = ou(n, t.to))), n.docView.setSelection(r, i, n, e), su && (s && au(s), o && au(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && ik(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const su = Re || De && wh < 63;
function ou(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Re && i && i.contentEditable == "false")
    return Oo(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return Oo(i);
    if (s)
      return Oo(s);
  }
}
function Oo(n) {
  return n.contentEditable = "true", Re && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function au(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function ik(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!Ih(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function sk(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Ae(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && Ye && Qt <= 11 && (t.disabled = !0, t.disabled = !1);
}
function Nh(n, e) {
  if (e instanceof J) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (lu(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    lu(n);
}
function lu(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function ml(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || Z.between(e, t, r);
}
function cu(n) {
  return n.editable && !n.hasFocus() ? !1 : Rh(n);
}
function Rh(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function ok(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Dn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function ba(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && ne.findFrom(s, e);
}
function jt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function uu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Z)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return jt(n, new Z(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = ba(n.state, e);
        return i && i instanceof J ? jt(n, i) : !1;
      } else if (!(st && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let a = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(a)) && !o.contentDOM ? J.isSelectable(s) ? jt(n, new J(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : mi ? jt(n, new Z(n.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof J && r.node.isInline)
      return jt(n, new Z(e > 0 ? r.$to : r.$from));
    {
      let i = ba(n.state, e);
      return i ? jt(n, i) : !1;
    }
  }
}
function us(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Nr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Wn(n, e) {
  return e < 0 ? ak(n) : lk(n);
}
function ak(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (lt && t.nodeType == 1 && r < us(t) && Nr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (Nr(a, -1))
          i = t, s = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if ($h(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && Nr(a, -1); )
          i = t.parentNode, s = Ae(a), a = a.previousSibling;
        if (a)
          t = a, r = us(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? wa(n, t, r) : i && wa(n, i, s);
}
function lk(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = us(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (Nr(a, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if ($h(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && Nr(a, 1); )
          s = a.parentNode, o = Ae(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = us(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && wa(n, s, o);
}
function $h(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function ck(n, e) {
  for (; n && e == n.childNodes.length && !pi(n); )
    e = Ae(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function uk(n, e) {
  for (; n && !e && !pi(n); )
    e = Ae(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function wa(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = ck(e, t)) ? (e = o, t = 0) : (s = uk(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (qs(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Nt(n);
  }, 50);
}
function du(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(De || Sh) && t.parent.inlineContent) {
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
function fu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Z && !r.empty || t.indexOf("s") > -1 || st && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = ba(n.state, e);
    if (o && o instanceof J)
      return jt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof Xe ? ne.near(o, e) : ne.findFrom(o, e);
    return a ? jt(n, a) : !1;
  }
  return !1;
}
function hu(n, e) {
  if (!(n.state.selection instanceof Z))
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
function pu(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function dk(n) {
  if (!Re || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    pu(n, r, "true"), setTimeout(() => pu(n, r, "false"), 20);
  }
  return !1;
}
function fk(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function hk(n, e) {
  let t = e.keyCode, r = fk(e);
  if (t == 8 || st && t == 72 && r == "c")
    return hu(n, -1) || Wn(n, -1);
  if (t == 46 && !e.shiftKey || st && t == 68 && r == "c")
    return hu(n, 1) || Wn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || st && t == 66 && r == "c") {
    let i = t == 37 ? du(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return uu(n, i, r) || Wn(n, i);
  } else if (t == 39 || st && t == 70 && r == "c") {
    let i = t == 39 ? du(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return uu(n, i, r) || Wn(n, i);
  } else {
    if (t == 38 || st && t == 80 && r == "c")
      return fu(n, -1, r) || Wn(n, -1);
    if (t == 40 || st && t == 78 && r == "c")
      return dk(n) || fu(n, 1, r) || Wn(n, 1);
    if (r == (st ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function gl(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let f = r.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), r = f.content;
  }
  let o = n.someProp("clipboardSerializer") || Rn.fromSchema(n.state.schema), a = qh(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = Vh[c.nodeName.toLowerCase()]); ) {
    for (let f = u.length - 1; f >= 0; f--) {
      let p = a.createElement(u[f]);
      for (; l.firstChild; )
        p.appendChild(l.firstChild);
      l.appendChild(p), d++;
    }
    c = l.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (f) => f(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: h, slice: e };
}
function Lh(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!t && !e)
    return null;
  let l = !!e && (r || s || !t);
  if (l) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, s || r, n);
    }), s)
      return a = new z(_.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (h) => {
        a = h(a, n, !0);
      }), a;
    let d = n.someProp("clipboardTextParser", (h) => h(e, i, r, n));
    if (d)
      a = d;
    else {
      let h = i.marks(), { schema: f } = n.state, p = Rn.fromSchema(f);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(f.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = yk(t), mi && vk(o);
  let c = o && o.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0; d--) {
      let h = o.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      o = h;
    }
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || Pr.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !pk.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = bk(mu(a, +u[1], +u[2]), u[4]);
  else if (a = z.maxOpen(mk(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, h = 0;
    for (let f = a.content.firstChild; d < a.openStart && !f.type.spec.isolating; d++, f = f.firstChild)
      ;
    for (let f = a.content.lastChild; h < a.openEnd && !f.type.spec.isolating; h++, f = f.lastChild)
      ;
    a = mu(a, d, h);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n, l);
  }), a;
}
const pk = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function mk(n, e) {
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
      if (c = o.length && s.length && Fh(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = zh(o[o.length - 1], s.length));
        let u = Bh(a, l);
        o.push(u), i = i.matchType(u.type), s = l;
      }
    }), o)
      return _.from(o);
  }
  return n;
}
function Bh(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, _.from(n));
  return n;
}
function Fh(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = Fh(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(_.from(Bh(t, n, i + 1))));
  }
}
function zh(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, zh(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(_.empty, !0);
  return n.copy(t.append(r));
}
function Sa(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, a = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (a = Sa(a, e, t, r, i + 1, s)), i >= t && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(_.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(a));
}
function mu(n, e, t) {
  return e < n.openStart && (n = new z(Sa(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new z(Sa(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Vh = {
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
let gu = null;
function qh() {
  return gu || (gu = document.implementation.createHTMLDocument("title"));
}
let Do = null;
function gk(n) {
  let e = window.trustedTypes;
  return e ? (Do || (Do = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Do.createHTML(n)) : n;
}
function yk(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = qh().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && Vh[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = gk(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function vk(n) {
  let e = n.querySelectorAll(De ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function bk(n, e) {
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
    i = _.from(l.create(r[a + 1], i)), s++, o++;
  }
  return new z(i, s, o);
}
const ze = {}, Ve = {}, wk = { touchstart: !0, touchmove: !0 };
class Sk {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function kk(n) {
  for (let e in ze) {
    let t = ze[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Ck(n, r) && !yl(n, r) && (n.editable || !(r.type in Ve)) && t(n, r);
    }, wk[e] ? { passive: !0 } : void 0);
  }
  Re && n.dom.addEventListener("input", () => null), ka(n);
}
function Gt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function xk(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function ka(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => yl(n, r));
  });
}
function yl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Ck(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Tk(n, e) {
  !yl(n, e) && ze[e.type] && (n.editable || !(e.type in Ve)) && ze[e.type](n, e);
}
Ve.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Uh(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Pt && De && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), ar && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, pn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || hk(n, t) ? t.preventDefault() : Gt(n, "key");
};
Ve.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Ve.keypress = (n, e) => {
  let t = e;
  if (Uh(n, t) || !t.charCode || t.ctrlKey && !t.altKey || st && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof Z) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), s = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i, s)) && n.dispatch(s()), t.preventDefault();
  }
};
function Us(n) {
  return { left: n.clientX, top: n.clientY };
}
function Ek(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function vl(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (a) => o > s.depth ? a(n, t, s.nodeAfter, s.before(o), i, !0) : a(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Qn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function Mk(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && J.isSelectable(r) ? (Qn(n, new J(t)), !0) : !1;
}
function Ak(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof J && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let a = o > s.depth ? s.nodeAfter : s.node(o);
    if (J.isSelectable(a)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (Qn(n, J.create(n.state.doc, i)), !0) : !1;
}
function Ok(n, e, t, r, i) {
  return vl(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? Ak(n, t) : Mk(n, t));
}
function Dk(n, e, t, r) {
  return vl(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function Pk(n, e, t, r) {
  return vl(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || _k(n, t, r);
}
function _k(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Qn(n, Z.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      Qn(n, Z.create(r, a + 1, a + 1 + o.content.size));
    else if (J.isSelectable(o))
      Qn(n, J.create(r, a));
    else
      continue;
    return !0;
  }
}
function bl(n) {
  return ds(n);
}
const Wh = st ? "metaKey" : "ctrlKey";
ze.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = bl(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && Ek(t, n.input.lastClick) && !t[Wh] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Us(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new Ik(n, o, t, !!r)) : (s == "doubleClick" ? Dk : Pk)(n, o.pos, o.inside, t) ? t.preventDefault() : Gt(n, "pointer"));
};
class Ik {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Wh], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof J && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && lt && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Gt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Nt(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Us(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Gt(this.view, "pointer") : Ok(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Re && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    De && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Qn(this.view, ne.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Gt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Gt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
ze.touchstart = (n) => {
  n.input.lastTouch = Date.now(), bl(n), Gt(n, "pointer");
};
ze.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Gt(n, "pointer");
};
ze.contextmenu = (n) => bl(n);
function Uh(n, e) {
  return n.composing ? !0 : Re && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const Nk = Pt ? 5e3 : -1;
Ve.compositionstart = Ve.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof Z && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || De && Sh && Rk(n)))
      n.markCursor = n.state.storedMarks || t.marks(), ds(n, !0), n.markCursor = null;
    else if (ds(n, !e.selection.empty), lt && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  Hh(n, Nk);
};
function Rk(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Ve.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Hh(n, 20));
};
function Hh(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => ds(n), e));
}
function jh(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Lk()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function $k(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = AS(e.focusNode, e.focusOffset), r = OS(e.focusNode, e.focusOffset);
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
function Lk() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function ds(n, e = !1) {
  if (!(Pt && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), jh(n), e || n.docView && n.docView.dirty) {
      let t = pl(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Bk(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Xr = Ye && Qt < 15 || ar && IS < 604;
ze.copy = Ve.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Xr ? null : t.clipboardData, o = r.content(), { dom: a, text: l } = gl(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : Bk(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Fk(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function zk(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Yr(n, r.value, null, i, e) : Yr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Yr(n, e, t, r, i) {
  let s = Lh(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, s || z.empty)))
    return !0;
  if (!s)
    return !1;
  let o = Fk(s), a = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Kh(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Ve.paste = (n, e) => {
  let t = e;
  if (n.composing && !Pt)
    return;
  let r = Xr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Yr(n, Kh(r), r.getData("text/html"), i, t) ? t.preventDefault() : zk(n, t);
};
class Jh {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const Vk = st ? "altKey" : "ctrlKey";
function Xh(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[Vk];
}
ze.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Us(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof J ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = J.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = J.create(n.state.doc, d.posBefore));
    }
  }
  let a = (o || n.state.selection).content(), { dom: l, text: c, slice: u } = gl(n, a);
  (!t.dataTransfer.files.length || !De || wh > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Xr ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Xr || t.dataTransfer.setData("text/plain", c), n.dragging = new Jh(u, Xh(n, t), o);
};
ze.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Ve.dragover = Ve.dragenter = (n, e) => e.preventDefault();
Ve.drop = (n, e) => {
  try {
    qk(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function qk(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Us(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (f) => {
    s = f(s, n, !1);
  }) : s = Lh(n, Kh(e.dataTransfer), Xr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && Xh(n, e));
  if (n.someProp("handleDrop", (f) => f(n, e, s || z.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let a = s ? Yw(n.state.doc, i.pos, s) : i.pos;
  a == null && (a = i.pos);
  let l = n.state.tr;
  if (o) {
    let { node: f } = t;
    f ? f.replace(l) : l.deleteSelection();
  }
  let c = l.mapping.map(a), u = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1, d = l.doc;
  if (u ? l.replaceRangeWith(c, c, s.content.firstChild) : l.replaceRange(c, c, s), l.doc.eq(d))
    return;
  let h = l.doc.resolve(c);
  if (u && J.isSelectable(s.content.firstChild) && h.nodeAfter && h.nodeAfter.sameMarkup(s.content.firstChild))
    l.setSelection(new J(h));
  else {
    let f = l.mapping.map(a);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((p, m, g, v) => f = v), l.setSelection(ml(n, h, l.doc.resolve(f)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
ze.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Nt(n);
  }, 20));
};
ze.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
ze.beforeinput = (n, e) => {
  if (De && Pt && e.inputType == "deleteContentBackward") {
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
for (let n in Ve)
  ze[n] = Ve[n];
function Gr(n, e) {
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
class fs {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Sn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new He(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof fs && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Gr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class en {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Sn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new He(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof en && Gr(this.attrs, e.attrs) && Gr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof en;
  }
  destroy() {
  }
}
class wl {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Sn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new He(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof wl && Gr(this.attrs, e.attrs) && Gr(this.spec, e.spec);
  }
  destroy() {
  }
}
class He {
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
    return new He(e, t, this.type);
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
    return new He(e, e, new fs(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new He(e, t, new en(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new He(e, t, new wl(r, i));
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
    return this.type instanceof en;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof fs;
  }
}
const Jn = [], Sn = {};
class ce {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Jn, this.children = t.length ? t : Jn;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? hs(t, e, 0, Sn) : Ie;
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
    return this == Ie || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Sn);
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
    return this.children.length ? Wk(this.children, o || [], e, t, r, i, s) : o ? new ce(o.sort(kn), Jn) : Ie;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Ie ? ce.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (u = Gh(t, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, u, c + 1) : i.splice(s, 0, l, l + a.nodeSize, hs(u, a, c + 1, Sn)), s += 3;
      }
    });
    let o = Yh(s ? Qh(t) : t, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new ce(o.length ? this.local.concat(o).sort(kn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Ie ? this : this.removeInner(e, 0);
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
      c != Ie ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new ce(i, r) : Ie;
  }
  forChild(e, t) {
    if (this == Ie)
      return this;
    if (t.isLeaf)
      return ce.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < o && l.to > s && l.type instanceof en) {
        let c = Math.max(s, l.from) - s, u = Math.min(o, l.to) - s;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new ce(i.sort(kn), Jn);
      return r ? new Jt([a, r]) : a;
    }
    return r || Ie;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof ce) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return Sl(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Ie)
      return Jn;
    if (e.inlineContent || !this.local.some(en.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof en || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
ce.empty = new ce([], []);
ce.removeOverlap = Sl;
const Ie = ce.empty;
class Jt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, Sn));
    return Jt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return ce.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Ie && (s instanceof Jt ? r = r.concat(s.members) : r.push(s));
    }
    return Jt.from(r);
  }
  eq(e) {
    if (!(e instanceof Jt) || e.members.length != this.members.length)
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
    return t ? Sl(r ? t : t.sort(kn)) : Jn;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Ie;
      case 1:
        return e[0];
      default:
        return new Jt(e.every((t) => t instanceof ce) ? e : e.reduce((t, r) => t.concat(r instanceof ce ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function Wk(n, e, t, r, i, s, o) {
  let a = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((h, f, p, m) => {
      let g = m - p - (f - h);
      for (let v = 0; v < a.length; v += 3) {
        let S = a[v + 1];
        if (S < 0 || h > S + u - d)
          continue;
        let b = a[v] + u - d;
        f >= b ? a[v + 1] = h <= b ? -2 : -1 : h >= u && g && (a[v] += g, a[v + 1] += g);
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
      let h = t.map(n[c + 1] + s, -1), f = h - i, { index: p, offset: m } = r.content.findIndex(d), g = r.maybeChild(p);
      if (g && m == d && m + g.nodeSize == f) {
        let v = a[c + 2].mapInner(t, g, u + 1, n[c] + s + 1, o);
        v != Ie ? (a[c] = d, a[c + 1] = f, a[c + 2] = v) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = Uk(a, n, e, t, i, s, o), u = hs(c, r, 0, o);
    e = u.local;
    for (let d = 0; d < a.length; d += 3)
      a[d + 1] < 0 && (a.splice(d, 3), d -= 3);
    for (let d = 0, h = 0; d < u.children.length; d += 3) {
      let f = u.children[d];
      for (; h < a.length && a[h] < f; )
        h += 3;
      a.splice(h, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new ce(e.sort(kn), a);
}
function Yh(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new He(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Uk(n, e, t, r, i, s, o) {
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
function Gh(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Qh(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function hs(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = Gh(n, a, l + t);
    if (c) {
      s = !0;
      let u = hs(c, a, t + l + 1, r);
      u != Ie && i.push(l, l + a.nodeSize, u);
    }
  });
  let o = Yh(s ? Qh(n) : n, -t).sort(kn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new ce(o, i) : Ie;
}
function kn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Sl(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), yu(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), yu(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function yu(n, e, t) {
  for (; e < n.length && kn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Po(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Ie && e.push(r);
  }), n.cursorWrapper && e.push(ce.create(n.state.doc, [n.cursorWrapper.deco])), Jt.from(e);
}
const Hk = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, jk = Ye && Qt <= 11;
class Kk {
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
class Jk {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Kk(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      Ye && Qt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Re && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), jk && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Hk)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (cu(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Nt(this.view);
      if (Ye && Qt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Dn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = or(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = or(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && cu(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, a = !1, l = [];
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
    } else if (lt && l.length) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, h] = u;
        d.parentNode && d.parentNode.parentNode == h.parentNode ? h.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let h of u) {
          let f = h.parentNode;
          f && f.nodeName == "LI" && (!d || Gk(e, d) != f) && h.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && qs(r) && (c = pl(e)) && c.eq(ne.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Nt(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), Xk(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Qk(e, l)), this.handleDOMChange(s, o, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Nt(e), this.currentSelection.set(r));
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
      if (Ye && Qt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: h } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (s = h);
        }
      let o = i && i.parentNode == e.target ? Ae(i) + 1 : 0, a = r.localPosFromDOM(e.target, o, -1), l = s && s.parentNode == e.target ? Ae(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
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
let vu = /* @__PURE__ */ new WeakMap(), bu = !1;
function Xk(n) {
  if (!vu.has(n) && (vu.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = lt, bu)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), bu = !0;
  }
}
function wu(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Dn(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function Yk(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return wu(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? wu(n, t) : null;
}
function Gk(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Qk(n, e) {
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
function Zk(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], qs(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), De && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let v = r.childNodes[g - 1], S = v.pmViewDesc;
      if (v.nodeName == "BR" && !S) {
        s = g;
        break;
      }
      if (!S || S.size)
        break;
    }
  let d = n.state.doc, h = n.someProp("domParser") || Pr.fromSchema(n.state.schema), f = d.resolve(o), p = null, m = h.parse(r, {
    topNode: f.parent,
    topMatch: f.parent.contentMatchAt(f.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: ex,
    context: f
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, v = c[1] && c[1].pos;
    v == null && (v = g), p = { anchor: g + o, head: v + o };
  }
  return { doc: m, sel: p, from: o, to: a };
}
function ex(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Re && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Re && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const tx = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function nx(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let k = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, T = pl(n, k);
    if (T && !n.state.selection.eq(T)) {
      if (De && Pt && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (O) => O(n, pn(13, "Enter"))))
        return;
      let E = n.state.tr.setSelection(T);
      k == "pointer" ? E.setMeta("pointer", !0) : k == "key" && E.scrollIntoView(), s && E.setMeta("composition", s), n.dispatch(E);
    }
    return;
  }
  let o = n.state.doc.resolve(e), a = o.sharedDepth(t);
  e = o.before(a + 1), t = n.state.doc.resolve(t).after(a + 1);
  let l = n.state.selection, c = Zk(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), h, f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, f = "end") : (h = n.state.selection.from, f = "start"), n.input.lastKeyCode = null;
  let p = sx(d.content, c.doc.content, c.from, h, f);
  if (p && n.input.domChangeCount++, (ar && n.input.lastIOSEnter > Date.now() - 225 || Pt) && i.some((k) => k.nodeType == 1 && !tx.test(k.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (k) => k(n, pn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && l instanceof Z && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (c.sel) {
        let k = Su(n, n.state.doc, c.sel);
        if (k && !k.eq(n.state.selection)) {
          let T = n.state.tr.setSelection(k);
          s && T.setMeta("composition", s), n.dispatch(T);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof Z && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), Ye && Qt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), v = u.resolve(p.start), S = m.sameParent(g) && m.parent.inlineContent && v.end() >= p.endA;
  if ((ar && n.input.lastIOSEnter > Date.now() - 225 && (!S || i.some((k) => k.nodeName == "DIV" || k.nodeName == "P")) || !S && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (k) => k(n, pn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && ix(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (k) => k(n, pn(8, "Backspace")))) {
    Pt && De && n.domObserver.suppressSelectionUpdates();
    return;
  }
  De && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Pt && !S && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(k) {
      return k(n, pn(13, "Enter"));
    });
  }, 20));
  let b = p.start, w = p.endA, x = (k) => {
    let T = k || n.state.tr.replace(b, w, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let E = Su(n, T.doc, c.sel);
      E && !(De && n.composing && E.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (E.head == b || E.head == T.mapping.map(w) - 1) || Ye && E.empty && E.head == b) && T.setSelection(E);
    }
    return s && T.setMeta("composition", s), T.scrollIntoView();
  }, C;
  if (S)
    if (m.pos == g.pos) {
      Ye && Qt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Nt(n), 20));
      let k = x(n.state.tr.delete(b, w)), T = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      T && k.ensureMarks(T), n.dispatch(k);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (C = rx(m.parent.content.cut(m.parentOffset, g.parentOffset), v.parent.content.cut(v.parentOffset, p.endA - v.start())))
    ) {
      let k = x(n.state.tr);
      C.type == "add" ? k.addMark(b, w, C.mark) : k.removeMark(b, w, C.mark), n.dispatch(k);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let k = m.parent.textBetween(m.parentOffset, g.parentOffset), T = () => x(n.state.tr.insertText(k, b, w));
      n.someProp("handleTextInput", (E) => E(n, b, w, k, T)) || n.dispatch(T());
    } else
      n.dispatch(x());
  else
    n.dispatch(x());
}
function Su(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : ml(n, e.resolve(t.anchor), e.resolve(t.head));
}
function rx(n, e) {
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
  if (_.from(c).eq(n))
    return { mark: a, type: o };
}
function ix(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    _o(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let a = s.nodeAfter;
    return a != null && t == e + a.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(_o(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || _o(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function _o(n, e, t) {
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
function sx(n, e, t, r, i) {
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
    s -= l, s && s < e.size && ku(e.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), a = s + (a - o), o = s;
  } else if (a < s) {
    let l = r <= s && r >= a ? s - r : 0;
    s -= l, s && s < n.size && ku(n.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), o = s + (o - a), a = s;
  }
  return { start: s, endA: o, endB: a };
}
function ku(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Zh {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Sk(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Mu), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Tu(this), Cu(this), this.nodeViews = Eu(this), this.docView = ru(this.state.doc, xu(this), Po(this), this.dom, this), this.domObserver = new Jk(this, (r, i, s, o) => nx(this, r, i, s, o)), this.domObserver.start(), kk(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && ka(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Mu), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (jh(this), o = !0), this.state = e;
    let a = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let f = Eu(this);
      ax(f, this.nodeViews) && (this.nodeViews = f, s = !0);
    }
    (a || t.handleDOMEvents != this._props.handleDOMEvents) && ka(this), this.editable = Tu(this), Cu(this);
    let l = Po(this), c = xu(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, l);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let h = u == "preserve" && o && this.dom.style.overflowAnchor == null && $S(this);
    if (o) {
      this.domObserver.stop();
      let f = d && (Ye || De) && !this.composing && !i.selection.empty && !e.selection.empty && ox(i.selection, e.selection);
      if (d) {
        let p = De ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = $k(this)), (s || !this.docView.update(e.doc, c, l, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = ru(e.doc, c, l, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (f = !0);
      }
      f || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && ok(this)) ? Nt(this, f) : (Nh(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : h && LS(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof J) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && Gc(this, t.getBoundingClientRect(), e);
      } else
        Gc(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new Jh(e.slice, e.move, i < 0 ? void 0 : J.create(this.state.doc, i));
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
    if (Ye) {
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
    this.domObserver.stop(), this.editable && BS(this.dom), Nt(this), this.domObserver.start();
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
    return WS(this, e);
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
    return Eh(this, e, t);
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
    return JS(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Yr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Yr(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return gl(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (xk(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Po(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, ES());
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
    return Tk(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Re && this.root.nodeType === 11 && PS(this.dom.ownerDocument) == this.dom && Yk(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Zh.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function xu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [He.node(0, n.state.doc.content.size, e)];
}
function Cu(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: He.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Tu(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function ox(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Eu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function ax(n, e) {
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
function Mu(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var on = {
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
}, ps = {
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
}, lx = typeof navigator < "u" && /Mac/.test(navigator.platform), cx = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Oe = 0; Oe < 10; Oe++) on[48 + Oe] = on[96 + Oe] = String(Oe);
for (var Oe = 1; Oe <= 24; Oe++) on[Oe + 111] = "F" + Oe;
for (var Oe = 65; Oe <= 90; Oe++)
  on[Oe] = String.fromCharCode(Oe + 32), ps[Oe] = String.fromCharCode(Oe);
for (var Io in on) ps.hasOwnProperty(Io) || (ps[Io] = on[Io]);
function ux(n) {
  var e = lx && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || cx && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? ps : on)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const dx = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), fx = typeof navigator < "u" && /Win/.test(navigator.platform);
function hx(n) {
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
      dx ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function px(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[hx(t)] = n[t];
  return e;
}
function No(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function mx(n) {
  return new _e({ props: { handleKeyDown: gx(n) } });
}
function gx(n) {
  let e = px(n);
  return function(t, r) {
    let i = ux(r), s, o = e[No(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[No(i, r, !1)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(fx && r.ctrlKey && r.altKey) && (s = on[r.keyCode]) && s != i) {
        let a = e[No(s, r)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var yx = Object.defineProperty, kl = (n, e) => {
  for (var t in e)
    yx(n, t, { get: e[t], enumerable: !0 });
};
function Hs(n) {
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
var js = class {
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
        Object.entries(t).map(([d, h]) => [d, (...p) => {
          const m = this.buildProps(l, e), g = h(...p)(m);
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
      state: Hs({
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
}, ep = {};
kl(ep, {
  blur: () => vx,
  clearContent: () => bx,
  clearNodes: () => wx,
  command: () => Sx,
  createParagraphNear: () => kx,
  cut: () => xx,
  deleteCurrentNode: () => Cx,
  deleteNode: () => Tx,
  deleteRange: () => Ex,
  deleteSelection: () => Mx,
  enter: () => Ax,
  exitCode: () => Ox,
  extendMarkRange: () => Dx,
  first: () => Px,
  focus: () => Ix,
  forEach: () => Nx,
  insertContent: () => Rx,
  insertContentAt: () => Bx,
  joinBackward: () => Vx,
  joinDown: () => zx,
  joinForward: () => qx,
  joinItemBackward: () => Wx,
  joinItemForward: () => Ux,
  joinTextblockBackward: () => Hx,
  joinTextblockForward: () => jx,
  joinUp: () => Fx,
  keyboardShortcut: () => Jx,
  lift: () => Xx,
  liftEmptyBlock: () => Yx,
  liftListItem: () => Gx,
  newlineInCode: () => Qx,
  resetAttributes: () => Zx,
  scrollIntoView: () => e1,
  selectAll: () => t1,
  selectNodeBackward: () => n1,
  selectNodeForward: () => r1,
  selectParentNode: () => i1,
  selectTextblockEnd: () => s1,
  selectTextblockStart: () => o1,
  setContent: () => a1,
  setMark: () => E1,
  setMeta: () => M1,
  setNode: () => A1,
  setNodeSelection: () => O1,
  setTextDirection: () => D1,
  setTextSelection: () => P1,
  sinkListItem: () => _1,
  splitBlock: () => I1,
  splitListItem: () => N1,
  toggleList: () => R1,
  toggleMark: () => $1,
  toggleNode: () => L1,
  toggleWrap: () => B1,
  undoInputRule: () => F1,
  unsetAllMarks: () => z1,
  unsetMark: () => V1,
  unsetTextDirection: () => q1,
  updateAttributes: () => W1,
  wrapIn: () => U1,
  wrapInList: () => H1
});
var vx = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), bx = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), wx = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), h = c.resolve(u.map(l + a.nodeSize)), f = d.blockRange(h);
      if (!f)
        return;
      const p = gr(f);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(f.start, m);
      }
      (p || p === 0) && e.lift(f, p);
    });
  }), !0;
}, Sx = (n) => (e) => n(e), kx = () => ({ state: n, dispatch: e }) => ph(n, e), xx = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new Z(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Cx = () => ({ tr: n, dispatch: e }) => {
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
function xe(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var Tx = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = xe(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const l = s.before(o), c = s.after(o);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, Ex = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, Mx = () => ({ state: n, dispatch: e }) => ll(n, e), Ax = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Ox = () => ({ state: n, dispatch: e }) => fS(n, e);
function xl(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function ms(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : xl(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function tp(n, e, t = {}) {
  return n.find((r) => r.type === e && ms(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Au(n, e, t = {}) {
  return !!tp(n, e, t);
}
function np(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !tp([...i.node.marks], e, t)))
    return;
  let o = i.index, a = n.start() + i.offset, l = o + 1, c = a + i.node.nodeSize;
  for (; o > 0 && Au([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, a -= n.parent.child(o).nodeSize;
  for (; l < n.parent.childCount && Au([...n.parent.child(l).marks], e, t); )
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
var Dx = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = Wt(n, r.schema), { doc: o, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = np(l, s, e);
    if (d && d.from <= c && d.to >= u) {
      const h = Z.create(o, d.from, d.to);
      t.setSelection(h);
    }
  }
  return !0;
}, Px = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function rp(n) {
  return n instanceof Z;
}
function vn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function ip(n, e = null) {
  if (!e)
    return null;
  const t = ne.atStart(n), r = ne.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? Z.create(n, vn(0, i, s), vn(n.content.size, i, s)) : Z.create(n, vn(e, i, s), vn(e, i, s));
}
function xa() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Qr() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function _x() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var Ix = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (Qr() || xa()) && r.dom.focus(), _x() && !Qr() && !xa() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !rp(t.state.selection))
    return o(), !0;
  const a = ip(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, Nx = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), Rx = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), sp = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && sp(r);
  }
  return n;
};
function Mi(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return sp(t);
}
function Zr(n, e, t) {
  if (n instanceof _t || n instanceof _)
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
        return _.fromArray(n.map((a) => e.nodeFromJSON(a)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (s) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), Zr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, a = "";
      const l = new Vf({
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
      if (t.slice ? Pr.fromSchema(l).parseSlice(Mi(n), t.parseOptions) : Pr.fromSchema(l).parse(Mi(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${a}`)
        });
    }
    const s = Pr.fromSchema(e);
    return t.slice ? s.parseSlice(Mi(n), t.parseOptions).content : s.parse(Mi(n), t.parseOptions);
  }
  return Zr("", e, t);
}
function $x(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof Se || i instanceof ke))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(ne.near(n.doc.resolve(o), t));
}
var Lx = (n) => !("type" in n), Bx = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
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
        Zr(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        l(g);
      }
    try {
      a = Zr(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return l(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, h = !0, f = !0;
    if ((Lx(a) ? a : [a]).forEach((g) => {
      g.check(), h = h ? g.isText && g.marks.length === 0 : !1, f = f ? g.isBlock : !1;
    }), u === d && f) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (h) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof _) {
        let g = "";
        e.forEach((v) => {
          v.text && (g += v.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = a;
      const g = r.doc.resolve(u), v = g.node(), S = g.parentOffset === 0, b = v.isText || v.isTextblock, w = v.content.size > 0;
      S && b && w && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && $x(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, Fx = () => ({ state: n, dispatch: e }) => cS(n, e), zx = () => ({ state: n, dispatch: e }) => uS(n, e), Vx = () => ({ state: n, dispatch: e }) => ah(n, e), qx = () => ({ state: n, dispatch: e }) => dh(n, e), Wx = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Fs(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Ux = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Fs(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, Hx = () => ({ state: n, dispatch: e }) => aS(n, e), jx = () => ({ state: n, dispatch: e }) => lS(n, e);
function op() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Kx(n) {
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
      Qr() || op() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var Jx = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = Kx(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
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
function ei(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? xe(e, n.schema) : null, a = [];
  n.doc.nodesBetween(r, i, (d, h) => {
    if (d.isText)
      return;
    const f = Math.max(r, h), p = Math.min(i, h + d.nodeSize);
    a.push({
      node: d,
      from: f,
      to: p
    });
  });
  const l = i - r, c = a.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => ms(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= l;
}
var Xx = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return ei(t, i, e) ? dS(t, r) : !1;
}, Yx = () => ({ state: n, dispatch: e }) => mh(n, e), Gx = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return kS(r)(e, t);
}, Qx = () => ({ state: n, dispatch: e }) => hh(n, e);
function Ks(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Ou(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var Zx = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Ks(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = xe(n, r.schema)), a === "mark" && (o = Wt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (l = !0, i && t.setNodeMarkup(d, void 0, Ou(u.attrs, e))), o && u.marks.length && u.marks.forEach((h) => {
        o === h.type && (l = !0, i && t.addMark(d, d + u.nodeSize, o.create(Ou(h.attrs, e))));
      });
    });
  }), l;
}, e1 = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), t1 = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new Xe(n.doc);
    n.setSelection(t);
  }
  return !0;
}, n1 = () => ({ state: n, dispatch: e }) => ch(n, e), r1 = () => ({ state: n, dispatch: e }) => fh(n, e), i1 = () => ({ state: n, dispatch: e }) => pS(n, e), s1 = () => ({ state: n, dispatch: e }) => yS(n, e), o1 = () => ({ state: n, dispatch: e }) => gS(n, e);
function Ca(n, e, t = {}, r = {}) {
  return Zr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var a1 = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: a }) => {
  const { doc: l } = s;
  if (r.preserveWhitespace !== "full") {
    const c = Ca(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, l.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: l.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function ap(n, e) {
  const t = Wt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function l1(n, e) {
  const t = new rh(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function c1(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function u1(n, e) {
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
function Cl(n) {
  return (e) => u1(e.$from, n);
}
function H(n, e, t) {
  return n.config[e] === void 0 && n.parent ? H(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? H(n.parent, e, t) : null
  }) : n.config[e];
}
function Tl(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = H(e, "addExtensions", t);
    return r ? [e, ...Tl(r())] : e;
  }).flat(10);
}
function El(n, e) {
  const t = Rn.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function lp(n) {
  return typeof n == "function";
}
function ue(n, e = void 0, ...t) {
  return lp(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function d1(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function lr(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function cp(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = lr(n), i = [...t, ...r], s = {
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
    }, d = H(
      c,
      "addGlobalAttributes",
      u
    );
    if (!d)
      return;
    d().forEach((f) => {
      let p;
      Array.isArray(f.types) ? p = f.types : f.types === "*" ? p = l : f.types === "nodes" ? p = o : f.types === "marks" ? p = a : p = [], p.forEach((m) => {
        Object.entries(f.attributes).forEach(([g, v]) => {
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
    }, d = H(
      c,
      "addAttributes",
      u
    );
    if (!d)
      return;
    const h = d();
    Object.entries(h).forEach(([f, p]) => {
      const m = {
        ...s,
        ...p
      };
      typeof m?.default == "function" && (m.default = m.default()), m?.isRequired && m?.default === void 0 && delete m.default, e.push({
        type: c.name,
        name: f,
        attribute: m
      });
    });
  }), e;
}
function f1(n) {
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
function Du(n) {
  const e = [], t = f1(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const a = s.slice(0, o).trim(), l = s.slice(o + 1).trim();
    a && l && e.push([a, l]);
  }
  return e;
}
function up(...n) {
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
        const a = new Map([...Du(r[i]), ...Du(s)]);
        r[i] = Array.from(a.entries()).map(([l, c]) => `${l}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function gs(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => up(t, r), {});
}
function h1(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Pu(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const a = o.attribute.parseHTML ? o.attribute.parseHTML(t) : h1(t.getAttribute(o.name));
        return a == null ? s : {
          ...s,
          [o.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function _u(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && d1(t) ? !1 : t != null)
  );
}
function Iu(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function dp(n, e) {
  var t;
  const r = cp(n), { nodeExtensions: i, markExtensions: s } = lr(n), o = (t = i.find((c) => H(c, "topNode"))) == null ? void 0 : t.name, a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((v) => v.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, h = n.reduce((v, S) => {
        const b = H(S, "extendNodeSchema", d);
        return {
          ...v,
          ...b ? b(c) : {}
        };
      }, {}), f = _u({
        ...h,
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
        attrs: Object.fromEntries(u.map(Iu))
      }), p = ue(H(c, "parseHTML", d));
      p && (f.parseDOM = p.map(
        (v) => Pu(v, u)
      ));
      const m = H(c, "renderHTML", d);
      m && (f.toDOM = (v) => m({
        node: v,
        HTMLAttributes: gs(v, u)
      }));
      const g = H(c, "renderText", d);
      return g && (f.toText = g), [c.name, f];
    })
  ), l = Object.fromEntries(
    s.map((c) => {
      const u = r.filter((g) => g.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, h = n.reduce((g, v) => {
        const S = H(v, "extendMarkSchema", d);
        return {
          ...g,
          ...S ? S(c) : {}
        };
      }, {}), f = _u({
        ...h,
        inclusive: ue(H(c, "inclusive", d)),
        excludes: ue(H(c, "excludes", d)),
        group: ue(H(c, "group", d)),
        spanning: ue(H(c, "spanning", d)),
        code: ue(H(c, "code", d)),
        attrs: Object.fromEntries(u.map(Iu))
      }), p = ue(H(c, "parseHTML", d));
      p && (f.parseDOM = p.map(
        (g) => Pu(g, u)
      ));
      const m = H(c, "renderHTML", d);
      return m && (f.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: gs(g, u)
      })), [c.name, f];
    })
  );
  return new Vf({
    topNode: o,
    nodes: a,
    marks: l
  });
}
function p1(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function Rr(n) {
  return n.sort((t, r) => {
    const i = H(t, "priority") || 100, s = H(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function Ml(n) {
  const e = Rr(Tl(n)), t = p1(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function m1(n, e) {
  const t = Ml(n);
  return dp(t, e);
}
function fp(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = t || {};
  let a = "";
  return n.nodesBetween(r, i, (l, c, u, d) => {
    var h;
    l.isBlock && c > r && (a += s);
    const f = o?.[l.type.name];
    if (f)
      return u && (a += f({
        node: l,
        pos: c,
        parent: u,
        index: d,
        range: e
      })), !1;
    l.isText && (a += (h = l?.text) == null ? void 0 : h.slice(Math.max(r, c) - c, i - c));
  }), a;
}
function g1(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return fp(n, t, e);
}
function hp(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function y1(n, e) {
  const t = xe(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function v1(n, e) {
  const t = Ks(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? y1(n, e) : t === "mark" ? ap(n, e) : {};
}
function b1(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function w1(n) {
  const e = b1(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function S1(n) {
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
      const c = e.slice(s).map(a, -1), u = e.slice(s).map(l), d = e.invert().map(c, -1), h = e.invert().map(u);
      r.push({
        oldRange: {
          from: d,
          to: h
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), w1(r);
}
function kr(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Fi(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var k1 = (n, e = 500) => {
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
function Ta(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? Wt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => ms(d.attrs, t, { strict: !1 }));
  let o = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: h }) => {
    const f = d.pos, p = h.pos;
    n.doc.nodesBetween(f, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const v = Math.max(f, g), S = Math.min(p, g + m.nodeSize), b = S - v;
      o += b, a.push(
        ...m.marks.map((w) => ({
          mark: w,
          from: v,
          to: S
        }))
      );
    });
  }), o === 0)
    return !1;
  const l = a.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => ms(d.mark.attrs, t, { strict: !1 })).reduce((d, h) => d + h.to - h.from, 0), c = a.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, h) => d + h.to - h.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function x1(n, e, t = {}) {
  if (!e)
    return ei(n, null, t) || Ta(n, null, t);
  const r = Ks(e, n.schema);
  return r === "node" ? ei(n, e, t) : r === "mark" ? Ta(n, e, t) : !1;
}
function Nu(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Ru(n, e) {
  const { nodeExtensions: t } = lr(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = ue(H(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Al(n, {
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
      i !== !1 && (Al(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var Ol = class pp {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new pp(e.position);
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
function mp(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new Ol(t.pos),
    mapResult: t
  };
}
function C1(n) {
  return new Ol(n);
}
function T1(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (rp(i) && (s = i.$cursor), s) {
    const a = (r = n.storedMarks) != null ? r : s.marks();
    return s.parent.type.allowsMarkType(t) && (!!t.isInSet(a) || !a.some((c) => c.type.excludes(t)));
  }
  const { ranges: o } = i;
  return o.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(a.pos, l.pos, (u, d, h) => {
      if (c)
        return !1;
      if (u.isInline) {
        const f = !h || h.type.allowsMarkType(t), p = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = f && p;
      }
      return !c;
    }), c;
  });
}
var E1 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: a } = s, l = Wt(n, r.schema);
  if (i)
    if (o) {
      const c = ap(r, l);
      t.addStoredMark(
        l.create({
          ...c,
          ...e
        })
      );
    } else
      a.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (h, f) => {
          const p = Math.max(f, u), m = Math.min(f + h.nodeSize, d);
          h.marks.find((v) => v.type === l) ? h.marks.forEach((v) => {
            l === v.type && t.addMark(
              p,
              m,
              l.create({
                ...v.attrs,
                ...e
              })
            );
          }) : t.addMark(p, m, l.create(e));
        });
      });
  return T1(r, t, l);
}, M1 = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), A1 = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = xe(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: a }) => Jc(s, { ...o, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => Jc(s, { ...o, ...e })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, O1 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = vn(n, 0, r.content.size), s = J.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, D1 = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, a;
  return typeof e == "number" ? (o = e, a = e) : e && "from" in e && "to" in e ? (o = e.from, a = e.to) : (o = s.from, a = s.to), i && t.doc.nodesBetween(o, a, (l, c) => {
    l.isText || t.setNodeMarkup(c, void 0, {
      ...l.attrs,
      dir: n
    });
  }), !0;
}, P1 = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = Z.atStart(r).from, a = Z.atEnd(r).to, l = vn(i, o, a), c = vn(s, o, a), u = Z.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, _1 = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return TS(r)(e, t);
};
function $u(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var I1 = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, u = Fi(c, a.node().type.name, a.node().attrs);
  if (s instanceof J && s.node.isBlock)
    return !a.parentOffset || !It(o, a.pos) ? !1 : (r && (n && $u(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const d = l.parentOffset === l.parent.content.size, h = a.depth === 0 ? void 0 : c1(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let f = d && h ? [
    {
      type: h,
      attrs: u
    }
  ] : void 0, p = It(e.doc, e.mapping.map(a.pos), 1, f);
  if (!f && !p && It(e.doc, e.mapping.map(a.pos), 1, h ? [{ type: h }] : void 0) && (p = !0, f = h ? [
    {
      type: h,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof Z && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, f), h && !d && !a.parentOffset && a.parent.type !== h)) {
      const m = e.mapping.map(a.before()), g = e.doc.resolve(m);
      a.node(-1).canReplaceWith(g.index(), g.index() + 1, h) && e.setNodeMarkup(e.mapping.map(a.before()), h);
    }
    n && $u(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, N1 = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const a = xe(n, r.schema), { $from: l, $to: c } = r.selection, u = r.selection.node;
  if (u && u.isBlock || l.depth < 2 || !l.sameParent(c))
    return !1;
  const d = l.node(-1);
  if (d.type !== a)
    return !1;
  const h = s.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== a || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (i) {
      let v = _.empty;
      const S = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let T = l.depth - S; T >= l.depth - 3; T -= 1)
        v = _.from(l.node(T).copy(v));
      const b = (
        // eslint-disable-next-line no-nested-ternary
        l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3
      ), w = {
        ...Fi(h, l.node().type.name, l.node().attrs),
        ...e
      }, x = ((o = a.contentMatch.defaultType) == null ? void 0 : o.createAndFill(w)) || void 0;
      v = v.append(_.from(a.createAndFill(null, x) || void 0));
      const C = l.before(l.depth - (S - 1));
      t.replace(C, l.after(-b), new z(v, 4 - S, 0));
      let k = -1;
      t.doc.nodesBetween(C, t.doc.content.size, (T, E) => {
        if (k > -1)
          return !1;
        T.isTextblock && T.content.size === 0 && (k = E + 1);
      }), k > -1 && t.setSelection(Z.near(t.doc.resolve(k))), t.scrollIntoView();
    }
    return !0;
  }
  const f = c.pos === l.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Fi(h, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Fi(h, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const g = f ? [
    { type: a, attrs: p },
    { type: f, attrs: m }
  ] : [{ type: a, attrs: p }];
  if (!It(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: v, storedMarks: S } = r, { splittableMarks: b } = s.extensionManager, w = S || v.$to.parentOffset && v.$from.marks();
    if (t.split(l.pos, 2, g).scrollIntoView(), !w || !i)
      return !0;
    const x = w.filter((C) => b.includes(C.type.name));
    t.ensureMarks(x);
  }
  return !0;
}, Ro = (n, e) => {
  const t = Cl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && $n(n.doc, t.pos) && n.join(t.pos), !0;
}, $o = (n, e) => {
  const t = Cl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && $n(n.doc, r) && n.join(r), !0;
}, R1 = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: h } = i.extensionManager, f = xe(n, o.schema), p = xe(e, o.schema), { selection: m, storedMarks: g } = o, { $from: v, $to: S } = m, b = v.blockRange(S), w = g || m.$to.parentOffset && m.$from.marks();
  if (!b)
    return !1;
  const x = Cl((C) => Ru(C.type.name, d))(m);
  if (b.depth >= 1 && x && b.depth - x.depth <= 1) {
    if (x.node.type === f)
      return c.liftListItem(p);
    if (Ru(x.node.type.name, d) && f.validContent(x.node.content) && a)
      return l().command(() => (s.setNodeMarkup(x.pos, f), !0)).command(() => Ro(s, f)).command(() => $o(s, f)).run();
  }
  return !t || !w || !a ? l().command(() => u().wrapInList(f, r) ? !0 : c.clearNodes()).wrapInList(f, r).command(() => Ro(s, f)).command(() => $o(s, f)).run() : l().command(() => {
    const C = u().wrapInList(f, r), k = w.filter((T) => h.includes(T.type.name));
    return s.ensureMarks(k), C ? !0 : c.clearNodes();
  }).wrapInList(f, r).command(() => Ro(s, f)).command(() => $o(s, f)).run();
}, $1 = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = Wt(n, r.schema);
  return Ta(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, L1 = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = xe(n, r.schema), o = xe(e, r.schema), a = ei(r, s, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), a ? i.setNode(o, l) : i.setNode(s, { ...l, ...t });
}, B1 = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = xe(n, t.schema);
  return ei(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, F1 = () => ({ state: n, dispatch: e }) => {
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
}, z1 = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, V1 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = t, l = Wt(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && o) {
    let { from: h, to: f } = a;
    const p = (s = c.marks().find((g) => g.type === l)) == null ? void 0 : s.attrs, m = np(c, l, p);
    m && (h = m.from, f = m.to), t.removeMark(h, f, l);
  } else
    d.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, q1 = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (a, l) => {
    if (a.isText)
      return;
    const c = { ...a.attrs };
    delete c.dir, e.setNodeMarkup(l, void 0, c);
  }), !0;
}, W1 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Ks(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = xe(n, r.schema)), a === "mark" && (o = Wt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let h, f, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, v) => {
      s && s === g.type && (l = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), h = v, f = g);
    }) : r.doc.nodesBetween(u, d, (g, v) => {
      v < u && s && s === g.type && (l = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), h = v, f = g), v >= u && v <= d && (s && s === g.type && (l = !0, i && t.setNodeMarkup(v, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((S) => {
        if (o === S.type && (l = !0, i)) {
          const b = Math.max(v, u), w = Math.min(v + g.nodeSize, d);
          t.addMark(
            b,
            w,
            o.create({
              ...S.attrs,
              ...e
            })
          );
        }
      }));
    }), f && (h !== void 0 && i && t.setNodeMarkup(h, void 0, {
      ...f.attrs,
      ...e
    }), o && f.marks.length && f.marks.forEach((g) => {
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
}, U1 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return vS(i, e)(t, r);
}, H1 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return bS(i, e)(t, r);
}, j1 = class {
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
}, K1 = (n, e) => {
  if (xl(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Ai(n) {
  var e;
  const { editor: t, from: r, to: i, text: s, rules: o, plugin: a } = n, { view: l } = t;
  if (l.composing)
    return !1;
  const c = l.state.doc.resolve(r);
  if (
    // check for code node
    c.parent.type.spec.code || (e = c.nodeBefore || c.nodeAfter) != null && e.marks.find((h) => h.type.spec.code)
  )
    return !1;
  let u = !1;
  const d = k1(c) + s;
  return o.forEach((h) => {
    if (u)
      return;
    const f = K1(d, h.find);
    if (!f)
      return;
    const p = l.state.tr, m = Hs({
      state: l.state,
      transaction: p
    }), g = {
      from: r - (f[0].length - s.length),
      to: i
    }, { commands: v, chain: S, can: b } = new js({
      editor: t,
      state: m
    });
    h.handler({
      state: m,
      range: g,
      match: f,
      commands: v,
      chain: S,
      can: b
    }) === null || !p.steps.length || (h.undoable && p.setMeta(a, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), l.dispatch(p), u = !0);
  }), u;
}
function J1(n) {
  const { editor: e, rules: t } = n, r = new _e({
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
          typeof u == "string" ? u = u : u = El(_.from(u), o.schema);
          const { from: d } = l, h = d + u.length;
          Ai({
            editor: e,
            from: d,
            to: h,
            text: u,
            rules: t,
            plugin: r
          });
        }), i.selectionSet || i.docChanged ? null : s;
      }
    },
    props: {
      handleTextInput(i, s, o, a) {
        return Ai({
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
          s && Ai({
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
        return o ? Ai({
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
function X1(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Oi(n) {
  return X1(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function gp(n, e) {
  const t = { ...n };
  return Oi(n) && Oi(e) && Object.keys(e).forEach((r) => {
    Oi(e[r]) && Oi(n[r]) ? t[r] = gp(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var Dl = class {
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
      addOptions: () => gp(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, Y1 = class yp extends Dl {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new yp(t);
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
function G1(n) {
  return typeof n == "number";
}
var Q1 = (n, e, t) => {
  if (xl(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function Z1(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: a } = n, { commands: l, chain: c, can: u } = new js({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (f, p) => {
    var m, g, v, S, b;
    if ((g = (m = f.type) == null ? void 0 : m.spec) != null && g.code || !(f.isText || f.isTextblock || f.isInline))
      return;
    const w = (b = (S = (v = f.content) == null ? void 0 : v.size) != null ? S : f.nodeSize) != null ? b : 0, x = Math.max(r, p), C = Math.min(i, p + w);
    if (x >= C)
      return;
    const k = f.isText ? f.text || "" : f.textBetween(x - p, C - p, void 0, "￼");
    Q1(k, s.find, o).forEach((E) => {
      if (E.index === void 0)
        return;
      const O = x + E.index + 1, N = O + E[0].length, R = {
        from: t.tr.mapping.map(O),
        to: t.tr.mapping.map(N)
      }, q = s.handler({
        state: t,
        range: R,
        match: E,
        commands: l,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: a
      });
      d.push(q);
    });
  }), d.every((f) => f !== null);
}
var Di = null, eC = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function tC(n) {
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
    to: h,
    rule: f,
    pasteEvt: p
  }) => {
    const m = u.tr, g = Hs({
      state: u,
      transaction: m
    });
    if (!(!Z1({
      editor: e,
      state: g,
      from: Math.max(d - 1, 0),
      to: h.b - 1,
      rule: f,
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
  return t.map((u) => new _e({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const h = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (Di = e);
      }, f = () => {
        Di && (Di = null);
      };
      return window.addEventListener("dragstart", h), window.addEventListener("dragend", f), {
        destroy() {
          window.removeEventListener("dragstart", h), window.removeEventListener("dragend", f);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (d, h) => {
          if (s = r === d.dom.parentElement, a = h, !s) {
            const f = Di;
            f?.isEditable && setTimeout(() => {
              const p = f.state.selection;
              p && f.commands.deleteRange({ from: p.from, to: p.to });
            }, 10);
          }
          return !1;
        },
        paste: (d, h) => {
          var f;
          const p = (f = h.clipboardData) == null ? void 0 : f.getData("text/html");
          return o = h, i = !!p?.includes("data-pm-slice"), !1;
        }
      }
    },
    appendTransaction: (d, h, f) => {
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, v = p.getMeta("applyPasteRules"), S = !!v;
      if (!m && !g && !S)
        return;
      if (S) {
        let { text: x } = v;
        typeof x == "string" ? x = x : x = El(_.from(x), f.schema);
        const { from: C } = v, k = C + x.length, T = eC(x);
        return l({
          rule: u,
          state: f,
          from: C,
          to: { b: k },
          pasteEvt: T
        });
      }
      const b = h.doc.content.findDiffStart(f.doc.content), w = h.doc.content.findDiffEnd(f.doc.content);
      if (!(!G1(b) || !w || b === w.b))
        return l({
          rule: u,
          state: f,
          from: b,
          to: w,
          pasteEvt: o
        });
    }
  }));
}
var Js = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = Ml(n), this.schema = dp(this.extensions, e), this.setupExtensions();
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
        type: kr(e.name, this.schema)
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
    return Rr([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: kr(r.name, this.schema)
      }, s = [], o = H(
        r,
        "addKeyboardShortcuts",
        i
      );
      let a = {};
      if (r.type === "mark" && H(r, "exitable", i) && (a.ArrowRight = () => Y1.handleExit({ editor: n, mark: r })), o) {
        const h = Object.fromEntries(
          Object.entries(o()).map(([f, p]) => [f, () => p({ editor: n })])
        );
        a = { ...a, ...h };
      }
      const l = mx(a);
      s.push(l);
      const c = H(r, "addInputRules", i);
      if (Nu(r, n.options.enableInputRules) && c) {
        const h = c();
        if (h && h.length) {
          const f = J1({
            editor: n,
            rules: h
          }), p = Array.isArray(f) ? f : [f];
          s.push(...p);
        }
      }
      const u = H(r, "addPasteRules", i);
      if (Nu(r, n.options.enablePasteRules) && u) {
        const h = u();
        if (h && h.length) {
          const f = tC({ editor: n, rules: h });
          s.push(...f);
        }
      }
      const d = H(
        r,
        "addProseMirrorPlugins",
        i
      );
      if (d) {
        const h = d();
        s.push(...h);
      }
      return s;
    });
  }
  /**
   * Get all attributes from the extensions.
   * @returns An array of attributes
   */
  get attributes() {
    return cp(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = lr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!H(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
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
        const a = (l, c, u, d, h) => {
          const f = gs(l, r);
          return o({
            // pass-through
            node: l,
            view: c,
            getPos: u,
            decorations: d,
            innerDecorations: h,
            // tiptap-specific
            editor: n,
            extension: t,
            HTMLAttributes: f
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
    return Rr([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: kr(i.name, this.schema)
      }, o = H(
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
    return Rr([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: kr(i.name, this.schema)
        }, o = H(
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
    const { editor: n } = this, { markExtensions: e } = lr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!H(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Wt(t.name, this.schema)
        }, s = H(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (a, l, c) => {
          const u = gs(a, r);
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
              mC(a, n, d);
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
        type: kr(e.name, this.schema)
      };
      e.type === "mark" && ((t = ue(H(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = H(e, "onBeforeCreate", r), s = H(e, "onCreate", r), o = H(e, "onUpdate", r), a = H(
        e,
        "onSelectionUpdate",
        r
      ), l = H(e, "onTransaction", r), c = H(e, "onFocus", r), u = H(e, "onBlur", r), d = H(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), a && this.editor.on("selectionUpdate", a), l && this.editor.on("transaction", l), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
Js.resolve = Ml;
Js.sort = Rr;
Js.flatten = Tl;
var nC = {};
kl(nC, {
  ClipboardTextSerializer: () => bp,
  Commands: () => wp,
  Delete: () => Sp,
  Drop: () => kp,
  Editable: () => xp,
  FocusEvents: () => Tp,
  Keymap: () => Ep,
  Paste: () => Mp,
  Tabindex: () => Ap,
  TextDirection: () => Op,
  focusEventsPluginKey: () => Cp
});
var Ze = class vp extends Dl {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new vp(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, bp = Ze.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new _e({
        key: new Qe("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), a = Math.max(...s.map((u) => u.$to.pos)), l = hp(t);
            return fp(r, { from: o, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), wp = Ze.create({
  name: "commands",
  addCommands() {
    return {
      ...ep
    };
  }
}), Sp = Ze.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, a, l, c;
      if ((c = (l = (a = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : a.filterTransaction) == null ? void 0 : l.call(a, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = l1(n.before, [n, ...e]);
      S1(u).forEach((f) => {
        u.mapping.mapResult(f.oldRange.from).deletedAfter && u.mapping.mapResult(f.oldRange.to).deletedBefore && u.before.nodesBetween(f.oldRange.from, f.oldRange.to, (p, m) => {
          const g = m + p.nodeSize - 2, v = f.oldRange.from <= m && g <= f.oldRange.to;
          this.editor.emit("delete", {
            type: "node",
            node: p,
            from: m,
            to: g,
            newFrom: u.mapping.map(m),
            newTo: u.mapping.map(g),
            deletedRange: f.oldRange,
            newRange: f.newRange,
            partial: !v,
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        });
      });
      const h = u.mapping;
      u.steps.forEach((f, p) => {
        var m, g;
        if (f instanceof ht) {
          const v = h.slice(p).map(f.from, -1), S = h.slice(p).map(f.to), b = h.invert().map(v, -1), w = h.invert().map(S), x = (m = u.doc.nodeAt(v - 1)) == null ? void 0 : m.marks.some((k) => k.eq(f.mark)), C = (g = u.doc.nodeAt(S)) == null ? void 0 : g.marks.some((k) => k.eq(f.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: f.mark,
            from: f.from,
            to: f.to,
            deletedRange: {
              from: b,
              to: w
            },
            newRange: {
              from: v,
              to: S
            },
            partial: !!(C || x),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (i = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || i ? setTimeout(s, 0) : s();
  }
}), kp = Ze.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new _e({
        key: new Qe("tiptapDrop"),
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
}), xp = Ze.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new _e({
        key: new Qe("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Cp = new Qe("focusEvents"), Tp = Ze.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new _e({
        key: Cp,
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
}), Ep = Ze.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: h, parent: f } = d, p = d.parent.isTextblock && h > 0 ? a.doc.resolve(h - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, v = m && p.parent.childCount === 1 ? g === d.pos : ne.atStart(c).from === h;
        return !u || !f.type.isTextblock || f.textContent.length || !v || v && d.parent.type.name === "paragraph" ? !1 : o.clearNodes();
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
    return Qr() || op() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new _e({
        key: new Qe("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: a } = e.selection, l = ne.atStart(e.doc).from, c = ne.atEnd(e.doc).to;
          if (s || !(o === l && a === c) || !Al(t.doc))
            return;
          const h = t.tr, f = Hs({
            state: t,
            transaction: h
          }), { commands: p } = new js({
            editor: this.editor,
            state: f
          });
          if (p.clearNodes(), !!h.steps.length)
            return h;
        }
      })
    ];
  }
}), Mp = Ze.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new _e({
        key: new Qe("tiptapPaste"),
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
}), Ap = Ze.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new _e({
        key: new Qe("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), Op = Ze.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = lr(this.extensions);
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
      new _e({
        key: new Qe("textDirection"),
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
}), rC = class Er {
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
    return new Er(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new Er(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new Er(e, this.editor);
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
      const c = new Er(l, this.editor, i, i || o ? t : null);
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
}, iC = `.ProseMirror {
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
function sC(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var oC = class extends j1 {
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
      getUpdatedPosition: mp,
      createMappablePosition: C1
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = ip(t, this.options.autofocus);
    this.editorState = Xn.create({
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
    this.options.injectCSS && typeof document < "u" && (this.css = sC(iC, this.options.injectNonce));
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
    const r = lp(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
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
      xp,
      bp.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      wp,
      Tp,
      Ep,
      Ap,
      kp,
      Mp,
      Sp,
      Op.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new Js(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new js({
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
      e = Ca(this.options.content, this.schema, this.options.parseOptions, {
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
      }), e = Ca(this.options.content, this.schema, this.options.parseOptions, {
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
    this.editorView = new Zh(e, {
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
    return v1(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return x1(this.state, r, i);
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
    return El(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return g1(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...hp(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Al(this.state.doc);
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
    return new rC(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, aC = {};
kl(aC, {
  createAtomBlockMarkdownSpec: () => lC,
  createBlockMarkdownSpec: () => cC,
  createInlineMarkdownSpec: () => fC,
  parseAttributes: () => Pl,
  parseIndentedBlocks: () => hC,
  renderNestedMarkdownContent: () => pC,
  serializeAttributes: () => _l
});
function Pl(n) {
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
    const h = parseInt(((d = u.match(/__QUOTED_(\d+)__/)) == null ? void 0 : d[1]) || "0", 10), f = t[h];
    f && (e[c] = f.slice(1, -1));
  });
  const l = r.replace(/(?:^|\s)\.([a-zA-Z][\w-]*)/g, "").replace(/(?:^|\s)#([a-zA-Z][\w-]*)/g, "").replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g, "").trim();
  return l && l.split(/\s+/).filter(Boolean).forEach((u) => {
    u.match(/^[a-zA-Z][\w-]*$/) && (e[u] = !0);
  }), e;
}
function _l(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function lC(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = Pl,
    serializeAttributes: i = _l,
    defaultAttributes: s = {},
    requiredAttributes: o = [],
    allowedAttributes: a
  } = n, l = t || e, c = (u) => {
    if (!a)
      return u;
    const d = {};
    return a.forEach((h) => {
      h in u && (d[h] = u[h]);
    }), d;
  };
  return {
    parseMarkdown: (u, d) => {
      const h = { ...s, ...u.attributes };
      return d.createNode(e, h, []);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(u) {
        var d;
        const h = new RegExp(`^:::${l}(?:\\s|$)`, "m"), f = (d = u.match(h)) == null ? void 0 : d.index;
        return f !== void 0 ? f : -1;
      },
      tokenize(u, d, h) {
        const f = new RegExp(`^:::${l}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`), p = u.match(f);
        if (!p)
          return;
        const m = p[1] || "", g = r(m);
        if (!o.find((S) => !(S in g)))
          return {
            type: e,
            raw: p[0],
            attributes: g
          };
      }
    },
    renderMarkdown: (u) => {
      const d = c(u.attrs || {}), h = i(d), f = h ? ` {${h}}` : "";
      return `:::${l}${f} :::`;
    }
  };
}
function cC(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Pl,
    serializeAttributes: s = _l,
    defaultAttributes: o = {},
    content: a = "block",
    allowedAttributes: l
  } = n, c = t || e, u = (d) => {
    if (!l)
      return d;
    const h = {};
    return l.forEach((f) => {
      f in d && (h[f] = d[f]);
    }), h;
  };
  return {
    parseMarkdown: (d, h) => {
      let f;
      if (r) {
        const m = r(d);
        f = typeof m == "string" ? [{ type: "text", text: m }] : m;
      } else a === "block" ? f = h.parseChildren(d.tokens || []) : f = h.parseInline(d.tokens || []);
      const p = { ...o, ...d.attributes };
      return h.createNode(e, p, f);
    },
    markdownTokenizer: {
      name: e,
      level: "block",
      start(d) {
        var h;
        const f = new RegExp(`^:::${c}`, "m"), p = (h = d.match(f)) == null ? void 0 : h.index;
        return p !== void 0 ? p : -1;
      },
      tokenize(d, h, f) {
        var p;
        const m = new RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*\\n`), g = d.match(m);
        if (!g)
          return;
        const [v, S = ""] = g, b = i(S);
        let w = 1;
        const x = v.length;
        let C = "";
        const k = /^:::([\w-]*)(\s.*)?/gm, T = d.slice(x);
        for (k.lastIndex = 0; ; ) {
          const E = k.exec(T);
          if (E === null)
            break;
          const O = E.index, N = E[1];
          if (!((p = E[2]) != null && p.endsWith(":::"))) {
            if (N)
              w += 1;
            else if (w -= 1, w === 0) {
              const R = T.slice(0, O);
              C = R.trim();
              const q = d.slice(0, x + O + E[0].length);
              let I = [];
              if (C)
                if (a === "block")
                  for (I = f.blockTokens(R), I.forEach((F) => {
                    F.text && (!F.tokens || F.tokens.length === 0) && (F.tokens = f.inlineTokens(F.text));
                  }); I.length > 0; ) {
                    const F = I[I.length - 1];
                    if (F.type === "paragraph" && (!F.text || F.text.trim() === ""))
                      I.pop();
                    else
                      break;
                  }
                else
                  I = f.inlineTokens(C);
              return {
                type: e,
                raw: q,
                attributes: b,
                content: C,
                tokens: I
              };
            }
          }
        }
      }
    },
    renderMarkdown: (d, h) => {
      const f = u(d.attrs || {}), p = s(f), m = p ? ` {${p}}` : "", g = h.renderChildren(d.content || [], `

`);
      return `:::${c}${m}

${g}

:::`;
    }
  };
}
function uC(n) {
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
function dC(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function fC(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = uC,
    serializeAttributes: s = dC,
    defaultAttributes: o = {},
    selfClosing: a = !1,
    allowedAttributes: l
  } = n, c = t || e, u = (h) => {
    if (!l)
      return h;
    const f = {};
    return l.forEach((p) => {
      const m = typeof p == "string" ? p : p.name, g = typeof p == "string" ? void 0 : p.skipIfDefault;
      if (m in h) {
        const v = h[m];
        if (g !== void 0 && v === g)
          return;
        f[m] = v;
      }
    }), f;
  }, d = c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return {
    parseMarkdown: (h, f) => {
      const p = { ...o, ...h.attributes };
      if (a)
        return f.createNode(e, p);
      const m = r ? r(h) : h.content || "";
      return m ? f.createNode(e, p, [f.createTextNode(m)]) : f.createNode(e, p, []);
    },
    markdownTokenizer: {
      name: e,
      level: "inline",
      start(h) {
        const f = a ? new RegExp(`\\[${d}\\s*[^\\]]*\\]`) : new RegExp(`\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`), p = h.match(f), m = p?.index;
        return m !== void 0 ? m : -1;
      },
      tokenize(h, f, p) {
        const m = a ? new RegExp(`^\\[${d}\\s*([^\\]]*)\\]`) : new RegExp(`^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`), g = h.match(m);
        if (!g)
          return;
        let v = "", S = "";
        if (a) {
          const [, w] = g;
          S = w;
        } else {
          const [, w, x] = g;
          S = w, v = x || "";
        }
        const b = i(S.trim());
        return {
          type: e,
          raw: g[0],
          content: v.trim(),
          attributes: b
        };
      }
    },
    renderMarkdown: (h) => {
      let f = "";
      r ? f = r(h) : h.content && h.content.length > 0 && (f = h.content.filter((v) => v.type === "text").map((v) => v.text).join(""));
      const p = u(h.attrs || {}), m = s(p), g = m ? ` ${m}` : "";
      return a ? `[${c}${g}]` : `[${c}${g}]${f}[/${c}]`;
    }
  };
}
function hC(n, e, t) {
  var r, i, s, o;
  const a = n.split(`
`), l = [];
  let c = "", u = 0;
  const d = e.baseIndentSize || 2;
  for (; u < a.length; ) {
    const h = a[u], f = h.match(e.itemPattern);
    if (!f) {
      if (l.length > 0)
        break;
      if (h.trim() === "") {
        u += 1, c = `${c}${h}
`;
        continue;
      } else
        return;
    }
    const p = e.extractItemData(f), { indentLevel: m, mainContent: g } = p;
    c = `${c}${h}
`;
    const v = [g];
    for (u += 1; u < a.length; ) {
      const x = a[u];
      if (x.trim() === "") {
        const k = a.slice(u + 1).findIndex((O) => O.trim() !== "");
        if (k === -1)
          break;
        if ((((i = (r = a[u + 1 + k].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          v.push(x), c = `${c}${x}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = x.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        v.push(x), c = `${c}${x}
`, u += 1;
      else
        break;
    }
    let S;
    const b = v.slice(1);
    if (b.length > 0) {
      const x = b.map((C) => C.slice(m + d)).join(`
`);
      x.trim() && (e.customNestedParser ? S = e.customNestedParser(x) : S = t.blockTokens(x));
    }
    const w = e.createToken(p, S);
    l.push(w);
  }
  if (l.length !== 0)
    return {
      items: l,
      raw: c
    };
}
function pC(n, e, t, r) {
  if (!n || !Array.isArray(n.content))
    return "";
  const i = typeof t == "function" ? t(r) : t, [s, ...o] = n.content, a = e.renderChildren([s]);
  let l = `${i}${a}`;
  return o && o.length > 0 && o.forEach((c, u) => {
    var d, h;
    const f = (h = (d = e.renderChild) == null ? void 0 : d.call(e, c, u + 1)) != null ? h : e.renderChildren([c]);
    if (f != null) {
      const p = f.split(`
`).map((m) => m ? e.indent(m) : e.indent("")).join(`
`);
      l += c.type === "paragraph" ? `

${p}` : `
${p}`;
    }
  }), l;
}
function mC(n, e, t = {}) {
  const { state: r } = e, { doc: i, tr: s } = r, o = n;
  i.descendants((a, l) => {
    const c = s.mapping.map(l), u = s.mapping.map(l) + a.nodeSize;
    let d = null;
    if (a.marks.forEach((f) => {
      if (f !== o)
        return !1;
      d = f;
    }), !d)
      return;
    let h = !1;
    if (Object.keys(t).forEach((f) => {
      t[f] !== d.attrs[f] && (h = !0);
    }), h) {
      const f = n.type.create({
        ...n.attrs,
        ...t
      });
      s.removeMark(c, u, n.type), s.addMark(c, u, f);
    }
  }), s.docChanged && e.view.dispatch(s);
}
var Il = class Dp extends Dl {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Dp(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, gC = class {
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
    let d = 0, h = 0;
    if (this.dom !== u) {
      const S = this.dom.getBoundingClientRect(), b = u.getBoundingClientRect(), w = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, x = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = b.x - S.x + w, h = b.y - S.y + x;
    }
    const f = this.dom.cloneNode(!0);
    try {
      const S = this.dom.getBoundingClientRect();
      f.style.width = `${Math.round(S.width)}px`, f.style.height = `${Math.round(S.height)}px`, f.style.boxSizing = "border-box", f.style.pointerEvents = "none";
    } catch {
    }
    let p = null;
    try {
      p = document.createElement("div"), p.style.position = "absolute", p.style.top = "-9999px", p.style.left = "-9999px", p.style.pointerEvents = "none", p.appendChild(f), document.body.appendChild(p), (a = n.dataTransfer) == null || a.setDragImage(f, d, h);
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
    const g = J.create(l.state.doc, m), v = l.state.tr.setSelection(g);
    l.dispatch(v);
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
    const { isEditable: a } = this.editor, { isDragging: l } = this, c = !!this.node.type.spec.draggable, u = J.isSelectable(this.node), d = n.type === "copy", h = n.type === "paste", f = n.type === "cut", p = n.type === "mousedown";
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
    return !(l || s || d || h || f || p && u);
  }
  /**
   * Called when a DOM [mutation](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) or a selection change happens within the view.
   * @return `false` if the editor should re-read the selection or re-parse the range around the mutation
   * @return `true` if it can safely be ignored.
   */
  ignoreMutation(n) {
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (Qr() || xa()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
function Lu(n) {
  return md((e, t) => ({
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
var yC = class extends oC {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = Lu(this.view.state), this.reactiveExtensionStorage = Lu(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), Wa(this);
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
}, vC = B({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = D(), t = ln();
    return Ge(() => {
      const r = n.editor;
      r && r.options.element && e.value && ye(() => {
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
    }), zt(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return je("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), bC = B({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return je(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), wC = B({
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
    return je(
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
}), SC = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = Wa(n), this.el = document.createElement("div"), this.props = za(e), this.renderedComponent = this.renderComponent();
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
    let n = je(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && Xl(n, this.el), { vNode: n, destroy: () => {
      this.el && Xl(null, this.el), this.el = null, n = null;
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
B({
  name: "MarkViewContent",
  props: {
    as: {
      type: String,
      default: "span"
    }
  },
  render() {
    return je(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var kC = class extends gC {
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
    this.decorationClasses = D(this.getDecorationClasses());
    const t = B({
      extends: { ...this.component },
      props: Object.keys(n),
      template: this.component.template,
      setup: (r) => {
        var i, s;
        return Tn("onDragStart", e), Tn("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new SC(t, {
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
function xC(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new kC(r, t, e);
  };
}
const CC = { class: "transcription-panel" }, TC = {
  ref: "scrollContainer",
  class: "scroll-container"
}, EC = { class: "turns-container" }, MC = {
  key: 0,
  class: "history-loading",
  role: "status"
}, AC = {
  key: 1,
  class: "history-start"
}, OC = /* @__PURE__ */ B({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = ut(), r = Et(), i = qr("scrollContainer"), s = A(() => {
      const k = r.live?.partial.value ?? null;
      return k === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: k,
        words: [],
        language: r.activeChannel.value?.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = A(() => r.transcriptionEditor?.tiptapEditor.value), a = A(() => r.live?.hasLiveUpdate.value ?? !1), l = A(() => r.audio?.isPlaying.value ?? !1), c = A(
      () => r.activeChannel.value?.activeTranslation.value
    ), u = A(() => r.activeChannel.value), d = A(
      () => u.value?.isLoadingHistory.value ?? !1
    ), h = A(() => u.value?.hasMoreHistory.value ?? !1), { isFollowing: f, resumeFollow: p } = uw(i), { scrollRef: m, contentRef: g, isAtBottom: v, scrollToBottom: S } = ey();
    me(() => {
      m.value = i.value, g.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const b = A(
      () => !f.value && l.value || !v.value && a.value
    );
    function w() {
      l.value ? p() : S();
    }
    const x = wg(() => {
      const k = u.value;
      if (!k?.hasMoreHistory.value || k.isLoadingHistory.value || e.turns.length === 0) return;
      const T = c.value;
      T && r.emit("scroll:top", { translationId: T.id });
    }, 500);
    function C() {
      const k = i.value;
      k && k.scrollTop < 100 && x();
    }
    return te(
      () => e.turns,
      (k, T) => {
        const E = k.length, O = T.length;
        if (E > O && !v.value && k[0]?.id != T[0]?.id) {
          const N = E - O, R = e.turns[N]?.id;
          if (!R || !m.value) return;
          ye(() => {
            m.value?.querySelector(
              `[data-turn-id="${R}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), me(() => {
      i.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), zt(() => {
      i.value?.removeEventListener("scroll", C);
    }), (k, T) => (M(), U("article", CC, [
      K("div", TC, [
        K("div", EC, [
          d.value ? (M(), U("div", MC, [...T[2] || (T[2] = [
            K("progress", null, null, -1)
          ])])) : Y("", !0),
          !h.value && n.turns.length > 0 ? (M(), U("div", AC, G(y(t)("transcription.historyStart")), 1)) : Y("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (M(), L(lw, {
            key: 2,
            class: "transcription-empty"
          })) : Y("", !0),
          o.value ? (M(), L(y(vC), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (M(!0), U(Ke, { key: 4 }, cn(n.turns, (E, O, N, R) => {
            const q = [E, n.speakers.get(E.speakerId ?? ""), a.value && !s.value && O === n.turns.length - 1];
            if (R && R.key === E.id && Ym(R, q)) return R;
            const I = (M(), L(Ac, {
              "data-turn-id": E.id,
              key: E.id,
              turn: E,
              speaker: E.speakerId ? n.speakers.get(E.speakerId) : void 0,
              live: a.value && !s.value && O === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return I.memo = q, I;
          }, T, 0), 128)),
          s.value ? (M(), L(Ac, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : Y("", !0)
        ]),
        $(Ua, { name: "fade-slide" }, {
          default: P(() => [
            b.value ? (M(), L(ot, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": y(t)("transcription.resumeScroll"),
              onClick: w
            }, {
              icon: P(() => [
                $(y(Cd), { size: 14 })
              ]),
              default: P(() => [
                we(" " + G(y(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : Y("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), DC = /* @__PURE__ */ fe(OC, [["__scopeId", "data-v-472af2c0"]]), PC = { class: "switch" }, _C = ["id", "checked"], IC = ["for"], NC = /* @__PURE__ */ B({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? Gm();
    return (s, o) => (M(), U("div", PC, [
      K("input", {
        type: "checkbox",
        id: y(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, _C),
      K("label", { for: y(i) }, [...o[1] || (o[1] = [
        K("div", { class: "switch-slider" }, null, -1)
      ])], 8, IC)
    ]));
  }
}), Lo = /* @__PURE__ */ fe(NC, [["__scopeId", "data-v-2aa0332f"]]), RC = "(max-width: 767px)";
function Pp() {
  const n = D(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return me(() => {
    e = window.matchMedia(RC), n.value = e.matches, e.addEventListener("change", t);
  }), zt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const $C = { class: "sidebar-select-trigger-label" }, LC = /* @__PURE__ */ B({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = A(
      () => t.items.find((a) => a.value === t.selectedValue)
    ), s = D(), o = D([]);
    return me(() => {
      const a = s.value?.closest(".speaker-sidebar");
      a && (o.value = [a]);
    }), (a, l) => (M(), U("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: s
    }, [
      $(y(g0), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedValue", c))
      }, {
        default: P(() => [
          $(y(H0), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: P(() => [
              K("span", $C, [
                j(a.$slots, "trigger", { item: i.value }, () => [
                  we(G(i.value?.label ?? ""), 1)
                ])
              ]),
              $(y(N0), null, {
                default: P(() => [
                  $(y(Td), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 3
          }, 8, ["aria-label"]),
          $(y(W0), { disabled: "" }, {
            default: P(() => [
              $(y(_0), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": o.value
              }, {
                default: P(() => [
                  $(y(K0), null, {
                    default: P(() => [
                      (M(!0), U(Ke, null, cn(n.items, (c) => (M(), L(y(L0), {
                        key: c.value,
                        value: c.value,
                        class: "sidebar-select-item"
                      }, {
                        default: P(() => [
                          $(y(F0), { class: "sidebar-select-item-indicator" }, {
                            default: P(() => [
                              $(y(Es), { size: 14 })
                            ]),
                            _: 1
                          }),
                          $(y(V0), null, {
                            default: P(() => [
                              j(a.$slots, "item", { item: c }, () => [
                                we(G(c.label), 1)
                              ])
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1032, ["value"]))), 128))
                    ]),
                    _: 3
                  })
                ]),
                _: 3
              }, 8, ["collision-boundary"])
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["model-value"])
    ], 512));
  }
}), BC = { class: "sidebar-select" }, FC = ["aria-label"], zC = { class: "sidebar-select-trigger-label" }, VC = /* @__PURE__ */ B({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = D(!1), s = A(
      () => t.items.find((a) => a.value === t.selectedValue)
    );
    function o(a) {
      r("update:selectedValue", a), i.value = !1;
    }
    return (a, l) => (M(), U("div", BC, [
      K("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (c) => i.value = !0)
      }, [
        K("span", zC, [
          j(a.$slots, "trigger", { item: s.value }, () => [
            we(G(s.value?.label ?? ""), 1)
          ])
        ])
      ], 8, FC),
      $(y(Kd), {
        open: i.value,
        "onUpdate:open": l[2] || (l[2] = (c) => i.value = c)
      }, {
        default: P(() => [
          $(y(nf), { disabled: "" }, {
            default: P(() => [
              $(y(ef), { class: "editor-overlay" }),
              $(y(Zd), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: P(() => [
                  $(y(rf), { class: "sr-only" }, {
                    default: P(() => [
                      we(G(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = K("div", { class: "sheet-handle" }, null, -1)),
                  $(y(e0), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: P(() => [
                      $(y(n0), { class: "sheet-list" }, {
                        default: P(() => [
                          (M(!0), U(Ke, null, cn(n.items, (c) => (M(), L(y(a0), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: P(() => [
                              $(y(c0), { class: "sheet-item-indicator" }, {
                                default: P(() => [
                                  $(y(Es), { size: 16 })
                                ]),
                                _: 1
                              }),
                              j(a.$slots, "item", { item: c }, () => [
                                we(G(c.label), 1)
                              ])
                            ]),
                            _: 2
                          }, 1032, ["value"]))), 128))
                        ]),
                        _: 3
                      })
                    ]),
                    _: 3
                  }, 8, ["model-value"])
                ]),
                _: 3
              })
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["open"])
    ]));
  }
}), _p = /* @__PURE__ */ B({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: r } = Pp();
    return (i, s) => y(r) ? (M(), L(VC, le({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
    }), Yl({ _: 2 }, [
      i.$slots.item ? {
        name: "item",
        fn: P(({ item: o }) => [
          j(i.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      i.$slots.trigger ? {
        name: "trigger",
        fn: P(({ item: o }) => [
          j(i.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040)) : (M(), L(LC, le({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => t("update:selectedValue", o))
    }), Yl({ _: 2 }, [
      i.$slots.item ? {
        name: "item",
        fn: P(({ item: o }) => [
          j(i.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      i.$slots.trigger ? {
        name: "trigger",
        fn: P(({ item: o }) => [
          j(i.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040));
  }
}), Ip = /* @__PURE__ */ B({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = ut(), s = A(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (M(), L(_p, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: y(i)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), qC = { class: "translation-row" }, WC = {
  key: 0,
  class: "translation-row-badge"
}, UC = {
  key: 0,
  class: "translation-trigger-badge"
}, HC = /* @__PURE__ */ B({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = ut(), o = A(
      () => bg(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    return (a, l) => (M(), L(_p, {
      items: o.value,
      "selected-value": n.selectedTranslationId,
      ariaLabel: y(i)("sidebar.translationLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (c) => r("update:selectedTranslationId", c))
    }, {
      item: P(({ item: c }) => [
        K("span", qC, [
          c.originalLabel ? (M(), U("strong", WC, G(c.originalLabel), 1)) : Y("", !0),
          K("span", null, G(c.label), 1)
        ])
      ]),
      trigger: P(({ item: c }) => [
        c?.originalLabel ? (M(), U("span", UC, G(c.originalLabel), 1)) : Y("", !0),
        K("span", null, G(c?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Np = /* @__PURE__ */ fe(HC, [["__scopeId", "data-v-77b61b2c"]]), jC = { class: "speaker-sidebar" }, KC = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, JC = { class: "sidebar-title" }, XC = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, YC = { class: "sidebar-title" }, GC = {
  key: 2,
  class: "sidebar-section"
}, QC = { class: "sidebar-title" }, ZC = { class: "subtitle-toggle" }, eT = { class: "subtitle-toggle-label" }, tT = { class: "subtitle-slider" }, nT = { class: "subtitle-slider-label" }, rT = { class: "subtitle-slider-value" }, iT = ["value", "disabled"], sT = {
  key: 0,
  class: "subtitle-toggle"
}, oT = { class: "subtitle-toggle-label" }, aT = {
  key: 1,
  class: "subtitle-toggle"
}, lT = { class: "subtitle-toggle-label" }, cT = {
  key: 3,
  class: "sidebar-section"
}, uT = { class: "sidebar-title" }, dT = { class: "speaker-list" }, fT = { class: "speaker-name" }, hT = /* @__PURE__ */ B({
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
    const e = Et(), { t } = ut();
    return (r, i) => (M(), U("aside", jC, [
      n.channels.length > 1 ? (M(), U("section", KC, [
        K("h2", JC, G(y(t)("sidebar.channel")), 1),
        $(Ip, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": i[0] || (i[0] = (s) => r.$emit("update:selectedChannelId", s))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : Y("", !0),
      n.translations.length > 1 ? (M(), U("section", XC, [
        K("h2", YC, G(y(t)("sidebar.translation")), 1),
        $(Np, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": i[1] || (i[1] = (s) => r.$emit("update:selectedTranslationId", s))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : Y("", !0),
      y(e).subtitle ? (M(), U("section", GC, [
        K("h2", QC, G(y(t)("sidebar.subtitle")), 1),
        K("div", ZC, [
          K("span", eT, G(y(t)("subtitle.show")), 1),
          $(Lo, {
            modelValue: y(e).subtitle.isVisible.value,
            "onUpdate:modelValue": i[2] || (i[2] = (s) => y(e).subtitle.isVisible.value = s)
          }, null, 8, ["modelValue"])
        ]),
        K("label", tT, [
          K("span", nT, [
            we(G(y(t)("subtitle.fontSize")) + " ", 1),
            K("span", rT, G(y(e).subtitle.fontSize.value) + "px", 1)
          ]),
          K("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: y(e).subtitle.fontSize.value,
            disabled: !y(e).subtitle.isVisible.value,
            onInput: i[3] || (i[3] = (s) => y(e).subtitle.fontSize.value = Number(s.target.value))
          }, null, 40, iT)
        ]),
        y(e).subtitle.watermark && !y(e).subtitle.watermark.readonly ? (M(), U("div", sT, [
          K("span", oT, G(y(t)("subtitle.showWatermark")), 1),
          $(Lo, {
            modelValue: y(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": i[4] || (i[4] = (s) => y(e).subtitle.watermark.display.value = s),
            disabled: !y(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : Y("", !0),
        y(e).subtitle.watermark && !y(e).subtitle.watermark.readonly && y(e).subtitle.watermark.display.value ? (M(), U("div", aT, [
          K("span", lT, G(y(t)("subtitle.pinWatermark")), 1),
          $(Lo, {
            modelValue: y(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": i[5] || (i[5] = (s) => y(e).subtitle.watermark.pinned.value = s),
            disabled: !y(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : Y("", !0)
      ])) : Y("", !0),
      n.speakers.length ? (M(), U("section", cT, [
        K("h2", uT, G(y(t)("sidebar.speakers")), 1),
        K("ul", dT, [
          (M(!0), U(Ke, null, cn(n.speakers, (s) => (M(), U("li", {
            key: s.id,
            class: "speaker-item"
          }, [
            $(Ld, {
              color: s.color
            }, null, 8, ["color"]),
            K("span", fT, G(s.name), 1)
          ]))), 128))
        ])
      ])) : Y("", !0)
    ]));
  }
}), Bu = /* @__PURE__ */ fe(hT, [["__scopeId", "data-v-5b2b80f4"]]), pT = /* @__PURE__ */ B({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = Qm(n, "open"), { t } = ut();
    return (r, i) => (M(), L(y(Kd), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: P(() => [
        $(y(nf), { disabled: "" }, {
          default: P(() => [
            $(y(ef), { class: "editor-overlay" }),
            $(y(Zd), { class: "sidebar-drawer" }, {
              default: P(() => [
                $(y(rf), { class: "sr-only" }, {
                  default: P(() => [
                    we(G(y(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                $(y(Hy), {
                  class: "sidebar-close",
                  "aria-label": y(t)("header.closeSidebar")
                }, {
                  default: P(() => [
                    $(y(Ka), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                j(r.$slots, "default")
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
}), mT = { class: "player-controls" }, gT = { class: "controls-left" }, yT = { class: "controls-time" }, vT = { class: "time-display" }, bT = { class: "time-display" }, wT = { class: "controls-right" }, ST = ["value", "aria-label", "disabled"], kT = /* @__PURE__ */ B({
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
    const t = e, { t: r } = ut(), i = D(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (M(), U("div", mT, [
      K("div", gT, [
        $(ot, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: P(() => [
            $(y(Od), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        $(ot, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? y(r)("player.pause") : y(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: P(() => [
            n.isPlaying ? (M(), L(y(Ed), {
              key: 0,
              size: 20
            })) : (M(), L(y(Md), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        $(ot, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: P(() => [
            $(y(Dd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      K("div", yT, [
        K("time", vT, G(n.currentTime), 1),
        a[7] || (a[7] = K("span", { class: "time-separator" }, "/", -1)),
        K("time", bT, G(n.duration), 1)
      ]),
      K("div", wT, [
        K("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          $(ot, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? y(r)("player.unmute") : y(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: P(() => [
              n.isMuted ? (M(), L(y(Id), {
                key: 0,
                size: 16
              })) : (M(), L(y(_d), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Zm(K("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": y(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, ST), [
            [eg, i.value]
          ])
        ], 32),
        $(ot, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": y(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: P(() => [
            we(G(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), xT = /* @__PURE__ */ fe(kT, [["__scopeId", "data-v-99f700b1"]]);
function Be(n, e, t, r) {
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
let yi = class {
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
const Pi = { decode: function(n, e) {
  return Be(this, void 0, void 0, (function* () {
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
function Rp(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Rp(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Fu(n, e, t) {
  const r = Rp(n, e || {});
  return t?.appendChild(r), r;
}
var CT = Object.freeze({ __proto__: null, createElement: Fu, default: Fu });
const TT = { fetchBlob: function(n, e, t) {
  return Be(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Be(this, void 0, void 0, (function* () {
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
function mn(n, e) {
  const t = pe(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Kt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class ET extends yi {
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
    return Be(this, void 0, void 0, (function* () {
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
function MT({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function AT({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function zu(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function $p(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Vu(n, e) {
  if (!$p(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function qu({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function Lp(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function OT(n) {
  const e = pe({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = mn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = mn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), Lp(e);
  } };
}
class DT extends yi {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = zu(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = zu(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = OT(this.scrollContainer);
    const e = Kt((() => {
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
      const d = (h) => {
        if (h.button !== s || (l.set(h.pointerId, h), l.size > 1)) return;
        let f = h.clientX, p = h.clientY, m = !1;
        const g = Date.now(), v = t.getBoundingClientRect(), { left: S, top: b } = v, w = (E) => {
          if (E.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const O = E.clientX, N = E.clientY, R = O - f, q = N - p;
          (m || Math.abs(R) > i || Math.abs(q) > i) && (E.preventDefault(), E.stopPropagation(), m || (a.set({ type: "start", x: f - S, y: p - b }), m = !0), a.set({ type: "move", x: O - S, y: N - b, deltaX: R, deltaY: q }), f = O, p = N);
        }, x = (E) => {
          if (l.delete(E.pointerId), m) {
            const O = E.clientX, N = E.clientY;
            a.set({ type: "end", x: O - S, y: N - b });
          }
          u();
        }, C = (E) => {
          l.delete(E.pointerId), E.relatedTarget && E.relatedTarget !== document.documentElement || x(E);
        }, k = (E) => {
          m && (E.stopPropagation(), E.preventDefault());
        }, T = (E) => {
          E.defaultPrevented || l.size > 1 || m && E.preventDefault();
        };
        document.addEventListener("pointermove", w), document.addEventListener("pointerup", x), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", T), setTimeout((() => {
            document.removeEventListener("click", k, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), l.clear(), Lp(a);
      } };
    })(this.wrapper);
    const e = Kt((() => {
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
        return o?.every(((h) => !h.overlay)) ? d / l : d;
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
      return r.forEach(((d, h) => {
        c.addColorStop(h * u, d);
      })), c;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: h } = (function({ width: p, height: m, length: g, options: v, pixelRatio: S }) {
      const b = m / 2, w = v.barWidth ? v.barWidth * S : 1, x = v.barGap ? v.barGap * S : v.barWidth ? w / 2 : 0, C = w + x || 1;
      return { halfHeight: b, barWidth: w, barGap: x, barRadius: v.barRadius || 0, barMinHeight: v.barMinHeight ? v.barMinHeight * S : 0, barIndexScale: g > 0 ? p / C / g : 0, barSpacing: C };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: v, halfHeight: S, vScale: b, canvasHeight: w, barAlign: x, barMinHeight: C }) {
      const k = p[0] || [], T = p[1] || k, E = k.length, O = [];
      let N = 0, R = 0, q = 0;
      for (let I = 0; I <= E; I++) {
        const F = Math.round(I * m);
        if (F > N) {
          const { topHeight: ie, totalHeight: he } = MT({ maxTop: R, maxBottom: q, halfHeight: S, vScale: b, barMinHeight: C, barAlign: x }), We = AT({ barAlign: x, halfHeight: S, topHeight: ie, totalHeight: he, canvasHeight: w });
          O.push({ x: N * g, y: We, width: v, height: he }), N = F, R = 0, q = 0;
        }
        const re = Math.abs(k[I] || 0), Q = Math.abs(T[I] || 0);
        re > R && (R = re), Q > q && (q = Q);
      }
      return O;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: h });
    r.beginPath();
    for (const p of f) c && "roundRect" in r ? r.roundRect(p.x, p.y, p.width, p.height, c) : r.rect(p.x, p.y, p.width, p.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const h = u / 2, f = l[0] || [];
      return [f, l[1] || f].map(((p, m) => {
        const g = p.length, v = g ? c / g : 0, S = h, b = m === 0 ? -1 : 1, w = [{ x: 0, y: S }];
        let x = 0, C = 0;
        for (let k = 0; k <= g; k++) {
          const T = Math.round(k * v);
          if (T > x) {
            const O = S + (Math.round(C * h * d) || 1) * b;
            w.push({ x, y: O }), x = T, C = 0;
          }
          const E = Math.abs(p[k] || 0);
          E > C && (C = E);
        }
        return w.push({ x, y: S }), w;
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
      let h = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const p = (c = d[f]) !== null && c !== void 0 ? c : 0, m = Math.abs(p);
        m > h && (h = m);
      }
      return h ? u / h : u;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    $p(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
  }
  renderSingleCanvas(e, t, r, i, s, o, a) {
    const l = this.getPixelRatio(), c = document.createElement("canvas");
    c.width = Math.round(r * l), c.height = Math.round(i * l), c.style.width = `${r}px`, c.style.height = `${i}px`, c.style.left = `${Math.round(s)}px`, o.appendChild(c);
    const u = c.getContext("2d");
    if (t.renderFunction ? (u.fillStyle = this.convertColorValues(t.waveColor, u), t.renderFunction(e, u)) : this.renderWaveform(e, t, u), c.width > 0 && c.height > 0) {
      const d = c.cloneNode(), h = d.getContext("2d");
      h.drawImage(c, 0, 0), h.globalCompositeOperation = "source-in", h.fillStyle = this.convertColorValues(t.progressColor, h), h.fillRect(0, 0, c.width, c.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, r, i, s, o) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, c = r / a, u = (function({ clientWidth: p, totalWidth: m, options: g }) {
      return Vu(Math.min(8e3, p, m), g);
    })({ clientWidth: l, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const h = (p) => {
      if (p < 0 || p >= f || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = Vu(g, t), g <= 0) return;
      const v = (function({ channelData: S, offset: b, clampedWidth: w, totalWidth: x }) {
        return S.map(((C) => {
          const k = Math.floor(b / x * C.length), T = Math.floor((b + w) / x * C.length);
          return C.slice(k, T);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(v, t, g, i, m, s, o);
    }, f = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < f; p++) h(p);
      return;
    }
    if (qu({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: f }).forEach(((p) => h(p))), f > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), qu({ scrollLeft: m, totalWidth: c, numCanvases: f }).forEach(((g) => h(g)));
      }));
      this.unsubscribeOnScroll.push(p);
    }
  }
  renderChannel(e, t, r, i) {
    var { overlay: s } = t, o = (function(u, d) {
      var h = {};
      for (var f in u) Object.prototype.hasOwnProperty.call(u, f) && d.indexOf(f) < 0 && (h[f] = u[f]);
      if (u != null && typeof Object.getOwnPropertySymbols == "function") {
        var p = 0;
        for (f = Object.getOwnPropertySymbols(u); p < f.length; p++) d.indexOf(f[p]) < 0 && Object.prototype.propertyIsEnumerable.call(u, f[p]) && (h[f[p]] = u[f[p]]);
      }
      return h;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${l}px`, s && i > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const c = a.cloneNode();
    this.progressWrapper.appendChild(c), this.renderMultiCanvas(e, o, r, l, a, c);
  }
  render(e) {
    return Be(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((c) => c())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: l } = (function({ duration: c, minPxPerSec: u = 0, parentWidth: d, fillParent: h, pixelRatio: f }) {
        const p = Math.ceil(c * u), m = p > d, g = !!(h && !m);
        return { scrollWidth: p, isScrollable: m, useParentWidth: g, width: (g ? d : p) * f };
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
    return Be(this, void 0, void 0, (function* () {
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
class PT extends yi {
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
class Bo extends yi {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, void 0, void 0, (function* () {
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
const _T = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class ti extends ET {
  static create(e) {
    return new ti(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new Bo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, _T, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, h, f;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : pe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : pe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : pe(!1), v = (d = a?.isSeeking) !== null && d !== void 0 ? d : pe(!1), S = (h = a?.volume) !== null && h !== void 0 ? h : pe(1), b = (f = a?.playbackRate) !== null && f !== void 0 ? f : pe(1), w = pe(null), x = pe(null), C = pe(""), k = pe(0), T = pe(0), E = mn((() => !g.value), [g]), O = mn((() => w.value !== null), [w]), N = mn((() => O.value && m.value > 0), [O, m]), R = mn((() => p.value), [p]), q = mn((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: E, isSeeking: v, volume: S, playbackRate: b, audioBuffer: w, peaks: x, url: C, zoom: k, scrollPosition: T, canPlay: O, isReady: N, progress: R, progressPercent: q }, actions: { setCurrentTime: (I) => {
        const F = Math.max(0, Math.min(m.value || 1 / 0, I));
        p.set(F);
      }, setDuration: (I) => {
        m.set(Math.max(0, I));
      }, setPlaying: (I) => {
        g.set(I);
      }, setSeeking: (I) => {
        v.set(I);
      }, setVolume: (I) => {
        const F = Math.max(0, Math.min(1, I));
        S.set(F);
      }, setPlaybackRate: (I) => {
        const F = Math.max(0.1, Math.min(16, I));
        b.set(F);
      }, setAudioBuffer: (I) => {
        w.set(I), I && m.set(I.duration);
      }, setPeaks: (I) => {
        x.set(I);
      }, setUrl: (I) => {
        C.set(I);
      }, setZoom: (I) => {
        k.set(Math.max(0, I));
      }, setScrollPosition: (I) => {
        T.set(Math.max(0, I));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new PT();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new DT(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      r.push(Kt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Kt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Kt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Kt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Kt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Kt((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Pi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Pi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return Be(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        t = yield TT.fetchBlob(e, l, a);
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
        a instanceof Bo && (a.duration = o);
      }
      if (r) this.decodedData = Pi.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Pi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return Be(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return Be(this, void 0, void 0, (function* () {
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
        let h = 0;
        for (let f = 0; f < d.length; f++) {
          const p = d[f];
          Math.abs(p) > Math.abs(h) && (h = p);
        }
        l.push(Math.round(h * r) / r);
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
    return Be(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof Bo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return Be(this, void 0, void 0, (function* () {
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
    return Be(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
ti.BasePlugin = class extends yi {
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
}, ti.dom = CT;
class Bp {
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
class IT extends Bp {
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
function Fp(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Fp(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Mr(n, e, t) {
  const r = Fp(n, e || {});
  return t?.appendChild(r), r;
}
function zp(n) {
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
function zi(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Un(n, e) {
  const t = zp(null), r = (i) => {
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
function Vi(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = zp(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, h = u.clientY, f = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: v } = m, S = (k) => {
      if (k.defaultPrevented || o.size > 1 || a && Date.now() - p < i) return;
      const T = k.clientX, E = k.clientY, O = T - d, N = E - h;
      (f || Math.abs(O) > t || Math.abs(N) > t) && (k.preventDefault(), k.stopPropagation(), f || (s.set({ type: "start", x: d - g, y: h - v }), f = !0), s.set({ type: "move", x: T - g, y: E - v, deltaX: O, deltaY: N }), d = T, h = E);
    }, b = (k) => {
      if (o.delete(k.pointerId), f) {
        const T = k.clientX, E = k.clientY;
        s.set({ type: "end", x: T - g, y: E - v });
      }
      l();
    }, w = (k) => {
      o.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || b(k);
    }, x = (k) => {
      f && (k.stopPropagation(), k.preventDefault());
    }, C = (k) => {
      k.defaultPrevented || o.size > 1 || f && k.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", b), document.addEventListener("pointerout", w), document.addEventListener("pointercancel", w), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", b), document.removeEventListener("pointerout", w), document.removeEventListener("pointercancel", w), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", x, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", c), o.clear(), hn(s);
  } };
}
class Wu extends Bp {
  constructor(e, t, r = 0) {
    var i, s, o, a, l, c, u, d, h, f;
    super(), this.totalDuration = t, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (c = e.color) !== null && c !== void 0 ? c : "rgba(0, 0, 0, 0.1)", this.minLength = (u = e.minLength) !== null && u !== void 0 ? u : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (h = e.channelIdx) !== null && h !== void 0 ? h : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Mr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Mr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Vi(r, { threshold: 1 }), o = Vi(i, { threshold: 1 }), a = zi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = zi((() => {
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
    const i = Mr("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Un(e, "click"), r = Un(e, "mouseenter"), i = Un(e, "mouseleave"), s = Un(e, "dblclick"), o = Un(e, "pointerdown"), a = Un(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), h = o.subscribe(((g) => g && this.toggleCursor(!0))), f = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), h(), f(), hn(t), hn(r), hn(i), hn(s), hn(o), hn(a);
    }));
    const p = Vi(e), m = zi((() => {
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
        this.content = Mr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Nl extends IT {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Nl(e);
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
    return Mr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Wu(e, i, s);
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
    const l = Vi(i, { threshold: t }), c = zi((() => {
      var u, d;
      const h = l.signal.value;
      if (h) if (h.type === "start") {
        if (o = h.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * f;
        const g = h.x / m * f, v = (h.x + 5) / m * f;
        s = new Wu(Object.assign(Object.assign({}, e), { start: g, end: v }), f, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else h.type === "move" && h.deltaX !== void 0 ? s && s._onUpdate(h.deltaX, h.x > o ? "end" : "start", a) : h.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
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
const Fo = [0.5, 0.75, 1, 1.25, 1.5, 2];
function NT(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = nn(null), o = nn(null), a = D(0), l = D(0), c = D(!1), u = D(!1), d = D(!1), h = D(1), f = D(1), p = D(!1), m = A(() => Wr(a.value)), g = A(() => Wr(l.value));
  function v(I, F) {
    R(), d.value = !0, u.value = !1;
    const re = Nl.create();
    o.value = re;
    const Q = ti.create({
      container: I,
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
      renderFunction: kg,
      url: F,
      plugins: [re]
    });
    Q.on("ready", () => {
      u.value = !0, d.value = !1, l.value = Q.getDuration(), S();
    }), Q.on("timeupdate", (ie) => {
      a.value = ie;
    }), Q.on("play", () => {
      c.value = !0;
    }), Q.on("pause", () => {
      c.value = !1;
    }), Q.on("finish", () => {
      c.value = !1;
    }), s.value = Q;
  }
  function S() {
    const I = o.value;
    if (I) {
      I.clearRegions();
      for (const F of r.value) {
        const re = F.speakerId ? i.value.get(F.speakerId) : void 0;
        if (!re || F.startTime == null || F.endTime == null) continue;
        const Q = re.color;
        I.addRegion({
          start: F.startTime,
          end: F.endTime,
          color: vg(Q, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Q);
      }
    }
  }
  function b() {
    s.value?.play();
  }
  function w() {
    s.value?.pause();
  }
  function x() {
    s.value?.playPause();
  }
  function C(I) {
    const F = s.value;
    !F || l.value === 0 || F.setTime(I);
  }
  function k(I) {
    C(Math.max(0, Math.min(a.value + I, l.value)));
  }
  function T(I) {
    const F = s.value;
    F && (h.value = I, F.setVolume(I), I > 0 && p.value && (p.value = !1, F.setMuted(!1)));
  }
  function E() {
    const I = s.value;
    I && (p.value = !p.value, I.setMuted(p.value));
  }
  function O(I) {
    const F = s.value;
    F && (f.value = I, F.setPlaybackRate(I));
  }
  function N() {
    const F = (Fo.indexOf(
      f.value
    ) + 1) % Fo.length;
    O(Fo[F] ?? 1);
  }
  function R() {
    q !== null && (clearTimeout(q), q = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  te(
    [e, t],
    ([I, F]) => {
      I && F && v(I, F);
    },
    { immediate: !0 }
  );
  let q = null;
  return te([r, i], () => {
    u.value && (q !== null && clearTimeout(q), q = setTimeout(() => {
      q = null, S();
    }, 150));
  }), zt(() => {
    R();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: h,
    playbackRate: f,
    isMuted: p,
    formattedCurrentTime: m,
    formattedDuration: g,
    play: b,
    pause: w,
    togglePlay: x,
    seekTo: C,
    skip: k,
    setVolume: T,
    setPlaybackRate: O,
    cyclePlaybackRate: N,
    toggleMute: E
  };
}
const RT = { class: "audio-player" }, $T = /* @__PURE__ */ B({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, s = D(null), {
      isPlaying: o,
      isReady: a,
      isLoading: l,
      volume: c,
      playbackRate: u,
      isMuted: d,
      currentTime: h,
      formattedCurrentTime: f,
      formattedDuration: p,
      togglePlay: m,
      seekTo: g,
      pause: v,
      skip: S,
      setVolume: b,
      cyclePlaybackRate: w,
      toggleMute: x
    } = NT({
      containerRef: s,
      audioSrc: Ni(() => r.audioSrc),
      turns: Ni(() => r.turns),
      speakers: Ni(() => r.speakers)
    });
    return te(h, (C) => i("timeupdate", C)), te(o, (C) => i("playStateChange", C)), e({ seekTo: g, pause: v }), (C, k) => (M(), U("footer", RT, [
      K("div", {
        ref_key: "waveformRef",
        ref: s,
        class: $t(["waveform-container", { "waveform-container--loading": y(l) }])
      }, null, 2),
      $(xT, {
        "is-playing": y(o),
        "current-time": y(f),
        duration: y(p),
        volume: y(c),
        "playback-rate": y(u),
        "is-muted": y(d),
        "is-ready": y(a),
        onTogglePlay: y(m),
        onSkipBack: k[0] || (k[0] = (T) => y(S)(-10)),
        onSkipForward: k[1] || (k[1] = (T) => y(S)(10)),
        "onUpdate:volume": y(b),
        onToggleMute: y(x),
        onCyclePlaybackRate: y(w)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), LT = /* @__PURE__ */ fe($T, [["__scopeId", "data-v-9248e45e"]]);
class BT {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), a = this.removeEmpty(this.tokenize(s, r)), l = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, l, r, i);
  }
  diffWithOptionsObj(e, t, r, i) {
    var s;
    const o = (S) => {
      if (S = this.postProcess(S, r), i) {
        setTimeout(function() {
          i(S);
        }, 0);
        return;
      } else
        return S;
    }, a = t.length, l = e.length;
    let c = 1, u = a + l;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, h = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(f[0], t, e, 0, r);
    if (f[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(f[0].lastComponent, t, e));
    let m = -1 / 0, g = 1 / 0;
    const v = () => {
      for (let S = Math.max(m, -c); S <= Math.min(g, c); S += 2) {
        let b;
        const w = f[S - 1], x = f[S + 1];
        w && (f[S - 1] = void 0);
        let C = !1;
        if (x) {
          const T = x.oldPos - S;
          C = x && 0 <= T && T < a;
        }
        const k = w && w.oldPos + 1 < l;
        if (!C && !k) {
          f[S] = void 0;
          continue;
        }
        if (!k || C && w.oldPos < x.oldPos ? b = this.addToPath(x, !0, !1, 0, r) : b = this.addToPath(w, !1, !0, 1, r), p = this.extractCommon(b, t, e, S, r), b.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(b.lastComponent, t, e)) || !0;
        f[S] = b, b.oldPos + 1 >= l && (g = Math.min(g, S - 1)), p + 1 >= a && (m = Math.max(m, S + 1));
      }
      c++;
    };
    if (i)
      (function S() {
        setTimeout(function() {
          if (c > u || Date.now() > h)
            return i(void 0);
          v() || S();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= h; ) {
        const S = v();
        if (S)
          return S;
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
          d = d.map(function(h, f) {
            const p = r[c + f];
            return p.length > h.length ? p : h;
          }), u.value = this.join(d);
        } else
          u.value = this.join(t.slice(l, l + u.count));
        l += u.count, u.added || (c += u.count);
      }
    }
    return i;
  }
}
class FT extends BT {
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
const zT = new FT();
function VT(n, e, t) {
  return zT.diff(n, e, t);
}
function zo({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = VT(i, s, {
    comparator: WT
  }), a = qT(o), l = [...e];
  let c = [...e], u = 0;
  for (const f of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      c = qi(
        c,
        l[0],
        f.countAdded - f.countRemoved
      ), u += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const p = f;
      u += p.count, c = qi(
        c,
        l[0],
        -p.count
      );
    } else if ("added" in f && f.added) {
      const p = f;
      c = qi(
        c,
        l[0],
        p.count
      );
    } else
      u += f.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, h = s.slice(d).join(" ");
  if (r(h)) {
    const p = Vp(
      h,
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
function qT(n) {
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
function qi(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function Vp(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    qi(
      Vp(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function WT(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class UT {
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
class HT extends UT {
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
    this.resetAll(), this.currentState = zo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = zo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = zo(
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
function qp(n) {
  const e = Et();
  let t = null;
  me(() => {
    n.canvasRef.value && (t = new HT(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), te([n.fontSize, n.lineHeight], ([l, c]) => {
    t && t.setFontSize(l, c);
  }), te(
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
  hr(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
function Wp(n) {
  const e = D(!1);
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
  return n && te(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), me(a), zt(i), { visible: e };
}
const Uu = /\$(\w+)/g;
function jT(n, e) {
  const t = [];
  let r = 0, i;
  for (Uu.lastIndex = 0; (i = Uu.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const KT = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, JT = ["src", "alt"], XT = { key: 1 }, YT = /* @__PURE__ */ B({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = Et().subtitle?.watermark, r = A(() => t ? jT(t.content.value, t.tokens.value) : []);
    return (i, s) => (M(), L(Ua, { name: "watermark" }, {
      default: P(() => [
        n.visible && y(t) ? (M(), U("div", KT, [
          (M(!0), U(Ke, null, cn(r.value, (o, a) => (M(), U(Ke, { key: a }, [
            o.type === "token" ? (M(), U("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, JT)) : (M(), U("span", XT, G(o.value), 1))
          ], 64))), 128))
        ])) : Y("", !0)
      ]),
      _: 1
    }));
  }
}), Up = /* @__PURE__ */ fe(YT, [["__scopeId", "data-v-b8c2ff2b"]]), GT = ["height"], QT = /* @__PURE__ */ B({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Et(), t = qr("canvas"), r = A(() => e.subtitle?.fontSize.value ?? 40), i = A(() => 1.2 * r.value), s = A(() => 2.4 * r.value);
    qp({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = Wp(
      e.subtitle?.watermark
    );
    return (a, l) => (M(), U("div", {
      class: "subtitle-banner",
      style: an({ height: s.value + "px" })
    }, [
      K("canvas", {
        ref: "canvas",
        class: $t(["subtitle-canvas", { "subtitle-canvas--shrunk": y(o) }]),
        height: s.value
      }, null, 10, GT),
      $(Up, { visible: y(o) }, null, 8, ["visible"])
    ], 4));
  }
}), ZT = /* @__PURE__ */ fe(QT, [["__scopeId", "data-v-f62eaf60"]]), eE = {
  ref: "container",
  class: "subtitle-fullscreen"
}, tE = ["aria-label"], nE = /* @__PURE__ */ B({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Et(), { t } = ut(), r = qr("container"), i = qr("canvas"), s = A(() => e.subtitle?.fontSize.value ?? 48), o = A(() => 1.2 * s.value);
    qp({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = Wp(
      e.subtitle?.watermark
    );
    me(async () => {
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
    me(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function c() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return hr(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, d) => (M(), U("div", eE, [
      K("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": y(t)("subtitle.exitFullscreen"),
        onClick: c
      }, [
        $(y(Ka), { size: 24 })
      ], 8, tE),
      K("canvas", {
        ref: "canvas",
        class: $t(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": y(a) }])
      }, null, 2),
      $(Up, { visible: y(a) }, null, 8, ["visible"])
    ], 512));
  }
}), rE = /* @__PURE__ */ fe(nE, [["__scopeId", "data-v-e3ae14e0"]]), iE = /* @__PURE__ */ B({
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
    const t = n, r = D(!1);
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
    const o = A(() => r.value ? "check" : t.icon), a = A(() => Nd[t.size ?? "sm"]);
    return (l, c) => (M(), L(ot, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: $t({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: P(() => [
        $(Ua, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: P(() => [
            (M(), L(Ri, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: P(() => [
        j(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Hu = /* @__PURE__ */ fe(iE, [["__scopeId", "data-v-0077b14e"]]), sE = ["aria-label"], oE = { class: "selection-count" }, aE = { class: "selection-actions" }, lE = /* @__PURE__ */ B({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Tf(), { t } = ut();
    return (r, i) => y(e).hasSelection.value ? (M(), U("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": y(t)("selection.count")
    }, [
      K("span", oE, G(y(e).count.value) + " " + G(y(t)("selection.count")), 1),
      K("div", aE, [
        $(Hu, {
          icon: "clipboard-type",
          "copy-fn": y(e).copyText,
          variant: "secondary"
        }, {
          default: P(() => [
            we(G(y(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        $(Hu, {
          icon: "clipboard-list",
          "copy-fn": y(e).copyWithMetadata
        }, {
          default: P(() => [
            we(G(y(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        $(ot, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => y(e).clear())
        }, {
          default: P(() => [
            we(G(y(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, sE)) : Y("", !0);
  }
}), cE = /* @__PURE__ */ fe(lE, [["__scopeId", "data-v-1c5a7d10"]]), uE = { class: "editor-layout" }, dE = { class: "editor-body" }, fE = {
  key: 4,
  class: "mobile-selectors"
}, hE = /* @__PURE__ */ B({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Et(), { isMobile: r } = Pp(), i = D(!1), s = A(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), o = t.speakers.all;
    Y0(s, o, t);
    const a = A(() => [...t.channels.values()]), l = A(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), c = A(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), u = A(() => Array.from(o.values())), d = qr("audioPlayer");
    function h(m) {
      t.audio && (t.audio.currentTime.value = m);
    }
    te(
      () => t.activeChannelId.value,
      () => {
        d.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((m) => d.value?.seekTo(m));
    function f(m) {
      t.setActiveChannel(m);
    }
    function p(m) {
      t.activeChannel.value?.setActiveTranslation(m);
    }
    return (m, g) => (M(), U("div", uE, [
      e.showHeader ? (M(), L(Jg, {
        key: 0,
        title: y(t).title.value,
        duration: y(t).activeChannel.value?.duration ?? 0,
        language: c.value,
        "is-mobile": y(r),
        onToggleSidebar: g[0] || (g[0] = (v) => i.value = !i.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : Y("", !0),
      $(cE),
      K("main", dE, [
        $(DC, {
          turns: s.value,
          speakers: y(o)
        }, null, 8, ["turns", "speakers"]),
        y(r) ? Y("", !0) : (M(), L(Bu, {
          key: 0,
          speakers: u.value,
          channels: a.value,
          "selected-channel-id": y(t).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedChannelId": f,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        y(r) ? (M(), L(pT, {
          key: 1,
          open: i.value,
          "onUpdate:open": g[1] || (g[1] = (v) => i.value = v)
        }, {
          default: P(() => [
            $(Bu, {
              speakers: u.value,
              channels: a.value,
              "selected-channel-id": y(t).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": c.value,
              "onUpdate:selectedChannelId": f,
              "onUpdate:selectedTranslationId": p
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : Y("", !0)
      ]),
      y(t).audio?.src.value ? (M(), L(LT, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": y(t).audio.src.value,
        turns: s.value,
        speakers: y(o),
        onTimeupdate: h,
        onPlayStateChange: g[2] || (g[2] = (v) => {
          y(t).audio && (y(t).audio.isPlaying.value = v);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : Y("", !0),
      y(t).subtitle?.isVisible.value && !y(r) && !y(t).subtitle.isFullscreen.value ? (M(), L(ZT, { key: 2 })) : Y("", !0),
      y(t).subtitle?.isFullscreen.value ? (M(), L(rE, { key: 3 })) : Y("", !0),
      y(r) && (a.value.length > 1 || l.value.length > 1) ? (M(), U("div", fE, [
        a.value.length > 1 ? (M(), L(Ip, {
          key: 0,
          channels: a.value,
          "selected-channel-id": y(t).activeChannelId.value,
          "onUpdate:selectedChannelId": f
        }, null, 8, ["channels", "selected-channel-id"])) : Y("", !0),
        l.value.length > 1 ? (M(), L(Np, {
          key: 1,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["translations", "selected-translation-id"])) : Y("", !0)
      ])) : Y("", !0)
    ]));
  }
}), yD = /* @__PURE__ */ fe(hE, [["__scopeId", "data-v-a4bf8df9"]]);
function vD(n = {}) {
  return {
    name: "audio",
    install(e) {
      const t = D(0), r = D(!1), i = D(null), s = D(null);
      let o = null;
      const a = A(
        () => e.activeChannel.value?.activeTranslation.value.audio ?? null
      ), l = D(null);
      let c = null;
      function u() {
        c && (URL.revokeObjectURL(c), c = null);
      }
      const d = te(
        a,
        async (v) => {
          if (u(), l.value = null, !!v)
            try {
              const S = n.resolveSrc ? await n.resolveSrc(v) : v.src;
              l.value = S, S.startsWith("blob:") && (c = S);
            } catch (S) {
              console.error("[audio] resolveSrc failed", S);
            }
        },
        { immediate: !0 }
      ), h = A(() => l.value), f = Ge(() => {
        if (!r.value) return;
        const v = t.value, S = e.activeChannel.value?.activeTranslation.value;
        if (S) {
          for (const b of S.turns.value)
            if (b.startTime != null && b.endTime != null && v >= b.startTime && v <= b.endTime) {
              s.value = b.id, i.value = ja(b.words) ? kd(b.words, v) : null;
              return;
            }
        }
      });
      function p(v) {
        o?.(v);
      }
      function m(v) {
        o = v;
      }
      const g = {
        currentTime: t,
        isPlaying: r,
        src: h,
        activeWordId: i,
        activeTurnId: s,
        seekTo: p,
        setSeekHandler: m
      };
      return e.audio = g, () => {
        d(), f(), u(), e.audio = void 0;
      };
    }
  };
}
var Hp = Il.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const _n = Math.floor, pE = Math.abs, tn = (n, e) => n < e ? n : e, cr = (n, e) => n > e ? n : e, mE = (n) => n !== 0 ? n < 0 : 1 / n < 0, gE = 64, ni = 128, yE = 1 << 29, ju = 63, $r = 127, vE = 2147483647, Ku = Number.MAX_SAFE_INTEGER, Ju = Number.MIN_SAFE_INTEGER, bE = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && _n(n) === n), wE = () => /* @__PURE__ */ new Set(), Rl = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, jp = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, SE = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, Xs = Array.isArray, Kp = String.fromCharCode, kE = (n) => n.toLowerCase(), xE = /^\s*/g, CE = (n) => n.replace(xE, ""), TE = /([A-Z])/g, Xu = (n, e) => CE(n.replace(TE, (t) => `${e}${kE(t)}`)), EE = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ri = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), ME = (n) => ri.encode(n), AE = ri ? ME : EE;
let Vo = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Vo && Vo.decode(new Uint8Array()).length === 1 && (Vo = null);
const OE = (n, e) => SE(e, () => n).join("");
let DE = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const PE = () => new DE(), _E = (n) => {
  const e = PE();
  return n(e), NE(e);
}, IE = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, NE = (n) => {
  const e = new Uint8Array(IE(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, RE = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(cr(t, e) * 2), n.cpos = 0);
}, Ee = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, ii = (n, e) => {
  for (; e > $r; )
    Ee(n, ni | $r & e), e = _n(e / 128);
  Ee(n, $r & e);
}, $E = (n, e) => {
  const t = mE(e);
  for (t && (e = -e), Ee(n, (e > ju ? ni : 0) | (t ? gE : 0) | ju & e), e = _n(e / 64); e > 0; )
    Ee(n, (e > $r ? ni : 0) | $r & e), e = _n(e / 128);
}, Ea = new Uint8Array(3e4), LE = Ea.length / 3, BE = (n, e) => {
  if (e.length < LE) {
    const t = ri.encodeInto(e, Ea).written || 0;
    ii(n, t);
    for (let r = 0; r < t; r++)
      Ee(n, Ea[r]);
  } else
    Jp(n, AE(e));
}, FE = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  ii(n, r);
  for (let i = 0; i < r; i++)
    Ee(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Yu = ri && /** @type {any} */
ri.encodeInto ? BE : FE, zE = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = tn(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(cr(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, Jp = (n, e) => {
  ii(n, e.byteLength), zE(n, e);
}, $l = (n, e) => {
  RE(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, VE = (n, e) => $l(n, 4).setFloat32(0, e, !1), qE = (n, e) => $l(n, 8).setFloat64(0, e, !1), WE = (n, e) => (
  /** @type {any} */
  $l(n, 8).setBigInt64(0, e, !1)
), Gu = new DataView(new ArrayBuffer(4)), UE = (n) => (Gu.setFloat32(0, n), Gu.getFloat32(0) === n), Ma = (n, e) => {
  switch (typeof e) {
    case "string":
      Ee(n, 119), Yu(n, e);
      break;
    case "number":
      bE(e) && pE(e) <= vE ? (Ee(n, 125), $E(n, e)) : UE(e) ? (Ee(n, 124), VE(n, e)) : (Ee(n, 123), qE(n, e));
      break;
    case "bigint":
      Ee(n, 122), WE(n, e);
      break;
    case "object":
      if (e === null)
        Ee(n, 126);
      else if (Xs(e)) {
        Ee(n, 117), ii(n, e.length);
        for (let t = 0; t < e.length; t++)
          Ma(n, e[t]);
      } else if (e instanceof Uint8Array)
        Ee(n, 116), Jp(n, e);
      else {
        Ee(n, 118);
        const t = Object.keys(e);
        ii(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          Yu(n, i), Ma(n, e[i]);
        }
      }
      break;
    case "boolean":
      Ee(n, e ? 120 : 121);
      break;
    default:
      Ee(n, 127);
  }
}, Ys = (n) => new Error(n), Xp = () => {
  throw Ys("Method unimplemented");
}, Gs = () => {
  throw Ys("Unexpected case");
}, Wi = () => /* @__PURE__ */ new Map(), Yp = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, si = /* @__PURE__ */ Symbol("Equality"), HE = (n, e) => n === e || !!n?.[si]?.(e) || !1, jE = (n) => typeof n == "object", Gp = Object.keys, Qu = (n) => Gp(n).length, vi = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, Qp = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Ui = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[si] != null)
    return n[si](e);
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
        if (!e.has(t) || !Ui(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (Qu(n) !== Qu(e))
        return !1;
      for (const t in n)
        if (!Qp(n, t) || !Ui(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Ui(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, KE = (n, e) => e.includes(n), JE = () => {
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
}, XE = /[\uD800-\uDBFF]/, YE = /[\uDC00-\uDFFF]/, GE = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && XE.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && YE.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, QE = GE, ZE = Math.random, eM = (n) => n[_n(ZE() * n.length)], Zu = (n) => n === void 0 ? null : n;
class tM {
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
let Zp = new tM(), nM = !0;
try {
  typeof localStorage < "u" && localStorage && (Zp = localStorage, nM = !1);
} catch {
}
const rM = Zp, ur = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", em = typeof window < "u" && typeof document < "u" && !ur;
let yt;
const iM = () => {
  if (yt === void 0)
    if (ur) {
      yt = Wi();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && yt.set(e, ""), e = r) : e !== null && (yt.set(e, r), e = null);
      }
      e !== null && yt.set(e, "");
    } else typeof location == "object" ? (yt = Wi(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        yt.set(`--${Xu(e, "-")}`, t), yt.set(`-${Xu(e, "-")}`, t);
      }
    })) : yt = Wi();
  return yt;
}, Aa = (n) => iM().has(n), Oa = (n) => Zu(ur ? process.env[n.toUpperCase().replaceAll("-", "_")] : rM.getItem(n)), tm = (n) => Aa("--" + n) || Oa(n) !== null, sM = tm("production"), oM = ur && KE(process.env.FORCE_COLOR, ["true", "1", "2"]);
oM || !Aa("--no-colors") && // @todo deprecate --no-colors
!tm("no-color") && (!ur || process.stdout.isTTY) && (!ur || Aa("--color") || Oa("COLORTERM") !== null || (Oa("TERM") || "").includes("color"));
const aM = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += Kp(n[t]);
  return btoa(e);
}, lM = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), cM = em ? aM : lM, uM = (n) => _E((e) => Ma(e, n)), ed = (n) => n.next() >= 0.5, qo = (n, e, t) => _n(n.next() * (t + 1 - e) + e), nm = (n, e, t) => _n(n.next() * (t + 1 - e) + e), Ll = (n, e, t) => nm(n, e, t), dM = (n) => Kp(Ll(n, 97, 122)), fM = (n, e = 0, t = 20) => {
  const r = Ll(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += dM(n);
  return i;
}, Wo = (n, e) => e[Ll(n, 0, e.length - 1)], hM = /* @__PURE__ */ Symbol("0schema");
class pM {
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
      e.push(OE(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Da = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[si] ? HE(n, e) : Xs(n) ? Rl(
  n,
  (t) => jp(e, (r) => Da(t, r))
) : jE(n) ? vi(
  n,
  (t, r) => Da(t, e[r])
) : !1;
class qe {
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
      this.constructor._dilutes && ([r, t] = [t, r]), Da(t, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Ui(this.shape, e.shape);
  }
  [hM]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [si](e) {
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
    Xp();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return yr(this, no);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new sm(
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
    return td(e, this), /** @type {any} */
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
    return td(e, this), e;
  }
}
class Bl extends qe {
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
const be = (n, e = null) => new Bl(n, e);
be(Bl);
class Fl extends qe {
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
const Ce = (n) => new Fl(n);
be(Fl);
class Qs extends qe {
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
const Zs = (...n) => new Qs(n), rm = be(Qs), mM = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), im = (n) => {
  if (dr.check(n))
    return [mM(n)];
  if (rm.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if (pm.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (mm.check(n))
    return [".*"];
  if (ys.check(n))
    return n.shape.map(im).flat(1);
  Gs();
};
class gM extends qe {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(im).map((t) => `(${t.join("|")})`).join("") + "$");
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
be(gM);
const yM = /* @__PURE__ */ Symbol("optional");
class sm extends qe {
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
  get [yM]() {
    return !0;
  }
}
const vM = be(sm);
class bM extends qe {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
be(bM);
class eo extends qe {
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
    return new eo(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : vi(this.shape, (r, i) => {
      const s = this._isPartial && !Qp(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const wM = (n) => (
  /** @type {any} */
  new eo(n)
), SM = be(eo), kM = Ce((n) => n != null && (n.constructor === Object || n.constructor == null));
class om extends qe {
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
    return e != null && vi(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const am = (n, e) => new om(n, e), xM = be(om);
class lm extends qe {
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
    return e != null && vi(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const CM = (...n) => new lm(n);
be(lm);
class cm extends qe {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new zl(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = Xs(e) && Rl(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const um = (...n) => new cm(n), TM = be(cm), EM = Ce((n) => Xs(n));
class dm extends qe {
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
const MM = (n, e = null) => new dm(n, e);
be(dm);
const AM = MM(qe);
class OM extends qe {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = CM(...e.slice(-1)), this.res = e[this.len];
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
const DM = be(OM), PM = Ce((n) => typeof n == "function");
class _M extends qe {
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
    const r = Rl(this.shape, (i) => i.check(e, t));
    return !r && t?.extend(null, "Intersectinon", typeof e), r;
  }
}
be(_M, (n) => n.shape.length > 0);
class zl extends qe {
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
    const r = jp(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const yr = (...n) => n.findIndex((e) => ys.check(e)) >= 0 ? yr(...n.map((e) => oi(e)).map((e) => ys.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new zl(n), ys = (
  /** @type {Schema<$Union<any>>} */
  be(zl)
), fm = () => !0, vs = Ce(fm), IM = (
  /** @type {Schema<Schema<any>>} */
  be(Fl, (n) => n.shape === fm)
), Vl = Ce((n) => typeof n == "bigint"), NM = (
  /** @type {Schema<Schema<BigInt>>} */
  Ce((n) => n === Vl)
), hm = Ce((n) => typeof n == "symbol");
Ce((n) => n === hm);
const Zn = Ce((n) => typeof n == "number"), pm = (
  /** @type {Schema<Schema<number>>} */
  Ce((n) => n === Zn)
), dr = Ce((n) => typeof n == "string"), mm = (
  /** @type {Schema<Schema<string>>} */
  Ce((n) => n === dr)
), to = Ce((n) => typeof n == "boolean"), RM = (
  /** @type {Schema<Schema<Boolean>>} */
  Ce((n) => n === to)
), gm = Zs(void 0);
be(Qs, (n) => n.shape.length === 1 && n.shape[0] === void 0);
Zs(void 0);
const no = Zs(null), $M = (
  /** @type {Schema<Schema<null>>} */
  be(Qs, (n) => n.shape.length === 1 && n.shape[0] === null)
);
be(Uint8Array);
be(Bl, (n) => n.shape === Uint8Array);
const LM = yr(Zn, dr, no, gm, Vl, to, hm);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    um(vs)
  ), e = (
    /** @type {$Record<$string,$any>} */
    am(dr, vs)
  ), t = yr(Zn, dr, no, to, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const oi = (n) => {
  if (AM.check(n))
    return (
      /** @type {any} */
      n
    );
  if (kM.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = oi(n[t]);
    return (
      /** @type {any} */
      wM(e)
    );
  } else {
    if (EM.check(n))
      return (
        /** @type {any} */
        yr(...n.map(oi))
      );
    if (LM.check(n))
      return (
        /** @type {any} */
        Zs(n)
      );
    if (PM.check(n))
      return (
        /** @type {any} */
        be(
          /** @type {any} */
          n
        )
      );
  }
  Gs();
}, td = sM ? () => {
} : (n, e) => {
  const t = new pM();
  if (!e.check(n, t))
    throw Ys(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class BM {
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
    return this.patterns.push({ if: oi(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(vs, e);
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
        throw Ys("Unhandled pattern");
      }
    );
  }
}
const FM = (n) => new BM(
  /** @type {any} */
  n
), ym = (
  /** @type {any} */
  FM(
    /** @type {Schema<prng.PRNG>} */
    vs
  ).if(pm, (n, e) => qo(e, Ju, Ku)).if(mm, (n, e) => fM(e)).if(RM, (n, e) => ed(e)).if(NM, (n, e) => BigInt(qo(e, Ju, Ku))).if(ys, (n, e) => Hn(e, Wo(e, n.shape))).if(SM, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (vM.check(i)) {
        if (ed(e))
          continue;
        i = i.shape;
      }
      t[r] = ym(i, e);
    }
    return t;
  }).if(TM, (n, e) => {
    const t = [], r = nm(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push(Hn(e, n.shape));
    return t;
  }).if(rm, (n, e) => Wo(e, n.shape)).if($M, (n, e) => null).if(DM, (n, e) => {
    const t = Hn(e, n.res);
    return () => t;
  }).if(IM, (n, e) => Hn(e, Wo(e, [
    Zn,
    dr,
    no,
    gm,
    Vl,
    to,
    um(Zn),
    am(yr("a", "b", "c"), Zn)
  ]))).if(xM, (n, e) => {
    const t = {}, r = qo(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = Hn(e, n.shape.keys), o = Hn(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), Hn = (n, e) => (
  /** @type {any} */
  ym(oi(e), n)
), bi = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Ce((n) => n.nodeType === WM);
typeof DOMParser < "u" && new DOMParser();
Ce((n) => n.nodeType === zM);
Ce((n) => n.nodeType === VM);
const zM = bi.ELEMENT_NODE, VM = bi.TEXT_NODE, qM = bi.DOCUMENT_NODE, WM = bi.DOCUMENT_FRAGMENT_NODE;
Ce((n) => n.nodeType === qM);
const UM = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, HM = UM(clearTimeout), ql = (n, e) => new HM(setTimeout(e, n)), St = (n, e) => n >>> e | n << 32 - e, jM = (n) => St(n, 2) ^ St(n, 13) ^ St(n, 22), KM = (n) => St(n, 6) ^ St(n, 11) ^ St(n, 25), JM = (n) => St(n, 7) ^ St(n, 18) ^ n >>> 3, XM = (n) => St(n, 17) ^ St(n, 19) ^ n >>> 10, YM = new Uint32Array([
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
]), GM = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class QM {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set(GM), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = XM(t[d - 2]) + t[d - 7] + JM(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], l = e[5], c = e[6], u = e[7];
    for (let d = 0, h, f; d < 64; d++)
      h = u + KM(a) + (a & l ^ ~a & c) + YM[d] + t[d] >>> 0, f = jM(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = l, l = a, a = o + h >>> 0, o = s, s = i, i = r, r = h + f >>> 0;
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
        this._W[o] |= ni << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= ni << (3 - t % 4) * 8), this._W[14] = e.byteLength / yE, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let a = 0; a < 4; a++)
        s[o * 4 + a] = this._H[o] >>> (3 - a) * 8;
    return s;
  }
}
const ZM = (n) => new QM().digest(n), oe = new Qe("y-sync"), Rt = new Qe("y-undo"), _i = new Qe("yjs-cursor"), eA = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, tA = (n) => cM(eA(ZM(uM(n)))), bs = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !W.isDeleted(e.ds, n.id), nA = [{ light: "#ecd44433", dark: "#ecd444" }], rA = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = wE();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, eM(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, iA = (n, {
  colors: e = nA,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const a = new aA(n, s), l = new _e({
    props: {
      editable: (c) => {
        const u = oe.getState(c);
        return u.snapshot == null && u.prevSnapshot == null;
      }
    },
    key: oe,
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
        const d = c.getMeta(oe);
        if (d !== void 0) {
          u = Object.assign({}, u);
          for (const h in d)
            u[h] = d[h];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, a.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && ql(0, () => {
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
            const d = Rt.getState(c.state), h = d && d.undoManager;
            h && h.stopCapturing();
          }
          a.mux(() => {
            u.doc.transact((d) => {
              d.meta.set("addToHistory", u.addToHistory), a._prosemirrorChanged(c.state.doc);
            }, oe);
          });
        }
      },
      destroy: () => {
        a.destroy();
      }
    })
  });
  return l;
}, sA = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new Xe(n.doc));
    else if (e.type === "node") {
      const r = xn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection(oA(n, r));
    } else {
      const r = xn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = xn(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(Z.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, oA = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? J.create(n.doc, e) : Z.near(t);
}, Pa = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: li(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: li(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class aA {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = JE(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Pa(
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
    return this.prosemirrorView.hasFocus() ? (em && this._domSelectionInView === null && (ql(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = bi.documentElement;
    return i.bottom >= 0 && i.right >= 0 && i.left <= (window.innerWidth || s.clientWidth || 0) && i.top <= (window.innerHeight || s.clientHeight || 0);
  }
  /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */
  renderSnapshot(e, t) {
    t || (t = W.createSnapshot(W.createDeleteSet(), /* @__PURE__ */ new Map())), this.prosemirrorView.dispatch(
      this._tr.setMeta(oe, { snapshot: e, prevSnapshot: t })
    );
  }
  unrenderSnapshot() {
    this.mapping.clear(), this.mux(() => {
      const e = this.type.toArray().map(
        (r) => Hi(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(_.from(e), 0, 0)
      );
      t.setMeta(oe, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => Hi(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(_.from(t), 0, 0)
      );
      if (e) {
        const i = tn(cr(e.anchor, 0), r.doc.content.size), s = tn(cr(e.head, 0), r.doc.content.size);
        r.setSelection(Z.create(r.doc, i, s));
      }
      this.prosemirrorView.dispatch(
        r.setMeta(oe, { isChangeOrigin: !0, binding: this })
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
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && Gs(), i = new W.Doc({ gc: !1 }), W.applyUpdateV2(i, t), t = W.snapshot(i), W.applyUpdateV2(i, e), e = W.snapshot(i), s._item === null) {
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
          W.iterateDeletedStructs(o, d, (h) => {
          });
        });
        const l = (d, h) => {
          const f = d === "added" ? a.getUserByClientId(h.client) : a.getUserByDeletedId(h);
          return {
            user: f,
            type: d,
            color: rA(
              r.colorMapping,
              r.colors,
              f
            )
          };
        }, c = W.typeListToArraySnapshot(
          s,
          new W.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || bs(d._item, e) || bs(d._item, t) ? Hi(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          l
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new z(_.from(c), 0, 0)
        );
        this.prosemirrorView.dispatch(
          u.setMeta(oe, { isChangeOrigin: !0 })
        );
      }, oe);
    });
  }
  /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */
  _typeChanged(e, t) {
    if (this.prosemirrorView == null) return;
    const r = oe.getState(this.prosemirrorView.state);
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
        (a) => vm(
          /** @type {Y.XmlElement | Y.XmlHook} */
          a,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((a) => a !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new z(_.from(s), 0, 0)
      );
      sA(o, this.beforeTransactionSelection, this), o = o.setMeta(oe, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof W.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      Ss(this.doc, this.type, e, this), this.beforeTransactionSelection = Pa(
        this,
        this.prosemirrorView.state
      );
    }, oe);
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
const vm = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof W.XmlElement)
      return Hi(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw Xp();
  }
  return o;
}, Hi = (n, e, t, r, i, s) => {
  const o = [], a = (l) => {
    if (l instanceof W.XmlElement) {
      const c = vm(
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
      const u = lA(
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
    r !== void 0 && (bs(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? bs(
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
    }, oe), t.mapping.delete(n), null;
  }
}, lA = (n, e, t, r, i, s) => {
  const o = [], a = n.toDelta(r, i, s);
  try {
    for (let l = 0; l < a.length; l++) {
      const c = a[l];
      o.push(e.text(c.insert, pA(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, oe), null;
  }
  return o;
}, cA = (n, e) => {
  const t = new W.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: Sm(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, uA = (n, e) => {
  const t = new W.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    ro(n).map(
      (r) => _a(r, e)
    )
  ), e.mapping.set(t, n), t;
}, _a = (n, e) => n instanceof Array ? cA(n, e) : uA(n, e), nd = (n) => typeof n == "object" && n !== null, Wl = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], a = e[s];
    r = s === "ychange" || o === a || nd(o) && nd(a) && Wl(o, a);
  }
  return r;
}, ro = (n) => {
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
}, bm = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && Gp(r.attributes || {}).length === e[i].marks.length && vi(r.attributes, (s, o) => {
      const a = wm(o), l = e[i].marks;
      return l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      ) ? Wl(s, l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      )?.attrs) : !1;
    })
  );
}, ai = (n, e) => {
  if (n instanceof W.XmlElement && !(e instanceof Array) && Ia(n, e)) {
    const t = ro(e);
    return n._length === t.length && Wl(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => ai(r, t[i])
    );
  }
  return n instanceof W.XmlText && e instanceof Array && bm(n, e);
}, ws = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), rd = (n, e, t) => {
  const r = n.toArray(), i = ro(e), s = i.length, o = r.length, a = tn(o, s);
  let l = 0, c = 0, u = !1;
  for (; l < a; l++) {
    const d = r[l], h = i[l];
    if (ws(t.mapping.get(d), h))
      u = !0;
    else if (!ai(d, h))
      break;
  }
  for (; l + c < a; c++) {
    const d = r[o - c - 1], h = i[s - c - 1];
    if (ws(t.mapping.get(d), h))
      u = !0;
    else if (!ai(d, h))
      break;
  }
  return {
    equalityFactor: l + c,
    foundMappedChild: u
  };
}, dA = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof W.ContentString ? e += t.content.str : t.content instanceof W.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, fA = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = dA(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, Sm(c.marks, t))
  })), { insert: o, remove: a, index: l } = QE(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(l, a), n.insert(l, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, hA = /(.*)(--[a-zA-Z0-9+/=]{8})$/, wm = (n) => hA.exec(n)?.[1] ?? n, pA = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(wm(r), n[r]));
  return t;
}, Sm = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = Yp(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${tA(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, Ss = (n, e, t, r) => {
  if (e instanceof W.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof W.XmlElement) {
    const d = e.getAttributes(), h = t.attrs;
    for (const f in h)
      h[f] !== null ? d[f] !== h[f] && f !== "ychange" && e.setAttribute(f, h[f]) : e.removeAttribute(f);
    for (const f in d)
      h[f] === void 0 && e.removeAttribute(f);
  }
  const i = ro(t), s = i.length, o = e.toArray(), a = o.length, l = tn(s, a);
  let c = 0, u = 0;
  for (; c < l; c++) {
    const d = o[c], h = i[c];
    if (!ws(r.mapping.get(d), h))
      if (ai(d, h))
        r.mapping.set(d, h);
      else
        break;
  }
  for (; u + c + 1 < l; u++) {
    const d = o[a - u - 1], h = i[s - u - 1];
    if (!ws(r.mapping.get(d), h))
      if (ai(d, h))
        r.mapping.set(d, h);
      else
        break;
  }
  n.transact(() => {
    for (; a - c - u > 0 && s - c - u > 0; ) {
      const h = o[c], f = i[c], p = o[a - u - 1], m = i[s - u - 1];
      if (h instanceof W.XmlText && f instanceof Array)
        bm(h, f) || fA(h, f, r), c += 1;
      else {
        let g = h instanceof W.XmlElement && Ia(h, f), v = p instanceof W.XmlElement && Ia(p, m);
        if (g && v) {
          const S = rd(
            /** @type {Y.XmlElement} */
            h,
            /** @type {PModel.Node} */
            f,
            r
          ), b = rd(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          S.foundMappedChild && !b.foundMappedChild ? v = !1 : !S.foundMappedChild && b.foundMappedChild || S.equalityFactor < b.equalityFactor ? g = !1 : v = !1;
        }
        g ? (Ss(
          n,
          /** @type {Y.XmlFragment} */
          h,
          /** @type {PModel.Node} */
          f,
          r
        ), c += 1) : v ? (Ss(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          _a(f, r)
        ]), c += 1);
      }
    }
    const d = a - c - u;
    if (a === 1 && s === 0 && o[0] instanceof W.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((h) => r.mapping.delete(h)), e.delete(c, d)), c + u < s) {
      const h = [];
      for (let f = c; f < s - u; f++)
        h.push(_a(i[f], r));
      e.insert(c, h);
    }
  }, oe);
}, Ia = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let Lr = null;
const mA = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    Lr
  );
  Lr = null, n.forEach((e, t) => {
    const r = t.state.tr, i = oe.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, gA = (n, e, t) => {
  Lr || (Lr = /* @__PURE__ */ new Map(), ql(0, mA)), Yp(Lr, n, Wi).set(e, t);
}, li = (n, e, t) => {
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
      throw Gs();
    if (n === 0 && r.constructor !== W.XmlText && r !== e)
      return yA(r._item.parent, r._item);
  }
  return W.createRelativePositionFromTypeIndex(e, e._length, -1);
}, yA = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = W.findRootTypeKey(n) : t = W.createID(n._item.id.client, n._item.id.clock), new W.RelativePosition(t, r, e.id);
}, xn = (n, e, t, r) => {
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
function vA(n, e) {
  const t = e || new W.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return Ss(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function bA(n, e, t) {
  const r = _t.fromJSON(n, e);
  return vA(r, t);
}
const wA = (n, e, t) => n !== e, SA = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, kA = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), xA = /^#[0-9a-fA-F]{6}$/, id = (n, e, t, r, i) => {
  const s = oe.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return ce.create(n.doc, []);
  const o = s.doc, a = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? ce.create(n.doc, []) : (e.getStates().forEach((l, c) => {
    if (t(o.clientID, c, l) && l.cursor != null) {
      const u = l.user || {};
      u.color == null ? u.color = "#ffa500" : xA.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = xn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.anchor),
        s.binding.mapping
      ), h = xn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.head),
        s.binding.mapping
      );
      if (d !== null && h !== null) {
        const f = cr(n.doc.content.size - 1, 0);
        d = tn(d, f), h = tn(h, f), a.push(
          He.widget(h, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = tn(d, h), m = cr(d, h);
        a.push(
          He.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), ce.create(n.doc, a));
}, CA = (n, {
  awarenessStateFilter: e = wA,
  cursorBuilder: t = SA,
  selectionBuilder: r = kA,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new _e({
  key: _i,
  state: {
    init(o, a) {
      return id(
        a,
        n,
        e,
        t,
        r
      );
    },
    apply(o, a, l, c) {
      const u = oe.getState(c), d = o.getMeta(_i);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? id(
        c,
        n,
        e,
        t,
        r
      ) : a.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => _i.getState(o)
  },
  view: (o) => {
    const a = () => {
      o.docView && gA(o, _i, { awarenessUpdated: !0 });
    }, l = () => {
      const c = oe.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), h = li(
          d.anchor,
          c.type,
          c.binding.mapping
        ), f = li(
          d.head,
          c.type,
          c.binding.mapping
        );
        (u.cursor == null || !W.compareRelativePositions(
          W.createRelativePositionFromJSON(u.cursor.anchor),
          h
        ) || !W.compareRelativePositions(
          W.createRelativePositionFromJSON(u.cursor.head),
          f
        )) && n.setLocalStateField(s, {
          anchor: h,
          head: f
        });
      } else u.cursor != null && xn(
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
}), TA = (n) => {
  const e = Rt.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, EA = (n) => {
  const e = Rt.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, MA = /* @__PURE__ */ new Set(["paragraph"]), AA = (n, e) => !(n instanceof ng) || !(n.content instanceof rg) || !(n.content.type instanceof ig || n.content.type instanceof sg && e.has(n.content.type.nodeName)) || n.content.type._length === 0, OA = ({ protectedNodes: n = MA, trackedOrigins: e = [], undoManager: t = null } = {}) => new _e({
  key: Rt,
  state: {
    init: (r, i) => {
      const s = oe.getState(i), o = t || new tg(s.type, {
        trackedOrigins: new Set([oe].concat(e)),
        deleteFilter: (a) => AA(a, n),
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
      const a = oe.getState(o).binding, l = i.undoManager, c = l.undoStack.length > 0, u = l.redoStack.length > 0;
      return a ? {
        undoManager: l,
        prevSel: Pa(a, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: l.undoStack.length > 0,
        hasRedoOps: l.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = oe.getState(r.state), s = Rt.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const a = i.binding;
      a && o.meta.set(a, Rt.getState(r.state).prevSel);
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
function km(n) {
  return !!n.getMeta(oe);
}
function DA(n, e) {
  const t = oe.getState(n);
  return xn(t.doc, t.type, e, t.binding.mapping) || 0;
}
function xm(n, e) {
  const t = oe.getState(n);
  return li(e, t.type, t.binding.mapping);
}
var ji = class Cm extends Ol {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new Cm(e.position, e.yRelativePosition);
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
function PA(n, e) {
  const t = xm(e, n);
  return new ji(n, t);
}
function _A(n, e, t) {
  const r = n instanceof ji ? n.yRelativePosition : null;
  if (km(e) && r) {
    const o = DA(t, r);
    return {
      position: new ji(o, r),
      mapResult: null
    };
  }
  const i = mp(n, e), s = i.position.position;
  return {
    position: new ji(
      s,
      r ?? xm(t, s)
    ),
    mapResult: i.mapResult
  };
}
var IA = Ze.create({
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
    this.editor.utils.getUpdatedPosition = (n, e) => _A(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => PA(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Rt.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? TA(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Rt.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? EA(e) : !0)
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
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = OA(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Rt.getState(s.state);
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
      iA(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new _e({
        key: new Qe("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!km(s))
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
const NA = Math.floor, RA = (n, e) => n < e ? n : e, $A = (n, e) => n > e ? n : e, Tm = 128, Ki = 127, LA = Number.MAX_SAFE_INTEGER, BA = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ci = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), FA = (n) => ci.encode(n), zA = ci ? FA : BA;
let Br = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Br && Br.decode(new Uint8Array()).length === 1 && (Br = null);
const ks = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, io = (n, e) => {
  for (; e > Ki; )
    ks(n, Tm | Ki & e), e = NA(e / 128);
  ks(n, Ki & e);
}, Na = new Uint8Array(3e4), VA = Na.length / 3, qA = (n, e) => {
  if (e.length < VA) {
    const t = ci.encodeInto(e, Na).written || 0;
    io(n, t);
    for (let r = 0; r < t; r++)
      ks(n, Na[r]);
  } else
    jA(n, zA(e));
}, WA = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  io(n, r);
  for (let i = 0; i < r; i++)
    ks(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, UA = ci && /** @type {any} */
ci.encodeInto ? qA : WA, HA = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = RA(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array($A(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, jA = (n, e) => {
  io(n, e.byteLength), HA(n, e);
}, Em = (n) => new Error(n), KA = Em("Unexpected end of array"), JA = Em("Integer out of Range"), XA = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, YA = (n) => XA(n, Ul(n)), sd = (n) => n.arr[n.pos++], Ul = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Ki) * t, t *= 128, i < Tm)
      return e;
    if (e > LA)
      throw JA;
  }
  throw KA;
}, GA = (n) => {
  let e = Ul(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(sd(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(sd(n));
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
}, QA = (n) => (
  /** @type any */
  Br.decode(YA(n))
), od = Br ? QA : GA;
var er;
(function(n) {
  n[n.Token = 0] = "Token", n[n.PermissionDenied = 1] = "PermissionDenied", n[n.Authenticated = 2] = "Authenticated";
})(er || (er = {}));
const ZA = (n, e) => {
  io(n, er.Token), UA(n, e);
}, eO = (n, e, t, r) => {
  switch (Ul(n)) {
    case er.Token: {
      e();
      break;
    }
    case er.PermissionDenied: {
      t(od(n));
      break;
    }
    case er.Authenticated: {
      r(od(n));
      break;
    }
  }
}, ad = (n) => Array.from(n.entries()).map(([e, t]) => ({
  clientId: e,
  ...t
}));
var Ra;
(function(n) {
  n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed";
})(Ra || (Ra = {}));
function tO(n) {
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
async function Uo(n) {
  return new Promise((e) => setTimeout(e, n));
}
function nO(n, e) {
  let t = e.delay;
  if (t === 0)
    return 0;
  if (e.factor && (t *= Math.pow(e.factor, n.attemptNum - 1), e.maxDelay !== 0 && (t = Math.min(t, e.maxDelay))), e.jitter) {
    const r = Math.ceil(e.minDelay), i = Math.floor(t);
    t = Math.floor(Math.random() * (i - r + 1)) + r;
  }
  return Math.round(t);
}
async function rO(n, e) {
  const t = tO(e);
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
  }, i = t.calculateDelay || nO;
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
      return c && await Uo(c), s();
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
  if (o && await Uo(o), r.attemptNum < 1 && t.initialJitter) {
    const a = i(r, t);
    a && await Uo(a);
  }
  return s();
}
const Mm = Math.floor, iO = (n, e) => n < e ? n : e, sO = (n, e) => n > e ? n : e, oO = 64, xs = 128, aO = 63, Fr = 127, Am = Number.MAX_SAFE_INTEGER, lO = () => /* @__PURE__ */ new Set(), cO = Array.from, uO = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ui = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), dO = (n) => ui.encode(n), fO = ui ? dO : uO;
let zr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
zr && zr.decode(new Uint8Array()).length === 1 && (zr = null);
class hO {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const Hl = () => new hO(), Om = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, jl = (n) => {
  const e = new Uint8Array(Om(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, Cs = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Ne = (n, e) => {
  for (; e > Fr; )
    Cs(n, xs | Fr & e), e = Mm(e / 128);
  Cs(n, Fr & e);
}, $a = new Uint8Array(3e4), pO = $a.length / 3, mO = (n, e) => {
  if (e.length < pO) {
    const t = ui.encodeInto(e, $a).written || 0;
    Ne(n, t);
    for (let r = 0; r < t; r++)
      Cs(n, $a[r]);
  } else
    vr(n, fO(e));
}, gO = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Ne(n, r);
  for (let i = 0; i < r; i++)
    Cs(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Ft = ui && /** @type {any} */
ui.encodeInto ? mO : gO, yO = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = iO(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(sO(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, vr = (n, e) => {
  Ne(n, e.byteLength), yO(n, e);
}, Dm = (n) => new Error(n), Pm = Dm("Unexpected end of array"), _m = Dm("Integer out of Range");
class vO {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const Im = (n) => new vO(n), bO = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, so = (n) => bO(n, Cn(n)), ld = (n) => n.arr[n.pos++], Cn = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Fr) * t, t *= 128, i < xs)
      return e;
    if (e > Am)
      throw _m;
  }
  throw Pm;
}, wO = (n) => {
  let e = n.arr[n.pos++], t = e & aO, r = 64;
  const i = (e & oO) > 0 ? -1 : 1;
  if ((e & xs) === 0)
    return i * t;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    if (e = n.arr[n.pos++], t = t + (e & Fr) * r, r *= 128, e < xs)
      return i * t;
    if (t > Am)
      throw _m;
  }
  throw Pm;
}, SO = (n) => {
  let e = Cn(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(ld(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(ld(n));
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
}, kO = (n) => (
  /** @type any */
  zr.decode(so(n))
), di = zr ? kO : SO, xO = (n) => {
  const e = n.pos, t = di(n);
  return n.pos = e, t;
}, fr = Date.now, Ho = () => /* @__PURE__ */ new Map(), CO = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
};
class TO {
  constructor() {
    this._observers = Ho();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, t) {
    CO(this._observers, e, lO).add(t);
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
    return cO((this._observers.get(e) || Ho()).values()).forEach((r) => r(...t));
  }
  destroy() {
    this._observers = Ho();
  }
}
const EO = Object.keys, cd = (n) => EO(n).length, MO = (n, e) => Object.prototype.hasOwnProperty.call(n, e), AO = (n, e) => n === e, Vr = (n, e) => {
  if (n == null || e == null)
    return AO(n, e);
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
        if (!e.has(t) || !Vr(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case Object:
      if (cd(n) !== cd(e))
        return !1;
      for (const t in n)
        if (!MO(n, t) || !Vr(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Vr(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, jo = 3e4;
class OO extends TO {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const t = fr();
      this.getLocalState() !== null && jo / 2 <= t - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && jo <= t - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && Ji(this, r, "timeout");
    }, Mm(jo / 10)), e.on("destroy", () => {
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
      lastUpdated: fr()
    });
    const o = [], a = [], l = [], c = [];
    e === null ? c.push(t) : s == null ? e != null && o.push(t) : (a.push(t), Vr(s, e) || l.push(t)), (o.length > 0 || l.length > 0 || c.length > 0) && this.emit("change", [{ added: o, updated: l, removed: c }, "local"]), this.emit("update", [{ added: o, updated: a, removed: c }, "local"]);
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
const Ji = (n, e, t) => {
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
          lastUpdated: fr()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: r }, t]), n.emit("update", [{ added: [], updated: [], removed: r }, t]));
}, La = (n, e, t = n.states) => {
  const r = e.length, i = Hl();
  Ne(i, r);
  for (let s = 0; s < r; s++) {
    const o = e[s], a = t.get(o) || null, l = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    Ne(i, o), Ne(i, l), Ft(i, JSON.stringify(a));
  }
  return jl(i);
}, DO = (n, e, t) => {
  const r = Im(e), i = fr(), s = [], o = [], a = [], l = [], c = Cn(r);
  for (let u = 0; u < c; u++) {
    const d = Cn(r);
    let h = Cn(r);
    const f = JSON.parse(di(r)), p = n.meta.get(d), m = n.states.get(d), g = p === void 0 ? 0 : p.clock;
    (g < h || g === h && f === null && n.states.has(d)) && (f === null ? d === n.clientID && n.getLocalState() != null ? h++ : n.states.delete(d) : n.states.set(d, f), n.meta.set(d, {
      clock: h,
      lastUpdated: i
    }), p === void 0 && f !== null ? s.push(d) : p !== void 0 && f === null ? l.push(d) : f !== null && (Vr(f, m) || a.push(d), o.push(d)));
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
class Nm {
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
class Ba {
  constructor(e) {
    this.data = e, this.encoder = Hl(), this.decoder = Im(new Uint8Array(this.data));
  }
  peekVarString() {
    return xO(this.decoder);
  }
  readVarUint() {
    return Cn(this.decoder);
  }
  readVarString() {
    return di(this.decoder);
  }
  readVarUint8Array() {
    return so(this.decoder);
  }
  writeVarUint(e) {
    return Ne(this.encoder, e);
  }
  writeVarString(e) {
    return Ft(this.encoder, e);
  }
  writeVarUint8Array(e) {
    return vr(this.encoder, e);
  }
  length() {
    return Om(this.encoder);
  }
}
var Me;
(function(n) {
  n[n.Sync = 0] = "Sync", n[n.Awareness = 1] = "Awareness", n[n.Auth = 2] = "Auth", n[n.QueryAwareness = 3] = "QueryAwareness", n[n.Stateless = 5] = "Stateless", n[n.CLOSE = 7] = "CLOSE", n[n.SyncStatus = 8] = "SyncStatus";
})(Me || (Me = {}));
var Le;
(function(n) {
  n.Connecting = "connecting", n.Connected = "connected", n.Disconnected = "disconnected";
})(Le || (Le = {}));
class Ln {
  constructor() {
    this.encoder = Hl();
  }
  get(e) {
    return e.encoder;
  }
  toUint8Array() {
    return jl(this.encoder);
  }
}
class PO extends Ln {
  constructor() {
    super(...arguments), this.type = Me.CLOSE, this.description = "Ask the server to close the connection";
  }
  get(e) {
    return Ft(this.encoder, e.documentName), Ne(this.encoder, this.type), this.encoder;
  }
}
class _O extends Nm {
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
    }, this.webSocket = null, this.webSocketHandlers = {}, this.shouldConnect = !0, this.status = Le.Disconnected, this.lastMessageReceived = 0, this.identifier = 0, this.intervals = {
      connectionChecker: null
    }, this.connectionAttempt = null, this.receivedOnOpenPayload = void 0, this.closeTries = 0, this.setConfiguration(e), this.configuration.WebSocketPolyfill = e.WebSocketPolyfill ? e.WebSocketPolyfill : WebSocket, this.on("open", this.configuration.onOpen), this.on("open", this.onOpen.bind(this)), this.on("connect", this.configuration.onConnect), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("status", this.configuration.onStatus), this.on("disconnect", this.configuration.onDisconnect), this.on("close", this.configuration.onClose), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("close", this.onClose.bind(this)), this.on("message", this.onMessage.bind(this)), this.intervals.connectionChecker = setInterval(this.checkConnection.bind(this), this.configuration.messageReconnectTimeout / 10), this.shouldConnect && this.connect();
  }
  async onOpen(e) {
    this.status = Le.Connected, this.emit("status", { status: Le.Connected }), this.cancelWebsocketRetry = void 0, this.receivedOnOpenPayload = e;
  }
  attach(e) {
    this.configuration.providerMap.set(e.configuration.name, e), this.status === Le.Disconnected && this.shouldConnect && this.connect(), this.receivedOnOpenPayload && this.status === Le.Connected && e.onOpen(this.receivedOnOpenPayload);
  }
  detach(e) {
    this.configuration.providerMap.has(e.configuration.name) && (e.send(PO, {
      documentName: e.configuration.name
    }), this.configuration.providerMap.delete(e.configuration.name));
  }
  setConfiguration(e = {}) {
    this.configuration = { ...this.configuration, ...e }, this.configuration.autoConnect || (this.shouldConnect = !1);
  }
  async connect() {
    if (this.status === Le.Connected)
      return;
    this.cancelWebsocketRetry && (this.cancelWebsocketRetry(), this.cancelWebsocketRetry = void 0), this.receivedOnOpenPayload = void 0, this.shouldConnect = !0;
    const e = () => {
      let i = !1;
      return {
        retryPromise: rO(this.createWebSocketConnection.bind(this), {
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
      r.binaryType = "arraybuffer", r.identifier = this.identifier, this.attachWebSocketListeners(r, t), this.webSocket = r, this.status = Le.Connecting, this.emit("status", { status: Le.Connecting }), this.connectionAttempt = {
        resolve: e,
        reject: t
      };
    });
  }
  onMessage(e) {
    var t;
    this.resolveConnectionAttempt(), this.lastMessageReceived = fr();
    const i = new Ba(e.data).peekVarString();
    (t = this.configuration.providerMap.get(i)) === null || t === void 0 || t.onMessage(e);
  }
  resolveConnectionAttempt() {
    this.connectionAttempt && (this.connectionAttempt.resolve(), this.connectionAttempt = null, this.status = Le.Connected, this.emit("status", { status: Le.Connected }), this.emit("connect"), this.messageQueue.forEach((e) => this.send(e)), this.messageQueue = []);
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
    this.status === Le.Connected && this.lastMessageReceived && (this.configuration.messageReconnectTimeout >= fr() - this.lastMessageReceived || (this.closeTries += 1, this.closeTries > 2 ? (this.onClose({
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
    ((t = this.webSocket) === null || t === void 0 ? void 0 : t.readyState) === Ra.Open ? this.webSocket.send(e) : this.messageQueue.push(e);
  }
  onClose({ event: e }) {
    this.closeTries = 0, this.cleanupWebSocket(), this.connectionAttempt && this.rejectConnectionAttempt(), this.status = Le.Disconnected, this.emit("status", { status: Le.Disconnected }), this.emit("disconnect", { event: e }), !this.cancelWebsocketRetry && this.shouldConnect && setTimeout(() => {
      this.connect();
    }, this.configuration.delay);
  }
  destroy() {
    this.emit("destroy"), clearInterval(this.intervals.connectionChecker), this.stopConnectionAttempt(), this.disconnect(), this.removeAllListeners(), this.cleanupWebSocket();
  }
}
const Rm = 0, Kl = 1, $m = 2, IO = (n, e) => {
  Ne(n, Rm);
  const t = W.encodeStateVector(e);
  vr(n, t);
}, NO = (n, e, t) => {
  Ne(n, Kl), vr(n, W.encodeStateAsUpdate(e, t));
}, RO = (n, e, t) => NO(e, t, so(n)), Lm = (n, e, t) => {
  try {
    W.applyUpdate(e, so(n), t);
  } catch (r) {
    console.error("Caught error while handling a Yjs update", r);
  }
}, $O = (n, e) => {
  Ne(n, $m), vr(n, e);
}, LO = Lm, BO = (n, e, t, r) => {
  const i = Cn(n);
  switch (i) {
    case Rm:
      RO(n, e, t);
      break;
    case Kl:
      Lm(n, t, r);
      break;
    case $m:
      LO(n, t, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
class FO {
  constructor(e) {
    this.message = e;
  }
  apply(e, t) {
    const { message: r } = this, i = r.readVarUint(), s = r.length();
    switch (i) {
      case Me.Sync:
        this.applySyncMessage(e, t);
        break;
      case Me.Awareness:
        this.applyAwarenessMessage(e);
        break;
      case Me.Auth:
        this.applyAuthMessage(e);
        break;
      case Me.QueryAwareness:
        this.applyQueryAwarenessMessage(e);
        break;
      case Me.Stateless:
        e.receiveStateless(di(r.decoder));
        break;
      case Me.SyncStatus:
        this.applySyncStatusMessage(e, wO(r.decoder) === 1);
        break;
      case Me.CLOSE:
        const o = {
          code: 1e3,
          reason: di(r.decoder),
          // @ts-ignore
          target: e.configuration.websocketProvider.webSocket,
          type: "close"
        };
        e.onClose(), e.configuration.onClose({ event: o }), e.forwardClose({ event: o });
        break;
      default:
        throw new Error(`Can’t apply message of unknown type: ${i}`);
    }
    r.length() > s + 1 && e.send(Ln, { encoder: r.encoder });
  }
  applySyncMessage(e, t) {
    const { message: r } = this;
    r.writeVarUint(Me.Sync);
    const i = BO(r.decoder, r.encoder, e.document, e);
    t && i === Kl && (e.synced = !0);
  }
  applySyncStatusMessage(e, t) {
    t && e.decrementUnsyncedChanges();
  }
  applyAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    DO(e.awareness, t.readVarUint8Array(), e);
  }
  applyAuthMessage(e) {
    const { message: t } = this;
    eO(t.decoder, e.sendToken.bind(e), e.permissionDeniedHandler.bind(e), e.authenticatedHandler.bind(e));
  }
  applyQueryAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    t.writeVarUint(Me.Awareness), t.writeVarUint8Array(La(e.awareness, Array.from(e.awareness.getStates().keys())));
  }
}
class zO {
  constructor(e, t = {}) {
    this.message = new e(), this.encoder = this.message.get(t);
  }
  create() {
    return jl(this.encoder);
  }
  send(e) {
    e?.send(this.create());
  }
}
class VO extends Ln {
  constructor() {
    super(...arguments), this.type = Me.Auth, this.description = "Authentication";
  }
  get(e) {
    if (typeof e.token > "u")
      throw new Error("The authentication message requires `token` as an argument.");
    return Ft(this.encoder, e.documentName), Ne(this.encoder, this.type), ZA(this.encoder, e.token), this.encoder;
  }
}
class ud extends Ln {
  constructor() {
    super(...arguments), this.type = Me.Awareness, this.description = "Awareness states update";
  }
  get(e) {
    if (typeof e.awareness > "u")
      throw new Error("The awareness message requires awareness as an argument");
    if (typeof e.clients > "u")
      throw new Error("The awareness message requires clients as an argument");
    Ft(this.encoder, e.documentName), Ne(this.encoder, this.type);
    let t;
    return e.states === void 0 ? t = La(e.awareness, e.clients) : t = La(e.awareness, e.clients, e.states), vr(this.encoder, t), this.encoder;
  }
}
class qO extends Ln {
  constructor() {
    super(...arguments), this.type = Me.Stateless, this.description = "A stateless message";
  }
  get(e) {
    var t;
    return Ft(this.encoder, e.documentName), Ne(this.encoder, this.type), Ft(this.encoder, (t = e.payload) !== null && t !== void 0 ? t : ""), this.encoder;
  }
}
class dd extends Ln {
  constructor() {
    super(...arguments), this.type = Me.Sync, this.description = "First sync step";
  }
  get(e) {
    if (typeof e.document > "u")
      throw new Error("The sync step one message requires document as an argument");
    return Ft(this.encoder, e.documentName), Ne(this.encoder, this.type), IO(this.encoder, e.document), this.encoder;
  }
}
class WO extends Ln {
  constructor() {
    super(...arguments), this.type = Me.Sync, this.description = "A document update";
  }
  get(e) {
    return Ft(this.encoder, e.documentName), Ne(this.encoder, this.type), $O(this.encoder, e.update), this.encoder;
  }
}
class UO extends Error {
  constructor() {
    super(...arguments), this.code = 1001;
  }
}
class HO extends Nm {
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
    }, this.boundDocumentUpdateHandler = this.documentUpdateHandler.bind(this), this.boundAwarenessUpdateHandler = this.awarenessUpdateHandler.bind(this), this.boundPageHide = this.pageHide.bind(this), this.boundOnOpen = this.onOpen.bind(this), this.boundOnClose = this.onClose.bind(this), this.forwardConnect = () => this.emit("connect"), this.forwardStatus = (s) => this.emit("status", s), this.forwardClose = (s) => this.emit("close", s), this.forwardDisconnect = (s) => this.emit("disconnect", s), this.forwardDestroy = () => this.emit("destroy"), this.setConfiguration(e), this.configuration.document = e.document ? e.document : new W.Doc(), this.configuration.awareness = e.awareness !== void 0 ? e.awareness : new OO(this.document), this.on("open", this.configuration.onOpen), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("synced", this.configuration.onSynced), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("stateless", this.configuration.onStateless), this.on("unsyncedChanges", this.configuration.onUnsyncedChanges), this.on("authenticated", this.configuration.onAuthenticated), this.on("authenticationFailed", this.configuration.onAuthenticationFailed), (t = this.awareness) === null || t === void 0 || t.on("update", () => {
      this.emit("awarenessUpdate", {
        states: ad(this.awareness.getStates())
      });
    }), (r = this.awareness) === null || r === void 0 || r.on("change", () => {
      this.emit("awarenessChange", {
        states: ad(this.awareness.getStates())
      });
    }), this.document.on("update", this.boundDocumentUpdateHandler), (i = this.awareness) === null || i === void 0 || i.on("update", this.boundAwarenessUpdateHandler), this.registerEventListeners(), this.configuration.forceSyncInterval && typeof this.configuration.forceSyncInterval == "number" && (this.intervals.forceSync = setInterval(this.forceSync.bind(this), this.configuration.forceSyncInterval)), this.manageSocket && this.attach();
  }
  setConfiguration(e = {}) {
    e.websocketProvider || (this.manageSocket = !0, this.configuration.websocketProvider = new _O(e)), this.configuration = { ...this.configuration, ...e };
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
    this.resetUnsyncedChanges(), this.send(dd, {
      document: this.document,
      documentName: this.configuration.name
    });
  }
  pageHide() {
    this.awareness && Ji(this.awareness, [this.document.clientID], "page hide");
  }
  registerEventListeners() {
    typeof window > "u" || !("addEventListener" in window) || window.addEventListener("pagehide", this.boundPageHide);
  }
  sendStateless(e) {
    this.send(qO, {
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
    this.send(VO, {
      token: e ?? "",
      documentName: this.configuration.name
    });
  }
  documentUpdateHandler(e, t) {
    t !== this && (this.incrementUnsyncedChanges(), this.send(WO, { update: e, documentName: this.configuration.name }));
  }
  awarenessUpdateHandler({ added: e, updated: t, removed: r }, i) {
    const s = e.concat(t).concat(r);
    this.send(ud, {
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
    this.resetUnsyncedChanges(), this.send(dd, {
      document: this.document,
      documentName: this.configuration.name
    }), this.awareness && this.awareness.getLocalState() !== null && this.send(ud, {
      awareness: this.awareness,
      clients: [this.document.clientID],
      documentName: this.configuration.name
    });
  }
  send(e, t) {
    if (!this._isAttached)
      return;
    const r = new zO(e, t);
    this.emit("outgoingMessage", { message: r.message }), r.send(this.configuration.websocketProvider);
  }
  onMessage(e) {
    const t = new Ba(e.data), r = t.readVarString();
    t.writeVarString(r), this.emit("message", { event: e, message: new Ba(e.data) }), new FO(t).apply(this, !0);
  }
  onClose() {
    this.isAuthenticated = !1, this.synced = !1, this.awareness && Ji(this.awareness, Array.from(this.awareness.getStates().keys()).filter((e) => e !== this.document.clientID), this);
  }
  destroy() {
    this.emit("destroy"), this.intervals.forceSync && clearInterval(this.intervals.forceSync), this.awareness && (Ji(this.awareness, [this.document.clientID], "provider destroy"), this.awareness.off("update", this.boundAwarenessUpdateHandler), this.awareness.destroy()), this.document.off("update", this.boundDocumentUpdateHandler), this.removeAllListeners(), this.detach(), this.manageSocket && this.configuration.websocketProvider.destroy(), !(typeof window > "u" || !("removeEventListener" in window)) && window.removeEventListener("pagehide", this.boundPageHide);
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
      throw new UO(`Cannot set awareness field "${e}" to ${JSON.stringify(t)}. You have disabled Awareness for this provider by explicitly passing awareness: null in the provider configuration.`);
    this.awareness.setLocalStateField(e, t);
  }
}
const Bm = Il.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), jO = /* @__PURE__ */ B({
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
    const e = n, t = Et(), r = A(() => {
      const o = e.node.attrs.speakerId;
      return o ? t.speakers.all.get(o) : void 0;
    }), i = A(() => r.value?.color ?? "transparent"), s = A(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: o, endTime: a } = e.node.attrs;
      if (o == null || a == null) return !1;
      const l = t.audio.currentTime.value;
      return l >= o && l <= a;
    });
    return (o, a) => (M(), L(y(wC), {
      as: "section",
      class: $t(["turn", { "turn--active": s.value }]),
      style: an({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: P(() => [
        $(Bd, {
          speaker: r.value,
          "start-time": n.node.attrs.startTime,
          language: n.node.attrs.language
        }, null, 8, ["speaker", "start-time", "language"]),
        $(y(bC), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), KO = /* @__PURE__ */ fe(jO, [["__scopeId", "data-v-9437fb29"]]), Fm = Il.create({
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
      up(n, { "data-type": "turn" }),
      0
    ];
  },
  addKeyboardShortcuts() {
    const n = gh((e) => e.type.name !== "turn" ? null : {
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
    return xC(KO);
  }
});
function JO(n) {
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
const XO = new Qe("storeSync"), YO = Ze.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new _e({
        key: XO,
        appendTransaction(t, r, i) {
          if (r.doc.eq(i.doc)) return null;
          if (!t.some(
            (a) => a.getMeta(oe)
          )) {
            const a = QO(i);
            if (a) return a;
          }
          const o = e();
          return o && GO(i.doc, o, n), null;
        }
      })
    ];
  }
});
function GO(n, e, t) {
  const r = JO(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((h) => h.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), a = e.id, l = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    l.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: a });
  for (const c of o) {
    const u = s.get(c.id);
    u ? ZO(u, c) && t.emit("turn:update", { turn: c, translationId: a }) : t.emit("turn:add", { turn: c, translationId: a });
  }
  e.replaceTurns(o);
}
function QO(n) {
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
function ZO(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const Ii = new Qe("wordHighlight"), eD = Ze.create({
  name: "wordHighlight",
  addProseMirrorPlugins() {
    const { core: n } = this.options, e = this.editor;
    function t() {
      const i = n.audio?.activeWordId.value;
      if (!i) return ce.empty;
      const s = n.activeChannel.value?.activeTranslation.value;
      if (!s) return ce.empty;
      const o = e.state.doc;
      let a = ce.empty;
      return o.forEach((l, c) => {
        if (l.type.name !== "turn") return;
        const u = s.turns.value.find((f) => f.id === l.attrs.id);
        if (!u) return;
        const d = l.textContent;
        let h = 0;
        for (const f of u.words) {
          const p = d.indexOf(f.text, h);
          if (p === -1) break;
          if (f.id === i) {
            const m = c + 1 + p, g = m + f.text.length;
            a = ce.create(o, [
              He.inline(m, g, {
                class: "word--active",
                "data-word-active": ""
              })
            ]);
            return;
          }
          h = p + f.text.length;
        }
      }), a;
    }
    let r = null;
    return [
      new _e({
        key: Ii,
        state: {
          init() {
            return ce.empty;
          },
          apply(i, s) {
            return i.getMeta(Ii) ? t() : i.docChanged ? s.map(i.mapping, i.doc) : s;
          }
        },
        props: {
          decorations(i) {
            return Ii.getState(i);
          }
        },
        view() {
          return r = te(
            () => n.audio?.activeWordId.value,
            () => {
              const i = e.state.tr.setMeta(Ii, !0);
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
}), tD = Ze.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      n.setLocalStateField("user", e);
      const t = /* @__PURE__ */ new Map();
      return [
        CA(n, {
          cursorBuilder: (r, i) => nD(t, r, i)
        })
      ];
    }
  }
);
function nD(n, e, t) {
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
function rD(n) {
  return {
    type: "doc",
    content: n.map((e) => iD(e))
  };
}
function iD(n) {
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
const zm = "speakers";
function fd(n) {
  const { core: e, ydoc: t, translation: r, seedFromCore: i } = n, s = t.getMap(zm);
  if (i) {
    const d = /* @__PURE__ */ new Set();
    for (const h of r.turns.value)
      h.speakerId && d.add(h.speakerId);
    t.transact(() => {
      for (const h of d) {
        if (s.has(h)) continue;
        const f = e.speakers.all.get(h);
        f && s.set(h, { name: f.name, color: f.color });
      }
    });
  }
  for (const [d, h] of s.entries())
    e.speakers.updateOrCreate({ id: d, name: h.name, color: h.color });
  const o = (d) => {
    d.changes.keys.forEach((h, f) => {
      if (h.action === "delete")
        e.speakers.delete(f);
      else {
        const p = s.get(f);
        if (!p) return;
        e.speakers.updateOrCreate({ id: f, name: p.name, color: p.color });
      }
    });
  };
  s.observe(o);
  const a = (d) => {
    const h = s.get(d.id);
    h && Jo(h, d) || s.set(d.id, { name: d.name, color: d.color });
  }, l = e.on("speaker:add", ({ speaker: d }) => a(d)), c = e.on("speaker:update", ({ speaker: d }) => a(d)), u = e.on("speaker:remove", ({ speakerId: d }) => {
    s.delete(d);
  });
  return () => {
    s.unobserve(o), l(), c(), u();
  };
}
function SD(n = {}) {
  const {
    collab: e,
    field: t = "default",
    user: r = { name: "Anonymous", color: "#999999" }
  } = n;
  return {
    name: "transcriptionEditor",
    install(i) {
      const s = nn(void 0), o = D([]), a = D(!1), l = [], c = [];
      let u = null, d = null;
      const h = {
        tiptapEditor: s,
        get doc() {
          return d;
        },
        get fragment() {
          return d.getXmlFragment(t);
        },
        get speakersMap() {
          return d?.getMap(zm) ?? null;
        },
        users: o,
        isConnected: a,
        updateUser(g) {
          u?.awareness && (Object.assign(r, g), u.awareness.setLocalStateField("user", r));
        }
      };
      i.transcriptionEditor = h;
      function f() {
        s.value?.destroy(), s.value = void 0, c.forEach((g) => g()), c.length = 0, u && (u.destroy(), u = null), d && (d.destroy(), d = null), a.value = !1, o.value = [];
      }
      function p(g, v) {
        f();
        const S = new og();
        if (d = S, e) {
          const b = new HO({
            url: e.url,
            name: g,
            token: e.token,
            document: S,
            onSynced() {
              a.value = !0;
            },
            onDisconnect() {
              a.value = !1;
            },
            onAwarenessUpdate({ states: x }) {
              o.value = x.map((C) => ({
                clientId: C.clientId,
                ...C.user
              }));
            }
          });
          u = b;
          const w = te(a, (x) => {
            x && (w(), c.push(
              fd({ core: i, ydoc: S, translation: v, seedFromCore: !1 })
            ), hd(i, n, S, t, s, b.awareness, l));
          }, { immediate: !0 });
          l.push(w);
        } else {
          const b = S.getXmlFragment(t), w = rD(v.turns.value), x = m1([Bm, Fm, Hp]);
          bA(x, w, b), a.value = !0, c.push(
            fd({ core: i, ydoc: S, translation: v, seedFromCore: !0 })
          ), hd(i, n, S, t, s, null, l);
        }
      }
      const m = te(
        () => i.activeChannel.value,
        (g) => {
          if (!g) return;
          m();
          const v = A(
            () => i.activeChannel.value.activeTranslation.value
          );
          p(v.value.id, v.value);
          const S = te(
            () => v.value.id,
            (b) => {
              p(b, v.value);
            }
          );
          l.push(S);
        },
        { immediate: !0 }
      );
      return () => {
        m(), l.forEach((g) => g()), f(), i.transcriptionEditor = void 0;
      };
    }
  };
}
function hd(n, e, t, r, i, s, o) {
  const a = A(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    Bm,
    Fm,
    Hp,
    IA.configure({
      document: t,
      field: r
    }),
    YO.configure({
      store: n,
      getTranslation: () => a.value
    }),
    eD.configure({ core: n }),
    ...n.pluginExtensions
  ];
  s && l.push(
    tD.configure({
      awareness: s,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  ), i.value = new yC({
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
function pd(n) {
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
function Ko(n, e) {
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
function kD() {
  return {
    name: "live",
    install(n) {
      const e = nn(null), t = D(!1);
      t.value = !0;
      function r() {
        e.value = null;
      }
      function i(b, w) {
        if (n.activeChannelId.value !== w) return;
        const x = n.activeChannel.value;
        if (!x) return;
        const C = x.activeTranslation.value;
        if (C.isSource) {
          if (b.text == null) return;
          e.value = b.text;
        } else if (b.translations) {
          const k = b.translations.find(
            (T) => T.translationId === C.id
          );
          e.value = k?.text ?? null;
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
      function l(b, w) {
        b.hasTurn(w.id) ? b.updateTurn(w.id, w) : b.addTurn(w);
      }
      function c(b, w) {
        b.speakerId && n.speakers.ensure(b.speakerId);
        const x = n.channels.get(w);
        if (!x) {
          h();
          return;
        }
        if (b.text != null && l(
          x.sourceTranslation,
          pd(b)
        ), b.translations)
          for (const k of b.translations) {
            const T = x.translations.get(k.translationId);
            T && l(
              T,
              Ko(b, k)
            );
          }
        n.activeChannel.value?.activeTranslation.value?.isSource && h();
      }
      function u(b, w) {
        d([b], w);
      }
      function d(b, w) {
        const x = n.channels.get(w);
        if (!x) return;
        const C = /* @__PURE__ */ new Set();
        for (const E of b)
          E.speakerId && !C.has(E.speakerId) && (C.add(E.speakerId), n.speakers.ensure(E.speakerId));
        const k = [];
        for (const E of b)
          E.text != null && k.push(pd(E));
        k.length > 0 && x.sourceTranslation.prependTurns(k);
        const T = /* @__PURE__ */ new Map();
        for (const E of b)
          if (E.translations)
            for (const O of E.translations) {
              let N = T.get(O.translationId);
              N || (N = [], T.set(O.translationId, N)), N.push(Ko(E, O));
            }
        for (const [E, O] of T) {
          const N = x.translations.get(E);
          N && N.prependTurns(O);
        }
      }
      function h() {
        a(), r();
      }
      function f(b) {
        const w = n.activeChannel.value;
        if (!w) return;
        const x = w.activeTranslation.value;
        if (!b.final && x.languages.includes(b.language))
          e.value = b.text;
        else if (b.final) {
          const C = w.translations.get(b.language);
          if (C) {
            const k = Ko(
              { ...b },
              b
            );
            C === x ? l(C, k) : C.updateOrCreateTurnSilent(k);
          }
          x.languages.includes(b.language) && h();
        }
      }
      const p = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: i,
        onFinal: c,
        prependFinal: u,
        prependFinalBatch: d,
        onTranslation: f
      }, m = n.on(
        "channel:change",
        h
      ), g = n.on(
        "translation:change",
        h
      ), v = n.on(
        "translation:sync",
        o
      ), S = n.on("channel:sync", o);
      return n.live = p, () => {
        h(), m(), g(), v(), S(), n.live = void 0;
      };
    }
  };
}
function xD(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = D(n.fontSize ?? 40), r = D(!0), i = D(!1);
      let s;
      const o = [];
      if (n.watermark) {
        const l = n.watermark;
        s = {
          display: D(l.display ?? !1),
          pinned: D(l.pinned ?? !1),
          content: D(l.content ?? ""),
          frequency: D(l.frequency ?? 30),
          duration: D(l.duration ?? 5),
          tokens: D(l.tokens ?? {}),
          readonly: l.readonly ?? !1
        }, o.push(
          te(
            s.display,
            (c) => e.emit("watermark:display", { display: c })
          ),
          te(
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
function sD(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function CD(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(sD), o = s[0]?.startTime ?? i.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
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
let Vm = 0;
function oD(n) {
  return {
    id: `w_${Vm++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function TD(n) {
  Vm = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = s.words.map(oD);
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
  Ue as DocumentValidationError,
  yD as Layout,
  vD as createAudioPlugin,
  cD as createCore,
  kD as createLivePlugin,
  xD as createSubtitlePlugin,
  SD as createTranscriptionEditorPlugin,
  CD as mapApiDocument,
  TD as mapWhisperXDocument,
  uD as provideCore,
  dD as provideI18n,
  Et as useCore,
  Sg as validateEditorDocument
};
