import * as Yn from "vue";
import { shallowReactive as On, ref as P, computed as T, inject as xt, provide as _t, h as Le, defineComponent as F, openBlock as E, createElementBlock as W, renderSlot as V, useSlots as Vs, normalizeClass as mt, createCommentVNode as K, createElementVNode as N, toDisplayString as X, createVNode as R, withCtx as O, createTextVNode as ae, createBlock as $, unref as h, watchEffect as be, onBeforeUnmount as lt, normalizeStyle as ut, watch as Z, onMounted as se, withModifiers as Fe, Fragment as ge, renderList as Ye, createStaticVNode as js, Transition as Mi, useTemplateRef as gt, nextTick as oe, useId as Us, customRef as Ks, toValue as ue, getCurrentScope as $i, onScopeDispose as Bi, effectScope as qi, getCurrentInstance as Ge, shallowRef as rt, readonly as Xs, toHandlerKey as Ys, camelize as Fi, toRef as Lt, onUnmounted as Et, toRefs as ct, Comment as Gs, mergeProps as Q, cloneVNode as Js, reactive as zi, Teleport as Ni, normalizeProps as In, guardReactiveProps as Dn, markRaw as Zs, watchPostEffect as Wi, shallowReadonly as tt, mergeDefaults as Qs, withKeys as yn, withMemo as eo, resolveDynamicComponent as to, useModel as no, withDirectives as io, vShow as so, triggerRef as Gn } from "vue";
function oo() {
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
function ro(n, e, t) {
  const i = Jn[n.size % Jn.length];
  return { id: e, name: t, color: i };
}
function ao(n, e, t) {
  return !e || n.has(e) ? null : ro(n, e, t ?? e);
}
function lo(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function uo(n) {
  const e = On(/* @__PURE__ */ new Map());
  function t(o, r) {
    const a = ao(e, o, r);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(o, r) {
    const a = lo(e, o, r);
    a && (e.set(o, a), n("speaker:update", { speaker: a }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: s };
}
function co(n, e) {
  return [...n, e];
}
function fo(n, e) {
  return [...e, ...n];
}
function po(n, e, t) {
  const i = n.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const s = { ...n[i], ...t, id: e };
  return {
    turns: n.map((o, r) => r === i ? s : o),
    updated: s
  };
}
function ho(n, e) {
  const t = n.findIndex((i) => i.id === e);
  return t === -1 ? null : n.filter((i, s) => s !== t);
}
function vo(n, e, t) {
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
function bn(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const i of n)
    i.speakerId && !t.has(i.speakerId) && (t.add(i.speakerId), e(i.speakerId));
}
function mo(n, e, t) {
  const { id: i, languages: s, isSource: o, audio: r } = n, a = P(n.turns);
  function l(f) {
    t(f.speakerId), a.value = co(a.value, f), e("turn:add", { turn: f, translationId: i });
  }
  function u(f, g) {
    const m = po(a.value, f, g);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function c(f) {
    const g = ho(a.value, f);
    g && (a.value = g, e("turn:remove", { turnId: f, translationId: i }));
  }
  function d(f, g) {
    const m = vo(a.value, f, g);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function v(f) {
    bn(f, t), a.value = fo(a.value, f);
  }
  function p(f) {
    bn(f, t), a.value = f, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: s, isSource: o, audio: r, turns: a, addTurn: l, prependTurns: v, updateTurn: u, removeTurn: c, updateWords: d, setTurns: p };
}
function Zn(n, e, t) {
  const { id: i, name: s, description: o, duration: r } = n, a = On(/* @__PURE__ */ new Map());
  let l;
  for (const g of n.translations) {
    const m = mo(g, e, t);
    a.set(g.id, m), g.isSource && !l && (l = m);
  }
  l || (l = a.values().next().value);
  const u = P(null), c = P(!1), d = P(!0), v = T(() => u.value ? a.get(u.value) ?? l : l);
  function p(g) {
    const m = g === l.id ? null : g;
    m !== u.value && (u.value = m, e("translation:change", { translationId: v.value.id }));
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
    activeTranslation: v,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: p,
    reset: f
  };
}
function go(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [i, s] of n.speakers)
    e.add(i), t.push({ id: i, name: s.name });
  for (const i of n.channels)
    for (const s of i.translations)
      for (const o of s.turns)
        o.speakerId && !e.has(o.speakerId) && (e.add(o.speakerId), t.push({ id: o.speakerId, name: o.speakerId }));
  return t;
}
function yo(n, e) {
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
function Hi(n, e, t, i = "*") {
  return n.map((s) => ({
    value: s.id,
    label: s.languages.map((o) => Ln(o, e, i)).join(", ") + (s.isSource ? ` (${t})` : "")
  }));
}
function bo(n, e = 250) {
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
function wo(n) {
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
function So(n, e) {
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
function Co(n, e) {
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
function zd(n = {}) {
  const e = P(""), t = P(n.activeChannelId ?? ""), i = P(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: r, clear: a } = oo(), l = uo(r), u = l, c = On(/* @__PURE__ */ new Map()), d = T(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function v(C, S) {
    return s(C, (I) => {
      I.translationId === d.value.activeTranslation.value.id && S(I);
    });
  }
  function p(C) {
    e.value = C.title, l.clear(), c.clear();
    for (const S of go(C))
      u.ensure(S.id, S.name);
    for (const S of C.channels)
      c.set(S.id, Zn(S, r, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function f(C) {
    wo(C), p(C);
  }
  function g(C) {
    C !== t.value && (t.value = C, r("channel:change", { channelId: C }));
  }
  function m(C, S) {
    if (c.has(C)) {
      for (const I of S.translations)
        bn(I.turns, u.ensure);
      c.set(C, Zn(S, r, u.ensure)), r("channel:sync", { channelId: C });
    }
  }
  const x = [], b = [];
  function w(C) {
    C.tiptapExtensions && b.push(...C.tiptapExtensions);
    const S = C.install(_);
    S && x.push(S);
  }
  function y() {
    r("destroy", void 0), x.forEach((C) => C()), x.length = 0, a();
  }
  n.document && p(n.document);
  const _ = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    pluginExtensions: b,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: v,
    setDocument: f,
    setActiveChannel: g,
    setChannel: m,
    on: s,
    off: o,
    emit: r,
    use: w,
    destroy: y
  };
  return _;
}
const ji = /* @__PURE__ */ Symbol("editorStore");
function Nd(n) {
  _t(ji, n);
}
function Je() {
  const n = xt(ji);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const xo = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Qn = (n) => n === "";
const _o = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const ei = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Eo = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const ko = (n) => {
  const e = Eo(n);
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
const To = ({
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
    class: _o(
      "lucide",
      l.class,
      ...n ? [`lucide-${ei(ko(n))}-icon`, `lucide-${ei(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !xo(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Le(...c)), ...u.default ? [u.default()] : []]
);
const ce = (n, e) => (t, { slots: i, attrs: s }) => Le(
  To,
  {
    ...s,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const Po = ce("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Rn = ce("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Ao = ce("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Oo = ce("clipboard-list", [
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
const Io = ce("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const ti = ce("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Do = ce("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Lo = ce("play", [
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
const Mo = ce("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const $o = ce("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Bo = ce("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const qo = ce("volume-2", [
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
const Fo = ce("volume-x", [
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
const Mn = ce("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), zo = ["aria-label"], No = /* @__PURE__ */ F({
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
    ], 8, zo));
  }
}), re = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, s] of e)
    t[i] = s;
  return t;
}, wn = /* @__PURE__ */ re(No, [["__scopeId", "data-v-3d3f8eba"]]), Wo = ["disabled", "aria-label"], Ho = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, Vo = /* @__PURE__ */ F({
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
      o.$slots.icon ? (E(), W("span", Ho, [
        V(o.$slots, "icon", {}, void 0, !0)
      ])) : K("", !0),
      V(o.$slots, "default", {}, void 0, !0)
    ], 10, Wo));
  }
}), me = /* @__PURE__ */ re(Vo, [["__scopeId", "data-v-9ebbb489"]]), Ui = {
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
}, jo = {
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
}, ni = { fr: Ui, en: jo }, Ki = /* @__PURE__ */ Symbol("i18n");
function Wd(n) {
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
const Uo = { class: "editor-header" }, Ko = { class: "header-left" }, Xo = { class: "document-title" }, Yo = { class: "badges" }, Go = ["datetime"], Jo = { class: "header-right" }, Zo = /* @__PURE__ */ F({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = we(), s = T(() => Ln(e.language, i.value, t("language.wildcard"))), o = T(() => yt(e.duration)), r = T(() => e.title.replace(/-/g, " "));
    return (a, l) => (E(), W("header", Uo, [
      N("div", Ko, [
        N("h1", Xo, X(r.value), 1),
        N("div", Yo, [
          R(wn, null, {
            default: O(() => [
              ae(X(s.value), 1)
            ]),
            _: 1
          }),
          R(wn, null, {
            default: O(() => [
              N("time", {
                datetime: `PT${n.duration}S`
              }, X(o.value), 9, Go)
            ]),
            _: 1
          })
        ])
      ]),
      N("div", Jo, [
        n.isMobile ? (E(), $(me, {
          key: 0,
          variant: "ghost",
          "aria-label": h(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: O(() => [
            R(h(Bo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (E(), $(me, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": h(t)("header.export")
        }, {
          icon: O(() => [
            R(h(ti), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (E(), $(me, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: O(() => [
            R(h(ti), { size: 16 })
          ]),
          default: O(() => [
            ae(" " + X(h(t)("header.export")), 1)
          ]),
          _: 1
        })),
        R(me, {
          variant: "ghost",
          disabled: "",
          "aria-label": h(t)("header.settings")
        }, {
          icon: O(() => [
            R(h(Ro), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), Qo = /* @__PURE__ */ re(Zo, [["__scopeId", "data-v-f16781f3"]]), nn = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, er = 70, tr = 1e3 / 60, nr = 350;
let Rt = !1, ii = !1;
function ir() {
  ii || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Rt = !0;
  }), document.addEventListener("mouseup", () => {
    Rt = !1;
  }), document.addEventListener("click", () => {
    Rt = !1;
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
function sr(n = {}) {
  ir();
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
    const M = l();
    if (!e.targetScrollTop)
      return M;
    if (u?.targetScrollTop === M)
      return u.calculatedScrollTop;
    const z = Math.max(
      Math.min(
        e.targetScrollTop(M, {
          scrollElement: k,
          contentElement: L
        }),
        M
      ),
      0
    );
    return u = { targetScrollTop: M, calculatedScrollTop: z }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      u = void 0;
    }), z;
  }
  function d() {
    return c() - r();
  }
  function v() {
    return d() <= er;
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
  function m() {
    if (!Rt || typeof window > "u")
      return !1;
    const k = window.getSelection?.();
    if (!k || !k.rangeCount)
      return !1;
    const L = k.getRangeAt(0), M = i.scrollElement;
    if (!M)
      return !1;
    const z = L.commonAncestorContainer;
    return !!(z && (M.contains(z) || z.contains(M)));
  }
  const x = (k) => {
    if (k.target !== i.scrollElement)
      return;
    const L = r(), M = i.ignoreScrollToTop;
    let z = i.lastScrollTop ?? L;
    i.lastScrollTop = L, i.ignoreScrollToTop = void 0, M && M > L && (z = M), g(v()), setTimeout(() => {
      if (i.resizeDifference || L === M)
        return;
      if (m()) {
        f(!0), p(!1);
        return;
      }
      const D = L > z, B = L < z;
      if (i.animation?.ignoreEscapes) {
        a(z);
        return;
      }
      B && (f(!0), p(!1)), D && f(!1), !i.escapedFromLock && v() && p(!0);
    }, 1);
  }, b = (k) => {
    const L = i.scrollElement;
    if (!L)
      return;
    let M = k.target;
    for (; M && !["scroll", "auto"].includes(getComputedStyle(M).overflow); ) {
      if (!M.parentElement)
        return;
      M = M.parentElement;
    }
    M === L && k.deltaY < 0 && L.scrollHeight > L.clientHeight && !i.animation?.ignoreEscapes && (f(!0), p(!1));
  };
  function w(k, L) {
    y(), i.scrollElement = k, i.contentElement = L, getComputedStyle(k).overflow === "visible" && (k.style.overflow = "auto"), k.addEventListener("scroll", x, { passive: !0 }), k.addEventListener("wheel", b, { passive: !0 });
    let M;
    i.resizeObserver = new ResizeObserver((z) => {
      const D = z[0];
      if (!D)
        return;
      const { height: B } = D.contentRect, Y = B - (M ?? B);
      if (i.resizeDifference = Y, r() > l() && a(l()), g(v()), Y >= 0) {
        const j = on(
          e,
          M ? e.resize : e.initial
        );
        S({
          animation: j,
          wait: !0,
          preserveScrollPosition: !0,
          duration: j === "instant" ? void 0 : nr
        });
      } else
        v() && (f(!1), p(!0));
      M = B, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          i.resizeDifference === Y && (i.resizeDifference = 0);
        }, 1);
      });
    }), i.resizeObserver.observe(L);
  }
  function y() {
    i.scrollElement && (i.scrollElement.removeEventListener("scroll", x), i.scrollElement.removeEventListener("wheel", b)), i.resizeObserver?.disconnect(), i.resizeObserver = void 0, i.scrollElement = void 0, i.contentElement = void 0;
  }
  function _() {
    y(), t.clear();
  }
  function C(k) {
    e = { ...e, ...k };
  }
  function S(k = {}) {
    const L = typeof k == "string" ? { animation: k } : k;
    L.preserveScrollPosition || p(!0);
    const M = Date.now() + (Number(L.wait) || 0), z = on(e, L.animation), { ignoreEscapes: D = !1 } = L;
    let B, Y = c();
    L.duration instanceof Promise ? L.duration.finally(() => {
      B = Date.now();
    }) : B = M + (L.duration ?? 0);
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
        const ee = r(), de = typeof performance < "u" ? performance.now() : Date.now(), Qe = (de - (i.lastTick ?? de)) / tr;
        if (i.animation ||= { behavior: z, promise: G, ignoreEscapes: D }, i.animation.behavior === z && (i.lastTick = de), m() || M > Date.now())
          return j();
        if (ee < Math.min(Y, c())) {
          if (i.animation?.behavior === z) {
            if (z === "instant")
              return a(c()), j();
            const Se = z;
            i.velocity = (Se.damping * i.velocity + Se.stiffness * d()) / Se.mass, i.accumulated += i.velocity * Qe;
            const et = r();
            a(et + i.accumulated), r() !== et && (i.accumulated = 0);
          }
          return j();
        }
        return B > Date.now() ? (Y = c(), j()) : (i.animation = void 0, r() < c() ? S({
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
  const I = () => {
    f(!0), p(!1);
  };
  function A(k) {
    return t.add(k), () => t.delete(k);
  }
  return {
    attach: w,
    detach: y,
    destroy: _,
    setOptions: C,
    getState: o,
    onChange: A,
    scrollToBottom: S,
    stopScroll: I
  };
}
function or(n = {}) {
  const e = P(null), t = P(null), i = P(n.initial !== !1), s = P(!1), o = P(!1), r = sr(n);
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
const rr = /* @__PURE__ */ F({
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
}), Xi = /* @__PURE__ */ re(rr, [["__scopeId", "data-v-9bffeda8"]]), ar = { class: "speaker-label" }, lr = {
  key: 1,
  class: "speaker-name"
}, ur = ["datetime"], cr = /* @__PURE__ */ F({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = we(), s = T(
      () => Ln(
        e.language,
        i.value,
        t("language.wildcard")
      )
    ), o = T(
      () => e.startTime != null ? yt(e.startTime) : null
    ), r = T(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = T(() => e.speaker?.color ?? "transparent");
    return (l, u) => (E(), W("div", ar, [
      n.speaker ? (E(), $(Xi, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (E(), W("span", lr, X(n.speaker.name), 1)) : K("", !0),
      o.value ? (E(), W("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value
      }, X(o.value), 9, ur)) : K("", !0),
      R(wn, null, {
        default: O(() => [
          ae(X(s.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), dr = /* @__PURE__ */ re(cr, [["__scopeId", "data-v-c5cddbd4"]]), Yi = /* @__PURE__ */ Symbol("turnSelection");
function si(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function fr(n, e, t) {
  const i = P(/* @__PURE__ */ new Set());
  let s = null;
  const o = T(() => i.value.size), r = T(() => i.value.size > 0);
  function a(m) {
    const x = new Set(i.value);
    x.has(m) ? x.delete(m) : x.add(m), i.value = x, s = m;
  }
  function l(m) {
    if (s === null) {
      a(m);
      return;
    }
    const x = n.value.map((S) => S.id), b = x.indexOf(s), w = x.indexOf(m);
    if (b === -1 || w === -1) {
      a(m);
      return;
    }
    const y = Math.min(b, w), _ = Math.max(b, w), C = new Set(i.value);
    for (let S = y; S <= _; S++) {
      const I = x[S];
      I != null && C.add(I);
    }
    i.value = C;
  }
  function u() {
    i.value = /* @__PURE__ */ new Set(), s = null;
  }
  async function c() {
    const x = n.value.filter((b) => i.value.has(b.id)).map(si).join(`

`);
    await navigator.clipboard.writeText(x);
  }
  async function d() {
    const x = n.value.filter((b) => i.value.has(b.id)).map((b) => {
      const y = (b.speakerId ? e.get(b.speakerId) : void 0)?.name ?? "", _ = b.startTime != null ? yt(b.startTime) : "", C = [y, _].filter(Boolean).join(" (") + (_ ? ")" : ""), S = si(b);
      return C ? `${C}
${S}` : S;
    });
    await navigator.clipboard.writeText(x.join(`

`));
  }
  Z(
    () => n.value,
    (m) => {
      if (i.value.size === 0) return;
      const x = new Set(m.map((w) => w.id)), b = new Set(
        [...i.value].filter((w) => x.has(w))
      );
      b.size !== i.value.size && (i.value = b);
    }
  );
  const v = t.on("channel:change", u), p = t.on("translation:change", u);
  function f(m) {
    m.key === "Escape" && i.value.size > 0 && u();
  }
  se(() => {
    document.addEventListener("keydown", f);
  }), lt(() => {
    document.removeEventListener("keydown", f), v(), p();
  });
  const g = {
    selectedIds: i,
    count: o,
    hasSelection: r,
    toggle: a,
    selectRange: l,
    clear: u,
    copyText: c,
    copyWithMetadata: d
  };
  return _t(Yi, g), g;
}
function Gi() {
  const n = xt(Yi);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
const pr = ["data-turn-active"], hr = ["checked", "aria-label"], vr = { class: "turn-text" }, mr = ["data-word-active"], gr = /* @__PURE__ */ F({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Je(), i = Gi(), { t: s } = we(), o = T(() => e.turn.words.length > 0), r = T(() => {
      if (!t.audio?.src.value || !o.value) return null;
      const p = t.audio.currentTime.value, { startTime: f, endTime: g, words: m } = e.turn;
      return f == null || g == null || p < f || p > g ? null : Co(m, p);
    }), a = T(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Vi(e.turn.words)) return !1;
      const p = t.audio.currentTime.value;
      return p >= e.turn.startTime && p <= e.turn.endTime;
    }), l = T(() => e.speaker?.color ?? "transparent"), u = T(() => i.selectedIds.value.has(e.turn.id)), c = T(() => {
      const p = e.speaker?.name ?? "", f = u.value ? "selection.deselect" : "selection.select";
      return s(f).replace("{name}", p);
    });
    function d(p) {
      p.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    function v(p) {
      p.shiftKey ? i.selectRange(e.turn.id) : i.toggle(e.turn.id);
    }
    return (p, f) => (E(), W("section", {
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
        }, null, 8, hr),
        R(dr, {
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "language"])
      ])),
      N("p", vr, [
        o.value ? (E(!0), W(ge, { key: 0 }, Ye(n.turn.words, (g, m) => (E(), W(ge, {
          key: g.id
        }, [
          N("span", {
            class: mt({ "word--active": g.id === r.value }),
            "data-word-active": g.id === r.value || void 0
          }, X(g.text), 11, mr),
          ae(X(m < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (E(), W(ge, { key: 1 }, [
          ae(X(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, pr));
  }
}), oi = /* @__PURE__ */ re(gr, [["__scopeId", "data-v-56ba1c7c"]]), yr = {}, br = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function wr(n, e) {
  return E(), W("svg", br, [...e[0] || (e[0] = [
    js('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Sr = /* @__PURE__ */ re(yr, [["render", wr]]), Cr = { class: "transcription-empty" }, xr = { class: "message" }, _r = /* @__PURE__ */ F({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = we();
    return (t, i) => (E(), W("div", Cr, [
      R(Sr, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      N("p", xr, X(h(e)("transcription.empty")), 1)
    ]));
  }
}), Er = /* @__PURE__ */ re(_r, [["__scopeId", "data-v-f82737e5"]]), kr = /* @__PURE__ */ F({
  __name: "CopyButton",
  props: {
    icon: { default: "copy" },
    copyFn: {}
  },
  setup(n, { expose: e }) {
    const t = n, i = P(!1);
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
      icon: O(() => [
        R(Mi, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: O(() => [
            i.value ? (E(), $(h(Rn), {
              key: 0,
              size: 14
            })) : n.icon === "copy" ? (E(), $(h(Io), {
              key: 1,
              size: 14
            })) : (E(), $(h(Oo), {
              key: 2,
              size: 14
            }))
          ]),
          _: 1
        })
      ]),
      default: O(() => [
        V(r.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["class"]));
  }
}), ri = /* @__PURE__ */ re(kr, [["__scopeId", "data-v-08fc451a"]]), Tr = ["aria-label"], Pr = { class: "selection-count" }, Ar = { class: "selection-actions" }, Or = /* @__PURE__ */ F({
  __name: "SelectionActionBar",
  setup(n) {
    const e = Gi(), { t } = we();
    return (i, s) => h(e).hasSelection.value ? (E(), W("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": h(t)("selection.count")
    }, [
      N("span", Pr, X(h(e).count.value) + " " + X(h(t)("selection.count")), 1),
      N("div", Ar, [
        R(ri, {
          icon: "copy",
          "copy-fn": h(e).copyText
        }, {
          default: O(() => [
            ae(X(h(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        R(ri, {
          icon: "clipboard-list",
          "copy-fn": h(e).copyWithMetadata
        }, {
          default: O(() => [
            ae(X(h(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        R(me, {
          size: "sm",
          variant: "ghost",
          onClick: s[0] || (s[0] = (o) => h(e).clear())
        }, {
          icon: O(() => [
            R(h(Mn), { size: 14 })
          ]),
          default: O(() => [
            ae(" " + X(h(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, Tr)) : K("", !0);
  }
}), Ir = /* @__PURE__ */ re(Or, [["__scopeId", "data-v-6def1b72"]]), Dr = { class: "transcription-panel" }, Lr = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Rr = { class: "turns-container" }, Mr = {
  key: 0,
  class: "history-loading",
  role: "status"
}, $r = {
  key: 1,
  class: "history-start"
}, Br = /* @__PURE__ */ F({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = we(), i = Je(), s = gt("scrollContainer"), o = T(() => {
      const b = i.live?.partial.value ?? null;
      return b === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: b,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), r = T(() => i.live?.hasLiveUpdate.value ?? !1), a = T(() => i.audio?.isPlaying.value ?? !1), l = T(
      () => i.activeChannel.value.activeTranslation.value
    ), u = T(() => i.activeChannel.value), c = T(
      () => u.value.isLoadingHistory.value
    ), d = T(() => u.value.hasMoreHistory.value), { scrollRef: v, contentRef: p, isAtBottom: f, scrollToBottom: g } = or();
    se(() => {
      v.value = s.value, p.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const m = bo(() => {
      const b = u.value;
      b.hasMoreHistory.value && (b.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: l.value.id }));
    }, 500);
    function x() {
      const b = s.value;
      b && b.scrollTop < 100 && m();
    }
    return Z(
      () => e.turns,
      (b, w) => {
        const y = b.length, _ = w.length;
        if (y > _ && !f.value && b[0]?.id != w[0]?.id) {
          const C = y - _, S = e.turns[C]?.id;
          if (!S || !v.value) return;
          oe(() => {
            v.value?.querySelector(
              `[data-turn-id="${S}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), se(() => {
      s.value?.addEventListener("scroll", x, {
        passive: !0
      });
    }), lt(() => {
      s.value?.removeEventListener("scroll", x);
    }), (b, w) => (E(), W("article", Dr, [
      N("div", Lr, [
        N("div", Rr, [
          R(Ir),
          c.value ? (E(), W("div", Mr, [...w[1] || (w[1] = [
            N("progress", null, null, -1)
          ])])) : K("", !0),
          !d.value && n.turns.length > 0 ? (E(), W("div", $r, X(h(t)("transcription.historyStart")), 1)) : K("", !0),
          n.turns.length === 0 && !c.value && !o.value ? (E(), $(Er, {
            key: 2,
            class: "transcription-empty"
          })) : K("", !0),
          (E(!0), W(ge, null, Ye(n.turns, (y, _) => (E(), $(oi, {
            "data-turn-id": y.id,
            key: y.id,
            turn: y,
            speaker: y.speakerId ? n.speakers.get(y.speakerId) : void 0,
            live: r.value && !o.value && _ === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          o.value ? (E(), $(oi, {
            key: "__partial__",
            turn: o.value,
            partial: ""
          }, null, 8, ["turn"])) : K("", !0)
        ]),
        R(Mi, { name: "fade-slide" }, {
          default: O(() => [
            !h(f) && (a.value || r.value) ? (E(), $(me, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": h(t)("transcription.resumeScroll"),
              onClick: w[0] || (w[0] = (y) => h(g)())
            }, {
              icon: O(() => [
                R(h(Po), { size: 14 })
              ]),
              default: O(() => [
                ae(" " + X(h(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : K("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), qr = /* @__PURE__ */ re(Br, [["__scopeId", "data-v-974ee253"]]), Fr = { class: "switch" }, zr = ["id", "checked"], Nr = ["for"], Wr = /* @__PURE__ */ F({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = t.id ?? Us();
    return (o, r) => (E(), W("div", Fr, [
      N("input", {
        type: "checkbox",
        id: h(s),
        checked: n.modelValue,
        onChange: r[0] || (r[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, zr),
      N("label", { for: h(s) }, [...r[1] || (r[1] = [
        N("div", { class: "switch-slider" }, null, -1)
      ])], 8, Nr)
    ]));
  }
}), Hr = /* @__PURE__ */ re(Wr, [["__scopeId", "data-v-2aa0332f"]]), Vr = "(max-width: 767px)";
function Ji() {
  const n = P(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return se(() => {
    e = window.matchMedia(Vr), n.value = e.matches, e.addEventListener("change", t);
  }), lt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function ai(n) {
  return typeof n == "string" ? `'${n}'` : new jr().serialize(n);
}
const jr = /* @__PURE__ */ (function() {
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
function Ur(n, e, t) {
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
function $n(n) {
  return n ? n.flatMap((e) => e.type === ge ? $n(e.children) : [e]) : [];
}
const [jt] = Oe("ConfigProvider");
function Kr(n, e) {
  var t;
  const i = rt();
  return be(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Xs(i);
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
function Xr(n) {
  let e = !1, t;
  const i = qi(!0);
  return ((...s) => (e || (t = i.run(() => n(...s)), e = !0), t));
}
const $e = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Yr = (n) => typeof n < "u", Gr = Object.prototype.toString, Jr = (n) => Gr.call(n) === "[object Object]", ui = /* @__PURE__ */ Zr();
function Zr() {
  var n, e, t;
  return $e && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function an(n) {
  return Array.isArray(n) ? n : [n];
}
function Qr(n) {
  return Ge();
}
// @__NO_SIDE_EFFECTS__
function ea(n) {
  if (!$e) return n;
  let e = 0, t, i;
  const s = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...o) => (e += 1, i || (i = qi(!0), t = i.run(() => n(...o))), Ut(s), t));
}
function Zi(n, e = 1e4) {
  return Ks((t, i) => {
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
function ta(n, e) {
  Qr() && lt(n, e);
}
function na(n, e, t) {
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
  return na(() => {
    var i, s;
    return [
      (i = (s = t.value) === null || s === void 0 ? void 0 : s.map((o) => Pe(o))) !== null && i !== void 0 ? i : [Kt].filter((o) => o != null),
      an(ue(t.value ? n[1] : n[0])),
      an(h(t.value ? n[2] : n[1])),
      ue(t.value ? n[3] : n[2])
    ];
  }, ([i, s, o, r], a, l) => {
    if (!i?.length || !s?.length || !o?.length) return;
    const u = Jr(r) ? { ...r } : r, c = i.flatMap((d) => s.flatMap((v) => o.map((p) => e(d, v, p, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function es() {
  const n = rt(!1), e = Ge();
  return e && se(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function ia(n) {
  const e = /* @__PURE__ */ es();
  return T(() => (e.value, !!n()));
}
function sa(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function oa(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: s = Kt, eventName: o = "keydown", passive: r = !1, dedupe: a = !1 } = i, l = sa(e);
  return Qi(s, o, (c) => {
    c.repeat && ue(a) || l(c) && t(c);
  }, r);
}
function ra(n) {
  return JSON.parse(JSON.stringify(n));
}
function aa(n, e, t = {}) {
  const { window: i = Kt, ...s } = t;
  let o;
  const r = /* @__PURE__ */ ia(() => i && "ResizeObserver" in i), a = () => {
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
  const { clone: r = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, v = Ge(), p = t || v?.emit || (v == null || (s = v.$emit) === null || s === void 0 ? void 0 : s.bind(v)) || (v == null || (o = v.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(v?.proxy));
  let f = l;
  e || (e = "modelValue"), f = f || `update:${e.toString()}`;
  const g = (b) => r ? typeof r == "function" ? r(b) : ra(b) : b, m = () => Yr(n[e]) ? g(n[e]) : c, x = (b) => {
    d ? d(b) && p(f, b) : p(f, b);
  };
  if (a) {
    const b = P(m());
    let w = !1;
    return Z(() => n[e], (y) => {
      w || (w = !0, b.value = g(y), oe(() => w = !1));
    }), Z(b, (y) => {
      !w && (y !== n[e] || u) && x(y);
    }, { deep: u }), b;
  } else return T({
    get() {
      return m();
    },
    set(b) {
      x(b);
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
function la(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => Cn(t, i, "", n), {})
  );
}
const ua = la(), ca = /* @__PURE__ */ ea(() => {
  const n = P(/* @__PURE__ */ new Map()), e = P(), t = T(() => {
    for (const r of n.value.values()) if (r) return !0;
    return !1;
  }), i = jt({ scrollBody: P(!0) });
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
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? ua({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ui && (s = Qi(document, "touchmove", (d) => da(d), { passive: !1 })), oe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function ts(n) {
  const e = Math.random().toString(36).substring(2, 7), t = ca();
  t.value.set(e, n ?? !1);
  const i = T({
    get: () => t.value.get(e) ?? !1,
    set: (s) => t.value.set(e, s)
  });
  return ta(() => {
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
function da(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && ns(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function is(n) {
  const e = jt({ dir: P("ltr") });
  return T(() => n?.value || e.dir?.value || "ltr");
}
function Xt(n) {
  const e = Ge(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((s) => {
    i[Ys(Fi(s))] = (...o) => n(s, ...o);
  }), i;
}
let un = 0;
function fa() {
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
  const n = Ge(), e = P(), t = T(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Pe(e)), i = Object.assign({}, n.exposed), s = {};
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
function Bn(n) {
  const e = Ge(), t = Object.keys(e?.type.props ?? {}).reduce((s, o) => {
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
function pa(n, e) {
  const t = Bn(n), i = e ? Xt(e) : {};
  return T(() => ({
    ...t.value,
    ...i
  }));
}
var ha = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, nt = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), At = {}, cn = 0, os = function(n) {
  return n && (n.host || os(n.parentNode));
}, va = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = os(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, ma = function(n, e, t, i) {
  var s = va(e, Array.isArray(n) ? n : [n]);
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
          var p = v.getAttribute(i), f = p !== null && p !== "false", g = (nt.get(v) || 0) + 1, m = (o.get(v) || 0) + 1;
          nt.set(v, g), o.set(v, m), r.push(v), g === 1 && f && Pt.set(v, !0), m === 1 && v.setAttribute(t, "true"), f || v.setAttribute(i, "true");
        } catch (x) {
          console.error("aria-hidden: cannot operate on ", v, x);
        }
    });
  };
  return c(e), a.clear(), cn++, function() {
    r.forEach(function(d) {
      var v = nt.get(d) - 1, p = o.get(d) - 1;
      nt.set(d, v), o.set(d, p), v || (Pt.has(d) || d.removeAttribute(i), Pt.delete(d)), p || d.removeAttribute(t);
    }), cn--, cn || (nt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), Pt = /* @__PURE__ */ new WeakMap(), At = {});
  };
}, ga = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), s = ha(n);
  return s ? (i.push.apply(i, Array.from(s.querySelectorAll("[aria-live], script"))), ma(i, s, t, "aria-hidden")) : function() {
    return null;
  };
};
function rs(n) {
  let e;
  Z(() => Pe(n), (t) => {
    t ? e = ga(t) : e && e();
  }), Et(() => {
    e && e();
  });
}
let ya = 0;
function bt(n, e = "reka") {
  if ("useId" in Yn) return `${e}-${Yn.useId?.()}`;
  const t = jt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++ya}`;
}
function ba() {
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
function wa(n) {
  const e = P(), t = T(() => e.value?.width ?? 0), i = T(() => e.value?.height ?? 0);
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
function Sa(n, e) {
  const t = P(n);
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
function qn(n) {
  const e = Zi("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (s, o) => {
      e.value = e.value + s;
      {
        const r = ye(), a = o.map((v) => ({
          ...v,
          textValue: v.value?.textValue ?? v.ref.textContent?.trim() ?? ""
        })), l = a.find((v) => v.ref === r), u = a.map((v) => v.textValue), c = xa(u, e.value, l?.textValue), d = a.find((v) => v.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Ca(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function xa(n, e, t) {
  const s = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, o = t ? n.indexOf(t) : -1;
  let r = Ca(n, Math.max(o, 0));
  s.length === 1 && (r = r.filter((u) => u !== t));
  const l = r.find((u) => u.toLowerCase().startsWith(s.toLowerCase()));
  return l !== t ? l : void 0;
}
function _a(n, e) {
  const t = P({}), i = P("none"), s = P(n), o = n.value ? "mounted" : "unmounted";
  let r;
  const a = e.value?.ownerDocument.defaultView ?? Kt, { state: l, dispatch: u } = Sa(o, {
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
      const x = new CustomEvent(m, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(x);
    }
  };
  Z(n, async (m, x) => {
    const b = x !== m;
    if (await oe(), b) {
      const w = i.value, y = Ot(e.value);
      m ? (u("MOUNT"), c("enter"), y === "none" && c("after-enter")) : y === "none" || y === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : x && w !== y ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (m) => {
    const x = Ot(e.value), b = x.includes(CSS.escape(m.animationName)), w = l.value === "mounted" ? "enter" : "leave";
    if (m.target === e.value && b && (c(`after-${w}`), u("ANIMATION_END"), !s.value)) {
      const y = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", r = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = y);
      });
    }
    m.target === e.value && x === "none" && u("ANIMATION_END");
  }, v = (m) => {
    m.target === e.value && (i.value = Ot(e.value));
  }, p = Z(e, (m, x) => {
    m ? (t.value = getComputedStyle(m), m.addEventListener("animationstart", v), m.addEventListener("animationcancel", d), m.addEventListener("animationend", d)) : (u("ANIMATION_END"), r !== void 0 && a?.clearTimeout(r), x?.removeEventListener("animationstart", v), x?.removeEventListener("animationcancel", d), x?.removeEventListener("animationend", d));
  }, { immediate: !0 }), f = Z(l, () => {
    const m = Ot(e.value);
    i.value = l.value === "mounted" ? m : "none";
  });
  return Et(() => {
    p(), f();
  }), { isPresent: T(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Ot(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Fn = F({
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
    const { present: i, forceMount: s } = ct(n), o = P(), { isPresent: r } = _a(i, o);
    t({ present: r });
    let a = e.default({ present: r.value });
    a = $n(a || []);
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
      const i = $n(t.default()), s = i.findIndex((l) => l.type !== Gs);
      if (s === -1) return i;
      const o = i[s];
      delete o.props?.ref;
      const r = o.props ? Q(e, o.props) : e, a = Js({
        ...o,
        props: {}
      }, r);
      return i.length === 1 ? a : (i[s] = a, i);
    };
  }
}), Ea = [
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
    return typeof i == "string" && Ea.includes(i) ? () => Le(i, e) : i !== "template" ? () => Le(n.as, e, { default: t.default }) : () => Le(xn, e, { default: t.default });
  }
});
function zt() {
  const n = P(), e = T(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Pe(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [We, ka] = Oe("DialogRoot");
var Ta = /* @__PURE__ */ F({
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
    }), o = P(), r = P(), { modal: a } = ct(t);
    return ka({
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
      open: h(s),
      close: () => s.value = !1
    });
  }
}), as = Ta, Pa = /* @__PURE__ */ F({
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
    return (i, s) => (E(), $(h(ne), Q(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (o) => h(t).onOpenChange(!1))
    }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Aa = Pa;
const Oa = "dismissableLayer.pointerDownOutside", Ia = "dismissableLayer.focusOutside";
function ls(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), s = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || s.indexOf(i) < s.indexOf(t)));
}
function Da(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = P(!1), o = P(() => {
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
            Vt(Oa, n, d);
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
function La(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, s = P(!1);
  return be((o) => {
    if (!$e || !ue(t)) return;
    const r = async (a) => {
      if (!e?.value) return;
      await oe(), await oe();
      const l = a.target;
      !e.value || !l || ls(e.value, l) || a.target && !s.value && Vt(Ia, n, { originalEvent: a });
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
      const p = Array.from(a.value), [f] = [...ve.layersWithOutsidePointerEventsDisabled].slice(-1), g = p.indexOf(f);
      return l.value >= g;
    }), d = Da(async (p) => {
      const f = [...ve.branches].some((g) => g?.contains(p.target));
      !c.value || f || (i("pointerDownOutside", p), i("interactOutside", p), await oe(), p.defaultPrevented || i("dismiss"));
    }, o), v = La((p) => {
      [...ve.branches].some((g) => g?.contains(p.target)) || (i("focusOutside", p), i("interactOutside", p), p.defaultPrevented || i("dismiss"));
    }, o);
    return oa("Escape", (p) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", p), p.defaultPrevented || i("dismiss"));
    }), be((p) => {
      o.value && (t.disableOutsidePointerEvents && (ve.layersWithOutsidePointerEventsDisabled.size === 0 && (ve.originalBodyPointerEvents = r.value.body.style.pointerEvents, r.value.body.style.pointerEvents = "none"), ve.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), p(() => {
        t.disableOutsidePointerEvents && ve.layersWithOutsidePointerEventsDisabled.size === 1 && !Sn(ve.originalBodyPointerEvents) && (r.value.body.style.pointerEvents = ve.originalBodyPointerEvents);
      }));
    }), be((p) => {
      p(() => {
        o.value && (a.value.delete(o.value), ve.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (p, f) => (E(), $(h(ne), {
      ref: h(s),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: ut({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: h(v).onFocusCapture,
      onBlurCapture: h(v).onBlurCapture,
      onPointerdownCapture: h(d).onPointerDownCapture
    }, {
      default: O(() => [V(p.$slots, "default")]),
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
const Ma = /* @__PURE__ */ Xr(() => P([]));
function $a() {
  const n = Ma();
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
function Ba(n, { select: e = !1 } = {}) {
  const t = ye();
  for (const i of n)
    if (Be(i, { select: e }), ye() !== t) return !0;
}
function qa(n) {
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
  for (const t of n) if (!Fa(t, { upTo: e })) return t;
}
function Fa(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function za(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Be(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = ye();
    n.focus({ preventScroll: !0 }), n !== t && za(n) && e && n.select();
  }
}
var Na = /* @__PURE__ */ F({
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
    const t = n, i = e, { currentRef: s, currentElement: o } = ie(), r = P(null), a = $a(), l = zi({
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
        const x = m.target;
        d.contains(x) ? r.value = x : Be(r.value, { select: !0 });
      }
      function p(m) {
        if (l.paused || !d) return;
        const x = m.relatedTarget;
        x !== null && (d.contains(x) || Be(r.value, { select: !0 }));
      }
      function f(m) {
        d.contains(r.value) || Be(d);
      }
      document.addEventListener("focusin", v), document.addEventListener("focusout", p);
      const g = new MutationObserver(f);
      d && g.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", v), document.removeEventListener("focusout", p), g.disconnect();
      });
    }), be(async (c) => {
      const d = o.value;
      if (await oe(), !d) return;
      a.add(l);
      const v = ye();
      if (!d.contains(v)) {
        const f = new CustomEvent(dn, fi);
        d.addEventListener(dn, (g) => i("mountAutoFocus", g)), d.dispatchEvent(f), f.defaultPrevented || (Ba(cs(d), { select: !0 }), ye() === v && Be(d));
      }
      c(() => {
        d.removeEventListener(dn, (m) => i("mountAutoFocus", m));
        const f = new CustomEvent(fn, fi), g = (m) => {
          i("unmountAutoFocus", m);
        };
        d.addEventListener(fn, g), d.dispatchEvent(f), setTimeout(() => {
          f.defaultPrevented || Be(v ?? document.body, { select: !0 }), d.removeEventListener(fn, g), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, v = ye();
      if (d && v) {
        const p = c.currentTarget, [f, g] = qa(p);
        f && g ? !c.shiftKey && v === g ? (c.preventDefault(), t.loop && Be(f, { select: !0 })) : c.shiftKey && v === f && (c.preventDefault(), t.loop && Be(g, { select: !0 })) : v === p && c.preventDefault();
      }
    }
    return (c, d) => (E(), $(h(ne), {
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
}), ds = Na;
function Wa(n) {
  return n ? "open" : "closed";
}
function hi(n) {
  const e = ye();
  for (const t of n)
    if (t === e || (t.focus(), ye() !== e)) return;
}
const Ha = "DialogTitle", Va = "DialogContent";
function ja({ titleName: n = Ha, contentName: e = Va, componentLink: t = "dialog.html#title", titleId: i, descriptionId: s, contentElement: o }) {
  const r = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  se(() => {
    document.getElementById(i) || console.warn(r);
    const u = o.value?.getAttribute("aria-describedby");
    s && u && (document.getElementById(s) || console.warn(a));
  });
}
var Ua = /* @__PURE__ */ F({
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
    }), process.env.NODE_ENV !== "production" && ja({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: s.titleId,
      descriptionId: s.descriptionId,
      contentElement: r
    }), (a, l) => (E(), $(h(ds), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: O(() => [R(h(us), Q({
        id: h(s).contentId,
        ref: h(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": h(s).descriptionId,
        "aria-labelledby": h(s).titleId,
        "data-state": h(Wa)(h(s).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => h(s).onOpenChange(!1)),
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
}), fs = Ua, Ka = /* @__PURE__ */ F({
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
      ...h(o)
    }, {
      ref: h(r),
      "trap-focus": h(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), h(s).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, v = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || v) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Xa = Ka, Ya = /* @__PURE__ */ F({
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
    const o = We(), r = P(!1), a = P(!1);
    return (l, u) => (E(), $(fs, Q({
      ...t,
      ...h(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (r.value || h(o).triggerElement.value?.focus(), c.preventDefault()), r.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (r.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        h(o).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ga = Ya, Ja = /* @__PURE__ */ F({
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
    return (a, l) => (E(), $(h(Fn), { present: a.forceMount || h(s).open.value }, {
      default: O(() => [h(s).modal.value ? (E(), $(Xa, Q({
        key: 0,
        ref: h(r)
      }, {
        ...t,
        ...h(o),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16)) : (E(), $(Ga, Q({
        key: 1,
        ref: h(r)
      }, {
        ...t,
        ...h(o),
        ...a.$attrs
      }), {
        default: O(() => [V(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), ps = Ja, Za = /* @__PURE__ */ F({
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
    return ts(!0), ie(), (t, i) => (E(), $(h(ne), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": h(e).open.value ? "open" : "closed",
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
}), Qa = Za, el = /* @__PURE__ */ F({
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
    return (i, s) => h(e)?.modal.value ? (E(), $(h(Fn), {
      key: 0,
      present: i.forceMount || h(e).open.value
    }, {
      default: O(() => [R(Qa, Q(i.$attrs, {
        ref: h(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: O(() => [V(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : K("v-if", !0);
  }
}), hs = el, tl = /* @__PURE__ */ F({
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
    return (t, i) => h(e) || t.forceMount ? (E(), $(Ni, {
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
}), vs = tl, nl = /* @__PURE__ */ F({
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
    return (t, i) => (E(), $(h(vs), In(Dn(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ms = nl, il = /* @__PURE__ */ F({
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
    return ie(), (i, s) => (E(), $(h(ne), Q(e, { id: h(t).titleId }), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), gs = il;
const vi = "data-reka-collection-item";
function He(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let s;
  if (t) {
    const c = P(/* @__PURE__ */ new Map());
    s = {
      collectionRef: P(),
      itemMap: c
    }, _t(i, s);
  } else s = xt(i);
  const o = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const v = Array.from(d.querySelectorAll(`[${vi}]`)), f = Array.from(s.itemMap.value.values()).sort((g, m) => v.indexOf(g.ref) - v.indexOf(m.ref));
    return c ? f : f.filter((g) => g.ref.dataset.disabled !== "");
  }, r = F({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: v }) {
      const { primitiveElement: p, currentElement: f } = zt();
      return Z(f, () => {
        s.collectionRef.value = f.value;
      }), () => Le(xn, {
        ref: p,
        ...v
      }, d);
    }
  }), a = F({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: v }) {
      const { primitiveElement: p, currentElement: f } = zt();
      return be((g) => {
        if (f.value) {
          const m = Zs(f.value);
          s.itemMap.value.set(m, {
            ref: f.value,
            value: c.value
          }), g(() => s.itemMap.value.delete(m));
        }
      }), () => Le(xn, {
        ...v,
        [vi]: "",
        ref: p
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
const sl = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ol(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function rl(n, e, t) {
  const i = ol(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return sl[i];
}
var al = /* @__PURE__ */ F({
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
    return (e, t) => (E(), $(h(ne), {
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
}), ys = al, ll = /* @__PURE__ */ F({
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
}), mi = ll, ul = /* @__PURE__ */ F({
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
    }), null, 16, ["name", "value"])) : (E(!0), W(ge, { key: 1 }, Ye(i.value, (r) => (E(), $(mi, Q({ key: r.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), cl = ul;
const [bs, dl] = Oe("PopperRoot");
var fl = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = P();
    return dl({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => V(t.$slots, "default");
  }
}), pl = fl, hl = /* @__PURE__ */ F({
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
    }), (o, r) => (E(), $(h(ne), {
      ref: h(t),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: O(() => [V(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), vl = hl;
function ml(n) {
  return n !== null;
}
function gl(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: s } = e, r = s.arrow?.centerOffset !== 0, a = r ? 0 : n.arrowWidth, l = r ? 0 : n.arrowHeight, [u, c] = _n(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], v = (s.arrow?.x ?? 0) + a / 2, p = (s.arrow?.y ?? 0) + l / 2;
      let f = "", g = "";
      return u === "bottom" ? (f = r ? d : `${v}px`, g = `${-l}px`) : u === "top" ? (f = r ? d : `${v}px`, g = `${i.floating.height + l}px`) : u === "right" ? (f = `${-l}px`, g = r ? d : `${p}px`) : u === "left" && (f = `${i.floating.width + l}px`, g = r ? d : `${p}px`), { data: {
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
const yl = ["top", "right", "bottom", "left"], ze = Math.min, pe = Math.max, Nt = Math.round, It = Math.floor, Te = (n) => ({
  x: n,
  y: n
}), bl = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, wl = {
  start: "end",
  end: "start"
};
function En(n, e, t) {
  return pe(n, ze(e, t));
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
function zn(n) {
  return n === "x" ? "y" : "x";
}
function Nn(n) {
  return n === "y" ? "height" : "width";
}
const Sl = /* @__PURE__ */ new Set(["top", "bottom"]);
function ke(n) {
  return Sl.has(Me(n)) ? "y" : "x";
}
function Wn(n) {
  return zn(ke(n));
}
function Cl(n, e, t) {
  t === void 0 && (t = !1);
  const i = dt(n), s = Wn(n), o = Nn(s);
  let r = s === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (r = Wt(r)), [r, Wt(r)];
}
function xl(n) {
  const e = Wt(n);
  return [kn(n), e, kn(e)];
}
function kn(n) {
  return n.replace(/start|end/g, (e) => wl[e]);
}
const gi = ["left", "right"], yi = ["right", "left"], _l = ["top", "bottom"], El = ["bottom", "top"];
function kl(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? yi : gi : e ? gi : yi;
    case "left":
    case "right":
      return e ? _l : El;
    default:
      return [];
  }
}
function Tl(n, e, t, i) {
  const s = dt(n);
  let o = kl(Me(n), t === "start", i);
  return s && (o = o.map((r) => r + "-" + s), e && (o = o.concat(o.map(kn)))), o;
}
function Wt(n) {
  return n.replace(/left|right|bottom|top/g, (e) => bl[e]);
}
function Pl(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function ws(n) {
  return typeof n != "number" ? Pl(n) : {
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
  const o = ke(e), r = Wn(e), a = Nn(r), l = Me(e), u = o === "y", c = i.x + i.width / 2 - s.width / 2, d = i.y + i.height / 2 - s.height / 2, v = i[a] / 2 - s[a] / 2;
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
  switch (dt(e)) {
    case "start":
      p[r] -= v * (t && u ? -1 : 1);
      break;
    case "end":
      p[r] += v * (t && u ? -1 : 1);
      break;
  }
  return p;
}
async function Al(n, e) {
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
    padding: p = 0
  } = Re(e, n), f = ws(p), m = a[v ? d === "floating" ? "reference" : "floating" : d], x = Ht(await o.getClippingRect({
    element: (t = await (o.isElement == null ? void 0 : o.isElement(m))) == null || t ? m : m.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), b = d === "floating" ? {
    x: i,
    y: s,
    width: r.floating.width,
    height: r.floating.height
  } : r.reference, w = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), y = await (o.isElement == null ? void 0 : o.isElement(w)) ? await (o.getScale == null ? void 0 : o.getScale(w)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = Ht(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: w,
    strategy: l
  }) : b);
  return {
    top: (x.top - _.top + f.top) / y.y,
    bottom: (_.bottom - x.bottom + f.bottom) / y.y,
    left: (x.left - _.left + f.left) / y.x,
    right: (_.right - x.right + f.right) / y.x
  };
}
const Ol = async (n, e, t) => {
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
  } = bi(u, i, l), v = i, p = {}, f = 0;
  for (let m = 0; m < a.length; m++) {
    var g;
    const {
      name: x,
      fn: b
    } = a[m], {
      x: w,
      y,
      data: _,
      reset: C
    } = await b({
      x: c,
      y: d,
      initialPlacement: i,
      placement: v,
      strategy: s,
      middlewareData: p,
      rects: u,
      platform: {
        ...r,
        detectOverflow: (g = r.detectOverflow) != null ? g : Al
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = w ?? c, d = y ?? d, p = {
      ...p,
      [x]: {
        ...p[x],
        ..._
      }
    }, C && f <= 50 && (f++, typeof C == "object" && (C.placement && (v = C.placement), C.rects && (u = C.rects === !0 ? await r.getElementRects({
      reference: n,
      floating: e,
      strategy: s
    }) : C.rects), {
      x: c,
      y: d
    } = bi(u, v, l)), m = -1);
  }
  return {
    x: c,
    y: d,
    placement: v,
    strategy: s,
    middlewareData: p
  };
}, Il = (n) => ({
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
    const d = ws(c), v = {
      x: t,
      y: i
    }, p = Wn(s), f = Nn(p), g = await r.getDimensions(u), m = p === "y", x = m ? "top" : "left", b = m ? "bottom" : "right", w = m ? "clientHeight" : "clientWidth", y = o.reference[f] + o.reference[p] - v[p] - o.floating[f], _ = v[p] - o.reference[p], C = await (r.getOffsetParent == null ? void 0 : r.getOffsetParent(u));
    let S = C ? C[w] : 0;
    (!S || !await (r.isElement == null ? void 0 : r.isElement(C))) && (S = a.floating[w] || o.floating[f]);
    const I = y / 2 - _ / 2, A = S / 2 - g[f] / 2 - 1, k = ze(d[x], A), L = ze(d[b], A), M = k, z = S - g[f] - L, D = S / 2 - g[f] / 2 + I, B = En(M, D, z), Y = !l.arrow && dt(s) != null && D !== B && o.reference[f] / 2 - (D < M ? k : L) - g[f] / 2 < 0, j = Y ? D < M ? D - M : D - z : 0;
    return {
      [p]: v[p] + j,
      data: {
        [p]: B,
        centerOffset: D - B - j,
        ...Y && {
          alignmentOffset: j
        }
      },
      reset: Y
    };
  }
}), Dl = function(n) {
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
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: f = "none",
        flipAlignment: g = !0,
        ...m
      } = Re(n, e);
      if ((t = o.arrow) != null && t.alignmentOffset)
        return {};
      const x = Me(s), b = ke(a), w = Me(a) === a, y = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), _ = v || (w || !g ? [Wt(a)] : xl(a)), C = f !== "none";
      !v && C && _.push(...Tl(a, g, f, y));
      const S = [a, ..._], I = await l.detectOverflow(e, m), A = [];
      let k = ((i = o.flip) == null ? void 0 : i.overflows) || [];
      if (c && A.push(I[x]), d) {
        const D = Cl(s, r, y);
        A.push(I[D[0]], I[D[1]]);
      }
      if (k = [...k, {
        placement: s,
        overflows: A
      }], !A.every((D) => D <= 0)) {
        var L, M;
        const D = (((L = o.flip) == null ? void 0 : L.index) || 0) + 1, B = S[D];
        if (B && (!(d === "alignment" ? b !== ke(B) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        k.every((G) => ke(G.placement) === b ? G.overflows[0] > 0 : !0)))
          return {
            data: {
              index: D,
              overflows: k
            },
            reset: {
              placement: B
            }
          };
        let Y = (M = k.filter((j) => j.overflows[0] <= 0).sort((j, G) => j.overflows[1] - G.overflows[1])[0]) == null ? void 0 : M.placement;
        if (!Y)
          switch (p) {
            case "bestFit": {
              var z;
              const j = (z = k.filter((G) => {
                if (C) {
                  const ee = ke(G.placement);
                  return ee === b || // Create a bias to the `y` side axis due to horizontal
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
  return yl.some((e) => n[e] >= 0);
}
const Ll = function(n) {
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
  } = n, o = await (i.isRTL == null ? void 0 : i.isRTL(s.floating)), r = Me(t), a = dt(t), l = ke(t) === "y", u = Ss.has(r) ? -1 : 1, c = o && l ? -1 : 1, d = Re(e, n);
  let {
    mainAxis: v,
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
    y: v * u
  } : {
    x: v * u,
    y: p * c
  };
}
const Ml = function(n) {
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
}, $l = function(n) {
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
          fn: (x) => {
            let {
              x: b,
              y: w
            } = x;
            return {
              x: b,
              y: w
            };
          }
        },
        ...u
      } = Re(n, e), c = {
        x: t,
        y: i
      }, d = await o.detectOverflow(e, u), v = ke(Me(s)), p = zn(v);
      let f = c[p], g = c[v];
      if (r) {
        const x = p === "y" ? "top" : "left", b = p === "y" ? "bottom" : "right", w = f + d[x], y = f - d[b];
        f = En(w, f, y);
      }
      if (a) {
        const x = v === "y" ? "top" : "left", b = v === "y" ? "bottom" : "right", w = g + d[x], y = g - d[b];
        g = En(w, g, y);
      }
      const m = l.fn({
        ...e,
        [p]: f,
        [v]: g
      });
      return {
        ...m,
        data: {
          x: m.x - t,
          y: m.y - i,
          enabled: {
            [p]: r,
            [v]: a
          }
        }
      };
    }
  };
}, Bl = function(n) {
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
      }, d = ke(s), v = zn(d);
      let p = c[v], f = c[d];
      const g = Re(a, e), m = typeof g == "number" ? {
        mainAxis: g,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...g
      };
      if (l) {
        const w = v === "y" ? "height" : "width", y = o.reference[v] - o.floating[w] + m.mainAxis, _ = o.reference[v] + o.reference[w] - m.mainAxis;
        p < y ? p = y : p > _ && (p = _);
      }
      if (u) {
        var x, b;
        const w = v === "y" ? "width" : "height", y = Ss.has(Me(s)), _ = o.reference[d] - o.floating[w] + (y && ((x = r.offset) == null ? void 0 : x[d]) || 0) + (y ? 0 : m.crossAxis), C = o.reference[d] + o.reference[w] + (y ? 0 : ((b = r.offset) == null ? void 0 : b[d]) || 0) - (y ? m.crossAxis : 0);
        f < _ ? f = _ : f > C && (f = C);
      }
      return {
        [v]: p,
        [d]: f
      };
    }
  };
}, ql = function(n) {
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
      } = Re(n, e), c = await r.detectOverflow(e, u), d = Me(s), v = dt(s), p = ke(s) === "y", {
        width: f,
        height: g
      } = o.floating;
      let m, x;
      d === "top" || d === "bottom" ? (m = d, x = v === (await (r.isRTL == null ? void 0 : r.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (x = d, m = v === "end" ? "top" : "bottom");
      const b = g - c.top - c.bottom, w = f - c.left - c.right, y = ze(g - c[m], b), _ = ze(f - c[x], w), C = !e.middlewareData.shift;
      let S = y, I = _;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (I = w), (i = e.middlewareData.shift) != null && i.enabled.y && (S = b), C && !v) {
        const k = pe(c.left, 0), L = pe(c.right, 0), M = pe(c.top, 0), z = pe(c.bottom, 0);
        p ? I = f - 2 * (k !== 0 || L !== 0 ? k + L : pe(c.left, c.right)) : S = g - 2 * (M !== 0 || z !== 0 ? M + z : pe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: I,
        availableHeight: S
      });
      const A = await r.getDimensions(a.floating);
      return f !== A.width || g !== A.height ? {
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
  return Hn(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function he(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Ie(n) {
  var e;
  return (e = (Hn(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Hn(n) {
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
const Fl = /* @__PURE__ */ new Set(["inline", "contents"]);
function kt(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: s
  } = _e(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !Fl.has(s);
}
const zl = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Nl(n) {
  return zl.has(Ze(n));
}
const Wl = [":popover-open", ":modal"];
function Gt(n) {
  return Wl.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Hl = ["transform", "translate", "scale", "rotate", "perspective"], Vl = ["transform", "translate", "scale", "rotate", "perspective", "filter"], jl = ["paint", "layout", "strict", "content"];
function Vn(n) {
  const e = jn(), t = xe(n) ? _e(n) : n;
  return Hl.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || Vl.some((i) => (t.willChange || "").includes(i)) || jl.some((i) => (t.contain || "").includes(i));
}
function Ul(n) {
  let e = Ne(n);
  for (; Ae(e) && !at(e); ) {
    if (Vn(e))
      return e;
    if (Gt(e))
      return null;
    e = Ne(e);
  }
  return null;
}
function jn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const Kl = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function at(n) {
  return Kl.has(Ze(n));
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
  if (Ze(n) === "html")
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
function Un(n) {
  return xe(n) ? n : n.contextElement;
}
function ot(n) {
  const e = Un(n);
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
const Xl = /* @__PURE__ */ Te(0);
function _s(n) {
  const e = he(n);
  return !jn() || !e.visualViewport ? Xl : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Yl(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== he(n) ? !1 : e;
}
function Xe(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const s = n.getBoundingClientRect(), o = Un(n);
  let r = Te(1);
  e && (i ? xe(i) && (r = ot(i)) : r = ot(n));
  const a = Yl(o, t, i) ? _s(o) : Te(0);
  let l = (s.left + a.x) / r.x, u = (s.top + a.y) / r.y, c = s.width / r.x, d = s.height / r.y;
  if (o) {
    const v = he(o), p = i && xe(i) ? he(i) : i;
    let f = v, g = Tn(f);
    for (; g && i && p !== f; ) {
      const m = ot(g), x = g.getBoundingClientRect(), b = _e(g), w = x.left + (g.clientLeft + parseFloat(b.paddingLeft)) * m.x, y = x.top + (g.clientTop + parseFloat(b.paddingTop)) * m.y;
      l *= m.x, u *= m.y, c *= m.x, d *= m.y, l += w, u += y, f = he(g), g = Tn(f);
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
  return e ? e.left + t : Xe(Ie(n)).left + t;
}
function Es(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - Zt(n, t), s = t.top + e.scrollTop;
  return {
    x: i,
    y: s
  };
}
function Gl(n) {
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
  if ((d || !d && !o) && ((Ze(i) !== "body" || kt(r)) && (l = Jt(i)), Ae(i))) {
    const p = Xe(i);
    u = ot(i), c.x = p.x + i.clientLeft, c.y = p.y + i.clientTop;
  }
  const v = r && !d && !o ? Es(r, l) : Te(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + v.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + v.y
  };
}
function Jl(n) {
  return Array.from(n.getClientRects());
}
function Zl(n) {
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
function Ql(n, e) {
  const t = he(n), i = Ie(n), s = t.visualViewport;
  let o = i.clientWidth, r = i.clientHeight, a = 0, l = 0;
  if (s) {
    o = s.width, r = s.height;
    const c = jn();
    (!c || c && e === "fixed") && (a = s.offsetLeft, l = s.offsetTop);
  }
  const u = Zt(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, v = getComputedStyle(d), p = c.compatMode === "CSS1Compat" && parseFloat(v.marginLeft) + parseFloat(v.marginRight) || 0, f = Math.abs(i.clientWidth - d.clientWidth - p);
    f <= xi && (o -= f);
  } else u <= xi && (o += u);
  return {
    width: o,
    height: r,
    x: a,
    y: l
  };
}
const eu = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function tu(n, e) {
  const t = Xe(n, !0, e === "fixed"), i = t.top + n.clientTop, s = t.left + n.clientLeft, o = Ae(n) ? ot(n) : Te(1), r = n.clientWidth * o.x, a = n.clientHeight * o.y, l = s * o.x, u = i * o.y;
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
    i = Ql(n, t);
  else if (e === "document")
    i = Zl(Ie(n));
  else if (xe(e))
    i = tu(e, t);
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
function nu(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = wt(n, [], !1).filter((a) => xe(a) && Ze(a) !== "body"), s = null;
  const o = _e(n).position === "fixed";
  let r = o ? Ne(n) : n;
  for (; xe(r) && !at(r); ) {
    const a = _e(r), l = Vn(r);
    !l && a.position === "fixed" && (s = null), (o ? !l && !s : !l && a.position === "static" && !!s && eu.has(s.position) || kt(r) && !l && ks(n, r)) ? i = i.filter((c) => c !== r) : s = a, r = Ne(r);
  }
  return e.set(n, i), i;
}
function iu(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: s
  } = n;
  const r = [...t === "clippingAncestors" ? Gt(e) ? [] : nu(e, this._c) : [].concat(t), i], a = r[0], l = r.reduce((u, c) => {
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
function su(n) {
  const {
    width: e,
    height: t
  } = xs(n);
  return {
    width: e,
    height: t
  };
}
function ou(n, e, t) {
  const i = Ae(e), s = Ie(e), o = t === "fixed", r = Xe(n, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Te(0);
  function u() {
    l.x = Zt(s);
  }
  if (i || !i && !o)
    if ((Ze(e) !== "body" || kt(s)) && (a = Jt(e)), i) {
      const p = Xe(e, !0, o, e);
      l.x = p.x + e.clientLeft, l.y = p.y + e.clientTop;
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
  for (; i && Nl(i) && pn(i); )
    i = Ei(i, e);
  return i && at(i) && pn(i) && !Vn(i) ? t : i || Ul(n) || t;
}
const ru = async function(n) {
  const e = this.getOffsetParent || Ts, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: ou(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function au(n) {
  return _e(n).direction === "rtl";
}
const lu = {
  convertOffsetParentRelativeRectToViewportRelativeRect: Gl,
  getDocumentElement: Ie,
  getClippingRect: iu,
  getOffsetParent: Ts,
  getElementRects: ru,
  getClientRects: Jl,
  getDimensions: su,
  getScale: ot,
  isElement: xe,
  isRTL: au
};
function Ps(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function uu(n, e) {
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
      height: p
    } = u;
    if (a || e(), !v || !p)
      return;
    const f = It(d), g = It(s.clientWidth - (c + v)), m = It(s.clientHeight - (d + p)), x = It(c), w = {
      rootMargin: -f + "px " + -g + "px " + -m + "px " + -x + "px",
      threshold: pe(0, ze(1, l)) || 1
    };
    let y = !0;
    function _(C) {
      const S = C[0].intersectionRatio;
      if (S !== l) {
        if (!y)
          return r();
        S ? r(!1, S) : i = setTimeout(() => {
          r(!1, 1e-7);
        }, 1e3);
      }
      S === 1 && !Ps(u, n.getBoundingClientRect()) && r(), y = !1;
    }
    try {
      t = new IntersectionObserver(_, {
        ...w,
        // Handle <iframe>s
        root: s.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(_, w);
    }
    t.observe(n);
  }
  return r(!0), o;
}
function cu(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: s = !0,
    ancestorResize: o = !0,
    elementResize: r = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Un(n), c = s || o ? [...u ? wt(u) : [], ...wt(e)] : [];
  c.forEach((x) => {
    s && x.addEventListener("scroll", t, {
      passive: !0
    }), o && x.addEventListener("resize", t);
  });
  const d = u && a ? uu(u, t) : null;
  let v = -1, p = null;
  r && (p = new ResizeObserver((x) => {
    let [b] = x;
    b && b.target === u && p && (p.unobserve(e), cancelAnimationFrame(v), v = requestAnimationFrame(() => {
      var w;
      (w = p) == null || w.observe(e);
    })), t();
  }), u && !l && p.observe(u), p.observe(e));
  let f, g = l ? Xe(n) : null;
  l && m();
  function m() {
    const x = Xe(n);
    g && !Ps(g, x) && t(), g = x, f = requestAnimationFrame(m);
  }
  return t(), () => {
    var x;
    c.forEach((b) => {
      s && b.removeEventListener("scroll", t), o && b.removeEventListener("resize", t);
    }), d?.(), (x = p) == null || x.disconnect(), p = null, l && cancelAnimationFrame(f);
  };
}
const du = Ml, fu = $l, ki = Dl, pu = ql, hu = Ll, vu = Il, mu = Bl, gu = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), s = {
    platform: lu,
    ...t
  }, o = {
    ...s.platform,
    _c: i
  };
  return Ol(n, e, {
    ...s,
    platform: o
  });
};
function yu(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function Pn(n) {
  if (yu(n)) {
    const e = n.$el;
    return Hn(e) && Ze(e) === "#comment" ? null : e;
  }
  return n;
}
function st(n) {
  return typeof n == "function" ? n() : h(n);
}
function bu(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = Pn(st(n.element));
      return t == null ? {} : vu({
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
function wu(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, s = T(() => {
    var S;
    return (S = st(t.open)) != null ? S : !0;
  }), o = T(() => st(t.middleware)), r = T(() => {
    var S;
    return (S = st(t.placement)) != null ? S : "bottom";
  }), a = T(() => {
    var S;
    return (S = st(t.strategy)) != null ? S : "absolute";
  }), l = T(() => {
    var S;
    return (S = st(t.transform)) != null ? S : !0;
  }), u = T(() => Pn(n.value)), c = T(() => Pn(e.value)), d = P(0), v = P(0), p = P(a.value), f = P(r.value), g = rt({}), m = P(!1), x = T(() => {
    const S = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return S;
    const I = Ti(c.value, d.value), A = Ti(c.value, v.value);
    return l.value ? {
      ...S,
      transform: "translate(" + I + "px, " + A + "px)",
      ...As(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: I + "px",
      top: A + "px"
    };
  });
  let b;
  function w() {
    if (u.value == null || c.value == null)
      return;
    const S = s.value;
    gu(u.value, c.value, {
      middleware: o.value,
      placement: r.value,
      strategy: a.value
    }).then((I) => {
      d.value = I.x, v.value = I.y, p.value = I.strategy, f.value = I.placement, g.value = I.middlewareData, m.value = S !== !1;
    });
  }
  function y() {
    typeof b == "function" && (b(), b = void 0);
  }
  function _() {
    if (y(), i === void 0) {
      w();
      return;
    }
    if (u.value != null && c.value != null) {
      b = i(u.value, c.value, w);
      return;
    }
  }
  function C() {
    s.value || (m.value = !1);
  }
  return Z([o, r, a, s], w, {
    flush: "sync"
  }), Z([u, c], _, {
    flush: "sync"
  }), Z(s, C, {
    flush: "sync"
  }), $i() && Bi(y), {
    x: tt(d),
    y: tt(v),
    strategy: tt(p),
    placement: tt(f),
    middlewareData: tt(g),
    isPositioned: tt(m),
    floatingStyles: x,
    update: w
  };
}
const Su = {
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
}, [Hd, Cu] = Oe("PopperContent");
var xu = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Qs({
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
  }, { ...Su }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = bs(), { forwardRef: o, currentElement: r } = ie(), a = P(), l = P(), { width: u, height: c } = wa(l), d = T(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), v = T(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), p = T(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), f = T(() => ({
      padding: v.value,
      boundary: p.value.filter(ml),
      altBoundary: p.value.length > 0
    })), g = T(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), m = Kr(() => [
      du({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && ki({
        ...f.value,
        ...g.value
      }),
      t.avoidCollisions && fu({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? mu() : void 0,
        ...f.value
      }),
      !t.prioritizePosition && t.avoidCollisions && ki({
        ...f.value,
        ...g.value
      }),
      pu({
        ...f.value,
        apply: ({ elements: M, rects: z, availableWidth: D, availableHeight: B }) => {
          const { width: Y, height: j } = z.reference, G = M.floating.style;
          G.setProperty("--reka-popper-available-width", `${D}px`), G.setProperty("--reka-popper-available-height", `${B}px`), G.setProperty("--reka-popper-anchor-width", `${Y}px`), G.setProperty("--reka-popper-anchor-height", `${j}px`);
        }
      }),
      l.value && bu({
        element: l.value,
        padding: t.arrowPadding
      }),
      gl({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && hu({
        strategy: "referenceHidden",
        ...f.value
      })
    ]), x = T(() => t.reference ?? s.anchor.value), { floatingStyles: b, placement: w, isPositioned: y, middlewareData: _ } = wu(x, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...M) => cu(...M, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: m
    }), C = T(() => _n(w.value)[0]), S = T(() => _n(w.value)[1]);
    Wi(() => {
      y.value && i("placed");
    });
    const I = T(() => {
      const M = _.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && M;
    }), A = P("");
    be(() => {
      r.value && (A.value = window.getComputedStyle(r.value).zIndex);
    });
    const k = T(() => _.value.arrow?.x ?? 0), L = T(() => _.value.arrow?.y ?? 0);
    return Cu({
      placedSide: C,
      onArrowChange: (M) => l.value = M,
      arrowX: k,
      arrowY: L,
      shouldHideArrow: I
    }), (M, z) => (E(), W("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: ut({
        ...h(b),
        transform: h(y) ? h(b).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: A.value,
        "--reka-popper-transform-origin": [h(_).transformOrigin?.x, h(_).transformOrigin?.y].join(" "),
        ...h(_).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [R(h(ne), Q({ ref: h(o) }, M.$attrs, {
      "as-child": t.asChild,
      as: M.as,
      "data-side": C.value,
      "data-align": S.value,
      style: { animation: h(y) ? void 0 : "none" }
    }), {
      default: O(() => [V(M.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), _u = xu;
function Eu(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => vt(i, e, t)) : vt(n, e, t);
}
function vt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : qt(n, e);
}
const [Os, ku] = Oe("ListboxRoot");
var Tu = /* @__PURE__ */ F({
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
    const i = n, s = t, { multiple: o, highlightOnHover: r, orientation: a, disabled: l, selectionBehavior: u, dir: c } = ct(i), { getItems: d } = He({ isProvider: !0 }), { handleTypeaheadSearch: v } = qn(), { primitiveElement: p, currentElement: f } = zt(), g = ba(), m = is(c), x = ss(f), b = P(), w = P(!1), y = P(!0), _ = /* @__PURE__ */ Ft(i, "modelValue", s, {
      defaultValue: i.defaultValue ?? (o.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function C(q) {
      if (w.value = !0, i.multiple) {
        const H = Array.isArray(_.value) ? [..._.value] : [], U = H.findIndex((J) => vt(J, q, i.by));
        i.selectionBehavior === "toggle" ? (U === -1 ? H.push(q) : H.splice(U, 1), _.value = H) : (_.value = [q], b.value = q);
      } else i.selectionBehavior === "toggle" && vt(_.value, q, i.by) ? _.value = void 0 : _.value = q;
      setTimeout(() => {
        w.value = !1;
      }, 1);
    }
    const S = P(null), I = P(null), A = P(!1), k = P(!1), L = /* @__PURE__ */ rn(), M = /* @__PURE__ */ rn(), z = /* @__PURE__ */ rn();
    function D() {
      return d().map((q) => q.ref).filter((q) => q.dataset.disabled !== "");
    }
    function B(q, H = !0) {
      if (!q) return;
      S.value = q, y.value && S.value.focus(), H && S.value.scrollIntoView({ block: "nearest" });
      const U = d().find((J) => J.ref === q);
      s("highlight", U);
    }
    function Y(q) {
      if (A.value) z.trigger(q);
      else {
        const H = d().find((U) => vt(U.value, q, i.by));
        H && (S.value = H.ref, B(H.ref));
      }
    }
    function j(q) {
      S.value && S.value.isConnected && (q.preventDefault(), q.stopPropagation(), k.value || S.value.click());
    }
    function G(q) {
      if (y.value) {
        if (w.value = !0, A.value) M.trigger(q);
        else {
          const H = q.altKey || q.ctrlKey || q.metaKey;
          if (H && q.key === "a" && o.value) {
            const U = d(), J = U.map((Ee) => Ee.value);
            _.value = [...J], q.preventDefault(), B(U[U.length - 1].ref);
          } else if (!H) {
            const U = v(q.key, d());
            U && B(U);
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
    function de() {
      oe(() => {
        k.value = !1;
      });
    }
    function Qe() {
      oe(() => {
        const q = new KeyboardEvent("keydown", { key: "PageUp" });
        je(q);
      });
    }
    function Se(q) {
      const H = S.value;
      H?.isConnected && (I.value = H), S.value = null, s("leave", q);
    }
    function et(q) {
      const H = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (q.currentTarget?.dispatchEvent(H), s("entryFocus", H), !H.defaultPrevented)
        if (I.value) B(I.value);
        else {
          const U = D()?.[0];
          B(U);
        }
    }
    function je(q) {
      const H = rl(q, a.value, m.value);
      if (!H) return;
      let U = D();
      if (S.value) {
        if (H === "last") U.reverse();
        else if (H === "prev" || H === "next") {
          H === "prev" && U.reverse();
          const J = U.indexOf(S.value);
          U = U.slice(J + 1);
        }
        en(q, U[0]);
      }
      if (U.length) {
        const J = !S.value && H === "prev" ? U.length - 1 : 0;
        B(U[J]);
      }
      if (A.value) return M.trigger(q);
    }
    function en(q, H) {
      if (!(A.value || i.selectionBehavior !== "replace" || !o.value || !Array.isArray(_.value) || (q.altKey || q.ctrlKey || q.metaKey) && !q.shiftKey) && q.shiftKey) {
        const J = d().filter((De) => De.ref.dataset.disabled !== "");
        let Ee = J.find((De) => De.ref === H)?.value;
        if (q.key === g.END ? Ee = J[J.length - 1].value : q.key === g.HOME && (Ee = J[0].value), !Ee || !b.value) return;
        const ft = Ur(J.map((De) => De.value), b.value, Ee);
        _.value = ft;
      }
    }
    async function tn(q) {
      if (await oe(), A.value) L.trigger(q);
      else {
        const H = D(), U = H.find((J) => J.dataset.state === "checked");
        U ? B(U) : H.length && B(H[0]);
      }
    }
    return Z(_, () => {
      w.value || oe(() => {
        tn();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: S,
      highlightItem: Y,
      highlightFirstItem: Qe,
      highlightSelected: tn,
      getItems: d
    }), ku({
      modelValue: _,
      onValueChange: C,
      multiple: o,
      orientation: a,
      dir: m,
      disabled: l,
      highlightOnHover: r,
      highlightedElement: S,
      isVirtual: A,
      virtualFocusHook: L,
      virtualKeydownHook: M,
      virtualHighlightHook: z,
      by: i.by,
      firstValue: b,
      selectionBehavior: u,
      focusable: y,
      onLeave: Se,
      onEnter: et,
      changeHighlight: B,
      onKeydownEnter: j,
      onKeydownNavigation: je,
      onKeydownTypeAhead: G,
      onCompositionStart: ee,
      onCompositionEnd: de,
      highlightFirstItem: Qe
    }), (q, H) => (E(), $(h(ne), {
      ref_key: "primitiveElement",
      ref: p,
      as: q.as,
      "as-child": q.asChild,
      dir: h(m),
      "data-disabled": h(l) ? "" : void 0,
      onPointerleave: Se,
      onFocusout: H[0] || (H[0] = async (U) => {
        const J = U.relatedTarget || U.target;
        await oe(), S.value && h(f) && !h(f).contains(J) && Se(U);
      })
    }, {
      default: O(() => [V(q.$slots, "default", { modelValue: h(_) }), h(x) && q.name ? (E(), $(h(cl), {
        key: 0,
        name: q.name,
        value: h(_),
        disabled: h(l),
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
}), Pu = Tu, Au = /* @__PURE__ */ F({
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
    return (s, o) => (E(), $(h(e), null, {
      default: O(() => [R(h(ne), {
        role: "listbox",
        as: s.as,
        "as-child": s.asChild,
        tabindex: h(t).focusable.value ? h(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": h(t).orientation.value,
        "aria-multiselectable": !!h(t).multiple.value,
        "data-orientation": h(t).orientation.value,
        onMousedown: o[0] || (o[0] = Fe((r) => i.value = !0, ["left"])),
        onFocus: o[1] || (o[1] = (r) => {
          h(i) || h(t).onEnter(r);
        }),
        onKeydown: [
          o[2] || (o[2] = yn((r) => {
            h(t).orientation.value === "vertical" && (r.key === "ArrowLeft" || r.key === "ArrowRight") || h(t).orientation.value === "horizontal" && (r.key === "ArrowUp" || r.key === "ArrowDown") || (r.preventDefault(), h(t).focusable.value && h(t).onKeydownNavigation(r));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          yn(h(t).onKeydownEnter, ["enter"]),
          h(t).onKeydownTypeAhead
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
}), Ou = Au;
const Iu = "listbox.select", [Du, Lu] = Oe("ListboxItem");
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
    const t = n, i = e, s = bt(void 0, "reka-listbox-item"), { CollectionItem: o } = He(), { forwardRef: r, currentElement: a } = ie(), l = Os(), u = T(() => a.value === l.highlightedElement.value), c = T(() => Eu(l.modelValue.value, t.value, l.by)), d = T(() => l.disabled.value || t.disabled);
    async function v(f) {
      i("select", f), !f?.defaultPrevented && !d.value && f && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function p(f) {
      const g = {
        originalEvent: f,
        value: t.value
      };
      Vt(Iu, v, g);
    }
    return Lu({ isSelected: c }), (f, g) => (E(), $(h(o), { value: f.value }, {
      default: O(() => [eo([u.value, c.value], () => R(h(ne), Q({ id: h(s) }, f.$attrs, {
        ref: h(r),
        role: "option",
        tabindex: h(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: f.as,
        "as-child": f.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: p,
        onKeydown: yn(Fe(p, ["prevent"]), ["space"]),
        onPointermove: g[0] || (g[0] = () => {
          h(l).highlightedElement.value !== h(a) && h(l).highlightOnHover.value && !h(l).focusable.value && h(l).changeHighlight(h(a), !1);
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
}), Mu = Ru, $u = /* @__PURE__ */ F({
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
    const t = Du();
    return (i, s) => h(t).isSelected.value ? (E(), $(h(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), Bu = $u;
function qu(n) {
  const e = jt({ nonce: P() });
  return T(() => n?.value || e.nonce?.value);
}
const Fu = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], zu = [" ", "Enter"], Ce = 10;
function St(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => An(i, e, t)) : An(n, e, t);
}
function An(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : qt(n, e);
}
function Nu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Wu = {
  key: 0,
  value: ""
}, [Ve, Is] = Oe("SelectRoot");
var Hu = /* @__PURE__ */ F({
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
    }), c = P(), d = P(), v = P({
      x: 0,
      y: 0
    }), p = T(() => r.value && Array.isArray(l.value) ? l.value?.length === 0 : Sn(l.value));
    He({ isProvider: !0 });
    const f = is(a), g = ss(c), m = P(/* @__PURE__ */ new Set()), x = T(() => Array.from(m.value).map((y) => y.value).join(";"));
    function b(y) {
      if (r.value) {
        const _ = Array.isArray(l.value) ? [...l.value] : [], C = _.findIndex((S) => An(S, y, t.by));
        C === -1 ? _.push(y) : _.splice(C, 1), l.value = [..._];
      } else l.value = y;
    }
    function w(y) {
      return Array.from(m.value).find((_) => St(y, _.value, t.by));
    }
    return Is({
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
      onValueChange: b,
      by: t.by,
      open: u,
      multiple: r,
      required: s,
      onOpenChange: (y) => {
        u.value = y;
      },
      dir: f,
      triggerPointerDownPosRef: v,
      disabled: o,
      isEmptyModelValue: p,
      optionsSet: m,
      onOptionAdd: (y) => {
        const _ = w(y.value);
        _ && m.value.delete(_), m.value.add(y);
      },
      onOptionRemove: (y) => {
        const _ = w(y.value);
        _ && m.value.delete(_);
      }
    }), (y, _) => (E(), $(h(pl), null, {
      default: O(() => [V(y.$slots, "default", {
        modelValue: h(l),
        open: h(u)
      }), h(g) ? (E(), $(Uu, {
        key: x.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: h(r),
        required: h(s),
        name: y.name,
        autocomplete: y.autocomplete,
        disabled: h(o),
        value: h(l)
      }, {
        default: O(() => [h(Sn)(h(l)) ? (E(), W("option", Wu)) : K("v-if", !0), (E(!0), W(ge, null, Ye(Array.from(m.value), (C) => (E(), W("option", Q({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
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
}), Vu = Hu, ju = /* @__PURE__ */ F({
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
    const e = n, t = P(), i = Ve();
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
    return (o, r) => (E(), $(h(ys), { "as-child": "" }, {
      default: O(() => [N("select", Q({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: s }), [V(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Uu = ju, Ku = /* @__PURE__ */ F({
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
    const t = Bn(n);
    return (i, s) => (E(), $(h(_u), Q(h(t), { style: {
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
}), Xu = Ku;
const Yu = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [Qt, Ds] = Oe("SelectContent");
var Gu = /* @__PURE__ */ F({
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
    fa(), ts(t.bodyLock);
    const { CollectionSlot: o, getItems: r } = He(), a = P();
    rs(a);
    const { search: l, handleTypeaheadSearch: u } = qn(), c = P(), d = P(), v = P(), p = P(!1), f = P(!1), g = P(!1);
    function m() {
      d.value && a.value && hi([d.value, a.value]);
    }
    Z(p, () => {
      m();
    });
    const { onOpenChange: x, triggerPointerDownPosRef: b } = s;
    be((C) => {
      if (!a.value) return;
      let S = {
        x: 0,
        y: 0
      };
      const I = (k) => {
        S = {
          x: Math.abs(Math.round(k.pageX) - (b.value?.x ?? 0)),
          y: Math.abs(Math.round(k.pageY) - (b.value?.y ?? 0))
        };
      }, A = (k) => {
        k.pointerType !== "touch" && (S.x <= 10 && S.y <= 10 ? k.preventDefault() : a.value?.contains(k.target) || x(!1), document.removeEventListener("pointermove", I), b.value = null);
      };
      b.value !== null && (document.addEventListener("pointermove", I), document.addEventListener("pointerup", A, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", I), document.removeEventListener("pointerup", A, { capture: !0 });
      });
    });
    function w(C) {
      const S = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !S && C.key.length === 1 && u(C.key, r()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(C.key)) {
        let A = [...r().map((k) => k.ref)];
        if (["ArrowUp", "End"].includes(C.key) && (A = A.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(C.key)) {
          const k = C.target, L = A.indexOf(k);
          A = A.slice(L + 1);
        }
        setTimeout(() => hi(A)), C.preventDefault();
      }
    }
    const y = T(() => t.position === "popper" ? t : {}), _ = Bn(y.value);
    return Ds({
      content: a,
      viewport: c,
      onViewportChange: (C) => {
        c.value = C;
      },
      itemRefCallback: (C, S, I) => {
        const A = !f.value && !I, k = St(s.modelValue.value, S, s.by);
        if (s.multiple.value) {
          if (g.value) return;
          (k || A) && (d.value = C, k && (g.value = !0));
        } else (k || A) && (d.value = C);
        A && (f.value = !0);
      },
      selectedItem: d,
      selectedItemText: v,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (C, S, I) => {
        const A = !f.value && !I;
        (St(s.modelValue.value, S, s.by) || A) && (v.value = C);
      },
      focusSelectedItem: m,
      position: t.position,
      isPositioned: p,
      searchRef: l
    }), (C, S) => (E(), $(h(o), null, {
      default: O(() => [R(h(ds), {
        "as-child": "",
        onMountAutoFocus: S[6] || (S[6] = Fe(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: S[7] || (S[7] = (I) => {
          i("closeAutoFocus", I), !I.defaultPrevented && (h(s).triggerElement.value?.focus({ preventScroll: !0 }), I.preventDefault());
        })
      }, {
        default: O(() => [R(h(us), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: S[2] || (S[2] = Fe(() => {
          }, ["prevent"])),
          onDismiss: S[3] || (S[3] = (I) => h(s).onOpenChange(!1)),
          onEscapeKeyDown: S[4] || (S[4] = (I) => i("escapeKeyDown", I)),
          onPointerDownOutside: S[5] || (S[5] = (I) => i("pointerDownOutside", I))
        }, {
          default: O(() => [(E(), $(to(C.position === "popper" ? Xu : tc), Q({
            ...C.$attrs,
            ...h(_)
          }, {
            id: h(s).contentId,
            ref: (I) => {
              const A = h(Pe)(I);
              A?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = A.firstElementChild : a.value = A;
            },
            role: "listbox",
            "data-state": h(s).open.value ? "open" : "closed",
            dir: h(s).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: S[0] || (S[0] = Fe(() => {
            }, ["prevent"])),
            onPlaced: S[1] || (S[1] = (I) => p.value = !0),
            onKeydown: w
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
}), Ju = Gu;
const [Zu, Qu] = Oe("SelectItemAlignedPosition");
var ec = /* @__PURE__ */ F({
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
    const t = n, i = e, { getItems: s } = He(), o = Ve(), r = Qt(), a = P(!1), l = P(!0), u = P(), { forwardRef: c, currentElement: d } = ie(), { viewport: v, selectedItem: p, selectedItemText: f, focusSelectedItem: g } = r;
    function m() {
      if (o.triggerElement.value && o.valueElement.value && u.value && d.value && v?.value && p?.value && f?.value) {
        const w = o.triggerElement.value.getBoundingClientRect(), y = d.value.getBoundingClientRect(), _ = o.valueElement.value.getBoundingClientRect(), C = f.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const q = C.left - y.left, H = _.left - q, U = w.left - H, J = w.width + U, Ee = Math.max(J, y.width), ft = window.innerWidth - Ce, De = li(H, Ce, Math.max(Ce, ft - Ee));
          u.value.style.minWidth = `${J}px`, u.value.style.left = `${De}px`;
        } else {
          const q = y.right - C.right, H = window.innerWidth - _.right - q, U = window.innerWidth - w.right - H, J = w.width + U, Ee = Math.max(J, y.width), ft = window.innerWidth - Ce, De = li(H, Ce, Math.max(Ce, ft - Ee));
          u.value.style.minWidth = `${J}px`, u.value.style.right = `${De}px`;
        }
        const S = s().map((q) => q.ref), I = window.innerHeight - Ce * 2, A = v.value.scrollHeight, k = window.getComputedStyle(d.value), L = Number.parseInt(k.borderTopWidth, 10), M = Number.parseInt(k.paddingTop, 10), z = Number.parseInt(k.borderBottomWidth, 10), D = Number.parseInt(k.paddingBottom, 10), B = L + M + A + D + z, Y = Math.min(p.value.offsetHeight * 5, B), j = window.getComputedStyle(v.value), G = Number.parseInt(j.paddingTop, 10), ee = Number.parseInt(j.paddingBottom, 10), de = w.top + w.height / 2 - Ce, Qe = I - de, Se = p.value.offsetHeight / 2, et = p.value.offsetTop + Se, je = L + M + et, en = B - je;
        if (je <= de) {
          const q = p.value === S[S.length - 1];
          u.value.style.bottom = "0px";
          const H = d.value.clientHeight - v.value.offsetTop - v.value.offsetHeight, U = Math.max(Qe, Se + (q ? ee : 0) + H + z), J = je + U;
          u.value.style.height = `${J}px`;
        } else {
          const q = p.value === S[0];
          u.value.style.top = "0px";
          const U = Math.max(de, L + v.value.offsetTop + (q ? G : 0) + Se) + en;
          u.value.style.height = `${U}px`, v.value.scrollTop = je - de + v.value.offsetTop;
        }
        u.value.style.margin = `${Ce}px 0`, u.value.style.minHeight = `${Y}px`, u.value.style.maxHeight = `${I}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const x = P("");
    se(async () => {
      await oe(), m(), d.value && (x.value = window.getComputedStyle(d.value).zIndex);
    });
    function b(w) {
      w && l.value === !0 && (m(), g?.(), l.value = !1);
    }
    return aa(o.triggerElement, () => {
      m();
    }), Qu({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: b
    }), (w, y) => (E(), W("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: ut({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: x.value
      })
    }, [R(h(ne), Q({
      ref: h(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...w.$attrs,
      ...t
    }), {
      default: O(() => [V(w.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), tc = ec, nc = /* @__PURE__ */ F({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Is(n.context), Ds(Yu), (t, i) => V(t.$slots, "default");
  }
}), ic = nc;
const sc = { key: 1 };
var oc = /* @__PURE__ */ F({
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
    const t = n, s = pa(t, e), o = Ve(), r = P();
    se(() => {
      r.value = new DocumentFragment();
    });
    const a = P(), l = T(() => t.forceMount || o.open.value), u = P(l.value);
    return Z(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (E(), $(h(Fn), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: O(() => [R(Ju, In(Dn({
        ...h(s),
        ...c.$attrs
      })), {
        default: O(() => [V(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : r.value ? (E(), W("div", sc, [(E(), $(Ni, { to: r.value }, [R(ic, { context: h(o) }, {
      default: O(() => [V(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), rc = oc, ac = /* @__PURE__ */ F({
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
    return (e, t) => (E(), $(h(ne), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: O(() => [V(e.$slots, "default", {}, () => [t[0] || (t[0] = ae("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), lc = ac;
const [Ls, uc] = Oe("SelectItem");
var cc = /* @__PURE__ */ F({
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
    const t = n, i = e, { disabled: s } = ct(t), o = Ve(), r = Qt(), { forwardRef: a, currentElement: l } = ie(), { CollectionItem: u } = He(), c = T(() => St(o.modelValue?.value, t.value, o.by)), d = P(!1), v = P(t.textValue ?? ""), p = bt(void 0, "reka-select-item-text"), f = "select.select";
    async function g(y) {
      if (y.defaultPrevented) return;
      const _ = {
        originalEvent: y,
        value: t.value
      };
      Vt(f, m, _);
    }
    async function m(y) {
      await oe(), i("select", y), !y.defaultPrevented && (s.value || (o.onValueChange(t.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function x(y) {
      await oe(), !y.defaultPrevented && (s.value ? r.onItemLeave?.() : y.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function b(y) {
      await oe(), !y.defaultPrevented && y.currentTarget === ye() && r.onItemLeave?.();
    }
    async function w(y) {
      await oe(), !(y.defaultPrevented || r.searchRef?.value !== "" && y.key === " ") && (zu.includes(y.key) && g(y), y.key === " " && y.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return se(() => {
      l.value && r.itemRefCallback(l.value, t.value, t.disabled);
    }), uc({
      value: t.value,
      disabled: s,
      textId: p,
      isSelected: c,
      onItemTextChange: (y) => {
        v.value = ((v.value || y?.textContent) ?? "").trim();
      }
    }), (y, _) => (E(), $(h(u), { value: { textValue: v.value } }, {
      default: O(() => [R(h(ne), {
        ref: h(a),
        role: "option",
        "aria-labelledby": h(p),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": h(s) || void 0,
        "data-disabled": h(s) ? "" : void 0,
        tabindex: h(s) ? void 0 : -1,
        as: y.as,
        "as-child": y.asChild,
        onFocus: _[0] || (_[0] = (C) => d.value = !0),
        onBlur: _[1] || (_[1] = (C) => d.value = !1),
        onPointerup: g,
        onPointerdown: _[2] || (_[2] = (C) => {
          C.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: _[3] || (_[3] = Fe(() => {
        }, ["prevent", "stop"])),
        onPointermove: x,
        onPointerleave: b,
        onKeydown: w
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
}), dc = cc, fc = /* @__PURE__ */ F({
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
    return (i, s) => h(t).isSelected.value ? (E(), $(h(ne), Q({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: O(() => [V(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), pc = fc, hc = /* @__PURE__ */ F({
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
    }), (l, u) => (E(), $(h(ne), Q({
      id: h(s).textId,
      ref: h(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: O(() => [V(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), vc = hc, mc = /* @__PURE__ */ F({
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
    return (t, i) => (E(), $(h(vs), In(Dn(e)), {
      default: O(() => [V(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), gc = mc, yc = /* @__PURE__ */ F({
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
    const { getItems: r } = He(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = qn();
    function c() {
      o.value || (t.onOpenChange(!0), u());
    }
    function d(v) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(v.pageX),
        y: Math.round(v.pageY)
      };
    }
    return (v, p) => (E(), $(h(vl), {
      "as-child": "",
      reference: v.reference
    }, {
      default: O(() => [R(h(ne), {
        ref: h(i),
        role: "combobox",
        type: v.as === "button" ? "button" : void 0,
        "aria-controls": h(t).contentId,
        "aria-expanded": h(t).open.value || !1,
        "aria-required": h(t).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: h(t)?.dir.value,
        "data-state": h(t)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": h(Nu)(h(t).modelValue?.value) ? "" : void 0,
        "as-child": v.asChild,
        as: v.as,
        onClick: p[0] || (p[0] = (f) => {
          f?.currentTarget?.focus();
        }),
        onPointerdown: p[1] || (p[1] = (f) => {
          if (f.pointerType === "touch") return f.preventDefault();
          const g = f.target;
          g.hasPointerCapture(f.pointerId) && g.releasePointerCapture(f.pointerId), f.button === 0 && f.ctrlKey === !1 && (d(f), f.preventDefault());
        }),
        onPointerup: p[2] || (p[2] = Fe((f) => {
          f.pointerType === "touch" && d(f);
        }, ["prevent"])),
        onKeydown: p[3] || (p[3] = (f) => {
          const g = h(a) !== "";
          !(f.ctrlKey || f.altKey || f.metaKey) && f.key.length === 1 && g && f.key === " " || (h(l)(f.key, h(r)()), h(Fu).includes(f.key) && (c(), f.preventDefault()));
        })
      }, {
        default: O(() => [V(v.$slots, "default")]),
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
}), bc = yc, wc = /* @__PURE__ */ F({
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
    return (a, l) => (E(), $(h(ne), {
      ref: h(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: O(() => [V(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: h(s).modelValue.value
      }, () => [ae(X(r.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Sc = wc, Cc = /* @__PURE__ */ F({
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
    const e = n, { nonce: t } = ct(e), i = qu(t), s = Qt(), o = s.position === "item-aligned" ? Zu() : void 0, { forwardRef: r, currentElement: a } = ie();
    se(() => {
      s?.onViewportChange(a.value);
    });
    const l = P(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: v, contentWrapper: p } = o ?? {};
      if (v?.value && p?.value) {
        const f = Math.abs(l.value - d.scrollTop);
        if (f > 0) {
          const g = window.innerHeight - Ce * 2, m = Number.parseFloat(p.value.style.minHeight), x = Number.parseFloat(p.value.style.height), b = Math.max(m, x);
          if (b < g) {
            const w = b + f, y = Math.min(g, w), _ = w - y;
            p.value.style.height = `${y}px`, p.value.style.bottom === "0px" && (d.scrollTop = _ > 0 ? _ : 0, p.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (E(), W(ge, null, [R(h(ne), Q({
      ref: h(r),
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
    }, 16), R(h(ne), {
      as: "style",
      nonce: h(i)
    }, {
      default: O(() => d[0] || (d[0] = [ae(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), xc = Cc;
const _c = /* @__PURE__ */ F({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, i = P(), s = P([]);
    return se(() => {
      const o = i.value?.closest(".speaker-sidebar");
      o && (s.value = [o]);
    }), (o, r) => (E(), W("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: i
    }, [
      R(h(Vu), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (a) => t("update:selectedValue", a))
      }, {
        default: O(() => [
          R(h(bc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: O(() => [
              R(h(Sc), { class: "sidebar-select-trigger-label" }),
              R(h(lc), null, {
                default: O(() => [
                  R(h(Ao), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          R(h(gc), { disabled: "" }, {
            default: O(() => [
              R(h(rc), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": s.value
              }, {
                default: O(() => [
                  R(h(xc), null, {
                    default: O(() => [
                      (E(!0), W(ge, null, Ye(n.items, (a) => (E(), $(h(dc), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: O(() => [
                          R(h(pc), { class: "sidebar-select-item-indicator" }, {
                            default: O(() => [
                              R(h(Rn), { size: 14 })
                            ]),
                            _: 1
                          }),
                          R(h(vc), null, {
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
}), Ec = { class: "sidebar-select" }, kc = ["aria-label"], Tc = { class: "sidebar-select-trigger-label" }, Pc = /* @__PURE__ */ F({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, s = P(!1), o = T(
      () => t.items.find((a) => a.value === t.selectedValue)?.label ?? ""
    );
    function r(a) {
      i("update:selectedValue", a), s.value = !1;
    }
    return (a, l) => (E(), W("div", Ec, [
      N("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (u) => s.value = !0)
      }, [
        N("span", Tc, X(o.value), 1)
      ], 8, kc),
      R(h(as), {
        open: s.value,
        "onUpdate:open": l[2] || (l[2] = (u) => s.value = u)
      }, {
        default: O(() => [
          R(h(ms), { disabled: "" }, {
            default: O(() => [
              R(h(hs), { class: "editor-overlay" }),
              R(h(ps), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: O(() => [
                  R(h(gs), { class: "sr-only" }, {
                    default: O(() => [
                      ae(X(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = N("div", { class: "sheet-handle" }, null, -1)),
                  R(h(Pu), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (u) => r(u))
                  }, {
                    default: O(() => [
                      R(h(Ou), { class: "sheet-list" }, {
                        default: O(() => [
                          (E(!0), W(ge, null, Ye(n.items, (u) => (E(), $(h(Mu), {
                            key: u.value,
                            value: u.value,
                            class: "sheet-item"
                          }, {
                            default: O(() => [
                              R(h(Bu), { class: "sheet-item-indicator" }, {
                                default: O(() => [
                                  R(h(Rn), { size: 16 })
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
}), Kn = /* @__PURE__ */ F({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Ji();
    return (s, o) => h(i) ? (E(), $(Pc, Q({ key: 0 }, s.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (r) => t("update:selectedValue", r))
    }), null, 16)) : (E(), $(_c, Q({ key: 1 }, s.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (r) => t("update:selectedValue", r))
    }), null, 16));
  }
}), Rs = /* @__PURE__ */ F({
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
    return (r, a) => (E(), $(Kn, {
      items: o.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: h(s)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Ac = { class: "speaker-sidebar" }, Oc = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Ic = { class: "sidebar-title" }, Dc = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Lc = { class: "sidebar-title" }, Rc = {
  key: 2,
  class: "sidebar-section"
}, Mc = { class: "sidebar-title" }, $c = { class: "subtitle-toggle" }, Bc = { class: "subtitle-toggle-label" }, qc = { class: "subtitle-slider" }, Fc = { class: "subtitle-slider-label" }, zc = { class: "subtitle-slider-value" }, Nc = ["value", "disabled"], Wc = {
  key: 3,
  class: "sidebar-section"
}, Hc = { class: "sidebar-title" }, Vc = { class: "speaker-list" }, jc = { class: "speaker-name" }, Uc = /* @__PURE__ */ F({
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
    const e = n, t = Je(), { t: i, locale: s } = we(), o = T(
      () => Hi(e.translations, s.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (r, a) => (E(), W("aside", Ac, [
      n.channels.length > 1 ? (E(), W("section", Oc, [
        N("h2", Ic, X(h(i)("sidebar.channel")), 1),
        R(Rs, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => r.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (E(), W("section", Dc, [
        N("h2", Lc, X(h(i)("sidebar.translation")), 1),
        R(Kn, {
          items: o.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: h(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => r.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      h(t).subtitle ? (E(), W("section", Rc, [
        N("h2", Mc, X(h(i)("sidebar.subtitle")), 1),
        N("div", $c, [
          N("span", Bc, X(h(i)("subtitle.show")), 1),
          R(Hr, {
            modelValue: h(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => h(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        N("label", qc, [
          N("span", Fc, [
            ae(X(h(i)("subtitle.fontSize")) + " ", 1),
            N("span", zc, X(h(t).subtitle.fontSize.value) + "px", 1)
          ]),
          N("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: h(t).subtitle.fontSize.value,
            disabled: !h(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => h(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, Nc)
        ])
      ])) : K("", !0),
      n.speakers.length ? (E(), W("section", Wc, [
        N("h2", Hc, X(h(i)("sidebar.speakers")), 1),
        N("ul", Vc, [
          (E(!0), W(ge, null, Ye(n.speakers, (l) => (E(), W("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            R(Xi, {
              color: l.color
            }, null, 8, ["color"]),
            N("span", jc, X(l.name), 1)
          ]))), 128))
        ])
      ])) : K("", !0)
    ]));
  }
}), Pi = /* @__PURE__ */ re(Uc, [["__scopeId", "data-v-0a4624c1"]]), Kc = /* @__PURE__ */ F({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = no(n, "open"), { t } = we();
    return (i, s) => (E(), $(h(as), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (o) => e.value = o)
    }, {
      default: O(() => [
        R(h(ms), { disabled: "" }, {
          default: O(() => [
            R(h(hs), { class: "editor-overlay" }),
            R(h(ps), { class: "sidebar-drawer" }, {
              default: O(() => [
                R(h(gs), { class: "sr-only" }, {
                  default: O(() => [
                    ae(X(h(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                R(h(Aa), {
                  class: "sidebar-close",
                  "aria-label": h(t)("header.closeSidebar")
                }, {
                  default: O(() => [
                    R(h(Mn), { size: 20 })
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
}), Xc = { class: "player-controls" }, Yc = { class: "controls-left" }, Gc = { class: "controls-time" }, Jc = { class: "time-display" }, Zc = { class: "time-display" }, Qc = { class: "controls-right" }, ed = ["value", "aria-label", "disabled"], td = /* @__PURE__ */ F({
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
    const t = e, { t: i } = we(), s = P(!1);
    function o(r) {
      const a = r.target;
      t("update:volume", parseFloat(a.value));
    }
    return (r, a) => (E(), W("div", Xc, [
      N("div", Yc, [
        R(me, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": h(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: O(() => [
            R(h(Mo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        R(me, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? h(i)("player.pause") : h(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: O(() => [
            n.isPlaying ? (E(), $(h(Do), {
              key: 0,
              size: 20
            })) : (E(), $(h(Lo), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        R(me, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": h(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: O(() => [
            R(h($o), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      N("div", Gc, [
        N("time", Jc, X(n.currentTime), 1),
        a[7] || (a[7] = N("span", { class: "time-separator" }, "/", -1)),
        N("time", Zc, X(n.duration), 1)
      ]),
      N("div", Qc, [
        N("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => s.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => s.value = !1)
        }, [
          R(me, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? h(i)("player.unmute") : h(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: O(() => [
              n.isMuted ? (E(), $(h(Fo), {
                key: 0,
                size: 16
              })) : (E(), $(h(qo), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          io(N("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": h(i)("player.volume"),
            disabled: !n.isReady,
            onInput: o
          }, null, 40, ed), [
            [so, s.value]
          ])
        ], 32),
        R(me, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": h(i)("player.speed"),
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
}), nd = /* @__PURE__ */ re(td, [["__scopeId", "data-v-02ebaa64"]]);
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
function Ms(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, s] of Object.entries(e)) if (i === "children" && s) for (const [o, r] of Object.entries(s)) r instanceof Node ? t.appendChild(r) : typeof r == "string" ? t.appendChild(document.createTextNode(r)) : t.appendChild(Ms(o, r));
  else i === "style" ? Object.assign(t.style, s) : i === "textContent" ? t.textContent = s : t.setAttribute(i, s.toString());
  return t;
}
function Ai(n, e, t) {
  const i = Ms(n, e || {});
  return t?.appendChild(i), i;
}
var id = Object.freeze({ __proto__: null, createElement: Ai, default: Ai });
const sd = { fetchBlob: function(n, e, t) {
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
class od extends Tt {
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
function rd({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: s = 0, barAlign: o }) {
  let r = Math.round(n * t * i), a = r + Math.round(e * t * i) || 1;
  return a < s && (a = s, o || (r = a / 2)), { topHeight: r, totalHeight: a };
}
function ad({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: s }) {
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
function ld(n) {
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
class ud extends Tt {
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
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = ld(this.scrollContainer);
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
        let p = v.clientX, f = v.clientY, g = !1;
        const m = Date.now(), x = t.getBoundingClientRect(), { left: b, top: w } = x, y = (A) => {
          if (A.defaultPrevented || l.size > 1 || u && Date.now() - m < r) return;
          const k = A.clientX, L = A.clientY, M = k - p, z = L - f;
          (g || Math.abs(M) > s || Math.abs(z) > s) && (A.preventDefault(), A.stopPropagation(), g || (a.set({ type: "start", x: p - b, y: f - w }), g = !0), a.set({ type: "move", x: k - b, y: L - w, deltaX: M, deltaY: z }), p = k, f = L);
        }, _ = (A) => {
          if (l.delete(A.pointerId), g) {
            const k = A.clientX, L = A.clientY;
            a.set({ type: "end", x: k - b, y: L - w });
          }
          c();
        }, C = (A) => {
          l.delete(A.pointerId), A.relatedTarget && A.relatedTarget !== document.documentElement || _(A);
        }, S = (A) => {
          g && (A.stopPropagation(), A.preventDefault());
        }, I = (A) => {
          A.defaultPrevented || l.size > 1 || g && A.preventDefault();
        };
        document.addEventListener("pointermove", y), document.addEventListener("pointerup", _), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", I, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", y), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", I), setTimeout((() => {
            document.removeEventListener("click", S, { capture: !0 });
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
    const { width: o, height: r } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: v } = (function({ width: f, height: g, length: m, options: x, pixelRatio: b }) {
      const w = g / 2, y = x.barWidth ? x.barWidth * b : 1, _ = x.barGap ? x.barGap * b : x.barWidth ? y / 2 : 0, C = y + _ || 1;
      return { halfHeight: w, barWidth: y, barGap: _, barRadius: x.barRadius || 0, barMinHeight: x.barMinHeight ? x.barMinHeight * b : 0, barIndexScale: m > 0 ? f / C / m : 0, barSpacing: C };
    })({ width: o, height: r, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: f, barIndexScale: g, barSpacing: m, barWidth: x, halfHeight: b, vScale: w, canvasHeight: y, barAlign: _, barMinHeight: C }) {
      const S = f[0] || [], I = f[1] || S, A = S.length, k = [];
      let L = 0, M = 0, z = 0;
      for (let D = 0; D <= A; D++) {
        const B = Math.round(D * g);
        if (B > L) {
          const { topHeight: G, totalHeight: ee } = rd({ maxTop: M, maxBottom: z, halfHeight: b, vScale: w, barMinHeight: C, barAlign: _ }), de = ad({ barAlign: _, halfHeight: b, topHeight: G, totalHeight: ee, canvasHeight: y });
          k.push({ x: L * m, y: de, width: x, height: ee }), L = B, M = 0, z = 0;
        }
        const Y = Math.abs(S[D] || 0), j = Math.abs(I[D] || 0);
        Y > M && (M = Y), j > z && (z = j);
      }
      return k;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: s, canvasHeight: r, barAlign: t.barAlign, barMinHeight: v });
    i.beginPath();
    for (const f of p) u && "roundRect" in i ? i.roundRect(f.x, f.y, f.width, f.height, u) : i.rect(f.x, f.y, f.width, f.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, s) {
    const { width: o, height: r } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const v = c / 2, p = l[0] || [];
      return [p, l[1] || p].map(((f, g) => {
        const m = f.length, x = m ? u / m : 0, b = v, w = g === 0 ? -1 : 1, y = [{ x: 0, y: b }];
        let _ = 0, C = 0;
        for (let S = 0; S <= m; S++) {
          const I = Math.round(S * x);
          if (I > _) {
            const k = b + (Math.round(C * v * d) || 1) * w;
            y.push({ x: _, y: k }), _ = I, C = 0;
          }
          const A = Math.abs(f[S] || 0);
          A > C && (C = A);
        }
        return y.push({ x: _, y: b }), y;
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
      if (!l) for (let p = 0; p < d.length; p++) {
        const f = (u = d[p]) !== null && u !== void 0 ? u : 0, g = Math.abs(f);
        g > v && (v = g);
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
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: f, totalWidth: g, options: m }) {
      return Ii(Math.min(8e3, f, g), m);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const v = (f) => {
      if (f < 0 || f >= p || d[f]) return;
      d[f] = !0;
      const g = f * c;
      let m = Math.min(u - g, c);
      if (m = Ii(m, t), m <= 0) return;
      const x = (function({ channelData: b, offset: w, clampedWidth: y, totalWidth: _ }) {
        return b.map(((C) => {
          const S = Math.floor(w / _ * C.length), I = Math.floor((w + y) / _ * C.length);
          return C.slice(S, I);
        }));
      })({ channelData: e, offset: g, clampedWidth: m, totalWidth: u });
      this.renderSingleCanvas(x, t, m, s, g, o, r);
    }, p = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let f = 0; f < p; f++) v(f);
      return;
    }
    if (Di({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: p }).forEach(((f) => v(f))), p > 1) {
      const f = this.on("scroll", (() => {
        const { scrollLeft: g } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", r.innerHTML = "", d = {}), Di({ scrollLeft: g, totalWidth: u, numCanvases: p }).forEach(((m) => v(m)));
      }));
      this.unsubscribeOnScroll.push(f);
    }
  }
  renderChannel(e, t, i, s) {
    var { overlay: o } = t, r = (function(c, d) {
      var v = {};
      for (var p in c) Object.prototype.hasOwnProperty.call(c, p) && d.indexOf(p) < 0 && (v[p] = c[p]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var f = 0;
        for (p = Object.getOwnPropertySymbols(c); f < p.length; f++) d.indexOf(p[f]) < 0 && Object.prototype.propertyIsEnumerable.call(c, p[f]) && (v[p[f]] = c[p[f]]);
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
      const i = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: r, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: v, pixelRatio: p }) {
        const f = Math.ceil(u * c), g = f > d, m = !!(v && !g);
        return { scrollWidth: f, isScrollable: g, useParentWidth: m, width: (m ? d : f) * p };
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
class cd extends Tt {
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
const dd = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Ct extends od {
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
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, dd, e);
    const { state: i, actions: s } = (function(a) {
      var l, u, c, d, v, p;
      const f = (l = a?.currentTime) !== null && l !== void 0 ? l : te(0), g = (u = a?.duration) !== null && u !== void 0 ? u : te(0), m = (c = a?.isPlaying) !== null && c !== void 0 ? c : te(!1), x = (d = a?.isSeeking) !== null && d !== void 0 ? d : te(!1), b = (v = a?.volume) !== null && v !== void 0 ? v : te(1), w = (p = a?.playbackRate) !== null && p !== void 0 ? p : te(1), y = te(null), _ = te(null), C = te(""), S = te(0), I = te(0), A = Ke((() => !m.value), [m]), k = Ke((() => y.value !== null), [y]), L = Ke((() => k.value && g.value > 0), [k, g]), M = Ke((() => f.value), [f]), z = Ke((() => g.value > 0 ? f.value / g.value : 0), [f, g]);
      return { state: { currentTime: f, duration: g, isPlaying: m, isPaused: A, isSeeking: x, volume: b, playbackRate: w, audioBuffer: y, peaks: _, url: C, zoom: S, scrollPosition: I, canPlay: k, isReady: L, progress: M, progressPercent: z }, actions: { setCurrentTime: (D) => {
        const B = Math.max(0, Math.min(g.value || 1 / 0, D));
        f.set(B);
      }, setDuration: (D) => {
        g.set(Math.max(0, D));
      }, setPlaying: (D) => {
        m.set(D);
      }, setSeeking: (D) => {
        x.set(D);
      }, setVolume: (D) => {
        const B = Math.max(0, Math.min(1, D));
        b.set(B);
      }, setPlaybackRate: (D) => {
        const B = Math.max(0.1, Math.min(16, D));
        w.set(B);
      }, setAudioBuffer: (D) => {
        y.set(D), D && g.set(D.duration);
      }, setPeaks: (D) => {
        _.set(D);
      }, setUrl: (D) => {
        C.set(D);
      }, setZoom: (D) => {
        S.set(Math.max(0, D));
      }, setScrollPosition: (D) => {
        I.set(Math.max(0, D));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = s, this.timer = new cd();
    const o = t ? void 0 : this.getMediaElement();
    this.renderer = new ud(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
        t = yield sd.fetchBlob(e, l, a);
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
        for (let p = 0; p < d.length; p++) {
          const f = d[p];
          Math.abs(f) > Math.abs(v) && (v = f);
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
}, Ct.dom = id;
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
class fd extends qs {
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
function Mt(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, s = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), s.forEach(((o) => o()));
  };
}
function it(n, e) {
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
    let d = c.clientX, v = c.clientY, p = !1;
    const f = Date.now(), g = n.getBoundingClientRect(), { left: m, top: x } = g, b = (S) => {
      if (S.defaultPrevented || r.size > 1 || a && Date.now() - f < s) return;
      const I = S.clientX, A = S.clientY, k = I - d, L = A - v;
      (p || Math.abs(k) > t || Math.abs(L) > t) && (S.preventDefault(), S.stopPropagation(), p || (o.set({ type: "start", x: d - m, y: v - x }), p = !0), o.set({ type: "move", x: I - m, y: A - x, deltaX: k, deltaY: L }), d = I, v = A);
    }, w = (S) => {
      if (r.delete(S.pointerId), p) {
        const I = S.clientX, A = S.clientY;
        o.set({ type: "end", x: I - m, y: A - x });
      }
      l();
    }, y = (S) => {
      r.delete(S.pointerId), S.relatedTarget && S.relatedTarget !== document.documentElement || w(S);
    }, _ = (S) => {
      p && (S.stopPropagation(), S.preventDefault());
    }, C = (S) => {
      S.defaultPrevented || r.size > 1 || p && S.preventDefault();
    };
    document.addEventListener("pointermove", b), document.addEventListener("pointerup", w), document.addEventListener("pointerout", y), document.addEventListener("pointercancel", y), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", w), document.removeEventListener("pointerout", y), document.removeEventListener("pointercancel", y), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", _, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: o, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), r.clear(), Ue(o);
  } };
}
class Li extends qs {
  constructor(e, t, i = 0) {
    var s, o, r, a, l, u, c, d, v, p;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (r = e.resize) === null || r === void 0 || r, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (v = e.channelIdx) !== null && v !== void 0 ? v : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ht("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = ht("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = $t(i, { threshold: 1 }), r = $t(s, { threshold: 1 }), a = Mt((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [o.signal]), l = Mt((() => {
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
    const t = it(e, "click"), i = it(e, "mouseenter"), s = it(e, "mouseleave"), o = it(e, "dblclick"), r = it(e, "pointerdown"), a = it(e, "pointerup"), l = t.subscribe(((m) => m && this.emit("click", m))), u = i.subscribe(((m) => m && this.emit("over", m))), c = s.subscribe(((m) => m && this.emit("leave", m))), d = o.subscribe(((m) => m && this.emit("dblclick", m))), v = r.subscribe(((m) => m && this.toggleCursor(!0))), p = a.subscribe(((m) => m && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), v(), p(), Ue(t), Ue(i), Ue(s), Ue(o), Ue(r), Ue(a);
    }));
    const f = $t(e), g = Mt((() => {
      const m = f.signal.value;
      m && (m.type === "start" ? this.toggleCursor(!0) : m.type === "move" && m.deltaX !== void 0 ? this.onMove(m.deltaX) : m.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [f.signal]);
    this.subscriptions.push((() => {
      g(), f.cleanup();
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
class Xn extends fd {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Xn(e);
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
    const l = $t(s, { threshold: t }), u = Mt((() => {
      var c, d;
      const v = l.signal.value;
      if (v) if (v.type === "start") {
        if (r = v.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), f = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: g } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = r / g * p;
        const m = v.x / g * p, x = (v.x + 5) / g * p;
        o = new Li(Object.assign(Object.assign({}, e), { start: m, end: x }), p, f), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
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
function pd(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: s } = n, o = rt(null), r = rt(null), a = P(0), l = P(0), u = P(!1), c = P(!1), d = P(!1), v = P(1), p = P(1), f = P(!1), g = T(() => yt(a.value)), m = T(() => yt(l.value));
  function x(D, B) {
    M(), d.value = !0, c.value = !1;
    const Y = Xn.create();
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
      renderFunction: So,
      url: B,
      plugins: [Y]
    });
    j.on("ready", () => {
      c.value = !0, d.value = !1, l.value = j.getDuration(), b();
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
  function b() {
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
          color: yo(j, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", j);
      }
    }
  }
  function w() {
    o.value?.play();
  }
  function y() {
    o.value?.pause();
  }
  function _() {
    o.value?.playPause();
  }
  function C(D) {
    const B = o.value;
    !B || l.value === 0 || B.setTime(D);
  }
  function S(D) {
    C(Math.max(0, Math.min(a.value + D, l.value)));
  }
  function I(D) {
    const B = o.value;
    B && (v.value = D, B.setVolume(D), D > 0 && f.value && (f.value = !1, B.setMuted(!1)));
  }
  function A() {
    const D = o.value;
    D && (f.value = !f.value, D.setMuted(f.value));
  }
  function k(D) {
    const B = o.value;
    B && (p.value = D, B.setPlaybackRate(D));
  }
  function L() {
    const B = (vn.indexOf(
      p.value
    ) + 1) % vn.length;
    k(vn[B] ?? 1);
  }
  function M() {
    z !== null && (clearTimeout(z), z = null), o.value && (o.value.destroy(), o.value = null, r.value = null);
  }
  Z(
    [e, t],
    ([D, B]) => {
      D && B && x(D, B);
    },
    { immediate: !0 }
  );
  let z = null;
  return Z([i, s], () => {
    c.value && (z !== null && clearTimeout(z), z = setTimeout(() => {
      z = null, b();
    }, 150));
  }), lt(() => {
    M();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: v,
    playbackRate: p,
    isMuted: f,
    formattedCurrentTime: g,
    formattedDuration: m,
    play: w,
    pause: y,
    togglePlay: _,
    seekTo: C,
    skip: S,
    setVolume: I,
    setPlaybackRate: k,
    cyclePlaybackRate: L,
    toggleMute: A
  };
}
const hd = { class: "audio-player" }, vd = /* @__PURE__ */ F({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, s = t, o = P(null), {
      isPlaying: r,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: v,
      formattedCurrentTime: p,
      formattedDuration: f,
      togglePlay: g,
      seekTo: m,
      pause: x,
      skip: b,
      setVolume: w,
      cyclePlaybackRate: y,
      toggleMute: _
    } = pd({
      containerRef: o,
      audioSrc: Lt(() => i.audioSrc),
      turns: Lt(() => i.turns),
      speakers: Lt(() => i.speakers)
    });
    return Z(v, (C) => s("timeupdate", C)), Z(r, (C) => s("playStateChange", C)), e({ seekTo: m, pause: x }), (C, S) => (E(), W("footer", hd, [
      N("div", {
        ref_key: "waveformRef",
        ref: o,
        class: mt(["waveform-container", { "waveform-container--loading": h(l) }])
      }, null, 2),
      R(nd, {
        "is-playing": h(r),
        "current-time": h(p),
        duration: h(f),
        volume: h(u),
        "playback-rate": h(c),
        "is-muted": h(d),
        "is-ready": h(a),
        onTogglePlay: h(g),
        onSkipBack: S[0] || (S[0] = (I) => h(b)(-10)),
        onSkipForward: S[1] || (S[1] = (I) => h(b)(10)),
        "onUpdate:volume": h(w),
        onToggleMute: h(_),
        onCyclePlaybackRate: h(y)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), md = /* @__PURE__ */ re(vd, [["__scopeId", "data-v-9248e45e"]]);
class gd {
  diff(e, t, i = {}) {
    let s;
    typeof i == "function" ? (s = i, i = {}) : "callback" in i && (s = i.callback);
    const o = this.castInput(e, i), r = this.castInput(t, i), a = this.removeEmpty(this.tokenize(o, i)), l = this.removeEmpty(this.tokenize(r, i));
    return this.diffWithOptionsObj(a, l, i, s);
  }
  diffWithOptionsObj(e, t, i, s) {
    var o;
    const r = (b) => {
      if (b = this.postProcess(b, i), s) {
        setTimeout(function() {
          s(b);
        }, 0);
        return;
      } else
        return b;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (o = i.timeout) !== null && o !== void 0 ? o : 1 / 0, v = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let f = this.extractCommon(p[0], t, e, 0, i);
    if (p[0].oldPos + 1 >= l && f + 1 >= a)
      return r(this.buildValues(p[0].lastComponent, t, e));
    let g = -1 / 0, m = 1 / 0;
    const x = () => {
      for (let b = Math.max(g, -u); b <= Math.min(m, u); b += 2) {
        let w;
        const y = p[b - 1], _ = p[b + 1];
        y && (p[b - 1] = void 0);
        let C = !1;
        if (_) {
          const I = _.oldPos - b;
          C = _ && 0 <= I && I < a;
        }
        const S = y && y.oldPos + 1 < l;
        if (!C && !S) {
          p[b] = void 0;
          continue;
        }
        if (!S || C && y.oldPos < _.oldPos ? w = this.addToPath(_, !0, !1, 0, i) : w = this.addToPath(y, !1, !0, 1, i), f = this.extractCommon(w, t, e, b, i), w.oldPos + 1 >= l && f + 1 >= a)
          return r(this.buildValues(w.lastComponent, t, e)) || !0;
        p[b] = w, w.oldPos + 1 >= l && (m = Math.min(m, b - 1)), f + 1 >= a && (g = Math.max(g, b + 1));
      }
      u++;
    };
    if (s)
      (function b() {
        setTimeout(function() {
          if (u > c || Date.now() > v)
            return s(void 0);
          x() || b();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= v; ) {
        const b = x();
        if (b)
          return b;
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
          d = d.map(function(v, p) {
            const f = i[u + p];
            return f.length > v.length ? f : v;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return s;
  }
}
class yd extends gd {
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
const bd = new yd();
function wd(n, e, t) {
  return bd.diff(n, e, t);
}
function mn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), o = t.split(" "), r = wd(s, o, {
    comparator: Cd
  }), a = Sd(r), l = [...e];
  let u = [...e], c = 0;
  for (const p of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in p && p.replaced)
      u = Bt(
        u,
        l[0],
        p.countAdded - p.countRemoved
      ), c += p.countRemoved;
    else if ("removed" in p && p.removed) {
      const f = p;
      c += f.count, u = Bt(
        u,
        l[0],
        -f.count
      );
    } else if ("added" in p && p.added) {
      const f = p;
      u = Bt(
        u,
        l[0],
        f.count
      );
    } else
      c += p.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, v = o.slice(d).join(" ");
  if (i(v)) {
    const f = Ns(
      v,
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
function Sd(n) {
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
function Cd(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(t.length, i.length);
  let o = 0;
  for (let a = 0; a < s; a++)
    t[a] === i[a] && o++;
  return o / t.length > 0.8;
}
class xd {
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
class _d extends xd {
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
  const e = Je();
  let t = null;
  se(() => {
    n.canvasRef.value && (t = new _d(n.canvasRef.value, {
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
const Ed = ["height"], kd = /* @__PURE__ */ F({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Je(), t = gt("canvas"), i = T(() => e.subtitle?.fontSize.value ?? 40), s = T(() => 1.2 * i.value), o = T(() => 2.4 * i.value);
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
      }, null, 8, Ed)
    ], 4));
  }
}), Td = /* @__PURE__ */ re(kd, [["__scopeId", "data-v-30da75ad"]]), Pd = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Ad = ["aria-label"], Od = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Id = /* @__PURE__ */ F({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Je(), { t } = we(), i = gt("container"), s = gt("canvas"), o = T(() => e.subtitle?.fontSize.value ?? 48), r = T(() => 1.2 * o.value);
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
    }), (u, c) => (E(), W("div", Pd, [
      N("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": h(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        R(h(Mn), { size: 24 })
      ], 8, Ad),
      N("canvas", Od, null, 512)
    ], 512));
  }
}), Dd = /* @__PURE__ */ re(Id, [["__scopeId", "data-v-442e31fd"]]), Ld = { class: "editor-layout" }, Rd = { class: "editor-body" }, Md = {
  key: 4,
  class: "mobile-selectors"
}, $d = /* @__PURE__ */ F({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Je(), { t: i, locale: s } = we(), { isMobile: o } = Ji(), r = P(!1), a = T(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), l = t.speakers.all;
    fr(a, l, t);
    const u = T(() => [...t.channels.values()]), c = T(() => [
      ...t.activeChannel.value.translations.values()
    ]), d = T(
      () => t.activeChannel.value.activeTranslation.value.id
    ), v = T(() => Array.from(l.values())), p = gt("audioPlayer");
    function f(b) {
      t.audio && (t.audio.currentTime.value = b);
    }
    Z(
      () => t.activeChannelId.value,
      () => {
        p.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), r.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((b) => p.value?.seekTo(b));
    const g = T(
      () => Hi(
        c.value,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function m(b) {
      t.setActiveChannel(b);
    }
    function x(b) {
      t.activeChannel.value.setActiveTranslation(b);
    }
    return (b, w) => (E(), W("div", Ld, [
      e.showHeader ? (E(), $(Qo, {
        key: 0,
        title: h(t).title.value,
        duration: h(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": h(o),
        onToggleSidebar: w[0] || (w[0] = (y) => r.value = !r.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      N("main", Rd, [
        R(qr, {
          turns: a.value,
          speakers: h(l)
        }, null, 8, ["turns", "speakers"]),
        h(o) ? K("", !0) : (E(), $(Pi, {
          key: 0,
          speakers: v.value,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": m,
          "onUpdate:selectedTranslationId": x
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        h(o) ? (E(), $(Kc, {
          key: 1,
          open: r.value,
          "onUpdate:open": w[1] || (w[1] = (y) => r.value = y)
        }, {
          default: O(() => [
            R(Pi, {
              speakers: v.value,
              channels: u.value,
              "selected-channel-id": h(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": m,
              "onUpdate:selectedTranslationId": x
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : K("", !0)
      ]),
      h(t).audio?.src.value ? (E(), $(md, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": h(t).audio.src.value,
        turns: a.value,
        speakers: h(l),
        onTimeupdate: f,
        onPlayStateChange: w[2] || (w[2] = (y) => {
          h(t).audio && (h(t).audio.isPlaying.value = y);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      h(t).subtitle?.isVisible.value && !h(o) && !h(t).subtitle.isFullscreen.value ? (E(), $(Td, { key: 2 })) : K("", !0),
      h(t).subtitle?.isFullscreen.value ? (E(), $(Dd, { key: 3 })) : K("", !0),
      h(o) && (u.value.length > 1 || c.value.length > 1) ? (E(), W("div", Md, [
        u.value.length > 1 ? (E(), $(Rs, {
          key: 0,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          "onUpdate:selectedChannelId": m
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (E(), $(Kn, {
          key: 1,
          items: g.value,
          "selected-value": d.value,
          ariaLabel: h(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": x
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), jd = /* @__PURE__ */ re($d, [["__scopeId", "data-v-52972a0f"]]);
function Ud() {
  return {
    name: "audio",
    install(n) {
      const e = P(0), t = P(!1);
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
function Ri(n) {
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
function Kd() {
  return {
    name: "live",
    install(n) {
      const e = rt(null), t = P(!1);
      t.value = !0;
      function i() {
        e.value = null, Gn(e);
      }
      function s(w, y) {
        if (n.activeChannelId.value !== y) return;
        const _ = n.activeChannel.value.activeTranslation.value;
        if (_.isSource) {
          if (w.text == null) return;
          e.value = w.text;
        } else if (w.translations) {
          const C = w.translations.find(
            (S) => S.translationId === _.id
          );
          e.value = C?.text ?? null;
        } else
          return;
        Gn(e);
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
      function l(w, y) {
        w.turns.value.some((C) => C.id === y.id) ? w.updateTurn(y.id, y) : w.addTurn(y);
      }
      function u(w, y) {
        w.speakerId && n.speakers.ensure(w.speakerId);
        const _ = n.channels.get(y);
        if (!_) {
          v();
          return;
        }
        if (w.text != null && l(
          _.sourceTranslation,
          Ri(w)
        ), w.translations)
          for (const S of w.translations) {
            const I = _.translations.get(S.translationId);
            I && l(
              I,
              gn(w, S)
            );
          }
        n.activeChannel.value.activeTranslation.value.isSource && v();
      }
      function c(w, y) {
        d([w], y);
      }
      function d(w, y) {
        const _ = n.channels.get(y);
        if (!_) return;
        const C = /* @__PURE__ */ new Set();
        for (const A of w)
          A.speakerId && !C.has(A.speakerId) && (C.add(A.speakerId), n.speakers.ensure(A.speakerId));
        const S = [];
        for (const A of w)
          A.text != null && S.push(Ri(A));
        S.length > 0 && _.sourceTranslation.prependTurns(S);
        const I = /* @__PURE__ */ new Map();
        for (const A of w)
          if (A.translations)
            for (const k of A.translations) {
              let L = I.get(k.translationId);
              L || (L = [], I.set(k.translationId, L)), L.push(gn(A, k));
            }
        for (const [A, k] of I) {
          const L = _.translations.get(A);
          L && L.prependTurns(k);
        }
      }
      function v() {
        a(), i();
      }
      function p(w) {
        const y = n.activeChannel.value.activeTranslation.value, _ = n.activeChannel.value;
        if (!w.final && y.languages.includes(w.language))
          e.value = w.text;
        else if (w.final) {
          const C = _.translations.get(w.language);
          C && l(
            C,
            gn({ ...w }, w)
          ), y.languages.includes(w.language) && v();
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
        v
      ), m = n.on(
        "translation:change",
        v
      ), x = n.on(
        "translation:sync",
        r
      ), b = n.on("channel:sync", r);
      return n.live = f, () => {
        v(), g(), m(), x(), b(), n.live = void 0;
      };
    }
  };
}
function Xd(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = P(n.fontSize ?? 40), i = P(!0), s = P(!1), o = {
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
function Bd(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function Yd(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.speakers)
    e.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: ""
    });
  const t = n.text.map((s) => {
    const o = s.words.map(Bd), r = o[0]?.startTime ?? s.stime, a = o.length > 0 ? o[o.length - 1].endTime ?? s.etime : s.etime;
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
function qd(n) {
  return {
    id: `w_${Hs++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function Gd(n) {
  Hs = 0;
  const e = /* @__PURE__ */ new Map();
  for (const o of n.segments)
    o.speaker && !e.has(o.speaker) && e.set(o.speaker, {
      id: o.speaker,
      name: o.speaker,
      color: ""
    });
  const t = n.language ?? "fr", i = n.segments.map((o, r) => {
    const a = o.words.map(qd);
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
  jd as EditorLayout,
  Ud as createAudioPlugin,
  zd as createEditorStore,
  Kd as createLivePlugin,
  Xd as createSubtitlePlugin,
  Yd as mapApiDocument,
  Gd as mapWhisperXDocument,
  Nd as provideEditorStore,
  Wd as provideI18n,
  Je as useEditorStore,
  wo as validateEditorDocument
};
