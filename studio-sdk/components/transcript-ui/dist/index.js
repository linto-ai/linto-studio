import * as dc from "vue";
import { shallowReactive as Is, shallowRef as an, ref as D, computed as O, inject as gi, provide as _n, h as Qe, defineComponent as B, openBlock as E, createElementBlock as V, renderSlot as z, createBlock as I, resolveDynamicComponent as Ga, normalizeClass as gt, normalizeStyle as hn, useSlots as pg, createCommentVNode as X, createTextVNode as pe, toDisplayString as J, createElementVNode as H, createVNode as L, withCtx as _, unref as y, watchEffect as tt, onBeforeUnmount as Ht, Fragment as Ie, customRef as Dd, toValue as We, getCurrentScope as Pd, onScopeDispose as Id, effectScope as Nd, getCurrentInstance as pn, readonly as mg, watch as Z, nextTick as ae, onMounted as me, toHandlerKey as gg, camelize as Rd, toRef as Vi, onUnmounted as Ln, toRefs as Ot, Comment as yg, mergeProps as re, cloneVNode as vg, reactive as Qa, Teleport as $d, normalizeProps as zt, guardReactiveProps as Fn, markRaw as Za, renderList as _t, withKeys as Kr, withModifiers as Ue, watchPostEffect as Bd, shallowReadonly as Kn, mergeDefaults as Ld, withMemo as bg, isRef as wg, createStaticVNode as Sg, render as fc, useTemplateRef as qt, isMemoSame as kg, Transition as el, useId as Fd, withDirectives as tl, vModelDynamic as xg, vModelSelect as Cg, createSlots as hc, useModel as Tg, vShow as Eg } from "vue";
import * as j from "yjs";
import { UndoManager as Mg, Item as Ag, ContentType as Og, Text as _g, XmlElement as Dg, Doc as Pg } from "yjs";
function Ig() {
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
const lr = [
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
function Ng(n, e, t) {
  const r = lr[n.size % lr.length];
  return { id: e, name: t, color: r };
}
function Rg(n, e, t) {
  return !e || n.has(e) ? null : Ng(n, e, t ?? e);
}
function na(n, e) {
  return n.name === e.name && n.color === e.color;
}
function $g(n) {
  const e = Is(/* @__PURE__ */ new Map());
  function t(a, l) {
    const c = Rg(e, a, l);
    c && (e.set(c.id, c), n("speaker:add", { speaker: c }));
  }
  function r(a, l) {
    const c = e.get(a);
    if (!c) return;
    const u = { ...c, ...l };
    na(c, u) || (e.set(a, u), n("speaker:update", { speaker: u }));
  }
  function i(a) {
    const l = e.get(a.id);
    if (l) {
      if (na(l, a)) return;
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
function Bg(n, e) {
  return [...n, e];
}
function Lg(n, e) {
  return [...e, ...n];
}
function nl(n, e) {
  return n.findIndex((t) => t.id === e);
}
function Fg(n, e, t) {
  const r = nl(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function zg(n, e) {
  const t = nl(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function qg(n, e, t) {
  const r = nl(n, e);
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
function ra(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function Vg(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = an(n.turns), l = /* @__PURE__ */ new Map();
  function c() {
    l.clear();
    const b = a.value;
    for (let S = 0; S < b.length; S++)
      l.set(b[S].id, S);
  }
  c();
  function u(b) {
    t(b.speakerId), l.set(b.id, a.value.length), a.value = Bg(a.value, b), e("turn:add", { turn: b, translationId: r });
  }
  function d(b, S) {
    const C = Fg(a.value, b, S);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: r }));
  }
  function f(b) {
    const S = zg(a.value, b);
    S && (a.value = S, c(), e("turn:remove", { turnId: b, translationId: r }));
  }
  function h(b, S) {
    const C = qg(a.value, b, S);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: r }));
  }
  function p(b) {
    ra(b, t), a.value = Lg(a.value, b), c();
  }
  function m(b) {
    ra(b, t), a.value = b, c(), e("translation:sync", { translationId: r });
  }
  function g(b) {
    a.value = b, c();
  }
  function v(b) {
    const S = l.get(b.id);
    S !== void 0 ? a.value[S] = b : (l.set(b.id, a.value.length), a.value.push(b));
  }
  function w(b) {
    return l.has(b);
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: a, addTurn: u, prependTurns: p, updateTurn: d, removeTurn: f, updateWords: h, setTurns: m, replaceTurns: g, updateOrCreateTurnSilent: v, hasTurn: w };
}
function pc(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, a = Is(/* @__PURE__ */ new Map());
  let l;
  for (const m of n.translations) {
    const g = Vg(m, e, t);
    a.set(m.id, g), m.isSource && !l && (l = g);
  }
  l || (l = a.values().next().value);
  const c = D(null), u = D(!1), d = D(!0), f = O(() => c.value ? a.get(c.value) ?? l : l);
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
function Wg(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Ug(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Ir(n, e, t = "*") {
  if (n === "*") return t;
  const r = n.split("-")[0] ?? n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(r) ?? r;
  } catch {
    return n;
  }
}
function Hg(n, e, t, r = "*") {
  return [...n].sort((i, s) => {
    if (i.isSource) return -1;
    if (s.isSource) return 1;
    const o = Ir(
      i.languages[0] ?? "",
      e,
      r
    ), a = Ir(
      s.languages[0] ?? "",
      e,
      r
    );
    return o.localeCompare(a, e);
  }).map((i) => ({
    value: i.id,
    label: i.languages.map((s) => Ir(s, e, r)).join(", "),
    ...i.isSource && { originalLabel: t }
  }));
}
function jg(n, e = 250) {
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
function Jr(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
class Ye extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Kg(n) {
  if (n == null || typeof n != "object")
    throw new Ye("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new Ye("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Ye("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Ye("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new Ye(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Ye(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Ye(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Ye(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Ye(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Ye(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Ye(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Ye(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Ye(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Ye(`${a}.turns`, "must be an array");
    }
  }
}
function Jg(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function rl(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
const Xg = 1;
function zd(n, e) {
  if (!rl(n)) return null;
  for (const t of n)
    if (t.startTime - Xg <= e && e <= t.endTime)
      return t.id;
  return null;
}
function eP(n = {}) {
  const e = D(""), t = D(n.activeChannelId ?? ""), r = D(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: a } = Ig(), l = $g(o), c = l, u = Is(/* @__PURE__ */ new Map()), d = O(
    () => u.get(t.value) ?? [...u.values()][0]
  );
  function f(T, k) {
    return i(T, (M) => {
      const x = d.value;
      x && M.translationId === x.activeTranslation.value.id && k(M);
    });
  }
  function h(T) {
    e.value = T.title, l.clear(), u.clear();
    for (const k of Wg(T))
      c.ensure(k.id, k.name);
    for (const k of T.channels)
      u.set(k.id, pc(k, o, c.ensure));
    u.size > 0 && !u.has(t.value) && (t.value = u.keys().next().value);
  }
  function p(T) {
    Kg(T), h(T);
  }
  function m(T) {
    T !== t.value && (t.value = T, o("channel:change", { channelId: T }));
  }
  function g(T, k) {
    if (u.has(T)) {
      for (const M of k.translations)
        ra(M.turns, c.ensure);
      u.set(T, pc(k, o, c.ensure)), o("channel:sync", { channelId: T });
    }
  }
  const v = [], w = [];
  function b(T) {
    T.tiptapExtensions && w.push(...T.tiptapExtensions);
    const k = T.install(C);
    k && v.push(k);
  }
  function S() {
    o("destroy", void 0), v.forEach((T) => T()), v.length = 0, a();
  }
  n.document && h(n.document);
  const C = {
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
    use: b,
    destroy: S
  };
  return C;
}
const qd = /* @__PURE__ */ Symbol("core");
function tP(n) {
  _n(qd, n);
}
function ft() {
  const n = gi(qd);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const Yg = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const mc = (n) => n === "";
const Gg = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const gc = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Qg = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Zg = (n) => {
  const e = Qg(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Tr = {
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
const ey = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = Tr.width,
  color: a = Tr.stroke,
  ...l
}, { slots: c }) => Qe(
  "svg",
  {
    ...Tr,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": mc(t) || mc(r) || t === !0 || r === !0 ? Number(i || s || Tr["stroke-width"]) * 24 / Number(o) : i || s || Tr["stroke-width"],
    class: Gg(
      "lucide",
      l.class,
      ...n ? [`lucide-${gc(Zg(n))}-icon`, `lucide-${gc(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !Yg(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => Qe(...u)), ...c.default ? [c.default()] : []]
);
const Se = (n, e) => (t, { slots: r, attrs: i }) => Qe(
  ey,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const Vd = Se("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Ns = Se("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Wd = Se("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ty = Se("clipboard-list", [
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
const ny = Se("clipboard-type", [
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
const ry = Se("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const ia = Se("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const iy = Se("ellipsis-vertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const yc = Se("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ud = Se("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Hd = Se("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const jd = Se("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Kd = Se("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Jd = Se("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const sy = Se("user-plus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const Xd = Se("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Yd = Se("volume-2", [
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
const Gd = Se("volume-x", [
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
const il = Se("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), oy = ["aria-label"], ay = /* @__PURE__ */ B({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (E(), V("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      z(e.$slots, "default", {}, void 0, !0)
    ], 8, oy));
  }
}), de = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, vc = /* @__PURE__ */ de(ay, [["__scopeId", "data-v-732d4c24"]]), ly = {
  "arrow-down": Vd,
  check: Ns,
  "chevron-down": Wd,
  "clipboard-list": ty,
  "clipboard-type": ny,
  copy: ry,
  download: ia,
  pause: Ud,
  play: Hd,
  settings: jd,
  "skip-back": Kd,
  "skip-forward": Jd,
  users: Xd,
  volume: Yd,
  "volume-mute": Gd,
  x: il,
  "circle-notch": yc,
  spinner: yc,
  "more-vertical": iy,
  "user-plus": sy
};
function sa(n) {
  if (n)
    return ly[n];
}
const Qd = {
  sm: 16,
  md: 20,
  lg: 24
}, cy = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, uy = /* @__PURE__ */ B({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = O(() => sa(e.name)), r = O(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (E(), I(Ga(t.value), {
      key: 0,
      style: hn(r.value),
      class: gt(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (E(), V("span", cy, "?"));
  }
}), Wi = /* @__PURE__ */ de(uy, [["__scopeId", "data-v-210c7f09"]]), dy = ["type", "disabled", "aria-disabled", "aria-label"], fy = {
  key: 3,
  class: "editor-btn__label"
}, hy = /* @__PURE__ */ B({
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
    const e = n, t = pg(), r = O(() => !!sa(e.icon)), i = O(() => !!sa(e.iconRight)), s = O(() => Qd[e.size]), o = O(() => e.disabled || e.loading), a = O(() => !!e.label || !!t.default), l = O(
      () => e.loading || r.value || !!t.icon
    ), c = O(() => l.value && !a.value), u = O(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      c.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, f) => (E(), V("button", {
      type: n.type,
      class: gt(u.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (E(), I(Wi, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (E(), I(Wi, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? z(d.$slots, "icon", { key: 2 }, void 0, !0) : X("", !0),
      a.value ? (E(), V("span", fy, [
        z(d.$slots, "default", {}, () => [
          pe(J(n.label), 1)
        ], !0)
      ])) : X("", !0),
      i.value ? (E(), I(Wi, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? z(d.$slots, "icon-right", { key: 5 }, void 0, !0) : X("", !0)
    ], 10, dy));
  }
}), xe = /* @__PURE__ */ de(hy, [["__scopeId", "data-v-2212567e"]]), Zd = {
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
}, py = {
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
}, bc = { fr: Zd, en: py }, ef = /* @__PURE__ */ Symbol("i18n");
function nP(n) {
  const e = O(() => {
    const r = bc[n.value] ?? bc.fr;
    return (i) => r[i] ?? i;
  }), t = {
    t: (r) => e.value(r),
    locale: n
  };
  return _n(ef, t), t;
}
function Fe() {
  const n = gi(ef);
  if (n) return n;
  const e = O(() => "fr");
  return {
    t: (t) => Zd[t] ?? t,
    locale: e
  };
}
const my = { class: "editor-header" }, gy = { class: "header-left" }, yy = { class: "document-title" }, vy = { class: "badges" }, by = ["datetime"], wy = { class: "header-right" }, Sy = /* @__PURE__ */ B({
  __name: "Header",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = Fe(), i = O(() => Ir(e.language, r.value, t("language.wildcard"))), s = O(() => Jr(e.duration)), o = O(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), V("header", my, [
      H("div", gy, [
        H("h1", yy, J(o.value), 1),
        H("div", vy, [
          L(vc, null, {
            default: _(() => [
              pe(J(i.value), 1)
            ]),
            _: 1
          }),
          L(vc, null, {
            default: _(() => [
              H("time", {
                datetime: `PT${n.duration}S`
              }, J(s.value), 9, by)
            ]),
            _: 1
          })
        ])
      ]),
      H("div", wy, [
        n.isMobile ? (E(), I(xe, {
          key: 0,
          variant: "transparent",
          "aria-label": y(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: _(() => [
            L(y(Xd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : X("", !0),
        n.isMobile ? (E(), I(xe, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": y(t)("header.export")
        }, {
          icon: _(() => [
            L(y(ia), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (E(), I(xe, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: _(() => [
            L(y(ia), { size: 16 })
          ]),
          default: _(() => [
            pe(" " + J(y(t)("header.export")), 1)
          ]),
          _: 1
        })),
        L(xe, {
          variant: "transparent",
          disabled: "",
          "aria-label": y(t)("header.settings")
        }, {
          icon: _(() => [
            L(y(jd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), ky = /* @__PURE__ */ de(Sy, [["__scopeId", "data-v-4da31078"]]), yo = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, xy = 70, Cy = 1e3 / 60, Ty = 350;
let Ui = !1, wc = !1;
function Ey() {
  wc || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Ui = !0;
  }), document.addEventListener("mouseup", () => {
    Ui = !1;
  }), document.addEventListener("click", () => {
    Ui = !1;
  }), wc = !0);
}
const vo = /* @__PURE__ */ new Map();
function bo(...n) {
  const e = {
    damping: yo.damping,
    stiffness: yo.stiffness,
    mass: yo.mass
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
  return vo.has(r) || vo.set(r, Object.freeze({ ...e })), t ? "instant" : vo.get(r);
}
function My(n = {}) {
  Ey();
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
    const A = s();
    for (const P of t) P(A);
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
  function a(A) {
    r.scrollElement && (r.scrollElement.scrollTop = A, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function l() {
    const A = r.scrollElement, P = r.contentElement;
    return !A || !P ? 0 : A.scrollHeight - 1 - A.clientHeight;
  }
  let c;
  function u() {
    const A = r.scrollElement, P = r.contentElement;
    if (!A || !P)
      return 0;
    const $ = l();
    if (!e.targetScrollTop)
      return $;
    if (c?.targetScrollTop === $)
      return c.calculatedScrollTop;
    const q = Math.max(
      Math.min(
        e.targetScrollTop($, {
          scrollElement: A,
          contentElement: P
        }),
        $
      ),
      0
    );
    return c = { targetScrollTop: $, calculatedScrollTop: q }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), q;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= xy;
  }
  function h(A) {
    r.isAtBottom = A, i();
  }
  function p(A) {
    r.escapedFromLock = A, i();
  }
  function m(A) {
    r.isNearBottom = A, i();
  }
  function g() {
    if (!Ui || typeof window > "u")
      return !1;
    const A = window.getSelection?.();
    if (!A || !A.rangeCount)
      return !1;
    const P = A.getRangeAt(0), $ = r.scrollElement;
    if (!$)
      return !1;
    const q = P.commonAncestorContainer;
    return !!(q && ($.contains(q) || q.contains($)));
  }
  const v = (A) => {
    if (A.target !== r.scrollElement)
      return;
    const P = o(), $ = r.ignoreScrollToTop;
    let q = r.lastScrollTop ?? P;
    r.lastScrollTop = P, r.ignoreScrollToTop = void 0, $ && $ > P && (q = $), m(f()), setTimeout(() => {
      if (r.resizeDifference || P === $)
        return;
      if (g()) {
        p(!0), h(!1);
        return;
      }
      const R = P > q, F = P < q;
      if (r.animation?.ignoreEscapes) {
        a(q);
        return;
      }
      F && (p(!0), h(!1)), R && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, w = (A) => {
    const P = r.scrollElement;
    if (!P)
      return;
    let $ = A.target;
    for (; $ && !["scroll", "auto"].includes(getComputedStyle($).overflow); ) {
      if (!$.parentElement)
        return;
      $ = $.parentElement;
    }
    $ === P && A.deltaY < 0 && P.scrollHeight > P.clientHeight && !r.animation?.ignoreEscapes && (p(!0), h(!1));
  };
  function b(A, P) {
    S(), r.scrollElement = A, r.contentElement = P, getComputedStyle(A).overflow === "visible" && (A.style.overflow = "auto"), A.addEventListener("scroll", v, { passive: !0 }), A.addEventListener("wheel", w, { passive: !0 });
    let $;
    r.resizeObserver = new ResizeObserver((q) => {
      const R = q[0];
      if (!R)
        return;
      const { height: F } = R.contentRect, ie = F - ($ ?? F);
      if (r.resizeDifference = ie, o() > l() && a(l()), m(f()), ie >= 0) {
        const Q = bo(
          e,
          $ ? e.resize : e.initial
        );
        k({
          animation: Q,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Q === "instant" ? void 0 : Ty
        });
      } else
        f() && (p(!1), h(!0));
      $ = F, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === ie && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(P);
  }
  function S() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", v), r.scrollElement.removeEventListener("wheel", w)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function C() {
    S(), t.clear();
  }
  function T(A) {
    e = { ...e, ...A };
  }
  function k(A = {}) {
    const P = typeof A == "string" ? { animation: A } : A;
    P.preserveScrollPosition || h(!0);
    const $ = Date.now() + (Number(P.wait) || 0), q = bo(e, P.animation), { ignoreEscapes: R = !1 } = P;
    let F, ie = u();
    P.duration instanceof Promise ? P.duration.finally(() => {
      F = Date.now();
    }) : F = $ + (P.duration ?? 0);
    const Q = async () => {
      const oe = new Promise((ye) => {
        if (typeof requestAnimationFrame > "u") {
          ye(!1);
          return;
        }
        requestAnimationFrame(() => ye(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const ye = o(), Xe = typeof performance < "u" ? performance.now() : Date.now(), Hn = (Xe - (r.lastTick ?? Xe)) / Cy;
        if (r.animation ||= { behavior: q, promise: oe, ignoreEscapes: R }, r.animation.behavior === q && (r.lastTick = Xe), g() || $ > Date.now())
          return Q();
        if (ye < Math.min(ie, u())) {
          if (r.animation?.behavior === q) {
            if (q === "instant")
              return a(u()), Q();
            const ht = q;
            r.velocity = (ht.damping * r.velocity + ht.stiffness * d()) / ht.mass, r.accumulated += r.velocity * Hn;
            const jn = o();
            a(jn + r.accumulated), o() !== jn && (r.accumulated = 0);
          }
          return Q();
        }
        return F > Date.now() ? (ie = u(), Q()) : (r.animation = void 0, o() < u() ? k({
          animation: bo(e, e.resize),
          ignoreEscapes: R,
          duration: Math.max(0, F - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return oe.then((ye) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), ye));
    };
    return P.wait !== !0 && (r.animation = void 0), r.animation?.behavior === q ? r.animation.promise : Q();
  }
  const M = () => {
    p(!0), h(!1);
  };
  function x(A) {
    return t.add(A), () => t.delete(A);
  }
  return {
    attach: b,
    detach: S,
    destroy: C,
    setOptions: T,
    getState: s,
    onChange: x,
    scrollToBottom: k,
    stopScroll: M
  };
}
function Ay(n = {}) {
  const e = D(null), t = D(null), r = D(n.initial !== !1), i = D(!1), s = D(!1), o = My(n);
  let a = null;
  return tt((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), Ht(() => {
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
const Oy = /* @__PURE__ */ B({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (E(), V("span", {
      class: "speaker-indicator",
      style: hn({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), sl = /* @__PURE__ */ de(Oy, [["__scopeId", "data-v-9bffeda8"]]), _y = { class: "speaker-label" }, Dy = {
  key: 1,
  class: "speaker-name"
}, Py = ["datetime"], Iy = { class: "lang" }, Ny = /* @__PURE__ */ B({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = Fe(), i = O(
      () => Ir(e.language, r.value, t("language.wildcard"))
    ), s = O(
      () => e.startTime != null ? Jr(e.startTime) : null
    ), o = O(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = O(() => e.speaker?.color ?? "transparent");
    return (l, c) => (E(), V("div", _y, [
      n.speaker ? (E(), I(sl, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : X("", !0),
      n.speaker ? (E(), V("span", Dy, J(n.speaker.name), 1)) : X("", !0),
      s.value ? (E(), V("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, J(s.value), 9, Py)) : X("", !0),
      H("span", Iy, J(i.value), 1)
    ]));
  }
}), oa = /* @__PURE__ */ de(Ny, [["__scopeId", "data-v-98e1fa13"]]);
function Sc(n) {
  return typeof n == "string" ? `'${n}'` : new Ry().serialize(n);
}
const Ry = /* @__PURE__ */ (function() {
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
function Dn(n, e) {
  return n === e || Sc(n) === Sc(e);
}
function $y(n, e, t) {
  const r = n.findIndex((a) => Dn(a, e)), i = n.findIndex((a) => Dn(a, t));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((a, l) => a - l);
  return n.slice(s, o + 1);
}
function kc(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function Ne(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = gi(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (_n(r, o), o)];
}
function He() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Rs(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function cr(n) {
  return n == null;
}
function xc(n, e) {
  return cr(n) ? !1 : Array.isArray(n) ? n.some((t) => Dn(t, e)) : Dn(n, e);
}
function ol(n) {
  return n ? n.flatMap((e) => e.type === Ie ? ol(e.children) : [e]) : [];
}
const By = ["INPUT", "TEXTAREA"];
function Ly(n, e, t, r = {}) {
  if (!e || r.enableIgnoredElement && By.includes(e.nodeName)) return null;
  const { arrowKeyOptions: i = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: o = [], loop: a = !0, dir: l = "ltr", preventScroll: c = !0, focus: u = !1 } = r, [d, f, h, p, m, g] = [
    n.key === "ArrowRight",
    n.key === "ArrowLeft",
    n.key === "ArrowUp",
    n.key === "ArrowDown",
    n.key === "Home",
    n.key === "End"
  ], v = h || p, w = d || f;
  if (!m && !g && (!v && !w || i === "vertical" && w || i === "horizontal" && v)) return null;
  const b = t ? Array.from(t.querySelectorAll(s)) : o;
  if (!b.length) return null;
  c && n.preventDefault();
  let S = null;
  return w || v ? S = tf(b, e, {
    goForward: v ? p : l === "ltr" ? d : f,
    loop: a
  }) : m ? S = b.at(0) || null : g && (S = b.at(-1) || null), u && S?.focus(), S;
}
function tf(n, e, t, r = n.length) {
  if (--r === 0) return null;
  const i = n.indexOf(e), s = t.goForward ? i + 1 : i - 1;
  if (!t.loop && (s < 0 || s >= n.length)) return null;
  const o = (s + n.length) % n.length, a = n[o];
  return a ? a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false" ? tf(n, a, t, r) : a : null;
}
const [$s] = Ne("ConfigProvider");
function Fy(n, e) {
  var t;
  const r = an();
  return tt(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), mg(r);
}
function Bs(n, e) {
  return Pd() ? (Id(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function wo() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const o = () => e(s);
      return Bs(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((o) => o(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function zy(n) {
  let e = !1, t;
  const r = Nd(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const jt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const qy = (n) => typeof n < "u", Vy = Object.prototype.toString, Wy = (n) => Vy.call(n) === "[object Object]", Cc = /* @__PURE__ */ Uy();
function Uy() {
  var n, e, t;
  return jt && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function So(n) {
  return Array.isArray(n) ? n : [n];
}
function Hy(n) {
  return pn();
}
// @__NO_SIDE_EFFECTS__
function nf(n) {
  if (!jt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = Nd(!0), t = r.run(() => n(...s))), Bs(i), t));
}
function rf(n, e = 1e4) {
  return Dd((t, r) => {
    let i = We(n), s;
    const o = () => setTimeout(() => {
      i = We(n), r();
    }, We(e));
    return Bs(() => {
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
function jy(n, e) {
  Hy() && Ht(n, e);
}
function Ky(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const Ls = jt ? window : void 0;
function Tt(n) {
  var e;
  const t = We(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function rs(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = O(() => {
    const r = So(We(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return Ky(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => Tt(s))) !== null && r !== void 0 ? r : [Ls].filter((s) => s != null),
      So(We(t.value ? n[1] : n[0])),
      So(y(t.value ? n[2] : n[1])),
      We(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = Wy(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function sf() {
  const n = an(!1), e = pn();
  return e && me(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function Jy(n) {
  const e = /* @__PURE__ */ sf();
  return O(() => (e.value, !!n()));
}
function Xy(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Yy(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = Ls, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = Xy(e);
  return rs(i, s, (u) => {
    u.repeat && We(a) || l(u) && t(u);
  }, o);
}
function Gy(n) {
  return JSON.parse(JSON.stringify(n));
}
function Qy(n, e, t = {}) {
  const { window: r = Ls, ...i } = t;
  let s;
  const o = /* @__PURE__ */ Jy(() => r && "ResizeObserver" in r), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = Z(O(() => {
    const u = We(n);
    return Array.isArray(u) ? u.map((d) => Tt(d)) : [Tt(u)];
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
  return Bs(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ln(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = pn(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (w) => o ? typeof o == "function" ? o(w) : Gy(w) : w, g = () => qy(n[e]) ? m(n[e]) : u, v = (w) => {
    d ? d(w) && h(p, w) : h(p, w);
  };
  if (a) {
    const w = D(g());
    let b = !1;
    return Z(() => n[e], (S) => {
      b || (b = !0, w.value = m(S), ae(() => b = !1));
    }), Z(w, (S) => {
      !b && (S !== n[e] || c) && v(S);
    }, { deep: c }), w;
  } else return O({
    get() {
      return g();
    },
    set(w) {
      v(w);
    }
  });
}
function ko(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function aa(n, e, t = ".", r) {
  if (!ko(e))
    return aa(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : ko(o) && ko(i[s]) ? i[s] = aa(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function Zy(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => aa(t, r, "", n), {})
  );
}
const ev = Zy(), tv = /* @__PURE__ */ nf(() => {
  const n = D(/* @__PURE__ */ new Map()), e = D(), t = O(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), r = $s({ scrollBody: D(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", Cc && i?.(), e.value = void 0;
  };
  return Z(t, (o, a) => {
    if (!jt) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? ev({
      padding: r.scrollBody.value.padding === !0 ? l : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? l : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), Cc && (i = rs(document, "touchmove", (d) => nv(d), { passive: !1 })), ae(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function al(n) {
  const e = Math.random().toString(36).substring(2, 7), t = tv();
  t.value.set(e, n ?? !1);
  const r = O({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return jy(() => {
    t.value.delete(e);
  }), r;
}
function of(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : of(t);
  }
}
function nv(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && of(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function yi(n) {
  const e = $s({ dir: D("ltr") });
  return O(() => n?.value || e.dir?.value || "ltr");
}
function vi(n) {
  const e = pn(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[gg(Rd(i))] = (...s) => n(i, ...s);
  }), r;
}
let xo = 0;
function af() {
  tt((n) => {
    if (!jt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Tc()), document.body.insertAdjacentElement("beforeend", e[1] ?? Tc()), xo++, n(() => {
      xo === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), xo--;
    });
  });
}
function Tc() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function ll(n) {
  return O(() => We(n) ? !!Tt(n)?.closest("form") : !0);
}
function se() {
  const n = pn(), e = D(), t = O(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Tt(e)), r = Object.assign({}, n.exposed), i = {};
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
function cl(n) {
  const e = pn(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Vi(n);
  return O(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[Rd(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function bi(n, e) {
  const t = cl(n), r = e ? vi(e) : {};
  return O(() => ({
    ...t.value,
    ...r
  }));
}
var rv = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, Jn = /* @__PURE__ */ new WeakMap(), Ai = /* @__PURE__ */ new WeakMap(), Oi = {}, Co = 0, lf = function(n) {
  return n && (n.host || lf(n.parentNode));
}, iv = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = lf(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, sv = function(n, e, t, r) {
  var i = iv(e, Array.isArray(n) ? n : [n]);
  Oi[t] || (Oi[t] = /* @__PURE__ */ new WeakMap());
  var s = Oi[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (Jn.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Jn.set(f, m), s.set(f, g), o.push(f), m === 1 && p && Ai.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (v) {
          console.error("aria-hidden: cannot operate on ", f, v);
        }
    });
  };
  return u(e), a.clear(), Co++, function() {
    o.forEach(function(d) {
      var f = Jn.get(d) - 1, h = s.get(d) - 1;
      Jn.set(d, f), s.set(d, h), f || (Ai.has(d) || d.removeAttribute(r), Ai.delete(d)), h || d.removeAttribute(t);
    }), Co--, Co || (Jn = /* @__PURE__ */ new WeakMap(), Jn = /* @__PURE__ */ new WeakMap(), Ai = /* @__PURE__ */ new WeakMap(), Oi = {});
  };
}, ov = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = rv(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), sv(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function ul(n) {
  let e;
  Z(() => Tt(n), (t) => {
    t ? e = ov(t) : e && e();
  }), Ln(() => {
    e && e();
  });
}
let av = 0;
function cn(n, e = "reka") {
  if ("useId" in dc) return `${e}-${dc.useId?.()}`;
  const t = $s({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++av}`;
}
function lv() {
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
function cv(n) {
  const e = D(), t = O(() => e.value?.width ?? 0), r = O(() => e.value?.height ?? 0);
  return me(() => {
    const i = Tt(n);
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
function uv(n, e) {
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
function Fs(n) {
  const e = rf("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = He(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = fv(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function dv(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function fv(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = dv(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== t ? l : void 0;
}
function hv(n, e) {
  const t = D({}), r = D("none"), i = D(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Ls, { state: l, dispatch: c } = uv(s, {
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
    if (jt) {
      const v = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(v);
    }
  };
  Z(n, async (g, v) => {
    const w = v !== g;
    if (await ae(), w) {
      const b = r.value, S = _i(e.value);
      g ? (c("MOUNT"), u("enter"), S === "none" && u("after-enter")) : S === "none" || S === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : v && b !== S ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const v = _i(e.value), w = v.includes(CSS.escape(g.animationName)), b = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && w && (u(`after-${b}`), c("ANIMATION_END"), !i.value)) {
      const S = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = S);
      });
    }
    g.target === e.value && v === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = _i(e.value));
  }, h = Z(e, (g, v) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), v?.removeEventListener("animationstart", f), v?.removeEventListener("animationcancel", d), v?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = Z(l, () => {
    const g = _i(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return Ln(() => {
    h(), p();
  }), { isPresent: O(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function _i(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var wi = B({
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
    const { present: r, forceMount: i } = Ot(n), s = D(), { isPresent: o } = hv(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = ol(a || []);
    const l = pn();
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
    return () => i.value || r.value || o.value ? Qe(e.default({ present: o.value })[0], { ref: (c) => {
      const u = Tt(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const la = B({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = ol(t.default()), i = r.findIndex((l) => l.type !== yg);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? re(e, s.props) : e, a = vg({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), pv = [
  "area",
  "img",
  "input"
], he = B({
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
    return typeof r == "string" && pv.includes(r) ? () => Qe(r, e) : r !== "template" ? () => Qe(n.as, e, { default: t.default }) : () => Qe(la, e, { default: t.default });
  }
});
function is() {
  const n = D(), e = O(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Tt(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [mn, mv] = Ne("DialogRoot");
var gv = /* @__PURE__ */ B({
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
    const t = n, i = /* @__PURE__ */ ln(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = D(), o = D(), { modal: a } = Ot(t);
    return mv({
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
    }), (l, c) => z(l.$slots, "default", {
      open: y(i),
      close: () => i.value = !1
    });
  }
}), cf = gv, yv = /* @__PURE__ */ B({
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
    se();
    const t = mn();
    return (r, i) => (E(), I(y(he), re(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => y(t).onOpenChange(!1))
    }), {
      default: _(() => [z(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), vv = yv;
const bv = "dismissableLayer.pointerDownOutside", wv = "dismissableLayer.focusOutside";
function uf(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function Sv(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1), s = D(() => {
  });
  return tt((o) => {
    if (!jt || !We(t)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (uf(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            Rs(bv, n, d);
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
    We(t) && (i.value = !0);
  } };
}
function kv(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1);
  return tt((s) => {
    if (!jt || !We(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await ae(), await ae();
      const l = a.target;
      !e.value || !l || uf(e.value, l) || a.target && !i.value && Rs(wv, n, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      We(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      We(t) && (i.value = !1);
    }
  };
}
const at = Qa({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var xv = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = se(), o = O(() => s.value?.ownerDocument ?? globalThis.document), a = O(() => at.layersRoot), l = O(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = O(() => at.layersWithOutsidePointerEventsDisabled.size > 0), u = O(() => {
      const h = Array.from(a.value), [p] = [...at.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return l.value >= m;
    }), d = Sv(async (h) => {
      const p = [...at.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await ae(), h.defaultPrevented || r("dismiss"));
    }, s), f = kv((h) => {
      [...at.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return Yy("Escape", (h) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), tt((h) => {
      s.value && (t.disableOutsidePointerEvents && (at.layersWithOutsidePointerEventsDisabled.size === 0 && (at.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), at.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && at.layersWithOutsidePointerEventsDisabled.size === 1 && !cr(at.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = at.originalBodyPointerEvents);
      }));
    }), tt((h) => {
      h(() => {
        s.value && (a.value.delete(s.value), at.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (E(), I(y(he), {
      ref: y(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: hn({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: y(f).onFocusCapture,
      onBlurCapture: y(f).onBlurCapture,
      onPointerdownCapture: y(d).onPointerDownCapture
    }, {
      default: _(() => [z(h.$slots, "default")]),
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
}), dl = xv;
const Cv = /* @__PURE__ */ zy(() => D([]));
function Tv() {
  const n = Cv();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = Ec(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = Ec(n.value, e), n.value[0]?.resume();
    }
  };
}
function Ec(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const To = "focusScope.autoFocusOnMount", Eo = "focusScope.autoFocusOnUnmount", Mc = {
  bubbles: !1,
  cancelable: !0
};
function Ev(n, { select: e = !1 } = {}) {
  const t = He();
  for (const r of n)
    if (Jt(r, { select: e }), He() !== t) return !0;
}
function Mv(n) {
  const e = df(n), t = Ac(e, n), r = Ac(e.reverse(), n);
  return [t, r];
}
function df(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function Ac(n, e) {
  for (const t of n) if (!Av(t, { upTo: e })) return t;
}
function Av(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Ov(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Jt(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = He();
    n.focus({ preventScroll: !0 }), n !== t && Ov(n) && e && n.select();
  }
}
var _v = /* @__PURE__ */ B({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = se(), o = D(null), a = Tv(), l = Qa({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    tt((u) => {
      if (!jt) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const v = g.target;
        d.contains(v) ? o.value = v : Jt(o.value, { select: !0 });
      }
      function h(g) {
        if (l.paused || !d) return;
        const v = g.relatedTarget;
        v !== null && (d.contains(v) || Jt(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || Jt(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", h);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", h), m.disconnect();
      });
    }), tt(async (u) => {
      const d = s.value;
      if (await ae(), !d) return;
      a.add(l);
      const f = He();
      if (!d.contains(f)) {
        const p = new CustomEvent(To, Mc);
        d.addEventListener(To, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (Ev(df(d), { select: !0 }), He() === f && Jt(d));
      }
      u(() => {
        d.removeEventListener(To, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(Eo, Mc), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(Eo, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Jt(f ?? document.body, { select: !0 }), d.removeEventListener(Eo, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = He();
      if (d && f) {
        const h = u.currentTarget, [p, m] = Mv(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && Jt(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && Jt(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (E(), I(y(he), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: _(() => [z(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), fl = _v;
const Dv = "menu.itemSelect", ca = ["Enter", " "], Pv = [
  "ArrowDown",
  "PageUp",
  "Home"
], ff = [
  "ArrowUp",
  "PageDown",
  "End"
], Iv = [...Pv, ...ff];
[...ca], [...ca];
function hf(n) {
  return n ? "open" : "closed";
}
function ua(n) {
  const e = He();
  for (const t of n)
    if (t === e || (t.focus(), He() !== e)) return;
}
function Nv(n, e) {
  const { x: t, y: r } = n;
  let i = !1;
  for (let s = 0, o = e.length - 1; s < e.length; o = s++) {
    const a = e[s].x, l = e[s].y, c = e[o].x, u = e[o].y;
    l > r != u > r && t < (c - a) * (r - l) / (u - l) + a && (i = !i);
  }
  return i;
}
function Rv(n, e) {
  if (!e) return !1;
  const t = {
    x: n.clientX,
    y: n.clientY
  };
  return Nv(t, e);
}
function da(n) {
  return n.pointerType === "mouse";
}
const $v = "DialogTitle", Bv = "DialogContent";
function Lv({ titleName: n = $v, contentName: e = Bv, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  me(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(a));
  });
}
var Fv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = mn(), { forwardRef: s, currentElement: o } = se();
    return i.titleId ||= cn(void 0, "reka-dialog-title"), i.descriptionId ||= cn(void 0, "reka-dialog-description"), me(() => {
      i.contentElement = o, He() !== document.body && (i.triggerElement.value = He());
    }), process.env.NODE_ENV !== "production" && Lv({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, l) => (E(), I(y(fl), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: _(() => [L(y(dl), re({
        id: y(i).contentId,
        ref: y(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": y(i).descriptionId,
        "aria-labelledby": y(i).titleId,
        "data-state": y(hf)(y(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => y(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: _(() => [z(a.$slots, "default")]),
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
}), pf = Fv, zv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = mn(), s = vi(r), { forwardRef: o, currentElement: a } = se();
    return ul(a), (l, c) => (E(), I(pf, re({
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
      default: _(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), qv = zv, Vv = /* @__PURE__ */ B({
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
    const t = n, i = vi(e);
    se();
    const s = mn(), o = D(!1), a = D(!1);
    return (l, c) => (E(), I(pf, re({
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
      default: _(() => [z(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Wv = Vv, Uv = /* @__PURE__ */ B({
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
    const t = n, r = e, i = mn(), s = vi(r), { forwardRef: o } = se();
    return (a, l) => (E(), I(y(wi), { present: a.forceMount || y(i).open.value }, {
      default: _(() => [y(i).modal.value ? (E(), I(qv, re({
        key: 0,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...a.$attrs
      }), {
        default: _(() => [z(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), I(Wv, re({
        key: 1,
        ref: y(o)
      }, {
        ...t,
        ...y(s),
        ...a.$attrs
      }), {
        default: _(() => [z(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), mf = Uv, Hv = /* @__PURE__ */ B({
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
    const e = mn();
    return al(!0), se(), (t, r) => (E(), I(y(he), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": y(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), jv = Hv, Kv = /* @__PURE__ */ B({
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
    const e = mn(), { forwardRef: t } = se();
    return (r, i) => y(e)?.modal.value ? (E(), I(y(wi), {
      key: 0,
      present: r.forceMount || y(e).open.value
    }, {
      default: _(() => [L(jv, re(r.$attrs, {
        ref: y(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: _(() => [z(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : X("v-if", !0);
  }
}), gf = Kv, Jv = /* @__PURE__ */ B({
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
    const e = /* @__PURE__ */ sf();
    return (t, r) => y(e) || t.forceMount ? (E(), I($d, {
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
}), hl = Jv, Xv = /* @__PURE__ */ B({
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
    return (t, r) => (E(), I(y(hl), zt(Fn(e)), {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), yf = Xv, Yv = /* @__PURE__ */ B({
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
    const e = n, t = mn();
    return se(), (r, i) => (E(), I(y(he), re(e, { id: y(t).titleId }), {
      default: _(() => [z(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), vf = Yv;
const Oc = "data-reka-collection-item";
function bt(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = D(/* @__PURE__ */ new Map());
    i = {
      collectionRef: D(),
      itemMap: u
    }, _n(r, i);
  } else i = gi(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Oc}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = B({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = is();
      return Z(p, () => {
        i.collectionRef.value = p.value;
      }), () => Qe(la, {
        ref: h,
        ...f
      }, d);
    }
  }), a = B({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = is();
      return tt((m) => {
        if (p.value) {
          const g = Za(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => Qe(la, {
        ...f,
        [Oc]: "",
        ref: h
      }, d);
    }
  }), l = O(() => Array.from(i.itemMap.value.values())), c = O(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: l,
    itemMapSize: c,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const Gv = "rovingFocusGroup.onEntryFocus", Qv = {
  bubbles: !1,
  cancelable: !0
}, Zv = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function eb(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function bf(n, e, t) {
  const r = eb(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Zv[r];
}
function wf(n, e = !1) {
  const t = He();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), He() !== t)) return;
}
function tb(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [nb, rb] = Ne("RovingFocusGroup");
var ib = /* @__PURE__ */ B({
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
    const r = n, i = t, { loop: s, orientation: o, dir: a } = Ot(r), l = yi(a), c = /* @__PURE__ */ ln(r, "currentTabStopId", i, {
      defaultValue: r.defaultCurrentTabStopId,
      passive: r.currentTabStopId === void 0
    }), u = D(!1), d = D(!1), f = D(0), { getItems: h, CollectionSlot: p } = bt({ isProvider: !0 });
    function m(v) {
      const w = !d.value;
      if (v.currentTarget && v.target === v.currentTarget && w && !u.value) {
        const b = new CustomEvent(Gv, Qv);
        if (v.currentTarget.dispatchEvent(b), i("entryFocus", b), !b.defaultPrevented) {
          const S = h().map((x) => x.ref).filter((x) => x.dataset.disabled !== ""), C = S.find((x) => x.getAttribute("data-active") === ""), T = S.find((x) => x.getAttribute("data-highlighted") === ""), k = S.find((x) => x.id === c.value), M = [
            C,
            T,
            k,
            ...S
          ].filter(Boolean);
          wf(M, r.preventScrollOnEntryFocus);
        }
      }
      d.value = !1;
    }
    function g() {
      setTimeout(() => {
        d.value = !1;
      }, 1);
    }
    return e({ getItems: h }), rb({
      loop: s,
      dir: l,
      orientation: o,
      currentTabStopId: c,
      onItemFocus: (v) => {
        c.value = v;
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
    }), (v, w) => (E(), I(y(p), null, {
      default: _(() => [L(y(he), {
        tabindex: u.value || f.value === 0 ? -1 : 0,
        "data-orientation": y(o),
        as: v.as,
        "as-child": v.asChild,
        dir: y(l),
        style: { outline: "none" },
        onMousedown: w[0] || (w[0] = (b) => d.value = !0),
        onMouseup: g,
        onFocus: m,
        onBlur: w[1] || (w[1] = (b) => u.value = !1)
      }, {
        default: _(() => [z(v.$slots, "default")]),
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
}), sb = ib, ob = /* @__PURE__ */ B({
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
    const e = n, t = nb(), r = cn(), i = O(() => e.tabStopId || r), s = O(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = bt();
    me(() => {
      e.focusable && t.onFocusableItemAdd();
    }), Ln(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function l(c) {
      if (c.key === "Tab" && c.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const u = bf(c, t.orientation.value, t.dir.value);
      if (u !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !e.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let d = [...o().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (u === "last") d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const f = d.indexOf(c.currentTarget);
          d = t.loop.value ? tb(d, f + 1) : d.slice(f + 1);
        }
        ae(() => wf(d));
      }
    }
    return (c, u) => (E(), I(y(a), null, {
      default: _(() => [L(y(he), {
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
        default: _(() => [z(c.$slots, "default")]),
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
}), ab = ob, lb = /* @__PURE__ */ B({
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
    return (e, t) => (E(), I(y(he), {
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
      default: _(() => [z(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Sf = lb, cb = /* @__PURE__ */ B({
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
    const e = n, { primitiveElement: t, currentElement: r } = is(), i = O(() => e.checked ?? e.value);
    return Z(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (E(), I(Sf, re({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), _c = cb, ub = /* @__PURE__ */ B({
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
    const e = n, t = O(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), r = O(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (i, s) => (E(), V(Ie, null, [X(" We render single input if it's required "), t.value ? (E(), I(_c, re({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (E(!0), V(Ie, { key: 1 }, _t(r.value, (o) => (E(), I(_c, re({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), kf = ub;
const [db] = Ne("CheckboxGroupRoot");
function ss(n) {
  return n === "indeterminate";
}
function xf(n) {
  return ss(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [fb, hb] = Ne("CheckboxRoot");
var pb = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = se(), o = db(null), a = /* @__PURE__ */ ln(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), l = O(() => o?.disabled.value || t.disabled), c = O(() => cr(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : xc(o.modelValue.value, t.value));
    function u() {
      if (cr(o?.modelValue.value))
        a.value = ss(a.value) ? !0 : !a.value;
      else {
        const h = [...o.modelValue.value || []];
        if (xc(h, t.value)) {
          const p = h.findIndex((m) => Dn(m, t.value));
          h.splice(p, 1);
        } else h.push(t.value);
        o.modelValue.value = h;
      }
    }
    const d = ll(s), f = O(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return hb({
      disabled: l,
      state: c
    }), (h, p) => (E(), I(Ga(y(o)?.rovingFocus.value ? y(ab) : y(he)), re(h.$attrs, {
      id: h.id,
      ref: y(i),
      role: "checkbox",
      "as-child": h.asChild,
      as: h.as,
      type: h.as === "button" ? "button" : void 0,
      "aria-checked": y(ss)(c.value) ? "mixed" : c.value,
      "aria-required": h.required,
      "aria-label": h.$attrs["aria-label"] || f.value,
      "data-state": y(xf)(c.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: y(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: Kr(Ue(() => {
      }, ["prevent"]), ["enter"]),
      onClick: u
    }), {
      default: _(() => [z(h.$slots, "default", {
        modelValue: y(a),
        state: c.value
      }), y(d) && h.name && !y(o) ? (E(), I(y(kf), {
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
      ])) : X("v-if", !0)]),
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
}), mb = pb, gb = /* @__PURE__ */ B({
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
    const { forwardRef: e } = se(), t = fb();
    return (r, i) => (E(), I(y(wi), { present: r.forceMount || y(ss)(y(t).state.value) || y(t).state.value === !0 }, {
      default: _(() => [L(y(he), re({
        ref: y(e),
        "data-state": y(xf)(y(t).state.value),
        "data-disabled": y(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: _(() => [z(r.$slots, "default")]),
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
}), yb = gb;
const [Cf, vb] = Ne("PopperRoot");
var bb = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = D();
    return vb({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => z(t.$slots, "default");
  }
}), Tf = bb, wb = /* @__PURE__ */ B({
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
    const e = n, { forwardRef: t, currentElement: r } = se(), i = Cf();
    return Bd(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (E(), I(y(he), {
      ref: y(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: _(() => [z(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Ef = wb;
function Sb(n) {
  return n !== null;
}
function kb(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [c, u] = fa(t), d = {
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
function fa(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const xb = ["top", "right", "bottom", "left"], un = Math.min, it = Math.max, as = Math.round, Di = Math.floor, xt = (n) => ({
  x: n,
  y: n
}), Cb = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Tb = {
  start: "end",
  end: "start"
};
function ha(n, e, t) {
  return it(n, un(e, t));
}
function Vt(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Wt(n) {
  return n.split("-")[0];
}
function wr(n) {
  return n.split("-")[1];
}
function pl(n) {
  return n === "x" ? "y" : "x";
}
function ml(n) {
  return n === "y" ? "height" : "width";
}
const Eb = /* @__PURE__ */ new Set(["top", "bottom"]);
function kt(n) {
  return Eb.has(Wt(n)) ? "y" : "x";
}
function gl(n) {
  return pl(kt(n));
}
function Mb(n, e, t) {
  t === void 0 && (t = !1);
  const r = wr(n), i = gl(n), s = ml(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = ls(o)), [o, ls(o)];
}
function Ab(n) {
  const e = ls(n);
  return [pa(n), e, pa(e)];
}
function pa(n) {
  return n.replace(/start|end/g, (e) => Tb[e]);
}
const Dc = ["left", "right"], Pc = ["right", "left"], Ob = ["top", "bottom"], _b = ["bottom", "top"];
function Db(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? Pc : Dc : e ? Dc : Pc;
    case "left":
    case "right":
      return e ? Ob : _b;
    default:
      return [];
  }
}
function Pb(n, e, t, r) {
  const i = wr(n);
  let s = Db(Wt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(pa)))), s;
}
function ls(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Cb[e]);
}
function Ib(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Mf(n) {
  return typeof n != "number" ? Ib(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function cs(n) {
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
function Ic(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = kt(e), o = gl(e), a = ml(o), l = Wt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
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
  switch (wr(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function Nb(n, e) {
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
  } = Vt(e, n), p = Mf(h), g = a[f ? d === "floating" ? "reference" : "floating" : d], v = cs(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), w = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, b = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), S = await (s.isElement == null ? void 0 : s.isElement(b)) ? await (s.getScale == null ? void 0 : s.getScale(b)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = cs(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: w,
    offsetParent: b,
    strategy: l
  }) : w);
  return {
    top: (v.top - C.top + p.top) / S.y,
    bottom: (C.bottom - v.bottom + p.bottom) / S.y,
    left: (v.left - C.left + p.left) / S.x,
    right: (C.right - v.right + p.right) / S.x
  };
}
const Rb = async (n, e, t) => {
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
  } = Ic(c, r, l), f = r, h = {}, p = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: v,
      fn: w
    } = a[g], {
      x: b,
      y: S,
      data: C,
      reset: T
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
        detectOverflow: (m = o.detectOverflow) != null ? m : Nb
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = b ?? u, d = S ?? d, h = {
      ...h,
      [v]: {
        ...h[v],
        ...C
      }
    }, T && p <= 50 && (p++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (c = T.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : T.rects), {
      x: u,
      y: d
    } = Ic(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, $b = (n) => ({
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
    } = Vt(n, e) || {};
    if (c == null)
      return {};
    const d = Mf(u), f = {
      x: t,
      y: r
    }, h = gl(i), p = ml(h), m = await o.getDimensions(c), g = h === "y", v = g ? "top" : "left", w = g ? "bottom" : "right", b = g ? "clientHeight" : "clientWidth", S = s.reference[p] + s.reference[h] - f[h] - s.floating[p], C = f[h] - s.reference[h], T = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let k = T ? T[b] : 0;
    (!k || !await (o.isElement == null ? void 0 : o.isElement(T))) && (k = a.floating[b] || s.floating[p]);
    const M = S / 2 - C / 2, x = k / 2 - m[p] / 2 - 1, A = un(d[v], x), P = un(d[w], x), $ = A, q = k - m[p] - P, R = k / 2 - m[p] / 2 + M, F = ha($, R, q), ie = !l.arrow && wr(i) != null && R !== F && s.reference[p] / 2 - (R < $ ? A : P) - m[p] / 2 < 0, Q = ie ? R < $ ? R - $ : R - q : 0;
    return {
      [h]: f[h] + Q,
      data: {
        [h]: F,
        centerOffset: R - F - Q,
        ...ie && {
          alignmentOffset: Q
        }
      },
      reset: ie
    };
  }
}), Bb = function(n) {
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
      } = Vt(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const v = Wt(i), w = kt(a), b = Wt(a) === a, S = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), C = f || (b || !m ? [ls(a)] : Ab(a)), T = p !== "none";
      !f && T && C.push(...Pb(a, m, p, S));
      const k = [a, ...C], M = await l.detectOverflow(e, g), x = [];
      let A = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && x.push(M[v]), d) {
        const R = Mb(i, o, S);
        x.push(M[R[0]], M[R[1]]);
      }
      if (A = [...A, {
        placement: i,
        overflows: x
      }], !x.every((R) => R <= 0)) {
        var P, $;
        const R = (((P = s.flip) == null ? void 0 : P.index) || 0) + 1, F = k[R];
        if (F && (!(d === "alignment" ? w !== kt(F) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        A.every((oe) => kt(oe.placement) === w ? oe.overflows[0] > 0 : !0)))
          return {
            data: {
              index: R,
              overflows: A
            },
            reset: {
              placement: F
            }
          };
        let ie = ($ = A.filter((Q) => Q.overflows[0] <= 0).sort((Q, oe) => Q.overflows[1] - oe.overflows[1])[0]) == null ? void 0 : $.placement;
        if (!ie)
          switch (h) {
            case "bestFit": {
              var q;
              const Q = (q = A.filter((oe) => {
                if (T) {
                  const ye = kt(oe.placement);
                  return ye === w || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ye === "y";
                }
                return !0;
              }).map((oe) => [oe.placement, oe.overflows.filter((ye) => ye > 0).reduce((ye, Xe) => ye + Xe, 0)]).sort((oe, ye) => oe[1] - ye[1])[0]) == null ? void 0 : q[0];
              Q && (ie = Q);
              break;
            }
            case "initialPlacement":
              ie = a;
              break;
          }
        if (i !== ie)
          return {
            reset: {
              placement: ie
            }
          };
      }
      return {};
    }
  };
};
function Nc(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Rc(n) {
  return xb.some((e) => n[e] >= 0);
}
const Lb = function(n) {
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
      } = Vt(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Nc(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Rc(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = Nc(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Rc(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Af = /* @__PURE__ */ new Set(["left", "top"]);
async function Fb(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Wt(t), a = wr(t), l = kt(t) === "y", c = Af.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Vt(e, n);
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
const zb = function(n) {
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
      } = e, l = await Fb(e, n);
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
}, qb = function(n) {
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
              x: w,
              y: b
            } = v;
            return {
              x: w,
              y: b
            };
          }
        },
        ...c
      } = Vt(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = kt(Wt(i)), h = pl(f);
      let p = u[h], m = u[f];
      if (o) {
        const v = h === "y" ? "top" : "left", w = h === "y" ? "bottom" : "right", b = p + d[v], S = p - d[w];
        p = ha(b, p, S);
      }
      if (a) {
        const v = f === "y" ? "top" : "left", w = f === "y" ? "bottom" : "right", b = m + d[v], S = m - d[w];
        m = ha(b, m, S);
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
}, Vb = function(n) {
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
      } = Vt(n, e), u = {
        x: t,
        y: r
      }, d = kt(i), f = pl(d);
      let h = u[f], p = u[d];
      const m = Vt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const b = f === "y" ? "height" : "width", S = s.reference[f] - s.floating[b] + g.mainAxis, C = s.reference[f] + s.reference[b] - g.mainAxis;
        h < S ? h = S : h > C && (h = C);
      }
      if (c) {
        var v, w;
        const b = f === "y" ? "width" : "height", S = Af.has(Wt(i)), C = s.reference[d] - s.floating[b] + (S && ((v = o.offset) == null ? void 0 : v[d]) || 0) + (S ? 0 : g.crossAxis), T = s.reference[d] + s.reference[b] + (S ? 0 : ((w = o.offset) == null ? void 0 : w[d]) || 0) - (S ? g.crossAxis : 0);
        p < C ? p = C : p > T && (p = T);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, Wb = function(n) {
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
      } = Vt(n, e), u = await o.detectOverflow(e, c), d = Wt(i), f = wr(i), h = kt(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, v;
      d === "top" || d === "bottom" ? (g = d, v = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (v = d, g = f === "end" ? "top" : "bottom");
      const w = m - u.top - u.bottom, b = p - u.left - u.right, S = un(m - u[g], w), C = un(p - u[v], b), T = !e.middlewareData.shift;
      let k = S, M = C;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (M = b), (r = e.middlewareData.shift) != null && r.enabled.y && (k = w), T && !f) {
        const A = it(u.left, 0), P = it(u.right, 0), $ = it(u.top, 0), q = it(u.bottom, 0);
        h ? M = p - 2 * (A !== 0 || P !== 0 ? A + P : it(u.left, u.right)) : k = m - 2 * ($ !== 0 || q !== 0 ? $ + q : it(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: M,
        availableHeight: k
      });
      const x = await o.getDimensions(a.floating);
      return p !== x.width || m !== x.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function zs() {
  return typeof window < "u";
}
function zn(n) {
  return yl(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function ot(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Dt(n) {
  var e;
  return (e = (yl(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function yl(n) {
  return zs() ? n instanceof Node || n instanceof ot(n).Node : !1;
}
function yt(n) {
  return zs() ? n instanceof Element || n instanceof ot(n).Element : !1;
}
function Et(n) {
  return zs() ? n instanceof HTMLElement || n instanceof ot(n).HTMLElement : !1;
}
function $c(n) {
  return !zs() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof ot(n).ShadowRoot;
}
const Ub = /* @__PURE__ */ new Set(["inline", "contents"]);
function Si(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = vt(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !Ub.has(i);
}
const Hb = /* @__PURE__ */ new Set(["table", "td", "th"]);
function jb(n) {
  return Hb.has(zn(n));
}
const Kb = [":popover-open", ":modal"];
function qs(n) {
  return Kb.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Jb = ["transform", "translate", "scale", "rotate", "perspective"], Xb = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Yb = ["paint", "layout", "strict", "content"];
function vl(n) {
  const e = bl(), t = yt(n) ? vt(n) : n;
  return Jb.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || Xb.some((r) => (t.willChange || "").includes(r)) || Yb.some((r) => (t.contain || "").includes(r));
}
function Gb(n) {
  let e = dn(n);
  for (; Et(e) && !ur(e); ) {
    if (vl(e))
      return e;
    if (qs(e))
      return null;
    e = dn(e);
  }
  return null;
}
function bl() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Qb = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function ur(n) {
  return Qb.has(zn(n));
}
function vt(n) {
  return ot(n).getComputedStyle(n);
}
function Vs(n) {
  return yt(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function dn(n) {
  if (zn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    $c(n) && n.host || // Fallback.
    Dt(n)
  );
  return $c(e) ? e.host : e;
}
function Of(n) {
  const e = dn(n);
  return ur(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Et(e) && Si(e) ? e : Of(e);
}
function Xr(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = Of(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = ot(i);
  if (s) {
    const a = ma(o);
    return e.concat(o, o.visualViewport || [], Si(i) ? i : [], a && t ? Xr(a) : []);
  }
  return e.concat(i, Xr(i, [], t));
}
function ma(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function _f(n) {
  const e = vt(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = Et(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = as(t) !== s || as(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function wl(n) {
  return yt(n) ? n : n.contextElement;
}
function rr(n) {
  const e = wl(n);
  if (!Et(e))
    return xt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = _f(e);
  let o = (s ? as(t.width) : t.width) / r, a = (s ? as(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Zb = /* @__PURE__ */ xt(0);
function Df(n) {
  const e = ot(n);
  return !bl() || !e.visualViewport ? Zb : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function e0(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== ot(n) ? !1 : e;
}
function Pn(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = wl(n);
  let o = xt(1);
  e && (r ? yt(r) && (o = rr(r)) : o = rr(n));
  const a = e0(s, t, r) ? Df(s) : xt(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = ot(s), h = r && yt(r) ? ot(r) : r;
    let p = f, m = ma(p);
    for (; m && r && h !== p; ) {
      const g = rr(m), v = m.getBoundingClientRect(), w = vt(m), b = v.left + (m.clientLeft + parseFloat(w.paddingLeft)) * g.x, S = v.top + (m.clientTop + parseFloat(w.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += b, c += S, p = ot(m), m = ma(p);
    }
  }
  return cs({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Ws(n, e) {
  const t = Vs(n).scrollLeft;
  return e ? e.left + t : Pn(Dt(n)).left + t;
}
function Pf(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Ws(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function t0(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Dt(r), a = e ? qs(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = xt(1);
  const u = xt(0), d = Et(r);
  if ((d || !d && !s) && ((zn(r) !== "body" || Si(o)) && (l = Vs(r)), Et(r))) {
    const h = Pn(r);
    c = rr(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? Pf(o, l) : xt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function n0(n) {
  return Array.from(n.getClientRects());
}
function r0(n) {
  const e = Dt(n), t = Vs(n), r = n.ownerDocument.body, i = it(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = it(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Ws(n);
  const a = -t.scrollTop;
  return vt(r).direction === "rtl" && (o += it(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const Bc = 25;
function i0(n, e) {
  const t = ot(n), r = Dt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = bl();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = Ws(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= Bc && (s -= p);
  } else c <= Bc && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const s0 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function o0(n, e) {
  const t = Pn(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = Et(n) ? rr(n) : xt(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Lc(n, e, t) {
  let r;
  if (e === "viewport")
    r = i0(n, t);
  else if (e === "document")
    r = r0(Dt(n));
  else if (yt(e))
    r = o0(e, t);
  else {
    const i = Df(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return cs(r);
}
function If(n, e) {
  const t = dn(n);
  return t === e || !yt(t) || ur(t) ? !1 : vt(t).position === "fixed" || If(t, e);
}
function a0(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Xr(n, [], !1).filter((a) => yt(a) && zn(a) !== "body"), i = null;
  const s = vt(n).position === "fixed";
  let o = s ? dn(n) : n;
  for (; yt(o) && !ur(o); ) {
    const a = vt(o), l = vl(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && s0.has(i.position) || Si(o) && !l && If(n, o)) ? r = r.filter((u) => u !== o) : i = a, o = dn(o);
  }
  return e.set(n, r), r;
}
function l0(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? qs(e) ? [] : a0(e, this._c) : [].concat(t), r], a = o[0], l = o.reduce((c, u) => {
    const d = Lc(e, u, i);
    return c.top = it(d.top, c.top), c.right = un(d.right, c.right), c.bottom = un(d.bottom, c.bottom), c.left = it(d.left, c.left), c;
  }, Lc(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function c0(n) {
  const {
    width: e,
    height: t
  } = _f(n);
  return {
    width: e,
    height: t
  };
}
function u0(n, e, t) {
  const r = Et(e), i = Dt(e), s = t === "fixed", o = Pn(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = xt(0);
  function c() {
    l.x = Ws(i);
  }
  if (r || !r && !s)
    if ((zn(e) !== "body" || Si(i)) && (a = Vs(e)), r) {
      const h = Pn(e, !0, s, e);
      l.x = h.x + e.clientLeft, l.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? Pf(i, a) : xt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Mo(n) {
  return vt(n).position === "static";
}
function Fc(n, e) {
  if (!Et(n) || vt(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Dt(n) === t && (t = t.ownerDocument.body), t;
}
function Nf(n, e) {
  const t = ot(n);
  if (qs(n))
    return t;
  if (!Et(n)) {
    let i = dn(n);
    for (; i && !ur(i); ) {
      if (yt(i) && !Mo(i))
        return i;
      i = dn(i);
    }
    return t;
  }
  let r = Fc(n, e);
  for (; r && jb(r) && Mo(r); )
    r = Fc(r, e);
  return r && ur(r) && Mo(r) && !vl(r) ? t : r || Gb(n) || t;
}
const d0 = async function(n) {
  const e = this.getOffsetParent || Nf, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: u0(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function f0(n) {
  return vt(n).direction === "rtl";
}
const h0 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: t0,
  getDocumentElement: Dt,
  getClippingRect: l0,
  getOffsetParent: Nf,
  getElementRects: d0,
  getClientRects: n0,
  getDimensions: c0,
  getScale: rr,
  isElement: yt,
  isRTL: f0
};
function Rf(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function p0(n, e) {
  let t = null, r;
  const i = Dt(n);
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
    const p = Di(d), m = Di(i.clientWidth - (u + f)), g = Di(i.clientHeight - (d + h)), v = Di(u), b = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -v + "px",
      threshold: it(0, un(1, l)) || 1
    };
    let S = !0;
    function C(T) {
      const k = T[0].intersectionRatio;
      if (k !== l) {
        if (!S)
          return o();
        k ? o(!1, k) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      k === 1 && !Rf(c, n.getBoundingClientRect()) && o(), S = !1;
    }
    try {
      t = new IntersectionObserver(C, {
        ...b,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(C, b);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function m0(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = wl(n), u = i || s ? [...c ? Xr(c) : [], ...Xr(e)] : [];
  u.forEach((v) => {
    i && v.addEventListener("scroll", t, {
      passive: !0
    }), s && v.addEventListener("resize", t);
  });
  const d = c && a ? p0(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((v) => {
    let [w] = v;
    w && w.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var b;
      (b = h) == null || b.observe(e);
    })), t();
  }), c && !l && h.observe(c), h.observe(e));
  let p, m = l ? Pn(n) : null;
  l && g();
  function g() {
    const v = Pn(n);
    m && !Rf(m, v) && t(), m = v, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var v;
    u.forEach((w) => {
      i && w.removeEventListener("scroll", t), s && w.removeEventListener("resize", t);
    }), d?.(), (v = h) == null || v.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const g0 = zb, y0 = qb, zc = Bb, v0 = Wb, b0 = Lb, w0 = $b, S0 = Vb, k0 = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: h0,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return Rb(n, e, {
    ...i,
    platform: s
  });
};
function x0(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function ga(n) {
  if (x0(n)) {
    const e = n.$el;
    return yl(e) && zn(e) === "#comment" ? null : e;
  }
  return n;
}
function Zn(n) {
  return typeof n == "function" ? n() : y(n);
}
function C0(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = ga(Zn(n.element));
      return t == null ? {} : w0({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function $f(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function qc(n, e) {
  const t = $f(n);
  return Math.round(e * t) / t;
}
function T0(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = O(() => {
    var k;
    return (k = Zn(t.open)) != null ? k : !0;
  }), s = O(() => Zn(t.middleware)), o = O(() => {
    var k;
    return (k = Zn(t.placement)) != null ? k : "bottom";
  }), a = O(() => {
    var k;
    return (k = Zn(t.strategy)) != null ? k : "absolute";
  }), l = O(() => {
    var k;
    return (k = Zn(t.transform)) != null ? k : !0;
  }), c = O(() => ga(n.value)), u = O(() => ga(e.value)), d = D(0), f = D(0), h = D(a.value), p = D(o.value), m = an({}), g = D(!1), v = O(() => {
    const k = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return k;
    const M = qc(u.value, d.value), x = qc(u.value, f.value);
    return l.value ? {
      ...k,
      transform: "translate(" + M + "px, " + x + "px)",
      ...$f(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: M + "px",
      top: x + "px"
    };
  });
  let w;
  function b() {
    if (c.value == null || u.value == null)
      return;
    const k = i.value;
    k0(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((M) => {
      d.value = M.x, f.value = M.y, h.value = M.strategy, p.value = M.placement, m.value = M.middlewareData, g.value = k !== !1;
    });
  }
  function S() {
    typeof w == "function" && (w(), w = void 0);
  }
  function C() {
    if (S(), r === void 0) {
      b();
      return;
    }
    if (c.value != null && u.value != null) {
      w = r(c.value, u.value, b);
      return;
    }
  }
  function T() {
    i.value || (g.value = !1);
  }
  return Z([s, o, a, i], b, {
    flush: "sync"
  }), Z([c, u], C, {
    flush: "sync"
  }), Z(i, T, {
    flush: "sync"
  }), Pd() && Id(S), {
    x: Kn(d),
    y: Kn(f),
    strategy: Kn(h),
    placement: Kn(p),
    middlewareData: Kn(m),
    isPositioned: Kn(g),
    floatingStyles: v,
    update: b
  };
}
const Bf = {
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
}, [rP, E0] = Ne("PopperContent");
var M0 = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Ld({
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
  }, { ...Bf }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Cf(), { forwardRef: s, currentElement: o } = se(), a = D(), l = D(), { width: c, height: u } = cv(l), d = O(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = O(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = O(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = O(() => ({
      padding: f.value,
      boundary: h.value.filter(Sb),
      altBoundary: h.value.length > 0
    })), m = O(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = Fy(() => [
      g0({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && zc({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && y0({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? S0() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && zc({
        ...p.value,
        ...m.value
      }),
      v0({
        ...p.value,
        apply: ({ elements: $, rects: q, availableWidth: R, availableHeight: F }) => {
          const { width: ie, height: Q } = q.reference, oe = $.floating.style;
          oe.setProperty("--reka-popper-available-width", `${R}px`), oe.setProperty("--reka-popper-available-height", `${F}px`), oe.setProperty("--reka-popper-anchor-width", `${ie}px`), oe.setProperty("--reka-popper-anchor-height", `${Q}px`);
        }
      }),
      l.value && C0({
        element: l.value,
        padding: t.arrowPadding
      }),
      kb({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && b0({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), v = O(() => t.reference ?? i.anchor.value), { floatingStyles: w, placement: b, isPositioned: S, middlewareData: C } = T0(v, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...$) => m0(...$, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), T = O(() => fa(b.value)[0]), k = O(() => fa(b.value)[1]);
    Bd(() => {
      S.value && r("placed");
    });
    const M = O(() => {
      const $ = C.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && $;
    }), x = D("");
    tt(() => {
      o.value && (x.value = window.getComputedStyle(o.value).zIndex);
    });
    const A = O(() => C.value.arrow?.x ?? 0), P = O(() => C.value.arrow?.y ?? 0);
    return E0({
      placedSide: T,
      onArrowChange: ($) => l.value = $,
      arrowX: A,
      arrowY: P,
      shouldHideArrow: M
    }), ($, q) => (E(), V("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: hn({
        ...y(w),
        transform: y(S) ? y(w).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: x.value,
        "--reka-popper-transform-origin": [y(C).transformOrigin?.x, y(C).transformOrigin?.y].join(" "),
        ...y(C).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [L(y(he), re({ ref: y(s) }, $.$attrs, {
      "as-child": t.asChild,
      as: $.as,
      "data-side": T.value,
      "data-align": k.value,
      style: { animation: y(S) ? void 0 : "none" }
    }), {
      default: _(() => [z($.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Lf = M0;
function A0(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => Nr(r, e, t)) : Nr(n, e, t);
}
function Nr(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Dn(n, e);
}
const [Ff, O0] = Ne("ListboxRoot");
var _0 = /* @__PURE__ */ B({
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
    const r = n, i = t, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = Ot(r), { getItems: d } = bt({ isProvider: !0 }), { handleTypeaheadSearch: f } = Fs(), { primitiveElement: h, currentElement: p } = is(), m = lv(), g = yi(u), v = ll(p), w = D(), b = D(!1), S = D(!0), C = /* @__PURE__ */ ln(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function T(U) {
      if (b.value = !0, r.multiple) {
        const G = Array.isArray(C.value) ? [...C.value] : [], te = G.findIndex((le) => Nr(le, U, r.by));
        r.selectionBehavior === "toggle" ? (te === -1 ? G.push(U) : G.splice(te, 1), C.value = G) : (C.value = [U], w.value = U);
      } else r.selectionBehavior === "toggle" && Nr(C.value, U, r.by) ? C.value = void 0 : C.value = U;
      setTimeout(() => {
        b.value = !1;
      }, 1);
    }
    const k = D(null), M = D(null), x = D(!1), A = D(!1), P = /* @__PURE__ */ wo(), $ = /* @__PURE__ */ wo(), q = /* @__PURE__ */ wo();
    function R() {
      return d().map((U) => U.ref).filter((U) => U.dataset.disabled !== "");
    }
    function F(U, G = !0) {
      if (!U) return;
      k.value = U, S.value && k.value.focus(), G && k.value.scrollIntoView({ block: "nearest" });
      const te = d().find((le) => le.ref === U);
      i("highlight", te);
    }
    function ie(U) {
      if (x.value) q.trigger(U);
      else {
        const G = d().find((te) => Nr(te.value, U, r.by));
        G && (k.value = G.ref, F(G.ref));
      }
    }
    function Q(U) {
      k.value && k.value.isConnected && (U.preventDefault(), U.stopPropagation(), A.value || k.value.click());
    }
    function oe(U) {
      if (S.value) {
        if (b.value = !0, x.value) $.trigger(U);
        else {
          const G = U.altKey || U.ctrlKey || U.metaKey;
          if (G && U.key === "a" && s.value) {
            const te = d(), le = te.map((wt) => wt.value);
            C.value = [...le], U.preventDefault(), F(te[te.length - 1].ref);
          } else if (!G) {
            const te = f(U.key, d());
            te && F(te);
          }
        }
        setTimeout(() => {
          b.value = !1;
        }, 1);
      }
    }
    function ye() {
      A.value = !0;
    }
    function Xe() {
      ae(() => {
        A.value = !1;
      });
    }
    function Hn() {
      ae(() => {
        const U = new KeyboardEvent("keydown", { key: "PageUp" });
        yn(U);
      });
    }
    function ht(U) {
      const G = k.value;
      G?.isConnected && (M.value = G), k.value = null, i("leave", U);
    }
    function jn(U) {
      const G = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (U.currentTarget?.dispatchEvent(G), i("entryFocus", G), !G.defaultPrevented)
        if (M.value) F(M.value);
        else {
          const te = R()?.[0];
          F(te);
        }
    }
    function yn(U) {
      const G = bf(U, a.value, g.value);
      if (!G) return;
      let te = R();
      if (k.value) {
        if (G === "last") te.reverse();
        else if (G === "prev" || G === "next") {
          G === "prev" && te.reverse();
          const le = te.indexOf(k.value);
          te = te.slice(le + 1);
        }
        mo(U, te[0]);
      }
      if (te.length) {
        const le = !k.value && G === "prev" ? te.length - 1 : 0;
        F(te[le]);
      }
      if (x.value) return $.trigger(U);
    }
    function mo(U, G) {
      if (!(x.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(C.value) || (U.altKey || U.ctrlKey || U.metaKey) && !U.shiftKey) && U.shiftKey) {
        const le = d().filter((Pt) => Pt.ref.dataset.disabled !== "");
        let wt = le.find((Pt) => Pt.ref === G)?.value;
        if (U.key === m.END ? wt = le[le.length - 1].value : U.key === m.HOME && (wt = le[0].value), !wt || !w.value) return;
        const Cr = $y(le.map((Pt) => Pt.value), w.value, wt);
        C.value = Cr;
      }
    }
    async function go(U) {
      if (await ae(), x.value) P.trigger(U);
      else {
        const G = R(), te = G.find((le) => le.dataset.state === "checked");
        te ? F(te) : G.length && F(G[0]);
      }
    }
    return Z(C, () => {
      b.value || ae(() => {
        go();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: k,
      highlightItem: ie,
      highlightFirstItem: Hn,
      highlightSelected: go,
      getItems: d
    }), O0({
      modelValue: C,
      onValueChange: T,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: k,
      isVirtual: x,
      virtualFocusHook: P,
      virtualKeydownHook: $,
      virtualHighlightHook: q,
      by: r.by,
      firstValue: w,
      selectionBehavior: c,
      focusable: S,
      onLeave: ht,
      onEnter: jn,
      changeHighlight: F,
      onKeydownEnter: Q,
      onKeydownNavigation: yn,
      onKeydownTypeAhead: oe,
      onCompositionStart: ye,
      onCompositionEnd: Xe,
      highlightFirstItem: Hn
    }), (U, G) => (E(), I(y(he), {
      ref_key: "primitiveElement",
      ref: h,
      as: U.as,
      "as-child": U.asChild,
      dir: y(g),
      "data-disabled": y(l) ? "" : void 0,
      onPointerleave: ht,
      onFocusout: G[0] || (G[0] = async (te) => {
        const le = te.relatedTarget || te.target;
        await ae(), k.value && y(p) && !y(p).contains(le) && ht(te);
      })
    }, {
      default: _(() => [z(U.$slots, "default", { modelValue: y(C) }), y(v) && U.name ? (E(), I(y(kf), {
        key: 0,
        name: U.name,
        value: y(C),
        disabled: y(l),
        required: U.required
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
}), D0 = _0, P0 = /* @__PURE__ */ B({
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
    const { CollectionSlot: e } = bt(), t = Ff(), r = rf(!1, 10);
    return (i, s) => (E(), I(y(e), null, {
      default: _(() => [L(y(he), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: y(t).focusable.value ? y(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": y(t).orientation.value,
        "aria-multiselectable": !!y(t).multiple.value,
        "data-orientation": y(t).orientation.value,
        onMousedown: s[0] || (s[0] = Ue((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          y(r) || y(t).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = Kr((o) => {
            y(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || y(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), y(t).focusable.value && y(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Kr(y(t).onKeydownEnter, ["enter"]),
          y(t).onKeydownTypeAhead
        ]
      }, {
        default: _(() => [z(i.$slots, "default")]),
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
}), I0 = P0;
const N0 = "listbox.select", [R0, $0] = Ne("ListboxItem");
var B0 = /* @__PURE__ */ B({
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
    const t = n, r = e, i = cn(void 0, "reka-listbox-item"), { CollectionItem: s } = bt(), { forwardRef: o, currentElement: a } = se(), l = Ff(), c = O(() => a.value === l.highlightedElement.value), u = O(() => A0(l.modelValue.value, t.value, l.by)), d = O(() => l.disabled.value || t.disabled);
    async function f(p) {
      r("select", p), !p?.defaultPrevented && !d.value && p && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function h(p) {
      const m = {
        originalEvent: p,
        value: t.value
      };
      Rs(N0, f, m);
    }
    return $0({ isSelected: u }), (p, m) => (E(), I(y(s), { value: p.value }, {
      default: _(() => [bg([c.value, u.value], () => L(y(he), re({ id: y(i) }, p.$attrs, {
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
        onClick: h,
        onKeydown: Kr(Ue(h, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          y(l).highlightedElement.value !== y(a) && y(l).highlightOnHover.value && !y(l).focusable.value && y(l).changeHighlight(y(a), !1);
        })
      }), {
        default: _(() => [z(p.$slots, "default")]),
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
}), L0 = B0, F0 = /* @__PURE__ */ B({
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
    se();
    const t = R0();
    return (r, i) => y(t).isSelected.value ? (E(), I(y(he), re({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: _(() => [z(r.$slots, "default")]),
      _: 3
    }, 16)) : X("v-if", !0);
  }
}), z0 = F0;
function q0(n) {
  const e = $s({ nonce: D() });
  return O(() => n?.value || e.nonce?.value);
}
var V0 = /* @__PURE__ */ B({
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
    return (t, r) => (E(), I(y(Ef), zt(Fn(e)), {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), W0 = V0;
function U0() {
  const n = D(!1);
  return me(() => {
    rs("keydown", () => {
      n.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), rs(["pointerdown", "pointermove"], () => {
      n.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), n;
}
const H0 = /* @__PURE__ */ nf(U0), [Us, j0] = Ne(["MenuRoot", "MenuSub"], "MenuContext"), [Sl, K0] = Ne("MenuRoot");
var J0 = /* @__PURE__ */ B({
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
    const t = n, r = e, { modal: i, dir: s } = Ot(t), o = yi(s), a = /* @__PURE__ */ ln(t, "open", r), l = D(), c = H0();
    return j0({
      open: a,
      onOpenChange: (u) => {
        a.value = u;
      },
      content: l,
      onContentChange: (u) => {
        l.value = u;
      }
    }), K0({
      onClose: () => {
        a.value = !1;
      },
      isUsingKeyboardRef: c,
      dir: o,
      modal: i
    }), (u, d) => (E(), I(y(Tf), null, {
      default: _(() => [z(u.$slots, "default")]),
      _: 3
    }));
  }
}), X0 = J0;
const [zf, Y0] = Ne("MenuContent");
var G0 = /* @__PURE__ */ B({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ Ld({
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
  }, { ...Bf }),
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
    const t = n, r = e, i = Us(), s = Sl(), { trapFocus: o, disableOutsidePointerEvents: a, loop: l } = Ot(t);
    af(), al(a.value);
    const c = D(""), u = D(0), d = D(0), f = D(null), h = D("right"), p = D(0), m = D(null), g = D(), { forwardRef: v, currentElement: w } = se(), { handleTypeaheadSearch: b } = Fs();
    Z(w, (x) => {
      i.onContentChange(x);
    }), Ln(() => {
      window.clearTimeout(u.value);
    });
    function S(x) {
      return h.value === f.value?.side && Rv(x, f.value?.area);
    }
    async function C(x) {
      r("openAutoFocus", x), !x.defaultPrevented && (x.preventDefault(), w.value?.focus({ preventScroll: !0 }));
    }
    function T(x) {
      if (x.defaultPrevented) return;
      const P = x.target.closest("[data-reka-menu-content]") === x.currentTarget, $ = x.ctrlKey || x.altKey || x.metaKey, q = x.key.length === 1, R = Ly(x, He(), w.value, {
        loop: l.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (R) return R?.focus();
      if (x.code === "Space") return;
      const F = g.value?.getItems() ?? [];
      if (P && (x.key === "Tab" && x.preventDefault(), !$ && q && b(x.key, F)), x.target !== w.value || !Iv.includes(x.key)) return;
      x.preventDefault();
      const ie = [...F.map((Q) => Q.ref)];
      ff.includes(x.key) && ie.reverse(), ua(ie);
    }
    function k(x) {
      x?.currentTarget?.contains?.(x.target) || (window.clearTimeout(u.value), c.value = "");
    }
    function M(x) {
      if (!da(x)) return;
      const A = x.target, P = p.value !== x.clientX;
      if (x?.currentTarget?.contains(A) && P) {
        const $ = x.clientX > p.value ? "right" : "left";
        h.value = $, p.value = x.clientX;
      }
    }
    return Y0({
      onItemEnter: (x) => !!S(x),
      onItemLeave: (x) => {
        S(x) || (w.value?.focus(), m.value = null);
      },
      onTriggerLeave: (x) => !!S(x),
      searchRef: c,
      pointerGraceTimerRef: d,
      onPointerGraceIntentChange: (x) => {
        f.value = x;
      }
    }), (x, A) => (E(), I(y(fl), {
      "as-child": "",
      trapped: y(o),
      onMountAutoFocus: C,
      onUnmountAutoFocus: A[7] || (A[7] = (P) => r("closeAutoFocus", P))
    }, {
      default: _(() => [L(y(dl), {
        "as-child": "",
        "disable-outside-pointer-events": y(a),
        onEscapeKeyDown: A[2] || (A[2] = (P) => r("escapeKeyDown", P)),
        onPointerDownOutside: A[3] || (A[3] = (P) => r("pointerDownOutside", P)),
        onFocusOutside: A[4] || (A[4] = (P) => r("focusOutside", P)),
        onInteractOutside: A[5] || (A[5] = (P) => r("interactOutside", P)),
        onDismiss: A[6] || (A[6] = (P) => r("dismiss"))
      }, {
        default: _(() => [L(y(sb), {
          ref_key: "rovingFocusGroupRef",
          ref: g,
          "current-tab-stop-id": m.value,
          "onUpdate:currentTabStopId": A[0] || (A[0] = (P) => m.value = P),
          "as-child": "",
          orientation: "vertical",
          dir: y(s).dir.value,
          loop: y(l),
          onEntryFocus: A[1] || (A[1] = (P) => {
            r("entryFocus", P), y(s).isUsingKeyboardRef.value || P.preventDefault();
          })
        }, {
          default: _(() => [L(y(Lf), {
            ref: y(v),
            role: "menu",
            as: x.as,
            "as-child": x.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": y(hf)(y(i).open.value),
            dir: y(s).dir.value,
            side: x.side,
            "side-offset": x.sideOffset,
            align: x.align,
            "align-offset": x.alignOffset,
            "avoid-collisions": x.avoidCollisions,
            "collision-boundary": x.collisionBoundary,
            "collision-padding": x.collisionPadding,
            "arrow-padding": x.arrowPadding,
            "prioritize-position": x.prioritizePosition,
            "position-strategy": x.positionStrategy,
            "update-position-strategy": x.updatePositionStrategy,
            sticky: x.sticky,
            "hide-when-detached": x.hideWhenDetached,
            reference: x.reference,
            onKeydown: T,
            onBlur: k,
            onPointermove: M
          }, {
            default: _(() => [z(x.$slots, "default")]),
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
}), qf = G0, Q0 = /* @__PURE__ */ B({
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
    const e = n, t = zf(), { forwardRef: r } = se(), { CollectionItem: i } = bt(), s = D(!1);
    async function o(l) {
      l.defaultPrevented || da(l) && (e.disabled ? t.onItemLeave(l) : t.onItemEnter(l) || l.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function a(l) {
      await ae(), !l.defaultPrevented && da(l) && t.onItemLeave(l);
    }
    return (l, c) => (E(), I(y(i), { value: { textValue: l.textValue } }, {
      default: _(() => [L(y(he), re({
        ref: y(r),
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
          await ae(), !(u.defaultPrevented || l.disabled) && (s.value = !0);
        }),
        onBlur: c[1] || (c[1] = async (u) => {
          await ae(), !u.defaultPrevented && (s.value = !1);
        })
      }), {
        default: _(() => [z(l.$slots, "default")]),
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
}), Z0 = Q0, ew = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = se(), o = Sl(), a = zf(), l = D(!1);
    async function c() {
      const u = s.value;
      if (!t.disabled && u) {
        const d = new CustomEvent(Dv, {
          bubbles: !0,
          cancelable: !0
        });
        r("select", d), await ae(), d.defaultPrevented ? l.value = !1 : o.onClose();
      }
    }
    return (u, d) => (E(), I(Z0, re(t, {
      ref: y(i),
      onClick: c,
      onPointerdown: d[0] || (d[0] = () => {
        l.value = !0;
      }),
      onPointerup: d[1] || (d[1] = async (f) => {
        await ae(), !f.defaultPrevented && (l.value || f.currentTarget?.click());
      }),
      onKeydown: d[2] || (d[2] = async (f) => {
        const h = y(a).searchRef.value !== "";
        u.disabled || h && f.key === " " || y(ca).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: _(() => [z(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), tw = ew, nw = /* @__PURE__ */ B({
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
    const t = n, r = e, i = bi(t, r), s = Us(), { forwardRef: o, currentElement: a } = se();
    return ul(a), (l, c) => (E(), I(qf, re(y(i), {
      ref: y(o),
      "trap-focus": y(s).open.value,
      "disable-outside-pointer-events": y(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: c[0] || (c[0] = (u) => y(s).onOpenChange(!1)),
      onFocusOutside: c[1] || (c[1] = Ue((u) => r("focusOutside", u), ["prevent"]))
    }), {
      default: _(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), rw = nw, iw = /* @__PURE__ */ B({
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
    const i = bi(n, e), s = Us();
    return (o, a) => (E(), I(qf, re(y(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: a[0] || (a[0] = (l) => y(s).onOpenChange(!1))
    }), {
      default: _(() => [z(o.$slots, "default")]),
      _: 3
    }, 16));
  }
}), sw = iw, ow = /* @__PURE__ */ B({
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
    const i = bi(n, e), s = Us(), o = Sl();
    return (a, l) => (E(), I(y(wi), { present: a.forceMount || y(s).open.value }, {
      default: _(() => [y(o).modal.value ? (E(), I(rw, zt(re({ key: 0 }, {
        ...a.$attrs,
        ...y(i)
      })), {
        default: _(() => [z(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), I(sw, zt(re({ key: 1 }, {
        ...a.$attrs,
        ...y(i)
      })), {
        default: _(() => [z(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), aw = ow, lw = /* @__PURE__ */ B({
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
    return (t, r) => (E(), I(y(hl), zt(Fn(e)), {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), cw = lw;
const [Vf, uw] = Ne("DropdownMenuRoot");
var dw = /* @__PURE__ */ B({
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
    se();
    const i = /* @__PURE__ */ ln(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = D(), { modal: o, dir: a } = Ot(t), l = yi(a);
    return uw({
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
    }), (c, u) => (E(), I(y(X0), {
      open: y(i),
      "onUpdate:open": u[0] || (u[0] = (d) => wg(i) ? i.value = d : null),
      dir: y(l),
      modal: y(o)
    }, {
      default: _(() => [z(c.$slots, "default", { open: y(i) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), fw = dw, hw = /* @__PURE__ */ B({
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
    const i = bi(n, e);
    se();
    const s = Vf(), o = D(!1);
    function a(l) {
      l.defaultPrevented || (o.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), o.value = !1, l.preventDefault());
    }
    return s.contentId ||= cn(void 0, "reka-dropdown-menu-content"), (l, c) => (E(), I(y(aw), re(y(i), {
      id: y(s).contentId,
      "aria-labelledby": y(s)?.triggerId,
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
        (!y(s).modal.value || h) && (o.value = !0), y(s).triggerElement.value?.contains(u.target) && u.preventDefault();
      })
    }), {
      default: _(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), pw = hw, mw = /* @__PURE__ */ B({
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
    const t = n, i = vi(e);
    return se(), (s, o) => (E(), I(y(tw), zt(Fn({
      ...t,
      ...y(i)
    })), {
      default: _(() => [z(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), gw = mw, yw = /* @__PURE__ */ B({
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
    return (t, r) => (E(), I(y(cw), zt(Fn(e)), {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), vw = yw, bw = /* @__PURE__ */ B({
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
    const e = n, t = Vf(), { forwardRef: r, currentElement: i } = se();
    return me(() => {
      t.triggerElement = i;
    }), t.triggerId ||= cn(void 0, "reka-dropdown-menu-trigger"), (s, o) => (E(), I(y(W0), { "as-child": "" }, {
      default: _(() => [L(y(he), {
        id: y(t).triggerId,
        ref: y(r),
        type: s.as === "button" ? "button" : void 0,
        "as-child": e.asChild,
        as: s.as,
        "aria-haspopup": "menu",
        "aria-expanded": y(t).open.value,
        "aria-controls": y(t).open.value ? y(t).contentId : void 0,
        "data-disabled": s.disabled ? "" : void 0,
        disabled: s.disabled,
        "data-state": y(t).open.value ? "open" : "closed",
        onClick: o[0] || (o[0] = async (a) => {
          !s.disabled && a.button === 0 && a.ctrlKey === !1 && (y(t)?.onOpenToggle(), await ae(), y(t).open.value && a.preventDefault());
        }),
        onKeydown: o[1] || (o[1] = Kr((a) => {
          s.disabled || (["Enter", " "].includes(a.key) && y(t).onOpenToggle(), a.key === "ArrowDown" && y(t).onOpenChange(!0), [
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
        default: _(() => [z(s.$slots, "default")]),
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
}), ww = bw;
const Sw = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], kw = [" ", "Enter"], pt = 10;
function us(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => ya(r, e, t)) : ya(n, e, t);
}
function ya(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Dn(n, e);
}
function xw(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Cw = {
  key: 0,
  value: ""
}, [qn, Wf] = Ne("SelectRoot");
var Tw = /* @__PURE__ */ B({
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
    const t = n, r = e, { required: i, disabled: s, multiple: o, dir: a } = Ot(t), l = /* @__PURE__ */ ln(t, "modelValue", r, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ ln(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), u = D(), d = D(), f = D({
      x: 0,
      y: 0
    }), h = O(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : cr(l.value));
    bt({ isProvider: !0 });
    const p = yi(a), m = ll(u), g = D(/* @__PURE__ */ new Set()), v = O(() => Array.from(g.value).map((S) => S.value).join(";"));
    function w(S) {
      if (o.value) {
        const C = Array.isArray(l.value) ? [...l.value] : [], T = C.findIndex((k) => ya(k, S, t.by));
        T === -1 ? C.push(S) : C.splice(T, 1), l.value = [...C];
      } else l.value = S;
    }
    function b(S) {
      return Array.from(g.value).find((C) => us(S, C.value, t.by));
    }
    return Wf({
      triggerElement: u,
      onTriggerChange: (S) => {
        u.value = S;
      },
      valueElement: d,
      onValueElementChange: (S) => {
        d.value = S;
      },
      contentId: "",
      modelValue: l,
      onValueChange: w,
      by: t.by,
      open: c,
      multiple: o,
      required: i,
      onOpenChange: (S) => {
        c.value = S;
      },
      dir: p,
      triggerPointerDownPosRef: f,
      disabled: s,
      isEmptyModelValue: h,
      optionsSet: g,
      onOptionAdd: (S) => {
        const C = b(S.value);
        C && g.value.delete(C), g.value.add(S);
      },
      onOptionRemove: (S) => {
        const C = b(S.value);
        C && g.value.delete(C);
      }
    }), (S, C) => (E(), I(y(Tf), null, {
      default: _(() => [z(S.$slots, "default", {
        modelValue: y(l),
        open: y(c)
      }), y(m) ? (E(), I(Aw, {
        key: v.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: y(o),
        required: y(i),
        name: S.name,
        autocomplete: S.autocomplete,
        disabled: y(s),
        value: y(l)
      }, {
        default: _(() => [y(cr)(y(l)) ? (E(), V("option", Cw)) : X("v-if", !0), (E(!0), V(Ie, null, _t(Array.from(g.value), (T) => (E(), V("option", re({ key: T.value ?? "" }, { ref_for: !0 }, T), null, 16))), 128))]),
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
}), Ew = Tw, Mw = /* @__PURE__ */ B({
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
    const e = n, t = D(), r = qn();
    Z(() => e.value, (s, o) => {
      const a = window.HTMLSelectElement.prototype, c = Object.getOwnPropertyDescriptor(a, "value").set;
      if (s !== o && c && t.value) {
        const u = new Event("change", { bubbles: !0 });
        c.call(t.value, s), t.value.dispatchEvent(u);
      }
    });
    function i(s) {
      r.onValueChange(s.target.value);
    }
    return (s, o) => (E(), I(y(Sf), { "as-child": "" }, {
      default: _(() => [H("select", re({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: i }), [z(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Aw = Mw, Ow = /* @__PURE__ */ B({
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
      default: pt
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
    const t = cl(n);
    return (r, i) => (E(), I(y(Lf), re(y(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: _(() => [z(r.$slots, "default")]),
      _: 3
    }, 16));
  }
}), _w = Ow;
const Dw = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Hs, Uf] = Ne("SelectContent");
var Pw = /* @__PURE__ */ B({
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
    const t = n, r = e, i = qn();
    af(), al(t.bodyLock);
    const { CollectionSlot: s, getItems: o } = bt(), a = D();
    ul(a);
    const { search: l, handleTypeaheadSearch: c } = Fs(), u = D(), d = D(), f = D(), h = D(!1), p = D(!1), m = D(!1);
    function g() {
      d.value && a.value && ua([d.value, a.value]);
    }
    Z(h, () => {
      g();
    });
    const { onOpenChange: v, triggerPointerDownPosRef: w } = i;
    tt((T) => {
      if (!a.value) return;
      let k = {
        x: 0,
        y: 0
      };
      const M = (A) => {
        k = {
          x: Math.abs(Math.round(A.pageX) - (w.value?.x ?? 0)),
          y: Math.abs(Math.round(A.pageY) - (w.value?.y ?? 0))
        };
      }, x = (A) => {
        A.pointerType !== "touch" && (k.x <= 10 && k.y <= 10 ? A.preventDefault() : a.value?.contains(A.target) || v(!1), document.removeEventListener("pointermove", M), w.value = null);
      };
      w.value !== null && (document.addEventListener("pointermove", M), document.addEventListener("pointerup", x, {
        capture: !0,
        once: !0
      })), T(() => {
        document.removeEventListener("pointermove", M), document.removeEventListener("pointerup", x, { capture: !0 });
      });
    });
    function b(T) {
      const k = T.ctrlKey || T.altKey || T.metaKey;
      if (T.key === "Tab" && T.preventDefault(), !k && T.key.length === 1 && c(T.key, o()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(T.key)) {
        let x = [...o().map((A) => A.ref)];
        if (["ArrowUp", "End"].includes(T.key) && (x = x.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(T.key)) {
          const A = T.target, P = x.indexOf(A);
          x = x.slice(P + 1);
        }
        setTimeout(() => ua(x)), T.preventDefault();
      }
    }
    const S = O(() => t.position === "popper" ? t : {}), C = cl(S.value);
    return Uf({
      content: a,
      viewport: u,
      onViewportChange: (T) => {
        u.value = T;
      },
      itemRefCallback: (T, k, M) => {
        const x = !p.value && !M, A = us(i.modelValue.value, k, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (A || x) && (d.value = T, A && (m.value = !0));
        } else (A || x) && (d.value = T);
        x && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (T, k, M) => {
        const x = !p.value && !M;
        (us(i.modelValue.value, k, i.by) || x) && (f.value = T);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: h,
      searchRef: l
    }), (T, k) => (E(), I(y(s), null, {
      default: _(() => [L(y(fl), {
        "as-child": "",
        onMountAutoFocus: k[6] || (k[6] = Ue(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: k[7] || (k[7] = (M) => {
          r("closeAutoFocus", M), !M.defaultPrevented && (y(i).triggerElement.value?.focus({ preventScroll: !0 }), M.preventDefault());
        })
      }, {
        default: _(() => [L(y(dl), {
          "as-child": "",
          "disable-outside-pointer-events": T.disableOutsidePointerEvents,
          onFocusOutside: k[2] || (k[2] = Ue(() => {
          }, ["prevent"])),
          onDismiss: k[3] || (k[3] = (M) => y(i).onOpenChange(!1)),
          onEscapeKeyDown: k[4] || (k[4] = (M) => r("escapeKeyDown", M)),
          onPointerDownOutside: k[5] || (k[5] = (M) => r("pointerDownOutside", M))
        }, {
          default: _(() => [(E(), I(Ga(T.position === "popper" ? _w : Bw), re({
            ...T.$attrs,
            ...y(C)
          }, {
            id: y(i).contentId,
            ref: (M) => {
              const x = y(Tt)(M);
              x?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = x.firstElementChild : a.value = x;
            },
            role: "listbox",
            "data-state": y(i).open.value ? "open" : "closed",
            dir: y(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: k[0] || (k[0] = Ue(() => {
            }, ["prevent"])),
            onPlaced: k[1] || (k[1] = (M) => h.value = !0),
            onKeydown: b
          }), {
            default: _(() => [z(T.$slots, "default")]),
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
}), Iw = Pw;
const [Nw, Rw] = Ne("SelectItemAlignedPosition");
var $w = /* @__PURE__ */ B({
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
    const t = n, r = e, { getItems: i } = bt(), s = qn(), o = Hs(), a = D(!1), l = D(!0), c = D(), { forwardRef: u, currentElement: d } = se(), { viewport: f, selectedItem: h, selectedItemText: p, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && h?.value && p?.value) {
        const b = s.triggerElement.value.getBoundingClientRect(), S = d.value.getBoundingClientRect(), C = s.valueElement.value.getBoundingClientRect(), T = p.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const U = T.left - S.left, G = C.left - U, te = b.left - G, le = b.width + te, wt = Math.max(le, S.width), Cr = window.innerWidth - pt, Pt = kc(G, pt, Math.max(pt, Cr - wt));
          c.value.style.minWidth = `${le}px`, c.value.style.left = `${Pt}px`;
        } else {
          const U = S.right - T.right, G = window.innerWidth - C.right - U, te = window.innerWidth - b.right - G, le = b.width + te, wt = Math.max(le, S.width), Cr = window.innerWidth - pt, Pt = kc(G, pt, Math.max(pt, Cr - wt));
          c.value.style.minWidth = `${le}px`, c.value.style.right = `${Pt}px`;
        }
        const k = i().map((U) => U.ref), M = window.innerHeight - pt * 2, x = f.value.scrollHeight, A = window.getComputedStyle(d.value), P = Number.parseInt(A.borderTopWidth, 10), $ = Number.parseInt(A.paddingTop, 10), q = Number.parseInt(A.borderBottomWidth, 10), R = Number.parseInt(A.paddingBottom, 10), F = P + $ + x + R + q, ie = Math.min(h.value.offsetHeight * 5, F), Q = window.getComputedStyle(f.value), oe = Number.parseInt(Q.paddingTop, 10), ye = Number.parseInt(Q.paddingBottom, 10), Xe = b.top + b.height / 2 - pt, Hn = M - Xe, ht = h.value.offsetHeight / 2, jn = h.value.offsetTop + ht, yn = P + $ + jn, mo = F - yn;
        if (yn <= Xe) {
          const U = h.value === k[k.length - 1];
          c.value.style.bottom = "0px";
          const G = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, te = Math.max(Hn, ht + (U ? ye : 0) + G + q), le = yn + te;
          c.value.style.height = `${le}px`;
        } else {
          const U = h.value === k[0];
          c.value.style.top = "0px";
          const te = Math.max(Xe, P + f.value.offsetTop + (U ? oe : 0) + ht) + mo;
          c.value.style.height = `${te}px`, f.value.scrollTop = yn - Xe + f.value.offsetTop;
        }
        c.value.style.margin = `${pt}px 0`, c.value.style.minHeight = `${ie}px`, c.value.style.maxHeight = `${M}px`, r("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const v = D("");
    me(async () => {
      await ae(), g(), d.value && (v.value = window.getComputedStyle(d.value).zIndex);
    });
    function w(b) {
      b && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return Qy(s.triggerElement, () => {
      g();
    }), Rw({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: w
    }), (b, S) => (E(), V("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: hn({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: v.value
      })
    }, [L(y(he), re({
      ref: y(u),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...b.$attrs,
      ...t
    }), {
      default: _(() => [z(b.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Bw = $w, Lw = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Wf(n.context), Uf(Dw), (t, r) => z(t.$slots, "default");
  }
}), Fw = Lw;
const zw = { key: 1 };
var qw = /* @__PURE__ */ B({
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
    const t = n, i = bi(t, e), s = qn(), o = D();
    me(() => {
      o.value = new DocumentFragment();
    });
    const a = D(), l = O(() => t.forceMount || s.open.value), c = D(l.value);
    return Z(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (E(), I(y(wi), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: _(() => [L(Iw, zt(Fn({
        ...y(i),
        ...u.$attrs
      })), {
        default: _(() => [z(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (E(), V("div", zw, [(E(), I($d, { to: o.value }, [L(Fw, { context: y(s) }, {
      default: _(() => [z(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : X("v-if", !0);
  }
}), Vw = qw, Ww = /* @__PURE__ */ B({
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
    return (e, t) => (E(), I(y(he), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: _(() => [z(e.$slots, "default", {}, () => [t[0] || (t[0] = pe("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Uw = Ww;
const [Hf, Hw] = Ne("SelectItem");
var jw = /* @__PURE__ */ B({
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
    const t = n, r = e, { disabled: i } = Ot(t), s = qn(), o = Hs(), { forwardRef: a, currentElement: l } = se(), { CollectionItem: c } = bt(), u = O(() => us(s.modelValue?.value, t.value, s.by)), d = D(!1), f = D(t.textValue ?? ""), h = cn(void 0, "reka-select-item-text"), p = "select.select";
    async function m(S) {
      if (S.defaultPrevented) return;
      const C = {
        originalEvent: S,
        value: t.value
      };
      Rs(p, g, C);
    }
    async function g(S) {
      await ae(), r("select", S), !S.defaultPrevented && (i.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function v(S) {
      await ae(), !S.defaultPrevented && (i.value ? o.onItemLeave?.() : S.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function w(S) {
      await ae(), !S.defaultPrevented && S.currentTarget === He() && o.onItemLeave?.();
    }
    async function b(S) {
      await ae(), !(S.defaultPrevented || o.searchRef?.value !== "" && S.key === " ") && (kw.includes(S.key) && m(S), S.key === " " && S.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return me(() => {
      l.value && o.itemRefCallback(l.value, t.value, t.disabled);
    }), Hw({
      value: t.value,
      disabled: i,
      textId: h,
      isSelected: u,
      onItemTextChange: (S) => {
        f.value = ((f.value || S?.textContent) ?? "").trim();
      }
    }), (S, C) => (E(), I(y(c), { value: { textValue: f.value } }, {
      default: _(() => [L(y(he), {
        ref: y(a),
        role: "option",
        "aria-labelledby": y(h),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": u.value,
        "data-state": u.value ? "checked" : "unchecked",
        "aria-disabled": y(i) || void 0,
        "data-disabled": y(i) ? "" : void 0,
        tabindex: y(i) ? void 0 : -1,
        as: S.as,
        "as-child": S.asChild,
        onFocus: C[0] || (C[0] = (T) => d.value = !0),
        onBlur: C[1] || (C[1] = (T) => d.value = !1),
        onPointerup: m,
        onPointerdown: C[2] || (C[2] = (T) => {
          T.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: C[3] || (C[3] = Ue(() => {
        }, ["prevent", "stop"])),
        onPointermove: v,
        onPointerleave: w,
        onKeydown: b
      }, {
        default: _(() => [z(S.$slots, "default")]),
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
}), Kw = jw, Jw = /* @__PURE__ */ B({
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
    const e = n, t = Hf();
    return (r, i) => y(t).isSelected.value ? (E(), I(y(he), re({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: _(() => [z(r.$slots, "default")]),
      _: 3
    }, 16)) : X("v-if", !0);
  }
}), Xw = Jw, Yw = /* @__PURE__ */ B({
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
    const e = n, t = qn(), r = Hs(), i = Hf(), { forwardRef: s, currentElement: o } = se(), a = O(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return me(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), t.onOptionAdd(a.value));
    }), Ln(() => {
      t.onOptionRemove(a.value);
    }), (l, c) => (E(), I(y(he), re({
      id: y(i).textId,
      ref: y(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: _(() => [z(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Gw = Yw, Qw = /* @__PURE__ */ B({
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
    return (t, r) => (E(), I(y(hl), zt(Fn(e)), {
      default: _(() => [z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Zw = Qw, eS = /* @__PURE__ */ B({
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
    const e = n, t = qn(), { forwardRef: r, currentElement: i } = se(), s = O(() => t.disabled?.value || e.disabled);
    t.contentId ||= cn(void 0, "reka-select-content"), me(() => {
      t.onTriggerChange(i.value);
    });
    const { getItems: o } = bt(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = Fs();
    function u() {
      s.value || (t.onOpenChange(!0), c());
    }
    function d(f) {
      u(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, h) => (E(), I(y(Ef), {
      "as-child": "",
      reference: f.reference
    }, {
      default: _(() => [L(y(he), {
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
        "data-placeholder": y(xw)(y(t).modelValue?.value) ? "" : void 0,
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
        onPointerup: h[2] || (h[2] = Ue((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: h[3] || (h[3] = (p) => {
          const m = y(a) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && m && p.key === " " || (y(l)(p.key, y(o)()), y(Sw).includes(p.key) && (u(), p.preventDefault()));
        })
      }, {
        default: _(() => [z(f.$slots, "default")]),
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
}), tS = eS, nS = /* @__PURE__ */ B({
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
    const e = n, { nonce: t } = Ot(e), r = q0(t), i = Hs(), s = i.position === "item-aligned" ? Nw() : void 0, { forwardRef: o, currentElement: a } = se();
    me(() => {
      i?.onViewportChange(a.value);
    });
    const l = D(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: h } = s ?? {};
      if (f?.value && h?.value) {
        const p = Math.abs(l.value - d.scrollTop);
        if (p > 0) {
          const m = window.innerHeight - pt * 2, g = Number.parseFloat(h.value.style.minHeight), v = Number.parseFloat(h.value.style.height), w = Math.max(g, v);
          if (w < m) {
            const b = w + p, S = Math.min(m, b), C = b - S;
            h.value.style.height = `${S}px`, h.value.style.bottom === "0px" && (d.scrollTop = C > 0 ? C : 0, h.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (E(), V(Ie, null, [L(y(he), re({
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
      default: _(() => [z(u.$slots, "default")]),
      _: 3
    }, 16), L(y(he), {
      as: "style",
      nonce: y(r)
    }, {
      default: _(() => d[0] || (d[0] = [pe(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), rS = nS;
const iS = /* @__PURE__ */ B({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (E(), I(y(mb), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = Ue(() => {
      }, ["stop"]))
    }, {
      default: _(() => [
        L(y(yb), { class: "checkbox-indicator" }, {
          default: _(() => [
            L(y(Ns), {
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
}), sS = /* @__PURE__ */ de(iS, [["__scopeId", "data-v-024ee78b"]]), jf = /* @__PURE__ */ Symbol("turnSelection");
function Vc(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function oS(n, e, t) {
  const r = Is(/* @__PURE__ */ new Map());
  let i = null;
  const s = O(() => r.size), o = O(() => r.size > 0);
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
    const w = n.value.map((k) => k.id), b = w.indexOf(i), S = w.indexOf(v);
    if (b === -1 || S === -1) {
      l(v);
      return;
    }
    const C = Math.min(b, S), T = Math.max(b, S);
    for (let k = C; k <= T; k++) {
      const M = w[k];
      M != null && r.set(M, !0);
    }
  }
  function u() {
    r.clear(), i = null;
  }
  async function d() {
    const w = n.value.filter((b) => r.has(b.id)).map(Vc).join(`

`);
    await navigator.clipboard.writeText(w);
  }
  async function f() {
    const w = n.value.filter((b) => r.has(b.id)).map((b) => {
      const C = (b.speakerId ? e.get(b.speakerId) : void 0)?.name ?? "", T = b.startTime != null ? Jr(b.startTime) : "", k = [C, T].filter(Boolean).join(" (") + (T ? ")" : ""), M = Vc(b);
      return k ? `${k}
${M}` : M;
    });
    await navigator.clipboard.writeText(w.join(`

`));
  }
  Z(
    () => n.value,
    (v) => {
      if (r.size === 0) return;
      const w = new Set(v.map((b) => b.id));
      for (const b of [...r.keys()])
        w.has(b) || r.delete(b);
    }
  );
  const h = t.on("channel:change", u), p = t.on("translation:change", u);
  function m(v) {
    v.key === "Escape" && r.size > 0 && u();
  }
  me(() => {
    document.addEventListener("keydown", m);
  }), Ht(() => {
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
  return _n(jf, g), g;
}
function Kf() {
  const n = gi(jf);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const aS = ["data-turn-active", "aria-selected"], lS = { class: "turn-text" }, cS = ["data-word-active"], uS = /* @__PURE__ */ B({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = ft(), r = Kf(), { t: i } = Fe(), s = O(() => e.turn.words.length > 0), o = O(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const h = t.audio.currentTime.value, { startTime: p, endTime: m, words: g } = e.turn;
      return p == null || m == null || h < p || h > m ? null : zd(g, h);
    }), a = O(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || rl(e.turn.words)) return !1;
      const h = t.audio.currentTime.value;
      return h >= e.turn.startTime && h <= e.turn.endTime;
    }), l = O(() => e.speaker?.color ?? "transparent"), c = O(() => r.isSelected(e.turn.id)), u = O(() => {
      const h = e.speaker?.name ?? "", p = c.value ? "selection.deselect" : "selection.select";
      return i(p).replace("{name}", h);
    });
    function d(h) {
      h.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    function f(h) {
      h.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    return (h, p) => (E(), V("section", {
      class: gt(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: hn({ "--speaker-color": l.value }),
      "aria-selected": y(r).hasSelection.value ? c.value : void 0
    }, [
      n.partial ? X("", !0) : (E(), V("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        y(r).hasSelection.value ? (E(), I(sS, {
          key: 0,
          "model-value": c.value,
          "aria-label": u.value,
          onClick: Ue(f, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : X("", !0),
        L(oa, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      H("p", lS, [
        s.value ? (E(!0), V(Ie, { key: 0 }, _t(n.turn.words, (m, g) => (E(), V(Ie, {
          key: m.id
        }, [
          H("span", {
            class: gt({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, J(m.text), 11, cS),
          pe(J(g < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), V(Ie, { key: 1 }, [
          pe(J(n.turn.text), 1)
        ], 64)) : X("", !0)
      ])
    ], 14, aS));
  }
}), Wc = /* @__PURE__ */ de(uS, [["__scopeId", "data-v-e96e61a0"]]), dS = {}, fS = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function hS(n, e) {
  return E(), V("svg", fS, [...e[0] || (e[0] = [
    Sg('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const pS = /* @__PURE__ */ de(dS, [["render", hS]]), mS = { class: "transcription-empty" }, gS = { class: "message" }, yS = /* @__PURE__ */ B({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = Fe();
    return (t, r) => (E(), V("div", mS, [
      L(pS, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      H("p", gS, J(y(e)("transcription.empty")), 1)
    ]));
  }
}), vS = /* @__PURE__ */ de(yS, [["__scopeId", "data-v-f82737e5"]]), bS = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function wS(n) {
  const e = ft(), t = D(!0), r = window.matchMedia(
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
    bS.has(u.key) && s();
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
  }), Ht(() => {
    l(s);
  });
  function c() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: c };
}
function Me(n) {
  this.content = n;
}
Me.prototype = {
  constructor: Me,
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
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new Me(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new Me(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new Me([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new Me(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new Me(i);
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
    return n = Me.from(n), n.size ? new Me(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = Me.from(n), n.size ? new Me(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = Me.from(n);
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
Me.from = function(n) {
  if (n instanceof Me) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new Me(e);
};
function Jf(n, e, t) {
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
      let o = Jf(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function Xf(n, e, t, r) {
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
      let c = Xf(o.content, a.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= l, r -= l;
  }
}
class N {
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
    return new N(i, this.size + e.size);
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
    return new N(r, i);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? N.empty : e == 0 && t == this.content.length ? this : new N(this.content.slice(e, t));
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
    return i[e] = t, new N(i, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new N([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new N(this.content.concat(e), this.size + e.nodeSize);
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
    return Jf(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Xf(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Pi(0, e);
    if (e == this.size)
      return Pi(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? Pi(t + 1, s) : Pi(t, r);
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
      return N.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new N(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return N.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new N(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return N.empty;
    if (e instanceof N)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new N([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
N.empty = new N([], 0);
const Ao = { index: 0, offset: 0 };
function Pi(n, e) {
  return Ao.index = n, Ao.offset = e, Ao;
}
function ds(n, e) {
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
      if (!ds(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !ds(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let ue = class va {
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
    return this == e || this.type == e.type && ds(this.attrs, e.attrs);
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
      return va.none;
    if (e instanceof va)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
ue.none = [];
class fs extends Error {
}
class W {
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
    let r = Gf(this.content, e + this.openStart, t);
    return r && new W(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new W(Yf(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return W.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new W(N.fromJSON(e, t.content), r, i);
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
    return new W(e, r, i);
  }
}
W.empty = new W(N.empty, 0, 0);
function Yf(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: a } = n.findIndex(t);
  if (i == e || s.isText) {
    if (a != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Yf(s.content, e - i - 1, t - i - 1)));
}
function Gf(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = Gf(o.content, e - s - 1, t, o);
  return a && n.replaceChild(i, o.copy(a));
}
function SS(n, e, t) {
  if (t.openStart > n.depth)
    throw new fs("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new fs("Inconsistent open depths");
  return Qf(n, e, t, 0);
}
function Qf(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = Qf(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, a = o.content;
      return Tn(o, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: o, end: a } = kS(t, n);
      return Tn(s, eh(n, o, a, e, r));
    }
  else return Tn(s, hs(n, e, r));
}
function Zf(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new fs("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ba(n, e, t) {
  let r = n.node(t);
  return Zf(r, e.node(t)), r;
}
function Cn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Rr(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (Cn(n.nodeAfter, r), s++));
  for (let a = s; a < o; a++)
    Cn(i.child(a), r);
  e && e.depth == t && e.textOffset && Cn(e.nodeBefore, r);
}
function Tn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function eh(n, e, t, r, i) {
  let s = n.depth > i && ba(n, e, i + 1), o = r.depth > i && ba(t, r, i + 1), a = [];
  return Rr(null, n, i, a), s && o && e.index(i) == t.index(i) ? (Zf(s, o), Cn(Tn(s, eh(n, e, t, r, i + 1)), a)) : (s && Cn(Tn(s, hs(n, e, i + 1)), a), Rr(e, t, i, a), o && Cn(Tn(o, hs(t, r, i + 1)), a)), Rr(r, null, i, a), new N(a);
}
function hs(n, e, t) {
  let r = [];
  if (Rr(null, n, t, r), n.depth > t) {
    let i = ba(n, e, t + 1);
    Cn(Tn(i, hs(n, e, t + 1)), r);
  }
  return Rr(e, null, t, r), new N(r);
}
function kS(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(N.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Yr {
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
      return ue.none;
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
        return new ps(this, e, r);
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
    return new Yr(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Uc.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      Uc.set(e, r = new xS());
    let i = r.elts[r.i] = Yr.resolve(e, t);
    return r.i = (r.i + 1) % CS, i;
  }
}
class xS {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const CS = 12, Uc = /* @__PURE__ */ new WeakMap();
class ps {
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
const TS = /* @__PURE__ */ Object.create(null);
let $t = class wa {
  /**
  @internal
  */
  constructor(e, t, r, i = ue.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || N.empty;
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
    return this.type == e && ds(this.attrs, t || e.defaultAttrs || TS) && ue.sameSet(this.marks, r || ue.none);
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
      return W.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), a = i.start(o), c = i.node(o).content.cut(i.pos - a, s.pos - a);
    return new W(c, i.depth - o, s.depth - o);
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
    return SS(this.resolve(e), this.resolve(t), r);
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
    return Yr.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Yr.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), th(this.marks, e);
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
  canReplace(e, t, r = N.empty, i = 0, s = r.childCount) {
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
    let e = ue.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!ue.sameSet(e, this.marks))
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
    let i = N.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
$t.prototype.text = void 0;
class ms extends $t {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : th(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new ms(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new ms(this.type, this.attrs, e, this.marks);
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
function th(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class In {
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
    let r = new ES(e, t);
    if (r.next == null)
      return In.empty;
    let i = nh(r);
    r.next && r.err("Unexpected trailing text");
    let s = IS(PS(i));
    return NS(s, r), s;
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
        return N.from(a.map((c) => c.createAndFill()));
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
In.empty = new In(!0);
class ES {
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
function nh(n) {
  let e = [];
  do
    e.push(MS(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function MS(n) {
  let e = [];
  do
    e.push(AS(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function AS(n) {
  let e = DS(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = OS(n, e);
    else
      break;
  return e;
}
function Hc(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function OS(n, e) {
  let t = Hc(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Hc(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function _S(n, e) {
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
function DS(n) {
  if (n.eat("(")) {
    let e = nh(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = _S(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function PS(n) {
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
function rh(n, e) {
  return e - n;
}
function jc(n, e) {
  let t = [];
  return r(e), t.sort(rh);
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
function IS(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(jc(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        jc(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new In(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let a = i[o][1].sort(rh);
      s.next.push({ type: i[o][0], next: e[a.join(",")] || t(a) });
    }
    return s;
  }
}
function NS(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      o.push(l.name), s && !(l.isText || l.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function ih(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function sh(n, e) {
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
function oh(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function ah(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new $S(n, r, e[r]);
  return t;
}
let Kc = class lh {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = ah(e, r.attrs), this.defaultAttrs = ih(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == In.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : sh(this.attrs, e);
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
    return new $t(this, this.computeAttrs(e), N.from(t), ue.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = N.from(t), this.checkContent(t), new $t(this, this.computeAttrs(e), t, ue.setFrom(r));
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
    if (e = this.computeAttrs(e), t = N.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(N.empty, !0);
    return s ? new $t(this, e, t.append(s), ue.setFrom(r)) : null;
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
    oh(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : ue.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new lh(s, t, o));
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
function RS(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class $S {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? RS(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class js {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = ah(e, i.attrs), this.excluded = null;
    let s = ih(this.attrs);
    this.instance = s ? new ue(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new ue(this, sh(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new js(s, i++, t, o)), r;
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
    oh(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let ch = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = Me.from(e.nodes), t.marks = Me.from(e.marks || {}), this.nodes = Kc.compile(this.spec.nodes, this), this.marks = js.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", a = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = In.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = a == "_" ? null : a ? Jc(this, a.split(" ")) : a == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : Jc(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => $t.fromJSON(this, i), this.markFromJSON = (i) => ue.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof Kc) {
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
    return new ms(r, r.defaultAttrs, e, ue.setFrom(t));
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
function Jc(n, e) {
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
function BS(n) {
  return n.tag != null;
}
function LS(n) {
  return n.style != null;
}
let $r = class Sa {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (BS(i))
        this.tags.push(i);
      else if (LS(i)) {
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
    let r = new Yc(this, t, !1);
    return r.addAll(e, ue.none, t.from, t.to), r.finish();
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
    let r = new Yc(this, t, !0);
    return r.addAll(e, ue.none, t.from, t.to), W.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (qS(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(o = Gc(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Gc(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new Sa(e, Sa.schemaRules(e)));
  }
};
const uh = {
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
}, FS = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, dh = { ol: !0, ul: !0 }, Gr = 1, ka = 2, Br = 4;
function Xc(n, e, t) {
  return e != null ? (e ? Gr : 0) | (e === "full" ? ka : 0) : n && n.whitespace == "pre" ? Gr | ka : t & ~Br;
}
class Ii {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = ue.none, this.match = s || (o & Br ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(N.from(e));
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
    if (!(this.options & Gr)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = N.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(N.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !uh.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Yc {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = Xc(null, t.preserveWhitespace, 0) | (r ? Br : 0);
    i ? s = new Ii(i.type, i.attrs, ue.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new Ii(null, null, ue.none, !0, null, o) : s = new Ii(e.schema.topNodeType, null, ue.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & ka ? "full" : this.localPreserveWS || (i.options & Gr) > 0, { schema: o } = this.parser;
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
    dh.hasOwnProperty(o) && this.parser.normalizeLists && zS(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : FS.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, u = this.needsBlock;
      if (uh.hasOwnProperty(o))
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
      let o = ue.none;
      for (let a of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(a.type) : Qc(a.type, e.type)) && (o = a.addToSet(o));
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
    let a = Xc(e, s, o.options);
    o.options & Br && o.content.length == 0 && (a |= Br);
    let l = ue.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : Qc(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new Ii(e, t, l, i, null, a)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Gr);
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
function zS(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && dh.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function qS(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Gc(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Qc(n, e) {
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
class Vn {
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
    r || (r = Oo(t).createDocumentFragment());
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
    let { dom: r, contentDOM: i } = Hi(Oo(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && Hi(Oo(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Hi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Vn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Zc(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Zc(e.marks);
  }
}
function Zc(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Oo(n) {
  return n.document || window.document;
}
const eu = /* @__PURE__ */ new WeakMap();
function VS(n) {
  let e = eu.get(n);
  return e === void 0 && eu.set(n, e = WS(n)), e;
}
function WS(n) {
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
  if (r && (s = VS(r)) && s.indexOf(e) > -1)
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
const fh = 65535, hh = Math.pow(2, 16);
function US(n, e) {
  return n + e * hh;
}
function tu(n) {
  return n & fh;
}
function HS(n) {
  return (n - (n & fh)) / hh;
}
const ph = 1, mh = 2, ji = 4, gh = 8;
class xa {
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
    return (this.delInfo & gh) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (ph | ji)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (mh | ji)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & ji) > 0;
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
    let t = 0, r = tu(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + HS(e);
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
        let p = e == (t < 0 ? l : d) ? null : US(a / 3, e - l), m = e == l ? mh : e == d ? ph : ji;
        return (t < 0 ? e != l : e != d) && (m |= gh), new xa(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new xa(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = tu(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
class gs {
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
    return new gs(this._maps, this.mirror, e, t);
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
    let e = new gs();
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
    return r ? e : new xa(e, i, null);
  }
}
const _o = /* @__PURE__ */ Object.create(null);
class ze {
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
    let r = _o[t.stepType];
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
    if (e in _o)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return _o[e] = t, t.prototype.jsonID = e, t;
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
      if (s instanceof fs)
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
  return N.fromArray(r);
}
class Zt extends ze {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new W(kl(t.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return be.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new mt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Zt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Zt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Zt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Zt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ze.jsonID("addMark", Zt);
class mt extends ze {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new W(kl(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return be.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Zt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new mt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof mt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new mt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new mt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ze.jsonID("removeMark", mt);
class en extends ze {
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
    return be.fromReplace(e, this.pos, this.pos + 1, new W(N.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new en(this.pos, t.marks[i]);
        return new en(this.pos, this.mark);
      }
    }
    return new Nn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new en(t.pos, this.mark);
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
    return new en(t.pos, e.markFromJSON(t.mark));
  }
}
ze.jsonID("addNodeMark", en);
class Nn extends ze {
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
    return be.fromReplace(e, this.pos, this.pos + 1, new W(N.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new en(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Nn(t.pos, this.mark);
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
    return new Nn(t.pos, e.markFromJSON(t.mark));
  }
}
ze.jsonID("removeNodeMark", Nn);
class ke extends ze {
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
    return this.structure && Ca(e, this.from, this.to) ? be.fail("Structure replace would overwrite content") : be.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new st([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new ke(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new ke(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof ke) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? W.empty : new W(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new ke(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? W.empty : new W(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new ke(e.from, this.to, t, this.structure);
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
    return new ke(t.from, t.to, W.fromJSON(e, t.slice), !!t.structure);
  }
}
ze.jsonID("replace", ke);
class Ce extends ze {
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
    if (this.structure && (Ca(e, this.from, this.gapFrom) || Ca(e, this.gapTo, this.to)))
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
    return new Ce(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = this.from == this.gapFrom ? t.pos : e.map(this.gapFrom, -1), s = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new Ce(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
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
    return new Ce(t.from, t.to, t.gapFrom, t.gapTo, W.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
ze.jsonID("replaceAround", Ce);
function Ca(n, e, t) {
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
function jS(n, e, t, r) {
  let i = [], s = [], o, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + l.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new mt(f, h, d[m])));
      a && a.to == f ? a.to = h : s.push(a = new Zt(f, h, r));
    }
  }), i.forEach((l) => n.step(l)), s.forEach((l) => n.step(l));
}
function KS(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof js) {
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
  }), i.forEach((o) => n.step(new mt(o.from, o.to, o.style)));
}
function xl(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], a = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let c = s.child(l), u = a + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new ke(a, u, W.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new mt(a, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new W(N.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new ke(a + f.index, a + f.index + f[0].length, p));
      }
    }
    a = u;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(N.empty, !0);
    n.replace(a, a, new W(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    n.step(o[l]);
}
function JS(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Sr(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), a = n.$from.index(r) + i, l = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(a, l, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !JS(o, a, l))
      break;
    a && (i = 1), l < o.childCount && (s = 1);
  }
  return null;
}
function XS(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, u = N.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = N.from(r.node(p).copy(u)), d++) : l--;
  let f = N.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = N.from(i.node(p).copy(f)), h++) : c++;
  n.step(new Ce(l, c, o, a, new W(u.append(f), d, h), u.size - d, !0));
}
function yh(n, e, t = null, r = n) {
  let i = YS(n, e), s = i && GS(r, e);
  return s ? i.map(nu).concat({ type: e, attrs: t }).concat(s.map(nu)) : null;
}
function nu(n) {
  return { type: n, attrs: null };
}
function YS(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function GS(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function QS(n, e, t) {
  let r = N.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let a = t[o].type.contentMatch.matchFragment(r);
      if (!a || !a.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = N.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new Ce(i, s, i, s, new W(r, 0, 0), t.length, !0));
}
function ZS(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, a) => {
    let l = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, l) && ek(n.doc, n.mapping.slice(s).map(a), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && bh(n, o, a, s), xl(n, n.mapping.slice(s).map(a, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(a, 1), f = u.map(a + o.nodeSize, 1);
      return n.step(new Ce(d, f, d + 1, f - 1, new W(N.from(r.create(l, null, o.marks)), 0, 0), 1, !0)), c === !0 && vh(n, o, a, s), !1;
    }
  });
}
function vh(n, e, t, r) {
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
function bh(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function ek(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function tk(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new Ce(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new W(N.from(o), 0, 0), 1, !0));
}
function Bt(n, e, t = 1, r) {
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
function nk(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = N.empty, o = N.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    s = N.from(i.node(a).copy(s));
    let u = r && r[c];
    o = N.from(u ? u.type.create(u.attrs, o) : i.node(a).copy(o));
  }
  n.step(new ke(e, e, new W(s.append(o), t, t), !0));
}
function Wn(n, e) {
  let t = n.resolve(e), r = t.index();
  return wh(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function rk(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function wh(n, e) {
  return !!(n && e && !n.isLeaf && rk(n, e));
}
function Ks(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && wh(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function ik(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let a = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    bh(n, u.node(), u.before(), a);
  }
  o.inlineContent && xl(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let l = n.mapping.slice(a), c = l.map(e - t);
  if (n.step(new ke(c, l.map(e + t, -1), W.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    vh(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function sk(n, e, t) {
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
function ok(n, e, t) {
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
function Js(n, e, t = e, r = W.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Sh(i, s, r) ? new ke(e, t, r) : new ak(i, s, r).fit();
}
function Sh(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class ak {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = N.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = N.from(e.node(i).copy(this.placed));
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
    let l = new W(s, o, a);
    return e > -1 ? new Ce(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new ke(r.pos, i.pos, l) : null;
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
        r ? (s = Do(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
        let o = i.firstChild;
        for (let a = this.depth; a >= 0; a--) {
          let { type: l, match: c } = this.frontier[a], u, d = null;
          if (t == 1 && (o ? c.matchType(o.type) || (d = c.fillBefore(N.from(o), !1)) : s && l.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, inject: d };
          if (t == 2 && o && (u = c.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: a, parent: s, wrap: u };
          if (s && c.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Do(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new W(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Do(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new W(Ar(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new W(Ar(e, t, 1), t, r);
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
      c++, (c > 1 || l == 0 || m.content.size) && (d = g, u.push(kh(m.mark(f.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? h : -1)));
    }
    let p = c == a.childCount;
    p || (h = -1), this.placed = Or(this.placed, t, N.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = a; m < h; m++) {
      let v = g.lastChild;
      this.frontier.push({ type: v.type, match: v.contentMatchAt(v.childCount) }), g = v.content;
    }
    this.unplaced = p ? e == 0 ? W.empty : new W(Ar(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new W(Ar(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Po(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Po(e, t, i, r, s);
      if (o) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], u = Po(e, a, c, l, !0);
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
    i.match = i.match.matchType(e), this.placed = Or(this.placed, this.depth, N.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(N.empty, !0);
    t.childCount && (this.placed = Or(this.placed, this.frontier.length, t));
  }
}
function Ar(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Ar(n.firstChild.content, e - 1, t)));
}
function Or(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Or(n.lastChild.content, e - 1, t)));
}
function Do(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function kh(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, kh(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(N.empty, !0)))), n.copy(r);
}
function Po(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !lk(t, s.content, o) ? a : null;
}
function lk(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function ck(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function uk(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Sh(i, s, r))
    return n.step(new ke(e, t, r));
  let o = Ch(i, s);
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
    let h = c[f], p = ck(h.type);
    if (p && !h.sameMarkup(i.node(Math.abs(a) - 1)))
      u = f;
    else if (p || !h.type.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let h = (f + u + 1) % (r.openStart + 1), p = c[h];
    if (p)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + l) % o.length], v = !0;
        g < 0 && (v = !1, g = -g);
        let w = i.node(g - 1), b = i.index(g - 1);
        if (w.canReplaceWith(b, b, p.type, p.marks))
          return n.replace(i.before(g), v ? s.after(g) : t, new W(xh(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function xh(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(xh(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(N.empty, !0));
  }
  return n;
}
function dk(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = sk(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new W(N.from(r), 0, 0));
}
function fk(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Ch(r, i);
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
function Ch(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class ir extends ze {
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
    return be.fromReplace(e, this.pos, this.pos + 1, new W(N.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return st.empty;
  }
  invert(e) {
    return new ir(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new ir(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new ir(t.pos, t.attr, t.value);
  }
}
ze.jsonID("attr", ir);
class Qr extends ze {
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
    return new Qr(this.attr, e.attrs[this.attr]);
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
    return new Qr(t.attr, t.value);
  }
}
ze.jsonID("docAttr", Qr);
let dr = class extends Error {
};
dr = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
dr.prototype = Object.create(Error.prototype);
dr.prototype.constructor = dr;
dr.prototype.name = "TransformError";
class Th {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new gs();
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
      throw new dr(t.failed);
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
  replace(e, t = e, r = W.empty) {
    let i = Js(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new W(N.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, W.empty);
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
    return uk(this, e, t, r), this;
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
    return dk(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return fk(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return XS(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return ik(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return QS(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return ZS(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return tk(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new ir(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Qr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new en(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof ue)
      t.isInSet(r.marks) && this.step(new Nn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new Nn(e, s)), i = s.removeFromSet(i);
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
    return nk(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return jS(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return KS(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return xl(this, e, t, r), this;
  }
}
const Io = /* @__PURE__ */ Object.create(null);
class ne {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new hk(e.min(t), e.max(t))];
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
  replace(e, t = W.empty) {
    let r = t.content.lastChild, i = null;
    for (let a = 0; a < t.openEnd; a++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let a = 0; a < o.length; a++) {
      let { $from: l, $to: c } = o[a], u = e.mapping.slice(s);
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? W.empty : t), a == 0 && su(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), su(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new ee(e) : er(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? er(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : er(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Ze(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return er(e, e, 0, 0, 1) || new Ze(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return er(e, e, e.content.size, e.childCount, -1) || new Ze(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Io[t.type];
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
    if (e in Io)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Io[e] = t, t.prototype.jsonID = e, t;
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
    return ee.between(this.$anchor, this.$head).getBookmark();
  }
}
ne.prototype.visible = !0;
class hk {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let ru = !1;
function iu(n) {
  !ru && !n.parent.inlineContent && (ru = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class ee extends ne {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    iu(e), iu(t), super(e, t);
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
    return new ee(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = W.empty) {
    if (super.replace(e, t), t == W.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof ee && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Xs(this.anchor, this.head);
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
    return new ee(e.resolve(t.anchor), e.resolve(t.head));
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
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (ne.findFrom(e, -r, !0) || ne.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new ee(e, t);
  }
}
ne.jsonID("text", ee);
class Xs {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Xs(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return ee.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class Y extends ne {
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
    return r ? ne.near(s) : new Y(s);
  }
  content() {
    return new W(N.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof Y && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Cl(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new Y(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new Y(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
Y.prototype.visible = !1;
ne.jsonID("node", Y);
class Cl {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Xs(r, r) : new Cl(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && Y.isSelectable(r) ? new Y(t) : ne.near(t);
  }
}
class Ze extends ne {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = W.empty) {
    if (t == W.empty) {
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
    return new Ze(e);
  }
  map(e) {
    return new Ze(e);
  }
  eq(e) {
    return e instanceof Ze;
  }
  getBookmark() {
    return pk;
  }
}
ne.jsonID("all", Ze);
const pk = {
  map() {
    return this;
  },
  resolve(n) {
    return new Ze(n);
  }
};
function er(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return ee.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && Y.isSelectable(a))
        return Y.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = er(n, a, t + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function su(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof ke || i instanceof Ce))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((a, l, c, u) => {
    o == null && (o = u);
  }), n.setSelection(ne.near(n.doc.resolve(o), t));
}
const ou = 1, Ni = 2, au = 4;
class mk extends Th {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | ou) & ~Ni, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & ou) > 0;
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
    return ue.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || ue.none))), r.replaceWith(this, e), this;
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
    return this.updated |= au, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & au) > 0;
  }
}
function lu(n, e) {
  return !e || !n ? n : n.bind(e);
}
class _r {
  constructor(e, t, r) {
    this.name = e, this.init = lu(t.init, r), this.apply = lu(t.apply, r);
  }
}
const gk = [
  new _r("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new _r("selection", {
    init(n, e) {
      return n.selection || ne.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new _r("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new _r("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class No {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = gk.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new _r(r.key, r.spec.state, r));
    });
  }
}
class nr {
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
    let t = new nr(this.config), r = this.config.fields;
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
    return new mk(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new No(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new nr(t);
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
    let t = new No(this.schema, e.plugins), r = t.fields, i = new nr(t);
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
    let i = new No(e.schema, e.plugins), s = new nr(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = $t.fromJSON(e.schema, t.doc);
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
function Eh(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Eh(i, e, {})), t[r] = i;
  }
  return t;
}
class Re {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Eh(e.props, this, this.props), this.key = e.key ? e.key.key : Mh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Ro = /* @__PURE__ */ Object.create(null);
function Mh(n) {
  return n in Ro ? n + "$" + ++Ro[n] : (Ro[n] = 0, n + "$");
}
class nt {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Mh(e);
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
const Tl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Ah(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Oh = (n, e, t) => {
  let r = Ah(n, t);
  if (!r)
    return !1;
  let i = El(r);
  if (!i) {
    let o = r.blockRange(), a = o && Sr(o);
    return a == null ? !1 : (e && e(n.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (Fh(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (fr(s, "end") || Y.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let a = Js(n.doc, r.before(o), r.after(o), W.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = n.tr.step(a);
          l.setSelection(fr(s, "end") ? ne.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : Y.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, yk = (n, e, t) => {
  let r = Ah(n, t);
  if (!r)
    return !1;
  let i = El(r);
  return i ? _h(n, i, e) : !1;
}, vk = (n, e, t) => {
  let r = Ph(n, t);
  if (!r)
    return !1;
  let i = Ml(r);
  return i ? _h(n, i, e) : !1;
};
function _h(n, e, t) {
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
  let c = Js(n.doc, s, l, W.empty);
  if (!c || c.from != s || c instanceof ke && c.slice.size >= l - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(ee.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function fr(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Dh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = El(r);
  }
  let o = s && s.nodeBefore;
  return !o || !Y.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(Y.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function El(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Ph(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Ih = (n, e, t) => {
  let r = Ph(n, t);
  if (!r)
    return !1;
  let i = Ml(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Fh(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (fr(s, "start") || Y.isSelectable(s))) {
    let o = Js(n.doc, r.before(), r.after(), W.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = n.tr.step(o);
        a.setSelection(fr(s, "start") ? ne.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : Y.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, Nh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = Ml(r);
  }
  let o = s && s.nodeAfter;
  return !o || !Y.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(Y.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function Ml(n) {
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
const bk = (n, e) => {
  let t = n.selection, r = t instanceof Y, i;
  if (r) {
    if (t.node.isTextblock || !Wn(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Ks(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(Y.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, wk = (n, e) => {
  let t = n.selection, r;
  if (t instanceof Y) {
    if (t.node.isTextblock || !Wn(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ks(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Sk = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && Sr(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, Rh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Al(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const kk = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = Al(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(ne.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, $h = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Ze || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = Al(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(o, s.createAndFill());
    a.setSelection(ee.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, Bh = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Bt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Sr(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Lh(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof Y && e.selection.node.isBlock)
      return !r.parentOffset || !Bt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, a, l = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        l = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), a = Al(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1)));
        let m = n && n(i.parent, l, r);
        s.unshift(m || (l && a ? { type: a } : null)), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof ee || e.selection instanceof Ze) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Bt(u.doc, d, s.length, s);
    if (f || (s[0] = a ? { type: a } : null, f = Bt(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !l && c && r.node(o).type != a) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      a && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, a) && u.setNodeMarkup(u.mapping.map(r.before(o)), a);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const xk = Lh(), Ck = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(Y.create(n.doc, i))), !0);
};
function Tk(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Wn(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Fh(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, a, l = i.type.spec.isolating || s.type.spec.isolating;
  if (!l && Tk(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (a = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && a.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = N.empty;
      for (let v = o.length - 1; v >= 0; v--)
        p = N.from(o[v].create(null, p));
      p = N.from(i.copy(p));
      let m = n.tr.step(new Ce(e.pos - 1, h, e.pos, h, new W(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && Wn(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && l ? null : ne.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && Sr(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && fr(s, "start", !0) && fr(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let v = N.empty;
        for (let b = p.length - 1; b >= 0; b--)
          v = N.from(p[b].copy(v));
        let w = n.tr.step(new Ce(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new W(v, p.length, 0), 0, !0));
        t(w.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function zh(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection(ee.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const Ek = zh(-1), Mk = zh(1);
function Ak(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), a = o && yh(o, n, e);
    return a ? (r && r(t.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function cu(n, e = null) {
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
function Ol(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
Ol(Tl, Oh, Dh);
Ol(Tl, Ih, Nh);
Ol(Rh, $h, Bh, xk);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function Ok(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let a = r ? t.tr : null;
    return _k(a, o, n, e) ? (r && r(a.scrollIntoView()), !0) : !1;
  };
}
function _k(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = o.resolve(e.start - 2);
    s = new ps(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new ps(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = yh(s, t, r, e);
  return a ? (n && Dk(n, e, a, i, t), !0) : !1;
}
function Dk(n, e, t, r, i) {
  let s = N.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = N.from(t[u].type.create(t[u].attrs, s));
  n.step(new Ce(e.start - (r ? 2 : 0), e.end, e.start, e.end, new W(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let a = t.length - o, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Bt(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function Pk(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? Ik(e, t, n, s) : Nk(e, t, s) : !0 : !1;
  };
}
function Ik(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new Ce(s - 1, o, s, o, new W(N.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new ps(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = Sr(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return Wn(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function Nk(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let h = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    h -= i.child(p).nodeSize, r.delete(h - 1, h + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let a = t.startIndex == 0, l = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (a ? 0 : 1), u + 1, o.content.append(l ? N.empty : N.from(i))))
    return !1;
  let d = s.pos, f = d + o.nodeSize;
  return r.step(new Ce(d - (a ? 1 : 0), f + (l ? 1 : 0), d + 1, f - 1, new W((a ? N.empty : N.from(i.copy(N.empty))).append(l ? N.empty : N.from(i.copy(N.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function Rk(n) {
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
      let c = l.lastChild && l.lastChild.type == a.type, u = N.from(c ? n.create() : null), d = new W(N.from(n.create(null, N.from(a.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new Ce(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const _e = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, hr = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ta = null;
const Nt = function(n, e, t) {
  let r = Ta || (Ta = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, $k = function() {
  Ta = null;
}, Rn = function(n, e, t, r) {
  return t && (uu(n, e, t, r, -1) || uu(n, e, t, r, 1));
}, Bk = /^(img|br|input|textarea|hr)$/i;
function uu(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : ct(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || ki(n) || Bk.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = _e(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? ct(n) : 0;
    } else
      return !1;
  }
}
function ct(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Lk(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = ct(n);
    } else if (n.parentNode && !ki(n))
      e = _e(n), n = n.parentNode;
    else
      return null;
  }
}
function Fk(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !ki(n))
      e = _e(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function zk(n, e, t) {
  for (let r = e == 0, i = e == ct(n); r || i; ) {
    if (n == t)
      return !0;
    let s = _e(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == ct(n);
  }
}
function ki(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Ys = function(n) {
  return n.focusNode && Rn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function bn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function qk(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Vk(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(ct(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(ct(r.startContainer), r.startOffset) };
  }
}
const Mt = typeof navigator < "u" ? navigator : null, du = typeof document < "u" ? document : null, gn = Mt && Mt.userAgent || "", Ea = /Edge\/(\d+)/.exec(gn), qh = /MSIE \d/.exec(gn), Ma = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(gn), et = !!(qh || Ma || Ea), nn = qh ? document.documentMode : Ma ? +Ma[1] : Ea ? +Ea[1] : 0, ut = !et && /gecko\/(\d+)/i.test(gn);
ut && +(/Firefox\/(\d+)/.exec(gn) || [0, 0])[1];
const Aa = !et && /Chrome\/(\d+)/.exec(gn), Pe = !!Aa, Vh = Aa ? +Aa[1] : 0, Le = !et && !!Mt && /Apple Computer/.test(Mt.vendor), pr = Le && (/Mobile\/\w+/.test(gn) || !!Mt && Mt.maxTouchPoints > 2), lt = pr || (Mt ? /Mac/.test(Mt.platform) : !1), Wh = Mt ? /Win/.test(Mt.platform) : !1, Rt = /Android \d/.test(gn), xi = !!du && "webkitFontSmoothing" in du.documentElement.style, Wk = xi ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Uk(n) {
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
function It(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Hk(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function fu(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = hr(o);
      continue;
    }
    let a = o, l = a == s.body, c = l ? Uk(s) : Hk(a), u = 0, d = 0;
    if (e.top < c.top + It(r, "top") ? d = -(c.top - e.top + It(i, "top")) : e.bottom > c.bottom - It(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + It(i, "top") - c.top : e.bottom - c.bottom + It(i, "bottom")), e.left < c.left + It(r, "left") ? u = -(c.left - e.left + It(i, "left")) : e.right > c.right - It(r, "right") && (u = e.right - c.right + It(i, "right")), u || d)
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
    o = f == "absolute" ? o.offsetParent : hr(o);
  }
}
function jk(n) {
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
  return { refDOM: r, refTop: i, stack: Uh(n.dom) };
}
function Uh(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = hr(r))
    ;
  return e;
}
function Kk({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Hh(t, r == 0 ? 0 : r - e);
}
function Hh(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let Xn = null;
function Jk(n) {
  if (n.setActive)
    return n.setActive();
  if (Xn)
    return n.focus(Xn);
  let e = Uh(n);
  n.focus(Xn == null ? {
    get preventScroll() {
      return Xn = { preventScroll: !0 }, !0;
    }
  } : void 0), Xn || (Xn = !1, Hh(e, 0));
}
function jh(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, a = e.top, l, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = Nt(u).getClientRects();
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
  return !t && l && (t = l, i = c, r = 0), t && t.nodeType == 3 ? Xk(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : jh(t, i);
}
function Xk(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = Xt(r, 1);
    if (o.top != o.bottom && _l(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function _l(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Yk(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Gk(n, e, t) {
  let { node: r, offset: i } = jh(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function Qk(n, e, t, r) {
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
function Kh(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let a = o.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (_l(e, c))
            return Kh(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function Zk(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = Vk(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), a;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!_l(e, c) || (o = Kh(n.dom, e, c), !o))
      return null;
  }
  if (Le)
    for (let c = o; r && c; c = hr(c))
      c.draggable && (r = void 0);
  if (o = Yk(o, e), r) {
    if (ut && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    xi && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? a = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (a = Qk(n, r, i, e));
  }
  a == null && (a = Gk(n, o, e));
  let l = n.docView.nearestDesc(o, !0);
  return { pos: a, inside: l ? l.posAtStart - l.border : -1 };
}
function hu(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Xt(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (hu(r))
      return r;
  }
  return Array.prototype.find.call(t, hu) || n.getBoundingClientRect();
}
const e1 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Jh(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = xi || ut;
  if (r.nodeType == 3)
    if (o && (e1.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = Xt(Nt(r, i, i), t);
      if (ut && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = Xt(Nt(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = Xt(Nt(r, i, i + 1), -1);
          if (u.top != l.top)
            return Er(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, Er(Xt(Nt(r, l, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == ct(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return $o(l.getBoundingClientRect(), !1);
    }
    if (s == null && i < ct(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return $o(l.getBoundingClientRect(), !0);
    }
    return $o(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == ct(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? Nt(l, ct(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return Er(Xt(c, 1), !1);
  }
  if (s == null && i < ct(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? Nt(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return Er(Xt(c, -1), !0);
  }
  return Er(Xt(r.nodeType == 3 ? Nt(r) : r, -t), t >= 0);
}
function Er(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function $o(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function Xh(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function t1(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return Xh(n, e, () => {
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
    let o = Jh(n, i.pos, 1);
    for (let a = s.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = Nt(a, 0, a.nodeValue.length).getClientRects();
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
const n1 = /[\u0590-\u08ac]/;
function r1(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, a = n.domSelection();
  return a ? !n1.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? s : o : Xh(n, e, () => {
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
let pu = null, mu = null, gu = !1;
function i1(n, e, t) {
  return pu == e && mu == t ? gu : (pu = e, mu = t, gu = t == "up" || t == "down" ? t1(n, e, t) : r1(n, e, t));
}
const dt = 0, yu = 1, Sn = 2, At = 3;
class Ci {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = dt, r.pmViewDesc = this;
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
      i = t > _e(this.contentDOM);
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
      if (a > e || o instanceof Gh) {
        i = e - s;
        break;
      }
      s = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof Yh && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? _e(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? _e(s.dom) : this.contentDOM.childNodes.length };
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
            i = _e(f.dom) + 1;
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
            s = _e(d.dom);
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
    if ((ut || Le) && e == t) {
      let { node: h, offset: p } = a;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (a = l = { node: g.parentNode, offset: _e(g) + 1 });
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
    if (ut && u.focusNode && u.focusNode != l.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Le) && Rn(a.node, a.offset, u.anchorNode, u.anchorOffset) && Rn(l.node, l.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && ut)) {
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
          this.dirty = e == r || t == o ? Sn : yu, e == a && t == l && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = At : s.markDirty(e - a, t - a);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? Sn : At;
      }
      r = o;
    }
    this.dirty = Sn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? Sn : yu;
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
class Yh extends Ci {
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
    return this.dirty == dt && e.type.eq(this.widget.type);
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
class s1 extends Ci {
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
class $n extends Ci {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Vn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new $n(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & At || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != At && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != dt) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = dt;
    }
  }
  slice(e, t, r) {
    let i = $n.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
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
class rn extends Ci {
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
    } else u || ({ dom: u, contentDOM: d } = Vn.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = ep(u, r, t), c ? l = new o1(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new Gs(e, t, r, i, u, f, s) : new rn(e, t, r, i, u, d || null, f, s, o + 1);
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
      e.contentElement || (e.getContent = () => N.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == dt && e.eq(this.node) && ys(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, a = s && s.pos < 0, l = new l1(this, o && o.node, e);
    d1(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? ue.none : this.node.child(u).marks, r, e, u), l.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      l.syncToMarks(c.marks, r, e, f);
      let h;
      l.findNodeMatch(c, u, d, f) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = l.findIndexWithChild(s.node)) > -1 && l.updateNodeAt(c, u, d, h, e) || l.updateNextNode(c, u, d, e, f, i) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == Sn) && (o && this.protectLocalComposition(e, o), Qh(this.contentDOM, this.children, e), pr && f1(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof ee) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, a = h1(this.node.content, o, r - t, i - t);
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
    let o = new s1(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = _a(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == At || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = dt;
  }
  updateOuterDeco(e) {
    if (ys(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = Zh(this.dom, this.nodeDOM, Oa(this.outerDeco, this.node, t), Oa(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function vu(n, e, t, r, i) {
  ep(r, e, n);
  let s = new rn(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Gs extends rn {
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
    return this.dirty == At || this.dirty != dt && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != dt || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = dt, !0);
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
    return new Gs(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
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
class Gh extends Ci {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == dt && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class o1 extends rn {
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
function Qh(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], a = o.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = bu(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (o instanceof $n) {
      let l = r ? r.previousSibling : n.lastChild;
      Qh(o.contentDOM, o.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = bu(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Lr = function(n) {
  n && (this.nodeName = n);
};
Lr.prototype = /* @__PURE__ */ Object.create(null);
const kn = [new Lr()];
function Oa(n, e, t) {
  if (n.length == 0)
    return kn;
  let r = t ? kn[0] : new Lr(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Lr(o.nodeName));
      for (let a in o) {
        let l = o[a];
        l != null && (t && i.length == 1 && i.push(r = new Lr(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function Zh(n, e, t, r) {
  if (t == kn && r == kn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], a = t[s];
    if (s) {
      let l;
      a && a.nodeName == o.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = kn[0]), i = l;
    }
    a1(i, a || kn[0], o);
  }
  return i;
}
function a1(n, e, t) {
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
function ep(n, e, t) {
  return Zh(n, n, kn, Oa(e, t, n.nodeType != 1));
}
function ys(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function bu(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class l1 {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = c1(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = dt, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
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
        let u = $n.create(this.top, e[o], t, r);
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
    return o.dirty == At && o.dom == o.contentDOM && (o.dirty = Sn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (l instanceof rn) {
        let c = this.preMatch.matched.get(l);
        if (c != null && c != s)
          return !1;
        let u = l.dom, d, f = this.isLocked(u) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != At && ys(t, l.outerDeco));
        if (!f && l.update(e, t, r, i))
          return this.destroyBetween(this.index, a), l.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(l, e, t, r, i, o)))
          return this.destroyBetween(this.index, a), this.top.children[this.index] = d, d.contentDOM && (d.dirty = Sn, d.updateChildren(i, o + 1), d.dirty = dt), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !ys(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let a = rn.create(this.top, t, r, i, s, o);
    if (a.contentDOM) {
      a.children = e.children, e.children = [];
      for (let l of a.children)
        l.parent = a;
    }
    return e.destroy(), a;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = rn.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new Yh(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof $n; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Gs) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Le || Pe) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new Gh(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function c1(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let a;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof $n)
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
function u1(n, e) {
  return n.type.side - e.type.side;
}
function d1(n, e, t, r) {
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
        d.sort(u1);
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
      for (let v = 0; v < a.length; v++)
        a[v].to < g && (g = a[v].to);
      g < p && (l = f.cut(g - s), f = f.cut(0, g - s), p = g, h = -1);
    } else
      for (; o < i.length && i[o].to < p; )
        o++;
    let m = f.isInline && !f.isLeaf ? a.filter((g) => !g.inline) : a.slice();
    r(f, m, e.forChild(s, f), h), s = p;
  }
}
function f1(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function h1(n, e, t, r) {
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
function Dl(n, e = null) {
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
    if (i && d.isAtom && Y.isSelectable(d) && i.parent && !(d.isInline && zk(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new Y(o == f ? a : r.resolve(f));
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
    c = Pl(n, u, a, d);
  }
  return c;
}
function tp(n) {
  return n.editable ? n.hasFocus() : rp(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Lt(n, e = !1) {
  let t = n.state.selection;
  if (np(n, t), !!tp(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Pe) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Rn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      m1(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      wu && !(t instanceof ee) && (t.$from.parent.inlineContent || (s = Su(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = Su(n, t.to))), n.docView.setSelection(r, i, n, e), wu && (s && ku(s), o && ku(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && p1(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const wu = Le || Pe && Vh < 63;
function Su(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Le && i && i.contentEditable == "false")
    return Bo(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return Bo(i);
    if (s)
      return Bo(s);
  }
}
function Bo(n) {
  return n.contentEditable = "true", Le && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function ku(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function p1(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!tp(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function m1(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, _e(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && et && nn <= 11 && (t.disabled = !0, t.disabled = !1);
}
function np(n, e) {
  if (e instanceof Y) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (xu(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    xu(n);
}
function xu(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Pl(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || ee.between(e, t, r);
}
function Cu(n) {
  return n.editable && !n.hasFocus() ? !1 : rp(n);
}
function rp(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function g1(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Rn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Da(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && ne.findFrom(s, e);
}
function Yt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Tu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof ee)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Yt(n, new ee(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Da(n.state, e);
        return i && i instanceof Y ? Yt(n, i) : !1;
      } else if (!(lt && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let a = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(a)) && !o.contentDOM ? Y.isSelectable(s) ? Yt(n, new Y(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : xi ? Yt(n, new ee(n.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof Y && r.node.isInline)
      return Yt(n, new ee(e > 0 ? r.$to : r.$from));
    {
      let i = Da(n.state, e);
      return i ? Yt(n, i) : !1;
    }
  }
}
function vs(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Fr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Yn(n, e) {
  return e < 0 ? y1(n) : v1(n);
}
function y1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (ut && t.nodeType == 1 && r < vs(t) && Fr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (Fr(a, -1))
          i = t, s = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (ip(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && Fr(a, -1); )
          i = t.parentNode, s = _e(a), a = a.previousSibling;
        if (a)
          t = a, r = vs(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Pa(n, t, r) : i && Pa(n, i, s);
}
function v1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = vs(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (Fr(a, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (ip(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && Fr(a, 1); )
          s = a.parentNode, o = _e(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = vs(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && Pa(n, s, o);
}
function ip(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function b1(n, e) {
  for (; n && e == n.childNodes.length && !ki(n); )
    e = _e(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function w1(n, e) {
  for (; n && !e && !ki(n); )
    e = _e(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Pa(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = b1(e, t)) ? (e = o, t = 0) : (s = w1(e, t)) && (e = s, t = s.nodeValue.length);
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
    n.state == i && Lt(n);
  }, 50);
}
function Eu(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Pe || Wh) && t.parent.inlineContent) {
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
function Mu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof ee && !r.empty || t.indexOf("s") > -1 || lt && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Da(n.state, e);
    if (o && o instanceof Y)
      return Yt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof Ze ? ne.near(o, e) : ne.findFrom(o, e);
    return a ? Yt(n, a) : !1;
  }
  return !1;
}
function Au(n, e) {
  if (!(n.state.selection instanceof ee))
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
function Ou(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function S1(n) {
  if (!Le || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Ou(n, r, "true"), setTimeout(() => Ou(n, r, "false"), 20);
  }
  return !1;
}
function k1(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function x1(n, e) {
  let t = e.keyCode, r = k1(e);
  if (t == 8 || lt && t == 72 && r == "c")
    return Au(n, -1) || Yn(n, -1);
  if (t == 46 && !e.shiftKey || lt && t == 68 && r == "c")
    return Au(n, 1) || Yn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || lt && t == 66 && r == "c") {
    let i = t == 37 ? Eu(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Tu(n, i, r) || Yn(n, i);
  } else if (t == 39 || lt && t == 70 && r == "c") {
    let i = t == 39 ? Eu(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Tu(n, i, r) || Yn(n, i);
  } else {
    if (t == 38 || lt && t == 80 && r == "c")
      return Mu(n, -1, r) || Yn(n, -1);
    if (t == 40 || lt && t == 78 && r == "c")
      return S1(n) || Mu(n, 1, r) || Yn(n, 1);
    if (r == (lt ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Il(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || Vn.fromSchema(n.state.schema), a = up(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = cp[c.nodeName.toLowerCase()]); ) {
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
function sp(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!t && !e)
    return null;
  let l = !!e && (r || s || !t);
  if (l) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return a = new W(N.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        a = f(a, n, !0);
      }), a;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      a = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = Vn.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = M1(t), xi && A1(o);
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
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || $r.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !C1.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = O1(_u(a, +u[1], +u[2]), u[4]);
  else if (a = W.maxOpen(T1(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, f = 0;
    for (let h = a.content.firstChild; d < a.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = a.content.lastChild; f < a.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    a = _u(a, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n, l);
  }), a;
}
const C1 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function T1(n, e) {
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
      if (c = o.length && s.length && ap(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = lp(o[o.length - 1], s.length));
        let u = op(a, l);
        o.push(u), i = i.matchType(u.type), s = l;
      }
    }), o)
      return N.from(o);
  }
  return n;
}
function op(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, N.from(n));
  return n;
}
function ap(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = ap(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(N.from(op(t, n, i + 1))));
  }
}
function lp(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, lp(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(N.empty, !0);
  return n.copy(t.append(r));
}
function Ia(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, a = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (a = Ia(a, e, t, r, i + 1, s)), i >= t && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(N.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(a));
}
function _u(n, e, t) {
  return e < n.openStart && (n = new W(Ia(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new W(Ia(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const cp = {
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
let Du = null;
function up() {
  return Du || (Du = document.implementation.createHTMLDocument("title"));
}
let Lo = null;
function E1(n) {
  let e = window.trustedTypes;
  return e ? (Lo || (Lo = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Lo.createHTML(n)) : n;
}
function M1(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = up().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && cp[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = E1(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function A1(n) {
  let e = n.querySelectorAll(Pe ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function O1(n, e) {
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
    i = N.from(l.create(r[a + 1], i)), s++, o++;
  }
  return new W(i, s, o);
}
const je = {}, Ke = {}, _1 = { touchstart: !0, touchmove: !0 };
class D1 {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function P1(n) {
  for (let e in je) {
    let t = je[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      N1(n, r) && !Nl(n, r) && (n.editable || !(r.type in Ke)) && t(n, r);
    }, _1[e] ? { passive: !0 } : void 0);
  }
  Le && n.dom.addEventListener("input", () => null), Na(n);
}
function tn(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function I1(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Na(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Nl(n, r));
  });
}
function Nl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function N1(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function R1(n, e) {
  !Nl(n, e) && je[e.type] && (n.editable || !(e.type in Ke)) && je[e.type](n, e);
}
Ke.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !fp(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Rt && Pe && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), pr && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, bn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || x1(n, t) ? t.preventDefault() : tn(n, "key");
};
Ke.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Ke.keypress = (n, e) => {
  let t = e;
  if (fp(n, t) || !t.charCode || t.ctrlKey && !t.altKey || lt && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof ee) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode), s = () => n.state.tr.insertText(i).scrollIntoView();
    !/[\r\n]/.test(i) && !n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i, s)) && n.dispatch(s()), t.preventDefault();
  }
};
function Qs(n) {
  return { left: n.clientX, top: n.clientY };
}
function $1(n, e) {
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
function sr(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function B1(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && Y.isSelectable(r) ? (sr(n, new Y(t)), !0) : !1;
}
function L1(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof Y && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let a = o > s.depth ? s.nodeAfter : s.node(o);
    if (Y.isSelectable(a)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (sr(n, Y.create(n.state.doc, i)), !0) : !1;
}
function F1(n, e, t, r, i) {
  return Rl(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? L1(n, t) : B1(n, t));
}
function z1(n, e, t, r) {
  return Rl(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function q1(n, e, t, r) {
  return Rl(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || V1(n, t, r);
}
function V1(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (sr(n, ee.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      sr(n, ee.create(r, a + 1, a + 1 + o.content.size));
    else if (Y.isSelectable(o))
      sr(n, Y.create(r, a));
    else
      continue;
    return !0;
  }
}
function $l(n) {
  return bs(n);
}
const dp = lt ? "metaKey" : "ctrlKey";
je.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = $l(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && $1(t, n.input.lastClick) && !t[dp] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Qs(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new W1(n, o, t, !!r)) : (s == "doubleClick" ? z1 : q1)(n, o.pos, o.inside, t) ? t.preventDefault() : tn(n, "pointer"));
};
class W1 {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[dp], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof Y && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && ut && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), tn(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Lt(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Qs(e))), this.updateAllowDefault(e), this.allowDefault || !t ? tn(this.view, "pointer") : F1(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Le && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Pe && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (sr(this.view, ne.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : tn(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), tn(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
je.touchstart = (n) => {
  n.input.lastTouch = Date.now(), $l(n), tn(n, "pointer");
};
je.touchmove = (n) => {
  n.input.lastTouch = Date.now(), tn(n, "pointer");
};
je.contextmenu = (n) => $l(n);
function fp(n, e) {
  return n.composing ? !0 : Le && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const U1 = Rt ? 5e3 : -1;
Ke.compositionstart = Ke.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof ee && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Pe && Wh && H1(n)))
      n.markCursor = n.state.storedMarks || t.marks(), bs(n, !0), n.markCursor = null;
    else if (bs(n, !e.selection.empty), ut && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  hp(n, U1);
};
function H1(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Ke.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, hp(n, 20));
};
function hp(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => bs(n), e));
}
function pp(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = K1()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function j1(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Lk(e.focusNode, e.focusOffset), r = Fk(e.focusNode, e.focusOffset);
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
function K1() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function bs(n, e = !1) {
  if (!(Rt && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), pp(n), e || n.docView && n.docView.dirty) {
      let t = Dl(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function J1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Zr = et && nn < 15 || pr && Wk < 604;
je.copy = Ke.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Zr ? null : t.clipboardData, o = r.content(), { dom: a, text: l } = Il(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : J1(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function X1(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Y1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? ei(n, r.value, null, i, e) : ei(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function ei(n, e, t, r, i) {
  let s = sp(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, s || W.empty)))
    return !0;
  if (!s)
    return !1;
  let o = X1(s), a = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function mp(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Ke.paste = (n, e) => {
  let t = e;
  if (n.composing && !Rt)
    return;
  let r = Zr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && ei(n, mp(r), r.getData("text/html"), i, t) ? t.preventDefault() : Y1(n, t);
};
class gp {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const G1 = lt ? "altKey" : "ctrlKey";
function yp(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[G1];
}
je.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Qs(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof Y ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = Y.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = Y.create(n.state.doc, d.posBefore));
    }
  }
  let a = (o || n.state.selection).content(), { dom: l, text: c, slice: u } = Il(n, a);
  (!t.dataTransfer.files.length || !Pe || Vh > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Zr ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Zr || t.dataTransfer.setData("text/plain", c), n.dragging = new gp(u, yp(n, t), o);
};
je.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Ke.dragover = Ke.dragenter = (n, e) => e.preventDefault();
Ke.drop = (n, e) => {
  try {
    Q1(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function Q1(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Qs(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = sp(n, mp(e.dataTransfer), Zr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && yp(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || W.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let a = s ? ok(n.state.doc, i.pos, s) : i.pos;
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
  if (u && Y.isSelectable(s.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(s.content.firstChild))
    l.setSelection(new Y(f));
  else {
    let h = l.mapping.map(a);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((p, m, g, v) => h = v), l.setSelection(Pl(n, f, l.doc.resolve(h)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
je.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Lt(n);
  }, 20));
};
je.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
je.beforeinput = (n, e) => {
  if (Pe && Rt && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, bn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Ke)
  je[n] = Ke[n];
function ti(n, e) {
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
class ws {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || En, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new Ge(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof ws && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && ti(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class sn {
  constructor(e, t) {
    this.attrs = e, this.spec = t || En;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new Ge(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof sn && ti(this.attrs, e.attrs) && ti(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof sn;
  }
  destroy() {
  }
}
class Bl {
  constructor(e, t) {
    this.attrs = e, this.spec = t || En;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new Ge(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Bl && ti(this.attrs, e.attrs) && ti(this.spec, e.spec);
  }
  destroy() {
  }
}
class Ge {
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
    return new Ge(e, t, this.type);
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
    return new Ge(e, e, new ws(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new Ge(e, t, new sn(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new Ge(e, t, new Bl(r, i));
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
    return this.type instanceof sn;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof ws;
  }
}
const tr = [], En = {};
class fe {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : tr, this.children = t.length ? t : tr;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Ss(t, e, 0, En) : $e;
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
    return this == $e || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || En);
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
    return this.children.length ? Z1(this.children, o || [], e, t, r, i, s) : o ? new fe(o.sort(Mn), tr) : $e;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == $e ? fe.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (u = bp(t, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, u, c + 1) : i.splice(s, 0, l, l + a.nodeSize, Ss(u, a, c + 1, En)), s += 3;
      }
    });
    let o = vp(s ? wp(t) : t, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new fe(o.length ? this.local.concat(o).sort(Mn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == $e ? this : this.removeInner(e, 0);
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
      c != $e ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new fe(i, r) : $e;
  }
  forChild(e, t) {
    if (this == $e)
      return this;
    if (t.isLeaf)
      return fe.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < o && l.to > s && l.type instanceof sn) {
        let c = Math.max(s, l.from) - s, u = Math.min(o, l.to) - s;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new fe(i.sort(Mn), tr);
      return r ? new Qt([a, r]) : a;
    }
    return r || $e;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof fe) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return Ll(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == $e)
      return tr;
    if (e.inlineContent || !this.local.some(sn.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof sn || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
fe.empty = new fe([], []);
fe.removeOverlap = Ll;
const $e = fe.empty;
class Qt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, En));
    return Qt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return fe.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != $e && (s instanceof Qt ? r = r.concat(s.members) : r.push(s));
    }
    return Qt.from(r);
  }
  eq(e) {
    if (!(e instanceof Qt) || e.members.length != this.members.length)
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
    return t ? Ll(r ? t : t.sort(Mn)) : tr;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return $e;
      case 1:
        return e[0];
      default:
        return new Qt(e.every((t) => t instanceof fe) ? e : e.reduce((t, r) => t.concat(r instanceof fe ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function Z1(n, e, t, r, i, s, o) {
  let a = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let v = 0; v < a.length; v += 3) {
        let w = a[v + 1];
        if (w < 0 || f > w + u - d)
          continue;
        let b = a[v] + u - d;
        h >= b ? a[v + 1] = f <= b ? -2 : -1 : f >= u && g && (a[v] += g, a[v + 1] += g);
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
        let v = a[c + 2].mapInner(t, g, u + 1, n[c] + s + 1, o);
        v != $e ? (a[c] = d, a[c + 1] = h, a[c + 2] = v) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = ex(a, n, e, t, i, s, o), u = Ss(c, r, 0, o);
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
  return new fe(e.sort(Mn), a);
}
function vp(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new Ge(i.from + e, i.to + e, i.type));
  }
  return t;
}
function ex(n, e, t, r, i, s, o) {
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
function bp(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function wp(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Ss(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = bp(n, a, l + t);
    if (c) {
      s = !0;
      let u = Ss(c, a, t + l + 1, r);
      u != $e && i.push(l, l + a.nodeSize, u);
    }
  });
  let o = vp(s ? wp(n) : n, -t).sort(Mn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new fe(o, i) : $e;
}
function Mn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Ll(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), Pu(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), Pu(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Pu(n, e, t) {
  for (; e < n.length && Mn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Fo(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != $e && e.push(r);
  }), n.cursorWrapper && e.push(fe.create(n.state.doc, [n.cursorWrapper.deco])), Qt.from(e);
}
const tx = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, nx = et && nn <= 11;
class rx {
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
class ix {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new rx(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      et && nn <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Le && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), nx && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, tx)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (Cu(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Lt(this.view);
      if (et && nn <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Rn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = hr(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = hr(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && Cu(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, a = !1, l = [];
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
    } else if (ut && l.length) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || ax(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ys(r) && (c = Dl(e)) && c.eq(ne.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Lt(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), sx(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, lx(e, l)), this.handleDOMChange(s, o, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Lt(e), this.currentSelection.set(r));
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
      if (et && nn <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? _e(i) + 1 : 0, a = r.localPosFromDOM(e.target, o, -1), l = s && s.parentNode == e.target ? _e(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
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
let Iu = /* @__PURE__ */ new WeakMap(), Nu = !1;
function sx(n) {
  if (!Iu.has(n) && (Iu.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = ut, Nu)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Nu = !0;
  }
}
function Ru(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Rn(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function ox(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return Ru(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? Ru(n, t) : null;
}
function ax(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function lx(n, e) {
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
function cx(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], Ys(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), Pe && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let v = r.childNodes[g - 1], w = v.pmViewDesc;
      if (v.nodeName == "BR" && !w) {
        s = g;
        break;
      }
      if (!w || w.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || $r.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: ux,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, v = c[1] && c[1].pos;
    v == null && (v = g), p = { anchor: g + o, head: v + o };
  }
  return { doc: m, sel: p, from: o, to: a };
}
function ux(n) {
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
const dx = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function fx(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let k = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, M = Dl(n, k);
    if (M && !n.state.selection.eq(M)) {
      if (Pe && Rt && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (A) => A(n, bn(13, "Enter"))))
        return;
      let x = n.state.tr.setSelection(M);
      k == "pointer" ? x.setMeta("pointer", !0) : k == "key" && x.scrollIntoView(), s && x.setMeta("composition", s), n.dispatch(x);
    }
    return;
  }
  let o = n.state.doc.resolve(e), a = o.sharedDepth(t);
  e = o.before(a + 1), t = n.state.doc.resolve(t).after(a + 1);
  let l = n.state.selection, c = cx(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = mx(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (pr && n.input.lastIOSEnter > Date.now() - 225 || Rt) && i.some((k) => k.nodeType == 1 && !dx.test(k.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (k) => k(n, bn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && l instanceof ee && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (c.sel) {
        let k = $u(n, n.state.doc, c.sel);
        if (k && !k.eq(n.state.selection)) {
          let M = n.state.tr.setSelection(k);
          s && M.setMeta("composition", s), n.dispatch(M);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof ee && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), et && nn <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), v = u.resolve(p.start), w = m.sameParent(g) && m.parent.inlineContent && v.end() >= p.endA;
  if ((pr && n.input.lastIOSEnter > Date.now() - 225 && (!w || i.some((k) => k.nodeName == "DIV" || k.nodeName == "P")) || !w && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (k) => k(n, bn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && px(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (k) => k(n, bn(8, "Backspace")))) {
    Rt && Pe && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Pe && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Rt && !w && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(k) {
      return k(n, bn(13, "Enter"));
    });
  }, 20));
  let b = p.start, S = p.endA, C = (k) => {
    let M = k || n.state.tr.replace(b, S, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let x = $u(n, M.doc, c.sel);
      x && !(Pe && n.composing && x.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (x.head == b || x.head == M.mapping.map(S) - 1) || et && x.empty && x.head == b) && M.setSelection(x);
    }
    return s && M.setMeta("composition", s), M.scrollIntoView();
  }, T;
  if (w)
    if (m.pos == g.pos) {
      et && nn <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Lt(n), 20));
      let k = C(n.state.tr.delete(b, S)), M = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      M && k.ensureMarks(M), n.dispatch(k);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (T = hx(m.parent.content.cut(m.parentOffset, g.parentOffset), v.parent.content.cut(v.parentOffset, p.endA - v.start())))
    ) {
      let k = C(n.state.tr);
      T.type == "add" ? k.addMark(b, S, T.mark) : k.removeMark(b, S, T.mark), n.dispatch(k);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let k = m.parent.textBetween(m.parentOffset, g.parentOffset), M = () => C(n.state.tr.insertText(k, b, S));
      n.someProp("handleTextInput", (x) => x(n, b, S, k, M)) || n.dispatch(M());
    } else
      n.dispatch(C());
  else
    n.dispatch(C());
}
function $u(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Pl(n, e.resolve(t.anchor), e.resolve(t.head));
}
function hx(n, e) {
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
  if (N.from(c).eq(n))
    return { mark: a, type: o };
}
function px(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    zo(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let a = s.nodeAfter;
    return a != null && t == e + a.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(zo(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || zo(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function zo(n, e, t) {
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
function mx(n, e, t, r, i) {
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
    s -= l, s && s < e.size && Bu(e.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), a = s + (a - o), o = s;
  } else if (a < s) {
    let l = r <= s && r >= a ? s - r : 0;
    s -= l, s && s < n.size && Bu(n.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), o = s + (o - a), a = s;
  }
  return { start: s, endA: o, endB: a };
}
function Bu(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Sp {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new D1(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Vu), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = zu(this), Fu(this), this.nodeViews = qu(this), this.docView = vu(this.state.doc, Lu(this), Fo(this), this.dom, this), this.domObserver = new ix(this, (r, i, s, o) => fx(this, r, i, s, o)), this.domObserver.start(), P1(this), this.updatePluginViews();
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
    this._props = e, e.plugins && (e.plugins.forEach(Vu), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (pp(this), o = !0), this.state = e;
    let a = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = qu(this);
      yx(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (a || t.handleDOMEvents != this._props.handleDOMEvents) && Na(this), this.editable = zu(this), Fu(this);
    let l = Fo(this), c = Lu(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, l);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && jk(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (et || Pe) && !this.composing && !i.selection.empty && !e.selection.empty && gx(i.selection, e.selection);
      if (d) {
        let p = Pe ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = j1(this)), (s || !this.docView.update(e.doc, c, l, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = vu(e.doc, c, l, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && g1(this)) ? Lt(this, h) : (np(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && Kk(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof Y) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && fu(this, t.getBoundingClientRect(), e);
      } else
        fu(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new gp(e.slice, e.move, i < 0 ? void 0 : Y.create(this.state.doc, i));
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
    this.domObserver.stop(), this.editable && Jk(this.dom), Lt(this), this.domObserver.start();
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
    return Zk(this, e);
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
    return Jh(this, e, t);
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
    return i1(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return ei(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return ei(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return Il(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (I1(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Fo(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, $k());
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
    return R1(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Le && this.root.nodeType === 11 && qk(this.dom.ownerDocument) == this.dom && ox(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Sp.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function Lu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [Ge.node(0, n.state.doc.content.size, e)];
}
function Fu(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: Ge.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function zu(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function gx(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function qu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function yx(n, e) {
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
function Vu(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var fn = {
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
}, ks = {
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
}, vx = typeof navigator < "u" && /Mac/.test(navigator.platform), bx = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var De = 0; De < 10; De++) fn[48 + De] = fn[96 + De] = String(De);
for (var De = 1; De <= 24; De++) fn[De + 111] = "F" + De;
for (var De = 65; De <= 90; De++)
  fn[De] = String.fromCharCode(De + 32), ks[De] = String.fromCharCode(De);
for (var qo in fn) ks.hasOwnProperty(qo) || (ks[qo] = fn[qo]);
function wx(n) {
  var e = vx && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || bx && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? ks : fn)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Sx = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), kx = typeof navigator < "u" && /Win/.test(navigator.platform);
function xx(n) {
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
      Sx ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function Cx(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[xx(t)] = n[t];
  return e;
}
function Vo(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Tx(n) {
  return new Re({ props: { handleKeyDown: Ex(n) } });
}
function Ex(n) {
  let e = Cx(n);
  return function(t, r) {
    let i = wx(r), s, o = e[Vo(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[Vo(i, r, !1)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(kx && r.ctrlKey && r.altKey) && (s = fn[r.keyCode]) && s != i) {
        let a = e[Vo(s, r)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var Mx = Object.defineProperty, Fl = (n, e) => {
  for (var t in e)
    Mx(n, t, { get: e[t], enumerable: !0 });
};
function Zs(n) {
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
var eo = class {
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
      state: Zs({
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
}, kp = {};
Fl(kp, {
  blur: () => Ax,
  clearContent: () => Ox,
  clearNodes: () => _x,
  command: () => Dx,
  createParagraphNear: () => Px,
  cut: () => Ix,
  deleteCurrentNode: () => Nx,
  deleteNode: () => Rx,
  deleteRange: () => $x,
  deleteSelection: () => Bx,
  enter: () => Lx,
  exitCode: () => Fx,
  extendMarkRange: () => zx,
  first: () => qx,
  focus: () => Wx,
  forEach: () => Ux,
  insertContent: () => Hx,
  insertContentAt: () => Jx,
  joinBackward: () => Gx,
  joinDown: () => Yx,
  joinForward: () => Qx,
  joinItemBackward: () => Zx,
  joinItemForward: () => eC,
  joinTextblockBackward: () => tC,
  joinTextblockForward: () => nC,
  joinUp: () => Xx,
  keyboardShortcut: () => iC,
  lift: () => sC,
  liftEmptyBlock: () => oC,
  liftListItem: () => aC,
  newlineInCode: () => lC,
  resetAttributes: () => cC,
  scrollIntoView: () => uC,
  selectAll: () => dC,
  selectNodeBackward: () => fC,
  selectNodeForward: () => hC,
  selectParentNode: () => pC,
  selectTextblockEnd: () => mC,
  selectTextblockStart: () => gC,
  setContent: () => yC,
  setMark: () => $C,
  setMeta: () => BC,
  setNode: () => LC,
  setNodeSelection: () => FC,
  setTextDirection: () => zC,
  setTextSelection: () => qC,
  sinkListItem: () => VC,
  splitBlock: () => WC,
  splitListItem: () => UC,
  toggleList: () => HC,
  toggleMark: () => jC,
  toggleNode: () => KC,
  toggleWrap: () => JC,
  undoInputRule: () => XC,
  unsetAllMarks: () => YC,
  unsetMark: () => GC,
  unsetTextDirection: () => QC,
  updateAttributes: () => ZC,
  wrapIn: () => eT,
  wrapInList: () => tT
});
var Ax = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), Ox = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), _x = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = Sr(h);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, Dx = (n) => (e) => n(e), Px = () => ({ state: n, dispatch: e }) => $h(n, e), Ix = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new ee(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, Nx = () => ({ tr: n, dispatch: e }) => {
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
function Te(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var Rx = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = Te(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const l = s.before(o), c = s.after(o);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, $x = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, Bx = () => ({ state: n, dispatch: e }) => Tl(n, e), Lx = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Fx = () => ({ state: n, dispatch: e }) => kk(n, e);
function zl(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function xs(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : zl(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function xp(n, e, t = {}) {
  return n.find((r) => r.type === e && xs(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Wu(n, e, t = {}) {
  return !!xp(n, e, t);
}
function Cp(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !xp([...i.node.marks], e, t)))
    return;
  let o = i.index, a = n.start() + i.offset, l = o + 1, c = a + i.node.nodeSize;
  for (; o > 0 && Wu([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, a -= n.parent.child(o).nodeSize;
  for (; l < n.parent.childCount && Wu([...n.parent.child(l).marks], e, t); )
    c += n.parent.child(l).nodeSize, l += 1;
  return {
    from: a,
    to: c
  };
}
function Kt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var zx = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = Kt(n, r.schema), { doc: o, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = Cp(l, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = ee.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, qx = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Tp(n) {
  return n instanceof ee;
}
function xn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Ep(n, e = null) {
  if (!e)
    return null;
  const t = ne.atStart(n), r = ne.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? ee.create(n, xn(0, i, s), xn(n.content.size, i, s)) : ee.create(n, xn(e, i, s), xn(e, i, s));
}
function Ra() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function ni() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function Vx() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var Wx = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (ni() || Ra()) && r.dom.focus(), Vx() && !ni() && !Ra() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !Tp(t.state.selection))
    return o(), !0;
  const a = Ep(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, Ux = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), Hx = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Mp = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Mp(r);
  }
  return n;
};
function Ri(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Mp(t);
}
function ri(n, e, t) {
  if (n instanceof $t || n instanceof N)
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
        return N.fromArray(n.map((a) => e.nodeFromJSON(a)));
      const o = e.nodeFromJSON(n);
      return t.errorOnInvalidContent && o.check(), o;
    } catch (s) {
      if (t.errorOnInvalidContent)
        throw new Error("[tiptap error]: Invalid JSON content", { cause: s });
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), ri("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, a = "";
      const l = new ch({
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
      if (t.slice ? $r.fromSchema(l).parseSlice(Ri(n), t.parseOptions) : $r.fromSchema(l).parse(Ri(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${a}`)
        });
    }
    const s = $r.fromSchema(e);
    return t.slice ? s.parseSlice(Ri(n), t.parseOptions).content : s.parse(Ri(n), t.parseOptions);
  }
  return ri("", e, t);
}
function jx(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof ke || i instanceof Ce))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(ne.near(n.doc.resolve(o), t));
}
var Kx = (n) => !("type" in n), Jx = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
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
        ri(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        l(g);
      }
    try {
      a = ri(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return l(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((Kx(a) ? a : [a]).forEach((g) => {
      g.check(), f = f ? g.isText && g.marks.length === 0 : !1, h = h ? g.isBlock : !1;
    }), u === d && h) {
      const { parent: g } = r.doc.resolve(u);
      g.isTextblock && !g.type.spec.code && !g.childCount && (u -= 1, d += 1);
    }
    let m;
    if (f) {
      if (Array.isArray(e))
        m = e.map((g) => g.text || "").join("");
      else if (e instanceof N) {
        let g = "";
        e.forEach((v) => {
          v.text && (g += v.text);
        }), m = g;
      } else typeof e == "object" && e && e.text ? m = e.text : m = e;
      r.insertText(m, u, d);
    } else {
      m = a;
      const g = r.doc.resolve(u), v = g.node(), w = g.parentOffset === 0, b = v.isText || v.isTextblock, S = v.content.size > 0;
      w && b && S && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && jx(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, Xx = () => ({ state: n, dispatch: e }) => bk(n, e), Yx = () => ({ state: n, dispatch: e }) => wk(n, e), Gx = () => ({ state: n, dispatch: e }) => Oh(n, e), Qx = () => ({ state: n, dispatch: e }) => Ih(n, e), Zx = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ks(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, eC = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ks(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, tC = () => ({ state: n, dispatch: e }) => yk(n, e), nC = () => ({ state: n, dispatch: e }) => vk(n, e);
function Ap() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function rC(n) {
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
      ni() || Ap() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var iC = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = rC(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
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
function ii(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? Te(e, n.schema) : null, a = [];
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
  const l = i - r, c = a.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => xs(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
var sC = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Te(n, t.schema);
  return ii(t, i, e) ? Sk(t, r) : !1;
}, oC = () => ({ state: n, dispatch: e }) => Bh(n, e), aC = (n) => ({ state: e, dispatch: t }) => {
  const r = Te(n, e.schema);
  return Pk(r)(e, t);
}, lC = () => ({ state: n, dispatch: e }) => Rh(n, e);
function to(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Uu(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var cC = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = to(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Te(n, r.schema)), a === "mark" && (o = Kt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (l = !0, i && t.setNodeMarkup(d, void 0, Uu(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (l = !0, i && t.addMark(d, d + u.nodeSize, o.create(Uu(f.attrs, e))));
      });
    });
  }), l;
}, uC = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), dC = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new Ze(n.doc);
    n.setSelection(t);
  }
  return !0;
}, fC = () => ({ state: n, dispatch: e }) => Dh(n, e), hC = () => ({ state: n, dispatch: e }) => Nh(n, e), pC = () => ({ state: n, dispatch: e }) => Ck(n, e), mC = () => ({ state: n, dispatch: e }) => Mk(n, e), gC = () => ({ state: n, dispatch: e }) => Ek(n, e);
function $a(n, e, t = {}, r = {}) {
  return ri(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var yC = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: a }) => {
  const { doc: l } = s;
  if (r.preserveWhitespace !== "full") {
    const c = $a(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, l.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: l.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function Op(n, e) {
  const t = Kt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function vC(n, e) {
  const t = new Th(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function bC(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function wC(n, e) {
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
function ql(n) {
  return (e) => wC(e.$from, n);
}
function K(n, e, t) {
  return n.config[e] === void 0 && n.parent ? K(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? K(n.parent, e, t) : null
  }) : n.config[e];
}
function Vl(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = K(e, "addExtensions", t);
    return r ? [e, ...Vl(r())] : e;
  }).flat(10);
}
function Wl(n, e) {
  const t = Vn.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function _p(n) {
  return typeof n == "function";
}
function ge(n, e = void 0, ...t) {
  return _p(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function SC(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function mr(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Dp(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = mr(n), i = [...t, ...r], s = {
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
function kC(n) {
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
function Hu(n) {
  const e = [], t = kC(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const a = s.slice(0, o).trim(), l = s.slice(o + 1).trim();
    a && l && e.push([a, l]);
  }
  return e;
}
function Pp(...n) {
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
        const a = new Map([...Hu(r[i]), ...Hu(s)]);
        r[i] = Array.from(a.entries()).map(([l, c]) => `${l}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function Cs(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => Pp(t, r), {});
}
function xC(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function ju(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const a = o.attribute.parseHTML ? o.attribute.parseHTML(t) : xC(t.getAttribute(o.name));
        return a == null ? s : {
          ...s,
          [o.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function Ku(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && SC(t) ? !1 : t != null)
  );
}
function Ju(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function Ip(n, e) {
  var t;
  const r = Dp(n), { nodeExtensions: i, markExtensions: s } = mr(n), o = (t = i.find((c) => K(c, "topNode"))) == null ? void 0 : t.name, a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((v) => v.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((v, w) => {
        const b = K(w, "extendNodeSchema", d);
        return {
          ...v,
          ...b ? b(c) : {}
        };
      }, {}), h = Ku({
        ...f,
        content: ge(K(c, "content", d)),
        marks: ge(K(c, "marks", d)),
        group: ge(K(c, "group", d)),
        inline: ge(K(c, "inline", d)),
        atom: ge(K(c, "atom", d)),
        selectable: ge(K(c, "selectable", d)),
        draggable: ge(K(c, "draggable", d)),
        code: ge(K(c, "code", d)),
        whitespace: ge(K(c, "whitespace", d)),
        linebreakReplacement: ge(
          K(c, "linebreakReplacement", d)
        ),
        defining: ge(K(c, "defining", d)),
        isolating: ge(K(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(Ju))
      }), p = ge(K(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (v) => ju(v, u)
      ));
      const m = K(c, "renderHTML", d);
      m && (h.toDOM = (v) => m({
        node: v,
        HTMLAttributes: Cs(v, u)
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
      }, f = n.reduce((g, v) => {
        const w = K(v, "extendMarkSchema", d);
        return {
          ...g,
          ...w ? w(c) : {}
        };
      }, {}), h = Ku({
        ...f,
        inclusive: ge(K(c, "inclusive", d)),
        excludes: ge(K(c, "excludes", d)),
        group: ge(K(c, "group", d)),
        spanning: ge(K(c, "spanning", d)),
        code: ge(K(c, "code", d)),
        attrs: Object.fromEntries(u.map(Ju))
      }), p = ge(K(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => ju(g, u)
      ));
      const m = K(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: Cs(g, u)
      })), [c.name, h];
    })
  );
  return new ch({
    topNode: o,
    nodes: a,
    marks: l
  });
}
function CC(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function zr(n) {
  return n.sort((t, r) => {
    const i = K(t, "priority") || 100, s = K(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function Ul(n) {
  const e = zr(Vl(n)), t = CC(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function TC(n, e) {
  const t = Ul(n);
  return Ip(t, e);
}
function Np(n, e, t) {
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
function EC(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return Np(n, t, e);
}
function Rp(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function MC(n, e) {
  const t = Te(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function AC(n, e) {
  const t = to(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? MC(n, e) : t === "mark" ? Op(n, e) : {};
}
function OC(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function _C(n) {
  const e = OC(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function DC(n) {
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
  }), _C(r);
}
function Mr(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Ki(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var PC = (n, e = 500) => {
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
function Ba(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? Kt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => xs(d.attrs, t, { strict: !1 }));
  let o = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const v = Math.max(h, g), w = Math.min(p, g + m.nodeSize), b = w - v;
      o += b, a.push(
        ...m.marks.map((S) => ({
          mark: S,
          from: v,
          to: w
        }))
      );
    });
  }), o === 0)
    return !1;
  const l = a.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => xs(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function IC(n, e, t = {}) {
  if (!e)
    return ii(n, null, t) || Ba(n, null, t);
  const r = to(e, n.schema);
  return r === "node" ? ii(n, e, t) : r === "mark" ? Ba(n, e, t) : !1;
}
function Xu(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Yu(n, e) {
  const { nodeExtensions: t } = mr(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = ge(K(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function Hl(n, {
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
      i !== !1 && (Hl(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var jl = class $p {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new $p(e.position);
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
function Bp(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new jl(t.pos),
    mapResult: t
  };
}
function NC(n) {
  return new jl(n);
}
function RC(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Tp(i) && (s = i.$cursor), s) {
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
var $C = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: a } = s, l = Kt(n, r.schema);
  if (i)
    if (o) {
      const c = Op(r, l);
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
          f.marks.find((v) => v.type === l) ? f.marks.forEach((v) => {
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
  return RC(r, t, l);
}, BC = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), LC = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = Te(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: a }) => cu(s, { ...o, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => cu(s, { ...o, ...e })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, FC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = xn(n, 0, r.content.size), s = Y.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, zC = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, a;
  return typeof e == "number" ? (o = e, a = e) : e && "from" in e && "to" in e ? (o = e.from, a = e.to) : (o = s.from, a = s.to), i && t.doc.nodesBetween(o, a, (l, c) => {
    l.isText || t.setNodeMarkup(c, void 0, {
      ...l.attrs,
      dir: n
    });
  }), !0;
}, qC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = ee.atStart(r).from, a = ee.atEnd(r).to, l = xn(i, o, a), c = xn(s, o, a), u = ee.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, VC = (n) => ({ state: e, dispatch: t }) => {
  const r = Te(n, e.schema);
  return Rk(r)(e, t);
};
function Gu(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var WC = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, u = Ki(c, a.node().type.name, a.node().attrs);
  if (s instanceof Y && s.node.isBlock)
    return !a.parentOffset || !Bt(o, a.pos) ? !1 : (r && (n && Gu(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const d = l.parentOffset === l.parent.content.size, f = a.depth === 0 ? void 0 : bC(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Bt(e.doc, e.mapping.map(a.pos), 1, h);
  if (!h && !p && Bt(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof ee && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, h), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), g = e.doc.resolve(m);
      a.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && Gu(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, UC = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const a = Te(n, r.schema), { $from: l, $to: c } = r.selection, u = r.selection.node;
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
      let v = N.empty;
      const w = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let M = l.depth - w; M >= l.depth - 3; M -= 1)
        v = N.from(l.node(M).copy(v));
      const b = (
        // eslint-disable-next-line no-nested-ternary
        l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3
      ), S = {
        ...Ki(f, l.node().type.name, l.node().attrs),
        ...e
      }, C = ((o = a.contentMatch.defaultType) == null ? void 0 : o.createAndFill(S)) || void 0;
      v = v.append(N.from(a.createAndFill(null, C) || void 0));
      const T = l.before(l.depth - (w - 1));
      t.replace(T, l.after(-b), new W(v, 4 - w, 0));
      let k = -1;
      t.doc.nodesBetween(T, t.doc.content.size, (M, x) => {
        if (k > -1)
          return !1;
        M.isTextblock && M.content.size === 0 && (k = x + 1);
      }), k > -1 && t.setSelection(ee.near(t.doc.resolve(k))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === l.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Ki(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Ki(f, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const g = h ? [
    { type: a, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: a, attrs: p }];
  if (!Bt(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: v, storedMarks: w } = r, { splittableMarks: b } = s.extensionManager, S = w || v.$to.parentOffset && v.$from.marks();
    if (t.split(l.pos, 2, g).scrollIntoView(), !S || !i)
      return !0;
    const C = S.filter((T) => b.includes(T.type.name));
    t.ensureMarks(C);
  }
  return !0;
}, Wo = (n, e) => {
  const t = ql((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Wn(n.doc, t.pos) && n.join(t.pos), !0;
}, Uo = (n, e) => {
  const t = ql((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && Wn(n.doc, r) && n.join(r), !0;
}, HC = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = Te(n, o.schema), p = Te(e, o.schema), { selection: m, storedMarks: g } = o, { $from: v, $to: w } = m, b = v.blockRange(w), S = g || m.$to.parentOffset && m.$from.marks();
  if (!b)
    return !1;
  const C = ql((T) => Yu(T.type.name, d))(m);
  if (b.depth >= 1 && C && b.depth - C.depth <= 1) {
    if (C.node.type === h)
      return c.liftListItem(p);
    if (Yu(C.node.type.name, d) && h.validContent(C.node.content) && a)
      return l().command(() => (s.setNodeMarkup(C.pos, h), !0)).command(() => Wo(s, h)).command(() => Uo(s, h)).run();
  }
  return !t || !S || !a ? l().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => Wo(s, h)).command(() => Uo(s, h)).run() : l().command(() => {
    const T = u().wrapInList(h, r), k = S.filter((M) => f.includes(M.type.name));
    return s.ensureMarks(k), T ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => Wo(s, h)).command(() => Uo(s, h)).run();
}, jC = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = Kt(n, r.schema);
  return Ba(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, KC = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = Te(n, r.schema), o = Te(e, r.schema), a = ii(r, s, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), a ? i.setNode(o, l) : i.setNode(s, { ...l, ...t });
}, JC = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = Te(n, t.schema);
  return ii(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, XC = () => ({ state: n, dispatch: e }) => {
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
}, YC = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, GC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = t, l = Kt(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = a;
    const p = (s = c.marks().find((g) => g.type === l)) == null ? void 0 : s.attrs, m = Cp(c, l, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, QC = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (a, l) => {
    if (a.isText)
      return;
    const c = { ...a.attrs };
    delete c.dir, e.setNodeMarkup(l, void 0, c);
  }), !0;
}, ZC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = to(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Te(n, r.schema)), a === "mark" && (o = Kt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    const u = c.$from.pos, d = c.$to.pos;
    let f, h, p, m;
    t.selection.empty ? r.doc.nodesBetween(u, d, (g, v) => {
      s && s === g.type && (l = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), f = v, h = g);
    }) : r.doc.nodesBetween(u, d, (g, v) => {
      v < u && s && s === g.type && (l = !0, p = Math.max(v, u), m = Math.min(v + g.nodeSize, d), f = v, h = g), v >= u && v <= d && (s && s === g.type && (l = !0, i && t.setNodeMarkup(v, void 0, {
        ...g.attrs,
        ...e
      })), o && g.marks.length && g.marks.forEach((w) => {
        if (o === w.type && (l = !0, i)) {
          const b = Math.max(v, u), S = Math.min(v + g.nodeSize, d);
          t.addMark(
            b,
            S,
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
  }), l;
}, eT = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Te(n, t.schema);
  return Ak(i, e)(t, r);
}, tT = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Te(n, t.schema);
  return Ok(i, e)(t, r);
}, nT = class {
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
}, rT = (n, e) => {
  if (zl(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function $i(n) {
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
  const d = PC(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = rT(d, f.find);
    if (!h)
      return;
    const p = l.state.tr, m = Zs({
      state: l.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: v, chain: w, can: b } = new eo({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: v,
      chain: w,
      can: b
    }) === null || !p.steps.length || (f.undoable && p.setMeta(a, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), l.dispatch(p), u = !0);
  }), u;
}
function iT(n) {
  const { editor: e, rules: t } = n, r = new Re({
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
          typeof u == "string" ? u = u : u = Wl(N.from(u), o.schema);
          const { from: d } = l, f = d + u.length;
          $i({
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
        return $i({
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
          s && $i({
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
        return o ? $i({
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
function sT(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Bi(n) {
  return sT(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Lp(n, e) {
  const t = { ...n };
  return Bi(n) && Bi(e) && Object.keys(e).forEach((r) => {
    Bi(e[r]) && Bi(n[r]) ? t[r] = Lp(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var Kl = class {
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
      ...ge(
        K(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...ge(
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
      addOptions: () => Lp(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, oT = class Fp extends Kl {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Fp(t);
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
function aT(n) {
  return typeof n == "number";
}
var lT = (n, e, t) => {
  if (zl(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function cT(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: a } = n, { commands: l, chain: c, can: u } = new eo({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, v, w, b;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const S = (b = (w = (v = h.content) == null ? void 0 : v.size) != null ? w : h.nodeSize) != null ? b : 0, C = Math.max(r, p), T = Math.min(i, p + S);
    if (C >= T)
      return;
    const k = h.isText ? h.text || "" : h.textBetween(C - p, T - p, void 0, "￼");
    lT(k, s.find, o).forEach((x) => {
      if (x.index === void 0)
        return;
      const A = C + x.index + 1, P = A + x[0].length, $ = {
        from: t.tr.mapping.map(A),
        to: t.tr.mapping.map(P)
      }, q = s.handler({
        state: t,
        range: $,
        match: x,
        commands: l,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: a
      });
      d.push(q);
    });
  }), d.every((h) => h !== null);
}
var Li = null, uT = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function dT(n) {
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
    const m = u.tr, g = Zs({
      state: u,
      transaction: m
    });
    if (!(!cT({
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
  return t.map((u) => new Re({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (Li = e);
      }, h = () => {
        Li && (Li = null);
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
            const h = Li;
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
        let { text: C } = v;
        typeof C == "string" ? C = C : C = Wl(N.from(C), h.schema);
        const { from: T } = v, k = T + C.length, M = uT(C);
        return l({
          rule: u,
          state: h,
          from: T,
          to: { b: k },
          pasteEvt: M
        });
      }
      const b = f.doc.content.findDiffStart(h.doc.content), S = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!aT(b) || !S || b === S.b))
        return l({
          rule: u,
          state: h,
          from: b,
          to: S,
          pasteEvt: o
        });
    }
  }));
}
var no = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = Ul(n), this.schema = Ip(this.extensions, e), this.setupExtensions();
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
        type: Mr(e.name, this.schema)
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
        type: Mr(r.name, this.schema)
      }, s = [], o = K(
        r,
        "addKeyboardShortcuts",
        i
      );
      let a = {};
      if (r.type === "mark" && K(r, "exitable", i) && (a.ArrowRight = () => oT.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        a = { ...a, ...f };
      }
      const l = Tx(a);
      s.push(l);
      const c = K(r, "addInputRules", i);
      if (Xu(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = iT({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = K(r, "addPasteRules", i);
      if (Xu(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = dT({ editor: n, rules: f });
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
    return Dp(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = mr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!K(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Te(t.name, this.schema)
        }, s = K(t, "addNodeView", i);
        if (!s)
          return [];
        const o = s();
        if (!o)
          return [];
        const a = (l, c, u, d, f) => {
          const h = Cs(l, r);
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
        type: Mr(i.name, this.schema)
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
          type: Mr(i.name, this.schema)
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
    const { editor: n } = this, { markExtensions: e } = mr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!K(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Kt(t.name, this.schema)
        }, s = K(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (a, l, c) => {
          const u = Cs(a, r);
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
              TT(a, n, d);
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
        type: Mr(e.name, this.schema)
      };
      e.type === "mark" && ((t = ge(K(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = K(e, "onBeforeCreate", r), s = K(e, "onCreate", r), o = K(e, "onUpdate", r), a = K(
        e,
        "onSelectionUpdate",
        r
      ), l = K(e, "onTransaction", r), c = K(e, "onFocus", r), u = K(e, "onBlur", r), d = K(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), a && this.editor.on("selectionUpdate", a), l && this.editor.on("transaction", l), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
no.resolve = Ul;
no.sort = zr;
no.flatten = Vl;
var fT = {};
Fl(fT, {
  ClipboardTextSerializer: () => qp,
  Commands: () => Vp,
  Delete: () => Wp,
  Drop: () => Up,
  Editable: () => Hp,
  FocusEvents: () => Kp,
  Keymap: () => Jp,
  Paste: () => Xp,
  Tabindex: () => Yp,
  TextDirection: () => Gp,
  focusEventsPluginKey: () => jp
});
var rt = class zp extends Kl {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new zp(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, qp = rt.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new Re({
        key: new nt("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), a = Math.max(...s.map((u) => u.$to.pos)), l = Rp(t);
            return Np(r, { from: o, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), Vp = rt.create({
  name: "commands",
  addCommands() {
    return {
      ...kp
    };
  }
}), Wp = rt.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, a, l, c;
      if ((c = (l = (a = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : a.filterTransaction) == null ? void 0 : l.call(a, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = vC(n.before, [n, ...e]);
      DC(u).forEach((h) => {
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
        if (h instanceof mt) {
          const v = f.slice(p).map(h.from, -1), w = f.slice(p).map(h.to), b = f.invert().map(v, -1), S = f.invert().map(w), C = (m = u.doc.nodeAt(v - 1)) == null ? void 0 : m.marks.some((k) => k.eq(h.mark)), T = (g = u.doc.nodeAt(w)) == null ? void 0 : g.marks.some((k) => k.eq(h.mark));
          this.editor.emit("delete", {
            type: "mark",
            mark: h.mark,
            from: h.from,
            to: h.to,
            deletedRange: {
              from: b,
              to: S
            },
            newRange: {
              from: v,
              to: w
            },
            partial: !!(T || C),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (i = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || i ? setTimeout(s, 0) : s();
  }
}), Up = rt.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new Re({
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
}), Hp = rt.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Re({
        key: new nt("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), jp = new nt("focusEvents"), Kp = rt.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Re({
        key: jp,
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
}), Jp = rt.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, v = m && p.parent.childCount === 1 ? g === d.pos : ne.atStart(c).from === f;
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
    return ni() || Ap() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Re({
        key: new nt("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: a } = e.selection, l = ne.atStart(e.doc).from, c = ne.atEnd(e.doc).to;
          if (s || !(o === l && a === c) || !Hl(t.doc))
            return;
          const f = t.tr, h = Zs({
            state: t,
            transaction: f
          }), { commands: p } = new eo({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), Xp = rt.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new Re({
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
}), Yp = rt.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Re({
        key: new nt("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), Gp = rt.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = mr(this.extensions);
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
      new Re({
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
}), hT = class Dr {
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
    return new Dr(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new Dr(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new Dr(e, this.editor);
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
      const c = new Dr(l, this.editor, i, i || o ? t : null);
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
}, pT = `.ProseMirror {
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
function mT(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var gT = class extends nT {
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
      getUpdatedPosition: Bp,
      createMappablePosition: NC
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = Ep(t, this.options.autofocus);
    this.editorState = nr.create({
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
    this.options.injectCSS && typeof document < "u" && (this.css = mT(pT, this.options.injectNonce));
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
    const r = _p(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
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
      Hp,
      qp.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      Vp,
      Kp,
      Jp,
      Yp,
      Up,
      Xp,
      Wp,
      Gp.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new no(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new eo({
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
      e = $a(this.options.content, this.schema, this.options.parseOptions, {
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
      }), e = $a(this.options.content, this.schema, this.options.parseOptions, {
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
    this.editorView = new Sp(e, {
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
    return AC(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return IC(this.state, r, i);
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
    return Wl(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return EC(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...Rp(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return Hl(this.state.doc);
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
    return new hT(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, yT = {};
Fl(yT, {
  createAtomBlockMarkdownSpec: () => vT,
  createBlockMarkdownSpec: () => bT,
  createInlineMarkdownSpec: () => kT,
  parseAttributes: () => Jl,
  parseIndentedBlocks: () => xT,
  renderNestedMarkdownContent: () => CT,
  serializeAttributes: () => Xl
});
function Jl(n) {
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
function Xl(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function vT(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = Jl,
    serializeAttributes: i = Xl,
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
      return `:::${l}${h} :::`;
    }
  };
}
function bT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Jl,
    serializeAttributes: s = Xl,
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
        const [v, w = ""] = g, b = i(w);
        let S = 1;
        const C = v.length;
        let T = "";
        const k = /^:::([\w-]*)(\s.*)?/gm, M = d.slice(C);
        for (k.lastIndex = 0; ; ) {
          const x = k.exec(M);
          if (x === null)
            break;
          const A = x.index, P = x[1];
          if (!((p = x[2]) != null && p.endsWith(":::"))) {
            if (P)
              S += 1;
            else if (S -= 1, S === 0) {
              const $ = M.slice(0, A);
              T = $.trim();
              const q = d.slice(0, C + A + x[0].length);
              let R = [];
              if (T)
                if (a === "block")
                  for (R = h.blockTokens($), R.forEach((F) => {
                    F.text && (!F.tokens || F.tokens.length === 0) && (F.tokens = h.inlineTokens(F.text));
                  }); R.length > 0; ) {
                    const F = R[R.length - 1];
                    if (F.type === "paragraph" && (!F.text || F.text.trim() === ""))
                      R.pop();
                    else
                      break;
                  }
                else
                  R = h.inlineTokens(T);
              return {
                type: e,
                raw: q,
                attributes: b,
                content: T,
                tokens: R
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
function wT(n) {
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
function ST(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function kT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = wT,
    serializeAttributes: s = ST,
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
        let v = "", w = "";
        if (a) {
          const [, S] = g;
          w = S;
        } else {
          const [, S, C] = g;
          w = S, v = C || "";
        }
        const b = i(w.trim());
        return {
          type: e,
          raw: g[0],
          content: v.trim(),
          attributes: b
        };
      }
    },
    renderMarkdown: (f) => {
      let h = "";
      r ? h = r(f) : f.content && f.content.length > 0 && (h = f.content.filter((v) => v.type === "text").map((v) => v.text).join(""));
      const p = u(f.attrs || {}), m = s(p), g = m ? ` ${m}` : "";
      return a ? `[${c}${g}]` : `[${c}${g}]${h}[/${c}]`;
    }
  };
}
function xT(n, e, t) {
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
    const v = [g];
    for (u += 1; u < a.length; ) {
      const C = a[u];
      if (C.trim() === "") {
        const k = a.slice(u + 1).findIndex((A) => A.trim() !== "");
        if (k === -1)
          break;
        if ((((i = (r = a[u + 1 + k].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          v.push(C), c = `${c}${C}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = C.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        v.push(C), c = `${c}${C}
`, u += 1;
      else
        break;
    }
    let w;
    const b = v.slice(1);
    if (b.length > 0) {
      const C = b.map((T) => T.slice(m + d)).join(`
`);
      C.trim() && (e.customNestedParser ? w = e.customNestedParser(C) : w = t.blockTokens(C));
    }
    const S = e.createToken(p, w);
    l.push(S);
  }
  if (l.length !== 0)
    return {
      items: l,
      raw: c
    };
}
function CT(n, e, t, r) {
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
function TT(n, e, t = {}) {
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
var Yl = class Qp extends Kl {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
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
}, ET = class {
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
      const w = this.dom.getBoundingClientRect(), b = u.getBoundingClientRect(), S = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, C = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = b.x - w.x + S, f = b.y - w.y + C;
    }
    const h = this.dom.cloneNode(!0);
    try {
      const w = this.dom.getBoundingClientRect();
      h.style.width = `${Math.round(w.width)}px`, h.style.height = `${Math.round(w.height)}px`, h.style.boxSizing = "border-box", h.style.pointerEvents = "none";
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
    const g = Y.create(l.state.doc, m), v = l.state.tr.setSelection(g);
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
    const { isEditable: a } = this.editor, { isDragging: l } = this, c = !!this.node.type.spec.draggable, u = Y.isSelectable(this.node), d = n.type === "copy", f = n.type === "paste", h = n.type === "cut", p = n.type === "mousedown";
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
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (ni() || Ra()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
function Qu(n) {
  return Dd((e, t) => ({
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
var MT = class extends gT {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = Qu(this.view.state), this.reactiveExtensionStorage = Qu(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), Za(this);
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
}, AT = B({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = D(), t = pn();
    return tt(() => {
      const r = n.editor;
      r && r.options.element && e.value && ae(() => {
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
    }), Ht(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return Qe("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), OT = B({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return Qe(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), _T = B({
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
    return Qe(
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
}), DT = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = Za(n), this.el = document.createElement("div"), this.props = Qa(e), this.renderedComponent = this.renderComponent();
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
    let n = Qe(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && fc(n, this.el), { vNode: n, destroy: () => {
      this.el && fc(null, this.el), this.el = null, n = null;
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
    return Qe(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var PT = class extends ET {
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
        return _n("onDragStart", e), _n("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new DT(t, {
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
function IT(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new PT(r, t, e);
  };
}
const NT = { class: "transcription-panel" }, RT = {
  ref: "scrollContainer",
  class: "scroll-container"
}, $T = { class: "turns-container" }, BT = {
  key: 0,
  class: "history-loading",
  role: "status"
}, LT = {
  key: 1,
  class: "history-start"
}, FT = /* @__PURE__ */ B({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = Fe(), r = ft(), i = qt("scrollContainer"), s = O(() => {
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
    }), o = O(() => r.transcriptionEditor?.tiptapEditor.value), a = O(() => r.live?.hasLiveUpdate.value ?? !1), l = O(() => r.audio?.isPlaying.value ?? !1), c = O(
      () => r.activeChannel.value?.activeTranslation.value
    ), u = O(() => r.activeChannel.value), d = O(
      () => u.value?.isLoadingHistory.value ?? !1
    ), f = O(() => u.value?.hasMoreHistory.value ?? !1), { isFollowing: h, resumeFollow: p } = wS(i), { scrollRef: m, contentRef: g, isAtBottom: v, scrollToBottom: w } = Ay();
    me(() => {
      m.value = i.value, g.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const b = O(
      () => !h.value && l.value || !v.value && a.value
    );
    function S() {
      l.value ? p() : w();
    }
    const C = jg(() => {
      const k = u.value;
      if (!k?.hasMoreHistory.value || k.isLoadingHistory.value || e.turns.length === 0) return;
      const M = c.value;
      M && r.emit("scroll:top", { translationId: M.id });
    }, 500);
    function T() {
      const k = i.value;
      k && k.scrollTop < 100 && C();
    }
    return Z(
      () => e.turns,
      (k, M) => {
        const x = k.length, A = M.length;
        if (x > A && !v.value && k[0]?.id != M[0]?.id) {
          const P = x - A, $ = e.turns[P]?.id;
          if (!$ || !m.value) return;
          ae(() => {
            m.value?.querySelector(
              `[data-turn-id="${$}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), me(() => {
      i.value?.addEventListener("scroll", T, {
        passive: !0
      });
    }), Ht(() => {
      i.value?.removeEventListener("scroll", T);
    }), (k, M) => (E(), V("article", NT, [
      H("div", RT, [
        H("div", $T, [
          d.value ? (E(), V("div", BT, [...M[2] || (M[2] = [
            H("progress", null, null, -1)
          ])])) : X("", !0),
          !f.value && n.turns.length > 0 ? (E(), V("div", LT, J(y(t)("transcription.historyStart")), 1)) : X("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (E(), I(vS, {
            key: 2,
            class: "transcription-empty"
          })) : X("", !0),
          o.value ? (E(), I(y(AT), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (E(!0), V(Ie, { key: 4 }, _t(n.turns, (x, A, P, $) => {
            const q = [x, n.speakers.get(x.speakerId ?? ""), a.value && !s.value && A === n.turns.length - 1];
            if ($ && $.key === x.id && kg($, q)) return $;
            const R = (E(), I(Wc, {
              "data-turn-id": x.id,
              key: x.id,
              turn: x,
              speaker: x.speakerId ? n.speakers.get(x.speakerId) : void 0,
              live: a.value && !s.value && A === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return R.memo = q, R;
          }, M, 0), 128)),
          s.value ? (E(), I(Wc, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : X("", !0)
        ]),
        L(el, { name: "fade-slide" }, {
          default: _(() => [
            b.value ? (E(), I(xe, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": y(t)("transcription.resumeScroll"),
              onClick: S
            }, {
              icon: _(() => [
                L(y(Vd), { size: 14 })
              ]),
              default: _(() => [
                pe(" " + J(y(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : X("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), zT = /* @__PURE__ */ de(FT, [["__scopeId", "data-v-472af2c0"]]), qT = { class: "switch" }, VT = ["id", "checked"], WT = ["for"], UT = /* @__PURE__ */ B({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? Fd();
    return (s, o) => (E(), V("div", qT, [
      H("input", {
        type: "checkbox",
        id: y(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, VT),
      H("label", { for: y(i) }, [...o[1] || (o[1] = [
        H("div", { class: "switch-slider" }, null, -1)
      ])], 8, WT)
    ]));
  }
}), Ho = /* @__PURE__ */ de(UT, [["__scopeId", "data-v-2aa0332f"]]), HT = {
  key: 0,
  class: "form-field__header"
}, jT = ["for"], KT = {
  key: 0,
  class: "form-field__required",
  "aria-hidden": "true"
}, JT = { class: "form-field__input-wrapper" }, XT = ["type", "id", "disabled", "readonly", "placeholder", "autocomplete", "required", "aria-required", "aria-invalid", "aria-describedby"], YT = {
  key: 2,
  class: "form-field__actions"
}, GT = {
  key: 3,
  class: "form-field__actions form-field__actions--placeholder",
  "aria-hidden": "true"
}, QT = ["id"], ZT = { class: "form-field__error" }, eE = /* @__PURE__ */ B({
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
    inputId: {}
  },
  emits: ["update:modelValue", "input", "on-confirm", "on-cancel", "keydown", "blur", "focus"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, { t: s } = Fe(), o = Fd(), a = O(() => r.inputId ?? o), l = qt("input"), c = r.modelValue ?? r.field.value ?? "", u = D(c), d = D(c), f = O(() => r.disabled ?? r.field.disabled ?? !1), h = O(() => r.field.required ?? !1), p = O(() => r.field.error ?? null), m = O(() => !!p.value), g = O(() => r.field.type ?? "text"), v = O(() => r.field.placeholder ?? void 0), w = O(() => r.field.autocomplete ?? void 0), b = O(() => u.value !== d.value), S = O(
      () => r.withConfirmation && b.value
    ), C = O(() => ({
      "form-field": !0,
      [`form-field--${r.size}`]: !0,
      "form-field--inline": r.inline,
      "form-field--disabled": f.value,
      "form-field--error": m.value,
      "form-field--with-confirmation": r.withConfirmation
    })), T = O(() => ({
      "form-field__input": !0,
      "form-field__input--fullwidth": r.fullWidth,
      "form-field__input--error": m.value
    }));
    Z(
      () => r.modelValue,
      (P) => {
        P !== void 0 && P !== u.value && (u.value = P, d.value = P);
      }
    ), Z(
      () => r.field.value,
      (P) => {
        r.modelValue === void 0 && P !== void 0 && P !== u.value && (u.value = P, d.value = P);
      }
    );
    function k() {
      r.withConfirmation || (i("update:modelValue", u.value), i("input", u.value));
    }
    function M() {
      b.value && (d.value = u.value, i("update:modelValue", u.value), i("input", u.value), i("on-confirm"));
    }
    function x() {
      b.value && (u.value = d.value), i("on-cancel");
    }
    function A(P) {
      i("keydown", P), !(!r.withConfirmation || P.defaultPrevented) && (P.key === "Enter" && b.value ? (P.preventDefault(), M()) : P.key === "Escape" && (P.preventDefault(), x()));
    }
    return me(() => {
      r.focus && l.value?.focus();
    }), e({
      focus: () => l.value?.focus(),
      blur: () => l.value?.blur(),
      select: () => l.value?.select()
    }), (P, $) => (E(), V("div", {
      class: gt(C.value)
    }, [
      n.field.label ? (E(), V("div", HT, [
        H("label", {
          class: "form-field__label",
          for: a.value
        }, [
          pe(J(n.field.label) + " ", 1),
          h.value ? (E(), V("span", KT, "*")) : X("", !0)
        ], 8, jT),
        z(P.$slots, "content-after-label", {}, void 0, !0)
      ])) : X("", !0),
      H("div", JT, [
        z(P.$slots, "default", {}, void 0, !0),
        P.$slots["custom-input"] ? z(P.$slots, "custom-input", {
          key: 0,
          id: a.value,
          disabled: f.value
        }, void 0, !0) : tl((E(), V("input", re({
          key: 1,
          ref: "input",
          "onUpdate:modelValue": $[0] || ($[0] = (q) => u.value = q),
          class: T.value,
          type: g.value,
          id: a.value,
          disabled: f.value,
          readonly: n.readonly,
          placeholder: v.value,
          autocomplete: w.value,
          required: h.value,
          "aria-required": h.value || void 0,
          "aria-invalid": m.value || void 0,
          "aria-describedby": m.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onInput: k,
          onKeydown: A,
          onBlur: $[1] || ($[1] = (q) => i("blur", q)),
          onFocus: $[2] || ($[2] = (q) => i("focus", q))
        }), null, 16, XT)), [
          [xg, u.value]
        ]),
        S.value ? (E(), V("div", YT, [
          L(xe, {
            icon: "x",
            variant: "tertiary",
            size: n.size,
            "aria-label": y(s)("form.cancel"),
            onMousedown: $[3] || ($[3] = Ue(() => {
            }, ["prevent"])),
            onClick: x
          }, null, 8, ["size", "aria-label"]),
          L(xe, {
            icon: "check",
            variant: "primary",
            size: n.size,
            "aria-label": y(s)("form.apply"),
            onMousedown: $[4] || ($[4] = Ue(() => {
            }, ["prevent"])),
            onClick: M
          }, null, 8, ["size", "aria-label"])
        ])) : n.withConfirmation ? (E(), V("div", GT)) : X("", !0),
        z(P.$slots, "content-after-input", {}, void 0, !0)
      ]),
      z(P.$slots, "content-bottom-input", {}, void 0, !0),
      m.value ? (E(), V("div", {
        key: 1,
        id: `${a.value}-error`,
        class: "form-field__info"
      }, [
        H("span", ZT, J(p.value), 1)
      ], 8, QT)) : X("", !0)
    ], 2));
  }
}), Zp = /* @__PURE__ */ de(eE, [["__scopeId", "data-v-f7fddfcd"]]), tE = ["disabled", "aria-label"], nE = /* @__PURE__ */ B({
  __name: "EditableText",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue", "commit", "cancel"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = D(!1), s = D(t.modelValue), o = qt("input"), a = O(() => ({
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
      t.disabled || (s.value = t.modelValue, i.value = !0, await ae(), o.value?.focus(), o.value?.select());
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
    return (f, h) => i.value ? (E(), I(Zp, {
      key: 0,
      ref: "input",
      modelValue: s.value,
      "onUpdate:modelValue": h[0] || (h[0] = (p) => s.value = p),
      field: a.value,
      size: "sm",
      "full-width": "",
      onKeydown: d,
      onBlur: c
    }, null, 8, ["modelValue", "field"])) : (E(), V("button", {
      key: 1,
      type: "button",
      class: "editable-text-display",
      disabled: n.disabled,
      "aria-label": n.ariaLabel,
      onClick: l
    }, J(n.modelValue || n.placeholder), 9, tE));
  }
}), rE = /* @__PURE__ */ de(nE, [["__scopeId", "data-v-511d4fb4"]]), iE = {
  key: 0,
  class: "popover-list__items"
}, sE = {
  key: 0,
  class: "popover-list__divider"
}, oE = { class: "popover-list__footer" }, em = /* @__PURE__ */ B({
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
    const t = n, r = e, i = D(!1), s = O({
      get: () => t.open !== void 0 ? i.value : t.open,
      set: (a) => {
        i.value = a, r("update:open", a);
      }
    });
    function o(a, l) {
      return t.itemKey ? t.itemKey(a) : l;
    }
    return (a, l) => (E(), I(y(fw), {
      open: s.value,
      "onUpdate:open": l[0] || (l[0] = (c) => s.value = c)
    }, {
      default: _(() => [
        L(y(ww), { "as-child": "" }, {
          default: _(() => [
            z(a.$slots, "trigger")
          ]),
          _: 3
        }),
        L(y(vw), { disabled: "" }, {
          default: _(() => [
            L(y(pw), {
              class: "popover-list",
              "position-strategy": "absolute",
              side: n.side,
              align: n.align,
              "side-offset": n.sideOffset
            }, {
              default: _(() => [
                n.items.length > 0 ? (E(), V("ul", iE, [
                  (E(!0), V(Ie, null, _t(n.items, (c, u) => (E(), I(y(gw), {
                    key: o(c, u),
                    as: "li",
                    class: gt(["popover-list__item", { "popover-list__item--current": n.isCurrent?.(c) }]),
                    onSelect: (d) => r("select", c)
                  }, {
                    default: _(() => [
                      z(a.$slots, "item", { item: c })
                    ]),
                    _: 2
                  }, 1032, ["class", "onSelect"]))), 128))
                ])) : X("", !0),
                a.$slots.footer ? (E(), V(Ie, { key: 1 }, [
                  n.items.length > 0 ? (E(), V("div", sE)) : X("", !0),
                  H("div", oE, [
                    z(a.$slots, "footer")
                  ])
                ], 64)) : X("", !0)
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
}), aE = /* @__PURE__ */ B({
  __name: "SpeakerMenu",
  emits: ["merge"],
  setup(n, { emit: e }) {
    const t = e, { t: r } = Fe(), i = O(() => [
      { id: "merge", label: r("speakerMenu.merge") }
    ]);
    function s(o) {
      o.id === "merge" && t("merge");
    }
    return (o, a) => (E(), I(em, {
      items: i.value,
      "item-key": (l) => l.id,
      align: "end",
      onSelect: s
    }, {
      trigger: _(() => [
        L(xe, {
          icon: "more-vertical",
          variant: "transparent",
          "aria-label": y(r)("speakerMenu.openMenu")
        }, null, 8, ["aria-label"])
      ]),
      item: _(({ item: l }) => [
        H("span", null, J(l.label), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
});
function lE(n) {
  const e = n.speakers.all.size;
  return lr[e % lr.length];
}
function tm(n, e) {
  let t = null;
  return n.state.doc.descendants((r, i) => {
    if (t !== null) return !1;
    if (r.type.name === "turn" && r.attrs.id === e)
      return t = i, !1;
  }), t;
}
function nm(n, e) {
  const t = [];
  return n.state.doc.descendants((r, i) => {
    r.type.name === "turn" && r.attrs.speakerId === e && t.push({ pos: i, turnId: r.attrs.id, attrs: { ...r.attrs } });
  }), t;
}
function cE(n, e) {
  return nm(n, e).length;
}
function uE(n, e, t) {
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
function dE(n, e, t) {
  const r = n.transcriptionEditor?.tiptapEditor.value;
  if (!r) return;
  const i = tm(r, e);
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
function fE(n, e, t) {
  const r = t.trim();
  if (!r) return null;
  const i = n.transcriptionEditor?.tiptapEditor.value, s = n.transcriptionEditor?.speakersMap, o = n.transcriptionEditor?.doc;
  if (!i || !s || !o) return null;
  const a = tm(i, e);
  if (a === null) return null;
  const l = crypto.randomUUID(), c = lE(n), u = {
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
function hE(n, e, t) {
  if (e === t) return;
  const r = n.transcriptionEditor?.tiptapEditor.value, i = n.transcriptionEditor?.speakersMap, s = n.transcriptionEditor?.doc;
  if (!r || !i || !s || !i.has(e) || !i.has(t)) return;
  const o = nm(r, e), a = {
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
const pE = { class: "merge-dialog-title" }, mE = { class: "merge-dialog-description" }, gE = { class: "merge-dialog-label" }, yE = ["value"], vE = { class: "merge-dialog-actions" }, bE = /* @__PURE__ */ B({
  __name: "MergeDialog",
  props: {
    open: { type: Boolean },
    fromSpeakerId: {}
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = ft(), { t: s } = Fe(), o = qt("dialog"), a = D(""), l = O(
      () => t.fromSpeakerId ? i.speakers.all.get(t.fromSpeakerId) : void 0
    ), c = O(
      () => Array.from(i.speakers.all.values()).filter(
        (h) => h.id !== t.fromSpeakerId
      )
    ), u = O(() => {
      const h = i.transcriptionEditor?.tiptapEditor.value;
      return !h || !t.fromSpeakerId ? 0 : cE(h, t.fromSpeakerId);
    });
    Z(
      () => t.open,
      (h) => {
        h ? (a.value = c.value[0]?.id ?? "", o.value?.showModal()) : o.value?.close();
      }
    );
    function d() {
      r("update:open", !1);
    }
    function f() {
      !t.fromSpeakerId || !a.value || (hE(i, t.fromSpeakerId, a.value), r("update:open", !1));
    }
    return (h, p) => (E(), V("dialog", {
      ref: "dialog",
      class: "merge-dialog",
      onClose: d,
      onCancel: Ue(d, ["prevent"])
    }, [
      l.value ? (E(), V("form", {
        key: 0,
        class: "merge-dialog-form",
        onSubmit: Ue(f, ["prevent"])
      }, [
        H("h2", pE, J(y(s)("mergeDialog.title")), 1),
        H("p", mE, [
          H("strong", null, J(l.value.name), 1),
          pe(" · " + J(u.value) + " " + J(y(s)("mergeDialog.turnsAffected")), 1)
        ]),
        H("label", gE, [
          pe(J(y(s)("mergeDialog.targetLabel")) + " ", 1),
          tl(H("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (m) => a.value = m),
            class: "merge-dialog-select",
            required: ""
          }, [
            (E(!0), V(Ie, null, _t(c.value, (m) => (E(), V("option", {
              key: m.id,
              value: m.id
            }, J(m.name), 9, yE))), 128))
          ], 512), [
            [Cg, a.value]
          ])
        ]),
        H("div", vE, [
          L(xe, {
            variant: "tertiary",
            type: "button",
            onClick: d
          }, {
            default: _(() => [
              pe(J(y(s)("mergeDialog.cancel")), 1)
            ]),
            _: 1
          }),
          L(xe, {
            variant: "primary",
            type: "submit",
            disabled: !a.value
          }, {
            default: _(() => [
              pe(J(y(s)("mergeDialog.confirm")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : X("", !0)
    ], 544));
  }
}), wE = /* @__PURE__ */ de(bE, [["__scopeId", "data-v-22e14078"]]), SE = "(max-width: 767px)";
function rm() {
  const n = D(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return me(() => {
    e = window.matchMedia(SE), n.value = e.matches, e.addEventListener("change", t);
  }), Ht(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const kE = { class: "sidebar-select-trigger-label" }, xE = /* @__PURE__ */ B({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = O(
      () => t.items.find((a) => a.value === t.selectedValue)
    ), s = D(), o = D([]);
    return me(() => {
      const a = s.value?.closest(".speaker-sidebar");
      a && (o.value = [a]);
    }), (a, l) => (E(), V("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: s
    }, [
      L(y(Ew), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedValue", c))
      }, {
        default: _(() => [
          L(y(tS), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: _(() => [
              H("span", kE, [
                z(a.$slots, "trigger", { item: i.value }, () => [
                  pe(J(i.value?.label ?? ""), 1)
                ])
              ]),
              L(y(Uw), null, {
                default: _(() => [
                  L(y(Wd), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 3
          }, 8, ["aria-label"]),
          L(y(Zw), { disabled: "" }, {
            default: _(() => [
              L(y(Vw), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": o.value
              }, {
                default: _(() => [
                  L(y(rS), null, {
                    default: _(() => [
                      (E(!0), V(Ie, null, _t(n.items, (c) => (E(), I(y(Kw), {
                        key: c.value,
                        value: c.value,
                        class: "sidebar-select-item"
                      }, {
                        default: _(() => [
                          L(y(Xw), { class: "sidebar-select-item-indicator" }, {
                            default: _(() => [
                              L(y(Ns), { size: 14 })
                            ]),
                            _: 1
                          }),
                          L(y(Gw), null, {
                            default: _(() => [
                              z(a.$slots, "item", { item: c }, () => [
                                pe(J(c.label), 1)
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
}), CE = { class: "sidebar-select" }, TE = ["aria-label"], EE = { class: "sidebar-select-trigger-label" }, ME = /* @__PURE__ */ B({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = D(!1), s = O(
      () => t.items.find((a) => a.value === t.selectedValue)
    );
    function o(a) {
      r("update:selectedValue", a), i.value = !1;
    }
    return (a, l) => (E(), V("div", CE, [
      H("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (c) => i.value = !0)
      }, [
        H("span", EE, [
          z(a.$slots, "trigger", { item: s.value }, () => [
            pe(J(s.value?.label ?? ""), 1)
          ])
        ])
      ], 8, TE),
      L(y(cf), {
        open: i.value,
        "onUpdate:open": l[2] || (l[2] = (c) => i.value = c)
      }, {
        default: _(() => [
          L(y(yf), { disabled: "" }, {
            default: _(() => [
              L(y(gf), { class: "editor-overlay" }),
              L(y(mf), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: _(() => [
                  L(y(vf), { class: "sr-only" }, {
                    default: _(() => [
                      pe(J(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = H("div", { class: "sheet-handle" }, null, -1)),
                  L(y(D0), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: _(() => [
                      L(y(I0), { class: "sheet-list" }, {
                        default: _(() => [
                          (E(!0), V(Ie, null, _t(n.items, (c) => (E(), I(y(L0), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: _(() => [
                              L(y(z0), { class: "sheet-item-indicator" }, {
                                default: _(() => [
                                  L(y(Ns), { size: 16 })
                                ]),
                                _: 1
                              }),
                              z(a.$slots, "item", { item: c }, () => [
                                pe(J(c.label), 1)
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
}), im = /* @__PURE__ */ B({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: r } = rm();
    return (i, s) => y(r) ? (E(), I(ME, re({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
    }), hc({ _: 2 }, [
      i.$slots.item ? {
        name: "item",
        fn: _(({ item: o }) => [
          z(i.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      i.$slots.trigger ? {
        name: "trigger",
        fn: _(({ item: o }) => [
          z(i.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040)) : (E(), I(xE, re({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => t("update:selectedValue", o))
    }), hc({ _: 2 }, [
      i.$slots.item ? {
        name: "item",
        fn: _(({ item: o }) => [
          z(i.$slots, "item", { item: o })
        ]),
        key: "0"
      } : void 0,
      i.$slots.trigger ? {
        name: "trigger",
        fn: _(({ item: o }) => [
          z(i.$slots, "trigger", { item: o })
        ]),
        key: "1"
      } : void 0
    ]), 1040));
  }
}), sm = /* @__PURE__ */ B({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = Fe(), s = O(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (E(), I(im, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: y(i)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), AE = { class: "translation-row" }, OE = {
  key: 0,
  class: "translation-row-badge"
}, _E = {
  key: 0,
  class: "translation-trigger-badge"
}, DE = /* @__PURE__ */ B({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = Fe(), o = O(
      () => Hg(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    return (a, l) => (E(), I(im, {
      items: o.value,
      "selected-value": n.selectedTranslationId,
      ariaLabel: y(i)("sidebar.translationLabel"),
      "onUpdate:selectedValue": l[0] || (l[0] = (c) => r("update:selectedTranslationId", c))
    }, {
      item: _(({ item: c }) => [
        H("span", AE, [
          c.originalLabel ? (E(), V("strong", OE, J(c.originalLabel), 1)) : X("", !0),
          H("span", null, J(c.label), 1)
        ])
      ]),
      trigger: _(({ item: c }) => [
        c?.originalLabel ? (E(), V("span", _E, J(c.originalLabel), 1)) : X("", !0),
        H("span", null, J(c?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), om = /* @__PURE__ */ de(DE, [["__scopeId", "data-v-77b61b2c"]]), PE = { class: "speaker-sidebar" }, IE = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, NE = { class: "sidebar-title" }, RE = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, $E = { class: "sidebar-title" }, BE = {
  key: 2,
  class: "sidebar-section"
}, LE = { class: "sidebar-title" }, FE = { class: "subtitle-toggle" }, zE = { class: "subtitle-toggle-label" }, qE = { class: "subtitle-slider" }, VE = { class: "subtitle-slider-label" }, WE = { class: "subtitle-slider-value" }, UE = ["value", "disabled"], HE = {
  key: 0,
  class: "subtitle-toggle"
}, jE = { class: "subtitle-toggle-label" }, KE = {
  key: 1,
  class: "subtitle-toggle"
}, JE = { class: "subtitle-toggle-label" }, XE = {
  key: 3,
  class: "sidebar-section"
}, YE = { class: "sidebar-title" }, GE = { class: "speaker-list" }, QE = /* @__PURE__ */ B({
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
    const e = ft(), { t } = Fe(), r = O(() => e.capabilities.value.speakers === "edit"), i = D(!1), s = D(null);
    function o(l, c) {
      uE(e, l, c);
    }
    function a(l) {
      s.value = l, i.value = !0;
    }
    return (l, c) => (E(), V("aside", PE, [
      n.channels.length > 1 ? (E(), V("section", IE, [
        H("h2", NE, J(y(t)("sidebar.channel")), 1),
        L(sm, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": c[0] || (c[0] = (u) => l.$emit("update:selectedChannelId", u))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : X("", !0),
      n.translations.length > 1 ? (E(), V("section", RE, [
        H("h2", $E, J(y(t)("sidebar.translation")), 1),
        L(om, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": c[1] || (c[1] = (u) => l.$emit("update:selectedTranslationId", u))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : X("", !0),
      y(e).subtitle ? (E(), V("section", BE, [
        H("h2", LE, J(y(t)("sidebar.subtitle")), 1),
        H("div", FE, [
          H("span", zE, J(y(t)("subtitle.show")), 1),
          L(Ho, {
            modelValue: y(e).subtitle.isVisible.value,
            "onUpdate:modelValue": c[2] || (c[2] = (u) => y(e).subtitle.isVisible.value = u)
          }, null, 8, ["modelValue"])
        ]),
        H("label", qE, [
          H("span", VE, [
            pe(J(y(t)("subtitle.fontSize")) + " ", 1),
            H("span", WE, J(y(e).subtitle.fontSize.value) + "px", 1)
          ]),
          H("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: y(e).subtitle.fontSize.value,
            disabled: !y(e).subtitle.isVisible.value,
            onInput: c[3] || (c[3] = (u) => y(e).subtitle.fontSize.value = Number(u.target.value))
          }, null, 40, UE)
        ]),
        y(e).subtitle.watermark && !y(e).subtitle.watermark.readonly ? (E(), V("div", HE, [
          H("span", jE, J(y(t)("subtitle.showWatermark")), 1),
          L(Ho, {
            modelValue: y(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": c[4] || (c[4] = (u) => y(e).subtitle.watermark.display.value = u),
            disabled: !y(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : X("", !0),
        y(e).subtitle.watermark && !y(e).subtitle.watermark.readonly && y(e).subtitle.watermark.display.value ? (E(), V("div", KE, [
          H("span", JE, J(y(t)("subtitle.pinWatermark")), 1),
          L(Ho, {
            modelValue: y(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": c[5] || (c[5] = (u) => y(e).subtitle.watermark.pinned.value = u),
            disabled: !y(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : X("", !0)
      ])) : X("", !0),
      n.speakers.length ? (E(), V("section", XE, [
        H("h2", YE, J(y(t)("sidebar.speakers")), 1),
        H("ul", GE, [
          (E(!0), V(Ie, null, _t(n.speakers, (u) => (E(), V("li", {
            key: u.id,
            class: "speaker-item"
          }, [
            L(sl, {
              color: u.color
            }, null, 8, ["color"]),
            L(rE, {
              class: "speaker-name",
              "model-value": u.name,
              disabled: !r.value,
              "aria-label": y(t)("sidebar.renameSpeaker"),
              onCommit: (d) => o(u.id, d)
            }, null, 8, ["model-value", "disabled", "aria-label", "onCommit"]),
            r.value && n.speakers.length > 1 ? (E(), I(aE, {
              key: 0,
              "speaker-name": u.name,
              onMerge: (d) => a(u.id)
            }, null, 8, ["speaker-name", "onMerge"])) : X("", !0)
          ]))), 128))
        ])
      ])) : X("", !0),
      r.value ? (E(), I(wE, {
        key: 4,
        open: i.value,
        "onUpdate:open": c[6] || (c[6] = (u) => i.value = u),
        "from-speaker-id": s.value
      }, null, 8, ["open", "from-speaker-id"])) : X("", !0)
    ]));
  }
}), Zu = /* @__PURE__ */ de(QE, [["__scopeId", "data-v-6ea39002"]]), ZE = /* @__PURE__ */ B({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = Tg(n, "open"), { t } = Fe();
    return (r, i) => (E(), I(y(cf), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: _(() => [
        L(y(yf), { disabled: "" }, {
          default: _(() => [
            L(y(gf), { class: "editor-overlay" }),
            L(y(mf), { class: "sidebar-drawer" }, {
              default: _(() => [
                L(y(vf), { class: "sr-only" }, {
                  default: _(() => [
                    pe(J(y(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                L(y(vv), {
                  class: "sidebar-close",
                  "aria-label": y(t)("header.closeSidebar")
                }, {
                  default: _(() => [
                    L(y(il), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                z(r.$slots, "default")
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
}), eM = { class: "player-controls" }, tM = { class: "controls-left" }, nM = { class: "controls-time" }, rM = { class: "time-display" }, iM = { class: "time-display" }, sM = { class: "controls-right" }, oM = ["value", "aria-label", "disabled"], aM = /* @__PURE__ */ B({
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
    const t = e, { t: r } = Fe(), i = D(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (E(), V("div", eM, [
      H("div", tM, [
        L(xe, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: _(() => [
            L(y(Kd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        L(xe, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? y(r)("player.pause") : y(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: _(() => [
            n.isPlaying ? (E(), I(y(Ud), {
              key: 0,
              size: 20
            })) : (E(), I(y(Hd), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        L(xe, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": y(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: _(() => [
            L(y(Jd), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      H("div", nM, [
        H("time", rM, J(n.currentTime), 1),
        a[7] || (a[7] = H("span", { class: "time-separator" }, "/", -1)),
        H("time", iM, J(n.duration), 1)
      ]),
      H("div", sM, [
        H("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          L(xe, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? y(r)("player.unmute") : y(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: _(() => [
              n.isMuted ? (E(), I(y(Gd), {
                key: 0,
                size: 16
              })) : (E(), I(y(Yd), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          tl(H("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": y(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, oM), [
            [Eg, i.value]
          ])
        ], 32),
        L(xe, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": y(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: _(() => [
            pe(J(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), lM = /* @__PURE__ */ de(aM, [["__scopeId", "data-v-99f700b1"]]);
function Ve(n, e, t, r) {
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
let Ti = class {
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
const Fi = { decode: function(n, e) {
  return Ve(this, void 0, void 0, (function* () {
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
function am(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(am(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function ed(n, e, t) {
  const r = am(n, e || {});
  return t?.appendChild(r), r;
}
var cM = Object.freeze({ __proto__: null, createElement: ed, default: ed });
const uM = { fetchBlob: function(n, e, t) {
  return Ve(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Ve(this, void 0, void 0, (function* () {
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
function ve(n) {
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
function wn(n, e) {
  const t = ve(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Gt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class dM extends Ti {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = ve(!1), this._currentTime = ve(0), this._duration = ve(0), this._volume = ve(this.media.volume), this._muted = ve(this.media.muted), this._playbackRate = ve(this.media.playbackRate || 1), this._seeking = ve(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    return Ve(this, void 0, void 0, (function* () {
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
function fM({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function hM({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function td(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function lm(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function nd(n, e) {
  if (!lm(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function rd({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function cm(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function pM(n) {
  const e = ve({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = wn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = wn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), cm(e);
  } };
}
class mM extends Ti {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = td(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = td(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = pM(this.scrollContainer);
    const e = Gt((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = ve(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let h = f.clientX, p = f.clientY, m = !1;
        const g = Date.now(), v = t.getBoundingClientRect(), { left: w, top: b } = v, S = (x) => {
          if (x.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const A = x.clientX, P = x.clientY, $ = A - h, q = P - p;
          (m || Math.abs($) > i || Math.abs(q) > i) && (x.preventDefault(), x.stopPropagation(), m || (a.set({ type: "start", x: h - w, y: p - b }), m = !0), a.set({ type: "move", x: A - w, y: P - b, deltaX: $, deltaY: q }), h = A, p = P);
        }, C = (x) => {
          if (l.delete(x.pointerId), m) {
            const A = x.clientX, P = x.clientY;
            a.set({ type: "end", x: A - w, y: P - b });
          }
          u();
        }, T = (x) => {
          l.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || C(x);
        }, k = (x) => {
          m && (x.stopPropagation(), x.preventDefault());
        }, M = (x) => {
          x.defaultPrevented || l.size > 1 || m && x.preventDefault();
        };
        document.addEventListener("pointermove", S), document.addEventListener("pointerup", C), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", M, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", M), setTimeout((() => {
            document.removeEventListener("click", k, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), l.clear(), cm(a);
      } };
    })(this.wrapper);
    const e = Gt((() => {
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
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: p, height: m, length: g, options: v, pixelRatio: w }) {
      const b = m / 2, S = v.barWidth ? v.barWidth * w : 1, C = v.barGap ? v.barGap * w : v.barWidth ? S / 2 : 0, T = S + C || 1;
      return { halfHeight: b, barWidth: S, barGap: C, barRadius: v.barRadius || 0, barMinHeight: v.barMinHeight ? v.barMinHeight * w : 0, barIndexScale: g > 0 ? p / T / g : 0, barSpacing: T };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: v, halfHeight: w, vScale: b, canvasHeight: S, barAlign: C, barMinHeight: T }) {
      const k = p[0] || [], M = p[1] || k, x = k.length, A = [];
      let P = 0, $ = 0, q = 0;
      for (let R = 0; R <= x; R++) {
        const F = Math.round(R * m);
        if (F > P) {
          const { topHeight: oe, totalHeight: ye } = fM({ maxTop: $, maxBottom: q, halfHeight: w, vScale: b, barMinHeight: T, barAlign: C }), Xe = hM({ barAlign: C, halfHeight: w, topHeight: oe, totalHeight: ye, canvasHeight: S });
          A.push({ x: P * g, y: Xe, width: v, height: ye }), P = F, $ = 0, q = 0;
        }
        const ie = Math.abs(k[R] || 0), Q = Math.abs(M[R] || 0);
        ie > $ && ($ = ie), Q > q && (q = Q);
      }
      return A;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const p of h) c && "roundRect" in r ? r.roundRect(p.x, p.y, p.width, p.height, c) : r.rect(p.x, p.y, p.width, p.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, h = l[0] || [];
      return [h, l[1] || h].map(((p, m) => {
        const g = p.length, v = g ? c / g : 0, w = f, b = m === 0 ? -1 : 1, S = [{ x: 0, y: w }];
        let C = 0, T = 0;
        for (let k = 0; k <= g; k++) {
          const M = Math.round(k * v);
          if (M > C) {
            const A = w + (Math.round(T * f * d) || 1) * b;
            S.push({ x: C, y: A }), C = M, T = 0;
          }
          const x = Math.abs(p[k] || 0);
          x > T && (T = x);
        }
        return S.push({ x: C, y: w }), S;
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
    lm(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
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
      return nd(Math.min(8e3, p, m), g);
    })({ clientWidth: l, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = nd(g, t), g <= 0) return;
      const v = (function({ channelData: w, offset: b, clampedWidth: S, totalWidth: C }) {
        return w.map(((T) => {
          const k = Math.floor(b / C * T.length), M = Math.floor((b + S) / C * T.length);
          return T.slice(k, M);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(v, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (rd({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), rd({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
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
    return Ve(this, void 0, void 0, (function* () {
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
    return Ve(this, void 0, void 0, (function* () {
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
class gM extends Ti {
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
class jo extends Ti {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Ve(this, void 0, void 0, (function* () {
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
    return Ve(this, void 0, void 0, (function* () {
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
    return Ve(this, void 0, void 0, (function* () {
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
const yM = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class si extends dM {
  static create(e) {
    return new si(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new jo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, yM, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, h;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : ve(0), m = (c = a?.duration) !== null && c !== void 0 ? c : ve(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : ve(!1), v = (d = a?.isSeeking) !== null && d !== void 0 ? d : ve(!1), w = (f = a?.volume) !== null && f !== void 0 ? f : ve(1), b = (h = a?.playbackRate) !== null && h !== void 0 ? h : ve(1), S = ve(null), C = ve(null), T = ve(""), k = ve(0), M = ve(0), x = wn((() => !g.value), [g]), A = wn((() => S.value !== null), [S]), P = wn((() => A.value && m.value > 0), [A, m]), $ = wn((() => p.value), [p]), q = wn((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: x, isSeeking: v, volume: w, playbackRate: b, audioBuffer: S, peaks: C, url: T, zoom: k, scrollPosition: M, canPlay: A, isReady: P, progress: $, progressPercent: q }, actions: { setCurrentTime: (R) => {
        const F = Math.max(0, Math.min(m.value || 1 / 0, R));
        p.set(F);
      }, setDuration: (R) => {
        m.set(Math.max(0, R));
      }, setPlaying: (R) => {
        g.set(R);
      }, setSeeking: (R) => {
        v.set(R);
      }, setVolume: (R) => {
        const F = Math.max(0, Math.min(1, R));
        w.set(F);
      }, setPlaybackRate: (R) => {
        const F = Math.max(0.1, Math.min(16, R));
        b.set(F);
      }, setAudioBuffer: (R) => {
        S.set(R), R && m.set(R.duration);
      }, setPeaks: (R) => {
        C.set(R);
      }, setUrl: (R) => {
        T.set(R);
      }, setZoom: (R) => {
        k.set(Math.max(0, R));
      }, setScrollPosition: (R) => {
        M.set(Math.max(0, R));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new gM();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new mM(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      r.push(Gt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Gt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Gt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Gt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Gt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Gt((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Fi.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Fi.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return Ve(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        t = yield uM.fetchBlob(e, l, a);
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
        a instanceof jo && (a.duration = o);
      }
      if (r) this.decodedData = Fi.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Fi.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return Ve(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return Ve(this, void 0, void 0, (function* () {
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
    return Ve(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof jo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return Ve(this, void 0, void 0, (function* () {
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
    return Ve(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
si.BasePlugin = class extends Ti {
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
}, si.dom = cM;
class um {
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
class vM extends um {
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
function dm(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(dm(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Pr(n, e, t) {
  const r = dm(n, e || {});
  return t?.appendChild(r), r;
}
function fm(n) {
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
function Ji(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Gn(n, e) {
  const t = fm(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function vn(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Xi(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = fm(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: v } = m, w = (k) => {
      if (k.defaultPrevented || o.size > 1 || a && Date.now() - p < i) return;
      const M = k.clientX, x = k.clientY, A = M - d, P = x - f;
      (h || Math.abs(A) > t || Math.abs(P) > t) && (k.preventDefault(), k.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - v }), h = !0), s.set({ type: "move", x: M - g, y: x - v, deltaX: A, deltaY: P }), d = M, f = x);
    }, b = (k) => {
      if (o.delete(k.pointerId), h) {
        const M = k.clientX, x = k.clientY;
        s.set({ type: "end", x: M - g, y: x - v });
      }
      l();
    }, S = (k) => {
      o.delete(k.pointerId), k.relatedTarget && k.relatedTarget !== document.documentElement || b(k);
    }, C = (k) => {
      h && (k.stopPropagation(), k.preventDefault());
    }, T = (k) => {
      k.defaultPrevented || o.size > 1 || h && k.preventDefault();
    };
    document.addEventListener("pointermove", w), document.addEventListener("pointerup", b), document.addEventListener("pointerout", S), document.addEventListener("pointercancel", S), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", b), document.removeEventListener("pointerout", S), document.removeEventListener("pointercancel", S), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", C, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", c), o.clear(), vn(s);
  } };
}
class id extends um {
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Pr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Pr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Xi(r, { threshold: 1 }), o = Xi(i, { threshold: 1 }), a = Ji((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Ji((() => {
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
    const i = Pr("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Gn(e, "click"), r = Gn(e, "mouseenter"), i = Gn(e, "mouseleave"), s = Gn(e, "dblclick"), o = Gn(e, "pointerdown"), a = Gn(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), h(), vn(t), vn(r), vn(i), vn(s), vn(o), vn(a);
    }));
    const p = Xi(e), m = Ji((() => {
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
        this.content = Pr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Gl extends vM {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Gl(e);
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
    return Pr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new id(e, i, s);
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
    const l = Xi(i, { threshold: t }), c = Ji((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * h;
        const g = f.x / m * h, v = (f.x + 5) / m * h;
        s = new id(Object.assign(Object.assign({}, e), { start: g, end: v }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const Ko = [0.5, 0.75, 1, 1.25, 1.5, 2];
function bM(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = an(null), o = an(null), a = D(0), l = D(0), c = D(!1), u = D(!1), d = D(!1), f = D(1), h = D(1), p = D(!1), m = O(() => Jr(a.value)), g = O(() => Jr(l.value));
  function v(R, F) {
    $(), d.value = !0, u.value = !1;
    const ie = Gl.create();
    o.value = ie;
    const Q = si.create({
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
      renderFunction: Jg,
      url: F,
      plugins: [ie]
    });
    Q.on("ready", () => {
      u.value = !0, d.value = !1, l.value = Q.getDuration(), w();
    }), Q.on("timeupdate", (oe) => {
      a.value = oe;
    }), Q.on("play", () => {
      c.value = !0;
    }), Q.on("pause", () => {
      c.value = !1;
    }), Q.on("finish", () => {
      c.value = !1;
    }), s.value = Q;
  }
  function w() {
    const R = o.value;
    if (R) {
      R.clearRegions();
      for (const F of r.value) {
        const ie = F.speakerId ? i.value.get(F.speakerId) : void 0;
        if (!ie || F.startTime == null || F.endTime == null) continue;
        const Q = ie.color;
        R.addRegion({
          start: F.startTime,
          end: F.endTime,
          color: Ug(Q, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Q);
      }
    }
  }
  function b() {
    s.value?.play();
  }
  function S() {
    s.value?.pause();
  }
  function C() {
    s.value?.playPause();
  }
  function T(R) {
    const F = s.value;
    !F || l.value === 0 || F.setTime(R);
  }
  function k(R) {
    T(Math.max(0, Math.min(a.value + R, l.value)));
  }
  function M(R) {
    const F = s.value;
    F && (f.value = R, F.setVolume(R), R > 0 && p.value && (p.value = !1, F.setMuted(!1)));
  }
  function x() {
    const R = s.value;
    R && (p.value = !p.value, R.setMuted(p.value));
  }
  function A(R) {
    const F = s.value;
    F && (h.value = R, F.setPlaybackRate(R));
  }
  function P() {
    const F = (Ko.indexOf(
      h.value
    ) + 1) % Ko.length;
    A(Ko[F] ?? 1);
  }
  function $() {
    q !== null && (clearTimeout(q), q = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  Z(
    [e, t],
    ([R, F]) => {
      R && F && v(R, F);
    },
    { immediate: !0 }
  );
  let q = null;
  return Z([r, i], () => {
    u.value && (q !== null && clearTimeout(q), q = setTimeout(() => {
      q = null, w();
    }, 150));
  }), Ht(() => {
    $();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: c,
    isReady: u,
    isLoading: d,
    volume: f,
    playbackRate: h,
    isMuted: p,
    formattedCurrentTime: m,
    formattedDuration: g,
    play: b,
    pause: S,
    togglePlay: C,
    seekTo: T,
    skip: k,
    setVolume: M,
    setPlaybackRate: A,
    cyclePlaybackRate: P,
    toggleMute: x
  };
}
const wM = { class: "audio-player" }, SM = /* @__PURE__ */ B({
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
      currentTime: f,
      formattedCurrentTime: h,
      formattedDuration: p,
      togglePlay: m,
      seekTo: g,
      pause: v,
      skip: w,
      setVolume: b,
      cyclePlaybackRate: S,
      toggleMute: C
    } = bM({
      containerRef: s,
      audioSrc: Vi(() => r.audioSrc),
      turns: Vi(() => r.turns),
      speakers: Vi(() => r.speakers)
    });
    return Z(f, (T) => i("timeupdate", T)), Z(o, (T) => i("playStateChange", T)), e({ seekTo: g, pause: v }), (T, k) => (E(), V("footer", wM, [
      H("div", {
        ref_key: "waveformRef",
        ref: s,
        class: gt(["waveform-container", { "waveform-container--loading": y(l) }])
      }, null, 2),
      L(lM, {
        "is-playing": y(o),
        "current-time": y(h),
        duration: y(p),
        volume: y(c),
        "playback-rate": y(u),
        "is-muted": y(d),
        "is-ready": y(a),
        onTogglePlay: y(m),
        onSkipBack: k[0] || (k[0] = (M) => y(w)(-10)),
        onSkipForward: k[1] || (k[1] = (M) => y(w)(10)),
        "onUpdate:volume": y(b),
        onToggleMute: y(C),
        onCyclePlaybackRate: y(S)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), kM = /* @__PURE__ */ de(SM, [["__scopeId", "data-v-9248e45e"]]);
class xM {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), a = this.removeEmpty(this.tokenize(s, r)), l = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, l, r, i);
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
    }, a = t.length, l = e.length;
    let c = 1, u = a + l;
    r.maxEditLength != null && (u = Math.min(u, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(h[0], t, e, 0, r);
    if (h[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(h[0].lastComponent, t, e));
    let m = -1 / 0, g = 1 / 0;
    const v = () => {
      for (let w = Math.max(m, -c); w <= Math.min(g, c); w += 2) {
        let b;
        const S = h[w - 1], C = h[w + 1];
        S && (h[w - 1] = void 0);
        let T = !1;
        if (C) {
          const M = C.oldPos - w;
          T = C && 0 <= M && M < a;
        }
        const k = S && S.oldPos + 1 < l;
        if (!T && !k) {
          h[w] = void 0;
          continue;
        }
        if (!k || T && S.oldPos < C.oldPos ? b = this.addToPath(C, !0, !1, 0, r) : b = this.addToPath(S, !1, !0, 1, r), p = this.extractCommon(b, t, e, w, r), b.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(b.lastComponent, t, e)) || !0;
        h[w] = b, b.oldPos + 1 >= l && (g = Math.min(g, w - 1)), p + 1 >= a && (m = Math.max(m, w + 1));
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
class CM extends xM {
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
const TM = new CM();
function EM(n, e, t) {
  return TM.diff(n, e, t);
}
function Jo({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = EM(i, s, {
    comparator: AM
  }), a = MM(o), l = [...e];
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
    const p = hm(
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
function MM(n) {
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
function hm(n, e) {
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
      hm(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function AM(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class OM {
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
class _M extends OM {
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
    this.resetAll(), this.currentState = Jo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = Jo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = Jo(
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
function pm(n) {
  const e = ft();
  let t = null;
  me(() => {
    n.canvasRef.value && (t = new _M(n.canvasRef.value, {
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
  Ln(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
function mm(n) {
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
  return n && Z(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), me(a), Ht(i), { visible: e };
}
const sd = /\$(\w+)/g;
function DM(n, e) {
  const t = [];
  let r = 0, i;
  for (sd.lastIndex = 0; (i = sd.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const PM = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, IM = ["src", "alt"], NM = { key: 1 }, RM = /* @__PURE__ */ B({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = ft().subtitle?.watermark, r = O(() => t ? DM(t.content.value, t.tokens.value) : []);
    return (i, s) => (E(), I(el, { name: "watermark" }, {
      default: _(() => [
        n.visible && y(t) ? (E(), V("div", PM, [
          (E(!0), V(Ie, null, _t(r.value, (o, a) => (E(), V(Ie, { key: a }, [
            o.type === "token" ? (E(), V("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, IM)) : (E(), V("span", NM, J(o.value), 1))
          ], 64))), 128))
        ])) : X("", !0)
      ]),
      _: 1
    }));
  }
}), gm = /* @__PURE__ */ de(RM, [["__scopeId", "data-v-b8c2ff2b"]]), $M = ["height"], BM = /* @__PURE__ */ B({
  __name: "SubtitleBanner",
  setup(n) {
    const e = ft(), t = qt("canvas"), r = O(() => e.subtitle?.fontSize.value ?? 40), i = O(() => 1.2 * r.value), s = O(() => 2.4 * r.value);
    pm({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = mm(
      e.subtitle?.watermark
    );
    return (a, l) => (E(), V("div", {
      class: "subtitle-banner",
      style: hn({ height: s.value + "px" })
    }, [
      H("canvas", {
        ref: "canvas",
        class: gt(["subtitle-canvas", { "subtitle-canvas--shrunk": y(o) }]),
        height: s.value
      }, null, 10, $M),
      L(gm, { visible: y(o) }, null, 8, ["visible"])
    ], 4));
  }
}), LM = /* @__PURE__ */ de(BM, [["__scopeId", "data-v-f62eaf60"]]), FM = {
  ref: "container",
  class: "subtitle-fullscreen"
}, zM = ["aria-label"], qM = /* @__PURE__ */ B({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = ft(), { t } = Fe(), r = qt("container"), i = qt("canvas"), s = O(() => e.subtitle?.fontSize.value ?? 48), o = O(() => 1.2 * s.value);
    pm({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = mm(
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
    return Ln(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, d) => (E(), V("div", FM, [
      H("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": y(t)("subtitle.exitFullscreen"),
        onClick: c
      }, [
        L(y(il), { size: 24 })
      ], 8, zM),
      H("canvas", {
        ref: "canvas",
        class: gt(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": y(a) }])
      }, null, 2),
      L(gm, { visible: y(a) }, null, 8, ["visible"])
    ], 512));
  }
}), VM = /* @__PURE__ */ de(qM, [["__scopeId", "data-v-e3ae14e0"]]), WM = /* @__PURE__ */ B({
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
    const o = O(() => r.value ? "check" : t.icon), a = O(() => Qd[t.size ?? "sm"]);
    return (l, c) => (E(), I(xe, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: gt({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: _(() => [
        L(el, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: _(() => [
            (E(), I(Wi, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: _(() => [
        z(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), od = /* @__PURE__ */ de(WM, [["__scopeId", "data-v-0077b14e"]]), UM = ["aria-label"], HM = { class: "selection-count" }, jM = { class: "selection-actions" }, KM = /* @__PURE__ */ B({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Kf(), { t } = Fe();
    return (r, i) => y(e).hasSelection.value ? (E(), V("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": y(t)("selection.count")
    }, [
      H("span", HM, J(y(e).count.value) + " " + J(y(t)("selection.count")), 1),
      H("div", jM, [
        L(od, {
          icon: "clipboard-type",
          "copy-fn": y(e).copyText,
          variant: "secondary"
        }, {
          default: _(() => [
            pe(J(y(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        L(od, {
          icon: "clipboard-list",
          "copy-fn": y(e).copyWithMetadata
        }, {
          default: _(() => [
            pe(J(y(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        L(xe, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => y(e).clear())
        }, {
          default: _(() => [
            pe(J(y(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, UM)) : X("", !0);
  }
}), JM = /* @__PURE__ */ de(KM, [["__scopeId", "data-v-1c5a7d10"]]), XM = { class: "editor-layout" }, YM = { class: "editor-body" }, GM = {
  key: 4,
  class: "mobile-selectors"
}, QM = /* @__PURE__ */ B({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = ft(), { isMobile: r } = rm(), i = D(!1), s = O(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), o = t.speakers.all;
    oS(s, o, t);
    const a = O(() => [...t.channels.values()]), l = O(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), c = O(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), u = O(() => Array.from(o.values())), d = qt("audioPlayer");
    function f(m) {
      t.audio && (t.audio.currentTime.value = m);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        d.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((m) => d.value?.seekTo(m));
    function h(m) {
      t.setActiveChannel(m);
    }
    function p(m) {
      t.activeChannel.value?.setActiveTranslation(m);
    }
    return (m, g) => (E(), V("div", XM, [
      e.showHeader ? (E(), I(ky, {
        key: 0,
        title: y(t).title.value,
        duration: y(t).activeChannel.value?.duration ?? 0,
        language: c.value,
        "is-mobile": y(r),
        onToggleSidebar: g[0] || (g[0] = (v) => i.value = !i.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : X("", !0),
      L(JM),
      H("main", YM, [
        L(zT, {
          turns: s.value,
          speakers: y(o)
        }, null, 8, ["turns", "speakers"]),
        y(r) ? X("", !0) : (E(), I(Zu, {
          key: 0,
          speakers: u.value,
          channels: a.value,
          "selected-channel-id": y(t).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedChannelId": h,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        y(r) ? (E(), I(ZE, {
          key: 1,
          open: i.value,
          "onUpdate:open": g[1] || (g[1] = (v) => i.value = v)
        }, {
          default: _(() => [
            L(Zu, {
              speakers: u.value,
              channels: a.value,
              "selected-channel-id": y(t).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": c.value,
              "onUpdate:selectedChannelId": h,
              "onUpdate:selectedTranslationId": p
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : X("", !0)
      ]),
      y(t).audio?.src.value ? (E(), I(kM, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": y(t).audio.src.value,
        turns: s.value,
        speakers: y(o),
        onTimeupdate: f,
        onPlayStateChange: g[2] || (g[2] = (v) => {
          y(t).audio && (y(t).audio.isPlaying.value = v);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : X("", !0),
      y(t).subtitle?.isVisible.value && !y(r) && !y(t).subtitle.isFullscreen.value ? (E(), I(LM, { key: 2 })) : X("", !0),
      y(t).subtitle?.isFullscreen.value ? (E(), I(VM, { key: 3 })) : X("", !0),
      y(r) && (a.value.length > 1 || l.value.length > 1) ? (E(), V("div", GM, [
        a.value.length > 1 ? (E(), I(sm, {
          key: 0,
          channels: a.value,
          "selected-channel-id": y(t).activeChannelId.value,
          "onUpdate:selectedChannelId": h
        }, null, 8, ["channels", "selected-channel-id"])) : X("", !0),
        l.value.length > 1 ? (E(), I(om, {
          key: 1,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedTranslationId": p
        }, null, 8, ["translations", "selected-translation-id"])) : X("", !0)
      ])) : X("", !0)
    ]));
  }
}), lP = /* @__PURE__ */ de(QM, [["__scopeId", "data-v-a4bf8df9"]]);
function cP(n = {}) {
  return {
    name: "audio",
    install(e) {
      const t = D(0), r = D(!1), i = D(null), s = D(null);
      let o = null;
      const a = O(
        () => e.activeChannel.value?.activeTranslation.value.audio ?? null
      ), l = D(null);
      let c = null;
      function u() {
        c && (URL.revokeObjectURL(c), c = null);
      }
      const d = Z(
        a,
        async (v) => {
          if (u(), l.value = null, !!v)
            try {
              const w = n.resolveSrc ? await n.resolveSrc(v) : v.src;
              l.value = w, w.startsWith("blob:") && (c = w);
            } catch (w) {
              console.error("[audio] resolveSrc failed", w);
            }
        },
        { immediate: !0 }
      ), f = O(() => l.value), h = tt(() => {
        if (!r.value) return;
        const v = t.value, w = e.activeChannel.value?.activeTranslation.value;
        if (w) {
          for (const b of w.turns.value)
            if (b.startTime != null && b.endTime != null && v >= b.startTime && v <= b.endTime) {
              s.value = b.id, i.value = rl(b.words) ? zd(b.words, v) : null;
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
var ym = Yl.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const Bn = Math.floor, ZM = Math.abs, on = (n, e) => n < e ? n : e, gr = (n, e) => n > e ? n : e, eA = (n) => n !== 0 ? n < 0 : 1 / n < 0, tA = 64, oi = 128, nA = 1 << 29, ad = 63, qr = 127, rA = 2147483647, ld = Number.MAX_SAFE_INTEGER, cd = Number.MIN_SAFE_INTEGER, iA = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && Bn(n) === n), sA = () => /* @__PURE__ */ new Set(), Ql = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, vm = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, oA = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, ro = Array.isArray, bm = String.fromCharCode, aA = (n) => n.toLowerCase(), lA = /^\s*/g, cA = (n) => n.replace(lA, ""), uA = /([A-Z])/g, ud = (n, e) => cA(n.replace(uA, (t) => `${e}${aA(t)}`)), dA = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ai = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), fA = (n) => ai.encode(n), hA = ai ? fA : dA;
let Xo = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Xo && Xo.decode(new Uint8Array()).length === 1 && (Xo = null);
const pA = (n, e) => oA(e, () => n).join("");
let mA = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const gA = () => new mA(), yA = (n) => {
  const e = gA();
  return n(e), bA(e);
}, vA = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, bA = (n) => {
  const e = new Uint8Array(vA(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, wA = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(gr(t, e) * 2), n.cpos = 0);
}, Ae = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, li = (n, e) => {
  for (; e > qr; )
    Ae(n, oi | qr & e), e = Bn(e / 128);
  Ae(n, qr & e);
}, SA = (n, e) => {
  const t = eA(e);
  for (t && (e = -e), Ae(n, (e > ad ? oi : 0) | (t ? tA : 0) | ad & e), e = Bn(e / 64); e > 0; )
    Ae(n, (e > qr ? oi : 0) | qr & e), e = Bn(e / 128);
}, La = new Uint8Array(3e4), kA = La.length / 3, xA = (n, e) => {
  if (e.length < kA) {
    const t = ai.encodeInto(e, La).written || 0;
    li(n, t);
    for (let r = 0; r < t; r++)
      Ae(n, La[r]);
  } else
    wm(n, hA(e));
}, CA = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  li(n, r);
  for (let i = 0; i < r; i++)
    Ae(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, dd = ai && /** @type {any} */
ai.encodeInto ? xA : CA, TA = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = on(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(gr(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, wm = (n, e) => {
  li(n, e.byteLength), TA(n, e);
}, Zl = (n, e) => {
  wA(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, EA = (n, e) => Zl(n, 4).setFloat32(0, e, !1), MA = (n, e) => Zl(n, 8).setFloat64(0, e, !1), AA = (n, e) => (
  /** @type {any} */
  Zl(n, 8).setBigInt64(0, e, !1)
), fd = new DataView(new ArrayBuffer(4)), OA = (n) => (fd.setFloat32(0, n), fd.getFloat32(0) === n), Fa = (n, e) => {
  switch (typeof e) {
    case "string":
      Ae(n, 119), dd(n, e);
      break;
    case "number":
      iA(e) && ZM(e) <= rA ? (Ae(n, 125), SA(n, e)) : OA(e) ? (Ae(n, 124), EA(n, e)) : (Ae(n, 123), MA(n, e));
      break;
    case "bigint":
      Ae(n, 122), AA(n, e);
      break;
    case "object":
      if (e === null)
        Ae(n, 126);
      else if (ro(e)) {
        Ae(n, 117), li(n, e.length);
        for (let t = 0; t < e.length; t++)
          Fa(n, e[t]);
      } else if (e instanceof Uint8Array)
        Ae(n, 116), wm(n, e);
      else {
        Ae(n, 118);
        const t = Object.keys(e);
        li(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          dd(n, i), Fa(n, e[i]);
        }
      }
      break;
    case "boolean":
      Ae(n, e ? 120 : 121);
      break;
    default:
      Ae(n, 127);
  }
}, io = (n) => new Error(n), Sm = () => {
  throw io("Method unimplemented");
}, so = () => {
  throw io("Unexpected case");
}, Gi = () => /* @__PURE__ */ new Map(), km = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, ci = /* @__PURE__ */ Symbol("Equality"), _A = (n, e) => n === e || !!n?.[ci]?.(e) || !1, DA = (n) => typeof n == "object", xm = Object.keys, hd = (n) => xm(n).length, Ei = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, Cm = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Qi = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[ci] != null)
    return n[ci](e);
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
      if (hd(n) !== hd(e))
        return !1;
      for (const t in n)
        if (!Cm(n, t) || !Qi(n[t], e[t]))
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
}, PA = (n, e) => e.includes(n), IA = () => {
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
}, NA = /[\uD800-\uDBFF]/, RA = /[\uDC00-\uDFFF]/, $A = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && NA.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && RA.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, BA = $A, LA = Math.random, FA = (n) => n[Bn(LA() * n.length)], pd = (n) => n === void 0 ? null : n;
class zA {
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
let Tm = new zA(), qA = !0;
try {
  typeof localStorage < "u" && localStorage && (Tm = localStorage, qA = !1);
} catch {
}
const VA = Tm, yr = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Em = typeof window < "u" && typeof document < "u" && !yr;
let St;
const WA = () => {
  if (St === void 0)
    if (yr) {
      St = Gi();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && St.set(e, ""), e = r) : e !== null && (St.set(e, r), e = null);
      }
      e !== null && St.set(e, "");
    } else typeof location == "object" ? (St = Gi(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        St.set(`--${ud(e, "-")}`, t), St.set(`-${ud(e, "-")}`, t);
      }
    })) : St = Gi();
  return St;
}, za = (n) => WA().has(n), qa = (n) => pd(yr ? process.env[n.toUpperCase().replaceAll("-", "_")] : VA.getItem(n)), Mm = (n) => za("--" + n) || qa(n) !== null, UA = Mm("production"), HA = yr && PA(process.env.FORCE_COLOR, ["true", "1", "2"]);
HA || !za("--no-colors") && // @todo deprecate --no-colors
!Mm("no-color") && (!yr || process.stdout.isTTY) && (!yr || za("--color") || qa("COLORTERM") !== null || (qa("TERM") || "").includes("color"));
const jA = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += bm(n[t]);
  return btoa(e);
}, KA = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), JA = Em ? jA : KA, XA = (n) => yA((e) => Fa(e, n)), md = (n) => n.next() >= 0.5, Yo = (n, e, t) => Bn(n.next() * (t + 1 - e) + e), Am = (n, e, t) => Bn(n.next() * (t + 1 - e) + e), ec = (n, e, t) => Am(n, e, t), YA = (n) => bm(ec(n, 97, 122)), GA = (n, e = 0, t = 20) => {
  const r = ec(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += YA(n);
  return i;
}, Go = (n, e) => e[ec(n, 0, e.length - 1)], QA = /* @__PURE__ */ Symbol("0schema");
class ZA {
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
      e.push(pA(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Va = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[ci] ? _A(n, e) : ro(n) ? Ql(
  n,
  (t) => vm(e, (r) => Va(t, r))
) : DA(n) ? Ei(
  n,
  (t, r) => Va(t, e[r])
) : !1;
class Je {
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
      this.constructor._dilutes && ([r, t] = [t, r]), Va(t, r)
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
  [QA]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [ci](e) {
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
    Sm();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return kr(this, uo);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Dm(
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
    return gd(e, this), /** @type {any} */
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
    return gd(e, this), e;
  }
}
class tc extends Je {
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
const we = (n, e = null) => new tc(n, e);
we(tc);
class nc extends Je {
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
const Ee = (n) => new nc(n);
we(nc);
class oo extends Je {
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
const ao = (...n) => new oo(n), Om = we(oo), eO = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), _m = (n) => {
  if (vr.check(n))
    return [eO(n)];
  if (Om.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if (zm.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (qm.check(n))
    return [".*"];
  if (Ts.check(n))
    return n.shape.map(_m).flat(1);
  so();
};
class tO extends Je {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(_m).map((t) => `(${t.join("|")})`).join("") + "$");
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
we(tO);
const nO = /* @__PURE__ */ Symbol("optional");
class Dm extends Je {
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
  get [nO]() {
    return !0;
  }
}
const rO = we(Dm);
class iO extends Je {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
we(iO);
class lo extends Je {
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
    return new lo(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : Ei(this.shape, (r, i) => {
      const s = this._isPartial && !Cm(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const sO = (n) => (
  /** @type {any} */
  new lo(n)
), oO = we(lo), aO = Ee((n) => n != null && (n.constructor === Object || n.constructor == null));
class Pm extends Je {
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
    return e != null && Ei(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const Im = (n, e) => new Pm(n, e), lO = we(Pm);
class Nm extends Je {
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
    return e != null && Ei(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const cO = (...n) => new Nm(n);
we(Nm);
class Rm extends Je {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new rc(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = ro(e) && Ql(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const $m = (...n) => new Rm(n), uO = we(Rm), dO = Ee((n) => ro(n));
class Bm extends Je {
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
const fO = (n, e = null) => new Bm(n, e);
we(Bm);
const hO = fO(Je);
class pO extends Je {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = cO(...e.slice(-1)), this.res = e[this.len];
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
const mO = we(pO), gO = Ee((n) => typeof n == "function");
class yO extends Je {
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
    const r = Ql(this.shape, (i) => i.check(e, t));
    return !r && t?.extend(null, "Intersectinon", typeof e), r;
  }
}
we(yO, (n) => n.shape.length > 0);
class rc extends Je {
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
    const r = vm(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const kr = (...n) => n.findIndex((e) => Ts.check(e)) >= 0 ? kr(...n.map((e) => ui(e)).map((e) => Ts.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new rc(n), Ts = (
  /** @type {Schema<$Union<any>>} */
  we(rc)
), Lm = () => !0, Es = Ee(Lm), vO = (
  /** @type {Schema<Schema<any>>} */
  we(nc, (n) => n.shape === Lm)
), ic = Ee((n) => typeof n == "bigint"), bO = (
  /** @type {Schema<Schema<BigInt>>} */
  Ee((n) => n === ic)
), Fm = Ee((n) => typeof n == "symbol");
Ee((n) => n === Fm);
const or = Ee((n) => typeof n == "number"), zm = (
  /** @type {Schema<Schema<number>>} */
  Ee((n) => n === or)
), vr = Ee((n) => typeof n == "string"), qm = (
  /** @type {Schema<Schema<string>>} */
  Ee((n) => n === vr)
), co = Ee((n) => typeof n == "boolean"), wO = (
  /** @type {Schema<Schema<Boolean>>} */
  Ee((n) => n === co)
), Vm = ao(void 0);
we(oo, (n) => n.shape.length === 1 && n.shape[0] === void 0);
ao(void 0);
const uo = ao(null), SO = (
  /** @type {Schema<Schema<null>>} */
  we(oo, (n) => n.shape.length === 1 && n.shape[0] === null)
);
we(Uint8Array);
we(tc, (n) => n.shape === Uint8Array);
const kO = kr(or, vr, uo, Vm, ic, co, Fm);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    $m(Es)
  ), e = (
    /** @type {$Record<$string,$any>} */
    Im(vr, Es)
  ), t = kr(or, vr, uo, co, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const ui = (n) => {
  if (hO.check(n))
    return (
      /** @type {any} */
      n
    );
  if (aO.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = ui(n[t]);
    return (
      /** @type {any} */
      sO(e)
    );
  } else {
    if (dO.check(n))
      return (
        /** @type {any} */
        kr(...n.map(ui))
      );
    if (kO.check(n))
      return (
        /** @type {any} */
        ao(n)
      );
    if (gO.check(n))
      return (
        /** @type {any} */
        we(
          /** @type {any} */
          n
        )
      );
  }
  so();
}, gd = UA ? () => {
} : (n, e) => {
  const t = new ZA();
  if (!e.check(n, t))
    throw io(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class xO {
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
    return this.patterns.push({ if: ui(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(Es, e);
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
        throw io("Unhandled pattern");
      }
    );
  }
}
const CO = (n) => new xO(
  /** @type {any} */
  n
), Wm = (
  /** @type {any} */
  CO(
    /** @type {Schema<prng.PRNG>} */
    Es
  ).if(zm, (n, e) => Yo(e, cd, ld)).if(qm, (n, e) => GA(e)).if(wO, (n, e) => md(e)).if(bO, (n, e) => BigInt(Yo(e, cd, ld))).if(Ts, (n, e) => Qn(e, Go(e, n.shape))).if(oO, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (rO.check(i)) {
        if (md(e))
          continue;
        i = i.shape;
      }
      t[r] = Wm(i, e);
    }
    return t;
  }).if(uO, (n, e) => {
    const t = [], r = Am(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push(Qn(e, n.shape));
    return t;
  }).if(Om, (n, e) => Go(e, n.shape)).if(SO, (n, e) => null).if(mO, (n, e) => {
    const t = Qn(e, n.res);
    return () => t;
  }).if(vO, (n, e) => Qn(e, Go(e, [
    or,
    vr,
    uo,
    Vm,
    ic,
    co,
    $m(or),
    Im(kr("a", "b", "c"), or)
  ]))).if(lO, (n, e) => {
    const t = {}, r = Yo(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = Qn(e, n.shape.keys), o = Qn(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), Qn = (n, e) => (
  /** @type {any} */
  Wm(ui(e), n)
), Mi = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Ee((n) => n.nodeType === AO);
typeof DOMParser < "u" && new DOMParser();
Ee((n) => n.nodeType === TO);
Ee((n) => n.nodeType === EO);
const TO = Mi.ELEMENT_NODE, EO = Mi.TEXT_NODE, MO = Mi.DOCUMENT_NODE, AO = Mi.DOCUMENT_FRAGMENT_NODE;
Ee((n) => n.nodeType === MO);
const OO = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, _O = OO(clearTimeout), sc = (n, e) => new _O(setTimeout(e, n)), Ct = (n, e) => n >>> e | n << 32 - e, DO = (n) => Ct(n, 2) ^ Ct(n, 13) ^ Ct(n, 22), PO = (n) => Ct(n, 6) ^ Ct(n, 11) ^ Ct(n, 25), IO = (n) => Ct(n, 7) ^ Ct(n, 18) ^ n >>> 3, NO = (n) => Ct(n, 17) ^ Ct(n, 19) ^ n >>> 10, RO = new Uint32Array([
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
]), $O = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class BO {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set($O), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = NO(t[d - 2]) + t[d - 7] + IO(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], l = e[5], c = e[6], u = e[7];
    for (let d = 0, f, h; d < 64; d++)
      f = u + PO(a) + (a & l ^ ~a & c) + RO[d] + t[d] >>> 0, h = DO(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = l, l = a, a = o + f >>> 0, o = s, s = i, i = r, r = f + h >>> 0;
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
        this._W[o] |= oi << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= oi << (3 - t % 4) * 8), this._W[14] = e.byteLength / nA, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let a = 0; a < 4; a++)
        s[o * 4 + a] = this._H[o] >>> (3 - a) * 8;
    return s;
  }
}
const LO = (n) => new BO().digest(n), ce = new nt("y-sync"), Ft = new nt("y-undo"), zi = new nt("yjs-cursor"), FO = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, zO = (n) => JA(FO(LO(XA(n)))), Ms = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !j.isDeleted(e.ds, n.id), qO = [{ light: "#ecd44433", dark: "#ecd444" }], VO = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = sA();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, FA(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, WO = (n, {
  colors: e = qO,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const a = new jO(n, s), l = new Re({
    props: {
      editable: (c) => {
        const u = ce.getState(c);
        return u.snapshot == null && u.prevSnapshot == null;
      }
    },
    key: ce,
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
        const d = c.getMeta(ce);
        if (d !== void 0) {
          u = Object.assign({}, u);
          for (const f in d)
            u[f] = d[f];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, a.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && sc(0, () => {
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
            const d = Ft.getState(c.state), f = d && d.undoManager;
            f && f.stopCapturing();
          }
          a.mux(() => {
            u.doc.transact((d) => {
              d.meta.set("addToHistory", u.addToHistory), a._prosemirrorChanged(c.state.doc);
            }, ce);
          });
        }
      },
      destroy: () => {
        a.destroy();
      }
    })
  });
  return l;
}, UO = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new Ze(n.doc));
    else if (e.type === "node") {
      const r = An(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection(HO(n, r));
    } else {
      const r = An(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = An(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(ee.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, HO = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? Y.create(n.doc, e) : ee.near(t);
}, Wa = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: fi(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: fi(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class jO {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = IA(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Wa(
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
    return this.prosemirrorView.hasFocus() ? (Em && this._domSelectionInView === null && (sc(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = Mi.documentElement;
    return i.bottom >= 0 && i.right >= 0 && i.left <= (window.innerWidth || s.clientWidth || 0) && i.top <= (window.innerHeight || s.clientHeight || 0);
  }
  /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */
  renderSnapshot(e, t) {
    t || (t = j.createSnapshot(j.createDeleteSet(), /* @__PURE__ */ new Map())), this.prosemirrorView.dispatch(
      this._tr.setMeta(ce, { snapshot: e, prevSnapshot: t })
    );
  }
  unrenderSnapshot() {
    this.mapping.clear(), this.mux(() => {
      const e = this.type.toArray().map(
        (r) => Zi(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new W(N.from(e), 0, 0)
      );
      t.setMeta(ce, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => Zi(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new W(N.from(t), 0, 0)
      );
      if (e) {
        const i = on(gr(e.anchor, 0), r.doc.content.size), s = on(gr(e.head, 0), r.doc.content.size);
        r.setSelection(ee.create(r.doc, i, s));
      }
      this.prosemirrorView.dispatch(
        r.setMeta(ce, { isChangeOrigin: !0, binding: this })
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
    if (e || (e = j.snapshot(this.doc)), e instanceof Uint8Array || t instanceof Uint8Array)
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && so(), i = new j.Doc({ gc: !1 }), j.applyUpdateV2(i, t), t = j.snapshot(i), j.applyUpdateV2(i, e), e = j.snapshot(i), s._item === null) {
        const o = Array.from(this.doc.share.keys()).find(
          (a) => this.doc.share.get(a) === this.type
        );
        s = i.getXmlFragment(o);
      } else {
        const o = i.store.clients.get(s._item.id.client) ?? [], a = j.findIndexSS(
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
          j.iterateDeletedStructs(o, d, (f) => {
          });
        });
        const l = (d, f) => {
          const h = d === "added" ? a.getUserByClientId(f.client) : a.getUserByDeletedId(f);
          return {
            user: h,
            type: d,
            color: VO(
              r.colorMapping,
              r.colors,
              h
            )
          };
        }, c = j.typeListToArraySnapshot(
          s,
          new j.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || Ms(d._item, e) || Ms(d._item, t) ? Zi(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          l
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new W(N.from(c), 0, 0)
        );
        this.prosemirrorView.dispatch(
          u.setMeta(ce, { isChangeOrigin: !0 })
        );
      }, ce);
    });
  }
  /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */
  _typeChanged(e, t) {
    if (this.prosemirrorView == null) return;
    const r = ce.getState(this.prosemirrorView.state);
    if (e.length === 0 || r.snapshot != null || r.prevSnapshot != null) {
      this.renderSnapshot(r.snapshot, r.prevSnapshot);
      return;
    }
    this.mux(() => {
      const i = (a, l) => this.mapping.delete(l);
      j.iterateDeletedStructs(
        t,
        t.deleteSet,
        (a) => {
          if (a.constructor === j.Item) {
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
        (a) => Um(
          /** @type {Y.XmlElement | Y.XmlHook} */
          a,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((a) => a !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new W(N.from(s), 0, 0)
      );
      UO(o, this.beforeTransactionSelection, this), o = o.setMeta(ce, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof j.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      Os(this.doc, this.type, e, this), this.beforeTransactionSelection = Wa(
        this,
        this.prosemirrorView.state
      );
    }, ce);
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
const Um = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof j.XmlElement)
      return Zi(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw Sm();
  }
  return o;
}, Zi = (n, e, t, r, i, s) => {
  const o = [], a = (l) => {
    if (l instanceof j.XmlElement) {
      const c = Um(
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
      c instanceof j.Text && !c._item.deleted && c._item.id.client === c.doc.clientID && (l.applyDelta([
        { retain: l.length },
        ...c.toDelta()
      ]), c.doc.transact((d) => {
        c._item.delete(d);
      }));
      const u = KO(
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
  r === void 0 || i === void 0 ? n.toArray().forEach(a) : j.typeListToArraySnapshot(n, new j.Snapshot(i.ds, r.sv)).forEach(a);
  try {
    const l = n.getAttributes(r);
    r !== void 0 && (Ms(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? Ms(
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
    }, ce), t.mapping.delete(n), null;
  }
}, KO = (n, e, t, r, i, s) => {
  const o = [], a = n.toDelta(r, i, s);
  try {
    for (let l = 0; l < a.length; l++) {
      const c = a[l];
      o.push(e.text(c.insert, ZO(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, ce), null;
  }
  return o;
}, JO = (n, e) => {
  const t = new j.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: Km(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, XO = (n, e) => {
  const t = new j.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    fo(n).map(
      (r) => Ua(r, e)
    )
  ), e.mapping.set(t, n), t;
}, Ua = (n, e) => n instanceof Array ? JO(n, e) : XO(n, e), yd = (n) => typeof n == "object" && n !== null, oc = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], a = e[s];
    r = s === "ychange" || o === a || yd(o) && yd(a) && oc(o, a);
  }
  return r;
}, fo = (n) => {
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
}, Hm = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && xm(r.attributes || {}).length === e[i].marks.length && Ei(r.attributes, (s, o) => {
      const a = jm(o), l = e[i].marks;
      return l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      ) ? oc(s, l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      )?.attrs) : !1;
    })
  );
}, di = (n, e) => {
  if (n instanceof j.XmlElement && !(e instanceof Array) && Ha(n, e)) {
    const t = fo(e);
    return n._length === t.length && oc(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => di(r, t[i])
    );
  }
  return n instanceof j.XmlText && e instanceof Array && Hm(n, e);
}, As = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), vd = (n, e, t) => {
  const r = n.toArray(), i = fo(e), s = i.length, o = r.length, a = on(o, s);
  let l = 0, c = 0, u = !1;
  for (; l < a; l++) {
    const d = r[l], f = i[l];
    if (As(t.mapping.get(d), f))
      u = !0;
    else if (!di(d, f))
      break;
  }
  for (; l + c < a; c++) {
    const d = r[o - c - 1], f = i[s - c - 1];
    if (As(t.mapping.get(d), f))
      u = !0;
    else if (!di(d, f))
      break;
  }
  return {
    equalityFactor: l + c,
    foundMappedChild: u
  };
}, YO = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof j.ContentString ? e += t.content.str : t.content instanceof j.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, GO = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = YO(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, Km(c.marks, t))
  })), { insert: o, remove: a, index: l } = BA(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(l, a), n.insert(l, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, QO = /(.*)(--[a-zA-Z0-9+/=]{8})$/, jm = (n) => QO.exec(n)?.[1] ?? n, ZO = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(jm(r), n[r]));
  return t;
}, Km = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = km(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${zO(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, Os = (n, e, t, r) => {
  if (e instanceof j.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof j.XmlElement) {
    const d = e.getAttributes(), f = t.attrs;
    for (const h in f)
      f[h] !== null ? d[h] !== f[h] && h !== "ychange" && e.setAttribute(h, f[h]) : e.removeAttribute(h);
    for (const h in d)
      f[h] === void 0 && e.removeAttribute(h);
  }
  const i = fo(t), s = i.length, o = e.toArray(), a = o.length, l = on(s, a);
  let c = 0, u = 0;
  for (; c < l; c++) {
    const d = o[c], f = i[c];
    if (!As(r.mapping.get(d), f))
      if (di(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  for (; u + c + 1 < l; u++) {
    const d = o[a - u - 1], f = i[s - u - 1];
    if (!As(r.mapping.get(d), f))
      if (di(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  n.transact(() => {
    for (; a - c - u > 0 && s - c - u > 0; ) {
      const f = o[c], h = i[c], p = o[a - u - 1], m = i[s - u - 1];
      if (f instanceof j.XmlText && h instanceof Array)
        Hm(f, h) || GO(f, h, r), c += 1;
      else {
        let g = f instanceof j.XmlElement && Ha(f, h), v = p instanceof j.XmlElement && Ha(p, m);
        if (g && v) {
          const w = vd(
            /** @type {Y.XmlElement} */
            f,
            /** @type {PModel.Node} */
            h,
            r
          ), b = vd(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          w.foundMappedChild && !b.foundMappedChild ? v = !1 : !w.foundMappedChild && b.foundMappedChild || w.equalityFactor < b.equalityFactor ? g = !1 : v = !1;
        }
        g ? (Os(
          n,
          /** @type {Y.XmlFragment} */
          f,
          /** @type {PModel.Node} */
          h,
          r
        ), c += 1) : v ? (Os(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          Ua(h, r)
        ]), c += 1);
      }
    }
    const d = a - c - u;
    if (a === 1 && s === 0 && o[0] instanceof j.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((f) => r.mapping.delete(f)), e.delete(c, d)), c + u < s) {
      const f = [];
      for (let h = c; h < s - u; h++)
        f.push(Ua(i[h], r));
      e.insert(c, f);
    }
  }, ce);
}, Ha = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let Vr = null;
const e_ = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    Vr
  );
  Vr = null, n.forEach((e, t) => {
    const r = t.state.tr, i = ce.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, t_ = (n, e, t) => {
  Vr || (Vr = /* @__PURE__ */ new Map(), sc(0, e_)), km(Vr, n, Gi).set(e, t);
}, fi = (n, e, t) => {
  if (n === 0)
    return j.createRelativePositionFromTypeIndex(e, 0, -1);
  let r = e._first === null ? null : (
    /** @type {Y.ContentType} */
    e._first.content.type
  );
  for (; r !== null && e !== r; ) {
    if (r instanceof j.XmlText) {
      if (r._length >= n)
        return j.createRelativePositionFromTypeIndex(r, n, -1);
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
          return new j.RelativePosition(r._item === null ? null : r._item.id, r._item === null ? j.findRootTypeKey(r) : null, null);
        if (n -= i, r._item !== null && r._item.next !== null)
          r = /** @type {Y.ContentType} */
          r._item.next.content.type;
        else {
          if (n === 0)
            return r = r._item === null ? r : r._item.parent, new j.RelativePosition(r._item === null ? null : r._item.id, r._item === null ? j.findRootTypeKey(r) : null, null);
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
      throw so();
    if (n === 0 && r.constructor !== j.XmlText && r !== e)
      return n_(r._item.parent, r._item);
  }
  return j.createRelativePositionFromTypeIndex(e, e._length, -1);
}, n_ = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = j.findRootTypeKey(n) : t = j.createID(n._item.id.client, n._item.id.clock), new j.RelativePosition(t, r, e.id);
}, An = (n, e, t, r) => {
  const i = j.createAbsolutePositionFromRelativePosition(t, n);
  if (i === null || i.type !== e && !j.isParentOf(e, i.type._item))
    return null;
  let s = i.type, o = 0;
  if (s.constructor === j.XmlText)
    o = i.index;
  else if (s._item === null || !s._item.deleted) {
    let a = s._first, l = 0;
    for (; l < s._length && l < i.index && a !== null; ) {
      if (!a.deleted) {
        const c = (
          /** @type {Y.ContentType} */
          a.content.type
        );
        l++, c instanceof j.XmlText ? o += c._length : o += /** @type {any} */
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
        l.deleted || (c instanceof j.XmlText ? o += c._length : o += /** @type {any} */
        r.get(c).nodeSize), l = l.right;
      }
    }
    s = /** @type {Y.AbstractType} */
    a;
  }
  return o - 1;
};
function r_(n, e) {
  const t = e || new j.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return Os(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function i_(n, e, t) {
  const r = $t.fromJSON(n, e);
  return r_(r, t);
}
const s_ = (n, e, t) => n !== e, o_ = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, a_ = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), l_ = /^#[0-9a-fA-F]{6}$/, bd = (n, e, t, r, i) => {
  const s = ce.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return fe.create(n.doc, []);
  const o = s.doc, a = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? fe.create(n.doc, []) : (e.getStates().forEach((l, c) => {
    if (t(o.clientID, c, l) && l.cursor != null) {
      const u = l.user || {};
      u.color == null ? u.color = "#ffa500" : l_.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = An(
        o,
        s.type,
        j.createRelativePositionFromJSON(l.cursor.anchor),
        s.binding.mapping
      ), f = An(
        o,
        s.type,
        j.createRelativePositionFromJSON(l.cursor.head),
        s.binding.mapping
      );
      if (d !== null && f !== null) {
        const h = gr(n.doc.content.size - 1, 0);
        d = on(d, h), f = on(f, h), a.push(
          Ge.widget(f, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = on(d, f), m = gr(d, f);
        a.push(
          Ge.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), fe.create(n.doc, a));
}, c_ = (n, {
  awarenessStateFilter: e = s_,
  cursorBuilder: t = o_,
  selectionBuilder: r = a_,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new Re({
  key: zi,
  state: {
    init(o, a) {
      return bd(
        a,
        n,
        e,
        t,
        r
      );
    },
    apply(o, a, l, c) {
      const u = ce.getState(c), d = o.getMeta(zi);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? bd(
        c,
        n,
        e,
        t,
        r
      ) : a.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => zi.getState(o)
  },
  view: (o) => {
    const a = () => {
      o.docView && t_(o, zi, { awarenessUpdated: !0 });
    }, l = () => {
      const c = ce.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), f = fi(
          d.anchor,
          c.type,
          c.binding.mapping
        ), h = fi(
          d.head,
          c.type,
          c.binding.mapping
        );
        (u.cursor == null || !j.compareRelativePositions(
          j.createRelativePositionFromJSON(u.cursor.anchor),
          f
        ) || !j.compareRelativePositions(
          j.createRelativePositionFromJSON(u.cursor.head),
          h
        )) && n.setLocalStateField(s, {
          anchor: f,
          head: h
        });
      } else u.cursor != null && An(
        c.doc,
        c.type,
        j.createRelativePositionFromJSON(u.cursor.anchor),
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
}), u_ = (n) => {
  const e = Ft.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, d_ = (n) => {
  const e = Ft.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, f_ = /* @__PURE__ */ new Set(["paragraph"]), h_ = (n, e) => !(n instanceof Ag) || !(n.content instanceof Og) || !(n.content.type instanceof _g || n.content.type instanceof Dg && e.has(n.content.type.nodeName)) || n.content.type._length === 0, p_ = ({ protectedNodes: n = f_, trackedOrigins: e = [], undoManager: t = null } = {}) => new Re({
  key: Ft,
  state: {
    init: (r, i) => {
      const s = ce.getState(i), o = t || new Mg(s.type, {
        trackedOrigins: new Set([ce].concat(e)),
        deleteFilter: (a) => h_(a, n),
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
      const a = ce.getState(o).binding, l = i.undoManager, c = l.undoStack.length > 0, u = l.redoStack.length > 0;
      return a ? {
        undoManager: l,
        prevSel: Wa(a, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: l.undoStack.length > 0,
        hasRedoOps: l.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = ce.getState(r.state), s = Ft.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const a = i.binding;
      a && o.meta.set(a, Ft.getState(r.state).prevSel);
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
function Jm(n) {
  return !!n.getMeta(ce);
}
function m_(n, e) {
  const t = ce.getState(n);
  return An(t.doc, t.type, e, t.binding.mapping) || 0;
}
function Xm(n, e) {
  const t = ce.getState(n);
  return fi(e, t.type, t.binding.mapping);
}
var es = class Ym extends jl {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new Ym(e.position, e.yRelativePosition);
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
function g_(n, e) {
  const t = Xm(e, n);
  return new es(n, t);
}
function y_(n, e, t) {
  const r = n instanceof es ? n.yRelativePosition : null;
  if (Jm(e) && r) {
    const o = m_(t, r);
    return {
      position: new es(o, r),
      mapResult: null
    };
  }
  const i = Bp(n, e), s = i.position.position;
  return {
    position: new es(
      s,
      r ?? Xm(t, s)
    ),
    mapResult: i.mapResult
  };
}
var v_ = rt.create({
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
    this.editor.utils.getUpdatedPosition = (n, e) => y_(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => g_(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Ft.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? u_(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Ft.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? d_(e) : !0)
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
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = p_(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Ft.getState(s.state);
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
      WO(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new Re({
        key: new nt("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!Jm(s))
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
const b_ = Math.floor, w_ = (n, e) => n < e ? n : e, S_ = (n, e) => n > e ? n : e, Gm = 128, ts = 127, k_ = Number.MAX_SAFE_INTEGER, x_ = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, hi = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), C_ = (n) => hi.encode(n), T_ = hi ? C_ : x_;
let Wr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Wr && Wr.decode(new Uint8Array()).length === 1 && (Wr = null);
const _s = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, ho = (n, e) => {
  for (; e > ts; )
    _s(n, Gm | ts & e), e = b_(e / 128);
  _s(n, ts & e);
}, ja = new Uint8Array(3e4), E_ = ja.length / 3, M_ = (n, e) => {
  if (e.length < E_) {
    const t = hi.encodeInto(e, ja).written || 0;
    ho(n, t);
    for (let r = 0; r < t; r++)
      _s(n, ja[r]);
  } else
    D_(n, T_(e));
}, A_ = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  ho(n, r);
  for (let i = 0; i < r; i++)
    _s(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, O_ = hi && /** @type {any} */
hi.encodeInto ? M_ : A_, __ = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = w_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(S_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, D_ = (n, e) => {
  ho(n, e.byteLength), __(n, e);
}, Qm = (n) => new Error(n), P_ = Qm("Unexpected end of array"), I_ = Qm("Integer out of Range"), N_ = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, R_ = (n) => N_(n, ac(n)), wd = (n) => n.arr[n.pos++], ac = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & ts) * t, t *= 128, i < Gm)
      return e;
    if (e > k_)
      throw I_;
  }
  throw P_;
}, $_ = (n) => {
  let e = ac(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(wd(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(wd(n));
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
}, B_ = (n) => (
  /** @type any */
  Wr.decode(R_(n))
), Sd = Wr ? B_ : $_;
var ar;
(function(n) {
  n[n.Token = 0] = "Token", n[n.PermissionDenied = 1] = "PermissionDenied", n[n.Authenticated = 2] = "Authenticated";
})(ar || (ar = {}));
const L_ = (n, e) => {
  ho(n, ar.Token), O_(n, e);
}, F_ = (n, e, t, r) => {
  switch (ac(n)) {
    case ar.Token: {
      e();
      break;
    }
    case ar.PermissionDenied: {
      t(Sd(n));
      break;
    }
    case ar.Authenticated: {
      r(Sd(n));
      break;
    }
  }
}, kd = (n) => Array.from(n.entries()).map(([e, t]) => ({
  clientId: e,
  ...t
}));
var Ka;
(function(n) {
  n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed";
})(Ka || (Ka = {}));
function z_(n) {
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
async function Qo(n) {
  return new Promise((e) => setTimeout(e, n));
}
function q_(n, e) {
  let t = e.delay;
  if (t === 0)
    return 0;
  if (e.factor && (t *= Math.pow(e.factor, n.attemptNum - 1), e.maxDelay !== 0 && (t = Math.min(t, e.maxDelay))), e.jitter) {
    const r = Math.ceil(e.minDelay), i = Math.floor(t);
    t = Math.floor(Math.random() * (i - r + 1)) + r;
  }
  return Math.round(t);
}
async function V_(n, e) {
  const t = z_(e);
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
  }, i = t.calculateDelay || q_;
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
      return c && await Qo(c), s();
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
  if (o && await Qo(o), r.attemptNum < 1 && t.initialJitter) {
    const a = i(r, t);
    a && await Qo(a);
  }
  return s();
}
const Zm = Math.floor, W_ = (n, e) => n < e ? n : e, U_ = (n, e) => n > e ? n : e, H_ = 64, Ds = 128, j_ = 63, Ur = 127, eg = Number.MAX_SAFE_INTEGER, K_ = () => /* @__PURE__ */ new Set(), J_ = Array.from, X_ = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, pi = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), Y_ = (n) => pi.encode(n), G_ = pi ? Y_ : X_;
let Hr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Hr && Hr.decode(new Uint8Array()).length === 1 && (Hr = null);
class Q_ {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const lc = () => new Q_(), tg = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, cc = (n) => {
  const e = new Uint8Array(tg(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, Ps = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Be = (n, e) => {
  for (; e > Ur; )
    Ps(n, Ds | Ur & e), e = Zm(e / 128);
  Ps(n, Ur & e);
}, Ja = new Uint8Array(3e4), Z_ = Ja.length / 3, eD = (n, e) => {
  if (e.length < Z_) {
    const t = pi.encodeInto(e, Ja).written || 0;
    Be(n, t);
    for (let r = 0; r < t; r++)
      Ps(n, Ja[r]);
  } else
    xr(n, G_(e));
}, tD = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Be(n, r);
  for (let i = 0; i < r; i++)
    Ps(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Ut = pi && /** @type {any} */
pi.encodeInto ? eD : tD, nD = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = W_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(U_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, xr = (n, e) => {
  Be(n, e.byteLength), nD(n, e);
}, ng = (n) => new Error(n), rg = ng("Unexpected end of array"), ig = ng("Integer out of Range");
class rD {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const sg = (n) => new rD(n), iD = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, po = (n) => iD(n, On(n)), xd = (n) => n.arr[n.pos++], On = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Ur) * t, t *= 128, i < Ds)
      return e;
    if (e > eg)
      throw ig;
  }
  throw rg;
}, sD = (n) => {
  let e = n.arr[n.pos++], t = e & j_, r = 64;
  const i = (e & H_) > 0 ? -1 : 1;
  if ((e & Ds) === 0)
    return i * t;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    if (e = n.arr[n.pos++], t = t + (e & Ur) * r, r *= 128, e < Ds)
      return i * t;
    if (t > eg)
      throw ig;
  }
  throw rg;
}, oD = (n) => {
  let e = On(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(xd(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(xd(n));
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
}, aD = (n) => (
  /** @type any */
  Hr.decode(po(n))
), mi = Hr ? aD : oD, lD = (n) => {
  const e = n.pos, t = mi(n);
  return n.pos = e, t;
}, br = Date.now, Zo = () => /* @__PURE__ */ new Map(), cD = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
};
class uD {
  constructor() {
    this._observers = Zo();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, t) {
    cD(this._observers, e, K_).add(t);
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
    return J_((this._observers.get(e) || Zo()).values()).forEach((r) => r(...t));
  }
  destroy() {
    this._observers = Zo();
  }
}
const dD = Object.keys, Cd = (n) => dD(n).length, fD = (n, e) => Object.prototype.hasOwnProperty.call(n, e), hD = (n, e) => n === e, jr = (n, e) => {
  if (n == null || e == null)
    return hD(n, e);
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
      if (Cd(n) !== Cd(e))
        return !1;
      for (const t in n)
        if (!fD(n, t) || !jr(n[t], e[t]))
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
}, ea = 3e4;
class pD extends uD {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const t = br();
      this.getLocalState() !== null && ea / 2 <= t - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && ea <= t - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && ns(this, r, "timeout");
    }, Zm(ea / 10)), e.on("destroy", () => {
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
      lastUpdated: br()
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
const ns = (n, e, t) => {
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
          lastUpdated: br()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: r }, t]), n.emit("update", [{ added: [], updated: [], removed: r }, t]));
}, Xa = (n, e, t = n.states) => {
  const r = e.length, i = lc();
  Be(i, r);
  for (let s = 0; s < r; s++) {
    const o = e[s], a = t.get(o) || null, l = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    Be(i, o), Be(i, l), Ut(i, JSON.stringify(a));
  }
  return cc(i);
}, mD = (n, e, t) => {
  const r = sg(e), i = br(), s = [], o = [], a = [], l = [], c = On(r);
  for (let u = 0; u < c; u++) {
    const d = On(r);
    let f = On(r);
    const h = JSON.parse(mi(r)), p = n.meta.get(d), m = n.states.get(d), g = p === void 0 ? 0 : p.clock;
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
class og {
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
class Ya {
  constructor(e) {
    this.data = e, this.encoder = lc(), this.decoder = sg(new Uint8Array(this.data));
  }
  peekVarString() {
    return lD(this.decoder);
  }
  readVarUint() {
    return On(this.decoder);
  }
  readVarString() {
    return mi(this.decoder);
  }
  readVarUint8Array() {
    return po(this.decoder);
  }
  writeVarUint(e) {
    return Be(this.encoder, e);
  }
  writeVarString(e) {
    return Ut(this.encoder, e);
  }
  writeVarUint8Array(e) {
    return xr(this.encoder, e);
  }
  length() {
    return tg(this.encoder);
  }
}
var Oe;
(function(n) {
  n[n.Sync = 0] = "Sync", n[n.Awareness = 1] = "Awareness", n[n.Auth = 2] = "Auth", n[n.QueryAwareness = 3] = "QueryAwareness", n[n.Stateless = 5] = "Stateless", n[n.CLOSE = 7] = "CLOSE", n[n.SyncStatus = 8] = "SyncStatus";
})(Oe || (Oe = {}));
var qe;
(function(n) {
  n.Connecting = "connecting", n.Connected = "connected", n.Disconnected = "disconnected";
})(qe || (qe = {}));
class Un {
  constructor() {
    this.encoder = lc();
  }
  get(e) {
    return e.encoder;
  }
  toUint8Array() {
    return cc(this.encoder);
  }
}
class gD extends Un {
  constructor() {
    super(...arguments), this.type = Oe.CLOSE, this.description = "Ask the server to close the connection";
  }
  get(e) {
    return Ut(this.encoder, e.documentName), Be(this.encoder, this.type), this.encoder;
  }
}
class yD extends og {
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
    }, this.webSocket = null, this.webSocketHandlers = {}, this.shouldConnect = !0, this.status = qe.Disconnected, this.lastMessageReceived = 0, this.identifier = 0, this.intervals = {
      connectionChecker: null
    }, this.connectionAttempt = null, this.receivedOnOpenPayload = void 0, this.closeTries = 0, this.setConfiguration(e), this.configuration.WebSocketPolyfill = e.WebSocketPolyfill ? e.WebSocketPolyfill : WebSocket, this.on("open", this.configuration.onOpen), this.on("open", this.onOpen.bind(this)), this.on("connect", this.configuration.onConnect), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("status", this.configuration.onStatus), this.on("disconnect", this.configuration.onDisconnect), this.on("close", this.configuration.onClose), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("close", this.onClose.bind(this)), this.on("message", this.onMessage.bind(this)), this.intervals.connectionChecker = setInterval(this.checkConnection.bind(this), this.configuration.messageReconnectTimeout / 10), this.shouldConnect && this.connect();
  }
  async onOpen(e) {
    this.status = qe.Connected, this.emit("status", { status: qe.Connected }), this.cancelWebsocketRetry = void 0, this.receivedOnOpenPayload = e;
  }
  attach(e) {
    this.configuration.providerMap.set(e.configuration.name, e), this.status === qe.Disconnected && this.shouldConnect && this.connect(), this.receivedOnOpenPayload && this.status === qe.Connected && e.onOpen(this.receivedOnOpenPayload);
  }
  detach(e) {
    this.configuration.providerMap.has(e.configuration.name) && (e.send(gD, {
      documentName: e.configuration.name
    }), this.configuration.providerMap.delete(e.configuration.name));
  }
  setConfiguration(e = {}) {
    this.configuration = { ...this.configuration, ...e }, this.configuration.autoConnect || (this.shouldConnect = !1);
  }
  async connect() {
    if (this.status === qe.Connected)
      return;
    this.cancelWebsocketRetry && (this.cancelWebsocketRetry(), this.cancelWebsocketRetry = void 0), this.receivedOnOpenPayload = void 0, this.shouldConnect = !0;
    const e = () => {
      let i = !1;
      return {
        retryPromise: V_(this.createWebSocketConnection.bind(this), {
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
      r.binaryType = "arraybuffer", r.identifier = this.identifier, this.attachWebSocketListeners(r, t), this.webSocket = r, this.status = qe.Connecting, this.emit("status", { status: qe.Connecting }), this.connectionAttempt = {
        resolve: e,
        reject: t
      };
    });
  }
  onMessage(e) {
    var t;
    this.resolveConnectionAttempt(), this.lastMessageReceived = br();
    const i = new Ya(e.data).peekVarString();
    (t = this.configuration.providerMap.get(i)) === null || t === void 0 || t.onMessage(e);
  }
  resolveConnectionAttempt() {
    this.connectionAttempt && (this.connectionAttempt.resolve(), this.connectionAttempt = null, this.status = qe.Connected, this.emit("status", { status: qe.Connected }), this.emit("connect"), this.messageQueue.forEach((e) => this.send(e)), this.messageQueue = []);
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
    this.status === qe.Connected && this.lastMessageReceived && (this.configuration.messageReconnectTimeout >= br() - this.lastMessageReceived || (this.closeTries += 1, this.closeTries > 2 ? (this.onClose({
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
    ((t = this.webSocket) === null || t === void 0 ? void 0 : t.readyState) === Ka.Open ? this.webSocket.send(e) : this.messageQueue.push(e);
  }
  onClose({ event: e }) {
    this.closeTries = 0, this.cleanupWebSocket(), this.connectionAttempt && this.rejectConnectionAttempt(), this.status = qe.Disconnected, this.emit("status", { status: qe.Disconnected }), this.emit("disconnect", { event: e }), !this.cancelWebsocketRetry && this.shouldConnect && setTimeout(() => {
      this.connect();
    }, this.configuration.delay);
  }
  destroy() {
    this.emit("destroy"), clearInterval(this.intervals.connectionChecker), this.stopConnectionAttempt(), this.disconnect(), this.removeAllListeners(), this.cleanupWebSocket();
  }
}
const ag = 0, uc = 1, lg = 2, vD = (n, e) => {
  Be(n, ag);
  const t = j.encodeStateVector(e);
  xr(n, t);
}, bD = (n, e, t) => {
  Be(n, uc), xr(n, j.encodeStateAsUpdate(e, t));
}, wD = (n, e, t) => bD(e, t, po(n)), cg = (n, e, t) => {
  try {
    j.applyUpdate(e, po(n), t);
  } catch (r) {
    console.error("Caught error while handling a Yjs update", r);
  }
}, SD = (n, e) => {
  Be(n, lg), xr(n, e);
}, kD = cg, xD = (n, e, t, r) => {
  const i = On(n);
  switch (i) {
    case ag:
      wD(n, e, t);
      break;
    case uc:
      cg(n, t, r);
      break;
    case lg:
      kD(n, t, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
class CD {
  constructor(e) {
    this.message = e;
  }
  apply(e, t) {
    const { message: r } = this, i = r.readVarUint(), s = r.length();
    switch (i) {
      case Oe.Sync:
        this.applySyncMessage(e, t);
        break;
      case Oe.Awareness:
        this.applyAwarenessMessage(e);
        break;
      case Oe.Auth:
        this.applyAuthMessage(e);
        break;
      case Oe.QueryAwareness:
        this.applyQueryAwarenessMessage(e);
        break;
      case Oe.Stateless:
        e.receiveStateless(mi(r.decoder));
        break;
      case Oe.SyncStatus:
        this.applySyncStatusMessage(e, sD(r.decoder) === 1);
        break;
      case Oe.CLOSE:
        const o = {
          code: 1e3,
          reason: mi(r.decoder),
          // @ts-ignore
          target: e.configuration.websocketProvider.webSocket,
          type: "close"
        };
        e.onClose(), e.configuration.onClose({ event: o }), e.forwardClose({ event: o });
        break;
      default:
        throw new Error(`Can’t apply message of unknown type: ${i}`);
    }
    r.length() > s + 1 && e.send(Un, { encoder: r.encoder });
  }
  applySyncMessage(e, t) {
    const { message: r } = this;
    r.writeVarUint(Oe.Sync);
    const i = xD(r.decoder, r.encoder, e.document, e);
    t && i === uc && (e.synced = !0);
  }
  applySyncStatusMessage(e, t) {
    t && e.decrementUnsyncedChanges();
  }
  applyAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    mD(e.awareness, t.readVarUint8Array(), e);
  }
  applyAuthMessage(e) {
    const { message: t } = this;
    F_(t.decoder, e.sendToken.bind(e), e.permissionDeniedHandler.bind(e), e.authenticatedHandler.bind(e));
  }
  applyQueryAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    t.writeVarUint(Oe.Awareness), t.writeVarUint8Array(Xa(e.awareness, Array.from(e.awareness.getStates().keys())));
  }
}
class TD {
  constructor(e, t = {}) {
    this.message = new e(), this.encoder = this.message.get(t);
  }
  create() {
    return cc(this.encoder);
  }
  send(e) {
    e?.send(this.create());
  }
}
class ED extends Un {
  constructor() {
    super(...arguments), this.type = Oe.Auth, this.description = "Authentication";
  }
  get(e) {
    if (typeof e.token > "u")
      throw new Error("The authentication message requires `token` as an argument.");
    return Ut(this.encoder, e.documentName), Be(this.encoder, this.type), L_(this.encoder, e.token), this.encoder;
  }
}
class Td extends Un {
  constructor() {
    super(...arguments), this.type = Oe.Awareness, this.description = "Awareness states update";
  }
  get(e) {
    if (typeof e.awareness > "u")
      throw new Error("The awareness message requires awareness as an argument");
    if (typeof e.clients > "u")
      throw new Error("The awareness message requires clients as an argument");
    Ut(this.encoder, e.documentName), Be(this.encoder, this.type);
    let t;
    return e.states === void 0 ? t = Xa(e.awareness, e.clients) : t = Xa(e.awareness, e.clients, e.states), xr(this.encoder, t), this.encoder;
  }
}
class MD extends Un {
  constructor() {
    super(...arguments), this.type = Oe.Stateless, this.description = "A stateless message";
  }
  get(e) {
    var t;
    return Ut(this.encoder, e.documentName), Be(this.encoder, this.type), Ut(this.encoder, (t = e.payload) !== null && t !== void 0 ? t : ""), this.encoder;
  }
}
class Ed extends Un {
  constructor() {
    super(...arguments), this.type = Oe.Sync, this.description = "First sync step";
  }
  get(e) {
    if (typeof e.document > "u")
      throw new Error("The sync step one message requires document as an argument");
    return Ut(this.encoder, e.documentName), Be(this.encoder, this.type), vD(this.encoder, e.document), this.encoder;
  }
}
class AD extends Un {
  constructor() {
    super(...arguments), this.type = Oe.Sync, this.description = "A document update";
  }
  get(e) {
    return Ut(this.encoder, e.documentName), Be(this.encoder, this.type), SD(this.encoder, e.update), this.encoder;
  }
}
class OD extends Error {
  constructor() {
    super(...arguments), this.code = 1001;
  }
}
class _D extends og {
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
    }, this.boundDocumentUpdateHandler = this.documentUpdateHandler.bind(this), this.boundAwarenessUpdateHandler = this.awarenessUpdateHandler.bind(this), this.boundPageHide = this.pageHide.bind(this), this.boundOnOpen = this.onOpen.bind(this), this.boundOnClose = this.onClose.bind(this), this.forwardConnect = () => this.emit("connect"), this.forwardStatus = (s) => this.emit("status", s), this.forwardClose = (s) => this.emit("close", s), this.forwardDisconnect = (s) => this.emit("disconnect", s), this.forwardDestroy = () => this.emit("destroy"), this.setConfiguration(e), this.configuration.document = e.document ? e.document : new j.Doc(), this.configuration.awareness = e.awareness !== void 0 ? e.awareness : new pD(this.document), this.on("open", this.configuration.onOpen), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("synced", this.configuration.onSynced), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("stateless", this.configuration.onStateless), this.on("unsyncedChanges", this.configuration.onUnsyncedChanges), this.on("authenticated", this.configuration.onAuthenticated), this.on("authenticationFailed", this.configuration.onAuthenticationFailed), (t = this.awareness) === null || t === void 0 || t.on("update", () => {
      this.emit("awarenessUpdate", {
        states: kd(this.awareness.getStates())
      });
    }), (r = this.awareness) === null || r === void 0 || r.on("change", () => {
      this.emit("awarenessChange", {
        states: kd(this.awareness.getStates())
      });
    }), this.document.on("update", this.boundDocumentUpdateHandler), (i = this.awareness) === null || i === void 0 || i.on("update", this.boundAwarenessUpdateHandler), this.registerEventListeners(), this.configuration.forceSyncInterval && typeof this.configuration.forceSyncInterval == "number" && (this.intervals.forceSync = setInterval(this.forceSync.bind(this), this.configuration.forceSyncInterval)), this.manageSocket && this.attach();
  }
  setConfiguration(e = {}) {
    e.websocketProvider || (this.manageSocket = !0, this.configuration.websocketProvider = new yD(e)), this.configuration = { ...this.configuration, ...e };
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
    this.resetUnsyncedChanges(), this.send(Ed, {
      document: this.document,
      documentName: this.configuration.name
    });
  }
  pageHide() {
    this.awareness && ns(this.awareness, [this.document.clientID], "page hide");
  }
  registerEventListeners() {
    typeof window > "u" || !("addEventListener" in window) || window.addEventListener("pagehide", this.boundPageHide);
  }
  sendStateless(e) {
    this.send(MD, {
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
    this.send(ED, {
      token: e ?? "",
      documentName: this.configuration.name
    });
  }
  documentUpdateHandler(e, t) {
    t !== this && (this.incrementUnsyncedChanges(), this.send(AD, { update: e, documentName: this.configuration.name }));
  }
  awarenessUpdateHandler({ added: e, updated: t, removed: r }, i) {
    const s = e.concat(t).concat(r);
    this.send(Td, {
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
    this.resetUnsyncedChanges(), this.send(Ed, {
      document: this.document,
      documentName: this.configuration.name
    }), this.awareness && this.awareness.getLocalState() !== null && this.send(Td, {
      awareness: this.awareness,
      clients: [this.document.clientID],
      documentName: this.configuration.name
    });
  }
  send(e, t) {
    if (!this._isAttached)
      return;
    const r = new TD(e, t);
    this.emit("outgoingMessage", { message: r.message }), r.send(this.configuration.websocketProvider);
  }
  onMessage(e) {
    const t = new Ya(e.data), r = t.readVarString();
    t.writeVarString(r), this.emit("message", { event: e, message: new Ya(e.data) }), new CD(t).apply(this, !0);
  }
  onClose() {
    this.isAuthenticated = !1, this.synced = !1, this.awareness && ns(this.awareness, Array.from(this.awareness.getStates().keys()).filter((e) => e !== this.document.clientID), this);
  }
  destroy() {
    this.emit("destroy"), this.intervals.forceSync && clearInterval(this.intervals.forceSync), this.awareness && (ns(this.awareness, [this.document.clientID], "provider destroy"), this.awareness.off("update", this.boundAwarenessUpdateHandler), this.awareness.destroy()), this.document.off("update", this.boundDocumentUpdateHandler), this.removeAllListeners(), this.detach(), this.manageSocket && this.configuration.websocketProvider.destroy(), !(typeof window > "u" || !("removeEventListener" in window)) && window.removeEventListener("pagehide", this.boundPageHide);
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
      throw new OD(`Cannot set awareness field "${e}" to ${JSON.stringify(t)}. You have disabled Awareness for this provider by explicitly passing awareness: null in the provider configuration.`);
    this.awareness.setLocalStateField(e, t);
  }
}
const ug = Yl.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), DD = {
  type: "button",
  class: "speaker-popover-trigger"
}, PD = { class: "speaker-popover-name" }, ID = /* @__PURE__ */ B({
  __name: "SpeakerPopover",
  props: {
    turnId: {},
    currentSpeakerId: {}
  },
  setup(n) {
    const e = n, t = ft(), { t: r } = Fe(), i = D(!1), s = D(!1), o = D(""), a = qt("newInput"), l = O(() => Array.from(t.speakers.all.values())), c = O(() => ({
      placeholder: r("speakerPopover.newSpeakerPlaceholder"),
      customParams: { "aria-label": r("speakerPopover.newSpeaker") }
    }));
    Z(i, (m) => {
      m || (s.value = !1, o.value = "");
    });
    async function u() {
      s.value = !0, o.value = "", await ae(), a.value?.focus();
    }
    function d(m) {
      m.id !== e.currentSpeakerId && dE(t, e.turnId, m.id), i.value = !1;
    }
    function f() {
      const m = o.value.trim();
      if (!m) {
        s.value = !1;
        return;
      }
      fE(t, e.turnId, m), i.value = !1;
    }
    function h(m) {
      m.stopPropagation();
    }
    function p() {
      s.value = !1;
    }
    return (m, g) => (E(), I(em, {
      open: i.value,
      "onUpdate:open": g[1] || (g[1] = (v) => i.value = v),
      items: l.value,
      "item-key": (v) => v.id,
      "is-current": (v) => v.id === n.currentSpeakerId,
      onSelect: d
    }, {
      trigger: _(() => [
        H("button", DD, [
          z(m.$slots, "default", {}, void 0, !0)
        ])
      ]),
      item: _(({ item: v }) => [
        L(sl, {
          color: v.color
        }, null, 8, ["color"]),
        H("span", PD, J(v.name), 1)
      ]),
      footer: _(() => [
        s.value ? (E(), I(Zp, {
          key: 1,
          ref: "newInput",
          modelValue: o.value,
          "onUpdate:modelValue": g[0] || (g[0] = (v) => o.value = v),
          field: c.value,
          size: "sm",
          "full-width": "",
          "with-confirmation": "",
          onKeydown: h,
          onOnConfirm: f,
          onOnCancel: p
        }, null, 8, ["modelValue", "field"])) : (E(), I(xe, {
          key: 0,
          icon: "user-plus",
          variant: "transparent",
          block: "",
          onClick: u
        }, {
          default: _(() => [
            pe(J(y(r)("speakerPopover.newSpeaker")), 1)
          ]),
          _: 1
        }))
      ]),
      _: 3
    }, 8, ["open", "items", "item-key", "is-current"]));
  }
}), ND = /* @__PURE__ */ de(ID, [["__scopeId", "data-v-68980c2e"]]), RD = {
  contenteditable: "false",
  class: "turn-header"
}, $D = /* @__PURE__ */ B({
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
    const e = n, t = ft(), r = O(() => {
      const a = e.node.attrs.speakerId;
      return a ? t.speakers.all.get(a) : void 0;
    }), i = O(() => r.value?.color ?? "transparent"), s = O(
      () => t.capabilities.value.speakers === "edit"
    ), o = O(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: a, endTime: l } = e.node.attrs;
      if (a == null || l == null) return !1;
      const c = t.audio.currentTime.value;
      return c >= a && c <= l;
    });
    return (a, l) => (E(), I(y(_T), {
      as: "section",
      class: gt(["turn", { "turn--active": o.value }]),
      style: hn({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: _(() => [
        H("div", RD, [
          s.value ? (E(), I(ND, {
            key: 0,
            "turn-id": n.node.attrs.id,
            "current-speaker-id": n.node.attrs.speakerId
          }, {
            default: _(() => [
              L(oa, {
                speaker: r.value,
                "start-time": n.node.attrs.startTime,
                language: n.node.attrs.language
              }, null, 8, ["speaker", "start-time", "language"])
            ]),
            _: 1
          }, 8, ["turn-id", "current-speaker-id"])) : (E(), I(oa, {
            key: 1,
            speaker: r.value,
            "start-time": n.node.attrs.startTime,
            language: n.node.attrs.language
          }, null, 8, ["speaker", "start-time", "language"]))
        ]),
        L(y(OT), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), BD = /* @__PURE__ */ de($D, [["__scopeId", "data-v-a99ead44"]]), dg = Yl.create({
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
      Pp(n, { "data-type": "turn" }),
      0
    ];
  },
  addKeyboardShortcuts() {
    const n = Lh((e) => e.type.name !== "turn" ? null : {
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
    return IT(BD);
  }
});
function LD(n) {
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
const FD = new nt("storeSync"), zD = rt.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new Re({
        key: FD,
        appendTransaction(t, r, i) {
          if (r.doc.eq(i.doc)) return null;
          if (!t.some(
            (a) => a.getMeta(ce)
          )) {
            const a = VD(i);
            if (a) return a;
          }
          const o = e();
          return o && qD(i.doc, o, n), null;
        }
      })
    ];
  }
});
function qD(n, e, t) {
  const r = LD(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((f) => f.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), a = e.id, l = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    l.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: a });
  for (const c of o) {
    const u = s.get(c.id);
    u ? WD(u, c) && t.emit("turn:update", { turn: c, translationId: a }) : t.emit("turn:add", { turn: c, translationId: a });
  }
  e.replaceTurns(o);
}
function VD(n) {
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
function WD(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const qi = new nt("wordHighlight"), UD = rt.create({
  name: "wordHighlight",
  addProseMirrorPlugins() {
    const { core: n } = this.options, e = this.editor;
    function t() {
      const i = n.audio?.activeWordId.value;
      if (!i) return fe.empty;
      const s = n.activeChannel.value?.activeTranslation.value;
      if (!s) return fe.empty;
      const o = e.state.doc;
      let a = fe.empty;
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
            a = fe.create(o, [
              Ge.inline(m, g, {
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
      new Re({
        key: qi,
        state: {
          init() {
            return fe.empty;
          },
          apply(i, s) {
            return i.getMeta(qi) ? t() : i.docChanged ? s.map(i.mapping, i.doc) : s;
          }
        },
        props: {
          decorations(i) {
            return qi.getState(i);
          }
        },
        view() {
          return r = Z(
            () => n.audio?.activeWordId.value,
            () => {
              const i = e.state.tr.setMeta(qi, !0);
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
}), HD = rt.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      n.setLocalStateField("user", e);
      const t = /* @__PURE__ */ new Map();
      return [
        c_(n, {
          cursorBuilder: (r, i) => jD(t, r, i)
        })
      ];
    }
  }
);
function jD(n, e, t) {
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
function KD(n) {
  return {
    type: "doc",
    content: n.map((e) => JD(e))
  };
}
function JD(n) {
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
const fg = "speakers";
function XD(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e ^ n.charCodeAt(t);
  return lr[(e >>> 0) % lr.length];
}
function Md(n, e, t) {
  return e.color ?? t?.color ?? XD(n);
}
function Ad(n) {
  const { core: e, ydoc: t, translation: r, seedFromCore: i } = n, s = t.getMap(fg);
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
    const h = Md(d, f, e.speakers.all.get(d));
    e.speakers.updateOrCreate({ id: d, name: f.name, color: h });
  }
  const o = (d) => {
    d.changes.keys.forEach((f, h) => {
      if (f.action === "delete")
        e.speakers.delete(h);
      else {
        const p = s.get(h);
        if (!p) return;
        const m = Md(h, p, e.speakers.all.get(h));
        e.speakers.updateOrCreate({ id: h, name: p.name, color: m });
      }
    });
  };
  s.observe(o);
  const a = (d) => {
    const f = s.get(d.id);
    f && na(f, d) || s.set(d.id, { name: d.name, color: d.color });
  }, l = e.on("speaker:add", ({ speaker: d }) => a(d)), c = e.on("speaker:update", ({ speaker: d }) => a(d)), u = e.on("speaker:remove", ({ speakerId: d }) => {
    s.delete(d);
  });
  return () => {
    s.unobserve(o), l(), c(), u();
  };
}
function fP(n = {}) {
  const {
    collab: e,
    field: t = "default",
    user: r = { name: "Anonymous", color: "#999999" }
  } = n;
  return {
    name: "transcriptionEditor",
    install(i) {
      const s = an(void 0), o = D([]), a = D(!1), l = [], c = [];
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
          return d?.getMap(fg) ?? null;
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
      function p(g, v) {
        h();
        const w = new Pg();
        if (d = w, e) {
          const b = new _D({
            url: e.url,
            name: g,
            token: e.token,
            document: w,
            onSynced() {
              a.value = !0;
            },
            onDisconnect() {
              a.value = !1;
            },
            onAwarenessUpdate({ states: C }) {
              o.value = C.map((T) => ({
                clientId: T.clientId,
                ...T.user
              }));
            }
          });
          u = b;
          const S = Z(a, (C) => {
            C && (S(), c.push(
              Ad({ core: i, ydoc: w, translation: v, seedFromCore: !1 })
            ), Od(i, n, w, t, s, b.awareness, l));
          }, { immediate: !0 });
          l.push(S);
        } else {
          const b = w.getXmlFragment(t), S = KD(v.turns.value), C = TC([ug, dg, ym]);
          i_(C, S, b), a.value = !0, c.push(
            Ad({ core: i, ydoc: w, translation: v, seedFromCore: !0 })
          ), Od(i, n, w, t, s, null, l);
        }
      }
      const m = Z(
        () => i.activeChannel.value,
        (g) => {
          if (!g) return;
          m();
          const v = O(
            () => i.activeChannel.value.activeTranslation.value
          );
          p(v.value.id, v.value);
          const w = Z(
            () => v.value.id,
            (b) => {
              p(b, v.value);
            }
          );
          l.push(w);
        },
        { immediate: !0 }
      );
      return () => {
        m(), l.forEach((g) => g()), h(), i.transcriptionEditor = void 0;
      };
    }
  };
}
function Od(n, e, t, r, i, s, o) {
  const a = O(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    ug,
    dg,
    ym,
    v_.configure({
      document: t,
      field: r
    }),
    zD.configure({
      store: n,
      getTranslation: () => a.value
    }),
    UD.configure({ core: n }),
    ...n.pluginExtensions
  ];
  s && l.push(
    HD.configure({
      awareness: s,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  ), i.value = new MT({
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
function _d(n) {
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
function ta(n, e) {
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
function hP() {
  return {
    name: "live",
    install(n) {
      const e = an(null), t = D(!1);
      t.value = !0;
      function r() {
        e.value = null;
      }
      function i(b, S) {
        if (n.activeChannelId.value !== S) return;
        const C = n.activeChannel.value;
        if (!C) return;
        const T = C.activeTranslation.value;
        if (T.isSource) {
          if (b.text == null) return;
          e.value = b.text;
        } else if (b.translations) {
          const k = b.translations.find(
            (M) => M.translationId === T.id
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
      function l(b, S) {
        b.hasTurn(S.id) ? b.updateTurn(S.id, S) : b.addTurn(S);
      }
      function c(b, S) {
        b.speakerId && n.speakers.ensure(b.speakerId);
        const C = n.channels.get(S);
        if (!C) {
          f();
          return;
        }
        if (b.text != null && l(
          C.sourceTranslation,
          _d(b)
        ), b.translations)
          for (const k of b.translations) {
            const M = C.translations.get(k.translationId);
            M && l(
              M,
              ta(b, k)
            );
          }
        n.activeChannel.value?.activeTranslation.value?.isSource && f();
      }
      function u(b, S) {
        d([b], S);
      }
      function d(b, S) {
        const C = n.channels.get(S);
        if (!C) return;
        const T = /* @__PURE__ */ new Set();
        for (const x of b)
          x.speakerId && !T.has(x.speakerId) && (T.add(x.speakerId), n.speakers.ensure(x.speakerId));
        const k = [];
        for (const x of b)
          x.text != null && k.push(_d(x));
        k.length > 0 && C.sourceTranslation.prependTurns(k);
        const M = /* @__PURE__ */ new Map();
        for (const x of b)
          if (x.translations)
            for (const A of x.translations) {
              let P = M.get(A.translationId);
              P || (P = [], M.set(A.translationId, P)), P.push(ta(x, A));
            }
        for (const [x, A] of M) {
          const P = C.translations.get(x);
          P && P.prependTurns(A);
        }
      }
      function f() {
        a(), r();
      }
      function h(b) {
        const S = n.activeChannel.value;
        if (!S) return;
        const C = S.activeTranslation.value;
        if (!b.final && C.languages.includes(b.language))
          e.value = b.text;
        else if (b.final) {
          const T = S.translations.get(b.language);
          if (T) {
            const k = ta(
              { ...b },
              b
            );
            T === C ? l(T, k) : T.updateOrCreateTurnSilent(k);
          }
          C.languages.includes(b.language) && f();
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
function pP(n = {}) {
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
function YD(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function mP(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(YD), o = s[0]?.startTime ?? i.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
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
let hg = 0;
function GD(n) {
  return {
    id: `w_${hg++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function gP(n) {
  hg = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = s.words.map(GD);
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
  Ye as DocumentValidationError,
  lP as Layout,
  cP as createAudioPlugin,
  eP as createCore,
  hP as createLivePlugin,
  pP as createSubtitlePlugin,
  fP as createTranscriptionEditorPlugin,
  mP as mapApiDocument,
  gP as mapWhisperXDocument,
  tP as provideCore,
  nP as provideI18n,
  ft as useCore,
  Kg as validateEditorDocument
};
