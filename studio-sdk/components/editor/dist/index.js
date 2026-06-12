import * as $t from "vue";
import { shallowReactive as Qe, shallowRef as Le, ref as I, computed as T, inject as Re, provide as Be, defineComponent as R, openBlock as w, createElementBlock as L, renderSlot as H, h as ce, createBlock as $, resolveDynamicComponent as ln, normalizeClass as ve, normalizeStyle as ze, useSlots as Kn, createCommentVNode as q, createTextVNode as ie, toDisplayString as N, createElementVNode as O, createVNode as W, withCtx as B, unref as f, watchEffect as me, onBeforeUnmount as ge, Fragment as ae, effectScope as un, getCurrentInstance as _e, getCurrentScope as Xn, onScopeDispose as Gn, watch as U, nextTick as de, toValue as oe, onMounted as ee, toHandlerKey as Yn, camelize as Jn, onUnmounted as Fe, toRefs as cn, Comment as Zn, mergeProps as Q, cloneVNode as Qn, reactive as dn, Teleport as ei, normalizeProps as ti, guardReactiveProps as ni, markRaw as ii, renderList as xe, withKeys as si, withModifiers as St, createStaticVNode as ri, useTemplateRef as $e, isMemoSame as ai, Transition as Ct, useId as hn, useModel as oi, withDirectives as li, vShow as ui, toRef as tt } from "vue";
function ci() {
  const i = /* @__PURE__ */ new Map();
  function e(r, a) {
    let o = i.get(r);
    return o || (o = /* @__PURE__ */ new Set(), i.set(r, o)), o.add(a), () => t(r, a);
  }
  function t(r, a) {
    i.get(r)?.delete(a);
  }
  function n(r, a) {
    i.get(r)?.forEach(
      (o) => o(a)
    );
  }
  function s() {
    i.clear();
  }
  return { on: e, off: t, emit: n, clear: s };
}
const At = [
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
function di(i, e, t) {
  const n = At[i.size % At.length];
  return { id: e, name: t, color: n };
}
function hi(i, e, t) {
  return !e || i.has(e) ? null : di(i, e, t ?? e);
}
function fi(i, e, t) {
  const n = i.get(e);
  return n ? { ...n, ...t } : null;
}
function pi(i) {
  const e = Qe(/* @__PURE__ */ new Map());
  function t(r, a) {
    const o = hi(e, r, a);
    o && (e.set(o.id, o), i("speaker:add", { speaker: o }));
  }
  function n(r, a) {
    const o = fi(e, r, a);
    o && (e.set(r, o), i("speaker:update", { speaker: o }));
  }
  function s() {
    e.clear();
  }
  return { all: e, ensure: t, update: n, clear: s };
}
function vi(i, e) {
  return [...i, e];
}
function mi(i, e) {
  return [...e, ...i];
}
function Et(i, e) {
  return i.findIndex((t) => t.id === e);
}
function gi(i, e, t) {
  const n = Et(i, e);
  if (n === -1) return null;
  const s = { ...i[n], ...t, id: e }, r = i.slice();
  return r[n] = s, { turns: r, updated: s };
}
function yi(i, e) {
  const t = Et(i, e);
  return t === -1 ? null : i.filter((n, s) => s !== t);
}
function bi(i, e, t) {
  const n = Et(i, e);
  if (n === -1) return null;
  const s = i[n], r = {
    ...s,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? s.startTime,
    endTime: t[t.length - 1]?.endTime ?? s.endTime
  }, a = i.slice();
  return a[n] = r, { turns: a, updated: r };
}
function vt(i, e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of i)
    n.speakerId && !t.has(n.speakerId) && (t.add(n.speakerId), e(n.speakerId));
}
function ki(i, e, t) {
  const { id: n, languages: s, isSource: r, audio: a } = i, o = Le(i.turns), u = /* @__PURE__ */ new Map();
  function l() {
    u.clear();
    const g = o.value;
    for (let b = 0; b < g.length; b++)
      u.set(g[b].id, b);
  }
  l();
  function c(g) {
    t(g.speakerId), u.set(g.id, o.value.length), o.value = vi(o.value, g), e("turn:add", { turn: g, translationId: n });
  }
  function d(g, b) {
    const _ = gi(o.value, g, b);
    _ && (o.value = _.turns, e("turn:update", { turn: _.updated, translationId: n }));
  }
  function p(g) {
    const b = yi(o.value, g);
    b && (o.value = b, l(), e("turn:remove", { turnId: g, translationId: n }));
  }
  function h(g, b) {
    const _ = bi(o.value, g, b);
    _ && (o.value = _.turns, e("turn:update", { turn: _.updated, translationId: n }));
  }
  function v(g) {
    vt(g, t), o.value = mi(o.value, g), l();
  }
  function y(g) {
    vt(g, t), o.value = g, l(), e("translation:sync", { translationId: n });
  }
  function m(g) {
    o.value = g, l();
  }
  function C(g) {
    const b = u.get(g.id);
    b !== void 0 ? o.value[b] = g : (u.set(g.id, o.value.length), o.value.push(g));
  }
  function k(g) {
    return u.has(g);
  }
  return { id: n, languages: s, isSource: r, audio: a, turns: o, addTurn: c, prependTurns: v, updateTurn: d, removeTurn: p, updateWords: h, setTurns: y, replaceTurns: m, updateOrCreateTurnSilent: C, hasTurn: k };
}
function Ot(i, e, t) {
  const { id: n, name: s, description: r, duration: a } = i, o = Qe(/* @__PURE__ */ new Map());
  let u;
  for (const y of i.translations) {
    const m = ki(y, e, t);
    o.set(y.id, m), y.isSource && !u && (u = m);
  }
  u || (u = o.values().next().value);
  const l = I(null), c = I(!1), d = I(!0), p = T(() => l.value ? o.get(l.value) ?? u : u);
  function h(y) {
    const m = y === u.id ? null : y;
    m !== l.value && (l.value = m, e("translation:change", { translationId: p.value.id }));
  }
  function v() {
    for (const y of o.values())
      y.setTurns([]);
    c.value = !1, d.value = !0, e("channel:reset", { channelId: n });
  }
  return {
    id: n,
    name: s,
    description: r,
    duration: a,
    translations: o,
    sourceTranslation: u,
    activeTranslation: p,
    isLoadingHistory: c,
    hasMoreHistory: d,
    setActiveTranslation: h,
    reset: v
  };
}
function wi(i) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [n, s] of i.speakers)
    e.add(n), t.push({ id: n, name: s.name });
  for (const n of i.channels)
    for (const s of n.translations)
      for (const r of s.turns)
        r.speakerId && !e.has(r.speakerId) && (e.add(r.speakerId), t.push({ id: r.speakerId, name: r.speakerId }));
  return t;
}
function Si(i, e) {
  const t = i.replace("#", ""), n = parseInt(t.substring(0, 2), 16), s = parseInt(t.substring(2, 4), 16), r = parseInt(t.substring(4, 6), 16);
  return `rgba(${n}, ${s}, ${r}, ${e})`;
}
function Tt(i, e, t = "*", n = !0) {
  if (i === "*") return t;
  const s = n ? i.split("-")[0] ?? i : i;
  try {
    const r = new Intl.DisplayNames([e], { type: "language" });
    return r.of(s) ?? r.of(i.split("-")[0] ?? i) ?? i;
  } catch {
    return i;
  }
}
function Ci(i, e, t, n = "*") {
  return [...i].sort(
    (r, a) => Number(a.isSource) - Number(r.isSource)
  ).map((r) => ({
    value: r.id,
    label: r.isSource ? t : r.languages.map((a) => Tt(a, e, n, !1)).join(", ")
  }));
}
function Ei(i, e = 250) {
  let t = !1, n = null;
  return (...s) => {
    if (t) {
      n = s;
      return;
    }
    t = !0, i(...s), setTimeout(() => {
      if (t = !1, n !== null) {
        const r = n;
        n = null, i(...r);
      }
    }, e);
  };
}
function Ae(i) {
  const e = Math.floor(i), t = Math.floor(e / 3600), n = Math.floor(e % 3600 / 60), s = e % 60, r = String(n).padStart(2, "0"), a = String(s).padStart(2, "0");
  return t > 0 ? `${t}:${r}:${a}` : `${r}:${a}`;
}
function Ti(i, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(i * 1e3));
}
class Z extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function _i(i) {
  if (i == null || typeof i != "object")
    throw new Z("document", "must be a non-null object");
  const e = i;
  if (typeof e.title != "string")
    throw new Z("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Z("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Z("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const n = e.channels[t], s = `channels[${t}]`;
    if (n == null || typeof n != "object")
      throw new Z(s, "must be a non-null object");
    if (typeof n.id != "string")
      throw new Z(`${s}.id`, "must be a string");
    if (typeof n.name != "string")
      throw new Z(`${s}.name`, "must be a string");
    if (typeof n.duration != "number")
      throw new Z(`${s}.duration`, "must be a number");
    if (!Array.isArray(n.translations))
      throw new Z(`${s}.translations`, "must be an array");
    for (let r = 0; r < n.translations.length; r++) {
      const a = n.translations[r], o = `${s}.translations[${r}]`;
      if (a == null || typeof a != "object")
        throw new Z(o, "must be a non-null object");
      if (typeof a.id != "string")
        throw new Z(`${o}.id`, "must be a string");
      if (!Array.isArray(a.languages))
        throw new Z(`${o}.languages`, "must be an array");
      if (typeof a.isSource != "boolean")
        throw new Z(`${o}.isSource`, "must be a boolean");
      if (!Array.isArray(a.turns))
        throw new Z(`${o}.turns`, "must be an array");
    }
  }
}
function xi(i, e) {
  const { width: t, height: n } = e.canvas, s = i[0], r = s.length / t, a = 0.5;
  e.translate(0, n / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let o = 0; o < t; o += a * 2) {
    const u = Math.floor(o * r), l = Math.abs(s[u] ?? 0);
    let c = o, d = l * (n / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + a, 0), c = c + a, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + a, 0);
  }
  e.stroke(), e.closePath();
}
function fn(i) {
  return i.length > 0 && i[0].startTime !== void 0;
}
function Pi(i, e) {
  if (!fn(i)) return null;
  let t = 0, n = i.length - 1;
  for (; t <= n; ) {
    const s = t + n >>> 1, r = i[s];
    if (e < r.startTime)
      n = s - 1;
    else if (e > r.endTime)
      t = s + 1;
    else
      return r.id;
  }
  return null;
}
function ml(i = {}) {
  const e = I(""), t = I(i.activeChannelId ?? ""), n = I(
    i.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: r, emit: a, clear: o } = ci(), u = pi(a), l = u, c = Qe(/* @__PURE__ */ new Map()), d = T(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function p(E, S) {
    return s(E, (A) => {
      A.translationId === d.value.activeTranslation.value.id && S(A);
    });
  }
  function h(E) {
    e.value = E.title, u.clear(), c.clear();
    for (const S of wi(E))
      l.ensure(S.id, S.name);
    for (const S of E.channels)
      c.set(S.id, Ot(S, a, l.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function v(E) {
    _i(E), h(E);
  }
  function y(E) {
    E !== t.value && (t.value = E, a("channel:change", { channelId: E }));
  }
  function m(E, S) {
    if (c.has(E)) {
      for (const A of S.translations)
        vt(A.turns, l.ensure);
      c.set(E, Ot(S, a, l.ensure)), a("channel:sync", { channelId: E });
    }
  }
  const C = [], k = [];
  function g(E) {
    E.tiptapExtensions && k.push(...E.tiptapExtensions);
    const S = E.install(_);
    S && C.push(S);
  }
  function b() {
    a("destroy", void 0), C.forEach((E) => E()), C.length = 0, o();
  }
  i.document && h(i.document);
  const _ = {
    title: e,
    activeChannelId: t,
    capabilities: n,
    pluginExtensions: k,
    speakers: l,
    channels: c,
    activeChannel: d,
    onActiveTranslation: p,
    setDocument: v,
    setActiveChannel: y,
    setChannel: m,
    on: s,
    off: r,
    emit: a,
    use: g,
    destroy: b
  };
  return _;
}
const pn = /* @__PURE__ */ Symbol("editorStore");
function gl(i) {
  Be(pn, i);
}
function ye() {
  const i = Re(pn);
  if (!i)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return i;
}
const Ii = ["aria-label"], Mi = /* @__PURE__ */ R({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(i) {
    return (e, t) => (w(), L("span", {
      class: "editor-badge",
      "aria-label": i.ariaLabel
    }, [
      H(e.$slots, "default", {}, void 0, !0)
    ], 8, Ii));
  }
}), K = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [n, s] of e)
    t[n] = s;
  return t;
}, Rt = /* @__PURE__ */ K(Mi, [["__scopeId", "data-v-3d3f8eba"]]);
const Di = (i) => {
  for (const e in i)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Bt = (i) => i === "";
const Li = (...i) => i.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim();
const zt = (i) => i.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const $i = (i) => i.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()
);
const Ai = (i) => {
  const e = $i(i);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Me = {
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
const Oi = ({
  name: i,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": n,
  strokeWidth: s,
  "stroke-width": r,
  size: a = Me.width,
  color: o = Me.stroke,
  ...u
}, { slots: l }) => ce(
  "svg",
  {
    ...Me,
    ...u,
    width: a,
    height: a,
    stroke: o,
    "stroke-width": Bt(t) || Bt(n) || t === !0 || n === !0 ? Number(s || r || Me["stroke-width"]) * 24 / Number(a) : s || r || Me["stroke-width"],
    class: Li(
      "lucide",
      u.class,
      ...i ? [`lucide-${zt(Ai(i))}-icon`, `lucide-${zt(i)}`] : ["lucide-icon"]
    ),
    ...!l.default && !Di(u) && { "aria-hidden": "true" }
  },
  [...e.map((c) => ce(...c)), ...l.default ? [l.default()] : []]
);
const G = (i, e) => (t, { slots: n, attrs: s }) => ce(
  Oi,
  {
    ...s,
    ...t,
    iconNode: e,
    name: i
  },
  n
);
const Ri = G("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const vn = G("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Bi = G("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const zi = G("clipboard-list", [
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
const Fi = G("clipboard-type", [
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
const Ni = G("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Wi = G("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Ft = G("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const qi = G("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const ji = G("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Hi = G("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Vi = G("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const Ui = G("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Ki = G("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Xi = G("volume-2", [
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
const Gi = G("volume-x", [
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
const _t = G("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Yi = {
  "arrow-down": Ri,
  check: vn,
  "chevron-down": Bi,
  "clipboard-list": zi,
  "clipboard-type": Fi,
  copy: Ni,
  download: Wi,
  pause: qi,
  play: ji,
  settings: Hi,
  "skip-back": Vi,
  "skip-forward": Ui,
  users: Ki,
  volume: Xi,
  "volume-mute": Gi,
  x: _t,
  "circle-notch": Ft,
  spinner: Ft
};
function mt(i) {
  if (i)
    return Yi[i];
}
const mn = {
  sm: 16,
  md: 20,
  lg: 24
}, Ji = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Zi = /* @__PURE__ */ R({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(i) {
    const e = i, t = T(() => mt(e.name)), n = T(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (s, r) => t.value ? (w(), $(ln(t.value), {
      key: 0,
      style: ze(n.value),
      class: ve(["editor-icon", { "editor-icon--spin": i.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (w(), L("span", Ji, "?"));
  }
}), Ue = /* @__PURE__ */ K(Zi, [["__scopeId", "data-v-210c7f09"]]), Qi = ["type", "disabled", "aria-disabled", "aria-label"], es = {
  key: 3,
  class: "editor-btn__label"
}, ts = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i, t = Kn(), n = T(() => !!mt(e.icon)), s = T(() => !!mt(e.iconRight)), r = T(() => mn[e.size]), a = T(() => e.disabled || e.loading), o = T(() => !!e.label || !!t.default), u = T(
      () => e.loading || n.value || !!t.icon
    ), l = T(() => u.value && !o.value), c = T(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      l.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, p) => (w(), L("button", {
      type: i.type,
      class: ve(c.value),
      disabled: a.value,
      "aria-disabled": a.value,
      "aria-label": i.ariaLabel
    }, [
      i.loading ? (w(), $(Ue, {
        key: 0,
        name: "spinner",
        spin: "",
        size: r.value
      }, null, 8, ["size"])) : n.value ? (w(), $(Ue, {
        key: 1,
        name: i.icon,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? H(d.$slots, "icon", { key: 2 }, void 0, !0) : q("", !0),
      o.value ? (w(), L("span", es, [
        H(d.$slots, "default", {}, () => [
          ie(N(i.label), 1)
        ], !0)
      ])) : q("", !0),
      s.value ? (w(), $(Ue, {
        key: 4,
        name: i.iconRight,
        size: r.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? H(d.$slots, "icon-right", { key: 5 }, void 0, !0) : q("", !0)
    ], 10, Qi));
  }
}), ne = /* @__PURE__ */ K(ts, [["__scopeId", "data-v-88f77497"]]), gn = {
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
  "selection.deselect": "Désélectionner {name}"
}, ns = {
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
  "selection.deselect": "Deselect {name}"
}, Nt = { fr: gn, en: ns }, yn = /* @__PURE__ */ Symbol("i18n");
function yl(i) {
  const e = T(() => {
    const n = Nt[i.value] ?? Nt.fr;
    return (s) => n[s] ?? s;
  }), t = {
    t: (n) => e.value(n),
    locale: i
  };
  return Be(yn, t), t;
}
function se() {
  const i = Re(yn);
  if (i) return i;
  const e = T(() => "fr");
  return {
    t: (t) => gn[t] ?? t,
    locale: e
  };
}
const is = { class: "editor-header" }, ss = { class: "header-left" }, rs = { class: "document-title" }, as = { class: "badges" }, os = ["datetime"], ls = { class: "header-right" }, us = /* @__PURE__ */ R({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(i) {
    const e = i, { t, locale: n } = se(), s = T(() => Tt(e.language, n.value, t("language.wildcard"))), r = T(() => Ae(e.duration)), a = T(() => e.title.replace(/-/g, " "));
    return (o, u) => (w(), L("header", is, [
      O("div", ss, [
        O("h1", rs, N(a.value), 1),
        O("div", as, [
          W(Rt, null, {
            default: B(() => [
              ie(N(s.value), 1)
            ]),
            _: 1
          }),
          W(Rt, null, {
            default: B(() => [
              O("time", {
                datetime: `PT${i.duration}S`
              }, N(r.value), 9, os)
            ]),
            _: 1
          })
        ])
      ]),
      O("div", ls, [
        i.isMobile ? (w(), $(ne, {
          key: 0,
          variant: "transparent",
          icon: "users",
          "aria-label": f(t)("header.openSidebar"),
          onClick: u[0] || (u[0] = (l) => o.$emit("toggleSidebar"))
        }, null, 8, ["aria-label"])) : q("", !0),
        i.isMobile ? (w(), $(ne, {
          key: 1,
          variant: "tertiary",
          icon: "download",
          disabled: "",
          "aria-label": f(t)("header.export")
        }, null, 8, ["aria-label"])) : (w(), $(ne, {
          key: 2,
          variant: "tertiary",
          icon: "download",
          disabled: ""
        }, {
          default: B(() => [
            ie(N(f(t)("header.export")), 1)
          ]),
          _: 1
        })),
        W(ne, {
          variant: "transparent",
          icon: "settings",
          disabled: "",
          "aria-label": f(t)("header.settings")
        }, null, 8, ["aria-label"])
      ])
    ]));
  }
}), cs = /* @__PURE__ */ K(us, [["__scopeId", "data-v-c5fd975f"]]), nt = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, ds = 70, hs = 1e3 / 60, fs = 350;
let Ke = !1, Wt = !1;
function ps() {
  Wt || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Ke = !0;
  }), document.addEventListener("mouseup", () => {
    Ke = !1;
  }), document.addEventListener("click", () => {
    Ke = !1;
  }), Wt = !0);
}
const it = /* @__PURE__ */ new Map();
function st(...i) {
  const e = {
    damping: nt.damping,
    stiffness: nt.stiffness,
    mass: nt.mass
  };
  let t = !1;
  for (const s of i) {
    if (s === "instant") {
      t = !0;
      continue;
    }
    typeof s != "object" || !s || (t = !1, e.damping = s.damping ?? e.damping, e.stiffness = s.stiffness ?? e.stiffness, e.mass = s.mass ?? e.mass);
  }
  const n = JSON.stringify(e);
  return it.has(n) || it.set(n, Object.freeze({ ...e })), t ? "instant" : it.get(n);
}
function vs(i = {}) {
  ps();
  let e = { ...i };
  const t = /* @__PURE__ */ new Set(), n = {
    isAtBottom: e.initial !== !1,
    isNearBottom: !1,
    escapedFromLock: !1,
    velocity: 0,
    accumulated: 0,
    resizeDifference: 0
  };
  function s() {
    const x = r();
    for (const M of t) M(x);
  }
  function r() {
    return {
      isAtBottom: n.isAtBottom || n.isNearBottom,
      isNearBottom: n.isNearBottom,
      escapedFromLock: n.escapedFromLock
    };
  }
  function a() {
    return n.scrollElement?.scrollTop ?? 0;
  }
  function o(x) {
    n.scrollElement && (n.scrollElement.scrollTop = x, n.ignoreScrollToTop = n.scrollElement.scrollTop);
  }
  function u() {
    const x = n.scrollElement, M = n.contentElement;
    return !x || !M ? 0 : x.scrollHeight - 1 - x.clientHeight;
  }
  let l;
  function c() {
    const x = n.scrollElement, M = n.contentElement;
    if (!x || !M)
      return 0;
    const F = u();
    if (!e.targetScrollTop)
      return F;
    if (l?.targetScrollTop === F)
      return l.calculatedScrollTop;
    const j = Math.max(
      Math.min(
        e.targetScrollTop(F, {
          scrollElement: x,
          contentElement: M
        }),
        F
      ),
      0
    );
    return l = { targetScrollTop: F, calculatedScrollTop: j }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      l = void 0;
    }), j;
  }
  function d() {
    return c() - a();
  }
  function p() {
    return d() <= ds;
  }
  function h(x) {
    n.isAtBottom = x, s();
  }
  function v(x) {
    n.escapedFromLock = x, s();
  }
  function y(x) {
    n.isNearBottom = x, s();
  }
  function m() {
    if (!Ke || typeof window > "u")
      return !1;
    const x = window.getSelection?.();
    if (!x || !x.rangeCount)
      return !1;
    const M = x.getRangeAt(0), F = n.scrollElement;
    if (!F)
      return !1;
    const j = M.commonAncestorContainer;
    return !!(j && (F.contains(j) || j.contains(F)));
  }
  const C = (x) => {
    if (x.target !== n.scrollElement)
      return;
    const M = a(), F = n.ignoreScrollToTop;
    let j = n.lastScrollTop ?? M;
    n.lastScrollTop = M, n.ignoreScrollToTop = void 0, F && F > M && (j = F), y(p()), setTimeout(() => {
      if (n.resizeDifference || M === F)
        return;
      if (m()) {
        v(!0), h(!1);
        return;
      }
      const P = M > j, z = M < j;
      if (n.animation?.ignoreEscapes) {
        o(j);
        return;
      }
      z && (v(!0), h(!1)), P && v(!1), !n.escapedFromLock && p() && h(!0);
    }, 1);
  }, k = (x) => {
    const M = n.scrollElement;
    if (!M)
      return;
    let F = x.target;
    for (; F && !["scroll", "auto"].includes(getComputedStyle(F).overflow); ) {
      if (!F.parentElement)
        return;
      F = F.parentElement;
    }
    F === M && x.deltaY < 0 && M.scrollHeight > M.clientHeight && !n.animation?.ignoreEscapes && (v(!0), h(!1));
  };
  function g(x, M) {
    b(), n.scrollElement = x, n.contentElement = M, getComputedStyle(x).overflow === "visible" && (x.style.overflow = "auto"), x.addEventListener("scroll", C, { passive: !0 }), x.addEventListener("wheel", k, { passive: !0 });
    let F;
    n.resizeObserver = new ResizeObserver((j) => {
      const P = j[0];
      if (!P)
        return;
      const { height: z } = P.contentRect, Y = z - (F ?? z);
      if (n.resizeDifference = Y, a() > u() && o(u()), y(p()), Y >= 0) {
        const V = st(
          e,
          F ? e.resize : e.initial
        );
        S({
          animation: V,
          wait: !0,
          preserveScrollPosition: !0,
          duration: V === "instant" ? void 0 : fs
        });
      } else
        p() && (v(!1), h(!0));
      F = z, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          n.resizeDifference === Y && (n.resizeDifference = 0);
        }, 1);
      });
    }), n.resizeObserver.observe(M);
  }
  function b() {
    n.scrollElement && (n.scrollElement.removeEventListener("scroll", C), n.scrollElement.removeEventListener("wheel", k)), n.resizeObserver?.disconnect(), n.resizeObserver = void 0, n.scrollElement = void 0, n.contentElement = void 0;
  }
  function _() {
    b(), t.clear();
  }
  function E(x) {
    e = { ...e, ...x };
  }
  function S(x = {}) {
    const M = typeof x == "string" ? { animation: x } : x;
    M.preserveScrollPosition || h(!0);
    const F = Date.now() + (Number(M.wait) || 0), j = st(e, M.animation), { ignoreEscapes: P = !1 } = M;
    let z, Y = c();
    M.duration instanceof Promise ? M.duration.finally(() => {
      z = Date.now();
    }) : z = F + (M.duration ?? 0);
    const V = async () => {
      const we = new Promise((ue) => {
        if (typeof requestAnimationFrame > "u") {
          ue(!1);
          return;
        }
        requestAnimationFrame(() => ue(!0));
      }).then(() => {
        if (!n.isAtBottom)
          return n.animation = void 0, !1;
        const ue = a(), Ie = typeof performance < "u" ? performance.now() : Date.now(), Un = (Ie - (n.lastTick ?? Ie)) / hs;
        if (n.animation ||= { behavior: j, promise: we, ignoreEscapes: P }, n.animation.behavior === j && (n.lastTick = Ie), m() || F > Date.now())
          return V();
        if (ue < Math.min(Y, c())) {
          if (n.animation?.behavior === j) {
            if (j === "instant")
              return o(c()), V();
            const et = j;
            n.velocity = (et.damping * n.velocity + et.stiffness * d()) / et.mass, n.accumulated += n.velocity * Un;
            const Lt = a();
            o(Lt + n.accumulated), a() !== Lt && (n.accumulated = 0);
          }
          return V();
        }
        return z > Date.now() ? (Y = c(), V()) : (n.animation = void 0, a() < c() ? S({
          animation: st(e, e.resize),
          ignoreEscapes: P,
          duration: Math.max(0, z - Date.now()) || void 0
        }) : n.isAtBottom);
      });
      return we.then((ue) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        n.animation || (n.lastTick = void 0, n.velocity = 0);
      }), ue));
    };
    return M.wait !== !0 && (n.animation = void 0), n.animation?.behavior === j ? n.animation.promise : V();
  }
  const A = () => {
    v(!0), h(!1);
  };
  function D(x) {
    return t.add(x), () => t.delete(x);
  }
  return {
    attach: g,
    detach: b,
    destroy: _,
    setOptions: E,
    getState: r,
    onChange: D,
    scrollToBottom: S,
    stopScroll: A
  };
}
function ms(i = {}) {
  const e = I(null), t = I(null), n = I(i.initial !== !1), s = I(!1), r = I(!1), a = vs(i);
  let o = null;
  return me((u) => {
    !e.value || !t.value || (a.attach(e.value, t.value), o = a.onChange((l) => {
      n.value = l.isAtBottom, s.value = l.isNearBottom, r.value = l.escapedFromLock;
    }), u(() => {
      o?.(), o = null, a.detach();
    }));
  }), ge(() => {
    a.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: n,
    isNearBottom: s,
    escapedFromLock: r,
    scrollToBottom: (u) => a.scrollToBottom(u),
    stopScroll: () => a.stopScroll(),
    setOptions: (u) => a.setOptions(u)
  };
}
const gs = /* @__PURE__ */ R({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(i) {
    return (e, t) => (w(), L("span", {
      class: "speaker-indicator",
      style: ze({ backgroundColor: i.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), bn = /* @__PURE__ */ K(gs, [["__scopeId", "data-v-9bffeda8"]]), ys = { class: "speaker-label" }, bs = {
  key: 1,
  class: "speaker-name"
}, ks = ["datetime"], ws = { class: "lang" }, Ss = /* @__PURE__ */ R({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    startDate: {},
    language: {}
  },
  setup(i) {
    const e = i, { t, locale: n } = se(), s = T(
      () => Tt(
        e.language,
        n.value,
        t("language.wildcard")
      )
    ), r = T(() => {
      if (e.startTime != null)
        return {
          text: Ae(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const o = new Date(e.startDate * 1e3);
        return {
          text: Ti(e.startDate, n.value),
          datetime: o.toISOString()
        };
      }
      return null;
    }), a = T(() => e.speaker?.color ?? "transparent");
    return (o, u) => (w(), L("div", ys, [
      i.speaker ? (w(), $(bn, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : q("", !0),
      i.speaker ? (w(), L("span", bs, N(i.speaker.name), 1)) : q("", !0),
      r.value ? (w(), L("time", {
        key: 2,
        class: "timestamp",
        datetime: r.value.datetime
      }, N(r.value.text), 9, ks)) : q("", !0),
      O("span", ws, N(s.value), 1)
    ]));
  }
}), Cs = /* @__PURE__ */ K(Ss, [["__scopeId", "data-v-79207560"]]);
function qt(i) {
  return typeof i == "string" ? `'${i}'` : new Es().serialize(i);
}
const Es = /* @__PURE__ */ (function() {
  class i {
    #e = /* @__PURE__ */ new Map();
    compare(t, n) {
      const s = typeof t, r = typeof n;
      return s === "string" && r === "string" ? t.localeCompare(n) : s === "number" && r === "number" ? t - n : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(n, !0));
    }
    serialize(t, n) {
      if (t === null) return "null";
      switch (typeof t) {
        case "string":
          return n ? t : `'${t}'`;
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
      const n = Object.prototype.toString.call(t);
      if (n !== "[object Object]") return this.serializeBuiltInType(n.length < 10 ? `unknown:${n}` : n.slice(8, -1), t);
      const s = t.constructor, r = s === Object || s === void 0 ? "" : s.name;
      if (r !== "" && globalThis[r] === s) return this.serializeBuiltInType(r, t);
      if (typeof t.toJSON == "function") {
        const a = t.toJSON();
        return r + (a !== null && typeof a == "object" ? this.$object(a) : `(${this.serialize(a)})`);
      }
      return this.serializeObjectEntries(r, Object.entries(t));
    }
    serializeBuiltInType(t, n) {
      const s = this["$" + t];
      if (s) return s.call(this, n);
      if (typeof n?.entries == "function") return this.serializeObjectEntries(t, n.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, n) {
      const s = Array.from(n).sort((a, o) => this.compare(a[0], o[0]));
      let r = `${t}{`;
      for (let a = 0; a < s.length; a++) {
        const [o, u] = s[a];
        r += `${this.serialize(o, !0)}:${this.serialize(u)}`, a < s.length - 1 && (r += ",");
      }
      return r + "}";
    }
    $object(t) {
      let n = this.#e.get(t);
      return n === void 0 && (this.#e.set(t, `#${this.#e.size}`), n = this.serializeObject(t), this.#e.set(t, n)), n;
    }
    $function(t) {
      const n = Function.prototype.toString.call(t);
      return n.slice(-15) === "[native code] }" ? `${t.name || ""}()[native]` : `${t.name}(${t.length})${n.replace(/\s*\n\s*/g, "")}`;
    }
    $Array(t) {
      let n = "[";
      for (let s = 0; s < t.length; s++) n += this.serialize(t[s]), s < t.length - 1 && (n += ",");
      return n + "]";
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
      return `Set${this.$Array(Array.from(t).sort((n, s) => this.compare(n, s)))}`;
    }
    $Map(t) {
      return this.serializeObjectEntries("Map", t.entries());
    }
  }
  for (const e of ["Error", "RegExp", "URL"]) i.prototype["$" + e] = function(t) {
    return `${e}(${t})`;
  };
  for (const e of ["Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array"]) i.prototype["$" + e] = function(t) {
    return `${e}[${t.join(",")}]`;
  };
  for (const e of ["BigInt64Array", "BigUint64Array"]) i.prototype["$" + e] = function(t) {
    return `${e}[${t.join("n,")}${t.length > 0 ? "n" : ""}]`;
  };
  return i;
})();
function gt(i, e) {
  return i === e || qt(i) === qt(e);
}
function Ne(i, e) {
  const t = typeof i == "string" && !e ? `${i}Context` : e, n = Symbol(t);
  return [(a) => {
    const o = Re(n, a);
    if (o || o === null) return o;
    throw new Error(`Injection \`${n.toString()}\` not found. Component must be used within ${Array.isArray(i) ? `one of the following components: ${i.join(", ")}` : `\`${i}\``}`);
  }, (a) => (Be(n, a), a)];
}
function le() {
  let i = document.activeElement;
  if (i == null) return null;
  for (; i != null && i.shadowRoot != null && i.shadowRoot.activeElement != null; ) i = i.shadowRoot.activeElement;
  return i;
}
function kn(i, e, t) {
  const n = t.originalEvent.target, s = new CustomEvent(i, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && n.addEventListener(i, e, { once: !0 }), n.dispatchEvent(s);
}
function Je(i) {
  return i == null;
}
function jt(i, e) {
  return Je(i) ? !1 : Array.isArray(i) ? i.some((t) => gt(t, e)) : gt(i, e);
}
function xt(i) {
  return i ? i.flatMap((e) => e.type === ae ? xt(e.children) : [e]) : [];
}
const [wn] = Ne("ConfigProvider");
function Ts(i, e) {
  return Xn() ? (Gn(i, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function _s(i) {
  let e = !1, t;
  const n = un(!0);
  return ((...s) => (e || (t = n.run(() => i(...s)), e = !0), t));
}
const be = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const xs = (i) => typeof i < "u", Ps = Object.prototype.toString, Is = (i) => Ps.call(i) === "[object Object]", Ht = /* @__PURE__ */ Ms();
function Ms() {
  var i, e, t;
  return be && !!(!((i = window) === null || i === void 0 || (i = i.navigator) === null || i === void 0) && i.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function rt(i) {
  return Array.isArray(i) ? i : [i];
}
function Ds(i) {
  return _e();
}
// @__NO_SIDE_EFFECTS__
function Ls(i) {
  if (!be) return i;
  let e = 0, t, n;
  const s = () => {
    e -= 1, n && e <= 0 && (n.stop(), t = void 0, n = void 0);
  };
  return ((...r) => (e += 1, n || (n = un(!0), t = n.run(() => i(...r))), Ts(s), t));
}
function $s(i, e) {
  Ds() && ge(i, e);
}
function As(i, e, t) {
  return U(i, e, {
    ...t,
    immediate: !0
  });
}
const Pt = be ? window : void 0;
function Pe(i) {
  var e;
  const t = oe(i);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Sn(...i) {
  const e = (n, s, r, a) => (n.addEventListener(s, r, a), () => n.removeEventListener(s, r, a)), t = T(() => {
    const n = rt(oe(i[0])).filter((s) => s != null);
    return n.every((s) => typeof s != "string") ? n : void 0;
  });
  return As(() => {
    var n, s;
    return [
      (n = (s = t.value) === null || s === void 0 ? void 0 : s.map((r) => Pe(r))) !== null && n !== void 0 ? n : [Pt].filter((r) => r != null),
      rt(oe(t.value ? i[1] : i[0])),
      rt(f(t.value ? i[2] : i[1])),
      oe(t.value ? i[3] : i[2])
    ];
  }, ([n, s, r, a], o, u) => {
    if (!n?.length || !s?.length || !r?.length) return;
    const l = Is(a) ? { ...a } : a, c = n.flatMap((d) => s.flatMap((p) => r.map((h) => e(d, p, h, l))));
    u(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Os() {
  const i = Le(!1), e = _e();
  return e && ee(() => {
    i.value = !0;
  }, e), i;
}
function Rs(i) {
  return typeof i == "function" ? i : typeof i == "string" ? (e) => e.key === i : Array.isArray(i) ? (e) => i.includes(e.key) : () => !0;
}
function Bs(...i) {
  let e, t, n = {};
  i.length === 3 ? (e = i[0], t = i[1], n = i[2]) : i.length === 2 ? typeof i[1] == "object" ? (e = !0, t = i[0], n = i[1]) : (e = i[0], t = i[1]) : (e = !0, t = i[0]);
  const { target: s = Pt, eventName: r = "keydown", passive: a = !1, dedupe: o = !1 } = n, u = Rs(e);
  return Sn(s, r, (c) => {
    c.repeat && oe(o) || u(c) && t(c);
  }, a);
}
function zs(i) {
  return JSON.parse(JSON.stringify(i));
}
// @__NO_SIDE_EFFECTS__
function Cn(i, e, t, n = {}) {
  var s, r;
  const { clone: a = !1, passive: o = !1, eventName: u, deep: l = !1, defaultValue: c, shouldEmit: d } = n, p = _e(), h = t || p?.emit || (p == null || (s = p.$emit) === null || s === void 0 ? void 0 : s.bind(p)) || (p == null || (r = p.proxy) === null || r === void 0 || (r = r.$emit) === null || r === void 0 ? void 0 : r.bind(p?.proxy));
  let v = u;
  e || (e = "modelValue"), v = v || `update:${e.toString()}`;
  const y = (k) => a ? typeof a == "function" ? a(k) : zs(k) : k, m = () => xs(i[e]) ? y(i[e]) : c, C = (k) => {
    d ? d(k) && h(v, k) : h(v, k);
  };
  if (o) {
    const k = I(m());
    let g = !1;
    return U(() => i[e], (b) => {
      g || (g = !0, k.value = y(b), de(() => g = !1));
    }), U(k, (b) => {
      !g && (b !== i[e] || l) && C(b);
    }, { deep: l }), k;
  } else return T({
    get() {
      return m();
    },
    set(k) {
      C(k);
    }
  });
}
function at(i) {
  if (i === null || typeof i != "object")
    return !1;
  const e = Object.getPrototypeOf(i);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in i ? !1 : Symbol.toStringTag in i ? Object.prototype.toString.call(i) === "[object Module]" : !0;
}
function yt(i, e, t = ".", n) {
  if (!at(e))
    return yt(i, {}, t, n);
  const s = Object.assign({}, e);
  for (const r in i) {
    if (r === "__proto__" || r === "constructor")
      continue;
    const a = i[r];
    a != null && (n && n(s, r, a, t) || (Array.isArray(a) && Array.isArray(s[r]) ? s[r] = [...a, ...s[r]] : at(a) && at(s[r]) ? s[r] = yt(
      a,
      s[r],
      (t ? `${t}.` : "") + r.toString(),
      n
    ) : s[r] = a));
  }
  return s;
}
function Fs(i) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, n) => yt(t, n, "", i), {})
  );
}
const Ns = Fs(), Ws = /* @__PURE__ */ Ls(() => {
  const i = I(/* @__PURE__ */ new Map()), e = I(), t = T(() => {
    for (const a of i.value.values()) if (a) return !0;
    return !1;
  }), n = wn({ scrollBody: I(!0) });
  let s = null;
  const r = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", Ht && s?.(), e.value = void 0;
  };
  return U(t, (a, o) => {
    if (!be) return;
    if (!a) {
      o && r();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const u = window.innerWidth - document.documentElement.clientWidth, l = {
      padding: u,
      margin: 0
    }, c = n.scrollBody?.value ? typeof n.scrollBody.value == "object" ? Ns({
      padding: n.scrollBody.value.padding === !0 ? u : n.scrollBody.value.padding,
      margin: n.scrollBody.value.margin === !0 ? u : n.scrollBody.value.margin
    }, l) : l : {
      padding: 0,
      margin: 0
    };
    u > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${u}px`), document.body.style.overflow = "hidden"), Ht && (s = Sn(document, "touchmove", (d) => js(d), { passive: !1 })), de(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), i;
});
function qs(i) {
  const e = Math.random().toString(36).substring(2, 7), t = Ws();
  t.value.set(e, i);
  const n = T({
    get: () => t.value.get(e) ?? !1,
    set: (s) => t.value.set(e, s)
  });
  return $s(() => {
    t.value.delete(e);
  }), n;
}
function En(i) {
  const e = window.getComputedStyle(i);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && i.clientWidth < i.scrollWidth || e.overflowY === "auto" && i.clientHeight < i.scrollHeight) return !0;
  {
    const t = i.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : En(t);
  }
}
function js(i) {
  const e = i || window.event, t = e.target;
  return t instanceof Element && En(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function It(i) {
  const e = _e(), t = e?.type.emits, n = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((s) => {
    n[Yn(Jn(s))] = (...r) => i(s, ...r);
  }), n;
}
function Hs(i) {
  return T(() => oe(i) ? !!Pe(i)?.closest("form") : !0);
}
function re() {
  const i = _e(), e = I(), t = T(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Pe(e)), n = Object.assign({}, i.exposed), s = {};
  for (const a in i.props) Object.defineProperty(s, a, {
    enumerable: !0,
    configurable: !0,
    get: () => i.props[a]
  });
  if (Object.keys(n).length > 0) for (const a in n) Object.defineProperty(s, a, {
    enumerable: !0,
    configurable: !0,
    get: () => n[a]
  });
  Object.defineProperty(s, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => i.vnode.el
  }), i.exposed = s;
  function r(a) {
    if (e.value = a, !!a && (Object.defineProperty(s, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => a instanceof Element ? a : a.$el
    }), !(a instanceof Element) && !Object.hasOwn(a, "$el"))) {
      const o = a.$.exposed, u = Object.assign({}, s);
      for (const l in o) Object.defineProperty(u, l, {
        enumerable: !0,
        configurable: !0,
        get: () => o[l]
      });
      i.exposed = u;
    }
  }
  return {
    forwardRef: r,
    currentRef: e,
    currentElement: t
  };
}
var Vs = function(i) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(i) ? i[0] : i;
  return e.ownerDocument.body;
}, Ee = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), je = {}, ot = 0, Tn = function(i) {
  return i && (i.host || Tn(i.parentNode));
}, Us = function(i, e) {
  return e.map(function(t) {
    if (i.contains(t))
      return t;
    var n = Tn(t);
    return n && i.contains(n) ? n : (console.error("aria-hidden", t, "in not contained inside", i, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Ks = function(i, e, t, n) {
  var s = Us(e, Array.isArray(i) ? i : [i]);
  je[t] || (je[t] = /* @__PURE__ */ new WeakMap());
  var r = je[t], a = [], o = /* @__PURE__ */ new Set(), u = new Set(s), l = function(d) {
    !d || o.has(d) || (o.add(d), l(d.parentNode));
  };
  s.forEach(l);
  var c = function(d) {
    !d || u.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (o.has(p))
        c(p);
      else
        try {
          var h = p.getAttribute(n), v = h !== null && h !== "false", y = (Ee.get(p) || 0) + 1, m = (r.get(p) || 0) + 1;
          Ee.set(p, y), r.set(p, m), a.push(p), y === 1 && v && qe.set(p, !0), m === 1 && p.setAttribute(t, "true"), v || p.setAttribute(n, "true");
        } catch (C) {
          console.error("aria-hidden: cannot operate on ", p, C);
        }
    });
  };
  return c(e), o.clear(), ot++, function() {
    a.forEach(function(d) {
      var p = Ee.get(d) - 1, h = r.get(d) - 1;
      Ee.set(d, p), r.set(d, h), p || (qe.has(d) || d.removeAttribute(n), qe.delete(d)), h || d.removeAttribute(t);
    }), ot--, ot || (Ee = /* @__PURE__ */ new WeakMap(), Ee = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ new WeakMap(), je = {});
  };
}, Xs = function(i, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var n = Array.from(Array.isArray(i) ? i : [i]), s = Vs(i);
  return s ? (n.push.apply(n, Array.from(s.querySelectorAll("[aria-live], script"))), Ks(n, s, t, "aria-hidden")) : function() {
    return null;
  };
};
function Gs(i) {
  let e;
  U(() => Pe(i), (t) => {
    t ? e = Xs(t) : e && e();
  }), Fe(() => {
    e && e();
  });
}
let Ys = 0;
function bt(i, e = "reka") {
  if ("useId" in $t) return `${e}-${$t.useId?.()}`;
  const t = wn({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Ys}`;
}
function Js(i, e) {
  const t = I(i);
  function n(r) {
    return e[t.value][r] ?? t.value;
  }
  return {
    state: t,
    dispatch: (r) => {
      t.value = n(r);
    }
  };
}
function Zs(i, e) {
  const t = I({}), n = I("none"), s = I(i), r = i.value ? "mounted" : "unmounted";
  let a;
  const o = e.value?.ownerDocument.defaultView ?? Pt, { state: u, dispatch: l } = Js(r, {
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
    if (be) {
      const C = new CustomEvent(m, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(C);
    }
  };
  U(i, async (m, C) => {
    const k = C !== m;
    if (await de(), k) {
      const g = n.value, b = He(e.value);
      m ? (l("MOUNT"), c("enter"), b === "none" && c("after-enter")) : b === "none" || b === "undefined" || t.value?.display === "none" ? (l("UNMOUNT"), c("leave"), c("after-leave")) : C && g !== b ? (l("ANIMATION_OUT"), c("leave")) : (l("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (m) => {
    const C = He(e.value), k = C.includes(CSS.escape(m.animationName)), g = u.value === "mounted" ? "enter" : "leave";
    if (m.target === e.value && k && (c(`after-${g}`), l("ANIMATION_END"), !s.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", a = o?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    m.target === e.value && C === "none" && l("ANIMATION_END");
  }, p = (m) => {
    m.target === e.value && (n.value = He(e.value));
  }, h = U(e, (m, C) => {
    m ? (t.value = getComputedStyle(m), m.addEventListener("animationstart", p), m.addEventListener("animationcancel", d), m.addEventListener("animationend", d)) : (l("ANIMATION_END"), a !== void 0 && o?.clearTimeout(a), C?.removeEventListener("animationstart", p), C?.removeEventListener("animationcancel", d), C?.removeEventListener("animationend", d));
  }, { immediate: !0 }), v = U(u, () => {
    const m = He(e.value);
    n.value = u.value === "mounted" ? m : "none";
  });
  return Fe(() => {
    h(), v();
  }), { isPresent: T(() => ["mounted", "unmountSuspended"].includes(u.value)) };
}
function He(i) {
  return i && getComputedStyle(i).animationName || "none";
}
var Mt = R({
  name: "Presence",
  props: {
    present: {
      type: Boolean,
      required: !0
    },
    forceMount: { type: Boolean }
  },
  slots: {},
  setup(i, { slots: e, expose: t }) {
    const { present: n, forceMount: s } = cn(i), r = I(), { isPresent: a } = Zs(n, r);
    t({ present: a });
    let o = e.default({ present: a.value });
    o = xt(o || []);
    const u = _e();
    if (o && o?.length > 1) {
      const l = u?.parent?.type.name ? `<${u.parent.type.name} />` : "component";
      throw new Error([
        `Detected an invalid children for \`${l}\` for  \`Presence\` component.`,
        "",
        "Note: Presence works similarly to `v-if` directly, but it waits for animation/transition to finished before unmounting. So it expect only one direct child of valid VNode type.",
        "You can apply a few solutions:",
        ["Provide a single child element so that `presence` directive attach correctly.", "Ensure the first child is an actual element instead of a raw text node or comment node."].map((c) => `  - ${c}`).join(`
`)
      ].join(`
`));
    }
    return () => s.value || n.value || a.value ? ce(e.default({ present: a.value })[0], { ref: (l) => {
      const c = Pe(l);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? r.value = c.firstElementChild : r.value = c), c;
    } }) : null;
  }
});
const kt = R({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(i, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const n = xt(t.default()), s = n.findIndex((u) => u.type !== Zn);
      if (s === -1) return n;
      const r = n[s];
      delete r.props?.ref;
      const a = r.props ? Q(e, r.props) : e, o = Qn({
        ...r,
        props: {}
      }, a);
      return n.length === 1 ? o : (n[s] = o, n);
    };
  }
}), Qs = [
  "area",
  "img",
  "input"
], he = R({
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
  setup(i, { attrs: e, slots: t }) {
    const n = i.asChild ? "template" : i.as;
    return typeof n == "string" && Qs.includes(n) ? () => ce(n, e) : n !== "template" ? () => ce(i.as, e, { default: t.default }) : () => ce(kt, e, { default: t.default });
  }
});
function wt() {
  const i = I(), e = T(() => ["#text", "#comment"].includes(i.value?.$el.nodeName) ? i.value?.$el.nextElementSibling : Pe(i));
  return {
    primitiveElement: i,
    currentElement: e
  };
}
const [ke, er] = Ne("DialogRoot");
var tr = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, s = /* @__PURE__ */ Cn(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), r = I(), a = I(), { modal: o } = cn(t);
    return er({
      open: s,
      modal: o,
      openModal: () => {
        s.value = !0;
      },
      onOpenChange: (u) => {
        s.value = u;
      },
      onOpenToggle: () => {
        s.value = !s.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: r,
      contentElement: a
    }), (u, l) => H(u.$slots, "default", {
      open: f(s),
      close: () => s.value = !1
    });
  }
}), nr = tr, ir = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i;
    re();
    const t = ke();
    return (n, s) => (w(), $(f(he), Q(e, {
      type: n.as === "button" ? "button" : void 0,
      onClick: s[0] || (s[0] = (r) => f(t).onOpenChange(!1))
    }), {
      default: B(() => [H(n.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), sr = ir;
const rr = "dismissableLayer.pointerDownOutside", ar = "dismissableLayer.focusOutside";
function _n(i, e) {
  const t = e.closest("[data-dismissable-layer]"), n = i.dataset.dismissableLayer === "" ? i : i.querySelector("[data-dismissable-layer]"), s = Array.from(i.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (n === t || s.indexOf(n) < s.indexOf(t)));
}
function or(i, e, t = !0) {
  const n = e?.value?.ownerDocument ?? globalThis?.document, s = I(!1), r = I(() => {
  });
  return me((a) => {
    if (!be || !oe(t)) return;
    const o = async (l) => {
      const c = l.target;
      if (!(!e?.value || !c)) {
        if (_n(e.value, c)) {
          s.value = !1;
          return;
        }
        if (l.target && !s.value) {
          let p = function() {
            kn(rr, i, d);
          };
          const d = { originalEvent: l };
          l.pointerType === "touch" ? (n.removeEventListener("click", r.value), r.value = p, n.addEventListener("click", r.value, { once: !0 })) : p();
        } else n.removeEventListener("click", r.value);
        s.value = !1;
      }
    }, u = window.setTimeout(() => {
      n.addEventListener("pointerdown", o);
    }, 0);
    a(() => {
      window.clearTimeout(u), n.removeEventListener("pointerdown", o), n.removeEventListener("click", r.value);
    });
  }), { onPointerDownCapture: () => {
    oe(t) && (s.value = !0);
  } };
}
function lr(i, e, t = !0) {
  const n = e?.value?.ownerDocument ?? globalThis?.document, s = I(!1);
  return me((r) => {
    if (!be || !oe(t)) return;
    const a = async (o) => {
      if (!e?.value) return;
      await de(), await de();
      const u = o.target;
      !e.value || !u || _n(e.value, u) || o.target && !s.value && kn(ar, i, { originalEvent: o });
    };
    n.addEventListener("focusin", a), r(() => n.removeEventListener("focusin", a));
  }), {
    onFocusCapture: () => {
      oe(t) && (s.value = !0);
    },
    onBlurCapture: () => {
      oe(t) && (s.value = !1);
    }
  };
}
const te = dn({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ur = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, { forwardRef: s, currentElement: r } = re(), a = T(() => r.value?.ownerDocument ?? globalThis.document), o = T(() => te.layersRoot), u = T(() => r.value ? Array.from(o.value).indexOf(r.value) : -1), l = T(() => te.layersWithOutsidePointerEventsDisabled.size > 0), c = T(() => {
      const h = Array.from(o.value), [v] = [...te.layersWithOutsidePointerEventsDisabled].slice(-1), y = h.indexOf(v);
      return u.value >= y;
    }), d = or(async (h) => {
      const v = [...te.branches].some((y) => y?.contains(h.target));
      !c.value || v || (n("pointerDownOutside", h), n("interactOutside", h), await de(), h.defaultPrevented || n("dismiss"));
    }, r), p = lr((h) => {
      [...te.branches].some((y) => y?.contains(h.target)) || (n("focusOutside", h), n("interactOutside", h), h.defaultPrevented || n("dismiss"));
    }, r);
    return Bs("Escape", (h) => {
      u.value === o.value.size - 1 && (n("escapeKeyDown", h), h.defaultPrevented || n("dismiss"));
    }), me((h) => {
      r.value && (t.disableOutsidePointerEvents && (te.layersWithOutsidePointerEventsDisabled.size === 0 && (te.originalBodyPointerEvents = a.value.body.style.pointerEvents, a.value.body.style.pointerEvents = "none"), te.layersWithOutsidePointerEventsDisabled.add(r.value)), o.value.add(r.value), h(() => {
        t.disableOutsidePointerEvents && te.layersWithOutsidePointerEventsDisabled.size === 1 && !Je(te.originalBodyPointerEvents) && (a.value.body.style.pointerEvents = te.originalBodyPointerEvents);
      }));
    }), me((h) => {
      h(() => {
        r.value && (o.value.delete(r.value), te.layersWithOutsidePointerEventsDisabled.delete(r.value));
      });
    }), (h, v) => (w(), $(f(he), {
      ref: f(s),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: ze({ pointerEvents: l.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: f(p).onFocusCapture,
      onBlurCapture: f(p).onBlurCapture,
      onPointerdownCapture: f(d).onPointerDownCapture
    }, {
      default: B(() => [H(h.$slots, "default")]),
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
}), cr = ur;
const dr = /* @__PURE__ */ _s(() => I([]));
function hr() {
  const i = dr();
  return {
    add(e) {
      const t = i.value[0];
      e !== t && t?.pause(), i.value = Vt(i.value, e), i.value.unshift(e);
    },
    remove(e) {
      i.value = Vt(i.value, e), i.value[0]?.resume();
    }
  };
}
function Vt(i, e) {
  const t = [...i], n = t.indexOf(e);
  return n !== -1 && t.splice(n, 1), t;
}
const lt = "focusScope.autoFocusOnMount", ut = "focusScope.autoFocusOnUnmount", Ut = {
  bubbles: !1,
  cancelable: !0
};
function fr(i, { select: e = !1 } = {}) {
  const t = le();
  for (const n of i)
    if (fe(n, { select: e }), le() !== t) return !0;
}
function pr(i) {
  const e = xn(i), t = Kt(e, i), n = Kt(e.reverse(), i);
  return [t, n];
}
function xn(i) {
  const e = [], t = document.createTreeWalker(i, NodeFilter.SHOW_ELEMENT, { acceptNode: (n) => {
    const s = n.tagName === "INPUT" && n.type === "hidden";
    return n.disabled || n.hidden || s ? NodeFilter.FILTER_SKIP : n.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function Kt(i, e) {
  for (const t of i) if (!vr(t, { upTo: e })) return t;
}
function vr(i, { upTo: e }) {
  if (getComputedStyle(i).visibility === "hidden") return !0;
  for (; i; ) {
    if (e !== void 0 && i === e) return !1;
    if (getComputedStyle(i).display === "none") return !0;
    i = i.parentElement;
  }
  return !1;
}
function mr(i) {
  return i instanceof HTMLInputElement && "select" in i;
}
function fe(i, { select: e = !1 } = {}) {
  if (i && i.focus) {
    const t = le();
    i.focus({ preventScroll: !0 }), i !== t && mr(i) && e && i.select();
  }
}
var gr = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, { currentRef: s, currentElement: r } = re(), a = I(null), o = hr(), u = dn({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    me((c) => {
      if (!be) return;
      const d = r.value;
      if (!t.trapped) return;
      function p(m) {
        if (u.paused || !d) return;
        const C = m.target;
        d.contains(C) ? a.value = C : fe(a.value, { select: !0 });
      }
      function h(m) {
        if (u.paused || !d) return;
        const C = m.relatedTarget;
        C !== null && (d.contains(C) || fe(a.value, { select: !0 }));
      }
      function v(m) {
        d.contains(a.value) || fe(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", h);
      const y = new MutationObserver(v);
      d && y.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", h), y.disconnect();
      });
    }), me(async (c) => {
      const d = r.value;
      if (await de(), !d) return;
      o.add(u);
      const p = le();
      if (!d.contains(p)) {
        const v = new CustomEvent(lt, Ut);
        d.addEventListener(lt, (y) => n("mountAutoFocus", y)), d.dispatchEvent(v), v.defaultPrevented || (fr(xn(d), { select: !0 }), le() === p && fe(d));
      }
      c(() => {
        d.removeEventListener(lt, (m) => n("mountAutoFocus", m));
        const v = new CustomEvent(ut, Ut), y = (m) => {
          n("unmountAutoFocus", m);
        };
        d.addEventListener(ut, y), d.dispatchEvent(v), setTimeout(() => {
          v.defaultPrevented || fe(p ?? document.body, { select: !0 }), d.removeEventListener(ut, y), o.remove(u);
        }, 0);
      });
    });
    function l(c) {
      if (!t.loop && !t.trapped || u.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, p = le();
      if (d && p) {
        const h = c.currentTarget, [v, y] = pr(h);
        v && y ? !c.shiftKey && p === y ? (c.preventDefault(), t.loop && fe(v, { select: !0 })) : c.shiftKey && p === v && (c.preventDefault(), t.loop && fe(y, { select: !0 })) : p === h && c.preventDefault();
      }
    }
    return (c, d) => (w(), $(f(he), {
      ref_key: "currentRef",
      ref: s,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: l
    }, {
      default: B(() => [H(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), yr = gr;
function br(i) {
  return i ? "open" : "closed";
}
const kr = "DialogTitle", wr = "DialogContent";
function Sr({ titleName: i = kr, contentName: e = wr, componentLink: t = "dialog.html#title", titleId: n, descriptionId: s, contentElement: r }) {
  const a = `Warning: \`${e}\` requires a \`${i}\` for the component to be accessible for screen reader users.

If you want to hide the \`${i}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, o = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  ee(() => {
    document.getElementById(n) || console.warn(a);
    const l = r.value?.getAttribute("aria-describedby");
    s && l && (document.getElementById(s) || console.warn(o));
  });
}
var Cr = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, s = ke(), { forwardRef: r, currentElement: a } = re();
    return s.titleId ||= bt(void 0, "reka-dialog-title"), s.descriptionId ||= bt(void 0, "reka-dialog-description"), ee(() => {
      s.contentElement = a, le() !== document.body && (s.triggerElement.value = le());
    }), process.env.NODE_ENV !== "production" && Sr({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: s.titleId,
      descriptionId: s.descriptionId,
      contentElement: a
    }), (o, u) => (w(), $(f(yr), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (l) => n("openAutoFocus", l)),
      onUnmountAutoFocus: u[6] || (u[6] = (l) => n("closeAutoFocus", l))
    }, {
      default: B(() => [W(f(cr), Q({
        id: f(s).contentId,
        ref: f(r),
        as: o.as,
        "as-child": o.asChild,
        "disable-outside-pointer-events": o.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": f(s).descriptionId,
        "aria-labelledby": f(s).titleId,
        "data-state": f(br)(f(s).open.value)
      }, o.$attrs, {
        onDismiss: u[0] || (u[0] = (l) => f(s).onOpenChange(!1)),
        onEscapeKeyDown: u[1] || (u[1] = (l) => n("escapeKeyDown", l)),
        onFocusOutside: u[2] || (u[2] = (l) => n("focusOutside", l)),
        onInteractOutside: u[3] || (u[3] = (l) => n("interactOutside", l)),
        onPointerDownOutside: u[4] || (u[4] = (l) => n("pointerDownOutside", l))
      }), {
        default: B(() => [H(o.$slots, "default")]),
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
}), Pn = Cr, Er = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, s = ke(), r = It(n), { forwardRef: a, currentElement: o } = re();
    return Gs(o), (u, l) => (w(), $(Pn, Q({
      ...t,
      ...f(r)
    }, {
      ref: f(a),
      "trap-focus": f(s).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: l[0] || (l[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), f(s).triggerElement.value?.focus());
      }),
      onPointerDownOutside: l[1] || (l[1] = (c) => {
        const d = c.detail.originalEvent, p = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || p) && c.preventDefault();
      }),
      onFocusOutside: l[2] || (l[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: B(() => [H(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Tr = Er, _r = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, s = It(e);
    re();
    const r = ke(), a = I(!1), o = I(!1);
    return (u, l) => (w(), $(Pn, Q({
      ...t,
      ...f(s)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: l[0] || (l[0] = (c) => {
        c.defaultPrevented || (a.value || f(r).triggerElement.value?.focus(), c.preventDefault()), a.value = !1, o.value = !1;
      }),
      onInteractOutside: l[1] || (l[1] = (c) => {
        c.defaultPrevented || (a.value = !0, c.detail.originalEvent.type === "pointerdown" && (o.value = !0));
        const d = c.target;
        f(r).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && o.value && c.preventDefault();
      })
    }), {
      default: B(() => [H(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), xr = _r, Pr = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, s = ke(), r = It(n), { forwardRef: a } = re();
    return (o, u) => (w(), $(f(Mt), { present: o.forceMount || f(s).open.value }, {
      default: B(() => [f(s).modal.value ? (w(), $(Tr, Q({
        key: 0,
        ref: f(a)
      }, {
        ...t,
        ...f(r),
        ...o.$attrs
      }), {
        default: B(() => [H(o.$slots, "default")]),
        _: 3
      }, 16)) : (w(), $(xr, Q({
        key: 1,
        ref: f(a)
      }, {
        ...t,
        ...f(r),
        ...o.$attrs
      }), {
        default: B(() => [H(o.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Ir = Pr, Mr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = ke();
    return qs(!0), re(), (t, n) => (w(), $(f(he), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": f(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: B(() => [H(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), Dr = Mr, Lr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = ke(), { forwardRef: t } = re();
    return (n, s) => f(e)?.modal.value ? (w(), $(f(Mt), {
      key: 0,
      present: n.forceMount || f(e).open.value
    }, {
      default: B(() => [W(Dr, Q(n.$attrs, {
        ref: f(t),
        as: n.as,
        "as-child": n.asChild
      }), {
        default: B(() => [H(n.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : q("v-if", !0);
  }
}), $r = Lr, Ar = /* @__PURE__ */ R({
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
  setup(i) {
    const e = /* @__PURE__ */ Os();
    return (t, n) => f(e) || t.forceMount ? (w(), $(ei, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [H(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : q("v-if", !0);
  }
}), Or = Ar, Rr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i;
    return (t, n) => (w(), $(f(Or), ti(ni(e)), {
      default: B(() => [H(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Br = Rr, zr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i, t = ke();
    return re(), (n, s) => (w(), $(f(he), Q(e, { id: f(t).titleId }), {
      default: B(() => [H(n.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Fr = zr;
const Xt = "data-reka-collection-item";
function Nr(i = {}) {
  const { key: e = "", isProvider: t = !1 } = i, n = `${e}CollectionProvider`;
  let s;
  if (t) {
    const c = I(/* @__PURE__ */ new Map());
    s = {
      collectionRef: I(),
      itemMap: c
    }, Be(n, s);
  } else s = Re(n);
  const r = (c = !1) => {
    const d = s.collectionRef.value;
    if (!d) return [];
    const p = Array.from(d.querySelectorAll(`[${Xt}]`)), v = Array.from(s.itemMap.value.values()).sort((y, m) => p.indexOf(y.ref) - p.indexOf(m.ref));
    return c ? v : v.filter((y) => y.ref.dataset.disabled !== "");
  }, a = R({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: h, currentElement: v } = wt();
      return U(v, () => {
        s.collectionRef.value = v.value;
      }), () => ce(kt, {
        ref: h,
        ...p
      }, d);
    }
  }), o = R({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: h, currentElement: v } = wt();
      return me((y) => {
        if (v.value) {
          const m = ii(v.value);
          s.itemMap.value.set(m, {
            ref: v.value,
            value: c.value
          }), y(() => s.itemMap.value.delete(m));
        }
      }), () => ce(kt, {
        ...p,
        [Xt]: "",
        ref: h
      }, d);
    }
  }), u = T(() => Array.from(s.itemMap.value.values())), l = T(() => s.itemMap.value.size);
  return {
    getItems: r,
    reactiveItems: u,
    itemMapSize: l,
    CollectionSlot: a,
    CollectionItem: o
  };
}
const Wr = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function qr(i, e) {
  return e !== "rtl" ? i : i === "ArrowLeft" ? "ArrowRight" : i === "ArrowRight" ? "ArrowLeft" : i;
}
function jr(i, e, t) {
  const n = qr(i.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(n)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(n)))
    return Wr[n];
}
function Hr(i, e = !1) {
  const t = le();
  for (const n of i)
    if (n === t || (n.focus({ preventScroll: e }), le() !== t)) return;
}
function Vr(i, e) {
  return i.map((t, n) => i[(e + n) % i.length]);
}
const [Ur] = Ne("RovingFocusGroup");
var Kr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i, t = Ur(), n = bt(), s = T(() => e.tabStopId || n), r = T(() => t.currentTabStopId.value === s.value), { getItems: a, CollectionItem: o } = Nr();
    ee(() => {
      e.focusable && t.onFocusableItemAdd();
    }), Fe(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function u(l) {
      if (l.key === "Tab" && l.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (l.target !== l.currentTarget) return;
      const c = jr(l, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (l.metaKey || l.ctrlKey || l.altKey || !e.allowShiftKey && l.shiftKey) return;
        l.preventDefault();
        let d = [...a().map((p) => p.ref).filter((p) => p.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const p = d.indexOf(l.currentTarget);
          d = t.loop.value ? Vr(d, p + 1) : d.slice(p + 1);
        }
        de(() => Hr(d));
      }
    }
    return (l, c) => (w(), $(f(o), null, {
      default: B(() => [W(f(he), {
        tabindex: r.value ? 0 : -1,
        "data-orientation": f(t).orientation.value,
        "data-active": l.active ? "" : void 0,
        "data-disabled": l.focusable ? void 0 : "",
        as: l.as,
        "as-child": l.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          l.focusable ? f(t).onItemFocus(s.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => f(t).onItemFocus(s.value)),
        onKeydown: u
      }, {
        default: B(() => [H(l.$slots, "default")]),
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
}), Xr = Kr, Gr = /* @__PURE__ */ R({
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
  setup(i) {
    return (e, t) => (w(), $(f(he), {
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
      default: B(() => [H(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Yr = Gr, Jr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i, { primitiveElement: t, currentElement: n } = wt(), s = T(() => e.checked ?? e.value);
    return U(s, (r, a) => {
      if (!n.value) return;
      const o = n.value, u = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(u, "value").set;
      if (c && r !== a) {
        const d = new Event("input", { bubbles: !0 }), p = new Event("change", { bubbles: !0 });
        c.call(o, r), o.dispatchEvent(d), o.dispatchEvent(p);
      }
    }), (r, a) => (w(), $(Yr, Q({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...r.$attrs
    }, { as: "input" }), null, 16));
  }
}), Gt = Jr, Zr = /* @__PURE__ */ R({
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
  setup(i) {
    const e = i, t = T(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), n = T(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((s, r) => typeof s == "object" ? Object.entries(s).map(([a, o]) => ({
      name: `${e.name}[${r}][${a}]`,
      value: o
    })) : {
      name: `${e.name}[${r}]`,
      value: s
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([s, r]) => ({
      name: `${e.name}[${s}]`,
      value: r
    })) : []);
    return (s, r) => (w(), L(ae, null, [q(" We render single input if it's required "), t.value ? (w(), $(Gt, Q({ key: s.name }, {
      ...e,
      ...s.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"])) : (w(!0), L(ae, { key: 1 }, xe(n.value, (a) => (w(), $(Gt, Q({ key: a.name }, { ref_for: !0 }, {
      ...e,
      ...s.$attrs
    }, {
      name: a.name,
      value: a.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Qr = Zr;
const [ea] = Ne("CheckboxGroupRoot");
function Ze(i) {
  return i === "indeterminate";
}
function In(i) {
  return Ze(i) ? "indeterminate" : i ? "checked" : "unchecked";
}
const [ta, na] = Ne("CheckboxRoot");
var ia = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = i, n = e, { forwardRef: s, currentElement: r } = re(), a = ea(null), o = /* @__PURE__ */ Cn(t, "modelValue", n, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), u = T(() => a?.disabled.value || t.disabled), l = T(() => Je(a?.modelValue.value) ? o.value === "indeterminate" ? "indeterminate" : o.value : jt(a.modelValue.value, t.value));
    function c() {
      if (Je(a?.modelValue.value))
        o.value = Ze(o.value) ? !0 : !o.value;
      else {
        const h = [...a.modelValue.value || []];
        if (jt(h, t.value)) {
          const v = h.findIndex((y) => gt(y, t.value));
          h.splice(v, 1);
        } else h.push(t.value);
        a.modelValue.value = h;
      }
    }
    const d = Hs(r), p = T(() => t.id && r.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return na({
      disabled: u,
      state: l
    }), (h, v) => (w(), $(ln(f(a)?.rovingFocus.value ? f(Xr) : f(he)), Q(h.$attrs, {
      id: h.id,
      ref: f(s),
      role: "checkbox",
      "as-child": h.asChild,
      as: h.as,
      type: h.as === "button" ? "button" : void 0,
      "aria-checked": f(Ze)(l.value) ? "mixed" : l.value,
      "aria-required": h.required,
      "aria-label": h.$attrs["aria-label"] || p.value,
      "data-state": f(In)(l.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: f(a)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: si(St(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: B(() => [H(h.$slots, "default", {
        modelValue: f(o),
        state: l.value
      }), f(d) && h.name && !f(a) ? (w(), $(f(Qr), {
        key: 0,
        type: "checkbox",
        checked: !!l.value,
        name: h.name,
        value: h.value,
        disabled: u.value,
        required: h.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : q("v-if", !0)]),
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
}), sa = ia, ra = /* @__PURE__ */ R({
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
  setup(i) {
    const { forwardRef: e } = re(), t = ta();
    return (n, s) => (w(), $(f(Mt), { present: n.forceMount || f(Ze)(f(t).state.value) || f(t).state.value === !0 }, {
      default: B(() => [W(f(he), Q({
        ref: f(e),
        "data-state": f(In)(f(t).state.value),
        "data-disabled": f(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": n.asChild,
        as: n.as
      }, n.$attrs), {
        default: B(() => [H(n.$slots, "default")]),
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
}), aa = ra;
const oa = /* @__PURE__ */ R({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(i) {
    return (e, t) => (w(), $(f(sa), {
      "model-value": i.modelValue,
      "aria-label": i.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (n) => e.$emit("update:modelValue", !!n)),
      onClick: t[1] || (t[1] = St(() => {
      }, ["stop"]))
    }, {
      default: B(() => [
        W(f(aa), { class: "checkbox-indicator" }, {
          default: B(() => [
            W(f(vn), {
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
}), la = /* @__PURE__ */ K(oa, [["__scopeId", "data-v-024ee78b"]]), Mn = /* @__PURE__ */ Symbol("turnSelection");
function Yt(i) {
  return i.words.length > 0 ? i.words.map((e) => e.text).join(" ") : i.text ?? "";
}
function ua(i, e, t) {
  const n = Qe(/* @__PURE__ */ new Map());
  let s = null;
  const r = T(() => n.size), a = T(() => n.size > 0);
  function o(C) {
    return n.has(C);
  }
  function u(C) {
    n.has(C) ? n.delete(C) : n.set(C, !0), s = C;
  }
  function l(C) {
    if (s === null) {
      u(C);
      return;
    }
    const k = i.value.map((S) => S.id), g = k.indexOf(s), b = k.indexOf(C);
    if (g === -1 || b === -1) {
      u(C);
      return;
    }
    const _ = Math.min(g, b), E = Math.max(g, b);
    for (let S = _; S <= E; S++) {
      const A = k[S];
      A != null && n.set(A, !0);
    }
  }
  function c() {
    n.clear(), s = null;
  }
  async function d() {
    const k = i.value.filter((g) => n.has(g.id)).map(Yt).join(`

`);
    await navigator.clipboard.writeText(k);
  }
  async function p() {
    const k = i.value.filter((g) => n.has(g.id)).map((g) => {
      const _ = (g.speakerId ? e.get(g.speakerId) : void 0)?.name ?? "", E = g.startTime != null ? Ae(g.startTime) : "", S = [_, E].filter(Boolean).join(" (") + (E ? ")" : ""), A = Yt(g);
      return S ? `${S}
${A}` : A;
    });
    await navigator.clipboard.writeText(k.join(`

`));
  }
  U(
    () => i.value,
    (C) => {
      if (n.size === 0) return;
      const k = new Set(C.map((g) => g.id));
      for (const g of [...n.keys()])
        k.has(g) || n.delete(g);
    }
  );
  const h = t.on("channel:change", c), v = t.on("translation:change", c);
  function y(C) {
    C.key === "Escape" && n.size > 0 && c();
  }
  ee(() => {
    document.addEventListener("keydown", y);
  }), ge(() => {
    document.removeEventListener("keydown", y), h(), v();
  });
  const m = {
    count: r,
    hasSelection: a,
    isSelected: o,
    toggle: u,
    selectRange: l,
    clear: c,
    copyText: d,
    copyWithMetadata: p
  };
  return Be(Mn, m), m;
}
function Dn() {
  const i = Re(Mn);
  if (!i)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return i;
}
const ca = ["data-turn-active", "aria-selected"], da = { class: "turn-text" }, ha = ["data-word-active"], fa = /* @__PURE__ */ R({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(i) {
    const e = i, t = ye(), n = Dn(), { t: s } = se(), r = T(() => e.turn.words.length > 0), a = T(() => {
      if (!t.audio?.src.value || !r.value) return null;
      const h = t.audio.currentTime.value, { startTime: v, endTime: y, words: m } = e.turn;
      return v == null || y == null || h < v || h > y ? null : Pi(m, h);
    }), o = T(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || fn(e.turn.words)) return !1;
      const h = t.audio.currentTime.value;
      return h >= e.turn.startTime && h <= e.turn.endTime;
    }), u = T(() => e.speaker?.color ?? "transparent"), l = T(() => n.isSelected(e.turn.id)), c = T(() => {
      const h = e.speaker?.name ?? "", v = l.value ? "selection.deselect" : "selection.select";
      return s(v).replace("{name}", h);
    });
    function d(h) {
      h.shiftKey ? n.selectRange(e.turn.id) : n.toggle(e.turn.id);
    }
    function p(h) {
      h.shiftKey ? n.selectRange(e.turn.id) : n.toggle(e.turn.id);
    }
    return (h, v) => (w(), L("section", {
      class: ve(["turn", {
        "turn--active": o.value,
        "turn--partial": i.partial,
        "turn--selected": l.value
      }]),
      "data-turn-active": o.value || i.partial || i.live || void 0,
      style: ze({ "--speaker-color": u.value }),
      "aria-selected": f(n).hasSelection.value ? l.value : void 0
    }, [
      i.partial ? q("", !0) : (w(), L("div", {
        key: 0,
        class: "turn-header",
        onClick: d
      }, [
        f(n).hasSelection.value ? (w(), $(la, {
          key: 0,
          "model-value": l.value,
          "aria-label": c.value,
          onClick: St(p, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : q("", !0),
        W(Cs, {
          speaker: i.speaker,
          "start-time": i.turn.startTime,
          "start-date": i.turn.startDate,
          language: i.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])
      ])),
      O("p", da, [
        r.value ? (w(!0), L(ae, { key: 0 }, xe(i.turn.words, (y, m) => (w(), L(ae, {
          key: y.id
        }, [
          O("span", {
            class: ve({ "word--active": y.id === a.value }),
            "data-word-active": y.id === a.value || void 0
          }, N(y.text), 11, ha),
          ie(N(m < i.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : i.turn.text ? (w(), L(ae, { key: 1 }, [
          ie(N(i.turn.text), 1)
        ], 64)) : q("", !0)
      ])
    ], 14, ca));
  }
}), Jt = /* @__PURE__ */ K(fa, [["__scopeId", "data-v-218f5091"]]), pa = {}, va = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function ma(i, e) {
  return w(), L("svg", va, [...e[0] || (e[0] = [
    ri('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const ga = /* @__PURE__ */ K(pa, [["render", ma]]), ya = { class: "transcription-empty" }, ba = { class: "message" }, ka = /* @__PURE__ */ R({
  __name: "TranscriptionEmpty",
  setup(i) {
    const { t: e } = se();
    return (t, n) => (w(), L("div", ya, [
      W(ga, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      O("p", ba, N(f(e)("transcription.empty")), 1)
    ]));
  }
}), wa = /* @__PURE__ */ K(ka, [["__scopeId", "data-v-f82737e5"]]), Sa = { class: "transcription-panel" }, Ca = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Ea = { class: "turns-container" }, Ta = {
  key: 0,
  class: "history-loading",
  role: "status"
}, _a = {
  key: 1,
  class: "history-start"
}, xa = /* @__PURE__ */ R({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(i) {
    const e = i, { t } = se(), n = ye(), s = $e("scrollContainer"), r = T(() => {
      const k = n.live?.partial.value ?? null;
      return k === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: k,
        words: [],
        language: n.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), a = T(() => n.live?.hasLiveUpdate.value ?? !1), o = T(() => n.audio?.isPlaying.value ?? !1), u = T(
      () => n.activeChannel.value.activeTranslation.value
    ), l = T(() => n.activeChannel.value), c = T(
      () => l.value.isLoadingHistory.value
    ), d = T(() => l.value.hasMoreHistory.value), { scrollRef: p, contentRef: h, isAtBottom: v, scrollToBottom: y } = ms();
    ee(() => {
      p.value = s.value, h.value = s.value?.querySelector(".turns-container") ?? null;
    });
    const m = Ei(() => {
      const k = l.value;
      k.hasMoreHistory.value && (k.isLoadingHistory.value || e.turns.length !== 0 && n.emit("scroll:top", { translationId: u.value.id }));
    }, 500);
    function C() {
      const k = s.value;
      k && k.scrollTop < 100 && m();
    }
    return U(
      () => e.turns,
      (k, g) => {
        const b = k.length, _ = g.length;
        if (b > _ && !v.value && k[0]?.id != g[0]?.id) {
          const E = b - _, S = e.turns[E]?.id;
          if (!S || !p.value) return;
          de(() => {
            p.value?.querySelector(
              `[data-turn-id="${S}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), ee(() => {
      s.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), ge(() => {
      s.value?.removeEventListener("scroll", C);
    }), (k, g) => (w(), L("article", Sa, [
      O("div", Ca, [
        O("div", Ea, [
          c.value ? (w(), L("div", Ta, [...g[3] || (g[3] = [
            O("progress", null, null, -1)
          ])])) : q("", !0),
          !d.value && i.turns.length > 0 ? (w(), L("div", _a, N(f(t)("transcription.historyStart")), 1)) : q("", !0),
          i.turns.length === 0 && !c.value && !r.value ? (w(), $(wa, {
            key: 2,
            class: "transcription-empty"
          })) : q("", !0),
          (w(!0), L(ae, null, xe(i.turns, (b, _, E, S) => {
            const A = [
              b,
              i.speakers.get(b.speakerId ?? ""),
              a.value && !r.value && _ === i.turns.length - 1
            ];
            if (S && S.key === b.id && ai(S, A)) return S;
            const D = (w(), $(Jt, {
              "data-turn-id": b.id,
              key: b.id,
              turn: b,
              speaker: b.speakerId ? i.speakers.get(b.speakerId) : void 0,
              live: a.value && !r.value && _ === i.turns.length - 1
            }, null, 8, ["data-turn-id", "turn", "speaker", "live"]));
            return D.memo = A, D;
          }, g, 0), 128)),
          r.value ? (w(), $(Jt, {
            key: "__partial__",
            turn: r.value,
            partial: ""
          }, null, 8, ["turn"])) : q("", !0)
        ]),
        W(Ct, { name: "fade-slide" }, {
          default: B(() => [
            !f(v) && (o.value || a.value) ? (w(), $(ne, {
              key: 0,
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": f(t)("transcription.resumeScroll"),
              onClick: g[2] || (g[2] = (b) => f(y)())
            }, {
              default: B(() => [
                ie(N(f(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : q("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), Pa = /* @__PURE__ */ K(xa, [["__scopeId", "data-v-a27efea3"]]), Ia = { class: "switch" }, Ma = ["id", "checked"], Da = ["for"], La = /* @__PURE__ */ R({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(i, { emit: e }) {
    const t = i, n = e, s = t.id ?? hn();
    return (r, a) => (w(), L("div", Ia, [
      O("input", {
        type: "checkbox",
        id: f(s),
        checked: i.modelValue,
        onChange: a[0] || (a[0] = (o) => n("update:modelValue", o.target.checked))
      }, null, 40, Ma),
      O("label", { for: f(s) }, [...a[1] || (a[1] = [
        O("div", { class: "switch-slider" }, null, -1)
      ])], 8, Da)
    ]));
  }
}), ct = /* @__PURE__ */ K(La, [["__scopeId", "data-v-2aa0332f"]]), $a = { class: "sidebar-select-field" }, Aa = ["for"], Oa = ["id", "value", "aria-label"], Ra = ["value"], Ba = /* @__PURE__ */ R({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {},
    label: {}
  },
  emits: ["update:selectedValue"],
  setup(i, { emit: e }) {
    const t = e, n = hn();
    return (s, r) => (w(), L("div", $a, [
      i.label ? (w(), L("label", {
        key: 0,
        for: f(n),
        class: "sidebar-select-label"
      }, N(i.label), 9, Aa)) : q("", !0),
      O("select", {
        id: f(n),
        class: "sidebar-select",
        value: i.selectedValue,
        "aria-label": i.label ? void 0 : i.ariaLabel,
        onChange: r[0] || (r[0] = (a) => t("update:selectedValue", a.target.value))
      }, [
        (w(!0), L(ae, null, xe(i.items, (a) => (w(), L("option", {
          key: a.value,
          value: a.value
        }, N(a.label), 9, Ra))), 128))
      ], 40, Oa)
    ]));
  }
}), Ln = /* @__PURE__ */ K(Ba, [["__scopeId", "data-v-fc926569"]]), $n = /* @__PURE__ */ R({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(i, { emit: e }) {
    const t = i, n = e, { t: s } = se(), r = T(
      () => t.channels.map((a) => ({ value: a.id, label: a.name }))
    );
    return (a, o) => (w(), $(Ln, {
      items: r.value,
      "selected-value": i.selectedChannelId,
      ariaLabel: f(s)("header.channelLabel"),
      label: f(s)("sidebar.channelSelectLabel"),
      "onUpdate:selectedValue": o[0] || (o[0] = (u) => n("update:selectedChannelId", u))
    }, null, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), za = { class: "translation-row" }, Fa = {
  key: 0,
  class: "translation-row-badge"
}, Na = {
  key: 0,
  class: "translation-trigger-badge"
}, Wa = /* @__PURE__ */ R({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(i, { emit: e }) {
    const t = i, n = e, { t: s, locale: r } = se(), a = T(
      () => Ci(
        t.translations,
        r.value,
        s("sidebar.originalLanguage"),
        s("language.wildcard")
      )
    );
    return (o, u) => (w(), $(Ln, {
      items: a.value,
      "selected-value": i.selectedTranslationId,
      ariaLabel: f(s)("sidebar.translationLabel"),
      label: f(s)("sidebar.translationSelectLabel"),
      "onUpdate:selectedValue": u[0] || (u[0] = (l) => n("update:selectedTranslationId", l))
    }, {
      item: B(({ item: l }) => [
        O("span", za, [
          l.originalLabel ? (w(), L("strong", Fa, N(l.originalLabel), 1)) : q("", !0),
          O("span", null, N(l.label), 1)
        ])
      ]),
      trigger: B(({ item: l }) => [
        l?.originalLabel ? (w(), L("span", Na, N(l.originalLabel), 1)) : q("", !0),
        O("span", null, N(l?.label ?? ""), 1)
      ]),
      _: 1
    }, 8, ["items", "selected-value", "ariaLabel", "label"]));
  }
}), An = /* @__PURE__ */ K(Wa, [["__scopeId", "data-v-602f3a37"]]), qa = { class: "speaker-sidebar" }, ja = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Ha = { class: "sidebar-title" }, Va = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Ua = { class: "sidebar-title" }, Ka = {
  key: 2,
  class: "sidebar-section"
}, Xa = { class: "sidebar-title" }, Ga = { class: "subtitle-toggle" }, Ya = { class: "subtitle-toggle-label" }, Ja = { class: "subtitle-slider" }, Za = { class: "subtitle-slider-label" }, Qa = { class: "subtitle-slider-value" }, eo = ["value", "disabled"], to = {
  key: 0,
  class: "subtitle-toggle"
}, no = { class: "subtitle-toggle-label" }, io = {
  key: 1,
  class: "subtitle-toggle"
}, so = { class: "subtitle-toggle-label" }, ro = {
  key: 3,
  class: "sidebar-section"
}, ao = { class: "sidebar-title" }, oo = { class: "speaker-list" }, lo = { class: "speaker-name" }, uo = /* @__PURE__ */ R({
  __name: "SpeakerSidebar",
  props: {
    speakers: {},
    channels: {},
    selectedChannelId: {},
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedChannelId", "update:selectedTranslationId"],
  setup(i) {
    const e = ye(), { t } = se();
    return (n, s) => (w(), L("aside", qa, [
      i.channels.length > 1 ? (w(), L("section", ja, [
        O("h2", Ha, N(f(t)("sidebar.channel")), 1),
        W($n, {
          channels: i.channels,
          "selected-channel-id": i.selectedChannelId,
          "onUpdate:selectedChannelId": s[0] || (s[0] = (r) => n.$emit("update:selectedChannelId", r))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : q("", !0),
      i.translations.length > 1 ? (w(), L("section", Va, [
        O("h2", Ua, N(f(t)("sidebar.translation")), 1),
        W(An, {
          translations: i.translations,
          "selected-translation-id": i.selectedTranslationId,
          "onUpdate:selectedTranslationId": s[1] || (s[1] = (r) => n.$emit("update:selectedTranslationId", r))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : q("", !0),
      f(e).subtitle ? (w(), L("section", Ka, [
        O("h2", Xa, N(f(t)("sidebar.subtitle")), 1),
        O("div", Ga, [
          O("span", Ya, N(f(t)("subtitle.show")), 1),
          W(ct, {
            modelValue: f(e).subtitle.isVisible.value,
            "onUpdate:modelValue": s[2] || (s[2] = (r) => f(e).subtitle.isVisible.value = r)
          }, null, 8, ["modelValue"])
        ]),
        O("label", Ja, [
          O("span", Za, [
            ie(N(f(t)("subtitle.fontSize")) + " ", 1),
            O("span", Qa, N(f(e).subtitle.fontSize.value) + "px", 1)
          ]),
          O("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: f(e).subtitle.fontSize.value,
            disabled: !f(e).subtitle.isVisible.value,
            onInput: s[3] || (s[3] = (r) => f(e).subtitle.fontSize.value = Number(r.target.value))
          }, null, 40, eo)
        ]),
        f(e).subtitle.watermark && !f(e).subtitle.watermark.readonly ? (w(), L("div", to, [
          O("span", no, N(f(t)("subtitle.showWatermark")), 1),
          W(ct, {
            modelValue: f(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": s[4] || (s[4] = (r) => f(e).subtitle.watermark.display.value = r),
            disabled: !f(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : q("", !0),
        f(e).subtitle.watermark && !f(e).subtitle.watermark.readonly && f(e).subtitle.watermark.display.value ? (w(), L("div", io, [
          O("span", so, N(f(t)("subtitle.pinWatermark")), 1),
          W(ct, {
            modelValue: f(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": s[5] || (s[5] = (r) => f(e).subtitle.watermark.pinned.value = r),
            disabled: !f(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : q("", !0)
      ])) : q("", !0),
      i.speakers.length ? (w(), L("section", ro, [
        O("h2", ao, N(f(t)("sidebar.speakers")), 1),
        O("ul", oo, [
          (w(!0), L(ae, null, xe(i.speakers, (r) => (w(), L("li", {
            key: r.id,
            class: "speaker-item"
          }, [
            W(bn, {
              color: r.color
            }, null, 8, ["color"]),
            O("span", lo, N(r.name), 1)
          ]))), 128))
        ])
      ])) : q("", !0)
    ]));
  }
}), Zt = /* @__PURE__ */ K(uo, [["__scopeId", "data-v-749c56f0"]]), co = /* @__PURE__ */ R({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(i) {
    const e = oi(i, "open"), { t } = se();
    return (n, s) => (w(), $(f(nr), {
      open: e.value,
      "onUpdate:open": s[0] || (s[0] = (r) => e.value = r)
    }, {
      default: B(() => [
        W(f(Br), { disabled: "" }, {
          default: B(() => [
            W(f($r), { class: "editor-overlay" }),
            W(f(Ir), { class: "sidebar-drawer" }, {
              default: B(() => [
                W(f(Fr), { class: "sr-only" }, {
                  default: B(() => [
                    ie(N(f(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                W(f(sr), {
                  class: "sidebar-close",
                  "aria-label": f(t)("header.closeSidebar")
                }, {
                  default: B(() => [
                    W(f(_t), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                H(n.$slots, "default")
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
}), ho = { class: "player-controls" }, fo = { class: "controls-left" }, po = { class: "controls-time" }, vo = { class: "time-display" }, mo = { class: "time-display" }, go = { class: "controls-right" }, yo = ["value", "aria-label", "disabled"], bo = /* @__PURE__ */ R({
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
  setup(i, { emit: e }) {
    const t = e, { t: n } = se(), s = I(!1);
    function r(a) {
      const o = a.target;
      t("update:volume", parseFloat(o.value));
    }
    return (a, o) => (w(), L("div", ho, [
      O("div", fo, [
        W(ne, {
          variant: "transparent",
          icon: "skip-back",
          class: "skip-button",
          "aria-label": f(n)("player.skipBack"),
          disabled: !i.isReady,
          onClick: o[0] || (o[0] = (u) => t("skipBack"))
        }, null, 8, ["aria-label", "disabled"]),
        W(ne, {
          variant: "transparent",
          icon: i.isPlaying ? "pause" : "play",
          class: "play-button",
          "aria-label": i.isPlaying ? f(n)("player.pause") : f(n)("player.play"),
          disabled: !i.isReady,
          onClick: o[1] || (o[1] = (u) => t("togglePlay"))
        }, null, 8, ["icon", "aria-label", "disabled"]),
        W(ne, {
          variant: "transparent",
          icon: "skip-forward",
          class: "skip-button",
          "aria-label": f(n)("player.skipForward"),
          disabled: !i.isReady,
          onClick: o[2] || (o[2] = (u) => t("skipForward"))
        }, null, 8, ["aria-label", "disabled"])
      ]),
      O("div", po, [
        O("time", vo, N(i.currentTime), 1),
        o[7] || (o[7] = O("span", { class: "time-separator" }, "/", -1)),
        O("time", mo, N(i.duration), 1)
      ]),
      O("div", go, [
        O("div", {
          class: "volume-group",
          onMouseenter: o[4] || (o[4] = (u) => s.value = !0),
          onMouseleave: o[5] || (o[5] = (u) => s.value = !1)
        }, [
          W(ne, {
            variant: "transparent",
            icon: i.isMuted ? "volume-mute" : "volume",
            "aria-label": i.isMuted ? f(n)("player.unmute") : f(n)("player.mute"),
            disabled: !i.isReady,
            onClick: o[3] || (o[3] = (u) => t("toggleMute"))
          }, null, 8, ["icon", "aria-label", "disabled"]),
          li(O("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: i.volume,
            "aria-label": f(n)("player.volume"),
            disabled: !i.isReady,
            onInput: r
          }, null, 40, yo), [
            [ui, s.value]
          ])
        ], 32),
        W(ne, {
          variant: "transparent",
          class: "speed-button",
          "aria-label": f(n)("player.speed"),
          disabled: !i.isReady,
          onClick: o[6] || (o[6] = (u) => t("cyclePlaybackRate"))
        }, {
          default: B(() => [
            ie(N(i.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), ko = /* @__PURE__ */ K(bo, [["__scopeId", "data-v-2dcb93b1"]]);
function J(i, e, t, n) {
  return new (t || (t = Promise))((function(s, r) {
    function a(l) {
      try {
        u(n.next(l));
      } catch (c) {
        r(c);
      }
    }
    function o(l) {
      try {
        u(n.throw(l));
      } catch (c) {
        r(c);
      }
    }
    function u(l) {
      var c;
      l.done ? s(l.value) : (c = l.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(a, o);
    }
    u((n = n.apply(i, e || [])).next());
  }));
}
let We = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, n) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), n?.once) {
      const s = (...r) => {
        this.un(e, s), t(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var n;
    (n = this.listeners[e]) === null || n === void 0 || n.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((n) => n(...t)));
  }
};
const Ve = { decode: function(i, e) {
  return J(this, void 0, void 0, (function* () {
    const t = new AudioContext({ sampleRate: e });
    try {
      return yield t.decodeAudioData(i);
    } finally {
      t.close();
    }
  }));
}, createBuffer: function(i, e) {
  if (!i || i.length === 0) throw new Error("channelData must be a non-empty array");
  if (e <= 0) throw new Error("duration must be greater than 0");
  if (typeof i[0] == "number" && (i = [i]), !i[0] || i[0].length === 0) throw new Error("channelData must contain non-empty channel arrays");
  (function(n) {
    const s = n[0];
    if (s.some(((r) => r > 1 || r < -1))) {
      const r = s.length;
      let a = 0;
      for (let o = 0; o < r; o++) {
        const u = Math.abs(s[o]);
        u > a && (a = u);
      }
      for (const o of n) for (let u = 0; u < r; u++) o[u] /= a;
    }
  })(i);
  const t = i.map(((n) => n instanceof Float32Array ? n : Float32Array.from(n)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (n) => {
    const s = t[n];
    if (!s) throw new Error(`Channel ${n} not found`);
    return s;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function On(i, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, i) : document.createElement(i);
  for (const [n, s] of Object.entries(e)) if (n === "children" && s) for (const [r, a] of Object.entries(s)) a instanceof Node ? t.appendChild(a) : typeof a == "string" ? t.appendChild(document.createTextNode(a)) : t.appendChild(On(r, a));
  else n === "style" ? Object.assign(t.style, s) : n === "textContent" ? t.textContent = s : t.setAttribute(n, s.toString());
  return t;
}
function Qt(i, e, t) {
  const n = On(i, e || {});
  return t?.appendChild(n), n;
}
var wo = Object.freeze({ __proto__: null, createElement: Qt, default: Qt });
const So = { fetchBlob: function(i, e, t) {
  return J(this, void 0, void 0, (function* () {
    const n = yield fetch(i, t);
    if (n.status >= 400) throw new Error(`Failed to fetch ${i}: ${n.status} (${n.statusText})`);
    return (function(s, r) {
      J(this, void 0, void 0, (function* () {
        if (!s.body || !s.headers) return;
        const a = s.body.getReader(), o = Number(s.headers.get("Content-Length")) || 0;
        let u = 0;
        const l = (c) => {
          u += c?.length || 0;
          const d = Math.round(u / o * 100);
          r(d);
        };
        try {
          for (; ; ) {
            const c = yield a.read();
            if (c.done) break;
            l(c.value);
          }
        } catch (c) {
          console.warn("Progress tracking error:", c);
        }
      }));
    })(n.clone(), e), n.blob();
  }));
} };
function X(i) {
  let e = i;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(n) {
    Object.is(e, n) || (e = n, t.forEach(((s) => s(e))));
  }, update(n) {
    this.set(n(e));
  }, subscribe: (n) => (t.add(n), () => t.delete(n)) };
}
function Ce(i, e) {
  const t = X(i());
  return e.forEach(((n) => n.subscribe((() => {
    const s = i();
    Object.is(t.value, s) || t.set(s);
  })))), { get value() {
    return t.value;
  }, subscribe: (n) => t.subscribe(n) };
}
function pe(i, e) {
  let t;
  const n = () => {
    t && (t(), t = void 0), t = i();
  }, s = e.map(((r) => r.subscribe(n)));
  return n(), () => {
    t && (t(), t = void 0), s.forEach(((r) => r()));
  };
}
class Co extends We {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = X(!1), this._currentTime = X(0), this._duration = X(0), this._volume = X(this.media.volume), this._muted = X(this.media.muted), this._playbackRate = X(this.media.playbackRate || 1), this._seeking = X(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
  onMediaEvent(e, t, n) {
    return this.media.addEventListener(e, t, n), () => this.media.removeEventListener(e, t, n);
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
    const n = this.getSrc();
    if (e && n === e) return;
    this.revokeSrc();
    const s = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (n && this.media.removeAttribute("src"), s || e) try {
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
    return J(this, void 0, void 0, (function* () {
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
function Eo({ maxTop: i, maxBottom: e, halfHeight: t, vScale: n, barMinHeight: s = 0, barAlign: r }) {
  let a = Math.round(i * t * n), o = a + Math.round(e * t * n) || 1;
  return o < s && (o = s, r || (a = o / 2)), { topHeight: a, totalHeight: o };
}
function To({ barAlign: i, halfHeight: e, topHeight: t, totalHeight: n, canvasHeight: s }) {
  return i === "top" ? 0 : i === "bottom" ? s - n : e - t;
}
function en(i, e, t) {
  const n = e - i.left, s = t - i.top;
  return [n / i.width, s / i.height];
}
function Rn(i) {
  return !!(i.barWidth || i.barGap || i.barAlign);
}
function tn(i, e) {
  if (!Rn(e)) return i;
  const t = e.barWidth || 0.5, n = t + (e.barGap || t / 2);
  return n === 0 ? i : Math.floor(i / n) * n;
}
function nn({ scrollLeft: i, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const n = i / e, s = Math.floor(n * t);
  return [s - 1, s, s + 1];
}
function Bn(i) {
  const e = i._cleanup;
  typeof e == "function" && e();
}
function _o(i) {
  const e = X({ scrollLeft: i.scrollLeft, scrollWidth: i.scrollWidth, clientWidth: i.clientWidth }), t = Ce((() => (function(r) {
    const { scrollLeft: a, scrollWidth: o, clientWidth: u } = r;
    if (o === 0) return { startX: 0, endX: 1 };
    const l = a / o, c = (a + u) / o;
    return { startX: Math.max(0, Math.min(1, l)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), n = Ce((() => (function(r) {
    return { left: r.scrollLeft, right: r.scrollLeft + r.clientWidth };
  })(e.value)), [e]), s = () => {
    e.set({ scrollLeft: i.scrollLeft, scrollWidth: i.scrollWidth, clientWidth: i.clientWidth });
  };
  return i.addEventListener("scroll", s, { passive: !0 }), { scrollData: e, percentages: t, bounds: n, cleanup: () => {
    i.removeEventListener("scroll", s), Bn(e);
  } };
}
class xo extends We {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const n = this.parentFromOptionsContainer(e.container);
    this.parent = n;
    const [s, r] = this.initHtml();
    n.appendChild(s), this.container = s, this.scrollContainer = r.querySelector(".scroll"), this.wrapper = r.querySelector(".wrapper"), this.canvasWrapper = r.querySelector(".canvases"), this.progressWrapper = r.querySelector(".progress"), this.cursor = r.querySelector(".cursor"), t && r.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const n = this.wrapper.getBoundingClientRect(), [s, r] = en(n, t.clientX, t.clientY);
      this.emit("click", s, r);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const n = this.wrapper.getBoundingClientRect(), [s, r] = en(n, t.clientX, t.clientY);
      this.emit("dblclick", s, r);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = _o(this.scrollContainer);
    const e = pe((() => {
      const { startX: t, endX: n } = this.scrollStream.percentages.value, { left: s, right: r } = this.scrollStream.bounds.value;
      this.emit("scroll", t, n, s, r);
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
    this.dragStream = (function(t, n = {}) {
      const { threshold: s = 3, mouseButton: r = 0, touchDelay: a = 100 } = n, o = X(null), u = /* @__PURE__ */ new Map(), l = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (p) => {
        if (p.button !== r || (u.set(p.pointerId, p), u.size > 1)) return;
        let h = p.clientX, v = p.clientY, y = !1;
        const m = Date.now(), C = t.getBoundingClientRect(), { left: k, top: g } = C, b = (D) => {
          if (D.defaultPrevented || u.size > 1 || l && Date.now() - m < a) return;
          const x = D.clientX, M = D.clientY, F = x - h, j = M - v;
          (y || Math.abs(F) > s || Math.abs(j) > s) && (D.preventDefault(), D.stopPropagation(), y || (o.set({ type: "start", x: h - k, y: v - g }), y = !0), o.set({ type: "move", x: x - k, y: M - g, deltaX: F, deltaY: j }), h = x, v = M);
        }, _ = (D) => {
          if (u.delete(D.pointerId), y) {
            const x = D.clientX, M = D.clientY;
            o.set({ type: "end", x: x - k, y: M - g });
          }
          c();
        }, E = (D) => {
          u.delete(D.pointerId), D.relatedTarget && D.relatedTarget !== document.documentElement || _(D);
        }, S = (D) => {
          y && (D.stopPropagation(), D.preventDefault());
        }, A = (D) => {
          D.defaultPrevented || u.size > 1 || y && D.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", _), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", A, { passive: !1 }), document.addEventListener("click", S, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", A), setTimeout((() => {
            document.removeEventListener("click", S, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: o, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), u.clear(), Bn(o);
      } };
    })(this.wrapper);
    const e = pe((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const n = this.wrapper.getBoundingClientRect().width, s = (r = t.x / n) < 0 ? 0 : r > 1 ? 1 : r;
      var r;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", s)) : t.type === "move" ? this.emit("drag", s) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", s));
    }), [this.dragStream.signal]);
    this.subscriptions.push(e);
  }
  initHtml() {
    const e = document.createElement("div"), t = e.attachShadow({ mode: "open" }), n = this.options.cspNonce && typeof this.options.cspNonce == "string" ? this.options.cspNonce.replace(/"/g, "") : "";
    return t.innerHTML = `
      <style${n ? ` nonce="${n}"` : ""}>
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
    const { scrollWidth: t } = this.scrollContainer, n = t * e;
    this.setScroll(n);
  }
  destroy() {
    var e;
    this.subscriptions.forEach(((t) => t())), this.container.remove(), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null), (e = this.unsubscribeOnScroll) === null || e === void 0 || e.forEach(((t) => t())), this.unsubscribeOnScroll = [], this.dragStream && (this.dragStream.cleanup(), this.dragStream = null), this.scrollStream && (this.scrollStream.cleanup(), this.scrollStream = null);
  }
  createDelay(e = 10) {
    let t, n;
    const s = () => {
      t && (clearTimeout(t), t = void 0), n && (n(), n = void 0);
    };
    return this.timeouts.push(s), () => new Promise(((r, a) => {
      s(), n = a, t = setTimeout((() => {
        t = void 0, n = void 0, r();
      }), e);
    }));
  }
  getHeight(e, t) {
    var n;
    const s = ((n = this.audioData) === null || n === void 0 ? void 0 : n.numberOfChannels) || 1;
    return (function({ optionsHeight: r, optionsSplitChannels: a, parentHeight: o, numberOfChannels: u, defaultHeight: l = 128 }) {
      if (r == null) return l;
      const c = Number(r);
      if (!isNaN(c)) return c;
      if (r === "auto") {
        const d = o || l;
        return a?.every(((p) => !p.overlay)) ? d / u : d;
      }
      return l;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: s, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(n, s, r) {
      if (!Array.isArray(n)) return n || "";
      if (n.length === 0) return "#999";
      if (n.length < 2) return n[0] || "";
      const a = document.createElement("canvas"), o = a.getContext("2d"), u = r ?? a.height * s, l = o.createLinearGradient(0, 0, 0, u || s), c = 1 / (n.length - 1);
      return n.forEach(((d, p) => {
        l.addColorStop(p * c, d);
      })), l;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, n, s) {
    const { width: r, height: a } = n.canvas, { halfHeight: o, barWidth: u, barRadius: l, barIndexScale: c, barSpacing: d, barMinHeight: p } = (function({ width: v, height: y, length: m, options: C, pixelRatio: k }) {
      const g = y / 2, b = C.barWidth ? C.barWidth * k : 1, _ = C.barGap ? C.barGap * k : C.barWidth ? b / 2 : 0, E = b + _ || 1;
      return { halfHeight: g, barWidth: b, barGap: _, barRadius: C.barRadius || 0, barMinHeight: C.barMinHeight ? C.barMinHeight * k : 0, barIndexScale: m > 0 ? v / E / m : 0, barSpacing: E };
    })({ width: r, height: a, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: v, barIndexScale: y, barSpacing: m, barWidth: C, halfHeight: k, vScale: g, canvasHeight: b, barAlign: _, barMinHeight: E }) {
      const S = v[0] || [], A = v[1] || S, D = S.length, x = [];
      let M = 0, F = 0, j = 0;
      for (let P = 0; P <= D; P++) {
        const z = Math.round(P * y);
        if (z > M) {
          const { topHeight: we, totalHeight: ue } = Eo({ maxTop: F, maxBottom: j, halfHeight: k, vScale: g, barMinHeight: E, barAlign: _ }), Ie = To({ barAlign: _, halfHeight: k, topHeight: we, totalHeight: ue, canvasHeight: b });
          x.push({ x: M * m, y: Ie, width: C, height: ue }), M = z, F = 0, j = 0;
        }
        const Y = Math.abs(S[P] || 0), V = Math.abs(A[P] || 0);
        Y > F && (F = Y), V > j && (j = V);
      }
      return x;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: u, halfHeight: o, vScale: s, canvasHeight: a, barAlign: t.barAlign, barMinHeight: p });
    n.beginPath();
    for (const v of h) l && "roundRect" in n ? n.roundRect(v.x, v.y, v.width, v.height, l) : n.rect(v.x, v.y, v.width, v.height);
    n.fill(), n.closePath();
  }
  renderLineWaveform(e, t, n, s) {
    const { width: r, height: a } = n.canvas, o = (function({ channelData: u, width: l, height: c, vScale: d }) {
      const p = c / 2, h = u[0] || [];
      return [h, u[1] || h].map(((v, y) => {
        const m = v.length, C = m ? l / m : 0, k = p, g = y === 0 ? -1 : 1, b = [{ x: 0, y: k }];
        let _ = 0, E = 0;
        for (let S = 0; S <= m; S++) {
          const A = Math.round(S * C);
          if (A > _) {
            const x = k + (Math.round(E * p * d) || 1) * g;
            b.push({ x: _, y: x }), _ = A, E = 0;
          }
          const D = Math.abs(v[S] || 0);
          D > E && (E = D);
        }
        return b.push({ x: _, y: k }), b;
      }));
    })({ channelData: e, width: r, height: a, vScale: s });
    n.beginPath();
    for (const u of o) if (u.length) {
      n.moveTo(u[0].x, u[0].y);
      for (let l = 1; l < u.length; l++) {
        const c = u[l];
        n.lineTo(c.x, c.y);
      }
    }
    n.fill(), n.closePath();
  }
  renderWaveform(e, t, n) {
    if (n.fillStyle = this.convertColorValues(t.waveColor, n), t.renderFunction) return void t.renderFunction(e, n);
    const s = (function({ channelData: r, barHeight: a, normalize: o, maxPeak: u }) {
      var l;
      const c = a || 1;
      if (!o) return c;
      const d = r[0];
      if (!d || d.length === 0) return c;
      let p = u ?? 0;
      if (!u) for (let h = 0; h < d.length; h++) {
        const v = (l = d[h]) !== null && l !== void 0 ? l : 0, y = Math.abs(v);
        y > p && (p = y);
      }
      return p ? c / p : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Rn(t) ? this.renderBarWaveform(e, t, n, s) : this.renderLineWaveform(e, t, n, s);
  }
  renderSingleCanvas(e, t, n, s, r, a, o) {
    const u = this.getPixelRatio(), l = document.createElement("canvas");
    l.width = Math.round(n * u), l.height = Math.round(s * u), l.style.width = `${n}px`, l.style.height = `${s}px`, l.style.left = `${Math.round(r)}px`, a.appendChild(l);
    const c = l.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), l.width > 0 && l.height > 0) {
      const d = l.cloneNode(), p = d.getContext("2d");
      p.drawImage(l, 0, 0), p.globalCompositeOperation = "source-in", p.fillStyle = this.convertColorValues(t.progressColor, p), p.fillRect(0, 0, l.width, l.height), o.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, n, s, r, a) {
    const o = this.getPixelRatio(), { clientWidth: u } = this.scrollContainer, l = n / o, c = (function({ clientWidth: v, totalWidth: y, options: m }) {
      return tn(Math.min(8e3, v, y), m);
    })({ clientWidth: u, totalWidth: l, options: t });
    let d = {};
    if (c === 0) return;
    const p = (v) => {
      if (v < 0 || v >= h || d[v]) return;
      d[v] = !0;
      const y = v * c;
      let m = Math.min(l - y, c);
      if (m = tn(m, t), m <= 0) return;
      const C = (function({ channelData: k, offset: g, clampedWidth: b, totalWidth: _ }) {
        return k.map(((E) => {
          const S = Math.floor(g / _ * E.length), A = Math.floor((g + b) / _ * E.length);
          return E.slice(S, A);
        }));
      })({ channelData: e, offset: y, clampedWidth: m, totalWidth: l });
      this.renderSingleCanvas(C, t, m, s, y, r, a);
    }, h = Math.ceil(l / c);
    if (!this.isScrollable) {
      for (let v = 0; v < h; v++) p(v);
      return;
    }
    if (nn({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: l, numCanvases: h }).forEach(((v) => p(v))), h > 1) {
      const v = this.on("scroll", (() => {
        const { scrollLeft: y } = this.scrollContainer;
        Object.keys(d).length > 10 && (r.innerHTML = "", a.innerHTML = "", d = {}), nn({ scrollLeft: y, totalWidth: l, numCanvases: h }).forEach(((m) => p(m)));
      }));
      this.unsubscribeOnScroll.push(v);
    }
  }
  renderChannel(e, t, n, s) {
    var { overlay: r } = t, a = (function(c, d) {
      var p = {};
      for (var h in c) Object.prototype.hasOwnProperty.call(c, h) && d.indexOf(h) < 0 && (p[h] = c[h]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var v = 0;
        for (h = Object.getOwnPropertySymbols(c); v < h.length; v++) d.indexOf(h[v]) < 0 && Object.prototype.propertyIsEnumerable.call(c, h[v]) && (p[h[v]] = c[h[v]]);
      }
      return p;
    })(t, ["overlay"]);
    const o = document.createElement("div"), u = this.getHeight(a.height, a.splitChannels);
    o.style.height = `${u}px`, r && s > 0 && (o.style.marginTop = `-${u}px`), this.canvasWrapper.style.minHeight = `${u}px`, this.canvasWrapper.appendChild(o);
    const l = o.cloneNode();
    this.progressWrapper.appendChild(l), this.renderMultiCanvas(e, a, n, u, o, l);
  }
  render(e) {
    return J(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((l) => l())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const n = this.getPixelRatio(), s = this.scrollContainer.clientWidth, { scrollWidth: r, isScrollable: a, useParentWidth: o, width: u } = (function({ duration: l, minPxPerSec: c = 0, parentWidth: d, fillParent: p, pixelRatio: h }) {
        const v = Math.ceil(l * c), y = v > d, m = !!(p && !y);
        return { scrollWidth: v, isScrollable: y, useParentWidth: m, width: (m ? d : v) * h };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: s, fillParent: this.options.fillParent, pixelRatio: n });
      if (this.isScrollable = a, this.wrapper.style.width = o ? "100%" : `${r}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let l = 0; l < e.numberOfChannels; l++) {
        const c = Object.assign(Object.assign({}, this.options), (t = this.options.splitChannels) === null || t === void 0 ? void 0 : t[l]);
        this.renderChannel([e.getChannelData(l)], c, u, l);
      }
      else {
        const l = [e.getChannelData(0)];
        e.numberOfChannels > 1 && l.push(e.getChannelData(1)), this.renderChannel(l, this.options, u, 0);
      }
      Promise.resolve().then((() => this.emit("rendered")));
    }));
  }
  reRender() {
    if (this.unsubscribeOnScroll.forEach(((n) => n())), this.unsubscribeOnScroll = [], !this.audioData) return;
    const { scrollWidth: e } = this.scrollContainer, { right: t } = this.progressWrapper.getBoundingClientRect();
    if (this.render(this.audioData), this.isScrollable && e !== this.scrollContainer.scrollWidth) {
      const { right: n } = this.progressWrapper.getBoundingClientRect(), s = (function(r) {
        const a = 2 * r;
        return (a < 0 ? Math.floor(a) : Math.ceil(a)) / 2;
      })(n - t);
      this.scrollContainer.scrollLeft += s;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: n, scrollWidth: s, clientWidth: r } = this.scrollContainer, a = e * s, o = n, u = n + r, l = r / 2;
    if (this.isDragging)
      a + 30 > u ? this.scrollContainer.scrollLeft += 30 : a - 30 < o && (this.scrollContainer.scrollLeft -= 30);
    else {
      (a < o || a > u) && (this.scrollContainer.scrollLeft = a - (this.options.autoCenter ? l : 0));
      const c = a - n - l;
      t && this.options.autoCenter && c > 0 && (this.scrollContainer.scrollLeft += c);
    }
  }
  renderProgress(e, t) {
    if (isNaN(e)) return;
    const n = 100 * e;
    this.canvasWrapper.style.clipPath = `polygon(${n}% 0%, 100% 0%, 100% 100%, ${n}% 100%)`, this.progressWrapper.style.width = `${n}%`, this.cursor.style.left = `${n}%`, this.cursor.style.transform = this.options.cursorWidth ? `translateX(-${e * this.options.cursorWidth}px)` : "", this.isScrollable && this.options.autoScroll && this.audioData && this.audioData.duration > 0 && this.scrollIntoView(e, t);
  }
  exportImage(e, t, n) {
    return J(this, void 0, void 0, (function* () {
      const s = this.canvasWrapper.querySelectorAll("canvas");
      if (!s.length) throw new Error("No waveform data");
      if (n === "dataURL") {
        const r = Array.from(s).map(((a) => a.toDataURL(e, t)));
        return Promise.resolve(r);
      }
      return Promise.all(Array.from(s).map(((r) => new Promise(((a, o) => {
        r.toBlob(((u) => {
          u ? a(u) : o(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class Po extends We {
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
class dt extends We {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return J(this, void 0, void 0, (function* () {
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
    return J(this, void 0, void 0, (function* () {
      this.paused && (this._play(), this.emit("play"));
    }));
  }
  pause() {
    this.paused || (this._pause(), this.emit("pause"));
  }
  stopAt(e) {
    const t = e - this.currentTime, n = this.bufferNode;
    n?.stop(this.audioContext.currentTime + t), n?.addEventListener("ended", (() => {
      n === this.bufferNode && (this.bufferNode = null, this.pause());
    }), { once: !0 });
  }
  setSinkId(e) {
    return J(this, void 0, void 0, (function* () {
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
    for (let n = 0; n < t; n++) e.push(this.buffer.getChannelData(n));
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
const Io = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Oe extends Co {
  static create(e) {
    return new Oe(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new dt() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Io, e);
    const { state: n, actions: s } = (function(o) {
      var u, l, c, d, p, h;
      const v = (u = o?.currentTime) !== null && u !== void 0 ? u : X(0), y = (l = o?.duration) !== null && l !== void 0 ? l : X(0), m = (c = o?.isPlaying) !== null && c !== void 0 ? c : X(!1), C = (d = o?.isSeeking) !== null && d !== void 0 ? d : X(!1), k = (p = o?.volume) !== null && p !== void 0 ? p : X(1), g = (h = o?.playbackRate) !== null && h !== void 0 ? h : X(1), b = X(null), _ = X(null), E = X(""), S = X(0), A = X(0), D = Ce((() => !m.value), [m]), x = Ce((() => b.value !== null), [b]), M = Ce((() => x.value && y.value > 0), [x, y]), F = Ce((() => v.value), [v]), j = Ce((() => y.value > 0 ? v.value / y.value : 0), [v, y]);
      return { state: { currentTime: v, duration: y, isPlaying: m, isPaused: D, isSeeking: C, volume: k, playbackRate: g, audioBuffer: b, peaks: _, url: E, zoom: S, scrollPosition: A, canPlay: x, isReady: M, progress: F, progressPercent: j }, actions: { setCurrentTime: (P) => {
        const z = Math.max(0, Math.min(y.value || 1 / 0, P));
        v.set(z);
      }, setDuration: (P) => {
        y.set(Math.max(0, P));
      }, setPlaying: (P) => {
        m.set(P);
      }, setSeeking: (P) => {
        C.set(P);
      }, setVolume: (P) => {
        const z = Math.max(0, Math.min(1, P));
        k.set(z);
      }, setPlaybackRate: (P) => {
        const z = Math.max(0.1, Math.min(16, P));
        g.set(z);
      }, setAudioBuffer: (P) => {
        b.set(P), P && y.set(P.duration);
      }, setPeaks: (P) => {
        _.set(P);
      }, setUrl: (P) => {
        E.set(P);
      }, setZoom: (P) => {
        S.set(Math.max(0, P));
      }, setScrollPosition: (P) => {
        A.set(Math.max(0, P));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = n, this.wavesurferActions = s, this.timer = new Po();
    const r = t ? void 0 : this.getMediaElement();
    this.renderer = new xo(this.options, r), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const a = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: o, duration: u } = this.options;
      (a || o && u) && this.load(a, o, u).catch(((l) => {
        this.emit("error", l instanceof Error ? l : new Error(String(l)));
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
      const n = [];
      n.push(pe((() => {
        const a = e.isPlaying.value;
        t.emit(a ? "play" : "pause");
      }), [e.isPlaying])), n.push(pe((() => {
        const a = e.currentTime.value;
        t.emit("timeupdate", a), e.isPlaying.value && t.emit("audioprocess", a);
      }), [e.currentTime, e.isPlaying])), n.push(pe((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let s = !1;
      n.push(pe((() => {
        e.isReady.value && !s && (s = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let r = !1;
      return n.push(pe((() => {
        const a = e.isPlaying.value, o = e.currentTime.value, u = e.duration.value, l = u > 0 && o >= u;
        r && !a && l && t.emit("finish"), r = a && l;
      }), [e.isPlaying, e.currentTime, e.duration])), n.push(pe((() => {
        const a = e.zoom.value;
        a > 0 && t.emit("zoom", a);
      }), [e.zoom])), () => {
        n.forEach(((a) => a()));
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
    })), this.renderer.on("scroll", ((e, t, n, s) => {
      const r = this.getDuration();
      this.emit("scroll", e * r, t * r, n, s);
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
      const t = this.renderer.on("drag", ((n) => {
        var s;
        if (!this.options.interact) return;
        this.renderer.renderProgress(n), clearTimeout(e);
        let r = 0;
        const a = this.options.dragToSeek;
        this.isPlaying() ? r = 0 : a === !0 ? r = 200 : a && typeof a == "object" && (r = (s = a.debounceTime) !== null && s !== void 0 ? s : 200), e = setTimeout((() => {
          this.seekTo(n);
        }), r), this.emit("interaction", n * this.getDuration()), this.emit("drag", n);
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Ve.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Ve.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
  }
  registerPlugin(e) {
    if (this.plugins.includes(e)) return e;
    e._init(this), this.plugins.push(e);
    const t = e.once("destroy", (() => {
      this.plugins = this.plugins.filter(((n) => n !== e)), this.subscriptions = this.subscriptions.filter(((n) => n !== t));
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
  loadAudio(e, t, n, s) {
    return J(this, void 0, void 0, (function* () {
      var r;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (r = this.abortController) === null || r === void 0 || r.abort(), this.abortController = null, !t && !n) {
        const o = this.options.fetchParams || {};
        window.AbortController && !o.signal && (this.abortController = new AbortController(), o.signal = this.abortController.signal);
        const u = (c) => this.emit("loading", c);
        t = yield So.fetchBlob(e, u, o);
        const l = this.options.blobMimeType;
        l && (t = new Blob([t], { type: l }));
      }
      this.setSrc(e, t);
      const a = yield new Promise(((o) => {
        const u = s || this.getDuration();
        u ? o(u) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => o(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const o = this.getMediaElement();
        o instanceof dt && (o.duration = a);
      }
      if (n) this.decodedData = Ve.createBuffer(n, a || 0);
      else if (t) {
        const o = yield t.arrayBuffer();
        this.decodedData = yield Ve.decode(o, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, n) {
    return J(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, n);
      } catch (s) {
        throw this.emit("error", s), s;
      }
    }));
  }
  loadBlob(e, t, n) {
    return J(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, n);
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
  exportPeaks({ channels: e = 2, maxLength: t = 8e3, precision: n = 1e4 } = {}) {
    if (!this.decodedData) throw new Error("The audio has not been decoded yet");
    const s = Math.min(e, this.decodedData.numberOfChannels), r = [];
    for (let a = 0; a < s; a++) {
      const o = this.decodedData.getChannelData(a), u = [], l = o.length / t;
      for (let c = 0; c < t; c++) {
        const d = o.slice(Math.floor(c * l), Math.ceil((c + 1) * l));
        let p = 0;
        for (let h = 0; h < d.length; h++) {
          const v = d[h];
          Math.abs(v) > Math.abs(p) && (p = v);
        }
        u.push(Math.round(p * n) / n);
      }
      r.push(u);
    }
    return r;
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
    const n = Object.create(null, { play: { get: () => super.play } });
    return J(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const s = yield n.play.call(this);
      return t != null && (this.media instanceof dt ? this.media.stopAt(t) : this.stopAtPosition = t), s;
    }));
  }
  playPause() {
    return J(this, void 0, void 0, (function* () {
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
    return J(this, arguments, void 0, (function* (e = "image/png", t = 1, n = "dataURL") {
      return this.renderer.exportImage(e, t, n);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Oe.BasePlugin = class extends We {
  constructor(i) {
    super(), this.subscriptions = [], this.isDestroyed = !1, this.options = i;
  }
  onInit() {
  }
  _init(i) {
    this.isDestroyed && (this.subscriptions = [], this.isDestroyed = !1), this.wavesurfer = i, this.onInit();
  }
  destroy() {
    this.emit("destroy"), this.subscriptions.forEach(((i) => i())), this.subscriptions = [], this.isDestroyed = !0, this.wavesurfer = void 0;
  }
}, Oe.dom = wo;
class zn {
  constructor() {
    this.listeners = {};
  }
  on(e, t, n) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), n?.once) {
      const s = (...r) => {
        this.un(e, s), t(...r);
      };
      return this.listeners[e].add(s), () => this.un(e, s);
    }
    return this.listeners[e].add(t), () => this.un(e, t);
  }
  un(e, t) {
    var n;
    (n = this.listeners[e]) === null || n === void 0 || n.delete(t);
  }
  once(e, t) {
    return this.on(e, t, { once: !0 });
  }
  unAll() {
    this.listeners = {};
  }
  emit(e, ...t) {
    this.listeners[e] && this.listeners[e].forEach(((n) => n(...t)));
  }
}
class Mo extends zn {
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
function Fn(i, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, i) : document.createElement(i);
  for (const [n, s] of Object.entries(e)) if (n === "children" && s) for (const [r, a] of Object.entries(s)) a instanceof Node ? t.appendChild(a) : typeof a == "string" ? t.appendChild(document.createTextNode(a)) : t.appendChild(Fn(r, a));
  else n === "style" ? Object.assign(t.style, s) : n === "textContent" ? t.textContent = s : t.setAttribute(n, s.toString());
  return t;
}
function De(i, e, t) {
  const n = Fn(i, e || {});
  return t?.appendChild(n), n;
}
function Nn(i) {
  let e = i;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(n) {
    Object.is(e, n) || (e = n, t.forEach(((s) => s(e))));
  }, update(n) {
    this.set(n(e));
  }, subscribe: (n) => (t.add(n), () => t.delete(n)) };
}
function Xe(i, e) {
  let t;
  const n = () => {
    t && (t(), t = void 0), t = i();
  }, s = e.map(((r) => r.subscribe(n)));
  return n(), () => {
    t && (t(), t = void 0), s.forEach(((r) => r()));
  };
}
function Te(i, e) {
  const t = Nn(null), n = (s) => {
    t.set(s);
  };
  return i.addEventListener(e, n), t._cleanup = () => {
    i.removeEventListener(e, n);
  }, t;
}
function Se(i) {
  const e = i._cleanup;
  typeof e == "function" && e();
}
function Ge(i, e = {}) {
  const { threshold: t = 3, mouseButton: n = 0, touchDelay: s = 100 } = e, r = Nn(null), a = /* @__PURE__ */ new Map(), o = matchMedia("(pointer: coarse)").matches;
  let u = () => {
  };
  const l = (c) => {
    if (c.button !== n || (a.set(c.pointerId, c), a.size > 1)) return;
    let d = c.clientX, p = c.clientY, h = !1;
    const v = Date.now(), y = i.getBoundingClientRect(), { left: m, top: C } = y, k = (S) => {
      if (S.defaultPrevented || a.size > 1 || o && Date.now() - v < s) return;
      const A = S.clientX, D = S.clientY, x = A - d, M = D - p;
      (h || Math.abs(x) > t || Math.abs(M) > t) && (S.preventDefault(), S.stopPropagation(), h || (r.set({ type: "start", x: d - m, y: p - C }), h = !0), r.set({ type: "move", x: A - m, y: D - C, deltaX: x, deltaY: M }), d = A, p = D);
    }, g = (S) => {
      if (a.delete(S.pointerId), h) {
        const A = S.clientX, D = S.clientY;
        r.set({ type: "end", x: A - m, y: D - C });
      }
      u();
    }, b = (S) => {
      a.delete(S.pointerId), S.relatedTarget && S.relatedTarget !== document.documentElement || g(S);
    }, _ = (S) => {
      h && (S.stopPropagation(), S.preventDefault());
    }, E = (S) => {
      S.defaultPrevented || a.size > 1 || h && S.preventDefault();
    };
    document.addEventListener("pointermove", k), document.addEventListener("pointerup", g), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), u = () => {
      document.removeEventListener("pointermove", k), document.removeEventListener("pointerup", g), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", E), setTimeout((() => {
        document.removeEventListener("click", _, { capture: !0 });
      }), 10);
    };
  };
  return i.addEventListener("pointerdown", l), { signal: r, cleanup: () => {
    u(), i.removeEventListener("pointerdown", l), a.clear(), Se(r);
  } };
}
class sn extends zn {
  constructor(e, t, n = 0) {
    var s, r, a, o, u, l, c, d, p, h;
    super(), this.totalDuration = t, this.numberOfChannels = n, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((s = e.end) !== null && s !== void 0 ? s : e.start), this.drag = (r = e.drag) === null || r === void 0 || r, this.resize = (a = e.resize) === null || a === void 0 || a, this.resizeStart = (o = e.resizeStart) === null || o === void 0 || o, this.resizeEnd = (u = e.resizeEnd) === null || u === void 0 || u, this.color = (l = e.color) !== null && l !== void 0 ? l : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (p = e.channelIdx) !== null && p !== void 0 ? p : -1, this.contentEditable = (h = e.contentEditable) !== null && h !== void 0 ? h : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, n = De("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), s = De("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), r = Ge(n, { threshold: 1 }), a = Ge(s, { threshold: 1 }), o = Xe((() => {
      const l = r.signal.value;
      l && (l.type === "move" && l.deltaX !== void 0 ? this.onResize(l.deltaX, "start") : l.type === "end" && this.onEndResizing("start"));
    }), [r.signal]), u = Xe((() => {
      const l = a.signal.value;
      l && (l.type === "move" && l.deltaX !== void 0 ? this.onResize(l.deltaX, "end") : l.type === "end" && this.onEndResizing("end"));
    }), [a.signal]);
    this.subscriptions.push((() => {
      o(), u(), r.cleanup(), a.cleanup();
    }));
  }
  removeResizeHandles(e) {
    const t = e.querySelector('[part*="region-handle-left"]'), n = e.querySelector('[part*="region-handle-right"]');
    t && e.removeChild(t), n && e.removeChild(n);
  }
  initElement() {
    if (this.isRemoved) return null;
    const e = this.start === this.end;
    let t = 0, n = 100;
    this.channelIdx >= 0 && this.numberOfChannels > 0 && this.channelIdx < this.numberOfChannels && (n = 100 / this.numberOfChannels, t = n * this.channelIdx);
    const s = De("div", { style: { position: "absolute", top: `${t}%`, height: `${n}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Te(e, "click"), n = Te(e, "mouseenter"), s = Te(e, "mouseleave"), r = Te(e, "dblclick"), a = Te(e, "pointerdown"), o = Te(e, "pointerup"), u = t.subscribe(((m) => m && this.emit("click", m))), l = n.subscribe(((m) => m && this.emit("over", m))), c = s.subscribe(((m) => m && this.emit("leave", m))), d = r.subscribe(((m) => m && this.emit("dblclick", m))), p = a.subscribe(((m) => m && this.toggleCursor(!0))), h = o.subscribe(((m) => m && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      u(), l(), c(), d(), p(), h(), Se(t), Se(n), Se(s), Se(r), Se(a), Se(o);
    }));
    const v = Ge(e), y = Xe((() => {
      const m = v.signal.value;
      m && (m.type === "start" ? this.toggleCursor(!0) : m.type === "move" && m.deltaX !== void 0 ? this.onMove(m.deltaX) : m.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [v.signal]);
    this.subscriptions.push((() => {
      y(), v.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (m) => this.onContentClick(m), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, n) {
    var s;
    if (!(!((s = this.element) === null || s === void 0) && s.parentElement)) return;
    const { width: r } = this.element.parentElement.getBoundingClientRect(), a = e / r * this.totalDuration;
    let o = t && t !== "start" ? this.start : this.start + a, u = t && t !== "end" ? this.end : this.end + a;
    const l = n !== void 0;
    l && this.updatingSide && this.updatingSide !== t && (this.updatingSide === "start" ? o = n : u = n), o = Math.max(0, o), u = Math.min(this.totalDuration, u);
    const c = u - o;
    this.updatingSide = t;
    const d = c >= this.minLength && c <= this.maxLength;
    o <= u && (d || l) && (this.start = o, this.end = u, this.renderPosition(), this.emit("update", t));
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
        const n = this.start === this.end;
        this.content = De("div", { style: { padding: `0.2em ${n ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
      } else this.content = e;
      this.contentEditable && (this.content.contentEditable = "true", this.contentClickListener = (n) => this.onContentClick(n), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener)), this.content.setAttribute("part", "region-content"), this.element.appendChild(this.content), this.emit("content-changed");
    } else this.content = void 0;
  }
  setOptions(e) {
    var t, n;
    if (this.element) {
      if (e.color && (this.color = e.color, this.element.style.backgroundColor = this.color), e.drag !== void 0 && (this.drag = e.drag, this.element.style.cursor = this.drag ? "grab" : "default"), e.start !== void 0 || e.end !== void 0) {
        const s = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((n = e.end) !== null && n !== void 0 ? n : s ? this.start : this.end), this.renderPosition(), this.setPart();
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
class Dt extends Mo {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Dt(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((n) => n._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const n = this.regions.filter(((s) => s.start <= t && (s.end === s.start ? s.start + 0.05 : s.end) >= t));
      n.forEach(((s) => {
        e.includes(s) || this.emit("region-in", s);
      })), e.forEach(((s) => {
        n.includes(s) || this.emit("region-out", s);
      })), e = n;
    })));
  }
  initRegionsContainer() {
    return De("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
  }
  getRegions() {
    return this.regions;
  }
  avoidOverlapping(e) {
    e.content && setTimeout((() => {
      const t = e.content, n = t.getBoundingClientRect(), s = this.regions.map(((r) => {
        if (r === e || !r.content) return 0;
        const a = r.content.getBoundingClientRect();
        return n.left < a.left + a.width && a.left < n.left + n.width ? a.height : 0;
      })).reduce(((r, a) => r + a), 0);
      t.style.marginTop = `${s}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, n;
    if (!e.element) return;
    const s = (n = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || n === void 0 ? void 0 : n.parentElement;
    if (!s) return;
    const { clientWidth: r, scrollWidth: a } = s;
    if (a <= r) return;
    const o = s.getBoundingClientRect(), u = e.element.getBoundingClientRect(), l = u.left - o.left, c = u.right - o.left;
    l < 0 ? s.scrollLeft += l : c > r && (s.scrollLeft += c - r);
  }
  virtualAppend(e, t, n) {
    const s = () => {
      if (!this.wavesurfer) return;
      const r = this.wavesurfer.getWidth(), a = this.wavesurfer.getScroll(), o = t.clientWidth, u = this.wavesurfer.getDuration(), l = Math.round(e.start / u * o), c = l + (Math.round((e.end - e.start) / u * o) || 1) > a && l < a + r;
      c && !n.parentElement ? t.appendChild(n) : !c && n.parentElement && n.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      s();
      const r = this.wavesurfer.on("scroll", s), a = this.wavesurfer.on("zoom", s), o = this.wavesurfer.on("resize", s);
      this.subscriptions.push(r, a, o), e.once("remove", (() => {
        r(), a(), o();
      }));
    }), 0);
  }
  saveRegion(e) {
    if (!e.element) return;
    this.virtualAppend(e, this.regionsContainer, e.element), this.avoidOverlapping(e), this.regions.push(e);
    const t = [e.on("update", ((n) => {
      n || this.adjustScroll(e), this.emit("region-update", e, n);
    })), e.on("update-end", ((n) => {
      this.avoidOverlapping(e), this.emit("region-updated", e, n);
    })), e.on("play", ((n) => {
      var s;
      (s = this.wavesurfer) === null || s === void 0 || s.play(e.start, n);
    })), e.on("click", ((n) => {
      this.emit("region-clicked", e, n);
    })), e.on("dblclick", ((n) => {
      this.emit("region-double-clicked", e, n);
    })), e.on("content-changed", (() => {
      this.emit("region-content-changed", e);
    })), e.once("remove", (() => {
      t.forEach(((n) => n())), this.regions = this.regions.filter(((n) => n !== e)), this.emit("region-removed", e);
    }))];
    this.subscriptions.push(...t), this.emit("region-created", e);
  }
  addRegion(e) {
    var t, n;
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    const s = this.wavesurfer.getDuration(), r = (n = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || n === void 0 ? void 0 : n.numberOfChannels, a = new sn(e, s, r);
    return this.emit("region-initialized", a), s ? this.saveRegion(a) : this.subscriptions.push(this.wavesurfer.once("ready", ((o) => {
      a._setTotalDuration(o), this.saveRegion(a);
    }))), a;
  }
  enableDragSelection(e, t = 3) {
    var n;
    const s = (n = this.wavesurfer) === null || n === void 0 ? void 0 : n.getWrapper();
    if (!(s && s instanceof HTMLElement)) return () => {
    };
    let r = null, a = 0, o = 0;
    const u = Ge(s, { threshold: t }), l = Xe((() => {
      var c, d;
      const p = u.signal.value;
      if (p) if (p.type === "start") {
        if (a = p.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), v = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: y } = this.wavesurfer.getWrapper().getBoundingClientRect();
        o = a / y * h;
        const m = p.x / y * h, C = (p.x + 5) / y * h;
        r = new sn(Object.assign(Object.assign({}, e), { start: m, end: C }), h, v), this.emit("region-initialized", r), r.element && this.regionsContainer.appendChild(r.element);
      } else p.type === "move" && p.deltaX !== void 0 ? r && r._onUpdate(p.deltaX, p.x > a ? "end" : "start", o) : p.type === "end" && r && (this.saveRegion(r), r.updatingSide = void 0, r = null);
    }), [u.signal]);
    return () => {
      l(), u.cleanup();
    };
  }
  clearRegions() {
    this.regions.slice().forEach(((e) => e.remove())), this.regions = [];
  }
  destroy() {
    this.clearRegions(), super.destroy(), this.regionsContainer.remove();
  }
}
const ht = [0.5, 0.75, 1, 1.25, 1.5, 2];
function Do(i) {
  const { containerRef: e, audioSrc: t, turns: n, speakers: s } = i, r = Le(null), a = Le(null), o = I(0), u = I(0), l = I(!1), c = I(!1), d = I(!1), p = I(1), h = I(1), v = I(!1), y = T(() => Ae(o.value)), m = T(() => Ae(u.value));
  function C(P, z) {
    F(), d.value = !0, c.value = !1;
    const Y = Dt.create();
    a.value = Y;
    const V = Oe.create({
      container: P,
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
      renderFunction: xi,
      url: z,
      plugins: [Y]
    });
    V.on("ready", () => {
      c.value = !0, d.value = !1, u.value = V.getDuration(), k();
    }), V.on("timeupdate", (we) => {
      o.value = we;
    }), V.on("play", () => {
      l.value = !0;
    }), V.on("pause", () => {
      l.value = !1;
    }), V.on("finish", () => {
      l.value = !1;
    }), r.value = V;
  }
  function k() {
    const P = a.value;
    if (P) {
      P.clearRegions();
      for (const z of n.value) {
        const Y = z.speakerId ? s.value.get(z.speakerId) : void 0;
        if (!Y || z.startTime == null || z.endTime == null) continue;
        const V = Y.color;
        P.addRegion({
          start: z.startTime,
          end: z.endTime,
          color: Si(V, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", V);
      }
    }
  }
  function g() {
    r.value?.play();
  }
  function b() {
    r.value?.pause();
  }
  function _() {
    r.value?.playPause();
  }
  function E(P) {
    const z = r.value;
    !z || u.value === 0 || z.setTime(P);
  }
  function S(P) {
    E(Math.max(0, Math.min(o.value + P, u.value)));
  }
  function A(P) {
    const z = r.value;
    z && (p.value = P, z.setVolume(P), P > 0 && v.value && (v.value = !1, z.setMuted(!1)));
  }
  function D() {
    const P = r.value;
    P && (v.value = !v.value, P.setMuted(v.value));
  }
  function x(P) {
    const z = r.value;
    z && (h.value = P, z.setPlaybackRate(P));
  }
  function M() {
    const z = (ht.indexOf(
      h.value
    ) + 1) % ht.length;
    x(ht[z] ?? 1);
  }
  function F() {
    j !== null && (clearTimeout(j), j = null), r.value && (r.value.destroy(), r.value = null, a.value = null);
  }
  U(
    [e, t],
    ([P, z]) => {
      P && z && C(P, z);
    },
    { immediate: !0 }
  );
  let j = null;
  return U([n, s], () => {
    c.value && (j !== null && clearTimeout(j), j = setTimeout(() => {
      j = null, k();
    }, 150));
  }), ge(() => {
    F();
  }), {
    currentTime: o,
    duration: u,
    isPlaying: l,
    isReady: c,
    isLoading: d,
    volume: p,
    playbackRate: h,
    isMuted: v,
    formattedCurrentTime: y,
    formattedDuration: m,
    play: g,
    pause: b,
    togglePlay: _,
    seekTo: E,
    skip: S,
    setVolume: A,
    setPlaybackRate: x,
    cyclePlaybackRate: M,
    toggleMute: D
  };
}
const Lo = { class: "audio-player" }, $o = /* @__PURE__ */ R({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(i, { expose: e, emit: t }) {
    const n = i, s = t, r = I(null), {
      isPlaying: a,
      isReady: o,
      isLoading: u,
      volume: l,
      playbackRate: c,
      isMuted: d,
      currentTime: p,
      formattedCurrentTime: h,
      formattedDuration: v,
      togglePlay: y,
      seekTo: m,
      pause: C,
      skip: k,
      setVolume: g,
      cyclePlaybackRate: b,
      toggleMute: _
    } = Do({
      containerRef: r,
      audioSrc: tt(() => n.audioSrc),
      turns: tt(() => n.turns),
      speakers: tt(() => n.speakers)
    });
    return U(p, (E) => s("timeupdate", E)), U(a, (E) => s("playStateChange", E)), e({ seekTo: m, pause: C }), (E, S) => (w(), L("footer", Lo, [
      O("div", {
        ref_key: "waveformRef",
        ref: r,
        class: ve(["waveform-container", { "waveform-container--loading": f(u) }])
      }, null, 2),
      W(ko, {
        "is-playing": f(a),
        "current-time": f(h),
        duration: f(v),
        volume: f(l),
        "playback-rate": f(c),
        "is-muted": f(d),
        "is-ready": f(o),
        onTogglePlay: f(y),
        onSkipBack: S[0] || (S[0] = (A) => f(k)(-10)),
        onSkipForward: S[1] || (S[1] = (A) => f(k)(10)),
        "onUpdate:volume": f(g),
        onToggleMute: f(_),
        onCyclePlaybackRate: f(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Ao = /* @__PURE__ */ K($o, [["__scopeId", "data-v-9248e45e"]]);
class Oo {
  diff(e, t, n = {}) {
    let s;
    typeof n == "function" ? (s = n, n = {}) : "callback" in n && (s = n.callback);
    const r = this.castInput(e, n), a = this.castInput(t, n), o = this.removeEmpty(this.tokenize(r, n)), u = this.removeEmpty(this.tokenize(a, n));
    return this.diffWithOptionsObj(o, u, n, s);
  }
  diffWithOptionsObj(e, t, n, s) {
    var r;
    const a = (k) => {
      if (k = this.postProcess(k, n), s) {
        setTimeout(function() {
          s(k);
        }, 0);
        return;
      } else
        return k;
    }, o = t.length, u = e.length;
    let l = 1, c = o + u;
    n.maxEditLength != null && (c = Math.min(c, n.maxEditLength));
    const d = (r = n.timeout) !== null && r !== void 0 ? r : 1 / 0, p = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let v = this.extractCommon(h[0], t, e, 0, n);
    if (h[0].oldPos + 1 >= u && v + 1 >= o)
      return a(this.buildValues(h[0].lastComponent, t, e));
    let y = -1 / 0, m = 1 / 0;
    const C = () => {
      for (let k = Math.max(y, -l); k <= Math.min(m, l); k += 2) {
        let g;
        const b = h[k - 1], _ = h[k + 1];
        b && (h[k - 1] = void 0);
        let E = !1;
        if (_) {
          const A = _.oldPos - k;
          E = _ && 0 <= A && A < o;
        }
        const S = b && b.oldPos + 1 < u;
        if (!E && !S) {
          h[k] = void 0;
          continue;
        }
        if (!S || E && b.oldPos < _.oldPos ? g = this.addToPath(_, !0, !1, 0, n) : g = this.addToPath(b, !1, !0, 1, n), v = this.extractCommon(g, t, e, k, n), g.oldPos + 1 >= u && v + 1 >= o)
          return a(this.buildValues(g.lastComponent, t, e)) || !0;
        h[k] = g, g.oldPos + 1 >= u && (m = Math.min(m, k - 1)), v + 1 >= o && (y = Math.max(y, k + 1));
      }
      l++;
    };
    if (s)
      (function k() {
        setTimeout(function() {
          if (l > c || Date.now() > p)
            return s(void 0);
          C() || k();
        }, 0);
      })();
    else
      for (; l <= c && Date.now() <= p; ) {
        const k = C();
        if (k)
          return k;
      }
  }
  addToPath(e, t, n, s, r) {
    const a = e.lastComponent;
    return a && !r.oneChangePerToken && a.added === t && a.removed === n ? {
      oldPos: e.oldPos + s,
      lastComponent: { count: a.count + 1, added: t, removed: n, previousComponent: a.previousComponent }
    } : {
      oldPos: e.oldPos + s,
      lastComponent: { count: 1, added: t, removed: n, previousComponent: a }
    };
  }
  extractCommon(e, t, n, s, r) {
    const a = t.length, o = n.length;
    let u = e.oldPos, l = u - s, c = 0;
    for (; l + 1 < a && u + 1 < o && this.equals(n[u + 1], t[l + 1], r); )
      l++, u++, c++, r.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !r.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = u, l;
  }
  equals(e, t, n) {
    return n.comparator ? n.comparator(e, t) : e === t || !!n.ignoreCase && e.toLowerCase() === t.toLowerCase();
  }
  removeEmpty(e) {
    const t = [];
    for (let n = 0; n < e.length; n++)
      e[n] && t.push(e[n]);
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
  buildValues(e, t, n) {
    const s = [];
    let r;
    for (; e; )
      s.push(e), r = e.previousComponent, delete e.previousComponent, e = r;
    s.reverse();
    const a = s.length;
    let o = 0, u = 0, l = 0;
    for (; o < a; o++) {
      const c = s[o];
      if (c.removed)
        c.value = this.join(n.slice(l, l + c.count)), l += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(u, u + c.count);
          d = d.map(function(p, h) {
            const v = n[l + h];
            return v.length > p.length ? v : p;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(u, u + c.count));
        u += c.count, c.added || (l += c.count);
      }
    }
    return s;
  }
}
class Ro extends Oo {
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
const Bo = new Ro();
function zo(i, e, t) {
  return Bo.diff(i, e, t);
}
function ft({ previousText: i, previousIndexes: e }, t, n) {
  if (!t)
    return { previousText: i, previousIndexes: e };
  const s = i.split(" "), r = t.split(" "), a = zo(s, r, {
    comparator: No
  }), o = Fo(a), u = [...e];
  let l = [...e], c = 0;
  for (const h of o) {
    do
      if (c < u[0]) break;
    while (u.shift() !== void 0);
    if (u.length === 0) break;
    if ("replaced" in h && h.replaced)
      l = Ye(
        l,
        u[0],
        h.countAdded - h.countRemoved
      ), c += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const v = h;
      c += v.count, l = Ye(
        l,
        u[0],
        -v.count
      );
    } else if ("added" in h && h.added) {
      const v = h;
      l = Ye(
        l,
        u[0],
        v.count
      );
    } else
      c += h.count;
  }
  const d = l.length > 0 ? l[l.length - 1] : 0, p = r.slice(d).join(" ");
  if (n(p)) {
    const v = Wn(
      p,
      n
    ).map(
      (y) => y + d
    );
    l = l.concat(v);
  }
  return {
    previousIndexes: l,
    previousText: t
  };
}
function Fo(i) {
  const e = [];
  for (let t = 0; t < i.length; t++) {
    const n = i[t];
    if (!n.removed) {
      e.push(n);
      continue;
    }
    if (t + 1 < i.length) {
      const s = i[t + 1];
      if (s.added) {
        e.push({
          replaced: !0,
          removed: n.removed ?? !1,
          added: s.added ?? !1,
          countRemoved: n.count,
          countAdded: s.count
        }), t++;
        continue;
      }
    }
    e.push(n);
  }
  return e;
}
function Ye(i, e, t) {
  return i.map((n) => n >= e ? n + t : n);
}
function Wn(i, e) {
  const t = i.split(" ");
  if (!e(i) || t.length <= 1)
    return [];
  let n;
  for (n = 0; n < t.length; n++) {
    const s = t.slice(0, n).join(" ");
    if (e(s)) break;
  }
  return [n - 1].concat(
    Ye(
      Wn(
        t.slice(n - 1).join(" "),
        e
      ),
      0,
      n - 1
    )
  );
}
function No(i, e) {
  const t = i.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), n = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), s = Math.min(t.length, n.length);
  let r = 0;
  for (let o = 0; o < s; o++)
    t[o] === n[o] && r++;
  return r / t.length > 0.8;
}
class Wo {
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
    lineHeight: n = 50,
    color: s = "white",
    font: r = "Arial",
    paddingInline: a = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = n, this.color = s, this.font = r, this.paddingInline = a, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
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
  drawText(e, t, n) {
    const s = this.canvas.getContext("2d");
    s.font = `${this.fontSize}px ${this.font}`, s.fillStyle = this.color, s.fillText(e, t + this.paddingInline, n);
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
class qo extends Wo {
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
    this.resetAll(), this.currentState = ft(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = ft(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = ft(
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
    let n = 0;
    return e.previousIndexes.length > 1 && (n = e.previousIndexes[e.previousIndexes.length - 2]), e.previousText.split(" ").slice(n, t).join(" ");
  }
  computeIfTextIsTooLong(e) {
    const t = this.canvas.getContext("2d");
    t.font = `${this.fontSize}px ${this.font}`;
    const n = this.canvas.width - 2 * this.paddingInline;
    return t.measureText(e).width > n;
  }
}
function qn(i) {
  const e = ye();
  let t = null;
  ee(() => {
    i.canvasRef.value && (t = new qo(i.canvasRef.value, {
      fontSize: i.fontSize.value,
      lineHeight: i.lineHeight.value
    }));
  }), U([i.fontSize, i.lineHeight], ([u, l]) => {
    t && t.setFontSize(u, l);
  }), U(
    () => e.live?.partial.value,
    (u) => {
      u && t && t.newPartial(u);
    }
  );
  const n = e.onActiveTranslation("turn:add", ({ turn: u }) => {
    if (!t) return;
    const l = u.words.length > 0 ? u.words.map((c) => c.text).join(" ") : u.text ?? "";
    l && t.newFinal(l);
  });
  function s() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const r = e.on("translation:change", s), a = e.on("translation:sync", s), o = e.on("channel:sync", s);
  Fe(() => {
    n(), r(), a(), o(), t?.dispose(), t = null;
  });
}
function jn(i) {
  const e = I(!1);
  let t = null, n = null;
  function s() {
    t && (clearTimeout(t), t = null), n && (clearTimeout(n), n = null);
  }
  function r() {
    !i || !i.display.value || (e.value = !0, i.pinned.value || (n = setTimeout(a, i.duration.value * 1e3)));
  }
  function a() {
    e.value = !1, !(!i || !i.display.value || i.pinned.value) && (t = setTimeout(r, i.frequency.value * 1e3));
  }
  function o() {
    if (s(), !i || !i.display.value) {
      e.value = !1;
      return;
    }
    if (i.pinned.value) {
      e.value = !0;
      return;
    }
    e.value = !1, t = setTimeout(r, i.frequency.value * 1e3);
  }
  return i && U(
    [i.display, i.pinned, i.frequency, i.duration],
    o
  ), ee(o), ge(s), { visible: e };
}
const rn = /\$(\w+)/g;
function jo(i, e) {
  const t = [];
  let n = 0, s;
  for (rn.lastIndex = 0; (s = rn.exec(i)) !== null; ) {
    s.index > n && t.push({ type: "text", value: i.slice(n, s.index) });
    const r = s[1] ?? "", a = r ? e[r] : void 0;
    a ? t.push({ type: "token", src: a.src, alt: a.alt ?? r }) : t.push({ type: "text", value: s[0] }), n = s.index + s[0].length;
  }
  return n < i.length && t.push({ type: "text", value: i.slice(n) }), t;
}
const Ho = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, Vo = ["src", "alt"], Uo = { key: 1 }, Ko = /* @__PURE__ */ R({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(i) {
    const t = ye().subtitle?.watermark, n = T(() => t ? jo(t.content.value, t.tokens.value) : []);
    return (s, r) => (w(), $(Ct, { name: "watermark" }, {
      default: B(() => [
        i.visible && f(t) ? (w(), L("div", Ho, [
          (w(!0), L(ae, null, xe(n.value, (a, o) => (w(), L(ae, { key: o }, [
            a.type === "token" ? (w(), L("img", {
              key: 0,
              src: a.src,
              alt: a.alt,
              class: "watermark__img"
            }, null, 8, Vo)) : (w(), L("span", Uo, N(a.value), 1))
          ], 64))), 128))
        ])) : q("", !0)
      ]),
      _: 1
    }));
  }
}), Hn = /* @__PURE__ */ K(Ko, [["__scopeId", "data-v-7d6bdc7d"]]), Xo = ["height"], Go = /* @__PURE__ */ R({
  __name: "SubtitleBanner",
  setup(i) {
    const e = ye(), t = $e("canvas"), n = T(() => e.subtitle?.fontSize.value ?? 40), s = T(() => 1.2 * n.value), r = T(() => 2.4 * n.value);
    qn({
      canvasRef: t,
      fontSize: n,
      lineHeight: s
    });
    const { visible: a } = jn(
      e.subtitle?.watermark
    );
    return ee(() => {
      e.emit("subtitle:visible", { visible: !0, height: r.value });
    }), U(r, (o) => {
      e.emit("subtitle:visible", { visible: !0, height: o });
    }), ge(() => {
      e.emit("subtitle:visible", { visible: !1, height: 0 });
    }), (o, u) => (w(), L("div", {
      class: "subtitle-banner",
      style: ze({ height: r.value + "px" })
    }, [
      O("canvas", {
        ref: "canvas",
        class: ve(["subtitle-canvas", { "subtitle-canvas--shrunk": f(a) }]),
        height: r.value
      }, null, 10, Xo),
      W(Hn, { visible: f(a) }, null, 8, ["visible"])
    ], 4));
  }
}), Yo = /* @__PURE__ */ K(Go, [["__scopeId", "data-v-5b52c946"]]), Jo = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Zo = ["aria-label"], Qo = /* @__PURE__ */ R({
  __name: "SubtitleFullscreen",
  setup(i) {
    const e = ye(), { t } = se(), n = $e("container"), s = $e("canvas"), r = T(() => e.subtitle?.fontSize.value ?? 48), a = T(() => 1.2 * r.value);
    qn({
      canvasRef: s,
      fontSize: r,
      lineHeight: a
    });
    const { visible: o } = jn(
      e.subtitle?.watermark
    );
    ee(async () => {
      const c = n.value;
      if (c) {
        try {
          await c.requestFullscreen();
        } catch (d) {
          console.warn("Fullscreen API not supported:", d);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function u() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    ee(() => {
      document.addEventListener("fullscreenchange", u);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Fe(() => {
      document.removeEventListener("fullscreenchange", u);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, d) => (w(), L("div", Jo, [
      O("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": f(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        W(f(_t), { size: 24 })
      ], 8, Zo),
      O("canvas", {
        ref: "canvas",
        class: ve(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": f(o) }])
      }, null, 2),
      W(Hn, { visible: f(o) }, null, 8, ["visible"])
    ], 512));
  }
}), el = /* @__PURE__ */ K(Qo, [["__scopeId", "data-v-f31885e0"]]), tl = /* @__PURE__ */ R({
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
  setup(i, { expose: e }) {
    const t = i, n = I(!1);
    let s;
    async function r() {
      if (!n.value)
        try {
          await t.copyFn(), n.value = !0, s = setTimeout(() => {
            n.value = !1;
          }, 2e3);
        } catch (u) {
          console.error(u);
        }
    }
    e({
      reset: () => {
        n.value = !1, clearTimeout(s);
      }
    });
    const a = T(() => n.value ? "check" : t.icon), o = T(() => mn[t.size ?? "sm"]);
    return (u, l) => (w(), $(ne, {
      variant: i.variant,
      size: i.size,
      disabled: i.disabled,
      block: i.block,
      "aria-label": i.ariaLabel,
      class: ve({ "copy-btn--copied": n.value }),
      onClick: r
    }, {
      icon: B(() => [
        W(Ct, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: B(() => [
            (w(), $(Ue, {
              key: a.value,
              name: a.value,
              size: o.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: B(() => [
        H(u.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), an = /* @__PURE__ */ K(tl, [["__scopeId", "data-v-eed7503d"]]), nl = ["aria-label"], il = { class: "selection-count" }, sl = { class: "selection-actions" }, rl = /* @__PURE__ */ R({
  __name: "SelectionActionBar",
  setup(i) {
    const e = Dn(), { t } = se();
    return (n, s) => f(e).hasSelection.value ? (w(), L("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": f(t)("selection.count")
    }, [
      O("span", il, N(f(e).count.value) + " " + N(f(t)("selection.count")), 1),
      O("div", sl, [
        W(an, {
          icon: "clipboard-type",
          "copy-fn": f(e).copyText,
          variant: "secondary"
        }, {
          default: B(() => [
            ie(N(f(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        W(an, {
          icon: "clipboard-list",
          "copy-fn": f(e).copyWithMetadata
        }, {
          default: B(() => [
            ie(N(f(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        W(ne, {
          variant: "transparent",
          icon: "x",
          onClick: s[0] || (s[0] = (r) => f(e).clear())
        }, {
          default: B(() => [
            ie(N(f(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, nl)) : q("", !0);
  }
}), al = /* @__PURE__ */ K(rl, [["__scopeId", "data-v-7569d6ad"]]), ol = "(max-width: 767px)";
function ll() {
  const i = I(!1);
  let e = null;
  function t(n) {
    i.value = n.matches;
  }
  return ee(() => {
    e = window.matchMedia(ol), i.value = e.matches, e.addEventListener("change", t);
  }), ge(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: i };
}
const ul = { class: "editor-layout" }, cl = { class: "editor-body" }, dl = {
  key: 4,
  class: "mobile-selectors"
}, hl = /* @__PURE__ */ R({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(i) {
    const e = i, t = ye(), { isMobile: n } = ll(), s = I(!1), r = T(
      () => t.activeChannel.value.activeTranslation.value.turns.value
    ), a = t.speakers.all;
    ua(r, a, t);
    const o = T(() => [...t.channels.values()]), u = T(() => [
      ...t.activeChannel.value.translations.values()
    ]), l = T(
      () => t.activeChannel.value.activeTranslation.value.id
    ), c = T(() => Array.from(a.values())), d = $e("audioPlayer");
    function p(y) {
      t.audio && (t.audio.currentTime.value = y);
    }
    U(
      () => t.activeChannelId.value,
      () => {
        d.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), s.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((y) => d.value?.seekTo(y));
    function h(y) {
      t.setActiveChannel(y);
    }
    function v(y) {
      t.activeChannel.value.setActiveTranslation(y);
    }
    return (y, m) => (w(), L("div", ul, [
      e.showHeader ? (w(), $(cs, {
        key: 0,
        title: f(t).title.value,
        duration: f(t).activeChannel.value.duration,
        language: l.value,
        "is-mobile": f(n),
        onToggleSidebar: m[0] || (m[0] = (C) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : q("", !0),
      W(al),
      O("main", cl, [
        W(Pa, {
          turns: r.value,
          speakers: f(a)
        }, null, 8, ["turns", "speakers"]),
        f(n) ? q("", !0) : (w(), $(Zt, {
          key: 0,
          speakers: c.value,
          channels: o.value,
          "selected-channel-id": f(t).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": l.value,
          "onUpdate:selectedChannelId": h,
          "onUpdate:selectedTranslationId": v
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        f(n) ? (w(), $(co, {
          key: 1,
          open: s.value,
          "onUpdate:open": m[1] || (m[1] = (C) => s.value = C)
        }, {
          default: B(() => [
            W(Zt, {
              speakers: c.value,
              channels: o.value,
              "selected-channel-id": f(t).activeChannelId.value,
              translations: u.value,
              "selected-translation-id": l.value,
              "onUpdate:selectedChannelId": h,
              "onUpdate:selectedTranslationId": v
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])) : q("", !0)
      ]),
      f(t).audio?.src.value ? (w(), $(Ao, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": f(t).audio.src.value,
        turns: r.value,
        speakers: f(a),
        onTimeupdate: p,
        onPlayStateChange: m[2] || (m[2] = (C) => {
          f(t).audio && (f(t).audio.isPlaying.value = C);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : q("", !0),
      f(t).subtitle?.isVisible.value && !f(n) && !f(t).subtitle.isFullscreen.value ? (w(), $(Yo, { key: 2 })) : q("", !0),
      f(t).subtitle?.isFullscreen.value ? (w(), $(el, { key: 3 })) : q("", !0),
      f(n) && (o.value.length > 1 || u.value.length > 1) ? (w(), L("div", dl, [
        o.value.length > 1 ? (w(), $($n, {
          key: 0,
          channels: o.value,
          "selected-channel-id": f(t).activeChannelId.value,
          "onUpdate:selectedChannelId": h
        }, null, 8, ["channels", "selected-channel-id"])) : q("", !0),
        u.value.length > 1 ? (w(), $(An, {
          key: 1,
          translations: u.value,
          "selected-translation-id": l.value,
          "onUpdate:selectedTranslationId": v
        }, null, 8, ["translations", "selected-translation-id"])) : q("", !0)
      ])) : q("", !0)
    ]));
  }
}), kl = /* @__PURE__ */ K(hl, [["__scopeId", "data-v-dfb86af2"]]);
function wl() {
  return {
    name: "audio",
    install(i) {
      const e = I(0), t = I(!1);
      let n = null;
      const s = T(
        () => i.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function r(u) {
        n?.(u);
      }
      function a(u) {
        n = u;
      }
      const o = {
        currentTime: e,
        isPlaying: t,
        src: s,
        seekTo: r,
        setSeekHandler: a
      };
      return i.audio = o, () => {
        i.audio = void 0;
      };
    }
  };
}
function on(i) {
  const e = i.words.length > 0;
  return {
    id: i.turnId,
    speakerId: i.speakerId,
    text: e ? null : i.text ?? null,
    words: i.words,
    startTime: i.startTime,
    endTime: i.endTime,
    startDate: i.startDate,
    endDate: i.endDate,
    language: i.language
  };
}
function pt(i, e) {
  return {
    id: i.turnId,
    speakerId: i.speakerId,
    text: e.text,
    words: [],
    startTime: i.startTime,
    endTime: i.endTime,
    startDate: i.startDate,
    endDate: i.endDate,
    language: e.language
  };
}
function Sl() {
  return {
    name: "live",
    install(i) {
      const e = Le(null), t = I(!1);
      t.value = !0;
      function n() {
        e.value = null;
      }
      function s(g, b) {
        if (i.activeChannelId.value !== b) return;
        const _ = i.activeChannel.value.activeTranslation.value;
        if (_.isSource) {
          if (g.text == null) return;
          e.value = g.text;
        } else if (g.translations) {
          const E = g.translations.find(
            (S) => S.translationId === _.id
          );
          e.value = E?.text ?? null;
        } else
          return;
      }
      let r = null;
      function a() {
        r === null && (r = setTimeout(() => {
          r = null, n();
        }, 150));
      }
      function o() {
        r !== null && (clearTimeout(r), r = null);
      }
      function u(g, b) {
        g.hasTurn(b.id) ? g.updateTurn(b.id, b) : g.addTurn(b);
      }
      function l(g, b) {
        g.speakerId && i.speakers.ensure(g.speakerId);
        const _ = i.channels.get(b);
        if (!_) {
          p();
          return;
        }
        if (g.text != null && u(
          _.sourceTranslation,
          on(g)
        ), g.translations)
          for (const S of g.translations) {
            const A = _.translations.get(S.translationId);
            A && u(
              A,
              pt(g, S)
            );
          }
        i.activeChannel.value.activeTranslation.value.isSource && p();
      }
      function c(g, b) {
        d([g], b);
      }
      function d(g, b) {
        const _ = i.channels.get(b);
        if (!_) return;
        const E = /* @__PURE__ */ new Set();
        for (const D of g)
          D.speakerId && !E.has(D.speakerId) && (E.add(D.speakerId), i.speakers.ensure(D.speakerId));
        const S = [];
        for (const D of g)
          D.text != null && S.push(on(D));
        S.length > 0 && _.sourceTranslation.prependTurns(S);
        const A = /* @__PURE__ */ new Map();
        for (const D of g)
          if (D.translations)
            for (const x of D.translations) {
              let M = A.get(x.translationId);
              M || (M = [], A.set(x.translationId, M)), M.push(pt(D, x));
            }
        for (const [D, x] of A) {
          const M = _.translations.get(D);
          M && M.prependTurns(x);
        }
      }
      function p() {
        o(), n();
      }
      function h(g) {
        const b = i.activeChannel.value.activeTranslation.value, _ = i.activeChannel.value;
        if (!g.final && b.languages.includes(g.language))
          e.value = g.text;
        else if (g.final) {
          const E = _.translations.get(g.language);
          if (E) {
            const S = pt(
              { ...g },
              g
            );
            E === b ? u(E, S) : E.updateOrCreateTurnSilent(S);
          }
          b.languages.includes(g.language) && p();
        }
      }
      const v = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: s,
        onFinal: l,
        prependFinal: c,
        prependFinalBatch: d,
        onTranslation: h
      }, y = i.on(
        "channel:change",
        p
      ), m = i.on(
        "translation:change",
        p
      ), C = i.on(
        "translation:sync",
        a
      ), k = i.on("channel:sync", a);
      return i.live = v, () => {
        p(), y(), m(), C(), k(), i.live = void 0;
      };
    }
  };
}
function Cl(i = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = I(i.fontSize ?? 40), n = I(i.isVisible ?? !1), s = I(!1);
      let r;
      const a = [];
      if (i.watermark) {
        const u = i.watermark;
        r = {
          display: I(u.display ?? !1),
          pinned: I(u.pinned ?? !1),
          content: I(u.content ?? ""),
          frequency: I(u.frequency ?? 30),
          duration: I(u.duration ?? 5),
          tokens: I(u.tokens ?? {}),
          readonly: u.readonly ?? !1
        }, a.push(
          U(
            r.display,
            (l) => e.emit("watermark:display", { display: l })
          ),
          U(
            r.pinned,
            (l) => e.emit("watermark:pin", { pinned: l })
          )
        );
      }
      const o = {
        fontSize: t,
        isVisible: n,
        isFullscreen: s,
        enterFullscreen() {
          s.value = !0;
        },
        exitFullscreen() {
          s.value = !1;
        },
        watermark: r
      };
      return e.subtitle = o, () => {
        n.value = !1, s.value = !1, a.forEach((u) => u()), e.subtitle = void 0;
      };
    }
  };
}
function fl(i) {
  return {
    id: i.wid,
    text: i.word,
    ...i.stime !== void 0 && { startTime: i.stime },
    ...i.etime !== void 0 && { endTime: i.etime },
    ...i.confidence !== void 0 && { confidence: i.confidence }
  };
}
function El(i) {
  const e = /* @__PURE__ */ new Map();
  for (const s of i.speakers)
    e.set(s.speaker_id, {
      id: s.speaker_id,
      name: s.speaker_name,
      color: ""
    });
  const t = i.text.map((s) => {
    const r = s.words.map(fl), a = r[0]?.startTime ?? s.stime, o = r.length > 0 ? r[r.length - 1].endTime ?? s.etime : s.etime;
    return {
      id: s.turn_id,
      speakerId: s.speaker_id || null,
      text: r.length > 0 ? null : s.segment,
      words: r,
      ...a !== void 0 && { startTime: a },
      ...o !== void 0 && { endTime: o },
      language: s.language
    };
  }), n = i.metadata.transcription.lang ?? i.text[0]?.language ?? "fr";
  return {
    title: i.name,
    description: i.description,
    speakers: e,
    channels: [
      {
        id: "default",
        name: "Canal 1",
        duration: i.metadata.audio.duration,
        translations: [
          {
            id: "source",
            languages: [n],
            isSource: !0,
            audio: {
              src: i.metadata.audio.filepath,
              filename: i.metadata.audio.filename
            },
            turns: t
          }
        ]
      }
    ]
  };
}
let Vn = 0;
function pl(i) {
  return {
    id: `w_${Vn++}`,
    text: i.word,
    startTime: i.start,
    endTime: i.end,
    confidence: i.score
  };
}
function Tl(i) {
  Vn = 0;
  const e = /* @__PURE__ */ new Map();
  for (const r of i.segments)
    r.speaker && !e.has(r.speaker) && e.set(r.speaker, {
      id: r.speaker,
      name: r.speaker,
      color: ""
    });
  const t = i.language ?? "fr", n = i.segments.map((r, a) => {
    const o = r.words.map(pl);
    return {
      id: `turn_${a}`,
      speakerId: r.speaker ?? null,
      text: o.length > 0 ? null : r.text,
      words: o,
      startTime: r.start,
      endTime: r.end,
      language: t
    };
  }), s = i.segments.length > 0 ? i.segments[i.segments.length - 1].end : 0;
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
            turns: n
          }
        ]
      }
    ]
  };
}
export {
  Z as DocumentValidationError,
  kl as EditorLayout,
  wl as createAudioPlugin,
  ml as createEditorStore,
  Sl as createLivePlugin,
  Cl as createSubtitlePlugin,
  El as mapApiDocument,
  Tl as mapWhisperXDocument,
  gl as provideEditorStore,
  yl as provideI18n,
  ye as useEditorStore,
  _i as validateEditorDocument
};
