import * as Bl from "vue";
import { shallowReactive as Da, ref as D, computed as O, inject as bs, provide as Qn, h as Ue, defineComponent as B, openBlock as A, createElementBlock as K, renderSlot as G, useSlots as cm, normalizeClass as $r, createCommentVNode as ee, createElementVNode as J, toDisplayString as re, createVNode as F, withCtx as N, createTextVNode as Ke, createBlock as z, unref as v, watchEffect as Je, onBeforeUnmount as An, normalizeStyle as On, Fragment as it, renderList as Dn, createStaticVNode as um, watch as te, onMounted as ve, markRaw as Pa, reactive as _a, render as Fl, getCurrentInstance as tn, nextTick as ye, customRef as Zu, useTemplateRef as Lr, Transition as dm, useId as fm, toValue as Le, getCurrentScope as ed, onScopeDispose as td, effectScope as nd, shallowRef as Sn, readonly as hm, toHandlerKey as pm, camelize as rd, toRef as Oi, onUnmounted as ai, toRefs as cr, Comment as mm, mergeProps as ce, cloneVNode as gm, Teleport as id, normalizeProps as Na, guardReactiveProps as Ia, watchPostEffect as sd, shallowReadonly as Ln, mergeDefaults as ym, withKeys as Fo, withModifiers as pn, withMemo as vm, resolveDynamicComponent as bm, useModel as wm, withDirectives as Sm, vShow as xm, triggerRef as zl } from "vue";
import * as W from "yjs";
import { UndoManager as km, Item as Cm, ContentType as Tm, Text as Em, XmlElement as Mm, Doc as Am } from "yjs";
function Om() {
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
const Vl = [
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
function Dm(n, e, t) {
  const r = Vl[n.size % Vl.length];
  return { id: e, name: t, color: r };
}
function Pm(n, e, t) {
  return !e || n.has(e) ? null : Dm(n, e, t ?? e);
}
function _m(n, e, t) {
  const r = n.get(e);
  return r ? { ...r, ...t } : null;
}
function Nm(n) {
  const e = Da(/* @__PURE__ */ new Map());
  function t(s, o) {
    const a = Pm(e, s, o);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function r(s, o) {
    const a = _m(e, s, o);
    a && (e.set(s, a), n("speaker:update", { speaker: a }));
  }
  function i() {
    e.clear();
  }
  return { all: e, ensure: t, update: r, clear: i };
}
function Im(n, e) {
  return [...n, e];
}
function Rm(n, e) {
  return [...e, ...n];
}
function $m(n, e, t) {
  const r = n.findIndex((s) => s.id === e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e };
  return {
    turns: n.map((s, o) => o === r ? i : s),
    updated: i
  };
}
function Lm(n, e) {
  const t = n.findIndex((r) => r.id === e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function Bm(n, e, t) {
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
    turns: n.map((o, a) => a === r ? s : o),
    updated: s
  };
}
function zo(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function Fm(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = D(n.turns);
  function l(p) {
    t(p.speakerId), a.value = Im(a.value, p), e("turn:add", { turn: p, translationId: r });
  }
  function c(p, m) {
    const g = $m(a.value, p, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function u(p) {
    const m = Lm(a.value, p);
    m && (a.value = m, e("turn:remove", { turnId: p, translationId: r }));
  }
  function d(p, m) {
    const g = Bm(a.value, p, m);
    g && (a.value = g.turns, e("turn:update", { turn: g.updated, translationId: r }));
  }
  function f(p) {
    zo(p, t), a.value = Rm(a.value, p);
  }
  function h(p) {
    zo(p, t), a.value = p, e("translation:sync", { translationId: r });
  }
  return { id: r, languages: i, isSource: s, audio: o, turns: a, addTurn: l, prependTurns: f, updateTurn: c, removeTurn: u, updateWords: d, setTurns: h };
}
function ql(n, e, t) {
  const { id: r, name: i, description: s, duration: o } = n, a = Da(/* @__PURE__ */ new Map());
  let l;
  for (const m of n.translations) {
    const g = Fm(m, e, t);
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
function zm(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Vm(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Ra(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function od(n, e, t, r = "*") {
  return n.map((i) => ({
    value: i.id,
    label: i.languages.map((s) => Ra(s, e, r)).join(", ") + (i.isSource ? ` (${t})` : "")
  }));
}
function qm(n, e = 250) {
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
function Wi(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
class qe extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Wm(n) {
  if (n == null || typeof n != "object")
    throw new qe("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new qe("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new qe("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new qe("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new qe(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new qe(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new qe(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new qe(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new qe(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new qe(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new qe(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new qe(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new qe(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new qe(`${a}.turns`, "must be an array");
    }
  }
}
function Um(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const l = Math.floor(a * s), c = Math.abs(i[l] ?? 0);
    let u = a, d = c * (r / 2);
    e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0), u = u + o, d = -d, e.moveTo(u, 0), e.lineTo(u, d), e.lineTo(u + o, 0);
  }
  e.stroke(), e.closePath();
}
function $a(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
const Hm = 1;
function ad(n, e) {
  if (!$a(n)) return null;
  for (const t of n)
    if (t.startTime - Hm <= e && e <= t.endTime)
      return t.id;
  return null;
}
function sO(n = {}) {
  const e = D(""), t = D(n.activeChannelId ?? ""), r = D(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: i, off: s, emit: o, clear: a } = Om(), l = Nm(o), c = l, u = Da(/* @__PURE__ */ new Map()), d = O(
    () => u.get(t.value) ?? [...u.values()][0]
  );
  function f(C, w) {
    return i(C, (E) => {
      const T = d.value;
      T && E.translationId === T.activeTranslation.value.id && w(E);
    });
  }
  function h(C) {
    e.value = C.title, l.clear(), u.clear();
    for (const w of zm(C))
      c.ensure(w.id, w.name);
    for (const w of C.channels)
      u.set(w.id, ql(w, o, c.ensure));
    u.size > 0 && !u.has(t.value) && (t.value = u.keys().next().value);
  }
  function p(C) {
    Wm(C), h(C);
  }
  function m(C) {
    C !== t.value && (t.value = C, o("channel:change", { channelId: C }));
  }
  function g(C, w) {
    if (u.has(C)) {
      for (const E of w.translations)
        zo(E.turns, c.ensure);
      u.set(C, ql(w, o, c.ensure)), o("channel:sync", { channelId: C });
    }
  }
  const y = [], S = [];
  function x(C) {
    C.tiptapExtensions && S.push(...C.tiptapExtensions);
    const w = C.install(k);
    w && y.push(w);
  }
  function b() {
    o("destroy", void 0), y.forEach((C) => C()), y.length = 0, a();
  }
  n.document && h(n.document);
  const k = {
    title: e,
    activeChannelId: t,
    capabilities: r,
    pluginExtensions: S,
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
const ld = /* @__PURE__ */ Symbol("core");
function oO(n) {
  Qn(ld, n);
}
function Lt() {
  const n = bs(ld);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const jm = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Wl = (n) => n === "";
const Km = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const Ul = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Jm = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Xm = (n) => {
  const e = Jm(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var mr = {
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
const Ym = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = mr.width,
  color: a = mr.stroke,
  ...l
}, { slots: c }) => Ue(
  "svg",
  {
    ...mr,
    ...l,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": Wl(t) || Wl(r) || t === !0 || r === !0 ? Number(i || s || mr["stroke-width"]) * 24 / Number(o) : i || s || mr["stroke-width"],
    class: Km(
      "lucide",
      l.class,
      ...n ? [`lucide-${Ul(Xm(n))}-icon`, `lucide-${Ul(n)}`] : ["lucide-icon"]
    ),
    ...!c.default && !jm(l) && { "aria-hidden": "true" }
  },
  [...e.map((u) => Ue(...u)), ...c.default ? [c.default()] : []]
);
const et = (n, e) => (t, { slots: r, attrs: i }) => Ue(
  Ym,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const Gm = et("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const cd = et("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Qm = et("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Hl = et("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Zm = et("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const eg = et("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const tg = et("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const ng = et("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const rg = et("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const ig = et("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const sg = et("volume-2", [
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
const og = et("volume-x", [
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
const ud = et("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), ag = ["aria-label"], lg = /* @__PURE__ */ B({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (A(), K("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      G(e.$slots, "default", {}, void 0, !0)
    ], 8, ag));
  }
}), Oe = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, Vo = /* @__PURE__ */ Oe(lg, [["__scopeId", "data-v-732d4c24"]]), cg = ["disabled", "aria-label"], ug = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, dg = /* @__PURE__ */ B({
  __name: "Button",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = cm(), r = O(() => !!t.icon && !t.default), i = O(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      r.value && "editor-btn--icon-only"
    ]);
    return (s, o) => (A(), K("button", {
      type: "button",
      class: $r(i.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      s.$slots.icon ? (A(), K("span", ug, [
        G(s.$slots, "icon", {}, void 0, !0)
      ])) : ee("", !0),
      G(s.$slots, "default", {}, void 0, !0)
    ], 10, cg));
  }
}), mt = /* @__PURE__ */ Oe(dg, [["__scopeId", "data-v-d2460090"]]), dd = {
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
}, fg = {
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
}, jl = { fr: dd, en: fg }, fd = /* @__PURE__ */ Symbol("i18n");
function aO(n) {
  const e = O(() => {
    const r = jl[n.value] ?? jl.fr;
    return (i) => r[i] ?? i;
  }), t = {
    t: (r) => e.value(r),
    locale: n
  };
  return Qn(fd, t), t;
}
function kt() {
  const n = bs(fd);
  if (n) return n;
  const e = O(() => "fr");
  return {
    t: (t) => dd[t] ?? t,
    locale: e
  };
}
const hg = { class: "editor-header" }, pg = { class: "header-left" }, mg = { class: "document-title" }, gg = { class: "badges" }, yg = ["datetime"], vg = { class: "header-right" }, bg = /* @__PURE__ */ B({
  __name: "Header",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: r } = kt(), i = O(() => Ra(e.language, r.value, t("language.wildcard"))), s = O(() => Wi(e.duration)), o = O(() => e.title.replace(/-/g, " "));
    return (a, l) => (A(), K("header", hg, [
      J("div", pg, [
        J("h1", mg, re(o.value), 1),
        J("div", gg, [
          F(Vo, null, {
            default: N(() => [
              Ke(re(i.value), 1)
            ]),
            _: 1
          }),
          F(Vo, null, {
            default: N(() => [
              J("time", {
                datetime: `PT${n.duration}S`
              }, re(s.value), 9, yg)
            ]),
            _: 1
          })
        ])
      ]),
      J("div", vg, [
        n.isMobile ? (A(), z(mt, {
          key: 0,
          variant: "ghost",
          "aria-label": v(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (c) => a.$emit("toggleSidebar"))
        }, {
          icon: N(() => [
            F(v(ig), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : ee("", !0),
        n.isMobile ? (A(), z(mt, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": v(t)("header.export")
        }, {
          icon: N(() => [
            F(v(Hl), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (A(), z(mt, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: N(() => [
            F(v(Hl), { size: 16 })
          ]),
          default: N(() => [
            Ke(" " + re(v(t)("header.export")), 1)
          ]),
          _: 1
        })),
        F(mt, {
          variant: "ghost",
          disabled: "",
          "aria-label": v(t)("header.settings")
        }, {
          icon: N(() => [
            F(v(tg), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), wg = /* @__PURE__ */ Oe(bg, [["__scopeId", "data-v-fce7f10f"]]), eo = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Sg = 70, xg = 1e3 / 60, kg = 350;
let Di = !1, Kl = !1;
function Cg() {
  Kl || typeof document > "u" || (document.addEventListener("mousedown", () => {
    Di = !0;
  }), document.addEventListener("mouseup", () => {
    Di = !1;
  }), document.addEventListener("click", () => {
    Di = !1;
  }), Kl = !0);
}
const to = /* @__PURE__ */ new Map();
function no(...n) {
  const e = {
    damping: eo.damping,
    stiffness: eo.stiffness,
    mass: eo.mass
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
  return to.has(r) || to.set(r, Object.freeze({ ...e })), t ? "instant" : to.get(r);
}
function Tg(n = {}) {
  Cg();
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
  function a(M) {
    r.scrollElement && (r.scrollElement.scrollTop = M, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function l() {
    const M = r.scrollElement, I = r.contentElement;
    return !M || !I ? 0 : M.scrollHeight - 1 - M.clientHeight;
  }
  let c;
  function u() {
    const M = r.scrollElement, I = r.contentElement;
    if (!M || !I)
      return 0;
    const R = l();
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
    return d() <= Sg;
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
    if (!Di || typeof window > "u")
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
        a(q);
        return;
      }
      $ && (p(!0), h(!1)), _ && p(!1), !r.escapedFromLock && f() && h(!0);
    }, 1);
  }, S = (M) => {
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
  function x(M, I) {
    b(), r.scrollElement = M, r.contentElement = I, getComputedStyle(M).overflow === "visible" && (M.style.overflow = "auto"), M.addEventListener("scroll", y, { passive: !0 }), M.addEventListener("wheel", S, { passive: !0 });
    let R;
    r.resizeObserver = new ResizeObserver((q) => {
      const _ = q[0];
      if (!_)
        return;
      const { height: $ } = _.contentRect, ne = $ - (R ?? $);
      if (r.resizeDifference = ne, o() > l() && a(l()), m(f()), ne >= 0) {
        const X = no(
          e,
          R ? e.resize : e.initial
        );
        w({
          animation: X,
          wait: !0,
          preserveScrollPosition: !0,
          duration: X === "instant" ? void 0 : kg
        });
      } else
        f() && (p(!1), h(!0));
      R = $, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === ne && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(I);
  }
  function b() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", y), r.scrollElement.removeEventListener("wheel", S)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function k() {
    b(), t.clear();
  }
  function C(M) {
    e = { ...e, ...M };
  }
  function w(M = {}) {
    const I = typeof M == "string" ? { animation: M } : M;
    I.preserveScrollPosition || h(!0);
    const R = Date.now() + (Number(I.wait) || 0), q = no(e, I.animation), { ignoreEscapes: _ = !1 } = I;
    let $, ne = u();
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
        const de = o(), Ve = typeof performance < "u" ? performance.now() : Date.now(), Rn = (Ve - (r.lastTick ?? Ve)) / xg;
        if (r.animation ||= { behavior: q, promise: ie, ignoreEscapes: _ }, r.animation.behavior === q && (r.lastTick = Ve), g() || R > Date.now())
          return X();
        if (de < Math.min(ne, u())) {
          if (r.animation?.behavior === q) {
            if (q === "instant")
              return a(u()), X();
            const lt = q;
            r.velocity = (lt.damping * r.velocity + lt.stiffness * d()) / lt.mass, r.accumulated += r.velocity * Rn;
            const $n = o();
            a($n + r.accumulated), o() !== $n && (r.accumulated = 0);
          }
          return X();
        }
        return $ > Date.now() ? (ne = u(), X()) : (r.animation = void 0, o() < u() ? w({
          animation: no(e, e.resize),
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
    attach: x,
    detach: b,
    destroy: k,
    setOptions: C,
    getState: s,
    onChange: T,
    scrollToBottom: w,
    stopScroll: E
  };
}
function Eg(n = {}) {
  const e = D(null), t = D(null), r = D(n.initial !== !1), i = D(!1), s = D(!1), o = Tg(n);
  let a = null;
  return Je((l) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((c) => {
      r.value = c.isAtBottom, i.value = c.isNearBottom, s.value = c.escapedFromLock;
    }), l(() => {
      a?.(), a = null, o.detach();
    }));
  }), An(() => {
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
const Mg = /* @__PURE__ */ B({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (A(), K("span", {
      class: "speaker-indicator",
      style: On({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), hd = /* @__PURE__ */ Oe(Mg, [["__scopeId", "data-v-9bffeda8"]]), Ag = { class: "speaker-label" }, Og = {
  key: 1,
  class: "speaker-name"
}, Dg = ["datetime"], Pg = /* @__PURE__ */ B({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: r } = kt(), i = O(
      () => Ra(e.language, r.value, t("language.wildcard"))
    ), s = O(
      () => e.startTime != null ? Wi(e.startTime) : null
    ), o = O(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = O(() => e.speaker?.color ?? "transparent");
    return (l, c) => (A(), K("div", Ag, [
      n.speaker ? (A(), z(hd, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : ee("", !0),
      n.speaker ? (A(), K("span", Og, re(n.speaker.name), 1)) : ee("", !0),
      s.value ? (A(), K("time", {
        key: 2,
        class: "timestamp",
        datetime: o.value
      }, re(s.value), 9, Dg)) : ee("", !0),
      F(Vo, null, {
        default: N(() => [
          Ke(re(i.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), pd = /* @__PURE__ */ Oe(Pg, [["__scopeId", "data-v-8bb5c8bd"]]), _g = ["data-turn-active"], Ng = { class: "turn-text" }, Ig = ["data-word-active"], Rg = /* @__PURE__ */ B({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Lt(), r = O(() => e.turn.words.length > 0), i = O(() => {
      if (!t.audio?.src.value || !r.value) return null;
      const a = t.audio.currentTime.value, { startTime: l, endTime: c, words: u } = e.turn;
      return l == null || c == null || a < l || a > c ? null : ad(u, a);
    }), s = O(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || $a(e.turn.words)) return !1;
      const a = t.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), o = O(() => e.speaker?.color ?? "transparent");
    return (a, l) => (A(), K("section", {
      class: $r(["turn", { "turn--active": s.value, "turn--partial": n.partial }]),
      "data-turn-active": s.value || n.partial || n.live || void 0,
      style: On({ "--speaker-color": o.value })
    }, [
      n.partial ? ee("", !0) : (A(), z(pd, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      J("p", Ng, [
        r.value ? (A(!0), K(it, { key: 0 }, Dn(n.turn.words, (c, u) => (A(), K(it, {
          key: c.id
        }, [
          J("span", {
            class: $r({ "word--active": c.id === i.value }),
            "data-word-active": c.id === i.value || void 0
          }, re(c.text), 11, Ig),
          Ke(re(u < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (A(), K(it, { key: 1 }, [
          Ke(re(n.turn.text), 1)
        ], 64)) : ee("", !0)
      ])
    ], 14, _g));
  }
}), Jl = /* @__PURE__ */ Oe(Rg, [["__scopeId", "data-v-8d148b2f"]]), $g = {}, Lg = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function Bg(n, e) {
  return A(), K("svg", Lg, [...e[0] || (e[0] = [
    um('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Fg = /* @__PURE__ */ Oe($g, [["render", Bg]]), zg = { class: "transcription-empty" }, Vg = { class: "message" }, qg = /* @__PURE__ */ B({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = kt();
    return (t, r) => (A(), K("div", zg, [
      F(Fg, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      J("p", Vg, re(v(e)("transcription.empty")), 1)
    ]));
  }
}), Wg = /* @__PURE__ */ Oe(qg, [["__scopeId", "data-v-f82737e5"]]), Ug = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function Hg(n) {
  const e = Lt(), t = D(!0), r = window.matchMedia(
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
    Ug.has(u.key) && s();
  }
  function a(u) {
    const d = n.value;
    d && (d.addEventListener("wheel", u, { passive: !0 }), d.addEventListener("touchstart", u, { passive: !0 }), d.addEventListener("pointerdown", u, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function l(u) {
    const d = n.value;
    d && (d.removeEventListener("wheel", u), d.removeEventListener("touchstart", u), d.removeEventListener("pointerdown", u), d.removeEventListener("keydown", o));
  }
  ve(() => {
    a(s);
  }), An(() => {
    l(s);
  });
  function c() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: c };
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
function md(n, e, t) {
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
      let o = md(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function gd(n, e, t, r) {
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
      let c = gd(o.content, a.content, t - 1, r - 1);
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
    return md(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return gd(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. @internal
  */
  findIndex(e) {
    if (e == 0)
      return mi(0, e);
    if (e == this.size)
      return mi(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let t = 0, r = 0; ; t++) {
      let i = this.child(t), s = r + i.nodeSize;
      if (s >= e)
        return s == e ? mi(t + 1, s) : mi(t, r);
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
const ro = { index: 0, offset: 0 };
function mi(n, e) {
  return ro.index = n, ro.offset = e, ro;
}
function Ui(n, e) {
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
      if (!Ui(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Ui(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
let ae = class qo {
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
    return this == e || this.type == e.type && Ui(this.attrs, e.attrs);
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
      return qo.none;
    if (e instanceof qo)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
};
ae.none = [];
class Hi extends Error {
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
    let r = vd(this.content, e + this.openStart, t);
    return r && new L(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new L(yd(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
    return new L(P.fromJSON(e, t.content), r, i);
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
L.empty = new L(P.empty, 0, 0);
function yd(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: a } = n.findIndex(t);
  if (i == e || s.isText) {
    if (a != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(yd(s.content, e - i - 1, t - i - 1)));
}
function vd(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = vd(o.content, e - s - 1, t, o);
  return a && n.replaceChild(i, o.copy(a));
}
function jg(n, e, t) {
  if (t.openStart > n.depth)
    throw new Hi("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Hi("Inconsistent open depths");
  return bd(n, e, t, 0);
}
function bd(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = bd(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, a = o.content;
      return gn(o, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: o, end: a } = Kg(t, n);
      return gn(s, Sd(n, o, a, e, r));
    }
  else return gn(s, ji(n, e, r));
}
function wd(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Hi("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Wo(n, e, t) {
  let r = n.node(t);
  return wd(r, e.node(t)), r;
}
function mn(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function kr(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (mn(n.nodeAfter, r), s++));
  for (let a = s; a < o; a++)
    mn(i.child(a), r);
  e && e.depth == t && e.textOffset && mn(e.nodeBefore, r);
}
function gn(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Sd(n, e, t, r, i) {
  let s = n.depth > i && Wo(n, e, i + 1), o = r.depth > i && Wo(t, r, i + 1), a = [];
  return kr(null, n, i, a), s && o && e.index(i) == t.index(i) ? (wd(s, o), mn(gn(s, Sd(n, e, t, r, i + 1)), a)) : (s && mn(gn(s, ji(n, e, i + 1)), a), kr(e, t, i, a), o && mn(gn(o, ji(t, r, i + 1)), a)), kr(r, null, i, a), new P(a);
}
function ji(n, e, t) {
  let r = [];
  if (kr(null, n, t, r), n.depth > t) {
    let i = Wo(n, e, t + 1);
    mn(gn(i, ji(n, e, t + 1)), r);
  }
  return kr(e, null, t, r), new P(r);
}
function Kg(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(P.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Br {
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
        return new Ki(this, e, r);
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
    return new Br(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    let r = Xl.get(e);
    if (r)
      for (let s = 0; s < r.elts.length; s++) {
        let o = r.elts[s];
        if (o.pos == t)
          return o;
      }
    else
      Xl.set(e, r = new Jg());
    let i = r.elts[r.i] = Br.resolve(e, t);
    return r.i = (r.i + 1) % Xg, i;
  }
}
class Jg {
  constructor() {
    this.elts = [], this.i = 0;
  }
}
const Xg = 12, Xl = /* @__PURE__ */ new WeakMap();
class Ki {
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
const Yg = /* @__PURE__ */ Object.create(null);
let Dt = class Uo {
  /**
  @internal
  */
  constructor(e, t, r, i = ae.none) {
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
    return this.type == e && Ui(this.attrs, t || e.defaultAttrs || Yg) && ae.sameSet(this.marks, r || ae.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Uo(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Uo(this.type, this.attrs, this.content, e);
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
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), a = i.start(o), c = i.node(o).content.cut(i.pos - a, s.pos - a);
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
    return jg(this.resolve(e), this.resolve(t), r);
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
    return Br.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Br.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), xd(this.marks, e);
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
    let i = P.fromJSON(e, t.content), s = e.nodeType(t.type).create(t.attrs, i, r);
    return s.type.checkAttrs(s.attrs), s;
  }
};
Dt.prototype.text = void 0;
class Ji extends Dt {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : xd(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new Ji(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Ji(this.type, this.attrs, e, this.marks);
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
function xd(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class xn {
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
    let r = new Gg(e, t);
    if (r.next == null)
      return xn.empty;
    let i = kd(r);
    r.next && r.err("Unexpected trailing text");
    let s = iy(ry(i));
    return sy(s, r), s;
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
xn.empty = new xn(!0);
class Gg {
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
function kd(n) {
  let e = [];
  do
    e.push(Qg(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Qg(n) {
  let e = [];
  do
    e.push(Zg(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Zg(n) {
  let e = ny(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = ey(n, e);
    else
      break;
  return e;
}
function Yl(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function ey(n, e) {
  let t = Yl(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Yl(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function ty(n, e) {
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
function ny(n) {
  if (n.eat("(")) {
    let e = kd(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = ty(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function ry(n) {
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
function Cd(n, e) {
  return e - n;
}
function Gl(n, e) {
  let t = [];
  return r(e), t.sort(Cd);
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
function iy(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Gl(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        Gl(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new xn(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let a = i[o][1].sort(Cd);
      s.next.push({ type: i[o][0], next: e[a.join(",")] || t(a) });
    }
    return s;
  }
}
function sy(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      o.push(l.name), s && !(l.isText || l.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Td(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Ed(n, e) {
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
function Md(n, e, t, r) {
  for (let i in e)
    if (!(i in n))
      throw new RangeError(`Unsupported attribute ${i} for ${t} of type ${i}`);
  for (let i in n) {
    let s = n[i];
    s.validate && s.validate(e[i]);
  }
}
function Ad(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  if (e)
    for (let r in e)
      t[r] = new ay(n, r, e[r]);
  return t;
}
let Ql = class Od {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Ad(e, r.attrs), this.defaultAttrs = Td(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == xn.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Ed(this.attrs, e);
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
    return new Dt(this, this.computeAttrs(e), P.from(t), ae.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = P.from(t), this.checkContent(t), new Dt(this, this.computeAttrs(e), t, ae.setFrom(r));
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
    return s ? new Dt(this, e, t.append(s), ae.setFrom(r)) : null;
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
    Md(this.attrs, e, "node", this.name);
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
    e.forEach((s, o) => r[s] = new Od(s, t, o));
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
function oy(n, e, t) {
  let r = t.split("|");
  return (i) => {
    let s = i === null ? "null" : typeof i;
    if (r.indexOf(s) < 0)
      throw new RangeError(`Expected value of type ${r} for attribute ${e} on type ${n}, got ${s}`);
  };
}
class ay {
  constructor(e, t, r) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(r, "default"), this.default = r.default, this.validate = typeof r.validate == "string" ? oy(e, t, r.validate) : r.validate;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class ws {
  /**
  @internal
  */
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Ad(e, i.attrs), this.excluded = null;
    let s = Td(this.attrs);
    this.instance = s ? new ae(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new ae(this, Ed(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new ws(s, i++, t, o)), r;
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
    Md(this.attrs, e, "mark", this.name);
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
let Dd = class {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = ke.from(e.nodes), t.marks = ke.from(e.marks || {}), this.nodes = Ql.compile(this.spec.nodes, this), this.marks = ws.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let s = this.nodes[i], o = s.spec.content || "", a = s.spec.marks;
      if (s.contentMatch = r[o] || (r[o] = xn.parse(o, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!s.isInline || !s.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = s;
      }
      s.markSet = a == "_" ? null : a ? Zl(this, a.split(" ")) : a == "" || !s.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let s = this.marks[i], o = s.spec.excludes;
      s.excluded = o == null ? [s] : o == "" ? [] : Zl(this, o.split(" "));
    }
    this.nodeFromJSON = (i) => Dt.fromJSON(this, i), this.markFromJSON = (i) => ae.fromJSON(this, i), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
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
    else if (e instanceof Ql) {
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
    return new Ji(r, r.defaultAttrs, e, ae.setFrom(t));
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
function Zl(n, e) {
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
function ly(n) {
  return n.tag != null;
}
function cy(n) {
  return n.style != null;
}
let Cr = class Ho {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [];
    let r = this.matchedStyles = [];
    t.forEach((i) => {
      if (ly(i))
        this.tags.push(i);
      else if (cy(i)) {
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
    let r = new tc(this, t, !1);
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
    let r = new tc(this, t, !0);
    return r.addAll(e, ae.none, t.from, t.to), L.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (fy(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(o = nc(o)), o.mark || o.ignore || o.clearMark || (o.mark = i);
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = nc(o)), o.node || o.ignore || o.mark || (o.node = i);
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
    return e.cached.domParser || (e.cached.domParser = new Ho(e, Ho.schemaRules(e)));
  }
};
const Pd = {
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
}, uy = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, _d = { ol: !0, ul: !0 }, Fr = 1, jo = 2, Tr = 4;
function ec(n, e, t) {
  return e != null ? (e ? Fr : 0) | (e === "full" ? jo : 0) : n && n.whitespace == "pre" ? Fr | jo : t & ~Tr;
}
class gi {
  constructor(e, t, r, i, s, o) {
    this.type = e, this.attrs = t, this.marks = r, this.solid = i, this.options = o, this.content = [], this.activeMarks = ae.none, this.match = s || (o & Tr ? null : e.contentMatch);
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
    if (!(this.options & Fr)) {
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
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Pd.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class tc {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0, this.localPreserveWS = !1;
    let i = t.topNode, s, o = ec(null, t.preserveWhitespace, 0) | (r ? Tr : 0);
    i ? s = new gi(i.type, i.attrs, ae.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new gi(null, null, ae.none, !0, null, o) : s = new gi(e.schema.topNodeType, null, ae.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let r = e.nodeValue, i = this.top, s = i.options & jo ? "full" : this.localPreserveWS || (i.options & Fr) > 0, { schema: o } = this.parser;
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
    _d.hasOwnProperty(o) && this.parser.normalizeLists && dy(e);
    let l = this.options.ruleFromNode && this.options.ruleFromNode(e) || (a = this.parser.matchTag(e, this, r));
    e: if (l ? l.ignore : uy.hasOwnProperty(o))
      this.findInside(e), this.ignoreFallback(e, t);
    else if (!l || l.skip || l.closeParent) {
      l && l.closeParent ? this.open = Math.max(0, this.open - 1) : l && l.skip.nodeType && (e = l.skip);
      let c, u = this.needsBlock;
      if (Pd.hasOwnProperty(o))
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
        (s.type ? s.type.allowsMarkType(a.type) : rc(a.type, e.type)) && (o = a.addToSet(o));
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
    let a = ec(e, s, o.options);
    o.options & Tr && o.content.length == 0 && (a |= Tr);
    let l = ae.none;
    return r = r.filter((c) => (o.type ? o.type.allowsMarkType(c.type) : rc(c.type, e)) ? (l = c.addToSet(l), !1) : !0), this.nodes.push(new gi(e, t, l, i, null, a)), this.open++, r;
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
      this.localPreserveWS && (this.nodes[t].options |= Fr);
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
function dy(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && _d.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function fy(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function nc(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function rc(n, e) {
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
class Pn {
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
    r || (r = io(t).createDocumentFragment());
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
    let { dom: r, contentDOM: i } = Pi(io(t), this.nodes[e.type.name](e), null, e.attrs);
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
    return i && Pi(io(r), i(e, t), null, e.attrs);
  }
  static renderSpec(e, t, r = null, i) {
    return Pi(e, t, r, i);
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Pn(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = ic(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return ic(e.marks);
  }
}
function ic(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function io(n) {
  return n.document || window.document;
}
const sc = /* @__PURE__ */ new WeakMap();
function hy(n) {
  let e = sc.get(n);
  return e === void 0 && sc.set(n, e = py(n)), e;
}
function py(n) {
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
function Pi(n, e, t, r) {
  if (typeof e == "string")
    return { dom: n.createTextNode(e) };
  if (e.nodeType != null)
    return { dom: e };
  if (e.dom && e.dom.nodeType != null)
    return e;
  let i = e[0], s;
  if (typeof i != "string")
    throw new RangeError("Invalid array passed to renderSpec");
  if (r && (s = hy(r)) && s.indexOf(e) > -1)
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
      let { dom: h, contentDOM: p } = Pi(n, f, t, r);
      if (l.appendChild(h), p) {
        if (a)
          throw new RangeError("Multiple content holes");
        a = p;
      }
    }
  }
  return { dom: l, contentDOM: a };
}
const Nd = 65535, Id = Math.pow(2, 16);
function my(n, e) {
  return n + e * Id;
}
function oc(n) {
  return n & Nd;
}
function gy(n) {
  return (n - (n & Nd)) / Id;
}
const Rd = 1, $d = 2, _i = 4, Ld = 8;
class Ko {
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
    return (this.delInfo & Ld) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Rd | _i)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & ($d | _i)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & _i) > 0;
  }
}
class Qe {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && Qe.empty)
      return Qe.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = oc(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + gy(e);
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
        let p = e == (t < 0 ? l : d) ? null : my(a / 3, e - l), m = e == l ? $d : e == d ? Rd : _i;
        return (t < 0 ? e != l : e != d) && (m |= Ld), new Ko(h, m, p);
      }
      i += u - c;
    }
    return r ? e + i : new Ko(e + i, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, i = oc(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
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
    return new Qe(this.ranges, !this.inverted);
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
    return e == 0 ? Qe.empty : new Qe(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
Qe.empty = new Qe([]);
class Xi {
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
    return new Xi(this._maps, this.mirror, e, t);
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
    let e = new Xi();
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
    return r ? e : new Ko(e, i, null);
  }
}
const so = /* @__PURE__ */ Object.create(null);
class Ie {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return Qe.empty;
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
    let r = so[t.stepType];
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
    if (e in so)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return so[e] = t, t.prototype.jsonID = e, t;
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
      if (s instanceof Hi)
        return pe.fail(s.message);
      throw s;
    }
  }
}
function La(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(La(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return P.fromArray(r);
}
class Ht extends Ie {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new L(La(t.content, (o, a) => !o.isAtom || !a.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new ut(this.from, this.to, this.mark);
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
Ie.jsonID("addMark", Ht);
class ut extends Ie {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new L(La(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return pe.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Ht(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ut(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ut && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ut(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new ut(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Ie.jsonID("removeMark", ut);
class jt extends Ie {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new L(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new jt(this.pos, t.marks[i]);
        return new jt(this.pos, this.mark);
      }
    }
    return new kn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new jt(t.pos, this.mark);
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
    return new jt(t.pos, e.markFromJSON(t.mark));
  }
}
Ie.jsonID("addNodeMark", jt);
class kn extends Ie {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new L(P.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new jt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new kn(t.pos, this.mark);
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
    return new kn(t.pos, e.markFromJSON(t.mark));
  }
}
Ie.jsonID("removeNodeMark", kn);
class be extends Ie {
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
    return this.structure && Jo(e, this.from, this.to) ? pe.fail("Structure replace would overwrite content") : pe.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new Qe([this.from, this.to - this.from, this.slice.size]);
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
      let t = this.slice.size + e.slice.size == 0 ? L.empty : new L(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new be(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? L.empty : new L(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
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
    return new be(t.from, t.to, L.fromJSON(e, t.slice), !!t.structure);
  }
}
Ie.jsonID("replace", be);
class we extends Ie {
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
    if (this.structure && (Jo(e, this.from, this.gapFrom) || Jo(e, this.gapTo, this.to)))
      return pe.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return pe.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? pe.fromReplace(e, this.from, this.to, r) : pe.fail("Content does not fit in gap");
  }
  getMap() {
    return new Qe([
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
    return new we(t.from, t.to, t.gapFrom, t.gapTo, L.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Ie.jsonID("replaceAround", we);
function Jo(n, e, t) {
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
function yy(n, e, t, r) {
  let i = [], s = [], o, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), h = Math.min(c + l.nodeSize, t), p = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(p) || (o && o.to == f && o.mark.eq(d[m]) ? o.to = h : i.push(o = new ut(f, h, d[m])));
      a && a.to == f ? a.to = h : s.push(a = new Ht(f, h, r));
    }
  }), i.forEach((l) => n.step(l)), s.forEach((l) => n.step(l));
}
function vy(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, a) => {
    if (!o.isInline)
      return;
    s++;
    let l = null;
    if (r instanceof ws) {
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
  }), i.forEach((o) => n.step(new ut(o.from, o.to, o.style)));
}
function Ba(n, e, t, r = t.contentMatch, i = !0) {
  let s = n.doc.nodeAt(e), o = [], a = e + 1;
  for (let l = 0; l < s.childCount; l++) {
    let c = s.child(l), u = a + c.nodeSize, d = r.matchType(c.type);
    if (!d)
      o.push(new be(a, u, L.empty));
    else {
      r = d;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new ut(a, u, c.marks[f]));
      if (i && c.isText && t.whitespace != "pre") {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new L(P.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), o.push(new be(a + f.index, a + f.index + f[0].length, p));
      }
    }
    a = u;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(P.empty, !0);
    n.replace(a, a, new L(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    n.step(o[l]);
}
function by(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function ur(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth, i = 0, s = 0; ; --r) {
    let o = n.$from.node(r), a = n.$from.index(r) + i, l = n.$to.indexAfter(r) - s;
    if (r < n.depth && o.canReplace(a, l, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !by(o, a, l))
      break;
    a && (i = 1), l < o.childCount && (s = 1);
  }
  return null;
}
function wy(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), a = i.after(s + 1), l = o, c = a, u = P.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = P.from(r.node(p).copy(u)), d++) : l--;
  let f = P.empty, h = 0;
  for (let p = s, m = !1; p > t; p--)
    m || i.after(p + 1) < i.end(p) ? (m = !0, f = P.from(i.node(p).copy(f)), h++) : c++;
  n.step(new we(l, c, o, a, new L(u.append(f), d, h), u.size - d, !0));
}
function Bd(n, e, t = null, r = n) {
  let i = Sy(n, e), s = i && xy(r, e);
  return s ? i.map(ac).concat({ type: e, attrs: t }).concat(s.map(ac)) : null;
}
function ac(n) {
  return { type: n, attrs: null };
}
function Sy(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function xy(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : o;
}
function ky(n, e, t) {
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
  n.step(new we(i, s, i, s, new L(r, 0, 0), t.length, !0));
}
function Cy(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, a) => {
    let l = typeof i == "function" ? i(o) : i;
    if (o.isTextblock && !o.hasMarkup(r, l) && Ty(n.doc, n.mapping.slice(s).map(a), r)) {
      let c = null;
      if (r.schema.linebreakReplacement) {
        let h = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        h && !p ? c = !1 : !h && p && (c = !0);
      }
      c === !1 && zd(n, o, a, s), Ba(n, n.mapping.slice(s).map(a, 1), r, void 0, c === null);
      let u = n.mapping.slice(s), d = u.map(a, 1), f = u.map(a + o.nodeSize, 1);
      return n.step(new we(d, f, d + 1, f - 1, new L(P.from(r.create(l, null, o.marks)), 0, 0), 1, !0)), c === !0 && Fd(n, o, a, s), !1;
    }
  });
}
function Fd(n, e, t, r) {
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
function zd(n, e, t, r) {
  e.forEach((i, s) => {
    if (i.type == i.type.schema.linebreakReplacement) {
      let o = n.mapping.slice(r).map(t + 1 + s);
      n.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Ty(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function Ey(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new we(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new L(P.from(o), 0, 0), 1, !0));
}
function Pt(n, e, t = 1, r) {
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
function My(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = P.empty, o = P.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    s = P.from(i.node(a).copy(s));
    let u = r && r[c];
    o = P.from(u ? u.type.create(u.attrs, o) : i.node(a).copy(o));
  }
  n.step(new be(e, e, new L(s.append(o), t, t), !0));
}
function _n(n, e) {
  let t = n.resolve(e), r = t.index();
  return Vd(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Ay(n, e) {
  e.content.size || n.type.compatibleContent(e.type);
  let t = n.contentMatchAt(n.childCount), { linebreakReplacement: r } = n.type.schema;
  for (let i = 0; i < e.childCount; i++) {
    let s = e.child(i), o = s.type == r ? n.type.schema.nodes.text : s.type;
    if (t = t.matchType(o), !t || !n.type.allowsMarks(s.marks))
      return !1;
  }
  return t.validEnd;
}
function Vd(n, e) {
  return !!(n && e && !n.isLeaf && Ay(n, e));
}
function Ss(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let s, o, a = r.index(i);
    if (i == r.depth ? (s = r.nodeBefore, o = r.nodeAfter) : t > 0 ? (s = r.node(i + 1), a++, o = r.node(i).maybeChild(a)) : (s = r.node(i).maybeChild(a - 1), o = r.node(i + 1)), s && !s.isTextblock && Vd(s, o) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Oy(n, e, t) {
  let r = null, { linebreakReplacement: i } = n.doc.type.schema, s = n.doc.resolve(e - t), o = s.node().type;
  if (i && o.inlineContent) {
    let u = o.whitespace == "pre", d = !!o.contentMatch.matchType(i);
    u && !d ? r = !1 : !u && d && (r = !0);
  }
  let a = n.steps.length;
  if (r === !1) {
    let u = n.doc.resolve(e + t);
    zd(n, u.node(), u.before(), a);
  }
  o.inlineContent && Ba(n, e + t - 1, o, s.node().contentMatchAt(s.index()), r == null);
  let l = n.mapping.slice(a), c = l.map(e - t);
  if (n.step(new be(c, l.map(e + t, -1), L.empty, !0)), r === !0) {
    let u = n.doc.resolve(c);
    Fd(n, u.node(), u.before(), n.steps.length);
  }
  return n;
}
function Dy(n, e, t) {
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
function Py(n, e, t) {
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
function xs(n, e, t = e, r = L.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return qd(i, s, r) ? new be(e, t, r) : new _y(i, s, r).fit();
}
function qd(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class _y {
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
    let l = new L(s, o, a);
    return e > -1 ? new we(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new be(r.pos, i.pos, l) : null;
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
        r ? (s = oo(this.unplaced.content, r - 1).firstChild, i = s.content) : i = this.unplaced.content;
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
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = oo(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new L(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = oo(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new L(vr(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new L(vr(e, t, 1), t, r);
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
      c++, (c > 1 || l == 0 || m.content.size) && (d = g, u.push(Wd(m.mark(f.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? h : -1)));
    }
    let p = c == a.childCount;
    p || (h = -1), this.placed = br(this.placed, t, P.from(u)), this.frontier[t].match = d, p && h < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = a; m < h; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? L.empty : new L(vr(o.content, e - 1, 1), e - 1, h < 0 ? o.openEnd : e - 1) : new L(vr(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !ao(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = ao(e, t, i, r, s);
      if (o) {
        for (let a = t - 1; a >= 0; a--) {
          let { match: l, type: c } = this.frontier[a], u = ao(e, a, c, l, !0);
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
    t.fit.childCount && (this.placed = br(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = br(this.placed, this.depth, P.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(P.empty, !0);
    t.childCount && (this.placed = br(this.placed, this.frontier.length, t));
  }
}
function vr(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(vr(n.firstChild.content, e - 1, t)));
}
function br(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(br(n.lastChild.content, e - 1, t)));
}
function oo(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Wd(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Wd(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(P.empty, !0)))), n.copy(r);
}
function ao(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let a = r.fillBefore(s.content, !0, o);
  return a && !Ny(t, s.content, o) ? a : null;
}
function Ny(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Iy(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Ry(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (qd(i, s, r))
    return n.step(new be(e, t, r));
  let o = Hd(i, s);
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
    let h = c[f], p = Iy(h.type);
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
        let S = i.node(g - 1), x = i.index(g - 1);
        if (S.canReplaceWith(x, x, p.type, p.marks))
          return n.replace(i.before(g), y ? s.after(g) : t, new L(Ud(r.content, 0, r.openStart, h), h, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = o.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let h = o[f];
    h < 0 || (e = i.before(h), t = s.after(h));
  }
}
function Ud(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(Ud(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(P.empty, !0));
  }
  return n;
}
function $y(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = Dy(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new L(P.from(r), 0, 0));
}
function Ly(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Hd(r, i);
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
function Hd(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
class Kn extends Ie {
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
    return pe.fromReplace(e, this.pos, this.pos + 1, new L(P.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return Qe.empty;
  }
  invert(e) {
    return new Kn(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Kn(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Kn(t.pos, t.attr, t.value);
  }
}
Ie.jsonID("attr", Kn);
class zr extends Ie {
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
    return Qe.empty;
  }
  invert(e) {
    return new zr(this.attr, e.attrs[this.attr]);
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
    return new zr(t.attr, t.value);
  }
}
Ie.jsonID("docAttr", zr);
let Zn = class extends Error {
};
Zn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
Zn.prototype = Object.create(Error.prototype);
Zn.prototype.constructor = Zn;
Zn.prototype.name = "TransformError";
class jd {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new Xi();
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
      throw new Zn(t.failed);
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
  replace(e, t = e, r = L.empty) {
    let i = xs(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new L(P.from(r), 0, 0));
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
    return Ry(this, e, t, r), this;
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
    return $y(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return Ly(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return wy(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Oy(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return ky(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, i = null) {
    return Cy(this, e, t, r, i), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, i) {
    return Ey(this, e, t, r, i), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new Kn(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new zr(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new jt(e, t)), this;
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
      t.isInSet(r.marks) && this.step(new kn(e, t));
    else {
      let i = r.marks, s, o = [];
      for (; s = t.isInSet(i); )
        o.push(new kn(e, s)), i = s.removeFromSet(i);
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
    return My(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return yy(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return vy(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Ba(this, e, t, r), this;
  }
}
const lo = /* @__PURE__ */ Object.create(null);
class Z {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new By(e.min(t), e.max(t))];
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
    for (let a = 0; a < t.openEnd; a++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let a = 0; a < o.length; a++) {
      let { $from: l, $to: c } = o[a], u = e.mapping.slice(s);
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? L.empty : t), a == 0 && uc(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), uc(e, r, t.isInline ? -1 : 1));
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
    let i = e.parent.inlineContent ? new Y(e) : Wn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Wn(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Wn(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new He(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return Wn(e, e, 0, 0, 1) || new He(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return Wn(e, e, e.content.size, e.childCount, -1) || new He(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = lo[t.type];
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
    if (e in lo)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return lo[e] = t, t.prototype.jsonID = e, t;
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
Z.prototype.visible = !0;
class By {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let lc = !1;
function cc(n) {
  !lc && !n.parent.inlineContent && (lc = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class Y extends Z {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    cc(e), cc(t), super(e, t);
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
    return new Y(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = L.empty) {
    if (super.replace(e, t), t == L.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof Y && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new ks(this.anchor, this.head);
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
      let s = Z.findFrom(t, r, !0) || Z.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return Z.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (Z.findFrom(e, -r, !0) || Z.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new Y(e, t);
  }
}
Z.jsonID("text", Y);
class ks {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new ks(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return Y.between(e.resolve(this.anchor), e.resolve(this.head));
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
    return new L(P.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof H && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Fa(this.anchor);
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
class Fa {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new ks(r, r) : new Fa(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && H.isSelectable(r) ? new H(t) : Z.near(t);
  }
}
class He extends Z {
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
    return new He(e);
  }
  map(e) {
    return new He(e);
  }
  eq(e) {
    return e instanceof He;
  }
  getBookmark() {
    return Fy;
  }
}
Z.jsonID("all", He);
const Fy = {
  map() {
    return this;
  },
  resolve(n) {
    return new He(n);
  }
};
function Wn(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return Y.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let a = e.child(o);
    if (a.isAtom) {
      if (!s && H.isSelectable(a))
        return H.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = Wn(n, a, t + i, i < 0 ? a.childCount : 0, i, s);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function uc(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof be || i instanceof we))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((a, l, c, u) => {
    o == null && (o = u);
  }), n.setSelection(Z.near(n.doc.resolve(o), t));
}
const dc = 1, yi = 2, fc = 4;
class zy extends jd {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | dc) & ~yi, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & dc) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= yi, this;
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
    return (this.updated & yi) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~yi, this.storedMarks = null;
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
    return this.updated |= fc, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & fc) > 0;
  }
}
function hc(n, e) {
  return !e || !n ? n : n.bind(e);
}
class wr {
  constructor(e, t, r) {
    this.name = e, this.init = hc(t.init, r), this.apply = hc(t.apply, r);
  }
}
const Vy = [
  new wr("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new wr("selection", {
    init(n, e) {
      return n.selection || Z.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new wr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new wr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class co {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Vy.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new wr(r.key, r.spec.state, r));
    });
  }
}
class jn {
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
    let t = new jn(this.config), r = this.config.fields;
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
    return new zy(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new co(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new jn(t);
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
    let t = new co(this.schema, e.plugins), r = t.fields, i = new jn(t);
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
    let i = new co(e.schema, e.plugins), s = new jn(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = Dt.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = Z.fromJSON(s.doc, t.selection);
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
function Kd(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Kd(i, e, {})), t[r] = i;
  }
  return t;
}
class De {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Kd(e.props, this, this.props), this.key = e.key ? e.key.key : Jd("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const uo = /* @__PURE__ */ Object.create(null);
function Jd(n) {
  return n in uo ? n + "$" + ++uo[n] : (uo[n] = 0, n + "$");
}
class Xe {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Jd(e);
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
const za = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Xd(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Yd = (n, e, t) => {
  let r = Xd(n, t);
  if (!r)
    return !1;
  let i = Va(r);
  if (!i) {
    let o = r.blockRange(), a = o && ur(o);
    return a == null ? !1 : (e && e(n.tr.lift(o, a).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (af(n, i, e, -1))
    return !0;
  if (r.parent.content.size == 0 && (er(s, "end") || H.isSelectable(s)))
    for (let o = r.depth; ; o--) {
      let a = xs(n.doc, r.before(o), r.after(o), L.empty);
      if (a && a.slice.size < a.to - a.from) {
        if (e) {
          let l = n.tr.step(a);
          l.setSelection(er(s, "end") ? Z.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : H.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
        }
        return !0;
      }
      if (o == 1 || r.node(o - 1).childCount > 1)
        break;
    }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
}, qy = (n, e, t) => {
  let r = Xd(n, t);
  if (!r)
    return !1;
  let i = Va(r);
  return i ? Gd(n, i, e) : !1;
}, Wy = (n, e, t) => {
  let r = Zd(n, t);
  if (!r)
    return !1;
  let i = qa(r);
  return i ? Gd(n, i, e) : !1;
};
function Gd(n, e, t) {
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
  let c = xs(n.doc, s, l, L.empty);
  if (!c || c.from != s || c instanceof be && c.slice.size >= l - s)
    return !1;
  if (t) {
    let u = n.tr.step(c);
    u.setSelection(Y.create(u.doc, s)), t(u.scrollIntoView());
  }
  return !0;
}
function er(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Qd = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = Va(r);
  }
  let o = s && s.nodeBefore;
  return !o || !H.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(H.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Va(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Zd(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const ef = (n, e, t) => {
  let r = Zd(n, t);
  if (!r)
    return !1;
  let i = qa(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (af(n, i, e, 1))
    return !0;
  if (r.parent.content.size == 0 && (er(s, "start") || H.isSelectable(s))) {
    let o = xs(n.doc, r.before(), r.after(), L.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let a = n.tr.step(o);
        a.setSelection(er(s, "start") ? Z.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : H.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, tf = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = qa(r);
  }
  let o = s && s.nodeAfter;
  return !o || !H.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(H.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function qa(n) {
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
const Uy = (n, e) => {
  let t = n.selection, r = t instanceof H, i;
  if (r) {
    if (t.node.isTextblock || !_n(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Ss(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let s = n.tr.join(i);
    r && s.setSelection(H.create(s.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, Hy = (n, e) => {
  let t = n.selection, r;
  if (t instanceof H) {
    if (t.node.isTextblock || !_n(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ss(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, jy = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && ur(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, nf = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Wa(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Ky = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = Wa(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, o.createAndFill());
    l.setSelection(Z.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, rf = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof He || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = Wa(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(o, s.createAndFill());
    a.setSelection(Y.create(a.doc, o + 1)), e(a.scrollIntoView());
  }
  return !0;
}, sf = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (Pt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && ur(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
};
function of(n) {
  return (e, t) => {
    let { $from: r, $to: i } = e.selection;
    if (e.selection instanceof H && e.selection.node.isBlock)
      return !r.parentOffset || !Pt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.depth)
      return !1;
    let s = [], o, a, l = !1, c = !1;
    for (let h = r.depth; ; h--)
      if (r.node(h).isBlock) {
        l = r.end(h) == r.pos + (r.depth - h), c = r.start(h) == r.pos - (r.depth - h), a = Wa(r.node(h - 1).contentMatchAt(r.indexAfter(h - 1)));
        let m = n && n(i.parent, l, r);
        s.unshift(m || (l && a ? { type: a } : null)), o = h;
        break;
      } else {
        if (h == 1)
          return !1;
        s.unshift(null);
      }
    let u = e.tr;
    (e.selection instanceof Y || e.selection instanceof He) && u.deleteSelection();
    let d = u.mapping.map(r.pos), f = Pt(u.doc, d, s.length, s);
    if (f || (s[0] = a ? { type: a } : null, f = Pt(u.doc, d, s.length, s)), !f)
      return !1;
    if (u.split(d, s.length, s), !l && c && r.node(o).type != a) {
      let h = u.mapping.map(r.before(o)), p = u.doc.resolve(h);
      a && r.node(o - 1).canReplaceWith(p.index(), p.index() + 1, a) && u.setNodeMarkup(u.mapping.map(r.before(o)), a);
    }
    return t && t(u.scrollIntoView()), !0;
  };
}
const Jy = of(), Xy = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(H.create(n.doc, i))), !0);
};
function Yy(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || _n(n.doc, e.pos)) ? !1 : (t && t(n.tr.join(e.pos).scrollIntoView()), !0);
}
function af(n, e, t, r) {
  let i = e.nodeBefore, s = e.nodeAfter, o, a, l = i.type.spec.isolating || s.type.spec.isolating;
  if (!l && Yy(n, e, t))
    return !0;
  let c = !l && e.parent.canReplace(e.index(), e.index() + 1);
  if (c && (o = (a = i.contentMatchAt(i.childCount)).findWrapping(s.type)) && a.matchType(o[0] || s.type).validEnd) {
    if (t) {
      let h = e.pos + s.nodeSize, p = P.empty;
      for (let y = o.length - 1; y >= 0; y--)
        p = P.from(o[y].create(null, p));
      p = P.from(i.copy(p));
      let m = n.tr.step(new we(e.pos - 1, h, e.pos, h, new L(p, 1, 0), o.length, !0)), g = m.doc.resolve(h + 2 * o.length);
      g.nodeAfter && g.nodeAfter.type == i.type && _n(m.doc, g.pos) && m.join(g.pos), t(m.scrollIntoView());
    }
    return !0;
  }
  let u = s.type.spec.isolating || r > 0 && l ? null : Z.findFrom(e, 1), d = u && u.$from.blockRange(u.$to), f = d && ur(d);
  if (f != null && f >= e.depth)
    return t && t(n.tr.lift(d, f).scrollIntoView()), !0;
  if (c && er(s, "start", !0) && er(i, "end")) {
    let h = i, p = [];
    for (; p.push(h), !h.isTextblock; )
      h = h.lastChild;
    let m = s, g = 1;
    for (; !m.isTextblock; m = m.firstChild)
      g++;
    if (h.canReplace(h.childCount, h.childCount, m.content)) {
      if (t) {
        let y = P.empty;
        for (let x = p.length - 1; x >= 0; x--)
          y = P.from(p[x].copy(y));
        let S = n.tr.step(new we(e.pos - p.length, e.pos + s.nodeSize, e.pos + g, e.pos + s.nodeSize - g, new L(y, p.length, 0), 0, !0));
        t(S.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function lf(n) {
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
const Gy = lf(-1), Qy = lf(1);
function Zy(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), a = o && Bd(o, n, e);
    return a ? (r && r(t.tr.wrap(o, a).scrollIntoView()), !0) : !1;
  };
}
function pc(n, e = null) {
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
function Ua(...n) {
  return function(e, t, r) {
    for (let i = 0; i < n.length; i++)
      if (n[i](e, t, r))
        return !0;
    return !1;
  };
}
Ua(za, Yd, Qd);
Ua(za, ef, tf);
Ua(nf, rf, sf, Jy);
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function ev(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s);
    if (!o)
      return !1;
    let a = r ? t.tr : null;
    return tv(a, o, n, e) ? (r && r(a.scrollIntoView()), !0) : !1;
  };
}
function tv(n, e, t, r = null) {
  let i = !1, s = e, o = e.$from.doc;
  if (e.depth >= 2 && e.$from.node(e.depth - 1).type.compatibleContent(t) && e.startIndex == 0) {
    if (e.$from.index(e.depth - 1) == 0)
      return !1;
    let l = o.resolve(e.start - 2);
    s = new Ki(l, l, e.depth), e.endIndex < e.parent.childCount && (e = new Ki(e.$from, o.resolve(e.$to.end(e.depth)), e.depth)), i = !0;
  }
  let a = Bd(s, t, r, e);
  return a ? (n && nv(n, e, a, i, t), !0) : !1;
}
function nv(n, e, t, r, i) {
  let s = P.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = P.from(t[u].type.create(t[u].attrs, s));
  n.step(new we(e.start - (r ? 2 : 0), e.end, e.start, e.end, new L(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let a = t.length - o, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Pt(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function rv(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? iv(e, t, n, s) : sv(e, t, s) : !0 : !1;
  };
}
function iv(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  s < o && (i.step(new we(s - 1, o, s, o, new L(P.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Ki(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth));
  const a = ur(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.doc.resolve(i.mapping.map(s, -1) - 1);
  return _n(i.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && i.join(l.pos), e(i.scrollIntoView()), !0;
}
function sv(n, e, t) {
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
  return r.step(new we(d - (a ? 1 : 0), f + (l ? 1 : 0), d + 1, f - 1, new L((a ? P.empty : P.from(i.copy(P.empty))).append(l ? P.empty : P.from(i.copy(P.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function ov(n) {
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
      let c = l.lastChild && l.lastChild.type == a.type, u = P.from(c ? n.create() : null), d = new L(P.from(n.create(null, P.from(a.type.create(null, u)))), c ? 3 : 1, 0), f = s.start, h = s.end;
      t(e.tr.step(new we(f - (c ? 3 : 1), h, f, h, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Ee = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, tr = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Xo = null;
const At = function(n, e, t) {
  let r = Xo || (Xo = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, av = function() {
  Xo = null;
}, Cn = function(n, e, t, r) {
  return t && (mc(n, e, t, r, -1) || mc(n, e, t, r, 1));
}, lv = /^(img|br|input|textarea|hr)$/i;
function mc(n, e, t, r, i) {
  for (var s; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : rt(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || li(n) || lv.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Ee(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      let o = n.childNodes[e + (i < 0 ? -1 : 0)];
      if (o.nodeType == 1 && o.contentEditable == "false")
        if (!((s = o.pmViewDesc) === null || s === void 0) && s.ignoreForSelection)
          e += i;
        else
          return !1;
      else
        n = o, e = i < 0 ? rt(n) : 0;
    } else
      return !1;
  }
}
function rt(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function cv(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e - 1], e = rt(n);
    } else if (n.parentNode && !li(n))
      e = Ee(n), n = n.parentNode;
    else
      return null;
  }
}
function uv(n, e) {
  for (; ; ) {
    if (n.nodeType == 3 && e < n.nodeValue.length)
      return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false")
        return null;
      n = n.childNodes[e], e = 0;
    } else if (n.parentNode && !li(n))
      e = Ee(n) + 1, n = n.parentNode;
    else
      return null;
  }
}
function dv(n, e, t) {
  for (let r = e == 0, i = e == rt(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Ee(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == rt(n);
  }
}
function li(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Cs = function(n) {
  return n.focusNode && Cn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function cn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function fv(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function hv(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: Math.min(rt(r.offsetNode), r.offset) };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: Math.min(rt(r.startContainer), r.startOffset) };
  }
}
const bt = typeof navigator < "u" ? navigator : null, gc = typeof document < "u" ? document : null, nn = bt && bt.userAgent || "", Yo = /Edge\/(\d+)/.exec(nn), cf = /MSIE \d/.exec(nn), Go = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(nn), je = !!(cf || Go || Yo), Jt = cf ? document.documentMode : Go ? +Go[1] : Yo ? +Yo[1] : 0, st = !je && /gecko\/(\d+)/i.test(nn);
st && +(/Firefox\/(\d+)/.exec(nn) || [0, 0])[1];
const Qo = !je && /Chrome\/(\d+)/.exec(nn), Ae = !!Qo, uf = Qo ? +Qo[1] : 0, Ne = !je && !!bt && /Apple Computer/.test(bt.vendor), nr = Ne && (/Mobile\/\w+/.test(nn) || !!bt && bt.maxTouchPoints > 2), nt = nr || (bt ? /Mac/.test(bt.platform) : !1), df = bt ? /Win/.test(bt.platform) : !1, Ot = /Android \d/.test(nn), ci = !!gc && "webkitFontSmoothing" in gc.documentElement.style, pv = ci ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function mv(n) {
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
function Mt(n, e) {
  return typeof n == "number" ? n : n[e];
}
function gv(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function yc(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; ) {
    if (o.nodeType != 1) {
      o = tr(o);
      continue;
    }
    let a = o, l = a == s.body, c = l ? mv(s) : gv(a), u = 0, d = 0;
    if (e.top < c.top + Mt(r, "top") ? d = -(c.top - e.top + Mt(i, "top")) : e.bottom > c.bottom - Mt(r, "bottom") && (d = e.bottom - e.top > c.bottom - c.top ? e.top + Mt(i, "top") - c.top : e.bottom - c.bottom + Mt(i, "bottom")), e.left < c.left + Mt(r, "left") ? u = -(c.left - e.left + Mt(i, "left")) : e.right > c.right - Mt(r, "right") && (u = e.right - c.right + Mt(i, "right")), u || d)
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
    o = f == "absolute" ? o.offsetParent : tr(o);
  }
}
function yv(n) {
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
  return { refDOM: r, refTop: i, stack: ff(n.dom) };
}
function ff(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = tr(r))
    ;
  return e;
}
function vv({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  hf(t, r == 0 ? 0 : r - e);
}
function hf(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let Bn = null;
function bv(n) {
  if (n.setActive)
    return n.setActive();
  if (Bn)
    return n.focus(Bn);
  let e = ff(n);
  n.focus(Bn == null ? {
    get preventScroll() {
      return Bn = { preventScroll: !0 }, !0;
    }
  } : void 0), Bn || (Bn = !1, hf(e, 0));
}
function pf(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, a = e.top, l, c;
  for (let u = n.firstChild, d = 0; u; u = u.nextSibling, d++) {
    let f;
    if (u.nodeType == 1)
      f = u.getClientRects();
    else if (u.nodeType == 3)
      f = At(u).getClientRects();
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
  return !t && l && (t = l, i = c, r = 0), t && t.nodeType == 3 ? wv(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : pf(t, i);
}
function wv(n, e) {
  let t = n.nodeValue.length, r = document.createRange(), i;
  for (let s = 0; s < t; s++) {
    r.setEnd(n, s + 1), r.setStart(n, s);
    let o = zt(r, 1);
    if (o.top != o.bottom && Ha(e, o)) {
      i = { node: n, offset: s + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
      break;
    }
  }
  return r.detach(), i || { node: n, offset: 0 };
}
function Ha(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Sv(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function xv(n, e, t) {
  let { node: r, offset: i } = pf(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function kv(n, e, t, r) {
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
function mf(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let a = o.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (Ha(e, c))
            return mf(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function Cv(n, e) {
  let t = n.dom.ownerDocument, r, i = 0, s = hv(t, e.left, e.top);
  s && ({ node: r, offset: i } = s);
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), a;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let c = n.dom.getBoundingClientRect();
    if (!Ha(e, c) || (o = mf(n.dom, e, c), !o))
      return null;
  }
  if (Ne)
    for (let c = o; r && c; c = tr(c))
      c.draggable && (r = void 0);
  if (o = Sv(o, e), r) {
    if (st && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let u = r.childNodes[i], d;
      u.nodeName == "IMG" && (d = u.getBoundingClientRect()).right <= e.left && d.bottom > e.top && i++;
    }
    let c;
    ci && i && r.nodeType == 1 && (c = r.childNodes[i - 1]).nodeType == 1 && c.contentEditable == "false" && c.getBoundingClientRect().top >= e.top && i--, r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? a = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (a = kv(n, r, i, e));
  }
  a == null && (a = xv(n, o, e));
  let l = n.docView.nearestDesc(o, !0);
  return { pos: a, inside: l ? l.posAtStart - l.border : -1 };
}
function vc(n) {
  return n.top < n.bottom || n.left < n.right;
}
function zt(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (vc(r))
      return r;
  }
  return Array.prototype.find.call(t, vc) || n.getBoundingClientRect();
}
const Tv = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function gf(n, e, t) {
  let { node: r, offset: i, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), o = ci || st;
  if (r.nodeType == 3)
    if (o && (Tv.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = zt(At(r, i, i), t);
      if (st && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = zt(At(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = zt(At(r, i, i + 1), -1);
          if (u.top != l.top)
            return gr(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, gr(zt(At(r, l, c), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && i && (t < 0 || i == rt(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return fo(l.getBoundingClientRect(), !1);
    }
    if (s == null && i < rt(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return fo(l.getBoundingClientRect(), !0);
    }
    return fo(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && i && (t < 0 || i == rt(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? At(l, rt(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return gr(zt(c, 1), !1);
  }
  if (s == null && i < rt(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? At(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return gr(zt(c, -1), !0);
  }
  return gr(zt(r.nodeType == 3 ? At(r) : r, -t), t >= 0);
}
function gr(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function fo(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function yf(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function Ev(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return yf(n, e, () => {
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
    let o = gf(n, i.pos, 1);
    for (let a = s.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = At(a, 0, a.nodeValue.length).getClientRects();
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
const Mv = /[\u0590-\u08ac]/;
function Av(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, a = n.domSelection();
  return a ? !Mv.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? s : o : yf(n, e, () => {
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
let bc = null, wc = null, Sc = !1;
function Ov(n, e, t) {
  return bc == e && wc == t ? Sc : (bc = e, wc = t, Sc = t == "up" || t == "down" ? Ev(n, e, t) : Av(n, e, t));
}
const ot = 0, xc = 1, dn = 2, wt = 3;
class ui {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = ot, r.pmViewDesc = this;
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
      i = t > Ee(this.contentDOM);
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
      if (a > e || o instanceof bf) {
        i = e - s;
        break;
      }
      s = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof vf && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Ee(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Ee(s.dom) : this.contentDOM.childNodes.length };
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
            i = Ee(f.dom) + 1;
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
            s = Ee(d.dom);
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
    if ((st || Ne) && e == t) {
      let { node: h, offset: p } = a;
      if (h.nodeType == 3) {
        if (d = !!(p && h.nodeValue[p - 1] == `
`), d && p == h.nodeValue.length)
          for (let m = h, g; m; m = m.parentNode) {
            if (g = m.nextSibling) {
              g.nodeName == "BR" && (a = l = { node: g.parentNode, offset: Ee(g) + 1 });
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
    if (st && u.focusNode && u.focusNode != l.node && u.focusNode.nodeType == 1) {
      let h = u.focusNode.childNodes[u.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || d && Ne) && Cn(a.node, a.offset, u.anchorNode, u.anchorOffset) && Cn(l.node, l.offset, u.focusNode, u.focusOffset))
      return;
    let f = !1;
    if ((c.extend || e == t) && !(d && st)) {
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
          this.dirty = e == r || t == o ? dn : xc, e == a && t == l && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = wt : s.markDirty(e - a, t - a);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? dn : wt;
      }
      r = o;
    }
    this.dirty = dn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? dn : xc;
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
class vf extends ui {
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
    return this.dirty == ot && e.type.eq(this.widget.type);
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
class Dv extends ui {
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
class Tn extends ui {
  constructor(e, t, r, i, s) {
    super(e, [], r, i), this.mark = t, this.spec = s;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Pn.renderSpec(document, t.type.spec.toDOM(t, r), null, t.attrs)), new Tn(e, t, o.dom, o.contentDOM || o.dom, o);
  }
  parseRule() {
    return this.dirty & wt || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != wt && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != ot) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = ot;
    }
  }
  slice(e, t, r) {
    let i = Tn.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = ea(s, t, o, r)), e > 0 && (s = ea(s, 0, e, r));
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
class Xt extends ui {
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
    } else u || ({ dom: u, contentDOM: d } = Pn.renderSpec(document, t.type.spec.toDOM(t), null, t.attrs));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = xf(u, r, t), c ? l = new Pv(e, t, r, i, u, d || null, f, c, s, o + 1) : t.isText ? new Ts(e, t, r, i, u, f, s) : new Xt(e, t, r, i, u, d || null, f, s, o + 1);
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
    return this.dirty == ot && e.eq(this.node) && Yi(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, a = s && s.pos < 0, l = new Nv(this, o && o.node, e);
    $v(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e, u) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? ae.none : this.node.child(u).marks, r, e, u), l.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      l.syncToMarks(c.marks, r, e, f);
      let h;
      l.findNodeMatch(c, u, d, f) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (h = l.findIndexWithChild(s.node)) > -1 && l.updateNodeAt(c, u, d, h, e) || l.updateNextNode(c, u, d, e, f, i) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e, 0), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == dn) && (o && this.protectLocalComposition(e, o), wf(this.contentDOM, this.children, e), nr && Lv(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof Y) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.input.compositionNode;
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = s.nodeValue, a = Bv(this.node.content, o, r - t, i - t);
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
    let o = new Dv(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = ea(this.children, r, r + i.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, i) {
    return this.dirty == wt || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = ot;
  }
  updateOuterDeco(e) {
    if (Yi(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = Sf(this.dom, this.nodeDOM, Zo(this.outerDeco, this.node, t), Zo(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function kc(n, e, t, r, i) {
  xf(r, e, n);
  let s = new Xt(void 0, n, e, t, r, r, r, i, 0);
  return s.contentDOM && s.updateChildren(i, 0), s;
}
class Ts extends Xt {
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
    return this.dirty == wt || this.dirty != ot && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != ot || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = ot, !0);
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
    return new Ts(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = wt);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class bf extends ui {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == ot && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Pv extends Xt {
  constructor(e, t, r, i, s, o, a, l, c, u) {
    super(e, t, r, i, s, o, a, c, u), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, i) {
    if (this.dirty == wt)
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
function wf(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], a = o.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = Cc(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (o instanceof Tn) {
      let l = r ? r.previousSibling : n.lastChild;
      wf(o.contentDOM, o.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = Cc(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Er = function(n) {
  n && (this.nodeName = n);
};
Er.prototype = /* @__PURE__ */ Object.create(null);
const fn = [new Er()];
function Zo(n, e, t) {
  if (n.length == 0)
    return fn;
  let r = t ? fn[0] : new Er(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (o) {
      o.nodeName && i.push(r = new Er(o.nodeName));
      for (let a in o) {
        let l = o[a];
        l != null && (t && i.length == 1 && i.push(r = new Er(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function Sf(n, e, t, r) {
  if (t == fn && r == fn)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], a = t[s];
    if (s) {
      let l;
      a && a.nodeName == o.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = fn[0]), i = l;
    }
    _v(i, a || fn[0], o);
  }
  return i;
}
function _v(n, e, t) {
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
function xf(n, e, t) {
  return Sf(n, n, fn, Zo(e, t, n.nodeType != 1));
}
function Yi(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function Cc(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Nv {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Iv(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = ot, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
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
        let u = Tn.create(this.top, e[o], t, r);
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
    return o.dirty == wt && o.dom == o.contentDOM && (o.dirty = dn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
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
      if (l instanceof Xt) {
        let c = this.preMatch.matched.get(l);
        if (c != null && c != s)
          return !1;
        let u = l.dom, d, f = this.isLocked(u) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != wt && Yi(t, l.outerDeco));
        if (!f && l.update(e, t, r, i))
          return this.destroyBetween(this.index, a), l.dom != u && (this.changed = !0), this.index++, !0;
        if (!f && (d = this.recreateWrapper(l, e, t, r, i, o)))
          return this.destroyBetween(this.index, a), this.top.children[this.index] = d, d.contentDOM && (d.dirty = dn, d.updateChildren(i, o + 1), d.dirty = ot), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, i, s, o) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content) || !Yi(r, e.outerDeco) || !i.eq(e.innerDeco))
      return null;
    let a = Xt.create(this.top, t, r, i, s, o);
    if (a.contentDOM) {
      a.children = e.children, e.children = [];
      for (let l of a.children)
        l.parent = a;
    }
    return e.destroy(), a;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, i, s) {
    let o = Xt.create(this.top, e, t, r, i, s);
    o.contentDOM && o.updateChildren(i, s + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new vf(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Tn; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Ts) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Ne || Ae) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new bf(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Iv(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e: for (; i > 0; ) {
    let a;
    for (; ; )
      if (r) {
        let c = t.children[r - 1];
        if (c instanceof Tn)
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
function Rv(n, e) {
  return n.type.side - e.type.side;
}
function $v(n, e, t, r) {
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
        d.sort(Rv);
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
function Lv(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Bv(n, e, t, r) {
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
function ea(n, e, t, r, i) {
  let s = [];
  for (let o = 0, a = 0; o < n.length; o++) {
    let l = n[o], c = a, u = a += l.size;
    c >= t || u <= e ? s.push(l) : (c < e && s.push(l.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(l.slice(t - c, l.size, r)));
  }
  return s;
}
function ja(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let a = r.resolve(o), l, c;
  if (Cs(t)) {
    for (l = o; i && !i.node; )
      i = i.parent;
    let d = i.node;
    if (i && d.isAtom && H.isSelectable(d) && i.parent && !(d.isInline && dv(t.focusNode, t.focusOffset, i.dom))) {
      let f = i.posBefore;
      c = new H(o == f ? a : r.resolve(f));
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
    c = Ka(n, u, a, d);
  }
  return c;
}
function kf(n) {
  return n.editable ? n.hasFocus() : Tf(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function _t(n, e = !1) {
  let t = n.state.selection;
  if (Cf(n, t), !!kf(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Ae) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Cn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      zv(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      Tc && !(t instanceof Y) && (t.$from.parent.inlineContent || (s = Ec(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = Ec(n, t.to))), n.docView.setSelection(r, i, n, e), Tc && (s && Mc(s), o && Mc(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Fv(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const Tc = Ne || Ae && uf < 63;
function Ec(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Ne && i && i.contentEditable == "false")
    return ho(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return ho(i);
    if (s)
      return ho(s);
  }
}
function ho(n) {
  return n.contentEditable = "true", Ne && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function Mc(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Fv(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!kf(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function zv(n) {
  let e = n.domSelection();
  if (!e)
    return;
  let t = n.cursorWrapper.dom, r = t.nodeName == "IMG";
  r ? e.collapse(t.parentNode, Ee(t) + 1) : e.collapse(t, 0), !r && !n.state.selection.visible && je && Jt <= 11 && (t.disabled = !0, t.disabled = !1);
}
function Cf(n, e) {
  if (e instanceof H) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (Ac(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    Ac(n);
}
function Ac(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Ka(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || Y.between(e, t, r);
}
function Oc(n) {
  return n.editable && !n.hasFocus() ? !1 : Tf(n);
}
function Tf(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Vv(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Cn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function ta(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && Z.findFrom(s, e);
}
function qt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Dc(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y)
    if (t.indexOf("s") > -1) {
      let { $head: i } = r, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let o = n.state.doc.resolve(i.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return qt(n, new Y(r.$anchor, o));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let i = ta(n.state, e);
        return i && i instanceof H ? qt(n, i) : !1;
      } else if (!(nt && t.indexOf("m") > -1)) {
        let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
        if (!s || s.isText)
          return !1;
        let a = e < 0 ? i.pos - s.nodeSize : i.pos;
        return s.isAtom || (o = n.docView.descAt(a)) && !o.contentDOM ? H.isSelectable(s) ? qt(n, new H(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : ci ? qt(n, new Y(n.state.doc.resolve(e < 0 ? a : a + s.nodeSize))) : !1 : !1;
      }
    } else return !1;
  else {
    if (r instanceof H && r.node.isInline)
      return qt(n, new Y(e > 0 ? r.$to : r.$from));
    {
      let i = ta(n.state, e);
      return i ? qt(n, i) : !1;
    }
  }
}
function Gi(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Mr(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Fn(n, e) {
  return e < 0 ? qv(n) : Wv(n);
}
function qv(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (st && t.nodeType == 1 && r < Gi(t) && Mr(t.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (Mr(a, -1))
          i = t, s = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (Ef(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && Mr(a, -1); )
          i = t.parentNode, s = Ee(a), a = a.previousSibling;
        if (a)
          t = a, r = Gi(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? na(n, t, r) : i && na(n, i, s);
}
function Wv(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = Gi(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (Mr(a, 1))
        s = t, o = ++r;
      else
        break;
    } else {
      if (Ef(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && Mr(a, 1); )
          s = a.parentNode, o = Ee(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = Gi(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && na(n, s, o);
}
function Ef(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Uv(n, e) {
  for (; n && e == n.childNodes.length && !li(n); )
    e = Ee(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function Hv(n, e) {
  for (; n && !e && !li(n); )
    e = Ee(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function na(n, e, t) {
  if (e.nodeType != 3) {
    let s, o;
    (o = Uv(e, t)) ? (e = o, t = 0) : (s = Hv(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (!r)
    return;
  if (Cs(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && _t(n);
  }, 50);
}
function Pc(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(Ae || df) && t.parent.inlineContent) {
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
function _c(n, e, t) {
  let r = n.state.selection;
  if (r instanceof Y && !r.empty || t.indexOf("s") > -1 || nt && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = ta(n.state, e);
    if (o && o instanceof H)
      return qt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, a = r instanceof He ? Z.near(o, e) : Z.findFrom(o, e);
    return a ? qt(n, a) : !1;
  }
  return !1;
}
function Nc(n, e) {
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
function Ic(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function jv(n) {
  if (!Ne || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Ic(n, r, "true"), setTimeout(() => Ic(n, r, "false"), 20);
  }
  return !1;
}
function Kv(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function Jv(n, e) {
  let t = e.keyCode, r = Kv(e);
  if (t == 8 || nt && t == 72 && r == "c")
    return Nc(n, -1) || Fn(n, -1);
  if (t == 46 && !e.shiftKey || nt && t == 68 && r == "c")
    return Nc(n, 1) || Fn(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || nt && t == 66 && r == "c") {
    let i = t == 37 ? Pc(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Dc(n, i, r) || Fn(n, i);
  } else if (t == 39 || nt && t == 70 && r == "c") {
    let i = t == 39 ? Pc(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Dc(n, i, r) || Fn(n, i);
  } else {
    if (t == 38 || nt && t == 80 && r == "c")
      return _c(n, -1, r) || Fn(n, -1);
    if (t == 40 || nt && t == 78 && r == "c")
      return jv(n) || _c(n, 1, r) || Fn(n, 1);
    if (r == (nt ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function Ja(n, e) {
  n.someProp("transformCopied", (h) => {
    e = h(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let h = r.firstChild;
    t.push(h.type.name, h.attrs != h.type.defaultAttrs ? h.attrs : null), r = h.content;
  }
  let o = n.someProp("clipboardSerializer") || Pn.fromSchema(n.state.schema), a = _f(), l = a.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = Pf[c.nodeName.toLowerCase()]); ) {
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
function Mf(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, a;
  if (!t && !e)
    return null;
  let l = !!e && (r || s || !t);
  if (l) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, s || r, n);
    }), s)
      return a = new L(P.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0), n.someProp("transformPasted", (f) => {
        a = f(a, n, !0);
      }), a;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      a = d;
    else {
      let f = i.marks(), { schema: h } = n.state, p = Pn.fromSchema(h);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(h.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), o = Qv(t), ci && Zv(o);
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
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || Cr.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !Xv.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = eb(Rc(a, +u[1], +u[2]), u[4]);
  else if (a = L.maxOpen(Yv(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, f = 0;
    for (let h = a.content.firstChild; d < a.openStart && !h.type.spec.isolating; d++, h = h.firstChild)
      ;
    for (let h = a.content.lastChild; f < a.openEnd && !h.type.spec.isolating; f++, h = h.lastChild)
      ;
    a = Rc(a, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n, l);
  }), a;
}
const Xv = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Yv(n, e) {
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
      if (c = o.length && s.length && Of(l, s, a, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = Df(o[o.length - 1], s.length));
        let u = Af(a, l);
        o.push(u), i = i.matchType(u.type), s = l;
      }
    }), o)
      return P.from(o);
  }
  return n;
}
function Af(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, P.from(n));
  return n;
}
function Of(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = Of(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(P.from(Af(t, n, i + 1))));
  }
}
function Df(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, Df(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(P.empty, !0);
  return n.copy(t.append(r));
}
function ra(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, a = o.content;
  return n.childCount > 1 && (s = 0), i < r - 1 && (a = ra(a, e, t, r, i + 1, s)), i >= t && (a = e < 0 ? o.contentMatchAt(0).fillBefore(a, s <= i).append(a) : a.append(o.contentMatchAt(o.childCount).fillBefore(P.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(a));
}
function Rc(n, e, t) {
  return e < n.openStart && (n = new L(ra(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new L(ra(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Pf = {
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
let $c = null;
function _f() {
  return $c || ($c = document.implementation.createHTMLDocument("title"));
}
let po = null;
function Gv(n) {
  let e = window.trustedTypes;
  return e ? (po || (po = e.defaultPolicy || e.createPolicy("ProseMirrorClipboard", { createHTML: (t) => t })), po.createHTML(n)) : n;
}
function Qv(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = _f().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && Pf[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = Gv(n), i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function Zv(n) {
  let e = n.querySelectorAll(Ae ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function eb(n, e) {
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
  return new L(i, s, o);
}
const Be = {}, Fe = {}, tb = { touchstart: !0, touchmove: !0 };
class nb {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "", button: 0 }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastChromeDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.badSafariComposition = !1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function rb(n) {
  for (let e in Be) {
    let t = Be[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      sb(n, r) && !Xa(n, r) && (n.editable || !(r.type in Fe)) && t(n, r);
    }, tb[e] ? { passive: !0 } : void 0);
  }
  Ne && n.dom.addEventListener("input", () => null), ia(n);
}
function Kt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function ib(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function ia(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Xa(n, r));
  });
}
function Xa(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function sb(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function ob(n, e) {
  !Xa(n, e) && Be[e.type] && (n.editable || !(e.type in Fe)) && Be[e.type](n, e);
}
Fe.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !If(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(Ot && Ae && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), nr && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, cn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else n.someProp("handleKeyDown", (r) => r(n, t)) || Jv(n, t) ? t.preventDefault() : Kt(n, "key");
};
Fe.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Fe.keypress = (n, e) => {
  let t = e;
  if (If(n, t) || !t.charCode || t.ctrlKey && !t.altKey || nt && t.metaKey)
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
function Es(n) {
  return { left: n.clientX, top: n.clientY };
}
function ab(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function Ya(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (a) => o > s.depth ? a(n, t, s.nodeAfter, s.before(o), i, !0) : a(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function Jn(n, e, t) {
  if (n.focused || n.focus(), n.state.selection.eq(e))
    return;
  let r = n.state.tr.setSelection(e);
  r.setMeta("pointer", !0), n.dispatch(r);
}
function lb(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && H.isSelectable(r) ? (Jn(n, new H(t)), !0) : !1;
}
function cb(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof H && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let a = o > s.depth ? s.nodeAfter : s.node(o);
    if (H.isSelectable(a)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (Jn(n, H.create(n.state.doc, i)), !0) : !1;
}
function ub(n, e, t, r, i) {
  return Ya(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? cb(n, t) : lb(n, t));
}
function db(n, e, t, r) {
  return Ya(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function fb(n, e, t, r) {
  return Ya(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || hb(n, t, r);
}
function hb(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Jn(n, Y.create(r, 0, r.content.size)), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), a = i.before(s);
    if (o.inlineContent)
      Jn(n, Y.create(r, a + 1, a + 1 + o.content.size));
    else if (H.isSelectable(o))
      Jn(n, H.create(r, a));
    else
      continue;
    return !0;
  }
}
function Ga(n) {
  return Qi(n);
}
const Nf = nt ? "metaKey" : "ctrlKey";
Be.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = Ga(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && ab(t, n.input.lastClick) && !t[Nf] && n.input.lastClick.button == t.button && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s, button: t.button };
  let o = n.posAtCoords(Es(t));
  o && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new pb(n, o, t, !!r)) : (s == "doubleClick" ? db : fb)(n, o.pos, o.inside, t) ? t.preventDefault() : Kt(n, "pointer"));
};
class pb {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Nf], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof H && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && st && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Kt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => _t(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Es(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Kt(this.view, "pointer") : ub(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Ne && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    Ae && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Jn(this.view, Z.near(this.view.state.doc.resolve(t.pos))), e.preventDefault()) : Kt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Kt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Be.touchstart = (n) => {
  n.input.lastTouch = Date.now(), Ga(n), Kt(n, "pointer");
};
Be.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Kt(n, "pointer");
};
Be.contextmenu = (n) => Ga(n);
function If(n, e) {
  return n.composing ? !0 : Ne && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const mb = Ot ? 5e3 : -1;
Fe.compositionstart = Fe.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$to;
    if (e.selection instanceof Y && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1) || Ae && df && gb(n)))
      n.markCursor = n.state.storedMarks || t.marks(), Qi(n, !0), n.markCursor = null;
    else if (Qi(n, !e.selection.empty), st && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  Rf(n, mb);
};
function gb(n) {
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (!e || e.nodeType != 1 || t >= e.childNodes.length)
    return !1;
  let r = e.childNodes[t];
  return r.nodeType == 1 && r.contentEditable == "false";
}
Fe.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionNode = null, n.input.badSafariComposition ? n.domObserver.forceFlush() : n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, Rf(n, 20));
};
function Rf(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Qi(n), e));
}
function $f(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = vb()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function yb(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode)
    return null;
  let t = cv(e.focusNode, e.focusOffset), r = uv(e.focusNode, e.focusOffset);
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
function vb() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Qi(n, e = !1) {
  if (!(Ot && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), $f(n), e || n.docView && n.docView.dirty) {
      let t = ja(n), r = n.state.selection;
      return t && !t.eq(r) ? n.dispatch(n.state.tr.setSelection(t)) : (n.markCursor || e) && !r.$from.node(r.$from.sharedDepth(r.to)).inlineContent ? n.dispatch(n.state.tr.deleteSelection()) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function bb(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Vr = je && Jt < 15 || nr && pv < 604;
Be.copy = Fe.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = Vr ? null : t.clipboardData, o = r.content(), { dom: a, text: l } = Ja(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", a.innerHTML), s.setData("text/plain", l)) : bb(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function wb(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Sb(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let i = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? qr(n, r.value, null, i, e) : qr(n, r.textContent, r.innerHTML, i, e);
  }, 50);
}
function qr(n, e, t, r, i) {
  let s = Mf(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, i, s || L.empty)))
    return !0;
  if (!s)
    return !1;
  let o = wb(s), a = o ? n.state.tr.replaceSelectionWith(o, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(a.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Lf(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Fe.paste = (n, e) => {
  let t = e;
  if (n.composing && !Ot)
    return;
  let r = Vr ? null : t.clipboardData, i = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && qr(n, Lf(r), r.getData("text/html"), i, t) ? t.preventDefault() : Sb(n, t);
};
class Bf {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const xb = nt ? "altKey" : "ctrlKey";
function Ff(n, e) {
  let t = n.someProp("dragCopies", (r) => !r(e));
  return t ?? !e[xb];
}
Be.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Es(t)), o;
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof H ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      o = H.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (o = H.create(n.state.doc, d.posBefore));
    }
  }
  let a = (o || n.state.selection).content(), { dom: l, text: c, slice: u } = Ja(n, a);
  (!t.dataTransfer.files.length || !Ae || uf > 120) && t.dataTransfer.clearData(), t.dataTransfer.setData(Vr ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Vr || t.dataTransfer.setData("text/plain", c), n.dragging = new Bf(u, Ff(n, t), o);
};
Be.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Fe.dragover = Fe.dragenter = (n, e) => e.preventDefault();
Fe.drop = (n, e) => {
  try {
    kb(n, e, n.dragging);
  } finally {
    n.dragging = null;
  }
};
function kb(n, e, t) {
  if (!e.dataTransfer)
    return;
  let r = n.posAtCoords(Es(e));
  if (!r)
    return;
  let i = n.state.doc.resolve(r.pos), s = t && t.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n, !1);
  }) : s = Mf(n, Lf(e.dataTransfer), Vr ? null : e.dataTransfer.getData("text/html"), !1, i);
  let o = !!(t && Ff(n, e));
  if (n.someProp("handleDrop", (h) => h(n, e, s || L.empty, o))) {
    e.preventDefault();
    return;
  }
  if (!s)
    return;
  e.preventDefault();
  let a = s ? Py(n.state.doc, i.pos, s) : i.pos;
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
  if (u && H.isSelectable(s.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(s.content.firstChild))
    l.setSelection(new H(f));
  else {
    let h = l.mapping.map(a);
    l.mapping.maps[l.mapping.maps.length - 1].forEach((p, m, g, y) => h = y), l.setSelection(Ka(n, f, l.doc.resolve(h)));
  }
  n.focus(), n.dispatch(l.setMeta("uiEvent", "drop"));
}
Be.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && _t(n);
  }, 20));
};
Be.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
Be.beforeinput = (n, e) => {
  if (Ae && Ot && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, cn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Fe)
  Be[n] = Fe[n];
function Wr(n, e) {
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
class Zi {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || yn, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new We(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Zi && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Wr(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Yt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || yn;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new We(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Yt && Wr(this.attrs, e.attrs) && Wr(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Yt;
  }
  destroy() {
  }
}
class Qa {
  constructor(e, t) {
    this.attrs = e, this.spec = t || yn;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new We(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Qa && Wr(this.attrs, e.attrs) && Wr(this.spec, e.spec);
  }
  destroy() {
  }
}
class We {
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
    return new We(e, t, this.type);
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
    return new We(e, e, new Zi(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, i) {
    return new We(e, t, new Yt(r, i));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, i) {
    return new We(e, t, new Qa(r, i));
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
    return this.type instanceof Zi;
  }
}
const Un = [], yn = {};
class le {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : Un, this.children = t.length ? t : Un;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? es(t, e, 0, yn) : Pe;
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
    return this == Pe || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || yn);
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
    return this.children.length ? Cb(this.children, o || [], e, t, r, i, s) : o ? new le(o.sort(vn), Un) : Pe;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Pe ? le.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (u = Vf(t, a, c)) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < l; )
          s += 3;
        i[s] == l ? i[s + 2] = i[s + 2].addInner(a, u, c + 1) : i.splice(s, 0, l, l + a.nodeSize, es(u, a, c + 1, yn)), s += 3;
      }
    });
    let o = zf(s ? qf(t) : t, -r);
    for (let a = 0; a < o.length; a++)
      o[a].type.valid(e, o[a]) || o.splice(a--, 1);
    return new le(o.length ? this.local.concat(o).sort(vn) : this.local, i || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Pe ? this : this.removeInner(e, 0);
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
      c != Pe ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let a = 0; a < i.length; a++)
            i[a].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new le(i, r) : Pe;
  }
  forChild(e, t) {
    if (this == Pe)
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
      if (l.from < o && l.to > s && l.type instanceof Yt) {
        let c = Math.max(s, l.from) - s, u = Math.min(o, l.to) - s;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new le(i.sort(vn), Un);
      return r ? new Ut([a, r]) : a;
    }
    return r || Pe;
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
    return Za(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Pe)
      return Un;
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
le.empty = new le([], []);
le.removeOverlap = Za;
const Pe = le.empty;
class Ut {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, yn));
    return Ut.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return le.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != Pe && (s instanceof Ut ? r = r.concat(s.members) : r.push(s));
    }
    return Ut.from(r);
  }
  eq(e) {
    if (!(e instanceof Ut) || e.members.length != this.members.length)
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
    return t ? Za(r ? t : t.sort(vn)) : Un;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Pe;
      case 1:
        return e[0];
      default:
        return new Ut(e.every((t) => t instanceof le) ? e : e.reduce((t, r) => t.concat(r instanceof le ? r : r.members), []));
    }
  }
  forEachSet(e) {
    for (let t = 0; t < this.members.length; t++)
      this.members[t].forEachSet(e);
  }
}
function Cb(n, e, t, r, i, s, o) {
  let a = n.slice();
  for (let c = 0, u = s; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, h, p, m) => {
      let g = m - p - (h - f);
      for (let y = 0; y < a.length; y += 3) {
        let S = a[y + 1];
        if (S < 0 || f > S + u - d)
          continue;
        let x = a[y] + u - d;
        h >= x ? a[y + 1] = f <= x ? -2 : -1 : f >= u && g && (a[y] += g, a[y + 1] += g);
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
        y != Pe ? (a[c] = d, a[c + 1] = h, a[c + 2] = y) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = Tb(a, n, e, t, i, s, o), u = es(c, r, 0, o);
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
  return new le(e.sort(vn), a);
}
function zf(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new We(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Tb(n, e, t, r, i, s, o) {
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
function Vf(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function qf(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function es(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((a, l) => {
    let c = Vf(n, a, l + t);
    if (c) {
      s = !0;
      let u = es(c, a, t + l + 1, r);
      u != Pe && i.push(l, l + a.nodeSize, u);
    }
  });
  let o = zf(s ? qf(n) : n, -t).sort(vn);
  for (let a = 0; a < o.length; a++)
    o[a].type.valid(e, o[a]) || (r.onRemove && r.onRemove(o[a].spec), o.splice(a--, 1));
  return o.length || i.length ? new le(o, i) : Pe;
}
function vn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Za(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), Lc(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), Lc(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Lc(n, e, t) {
  for (; e < n.length && vn(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function mo(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Pe && e.push(r);
  }), n.cursorWrapper && e.push(le.create(n.state.doc, [n.cursorWrapper.deco])), Ut.from(e);
}
const Eb = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Mb = je && Jt <= 11;
class Ab {
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
class Ob {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Ab(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.lastChangedTextNode = null, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      je && Jt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : Ne && e.composing && r.some((i) => i.type == "childList" && i.target.nodeName == "TR") ? (e.input.badSafariComposition = !0, this.flushSoon()) : this.flush();
    }), Mb && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, Eb)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (Oc(this.view)) {
      if (this.suppressingSelectionUpdates)
        return _t(this.view);
      if (je && Jt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Cn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = tr(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = tr(s))
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
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && Oc(e) && !this.ignoreSelectionChange(r), s = -1, o = -1, a = !1, l = [];
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
    } else if (st && l.length) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let [d, f] = u;
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      } else {
        let { focusNode: d } = this.currentSelection;
        for (let f of u) {
          let h = f.parentNode;
          h && h.nodeName == "LI" && (!d || _b(e, d) != h) && f.remove();
        }
      }
    }
    let c = null;
    s < 0 && i && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Cs(r) && (c = ja(e)) && c.eq(Z.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, _t(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || i) && (s > -1 && (e.docView.markDirty(s, o), Db(e)), e.input.badSafariComposition && (e.input.badSafariComposition = !1, Nb(e, l)), this.handleDOMChange(s, o, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || _t(e), this.currentSelection.set(r));
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
      if (je && Jt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (s = f);
        }
      let o = i && i.parentNode == e.target ? Ee(i) + 1 : 0, a = r.localPosFromDOM(e.target, o, -1), l = s && s.parentNode == e.target ? Ee(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
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
let Bc = /* @__PURE__ */ new WeakMap(), Fc = !1;
function Db(n) {
  if (!Bc.has(n) && (Bc.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = st, Fc)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Fc = !0;
  }
}
function zc(n, e) {
  let t = e.startContainer, r = e.startOffset, i = e.endContainer, s = e.endOffset, o = n.domAtPos(n.state.selection.anchor);
  return Cn(o.node, o.offset, i, s) && ([t, r, i, s] = [i, s, t, r]), { anchorNode: t, anchorOffset: r, focusNode: i, focusOffset: s };
}
function Pb(n, e) {
  if (e.getComposedRanges) {
    let i = e.getComposedRanges(n.root)[0];
    if (i)
      return zc(n, i);
  }
  let t;
  function r(i) {
    i.preventDefault(), i.stopImmediatePropagation(), t = i.getTargetRanges()[0];
  }
  return n.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", r, !0), t ? zc(n, t) : null;
}
function _b(n, e) {
  for (let t = e.parentNode; t && t != n.dom; t = t.parentNode) {
    let r = n.docView.nearestDesc(t, !0);
    if (r && r.node.isBlock)
      return t;
  }
  return null;
}
function Nb(n, e) {
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
function Ib(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], Cs(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), Ae && n.input.lastKeyCode === 8)
    for (let g = s; g > i; g--) {
      let y = r.childNodes[g - 1], S = y.pmViewDesc;
      if (y.nodeName == "BR" && !S) {
        s = g;
        break;
      }
      if (!S || S.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || Cr.fromSchema(n.state.schema), h = d.resolve(o), p = null, m = f.parse(r, {
    topNode: h.parent,
    topMatch: h.parent.contentMatchAt(h.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: h.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: Rb,
    context: h
  });
  if (c && c[0].pos != null) {
    let g = c[0].pos, y = c[1] && c[1].pos;
    y == null && (y = g), p = { anchor: g + o, head: y + o };
  }
  return { doc: m, sel: p, from: o, to: a };
}
function Rb(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Ne && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Ne && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const $b = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|img|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Lb(n, e, t, r, i) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let w = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, E = ja(n, w);
    if (E && !n.state.selection.eq(E)) {
      if (Ae && Ot && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (M) => M(n, cn(13, "Enter"))))
        return;
      let T = n.state.tr.setSelection(E);
      w == "pointer" ? T.setMeta("pointer", !0) : w == "key" && T.scrollIntoView(), s && T.setMeta("composition", s), n.dispatch(T);
    }
    return;
  }
  let o = n.state.doc.resolve(e), a = o.sharedDepth(t);
  e = o.before(a + 1), t = n.state.doc.resolve(t).after(a + 1);
  let l = n.state.selection, c = Ib(n, e, t), u = n.state.doc, d = u.slice(c.from, c.to), f, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (f = n.state.selection.to, h = "end") : (f = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let p = zb(d.content, c.doc.content, c.from, f, h);
  if (p && n.input.domChangeCount++, (nr && n.input.lastIOSEnter > Date.now() - 225 || Ot) && i.some((w) => w.nodeType == 1 && !$b.test(w.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (w) => w(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && l instanceof Y && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(c.sel && c.sel.anchor != c.sel.head))
      p = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (c.sel) {
        let w = Vc(n, n.state.doc, c.sel);
        if (w && !w.eq(n.state.selection)) {
          let E = n.state.tr.setSelection(w);
          s && E.setMeta("composition", s), n.dispatch(E);
        }
      }
      return;
    }
  n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof Y && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= c.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= c.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), je && Jt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > c.from && c.doc.textBetween(p.start - c.from - 1, p.start - c.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = c.doc.resolveNoCache(p.start - c.from), g = c.doc.resolveNoCache(p.endB - c.from), y = u.resolve(p.start), S = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA;
  if ((nr && n.input.lastIOSEnter > Date.now() - 225 && (!S || i.some((w) => w.nodeName == "DIV" || w.nodeName == "P")) || !S && m.pos < c.doc.content.size && (!m.sameParent(g) || !m.parent.inlineContent) && m.pos < g.pos && !/\S/.test(c.doc.textBetween(m.pos, g.pos, "", ""))) && n.someProp("handleKeyDown", (w) => w(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && Fb(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (w) => w(n, cn(8, "Backspace")))) {
    Ot && Ae && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Ae && p.endB == p.start && (n.input.lastChromeDelete = Date.now()), Ot && !S && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && c.sel && c.sel.anchor == c.sel.head && c.sel.head == p.endA && (p.endB -= 2, g = c.doc.resolveNoCache(p.endB - c.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(w) {
      return w(n, cn(13, "Enter"));
    });
  }, 20));
  let x = p.start, b = p.endA, k = (w) => {
    let E = w || n.state.tr.replace(x, b, c.doc.slice(p.start - c.from, p.endB - c.from));
    if (c.sel) {
      let T = Vc(n, E.doc, c.sel);
      T && !(Ae && n.composing && T.empty && (p.start != p.endB || n.input.lastChromeDelete < Date.now() - 100) && (T.head == x || T.head == E.mapping.map(b) - 1) || je && T.empty && T.head == x) && E.setSelection(T);
    }
    return s && E.setMeta("composition", s), E.scrollIntoView();
  }, C;
  if (S)
    if (m.pos == g.pos) {
      je && Jt <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => _t(n), 20));
      let w = k(n.state.tr.delete(x, b)), E = u.resolve(p.start).marksAcross(u.resolve(p.endA));
      E && w.ensureMarks(E), n.dispatch(w);
    } else if (
      // Adding or removing a mark
      p.endA == p.endB && (C = Bb(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    ) {
      let w = k(n.state.tr);
      C.type == "add" ? w.addMark(x, b, C.mark) : w.removeMark(x, b, C.mark), n.dispatch(w);
    } else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let w = m.parent.textBetween(m.parentOffset, g.parentOffset), E = () => k(n.state.tr.insertText(w, x, b));
      n.someProp("handleTextInput", (T) => T(n, x, b, w, E)) || n.dispatch(E());
    } else
      n.dispatch(k());
  else
    n.dispatch(k());
}
function Vc(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Ka(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Bb(n, e) {
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
function Fb(n, e, t, r, i) {
  if (
    // The content must have shrunk
    t - e <= i.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    go(r, !0, !1) < i.pos
  )
    return !1;
  let s = n.resolve(e);
  if (!r.parent.isTextblock) {
    let a = s.nodeAfter;
    return a != null && t == e + a.nodeSize;
  }
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(go(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || go(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function go(n, e, t) {
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
function zb(n, e, t, r, i) {
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
    s -= l, s && s < e.size && qc(e.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), a = s + (a - o), o = s;
  } else if (a < s) {
    let l = r <= s && r >= a ? s - r : 0;
    s -= l, s && s < n.size && qc(n.textBetween(s - 1, s + 1)) && (s += l ? 1 : -1), o = s + (o - a), a = s;
  }
  return { start: s, endA: o, endB: a };
}
function qc(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Wf {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new nb(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Kc), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Hc(this), Uc(this), this.nodeViews = jc(this), this.docView = kc(this.state.doc, Wc(this), mo(this), this.dom, this), this.domObserver = new Ob(this, (r, i, s, o) => Lb(this, r, i, s, o)), this.domObserver.start(), rb(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && ia(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Kc), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
    e.storedMarks && this.composing && ($f(this), o = !0), this.state = e;
    let a = i.plugins != e.plugins || this._props.plugins != t.plugins;
    if (a || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let h = jc(this);
      qb(h, this.nodeViews) && (this.nodeViews = h, s = !0);
    }
    (a || t.handleDOMEvents != this._props.handleDOMEvents) && ia(this), this.editable = Hc(this), Uc(this);
    let l = mo(this), c = Wc(this), u = i.plugins != e.plugins && !i.doc.eq(e.doc) ? "reset" : e.scrollToSelection > i.scrollToSelection ? "to selection" : "preserve", d = s || !this.docView.matchesNode(e.doc, c, l);
    (d || !e.selection.eq(i.selection)) && (o = !0);
    let f = u == "preserve" && o && this.dom.style.overflowAnchor == null && yv(this);
    if (o) {
      this.domObserver.stop();
      let h = d && (je || Ae) && !this.composing && !i.selection.empty && !e.selection.empty && Vb(i.selection, e.selection);
      if (d) {
        let p = Ae ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = yb(this)), (s || !this.docView.update(e.doc, c, l, this)) && (this.docView.updateOuterDeco(c), this.docView.destroy(), this.docView = kc(e.doc, c, l, this.dom, this)), p && (!this.trackWrites || !this.dom.contains(this.trackWrites)) && (h = !0);
      }
      h || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Vv(this)) ? _t(this, h) : (Cf(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(i), !((r = this.dragging) === null || r === void 0) && r.node && !i.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, i), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : f && vv(f);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!(!e || !this.dom.contains(e.nodeType == 1 ? e : e.parentNode))) {
      if (!this.someProp("handleScrollToSelection", (t) => t(this))) if (this.state.selection instanceof H) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && yc(this, t.getBoundingClientRect(), e);
      } else
        yc(this, this.coordsAtPos(this.state.selection.head, 1), e);
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
    this.dragging = new Bf(e.slice, e.move, i < 0 ? void 0 : H.create(this.state.doc, i));
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
    if (je) {
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
    this.domObserver.stop(), this.editable && bv(this.dom), _t(this), this.domObserver.start();
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
    return Cv(this, e);
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
    return gf(this, e, t);
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
    return Ov(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return qr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return qr(this, e, null, !0, t || new ClipboardEvent("paste"));
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
    return Ja(this, e);
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (ib(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], mo(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, av());
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
    return ob(this, e);
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return e ? Ne && this.root.nodeType === 11 && fv(this.dom.ownerDocument) == this.dom && Pb(this, e) || e : { focusNode: null, focusOffset: 0, anchorNode: null, anchorOffset: 0 };
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
Wf.prototype.dispatch = function(n) {
  let e = this._props.dispatchTransaction;
  e ? e.call(this, n) : this.updateState(this.state.apply(n));
};
function Wc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [We.node(0, n.state.doc.content.size, e)];
}
function Uc(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: We.widget(n.state.selection.from, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Hc(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Vb(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function jc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function qb(n, e) {
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
function Kc(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var Qt = {
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
}, ts = {
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
}, Wb = typeof navigator < "u" && /Mac/.test(navigator.platform), Ub = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var Me = 0; Me < 10; Me++) Qt[48 + Me] = Qt[96 + Me] = String(Me);
for (var Me = 1; Me <= 24; Me++) Qt[Me + 111] = "F" + Me;
for (var Me = 65; Me <= 90; Me++)
  Qt[Me] = String.fromCharCode(Me + 32), ts[Me] = String.fromCharCode(Me);
for (var yo in Qt) ts.hasOwnProperty(yo) || (ts[yo] = Qt[yo]);
function Hb(n) {
  var e = Wb && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Ub && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? ts : Qt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const jb = typeof navigator < "u" && /Mac|iP(hone|[oa]d)/.test(navigator.platform), Kb = typeof navigator < "u" && /Win/.test(navigator.platform);
function Jb(n) {
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
      jb ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function Xb(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Jb(t)] = n[t];
  return e;
}
function vo(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function Yb(n) {
  return new De({ props: { handleKeyDown: Gb(n) } });
}
function Gb(n) {
  let e = Xb(n);
  return function(t, r) {
    let i = Hb(r), s, o = e[vo(i, r)];
    if (o && o(t.state, t.dispatch, t))
      return !0;
    if (i.length == 1 && i != " ") {
      if (r.shiftKey) {
        let a = e[vo(i, r, !1)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.altKey || r.metaKey || r.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
      !(Kb && r.ctrlKey && r.altKey) && (s = Qt[r.keyCode]) && s != i) {
        let a = e[vo(s, r)];
        if (a && a(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var Qb = Object.defineProperty, el = (n, e) => {
  for (var t in e)
    Qb(n, t, { get: e[t], enumerable: !0 });
};
function Ms(n) {
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
var As = class {
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
      state: Ms({
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
}, Uf = {};
el(Uf, {
  blur: () => Zb,
  clearContent: () => e0,
  clearNodes: () => t0,
  command: () => n0,
  createParagraphNear: () => r0,
  cut: () => i0,
  deleteCurrentNode: () => s0,
  deleteNode: () => o0,
  deleteRange: () => a0,
  deleteSelection: () => l0,
  enter: () => c0,
  exitCode: () => u0,
  extendMarkRange: () => d0,
  first: () => f0,
  focus: () => p0,
  forEach: () => m0,
  insertContent: () => g0,
  insertContentAt: () => b0,
  joinBackward: () => x0,
  joinDown: () => S0,
  joinForward: () => k0,
  joinItemBackward: () => C0,
  joinItemForward: () => T0,
  joinTextblockBackward: () => E0,
  joinTextblockForward: () => M0,
  joinUp: () => w0,
  keyboardShortcut: () => O0,
  lift: () => D0,
  liftEmptyBlock: () => P0,
  liftListItem: () => _0,
  newlineInCode: () => N0,
  resetAttributes: () => I0,
  scrollIntoView: () => R0,
  selectAll: () => $0,
  selectNodeBackward: () => L0,
  selectNodeForward: () => B0,
  selectParentNode: () => F0,
  selectTextblockEnd: () => z0,
  selectTextblockStart: () => V0,
  setContent: () => q0,
  setMark: () => aw,
  setMeta: () => lw,
  setNode: () => cw,
  setNodeSelection: () => uw,
  setTextDirection: () => dw,
  setTextSelection: () => fw,
  sinkListItem: () => hw,
  splitBlock: () => pw,
  splitListItem: () => mw,
  toggleList: () => gw,
  toggleMark: () => yw,
  toggleNode: () => vw,
  toggleWrap: () => bw,
  undoInputRule: () => ww,
  unsetAllMarks: () => Sw,
  unsetMark: () => xw,
  unsetTextDirection: () => kw,
  updateAttributes: () => Cw,
  wrapIn: () => Tw,
  wrapInList: () => Ew
});
var Zb = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window?.getSelection()) == null || t.removeAllRanges());
}), !0), e0 = (n = !0) => ({ commands: e }) => e.setContent("", { emitUpdate: n }), t0 = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), h = d.blockRange(f);
      if (!h)
        return;
      const p = ur(h);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(h.start, m);
      }
      (p || p === 0) && e.lift(h, p);
    });
  }), !0;
}, n0 = (n) => (e) => n(e), r0 = () => ({ state: n, dispatch: e }) => rf(n, e), i0 = (n, e) => ({ editor: t, tr: r }) => {
  const { state: i } = t, s = i.doc.slice(n.from, n.to);
  r.deleteRange(n.from, n.to);
  const o = r.mapping.map(e);
  return r.insert(o, s.content), r.setSelection(new Y(r.doc.resolve(Math.max(o - 1, 0)))), !0;
}, s0 = () => ({ tr: n, dispatch: e }) => {
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
function Se(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
var o0 = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = Se(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const l = s.before(o), c = s.after(o);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, a0 = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, l0 = () => ({ state: n, dispatch: e }) => za(n, e), c0 = () => ({ commands: n }) => n.keyboardShortcut("Enter"), u0 = () => ({ state: n, dispatch: e }) => Ky(n, e);
function tl(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function ns(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : tl(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Hf(n, e, t = {}) {
  return n.find((r) => r.type === e && ns(
    // Only check equality for the attributes that are provided
    Object.fromEntries(Object.keys(t).map((i) => [i, r.attrs[i]])),
    t
  ));
}
function Jc(n, e, t = {}) {
  return !!Hf(n, e, t);
}
function jf(n, e, t) {
  var r;
  if (!n || !e)
    return;
  let i = n.parent.childAfter(n.parentOffset);
  if ((!i.node || !i.node.marks.some((u) => u.type === e)) && (i = n.parent.childBefore(n.parentOffset)), !i.node || !i.node.marks.some((u) => u.type === e) || (t = t || ((r = i.node.marks[0]) == null ? void 0 : r.attrs), !Hf([...i.node.marks], e, t)))
    return;
  let o = i.index, a = n.start() + i.offset, l = o + 1, c = a + i.node.nodeSize;
  for (; o > 0 && Jc([...n.parent.child(o - 1).marks], e, t); )
    o -= 1, a -= n.parent.child(o).nodeSize;
  for (; l < n.parent.childCount && Jc([...n.parent.child(l).marks], e, t); )
    c += n.parent.child(l).nodeSize, l += 1;
  return {
    from: a,
    to: c
  };
}
function Bt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
var d0 = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = Bt(n, r.schema), { doc: o, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = jf(l, s, e);
    if (d && d.from <= c && d.to >= u) {
      const f = Y.create(o, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, f0 = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Kf(n) {
  return n instanceof Y;
}
function hn(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Jf(n, e = null) {
  if (!e)
    return null;
  const t = Z.atStart(n), r = Z.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? Y.create(n, hn(0, i, s), hn(n.content.size, i, s)) : Y.create(n, hn(e, i, s), hn(e, i, s));
}
function sa() {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
function Ur() {
  return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || // iPad on iOS 13 detection
  navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
function h0() {
  return typeof navigator < "u" ? /^((?!chrome|android).)*safari/i.test(navigator.userAgent) : !1;
}
var p0 = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    (Ur() || sa()) && r.dom.focus(), h0() && !Ur() && !sa() && r.dom.focus({ preventScroll: !0 }), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e?.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  try {
    if (r.hasFocus() && n === null || n === !1)
      return !0;
  } catch {
    return !1;
  }
  if (s && n === null && !Kf(t.state.selection))
    return o(), !0;
  const a = Jf(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return s && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, m0 = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), g0 = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e), Xf = (n) => {
  const e = n.childNodes;
  for (let t = e.length - 1; t >= 0; t -= 1) {
    const r = e[t];
    r.nodeType === 3 && r.nodeValue && /^(\n\s\s|\n)$/.test(r.nodeValue) ? n.removeChild(r) : r.nodeType === 1 && Xf(r);
  }
  return n;
};
function vi(n) {
  if (typeof window > "u")
    throw new Error("[tiptap error]: there is no window object available, so this function cannot be used");
  const e = `<body>${n}</body>`, t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Xf(t);
}
function Hr(n, e, t) {
  if (n instanceof Dt || n instanceof P)
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
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", s), Hr("", e, t);
    }
  if (i) {
    if (t.errorOnInvalidContent) {
      let o = !1, a = "";
      const l = new Dd({
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
      if (t.slice ? Cr.fromSchema(l).parseSlice(vi(n), t.parseOptions) : Cr.fromSchema(l).parse(vi(n), t.parseOptions), t.errorOnInvalidContent && o)
        throw new Error("[tiptap error]: Invalid HTML content", {
          cause: new Error(`Invalid element found: ${a}`)
        });
    }
    const s = Cr.fromSchema(e);
    return t.slice ? s.parseSlice(vi(n), t.parseOptions).content : s.parse(vi(n), t.parseOptions);
  }
  return Hr("", e, t);
}
function y0(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof be || i instanceof we))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((a, l, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(Z.near(n.doc.resolve(o), t));
}
var v0 = (n) => !("type" in n), b0 = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
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
        Hr(e, s.schema, {
          parseOptions: c,
          errorOnInvalidContent: !0
        });
      } catch (g) {
        l(g);
      }
    try {
      a = Hr(e, s.schema, {
        parseOptions: c,
        errorOnInvalidContent: (o = t.errorOnInvalidContent) != null ? o : s.options.enableContentCheck
      });
    } catch (g) {
      return l(g), !1;
    }
    let { from: u, to: d } = typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to }, f = !0, h = !0;
    if ((v0(a) ? a : [a]).forEach((g) => {
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
      const g = r.doc.resolve(u), y = g.node(), S = g.parentOffset === 0, x = y.isText || y.isTextblock, b = y.content.size > 0;
      S && x && b && (u = Math.max(0, u - 1)), r.replaceWith(u, d, m);
    }
    t.updateSelection && y0(r, r.steps.length - 1, -1), t.applyInputRules && r.setMeta("applyInputRules", { from: u, text: m }), t.applyPasteRules && r.setMeta("applyPasteRules", { from: u, text: m });
  }
  return !0;
}, w0 = () => ({ state: n, dispatch: e }) => Uy(n, e), S0 = () => ({ state: n, dispatch: e }) => Hy(n, e), x0 = () => ({ state: n, dispatch: e }) => Yd(n, e), k0 = () => ({ state: n, dispatch: e }) => ef(n, e), C0 = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ss(n.doc, n.selection.$from.pos, -1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, T0 = () => ({ state: n, dispatch: e, tr: t }) => {
  try {
    const r = Ss(n.doc, n.selection.$from.pos, 1);
    return r == null ? !1 : (t.join(r, 2), e && e(t), !0);
  } catch {
    return !1;
  }
}, E0 = () => ({ state: n, dispatch: e }) => qy(n, e), M0 = () => ({ state: n, dispatch: e }) => Wy(n, e);
function Yf() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function A0(n) {
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
      Ur() || Yf() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
var O0 = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = A0(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
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
function jr(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? Se(e, n.schema) : null, a = [];
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
  const l = i - r, c = a.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => ns(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
var D0 = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return jr(t, i, e) ? jy(t, r) : !1;
}, P0 = () => ({ state: n, dispatch: e }) => sf(n, e), _0 = (n) => ({ state: e, dispatch: t }) => {
  const r = Se(n, e.schema);
  return rv(r)(e, t);
}, N0 = () => ({ state: n, dispatch: e }) => nf(n, e);
function Os(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Xc(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
var I0 = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Os(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Se(n, r.schema)), a === "mark" && (o = Bt(n, r.schema));
  let l = !1;
  return t.selection.ranges.forEach((c) => {
    r.doc.nodesBetween(c.$from.pos, c.$to.pos, (u, d) => {
      s && s === u.type && (l = !0, i && t.setNodeMarkup(d, void 0, Xc(u.attrs, e))), o && u.marks.length && u.marks.forEach((f) => {
        o === f.type && (l = !0, i && t.addMark(d, d + u.nodeSize, o.create(Xc(f.attrs, e))));
      });
    });
  }), l;
}, R0 = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), $0 = () => ({ tr: n, dispatch: e }) => {
  if (e) {
    const t = new He(n.doc);
    n.setSelection(t);
  }
  return !0;
}, L0 = () => ({ state: n, dispatch: e }) => Qd(n, e), B0 = () => ({ state: n, dispatch: e }) => tf(n, e), F0 = () => ({ state: n, dispatch: e }) => Xy(n, e), z0 = () => ({ state: n, dispatch: e }) => Qy(n, e), V0 = () => ({ state: n, dispatch: e }) => Gy(n, e);
function oa(n, e, t = {}, r = {}) {
  return Hr(n, e, {
    slice: !1,
    parseOptions: t,
    errorOnInvalidContent: r.errorOnInvalidContent
  });
}
var q0 = (n, { errorOnInvalidContent: e, emitUpdate: t = !0, parseOptions: r = {} } = {}) => ({ editor: i, tr: s, dispatch: o, commands: a }) => {
  const { doc: l } = s;
  if (r.preserveWhitespace !== "full") {
    const c = oa(n, i.schema, r, {
      errorOnInvalidContent: e ?? i.options.enableContentCheck
    });
    return o && s.replaceWith(0, l.content.size, c).setMeta("preventUpdate", !t), !0;
  }
  return o && s.setMeta("preventUpdate", !t), a.insertContentAt({ from: 0, to: l.content.size }, n, {
    parseOptions: r,
    errorOnInvalidContent: e ?? i.options.enableContentCheck
  });
};
function Gf(n, e) {
  const t = Bt(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    o.push(...l.marks);
  });
  const a = o.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function W0(n, e) {
  const t = new jd(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function U0(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function H0(n, e) {
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
function nl(n) {
  return (e) => H0(e.$from, n);
}
function U(n, e, t) {
  return n.config[e] === void 0 && n.parent ? U(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? U(n.parent, e, t) : null
  }) : n.config[e];
}
function rl(n) {
  return n.map((e) => {
    const t = {
      name: e.name,
      options: e.options,
      storage: e.storage
    }, r = U(e, "addExtensions", t);
    return r ? [e, ...rl(r())] : e;
  }).flat(10);
}
function il(n, e) {
  const t = Pn.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function Qf(n) {
  return typeof n == "function";
}
function ue(n, e = void 0, ...t) {
  return Qf(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function j0(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function rr(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Zf(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = rr(n), i = [...t, ...r], s = {
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
    }, d = U(
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
    }, d = U(
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
function K0(n) {
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
function Yc(n) {
  const e = [], t = K0(n || ""), r = t.length;
  for (let i = 0; i < r; i += 1) {
    const s = t[i], o = s.indexOf(":");
    if (o === -1)
      continue;
    const a = s.slice(0, o).trim(), l = s.slice(o + 1).trim();
    a && l && e.push([a, l]);
  }
  return e;
}
function eh(...n) {
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
        const a = new Map([...Yc(r[i]), ...Yc(s)]);
        r[i] = Array.from(a.entries()).map(([l, c]) => `${l}: ${c}`).join("; ");
      } else
        r[i] = s;
    }), r;
  }, {});
}
function rs(n, e) {
  return e.filter((t) => t.type === n.type.name).filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => eh(t, r), {});
}
function J0(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Gc(n, e) {
  return "style" in n ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const a = o.attribute.parseHTML ? o.attribute.parseHTML(t) : J0(t.getAttribute(o.name));
        return a == null ? s : {
          ...s,
          [o.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function Qc(n) {
  return Object.fromEntries(
    // @ts-ignore
    Object.entries(n).filter(([e, t]) => e === "attrs" && j0(t) ? !1 : t != null)
  );
}
function Zc(n) {
  var e, t;
  const r = {};
  return !((e = n?.attribute) != null && e.isRequired) && "default" in (n?.attribute || {}) && (r.default = n.attribute.default), ((t = n?.attribute) == null ? void 0 : t.validate) !== void 0 && (r.validate = n.attribute.validate), [n.name, r];
}
function th(n, e) {
  var t;
  const r = Zf(n), { nodeExtensions: i, markExtensions: s } = rr(n), o = (t = i.find((c) => U(c, "topNode"))) == null ? void 0 : t.name, a = Object.fromEntries(
    i.map((c) => {
      const u = r.filter((y) => y.type === c.name), d = {
        name: c.name,
        options: c.options,
        storage: c.storage,
        editor: e
      }, f = n.reduce((y, S) => {
        const x = U(S, "extendNodeSchema", d);
        return {
          ...y,
          ...x ? x(c) : {}
        };
      }, {}), h = Qc({
        ...f,
        content: ue(U(c, "content", d)),
        marks: ue(U(c, "marks", d)),
        group: ue(U(c, "group", d)),
        inline: ue(U(c, "inline", d)),
        atom: ue(U(c, "atom", d)),
        selectable: ue(U(c, "selectable", d)),
        draggable: ue(U(c, "draggable", d)),
        code: ue(U(c, "code", d)),
        whitespace: ue(U(c, "whitespace", d)),
        linebreakReplacement: ue(
          U(c, "linebreakReplacement", d)
        ),
        defining: ue(U(c, "defining", d)),
        isolating: ue(U(c, "isolating", d)),
        attrs: Object.fromEntries(u.map(Zc))
      }), p = ue(U(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (y) => Gc(y, u)
      ));
      const m = U(c, "renderHTML", d);
      m && (h.toDOM = (y) => m({
        node: y,
        HTMLAttributes: rs(y, u)
      }));
      const g = U(c, "renderText", d);
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
        const S = U(y, "extendMarkSchema", d);
        return {
          ...g,
          ...S ? S(c) : {}
        };
      }, {}), h = Qc({
        ...f,
        inclusive: ue(U(c, "inclusive", d)),
        excludes: ue(U(c, "excludes", d)),
        group: ue(U(c, "group", d)),
        spanning: ue(U(c, "spanning", d)),
        code: ue(U(c, "code", d)),
        attrs: Object.fromEntries(u.map(Zc))
      }), p = ue(U(c, "parseHTML", d));
      p && (h.parseDOM = p.map(
        (g) => Gc(g, u)
      ));
      const m = U(c, "renderHTML", d);
      return m && (h.toDOM = (g) => m({
        mark: g,
        HTMLAttributes: rs(g, u)
      })), [c.name, h];
    })
  );
  return new Dd({
    topNode: o,
    nodes: a,
    marks: l
  });
}
function X0(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return Array.from(new Set(e));
}
function Ar(n) {
  return n.sort((t, r) => {
    const i = U(t, "priority") || 100, s = U(r, "priority") || 100;
    return i > s ? -1 : i < s ? 1 : 0;
  });
}
function sl(n) {
  const e = Ar(rl(n)), t = X0(e.map((r) => r.name));
  return t.length && console.warn(
    `[tiptap warn]: Duplicate extension names found: [${t.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`
  ), e;
}
function Y0(n, e) {
  const t = sl(n);
  return th(t, e);
}
function nh(n, e, t) {
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
function G0(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return nh(n, t, e);
}
function rh(n) {
  return Object.fromEntries(
    Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText])
  );
}
function Q0(n, e) {
  const t = Se(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (a) => {
    s.push(a);
  });
  const o = s.reverse().find((a) => a.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function Z0(n, e) {
  const t = Os(
    typeof e == "string" ? e : e.name,
    n.schema
  );
  return t === "node" ? Q0(n, e) : t === "mark" ? Gf(n, e) : {};
}
function ew(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function tw(n) {
  const e = ew(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function nw(n) {
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
  }), tw(r);
}
function yr(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Ni(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([r]) => {
      const i = n.find((s) => s.type === e && s.name === r);
      return i ? i.attribute.keepOnSplit : !1;
    })
  );
}
var rw = (n, e = 500) => {
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
function aa(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? Bt(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => ns(d.attrs, t, { strict: !1 }));
  let o = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const h = d.pos, p = f.pos;
    n.doc.nodesBetween(h, p, (m, g) => {
      if (s && m.inlineContent && !m.type.allowsMarkType(s))
        return !1;
      if (!m.isText && !m.marks.length)
        return;
      const y = Math.max(h, g), S = Math.min(p, g + m.nodeSize), x = S - y;
      o += x, a.push(
        ...m.marks.map((b) => ({
          mark: b,
          from: y,
          to: S
        }))
      );
    });
  }), o === 0)
    return !1;
  const l = a.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => ns(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= o;
}
function iw(n, e, t = {}) {
  if (!e)
    return jr(n, null, t) || aa(n, null, t);
  const r = Os(e, n.schema);
  return r === "node" ? jr(n, e, t) : r === "mark" ? aa(n, e, t) : !1;
}
function eu(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
function tu(n, e) {
  const { nodeExtensions: t } = rr(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = ue(U(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
function ol(n, {
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
      i !== !1 && (ol(s, { ignoreWhitespace: t, checkChildren: e }) || (i = !1));
    }), i;
  }
  return !1;
}
var al = class ih {
  constructor(e) {
    this.position = e;
  }
  /**
   * Creates a MappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new ih(e.position);
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
function sh(n, e) {
  const t = e.mapping.mapResult(n.position);
  return {
    position: new al(t.pos),
    mapResult: t
  };
}
function sw(n) {
  return new al(n);
}
function ow(n, e, t) {
  var r;
  const { selection: i } = e;
  let s = null;
  if (Kf(i) && (s = i.$cursor), s) {
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
var aw = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: a } = s, l = Bt(n, r.schema);
  if (i)
    if (o) {
      const c = Gf(r, l);
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
  return ow(r, t, l);
}, lw = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), cw = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = Se(n, t.schema);
  let o;
  return t.selection.$anchor.sameParent(t.selection.$head) && (o = t.selection.$anchor.parent.attrs), s.isTextblock ? i().command(({ commands: a }) => pc(s, { ...o, ...e })(t) ? !0 : a.clearNodes()).command(({ state: a }) => pc(s, { ...o, ...e })(a, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, uw = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = hn(n, 0, r.content.size), s = H.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, dw = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = r;
  let o, a;
  return typeof e == "number" ? (o = e, a = e) : e && "from" in e && "to" in e ? (o = e.from, a = e.to) : (o = s.from, a = s.to), i && t.doc.nodesBetween(o, a, (l, c) => {
    l.isText || t.setNodeMarkup(c, void 0, {
      ...l.attrs,
      dir: n
    });
  }), !0;
}, fw = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = Y.atStart(r).from, a = Y.atEnd(r).to, l = hn(i, o, a), c = hn(s, o, a), u = Y.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, hw = (n) => ({ state: e, dispatch: t }) => {
  const r = Se(n, e.schema);
  return ov(r)(e, t);
};
function nu(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e?.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
var pw = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: a, $to: l } = s, c = i.extensionManager.attributes, u = Ni(c, a.node().type.name, a.node().attrs);
  if (s instanceof H && s.node.isBlock)
    return !a.parentOffset || !Pt(o, a.pos) ? !1 : (r && (n && nu(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  const d = l.parentOffset === l.parent.content.size, f = a.depth === 0 ? void 0 : U0(a.node(-1).contentMatchAt(a.indexAfter(-1)));
  let h = d && f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0, p = Pt(e.doc, e.mapping.map(a.pos), 1, h);
  if (!h && !p && Pt(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (p = !0, h = f ? [
    {
      type: f,
      attrs: u
    }
  ] : void 0), r) {
    if (p && (s instanceof Y && e.deleteSelection(), e.split(e.mapping.map(a.pos), 1, h), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), g = e.doc.resolve(m);
      a.node(-1).canReplaceWith(g.index(), g.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && nu(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return p;
}, mw = (n, e = {}) => ({ tr: t, state: r, dispatch: i, editor: s }) => {
  var o;
  const a = Se(n, r.schema), { $from: l, $to: c } = r.selection, u = r.selection.node;
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
      const S = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let E = l.depth - S; E >= l.depth - 3; E -= 1)
        y = P.from(l.node(E).copy(y));
      const x = (
        // eslint-disable-next-line no-nested-ternary
        l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3
      ), b = {
        ...Ni(f, l.node().type.name, l.node().attrs),
        ...e
      }, k = ((o = a.contentMatch.defaultType) == null ? void 0 : o.createAndFill(b)) || void 0;
      y = y.append(P.from(a.createAndFill(null, k) || void 0));
      const C = l.before(l.depth - (S - 1));
      t.replace(C, l.after(-x), new L(y, 4 - S, 0));
      let w = -1;
      t.doc.nodesBetween(C, t.doc.content.size, (E, T) => {
        if (w > -1)
          return !1;
        E.isTextblock && E.content.size === 0 && (w = T + 1);
      }), w > -1 && t.setSelection(Y.near(t.doc.resolve(w))), t.scrollIntoView();
    }
    return !0;
  }
  const h = c.pos === l.end() ? d.contentMatchAt(0).defaultType : null, p = {
    ...Ni(f, d.type.name, d.attrs),
    ...e
  }, m = {
    ...Ni(f, l.node().type.name, l.node().attrs),
    ...e
  };
  t.delete(l.pos, c.pos);
  const g = h ? [
    { type: a, attrs: p },
    { type: h, attrs: m }
  ] : [{ type: a, attrs: p }];
  if (!Pt(t.doc, l.pos, 2))
    return !1;
  if (i) {
    const { selection: y, storedMarks: S } = r, { splittableMarks: x } = s.extensionManager, b = S || y.$to.parentOffset && y.$from.marks();
    if (t.split(l.pos, 2, g).scrollIntoView(), !b || !i)
      return !0;
    const k = b.filter((C) => x.includes(C.type.name));
    t.ensureMarks(k);
  }
  return !0;
}, bo = (n, e) => {
  const t = nl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && _n(n.doc, t.pos) && n.join(t.pos), !0;
}, wo = (n, e) => {
  const t = nl((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === i?.type && _n(n.doc, r) && n.join(r), !0;
}, gw = (n, e, t, r = {}) => ({ editor: i, tr: s, state: o, dispatch: a, chain: l, commands: c, can: u }) => {
  const { extensions: d, splittableMarks: f } = i.extensionManager, h = Se(n, o.schema), p = Se(e, o.schema), { selection: m, storedMarks: g } = o, { $from: y, $to: S } = m, x = y.blockRange(S), b = g || m.$to.parentOffset && m.$from.marks();
  if (!x)
    return !1;
  const k = nl((C) => tu(C.type.name, d))(m);
  if (x.depth >= 1 && k && x.depth - k.depth <= 1) {
    if (k.node.type === h)
      return c.liftListItem(p);
    if (tu(k.node.type.name, d) && h.validContent(k.node.content) && a)
      return l().command(() => (s.setNodeMarkup(k.pos, h), !0)).command(() => bo(s, h)).command(() => wo(s, h)).run();
  }
  return !t || !b || !a ? l().command(() => u().wrapInList(h, r) ? !0 : c.clearNodes()).wrapInList(h, r).command(() => bo(s, h)).command(() => wo(s, h)).run() : l().command(() => {
    const C = u().wrapInList(h, r), w = b.filter((E) => f.includes(E.type.name));
    return s.ensureMarks(w), C ? !0 : c.clearNodes();
  }).wrapInList(h, r).command(() => bo(s, h)).command(() => wo(s, h)).run();
}, yw = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = Bt(n, r.schema);
  return aa(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, vw = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = Se(n, r.schema), o = Se(e, r.schema), a = jr(r, s, t);
  let l;
  return r.selection.$anchor.sameParent(r.selection.$head) && (l = r.selection.$anchor.parent.attrs), a ? i.setNode(o, l) : i.setNode(s, { ...l, ...t });
}, bw = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = Se(n, t.schema);
  return jr(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, ww = () => ({ state: n, dispatch: e }) => {
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
}, Sw = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, xw = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: a } = t, l = Bt(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && o) {
    let { from: f, to: h } = a;
    const p = (s = c.marks().find((g) => g.type === l)) == null ? void 0 : s.attrs, m = jf(c, l, p);
    m && (f = m.from, h = m.to), t.removeMark(f, h, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, kw = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const { selection: i } = t;
  let s, o;
  return typeof n == "number" ? (s = n, o = n) : n && "from" in n && "to" in n ? (s = n.from, o = n.to) : (s = i.from, o = i.to), r && e.doc.nodesBetween(s, o, (a, l) => {
    if (a.isText)
      return;
    const c = { ...a.attrs };
    delete c.dir, e.setNodeMarkup(l, void 0, c);
  }), !0;
}, Cw = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const a = Os(
    typeof n == "string" ? n : n.name,
    r.schema
  );
  if (!a)
    return !1;
  a === "node" && (s = Se(n, r.schema)), a === "mark" && (o = Bt(n, r.schema));
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
      })), o && g.marks.length && g.marks.forEach((S) => {
        if (o === S.type && (l = !0, i)) {
          const x = Math.max(y, u), b = Math.min(y + g.nodeSize, d);
          t.addMark(
            x,
            b,
            o.create({
              ...S.attrs,
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
}, Tw = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return Zy(i, e)(t, r);
}, Ew = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = Se(n, t.schema);
  return ev(i, e)(t, r);
}, Mw = class {
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
}, Aw = (n, e) => {
  if (tl(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [t.text];
  return r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function bi(n) {
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
  const d = rw(c) + s;
  return o.forEach((f) => {
    if (u)
      return;
    const h = Aw(d, f.find);
    if (!h)
      return;
    const p = l.state.tr, m = Ms({
      state: l.state,
      transaction: p
    }), g = {
      from: r - (h[0].length - s.length),
      to: i
    }, { commands: y, chain: S, can: x } = new As({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: g,
      match: h,
      commands: y,
      chain: S,
      can: x
    }) === null || !p.steps.length || (f.undoable && p.setMeta(a, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), l.dispatch(p), u = !0);
  }), u;
}
function Ow(n) {
  const { editor: e, rules: t } = n, r = new De({
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
          typeof u == "string" ? u = u : u = il(P.from(u), o.schema);
          const { from: d } = l, f = d + u.length;
          bi({
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
        return bi({
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
          s && bi({
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
        return o ? bi({
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
function Dw(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function wi(n) {
  return Dw(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function oh(n, e) {
  const t = { ...n };
  return wi(n) && wi(e) && Object.keys(e).forEach((r) => {
    wi(e[r]) && wi(n[r]) ? t[r] = oh(n[r], e[r]) : t[r] = e[r];
  }), t;
}
var ll = class {
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
        U(this, "addOptions", {
          name: this.name
        })
      ) || {}
    };
  }
  get storage() {
    return {
      ...ue(
        U(this, "addStorage", {
          name: this.name,
          options: this.options
        })
      ) || {}
    };
  }
  configure(n = {}) {
    const e = this.extend({
      ...this.config,
      addOptions: () => oh(this.options, n)
    });
    return e.name = this.name, e.parent = this.parent, e;
  }
  extend(n = {}) {
    const e = new this.constructor({ ...this.config, ...n });
    return e.parent = this, this.child = e, e.name = "name" in n ? n.name : e.parent.name, e;
  }
}, Pw = class ah extends ll {
  constructor() {
    super(...arguments), this.type = "mark";
  }
  /**
   * Create a new Mark instance
   * @param config - Mark configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new ah(t);
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
function _w(n) {
  return typeof n == "number";
}
var Nw = (n, e, t) => {
  if (tl(e))
    return [...n.matchAll(e)];
  const r = e(n, t);
  return r ? r.map((i) => {
    const s = [i.text];
    return s.index = i.index, s.input = n, s.data = i.data, i.replaceWith && (i.text.includes(i.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), s.push(i.replaceWith)), s;
  }) : [];
};
function Iw(n) {
  const { editor: e, state: t, from: r, to: i, rule: s, pasteEvent: o, dropEvent: a } = n, { commands: l, chain: c, can: u } = new As({
    editor: e,
    state: t
  }), d = [];
  return t.doc.nodesBetween(r, i, (h, p) => {
    var m, g, y, S, x;
    if ((g = (m = h.type) == null ? void 0 : m.spec) != null && g.code || !(h.isText || h.isTextblock || h.isInline))
      return;
    const b = (x = (S = (y = h.content) == null ? void 0 : y.size) != null ? S : h.nodeSize) != null ? x : 0, k = Math.max(r, p), C = Math.min(i, p + b);
    if (k >= C)
      return;
    const w = h.isText ? h.text || "" : h.textBetween(k - p, C - p, void 0, "￼");
    Nw(w, s.find, o).forEach((T) => {
      if (T.index === void 0)
        return;
      const M = k + T.index + 1, I = M + T[0].length, R = {
        from: t.tr.mapping.map(M),
        to: t.tr.mapping.map(I)
      }, q = s.handler({
        state: t,
        range: R,
        match: T,
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
var Si = null, Rw = (n) => {
  var e;
  const t = new ClipboardEvent("paste", {
    clipboardData: new DataTransfer()
  });
  return (e = t.clipboardData) == null || e.setData("text/html", n), t;
};
function $w(n) {
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
    const m = u.tr, g = Ms({
      state: u,
      transaction: m
    });
    if (!(!Iw({
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
  return t.map((u) => new De({
    // we register a global drag handler to track the current drag source element
    view(d) {
      const f = (p) => {
        var m;
        r = (m = d.dom.parentElement) != null && m.contains(p.target) ? d.dom.parentElement : null, r && (Si = e);
      }, h = () => {
        Si && (Si = null);
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
            const h = Si;
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
      const p = d[0], m = p.getMeta("uiEvent") === "paste" && !i, g = p.getMeta("uiEvent") === "drop" && !s, y = p.getMeta("applyPasteRules"), S = !!y;
      if (!m && !g && !S)
        return;
      if (S) {
        let { text: k } = y;
        typeof k == "string" ? k = k : k = il(P.from(k), h.schema);
        const { from: C } = y, w = C + k.length, E = Rw(k);
        return l({
          rule: u,
          state: h,
          from: C,
          to: { b: w },
          pasteEvt: E
        });
      }
      const x = f.doc.content.findDiffStart(h.doc.content), b = f.doc.content.findDiffEnd(h.doc.content);
      if (!(!_w(x) || !b || x === b.b))
        return l({
          rule: u,
          state: h,
          from: x,
          to: b,
          pasteEvt: o
        });
    }
  }));
}
var Ds = class {
  constructor(n, e) {
    this.splittableMarks = [], this.editor = e, this.baseExtensions = n, this.extensions = sl(n), this.schema = th(this.extensions, e), this.setupExtensions();
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
        type: yr(e.name, this.schema)
      }, r = U(e, "addCommands", t);
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
    return Ar([...this.extensions].reverse()).flatMap((r) => {
      const i = {
        name: r.name,
        options: r.options,
        storage: this.editor.extensionStorage[r.name],
        editor: n,
        type: yr(r.name, this.schema)
      }, s = [], o = U(
        r,
        "addKeyboardShortcuts",
        i
      );
      let a = {};
      if (r.type === "mark" && U(r, "exitable", i) && (a.ArrowRight = () => Pw.handleExit({ editor: n, mark: r })), o) {
        const f = Object.fromEntries(
          Object.entries(o()).map(([h, p]) => [h, () => p({ editor: n })])
        );
        a = { ...a, ...f };
      }
      const l = Yb(a);
      s.push(l);
      const c = U(r, "addInputRules", i);
      if (eu(r, n.options.enableInputRules) && c) {
        const f = c();
        if (f && f.length) {
          const h = Ow({
            editor: n,
            rules: f
          }), p = Array.isArray(h) ? h : [h];
          s.push(...p);
        }
      }
      const u = U(r, "addPasteRules", i);
      if (eu(r, n.options.enablePasteRules) && u) {
        const f = u();
        if (f && f.length) {
          const h = $w({ editor: n, rules: f });
          s.push(...h);
        }
      }
      const d = U(
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
    return Zf(this.extensions);
  }
  /**
   * Get all node views from the extensions.
   * @returns An object with all node views where the key is the node name and the value is the node view function
   */
  get nodeViews() {
    const { editor: n } = this, { nodeExtensions: e } = rr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!U(t, "addNodeView")).map((t) => {
        const r = this.attributes.filter((l) => l.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Se(t.name, this.schema)
        }, s = U(t, "addNodeView", i);
        if (!s)
          return [];
        const o = s();
        if (!o)
          return [];
        const a = (l, c, u, d, f) => {
          const h = rs(l, r);
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
    return Ar([...this.extensions].reverse()).reduceRight((r, i) => {
      const s = {
        name: i.name,
        options: i.options,
        storage: this.editor.extensionStorage[i.name],
        editor: e,
        type: yr(i.name, this.schema)
      }, o = U(
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
    return Ar([...this.extensions]).reduce(
      (r, i) => {
        const s = {
          name: i.name,
          options: i.options,
          storage: this.editor.extensionStorage[i.name],
          editor: e,
          type: yr(i.name, this.schema)
        }, o = U(
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
    const { editor: n } = this, { markExtensions: e } = rr(this.extensions);
    return Object.fromEntries(
      e.filter((t) => !!U(t, "addMarkView")).map((t) => {
        const r = this.attributes.filter((a) => a.type === t.name), i = {
          name: t.name,
          options: t.options,
          storage: this.editor.extensionStorage[t.name],
          editor: n,
          type: Bt(t.name, this.schema)
        }, s = U(t, "addMarkView", i);
        if (!s)
          return [];
        const o = (a, l, c) => {
          const u = rs(a, r);
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
              Yw(a, n, d);
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
        type: yr(e.name, this.schema)
      };
      e.type === "mark" && ((t = ue(U(e, "keepOnSplit", r))) == null || t) && this.splittableMarks.push(e.name);
      const i = U(e, "onBeforeCreate", r), s = U(e, "onCreate", r), o = U(e, "onUpdate", r), a = U(
        e,
        "onSelectionUpdate",
        r
      ), l = U(e, "onTransaction", r), c = U(e, "onFocus", r), u = U(e, "onBlur", r), d = U(e, "onDestroy", r);
      i && this.editor.on("beforeCreate", i), s && this.editor.on("create", s), o && this.editor.on("update", o), a && this.editor.on("selectionUpdate", a), l && this.editor.on("transaction", l), c && this.editor.on("focus", c), u && this.editor.on("blur", u), d && this.editor.on("destroy", d);
    });
  }
};
Ds.resolve = sl;
Ds.sort = Ar;
Ds.flatten = rl;
var Lw = {};
el(Lw, {
  ClipboardTextSerializer: () => ch,
  Commands: () => uh,
  Delete: () => dh,
  Drop: () => fh,
  Editable: () => hh,
  FocusEvents: () => mh,
  Keymap: () => gh,
  Paste: () => yh,
  Tabindex: () => vh,
  TextDirection: () => bh,
  focusEventsPluginKey: () => ph
});
var Ye = class lh extends ll {
  constructor() {
    super(...arguments), this.type = "extension";
  }
  /**
   * Create a new Extension instance
   * @param config - Extension configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new lh(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, ch = Ye.create({
  name: "clipboardTextSerializer",
  addOptions() {
    return {
      blockSeparator: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      new De({
        key: new Xe("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), a = Math.max(...s.map((u) => u.$to.pos)), l = rh(t);
            return nh(r, { from: o, to: a }, {
              ...this.options.blockSeparator !== void 0 ? { blockSeparator: this.options.blockSeparator } : {},
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), uh = Ye.create({
  name: "commands",
  addCommands() {
    return {
      ...Uf
    };
  }
}), dh = Ye.create({
  name: "delete",
  onUpdate({ transaction: n, appendedTransactions: e }) {
    var t, r, i;
    const s = () => {
      var o, a, l, c;
      if ((c = (l = (a = (o = this.editor.options.coreExtensionOptions) == null ? void 0 : o.delete) == null ? void 0 : a.filterTransaction) == null ? void 0 : l.call(a, n)) != null ? c : n.getMeta("y-sync$"))
        return;
      const u = W0(n.before, [n, ...e]);
      nw(u).forEach((h) => {
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
        if (h instanceof ut) {
          const y = f.slice(p).map(h.from, -1), S = f.slice(p).map(h.to), x = f.invert().map(y, -1), b = f.invert().map(S), k = (m = u.doc.nodeAt(y - 1)) == null ? void 0 : m.marks.some((w) => w.eq(h.mark)), C = (g = u.doc.nodeAt(S)) == null ? void 0 : g.marks.some((w) => w.eq(h.mark));
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
              from: y,
              to: S
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
}), fh = Ye.create({
  name: "drop",
  addProseMirrorPlugins() {
    return [
      new De({
        key: new Xe("tiptapDrop"),
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
}), hh = Ye.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new De({
        key: new Xe("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), ph = new Xe("focusEvents"), mh = Ye.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new De({
        key: ph,
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
}), gh = Ye.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      // maybe convert first text block node to default node
      () => o.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: f, parent: h } = d, p = d.parent.isTextblock && f > 0 ? a.doc.resolve(f - 1) : d, m = p.parent.type.spec.isolating, g = d.pos - d.parentOffset, y = m && p.parent.childCount === 1 ? g === d.pos : Z.atStart(c).from === f;
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
    return Ur() || Yf() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      // With this plugin we check if the whole document was selected and deleted.
      // In this case we will additionally call `clearNodes()` to convert e.g. a heading
      // to a paragraph if necessary.
      // This is an alternative to ProseMirror's `AllSelection`, which doesn’t work well
      // with many other commands.
      new De({
        key: new Xe("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (n.some((m) => m.getMeta("composition")))
            return;
          const r = n.some((m) => m.docChanged) && !e.doc.eq(t.doc), i = n.some((m) => m.getMeta("preventClearDocument"));
          if (!r || i)
            return;
          const { empty: s, from: o, to: a } = e.selection, l = Z.atStart(e.doc).from, c = Z.atEnd(e.doc).to;
          if (s || !(o === l && a === c) || !ol(t.doc))
            return;
          const f = t.tr, h = Ms({
            state: t,
            transaction: f
          }), { commands: p } = new As({
            editor: this.editor,
            state: h
          });
          if (p.clearNodes(), !!f.steps.length)
            return f;
        }
      })
    ];
  }
}), yh = Ye.create({
  name: "paste",
  addProseMirrorPlugins() {
    return [
      new De({
        key: new Xe("tiptapPaste"),
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
}), vh = Ye.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new De({
        key: new Xe("tabindex"),
        props: {
          attributes: () => this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
}), bh = Ye.create({
  name: "textDirection",
  addOptions() {
    return {
      direction: void 0
    };
  },
  addGlobalAttributes() {
    if (!this.options.direction)
      return [];
    const { nodeExtensions: n } = rr(this.extensions);
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
      new De({
        key: new Xe("textDirection"),
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
}), Bw = class Sr {
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
    return new Sr(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)), new Sr(e, this.editor);
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)), new Sr(e, this.editor);
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
      const c = new Sr(l, this.editor, i, i || o ? t : null);
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
}, Fw = `.ProseMirror {
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
function zw(n, e, t) {
  const r = document.querySelector("style[data-tiptap-style]");
  if (r !== null)
    return r;
  const i = document.createElement("style");
  return e && i.setAttribute("nonce", e), i.setAttribute("data-tiptap-style", ""), i.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(i), i;
}
var Vw = class extends Mw {
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
      getUpdatedPosition: sh,
      createMappablePosition: sw
    }, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.on("mount", this.options.onMount), this.on("unmount", this.options.onUnmount), this.on("contentError", this.options.onContentError), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), this.on("drop", ({ event: i, slice: s, moved: o }) => this.options.onDrop(i, s, o)), this.on("paste", ({ event: i, slice: s }) => this.options.onPaste(i, s)), this.on("delete", this.options.onDelete);
    const t = this.createDoc(), r = Jf(t, this.options.autofocus);
    this.editorState = jn.create({
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
    this.options.injectCSS && typeof document < "u" && (this.css = zw(Fw, this.options.injectNonce));
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
    const r = Qf(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
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
      hh,
      ch.configure({
        blockSeparator: (t = (e = this.options.coreExtensionOptions) == null ? void 0 : e.clipboardTextSerializer) == null ? void 0 : t.blockSeparator
      }),
      uh,
      mh,
      gh,
      vh,
      fh,
      yh,
      dh,
      bh.configure({
        direction: this.options.textDirection
      })
    ].filter((s) => typeof this.options.enableCoreExtensions == "object" ? this.options.enableCoreExtensions[s.name] !== !1 : !0) : [], ...this.options.extensions].filter((s) => ["extension", "node", "mark"].includes(s?.type));
    this.extensionManager = new Ds(i, this);
  }
  /**
   * Creates an command manager.
   */
  createCommandManager() {
    this.commandManager = new As({
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
      e = oa(this.options.content, this.schema, this.options.parseOptions, {
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
      }), e = oa(this.options.content, this.schema, this.options.parseOptions, {
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
    this.editorView = new Wf(e, {
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
    return Z0(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return iw(this.state, r, i);
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
    return il(this.state.doc.content, this.schema);
  }
  /**
   * Get the document as text.
   */
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return G0(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...rh(this.schema),
        ...r
      }
    });
  }
  /**
   * Check if there is no content.
   */
  get isEmpty() {
    return ol(this.state.doc);
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
    return new Bw(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}, qw = {};
el(qw, {
  createAtomBlockMarkdownSpec: () => Ww,
  createBlockMarkdownSpec: () => Uw,
  createInlineMarkdownSpec: () => Kw,
  parseAttributes: () => cl,
  parseIndentedBlocks: () => Jw,
  renderNestedMarkdownContent: () => Xw,
  serializeAttributes: () => ul
});
function cl(n) {
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
function ul(n) {
  if (!n || Object.keys(n).length === 0)
    return "";
  const e = [];
  return n.class && String(n.class).split(/\s+/).filter(Boolean).forEach((r) => e.push(`.${r}`)), n.id && e.push(`#${n.id}`), Object.entries(n).forEach(([t, r]) => {
    t === "class" || t === "id" || (r === !0 ? e.push(t) : r !== !1 && r != null && e.push(`${t}="${String(r)}"`));
  }), e.join(" ");
}
function Ww(n) {
  const {
    nodeName: e,
    name: t,
    parseAttributes: r = cl,
    serializeAttributes: i = ul,
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
        if (!o.find((S) => !(S in g)))
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
function Uw(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = cl,
    serializeAttributes: s = ul,
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
        const [y, S = ""] = g, x = i(S);
        let b = 1;
        const k = y.length;
        let C = "";
        const w = /^:::([\w-]*)(\s.*)?/gm, E = d.slice(k);
        for (w.lastIndex = 0; ; ) {
          const T = w.exec(E);
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
                if (a === "block")
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
                attributes: x,
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
function Hw(n) {
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
function jw(n) {
  return Object.entries(n).filter(([, e]) => e != null).map(([e, t]) => `${e}="${t}"`).join(" ");
}
function Kw(n) {
  const {
    nodeName: e,
    name: t,
    getContent: r,
    parseAttributes: i = Hw,
    serializeAttributes: s = jw,
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
        let y = "", S = "";
        if (a) {
          const [, b] = g;
          S = b;
        } else {
          const [, b, k] = g;
          S = b, y = k || "";
        }
        const x = i(S.trim());
        return {
          type: e,
          raw: g[0],
          content: y.trim(),
          attributes: x
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
function Jw(n, e, t) {
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
      const k = a[u];
      if (k.trim() === "") {
        const w = a.slice(u + 1).findIndex((M) => M.trim() !== "");
        if (w === -1)
          break;
        if ((((i = (r = a[u + 1 + w].match(/^(\s*)/)) == null ? void 0 : r[1]) == null ? void 0 : i.length) || 0) > m) {
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
    let S;
    const x = y.slice(1);
    if (x.length > 0) {
      const k = x.map((C) => C.slice(m + d)).join(`
`);
      k.trim() && (e.customNestedParser ? S = e.customNestedParser(k) : S = t.blockTokens(k));
    }
    const b = e.createToken(p, S);
    l.push(b);
  }
  if (l.length !== 0)
    return {
      items: l,
      raw: c
    };
}
function Xw(n, e, t, r) {
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
function Yw(n, e, t = {}) {
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
var dl = class wh extends ll {
  constructor() {
    super(...arguments), this.type = "node";
  }
  /**
   * Create a new Node instance
   * @param config - Node configuration object or a function that returns a configuration object
   */
  static create(e = {}) {
    const t = typeof e == "function" ? e() : e;
    return new wh(t);
  }
  configure(e) {
    return super.configure(e);
  }
  extend(e) {
    const t = typeof e == "function" ? e() : e;
    return super.extend(t);
  }
}, Gw = class {
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
      const S = this.dom.getBoundingClientRect(), x = u.getBoundingClientRect(), b = (i = n.offsetX) != null ? i : (r = n.nativeEvent) == null ? void 0 : r.offsetX, k = (o = n.offsetY) != null ? o : (s = n.nativeEvent) == null ? void 0 : s.offsetY;
      d = x.x - S.x + b, f = x.y - S.y + k;
    }
    const h = this.dom.cloneNode(!0);
    try {
      const S = this.dom.getBoundingClientRect();
      h.style.width = `${Math.round(S.width)}px`, h.style.height = `${Math.round(S.height)}px`, h.style.boxSizing = "border-box", h.style.pointerEvents = "none";
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
    const g = H.create(l.state.doc, m), y = l.state.tr.setSelection(g);
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
    const { isEditable: a } = this.editor, { isDragging: l } = this, c = !!this.node.type.spec.draggable, u = H.isSelectable(this.node), d = n.type === "copy", f = n.type === "paste", h = n.type === "cut", p = n.type === "mousedown";
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
    return !this.dom || !this.contentDOM ? !0 : typeof this.options.ignoreMutation == "function" ? this.options.ignoreMutation({ mutation: n }) : this.node.isLeaf || this.node.isAtom ? !0 : n.type === "selection" || this.dom.contains(n.target) && n.type === "childList" && (Ur() || sa()) && this.editor.isFocused && [...Array.from(n.addedNodes), ...Array.from(n.removedNodes)].every((t) => t.isContentEditable) ? !1 : this.contentDOM === n.target && n.type === "attributes" ? !0 : !this.contentDOM.contains(n.target);
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
function ru(n) {
  return Zu((e, t) => ({
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
var Qw = class extends Vw {
  constructor(n = {}) {
    return super(n), this.contentComponent = null, this.appContext = null, this.reactiveState = ru(this.view.state), this.reactiveExtensionStorage = ru(this.extensionStorage), this.on("beforeTransaction", ({ nextState: e }) => {
      this.reactiveState.value = e, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), Pa(this);
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
}, Zw = B({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = D(), t = tn();
    return Je(() => {
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
    }), An(() => {
      const r = n.editor;
      r && (r.contentComponent = null, r.appContext = null);
    }), { rootEl: e };
  },
  render() {
    return Ue("div", {
      ref: (n) => {
        this.rootEl = n;
      }
    });
  }
}), eS = B({
  name: "NodeViewContent",
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return Ue(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
}), tS = B({
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
    return Ue(
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
}), nS = class {
  constructor(n, { props: e = {}, editor: t }) {
    this.destroyed = !1, this.editor = t, this.component = Pa(n), this.el = document.createElement("div"), this.props = _a(e), this.renderedComponent = this.renderComponent();
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
    let n = Ue(this.component, this.props);
    return this.editor.appContext && (n.appContext = this.editor.appContext), typeof document < "u" && this.el && Fl(n, this.el), { vNode: n, destroy: () => {
      this.el && Fl(null, this.el), this.el = null, n = null;
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
    return Ue(this.as, {
      style: {
        whiteSpace: "inherit"
      },
      "data-mark-view-content": ""
    });
  }
});
var rS = class extends Gw {
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
        return Qn("onDragStart", e), Qn("decorationClasses", this.decorationClasses), (s = (i = this.component).setup) == null ? void 0 : s.call(i, r, {
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
    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this), this.editor.on("selectionUpdate", this.handleSelectionUpdate), this.renderer = new nS(t, {
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
function iS(n, e) {
  return (t) => {
    if (!t.editor.contentComponent)
      return {};
    const r = typeof n == "function" && "__vccOpts" in n ? n.__vccOpts : n;
    return new rS(r, t, e);
  };
}
const sS = { class: "transcription-panel" }, oS = {
  ref: "scrollContainer",
  class: "scroll-container"
}, aS = { class: "turns-container" }, lS = {
  key: 0,
  class: "history-loading",
  role: "status"
}, cS = {
  key: 1,
  class: "history-start"
}, uS = /* @__PURE__ */ B({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = kt(), r = Lt(), i = Lr("scrollContainer"), s = O(() => {
      const w = r.live?.partial.value ?? null;
      return w === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: w,
        words: [],
        language: r.activeChannel.value?.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), o = O(() => r.transcriptionEditor?.tiptapEditor.value), a = O(() => r.live?.hasLiveUpdate.value ?? !1), l = O(() => r.audio?.isPlaying.value ?? !1), c = O(
      () => r.activeChannel.value?.activeTranslation.value
    ), u = O(() => r.activeChannel.value), d = O(
      () => u.value?.isLoadingHistory.value ?? !1
    ), f = O(() => u.value?.hasMoreHistory.value ?? !1), { isFollowing: h, resumeFollow: p } = Hg(i), { scrollRef: m, contentRef: g, isAtBottom: y, scrollToBottom: S } = Eg();
    ve(() => {
      m.value = i.value, g.value = i.value?.querySelector(".turns-container") ?? null;
    });
    const x = O(
      () => !h.value && l.value || !y.value && a.value
    );
    function b() {
      l.value ? p() : S();
    }
    const k = qm(() => {
      const w = u.value;
      if (!w?.hasMoreHistory.value || w.isLoadingHistory.value || e.turns.length === 0) return;
      const E = c.value;
      E && r.emit("scroll:top", { translationId: E.id });
    }, 500);
    function C() {
      const w = i.value;
      w && w.scrollTop < 100 && k();
    }
    return te(
      () => e.turns,
      (w, E) => {
        const T = w.length, M = E.length;
        if (T > M && !y.value && w[0]?.id != E[0]?.id) {
          const I = T - M, R = e.turns[I]?.id;
          if (!R || !m.value) return;
          ye(() => {
            m.value?.querySelector(
              `[data-turn-id="${R}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), ve(() => {
      i.value?.addEventListener("scroll", C, {
        passive: !0
      });
    }), An(() => {
      i.value?.removeEventListener("scroll", C);
    }), (w, E) => (A(), K("article", sS, [
      J("div", oS, [
        J("div", aS, [
          d.value ? (A(), K("div", lS, [...E[0] || (E[0] = [
            J("progress", null, null, -1)
          ])])) : ee("", !0),
          !f.value && n.turns.length > 0 ? (A(), K("div", cS, re(v(t)("transcription.historyStart")), 1)) : ee("", !0),
          n.turns.length === 0 && !d.value && !s.value ? (A(), z(Wg, {
            key: 2,
            class: "transcription-empty"
          })) : ee("", !0),
          o.value ? (A(), z(v(Zw), {
            key: 3,
            editor: o.value
          }, null, 8, ["editor"])) : (A(!0), K(it, { key: 4 }, Dn(n.turns, (T, M) => (A(), z(Jl, {
            "data-turn-id": T.id,
            key: T.id,
            turn: T,
            speaker: T.speakerId ? n.speakers.get(T.speakerId) : void 0,
            live: a.value && !s.value && M === n.turns.length - 1
          }, null, 8, ["data-turn-id", "turn", "speaker", "live"]))), 128)),
          s.value ? (A(), z(Jl, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : ee("", !0)
        ]),
        F(dm, { name: "fade-slide" }, {
          default: N(() => [
            x.value ? (A(), z(mt, {
              key: 0,
              size: "sm",
              class: "resume-scroll-btn",
              "aria-label": v(t)("transcription.resumeScroll"),
              onClick: b
            }, {
              icon: N(() => [
                F(v(Gm), { size: 14 })
              ]),
              default: N(() => [
                Ke(" " + re(v(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : ee("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), dS = /* @__PURE__ */ Oe(uS, [["__scopeId", "data-v-13e13590"]]), fS = { class: "switch" }, hS = ["id", "checked"], pS = ["for"], mS = /* @__PURE__ */ B({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? fm();
    return (s, o) => (A(), K("div", fS, [
      J("input", {
        type: "checkbox",
        id: v(i),
        checked: n.modelValue,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, hS),
      J("label", { for: v(i) }, [...o[1] || (o[1] = [
        J("div", { class: "switch-slider" }, null, -1)
      ])], 8, pS)
    ]));
  }
}), gS = /* @__PURE__ */ Oe(mS, [["__scopeId", "data-v-2aa0332f"]]), yS = "(max-width: 767px)";
function Sh() {
  const n = D(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return ve(() => {
    e = window.matchMedia(yS), n.value = e.matches, e.addEventListener("change", t);
  }), An(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
function iu(n) {
  return typeof n == "string" ? `'${n}'` : new vS().serialize(n);
}
const vS = /* @__PURE__ */ (function() {
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
function is(n, e) {
  return n === e || iu(n) === iu(e);
}
function bS(n, e, t) {
  const r = n.findIndex((a) => is(a, e)), i = n.findIndex((a) => is(a, t));
  if (r === -1 || i === -1) return [];
  const [s, o] = [r, i].sort((a, l) => a - l);
  return n.slice(s, o + 1);
}
function su(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function Ct(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = bs(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Qn(r, o), o)];
}
function at() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Ps(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function la(n) {
  return n == null;
}
function fl(n) {
  return n ? n.flatMap((e) => e.type === it ? fl(e.children) : [e]) : [];
}
const [_s] = Ct("ConfigProvider");
function wS(n, e) {
  var t;
  const r = Sn();
  return Je(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), hm(r);
}
function Ns(n, e) {
  return ed() ? (td(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function So() {
  const n = /* @__PURE__ */ new Set(), e = (s) => {
    n.delete(s);
  };
  return {
    on: (s) => {
      n.add(s);
      const o = () => e(s);
      return Ns(o), { off: o };
    },
    off: e,
    trigger: (...s) => Promise.all(Array.from(n).map((o) => o(...s))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function SS(n) {
  let e = !1, t;
  const r = nd(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Ft = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const xS = (n) => typeof n < "u", kS = Object.prototype.toString, CS = (n) => kS.call(n) === "[object Object]", ou = /* @__PURE__ */ TS();
function TS() {
  var n, e, t;
  return Ft && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function xo(n) {
  return Array.isArray(n) ? n : [n];
}
function ES(n) {
  return tn();
}
// @__NO_SIDE_EFFECTS__
function MS(n) {
  if (!Ft) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = nd(!0), t = r.run(() => n(...s))), Ns(i), t));
}
function xh(n, e = 1e4) {
  return Zu((t, r) => {
    let i = Le(n), s;
    const o = () => setTimeout(() => {
      i = Le(n), r();
    }, Le(e));
    return Ns(() => {
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
function AS(n, e) {
  ES() && An(n, e);
}
function OS(n, e, t) {
  return te(n, e, {
    ...t,
    immediate: !0
  });
}
const Is = Ft ? window : void 0;
function St(n) {
  var e;
  const t = Le(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function kh(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = O(() => {
    const r = xo(Le(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return OS(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => St(s))) !== null && r !== void 0 ? r : [Is].filter((s) => s != null),
      xo(Le(t.value ? n[1] : n[0])),
      xo(v(t.value ? n[2] : n[1])),
      Le(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, l) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const c = CS(o) ? { ...o } : o, u = r.flatMap((d) => i.flatMap((f) => s.map((h) => e(d, f, h, c))));
    l(() => {
      u.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Ch() {
  const n = Sn(!1), e = tn();
  return e && ve(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function DS(n) {
  const e = /* @__PURE__ */ Ch();
  return O(() => (e.value, !!n()));
}
function PS(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function _S(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = Is, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, l = PS(e);
  return kh(i, s, (u) => {
    u.repeat && Le(a) || l(u) && t(u);
  }, o);
}
function NS(n) {
  return JSON.parse(JSON.stringify(n));
}
function IS(n, e, t = {}) {
  const { window: r = Is, ...i } = t;
  let s;
  const o = /* @__PURE__ */ DS(() => r && "ResizeObserver" in r), a = () => {
    s && (s.disconnect(), s = void 0);
  }, l = te(O(() => {
    const u = Le(n);
    return Array.isArray(u) ? u.map((d) => St(d)) : [St(u)];
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
  return Ns(c), {
    isSupported: o,
    stop: c
  };
}
// @__NO_SIDE_EFFECTS__
function ss(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: l, deep: c = !1, defaultValue: u, shouldEmit: d } = r, f = tn(), h = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let p = l;
  e || (e = "modelValue"), p = p || `update:${e.toString()}`;
  const m = (S) => o ? typeof o == "function" ? o(S) : NS(S) : S, g = () => xS(n[e]) ? m(n[e]) : u, y = (S) => {
    d ? d(S) && h(p, S) : h(p, S);
  };
  if (a) {
    const S = D(g());
    let x = !1;
    return te(() => n[e], (b) => {
      x || (x = !0, S.value = m(b), ye(() => x = !1));
    }), te(S, (b) => {
      !x && (b !== n[e] || c) && y(b);
    }, { deep: c }), S;
  } else return O({
    get() {
      return g();
    },
    set(S) {
      y(S);
    }
  });
}
function ko(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function ca(n, e, t = ".", r) {
  if (!ko(e))
    return ca(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : ko(o) && ko(i[s]) ? i[s] = ca(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function RS(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => ca(t, r, "", n), {})
  );
}
const $S = RS(), LS = /* @__PURE__ */ MS(() => {
  const n = D(/* @__PURE__ */ new Map()), e = D(), t = O(() => {
    for (const o of n.value.values()) if (o) return !0;
    return !1;
  }), r = _s({ scrollBody: D(!0) });
  let i = null;
  const s = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", ou && i?.(), e.value = void 0;
  };
  return te(t, (o, a) => {
    if (!Ft) return;
    if (!o) {
      a && s();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, c = {
      padding: l,
      margin: 0
    }, u = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? $S({
      padding: r.scrollBody.value.padding === !0 ? l : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? l : r.scrollBody.value.margin
    }, c) : c : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof u.padding == "number" ? `${u.padding}px` : String(u.padding), document.body.style.marginRight = typeof u.margin == "number" ? `${u.margin}px` : String(u.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), ou && (i = kh(document, "touchmove", (d) => BS(d), { passive: !1 })), ye(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function Th(n) {
  const e = Math.random().toString(36).substring(2, 7), t = LS();
  t.value.set(e, n ?? !1);
  const r = O({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return AS(() => {
    t.value.delete(e);
  }), r;
}
function Eh(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : Eh(t);
  }
}
function BS(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && Eh(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Mh(n) {
  const e = _s({ dir: D("ltr") });
  return O(() => n?.value || e.dir?.value || "ltr");
}
function Rs(n) {
  const e = tn(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[pm(rd(i))] = (...s) => n(i, ...s);
  }), r;
}
let Co = 0;
function FS() {
  Je((n) => {
    if (!Ft) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? au()), document.body.insertAdjacentElement("beforeend", e[1] ?? au()), Co++, n(() => {
      Co === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Co--;
    });
  });
}
function au() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Ah(n) {
  return O(() => Le(n) ? !!St(n)?.closest("form") : !0);
}
function me() {
  const n = tn(), e = D(), t = O(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : St(e)), r = Object.assign({}, n.exposed), i = {};
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
function hl(n) {
  const e = tn(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Oi(n);
  return O(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[rd(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function zS(n, e) {
  const t = hl(n), r = e ? Rs(e) : {};
  return O(() => ({
    ...t.value,
    ...r
  }));
}
var VS = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, zn = /* @__PURE__ */ new WeakMap(), xi = /* @__PURE__ */ new WeakMap(), ki = {}, To = 0, Oh = function(n) {
  return n && (n.host || Oh(n.parentNode));
}, qS = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = Oh(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, WS = function(n, e, t, r) {
  var i = qS(e, Array.isArray(n) ? n : [n]);
  ki[t] || (ki[t] = /* @__PURE__ */ new WeakMap());
  var s = ki[t], o = [], a = /* @__PURE__ */ new Set(), l = new Set(i), c = function(d) {
    !d || a.has(d) || (a.add(d), c(d.parentNode));
  };
  i.forEach(c);
  var u = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        u(f);
      else
        try {
          var h = f.getAttribute(r), p = h !== null && h !== "false", m = (zn.get(f) || 0) + 1, g = (s.get(f) || 0) + 1;
          zn.set(f, m), s.set(f, g), o.push(f), m === 1 && p && xi.set(f, !0), g === 1 && f.setAttribute(t, "true"), p || f.setAttribute(r, "true");
        } catch (y) {
          console.error("aria-hidden: cannot operate on ", f, y);
        }
    });
  };
  return u(e), a.clear(), To++, function() {
    o.forEach(function(d) {
      var f = zn.get(d) - 1, h = s.get(d) - 1;
      zn.set(d, f), s.set(d, h), f || (xi.has(d) || d.removeAttribute(r), xi.delete(d)), h || d.removeAttribute(t);
    }), To--, To || (zn = /* @__PURE__ */ new WeakMap(), zn = /* @__PURE__ */ new WeakMap(), xi = /* @__PURE__ */ new WeakMap(), ki = {});
  };
}, US = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = VS(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), WS(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function Dh(n) {
  let e;
  te(() => St(n), (t) => {
    t ? e = US(t) : e && e();
  }), ai(() => {
    e && e();
  });
}
let HS = 0;
function Kr(n, e = "reka") {
  if ("useId" in Bl) return `${e}-${Bl.useId?.()}`;
  const t = _s({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++HS}`;
}
function jS() {
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
function KS(n) {
  const e = D(), t = O(() => e.value?.width ?? 0), r = O(() => e.value?.height ?? 0);
  return ve(() => {
    const i = St(n);
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
function JS(n, e) {
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
function pl(n) {
  const e = xh("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = at(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), l = a.find((f) => f.ref === o), c = a.map((f) => f.textValue), u = YS(c, e.value, l?.textValue), d = a.find((f) => f.textValue === u);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function XS(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function YS(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((c) => c === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = XS(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((c) => c !== t));
  const l = o.find((c) => c.toLowerCase().startsWith(i.toLowerCase()));
  return l !== t ? l : void 0;
}
function GS(n, e) {
  const t = D({}), r = D("none"), i = D(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Is, { state: l, dispatch: c } = JS(s, {
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
    if (Ft) {
      const y = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(y);
    }
  };
  te(n, async (g, y) => {
    const S = y !== g;
    if (await ye(), S) {
      const x = r.value, b = Ci(e.value);
      g ? (c("MOUNT"), u("enter"), b === "none" && u("after-enter")) : b === "none" || b === "undefined" || t.value?.display === "none" ? (c("UNMOUNT"), u("leave"), u("after-leave")) : y && x !== b ? (c("ANIMATION_OUT"), u("leave")) : (c("UNMOUNT"), u("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const y = Ci(e.value), S = y.includes(CSS.escape(g.animationName)), x = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && S && (u(`after-${x}`), c("ANIMATION_END"), !i.value)) {
      const b = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = b);
      });
    }
    g.target === e.value && y === "none" && c("ANIMATION_END");
  }, f = (g) => {
    g.target === e.value && (r.value = Ci(e.value));
  }, h = te(e, (g, y) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", f), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (c("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), y?.removeEventListener("animationstart", f), y?.removeEventListener("animationcancel", d), y?.removeEventListener("animationend", d));
  }, { immediate: !0 }), p = te(l, () => {
    const g = Ci(e.value);
    r.value = l.value === "mounted" ? g : "none";
  });
  return ai(() => {
    h(), p();
  }), { isPresent: O(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Ci(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var ml = B({
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
    const { present: r, forceMount: i } = cr(n), s = D(), { isPresent: o } = GS(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = fl(a || []);
    const l = tn();
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
    return () => i.value || r.value || o.value ? Ue(e.default({ present: o.value })[0], { ref: (c) => {
      const u = St(c);
      return typeof u?.hasAttribute > "u" || (u?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = u.firstElementChild : s.value = u), u;
    } }) : null;
  }
});
const ua = B({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = fl(t.default()), i = r.findIndex((l) => l.type !== mm);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? ce(e, s.props) : e, a = gm({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), QS = [
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
    return typeof r == "string" && QS.includes(r) ? () => Ue(r, e) : r !== "template" ? () => Ue(n.as, e, { default: t.default }) : () => Ue(ua, e, { default: t.default });
  }
});
function as() {
  const n = D(), e = O(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : St(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [rn, ZS] = Ct("DialogRoot");
var ex = /* @__PURE__ */ B({
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
    const t = n, i = /* @__PURE__ */ ss(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = D(), o = D(), { modal: a } = cr(t);
    return ZS({
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
    }), (l, c) => G(l.$slots, "default", {
      open: v(i),
      close: () => i.value = !1
    });
  }
}), Ph = ex, tx = /* @__PURE__ */ B({
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
    const t = rn();
    return (r, i) => (A(), z(v(he), ce(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => v(t).onOpenChange(!1))
    }), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), nx = tx;
const rx = "dismissableLayer.pointerDownOutside", ix = "dismissableLayer.focusOutside";
function _h(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function sx(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1), s = D(() => {
  });
  return Je((o) => {
    if (!Ft || !Le(t)) return;
    const a = async (c) => {
      const u = c.target;
      if (!(!e?.value || !u)) {
        if (_h(e.value, u)) {
          i.value = !1;
          return;
        }
        if (c.target && !i.value) {
          let f = function() {
            Ps(rx, n, d);
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
    Le(t) && (i.value = !0);
  } };
}
function ox(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = D(!1);
  return Je((s) => {
    if (!Ft || !Le(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await ye(), await ye();
      const l = a.target;
      !e.value || !l || _h(e.value, l) || a.target && !i.value && Ps(ix, n, { originalEvent: a });
    };
    r.addEventListener("focusin", o), s(() => r.removeEventListener("focusin", o));
  }), {
    onFocusCapture: () => {
      Le(t) && (i.value = !0);
    },
    onBlurCapture: () => {
      Le(t) && (i.value = !1);
    }
  };
}
const tt = _a({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var ax = /* @__PURE__ */ B({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = me(), o = O(() => s.value?.ownerDocument ?? globalThis.document), a = O(() => tt.layersRoot), l = O(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), c = O(() => tt.layersWithOutsidePointerEventsDisabled.size > 0), u = O(() => {
      const h = Array.from(a.value), [p] = [...tt.layersWithOutsidePointerEventsDisabled].slice(-1), m = h.indexOf(p);
      return l.value >= m;
    }), d = sx(async (h) => {
      const p = [...tt.branches].some((m) => m?.contains(h.target));
      !u.value || p || (r("pointerDownOutside", h), r("interactOutside", h), await ye(), h.defaultPrevented || r("dismiss"));
    }, s), f = ox((h) => {
      [...tt.branches].some((m) => m?.contains(h.target)) || (r("focusOutside", h), r("interactOutside", h), h.defaultPrevented || r("dismiss"));
    }, s);
    return _S("Escape", (h) => {
      l.value === a.value.size - 1 && (r("escapeKeyDown", h), h.defaultPrevented || r("dismiss"));
    }), Je((h) => {
      s.value && (t.disableOutsidePointerEvents && (tt.layersWithOutsidePointerEventsDisabled.size === 0 && (tt.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), tt.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), h(() => {
        t.disableOutsidePointerEvents && tt.layersWithOutsidePointerEventsDisabled.size === 1 && !la(tt.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = tt.originalBodyPointerEvents);
      }));
    }), Je((h) => {
      h(() => {
        s.value && (a.value.delete(s.value), tt.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (h, p) => (A(), z(v(he), {
      ref: v(i),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: On({ pointerEvents: c.value ? u.value ? "auto" : "none" : void 0 }),
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
}), Nh = ax;
const lx = /* @__PURE__ */ SS(() => D([]));
function cx() {
  const n = lx();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = lu(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = lu(n.value, e), n.value[0]?.resume();
    }
  };
}
function lu(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const Eo = "focusScope.autoFocusOnMount", Mo = "focusScope.autoFocusOnUnmount", cu = {
  bubbles: !1,
  cancelable: !0
};
function ux(n, { select: e = !1 } = {}) {
  const t = at();
  for (const r of n)
    if (Vt(r, { select: e }), at() !== t) return !0;
}
function dx(n) {
  const e = Ih(n), t = uu(e, n), r = uu(e.reverse(), n);
  return [t, r];
}
function Ih(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function uu(n, e) {
  for (const t of n) if (!fx(t, { upTo: e })) return t;
}
function fx(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function hx(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Vt(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = at();
    n.focus({ preventScroll: !0 }), n !== t && hx(n) && e && n.select();
  }
}
var px = /* @__PURE__ */ B({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = me(), o = D(null), a = cx(), l = _a({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    Je((u) => {
      if (!Ft) return;
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
    }), Je(async (u) => {
      const d = s.value;
      if (await ye(), !d) return;
      a.add(l);
      const f = at();
      if (!d.contains(f)) {
        const p = new CustomEvent(Eo, cu);
        d.addEventListener(Eo, (m) => r("mountAutoFocus", m)), d.dispatchEvent(p), p.defaultPrevented || (ux(Ih(d), { select: !0 }), at() === f && Vt(d));
      }
      u(() => {
        d.removeEventListener(Eo, (g) => r("mountAutoFocus", g));
        const p = new CustomEvent(Mo, cu), m = (g) => {
          r("unmountAutoFocus", g);
        };
        d.addEventListener(Mo, m), d.dispatchEvent(p), setTimeout(() => {
          p.defaultPrevented || Vt(f ?? document.body, { select: !0 }), d.removeEventListener(Mo, m), a.remove(l);
        }, 0);
      });
    });
    function c(u) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = u.key === "Tab" && !u.altKey && !u.ctrlKey && !u.metaKey, f = at();
      if (d && f) {
        const h = u.currentTarget, [p, m] = dx(h);
        p && m ? !u.shiftKey && f === m ? (u.preventDefault(), t.loop && Vt(p, { select: !0 })) : u.shiftKey && f === p && (u.preventDefault(), t.loop && Vt(m, { select: !0 })) : f === h && u.preventDefault();
      }
    }
    return (u, d) => (A(), z(v(he), {
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
}), Rh = px;
function mx(n) {
  return n ? "open" : "closed";
}
function du(n) {
  const e = at();
  for (const t of n)
    if (t === e || (t.focus(), at() !== e)) return;
}
const gx = "DialogTitle", yx = "DialogContent";
function vx({ titleName: n = gx, contentName: e = yx, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  ve(() => {
    document.getElementById(r) || console.warn(o);
    const c = s.value?.getAttribute("aria-describedby");
    i && c && (document.getElementById(i) || console.warn(a));
  });
}
var bx = /* @__PURE__ */ B({
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
    const t = n, r = e, i = rn(), { forwardRef: s, currentElement: o } = me();
    return i.titleId ||= Kr(void 0, "reka-dialog-title"), i.descriptionId ||= Kr(void 0, "reka-dialog-description"), ve(() => {
      i.contentElement = o, at() !== document.body && (i.triggerElement.value = at());
    }), process.env.NODE_ENV !== "production" && vx({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, l) => (A(), z(v(Rh), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (c) => r("openAutoFocus", c)),
      onUnmountAutoFocus: l[6] || (l[6] = (c) => r("closeAutoFocus", c))
    }, {
      default: N(() => [F(v(Nh), ce({
        id: v(i).contentId,
        ref: v(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": v(i).descriptionId,
        "aria-labelledby": v(i).titleId,
        "data-state": v(mx)(v(i).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (c) => v(i).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (c) => r("escapeKeyDown", c)),
        onFocusOutside: l[2] || (l[2] = (c) => r("focusOutside", c)),
        onInteractOutside: l[3] || (l[3] = (c) => r("interactOutside", c)),
        onPointerDownOutside: l[4] || (l[4] = (c) => r("pointerDownOutside", c))
      }), {
        default: N(() => [G(a.$slots, "default")]),
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
}), $h = bx, wx = /* @__PURE__ */ B({
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
    const t = n, r = e, i = rn(), s = Rs(r), { forwardRef: o, currentElement: a } = me();
    return Dh(a), (l, c) => (A(), z($h, ce({
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
      default: N(() => [G(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Sx = wx, xx = /* @__PURE__ */ B({
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
    const t = n, i = Rs(e);
    me();
    const s = rn(), o = D(!1), a = D(!1);
    return (l, c) => (A(), z($h, ce({
      ...t,
      ...v(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: c[0] || (c[0] = (u) => {
        u.defaultPrevented || (o.value || v(s).triggerElement.value?.focus(), u.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: c[1] || (c[1] = (u) => {
        u.defaultPrevented || (o.value = !0, u.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = u.target;
        v(s).triggerElement.value?.contains(d) && u.preventDefault(), u.detail.originalEvent.type === "focusin" && a.value && u.preventDefault();
      })
    }), {
      default: N(() => [G(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), kx = xx, Cx = /* @__PURE__ */ B({
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
    const t = n, r = e, i = rn(), s = Rs(r), { forwardRef: o } = me();
    return (a, l) => (A(), z(v(ml), { present: a.forceMount || v(i).open.value }, {
      default: N(() => [v(i).modal.value ? (A(), z(Sx, ce({
        key: 0,
        ref: v(o)
      }, {
        ...t,
        ...v(s),
        ...a.$attrs
      }), {
        default: N(() => [G(a.$slots, "default")]),
        _: 3
      }, 16)) : (A(), z(kx, ce({
        key: 1,
        ref: v(o)
      }, {
        ...t,
        ...v(s),
        ...a.$attrs
      }), {
        default: N(() => [G(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Lh = Cx, Tx = /* @__PURE__ */ B({
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
    const e = rn();
    return Th(!0), me(), (t, r) => (A(), z(v(he), {
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
}), Ex = Tx, Mx = /* @__PURE__ */ B({
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
    const e = rn(), { forwardRef: t } = me();
    return (r, i) => v(e)?.modal.value ? (A(), z(v(ml), {
      key: 0,
      present: r.forceMount || v(e).open.value
    }, {
      default: N(() => [F(Ex, ce(r.$attrs, {
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
}), Bh = Mx, Ax = /* @__PURE__ */ B({
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
    const e = /* @__PURE__ */ Ch();
    return (t, r) => v(e) || t.forceMount ? (A(), z(id, {
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
}), Fh = Ax, Ox = /* @__PURE__ */ B({
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
    return (t, r) => (A(), z(v(Fh), Na(Ia(e)), {
      default: N(() => [G(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), zh = Ox, Dx = /* @__PURE__ */ B({
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
    const e = n, t = rn();
    return me(), (r, i) => (A(), z(v(he), ce(e, { id: v(t).titleId }), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Vh = Dx;
const fu = "data-reka-collection-item";
function sn(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const u = D(/* @__PURE__ */ new Map());
    i = {
      collectionRef: D(),
      itemMap: u
    }, Qn(r, i);
  } else i = bs(r);
  const s = (u = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${fu}]`)), p = Array.from(i.itemMap.value.values()).sort((m, g) => f.indexOf(m.ref) - f.indexOf(g.ref));
    return u ? p : p.filter((m) => m.ref.dataset.disabled !== "");
  }, o = B({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = as();
      return te(p, () => {
        i.collectionRef.value = p.value;
      }), () => Ue(ua, {
        ref: h,
        ...f
      }, d);
    }
  }), a = B({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(u, { slots: d, attrs: f }) {
      const { primitiveElement: h, currentElement: p } = as();
      return Je((m) => {
        if (p.value) {
          const g = Pa(p.value);
          i.itemMap.value.set(g, {
            ref: p.value,
            value: u.value
          }), m(() => i.itemMap.value.delete(g));
        }
      }), () => Ue(ua, {
        ...f,
        [fu]: "",
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
const Px = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function _x(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Nx(n, e, t) {
  const r = _x(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Px[r];
}
var Ix = /* @__PURE__ */ B({
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
    return (e, t) => (A(), z(v(he), {
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
}), qh = Ix, Rx = /* @__PURE__ */ B({
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
    const e = n, { primitiveElement: t, currentElement: r } = as(), i = O(() => e.checked ?? e.value);
    return te(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, l = window.HTMLInputElement.prototype, u = Object.getOwnPropertyDescriptor(l, "value").set;
      if (u && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        u.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (A(), z(qh, ce({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), hu = Rx, $x = /* @__PURE__ */ B({
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
    return (i, s) => (A(), K(it, null, [ee(" We render single input if it's required "), t.value ? (A(), z(hu, ce({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (A(!0), K(it, { key: 1 }, Dn(r.value, (o) => (A(), z(hu, ce({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Lx = $x;
const [Wh, Bx] = Ct("PopperRoot");
var Fx = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = D();
    return Bx({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => G(t.$slots, "default");
  }
}), zx = Fx, Vx = /* @__PURE__ */ B({
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
    const e = n, { forwardRef: t, currentElement: r } = me(), i = Wh();
    return sd(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (A(), z(v(he), {
      ref: v(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: N(() => [G(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), qx = Vx;
function Wx(n) {
  return n !== null;
}
function Ux(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, l = o ? 0 : n.arrowHeight, [c, u] = da(t), d = {
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
function da(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Hx = ["top", "right", "bottom", "left"], Zt = Math.min, Ge = Math.max, ls = Math.round, Ti = Math.floor, yt = (n) => ({
  x: n,
  y: n
}), jx = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Kx = {
  start: "end",
  end: "start"
};
function fa(n, e, t) {
  return Ge(n, Zt(e, t));
}
function It(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Rt(n) {
  return n.split("-")[0];
}
function dr(n) {
  return n.split("-")[1];
}
function gl(n) {
  return n === "x" ? "y" : "x";
}
function yl(n) {
  return n === "y" ? "height" : "width";
}
const Jx = /* @__PURE__ */ new Set(["top", "bottom"]);
function gt(n) {
  return Jx.has(Rt(n)) ? "y" : "x";
}
function vl(n) {
  return gl(gt(n));
}
function Xx(n, e, t) {
  t === void 0 && (t = !1);
  const r = dr(n), i = vl(n), s = yl(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = cs(o)), [o, cs(o)];
}
function Yx(n) {
  const e = cs(n);
  return [ha(n), e, ha(e)];
}
function ha(n) {
  return n.replace(/start|end/g, (e) => Kx[e]);
}
const pu = ["left", "right"], mu = ["right", "left"], Gx = ["top", "bottom"], Qx = ["bottom", "top"];
function Zx(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? mu : pu : e ? pu : mu;
    case "left":
    case "right":
      return e ? Gx : Qx;
    default:
      return [];
  }
}
function e1(n, e, t, r) {
  const i = dr(n);
  let s = Zx(Rt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(ha)))), s;
}
function cs(n) {
  return n.replace(/left|right|bottom|top/g, (e) => jx[e]);
}
function t1(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Uh(n) {
  return typeof n != "number" ? t1(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function us(n) {
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
function gu(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = gt(e), o = vl(e), a = yl(o), l = Rt(e), c = s === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
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
  switch (dr(e)) {
    case "start":
      h[o] -= f * (t && c ? -1 : 1);
      break;
    case "end":
      h[o] += f * (t && c ? -1 : 1);
      break;
  }
  return h;
}
async function n1(n, e) {
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
  } = It(e, n), p = Uh(h), g = a[f ? d === "floating" ? "reference" : "floating" : d], y = us(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(g))) == null || t ? g : g.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: c,
    rootBoundary: u,
    strategy: l
  })), S = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, x = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), b = await (s.isElement == null ? void 0 : s.isElement(x)) ? await (s.getScale == null ? void 0 : s.getScale(x)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, k = us(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: x,
    strategy: l
  }) : S);
  return {
    top: (y.top - k.top + p.top) / b.y,
    bottom: (k.bottom - y.bottom + p.bottom) / b.y,
    left: (y.left - k.left + p.left) / b.x,
    right: (k.right - y.right + p.right) / b.x
  };
}
const r1 = async (n, e, t) => {
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
  } = gu(c, r, l), f = r, h = {}, p = 0;
  for (let g = 0; g < a.length; g++) {
    var m;
    const {
      name: y,
      fn: S
    } = a[g], {
      x,
      y: b,
      data: k,
      reset: C
    } = await S({
      x: u,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: h,
      rects: c,
      platform: {
        ...o,
        detectOverflow: (m = o.detectOverflow) != null ? m : n1
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    u = x ?? u, d = b ?? d, h = {
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
    } = gu(c, f, l)), g = -1);
  }
  return {
    x: u,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: h
  };
}, i1 = (n) => ({
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
    } = It(n, e) || {};
    if (c == null)
      return {};
    const d = Uh(u), f = {
      x: t,
      y: r
    }, h = vl(i), p = yl(h), m = await o.getDimensions(c), g = h === "y", y = g ? "top" : "left", S = g ? "bottom" : "right", x = g ? "clientHeight" : "clientWidth", b = s.reference[p] + s.reference[h] - f[h] - s.floating[p], k = f[h] - s.reference[h], C = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c));
    let w = C ? C[x] : 0;
    (!w || !await (o.isElement == null ? void 0 : o.isElement(C))) && (w = a.floating[x] || s.floating[p]);
    const E = b / 2 - k / 2, T = w / 2 - m[p] / 2 - 1, M = Zt(d[y], T), I = Zt(d[S], T), R = M, q = w - m[p] - I, _ = w / 2 - m[p] / 2 + E, $ = fa(R, _, q), ne = !l.arrow && dr(i) != null && _ !== $ && s.reference[p] / 2 - (_ < R ? M : I) - m[p] / 2 < 0, X = ne ? _ < R ? _ - R : _ - q : 0;
    return {
      [h]: f[h] + X,
      data: {
        [h]: $,
        centerOffset: _ - $ - X,
        ...ne && {
          alignmentOffset: X
        }
      },
      reset: ne
    };
  }
}), s1 = function(n) {
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
      } = It(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const y = Rt(i), S = gt(a), x = Rt(a) === a, b = await (l.isRTL == null ? void 0 : l.isRTL(c.floating)), k = f || (x || !m ? [cs(a)] : Yx(a)), C = p !== "none";
      !f && C && k.push(...e1(a, m, p, b));
      const w = [a, ...k], E = await l.detectOverflow(e, g), T = [];
      let M = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (u && T.push(E[y]), d) {
        const _ = Xx(i, o, b);
        T.push(E[_[0]], E[_[1]]);
      }
      if (M = [...M, {
        placement: i,
        overflows: T
      }], !T.every((_) => _ <= 0)) {
        var I, R;
        const _ = (((I = s.flip) == null ? void 0 : I.index) || 0) + 1, $ = w[_];
        if ($ && (!(d === "alignment" ? S !== gt($) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((ie) => gt(ie.placement) === S ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: _,
              overflows: M
            },
            reset: {
              placement: $
            }
          };
        let ne = (R = M.filter((X) => X.overflows[0] <= 0).sort((X, ie) => X.overflows[1] - ie.overflows[1])[0]) == null ? void 0 : R.placement;
        if (!ne)
          switch (h) {
            case "bestFit": {
              var q;
              const X = (q = M.filter((ie) => {
                if (C) {
                  const de = gt(ie.placement);
                  return de === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  de === "y";
                }
                return !0;
              }).map((ie) => [ie.placement, ie.overflows.filter((de) => de > 0).reduce((de, Ve) => de + Ve, 0)]).sort((ie, de) => ie[1] - de[1])[0]) == null ? void 0 : q[0];
              X && (ne = X);
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
function yu(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function vu(n) {
  return Hx.some((e) => n[e] >= 0);
}
const o1 = function(n) {
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
      } = It(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = yu(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: vu(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = yu(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: vu(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Hh = /* @__PURE__ */ new Set(["left", "top"]);
async function a1(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Rt(t), a = dr(t), l = gt(t) === "y", c = Hh.has(o) ? -1 : 1, u = s && l ? -1 : 1, d = It(e, n);
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
const l1 = function(n) {
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
      } = e, l = await a1(e, n);
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
}, c1 = function(n) {
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
              x: S,
              y: x
            } = y;
            return {
              x: S,
              y: x
            };
          }
        },
        ...c
      } = It(n, e), u = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, c), f = gt(Rt(i)), h = gl(f);
      let p = u[h], m = u[f];
      if (o) {
        const y = h === "y" ? "top" : "left", S = h === "y" ? "bottom" : "right", x = p + d[y], b = p - d[S];
        p = fa(x, p, b);
      }
      if (a) {
        const y = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", x = m + d[y], b = m - d[S];
        m = fa(x, m, b);
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
}, u1 = function(n) {
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
      } = It(n, e), u = {
        x: t,
        y: r
      }, d = gt(i), f = gl(d);
      let h = u[f], p = u[d];
      const m = It(a, e), g = typeof m == "number" ? {
        mainAxis: m,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...m
      };
      if (l) {
        const x = f === "y" ? "height" : "width", b = s.reference[f] - s.floating[x] + g.mainAxis, k = s.reference[f] + s.reference[x] - g.mainAxis;
        h < b ? h = b : h > k && (h = k);
      }
      if (c) {
        var y, S;
        const x = f === "y" ? "width" : "height", b = Hh.has(Rt(i)), k = s.reference[d] - s.floating[x] + (b && ((y = o.offset) == null ? void 0 : y[d]) || 0) + (b ? 0 : g.crossAxis), C = s.reference[d] + s.reference[x] + (b ? 0 : ((S = o.offset) == null ? void 0 : S[d]) || 0) - (b ? g.crossAxis : 0);
        p < k ? p = k : p > C && (p = C);
      }
      return {
        [f]: h,
        [d]: p
      };
    }
  };
}, d1 = function(n) {
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
      } = It(n, e), u = await o.detectOverflow(e, c), d = Rt(i), f = dr(i), h = gt(i) === "y", {
        width: p,
        height: m
      } = s.floating;
      let g, y;
      d === "top" || d === "bottom" ? (g = d, y = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (y = d, g = f === "end" ? "top" : "bottom");
      const S = m - u.top - u.bottom, x = p - u.left - u.right, b = Zt(m - u[g], S), k = Zt(p - u[y], x), C = !e.middlewareData.shift;
      let w = b, E = k;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (E = x), (r = e.middlewareData.shift) != null && r.enabled.y && (w = S), C && !f) {
        const M = Ge(u.left, 0), I = Ge(u.right, 0), R = Ge(u.top, 0), q = Ge(u.bottom, 0);
        h ? E = p - 2 * (M !== 0 || I !== 0 ? M + I : Ge(u.left, u.right)) : w = m - 2 * (R !== 0 || q !== 0 ? R + q : Ge(u.top, u.bottom));
      }
      await l({
        ...e,
        availableWidth: E,
        availableHeight: w
      });
      const T = await o.getDimensions(a.floating);
      return p !== T.width || m !== T.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function $s() {
  return typeof window < "u";
}
function Nn(n) {
  return bl(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Ze(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Tt(n) {
  var e;
  return (e = (bl(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function bl(n) {
  return $s() ? n instanceof Node || n instanceof Ze(n).Node : !1;
}
function dt(n) {
  return $s() ? n instanceof Element || n instanceof Ze(n).Element : !1;
}
function xt(n) {
  return $s() ? n instanceof HTMLElement || n instanceof Ze(n).HTMLElement : !1;
}
function bu(n) {
  return !$s() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof Ze(n).ShadowRoot;
}
const f1 = /* @__PURE__ */ new Set(["inline", "contents"]);
function di(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = ft(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !f1.has(i);
}
const h1 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function p1(n) {
  return h1.has(Nn(n));
}
const m1 = [":popover-open", ":modal"];
function Ls(n) {
  return m1.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const g1 = ["transform", "translate", "scale", "rotate", "perspective"], y1 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], v1 = ["paint", "layout", "strict", "content"];
function wl(n) {
  const e = Sl(), t = dt(n) ? ft(n) : n;
  return g1.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || y1.some((r) => (t.willChange || "").includes(r)) || v1.some((r) => (t.contain || "").includes(r));
}
function b1(n) {
  let e = en(n);
  for (; xt(e) && !ir(e); ) {
    if (wl(e))
      return e;
    if (Ls(e))
      return null;
    e = en(e);
  }
  return null;
}
function Sl() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const w1 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function ir(n) {
  return w1.has(Nn(n));
}
function ft(n) {
  return Ze(n).getComputedStyle(n);
}
function Bs(n) {
  return dt(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function en(n) {
  if (Nn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    bu(n) && n.host || // Fallback.
    Tt(n)
  );
  return bu(e) ? e.host : e;
}
function jh(n) {
  const e = en(n);
  return ir(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : xt(e) && di(e) ? e : jh(e);
}
function Jr(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = jh(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = Ze(i);
  if (s) {
    const a = pa(o);
    return e.concat(o, o.visualViewport || [], di(i) ? i : [], a && t ? Jr(a) : []);
  }
  return e.concat(i, Jr(i, [], t));
}
function pa(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function Kh(n) {
  const e = ft(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = xt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = ls(t) !== s || ls(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function xl(n) {
  return dt(n) ? n : n.contextElement;
}
function Xn(n) {
  const e = xl(n);
  if (!xt(e))
    return yt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = Kh(e);
  let o = (s ? ls(t.width) : t.width) / r, a = (s ? ls(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const S1 = /* @__PURE__ */ yt(0);
function Jh(n) {
  const e = Ze(n);
  return !Sl() || !e.visualViewport ? S1 : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function x1(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== Ze(n) ? !1 : e;
}
function En(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = xl(n);
  let o = yt(1);
  e && (r ? dt(r) && (o = Xn(r)) : o = Xn(n));
  const a = x1(s, t, r) ? Jh(s) : yt(0);
  let l = (i.left + a.x) / o.x, c = (i.top + a.y) / o.y, u = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = Ze(s), h = r && dt(r) ? Ze(r) : r;
    let p = f, m = pa(p);
    for (; m && r && h !== p; ) {
      const g = Xn(m), y = m.getBoundingClientRect(), S = ft(m), x = y.left + (m.clientLeft + parseFloat(S.paddingLeft)) * g.x, b = y.top + (m.clientTop + parseFloat(S.paddingTop)) * g.y;
      l *= g.x, c *= g.y, u *= g.x, d *= g.y, l += x, c += b, p = Ze(m), m = pa(p);
    }
  }
  return us({
    width: u,
    height: d,
    x: l,
    y: c
  });
}
function Fs(n, e) {
  const t = Bs(n).scrollLeft;
  return e ? e.left + t : En(Tt(n)).left + t;
}
function Xh(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Fs(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function k1(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = Tt(r), a = e ? Ls(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = yt(1);
  const u = yt(0), d = xt(r);
  if ((d || !d && !s) && ((Nn(r) !== "body" || di(o)) && (l = Bs(r)), xt(r))) {
    const h = En(r);
    c = Xn(r), u.x = h.x + r.clientLeft, u.y = h.y + r.clientTop;
  }
  const f = o && !d && !s ? Xh(o, l) : yt(0);
  return {
    width: t.width * c.x,
    height: t.height * c.y,
    x: t.x * c.x - l.scrollLeft * c.x + u.x + f.x,
    y: t.y * c.y - l.scrollTop * c.y + u.y + f.y
  };
}
function C1(n) {
  return Array.from(n.getClientRects());
}
function T1(n) {
  const e = Tt(n), t = Bs(n), r = n.ownerDocument.body, i = Ge(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = Ge(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Fs(n);
  const a = -t.scrollTop;
  return ft(r).direction === "rtl" && (o += Ge(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const wu = 25;
function E1(n, e) {
  const t = Ze(n), r = Tt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, l = 0;
  if (i) {
    s = i.width, o = i.height;
    const u = Sl();
    (!u || u && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  const c = Fs(r);
  if (c <= 0) {
    const u = r.ownerDocument, d = u.body, f = getComputedStyle(d), h = u.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - d.clientWidth - h);
    p <= wu && (s -= p);
  } else c <= wu && (s += c);
  return {
    width: s,
    height: o,
    x: a,
    y: l
  };
}
const M1 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function A1(n, e) {
  const t = En(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = xt(n) ? Xn(n) : yt(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, l = i * s.x, c = r * s.y;
  return {
    width: o,
    height: a,
    x: l,
    y: c
  };
}
function Su(n, e, t) {
  let r;
  if (e === "viewport")
    r = E1(n, t);
  else if (e === "document")
    r = T1(Tt(n));
  else if (dt(e))
    r = A1(e, t);
  else {
    const i = Jh(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return us(r);
}
function Yh(n, e) {
  const t = en(n);
  return t === e || !dt(t) || ir(t) ? !1 : ft(t).position === "fixed" || Yh(t, e);
}
function O1(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Jr(n, [], !1).filter((a) => dt(a) && Nn(a) !== "body"), i = null;
  const s = ft(n).position === "fixed";
  let o = s ? en(n) : n;
  for (; dt(o) && !ir(o); ) {
    const a = ft(o), l = wl(o);
    !l && a.position === "fixed" && (i = null), (s ? !l && !i : !l && a.position === "static" && !!i && M1.has(i.position) || di(o) && !l && Yh(n, o)) ? r = r.filter((u) => u !== o) : i = a, o = en(o);
  }
  return e.set(n, r), r;
}
function D1(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Ls(e) ? [] : O1(e, this._c) : [].concat(t), r], a = o[0], l = o.reduce((c, u) => {
    const d = Su(e, u, i);
    return c.top = Ge(d.top, c.top), c.right = Zt(d.right, c.right), c.bottom = Zt(d.bottom, c.bottom), c.left = Ge(d.left, c.left), c;
  }, Su(e, a, i));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function P1(n) {
  const {
    width: e,
    height: t
  } = Kh(n);
  return {
    width: e,
    height: t
  };
}
function _1(n, e, t) {
  const r = xt(e), i = Tt(e), s = t === "fixed", o = En(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = yt(0);
  function c() {
    l.x = Fs(i);
  }
  if (r || !r && !s)
    if ((Nn(e) !== "body" || di(i)) && (a = Bs(e)), r) {
      const h = En(e, !0, s, e);
      l.x = h.x + e.clientLeft, l.y = h.y + e.clientTop;
    } else i && c();
  s && !r && i && c();
  const u = i && !r && !s ? Xh(i, a) : yt(0), d = o.left + a.scrollLeft - l.x - u.x, f = o.top + a.scrollTop - l.y - u.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Ao(n) {
  return ft(n).position === "static";
}
function xu(n, e) {
  if (!xt(n) || ft(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Tt(n) === t && (t = t.ownerDocument.body), t;
}
function Gh(n, e) {
  const t = Ze(n);
  if (Ls(n))
    return t;
  if (!xt(n)) {
    let i = en(n);
    for (; i && !ir(i); ) {
      if (dt(i) && !Ao(i))
        return i;
      i = en(i);
    }
    return t;
  }
  let r = xu(n, e);
  for (; r && p1(r) && Ao(r); )
    r = xu(r, e);
  return r && ir(r) && Ao(r) && !wl(r) ? t : r || b1(n) || t;
}
const N1 = async function(n) {
  const e = this.getOffsetParent || Gh, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: _1(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function I1(n) {
  return ft(n).direction === "rtl";
}
const R1 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: k1,
  getDocumentElement: Tt,
  getClippingRect: D1,
  getOffsetParent: Gh,
  getElementRects: N1,
  getClientRects: C1,
  getDimensions: P1,
  getScale: Xn,
  isElement: dt,
  isRTL: I1
};
function Qh(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function $1(n, e) {
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
    const p = Ti(d), m = Ti(i.clientWidth - (u + f)), g = Ti(i.clientHeight - (d + h)), y = Ti(u), x = {
      rootMargin: -p + "px " + -m + "px " + -g + "px " + -y + "px",
      threshold: Ge(0, Zt(1, l)) || 1
    };
    let b = !0;
    function k(C) {
      const w = C[0].intersectionRatio;
      if (w !== l) {
        if (!b)
          return o();
        w ? o(!1, w) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      w === 1 && !Qh(c, n.getBoundingClientRect()) && o(), b = !1;
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
function L1(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = r, c = xl(n), u = i || s ? [...c ? Jr(c) : [], ...Jr(e)] : [];
  u.forEach((y) => {
    i && y.addEventListener("scroll", t, {
      passive: !0
    }), s && y.addEventListener("resize", t);
  });
  const d = c && a ? $1(c, t) : null;
  let f = -1, h = null;
  o && (h = new ResizeObserver((y) => {
    let [S] = y;
    S && S.target === c && h && (h.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var x;
      (x = h) == null || x.observe(e);
    })), t();
  }), c && !l && h.observe(c), h.observe(e));
  let p, m = l ? En(n) : null;
  l && g();
  function g() {
    const y = En(n);
    m && !Qh(m, y) && t(), m = y, p = requestAnimationFrame(g);
  }
  return t(), () => {
    var y;
    u.forEach((S) => {
      i && S.removeEventListener("scroll", t), s && S.removeEventListener("resize", t);
    }), d?.(), (y = h) == null || y.disconnect(), h = null, l && cancelAnimationFrame(p);
  };
}
const B1 = l1, F1 = c1, ku = s1, z1 = d1, V1 = o1, q1 = i1, W1 = u1, U1 = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: R1,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return r1(n, e, {
    ...i,
    platform: s
  });
};
function H1(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function ma(n) {
  if (H1(n)) {
    const e = n.$el;
    return bl(e) && Nn(e) === "#comment" ? null : e;
  }
  return n;
}
function Hn(n) {
  return typeof n == "function" ? n() : v(n);
}
function j1(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = ma(Hn(n.element));
      return t == null ? {} : q1({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Zh(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Cu(n, e) {
  const t = Zh(n);
  return Math.round(e * t) / t;
}
function K1(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = O(() => {
    var w;
    return (w = Hn(t.open)) != null ? w : !0;
  }), s = O(() => Hn(t.middleware)), o = O(() => {
    var w;
    return (w = Hn(t.placement)) != null ? w : "bottom";
  }), a = O(() => {
    var w;
    return (w = Hn(t.strategy)) != null ? w : "absolute";
  }), l = O(() => {
    var w;
    return (w = Hn(t.transform)) != null ? w : !0;
  }), c = O(() => ma(n.value)), u = O(() => ma(e.value)), d = D(0), f = D(0), h = D(a.value), p = D(o.value), m = Sn({}), g = D(!1), y = O(() => {
    const w = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!u.value)
      return w;
    const E = Cu(u.value, d.value), T = Cu(u.value, f.value);
    return l.value ? {
      ...w,
      transform: "translate(" + E + "px, " + T + "px)",
      ...Zh(u.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: E + "px",
      top: T + "px"
    };
  });
  let S;
  function x() {
    if (c.value == null || u.value == null)
      return;
    const w = i.value;
    U1(c.value, u.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((E) => {
      d.value = E.x, f.value = E.y, h.value = E.strategy, p.value = E.placement, m.value = E.middlewareData, g.value = w !== !1;
    });
  }
  function b() {
    typeof S == "function" && (S(), S = void 0);
  }
  function k() {
    if (b(), r === void 0) {
      x();
      return;
    }
    if (c.value != null && u.value != null) {
      S = r(c.value, u.value, x);
      return;
    }
  }
  function C() {
    i.value || (g.value = !1);
  }
  return te([s, o, a, i], x, {
    flush: "sync"
  }), te([c, u], k, {
    flush: "sync"
  }), te(i, C, {
    flush: "sync"
  }), ed() && td(b), {
    x: Ln(d),
    y: Ln(f),
    strategy: Ln(h),
    placement: Ln(p),
    middlewareData: Ln(m),
    isPositioned: Ln(g),
    floatingStyles: y,
    update: x
  };
}
const J1 = {
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
}, [dO, X1] = Ct("PopperContent");
var Y1 = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ ym({
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
  }, { ...J1 }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Wh(), { forwardRef: s, currentElement: o } = me(), a = D(), l = D(), { width: c, height: u } = KS(l), d = O(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = O(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = O(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), p = O(() => ({
      padding: f.value,
      boundary: h.value.filter(Wx),
      altBoundary: h.value.length > 0
    })), m = O(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = wS(() => [
      B1({
        mainAxis: t.sideOffset + u.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && ku({
        ...p.value,
        ...m.value
      }),
      t.avoidCollisions && F1({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? W1() : void 0,
        ...p.value
      }),
      !t.prioritizePosition && t.avoidCollisions && ku({
        ...p.value,
        ...m.value
      }),
      z1({
        ...p.value,
        apply: ({ elements: R, rects: q, availableWidth: _, availableHeight: $ }) => {
          const { width: ne, height: X } = q.reference, ie = R.floating.style;
          ie.setProperty("--reka-popper-available-width", `${_}px`), ie.setProperty("--reka-popper-available-height", `${$}px`), ie.setProperty("--reka-popper-anchor-width", `${ne}px`), ie.setProperty("--reka-popper-anchor-height", `${X}px`);
        }
      }),
      l.value && j1({
        element: l.value,
        padding: t.arrowPadding
      }),
      Ux({
        arrowWidth: c.value,
        arrowHeight: u.value
      }),
      t.hideWhenDetached && V1({
        strategy: "referenceHidden",
        ...p.value
      })
    ]), y = O(() => t.reference ?? i.anchor.value), { floatingStyles: S, placement: x, isPositioned: b, middlewareData: k } = K1(y, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...R) => L1(...R, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), C = O(() => da(x.value)[0]), w = O(() => da(x.value)[1]);
    sd(() => {
      b.value && r("placed");
    });
    const E = O(() => {
      const R = k.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && R;
    }), T = D("");
    Je(() => {
      o.value && (T.value = window.getComputedStyle(o.value).zIndex);
    });
    const M = O(() => k.value.arrow?.x ?? 0), I = O(() => k.value.arrow?.y ?? 0);
    return X1({
      placedSide: C,
      onArrowChange: (R) => l.value = R,
      arrowX: M,
      arrowY: I,
      shouldHideArrow: E
    }), (R, q) => (A(), K("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: On({
        ...v(S),
        transform: v(b) ? v(S).transform : "translate(0, -200%)",
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
      "data-align": w.value,
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
}), G1 = Y1;
function Q1(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => Or(r, e, t)) : Or(n, e, t);
}
function Or(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : is(n, e);
}
const [ep, Z1] = Ct("ListboxRoot");
var ek = /* @__PURE__ */ B({
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
    const r = n, i = t, { multiple: s, highlightOnHover: o, orientation: a, disabled: l, selectionBehavior: c, dir: u } = cr(r), { getItems: d } = sn({ isProvider: !0 }), { handleTypeaheadSearch: f } = pl(), { primitiveElement: h, currentElement: p } = as(), m = jS(), g = Mh(u), y = Ah(p), S = D(), x = D(!1), b = D(!0), k = /* @__PURE__ */ ss(r, "modelValue", i, {
      defaultValue: r.defaultValue ?? (s.value ? [] : void 0),
      passive: r.modelValue === void 0,
      deep: !0
    });
    function C(V) {
      if (x.value = !0, r.multiple) {
        const j = Array.isArray(k.value) ? [...k.value] : [], Q = j.findIndex((se) => Or(se, V, r.by));
        r.selectionBehavior === "toggle" ? (Q === -1 ? j.push(V) : j.splice(Q, 1), k.value = j) : (k.value = [V], S.value = V);
      } else r.selectionBehavior === "toggle" && Or(k.value, V, r.by) ? k.value = void 0 : k.value = V;
      setTimeout(() => {
        x.value = !1;
      }, 1);
    }
    const w = D(null), E = D(null), T = D(!1), M = D(!1), I = /* @__PURE__ */ So(), R = /* @__PURE__ */ So(), q = /* @__PURE__ */ So();
    function _() {
      return d().map((V) => V.ref).filter((V) => V.dataset.disabled !== "");
    }
    function $(V, j = !0) {
      if (!V) return;
      w.value = V, b.value && w.value.focus(), j && w.value.scrollIntoView({ block: "nearest" });
      const Q = d().find((se) => se.ref === V);
      i("highlight", Q);
    }
    function ne(V) {
      if (T.value) q.trigger(V);
      else {
        const j = d().find((Q) => Or(Q.value, V, r.by));
        j && (w.value = j.ref, $(j.ref));
      }
    }
    function X(V) {
      w.value && w.value.isConnected && (V.preventDefault(), V.stopPropagation(), M.value || w.value.click());
    }
    function ie(V) {
      if (b.value) {
        if (x.value = !0, T.value) R.trigger(V);
        else {
          const j = V.altKey || V.ctrlKey || V.metaKey;
          if (j && V.key === "a" && s.value) {
            const Q = d(), se = Q.map((ht) => ht.value);
            k.value = [...se], V.preventDefault(), $(Q[Q.length - 1].ref);
          } else if (!j) {
            const Q = f(V.key, d());
            Q && $(Q);
          }
        }
        setTimeout(() => {
          x.value = !1;
        }, 1);
      }
    }
    function de() {
      M.value = !0;
    }
    function Ve() {
      ye(() => {
        M.value = !1;
      });
    }
    function Rn() {
      ye(() => {
        const V = new KeyboardEvent("keydown", { key: "PageUp" });
        an(V);
      });
    }
    function lt(V) {
      const j = w.value;
      j?.isConnected && (E.value = j), w.value = null, i("leave", V);
    }
    function $n(V) {
      const j = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if (V.currentTarget?.dispatchEvent(j), i("entryFocus", j), !j.defaultPrevented)
        if (E.value) $(E.value);
        else {
          const Q = _()?.[0];
          $(Q);
        }
    }
    function an(V) {
      const j = Nx(V, a.value, g.value);
      if (!j) return;
      let Q = _();
      if (w.value) {
        if (j === "last") Q.reverse();
        else if (j === "prev" || j === "next") {
          j === "prev" && Q.reverse();
          const se = Q.indexOf(w.value);
          Q = Q.slice(se + 1);
        }
        Qs(V, Q[0]);
      }
      if (Q.length) {
        const se = !w.value && j === "prev" ? Q.length - 1 : 0;
        $(Q[se]);
      }
      if (T.value) return R.trigger(V);
    }
    function Qs(V, j) {
      if (!(T.value || r.selectionBehavior !== "replace" || !s.value || !Array.isArray(k.value) || (V.altKey || V.ctrlKey || V.metaKey) && !V.shiftKey) && V.shiftKey) {
        const se = d().filter((Et) => Et.ref.dataset.disabled !== "");
        let ht = se.find((Et) => Et.ref === j)?.value;
        if (V.key === m.END ? ht = se[se.length - 1].value : V.key === m.HOME && (ht = se[0].value), !ht || !S.value) return;
        const pr = bS(se.map((Et) => Et.value), S.value, ht);
        k.value = pr;
      }
    }
    async function Zs(V) {
      if (await ye(), T.value) I.trigger(V);
      else {
        const j = _(), Q = j.find((se) => se.dataset.state === "checked");
        Q ? $(Q) : j.length && $(j[0]);
      }
    }
    return te(k, () => {
      x.value || ye(() => {
        Zs();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: w,
      highlightItem: ne,
      highlightFirstItem: Rn,
      highlightSelected: Zs,
      getItems: d
    }), Z1({
      modelValue: k,
      onValueChange: C,
      multiple: s,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: o,
      highlightedElement: w,
      isVirtual: T,
      virtualFocusHook: I,
      virtualKeydownHook: R,
      virtualHighlightHook: q,
      by: r.by,
      firstValue: S,
      selectionBehavior: c,
      focusable: b,
      onLeave: lt,
      onEnter: $n,
      changeHighlight: $,
      onKeydownEnter: X,
      onKeydownNavigation: an,
      onKeydownTypeAhead: ie,
      onCompositionStart: de,
      onCompositionEnd: Ve,
      highlightFirstItem: Rn
    }), (V, j) => (A(), z(v(he), {
      ref_key: "primitiveElement",
      ref: h,
      as: V.as,
      "as-child": V.asChild,
      dir: v(g),
      "data-disabled": v(l) ? "" : void 0,
      onPointerleave: lt,
      onFocusout: j[0] || (j[0] = async (Q) => {
        const se = Q.relatedTarget || Q.target;
        await ye(), w.value && v(p) && !v(p).contains(se) && lt(Q);
      })
    }, {
      default: N(() => [G(V.$slots, "default", { modelValue: v(k) }), v(y) && V.name ? (A(), z(v(Lx), {
        key: 0,
        name: V.name,
        value: v(k),
        disabled: v(l),
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
}), tk = ek, nk = /* @__PURE__ */ B({
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
    const { CollectionSlot: e } = sn(), t = ep(), r = xh(!1, 10);
    return (i, s) => (A(), z(v(e), null, {
      default: N(() => [F(v(he), {
        role: "listbox",
        as: i.as,
        "as-child": i.asChild,
        tabindex: v(t).focusable.value ? v(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": v(t).orientation.value,
        "aria-multiselectable": !!v(t).multiple.value,
        "data-orientation": v(t).orientation.value,
        onMousedown: s[0] || (s[0] = pn((o) => r.value = !0, ["left"])),
        onFocus: s[1] || (s[1] = (o) => {
          v(r) || v(t).onEnter(o);
        }),
        onKeydown: [
          s[2] || (s[2] = Fo((o) => {
            v(t).orientation.value === "vertical" && (o.key === "ArrowLeft" || o.key === "ArrowRight") || v(t).orientation.value === "horizontal" && (o.key === "ArrowUp" || o.key === "ArrowDown") || (o.preventDefault(), v(t).focusable.value && v(t).onKeydownNavigation(o));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          Fo(v(t).onKeydownEnter, ["enter"]),
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
}), rk = nk;
const ik = "listbox.select", [sk, ok] = Ct("ListboxItem");
var ak = /* @__PURE__ */ B({
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
    const t = n, r = e, i = Kr(void 0, "reka-listbox-item"), { CollectionItem: s } = sn(), { forwardRef: o, currentElement: a } = me(), l = ep(), c = O(() => a.value === l.highlightedElement.value), u = O(() => Q1(l.modelValue.value, t.value, l.by)), d = O(() => l.disabled.value || t.disabled);
    async function f(p) {
      r("select", p), !p?.defaultPrevented && !d.value && p && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function h(p) {
      const m = {
        originalEvent: p,
        value: t.value
      };
      Ps(ik, f, m);
    }
    return ok({ isSelected: u }), (p, m) => (A(), z(v(s), { value: p.value }, {
      default: N(() => [vm([c.value, u.value], () => F(v(he), ce({ id: v(i) }, p.$attrs, {
        ref: v(o),
        role: "option",
        tabindex: v(l).focusable.value ? c.value ? "0" : "-1" : -1,
        "aria-selected": u.value,
        as: p.as,
        "as-child": p.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": c.value ? "" : void 0,
        "data-state": u.value ? "checked" : "unchecked",
        onClick: h,
        onKeydown: Fo(pn(h, ["prevent"]), ["space"]),
        onPointermove: m[0] || (m[0] = () => {
          v(l).highlightedElement.value !== v(a) && v(l).highlightOnHover.value && !v(l).focusable.value && v(l).changeHighlight(v(a), !1);
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
}), lk = ak, ck = /* @__PURE__ */ B({
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
    const t = sk();
    return (r, i) => v(t).isSelected.value ? (A(), z(v(he), ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16)) : ee("v-if", !0);
  }
}), uk = ck;
function dk(n) {
  const e = _s({ nonce: D() });
  return O(() => n?.value || e.nonce?.value);
}
const fk = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], hk = [" ", "Enter"], ct = 10;
function Xr(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((r) => ga(r, e, t)) : ga(n, e, t);
}
function ga(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : is(n, e);
}
function pk(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const mk = {
  key: 0,
  value: ""
}, [on, tp] = Ct("SelectRoot");
var gk = /* @__PURE__ */ B({
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
    const t = n, r = e, { required: i, disabled: s, multiple: o, dir: a } = cr(t), l = /* @__PURE__ */ ss(t, "modelValue", r, {
      defaultValue: t.defaultValue ?? (o.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), c = /* @__PURE__ */ ss(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), u = D(), d = D(), f = D({
      x: 0,
      y: 0
    }), h = O(() => o.value && Array.isArray(l.value) ? l.value?.length === 0 : la(l.value));
    sn({ isProvider: !0 });
    const p = Mh(a), m = Ah(u), g = D(/* @__PURE__ */ new Set()), y = O(() => Array.from(g.value).map((b) => b.value).join(";"));
    function S(b) {
      if (o.value) {
        const k = Array.isArray(l.value) ? [...l.value] : [], C = k.findIndex((w) => ga(w, b, t.by));
        C === -1 ? k.push(b) : k.splice(C, 1), l.value = [...k];
      } else l.value = b;
    }
    function x(b) {
      return Array.from(g.value).find((k) => Xr(b, k.value, t.by));
    }
    return tp({
      triggerElement: u,
      onTriggerChange: (b) => {
        u.value = b;
      },
      valueElement: d,
      onValueElementChange: (b) => {
        d.value = b;
      },
      contentId: "",
      modelValue: l,
      onValueChange: S,
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
    }), (b, k) => (A(), z(v(zx), null, {
      default: N(() => [G(b.$slots, "default", {
        modelValue: v(l),
        open: v(c)
      }), v(m) ? (A(), z(bk, {
        key: y.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: v(o),
        required: v(i),
        name: b.name,
        autocomplete: b.autocomplete,
        disabled: v(s),
        value: v(l)
      }, {
        default: N(() => [v(la)(v(l)) ? (A(), K("option", mk)) : ee("v-if", !0), (A(!0), K(it, null, Dn(Array.from(g.value), (C) => (A(), K("option", ce({ key: C.value ?? "" }, { ref_for: !0 }, C), null, 16))), 128))]),
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
}), yk = gk, vk = /* @__PURE__ */ B({
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
    const e = n, t = D(), r = on();
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
    return (s, o) => (A(), z(v(qh), { "as-child": "" }, {
      default: N(() => [J("select", ce({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: i }), [G(s.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), bk = vk, wk = /* @__PURE__ */ B({
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
      default: ct
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
    const t = hl(n);
    return (r, i) => (A(), z(v(G1), ce(v(t), { style: {
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
}), Sk = wk;
const xk = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [zs, np] = Ct("SelectContent");
var kk = /* @__PURE__ */ B({
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
    const t = n, r = e, i = on();
    FS(), Th(t.bodyLock);
    const { CollectionSlot: s, getItems: o } = sn(), a = D();
    Dh(a);
    const { search: l, handleTypeaheadSearch: c } = pl(), u = D(), d = D(), f = D(), h = D(!1), p = D(!1), m = D(!1);
    function g() {
      d.value && a.value && du([d.value, a.value]);
    }
    te(h, () => {
      g();
    });
    const { onOpenChange: y, triggerPointerDownPosRef: S } = i;
    Je((C) => {
      if (!a.value) return;
      let w = {
        x: 0,
        y: 0
      };
      const E = (M) => {
        w = {
          x: Math.abs(Math.round(M.pageX) - (S.value?.x ?? 0)),
          y: Math.abs(Math.round(M.pageY) - (S.value?.y ?? 0))
        };
      }, T = (M) => {
        M.pointerType !== "touch" && (w.x <= 10 && w.y <= 10 ? M.preventDefault() : a.value?.contains(M.target) || y(!1), document.removeEventListener("pointermove", E), S.value = null);
      };
      S.value !== null && (document.addEventListener("pointermove", E), document.addEventListener("pointerup", T, {
        capture: !0,
        once: !0
      })), C(() => {
        document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", T, { capture: !0 });
      });
    });
    function x(C) {
      const w = C.ctrlKey || C.altKey || C.metaKey;
      if (C.key === "Tab" && C.preventDefault(), !w && C.key.length === 1 && c(C.key, o()), [
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
        setTimeout(() => du(T)), C.preventDefault();
      }
    }
    const b = O(() => t.position === "popper" ? t : {}), k = hl(b.value);
    return np({
      content: a,
      viewport: u,
      onViewportChange: (C) => {
        u.value = C;
      },
      itemRefCallback: (C, w, E) => {
        const T = !p.value && !E, M = Xr(i.modelValue.value, w, i.by);
        if (i.multiple.value) {
          if (m.value) return;
          (M || T) && (d.value = C, M && (m.value = !0));
        } else (M || T) && (d.value = C);
        T && (p.value = !0);
      },
      selectedItem: d,
      selectedItemText: f,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (C, w, E) => {
        const T = !p.value && !E;
        (Xr(i.modelValue.value, w, i.by) || T) && (f.value = C);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: h,
      searchRef: l
    }), (C, w) => (A(), z(v(s), null, {
      default: N(() => [F(v(Rh), {
        "as-child": "",
        onMountAutoFocus: w[6] || (w[6] = pn(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: w[7] || (w[7] = (E) => {
          r("closeAutoFocus", E), !E.defaultPrevented && (v(i).triggerElement.value?.focus({ preventScroll: !0 }), E.preventDefault());
        })
      }, {
        default: N(() => [F(v(Nh), {
          "as-child": "",
          "disable-outside-pointer-events": C.disableOutsidePointerEvents,
          onFocusOutside: w[2] || (w[2] = pn(() => {
          }, ["prevent"])),
          onDismiss: w[3] || (w[3] = (E) => v(i).onOpenChange(!1)),
          onEscapeKeyDown: w[4] || (w[4] = (E) => r("escapeKeyDown", E)),
          onPointerDownOutside: w[5] || (w[5] = (E) => r("pointerDownOutside", E))
        }, {
          default: N(() => [(A(), z(bm(C.position === "popper" ? Sk : Ak), ce({
            ...C.$attrs,
            ...v(k)
          }, {
            id: v(i).contentId,
            ref: (E) => {
              const T = v(St)(E);
              T?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = T.firstElementChild : a.value = T;
            },
            role: "listbox",
            "data-state": v(i).open.value ? "open" : "closed",
            dir: v(i).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: w[0] || (w[0] = pn(() => {
            }, ["prevent"])),
            onPlaced: w[1] || (w[1] = (E) => h.value = !0),
            onKeydown: x
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
}), Ck = kk;
const [Tk, Ek] = Ct("SelectItemAlignedPosition");
var Mk = /* @__PURE__ */ B({
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
    const t = n, r = e, { getItems: i } = sn(), s = on(), o = zs(), a = D(!1), l = D(!0), c = D(), { forwardRef: u, currentElement: d } = me(), { viewport: f, selectedItem: h, selectedItemText: p, focusSelectedItem: m } = o;
    function g() {
      if (s.triggerElement.value && s.valueElement.value && c.value && d.value && f?.value && h?.value && p?.value) {
        const x = s.triggerElement.value.getBoundingClientRect(), b = d.value.getBoundingClientRect(), k = s.valueElement.value.getBoundingClientRect(), C = p.value.getBoundingClientRect();
        if (s.dir.value !== "rtl") {
          const V = C.left - b.left, j = k.left - V, Q = x.left - j, se = x.width + Q, ht = Math.max(se, b.width), pr = window.innerWidth - ct, Et = su(j, ct, Math.max(ct, pr - ht));
          c.value.style.minWidth = `${se}px`, c.value.style.left = `${Et}px`;
        } else {
          const V = b.right - C.right, j = window.innerWidth - k.right - V, Q = window.innerWidth - x.right - j, se = x.width + Q, ht = Math.max(se, b.width), pr = window.innerWidth - ct, Et = su(j, ct, Math.max(ct, pr - ht));
          c.value.style.minWidth = `${se}px`, c.value.style.right = `${Et}px`;
        }
        const w = i().map((V) => V.ref), E = window.innerHeight - ct * 2, T = f.value.scrollHeight, M = window.getComputedStyle(d.value), I = Number.parseInt(M.borderTopWidth, 10), R = Number.parseInt(M.paddingTop, 10), q = Number.parseInt(M.borderBottomWidth, 10), _ = Number.parseInt(M.paddingBottom, 10), $ = I + R + T + _ + q, ne = Math.min(h.value.offsetHeight * 5, $), X = window.getComputedStyle(f.value), ie = Number.parseInt(X.paddingTop, 10), de = Number.parseInt(X.paddingBottom, 10), Ve = x.top + x.height / 2 - ct, Rn = E - Ve, lt = h.value.offsetHeight / 2, $n = h.value.offsetTop + lt, an = I + R + $n, Qs = $ - an;
        if (an <= Ve) {
          const V = h.value === w[w.length - 1];
          c.value.style.bottom = "0px";
          const j = d.value.clientHeight - f.value.offsetTop - f.value.offsetHeight, Q = Math.max(Rn, lt + (V ? de : 0) + j + q), se = an + Q;
          c.value.style.height = `${se}px`;
        } else {
          const V = h.value === w[0];
          c.value.style.top = "0px";
          const Q = Math.max(Ve, I + f.value.offsetTop + (V ? ie : 0) + lt) + Qs;
          c.value.style.height = `${Q}px`, f.value.scrollTop = an - Ve + f.value.offsetTop;
        }
        c.value.style.margin = `${ct}px 0`, c.value.style.minHeight = `${ne}px`, c.value.style.maxHeight = `${E}px`, r("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const y = D("");
    ve(async () => {
      await ye(), g(), d.value && (y.value = window.getComputedStyle(d.value).zIndex);
    });
    function S(x) {
      x && l.value === !0 && (g(), m?.(), l.value = !1);
    }
    return IS(s.triggerElement, () => {
      g();
    }), Ek({
      contentWrapper: c,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: S
    }), (x, b) => (A(), K("div", {
      ref_key: "contentWrapperElement",
      ref: c,
      style: On({
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
      ...x.$attrs,
      ...t
    }), {
      default: N(() => [G(x.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Ak = Mk, Ok = /* @__PURE__ */ B({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return tp(n.context), np(xk), (t, r) => G(t.$slots, "default");
  }
}), Dk = Ok;
const Pk = { key: 1 };
var _k = /* @__PURE__ */ B({
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
    const t = n, i = zS(t, e), s = on(), o = D();
    ve(() => {
      o.value = new DocumentFragment();
    });
    const a = D(), l = O(() => t.forceMount || s.open.value), c = D(l.value);
    return te(l, () => {
      setTimeout(() => c.value = l.value);
    }), (u, d) => l.value || c.value || a.value?.present ? (A(), z(v(ml), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: N(() => [F(Ck, Na(Ia({
        ...v(i),
        ...u.$attrs
      })), {
        default: N(() => [G(u.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : o.value ? (A(), K("div", Pk, [(A(), z(id, { to: o.value }, [F(Dk, { context: v(s) }, {
      default: N(() => [G(u.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : ee("v-if", !0);
  }
}), Nk = _k, Ik = /* @__PURE__ */ B({
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
    return (e, t) => (A(), z(v(he), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: N(() => [G(e.$slots, "default", {}, () => [t[0] || (t[0] = Ke("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Rk = Ik;
const [rp, $k] = Ct("SelectItem");
var Lk = /* @__PURE__ */ B({
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
    const t = n, r = e, { disabled: i } = cr(t), s = on(), o = zs(), { forwardRef: a, currentElement: l } = me(), { CollectionItem: c } = sn(), u = O(() => Xr(s.modelValue?.value, t.value, s.by)), d = D(!1), f = D(t.textValue ?? ""), h = Kr(void 0, "reka-select-item-text"), p = "select.select";
    async function m(b) {
      if (b.defaultPrevented) return;
      const k = {
        originalEvent: b,
        value: t.value
      };
      Ps(p, g, k);
    }
    async function g(b) {
      await ye(), r("select", b), !b.defaultPrevented && (i.value || (s.onValueChange(t.value), s.multiple.value || s.onOpenChange(!1)));
    }
    async function y(b) {
      await ye(), !b.defaultPrevented && (i.value ? o.onItemLeave?.() : b.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function S(b) {
      await ye(), !b.defaultPrevented && b.currentTarget === at() && o.onItemLeave?.();
    }
    async function x(b) {
      await ye(), !(b.defaultPrevented || o.searchRef?.value !== "" && b.key === " ") && (hk.includes(b.key) && m(b), b.key === " " && b.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return ve(() => {
      l.value && o.itemRefCallback(l.value, t.value, t.disabled);
    }), $k({
      value: t.value,
      disabled: i,
      textId: h,
      isSelected: u,
      onItemTextChange: (b) => {
        f.value = ((f.value || b?.textContent) ?? "").trim();
      }
    }), (b, k) => (A(), z(v(c), { value: { textValue: f.value } }, {
      default: N(() => [F(v(he), {
        ref: v(a),
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
        onTouchend: k[3] || (k[3] = pn(() => {
        }, ["prevent", "stop"])),
        onPointermove: y,
        onPointerleave: S,
        onKeydown: x
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
}), Bk = Lk, Fk = /* @__PURE__ */ B({
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
    const e = n, t = rp();
    return (r, i) => v(t).isSelected.value ? (A(), z(v(he), ce({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: N(() => [G(r.$slots, "default")]),
      _: 3
    }, 16)) : ee("v-if", !0);
  }
}), zk = Fk, Vk = /* @__PURE__ */ B({
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
    const e = n, t = on(), r = zs(), i = rp(), { forwardRef: s, currentElement: o } = me(), a = O(() => ({
      value: i.value,
      disabled: i.disabled.value,
      textContent: o.value?.textContent ?? i.value?.toString() ?? ""
    }));
    return ve(() => {
      o.value && (i.onItemTextChange(o.value), r.itemTextRefCallback(o.value, i.value, i.disabled.value), t.onOptionAdd(a.value));
    }), ai(() => {
      t.onOptionRemove(a.value);
    }), (l, c) => (A(), z(v(he), ce({
      id: v(i).textId,
      ref: v(s)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: N(() => [G(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), qk = Vk, Wk = /* @__PURE__ */ B({
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
    return (t, r) => (A(), z(v(Fh), Na(Ia(e)), {
      default: N(() => [G(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Uk = Wk, Hk = /* @__PURE__ */ B({
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
    const e = n, t = on(), { forwardRef: r, currentElement: i } = me(), s = O(() => t.disabled?.value || e.disabled);
    t.contentId ||= Kr(void 0, "reka-select-content"), ve(() => {
      t.onTriggerChange(i.value);
    });
    const { getItems: o } = sn(), { search: a, handleTypeaheadSearch: l, resetTypeahead: c } = pl();
    function u() {
      s.value || (t.onOpenChange(!0), c());
    }
    function d(f) {
      u(), t.triggerPointerDownPosRef.value = {
        x: Math.round(f.pageX),
        y: Math.round(f.pageY)
      };
    }
    return (f, h) => (A(), z(v(qx), {
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
        "data-placeholder": v(pk)(v(t).modelValue?.value) ? "" : void 0,
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
        onPointerup: h[2] || (h[2] = pn((p) => {
          p.pointerType === "touch" && d(p);
        }, ["prevent"])),
        onKeydown: h[3] || (h[3] = (p) => {
          const m = v(a) !== "";
          !(p.ctrlKey || p.altKey || p.metaKey) && p.key.length === 1 && m && p.key === " " || (v(l)(p.key, v(o)()), v(fk).includes(p.key) && (u(), p.preventDefault()));
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
}), jk = Hk, Kk = /* @__PURE__ */ B({
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
    const e = n, { forwardRef: t, currentElement: r } = me(), i = on();
    ve(() => {
      i.valueElement = r;
    });
    const s = O(() => {
      let a = [];
      const l = Array.from(i.optionsSet.value), c = (u) => l.find((d) => Xr(u, d.value, i.by));
      return Array.isArray(i.modelValue.value) ? a = i.modelValue.value.map((u) => c(u)?.textContent ?? "") : a = [c(i.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), o = O(() => s.value.length ? s.value.join(", ") : e.placeholder);
    return (a, l) => (A(), z(v(he), {
      ref: v(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": s.value.length ? void 0 : e.placeholder
    }, {
      default: N(() => [G(a.$slots, "default", {
        selectedLabel: s.value,
        modelValue: v(i).modelValue.value
      }, () => [Ke(re(o.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), Jk = Kk, Xk = /* @__PURE__ */ B({
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
    const e = n, { nonce: t } = cr(e), r = dk(t), i = zs(), s = i.position === "item-aligned" ? Tk() : void 0, { forwardRef: o, currentElement: a } = me();
    ve(() => {
      i?.onViewportChange(a.value);
    });
    const l = D(0);
    function c(u) {
      const d = u.currentTarget, { shouldExpandOnScrollRef: f, contentWrapper: h } = s ?? {};
      if (f?.value && h?.value) {
        const p = Math.abs(l.value - d.scrollTop);
        if (p > 0) {
          const m = window.innerHeight - ct * 2, g = Number.parseFloat(h.value.style.minHeight), y = Number.parseFloat(h.value.style.height), S = Math.max(g, y);
          if (S < m) {
            const x = S + p, b = Math.min(m, x), k = x - b;
            h.value.style.height = `${b}px`, h.value.style.bottom === "0px" && (d.scrollTop = k > 0 ? k : 0, h.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (u, d) => (A(), K(it, null, [F(v(he), ce({
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
      default: N(() => d[0] || (d[0] = [Ke(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), Yk = Xk;
const Gk = /* @__PURE__ */ B({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, r = D(), i = D([]);
    return ve(() => {
      const s = r.value?.closest(".speaker-sidebar");
      s && (i.value = [s]);
    }), (s, o) => (A(), K("div", {
      class: "sidebar-select",
      ref_key: "selectEl",
      ref: r
    }, [
      F(v(yk), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": o[0] || (o[0] = (a) => t("update:selectedValue", a))
      }, {
        default: N(() => [
          F(v(jk), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: N(() => [
              F(v(Jk), { class: "sidebar-select-trigger-label" }),
              F(v(Rk), null, {
                default: N(() => [
                  F(v(Qm), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          F(v(Uk), { disabled: "" }, {
            default: N(() => [
              F(v(Nk), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute",
                "collision-boundary": i.value
              }, {
                default: N(() => [
                  F(v(Yk), null, {
                    default: N(() => [
                      (A(!0), K(it, null, Dn(n.items, (a) => (A(), z(v(Bk), {
                        key: a.value,
                        value: a.value,
                        class: "sidebar-select-item"
                      }, {
                        default: N(() => [
                          F(v(zk), { class: "sidebar-select-item-indicator" }, {
                            default: N(() => [
                              F(v(cd), { size: 14 })
                            ]),
                            _: 1
                          }),
                          F(v(qk), null, {
                            default: N(() => [
                              Ke(re(a.label), 1)
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
}), Qk = { class: "sidebar-select" }, Zk = ["aria-label"], eC = { class: "sidebar-select-trigger-label" }, tC = /* @__PURE__ */ B({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = D(!1), s = O(
      () => t.items.find((a) => a.value === t.selectedValue)?.label ?? ""
    );
    function o(a) {
      r("update:selectedValue", a), i.value = !1;
    }
    return (a, l) => (A(), K("div", Qk, [
      J("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: l[0] || (l[0] = (c) => i.value = !0)
      }, [
        J("span", eC, re(s.value), 1)
      ], 8, Zk),
      F(v(Ph), {
        open: i.value,
        "onUpdate:open": l[2] || (l[2] = (c) => i.value = c)
      }, {
        default: N(() => [
          F(v(zh), { disabled: "" }, {
            default: N(() => [
              F(v(Bh), { class: "editor-overlay" }),
              F(v(Lh), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: N(() => [
                  F(v(Vh), { class: "sr-only" }, {
                    default: N(() => [
                      Ke(re(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  l[3] || (l[3] = J("div", { class: "sheet-handle" }, null, -1)),
                  F(v(tk), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": l[1] || (l[1] = (c) => o(c))
                  }, {
                    default: N(() => [
                      F(v(rk), { class: "sheet-list" }, {
                        default: N(() => [
                          (A(!0), K(it, null, Dn(n.items, (c) => (A(), z(v(lk), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: N(() => [
                              F(v(uk), { class: "sheet-item-indicator" }, {
                                default: N(() => [
                                  F(v(cd), { size: 16 })
                                ]),
                                _: 1
                              }),
                              J("span", null, re(c.label), 1)
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
}), kl = /* @__PURE__ */ B({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: r } = Sh();
    return (i, s) => v(r) ? (A(), z(tC, ce({ key: 0 }, i.$props, {
      "onUpdate:selectedValue": s[0] || (s[0] = (o) => t("update:selectedValue", o))
    }), null, 16)) : (A(), z(Gk, ce({ key: 1 }, i.$props, {
      "onUpdate:selectedValue": s[1] || (s[1] = (o) => t("update:selectedValue", o))
    }), null, 16));
  }
}), ip = /* @__PURE__ */ B({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = kt(), s = O(
      () => t.channels.map((o) => ({ value: o.id, label: o.name }))
    );
    return (o, a) => (A(), z(kl, {
      items: s.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: v(i)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), nC = { class: "speaker-sidebar" }, rC = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, iC = { class: "sidebar-title" }, sC = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, oC = { class: "sidebar-title" }, aC = {
  key: 2,
  class: "sidebar-section"
}, lC = { class: "sidebar-title" }, cC = { class: "subtitle-toggle" }, uC = { class: "subtitle-toggle-label" }, dC = { class: "subtitle-slider" }, fC = { class: "subtitle-slider-label" }, hC = { class: "subtitle-slider-value" }, pC = ["value", "disabled"], mC = {
  key: 3,
  class: "sidebar-section"
}, gC = { class: "sidebar-title" }, yC = { class: "speaker-list" }, vC = { class: "speaker-name" }, bC = /* @__PURE__ */ B({
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
    const e = n, t = Lt(), { t: r, locale: i } = kt(), s = O(
      () => od(e.translations, i.value, r("sidebar.originalLanguage"), r("language.wildcard"))
    );
    return (o, a) => (A(), K("aside", nC, [
      n.channels.length > 1 ? (A(), K("section", rC, [
        J("h2", iC, re(v(r)("sidebar.channel")), 1),
        F(ip, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => o.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : ee("", !0),
      n.translations.length > 1 ? (A(), K("section", sC, [
        J("h2", oC, re(v(r)("sidebar.translation")), 1),
        F(kl, {
          items: s.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => o.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : ee("", !0),
      v(t).subtitle ? (A(), K("section", aC, [
        J("h2", lC, re(v(r)("sidebar.subtitle")), 1),
        J("div", cC, [
          J("span", uC, re(v(r)("subtitle.show")), 1),
          F(gS, {
            modelValue: v(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => v(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        J("label", dC, [
          J("span", fC, [
            Ke(re(v(r)("subtitle.fontSize")) + " ", 1),
            J("span", hC, re(v(t).subtitle.fontSize.value) + "px", 1)
          ]),
          J("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: v(t).subtitle.fontSize.value,
            disabled: !v(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => v(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, pC)
        ])
      ])) : ee("", !0),
      n.speakers.length ? (A(), K("section", mC, [
        J("h2", gC, re(v(r)("sidebar.speakers")), 1),
        J("ul", yC, [
          (A(!0), K(it, null, Dn(n.speakers, (l) => (A(), K("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            F(hd, {
              color: l.color
            }, null, 8, ["color"]),
            J("span", vC, re(l.name), 1)
          ]))), 128))
        ])
      ])) : ee("", !0)
    ]));
  }
}), Tu = /* @__PURE__ */ Oe(bC, [["__scopeId", "data-v-6e6fa62e"]]), wC = /* @__PURE__ */ B({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = wm(n, "open"), { t } = kt();
    return (r, i) => (A(), z(v(Ph), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: N(() => [
        F(v(zh), { disabled: "" }, {
          default: N(() => [
            F(v(Bh), { class: "editor-overlay" }),
            F(v(Lh), { class: "sidebar-drawer" }, {
              default: N(() => [
                F(v(Vh), { class: "sr-only" }, {
                  default: N(() => [
                    Ke(re(v(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                F(v(nx), {
                  class: "sidebar-close",
                  "aria-label": v(t)("header.closeSidebar")
                }, {
                  default: N(() => [
                    F(v(ud), { size: 20 })
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
}), SC = { class: "player-controls" }, xC = { class: "controls-left" }, kC = { class: "controls-time" }, CC = { class: "time-display" }, TC = { class: "time-display" }, EC = { class: "controls-right" }, MC = ["value", "aria-label", "disabled"], AC = /* @__PURE__ */ B({
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
    const t = e, { t: r } = kt(), i = D(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (A(), K("div", SC, [
      J("div", xC, [
        F(mt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: N(() => [
            F(v(ng), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        F(mt, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? v(r)("player.pause") : v(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: N(() => [
            n.isPlaying ? (A(), z(v(Zm), {
              key: 0,
              size: 20
            })) : (A(), z(v(eg), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        F(mt, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": v(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: N(() => [
            F(v(rg), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      J("div", kC, [
        J("time", CC, re(n.currentTime), 1),
        a[7] || (a[7] = J("span", { class: "time-separator" }, "/", -1)),
        J("time", TC, re(n.duration), 1)
      ]),
      J("div", EC, [
        J("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => i.value = !1)
        }, [
          F(mt, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? v(r)("player.unmute") : v(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: N(() => [
              n.isMuted ? (A(), z(v(og), {
                key: 0,
                size: 16
              })) : (A(), z(v(sg), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Sm(J("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": v(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, MC), [
            [xm, i.value]
          ])
        ], 32),
        F(mt, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": v(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: N(() => [
            Ke(re(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), OC = /* @__PURE__ */ Oe(AC, [["__scopeId", "data-v-89b8138f"]]);
function $e(n, e, t, r) {
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
let fi = class {
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
const Ei = { decode: function(n, e) {
  return $e(this, void 0, void 0, (function* () {
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
function sp(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(sp(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Eu(n, e, t) {
  const r = sp(n, e || {});
  return t?.appendChild(r), r;
}
var DC = Object.freeze({ __proto__: null, createElement: Eu, default: Eu });
const PC = { fetchBlob: function(n, e, t) {
  return $e(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      $e(this, void 0, void 0, (function* () {
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
function un(n, e) {
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
class _C extends fi {
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
    return $e(this, void 0, void 0, (function* () {
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
function NC({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function IC({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function Mu(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function op(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Au(n, e) {
  if (!op(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function Ou({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function ap(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function RC(n) {
  const e = fe({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = un((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: l } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const c = o / a, u = (o + l) / a;
    return { startX: Math.max(0, Math.min(1, c)), endX: Math.max(0, Math.min(1, u)) };
  })(e.value)), [e]), r = un((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), ap(e);
  } };
}
class $C extends fi {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Mu(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Mu(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = RC(this.scrollContainer);
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
        const g = Date.now(), y = t.getBoundingClientRect(), { left: S, top: x } = y, b = (T) => {
          if (T.defaultPrevented || l.size > 1 || c && Date.now() - g < o) return;
          const M = T.clientX, I = T.clientY, R = M - h, q = I - p;
          (m || Math.abs(R) > i || Math.abs(q) > i) && (T.preventDefault(), T.stopPropagation(), m || (a.set({ type: "start", x: h - S, y: p - x }), m = !0), a.set({ type: "move", x: M - S, y: I - x, deltaX: R, deltaY: q }), h = M, p = I);
        }, k = (T) => {
          if (l.delete(T.pointerId), m) {
            const M = T.clientX, I = T.clientY;
            a.set({ type: "end", x: M - S, y: I - x });
          }
          u();
        }, C = (T) => {
          l.delete(T.pointerId), T.relatedTarget && T.relatedTarget !== document.documentElement || k(T);
        }, w = (T) => {
          m && (T.stopPropagation(), T.preventDefault());
        }, E = (T) => {
          T.defaultPrevented || l.size > 1 || m && T.preventDefault();
        };
        document.addEventListener("pointermove", b), document.addEventListener("pointerup", k), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", w, { capture: !0 }), u = () => {
          document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", k), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", E), setTimeout((() => {
            document.removeEventListener("click", w, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        u(), t.removeEventListener("pointerdown", d), l.clear(), ap(a);
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
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: l, barRadius: c, barIndexScale: u, barSpacing: d, barMinHeight: f } = (function({ width: p, height: m, length: g, options: y, pixelRatio: S }) {
      const x = m / 2, b = y.barWidth ? y.barWidth * S : 1, k = y.barGap ? y.barGap * S : y.barWidth ? b / 2 : 0, C = b + k || 1;
      return { halfHeight: x, barWidth: b, barGap: k, barRadius: y.barRadius || 0, barMinHeight: y.barMinHeight ? y.barMinHeight * S : 0, barIndexScale: g > 0 ? p / C / g : 0, barSpacing: C };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: p, barIndexScale: m, barSpacing: g, barWidth: y, halfHeight: S, vScale: x, canvasHeight: b, barAlign: k, barMinHeight: C }) {
      const w = p[0] || [], E = p[1] || w, T = w.length, M = [];
      let I = 0, R = 0, q = 0;
      for (let _ = 0; _ <= T; _++) {
        const $ = Math.round(_ * m);
        if ($ > I) {
          const { topHeight: ie, totalHeight: de } = NC({ maxTop: R, maxBottom: q, halfHeight: S, vScale: x, barMinHeight: C, barAlign: k }), Ve = IC({ barAlign: k, halfHeight: S, topHeight: ie, totalHeight: de, canvasHeight: b });
          M.push({ x: I * g, y: Ve, width: y, height: de }), I = $, R = 0, q = 0;
        }
        const ne = Math.abs(w[_] || 0), X = Math.abs(E[_] || 0);
        ne > R && (R = ne), X > q && (q = X);
      }
      return M;
    })({ channelData: e, barIndexScale: u, barSpacing: d, barWidth: l, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const p of h) c && "roundRect" in r ? r.roundRect(p.x, p.y, p.width, p.height, c) : r.rect(p.x, p.y, p.width, p.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: l, width: c, height: u, vScale: d }) {
      const f = u / 2, h = l[0] || [];
      return [h, l[1] || h].map(((p, m) => {
        const g = p.length, y = g ? c / g : 0, S = f, x = m === 0 ? -1 : 1, b = [{ x: 0, y: S }];
        let k = 0, C = 0;
        for (let w = 0; w <= g; w++) {
          const E = Math.round(w * y);
          if (E > k) {
            const M = S + (Math.round(C * f * d) || 1) * x;
            b.push({ x: k, y: M }), k = E, C = 0;
          }
          const T = Math.abs(p[w] || 0);
          T > C && (C = T);
        }
        return b.push({ x: k, y: S }), b;
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
    op(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
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
      return Au(Math.min(8e3, p, m), g);
    })({ clientWidth: l, totalWidth: c, options: t });
    let d = {};
    if (u === 0) return;
    const f = (p) => {
      if (p < 0 || p >= h || d[p]) return;
      d[p] = !0;
      const m = p * u;
      let g = Math.min(c - m, u);
      if (g = Au(g, t), g <= 0) return;
      const y = (function({ channelData: S, offset: x, clampedWidth: b, totalWidth: k }) {
        return S.map(((C) => {
          const w = Math.floor(x / k * C.length), E = Math.floor((x + b) / k * C.length);
          return C.slice(w, E);
        }));
      })({ channelData: e, offset: m, clampedWidth: g, totalWidth: c });
      this.renderSingleCanvas(y, t, g, i, m, s, o);
    }, h = Math.ceil(c / u);
    if (!this.isScrollable) {
      for (let p = 0; p < h; p++) f(p);
      return;
    }
    if (Ou({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: c, numCanvases: h }).forEach(((p) => f(p))), h > 1) {
      const p = this.on("scroll", (() => {
        const { scrollLeft: m } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Ou({ scrollLeft: m, totalWidth: c, numCanvases: h }).forEach(((g) => f(g)));
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
    return $e(this, void 0, void 0, (function* () {
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
    return $e(this, void 0, void 0, (function* () {
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
class LC extends fi {
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
class Oo extends fi {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return $e(this, void 0, void 0, (function* () {
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
    return $e(this, void 0, void 0, (function* () {
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
    return $e(this, void 0, void 0, (function* () {
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
const BC = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Yr extends _C {
  static create(e) {
    return new Yr(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new Oo() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, BC, e);
    const { state: r, actions: i } = (function(a) {
      var l, c, u, d, f, h;
      const p = (l = a?.currentTime) !== null && l !== void 0 ? l : fe(0), m = (c = a?.duration) !== null && c !== void 0 ? c : fe(0), g = (u = a?.isPlaying) !== null && u !== void 0 ? u : fe(!1), y = (d = a?.isSeeking) !== null && d !== void 0 ? d : fe(!1), S = (f = a?.volume) !== null && f !== void 0 ? f : fe(1), x = (h = a?.playbackRate) !== null && h !== void 0 ? h : fe(1), b = fe(null), k = fe(null), C = fe(""), w = fe(0), E = fe(0), T = un((() => !g.value), [g]), M = un((() => b.value !== null), [b]), I = un((() => M.value && m.value > 0), [M, m]), R = un((() => p.value), [p]), q = un((() => m.value > 0 ? p.value / m.value : 0), [p, m]);
      return { state: { currentTime: p, duration: m, isPlaying: g, isPaused: T, isSeeking: y, volume: S, playbackRate: x, audioBuffer: b, peaks: k, url: C, zoom: w, scrollPosition: E, canPlay: M, isReady: I, progress: R, progressPercent: q }, actions: { setCurrentTime: (_) => {
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
        S.set($);
      }, setPlaybackRate: (_) => {
        const $ = Math.max(0.1, Math.min(16, _));
        x.set($);
      }, setAudioBuffer: (_) => {
        b.set(_), _ && m.set(_.duration);
      }, setPeaks: (_) => {
        k.set(_);
      }, setUrl: (_) => {
        C.set(_);
      }, setZoom: (_) => {
        w.set(Math.max(0, _));
      }, setScrollPosition: (_) => {
        E.set(Math.max(0, _));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new LC();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new $C(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Ei.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Ei.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return $e(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (u) => this.emit("loading", u);
        t = yield PC.fetchBlob(e, l, a);
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
        a instanceof Oo && (a.duration = o);
      }
      if (r) this.decodedData = Ei.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Ei.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return $e(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return $e(this, void 0, void 0, (function* () {
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
    return $e(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof Oo ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return $e(this, void 0, void 0, (function* () {
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
    return $e(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Yr.BasePlugin = class extends fi {
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
}, Yr.dom = DC;
class lp {
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
class FC extends lp {
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
function cp(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(cp(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function xr(n, e, t) {
  const r = cp(n, e || {});
  return t?.appendChild(r), r;
}
function up(n) {
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
function Ii(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function Vn(n, e) {
  const t = up(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function ln(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Ri(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = up(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const c = (u) => {
    if (u.button !== r || (o.set(u.pointerId, u), o.size > 1)) return;
    let d = u.clientX, f = u.clientY, h = !1;
    const p = Date.now(), m = n.getBoundingClientRect(), { left: g, top: y } = m, S = (w) => {
      if (w.defaultPrevented || o.size > 1 || a && Date.now() - p < i) return;
      const E = w.clientX, T = w.clientY, M = E - d, I = T - f;
      (h || Math.abs(M) > t || Math.abs(I) > t) && (w.preventDefault(), w.stopPropagation(), h || (s.set({ type: "start", x: d - g, y: f - y }), h = !0), s.set({ type: "move", x: E - g, y: T - y, deltaX: M, deltaY: I }), d = E, f = T);
    }, x = (w) => {
      if (o.delete(w.pointerId), h) {
        const E = w.clientX, T = w.clientY;
        s.set({ type: "end", x: E - g, y: T - y });
      }
      l();
    }, b = (w) => {
      o.delete(w.pointerId), w.relatedTarget && w.relatedTarget !== document.documentElement || x(w);
    }, k = (w) => {
      h && (w.stopPropagation(), w.preventDefault());
    }, C = (w) => {
      w.defaultPrevented || o.size > 1 || h && w.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", x), document.addEventListener("pointerout", b), document.addEventListener("pointercancel", b), document.addEventListener("touchmove", C, { passive: !1 }), document.addEventListener("click", k, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", x), document.removeEventListener("pointerout", b), document.removeEventListener("pointercancel", b), document.removeEventListener("touchmove", C), setTimeout((() => {
        document.removeEventListener("click", k, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", c), { signal: s, cleanup: () => {
    l(), n.removeEventListener("pointerdown", c), o.clear(), ln(s);
  } };
}
class Du extends lp {
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = xr("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = xr("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Ri(r, { threshold: 1 }), o = Ri(i, { threshold: 1 }), a = Ii((() => {
      const c = s.signal.value;
      c && (c.type === "move" && c.deltaX !== void 0 ? this.onResize(c.deltaX, "start") : c.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), l = Ii((() => {
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
    const i = xr("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = Vn(e, "click"), r = Vn(e, "mouseenter"), i = Vn(e, "mouseleave"), s = Vn(e, "dblclick"), o = Vn(e, "pointerdown"), a = Vn(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), c = r.subscribe(((g) => g && this.emit("over", g))), u = i.subscribe(((g) => g && this.emit("leave", g))), d = s.subscribe(((g) => g && this.emit("dblclick", g))), f = o.subscribe(((g) => g && this.toggleCursor(!0))), h = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), c(), u(), d(), f(), h(), ln(t), ln(r), ln(i), ln(s), ln(o), ln(a);
    }));
    const p = Ri(e), m = Ii((() => {
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
        this.content = xr("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Cl extends FC {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Cl(e);
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
    return xr("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Du(e, i, s);
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
    const l = Ri(i, { threshold: t }), c = Ii((() => {
      var u, d;
      const f = l.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), p = (d = (u = this.wavesurfer) === null || u === void 0 ? void 0 : u.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: m } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / m * h;
        const g = f.x / m * h, y = (f.x + 5) / m * h;
        s = new Du(Object.assign(Object.assign({}, e), { start: g, end: y }), h, p), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
const Do = [0.5, 0.75, 1, 1.25, 1.5, 2];
function zC(n) {
  const { containerRef: e, audioSrc: t, turns: r, speakers: i } = n, s = Sn(null), o = Sn(null), a = D(0), l = D(0), c = D(!1), u = D(!1), d = D(!1), f = D(1), h = D(1), p = D(!1), m = O(() => Wi(a.value)), g = O(() => Wi(l.value));
  function y(_, $) {
    R(), d.value = !0, u.value = !1;
    const ne = Cl.create();
    o.value = ne;
    const X = Yr.create({
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
      renderFunction: Um,
      url: $,
      plugins: [ne]
    });
    X.on("ready", () => {
      u.value = !0, d.value = !1, l.value = X.getDuration(), S();
    }), X.on("timeupdate", (ie) => {
      a.value = ie;
    }), X.on("play", () => {
      c.value = !0;
    }), X.on("pause", () => {
      c.value = !1;
    }), X.on("finish", () => {
      c.value = !1;
    }), s.value = X;
  }
  function S() {
    const _ = o.value;
    if (_) {
      _.clearRegions();
      for (const $ of r.value) {
        const ne = $.speakerId ? i.value.get($.speakerId) : void 0;
        if (!ne || $.startTime == null || $.endTime == null) continue;
        const X = ne.color;
        _.addRegion({
          start: $.startTime,
          end: $.endTime,
          color: Vm(X, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", X);
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
  function C(_) {
    const $ = s.value;
    !$ || l.value === 0 || $.setTime(_);
  }
  function w(_) {
    C(Math.max(0, Math.min(a.value + _, l.value)));
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
    const $ = (Do.indexOf(
      h.value
    ) + 1) % Do.length;
    M(Do[$] ?? 1);
  }
  function R() {
    q !== null && (clearTimeout(q), q = null), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  te(
    [e, t],
    ([_, $]) => {
      _ && $ && y(_, $);
    },
    { immediate: !0 }
  );
  let q = null;
  return te([r, i], () => {
    u.value && (q !== null && clearTimeout(q), q = setTimeout(() => {
      q = null, S();
    }, 150));
  }), An(() => {
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
    play: x,
    pause: b,
    togglePlay: k,
    seekTo: C,
    skip: w,
    setVolume: E,
    setPlaybackRate: M,
    cyclePlaybackRate: I,
    toggleMute: T
  };
}
const VC = { class: "audio-player" }, qC = /* @__PURE__ */ B({
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
      pause: y,
      skip: S,
      setVolume: x,
      cyclePlaybackRate: b,
      toggleMute: k
    } = zC({
      containerRef: s,
      audioSrc: Oi(() => r.audioSrc),
      turns: Oi(() => r.turns),
      speakers: Oi(() => r.speakers)
    });
    return te(f, (C) => i("timeupdate", C)), te(o, (C) => i("playStateChange", C)), e({ seekTo: g, pause: y }), (C, w) => (A(), K("footer", VC, [
      J("div", {
        ref_key: "waveformRef",
        ref: s,
        class: $r(["waveform-container", { "waveform-container--loading": v(l) }])
      }, null, 2),
      F(OC, {
        "is-playing": v(o),
        "current-time": v(h),
        duration: v(p),
        volume: v(c),
        "playback-rate": v(u),
        "is-muted": v(d),
        "is-ready": v(a),
        onTogglePlay: v(m),
        onSkipBack: w[0] || (w[0] = (E) => v(S)(-10)),
        onSkipForward: w[1] || (w[1] = (E) => v(S)(10)),
        "onUpdate:volume": v(x),
        onToggleMute: v(k),
        onCyclePlaybackRate: v(b)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), WC = /* @__PURE__ */ Oe(qC, [["__scopeId", "data-v-9248e45e"]]);
class UC {
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
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let p = this.extractCommon(h[0], t, e, 0, r);
    if (h[0].oldPos + 1 >= l && p + 1 >= a)
      return o(this.buildValues(h[0].lastComponent, t, e));
    let m = -1 / 0, g = 1 / 0;
    const y = () => {
      for (let S = Math.max(m, -c); S <= Math.min(g, c); S += 2) {
        let x;
        const b = h[S - 1], k = h[S + 1];
        b && (h[S - 1] = void 0);
        let C = !1;
        if (k) {
          const E = k.oldPos - S;
          C = k && 0 <= E && E < a;
        }
        const w = b && b.oldPos + 1 < l;
        if (!C && !w) {
          h[S] = void 0;
          continue;
        }
        if (!w || C && b.oldPos < k.oldPos ? x = this.addToPath(k, !0, !1, 0, r) : x = this.addToPath(b, !1, !0, 1, r), p = this.extractCommon(x, t, e, S, r), x.oldPos + 1 >= l && p + 1 >= a)
          return o(this.buildValues(x.lastComponent, t, e)) || !0;
        h[S] = x, x.oldPos + 1 >= l && (g = Math.min(g, S - 1)), p + 1 >= a && (m = Math.max(m, S + 1));
      }
      c++;
    };
    if (i)
      (function S() {
        setTimeout(function() {
          if (c > u || Date.now() > f)
            return i(void 0);
          y() || S();
        }, 0);
      })();
    else
      for (; c <= u && Date.now() <= f; ) {
        const S = y();
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
class HC extends UC {
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
const jC = new HC();
function KC(n, e, t) {
  return jC.diff(n, e, t);
}
function Po({ previousText: n, previousIndexes: e }, t, r) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const i = n.split(" "), s = t.split(" "), o = KC(i, s, {
    comparator: XC
  }), a = JC(o), l = [...e];
  let c = [...e], u = 0;
  for (const h of a) {
    do
      if (u < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in h && h.replaced)
      c = $i(
        c,
        l[0],
        h.countAdded - h.countRemoved
      ), u += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const p = h;
      u += p.count, c = $i(
        c,
        l[0],
        -p.count
      );
    } else if ("added" in h && h.added) {
      const p = h;
      c = $i(
        c,
        l[0],
        p.count
      );
    } else
      u += h.count;
  }
  const d = c.length > 0 ? c[c.length - 1] : 0, f = s.slice(d).join(" ");
  if (r(f)) {
    const p = dp(
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
function JC(n) {
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
function $i(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function dp(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    $i(
      dp(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function XC(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class YC {
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
class GC extends YC {
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
    this.resetAll(), this.currentState = Po(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = Po(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = Po(
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
function fp(n) {
  const e = Lt();
  let t = null;
  ve(() => {
    n.canvasRef.value && (t = new GC(n.canvasRef.value, {
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
  ai(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
const QC = ["height"], ZC = /* @__PURE__ */ B({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Lt(), t = Lr("canvas"), r = O(() => e.subtitle?.fontSize.value ?? 40), i = O(() => 1.2 * r.value), s = O(() => 2.4 * r.value);
    return fp({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    }), (o, a) => (A(), K("div", {
      class: "subtitle-banner",
      style: On({ height: s.value + "px" })
    }, [
      J("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: s.value
      }, null, 8, QC)
    ], 4));
  }
}), eT = /* @__PURE__ */ Oe(ZC, [["__scopeId", "data-v-be0ec70f"]]), tT = {
  ref: "container",
  class: "subtitle-fullscreen"
}, nT = ["aria-label"], rT = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, iT = /* @__PURE__ */ B({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Lt(), { t } = kt(), r = Lr("container"), i = Lr("canvas"), s = O(() => e.subtitle?.fontSize.value ?? 48), o = O(() => 1.2 * s.value);
    fp({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    }), ve(async () => {
      const c = r.value;
      if (c) {
        try {
          await c.requestFullscreen();
        } catch (u) {
          console.warn("Fullscreen API not supported:", u);
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
    ve(() => {
      document.addEventListener("fullscreenchange", a);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return ai(() => {
      document.removeEventListener("fullscreenchange", a);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, u) => (A(), K("div", tT, [
      J("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": v(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        F(v(ud), { size: 24 })
      ], 8, nT),
      J("canvas", rT, null, 512)
    ], 512));
  }
}), sT = /* @__PURE__ */ Oe(iT, [["__scopeId", "data-v-15fc63e2"]]), oT = { class: "editor-layout" }, aT = { class: "editor-body" }, lT = {
  key: 4,
  class: "mobile-selectors"
}, cT = /* @__PURE__ */ B({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Lt(), { t: r, locale: i } = kt(), { isMobile: s } = Sh(), o = D(!1), a = O(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), l = t.speakers.all, c = O(() => [...t.channels.values()]), u = O(
      () => t.activeChannel.value ? [...t.activeChannel.value.translations.values()] : []
    ), d = O(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), f = O(() => Array.from(l.values())), h = Lr("audioPlayer");
    function p(S) {
      t.audio && (t.audio.currentTime.value = S);
    }
    te(
      () => t.activeChannelId.value,
      () => {
        h.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), o.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((S) => h.value?.seekTo(S));
    const m = O(
      () => od(
        u.value,
        i.value,
        r("sidebar.originalLanguage"),
        r("language.wildcard")
      )
    );
    function g(S) {
      t.setActiveChannel(S);
    }
    function y(S) {
      t.activeChannel.value?.setActiveTranslation(S);
    }
    return (S, x) => (A(), K("div", oT, [
      e.showHeader ? (A(), z(wg, {
        key: 0,
        title: v(t).title.value,
        duration: v(t).activeChannel.value?.duration ?? 0,
        language: d.value,
        "is-mobile": v(s),
        onToggleSidebar: x[0] || (x[0] = (b) => o.value = !o.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : ee("", !0),
      J("main", aT, [
        F(dS, {
          turns: a.value,
          speakers: v(l)
        }, null, 8, ["turns", "speakers"]),
        v(s) ? ee("", !0) : (A(), z(Tu, {
          key: 0,
          speakers: f.value,
          channels: c.value,
          "selected-channel-id": v(t).activeChannelId.value,
          translations: u.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        v(s) ? (A(), z(wC, {
          key: 1,
          open: o.value,
          "onUpdate:open": x[1] || (x[1] = (b) => o.value = b)
        }, {
          default: N(() => [
            F(Tu, {
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
      v(t).audio?.src.value ? (A(), z(WC, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": v(t).audio.src.value,
        turns: a.value,
        speakers: v(l),
        onTimeupdate: p,
        onPlayStateChange: x[2] || (x[2] = (b) => {
          v(t).audio && (v(t).audio.isPlaying.value = b);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : ee("", !0),
      v(t).subtitle?.isVisible.value && !v(s) && !v(t).subtitle.isFullscreen.value ? (A(), z(eT, { key: 2 })) : ee("", !0),
      v(t).subtitle?.isFullscreen.value ? (A(), z(sT, { key: 3 })) : ee("", !0),
      v(s) && (c.value.length > 1 || u.value.length > 1) ? (A(), K("div", lT, [
        c.value.length > 1 ? (A(), z(ip, {
          key: 0,
          channels: c.value,
          "selected-channel-id": v(t).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : ee("", !0),
        u.value.length > 1 ? (A(), z(kl, {
          key: 1,
          items: m.value,
          "selected-value": d.value,
          ariaLabel: v(r)("sidebar.translationLabel"),
          "onUpdate:selectedValue": y
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : ee("", !0)
      ])) : ee("", !0)
    ]));
  }
}), hO = /* @__PURE__ */ Oe(cT, [["__scopeId", "data-v-8dfbbd79"]]);
function pO() {
  return {
    name: "audio",
    install(n) {
      const e = D(0), t = D(!1), r = D(null), i = D(null);
      let s = null;
      const o = O(
        () => n.activeChannel.value?.activeTranslation.value.audio?.src ?? null
      ), a = Je(() => {
        if (!t.value) return;
        const d = e.value, f = n.activeChannel.value?.activeTranslation.value;
        if (f) {
          for (const h of f.turns.value)
            if (h.startTime != null && h.endTime != null && d >= h.startTime && d <= h.endTime) {
              i.value = h.id, r.value = $a(h.words) ? ad(h.words, d) : null;
              return;
            }
        }
      });
      function l(d) {
        s?.(d);
      }
      function c(d) {
        s = d;
      }
      const u = {
        currentTime: e,
        isPlaying: t,
        src: o,
        activeWordId: r,
        activeTurnId: i,
        seekTo: l,
        setSeekHandler: c
      };
      return n.audio = u, () => {
        a(), n.audio = void 0;
      };
    }
  };
}
var hp = dl.create({
  name: "text",
  group: "inline",
  parseMarkdown: (n) => ({
    type: "text",
    text: n.text || ""
  }),
  renderMarkdown: (n) => n.text || ""
});
const Mn = Math.floor, uT = Math.abs, Gt = (n, e) => n < e ? n : e, sr = (n, e) => n > e ? n : e, dT = (n) => n !== 0 ? n < 0 : 1 / n < 0, fT = 64, Gr = 128, hT = 1 << 29, Pu = 63, Dr = 127, pT = 2147483647, _u = Number.MAX_SAFE_INTEGER, Nu = Number.MIN_SAFE_INTEGER, mT = Number.isInteger || ((n) => typeof n == "number" && isFinite(n) && Mn(n) === n), gT = () => /* @__PURE__ */ new Set(), Tl = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (!e(n[t], t, n))
      return !1;
  return !0;
}, pp = (n, e) => {
  for (let t = 0; t < n.length; t++)
    if (e(n[t], t, n))
      return !0;
  return !1;
}, yT = (n, e) => {
  const t = new Array(n);
  for (let r = 0; r < n; r++)
    t[r] = e(r, t);
  return t;
}, Vs = Array.isArray, mp = String.fromCharCode, vT = (n) => n.toLowerCase(), bT = /^\s*/g, wT = (n) => n.replace(bT, ""), ST = /([A-Z])/g, Iu = (n, e) => wT(n.replace(ST, (t) => `${e}${vT(t)}`)), xT = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, Qr = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), kT = (n) => Qr.encode(n), CT = Qr ? kT : xT;
let _o = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
_o && _o.decode(new Uint8Array()).length === 1 && (_o = null);
const TT = (n, e) => yT(e, () => n).join("");
let ET = class {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
};
const MT = () => new ET(), AT = (n) => {
  const e = MT();
  return n(e), DT(e);
}, OT = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, DT = (n) => {
  const e = new Uint8Array(OT(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, PT = (n, e) => {
  const t = n.cbuf.length;
  t - n.cpos < e && (n.bufs.push(new Uint8Array(n.cbuf.buffer, 0, n.cpos)), n.cbuf = new Uint8Array(sr(t, e) * 2), n.cpos = 0);
}, Ce = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Zr = (n, e) => {
  for (; e > Dr; )
    Ce(n, Gr | Dr & e), e = Mn(e / 128);
  Ce(n, Dr & e);
}, _T = (n, e) => {
  const t = dT(e);
  for (t && (e = -e), Ce(n, (e > Pu ? Gr : 0) | (t ? fT : 0) | Pu & e), e = Mn(e / 64); e > 0; )
    Ce(n, (e > Dr ? Gr : 0) | Dr & e), e = Mn(e / 128);
}, ya = new Uint8Array(3e4), NT = ya.length / 3, IT = (n, e) => {
  if (e.length < NT) {
    const t = Qr.encodeInto(e, ya).written || 0;
    Zr(n, t);
    for (let r = 0; r < t; r++)
      Ce(n, ya[r]);
  } else
    gp(n, CT(e));
}, RT = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Zr(n, r);
  for (let i = 0; i < r; i++)
    Ce(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, Ru = Qr && /** @type {any} */
Qr.encodeInto ? IT : RT, $T = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = Gt(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(sr(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, gp = (n, e) => {
  Zr(n, e.byteLength), $T(n, e);
}, El = (n, e) => {
  PT(n, e);
  const t = new DataView(n.cbuf.buffer, n.cpos, e);
  return n.cpos += e, t;
}, LT = (n, e) => El(n, 4).setFloat32(0, e, !1), BT = (n, e) => El(n, 8).setFloat64(0, e, !1), FT = (n, e) => (
  /** @type {any} */
  El(n, 8).setBigInt64(0, e, !1)
), $u = new DataView(new ArrayBuffer(4)), zT = (n) => ($u.setFloat32(0, n), $u.getFloat32(0) === n), va = (n, e) => {
  switch (typeof e) {
    case "string":
      Ce(n, 119), Ru(n, e);
      break;
    case "number":
      mT(e) && uT(e) <= pT ? (Ce(n, 125), _T(n, e)) : zT(e) ? (Ce(n, 124), LT(n, e)) : (Ce(n, 123), BT(n, e));
      break;
    case "bigint":
      Ce(n, 122), FT(n, e);
      break;
    case "object":
      if (e === null)
        Ce(n, 126);
      else if (Vs(e)) {
        Ce(n, 117), Zr(n, e.length);
        for (let t = 0; t < e.length; t++)
          va(n, e[t]);
      } else if (e instanceof Uint8Array)
        Ce(n, 116), gp(n, e);
      else {
        Ce(n, 118);
        const t = Object.keys(e);
        Zr(n, t.length);
        for (let r = 0; r < t.length; r++) {
          const i = t[r];
          Ru(n, i), va(n, e[i]);
        }
      }
      break;
    case "boolean":
      Ce(n, e ? 120 : 121);
      break;
    default:
      Ce(n, 127);
  }
}, qs = (n) => new Error(n), yp = () => {
  throw qs("Method unimplemented");
}, Ws = () => {
  throw qs("Unexpected case");
}, Li = () => /* @__PURE__ */ new Map(), vp = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
}, ei = /* @__PURE__ */ Symbol("Equality"), VT = (n, e) => n === e || !!n?.[ei]?.(e) || !1, qT = (n) => typeof n == "object", bp = Object.keys, Lu = (n) => bp(n).length, hi = (n, e) => {
  for (const t in n)
    if (!e(n[t], t))
      return !1;
  return !0;
}, wp = (n, e) => Object.prototype.hasOwnProperty.call(n, e), Bi = (n, e) => {
  if (n === e)
    return !0;
  if (n == null || e == null || n.constructor !== e.constructor && (n.constructor || Object) !== (e.constructor || Object))
    return !1;
  if (n[ei] != null)
    return n[ei](e);
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
        if (!e.has(t) || !Bi(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case void 0:
    case Object:
      if (Lu(n) !== Lu(e))
        return !1;
      for (const t in n)
        if (!wp(n, t) || !Bi(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Bi(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, WT = (n, e) => e.includes(n), UT = () => {
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
}, HT = /[\uD800-\uDBFF]/, jT = /[\uDC00-\uDFFF]/, KT = (n, e) => {
  let t = 0, r = 0;
  for (; t < n.length && t < e.length && n[t] === e[t]; )
    t++;
  for (t > 0 && HT.test(n[t - 1]) && t--; r + t < n.length && r + t < e.length && n[n.length - r - 1] === e[e.length - r - 1]; )
    r++;
  return r > 0 && jT.test(n[n.length - r]) && r--, {
    index: t,
    remove: n.length - t - r,
    insert: e.slice(t, e.length - r)
  };
}, JT = KT, XT = Math.random, YT = (n) => n[Mn(XT() * n.length)], Bu = (n) => n === void 0 ? null : n;
class GT {
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
let Sp = new GT(), QT = !0;
try {
  typeof localStorage < "u" && localStorage && (Sp = localStorage, QT = !1);
} catch {
}
const ZT = Sp, or = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", xp = typeof window < "u" && typeof document < "u" && !or;
let pt;
const eE = () => {
  if (pt === void 0)
    if (or) {
      pt = Li();
      const n = process.argv;
      let e = null;
      for (let t = 0; t < n.length; t++) {
        const r = n[t];
        r[0] === "-" ? (e !== null && pt.set(e, ""), e = r) : e !== null && (pt.set(e, r), e = null);
      }
      e !== null && pt.set(e, "");
    } else typeof location == "object" ? (pt = Li(), (location.search || "?").slice(1).split("&").forEach((n) => {
      if (n.length !== 0) {
        const [e, t] = n.split("=");
        pt.set(`--${Iu(e, "-")}`, t), pt.set(`-${Iu(e, "-")}`, t);
      }
    })) : pt = Li();
  return pt;
}, ba = (n) => eE().has(n), wa = (n) => Bu(or ? process.env[n.toUpperCase().replaceAll("-", "_")] : ZT.getItem(n)), kp = (n) => ba("--" + n) || wa(n) !== null, tE = kp("production"), nE = or && WT(process.env.FORCE_COLOR, ["true", "1", "2"]);
nE || !ba("--no-colors") && // @todo deprecate --no-colors
!kp("no-color") && (!or || process.stdout.isTTY) && (!or || ba("--color") || wa("COLORTERM") !== null || (wa("TERM") || "").includes("color"));
const rE = (n) => {
  let e = "";
  for (let t = 0; t < n.byteLength; t++)
    e += mp(n[t]);
  return btoa(e);
}, iE = (n) => Buffer.from(n.buffer, n.byteOffset, n.byteLength).toString("base64"), sE = xp ? rE : iE, oE = (n) => AT((e) => va(e, n)), Fu = (n) => n.next() >= 0.5, No = (n, e, t) => Mn(n.next() * (t + 1 - e) + e), Cp = (n, e, t) => Mn(n.next() * (t + 1 - e) + e), Ml = (n, e, t) => Cp(n, e, t), aE = (n) => mp(Ml(n, 97, 122)), lE = (n, e = 0, t = 20) => {
  const r = Ml(n, e, t);
  let i = "";
  for (let s = 0; s < r; s++)
    i += aE(n);
  return i;
}, Io = (n, e) => e[Ml(n, 0, e.length - 1)], cE = /* @__PURE__ */ Symbol("0schema");
class uE {
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
      e.push(TT(" ", (this._rerrs.length - t) * 2) + `${r.path != null ? `[${r.path}] ` : ""}${r.has} doesn't match ${r.expected}. ${r.message}`);
    }
    return e.join(`
`);
  }
}
const Sa = (n, e) => n === e ? !0 : n == null || e == null || n.constructor !== e.constructor ? !1 : n[ei] ? VT(n, e) : Vs(n) ? Tl(
  n,
  (t) => pp(e, (r) => Sa(t, r))
) : qT(n) ? hi(
  n,
  (t, r) => Sa(t, e[r])
) : !1;
class ze {
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
      this.constructor._dilutes && ([r, t] = [t, r]), Sa(t, r)
    );
  }
  /**
   * Overwrite this when necessary. By default, we only check the `shape` property which every shape
   * should have.
   * @param {Schema<any>} other
   */
  equals(e) {
    return this.constructor === e.constructor && Bi(this.shape, e.shape);
  }
  [cE]() {
    return !0;
  }
  /**
   * @param {object} other
   */
  [ei](e) {
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
    yp();
  }
  /* c8 ignore stop */
  /**
   * @type {Schema<T?>}
   */
  get nullable() {
    return fr(this, Js);
  }
  /**
   * @type {$Optional<Schema<T>>}
   */
  get optional() {
    return new Mp(
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
    return zu(e, this), /** @type {any} */
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
    return zu(e, this), e;
  }
}
class Al extends ze {
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
const ge = (n, e = null) => new Al(n, e);
ge(Al);
class Ol extends ze {
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
const xe = (n) => new Ol(n);
ge(Ol);
class Us extends ze {
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
const Hs = (...n) => new Us(n), Tp = ge(Us), dE = (
  /** @type {any} */
  RegExp.escape || /** @type {(str:string) => string} */
  ((n) => n.replace(/[().|&,$^[\]]/g, (e) => "\\" + e))
), Ep = (n) => {
  if (ar.check(n))
    return [dE(n)];
  if (Tp.check(n))
    return (
      /** @type {Array<string|number>} */
      n.shape.map((e) => e + "")
    );
  if ($p.check(n))
    return ["[+-]?\\d+.?\\d*"];
  if (Lp.check(n))
    return [".*"];
  if (ds.check(n))
    return n.shape.map(Ep).flat(1);
  Ws();
};
class fE extends ze {
  /**
   * @param {T} shape
   */
  constructor(e) {
    super(), this.shape = e, this._r = new RegExp("^" + e.map(Ep).map((t) => `(${t.join("|")})`).join("") + "$");
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
ge(fE);
const hE = /* @__PURE__ */ Symbol("optional");
class Mp extends ze {
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
  get [hE]() {
    return !0;
  }
}
const pE = ge(Mp);
class mE extends ze {
  /**
   * @param {any} _o
   * @param {ValidationError} [err]
   * @return {_o is never}
   */
  check(e, t) {
    return t?.extend(null, "never", typeof e), !1;
  }
}
ge(mE);
class js extends ze {
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
    return new js(this.shape, !0);
  }
  /**
   * @param {any} o
   * @param {ValidationError} err
   * @return {o is $ObjectToType<S>}
   */
  check(e, t) {
    return e == null ? (t?.extend(null, "object", "null"), !1) : hi(this.shape, (r, i) => {
      const s = this._isPartial && !wp(e, i) || r.check(e[i], t);
      return !s && t?.extend(i.toString(), r.toString(), typeof e[i], "Object property does not match"), s;
    });
  }
}
const gE = (n) => (
  /** @type {any} */
  new js(n)
), yE = ge(js), vE = xe((n) => n != null && (n.constructor === Object || n.constructor == null));
class Ap extends ze {
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
    return e != null && hi(e, (r, i) => {
      const s = this.shape.keys.check(i, t);
      return !s && t?.extend(i + "", "Record", typeof e, s ? "Key doesn't match schema" : "Value doesn't match value"), s && this.shape.values.check(r, t);
    });
  }
}
const Op = (n, e) => new Ap(n, e), bE = ge(Ap);
class Dp extends ze {
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
    return e != null && hi(this.shape, (r, i) => {
      const s = (
        /** @type {Schema<any>} */
        r.check(e[i], t)
      );
      return !s && t?.extend(i.toString(), "Tuple", typeof r), s;
    });
  }
}
const wE = (...n) => new Dp(n);
ge(Dp);
class Pp extends ze {
  /**
   * @param {Array<S>} v
   */
  constructor(e) {
    super(), this.shape = e.length === 1 ? e[0] : new Dl(e);
  }
  /**
   * @param {any} o
   * @param {ValidationError} [err]
   * @return {o is Array<S extends Schema<infer T> ? T : never>} o
   */
  check(e, t) {
    const r = Vs(e) && Tl(e, (i) => this.shape.check(i));
    return !r && t?.extend(null, "Array", ""), r;
  }
}
const _p = (...n) => new Pp(n), SE = ge(Pp), xE = xe((n) => Vs(n));
class Np extends ze {
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
const kE = (n, e = null) => new Np(n, e);
ge(Np);
const CE = kE(ze);
class TE extends ze {
  /**
   * @param {Args} args
   */
  constructor(e) {
    super(), this.len = e.length - 1, this.args = wE(...e.slice(-1)), this.res = e[this.len];
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
const EE = ge(TE), ME = xe((n) => typeof n == "function");
class AE extends ze {
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
    const r = Tl(this.shape, (i) => i.check(e, t));
    return !r && t?.extend(null, "Intersectinon", typeof e), r;
  }
}
ge(AE, (n) => n.shape.length > 0);
class Dl extends ze {
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
    const r = pp(this.shape, (i) => i.check(e, t));
    return t?.extend(null, "Union", typeof e), r;
  }
}
const fr = (...n) => n.findIndex((e) => ds.check(e)) >= 0 ? fr(...n.map((e) => ti(e)).map((e) => ds.check(e) ? e.shape : [e]).flat(1)) : n.length === 1 ? n[0] : new Dl(n), ds = (
  /** @type {Schema<$Union<any>>} */
  ge(Dl)
), Ip = () => !0, fs = xe(Ip), OE = (
  /** @type {Schema<Schema<any>>} */
  ge(Ol, (n) => n.shape === Ip)
), Pl = xe((n) => typeof n == "bigint"), DE = (
  /** @type {Schema<Schema<BigInt>>} */
  xe((n) => n === Pl)
), Rp = xe((n) => typeof n == "symbol");
xe((n) => n === Rp);
const Yn = xe((n) => typeof n == "number"), $p = (
  /** @type {Schema<Schema<number>>} */
  xe((n) => n === Yn)
), ar = xe((n) => typeof n == "string"), Lp = (
  /** @type {Schema<Schema<string>>} */
  xe((n) => n === ar)
), Ks = xe((n) => typeof n == "boolean"), PE = (
  /** @type {Schema<Schema<Boolean>>} */
  xe((n) => n === Ks)
), Bp = Hs(void 0);
ge(Us, (n) => n.shape.length === 1 && n.shape[0] === void 0);
Hs(void 0);
const Js = Hs(null), _E = (
  /** @type {Schema<Schema<null>>} */
  ge(Us, (n) => n.shape.length === 1 && n.shape[0] === null)
);
ge(Uint8Array);
ge(Al, (n) => n.shape === Uint8Array);
const NE = fr(Yn, ar, Js, Bp, Pl, Ks, Rp);
(() => {
  const n = (
    /** @type {$Array<$any>} */
    _p(fs)
  ), e = (
    /** @type {$Record<$string,$any>} */
    Op(ar, fs)
  ), t = fr(Yn, ar, Js, Ks, n, e);
  return n.shape = t, e.shape.values = t, t;
})();
const ti = (n) => {
  if (CE.check(n))
    return (
      /** @type {any} */
      n
    );
  if (vE.check(n)) {
    const e = {};
    for (const t in n)
      e[t] = ti(n[t]);
    return (
      /** @type {any} */
      gE(e)
    );
  } else {
    if (xE.check(n))
      return (
        /** @type {any} */
        fr(...n.map(ti))
      );
    if (NE.check(n))
      return (
        /** @type {any} */
        Hs(n)
      );
    if (ME.check(n))
      return (
        /** @type {any} */
        ge(
          /** @type {any} */
          n
        )
      );
  }
  Ws();
}, zu = tE ? () => {
} : (n, e) => {
  const t = new uE();
  if (!e.check(n, t))
    throw qs(`Expected value to be of type ${e.constructor.name}.
${t.toString()}`);
};
class IE {
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
    return this.patterns.push({ if: ti(e), h: t }), this;
  }
  /**
   * @template R
   * @param {(o:any,s:State)=>R} h
   */
  else(e) {
    return this.if(fs, e);
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
        throw qs("Unhandled pattern");
      }
    );
  }
}
const RE = (n) => new IE(
  /** @type {any} */
  n
), Fp = (
  /** @type {any} */
  RE(
    /** @type {Schema<prng.PRNG>} */
    fs
  ).if($p, (n, e) => No(e, Nu, _u)).if(Lp, (n, e) => lE(e)).if(PE, (n, e) => Fu(e)).if(DE, (n, e) => BigInt(No(e, Nu, _u))).if(ds, (n, e) => qn(e, Io(e, n.shape))).if(yE, (n, e) => {
    const t = {};
    for (const r in n.shape) {
      let i = n.shape[r];
      if (pE.check(i)) {
        if (Fu(e))
          continue;
        i = i.shape;
      }
      t[r] = Fp(i, e);
    }
    return t;
  }).if(SE, (n, e) => {
    const t = [], r = Cp(e, 0, 42);
    for (let i = 0; i < r; i++)
      t.push(qn(e, n.shape));
    return t;
  }).if(Tp, (n, e) => Io(e, n.shape)).if(_E, (n, e) => null).if(EE, (n, e) => {
    const t = qn(e, n.res);
    return () => t;
  }).if(OE, (n, e) => qn(e, Io(e, [
    Yn,
    ar,
    Js,
    Bp,
    Pl,
    Ks,
    _p(Yn),
    Op(fr("a", "b", "c"), Yn)
  ]))).if(bE, (n, e) => {
    const t = {}, r = No(e, 0, 3);
    for (let i = 0; i < r; i++) {
      const s = qn(e, n.shape.keys), o = qn(e, n.shape.values);
      t[s] = o;
    }
    return t;
  }).done()
), qn = (n, e) => (
  /** @type {any} */
  Fp(ti(e), n)
), pi = (
  /** @type {Document} */
  typeof document < "u" ? document : {}
);
xe((n) => n.nodeType === FE);
typeof DOMParser < "u" && new DOMParser();
xe((n) => n.nodeType === $E);
xe((n) => n.nodeType === LE);
const $E = pi.ELEMENT_NODE, LE = pi.TEXT_NODE, BE = pi.DOCUMENT_NODE, FE = pi.DOCUMENT_FRAGMENT_NODE;
xe((n) => n.nodeType === BE);
const zE = (n) => class {
  /**
   * @param {number} timeoutId
   */
  constructor(t) {
    this._ = t;
  }
  destroy() {
    n(this._);
  }
}, VE = zE(clearTimeout), _l = (n, e) => new VE(setTimeout(e, n)), vt = (n, e) => n >>> e | n << 32 - e, qE = (n) => vt(n, 2) ^ vt(n, 13) ^ vt(n, 22), WE = (n) => vt(n, 6) ^ vt(n, 11) ^ vt(n, 25), UE = (n) => vt(n, 7) ^ vt(n, 18) ^ n >>> 3, HE = (n) => vt(n, 17) ^ vt(n, 19) ^ n >>> 10, jE = new Uint32Array([
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
]), KE = new Uint32Array([
  1779033703,
  3144134277,
  1013904242,
  2773480762,
  1359893119,
  2600822924,
  528734635,
  1541459225
]);
class JE {
  constructor() {
    const e = new ArrayBuffer(320);
    this._H = new Uint32Array(e, 0, 8), this._H.set(KE), this._W = new Uint32Array(e, 64, 64);
  }
  _updateHash() {
    const e = this._H, t = this._W;
    for (let d = 16; d < 64; d++)
      t[d] = HE(t[d - 2]) + t[d - 7] + UE(t[d - 15]) + t[d - 16];
    let r = e[0], i = e[1], s = e[2], o = e[3], a = e[4], l = e[5], c = e[6], u = e[7];
    for (let d = 0, f, h; d < 64; d++)
      f = u + WE(a) + (a & l ^ ~a & c) + jE[d] + t[d] >>> 0, h = qE(r) + (r & i ^ r & s ^ i & s) >>> 0, u = c, c = l, l = a, a = o + f >>> 0, o = s, s = i, i = r, r = f + h >>> 0;
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
        this._W[o] |= Gr << (3 - t % 4) * 8;
      }
      this._updateHash();
    }
    const r = t % 64 !== 0;
    this._W.fill(0, 0, 16);
    let i = 0;
    for (; t < e.length; i++)
      for (let o = 3; o >= 0 && t < e.length; o--)
        this._W[i] |= e[t++] << o * 8;
    r || (this._W[i - (t % 4 === 0 ? 0 : 1)] |= Gr << (3 - t % 4) * 8), this._W[14] = e.byteLength / hT, this._W[15] = e.byteLength * 8, this._updateHash();
    const s = new Uint8Array(32);
    for (let o = 0; o < this._H.length; o++)
      for (let a = 0; a < 4; a++)
        s[o * 4 + a] = this._H[o] >>> (3 - a) * 8;
    return s;
  }
}
const XE = (n) => new JE().digest(n), oe = new Xe("y-sync"), Nt = new Xe("y-undo"), Mi = new Xe("yjs-cursor"), YE = (n) => {
  for (let t = 6; t < n.length; t++)
    n[t % 6] = n[t % 6] ^ n[t];
  return n.slice(0, 6);
}, GE = (n) => sE(YE(XE(oE(n)))), hs = (n, e) => e === void 0 ? !n.deleted : e.sv.has(n.id.client) && /** @type {number} */
e.sv.get(n.id.client) > n.id.clock && !W.isDeleted(e.ds, n.id), QE = [{ light: "#ecd44433", dark: "#ecd444" }], ZE = (n, e, t) => {
  if (!n.has(t)) {
    if (n.size < e.length) {
      const r = gT();
      n.forEach((i) => r.add(i)), e = e.filter((i) => !r.has(i));
    }
    n.set(t, YT(e));
  }
  return (
    /** @type {ColorDef} */
    n.get(t)
  );
}, eM = (n, {
  colors: e = QE,
  colorMapping: t = /* @__PURE__ */ new Map(),
  permanentUserData: r = null,
  onFirstRender: i = () => {
  },
  mapping: s
} = {}) => {
  let o = !1;
  const a = new rM(n, s), l = new De({
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
          for (const f in d)
            u[f] = d[f];
        }
        return u.addToHistory = c.getMeta("addToHistory") !== !1, u.isChangeOrigin = d !== void 0 && !!d.isChangeOrigin, u.isUndoRedoOperation = d !== void 0 && !!d.isChangeOrigin && !!d.isUndoRedoOperation, a.prosemirrorView !== null && d !== void 0 && (d.snapshot != null || d.prevSnapshot != null) && _l(0, () => {
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
            const d = Nt.getState(c.state), f = d && d.undoManager;
            f && f.stopCapturing();
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
}, tM = (n, e, t) => {
  if (e !== null && e.anchor !== null && e.head !== null)
    if (e.type === "all")
      n.setSelection(new He(n.doc));
    else if (e.type === "node") {
      const r = bn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      );
      n.setSelection(nM(n, r));
    } else {
      const r = bn(
        t.doc,
        t.type,
        e.anchor,
        t.mapping
      ), i = bn(
        t.doc,
        t.type,
        e.head,
        t.mapping
      );
      r !== null && i !== null && n.setSelection(Y.between(n.doc.resolve(r), n.doc.resolve(i)));
    }
}, nM = (n, e) => {
  const t = n.doc.resolve(e);
  return t.nodeAfter ? H.create(n.doc, e) : Y.near(t);
}, xa = (n, e) => ({
  type: (
    /** @type {any} */
    e.selection.jsonID
  ),
  anchor: ri(
    e.selection.anchor,
    n.type,
    n.mapping
  ),
  head: ri(
    e.selection.head,
    n.type,
    n.mapping
  )
});
class rM {
  /**
   * @param {Y.XmlFragment} yXmlFragment The bind source
   * @param {ProsemirrorMapping} mapping
   */
  constructor(e, t = /* @__PURE__ */ new Map()) {
    this.type = e, this.prosemirrorView = null, this.mux = UT(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
      this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = xa(
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
    return this.prosemirrorView.hasFocus() ? (xp && this._domSelectionInView === null && (_l(0, () => {
      this._domSelectionInView = null;
    }), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
  }
  _isDomSelectionInView() {
    const e = this.prosemirrorView._root.getSelection();
    if (e == null || e.anchorNode == null) return !1;
    const t = this.prosemirrorView._root.createRange();
    t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
    const i = t.getBoundingClientRect(), s = pi.documentElement;
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
        (r) => Fi(
          /** @type {Y.XmlElement} */
          r,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((r) => r !== null), t = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new L(P.from(e), 0, 0)
      );
      t.setMeta(oe, { snapshot: null, prevSnapshot: null }), this.prosemirrorView.dispatch(t);
    });
  }
  _forceRerender() {
    this.mapping.clear(), this.mux(() => {
      const e = this.beforeTransactionSelection !== null ? null : this.prosemirrorView.state.selection, t = this.type.toArray().map(
        (i) => Fi(
          /** @type {Y.XmlElement} */
          i,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((i) => i !== null), r = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new L(P.from(t), 0, 0)
      );
      if (e) {
        const i = Gt(sr(e.anchor, 0), r.doc.content.size), s = Gt(sr(e.head, 0), r.doc.content.size);
        r.setSelection(Y.create(r.doc, i, s));
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
      if ((!(e instanceof Uint8Array) || !(t instanceof Uint8Array)) && Ws(), i = new W.Doc({ gc: !1 }), W.applyUpdateV2(i, t), t = W.snapshot(i), W.applyUpdateV2(i, e), e = W.snapshot(i), s._item === null) {
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
            color: ZE(
              r.colorMapping,
              r.colors,
              h
            )
          };
        }, c = W.typeListToArraySnapshot(
          s,
          new W.Snapshot(t.ds, e.sv)
        ).map((d) => !d._item.deleted || hs(d._item, e) || hs(d._item, t) ? Fi(
          d,
          this.prosemirrorView.state.schema,
          { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() },
          e,
          t,
          l
        ) : null).filter((d) => d !== null), u = this._tr.replace(
          0,
          this.prosemirrorView.state.doc.content.size,
          new L(P.from(c), 0, 0)
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
        (a) => zp(
          /** @type {Y.XmlElement | Y.XmlHook} */
          a,
          this.prosemirrorView.state.schema,
          this
        )
      ).filter((a) => a !== null);
      let o = this._tr.replace(
        0,
        this.prosemirrorView.state.doc.content.size,
        new L(P.from(s), 0, 0)
      );
      tM(o, this.beforeTransactionSelection, this), o = o.setMeta(oe, { isChangeOrigin: !0, isUndoRedoOperation: t.origin instanceof W.UndoManager }), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && o.scrollIntoView(), this.prosemirrorView.dispatch(o);
    });
  }
  /**
   * @param {import('prosemirror-model').Node} doc
   */
  _prosemirrorChanged(e) {
    this.doc.transact(() => {
      ms(this.doc, this.type, e, this), this.beforeTransactionSelection = xa(
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
const zp = (n, e, t, r, i, s) => {
  const o = (
    /** @type {PModel.Node} */
    t.mapping.get(n)
  );
  if (o === void 0) {
    if (n instanceof W.XmlElement)
      return Fi(
        n,
        e,
        t,
        r,
        i,
        s
      );
    throw yp();
  }
  return o;
}, Fi = (n, e, t, r, i, s) => {
  const o = [], a = (l) => {
    if (l instanceof W.XmlElement) {
      const c = zp(
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
      const u = iM(
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
    r !== void 0 && (hs(
      /** @type {Y.Item} */
      n._item,
      r
    ) ? hs(
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
}, iM = (n, e, t, r, i, s) => {
  const o = [], a = n.toDelta(r, i, s);
  try {
    for (let l = 0; l < a.length; l++) {
      const c = a[l];
      o.push(e.text(c.insert, uM(c.attributes, e)));
    }
  } catch {
    return n.doc.transact((c) => {
      n._item.delete(c);
    }, oe), null;
  }
  return o;
}, sM = (n, e) => {
  const t = new W.XmlText(), r = n.map((i) => ({
    // @ts-ignore
    insert: i.text,
    attributes: Wp(i.marks, e)
  }));
  return t.applyDelta(r), e.mapping.set(t, n), t;
}, oM = (n, e) => {
  const t = new W.XmlElement(n.type.name);
  for (const r in n.attrs) {
    const i = n.attrs[r];
    i !== null && r !== "ychange" && t.setAttribute(r, i);
  }
  return t.insert(
    0,
    Xs(n).map(
      (r) => ka(r, e)
    )
  ), e.mapping.set(t, n), t;
}, ka = (n, e) => n instanceof Array ? sM(n, e) : oM(n, e), Vu = (n) => typeof n == "object" && n !== null, Nl = (n, e) => {
  const t = Object.keys(n).filter((i) => n[i] !== null);
  let r = t.length === Object.keys(e).filter((i) => e[i] !== null).length;
  for (let i = 0; i < t.length && r; i++) {
    const s = t[i], o = n[s], a = e[s];
    r = s === "ychange" || o === a || Vu(o) && Vu(a) && Nl(o, a);
  }
  return r;
}, Xs = (n) => {
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
}, Vp = (n, e) => {
  const t = n.toDelta();
  return t.length === e.length && t.every(
    /** @type {(d:any,i:number) => boolean} */
    (r, i) => r.insert === /** @type {any} */
    e[i].text && bp(r.attributes || {}).length === e[i].marks.length && hi(r.attributes, (s, o) => {
      const a = qp(o), l = e[i].marks;
      return l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      ) ? Nl(s, l.find(
        /** @param {any} mark */
        (u) => u.type.name === a
      )?.attrs) : !1;
    })
  );
}, ni = (n, e) => {
  if (n instanceof W.XmlElement && !(e instanceof Array) && Ca(n, e)) {
    const t = Xs(e);
    return n._length === t.length && Nl(n.getAttributes(), e.attrs) && n.toArray().every(
      (r, i) => ni(r, t[i])
    );
  }
  return n instanceof W.XmlText && e instanceof Array && Vp(n, e);
}, ps = (n, e) => n === e || n instanceof Array && e instanceof Array && n.length === e.length && n.every(
  (t, r) => e[r] === t
), qu = (n, e, t) => {
  const r = n.toArray(), i = Xs(e), s = i.length, o = r.length, a = Gt(o, s);
  let l = 0, c = 0, u = !1;
  for (; l < a; l++) {
    const d = r[l], f = i[l];
    if (ps(t.mapping.get(d), f))
      u = !0;
    else if (!ni(d, f))
      break;
  }
  for (; l + c < a; c++) {
    const d = r[o - c - 1], f = i[s - c - 1];
    if (ps(t.mapping.get(d), f))
      u = !0;
    else if (!ni(d, f))
      break;
  }
  return {
    equalityFactor: l + c,
    foundMappedChild: u
  };
}, aM = (n) => {
  let e = "", t = n._start;
  const r = {};
  for (; t !== null; )
    t.deleted || (t.countable && t.content instanceof W.ContentString ? e += t.content.str : t.content instanceof W.ContentFormat && (r[t.content.key] = null)), t = t.right;
  return {
    str: e,
    nAttrs: r
  };
}, lM = (n, e, t) => {
  t.mapping.set(n, e);
  const { nAttrs: r, str: i } = aM(n), s = e.map((c) => ({
    insert: (
      /** @type {any} */
      c.text
    ),
    attributes: Object.assign({}, r, Wp(c.marks, t))
  })), { insert: o, remove: a, index: l } = JT(
    i,
    s.map((c) => c.insert).join("")
  );
  n.delete(l, a), n.insert(l, o), n.applyDelta(
    s.map((c) => ({ retain: c.insert.length, attributes: c.attributes }))
  );
}, cM = /(.*)(--[a-zA-Z0-9+/=]{8})$/, qp = (n) => cM.exec(n)?.[1] ?? n, uM = (n, e) => {
  const t = [];
  for (const r in n)
    t.push(e.mark(qp(r), n[r]));
  return t;
}, Wp = (n, e) => {
  const t = {};
  return n.forEach((r) => {
    if (r.type.name !== "ychange") {
      const i = vp(e.isOMark, r.type, () => !r.type.excludes(r.type));
      t[i ? `${r.type.name}--${GE(r.toJSON())}` : r.type.name] = r.attrs;
    }
  }), t;
}, ms = (n, e, t, r) => {
  if (e instanceof W.XmlElement && e.nodeName !== t.type.name)
    throw new Error("node name mismatch!");
  if (r.mapping.set(e, t), e instanceof W.XmlElement) {
    const d = e.getAttributes(), f = t.attrs;
    for (const h in f)
      f[h] !== null ? d[h] !== f[h] && h !== "ychange" && e.setAttribute(h, f[h]) : e.removeAttribute(h);
    for (const h in d)
      f[h] === void 0 && e.removeAttribute(h);
  }
  const i = Xs(t), s = i.length, o = e.toArray(), a = o.length, l = Gt(s, a);
  let c = 0, u = 0;
  for (; c < l; c++) {
    const d = o[c], f = i[c];
    if (!ps(r.mapping.get(d), f))
      if (ni(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  for (; u + c + 1 < l; u++) {
    const d = o[a - u - 1], f = i[s - u - 1];
    if (!ps(r.mapping.get(d), f))
      if (ni(d, f))
        r.mapping.set(d, f);
      else
        break;
  }
  n.transact(() => {
    for (; a - c - u > 0 && s - c - u > 0; ) {
      const f = o[c], h = i[c], p = o[a - u - 1], m = i[s - u - 1];
      if (f instanceof W.XmlText && h instanceof Array)
        Vp(f, h) || lM(f, h, r), c += 1;
      else {
        let g = f instanceof W.XmlElement && Ca(f, h), y = p instanceof W.XmlElement && Ca(p, m);
        if (g && y) {
          const S = qu(
            /** @type {Y.XmlElement} */
            f,
            /** @type {PModel.Node} */
            h,
            r
          ), x = qu(
            /** @type {Y.XmlElement} */
            p,
            /** @type {PModel.Node} */
            m,
            r
          );
          S.foundMappedChild && !x.foundMappedChild ? y = !1 : !S.foundMappedChild && x.foundMappedChild || S.equalityFactor < x.equalityFactor ? g = !1 : y = !1;
        }
        g ? (ms(
          n,
          /** @type {Y.XmlFragment} */
          f,
          /** @type {PModel.Node} */
          h,
          r
        ), c += 1) : y ? (ms(
          n,
          /** @type {Y.XmlFragment} */
          p,
          /** @type {PModel.Node} */
          m,
          r
        ), u += 1) : (r.mapping.delete(e.get(c)), e.delete(c, 1), e.insert(c, [
          ka(h, r)
        ]), c += 1);
      }
    }
    const d = a - c - u;
    if (a === 1 && s === 0 && o[0] instanceof W.XmlText ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : d > 0 && (e.slice(c, c + d).forEach((f) => r.mapping.delete(f)), e.delete(c, d)), c + u < s) {
      const f = [];
      for (let h = c; h < s - u; h++)
        f.push(ka(i[h], r));
      e.insert(c, f);
    }
  }, oe);
}, Ca = (n, e) => !(e instanceof Array) && n.nodeName === e.type.name;
let Pr = null;
const dM = () => {
  const n = (
    /** @type {Map<EditorView, Map<any, any>>} */
    Pr
  );
  Pr = null, n.forEach((e, t) => {
    const r = t.state.tr, i = oe.getState(t.state);
    i && i.binding && !i.binding.isDestroyed && (e.forEach((s, o) => {
      r.setMeta(o, s);
    }), t.dispatch(r));
  });
}, fM = (n, e, t) => {
  Pr || (Pr = /* @__PURE__ */ new Map(), _l(0, dM)), vp(Pr, n, Li).set(e, t);
}, ri = (n, e, t) => {
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
      throw Ws();
    if (n === 0 && r.constructor !== W.XmlText && r !== e)
      return hM(r._item.parent, r._item);
  }
  return W.createRelativePositionFromTypeIndex(e, e._length, -1);
}, hM = (n, e) => {
  let t = null, r = null;
  return n._item === null ? r = W.findRootTypeKey(n) : t = W.createID(n._item.id.client, n._item.id.clock), new W.RelativePosition(t, r, e.id);
}, bn = (n, e, t, r) => {
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
function pM(n, e) {
  const t = e || new W.XmlFragment(), r = t.doc ? t.doc : { transact: (i) => i(void 0) };
  return ms(r, t, n, { mapping: /* @__PURE__ */ new Map(), isOMark: /* @__PURE__ */ new Map() }), t;
}
function mM(n, e, t) {
  const r = Dt.fromJSON(n, e);
  return pM(r, t);
}
const gM = (n, e, t) => n !== e, yM = (n) => {
  const e = document.createElement("span");
  e.classList.add("ProseMirror-yjs-cursor"), e.setAttribute("style", `border-color: ${n.color}`);
  const t = document.createElement("div");
  t.setAttribute("style", `background-color: ${n.color}`), t.insertBefore(document.createTextNode(n.name), null);
  const r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
  return e.insertBefore(r, null), e.insertBefore(t, null), e.insertBefore(i, null), e;
}, vM = (n) => ({
  style: `background-color: ${n.color}70`,
  class: "ProseMirror-yjs-selection"
}), bM = /^#[0-9a-fA-F]{6}$/, Wu = (n, e, t, r, i) => {
  const s = oe.getState(n);
  if (s == null || s.doc == null || s.binding == null)
    return le.create(n.doc, []);
  const o = s.doc, a = [];
  return s.snapshot != null || s.prevSnapshot != null || s.binding.mapping.size === 0 ? le.create(n.doc, []) : (e.getStates().forEach((l, c) => {
    if (t(o.clientID, c, l) && l.cursor != null) {
      const u = l.user || {};
      u.color == null ? u.color = "#ffa500" : bM.test(u.color) || console.warn("A user uses an unsupported color format", u), u.name == null && (u.name = `User: ${c}`);
      let d = bn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.anchor),
        s.binding.mapping
      ), f = bn(
        o,
        s.type,
        W.createRelativePositionFromJSON(l.cursor.head),
        s.binding.mapping
      );
      if (d !== null && f !== null) {
        const h = sr(n.doc.content.size - 1, 0);
        d = Gt(d, h), f = Gt(f, h), a.push(
          We.widget(f, () => r(u, c), {
            key: c + "",
            side: 10
          })
        );
        const p = Gt(d, f), m = sr(d, f);
        a.push(
          We.inline(p, m, i(u, c), {
            inclusiveEnd: !0,
            inclusiveStart: !1
          })
        );
      }
    }
  }), le.create(n.doc, a));
}, wM = (n, {
  awarenessStateFilter: e = gM,
  cursorBuilder: t = yM,
  selectionBuilder: r = vM,
  getSelection: i = (o) => o.selection
} = {}, s = "cursor") => new De({
  key: Mi,
  state: {
    init(o, a) {
      return Wu(
        a,
        n,
        e,
        t,
        r
      );
    },
    apply(o, a, l, c) {
      const u = oe.getState(c), d = o.getMeta(Mi);
      return u && u.isChangeOrigin || d && d.awarenessUpdated ? Wu(
        c,
        n,
        e,
        t,
        r
      ) : a.map(o.mapping, o.doc);
    }
  },
  props: {
    decorations: (o) => Mi.getState(o)
  },
  view: (o) => {
    const a = () => {
      o.docView && fM(o, Mi, { awarenessUpdated: !0 });
    }, l = () => {
      const c = oe.getState(o.state), u = n.getLocalState() || {};
      if (o.hasFocus()) {
        const d = i(o.state), f = ri(
          d.anchor,
          c.type,
          c.binding.mapping
        ), h = ri(
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
      } else u.cursor != null && bn(
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
}), SM = (n) => {
  const e = Nt.getState(n).undoManager;
  if (e != null)
    return e.undo(), !0;
}, xM = (n) => {
  const e = Nt.getState(n).undoManager;
  if (e != null)
    return e.redo(), !0;
}, kM = /* @__PURE__ */ new Set(["paragraph"]), CM = (n, e) => !(n instanceof Cm) || !(n.content instanceof Tm) || !(n.content.type instanceof Em || n.content.type instanceof Mm && e.has(n.content.type.nodeName)) || n.content.type._length === 0, TM = ({ protectedNodes: n = kM, trackedOrigins: e = [], undoManager: t = null } = {}) => new De({
  key: Nt,
  state: {
    init: (r, i) => {
      const s = oe.getState(i), o = t || new km(s.type, {
        trackedOrigins: new Set([oe].concat(e)),
        deleteFilter: (a) => CM(a, n),
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
        prevSel: xa(a, s),
        hasUndoOps: c,
        hasRedoOps: u
      } : c !== i.hasUndoOps || u !== i.hasRedoOps ? Object.assign({}, i, {
        hasUndoOps: l.undoStack.length > 0,
        hasRedoOps: l.redoStack.length > 0
      }) : i;
    }
  },
  view: (r) => {
    const i = oe.getState(r.state), s = Nt.getState(r.state).undoManager;
    return s.on("stack-item-added", ({ stackItem: o }) => {
      const a = i.binding;
      a && o.meta.set(a, Nt.getState(r.state).prevSel);
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
function Up(n) {
  return !!n.getMeta(oe);
}
function EM(n, e) {
  const t = oe.getState(n);
  return bn(t.doc, t.type, e, t.binding.mapping) || 0;
}
function Hp(n, e) {
  const t = oe.getState(n);
  return ri(e, t.type, t.binding.mapping);
}
var zi = class jp extends al {
  constructor(e, t) {
    super(e), this.yRelativePosition = t;
  }
  /**
   * Creates a CollaborationMappablePosition from a JSON object.
   */
  static fromJSON(e) {
    return new jp(e.position, e.yRelativePosition);
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
function MM(n, e) {
  const t = Hp(e, n);
  return new zi(n, t);
}
function AM(n, e, t) {
  const r = n instanceof zi ? n.yRelativePosition : null;
  if (Up(e) && r) {
    const o = EM(t, r);
    return {
      position: new zi(o, r),
      mapResult: null
    };
  }
  const i = sh(n, e), s = i.position.position;
  return {
    position: new zi(
      s,
      r ?? Hp(t, s)
    ),
    mapResult: i.mapResult
  };
}
var OM = Ye.create({
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
    this.editor.utils.getUpdatedPosition = (n, e) => AM(n, e, this.editor.state), this.editor.utils.createMappablePosition = (n) => MM(n, this.editor.state);
  },
  addCommands() {
    return {
      undo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Nt.getState(e).undoManager.undoStack.length === 0 ? !1 : t ? SM(e) : !0),
      redo: () => ({ tr: n, state: e, dispatch: t }) => (n.setMeta("preventDispatch", !0), Nt.getState(e).undoManager.redoStack.length === 0 ? !1 : t ? xM(e) : !0)
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
    const n = this.options.fragment ? this.options.fragment : this.options.document.getXmlFragment(this.options.field), e = TM(this.options.yUndoOptions), t = e.spec.view;
    e.spec.view = (s) => {
      const { undoManager: o } = Nt.getState(s.state);
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
      eM(n, r),
      e,
      // Only add the filterInvalidContent plugin if content checking is enabled
      this.editor.options.enableContentCheck && new De({
        key: new Xe("filterInvalidContent"),
        filterTransaction: (s) => {
          if (!Up(s))
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
const DM = Math.floor, PM = (n, e) => n < e ? n : e, _M = (n, e) => n > e ? n : e, Kp = 128, Vi = 127, NM = Number.MAX_SAFE_INTEGER, IM = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, ii = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), RM = (n) => ii.encode(n), $M = ii ? RM : IM;
let _r = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
_r && _r.decode(new Uint8Array()).length === 1 && (_r = null);
const gs = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, Ys = (n, e) => {
  for (; e > Vi; )
    gs(n, Kp | Vi & e), e = DM(e / 128);
  gs(n, Vi & e);
}, Ta = new Uint8Array(3e4), LM = Ta.length / 3, BM = (n, e) => {
  if (e.length < LM) {
    const t = ii.encodeInto(e, Ta).written || 0;
    Ys(n, t);
    for (let r = 0; r < t; r++)
      gs(n, Ta[r]);
  } else
    qM(n, $M(e));
}, FM = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  Ys(n, r);
  for (let i = 0; i < r; i++)
    gs(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, zM = ii && /** @type {any} */
ii.encodeInto ? BM : FM, VM = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = PM(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(_M(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, qM = (n, e) => {
  Ys(n, e.byteLength), VM(n, e);
}, Jp = (n) => new Error(n), WM = Jp("Unexpected end of array"), UM = Jp("Integer out of Range"), HM = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, jM = (n) => HM(n, Il(n)), Uu = (n) => n.arr[n.pos++], Il = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Vi) * t, t *= 128, i < Kp)
      return e;
    if (e > NM)
      throw UM;
  }
  throw WM;
}, KM = (n) => {
  let e = Il(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(Uu(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(Uu(n));
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
}, JM = (n) => (
  /** @type any */
  _r.decode(jM(n))
), Hu = _r ? JM : KM;
var Gn;
(function(n) {
  n[n.Token = 0] = "Token", n[n.PermissionDenied = 1] = "PermissionDenied", n[n.Authenticated = 2] = "Authenticated";
})(Gn || (Gn = {}));
const XM = (n, e) => {
  Ys(n, Gn.Token), zM(n, e);
}, YM = (n, e, t, r) => {
  switch (Il(n)) {
    case Gn.Token: {
      e();
      break;
    }
    case Gn.PermissionDenied: {
      t(Hu(n));
      break;
    }
    case Gn.Authenticated: {
      r(Hu(n));
      break;
    }
  }
}, ju = (n) => Array.from(n.entries()).map(([e, t]) => ({
  clientId: e,
  ...t
}));
var Ea;
(function(n) {
  n[n.Connecting = 0] = "Connecting", n[n.Open = 1] = "Open", n[n.Closing = 2] = "Closing", n[n.Closed = 3] = "Closed";
})(Ea || (Ea = {}));
function GM(n) {
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
async function Ro(n) {
  return new Promise((e) => setTimeout(e, n));
}
function QM(n, e) {
  let t = e.delay;
  if (t === 0)
    return 0;
  if (e.factor && (t *= Math.pow(e.factor, n.attemptNum - 1), e.maxDelay !== 0 && (t = Math.min(t, e.maxDelay))), e.jitter) {
    const r = Math.ceil(e.minDelay), i = Math.floor(t);
    t = Math.floor(Math.random() * (i - r + 1)) + r;
  }
  return Math.round(t);
}
async function ZM(n, e) {
  const t = GM(e);
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
  }, i = t.calculateDelay || QM;
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
      return c && await Ro(c), s();
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
  if (o && await Ro(o), r.attemptNum < 1 && t.initialJitter) {
    const a = i(r, t);
    a && await Ro(a);
  }
  return s();
}
const Xp = Math.floor, eA = (n, e) => n < e ? n : e, tA = (n, e) => n > e ? n : e, nA = 64, ys = 128, rA = 63, Nr = 127, Yp = Number.MAX_SAFE_INTEGER, iA = () => /* @__PURE__ */ new Set(), sA = Array.from, oA = (n) => {
  const e = unescape(encodeURIComponent(n)), t = e.length, r = new Uint8Array(t);
  for (let i = 0; i < t; i++)
    r[i] = /** @type {number} */
    e.codePointAt(i);
  return r;
}, si = (
  /** @type {TextEncoder} */
  typeof TextEncoder < "u" ? new TextEncoder() : null
), aA = (n) => si.encode(n), lA = si ? aA : oA;
let Ir = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", { fatal: !0, ignoreBOM: !0 });
Ir && Ir.decode(new Uint8Array()).length === 1 && (Ir = null);
class cA {
  constructor() {
    this.cpos = 0, this.cbuf = new Uint8Array(100), this.bufs = [];
  }
}
const Rl = () => new cA(), Gp = (n) => {
  let e = n.cpos;
  for (let t = 0; t < n.bufs.length; t++)
    e += n.bufs[t].length;
  return e;
}, $l = (n) => {
  const e = new Uint8Array(Gp(n));
  let t = 0;
  for (let r = 0; r < n.bufs.length; r++) {
    const i = n.bufs[r];
    e.set(i, t), t += i.length;
  }
  return e.set(new Uint8Array(n.cbuf.buffer, 0, n.cpos), t), e;
}, vs = (n, e) => {
  const t = n.cbuf.length;
  n.cpos === t && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(t * 2), n.cpos = 0), n.cbuf[n.cpos++] = e;
}, _e = (n, e) => {
  for (; e > Nr; )
    vs(n, ys | Nr & e), e = Xp(e / 128);
  vs(n, Nr & e);
}, Ma = new Uint8Array(3e4), uA = Ma.length / 3, dA = (n, e) => {
  if (e.length < uA) {
    const t = si.encodeInto(e, Ma).written || 0;
    _e(n, t);
    for (let r = 0; r < t; r++)
      vs(n, Ma[r]);
  } else
    hr(n, lA(e));
}, fA = (n, e) => {
  const t = unescape(encodeURIComponent(e)), r = t.length;
  _e(n, r);
  for (let i = 0; i < r; i++)
    vs(
      n,
      /** @type {number} */
      t.codePointAt(i)
    );
}, $t = si && /** @type {any} */
si.encodeInto ? dA : fA, hA = (n, e) => {
  const t = n.cbuf.length, r = n.cpos, i = eA(t - r, e.length), s = e.length - i;
  n.cbuf.set(e.subarray(0, i), r), n.cpos += i, s > 0 && (n.bufs.push(n.cbuf), n.cbuf = new Uint8Array(tA(t * 2, s)), n.cbuf.set(e.subarray(i)), n.cpos = s);
}, hr = (n, e) => {
  _e(n, e.byteLength), hA(n, e);
}, Qp = (n) => new Error(n), Zp = Qp("Unexpected end of array"), em = Qp("Integer out of Range");
class pA {
  /**
   * @param {Uint8Array} uint8Array Binary data to decode
   */
  constructor(e) {
    this.arr = e, this.pos = 0;
  }
}
const tm = (n) => new pA(n), mA = (n, e) => {
  const t = new Uint8Array(n.arr.buffer, n.pos + n.arr.byteOffset, e);
  return n.pos += e, t;
}, Gs = (n) => mA(n, wn(n)), Ku = (n) => n.arr[n.pos++], wn = (n) => {
  let e = 0, t = 1;
  const r = n.arr.length;
  for (; n.pos < r; ) {
    const i = n.arr[n.pos++];
    if (e = e + (i & Nr) * t, t *= 128, i < ys)
      return e;
    if (e > Yp)
      throw em;
  }
  throw Zp;
}, gA = (n) => {
  let e = n.arr[n.pos++], t = e & rA, r = 64;
  const i = (e & nA) > 0 ? -1 : 1;
  if ((e & ys) === 0)
    return i * t;
  const s = n.arr.length;
  for (; n.pos < s; ) {
    if (e = n.arr[n.pos++], t = t + (e & Nr) * r, r *= 128, e < ys)
      return i * t;
    if (t > Yp)
      throw em;
  }
  throw Zp;
}, yA = (n) => {
  let e = wn(n);
  if (e === 0)
    return "";
  {
    let t = String.fromCodePoint(Ku(n));
    if (--e < 100)
      for (; e--; )
        t += String.fromCodePoint(Ku(n));
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
}, vA = (n) => (
  /** @type any */
  Ir.decode(Gs(n))
), oi = Ir ? vA : yA, bA = (n) => {
  const e = n.pos, t = oi(n);
  return n.pos = e, t;
}, lr = Date.now, $o = () => /* @__PURE__ */ new Map(), wA = (n, e, t) => {
  let r = n.get(e);
  return r === void 0 && n.set(e, r = t()), r;
};
class SA {
  constructor() {
    this._observers = $o();
  }
  /**
   * @param {N} name
   * @param {function} f
   */
  on(e, t) {
    wA(this._observers, e, iA).add(t);
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
    return sA((this._observers.get(e) || $o()).values()).forEach((r) => r(...t));
  }
  destroy() {
    this._observers = $o();
  }
}
const xA = Object.keys, Ju = (n) => xA(n).length, kA = (n, e) => Object.prototype.hasOwnProperty.call(n, e), CA = (n, e) => n === e, Rr = (n, e) => {
  if (n == null || e == null)
    return CA(n, e);
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
        if (!e.has(t) || !Rr(n.get(t), e.get(t)))
          return !1;
      break;
    }
    case Object:
      if (Ju(n) !== Ju(e))
        return !1;
      for (const t in n)
        if (!kA(n, t) || !Rr(n[t], e[t]))
          return !1;
      break;
    case Array:
      if (n.length !== e.length)
        return !1;
      for (let t = 0; t < n.length; t++)
        if (!Rr(n[t], e[t]))
          return !1;
      break;
    default:
      return !1;
  }
  return !0;
}, Lo = 3e4;
class TA extends SA {
  /**
   * @param {Y.Doc} doc
   */
  constructor(e) {
    super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = /** @type {any} */
    setInterval(() => {
      const t = lr();
      this.getLocalState() !== null && Lo / 2 <= t - /** @type {{lastUpdated:number}} */
      this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
      const r = [];
      this.meta.forEach((i, s) => {
        s !== this.clientID && Lo <= t - i.lastUpdated && this.states.has(s) && r.push(s);
      }), r.length > 0 && qi(this, r, "timeout");
    }, Xp(Lo / 10)), e.on("destroy", () => {
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
      lastUpdated: lr()
    });
    const o = [], a = [], l = [], c = [];
    e === null ? c.push(t) : s == null ? e != null && o.push(t) : (a.push(t), Rr(s, e) || l.push(t)), (o.length > 0 || l.length > 0 || c.length > 0) && this.emit("change", [{ added: o, updated: l, removed: c }, "local"]), this.emit("update", [{ added: o, updated: a, removed: c }, "local"]);
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
const qi = (n, e, t) => {
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
          lastUpdated: lr()
        });
      }
      r.push(s);
    }
  }
  r.length > 0 && (n.emit("change", [{ added: [], updated: [], removed: r }, t]), n.emit("update", [{ added: [], updated: [], removed: r }, t]));
}, Aa = (n, e, t = n.states) => {
  const r = e.length, i = Rl();
  _e(i, r);
  for (let s = 0; s < r; s++) {
    const o = e[s], a = t.get(o) || null, l = (
      /** @type {MetaClientState} */
      n.meta.get(o).clock
    );
    _e(i, o), _e(i, l), $t(i, JSON.stringify(a));
  }
  return $l(i);
}, EA = (n, e, t) => {
  const r = tm(e), i = lr(), s = [], o = [], a = [], l = [], c = wn(r);
  for (let u = 0; u < c; u++) {
    const d = wn(r);
    let f = wn(r);
    const h = JSON.parse(oi(r)), p = n.meta.get(d), m = n.states.get(d), g = p === void 0 ? 0 : p.clock;
    (g < f || g === f && h === null && n.states.has(d)) && (h === null ? d === n.clientID && n.getLocalState() != null ? f++ : n.states.delete(d) : n.states.set(d, h), n.meta.set(d, {
      clock: f,
      lastUpdated: i
    }), p === void 0 && h !== null ? s.push(d) : p !== void 0 && h === null ? l.push(d) : h !== null && (Rr(h, m) || a.push(d), o.push(d)));
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
class nm {
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
class Oa {
  constructor(e) {
    this.data = e, this.encoder = Rl(), this.decoder = tm(new Uint8Array(this.data));
  }
  peekVarString() {
    return bA(this.decoder);
  }
  readVarUint() {
    return wn(this.decoder);
  }
  readVarString() {
    return oi(this.decoder);
  }
  readVarUint8Array() {
    return Gs(this.decoder);
  }
  writeVarUint(e) {
    return _e(this.encoder, e);
  }
  writeVarString(e) {
    return $t(this.encoder, e);
  }
  writeVarUint8Array(e) {
    return hr(this.encoder, e);
  }
  length() {
    return Gp(this.encoder);
  }
}
var Te;
(function(n) {
  n[n.Sync = 0] = "Sync", n[n.Awareness = 1] = "Awareness", n[n.Auth = 2] = "Auth", n[n.QueryAwareness = 3] = "QueryAwareness", n[n.Stateless = 5] = "Stateless", n[n.CLOSE = 7] = "CLOSE", n[n.SyncStatus = 8] = "SyncStatus";
})(Te || (Te = {}));
var Re;
(function(n) {
  n.Connecting = "connecting", n.Connected = "connected", n.Disconnected = "disconnected";
})(Re || (Re = {}));
class In {
  constructor() {
    this.encoder = Rl();
  }
  get(e) {
    return e.encoder;
  }
  toUint8Array() {
    return $l(this.encoder);
  }
}
class MA extends In {
  constructor() {
    super(...arguments), this.type = Te.CLOSE, this.description = "Ask the server to close the connection";
  }
  get(e) {
    return $t(this.encoder, e.documentName), _e(this.encoder, this.type), this.encoder;
  }
}
class AA extends nm {
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
    }, this.webSocket = null, this.webSocketHandlers = {}, this.shouldConnect = !0, this.status = Re.Disconnected, this.lastMessageReceived = 0, this.identifier = 0, this.intervals = {
      connectionChecker: null
    }, this.connectionAttempt = null, this.receivedOnOpenPayload = void 0, this.closeTries = 0, this.setConfiguration(e), this.configuration.WebSocketPolyfill = e.WebSocketPolyfill ? e.WebSocketPolyfill : WebSocket, this.on("open", this.configuration.onOpen), this.on("open", this.onOpen.bind(this)), this.on("connect", this.configuration.onConnect), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("status", this.configuration.onStatus), this.on("disconnect", this.configuration.onDisconnect), this.on("close", this.configuration.onClose), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("close", this.onClose.bind(this)), this.on("message", this.onMessage.bind(this)), this.intervals.connectionChecker = setInterval(this.checkConnection.bind(this), this.configuration.messageReconnectTimeout / 10), this.shouldConnect && this.connect();
  }
  async onOpen(e) {
    this.status = Re.Connected, this.emit("status", { status: Re.Connected }), this.cancelWebsocketRetry = void 0, this.receivedOnOpenPayload = e;
  }
  attach(e) {
    this.configuration.providerMap.set(e.configuration.name, e), this.status === Re.Disconnected && this.shouldConnect && this.connect(), this.receivedOnOpenPayload && this.status === Re.Connected && e.onOpen(this.receivedOnOpenPayload);
  }
  detach(e) {
    this.configuration.providerMap.has(e.configuration.name) && (e.send(MA, {
      documentName: e.configuration.name
    }), this.configuration.providerMap.delete(e.configuration.name));
  }
  setConfiguration(e = {}) {
    this.configuration = { ...this.configuration, ...e }, this.configuration.autoConnect || (this.shouldConnect = !1);
  }
  async connect() {
    if (this.status === Re.Connected)
      return;
    this.cancelWebsocketRetry && (this.cancelWebsocketRetry(), this.cancelWebsocketRetry = void 0), this.receivedOnOpenPayload = void 0, this.shouldConnect = !0;
    const e = () => {
      let i = !1;
      return {
        retryPromise: ZM(this.createWebSocketConnection.bind(this), {
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
      r.binaryType = "arraybuffer", r.identifier = this.identifier, this.attachWebSocketListeners(r, t), this.webSocket = r, this.status = Re.Connecting, this.emit("status", { status: Re.Connecting }), this.connectionAttempt = {
        resolve: e,
        reject: t
      };
    });
  }
  onMessage(e) {
    var t;
    this.resolveConnectionAttempt(), this.lastMessageReceived = lr();
    const i = new Oa(e.data).peekVarString();
    (t = this.configuration.providerMap.get(i)) === null || t === void 0 || t.onMessage(e);
  }
  resolveConnectionAttempt() {
    this.connectionAttempt && (this.connectionAttempt.resolve(), this.connectionAttempt = null, this.status = Re.Connected, this.emit("status", { status: Re.Connected }), this.emit("connect"), this.messageQueue.forEach((e) => this.send(e)), this.messageQueue = []);
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
    this.status === Re.Connected && this.lastMessageReceived && (this.configuration.messageReconnectTimeout >= lr() - this.lastMessageReceived || (this.closeTries += 1, this.closeTries > 2 ? (this.onClose({
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
    ((t = this.webSocket) === null || t === void 0 ? void 0 : t.readyState) === Ea.Open ? this.webSocket.send(e) : this.messageQueue.push(e);
  }
  onClose({ event: e }) {
    this.closeTries = 0, this.cleanupWebSocket(), this.connectionAttempt && this.rejectConnectionAttempt(), this.status = Re.Disconnected, this.emit("status", { status: Re.Disconnected }), this.emit("disconnect", { event: e }), !this.cancelWebsocketRetry && this.shouldConnect && setTimeout(() => {
      this.connect();
    }, this.configuration.delay);
  }
  destroy() {
    this.emit("destroy"), clearInterval(this.intervals.connectionChecker), this.stopConnectionAttempt(), this.disconnect(), this.removeAllListeners(), this.cleanupWebSocket();
  }
}
const rm = 0, Ll = 1, im = 2, OA = (n, e) => {
  _e(n, rm);
  const t = W.encodeStateVector(e);
  hr(n, t);
}, DA = (n, e, t) => {
  _e(n, Ll), hr(n, W.encodeStateAsUpdate(e, t));
}, PA = (n, e, t) => DA(e, t, Gs(n)), sm = (n, e, t) => {
  try {
    W.applyUpdate(e, Gs(n), t);
  } catch (r) {
    console.error("Caught error while handling a Yjs update", r);
  }
}, _A = (n, e) => {
  _e(n, im), hr(n, e);
}, NA = sm, IA = (n, e, t, r) => {
  const i = wn(n);
  switch (i) {
    case rm:
      PA(n, e, t);
      break;
    case Ll:
      sm(n, t, r);
      break;
    case im:
      NA(n, t, r);
      break;
    default:
      throw new Error("Unknown message type");
  }
  return i;
};
class RA {
  constructor(e) {
    this.message = e;
  }
  apply(e, t) {
    const { message: r } = this, i = r.readVarUint(), s = r.length();
    switch (i) {
      case Te.Sync:
        this.applySyncMessage(e, t);
        break;
      case Te.Awareness:
        this.applyAwarenessMessage(e);
        break;
      case Te.Auth:
        this.applyAuthMessage(e);
        break;
      case Te.QueryAwareness:
        this.applyQueryAwarenessMessage(e);
        break;
      case Te.Stateless:
        e.receiveStateless(oi(r.decoder));
        break;
      case Te.SyncStatus:
        this.applySyncStatusMessage(e, gA(r.decoder) === 1);
        break;
      case Te.CLOSE:
        const o = {
          code: 1e3,
          reason: oi(r.decoder),
          // @ts-ignore
          target: e.configuration.websocketProvider.webSocket,
          type: "close"
        };
        e.onClose(), e.configuration.onClose({ event: o }), e.forwardClose({ event: o });
        break;
      default:
        throw new Error(`Can’t apply message of unknown type: ${i}`);
    }
    r.length() > s + 1 && e.send(In, { encoder: r.encoder });
  }
  applySyncMessage(e, t) {
    const { message: r } = this;
    r.writeVarUint(Te.Sync);
    const i = IA(r.decoder, r.encoder, e.document, e);
    t && i === Ll && (e.synced = !0);
  }
  applySyncStatusMessage(e, t) {
    t && e.decrementUnsyncedChanges();
  }
  applyAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    EA(e.awareness, t.readVarUint8Array(), e);
  }
  applyAuthMessage(e) {
    const { message: t } = this;
    YM(t.decoder, e.sendToken.bind(e), e.permissionDeniedHandler.bind(e), e.authenticatedHandler.bind(e));
  }
  applyQueryAwarenessMessage(e) {
    if (!e.awareness)
      return;
    const { message: t } = this;
    t.writeVarUint(Te.Awareness), t.writeVarUint8Array(Aa(e.awareness, Array.from(e.awareness.getStates().keys())));
  }
}
class $A {
  constructor(e, t = {}) {
    this.message = new e(), this.encoder = this.message.get(t);
  }
  create() {
    return $l(this.encoder);
  }
  send(e) {
    e?.send(this.create());
  }
}
class LA extends In {
  constructor() {
    super(...arguments), this.type = Te.Auth, this.description = "Authentication";
  }
  get(e) {
    if (typeof e.token > "u")
      throw new Error("The authentication message requires `token` as an argument.");
    return $t(this.encoder, e.documentName), _e(this.encoder, this.type), XM(this.encoder, e.token), this.encoder;
  }
}
class Xu extends In {
  constructor() {
    super(...arguments), this.type = Te.Awareness, this.description = "Awareness states update";
  }
  get(e) {
    if (typeof e.awareness > "u")
      throw new Error("The awareness message requires awareness as an argument");
    if (typeof e.clients > "u")
      throw new Error("The awareness message requires clients as an argument");
    $t(this.encoder, e.documentName), _e(this.encoder, this.type);
    let t;
    return e.states === void 0 ? t = Aa(e.awareness, e.clients) : t = Aa(e.awareness, e.clients, e.states), hr(this.encoder, t), this.encoder;
  }
}
class BA extends In {
  constructor() {
    super(...arguments), this.type = Te.Stateless, this.description = "A stateless message";
  }
  get(e) {
    var t;
    return $t(this.encoder, e.documentName), _e(this.encoder, this.type), $t(this.encoder, (t = e.payload) !== null && t !== void 0 ? t : ""), this.encoder;
  }
}
class Yu extends In {
  constructor() {
    super(...arguments), this.type = Te.Sync, this.description = "First sync step";
  }
  get(e) {
    if (typeof e.document > "u")
      throw new Error("The sync step one message requires document as an argument");
    return $t(this.encoder, e.documentName), _e(this.encoder, this.type), OA(this.encoder, e.document), this.encoder;
  }
}
class FA extends In {
  constructor() {
    super(...arguments), this.type = Te.Sync, this.description = "A document update";
  }
  get(e) {
    return $t(this.encoder, e.documentName), _e(this.encoder, this.type), _A(this.encoder, e.update), this.encoder;
  }
}
class zA extends Error {
  constructor() {
    super(...arguments), this.code = 1001;
  }
}
class VA extends nm {
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
    }, this.boundDocumentUpdateHandler = this.documentUpdateHandler.bind(this), this.boundAwarenessUpdateHandler = this.awarenessUpdateHandler.bind(this), this.boundPageHide = this.pageHide.bind(this), this.boundOnOpen = this.onOpen.bind(this), this.boundOnClose = this.onClose.bind(this), this.forwardConnect = () => this.emit("connect"), this.forwardStatus = (s) => this.emit("status", s), this.forwardClose = (s) => this.emit("close", s), this.forwardDisconnect = (s) => this.emit("disconnect", s), this.forwardDestroy = () => this.emit("destroy"), this.setConfiguration(e), this.configuration.document = e.document ? e.document : new W.Doc(), this.configuration.awareness = e.awareness !== void 0 ? e.awareness : new TA(this.document), this.on("open", this.configuration.onOpen), this.on("message", this.configuration.onMessage), this.on("outgoingMessage", this.configuration.onOutgoingMessage), this.on("synced", this.configuration.onSynced), this.on("destroy", this.configuration.onDestroy), this.on("awarenessUpdate", this.configuration.onAwarenessUpdate), this.on("awarenessChange", this.configuration.onAwarenessChange), this.on("stateless", this.configuration.onStateless), this.on("unsyncedChanges", this.configuration.onUnsyncedChanges), this.on("authenticated", this.configuration.onAuthenticated), this.on("authenticationFailed", this.configuration.onAuthenticationFailed), (t = this.awareness) === null || t === void 0 || t.on("update", () => {
      this.emit("awarenessUpdate", {
        states: ju(this.awareness.getStates())
      });
    }), (r = this.awareness) === null || r === void 0 || r.on("change", () => {
      this.emit("awarenessChange", {
        states: ju(this.awareness.getStates())
      });
    }), this.document.on("update", this.boundDocumentUpdateHandler), (i = this.awareness) === null || i === void 0 || i.on("update", this.boundAwarenessUpdateHandler), this.registerEventListeners(), this.configuration.forceSyncInterval && typeof this.configuration.forceSyncInterval == "number" && (this.intervals.forceSync = setInterval(this.forceSync.bind(this), this.configuration.forceSyncInterval)), this.manageSocket && this.attach();
  }
  setConfiguration(e = {}) {
    e.websocketProvider || (this.manageSocket = !0, this.configuration.websocketProvider = new AA(e)), this.configuration = { ...this.configuration, ...e };
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
    this.resetUnsyncedChanges(), this.send(Yu, {
      document: this.document,
      documentName: this.configuration.name
    });
  }
  pageHide() {
    this.awareness && qi(this.awareness, [this.document.clientID], "page hide");
  }
  registerEventListeners() {
    typeof window > "u" || !("addEventListener" in window) || window.addEventListener("pagehide", this.boundPageHide);
  }
  sendStateless(e) {
    this.send(BA, {
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
    this.send(LA, {
      token: e ?? "",
      documentName: this.configuration.name
    });
  }
  documentUpdateHandler(e, t) {
    t !== this && (this.incrementUnsyncedChanges(), this.send(FA, { update: e, documentName: this.configuration.name }));
  }
  awarenessUpdateHandler({ added: e, updated: t, removed: r }, i) {
    const s = e.concat(t).concat(r);
    this.send(Xu, {
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
    this.resetUnsyncedChanges(), this.send(Yu, {
      document: this.document,
      documentName: this.configuration.name
    }), this.awareness && this.awareness.getLocalState() !== null && this.send(Xu, {
      awareness: this.awareness,
      clients: [this.document.clientID],
      documentName: this.configuration.name
    });
  }
  send(e, t) {
    if (!this._isAttached)
      return;
    const r = new $A(e, t);
    this.emit("outgoingMessage", { message: r.message }), r.send(this.configuration.websocketProvider);
  }
  onMessage(e) {
    const t = new Oa(e.data), r = t.readVarString();
    t.writeVarString(r), this.emit("message", { event: e, message: new Oa(e.data) }), new RA(t).apply(this, !0);
  }
  onClose() {
    this.isAuthenticated = !1, this.synced = !1, this.awareness && qi(this.awareness, Array.from(this.awareness.getStates().keys()).filter((e) => e !== this.document.clientID), this);
  }
  destroy() {
    this.emit("destroy"), this.intervals.forceSync && clearInterval(this.intervals.forceSync), this.awareness && (qi(this.awareness, [this.document.clientID], "provider destroy"), this.awareness.off("update", this.boundAwarenessUpdateHandler), this.awareness.destroy()), this.document.off("update", this.boundDocumentUpdateHandler), this.removeAllListeners(), this.detach(), this.manageSocket && this.configuration.websocketProvider.destroy(), !(typeof window > "u" || !("removeEventListener" in window)) && window.removeEventListener("pagehide", this.boundPageHide);
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
      throw new zA(`Cannot set awareness field "${e}" to ${JSON.stringify(t)}. You have disabled Awareness for this provider by explicitly passing awareness: null in the provider configuration.`);
    this.awareness.setLocalStateField(e, t);
  }
}
const om = dl.create({
  name: "doc",
  topNode: !0,
  content: "turn+"
}), qA = /* @__PURE__ */ B({
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
    const e = n, t = Lt(), r = O(() => {
      const o = e.node.attrs.speakerId;
      return o ? t.speakers.all.get(o) : void 0;
    }), i = O(() => r.value?.color ?? "transparent"), s = O(() => {
      if (!t.audio?.src.value) return !1;
      const { startTime: o, endTime: a } = e.node.attrs;
      if (o == null || a == null) return !1;
      const l = t.audio.currentTime.value;
      return l >= o && l <= a;
    });
    return (o, a) => (A(), z(v(tS), {
      as: "section",
      class: $r(["turn", { "turn--active": s.value }]),
      style: On({ "--speaker-color": i.value }),
      "data-turn-id": n.node.attrs.id
    }, {
      default: N(() => [
        F(pd, {
          speaker: r.value,
          "start-time": n.node.attrs.startTime,
          language: n.node.attrs.language
        }, null, 8, ["speaker", "start-time", "language"]),
        F(v(eS), {
          as: "p",
          class: "turn-text"
        })
      ]),
      _: 1
    }, 8, ["class", "style", "data-turn-id"]));
  }
}), WA = /* @__PURE__ */ Oe(qA, [["__scopeId", "data-v-9437fb29"]]), am = dl.create({
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
      eh(n, { "data-type": "turn" }),
      0
    ];
  },
  addKeyboardShortcuts() {
    const n = of((e) => e.type.name !== "turn" ? null : {
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
    return iS(WA);
  }
});
function UA(n) {
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
const HA = new Xe("storeSync"), jA = Ye.create({
  name: "storeSync",
  addProseMirrorPlugins() {
    const { store: n, getTranslation: e } = this.options;
    return [
      new De({
        key: HA,
        appendTransaction(t, r, i) {
          if (r.doc.eq(i.doc)) return null;
          if (!t.some(
            (a) => a.getMeta(oe)
          )) {
            const a = JA(i);
            if (a) return a;
          }
          const o = e();
          return o && KA(i.doc, o, n), null;
        }
      })
    ];
  }
});
function KA(n, e, t) {
  const r = UA(n), i = e.turns.value, s = new Map(i.map((c) => [c.id, c])), o = r.map((c) => {
    const u = s.get(c.id);
    if (!u) return c;
    const d = u.words.length > 0 ? u.words.map((f) => f.text).join(" ") : u.text ?? "";
    return c.text === d ? { ...c, words: u.words } : c;
  }), a = e.id, l = new Map(o.map((c) => [c.id, c]));
  for (const c of i)
    l.has(c.id) || t.emit("turn:remove", { turnId: c.id, translationId: a });
  for (const c of o) {
    const u = s.get(c.id);
    u ? XA(u, c) && t.emit("turn:update", { turn: c, translationId: a }) : t.emit("turn:add", { turn: c, translationId: a });
  }
  e.turns.value = o;
}
function JA(n) {
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
function XA(n, e) {
  return n.text !== e.text || n.speakerId !== e.speakerId || n.language !== e.language || n.startTime !== e.startTime || n.endTime !== e.endTime || n.words.length !== e.words.length;
}
const Ai = new Xe("wordHighlight"), YA = Ye.create({
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
              We.inline(m, g, {
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
      new De({
        key: Ai,
        state: {
          init() {
            return le.empty;
          },
          apply(i, s) {
            return i.getMeta(Ai) ? t() : i.docChanged ? s.map(i.mapping, i.doc) : s;
          }
        },
        props: {
          decorations(i) {
            return Ai.getState(i);
          }
        },
        view() {
          return r = te(
            () => n.audio?.activeWordId.value,
            () => {
              const i = e.state.tr.setMeta(Ai, !0);
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
}), GA = Ye.create(
  {
    name: "collaborationCursor",
    addProseMirrorPlugins() {
      const { awareness: n, user: e } = this.options;
      return n.setLocalStateField("user", e), [
        wM(n, {
          cursorBuilder: QA
        })
      ];
    }
  }
);
function QA(n) {
  const e = document.createElement("span");
  e.classList.add("collaboration-cursor__caret"), e.style.borderColor = String(n.color ?? "#999");
  const t = document.createElement("div");
  return t.classList.add("collaboration-cursor__label"), t.style.backgroundColor = String(n.color ?? "#999"), t.textContent = String(n.name ?? "Anonymous"), e.appendChild(t), e;
}
function ZA(n) {
  return {
    type: "doc",
    content: n.map((e) => eO(e))
  };
}
function eO(n) {
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
function yO(n = {}) {
  const {
    collab: e,
    field: t = "default",
    user: r = { name: "Anonymous", color: "#999999" }
  } = n;
  return {
    name: "transcriptionEditor",
    install(i) {
      const s = Sn(void 0), o = D([]), a = D(!1), l = [];
      let c = null, u = null;
      const d = {
        tiptapEditor: s,
        get doc() {
          return u;
        },
        get fragment() {
          return u.getXmlFragment(t);
        },
        users: o,
        isConnected: a,
        updateUser(m) {
          c?.awareness && (Object.assign(r, m), c.awareness.setLocalStateField("user", r));
        }
      };
      i.transcriptionEditor = d;
      function f() {
        s.value?.destroy(), s.value = void 0, c && (c.destroy(), c = null), u && (u.destroy(), u = null), a.value = !1, o.value = [];
      }
      function h(m, g) {
        f();
        const y = new Am();
        if (u = y, e) {
          const S = new VA({
            url: e.url,
            name: m,
            token: e.token,
            document: y,
            onSynced() {
              a.value = !0;
            },
            onDisconnect() {
              a.value = !1;
            },
            onAwarenessUpdate({ states: b }) {
              o.value = b.map((k) => ({
                clientId: k.clientId,
                ...k.user
              }));
            }
          });
          c = S;
          const x = te(a, (b) => {
            b && (x(), Gu(i, n, y, t, s, S.awareness, l));
          }, { immediate: !0 });
          l.push(x);
        } else {
          const S = y.getXmlFragment(t), x = ZA(g.turns.value), b = Y0([om, am, hp]);
          mM(b, x, S), a.value = !0, Gu(i, n, y, t, s, null, l);
        }
      }
      const p = te(
        () => i.activeChannel.value,
        (m) => {
          if (!m) return;
          p();
          const g = O(
            () => i.activeChannel.value.activeTranslation.value
          );
          h(g.value.id, g.value);
          const y = te(
            () => g.value.id,
            (S) => {
              h(S, g.value);
            }
          );
          l.push(y);
        },
        { immediate: !0 }
      );
      return () => {
        p(), l.forEach((m) => m()), f(), i.transcriptionEditor = void 0;
      };
    }
  };
}
function Gu(n, e, t, r, i, s, o) {
  const a = O(
    () => n.activeChannel.value.activeTranslation.value
  ), l = [
    om,
    am,
    hp,
    OM.configure({
      document: t,
      field: r
    }),
    jA.configure({
      store: n,
      getTranslation: () => a.value
    }),
    YA.configure({ core: n }),
    ...n.pluginExtensions
  ];
  s && l.push(
    GA.configure({
      awareness: s,
      user: e.user ?? { name: "Anonymous", color: "#999999" }
    })
  ), i.value = new Qw({
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
function Qu(n) {
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
function Bo(n, e) {
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
function vO() {
  return {
    name: "live",
    install(n) {
      const e = Sn(null), t = D(!1);
      t.value = !0;
      function r() {
        e.value = null, zl(e);
      }
      function i(x, b) {
        if (n.activeChannelId.value !== b) return;
        const k = n.activeChannel.value;
        if (!k) return;
        const C = k.activeTranslation.value;
        if (C.isSource) {
          if (x.text == null) return;
          e.value = x.text;
        } else if (x.translations) {
          const w = x.translations.find(
            (E) => E.translationId === C.id
          );
          e.value = w?.text ?? null;
        } else
          return;
        zl(e);
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
      function l(x, b) {
        x.turns.value.some((C) => C.id === b.id) ? x.updateTurn(b.id, b) : x.addTurn(b);
      }
      function c(x, b) {
        x.speakerId && n.speakers.ensure(x.speakerId);
        const k = n.channels.get(b);
        if (!k) {
          f();
          return;
        }
        if (x.text != null && l(
          k.sourceTranslation,
          Qu(x)
        ), x.translations)
          for (const C of x.translations) {
            const w = k.translations.get(C.translationId);
            w && l(
              w,
              Bo(x, C)
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
        for (const T of x)
          T.speakerId && !C.has(T.speakerId) && (C.add(T.speakerId), n.speakers.ensure(T.speakerId));
        const w = [];
        for (const T of x)
          T.text != null && w.push(Qu(T));
        w.length > 0 && k.sourceTranslation.prependTurns(w);
        const E = /* @__PURE__ */ new Map();
        for (const T of x)
          if (T.translations)
            for (const M of T.translations) {
              let I = E.get(M.translationId);
              I || (I = [], E.set(M.translationId, I)), I.push(Bo(T, M));
            }
        for (const [T, M] of E) {
          const I = k.translations.get(T);
          I && I.prependTurns(M);
        }
      }
      function f() {
        a(), r();
      }
      function h(x) {
        const b = n.activeChannel.value;
        if (!b) return;
        const k = b.activeTranslation.value;
        if (!x.final && k.languages.includes(x.language))
          e.value = x.text;
        else if (x.final) {
          const C = b.translations.get(x.language);
          C && l(
            C,
            Bo({ ...x }, x)
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
      ), S = n.on("channel:sync", o);
      return n.live = p, () => {
        f(), m(), g(), y(), S(), n.live = void 0;
      };
    }
  };
}
function bO(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = D(n.fontSize ?? 40), r = D(!0), i = D(!1), s = {
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
function tO(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function wO(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = n.text.map((i) => {
    const s = i.words.map(tO), o = s[0]?.startTime ?? i.stime, a = s.length > 0 ? s[s.length - 1].endTime ?? i.etime : i.etime;
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
let lm = 0;
function nO(n) {
  return {
    id: `w_${lm++}`,
    text: n.word,
    startTime: n.start,
    endTime: n.end,
    confidence: n.score
  };
}
function SO(n) {
  lm = 0;
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = s.words.map(nO);
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
  qe as DocumentValidationError,
  hO as Layout,
  pO as createAudioPlugin,
  sO as createCore,
  vO as createLivePlugin,
  bO as createSubtitlePlugin,
  yO as createTranscriptionEditorPlugin,
  wO as mapApiDocument,
  SO as mapWhisperXDocument,
  oO as provideCore,
  aO as provideI18n,
  Lt as useCore,
  Wm as validateEditorDocument
};
