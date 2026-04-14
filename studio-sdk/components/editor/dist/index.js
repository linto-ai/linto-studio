import * as Gn from "vue";
import { shallowReactive as On, shallowRef as Xe, ref as A, computed as T, inject as xt, provide as _t, h as Le, defineComponent as F, openBlock as E, createElementBlock as W, renderSlot as V, useSlots as Vs, normalizeClass as mt, createCommentVNode as K, createElementVNode as N, toDisplayString as X, createVNode as M, withCtx as I, createTextVNode as ae, createBlock as $, unref as p, watchEffect as be, onBeforeUnmount as lt, normalizeStyle as ut, watch as Z, onMounted as se, withModifiers as Fe, Fragment as ge, renderList as Ge, createStaticVNode as js, Transition as Ri, useTemplateRef as gt, nextTick as oe, isMemoSame as Us, useId as Ks, customRef as Xs, toValue as ue, getCurrentScope as $i, onScopeDispose as Bi, effectScope as qi, getCurrentInstance as Je, readonly as Ys, toHandlerKey as Gs, camelize as Fi, toRef as Lt, onUnmounted as Et, toRefs as ct, Comment as Js, mergeProps as Q, cloneVNode as Zs, reactive as zi, Teleport as Ni, normalizeProps as In, guardReactiveProps as Dn, markRaw as Qs, watchPostEffect as Wi, shallowReadonly as nt, mergeDefaults as eo, withKeys as yn, withMemo as to, resolveDynamicComponent as no, useModel as io, withDirectives as so, vShow as oo } from "vue";
function ro() {
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
const Jn = [
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
function ao(n, e, t) {
  const i = Jn[n.size % Jn.length];
  return { id: e, name: t, color: i };
}
function lo(n, e, t) {
  return !e || n.has(e) ? null : ao(n, e, t ?? e);
}
function uo(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function co(n) {
  const e = On(/* @__PURE__ */ new Map());
  function t(o, r) {
    const a = lo(e, o, r);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(o, r) {
    const a = uo(e, o, r);
    a && (e.set(o, a), n("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: s };
}
function fo(n, e) {
  return [...n, e];
}
function po(n, e) {
  return [...e, ...n];
}
function Ln(n, e) {
  return n.findIndex((t) => t.id === e);
}
function ho(n, e, t) {
  const i = Ln(n, e);
  if (i === -1) return null;
  const s = { ...n[i], ...t, id: e }, o = n.slice();
  return o[i] = s, { turns: o, updated: s };
}
function vo(n, e) {
  const t = Ln(n, e);
  return t === -1 ? null : n.filter((i, s) => s !== t);
}
function mo(n, e, t) {
  const i = Ln(n, e);
  if (i === -1) return null;
  const s = n[i], o = {
    ...s,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? s.startTime,
    endTime: t[t.length - 1]?.endTime ?? s.endTime
  }, r = n.slice();
  return r[i] = o, { turns: r, updated: o };
}
function bn(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function go(n, e, t) {
  const { id: i, languages: s, isSource: o, audio: r } = n, a = Xe(n.turns), l = /* @__PURE__ */ new Map();
  function u() {
    l.clear();
    const y = a.value;
    for (let g = 0; g < y.length; g++)
      l.set(y[g].id, g);
  }
  u();
  function c(y) {
    t(y.speakerId), l.set(y.id, a.value.length), a.value = fo(a.value, y), e("turn:add", { turn: y, translationId: i });
  }
  function d(y, g) {
    const C = ho(a.value, y, g);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function v(y) {
    const g = vo(a.value, y);
    g && (a.value = g, u(), e("turn:remove", { turnId: y, translationId: i }));
  }
  function f(y, g) {
    const C = mo(a.value, y, g);
    C && (a.value = C.turns, e("turn:update", { turn: C.updated, translationId: i }));
  }
  function h(y) {
    bn(y, t), a.value = po(a.value, y), u();
  }
  function b(y) {
    bn(y, t), a.value = y, u(), e("translation:sync", { translationId: i });
  }
  function m(y) {
    a.value = y, u();
  }
  function _(y) {
    const g = l.get(y.id);
    g !== void 0 ? a.value[g] = y : (l.set(y.id, a.value.length), a.value.push(y));
  }
  function S(y) {
    return l.has(y);
  }
  return { id: i, languages: s, isSource: o, audio: r, turns: a, addTurn: c, prependTurns: h, updateTurn: d, removeTurn: v, updateWords: f, setTurns: b, replaceTurns: m, updateOrCreateTurnSilent: _, hasTurn: S };
}
function Zn(n, e, t) {
  const { id: i, name: s, description: o, duration: r } = n, a = On(/* @__PURE__ */ new Map());
  let l;
  for (const b of n.translations) {
    const m = go(b, e, t);
    a.set(b.id, m), b.isSource && !l && (l = m);
  }
  l || (l = a.values().next().value);
  const u = A(null), c = A(!1), d = A(!0), v = T(() => u.value ? a.get(u.value) ?? l : l);
  function f(b) {
    const m = b === l.id ? null : b;
    m !== u.value && (u.value = m, e("translation:change", { translationId: v.value.id }));
  }
  function h() {
    for (const b of a.values())
      b.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: i });
  }
  return {
    id: i,
    name: s,
    description: o,
    duration: r,
    translations: a,
    sourceTranslation: l,
    activeTranslation: v,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: f,
    reset: h
  };
}
function yo(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, s] of n.speakers)
    e.add(i), t.push({ id: i, name: s.name });
  for (const i of n.channels)
    for (const s of i.translations)
      for (const o of s.turns)
        o.speakerId && !e.has(o.speakerId) && (e.add(o.speakerId), t.push({ id: o.speakerId, name: o.speakerId }));
  return t;
}
function bo(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), o = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${s}, ${o}, ${e})`;
}
function Mn(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function Hi(n, e, t, i = "*") {
  return n.map((s) => ({
    value: s.id,
    label: s.languages.map((o) => Mn(o, e, i)).join(", ") + (s.isSource ? ` (${t})` : "")
  }));
}
function wo(n, e = 250) {
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
function yt(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), s = e % 60, o = String(i).padStart(2, "0"), r = String(s).padStart(2, "0");
  return t > 0 ? `${t}:${o}:${r}` : `${o}:${r}`;
}
class fe extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function So(n) {
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
    const i = e.channels[t], s = `channels[${t}]`;
    if (i == null || typeof i != "object")
      throw new fe(s, "must be a non-null object");
    if (typeof i.id != "string")
      throw new fe(`${s}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new fe(`${s}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new fe(`${s}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new fe(`${s}.translations`, "must be an array");
    for (let o = 0; o < i.translations.length; o++) {
      const r = i.translations[o], a = `${s}.translations[${o}]`;
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
function Co(n, e) {
  const { width: t, height: i } = e.canvas, s = n[0], o = s.length / t, r = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += r * 2) {
    const l = Math.floor(a * o), u = Math.abs(s[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0), c = c + r, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + r, 0);
  }
  e.stroke(), e.closePath();
}
function Vi(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function xo(n, e) {
  if (!Vi(n)) return null;
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
function Nd(n = {}) {
  const e = A(""), t = A(n.activeChannelId ?? ""), i = A(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: r, clear: a } = ro(), l = co(r), u = l, c = On(/* @__PURE__ */ new Map()), d = T(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function v(x, w) {
    return s(x, (O) => {
      O.translationId === d.value.activeTranslation.value.id && w(O);
    });
  }
  function f(x) {
    e.value = x.title, l.clear(), c.clear();
    for (const w of yo(x))
      u.ensure(w.id, w.name);
    for (const w of x.channels)
      c.set(w.id, Zn(w, r, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function h(x) {
    So(x), f(x);
  }
  function b(x) {
    x !== t.value && (t.value = x, r("channel:change", { channelId: x }));
  }
  function m(x, w) {
    if (c.has(x)) {
      for (const O of w.translations)
        bn(O.turns, u.ensure);
      c.set(x, Zn(w, r, u.ensure)), r("channel:sync", { channelId: x });
    }
  }
  const _ = [], S = [];
  function y(x) {
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
    onActiveTranslation: v,
    setDocument: h,
    setActiveChannel: b,
    setChannel: m,
    on: s,
    off: o,
    emit: r,
    use: y,
    destroy: g
  };
  return C;
}
const ji = /* @__PURE__ */ Symbol("editorStore");
function Wd(n) {
  _t(ji, n);
}
function Ze() {
  const n = xt(ji);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const _o = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Qn = (n) => n === "";
const Eo = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const ei = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const ko = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const To = (n) => {
  const e = ko(n);
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
const Po = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: s,
  "stroke-width": o,
  size: r = pt.width,
  color: a = pt.stroke,
  ...l
}, { slots: u }) => Le(
  "svg",
  {
    ...pt,
    ...l,
    width: r,
    height: r,
    stroke: a,
    "stroke-width": Qn(t) || Qn(i) || t === !0 || i === !0 ? Number(s || o || pt["stroke-width"]) * 24 / Number(r) : s || o || pt["stroke-width"],
    class: Eo(
      "lucide",
      l.class,
      ...n ? [`lucide-${ei(To(n))}-icon`, `lucide-${ei(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !_o(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Le(...c)), ...u.default ? [u.default()] : []]
);
const ce = (n, e) => (t, { slots: i, attrs: s }) => Le(
  Po,
  {
    ...s,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const Ao = ce("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Rn = ce("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Oo = ce("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Io = ce("clipboard-list", [
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
const Do = ce("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const ti = ce("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Lo = ce("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Mo = ce("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Ro = ce("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const $o = ce("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Bo = ce("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const qo = ce("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Fo = ce("volume-2", [
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
const zo = ce("volume-x", [
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
const $n = ce("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), No = ["aria-label"], Wo = /* @__PURE__ */ F({
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
    ], 8, No));
  }
}), re = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, s] of e)
    t[i] = s;
  return t;
}, wn = /* @__PURE__ */ re(Wo, [["__scopeId", "data-v-3d3f8eba"]]), Ho = ["disabled", "aria-label"], Vo = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, jo = /* @__PURE__ */ F({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = Vs(), i = T(() => !!t.icon && !t.default), s = T(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (o, r) => (E(), W("button", {
      type: "button",
      class: mt(s.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      o.$slots.icon ? (E(), W("span", Vo, [
        V(o.$slots, "icon", {}, void 0, !0)
      ])) : K("", !0),
      V(o.$slots, "default", {}, void 0, !0)
    ], 10, Ho));
  }
}), me = /* @__PURE__ */ re(jo, [["__scopeId", "data-v-4bee0d19"]]), Ui = {
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
}, Uo = {
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
}, ni = { fr: Ui, en: Uo }, Ki = /* @__PURE__ */ Symbol("i18n");
function Hd(n) {
  const e = T(() => {
    const i = ni[n.value] ?? ni.fr;
    return (s) => i[s] ?? s;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return _t(Ki, t), t;
}
function we() {
  const n = xt(Ki);
  if (n) return n;
  const e = T(() => "fr");
  return {
    t: (t) => Ui[t] ?? t,
    locale: e
  };
}
const Ko = { class: "editor-header" }, Xo = { class: "header-left" }, Yo = { class: "document-title" }, Go = { class: "badges" }, Jo = ["datetime"], Zo = { class: "header-right" }, Qo = /* @__PURE__ */ F({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = we(), s = T(() => Mn(e.language, i.value, t("language.wildcard"))), o = T(() => yt(e.duration)), r = T(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), W("header", Ko, [
      N("div", Xo, [
        N("h1", Yo, X(r.value), 1),
        N("div", Go, [
          M(wn, null, {
            default: I(() => [
              ae(X(s.value), 1)
            ]),
            _: 1
          }),
          M(wn, null, {
            default: I(() => [
              N("time", {
                datetime: `PT${n.duration}S`
              }, X(o.value), 9, Jo)
            ]),
            _: 1
          })
        ])
      ]),
      N("div", Zo, [
        n.isMobile ? (E(), $(me, {
          key: 0,
          variant: "ghost",
          "aria-label": p(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: I(() => [
            M(p(qo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (E(), $(me, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": p(t)("header.export")
        }, {
          icon: I(() => [
            M(p(ti), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (E(), $(me, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: I(() => [
            M(p(ti), { size: 16 })
          ]),
          default: I(() => [
            ae(" " + X(p(t)("header.export")), 1)
          ]),
          _: 1
        })),
        M(me, {
          variant: "ghost",
          disabled: "",
          "aria-label": p(t)("header.settings")
        }, {
          icon: I(() => [
            M(p(Ro), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), er = /* @__PURE__ */ re(Qo, [["__scopeId", "data-v-f16781f3"]]), nn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, tr = 70, nr = 1e3 / 60, ir = 350;
let Mt = !1, ii = !1;
function sr() {
  ii || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Mt = !0;
  }), document.addEventListener("mouseup", () => {
    Mt = !1;
  }), document.addEventListener("click", () => {
    Mt = !1;
  }), ii = !0);
}
const sn = /* @__PURE__ */ new Map();
function on(...n) {
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
function or(n = {}) {
  sr();
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
    for (const L of t) L(k);
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
    return c() - r();
  }
  function v() {
    return d() <= tr;
  }
  function f(k) {
    i.isAtBottom = k, s();
  }
  function h(k) {
    i.escapedFromLock = k, s();
  }
  function b(k) {
    i.isNearBottom = k, s();
  }
  function m() {
    if (!Mt || typeof window > "u")
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
    const L = r(), R = i.ignoreScrollToTop;
    let z = i.lastScrollTop ?? L;
    i.lastScrollTop = L, i.ignoreScrollToTop = void 0, R && R > L && (z = R), b(v()), setTimeout(() => {
      if (i.resizeDifference || L === R)
        return;
      if (m()) {
        h(!0), f(!1);
        return;
      }
      const D = L > z, B = L < z;
      if (i.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      B && (h(!0), f(!1)), D && h(!1), !i.escapedFromLock && v() && f(!0);
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
    R === L && k.deltaY < 0 && L.scrollHeight > L.clientHeight && !i.animation?.ignoreEscapes && (h(!0), f(!1));
  };
  function y(k, L) {
    g(), i.scrollElement = k, i.contentElement = L, getComputedStyle(k).overflow === "visible" && (k.style.overflow = "auto"), k.addEventListener("scroll", _, { passive: !0 }), k.addEventListener("wheel", S, { passive: !0 });
    let R;
    i.resizeObserver = new ResizeObserver((z) => {
      const D = z[0];
      if (!D)
        return;
      const { height: B } = D.contentRect, Y = B - (R ?? B);
      if (i.resizeDifference = Y, r() > l() && a(l()), b(v()), Y >= 0) {
        const j = on(
          e,
          R ? e.resize : e.initial
        );
        w({
          animation: j,
          wait: !0,
          preserveScrollPosition: !0,
          duration: j === "instant" ? void 0 : ir
        });
      } else
        v() && (h(!1), f(!0));
      R = B, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
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
  function x(k) {
    e = { ...e, ...k };
  }
  function w(k = {}) {
    const L = typeof k == "string" ? { animation: k } : k;
    L.preserveScrollPosition || f(!0);
    const R = Date.now() + (Number(L.wait) || 0), z = on(e, L.animation), { ignoreEscapes: D = !1 } = L;
    let B, Y = c();
    L.duration instanceof Promise ? L.duration.finally(() => {
      B = Date.now();
    }) : B = R + (L.duration ?? 0);
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
        const ee = r(), de = typeof performance < "u" ? performance.now() : Date.now(), et = (de - (i.lastTick ?? de)) / nr;
        if (i.animation ||= { behavior: z, promise: G, ignoreEscapes: D }, i.animation.behavior === z && (i.lastTick = de), m() || R > Date.now())
          return j();
        if (ee < Math.min(Y, c())) {
          if (i.animation?.behavior === z) {
            if (z === "instant")
              return a(c()), j();
            const Se = z;
            i.velocity = (Se.damping * i.velocity + Se.stiffness * d()) / Se.mass, i.accumulated += i.velocity * et;
            const tt = r();
            a(tt + i.accumulated), r() !== tt && (i.accumulated = 0);
          }
          return j();
        }
        return B > Date.now() ? (Y = c(), j()) : (i.animation = void 0, r() < c() ? w({
          animation: on(e, e.resize),
          ignoreEscapes: D,
          duration: Math.max(0, B - Date.now()) || void 0
        }) : i.isAtBottom);
      });
      return G.then((ee) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        i.animation || (i.lastTick = void 0, i.velocity = 0);
      }), ee));
    };
    return L.wait !== !0 && (i.animation = void 0), i.animation?.behavior === z ? i.animation.promise : j();
  }
  const O = () => {
    h(!0), f(!1);
  };
  function P(k) {
    return t.add(k), () => t.delete(k);
  }
  return {
    attach: y,
    detach: g,
    destroy: C,
    setOptions: x,
    getState: o,
    onChange: P,
    scrollToBottom: w,
    stopScroll: O
  };
}
function rr(n = {}) {
  const e = A(null), t = A(null), i = A(n.initial !== !1), s = A(!1), o = A(!1), r = or(n);
  let a = null;
  return be((l) => {
    !e.value || !t.value || (r.attach(e.value, t.value), a = r.onChange((u) => {
      i.value = u.isAtBottom, s.value = u.isNearBottom, o.value = u.escapedFromLock;
    }), l(() => {
      a?.(), a = null, r.detach();
    }));
  }), lt(() => {
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
const ar = /* @__PURE__ */ F({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (E(), W("span", {
      class: "speaker-indicator",
      style: ut({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), Xi = /* @__PURE__ */ re(ar, [["__scopeId", "data-v-9bffeda8"]]), lr = { class: "speaker-label" }, ur = {
  key: 1,
  class: "speaker-name"
}, cr = ["datetime"], dr = /* @__PURE__ */ F({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = we(), s = T(
      () => Mn(
        e.language,
        i.value,
        t("language.wildcard")
      )
    ), o = T(
      () => e.startTime != null ? yt(e.startTime) : null
    ), r = T(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = T(() => e.speaker?.color ?? "transparent");
    return (l, u) => (E(), W("div", lr, [
      n.speaker ? (E(), $(Xi, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (E(), W("span", ur, X(n.speaker.name), 1)) : K("", !0),
      o.value ? (E(), W("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value
      }, X(o.value), 9, cr)) : K("", !0),
      M(wn, null, {
        default: I(() => [
          ae(X(s.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), fr = /* @__PURE__ */ re(dr, [["__scopeId", "data-v-c5cddbd4"]]), Yi = /* @__PURE__ */ Symbol("turnSelection");
function si(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function pr(n, e, t) {
  const i = A(/* @__PURE__ */ new Set());
  let s = null;
  const o = T(() => i.value.size), r = T(() => i.value.size > 0);
  function a(m) {
    const _ = new Set(i.value);
    _.has(m) ? _.delete(m) : _.add(m), i.value = _, s = m;
  }
  function l(m) {
    if (s === null) {
      a(m);
      return;
    }
    const _ = n.value.map((w) => w.id), S = _.indexOf(s), y = _.indexOf(m);
    if (S === -1 || y === -1) {
      a(m);
      return;
    }
    const g = Math.min(S, y), C = Math.max(S, y), x = new Set(i.value);
    for (let w = g; w <= C; w++) {
      const O = _[w];
      O != null && x.add(O);
    }
    i.value = x;
  }
  function u() {
    i.value = /* @__PURE__ */ new Set(), s = null;
  }
  async function c() {
    const _ = n.value.filter((S) => i.value.has(S.id)).map(si).join(`

`);
    await navigator.clipboard.writeText(_);
  }
  async function d() {
    const _ = n.value.filter((S) => i.value.has(S.id)).map((S) => {
      const g = (S.speakerId ? e.get(S.speakerId) : void 0)?.name ?? "", C = S.startTime != null ? yt(S.startTime) : "", x = [g, C].filter(Boolean).join(" (") + (C ? ")" : ""), w = si(S);
      return x ? `${x}
${w}` : w;
    });
    await navigator.clipboard.writeText(_.join(`

`));
  }
  Z(
    () => n.value,
    (m) => {
      if (i.value.size === 0) return;
      const _ = new Set(m.map((y) => y.id)), S = new Set(
        [...i.value].filter((y) => _.has(y))
      );
      S.size !== i.value.size && (i.value = S);
    }
  );
  const v = t.on("channel:change", u), f = t.on("translation:change", u);
  function h(m) {
    m.key === "Escape" && i.value.size > 0 && u();
  }
  se(() => {
    document.addEventListener("keydown", h);
  }), lt(() => {
    document.removeEventListener("keydown", h), v(), f();
  });
  const b = {
    selectedIds: i,
    count: o,
    hasSelection: r,
    toggle: a,
    selectRange: l,
    clear: u,
    copyText: c,
    copyWithMetadata: d
  };
  return _t(Yi, b), b;
}
function Gi() {
  const n = xt(Yi);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const hr = ["data-turn-active"], vr = ["checked", "aria-label"], mr = { class: "turn-text" }, gr = ["data-word-active"], yr = /* @__PURE__ */ F({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Ze(), i = Gi(), { t: s } = we(), o = T(() => e.turn.words.length > 0), r = T(() => {
      if (!t.audio?.src.value || !o.value) return null;
      const f = t.audio.currentTime.value, { startTime: h, endTime: b, words: m } = e.turn;
      return h == null || b == null || f < h || f > b ? null : xo(m, f);
    }), a = T(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Vi(e.turn.words)) return !1;
      const f = t.audio.currentTime.value;
      return f >= e.turn.startTime && f <= e.turn.endTime;
    }), l = T(() => e.speaker?.color ?? "transparent"), u = T(() => i.selectedIds.value.has(e.turn.id)), c = T(() => {
      const f = e.speaker?.name ?? "", h = u.value ? "selection.deselect" : "selection.select";
      return s(h).replace("{name}", f);
    });
    function d(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function v(f) {
      f.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (f, h) => (E(), W("section", {
      class: mt(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": u.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: ut({ "--speaker-color": l.value })
    }, [
      n.partial ? K("", !0) : (E(), W("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        N("input", {
          type: "checkbox",
          class: "turn-checkbox",
          checked: u.value,
          "aria-label": c.value,
          onClick: Fe(v, ["stop"])
        }, null, 8, vr),
        M(fr, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      N("p", mr, [
        o.value ? (E(!0), W(ge, { key: 0 }, Ge(n.turn.words, (b, m) => (E(), W(ge, {
          key: b.id
        }, [
          N("span", {
            class: mt({ "word--active": b.id === r.value }),
            "data-word-active": b.id === r.value || void 0
          }, X(b.text), 11, gr),
          ae(X(m < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), W(ge, { key: 1 }, [
          ae(X(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, hr));
  }
}), oi = /* @__PURE__ */ re(yr, [["__scopeId", "data-v-56ba1c7c"]]), br = {}, wr = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Sr(n, e) {
  return E(), W("svg", wr, [...e[0] || (e[0] = [
    js('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Cr = /* @__PURE__ */ re(br, [["render", Sr]]), xr = { class: "transcription-empty" }, _r = { class: "message" }, Er = /* @__PURE__ */ F({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = we();
    return (t, i) => (E(), W("div", xr, [
      M(Cr, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      N("p", _r, X(p(e)("transcription.empty")), 1)
    ]));
  }
}), kr = /* @__PURE__ */ re(Er, [["__scopeId", "data-v-f82737e5"]]), Tr = /* @__PURE__ */ F({
  __name: "CopyButton",
  props: {
    icon: { default: "copy" },
    copyFn: {}
  },
  setup(n, { expose: e }) {
    const t = n, i = A(!1);
    let s;
    async function o() {
      if (!i.value)
        try {
          await t.copyFn(), i.value = !0, s = setTimeout(() => {
            i.value = !1;
          }, 2e3);
        } catch (r) {
          console.error(r);
        }
    }
    return e({ reset: () => {
      i.value = !1, clearTimeout(s);
    } }), (r, a) => (E(), $(me, {
      size: "sm",
      class: mt({ "copy-btn--copied": i.value }),
      onClick: o
    }, {
      icon: I(() => [
        M(Ri, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: I(() => [
            i.value ? (E(), $(p(Rn), {
              key: 0,
              size: 14
            })) : n.icon === "copy" ? (E(), $(p(Do), {
              key: 1,
              size: 14
            })) : (E(), $(p(Io), {
              key: 2,
              size: 14
            }))
          ]),
          _: 1
        })
      ]),
      default: I(() => [
        V(r.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), ri = /* @__PURE__ */ re(Tr, [["__scopeId", "data-v-08fc451a"]]), Pr = ["aria-label"], Ar = { class: "selection-count" }, Or = { class: "selection-actions" }, Ir = /* @__PURE__ */ F({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Gi(), { t } = we();
    return (i, s) => p(e).hasSelection.value ? (E(), W("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": p(t)("selection.count")
    }, [
      N("span", Ar, X(p(e).count.value) + " " + X(p(t)("selection.count")), 1),
      N("div", Or, [
        M(ri, {
          icon: "copy",
          "copy-fn": p(e).copyText
        }, {
          default: I(() => [
            ae(X(p(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        M(ri, {
          icon: "clipboard-list",
          "copy-fn": p(e).copyWithMetadata
        }, {
          default: I(() => [
            ae(X(p(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        M(me, {
          size: "sm",
          variant: "ghost",
          onClick: s[0] || (s[0] = (o) => p(e).clear())
        }, {
          icon: I(() => [
            M(p($n), { size: 14 })
          ]),
          default: I(() => [
            ae(" " + X(p(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Pr)) : K("", !0);
  }
}), Dr = /* @__PURE__ */ re(Ir, [["__scopeId", "data-v-6def1b72"]]), Lr = { class: "transcription-panel" }, Mr = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Rr = { class: "turns-container" }, $r = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Br = {
  key: 1,
  class: "history-start"
}, qr = /* @__PURE__ */ F({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = we(), i = Ze(), s = gt("scrollContainer"), o = T(() => {
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
    }), r = T(() => i.live?.hasLiveUpdate.value ?? !1), a = T(() => i.audio?.isPlaying.value ?? !1), l = T(
      () => i.activeChannel.value.activeTranslation.value
    ), u = T(() => i.activeChannel.value), c = T(
      () => u.value.isLoadingHistory.value
    ), d = T(() => u.value.hasMoreHistory.value), { scrollRef: v, contentRef: f, isAtBottom: h, scrollToBottom: b } = rr();
    se(() => {
      v.value = s.value, f.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const m = wo(() => {
      const S = u.value;
      S.hasMoreHistory.value && (S.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function _() {
      const S = s.value;
      S && S.scrollTop < 100 && m();
    }
    return Z(
      () => e.turns,
      (S, y) => {
        const g = S.length, C = y.length;
        if (g > C && !h.value && S[0]?.id != y[0]?.id) {
          const x = g - C, w = e.turns[x]?.id;
          if (!w || !v.value) return;
          oe(() => {
            v.value?.querySelector(
              `[data-turn-id="${w}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), se(() => {
      s.value?.addEventListener("scroll", _, {
        passive: !0
      });
    }), lt(() => {
      s.value?.removeEventListener("scroll", _);
    }), (S, y) => (E(), W("article", Lr, [
      N("div", Mr, [
        N("div", Rr, [
          M(Dr),
          c.value ? (E(), W("div", $r, [...y[3] || (y[3] = [
            N("progress", null, null, -1)
          ])])) : K("", !0),
          !d.value && n.turns.length > 0 ? (E(), W("div", Br, X(p(t)("transcription.historyStart")), 1)) : K("", !0),
          n.turns.length === 0 && !c.value && !o.value ? (E(), $(kr, {
            key: 2,
            class: "transcription-empty"
          })) : K("", !0),
          (E(!0), W(ge, null, Ge(n.turns, (g, C, x, w) => {
            const O = [g, n.speakers.get(g.speakerId ?? ""), r.value && !o.value && C === n.turns.length - 1];
            if (w && w.key === g.id && Us(w, O)) return w;
            const P = (E(), $(oi, {
              "data-turn-id": g.id,
              key: g.id,
              turn: g,
              speaker: g.speakerId ? n.speakers.get(g.speakerId) : void 0,
              live: r.value && !o.value && C === n.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return P.memo = O, P;
          }, y, 0), 128)),
          o.value ? (E(), $(oi, {
            key: "__partial__",
            turn: o.value,
            partial: ""
          }, null, 8, ["turn"])) : K("", !0)
        ]),
        M(Ri, { name: "fade-slide" }, {
          default: I(() => [
            !p(h) && (a.value || r.value) ? (E(), $(me, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": p(t)("transcription.resumeScroll"),
              onClick: y[2] || (y[2] = (g) => p(b)())
            }, {
              icon: I(() => [
                M(p(Ao), { size: 14 })
              ]),
              default: I(() => [
                ae(" " + X(p(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : K("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Fr = /* @__PURE__ */ re(qr, [["__scopeId", "data-v-a43eb44a"]]), zr = { class: "switch" }, Nr = ["id", "checked"], Wr = ["for"], Hr = /* @__PURE__ */ F({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = t.id ?? Ks();
    return (o, r) => (E(), W("div", zr, [
      N("input", {
        type: "checkbox",
        id: p(s),
        checked: n.modelValue,
        onChange: r[0] || (r[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Nr),
      N("label", { for: p(s) }, [...r[1] || (r[1] = [
        N("div", { class: "switch-slider" }, null, -1)
      ])], 8, Wr)
    ]));
  }
}), Vr = /* @__PURE__ */ re(Hr, [["__scopeId", "data-v-2aa0332f"]]), jr = "(max-width: 767px)";
function Ji() {
  const n = A(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return se(() => {
    e = window.matchMedia(jr), n.value = e.matches, e.addEventListener("change", t);
  }), lt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function ai(n) {
  return typeof n == "string" ? `'${n}'` : new Ur().serialize(n);
}
const Ur = /* @__PURE__ */ (function() {
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
function qt(n, e) {
  return n === e || ai(n) === ai(e);
}
function Kr(n, e, t) {
  const i = n.findIndex((a) => qt(a, e)), s = n.findIndex((a) => qt(a, t));
  if (i === -1 || s === -1) return [];
  const [o, r] = [i, s].sort((a, l) => a - l);
  return n.slice(o, r + 1);
}
function li(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function Oe(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(r) => {
    const a = xt(i, r);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (r) => (_t(i, r), r)];
}
function ye() {
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
function Bn(n) {
  return n ? n.flatMap((e) => e.type === ge ? Bn(e.children) : [e]) : [];
}
const [jt] = Oe("ConfigProvider");
function Xr(n, e) {
  var t;
  const i = Xe();
  return be(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Ys(i);
}
function Ut(n, e) {
  return $i() ? (Bi(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function rn() {
  const n = /* @__PURE__ */ new Set(), e = (o) => {
    n.delete(o);
  };
  return {
    on: (o) => {
      n.add(o);
      const r = () => e(o);
      return Ut(r), { off: r };
    },
    off: e,
    trigger: (...o) => Promise.all(Array.from(n).map((r) => r(...o))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function Yr(n) {
  let e = !1, t;
  const i = qi(!0);
  return ((...s) => (e || (t = i.run(() => n(...s)), e = !0), t));
}
const $e = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Gr = (n) => typeof n < "u", Jr = Object.prototype.toString, Zr = (n) => Jr.call(n) === "[object Object]", ui = /* @__PURE__ */ Qr();
function Qr() {
  var n, e, t;
  return $e && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function an(n) {
  return Array.isArray(n) ? n : [n];
}
function ea(n) {
  return Je();
}
// @__NO_SIDE_EFFECTS__
function ta(n) {
  if (!$e) return n;
  let e = 0, t, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...o) => (e += 1, i || (i = qi(!0), t = i.run(() => n(...o))), Ut(s), t));
}
function Zi(n, e = 1e4) {
  return Xs((t, i) => {
    let s = ue(n), o;
    const r = () => setTimeout(() => {
      s = ue(n), i();
    }, ue(e));
    return Ut(() => {
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
function na(n, e) {
  ea() && lt(n, e);
}
function ia(n, e, t) {
  return Z(n, e, {
    ...t,
    immediate: !0
  });
}
const Kt = $e ? window : void 0;
function Pe(n) {
  var e;
  const t = ue(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Qi(...n) {
  const e = (i, s, o, r) => (i.addEventListener(s, o, r), () => i.removeEventListener(s, o, r)), t = T(() => {
    const i = an(ue(n[0])).filter((s) => s != null);
    return i.every((s) => typeof s != "string") ? i : void 0;
  });
  return ia(() => {
    var i, s;
    return [
      (i = (s = t.value) === null || s === void 0 ? void 0 : s.map((o) => Pe(o))) !== null && i !== void 0 ? i : [Kt].filter((o) => o != null),
      an(ue(t.value ? n[1] : n[0])),
      an(p(t.value ? n[2] : n[1])),
      ue(t.value ? n[3] : n[2])
    ];
  }, ([i, s, o, r], a, l) => {
    if (!i?.length || !s?.length || !o?.length) return;
    const u = Zr(r) ? { ...r } : r, c = i.flatMap((d) => s.flatMap((v) => o.map((f) => e(d, v, f, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function es() {
  const n = Xe(!1), e = Je();
  return e && se(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function sa(n) {
  const e = /* @__PURE__ */ es();
  return T(() => (e.value, !!n()));
}
function oa(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function ra(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: s = Kt, eventName: o = "keydown", passive: r = !1, dedupe: a = !1 } = i, l = oa(e);
  return Qi(s, o, (c) => {
    c.repeat && ue(a) || l(c) && t(c);
  }, r);
}
function aa(n) {
  return JSON.parse(JSON.stringify(n));
}
function la(n, e, t = {}) {
  const { window: i = Kt, ...s } = t;
  let o;
  const r = /* @__PURE__ */ sa(() => i && "ResizeObserver" in i), a = () => {
    o && (o.disconnect(), o = void 0);
  }, l = Z(T(() => {
    const c = ue(n);
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
  return Ut(u), {
    isSupported: r,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function Ft(n, e, t, i = {}) {
  var s, o;
  const { clone: r = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, v = Je(), f = t || v?.emit || (v == null || (s = v.$emit) === null || s === void 0 ? void 0 : s.bind(v)) || (v == null || (o = v.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(v?.proxy));
  let h = l;
  e || (e = "modelValue"), h = h || `update:${e.toString()}`;
  const b = (S) => r ? typeof r == "function" ? r(S) : aa(S) : S, m = () => Gr(n[e]) ? b(n[e]) : c, _ = (S) => {
    d ? d(S) && f(h, S) : f(h, S);
  };
  if (a) {
    const S = A(m());
    let y = !1;
    return Z(() => n[e], (g) => {
      y || (y = !0, S.value = b(g), oe(() => y = !1));
    }), Z(S, (g) => {
      !y && (g !== n[e] || u) && _(g);
    }, { deep: u }), S;
  } else return T({
    get() {
      return m();
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
  for (const o in n) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const r = n[o];
    r != null && (i && i(s, o, r, t) || (Array.isArray(r) && Array.isArray(s[o]) ? s[o] = [...r, ...s[o]] : ln(r) && ln(s[o]) ? s[o] = Cn(
      r,
      s[o],
      (t ? `${t}.` : "") + o.toString(),
      i
    ) : s[o] = r));
  }
  return s;
}
function ua(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => Cn(t, i, "", n), {})
  );
}
const ca = ua(), da = /* @__PURE__ */ ta(() => {
  const n = A(/* @__PURE__ */ new Map()), e = A(), t = T(() => {
    for (const r of n.value.values()) if (r) return !0;
    return !1;
  }), i = jt({ scrollBody: A(!0) });
  let s = null;
  const o = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ui && s?.(), e.value = void 0;
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
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? ca({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ui && (s = Qi(document, "touchmove", (d) => fa(d), { passive: !1 })), oe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function ts(n) {
  const e = Math.random().toString(36).substring(2, 7), t = da();
  t.value.set(e, n ?? !1);
  const i = T({
    get: () => t.value.get(e) ?? !1,
    set: (s) => t.value.set(e, s)
  });
  return na(() => {
    t.value.delete(e);
  }), i;
}
function ns(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : ns(t);
  }
}
function fa(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && ns(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function is(n) {
  const e = jt({ dir: A("ltr") });
  return T(() => n?.value || e.dir?.value || "ltr");
}
function Xt(n) {
  const e = Je(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((s) => {
    i[Gs(Fi(s))] = (...o) => n(s, ...o);
  }), i;
}
let un = 0;
function pa() {
  be((n) => {
    if (!$e) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ci()), document.body.insertAdjacentElement("beforeend", e[1] ?? ci()), un++, n(() => {
      un === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), un--;
    });
  });
}
function ci() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function ss(n) {
  return T(() => ue(n) ? !!Pe(n)?.closest("form") : !0);
}
function ie() {
  const n = Je(), e = A(), t = T(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Pe(e)), i = Object.assign({}, n.exposed), s = {};
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
function qn(n) {
  const e = Je(), t = Object.keys(e?.type.props ?? {}).reduce((s, o) => {
    const r = (e?.type.props[o]).default;
    return r !== void 0 && (s[o] = r), s;
  }, {}), i = Lt(n);
  return T(() => {
    const s = {}, o = e?.vnode.props ?? {};
    return Object.keys(o).forEach((r) => {
      s[Fi(r)] = o[r];
    }), Object.keys({
      ...t,
      ...s
    }).reduce((r, a) => (i.value[a] !== void 0 && (r[a] = i.value[a]), r), {});
  });
}
function ha(n, e) {
  const t = qn(n), i = e ? Xt(e) : {};
  return T(() => ({
    ...t.value,
    ...i
  }));
}
var va = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, it = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), At = {}, cn = 0, os = function(n) {
  return n && (n.host || os(n.parentNode));
}, ma = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = os(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, ga = function(n, e, t, i) {
  var s = ma(e, Array.isArray(n) ? n : [n]);
  At[t] || (At[t] = /* @__PURE__ */ new WeakMap());
  var o = At[t], r = [], a = /* @__PURE__ */ new Set(), l = new Set(s), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  s.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(v) {
      if (a.has(v))
        c(v);
      else
        try {
          var f = v.getAttribute(i), h = f !== null && f !== "false", b = (it.get(v) || 0) + 1, m = (o.get(v) || 0) + 1;
          it.set(v, b), o.set(v, m), r.push(v), b === 1 && h && Pt.set(v, !0), m === 1 && v.setAttribute(t, "true"), h || v.setAttribute(i, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", v, _);
        }
    });
  };
  return c(e), a.clear(), cn++, function() {
    r.forEach(function(d) {
      var v = it.get(d) - 1, f = o.get(d) - 1;
      it.set(d, v), o.set(d, f), v || (Pt.has(d) || d.removeAttribute(i), Pt.delete(d)), f || d.removeAttribute(t);
    }), cn--, cn || (it = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), At = {});
  };
}, ya = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), s = va(n);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), ga(i, s, t, "aria-hidden")) : function() {
    return null;
  };
};
function rs(n) {
  let e;
  Z(() => Pe(n), (t) => {
    t ? e = ya(t) : e && e();
  }), Et(() => {
    e && e();
  });
}
let ba = 0;
function bt(n, e = "reka") {
  if ("useId" in Gn) return `${e}-${Gn.useId?.()}`;
  const t = jt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++ba}`;
}
function wa() {
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
function Sa(n) {
  const e = A(), t = T(() => e.value?.width ?? 0), i = T(() => e.value?.height ?? 0);
  return se(() => {
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
function Ca(n, e) {
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
function Fn(n) {
  const e = Zi("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (s, o) => {
      e.value = e.value + s;
      {
        const r = ye(), a = o.map((v) => ({
          ...v,
          textValue: v.value?.textValue ?? v.ref.textContent?.trim() ?? ""
        })), l = a.find((v) => v.ref === r), u = a.map((v) => v.textValue), c = _a(u, e.value, l?.textValue), d = a.find((v) => v.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function xa(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function _a(n, e, t) {
  const s = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, o = t ? n.indexOf(t) : -1;
  let r = xa(n, Math.max(o, 0));
  s.length === 1 && (r = r.filter((u) => u !== t));
  const l = r.find((u) => u.toLowerCase().startsWith(s.toLowerCase()));
  return l !== t ? l : void 0;
}
function Ea(n, e) {
  const t = A({}), i = A("none"), s = A(n), o = n.value ? "mounted" : "unmounted";
  let r;
  const a = e.value?.ownerDocument.defaultView ?? Kt, { state: l, dispatch: u } = Ca(o, {
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
    if ($e) {
      const _ = new CustomEvent(m, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(_);
    }
  };
  Z(n, async (m, _) => {
    const S = _ !== m;
    if (await oe(), S) {
      const y = i.value, g = Ot(e.value);
      m ? (u("MOUNT"), c("enter"), g === "none" && c("after-enter")) : g === "none" || g === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : _ && y !== g ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (m) => {
    const _ = Ot(e.value), S = _.includes(CSS.escape(m.animationName)), y = l.value === "mounted" ? "enter" : "leave";
    if (m.target === e.value && S && (c(`after-${y}`), u("ANIMATION_END"), !s.value)) {
      const g = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", r = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = g);
      });
    }
    m.target === e.value && _ === "none" && u("ANIMATION_END");
  }, v = (m) => {
    m.target === e.value && (i.value = Ot(e.value));
  }, f = Z(e, (m, _) => {
    m ? (t.value = getComputedStyle(m), m.addEventListener("animationstart", v), m.addEventListener("animationcancel", d), m.addEventListener("animationend", d)) : (u("ANIMATION_END"), r !== void 0 && a?.clearTimeout(r), _?.removeEventListener("animationstart", v), _?.removeEventListener("animationcancel", d), _?.removeEventListener("animationend", d));
  }, { immediate: !0 }), h = Z(l, () => {
    const m = Ot(e.value);
    i.value = l.value === "mounted" ? m : "none";
  });
  return Et(() => {
    f(), h();
  }), { isPresent: T(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Ot(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var zn = F({
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
    const { present: i, forceMount: s } = ct(n), o = A(), { isPresent: r } = Ea(i, o);
    t({ present: r });
    let a = e.default({ present: r.value });
    a = Bn(a || []);
    const l = Je();
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
    return () => s.value || i.value || r.value ? Le(e.default({ present: r.value })[0], { ref: (u) => {
      const c = Pe(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? o.value = c.firstElementChild : o.value = c), c;
    } }) : null;
  }
});
const xn = F({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Bn(t.default()), s = i.findIndex((l) => l.type !== Js);
      if (s === -1) return i;
      const o = i[s];
      delete o.props?.ref;
      const r = o.props ? Q(e, o.props) : e, a = Zs({
        ...o,
        props: {}
      }, r);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), ka = [
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
    return typeof i == "string" && ka.includes(i) ? () => Le(i, e) : i !== "template" ? () => Le(n.as, e, { default: t.default }) : () => Le(xn, e, { default: t.default });
  }
});
function zt() {
  const n = A(), e = T(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Pe(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [We, Ta] = Oe("DialogRoot");
var Pa = /* @__PURE__ */ F({
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
    const t = n, s = /* @__PURE__ */ Ft(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), o = A(), r = A(), { modal: a } = ct(t);
    return Ta({
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
}), as = Pa, Aa = /* @__PURE__ */ F({
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
    return (i, s) => (E(), $(p(ne), Q(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (o) => p(t).onOpenChange(!1))
    }), {
      default: I(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Oa = Aa;
const Ia = "dismissableLayer.pointerDownOutside", Da = "dismissableLayer.focusOutside";
function ls(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), s = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || s.indexOf(i) < s.indexOf(t)));
}
function La(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1), o = A(() => {
  });
  return be((r) => {
    if (!$e || !ue(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (ls(e.value, c)) {
          s.value = !1;
          return;
        }
        if (u.target && !s.value) {
          let v = function() {
            Vt(Ia, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", o.value), o.value = v, i.addEventListener("click", o.value, { once: !0 })) : v();
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
    ue(t) && (s.value = !0);
  } };
}
function Ma(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = A(!1);
  return be((o) => {
    if (!$e || !ue(t)) return;
    const r = async (a) => {
      if (!e?.value) return;
      await oe(), await oe();
      const l = a.target;
      !e.value || !l || ls(e.value, l) || a.target && !s.value && Vt(Da, n, { originalEvent: a });
    };
    i.addEventListener("focusin", r), o(() => i.removeEventListener("focusin", r));
  }), {
    onFocusCapture: () => {
      ue(t) && (s.value = !0);
    },
    onBlurCapture: () => {
      ue(t) && (s.value = !1);
    }
  };
}
const ve = zi({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Ra = /* @__PURE__ */ F({
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
    const t = n, i = e, { forwardRef: s, currentElement: o } = ie(), r = T(() => o.value?.ownerDocument ?? globalThis.document), a = T(() => ve.layersRoot), l = T(() => o.value ? Array.from(a.value).indexOf(o.value) : -1), u = T(() => ve.layersWithOutsidePointerEventsDisabled.size > 0), c = T(() => {
      const f = Array.from(a.value), [h] = [...ve.layersWithOutsidePointerEventsDisabled].slice(-1), b = f.indexOf(h);
      return l.value >= b;
    }), d = La(async (f) => {
      const h = [...ve.branches].some((b) => b?.contains(f.target));
      !c.value || h || (i("pointerDownOutside", f), i("interactOutside", f), await oe(), f.defaultPrevented || i("dismiss"));
    }, o), v = Ma((f) => {
      [...ve.branches].some((b) => b?.contains(f.target)) || (i("focusOutside", f), i("interactOutside", f), f.defaultPrevented || i("dismiss"));
    }, o);
    return ra("Escape", (f) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", f), f.defaultPrevented || i("dismiss"));
    }), be((f) => {
      o.value && (t.disableOutsidePointerEvents && (ve.layersWithOutsidePointerEventsDisabled.size === 0 && (ve.originalBodyPointerEvents = r.value.body.style.pointerEvents, r.value.body.style.pointerEvents = "none"), ve.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), f(() => {
        t.disableOutsidePointerEvents && ve.layersWithOutsidePointerEventsDisabled.size === 1 && !Sn(ve.originalBodyPointerEvents) && (r.value.body.style.pointerEvents = ve.originalBodyPointerEvents);
      }));
    }), be((f) => {
      f(() => {
        o.value && (a.value.delete(o.value), ve.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (f, h) => (E(), $(p(ne), {
      ref: p(s),
      "as-child": f.asChild,
      as: f.as,
      "data-dismissable-layer": "",
      style: ut({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: p(v).onFocusCapture,
      onBlurCapture: p(v).onBlurCapture,
      onPointerdownCapture: p(d).onPointerDownCapture
    }, {
      default: I(() => [V(f.$slots, "default")]),
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
}), us = Ra;
const $a = /* @__PURE__ */ Yr(() => A([]));
function Ba() {
  const n = $a();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = di(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = di(n.value, e), n.value[0]?.resume();
    }
  };
}
function di(n, e) {
  const t = [...n], i = t.indexOf(e);
  return i !== -1 && t.splice(i, 1), t;
}
const dn = "focusScope.autoFocusOnMount", fn = "focusScope.autoFocusOnUnmount", fi = {
  bubbles: !1,
  cancelable: !0
};
function qa(n, { select: e = !1 } = {}) {
  const t = ye();
  for (const i of n)
    if (Be(i, { select: e }), ye() !== t) return !0;
}
function Fa(n) {
  const e = cs(n), t = pi(e, n), i = pi(e.reverse(), n);
  return [t, i];
}
function cs(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const s = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || s ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function pi(n, e) {
  for (const t of n) if (!za(t, { upTo: e })) return t;
}
function za(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Na(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Be(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = ye();
    n.focus({ preventScroll: !0 }), n !== t && Na(n) && e && n.select();
  }
}
var Wa = /* @__PURE__ */ F({
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
    const t = n, i = e, { currentRef: s, currentElement: o } = ie(), r = A(null), a = Ba(), l = zi({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    be((c) => {
      if (!$e) return;
      const d = o.value;
      if (!t.trapped) return;
      function v(m) {
        if (l.paused || !d) return;
        const _ = m.target;
        d.contains(_) ? r.value = _ : Be(r.value, { select: !0 });
      }
      function f(m) {
        if (l.paused || !d) return;
        const _ = m.relatedTarget;
        _ !== null && (d.contains(_) || Be(r.value, { select: !0 }));
      }
      function h(m) {
        d.contains(r.value) || Be(d);
      }
      document.addEventListener("focusin", v), document.addEventListener("focusout", f);
      const b = new MutationObserver(h);
      d && b.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", v), document.removeEventListener("focusout", f), b.disconnect();
      });
    }), be(async (c) => {
      const d = o.value;
      if (await oe(), !d) return;
      a.add(l);
      const v = ye();
      if (!d.contains(v)) {
        const h = new CustomEvent(dn, fi);
        d.addEventListener(dn, (b) => i("mountAutoFocus", b)), d.dispatchEvent(h), h.defaultPrevented || (qa(cs(d), { select: !0 }), ye() === v && Be(d));
      }
      c(() => {
        d.removeEventListener(dn, (m) => i("mountAutoFocus", m));
        const h = new CustomEvent(fn, fi), b = (m) => {
          i("unmountAutoFocus", m);
        };
        d.addEventListener(fn, b), d.dispatchEvent(h), setTimeout(() => {
          h.defaultPrevented || Be(v ?? document.body, { select: !0 }), d.removeEventListener(fn, b), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, v = ye();
      if (d && v) {
        const f = c.currentTarget, [h, b] = Fa(f);
        h && b ? !c.shiftKey && v === b ? (c.preventDefault(), t.loop && Be(h, { select: !0 })) : c.shiftKey && v === h && (c.preventDefault(), t.loop && Be(b, { select: !0 })) : v === f && c.preventDefault();
      }
    }
    return (c, d) => (E(), $(p(ne), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: I(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), ds = Wa;
function Ha(n) {
  return n ? "open" : "closed";
}
function hi(n) {
  const e = ye();
  for (const t of n)
    if (t === e || (t.focus(), ye() !== e)) return;
}
const Va = "DialogTitle", ja = "DialogContent";
function Ua({ titleName: n = Va, contentName: e = ja, componentLink: t = "dialog.html#title", titleId: i, descriptionId: s, contentElement: o }) {
  const r = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  se(() => {
    document.getElementById(i) || console.warn(r);
    const u = o.value?.getAttribute("aria-describedby");
    s && u && (document.getElementById(s) || console.warn(a));
  });
}
var Ka = /* @__PURE__ */ F({
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
    return s.titleId ||= bt(void 0, "reka-dialog-title"), s.descriptionId ||= bt(void 0, "reka-dialog-description"), se(() => {
      s.contentElement = r, ye() !== document.body && (s.triggerElement.value = ye());
    }), process.env.NODE_ENV !== "production" && Ua({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: s.titleId,
      descriptionId: s.descriptionId,
      contentElement: r
    }), (a, l) => (E(), $(p(ds), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: I(() => [M(p(us), Q({
        id: p(s).contentId,
        ref: p(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": p(s).descriptionId,
        "aria-labelledby": p(s).titleId,
        "data-state": p(Ha)(p(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => p(s).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: I(() => [V(a.$slots, "default")]),
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
}), fs = Ka, Xa = /* @__PURE__ */ F({
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
    const t = n, i = e, s = We(), o = Xt(i), { forwardRef: r, currentElement: a } = ie();
    return rs(a), (l, u) => (E(), $(fs, Q({
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
        const d = c.detail.originalEvent, v = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || v) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: I(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Ya = Xa, Ga = /* @__PURE__ */ F({
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
    const o = We(), r = A(!1), a = A(!1);
    return (l, u) => (E(), $(fs, Q({
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
      default: I(() => [V(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ja = Ga, Za = /* @__PURE__ */ F({
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
    const t = n, i = e, s = We(), o = Xt(i), { forwardRef: r } = ie();
    return (a, l) => (E(), $(p(zn), { present: a.forceMount || p(s).open.value }, {
      default: I(() => [p(s).modal.value ? (E(), $(Ya, Q({
        key: 0,
        ref: p(r)
      }, {
        ...t,
        ...p(o),
        ...a.$attrs
      }), {
        default: I(() => [V(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), $(Ja, Q({
        key: 1,
        ref: p(r)
      }, {
        ...t,
        ...p(o),
        ...a.$attrs
      }), {
        default: I(() => [V(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), ps = Za, Qa = /* @__PURE__ */ F({
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
    return ts(!0), ie(), (t, i) => (E(), $(p(ne), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": p(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: I(() => [V(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), el = Qa, tl = /* @__PURE__ */ F({
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
    return (i, s) => p(e)?.modal.value ? (E(), $(p(zn), {
      key: 0,
      present: i.forceMount || p(e).open.value
    }, {
      default: I(() => [M(el, Q(i.$attrs, {
        ref: p(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: I(() => [V(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : K("v-if", !0);
  }
}), hs = tl, nl = /* @__PURE__ */ F({
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
    const e = /* @__PURE__ */ es();
    return (t, i) => p(e) || t.forceMount ? (E(), $(Ni, {
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
}), vs = nl, il = /* @__PURE__ */ F({
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
    return (t, i) => (E(), $(p(vs), In(Dn(e)), {
      default: I(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ms = il, sl = /* @__PURE__ */ F({
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
    return ie(), (i, s) => (E(), $(p(ne), Q(e, { id: p(t).titleId }), {
      default: I(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), gs = sl;
const vi = "data-reka-collection-item";
function He(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let s;
  if (t) {
    const c = A(/* @__PURE__ */ new Map());
    s = {
      collectionRef: A(),
      itemMap: c
    }, _t(i, s);
  } else s = xt(i);
  const o = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const v = Array.from(d.querySelectorAll(`[${vi}]`)), h = Array.from(s.itemMap.value.values()).sort((b, m) => v.indexOf(b.ref) - v.indexOf(m.ref));
    return c ? h : h.filter((b) => b.ref.dataset.disabled !== "");
  }, r = F({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: v }) {
      const { primitiveElement: f, currentElement: h } = zt();
      return Z(h, () => {
        s.collectionRef.value = h.value;
      }), () => Le(xn, {
        ref: f,
        ...v
      }, d);
    }
  }), a = F({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: v }) {
      const { primitiveElement: f, currentElement: h } = zt();
      return be((b) => {
        if (h.value) {
          const m = Qs(h.value);
          s.itemMap.value.set(m, {
            ref: h.value,
            value: c.value
          }), b(() => s.itemMap.value.delete(m));
        }
      }), () => Le(xn, {
        ...v,
        [vi]: "",
        ref: f
      }, d);
    }
  }), l = T(() => Array.from(s.itemMap.value.values())), u = T(() => s.itemMap.value.size);
  return {
    getItems: o,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: r,
    CollectionItem: a
  };
}
const ol = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function rl(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function al(n, e, t) {
  const i = rl(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return ol[i];
}
var ll = /* @__PURE__ */ F({
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
    return (e, t) => (E(), $(p(ne), {
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
      default: I(() => [V(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), ys = ll, ul = /* @__PURE__ */ F({
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
    const e = n, { primitiveElement: t, currentElement: i } = zt(), s = T(() => e.checked ?? e.value);
    return Z(s, (o, r) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && o !== r) {
        const d = new Event("input", { bubbles: !0 }), v = new Event("change", { bubbles: !0 });
        c.call(a, o), a.dispatchEvent(d), a.dispatchEvent(v);
      }
    }), (o, r) => (E(), $(ys, Q({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...o.$attrs
    }, { as: "input" }), null, 16));
  }
}), mi = ul, cl = /* @__PURE__ */ F({
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
    const e = n, t = T(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = T(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
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
    return (s, o) => (E(), W(ge, null, [K(" We render single input if it's required "), t.value ? (E(), $(mi, Q({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (E(!0), W(ge, { key: 1 }, Ge(i.value, (r) => (E(), $(mi, Q({ key: r.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), dl = cl;
const [bs, fl] = Oe("PopperRoot");
var pl = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = A();
    return fl({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => V(t.$slots, "default");
  }
}), hl = pl, vl = /* @__PURE__ */ F({
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
    const e = n, { forwardRef: t, currentElement: i } = ie(), s = bs();
    return Wi(() => {
      s.onAnchorChange(e.reference ?? i.value);
    }), (o, r) => (E(), $(p(ne), {
      ref: p(t),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: I(() => [V(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), ml = vl;
function gl(n) {
  return n !== null;
}
function yl(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: s } = e, r = s.arrow?.centerOffset !== 0, a = r ? 0 : n.arrowWidth, l = r ? 0 : n.arrowHeight, [u, c] = _n(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], v = (s.arrow?.x ?? 0) + a / 2, f = (s.arrow?.y ?? 0) + l / 2;
      let h = "", b = "";
      return u === "bottom" ? (h = r ? d : `${v}px`, b = `${-l}px`) : u === "top" ? (h = r ? d : `${v}px`, b = `${i.floating.height + l}px`) : u === "right" ? (h = `${-l}px`, b = r ? d : `${f}px`) : u === "left" && (h = `${i.floating.width + l}px`, b = r ? d : `${f}px`), { data: {
        x: h,
        y: b
      } };
    }
  };
}
function _n(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const bl = ["top", "right", "bottom", "left"], ze = Math.min, pe = Math.max, Nt = Math.round, It = Math.floor, Te = (n) => ({
  x: n,
  y: n
}), wl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Sl = {
  start: "end",
  end: "start"
};
function En(n, e, t) {
  return pe(n, ze(e, t));
}
function Me(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Re(n) {
  return n.split("-")[0];
}
function dt(n) {
  return n.split("-")[1];
}
function Nn(n) {
  return n === "x" ? "y" : "x";
}
function Wn(n) {
  return n === "y" ? "height" : "width";
}
const Cl = /* @__PURE__ */ new Set(["top", "bottom"]);
function ke(n) {
  return Cl.has(Re(n)) ? "y" : "x";
}
function Hn(n) {
  return Nn(ke(n));
}
function xl(n, e, t) {
  t === void 0 && (t = !1);
  const i = dt(n), s = Hn(n), o = Wn(s);
  let r = s === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (r = Wt(r)), [r, Wt(r)];
}
function _l(n) {
  const e = Wt(n);
  return [kn(n), e, kn(e)];
}
function kn(n) {
  return n.replace(/start|end/g, (e) => Sl[e]);
}
const gi = ["left", "right"], yi = ["right", "left"], El = ["top", "bottom"], kl = ["bottom", "top"];
function Tl(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? yi : gi : e ? gi : yi;
    case "left":
    case "right":
      return e ? El : kl;
    default:
      return [];
  }
}
function Pl(n, e, t, i) {
  const s = dt(n);
  let o = Tl(Re(n), t === "start", i);
  return s && (o = o.map((r) => r + "-" + s), e && (o = o.concat(o.map(kn)))), o;
}
function Wt(n) {
  return n.replace(/left|right|bottom|top/g, (e) => wl[e]);
}
function Al(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function ws(n) {
  return typeof n != "number" ? Al(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Ht(n) {
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
function bi(n, e, t) {
  let {
    reference: i,
    floating: s
  } = n;
  const o = ke(e), r = Hn(e), a = Wn(r), l = Re(e), u = o === "y", c = i.x + i.width / 2 - s.width / 2, d = i.y + i.height / 2 - s.height / 2, v = i[a] / 2 - s[a] / 2;
  let f;
  switch (l) {
    case "top":
      f = {
        x: c,
        y: i.y - s.height
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
        x: i.x - s.width,
        y: d
      };
      break;
    default:
      f = {
        x: i.x,
        y: i.y
      };
  }
  switch (dt(e)) {
    case "start":
      f[r] -= v * (t && u ? -1 : 1);
      break;
    case "end":
      f[r] += v * (t && u ? -1 : 1);
      break;
  }
  return f;
}
async function Ol(n, e) {
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
    altBoundary: v = !1,
    padding: f = 0
  } = Me(e, n), h = ws(f), m = a[v ? d === "floating" ? "reference" : "floating" : d], _ = Ht(await o.getClippingRect({
    element: (t = await (o.isElement == null ? void 0 : o.isElement(m))) == null || t ? m : m.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), S = d === "floating" ? {
    x: i,
    y: s,
    width: r.floating.width,
    height: r.floating.height
  } : r.reference, y = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), g = await (o.isElement == null ? void 0 : o.isElement(y)) ? await (o.getScale == null ? void 0 : o.getScale(y)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, C = Ht(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: y,
    strategy: l
  }) : S);
  return {
    top: (_.top - C.top + h.top) / g.y,
    bottom: (C.bottom - _.bottom + h.bottom) / g.y,
    left: (_.left - C.left + h.left) / g.x,
    right: (C.right - _.right + h.right) / g.x
  };
}
const Il = async (n, e, t) => {
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
  } = bi(u, i, l), v = i, f = {}, h = 0;
  for (let m = 0; m < a.length; m++) {
    var b;
    const {
      name: _,
      fn: S
    } = a[m], {
      x: y,
      y: g,
      data: C,
      reset: x
    } = await S({
      x: c,
      y: d,
      initialPlacement: i,
      placement: v,
      strategy: s,
      middlewareData: f,
      rects: u,
      platform: {
        ...r,
        detectOverflow: (b = r.detectOverflow) != null ? b : Ol
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = y ?? c, d = g ?? d, f = {
      ...f,
      [_]: {
        ...f[_],
        ...C
      }
    }, x && h <= 50 && (h++, typeof x == "object" && (x.placement && (v = x.placement), x.rects && (u = x.rects === !0 ? await r.getElementRects({
      reference: n,
      floating: e,
      strategy: s
    }) : x.rects), {
      x: c,
      y: d
    } = bi(u, v, l)), m = -1);
  }
  return {
    x: c,
    y: d,
    placement: v,
    strategy: s,
    middlewareData: f
  };
}, Dl = (n) => ({
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
    } = Me(n, e) || {};
    if (u == null)
      return {};
    const d = ws(c), v = {
      x: t,
      y: i
    }, f = Hn(s), h = Wn(f), b = await r.getDimensions(u), m = f === "y", _ = m ? "top" : "left", S = m ? "bottom" : "right", y = m ? "clientHeight" : "clientWidth", g = o.reference[h] + o.reference[f] - v[f] - o.floating[h], C = v[f] - o.reference[f], x = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(u));
    let w = x ? x[y] : 0;
    (!w || !await (r.isElement == null ? void 0 : r.isElement(x))) && (w = a.floating[y] || o.floating[h]);
    const O = g / 2 - C / 2, P = w / 2 - b[h] / 2 - 1, k = ze(d[_], P), L = ze(d[S], P), R = k, z = w - b[h] - L, D = w / 2 - b[h] / 2 + O, B = En(R, D, z), Y = !l.arrow && dt(s) != null && D !== B && o.reference[h] / 2 - (D < R ? k : L) - b[h] / 2 < 0, j = Y ? D < R ? D - R : D - z : 0;
    return {
      [f]: v[f] + j,
      data: {
        [f]: B,
        centerOffset: D - B - j,
        ...Y && {
          alignmentOffset: j
        }
      },
      reset: Y
    };
  }
}), Ll = function(n) {
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
        fallbackPlacements: v,
        fallbackStrategy: f = "bestFit",
        fallbackAxisSideDirection: h = "none",
        flipAlignment: b = !0,
        ...m
      } = Me(n, e);
      if ((t = o.arrow) != null && t.alignmentOffset)
        return {};
      const _ = Re(s), S = ke(a), y = Re(a) === a, g = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), C = v || (y || !b ? [Wt(a)] : _l(a)), x = h !== "none";
      !v && x && C.push(...Pl(a, b, h, g));
      const w = [a, ...C], O = await l.detectOverflow(e, m), P = [];
      let k = ((i = o.flip) == null ? void 0 : i.overflows) || [];
      if (c && P.push(O[_]), d) {
        const D = xl(s, r, g);
        P.push(O[D[0]], O[D[1]]);
      }
      if (k = [...k, {
        placement: s,
        overflows: P
      }], !P.every((D) => D <= 0)) {
        var L, R;
        const D = (((L = o.flip) == null ? void 0 : L.index) || 0) + 1, B = w[D];
        if (B && (!(d === "alignment" ? S !== ke(B) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        k.every((G) => ke(G.placement) === S ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: k
            },
            reset: {
              placement: B
            }
          };
        let Y = (R = k.filter((j) => j.overflows[0] <= 0).sort((j, G) => j.overflows[1] - G.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!Y)
          switch (f) {
            case "bestFit": {
              var z;
              const j = (z = k.filter((G) => {
                if (x) {
                  const ee = ke(G.placement);
                  return ee === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ee === "y";
                }
                return !0;
              }).map((G) => [G.placement, G.overflows.filter((ee) => ee > 0).reduce((ee, de) => ee + de, 0)]).sort((G, ee) => G[1] - ee[1])[0]) == null ? void 0 : z[0];
              j && (Y = j);
              break;
            }
            case "initialPlacement":
              Y = a;
              break;
          }
        if (s !== Y)
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
function wi(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Si(n) {
  return bl.some((e) => n[e] >= 0);
}
const Ml = function(n) {
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
      } = Me(n, e);
      switch (s) {
        case "referenceHidden": {
          const r = await i.detectOverflow(e, {
            ...o,
            elementContext: "reference"
          }), a = wi(r, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Si(a)
            }
          };
        }
        case "escaped": {
          const r = await i.detectOverflow(e, {
            ...o,
            altBoundary: !0
          }), a = wi(r, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Si(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Ss = /* @__PURE__ */ new Set(["left", "top"]);
async function Rl(n, e) {
  const {
    placement: t,
    platform: i,
    elements: s
  } = n, o = await (i.isRTL == null ? void 0 : i.isRTL(s.floating)), r = Re(t), a = dt(t), l = ke(t) === "y", u = Ss.has(r) ? -1 : 1, c = o && l ? -1 : 1, d = Me(e, n);
  let {
    mainAxis: v,
    crossAxis: f,
    alignmentAxis: h
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof h == "number" && (f = a === "end" ? h * -1 : h), l ? {
    x: f * c,
    y: v * u
  } : {
    x: v * u,
    y: f * c
  };
}
const $l = function(n) {
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
      } = e, l = await Rl(e, n);
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
}, Bl = function(n) {
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
              x: S,
              y
            } = _;
            return {
              x: S,
              y
            };
          }
        },
        ...u
      } = Me(n, e), c = {
        x: t,
        y: i
      }, d = await o.detectOverflow(e, u), v = ke(Re(s)), f = Nn(v);
      let h = c[f], b = c[v];
      if (r) {
        const _ = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", y = h + d[_], g = h - d[S];
        h = En(y, h, g);
      }
      if (a) {
        const _ = v === "y" ? "top" : "left", S = v === "y" ? "bottom" : "right", y = b + d[_], g = b - d[S];
        b = En(y, b, g);
      }
      const m = l.fn({
        ...e,
        [f]: h,
        [v]: b
      });
      return {
        ...m,
        data: {
          x: m.x - t,
          y: m.y - i,
          enabled: {
            [f]: r,
            [v]: a
          }
        }
      };
    }
  };
}, ql = function(n) {
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
      } = Me(n, e), c = {
        x: t,
        y: i
      }, d = ke(s), v = Nn(d);
      let f = c[v], h = c[d];
      const b = Me(a, e), m = typeof b == "number" ? {
        mainAxis: b,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...b
      };
      if (l) {
        const y = v === "y" ? "height" : "width", g = o.reference[v] - o.floating[y] + m.mainAxis, C = o.reference[v] + o.reference[y] - m.mainAxis;
        f < g ? f = g : f > C && (f = C);
      }
      if (u) {
        var _, S;
        const y = v === "y" ? "width" : "height", g = Ss.has(Re(s)), C = o.reference[d] - o.floating[y] + (g && ((_ = r.offset) == null ? void 0 : _[d]) || 0) + (g ? 0 : m.crossAxis), x = o.reference[d] + o.reference[y] + (g ? 0 : ((S = r.offset) == null ? void 0 : S[d]) || 0) - (g ? m.crossAxis : 0);
        h < C ? h = C : h > x && (h = x);
      }
      return {
        [v]: f,
        [d]: h
      };
    }
  };
}, Fl = function(n) {
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
      } = Me(n, e), c = await r.detectOverflow(e, u), d = Re(s), v = dt(s), f = ke(s) === "y", {
        width: h,
        height: b
      } = o.floating;
      let m, _;
      d === "top" || d === "bottom" ? (m = d, _ = v === (await (r.isRTL == null ? void 0 : r.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, m = v === "end" ? "top" : "bottom");
      const S = b - c.top - c.bottom, y = h - c.left - c.right, g = ze(b - c[m], S), C = ze(h - c[_], y), x = !e.middlewareData.shift;
      let w = g, O = C;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (O = y), (i = e.middlewareData.shift) != null && i.enabled.y && (w = S), x && !v) {
        const k = pe(c.left, 0), L = pe(c.right, 0), R = pe(c.top, 0), z = pe(c.bottom, 0);
        f ? O = h - 2 * (k !== 0 || L !== 0 ? k + L : pe(c.left, c.right)) : w = b - 2 * (R !== 0 || z !== 0 ? R + z : pe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: O,
        availableHeight: w
      });
      const P = await r.getDimensions(a.floating);
      return h !== P.width || b !== P.height ? {
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
function Qe(n) {
  return Vn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function he(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ie(n) {
  var e;
  return (e = (Vn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Vn(n) {
  return Yt() ? n instanceof Node || n instanceof he(n).Node : !1;
}
function xe(n) {
  return Yt() ? n instanceof Element || n instanceof he(n).Element : !1;
}
function Ae(n) {
  return Yt() ? n instanceof HTMLElement || n instanceof he(n).HTMLElement : !1;
}
function Ci(n) {
  return !Yt() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof he(n).ShadowRoot;
}
const zl = /* @__PURE__ */ new Set(["inline", "contents"]);
function kt(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: s
  } = _e(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !zl.has(s);
}
const Nl = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Wl(n) {
  return Nl.has(Qe(n));
}
const Hl = [":popover-open", ":modal"];
function Gt(n) {
  return Hl.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Vl = ["transform", "translate", "scale", "rotate", "perspective"], jl = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Ul = ["paint", "layout", "strict", "content"];
function jn(n) {
  const e = Un(), t = xe(n) ? _e(n) : n;
  return Vl.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || jl.some((i) => (t.willChange || "").includes(i)) || Ul.some((i) => (t.contain || "").includes(i));
}
function Kl(n) {
  let e = Ne(n);
  for (; Ae(e) && !at(e); ) {
    if (jn(e))
      return e;
    if (Gt(e))
      return null;
    e = Ne(e);
  }
  return null;
}
function Un() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Xl = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function at(n) {
  return Xl.has(Qe(n));
}
function _e(n) {
  return he(n).getComputedStyle(n);
}
function Jt(n) {
  return xe(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ne(n) {
  if (Qe(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ci(n) && n.host || // Fallback.
    Ie(n)
  );
  return Ci(e) ? e.host : e;
}
function Cs(n) {
  const e = Ne(n);
  return at(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Ae(e) && kt(e) ? e : Cs(e);
}
function wt(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const s = Cs(n), o = s === ((i = n.ownerDocument) == null ? void 0 : i.body), r = he(s);
  if (o) {
    const a = Tn(r);
    return e.concat(r, r.visualViewport || [], kt(s) ? s : [], a && t ? wt(a) : []);
  }
  return e.concat(s, wt(s, [], t));
}
function Tn(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function xs(n) {
  const e = _e(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const s = Ae(n), o = s ? n.offsetWidth : t, r = s ? n.offsetHeight : i, a = Nt(t) !== o || Nt(i) !== r;
  return a && (t = o, i = r), {
    width: t,
    height: i,
    $: a
  };
}
function Kn(n) {
  return xe(n) ? n : n.contextElement;
}
function rt(n) {
  const e = Kn(n);
  if (!Ae(e))
    return Te(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: s,
    $: o
  } = xs(e);
  let r = (o ? Nt(t.width) : t.width) / i, a = (o ? Nt(t.height) : t.height) / s;
  return (!r || !Number.isFinite(r)) && (r = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: r,
    y: a
  };
}
const Yl = /* @__PURE__ */ Te(0);
function _s(n) {
  const e = he(n);
  return !Un() || !e.visualViewport ? Yl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Gl(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== he(n) ? !1 : e;
}
function Ye(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), o = Kn(n);
  let r = Te(1);
  e && (i ? xe(i) && (r = rt(i)) : r = rt(n));
  const a = Gl(o, t, i) ? _s(o) : Te(0);
  let l = (s.left + a.x) / r.x, u = (s.top + a.y) / r.y, c = s.width / r.x, d = s.height / r.y;
  if (o) {
    const v = he(o), f = i && xe(i) ? he(i) : i;
    let h = v, b = Tn(h);
    for (; b && i && f !== h; ) {
      const m = rt(b), _ = b.getBoundingClientRect(), S = _e(b), y = _.left + (b.clientLeft + parseFloat(S.paddingLeft)) * m.x, g = _.top + (b.clientTop + parseFloat(S.paddingTop)) * m.y;
      l *= m.x, u *= m.y, c *= m.x, d *= m.y, l += y, u += g, h = he(b), b = Tn(h);
    }
  }
  return Ht({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function Zt(n, e) {
  const t = Jt(n).scrollLeft;
  return e ? e.left + t : Ye(Ie(n)).left + t;
}
function Es(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - Zt(n, t), s = t.top + e.scrollTop;
  return {
    x: i,
    y: s
  };
}
function Jl(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: s
  } = n;
  const o = s === "fixed", r = Ie(i), a = e ? Gt(e.floating) : !1;
  if (i === r || a && o)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Te(1);
  const c = Te(0), d = Ae(i);
  if ((d || !d && !o) && ((Qe(i) !== "body" || kt(r)) && (l = Jt(i)), Ae(i))) {
    const f = Ye(i);
    u = rt(i), c.x = f.x + i.clientLeft, c.y = f.y + i.clientTop;
  }
  const v = r && !d && !o ? Es(r, l) : Te(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + v.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + v.y
  };
}
function Zl(n) {
  return Array.from(n.getClientRects());
}
function Ql(n) {
  const e = Ie(n), t = Jt(n), i = n.ownerDocument.body, s = pe(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), o = pe(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let r = -t.scrollLeft + Zt(n);
  const a = -t.scrollTop;
  return _e(i).direction === "rtl" && (r += pe(e.clientWidth, i.clientWidth) - s), {
    width: s,
    height: o,
    x: r,
    y: a
  };
}
const xi = 25;
function eu(n, e) {
  const t = he(n), i = Ie(n), s = t.visualViewport;
  let o = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (s) {
    o = s.width, r = s.height;
    const c = Un();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  const u = Zt(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, v = getComputedStyle(d), f = c.compatMode === "CSS1Compat" && parseFloat(v.marginLeft) + parseFloat(v.marginRight) || 0, h = Math.abs(i.clientWidth - d.clientWidth - f);
    h <= xi && (o -= h);
  } else u <= xi && (o += u);
  return {
    width: o,
    height: r,
    x: a,
    y: l
  };
}
const tu = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function nu(n, e) {
  const t = Ye(n, !0, e === "fixed"), i = t.top + n.clientTop, s = t.left + n.clientLeft, o = Ae(n) ? rt(n) : Te(1), r = n.clientWidth * o.x, a = n.clientHeight * o.y, l = s * o.x, u = i * o.y;
  return {
    width: r,
    height: a,
    x: l,
    y: u
  };
}
function _i(n, e, t) {
  let i;
  if (e === "viewport")
    i = eu(n, t);
  else if (e === "document")
    i = Ql(Ie(n));
  else if (xe(e))
    i = nu(e, t);
  else {
    const s = _s(n);
    i = {
      x: e.x - s.x,
      y: e.y - s.y,
      width: e.width,
      height: e.height
    };
  }
  return Ht(i);
}
function ks(n, e) {
  const t = Ne(n);
  return t === e || !xe(t) || at(t) ? !1 : _e(t).position === "fixed" || ks(t, e);
}
function iu(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = wt(n, [], !1).filter((a) => xe(a) && Qe(a) !== "body"), s = null;
  const o = _e(n).position === "fixed";
  let r = o ? Ne(n) : n;
  for (; xe(r) && !at(r); ) {
    const a = _e(r), l = jn(r);
    !l && a.position === "fixed" && (s = null), (o ? !l && !s : !l && a.position === "static" && !!s && tu.has(s.position) || kt(r) && !l && ks(n, r)) ? i = i.filter((c) => c !== r) : s = a, r = Ne(r);
  }
  return e.set(n, i), i;
}
function su(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: s
  } = n;
  const r = [...t === "clippingAncestors" ? Gt(e) ? [] : iu(e, this._c) : [].concat(t), i], a = r[0], l = r.reduce((u, c) => {
    const d = _i(e, c, s);
    return u.top = pe(d.top, u.top), u.right = ze(d.right, u.right), u.bottom = ze(d.bottom, u.bottom), u.left = pe(d.left, u.left), u;
  }, _i(e, a, s));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function ou(n) {
  const {
    width: e,
    height: t
  } = xs(n);
  return {
    width: e,
    height: t
  };
}
function ru(n, e, t) {
  const i = Ae(e), s = Ie(e), o = t === "fixed", r = Ye(n, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Te(0);
  function u() {
    l.x = Zt(s);
  }
  if (i || !i && !o)
    if ((Qe(e) !== "body" || kt(s)) && (a = Jt(e)), i) {
      const f = Ye(e, !0, o, e);
      l.x = f.x + e.clientLeft, l.y = f.y + e.clientTop;
    } else s && u();
  o && !i && s && u();
  const c = s && !i && !o ? Es(s, a) : Te(0), d = r.left + a.scrollLeft - l.x - c.x, v = r.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: v,
    width: r.width,
    height: r.height
  };
}
function pn(n) {
  return _e(n).position === "static";
}
function Ei(n, e) {
  if (!Ae(n) || _e(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Ie(n) === t && (t = t.ownerDocument.body), t;
}
function Ts(n, e) {
  const t = he(n);
  if (Gt(n))
    return t;
  if (!Ae(n)) {
    let s = Ne(n);
    for (; s && !at(s); ) {
      if (xe(s) && !pn(s))
        return s;
      s = Ne(s);
    }
    return t;
  }
  let i = Ei(n, e);
  for (; i && Wl(i) && pn(i); )
    i = Ei(i, e);
  return i && at(i) && pn(i) && !jn(i) ? t : i || Kl(n) || t;
}
const au = async function(n) {
  const e = this.getOffsetParent || Ts, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: ru(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function lu(n) {
  return _e(n).direction === "rtl";
}
const uu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Jl,
  getDocumentElement: Ie,
  getClippingRect: su,
  getOffsetParent: Ts,
  getElementRects: au,
  getClientRects: Zl,
  getDimensions: ou,
  getScale: rt,
  isElement: xe,
  isRTL: lu
};
function Ps(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function cu(n, e) {
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
      width: v,
      height: f
    } = u;
    if (a || e(), !v || !f)
      return;
    const h = It(d), b = It(s.clientWidth - (c + v)), m = It(s.clientHeight - (d + f)), _ = It(c), y = {
      rootMargin: -h + "px " + -b + "px " + -m + "px " + -_ + "px",
      threshold: pe(0, ze(1, l)) || 1
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
      w === 1 && !Ps(u, n.getBoundingClientRect()) && r(), g = !1;
    }
    try {
      t = new IntersectionObserver(C, {
        ...y,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(C, y);
    }
    t.observe(n);
  }
  return r(!0), o;
}
function du(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: o = !0,
    elementResize: r = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Kn(n), c = s || o ? [...u ? wt(u) : [], ...wt(e)] : [];
  c.forEach((_) => {
    s && _.addEventListener("scroll", t, {
      passive: !0
    }), o && _.addEventListener("resize", t);
  });
  const d = u && a ? cu(u, t) : null;
  let v = -1, f = null;
  r && (f = new ResizeObserver((_) => {
    let [S] = _;
    S && S.target === u && f && (f.unobserve(e), cancelAnimationFrame(v), v = requestAnimationFrame(() => {
      var y;
      (y = f) == null || y.observe(e);
    })), t();
  }), u && !l && f.observe(u), f.observe(e));
  let h, b = l ? Ye(n) : null;
  l && m();
  function m() {
    const _ = Ye(n);
    b && !Ps(b, _) && t(), b = _, h = requestAnimationFrame(m);
  }
  return t(), () => {
    var _;
    c.forEach((S) => {
      s && S.removeEventListener("scroll", t), o && S.removeEventListener("resize", t);
    }), d?.(), (_ = f) == null || _.disconnect(), f = null, l && cancelAnimationFrame(h);
  };
}
const fu = $l, pu = Bl, ki = Ll, hu = Fl, vu = Ml, mu = Dl, gu = ql, yu = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), s = {
    platform: uu,
    ...t
  }, o = {
    ...s.platform,
    _c: i
  };
  return Il(n, e, {
    ...s,
    platform: o
  });
};
function bu(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Pn(n) {
  if (bu(n)) {
    const e = n.$el;
    return Vn(e) && Qe(e) === "#comment" ? null : e;
  }
  return n;
}
function ot(n) {
  return typeof n == "function" ? n() : p(n);
}
function wu(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Pn(ot(n.element));
      return t == null ? {} : mu({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function As(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ti(n, e) {
  const t = As(n);
  return Math.round(e * t) / t;
}
function Su(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, s = T(() => {
    var w;
    return (w = ot(t.open)) != null ? w : !0;
  }), o = T(() => ot(t.middleware)), r = T(() => {
    var w;
    return (w = ot(t.placement)) != null ? w : "bottom";
  }), a = T(() => {
    var w;
    return (w = ot(t.strategy)) != null ? w : "absolute";
  }), l = T(() => {
    var w;
    return (w = ot(t.transform)) != null ? w : !0;
  }), u = T(() => Pn(n.value)), c = T(() => Pn(e.value)), d = A(0), v = A(0), f = A(a.value), h = A(r.value), b = Xe({}), m = A(!1), _ = T(() => {
    const w = {
      position: f.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return w;
    const O = Ti(c.value, d.value), P = Ti(c.value, v.value);
    return l.value ? {
      ...w,
      transform: "translate(" + O + "px, " + P + "px)",
      ...As(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: f.value,
      left: O + "px",
      top: P + "px"
    };
  });
  let S;
  function y() {
    if (u.value == null || c.value == null)
      return;
    const w = s.value;
    yu(u.value, c.value, {
      middleware: o.value,
      placement: r.value,
      strategy: a.value
    }).then((O) => {
      d.value = O.x, v.value = O.y, f.value = O.strategy, h.value = O.placement, b.value = O.middlewareData, m.value = w !== !1;
    });
  }
  function g() {
    typeof S == "function" && (S(), S = void 0);
  }
  function C() {
    if (g(), i === void 0) {
      y();
      return;
    }
    if (u.value != null && c.value != null) {
      S = i(u.value, c.value, y);
      return;
    }
  }
  function x() {
    s.value || (m.value = !1);
  }
  return Z([o, r, a, s], y, {
    flush: "sync"
  }), Z([u, c], C, {
    flush: "sync"
  }), Z(s, x, {
    flush: "sync"
  }), $i() && Bi(g), {
    x: nt(d),
    y: nt(v),
    strategy: nt(f),
    placement: nt(h),
    middlewareData: nt(b),
    isPositioned: nt(m),
    floatingStyles: _,
    update: y
  };
}
const Cu = {
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
}, [Vd, xu] = Oe("PopperContent");
var _u = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ eo({
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
  }, { ...Cu }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = bs(), { forwardRef: o, currentElement: r } = ie(), a = A(), l = A(), { width: u, height: c } = Sa(l), d = T(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), v = T(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), f = T(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), h = T(() => ({
      padding: v.value,
      boundary: f.value.filter(gl),
      altBoundary: f.value.length > 0
    })), b = T(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), m = Xr(() => [
      fu({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && ki({
        ...h.value,
        ...b.value
      }),
      t.avoidCollisions && pu({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? gu() : void 0,
        ...h.value
      }),
      !t.prioritizePosition && t.avoidCollisions && ki({
        ...h.value,
        ...b.value
      }),
      hu({
        ...h.value,
        apply: ({ elements: R, rects: z, availableWidth: D, availableHeight: B }) => {
          const { width: Y, height: j } = z.reference, G = R.floating.style;
          G.setProperty("--reka-popper-available-width", `${D}px`), G.setProperty("--reka-popper-available-height", `${B}px`), G.setProperty("--reka-popper-anchor-width", `${Y}px`), G.setProperty("--reka-popper-anchor-height", `${j}px`);
        }
      }),
      l.value && wu({
        element: l.value,
        padding: t.arrowPadding
      }),
      yl({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && vu({
        strategy: "referenceHidden",
        ...h.value
      })
    ]), _ = T(() => t.reference ?? s.anchor.value), { floatingStyles: S, placement: y, isPositioned: g, middlewareData: C } = Su(_, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => du(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: m
    }), x = T(() => _n(y.value)[0]), w = T(() => _n(y.value)[1]);
    Wi(() => {
      g.value && i("placed");
    });
    const O = T(() => {
      const R = C.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), P = A("");
    be(() => {
      r.value && (P.value = window.getComputedStyle(r.value).zIndex);
    });
    const k = T(() => C.value.arrow?.x ?? 0), L = T(() => C.value.arrow?.y ?? 0);
    return xu({
      placedSide: x,
      onArrowChange: (R) => l.value = R,
      arrowX: k,
      arrowY: L,
      shouldHideArrow: O
    }), (R, z) => (E(), W("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: ut({
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
    }, [M(p(ne), Q({ ref: p(o) }, R.$attrs, {
      "as-child": t.asChild,
      as: R.as,
      "data-side": x.value,
      "data-align": w.value,
      style: { animation: p(g) ? void 0 : "none" }
    }), {
      default: I(() => [V(R.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Eu = _u;
function ku(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => vt(i, e, t)) : vt(n, e, t);
}
function vt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : qt(n, e);
}
const [Os, Tu] = Oe("ListboxRoot");
var Pu = /* @__PURE__ */ F({
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
    const i = n, s = t, { multiple: o, highlightOnHover: r, orientation: a, disabled: l, selectionBehavior: u, dir: c } = ct(i), { getItems: d } = He({ isProvider: !0 }), { handleTypeaheadSearch: v } = Fn(), { primitiveElement: f, currentElement: h } = zt(), b = wa(), m = is(c), _ = ss(h), S = A(), y = A(!1), g = A(!0), C = /* @__PURE__ */ Ft(i, "modelValue", s, {
      defaultValue: i.defaultValue ?? (o.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function x(q) {
      if (y.value = !0, i.multiple) {
        const H = Array.isArray(C.value) ? [...C.value] : [], U = H.findIndex((J) => vt(J, q, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? H.push(q) : H.splice(U, 1), C.value = H) : (C.value = [q], S.value = q);
      } else i.selectionBehavior === "toggle" && vt(C.value, q, i.by) ? C.value = void 0 : C.value = q;
      setTimeout(() => {
        y.value = !1;
      }, 1);
    }
    const w = A(null), O = A(null), P = A(!1), k = A(!1), L = /* @__PURE__ */ rn(), R = /* @__PURE__ */ rn(), z = /* @__PURE__ */ rn();
    function D() {
      return d().map((q) => q.ref).filter((q) => q.dataset.disabled !== "");
    }
    function B(q, H = !0) {
      if (!q) return;
      w.value = q, g.value && w.value.focus(), H && w.value.scrollIntoView({ block: "nearest" });
      const U = d().find((J) => J.ref === q);
      s("highlight", U);
    }
    function Y(q) {
      if (P.value) z.trigger(q);
      else {
        const H = d().find((U) => vt(U.value, q, i.by));
        H && (w.value = H.ref, B(H.ref));
      }
    }
    function j(q) {
      w.value && w.value.isConnected && (q.preventDefault(), q.stopPropagation(), k.value || w.value.click());
    }
    function G(q) {
      if (g.value) {
        if (y.value = !0, P.value) R.trigger(q);
        else {
          const H = q.altKey || q.ctrlKey || q.metaKey;
          if (H && q.key === "a" && o.value) {
            const U = d(), J = U.map((Ee) => Ee.value);
            C.value = [...J], q.preventDefault(), B(U[U.length - 1].ref);
          } else if (!H) {
            const U = v(q.key, d());
            U && B(U);
          }
        }
        setTimeout(() => {
          y.value = !1;
        }, 1);
      }
    }
    function ee() {
      k.value = !0;
    }
    function de() {
      oe(() => {
        k.value = !1;
      });
    }
    function et() {
      oe(() => {
        const q = new KeyboardEvent("keydown", { key: "PageUp" });
        je(q);
      });
    }
    function Se(q) {
      const H = w.value;
      H?.isConnected && (O.value = H), w.value = null, s("leave", q);
    }
    function tt(q) {
      const H = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (q.currentTarget?.dispatchEvent(H), s("entryFocus", H), !H.defaultPrevented)
        if (O.value) B(O.value);
        else {
          const U = D()?.[0];
          B(U);
        }
    }
    function je(q) {
      const H = al(q, a.value, m.value);
      if (!H) return;
      let U = D();
      if (w.value) {
        if (H === "last") U.reverse();
        else if (H === "prev" || H === "next") {
          H === "prev" && U.reverse();
          const J = U.indexOf(w.value);
          U = U.slice(J + 1);
        }
        en(q, U[0]);
      }
      if (U.length) {
        const J = !w.value && H === "prev" ? U.length - 1 : 0;
        B(U[J]);
      }
      if (P.value) return R.trigger(q);
    }
    function en(q, H) {
      if (!(P.value || i.selectionBehavior !== "replace" || !o.value || !Array.isArray(C.value) || (q.altKey || q.ctrlKey || q.metaKey) && !q.shiftKey) && q.shiftKey) {
        const J = d().filter((De) => De.ref.dataset.disabled !== "");
        let Ee = J.find((De) => De.ref === H)?.value;
        if (q.key === b.END ? Ee = J[J.length - 1].value : q.key === b.HOME && (Ee = J[0].value), !Ee || !S.value) return;
        const ft = Kr(J.map((De) => De.value), S.value, Ee);
        C.value = ft;
      }
    }
    async function tn(q) {
      if (await oe(), P.value) L.trigger(q);
      else {
        const H = D(), U = H.find((J) => J.dataset.state === "checked");
        U ? B(U) : H.length && B(H[0]);
      }
    }
    return Z(C, () => {
      y.value || oe(() => {
        tn();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: w,
      highlightItem: Y,
      highlightFirstItem: et,
      highlightSelected: tn,
      getItems: d
    }), Tu({
      modelValue: C,
      onValueChange: x,
      multiple: o,
      orientation: a,
      dir: m,
      disabled: l,
      highlightOnHover: r,
      highlightedElement: w,
      isVirtual: P,
      virtualFocusHook: L,
      virtualKeydownHook: R,
      virtualHighlightHook: z,
      by: i.by,
      firstValue: S,
      selectionBehavior: u,
      focusable: g,
      onLeave: Se,
      onEnter: tt,
      changeHighlight: B,
      onKeydownEnter: j,
      onKeydownNavigation: je,
      onKeydownTypeAhead: G,
      onCompositionStart: ee,
      onCompositionEnd: de,
      highlightFirstItem: et
    }), (q, H) => (E(), $(p(ne), {
      ref_key: "primitiveElement",
      ref: f,
      as: q.as,
      "as-child": q.asChild,
      dir: p(m),
      "data-disabled": p(l) ? "" : void 0,
      onPointerleave: Se,
      onFocusout: H[0] || (H[0] = async (U) => {
        const J = U.relatedTarget || U.target;
        await oe(), w.value && p(h) && !p(h).contains(J) && Se(U);
      })
    }, {
      default: I(() => [V(q.$slots, "default", { modelValue: p(C) }), p(_) && q.name ? (E(), $(p(dl), {
        key: 0,
        name: q.name,
        value: p(C),
        disabled: p(l),
        required: q.required
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
}), Au = Pu, Ou = /* @__PURE__ */ F({
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
    const { CollectionSlot: e } = He(), t = Os(), i = Zi(!1, 10);
    return (s, o) => (E(), $(p(e), null, {
      default: I(() => [M(p(ne), {
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
          o[2] || (o[2] = yn((r) => {
            p(t).orientation.value === "vertical" && (r.key === "ArrowLeft" || r.key === "ArrowRight") || p(t).orientation.value === "horizontal" && (r.key === "ArrowUp" || r.key === "ArrowDown") || (r.preventDefault(), p(t).focusable.value && p(t).onKeydownNavigation(r));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          yn(p(t).onKeydownEnter, ["enter"]),
          p(t).onKeydownTypeAhead
        ]
      }, {
        default: I(() => [V(s.$slots, "default")]),
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
}), Iu = Ou;
const Du = "listbox.select", [Lu, Mu] = Oe("ListboxItem");
var Ru = /* @__PURE__ */ F({
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
    const t = n, i = e, s = bt(void 0, "reka-listbox-item"), { CollectionItem: o } = He(), { forwardRef: r, currentElement: a } = ie(), l = Os(), u = T(() => a.value === l.highlightedElement.value), c = T(() => ku(l.modelValue.value, t.value, l.by)), d = T(() => l.disabled.value || t.disabled);
    async function v(h) {
      i("select", h), !h?.defaultPrevented && !d.value && h && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function f(h) {
      const b = {
        originalEvent: h,
        value: t.value
      };
      Vt(Du, v, b);
    }
    return Mu({ isSelected: c }), (h, b) => (E(), $(p(o), { value: h.value }, {
      default: I(() => [to([u.value, c.value], () => M(p(ne), Q({ id: p(s) }, h.$attrs, {
        ref: p(r),
        role: "option",
        tabindex: p(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: h.as,
        "as-child": h.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: f,
        onKeydown: yn(Fe(f, ["prevent"]), ["space"]),
        onPointermove: b[0] || (b[0] = () => {
          p(l).highlightedElement.value !== p(a) && p(l).highlightOnHover.value && !p(l).focusable.value && p(l).changeHighlight(p(a), !1);
        })
      }), {
        default: I(() => [V(h.$slots, "default")]),
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
}), $u = Ru, Bu = /* @__PURE__ */ F({
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
    const t = Lu();
    return (i, s) => p(t).isSelected.value ? (E(), $(p(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), qu = Bu;
function Fu(n) {
  const e = jt({ nonce: A() });
  return T(() => n?.value || e.nonce?.value);
}
const zu = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Nu = [" ", "Enter"], Ce = 10;
function St(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => An(i, e, t)) : An(n, e, t);
}
function An(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : qt(n, e);
}
function Wu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Hu = {
  key: 0,
  value: ""
}, [Ve, Is] = Oe("SelectRoot");
var Vu = /* @__PURE__ */ F({
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
    const t = n, i = e, { required: s, disabled: o, multiple: r, dir: a } = ct(t), l = /* @__PURE__ */ Ft(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (r.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ Ft(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = A(), d = A(), v = A({
      x: 0,
      y: 0
    }), f = T(() => r.value && Array.isArray(l.value) ? l.value?.length === 0 : Sn(l.value));
    He({ isProvider: !0 });
    const h = is(a), b = ss(c), m = A(/* @__PURE__ */ new Set()), _ = T(() => Array.from(m.value).map((g) => g.value).join(";"));
    function S(g) {
      if (r.value) {
        const C = Array.isArray(l.value) ? [...l.value] : [], x = C.findIndex((w) => An(w, g, t.by));
        x === -1 ? C.push(g) : C.splice(x, 1), l.value = [...C];
      } else l.value = g;
    }
    function y(g) {
      return Array.from(m.value).find((C) => St(g, C.value, t.by));
    }
    return Is({
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
      required: s,
      onOpenChange: (g) => {
        u.value = g;
      },
      dir: h,
      triggerPointerDownPosRef: v,
      disabled: o,
      isEmptyModelValue: f,
      optionsSet: m,
      onOptionAdd: (g) => {
        const C = y(g.value);
        C && m.value.delete(C), m.value.add(g);
      },
      onOptionRemove: (g) => {
        const C = y(g.value);
        C && m.value.delete(C);
      }
    }), (g, C) => (E(), $(p(hl), null, {
      default: I(() => [V(g.$slots, "default", {
        modelValue: p(l),
        open: p(u)
      }), p(b) ? (E(), $(Ku, {
        key: _.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: p(r),
        required: p(s),
        name: g.name,
        autocomplete: g.autocomplete,
        disabled: p(o),
        value: p(l)
      }, {
        default: I(() => [p(Sn)(p(l)) ? (E(), W("option", Hu)) : K("v-if", !0), (E(!0), W(ge, null, Ge(Array.from(m.value), (x) => (E(), W("option", Q({ key: x.value ?? "" }, { ref_for: !0 }, x), null, 16))), 128))]),
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
}), ju = Vu, Uu = /* @__PURE__ */ F({
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
    return (o, r) => (E(), $(p(ys), { "as-child": "" }, {
      default: I(() => [N("select", Q({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: s }), [V(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Ku = Uu, Xu = /* @__PURE__ */ F({
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
      default: Ce
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
    const t = qn(n);
    return (i, s) => (E(), $(p(Eu), Q(p(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: I(() => [V(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Yu = Xu;
const Gu = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Qt, Ds] = Oe("SelectContent");
var Ju = /* @__PURE__ */ F({
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
    pa(), ts(t.bodyLock);
    const { CollectionSlot: o, getItems: r } = He(), a = A();
    rs(a);
    const { search: l, handleTypeaheadSearch: u } = Fn(), c = A(), d = A(), v = A(), f = A(!1), h = A(!1), b = A(!1);
    function m() {
      d.value && a.value && hi([d.value, a.value]);
    }
    Z(f, () => {
      m();
    });
    const { onOpenChange: _, triggerPointerDownPosRef: S } = s;
    be((x) => {
      if (!a.value) return;
      let w = {
        x: 0,
        y: 0
      };
      const O = (k) => {
        w = {
          x: Math.abs(Math.round(k.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(k.pageY) - (S.value?.y ?? 0))
        };
      }, P = (k) => {
        k.pointerType !== "touch" && (w.x <= 10 && w.y <= 10 ? k.preventDefault() : a.value?.contains(k.target) || _(!1), document.removeEventListener("pointermove", O), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", O), document.addEventListener("pointerup", P, {
        capture: !0,
        once: !0
      })), x(() => {
        document.removeEventListener("pointermove", O), document.removeEventListener("pointerup", P, { capture: !0 });
      });
    });
    function y(x) {
      const w = x.ctrlKey || x.altKey || x.metaKey;
      if (x.key === "Tab" && x.preventDefault(), !w && x.key.length === 1 && u(x.key, r()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(x.key)) {
        let P = [...r().map((k) => k.ref)];
        if (["ArrowUp", "End"].includes(x.key) && (P = P.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(x.key)) {
          const k = x.target, L = P.indexOf(k);
          P = P.slice(L + 1);
        }
        setTimeout(() => hi(P)), x.preventDefault();
      }
    }
    const g = T(() => t.position === "popper" ? t : {}), C = qn(g.value);
    return Ds({
      content: a,
      viewport: c,
      onViewportChange: (x) => {
        c.value = x;
      },
      itemRefCallback: (x, w, O) => {
        const P = !h.value && !O, k = St(s.modelValue.value, w, s.by);
        if (s.multiple.value) {
          if (b.value) return;
          (k || P) && (d.value = x, k && (b.value = !0));
        } else (k || P) && (d.value = x);
        P && (h.value = !0);
      },
      selectedItem: d,
      selectedItemText: v,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (x, w, O) => {
        const P = !h.value && !O;
        (St(s.modelValue.value, w, s.by) || P) && (v.value = x);
      },
      focusSelectedItem: m,
      position: t.position,
      isPositioned: f,
      searchRef: l
    }), (x, w) => (E(), $(p(o), null, {
      default: I(() => [M(p(ds), {
        "as-child": "",
        onMountAutoFocus: w[6] || (w[6] = Fe(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: w[7] || (w[7] = (O) => {
          i("closeAutoFocus", O), !O.defaultPrevented && (p(s).triggerElement.value?.focus({ preventScroll: !0 }), O.preventDefault());
        })
      }, {
        default: I(() => [M(p(us), {
          "as-child": "",
          "disable-outside-pointer-events": x.disableOutsidePointerEvents,
          onFocusOutside: w[2] || (w[2] = Fe(() => {
          }, ["prevent"])),
          onDismiss: w[3] || (w[3] = (O) => p(s).onOpenChange(!1)),
          onEscapeKeyDown: w[4] || (w[4] = (O) => i("escapeKeyDown", O)),
          onPointerDownOutside: w[5] || (w[5] = (O) => i("pointerDownOutside", O))
        }, {
          default: I(() => [(E(), $(no(x.position === "popper" ? Yu : nc), Q({
            ...x.$attrs,
            ...p(C)
          }, {
            id: p(s).contentId,
            ref: (O) => {
              const P = p(Pe)(O);
              P?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = P.firstElementChild : a.value = P;
            },
            role: "listbox",
            "data-state": p(s).open.value ? "open" : "closed",
            dir: p(s).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: w[0] || (w[0] = Fe(() => {
            }, ["prevent"])),
            onPlaced: w[1] || (w[1] = (O) => f.value = !0),
            onKeydown: y
          }), {
            default: I(() => [V(x.$slots, "default")]),
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
}), Zu = Ju;
const [Qu, ec] = Oe("SelectItemAlignedPosition");
var tc = /* @__PURE__ */ F({
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
    const t = n, i = e, { getItems: s } = He(), o = Ve(), r = Qt(), a = A(!1), l = A(!0), u = A(), { forwardRef: c, currentElement: d } = ie(), { viewport: v, selectedItem: f, selectedItemText: h, focusSelectedItem: b } = r;
    function m() {
      if (o.triggerElement.value && o.valueElement.value && u.value && d.value && v?.value && f?.value && h?.value) {
        const y = o.triggerElement.value.getBoundingClientRect(), g = d.value.getBoundingClientRect(), C = o.valueElement.value.getBoundingClientRect(), x = h.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const q = x.left - g.left, H = C.left - q, U = y.left - H, J = y.width + U, Ee = Math.max(J, g.width), ft = window.innerWidth - Ce, De = li(H, Ce, Math.max(Ce, ft - Ee));
          u.value.style.minWidth = `${J}px`, u.value.style.left = `${De}px`;
        } else {
          const q = g.right - x.right, H = window.innerWidth - C.right - q, U = window.innerWidth - y.right - H, J = y.width + U, Ee = Math.max(J, g.width), ft = window.innerWidth - Ce, De = li(H, Ce, Math.max(Ce, ft - Ee));
          u.value.style.minWidth = `${J}px`, u.value.style.right = `${De}px`;
        }
        const w = s().map((q) => q.ref), O = window.innerHeight - Ce * 2, P = v.value.scrollHeight, k = window.getComputedStyle(d.value), L = Number.parseInt(k.borderTopWidth, 10), R = Number.parseInt(k.paddingTop, 10), z = Number.parseInt(k.borderBottomWidth, 10), D = Number.parseInt(k.paddingBottom, 10), B = L + R + P + D + z, Y = Math.min(f.value.offsetHeight * 5, B), j = window.getComputedStyle(v.value), G = Number.parseInt(j.paddingTop, 10), ee = Number.parseInt(j.paddingBottom, 10), de = y.top + y.height / 2 - Ce, et = O - de, Se = f.value.offsetHeight / 2, tt = f.value.offsetTop + Se, je = L + R + tt, en = B - je;
        if (je <= de) {
          const q = f.value === w[w.length - 1];
          u.value.style.bottom = "0px";
          const H = d.value.clientHeight - v.value.offsetTop - v.value.offsetHeight, U = Math.max(et, Se + (q ? ee : 0) + H + z), J = je + U;
          u.value.style.height = `${J}px`;
        } else {
          const q = f.value === w[0];
          u.value.style.top = "0px";
          const U = Math.max(de, L + v.value.offsetTop + (q ? G : 0) + Se) + en;
          u.value.style.height = `${U}px`, v.value.scrollTop = je - de + v.value.offsetTop;
        }
        u.value.style.margin = `${Ce}px 0`, u.value.style.minHeight = `${Y}px`, u.value.style.maxHeight = `${O}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const _ = A("");
    se(async () => {
      await oe(), m(), d.value && (_.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(y) {
      y && l.value === !0 && (m(), b?.(), l.value = !1);
    }
    return la(o.triggerElement, () => {
      m();
    }), ec({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (y, g) => (E(), W("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: ut({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: _.value
      })
    }, [M(p(ne), Q({
      ref: p(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...y.$attrs,
      ...t
    }), {
      default: I(() => [V(y.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), nc = tc, ic = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Is(n.context), Ds(Gu), (t, i) => V(t.$slots, "default");
  }
}), sc = ic;
const oc = { key: 1 };
var rc = /* @__PURE__ */ F({
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
    const t = n, s = ha(t, e), o = Ve(), r = A();
    se(() => {
      r.value = new DocumentFragment();
    });
    const a = A(), l = T(() => t.forceMount || o.open.value), u = A(l.value);
    return Z(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (E(), $(p(zn), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: I(() => [M(Zu, In(Dn({
        ...p(s),
        ...c.$attrs
      })), {
        default: I(() => [V(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : r.value ? (E(), W("div", oc, [(E(), $(Ni, { to: r.value }, [M(sc, { context: p(o) }, {
      default: I(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), ac = rc, lc = /* @__PURE__ */ F({
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
    return (e, t) => (E(), $(p(ne), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: I(() => [V(e.$slots, "default", {}, () => [t[0] || (t[0] = ae("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), uc = lc;
const [Ls, cc] = Oe("SelectItem");
var dc = /* @__PURE__ */ F({
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
    const t = n, i = e, { disabled: s } = ct(t), o = Ve(), r = Qt(), { forwardRef: a, currentElement: l } = ie(), { CollectionItem: u } = He(), c = T(() => St(o.modelValue?.value, t.value, o.by)), d = A(!1), v = A(t.textValue ?? ""), f = bt(void 0, "reka-select-item-text"), h = "select.select";
    async function b(g) {
      if (g.defaultPrevented) return;
      const C = {
        originalEvent: g,
        value: t.value
      };
      Vt(h, m, C);
    }
    async function m(g) {
      await oe(), i("select", g), !g.defaultPrevented && (s.value || (o.onValueChange(t.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function _(g) {
      await oe(), !g.defaultPrevented && (s.value ? r.onItemLeave?.() : g.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(g) {
      await oe(), !g.defaultPrevented && g.currentTarget === ye() && r.onItemLeave?.();
    }
    async function y(g) {
      await oe(), !(g.defaultPrevented || r.searchRef?.value !== "" && g.key === " ") && (Nu.includes(g.key) && b(g), g.key === " " && g.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return se(() => {
      l.value && r.itemRefCallback(l.value, t.value, t.disabled);
    }), cc({
      value: t.value,
      disabled: s,
      textId: f,
      isSelected: c,
      onItemTextChange: (g) => {
        v.value = ((v.value || g?.textContent) ?? "").trim();
      }
    }), (g, C) => (E(), $(p(u), { value: { textValue: v.value } }, {
      default: I(() => [M(p(ne), {
        ref: p(a),
        role: "option",
        "aria-labelledby": p(f),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": p(s) || void 0,
        "data-disabled": p(s) ? "" : void 0,
        tabindex: p(s) ? void 0 : -1,
        as: g.as,
        "as-child": g.asChild,
        onFocus: C[0] || (C[0] = (x) => d.value = !0),
        onBlur: C[1] || (C[1] = (x) => d.value = !1),
        onPointerup: b,
        onPointerdown: C[2] || (C[2] = (x) => {
          x.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: C[3] || (C[3] = Fe(() => {
        }, ["prevent", "stop"])),
        onPointermove: _,
        onPointerleave: S,
        onKeydown: y
      }, {
        default: I(() => [V(g.$slots, "default")]),
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
}), fc = dc, pc = /* @__PURE__ */ F({
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
    const e = n, t = Ls();
    return (i, s) => p(t).isSelected.value ? (E(), $(p(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: I(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), hc = pc, vc = /* @__PURE__ */ F({
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
    const e = n, t = Ve(), i = Qt(), s = Ls(), { forwardRef: o, currentElement: r } = ie(), a = T(() => ({
      value: s.value,
      disabled: s.disabled.value,
      textContent: r.value?.textContent ?? s.value?.toString() ?? ""
    }));
    return se(() => {
      r.value && (s.onItemTextChange(r.value), i.itemTextRefCallback(r.value, s.value, s.disabled.value), t.onOptionAdd(a.value));
    }), Et(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (E(), $(p(ne), Q({
      id: p(s).textId,
      ref: p(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: I(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), mc = vc, gc = /* @__PURE__ */ F({
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
    return (t, i) => (E(), $(p(vs), In(Dn(e)), {
      default: I(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), yc = gc, bc = /* @__PURE__ */ F({
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
    const e = n, t = Ve(), { forwardRef: i, currentElement: s } = ie(), o = T(() => t.disabled?.value || e.disabled);
    t.contentId ||= bt(void 0, "reka-select-content"), se(() => {
      t.onTriggerChange(s.value);
    });
    const { getItems: r } = He(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = Fn();
    function c() {
      o.value || (t.onOpenChange(!0), u());
    }
    function d(v) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(v.pageX),
        y: Math.round(v.pageY)
      };
    }
    return (v, f) => (E(), $(p(ml), {
      "as-child": "",
      reference: v.reference
    }, {
      default: I(() => [M(p(ne), {
        ref: p(i),
        role: "combobox",
        type: v.as === "button" ? "button" : void 0,
        "aria-controls": p(t).contentId,
        "aria-expanded": p(t).open.value || !1,
        "aria-required": p(t).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: p(t)?.dir.value,
        "data-state": p(t)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": p(Wu)(p(t).modelValue?.value) ? "" : void 0,
        "as-child": v.asChild,
        as: v.as,
        onClick: f[0] || (f[0] = (h) => {
          h?.currentTarget?.focus();
        }),
        onPointerdown: f[1] || (f[1] = (h) => {
          if (h.pointerType === "touch") return h.preventDefault();
          const b = h.target;
          b.hasPointerCapture(h.pointerId) && b.releasePointerCapture(h.pointerId), h.button === 0 && h.ctrlKey === !1 && (d(h), h.preventDefault());
        }),
        onPointerup: f[2] || (f[2] = Fe((h) => {
          h.pointerType === "touch" && d(h);
        }, ["prevent"])),
        onKeydown: f[3] || (f[3] = (h) => {
          const b = p(a) !== "";
          !(h.ctrlKey || h.altKey || h.metaKey) && h.key.length === 1 && b && h.key === " " || (p(l)(h.key, p(r)()), p(zu).includes(h.key) && (c(), h.preventDefault()));
        })
      }, {
        default: I(() => [V(v.$slots, "default")]),
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
}), wc = bc, Sc = /* @__PURE__ */ F({
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
    se(() => {
      s.valueElement = i;
    });
    const o = T(() => {
      let a = [];
      const l = Array.from(s.optionsSet.value), u = (c) => l.find((d) => St(c, d.value, s.by));
      return Array.isArray(s.modelValue.value) ? a = s.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(s.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), r = T(() => o.value.length ? o.value.join(", ") : e.placeholder);
    return (a, l) => (E(), $(p(ne), {
      ref: p(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: I(() => [V(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: p(s).modelValue.value
      }, () => [ae(X(r.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Cc = Sc, xc = /* @__PURE__ */ F({
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
    const e = n, { nonce: t } = ct(e), i = Fu(t), s = Qt(), o = s.position === "item-aligned" ? Qu() : void 0, { forwardRef: r, currentElement: a } = ie();
    se(() => {
      s?.onViewportChange(a.value);
    });
    const l = A(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: v, contentWrapper: f } = o ?? {};
      if (v?.value && f?.value) {
        const h = Math.abs(l.value - d.scrollTop);
        if (h > 0) {
          const b = window.innerHeight - Ce * 2, m = Number.parseFloat(f.value.style.minHeight), _ = Number.parseFloat(f.value.style.height), S = Math.max(m, _);
          if (S < b) {
            const y = S + h, g = Math.min(b, y), C = y - g;
            f.value.style.height = `${g}px`, f.value.style.bottom === "0px" && (d.scrollTop = C > 0 ? C : 0, f.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (E(), W(ge, null, [M(p(ne), Q({
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
      default: I(() => [V(c.$slots, "default")]),
      _: 3
    }, 16), M(p(ne), {
      as: "style",
      nonce: p(i)
    }, {
      default: I(() => d[0] || (d[0] = [ae(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), _c = xc;
const Ec = /* @__PURE__ */ F({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, i = A(), s = A([]);
    return se(() => {
      const o = i.value?.closest(".speaker-sidebar");
      o && (s.value = [o]);
    }), (o, r) => (E(), W("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      M(p(ju), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (a) => t("update:selectedValue", a))
      }, {
        default: I(() => [
          M(p(wc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: I(() => [
              M(p(Cc), { class: "sidebar-select-trigger-label" }),
              M(p(uc), null, {
                default: I(() => [
                  M(p(Oo), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          M(p(yc), { disabled: "" }, {
            default: I(() => [
              M(p(ac), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": s.value
              }, {
                default: I(() => [
                  M(p(_c), null, {
                    default: I(() => [
                      (E(!0), W(ge, null, Ge(n.items, (a) => (E(), $(p(fc), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: I(() => [
                          M(p(hc), { class: "sidebar-select-item-indicator" }, {
                            default: I(() => [
                              M(p(Rn), { size: 14 })
                            ]),
                            _: 1
                          }),
                          M(p(mc), null, {
                            default: I(() => [
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
}), kc = { class: "sidebar-select" }, Tc = ["aria-label"], Pc = { class: "sidebar-select-trigger-label" }, Ac = /* @__PURE__ */ F({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = A(!1), o = T(
      () => t.items.find((a) => a.value === t.selectedValue)?.label ?? ""
    );
    function r(a) {
      i("update:selectedValue", a), s.value = !1;
    }
    return (a, l) => (E(), W("div", kc, [
      N("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (u) => s.value = !0)
      }, [
        N("span", Pc, X(o.value), 1)
      ], 8, Tc),
      M(p(as), {
        open: s.value,
        "onUpdate:open": l[2] || (l[2] = (u) => s.value = u)
      }, {
        default: I(() => [
          M(p(ms), { disabled: "" }, {
            default: I(() => [
              M(p(hs), { class: "editor-overlay" }),
              M(p(ps), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: I(() => [
                  M(p(gs), { class: "sr-only" }, {
                    default: I(() => [
                      ae(X(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = N("div", { class: "sheet-handle" }, null, -1)),
                  M(p(Au), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (u) => r(u))
                  }, {
                    default: I(() => [
                      M(p(Iu), { class: "sheet-list" }, {
                        default: I(() => [
                          (E(!0), W(ge, null, Ge(n.items, (u) => (E(), $(p($u), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: I(() => [
                              M(p(qu), { class: "sheet-item-indicator" }, {
                                default: I(() => [
                                  M(p(Rn), { size: 16 })
                                ]),
                                _: 1
                              }),
                              N("span", null, X(u.label), 1)
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
}), Xn = /* @__PURE__ */ F({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Ji();
    return (s, o) => p(i) ? (E(), $(Ac, Q({ key: 0 }, s.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (r) => t("update:selectedValue", r))
    }), null, 16)) : (E(), $(Ec, Q({ key: 1 }, s.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (r) => t("update:selectedValue", r))
    }), null, 16));
  }
}), Ms = /* @__PURE__ */ F({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: s } = we(), o = T(
      () => t.channels.map((r) => ({ value: r.id, label: r.name }))
    );
    return (r, a) => (E(), $(Xn, {
      items: o.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: p(s)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Oc = { class: "speaker-sidebar" }, Ic = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Dc = { class: "sidebar-title" }, Lc = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Mc = { class: "sidebar-title" }, Rc = {
  key: 2,
  class: "sidebar-section"
}, $c = { class: "sidebar-title" }, Bc = { class: "subtitle-toggle" }, qc = { class: "subtitle-toggle-label" }, Fc = { class: "subtitle-slider" }, zc = { class: "subtitle-slider-label" }, Nc = { class: "subtitle-slider-value" }, Wc = ["value", "disabled"], Hc = {
  key: 3,
  class: "sidebar-section"
}, Vc = { class: "sidebar-title" }, jc = { class: "speaker-list" }, Uc = { class: "speaker-name" }, Kc = /* @__PURE__ */ F({
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
    const e = n, t = Ze(), { t: i, locale: s } = we(), o = T(
      () => Hi(e.translations, s.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (r, a) => (E(), W("aside", Oc, [
      n.channels.length > 1 ? (E(), W("section", Ic, [
        N("h2", Dc, X(p(i)("sidebar.channel")), 1),
        M(Ms, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => r.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (E(), W("section", Lc, [
        N("h2", Mc, X(p(i)("sidebar.translation")), 1),
        M(Xn, {
          items: o.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => r.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      p(t).subtitle ? (E(), W("section", Rc, [
        N("h2", $c, X(p(i)("sidebar.subtitle")), 1),
        N("div", Bc, [
          N("span", qc, X(p(i)("subtitle.show")), 1),
          M(Vr, {
            modelValue: p(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => p(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        N("label", Fc, [
          N("span", zc, [
            ae(X(p(i)("subtitle.fontSize")) + " ", 1),
            N("span", Nc, X(p(t).subtitle.fontSize.value) + "px", 1)
          ]),
          N("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: p(t).subtitle.fontSize.value,
            disabled: !p(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => p(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Wc)
        ])
      ])) : K("", !0),
      n.speakers.length ? (E(), W("section", Hc, [
        N("h2", Vc, X(p(i)("sidebar.speakers")), 1),
        N("ul", jc, [
          (E(!0), W(ge, null, Ge(n.speakers, (l) => (E(), W("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            M(Xi, {
              color: l.color
            }, null, 8, ["color"]),
            N("span", Uc, X(l.name), 1)
          ]))), 128))
        ])
      ])) : K("", !0)
    ]));
  }
}), Pi = /* @__PURE__ */ re(Kc, [["__scopeId", "data-v-0a4624c1"]]), Xc = /* @__PURE__ */ F({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = io(n, "open"), { t } = we();
    return (i, s) => (E(), $(p(as), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (o) => e.value = o)
    }, {
      default: I(() => [
        M(p(ms), { disabled: "" }, {
          default: I(() => [
            M(p(hs), { class: "editor-overlay" }),
            M(p(ps), { class: "sidebar-drawer" }, {
              default: I(() => [
                M(p(gs), { class: "sr-only" }, {
                  default: I(() => [
                    ae(X(p(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                M(p(Oa), {
                  class: "sidebar-close",
                  "aria-label": p(t)("header.closeSidebar")
                }, {
                  default: I(() => [
                    M(p($n), { size: 20 })
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
}), Yc = { class: "player-controls" }, Gc = { class: "controls-left" }, Jc = { class: "controls-time" }, Zc = { class: "time-display" }, Qc = { class: "time-display" }, ed = { class: "controls-right" }, td = ["value", "aria-label", "disabled"], nd = /* @__PURE__ */ F({
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
    const t = e, { t: i } = we(), s = A(!1);
    function o(r) {
      const a = r.target;
      t("update:volume", parseFloat(a.value));
    }
    return (r, a) => (E(), W("div", Yc, [
      N("div", Gc, [
        M(me, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": p(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: I(() => [
            M(p($o), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        M(me, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? p(i)("player.pause") : p(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: I(() => [
            n.isPlaying ? (E(), $(p(Lo), {
              key: 0,
              size: 20
            })) : (E(), $(p(Mo), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        M(me, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": p(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: I(() => [
            M(p(Bo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      N("div", Jc, [
        N("time", Zc, X(n.currentTime), 1),
        a[7] || (a[7] = N("span", { class: "time-separator" }, "/", -1)),
        N("time", Qc, X(n.duration), 1)
      ]),
      N("div", ed, [
        N("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          M(me, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? p(i)("player.unmute") : p(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: I(() => [
              n.isMuted ? (E(), $(p(zo), {
                key: 0,
                size: 16
              })) : (E(), $(p(Fo), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          so(N("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": p(i)("player.volume"),
            disabled: !n.isReady,
            onInput: o
          }, null, 40, td), [
            [oo, s.value]
          ])
        ], 32),
        M(me, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": p(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: I(() => [
            ae(X(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), id = /* @__PURE__ */ re(nd, [["__scopeId", "data-v-02ebaa64"]]);
function le(n, e, t, i) {
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
let Tt = class {
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
const Dt = { decode: function(n, e) {
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
function Rs(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [o, r] of Object.entries(s)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Rs(o, r));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function Ai(n, e, t) {
  const i = Rs(n, e || {});
  return t?.appendChild(i), i;
}
var sd = Object.freeze({ __proto__: null, createElement: Ai, default: Ai });
const od = { fetchBlob: function(n, e, t) {
  return le(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(s, o) {
      le(this, void 0, void 0, (function* () {
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
function Ke(n, e) {
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
  }, s = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((o) => o()));
  };
}
class rd extends Tt {
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
function ad({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: s = 0, barAlign: o }) {
  let r = Math.round(n * t * i), a = r + Math.round(e * t * i) || 1;
  return a < s && (a = s, o || (r = a / 2)), { topHeight: r, totalHeight: a };
}
function ld({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: s }) {
  return n === "top" ? 0 : n === "bottom" ? s - i : e - t;
}
function Oi(n, e, t) {
  const i = e - n.left, s = t - n.top;
  return [i / n.width, s / n.height];
}
function $s(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Ii(n, e) {
  if (!$s(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Di({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, s = Math.floor(i * t);
  return [s - 1, s, s + 1];
}
function Bs(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function ud(n) {
  const e = te({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ke((() => (function(o) {
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
    n.removeEventListener("scroll", s), Bs(e);
  } };
}
class cd extends Tt {
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
      const i = this.wrapper.getBoundingClientRect(), [s, o] = Oi(i, t.clientX, t.clientY);
      this.emit("click", s, o);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [s, o] = Oi(i, t.clientX, t.clientY);
      this.emit("dblclick", s, o);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = ud(this.scrollContainer);
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
      const { threshold: s = 3, mouseButton: o = 0, touchDelay: r = 100 } = i, a = te(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (v) => {
        if (v.button !== o || (l.set(v.pointerId, v), l.size > 1)) return;
        let f = v.clientX, h = v.clientY, b = !1;
        const m = Date.now(), _ = t.getBoundingClientRect(), { left: S, top: y } = _, g = (P) => {
          if (P.defaultPrevented || l.size > 1 || u && Date.now() - m < r) return;
          const k = P.clientX, L = P.clientY, R = k - f, z = L - h;
          (b || Math.abs(R) > s || Math.abs(z) > s) && (P.preventDefault(), P.stopPropagation(), b || (a.set({ type: "start", x: f - S, y: h - y }), b = !0), a.set({ type: "move", x: k - S, y: L - y, deltaX: R, deltaY: z }), f = k, h = L);
        }, C = (P) => {
          if (l.delete(P.pointerId), b) {
            const k = P.clientX, L = P.clientY;
            a.set({ type: "end", x: k - S, y: L - y });
          }
          c();
        }, x = (P) => {
          l.delete(P.pointerId), P.relatedTarget && P.relatedTarget !== document.documentElement || C(P);
        }, w = (P) => {
          b && (P.stopPropagation(), P.preventDefault());
        }, O = (P) => {
          P.defaultPrevented || l.size > 1 || b && P.preventDefault();
        };
        document.addEventListener("pointermove", g), document.addEventListener("pointerup", C), document.addEventListener("pointerout", x), document.addEventListener("pointercancel", x), document.addEventListener("touchmove", O, { passive: !1 }), document.addEventListener("click", w, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", g), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", x), document.removeEventListener("pointercancel", x), document.removeEventListener("touchmove", O), setTimeout((() => {
            document.removeEventListener("click", w, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), Bs(a);
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
        return r?.every(((v) => !v.overlay)) ? d / l : d;
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
      return i.forEach(((d, v) => {
        u.addColorStop(v * c, d);
      })), u;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, i, s) {
    const { width: o, height: r } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: v } = (function({ width: h, height: b, length: m, options: _, pixelRatio: S }) {
      const y = b / 2, g = _.barWidth ? _.barWidth * S : 1, C = _.barGap ? _.barGap * S : _.barWidth ? g / 2 : 0, x = g + C || 1;
      return { halfHeight: y, barWidth: g, barGap: C, barRadius: _.barRadius || 0, barMinHeight: _.barMinHeight ? _.barMinHeight * S : 0, barIndexScale: m > 0 ? h / x / m : 0, barSpacing: x };
    })({ width: o, height: r, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), f = (function({ channelData: h, barIndexScale: b, barSpacing: m, barWidth: _, halfHeight: S, vScale: y, canvasHeight: g, barAlign: C, barMinHeight: x }) {
      const w = h[0] || [], O = h[1] || w, P = w.length, k = [];
      let L = 0, R = 0, z = 0;
      for (let D = 0; D <= P; D++) {
        const B = Math.round(D * b);
        if (B > L) {
          const { topHeight: G, totalHeight: ee } = ad({ maxTop: R, maxBottom: z, halfHeight: S, vScale: y, barMinHeight: x, barAlign: C }), de = ld({ barAlign: C, halfHeight: S, topHeight: G, totalHeight: ee, canvasHeight: g });
          k.push({ x: L * m, y: de, width: _, height: ee }), L = B, R = 0, z = 0;
        }
        const Y = Math.abs(w[D] || 0), j = Math.abs(O[D] || 0);
        Y > R && (R = Y), j > z && (z = j);
      }
      return k;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: r, barAlign: t.barAlign, barMinHeight: v });
    i.beginPath();
    for (const h of f) u && "roundRect" in i ? i.roundRect(h.x, h.y, h.width, h.height, u) : i.rect(h.x, h.y, h.width, h.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, s) {
    const { width: o, height: r } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const v = c / 2, f = l[0] || [];
      return [f, l[1] || f].map(((h, b) => {
        const m = h.length, _ = m ? u / m : 0, S = v, y = b === 0 ? -1 : 1, g = [{ x: 0, y: S }];
        let C = 0, x = 0;
        for (let w = 0; w <= m; w++) {
          const O = Math.round(w * _);
          if (O > C) {
            const k = S + (Math.round(x * v * d) || 1) * y;
            g.push({ x: C, y: k }), C = O, x = 0;
          }
          const P = Math.abs(h[w] || 0);
          P > x && (x = P);
        }
        return g.push({ x: C, y: S }), g;
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
      let v = l ?? 0;
      if (!l) for (let f = 0; f < d.length; f++) {
        const h = (u = d[f]) !== null && u !== void 0 ? u : 0, b = Math.abs(h);
        b > v && (v = b);
      }
      return v ? c / v : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    $s(t) ? this.renderBarWaveform(e, t, i, s) : this.renderLineWaveform(e, t, i, s);
  }
  renderSingleCanvas(e, t, i, s, o, r, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(s * l), u.style.width = `${i}px`, u.style.height = `${s}px`, u.style.left = `${Math.round(o)}px`, r.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), v = d.getContext("2d");
      v.drawImage(u, 0, 0), v.globalCompositeOperation = "source-in", v.fillStyle = this.convertColorValues(t.progressColor, v), v.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, s, o, r) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: h, totalWidth: b, options: m }) {
      return Ii(Math.min(8e3, h, b), m);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const v = (h) => {
      if (h < 0 || h >= f || d[h]) return;
      d[h] = !0;
      const b = h * c;
      let m = Math.min(u - b, c);
      if (m = Ii(m, t), m <= 0) return;
      const _ = (function({ channelData: S, offset: y, clampedWidth: g, totalWidth: C }) {
        return S.map(((x) => {
          const w = Math.floor(y / C * x.length), O = Math.floor((y + g) / C * x.length);
          return x.slice(w, O);
        }));
      })({ channelData: e, offset: b, clampedWidth: m, totalWidth: u });
      this.renderSingleCanvas(_, t, m, s, b, o, r);
    }, f = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let h = 0; h < f; h++) v(h);
      return;
    }
    if (Di({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: f }).forEach(((h) => v(h))), f > 1) {
      const h = this.on("scroll", (() => {
        const { scrollLeft: b } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", r.innerHTML = "", d = {}), Di({ scrollLeft: b, totalWidth: u, numCanvases: f }).forEach(((m) => v(m)));
      }));
      this.unsubscribeOnScroll.push(h);
    }
  }
  renderChannel(e, t, i, s) {
    var { overlay: o } = t, r = (function(c, d) {
      var v = {};
      for (var f in c) Object.prototype.hasOwnProperty.call(c, f) && d.indexOf(f) < 0 && (v[f] = c[f]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var h = 0;
        for (f = Object.getOwnPropertySymbols(c); h < f.length; h++) d.indexOf(f[h]) < 0 && Object.prototype.propertyIsEnumerable.call(c, f[h]) && (v[f[h]] = c[f[h]]);
      }
      return v;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(r.height, r.splitChannels);
    a.style.height = `${l}px`, o && s > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, r, i, l, a, u);
  }
  render(e) {
    return le(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: r, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: v, pixelRatio: f }) {
        const h = Math.ceil(u * c), b = h > d, m = !!(v && !b);
        return { scrollWidth: h, isScrollable: b, useParentWidth: m, width: (m ? d : h) * f };
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
    return le(this, void 0, void 0, (function* () {
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
class dd extends Tt {
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
class hn extends Tt {
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
const fd = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ct extends rd {
  static create(e) {
    return new Ct(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new hn() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, fd, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, v, f;
      const h = (l = a?.currentTime) !== null && l !== void 0 ? l : te(0), b = (u = a?.duration) !== null && u !== void 0 ? u : te(0), m = (c = a?.isPlaying) !== null && c !== void 0 ? c : te(!1), _ = (d = a?.isSeeking) !== null && d !== void 0 ? d : te(!1), S = (v = a?.volume) !== null && v !== void 0 ? v : te(1), y = (f = a?.playbackRate) !== null && f !== void 0 ? f : te(1), g = te(null), C = te(null), x = te(""), w = te(0), O = te(0), P = Ke((() => !m.value), [m]), k = Ke((() => g.value !== null), [g]), L = Ke((() => k.value && b.value > 0), [k, b]), R = Ke((() => h.value), [h]), z = Ke((() => b.value > 0 ? h.value / b.value : 0), [h, b]);
      return { state: { currentTime: h, duration: b, isPlaying: m, isPaused: P, isSeeking: _, volume: S, playbackRate: y, audioBuffer: g, peaks: C, url: x, zoom: w, scrollPosition: O, canPlay: k, isReady: L, progress: R, progressPercent: z }, actions: { setCurrentTime: (D) => {
        const B = Math.max(0, Math.min(b.value || 1 / 0, D));
        h.set(B);
      }, setDuration: (D) => {
        b.set(Math.max(0, D));
      }, setPlaying: (D) => {
        m.set(D);
      }, setSeeking: (D) => {
        _.set(D);
      }, setVolume: (D) => {
        const B = Math.max(0, Math.min(1, D));
        S.set(B);
      }, setPlaybackRate: (D) => {
        const B = Math.max(0.1, Math.min(16, D));
        y.set(B);
      }, setAudioBuffer: (D) => {
        g.set(D), D && b.set(D.duration);
      }, setPeaks: (D) => {
        C.set(D);
      }, setUrl: (D) => {
        x.set(D);
      }, setZoom: (D) => {
        w.set(Math.max(0, D));
      }, setScrollPosition: (D) => {
        O.set(Math.max(0, D));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new dd();
    const o = t ? void 0 : this.getMediaElement();
    this.renderer = new cd(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
  loadAudio(e, t, i, s) {
    return le(this, void 0, void 0, (function* () {
      var o;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (o = this.abortController) === null || o === void 0 || o.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield od.fetchBlob(e, l, a);
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
        a instanceof hn && (a.duration = r);
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
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, i);
      } catch (s) {
        throw this.emit("error", s), s;
      }
    }));
  }
  loadBlob(e, t, i) {
    return le(this, void 0, void 0, (function* () {
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
        let v = 0;
        for (let f = 0; f < d.length; f++) {
          const h = d[f];
          Math.abs(h) > Math.abs(v) && (v = h);
        }
        l.push(Math.round(v * i) / i);
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
      const s = yield i.play.call(this);
      return t != null && (this.media instanceof hn ? this.media.stopAt(t) : this.stopAtPosition = t), s;
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
Ct.BasePlugin = class extends Tt {
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
}, Ct.dom = sd;
class qs {
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
class pd extends qs {
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
function Fs(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [o, r] of Object.entries(s)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Fs(o, r));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function ht(n, e, t) {
  const i = Fs(n, e || {});
  return t?.appendChild(i), i;
}
function zs(n) {
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
function st(n, e) {
  const t = zs(null), i = (s) => {
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
function $t(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: s = 100 } = e, o = zs(null), r = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (r.set(c.pointerId, c), r.size > 1)) return;
    let d = c.clientX, v = c.clientY, f = !1;
    const h = Date.now(), b = n.getBoundingClientRect(), { left: m, top: _ } = b, S = (w) => {
      if (w.defaultPrevented || r.size > 1 || a && Date.now() - h < s) return;
      const O = w.clientX, P = w.clientY, k = O - d, L = P - v;
      (f || Math.abs(k) > t || Math.abs(L) > t) && (w.preventDefault(), w.stopPropagation(), f || (o.set({ type: "start", x: d - m, y: v - _ }), f = !0), o.set({ type: "move", x: O - m, y: P - _, deltaX: k, deltaY: L }), d = O, v = P);
    }, y = (w) => {
      if (r.delete(w.pointerId), f) {
        const O = w.clientX, P = w.clientY;
        o.set({ type: "end", x: O - m, y: P - _ });
      }
      l();
    }, g = (w) => {
      r.delete(w.pointerId), w.relatedTarget && w.relatedTarget !== document.documentElement || y(w);
    }, C = (w) => {
      f && (w.stopPropagation(), w.preventDefault());
    }, x = (w) => {
      w.defaultPrevented || r.size > 1 || f && w.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", y), document.addEventListener("pointerout", g), document.addEventListener("pointercancel", g), document.addEventListener("touchmove", x, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", y), document.removeEventListener("pointerout", g), document.removeEventListener("pointercancel", g), document.removeEventListener("touchmove", x), setTimeout((() => {
        document.removeEventListener("click", C, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: o, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), r.clear(), Ue(o);
  } };
}
class Li extends qs {
  constructor(e, t, i = 0) {
    var s, o, r, a, l, u, c, d, v, f;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (r = e.resize) === null || r === void 0 || r, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (v = e.channelIdx) !== null && v !== void 0 ? v : -1, this.contentEditable = (f = e.contentEditable) !== null && f !== void 0 ? f : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ht("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = ht("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = $t(i, { threshold: 1 }), r = $t(s, { threshold: 1 }), a = Rt((() => {
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
    const t = st(e, "click"), i = st(e, "mouseenter"), s = st(e, "mouseleave"), o = st(e, "dblclick"), r = st(e, "pointerdown"), a = st(e, "pointerup"), l = t.subscribe(((m) => m && this.emit("click", m))), u = i.subscribe(((m) => m && this.emit("over", m))), c = s.subscribe(((m) => m && this.emit("leave", m))), d = o.subscribe(((m) => m && this.emit("dblclick", m))), v = r.subscribe(((m) => m && this.toggleCursor(!0))), f = a.subscribe(((m) => m && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), v(), f(), Ue(t), Ue(i), Ue(s), Ue(o), Ue(r), Ue(a);
    }));
    const h = $t(e), b = Rt((() => {
      const m = h.signal.value;
      m && (m.type === "start" ? this.toggleCursor(!0) : m.type === "move" && m.deltaX !== void 0 ? this.onMove(m.deltaX) : m.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [h.signal]);
    this.subscriptions.push((() => {
      b(), h.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (m) => this.onContentClick(m), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
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
class Yn extends pd {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Yn(e);
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
    const s = this.wavesurfer.getDuration(), o = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, r = new Li(e, s, o);
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
    const l = $t(s, { threshold: t }), u = Rt((() => {
      var c, d;
      const v = l.signal.value;
      if (v) if (v.type === "start") {
        if (r = v.x, !this.wavesurfer) return;
        const f = this.wavesurfer.getDuration(), h = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: b } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = r / b * f;
        const m = v.x / b * f, _ = (v.x + 5) / b * f;
        o = new Li(Object.assign(Object.assign({}, e), { start: m, end: _ }), f, h), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
      } else v.type === "move" && v.deltaX !== void 0 ? o && o._onUpdate(v.deltaX, v.x > r ? "end" : "start", a) : v.type === "end" && o && (this.saveRegion(o), o.updatingSide = void 0, o = null);
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
function hd(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: s } = n, o = Xe(null), r = Xe(null), a = A(0), l = A(0), u = A(!1), c = A(!1), d = A(!1), v = A(1), f = A(1), h = A(!1), b = T(() => yt(a.value)), m = T(() => yt(l.value));
  function _(D, B) {
    R(), d.value = !0, c.value = !1;
    const Y = Yn.create();
    r.value = Y;
    const j = Ct.create({
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
      renderFunction: Co,
      url: B,
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
    }), o.value = j;
  }
  function S() {
    const D = r.value;
    if (D) {
      D.clearRegions();
      for (const B of i.value) {
        const Y = B.speakerId ? s.value.get(B.speakerId) : void 0;
        if (!Y || B.startTime == null || B.endTime == null) continue;
        const j = Y.color;
        D.addRegion({
          start: B.startTime,
          end: B.endTime,
          color: bo(j, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", j);
      }
    }
  }
  function y() {
    o.value?.play();
  }
  function g() {
    o.value?.pause();
  }
  function C() {
    o.value?.playPause();
  }
  function x(D) {
    const B = o.value;
    !B || l.value === 0 || B.setTime(D);
  }
  function w(D) {
    x(Math.max(0, Math.min(a.value + D, l.value)));
  }
  function O(D) {
    const B = o.value;
    B && (v.value = D, B.setVolume(D), D > 0 && h.value && (h.value = !1, B.setMuted(!1)));
  }
  function P() {
    const D = o.value;
    D && (h.value = !h.value, D.setMuted(h.value));
  }
  function k(D) {
    const B = o.value;
    B && (f.value = D, B.setPlaybackRate(D));
  }
  function L() {
    const B = (vn.indexOf(
      f.value
    ) + 1) % vn.length;
    k(vn[B] ?? 1);
  }
  function R() {
    z !== null && (clearTimeout(z), z = null), o.value && (o.value.destroy(), o.value = null, r.value = null);
  }
  Z(
    [e, t],
    ([D, B]) => {
      D && B && _(D, B);
    },
    { immediate: !0 }
  );
  let z = null;
  return Z([i, s], () => {
    c.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, S();
    }, 150));
  }), lt(() => {
    R();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: v,
    playbackRate: f,
    isMuted: h,
    formattedCurrentTime: b,
    formattedDuration: m,
    play: y,
    pause: g,
    togglePlay: C,
    seekTo: x,
    skip: w,
    setVolume: O,
    setPlaybackRate: k,
    cyclePlaybackRate: L,
    toggleMute: P
  };
}
const vd = { class: "audio-player" }, md = /* @__PURE__ */ F({
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
      currentTime: v,
      formattedCurrentTime: f,
      formattedDuration: h,
      togglePlay: b,
      seekTo: m,
      pause: _,
      skip: S,
      setVolume: y,
      cyclePlaybackRate: g,
      toggleMute: C
    } = hd({
      containerRef: o,
      audioSrc: Lt(() => i.audioSrc),
      turns: Lt(() => i.turns),
      speakers: Lt(() => i.speakers)
    });
    return Z(v, (x) => s("timeupdate", x)), Z(r, (x) => s("playStateChange", x)), e({ seekTo: m, pause: _ }), (x, w) => (E(), W("footer", vd, [
      N("div", {
        ref_key: "waveformRef",
        ref: o,
        class: mt(["waveform-container", { "waveform-container--loading": p(l) }])
      }, null, 2),
      M(id, {
        "is-playing": p(r),
        "current-time": p(f),
        duration: p(h),
        volume: p(u),
        "playback-rate": p(c),
        "is-muted": p(d),
        "is-ready": p(a),
        onTogglePlay: p(b),
        onSkipBack: w[0] || (w[0] = (O) => p(S)(-10)),
        onSkipForward: w[1] || (w[1] = (O) => p(S)(10)),
        "onUpdate:volume": p(y),
        onToggleMute: p(C),
        onCyclePlaybackRate: p(g)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), gd = /* @__PURE__ */ re(md, [["__scopeId", "data-v-9248e45e"]]);
class yd {
  diff(e, t, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const o = this.castInput(e, i), r = this.castInput(t, i), a = this.removeEmpty(this.tokenize(o, i)), l = this.removeEmpty(this.tokenize(r, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, t, i, s) {
    var o;
    const r = (S) => {
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
    const d = (o = i.timeout) !== null && o !== void 0 ? o : 1 / 0, v = Date.now() + d, f = [{ oldPos: -1, lastComponent: void 0 }];
    let h = this.extractCommon(f[0], t, e, 0, i);
    if (f[0].oldPos + 1 >= l && h + 1 >= a)
      return r(this.buildValues(f[0].lastComponent, t, e));
    let b = -1 / 0, m = 1 / 0;
    const _ = () => {
      for (let S = Math.max(b, -u); S <= Math.min(m, u); S += 2) {
        let y;
        const g = f[S - 1], C = f[S + 1];
        g && (f[S - 1] = void 0);
        let x = !1;
        if (C) {
          const O = C.oldPos - S;
          x = C && 0 <= O && O < a;
        }
        const w = g && g.oldPos + 1 < l;
        if (!x && !w) {
          f[S] = void 0;
          continue;
        }
        if (!w || x && g.oldPos < C.oldPos ? y = this.addToPath(C, !0, !1, 0, i) : y = this.addToPath(g, !1, !0, 1, i), h = this.extractCommon(y, t, e, S, i), y.oldPos + 1 >= l && h + 1 >= a)
          return r(this.buildValues(y.lastComponent, t, e)) || !0;
        f[S] = y, y.oldPos + 1 >= l && (m = Math.min(m, S - 1)), h + 1 >= a && (b = Math.max(b, S + 1));
      }
      u++;
    };
    if (s)
      (function S() {
        setTimeout(function() {
          if (u > c || Date.now() > v)
            return s(void 0);
          _() || S();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= v; ) {
        const S = _();
        if (S)
          return S;
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
          d = d.map(function(v, f) {
            const h = i[u + f];
            return h.length > v.length ? h : v;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return s;
  }
}
class bd extends yd {
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
const wd = new bd();
function Sd(n, e, t) {
  return wd.diff(n, e, t);
}
function mn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), o = t.split(" "), r = Sd(s, o, {
    comparator: xd
  }), a = Cd(r), l = [...e];
  let u = [...e], c = 0;
  for (const f of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in f && f.replaced)
      u = Bt(
        u,
        l[0],
        f.countAdded - f.countRemoved
      ), c += f.countRemoved;
    else if ("removed" in f && f.removed) {
      const h = f;
      c += h.count, u = Bt(
        u,
        l[0],
        -h.count
      );
    } else if ("added" in f && f.added) {
      const h = f;
      u = Bt(
        u,
        l[0],
        h.count
      );
    } else
      c += f.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, v = o.slice(d).join(" ");
  if (i(v)) {
    const h = Ns(
      v,
      i
    ).map(
      (b) => b + d
    );
    u = u.concat(h);
  }
  return {
    previousIndexes: u,
    previousText: t
  };
}
function Cd(n) {
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
function Bt(n, e, t) {
  return n.map((i) => i >= e ? i + t : i);
}
function Ns(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let i;
  for (i = 0; i < t.length; i++) {
    const s = t.slice(0, i).join(" ");
    if (e(s)) break;
  }
  return [i - 1].concat(
    Bt(
      Ns(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function xd(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(t.length, i.length);
  let o = 0;
  for (let a = 0; a < s; a++)
    t[a] === i[a] && o++;
  return o / t.length > 0.8;
}
class _d {
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
  setFontSize(e, t) {
    this.fontSize = e, this.lineHeight = t, this.resetDrawing(), this.onResize();
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
class Ed extends _d {
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
    this.resetAll(), this.currentState = mn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = mn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = mn(
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
function Ws(n) {
  const e = Ze();
  let t = null;
  se(() => {
    n.canvasRef.value && (t = new Ed(n.canvasRef.value, {
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
  function s() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const o = e.on("translation:change", s), r = e.on("translation:sync", s), a = e.on("channel:sync", s);
  Et(() => {
    i(), o(), r(), a(), t?.dispose(), t = null;
  });
}
const kd = ["height"], Td = /* @__PURE__ */ F({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Ze(), t = gt("canvas"), i = T(() => e.subtitle?.fontSize.value ?? 40), s = T(() => 1.2 * i.value), o = T(() => 2.4 * i.value);
    return Ws({
      canvasRef: t,
      fontSize: i,
      lineHeight: s
    }), (r, a) => (E(), W("div", {
      class: "subtitle-banner",
      style: ut({ height: o.value + "px" })
    }, [
      N("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: o.value
      }, null, 8, kd)
    ], 4));
  }
}), Pd = /* @__PURE__ */ re(Td, [["__scopeId", "data-v-30da75ad"]]), Ad = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Od = ["aria-label"], Id = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Dd = /* @__PURE__ */ F({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Ze(), { t } = we(), i = gt("container"), s = gt("canvas"), o = T(() => e.subtitle?.fontSize.value ?? 48), r = T(() => 1.2 * o.value);
    Ws({
      canvasRef: s,
      fontSize: o,
      lineHeight: r
    }), se(async () => {
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
    se(() => {
      document.addEventListener("fullscreenchange", a);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Et(() => {
      document.removeEventListener("fullscreenchange", a);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (u, c) => (E(), W("div", Ad, [
      N("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": p(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        M(p($n), { size: 24 })
      ], 8, Od),
      N("canvas", Id, null, 512)
    ], 512));
  }
}), Ld = /* @__PURE__ */ re(Dd, [["__scopeId", "data-v-442e31fd"]]), Md = { class: "editor-layout" }, Rd = { class: "editor-body" }, $d = {
  key: 4,
  class: "mobile-selectors"
}, Bd = /* @__PURE__ */ F({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Ze(), { t: i, locale: s } = we(), { isMobile: o } = Ji(), r = A(!1), a = T(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), l = t.speakers.all;
    pr(a, l, t);
    const u = T(() => [...t.channels.values()]), c = T(() => [
      ...t.activeChannel.value.translations.values()
    ]), d = T(
      () => t.activeChannel.value.activeTranslation.value.id
    ), v = T(() => Array.from(l.values())), f = gt("audioPlayer");
    function h(S) {
      t.audio && (t.audio.currentTime.value = S);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        f.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), r.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((S) => f.value?.seekTo(S));
    const b = T(
      () => Hi(
        c.value,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function m(S) {
      t.setActiveChannel(S);
    }
    function _(S) {
      t.activeChannel.value.setActiveTranslation(S);
    }
    return (S, y) => (E(), W("div", Md, [
      e.showHeader ? (E(), $(er, {
        key: 0,
        title: p(t).title.value,
        duration: p(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": p(o),
        onToggleSidebar: y[0] || (y[0] = (g) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      N("main", Rd, [
        M(Fr, {
          turns: a.value,
          speakers: p(l)
        }, null, 8, ["turns", "speakers"]),
        p(o) ? K("", !0) : (E(), $(Pi, {
          key: 0,
          speakers: v.value,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": m,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        p(o) ? (E(), $(Xc, {
          key: 1,
          open: r.value,
          "onUpdate:open": y[1] || (y[1] = (g) => r.value = g)
        }, {
          default: I(() => [
            M(Pi, {
              speakers: v.value,
              channels: u.value,
              "selected-channel-id": p(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": m,
              "onUpdate:selectedTranslationId": _
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : K("", !0)
      ]),
      p(t).audio?.src.value ? (E(), $(gd, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": p(t).audio.src.value,
        turns: a.value,
        speakers: p(l),
        onTimeupdate: h,
        onPlayStateChange: y[2] || (y[2] = (g) => {
          p(t).audio && (p(t).audio.isPlaying.value = g);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      p(t).subtitle?.isVisible.value && !p(o) && !p(t).subtitle.isFullscreen.value ? (E(), $(Pd, { key: 2 })) : K("", !0),
      p(t).subtitle?.isFullscreen.value ? (E(), $(Ld, { key: 3 })) : K("", !0),
      p(o) && (u.value.length > 1 || c.value.length > 1) ? (E(), W("div", $d, [
        u.value.length > 1 ? (E(), $(Ms, {
          key: 0,
          channels: u.value,
          "selected-channel-id": p(t).activeChannelId.value,
          "onUpdate:selectedChannelId": m
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (E(), $(Xn, {
          key: 1,
          items: b.value,
          "selected-value": d.value,
          ariaLabel: p(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": _
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), Ud = /* @__PURE__ */ re(Bd, [["__scopeId", "data-v-52972a0f"]]);
function Kd() {
  return {
    name: "audio",
    install(n) {
      const e = A(0), t = A(!1);
      let i = null;
      const s = T(
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
function Mi(n) {
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
function Xd() {
  return {
    name: "live",
    install(n) {
      const e = Xe(null), t = A(!1);
      t.value = !0;
      function i() {
        e.value = null;
      }
      function s(y, g) {
        if (n.activeChannelId.value !== g) return;
        const C = n.activeChannel.value.activeTranslation.value;
        if (C.isSource) {
          if (y.text == null) return;
          e.value = y.text;
        } else if (y.translations) {
          const x = y.translations.find(
            (w) => w.translationId === C.id
          );
          e.value = x?.text ?? null;
        } else
          return;
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
      function l(y, g) {
        y.hasTurn(g.id) ? y.updateTurn(g.id, g) : y.addTurn(g);
      }
      function u(y, g) {
        y.speakerId && n.speakers.ensure(y.speakerId);
        const C = n.channels.get(g);
        if (!C) {
          v();
          return;
        }
        if (y.text != null && l(
          C.sourceTranslation,
          Mi(y)
        ), y.translations)
          for (const w of y.translations) {
            const O = C.translations.get(w.translationId);
            O && l(
              O,
              gn(y, w)
            );
          }
        n.activeChannel.value.activeTranslation.value.isSource && v();
      }
      function c(y, g) {
        d([y], g);
      }
      function d(y, g) {
        const C = n.channels.get(g);
        if (!C) return;
        const x = /* @__PURE__ */ new Set();
        for (const P of y)
          P.speakerId && !x.has(P.speakerId) && (x.add(P.speakerId), n.speakers.ensure(P.speakerId));
        const w = [];
        for (const P of y)
          P.text != null && w.push(Mi(P));
        w.length > 0 && C.sourceTranslation.prependTurns(w);
        const O = /* @__PURE__ */ new Map();
        for (const P of y)
          if (P.translations)
            for (const k of P.translations) {
              let L = O.get(k.translationId);
              L || (L = [], O.set(k.translationId, L)), L.push(gn(P, k));
            }
        for (const [P, k] of O) {
          const L = C.translations.get(P);
          L && L.prependTurns(k);
        }
      }
      function v() {
        a(), i();
      }
      function f(y) {
        const g = n.activeChannel.value.activeTranslation.value, C = n.activeChannel.value;
        if (!y.final && g.languages.includes(y.language))
          e.value = y.text;
        else if (y.final) {
          const x = C.translations.get(y.language);
          if (x) {
            const w = gn(
              { ...y },
              y
            );
            x === g ? l(x, w) : x.updateOrCreateTurnSilent(w);
          }
          g.languages.includes(y.language) && v();
        }
      }
      const h = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: s,
        onFinal: u,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: f
      }, b = n.on(
        "channel:change",
        v
      ), m = n.on(
        "translation:change",
        v
      ), _ = n.on(
        "translation:sync",
        r
      ), S = n.on("channel:sync", r);
      return n.live = h, () => {
        v(), b(), m(), _(), S(), n.live = void 0;
      };
    }
  };
}
function Yd(n = {}) {
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
function qd(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function Gd(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.speakers)
    e.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: ""
    });
  const t = n.text.map((s) => {
    const o = s.words.map(qd), r = o[0]?.startTime ?? s.stime, a = o.length > 0 ? o[o.length - 1].endTime ?? s.etime : s.etime;
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
let Hs = 0;
function Fd(n) {
  return {
    id: `w_${Hs++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function Jd(n) {
  Hs = 0;
  const e = /* @__PURE__ */ new Map();
  for (const o of n.segments)
    o.speaker && !e.has(o.speaker) && e.set(o.speaker, {
      id: o.speaker,
      name: o.speaker,
      color: ""
    });
  const t = n.language ?? "fr", i = n.segments.map((o, r) => {
    const a = o.words.map(Fd);
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
  fe as DocumentValidationError,
  Ud as EditorLayout,
  Kd as createAudioPlugin,
  Nd as createEditorStore,
  Xd as createLivePlugin,
  Yd as createSubtitlePlugin,
  Gd as mapApiDocument,
  Jd as mapWhisperXDocument,
  Wd as provideEditorStore,
  Hd as provideI18n,
  Ze as useEditorStore,
  So as validateEditorDocument
};
