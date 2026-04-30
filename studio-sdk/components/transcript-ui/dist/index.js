import * as hc from "vue";
import { shallowReactive as _s, shallowRef as Rt, ref as _, computed as E, inject as ui, provide as Sn, h as He, defineComponent as B, openBlock as T, createBlock as I, resolveDynamicComponent as zd, normalizeClass as ct, normalizeStyle as Pn, createElementBlock as L, useSlots as Tg, renderSlot as J, createCommentVNode as j, createTextVNode as be, toDisplayString as K, createElementVNode as V, Fragment as De, renderList as ht, unref as k, withCtx as $, createVNode as q, watchEffect as rt, onBeforeUnmount as Lt, effectScope as Fd, getCurrentScope as Vd, onScopeDispose as qd, getCurrentInstance as rn, customRef as Ud, toValue as Ke, readonly as Eg, watch as Y, nextTick as ke, onMounted as _e, toHandlerKey as Mg, camelize as Wd, toRef as Li, onUnmounted as fr, toRefs as hr, Comment as Ag, mergeProps as le, cloneVNode as Og, reactive as Ja, Teleport as Dg, normalizeProps as Cn, guardReactiveProps as di, markRaw as Xa, withKeys as jd, withModifiers as Qt, watchPostEffect as Hd, shallowReadonly as zn, mergeDefaults as Kd, isRef as _g, createStaticVNode as Pg, render as pc, useTemplateRef as It, isMemoSame as Rg, Transition as Ga, useId as Jd, withDirectives as Go, vModelSelect as Ig, vModelDynamic as Ng, useModel as $g, vShow as Bg } from "vue";
import * as W from "yjs";
import { UndoManager as Lg, Item as zg, ContentType as Fg, Text as Vg, XmlElement as qg, Doc as Ug } from "yjs";
function Wg() {
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
const tr = [
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
function jg(n, e, t) {
  const r = tr[n.size % tr.length];
  return { id: e, name: t, color: r };
}
function Hg(n, e, t) {
  return !e || n.has(e) ? null : jg(n, e, t ?? e);
}
function Yo(n, e) {
  return n.name === e.name && n.color === e.color;
}
function Kg(n) {
  const e = _s(/* @__PURE__ */ new Map());
  function t(a, l) {
    const c = Hg(e, a, l);
    c && (e.set(c.id, c), n("speaker:add", { speaker: c }));
  }
  function r(a, l) {
    const c = e.get(a);
    if (!c) return;
    const u = { ...c, ...l };
    Yo(c, u) || (e.set(a, u), n("speaker:update", { speaker: u }));
  }
  function i(a) {
    const l = e.get(a.id);
    if (l) {
      if (Yo(l, a)) return;
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
function Jg(n, e) {
  return [...n, e];
}
function Xg(n, e) {
  return [...e, ...n];
}
function Ya(n, e) {
  return n.findIndex((t) => t.id === e);
}
function Gg(n, e, t) {
  const r = Ya(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function Yg(n, e) {
  const t = Ya(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function Zg(n, e, t) {
  const r = Ya(n, e);
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
function Zo(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function Qg(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = Rt(n.turns), l = /* @__PURE__ */ new Map();
  function c() {
    l.clear();
    const v = a.value;
    for (let w = 0; w < v.length; w++)
      l.set(v[w].id, w);
  }
  c();
  function u(v) {
    t(v.speakerId), l.set(v.id, a.value.length), a.value = Jg(a.value, v), e("turn:add", { turn: v, translationId: r });
  }
  function d(v, w) {
    const S = Gg(a.value, v, w);
    S && (a.value = S.turns, e("turn:update", { turn: S.updated, translationId: r }));
  }
  function f(v) {
    const w = Yg(a.value, v);
    w && (a.value = w, c(), e("turn:remove", { turnId: v, translationId: r }));
  }
  function h(v, w) {
    const S = Zg(a.value, v, w);
    S && (a.value = S.turns, e("turn:update", { turn: S.updated, translationId: r }));
  }
  function p(v) {
    Zo(v, t), a.value = Xg(a.value, v), c();
  }
  function m(v) {
    Zo(v, t), a.value = v, c(), e("translation:sync", { translationId: r });
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
function mc(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, a = _s(/* @__PURE__ */ new Map());
  let l;
  for (const m of n.translations) {
    const g = Qg(m, e, t);
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
function ey(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function ty(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Xd(n, e, t = "*") {
  if (n === "*") return t;
  const r = n.split("-")[0] ?? n;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(r) ?? r;
  } catch {
    return n;
  }
}
function ny(n, e, t, r = "*") {
  return [...n].sort(
    (s, o) => Number(o.isSource) - Number(s.isSource)
  ).map((s) => ({
    value: s.id,
    label: s.isSource ? t : s.languages.map((o) => Xd(o, e, r)).join(", ")
  }));
}
function ry(n, e = 250) {
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
function Qi(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
function iy(n, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(n * 1e3));
}
function Gd(n) {
  if (typeof n == "number") {
    const t = n < 1e12 ? n * 1e3 : n, r = new Date(t);
    return Number.isNaN(r.getTime()) ? null : r;
  }
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? null : e;
}
function Yd(n, e) {
  const t = Gd(n);
  return t ? new Intl.DateTimeFormat(e, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(t) : "";
}
function Zd(n, e) {
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
function sy(n, e) {
  const t = Gd(n);
  if (!t) return "";
  const r = Math.round((Date.now() - t.getTime()) / 1e3), i = new Intl.RelativeTimeFormat(e, { numeric: "auto" });
  return Math.abs(r) < 60 ? i.format(0, "minute") : Math.abs(r) < 3600 ? i.format(-Math.round(r / 60), "minute") : Math.abs(r) < 86400 ? i.format(-Math.round(r / 3600), "hour") : i.format(-Math.round(r / 86400), "day");
}
class We extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function oy(n) {
  if (n == null || typeof n != "object")
    throw new We("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new We("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new We("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new We("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new We(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new We(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new We(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new We(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new We(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new We(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new We(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new We(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new We(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new We(`${a}.turns`, "must be an array");
    }
  }
}
function ay(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function Za(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
const ly = 1;
function Qd(n, e) {
  if (!Za(n)) return null;
  for (const t of n)
    if (t.startTime - ly <= e && e <= t.endTime)
      return t.id;
  return null;
}
function HP(n = {}) {
  const e = _(""), t = _(null), r = _(n.activeChannelId ?? ""), i = _(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: a, clear: l } = Wg(), c = Kg(a), u = c, d = _s(/* @__PURE__ */ new Map()), f = E(
    () => d.get(r.value) ?? [...d.values()][0]
  );
  function h(x, A) {
    return s(x, (C) => {
      const O = f.value;
      O && C.translationId === O.activeTranslation.value.id && A(C);
    });
  }
  function p(x) {
    e.value = x.title, t.value = x.date ?? null, c.clear(), d.clear();
    for (const A of ey(x))
      u.ensure(A.id, A.name);
    for (const A of x.channels)
      d.set(A.id, mc(A, a, u.ensure));
    d.size > 0 && !d.has(r.value) && (r.value = d.keys().next().value);
  }
  function m(x) {
    oy(x), p(x);
  }
  function g(x) {
    x !== r.value && (r.value = x, a("channel:change", { channelId: x }));
  }
  function y(x, A) {
    if (d.has(x)) {
      for (const C of A.translations)
        Zo(C.turns, u.ensure);
      d.set(x, mc(A, a, u.ensure)), a("channel:sync", { channelId: x });
    }
  }
  const b = [], v = [];
  function w(x) {
    x.tiptapExtensions && v.push(...x.tiptapExtensions);
    const A = x.install(M);
    A && b.push(A);
  }
  function S() {
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
    destroy: S
  };
  return M;
}
const ef = /* @__PURE__ */ Symbol("core");
function KP(n) {
  Sn(ef, n);
}
function qe() {
  const n = ui(ef);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const cy = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const gc = (n) => n === "";
const uy = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const yc = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const dy = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const fy = (n) => {
  const e = dy(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var br = {
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
const hy = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = br.width,
  color: a = br.stroke,
  ...l
}, { slots: c }) => He(
  "svg",
  {
    ...br,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": gc(t) || gc(r) || t === !0 || r === !0 ? Number(i || s || br["stroke-width"]) * 24 / Number(o) : i || s || br["stroke-width"],
    class: uy(
      "lucide",
      l.class,
      ...n ? [`lucide-${yc(fy(n))}-icon`, `lucide-${yc(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !cy(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => He(...u)), ...c.default ? [c.default()] : []]
);
const ue = (n, e) => (t, { slots: r, attrs: i }) => He(
  hy,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const tf = ue("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const nf = ue("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const py = ue("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const my = ue("clipboard-list", [
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
const gy = ue("clipboard-type", [
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
const yy = ue("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const vy = ue("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const by = ue("ellipsis-vertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const ky = ue("file-text", [
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
const vc = ue("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const wy = ue("message-circle", [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
]);
const rf = ue("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const sf = ue("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const xy = ue("refresh-cw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const Sy = ue("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const of = ue("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const af = ue("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const lf = ue("sparkles", [
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
const Cy = ue("user-plus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const cf = ue("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const uf = ue("volume-2", [
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
const df = ue("volume-x", [
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
const Qa = ue("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Ty = {
  "arrow-down": tf,
  check: nf,
  "chevron-down": py,
  "clipboard-list": my,
  "clipboard-type": gy,
  copy: yy,
  download: vy,
  pause: rf,
  play: sf,
  settings: Sy,
  "skip-back": of,
  "skip-forward": af,
  users: cf,
  volume: uf,
  "volume-mute": df,
  x: Qa,
  "circle-notch": vc,
  spinner: vc,
  "more-vertical": by,
  "user-plus": Cy,
  "file-text": ky,
  "message-circle": wy,
  "refresh-cw": xy,
  sparkles: lf
};
function Vr(n) {
  if (n)
    return Ty[n];
}
const ff = {
  sm: 16,
  md: 20,
  lg: 24
}, Ey = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, My = /* @__PURE__ */ B({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = E(() => Vr(e.name)), r = E(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (T(), I(zd(t.value), {
      key: 0,
      style: Pn(r.value),
      class: ct(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (T(), L("span", Ey, "?"));
  }
}), te = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, gn = /* @__PURE__ */ te(My, [["__scopeId", "data-v-210c7f09"]]), Ay = ["type", "disabled", "aria-disabled", "aria-label"], Oy = {
  key: 3,
  class: "editor-btn__label"
}, Dy = /* @__PURE__ */ B({
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
    const e = n, t = Tg(), r = E(() => !!Vr(e.icon)), i = E(() => !!Vr(e.iconRight)), s = E(() => ff[e.size]), o = E(() => e.disabled || e.loading), a = E(() => !!e.label || !!t.default), l = E(
      () => e.loading || r.value || !!t.icon
    ), c = E(() => l.value && !a.value), u = E(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      c.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, f) => (T(), L("button", {
      type: n.type,
      class: ct(u.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (T(), I(gn, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (T(), I(gn, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? J(d.$slots, "icon", { key: 2 }, void 0, !0) : j("", !0),
      a.value ? (T(), L("span", Oy, [
        J(d.$slots, "default", {}, () => [
          be(K(n.label), 1)
        ], !0)
      ])) : j("", !0),
      i.value ? (T(), I(gn, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? J(d.$slots, "icon-right", { key: 5 }, void 0, !0) : j("", !0)
    ], 10, Ay));
  }
}), ve = /* @__PURE__ */ te(Dy, [["__scopeId", "data-v-2212567e"]]), hf = {
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
}, _y = {
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
}, bc = { fr: hf, en: _y }, pf = /* @__PURE__ */ Symbol("i18n");
function mf(n, e) {
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
function JP(n) {
  const e = E(() => {
    const r = bc[n.value] ?? bc.fr;
    return (i, s) => mf(r[i] ?? i, s);
  }), t = {
    t: (r, i) => e.value(r, i),
    locale: n
  };
  return Sn(pf, t), t;
}
function he() {
  const n = ui(pf);
  if (n) return n;
  const e = E(() => "fr");
  return {
    t: (t, r) => mf(hf[t] ?? t, r),
    locale: e
  };
}
const Py = { class: "editor-header" }, Ry = { class: "header-main" }, Iy = { class: "document-title" }, Ny = {
  key: 0,
  class: "document-meta"
}, $y = { class: "header-right" }, By = { key: 0 }, Ly = /* @__PURE__ */ B({
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
    const e = n, { t, locale: r } = he(), i = E(() => e.title.replace(/-/g, " ")), s = E(
      () => e.date != null ? Yd(e.date, r.value) : ""
    ), o = E(
      () => Zd(e.duration, r.value)
    ), a = E(
      () => t("header.speakerCount", { count: e.speakerCount })
    ), l = E(
      () => [
        s.value,
        o.value,
        a.value
      ].filter(Boolean)
    );
    return (c, u) => (T(), L("header", Py, [
      V("div", Ry, [
        V("h1", Iy, K(i.value), 1),
        l.value.length ? (T(), L("div", Ny, [
          (T(!0), L(De, null, ht(l.value, (d, f) => (T(), L("span", {
            key: f,
            class: "document-meta__part"
          }, K(d), 1))), 128))
        ])) : j("", !0)
      ]),
      V("div", $y, [
        n.isMobile ? (T(), I(ve, {
          key: 0,
          variant: "transparent",
          "aria-label": k(t)("header.openSidebar"),
          onClick: u[0] || (u[0] = (d) => c.$emit("toggleSidebar"))
        }, {
          icon: $(() => [
            q(k(cf), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : j("", !0),
        q(ve, {
          variant: "primary",
          "aria-label": k(t)("header.ask"),
          disabled: ""
        }, {
          icon: $(() => [
            q(k(lf), { size: 16 })
          ]),
          default: $(() => [
            n.isMobile ? j("", !0) : (T(), L("span", By, K(k(t)("header.ask")), 1))
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), zy = /* @__PURE__ */ te(Ly, [["__scopeId", "data-v-7975aaa4"]]), Fy = ["aria-label"], Vy = /* @__PURE__ */ B({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (T(), L("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      J(e.$slots, "default", {}, void 0, !0)
    ], 8, Fy));
  }
}), qy = /* @__PURE__ */ te(Vy, [["__scopeId", "data-v-732d4c24"]]), Uy = ["aria-label"], Wy = ["aria-selected", "aria-disabled", "disabled", "onClick"], jy = { class: "tab__label" }, Hy = /* @__PURE__ */ B({
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
    return (s, o) => (T(), L("div", {
      class: "tabs",
      role: "tablist",
      "aria-label": n.ariaLabel
    }, [
      (T(!0), L(De, null, ht(n.tabs, (a) => (T(), L("button", {
        key: a.value,
        type: "button",
        role: "tab",
        class: ct(["tab", { "tab--active": a.value === n.modelValue }]),
        "aria-selected": a.value === n.modelValue,
        "aria-disabled": a.disabled || void 0,
        disabled: a.disabled,
        onClick: (l) => i(a)
      }, [
        k(Vr)(a.icon) ? (T(), I(gn, {
          key: 0,
          name: a.icon,
          size: 16,
          class: "tab__icon"
        }, null, 8, ["name"])) : j("", !0),
        V("span", jy, K(a.label), 1),
        a.badge ? (T(), I(qy, {
          key: 1,
          class: "tab__badge"
        }, {
          default: $(() => [
            be(K(a.badge), 1)
          ]),
          _: 2
        }, 1024)) : j("", !0)
      ], 10, Wy))), 128))
    ], 8, Uy));
  }
}), Ky = /* @__PURE__ */ te(Hy, [["__scopeId", "data-v-24f9730e"]]), jn = "__transcription__", zi = "__verbatim__", Jy = /* @__PURE__ */ B({
  __name: "TabBar",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = qe(), { t: s } = he(), o = E(() => {
      const l = i.llmServices?.list.value ?? [];
      return [
        {
          value: jn,
          label: s("tabs.transcription"),
          icon: "message-circle"
        },
        {
          value: zi,
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
    return (l, c) => k(i).llmServices ? (T(), I(Ky, {
      key: 0,
      tabs: o.value,
      "model-value": n.modelValue,
      "onUpdate:modelValue": a
    }, null, 8, ["tabs", "model-value"])) : j("", !0);
  }
}), fo = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Xy = 70, Gy = 1e3 / 60, Yy = 350;
let Fi = !1, kc = !1;
function Zy() {
  kc || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Fi = !0;
  }), document.addEventListener("mouseup", () => {
    Fi = !1;
  }), document.addEventListener("click", () => {
    Fi = !1;
  }), kc = !0);
}
const ho = /* @__PURE__ */ new Map();
function po(...n) {
  const e = {
    damping: fo.damping,
    stiffness: fo.stiffness,
    mass: fo.mass
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
  return ho.has(r) || ho.set(r, Object.freeze({ ...e })), t ? "instant" : ho.get(r);
}
function Qy(n = {}) {
  Zy();
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
    const R = l();
    if (!e.targetScrollTop)
      return R;
    if (c?.targetScrollTop === R)
      return c.calculatedScrollTop;
    const z = Math.max(
      Math.min(
        e.targetScrollTop(R, {
          scrollElement: O,
          contentElement: D
        }),
        R
      ),
      0
    );
    return c = { targetScrollTop: R, calculatedScrollTop: z }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      c = void 0;
    }), z;
  }
  function d() {
    return u() - o();
  }
  function f() {
    return d() <= Xy;
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
    if (!Fi || typeof window > "u")
      return !1;
    const O = window.getSelection?.();
    if (!O || !O.rangeCount)
      return !1;
    const D = O.getRangeAt(0), R = r.scrollElement;
    if (!R)
      return !1;
    const z = D.commonAncestorContainer;
    return !!(z && (R.contains(z) || z.contains(R)));
  }
  const y = (O) => {
    if (O.target !== r.scrollElement)
      return;
    const D = o(), R = r.ignoreScrollToTop;
    let z = r.lastScrollTop ?? D;
    r.lastScrollTop = D, r.ignoreScrollToTop = void 0, R && R > D && (z = R), m(f()), setTimeout(() => {
      if (r.resizeDifference || D === R)
        return;
      if (g()) {
        p(!0), h(!1);
        return;
      }
      const N = D > z, U = D < z;
      if (r.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      U && (p(!0), h(!1)), N && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, b = (O) => {
    const D = r.scrollElement;
    if (!D)
      return;
    let R = O.target;
    for (; R && !["scroll", "auto"].includes(getComputedStyle(R).overflow); ) {
      if (!R.parentElement)
        return;
      R = R.parentElement;
    }
    R === D && O.deltaY < 0 && D.scrollHeight > D.clientHeight && !r.animation?.ignoreEscapes && (p(!0), h(!1));
  };
  function v(O, D) {
    w(), r.scrollElement = O, r.contentElement = D, getComputedStyle(O).overflow === "visible" && (O.style.overflow = "auto"), O.addEventListener("scroll", y, { passive: !0 }), O.addEventListener("wheel", b, { passive: !0 });
    let R;
    r.resizeObserver = new ResizeObserver((z) => {
      const N = z[0];
      if (!N)
        return;
      const { height: U } = N.contentRect, ne = U - (R ?? U);
      if (r.resizeDifference = ne, o() > l() && a(l()), m(f()), ne >= 0) {
        const Z = po(
          e,
          R ? e.resize : e.initial
        );
        x({
          animation: Z,
          wait: !0,
          preserveScrollPosition: !0,
          duration: Z === "instant" ? void 0 : Yy
        });
      } else
        f() && (p(!1), h(!0));
      R = U, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === ne && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(D);
  }
  function w() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", y), r.scrollElement.removeEventListener("wheel", b)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function S() {
    w(), t.clear();
  }
  function M(O) {
    e = { ...e, ...O };
  }
  function x(O = {}) {
    const D = typeof O == "string" ? { animation: O } : O;
    D.preserveScrollPosition || h(!0);
    const R = Date.now() + (Number(D.wait) || 0), z = po(e, D.animation), { ignoreEscapes: N = !1 } = D;
    let U, ne = u();
    D.duration instanceof Promise ? D.duration.finally(() => {
      U = Date.now();
    }) : U = R + (D.duration ?? 0);
    const Z = async () => {
      const ae = new Promise((ge) => {
        if (typeof requestAnimationFrame > "u") {
          ge(!1);
          return;
        }
        requestAnimationFrame(() => ge(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const ge = o(), ln = typeof performance < "u" ? performance.now() : Date.now(), Cg = (ln - (r.lastTick ?? ln)) / Gy;
        if (r.animation ||= { behavior: z, promise: ae, ignoreEscapes: N }, r.animation.behavior === z && (r.lastTick = ln), g() || R > Date.now())
          return Z();
        if (ge < Math.min(ne, u())) {
          if (r.animation?.behavior === z) {
            if (z === "instant")
              return a(u()), Z();
            const uo = z;
            r.velocity = (uo.damping * r.velocity + uo.stiffness * d()) / uo.mass, r.accumulated += r.velocity * Cg;
            const fc = o();
            a(fc + r.accumulated), o() !== fc && (r.accumulated = 0);
          }
          return Z();
        }
        return U > Date.now() ? (ne = u(), Z()) : (r.animation = void 0, o() < u() ? x({
          animation: po(e, e.resize),
          ignoreEscapes: N,
          duration: Math.max(0, U - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ae.then((ge) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), ge));
    };
    return D.wait !== !0 && (r.animation = void 0), r.animation?.behavior === z ? r.animation.promise : Z();
  }
  const A = () => {
    p(!0), h(!1);
  };
  function C(O) {
    return t.add(O), () => t.delete(O);
  }
  return {
    attach: v,
    detach: w,
    destroy: S,
    setOptions: M,
    getState: s,
    onChange: C,
    scrollToBottom: x,
    stopScroll: A
  };
}
function ev(n = {}) {
  const e = _(null), t = _(null), r = _(n.initial !== !1), i = _(!1), s = _(!1), o = Qy(n);
  let a = null;
  return rt((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), Lt(() => {
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
const tv = /* @__PURE__ */ B({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (T(), L("span", {
      class: "speaker-indicator",
      style: Pn({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Ps = /* @__PURE__ */ te(tv, [["__scopeId", "data-v-9bffeda8"]]), nv = { class: "speaker-label" }, rv = {
  key: 1,
  class: "speaker-name"
}, iv = ["datetime"], sv = { class: "lang" }, ov = /* @__PURE__ */ B({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    startDate: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = he(), i = E(
      () => Xd(e.language, r.value, t("language.wildcard"))
    ), s = E(() => {
      if (e.startTime != null)
        return {
          text: Qi(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const a = new Date(e.startDate * 1e3);
        return {
          text: iy(e.startDate, r.value),
          datetime: a.toISOString()
        };
      }
      return null;
    }), o = E(() => e.speaker?.color ?? "transparent");
    return (a, l) => (T(), L("div", nv, [
      n.speaker ? (T(), I(Ps, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : j("", !0),
      n.speaker ? (T(), L("span", rv, K(n.speaker.name), 1)) : j("", !0),
      s.value ? (T(), L("time", {
        key: 2,
        class: "timestamp",
        datetime: s.value.datetime
      }, K(s.value.text), 9, iv)) : j("", !0),
      V("span", sv, K(i.value), 1)
    ]));
  }
}), Qo = /* @__PURE__ */ te(ov, [["__scopeId", "data-v-b451886f"]]);
function wc(n) {
  return typeof n == "string" ? `'${n}'` : new av().serialize(n);
}
const av = /* @__PURE__ */ (function() {
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
function ea(n, e) {
  return n === e || wc(n) === wc(e);
}
function gt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = ui(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Sn(r, o), o)];
}
function Je() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function gf(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function es(n) {
  return n == null;
}
function xc(n, e) {
  return es(n) ? !1 : Array.isArray(n) ? n.some((t) => ea(t, e)) : ea(n, e);
}
function el(n) {
  return n ? n.flatMap((e) => e.type === De ? el(e.children) : [e]) : [];
}
const lv = ["INPUT", "TEXTAREA"];
function cv(n, e, t, r = {}) {
  if (!e || r.enableIgnoredElement && lv.includes(e.nodeName)) return null;
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
  return b || y ? w = yf(v, e, {
    goForward: y ? p : l === "ltr" ? d : f,
    loop: a
  }) : m ? w = v.at(0) || null : g && (w = v.at(-1) || null), u && w?.focus(), w;
}
function yf(n, e, t, r = n.length) {
  if (--r === 0) return null;
  const i = n.indexOf(e), s = t.goForward ? i + 1 : i - 1;
  if (!t.loop && (s < 0 || s >= n.length)) return null;
  const o = (s + n.length) % n.length, a = n[o];
  return a ? a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false" ? yf(n, a, t, r) : a : null;
}
const [tl] = gt("ConfigProvider");
function uv(n, e) {
  var t;
  const r = Rt();
  return rt(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Eg(r);
}
function vf(n, e) {
  return Vd() ? (qd(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function dv(n) {
  let e = !1, t;
  const r = Fd(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const sn = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const fv = (n) => typeof n < "u", hv = Object.prototype.toString, pv = (n) => hv.call(n) === "[object Object]";
function mo(n) {
  return Array.isArray(n) ? n : [n];
}
function mv(n) {
  return rn();
}
// @__NO_SIDE_EFFECTS__
function bf(n) {
  if (!sn) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = Fd(!0), t = r.run(() => n(...s))), vf(i), t));
}
function gv(n, e = 1e4) {
  return Ud((t, r) => {
    let i = Ke(n), s;
    const o = () => setTimeout(() => {
      i = Ke(n), r();
    }, Ke(e));
    return vf(() => {
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
function yv(n, e) {
  mv() && Lt(n, e);
}
function vv(n, e, t) {
  return Y(n, e, {
    ...t,
    immediate: !0
  });
}
const nl = sn ? window : void 0;
function Rn(n) {
  var e;
  const t = Ke(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function ta(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = E(() => {
    const r = mo(Ke(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return vv(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => Rn(s))) !== null && r !== void 0 ? r : [nl].filter((s) => s != null),
      mo(Ke(t.value ? n[1] : n[0])),
      mo(k(t.value ? n[2] : n[1])),
      Ke(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = pv(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function bv() {
  const n = Rt(!1), e = rn();
  return e && _e(() => {
    n.value = !0;
  }, e), n;
}
function kv(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function wv(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = nl, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = kv(e);
  return ta(i, s, (u) => {
    u.repeat && Ke(a) || l(u) && t(u);
  }, o);
}
function xv(n) {
  return JSON.parse(JSON.stringify(n));
}
// @__NO_SIDE_EFFECTS__
function fi(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = rn(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (b) => o ? typeof o == "function" ? o(b) : xv(b) : b, g = () => fv(n[e]) ? m(n[e]) : u, y = (b) => {
    d ? d(b) && h(p, b) : h(p, b);
  };
  if (a) {
    const b = _(g());
    let v = !1;
    return Y(() => n[e], (w) => {
      v || (v = !0, b.value = m(w), ke(() => v = !1));
    }), Y(b, (w) => {
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
function go(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function na(n, e, t = ".", r) {
  if (!go(e))
    return na(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : go(o) && go(i[s]) ? i[s] = na(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function Sv(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => na(t, r, "", n), {})
  );
}
const Cv = Sv(), Tv = /* @__PURE__ */ bf(() => {
  const n = _(/* @__PURE__ */ new Map()), e = _(), t = E(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), r = tl({ scrollBody: _(!0) }), i = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", e.value = void 0;
  };
  return Y(t, (s, o) => {
    if (!sn) return;
    if (!s) {
      o && i();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, l = {
      padding: a,
      margin: 0
    }, c = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Cv({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, l) : l : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), ke(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function kf(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Tv();
  t.value.set(e, n ?? !1);
  const r = E({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return yv(() => {
    t.value.delete(e);
  }), r;
}
function rl(n) {
  const e = tl({ dir: _("ltr") });
  return E(() => n?.value || e.dir?.value || "ltr");
}
function hi(n) {
  const e = rn(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[Mg(Wd(i))] = (...s) => n(i, ...s);
  }), r;
}
let yo = 0;
function Ev() {
  rt((n) => {
    if (!sn) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Sc()), document.body.insertAdjacentElement("beforeend", e[1] ?? Sc()), yo++, n(() => {
      yo === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), yo--;
    });
  });
}
function Sc() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Mv(n) {
  return E(() => Ke(n) ? !!Rn(n)?.closest("form") : !0);
}
function de() {
  const n = rn(), e = _(), t = E(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Rn(e)), r = Object.assign({}, n.exposed), i = {};
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
function Av(n) {
  const e = rn(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Li(n);
  return E(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[Wd(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function Rs(n, e) {
  const t = Av(n), r = e ? hi(e) : {};
  return E(() => ({
    ...t.value,
    ...r
  }));
}
var Ov = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, Fn = /* @__PURE__ */ new WeakMap(), Si = /* @__PURE__ */ new WeakMap(), Ci = {}, vo = 0, wf = function(n) {
  return n && (n.host || wf(n.parentNode));
}, Dv = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = wf(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, _v = function(n, e, t, r) {
  var i = Dv(e, Array.isArray(n) ? n : [n]);
  Ci[t] || (Ci[t] = /* @__PURE__ */ new WeakMap());
  var s = Ci[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (Fn.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          Fn.set(f, m), s.set(f, g), o.push(f), m === 1 && p && Si.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return u(e), a.clear(), vo++, function() {
    o.forEach(function(d) {
      var f = Fn.get(d) - 1, h = s.get(d) - 1;
      Fn.set(d, f), s.set(d, h), f || (Si.has(d) || d.removeAttribute(r), Si.delete(d)), h || d.removeAttribute(t);
    }), vo--, vo || (Fn = /* @__PURE__ */ new WeakMap(), Fn = /* @__PURE__ */ new WeakMap(), Si = /* @__PURE__ */ new WeakMap(), Ci = {});
  };
}, Pv = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = Ov(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), _v(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function xf(n) {
  let e;
  Y(() => Rn(n), (t) => {
    t ? e = Pv(t) : e && e();
  }), fr(() => {
    e && e();
  });
}
let Rv = 0;
function qr(n, e = "reka") {
  if ("useId" in hc) return `${e}-${hc.useId?.()}`;
  const t = tl({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Rv}`;
}
function Iv(n) {
  const e = _(), t = E(() => e.value?.width ?? 0), r = E(() => e.value?.height ?? 0);
  return _e(() => {
    const i = Rn(n);
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
function Nv(n, e) {
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
function $v(n) {
  const e = gv("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Je(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = Lv(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Bv(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function Lv(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = Bv(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== t ? l : void 0;
}
function zv(n, e) {
  const t = _({}), r = _("none"), i = _(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? nl, { state: l, dispatch: c } = Nv(s, {
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
    if (sn) {
      const y = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(y);
    }
  };
  Y(n, async (g, y) => {
    const b = y !== g;
    if (await ke(), b) {
      const v = r.value, w = Ti(e.value);
      g ? (c("MOUNT"), u("enter"), w === "none" && u("after-enter")) : w === "none" || w === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : y && v !== w ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const y = Ti(e.value), b = y.includes(CSS.escape(g.animationName)), v = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && b && (u(`after-${v}`), c("ANIMATION_END"), !i.value)) {
      const w = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = w);
      });
    }
    g.target === e.value && y === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = Ti(e.value));
  }, h = Y(e, (g, y) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), y?.removeEventListener("animationstart", f), y?.removeEventListener("animationcancel", d), y?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = Y(l, () => {
    const g = Ti(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return fr(() => {
    h(), p();
  }), { isPresent: E(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Ti(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Is = B({
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
    const { present: r, forceMount: i } = hr(n), s = _(), { isPresent: o } = zv(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = el(a || []);
    const l = rn();
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
    return () => i.value || r.value || o.value ? He(e.default({ present: o.value })[0], { ref: (c) => {
      const u = Rn(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const ra = B({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = el(t.default()), i = r.findIndex((l) => l.type !== Ag);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? le(e, s.props) : e, a = Og({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), Fv = [
  "area",
  "img",
  "input"
], Ye = B({
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
    return typeof r == "string" && Fv.includes(r) ? () => He(r, e) : r !== "template" ? () => He(n.as, e, { default: t.default }) : () => He(ra, e, { default: t.default });
  }
});
function ia() {
  const n = _(), e = E(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Rn(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [on, Vv] = gt("DialogRoot");
var qv = /* @__PURE__ */ B({
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
    const t = n, i = /* @__PURE__ */ fi(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = _(), o = _(), { modal: a } = hr(t);
    return Vv({
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
}), Uv = qv, Wv = /* @__PURE__ */ B({
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
    de();
    const t = on();
    return (r, i) => (T(), I(k(Ye), le(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => k(t).onOpenChange(!1))
    }), {
      default: $(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), jv = Wv;
const Hv = "dismissableLayer.pointerDownOutside", Kv = "dismissableLayer.focusOutside";
function Sf(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function Jv(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = _(!1), s = _(() => {
  });
  return rt((o) => {
    if (!sn || !Ke(t)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (Sf(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            gf(Hv, n, d);
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
    Ke(t) && (i.value = !0);
  } };
}
function Xv(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = _(!1);
  return rt((s) => {
    if (!sn || !Ke(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await ke(), await ke();
      const l = a.target;
      !e.value || !l || Sf(e.value, l) || a.target && !i.value && gf(Kv, n, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Ke(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Ke(t) && (i.value = !1);
    }
  };
}
const it = Ja({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Gv = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = de(), o = E(() => s.value?.ownerDocument ?? globalThis.document), a = E(() => it.layersRoot), l = E(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = E(() => it.layersWithOutsidePointerEventsDisabled.size > 0), u = E(() => {
      const h = Array.from(a.value), [p] = [...it.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return l.value >= m;
    }), d = Jv(async (h) => {
      const p = [...it.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await ke(), h.defaultPrevented || r("dismiss"));
    }, s), f = Xv((h) => {
      [...it.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return wv("Escape", (h) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), rt((h) => {
      s.value && (t.disableOutsidePointerEvents && (it.layersWithOutsidePointerEventsDisabled.size === 0 && (it.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), it.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && it.layersWithOutsidePointerEventsDisabled.size === 1 && !es(it.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = it.originalBodyPointerEvents);
      }));
    }), rt((h) => {
      h(() => {
        s.value && (a.value.delete(s.value), it.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (T(), I(k(Ye), {
      ref: k(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: Pn({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
      onFocusCapture: k(f).onFocusCapture,
      onBlurCapture: k(f).onBlurCapture,
      onPointerdownCapture: k(d).onPointerDownCapture
    }, {
      default: $(() => [J(h.$slots, "default")]),
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
}), Cf = Gv;
const Yv = /* @__PURE__ */ dv(() => _([]));
function Zv() {
  const n = Yv();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = Cc(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = Cc(n.value, e), n.value[0]?.resume();
    }
  };
}
function Cc(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const bo = "focusScope.autoFocusOnMount", ko = "focusScope.autoFocusOnUnmount", Tc = {
  bubbles: !1,
  cancelable: !0
};
function Qv(n, { select: e = !1 } = {}) {
  const t = Je();
  for (const r of n)
    if (Vt(r, { select: e }), Je() !== t) return !0;
}
function eb(n) {
  const e = Tf(n), t = Ec(e, n), r = Ec(e.reverse(), n);
  return [t, r];
}
function Tf(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function Ec(n, e) {
  for (const t of n) if (!tb(t, { upTo: e })) return t;
}
function tb(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function nb(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Vt(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Je();
    n.focus({ preventScroll: !0 }), n !== t && nb(n) && e && n.select();
  }
}
var rb = /* @__PURE__ */ B({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = de(), o = _(null), a = Zv(), l = Ja({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    rt((u) => {
      if (!sn) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(g) {
        if (l.paused || !d) return;
        const y = g.target;
        d.contains(y) ? o.value = y : Vt(o.value, { select: !0 });
      }
      function h(g) {
        if (l.paused || !d) return;
        const y = g.relatedTarget;
        y !== null && (d.contains(y) || Vt(o.value, { select: !0 }));
      }
      function p(g) {
        d.contains(o.value) || Vt(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", h);
      const m = new MutationObserver(p);
      d && m.observe(d, {
        childList: !0,
        subtree: !0
      }), u(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", h), m.disconnect();
      });
    }), rt(async (u) => {
      const d = s.value;
      if (await ke(), !d) return;
      a.add(l);
      const f = Je();
      if (!d.contains(f)) {
        const p = new CustomEvent(bo, Tc);
        d.addEventListener(bo, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (Qv(Tf(d), { select: !0 }), Je() === f && Vt(d));
      }
      u(() => {
        d.removeEventListener(bo, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(ko, Tc), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(ko, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Vt(f ?? document.body, { select: !0 }), d.removeEventListener(ko, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = Je();
      if (d && f) {
        const h = u.currentTarget, [p, m] = eb(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && Vt(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && Vt(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (T(), I(k(Ye), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": u.asChild,
      as: u.as,
      onKeydown: c
    }, {
      default: $(() => [J(u.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Ef = rb;
const ib = "menu.itemSelect", sa = ["Enter", " "], sb = [
  "ArrowDown",
  "PageUp",
  "Home"
], Mf = [
  "ArrowUp",
  "PageDown",
  "End"
], ob = [...sb, ...Mf];
[...sa], [...sa];
function Af(n) {
  return n ? "open" : "closed";
}
function ab(n) {
  const e = Je();
  for (const t of n)
    if (t === e || (t.focus(), Je() !== e)) return;
}
function lb(n, e) {
  const { x: t, y: r } = n;
  let i = !1;
  for (let s = 0, o = e.length - 1; s < e.length; o = s++) {
    const a = e[s].x, l = e[s].y, c = e[o].x, u = e[o].y;
    l > r != u > r && t < (c - a) * (r - l) / (u - l) + a && (i = !i);
  }
  return i;
}
function cb(n, e) {
  if (!e) return !1;
  const t = {
    x: n.clientX,
    y: n.clientY
  };
  return lb(t, e);
}
function oa(n) {
  return n.pointerType === "mouse";
}
const ub = "DialogTitle", db = "DialogContent";
function fb({ titleName: n = ub, contentName: e = db, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  _e(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(a));
  });
}
var hb = /* @__PURE__ */ B({
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
    const t = n, r = e, i = on(), { forwardRef: s, currentElement: o } = de();
    return i.titleId ||= qr(void 0, "reka-dialog-title"), i.descriptionId ||= qr(void 0, "reka-dialog-description"), _e(() => {
      i.contentElement = o, Je() !== document.body && (i.triggerElement.value = Je());
    }), process.env.NODE_ENV !== "production" && fb({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, l) => (T(), I(k(Ef), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: $(() => [q(k(Cf), le({
        id: k(i).contentId,
        ref: k(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": k(i).descriptionId,
        "aria-labelledby": k(i).titleId,
        "data-state": k(Af)(k(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => k(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: $(() => [J(a.$slots, "default")]),
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
}), Of = hb, pb = /* @__PURE__ */ B({
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
    const t = n, r = e, i = on(), s = hi(r), { forwardRef: o, currentElement: a } = de();
    return xf(a), (l, c) => (T(), I(Of, le({
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
      default: $(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), mb = pb, gb = /* @__PURE__ */ B({
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
    const t = n, i = hi(e);
    de();
    const s = on(), o = _(!1), a = _(!1);
    return (l, c) => (T(), I(Of, le({
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
      default: $(() => [J(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), yb = gb, vb = /* @__PURE__ */ B({
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
    const t = n, r = e, i = on(), s = hi(r), { forwardRef: o } = de();
    return (a, l) => (T(), I(k(Is), { present: a.forceMount || k(i).open.value }, {
      default: $(() => [k(i).modal.value ? (T(), I(mb, le({
        key: 0,
        ref: k(o)
      }, {
        ...t,
        ...k(s),
        ...a.$attrs
      }), {
        default: $(() => [J(a.$slots, "default")]),
        _: 3
      }, 16)) : (T(), I(yb, le({
        key: 1,
        ref: k(o)
      }, {
        ...t,
        ...k(s),
        ...a.$attrs
      }), {
        default: $(() => [J(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), bb = vb, kb = /* @__PURE__ */ B({
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
    const e = on();
    return kf(!0), de(), (t, r) => (T(), I(k(Ye), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": k(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: $(() => [J(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), wb = kb, xb = /* @__PURE__ */ B({
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
    const e = on(), { forwardRef: t } = de();
    return (r, i) => k(e)?.modal.value ? (T(), I(k(Is), {
      key: 0,
      present: r.forceMount || k(e).open.value
    }, {
      default: $(() => [q(wb, le(r.$attrs, {
        ref: k(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: $(() => [J(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : j("v-if", !0);
  }
}), Sb = xb, Cb = /* @__PURE__ */ B({
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
    const e = /* @__PURE__ */ bv();
    return (t, r) => k(e) || t.forceMount ? (T(), I(Dg, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [J(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : j("v-if", !0);
  }
}), Df = Cb, Tb = /* @__PURE__ */ B({
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
    return (t, r) => (T(), I(k(Df), Cn(di(e)), {
      default: $(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Eb = Tb, Mb = /* @__PURE__ */ B({
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
    const e = n, t = on();
    return de(), (r, i) => (T(), I(k(Ye), le(e, { id: k(t).titleId }), {
      default: $(() => [J(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Ab = Mb;
const Mc = "data-reka-collection-item";
function il(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = _(/* @__PURE__ */ new Map());
    i = {
      collectionRef: _(),
      itemMap: u
    }, Sn(r, i);
  } else i = ui(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Mc}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = B({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = ia();
      return Y(p, () => {
        i.collectionRef.value = p.value;
      }), () => He(ra, {
        ref: h,
        ...f
      }, d);
    }
  }), a = B({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = ia();
      return rt((m) => {
        if (p.value) {
          const g = Xa(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => He(ra, {
        ...f,
        [Mc]: "",
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
const Ob = "rovingFocusGroup.onEntryFocus", Db = {
  bubbles: !1,
  cancelable: !0
}, _b = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Pb(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Rb(n, e, t) {
  const r = Pb(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return _b[r];
}
function _f(n, e = !1) {
  const t = Je();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), Je() !== t)) return;
}
function Ib(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [Nb, $b] = gt("RovingFocusGroup");
var Bb = /* @__PURE__ */ B({
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
    const r = n, i = t, { loop: s, orientation: o, dir: a } = hr(r), l = rl(a), c = /* @__PURE__ */ fi(r, "currentTabStopId", i, {
      defaultValue: r.defaultCurrentTabStopId,
      passive: r.currentTabStopId === void 0
    }), u = _(!1), d = _(!1), f = _(0), { getItems: h, CollectionSlot: p } = il({ isProvider: !0 });
    function m(y) {
      const b = !d.value;
      if (y.currentTarget && y.target === y.currentTarget && b && !u.value) {
        const v = new CustomEvent(Ob, Db);
        if (y.currentTarget.dispatchEvent(v), i("entryFocus", v), !v.defaultPrevented) {
          const w = h().map((C) => C.ref).filter((C) => C.dataset.disabled !== ""), S = w.find((C) => C.getAttribute("data-active") === ""), M = w.find((C) => C.getAttribute("data-highlighted") === ""), x = w.find((C) => C.id === c.value), A = [
            S,
            M,
            x,
            ...w
          ].filter(Boolean);
          _f(A, r.preventScrollOnEntryFocus);
        }
      }
      d.value = !1;
    }
    function g() {
      setTimeout(() => {
        d.value = !1;
      }, 1);
    }
    return e({ getItems: h }), $b({
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
    }), (y, b) => (T(), I(k(p), null, {
      default: $(() => [q(k(Ye), {
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
        default: $(() => [J(y.$slots, "default")]),
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
}), Lb = Bb, zb = /* @__PURE__ */ B({
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
    const e = n, t = Nb(), r = qr(), i = E(() => e.tabStopId || r), s = E(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = il();
    _e(() => {
      e.focusable && t.onFocusableItemAdd();
    }), fr(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function l(c) {
      if (c.key === "Tab" && c.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (c.target !== c.currentTarget) return;
      const u = Rb(c, t.orientation.value, t.dir.value);
      if (u !== void 0) {
        if (c.metaKey || c.ctrlKey || c.altKey || !e.allowShiftKey && c.shiftKey) return;
        c.preventDefault();
        let d = [...o().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (u === "last") d.reverse();
        else if (u === "prev" || u === "next") {
          u === "prev" && d.reverse();
          const f = d.indexOf(c.currentTarget);
          d = t.loop.value ? Ib(d, f + 1) : d.slice(f + 1);
        }
        ke(() => _f(d));
      }
    }
    return (c, u) => (T(), I(k(a), null, {
      default: $(() => [q(k(Ye), {
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
        default: $(() => [J(c.$slots, "default")]),
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
}), Fb = zb, Vb = /* @__PURE__ */ B({
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
    return (e, t) => (T(), I(k(Ye), {
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
      default: $(() => [J(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), qb = Vb, Ub = /* @__PURE__ */ B({
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
    const e = n, { primitiveElement: t, currentElement: r } = ia(), i = E(() => e.checked ?? e.value);
    return Y(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (T(), I(qb, le({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Ac = Ub, Wb = /* @__PURE__ */ B({
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
    return (i, s) => (T(), L(De, null, [j(" We render single input if it's required "), t.value ? (T(), I(Ac, le({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (T(!0), L(De, { key: 1 }, ht(r.value, (o) => (T(), I(Ac, le({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), jb = Wb;
const [Hb] = gt("CheckboxGroupRoot");
function ts(n) {
  return n === "indeterminate";
}
function Pf(n) {
  return ts(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [Kb, Jb] = gt("CheckboxRoot");
var Xb = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = de(), o = Hb(null), a = /* @__PURE__ */ fi(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), l = E(() => o?.disabled.value || t.disabled), c = E(() => es(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : xc(o.modelValue.value, t.value));
    function u() {
      if (es(o?.modelValue.value))
        a.value = ts(a.value) ? !0 : !a.value;
      else {
        const h = [...o.modelValue.value || []];
        if (xc(h, t.value)) {
          const p = h.findIndex((m) => ea(m, t.value));
          h.splice(p, 1);
        } else h.push(t.value);
        o.modelValue.value = h;
      }
    }
    const d = Mv(s), f = E(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Jb({
      disabled: l,
      state: c
    }), (h, p) => (T(), I(zd(k(o)?.rovingFocus.value ? k(Fb) : k(Ye)), le(h.$attrs, {
      id: h.id,
      ref: k(i),
      role: "checkbox",
      "as-child": h.asChild,
      as: h.as,
      type: h.as === "button" ? "button" : void 0,
      "aria-checked": k(ts)(c.value) ? "mixed" : c.value,
      "aria-required": h.required,
      "aria-label": h.$attrs["aria-label"] || f.value,
      "data-state": k(Pf)(c.value),
      "data-disabled": l.value ? "" : void 0,
      disabled: l.value,
      focusable: k(o)?.rovingFocus.value ? !l.value : void 0,
      onKeydown: jd(Qt(() => {
      }, ["prevent"]), ["enter"]),
      onClick: u
    }), {
      default: $(() => [J(h.$slots, "default", {
        modelValue: k(a),
        state: c.value
      }), k(d) && h.name && !k(o) ? (T(), I(k(jb), {
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
      ])) : j("v-if", !0)]),
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
}), Gb = Xb, Yb = /* @__PURE__ */ B({
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
    const { forwardRef: e } = de(), t = Kb();
    return (r, i) => (T(), I(k(Is), { present: r.forceMount || k(ts)(k(t).state.value) || k(t).state.value === !0 }, {
      default: $(() => [q(k(Ye), le({
        ref: k(e),
        "data-state": k(Pf)(k(t).state.value),
        "data-disabled": k(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: $(() => [J(r.$slots, "default")]),
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
}), Zb = Yb;
const [Rf, Qb] = gt("PopperRoot");
var e0 = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = _();
    return Qb({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => J(t.$slots, "default");
  }
}), t0 = e0, n0 = /* @__PURE__ */ B({
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
    const e = n, { forwardRef: t, currentElement: r } = de(), i = Rf();
    return Hd(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (T(), I(k(Ye), {
      ref: k(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: $(() => [J(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), r0 = n0;
function i0(n) {
  return n !== null;
}
function s0(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [c, u] = aa(t), d = {
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
function aa(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const o0 = ["top", "right", "bottom", "left"], en = Math.min, et = Math.max, ns = Math.round, Ei = Math.floor, kt = (n) => ({
  x: n,
  y: n
}), a0 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, l0 = {
  start: "end",
  end: "start"
};
function la(n, e, t) {
  return et(n, en(e, t));
}
function Nt(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function $t(n) {
  return n.split("-")[0];
}
function pr(n) {
  return n.split("-")[1];
}
function sl(n) {
  return n === "x" ? "y" : "x";
}
function ol(n) {
  return n === "y" ? "height" : "width";
}
const c0 = /* @__PURE__ */ new Set(["top", "bottom"]);
function bt(n) {
  return c0.has($t(n)) ? "y" : "x";
}
function al(n) {
  return sl(bt(n));
}
function u0(n, e, t) {
  t === void 0 && (t = !1);
  const r = pr(n), i = al(n), s = ol(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = rs(o)), [o, rs(o)];
}
function d0(n) {
  const e = rs(n);
  return [ca(n), e, ca(e)];
}
function ca(n) {
  return n.replace(/start|end/g, (e) => l0[e]);
}
const Oc = ["left", "right"], Dc = ["right", "left"], f0 = ["top", "bottom"], h0 = ["bottom", "top"];
function p0(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? Dc : Oc : e ? Oc : Dc;
    case "left":
    case "right":
      return e ? f0 : h0;
    default:
      return [];
  }
}
function m0(n, e, t, r) {
  const i = pr(n);
  let s = p0($t(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(ca)))), s;
}
function rs(n) {
  return n.replace(/left|right|bottom|top/g, (e) => a0[e]);
}
function g0(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function If(n) {
  return typeof n != "number" ? g0(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function is(n) {
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
function _c(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = bt(e), o = al(e), a = ol(o), l = $t(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
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
  switch (pr(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function y0(n, e) {
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
  } = Nt(e, n), p = If(h), g = a[f ? d === "floating" ? "reference" : "floating" : d], y = is(await s.getClippingRect({
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
  }, S = is(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: v,
    strategy: l
  }) : b);
  return {
    top: (y.top - S.top + p.top) / w.y,
    bottom: (S.bottom - y.bottom + p.bottom) / w.y,
    left: (y.left - S.left + p.left) / w.x,
    right: (S.right - y.right + p.right) / w.x
  };
}
const v0 = async (n, e, t) => {
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
  } = _c(c, r, l), f = r, h = {}, p = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: y,
      fn: b
    } = a[g], {
      x: v,
      y: w,
      data: S,
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
        detectOverflow: (m = o.detectOverflow) != null ? m : y0
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
        ...S
      }
    }, M && p <= 50 && (p++, typeof M == "object" && (M.placement && (f = M.placement), M.rects && (c = M.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : M.rects), {
      x: u,
      y: d
    } = _c(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, b0 = (n) => ({
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
    } = Nt(n, e) || {};
    if (c == null)
      return {};
    const d = If(u), f = {
      x: t,
      y: r
    }, h = al(i), p = ol(h), m = await o.getDimensions(c), g = h === "y", y = g ? "top" : "left", b = g ? "bottom" : "right", v = g ? "clientHeight" : "clientWidth", w = s.reference[p] + s.reference[h] - f[h] - s.floating[p], S = f[h] - s.reference[h], M = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let x = M ? M[v] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(M))) && (x = a.floating[v] || s.floating[p]);
    const A = w / 2 - S / 2, C = x / 2 - m[p] / 2 - 1, O = en(d[y], C), D = en(d[b], C), R = O, z = x - m[p] - D, N = x / 2 - m[p] / 2 + A, U = la(R, N, z), ne = !l.arrow && pr(i) != null && N !== U && s.reference[p] / 2 - (N < R ? O : D) - m[p] / 2 < 0, Z = ne ? N < R ? N - R : N - z : 0;
    return {
      [h]: f[h] + Z,
      data: {
        [h]: U,
        centerOffset: N - U - Z,
        ...ne && {
          alignmentOffset: Z
        }
      },
      reset: ne
    };
  }
}), k0 = function(n) {
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
      } = Nt(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const y = $t(i), b = bt(a), v = $t(a) === a, w = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), S = f || (v || !m ? [rs(a)] : d0(a)), M = p !== "none";
      !f && M && S.push(...m0(a, m, p, w));
      const x = [a, ...S], A = await l.detectOverflow(e, g), C = [];
      let O = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && C.push(A[y]), d) {
        const N = u0(i, o, w);
        C.push(A[N[0]], A[N[1]]);
      }
      if (O = [...O, {
        placement: i,
        overflows: C
      }], !C.every((N) => N <= 0)) {
        var D, R;
        const N = (((D = s.flip) == null ? void 0 : D.index) || 0) + 1, U = x[N];
        if (U && (!(d === "alignment" ? b !== bt(U) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        O.every((ae) => bt(ae.placement) === b ? ae.overflows[0] > 0 : !0)))
          return {
            data: {
              index: N,
              overflows: O
            },
            reset: {
              placement: U
            }
          };
        let ne = (R = O.filter((Z) => Z.overflows[0] <= 0).sort((Z, ae) => Z.overflows[1] - ae.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!ne)
          switch (h) {
            case "bestFit": {
              var z;
              const Z = (z = O.filter((ae) => {
                if (M) {
                  const ge = bt(ae.placement);
                  return ge === b || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ge === "y";
                }
                return !0;
              }).map((ae) => [ae.placement, ae.overflows.filter((ge) => ge > 0).reduce((ge, ln) => ge + ln, 0)]).sort((ae, ge) => ae[1] - ge[1])[0]) == null ? void 0 : z[0];
              Z && (ne = Z);
              break;
            }
            case "initialPlacement":
              ne = a;
              break;
          }
        if (i !== ne)
          return {
            reset: {
              placement: ne
            }
          };
      }
      return {};
    }
  };
};
function Pc(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Rc(n) {
  return o0.some((e) => n[e] >= 0);
}
const w0 = function(n) {
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
      } = Nt(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = Pc(o, t.reference);
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
          }), a = Pc(o, t.floating);
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
}, Nf = /* @__PURE__ */ new Set(["left", "top"]);
async function x0(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = $t(t), a = pr(t), l = bt(t) === "y", c = Nf.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = Nt(e, n);
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
const S0 = function(n) {
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
      } = e, l = await x0(e, n);
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
}, C0 = function(n) {
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
      } = Nt(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = bt($t(i)), h = sl(f);
      let p = u[h], m = u[f];
      if (o) {
        const y = h === "y" ? "top" : "left", b = h === "y" ? "bottom" : "right", v = p + d[y], w = p - d[b];
        p = la(v, p, w);
      }
      if (a) {
        const y = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", v = m + d[y], w = m - d[b];
        m = la(v, m, w);
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
}, T0 = function(n) {
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
      } = Nt(n, e), u = {
        x: t,
        y: r
      }, d = bt(i), f = sl(d);
      let h = u[f], p = u[d];
      const m = Nt(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const v = f === "y" ? "height" : "width", w = s.reference[f] - s.floating[v] + g.mainAxis, S = s.reference[f] + s.reference[v] - g.mainAxis;
        h < w ? h = w : h > S && (h = S);
      }
      if (c) {
        var y, b;
        const v = f === "y" ? "width" : "height", w = Nf.has($t(i)), S = s.reference[d] - s.floating[v] + (w && ((y = o.offset) == null ? void 0 : y[d]) || 0) + (w ? 0 : g.crossAxis), M = s.reference[d] + s.reference[v] + (w ? 0 : ((b = o.offset) == null ? void 0 : b[d]) || 0) - (w ? g.crossAxis : 0);
        p < S ? p = S : p > M && (p = M);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, E0 = function(n) {
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
      } = Nt(n, e), u = await o.detectOverflow(e, c), d = $t(i), f = pr(i), h = bt(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, y;
      d === "top" || d === "bottom" ? (g = d, y = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (y = d, g = f === "end" ? "top" : "bottom");
      const b = m - u.top - u.bottom, v = p - u.left - u.right, w = en(m - u[g], b), S = en(p - u[y], v), M = !e.middlewareData.shift;
      let x = w, A = S;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (A = v), (r = e.middlewareData.shift) != null && r.enabled.y && (x = b), M && !f) {
        const O = et(u.left, 0), D = et(u.right, 0), R = et(u.top, 0), z = et(u.bottom, 0);
        h ? A = p - 2 * (O !== 0 || D !== 0 ? O + D : et(u.left, u.right)) : x = m - 2 * (R !== 0 || z !== 0 ? R + z : et(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: A,
        availableHeight: x
      });
      const C = await o.getDimensions(a.floating);
      return p !== C.width || m !== C.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Ns() {
  return typeof window < "u";
}
function In(n) {
  return ll(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function nt(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Tt(n) {
  var e;
  return (e = (ll(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function ll(n) {
  return Ns() ? n instanceof Node || n instanceof nt(n).Node : !1;
}
function pt(n) {
  return Ns() ? n instanceof Element || n instanceof nt(n).Element : !1;
}
function xt(n) {
  return Ns() ? n instanceof HTMLElement || n instanceof nt(n).HTMLElement : !1;
}
function Ic(n) {
  return !Ns() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof nt(n).ShadowRoot;
}
const M0 = /* @__PURE__ */ new Set(["inline", "contents"]);
function pi(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = mt(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !M0.has(i);
}
const A0 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function O0(n) {
  return A0.has(In(n));
}
const D0 = [":popover-open", ":modal"];
function $s(n) {
  return D0.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const _0 = ["transform", "translate", "scale", "rotate", "perspective"], P0 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], R0 = ["paint", "layout", "strict", "content"];
function cl(n) {
  const e = ul(), t = pt(n) ? mt(n) : n;
  return _0.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || P0.some((r) => (t.willChange || "").includes(r)) || R0.some((r) => (t.contain || "").includes(r));
}
function I0(n) {
  let e = tn(n);
  for (; xt(e) && !nr(e); ) {
    if (cl(e))
      return e;
    if ($s(e))
      return null;
    e = tn(e);
  }
  return null;
}
function ul() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const N0 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function nr(n) {
  return N0.has(In(n));
}
function mt(n) {
  return nt(n).getComputedStyle(n);
}
function Bs(n) {
  return pt(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function tn(n) {
  if (In(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ic(n) && n.host || // Fallback.
    Tt(n)
  );
  return Ic(e) ? e.host : e;
}
function $f(n) {
  const e = tn(n);
  return nr(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : xt(e) && pi(e) ? e : $f(e);
}
function Ur(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = $f(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = nt(i);
  if (s) {
    const a = ua(o);
    return e.concat(o, o.visualViewport || [], pi(i) ? i : [], a && t ? Ur(a) : []);
  }
  return e.concat(i, Ur(i, [], t));
}
function ua(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Bf(n) {
  const e = mt(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = xt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = ns(t) !== s || ns(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function dl(n) {
  return pt(n) ? n : n.contextElement;
}
function Gn(n) {
  const e = dl(n);
  if (!xt(e))
    return kt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Bf(e);
  let o = (s ? ns(t.width) : t.width) / r, a = (s ? ns(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const $0 = /* @__PURE__ */ kt(0);
function Lf(n) {
  const e = nt(n);
  return !ul() || !e.visualViewport ? $0 : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function B0(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== nt(n) ? !1 : e;
}
function Tn(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = dl(n);
  let o = kt(1);
  e && (r ? pt(r) && (o = Gn(r)) : o = Gn(n));
  const a = B0(s, t, r) ? Lf(s) : kt(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = nt(s), h = r && pt(r) ? nt(r) : r;
    let p = f, m = ua(p);
    for (; m && r && h !== p; ) {
      const g = Gn(m), y = m.getBoundingClientRect(), b = mt(m), v = y.left + (m.clientLeft + parseFloat(b.paddingLeft)) * g.x, w = y.top + (m.clientTop + parseFloat(b.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += v, c += w, p = nt(m), m = ua(p);
    }
  }
  return is({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Ls(n, e) {
  const t = Bs(n).scrollLeft;
  return e ? e.left + t : Tn(Tt(n)).left + t;
}
function zf(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Ls(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function L0(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Tt(r), a = e ? $s(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = kt(1);
  const u = kt(0), d = xt(r);
  if ((d || !d && !s) && ((In(r) !== "body" || pi(o)) && (l = Bs(r)), xt(r))) {
    const h = Tn(r);
    c = Gn(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? zf(o, l) : kt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function z0(n) {
  return Array.from(n.getClientRects());
}
function F0(n) {
  const e = Tt(n), t = Bs(n), r = n.ownerDocument.body, i = et(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = et(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Ls(n);
  const a = -t.scrollTop;
  return mt(r).direction === "rtl" && (o += et(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const Nc = 25;
function V0(n, e) {
  const t = nt(n), r = Tt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = ul();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = Ls(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= Nc && (s -= p);
  } else c <= Nc && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const q0 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function U0(n, e) {
  const t = Tn(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = xt(n) ? Gn(n) : kt(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function $c(n, e, t) {
  let r;
  if (e === "viewport")
    r = V0(n, t);
  else if (e === "document")
    r = F0(Tt(n));
  else if (pt(e))
    r = U0(e, t);
  else {
    const i = Lf(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return is(r);
}
function Ff(n, e) {
  const t = tn(n);
  return t === e || !pt(t) || nr(t) ? !1 : mt(t).position === "fixed" || Ff(t, e);
}
function W0(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Ur(n, [], !1).filter((a) => pt(a) && In(a) !== "body"), i = null;
  const s = mt(n).position === "fixed";
  let o = s ? tn(n) : n;
  for (; pt(o) && !nr(o); ) {
    const a = mt(o), l = cl(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && q0.has(i.position) || pi(o) && !l && Ff(n, o)) ? r = r.filter((u) => u !== o) : i = a, o = tn(o);
  }
  return e.set(n, r), r;
}
function j0(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? $s(e) ? [] : W0(e, this._c) : [].concat(t), r], a = o[0], l = o.reduce((c, u) => {
    const d = $c(e, u, i);
    return c.top = et(d.top, c.top), c.right = en(d.right, c.right), c.bottom = en(d.bottom, c.bottom), c.left = et(d.left, c.left), c;
  }, $c(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function H0(n) {
  const {
    width: e,
    height: t
  } = Bf(n);
  return {
    width: e,
    height: t
  };
}
function K0(n, e, t) {
  const r = xt(e), i = Tt(e), s = t === "fixed", o = Tn(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = kt(0);
  function c() {
    l.x = Ls(i);
  }
  if (r || !r && !s)
    if ((In(e) !== "body" || pi(i)) && (a = Bs(e)), r) {
      const h = Tn(e, !0, s, e);
      l.x = h.x + e.clientLeft, l.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? zf(i, a) : kt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function wo(n) {
  return mt(n).position === "static";
}
function Bc(n, e) {
  if (!xt(n) || mt(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Tt(n) === t && (t = t.ownerDocument.body), t;
}
function Vf(n, e) {
  const t = nt(n);
  if ($s(n))
    return t;
  if (!xt(n)) {
    let i = tn(n);
    for (; i && !nr(i); ) {
      if (pt(i) && !wo(i))
        return i;
      i = tn(i);
    }
    return t;
  }
  let r = Bc(n, e);
  for (; r && O0(r) && wo(r); )
    r = Bc(r, e);
  return r && nr(r) && wo(r) && !cl(r) ? t : r || I0(n) || t;
}
const J0 = async function(n) {
  const e = this.getOffsetParent || Vf, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: K0(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function X0(n) {
  return mt(n).direction === "rtl";
}
const G0 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: L0,
  getDocumentElement: Tt,
  getClippingRect: j0,
  getOffsetParent: Vf,
  getElementRects: J0,
  getClientRects: z0,
  getDimensions: H0,
  getScale: Gn,
  isElement: pt,
  isRTL: X0
};
function qf(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Y0(n, e) {
  let t = null, r;
  const i = Tt(n);
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
    const p = Ei(d), m = Ei(i.clientWidth - (u + f)), g = Ei(i.clientHeight - (d + h)), y = Ei(u), v = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -y + "px",
      threshold: et(0, en(1, l)) || 1
    };
    let w = !0;
    function S(M) {
      const x = M[0].intersectionRatio;
      if (x !== l) {
        if (!w)
          return o();
        x ? o(!1, x) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !qf(c, n.getBoundingClientRect()) && o(), w = !1;
    }
    try {
      t = new IntersectionObserver(S, {
        ...v,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(S, v);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function Z0(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = dl(n), u = i || s ? [...c ? Ur(c) : [], ...Ur(e)] : [];
  u.forEach((y) => {
    i && y.addEventListener("scroll", t, {
      passive: !0
    }), s && y.addEventListener("resize", t);
  });
  const d = c && a ? Y0(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((y) => {
    let [b] = y;
    b && b.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var v;
      (v = h) == null || v.observe(e);
    })), t();
  }), c && !l && h.observe(c), h.observe(e));
  let p, m = l ? Tn(n) : null;
  l && g();
  function g() {
    const y = Tn(n);
    m && !qf(m, y) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    u.forEach((b) => {
      i && b.removeEventListener("scroll", t), s && b.removeEventListener("resize", t);
    }), d?.(), (y = h) == null || y.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const Q0 = S0, ek = C0, Lc = k0, tk = E0, nk = w0, rk = b0, ik = T0, sk = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: G0,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return v0(n, e, {
    ...i,
    platform: s
  });
};
function ok(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function da(n) {
  if (ok(n)) {
    const e = n.$el;
    return ll(e) && In(e) === "#comment" ? null : e;
  }
  return n;
}
function Hn(n) {
  return typeof n == "function" ? n() : k(n);
}
function ak(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = da(Hn(n.element));
      return t == null ? {} : rk({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Uf(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function zc(n, e) {
  const t = Uf(n);
  return Math.round(e * t) / t;
}
function lk(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = E(() => {
    var x;
    return (x = Hn(t.open)) != null ? x : !0;
  }), s = E(() => Hn(t.middleware)), o = E(() => {
    var x;
    return (x = Hn(t.placement)) != null ? x : "bottom";
  }), a = E(() => {
    var x;
    return (x = Hn(t.strategy)) != null ? x : "absolute";
  }), l = E(() => {
    var x;
    return (x = Hn(t.transform)) != null ? x : !0;
  }), c = E(() => da(n.value)), u = E(() => da(e.value)), d = _(0), f = _(0), h = _(a.value), p = _(o.value), m = Rt({}), g = _(!1), y = E(() => {
    const x = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return x;
    const A = zc(u.value, d.value), C = zc(u.value, f.value);
    return l.value ? {
      ...x,
      transform: "translate(" + A + "px, " + C + "px)",
      ...Uf(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: A + "px",
      top: C + "px"
    };
  });
  let b;
  function v() {
    if (c.value == null || u.value == null)
      return;
    const x = i.value;
    sk(c.value, u.value, {
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
  function S() {
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
  return Y([s, o, a, i], v, {
    flush: "sync"
  }), Y([c, u], S, {
    flush: "sync"
  }), Y(i, M, {
    flush: "sync"
  }), Vd() && qd(w), {
    x: zn(d),
    y: zn(f),
    strategy: zn(h),
    placement: zn(p),
    middlewareData: zn(m),
    isPositioned: zn(g),
    floatingStyles: y,
    update: v
  };
}
const Wf = {
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
}, [XP, ck] = gt("PopperContent");
var uk = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Kd({
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
  }, { ...Wf }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Rf(), { forwardRef: s, currentElement: o } = de(), a = _(), l = _(), { width: c, height: u } = Iv(l), d = E(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = E(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = E(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = E(() => ({
      padding: f.value,
      boundary: h.value.filter(i0),
      altBoundary: h.value.length > 0
    })), m = E(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = uv(() => [
      Q0({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Lc({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && ek({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? ik() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Lc({
        ...p.value,
        ...m.value
      }),
      tk({
        ...p.value,
        apply: ({ elements: R, rects: z, availableWidth: N, availableHeight: U }) => {
          const { width: ne, height: Z } = z.reference, ae = R.floating.style;
          ae.setProperty("--reka-popper-available-width", `${N}px`), ae.setProperty("--reka-popper-available-height", `${U}px`), ae.setProperty("--reka-popper-anchor-width", `${ne}px`), ae.setProperty("--reka-popper-anchor-height", `${Z}px`);
        }
      }),
      l.value && ak({
        element: l.value,
        padding: t.arrowPadding
      }),
      s0({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && nk({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), y = E(() => t.reference ?? i.anchor.value), { floatingStyles: b, placement: v, isPositioned: w, middlewareData: S } = lk(y, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => Z0(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), M = E(() => aa(v.value)[0]), x = E(() => aa(v.value)[1]);
    Hd(() => {
      w.value && r("placed");
    });
    const A = E(() => {
      const R = S.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), C = _("");
    rt(() => {
      o.value && (C.value = window.getComputedStyle(o.value).zIndex);
    });
    const O = E(() => S.value.arrow?.x ?? 0), D = E(() => S.value.arrow?.y ?? 0);
    return ck({
      placedSide: M,
      onArrowChange: (R) => l.value = R,
      arrowX: O,
      arrowY: D,
      shouldHideArrow: A
    }), (R, z) => (T(), L("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Pn({
        ...k(b),
        transform: k(w) ? k(b).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: C.value,
        "--reka-popper-transform-origin": [k(S).transformOrigin?.x, k(S).transformOrigin?.y].join(" "),
        ...k(S).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(k(Ye), le({ ref: k(s) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": M.value,
      "data-align": x.value,
      style: { animation: k(w) ? void 0 : "none" }
    }), {
      default: $(() => [J(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), dk = uk, fk = /* @__PURE__ */ B({
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
    return (t, r) => (T(), I(k(r0), Cn(di(e)), {
      default: $(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), hk = fk;
function pk() {
  const n = _(!1);
  return _e(() => {
    ta("keydown", () => {
      n.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), ta(["pointerdown", "pointermove"], () => {
      n.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), n;
}
const mk = /* @__PURE__ */ bf(pk), [zs, gk] = gt(["MenuRoot", "MenuSub"], "MenuContext"), [fl, yk] = gt("MenuRoot");
var vk = /* @__PURE__ */ B({
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
    const t = n, r = e, { modal: i, dir: s } = hr(t), o = rl(s), a = /* @__PURE__ */ fi(t, "open", r), l = _(), c = mk();
    return gk({
      open: a,
      onOpenChange: (u) => {
        a.value = u;
      },
      content: l,
      onContentChange: (u) => {
        l.value = u;
      }
    }), yk({
      onClose: () => {
        a.value = !1;
      },
      isUsingKeyboardRef: c,
      dir: o,
      modal: i
    }), (u, d) => (T(), I(k(t0), null, {
      default: $(() => [J(u.$slots, "default")]),
      _: 3
    }));
  }
}), bk = vk;
const [jf, kk] = gt("MenuContent");
var wk = /* @__PURE__ */ B({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ Kd({
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
  }, { ...Wf }),
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
    const t = n, r = e, i = zs(), s = fl(), { trapFocus: o, disableOutsidePointerEvents: a, loop: l } = hr(t);
    Ev(), kf(a.value);
    const c = _(""), u = _(0), d = _(0), f = _(null), h = _("right"), p = _(0), m = _(null), g = _(), { forwardRef: y, currentElement: b } = de(), { handleTypeaheadSearch: v } = $v();
    Y(b, (C) => {
      i.onContentChange(C);
    }), fr(() => {
      window.clearTimeout(u.value);
    });
    function w(C) {
      return h.value === f.value?.side && cb(C, f.value?.area);
    }
    async function S(C) {
      r("openAutoFocus", C), !C.defaultPrevented && (C.preventDefault(), b.value?.focus({ preventScroll: !0 }));
    }
    function M(C) {
      if (C.defaultPrevented) return;
      const D = C.target.closest("[data-reka-menu-content]") === C.currentTarget, R = C.ctrlKey || C.altKey || C.metaKey, z = C.key.length === 1, N = cv(C, Je(), b.value, {
        loop: l.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (N) return N?.focus();
      if (C.code === "Space") return;
      const U = g.value?.getItems() ?? [];
      if (D && (C.key === "Tab" && C.preventDefault(), !R && z && v(C.key, U)), C.target !== b.value || !ob.includes(C.key)) return;
      C.preventDefault();
      const ne = [...U.map((Z) => Z.ref)];
      Mf.includes(C.key) && ne.reverse(), ab(ne);
    }
    function x(C) {
      C?.currentTarget?.contains?.(C.target) || (window.clearTimeout(u.value), c.value = "");
    }
    function A(C) {
      if (!oa(C)) return;
      const O = C.target, D = p.value !== C.clientX;
      if (C?.currentTarget?.contains(O) && D) {
        const R = C.clientX > p.value ? "right" : "left";
        h.value = R, p.value = C.clientX;
      }
    }
    return kk({
      onItemEnter: (C) => !!w(C),
      onItemLeave: (C) => {
        w(C) || (b.value?.focus(), m.value = null);
      },
      onTriggerLeave: (C) => !!w(C),
      searchRef: c,
      pointerGraceTimerRef: d,
      onPointerGraceIntentChange: (C) => {
        f.value = C;
      }
    }), (C, O) => (T(), I(k(Ef), {
      "as-child": "",
      trapped: k(o),
      onMountAutoFocus: S,
      onUnmountAutoFocus: O[7] || (O[7] = (D) => r("closeAutoFocus", D))
    }, {
      default: $(() => [q(k(Cf), {
        "as-child": "",
        "disable-outside-pointer-events": k(a),
        onEscapeKeyDown: O[2] || (O[2] = (D) => r("escapeKeyDown", D)),
        onPointerDownOutside: O[3] || (O[3] = (D) => r("pointerDownOutside", D)),
        onFocusOutside: O[4] || (O[4] = (D) => r("focusOutside", D)),
        onInteractOutside: O[5] || (O[5] = (D) => r("interactOutside", D)),
        onDismiss: O[6] || (O[6] = (D) => r("dismiss"))
      }, {
        default: $(() => [q(k(Lb), {
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
          default: $(() => [q(k(dk), {
            ref: k(y),
            role: "menu",
            as: C.as,
            "as-child": C.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": k(Af)(k(i).open.value),
            dir: k(s).dir.value,
            side: C.side,
            "side-offset": C.sideOffset,
            align: C.align,
            "align-offset": C.alignOffset,
            "avoid-collisions": C.avoidCollisions,
            "collision-boundary": C.collisionBoundary,
            "collision-padding": C.collisionPadding,
            "arrow-padding": C.arrowPadding,
            "prioritize-position": C.prioritizePosition,
            "position-strategy": C.positionStrategy,
            "update-position-strategy": C.updatePositionStrategy,
            sticky: C.sticky,
            "hide-when-detached": C.hideWhenDetached,
            reference: C.reference,
            onKeydown: M,
            onBlur: x,
            onPointermove: A
          }, {
            default: $(() => [J(C.$slots, "default")]),
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
}), Hf = wk, xk = /* @__PURE__ */ B({
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
    const e = n, t = jf(), { forwardRef: r } = de(), { CollectionItem: i } = il(), s = _(!1);
    async function o(l) {
      l.defaultPrevented || oa(l) && (e.disabled ? t.onItemLeave(l) : t.onItemEnter(l) || l.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function a(l) {
      await ke(), !l.defaultPrevented && oa(l) && t.onItemLeave(l);
    }
    return (l, c) => (T(), I(k(i), { value: { textValue: l.textValue } }, {
      default: $(() => [q(k(Ye), le({
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
          await ke(), !(u.defaultPrevented || l.disabled) && (s.value = !0);
        }),
        onBlur: c[1] || (c[1] = async (u) => {
          await ke(), !u.defaultPrevented && (s.value = !1);
        })
      }), {
        default: $(() => [J(l.$slots, "default")]),
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
}), Sk = xk, Ck = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = de(), o = fl(), a = jf(), l = _(!1);
    async function c() {
      const u = s.value;
      if (!t.disabled && u) {
        const d = new CustomEvent(ib, {
          bubbles: !0,
          cancelable: !0
        });
        r("select", d), await ke(), d.defaultPrevented ? l.value = !1 : o.onClose();
      }
    }
    return (u, d) => (T(), I(Sk, le(t, {
      ref: k(i),
      onClick: c,
      onPointerdown: d[0] || (d[0] = () => {
        l.value = !0;
      }),
      onPointerup: d[1] || (d[1] = async (f) => {
        await ke(), !f.defaultPrevented && (l.value || f.currentTarget?.click());
      }),
      onKeydown: d[2] || (d[2] = async (f) => {
        const h = k(a).searchRef.value !== "";
        u.disabled || h && f.key === " " || k(sa).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: $(() => [J(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Tk = Ck, Ek = /* @__PURE__ */ B({
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
    const t = n, r = e, i = Rs(t, r), s = zs(), { forwardRef: o, currentElement: a } = de();
    return xf(a), (l, c) => (T(), I(Hf, le(k(i), {
      ref: k(o),
      "trap-focus": k(s).open.value,
      "disable-outside-pointer-events": k(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: c[0] || (c[0] = (u) => k(s).onOpenChange(!1)),
      onFocusOutside: c[1] || (c[1] = Qt((u) => r("focusOutside", u), ["prevent"]))
    }), {
      default: $(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), Mk = Ek, Ak = /* @__PURE__ */ B({
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
    const i = Rs(n, e), s = zs();
    return (o, a) => (T(), I(Hf, le(k(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: a[0] || (a[0] = (l) => k(s).onOpenChange(!1))
    }), {
      default: $(() => [J(o.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ok = Ak, Dk = /* @__PURE__ */ B({
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
    const i = Rs(n, e), s = zs(), o = fl();
    return (a, l) => (T(), I(k(Is), { present: a.forceMount || k(s).open.value }, {
      default: $(() => [k(o).modal.value ? (T(), I(Mk, Cn(le({ key: 0 }, {
        ...a.$attrs,
        ...k(i)
      })), {
        default: $(() => [J(a.$slots, "default")]),
        _: 3
      }, 16)) : (T(), I(Ok, Cn(le({ key: 1 }, {
        ...a.$attrs,
        ...k(i)
      })), {
        default: $(() => [J(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), _k = Dk, Pk = /* @__PURE__ */ B({
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
    return (t, r) => (T(), I(k(Df), Cn(di(e)), {
      default: $(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Rk = Pk;
const [Kf, Ik] = gt("DropdownMenuRoot");
var Nk = /* @__PURE__ */ B({
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
    de();
    const i = /* @__PURE__ */ fi(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = _(), { modal: o, dir: a } = hr(t), l = rl(a);
    return Ik({
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
    }), (c, u) => (T(), I(k(bk), {
      open: k(i),
      "onUpdate:open": u[0] || (u[0] = (d) => _g(i) ? i.value = d : null),
      dir: k(l),
      modal: k(o)
    }, {
      default: $(() => [J(c.$slots, "default", { open: k(i) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), $k = Nk, Bk = /* @__PURE__ */ B({
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
    const i = Rs(n, e);
    de();
    const s = Kf(), o = _(!1);
    function a(l) {
      l.defaultPrevented || (o.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), o.value = !1, l.preventDefault());
    }
    return s.contentId ||= qr(void 0, "reka-dropdown-menu-content"), (l, c) => (T(), I(k(_k), le(k(i), {
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
      default: $(() => [J(l.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), Lk = Bk, zk = /* @__PURE__ */ B({
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
    const t = n, i = hi(e);
    return de(), (s, o) => (T(), I(k(Tk), Cn(di({
      ...t,
      ...k(i)
    })), {
      default: $(() => [J(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Fk = zk, Vk = /* @__PURE__ */ B({
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
    return (t, r) => (T(), I(k(Rk), Cn(di(e)), {
      default: $(() => [J(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), qk = Vk, Uk = /* @__PURE__ */ B({
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
    const e = n, t = Kf(), { forwardRef: r, currentElement: i } = de();
    return _e(() => {
      t.triggerElement = i;
    }), t.triggerId ||= qr(void 0, "reka-dropdown-menu-trigger"), (s, o) => (T(), I(k(hk), { "as-child": "" }, {
      default: $(() => [q(k(Ye), {
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
          !s.disabled && a.button === 0 && a.ctrlKey === !1 && (k(t)?.onOpenToggle(), await ke(), k(t).open.value && a.preventDefault());
        }),
        onKeydown: o[1] || (o[1] = jd((a) => {
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
        default: $(() => [J(s.$slots, "default")]),
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
}), Wk = Uk;
const jk = /* @__PURE__ */ B({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (T(), I(k(Gb), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = Qt(() => {
      }, ["stop"]))
    }, {
      default: $(() => [
        q(k(Zb), { class: "checkbox-indicator" }, {
          default: $(() => [
            q(k(nf), {
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
}), Hk = /* @__PURE__ */ te(jk, [["__scopeId", "data-v-024ee78b"]]), Jf = /* @__PURE__ */ Symbol("turnSelection");
function Fc(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function Kk(n, e, t) {
  const r = _s(/* @__PURE__ */ new Map());
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
    const S = Math.min(v, w), M = Math.max(v, w);
    for (let x = S; x <= M; x++) {
      const A = b[x];
      A != null && r.set(A, !0);
    }
  }
  function u() {
    r.clear(), i = null;
  }
  async function d() {
    const b = n.value.filter((v) => r.has(v.id)).map(Fc).join(`

`);
    await navigator.clipboard.writeText(b);
  }
  async function f() {
    const b = n.value.filter((v) => r.has(v.id)).map((v) => {
      const S = (v.speakerId ? e.get(v.speakerId) : void 0)?.name ?? "", M = v.startTime != null ? Qi(v.startTime) : "", x = [S, M].filter(Boolean).join(" (") + (M ? ")" : ""), A = Fc(v);
      return x ? `${x}
${A}` : A;
    });
    await navigator.clipboard.writeText(b.join(`

`));
  }
  Y(
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
  _e(() => {
    document.addEventListener("keydown", m);
  }), Lt(() => {
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
  return Sn(Jf, g), g;
}
function Xf() {
  const n = ui(Jf);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const Jk = ["data-turn-active", "aria-selected"], Xk = { class: "turn-text" }, Gk = ["data-word-active"], Yk = /* @__PURE__ */ B({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = qe(), r = Xf(), { t: i } = he(), s = E(() => e.turn.words.length > 0), o = E(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const h = t.audio.currentTime.value, { startTime: p, endTime: m, words: g } = e.turn;
      return p == null || m == null || h < p || h > m ? null : Qd(g, h);
    }), a = E(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Za(e.turn.words)) return !1;
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
    return (h, p) => (T(), L("section", {
      class: ct(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": c.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: Pn({ "--speaker-color": l.value }),
      "aria-selected": k(r).hasSelection.value ? c.value : void 0
    }, [
      n.partial ? j("", !0) : (T(), L("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        k(r).hasSelection.value ? (T(), I(Hk, {
          key: 0,
          "model-value": c.value,
          "aria-label": u.value,
          onClick: Qt(f, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : j("", !0),
        q(Qo, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          "start-date": n.turn.startDate,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      V("p", Xk, [
        s.value ? (T(!0), L(De, { key: 0 }, ht(n.turn.words, (m, g) => (T(), L(De, {
          key: m.id
        }, [
          V("span", {
            class: ct({ "word--active": m.id === o.value }),
            "data-word-active": m.id === o.value || void 0
          }, K(m.text), 11, Gk),
          be(K(g < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (T(), L(De, { key: 1 }, [
          be(K(n.turn.text), 1)
        ], 64)) : j("", !0)
      ])
    ], 14, Jk));
  }
}), Vc = /* @__PURE__ */ te(Yk, [["__scopeId", "data-v-7ea6a240"]]), Zk = {}, Qk = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function ew(n, e) {
  return T(), L("svg", Qk, [...e[0] || (e[0] = [
    Pg('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const tw = /* @__PURE__ */ te(Zk, [["render", ew]]), nw = { class: "transcription-empty" }, rw = { class: "message" }, iw = /* @__PURE__ */ B({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = he();
    return (t, r) => (T(), L("div", nw, [
      q(tw, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      V("p", rw, K(k(e)("transcription.empty")), 1)
    ]));
  }
}), sw = /* @__PURE__ */ te(iw, [["__scopeId", "data-v-f82737e5"]]), ow = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function aw(n) {
  const e = qe(), t = _(!0), r = window.matchMedia(
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
  Y(
    () => e.audio?.activeWordId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), Y(
    () => e.audio?.activeTurnId.value,
    (u) => {
      u && i();
    },
    { flush: "post" }
  ), Y(
    () => e.audio?.isPlaying.value,
    (u) => {
      u && (t.value = !0);
    }
  );
  function s() {
    t.value = !1;
  }
  function o(u) {
    ow.has(u.key) && s();
  }
  function a(u) {
    const d = n.value;
    d && (d.addEventListener("wheel", u, { passive: !0 }), d.addEventListener("touchstart", u, { passive: !0 }), d.addEventListener("pointerdown", u, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function l(u) {
    const d = n.value;
    d && (d.removeEventListener("wheel", u), d.removeEventListener("touchstart", u), d.removeEventListener("pointerdown", u), d.removeEventListener("keydown", o));
  }
  _e(() => {
    a(s);
  }), Lt(() => {
    l(s);
  });
  function c() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: c };
}
function Ce(n) {
  this.content = n;
}
Ce.prototype = {
  constructor: Ce,
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
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new Ce(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new Ce(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new Ce([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new Ce(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new Ce(i);
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
    return n = Ce.from(n), n.size ? new Ce(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = Ce.from(n), n.size ? new Ce(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = Ce.from(n);
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
Ce.from = function(n) {
  if (n instanceof Ce) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new Ce(e);
};
function Gf(n, e, t) {
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
      let o = Gf(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function Yf(n, e, t, r) {
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
      let c = Yf(o.content, a.content, t - 1, r - 1);
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
    return Gf(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Yf(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return Mi(0, e);
    if (e == this.size)
      return Mi(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? Mi(t + 1, s) : Mi(t, r);
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
const xo = { index: 0, offset: 0 };
function Mi(n, e) {
  return xo.index = n, xo.offset = e, xo;
}
function ss(n, e) {
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
      if (!ss(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !ss(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let se = class fa {
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
    return this == e || this.type == e.type && ss(this.attrs, e.attrs);
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
      return fa.none;
    if (e instanceof fa)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
se.none = [];
class as extends Error {
}
class F {
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
    let r = Qf(this.content, e + this.openStart, t);
    return r && new F(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new F(Zf(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return F.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new F(P.fromJSON(e, t.content), r, i);
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
    return new F(e, r, i);
  }
}
F.empty = new F(P.empty, 0, 0);
function Zf(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: a } = n.findIndex(t);
  if (i == e || s.isText) {
    if (a != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Zf(s.content, e - i - 1, t - i - 1)));
}
function Qf(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = Qf(o.content, e - s - 1, t, o);
  return a && n.replaceChild(i, o.copy(a));
}
function lw(n, e, t) {
  if (t.openStart > n.depth)
    throw new as("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new as("Inconsistent open depths");
  return eh(n, e, t, 0);
}
function eh(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = eh(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, a = o.content;
      return vn(o, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: o, end: a } = cw(t, n);
      return vn(s, nh(n, o, a, e, r));
    }
  else return vn(s, ls(n, e, r));
}
function th(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new as("Cannot join " + e.type.name + " onto " + n.type.name);
}
function ha(n, e, t) {
  let r = n.node(t);
  return th(r, e.node(t)), r;
}
function yn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Or(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (yn(n.nodeAfter, r), s++));
  for (let a = s; a < o; a++)
    yn(i.child(a), r);
  e && e.depth == t && e.textOffset && yn(e.nodeBefore, r);
}
function vn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function nh(n, e, t, r, i) {
  let s = n.depth > i && ha(n, e, i + 1), o = r.depth > i && ha(t, r, i + 1), a = [];
  return Or(null, n, i, a), s && o && e.index(i) == t.index(i) ? (th(s, o), yn(vn(s, nh(n, e, t, r, i + 1)), a)) : (s && yn(vn(s, ls(n, e, i + 1)), a), Or(e, t, i, a), o && yn(vn(o, ls(t, r, i + 1)), a)), Or(r, null, i, a), new P(a);
}
function ls(n, e, t) {
  let r = [];
  if (Or(null, n, t, r), n.depth > t) {
    let i = ha(n, e, t + 1);
    yn(vn(i, ls(n, e, t + 1)), r);
  }
  return Or(e, null, t, r), new P(r);
}
function cw(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(P.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Wr {
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
      return se.none;
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
        return new cs(this, e, r);
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
    return new Wr(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = qc.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      qc.set(e, r = new uw());
    let i = r.elts[r.i] = Wr.resolve(e, t);
    return r.i = (r.i + 1) % dw, i;
  }
}
class uw {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const dw = 12, qc = /* @__PURE__ */ new WeakMap();
class cs {
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
const fw = /* @__PURE__ */ Object.create(null);
let Ot = class pa {
  /**
  @internal
  */
  constructor(e, t, r, i = se.none) {
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
    return this.type == e && ss(this.attrs, t || e.defaultAttrs || fw) && se.sameSet(this.marks, r || se.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new pa(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new pa(this.type, this.attrs, this.content, e);
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
      return F.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), a = i.start(o), c = i.node(o).content.cut(i.pos - a, s.pos - a);
    return new F(c, i.depth - o, s.depth - o);
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
    return lw(this.resolve(e), this.resolve(t), r);
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
    return Wr.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Wr.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), rh(this.marks, e);
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
    let e = se.none;
    for (let t = 0; t < this.marks.length; t++) {
      let r = this.marks[t];
      r.type.checkAttrs(r.attrs), e = r.addToSet(e);
    }
    if (!se.sameSet(e, this.marks))
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
Ot.prototype.text = void 0;
class us extends Ot {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : rh(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new us(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new us(this.type, this.attrs, e, this.marks);
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
function rh(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class En {
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
    let r = new hw(e, t);
    if (r.next == null)
      return En.empty;
    let i = ih(r);
    r.next && r.err("Unexpected trailing text");
    let s = kw(bw(i));
    return ww(s, r), s;
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
En.empty = new En(!0);
class hw {
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
function ih(n) {
  let e = [];
  do
    e.push(pw(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function pw(n) {
  let e = [];
  do
    e.push(mw(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function mw(n) {
  let e = vw(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = gw(n, e);
    else
      break;
  return e;
}
function Uc(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function gw(n, e) {
  let t = Uc(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Uc(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function yw(n, e) {
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
function vw(n) {
  if (n.eat("(")) {
    let e = ih(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = yw(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function bw(n) {
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
function sh(n, e) {
  return e - n;
}
function Wc(n, e) {
  let t = [];
  return r(e), t.sort(sh);
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
function kw(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Wc(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        Wc(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new En(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let a = i[o][1].sort(sh);
      s.next.push({ type: i[o][0], next: e[a.join(",")] || t(a) });
    }
    return s;
  }
}
function ww(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      o.push(l.name), s && !(l.isText || l.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function oh(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function ah(n, e) {
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
function lh(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function ch(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new Sw(n, r, e[r]);
  return t;
}
let jc = class uh {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = ch(e, r.attrs), this.defaultAttrs = oh(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == En.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : ah(this.attrs, e);
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
    return new Ot(this, this.computeAttrs(e), P.from(t), se.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = P.from(t), this.checkContent(t), new Ot(this, this.computeAttrs(e), t, se.setFrom(r));
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
    return s ? new Ot(this, e, t.append(s), se.setFrom(r)) : null;
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
    lh(this.attrs, e, "node", this.name);
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
    return t ? t.length ? t : se.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new uh(s, t, o));
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
function xw(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class Sw {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? xw(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Fs {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = ch(e, i.attrs), this.excluded = null;
    let s = oh(this.attrs);
    this.instance = s ? new se(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new se(this, ah(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Fs(s, i++, t, o)), r;
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
    lh(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let dh = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = Ce.from(e.nodes), t.marks = Ce.from(e.marks || {}), this.nodes = jc.compile(this.spec.nodes, this), this.marks = Fs.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", a = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = En.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = a == "_" ? null : a ? Hc(this, a.split(" ")) : a == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : Hc(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => Ot.fromJSON(this, i), this.markFromJSON = (i) => se.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof jc) {
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
    return new us(r, r.defaultAttrs, e, se.setFrom(t));
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
function Hc(n, e) {
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
function Cw(n) {
  return n.tag != null;
}
function Tw(n) {
  return n.style != null;
}
let Dr = class ma {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (Cw(i))
        this.tags.push(i);
      else if (Tw(i)) {
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
    let r = new Jc(this, t, !1);
    return r.addAll(e, se.none, t.from, t.to), r.finish();
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
    let r = new Jc(this, t, !0);
    return r.addAll(e, se.none, t.from, t.to), F.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (Aw(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(o = Xc(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = Xc(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new ma(e, ma.schemaRules(e)));
  }
};
const fh = {
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
}, Ew = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, hh = { ol: !0, ul: !0 }, jr = 1, ga = 2, _r = 4;
function Kc(n, e, t) {
  return e != null ? (e ? jr : 0) | (e === "full" ? ga : 0) : n && n.whitespace == "pre" ? jr | ga : t & ~_r;
}
class Ai {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = se.none, this.match = s || (o & _r ? null : e.contentMatch);
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
    if (!(this.options & jr)) {
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
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !fh.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Jc {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = Kc(null, t.preserveWhitespace, 0) | (r ? _r : 0);
    i ? s = new Ai(i.type, i.attrs, se.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new Ai(null, null, se.none, !0, null, o) : s = new Ai(e.schema.topNodeType, null, se.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & ga ? "full" : this.localPreserveWS || (i.options & jr) > 0, { schema: o } = this.parser;
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
    hh.hasOwnProperty(o) && this.parser.normalizeLists && Mw(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : Ew.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, u = this.needsBlock;
      if (fh.hasOwnProperty(o))
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
      let o = se.none;
      for (let a of i.concat(e.marks))
        (s.type ? s.type.allowsMarkType(a.type) : Gc(a.type, e.type)) && (o = a.addToSet(o));
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
    let a = Kc(e, s, o.options);
    o.options & _r && o.content.length == 0 && (a |= _r);
    let l = se.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : Gc(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new Ai(e, t, l, i, null, a)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= jr);
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
function Mw(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && hh.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Aw(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Xc(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Gc(n, e) {
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
class Nn {
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
    let { dom: r, contentDOM: i } = Vi(So(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && Vi(So(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Vi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Nn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Yc(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Yc(e.marks);
  }
}
function Yc(n) {
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
const Zc = /* @__PURE__ */ new WeakMap();
function Ow(n) {
  let e = Zc.get(n);
  return e === void 0 && Zc.set(n, e = Dw(n)), e;
}
function Dw(n) {
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
function Vi(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = Ow(r)) && s.indexOf(e) > -1)
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
      let { dom: h, contentDOM: p } = Vi(n, f, t, r);
      if (l.appendChild(h), p) {
        if (a)
          throw new RangeError("Multiple content holes");
        a = p;
      }
    }
  }
  return { dom: l, contentDOM: a };
}
const ph = 65535, mh = Math.pow(2, 16);
function _w(n, e) {
  return n + e * mh;
}
function Qc(n) {
  return n & ph;
}
function Pw(n) {
  return (n - (n & ph)) / mh;
}
const gh = 1, yh = 2, qi = 4, vh = 8;
class ya {
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
    return (this.delInfo & vh) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (gh | qi)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (yh | qi)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & qi) > 0;
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
    let t = 0, r = Qc(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Pw(e);
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
        let p = e == (t < 0 ? l : d) ? null : _w(a / 3, e - l), m = e == l ? yh : e == d ? gh : qi;
        return (t < 0 ? e != l : e != d) && (m |= vh), new ya(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new ya(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = Qc(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
class ds {
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
    return new ds(this._maps, this.mirror, e, t);
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
    let e = new ds();
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
    return r ? e : new ya(e, i, null);
  }
}
const Co = /* @__PURE__ */ Object.create(null);
class Be {
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
    let r = Co[t.stepType];
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
    if (e in Co)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Co[e] = t, t.prototype.jsonID = e, t;
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
      if (s instanceof as)
        return pe.fail(s.message);
      throw s;
    }
  }
}
function hl(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(hl(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return P.fromArray(r);
}
class Ht extends Be {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new F(hl(t.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new ft(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ht(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ht && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ht(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Ht(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Be.jsonID("addMark", Ht);
class ft extends Be {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new F(hl(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Ht(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ft(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ft && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ft(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new ft(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Be.jsonID("removeMark", ft);
class Kt extends Be {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new F(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new Kt(this.pos, t.marks[i]);
        return new Kt(this.pos, this.mark);
      }
    }
    return new Mn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Kt(t.pos, this.mark);
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
    return new Kt(t.pos, e.markFromJSON(t.mark));
  }
}
Be.jsonID("addNodeMark", Kt);
class Mn extends Be {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new F(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Kt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Mn(t.pos, this.mark);
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
    return new Mn(t.pos, e.markFromJSON(t.mark));
  }
}
Be.jsonID("removeNodeMark", Mn);
class ye extends Be {
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
    return this.structure && va(e, this.from, this.to) ? pe.fail("Structure replace would overwrite content") : pe.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new tt([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new ye(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new ye(t.pos, Math.max(t.pos, r.pos), this.slice, this.structure);
  }
  merge(e) {
    if (!(e instanceof ye) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? F.empty : new F(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new ye(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? F.empty : new F(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new ye(e.from, this.to, t, this.structure);
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
    return new ye(t.from, t.to, F.fromJSON(e, t.slice), !!t.structure);
  }
}
Be.jsonID("replace", ye);
class we extends Be {
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
    if (this.structure && (va(e, this.from, this.gapFrom) || va(e, this.gapTo, this.to)))
      return pe.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return pe.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? pe.fromReplace(e, this.from, this.to, r) : pe.fail("Content does not fit in gap");
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
    return new we(t.from, t.to, t.gapFrom, t.gapTo, F.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Be.jsonID("replaceAround", we);
function va(n, e, t) {
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
function Rw(n, e, t, r) {
  let i = [], s = [], o, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + l.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new ft(f, h, d[m])));
      a && a.to == f ? a.to = h : s.push(a = new Ht(f, h, r));
    }
  }), i.forEach((l) => n.step(l)), s.forEach((l) => n.step(l));
}
function Iw(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof Fs) {
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
  }), i.forEach((o) => n.step(new ft(o.from, o.to, o.style)));
}
function pl(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], a = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let c = s.child(l), u = a + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new ye(a, u, F.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new ft(a, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new F(P.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new ye(a + f.index, a + f.index + f[0].length, p));
      }
    }
    a = u;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(P.empty, !0);
    n.replace(a, a, new F(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    n.step(o[l]);
}
function Nw(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function mr(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), a = n.$from.index(r) + i, l = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(a, l, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Nw(o, a, l))
      break;
    a && (i = 1), l < o.childCount && (s = 1);
  }
  return null;
}
function $w(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, u = P.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = P.from(r.node(p).copy(u)), d++) : l--;
  let f = P.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = P.from(i.node(p).copy(f)), h++) : c++;
  n.step(new we(l, c, o, a, new F(u.append(f), d, h), u.size - d, !0));
}
function bh(n, e, t = null, r = n) {
  let i = Bw(n, e), s = i && Lw(r, e);
  return s ? i.map(eu).concat({ type: e, attrs: t }).concat(s.map(eu)) : null;
}
function eu(n) {
  return { type: n, attrs: null };
}
function Bw(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function Lw(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function zw(n, e, t) {
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
  n.step(new we(i, s, i, s, new F(r, 0, 0), t.length, !0));
}
function Fw(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, a) => {
    let l = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, l) && Vw(n.doc, n.mapping.slice(s).map(a), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && wh(n, o, a, s), pl(n, n.mapping.slice(s).map(a, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(a, 1), f = u.map(a + o.nodeSize, 1);
      return n.step(new we(d, f, d + 1, f - 1, new F(P.from(r.create(l, null, o.marks)), 0, 0), 1, !0)), c === !0 && kh(n, o, a, s), !1;
    }
  });
}
function kh(n, e, t, r) {
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
function wh(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Vw(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function qw(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new we(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new F(P.from(o), 0, 0), 1, !0));
}
function Dt(n, e, t = 1, r) {
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
function Uw(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = P.empty, o = P.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    s = P.from(i.node(a).copy(s));
    let u = r && r[c];
    o = P.from(u ? u.type.create(u.attrs, o) : i.node(a).copy(o));
  }
  n.step(new ye(e, e, new F(s.append(o), t, t), !0));
}
function $n(n, e) {
  let t = n.resolve(e), r = t.index();
  return xh(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Ww(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function xh(n, e) {
  return !!(n && e && !n.isLeaf && Ww(n, e));
}
function Vs(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && xh(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function jw(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let a = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    wh(n, u.node(), u.before(), a);
  }
  o.inlineContent && pl(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let l = n.mapping.slice(a), c = l.map(e - t);
  if (n.step(new ye(c, l.map(e + t, -1), F.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    kh(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function Hw(n, e, t) {
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
function Kw(n, e, t) {
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
function qs(n, e, t = e, r = F.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Sh(i, s, r) ? new ye(e, t, r) : new Jw(i, s, r).fit();
}
function Sh(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Jw {
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
    let l = new F(s, o, a);
    return e > -1 ? new we(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new ye(r.pos, i.pos, l) : null;
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
        r ? (s = To(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
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
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = To(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new F(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = To(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new F(Sr(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new F(Sr(e, t, 1), t, r);
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
      c++, (c > 1 || l == 0 || m.content.size) && (d = g, u.push(Ch(m.mark(f.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? h : -1)));
    }
    let p = c == a.childCount;
    p || (h = -1), this.placed = Cr(this.placed, t, P.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = a; m < h; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? F.empty : new F(Sr(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new F(Sr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Eo(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Eo(e, t, i, r, s);
      if (o) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], u = Eo(e, a, c, l, !0);
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
    i.match = i.match.matchType(e), this.placed = Cr(this.placed, this.depth, P.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(P.empty, !0);
    t.childCount && (this.placed = Cr(this.placed, this.frontier.length, t));
  }
}
function Sr(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Sr(n.firstChild.content, e - 1, t)));
}
function Cr(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Cr(n.lastChild.content, e - 1, t)));
}
function To(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Ch(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Ch(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(P.empty, !0)))), n.copy(r);
}
function Eo(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !Xw(t, s.content, o) ? a : null;
}
function Xw(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Gw(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Yw(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Sh(i, s, r))
    return n.step(new ye(e, t, r));
  let o = Eh(i, s);
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
    let h = c[f], p = Gw(h.type);
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
          return n.replace(i.before(g), y ? s.after(g) : t, new F(Th(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function Th(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(Th(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(P.empty, !0));
  }
  return n;
}
function Zw(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Hw(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new F(P.from(r), 0, 0));
}
function Qw(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Eh(r, i);
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
function Eh(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class Yn extends Be {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new F(P.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return tt.empty;
  }
  invert(e) {
    return new Yn(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Yn(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Yn(t.pos, t.attr, t.value);
  }
}
Be.jsonID("attr", Yn);
class Hr extends Be {
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
    return tt.empty;
  }
  invert(e) {
    return new Hr(this.attr, e.attrs[this.attr]);
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
    return new Hr(t.attr, t.value);
  }
}
Be.jsonID("docAttr", Hr);
let rr = class extends Error {
};
rr = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
rr.prototype = Object.create(Error.prototype);
rr.prototype.constructor = rr;
rr.prototype.name = "TransformError";
class Mh {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new ds();
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
      throw new rr(t.failed);
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
  replace(e, t = e, r = F.empty) {
    let i = qs(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new F(P.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, F.empty);
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
    return Yw(this, e, t, r), this;
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
    return Zw(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Qw(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return $w(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return jw(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return zw(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Fw(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return qw(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Yn(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Hr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Kt(e, t)), this;
  }
  /**
  Remove a mark (or all marks of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    let r = this.doc.nodeAt(e);
    if (!r)
      throw new RangeError("No node at position " + e);
    if (t instanceof se)
      t.isInSet(r.marks) && this.step(new Mn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new Mn(e, s)), i = s.removeFromSet(i);
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
    return Uw(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Rw(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return Iw(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return pl(this, e, t, r), this;
  }
}
const Mo = /* @__PURE__ */ Object.create(null);
class Q {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new ex(e.min(t), e.max(t))];
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
  replace(e, t = F.empty) {
    let r = t.content.lastChild, i = null;
    for (let a = 0; a < t.openEnd; a++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let a = 0; a < o.length; a++) {
      let { $from: l, $to: c } = o[a], u = e.mapping.slice(s);
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? F.empty : t), a == 0 && ru(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), ru(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new G(e) : Kn(e.node(0), e.parent, e.pos, e.index(), t, r);
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
    let r = Mo[t.type];
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
    if (e in Mo)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Mo[e] = t, t.prototype.jsonID = e, t;
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
Q.prototype.visible = !0;
class ex {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let tu = !1;
function nu(n) {
  !tu && !n.parent.inlineContent && (tu = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class G extends Q {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    nu(e), nu(t), super(e, t);
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
    return new G(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = F.empty) {
    if (super.replace(e, t), t == F.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof G && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Us(this.anchor, this.head);
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
      let s = Q.findFrom(t, r, !0) || Q.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return Q.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (Q.findFrom(e, -r, !0) || Q.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new G(e, t);
  }
}
Q.jsonID("text", G);
class Us {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Us(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return G.between(e.resolve(this.anchor), e.resolve(this.head));
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
    return new F(P.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof X && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new ml(this.anchor);
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
class ml {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Us(r, r) : new ml(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && X.isSelectable(r) ? new X(t) : Q.near(t);
  }
}
class Xe extends Q {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = F.empty) {
    if (t == F.empty) {
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
    return new Xe(e);
  }
  map(e) {
    return new Xe(e);
  }
  eq(e) {
    return e instanceof Xe;
  }
  getBookmark() {
    return tx;
  }
}
Q.jsonID("all", Xe);
const tx = {
  map() {
    return this;
  },
  resolve(n) {
    return new Xe(n);
  }
};
function Kn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return G.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && X.isSelectable(a))
        return X.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = Kn(n, a, t + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function ru(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof ye || i instanceof we))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((a, l, c, u) => {
    o == null && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
const iu = 1, Oi = 2, su = 4;
class nx extends Mh {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | iu) & ~Oi, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & iu) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= Oi, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return se.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & Oi) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~Oi, this.storedMarks = null;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || se.none))), r.replaceWith(this, e), this;
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
    return this.updated |= su, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & su) > 0;
  }
}
function ou(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Tr {
  constructor(e, t, r) {
    this.name = e, this.init = ou(t.init, r), this.apply = ou(t.apply, r);
  }
}
const rx = [
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
      return n.selection || Q.atStart(e.doc);
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
class Ao {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = rx.slice(), t && t.forEach((r) => {
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
    return new nx(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new Ao(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Xn(t);
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
    let t = new Ao(this.schema, e.plugins), r = t.fields, i = new Xn(t);
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
    let i = new Ao(e.schema, e.plugins), s = new Xn(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = Ot.fromJSON(e.schema, t.doc);
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
function Ah(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Ah(i, e, {})), t[r] = i;
  }
  return t;
}
class Pe {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Ah(e.props, this, this.props), this.key = e.key ? e.key.key : Oh("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const Oo = /* @__PURE__ */ Object.create(null);
function Oh(n) {
  return n in Oo ? n + "$" + ++Oo[n] : (Oo[n] = 0, n + "$");
}
class Ze {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Oh(e);
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
const gl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Dh(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const _h = (n, e, t) => {
  let r = Dh(n, t);
  if (!r)
    return !1;
  let i = yl(r);
  if (!i) {
    let o = r.blockRange(), a = o && mr(o);
    return a == null ? !1 : (e && e(n.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (Vh(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (ir(s, "end") || X.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let a = qs(n.doc, r.before(o), r.after(o), F.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = n.tr.step(a);
          l.setSelection(ir(s, "end") ? Q.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : X.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, ix = (n, e, t) => {
  let r = Dh(n, t);
  if (!r)
    return !1;
  let i = yl(r);
  return i ? Ph(n, i, e) : !1;
}, sx = (n, e, t) => {
  let r = Ih(n, t);
  if (!r)
    return !1;
  let i = vl(r);
  return i ? Ph(n, i, e) : !1;
};
function Ph(n, e, t) {
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
  let c = qs(n.doc, s, l, F.empty);
  if (!c || c.from != s || c instanceof ye && c.slice.size >= l - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(G.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function ir(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Rh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = yl(r);
  }
  let o = s && s.nodeBefore;
  return !o || !X.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(X.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function yl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Ih(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Nh = (n, e, t) => {
  let r = Ih(n, t);
  if (!r)
    return !1;
  let i = vl(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Vh(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (ir(s, "start") || X.isSelectable(s))) {
    let o = qs(n.doc, r.before(), r.after(), F.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = n.tr.step(o);
        a.setSelection(ir(s, "start") ? Q.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : X.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, $h = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = vl(r);
  }
  let o = s && s.nodeAfter;
  return !o || !X.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(X.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function vl(n) {
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
const ox = (n, e) => {
  let t = n.selection, r = t instanceof X, i;
  if (r) {
    if (t.node.isTextblock || !$n(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Vs(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(X.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, ax = (n, e) => {
  let t = n.selection, r;
  if (t instanceof X) {
    if (t.node.isTextblock || !$n(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Vs(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, lx = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && mr(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, Bh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function bl(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const cx = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = bl(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(Q.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Lh = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Xe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = bl(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(o, s.createAndFill());
    a.setSelection(G.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, zh = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Dt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && mr(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function Fh(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof X && e.selection.node.isBlock)
      return !r.parentOffset || !Dt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, a, l = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        l = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), a = bl(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1)));
        let m = n && n(i.parent, l, r);
        s.unshift(m || (l && a ? { type: a } : null)), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof G || e.selection instanceof Xe) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Dt(u.doc, d, s.length, s);
    if (f || (s[0] = a ? { type: a } : null, f = Dt(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !l && c && r.node(o).type != a) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      a && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, a) && u.setNodeMarkup(u.mapping.map(r.before(o)), a);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const ux = Fh(), dx = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(X.create(n.doc, i))), !0);
};
function fx(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || $n(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function Vh(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, a, l = i.type.spec.isolating || s.type.spec.isolating;
  if (!l && fx(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (a = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && a.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = P.empty;
      for (let y = o.length - 1; y >= 0; y--)
        p = P.from(o[y].create(null, p));
      p = P.from(i.copy(p));
      let m = n.tr.step(new we(e.pos - 1, h, e.pos, h, new F(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && $n(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && l ? null : Q.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && mr(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && ir(s, "start", !0) && ir(i, "end")) {
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
        let b = n.tr.step(new we(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new F(y, p.length, 0), 0, !0));
        t(b.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function qh(n) {
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
const hx = qh(-1), px = qh(1);
function mx(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), a = o && bh(o, n, e);
    return a ? (r && r(t.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function au(n, e = null) {
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
function kl(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
kl(gl, _h, Rh);
kl(gl, Nh, $h);
kl(Bh, Lh, zh, ux);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function gx(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let a = r ? t.tr : null;
    return yx(a, o, n, e) ? (r && r(a.scrollIntoView()), !0) : !1;
  };
}
function yx(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = o.resolve(e.start - 2);
    s = new cs(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new cs(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = bh(s, t, r, e);
  return a ? (n && vx(n, e, a, i, t), !0) : !1;
}
function vx(n, e, t, r, i) {
  let s = P.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = P.from(t[u].type.create(t[u].attrs, s));
  n.step(new we(e.start - (r ? 2 : 0), e.end, e.start, e.end, new F(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let a = t.length - o, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Dt(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function bx(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? kx(e, t, n, s) : wx(e, t, s) : !0 : !1;
  };
}
function kx(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new we(s - 1, o, s, o, new F(P.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new cs(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = mr(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return $n(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function wx(n, e, t) {
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
  return r.step(new we(d - (a ? 1 : 0), f + (l ? 1 : 0), d + 1, f - 1, new F((a ? P.empty : P.from(i.copy(P.empty))).append(l ? P.empty : P.from(i.copy(P.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function xx(n) {
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
      let c = l.lastChild && l.lastChild.type == a.type, u = P.from(c ? n.create() : null), d = new F(P.from(n.create(null, P.from(a.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new we(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Me = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, sr = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let ba = null;
const Mt = function(n, e, t) {
  let r = ba || (ba = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, Sx = function() {
  ba = null;
}, An = function(n, e, t, r) {
  return t && (lu(n, e, t, r, -1) || lu(n, e, t, r, 1));
}, Cx = /^(img|br|input|textarea|hr)$/i;
function lu(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : ot(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || mi(n) || Cx.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Me(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? ot(n) : 0;
    } else
      return !1;
  }
}
function ot(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Tx(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = ot(n);
    } else if (n.parentNode && !mi(n))
      e = Me(n), n = n.parentNode;
    else
      return null;
  }
}
function Ex(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !mi(n))
      e = Me(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function Mx(n, e, t) {
  for (let r = e == 0, i = e == ot(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Me(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == ot(n);
  }
}
function mi(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Ws = function(n) {
  return n.focusNode && An(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function un(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function Ax(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Ox(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(ot(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(ot(r.startContainer), r.startOffset) };
  }
}
const St = typeof navigator < "u" ? navigator : null, cu = typeof document < "u" ? document : null, an = St && St.userAgent || "", ka = /Edge\/(\d+)/.exec(an), Uh = /MSIE \d/.exec(an), wa = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(an), Ge = !!(Uh || wa || ka), Xt = Uh ? document.documentMode : wa ? +wa[1] : ka ? +ka[1] : 0, at = !Ge && /gecko\/(\d+)/i.test(an);
at && +(/Firefox\/(\d+)/.exec(an) || [0, 0])[1];
const xa = !Ge && /Chrome\/(\d+)/.exec(an), Oe = !!xa, Wh = xa ? +xa[1] : 0, $e = !Ge && !!St && /Apple Computer/.test(St.vendor), or = $e && (/Mobile\/\w+/.test(an) || !!St && St.maxTouchPoints > 2), st = or || (St ? /Mac/.test(St.platform) : !1), jh = St ? /Win/.test(St.platform) : !1, At = /Android \d/.test(an), gi = !!cu && "webkitFontSmoothing" in cu.documentElement.style, Dx = gi ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function _x(n) {
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
function Et(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Px(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function uu(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = sr(o);
      continue;
    }
    let a = o, l = a == s.body, c = l ? _x(s) : Px(a), u = 0, d = 0;
    if (e.top < c.top + Et(r, "top") ? d = -(c.top - e.top + Et(i, "top")) : e.bottom > c.bottom - Et(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + Et(i, "top") - c.top : e.bottom - c.bottom + Et(i, "bottom")), e.left < c.left + Et(r, "left") ? u = -(c.left - e.left + Et(i, "left")) : e.right > c.right - Et(r, "right") && (u = e.right - c.right + Et(i, "right")), u || d)
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
    o = f == "absolute" ? o.offsetParent : sr(o);
  }
}
function Rx(n) {
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
  return { refDOM: r, refTop: i, stack: Hh(n.dom) };
}
function Hh(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = sr(r))
    ;
  return e;
}
function Ix({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Kh(t, r == 0 ? 0 : r - e);
}
function Kh(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let Vn = null;
function Nx(n) {
  if (n.setActive)
    return n.setActive();
  if (Vn)
    return n.focus(Vn);
  let e = Hh(n);
  n.focus(Vn == null ? {
    get preventScroll() {
      return Vn = { preventScroll: !0 }, !0;
    }
  } : void 0), Vn || (Vn = !1, Kh(e, 0));
}
function Jh(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, a = e.top, l, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = Mt(u).getClientRects();
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
  return !t && l && (t = l, i = c, r = 0), t && t.nodeType == 3 ? $x(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Jh(t, i);
}
function $x(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = qt(r, 1);
    if (o.top != o.bottom && wl(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function wl(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Bx(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Lx(n, e, t) {
  let { node: r, offset: i } = Jh(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function zx(n, e, t, r) {
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
function Xh(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let a = o.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (wl(e, c))
            return Xh(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function Fx(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = Ox(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), a;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!wl(e, c) || (o = Xh(n.dom, e, c), !o))
      return null;
  }
  if ($e)
    for (let c = o; r && c; c = sr(c))
      c.draggable && (r = void 0);
  if (o = Bx(o, e), r) {
    if (at && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    gi && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? a = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (a = zx(n, r, i, e));
  }
  a == null && (a = Lx(n, o, e));
  let l = n.docView.nearestDesc(o, !0);
  return { pos: a, inside: l ? l.posAtStart - l.border : -1 };
}
function du(n) {
  return n.top < n.bottom || n.left < n.right;
}
function qt(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (du(r))
      return r;
  }
  return Array.prototype.find.call(t, du) || n.getBoundingClientRect();
}
const Vx = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Gh(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = gi || at;
  if (r.nodeType == 3)
    if (o && (Vx.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = qt(Mt(r, i, i), t);
      if (at && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = qt(Mt(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = qt(Mt(r, i, i + 1), -1);
          if (u.top != l.top)
            return kr(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, kr(qt(Mt(r, l, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == ot(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return Do(l.getBoundingClientRect(), !1);
    }
    if (s == null && i < ot(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return Do(l.getBoundingClientRect(), !0);
    }
    return Do(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == ot(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? Mt(l, ot(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return kr(qt(c, 1), !1);
  }
  if (s == null && i < ot(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? Mt(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return kr(qt(c, -1), !0);
  }
  return kr(qt(r.nodeType == 3 ? Mt(r) : r, -t), t >= 0);
}
function kr(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Do(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function Yh(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function qx(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return Yh(n, e, () => {
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
    let o = Gh(n, i.pos, 1);
    for (let a = s.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = Mt(a, 0, a.nodeValue.length).getClientRects();
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
const Ux = /[\u0590-\u08ac]/;
function Wx(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, a = n.domSelection();
  return a ? !Ux.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? s : o : Yh(n, e, () => {
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
let fu = null, hu = null, pu = !1;
function jx(n, e, t) {
  return fu == e && hu == t ? pu : (fu = e, hu = t, pu = t == "up" || t == "down" ? qx(n, e, t) : Wx(n, e, t));
}
const lt = 0, mu = 1, hn = 2, Ct = 3;
class yi {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = lt, r.pmViewDesc = this;
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
      i = t > Me(this.contentDOM);
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
      if (a > e || o instanceof Qh) {
        i = e - s;
        break;
      }
      s = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof Zh && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Me(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Me(s.dom) : this.contentDOM.childNodes.length };
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
            i = Me(f.dom) + 1;
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
            s = Me(d.dom);
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
    if ((at || $e) && e == t) {
      let { node: h, offset: p } = a;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (a = l = { node: g.parentNode, offset: Me(g) + 1 });
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
    if (at && u.focusNode && u.focusNode != l.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && $e) && An(a.node, a.offset, u.anchorNode, u.anchorOffset) && An(l.node, l.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && at)) {
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
          this.dirty = e == r || t == o ? hn : mu, e == a && t == l && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = Ct : s.markDirty(e - a, t - a);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? hn : Ct;
      }
      r = o;
    }
    this.dirty = hn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? hn : mu;
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
class Zh extends yi {
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
    return this.dirty == lt && e.type.eq(this.widget.type);
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
class Hx extends yi {
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
class On extends yi {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Nn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new On(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & Ct || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != Ct && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != lt) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = lt;
    }
  }
  slice(e, t, r) {
    let i = On.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = Ca(s, t, o, r)), e > 0 && (s = Ca(s, 0, e, r));
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
class Gt extends yi {
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
    } else u || ({ dom: u, contentDOM: d } = Nn.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = np(u, r, t), c ? l = new Kx(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new js(e, t, r, i, u, f, s) : new Gt(e, t, r, i, u, d || null, f, s, o + 1);
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
    return this.dirty == lt && e.eq(this.node) && fs(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, a = s && s.pos < 0, l = new Xx(this, o && o.node, e);
    Zx(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? se.none : this.node.child(u).marks, r, e, u), l.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      l.syncToMarks(c.marks, r, e, f);
      let h;
      l.findNodeMatch(c, u, d, f) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = l.findIndexWithChild(s.node)) > -1 && l.updateNodeAt(c, u, d, h, e) || l.updateNextNode(c, u, d, e, f, i) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == hn) && (o && this.protectLocalComposition(e, o), ep(this.contentDOM, this.children, e), or && Qx(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof G) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, a = e1(this.node.content, o, r - t, i - t);
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
    let o = new Hx(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = Ca(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == Ct || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = lt;
  }
  updateOuterDeco(e) {
    if (fs(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = tp(this.dom, this.nodeDOM, Sa(this.outerDeco, this.node, t), Sa(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function gu(n, e, t, r, i) {
  np(r, e, n);
  let s = new Gt(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class js extends Gt {
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
    return this.dirty == Ct || this.dirty != lt && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != lt || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = lt, !0);
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
    return new js(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ct);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class Qh extends yi {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == lt && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Kx extends Gt {
  constructor(e, t, r, i, s, o, a, l, c, u) {
    super(e, t, r, i, s, o, a, c, u), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == Ct)
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
function ep(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], a = o.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = yu(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (o instanceof On) {
      let l = r ? r.previousSibling : n.lastChild;
      ep(o.contentDOM, o.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = yu(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Pr = function(n) {
  n && (this.nodeName = n);
};
Pr.prototype = /* @__PURE__ */ Object.create(null);
const pn = [new Pr()];
function Sa(n, e, t) {
  if (n.length == 0)
    return pn;
  let r = t ? pn[0] : new Pr(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Pr(o.nodeName));
      for (let a in o) {
        let l = o[a];
        l != null && (t && i.length == 1 && i.push(r = new Pr(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function tp(n, e, t, r) {
  if (t == pn && r == pn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], a = t[s];
    if (s) {
      let l;
      a && a.nodeName == o.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = pn[0]), i = l;
    }
    Jx(i, a || pn[0], o);
  }
  return i;
}
function Jx(n, e, t) {
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
function np(n, e, t) {
  return tp(n, n, pn, Sa(e, t, n.nodeType != 1));
}
function fs(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function yu(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Xx {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Gx(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = lt, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
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
        let u = On.create(this.top, e[o], t, r);
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
    return o.dirty == Ct && o.dom == o.contentDOM && (o.dirty = hn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (l instanceof Gt) {
        let c = this.preMatch.matched.get(l);
        if (c != null && c != s)
          return !1;
        let u = l.dom, d, f = this.isLocked(u) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != Ct && fs(t, l.outerDeco));
        if (!f && l.update(e, t, r, i))
          return this.destroyBetween(this.index, a), l.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(l, e, t, r, i, o)))
          return this.destroyBetween(this.index, a), this.top.children[this.index] = d, d.contentDOM && (d.dirty = hn, d.updateChildren(i, o + 1), d.dirty = lt), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !fs(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let a = Gt.create(this.top, t, r, i, s, o);
    if (a.contentDOM) {
      a.children = e.children, e.children = [];
      for (let l of a.children)
        l.parent = a;
    }
    return e.destroy(), a;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = Gt.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new Zh(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof On; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof js) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && (($e || Oe) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new Qh(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Gx(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let a;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof On)
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
function Yx(n, e) {
  return n.type.side - e.type.side;
}
function Zx(n, e, t, r) {
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
        d.sort(Yx);
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
function Qx(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function e1(n, e, t, r) {
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
function Ca(n, e, t, r, i) {
  let s = [];
  for (let o = 0, a = 0; o < n.length; o++) {
    let l = n[o], c = a, u = a += l.size;
    c >= t || u <= e ? s.push(l) : (c < e && s.push(l.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(l.slice(t - c, l.size, r)));
  }
  return s;
}
function xl(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let a = r.resolve(o), l, c;
  if (Ws(t)) {
    for (l = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && X.isSelectable(d) && i.parent && !(d.isInline && Mx(t.focusNode, t.focusOffset, i.dom))) {
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
    c = Sl(n, u, a, d);
  }
  return c;
}
function rp(n) {
  return n.editable ? n.hasFocus() : sp(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function _t(n, e = !1) {
  let t = n.state.selection;
  if (ip(n, t), !!rp(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Oe) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && An(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      n1(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      vu && !(t instanceof G) && (t.$from.parent.inlineContent || (s = bu(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = bu(n, t.to))), n.docView.setSelection(r, i, n, e), vu && (s && ku(s), o && ku(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && t1(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const vu = $e || Oe && Wh < 63;
function bu(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if ($e && i && i.contentEditable == "false")
    return _o(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return _o(i);
    if (s)
      return _o(s);
  }
}
function _o(n) {
  return n.contentEditable = "true", $e && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function ku(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function t1(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!rp(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function n1(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Me(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && Ge && Xt <= 11 && (t.disabled = !0, t.disabled = !1);
}
function ip(n, e) {
  if (e instanceof X) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (wu(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    wu(n);
}
function wu(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Sl(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || G.between(e, t, r);
}
function xu(n) {
  return n.editable && !n.hasFocus() ? !1 : sp(n);
}
function sp(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function r1(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return An(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ta(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && Q.findFrom(s, e);
}
function Ut(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Su(n, e, t) {
  let r = n.state.selection;
  if (r instanceof G)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Ut(n, new G(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = Ta(n.state, e);
        return i && i instanceof X ? Ut(n, i) : !1;
      } else if (!(st && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let a = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(a)) && !o.contentDOM ? X.isSelectable(s) ? Ut(n, new X(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : gi ? Ut(n, new G(n.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof X && r.node.isInline)
      return Ut(n, new G(e > 0 ? r.$to : r.$from));
    {
      let i = Ta(n.state, e);
      return i ? Ut(n, i) : !1;
    }
  }
}
function hs(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Rr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function qn(n, e) {
  return e < 0 ? i1(n) : s1(n);
}
function i1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (at && t.nodeType == 1 && r < hs(t) && Rr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (Rr(a, -1))
          i = t, s = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (op(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && Rr(a, -1); )
          i = t.parentNode, s = Me(a), a = a.previousSibling;
        if (a)
          t = a, r = hs(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Ea(n, t, r) : i && Ea(n, i, s);
}
function s1(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = hs(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (Rr(a, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (op(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && Rr(a, 1); )
          s = a.parentNode, o = Me(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = hs(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && Ea(n, s, o);
}
function op(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function o1(n, e) {
  for (; n && e == n.childNodes.length && !mi(n); )
    e = Me(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function a1(n, e) {
  for (; n && !e && !mi(n); )
    e = Me(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Ea(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = o1(e, t)) ? (e = o, t = 0) : (s = a1(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Ws(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && _t(n);
  }, 50);
}
function Cu(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Oe || jh) && t.parent.inlineContent) {
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
function Tu(n, e, t) {
  let r = n.state.selection;
  if (r instanceof G && !r.empty || t.indexOf("s") > -1 || st && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Ta(n.state, e);
    if (o && o instanceof X)
      return Ut(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof Xe ? Q.near(o, e) : Q.findFrom(o, e);
    return a ? Ut(n, a) : !1;
  }
  return !1;
}
function Eu(n, e) {
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
function Mu(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function l1(n) {
  if (!$e || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Mu(n, r, "true"), setTimeout(() => Mu(n, r, "false"), 20);
  }
  return !1;
}
function c1(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function u1(n, e) {
  let t = e.keyCode, r = c1(e);
  if (t == 8 || st && t == 72 && r == "c")
    return Eu(n, -1) || qn(n, -1);
  if (t == 46 && !e.shiftKey || st && t == 68 && r == "c")
    return Eu(n, 1) || qn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || st && t == 66 && r == "c") {
    let i = t == 37 ? Cu(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Su(n, i, r) || qn(n, i);
  } else if (t == 39 || st && t == 70 && r == "c") {
    let i = t == 39 ? Cu(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Su(n, i, r) || qn(n, i);
  } else {
    if (t == 38 || st && t == 80 && r == "c")
      return Tu(n, -1, r) || qn(n, -1);
    if (t == 40 || st && t == 78 && r == "c")
      return l1(n) || Tu(n, 1, r) || qn(n, 1);
    if (r == (st ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Cl(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || Nn.fromSchema(n.state.schema), a = fp(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = dp[c.nodeName.toLowerCase()]); ) {
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
function ap(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!t && !e)
    return null;
  let l = !!e && (r || s || !t);
  if (l) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return a = new F(P.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        a = f(a, n, !0);
      }), a;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      a = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = Nn.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = p1(t), gi && m1(o);
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
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || Dr.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !d1.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = g1(Au(a, +u[1], +u[2]), u[4]);
  else if (a = F.maxOpen(f1(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, f = 0;
    for (let h = a.content.firstChild; d < a.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = a.content.lastChild; f < a.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    a = Au(a, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n, l);
  }), a;
}
const d1 = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function f1(n, e) {
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
      if (c = o.length && s.length && cp(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = up(o[o.length - 1], s.length));
        let u = lp(a, l);
        o.push(u), i = i.matchType(u.type), s = l;
      }
    }), o)
      return P.from(o);
  }
  return n;
}
function lp(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, P.from(n));
  return n;
}
function cp(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = cp(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(P.from(lp(t, n, i + 1))));
  }
}
function up(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, up(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(P.empty, !0);
  return n.copy(t.append(r));
}
function Ma(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, a = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (a = Ma(a, e, t, r, i + 1, s)), i >= t && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(P.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(a));
}
function Au(n, e, t) {
  return e < n.openStart && (n = new F(Ma(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new F(Ma(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const dp = {
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
let Ou = null;
function fp() {
  return Ou || (Ou = document.implementation.createHTMLDocument("title"));
}
let Po = null;
function h1(n) {
  let e = window.trustedTypes;
  return e ? (Po || (Po = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), Po.createHTML(n)) : n;
}
function p1(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = fp().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && dp[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = h1(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function m1(n) {
  let e = n.querySelectorAll(Oe ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function g1(n, e) {
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
  return new F(i, s, o);
}
const Fe = {}, Ve = {}, y1 = { touchstart: !0, touchmove: !0 };
class v1 {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function b1(n) {
  for (let e in Fe) {
    let t = Fe[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      w1(n, r) && !Tl(n, r) && (n.editable || !(r.type in Ve)) && t(n, r);
    }, y1[e] ? { passive: !0 } : void 0);
  }
  $e && n.dom.addEventListener("input", () => null), Aa(n);
}
function Jt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function k1(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Aa(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Tl(n, r));
  });
}
function Tl(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function w1(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function x1(n, e) {
  !Tl(n, e) && Fe[e.type] && (n.editable || !(e.type in Ve)) && Fe[e.type](n, e);
}
Ve.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !pp(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(At && Oe && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), or && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, un(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || u1(n, t) ? t.preventDefault() : Jt(n, "key");
};
Ve.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Ve.keypress = (n, e) => {
  let t = e;
  if (pp(n, t) || !t.charCode || t.ctrlKey && !t.altKey || st && t.metaKey)
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
function Hs(n) {
  return { left: n.clientX, top: n.clientY };
}
function S1(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function El(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (a) => o > s.depth ? a(n, t, s.nodeAfter, s.before(o), i, !0) : a(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Zn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function C1(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && X.isSelectable(r) ? (Zn(n, new X(t)), !0) : !1;
}
function T1(n, e) {
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
  return i != null ? (Zn(n, X.create(n.state.doc, i)), !0) : !1;
}
function E1(n, e, t, r, i) {
  return El(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? T1(n, t) : C1(n, t));
}
function M1(n, e, t, r) {
  return El(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function A1(n, e, t, r) {
  return El(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || O1(n, t, r);
}
function O1(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Zn(n, G.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      Zn(n, G.create(r, a + 1, a + 1 + o.content.size));
    else if (X.isSelectable(o))
      Zn(n, X.create(r, a));
    else
      continue;
    return !0;
  }
}
function Ml(n) {
  return ps(n);
}
const hp = st ? "metaKey" : "ctrlKey";
Fe.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Ml(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && S1(t, n.input.lastClick) && !t[hp] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Hs(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new D1(n, o, t, !!r)) : (s == "doubleClick" ? M1 : A1)(n, o.pos, o.inside, t) ? t.preventDefault() : Jt(n, "pointer"));
};
class D1 {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[hp], this.allowDefault = r.shiftKey;
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
      setUneditable: !!(this.target && at && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Jt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => _t(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Hs(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Jt(this.view, "pointer") : E1(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    $e && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Oe && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Zn(this.view, Q.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Jt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Jt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Fe.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Ml(n), Jt(n, "pointer");
};
Fe.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Jt(n, "pointer");
};
Fe.contextmenu = (n) => Ml(n);
function pp(n, e) {
  return n.composing ? !0 : $e && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const _1 = At ? 5e3 : -1;
Ve.compositionstart = Ve.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof G && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Oe && jh && P1(n)))
      n.markCursor = n.state.storedMarks || t.marks(), ps(n, !0), n.markCursor = null;
    else if (ps(n, !e.selection.empty), at && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  mp(n, _1);
};
function P1(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Ve.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, mp(n, 20));
};
function mp(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => ps(n), e));
}
function gp(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = I1()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function R1(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = Tx(e.focusNode, e.focusOffset), r = Ex(e.focusNode, e.focusOffset);
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
function I1() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function ps(n, e = !1) {
  if (!(At && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), gp(n), e || n.docView && n.docView.dirty) {
      let t = xl(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function N1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Kr = Ge && Xt < 15 || or && Dx < 604;
Fe.copy = Ve.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Kr ? null : t.clipboardData, o = r.content(), { dom: a, text: l } = Cl(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : N1(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function $1(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function B1(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Jr(n, r.value, null, i, e) : Jr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function Jr(n, e, t, r, i) {
  let s = ap(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, s || F.empty)))
    return !0;
  if (!s)
    return !1;
  let o = $1(s), a = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function yp(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Ve.paste = (n, e) => {
  let t = e;
  if (n.composing && !At)
    return;
  let r = Kr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Jr(n, yp(r), r.getData("text/html"), i, t) ? t.preventDefault() : B1(n, t);
};
class vp {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const L1 = st ? "altKey" : "ctrlKey";
function bp(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[L1];
}
Fe.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Hs(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof X ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = X.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = X.create(n.state.doc, d.posBefore));
    }
  }
  let a = (o || n.state.selection).content(), { dom: l, text: c, slice: u } = Cl(n, a);
  (!t.dataTransfer.files.length || !Oe || Wh > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Kr ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Kr || t.dataTransfer.setData("text/plain", c), n.dragging = new vp(u, bp(n, t), o);
};
Fe.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Ve.dragover = Ve.dragenter = (n, e) => e.preventDefault();
Ve.drop = (n, e) => {
  try {
    z1(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function z1(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Hs(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = ap(n, yp(e.dataTransfer), Kr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && bp(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || F.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let a = s ? Kw(n.state.doc, i.pos, s) : i.pos;
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
    l.mapping.maps[l.mapping.maps.length - 1].forEach((p, m, g, y) => h = y), l.setSelection(Sl(n, f, l.doc.resolve(h)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
Fe.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && _t(n);
  }, 20));
};
Fe.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
Fe.beforeinput = (n, e) => {
  if (Oe && At && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, un(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Ve)
  Fe[n] = Ve[n];
function Xr(n, e) {
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
class ms {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || bn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new je(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof ms && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Xr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Yt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || bn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new je(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Yt && Xr(this.attrs, e.attrs) && Xr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Yt;
  }
  destroy() {
  }
}
class Al {
  constructor(e, t) {
    this.attrs = e, this.spec = t || bn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new je(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Al && Xr(this.attrs, e.attrs) && Xr(this.spec, e.spec);
  }
  destroy() {
  }
}
class je {
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
    return new je(e, t, this.type);
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
    return new je(e, e, new ms(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new je(e, t, new Yt(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new je(e, t, new Al(r, i));
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
    return this.type instanceof Yt;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof ms;
  }
}
const Jn = [], bn = {};
class oe {
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
    return t.length ? gs(t, e, 0, bn) : Re;
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
    return this == Re || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || bn);
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
    return this.children.length ? F1(this.children, o || [], e, t, r, i, s) : o ? new oe(o.sort(kn), Jn) : Re;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Re ? oe.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (u = wp(t, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, u, c + 1) : i.splice(s, 0, l, l + a.nodeSize, gs(u, a, c + 1, bn)), s += 3;
      }
    });
    let o = kp(s ? xp(t) : t, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new oe(o.length ? this.local.concat(o).sort(kn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Re ? this : this.removeInner(e, 0);
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
      c != Re ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new oe(i, r) : Re;
  }
  forChild(e, t) {
    if (this == Re)
      return this;
    if (t.isLeaf)
      return oe.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < o && l.to > s && l.type instanceof Yt) {
        let c = Math.max(s, l.from) - s, u = Math.min(o, l.to) - s;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new oe(i.sort(kn), Jn);
      return r ? new jt([a, r]) : a;
    }
    return r || Re;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof oe) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return Ol(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Re)
      return Jn;
    if (e.inlineContent || !this.local.some(Yt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Yt || t.push(this.local[r]);
    return t;
  }
  forEachSet(e) {
    e(this);
  }
}
oe.empty = new oe([], []);
oe.removeOverlap = Ol;
const Re = oe.empty;
class jt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, bn));
    return jt.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return oe.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Re && (s instanceof jt ? r = r.concat(s.members) : r.push(s));
    }
    return jt.from(r);
  }
  eq(e) {
    if (!(e instanceof jt) || e.members.length != this.members.length)
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
    return t ? Ol(r ? t : t.sort(kn)) : Jn;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Re;
      case 1:
        return e[0];
      default:
        return new jt(e.every((t) => t instanceof oe) ? e : e.reduce((t, r) => t.concat(r instanceof oe ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function F1(n, e, t, r, i, s, o) {
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
        y != Re ? (a[c] = d, a[c + 1] = h, a[c + 2] = y) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = V1(a, n, e, t, i, s, o), u = gs(c, r, 0, o);
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
  return new oe(e.sort(kn), a);
}
function kp(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new je(i.from + e, i.to + e, i.type));
  }
  return t;
}
function V1(n, e, t, r, i, s, o) {
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
function wp(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function xp(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function gs(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = wp(n, a, l + t);
    if (c) {
      s = !0;
      let u = gs(c, a, t + l + 1, r);
      u != Re && i.push(l, l + a.nodeSize, u);
    }
  });
  let o = kp(s ? xp(n) : n, -t).sort(kn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new oe(o, i) : Re;
}
function kn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Ol(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), Du(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), Du(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Du(n, e, t) {
  for (; e < n.length && kn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Ro(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Re && e.push(r);
  }), n.cursorWrapper && e.push(oe.create(n.state.doc, [n.cursorWrapper.deco])), jt.from(e);
}
const q1 = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, U1 = Ge && Xt <= 11;
class W1 {
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
class j1 {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new W1(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      Ge && Xt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : $e && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), U1 && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, q1)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (xu(this.view)) {
      if (this.suppressingSelectionUpdates)
        return _t(this.view);
      if (Ge && Xt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && An(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = sr(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = sr(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && xu(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, a = !1, l = [];
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
    } else if (at && l.length) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || J1(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Ws(r) && (c = xl(e)) && c.eq(Q.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, _t(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), H1(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, X1(e, l)), this.handleDOMChange(s, o, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || _t(e), this.currentSelection.set(r));
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
      if (Ge && Xt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? Me(i) + 1 : 0, a = r.localPosFromDOM(e.target, o, -1), l = s && s.parentNode == e.target ? Me(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
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
let _u = /* @__PURE__ */ new WeakMap(), Pu = !1;
function H1(n) {
  if (!_u.has(n) && (_u.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = at, Pu)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Pu = !0;
  }
}
function Ru(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return An(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function K1(n, e) {
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
function J1(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function X1(n, e) {
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
function G1(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], Ws(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), Oe && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let y = r.childNodes[g - 1], b = y.pmViewDesc;
      if (y.nodeName == "BR" && !b) {
        s = g;
        break;
      }
      if (!b || b.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || Dr.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: Y1,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: a };
}
function Y1(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if ($e && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || $e && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Z1 = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Q1(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let x = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, A = xl(n, x);
    if (A && !n.state.selection.eq(A)) {
      if (Oe && At && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (O) => O(n, un(13, "Enter"))))
        return;
      let C = n.state.tr.setSelection(A);
      x == "pointer" ? C.setMeta("pointer", !0) : x == "key" && C.scrollIntoView(), s && C.setMeta("composition", s), n.dispatch(C);
    }
    return;
  }
  let o = n.state.doc.resolve(e), a = o.sharedDepth(t);
  e = o.before(a + 1), t = n.state.doc.resolve(t).after(a + 1);
  let l = n.state.selection, c = G1(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = nS(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (or && n.input.lastIOSEnter > Date.now() - 225 || At) && i.some((x) => x.nodeType == 1 && !Z1.test(x.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (x) => x(n, un(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && l instanceof G && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (c.sel) {
        let x = Iu(n, n.state.doc, c.sel);
        if (x && !x.eq(n.state.selection)) {
          let A = n.state.tr.setSelection(x);
          s && A.setMeta("composition", s), n.dispatch(A);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof G && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), Ge && Xt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = u.resolve(p.start), b = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA;
  if ((or && n.input.lastIOSEnter > Date.now() - 225 && (!b || i.some((x) => x.nodeName == "DIV" || x.nodeName == "P")) || !b && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (x) => x(n, un(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && tS(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (x) => x(n, un(8, "Backspace")))) {
    At && Oe && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Oe && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), At && !b && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(x) {
      return x(n, un(13, "Enter"));
    });
  }, 20));
  let v = p.start, w = p.endA, S = (x) => {
    let A = x || n.state.tr.replace(v, w, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let C = Iu(n, A.doc, c.sel);
      C && !(Oe && n.composing && C.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (C.head == v || C.head == A.mapping.map(w) - 1) || Ge && C.empty && C.head == v) && A.setSelection(C);
    }
    return s && A.setMeta("composition", s), A.scrollIntoView();
  }, M;
  if (b)
    if (m.pos == g.pos) {
      Ge && Xt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => _t(n), 20));
      let x = S(n.state.tr.delete(v, w)), A = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      A && x.ensureMarks(A), n.dispatch(x);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (M = eS(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    ) {
      let x = S(n.state.tr);
      M.type == "add" ? x.addMark(v, w, M.mark) : x.removeMark(v, w, M.mark), n.dispatch(x);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let x = m.parent.textBetween(m.parentOffset, g.parentOffset), A = () => S(n.state.tr.insertText(x, v, w));
      n.someProp("handleTextInput", (C) => C(n, v, w, x, A)) || n.dispatch(A());
    } else
      n.dispatch(S());
  else
    n.dispatch(S());
}
function Iu(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Sl(n, e.resolve(t.anchor), e.resolve(t.head));
}
function eS(n, e) {
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
function tS(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    Io(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let a = s.nodeAfter;
    return a != null && t == e + a.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(Io(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Io(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Io(n, e, t) {
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
function nS(n, e, t, r, i) {
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
    s -= l, s && s < e.size && Nu(e.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), a = s + (a - o), o = s;
  } else if (a < s) {
    let l = r <= s && r >= a ? s - r : 0;
    s -= l, s && s < n.size && Nu(n.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), o = s + (o - a), a = s;
  }
  return { start: s, endA: o, endB: a };
}
function Nu(n) {
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
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new v1(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Fu), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Lu(this), Bu(this), this.nodeViews = zu(this), this.docView = gu(this.state.doc, $u(this), Ro(this), this.dom, this), this.domObserver = new j1(this, (r, i, s, o) => Q1(this, r, i, s, o)), this.domObserver.start(), b1(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && Aa(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Fu), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && (gp(this), o = !0), this.state = e;
    let a = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = zu(this);
      iS(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (a || t.handleDOMEvents != this._props.handleDOMEvents) && Aa(this), this.editable = Lu(this), Bu(this);
    let l = Ro(this), c = $u(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, l);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && Rx(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (Ge || Oe) && !this.composing && !i.selection.empty && !e.selection.empty && rS(i.selection, e.selection);
      if (d) {
        let p = Oe ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = R1(this)), (s || !this.docView.update(e.doc, c, l, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = gu(e.doc, c, l, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && r1(this)) ? _t(this, h) : (ip(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && Ix(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof X) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && uu(this, t.getBoundingClientRect(), e);
      } else
        uu(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new vp(e.slice, e.move, i < 0 ? void 0 : X.create(this.state.doc, i));
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
    if (Ge) {
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
    this.domObserver.stop(), this.editable && Nx(this.dom), _t(this), this.domObserver.start();
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
    return Fx(this, e);
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
    return Gh(this, e, t);
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
    return jx(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Jr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Jr(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return Cl(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (k1(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Ro(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, Sx());
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
    return x1(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? $e && this.root.nodeType === 11 && Ax(this.dom.ownerDocument) == this.dom && K1(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
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
function $u(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [je.node(0, n.state.doc.content.size, e)];
}
function Bu(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: je.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Lu(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function rS(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function zu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function iS(n, e) {
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
function Fu(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var nn = {
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
}, ys = {
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
}, sS = typeof navigator < "u" && /Mac/.test(navigator.platform), oS = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Ae = 0; Ae < 10; Ae++) nn[48 + Ae] = nn[96 + Ae] = String(Ae);
for (var Ae = 1; Ae <= 24; Ae++) nn[Ae + 111] = "F" + Ae;
for (var Ae = 65; Ae <= 90; Ae++)
  nn[Ae] = String.fromCharCode(Ae + 32), ys[Ae] = String.fromCharCode(Ae);
for (var No in nn) ys.hasOwnProperty(No) || (ys[No] = nn[No]);
function aS(n) {
  var e = sS && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || oS && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? ys : nn)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const lS = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), cS = typeof navigator < "u" && /Win/.test(navigator.platform);
function uS(n) {
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
      lS ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function dS(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[uS(t)] = n[t];
  return e;
}
function $o(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function fS(n) {
  return new Pe({ props: { handleKeyDown: hS(n) } });
}
function hS(n) {
  let e = dS(n);
  return function(t, r) {
    let i = aS(r), s, o = e[$o(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[$o(i, r, !1)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(cS && r.ctrlKey && r.altKey) && (s = nn[r.keyCode]) && s != i) {
        let a = e[$o(s, r)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var pS = Object.defineProperty, Dl = (n, e) => {
  for (var t in e)
    pS(n, t, { get: e[t], enumerable: !0 });
};
function Ks(n) {
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
var Js = class {
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
      state: Ks({
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
}, Cp = {};
Dl(Cp, {
  blur: () => mS,
  clearContent: () => gS,
  clearNodes: () => yS,
  command: () => vS,
  createParagraphNear: () => bS,
  cut: () => kS,
  deleteCurrentNode: () => wS,
  deleteNode: () => xS,
  deleteRange: () => SS,
  deleteSelection: () => CS,
  enter: () => TS,
  exitCode: () => ES,
  extendMarkRange: () => MS,
  first: () => AS,
  focus: () => DS,
  forEach: () => _S,
  insertContent: () => PS,
  insertContentAt: () => NS,
  joinBackward: () => LS,
  joinDown: () => BS,
  joinForward: () => zS,
  joinItemBackward: () => FS,
  joinItemForward: () => VS,
  joinTextblockBackward: () => qS,
  joinTextblockForward: () => US,
  joinUp: () => $S,
  keyboardShortcut: () => jS,
  lift: () => HS,
  liftEmptyBlock: () => KS,
  liftListItem: () => JS,
  newlineInCode: () => XS,
  resetAttributes: () => GS,
  scrollIntoView: () => YS,
  selectAll: () => ZS,
  selectNodeBackward: () => QS,
  selectNodeForward: () => eC,
  selectParentNode: () => tC,
  selectTextblockEnd: () => nC,
  selectTextblockStart: () => rC,
  setContent: () => iC,
  setMark: () => SC,
  setMeta: () => CC,
  setNode: () => TC,
  setNodeSelection: () => EC,
  setTextDirection: () => MC,
  setTextSelection: () => AC,
  sinkListItem: () => OC,
  splitBlock: () => DC,
  splitListItem: () => _C,
  toggleList: () => PC,
  toggleMark: () => RC,
  toggleNode: () => IC,
  toggleWrap: () => NC,
  undoInputRule: () => $C,
  unsetAllMarks: () => BC,
  unsetMark: () => LC,
  unsetTextDirection: () => zC,
  updateAttributes: () => FC,
  wrapIn: () => VC,
  wrapInList: () => qC
});
var mS = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), gS = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), yS = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = mr(h);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, vS = (n) => (e) => n(e), bS = () => ({ state: n, dispatch: e }) => Lh(n, e), kS = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new G(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, wS = () => ({ tr: n, dispatch: e }) => {
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
var xS = (n) => ({ tr: e, state: t, dispatch: r }) => {
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
}, SS = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, CS = () => ({ state: n, dispatch: e }) => gl(n, e), TS = () => ({ commands: n }) => n.keyboardShortcut("Enter"), ES = () => ({ state: n, dispatch: e }) => cx(n, e);
function _l(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function vs(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : _l(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Tp(n, e, t = {}) {
  return n.find((r) => r.type === e && vs(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Vu(n, e, t = {}) {
  return !!Tp(n, e, t);
}
function Ep(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !Tp([...i.node.marks], e, t)))
    return;
  let o = i.index, a = n.start() + i.offset, l = o + 1, c = a + i.node.nodeSize;
  for (; o > 0 && Vu([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, a -= n.parent.child(o).nodeSize;
  for (; l < n.parent.childCount && Vu([...n.parent.child(l).marks], e, t); )
    c += n.parent.child(l).nodeSize, l += 1;
  return {
    from: a,
    to: c
  };
}
function zt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var MS = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = zt(n, r.schema), { doc: o, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = Ep(l, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = G.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, AS = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Mp(n) {
  return n instanceof G;
}
function mn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Ap(n, e = null) {
  if (!e)
    return null;
  const t = Q.atStart(n), r = Q.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? G.create(n, mn(0, i, s), mn(n.content.size, i, s)) : G.create(n, mn(e, i, s), mn(e, i, s));
}
function Oa() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Gr() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function OS() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var DS = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (Gr() || Oa()) && r.dom.focus(), OS() && !Gr() && !Oa() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !Mp(t.state.selection))
    return o(), !0;
  const a = Ap(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, _S = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), PS = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Op = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Op(r);
  }
  return n;
};
function Di(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Op(t);
}
function Yr(n, e, t) {
  if (n instanceof Ot || n instanceof P)
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
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), Yr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, a = "";
      const l = new dh({
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
      if (t.slice ? Dr.fromSchema(l).parseSlice(Di(n), t.parseOptions) : Dr.fromSchema(l).parse(Di(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${a}`)
        });
    }
    const s = Dr.fromSchema(e);
    return t.slice ? s.parseSlice(Di(n), t.parseOptions).content : s.parse(Di(n), t.parseOptions);
  }
  return Yr("", e, t);
}
function RS(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof ye || i instanceof we))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(Q.near(n.doc.resolve(o), t));
}
var IS = (n) => !("type" in n), NS = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
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
        Yr(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        l(g);
      }
    try {
      a = Yr(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return l(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((IS(a) ? a : [a]).forEach((g) => {
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
    t.updateSelection && RS(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, $S = () => ({ state: n, dispatch: e }) => ox(n, e), BS = () => ({ state: n, dispatch: e }) => ax(n, e), LS = () => ({ state: n, dispatch: e }) => _h(n, e), zS = () => ({ state: n, dispatch: e }) => Nh(n, e), FS = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Vs(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, VS = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Vs(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, qS = () => ({ state: n, dispatch: e }) => ix(n, e), US = () => ({ state: n, dispatch: e }) => sx(n, e);
function Dp() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function WS(n) {
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
      Gr() || Dp() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var jS = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = WS(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
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
function Zr(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? xe(e, n.schema) : null, a = [];
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
  const l = i - r, c = a.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => vs(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
var HS = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return Zr(t, i, e) ? lx(t, r) : !1;
}, KS = () => ({ state: n, dispatch: e }) => zh(n, e), JS = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return bx(r)(e, t);
}, XS = () => ({ state: n, dispatch: e }) => Bh(n, e);
function Xs(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function qu(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var GS = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Xs(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = xe(n, r.schema)), a === "mark" && (o = zt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (l = !0, i && t.setNodeMarkup(d, void 0, qu(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (l = !0, i && t.addMark(d, d + u.nodeSize, o.create(qu(f.attrs, e))));
      });
    });
  }), l;
}, YS = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), ZS = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new Xe(n.doc);
    n.setSelection(t);
  }
  return !0;
}, QS = () => ({ state: n, dispatch: e }) => Rh(n, e), eC = () => ({ state: n, dispatch: e }) => $h(n, e), tC = () => ({ state: n, dispatch: e }) => dx(n, e), nC = () => ({ state: n, dispatch: e }) => px(n, e), rC = () => ({ state: n, dispatch: e }) => hx(n, e);
function Da(n, e, t = {}, r = {}) {
  return Yr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var iC = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: a }) => {
  const { doc: l } = s;
  if (r.preserveWhitespace !== "full") {
    const c = Da(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, l.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: l.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function _p(n, e) {
  const t = zt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function sC(n, e) {
  const t = new Mh(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function oC(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function aC(n, e) {
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
function Pl(n) {
  return (e) => aC(e.$from, n);
}
function H(n, e, t) {
  return n.config[e] === void 0 && n.parent ? H(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? H(n.parent, e, t) : null
  }) : n.config[e];
}
function Rl(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = H(e, "addExtensions", t);
    return r ? [e, ...Rl(r())] : e;
  }).flat(10);
}
function Il(n, e) {
  const t = Nn.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function Pp(n) {
  return typeof n == "function";
}
function ce(n, e = void 0, ...t) {
  return Pp(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function lC(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function ar(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Rp(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = ar(n), i = [...t, ...r], s = {
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
function cC(n) {
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
function Uu(n) {
  const e = [], t = cC(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const a = s.slice(0, o).trim(), l = s.slice(o + 1).trim();
    a && l && e.push([a, l]);
  }
  return e;
}
function Ip(...n) {
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
        const a = new Map([...Uu(r[i]), ...Uu(s)]);
        r[i] = Array.from(a.entries()).map(([l, c]) => `${l}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function bs(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => Ip(t, r), {});
}
function uC(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Wu(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const a = o.attribute.parseHTML ? o.attribute.parseHTML(t) : uC(t.getAttribute(o.name));
        return a == null ? s : {
          ...s,
          [o.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function ju(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && lC(t) ? !1 : t != null)
  );
}
function Hu(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function Np(n, e) {
  var t;
  const r = Rp(n), { nodeExtensions: i, markExtensions: s } = ar(n), o = (t = i.find((c) => H(c, "topNode"))) == null ? void 0 : t.name, a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((y) => y.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((y, b) => {
        const v = H(b, "extendNodeSchema", d);
        return {
          ...y,
          ...v ? v(c) : {}
        };
      }, {}), h = ju({
        ...f,
        content: ce(H(c, "content", d)),
        marks: ce(H(c, "marks", d)),
        group: ce(H(c, "group", d)),
        inline: ce(H(c, "inline", d)),
        atom: ce(H(c, "atom", d)),
        selectable: ce(H(c, "selectable", d)),
        draggable: ce(H(c, "draggable", d)),
        code: ce(H(c, "code", d)),
        whitespace: ce(H(c, "whitespace", d)),
        linebreakReplacement: ce(
          H(c, "linebreakReplacement", d)
        ),
        defining: ce(H(c, "defining", d)),
        isolating: ce(H(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(Hu))
      }), p = ce(H(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (y) => Wu(y, u)
      ));
      const m = H(c, "renderHTML", d);
      m && (h.toDOM = (y) => m({
        node: y,
        HTMLAttributes: bs(y, u)
      }));
      const g = H(c, "renderText", d);
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
        const b = H(y, "extendMarkSchema", d);
        return {
          ...g,
          ...b ? b(c) : {}
        };
      }, {}), h = ju({
        ...f,
        inclusive: ce(H(c, "inclusive", d)),
        excludes: ce(H(c, "excludes", d)),
        group: ce(H(c, "group", d)),
        spanning: ce(H(c, "spanning", d)),
        code: ce(H(c, "code", d)),
        attrs: Object.fromEntries(u.map(Hu))
      }), p = ce(H(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => Wu(g, u)
      ));
      const m = H(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: bs(g, u)
      })), [c.name, h];
    })
  );
  return new dh({
    topNode: o,
    nodes: a,
    marks: l
  });
}
function dC(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function Ir(n) {
  return n.sort((t, r) => {
    const i = H(t, "priority") || 100, s = H(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function Nl(n) {
  const e = Ir(Rl(n)), t = dC(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function fC(n, e) {
  const t = Nl(n);
  return Np(t, e);
}
function $p(n, e, t) {
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
function hC(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return $p(n, t, e);
}
function Bp(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function pC(n, e) {
  const t = xe(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function mC(n, e) {
  const t = Xs(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? pC(n, e) : t === "mark" ? _p(n, e) : {};
}
function gC(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function yC(n) {
  const e = gC(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function vC(n) {
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
  }), yC(r);
}
function wr(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Ui(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var bC = (n, e = 500) => {
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
function _a(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? zt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => vs(d.attrs, t, { strict: !1 }));
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
  const l = a.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => vs(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function kC(n, e, t = {}) {
  if (!e)
    return Zr(n, null, t) || _a(n, null, t);
  const r = Xs(e, n.schema);
  return r === "node" ? Zr(n, e, t) : r === "mark" ? _a(n, e, t) : !1;
}
function Ku(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function Ju(n, e) {
  const { nodeExtensions: t } = ar(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = ce(H(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function $l(n, {
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
      i !== !1 && ($l(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var Bl = class Lp {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new Lp(e.position);
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
function zp(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new Bl(t.pos),
    mapResult: t
  };
}
function wC(n) {
  return new Bl(n);
}
function xC(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Mp(i) && (s = i.$cursor), s) {
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
var SC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: a } = s, l = zt(n, r.schema);
  if (i)
    if (o) {
      const c = _p(r, l);
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
  return xC(r, t, l);
}, CC = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), TC = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = xe(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: a }) => au(s, { ...o, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => au(s, { ...o, ...e })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, EC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = mn(n, 0, r.content.size), s = X.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, MC = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, a;
  return typeof e == "number" ? (o = e, a = e) : e && "from" in e && "to" in e ? (o = e.from, a = e.to) : (o = s.from, a = s.to), i && t.doc.nodesBetween(o, a, (l, c) => {
    l.isText || t.setNodeMarkup(c, void 0, {
      ...l.attrs,
      dir: n
    });
  }), !0;
}, AC = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = G.atStart(r).from, a = G.atEnd(r).to, l = mn(i, o, a), c = mn(s, o, a), u = G.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, OC = (n) => ({ state: e, dispatch: t }) => {
  const r = xe(n, e.schema);
  return xx(r)(e, t);
};
function Xu(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var DC = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, u = Ui(c, a.node().type.name, a.node().attrs);
  if (s instanceof X && s.node.isBlock)
    return !a.parentOffset || !Dt(o, a.pos) ? !1 : (r && (n && Xu(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const d = l.parentOffset === l.parent.content.size, f = a.depth === 0 ? void 0 : oC(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Dt(e.doc, e.mapping.map(a.pos), 1, h);
  if (!h && !p && Dt(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof G && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, h), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), g = e.doc.resolve(m);
      a.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && Xu(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, _C = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const a = xe(n, r.schema), { $from: l, $to: c } = r.selection, u = r.selection.node;
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
        ...Ui(f, l.node().type.name, l.node().attrs),
        ...e
      }, S = ((o = a.contentMatch.defaultType) == null ? void 0 : o.createAndFill(w)) || void 0;
      y = y.append(P.from(a.createAndFill(null, S) || void 0));
      const M = l.before(l.depth - (b - 1));
      t.replace(M, l.after(-v), new F(y, 4 - b, 0));
      let x = -1;
      t.doc.nodesBetween(M, t.doc.content.size, (A, C) => {
        if (x > -1)
          return !1;
        A.isTextblock && A.content.size === 0 && (x = C + 1);
      }), x > -1 && t.setSelection(G.near(t.doc.resolve(x))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === l.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Ui(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Ui(f, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const g = h ? [
    { type: a, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: a, attrs: p }];
  if (!Dt(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: y, storedMarks: b } = r, { splittableMarks: v } = s.extensionManager, w = b || y.$to.parentOffset && y.$from.marks();
    if (t.split(l.pos, 2, g).scrollIntoView(), !w || !i)
      return !0;
    const S = w.filter((M) => v.includes(M.type.name));
    t.ensureMarks(S);
  }
  return !0;
}, Bo = (n, e) => {
  const t = Pl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && $n(n.doc, t.pos) && n.join(t.pos), !0;
}, Lo = (n, e) => {
  const t = Pl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && $n(n.doc, r) && n.join(r), !0;
}, PC = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = xe(n, o.schema), p = xe(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: b } = m, v = y.blockRange(b), w = g || m.$to.parentOffset && m.$from.marks();
  if (!v)
    return !1;
  const S = Pl((M) => Ju(M.type.name, d))(m);
  if (v.depth >= 1 && S && v.depth - S.depth <= 1) {
    if (S.node.type === h)
      return c.liftListItem(p);
    if (Ju(S.node.type.name, d) && h.validContent(S.node.content) && a)
      return l().command(() => (s.setNodeMarkup(S.pos, h), !0)).command(() => Bo(s, h)).command(() => Lo(s, h)).run();
  }
  return !t || !w || !a ? l().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => Bo(s, h)).command(() => Lo(s, h)).run() : l().command(() => {
    const M = u().wrapInList(h, r), x = w.filter((A) => f.includes(A.type.name));
    return s.ensureMarks(x), M ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => Bo(s, h)).command(() => Lo(s, h)).run();
}, RC = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = zt(n, r.schema);
  return _a(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, IC = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = xe(n, r.schema), o = xe(e, r.schema), a = Zr(r, s, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), a ? i.setNode(o, l) : i.setNode(s, { ...l, ...t });
}, NC = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = xe(n, t.schema);
  return Zr(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, $C = () => ({ state: n, dispatch: e }) => {
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
}, BC = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, LC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = t, l = zt(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = a;
    const p = (s = c.marks().find((g) => g.type === l)) == null ? void 0 : s.attrs, m = Ep(c, l, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, zC = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (a, l) => {
    if (a.isText)
      return;
    const c = { ...a.attrs };
    delete c.dir, e.setNodeMarkup(l, void 0, c);
  }), !0;
}, FC = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Xs(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = xe(n, r.schema)), a === "mark" && (o = zt(n, r.schema));
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
}, VC = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return mx(i, e)(t, r);
}, qC = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = xe(n, t.schema);
  return gx(i, e)(t, r);
}, UC = class {
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
}, WC = (n, e) => {
  if (_l(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function _i(n) {
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
  const d = bC(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = WC(d, f.find);
    if (!h)
      return;
    const p = l.state.tr, m = Ks({
      state: l.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: y, chain: b, can: v } = new Js({
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
function jC(n) {
  const { editor: e, rules: t } = n, r = new Pe({
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
          typeof u == "string" ? u = u : u = Il(P.from(u), o.schema);
          const { from: d } = l, f = d + u.length;
          _i({
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
        return _i({
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
          s && _i({
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
        return o ? _i({
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
function HC(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Pi(n) {
  return HC(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Fp(n, e) {
  const t = { ...n };
  return Pi(n) && Pi(e) && Object.keys(e).forEach((r) => {
    Pi(e[r]) && Pi(n[r]) ? t[r] = Fp(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var Ll = class {
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
      ...ce(
        H(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...ce(
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
      addOptions: () => Fp(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, KC = class Vp extends Ll {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new Vp(t);
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
function JC(n) {
  return typeof n == "number";
}
var XC = (n, e, t) => {
  if (_l(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function GC(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: a } = n, { commands: l, chain: c, can: u } = new Js({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, y, b, v;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const w = (v = (b = (y = h.content) == null ? void 0 : y.size) != null ? b : h.nodeSize) != null ? v : 0, S = Math.max(r, p), M = Math.min(i, p + w);
    if (S >= M)
      return;
    const x = h.isText ? h.text || "" : h.textBetween(S - p, M - p, void 0, "￼");
    XC(x, s.find, o).forEach((C) => {
      if (C.index === void 0)
        return;
      const O = S + C.index + 1, D = O + C[0].length, R = {
        from: t.tr.mapping.map(O),
        to: t.tr.mapping.map(D)
      }, z = s.handler({
        state: t,
        range: R,
        match: C,
        commands: l,
        chain: c,
        can: u,
        pasteEvent: o,
        dropEvent: a
      });
      d.push(z);
    });
  }), d.every((h) => h !== null);
}
var Ri = null, YC = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function ZC(n) {
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
    const m = u.tr, g = Ks({
      state: u,
      transaction: m
    });
    if (!(!GC({
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
  return t.map((u) => new Pe({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (Ri = e);
      }, h = () => {
        Ri && (Ri = null);
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
            const h = Ri;
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
        let { text: S } = y;
        typeof S == "string" ? S = S : S = Il(P.from(S), h.schema);
        const { from: M } = y, x = M + S.length, A = YC(S);
        return l({
          rule: u,
          state: h,
          from: M,
          to: { b: x },
          pasteEvt: A
        });
      }
      const v = f.doc.content.findDiffStart(h.doc.content), w = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!JC(v) || !w || v === w.b))
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
var Gs = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = Nl(n), this.schema = Np(this.extensions, e), this.setupExtensions();
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
        type: wr(e.name, this.schema)
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
    return Ir([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: wr(r.name, this.schema)
      }, s = [], o = H(
        r,
        "addKeyboardShortcuts",
        i
      );
      let a = {};
      if (r.type === "mark" && H(r, "exitable", i) && (a.ArrowRight = () => KC.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        a = { ...a, ...f };
      }
      const l = fS(a);
      s.push(l);
      const c = H(r, "addInputRules", i);
      if (Ku(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = jC({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = H(r, "addPasteRules", i);
      if (Ku(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = ZC({ editor: n, rules: f });
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
    return Rp(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = ar(this.extensions);
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
        const a = (l, c, u, d, f) => {
          const h = bs(l, r);
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
    return Ir([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: wr(i.name, this.schema)
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
    return Ir([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: wr(i.name, this.schema)
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
    const { editor: n } = this, { markExtensions: e } = ar(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!H(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: zt(t.name, this.schema)
        }, s = H(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (a, l, c) => {
          const u = bs(a, r);
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
              fT(a, n, d);
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
        type: wr(e.name, this.schema)
      };
      e.type === "mark" && ((t = ce(H(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = H(e, "onBeforeCreate", r), s = H(e, "onCreate", r), o = H(e, "onUpdate", r), a = H(
        e,
        "onSelectionUpdate",
        r
      ), l = H(e, "onTransaction", r), c = H(e, "onFocus", r), u = H(e, "onBlur", r), d = H(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), a && this.editor.on("selectionUpdate", a), l && this.editor.on("transaction", l), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
Gs.resolve = Nl;
Gs.sort = Ir;
Gs.flatten = Rl;
var QC = {};
Dl(QC, {
  ClipboardTextSerializer: () => Up,
  Commands: () => Wp,
  Delete: () => jp,
  Drop: () => Hp,
  Editable: () => Kp,
  FocusEvents: () => Xp,
  Keymap: () => Gp,
  Paste: () => Yp,
  Tabindex: () => Zp,
  TextDirection: () => Qp,
  focusEventsPluginKey: () => Jp
});
var Qe = class qp extends Ll {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new qp(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, Up = Qe.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new Pe({
        key: new Ze("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), a = Math.max(...s.map((u) => u.$to.pos)), l = Bp(t);
            return $p(r, { from: o, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), Wp = Qe.create({
  name: "commands",
  addCommands() {
    return {
      ...Cp
    };
  }
}), jp = Qe.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, a, l, c;
      if ((c = (l = (a = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : a.filterTransaction) == null ? void 0 : l.call(a, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = sC(n.before, [n, ...e]);
      vC(u).forEach((h) => {
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
        if (h instanceof ft) {
          const y = f.slice(p).map(h.from, -1), b = f.slice(p).map(h.to), v = f.invert().map(y, -1), w = f.invert().map(b), S = (m = u.doc.nodeAt(y - 1)) == null ? void 0 : m.marks.some((x) => x.eq(h.mark)), M = (g = u.doc.nodeAt(b)) == null ? void 0 : g.marks.some((x) => x.eq(h.mark));
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
            partial: !!(M || S),
            editor: this.editor,
            transaction: n,
            combinedTransform: u
          });
        }
      });
    };
    (i = (r = (t = this.editor.options.coreExtensionOptions) == null ? void 0 : t.delete) == null ? void 0 : r.async) == null || i ? setTimeout(s, 0) : s();
  }
}), Hp = Qe.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new Pe({
        key: new Ze("tiptapDrop"),
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
}), Kp = Qe.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Pe({
        key: new Ze("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Jp = new Ze("focusEvents"), Xp = Qe.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Pe({
        key: Jp,
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
}), Gp = Qe.create({
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
    return Gr() || Dp() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new Pe({
        key: new Ze("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: a } = e.selection, l = Q.atStart(e.doc).from, c = Q.atEnd(e.doc).to;
          if (s || !(o === l && a === c) || !$l(t.doc))
            return;
          const f = t.tr, h = Ks({
            state: t,
            transaction: f
          }), { commands: p } = new Js({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), Yp = Qe.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new Pe({
        key: new Ze("tiptapPaste"),
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
}), Zp = Qe.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Pe({
        key: new Ze("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), Qp = Qe.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = ar(this.extensions);
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
      new Pe({
        key: new Ze("textDirection"),
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
}), eT = class Er {
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
}, tT = `.ProseMirror {
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
function nT(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var rT = class extends UC {
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
      getUpdatedPosition: zp,
      createMappablePosition: wC
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = Ap(t, this.options.autofocus);
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
    this.options.injectCSS && typeof document < "u" && (this.css = nT(tT, this.options.injectNonce));
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
    const r = Pp(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
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
      Kp,
      Up.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      Wp,
      Xp,
      Gp,
      Zp,
      Hp,
      Yp,
      jp,
      Qp.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new Gs(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new Js({
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
      e = Da(this.options.content, this.schema, this.options.parseOptions, {
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
      }), e = Da(this.options.content, this.schema, this.options.parseOptions, {
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
    return mC(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return kC(this.state, r, i);
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
    return Il(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return hC(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...Bp(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return $l(this.state.doc);
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
    return new eT(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, iT = {};
Dl(iT, {
  createAtomBlockMarkdownSpec: () => sT,
  createBlockMarkdownSpec: () => oT,
  createInlineMarkdownSpec: () => cT,
  parseAttributes: () => zl,
  parseIndentedBlocks: () => uT,
  renderNestedMarkdownContent: () => dT,
  serializeAttributes: () => Fl
});
function zl(n) {
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
function Fl(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function sT(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = zl,
    serializeAttributes: i = Fl,
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
function oT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = zl,
    serializeAttributes: s = Fl,
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
        const S = y.length;
        let M = "";
        const x = /^:::([\w-]*)(\s.*)?/gm, A = d.slice(S);
        for (x.lastIndex = 0; ; ) {
          const C = x.exec(A);
          if (C === null)
            break;
          const O = C.index, D = C[1];
          if (!((p = C[2]) != null && p.endsWith(":::"))) {
            if (D)
              w += 1;
            else if (w -= 1, w === 0) {
              const R = A.slice(0, O);
              M = R.trim();
              const z = d.slice(0, S + O + C[0].length);
              let N = [];
              if (M)
                if (a === "block")
                  for (N = h.blockTokens(R), N.forEach((U) => {
                    U.text && (!U.tokens || U.tokens.length === 0) && (U.tokens = h.inlineTokens(U.text));
                  }); N.length > 0; ) {
                    const U = N[N.length - 1];
                    if (U.type === "paragraph" && (!U.text || U.text.trim() === ""))
                      N.pop();
                    else
                      break;
                  }
                else
                  N = h.inlineTokens(M);
              return {
                type: e,
                raw: z,
                attributes: v,
                content: M,
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
function aT(n) {
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
function lT(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function cT(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = aT,
    serializeAttributes: s = lT,
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
          const [, w, S] = g;
          b = w, y = S || "";
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
function uT(n, e, t) {
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
      const S = a[u];
      if (S.trim() === "") {
        const x = a.slice(u + 1).findIndex((O) => O.trim() !== "");
        if (x === -1)
          break;
        if ((((i = (r = a[u + 1 + x].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
          y.push(S), c = `${c}${S}
`, u += 1;
          continue;
        } else
          break;
      }
      if ((((o = (s = S.match(/^(\s*)/)) == null ? void 0 : s[1]) == null ? void 0 : o.length) || 0) > m)
        y.push(S), c = `${c}${S}
`, u += 1;
      else
        break;
    }
    let b;
    const v = y.slice(1);
    if (v.length > 0) {
      const S = v.map((M) => M.slice(m + d)).join(`
`);
      S.trim() && (e.customNestedParser ? b = e.customNestedParser(S) : b = t.blockTokens(S));
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
function dT(n, e, t, r) {
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
function fT(n, e, t = {}) {
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
var Vl = class em extends Ll {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new em(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, hT = class {
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
      const b = this.dom.getBoundingClientRect(), v = u.getBoundingClientRect(), w = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, S = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = v.x - b.x + w, f = v.y - b.y + S;
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
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (Gr() || Oa()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
function Gu(n) {
  return Ud((e, t) => ({
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
var pT = class extends rT {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = Gu(this.view.state), this.reactiveExtensionStorage = Gu(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), Xa(this);
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
}, mT = B({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = _(), t = rn();
    return rt(() => {
      const r = n.editor;
      r && r.options.element && e.value && ke(() => {
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
    }), Lt(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return He("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), gT = B({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return He(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), yT = B({
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
    return He(
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
}), vT = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = Xa(n), this.el = document.createElement("div"), this.props = Ja(e), this.renderedComponent = this.renderComponent();
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
    let n = He(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && pc(n, this.el), { vNode: n, destroy: () => {
      this.el && pc(null, this.el), this.el = null, n = null;
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
    return He(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var bT = class extends hT {
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
    const t = B({
      extends: { ...this.component },
      props: Object.keys(n),
      template: this.component.template,
      setup: (r) => {
        var i, s;
        return Sn("onDragStart", e), Sn("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new vT(t, {
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
function kT(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new bT(r, t, e);
  };
}
const wT = { class: "transcription-panel" }, xT = {
  ref: "scrollContainer",
  class: "scroll-container"
}, ST = { class: "turns-container" }, CT = {
  key: 0,
  class: "history-loading",
  role: "status"
}, TT = {
  key: 1,
  class: "history-start"
}, ET = /* @__PURE__ */ B({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = he(), r = qe(), i = It("scrollContainer"), s = E(() => {
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
    ), f = E(() => u.value?.hasMoreHistory.value ?? !1), { isFollowing: h, resumeFollow: p } = aw(i), { scrollRef: m, contentRef: g, isAtBottom: y, scrollToBottom: b } = ev();
    _e(() => {
      m.value = i.value, g.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const v = E(
      () => !h.value && l.value || !y.value && a.value
    );
    function w() {
      l.value ? p() : b();
    }
    const S = ry(() => {
      const x = u.value;
      if (!x?.hasMoreHistory.value || x.isLoadingHistory.value || e.turns.length === 0) return;
      const A = c.value;
      A && r.emit("scroll:top", { translationId: A.id });
    }, 500);
    function M() {
      const x = i.value;
      x && x.scrollTop < 100 && S();
    }
    return Y(
      () => e.turns,
      (x, A) => {
        const C = x.length, O = A.length;
        if (C > O && !y.value && x[0]?.id != A[0]?.id) {
          const D = C - O, R = e.turns[D]?.id;
          if (!R || !m.value) return;
          ke(() => {
            m.value?.querySelector(
              `[data-turn-id="${R}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), _e(() => {
      i.value?.addEventListener("scroll", M, {
        passive: !0
      });
    }), Lt(() => {
      i.value?.removeEventListener("scroll", M);
    }), (x, A) => (T(), L("article", wT, [
      V("div", xT, [
        V("div", ST, [
          d.value ? (T(), L("div", CT, [...A[2] || (A[2] = [
            V("progress", null, null, -1)
          ])])) : j("", !0),
          !f.value && n.turns.length > 0 ? (T(), L("div", TT, K(k(t)("transcription.historyStart")), 1)) : j("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (T(), I(sw, {
            key: 2,
            class: "transcription-empty"
          })) : j("", !0),
          o.value ? (T(), I(k(mT), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (T(!0), L(De, { key: 4 }, ht(n.turns, (C, O, D, R) => {
            const z = [C, n.speakers.get(C.speakerId ?? ""), a.value && !s.value && O === n.turns.length - 1];
            if (R && R.key === C.id && Rg(R, z)) return R;
            const N = (T(), I(Vc, {
              "data-turn-id": C.id,
              key: C.id,
              turn: C,
              speaker: C.speakerId ? n.speakers.get(C.speakerId) : void 0,
              live: a.value && !s.value && O === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return N.memo = z, N;
          }, A, 0), 128)),
          s.value ? (T(), I(Vc, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : j("", !0)
        ]),
        q(Ga, { name: "fade-slide" }, {
          default: $(() => [
            v.value ? (T(), I(ve, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": k(t)("transcription.resumeScroll"),
              onClick: w
            }, {
              icon: $(() => [
                q(k(tf), { size: 14 })
              ]),
              default: $(() => [
                be(" " + K(k(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : j("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Yu = /* @__PURE__ */ te(ET, [["__scopeId", "data-v-472af2c0"]]), MT = {
  key: 0,
  class: "popover-list__items"
}, AT = {
  key: 0,
  class: "popover-list__divider"
}, OT = { class: "popover-list__footer" }, ql = /* @__PURE__ */ B({
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
    return (a, l) => (T(), I(k($k), {
      open: s.value,
      "onUpdate:open": l[0] || (l[0] = (c) => s.value = c)
    }, {
      default: $(() => [
        q(k(Wk), { "as-child": "" }, {
          default: $(() => [
            J(a.$slots, "trigger")
          ]),
          _: 3
        }),
        q(k(qk), { disabled: "" }, {
          default: $(() => [
            q(k(Lk), {
              class: "popover-list",
              "position-strategy": "absolute",
              side: n.side,
              align: n.align,
              "side-offset": n.sideOffset
            }, {
              default: $(() => [
                n.items.length > 0 ? (T(), L("ul", MT, [
                  (T(!0), L(De, null, ht(n.items, (c, u) => (T(), I(k(Fk), {
                    key: o(c, u),
                    as: "li",
                    class: ct(["popover-list__item", { "popover-list__item--current": n.isCurrent?.(c) }]),
                    onSelect: (d) => r("select", c)
                  }, {
                    default: $(() => [
                      J(a.$slots, "item", { item: c })
                    ]),
                    _: 2
                  }, 1032, ["class", "onSelect"]))), 128))
                ])) : j("", !0),
                a.$slots.footer ? (T(), L(De, { key: 1 }, [
                  n.items.length > 0 ? (T(), L("div", AT)) : j("", !0),
                  V("div", OT, [
                    J(a.$slots, "footer")
                  ])
                ], 64)) : j("", !0)
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
}), DT = /* @__PURE__ */ B({
  __name: "DownloadMenu",
  props: {
    formats: {},
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = he();
    function s(o) {
      r("select", o.format);
    }
    return (o, a) => (T(), I(ql, {
      items: t.formats,
      "item-key": (l) => l.format,
      align: "end",
      onSelect: s
    }, {
      trigger: $(() => [
        q(ve, {
          variant: "primary",
          icon: "download",
          "icon-right": "chevron-down",
          disabled: n.disabled,
          loading: n.loading
        }, {
          default: $(() => [
            be(K(k(i)("llmService.download")), 1)
          ]),
          _: 1
        }, 8, ["disabled", "loading"])
      ]),
      item: $(({ item: l }) => [
        V("span", null, K(k(i)(l.labelKey)), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), _T = ["data-status"], PT = {
  class: "document-article__toolbar",
  role: "toolbar"
}, RT = { class: "document-article__meta" }, IT = { class: "document-article__meta-label" }, NT = ["value"], $T = { class: "document-article__actions" }, BT = { class: "document-article__body" }, LT = {
  key: 0,
  class: "document-article__loading"
}, zT = /* @__PURE__ */ B({
  __name: "DocumentArticle",
  props: {
    metaLabel: {},
    metaIcon: {},
    metaProgress: {},
    status: { default: "done" },
    showRegenerate: { type: Boolean, default: !1 },
    formats: {}
  },
  emits: ["regenerate", "export"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = he();
    return (s, o) => (T(), L("article", {
      class: "document-article",
      "data-status": t.status
    }, [
      V("div", PT, [
        V("span", RT, [
          k(Vr)(t.metaIcon) ? (T(), I(gn, {
            key: 0,
            name: t.metaIcon,
            size: 16
          }, null, 8, ["name"])) : j("", !0),
          V("span", IT, K(t.metaLabel), 1),
          t.metaProgress !== void 0 ? (T(), L("progress", {
            key: 1,
            class: "document-article__progress",
            max: 100,
            value: t.metaProgress
          }, null, 8, NT)) : j("", !0)
        ]),
        V("div", $T, [
          t.showRegenerate ? (T(), I(ve, {
            key: 0,
            variant: "tertiary",
            icon: "refresh-cw",
            loading: t.status === "processing",
            disabled: t.status === "processing",
            onClick: o[0] || (o[0] = (a) => r("regenerate"))
          }, {
            default: $(() => [
              be(K(k(i)("llmService.regenerate")), 1)
            ]),
            _: 1
          }, 8, ["loading", "disabled"])) : j("", !0),
          q(DT, {
            formats: t.formats,
            disabled: t.status === "processing",
            onSelect: o[1] || (o[1] = (a) => r("export", a))
          }, null, 8, ["formats", "disabled"])
        ])
      ]),
      V("div", BT, [
        t.status === "processing" ? (T(), L("div", LT, [
          q(gn, {
            name: "spinner",
            spin: "",
            size: 20
          })
        ])) : J(s.$slots, "default", { key: 1 }, void 0, !0)
      ])
    ], 8, _T));
  }
}), tm = /* @__PURE__ */ te(zT, [["__scopeId", "data-v-32e1dfe7"]]), FT = { class: "verbatim-panel" }, VT = { class: "verbatim-panel__header" }, qT = { class: "verbatim-panel__doc-title" }, UT = {
  key: 0,
  class: "verbatim-panel__subtitle"
}, WT = { class: "verbatim-panel__turns" }, jT = { class: "verbatim-panel__speaker" }, HT = { class: "verbatim-panel__speaker-name" }, KT = { class: "verbatim-panel__text" }, JT = /* @__PURE__ */ B({
  __name: "VerbatimPanel",
  setup(n) {
    const e = qe(), { t, locale: r } = he(), i = [
      { format: "docx", labelKey: "format.docx" },
      { format: "pdf", labelKey: "format.pdf" },
      { format: "txt", labelKey: "format.txt" },
      { format: "json", labelKey: "format.json" },
      { format: "whisperx", labelKey: "format.whisperx" }
    ], s = E(
      () => e.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), o = e.speakers.all, a = E(() => e.title.value), l = E(() => e.date.value), c = E(() => e.activeChannel.value?.duration ?? 0), u = E(() => o.size), d = E(
      () => l.value != null ? Yd(l.value, r.value) : ""
    ), f = E(
      () => Zd(c.value, r.value)
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
      e.emit("verbatim:export", { format: v });
    }
    return (v, w) => (T(), L("section", FT, [
      q(tm, {
        "meta-label": k(t)("verbatim.title"),
        formats: i,
        onExport: b
      }, {
        default: $(() => [
          V("header", VT, [
            V("h1", qT, K(a.value), 1),
            p.value.length ? (T(), L("p", UT, [
              (T(!0), L(De, null, ht(p.value, (S, M) => (T(), L("span", {
                key: M,
                class: "verbatim-panel__subtitle-part"
              }, K(S), 1))), 128))
            ])) : j("", !0)
          ]),
          V("ul", WT, [
            (T(!0), L(De, null, ht(s.value, (S) => (T(), L("li", {
              key: S.id,
              class: "verbatim-panel__turn"
            }, [
              V("div", jT, [
                S.speakerId ? (T(), I(Ps, {
                  key: 0,
                  color: g(S.speakerId) ?? "#888"
                }, null, 8, ["color"])) : j("", !0),
                V("span", HT, K(m(S.speakerId)), 1)
              ]),
              V("p", KT, K(y(S)), 1)
            ]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["meta-label"])
    ]));
  }
}), XT = /* @__PURE__ */ te(JT, [["__scopeId", "data-v-e94087f0"]]);
function Ul() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Bn = Ul();
function nm(n) {
  Bn = n;
}
var dn = { exec: () => null };
function ee(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (i, s) => {
    let o = typeof s == "string" ? s : s.source;
    return o = o.replace(Ie.caret, "$1"), t = t.replace(i, o), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var GT = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), Ie = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}#`), htmlBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}<(?:[a-z].*>|!--)`, "i"), blockquoteBeginRegex: (n) => new RegExp(`^ {0,${Math.min(3, n - 1)}}>`) }, YT = /^(?:[ \t]*(?:\n|$))+/, ZT = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, QT = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, vi = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, eE = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Wl = / {0,3}(?:[*+-]|\d{1,9}[.)])/, rm = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, im = ee(rm).replace(/bull/g, Wl).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), tE = ee(rm).replace(/bull/g, Wl).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), jl = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, nE = /^[^\n]+/, Hl = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, rE = ee(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Hl).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), iE = ee(/^(bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Wl).getRegex(), Ys = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Kl = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, sE = ee("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Kl).replace("tag", Ys).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), sm = ee(jl).replace("hr", vi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ys).getRegex(), oE = ee(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", sm).getRegex(), Jl = { blockquote: oE, code: ZT, def: rE, fences: QT, heading: eE, hr: vi, html: sE, lheading: im, list: iE, newline: YT, paragraph: sm, table: dn, text: nE }, Zu = ee("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", vi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ys).getRegex(), aE = { ...Jl, lheading: tE, table: Zu, paragraph: ee(jl).replace("hr", vi).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Zu).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ys).getRegex() }, lE = { ...Jl, html: ee(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Kl).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: dn, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ee(jl).replace("hr", vi).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", im).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, cE = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, uE = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, om = /^( {2,}|\\)\n(?!\s*$)/, dE = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, gr = /[\p{P}\p{S}]/u, Zs = /[\s\p{P}\p{S}]/u, Xl = /[^\s\p{P}\p{S}]/u, fE = ee(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Zs).getRegex(), am = /(?!~)[\p{P}\p{S}]/u, hE = /(?!~)[\s\p{P}\p{S}]/u, pE = /(?:[^\s\p{P}\p{S}]|~)/u, mE = ee(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", GT ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), lm = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, gE = ee(lm, "u").replace(/punct/g, gr).getRegex(), yE = ee(lm, "u").replace(/punct/g, am).getRegex(), cm = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", vE = ee(cm, "gu").replace(/notPunctSpace/g, Xl).replace(/punctSpace/g, Zs).replace(/punct/g, gr).getRegex(), bE = ee(cm, "gu").replace(/notPunctSpace/g, pE).replace(/punctSpace/g, hE).replace(/punct/g, am).getRegex(), kE = ee("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Xl).replace(/punctSpace/g, Zs).replace(/punct/g, gr).getRegex(), wE = ee(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, gr).getRegex(), xE = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", SE = ee(xE, "gu").replace(/notPunctSpace/g, Xl).replace(/punctSpace/g, Zs).replace(/punct/g, gr).getRegex(), CE = ee(/\\(punct)/, "gu").replace(/punct/g, gr).getRegex(), TE = ee(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), EE = ee(Kl).replace("(?:-->|$)", "-->").getRegex(), ME = ee("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", EE).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ks = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, AE = ee(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", ks).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), um = ee(/^!?\[(label)\]\[(ref)\]/).replace("label", ks).replace("ref", Hl).getRegex(), dm = ee(/^!?\[(ref)\](?:\[\])?/).replace("ref", Hl).getRegex(), OE = ee("reflink|nolink(?!\\()", "g").replace("reflink", um).replace("nolink", dm).getRegex(), Qu = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Gl = { _backpedal: dn, anyPunctuation: CE, autolink: TE, blockSkip: mE, br: om, code: uE, del: dn, delLDelim: dn, delRDelim: dn, emStrongLDelim: gE, emStrongRDelimAst: vE, emStrongRDelimUnd: kE, escape: cE, link: AE, nolink: dm, punctuation: fE, reflink: um, reflinkSearch: OE, tag: ME, text: dE, url: dn }, DE = { ...Gl, link: ee(/^!?\[(label)\]\((.*?)\)/).replace("label", ks).getRegex(), reflink: ee(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ks).getRegex() }, Pa = { ...Gl, emStrongRDelimAst: bE, emStrongLDelim: yE, delLDelim: wE, delRDelim: SE, url: ee(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Qu).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ee(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Qu).getRegex() }, _E = { ...Pa, br: ee(om).replace("{2,}", "*").getRegex(), text: ee(Pa.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Ii = { normal: Jl, gfm: aE, pedantic: lE }, xr = { normal: Gl, gfm: Pa, breaks: _E, pedantic: DE }, PE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ed = (n) => PE[n];
function vt(n, e) {
  if (e) {
    if (Ie.escapeTest.test(n)) return n.replace(Ie.escapeReplace, ed);
  } else if (Ie.escapeTestNoEncode.test(n)) return n.replace(Ie.escapeReplaceNoEncode, ed);
  return n;
}
function td(n) {
  try {
    n = encodeURI(n).replace(Ie.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function nd(n, e) {
  let t = n.replace(Ie.findPipe, (s, o, a) => {
    let l = !1, c = o;
    for (; --c >= 0 && a[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), r = t.split(Ie.splitPipe), i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; i < r.length; i++) r[i] = r[i].trim().replace(Ie.slashPipe, "|");
  return r;
}
function Ft(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function rd(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && Ie.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function RE(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function IE(n, e = 0) {
  let t = e, r = "";
  for (let i of n) if (i === "	") {
    let s = 4 - t % 4;
    r += " ".repeat(s), t += s;
  } else r += i, t++;
  return r;
}
function id(n, e, t, r, i) {
  let s = e.href, o = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let l = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: s, title: o, text: a, tokens: r.inlineTokens(a) };
  return r.state.inLink = !1, l;
}
function NE(n, e, t) {
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
var ws = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Bn;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let r = this.options.pedantic ? t[0] : rd(t[0]), i = r.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r, codeBlockStyle: "indented", text: i };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let r = t[0], i = NE(r, t[3] || "", this.rules);
      return { type: "code", raw: r, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let r = t[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = Ft(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: Ft(t[0], `
`), depth: t[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Ft(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let r = Ft(t[0], `
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
        let f = IE(t[2].split(`
`, 1)[0], t[1].length), h = e.split(`
`, 1)[0], p = !f.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, d = f.trimStart()) : p ? m = t[1].length + 1 : (m = f.search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, d = f.slice(m), m += t[1].length), p && this.rules.other.blankLine.test(h) && (u += h + `
`, e = e.substring(h.length + 1), c = !0), !c) {
          let g = this.rules.other.nextBulletRegex(m), y = this.rules.other.hrRegex(m), b = this.rules.other.fencesBeginRegex(m), v = this.rules.other.headingBeginRegex(m), w = this.rules.other.htmlBeginRegex(m), S = this.rules.other.blockquoteBeginRegex(m);
          for (; e; ) {
            let M = e.split(`
`, 1)[0], x;
            if (h = M, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), x = h) : x = h.replace(this.rules.other.tabCharGlobal, "    "), b.test(h) || v.test(h) || w.test(h) || S.test(h) || g.test(h) || y.test(h)) break;
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
      let r = rd(t[0]);
      return { type: "html", block: !0, raw: r, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: r };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let r = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: r, raw: Ft(t[0], `
`), href: i, title: s };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let r = nd(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: Ft(t[0], `
`), header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? o.align.push("left") : o.align.push(null);
      for (let a = 0; a < r.length; a++) o.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: o.align[a] });
      for (let a of s) o.rows.push(nd(a, o.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: o.align[c] })));
      return o;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let r = t[1].trim();
      return { type: "heading", raw: Ft(t[0], `
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
        let o = Ft(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = RE(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), id(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return id(r, s, r[0], this.lexer, this.rules);
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
}, ut = class Ra {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Bn, this.options.tokenizer = this.options.tokenizer || new ws(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: Ie, block: Ii.normal, inline: xr.normal };
    this.options.pedantic ? (t.block = Ii.pedantic, t.inline = xr.pedantic) : this.options.gfm && (t.block = Ii.gfm, this.options.breaks ? t.inline = xr.breaks : t.inline = xr.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: Ii, inline: xr };
  }
  static lex(e, t) {
    return new Ra(t).lex(e);
  }
  static lexInline(e, t) {
    return new Ra(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Ie.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(Ie.tabCharGlobal, "    ").replace(Ie.spaceLine, ""));
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
}, xs = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Bn;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: r }) {
    let i = (t || "").match(Ie.notSpaceStart)?.[0], s = e.replace(Ie.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + vt(i) + '">' + (r ? s : vt(s, !0)) + `</code></pre>
` : "<pre><code>" + (r ? s : vt(s, !0)) + `</code></pre>
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
    return `<code>${vt(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: r }) {
    let i = this.parser.parseInline(r), s = td(e);
    if (s === null) return i;
    e = s;
    let o = '<a href="' + e + '"';
    return t && (o += ' title="' + vt(t) + '"'), o += ">" + i + "</a>", o;
  }
  image({ href: e, title: t, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let s = td(e);
    if (s === null) return vt(r);
    e = s;
    let o = `<img src="${e}" alt="${vt(r)}"`;
    return t && (o += ` title="${vt(t)}"`), o += ">", o;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : vt(e.text);
  }
}, Yl = class {
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
}, dt = class Ia {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Bn, this.options.renderer = this.options.renderer || new xs(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Yl();
  }
  static parse(e, t) {
    return new Ia(t).parse(e);
  }
  static parseInline(e, t) {
    return new Ia(t).parseInline(e);
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
}, Mr = class {
  options;
  block;
  constructor(n) {
    this.options = n || Bn;
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
    return n ? ut.lex : ut.lexInline;
  }
  provideParser(n = this.block) {
    return n ? dt.parse : dt.parseInline;
  }
}, $E = class {
  defaults = Ul();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = dt;
  Renderer = xs;
  TextRenderer = Yl;
  Lexer = ut;
  Tokenizer = ws;
  Hooks = Mr;
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
        let i = this.defaults.renderer || new xs(this.defaults);
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
        let i = this.defaults.tokenizer || new ws(this.defaults);
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
        let i = this.defaults.hooks || new Mr();
        for (let s in t.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o = s, a = t.hooks[o], l = i[o];
          Mr.passThroughHooks.has(s) ? i[o] = (c) => {
            if (this.defaults.async && Mr.passThroughHooksRespectAsync.has(s)) return (async () => {
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
    return ut.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return dt.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, i = { ...this.defaults, ...r }, s = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = n), i.async) return (async () => {
        let o = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(n) : n ? ut.lex : ut.lexInline)(o, i), l = i.hooks ? await i.hooks.processAllTokens(a) : a;
        i.walkTokens && await Promise.all(this.walkTokens(l, i.walkTokens));
        let c = await (i.hooks ? await i.hooks.provideParser(n) : n ? dt.parse : dt.parseInline)(l, i);
        return i.hooks ? await i.hooks.postprocess(c) : c;
      })().catch(s);
      try {
        i.hooks && (e = i.hooks.preprocess(e));
        let o = (i.hooks ? i.hooks.provideLexer(n) : n ? ut.lex : ut.lexInline)(e, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let a = (i.hooks ? i.hooks.provideParser(n) : n ? dt.parse : dt.parseInline)(o, i);
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
        let r = "<p>An error occurred:</p><pre>" + vt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Dn = new $E();
function re(n, e) {
  return Dn.parse(n, e);
}
re.options = re.setOptions = function(n) {
  return Dn.setOptions(n), re.defaults = Dn.defaults, nm(re.defaults), re;
};
re.getDefaults = Ul;
re.defaults = Bn;
re.use = function(...n) {
  return Dn.use(...n), re.defaults = Dn.defaults, nm(re.defaults), re;
};
re.walkTokens = function(n, e) {
  return Dn.walkTokens(n, e);
};
re.parseInline = Dn.parseInline;
re.Parser = dt;
re.parser = dt.parse;
re.Renderer = xs;
re.TextRenderer = Yl;
re.Lexer = ut;
re.lexer = ut.lex;
re.Tokenizer = ws;
re.Hooks = Mr;
re.parse = re;
re.options;
re.setOptions;
re.use;
re.walkTokens;
re.parseInline;
dt.parse;
ut.lex;
const BE = ["innerHTML"], LE = /* @__PURE__ */ B({
  __name: "MarkdownView",
  props: {
    source: {}
  },
  setup(n) {
    const e = n, t = E(() => e.source ? re.parse(e.source, { async: !1 }) : "");
    return (r, i) => (T(), L("div", {
      class: "markdown-view",
      innerHTML: t.value
    }, null, 8, BE));
  }
}), zE = /* @__PURE__ */ te(LE, [["__scopeId", "data-v-d5b7846c"]]), FE = { class: "llm-service-panel" }, VE = {
  key: 1,
  class: "llm-service-panel__placeholder"
}, qE = /* @__PURE__ */ B({
  __name: "LLMServicePanel",
  props: {
    service: {}
  },
  setup(n) {
    const e = n, t = qe(), { t: r, locale: i } = he(), s = [
      { format: "docx", labelKey: "format.docx" },
      { format: "pdf", labelKey: "format.pdf" }
    ], o = E(() => {
      const f = e.service.status.value;
      return f === "queued" || f === "processing" ? "processing" : f === "error" ? "error" : "done";
    }), a = E(() => {
      const f = e.service.status.value;
      if (f === "error")
        return e.service.error.value || r("llmService.error");
      if (f === "queued") return r("llmService.queued");
      if (f === "processing") return r("llmService.processing");
      const h = e.service.lastUpdate.value;
      if (h != null) {
        const p = sy(h, i.value);
        return `${r("llmService.generated")} · ${p}`;
      }
      return r("llmService.generated");
    }), l = E(() => {
      if (o.value !== "processing") return;
      const f = e.service.progress.value;
      return f > 0 ? f : void 0;
    }), c = E(() => e.service.content.value);
    function u() {
      t.emit("llmService:regenerate", { id: e.service.id });
    }
    function d(f) {
      t.emit("llmService:export", { id: e.service.id, format: f });
    }
    return (f, h) => (T(), L("section", FE, [
      q(tm, {
        "meta-label": a.value,
        "meta-icon": "sparkles",
        "meta-progress": l.value,
        status: o.value,
        "show-regenerate": "",
        formats: s,
        onRegenerate: u,
        onExport: d
      }, {
        default: $(() => [
          c.value ? (T(), I(zE, {
            key: 0,
            source: c.value
          }, null, 8, ["source"])) : (T(), L("div", VE, [
            V("p", null, K(k(r)("llmService.empty")), 1)
          ]))
        ]),
        _: 1
      }, 8, ["meta-label", "meta-progress", "status"])
    ]));
  }
}), UE = /* @__PURE__ */ te(qE, [["__scopeId", "data-v-a3e4e27e"]]), WE = { class: "switch" }, jE = ["id", "checked"], HE = ["for"], KE = /* @__PURE__ */ B({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? Jd();
    return (s, o) => (T(), L("div", WE, [
      V("input", {
        type: "checkbox",
        id: k(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, jE),
      V("label", { for: k(i) }, [...o[1] || (o[1] = [
        V("div", { class: "switch-slider" }, null, -1)
      ])], 8, HE)
    ]));
  }
}), zo = /* @__PURE__ */ te(KE, [["__scopeId", "data-v-2aa0332f"]]), JE = {
  key: 0,
  class: "form-field__header"
}, XE = ["for"], GE = {
  key: 0,
  class: "form-field__required",
  "aria-hidden": "true"
}, YE = { class: "form-field__input-wrapper" }, ZE = ["id", "disabled", "required", "aria-required", "aria-invalid", "aria-describedby"], QE = ["value"], eM = ["type", "id", "disabled", "readonly", "placeholder", "autocomplete", "required", "aria-required", "aria-invalid", "aria-describedby"], tM = {
  key: 3,
  class: "form-field__actions"
}, nM = {
  key: 4,
  class: "form-field__actions form-field__actions--placeholder",
  "aria-hidden": "true"
}, rM = ["id"], iM = { class: "form-field__error" }, sM = /* @__PURE__ */ B({
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
    const r = n, i = t, { t: s } = he(), o = Jd(), a = E(() => r.inputId ?? o), l = It("input"), c = r.modelValue ?? r.field.value ?? "", u = _(c), d = _(c), f = E(() => r.disabled ?? r.field.disabled ?? !1), h = E(() => r.field.required ?? !1), p = E(() => r.field.error ?? null), m = E(() => !!p.value), g = E(() => r.field.type ?? "text"), y = E(() => r.field.placeholder ?? void 0), b = E(() => r.field.autocomplete ?? void 0), v = E(() => u.value !== d.value), w = E(
      () => r.withConfirmation && v.value
    ), S = E(() => ({
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
    Y(
      () => r.modelValue,
      (D) => {
        D !== void 0 && D !== u.value && (u.value = D, d.value = D);
      }
    ), Y(
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
    function C() {
      v.value && (u.value = d.value), i("on-cancel");
    }
    function O(D) {
      i("keydown", D), !(!r.withConfirmation || D.defaultPrevented) && (D.key === "Enter" && v.value ? (D.preventDefault(), A()) : D.key === "Escape" && (D.preventDefault(), C()));
    }
    return _e(() => {
      r.focus && l.value?.focus();
    }), e({
      focus: () => l.value?.focus(),
      blur: () => l.value?.blur(),
      select: () => l.value?.select()
    }), (D, R) => (T(), L("div", {
      class: ct(S.value)
    }, [
      n.field.label ? (T(), L("div", JE, [
        V("label", {
          class: "form-field__label",
          for: a.value
        }, [
          be(K(n.field.label) + " ", 1),
          h.value ? (T(), L("span", GE, "*")) : j("", !0)
        ], 8, XE),
        J(D.$slots, "content-after-label", {}, void 0, !0)
      ])) : j("", !0),
      V("div", YE, [
        J(D.$slots, "default", {}, void 0, !0),
        D.$slots["custom-input"] ? J(D.$slots, "custom-input", {
          key: 0,
          id: a.value,
          disabled: f.value
        }, void 0, !0) : n.select ? Go((T(), L("select", le({
          key: 1,
          ref: "input",
          "onUpdate:modelValue": R[0] || (R[0] = (z) => u.value = z),
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
          onBlur: R[1] || (R[1] = (z) => i("blur", z)),
          onFocus: R[2] || (R[2] = (z) => i("focus", z))
        }), [
          (T(!0), L(De, null, ht(n.options, (z) => (T(), L("option", {
            key: z.value,
            value: z.value
          }, K(z.label), 9, QE))), 128))
        ], 16, ZE)), [
          [Ig, u.value]
        ]) : Go((T(), L("input", le({
          key: 2,
          ref: "input",
          "onUpdate:modelValue": R[3] || (R[3] = (z) => u.value = z),
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
          onBlur: R[4] || (R[4] = (z) => i("blur", z)),
          onFocus: R[5] || (R[5] = (z) => i("focus", z))
        }), null, 16, eM)), [
          [Ng, u.value]
        ]),
        w.value ? (T(), L("div", tM, [
          q(ve, {
            icon: "x",
            variant: "tertiary",
            size: n.size,
            "aria-label": k(s)("form.cancel"),
            onMousedown: R[6] || (R[6] = Qt(() => {
            }, ["prevent"])),
            onClick: C
          }, null, 8, ["size", "aria-label"]),
          q(ve, {
            icon: "check",
            variant: "primary",
            size: n.size,
            "aria-label": k(s)("form.apply"),
            onMousedown: R[7] || (R[7] = Qt(() => {
            }, ["prevent"])),
            onClick: A
          }, null, 8, ["size", "aria-label"])
        ])) : n.withConfirmation ? (T(), L("div", nM)) : j("", !0),
        J(D.$slots, "content-after-input", {}, void 0, !0)
      ]),
      J(D.$slots, "content-bottom-input", {}, void 0, !0),
      m.value ? (T(), L("div", {
        key: 1,
        id: `${a.value}-error`,
        class: "form-field__info"
      }, [
        V("span", iM, K(p.value), 1)
      ], 8, rM)) : j("", !0)
    ], 2));
  }
}), bi = /* @__PURE__ */ te(sM, [["__scopeId", "data-v-31189879"]]), oM = ["disabled", "aria-label"], aM = /* @__PURE__ */ B({
  __name: "EditableText",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue", "commit", "cancel"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = _(!1), s = _(t.modelValue), o = It("input"), a = E(() => ({
      placeholder: t.placeholder,
      customParams: t.ariaLabel ? { "aria-label": t.ariaLabel } : void 0
    }));
    Y(
      () => t.modelValue,
      (f) => {
        i.value || (s.value = f);
      }
    );
    async function l() {
      t.disabled || (s.value = t.modelValue, i.value = !0, await ke(), o.value?.focus(), o.value?.select());
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
    return (f, h) => i.value ? (T(), I(bi, {
      key: 0,
      ref: "input",
      modelValue: s.value,
      "onUpdate:modelValue": h[0] || (h[0] = (p) => s.value = p),
      field: a.value,
      size: "sm",
      "full-width": "",
      onKeydown: d,
      onBlur: c
    }, null, 8, ["modelValue", "field"])) : (T(), L("button", {
      key: 1,
      type: "button",
      class: "editable-text-display",
      disabled: n.disabled,
      "aria-label": n.ariaLabel,
      onClick: l
    }, K(n.modelValue || n.placeholder), 9, oM));
  }
}), lM = /* @__PURE__ */ te(aM, [["__scopeId", "data-v-511d4fb4"]]), cM = /* @__PURE__ */ B({
  __name: "SpeakerMenu",
  emits: ["merge"],
  setup(n, { emit: e }) {
    const t = e, { t: r } = he(), i = E(() => [
      { id: "merge", label: r("speakerMenu.merge") }
    ]);
    function s(o) {
      o.id === "merge" && t("merge");
    }
    return (o, a) => (T(), I(ql, {
      items: i.value,
      "item-key": (l) => l.id,
      align: "end",
      onSelect: s
    }, {
      trigger: $(() => [
        q(ve, {
          icon: "more-vertical",
          variant: "transparent",
          "aria-label": k(r)("speakerMenu.openMenu")
        }, null, 8, ["aria-label"])
      ]),
      item: $(({ item: l }) => [
        V("span", null, K(l.label), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
});
function uM(n) {
  const e = n.speakers.all.size;
  return tr[e % tr.length];
}
function fm(n, e) {
  let t = null;
  return n.state.doc.descendants((r, i) => {
    if (t !== null) return !1;
    if (r.type.name === "turn" && r.attrs.id === e)
      return t = i, !1;
  }), t;
}
function hm(n, e) {
  const t = [];
  return n.state.doc.descendants((r, i) => {
    r.type.name === "turn" && r.attrs.speakerId === e && t.push({ pos: i, turnId: r.attrs.id, attrs: { ...r.attrs } });
  }), t;
}
function dM(n, e) {
  return hm(n, e).length;
}
function fM(n, e, t) {
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
function hM(n, e, t) {
  const r = n.transcriptionEditor?.tiptapEditor.value;
  if (!r) return;
  const i = fm(r, e);
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
function pM(n, e, t) {
  const r = t.trim();
  if (!r) return null;
  const i = n.transcriptionEditor?.tiptapEditor.value, s = n.transcriptionEditor?.speakersMap, o = n.transcriptionEditor?.doc;
  if (!i || !s || !o) return null;
  const a = fm(i, e);
  if (a === null) return null;
  const l = crypto.randomUUID(), c = uM(n), u = {
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
function mM(n, e, t) {
  if (e === t) return;
  const r = n.transcriptionEditor?.tiptapEditor.value, i = n.transcriptionEditor?.speakersMap, s = n.transcriptionEditor?.doc;
  if (!r || !i || !s || !i.has(e) || !i.has(t)) return;
  const o = hm(r, e), a = {
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
const gM = { class: "merge-dialog-title" }, yM = { class: "merge-dialog-description" }, vM = { class: "merge-dialog-actions" }, bM = /* @__PURE__ */ B({
  __name: "MergeDialog",
  props: {
    open: { type: Boolean },
    fromSpeakerId: {}
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = qe(), { t: s } = he(), o = It("dialog"), a = _(""), l = E(
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
      return !m || !t.fromSpeakerId ? 0 : dM(m, t.fromSpeakerId);
    });
    Y(
      () => t.open,
      (m) => {
        m ? (a.value = c.value[0]?.id ?? "", o.value?.showModal()) : o.value?.close();
      }
    );
    function h() {
      r("update:open", !1);
    }
    function p() {
      !t.fromSpeakerId || !a.value || (mM(i, t.fromSpeakerId, a.value), r("update:open", !1));
    }
    return (m, g) => (T(), L("dialog", {
      ref: "dialog",
      class: "merge-dialog",
      onClose: h,
      onCancel: Qt(h, ["prevent"])
    }, [
      l.value ? (T(), L("form", {
        key: 0,
        class: "merge-dialog-form",
        onSubmit: Qt(p, ["prevent"])
      }, [
        V("h2", gM, K(k(s)("mergeDialog.title")), 1),
        V("p", yM, [
          V("strong", null, K(l.value.name), 1),
          be(" · " + K(f.value) + " " + K(k(s)("mergeDialog.turnsAffected")), 1)
        ]),
        q(bi, {
          select: "",
          field: d.value,
          options: u.value,
          modelValue: a.value,
          "onUpdate:modelValue": g[0] || (g[0] = (y) => a.value = y)
        }, null, 8, ["field", "options", "modelValue"]),
        V("div", vM, [
          q(ve, {
            variant: "tertiary",
            type: "button",
            onClick: h
          }, {
            default: $(() => [
              be(K(k(s)("mergeDialog.cancel")), 1)
            ]),
            _: 1
          }),
          q(ve, {
            variant: "primary",
            type: "submit",
            disabled: !a.value
          }, {
            default: $(() => [
              be(K(k(s)("mergeDialog.confirm")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : j("", !0)
    ], 544));
  }
}), kM = /* @__PURE__ */ te(bM, [["__scopeId", "data-v-be330083"]]), pm = /* @__PURE__ */ B({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = he(), s = E(
      () => t.channels.map((a) => ({ value: a.id, label: a.name }))
    ), o = E(() => ({ label: i("sidebar.channelSelectLabel") }));
    return (a, l) => (T(), I(bi, {
      select: "",
      field: o.value,
      options: s.value,
      "model-value": n.selectedChannelId,
      "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedChannelId", c))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), mm = /* @__PURE__ */ B({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = he(), o = E(
      () => ny(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    ), a = E(() => ({ label: i("sidebar.translationSelectLabel") }));
    return (l, c) => (T(), I(bi, {
      select: "",
      field: a.value,
      options: o.value,
      "model-value": n.selectedTranslationId,
      "onUpdate:modelValue": c[0] || (c[0] = (u) => r("update:selectedTranslationId", u))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), wM = { class: "speaker-sidebar" }, xM = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, SM = { class: "sidebar-title" }, CM = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, TM = { class: "sidebar-title" }, EM = {
  key: 2,
  class: "sidebar-section"
}, MM = { class: "sidebar-title" }, AM = { class: "subtitle-toggle" }, OM = { class: "subtitle-toggle-label" }, DM = { class: "subtitle-slider" }, _M = { class: "subtitle-slider-label" }, PM = { class: "subtitle-slider-value" }, RM = ["value", "disabled"], IM = {
  key: 0,
  class: "subtitle-toggle"
}, NM = { class: "subtitle-toggle-label" }, $M = {
  key: 1,
  class: "subtitle-toggle"
}, BM = { class: "subtitle-toggle-label" }, LM = {
  key: 3,
  class: "sidebar-section"
}, zM = { class: "sidebar-title" }, FM = { class: "speaker-list" }, VM = /* @__PURE__ */ B({
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
    const e = qe(), { t } = he(), r = E(() => e.capabilities.value.speakers === "edit"), i = _(!1), s = _(null);
    function o(l, c) {
      fM(e, l, c);
    }
    function a(l) {
      s.value = l, i.value = !0;
    }
    return (l, c) => (T(), L("aside", wM, [
      n.channels.length > 1 ? (T(), L("section", xM, [
        V("h2", SM, K(k(t)("sidebar.channel")), 1),
        q(pm, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": c[0] || (c[0] = (u) => l.$emit("update:selectedChannelId", u))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : j("", !0),
      n.translations.length > 1 ? (T(), L("section", CM, [
        V("h2", TM, K(k(t)("sidebar.translation")), 1),
        q(mm, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": c[1] || (c[1] = (u) => l.$emit("update:selectedTranslationId", u))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : j("", !0),
      k(e).subtitle ? (T(), L("section", EM, [
        V("h2", MM, K(k(t)("sidebar.subtitle")), 1),
        V("div", AM, [
          V("span", OM, K(k(t)("subtitle.show")), 1),
          q(zo, {
            modelValue: k(e).subtitle.isVisible.value,
            "onUpdate:modelValue": c[2] || (c[2] = (u) => k(e).subtitle.isVisible.value = u)
          }, null, 8, ["modelValue"])
        ]),
        V("label", DM, [
          V("span", _M, [
            be(K(k(t)("subtitle.fontSize")) + " ", 1),
            V("span", PM, K(k(e).subtitle.fontSize.value) + "px", 1)
          ]),
          V("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: k(e).subtitle.fontSize.value,
            disabled: !k(e).subtitle.isVisible.value,
            onInput: c[3] || (c[3] = (u) => k(e).subtitle.fontSize.value = Number(u.target.value))
          }, null, 40, RM)
        ]),
        k(e).subtitle.watermark && !k(e).subtitle.watermark.readonly ? (T(), L("div", IM, [
          V("span", NM, K(k(t)("subtitle.showWatermark")), 1),
          q(zo, {
            modelValue: k(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": c[4] || (c[4] = (u) => k(e).subtitle.watermark.display.value = u),
            disabled: !k(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : j("", !0),
        k(e).subtitle.watermark && !k(e).subtitle.watermark.readonly && k(e).subtitle.watermark.display.value ? (T(), L("div", $M, [
          V("span", BM, K(k(t)("subtitle.pinWatermark")), 1),
          q(zo, {
            modelValue: k(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": c[5] || (c[5] = (u) => k(e).subtitle.watermark.pinned.value = u),
            disabled: !k(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : j("", !0)
      ])) : j("", !0),
      n.speakers.length ? (T(), L("section", LM, [
        V("h2", zM, K(k(t)("sidebar.speakers")), 1),
        V("ul", FM, [
          (T(!0), L(De, null, ht(n.speakers, (u) => (T(), L("li", {
            key: u.id,
            class: "speaker-item"
          }, [
            q(Ps, {
              color: u.color
            }, null, 8, ["color"]),
            q(lM, {
              class: "speaker-name",
              "model-value": u.name,
              disabled: !r.value,
              "aria-label": k(t)("sidebar.renameSpeaker"),
              onCommit: (d) => o(u.id, d)
            }, null, 8, ["model-value", "disabled", "aria-label", "onCommit"]),
            r.value && n.speakers.length > 1 ? (T(), I(cM, {
              key: 0,
              "speaker-name": u.name,
              onMerge: (d) => a(u.id)
            }, null, 8, ["speaker-name", "onMerge"])) : j("", !0)
          ]))), 128))
        ])
      ])) : j("", !0),
      r.value ? (T(), I(kM, {
        key: 4,
        open: i.value,
        "onUpdate:open": c[6] || (c[6] = (u) => i.value = u),
        "from-speaker-id": s.value
      }, null, 8, ["open", "from-speaker-id"])) : j("", !0)
    ]));
  }
}), sd = /* @__PURE__ */ te(VM, [["__scopeId", "data-v-6ea39002"]]), qM = /* @__PURE__ */ B({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = $g(n, "open"), { t } = he();
    return (r, i) => (T(), I(k(Uv), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: $(() => [
        q(k(Eb), { disabled: "" }, {
          default: $(() => [
            q(k(Sb), { class: "editor-overlay" }),
            q(k(bb), { class: "sidebar-drawer" }, {
              default: $(() => [
                q(k(Ab), { class: "sr-only" }, {
                  default: $(() => [
                    be(K(k(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(k(jv), {
                  class: "sidebar-close",
                  "aria-label": k(t)("header.closeSidebar")
                }, {
                  default: $(() => [
                    q(k(Qa), { size: 20 })
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
}), UM = { class: "player-controls" }, WM = { class: "controls-left" }, jM = { class: "controls-time" }, HM = { class: "time-display" }, KM = { class: "time-display" }, JM = { class: "controls-right" }, XM = ["value", "aria-label", "disabled"], GM = /* @__PURE__ */ B({
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
    const t = e, { t: r } = he(), i = _(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (T(), L("div", UM, [
      V("div", WM, [
        q(ve, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": k(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: $(() => [
            q(k(of), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(ve, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? k(r)("player.pause") : k(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: $(() => [
            n.isPlaying ? (T(), I(k(rf), {
              key: 0,
              size: 20
            })) : (T(), I(k(sf), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(ve, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": k(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: $(() => [
            q(k(af), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      V("div", jM, [
        V("time", HM, K(n.currentTime), 1),
        a[7] || (a[7] = V("span", { class: "time-separator" }, "/", -1)),
        V("time", KM, K(n.duration), 1)
      ]),
      V("div", JM, [
        V("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          q(ve, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? k(r)("player.unmute") : k(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: $(() => [
              n.isMuted ? (T(), I(k(df), {
                key: 0,
                size: 16
              })) : (T(), I(k(uf), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Go(V("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": k(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, XM), [
            [Bg, i.value]
          ])
        ], 32),
        q(ve, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": k(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: $(() => [
            be(K(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), YM = /* @__PURE__ */ te(GM, [["__scopeId", "data-v-99f700b1"]]);
function ze(n, e, t, r) {
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
let ki = class {
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
const Ni = { decode: function(n, e) {
  return ze(this, void 0, void 0, (function* () {
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
function gm(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(gm(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function od(n, e, t) {
  const r = gm(n, e || {});
  return t?.appendChild(r), r;
}
var ZM = Object.freeze({ __proto__: null, createElement: od, default: od });
const QM = { fetchBlob: function(n, e, t) {
  return ze(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      ze(this, void 0, void 0, (function* () {
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
function fn(n, e) {
  const t = fe(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Wt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class eA extends ki {
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
    return ze(this, void 0, void 0, (function* () {
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
function tA({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function nA({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function ad(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function ym(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function ld(n, e) {
  if (!ym(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function cd({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function vm(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function rA(n) {
  const e = fe({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = fn((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = fn((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), vm(e);
  } };
}
class iA extends ki {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = ad(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = ad(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = rA(this.scrollContainer);
    const e = Wt((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = fe(null), l = /* @__PURE__ */ new Map(), c = matchMedia("(pointer: coarse)").matches;
      let u = () => {
      };
      const d = (f) => {
        if (f.button !== s || (l.set(f.pointerId, f), l.size > 1)) return;
        let h = f.clientX, p = f.clientY, m = !1;
        const g = Date.now(), y = t.getBoundingClientRect(), { left: b, top: v } = y, w = (C) => {
          if (C.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const O = C.clientX, D = C.clientY, R = O - h, z = D - p;
          (m || Math.abs(R) > i || Math.abs(z) > i) && (C.preventDefault(), C.stopPropagation(), m || (a.set({ type: "start", x: h - b, y: p - v }), m = !0), a.set({ type: "move", x: O - b, y: D - v, deltaX: R, deltaY: z }), h = O, p = D);
        }, S = (C) => {
          if (l.delete(C.pointerId), m) {
            const O = C.clientX, D = C.clientY;
            a.set({ type: "end", x: O - b, y: D - v });
          }
          u();
        }, M = (C) => {
          l.delete(C.pointerId), C.relatedTarget && C.relatedTarget !== document.documentElement || S(C);
        }, x = (C) => {
          m && (C.stopPropagation(), C.preventDefault());
        }, A = (C) => {
          C.defaultPrevented || l.size > 1 || m && C.preventDefault();
        };
        document.addEventListener("pointermove", w), document.addEventListener("pointerup", S), document.addEventListener("pointerout", M), document.addEventListener("pointercancel", M), document.addEventListener("touchmove", A, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", M), document.removeEventListener("pointercancel", M), document.removeEventListener("touchmove", A), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), l.clear(), vm(a);
      } };
    })(this.wrapper);
    const e = Wt((() => {
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
      const v = m / 2, w = y.barWidth ? y.barWidth * b : 1, S = y.barGap ? y.barGap * b : y.barWidth ? w / 2 : 0, M = w + S || 1;
      return { halfHeight: v, barWidth: w, barGap: S, barRadius: y.barRadius || 0, barMinHeight: y.barMinHeight ? y.barMinHeight * b : 0, barIndexScale: g > 0 ? p / M / g : 0, barSpacing: M };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: y, halfHeight: b, vScale: v, canvasHeight: w, barAlign: S, barMinHeight: M }) {
      const x = p[0] || [], A = p[1] || x, C = x.length, O = [];
      let D = 0, R = 0, z = 0;
      for (let N = 0; N <= C; N++) {
        const U = Math.round(N * m);
        if (U > D) {
          const { topHeight: ae, totalHeight: ge } = tA({ maxTop: R, maxBottom: z, halfHeight: b, vScale: v, barMinHeight: M, barAlign: S }), ln = nA({ barAlign: S, halfHeight: b, topHeight: ae, totalHeight: ge, canvasHeight: w });
          O.push({ x: D * g, y: ln, width: y, height: ge }), D = U, R = 0, z = 0;
        }
        const ne = Math.abs(x[N] || 0), Z = Math.abs(A[N] || 0);
        ne > R && (R = ne), Z > z && (z = Z);
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
        let S = 0, M = 0;
        for (let x = 0; x <= g; x++) {
          const A = Math.round(x * y);
          if (A > S) {
            const O = b + (Math.round(M * f * d) || 1) * v;
            w.push({ x: S, y: O }), S = A, M = 0;
          }
          const C = Math.abs(p[x] || 0);
          C > M && (M = C);
        }
        return w.push({ x: S, y: b }), w;
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
    ym(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
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
      return ld(Math.min(8e3, p, m), g);
    })({ clientWidth: l, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = ld(g, t), g <= 0) return;
      const y = (function({ channelData: b, offset: v, clampedWidth: w, totalWidth: S }) {
        return b.map(((M) => {
          const x = Math.floor(v / S * M.length), A = Math.floor((v + w) / S * M.length);
          return M.slice(x, A);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(y, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (cd({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), cd({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
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
    return ze(this, void 0, void 0, (function* () {
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
    return ze(this, void 0, void 0, (function* () {
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
class sA extends ki {
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
class Fo extends ki {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return ze(this, void 0, void 0, (function* () {
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
    return ze(this, void 0, void 0, (function* () {
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
    return ze(this, void 0, void 0, (function* () {
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
const oA = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Qr extends eA {
  static create(e) {
    return new Qr(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new Fo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, oA, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, h;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : fe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : fe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : fe(!1), y = (d = a?.isSeeking) !== null && d !== void 0 ? d : fe(!1), b = (f = a?.volume) !== null && f !== void 0 ? f : fe(1), v = (h = a?.playbackRate) !== null && h !== void 0 ? h : fe(1), w = fe(null), S = fe(null), M = fe(""), x = fe(0), A = fe(0), C = fn((() => !g.value), [g]), O = fn((() => w.value !== null), [w]), D = fn((() => O.value && m.value > 0), [O, m]), R = fn((() => p.value), [p]), z = fn((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: C, isSeeking: y, volume: b, playbackRate: v, audioBuffer: w, peaks: S, url: M, zoom: x, scrollPosition: A, canPlay: O, isReady: D, progress: R, progressPercent: z }, actions: { setCurrentTime: (N) => {
        const U = Math.max(0, Math.min(m.value || 1 / 0, N));
        p.set(U);
      }, setDuration: (N) => {
        m.set(Math.max(0, N));
      }, setPlaying: (N) => {
        g.set(N);
      }, setSeeking: (N) => {
        y.set(N);
      }, setVolume: (N) => {
        const U = Math.max(0, Math.min(1, N));
        b.set(U);
      }, setPlaybackRate: (N) => {
        const U = Math.max(0.1, Math.min(16, N));
        v.set(U);
      }, setAudioBuffer: (N) => {
        w.set(N), N && m.set(N.duration);
      }, setPeaks: (N) => {
        S.set(N);
      }, setUrl: (N) => {
        M.set(N);
      }, setZoom: (N) => {
        x.set(Math.max(0, N));
      }, setScrollPosition: (N) => {
        A.set(Math.max(0, N));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new sA();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new iA(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      r.push(Wt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Wt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Wt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Wt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Wt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, c = l > 0 && a >= l;
        s && !o && c && t.emit("finish"), s = o && c;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Wt((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Ni.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Ni.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return ze(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        t = yield QM.fetchBlob(e, l, a);
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
        a instanceof Fo && (a.duration = o);
      }
      if (r) this.decodedData = Ni.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Ni.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return ze(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return ze(this, void 0, void 0, (function* () {
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
    return ze(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof Fo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return ze(this, void 0, void 0, (function* () {
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
    return ze(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Qr.BasePlugin = class extends ki {
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
}, Qr.dom = ZM;
class bm {
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
class aA extends bm {
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
function km(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(km(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Ar(n, e, t) {
  const r = km(n, e || {});
  return t?.appendChild(r), r;
}
function wm(n) {
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
function Wi(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Un(n, e) {
  const t = wm(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function cn(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function ji(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = wm(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: y } = m, b = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - p < i) return;
      const A = x.clientX, C = x.clientY, O = A - d, D = C - f;
      (h || Math.abs(O) > t || Math.abs(D) > t) && (x.preventDefault(), x.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - y }), h = !0), s.set({ type: "move", x: A - g, y: C - y, deltaX: O, deltaY: D }), d = A, f = C);
    }, v = (x) => {
      if (o.delete(x.pointerId), h) {
        const A = x.clientX, C = x.clientY;
        s.set({ type: "end", x: A - g, y: C - y });
      }
      l();
    }, w = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || v(x);
    }, S = (x) => {
      h && (x.stopPropagation(), x.preventDefault());
    }, M = (x) => {
      x.defaultPrevented || o.size > 1 || h && x.preventDefault();
    };
    document.addEventListener("pointermove", b), document.addEventListener("pointerup", v), document.addEventListener("pointerout", w), document.addEventListener("pointercancel", w), document.addEventListener("touchmove", M, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", v), document.removeEventListener("pointerout", w), document.removeEventListener("pointercancel", w), document.removeEventListener("touchmove", M), setTimeout((() => {
        document.removeEventListener("click", S, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", c), o.clear(), cn(s);
  } };
}
class ud extends bm {
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Ar("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Ar("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = ji(r, { threshold: 1 }), o = ji(i, { threshold: 1 }), a = Wi((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Wi((() => {
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
    const i = Ar("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Un(e, "click"), r = Un(e, "mouseenter"), i = Un(e, "mouseleave"), s = Un(e, "dblclick"), o = Un(e, "pointerdown"), a = Un(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), h(), cn(t), cn(r), cn(i), cn(s), cn(o), cn(a);
    }));
    const p = ji(e), m = Wi((() => {
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
        this.content = Ar("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Zl extends aA {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Zl(e);
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
    return Ar("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new ud(e, i, s);
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
    const l = ji(i, { threshold: t }), c = Wi((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * h;
        const g = f.x / m * h, y = (f.x + 5) / m * h;
        s = new ud(Object.assign(Object.assign({}, e), { start: g, end: y }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const Vo = [0.5, 0.75, 1, 1.25, 1.5, 2];
function lA(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = Rt(null), o = Rt(null), a = _(0), l = _(0), c = _(!1), u = _(!1), d = _(!1), f = _(1), h = _(1), p = _(!1), m = E(() => Qi(a.value)), g = E(() => Qi(l.value));
  function y(N, U) {
    R(), d.value = !0, u.value = !1;
    const ne = Zl.create();
    o.value = ne;
    const Z = Qr.create({
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
      renderFunction: ay,
      url: U,
      plugins: [ne]
    });
    Z.on("ready", () => {
      u.value = !0, d.value = !1, l.value = Z.getDuration(), b();
    }), Z.on("timeupdate", (ae) => {
      a.value = ae;
    }), Z.on("play", () => {
      c.value = !0;
    }), Z.on("pause", () => {
      c.value = !1;
    }), Z.on("finish", () => {
      c.value = !1;
    }), s.value = Z;
  }
  function b() {
    const N = o.value;
    if (N) {
      N.clearRegions();
      for (const U of r.value) {
        const ne = U.speakerId ? i.value.get(U.speakerId) : void 0;
        if (!ne || U.startTime == null || U.endTime == null) continue;
        const Z = ne.color;
        N.addRegion({
          start: U.startTime,
          end: U.endTime,
          color: ty(Z, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Z);
      }
    }
  }
  function v() {
    s.value?.play();
  }
  function w() {
    s.value?.pause();
  }
  function S() {
    s.value?.playPause();
  }
  function M(N) {
    const U = s.value;
    !U || l.value === 0 || U.setTime(N);
  }
  function x(N) {
    M(Math.max(0, Math.min(a.value + N, l.value)));
  }
  function A(N) {
    const U = s.value;
    U && (f.value = N, U.setVolume(N), N > 0 && p.value && (p.value = !1, U.setMuted(!1)));
  }
  function C() {
    const N = s.value;
    N && (p.value = !p.value, N.setMuted(p.value));
  }
  function O(N) {
    const U = s.value;
    U && (h.value = N, U.setPlaybackRate(N));
  }
  function D() {
    const U = (Vo.indexOf(
      h.value
    ) + 1) % Vo.length;
    O(Vo[U] ?? 1);
  }
  function R() {
    z !== null && (clearTimeout(z), z = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  Y(
    [e, t],
    ([N, U]) => {
      N && U && y(N, U);
    },
    { immediate: !0 }
  );
  let z = null;
  return Y([r, i], () => {
    u.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, b();
    }, 150));
  }), Lt(() => {
    R();
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
    play: v,
    pause: w,
    togglePlay: S,
    seekTo: M,
    skip: x,
    setVolume: A,
    setPlaybackRate: O,
    cyclePlaybackRate: D,
    toggleMute: C
  };
}
const cA = { class: "audio-player" }, uA = /* @__PURE__ */ B({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, s = _(null), {
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
      pause: y,
      skip: b,
      setVolume: v,
      cyclePlaybackRate: w,
      toggleMute: S
    } = lA({
      containerRef: s,
      audioSrc: Li(() => r.audioSrc),
      turns: Li(() => r.turns),
      speakers: Li(() => r.speakers)
    });
    return Y(f, (M) => i("timeupdate", M)), Y(o, (M) => i("playStateChange", M)), e({ seekTo: g, pause: y }), (M, x) => (T(), L("footer", cA, [
      V("div", {
        ref_key: "waveformRef",
        ref: s,
        class: ct(["waveform-container", { "waveform-container--loading": k(l) }])
      }, null, 2),
      q(YM, {
        "is-playing": k(o),
        "current-time": k(h),
        duration: k(p),
        volume: k(c),
        "playback-rate": k(u),
        "is-muted": k(d),
        "is-ready": k(a),
        onTogglePlay: k(m),
        onSkipBack: x[0] || (x[0] = (A) => k(b)(-10)),
        onSkipForward: x[1] || (x[1] = (A) => k(b)(10)),
        "onUpdate:volume": k(v),
        onToggleMute: k(S),
        onCyclePlaybackRate: k(w)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), dA = /* @__PURE__ */ te(uA, [["__scopeId", "data-v-9248e45e"]]);
class fA {
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
        const w = h[b - 1], S = h[b + 1];
        w && (h[b - 1] = void 0);
        let M = !1;
        if (S) {
          const A = S.oldPos - b;
          M = S && 0 <= A && A < a;
        }
        const x = w && w.oldPos + 1 < l;
        if (!M && !x) {
          h[b] = void 0;
          continue;
        }
        if (!x || M && w.oldPos < S.oldPos ? v = this.addToPath(S, !0, !1, 0, r) : v = this.addToPath(w, !1, !0, 1, r), p = this.extractCommon(v, t, e, b, r), v.oldPos + 1 >= l && p + 1 >= a)
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
class hA extends fA {
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
const pA = new hA();
function mA(n, e, t) {
  return pA.diff(n, e, t);
}
function qo({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = mA(i, s, {
    comparator: yA
  }), a = gA(o), l = [...e];
  let c = [...e], u = 0;
  for (const h of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in h && h.replaced)
      c = Hi(
        c,
        l[0],
        h.countAdded - h.countRemoved
      ), u += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const p = h;
      u += p.count, c = Hi(
        c,
        l[0],
        -p.count
      );
    } else if ("added" in h && h.added) {
      const p = h;
      c = Hi(
        c,
        l[0],
        p.count
      );
    } else
      u += h.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const p = xm(
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
function gA(n) {
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
function Hi(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function xm(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    Hi(
      xm(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function yA(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class vA {
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
class bA extends vA {
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
    this.resetAll(), this.currentState = qo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = qo(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = qo(
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
function Sm(n) {
  const e = qe();
  let t = null;
  _e(() => {
    n.canvasRef.value && (t = new bA(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), Y([n.fontSize, n.lineHeight], ([l, c]) => {
    t && t.setFontSize(l, c);
  }), Y(
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
  fr(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
function Cm(n) {
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
  return n && Y(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), _e(a), Lt(i), { visible: e };
}
const dd = /\$(\w+)/g;
function kA(n, e) {
  const t = [];
  let r = 0, i;
  for (dd.lastIndex = 0; (i = dd.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const wA = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, xA = ["src", "alt"], SA = { key: 1 }, CA = /* @__PURE__ */ B({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = qe().subtitle?.watermark, r = E(() => t ? kA(t.content.value, t.tokens.value) : []);
    return (i, s) => (T(), I(Ga, { name: "watermark" }, {
      default: $(() => [
        n.visible && k(t) ? (T(), L("div", wA, [
          (T(!0), L(De, null, ht(r.value, (o, a) => (T(), L(De, { key: a }, [
            o.type === "token" ? (T(), L("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, xA)) : (T(), L("span", SA, K(o.value), 1))
          ], 64))), 128))
        ])) : j("", !0)
      ]),
      _: 1
    }));
  }
}), Tm = /* @__PURE__ */ te(CA, [["__scopeId", "data-v-b8c2ff2b"]]), TA = ["height"], EA = /* @__PURE__ */ B({
  __name: "SubtitleBanner",
  setup(n) {
    const e = qe(), t = It("canvas"), r = E(() => e.subtitle?.fontSize.value ?? 40), i = E(() => 1.2 * r.value), s = E(() => 2.4 * r.value);
    Sm({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = Cm(
      e.subtitle?.watermark
    );
    return (a, l) => (T(), L("div", {
      class: "subtitle-banner",
      style: Pn({ height: s.value + "px" })
    }, [
      V("canvas", {
        ref: "canvas",
        class: ct(["subtitle-canvas", { "subtitle-canvas--shrunk": k(o) }]),
        height: s.value
      }, null, 10, TA),
      q(Tm, { visible: k(o) }, null, 8, ["visible"])
    ], 4));
  }
}), MA = /* @__PURE__ */ te(EA, [["__scopeId", "data-v-f62eaf60"]]), AA = {
  ref: "container",
  class: "subtitle-fullscreen"
}, OA = ["aria-label"], DA = /* @__PURE__ */ B({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = qe(), { t } = he(), r = It("container"), i = It("canvas"), s = E(() => e.subtitle?.fontSize.value ?? 48), o = E(() => 1.2 * s.value);
    Sm({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = Cm(
      e.subtitle?.watermark
    );
    _e(async () => {
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
    _e(() => {
      document.addEventListener("fullscreenchange", l);
    });
    function c() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return fr(() => {
      document.removeEventListener("fullscreenchange", l);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, d) => (T(), L("div", AA, [
      V("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": k(t)("subtitle.exitFullscreen"),
        onClick: c
      }, [
        q(k(Qa), { size: 24 })
      ], 8, OA),
      V("canvas", {
        ref: "canvas",
        class: ct(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": k(a) }])
      }, null, 2),
      q(Tm, { visible: k(a) }, null, 8, ["visible"])
    ], 512));
  }
}), _A = /* @__PURE__ */ te(DA, [["__scopeId", "data-v-e3ae14e0"]]), PA = /* @__PURE__ */ B({
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
    const o = E(() => r.value ? "check" : t.icon), a = E(() => ff[t.size ?? "sm"]);
    return (l, c) => (T(), I(ve, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: ct({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: $(() => [
        q(Ga, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: $(() => [
            (T(), I(gn, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: $(() => [
        J(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), fd = /* @__PURE__ */ te(PA, [["__scopeId", "data-v-0077b14e"]]), RA = ["aria-label"], IA = { class: "selection-count" }, NA = { class: "selection-actions" }, $A = /* @__PURE__ */ B({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Xf(), { t } = he();
    return (r, i) => k(e).hasSelection.value ? (T(), L("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": k(t)("selection.count")
    }, [
      V("span", IA, K(k(e).count.value) + " " + K(k(t)("selection.count")), 1),
      V("div", NA, [
        q(fd, {
          icon: "clipboard-type",
          "copy-fn": k(e).copyText,
          variant: "secondary"
        }, {
          default: $(() => [
            be(K(k(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(fd, {
          icon: "clipboard-list",
          "copy-fn": k(e).copyWithMetadata
        }, {
          default: $(() => [
            be(K(k(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(ve, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => k(e).clear())
        }, {
          default: $(() => [
            be(K(k(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, RA)) : j("", !0);
  }
}), BA = /* @__PURE__ */ te($A, [["__scopeId", "data-v-1c5a7d10"]]), LA = "(max-width: 767px)";
function zA() {
  const n = _(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return _e(() => {
    e = window.matchMedia(LA), n.value = e.matches, e.addEventListener("change", t);
  }), Lt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const FA = { class: "editor-layout" }, VA = { class: "editor-body" }, qA = {
  key: 5,
  class: "mobile-selectors"
}, UA = /* @__PURE__ */ B({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = qe(), { isMobile: r } = zA(), i = _(!1), s = _(jn), o = E(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), a = t.speakers.all;
    Kk(o, a, t);
    const l = E(() => [...t.channels.values()]), c = E(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), u = E(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), d = E(() => Array.from(a.values())), f = E(() => s.value === jn), h = E(() => s.value === zi), p = E(() => f.value || h.value ? null : t.llmServices?.get(s.value) ?? null);
    Y(s, (v) => {
      t.llmServices && (v === jn || v === zi ? t.llmServices.setActive(null) : t.llmServices.setActive(v));
    }), Y(
      () => t.llmServices?.list.value.map((v) => v.id).join("|"),
      () => {
        s.value !== jn && s.value !== zi && !t.llmServices?.get(s.value) && (s.value = jn);
      }
    );
    const m = It("audioPlayer");
    function g(v) {
      t.audio && (t.audio.currentTime.value = v);
    }
    Y(
      () => t.activeChannelId.value,
      () => {
        m.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((v) => m.value?.seekTo(v));
    function y(v) {
      t.setActiveChannel(v);
    }
    function b(v) {
      t.activeChannel.value?.setActiveTranslation(v);
    }
    return (v, w) => (T(), L("div", FA, [
      e.showHeader ? (T(), I(zy, {
        key: 0,
        title: k(t).title.value,
        date: k(t).date.value,
        duration: k(t).activeChannel.value?.duration ?? 0,
        "speaker-count": k(a).size,
        "is-mobile": k(r),
        onToggleSidebar: w[0] || (w[0] = (S) => i.value = !i.value)
      }, null, 8, ["title", "date", "duration", "speaker-count", "is-mobile"])) : j("", !0),
      q(Jy, {
        modelValue: s.value,
        "onUpdate:modelValue": w[1] || (w[1] = (S) => s.value = S)
      }, null, 8, ["modelValue"]),
      f.value ? (T(), I(BA, { key: 1 })) : j("", !0),
      V("main", VA, [
        f.value ? (T(), I(Yu, {
          key: 0,
          turns: o.value,
          speakers: k(a)
        }, null, 8, ["turns", "speakers"])) : h.value ? (T(), I(XT, { key: 1 })) : p.value ? (T(), I(UE, {
          key: p.value.id,
          service: p.value
        }, null, 8, ["service"])) : (T(), I(Yu, {
          key: 3,
          turns: o.value,
          speakers: k(a)
        }, null, 8, ["turns", "speakers"])),
        k(r) ? j("", !0) : (T(), I(sd, {
          key: 4,
          speakers: d.value,
          channels: l.value,
          "selected-channel-id": k(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedChannelId": y,
          "onUpdate:selectedTranslationId": b
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        k(r) ? (T(), I(qM, {
          key: 5,
          open: i.value,
          "onUpdate:open": w[2] || (w[2] = (S) => i.value = S)
        }, {
          default: $(() => [
            q(sd, {
              speakers: d.value,
              channels: l.value,
              "selected-channel-id": k(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": u.value,
              "onUpdate:selectedChannelId": y,
              "onUpdate:selectedTranslationId": b
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : j("", !0)
      ]),
      k(t).audio?.src.value ? (T(), I(dA, {
        key: 2,
        ref: "audioPlayer",
        "audio-src": k(t).audio.src.value,
        turns: o.value,
        speakers: k(a),
        onTimeupdate: g,
        onPlayStateChange: w[3] || (w[3] = (S) => {
          k(t).audio && (k(t).audio.isPlaying.value = S);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : j("", !0),
      k(t).subtitle?.isVisible.value && !k(r) && !k(t).subtitle.isFullscreen.value ? (T(), I(MA, { key: 3 })) : j("", !0),
      k(t).subtitle?.isFullscreen.value ? (T(), I(_A, { key: 4 })) : j("", !0),
      k(r) && (l.value.length > 1 || c.value.length > 1) ? (T(), L("div", qA, [
        l.value.length > 1 ? (T(), I(pm, {
          key: 0,
          channels: l.value,
          "selected-channel-id": k(t).activeChannelId.value,
          "onUpdate:selectedChannelId": y
        }, null, 8, ["channels", "selected-channel-id"])) : j("", !0),
        c.value.length > 1 ? (T(), I(mm, {
          key: 1,
          translations: c.value,
          "selected-translation-id": u.value,
          "onUpdate:selectedTranslationId": b
        }, null, 8, ["translations", "selected-translation-id"])) : j("", !0)
      ])) : j("", !0)
    ]));
  }
}), nR = /* @__PURE__ */ te(UA, [["__scopeId", "data-v-8c8ee787"]]);
function rR(n = {}) {
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
      const d = Y(
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
      ), f = E(() => l.value), h = rt(() => {
        if (!r.value) return;
        const y = t.value, b = e.activeChannel.value?.activeTranslation.value;
        if (b) {
          for (const v of b.turns.value)
            if (v.startTime != null && v.endTime != null && y >= v.startTime && y <= v.endTime) {
              s.value = v.id, i.value = Za(v.words) ? Qd(v.words, y) : null;
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
var Em = Vl.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const _n = Math.floor, WA = Math.abs, Zt = (n, e) => n < e ? n : e, lr = (n, e) => n > e ? n : e, jA = (n) => n !== 0 ? n < 0 : 1 / n < 0, HA = 64, ei = 128, KA = 1 << 29, hd = 63, Nr = 127, JA = 2147483647, pd = Number.MAX_SAFE_INTEGER, md = Number.MIN_SAFE_INTEGER, XA = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && _n(n) === n), GA = () => /* @__PURE__ */ new Set(), Ql = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, Mm = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, YA = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, Qs = Array.isArray, Am = String.fromCharCode, ZA = (n) => n.toLowerCase(), QA = /^\s*/g, eO = (n) => n.replace(QA, ""), tO = /([A-Z])/g, gd = (n, e) => eO(n.replace(tO, (t) => `${e}${ZA(t)}`)), nO = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ti = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), rO = (n) => ti.encode(n), iO = ti ? rO : nO;
let Uo = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Uo && Uo.decode(new Uint8Array()).length === 1 && (Uo = null);
const sO = (n, e) => YA(e, () => n).join("");
let oO = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const aO = () => new oO(), lO = (n) => {
  const e = aO();
  return n(e), uO(e);
}, cO = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, uO = (n) => {
  const e = new Uint8Array(cO(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, dO = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(lr(t, e) * 2), n.cpos = 0);
}, Te = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, ni = (n, e) => {
  for (; e > Nr; )
    Te(n, ei | Nr & e), e = _n(e / 128);
  Te(n, Nr & e);
}, fO = (n, e) => {
  const t = jA(e);
  for (t && (e = -e), Te(n, (e > hd ? ei : 0) | (t ? HA : 0) | hd & e), e = _n(e / 64); e > 0; )
    Te(n, (e > Nr ? ei : 0) | Nr & e), e = _n(e / 128);
}, Na = new Uint8Array(3e4), hO = Na.length / 3, pO = (n, e) => {
  if (e.length < hO) {
    const t = ti.encodeInto(e, Na).written || 0;
    ni(n, t);
    for (let r = 0; r < t; r++)
      Te(n, Na[r]);
  } else
    Om(n, iO(e));
}, mO = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  ni(n, r);
  for (let i = 0; i < r; i++)
    Te(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, yd = ti && /** @type {any} */
ti.encodeInto ? pO : mO, gO = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = Zt(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(lr(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, Om = (n, e) => {
  ni(n, e.byteLength), gO(n, e);
}, ec = (n, e) => {
  dO(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, yO = (n, e) => ec(n, 4).setFloat32(0, e, !1), vO = (n, e) => ec(n, 8).setFloat64(0, e, !1), bO = (n, e) => (
  /** @type {any} */
  ec(n, 8).setBigInt64(0, e, !1)
), vd = new DataView(new ArrayBuffer(4)), kO = (n) => (vd.setFloat32(0, n), vd.getFloat32(0) === n), $a = (n, e) => {
  switch (typeof e) {
    case "string":
      Te(n, 119), yd(n, e);
      break;
    case "number":
      XA(e) && WA(e) <= JA ? (Te(n, 125), fO(n, e)) : kO(e) ? (Te(n, 124), yO(n, e)) : (Te(n, 123), vO(n, e));
      break;
    case "bigint":
      Te(n, 122), bO(n, e);
      break;
    case "object":
      if (e === null)
        Te(n, 126);
      else if (Qs(e)) {
        Te(n, 117), ni(n, e.length);
        for (let t = 0; t < e.length; t++)
          $a(n, e[t]);
      } else if (e instanceof Uint8Array)
        Te(n, 116), Om(n, e);
      else {
        Te(n, 118);
        const t = Object.keys(e);
        ni(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          yd(n, i), $a(n, e[i]);
        }
      }
      break;
    case "boolean":
      Te(n, e ? 120 : 121);
      break;
    default:
      Te(n, 127);
  }
}, eo = (n) => new Error(n), Dm = () => {
  throw eo("Method unimplemented");
}, to = () => {
  throw eo("Unexpected case");
}, Ki = () => /* @__PURE__ */ new Map(), _m = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, ri = /* @__PURE__ */ Symbol("Equality"), wO = (n, e) => n === e || !!n?.[ri]?.(e) || !1, xO = (n) => typeof n == "object", Pm = Object.keys, bd = (n) => Pm(n).length, wi = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, Rm = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Ji = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[ri] != null)
    return n[ri](e);
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
        if (!e.has(t) || !Ji(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (bd(n) !== bd(e))
        return !1;
      for (const t in n)
        if (!Rm(n, t) || !Ji(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Ji(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, SO = (n, e) => e.includes(n), CO = () => {
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
}, TO = /[\uD800-\uDBFF]/, EO = /[\uDC00-\uDFFF]/, MO = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && TO.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && EO.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, AO = MO, OO = Math.random, DO = (n) => n[_n(OO() * n.length)], kd = (n) => n === void 0 ? null : n;
class _O {
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
let Im = new _O(), PO = !0;
try {
  typeof localStorage < "u" && localStorage && (Im = localStorage, PO = !1);
} catch {
}
const RO = Im, cr = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Nm = typeof window < "u" && typeof document < "u" && !cr;
let yt;
const IO = () => {
  if (yt === void 0)
    if (cr) {
      yt = Ki();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && yt.set(e, ""), e = r) : e !== null && (yt.set(e, r), e = null);
      }
      e !== null && yt.set(e, "");
    } else typeof location == "object" ? (yt = Ki(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        yt.set(`--${gd(e, "-")}`, t), yt.set(`-${gd(e, "-")}`, t);
      }
    })) : yt = Ki();
  return yt;
}, Ba = (n) => IO().has(n), La = (n) => kd(cr ? process.env[n.toUpperCase().replaceAll("-", "_")] : RO.getItem(n)), $m = (n) => Ba("--" + n) || La(n) !== null, NO = $m("production"), $O = cr && SO(process.env.FORCE_COLOR, ["true", "1", "2"]);
$O || !Ba("--no-colors") && // @todo deprecate --no-colors
!$m("no-color") && (!cr || process.stdout.isTTY) && (!cr || Ba("--color") || La("COLORTERM") !== null || (La("TERM") || "").includes("color"));
const BO = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += Am(n[t]);
  return btoa(e);
}, LO = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), zO = Nm ? BO : LO, FO = (n) => lO((e) => $a(e, n)), wd = (n) => n.next() >= 0.5, Wo = (n, e, t) => _n(n.next() * (t + 1 - e) + e), Bm = (n, e, t) => _n(n.next() * (t + 1 - e) + e), tc = (n, e, t) => Bm(n, e, t), VO = (n) => Am(tc(n, 97, 122)), qO = (n, e = 0, t = 20) => {
  const r = tc(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += VO(n);
  return i;
}, jo = (n, e) => e[tc(n, 0, e.length - 1)], UO = /* @__PURE__ */ Symbol("0schema");
class WO {
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
      e.push(sO(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const za = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[ri] ? wO(n, e) : Qs(n) ? Ql(
  n,
  (t) => Mm(e, (r) => za(t, r))
) : xO(n) ? wi(
  n,
  (t, r) => za(t, e[r])
) : !1;
class Ue {
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
      this.constructor._dilutes && ([r, t] = [t, r]), za(t, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Ji(this.shape, e.shape);
  }
  [UO]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [ri](e) {
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
    Dm();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return yr(this, oo);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Fm(
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
    return xd(e, this), /** @type {any} */
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
    return xd(e, this), e;
  }
}
class nc extends Ue {
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
const me = (n, e = null) => new nc(n, e);
me(nc);
class rc extends Ue {
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
const Se = (n) => new rc(n);
me(rc);
class no extends Ue {
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
const ro = (...n) => new no(n), Lm = me(no), jO = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), zm = (n) => {
  if (ur.check(n))
    return [jO(n)];
  if (Lm.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if (Xm.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (Gm.check(n))
    return [".*"];
  if (Ss.check(n))
    return n.shape.map(zm).flat(1);
  to();
};
class HO extends Ue {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(zm).map((t) => `(${t.join("|")})`).join("") + "$");
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
me(HO);
const KO = /* @__PURE__ */ Symbol("optional");
class Fm extends Ue {
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
  get [KO]() {
    return !0;
  }
}
const JO = me(Fm);
class XO extends Ue {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
me(XO);
class io extends Ue {
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
    return new io(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : wi(this.shape, (r, i) => {
      const s = this._isPartial && !Rm(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const GO = (n) => (
  /** @type {any} */
  new io(n)
), YO = me(io), ZO = Se((n) => n != null && (n.constructor === Object || n.constructor == null));
class Vm extends Ue {
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
    return e != null && wi(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const qm = (n, e) => new Vm(n, e), QO = me(Vm);
class Um extends Ue {
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
    return e != null && wi(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const eD = (...n) => new Um(n);
me(Um);
class Wm extends Ue {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new ic(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = Qs(e) && Ql(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const jm = (...n) => new Wm(n), tD = me(Wm), nD = Se((n) => Qs(n));
class Hm extends Ue {
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
const rD = (n, e = null) => new Hm(n, e);
me(Hm);
const iD = rD(Ue);
class sD extends Ue {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = eD(...e.slice(-1)), this.res = e[this.len];
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
const oD = me(sD), aD = Se((n) => typeof n == "function");
class lD extends Ue {
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
me(lD, (n) => n.shape.length > 0);
class ic extends Ue {
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
    const r = Mm(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const yr = (...n) => n.findIndex((e) => Ss.check(e)) >= 0 ? yr(...n.map((e) => ii(e)).map((e) => Ss.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new ic(n), Ss = (
  /** @type {Schema<$Union<any>>} */
  me(ic)
), Km = () => !0, Cs = Se(Km), cD = (
  /** @type {Schema<Schema<any>>} */
  me(rc, (n) => n.shape === Km)
), sc = Se((n) => typeof n == "bigint"), uD = (
  /** @type {Schema<Schema<BigInt>>} */
  Se((n) => n === sc)
), Jm = Se((n) => typeof n == "symbol");
Se((n) => n === Jm);
const Qn = Se((n) => typeof n == "number"), Xm = (
  /** @type {Schema<Schema<number>>} */
  Se((n) => n === Qn)
), ur = Se((n) => typeof n == "string"), Gm = (
  /** @type {Schema<Schema<string>>} */
  Se((n) => n === ur)
), so = Se((n) => typeof n == "boolean"), dD = (
  /** @type {Schema<Schema<Boolean>>} */
  Se((n) => n === so)
), Ym = ro(void 0);
me(no, (n) => n.shape.length === 1 && n.shape[0] === void 0);
ro(void 0);
const oo = ro(null), fD = (
  /** @type {Schema<Schema<null>>} */
  me(no, (n) => n.shape.length === 1 && n.shape[0] === null)
);
me(Uint8Array);
me(nc, (n) => n.shape === Uint8Array);
const hD = yr(Qn, ur, oo, Ym, sc, so, Jm);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    jm(Cs)
  ), e = (
    /** @type {$Record<$string,$any>} */
    qm(ur, Cs)
  ), t = yr(Qn, ur, oo, so, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const ii = (n) => {
  if (iD.check(n))
    return (
      /** @type {any} */
      n
    );
  if (ZO.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = ii(n[t]);
    return (
      /** @type {any} */
      GO(e)
    );
  } else {
    if (nD.check(n))
      return (
        /** @type {any} */
        yr(...n.map(ii))
      );
    if (hD.check(n))
      return (
        /** @type {any} */
        ro(n)
      );
    if (aD.check(n))
      return (
        /** @type {any} */
        me(
          /** @type {any} */
          n
        )
      );
  }
  to();
}, xd = NO ? () => {
} : (n, e) => {
  const t = new WO();
  if (!e.check(n, t))
    throw eo(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class pD {
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
    return this.patterns.push({ if: ii(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(Cs, e);
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
        throw eo("Unhandled pattern");
      }
    );
  }
}
const mD = (n) => new pD(
  /** @type {any} */
  n
), Zm = (
  /** @type {any} */
  mD(
    /** @type {Schema<prng.PRNG>} */
    Cs
  ).if(Xm, (n, e) => Wo(e, md, pd)).if(Gm, (n, e) => qO(e)).if(dD, (n, e) => wd(e)).if(uD, (n, e) => BigInt(Wo(e, md, pd))).if(Ss, (n, e) => Wn(e, jo(e, n.shape))).if(YO, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (JO.check(i)) {
        if (wd(e))
          continue;
        i = i.shape;
      }
      t[r] = Zm(i, e);
    }
    return t;
  }).if(tD, (n, e) => {
    const t = [], r = Bm(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push(Wn(e, n.shape));
    return t;
  }).if(Lm, (n, e) => jo(e, n.shape)).if(fD, (n, e) => null).if(oD, (n, e) => {
    const t = Wn(e, n.res);
    return () => t;
  }).if(cD, (n, e) => Wn(e, jo(e, [
    Qn,
    ur,
    oo,
    Ym,
    sc,
    so,
    jm(Qn),
    qm(yr("a", "b", "c"), Qn)
  ]))).if(QO, (n, e) => {
    const t = {}, r = Wo(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = Wn(e, n.shape.keys), o = Wn(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), Wn = (n, e) => (
  /** @type {any} */
  Zm(ii(e), n)
), xi = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
Se((n) => n.nodeType === bD);
typeof DOMParser < "u" && new DOMParser();
Se((n) => n.nodeType === gD);
Se((n) => n.nodeType === yD);
const gD = xi.ELEMENT_NODE, yD = xi.TEXT_NODE, vD = xi.DOCUMENT_NODE, bD = xi.DOCUMENT_FRAGMENT_NODE;
Se((n) => n.nodeType === vD);
const kD = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, wD = kD(clearTimeout), oc = (n, e) => new wD(setTimeout(e, n)), wt = (n, e) => n >>> e | n << 32 - e, xD = (n) => wt(n, 2) ^ wt(n, 13) ^ wt(n, 22), SD = (n) => wt(n, 6) ^ wt(n, 11) ^ wt(n, 25), CD = (n) => wt(n, 7) ^ wt(n, 18) ^ n >>> 3, TD = (n) => wt(n, 17) ^ wt(n, 19) ^ n >>> 10, ED = new Uint32Array([
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
]), MD = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class AD {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set(MD), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = TD(t[d - 2]) + t[d - 7] + CD(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], l = e[5], c = e[6], u = e[7];
    for (let d = 0, f, h; d < 64; d++)
      f = u + SD(a) + (a & l ^ ~a & c) + ED[d] + t[d] >>> 0, h = xD(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = l, l = a, a = o + f >>> 0, o = s, s = i, i = r, r = f + h >>> 0;
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
        this._W[o] |= ei << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= ei << (3 - t % 4) * 8), this._W[14] = e.byteLength / KA, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let a = 0; a < 4; a++)
        s[o * 4 + a] = this._H[o] >>> (3 - a) * 8;
    return s;
  }
}
const OD = (n) => new AD().digest(n), ie = new Ze("y-sync"), Pt = new Ze("y-undo"), $i = new Ze("yjs-cursor"), DD = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, _D = (n) => zO(DD(OD(FO(n)))), Ts = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !W.isDeleted(e.ds, n.id), PD = [{ light: "#ecd44433", dark: "#ecd444" }], RD = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = GA();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, DO(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, ID = (n, {
  colors: e = PD,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const a = new BD(n, s), l = new Pe({
    props: {
      editable: (c) => {
        const u = ie.getState(c);
        return u.snapshot == null && u.prevSnapshot == null;
      }
    },
    key: ie,
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
        const d = c.getMeta(ie);
        if (d !== void 0) {
          u = Object.assign({}, u);
          for (const f in d)
            u[f] = d[f];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, a.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && oc(0, () => {
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
            const d = Pt.getState(c.state), f = d && d.undoManager;
            f && f.stopCapturing();
          }
          a.mux(() => {
            u.doc.transact((d) => {
              d.meta.set("addToHistory", u.addToHistory), a._prosemirrorChanged(c.state.doc);
            }, ie);
          });
        }
      },
      destroy: () => {
        a.destroy();
      }
    })
  });
  return l;
}, ND = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new Xe(n.doc));
    else if (e.type === "node") {
      const r = wn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection($D(n, r));
    } else {
      const r = wn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = wn(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(G.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, $D = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? X.create(n.doc, e) : G.near(t);
}, Fa = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: oi(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: oi(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class BD {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = CO(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Fa(
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
    return this.prosemirrorView.hasFocus() ? (Nm && this._domSelectionInView === null && (oc(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = xi.documentElement;
    return i.bottom >= 0 && i.right >= 0 && i.left <= (window.innerWidth || s.clientWidth || 0) && i.top <= (window.innerHeight || s.clientHeight || 0);
  }
  /**
   * @param {Y.Snapshot} snapshot
   * @param {Y.Snapshot} prevSnapshot
   */
  renderSnapshot(e, t) {
    t || (t = W.createSnapshot(W.createDeleteSet(), /* @__PURE__ */ new Map())), this.prosemirrorView.dispatch(
      this._tr.setMeta(ie, { snapshot: e, prevSnapshot: t })
    );
  }
  unrenderSnapshot() {
    this.mapping.clear(), this.mux(() => {
      const e = this.type.toArray().map(
        (r) => Xi(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new F(P.from(e), 0, 0)
      );
      t.setMeta(ie, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => Xi(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new F(P.from(t), 0, 0)
      );
      if (e) {
        const i = Zt(lr(e.anchor, 0), r.doc.content.size), s = Zt(lr(e.head, 0), r.doc.content.size);
        r.setSelection(G.create(r.doc, i, s));
      }
      this.prosemirrorView.dispatch(
        r.setMeta(ie, { isChangeOrigin: !0, binding: this })
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
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && to(), i = new W.Doc({ gc: !1 }), W.applyUpdateV2(i, t), t = W.snapshot(i), W.applyUpdateV2(i, e), e = W.snapshot(i), s._item === null) {
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
            color: RD(
              r.colorMapping,
              r.colors,
              h
            )
          };
        }, c = W.typeListToArraySnapshot(
          s,
          new W.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || Ts(d._item, e) || Ts(d._item, t) ? Xi(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          l
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new F(P.from(c), 0, 0)
        );
        this.prosemirrorView.dispatch(
          u.setMeta(ie, { isChangeOrigin: !0 })
        );
      }, ie);
    });
  }
  /**
   * @param {Array<Y.YEvent<any>>} events
   * @param {Y.Transaction} transaction
   */
  _typeChanged(e, t) {
    if (this.prosemirrorView == null) return;
    const r = ie.getState(this.prosemirrorView.state);
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
        (a) => Qm(
          /** @type {Y.XmlElement | Y.XmlHook} */
          a,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((a) => a !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new F(P.from(s), 0, 0)
      );
      ND(o, this.beforeTransactionSelection, this), o = o.setMeta(ie, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof W.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      Ms(this.doc, this.type, e, this), this.beforeTransactionSelection = Fa(
        this,
        this.prosemirrorView.state
      );
    }, ie);
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
const Qm = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof W.XmlElement)
      return Xi(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw Dm();
  }
  return o;
}, Xi = (n, e, t, r, i, s) => {
  const o = [], a = (l) => {
    if (l instanceof W.XmlElement) {
      const c = Qm(
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
      const u = LD(
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
    r !== void 0 && (Ts(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? Ts(
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
    }, ie), t.mapping.delete(n), null;
  }
}, LD = (n, e, t, r, i, s) => {
  const o = [], a = n.toDelta(r, i, s);
  try {
    for (let l = 0; l < a.length; l++) {
      const c = a[l];
      o.push(e.text(c.insert, WD(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, ie), null;
  }
  return o;
}, zD = (n, e) => {
  const t = new W.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: ng(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, FD = (n, e) => {
  const t = new W.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    ao(n).map(
      (r) => Va(r, e)
    )
  ), e.mapping.set(t, n), t;
}, Va = (n, e) => n instanceof Array ? zD(n, e) : FD(n, e), Sd = (n) => typeof n == "object" && n !== null, ac = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], a = e[s];
    r = s === "ychange" || o === a || Sd(o) && Sd(a) && ac(o, a);
  }
  return r;
}, ao = (n) => {
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
}, eg = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && Pm(r.attributes || {}).length === e[i].marks.length && wi(r.attributes, (s, o) => {
      const a = tg(o), l = e[i].marks;
      return l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      ) ? ac(s, l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      )?.attrs) : !1;
    })
  );
}, si = (n, e) => {
  if (n instanceof W.XmlElement && !(e instanceof Array) && qa(n, e)) {
    const t = ao(e);
    return n._length === t.length && ac(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => si(r, t[i])
    );
  }
  return n instanceof W.XmlText && e instanceof Array && eg(n, e);
}, Es = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), Cd = (n, e, t) => {
  const r = n.toArray(), i = ao(e), s = i.length, o = r.length, a = Zt(o, s);
  let l = 0, c = 0, u = !1;
  for (; l < a; l++) {
    const d = r[l], f = i[l];
    if (Es(t.mapping.get(d), f))
      u = !0;
    else if (!si(d, f))
      break;
  }
  for (; l + c < a; c++) {
    const d = r[o - c - 1], f = i[s - c - 1];
    if (Es(t.mapping.get(d), f))
      u = !0;
    else if (!si(d, f))
      break;
  }
  return {
    equalityFactor: l + c,
    foundMappedChild: u
  };
}, VD = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof W.ContentString ? e += t.content.str : t.content instanceof W.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, qD = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = VD(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, ng(c.marks, t))
  })), { insert: o, remove: a, index: l } = AO(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(l, a), n.insert(l, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, UD = /(.*)(--[a-zA-Z0-9+/=]{8})$/, tg = (n) => UD.exec(n)?.[1] ?? n, WD = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(tg(r), n[r]));
  return t;
}, ng = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = _m(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${_D(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, Ms = (n, e, t, r) => {
  if (e instanceof W.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof W.XmlElement) {
    const d = e.getAttributes(), f = t.attrs;
    for (const h in f)
      f[h] !== null ? d[h] !== f[h] && h !== "ychange" && e.setAttribute(h, f[h]) : e.removeAttribute(h);
    for (const h in d)
      f[h] === void 0 && e.removeAttribute(h);
  }
  const i = ao(t), s = i.length, o = e.toArray(), a = o.length, l = Zt(s, a);
  let c = 0, u = 0;
  for (; c < l; c++) {
    const d = o[c], f = i[c];
    if (!Es(r.mapping.get(d), f))
      if (si(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  for (; u + c + 1 < l; u++) {
    const d = o[a - u - 1], f = i[s - u - 1];
    if (!Es(r.mapping.get(d), f))
      if (si(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  n.transact(() => {
    for (; a - c - u > 0 && s - c - u > 0; ) {
      const f = o[c], h = i[c], p = o[a - u - 1], m = i[s - u - 1];
      if (f instanceof W.XmlText && h instanceof Array)
        eg(f, h) || qD(f, h, r), c += 1;
      else {
        let g = f instanceof W.XmlElement && qa(f, h), y = p instanceof W.XmlElement && qa(p, m);
        if (g && y) {
          const b = Cd(
            /** @type {Y.XmlElement} */
            f,
            /** @type {PModel.Node} */
            h,
            r
          ), v = Cd(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          b.foundMappedChild && !v.foundMappedChild ? y = !1 : !b.foundMappedChild && v.foundMappedChild || b.equalityFactor < v.equalityFactor ? g = !1 : y = !1;
        }
        g ? (Ms(
          n,
          /** @type {Y.XmlFragment} */
          f,
          /** @type {PModel.Node} */
          h,
          r
        ), c += 1) : y ? (Ms(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          Va(h, r)
        ]), c += 1);
      }
    }
    const d = a - c - u;
    if (a === 1 && s === 0 && o[0] instanceof W.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((f) => r.mapping.delete(f)), e.delete(c, d)), c + u < s) {
      const f = [];
      for (let h = c; h < s - u; h++)
        f.push(Va(i[h], r));
      e.insert(c, f);
    }
  }, ie);
}, qa = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let $r = null;
const jD = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    $r
  );
  $r = null, n.forEach((e, t) => {
    const r = t.state.tr, i = ie.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, HD = (n, e, t) => {
  $r || ($r = /* @__PURE__ */ new Map(), oc(0, jD)), _m($r, n, Ki).set(e, t);
}, oi = (n, e, t) => {
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
      throw to();
    if (n === 0 && r.constructor !== W.XmlText && r !== e)
      return KD(r._item.parent, r._item);
  }
  return W.createRelativePositionFromTypeIndex(e, e._length, -1);
}, KD = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = W.findRootTypeKey(n) : t = W.createID(n._item.id.client, n._item.id.clock), new W.RelativePosition(t, r, e.id);
}, wn = (n, e, t, r) => {
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
function JD(n, e) {
  const t = e || new W.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return Ms(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function XD(n, e, t) {
  const r = Ot.fromJSON(n, e);
  return JD(r, t);
}
const GD = (n, e, t) => n !== e, YD = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, ZD = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), QD = /^#[0-9a-fA-F]{6}$/, Td = (n, e, t, r, i) => {
  const s = ie.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return oe.create(n.doc, []);
  const o = s.doc, a = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? oe.create(n.doc, []) : (e.getStates().forEach((l, c) => {
    if (t(o.clientID, c, l) && l.cursor != null) {
      const u = l.user || {};
      u.color == null ? u.color = "#ffa500" : QD.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = wn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.anchor),
        s.binding.mapping
      ), f = wn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.head),
        s.binding.mapping
      );
      if (d !== null && f !== null) {
        const h = lr(n.doc.content.size - 1, 0);
        d = Zt(d, h), f = Zt(f, h), a.push(
          je.widget(f, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = Zt(d, f), m = lr(d, f);
        a.push(
          je.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), oe.create(n.doc, a));
}, e_ = (n, {
  awarenessStateFilter: e = GD,
  cursorBuilder: t = YD,
  selectionBuilder: r = ZD,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new Pe({
  key: $i,
  state: {
    init(o, a) {
      return Td(
        a,
        n,
        e,
        t,
        r
      );
    },
    apply(o, a, l, c) {
      const u = ie.getState(c), d = o.getMeta($i);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? Td(
        c,
        n,
        e,
        t,
        r
      ) : a.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => $i.getState(o)
  },
  view: (o) => {
    const a = () => {
      o.docView && HD(o, $i, { awarenessUpdated: !0 });
    }, l = () => {
      const c = ie.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), f = oi(
          d.anchor,
          c.type,
          c.binding.mapping
        ), h = oi(
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
      } else u.cursor != null && wn(
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
}), t_ = (n) => {
  const e = Pt.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, n_ = (n) => {
  const e = Pt.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, r_ = /* @__PURE__ */ new Set(["paragraph"]), i_ = (n, e) => !(n instanceof zg) || !(n.content instanceof Fg) || !(n.content.type instanceof Vg || n.content.type instanceof qg && e.has(n.content.type.nodeName)) || n.content.type._length === 0, s_ = ({ protectedNodes: n = r_, trackedOrigins: e = [], undoManager: t = null } = {}) => new Pe({
  key: Pt,
  state: {
    init: (r, i) => {
      const s = ie.getState(i), o = t || new Lg(s.type, {
        trackedOrigins: new Set([ie].concat(e)),
        deleteFilter: (a) => i_(a, n),
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
      const a = ie.getState(o).binding, l = i.undoManager, c = l.undoStack.length > 0, u = l.redoStack.length > 0;
      return a ? {
        undoManager: l,
        prevSel: Fa(a, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: l.undoStack.length > 0,
        hasRedoOps: l.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = ie.getState(r.state), s = Pt.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const a = i.binding;
      a && o.meta.set(a, Pt.getState(r.state).prevSel);
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
function rg(n) {
  return !!n.getMeta(ie);
}
function o_(n, e) {
  const t = ie.getState(n);
  return wn(t.doc, t.type, e, t.binding.mapping) || 0;
}
function ig(n, e) {
  const t = ie.getState(n);
  return oi(e, t.type, t.binding.mapping);
}
var Gi = class sg extends Bl {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new sg(e.position, e.yRelativePosition);
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
function a_(n, e) {
  const t = ig(e, n);
  return new Gi(n, t);
}
function l_(n, e, t) {
  const r = n instanceof Gi ? n.yRelativePosition : null;
  if (rg(e) && r) {
    const o = o_(t, r);
    return {
      position: new Gi(o, r),
      mapResult: null
    };
  }
  const i = zp(n, e), s = i.position.position;
  return {
    position: new Gi(
      s,
      r ?? ig(t, s)
    ),
    mapResult: i.mapResult
  };
}
var c_ = Qe.create({
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
    this.editor.utils.getUpdatedPosition = (n, e) => l_(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => a_(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Pt.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? t_(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Pt.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? n_(e) : !0)
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
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = s_(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Pt.getState(s.state);
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
      ID(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new Pe({
        key: new Ze("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!rg(s))
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
const u_ = Math.floor, d_ = (n, e) => n < e ? n : e, f_ = (n, e) => n > e ? n : e, og = 128, Yi = 127, h_ = Number.MAX_SAFE_INTEGER, p_ = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ai = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), m_ = (n) => ai.encode(n), g_ = ai ? m_ : p_;
let Br = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Br && Br.decode(new Uint8Array()).length === 1 && (Br = null);
const As = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, lo = (n, e) => {
  for (; e > Yi; )
    As(n, og | Yi & e), e = u_(e / 128);
  As(n, Yi & e);
}, Ua = new Uint8Array(3e4), y_ = Ua.length / 3, v_ = (n, e) => {
  if (e.length < y_) {
    const t = ai.encodeInto(e, Ua).written || 0;
    lo(n, t);
    for (let r = 0; r < t; r++)
      As(n, Ua[r]);
  } else
    x_(n, g_(e));
}, b_ = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  lo(n, r);
  for (let i = 0; i < r; i++)
    As(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, k_ = ai && /** @type {any} */
ai.encodeInto ? v_ : b_, w_ = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = d_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(f_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, x_ = (n, e) => {
  lo(n, e.byteLength), w_(n, e);
}, ag = (n) => new Error(n), S_ = ag("Unexpected end of array"), C_ = ag("Integer out of Range"), T_ = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, E_ = (n) => T_(n, lc(n)), Ed = (n) => n.arr[n.pos++], lc = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Yi) * t, t *= 128, i < og)
      return e;
    if (e > h_)
      throw C_;
  }
  throw S_;
}, M_ = (n) => {
  let e = lc(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(Ed(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(Ed(n));
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
}, A_ = (n) => (
  /** @type any */
  Br.decode(E_(n))
), Md = Br ? A_ : M_;
var er;
(function(n) {
  n[n.Token = 0] = "Token", n[n.PermissionDenied = 1] = "PermissionDenied", n[n.Authenticated = 2] = "Authenticated";
})(er || (er = {}));
const O_ = (n, e) => {
  lo(n, er.Token), k_(n, e);
}, D_ = (n, e, t, r) => {
  switch (lc(n)) {
    case er.Token: {
      e();
      break;
    }
    case er.PermissionDenied: {
      t(Md(n));
      break;
    }
    case er.Authenticated: {
      r(Md(n));
      break;
    }
  }
}, Ad = (n) => Array.from(n.entries()).map(([e, t]) => ({
  clientId: e,
  ...t
}));
var Wa;
(function(n) {
  n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed";
})(Wa || (Wa = {}));
function __(n) {
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
async function Ho(n) {
  return new Promise((e) => setTimeout(e, n));
}
function P_(n, e) {
  let t = e.delay;
  if (t === 0)
    return 0;
  if (e.factor && (t *= Math.pow(e.factor, n.attemptNum - 1), e.maxDelay !== 0 && (t = Math.min(t, e.maxDelay))), e.jitter) {
    const r = Math.ceil(e.minDelay), i = Math.floor(t);
    t = Math.floor(Math.random() * (i - r + 1)) + r;
  }
  return Math.round(t);
}
async function R_(n, e) {
  const t = __(e);
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
  }, i = t.calculateDelay || P_;
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
      return c && await Ho(c), s();
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
  if (o && await Ho(o), r.attemptNum < 1 && t.initialJitter) {
    const a = i(r, t);
    a && await Ho(a);
  }
  return s();
}
const lg = Math.floor, I_ = (n, e) => n < e ? n : e, N_ = (n, e) => n > e ? n : e, $_ = 64, Os = 128, B_ = 63, Lr = 127, cg = Number.MAX_SAFE_INTEGER, L_ = () => /* @__PURE__ */ new Set(), z_ = Array.from, F_ = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, li = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), V_ = (n) => li.encode(n), q_ = li ? V_ : F_;
let zr = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
zr && zr.decode(new Uint8Array()).length === 1 && (zr = null);
class U_ {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const cc = () => new U_(), ug = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, uc = (n) => {
  const e = new Uint8Array(ug(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, Ds = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Ne = (n, e) => {
  for (; e > Lr; )
    Ds(n, Os | Lr & e), e = lg(e / 128);
  Ds(n, Lr & e);
}, ja = new Uint8Array(3e4), W_ = ja.length / 3, j_ = (n, e) => {
  if (e.length < W_) {
    const t = li.encodeInto(e, ja).written || 0;
    Ne(n, t);
    for (let r = 0; r < t; r++)
      Ds(n, ja[r]);
  } else
    vr(n, q_(e));
}, H_ = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Ne(n, r);
  for (let i = 0; i < r; i++)
    Ds(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Bt = li && /** @type {any} */
li.encodeInto ? j_ : H_, K_ = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = I_(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(N_(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, vr = (n, e) => {
  Ne(n, e.byteLength), K_(n, e);
}, dg = (n) => new Error(n), fg = dg("Unexpected end of array"), hg = dg("Integer out of Range");
class J_ {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const pg = (n) => new J_(n), X_ = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, co = (n) => X_(n, xn(n)), Od = (n) => n.arr[n.pos++], xn = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Lr) * t, t *= 128, i < Os)
      return e;
    if (e > cg)
      throw hg;
  }
  throw fg;
}, G_ = (n) => {
  let e = n.arr[n.pos++], t = e & B_, r = 64;
  const i = (e & $_) > 0 ? -1 : 1;
  if ((e & Os) === 0)
    return i * t;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    if (e = n.arr[n.pos++], t = t + (e & Lr) * r, r *= 128, e < Os)
      return i * t;
    if (t > cg)
      throw hg;
  }
  throw fg;
}, Y_ = (n) => {
  let e = xn(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(Od(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(Od(n));
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
}, Z_ = (n) => (
  /** @type any */
  zr.decode(co(n))
), ci = zr ? Z_ : Y_, Q_ = (n) => {
  const e = n.pos, t = ci(n);
  return n.pos = e, t;
}, dr = Date.now, Ko = () => /* @__PURE__ */ new Map(), eP = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
};
class tP {
  constructor() {
    this._observers = Ko();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, t) {
    eP(this._observers, e, L_).add(t);
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
    return z_((this._observers.get(e) || Ko()).values()).forEach((r) => r(...t));
  }
  destroy() {
    this._observers = Ko();
  }
}
const nP = Object.keys, Dd = (n) => nP(n).length, rP = (n, e) => Object.prototype.hasOwnProperty.call(n, e), iP = (n, e) => n === e, Fr = (n, e) => {
  if (n == null || e == null)
    return iP(n, e);
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
        if (!e.has(t) || !Fr(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case Object:
      if (Dd(n) !== Dd(e))
        return !1;
      for (const t in n)
        if (!rP(n, t) || !Fr(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Fr(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Jo = 3e4;
class sP extends tP {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const t = dr();
      this.getLocalState() !== null && Jo / 2 <= t - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && Jo <= t - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && Zi(this, r, "timeout");
    }, lg(Jo / 10)), e.on("destroy", () => {
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
      lastUpdated: dr()
    });
    const o = [], a = [], l = [], c = [];
    e === null ? c.push(t) : s == null ? e != null && o.push(t) : (a.push(t), Fr(s, e) || l.push(t)), (o.length > 0 || l.length > 0 || c.length > 0) && this.emit("change", [{ added: o, updated: l, removed: c }, "local"]), this.emit("update", [{ added: o, updated: a, removed: c }, "local"]);
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
const Zi = (n, e, t) => {
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
          lastUpdated: dr()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: r }, t]), n.emit("update", [{ added: [], updated: [], removed: r }, t]));
}, Ha = (n, e, t = n.states) => {
  const r = e.length, i = cc();
  Ne(i, r);
  for (let s = 0; s < r; s++) {
    const o = e[s], a = t.get(o) || null, l = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    Ne(i, o), Ne(i, l), Bt(i, JSON.stringify(a));
  }
  return uc(i);
}, oP = (n, e, t) => {
  const r = pg(e), i = dr(), s = [], o = [], a = [], l = [], c = xn(r);
  for (let u = 0; u < c; u++) {
    const d = xn(r);
    let f = xn(r);
    const h = JSON.parse(ci(r)), p = n.meta.get(d), m = n.states.get(d), g = p === void 0 ? 0 : p.clock;
    (g < f || g === f && h === null && n.states.has(d)) && (h === null ? d === n.clientID && n.getLocalState() != null ? f++ : n.states.delete(d) : n.states.set(d, h), n.meta.set(d, {
      clock: f,
      lastUpdated: i
    }), p === void 0 && h !== null ? s.push(d) : p !== void 0 && h === null ? l.push(d) : h !== null && (Fr(h, m) || a.push(d), o.push(d)));
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
class mg {
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
class Ka {
  constructor(e) {
    this.data = e, this.encoder = cc(), this.decoder = pg(new Uint8Array(this.data));
  }
  peekVarString() {
    return Q_(this.decoder);
  }
  readVarUint() {
    return xn(this.decoder);
  }
  readVarString() {
    return ci(this.decoder);
  }
  readVarUint8Array() {
    return co(this.decoder);
  }
  writeVarUint(e) {
    return Ne(this.encoder, e);
  }
  writeVarString(e) {
    return Bt(this.encoder, e);
  }
  writeVarUint8Array(e) {
    return vr(this.encoder, e);
  }
  length() {
    return ug(this.encoder);
  }
}
var Ee;
(function(n) {
  n[n.Sync = 0] = "Sync", n[n.Awareness = 1] = "Awareness", n[n.Auth = 2] = "Auth", n[n.QueryAwareness = 3] = "QueryAwareness", n[n.Stateless = 5] = "Stateless", n[n.CLOSE = 7] = "CLOSE", n[n.SyncStatus = 8] = "SyncStatus";
})(Ee || (Ee = {}));
var Le;
(function(n) {
  n.Connecting = "connecting", n.Connected = "connected", n.Disconnected = "disconnected";
})(Le || (Le = {}));
class Ln {
  constructor() {
    this.encoder = cc();
  }
  get(e) {
    return e.encoder;
  }
  toUint8Array() {
    return uc(this.encoder);
  }
}
class aP extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.CLOSE, this.description = "Ask the server to close the connection";
  }
  get(e) {
    return Bt(this.encoder, e.documentName), Ne(this.encoder, this.type), this.encoder;
  }
}
class lP extends mg {
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
    this.configuration.providerMap.has(e.configuration.name) && (e.send(aP, {
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
        retryPromise: R_(this.createWebSocketConnection.bind(this), {
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
    this.resolveConnectionAttempt(), this.lastMessageReceived = dr();
    const i = new Ka(e.data).peekVarString();
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
    this.status === Le.Connected && this.lastMessageReceived && (this.configuration.messageReconnectTimeout >= dr() - this.lastMessageReceived || (this.closeTries += 1, this.closeTries > 2 ? (this.onClose({
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
    ((t = this.webSocket) === null || t === void 0 ? void 0 : t.readyState) === Wa.Open ? this.webSocket.send(e) : this.messageQueue.push(e);
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
const gg = 0, dc = 1, yg = 2, cP = (n, e) => {
  Ne(n, gg);
  const t = W.encodeStateVector(e);
  vr(n, t);
}, uP = (n, e, t) => {
  Ne(n, dc), vr(n, W.encodeStateAsUpdate(e, t));
}, dP = (n, e, t) => uP(e, t, co(n)), vg = (n, e, t) => {
  try {
    W.applyUpdate(e, co(n), t);
  } catch (r) {
    console.error("Caught error while handling a Yjs update", r);
  }
}, fP = (n, e) => {
  Ne(n, yg), vr(n, e);
}, hP = vg, pP = (n, e, t, r) => {
  const i = xn(n);
  switch (i) {
    case gg:
      dP(n, e, t);
      break;
    case dc:
      vg(n, t, r);
      break;
    case yg:
      hP(n, t, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
class mP {
  constructor(e) {
    this.message = e;
  }
  apply(e, t) {
    const { message: r } = this, i = r.readVarUint(), s = r.length();
    switch (i) {
      case Ee.Sync:
        this.applySyncMessage(e, t);
        break;
      case Ee.Awareness:
        this.applyAwarenessMessage(e);
        break;
      case Ee.Auth:
        this.applyAuthMessage(e);
        break;
      case Ee.QueryAwareness:
        this.applyQueryAwarenessMessage(e);
        break;
      case Ee.Stateless:
        e.receiveStateless(ci(r.decoder));
        break;
      case Ee.SyncStatus:
        this.applySyncStatusMessage(e, G_(r.decoder) === 1);
        break;
      case Ee.CLOSE:
        const o = {
          code: 1e3,
          reason: ci(r.decoder),
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
    r.writeVarUint(Ee.Sync);
    const i = pP(r.decoder, r.encoder, e.document, e);
    t && i === dc && (e.synced = !0);
  }
  applySyncStatusMessage(e, t) {
    t && e.decrementUnsyncedChanges();
  }
  applyAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    oP(e.awareness, t.readVarUint8Array(), e);
  }
  applyAuthMessage(e) {
    const { message: t } = this;
    D_(t.decoder, e.sendToken.bind(e), e.permissionDeniedHandler.bind(e), e.authenticatedHandler.bind(e));
  }
  applyQueryAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    t.writeVarUint(Ee.Awareness), t.writeVarUint8Array(Ha(e.awareness, Array.from(e.awareness.getStates().keys())));
  }
}
class gP {
  constructor(e, t = {}) {
    this.message = new e(), this.encoder = this.message.get(t);
  }
  create() {
    return uc(this.encoder);
  }
  send(e) {
    e?.send(this.create());
  }
}
class yP extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.Auth, this.description = "Authentication";
  }
  get(e) {
    if (typeof e.token > "u")
      throw new Error("The authentication message requires `token` as an argument.");
    return Bt(this.encoder, e.documentName), Ne(this.encoder, this.type), O_(this.encoder, e.token), this.encoder;
  }
}
class _d extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.Awareness, this.description = "Awareness states update";
  }
  get(e) {
    if (typeof e.awareness > "u")
      throw new Error("The awareness message requires awareness as an argument");
    if (typeof e.clients > "u")
      throw new Error("The awareness message requires clients as an argument");
    Bt(this.encoder, e.documentName), Ne(this.encoder, this.type);
    let t;
    return e.states === void 0 ? t = Ha(e.awareness, e.clients) : t = Ha(e.awareness, e.clients, e.states), vr(this.encoder, t), this.encoder;
  }
}
class vP extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.Stateless, this.description = "A stateless message";
  }
  get(e) {
    var t;
    return Bt(this.encoder, e.documentName), Ne(this.encoder, this.type), Bt(this.encoder, (t = e.payload) !== null && t !== void 0 ? t : ""), this.encoder;
  }
}
class Pd extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.Sync, this.description = "First sync step";
  }
  get(e) {
    if (typeof e.document > "u")
      throw new Error("The sync step one message requires document as an argument");
    return Bt(this.encoder, e.documentName), Ne(this.encoder, this.type), cP(this.encoder, e.document), this.encoder;
  }
}
class bP extends Ln {
  constructor() {
    super(...arguments), this.type = Ee.Sync, this.description = "A document update";
  }
  get(e) {
    return Bt(this.encoder, e.documentName), Ne(this.encoder, this.type), fP(this.encoder, e.update), this.encoder;
  }
}
class kP extends Error {
  constructor() {
    super(...arguments), this.code = 1001;
  }
}
class wP extends mg {
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
    }, this.boundDocumentUpdateHandler = this.documentUpdateHandler.bind(this), this.boundAwarenessUpdateHandler = this.awarenessUpdateHandler.bind(this), this.boundPageHide = this.pageHide.bind(this), this.boundOnOpen = this.onOpen.bind(this), this.boundOnClose = this.onClose.bind(this), this.forwardConnect = () => this.emit("connect"), this.forwardStatus = (s) => this.emit("status", s), this.forwardClose = (s) => this.emit("close", s), this.forwardDisconnect = (s) => this.emit("disconnect", s), this.forwardDestroy = () => this.emit("destroy"), this.setConfiguration(e), this.configuration.document = e.document ? e.document : new W.Doc(), this.configuration.awareness = e.awareness !== void 0 ? e.awareness : new sP(this.document), this.on("open", this.configuration.onOpen), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("synced", this.configuration.onSynced), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("stateless", this.configuration.onStateless), this.on("unsyncedChanges", this.configuration.onUnsyncedChanges), this.on("authenticated", this.configuration.onAuthenticated), this.on("authenticationFailed", this.configuration.onAuthenticationFailed), (t = this.awareness) === null || t === void 0 || t.on("update", () => {
      this.emit("awarenessUpdate", {
        states: Ad(this.awareness.getStates())
      });
    }), (r = this.awareness) === null || r === void 0 || r.on("change", () => {
      this.emit("awarenessChange", {
        states: Ad(this.awareness.getStates())
      });
    }), this.document.on("update", this.boundDocumentUpdateHandler), (i = this.awareness) === null || i === void 0 || i.on("update", this.boundAwarenessUpdateHandler), this.registerEventListeners(), this.configuration.forceSyncInterval && typeof this.configuration.forceSyncInterval == "number" && (this.intervals.forceSync = setInterval(this.forceSync.bind(this), this.configuration.forceSyncInterval)), this.manageSocket && this.attach();
  }
  setConfiguration(e = {}) {
    e.websocketProvider || (this.manageSocket = !0, this.configuration.websocketProvider = new lP(e)), this.configuration = { ...this.configuration, ...e };
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
    this.resetUnsyncedChanges(), this.send(Pd, {
      document: this.document,
      documentName: this.configuration.name
    });
  }
  pageHide() {
    this.awareness && Zi(this.awareness, [this.document.clientID], "page hide");
  }
  registerEventListeners() {
    typeof window > "u" || !("addEventListener" in window) || window.addEventListener("pagehide", this.boundPageHide);
  }
  sendStateless(e) {
    this.send(vP, {
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
    this.send(yP, {
      token: e ?? "",
      documentName: this.configuration.name
    });
  }
  documentUpdateHandler(e, t) {
    t !== this && (this.incrementUnsyncedChanges(), this.send(bP, { update: e, documentName: this.configuration.name }));
  }
  awarenessUpdateHandler({ added: e, updated: t, removed: r }, i) {
    const s = e.concat(t).concat(r);
    this.send(_d, {
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
    this.resetUnsyncedChanges(), this.send(Pd, {
      document: this.document,
      documentName: this.configuration.name
    }), this.awareness && this.awareness.getLocalState() !== null && this.send(_d, {
      awareness: this.awareness,
      clients: [this.document.clientID],
      documentName: this.configuration.name
    });
  }
  send(e, t) {
    if (!this._isAttached)
      return;
    const r = new gP(e, t);
    this.emit("outgoingMessage", { message: r.message }), r.send(this.configuration.websocketProvider);
  }
  onMessage(e) {
    const t = new Ka(e.data), r = t.readVarString();
    t.writeVarString(r), this.emit("message", { event: e, message: new Ka(e.data) }), new mP(t).apply(this, !0);
  }
  onClose() {
    this.isAuthenticated = !1, this.synced = !1, this.awareness && Zi(this.awareness, Array.from(this.awareness.getStates().keys()).filter((e) => e !== this.document.clientID), this);
  }
  destroy() {
    this.emit("destroy"), this.intervals.forceSync && clearInterval(this.intervals.forceSync), this.awareness && (Zi(this.awareness, [this.document.clientID], "provider destroy"), this.awareness.off("update", this.boundAwarenessUpdateHandler), this.awareness.destroy()), this.document.off("update", this.boundDocumentUpdateHandler), this.removeAllListeners(), this.detach(), this.manageSocket && this.configuration.websocketProvider.destroy(), !(typeof window > "u" || !("removeEventListener" in window)) && window.removeEventListener("pagehide", this.boundPageHide);
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
      throw new kP(`Cannot set awareness field "${e}" to ${JSON.stringify(t)}. You have disabled Awareness for this provider by explicitly passing awareness: null in the provider configuration.`);
    this.awareness.setLocalStateField(e, t);
  }
}
const bg = Vl.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), xP = {
  type: "button",
  class: "speaker-popover-trigger"
}, SP = { class: "speaker-popover-name" }, CP = /* @__PURE__ */ B({
  __name: "SpeakerPopover",
  props: {
    turnId: {},
    currentSpeakerId: {}
  },
  setup(n) {
    const e = n, t = qe(), { t: r } = he(), i = _(!1), s = _(!1), o = _(""), a = It("newInput"), l = E(() => Array.from(t.speakers.all.values())), c = E(() => ({
      placeholder: r("speakerPopover.newSpeakerPlaceholder"),
      customParams: { "aria-label": r("speakerPopover.newSpeaker") }
    }));
    Y(i, (m) => {
      m || (s.value = !1, o.value = "");
    });
    async function u() {
      s.value = !0, o.value = "", await ke(), a.value?.focus();
    }
    function d(m) {
      m.id !== e.currentSpeakerId && hM(t, e.turnId, m.id), i.value = !1;
    }
    function f() {
      const m = o.value.trim();
      if (!m) {
        s.value = !1;
        return;
      }
      pM(t, e.turnId, m), i.value = !1;
    }
    function h(m) {
      m.stopPropagation();
    }
    function p() {
      s.value = !1;
    }
    return (m, g) => (T(), I(ql, {
      open: i.value,
      "onUpdate:open": g[1] || (g[1] = (y) => i.value = y),
      items: l.value,
      "item-key": (y) => y.id,
      "is-current": (y) => y.id === n.currentSpeakerId,
      onSelect: d
    }, {
      trigger: $(() => [
        V("button", xP, [
          J(m.$slots, "default", {}, void 0, !0)
        ])
      ]),
      item: $(({ item: y }) => [
        q(Ps, {
          color: y.color
        }, null, 8, ["color"]),
        V("span", SP, K(y.name), 1)
      ]),
      footer: $(() => [
        s.value ? (T(), I(bi, {
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
        }, null, 8, ["modelValue", "field"])) : (T(), I(ve, {
          key: 0,
          icon: "user-plus",
          variant: "transparent",
          block: "",
          onClick: u
        }, {
          default: $(() => [
            be(K(k(r)("speakerPopover.newSpeaker")), 1)
          ]),
          _: 1
        }))
      ]),
      _: 3
    }, 8, ["open", "items", "item-key", "is-current"]));
  }
}), TP = /* @__PURE__ */ te(CP, [["__scopeId", "data-v-68980c2e"]]), EP = {
  contenteditable: "false",
  class: "turn-header"
}, MP = /* @__PURE__ */ B({
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
    const e = n, t = qe(), r = E(() => {
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
    return (a, l) => (T(), I(k(yT), {
      as: "section",
      class: ct(["turn", { "turn--active": o.value }]),
      style: Pn({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: $(() => [
        V("div", EP, [
          s.value ? (T(), I(TP, {
            key: 0,
            "turn-id": n.node.attrs.id,
            "current-speaker-id": n.node.attrs.speakerId
          }, {
            default: $(() => [
              q(Qo, {
                speaker: r.value,
                "start-time": n.node.attrs.startTime,
                language: n.node.attrs.language
              }, null, 8, ["speaker", "start-time", "language"])
            ]),
            _: 1
          }, 8, ["turn-id", "current-speaker-id"])) : (T(), I(Qo, {
            key: 1,
            speaker: r.value,
            "start-time": n.node.attrs.startTime,
            language: n.node.attrs.language
          }, null, 8, ["speaker", "start-time", "language"]))
        ]),
        q(k(gT), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), AP = /* @__PURE__ */ te(MP, [["__scopeId", "data-v-a99ead44"]]), kg = Vl.create({
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
      Ip(n, { "data-type": "turn" }),
      0
    ];
  },
  addKeyboardShortcuts() {
    const n = Fh((e) => e.type.name !== "turn" ? null : {
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
    return kT(AP);
  }
});
function OP(n) {
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
      startDate: t.attrs.startDate,
      endDate: t.attrs.endDate,
      language: t.attrs.language ?? ""
    });
  }), e;
}
const DP = new Ze("storeSync"), _P = Qe.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new Pe({
        key: DP,
        appendTransaction(t, r, i) {
          if (r.doc.eq(i.doc)) return null;
          if (!t.some(
            (a) => a.getMeta(ie)
          )) {
            const a = RP(i);
            if (a) return a;
          }
          const o = e();
          return o && PP(i.doc, o, n), null;
        }
      })
    ];
  }
});
function PP(n, e, t) {
  const r = OP(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((f) => f.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), a = e.id, l = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    l.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: a });
  for (const c of o) {
    const u = s.get(c.id);
    u ? IP(u, c) && t.emit("turn:update", { turn: c, translationId: a }) : t.emit("turn:add", { turn: c, translationId: a });
  }
  e.replaceTurns(o);
}
function RP(n) {
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
function IP(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const Bi = new Ze("wordHighlight"), NP = Qe.create({
  name: "wordHighlight",
  addProseMirrorPlugins() {
    const { core: n } = this.options, e = this.editor;
    function t() {
      const i = n.audio?.activeWordId.value;
      if (!i) return oe.empty;
      const s = n.activeChannel.value?.activeTranslation.value;
      if (!s) return oe.empty;
      const o = e.state.doc;
      let a = oe.empty;
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
            a = oe.create(o, [
              je.inline(m, g, {
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
      new Pe({
        key: Bi,
        state: {
          init() {
            return oe.empty;
          },
          apply(i, s) {
            return i.getMeta(Bi) ? t() : i.docChanged ? s.map(i.mapping, i.doc) : s;
          }
        },
        props: {
          decorations(i) {
            return Bi.getState(i);
          }
        },
        view() {
          return r = Y(
            () => n.audio?.activeWordId.value,
            () => {
              const i = e.state.tr.setMeta(Bi, !0);
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
}), $P = Qe.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      n.setLocalStateField("user", e);
      const t = /* @__PURE__ */ new Map();
      return [
        e_(n, {
          cursorBuilder: (r, i) => BP(t, r, i)
        })
      ];
    }
  }
);
function BP(n, e, t) {
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
function LP(n) {
  return {
    type: "doc",
    content: n.map((e) => zP(e))
  };
}
function zP(n) {
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
function wg(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function oR(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(wg), o = s[0]?.startTime ?? i.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
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
const xg = "speakers";
function FP(n) {
  let e = 5381;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) + e ^ n.charCodeAt(t);
  return tr[(e >>> 0) % tr.length];
}
function Rd(n, e, t) {
  return e.color ?? t?.color ?? FP(n);
}
function Id(n) {
  const { core: e, ydoc: t, translation: r, seedFromCore: i } = n, s = t.getMap(xg);
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
    const h = Rd(d, f, e.speakers.all.get(d));
    e.speakers.updateOrCreate({ id: d, name: f.name, color: h });
  }
  const o = (d) => {
    d.changes.keys.forEach((f, h) => {
      if (f.action === "delete")
        e.speakers.delete(h);
      else {
        const p = s.get(h);
        if (!p) return;
        const m = Rd(h, p, e.speakers.all.get(h));
        e.speakers.updateOrCreate({ id: h, name: p.name, color: m });
      }
    });
  };
  s.observe(o);
  const a = (d) => {
    const f = s.get(d.id);
    f && Yo(f, d) || s.set(d.id, { name: d.name, color: d.color });
  }, l = e.on("speaker:add", ({ speaker: d }) => a(d)), c = e.on("speaker:update", ({ speaker: d }) => a(d)), u = e.on("speaker:remove", ({ speakerId: d }) => {
    s.delete(d);
  });
  return () => {
    s.unobserve(o), l(), c(), u();
  };
}
function aR(n = {}) {
  const {
    collab: e,
    field: t = "default",
    user: r = { name: "Anonymous", color: "#999999" }
  } = n;
  return {
    name: "transcriptionEditor",
    install(i) {
      const s = Rt(void 0), o = _([]), a = _(!1), l = [], c = [];
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
          return d?.getMap(xg) ?? null;
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
        const b = new Ug();
        if (d = b, e) {
          const v = new wP({
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
            onAwarenessUpdate({ states: S }) {
              o.value = S.map((M) => ({
                clientId: M.clientId,
                ...M.user
              }));
            },
            onStateless({ payload: S }) {
              VP(S, y);
            }
          });
          u = v;
          const w = Y(a, (S) => {
            S && (w(), c.push(
              Id({ core: i, ydoc: b, translation: y, seedFromCore: !1 })
            ), $d(i, n, b, t, s, v.awareness, l));
          }, { immediate: !0 });
          l.push(w);
        } else {
          const v = b.getXmlFragment(t), w = LP(y.turns.value), S = fC([bg, kg, Em]);
          XD(S, w, v), a.value = !0, c.push(
            Id({ core: i, ydoc: b, translation: y, seedFromCore: !0 })
          ), $d(i, n, b, t, s, null, l);
        }
      }
      const m = Y(
        () => i.activeChannel.value,
        (g) => {
          if (!g) return;
          m();
          const y = E(
            () => i.activeChannel.value.activeTranslation.value
          );
          p(y.value.id, y.value);
          const b = Y(
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
function VP(n, e) {
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
      const s = r.words.map(wg), o = Nd(
        s.filter((l) => l.text !== "").map((l) => l.text).join(" ")
      ), a = Nd(
        i.text ?? i.words.map((l) => l.text).join(" ")
      );
      o === a && e.updateWords(r.turn_id, s);
    }
}
function Nd(n) {
  return n.replace(/\s+/g, " ").trim();
}
function $d(n, e, t, r, i, s, o) {
  const a = E(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    bg,
    kg,
    Em,
    c_.configure({
      document: t,
      field: r
    }),
    _P.configure({
      store: n,
      getTranslation: () => a.value
    }),
    NP.configure({ core: n }),
    ...n.pluginExtensions
  ];
  s && l.push(
    $P.configure({
      awareness: s,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  ), i.value = new pT({
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
function Bd(n) {
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
function Xo(n, e) {
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
function lR() {
  return {
    name: "live",
    install(n) {
      const e = Rt(null), t = _(!1);
      t.value = !0;
      function r() {
        e.value = null;
      }
      function i(v, w) {
        if (n.activeChannelId.value !== w) return;
        const S = n.activeChannel.value;
        if (!S) return;
        const M = S.activeTranslation.value;
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
        const S = n.channels.get(w);
        if (!S) {
          f();
          return;
        }
        if (v.text != null && l(
          S.sourceTranslation,
          Bd(v)
        ), v.translations)
          for (const x of v.translations) {
            const A = S.translations.get(x.translationId);
            A && l(
              A,
              Xo(v, x)
            );
          }
        n.activeChannel.value?.activeTranslation.value?.isSource && f();
      }
      function u(v, w) {
        d([v], w);
      }
      function d(v, w) {
        const S = n.channels.get(w);
        if (!S) return;
        const M = /* @__PURE__ */ new Set();
        for (const C of v)
          C.speakerId && !M.has(C.speakerId) && (M.add(C.speakerId), n.speakers.ensure(C.speakerId));
        const x = [];
        for (const C of v)
          C.text != null && x.push(Bd(C));
        x.length > 0 && S.sourceTranslation.prependTurns(x);
        const A = /* @__PURE__ */ new Map();
        for (const C of v)
          if (C.translations)
            for (const O of C.translations) {
              let D = A.get(O.translationId);
              D || (D = [], A.set(O.translationId, D)), D.push(Xo(C, O));
            }
        for (const [C, O] of A) {
          const D = S.translations.get(C);
          D && D.prependTurns(O);
        }
      }
      function f() {
        a(), r();
      }
      function h(v) {
        const w = n.activeChannel.value;
        if (!w) return;
        const S = w.activeTranslation.value;
        if (!v.final && S.languages.includes(v.language))
          e.value = v.text;
        else if (v.final) {
          const M = w.translations.get(v.language);
          if (M) {
            const x = Xo(
              { ...v },
              v
            );
            M === S ? l(M, x) : M.updateOrCreateTurnSilent(x);
          }
          S.languages.includes(v.language) && f();
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
function cR(n = {}) {
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
          Y(
            s.display,
            (c) => e.emit("watermark:display", { display: c })
          ),
          Y(
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
function qP(n) {
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
function Ld(n) {
  return !Number.isFinite(n) || n < 0 ? 0 : n > 100 ? 100 : n;
}
function uR() {
  return {
    name: "llmServices",
    install(n) {
      const e = /* @__PURE__ */ new Map(), t = Rt([]), r = _(null);
      function i() {
        t.value = Array.from(e.values());
      }
      function s(b) {
        return e.get(b);
      }
      function o(b) {
        const v = e.get(b.id);
        if (v)
          return b.label !== void 0 && (v.label.value = b.label), b.description !== void 0 && (v.description.value = b.description), b.content !== void 0 && (v.content.value = b.content), b.status !== void 0 && (v.status.value = b.status), b.progress !== void 0 && (v.progress.value = Ld(b.progress)), b.phase !== void 0 && (v.phase.value = b.phase), b.error !== void 0 && (v.error.value = b.error), b.lastUpdate !== void 0 && (v.lastUpdate.value = b.lastUpdate), v;
        const w = qP(b);
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
        const S = s(b);
        S && (S.progress.value = Ld(v), w !== void 0 && (S.phase.value = w));
      }
      function p(b, v, w) {
        const S = s(b);
        S && (S.content.value = v, S.lastUpdate.value = w ?? Date.now());
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
let Sg = 0;
function UP(n) {
  return {
    id: `w_${Sg++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function dR(n) {
  Sg = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = s.words.map(UP);
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
  We as DocumentValidationError,
  nR as Layout,
  rR as createAudioPlugin,
  HP as createCore,
  uR as createLLMServicesPlugin,
  lR as createLivePlugin,
  cR as createSubtitlePlugin,
  aR as createTranscriptionEditorPlugin,
  oR as mapApiDocument,
  dR as mapWhisperXDocument,
  KP as provideCore,
  JP as provideI18n,
  qe as useCore,
  oy as validateEditorDocument
};
