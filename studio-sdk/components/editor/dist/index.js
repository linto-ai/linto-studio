import * as ti from "vue";
import { shallowReactive as Ln, ref as T, computed as P, inject as Ut, provide as Kt, h as Me, defineComponent as D, openBlock as x, createElementBlock as N, renderSlot as B, useSlots as Zr, normalizeClass as zt, createCommentVNode as K, createElementVNode as z, toDisplayString as G, createVNode as L, withCtx as k, createTextVNode as ue, createBlock as I, unref as f, Fragment as pe, watch as Q, customRef as Jr, toValue as oe, getCurrentScope as zi, onScopeDispose as Ni, onBeforeUnmount as xt, effectScope as Hi, getCurrentInstance as Qe, shallowRef as ut, watchEffect as se, readonly as Wi, nextTick as re, onMounted as ee, toHandlerKey as Qr, camelize as Vi, toRef as $t, onUnmounted as _e, toRefs as qe, Comment as eo, mergeProps as j, cloneVNode as to, normalizeStyle as Ie, reactive as ji, Teleport as Ui, normalizeProps as Dn, guardReactiveProps as Mn, markRaw as no, renderList as et, watchPostEffect as Ki, shallowReadonly as rt, mergeDefaults as io, withKeys as mt, withModifiers as He, watchSyncEffect as ro, withMemo as oo, resolveDynamicComponent as so, useTemplateRef as gt, Transition as ao, useId as lo, useModel as uo, withDirectives as co, vShow as fo, triggerRef as ni } from "vue";
function po() {
  const n = /* @__PURE__ */ new Map();
  function e(o, s) {
    let a = n.get(o);
    return a || (a = /* @__PURE__ */ new Set(), n.set(o, a)), a.add(s), () => t(o, s);
  }
  function t(o, s) {
    n.get(o)?.delete(s);
  }
  function i(o, s) {
    n.get(o)?.forEach(
      (a) => a(s)
    );
  }
  function r() {
    n.clear();
  }
  return { on: e, off: t, emit: i, clear: r };
}
const ii = [
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
function ho(n, e, t) {
  const i = ii[n.size % ii.length];
  return { id: e, name: t, color: i };
}
function vo(n, e, t) {
  return !e || n.has(e) ? null : ho(n, e, t ?? e);
}
function mo(n, e, t) {
  const i = n.get(e);
  return i ? { ...i, ...t } : null;
}
function go(n) {
  const e = Ln(/* @__PURE__ */ new Map());
  function t(o, s) {
    const a = vo(e, o, s);
    a && (e.set(a.id, a), n("speaker:add", { speaker: a }));
  }
  function i(o, s) {
    const a = mo(e, o, s);
    a && (e.set(o, a), n("speaker:update", { speaker: a }));
  }
  function r() {
    e.clear();
  }
  return { all: e, ensure: t, update: i, clear: r };
}
function yo(n, e) {
  return [...n, e];
}
function bo(n, e) {
  return [...e, ...n];
}
function wo(n, e, t) {
  const i = n.findIndex((o) => o.id === e);
  if (i === -1) return null;
  const r = { ...n[i], ...t, id: e };
  return {
    turns: n.map((o, s) => s === i ? r : o),
    updated: r
  };
}
function So(n, e) {
  const t = n.findIndex((i) => i.id === e);
  return t === -1 ? null : n.filter((i, r) => r !== t);
}
function _o(n, e, t) {
  const i = n.findIndex((s) => s.id === e);
  if (i === -1) return null;
  const r = n[i], o = {
    ...r,
    words: t,
    text: null,
    startTime: t[0]?.startTime ?? r.startTime,
    endTime: t[t.length - 1]?.endTime ?? r.endTime
  };
  return {
    turns: n.map((s, a) => a === i ? o : s),
    updated: o
  };
}
function Co(n, e, t) {
  const { id: i, languages: r, isSource: o, audio: s } = n, a = T(n.turns), l = T(!1), u = T(!0);
  function c(g) {
    t(g.speakerId), a.value = yo(a.value, g), e("turn:add", { turn: g, translationId: i });
  }
  function d(g, b) {
    const m = wo(a.value, g, b);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function p(g) {
    const b = So(a.value, g);
    b && (a.value = b, e("turn:remove", { turnId: g, translationId: i }));
  }
  function h(g, b) {
    const m = _o(a.value, g, b);
    m && (a.value = m.turns, e("turn:update", { turn: m.updated, translationId: i }));
  }
  function v(g) {
    const b = /* @__PURE__ */ new Set();
    for (const m of g)
      m.speakerId && !b.has(m.speakerId) && (b.add(m.speakerId), t(m.speakerId));
    a.value = bo(a.value, g), e("turns:prepend", { turns: g, translationId: i });
  }
  function y(g) {
    const b = /* @__PURE__ */ new Set();
    for (const m of g)
      m.speakerId && !b.has(m.speakerId) && (b.add(m.speakerId), t(m.speakerId));
    a.value = g, e("translation:sync", { translationId: i });
  }
  return { id: i, languages: r, isSource: o, audio: s, turns: a, isLoadingHistory: l, hasMoreHistory: u, addTurn: c, prependTurns: v, updateTurn: d, removeTurn: p, updateWords: h, setTurns: y };
}
function ri(n, e, t) {
  const { id: i, name: r, description: o, duration: s } = n, a = Ln(/* @__PURE__ */ new Map());
  let l;
  for (const p of n.translations) {
    const h = Co(p, e, t);
    a.set(p.id, h), p.isSource && !l && (l = h);
  }
  l || (l = a.values().next().value);
  const u = T(null), c = P(() => u.value ? a.get(u.value) ?? l : l);
  function d(p) {
    const h = p === l.id ? null : p;
    h !== u.value && (u.value = h, e("translation:change", { translationId: u.value }));
  }
  return {
    id: i,
    name: r,
    description: o,
    duration: s,
    translations: a,
    sourceTranslation: l,
    activeTranslation: c,
    setActiveTranslation: d
  };
}
function Eo(n) {
  const e = [];
  for (const [t, i] of n.speakers)
    e.push({ id: t, name: i.name });
  for (const t of n.channels)
    for (const i of t.translations)
      for (const r of i.turns)
        r.speakerId && e.push({ id: r.speakerId, name: r.speakerId });
  return e;
}
function xo(n, e) {
  const t = n.replace("#", ""), i = parseInt(t.substring(0, 2), 16), r = parseInt(t.substring(2, 4), 16), o = parseInt(t.substring(4, 6), 16);
  return `rgba(${i}, ${r}, ${o}, ${e})`;
}
function $n(n, e, t = "*") {
  if (n === "*") return t;
  try {
    return new Intl.DisplayNames([e], { type: "language" }).of(n) ?? n;
  } catch {
    return n;
  }
}
function Xi(n, e, t, i = "*") {
  return n.map((r) => ({
    value: r.id,
    label: r.languages.map((o) => $n(o, e, i)).join(", ") + (r.isSource ? ` (${t})` : "")
  }));
}
function Yi(n, e = 250) {
  let t = !1, i = null;
  return (...r) => {
    if (t) {
      i = r;
      return;
    }
    t = !0, n(...r), setTimeout(() => {
      if (t = !1, i !== null) {
        const o = i;
        i = null, n(...o);
      }
    }, e);
  };
}
function Nt(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), i = Math.floor(e % 3600 / 60), r = e % 60, o = String(i).padStart(2, "0"), s = String(r).padStart(2, "0");
  return t > 0 ? `${t}:${o}:${s}` : `${o}:${s}`;
}
class ce extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function ko(n) {
  if (n == null || typeof n != "object")
    throw new ce("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new ce("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new ce("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new ce("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const i = e.channels[t], r = `channels[${t}]`;
    if (i == null || typeof i != "object")
      throw new ce(r, "must be a non-null object");
    if (typeof i.id != "string")
      throw new ce(`${r}.id`, "must be a string");
    if (typeof i.name != "string")
      throw new ce(`${r}.name`, "must be a string");
    if (typeof i.duration != "number")
      throw new ce(`${r}.duration`, "must be a number");
    if (!Array.isArray(i.translations))
      throw new ce(`${r}.translations`, "must be an array");
    for (let o = 0; o < i.translations.length; o++) {
      const s = i.translations[o], a = `${r}.translations[${o}]`;
      if (s == null || typeof s != "object")
        throw new ce(a, "must be a non-null object");
      if (typeof s.id != "string")
        throw new ce(`${a}.id`, "must be a string");
      if (!Array.isArray(s.languages))
        throw new ce(`${a}.languages`, "must be an array");
      if (typeof s.isSource != "boolean")
        throw new ce(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(s.turns))
        throw new ce(`${a}.turns`, "must be an array");
    }
  }
}
function To(n, e) {
  const { width: t, height: i } = e.canvas, r = n[0], o = r.length / t, s = 0.5;
  e.translate(0, i / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += s * 2) {
    const l = Math.floor(a * o), u = Math.abs(r[l] ?? 0);
    let c = a, d = u * (i / 2);
    e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + s, 0), c = c + s, d = -d, e.moveTo(c, 0), e.lineTo(c, d), e.lineTo(c + s, 0);
  }
  e.stroke(), e.closePath();
}
function Gi(n) {
  return n.length > 0 && n[0].startTime !== void 0;
}
function Po(n, e) {
  if (!Gi(n)) return null;
  let t = 0, i = n.length - 1;
  for (; t <= i; ) {
    const r = t + i >>> 1, o = n[r];
    if (e < o.startTime)
      i = r - 1;
    else if (e > o.endTime)
      t = r + 1;
    else
      return o.id;
  }
  return null;
}
function Zd(n = {}) {
  const e = T(""), t = T(n.activeChannelId ?? ""), i = T(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: r, off: o, emit: s, clear: a } = po(), l = go(s), u = l, c = Ln(/* @__PURE__ */ new Map()), d = P(
    () => c.get(t.value) ?? [...c.values()][0]
  );
  function p(_, E) {
    return r(_, (C) => {
      C.translationId === d.value.activeTranslation.value.id && E(C);
    });
  }
  function h(_) {
    e.value = _.title, l.clear(), c.clear();
    for (const E of Eo(_))
      u.ensure(E.id, E.name);
    for (const E of _.channels)
      c.set(E.id, ri(E, s, u.ensure));
    c.size > 0 && !c.has(t.value) && (t.value = c.keys().next().value);
  }
  function v(_) {
    ko(_), h(_);
  }
  function y(_) {
    _ !== t.value && (t.value = _, s("channel:change", { channelId: _ }));
  }
  function g(_, E) {
    if (!c.has(_)) return;
    const C = /* @__PURE__ */ new Set();
    for (const A of E.translations)
      for (const O of A.turns)
        O.speakerId && !C.has(O.speakerId) && (C.add(O.speakerId), u.ensure(O.speakerId));
    c.set(_, ri(E, s, u.ensure)), s("channel:sync", { channelId: _ });
  }
  const b = [];
  function m(_) {
    const E = _.install(w);
    E && b.push(E);
  }
  function S() {
    s("destroy", void 0), b.forEach((_) => _()), b.length = 0, a();
  }
  n.document && h(n.document);
  const w = {
    title: e,
    activeChannelId: t,
    capabilities: i,
    speakers: u,
    channels: c,
    activeChannel: d,
    onActiveTranslation: p,
    setDocument: v,
    setActiveChannel: y,
    setChannel: g,
    on: r,
    off: o,
    emit: s,
    use: m,
    destroy: S
  };
  return w;
}
const Zi = /* @__PURE__ */ Symbol("editorStore");
function Jd(n) {
  Kt(Zi, n);
}
function tt() {
  const n = Ut(Zi);
  if (!n)
    throw new Error("useEditorStore() requires a parent provideEditorStore()");
  return n;
}
const Ao = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const oi = (n) => n === "";
const Oo = (...n) => n.filter((e, t, i) => !!e && e.trim() !== "" && i.indexOf(e) === t).join(" ").trim();
const si = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Io = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, i) => i ? i.toUpperCase() : t.toLowerCase()
);
const Ro = (n) => {
  const e = Io(n);
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
const Lo = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": i,
  strokeWidth: r,
  "stroke-width": o,
  size: s = pt.width,
  color: a = pt.stroke,
  ...l
}, { slots: u }) => Me(
  "svg",
  {
    ...pt,
    ...l,
    width: s,
    height: s,
    stroke: a,
    "stroke-width": oi(t) || oi(i) || t === !0 || i === !0 ? Number(r || o || pt["stroke-width"]) * 24 / Number(s) : r || o || pt["stroke-width"],
    class: Oo(
      "lucide",
      l.class,
      ...n ? [`lucide-${si(Ro(n))}-icon`, `lucide-${si(n)}`] : ["lucide-icon"]
    ),
    ...!u.default && !Ao(l) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Me(...c)), ...u.default ? [u.default()] : []]
);
const ve = (n, e) => (t, { slots: i, attrs: r }) => Me(
  Lo,
  {
    ...r,
    ...t,
    iconNode: e,
    name: n
  },
  i
);
const Do = ve("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Ji = ve("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Mo = ve("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ai = ve("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const $o = ve("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Bo = ve("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const qo = ve("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const Fo = ve("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const zo = ve("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const No = ve("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const Ho = ve("volume-2", [
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
const Wo = ve("volume-x", [
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
const Qi = ve("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Vo = ["aria-label"], jo = /* @__PURE__ */ D({
  __name: "EditorBadge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (x(), N("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      B(e.$slots, "default", {}, void 0, !0)
    ], 8, Vo));
  }
}), de = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [i, r] of e)
    t[i] = r;
  return t;
}, _n = /* @__PURE__ */ de(jo, [["__scopeId", "data-v-3d3f8eba"]]), Uo = ["disabled", "aria-label"], Ko = {
  key: 0,
  class: "editor-btn__icon",
  "aria-hidden": "true"
}, Xo = /* @__PURE__ */ D({
  __name: "EditorButton",
  props: {
    variant: { default: "secondary" },
    size: { default: "md" },
    disabled: { type: Boolean, default: !1 },
    ariaLabel: {}
  },
  setup(n) {
    const e = n, t = Zr(), i = P(() => !!t.icon && !t.default), r = P(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.size}`,
      i.value && "editor-btn--icon-only"
    ]);
    return (o, s) => (x(), N("button", {
      type: "button",
      class: zt(r.value),
      disabled: n.disabled,
      "aria-label": n.ariaLabel
    }, [
      o.$slots.icon ? (x(), N("span", Ko, [
        B(o.$slots, "icon", {}, void 0, !0)
      ])) : K("", !0),
      B(o.$slots, "default", {}, void 0, !0)
    ], 10, Uo));
  }
}), ke = /* @__PURE__ */ de(Xo, [["__scopeId", "data-v-020699df"]]), er = {
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
  "transcription.historyStart": "Début de la transcription",
  "transcription.loadingHistory": "Chargement…"
}, Yo = {
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
  "transcription.historyStart": "Beginning of transcription",
  "transcription.loadingHistory": "Loading…"
}, li = { fr: er, en: Yo }, tr = /* @__PURE__ */ Symbol("i18n");
function Qd(n) {
  const e = P(() => {
    const i = li[n.value] ?? li.fr;
    return (r) => i[r] ?? r;
  }), t = {
    t: (i) => e.value(i),
    locale: n
  };
  return Kt(tr, t), t;
}
function Re() {
  const n = Ut(tr);
  if (n) return n;
  const e = P(() => "fr");
  return {
    t: (t) => er[t] ?? t,
    locale: e
  };
}
const Go = { class: "editor-header" }, Zo = { class: "header-left" }, Jo = { class: "document-title" }, Qo = { class: "badges" }, es = ["datetime"], ts = { class: "header-right" }, ns = /* @__PURE__ */ D({
  __name: "EditorHeader",
  props: {
    title: {},
    duration: {},
    language: {},
    isMobile: { type: Boolean }
  },
  emits: ["toggleSidebar"],
  setup(n) {
    const e = n, { t, locale: i } = Re(), r = P(() => $n(e.language, i.value, t("language.wildcard"))), o = P(() => Nt(e.duration)), s = P(() => e.title.replace(/-/g, " "));
    return (a, l) => (x(), N("header", Go, [
      z("div", Zo, [
        z("h1", Jo, G(s.value), 1),
        z("div", Qo, [
          L(_n, null, {
            default: k(() => [
              ue(G(r.value), 1)
            ]),
            _: 1
          }),
          L(_n, null, {
            default: k(() => [
              z("time", {
                datetime: `PT${n.duration}S`
              }, G(o.value), 9, es)
            ]),
            _: 1
          })
        ])
      ]),
      z("div", ts, [
        n.isMobile ? (x(), I(ke, {
          key: 0,
          variant: "ghost",
          "aria-label": f(t)("header.openSidebar"),
          onClick: l[0] || (l[0] = (u) => a.$emit("toggleSidebar"))
        }, {
          icon: k(() => [
            L(f(No), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : K("", !0),
        n.isMobile ? (x(), I(ke, {
          key: 1,
          variant: "secondary",
          disabled: "",
          "aria-label": f(t)("header.export")
        }, {
          icon: k(() => [
            L(f(ai), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])) : (x(), I(ke, {
          key: 2,
          variant: "secondary",
          disabled: ""
        }, {
          icon: k(() => [
            L(f(ai), { size: 16 })
          ]),
          default: k(() => [
            ue(" " + G(f(t)("header.export")), 1)
          ]),
          _: 1
        })),
        L(ke, {
          variant: "ghost",
          disabled: "",
          "aria-label": f(t)("header.settings")
        }, {
          icon: k(() => [
            L(f(qo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label"])
      ])
    ]));
  }
}), is = /* @__PURE__ */ de(ns, [["__scopeId", "data-v-f16781f3"]]);
function ui(n) {
  return typeof n == "string" ? `'${n}'` : new rs().serialize(n);
}
const rs = /* @__PURE__ */ (function() {
  class n {
    #e = /* @__PURE__ */ new Map();
    compare(t, i) {
      const r = typeof t, o = typeof i;
      return r === "string" && o === "string" ? t.localeCompare(i) : r === "number" && o === "number" ? t - i : String.prototype.localeCompare.call(this.serialize(t, !0), this.serialize(i, !0));
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
      const r = t.constructor, o = r === Object || r === void 0 ? "" : r.name;
      if (o !== "" && globalThis[o] === r) return this.serializeBuiltInType(o, t);
      if (typeof t.toJSON == "function") {
        const s = t.toJSON();
        return o + (s !== null && typeof s == "object" ? this.$object(s) : `(${this.serialize(s)})`);
      }
      return this.serializeObjectEntries(o, Object.entries(t));
    }
    serializeBuiltInType(t, i) {
      const r = this["$" + t];
      if (r) return r.call(this, i);
      if (typeof i?.entries == "function") return this.serializeObjectEntries(t, i.entries());
      throw new Error(`Cannot serialize ${t}`);
    }
    serializeObjectEntries(t, i) {
      const r = Array.from(i).sort((s, a) => this.compare(s[0], a[0]));
      let o = `${t}{`;
      for (let s = 0; s < r.length; s++) {
        const [a, l] = r[s];
        o += `${this.serialize(a, !0)}:${this.serialize(l)}`, s < r.length - 1 && (o += ",");
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
      for (let r = 0; r < t.length; r++) i += this.serialize(t[r]), r < t.length - 1 && (i += ",");
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
      return `Set${this.$Array(Array.from(t).sort((i, r) => this.compare(i, r)))}`;
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
function Ht(n, e) {
  return n === e || ui(n) === ui(e);
}
function os(n, e, t) {
  const i = n.findIndex((a) => Ht(a, e)), r = n.findIndex((a) => Ht(a, t));
  if (i === -1 || r === -1) return [];
  const [o, s] = [i, r].sort((a, l) => a - l);
  return n.slice(o, s + 1);
}
function Cn(n, e = Number.NEGATIVE_INFINITY, t = Number.POSITIVE_INFINITY) {
  return Math.min(t, Math.max(e, n));
}
function me(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, i = Symbol(t);
  return [(s) => {
    const a = Ut(i, s);
    if (a || a === null) return a;
    throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (s) => (Kt(i, s), s)];
}
function ye() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function Xt(n, e, t) {
  const i = t.originalEvent.target, r = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && i.addEventListener(n, e, { once: !0 }), i.dispatchEvent(r);
}
function En(n) {
  return n == null;
}
function Bn(n) {
  return n ? n.flatMap((e) => e.type === pe ? Bn(e.children) : [e]) : [];
}
const [Yt] = me("ConfigProvider");
function ss(n, e) {
  var t;
  const i = ut();
  return se(() => {
    i.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Wi(i);
}
function Gt(n, e) {
  return zi() ? (Ni(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function cn() {
  const n = /* @__PURE__ */ new Set(), e = (o) => {
    n.delete(o);
  };
  return {
    on: (o) => {
      n.add(o);
      const s = () => e(o);
      return Gt(s), { off: s };
    },
    off: e,
    trigger: (...o) => Promise.all(Array.from(n).map((s) => s(...o))),
    clear: () => {
      n.clear();
    }
  };
}
// @__NO_SIDE_EFFECTS__
function as(n) {
  let e = !1, t;
  const i = Hi(!0);
  return ((...r) => (e || (t = i.run(() => n(...r)), e = !0), t));
}
const Fe = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const ls = (n) => typeof n < "u", us = Object.prototype.toString, cs = (n) => us.call(n) === "[object Object]", ci = () => {
}, di = /* @__PURE__ */ ds();
function ds() {
  var n, e, t;
  return Fe && !!(!((n = window) === null || n === void 0 || (n = n.navigator) === null || n === void 0) && n.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((e = window) === null || e === void 0 || (e = e.navigator) === null || e === void 0 ? void 0 : e.maxTouchPoints) > 2 && /iPad|Macintosh/.test((t = window) === null || t === void 0 ? void 0 : t.navigator.userAgent));
}
function fs(n, e) {
  function t(...i) {
    return new Promise((r, o) => {
      Promise.resolve(n(() => e.apply(this, i), {
        fn: e,
        thisArg: this,
        args: i
      })).then(r).catch(o);
    });
  }
  return t;
}
function ps(n, e = {}) {
  let t, i, r = ci;
  const o = (l) => {
    clearTimeout(l), r(), r = ci;
  };
  let s;
  return (l) => {
    const u = oe(n), c = oe(e.maxWait);
    return t && o(t), u <= 0 || c !== void 0 && c <= 0 ? (i && (o(i), i = void 0), Promise.resolve(l())) : new Promise((d, p) => {
      r = e.rejectOnCancel ? p : d, s = l, c && !i && (i = setTimeout(() => {
        t && o(t), i = void 0, d(s());
      }, c)), t = setTimeout(() => {
        i && o(i), i = void 0, d(l());
      }, u);
    });
  };
}
function dn(n) {
  return Array.isArray(n) ? n : [n];
}
function hs(n) {
  return Qe();
}
// @__NO_SIDE_EFFECTS__
function vs(n) {
  if (!Fe) return n;
  let e = 0, t, i;
  const r = () => {
    e -= 1, i && e <= 0 && (i.stop(), t = void 0, i = void 0);
  };
  return ((...o) => (e += 1, i || (i = Hi(!0), t = i.run(() => n(...o))), Gt(r), t));
}
function nr(n, e = 1e4) {
  return Jr((t, i) => {
    let r = oe(n), o;
    const s = () => setTimeout(() => {
      r = oe(n), i();
    }, oe(e));
    return Gt(() => {
      clearTimeout(o);
    }), {
      get() {
        return t(), r;
      },
      set(a) {
        r = a, i(), clearTimeout(o), o = s();
      }
    };
  });
}
// @__NO_SIDE_EFFECTS__
function qn(n, e = 200, t = {}) {
  return fs(ps(e, t), n);
}
function ms(n, e) {
  hs() && xt(n, e);
}
function gs(n, e, t) {
  return Q(n, e, {
    ...t,
    immediate: !0
  });
}
function ys(n, e, t) {
  return Q(n, e, {
    ...t,
    once: !0
  });
}
const Zt = Fe ? window : void 0;
function Ae(n) {
  var e;
  const t = oe(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function ir(...n) {
  const e = (i, r, o, s) => (i.addEventListener(r, o, s), () => i.removeEventListener(r, o, s)), t = P(() => {
    const i = dn(oe(n[0])).filter((r) => r != null);
    return i.every((r) => typeof r != "string") ? i : void 0;
  });
  return gs(() => {
    var i, r;
    return [
      (i = (r = t.value) === null || r === void 0 ? void 0 : r.map((o) => Ae(o))) !== null && i !== void 0 ? i : [Zt].filter((o) => o != null),
      dn(oe(t.value ? n[1] : n[0])),
      dn(f(t.value ? n[2] : n[1])),
      oe(t.value ? n[3] : n[2])
    ];
  }, ([i, r, o, s], a, l) => {
    if (!i?.length || !r?.length || !o?.length) return;
    const u = cs(s) ? { ...s } : s, c = i.flatMap((d) => r.flatMap((p) => o.map((h) => e(d, p, h, u))));
    l(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function rr() {
  const n = ut(!1), e = Qe();
  return e && ee(() => {
    n.value = !0;
  }, e), n;
}
// @__NO_SIDE_EFFECTS__
function bs(n) {
  const e = /* @__PURE__ */ rr();
  return P(() => (e.value, !!n()));
}
function ws(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function Ss(...n) {
  let e, t, i = {};
  n.length === 3 ? (e = n[0], t = n[1], i = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], i = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: r = Zt, eventName: o = "keydown", passive: s = !1, dedupe: a = !1 } = i, l = ws(e);
  return ir(r, o, (c) => {
    c.repeat && oe(a) || l(c) && t(c);
  }, s);
}
function _s(n) {
  return JSON.parse(JSON.stringify(n));
}
function yt(n, e, t = {}) {
  const { window: i = Zt, ...r } = t;
  let o;
  const s = /* @__PURE__ */ bs(() => i && "ResizeObserver" in i), a = () => {
    o && (o.disconnect(), o = void 0);
  }, l = Q(P(() => {
    const c = oe(n);
    return Array.isArray(c) ? c.map((d) => Ae(d)) : [Ae(c)];
  }), (c) => {
    if (a(), s.value && i) {
      o = new ResizeObserver(e);
      for (const d of c) d && o.observe(d, r);
    }
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => {
    a(), l();
  };
  return Gt(u), {
    isSupported: s,
    stop: u
  };
}
// @__NO_SIDE_EFFECTS__
function bt(n, e, t, i = {}) {
  var r, o;
  const { clone: s = !1, passive: a = !1, eventName: l, deep: u = !1, defaultValue: c, shouldEmit: d } = i, p = Qe(), h = t || p?.emit || (p == null || (r = p.$emit) === null || r === void 0 ? void 0 : r.bind(p)) || (p == null || (o = p.proxy) === null || o === void 0 || (o = o.$emit) === null || o === void 0 ? void 0 : o.bind(p?.proxy));
  let v = l;
  e || (e = "modelValue"), v = v || `update:${e.toString()}`;
  const y = (m) => s ? typeof s == "function" ? s(m) : _s(m) : m, g = () => ls(n[e]) ? y(n[e]) : c, b = (m) => {
    d ? d(m) && h(v, m) : h(v, m);
  };
  if (a) {
    const m = T(g());
    let S = !1;
    return Q(() => n[e], (w) => {
      S || (S = !0, m.value = y(w), re(() => S = !1));
    }), Q(m, (w) => {
      !S && (w !== n[e] || u) && b(w);
    }, { deep: u }), m;
  } else return P({
    get() {
      return g();
    },
    set(m) {
      b(m);
    }
  });
}
function fn(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function xn(n, e, t = ".", i) {
  if (!fn(e))
    return xn(n, {}, t, i);
  const r = Object.assign({}, e);
  for (const o in n) {
    if (o === "__proto__" || o === "constructor")
      continue;
    const s = n[o];
    s != null && (i && i(r, o, s, t) || (Array.isArray(s) && Array.isArray(r[o]) ? r[o] = [...s, ...r[o]] : fn(s) && fn(r[o]) ? r[o] = xn(
      s,
      r[o],
      (t ? `${t}.` : "") + o.toString(),
      i
    ) : r[o] = s));
  }
  return r;
}
function Cs(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, i) => xn(t, i, "", n), {})
  );
}
const Es = Cs(), xs = /* @__PURE__ */ vs(() => {
  const n = T(/* @__PURE__ */ new Map()), e = T(), t = P(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), i = Yt({ scrollBody: T(!0) });
  let r = null;
  const o = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", di && r?.(), e.value = void 0;
  };
  return Q(t, (s, a) => {
    if (!Fe) return;
    if (!s) {
      a && o();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const l = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: l,
      margin: 0
    }, c = i.scrollBody?.value ? typeof i.scrollBody.value == "object" ? Es({
      padding: i.scrollBody.value.padding === !0 ? l : i.scrollBody.value.padding,
      margin: i.scrollBody.value.margin === !0 ? l : i.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    l > 0 && (document.body.style.paddingRight = typeof c.padding == "number" ? `${c.padding}px` : String(c.padding), document.body.style.marginRight = typeof c.margin == "number" ? `${c.margin}px` : String(c.margin), document.documentElement.style.setProperty("--scrollbar-width", `${l}px`), document.body.style.overflow = "hidden"), di && (r = ir(document, "touchmove", (d) => ks(d), { passive: !1 })), re(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function or(n) {
  const e = Math.random().toString(36).substring(2, 7), t = xs();
  t.value.set(e, n ?? !1);
  const i = P({
    get: () => t.value.get(e) ?? !1,
    set: (r) => t.value.set(e, r)
  });
  return ms(() => {
    t.value.delete(e);
  }), i;
}
function sr(n) {
  const e = window.getComputedStyle(n);
  if (e.overflowX === "scroll" || e.overflowY === "scroll" || e.overflowX === "auto" && n.clientWidth < n.scrollWidth || e.overflowY === "auto" && n.clientHeight < n.scrollHeight) return !0;
  {
    const t = n.parentNode;
    return !(t instanceof Element) || t.tagName === "BODY" ? !1 : sr(t);
  }
}
function ks(n) {
  const e = n || window.event, t = e.target;
  return t instanceof Element && sr(t) ? !1 : e.touches.length > 1 ? !0 : (e.preventDefault && e.cancelable && e.preventDefault(), !1);
}
function Fn(n) {
  const e = Yt({ dir: T("ltr") });
  return P(() => n?.value || e.dir?.value || "ltr");
}
function Jt(n) {
  const e = Qe(), t = e?.type.emits, i = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((r) => {
    i[Qr(Vi(r))] = (...o) => n(r, ...o);
  }), i;
}
let pn = 0;
function Ts() {
  se((n) => {
    if (!Fe) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? fi()), document.body.insertAdjacentElement("beforeend", e[1] ?? fi()), pn++, n(() => {
      pn === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), pn--;
    });
  });
}
function fi() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function ar(n) {
  return P(() => oe(n) ? !!Ae(n)?.closest("form") : !0);
}
function X() {
  const n = Qe(), e = T(), t = P(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : Ae(e)), i = Object.assign({}, n.exposed), r = {};
  for (const s in n.props) Object.defineProperty(r, s, {
    enumerable: !0,
    configurable: !0,
    get: () => n.props[s]
  });
  if (Object.keys(i).length > 0) for (const s in i) Object.defineProperty(r, s, {
    enumerable: !0,
    configurable: !0,
    get: () => i[s]
  });
  Object.defineProperty(r, "$el", {
    enumerable: !0,
    configurable: !0,
    get: () => n.vnode.el
  }), n.exposed = r;
  function o(s) {
    if (e.value = s, !!s && (Object.defineProperty(r, "$el", {
      enumerable: !0,
      configurable: !0,
      get: () => s instanceof Element ? s : s.$el
    }), !(s instanceof Element) && !Object.hasOwn(s, "$el"))) {
      const a = s.$.exposed, l = Object.assign({}, r);
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
function zn(n) {
  const e = Qe(), t = Object.keys(e?.type.props ?? {}).reduce((r, o) => {
    const s = (e?.type.props[o]).default;
    return s !== void 0 && (r[o] = s), r;
  }, {}), i = $t(n);
  return P(() => {
    const r = {}, o = e?.vnode.props ?? {};
    return Object.keys(o).forEach((s) => {
      r[Vi(s)] = o[s];
    }), Object.keys({
      ...t,
      ...r
    }).reduce((s, a) => (i.value[a] !== void 0 && (s[a] = i.value[a]), s), {});
  });
}
function Ps(n, e) {
  const t = zn(n), i = e ? Jt(e) : {};
  return P(() => ({
    ...t.value,
    ...i
  }));
}
var As = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, ot = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), It = {}, hn = 0, lr = function(n) {
  return n && (n.host || lr(n.parentNode));
}, Os = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var i = lr(t);
    return i && n.contains(i) ? i : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Is = function(n, e, t, i) {
  var r = Os(e, Array.isArray(n) ? n : [n]);
  It[t] || (It[t] = /* @__PURE__ */ new WeakMap());
  var o = It[t], s = [], a = /* @__PURE__ */ new Set(), l = new Set(r), u = function(d) {
    !d || a.has(d) || (a.add(d), u(d.parentNode));
  };
  r.forEach(u);
  var c = function(d) {
    !d || l.has(d) || Array.prototype.forEach.call(d.children, function(p) {
      if (a.has(p))
        c(p);
      else
        try {
          var h = p.getAttribute(i), v = h !== null && h !== "false", y = (ot.get(p) || 0) + 1, g = (o.get(p) || 0) + 1;
          ot.set(p, y), o.set(p, g), s.push(p), y === 1 && v && Ot.set(p, !0), g === 1 && p.setAttribute(t, "true"), v || p.setAttribute(i, "true");
        } catch (b) {
          console.error("aria-hidden: cannot operate on ", p, b);
        }
    });
  };
  return c(e), a.clear(), hn++, function() {
    s.forEach(function(d) {
      var p = ot.get(d) - 1, h = o.get(d) - 1;
      ot.set(d, p), o.set(d, h), p || (Ot.has(d) || d.removeAttribute(i), Ot.delete(d)), h || d.removeAttribute(t);
    }), hn--, hn || (ot = /* @__PURE__ */ new WeakMap(), ot = /* @__PURE__ */ new WeakMap(), Ot = /* @__PURE__ */ new WeakMap(), It = {});
  };
}, Rs = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var i = Array.from(Array.isArray(n) ? n : [n]), r = As(n);
  return r ? (i.push.apply(i, Array.from(r.querySelectorAll("[aria-live], script"))), Is(i, r, t, "aria-hidden")) : function() {
    return null;
  };
};
function ur(n) {
  let e;
  Q(() => Ae(n), (t) => {
    t ? e = Rs(t) : e && e();
  }), _e(() => {
    e && e();
  });
}
let Ls = 0;
function wt(n, e = "reka") {
  if ("useId" in ti) return `${e}-${ti.useId?.()}`;
  const t = Yt({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Ls}`;
}
function Ds() {
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
function Ms(n) {
  const e = T(), t = P(() => e.value?.width ?? 0), i = P(() => e.value?.height ?? 0);
  return ee(() => {
    const r = Ae(n);
    if (r) {
      e.value = {
        width: r.offsetWidth,
        height: r.offsetHeight
      };
      const o = new ResizeObserver((s) => {
        if (!Array.isArray(s) || !s.length) return;
        const a = s[0];
        let l, u;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          l = d.inlineSize, u = d.blockSize;
        } else
          l = r.offsetWidth, u = r.offsetHeight;
        e.value = {
          width: l,
          height: u
        };
      });
      return o.observe(r, { box: "border-box" }), () => o.unobserve(r);
    } else e.value = void 0;
  }), {
    width: t,
    height: i
  };
}
function Nn(n, e) {
  const t = T(n);
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
function Hn(n) {
  const e = nr("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (r, o) => {
      e.value = e.value + r;
      {
        const s = ye(), a = o.map((p) => ({
          ...p,
          textValue: p.value?.textValue ?? p.ref.textContent?.trim() ?? ""
        })), l = a.find((p) => p.ref === s), u = a.map((p) => p.textValue), c = Bs(u, e.value, l?.textValue), d = a.find((p) => p.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function $s(n, e) {
  return n.map((t, i) => n[(e + i) % n.length]);
}
function Bs(n, e, t) {
  const r = e.length > 1 && Array.from(e).every((u) => u === e[0]) ? e[0] : e, o = t ? n.indexOf(t) : -1;
  let s = $s(n, Math.max(o, 0));
  r.length === 1 && (s = s.filter((u) => u !== t));
  const l = s.find((u) => u.toLowerCase().startsWith(r.toLowerCase()));
  return l !== t ? l : void 0;
}
function qs(n, e) {
  const t = T({}), i = T("none"), r = T(n), o = n.value ? "mounted" : "unmounted";
  let s;
  const a = e.value?.ownerDocument.defaultView ?? Zt, { state: l, dispatch: u } = Nn(o, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: { MOUNT: "mounted" }
  }), c = (g) => {
    if (Fe) {
      const b = new CustomEvent(g, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(b);
    }
  };
  Q(n, async (g, b) => {
    const m = b !== g;
    if (await re(), m) {
      const S = i.value, w = Rt(e.value);
      g ? (u("MOUNT"), c("enter"), w === "none" && c("after-enter")) : w === "none" || w === "undefined" || t.value?.display === "none" ? (u("UNMOUNT"), c("leave"), c("after-leave")) : b && S !== w ? (u("ANIMATION_OUT"), c("leave")) : (u("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (g) => {
    const b = Rt(e.value), m = b.includes(CSS.escape(g.animationName)), S = l.value === "mounted" ? "enter" : "leave";
    if (g.target === e.value && m && (c(`after-${S}`), u("ANIMATION_END"), !r.value)) {
      const w = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", s = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = w);
      });
    }
    g.target === e.value && b === "none" && u("ANIMATION_END");
  }, p = (g) => {
    g.target === e.value && (i.value = Rt(e.value));
  }, h = Q(e, (g, b) => {
    g ? (t.value = getComputedStyle(g), g.addEventListener("animationstart", p), g.addEventListener("animationcancel", d), g.addEventListener("animationend", d)) : (u("ANIMATION_END"), s !== void 0 && a?.clearTimeout(s), b?.removeEventListener("animationstart", p), b?.removeEventListener("animationcancel", d), b?.removeEventListener("animationend", d));
  }, { immediate: !0 }), v = Q(l, () => {
    const g = Rt(e.value);
    i.value = l.value === "mounted" ? g : "none";
  });
  return _e(() => {
    h(), v();
  }), { isPresent: P(() => ["mounted", "unmountSuspended"].includes(l.value)) };
}
function Rt(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var nt = D({
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
    const { present: i, forceMount: r } = qe(n), o = T(), { isPresent: s } = qs(i, o);
    t({ present: s });
    let a = e.default({ present: s.value });
    a = Bn(a || []);
    const l = Qe();
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
    return () => r.value || i.value || s.value ? Me(e.default({ present: s.value })[0], { ref: (u) => {
      const c = Ae(u);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? o.value = c.firstElementChild : o.value = c), c;
    } }) : null;
  }
});
const kn = D({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const i = Bn(t.default()), r = i.findIndex((l) => l.type !== eo);
      if (r === -1) return i;
      const o = i[r];
      delete o.props?.ref;
      const s = o.props ? j(e, o.props) : e, a = to({
        ...o,
        props: {}
      }, s);
      return i.length === 1 ? a : (i[r] = a, i);
    };
  }
}), Fs = [
  "area",
  "img",
  "input"
], J = D({
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
    return typeof i == "string" && Fs.includes(i) ? () => Me(i, e) : i !== "template" ? () => Me(n.as, e, { default: t.default }) : () => Me(kn, e, { default: t.default });
  }
});
function St() {
  const n = T(), e = P(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : Ae(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [je, zs] = me("DialogRoot");
var Ns = /* @__PURE__ */ D({
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
    const t = n, r = /* @__PURE__ */ bt(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), o = T(), s = T(), { modal: a } = qe(t);
    return zs({
      open: r,
      modal: a,
      openModal: () => {
        r.value = !0;
      },
      onOpenChange: (l) => {
        r.value = l;
      },
      onOpenToggle: () => {
        r.value = !r.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: o,
      contentElement: s
    }), (l, u) => B(l.$slots, "default", {
      open: f(r),
      close: () => r.value = !1
    });
  }
}), cr = Ns, Hs = /* @__PURE__ */ D({
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
    X();
    const t = je();
    return (i, r) => (x(), I(f(J), j(e, {
      type: i.as === "button" ? "button" : void 0,
      onClick: r[0] || (r[0] = (o) => f(t).onOpenChange(!1))
    }), {
      default: k(() => [B(i.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Ws = Hs;
const Vs = "dismissableLayer.pointerDownOutside", js = "dismissableLayer.focusOutside";
function dr(n, e) {
  const t = e.closest("[data-dismissable-layer]"), i = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), r = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (i === t || r.indexOf(i) < r.indexOf(t)));
}
function Us(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = T(!1), o = T(() => {
  });
  return se((s) => {
    if (!Fe || !oe(t)) return;
    const a = async (u) => {
      const c = u.target;
      if (!(!e?.value || !c)) {
        if (dr(e.value, c)) {
          r.value = !1;
          return;
        }
        if (u.target && !r.value) {
          let p = function() {
            Xt(Vs, n, d);
          };
          const d = { originalEvent: u };
          u.pointerType === "touch" ? (i.removeEventListener("click", o.value), o.value = p, i.addEventListener("click", o.value, { once: !0 })) : p();
        } else i.removeEventListener("click", o.value);
        r.value = !1;
      }
    }, l = window.setTimeout(() => {
      i.addEventListener("pointerdown", a);
    }, 0);
    s(() => {
      window.clearTimeout(l), i.removeEventListener("pointerdown", a), i.removeEventListener("click", o.value);
    });
  }), { onPointerDownCapture: () => {
    oe(t) && (r.value = !0);
  } };
}
function Ks(n, e, t = !0) {
  const i = e?.value?.ownerDocument ?? globalThis?.document, r = T(!1);
  return se((o) => {
    if (!Fe || !oe(t)) return;
    const s = async (a) => {
      if (!e?.value) return;
      await re(), await re();
      const l = a.target;
      !e.value || !l || dr(e.value, l) || a.target && !r.value && Xt(js, n, { originalEvent: a });
    };
    i.addEventListener("focusin", s), o(() => i.removeEventListener("focusin", s));
  }), {
    onFocusCapture: () => {
      oe(t) && (r.value = !0);
    },
    onBlurCapture: () => {
      oe(t) && (r.value = !1);
    }
  };
}
const ge = ji({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var Xs = /* @__PURE__ */ D({
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
    const t = n, i = e, { forwardRef: r, currentElement: o } = X(), s = P(() => o.value?.ownerDocument ?? globalThis.document), a = P(() => ge.layersRoot), l = P(() => o.value ? Array.from(a.value).indexOf(o.value) : -1), u = P(() => ge.layersWithOutsidePointerEventsDisabled.size > 0), c = P(() => {
      const h = Array.from(a.value), [v] = [...ge.layersWithOutsidePointerEventsDisabled].slice(-1), y = h.indexOf(v);
      return l.value >= y;
    }), d = Us(async (h) => {
      const v = [...ge.branches].some((y) => y?.contains(h.target));
      !c.value || v || (i("pointerDownOutside", h), i("interactOutside", h), await re(), h.defaultPrevented || i("dismiss"));
    }, o), p = Ks((h) => {
      [...ge.branches].some((y) => y?.contains(h.target)) || (i("focusOutside", h), i("interactOutside", h), h.defaultPrevented || i("dismiss"));
    }, o);
    return Ss("Escape", (h) => {
      l.value === a.value.size - 1 && (i("escapeKeyDown", h), h.defaultPrevented || i("dismiss"));
    }), se((h) => {
      o.value && (t.disableOutsidePointerEvents && (ge.layersWithOutsidePointerEventsDisabled.size === 0 && (ge.originalBodyPointerEvents = s.value.body.style.pointerEvents, s.value.body.style.pointerEvents = "none"), ge.layersWithOutsidePointerEventsDisabled.add(o.value)), a.value.add(o.value), h(() => {
        t.disableOutsidePointerEvents && ge.layersWithOutsidePointerEventsDisabled.size === 1 && !En(ge.originalBodyPointerEvents) && (s.value.body.style.pointerEvents = ge.originalBodyPointerEvents);
      }));
    }), se((h) => {
      h(() => {
        o.value && (a.value.delete(o.value), ge.layersWithOutsidePointerEventsDisabled.delete(o.value));
      });
    }), (h, v) => (x(), I(f(J), {
      ref: f(r),
      "as-child": h.asChild,
      as: h.as,
      "data-dismissable-layer": "",
      style: Ie({ pointerEvents: u.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: f(p).onFocusCapture,
      onBlurCapture: f(p).onBlurCapture,
      onPointerdownCapture: f(d).onPointerDownCapture
    }, {
      default: k(() => [B(h.$slots, "default")]),
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
}), fr = Xs;
const Ys = /* @__PURE__ */ as(() => T([]));
function Gs() {
  const n = Ys();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = pi(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = pi(n.value, e), n.value[0]?.resume();
    }
  };
}
function pi(n, e) {
  const t = [...n], i = t.indexOf(e);
  return i !== -1 && t.splice(i, 1), t;
}
const vn = "focusScope.autoFocusOnMount", mn = "focusScope.autoFocusOnUnmount", hi = {
  bubbles: !1,
  cancelable: !0
};
function Zs(n, { select: e = !1 } = {}) {
  const t = ye();
  for (const i of n)
    if (ze(i, { select: e }), ye() !== t) return !0;
}
function Js(n) {
  const e = pr(n), t = vi(e, n), i = vi(e.reverse(), n);
  return [t, i];
}
function pr(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (i) => {
    const r = i.tagName === "INPUT" && i.type === "hidden";
    return i.disabled || i.hidden || r ? NodeFilter.FILTER_SKIP : i.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function vi(n, e) {
  for (const t of n) if (!Qs(t, { upTo: e })) return t;
}
function Qs(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function ea(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function ze(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = ye();
    n.focus({ preventScroll: !0 }), n !== t && ea(n) && e && n.select();
  }
}
var ta = /* @__PURE__ */ D({
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
    const t = n, i = e, { currentRef: r, currentElement: o } = X(), s = T(null), a = Gs(), l = ji({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    se((c) => {
      if (!Fe) return;
      const d = o.value;
      if (!t.trapped) return;
      function p(g) {
        if (l.paused || !d) return;
        const b = g.target;
        d.contains(b) ? s.value = b : ze(s.value, { select: !0 });
      }
      function h(g) {
        if (l.paused || !d) return;
        const b = g.relatedTarget;
        b !== null && (d.contains(b) || ze(s.value, { select: !0 }));
      }
      function v(g) {
        d.contains(s.value) || ze(d);
      }
      document.addEventListener("focusin", p), document.addEventListener("focusout", h);
      const y = new MutationObserver(v);
      d && y.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", p), document.removeEventListener("focusout", h), y.disconnect();
      });
    }), se(async (c) => {
      const d = o.value;
      if (await re(), !d) return;
      a.add(l);
      const p = ye();
      if (!d.contains(p)) {
        const v = new CustomEvent(vn, hi);
        d.addEventListener(vn, (y) => i("mountAutoFocus", y)), d.dispatchEvent(v), v.defaultPrevented || (Zs(pr(d), { select: !0 }), ye() === p && ze(d));
      }
      c(() => {
        d.removeEventListener(vn, (g) => i("mountAutoFocus", g));
        const v = new CustomEvent(mn, hi), y = (g) => {
          i("unmountAutoFocus", g);
        };
        d.addEventListener(mn, y), d.dispatchEvent(v), setTimeout(() => {
          v.defaultPrevented || ze(p ?? document.body, { select: !0 }), d.removeEventListener(mn, y), a.remove(l);
        }, 0);
      });
    });
    function u(c) {
      if (!t.loop && !t.trapped || l.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, p = ye();
      if (d && p) {
        const h = c.currentTarget, [v, y] = Js(h);
        v && y ? !c.shiftKey && p === y ? (c.preventDefault(), t.loop && ze(v, { select: !0 })) : c.shiftKey && p === v && (c.preventDefault(), t.loop && ze(y, { select: !0 })) : p === h && c.preventDefault();
      }
    }
    return (c, d) => (x(), I(f(J), {
      ref_key: "currentRef",
      ref: r,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: u
    }, {
      default: k(() => [B(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), hr = ta;
function na(n) {
  return n ? "open" : "closed";
}
function mi(n) {
  const e = ye();
  for (const t of n)
    if (t === e || (t.focus(), ye() !== e)) return;
}
const ia = "DialogTitle", ra = "DialogContent";
function oa({ titleName: n = ia, contentName: e = ra, componentLink: t = "dialog.html#title", titleId: i, descriptionId: r, contentElement: o }) {
  const s = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  ee(() => {
    document.getElementById(i) || console.warn(s);
    const u = o.value?.getAttribute("aria-describedby");
    r && u && (document.getElementById(r) || console.warn(a));
  });
}
var sa = /* @__PURE__ */ D({
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
    const t = n, i = e, r = je(), { forwardRef: o, currentElement: s } = X();
    return r.titleId ||= wt(void 0, "reka-dialog-title"), r.descriptionId ||= wt(void 0, "reka-dialog-description"), ee(() => {
      r.contentElement = s, ye() !== document.body && (r.triggerElement.value = ye());
    }), process.env.NODE_ENV !== "production" && oa({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: r.titleId,
      descriptionId: r.descriptionId,
      contentElement: s
    }), (a, l) => (x(), I(f(hr), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: l[5] || (l[5] = (u) => i("openAutoFocus", u)),
      onUnmountAutoFocus: l[6] || (l[6] = (u) => i("closeAutoFocus", u))
    }, {
      default: k(() => [L(f(fr), j({
        id: f(r).contentId,
        ref: f(o),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": f(r).descriptionId,
        "aria-labelledby": f(r).titleId,
        "data-state": f(na)(f(r).open.value)
      }, a.$attrs, {
        onDismiss: l[0] || (l[0] = (u) => f(r).onOpenChange(!1)),
        onEscapeKeyDown: l[1] || (l[1] = (u) => i("escapeKeyDown", u)),
        onFocusOutside: l[2] || (l[2] = (u) => i("focusOutside", u)),
        onInteractOutside: l[3] || (l[3] = (u) => i("interactOutside", u)),
        onPointerDownOutside: l[4] || (l[4] = (u) => i("pointerDownOutside", u))
      }), {
        default: k(() => [B(a.$slots, "default")]),
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
}), vr = sa, aa = /* @__PURE__ */ D({
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
    const t = n, i = e, r = je(), o = Jt(i), { forwardRef: s, currentElement: a } = X();
    return ur(a), (l, u) => (x(), I(vr, j({
      ...t,
      ...f(o)
    }, {
      ref: f(s),
      "trap-focus": f(r).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), f(r).triggerElement.value?.focus());
      }),
      onPointerDownOutside: u[1] || (u[1] = (c) => {
        const d = c.detail.originalEvent, p = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || p) && c.preventDefault();
      }),
      onFocusOutside: u[2] || (u[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: k(() => [B(l.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), la = aa, ua = /* @__PURE__ */ D({
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
    const t = n, r = Jt(e);
    X();
    const o = je(), s = T(!1), a = T(!1);
    return (l, u) => (x(), I(vr, j({
      ...t,
      ...f(r)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: u[0] || (u[0] = (c) => {
        c.defaultPrevented || (s.value || f(o).triggerElement.value?.focus(), c.preventDefault()), s.value = !1, a.value = !1;
      }),
      onInteractOutside: u[1] || (u[1] = (c) => {
        c.defaultPrevented || (s.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        f(o).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: k(() => [B(l.$slots, "default")]),
      _: 3
    }, 16));
  }
}), ca = ua, da = /* @__PURE__ */ D({
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
    const t = n, i = e, r = je(), o = Jt(i), { forwardRef: s } = X();
    return (a, l) => (x(), I(f(nt), { present: a.forceMount || f(r).open.value }, {
      default: k(() => [f(r).modal.value ? (x(), I(la, j({
        key: 0,
        ref: f(s)
      }, {
        ...t,
        ...f(o),
        ...a.$attrs
      }), {
        default: k(() => [B(a.$slots, "default")]),
        _: 3
      }, 16)) : (x(), I(ca, j({
        key: 1,
        ref: f(s)
      }, {
        ...t,
        ...f(o),
        ...a.$attrs
      }), {
        default: k(() => [B(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), mr = da, fa = /* @__PURE__ */ D({
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
    const e = je();
    return or(!0), X(), (t, i) => (x(), I(f(J), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": f(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: k(() => [B(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), pa = fa, ha = /* @__PURE__ */ D({
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
    const e = je(), { forwardRef: t } = X();
    return (i, r) => f(e)?.modal.value ? (x(), I(f(nt), {
      key: 0,
      present: i.forceMount || f(e).open.value
    }, {
      default: k(() => [L(pa, j(i.$attrs, {
        ref: f(t),
        as: i.as,
        "as-child": i.asChild
      }), {
        default: k(() => [B(i.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : K("v-if", !0);
  }
}), gr = ha, va = /* @__PURE__ */ D({
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
    const e = /* @__PURE__ */ rr();
    return (t, i) => f(e) || t.forceMount ? (x(), I(Ui, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [B(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : K("v-if", !0);
  }
}), yr = va, ma = /* @__PURE__ */ D({
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
    return (t, i) => (x(), I(f(yr), Dn(Mn(e)), {
      default: k(() => [B(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), br = ma, ga = /* @__PURE__ */ D({
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
    const e = n, t = je();
    return X(), (i, r) => (x(), I(f(J), j(e, { id: f(t).titleId }), {
      default: k(() => [B(i.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), wr = ga;
const gi = "data-reka-collection-item";
function Ue(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, i = `${e}CollectionProvider`;
  let r;
  if (t) {
    const c = T(/* @__PURE__ */ new Map());
    r = {
      collectionRef: T(),
      itemMap: c
    }, Kt(i, r);
  } else r = Ut(i);
  const o = (c = !1) => {
    const d = r.collectionRef.value;
    if (!d) return [];
    const p = Array.from(d.querySelectorAll(`[${gi}]`)), v = Array.from(r.itemMap.value.values()).sort((y, g) => p.indexOf(y.ref) - p.indexOf(g.ref));
    return c ? v : v.filter((y) => y.ref.dataset.disabled !== "");
  }, s = D({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: h, currentElement: v } = St();
      return Q(v, () => {
        r.collectionRef.value = v.value;
      }), () => Me(kn, {
        ref: h,
        ...p
      }, d);
    }
  }), a = D({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: p }) {
      const { primitiveElement: h, currentElement: v } = St();
      return se((y) => {
        if (v.value) {
          const g = no(v.value);
          r.itemMap.value.set(g, {
            ref: v.value,
            value: c.value
          }), y(() => r.itemMap.value.delete(g));
        }
      }), () => Me(kn, {
        ...p,
        [gi]: "",
        ref: h
      }, d);
    }
  }), l = P(() => Array.from(r.itemMap.value.values())), u = P(() => r.itemMap.value.size);
  return {
    getItems: o,
    reactiveItems: l,
    itemMapSize: u,
    CollectionSlot: s,
    CollectionItem: a
  };
}
const ya = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ba(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function wa(n, e, t) {
  const i = ba(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(i)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(i)))
    return ya[i];
}
var Sa = /* @__PURE__ */ D({
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
    return (e, t) => (x(), I(f(J), {
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
      default: k(() => [B(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Sr = Sa, _a = /* @__PURE__ */ D({
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
    const e = n, { primitiveElement: t, currentElement: i } = St(), r = P(() => e.checked ?? e.value);
    return Q(r, (o, s) => {
      if (!i.value) return;
      const a = i.value, l = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(l, "value").set;
      if (c && o !== s) {
        const d = new Event("input", { bubbles: !0 }), p = new Event("change", { bubbles: !0 });
        c.call(a, o), a.dispatchEvent(d), a.dispatchEvent(p);
      }
    }), (o, s) => (x(), I(Sr, j({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...o.$attrs
    }, { as: "input" }), null, 16));
  }
}), yi = _a, Ca = /* @__PURE__ */ D({
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
    const e = n, t = P(() => typeof e.value == "object" && Array.isArray(e.value) && e.value.length === 0 && e.required), i = P(() => typeof e.value == "string" || typeof e.value == "number" || typeof e.value == "boolean" || e.value === null || e.value === void 0 ? [{
      name: e.name,
      value: e.value
    }] : typeof e.value == "object" && Array.isArray(e.value) ? e.value.flatMap((r, o) => typeof r == "object" ? Object.entries(r).map(([s, a]) => ({
      name: `${e.name}[${o}][${s}]`,
      value: a
    })) : {
      name: `${e.name}[${o}]`,
      value: r
    }) : e.value !== null && typeof e.value == "object" && !Array.isArray(e.value) ? Object.entries(e.value).map(([r, o]) => ({
      name: `${e.name}[${r}]`,
      value: o
    })) : []);
    return (r, o) => (x(), N(pe, null, [K(" We render single input if it's required "), t.value ? (x(), I(yi, j({ key: r.name }, {
      ...e,
      ...r.$attrs
    }, {
      name: r.name,
      value: r.value
    }), null, 16, ["name", "value"])) : (x(!0), N(pe, { key: 1 }, et(i.value, (s) => (x(), I(yi, j({ key: s.name }, { ref_for: !0 }, {
      ...e,
      ...r.$attrs
    }, {
      name: s.name,
      value: s.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Ea = Ca;
const [_r, xa] = me("PopperRoot");
var ka = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = T();
    return xa({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, i) => B(t.$slots, "default");
  }
}), Ta = ka, Pa = /* @__PURE__ */ D({
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
    const e = n, { forwardRef: t, currentElement: i } = X(), r = _r();
    return Ki(() => {
      r.onAnchorChange(e.reference ?? i.value);
    }), (o, s) => (x(), I(f(J), {
      ref: f(t),
      as: o.as,
      "as-child": o.asChild
    }, {
      default: k(() => [B(o.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Aa = Pa;
function Oa(n) {
  return n !== null;
}
function Ia(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: i, middlewareData: r } = e, s = r.arrow?.centerOffset !== 0, a = s ? 0 : n.arrowWidth, l = s ? 0 : n.arrowHeight, [u, c] = Tn(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], p = (r.arrow?.x ?? 0) + a / 2, h = (r.arrow?.y ?? 0) + l / 2;
      let v = "", y = "";
      return u === "bottom" ? (v = s ? d : `${p}px`, y = `${-l}px`) : u === "top" ? (v = s ? d : `${p}px`, y = `${i.floating.height + l}px`) : u === "right" ? (v = `${-l}px`, y = s ? d : `${h}px`) : u === "left" && (v = `${i.floating.width + l}px`, y = s ? d : `${h}px`), { data: {
        x: v,
        y
      } };
    }
  };
}
function Tn(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Ra = ["top", "right", "bottom", "left"], We = Math.min, fe = Math.max, Wt = Math.round, Lt = Math.floor, Pe = (n) => ({
  x: n,
  y: n
}), La = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Da = {
  start: "end",
  end: "start"
};
function Pn(n, e, t) {
  return fe(n, We(e, t));
}
function $e(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function Be(n) {
  return n.split("-")[0];
}
function dt(n) {
  return n.split("-")[1];
}
function Wn(n) {
  return n === "x" ? "y" : "x";
}
function Vn(n) {
  return n === "y" ? "height" : "width";
}
const Ma = /* @__PURE__ */ new Set(["top", "bottom"]);
function Te(n) {
  return Ma.has(Be(n)) ? "y" : "x";
}
function jn(n) {
  return Wn(Te(n));
}
function $a(n, e, t) {
  t === void 0 && (t = !1);
  const i = dt(n), r = jn(n), o = Vn(r);
  let s = r === "x" ? i === (t ? "end" : "start") ? "right" : "left" : i === "start" ? "bottom" : "top";
  return e.reference[o] > e.floating[o] && (s = Vt(s)), [s, Vt(s)];
}
function Ba(n) {
  const e = Vt(n);
  return [An(n), e, An(e)];
}
function An(n) {
  return n.replace(/start|end/g, (e) => Da[e]);
}
const bi = ["left", "right"], wi = ["right", "left"], qa = ["top", "bottom"], Fa = ["bottom", "top"];
function za(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? wi : bi : e ? bi : wi;
    case "left":
    case "right":
      return e ? qa : Fa;
    default:
      return [];
  }
}
function Na(n, e, t, i) {
  const r = dt(n);
  let o = za(Be(n), t === "start", i);
  return r && (o = o.map((s) => s + "-" + r), e && (o = o.concat(o.map(An)))), o;
}
function Vt(n) {
  return n.replace(/left|right|bottom|top/g, (e) => La[e]);
}
function Ha(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Cr(n) {
  return typeof n != "number" ? Ha(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function jt(n) {
  const {
    x: e,
    y: t,
    width: i,
    height: r
  } = n;
  return {
    width: i,
    height: r,
    top: t,
    left: e,
    right: e + i,
    bottom: t + r,
    x: e,
    y: t
  };
}
function Si(n, e, t) {
  let {
    reference: i,
    floating: r
  } = n;
  const o = Te(e), s = jn(e), a = Vn(s), l = Be(e), u = o === "y", c = i.x + i.width / 2 - r.width / 2, d = i.y + i.height / 2 - r.height / 2, p = i[a] / 2 - r[a] / 2;
  let h;
  switch (l) {
    case "top":
      h = {
        x: c,
        y: i.y - r.height
      };
      break;
    case "bottom":
      h = {
        x: c,
        y: i.y + i.height
      };
      break;
    case "right":
      h = {
        x: i.x + i.width,
        y: d
      };
      break;
    case "left":
      h = {
        x: i.x - r.width,
        y: d
      };
      break;
    default:
      h = {
        x: i.x,
        y: i.y
      };
  }
  switch (dt(e)) {
    case "start":
      h[s] -= p * (t && u ? -1 : 1);
      break;
    case "end":
      h[s] += p * (t && u ? -1 : 1);
      break;
  }
  return h;
}
async function Wa(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: i,
    y: r,
    platform: o,
    rects: s,
    elements: a,
    strategy: l
  } = n, {
    boundary: u = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: p = !1,
    padding: h = 0
  } = $e(e, n), v = Cr(h), g = a[p ? d === "floating" ? "reference" : "floating" : d], b = jt(await o.getClippingRect({
    element: (t = await (o.isElement == null ? void 0 : o.isElement(g))) == null || t ? g : g.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(a.floating)),
    boundary: u,
    rootBoundary: c,
    strategy: l
  })), m = d === "floating" ? {
    x: i,
    y: r,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, S = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(a.floating)), w = await (o.isElement == null ? void 0 : o.isElement(S)) ? await (o.getScale == null ? void 0 : o.getScale(S)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = jt(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: m,
    offsetParent: S,
    strategy: l
  }) : m);
  return {
    top: (b.top - _.top + v.top) / w.y,
    bottom: (_.bottom - b.bottom + v.bottom) / w.y,
    left: (b.left - _.left + v.left) / w.x,
    right: (_.right - b.right + v.right) / w.x
  };
}
const Va = async (n, e, t) => {
  const {
    placement: i = "bottom",
    strategy: r = "absolute",
    middleware: o = [],
    platform: s
  } = t, a = o.filter(Boolean), l = await (s.isRTL == null ? void 0 : s.isRTL(e));
  let u = await s.getElementRects({
    reference: n,
    floating: e,
    strategy: r
  }), {
    x: c,
    y: d
  } = Si(u, i, l), p = i, h = {}, v = 0;
  for (let g = 0; g < a.length; g++) {
    var y;
    const {
      name: b,
      fn: m
    } = a[g], {
      x: S,
      y: w,
      data: _,
      reset: E
    } = await m({
      x: c,
      y: d,
      initialPlacement: i,
      placement: p,
      strategy: r,
      middlewareData: h,
      rects: u,
      platform: {
        ...s,
        detectOverflow: (y = s.detectOverflow) != null ? y : Wa
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = S ?? c, d = w ?? d, h = {
      ...h,
      [b]: {
        ...h[b],
        ..._
      }
    }, E && v <= 50 && (v++, typeof E == "object" && (E.placement && (p = E.placement), E.rects && (u = E.rects === !0 ? await s.getElementRects({
      reference: n,
      floating: e,
      strategy: r
    }) : E.rects), {
      x: c,
      y: d
    } = Si(u, p, l)), g = -1);
  }
  return {
    x: c,
    y: d,
    placement: p,
    strategy: r,
    middlewareData: h
  };
}, ja = (n) => ({
  name: "arrow",
  options: n,
  async fn(e) {
    const {
      x: t,
      y: i,
      placement: r,
      rects: o,
      platform: s,
      elements: a,
      middlewareData: l
    } = e, {
      element: u,
      padding: c = 0
    } = $e(n, e) || {};
    if (u == null)
      return {};
    const d = Cr(c), p = {
      x: t,
      y: i
    }, h = jn(r), v = Vn(h), y = await s.getDimensions(u), g = h === "y", b = g ? "top" : "left", m = g ? "bottom" : "right", S = g ? "clientHeight" : "clientWidth", w = o.reference[v] + o.reference[h] - p[h] - o.floating[v], _ = p[h] - o.reference[h], E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(u));
    let C = E ? E[S] : 0;
    (!C || !await (s.isElement == null ? void 0 : s.isElement(E))) && (C = a.floating[S] || o.floating[v]);
    const A = w / 2 - _ / 2, O = C / 2 - y[v] / 2 - 1, M = We(d[b], O), U = We(d[m], O), H = M, q = C - y[v] - U, R = C / 2 - y[v] / 2 + A, V = Pn(H, R, q), Y = !l.arrow && dt(r) != null && R !== V && o.reference[v] / 2 - (R < H ? M : U) - y[v] / 2 < 0, te = Y ? R < H ? R - H : R - q : 0;
    return {
      [h]: p[h] + te,
      data: {
        [h]: V,
        centerOffset: R - V - te,
        ...Y && {
          alignmentOffset: te
        }
      },
      reset: Y
    };
  }
}), Ua = function(n) {
  return n === void 0 && (n = {}), {
    name: "flip",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: r,
        middlewareData: o,
        rects: s,
        initialPlacement: a,
        platform: l,
        elements: u
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: p,
        fallbackStrategy: h = "bestFit",
        fallbackAxisSideDirection: v = "none",
        flipAlignment: y = !0,
        ...g
      } = $e(n, e);
      if ((t = o.arrow) != null && t.alignmentOffset)
        return {};
      const b = Be(r), m = Te(a), S = Be(a) === a, w = await (l.isRTL == null ? void 0 : l.isRTL(u.floating)), _ = p || (S || !y ? [Vt(a)] : Ba(a)), E = v !== "none";
      !p && E && _.push(...Na(a, y, v, w));
      const C = [a, ..._], A = await l.detectOverflow(e, g), O = [];
      let M = ((i = o.flip) == null ? void 0 : i.overflows) || [];
      if (c && O.push(A[b]), d) {
        const R = $a(r, s, w);
        O.push(A[R[0]], A[R[1]]);
      }
      if (M = [...M, {
        placement: r,
        overflows: O
      }], !O.every((R) => R <= 0)) {
        var U, H;
        const R = (((U = o.flip) == null ? void 0 : U.index) || 0) + 1, V = C[R];
        if (V && (!(d === "alignment" ? m !== Te(V) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        M.every((ne) => Te(ne.placement) === m ? ne.overflows[0] > 0 : !0)))
          return {
            data: {
              index: R,
              overflows: M
            },
            reset: {
              placement: V
            }
          };
        let Y = (H = M.filter((te) => te.overflows[0] <= 0).sort((te, ne) => te.overflows[1] - ne.overflows[1])[0]) == null ? void 0 : H.placement;
        if (!Y)
          switch (h) {
            case "bestFit": {
              var q;
              const te = (q = M.filter((ne) => {
                if (E) {
                  const ae = Te(ne.placement);
                  return ae === m || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  ae === "y";
                }
                return !0;
              }).map((ne) => [ne.placement, ne.overflows.filter((ae) => ae > 0).reduce((ae, Ee) => ae + Ee, 0)]).sort((ne, ae) => ne[1] - ae[1])[0]) == null ? void 0 : q[0];
              te && (Y = te);
              break;
            }
            case "initialPlacement":
              Y = a;
              break;
          }
        if (r !== Y)
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
function _i(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function Ci(n) {
  return Ra.some((e) => n[e] >= 0);
}
const Ka = function(n) {
  return n === void 0 && (n = {}), {
    name: "hide",
    options: n,
    async fn(e) {
      const {
        rects: t,
        platform: i
      } = e, {
        strategy: r = "referenceHidden",
        ...o
      } = $e(n, e);
      switch (r) {
        case "referenceHidden": {
          const s = await i.detectOverflow(e, {
            ...o,
            elementContext: "reference"
          }), a = _i(s, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: Ci(a)
            }
          };
        }
        case "escaped": {
          const s = await i.detectOverflow(e, {
            ...o,
            altBoundary: !0
          }), a = _i(s, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: Ci(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Er = /* @__PURE__ */ new Set(["left", "top"]);
async function Xa(n, e) {
  const {
    placement: t,
    platform: i,
    elements: r
  } = n, o = await (i.isRTL == null ? void 0 : i.isRTL(r.floating)), s = Be(t), a = dt(t), l = Te(t) === "y", u = Er.has(s) ? -1 : 1, c = o && l ? -1 : 1, d = $e(e, n);
  let {
    mainAxis: p,
    crossAxis: h,
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
  return a && typeof v == "number" && (h = a === "end" ? v * -1 : v), l ? {
    x: h * c,
    y: p * u
  } : {
    x: p * u,
    y: h * c
  };
}
const Ya = function(n) {
  return n === void 0 && (n = 0), {
    name: "offset",
    options: n,
    async fn(e) {
      var t, i;
      const {
        x: r,
        y: o,
        placement: s,
        middlewareData: a
      } = e, l = await Xa(e, n);
      return s === ((t = a.offset) == null ? void 0 : t.placement) && (i = a.arrow) != null && i.alignmentOffset ? {} : {
        x: r + l.x,
        y: o + l.y,
        data: {
          ...l,
          placement: s
        }
      };
    }
  };
}, Ga = function(n) {
  return n === void 0 && (n = {}), {
    name: "shift",
    options: n,
    async fn(e) {
      const {
        x: t,
        y: i,
        placement: r,
        platform: o
      } = e, {
        mainAxis: s = !0,
        crossAxis: a = !1,
        limiter: l = {
          fn: (b) => {
            let {
              x: m,
              y: S
            } = b;
            return {
              x: m,
              y: S
            };
          }
        },
        ...u
      } = $e(n, e), c = {
        x: t,
        y: i
      }, d = await o.detectOverflow(e, u), p = Te(Be(r)), h = Wn(p);
      let v = c[h], y = c[p];
      if (s) {
        const b = h === "y" ? "top" : "left", m = h === "y" ? "bottom" : "right", S = v + d[b], w = v - d[m];
        v = Pn(S, v, w);
      }
      if (a) {
        const b = p === "y" ? "top" : "left", m = p === "y" ? "bottom" : "right", S = y + d[b], w = y - d[m];
        y = Pn(S, y, w);
      }
      const g = l.fn({
        ...e,
        [h]: v,
        [p]: y
      });
      return {
        ...g,
        data: {
          x: g.x - t,
          y: g.y - i,
          enabled: {
            [h]: s,
            [p]: a
          }
        }
      };
    }
  };
}, Za = function(n) {
  return n === void 0 && (n = {}), {
    options: n,
    fn(e) {
      const {
        x: t,
        y: i,
        placement: r,
        rects: o,
        middlewareData: s
      } = e, {
        offset: a = 0,
        mainAxis: l = !0,
        crossAxis: u = !0
      } = $e(n, e), c = {
        x: t,
        y: i
      }, d = Te(r), p = Wn(d);
      let h = c[p], v = c[d];
      const y = $e(a, e), g = typeof y == "number" ? {
        mainAxis: y,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...y
      };
      if (l) {
        const S = p === "y" ? "height" : "width", w = o.reference[p] - o.floating[S] + g.mainAxis, _ = o.reference[p] + o.reference[S] - g.mainAxis;
        h < w ? h = w : h > _ && (h = _);
      }
      if (u) {
        var b, m;
        const S = p === "y" ? "width" : "height", w = Er.has(Be(r)), _ = o.reference[d] - o.floating[S] + (w && ((b = s.offset) == null ? void 0 : b[d]) || 0) + (w ? 0 : g.crossAxis), E = o.reference[d] + o.reference[S] + (w ? 0 : ((m = s.offset) == null ? void 0 : m[d]) || 0) - (w ? g.crossAxis : 0);
        v < _ ? v = _ : v > E && (v = E);
      }
      return {
        [p]: h,
        [d]: v
      };
    }
  };
}, Ja = function(n) {
  return n === void 0 && (n = {}), {
    name: "size",
    options: n,
    async fn(e) {
      var t, i;
      const {
        placement: r,
        rects: o,
        platform: s,
        elements: a
      } = e, {
        apply: l = () => {
        },
        ...u
      } = $e(n, e), c = await s.detectOverflow(e, u), d = Be(r), p = dt(r), h = Te(r) === "y", {
        width: v,
        height: y
      } = o.floating;
      let g, b;
      d === "top" || d === "bottom" ? (g = d, b = p === (await (s.isRTL == null ? void 0 : s.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (b = d, g = p === "end" ? "top" : "bottom");
      const m = y - c.top - c.bottom, S = v - c.left - c.right, w = We(y - c[g], m), _ = We(v - c[b], S), E = !e.middlewareData.shift;
      let C = w, A = _;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (A = S), (i = e.middlewareData.shift) != null && i.enabled.y && (C = m), E && !p) {
        const M = fe(c.left, 0), U = fe(c.right, 0), H = fe(c.top, 0), q = fe(c.bottom, 0);
        h ? A = v - 2 * (M !== 0 || U !== 0 ? M + U : fe(c.left, c.right)) : C = y - 2 * (H !== 0 || q !== 0 ? H + q : fe(c.top, c.bottom));
      }
      await l({
        ...e,
        availableWidth: A,
        availableHeight: C
      });
      const O = await s.getDimensions(a.floating);
      return v !== O.width || y !== O.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Qt() {
  return typeof window < "u";
}
function it(n) {
  return Un(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function he(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function Le(n) {
  var e;
  return (e = (Un(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Un(n) {
  return Qt() ? n instanceof Node || n instanceof he(n).Node : !1;
}
function we(n) {
  return Qt() ? n instanceof Element || n instanceof he(n).Element : !1;
}
function Oe(n) {
  return Qt() ? n instanceof HTMLElement || n instanceof he(n).HTMLElement : !1;
}
function Ei(n) {
  return !Qt() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof he(n).ShadowRoot;
}
const Qa = /* @__PURE__ */ new Set(["inline", "contents"]);
function kt(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: i,
    display: r
  } = Se(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + i + t) && !Qa.has(r);
}
const el = /* @__PURE__ */ new Set(["table", "td", "th"]);
function tl(n) {
  return el.has(it(n));
}
const nl = [":popover-open", ":modal"];
function en(n) {
  return nl.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const il = ["transform", "translate", "scale", "rotate", "perspective"], rl = ["transform", "translate", "scale", "rotate", "perspective", "filter"], ol = ["paint", "layout", "strict", "content"];
function Kn(n) {
  const e = Xn(), t = we(n) ? Se(n) : n;
  return il.some((i) => t[i] ? t[i] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || rl.some((i) => (t.willChange || "").includes(i)) || ol.some((i) => (t.contain || "").includes(i));
}
function sl(n) {
  let e = Ve(n);
  for (; Oe(e) && !ct(e); ) {
    if (Kn(e))
      return e;
    if (en(e))
      return null;
    e = Ve(e);
  }
  return null;
}
function Xn() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const al = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function ct(n) {
  return al.has(it(n));
}
function Se(n) {
  return he(n).getComputedStyle(n);
}
function tn(n) {
  return we(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ve(n) {
  if (it(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    Ei(n) && n.host || // Fallback.
    Le(n)
  );
  return Ei(e) ? e.host : e;
}
function xr(n) {
  const e = Ve(n);
  return ct(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : Oe(e) && kt(e) ? e : xr(e);
}
function _t(n, e, t) {
  var i;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const r = xr(n), o = r === ((i = n.ownerDocument) == null ? void 0 : i.body), s = he(r);
  if (o) {
    const a = On(s);
    return e.concat(s, s.visualViewport || [], kt(r) ? r : [], a && t ? _t(a) : []);
  }
  return e.concat(r, _t(r, [], t));
}
function On(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function kr(n) {
  const e = Se(n);
  let t = parseFloat(e.width) || 0, i = parseFloat(e.height) || 0;
  const r = Oe(n), o = r ? n.offsetWidth : t, s = r ? n.offsetHeight : i, a = Wt(t) !== o || Wt(i) !== s;
  return a && (t = o, i = s), {
    width: t,
    height: i,
    $: a
  };
}
function Yn(n) {
  return we(n) ? n : n.contextElement;
}
function lt(n) {
  const e = Yn(n);
  if (!Oe(e))
    return Pe(1);
  const t = e.getBoundingClientRect(), {
    width: i,
    height: r,
    $: o
  } = kr(e);
  let s = (o ? Wt(t.width) : t.width) / i, a = (o ? Wt(t.height) : t.height) / r;
  return (!s || !Number.isFinite(s)) && (s = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: s,
    y: a
  };
}
const ll = /* @__PURE__ */ Pe(0);
function Tr(n) {
  const e = he(n);
  return !Xn() || !e.visualViewport ? ll : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function ul(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== he(n) ? !1 : e;
}
function Je(n, e, t, i) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const r = n.getBoundingClientRect(), o = Yn(n);
  let s = Pe(1);
  e && (i ? we(i) && (s = lt(i)) : s = lt(n));
  const a = ul(o, t, i) ? Tr(o) : Pe(0);
  let l = (r.left + a.x) / s.x, u = (r.top + a.y) / s.y, c = r.width / s.x, d = r.height / s.y;
  if (o) {
    const p = he(o), h = i && we(i) ? he(i) : i;
    let v = p, y = On(v);
    for (; y && i && h !== v; ) {
      const g = lt(y), b = y.getBoundingClientRect(), m = Se(y), S = b.left + (y.clientLeft + parseFloat(m.paddingLeft)) * g.x, w = b.top + (y.clientTop + parseFloat(m.paddingTop)) * g.y;
      l *= g.x, u *= g.y, c *= g.x, d *= g.y, l += S, u += w, v = he(y), y = On(v);
    }
  }
  return jt({
    width: c,
    height: d,
    x: l,
    y: u
  });
}
function nn(n, e) {
  const t = tn(n).scrollLeft;
  return e ? e.left + t : Je(Le(n)).left + t;
}
function Pr(n, e) {
  const t = n.getBoundingClientRect(), i = t.left + e.scrollLeft - nn(n, t), r = t.top + e.scrollTop;
  return {
    x: i,
    y: r
  };
}
function cl(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: i,
    strategy: r
  } = n;
  const o = r === "fixed", s = Le(i), a = e ? en(e.floating) : !1;
  if (i === s || a && o)
    return t;
  let l = {
    scrollLeft: 0,
    scrollTop: 0
  }, u = Pe(1);
  const c = Pe(0), d = Oe(i);
  if ((d || !d && !o) && ((it(i) !== "body" || kt(s)) && (l = tn(i)), Oe(i))) {
    const h = Je(i);
    u = lt(i), c.x = h.x + i.clientLeft, c.y = h.y + i.clientTop;
  }
  const p = s && !d && !o ? Pr(s, l) : Pe(0);
  return {
    width: t.width * u.x,
    height: t.height * u.y,
    x: t.x * u.x - l.scrollLeft * u.x + c.x + p.x,
    y: t.y * u.y - l.scrollTop * u.y + c.y + p.y
  };
}
function dl(n) {
  return Array.from(n.getClientRects());
}
function fl(n) {
  const e = Le(n), t = tn(n), i = n.ownerDocument.body, r = fe(e.scrollWidth, e.clientWidth, i.scrollWidth, i.clientWidth), o = fe(e.scrollHeight, e.clientHeight, i.scrollHeight, i.clientHeight);
  let s = -t.scrollLeft + nn(n);
  const a = -t.scrollTop;
  return Se(i).direction === "rtl" && (s += fe(e.clientWidth, i.clientWidth) - r), {
    width: r,
    height: o,
    x: s,
    y: a
  };
}
const xi = 25;
function pl(n, e) {
  const t = he(n), i = Le(n), r = t.visualViewport;
  let o = i.clientWidth, s = i.clientHeight, a = 0, l = 0;
  if (r) {
    o = r.width, s = r.height;
    const c = Xn();
    (!c || c && e === "fixed") && (a = r.offsetLeft, l = r.offsetTop);
  }
  const u = nn(i);
  if (u <= 0) {
    const c = i.ownerDocument, d = c.body, p = getComputedStyle(d), h = c.compatMode === "CSS1Compat" && parseFloat(p.marginLeft) + parseFloat(p.marginRight) || 0, v = Math.abs(i.clientWidth - d.clientWidth - h);
    v <= xi && (o -= v);
  } else u <= xi && (o += u);
  return {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
const hl = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function vl(n, e) {
  const t = Je(n, !0, e === "fixed"), i = t.top + n.clientTop, r = t.left + n.clientLeft, o = Oe(n) ? lt(n) : Pe(1), s = n.clientWidth * o.x, a = n.clientHeight * o.y, l = r * o.x, u = i * o.y;
  return {
    width: s,
    height: a,
    x: l,
    y: u
  };
}
function ki(n, e, t) {
  let i;
  if (e === "viewport")
    i = pl(n, t);
  else if (e === "document")
    i = fl(Le(n));
  else if (we(e))
    i = vl(e, t);
  else {
    const r = Tr(n);
    i = {
      x: e.x - r.x,
      y: e.y - r.y,
      width: e.width,
      height: e.height
    };
  }
  return jt(i);
}
function Ar(n, e) {
  const t = Ve(n);
  return t === e || !we(t) || ct(t) ? !1 : Se(t).position === "fixed" || Ar(t, e);
}
function ml(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let i = _t(n, [], !1).filter((a) => we(a) && it(a) !== "body"), r = null;
  const o = Se(n).position === "fixed";
  let s = o ? Ve(n) : n;
  for (; we(s) && !ct(s); ) {
    const a = Se(s), l = Kn(s);
    !l && a.position === "fixed" && (r = null), (o ? !l && !r : !l && a.position === "static" && !!r && hl.has(r.position) || kt(s) && !l && Ar(n, s)) ? i = i.filter((c) => c !== s) : r = a, s = Ve(s);
  }
  return e.set(n, i), i;
}
function gl(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: i,
    strategy: r
  } = n;
  const s = [...t === "clippingAncestors" ? en(e) ? [] : ml(e, this._c) : [].concat(t), i], a = s[0], l = s.reduce((u, c) => {
    const d = ki(e, c, r);
    return u.top = fe(d.top, u.top), u.right = We(d.right, u.right), u.bottom = We(d.bottom, u.bottom), u.left = fe(d.left, u.left), u;
  }, ki(e, a, r));
  return {
    width: l.right - l.left,
    height: l.bottom - l.top,
    x: l.left,
    y: l.top
  };
}
function yl(n) {
  const {
    width: e,
    height: t
  } = kr(n);
  return {
    width: e,
    height: t
  };
}
function bl(n, e, t) {
  const i = Oe(e), r = Le(e), o = t === "fixed", s = Je(n, !0, o, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const l = Pe(0);
  function u() {
    l.x = nn(r);
  }
  if (i || !i && !o)
    if ((it(e) !== "body" || kt(r)) && (a = tn(e)), i) {
      const h = Je(e, !0, o, e);
      l.x = h.x + e.clientLeft, l.y = h.y + e.clientTop;
    } else r && u();
  o && !i && r && u();
  const c = r && !i && !o ? Pr(r, a) : Pe(0), d = s.left + a.scrollLeft - l.x - c.x, p = s.top + a.scrollTop - l.y - c.y;
  return {
    x: d,
    y: p,
    width: s.width,
    height: s.height
  };
}
function gn(n) {
  return Se(n).position === "static";
}
function Ti(n, e) {
  if (!Oe(n) || Se(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return Le(n) === t && (t = t.ownerDocument.body), t;
}
function Or(n, e) {
  const t = he(n);
  if (en(n))
    return t;
  if (!Oe(n)) {
    let r = Ve(n);
    for (; r && !ct(r); ) {
      if (we(r) && !gn(r))
        return r;
      r = Ve(r);
    }
    return t;
  }
  let i = Ti(n, e);
  for (; i && tl(i) && gn(i); )
    i = Ti(i, e);
  return i && ct(i) && gn(i) && !Kn(i) ? t : i || sl(n) || t;
}
const wl = async function(n) {
  const e = this.getOffsetParent || Or, t = this.getDimensions, i = await t(n.floating);
  return {
    reference: bl(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: i.width,
      height: i.height
    }
  };
};
function Sl(n) {
  return Se(n).direction === "rtl";
}
const _l = {
  convertOffsetParentRelativeRectToViewportRelativeRect: cl,
  getDocumentElement: Le,
  getClippingRect: gl,
  getOffsetParent: Or,
  getElementRects: wl,
  getClientRects: dl,
  getDimensions: yl,
  getScale: lt,
  isElement: we,
  isRTL: Sl
};
function Ir(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Cl(n, e) {
  let t = null, i;
  const r = Le(n);
  function o() {
    var a;
    clearTimeout(i), (a = t) == null || a.disconnect(), t = null;
  }
  function s(a, l) {
    a === void 0 && (a = !1), l === void 0 && (l = 1), o();
    const u = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: p,
      height: h
    } = u;
    if (a || e(), !p || !h)
      return;
    const v = Lt(d), y = Lt(r.clientWidth - (c + p)), g = Lt(r.clientHeight - (d + h)), b = Lt(c), S = {
      rootMargin: -v + "px " + -y + "px " + -g + "px " + -b + "px",
      threshold: fe(0, We(1, l)) || 1
    };
    let w = !0;
    function _(E) {
      const C = E[0].intersectionRatio;
      if (C !== l) {
        if (!w)
          return s();
        C ? s(!1, C) : i = setTimeout(() => {
          s(!1, 1e-7);
        }, 1e3);
      }
      C === 1 && !Ir(u, n.getBoundingClientRect()) && s(), w = !1;
    }
    try {
      t = new IntersectionObserver(_, {
        ...S,
        // Handle <iframe>s
        root: r.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(_, S);
    }
    t.observe(n);
  }
  return s(!0), o;
}
function El(n, e, t, i) {
  i === void 0 && (i = {});
  const {
    ancestorScroll: r = !0,
    ancestorResize: o = !0,
    elementResize: s = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: l = !1
  } = i, u = Yn(n), c = r || o ? [...u ? _t(u) : [], ..._t(e)] : [];
  c.forEach((b) => {
    r && b.addEventListener("scroll", t, {
      passive: !0
    }), o && b.addEventListener("resize", t);
  });
  const d = u && a ? Cl(u, t) : null;
  let p = -1, h = null;
  s && (h = new ResizeObserver((b) => {
    let [m] = b;
    m && m.target === u && h && (h.unobserve(e), cancelAnimationFrame(p), p = requestAnimationFrame(() => {
      var S;
      (S = h) == null || S.observe(e);
    })), t();
  }), u && !l && h.observe(u), h.observe(e));
  let v, y = l ? Je(n) : null;
  l && g();
  function g() {
    const b = Je(n);
    y && !Ir(y, b) && t(), y = b, v = requestAnimationFrame(g);
  }
  return t(), () => {
    var b;
    c.forEach((m) => {
      r && m.removeEventListener("scroll", t), o && m.removeEventListener("resize", t);
    }), d?.(), (b = h) == null || b.disconnect(), h = null, l && cancelAnimationFrame(v);
  };
}
const xl = Ya, kl = Ga, Pi = Ua, Tl = Ja, Pl = Ka, Al = ja, Ol = Za, Il = (n, e, t) => {
  const i = /* @__PURE__ */ new Map(), r = {
    platform: _l,
    ...t
  }, o = {
    ...r.platform,
    _c: i
  };
  return Va(n, e, {
    ...r,
    platform: o
  });
};
function Rl(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function In(n) {
  if (Rl(n)) {
    const e = n.$el;
    return Un(e) && it(e) === "#comment" ? null : e;
  }
  return n;
}
function at(n) {
  return typeof n == "function" ? n() : f(n);
}
function Ll(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = In(at(n.element));
      return t == null ? {} : Al({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Rr(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ai(n, e) {
  const t = Rr(n);
  return Math.round(e * t) / t;
}
function Dl(n, e, t) {
  t === void 0 && (t = {});
  const i = t.whileElementsMounted, r = P(() => {
    var C;
    return (C = at(t.open)) != null ? C : !0;
  }), o = P(() => at(t.middleware)), s = P(() => {
    var C;
    return (C = at(t.placement)) != null ? C : "bottom";
  }), a = P(() => {
    var C;
    return (C = at(t.strategy)) != null ? C : "absolute";
  }), l = P(() => {
    var C;
    return (C = at(t.transform)) != null ? C : !0;
  }), u = P(() => In(n.value)), c = P(() => In(e.value)), d = T(0), p = T(0), h = T(a.value), v = T(s.value), y = ut({}), g = T(!1), b = P(() => {
    const C = {
      position: h.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return C;
    const A = Ai(c.value, d.value), O = Ai(c.value, p.value);
    return l.value ? {
      ...C,
      transform: "translate(" + A + "px, " + O + "px)",
      ...Rr(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: h.value,
      left: A + "px",
      top: O + "px"
    };
  });
  let m;
  function S() {
    if (u.value == null || c.value == null)
      return;
    const C = r.value;
    Il(u.value, c.value, {
      middleware: o.value,
      placement: s.value,
      strategy: a.value
    }).then((A) => {
      d.value = A.x, p.value = A.y, h.value = A.strategy, v.value = A.placement, y.value = A.middlewareData, g.value = C !== !1;
    });
  }
  function w() {
    typeof m == "function" && (m(), m = void 0);
  }
  function _() {
    if (w(), i === void 0) {
      S();
      return;
    }
    if (u.value != null && c.value != null) {
      m = i(u.value, c.value, S);
      return;
    }
  }
  function E() {
    r.value || (g.value = !1);
  }
  return Q([o, s, a, r], S, {
    flush: "sync"
  }), Q([u, c], _, {
    flush: "sync"
  }), Q(r, E, {
    flush: "sync"
  }), zi() && Ni(w), {
    x: rt(d),
    y: rt(p),
    strategy: rt(h),
    placement: rt(v),
    middlewareData: rt(y),
    isPositioned: rt(g),
    floatingStyles: b,
    update: S
  };
}
const Ml = {
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
}, [ef, $l] = me("PopperContent");
var Bl = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ io({
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
  }, { ...Ml }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, i = e, r = _r(), { forwardRef: o, currentElement: s } = X(), a = T(), l = T(), { width: u, height: c } = Ms(l), d = P(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), p = P(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), h = P(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), v = P(() => ({
      padding: p.value,
      boundary: h.value.filter(Oa),
      altBoundary: h.value.length > 0
    })), y = P(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), g = ss(() => [
      xl({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && Pi({
        ...v.value,
        ...y.value
      }),
      t.avoidCollisions && kl({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? Ol() : void 0,
        ...v.value
      }),
      !t.prioritizePosition && t.avoidCollisions && Pi({
        ...v.value,
        ...y.value
      }),
      Tl({
        ...v.value,
        apply: ({ elements: H, rects: q, availableWidth: R, availableHeight: V }) => {
          const { width: Y, height: te } = q.reference, ne = H.floating.style;
          ne.setProperty("--reka-popper-available-width", `${R}px`), ne.setProperty("--reka-popper-available-height", `${V}px`), ne.setProperty("--reka-popper-anchor-width", `${Y}px`), ne.setProperty("--reka-popper-anchor-height", `${te}px`);
        }
      }),
      l.value && Ll({
        element: l.value,
        padding: t.arrowPadding
      }),
      Ia({
        arrowWidth: u.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Pl({
        strategy: "referenceHidden",
        ...v.value
      })
    ]), b = P(() => t.reference ?? r.anchor.value), { floatingStyles: m, placement: S, isPositioned: w, middlewareData: _ } = Dl(b, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...H) => El(...H, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: g
    }), E = P(() => Tn(S.value)[0]), C = P(() => Tn(S.value)[1]);
    Ki(() => {
      w.value && i("placed");
    });
    const A = P(() => {
      const H = _.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && H;
    }), O = T("");
    se(() => {
      s.value && (O.value = window.getComputedStyle(s.value).zIndex);
    });
    const M = P(() => _.value.arrow?.x ?? 0), U = P(() => _.value.arrow?.y ?? 0);
    return $l({
      placedSide: E,
      onArrowChange: (H) => l.value = H,
      arrowX: M,
      arrowY: U,
      shouldHideArrow: A
    }), (H, q) => (x(), N("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Ie({
        ...f(m),
        transform: f(w) ? f(m).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: O.value,
        "--reka-popper-transform-origin": [f(_).transformOrigin?.x, f(_).transformOrigin?.y].join(" "),
        ...f(_).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [L(f(J), j({ ref: f(o) }, H.$attrs, {
      "as-child": t.asChild,
      as: H.as,
      "data-side": E.value,
      "data-align": C.value,
      style: { animation: f(w) ? void 0 : "none" }
    }), {
      default: k(() => [B(H.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), ql = Bl;
function Fl(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => vt(i, e, t)) : vt(n, e, t);
}
function vt(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ht(n, e);
}
const [Gn, zl] = me("ListboxRoot");
var Nl = /* @__PURE__ */ D({
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
    const i = n, r = t, { multiple: o, highlightOnHover: s, orientation: a, disabled: l, selectionBehavior: u, dir: c } = qe(i), { getItems: d } = Ue({ isProvider: !0 }), { handleTypeaheadSearch: p } = Hn(), { primitiveElement: h, currentElement: v } = St(), y = Ds(), g = Fn(c), b = ar(v), m = T(), S = T(!1), w = T(!0), _ = /* @__PURE__ */ bt(i, "modelValue", r, {
      defaultValue: i.defaultValue ?? (o.value ? [] : void 0),
      passive: i.modelValue === void 0,
      deep: !0
    });
    function E($) {
      if (S.value = !0, i.multiple) {
        const F = Array.isArray(_.value) ? [..._.value] : [], W = F.findIndex((Z) => vt(Z, $, i.by));
        i.selectionBehavior === "toggle" ? (W === -1 ? F.push($) : F.splice(W, 1), _.value = F) : (_.value = [$], m.value = $);
      } else i.selectionBehavior === "toggle" && vt(_.value, $, i.by) ? _.value = void 0 : _.value = $;
      setTimeout(() => {
        S.value = !1;
      }, 1);
    }
    const C = T(null), A = T(null), O = T(!1), M = T(!1), U = /* @__PURE__ */ cn(), H = /* @__PURE__ */ cn(), q = /* @__PURE__ */ cn();
    function R() {
      return d().map(($) => $.ref).filter(($) => $.dataset.disabled !== "");
    }
    function V($, F = !0) {
      if (!$) return;
      C.value = $, w.value && C.value.focus(), F && C.value.scrollIntoView({ block: "nearest" });
      const W = d().find((Z) => Z.ref === $);
      r("highlight", W);
    }
    function Y($) {
      if (O.value) q.trigger($);
      else {
        const F = d().find((W) => vt(W.value, $, i.by));
        F && (C.value = F.ref, V(F.ref));
      }
    }
    function te($) {
      C.value && C.value.isConnected && ($.preventDefault(), $.stopPropagation(), M.value || C.value.click());
    }
    function ne($) {
      if (w.value) {
        if (S.value = !0, O.value) H.trigger($);
        else {
          const F = $.altKey || $.ctrlKey || $.metaKey;
          if (F && $.key === "a" && o.value) {
            const W = d(), Z = W.map((xe) => xe.value);
            _.value = [...Z], $.preventDefault(), V(W[W.length - 1].ref);
          } else if (!F) {
            const W = p($.key, d());
            W && V(W);
          }
        }
        setTimeout(() => {
          S.value = !1;
        }, 1);
      }
    }
    function ae() {
      M.value = !0;
    }
    function Ee() {
      re(() => {
        M.value = !1;
      });
    }
    function At() {
      re(() => {
        const $ = new KeyboardEvent("keydown", { key: "PageUp" });
        Ye($);
      });
    }
    function Xe($) {
      const F = C.value;
      F?.isConnected && (A.value = F), C.value = null, r("leave", $);
    }
    function an($) {
      const F = new CustomEvent("listbox.entryFocus", {
        bubbles: !1,
        cancelable: !0
      });
      if ($.currentTarget?.dispatchEvent(F), r("entryFocus", F), !F.defaultPrevented)
        if (A.value) V(A.value);
        else {
          const W = R()?.[0];
          V(W);
        }
    }
    function Ye($) {
      const F = wa($, a.value, g.value);
      if (!F) return;
      let W = R();
      if (C.value) {
        if (F === "last") W.reverse();
        else if (F === "prev" || F === "next") {
          F === "prev" && W.reverse();
          const Z = W.indexOf(C.value);
          W = W.slice(Z + 1);
        }
        ln($, W[0]);
      }
      if (W.length) {
        const Z = !C.value && F === "prev" ? W.length - 1 : 0;
        V(W[Z]);
      }
      if (O.value) return H.trigger($);
    }
    function ln($, F) {
      if (!(O.value || i.selectionBehavior !== "replace" || !o.value || !Array.isArray(_.value) || ($.altKey || $.ctrlKey || $.metaKey) && !$.shiftKey) && $.shiftKey) {
        const Z = d().filter((De) => De.ref.dataset.disabled !== "");
        let xe = Z.find((De) => De.ref === F)?.value;
        if ($.key === y.END ? xe = Z[Z.length - 1].value : $.key === y.HOME && (xe = Z[0].value), !xe || !m.value) return;
        const ft = os(Z.map((De) => De.value), m.value, xe);
        _.value = ft;
      }
    }
    async function un($) {
      if (await re(), O.value) U.trigger($);
      else {
        const F = R(), W = F.find((Z) => Z.dataset.state === "checked");
        W ? V(W) : F.length && V(F[0]);
      }
    }
    return Q(_, () => {
      S.value || re(() => {
        un();
      });
    }, {
      immediate: !0,
      deep: !0
    }), e({
      highlightedElement: C,
      highlightItem: Y,
      highlightFirstItem: At,
      highlightSelected: un,
      getItems: d
    }), zl({
      modelValue: _,
      onValueChange: E,
      multiple: o,
      orientation: a,
      dir: g,
      disabled: l,
      highlightOnHover: s,
      highlightedElement: C,
      isVirtual: O,
      virtualFocusHook: U,
      virtualKeydownHook: H,
      virtualHighlightHook: q,
      by: i.by,
      firstValue: m,
      selectionBehavior: u,
      focusable: w,
      onLeave: Xe,
      onEnter: an,
      changeHighlight: V,
      onKeydownEnter: te,
      onKeydownNavigation: Ye,
      onKeydownTypeAhead: ne,
      onCompositionStart: ae,
      onCompositionEnd: Ee,
      highlightFirstItem: At
    }), ($, F) => (x(), I(f(J), {
      ref_key: "primitiveElement",
      ref: h,
      as: $.as,
      "as-child": $.asChild,
      dir: f(g),
      "data-disabled": f(l) ? "" : void 0,
      onPointerleave: Xe,
      onFocusout: F[0] || (F[0] = async (W) => {
        const Z = W.relatedTarget || W.target;
        await re(), C.value && f(v) && !f(v).contains(Z) && Xe(W);
      })
    }, {
      default: k(() => [B($.$slots, "default", { modelValue: f(_) }), f(b) && $.name ? (x(), I(f(Ea), {
        key: 0,
        name: $.name,
        value: f(_),
        disabled: f(l),
        required: $.required
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
}), Hl = Nl, Wl = /* @__PURE__ */ D({
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
    const { CollectionSlot: e } = Ue(), t = Gn(), i = nr(!1, 10);
    return (r, o) => (x(), I(f(e), null, {
      default: k(() => [L(f(J), {
        role: "listbox",
        as: r.as,
        "as-child": r.asChild,
        tabindex: f(t).focusable.value ? f(t).highlightedElement.value ? "-1" : "0" : "-1",
        "aria-orientation": f(t).orientation.value,
        "aria-multiselectable": !!f(t).multiple.value,
        "data-orientation": f(t).orientation.value,
        onMousedown: o[0] || (o[0] = He((s) => i.value = !0, ["left"])),
        onFocus: o[1] || (o[1] = (s) => {
          f(i) || f(t).onEnter(s);
        }),
        onKeydown: [
          o[2] || (o[2] = mt((s) => {
            f(t).orientation.value === "vertical" && (s.key === "ArrowLeft" || s.key === "ArrowRight") || f(t).orientation.value === "horizontal" && (s.key === "ArrowUp" || s.key === "ArrowDown") || (s.preventDefault(), f(t).focusable.value && f(t).onKeydownNavigation(s));
          }, [
            "down",
            "up",
            "left",
            "right",
            "home",
            "end"
          ])),
          mt(f(t).onKeydownEnter, ["enter"]),
          f(t).onKeydownTypeAhead
        ]
      }, {
        default: k(() => [B(r.$slots, "default")]),
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
}), Vl = Wl, jl = /* @__PURE__ */ D({
  __name: "ListboxFilter",
  props: {
    modelValue: {
      type: String,
      required: !1
    },
    autoFocus: {
      type: Boolean,
      required: !1
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
      default: "input"
    }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = /* @__PURE__ */ bt(t, "modelValue", e, {
      defaultValue: "",
      passive: t.modelValue === void 0
    }), o = Gn(), { primitiveElement: s, currentElement: a } = St(), l = P(() => t.disabled || o.disabled.value || !1), u = T();
    return ro(() => u.value = o.highlightedElement.value?.id), ee(() => {
      o.focusable.value = !1, setTimeout(() => {
        t.autoFocus && a.value?.focus();
      }, 1);
    }), _e(() => {
      o.focusable.value = !0;
    }), (c, d) => (x(), I(f(J), {
      ref_key: "primitiveElement",
      ref: s,
      as: c.as,
      "as-child": c.asChild,
      value: f(r),
      disabled: l.value ? "" : void 0,
      "data-disabled": l.value ? "" : void 0,
      "aria-disabled": l.value ?? void 0,
      "aria-activedescendant": u.value,
      type: "text",
      onKeydown: [mt(He(f(o).onKeydownNavigation, ["prevent"]), [
        "down",
        "up",
        "home",
        "end"
      ]), mt(f(o).onKeydownEnter, ["enter"])],
      onInput: d[0] || (d[0] = (p) => {
        r.value = p.target.value, f(o).highlightFirstItem();
      }),
      onCompositionstart: f(o).onCompositionStart,
      onCompositionend: f(o).onCompositionEnd
    }, {
      default: k(() => [B(c.$slots, "default", { modelValue: f(r) })]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "value",
      "disabled",
      "data-disabled",
      "aria-disabled",
      "aria-activedescendant",
      "onKeydown",
      "onCompositionstart",
      "onCompositionend"
    ]));
  }
}), Ul = jl;
const Kl = "listbox.select", [Xl, Yl] = me("ListboxItem");
var Gl = /* @__PURE__ */ D({
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
    const t = n, i = e, r = wt(void 0, "reka-listbox-item"), { CollectionItem: o } = Ue(), { forwardRef: s, currentElement: a } = X(), l = Gn(), u = P(() => a.value === l.highlightedElement.value), c = P(() => Fl(l.modelValue.value, t.value, l.by)), d = P(() => l.disabled.value || t.disabled);
    async function p(v) {
      i("select", v), !v?.defaultPrevented && !d.value && v && (l.onValueChange(t.value), l.changeHighlight(a.value));
    }
    function h(v) {
      const y = {
        originalEvent: v,
        value: t.value
      };
      Xt(Kl, p, y);
    }
    return Yl({ isSelected: c }), (v, y) => (x(), I(f(o), { value: v.value }, {
      default: k(() => [oo([u.value, c.value], () => L(f(J), j({ id: f(r) }, v.$attrs, {
        ref: f(s),
        role: "option",
        tabindex: f(l).focusable.value ? u.value ? "0" : "-1" : -1,
        "aria-selected": c.value,
        as: v.as,
        "as-child": v.asChild,
        disabled: d.value ? "" : void 0,
        "data-disabled": d.value ? "" : void 0,
        "data-highlighted": u.value ? "" : void 0,
        "data-state": c.value ? "checked" : "unchecked",
        onClick: h,
        onKeydown: mt(He(h, ["prevent"]), ["space"]),
        onPointermove: y[0] || (y[0] = () => {
          f(l).highlightedElement.value !== f(a) && f(l).highlightOnHover.value && !f(l).focusable.value && f(l).changeHighlight(f(a), !1);
        })
      }), {
        default: k(() => [B(v.$slots, "default")]),
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
      ]), y, 1)]),
      _: 3
    }, 8, ["value"]));
  }
}), Zl = Gl, Jl = /* @__PURE__ */ D({
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
    X();
    const t = Xl();
    return (i, r) => f(t).isSelected.value ? (x(), I(f(J), j({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: k(() => [B(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), Ql = Jl;
function Lr(n) {
  const e = Yt({ nonce: T() });
  return P(() => n?.value || e.nonce?.value);
}
const [Ce, eu] = me("ScrollAreaRoot");
var tu = /* @__PURE__ */ D({
  __name: "ScrollAreaRoot",
  props: {
    type: {
      type: String,
      required: !1,
      default: "hover"
    },
    dir: {
      type: String,
      required: !1
    },
    scrollHideDelay: {
      type: Number,
      required: !1,
      default: 600
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
  setup(n, { expose: e }) {
    const t = n, i = T(0), r = T(0), o = T(), s = T(), a = T(), l = T(), u = T(!1), c = T(!1), { type: d, dir: p, scrollHideDelay: h } = qe(t), v = Fn(p);
    function y() {
      o.value?.scrollTo({ top: 0 });
    }
    function g() {
      o.value?.scrollTo({
        top: 0,
        left: 0
      });
    }
    e({
      viewport: o,
      scrollTop: y,
      scrollTopLeft: g
    });
    const { forwardRef: b, currentElement: m } = X();
    return eu({
      type: d,
      dir: v,
      scrollHideDelay: h,
      scrollArea: m,
      viewport: o,
      onViewportChange: (S) => {
        o.value = S || void 0;
      },
      content: s,
      onContentChange: (S) => {
        s.value = S;
      },
      scrollbarX: a,
      scrollbarXEnabled: u,
      scrollbarY: l,
      scrollbarYEnabled: c,
      onScrollbarXChange: (S) => {
        a.value = S || void 0;
      },
      onScrollbarYChange: (S) => {
        l.value = S || void 0;
      },
      onScrollbarXEnabledChange: (S) => {
        u.value = S;
      },
      onScrollbarYEnabledChange: (S) => {
        c.value = S;
      },
      onCornerWidthChange: (S) => {
        i.value = S;
      },
      onCornerHeightChange: (S) => {
        r.value = S;
      }
    }), (S, w) => (x(), I(f(J), {
      ref: f(b),
      "as-child": t.asChild,
      as: S.as,
      dir: f(v),
      style: Ie({
        position: "relative",
        "--reka-scroll-area-corner-width": `${i.value}px`,
        "--reka-scroll-area-corner-height": `${r.value}px`
      })
    }, {
      default: k(() => [B(S.$slots, "default")]),
      _: 3
    }, 8, [
      "as-child",
      "as",
      "dir",
      "style"
    ]));
  }
}), nu = tu;
function Dr(n, e) {
  return (t) => {
    if (n[0] === n[1] || e[0] === e[1]) return e[0];
    const i = (e[1] - e[0]) / (n[1] - n[0]);
    return e[0] + i * (t - n[0]);
  };
}
function rn(n) {
  const e = Mr(n.viewport, n.content), t = n.scrollbar.paddingStart + n.scrollbar.paddingEnd, i = (n.scrollbar.size - t) * e;
  return Math.max(i, 18);
}
function Mr(n, e) {
  const t = n / e;
  return Number.isNaN(t) ? 0 : t;
}
function iu(n, e = () => {
}) {
  let t = {
    left: n.scrollLeft,
    top: n.scrollTop
  }, i = 0;
  return (function r() {
    const o = {
      left: n.scrollLeft,
      top: n.scrollTop
    }, s = t.left !== o.left, a = t.top !== o.top;
    (s || a) && e(), t = o, i = window.requestAnimationFrame(r);
  })(), () => window.cancelAnimationFrame(i);
}
function Oi(n, e, t = "ltr") {
  const i = rn(e), r = e.scrollbar.paddingStart + e.scrollbar.paddingEnd, o = e.scrollbar.size - r, s = e.content - e.viewport, a = o - i, l = t === "ltr" ? [0, s] : [s * -1, 0], u = Cn(n, l[0], l[1]);
  return Dr([0, s], [0, a])(u);
}
function Dt(n) {
  return n ? Number.parseInt(n, 10) : 0;
}
function ru(n, e, t, i = "ltr") {
  const r = rn(t), o = r / 2, s = e || o, a = r - s, l = t.scrollbar.paddingStart + s, u = t.scrollbar.size - t.scrollbar.paddingEnd - a, c = t.content - t.viewport, d = i === "ltr" ? [0, c] : [c * -1, 0];
  return Dr([l, u], d)(n);
}
function Ii(n, e) {
  return n > 0 && n < e;
}
var ou = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarX",
  setup(n) {
    const e = Ce(), t = on(), { forwardRef: i, currentElement: r } = X();
    ee(() => {
      r.value && e.onScrollbarXChange(r.value);
    });
    const o = P(() => t.sizes.value);
    return (s, a) => (x(), I($r, {
      ref: f(i),
      "is-horizontal": !0,
      "data-orientation": "horizontal",
      style: Ie({
        bottom: 0,
        left: f(e).dir.value === "rtl" ? "var(--reka-scroll-area-corner-width)" : 0,
        right: f(e).dir.value === "ltr" ? "var(--reka-scroll-area-corner-width)" : 0,
        "--reka-scroll-area-thumb-width": o.value ? `${f(rn)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => f(t).onDragScroll(l.x))
    }, {
      default: k(() => [B(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), su = ou, au = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarY",
  setup(n) {
    const e = Ce(), t = on(), { forwardRef: i, currentElement: r } = X();
    ee(() => {
      r.value && e.onScrollbarYChange(r.value);
    });
    const o = P(() => t.sizes.value);
    return (s, a) => (x(), I($r, {
      ref: f(i),
      "is-horizontal": !1,
      "data-orientation": "vertical",
      style: Ie({
        top: 0,
        right: f(e).dir.value === "ltr" ? 0 : void 0,
        left: f(e).dir.value === "rtl" ? 0 : void 0,
        bottom: "var(--reka-scroll-area-corner-height)",
        "--reka-scroll-area-thumb-height": o.value ? `${f(rn)(o.value)}px` : void 0
      }),
      onOnDragScroll: a[0] || (a[0] = (l) => f(t).onDragScroll(l.y))
    }, {
      default: k(() => [B(s.$slots, "default")]),
      _: 3
    }, 8, ["style"]));
  }
}), lu = au, uu = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarAuto",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = Ce(), t = Tt(), { forwardRef: i } = X(), r = T(!1), o = /* @__PURE__ */ qn(() => {
      if (e.viewport.value) {
        const s = e.viewport.value.offsetWidth < e.viewport.value.scrollWidth, a = e.viewport.value.offsetHeight < e.viewport.value.scrollHeight;
        r.value = t.isHorizontal.value ? s : a;
      }
    }, 10);
    return ee(() => o()), yt(e.viewport, o), yt(e.content, o), (s, a) => (x(), I(f(nt), { present: s.forceMount || r.value }, {
      default: k(() => [L(Jn, j(s.$attrs, {
        ref: f(i),
        "data-state": r.value ? "visible" : "hidden"
      }), {
        default: k(() => [B(s.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), Zn = uu, cu = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarGlimpse",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = Ce(), t = Tt(), { forwardRef: i } = X(), { state: r, dispatch: o } = Nn("hidden", {
      hidden: {
        POINTER_ENTER: "glimpse",
        SCROLL: "scrolling"
      },
      glimpse: {
        HIDE: "hidden",
        POINTER_LEAVE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "glimpse"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    }), s = P(() => r.value !== "hidden");
    function a() {
      o("POINTER_ENTER");
    }
    function l() {
      o("POINTER_LEAVE");
    }
    const u = /* @__PURE__ */ qn(() => o("SCROLL_END"), 100);
    return se((c) => {
      if (r.value === "glimpse") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        c(() => {
          window.clearTimeout(d);
        });
      }
    }), se((c) => {
      if (r.value === "idle") {
        const d = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        c(() => {
          window.clearTimeout(d);
        });
      }
    }), se((c) => {
      const d = e.viewport.value, p = t.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (d) {
        let h = d[p];
        const v = () => {
          const y = d[p];
          h !== y && (o("SCROLL"), u()), h = y;
        };
        d.addEventListener("scroll", v), c(() => {
          d.removeEventListener("scroll", v);
        });
      }
    }), ee(() => {
      const c = e.scrollArea.value;
      c && (c.addEventListener("pointerenter", a), c.addEventListener("pointerleave", l));
    }), _e(() => {
      const c = e.scrollArea.value;
      c && (c.removeEventListener("pointerenter", a), c.removeEventListener("pointerleave", l));
    }), (c, d) => (x(), I(f(nt), { present: c.forceMount || s.value }, {
      default: k(() => [L(Zn, j(c.$attrs, {
        ref: f(i),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: k(() => [B(c.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), du = cu, fu = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbarHover",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = Ce(), { forwardRef: t } = X();
    let i;
    const r = T(!1);
    function o() {
      window.clearTimeout(i), r.value = !0;
    }
    function s() {
      i = window.setTimeout(() => {
        r.value = !1;
      }, e.scrollHideDelay.value);
    }
    return ee(() => {
      const a = e.scrollArea.value;
      a && (a.addEventListener("pointerenter", o), a.addEventListener("pointerleave", s));
    }), _e(() => {
      const a = e.scrollArea.value;
      a && (window.clearTimeout(i), a.removeEventListener("pointerenter", o), a.removeEventListener("pointerleave", s));
    }), (a, l) => (x(), I(f(nt), { present: a.forceMount || r.value }, {
      default: k(() => [L(Zn, j(a.$attrs, {
        ref: f(t),
        "data-state": r.value ? "visible" : "hidden"
      }), {
        default: k(() => [B(a.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), pu = fu, hu = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarScroll",
  props: { forceMount: {
    type: Boolean,
    required: !1
  } },
  setup(n) {
    const e = Ce(), t = Tt(), { forwardRef: i } = X(), { state: r, dispatch: o } = Nn("hidden", {
      hidden: { SCROLL: "scrolling" },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    }), s = P(() => r.value !== "hidden");
    se((l) => {
      if (r.value === "idle") {
        const u = window.setTimeout(() => o("HIDE"), e.scrollHideDelay.value);
        l(() => {
          window.clearTimeout(u);
        });
      }
    });
    const a = /* @__PURE__ */ qn(() => o("SCROLL_END"), 100);
    return se((l) => {
      const u = e.viewport.value, c = t.isHorizontal.value ? "scrollLeft" : "scrollTop";
      if (u) {
        let d = u[c];
        const p = () => {
          const h = u[c];
          d !== h && (o("SCROLL"), a()), d = h;
        };
        u.addEventListener("scroll", p), l(() => {
          u.removeEventListener("scroll", p);
        });
      }
    }), (l, u) => (x(), I(f(nt), { present: l.forceMount || s.value }, {
      default: k(() => [L(Jn, j(l.$attrs, {
        ref: f(i),
        "data-state": s.value ? "visible" : "hidden"
      }), {
        default: k(() => [B(l.$slots, "default")]),
        _: 3
      }, 16, ["data-state"])]),
      _: 3
    }, 8, ["present"]));
  }
}), vu = hu;
const [Tt, mu] = me("ScrollAreaScrollbar");
var gu = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "ScrollAreaScrollbar",
  props: {
    orientation: {
      type: String,
      required: !1,
      default: "vertical"
    },
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
      default: "div"
    }
  },
  setup(n) {
    const e = n, { forwardRef: t } = X(), i = Ce(), r = P(() => e.orientation === "horizontal");
    Q(r, () => {
      r.value ? i.onScrollbarXEnabledChange(!0) : i.onScrollbarYEnabledChange(!0);
    }, { immediate: !0 }), _e(() => {
      i.onScrollbarXEnabledChange(!1), i.onScrollbarYEnabledChange(!1);
    });
    const { orientation: o, forceMount: s, asChild: a, as: l } = qe(e);
    return mu({
      orientation: o,
      forceMount: s,
      isHorizontal: r,
      as: l,
      asChild: a
    }), (u, c) => f(i).type.value === "hover" ? (x(), I(pu, j({ key: 0 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "scroll" ? (x(), I(vu, j({ key: 1 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "glimpse" ? (x(), I(du, j({ key: 2 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "auto" ? (x(), I(Zn, j({ key: 3 }, u.$attrs, {
      ref: f(t),
      "force-mount": f(s)
    }), {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 16, ["force-mount"])) : f(i).type.value === "always" ? (x(), I(Jn, j({ key: 4 }, u.$attrs, {
      ref: f(t),
      "data-state": "visible"
    }), {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), yu = gu;
const [on, bu] = me("ScrollAreaScrollbarVisible");
var wu = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarVisible",
  setup(n) {
    const e = Ce(), t = Tt(), { forwardRef: i } = X(), r = T({
      content: 0,
      viewport: 0,
      scrollbar: {
        size: 0,
        paddingStart: 0,
        paddingEnd: 0
      }
    }), o = P(() => {
      const b = Mr(r.value.viewport, r.value.content);
      return b > 0 && b < 1;
    }), s = T(), a = T(0);
    function l(b, m) {
      if (h.value) {
        const S = e.viewport.value.scrollLeft + b.deltaY;
        e.viewport.value.scrollLeft = S, Ii(S, m) && b.preventDefault();
      } else {
        const S = e.viewport.value.scrollTop + b.deltaY;
        e.viewport.value.scrollTop = S, Ii(S, m) && b.preventDefault();
      }
    }
    function u(b, m) {
      h.value ? a.value = m.x : a.value = m.y;
    }
    function c(b) {
      a.value = 0;
    }
    function d(b) {
      r.value = b;
    }
    function p(b, m) {
      return ru(b, a.value, r.value, m);
    }
    const h = P(() => t.isHorizontal.value);
    function v(b) {
      h.value ? e.viewport.value.scrollLeft = p(b, e.dir.value) : e.viewport.value.scrollTop = p(b);
    }
    function y() {
      if (h.value) {
        if (e.viewport.value && s.value) {
          const b = e.viewport.value.scrollLeft, m = Oi(b, r.value, e.dir.value);
          s.value.style.transform = `translate3d(${m}px, 0, 0)`;
        }
      } else if (e.viewport.value && s.value) {
        const b = e.viewport.value.scrollTop, m = Oi(b, r.value);
        s.value.style.transform = `translate3d(0, ${m}px, 0)`;
      }
    }
    function g(b) {
      s.value = b;
    }
    return bu({
      sizes: r,
      hasThumb: o,
      handleWheelScroll: l,
      handleThumbDown: u,
      handleThumbUp: c,
      handleSizeChange: d,
      onThumbPositionChange: y,
      onThumbChange: g,
      onDragScroll: v
    }), (b, m) => h.value ? (x(), I(su, j({ key: 0 }, b.$attrs, { ref: f(i) }), {
      default: k(() => [B(b.$slots, "default")]),
      _: 3
    }, 16)) : (x(), I(lu, j({ key: 1 }, b.$attrs, { ref: f(i) }), {
      default: k(() => [B(b.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Jn = wu, Su = /* @__PURE__ */ D({
  __name: "ScrollAreaScrollbarImpl",
  props: { isHorizontal: {
    type: Boolean,
    required: !0
  } },
  emits: [
    "onDragScroll",
    "onWheelScroll",
    "onThumbPointerDown"
  ],
  setup(n, { emit: e }) {
    const t = n, i = e, r = Ce(), o = on(), s = Tt(), { forwardRef: a, currentElement: l } = X(), u = T(""), c = T();
    function d(b) {
      if (c.value) {
        const m = b.clientX - c.value?.left, S = b.clientY - c.value?.top;
        i("onDragScroll", {
          x: m,
          y: S
        });
      }
    }
    function p(b) {
      b.button === 0 && (b.target.setPointerCapture(b.pointerId), c.value = l.value.getBoundingClientRect(), u.value = document.body.style.webkitUserSelect, document.body.style.webkitUserSelect = "none", r.viewport && (r.viewport.value.style.scrollBehavior = "auto"), d(b));
    }
    function h(b) {
      d(b);
    }
    function v(b) {
      const m = b.target;
      m.hasPointerCapture(b.pointerId) && m.releasePointerCapture(b.pointerId), document.body.style.webkitUserSelect = u.value, r.viewport && (r.viewport.value.style.scrollBehavior = ""), c.value = void 0;
    }
    function y(b) {
      const m = b.target, S = l.value?.contains(m), w = o.sizes.value.content - o.sizes.value.viewport;
      S && o.handleWheelScroll(b, w);
    }
    ee(() => {
      document.addEventListener("wheel", y, { passive: !1 });
    }), _e(() => {
      document.removeEventListener("wheel", y);
    });
    function g() {
      l.value && (t.isHorizontal ? o.handleSizeChange({
        content: r.viewport.value?.scrollWidth ?? 0,
        viewport: r.viewport.value?.offsetWidth ?? 0,
        scrollbar: {
          size: l.value.clientWidth ?? 0,
          paddingStart: Dt(getComputedStyle(l.value).paddingLeft),
          paddingEnd: Dt(getComputedStyle(l.value).paddingRight)
        }
      }) : o.handleSizeChange({
        content: r.viewport.value?.scrollHeight ?? 0,
        viewport: r.viewport.value?.offsetHeight ?? 0,
        scrollbar: {
          size: l.value?.clientHeight ?? 0,
          paddingStart: Dt(getComputedStyle(l.value).paddingTop),
          paddingEnd: Dt(getComputedStyle(l.value).paddingBottom)
        }
      }), o.onThumbPositionChange());
    }
    return yt(l, g), yt(r.content, g), (b, m) => (x(), I(f(J), {
      ref: f(a),
      style: { position: "absolute" },
      "data-scrollbarimpl": "",
      as: f(s).as.value,
      "as-child": f(s).asChild.value,
      onPointerdown: p,
      onPointermove: h,
      onPointerup: v
    }, {
      default: k(() => [B(b.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), $r = Su, _u = /* @__PURE__ */ D({
  __name: "ScrollAreaThumb",
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
    const e = n, t = Ce(), i = on();
    function r(p) {
      const v = p.target.getBoundingClientRect(), y = p.clientX - v.left, g = p.clientY - v.top;
      i.handleThumbDown(p, {
        x: y,
        y: g
      });
    }
    function o(p) {
      i.handleThumbUp(p);
    }
    const { forwardRef: s, currentElement: a } = X(), l = T(), u = P(() => t.viewport.value);
    function c() {
      if (!l.value) {
        const p = iu(u.value, i.onThumbPositionChange);
        l.value = p, i.onThumbPositionChange();
      }
    }
    const d = P(() => i.sizes.value);
    return ys(d, () => {
      i.onThumbChange(a.value), u.value && (i.onThumbPositionChange(), u.value.addEventListener("scroll", c));
    }), _e(() => {
      u.value.removeEventListener("scroll", c), t.viewport.value?.removeEventListener("scroll", c);
    }), (p, h) => (x(), I(f(J), {
      ref: f(s),
      "data-state": f(i).hasThumb ? "visible" : "hidden",
      style: {
        width: "var(--reka-scroll-area-thumb-width)",
        height: "var(--reka-scroll-area-thumb-height)"
      },
      "as-child": e.asChild,
      as: p.as,
      onPointerdown: r,
      onPointerup: o
    }, {
      default: k(() => [B(p.$slots, "default")]),
      _: 3
    }, 8, [
      "data-state",
      "as-child",
      "as"
    ]));
  }
}), Cu = _u, Eu = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "ScrollAreaViewport",
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
  setup(n, { expose: e }) {
    const t = n, { nonce: i } = qe(t), r = Lr(i), o = Ce(), s = T();
    ee(() => {
      o.onViewportChange(s.value), o.onContentChange(l.value);
    }), e({ viewportElement: s });
    const { forwardRef: a, currentElement: l } = X();
    return (u, c) => (x(), N(pe, null, [z("div", j({
      ref_key: "viewportElement",
      ref: s,
      "data-reka-scroll-area-viewport": "",
      style: {
        overflowX: f(o).scrollbarXEnabled.value ? "scroll" : "hidden",
        overflowY: f(o).scrollbarYEnabled.value ? "scroll" : "hidden"
      }
    }, u.$attrs, { tabindex: 0 }), [L(f(J), {
      ref: f(a),
      style: Ie({ minWidth: f(o).scrollbarXEnabled.value ? "fit-content" : void 0 }),
      "as-child": t.asChild,
      as: u.as
    }, {
      default: k(() => [B(u.$slots, "default")]),
      _: 3
    }, 8, [
      "style",
      "as-child",
      "as"
    ])], 16), L(f(J), {
      as: "style",
      nonce: f(r)
    }, {
      default: k(() => c[0] || (c[0] = [ue(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-scroll-area-viewport] { scrollbar-width:none; -ms-overflow-style:none; -webkit-overflow-scrolling:touch; } [data-reka-scroll-area-viewport]::-webkit-scrollbar { display:none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), xu = Eu;
const ku = [
  " ",
  "Enter",
  "ArrowUp",
  "ArrowDown"
], Tu = [" ", "Enter"], be = 10;
function Ct(n, e, t) {
  return n === void 0 ? !1 : Array.isArray(n) ? n.some((i) => Rn(i, e, t)) : Rn(n, e, t);
}
function Rn(n, e, t) {
  return n === void 0 || e === void 0 ? !1 : typeof n == "string" ? n === e : typeof t == "function" ? t(n, e) : typeof t == "string" ? n?.[t] === e?.[t] : Ht(n, e);
}
function Pu(n) {
  return n == null || n === "" || Array.isArray(n) && n.length === 0;
}
const Au = {
  key: 0,
  value: ""
}, [Ke, Br] = me("SelectRoot");
var Ou = /* @__PURE__ */ D({
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
    const t = n, i = e, { required: r, disabled: o, multiple: s, dir: a } = qe(t), l = /* @__PURE__ */ bt(t, "modelValue", i, {
      defaultValue: t.defaultValue ?? (s.value ? [] : void 0),
      passive: t.modelValue === void 0,
      deep: !0
    }), u = /* @__PURE__ */ bt(t, "open", i, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), c = T(), d = T(), p = T({
      x: 0,
      y: 0
    }), h = P(() => s.value && Array.isArray(l.value) ? l.value?.length === 0 : En(l.value));
    Ue({ isProvider: !0 });
    const v = Fn(a), y = ar(c), g = T(/* @__PURE__ */ new Set()), b = P(() => Array.from(g.value).map((w) => w.value).join(";"));
    function m(w) {
      if (s.value) {
        const _ = Array.isArray(l.value) ? [...l.value] : [], E = _.findIndex((C) => Rn(C, w, t.by));
        E === -1 ? _.push(w) : _.splice(E, 1), l.value = [..._];
      } else l.value = w;
    }
    function S(w) {
      return Array.from(g.value).find((_) => Ct(w, _.value, t.by));
    }
    return Br({
      triggerElement: c,
      onTriggerChange: (w) => {
        c.value = w;
      },
      valueElement: d,
      onValueElementChange: (w) => {
        d.value = w;
      },
      contentId: "",
      modelValue: l,
      onValueChange: m,
      by: t.by,
      open: u,
      multiple: s,
      required: r,
      onOpenChange: (w) => {
        u.value = w;
      },
      dir: v,
      triggerPointerDownPosRef: p,
      disabled: o,
      isEmptyModelValue: h,
      optionsSet: g,
      onOptionAdd: (w) => {
        const _ = S(w.value);
        _ && g.value.delete(_), g.value.add(w);
      },
      onOptionRemove: (w) => {
        const _ = S(w.value);
        _ && g.value.delete(_);
      }
    }), (w, _) => (x(), I(f(Ta), null, {
      default: k(() => [B(w.$slots, "default", {
        modelValue: f(l),
        open: f(u)
      }), f(y) ? (x(), I(Lu, {
        key: b.value,
        "aria-hidden": "true",
        tabindex: "-1",
        multiple: f(s),
        required: f(r),
        name: w.name,
        autocomplete: w.autocomplete,
        disabled: f(o),
        value: f(l)
      }, {
        default: k(() => [f(En)(f(l)) ? (x(), N("option", Au)) : K("v-if", !0), (x(!0), N(pe, null, et(Array.from(g.value), (E) => (x(), N("option", j({ key: E.value ?? "" }, { ref_for: !0 }, E), null, 16))), 128))]),
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
}), Iu = Ou, Ru = /* @__PURE__ */ D({
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
    const e = n, t = T(), i = Ke();
    Q(() => e.value, (o, s) => {
      const a = window.HTMLSelectElement.prototype, u = Object.getOwnPropertyDescriptor(a, "value").set;
      if (o !== s && u && t.value) {
        const c = new Event("change", { bubbles: !0 });
        u.call(t.value, o), t.value.dispatchEvent(c);
      }
    });
    function r(o) {
      i.onValueChange(o.target.value);
    }
    return (o, s) => (x(), I(f(Sr), { "as-child": "" }, {
      default: k(() => [z("select", j({
        ref_key: "selectElement",
        ref: t
      }, e, { onInput: r }), [B(o.$slots, "default")], 16)]),
      _: 3
    }));
  }
}), Lu = Ru, Du = /* @__PURE__ */ D({
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
      default: be
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
    const t = zn(n);
    return (i, r) => (x(), I(f(ql), j(f(t), { style: {
      boxSizing: "border-box",
      "--reka-select-content-transform-origin": "var(--reka-popper-transform-origin)",
      "--reka-select-content-available-width": "var(--reka-popper-available-width)",
      "--reka-select-content-available-height": "var(--reka-popper-available-height)",
      "--reka-select-trigger-width": "var(--reka-popper-anchor-width)",
      "--reka-select-trigger-height": "var(--reka-popper-anchor-height)"
    } }), {
      default: k(() => [B(i.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Mu = Du;
const $u = {
  onViewportChange: () => {
  },
  itemTextRefCallback: () => {
  },
  itemRefCallback: () => {
  }
}, [sn, qr] = me("SelectContent");
var Bu = /* @__PURE__ */ D({
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
    const t = n, i = e, r = Ke();
    Ts(), or(t.bodyLock);
    const { CollectionSlot: o, getItems: s } = Ue(), a = T();
    ur(a);
    const { search: l, handleTypeaheadSearch: u } = Hn(), c = T(), d = T(), p = T(), h = T(!1), v = T(!1), y = T(!1);
    function g() {
      d.value && a.value && mi([d.value, a.value]);
    }
    Q(h, () => {
      g();
    });
    const { onOpenChange: b, triggerPointerDownPosRef: m } = r;
    se((E) => {
      if (!a.value) return;
      let C = {
        x: 0,
        y: 0
      };
      const A = (M) => {
        C = {
          x: Math.abs(Math.round(M.pageX) - (m.value?.x ?? 0)),
          y: Math.abs(Math.round(M.pageY) - (m.value?.y ?? 0))
        };
      }, O = (M) => {
        M.pointerType !== "touch" && (C.x <= 10 && C.y <= 10 ? M.preventDefault() : a.value?.contains(M.target) || b(!1), document.removeEventListener("pointermove", A), m.value = null);
      };
      m.value !== null && (document.addEventListener("pointermove", A), document.addEventListener("pointerup", O, {
        capture: !0,
        once: !0
      })), E(() => {
        document.removeEventListener("pointermove", A), document.removeEventListener("pointerup", O, { capture: !0 });
      });
    });
    function S(E) {
      const C = E.ctrlKey || E.altKey || E.metaKey;
      if (E.key === "Tab" && E.preventDefault(), !C && E.key.length === 1 && u(E.key, s()), [
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(E.key)) {
        let O = [...s().map((M) => M.ref)];
        if (["ArrowUp", "End"].includes(E.key) && (O = O.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(E.key)) {
          const M = E.target, U = O.indexOf(M);
          O = O.slice(U + 1);
        }
        setTimeout(() => mi(O)), E.preventDefault();
      }
    }
    const w = P(() => t.position === "popper" ? t : {}), _ = zn(w.value);
    return qr({
      content: a,
      viewport: c,
      onViewportChange: (E) => {
        c.value = E;
      },
      itemRefCallback: (E, C, A) => {
        const O = !v.value && !A, M = Ct(r.modelValue.value, C, r.by);
        if (r.multiple.value) {
          if (y.value) return;
          (M || O) && (d.value = E, M && (y.value = !0));
        } else (M || O) && (d.value = E);
        O && (v.value = !0);
      },
      selectedItem: d,
      selectedItemText: p,
      onItemLeave: () => {
        a.value?.focus();
      },
      itemTextRefCallback: (E, C, A) => {
        const O = !v.value && !A;
        (Ct(r.modelValue.value, C, r.by) || O) && (p.value = E);
      },
      focusSelectedItem: g,
      position: t.position,
      isPositioned: h,
      searchRef: l
    }), (E, C) => (x(), I(f(o), null, {
      default: k(() => [L(f(hr), {
        "as-child": "",
        onMountAutoFocus: C[6] || (C[6] = He(() => {
        }, ["prevent"])),
        onUnmountAutoFocus: C[7] || (C[7] = (A) => {
          i("closeAutoFocus", A), !A.defaultPrevented && (f(r).triggerElement.value?.focus({ preventScroll: !0 }), A.preventDefault());
        })
      }, {
        default: k(() => [L(f(fr), {
          "as-child": "",
          "disable-outside-pointer-events": E.disableOutsidePointerEvents,
          onFocusOutside: C[2] || (C[2] = He(() => {
          }, ["prevent"])),
          onDismiss: C[3] || (C[3] = (A) => f(r).onOpenChange(!1)),
          onEscapeKeyDown: C[4] || (C[4] = (A) => i("escapeKeyDown", A)),
          onPointerDownOutside: C[5] || (C[5] = (A) => i("pointerDownOutside", A))
        }, {
          default: k(() => [(x(), I(so(E.position === "popper" ? Mu : Hu), j({
            ...E.$attrs,
            ...f(_)
          }, {
            id: f(r).contentId,
            ref: (A) => {
              const O = f(Ae)(A);
              O?.hasAttribute("data-reka-popper-content-wrapper") ? a.value = O.firstElementChild : a.value = O;
            },
            role: "listbox",
            "data-state": f(r).open.value ? "open" : "closed",
            dir: f(r).dir.value,
            style: {
              display: "flex",
              flexDirection: "column",
              outline: "none"
            },
            onContextmenu: C[0] || (C[0] = He(() => {
            }, ["prevent"])),
            onPlaced: C[1] || (C[1] = (A) => h.value = !0),
            onKeydown: S
          }), {
            default: k(() => [B(E.$slots, "default")]),
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
}), qu = Bu;
const [Fu, zu] = me("SelectItemAlignedPosition");
var Nu = /* @__PURE__ */ D({
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
    const t = n, i = e, { getItems: r } = Ue(), o = Ke(), s = sn(), a = T(!1), l = T(!0), u = T(), { forwardRef: c, currentElement: d } = X(), { viewport: p, selectedItem: h, selectedItemText: v, focusSelectedItem: y } = s;
    function g() {
      if (o.triggerElement.value && o.valueElement.value && u.value && d.value && p?.value && h?.value && v?.value) {
        const S = o.triggerElement.value.getBoundingClientRect(), w = d.value.getBoundingClientRect(), _ = o.valueElement.value.getBoundingClientRect(), E = v.value.getBoundingClientRect();
        if (o.dir.value !== "rtl") {
          const $ = E.left - w.left, F = _.left - $, W = S.left - F, Z = S.width + W, xe = Math.max(Z, w.width), ft = window.innerWidth - be, De = Cn(F, be, Math.max(be, ft - xe));
          u.value.style.minWidth = `${Z}px`, u.value.style.left = `${De}px`;
        } else {
          const $ = w.right - E.right, F = window.innerWidth - _.right - $, W = window.innerWidth - S.right - F, Z = S.width + W, xe = Math.max(Z, w.width), ft = window.innerWidth - be, De = Cn(F, be, Math.max(be, ft - xe));
          u.value.style.minWidth = `${Z}px`, u.value.style.right = `${De}px`;
        }
        const C = r().map(($) => $.ref), A = window.innerHeight - be * 2, O = p.value.scrollHeight, M = window.getComputedStyle(d.value), U = Number.parseInt(M.borderTopWidth, 10), H = Number.parseInt(M.paddingTop, 10), q = Number.parseInt(M.borderBottomWidth, 10), R = Number.parseInt(M.paddingBottom, 10), V = U + H + O + R + q, Y = Math.min(h.value.offsetHeight * 5, V), te = window.getComputedStyle(p.value), ne = Number.parseInt(te.paddingTop, 10), ae = Number.parseInt(te.paddingBottom, 10), Ee = S.top + S.height / 2 - be, At = A - Ee, Xe = h.value.offsetHeight / 2, an = h.value.offsetTop + Xe, Ye = U + H + an, ln = V - Ye;
        if (Ye <= Ee) {
          const $ = h.value === C[C.length - 1];
          u.value.style.bottom = "0px";
          const F = d.value.clientHeight - p.value.offsetTop - p.value.offsetHeight, W = Math.max(At, Xe + ($ ? ae : 0) + F + q), Z = Ye + W;
          u.value.style.height = `${Z}px`;
        } else {
          const $ = h.value === C[0];
          u.value.style.top = "0px";
          const W = Math.max(Ee, U + p.value.offsetTop + ($ ? ne : 0) + Xe) + ln;
          u.value.style.height = `${W}px`, p.value.scrollTop = Ye - Ee + p.value.offsetTop;
        }
        u.value.style.margin = `${be}px 0`, u.value.style.minHeight = `${Y}px`, u.value.style.maxHeight = `${A}px`, i("placed"), requestAnimationFrame(() => a.value = !0);
      }
    }
    const b = T("");
    ee(async () => {
      await re(), g(), d.value && (b.value = window.getComputedStyle(d.value).zIndex);
    });
    function m(S) {
      S && l.value === !0 && (g(), y?.(), l.value = !1);
    }
    return yt(o.triggerElement, () => {
      g();
    }), zu({
      contentWrapper: u,
      shouldExpandOnScrollRef: a,
      onScrollButtonChange: m
    }), (S, w) => (x(), N("div", {
      ref_key: "contentWrapperElement",
      ref: u,
      style: Ie({
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        zIndex: b.value
      })
    }, [L(f(J), j({
      ref: f(c),
      style: {
        boxSizing: "border-box",
        maxHeight: "100%"
      }
    }, {
      ...S.$attrs,
      ...t
    }), {
      default: k(() => [B(S.$slots, "default")]),
      _: 3
    }, 16)], 4));
  }
}), Hu = Nu, Wu = /* @__PURE__ */ D({
  inheritAttrs: !1,
  __name: "SelectProvider",
  props: { context: {
    type: Object,
    required: !0
  } },
  setup(n) {
    return Br(n.context), qr($u), (t, i) => B(t.$slots, "default");
  }
}), Vu = Wu;
const ju = { key: 1 };
var Uu = /* @__PURE__ */ D({
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
    const t = n, r = Ps(t, e), o = Ke(), s = T();
    ee(() => {
      s.value = new DocumentFragment();
    });
    const a = T(), l = P(() => t.forceMount || o.open.value), u = T(l.value);
    return Q(l, () => {
      setTimeout(() => u.value = l.value);
    }), (c, d) => l.value || u.value || a.value?.present ? (x(), I(f(nt), {
      key: 0,
      ref_key: "presenceRef",
      ref: a,
      present: l.value
    }, {
      default: k(() => [L(qu, Dn(Mn({
        ...f(r),
        ...c.$attrs
      })), {
        default: k(() => [B(c.$slots, "default")]),
        _: 3
      }, 16)]),
      _: 3
    }, 8, ["present"])) : s.value ? (x(), N("div", ju, [(x(), I(Ui, { to: s.value }, [L(Vu, { context: f(o) }, {
      default: k(() => [B(c.$slots, "default")]),
      _: 3
    }, 8, ["context"])], 8, ["to"]))])) : K("v-if", !0);
  }
}), Ku = Uu, Xu = /* @__PURE__ */ D({
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
    return (e, t) => (x(), I(f(J), {
      "aria-hidden": "true",
      as: e.as,
      "as-child": e.asChild
    }, {
      default: k(() => [B(e.$slots, "default", {}, () => [t[0] || (t[0] = ue("▼"))])]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Yu = Xu;
const [Fr, Gu] = me("SelectItem");
var Zu = /* @__PURE__ */ D({
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
    const t = n, i = e, { disabled: r } = qe(t), o = Ke(), s = sn(), { forwardRef: a, currentElement: l } = X(), { CollectionItem: u } = Ue(), c = P(() => Ct(o.modelValue?.value, t.value, o.by)), d = T(!1), p = T(t.textValue ?? ""), h = wt(void 0, "reka-select-item-text"), v = "select.select";
    async function y(w) {
      if (w.defaultPrevented) return;
      const _ = {
        originalEvent: w,
        value: t.value
      };
      Xt(v, g, _);
    }
    async function g(w) {
      await re(), i("select", w), !w.defaultPrevented && (r.value || (o.onValueChange(t.value), o.multiple.value || o.onOpenChange(!1)));
    }
    async function b(w) {
      await re(), !w.defaultPrevented && (r.value ? s.onItemLeave?.() : w.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function m(w) {
      await re(), !w.defaultPrevented && w.currentTarget === ye() && s.onItemLeave?.();
    }
    async function S(w) {
      await re(), !(w.defaultPrevented || s.searchRef?.value !== "" && w.key === " ") && (Tu.includes(w.key) && y(w), w.key === " " && w.preventDefault());
    }
    if (t.value === "") throw new Error("A <SelectItem /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
    return ee(() => {
      l.value && s.itemRefCallback(l.value, t.value, t.disabled);
    }), Gu({
      value: t.value,
      disabled: r,
      textId: h,
      isSelected: c,
      onItemTextChange: (w) => {
        p.value = ((p.value || w?.textContent) ?? "").trim();
      }
    }), (w, _) => (x(), I(f(u), { value: { textValue: p.value } }, {
      default: k(() => [L(f(J), {
        ref: f(a),
        role: "option",
        "aria-labelledby": f(h),
        "data-highlighted": d.value ? "" : void 0,
        "aria-selected": c.value,
        "data-state": c.value ? "checked" : "unchecked",
        "aria-disabled": f(r) || void 0,
        "data-disabled": f(r) ? "" : void 0,
        tabindex: f(r) ? void 0 : -1,
        as: w.as,
        "as-child": w.asChild,
        onFocus: _[0] || (_[0] = (E) => d.value = !0),
        onBlur: _[1] || (_[1] = (E) => d.value = !1),
        onPointerup: y,
        onPointerdown: _[2] || (_[2] = (E) => {
          E.currentTarget.focus({ preventScroll: !0 });
        }),
        onTouchend: _[3] || (_[3] = He(() => {
        }, ["prevent", "stop"])),
        onPointermove: b,
        onPointerleave: m,
        onKeydown: S
      }, {
        default: k(() => [B(w.$slots, "default")]),
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
}), Ju = Zu, Qu = /* @__PURE__ */ D({
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
    const e = n, t = Fr();
    return (i, r) => f(t).isSelected.value ? (x(), I(f(J), j({
      key: 0,
      "aria-hidden": "true"
    }, e), {
      default: k(() => [B(i.$slots, "default")]),
      _: 3
    }, 16)) : K("v-if", !0);
  }
}), ec = Qu, tc = /* @__PURE__ */ D({
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
    const e = n, t = Ke(), i = sn(), r = Fr(), { forwardRef: o, currentElement: s } = X(), a = P(() => ({
      value: r.value,
      disabled: r.disabled.value,
      textContent: s.value?.textContent ?? r.value?.toString() ?? ""
    }));
    return ee(() => {
      s.value && (r.onItemTextChange(s.value), i.itemTextRefCallback(s.value, r.value, r.disabled.value), t.onOptionAdd(a.value));
    }), _e(() => {
      t.onOptionRemove(a.value);
    }), (l, u) => (x(), I(f(J), j({
      id: f(r).textId,
      ref: f(o)
    }, {
      ...e,
      ...l.$attrs
    }), {
      default: k(() => [B(l.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), nc = tc, ic = /* @__PURE__ */ D({
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
    return (t, i) => (x(), I(f(yr), Dn(Mn(e)), {
      default: k(() => [B(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), rc = ic, oc = /* @__PURE__ */ D({
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
    const e = n, t = Ke(), { forwardRef: i, currentElement: r } = X(), o = P(() => t.disabled?.value || e.disabled);
    t.contentId ||= wt(void 0, "reka-select-content"), ee(() => {
      t.onTriggerChange(r.value);
    });
    const { getItems: s } = Ue(), { search: a, handleTypeaheadSearch: l, resetTypeahead: u } = Hn();
    function c() {
      o.value || (t.onOpenChange(!0), u());
    }
    function d(p) {
      c(), t.triggerPointerDownPosRef.value = {
        x: Math.round(p.pageX),
        y: Math.round(p.pageY)
      };
    }
    return (p, h) => (x(), I(f(Aa), {
      "as-child": "",
      reference: p.reference
    }, {
      default: k(() => [L(f(J), {
        ref: f(i),
        role: "combobox",
        type: p.as === "button" ? "button" : void 0,
        "aria-controls": f(t).contentId,
        "aria-expanded": f(t).open.value || !1,
        "aria-required": f(t).required?.value,
        "aria-autocomplete": "none",
        disabled: o.value,
        dir: f(t)?.dir.value,
        "data-state": f(t)?.open.value ? "open" : "closed",
        "data-disabled": o.value ? "" : void 0,
        "data-placeholder": f(Pu)(f(t).modelValue?.value) ? "" : void 0,
        "as-child": p.asChild,
        as: p.as,
        onClick: h[0] || (h[0] = (v) => {
          v?.currentTarget?.focus();
        }),
        onPointerdown: h[1] || (h[1] = (v) => {
          if (v.pointerType === "touch") return v.preventDefault();
          const y = v.target;
          y.hasPointerCapture(v.pointerId) && y.releasePointerCapture(v.pointerId), v.button === 0 && v.ctrlKey === !1 && (d(v), v.preventDefault());
        }),
        onPointerup: h[2] || (h[2] = He((v) => {
          v.pointerType === "touch" && d(v);
        }, ["prevent"])),
        onKeydown: h[3] || (h[3] = (v) => {
          const y = f(a) !== "";
          !(v.ctrlKey || v.altKey || v.metaKey) && v.key.length === 1 && y && v.key === " " || (f(l)(v.key, f(s)()), f(ku).includes(v.key) && (c(), v.preventDefault()));
        })
      }, {
        default: k(() => [B(p.$slots, "default")]),
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
}), sc = oc, ac = /* @__PURE__ */ D({
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
    const e = n, { forwardRef: t, currentElement: i } = X(), r = Ke();
    ee(() => {
      r.valueElement = i;
    });
    const o = P(() => {
      let a = [];
      const l = Array.from(r.optionsSet.value), u = (c) => l.find((d) => Ct(c, d.value, r.by));
      return Array.isArray(r.modelValue.value) ? a = r.modelValue.value.map((c) => u(c)?.textContent ?? "") : a = [u(r.modelValue.value)?.textContent ?? ""], a.filter(Boolean);
    }), s = P(() => o.value.length ? o.value.join(", ") : e.placeholder);
    return (a, l) => (x(), I(f(J), {
      ref: f(t),
      as: a.as,
      "as-child": a.asChild,
      style: { pointerEvents: "none" },
      "data-placeholder": o.value.length ? void 0 : e.placeholder
    }, {
      default: k(() => [B(a.$slots, "default", {
        selectedLabel: o.value,
        modelValue: f(r).modelValue.value
      }, () => [ue(G(s.value), 1)])]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-placeholder"
    ]));
  }
}), lc = ac, uc = /* @__PURE__ */ D({
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
    const e = n, { nonce: t } = qe(e), i = Lr(t), r = sn(), o = r.position === "item-aligned" ? Fu() : void 0, { forwardRef: s, currentElement: a } = X();
    ee(() => {
      r?.onViewportChange(a.value);
    });
    const l = T(0);
    function u(c) {
      const d = c.currentTarget, { shouldExpandOnScrollRef: p, contentWrapper: h } = o ?? {};
      if (p?.value && h?.value) {
        const v = Math.abs(l.value - d.scrollTop);
        if (v > 0) {
          const y = window.innerHeight - be * 2, g = Number.parseFloat(h.value.style.minHeight), b = Number.parseFloat(h.value.style.height), m = Math.max(g, b);
          if (m < y) {
            const S = m + v, w = Math.min(y, S), _ = S - w;
            h.value.style.height = `${w}px`, h.value.style.bottom === "0px" && (d.scrollTop = _ > 0 ? _ : 0, h.value.style.justifyContent = "flex-end");
          }
        }
      }
      l.value = d.scrollTop;
    }
    return (c, d) => (x(), N(pe, null, [L(f(J), j({
      ref: f(s),
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
      default: k(() => [B(c.$slots, "default")]),
      _: 3
    }, 16), L(f(J), {
      as: "style",
      nonce: f(i)
    }, {
      default: k(() => d[0] || (d[0] = [ue(" /* Hide scrollbars cross-browser and enable momentum scroll for touch devices */ [data-reka-select-viewport] { scrollbar-width:none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch; } [data-reka-select-viewport]::-webkit-scrollbar { display: none; } ")])),
      _: 1,
      __: [0]
    }, 8, ["nonce"])], 64));
  }
}), cc = uc;
const dc = /* @__PURE__ */ D({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (x(), N("span", {
      class: "speaker-indicator",
      style: Ie({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), zr = /* @__PURE__ */ de(dc, [["__scopeId", "data-v-9bffeda8"]]), fc = { class: "speaker-label" }, pc = {
  key: 1,
  class: "speaker-name"
}, hc = ["datetime"], vc = /* @__PURE__ */ D({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    language: {}
  },
  setup(n) {
    const e = n, { t, locale: i } = Re(), r = P(
      () => $n(e.language, i.value, t("language.wildcard"))
    ), o = P(
      () => e.startTime != null ? Nt(e.startTime) : null
    ), s = P(
      () => e.startTime != null ? `PT${e.startTime.toFixed(1)}S` : void 0
    ), a = P(() => e.speaker?.color ?? "transparent");
    return (l, u) => (x(), N("div", fc, [
      n.speaker ? (x(), I(zr, {
        key: 0,
        color: a.value
      }, null, 8, ["color"])) : K("", !0),
      n.speaker ? (x(), N("span", pc, G(n.speaker.name), 1)) : K("", !0),
      o.value ? (x(), N("time", {
        key: 2,
        class: "timestamp",
        datetime: s.value
      }, G(o.value), 9, hc)) : K("", !0),
      L(_n, null, {
        default: k(() => [
          ue(G(r.value), 1)
        ]),
        _: 1
      })
    ]));
  }
}), mc = /* @__PURE__ */ de(vc, [["__scopeId", "data-v-0fb7fa1e"]]), gc = ["data-turn-active"], yc = { class: "turn-text" }, bc = ["data-word-active"], wc = /* @__PURE__ */ D({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean }
  },
  setup(n) {
    const e = n, t = tt(), i = P(() => e.turn.words.length > 0), r = P(() => {
      if (!t.audio?.src.value || !i.value) return null;
      const a = t.audio.currentTime.value, { startTime: l, endTime: u, words: c } = e.turn;
      return l == null || u == null || a < l || a > u ? null : Po(c, a);
    }), o = P(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Gi(e.turn.words)) return !1;
      const a = t.audio.currentTime.value;
      return a >= e.turn.startTime && a <= e.turn.endTime;
    }), s = P(() => e.speaker?.color ?? "transparent");
    return (a, l) => (x(), N("section", {
      class: zt(["turn", { "turn--active": o.value, "turn--partial": n.partial }]),
      "data-turn-active": o.value || n.partial || n.live || void 0,
      style: Ie({ "--speaker-color": s.value })
    }, [
      n.partial ? K("", !0) : (x(), I(mc, {
        key: 0,
        speaker: n.speaker,
        "start-time": n.turn.startTime,
        language: n.turn.language
      }, null, 8, ["speaker", "start-time", "language"])),
      z("p", yc, [
        i.value ? (x(!0), N(pe, { key: 0 }, et(n.turn.words, (u, c) => (x(), N(pe, {
          key: u.id
        }, [
          z("span", {
            class: zt({ "word--active": u.id === r.value }),
            "data-word-active": u.id === r.value || void 0
          }, G(u.text), 11, bc),
          ue(G(c < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (x(), N(pe, { key: 1 }, [
          ue(G(n.turn.text), 1)
        ], 64)) : K("", !0)
      ])
    ], 14, gc));
  }
}), Ri = /* @__PURE__ */ de(wc, [["__scopeId", "data-v-bf56e6fe"]]);
function Sc({
  panelRef: n,
  isPrepending: e
}) {
  const t = T(!0), i = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let r = null;
  function o() {
    if (!t.value || e?.value || !r) return;
    const c = r.querySelector("[data-word-active]") ?? r.querySelector("[data-turn-active]");
    if (!c) return;
    const d = c.getBoundingClientRect(), p = r.getBoundingClientRect(), h = r.scrollTop + (d.top - p.top) - r.clientHeight / 2 + d.height / 2;
    r.scrollTo({
      top: h,
      behavior: i.matches ? "auto" : "smooth"
    });
  }
  const s = Yi(o);
  function a() {
    r && (t.value = r.scrollHeight - r.scrollTop < r.clientHeight + 150);
  }
  function l() {
    t.value = !0, o();
  }
  let u;
  return ee(() => {
    r = n.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, r && (r.scrollTop = r.scrollHeight, r.addEventListener("scroll", a, { passive: !0 }), u = new MutationObserver(s), u.observe(r, {
      subtree: !0,
      attributes: !0,
      attributeFilter: ["data-word-active", "data-turn-active"],
      childList: !0,
      characterData: !0
    }));
  }), xt(() => {
    r && (r.removeEventListener("scroll", a), r = null), u?.disconnect();
  }), {
    isFollowing: Wi(t),
    resumeFollow: l
  };
}
const _c = {
  ref: "panel",
  class: "transcription-panel"
}, Cc = { class: "turns-container" }, Ec = {
  key: 0,
  class: "history-loading",
  role: "status"
}, xc = {
  key: 1,
  class: "history-start"
}, kc = /* @__PURE__ */ D({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = Re(), i = tt(), r = gt("panel"), o = P(() => {
      const m = i.live?.partial.value ?? null;
      return m === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: m,
        words: [],
        language: i.activeChannel.value.activeTranslation.value.languages[0] ?? "",
        startTime: void 0,
        endTime: void 0
      };
    }), s = P(() => i.live?.hasLiveUpdate.value ?? !1), a = P(() => i.audio?.isPlaying.value ?? !1), l = P(() => i.activeChannel.value.activeTranslation.value), u = P(() => l.value.isLoadingHistory.value), c = P(() => l.value.hasMoreHistory.value), d = T(!1);
    let p = null;
    const h = Yi(() => {
      const m = l.value;
      m.hasMoreHistory.value && (m.isLoadingHistory.value || e.turns.length !== 0 && i.emit("scroll:top", { translationId: m.id }));
    }, 500);
    function v() {
      p && p.scrollTop < 100 && h();
    }
    let y;
    ee(() => {
      p = r.value?.querySelector("[data-reka-scroll-area-viewport]") ?? null, p && p.addEventListener("scroll", v, { passive: !0 }), y = i.on("turns:prepend", () => {
        if (!p) return;
        const m = p.scrollHeight;
        d.value = !0, re(() => {
          if (!p) return;
          const S = p.scrollHeight - m;
          p.scrollTop += S, d.value = !1;
        });
      });
    }), xt(() => {
      p && (p.removeEventListener("scroll", v), p = null), y?.();
    });
    const { isFollowing: g, resumeFollow: b } = Sc({ panelRef: r, isPrepending: d });
    return (m, S) => (x(), N("article", _c, [
      L(f(nu), { class: "scroll-root" }, {
        default: k(() => [
          L(f(xu), { class: "scroll-viewport" }, {
            default: k(() => [
              z("div", Cc, [
                u.value ? (x(), N("div", Ec, [...S[0] || (S[0] = [
                  z("progress", null, null, -1)
                ])])) : K("", !0),
                !c.value && n.turns.length > 0 ? (x(), N("div", xc, G(f(t)("transcription.historyStart")), 1)) : K("", !0),
                (x(!0), N(pe, null, et(n.turns, (w, _) => (x(), I(Ri, {
                  key: w.id,
                  turn: w,
                  speaker: w.speakerId ? n.speakers.get(w.speakerId) : void 0,
                  live: s.value && !o.value && _ === n.turns.length - 1
                }, null, 8, ["turn", "speaker", "live"]))), 128)),
                o.value ? (x(), I(Ri, {
                  key: "__partial__",
                  turn: o.value,
                  partial: ""
                }, null, 8, ["turn"])) : K("", !0)
              ])
            ]),
            _: 1
          }),
          L(f(yu), {
            class: "scrollbar",
            orientation: "vertical"
          }, {
            default: k(() => [
              L(f(Cu), { class: "scrollbar-thumb" })
            ]),
            _: 1
          }),
          L(ao, { name: "fade-slide" }, {
            default: k(() => [
              !f(g) && (a.value || s.value) ? (x(), I(ke, {
                key: 0,
                size: "sm",
                class: "resume-scroll-btn",
                "aria-label": f(t)("transcription.resumeScroll"),
                onClick: f(b)
              }, {
                icon: k(() => [
                  L(f(Do), { size: 14 })
                ]),
                default: k(() => [
                  ue(" " + G(f(t)("transcription.resumeScroll")), 1)
                ]),
                _: 1
              }, 8, ["aria-label", "onClick"])) : K("", !0)
            ]),
            _: 1
          })
        ]),
        _: 1
      })
    ], 512));
  }
}), Tc = /* @__PURE__ */ de(kc, [["__scopeId", "data-v-98845391"]]), Pc = { class: "switch" }, Ac = ["id", "checked"], Oc = ["for"], Ic = /* @__PURE__ */ D({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, r = t.id ?? lo();
    return (o, s) => (x(), N("div", Pc, [
      z("input", {
        type: "checkbox",
        id: f(r),
        checked: n.modelValue,
        onChange: s[0] || (s[0] = (a) => i("update:modelValue", a.target.checked))
      }, null, 40, Ac),
      z("label", { for: f(r) }, [...s[1] || (s[1] = [
        z("div", { class: "switch-slider" }, null, -1)
      ])], 8, Oc)
    ]));
  }
}), Rc = /* @__PURE__ */ de(Ic, [["__scopeId", "data-v-64fc0914"]]), Lc = "(max-width: 767px)";
function Nr() {
  const n = T(!1);
  let e = null;
  function t(i) {
    n.value = i.matches;
  }
  return ee(() => {
    e = window.matchMedia(Lc), n.value = e.matches, e.addEventListener("change", t);
  }), xt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const Dc = { class: "sidebar-select" }, Mc = /* @__PURE__ */ D({
  __name: "SidebarSelectDropdown",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e;
    return (i, r) => (x(), N("div", Dc, [
      L(f(Iu), {
        "model-value": n.selectedValue,
        "onUpdate:modelValue": r[0] || (r[0] = (o) => t("update:selectedValue", o))
      }, {
        default: k(() => [
          L(f(sc), {
            class: "sidebar-select-trigger",
            "aria-label": n.ariaLabel
          }, {
            default: k(() => [
              L(f(lc), { class: "sidebar-select-trigger-label" }),
              L(f(Yu), null, {
                default: k(() => [
                  L(f(Mo), { size: 16 })
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["aria-label"]),
          L(f(rc), { disabled: "" }, {
            default: k(() => [
              L(f(Ku), {
                class: "sidebar-select-content",
                position: "popper",
                "side-offset": 4,
                "position-strategy": "absolute"
              }, {
                default: k(() => [
                  L(f(cc), null, {
                    default: k(() => [
                      (x(!0), N(pe, null, et(n.items, (o) => (x(), I(f(Ju), {
                        key: o.value,
                        value: o.value,
                        class: "sidebar-select-item"
                      }, {
                        default: k(() => [
                          L(f(ec), { class: "sidebar-select-item-indicator" }, {
                            default: k(() => [
                              L(f(Ji), { size: 14 })
                            ]),
                            _: 1
                          }),
                          L(f(nc), null, {
                            default: k(() => [
                              ue(G(o.label), 1)
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
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["model-value"])
    ]));
  }
}), $c = { class: "sidebar-select" }, Bc = ["aria-label"], qc = { class: "sidebar-select-trigger-label" }, Fc = 7, zc = /* @__PURE__ */ D({
  __name: "SidebarSelectSheet",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: r } = Re(), o = T(!1), s = P(
      () => t.items.find((l) => l.value === t.selectedValue)?.label ?? ""
    );
    function a(l) {
      i("update:selectedValue", l), o.value = !1;
    }
    return (l, u) => (x(), N("div", $c, [
      z("button", {
        class: "sidebar-select-trigger",
        "aria-label": n.ariaLabel,
        onClick: u[0] || (u[0] = (c) => o.value = !0)
      }, [
        z("span", qc, G(s.value), 1)
      ], 8, Bc),
      L(f(cr), {
        open: o.value,
        "onUpdate:open": u[2] || (u[2] = (c) => o.value = c)
      }, {
        default: k(() => [
          L(f(br), { disabled: "" }, {
            default: k(() => [
              L(f(gr), { class: "editor-overlay" }),
              L(f(mr), {
                class: "sheet-content",
                "aria-describedby": ""
              }, {
                default: k(() => [
                  L(f(wr), { class: "sr-only" }, {
                    default: k(() => [
                      ue(G(n.ariaLabel), 1)
                    ]),
                    _: 1
                  }),
                  u[3] || (u[3] = z("div", { class: "sheet-handle" }, null, -1)),
                  L(f(Hl), {
                    "model-value": n.selectedValue,
                    "onUpdate:modelValue": u[1] || (u[1] = (c) => a(c))
                  }, {
                    default: k(() => [
                      n.items.length > Fc ? (x(), I(f(Ul), {
                        key: 0,
                        class: "sheet-filter",
                        placeholder: f(r)("select.filter")
                      }, null, 8, ["placeholder"])) : K("", !0),
                      L(f(Vl), { class: "sheet-list" }, {
                        default: k(() => [
                          (x(!0), N(pe, null, et(n.items, (c) => (x(), I(f(Zl), {
                            key: c.value,
                            value: c.value,
                            class: "sheet-item"
                          }, {
                            default: k(() => [
                              L(f(Ql), { class: "sheet-item-indicator" }, {
                                default: k(() => [
                                  L(f(Ji), { size: 16 })
                                ]),
                                _: 1
                              }),
                              z("span", null, G(c.label), 1)
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
}), Qn = /* @__PURE__ */ D({
  __name: "SidebarSelect",
  props: {
    items: {},
    selectedValue: {},
    ariaLabel: {}
  },
  emits: ["update:selectedValue"],
  setup(n, { emit: e }) {
    const t = e, { isMobile: i } = Nr();
    return (r, o) => f(i) ? (x(), I(zc, j({ key: 0 }, r.$props, {
      "onUpdate:selectedValue": o[0] || (o[0] = (s) => t("update:selectedValue", s))
    }), null, 16)) : (x(), I(Mc, j({ key: 1 }, r.$props, {
      "onUpdate:selectedValue": o[1] || (o[1] = (s) => t("update:selectedValue", s))
    }), null, 16));
  }
}), Hr = /* @__PURE__ */ D({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, i = e, { t: r } = Re(), o = P(
      () => t.channels.map((s) => ({ value: s.id, label: s.name }))
    );
    return (s, a) => (x(), I(Qn, {
      items: o.value,
      "selected-value": n.selectedChannelId,
      ariaLabel: f(r)("header.channelLabel"),
      "onUpdate:selectedValue": a[0] || (a[0] = (l) => i("update:selectedChannelId", l))
    }, null, 8, ["items", "selected-value", "ariaLabel"]));
  }
}), Nc = { class: "speaker-sidebar" }, Hc = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Wc = { class: "sidebar-title" }, Vc = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, jc = { class: "sidebar-title" }, Uc = { class: "sidebar-section" }, Kc = { class: "sidebar-title" }, Xc = { class: "speaker-list" }, Yc = { class: "speaker-name" }, Gc = {
  key: 2,
  class: "sidebar-section"
}, Zc = { class: "sidebar-title" }, Jc = { class: "subtitle-toggle" }, Qc = { class: "subtitle-toggle-label" }, ed = { class: "subtitle-slider" }, td = { class: "subtitle-slider-label" }, nd = { class: "subtitle-slider-value" }, id = ["value", "disabled"], rd = /* @__PURE__ */ D({
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
    const e = n, t = tt(), { t: i, locale: r } = Re(), o = P(
      () => Xi(e.translations, r.value, i("sidebar.originalLanguage"), i("language.wildcard"))
    );
    return (s, a) => (x(), N("aside", Nc, [
      n.channels.length > 1 ? (x(), N("section", Hc, [
        z("h2", Wc, G(f(i)("sidebar.channel")), 1),
        L(Hr, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": a[0] || (a[0] = (l) => s.$emit("update:selectedChannelId", l))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : K("", !0),
      n.translations.length > 1 ? (x(), N("section", Vc, [
        z("h2", jc, G(f(i)("sidebar.translation")), 1),
        L(Qn, {
          items: o.value,
          "selected-value": n.selectedTranslationId,
          ariaLabel: f(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": a[1] || (a[1] = (l) => s.$emit("update:selectedTranslationId", l))
        }, null, 8, ["items", "selected-value", "ariaLabel"])
      ])) : K("", !0),
      z("section", Uc, [
        z("h2", Kc, G(f(i)("sidebar.speakers")), 1),
        z("ul", Xc, [
          (x(!0), N(pe, null, et(n.speakers, (l) => (x(), N("li", {
            key: l.id,
            class: "speaker-item"
          }, [
            L(zr, {
              color: l.color
            }, null, 8, ["color"]),
            z("span", Yc, G(l.name), 1)
          ]))), 128))
        ])
      ]),
      f(t).subtitle ? (x(), N("section", Gc, [
        z("h2", Zc, G(f(i)("sidebar.subtitle")), 1),
        z("div", Jc, [
          z("span", Qc, G(f(i)("subtitle.show")), 1),
          L(Rc, {
            modelValue: f(t).subtitle.isVisible.value,
            "onUpdate:modelValue": a[2] || (a[2] = (l) => f(t).subtitle.isVisible.value = l)
          }, null, 8, ["modelValue"])
        ]),
        z("label", ed, [
          z("span", td, [
            ue(G(f(i)("subtitle.fontSize")) + " ", 1),
            z("span", nd, G(f(t).subtitle.fontSize.value) + "px", 1)
          ]),
          z("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: f(t).subtitle.fontSize.value,
            disabled: !f(t).subtitle.isVisible.value,
            onInput: a[3] || (a[3] = (l) => f(t).subtitle.fontSize.value = Number(l.target.value))
          }, null, 40, id)
        ])
      ])) : K("", !0)
    ]));
  }
}), Li = /* @__PURE__ */ de(rd, [["__scopeId", "data-v-408a215b"]]), od = /* @__PURE__ */ D({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = uo(n, "open"), { t } = Re();
    return (i, r) => (x(), I(f(cr), {
      open: e.value,
      "onUpdate:open": r[0] || (r[0] = (o) => e.value = o)
    }, {
      default: k(() => [
        L(f(br), { disabled: "" }, {
          default: k(() => [
            L(f(gr), { class: "editor-overlay" }),
            L(f(mr), { class: "sidebar-drawer" }, {
              default: k(() => [
                L(f(wr), { class: "sr-only" }, {
                  default: k(() => [
                    ue(G(f(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                L(f(Ws), {
                  class: "sidebar-close",
                  "aria-label": f(t)("header.closeSidebar")
                }, {
                  default: k(() => [
                    L(f(Qi), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                B(i.$slots, "default")
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
}), sd = { class: "player-controls" }, ad = { class: "controls-left" }, ld = { class: "controls-time" }, ud = { class: "time-display" }, cd = { class: "time-display" }, dd = { class: "controls-right" }, fd = ["value", "aria-label", "disabled"], pd = /* @__PURE__ */ D({
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
    const t = e, { t: i } = Re(), r = T(!1);
    function o(s) {
      const a = s.target;
      t("update:volume", parseFloat(a.value));
    }
    return (s, a) => (x(), N("div", sd, [
      z("div", ad, [
        L(ke, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": f(i)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (l) => t("skipBack"))
        }, {
          icon: k(() => [
            L(f(Fo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        L(ke, {
          variant: "ghost",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? f(i)("player.pause") : f(i)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (l) => t("togglePlay"))
        }, {
          icon: k(() => [
            n.isPlaying ? (x(), I(f($o), {
              key: 0,
              size: 20
            })) : (x(), I(f(Bo), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        L(ke, {
          variant: "ghost",
          size: "md",
          class: "skip-button",
          "aria-label": f(i)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (l) => t("skipForward"))
        }, {
          icon: k(() => [
            L(f(zo), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      z("div", ld, [
        z("time", ud, G(n.currentTime), 1),
        a[7] || (a[7] = z("span", { class: "time-separator" }, "/", -1)),
        z("time", cd, G(n.duration), 1)
      ]),
      z("div", dd, [
        z("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (l) => r.value = !0),
          onMouseleave: a[5] || (a[5] = (l) => r.value = !1)
        }, [
          L(ke, {
            variant: "ghost",
            size: "md",
            "aria-label": n.isMuted ? f(i)("player.unmute") : f(i)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (l) => t("toggleMute"))
          }, {
            icon: k(() => [
              n.isMuted ? (x(), I(f(Wo), {
                key: 0,
                size: 16
              })) : (x(), I(f(Ho), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          co(z("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": f(i)("player.volume"),
            disabled: !n.isReady,
            onInput: o
          }, null, 40, fd), [
            [fo, r.value]
          ])
        ], 32),
        L(ke, {
          variant: "ghost",
          size: "md",
          class: "speed-button",
          "aria-label": f(i)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (l) => t("cyclePlaybackRate"))
        }, {
          default: k(() => [
            ue(G(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), hd = /* @__PURE__ */ de(pd, [["__scopeId", "data-v-02ebaa64"]]);
function le(n, e, t, i) {
  return new (t || (t = Promise))((function(r, o) {
    function s(u) {
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
      u.done ? r(u.value) : (c = u.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(s, a);
    }
    l((i = i.apply(n, e || [])).next());
  }));
}
let Pt = class {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...o) => {
        this.un(e, r), t(...o);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
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
const Mt = { decode: function(n, e) {
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
    const r = i[0];
    if (r.some(((o) => o > 1 || o < -1))) {
      const o = r.length;
      let s = 0;
      for (let a = 0; a < o; a++) {
        const l = Math.abs(r[a]);
        l > s && (s = l);
      }
      for (const a of i) for (let l = 0; l < o; l++) a[l] /= s;
    }
  })(n);
  const t = n.map(((i) => i instanceof Float32Array ? i : Float32Array.from(i)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (i) => {
    const r = t[i];
    if (!r) throw new Error(`Channel ${i} not found`);
    return r;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function Wr(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [o, s] of Object.entries(r)) s instanceof Node ? t.appendChild(s) : typeof s == "string" ? t.appendChild(document.createTextNode(s)) : t.appendChild(Wr(o, s));
  else i === "style" ? Object.assign(t.style, r) : i === "textContent" ? t.textContent = r : t.setAttribute(i, r.toString());
  return t;
}
function Di(n, e, t) {
  const i = Wr(n, e || {});
  return t?.appendChild(i), i;
}
var vd = Object.freeze({ __proto__: null, createElement: Di, default: Di });
const md = { fetchBlob: function(n, e, t) {
  return le(this, void 0, void 0, (function* () {
    const i = yield fetch(n, t);
    if (i.status >= 400) throw new Error(`Failed to fetch ${n}: ${i.status} (${i.statusText})`);
    return (function(r, o) {
      le(this, void 0, void 0, (function* () {
        if (!r.body || !r.headers) return;
        const s = r.body.getReader(), a = Number(r.headers.get("Content-Length")) || 0;
        let l = 0;
        const u = (c) => {
          l += c?.length || 0;
          const d = Math.round(l / a * 100);
          o(d);
        };
        try {
          for (; ; ) {
            const c = yield s.read();
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
    Object.is(e, i) || (e = i, t.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Ze(n, e) {
  const t = ie(n());
  return e.forEach(((i) => i.subscribe((() => {
    const r = n();
    Object.is(t.value, r) || t.set(r);
  })))), { get value() {
    return t.value;
  }, subscribe: (i) => t.subscribe(i) };
}
function Ne(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, r = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), r.forEach(((o) => o()));
  };
}
class gd extends Pt {
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
    const r = t instanceof Blob && (this.canPlayType(t.type) || !e) ? URL.createObjectURL(t) : e;
    if (i && this.media.removeAttribute("src"), r || e) try {
      this.media.src = r;
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
function yd({ maxTop: n, maxBottom: e, halfHeight: t, vScale: i, barMinHeight: r = 0, barAlign: o }) {
  let s = Math.round(n * t * i), a = s + Math.round(e * t * i) || 1;
  return a < r && (a = r, o || (s = a / 2)), { topHeight: s, totalHeight: a };
}
function bd({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: i, canvasHeight: r }) {
  return n === "top" ? 0 : n === "bottom" ? r - i : e - t;
}
function Mi(n, e, t) {
  const i = e - n.left, r = t - n.top;
  return [i / n.width, r / n.height];
}
function Vr(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function $i(n, e) {
  if (!Vr(e)) return n;
  const t = e.barWidth || 0.5, i = t + (e.barGap || t / 2);
  return i === 0 ? n : Math.floor(n / i) * i;
}
function Bi({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const i = n / e, r = Math.floor(i * t);
  return [r - 1, r, r + 1];
}
function jr(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function wd(n) {
  const e = ie({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ze((() => (function(o) {
    const { scrollLeft: s, scrollWidth: a, clientWidth: l } = o;
    if (a === 0) return { startX: 0, endX: 1 };
    const u = s / a, c = (s + l) / a;
    return { startX: Math.max(0, Math.min(1, u)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), i = Ze((() => (function(o) {
    return { left: o.scrollLeft, right: o.scrollLeft + o.clientWidth };
  })(e.value)), [e]), r = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", r, { passive: !0 }), { scrollData: e, percentages: t, bounds: i, cleanup: () => {
    n.removeEventListener("scroll", r), jr(e);
  } };
}
class Sd extends Pt {
  constructor(e, t) {
    super(), this.timeouts = [], this.isScrollable = !1, this.audioData = null, this.resizeObserver = null, this.lastContainerWidth = 0, this.isDragging = !1, this.subscriptions = [], this.unsubscribeOnScroll = [], this.dragStream = null, this.scrollStream = null, this.subscriptions = [], this.options = e;
    const i = this.parentFromOptionsContainer(e.container);
    this.parent = i;
    const [r, o] = this.initHtml();
    i.appendChild(r), this.container = r, this.scrollContainer = o.querySelector(".scroll"), this.wrapper = o.querySelector(".wrapper"), this.canvasWrapper = o.querySelector(".canvases"), this.progressWrapper = o.querySelector(".progress"), this.cursor = o.querySelector(".cursor"), t && o.appendChild(t), this.initEvents();
  }
  parentFromOptionsContainer(e) {
    let t;
    if (typeof e == "string" ? t = document.querySelector(e) : e instanceof HTMLElement && (t = e), !t) throw new Error("Container not found");
    return t;
  }
  initEvents() {
    this.wrapper.addEventListener("click", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [r, o] = Mi(i, t.clientX, t.clientY);
      this.emit("click", r, o);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const i = this.wrapper.getBoundingClientRect(), [r, o] = Mi(i, t.clientX, t.clientY);
      this.emit("dblclick", r, o);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = wd(this.scrollContainer);
    const e = Ne((() => {
      const { startX: t, endX: i } = this.scrollStream.percentages.value, { left: r, right: o } = this.scrollStream.bounds.value;
      this.emit("scroll", t, i, r, o);
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
      const { threshold: r = 3, mouseButton: o = 0, touchDelay: s = 100 } = i, a = ie(null), l = /* @__PURE__ */ new Map(), u = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (p) => {
        if (p.button !== o || (l.set(p.pointerId, p), l.size > 1)) return;
        let h = p.clientX, v = p.clientY, y = !1;
        const g = Date.now(), b = t.getBoundingClientRect(), { left: m, top: S } = b, w = (O) => {
          if (O.defaultPrevented || l.size > 1 || u && Date.now() - g < s) return;
          const M = O.clientX, U = O.clientY, H = M - h, q = U - v;
          (y || Math.abs(H) > r || Math.abs(q) > r) && (O.preventDefault(), O.stopPropagation(), y || (a.set({ type: "start", x: h - m, y: v - S }), y = !0), a.set({ type: "move", x: M - m, y: U - S, deltaX: H, deltaY: q }), h = M, v = U);
        }, _ = (O) => {
          if (l.delete(O.pointerId), y) {
            const M = O.clientX, U = O.clientY;
            a.set({ type: "end", x: M - m, y: U - S });
          }
          c();
        }, E = (O) => {
          l.delete(O.pointerId), O.relatedTarget && O.relatedTarget !== document.documentElement || _(O);
        }, C = (O) => {
          y && (O.stopPropagation(), O.preventDefault());
        }, A = (O) => {
          O.defaultPrevented || l.size > 1 || y && O.preventDefault();
        };
        document.addEventListener("pointermove", w), document.addEventListener("pointerup", _), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", A, { passive: !1 }), document.addEventListener("click", C, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", w), document.removeEventListener("pointerup", _), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", A), setTimeout((() => {
            document.removeEventListener("click", C, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), l.clear(), jr(a);
      } };
    })(this.wrapper);
    const e = Ne((() => {
      const t = this.dragStream.signal.value;
      if (!t) return;
      const i = this.wrapper.getBoundingClientRect().width, r = (o = t.x / i) < 0 ? 0 : o > 1 ? 1 : o;
      var o;
      t.type === "start" ? (this.isDragging = !0, this.emit("dragstart", r)) : t.type === "move" ? this.emit("drag", r) : t.type === "end" && (this.isDragging = !1, this.emit("dragend", r));
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
    const r = () => {
      t && (clearTimeout(t), t = void 0), i && (i(), i = void 0);
    };
    return this.timeouts.push(r), () => new Promise(((o, s) => {
      r(), i = s, t = setTimeout((() => {
        t = void 0, i = void 0, o();
      }), e);
    }));
  }
  getHeight(e, t) {
    var i;
    const r = ((i = this.audioData) === null || i === void 0 ? void 0 : i.numberOfChannels) || 1;
    return (function({ optionsHeight: o, optionsSplitChannels: s, parentHeight: a, numberOfChannels: l, defaultHeight: u = 128 }) {
      if (o == null) return u;
      const c = Number(o);
      if (!isNaN(c)) return c;
      if (o === "auto") {
        const d = a || u;
        return s?.every(((p) => !p.overlay)) ? d / l : d;
      }
      return u;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: r, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(i, r, o) {
      if (!Array.isArray(i)) return i || "";
      if (i.length === 0) return "#999";
      if (i.length < 2) return i[0] || "";
      const s = document.createElement("canvas"), a = s.getContext("2d"), l = o ?? s.height * r, u = a.createLinearGradient(0, 0, 0, l || r), c = 1 / (i.length - 1);
      return i.forEach(((d, p) => {
        u.addColorStop(p * c, d);
      })), u;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, i, r) {
    const { width: o, height: s } = i.canvas, { halfHeight: a, barWidth: l, barRadius: u, barIndexScale: c, barSpacing: d, barMinHeight: p } = (function({ width: v, height: y, length: g, options: b, pixelRatio: m }) {
      const S = y / 2, w = b.barWidth ? b.barWidth * m : 1, _ = b.barGap ? b.barGap * m : b.barWidth ? w / 2 : 0, E = w + _ || 1;
      return { halfHeight: S, barWidth: w, barGap: _, barRadius: b.barRadius || 0, barMinHeight: b.barMinHeight ? b.barMinHeight * m : 0, barIndexScale: g > 0 ? v / E / g : 0, barSpacing: E };
    })({ width: o, height: s, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), h = (function({ channelData: v, barIndexScale: y, barSpacing: g, barWidth: b, halfHeight: m, vScale: S, canvasHeight: w, barAlign: _, barMinHeight: E }) {
      const C = v[0] || [], A = v[1] || C, O = C.length, M = [];
      let U = 0, H = 0, q = 0;
      for (let R = 0; R <= O; R++) {
        const V = Math.round(R * y);
        if (V > U) {
          const { topHeight: ne, totalHeight: ae } = yd({ maxTop: H, maxBottom: q, halfHeight: m, vScale: S, barMinHeight: E, barAlign: _ }), Ee = bd({ barAlign: _, halfHeight: m, topHeight: ne, totalHeight: ae, canvasHeight: w });
          M.push({ x: U * g, y: Ee, width: b, height: ae }), U = V, H = 0, q = 0;
        }
        const Y = Math.abs(C[R] || 0), te = Math.abs(A[R] || 0);
        Y > H && (H = Y), te > q && (q = te);
      }
      return M;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: l, halfHeight: a, vScale: r, canvasHeight: s, barAlign: t.barAlign, barMinHeight: p });
    i.beginPath();
    for (const v of h) u && "roundRect" in i ? i.roundRect(v.x, v.y, v.width, v.height, u) : i.rect(v.x, v.y, v.width, v.height);
    i.fill(), i.closePath();
  }
  renderLineWaveform(e, t, i, r) {
    const { width: o, height: s } = i.canvas, a = (function({ channelData: l, width: u, height: c, vScale: d }) {
      const p = c / 2, h = l[0] || [];
      return [h, l[1] || h].map(((v, y) => {
        const g = v.length, b = g ? u / g : 0, m = p, S = y === 0 ? -1 : 1, w = [{ x: 0, y: m }];
        let _ = 0, E = 0;
        for (let C = 0; C <= g; C++) {
          const A = Math.round(C * b);
          if (A > _) {
            const M = m + (Math.round(E * p * d) || 1) * S;
            w.push({ x: _, y: M }), _ = A, E = 0;
          }
          const O = Math.abs(v[C] || 0);
          O > E && (E = O);
        }
        return w.push({ x: _, y: m }), w;
      }));
    })({ channelData: e, width: o, height: s, vScale: r });
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
    const r = (function({ channelData: o, barHeight: s, normalize: a, maxPeak: l }) {
      var u;
      const c = s || 1;
      if (!a) return c;
      const d = o[0];
      if (!d || d.length === 0) return c;
      let p = l ?? 0;
      if (!l) for (let h = 0; h < d.length; h++) {
        const v = (u = d[h]) !== null && u !== void 0 ? u : 0, y = Math.abs(v);
        y > p && (p = y);
      }
      return p ? c / p : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    Vr(t) ? this.renderBarWaveform(e, t, i, r) : this.renderLineWaveform(e, t, i, r);
  }
  renderSingleCanvas(e, t, i, r, o, s, a) {
    const l = this.getPixelRatio(), u = document.createElement("canvas");
    u.width = Math.round(i * l), u.height = Math.round(r * l), u.style.width = `${i}px`, u.style.height = `${r}px`, u.style.left = `${Math.round(o)}px`, s.appendChild(u);
    const c = u.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), u.width > 0 && u.height > 0) {
      const d = u.cloneNode(), p = d.getContext("2d");
      p.drawImage(u, 0, 0), p.globalCompositeOperation = "source-in", p.fillStyle = this.convertColorValues(t.progressColor, p), p.fillRect(0, 0, u.width, u.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, i, r, o, s) {
    const a = this.getPixelRatio(), { clientWidth: l } = this.scrollContainer, u = i / a, c = (function({ clientWidth: v, totalWidth: y, options: g }) {
      return $i(Math.min(8e3, v, y), g);
    })({ clientWidth: l, totalWidth: u, options: t });
    let d = {};
    if (c === 0) return;
    const p = (v) => {
      if (v < 0 || v >= h || d[v]) return;
      d[v] = !0;
      const y = v * c;
      let g = Math.min(u - y, c);
      if (g = $i(g, t), g <= 0) return;
      const b = (function({ channelData: m, offset: S, clampedWidth: w, totalWidth: _ }) {
        return m.map(((E) => {
          const C = Math.floor(S / _ * E.length), A = Math.floor((S + w) / _ * E.length);
          return E.slice(C, A);
        }));
      })({ channelData: e, offset: y, clampedWidth: g, totalWidth: u });
      this.renderSingleCanvas(b, t, g, r, y, o, s);
    }, h = Math.ceil(u / c);
    if (!this.isScrollable) {
      for (let v = 0; v < h; v++) p(v);
      return;
    }
    if (Bi({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: u, numCanvases: h }).forEach(((v) => p(v))), h > 1) {
      const v = this.on("scroll", (() => {
        const { scrollLeft: y } = this.scrollContainer;
        Object.keys(d).length > 10 && (o.innerHTML = "", s.innerHTML = "", d = {}), Bi({ scrollLeft: y, totalWidth: u, numCanvases: h }).forEach(((g) => p(g)));
      }));
      this.unsubscribeOnScroll.push(v);
    }
  }
  renderChannel(e, t, i, r) {
    var { overlay: o } = t, s = (function(c, d) {
      var p = {};
      for (var h in c) Object.prototype.hasOwnProperty.call(c, h) && d.indexOf(h) < 0 && (p[h] = c[h]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var v = 0;
        for (h = Object.getOwnPropertySymbols(c); v < h.length; v++) d.indexOf(h[v]) < 0 && Object.prototype.propertyIsEnumerable.call(c, h[v]) && (p[h[v]] = c[h[v]]);
      }
      return p;
    })(t, ["overlay"]);
    const a = document.createElement("div"), l = this.getHeight(s.height, s.splitChannels);
    a.style.height = `${l}px`, o && r > 0 && (a.style.marginTop = `-${l}px`), this.canvasWrapper.style.minHeight = `${l}px`, this.canvasWrapper.appendChild(a);
    const u = a.cloneNode();
    this.progressWrapper.appendChild(u), this.renderMultiCanvas(e, s, i, l, a, u);
  }
  render(e) {
    return le(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((u) => u())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const i = this.getPixelRatio(), r = this.scrollContainer.clientWidth, { scrollWidth: o, isScrollable: s, useParentWidth: a, width: l } = (function({ duration: u, minPxPerSec: c = 0, parentWidth: d, fillParent: p, pixelRatio: h }) {
        const v = Math.ceil(u * c), y = v > d, g = !!(p && !y);
        return { scrollWidth: v, isScrollable: y, useParentWidth: g, width: (g ? d : v) * h };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: r, fillParent: this.options.fillParent, pixelRatio: i });
      if (this.isScrollable = s, this.wrapper.style.width = a ? "100%" : `${o}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let u = 0; u < e.numberOfChannels; u++) {
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
      const { right: i } = this.progressWrapper.getBoundingClientRect(), r = (function(o) {
        const s = 2 * o;
        return (s < 0 ? Math.floor(s) : Math.ceil(s)) / 2;
      })(i - t);
      this.scrollContainer.scrollLeft += r;
    }
  }
  zoom(e) {
    this.options.minPxPerSec = e, this.reRender();
  }
  scrollIntoView(e, t = !1) {
    const { scrollLeft: i, scrollWidth: r, clientWidth: o } = this.scrollContainer, s = e * r, a = i, l = i + o, u = o / 2;
    if (this.isDragging)
      s + 30 > l ? this.scrollContainer.scrollLeft += 30 : s - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (s < a || s > l) && (this.scrollContainer.scrollLeft = s - (this.options.autoCenter ? u : 0));
      const c = s - i - u;
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
      const r = this.canvasWrapper.querySelectorAll("canvas");
      if (!r.length) throw new Error("No waveform data");
      if (i === "dataURL") {
        const o = Array.from(r).map(((s) => s.toDataURL(e, t)));
        return Promise.resolve(o);
      }
      return Promise.all(Array.from(r).map(((o) => new Promise(((s, a) => {
        o.toBlob(((l) => {
          l ? s(l) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class _d extends Pt {
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
class yn extends Pt {
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
const Cd = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Et extends gd {
  static create(e) {
    return new Et(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new yn() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Cd, e);
    const { state: i, actions: r } = (function(a) {
      var l, u, c, d, p, h;
      const v = (l = a?.currentTime) !== null && l !== void 0 ? l : ie(0), y = (u = a?.duration) !== null && u !== void 0 ? u : ie(0), g = (c = a?.isPlaying) !== null && c !== void 0 ? c : ie(!1), b = (d = a?.isSeeking) !== null && d !== void 0 ? d : ie(!1), m = (p = a?.volume) !== null && p !== void 0 ? p : ie(1), S = (h = a?.playbackRate) !== null && h !== void 0 ? h : ie(1), w = ie(null), _ = ie(null), E = ie(""), C = ie(0), A = ie(0), O = Ze((() => !g.value), [g]), M = Ze((() => w.value !== null), [w]), U = Ze((() => M.value && y.value > 0), [M, y]), H = Ze((() => v.value), [v]), q = Ze((() => y.value > 0 ? v.value / y.value : 0), [v, y]);
      return { state: { currentTime: v, duration: y, isPlaying: g, isPaused: O, isSeeking: b, volume: m, playbackRate: S, audioBuffer: w, peaks: _, url: E, zoom: C, scrollPosition: A, canPlay: M, isReady: U, progress: H, progressPercent: q }, actions: { setCurrentTime: (R) => {
        const V = Math.max(0, Math.min(y.value || 1 / 0, R));
        v.set(V);
      }, setDuration: (R) => {
        y.set(Math.max(0, R));
      }, setPlaying: (R) => {
        g.set(R);
      }, setSeeking: (R) => {
        b.set(R);
      }, setVolume: (R) => {
        const V = Math.max(0, Math.min(1, R));
        m.set(V);
      }, setPlaybackRate: (R) => {
        const V = Math.max(0.1, Math.min(16, R));
        S.set(V);
      }, setAudioBuffer: (R) => {
        w.set(R), R && y.set(R.duration);
      }, setPeaks: (R) => {
        _.set(R);
      }, setUrl: (R) => {
        E.set(R);
      }, setZoom: (R) => {
        C.set(Math.max(0, R));
      }, setScrollPosition: (R) => {
        A.set(Math.max(0, R));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = i, this.wavesurferActions = r, this.timer = new _d();
    const o = t ? void 0 : this.getMediaElement();
    this.renderer = new Sd(this.options, o), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const s = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: l } = this.options;
      (s || a && l) && this.load(s, a, l).catch(((u) => {
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
      i.push(Ne((() => {
        const s = e.isPlaying.value;
        t.emit(s ? "play" : "pause");
      }), [e.isPlaying])), i.push(Ne((() => {
        const s = e.currentTime.value;
        t.emit("timeupdate", s), e.isPlaying.value && t.emit("audioprocess", s);
      }), [e.currentTime, e.isPlaying])), i.push(Ne((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let r = !1;
      i.push(Ne((() => {
        e.isReady.value && !r && (r = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let o = !1;
      return i.push(Ne((() => {
        const s = e.isPlaying.value, a = e.currentTime.value, l = e.duration.value, u = l > 0 && a >= l;
        o && !s && u && t.emit("finish"), o = s && u;
      }), [e.isPlaying, e.currentTime, e.duration])), i.push(Ne((() => {
        const s = e.zoom.value;
        s > 0 && t.emit("zoom", s);
      }), [e.zoom])), () => {
        i.forEach(((s) => s()));
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
    })), this.renderer.on("scroll", ((e, t, i, r) => {
      const o = this.getDuration();
      this.emit("scroll", e * o, t * o, i, r);
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
        var r;
        if (!this.options.interact) return;
        this.renderer.renderProgress(i), clearTimeout(e);
        let o = 0;
        const s = this.options.dragToSeek;
        this.isPlaying() ? o = 0 : s === !0 ? o = 200 : s && typeof s == "object" && (o = (r = s.debounceTime) !== null && r !== void 0 ? r : 200), e = setTimeout((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Mt.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Mt.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
  loadAudio(e, t, i, r) {
    return le(this, void 0, void 0, (function* () {
      var o;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (o = this.abortController) === null || o === void 0 || o.abort(), this.abortController = null, !t && !i) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const l = (c) => this.emit("loading", c);
        t = yield md.fetchBlob(e, l, a);
        const u = this.options.blobMimeType;
        u && (t = new Blob([t], { type: u }));
      }
      this.setSrc(e, t);
      const s = yield new Promise(((a) => {
        const l = r || this.getDuration();
        l ? a(l) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof yn && (a.duration = s);
      }
      if (i) this.decodedData = Mt.createBuffer(i, s || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Mt.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, i) {
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, i);
      } catch (r) {
        throw this.emit("error", r), r;
      }
    }));
  }
  loadBlob(e, t, i) {
    return le(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio("", e, t, i);
      } catch (r) {
        throw this.emit("error", r), r;
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
    const r = Math.min(e, this.decodedData.numberOfChannels), o = [];
    for (let s = 0; s < r; s++) {
      const a = this.decodedData.getChannelData(s), l = [], u = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * u), Math.ceil((c + 1) * u));
        let p = 0;
        for (let h = 0; h < d.length; h++) {
          const v = d[h];
          Math.abs(v) > Math.abs(p) && (p = v);
        }
        l.push(Math.round(p * i) / i);
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
      const r = yield i.play.call(this);
      return t != null && (this.media instanceof yn ? this.media.stopAt(t) : this.stopAtPosition = t), r;
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
Et.BasePlugin = class extends Pt {
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
}, Et.dom = vd;
class Ur {
  constructor() {
    this.listeners = {};
  }
  on(e, t, i) {
    if (this.listeners[e] || (this.listeners[e] = /* @__PURE__ */ new Set()), i?.once) {
      const r = (...o) => {
        this.un(e, r), t(...o);
      };
      return this.listeners[e].add(r), () => this.un(e, r);
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
class Ed extends Ur {
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
function Kr(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [i, r] of Object.entries(e)) if (i === "children" && r) for (const [o, s] of Object.entries(r)) s instanceof Node ? t.appendChild(s) : typeof s == "string" ? t.appendChild(document.createTextNode(s)) : t.appendChild(Kr(o, s));
  else i === "style" ? Object.assign(t.style, r) : i === "textContent" ? t.textContent = r : t.setAttribute(i, r.toString());
  return t;
}
function ht(n, e, t) {
  const i = Kr(n, e || {});
  return t?.appendChild(i), i;
}
function Xr(n) {
  let e = n;
  const t = /* @__PURE__ */ new Set();
  return { get value() {
    return e;
  }, set(i) {
    Object.is(e, i) || (e = i, t.forEach(((r) => r(e))));
  }, update(i) {
    this.set(i(e));
  }, subscribe: (i) => (t.add(i), () => t.delete(i)) };
}
function Bt(n, e) {
  let t;
  const i = () => {
    t && (t(), t = void 0), t = n();
  }, r = e.map(((o) => o.subscribe(i)));
  return i(), () => {
    t && (t(), t = void 0), r.forEach(((o) => o()));
  };
}
function st(n, e) {
  const t = Xr(null), i = (r) => {
    t.set(r);
  };
  return n.addEventListener(e, i), t._cleanup = () => {
    n.removeEventListener(e, i);
  }, t;
}
function Ge(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function qt(n, e = {}) {
  const { threshold: t = 3, mouseButton: i = 0, touchDelay: r = 100 } = e, o = Xr(null), s = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let l = () => {
  };
  const u = (c) => {
    if (c.button !== i || (s.set(c.pointerId, c), s.size > 1)) return;
    let d = c.clientX, p = c.clientY, h = !1;
    const v = Date.now(), y = n.getBoundingClientRect(), { left: g, top: b } = y, m = (C) => {
      if (C.defaultPrevented || s.size > 1 || a && Date.now() - v < r) return;
      const A = C.clientX, O = C.clientY, M = A - d, U = O - p;
      (h || Math.abs(M) > t || Math.abs(U) > t) && (C.preventDefault(), C.stopPropagation(), h || (o.set({ type: "start", x: d - g, y: p - b }), h = !0), o.set({ type: "move", x: A - g, y: O - b, deltaX: M, deltaY: U }), d = A, p = O);
    }, S = (C) => {
      if (s.delete(C.pointerId), h) {
        const A = C.clientX, O = C.clientY;
        o.set({ type: "end", x: A - g, y: O - b });
      }
      l();
    }, w = (C) => {
      s.delete(C.pointerId), C.relatedTarget && C.relatedTarget !== document.documentElement || S(C);
    }, _ = (C) => {
      h && (C.stopPropagation(), C.preventDefault());
    }, E = (C) => {
      C.defaultPrevented || s.size > 1 || h && C.preventDefault();
    };
    document.addEventListener("pointermove", m), document.addEventListener("pointerup", S), document.addEventListener("pointerout", w), document.addEventListener("pointercancel", w), document.addEventListener("touchmove", E, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), l = () => {
      document.removeEventListener("pointermove", m), document.removeEventListener("pointerup", S), document.removeEventListener("pointerout", w), document.removeEventListener("pointercancel", w), document.removeEventListener("touchmove", E), setTimeout((() => {
        document.removeEventListener("click", _, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", u), { signal: o, cleanup: () => {
    l(), n.removeEventListener("pointerdown", u), s.clear(), Ge(o);
  } };
}
class qi extends Ur {
  constructor(e, t, i = 0) {
    var r, o, s, a, l, u, c, d, p, h;
    super(), this.totalDuration = t, this.numberOfChannels = i, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((r = e.end) !== null && r !== void 0 ? r : e.start), this.drag = (o = e.drag) === null || o === void 0 || o, this.resize = (s = e.resize) === null || s === void 0 || s, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (l = e.resizeEnd) === null || l === void 0 || l, this.color = (u = e.color) !== null && u !== void 0 ? u : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (p = e.channelIdx) !== null && p !== void 0 ? p : -1, this.contentEditable = (h = e.contentEditable) !== null && h !== void 0 ? h : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, i = ht("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), r = ht("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), o = qt(i, { threshold: 1 }), s = qt(r, { threshold: 1 }), a = Bt((() => {
      const u = o.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "start") : u.type === "end" && this.onEndResizing("start"));
    }), [o.signal]), l = Bt((() => {
      const u = s.signal.value;
      u && (u.type === "move" && u.deltaX !== void 0 ? this.onResize(u.deltaX, "end") : u.type === "end" && this.onEndResizing("end"));
    }), [s.signal]);
    this.subscriptions.push((() => {
      a(), l(), o.cleanup(), s.cleanup();
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
    const r = ht("div", { style: { position: "absolute", top: `${t}%`, height: `${i}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
    return !e && this.resize && this.addResizeHandles(r), r;
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
    const t = st(e, "click"), i = st(e, "mouseenter"), r = st(e, "mouseleave"), o = st(e, "dblclick"), s = st(e, "pointerdown"), a = st(e, "pointerup"), l = t.subscribe(((g) => g && this.emit("click", g))), u = i.subscribe(((g) => g && this.emit("over", g))), c = r.subscribe(((g) => g && this.emit("leave", g))), d = o.subscribe(((g) => g && this.emit("dblclick", g))), p = s.subscribe(((g) => g && this.toggleCursor(!0))), h = a.subscribe(((g) => g && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      l(), u(), c(), d(), p(), h(), Ge(t), Ge(i), Ge(r), Ge(o), Ge(s), Ge(a);
    }));
    const v = qt(e), y = Bt((() => {
      const g = v.signal.value;
      g && (g.type === "start" ? this.toggleCursor(!0) : g.type === "move" && g.deltaX !== void 0 ? this.onMove(g.deltaX) : g.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [v.signal]);
    this.subscriptions.push((() => {
      y(), v.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (g) => this.onContentClick(g), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, i) {
    var r;
    if (!(!((r = this.element) === null || r === void 0) && r.parentElement)) return;
    const { width: o } = this.element.parentElement.getBoundingClientRect(), s = e / o * this.totalDuration;
    let a = t && t !== "start" ? this.start : this.start + s, l = t && t !== "end" ? this.end : this.end + s;
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
        const r = this.start === this.end;
        this.start = this.clampPosition((t = e.start) !== null && t !== void 0 ? t : this.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : r ? this.start : this.end), this.renderPosition(), this.setPart();
      }
      if (e.content && this.setContent(e.content), e.id && (this.id = e.id, this.setPart()), e.resize !== void 0 && e.resize !== this.resize) {
        const r = this.start === this.end;
        this.resize = e.resize, this.resize && !r ? this.addResizeHandles(this.element) : this.removeResizeHandles(this.element);
      }
      e.resizeStart !== void 0 && (this.resizeStart = e.resizeStart), e.resizeEnd !== void 0 && (this.resizeEnd = e.resizeEnd);
    }
  }
  remove() {
    this.isRemoved = !0, this.emit("remove"), this.subscriptions.forEach(((e) => e())), this.subscriptions = [], this.content && this.contentEditable && (this.contentClickListener && (this.content.removeEventListener("click", this.contentClickListener), this.contentClickListener = void 0), this.contentBlurListener && (this.content.removeEventListener("blur", this.contentBlurListener), this.contentBlurListener = void 0)), this.element && (this.element.remove(), this.element = null), this.unAll();
  }
}
class ei extends Ed {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new ei(e);
  }
  onInit() {
    if (!this.wavesurfer) throw Error("WaveSurfer is not initialized");
    this.wavesurfer.getWrapper().appendChild(this.regionsContainer), this.subscriptions.push(this.wavesurfer.on("ready", ((t) => {
      this.regions.forEach(((i) => i._setTotalDuration(t)));
    })));
    let e = [];
    this.subscriptions.push(this.wavesurfer.on("timeupdate", ((t) => {
      const i = this.regions.filter(((r) => r.start <= t && (r.end === r.start ? r.start + 0.05 : r.end) >= t));
      i.forEach(((r) => {
        e.includes(r) || this.emit("region-in", r);
      })), e.forEach(((r) => {
        i.includes(r) || this.emit("region-out", r);
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
      const t = e.content, i = t.getBoundingClientRect(), r = this.regions.map(((o) => {
        if (o === e || !o.content) return 0;
        const s = o.content.getBoundingClientRect();
        return i.left < s.left + s.width && s.left < i.left + i.width ? s.height : 0;
      })).reduce(((o, s) => o + s), 0);
      t.style.marginTop = `${r}px`;
    }), 10);
  }
  adjustScroll(e) {
    var t, i;
    if (!e.element) return;
    const r = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getWrapper()) === null || i === void 0 ? void 0 : i.parentElement;
    if (!r) return;
    const { clientWidth: o, scrollWidth: s } = r;
    if (s <= o) return;
    const a = r.getBoundingClientRect(), l = e.element.getBoundingClientRect(), u = l.left - a.left, c = l.right - a.left;
    u < 0 ? r.scrollLeft += u : c > o && (r.scrollLeft += c - o);
  }
  virtualAppend(e, t, i) {
    const r = () => {
      if (!this.wavesurfer) return;
      const o = this.wavesurfer.getWidth(), s = this.wavesurfer.getScroll(), a = t.clientWidth, l = this.wavesurfer.getDuration(), u = Math.round(e.start / l * a), c = u + (Math.round((e.end - e.start) / l * a) || 1) > s && u < s + o;
      c && !i.parentElement ? t.appendChild(i) : !c && i.parentElement && i.remove();
    };
    setTimeout((() => {
      if (!this.wavesurfer || !e.element) return;
      r();
      const o = this.wavesurfer.on("scroll", r), s = this.wavesurfer.on("zoom", r), a = this.wavesurfer.on("resize", r);
      this.subscriptions.push(o, s, a), e.once("remove", (() => {
        o(), s(), a();
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
      var r;
      (r = this.wavesurfer) === null || r === void 0 || r.play(e.start, i);
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
    const r = this.wavesurfer.getDuration(), o = (i = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || i === void 0 ? void 0 : i.numberOfChannels, s = new qi(e, r, o);
    return this.emit("region-initialized", s), r ? this.saveRegion(s) : this.subscriptions.push(this.wavesurfer.once("ready", ((a) => {
      s._setTotalDuration(a), this.saveRegion(s);
    }))), s;
  }
  enableDragSelection(e, t = 3) {
    var i;
    const r = (i = this.wavesurfer) === null || i === void 0 ? void 0 : i.getWrapper();
    if (!(r && r instanceof HTMLElement)) return () => {
    };
    let o = null, s = 0, a = 0;
    const l = qt(r, { threshold: t }), u = Bt((() => {
      var c, d;
      const p = l.signal.value;
      if (p) if (p.type === "start") {
        if (s = p.x, !this.wavesurfer) return;
        const h = this.wavesurfer.getDuration(), v = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: y } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = s / y * h;
        const g = p.x / y * h, b = (p.x + 5) / y * h;
        o = new qi(Object.assign(Object.assign({}, e), { start: g, end: b }), h, v), this.emit("region-initialized", o), o.element && this.regionsContainer.appendChild(o.element);
      } else p.type === "move" && p.deltaX !== void 0 ? o && o._onUpdate(p.deltaX, p.x > s ? "end" : "start", a) : p.type === "end" && o && (this.saveRegion(o), o.updatingSide = void 0, o = null);
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
const bn = [0.5, 0.75, 1, 1.25, 1.5, 2];
function xd(n) {
  const { containerRef: e, audioSrc: t, turns: i, speakers: r } = n, o = ut(null), s = ut(null), a = T(0), l = T(0), u = T(!1), c = T(!1), d = T(!1), p = T(1), h = T(1), v = T(!1), y = P(() => Nt(a.value)), g = P(() => Nt(l.value));
  function b(q, R) {
    H(), d.value = !0, c.value = !1;
    const V = ei.create();
    s.value = V;
    const Y = Et.create({
      container: q,
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
      renderFunction: To,
      url: R,
      plugins: [V]
    });
    Y.on("ready", () => {
      c.value = !0, d.value = !1, l.value = Y.getDuration(), m();
    }), Y.on("timeupdate", (te) => {
      a.value = te;
    }), Y.on("play", () => {
      u.value = !0;
    }), Y.on("pause", () => {
      u.value = !1;
    }), Y.on("finish", () => {
      u.value = !1;
    }), o.value = Y;
  }
  function m() {
    const q = s.value;
    if (q) {
      q.clearRegions();
      for (const R of i.value) {
        const V = R.speakerId ? r.value.get(R.speakerId) : void 0;
        if (!V || R.startTime == null || R.endTime == null) continue;
        const Y = V.color;
        q.addRegion({
          start: R.startTime,
          end: R.endTime,
          color: xo(Y, 0.25),
          drag: !1,
          resize: !1
        }).element?.style.setProperty("--region-color", Y);
      }
    }
  }
  function S() {
    o.value?.play();
  }
  function w() {
    o.value?.pause();
  }
  function _() {
    o.value?.playPause();
  }
  function E(q) {
    const R = o.value;
    !R || l.value === 0 || R.setTime(q);
  }
  function C(q) {
    E(Math.max(0, Math.min(a.value + q, l.value)));
  }
  function A(q) {
    const R = o.value;
    R && (p.value = q, R.setVolume(q), q > 0 && v.value && (v.value = !1, R.setMuted(!1)));
  }
  function O() {
    const q = o.value;
    q && (v.value = !v.value, q.setMuted(v.value));
  }
  function M(q) {
    const R = o.value;
    R && (h.value = q, R.setPlaybackRate(q));
  }
  function U() {
    const R = (bn.indexOf(
      h.value
    ) + 1) % bn.length;
    M(bn[R] ?? 1);
  }
  function H() {
    o.value && (o.value.destroy(), o.value = null, s.value = null);
  }
  return Q(
    [e, t],
    ([q, R]) => {
      q && R && b(q, R);
    },
    { immediate: !0 }
  ), Q([i, r], () => {
    c.value && m();
  }), xt(() => {
    H();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    volume: p,
    playbackRate: h,
    isMuted: v,
    formattedCurrentTime: y,
    formattedDuration: g,
    play: S,
    pause: w,
    togglePlay: _,
    seekTo: E,
    skip: C,
    setVolume: A,
    setPlaybackRate: M,
    cyclePlaybackRate: U,
    toggleMute: O
  };
}
const kd = { class: "audio-player" }, Td = /* @__PURE__ */ D({
  __name: "AudioPlayer",
  props: {
    audioSrc: {},
    turns: {},
    speakers: {}
  },
  emits: ["timeupdate", "playStateChange"],
  setup(n, { expose: e, emit: t }) {
    const i = n, r = t, o = T(null), {
      isPlaying: s,
      isReady: a,
      isLoading: l,
      volume: u,
      playbackRate: c,
      isMuted: d,
      currentTime: p,
      formattedCurrentTime: h,
      formattedDuration: v,
      togglePlay: y,
      seekTo: g,
      pause: b,
      skip: m,
      setVolume: S,
      cyclePlaybackRate: w,
      toggleMute: _
    } = xd({
      containerRef: o,
      audioSrc: $t(() => i.audioSrc),
      turns: $t(() => i.turns),
      speakers: $t(() => i.speakers)
    });
    return Q(p, (E) => r("timeupdate", E)), Q(s, (E) => r("playStateChange", E)), e({ seekTo: g, pause: b }), (E, C) => (x(), N("footer", kd, [
      z("div", {
        ref_key: "waveformRef",
        ref: o,
        class: zt(["waveform-container", { "waveform-container--loading": f(l) }])
      }, null, 2),
      L(hd, {
        "is-playing": f(s),
        "current-time": f(h),
        duration: f(v),
        volume: f(u),
        "playback-rate": f(c),
        "is-muted": f(d),
        "is-ready": f(a),
        onTogglePlay: f(y),
        onSkipBack: C[0] || (C[0] = (A) => f(m)(-10)),
        onSkipForward: C[1] || (C[1] = (A) => f(m)(10)),
        "onUpdate:volume": f(S),
        onToggleMute: f(_),
        onCyclePlaybackRate: f(w)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), Pd = /* @__PURE__ */ de(Td, [["__scopeId", "data-v-9248e45e"]]);
class Ad {
  diff(e, t, i = {}) {
    let r;
    typeof i == "function" ? (r = i, i = {}) : "callback" in i && (r = i.callback);
    const o = this.castInput(e, i), s = this.castInput(t, i), a = this.removeEmpty(this.tokenize(o, i)), l = this.removeEmpty(this.tokenize(s, i));
    return this.diffWithOptionsObj(a, l, i, r);
  }
  diffWithOptionsObj(e, t, i, r) {
    var o;
    const s = (m) => {
      if (m = this.postProcess(m, i), r) {
        setTimeout(function() {
          r(m);
        }, 0);
        return;
      } else
        return m;
    }, a = t.length, l = e.length;
    let u = 1, c = a + l;
    i.maxEditLength != null && (c = Math.min(c, i.maxEditLength));
    const d = (o = i.timeout) !== null && o !== void 0 ? o : 1 / 0, p = Date.now() + d, h = [{ oldPos: -1, lastComponent: void 0 }];
    let v = this.extractCommon(h[0], t, e, 0, i);
    if (h[0].oldPos + 1 >= l && v + 1 >= a)
      return s(this.buildValues(h[0].lastComponent, t, e));
    let y = -1 / 0, g = 1 / 0;
    const b = () => {
      for (let m = Math.max(y, -u); m <= Math.min(g, u); m += 2) {
        let S;
        const w = h[m - 1], _ = h[m + 1];
        w && (h[m - 1] = void 0);
        let E = !1;
        if (_) {
          const A = _.oldPos - m;
          E = _ && 0 <= A && A < a;
        }
        const C = w && w.oldPos + 1 < l;
        if (!E && !C) {
          h[m] = void 0;
          continue;
        }
        if (!C || E && w.oldPos < _.oldPos ? S = this.addToPath(_, !0, !1, 0, i) : S = this.addToPath(w, !1, !0, 1, i), v = this.extractCommon(S, t, e, m, i), S.oldPos + 1 >= l && v + 1 >= a)
          return s(this.buildValues(S.lastComponent, t, e)) || !0;
        h[m] = S, S.oldPos + 1 >= l && (g = Math.min(g, m - 1)), v + 1 >= a && (y = Math.max(y, m + 1));
      }
      u++;
    };
    if (r)
      (function m() {
        setTimeout(function() {
          if (u > c || Date.now() > p)
            return r(void 0);
          b() || m();
        }, 0);
      })();
    else
      for (; u <= c && Date.now() <= p; ) {
        const m = b();
        if (m)
          return m;
      }
  }
  addToPath(e, t, i, r, o) {
    const s = e.lastComponent;
    return s && !o.oneChangePerToken && s.added === t && s.removed === i ? {
      oldPos: e.oldPos + r,
      lastComponent: { count: s.count + 1, added: t, removed: i, previousComponent: s.previousComponent }
    } : {
      oldPos: e.oldPos + r,
      lastComponent: { count: 1, added: t, removed: i, previousComponent: s }
    };
  }
  extractCommon(e, t, i, r, o) {
    const s = t.length, a = i.length;
    let l = e.oldPos, u = l - r, c = 0;
    for (; u + 1 < s && l + 1 < a && this.equals(i[l + 1], t[u + 1], o); )
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
    const r = [];
    let o;
    for (; e; )
      r.push(e), o = e.previousComponent, delete e.previousComponent, e = o;
    r.reverse();
    const s = r.length;
    let a = 0, l = 0, u = 0;
    for (; a < s; a++) {
      const c = r[a];
      if (c.removed)
        c.value = this.join(i.slice(u, u + c.count)), u += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(l, l + c.count);
          d = d.map(function(p, h) {
            const v = i[u + h];
            return v.length > p.length ? v : p;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(l, l + c.count));
        l += c.count, c.added || (u += c.count);
      }
    }
    return r;
  }
}
class Od extends Ad {
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
const Id = new Od();
function Rd(n, e, t) {
  return Id.diff(n, e, t);
}
function wn({ previousText: n, previousIndexes: e }, t, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const r = n.split(" "), o = t.split(" "), s = Rd(r, o, {
    comparator: Dd
  }), a = Ld(s), l = [...e];
  let u = [...e], c = 0;
  for (const h of a) {
    do
      if (c < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in h && h.replaced)
      u = Ft(
        u,
        l[0],
        h.countAdded - h.countRemoved
      ), c += h.countRemoved;
    else if ("removed" in h && h.removed) {
      const v = h;
      c += v.count, u = Ft(
        u,
        l[0],
        -v.count
      );
    } else if ("added" in h && h.added) {
      const v = h;
      u = Ft(
        u,
        l[0],
        v.count
      );
    } else
      c += h.count;
  }
  const d = u.length > 0 ? u[u.length - 1] : 0, p = o.slice(d).join(" ");
  if (i(p)) {
    const v = Yr(
      p,
      i
    ).map(
      (y) => y + d
    );
    u = u.concat(v);
  }
  return {
    previousIndexes: u,
    previousText: t
  };
}
function Ld(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const i = n[t];
    if (!i.removed) {
      e.push(i);
      continue;
    }
    if (t + 1 < n.length) {
      const r = n[t + 1];
      if (r.added) {
        e.push({
          replaced: !0,
          removed: i.removed ?? !1,
          added: r.added ?? !1,
          countRemoved: i.count,
          countAdded: r.count
        }), t++;
        continue;
      }
    }
    e.push(i);
  }
  return e;
}
function Ft(n, e, t) {
  return n.map((i) => i >= e ? i + t : i);
}
function Yr(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let i;
  for (i = 0; i < t.length; i++) {
    const r = t.slice(0, i).join(" ");
    if (e(r)) break;
  }
  return [i - 1].concat(
    Ft(
      Yr(
        t.slice(i - 1).join(" "),
        e
      ),
      0,
      i - 1
    )
  );
}
function Dd(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = Math.min(t.length, i.length);
  let o = 0;
  for (let a = 0; a < r; a++)
    t[a] === i[a] && o++;
  return o / t.length > 0.8;
}
class Md {
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
    color: r = "white",
    font: o = "Arial",
    paddingInline: s = 100
  } = {}) {
    this.canvas = e, this.fontSize = t, this.lineHeight = i, this.color = r, this.font = o, this.paddingInline = s, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.resizeObserver = new ResizeObserver(() => {
      this.isResizing = !0, this.canvas.width = this.canvas.clientWidth, this.canvas.height = this.canvas.clientHeight, this.onResize(), this.isResizing = !1;
    }), this.resizeObserver.observe(this.canvas);
  }
  dispose() {
    this.resizeObserver.disconnect();
  }
  resetDrawing() {
    this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawText(e, t, i) {
    const r = this.canvas.getContext("2d");
    r.font = `${this.fontSize}px ${this.font}`, r.fillStyle = this.color, r.fillText(e, t + this.paddingInline, i);
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
class $d extends Md {
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
    this.resetAll(), this.currentState = wn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = wn(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = wn(
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
function Gr(n) {
  const e = tt();
  let t = null;
  ee(() => {
    n.canvasRef.value && (t = new $d(n.canvasRef.value, {
      fontSize: n.fontSize,
      lineHeight: n.lineHeight
    }));
  }), Q(
    () => e.live?.partial.value,
    (a) => {
      a && t && t.newPartial(a);
    }
  );
  const i = e.onActiveTranslation("turn:add", ({ turn: a }) => {
    if (!t) return;
    const l = a.words.length > 0 ? a.words.map((u) => u.text).join(" ") : a.text ?? "";
    l && t.newFinal(l);
  });
  function r() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const o = e.on("translation:sync", r), s = e.on("channel:sync", r);
  _e(() => {
    i(), o(), s(), t?.dispose(), t = null;
  });
}
const Bd = ["height"], qd = /* @__PURE__ */ D({
  __name: "SubtitleBanner",
  setup(n) {
    const e = tt(), t = gt("canvas"), i = P(() => e.subtitle?.fontSize.value ?? 40), r = P(() => 1.2 * i.value), o = P(() => 2.4 * i.value);
    return Gr({
      canvasRef: t,
      fontSize: i.value,
      lineHeight: r.value
    }), (s, a) => (x(), N("div", {
      class: "subtitle-banner",
      style: Ie({ height: o.value + "px" })
    }, [
      z("canvas", {
        ref: "canvas",
        class: "subtitle-canvas",
        height: o.value
      }, null, 8, Bd)
    ], 4));
  }
}), Fd = /* @__PURE__ */ de(qd, [["__scopeId", "data-v-02298bf5"]]), zd = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Nd = ["aria-label"], Hd = {
  ref: "canvas",
  class: "subtitle-fullscreen__canvas"
}, Fi = 48, Wd = /* @__PURE__ */ D({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = tt(), { t } = Re(), i = gt("container"), r = gt("canvas");
    Gr({
      canvasRef: r,
      fontSize: Fi,
      lineHeight: 1.2 * Fi
    }), ee(async () => {
      const a = i.value;
      if (a) {
        try {
          await a.requestFullscreen();
        } catch (l) {
          console.warn("Fullscreen API not supported:", l);
        }
        try {
          await screen.orientation.lock("landscape");
        } catch {
        }
      }
    });
    function o() {
      document.fullscreenElement || e.subtitle?.exitFullscreen();
    }
    ee(() => {
      document.addEventListener("fullscreenchange", o);
    });
    function s() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return _e(() => {
      document.removeEventListener("fullscreenchange", o);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (a, l) => (x(), N("div", zd, [
      z("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": f(t)("subtitle.exitFullscreen"),
        onClick: s
      }, [
        L(f(Qi), { size: 24 })
      ], 8, Nd),
      z("canvas", Hd, null, 512)
    ], 512));
  }
}), Vd = /* @__PURE__ */ de(Wd, [["__scopeId", "data-v-0dd47a7b"]]), jd = { class: "editor-layout" }, Ud = { class: "editor-body" }, Kd = {
  key: 4,
  class: "mobile-selectors"
}, Xd = /* @__PURE__ */ D({
  __name: "EditorLayout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = tt(), { t: i, locale: r } = Re(), { isMobile: o } = Nr(), s = T(!1), a = P(() => t.activeChannel.value.activeTranslation.value.turns.value), l = t.speakers.all, u = P(() => [...t.channels.values()]), c = P(() => [...t.activeChannel.value.translations.values()]), d = P(() => t.activeChannel.value.activeTranslation.value.id), p = P(() => Array.from(l.values())), h = gt("audioPlayer");
    function v(m) {
      t.audio && (t.audio.currentTime.value = m);
    }
    Q(
      () => t.activeChannelId.value,
      () => {
        h.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), s.value = !1;
      }
    ), t.audio && t.audio.setSeekHandler((m) => h.value?.seekTo(m));
    const y = P(
      () => Xi(
        c.value,
        r.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard")
      )
    );
    function g(m) {
      t.setActiveChannel(m);
    }
    function b(m) {
      t.activeChannel.value.setActiveTranslation(m);
    }
    return (m, S) => (x(), N("div", jd, [
      e.showHeader ? (x(), I(is, {
        key: 0,
        title: f(t).title.value,
        duration: f(t).activeChannel.value.duration,
        language: d.value,
        "is-mobile": f(o),
        onToggleSidebar: S[0] || (S[0] = (w) => s.value = !s.value)
      }, null, 8, ["title", "duration", "language", "is-mobile"])) : K("", !0),
      z("main", Ud, [
        L(Tc, {
          turns: a.value,
          speakers: f(l)
        }, null, 8, ["turns", "speakers"]),
        f(o) ? K("", !0) : (x(), I(Li, {
          key: 0,
          speakers: p.value,
          channels: u.value,
          "selected-channel-id": f(t).activeChannelId.value,
          translations: c.value,
          "selected-translation-id": d.value,
          "onUpdate:selectedChannelId": g,
          "onUpdate:selectedTranslationId": b
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])),
        L(od, {
          open: s.value,
          "onUpdate:open": S[1] || (S[1] = (w) => s.value = w)
        }, {
          default: k(() => [
            L(Li, {
              speakers: p.value,
              channels: u.value,
              "selected-channel-id": f(t).activeChannelId.value,
              translations: c.value,
              "selected-translation-id": d.value,
              "onUpdate:selectedChannelId": g,
              "onUpdate:selectedTranslationId": b
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id"])
          ]),
          _: 1
        }, 8, ["open"])
      ]),
      f(t).audio?.src.value ? (x(), I(Pd, {
        key: 1,
        ref: "audioPlayer",
        "audio-src": f(t).audio.src.value,
        turns: a.value,
        speakers: f(l),
        onTimeupdate: v,
        onPlayStateChange: S[2] || (S[2] = (w) => {
          f(t).audio && (f(t).audio.isPlaying.value = w);
        })
      }, null, 8, ["audio-src", "turns", "speakers"])) : K("", !0),
      f(t).subtitle?.isVisible.value && !f(o) && !f(t).subtitle.isFullscreen.value ? (x(), I(Fd, { key: 2 })) : K("", !0),
      f(t).subtitle?.isFullscreen.value ? (x(), I(Vd, { key: 3 })) : K("", !0),
      f(o) ? (x(), N("div", Kd, [
        u.value.length > 1 ? (x(), I(Hr, {
          key: 0,
          channels: u.value,
          "selected-channel-id": f(t).activeChannelId.value,
          "onUpdate:selectedChannelId": g
        }, null, 8, ["channels", "selected-channel-id"])) : K("", !0),
        c.value.length > 1 ? (x(), I(Qn, {
          key: 1,
          items: y.value,
          "selected-value": d.value,
          ariaLabel: f(i)("sidebar.translationLabel"),
          "onUpdate:selectedValue": b
        }, null, 8, ["items", "selected-value", "ariaLabel"])) : K("", !0)
      ])) : K("", !0)
    ]));
  }
}), nf = /* @__PURE__ */ de(Xd, [["__scopeId", "data-v-9a2a971d"]]);
function rf() {
  return {
    name: "audio",
    install(n) {
      const e = T(0), t = T(!1);
      let i = null;
      const r = P(
        () => n.activeChannel.value.activeTranslation.value.audio?.src ?? null
      );
      function o(l) {
        i?.(l);
      }
      function s(l) {
        i = l;
      }
      const a = {
        currentTime: e,
        isPlaying: t,
        src: r,
        seekTo: o,
        setSeekHandler: s
      };
      return n.audio = a, () => {
        n.audio = void 0;
      };
    }
  };
}
function Sn(n) {
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
function of() {
  return {
    name: "live",
    install(n) {
      const e = ut(null), t = T(!1);
      t.value = !0;
      function i() {
        e.value = null, ni(e);
      }
      function r(m, S) {
        if (n.activeChannelId.value !== S) return;
        const w = n.activeChannel.value.activeTranslation.value;
        if (w.isSource) {
          if (m.text == null) return;
          e.value = m.text;
        } else if (m.translations) {
          const _ = m.translations.find(
            (E) => E.translationId === w.id
          );
          e.value = _?.text ?? null;
        } else
          return;
        ni(e);
      }
      let o = null;
      function s() {
        o === null && (o = setTimeout(() => {
          o = null, i();
        }, 150));
      }
      function a() {
        o !== null && (clearTimeout(o), o = null);
      }
      function l(m, S) {
        m.speakerId && n.speakers.ensure(m.speakerId);
        const w = n.channels.get(S);
        if (m.text != null && w) {
          const _ = Sn(m), E = w.sourceTranslation;
          E.turns.value.some(
            (A) => A.id === m.turnId
          ) ? E.updateTurn(m.turnId, _) : E.addTurn(_);
        }
        if (m.translations && w)
          for (const _ of m.translations) {
            const E = w.translations.get(_.translationId);
            if (!E) continue;
            const C = {
              id: m.turnId,
              speakerId: m.speakerId,
              text: _.text,
              words: [],
              startTime: m.startTime,
              endTime: m.endTime,
              language: _.language
            };
            E.turns.value.some(
              (O) => O.id === m.turnId
            ) ? E.updateTurn(m.turnId, C) : E.addTurn(C);
          }
        d();
      }
      function u(m, S) {
        m.speakerId && n.speakers.ensure(m.speakerId);
        const w = n.channels.get(S);
        if (w) {
          if (m.text != null) {
            const _ = Sn(m);
            w.sourceTranslation.prependTurns([_]);
          }
          if (m.translations)
            for (const _ of m.translations) {
              const E = w.translations.get(_.translationId);
              if (!E) continue;
              const C = {
                id: m.turnId,
                speakerId: m.speakerId,
                text: _.text,
                words: [],
                startTime: m.startTime,
                endTime: m.endTime,
                language: _.language
              };
              E.prependTurns([C]);
            }
        }
      }
      function c(m, S) {
        const w = n.channels.get(S);
        if (!w) return;
        const _ = /* @__PURE__ */ new Set();
        for (const A of m)
          A.speakerId && !_.has(A.speakerId) && (_.add(A.speakerId), n.speakers.ensure(A.speakerId));
        const E = [];
        for (const A of m)
          A.text != null && E.push(Sn(A));
        E.length > 0 && w.sourceTranslation.prependTurns(E);
        const C = /* @__PURE__ */ new Map();
        for (const A of m)
          if (A.translations)
            for (const O of A.translations) {
              let M = C.get(O.translationId);
              M || (M = [], C.set(O.translationId, M)), M.push({
                id: A.turnId,
                speakerId: A.speakerId,
                text: O.text,
                words: [],
                startTime: A.startTime,
                endTime: A.endTime,
                language: O.language
              });
            }
        for (const [A, O] of C) {
          const M = w.translations.get(A);
          M && M.prependTurns(O);
        }
      }
      function d() {
        a(), i();
      }
      function p(m) {
        console.warn("[live-plugin] onTranslation not yet implemented");
      }
      const h = {
        partial: e,
        hasLiveUpdate: t,
        onPartial: r,
        onFinal: l,
        prependFinal: u,
        prependFinalBatch: c,
        onTranslation: p
      }, v = n.on("channel:change", d), y = n.on("translation:change", d), g = n.on("translation:sync", s), b = n.on("channel:sync", s);
      return n.live = h, () => {
        d(), v(), y(), g(), b(), n.live = void 0;
      };
    }
  };
}
function sf(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = T(n.fontSize ?? 40), i = T(!0), r = T(!1), o = {
        fontSize: t,
        isVisible: i,
        isFullscreen: r,
        enterFullscreen() {
          r.value = !0;
        },
        exitFullscreen() {
          r.value = !1;
        }
      };
      return e.subtitle = o, () => {
        i.value = !1, r.value = !1, e.subtitle = void 0;
      };
    }
  };
}
function Yd(n) {
  return {
    id: n.wid,
    text: n.word,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    ...n.confidence !== void 0 && { confidence: n.confidence }
  };
}
function af(n) {
  const e = /* @__PURE__ */ new Map();
  for (const r of n.speakers)
    e.set(r.speaker_id, {
      id: r.speaker_id,
      name: r.speaker_name,
      color: ""
    });
  const t = n.text.map((r) => {
    const o = r.words.map(Yd), s = o[0]?.startTime ?? r.stime, a = o.length > 0 ? o[o.length - 1].endTime ?? r.etime : r.etime;
    return {
      id: r.turn_id,
      speakerId: r.speaker_id || null,
      text: o.length > 0 ? null : r.segment,
      words: o,
      ...s !== void 0 && { startTime: s },
      ...a !== void 0 && { endTime: a },
      language: r.language
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
export {
  ce as DocumentValidationError,
  nf as EditorLayout,
  rf as createAudioPlugin,
  Zd as createEditorStore,
  of as createLivePlugin,
  sf as createSubtitlePlugin,
  af as mapApiDocument,
  Jd as provideEditorStore,
  Qd as provideI18n,
  tt as useEditorStore,
  ko as validateEditorDocument
};
