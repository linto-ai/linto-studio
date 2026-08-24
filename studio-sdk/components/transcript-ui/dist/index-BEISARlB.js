import * as _o from "vue";
import { shallowReactive as wn, shallowRef as Pt, ref as M, computed as A, inject as Gn, provide as _n, h as bt, defineComponent as j, openBlock as k, createBlock as V, resolveDynamicComponent as Ht, normalizeClass as Te, normalizeStyle as Yt, createElementBlock as $, useSlots as sc, renderSlot as Q, createCommentVNode as G, createTextVNode as me, toDisplayString as K, createElementVNode as N, Fragment as ye, renderList as ze, unref as h, withCtx as z, createVNode as q, watchEffect as tt, onBeforeUnmount as gt, watch as oe, normalizeProps as pt, guardReactiveProps as Rt, effectScope as za, getCurrentScope as Fa, onScopeDispose as qa, getCurrentInstance as Zt, customRef as oc, toValue as We, readonly as ac, nextTick as Pe, onMounted as _e, toHandlerKey as lc, camelize as Va, toRef as Ha, onUnmounted as Qt, toRefs as xn, Comment as uc, mergeProps as ve, cloneVNode as cc, reactive as cs, Teleport as dc, markRaw as fc, withKeys as Wa, withModifiers as De, watchPostEffect as Ua, shallowReadonly as fn, mergeDefaults as ja, isRef as pc, useTemplateRef as nt, useId as Hr, withDirectives as Hn, vModelSelect as hc, vModelDynamic as mc, createStaticVNode as vc, isMemoSame as gc, Transition as Wr, useModel as yc, vShow as Ka, vModelText as bc } from "vue";
function kc() {
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
const xo = [
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
function Ga(n, e, t) {
  const r = xo[n.size % xo.length];
  return { id: e, name: t, color: r };
}
function wc(n, e, t) {
  return !e || n.has(e) ? null : Ga(n, e, t ?? e);
}
function Eo(n, e) {
  return n.name === e.name && n.color === e.color;
}
function Sc(n) {
  const e = wn(/* @__PURE__ */ new Map());
  function t(a, u) {
    const l = wc(e, a, u);
    l && (e.set(l.id, l), n("speaker:add", { speaker: l }));
  }
  function r(a, u) {
    const l = e.get(a);
    if (!l) return;
    const c = { ...l, ...u };
    Eo(l, c) || (e.set(a, c), n("speaker:update", { speaker: c }));
  }
  function i(a) {
    const u = e.get(a.id);
    if (u) {
      if (Eo(u, a)) return;
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
function Tc(n, e) {
  return [...n, e];
}
function _c(n, e) {
  return [...e, ...n];
}
function ds(n, e) {
  return n.findIndex((t) => t.id === e);
}
function xc(n, e, t) {
  const r = ds(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function Ec(n, e) {
  const t = ds(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function Cc(n, e, t) {
  const r = ds(n, e);
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
function Hi(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function Ac(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = Pt(n.turns), u = M(null);
  function l(x) {
    u.value = x;
  }
  const c = /* @__PURE__ */ new Map();
  function d() {
    c.clear();
    const x = a.value;
    for (let _ = 0; _ < x.length; _++)
      c.set(x[_].id, _);
  }
  d();
  function f(x) {
    t(x.speakerId), c.set(x.id, a.value.length), a.value = Tc(a.value, x), e("turn:add", { turn: x, translationId: r });
  }
  function p(x, _) {
    const w = xc(a.value, x, _);
    w && (a.value = w.turns, e("turn:update", { turn: w.updated, translationId: r }));
  }
  function m(x) {
    const _ = Ec(a.value, x);
    _ && (a.value = _, d(), e("turn:remove", { turnId: x, translationId: r }));
  }
  function v(x, _) {
    const w = Cc(a.value, x, _);
    w && (a.value = w.turns, e("turn:update", { turn: w.updated, translationId: r }));
  }
  function y(x) {
    Hi(x, t), a.value = _c(a.value, x), d();
  }
  function T(x) {
    Hi(x, t), a.value = x, d(), e("translation:sync", { translationId: r });
  }
  function S(x) {
    a.value = x, d();
  }
  function E(x) {
    const _ = c.get(x.id);
    _ !== void 0 ? a.value[_] = x : (c.set(x.id, a.value.length), a.value.push(x));
  }
  function C(x) {
    return c.has(x);
  }
  function B(x) {
    const _ = c.get(x);
    if (_ !== void 0)
      return a.value[_];
  }
  return {
    id: r,
    languages: i,
    isSource: s,
    audio: o,
    turns: a,
    lastModifiedAt: u,
    setLastModifiedAt: l,
    addTurn: f,
    prependTurns: y,
    updateTurn: p,
    removeTurn: m,
    updateWords: v,
    setTurns: T,
    replaceTurns: S,
    updateOrCreateTurnSilent: E,
    hasTurn: C,
    getTurn: B
  };
}
function Ir(n) {
  return n.split("-")[0];
}
function Rr(n, e) {
  return n == null || e == null ? !1 : Ir(n) === Ir(e);
}
const jt = "cross";
function Ic(n, e, t, r) {
  const i = n.languages.map(Ir);
  if (i.length !== 2) return null;
  const s = /* @__PURE__ */ new Map();
  for (const v of e.values())
    if (v.id !== n.id) {
      if (v.languages.length !== 1 || !v.languages[0])
        return null;
      s.set(Ir(v.languages[0]), v);
    }
  for (const v of i)
    if (!s.has(v))
      return null;
  const [o, a] = i;
  if (!o || !a) return null;
  const u = /* @__PURE__ */ new Set([
    s.get(o).id,
    s.get(a).id
  ]), l = A(
    () => n.turns.value.map((v) => c(v.id) ?? v)
  );
  function c(v) {
    const y = n.getTurn(v);
    if (!y) return;
    const T = Rr(y.language, o) ? a : o;
    if (!T) return y;
    const S = s.get(T)?.getTurn(v);
    return S || y;
  }
  const d = [];
  function f(v, y) {
    return u.has(y) ? v.sourceLanguage == null ? !0 : !Rr(v.language, v.sourceLanguage) : !1;
  }
  function p(v) {
    d.push(
      r(v, ({ turn: y, translationId: T }) => {
        f(y, T) && t(v, { turn: y, translationId: jt });
      })
    );
  }
  p("turn:add"), p("turn:update"), d.push(
    r("turn:remove", ({ turnId: v, translationId: y }) => {
      u.has(y) && t("turn:remove", { turnId: v, translationId: jt });
    })
  );
  function m() {
    d.forEach((v) => v()), d.length = 0;
  }
  return {
    id: jt,
    isSource: !1,
    languages: n.languages,
    turns: l,
    getTurn: c,
    dispose: m
  };
}
function Co(n, e, t, r) {
  const { id: i, name: s, description: o, duration: a } = n, u = wn(/* @__PURE__ */ new Map());
  let l;
  for (const E of n.translations) {
    const C = Ac(E, e, r);
    u.set(E.id, C), E.isSource && !l && (l = C);
  }
  l || (l = u.values().next().value);
  const c = Ic(
    l,
    u,
    e,
    t
  ), d = [...u.values()];
  c && d.push(c);
  const f = M(null), p = M(!1), m = M(!0), v = A(() => {
    const E = f.value;
    return E === jt ? c ?? l : E ? u.get(E) ?? l : l;
  });
  function y(E) {
    const C = E === l.id ? null : E;
    C !== f.value && (f.value = C, e("translation:change", { translationId: v.value.id }));
  }
  function T() {
    for (const E of u.values())
      E.setTurns([]);
    p.value = !1, m.value = !0, e("channel:reset", { channelId: i });
  }
  function S() {
    c?.dispose();
  }
  return {
    id: i,
    name: s,
    description: o,
    duration: a,
    translations: u,
    sourceTranslation: l,
    crossTranslation: c,
    selectableTranslations: d,
    activeTranslation: v,
    isLoadingHistory: p,
    hasMoreHistory: m,
    setActiveTranslation: y,
    reset: T,
    dispose: S
  };
}
function Rc(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function Ao(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Xa(n, e, t = "*", r = !0) {
  if (!n) return "";
  if (n === "*") return t;
  const i = r ? n.split("-")[0] ?? n : n;
  try {
    const s = new Intl.DisplayNames([e], { type: "language" });
    return s.of(i) ?? s.of(n.split("-")[0] ?? n) ?? n;
  } catch {
    return n;
  }
}
function Pc(n, e, t, r = "*", i = "") {
  return [...n].sort(
    (o, a) => Number(a.isSource) - Number(o.isSource)
  ).map((o) => {
    const a = !o.isSource && o.languages.length > 1;
    return {
      value: o.id,
      label: o.isSource ? t : a && i ? i : o.languages.map(
        (u) => Xa(u, e, r, !1)
      ).join(", ")
    };
  });
}
function fs() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Jt = fs();
function Ya(n) {
  Jt = n;
}
var Wt = { exec: () => null };
function pn(n) {
  let e = [];
  return (t) => {
    let r = Math.max(0, Math.min(3, t - 1)), i = e[r];
    return i || (i = n(r), e[r] = i), i;
  };
}
function le(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (i, s) => {
    let o = typeof s == "string" ? s : s.source;
    return o = o.replace(Le.caret, "$1"), t = t.replace(i, o), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Mc = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), Le = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: pn((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: pn((n) => new RegExp(`^ {0,${n}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)), fencesBeginRegex: pn((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: pn((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: pn((n) => new RegExp(`^ {0,${n}}<(?:[a-z].*>|!--)`, "i")), blockquoteBeginRegex: pn((n) => new RegExp(`^ {0,${n}}>`)) }, Oc = /^(?:[ \t]*(?:\n|$))+/, Dc = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Lc = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Xn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, $c = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ps = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Za = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Qa = le(Za).replace(/bull/g, ps).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Nc = le(Za).replace(/bull/g, ps).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), hs = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Bc = /^[^\n]+/, ms = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, zc = le(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", ms).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Fc = le(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, ps).getRegex(), Ur = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", vs = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, qc = le("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", vs).replace("tag", Ur).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Ja = (n) => le(hs).replace("hr", Xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ur).getRegex(), Vc = Ja(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Hc = Ja(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), Wc = le(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Hc).getRegex(), gs = { blockquote: Wc, code: Dc, def: zc, fences: Lc, heading: $c, hr: Xn, html: qc, lheading: Qa, list: Fc, newline: Oc, paragraph: Vc, table: Wt, text: Bc }, Io = le("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ur).getRegex(), Uc = { ...gs, lheading: Nc, table: Io, paragraph: le(hs).replace("hr", Xn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Io).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ur).getRegex() }, jc = { ...gs, html: le(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", vs).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Wt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: le(hs).replace("hr", Xn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Qa).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Kc = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Gc = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, el = /^( {2,}|\\)\n(?!\s*$)/, Xc = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, St = /[\p{P}\p{S}]/u, En = /[\s\p{P}\p{S}]/u, Yn = /[^\s\p{P}\p{S}]/u, Yc = le(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, En).getRegex(), Zc = /[\p{Pi}\p{Ps}"']/u, tl = /(?!~)[\p{P}\p{S}]/u, Qc = /(?!~)[\s\p{P}\p{S}]/u, Jc = /(?:[^\s\p{P}\p{S}]|~)/u, ed = le(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Mc ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), nl = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, td = le(nl, "u").replace(/punct/g, St).getRegex(), nd = le(nl, "u").replace(/punct/g, tl).getRegex(), rd = /^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/, id = le(rd, "u").replace(/openQuote/g, Zc).replace(/punct/g, St).getRegex(), rl = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", sd = le(rl, "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, En).replace(/punct/g, St).getRegex(), od = le(rl, "gu").replace(/notPunctSpace/g, Jc).replace(/punctSpace/g, Qc).replace(/punct/g, tl).getRegex(), ad = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)", ld = le(ad, "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, En).replace(/punct/g, St).getRegex(), ud = le("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, En).replace(/punct/g, St).getRegex(), cd = "^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)", dd = le(cd, "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, En).replace(/punct/g, St).getRegex(), fd = le(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, St).getRegex(), pd = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", hd = le(pd, "gu").replace(/notPunctSpace/g, Yn).replace(/punctSpace/g, En).replace(/punct/g, St).getRegex(), md = le(/\\(punct)/, "gu").replace(/punct/g, St).getRegex(), vd = le(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), gd = le(vs).replace("(?:-->|$)", "-->").getRegex(), yd = le("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", gd).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Pr = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, bd = le(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Pr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), il = le(/^!?\[(label)\]\[(ref)\]/).replace("label", Pr).replace("ref", ms).getRegex(), sl = le(/^!?\[(ref)\](?:\[\])?/).replace("ref", ms).getRegex(), kd = le("reflink|nolink(?!\\()", "g").replace("reflink", il).replace("nolink", sl).getRegex(), Ro = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, ys = { _backpedal: Wt, anyPunctuation: md, autolink: vd, blockSkip: ed, br: el, code: Gc, del: Wt, delLDelim: Wt, delRDelim: Wt, emStrongLDelim: td, emStrongRDelimAst: sd, emStrongRDelimUnd: ud, escape: Kc, link: bd, nolink: sl, punctuation: Yc, reflink: il, reflinkSearch: kd, tag: yd, text: Xc, url: Wt }, wd = { ...ys, emStrongLDelim: id, emStrongRDelimAst: ld, emStrongRDelimUnd: dd, link: le(/^!?\[(label)\]\((.*?)\)/).replace("label", Pr).getRegex(), reflink: le(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Pr).getRegex() }, Wi = { ...ys, emStrongRDelimAst: od, emStrongLDelim: nd, delLDelim: fd, delRDelim: hd, url: le(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", Ro).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: le(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", Ro).getRegex() }, Sd = { ...Wi, br: le(el).replace("{2,}", "*").getRegex(), text: le(Wi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, vr = { normal: gs, gfm: Uc, pedantic: jc }, Dn = { normal: ys, gfm: Wi, breaks: Sd, pedantic: wd }, Td = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Po = (n) => Td[n];
function dt(n, e) {
  if (e) {
    if (Le.escapeTest.test(n)) return n.replace(Le.escapeReplace, Po);
  } else if (Le.escapeTestNoEncode.test(n)) return n.replace(Le.escapeReplaceNoEncode, Po);
  return n;
}
function Mo(n) {
  try {
    n = encodeURI(n).replace(Le.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function Oo(n, e) {
  let t = n.replace(Le.findPipe, (s, o, a) => {
    let u = !1, l = o;
    for (; --l >= 0 && a[l] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), r = t.split(Le.splitPipe), i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; i < r.length; i++) r[i] = r[i].trim().replace(Le.slashPipe, "|");
  return r;
}
function Et(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function Do(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && Le.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function _d(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function xd(n, e = 0) {
  let t = e, r = "";
  for (let i of n) if (i === "	") {
    let s = 4 - t % 4;
    r += " ".repeat(s), t += s;
  } else r += i, t++;
  return r;
}
function Lo(n, e, t, r, i) {
  let s = e.href, o = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let u = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: s, title: o, text: a, tokens: r.inlineTokens(a) };
  return r.state.inLink = !1, u;
}
function Ed(n, e, t) {
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
var Mr = class {
  options;
  rules;
  lexer;
  constructor(e) {
    this.options = e || Jt;
  }
  space(e) {
    let t = this.rules.block.newline.exec(e);
    if (t && t[0].length > 0) return { type: "space", raw: t[0] };
  }
  code(e) {
    let t = this.rules.block.code.exec(e);
    if (t) {
      let r = this.options.pedantic ? t[0] : Do(t[0]), i = r.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r, codeBlockStyle: "indented", text: i };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let r = t[0], i = Ed(r, t[3] || "", this.rules);
      return { type: "code", raw: r, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let r = t[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = Et(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: Et(t[0], `
`), depth: t[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: Et(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let r = Et(t[0], `
`).split(`
`), i = "", s = "", o = [];
      for (; r.length > 0; ) {
        let a = !1, u = [], l;
        for (l = 0; l < r.length; l++) if (this.rules.other.blockquoteStart.test(r[l])) u.push(r[l]), a = !0;
        else if (!a) u.push(r[l]);
        else break;
        r = r.slice(l);
        let c = u.join(`
`), d = c.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${c}` : c, s = s ? `${s}
${d}` : d;
        let f = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(d, o, !0), this.lexer.state.top = f, r.length === 0) break;
        let p = o.at(-1);
        if (p?.type === "code") break;
        if (p?.type === "blockquote") {
          let m = p, v = r.join(`
`), y = m.raw + `
` + v.replace(this.rules.other.blockquoteSetextReplace2, ""), T = this.blockquote(y);
          o[o.length - 1] = T, i = `${i}
${v}`, s = s.substring(0, s.length - m.text.length) + T.text;
          break;
        } else if (p?.type === "list") {
          let m = p, v = m.raw + `
` + r.join(`
`), y = this.list(v);
          o[o.length - 1] = y, i = i.substring(0, i.length - p.raw.length) + y.raw, s = s.substring(0, s.length - m.raw.length) + y.raw, r = v.substring(o.at(-1).raw.length).split(`
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
        let l = !1, c = "", d = "";
        if (!(t = o.exec(e)) || this.rules.block.hr.test(e)) break;
        c = t[0], e = e.substring(c.length);
        let f = xd(t[2].split(`
`, 1)[0], t[1].length), p = e.split(`
`, 1)[0], m = !f.trim(), v = 0;
        if (this.options.pedantic ? (v = 2, d = f.trimStart()) : m ? v = t[1].length + 1 : (v = f.search(this.rules.other.nonSpaceChar), v = v > 4 ? 1 : v, d = f.slice(v), v += t[1].length), m && this.rules.other.blankLine.test(p) && (c += p + `
`, e = e.substring(p.length + 1), l = !0), !l) {
          let y = this.rules.other.nextBulletRegex(v), T = this.rules.other.hrRegex(v), S = this.rules.other.fencesBeginRegex(v), E = this.rules.other.headingBeginRegex(v), C = this.rules.other.htmlBeginRegex(v), B = this.rules.other.blockquoteBeginRegex(v);
          for (; e; ) {
            let x = e.split(`
`, 1)[0], _;
            if (p = x, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), _ = p) : _ = p.replace(this.rules.other.tabCharGlobal, "    "), S.test(p) || E.test(p) || C.test(p) || B.test(p) || y.test(p) || T.test(p)) break;
            if (_.search(this.rules.other.nonSpaceChar) >= v || !p.trim()) d += `
` + _.slice(v);
            else {
              if (m || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || S.test(f) || E.test(f) || T.test(f)) break;
              d += `
` + p;
            }
            m = !p.trim(), c += x + `
`, e = e.substring(x.length + 1), f = _.slice(v);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (a = !0)), s.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(d), loose: !1, text: d, tokens: [] }), s.raw += c;
      }
      let u = s.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let l of s.items) if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), !s.loose) {
        let c = l.tokens.filter((f) => f.type === "space"), d = c.length > 0 && c.some((f) => this.rules.other.anyLine.test(f.raw));
        s.loose = d;
      }
      for (let l of s.items) {
        let c = l.tokens[0];
        if (l.task && (c?.type === "text" || c?.type === "paragraph")) {
          l.text = l.text.replace(this.rules.other.listReplaceTask, ""), c.raw = c.raw.replace(this.rules.other.listReplaceTask, ""), c.text = c.text.replace(this.rules.other.listReplaceTask, "");
          for (let f = this.lexer.inlineQueue.length - 1; f >= 0; f--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)) {
            this.lexer.inlineQueue[f].src = this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask, "");
            break;
          }
          let d = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (d) {
            let f = { type: "checkbox", raw: d[0] + " ", checked: d[0] !== "[ ]" };
            l.checked = f.checked, s.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = f.raw + l.tokens[0].raw, l.tokens[0].text = f.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(f)) : l.tokens.unshift({ type: "paragraph", raw: f.raw, text: f.raw, tokens: [f] }) : l.tokens.unshift(f);
          }
        } else l.task && (l.task = !1);
      }
      if (s.loose) for (let l of s.items) {
        l.loose = !0;
        for (let c of l.tokens) c.type === "text" && (c.type = "paragraph");
      }
      return s;
    }
  }
  html(e) {
    let t = this.rules.block.html.exec(e);
    if (t) {
      let r = Do(t[0]);
      return { type: "html", block: !0, raw: r, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: r };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let r = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: r, raw: Et(t[0], `
`), href: i, title: s };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let r = Oo(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: Et(t[0], `
`), header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? o.align.push("left") : o.align.push(null);
      for (let a = 0; a < r.length; a++) o.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: o.align[a] });
      for (let a of s) o.rows.push(Oo(a, o.header.length).map((u, l) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: o.align[l] })));
      return o;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let r = t[1].trim();
      return { type: "heading", raw: Et(t[0], `
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
        let o = Et(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = _d(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), Lo(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return Lo(r, s, r[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[3]) || !r || this.rules.inline.punctuation.exec(r))) {
      let s = [...i[0]].length - 1, o, a, u = s, l = 0, c = i[0][0], d = r === c, f = c === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (f.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = f.exec(t)) !== null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o) continue;
        if (a = [...o].length, i[3] || i[4]) {
          u += a;
          continue;
        } else if (i[5] || i[6]) {
          if (s % 3 && !((s + a) % 3)) {
            l += a;
            continue;
          }
          if (d) break;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u + l);
        let p = [...i[0]][0].length, m = e.slice(0, s + i.index + p + a);
        if (Math.min(s, a) % 2) {
          let y = m.slice(1, -1);
          return { type: "em", raw: m, text: y, tokens: this.lexer.inlineTokens(y) };
        }
        let v = m.slice(2, -2);
        return { type: "strong", raw: m, text: v, tokens: this.lexer.inlineTokens(v) };
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
      let s = [...i[0]].length - 1, o, a, u = s, l = this.rules.inline.delRDelim;
      for (l.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = l.exec(t)) !== null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o || (a = [...o].length, a !== s)) continue;
        if (i[3] || i[4]) {
          u += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u);
        let c = [...i[0]][0].length, d = e.slice(0, s + i.index + c + a), f = d.slice(s, -s);
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
}, it = class Ui {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Jt, this.options.tokenizer = this.options.tokenizer || new Mr(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: Le, block: vr.normal, inline: Dn.normal };
    this.options.pedantic ? (t.block = vr.pedantic, t.inline = Dn.pedantic) : this.options.gfm && (t.block = vr.gfm, this.options.breaks ? t.inline = Dn.breaks : t.inline = Dn.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: vr, inline: Dn };
  }
  static lex(e, t) {
    return new Ui(t).lex(e);
  }
  static lexInline(e, t) {
    return new Ui(t).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(Le.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let t = 0; t < this.inlineQueue.length; t++) {
      let r = this.inlineQueue[t];
      this.inlineTokens(r.src, r.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, t = [], r = !1) {
    this.tokenizer.lexer = this, this.options.pedantic && (e = e.replace(Le.tabCharGlobal, "    ").replace(Le.spaceLine, ""));
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
        let a = 1 / 0, u = e.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, u), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
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
    let r = e;
    if (this.tokens.links) {
      let a = Object.keys(this.tokens.links);
      a.length > 0 && (r = r.replace(this.tokenizer.rules.inline.reflinkSearch, (u) => a.includes(u.slice(u.lastIndexOf("[") + 1, -1)) ? "[" + "a".repeat(u.length - 2) + "]" : u));
    }
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, (a) => "+".repeat(a.length)), r = r.replace(this.tokenizer.rules.inline.blockSkip, (a, u, l) => {
      let c = l ? l.length : 0;
      return a.slice(0, c) + "[" + "a".repeat(a.length - c - 2) + "]";
    }), r = this.options.hooks?.emStrongMask?.call({ lexer: this }, r) ?? r;
    let i = !1, s = "", o = 1 / 0;
    for (; e; ) {
      if (e.length < o) o = e.length;
      else {
        this.infiniteLoopError(e.charCodeAt(0));
        break;
      }
      i || (s = ""), i = !1;
      let a;
      if (this.options.extensions?.inline?.some((l) => (a = l.call({ lexer: this }, e, t)) ? (e = e.substring(a.raw.length), t.push(a), !0) : !1)) continue;
      if (a = this.tokenizer.escape(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.tag(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.link(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(a.raw.length);
        let l = t.at(-1);
        a.type === "text" && l?.type === "text" ? (l.raw += a.raw, l.text += a.text) : t.push(a);
        continue;
      }
      if (a = this.tokenizer.emStrong(e, r, s)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.codespan(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.br(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.del(e, r, s)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (a = this.tokenizer.autolink(e)) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      if (!this.state.inLink && (a = this.tokenizer.url(e))) {
        e = e.substring(a.raw.length), t.push(a);
        continue;
      }
      let u = e;
      if (this.options.extensions?.startInline) {
        let l = 1 / 0, c = e.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, c), typeof d == "number" && d >= 0 && (l = Math.min(l, d));
        }), l < 1 / 0 && l >= 0 && (u = e.substring(0, l + 1));
      }
      if (a = this.tokenizer.inlineText(u)) {
        e = e.substring(a.raw.length), a.raw.slice(-1) !== "_" && (s = a.raw.slice(-1)), i = !0;
        let l = t.at(-1);
        l?.type === "text" ? (l.raw += a.raw, l.text += a.text) : t.push(a);
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
}, Or = class {
  options;
  parser;
  constructor(n) {
    this.options = n || Jt;
  }
  space(n) {
    return "";
  }
  code({ text: n, lang: e, escaped: t }) {
    let r = (e || "").match(Le.notSpaceStart)?.[0], i = n.replace(Le.endingNewline, "") + `
`;
    return r ? '<pre><code class="language-' + dt(r) + '">' + (t ? i : dt(i, !0)) + `</code></pre>
` : "<pre><code>" + (t ? i : dt(i, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: n }) {
    return `<blockquote>
${this.parser.parse(n)}</blockquote>
`;
  }
  html({ text: n }) {
    return n;
  }
  def(n) {
    return "";
  }
  heading({ tokens: n, depth: e }) {
    return `<h${e}>${this.parser.parseInline(n)}</h${e}>
`;
  }
  hr(n) {
    return `<hr>
`;
  }
  list(n) {
    let e = n.ordered, t = n.start, r = "";
    for (let o = 0; o < n.items.length; o++) {
      let a = n.items[o];
      r += this.listitem(a);
    }
    let i = e ? "ol" : "ul", s = e && t !== 1 ? ' start="' + t + '"' : "";
    return "<" + i + s + `>
` + r + "</" + i + `>
`;
  }
  listitem(n) {
    return `<li>${this.parser.parse(n.tokens)}</li>
`;
  }
  checkbox({ checked: n }) {
    return "<input " + (n ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: n }) {
    return `<p>${this.parser.parseInline(n)}</p>
`;
  }
  table(n) {
    let e = "", t = "";
    for (let i = 0; i < n.header.length; i++) t += this.tablecell(n.header[i]);
    e += this.tablerow({ text: t });
    let r = "";
    for (let i = 0; i < n.rows.length; i++) {
      let s = n.rows[i];
      t = "";
      for (let o = 0; o < s.length; o++) t += this.tablecell(s[o]);
      r += this.tablerow({ text: t });
    }
    return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + r + `</table>
`;
  }
  tablerow({ text: n }) {
    return `<tr>
${n}</tr>
`;
  }
  tablecell(n) {
    let e = this.parser.parseInline(n.tokens), t = n.header ? "th" : "td";
    return (n.align ? `<${t} align="${n.align}">` : `<${t}>`) + e + `</${t}>
`;
  }
  strong({ tokens: n }) {
    return `<strong>${this.parser.parseInline(n)}</strong>`;
  }
  em({ tokens: n }) {
    return `<em>${this.parser.parseInline(n)}</em>`;
  }
  codespan({ text: n }) {
    return `<code>${dt(n, !0)}</code>`;
  }
  br(n) {
    return "<br>";
  }
  del({ tokens: n }) {
    return `<del>${this.parser.parseInline(n)}</del>`;
  }
  link({ href: n, title: e, tokens: t }) {
    let r = this.parser.parseInline(t), i = Mo(n);
    if (i === null) return r;
    n = i;
    let s = '<a href="' + n + '"';
    return e && (s += ' title="' + dt(e) + '"'), s += ">" + r + "</a>", s;
  }
  image({ href: n, title: e, text: t, tokens: r }) {
    r && (t = this.parser.parseInline(r, this.parser.textRenderer));
    let i = Mo(n);
    if (i === null) return dt(t);
    n = i;
    let s = `<img src="${n}" alt="${dt(t)}"`;
    return e && (s += ` title="${dt(e)}"`), s += ">", s;
  }
  text(n) {
    return "tokens" in n && n.tokens ? this.parser.parseInline(n.tokens) : "escaped" in n && n.escaped ? n.text : dt(n.text);
  }
}, bs = class {
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
}, st = class ji {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Jt, this.options.renderer = this.options.renderer || new Or(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new bs();
  }
  static parse(e, t) {
    return new ji(t).parse(e);
  }
  static parseInline(e, t) {
    return new ji(t).parseInline(e);
  }
  parse(e) {
    this.renderer.parser = this;
    let t = "";
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.options.extensions?.renderers?.[i.type]) {
        let o = i, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (a !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "checkbox", "html", "def", "paragraph", "text"].includes(o.type)) {
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
        if (a !== !1 || !["escape", "html", "link", "image", "checkbox", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
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
}, zn = class {
  options;
  block;
  constructor(e) {
    this.options = e || Jt;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(e) {
    return e;
  }
  postprocess(e) {
    return e;
  }
  processAllTokens(e) {
    return e;
  }
  emStrongMask(e) {
    return e;
  }
  provideLexer(e = this.block) {
    return e ? it.lex : it.lexInline;
  }
  provideParser(e = this.block) {
    return e ? st.parse : st.parseInline;
  }
}, Cd = class {
  defaults = fs();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = st;
  Renderer = Or;
  TextRenderer = bs;
  Lexer = it;
  Tokenizer = Mr;
  Hooks = zn;
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
        let i = this.defaults.renderer || new Or(this.defaults);
        for (let s in t.renderer) {
          if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let o = s, a = t.renderer[o], u = i[o];
          i[o] = (...l) => {
            let c = a.apply(i, l);
            return c === !1 && (c = u.apply(i, l)), c || "";
          };
        }
        r.renderer = i;
      }
      if (t.tokenizer) {
        let i = this.defaults.tokenizer || new Mr(this.defaults);
        for (let s in t.tokenizer) {
          if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let o = s, a = t.tokenizer[o], u = i[o];
          i[o] = (...l) => {
            let c = a.apply(i, l);
            return c === !1 && (c = u.apply(i, l)), c;
          };
        }
        r.tokenizer = i;
      }
      if (t.hooks) {
        let i = this.defaults.hooks || new zn();
        for (let s in t.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o = s, a = t.hooks[o], u = i[o];
          zn.passThroughHooks.has(s) ? i[o] = (l) => {
            if (this.defaults.async && zn.passThroughHooksRespectAsync.has(s)) return (async () => {
              let d = await a.call(i, l);
              return u.call(i, d);
            })();
            let c = a.call(i, l);
            return u.call(i, c);
          } : i[o] = (...l) => {
            if (this.defaults.async) return (async () => {
              let d = await a.apply(i, l);
              return d === !1 && (d = await u.apply(i, l)), d;
            })();
            let c = a.apply(i, l);
            return c === !1 && (c = u.apply(i, l)), c;
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
    return it.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return st.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, i = { ...this.defaults, ...r }, s = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = n), i.async) return (async () => {
        let o = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(n) : n ? it.lex : it.lexInline)(o, i), u = i.hooks ? await i.hooks.processAllTokens(a) : a;
        i.walkTokens && await Promise.all(this.walkTokens(u, i.walkTokens));
        let l = await (i.hooks ? await i.hooks.provideParser(n) : n ? st.parse : st.parseInline)(u, i);
        return i.hooks ? await i.hooks.postprocess(l) : l;
      })().catch(s);
      try {
        i.hooks && (e = i.hooks.preprocess(e));
        let o = (i.hooks ? i.hooks.provideLexer(n) : n ? it.lex : it.lexInline)(e, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let a = (i.hooks ? i.hooks.provideParser(n) : n ? st.parse : st.parseInline)(o, i);
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
        let r = "<p>An error occurred:</p><pre>" + dt(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Kt = new Cd();
function ce(n, e) {
  return Kt.parse(n, e);
}
ce.options = ce.setOptions = function(n) {
  return Kt.setOptions(n), ce.defaults = Kt.defaults, Ya(ce.defaults), ce;
};
ce.getDefaults = fs;
ce.defaults = Jt;
function Ad(...n) {
  return Kt.use(...n), ce.defaults = Kt.defaults, Ya(ce.defaults), ce;
}
ce.use = Ad;
ce.walkTokens = function(n, e) {
  return Kt.walkTokens(n, e);
};
ce.parseInline = Kt.parseInline;
ce.Parser = st;
ce.parser = st.parse;
ce.Renderer = Or;
ce.TextRenderer = bs;
ce.Lexer = it;
ce.lexer = it.lex;
ce.Tokenizer = Mr;
ce.Hooks = zn;
ce.parse = ce;
ce.options;
ce.setOptions;
ce.walkTokens;
ce.parseInline;
st.parse;
it.lex;
function $o(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, r = Array(e); t < e; t++) r[t] = n[t];
  return r;
}
function Id(n) {
  if (Array.isArray(n)) return n;
}
function Rd(n, e) {
  var t = n == null ? null : typeof Symbol < "u" && n[Symbol.iterator] || n["@@iterator"];
  if (t != null) {
    var r, i, s, o, a = [], u = !0, l = !1;
    try {
      if (s = (t = t.call(n)).next, e !== 0) for (; !(u = (r = s.call(t)).done) && (a.push(r.value), a.length !== e); u = !0) ;
    } catch (c) {
      l = !0, i = c;
    } finally {
      try {
        if (!u && t.return != null && (o = t.return(), Object(o) !== o)) return;
      } finally {
        if (l) throw i;
      }
    }
    return a;
  }
}
function Pd() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Md(n, e) {
  return Id(n) || Rd(n, e) || Od(n, e) || Pd();
}
function Od(n, e) {
  if (n) {
    if (typeof n == "string") return $o(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? $o(n, e) : void 0;
  }
}
const ol = Object.entries, No = Object.setPrototypeOf, Dd = Object.isFrozen, Ld = Object.getPrototypeOf, $d = Object.getOwnPropertyDescriptor;
let Ae = Object.freeze, Re = Object.seal, vn = Object.create, al = typeof Reflect < "u" && Reflect, Ki = al.apply, Gi = al.construct;
Ae || (Ae = function(e) {
  return e;
});
Re || (Re = function(e) {
  return e;
});
Ki || (Ki = function(e, t) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++)
    i[s - 2] = arguments[s];
  return e.apply(t, i);
});
Gi || (Gi = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    r[i - 1] = arguments[i];
  return new e(...r);
});
const qt = xe(Array.prototype.forEach), Nd = xe(Array.prototype.lastIndexOf), Bo = xe(Array.prototype.pop), Ln = xe(Array.prototype.push), Bd = xe(Array.prototype.splice), bn = Array.isArray, Fn = xe(String.prototype.toLowerCase), yi = xe(String.prototype.toString), zo = xe(String.prototype.match), $n = xe(String.prototype.replace), Fo = xe(String.prototype.indexOf), zd = xe(String.prototype.trim), Fd = xe(Number.prototype.toString), qd = xe(Boolean.prototype.toString), qo = typeof BigInt > "u" ? null : xe(BigInt.prototype.toString), Vo = typeof Symbol > "u" ? null : xe(Symbol.prototype.toString), He = xe(Object.prototype.hasOwnProperty), Nn = xe(Object.prototype.toString), Oe = xe(RegExp.prototype.test), Ft = Vd(TypeError);
function xe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      r[i - 1] = arguments[i];
    return Ki(n, e, r);
  };
}
function Vd(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    return Gi(n, t);
  };
}
function ue(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Fn;
  if (No && No(n, null), !bn(e))
    return n;
  let r = e.length;
  for (; r--; ) {
    let i = e[r];
    if (typeof i == "string") {
      const s = t(i);
      s !== i && (Dd(e) || (e[r] = s), i = s);
    }
    n[i] = !0;
  }
  return n;
}
function Hd(n) {
  for (let e = 0; e < n.length; e++)
    He(n, e) || (n[e] = null);
  return n;
}
function Ye(n) {
  const e = vn(null);
  for (const r of ol(n)) {
    var t = Md(r, 2);
    const i = t[0], s = t[1];
    He(n, i) && (bn(s) ? e[i] = Hd(s) : s && typeof s == "object" && s.constructor === Object ? e[i] = Ye(s) : e[i] = s);
  }
  return e;
}
function Wd(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Fd(n);
    case "boolean":
      return qd(n);
    case "bigint":
      return qo ? qo(n) : "0";
    case "symbol":
      return Vo ? Vo(n) : "Symbol()";
    case "undefined":
      return Nn(n);
    case "function":
    case "object": {
      if (n === null)
        return Nn(n);
      const e = n, t = rt(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : Nn(r);
      }
      return Nn(n);
    }
    default:
      return Nn(n);
  }
}
function rt(n, e) {
  for (; n !== null; ) {
    const r = $d(n, e);
    if (r) {
      if (r.get)
        return xe(r.get);
      if (typeof r.value == "function")
        return xe(r.value);
    }
    n = Ld(n);
  }
  function t() {
    return null;
  }
  return t;
}
function Ud(n) {
  try {
    return Oe(n, ""), !0;
  } catch {
    return !1;
  }
}
const Ho = Ae(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), bi = Ae(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), ki = Ae(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), jd = Ae(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), wi = Ae(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Kd = Ae(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Wo = Ae(["#text"]), Uo = Ae(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), Si = Ae(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "pointer-events", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "vector-effect", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), jo = Ae(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), gr = Ae(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Gd = Re(/{{[\w\W]*|^[\w\W]*}}/g), Xd = Re(/<%[\w\W]*|^[\w\W]*%>/g), Yd = Re(/\${[\w\W]*/g), Zd = Re(/^data-[\-\w.\u00B7-\uFFFF]+$/), Qd = Re(/^aria-[\-\w]+$/), Ko = Re(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Jd = Re(/^(?:\w+script|data):/i), ef = Re(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), tf = Re(/^html$/i), nf = Re(/^[a-z][.\w]*(-[.\w]+)+$/i), Go = Re(/<[/\w!]/g), Xo = Re(/<[/\w]/g), rf = Re(/<\/no(script|embed|frames)/i), sf = Re(/\/>/i), Xe = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
}, ll = ["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"], of = Ae(ue({}, ll)), af = (function() {
  const n = {};
  return qt(ll, (e) => {
    n[e] = Re(new RegExp("</" + e + "(?=[\\t\\n\\f\\r />])", "i"));
  }), Ae(n);
})(), lf = function() {
  return typeof window > "u" ? null : window;
}, uf = function(e, t) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let r = null;
  const i = "data-tt-policy-suffix";
  t && t.hasAttribute(i) && (r = t.getAttribute(i));
  const s = "dompurify" + (r ? "#" + r : "");
  try {
    return e.createPolicy(s, {
      createHTML(o) {
        return o;
      },
      createScriptURL(o) {
        return o;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + s + " could not be created."), null;
  }
}, Yo = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, Ct = function(e, t, r, i) {
  return He(e, t) && bn(e[t]) ? ue(i.base ? Ye(i.base) : {}, e[t], i.transform) : r;
}, Ti = function(e, t, r) {
  const i = He(e, t) ? e[t] : void 0;
  return i && typeof i == "object" ? Ye(i) : r();
};
function ul() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : lf();
  const e = (U) => ul(U);
  if (e.version = "3.4.14", e.removed = [], !n || !n.document || n.document.nodeType !== Xe.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, i = r.currentScript;
  n.DocumentFragment;
  const s = n.HTMLTemplateElement, o = n.Node, a = n.Element, u = n.NodeFilter, l = n.NamedNodeMap;
  l === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const c = n.DOMParser, d = n.trustedTypes, f = a.prototype, p = rt(f, "cloneNode"), m = rt(f, "remove"), v = rt(f, "nextSibling"), y = rt(f, "childNodes"), T = rt(f, "parentNode"), S = rt(f, "shadowRoot"), E = rt(f, "attributes"), C = o && o.prototype ? rt(o.prototype, "nodeType") : null, B = o && o.prototype ? rt(o.prototype, "nodeName") : null, x = o && o.prototype ? rt(o.prototype, "ownerDocument") : null, _ = function(g) {
    return C ? C(g) : g.nodeType;
  }, w = function(g) {
    return B ? B(g) : g.nodeName;
  };
  if (typeof s == "function") {
    const U = t.createElement("template");
    U.content && U.content.ownerDocument && (t = U.content.ownerDocument);
  }
  let b, R = "", D, H = !1, L = 0;
  const O = function() {
    if (L > 0)
      throw Ft('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, P = function(g) {
    O(), L++;
    try {
      return b.createHTML(g);
    } finally {
      L--;
    }
  }, W = function(g) {
    O(), L++;
    try {
      return b.createScriptURL(g);
    } finally {
      L--;
    }
  }, X = function() {
    return H || (D = uf(d, i), H = !0), D;
  }, ie = t, se = ie.implementation, be = ie.createNodeIterator, Ke = ie.createDocumentFragment, $t = ie.getElementsByTagName, sn = r.importNode;
  let fe = Yo();
  e.isSupported = typeof ol == "function" && typeof T == "function" && se && se.createHTMLDocument !== void 0;
  const tr = Gd, ti = Xd, nr = Yd, ni = Zd, Rn = Qd, ri = Jd, rr = ef, ii = nf;
  let Pn = Ko, pe = null;
  const Y = ue({}, [...Ho, ...bi, ...ki, ...wi, ...Wo]);
  let J = null;
  const Ee = ue({}, [...Uo, ...Si, ...jo, ...gr]);
  let Ie = Object.seal(vn(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Ge = null, Tt = null;
  const Ce = Object.seal(vn(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Zs = !0, si = !0, Qs = !1, Js = !0, _t = !1, Nt = !0, Bt = !1, oi = !1, ir = null, sr = null, ai = !1, on = !1, or = !1, ar = !1, eo = !0, to = !1;
  const no = "user-content-";
  let li = !0, ui = !1, an = {}, ln = null;
  const ro = ue({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let io = null;
  const so = ue({}, ["audio", "video", "img", "source", "image", "track"]);
  let oo = null;
  const ao = ue({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), lr = "http://www.w3.org/1998/Math/MathML", ur = "http://www.w3.org/2000/svg", ut = "http://www.w3.org/1999/xhtml";
  let un = ut, ci = !1, di = null;
  const Hu = ue({}, [lr, ur, ut], yi), lo = Ae(["mi", "mo", "mn", "ms", "mtext"]);
  let fi = ue({}, lo);
  const uo = Ae(["annotation-xml"]);
  let pi = ue({}, uo);
  const Wu = ue({}, ["title", "style", "font", "a", "script"]);
  let Mn = null;
  const Uu = ["application/xhtml+xml", "text/html"], ju = "text/html";
  let we = null, cn = null;
  const Ku = t.createElement("form"), co = function(g) {
    return g instanceof RegExp || g instanceof Function;
  }, hi = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (cn && cn === g)
      return;
    (!g || typeof g != "object") && (g = {}), g = Ye(g), Mn = // eslint-disable-next-line unicorn/prefer-includes
    Uu.indexOf(g.PARSER_MEDIA_TYPE) === -1 ? ju : g.PARSER_MEDIA_TYPE, we = Mn === "application/xhtml+xml" ? yi : Fn, pe = Ct(g, "ALLOWED_TAGS", Y, {
      transform: we
    }), J = Ct(g, "ALLOWED_ATTR", Ee, {
      transform: we
    }), di = Ct(g, "ALLOWED_NAMESPACES", Hu, {
      transform: yi
    }), oo = Ct(g, "ADD_URI_SAFE_ATTR", ao, {
      transform: we,
      base: ao
    }), io = Ct(g, "ADD_DATA_URI_TAGS", so, {
      transform: we,
      base: so
    }), ln = Ct(g, "FORBID_CONTENTS", ro, {
      transform: we
    }), Ge = Ct(g, "FORBID_TAGS", Ye({}), {
      transform: we
    }), Tt = Ct(g, "FORBID_ATTR", Ye({}), {
      transform: we
    }), an = He(g, "USE_PROFILES") ? g.USE_PROFILES && typeof g.USE_PROFILES == "object" ? Ye(g.USE_PROFILES) : g.USE_PROFILES : !1, Zs = g.ALLOW_ARIA_ATTR !== !1, si = g.ALLOW_DATA_ATTR !== !1, Qs = g.ALLOW_UNKNOWN_PROTOCOLS || !1, Js = g.ALLOW_SELF_CLOSE_IN_ATTR !== !1, _t = g.SAFE_FOR_TEMPLATES || !1, Nt = g.SAFE_FOR_XML !== !1, Bt = g.WHOLE_DOCUMENT || !1, on = g.RETURN_DOM || !1, or = g.RETURN_DOM_FRAGMENT || !1, ar = g.RETURN_TRUSTED_TYPE || !1, ai = g.FORCE_BODY || !1, eo = g.SANITIZE_DOM !== !1, to = g.SANITIZE_NAMED_PROPS || !1, li = g.KEEP_CONTENT !== !1, ui = g.IN_PLACE || !1, Pn = Ud(g.ALLOWED_URI_REGEXP) ? g.ALLOWED_URI_REGEXP : Ko, un = typeof g.NAMESPACE == "string" ? g.NAMESPACE : ut, fi = Ti(
      g,
      "MATHML_TEXT_INTEGRATION_POINTS",
      () => ue({}, lo)
      // Default built-in map
    ), pi = Ti(
      g,
      "HTML_INTEGRATION_POINTS",
      () => ue({}, uo)
      // Default built-in map
    );
    const I = Ti(g, "CUSTOM_ELEMENT_HANDLING", () => vn(null));
    if (Ie = vn(null), He(I, "tagNameCheck") && co(I.tagNameCheck) && (Ie.tagNameCheck = I.tagNameCheck), He(I, "attributeNameCheck") && co(I.attributeNameCheck) && (Ie.attributeNameCheck = I.attributeNameCheck), He(I, "allowCustomizedBuiltInElements") && typeof I.allowCustomizedBuiltInElements == "boolean" && (Ie.allowCustomizedBuiltInElements = I.allowCustomizedBuiltInElements), Re(Ie), _t && (si = !1), or && (on = !0), an && (pe = ue({}, Wo), J = vn(null), an.html === !0 && (ue(pe, Ho), ue(J, Uo)), an.svg === !0 && (ue(pe, bi), ue(J, Si), ue(J, gr)), an.svgFilters === !0 && (ue(pe, ki), ue(J, Si), ue(J, gr)), an.mathMl === !0 && (ue(pe, wi), ue(J, jo), ue(J, gr))), Ce.tagCheck = null, Ce.attributeCheck = null, He(g, "ADD_TAGS") && (typeof g.ADD_TAGS == "function" ? Ce.tagCheck = g.ADD_TAGS : bn(g.ADD_TAGS) && (pe === Y && (pe = Ye(pe)), ue(pe, g.ADD_TAGS, we))), He(g, "ADD_ATTR") && (typeof g.ADD_ATTR == "function" ? Ce.attributeCheck = g.ADD_ATTR : bn(g.ADD_ATTR) && (J === Ee && (J = Ye(J)), ue(J, g.ADD_ATTR, we))), He(g, "ADD_FORBID_CONTENTS") && bn(g.ADD_FORBID_CONTENTS) && (ln === ro && (ln = Ye(ln)), ue(ln, g.ADD_FORBID_CONTENTS, we)), li && (pe["#text"] = !0), Bt && ue(pe, ["html", "head", "body"]), pe.table && (ue(pe, ["tbody"]), delete Ge.tbody), g.TRUSTED_TYPES_POLICY) {
      if (typeof g.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw Ft('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof g.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw Ft('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const F = b;
      b = g.TRUSTED_TYPES_POLICY;
      try {
        R = P("");
      } catch (Z) {
        throw b = F, Z;
      }
    } else g.TRUSTED_TYPES_POLICY === null ? (b = void 0, R = "") : (b === void 0 && (b = X()), b && typeof R == "string" && (R = P("")));
    Ae && Ae(g), cn = g;
  }, fo = ue({}, [...bi, ...ki, ...jd]), po = ue({}, [...wi, ...Kd]), Gu = function(g, I, F) {
    return I.namespaceURI === ut ? g === "svg" : I.namespaceURI === lr ? g === "svg" && (F === "annotation-xml" || fi[F]) : !!fo[g];
  }, Xu = function(g, I, F) {
    return I.namespaceURI === ut ? g === "math" : I.namespaceURI === ur ? g === "math" && pi[F] : !!po[g];
  }, Yu = function(g, I, F) {
    return I.namespaceURI === ur && !pi[F] || I.namespaceURI === lr && !fi[F] ? !1 : !po[g] && (Wu[g] || !fo[g]);
  }, Zu = function(g) {
    let I = T(g);
    (!I || !I.tagName) && (I = {
      namespaceURI: un,
      tagName: "template"
    });
    const F = Fn(g.tagName), Z = Fn(I.tagName);
    return di[g.namespaceURI] ? g.namespaceURI === ur ? Gu(F, I, Z) : g.namespaceURI === lr ? Xu(F, I, Z) : g.namespaceURI === ut ? Yu(F, I, Z) : !!(Mn === "application/xhtml+xml" && di[g.namespaceURI]) : !1;
  }, xt = function(g) {
    Ln(e.removed, {
      element: g
    });
    try {
      T(g).removeChild(g);
    } catch {
      if (m(g), !T(g))
        throw Ft("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, ho = function(g, I, F) {
    try {
      g.removeAttributeNode(I);
    } catch {
      try {
        g.removeAttribute(F);
      } catch {
      }
    }
  }, cr = function(g) {
    dr(g);
    const I = y(g);
    if (I) {
      const Z = [];
      qt(I, (ee) => {
        Ln(Z, ee);
      }), qt(Z, (ee) => {
        try {
          m(ee);
        } catch {
        }
      });
    }
    const F = E(g);
    if (F)
      for (let Z = F.length - 1; Z >= 0; --Z) {
        const ee = F[Z], te = ee && ee.name;
        typeof te == "string" && ho(g, ee, te);
      }
  }, zt = function(g, I, F) {
    if (!F)
      try {
        F = I.getAttributeNode(g);
      } catch {
        F = null;
      }
    Ln(e.removed, {
      attribute: F || null,
      from: I
    });
    try {
      F ? I.removeAttributeNode(F) : I.removeAttribute(g);
    } catch {
      try {
        I.removeAttribute(g);
      } catch {
      }
    }
    if (g === "is")
      if (on || or)
        try {
          xt(I);
        } catch {
        }
      else
        try {
          I.setAttribute(g, "");
        } catch {
        }
  }, Qu = function(g) {
    const I = E(g);
    if (I)
      for (let F = I.length - 1; F >= 0; --F) {
        const Z = I[F], ee = Z && Z.name;
        typeof ee != "string" || J[we(ee)] || ho(g, Z, ee);
      }
  }, dr = function(g) {
    const I = [g];
    for (; I.length > 0; ) {
      const F = I.pop();
      _(F) === Xe.element && Qu(F);
      const ee = y(F);
      if (ee)
        for (let te = ee.length - 1; te >= 0; --te)
          I.push(ee[te]);
    }
  }, mo = function(g, I) {
    return Nt ? g === "patchsrc" ? !0 : g === "for" && I !== "label" && I !== "output" : !1;
  }, Ju = function(g) {
    if (!Nt)
      return;
    const I = [g];
    for (; I.length > 0; ) {
      const F = I.pop(), Z = _(F);
      if (Z === Xe.processingInstruction || Z === Xe.comment && Oe(Xo, F.data)) {
        try {
          m(F);
        } catch {
        }
        continue;
      }
      if (Z === Xe.element) {
        const te = F, he = we(w(F));
        try {
          te.hasAttribute && te.hasAttribute("patchsrc") && te.removeAttribute("patchsrc"), te.hasAttribute && te.hasAttribute("for") && mo("for", he) && te.removeAttribute("for");
        } catch {
        }
      }
      const ee = y(F);
      if (ee)
        for (let te = ee.length - 1; te >= 0; --te)
          I.push(ee[te]);
    }
  }, vo = function(g) {
    let I = null, F = null;
    if (ai)
      g = "<remove></remove>" + g;
    else {
      const te = zo(g, /^[\r\n\t ]+/);
      F = te && te[0];
    }
    Mn === "application/xhtml+xml" && un === ut && (g = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + g + "</body></html>");
    const Z = b ? P(g) : g;
    if (un === ut)
      try {
        I = new c().parseFromString(Z, Mn);
      } catch {
      }
    if (!I || !I.documentElement) {
      I = se.createDocument(un, "template", null);
      try {
        I.documentElement.innerHTML = ci ? R : Z;
      } catch {
      }
    }
    const ee = I.body || I.documentElement;
    return g && F && ee.insertBefore(t.createTextNode(F), ee.childNodes[0] || null), un === ut ? $t.call(I, Bt ? "html" : "body")[0] : Bt ? I.documentElement : ee;
  }, go = function(g) {
    const I = x ? x(g) : g.ownerDocument;
    return be.call(
      I || g,
      g,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, fr = function(g) {
    return g = $n(g, tr, " "), g = $n(g, ti, " "), g = $n(g, nr, " "), g;
  }, mi = function(g) {
    var I;
    g.normalize();
    const F = x ? x(g) : g.ownerDocument, Z = be.call(
      F || g,
      g,
      // eslint-disable-next-line no-bitwise
      u.SHOW_TEXT | u.SHOW_COMMENT | u.SHOW_CDATA_SECTION | u.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let ee = Z.nextNode();
    for (; ee; )
      ee.data = fr(ee.data), ee = Z.nextNode();
    const te = (I = g.querySelectorAll) === null || I === void 0 ? void 0 : I.call(g, "template");
    te && qt(te, (he) => {
      dn(he.content) && mi(he.content);
    });
  }, pr = function(g) {
    const I = B ? B(g) : null;
    return typeof I != "string" || we(I) !== "form" ? !1 : typeof g.nodeName != "string" || typeof g.textContent != "string" || typeof g.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    g.attributes !== E(g) || typeof g.removeAttribute != "function" || typeof g.setAttribute != "function" || typeof g.namespaceURI != "string" || typeof g.insertBefore != "function" || typeof g.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    g.nodeType !== C(g) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    g.childNodes !== y(g);
  }, dn = function(g) {
    if (!C || typeof g != "object" || g === null)
      return !1;
    try {
      return C(g) === Xe.documentFragment;
    } catch {
      return !1;
    }
  }, On = function(g) {
    if (!C || typeof g != "object" || g === null)
      return !1;
    try {
      return typeof C(g) == "number";
    } catch {
      return !1;
    }
  };
  function ct(U, g, I) {
    U.length !== 0 && qt(U, (F) => {
      F.call(e, g, I, cn);
    });
  }
  const ec = function(g, I) {
    return !!(Nt && g.hasChildNodes() && !On(g.firstElementChild) && Oe(Go, g.textContent) && Oe(Go, g.innerHTML) || Nt && g.namespaceURI === ut && of[I] && (On(g.firstElementChild) || typeof g.textContent == "string" && Oe(af[I], g.textContent)) || g.nodeType === Xe.processingInstruction || Nt && g.nodeType === Xe.comment && Oe(Xo, g.data));
  }, hr = function(g, I) {
    if (g instanceof RegExp)
      return Oe(g, I);
    if (g instanceof Function) {
      for (var F = arguments.length, Z = new Array(F > 2 ? F - 2 : 0), ee = 2; ee < F; ee++)
        Z[ee - 2] = arguments[ee];
      return !!g(I, ...Z);
    }
    return !1;
  }, tc = function(g, I, F) {
    if (!Ge[I] && So(I) && hr(Ie.tagNameCheck, I))
      return !1;
    if (li && !ln[I]) {
      const Z = T(g), ee = y(g);
      if (ee && Z) {
        const te = ee.length;
        for (let he = te - 1; he >= 0; --he) {
          const ge = g === F ? p(ee[he], !0) : ee[he];
          Z.insertBefore(ge, v(g));
        }
      }
    }
    return xt(g), !0;
  }, yo = function(g, I, F, Z) {
    return g.length === 0 ? I : I === F || I === Z ? Ye(I) : I;
  }, bo = function(g, I) {
    return g === I || T(g) !== null ? !1 : (ui && dr(g), !0);
  }, ko = function(g, I) {
    if (ct(fe.beforeSanitizeElements, g, null), bo(g, I))
      return !0;
    if (pr(g))
      return xt(g), !0;
    const F = we(w(g));
    if (pe = yo(fe.uponSanitizeElement, pe, Y, ir), ct(fe.uponSanitizeElement, g, {
      tagName: F,
      allowedTags: pe
    }), bo(g, I))
      return !0;
    if (ec(g, F))
      return xt(g), !0;
    if (Ge[F] || !(Ce.tagCheck instanceof Function && Ce.tagCheck(F)) && !pe[F]) {
      const ee = tc(g, F, I);
      return ee === !1 && ct(fe.afterSanitizeElements, g, null), ee;
    }
    if (_(g) === Xe.element && !Zu(g) || (F === "noscript" || F === "noembed" || F === "noframes") && Oe(rf, g.innerHTML))
      return xt(g), !0;
    if (_t && g.nodeType === Xe.text) {
      const ee = fr(g.textContent);
      g.textContent !== ee && (Ln(e.removed, {
        element: g.cloneNode()
      }), g.textContent = ee);
    }
    return ct(fe.afterSanitizeElements, g, null), !1;
  }, wo = function(g, I, F) {
    if (Tt[I] || mo(I, g) || eo && (I === "id" || I === "name") && (F in t || F in Ku))
      return !1;
    const Z = J[I] || Ce.attributeCheck instanceof Function && Ce.attributeCheck(I, g);
    return si && Oe(ni, I) || Zs && Oe(Rn, I) ? !0 : Z ? oo[I] || Oe(Pn, $n(F, rr, "")) || (I === "src" || I === "xlink:href" || I === "href") && g !== "script" && Fo(F, "data:") === 0 && io[g] || Qs && !Oe(ri, $n(F, rr, "")) ? !0 : !F : (
      // Condition a) covers a basically valid custom element tag name whose
      // tag passes the configured tagNameCheck and whose attribute name
      // passes the configured attributeNameCheck ...
      So(g) && hr(Ie.tagNameCheck, g) && hr(Ie.attributeNameCheck, I, g) || // Condition b) covers an `is` attribute whose value passes the
      // configured tagNameCheck while customized built-in elements are
      // allowed.
      I === "is" && Ie.allowCustomizedBuiltInElements && hr(Ie.tagNameCheck, F)
    );
  }, nc = ue({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), So = function(g) {
    return !nc[Fn(g)] && Oe(ii, g);
  }, rc = function(g, I, F, Z) {
    if (b && typeof d == "object" && typeof d.getAttributeType == "function" && !F)
      switch (d.getAttributeType(g, I)) {
        case "TrustedHTML":
          return P(Z);
        case "TrustedScriptURL":
          return W(Z);
      }
    return Z;
  }, ic = function(g, I, F, Z) {
    try {
      F ? g.setAttributeNS(F, I, Z) : g.setAttribute(I, Z), pr(g) ? xt(g) : Bo(e.removed);
    } catch {
      zt(I, g);
    }
  }, To = function(g) {
    ct(fe.beforeSanitizeAttributes, g, null);
    const I = g.attributes;
    if (!I || pr(g))
      return;
    J = yo(fe.uponSanitizeAttribute, J, Ee, sr);
    const F = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: J,
      forceKeepAttr: void 0
    };
    let Z = I.length;
    const ee = we(g.nodeName);
    for (; Z--; ) {
      const te = I[Z], he = te.name, ge = te.namespaceURI, Fe = te.value, qe = we(he), gi = Fe;
      let Ne = he === "value" ? gi : zd(gi);
      if (F.attrName = qe, F.attrValue = Ne, F.keepAttr = !0, F.forceKeepAttr = void 0, ct(fe.uponSanitizeAttribute, g, F), Ne = F.attrValue, to && (qe === "id" || qe === "name") && Fo(Ne, no) !== 0 && (zt(he, g, te), Ne = no + Ne), Nt && Oe(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Ne)) {
        zt(he, g, te);
        continue;
      }
      if (qe === "attributename" && zo(Ne, "href")) {
        zt(he, g, te);
        continue;
      }
      if (!F.forceKeepAttr) {
        if (!F.keepAttr) {
          zt(he, g, te);
          continue;
        }
        if (!Js && Oe(sf, Ne)) {
          zt(he, g, te);
          continue;
        }
        if (_t && (Ne = fr(Ne)), !wo(ee, qe, Ne)) {
          zt(he, g, te);
          continue;
        }
        Ne = rc(ee, qe, ge, Ne), Ne !== gi && ic(g, he, ge, Ne);
      }
    }
    ct(fe.afterSanitizeAttributes, g, null);
  }, mr = function(g) {
    let I = null;
    const F = go(g);
    for (ct(fe.beforeSanitizeShadowDOM, g, null); I = F.nextNode(); )
      if (ct(fe.uponSanitizeShadowNode, I, null), ko(I, g), To(I), dn(I.content) && mr(I.content), _(I) === Xe.element) {
        const Z = S(I);
        dn(Z) && (vi(Z), mr(Z));
      }
    ct(fe.afterSanitizeShadowDOM, g, null);
  }, vi = function(g) {
    const I = [{
      node: g,
      shadow: null
    }];
    for (; I.length > 0; ) {
      const F = I.pop();
      if (F.shadow) {
        mr(F.shadow);
        continue;
      }
      const Z = F.node, te = _(Z) === Xe.element, he = y(Z);
      if (he)
        for (let ge = he.length - 1; ge >= 0; --ge)
          I.push({
            node: he[ge],
            shadow: null
          });
      if (te) {
        const ge = B ? B(Z) : null;
        if (typeof ge == "string" && we(ge) === "template") {
          const Fe = Z.content;
          dn(Fe) && I.push({
            node: Fe,
            shadow: null
          });
        }
      }
      if (te) {
        const ge = S(Z);
        dn(ge) && I.push({
          node: null,
          shadow: ge
        }, {
          node: ge,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(U) {
    let g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, I = null, F = null, Z = null, ee = null;
    if (ci = !U, ci && (U = "<!-->"), typeof U != "string" && !On(U) && (U = Wd(U), typeof U != "string"))
      throw Ft("dirty is not a string, aborting");
    if (!e.isSupported)
      return U;
    oi ? (pe = ir, J = sr) : hi(g), (fe.uponSanitizeElement.length > 0 || fe.uponSanitizeAttribute.length > 0) && (pe = Ye(pe)), fe.uponSanitizeAttribute.length > 0 && (J = Ye(J)), e.removed = [];
    const te = ui && typeof U != "string" && On(U);
    if (te) {
      Ju(U);
      const Fe = w(U);
      if (typeof Fe == "string") {
        const qe = we(Fe);
        if (!pe[qe] || Ge[qe])
          throw cr(U), Ft("root node is forbidden and cannot be sanitized in-place");
      }
      if (pr(U))
        throw cr(U), Ft("root node is clobbered and cannot be sanitized in-place");
      try {
        vi(U);
      } catch (qe) {
        throw cr(U), qe;
      }
    } else if (On(U))
      I = vo("<!---->"), F = I.ownerDocument.importNode(U, !0), F.nodeType === Xe.element && F.nodeName === "BODY" || F.nodeName === "HTML" ? I = F : I.appendChild(F), vi(F);
    else {
      if (!on && !_t && !Bt && // eslint-disable-next-line unicorn/prefer-includes
      U.indexOf("<") === -1)
        return b && ar ? P(U) : U;
      if (I = vo(U), !I)
        return on ? null : ar ? R : "";
    }
    I && ai && xt(I.firstChild);
    const he = te ? U : I;
    try {
      const Fe = go(he);
      for (; Z = Fe.nextNode(); )
        ko(Z, he), To(Z), dn(Z.content) && mr(Z.content);
    } catch (Fe) {
      throw te && (cr(U), qt(e.removed, (qe) => {
        qe.element && dr(qe.element);
      })), Fe;
    }
    if (te)
      return qt(e.removed, (Fe) => {
        Fe.element && dr(Fe.element);
      }), _t && mi(U), U;
    if (on) {
      if (_t && mi(I), or)
        for (ee = Ke.call(I.ownerDocument); I.firstChild; )
          ee.appendChild(I.firstChild);
      else
        ee = I;
      return (J.shadowroot || J.shadowrootmode) && (ee = sn.call(r, ee, !0)), ee;
    }
    let ge = Bt ? I.outerHTML : I.innerHTML;
    return Bt && pe["!doctype"] && I.ownerDocument && I.ownerDocument.doctype && I.ownerDocument.doctype.name && Oe(tf, I.ownerDocument.doctype.name) && (ge = "<!DOCTYPE " + I.ownerDocument.doctype.name + `>
` + ge), _t && (ge = fr(ge)), b && ar ? P(ge) : ge;
  }, e.setConfig = function() {
    let U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    hi(U), oi = !0, ir = pe, sr = J;
  }, e.clearConfig = function() {
    cn = null, oi = !1, ir = null, sr = null, b = D, R = "";
  }, e.isValidAttribute = function(U, g, I) {
    cn || hi({});
    const F = we(U), Z = we(g);
    return wo(F, Z, I);
  }, e.addHook = function(U, g) {
    typeof g == "function" && He(fe, U) && Ln(fe[U], g);
  }, e.removeHook = function(U, g) {
    if (He(fe, U)) {
      if (g !== void 0) {
        const I = Nd(fe[U], g);
        return I === -1 ? void 0 : Bd(fe[U], I, 1)[0];
      }
      return Bo(fe[U]);
    }
  }, e.removeHooks = function(U) {
    He(fe, U) && (fe[U] = []);
  }, e.removeAllHooks = function() {
    fe = Yo();
  }, e;
}
var cl = ul();
ce.setOptions({ gfm: !0, breaks: !1 });
function cf(n) {
  if (!n) return "";
  const e = ce.parse(n, { async: !1 });
  return cl.sanitize(e);
}
function df(n) {
  if (!n) return [];
  const e = ce.lexer(n), t = [];
  let r = [];
  const i = () => {
    if (r.length === 0) return;
    const s = r;
    s.links = e.links, t.push({ type: "html", html: cl.sanitize(ce.parser(s)) }), r = [];
  };
  for (const s of e)
    s.type === "code" ? (i(), t.push({ type: "code", code: s.text, lang: s.lang ?? "" })) : r.push(s);
  return i(), t;
}
function ff(n, e = 250) {
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
function Wn(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
function pf(n, e) {
  return new Intl.DateTimeFormat(e, {
    //day: "numeric",
    //month: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(n * 1e3));
}
function hf(n) {
  if (typeof n == "number") {
    const t = n < 1e12 ? n * 1e3 : n, r = new Date(t);
    return Number.isNaN(r.getTime()) ? null : r;
  }
  const e = new Date(n);
  return Number.isNaN(e.getTime()) ? null : e;
}
function mf(n, e) {
  const t = hf(n);
  return t ? new Intl.DateTimeFormat(e, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(t) : "";
}
function vf(n, e) {
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
class Ve extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function gf(n) {
  if (n == null || typeof n != "object")
    throw new Ve("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new Ve("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new Ve("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new Ve("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new Ve(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new Ve(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new Ve(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new Ve(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new Ve(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new Ve(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new Ve(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new Ve(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new Ve(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new Ve(`${a}.turns`, "must be an array");
    }
  }
}
function yf(n) {
  const e = new Float32Array(n.length);
  if (n.length === 0) return e;
  const t = n.map(Math.abs).sort((s, o) => s - o), r = t[Math.floor((t.length - 1) * 0.98)] ?? 0;
  if (r === 0) return e;
  const i = 1.5;
  for (let s = 0; s < n.length; s++) {
    const o = (n[s] ?? 0) / r, a = Math.max(-1, Math.min(1, o));
    e[s] = Math.sign(a) * Math.abs(a) ** i;
  }
  return e;
}
function bf(n, e) {
  const { width: t, height: r } = e.canvas, i = n[0], s = i.length / t, o = 0.5;
  e.translate(0, r / 2), e.strokeStyle = e.fillStyle, e.beginPath();
  for (let a = 0; a < t; a += o * 2) {
    const u = Math.floor(a * s), l = Math.max(u + 1, Math.floor((a + o * 2) * s));
    let c = 0;
    for (let m = u; m < l; m++) c += Math.abs(i[m] ?? 0);
    const d = c / (l - u);
    let f = a, p = d * (r / 2);
    e.moveTo(f, 0), e.lineTo(f, p), e.lineTo(f + o, 0), f = f + o, p = -p, e.moveTo(f, 0), e.lineTo(f, p), e.lineTo(f + o, 0);
  }
  e.stroke(), e.closePath();
}
function kf(n) {
  return n.some((e) => e.startTime != null);
}
function wf(n) {
  for (const e of n) if (e.startTime != null) return e.startTime;
}
function Sf(n) {
  for (let e = n.length - 1; e >= 0; e--) {
    const t = n[e].endTime;
    if (t != null) return t;
  }
}
const Tf = 1;
function dl(n, e) {
  for (const t of n)
    if (!(t.startTime == null || t.endTime == null) && t.startTime - Tf <= e && e <= t.endTime)
      return t.id;
  return null;
}
function M1(n = {}) {
  const e = M(""), t = M(null), r = M(n.activeChannelId ?? ""), i = M(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: a, clear: u } = kc(), l = Sc(a), c = l, d = wn(/* @__PURE__ */ new Map()), f = wn({}), p = A(
    () => d.get(r.value) ?? [...d.values()][0]
  );
  function m(_, w) {
    return s(_, (b) => {
      const R = p.value;
      R && b.translationId === R.activeTranslation.value.id && w(b);
    });
  }
  function v(_) {
    e.value = _.title, t.value = _.date ?? null, l.clear();
    for (const w of d.values()) w.dispose();
    d.clear();
    for (const w of Rc(_))
      c.ensure(w.id, w.name);
    for (const w of _.channels)
      d.set(w.id, Co(w, a, s, c.ensure));
    d.size > 0 && !d.has(r.value) && (r.value = d.keys().next().value);
  }
  function y(_) {
    gf(_), v(_), a("document:change", void 0);
  }
  function T(_) {
    _ !== r.value && (r.value = _, a("channel:change", { channelId: _ }));
  }
  function S(_, w) {
    if (d.has(_)) {
      for (const b of w.translations)
        Hi(b.turns, c.ensure);
      d.get(_)?.dispose(), d.set(_, Co(w, a, s, c.ensure)), a("channel:sync", { channelId: _ });
    }
  }
  const E = [];
  function C(_) {
    _.components && Object.assign(f, _.components);
    const w = _.install(x);
    w && E.push(w);
  }
  function B() {
    a("destroy", void 0), E.forEach((_) => _()), E.length = 0;
    for (const _ of d.values()) _.dispose();
    u();
  }
  n.document && v(n.document);
  const x = {
    title: e,
    date: t,
    activeChannelId: r,
    capabilities: i,
    speakers: c,
    channels: d,
    activeChannel: p,
    components: f,
    onActiveTranslation: m,
    setDocument: y,
    setActiveChannel: T,
    setChannel: S,
    on: s,
    off: o,
    emit: a,
    use: C,
    destroy: B
  };
  return x;
}
const fl = /* @__PURE__ */ Symbol("core");
function O1(n) {
  _n(fl, n);
}
function Me() {
  const n = Gn(fl);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const _f = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const Zo = (n) => n === "";
const xf = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const Qo = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Ef = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const Cf = (n) => {
  const e = Ef(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Bn = {
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
const Af = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = Bn.width,
  color: a = Bn.stroke,
  ...u
}, { slots: l }) => bt(
  "svg",
  {
    ...Bn,
    ...u,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": Zo(t) || Zo(r) || t === !0 || r === !0 ? Number(i || s || Bn["stroke-width"]) * 24 / Number(o) : i || s || Bn["stroke-width"],
    class: xf(
      "lucide",
      u.class,
      ...n ? [`lucide-${Qo(Cf(n))}-icon`, `lucide-${Qo(n)}`] : ["lucide-icon"]
    ),
    ...!l.default && !_f(u) && { "aria-hidden": "true" }
  },
  [...e.map((c) => bt(...c)), ...l.default ? [l.default()] : []]
);
const ne = (n, e) => (t, { slots: r, attrs: i }) => bt(
  Af,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const If = ne("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const Rf = ne("bold", [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
]);
const pl = ne("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const Pf = ne("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const Mf = ne("clipboard-list", [
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
const Of = ne("clipboard-type", [
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
const Df = ne("code-xml", [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
]);
const Lf = ne("code", [
  ["path", { d: "m16 18 6-6-6-6", key: "eg8j8" }],
  ["path", { d: "m8 6-6 6 6 6", key: "ppft3o" }]
]);
const $f = ne("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const Nf = ne("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const Bf = ne("ellipsis-vertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const zf = ne("file-text", [
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
const Ff = ne("heading-1", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "m17 12 3-2v8", key: "1hhhft" }]
]);
const qf = ne("heading-2", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1", key: "9jr5yi" }]
]);
const Vf = ne("heading-3", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2", key: "68ncm8" }],
  ["path", { d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2", key: "1ejuhz" }]
]);
const Hf = ne("italic", [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
]);
const Wf = ne("list-ordered", [
  ["path", { d: "M11 5h10", key: "1cz7ny" }],
  ["path", { d: "M11 12h10", key: "1438ji" }],
  ["path", { d: "M11 19h10", key: "11t30w" }],
  ["path", { d: "M4 4h1v5", key: "10yrso" }],
  ["path", { d: "M4 9h2", key: "r1h2o0" }],
  ["path", { d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02", key: "xtkcd5" }]
]);
const Uf = ne("list", [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
]);
const Jo = ne("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const jf = ne("maximize", [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
]);
const Kf = ne("merge", [
  ["path", { d: "m8 6 4-4 4 4", key: "ybng9g" }],
  ["path", { d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22", key: "1hyw0i" }],
  ["path", { d: "m20 22-5-5", key: "1m27yz" }]
]);
const Gf = ne("message-circle", [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
]);
const Xf = ne("minimize", [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
]);
const hl = ne("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Yf = ne("pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
const ml = ne("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Zf = ne("plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
const Qf = ne("quote", [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
]);
const Jf = ne("redo-2", [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
]);
const ep = ne("refresh-cw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const tp = ne("save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
]);
const np = ne("send-horizontal", [
  [
    "path",
    {
      d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
      key: "117uat"
    }
  ],
  ["path", { d: "M6 12h16", key: "s4cdu5" }]
]);
const rp = ne("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const vl = ne("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const gl = ne("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const ip = ne("sparkles", [
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
const sp = ne("table", [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }]
]);
const op = ne("trash-2", [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
]);
const ap = ne("triangle-alert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
const lp = ne("undo-2", [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
]);
const up = ne("user-plus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const cp = ne("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const yl = ne("volume-2", [
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
const bl = ne("volume-x", [
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
const ks = ne("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), dp = {
  "arrow-down": If,
  warning: ap,
  bold: Rf,
  check: pl,
  "chevron-down": Pf,
  "clipboard-list": Mf,
  "clipboard-type": Of,
  code: Lf,
  "code-block": Df,
  copy: $f,
  download: Nf,
  "heading-1": Ff,
  "heading-2": qf,
  "heading-3": Vf,
  italic: Hf,
  list: Uf,
  "list-ordered": Wf,
  maximize: jf,
  merge: Kf,
  minimize: Xf,
  pause: hl,
  play: ml,
  quote: Qf,
  redo: Jf,
  table: sp,
  save: tp,
  settings: rp,
  "skip-back": vl,
  "skip-forward": gl,
  undo: lp,
  users: cp,
  volume: yl,
  "volume-mute": bl,
  x: ks,
  "circle-notch": Jo,
  spinner: Jo,
  "more-vertical": Bf,
  "user-plus": up,
  plus: Zf,
  pencil: Yf,
  trash: op,
  send: np,
  "file-text": zf,
  "message-circle": Gf,
  "refresh-cw": ep,
  sparkles: ip
};
function Dr(n) {
  if (n)
    return dp[n];
}
const kl = {
  sm: 16,
  md: 20,
  lg: 24
}, fp = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, pp = /* @__PURE__ */ j({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = A(() => Dr(e.name)), r = A(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (k(), V(Ht(t.value), {
      key: 0,
      style: Yt(r.value),
      class: Te(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (k(), $("span", fp, "?"));
  }
}), ae = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, Qe = /* @__PURE__ */ ae(pp, [["__scopeId", "data-v-210c7f09"]]), hp = ["type", "disabled", "aria-disabled", "aria-label"], mp = {
  key: 3,
  class: "editor-btn__label"
}, vp = /* @__PURE__ */ j({
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
    const e = n, t = sc(), r = A(() => !!Dr(e.icon)), i = A(() => !!Dr(e.iconRight)), s = A(() => kl[e.size]), o = A(() => e.disabled || e.loading), a = A(() => !!e.label || !!t.default), u = A(
      () => e.loading || r.value || !!t.icon
    ), l = A(() => u.value && !a.value), c = A(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      l.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, f) => (k(), $("button", {
      type: n.type,
      class: Te(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (k(), V(Qe, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (k(), V(Qe, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? Q(d.$slots, "icon", { key: 2 }, void 0, !0) : G("", !0),
      a.value ? (k(), $("span", mp, [
        Q(d.$slots, "default", {}, () => [
          me(K(n.label), 1)
        ], !0)
      ])) : G("", !0),
      i.value ? (k(), V(Qe, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? Q(d.$slots, "icon-right", { key: 5 }, void 0, !0) : G("", !0)
    ], 10, hp));
  }
}), re = /* @__PURE__ */ ae(vp, [["__scopeId", "data-v-d554746d"]]), wl = {
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
  "sidebar.bilingual": "Traductions croisées",
  "language.wildcard": "Multi-langue",
  "select.filter": "Rechercher…",
  "subtitle.exitFullscreen": "Quitter le plein écran",
  "subtitle.show": "Afficher les sous-titres",
  "subtitle.fontSize": "Taille de police",
  "subtitle.showWatermark": "Afficher le filigrane",
  "subtitle.pinWatermark": "Épingler le filigrane",
  "sidebar.subtitle": "Sous-titres",
  "sidebar.voicePlayback": "Lecture vocale",
  "voicePlayback.enable": "Lire à voix haute",
  "voicePlayback.description": "Utilise la synthèse vocale par défaut du navigateur.",
  "voicePlayback.unavailable": "Aucune voix de synthèse n'est disponible dans ce navigateur.",
  "sidebar.history": "Historique",
  "sidebar.generationLabel": "Génération {date}",
  "sidebar.versionLabel": "v{n} — {date}",
  "sidebar.statusCompleted": "Terminé",
  "sidebar.statusError": "Erreur",
  "sidebar.statusProcessing": "En cours",
  "sidebar.statusQueued": "En attente",
  "transcription.empty": "Aucune transcription pour le moment",
  "transcription.historyStart": "Début de la transcription",
  "transcription.editTurn": "Modifier le texte",
  "transcription.saveEdit": "Enregistrer la modification",
  "transcription.lockedBy": "En cours de modification par {name}",
  "transcription.mergeTurns": "Fusionner avec le tour précédent",
  "speaker.unknown": "Intervenant non connu",
  "transcription.cancelEdit": "Annuler la modification",
  "transcription.turnEditor": "Texte du tour de parole (Entrée pour enregistrer, Échap pour annuler)",
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
  "llmService.empty": "Aucun contenu",
  "llmService.error": "Erreur de génération",
  "llmService.errorTemporary": "Nous n'avons pas pu terminer la tâche en raison d'un problème de connexion temporaire avec le service d'intelligence artificielle. Veuillez réessayer dans un moment.",
  "llmService.generate": "Générer le document",
  "llmService.retry": "Réessayer",
  "llmService.version": "Version",
  "llmService.save": "Enregistrer",
  "llmService.statusUpdated": "À jour",
  "llmService.statusOutdated": "Transcription modifiée",
  "mdToolbar.label": "Mise en forme",
  "mdToolbar.h1": "Titre 1",
  "mdToolbar.h2": "Titre 2",
  "mdToolbar.h3": "Titre 3",
  "mdToolbar.bold": "Gras",
  "mdToolbar.italic": "Italique",
  "mdToolbar.bulletList": "Liste à puces",
  "mdToolbar.orderedList": "Liste numérotée",
  "mdToolbar.quote": "Citation",
  "mdToolbar.code": "Code en ligne",
  "mdToolbar.codeBlock": "Bloc de code",
  "mdToolbar.table": "Insérer un tableau",
  "mdToolbar.undo": "Annuler",
  "mdToolbar.redo": "Rétablir",
  "verbatim.title": "Verbatim",
  "format.docx": "Document Word (.docx)",
  "format.pdf": "PDF (.pdf)",
  "format.txt": "Texte brut (.txt)",
  "format.json": "JSON (.json)",
  "format.whisperx": "WhisperX JSON",
  "time.relative.justNow": "à l'instant",
  "time.relative.minutes": "il y a {n} min",
  "time.relative.hours": "il y a {n} h",
  "time.relative.days": "il y a {n} j",
  "chat.title": "Assistant",
  "chat.close": "Fermer l'assistant",
  "chat.expand": "Agrandir",
  "chat.collapse": "Réduire",
  "chat.history": "Historique",
  "chat.newChat": "Nouvelle conversation",
  "chat.rename": "Renommer",
  "chat.deleteSession": "Supprimer",
  "chat.deleteConfirm": "Supprimer ?",
  "chat.cancel": "Annuler",
  "chat.confirmDelete": "Confirmer",
  "chat.placeholder": "Écrire un message…",
  "chat.send": "Envoyer",
  "chat.emptyState": "Pose une question sur cette transcription.",
  "chat.emptyChat": "Démarre la conversation.",
  "chat.copy": "Copier",
  "markdown.copyCode": "Copier le code"
}, gp = {
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
  "sidebar.bilingual": "Cross subtitles",
  "language.wildcard": "Multilingual",
  "select.filter": "Search…",
  "subtitle.exitFullscreen": "Exit fullscreen",
  "subtitle.show": "Show subtitles",
  "subtitle.fontSize": "Font size",
  "subtitle.showWatermark": "Show watermark",
  "subtitle.pinWatermark": "Pin watermark",
  "sidebar.subtitle": "Subtitles",
  "sidebar.voicePlayback": "Voice playback",
  "voicePlayback.enable": "Read aloud",
  "voicePlayback.description": "Uses the browser's default speech synthesis.",
  "voicePlayback.unavailable": "No speech synthesis voice is available in this browser.",
  "sidebar.history": "History",
  "sidebar.generationLabel": "Generation {date}",
  "sidebar.versionLabel": "v{n} — {date}",
  "sidebar.statusCompleted": "Done",
  "sidebar.statusError": "Error",
  "sidebar.statusProcessing": "Processing",
  "sidebar.statusQueued": "Queued",
  "transcription.empty": "No transcription yet",
  "transcription.historyStart": "Beginning of transcription",
  "transcription.editTurn": "Edit text",
  "transcription.saveEdit": "Save edit",
  "transcription.lockedBy": "Being edited by {name}",
  "transcription.mergeTurns": "Merge with previous turn",
  "speaker.unknown": "Unknown speaker",
  "transcription.cancelEdit": "Cancel edit",
  "transcription.turnEditor": "Turn text (Enter to save, Escape to cancel)",
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
  "llmService.empty": "No content",
  "llmService.error": "Generation error",
  "llmService.errorTemporary": "We couldn't complete the task due to a temporary connection issue with the model provider. Please try again in a moment.",
  "llmService.generate": "Generate document",
  "llmService.retry": "Retry",
  "llmService.version": "Version",
  "llmService.save": "Save",
  "llmService.statusUpdated": "Up to date",
  "llmService.statusOutdated": "Transcription edited",
  "mdToolbar.label": "Formatting",
  "mdToolbar.h1": "Heading 1",
  "mdToolbar.h2": "Heading 2",
  "mdToolbar.h3": "Heading 3",
  "mdToolbar.bold": "Bold",
  "mdToolbar.italic": "Italic",
  "mdToolbar.bulletList": "Bullet list",
  "mdToolbar.orderedList": "Numbered list",
  "mdToolbar.quote": "Quote",
  "mdToolbar.code": "Inline code",
  "mdToolbar.codeBlock": "Code block",
  "mdToolbar.table": "Insert table",
  "mdToolbar.undo": "Undo",
  "mdToolbar.redo": "Redo",
  "verbatim.title": "Verbatim",
  "format.docx": "Word document (.docx)",
  "format.pdf": "PDF (.pdf)",
  "format.txt": "Plain text (.txt)",
  "format.json": "JSON (.json)",
  "format.whisperx": "WhisperX JSON",
  "time.relative.justNow": "just now",
  "time.relative.minutes": "{n} min ago",
  "time.relative.hours": "{n} h ago",
  "time.relative.days": "{n} d ago",
  "chat.title": "Assistant",
  "chat.close": "Close assistant",
  "chat.expand": "Expand",
  "chat.collapse": "Collapse",
  "chat.history": "History",
  "chat.newChat": "New chat",
  "chat.rename": "Rename",
  "chat.deleteSession": "Delete",
  "chat.deleteConfirm": "Delete?",
  "chat.cancel": "Cancel",
  "chat.confirmDelete": "Confirm",
  "chat.placeholder": "Type a message…",
  "chat.send": "Send",
  "chat.emptyState": "Ask a question about this transcript.",
  "chat.emptyChat": "Start the conversation.",
  "chat.copy": "Copy",
  "markdown.copyCode": "Copy code"
}, ea = { fr: wl, en: gp }, Sl = /* @__PURE__ */ Symbol("i18n");
function Tl(n, e) {
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
function D1(n) {
  const e = A(() => {
    const r = ea[n.value] ?? ea.fr;
    return (i, s) => Tl(r[i] ?? i, s);
  }), t = {
    t: (r, i) => e.value(r, i),
    locale: n
  };
  return _n(Sl, t), t;
}
function de() {
  const n = Gn(Sl);
  if (n) return n;
  const e = A(() => "fr");
  return {
    t: (t, r) => Tl(wl[t] ?? t, r),
    locale: e
  };
}
const yp = { class: "editor-header" }, bp = { class: "header-main" }, kp = { class: "document-title" }, wp = {
  key: 0,
  class: "document-meta"
}, Sp = { class: "header-right" }, Tp = { key: 0 }, _p = /* @__PURE__ */ j({
  __name: "Header",
  props: {
    title: {},
    date: {},
    duration: {},
    speakerCount: {},
    isMobile: { type: Boolean },
    canAsk: { type: Boolean }
  },
  emits: ["toggleSidebar", "openChat"],
  setup(n) {
    const e = n, { t, locale: r } = de(), i = A(() => e.title.replace(/-/g, " ")), s = A(
      () => e.date != null ? mf(e.date, r.value) : ""
    ), o = A(
      () => vf(e.duration, r.value)
    ), a = A(
      () => t("header.speakerCount", { count: e.speakerCount })
    ), u = A(
      () => [
        s.value,
        o.value,
        a.value
      ].filter(Boolean)
    );
    return (l, c) => (k(), $("header", yp, [
      N("div", bp, [
        N("h1", kp, K(i.value), 1),
        u.value.length ? (k(), $("div", wp, [
          (k(!0), $(ye, null, ze(u.value, (d, f) => (k(), $("span", {
            key: f,
            class: "document-meta__part"
          }, K(d), 1))), 128))
        ])) : G("", !0)
      ]),
      N("div", Sp, [
        n.isMobile ? (k(), V(re, {
          key: 0,
          variant: "transparent",
          "aria-label": h(t)("header.openSidebar"),
          onClick: c[0] || (c[0] = (d) => l.$emit("toggleSidebar"))
        }, {
          icon: z(() => [
            q(Qe, {
              name: "users",
              size: 16
            })
          ]),
          _: 1
        }, 8, ["aria-label"])) : G("", !0),
        q(re, {
          variant: "primary",
          "aria-label": h(t)("header.ask"),
          disabled: !e.canAsk,
          onClick: c[1] || (c[1] = (d) => l.$emit("openChat"))
        }, {
          icon: z(() => [
            q(Qe, {
              name: "sparkles",
              size: 16
            })
          ]),
          default: z(() => [
            n.isMobile ? G("", !0) : (k(), $("span", Tp, K(h(t)("header.ask")), 1))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), xp = /* @__PURE__ */ ae(_p, [["__scopeId", "data-v-cc84adfc"]]), Ep = ["aria-label"], Cp = /* @__PURE__ */ j({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (k(), $("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      Q(e.$slots, "default", {}, void 0, !0)
    ], 8, Ep));
  }
}), Ap = /* @__PURE__ */ ae(Cp, [["__scopeId", "data-v-732d4c24"]]), Ip = ["aria-label"], Rp = ["aria-selected", "aria-disabled", "disabled", "onClick"], Pp = { class: "tab__label" }, Mp = /* @__PURE__ */ j({
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
    return (s, o) => (k(), $("div", {
      class: "tabs",
      role: "tablist",
      "aria-label": n.ariaLabel
    }, [
      (k(!0), $(ye, null, ze(n.tabs, (a) => (k(), $("button", {
        key: a.value,
        type: "button",
        role: "tab",
        class: Te(["tab", { "tab--active": a.value === n.modelValue }]),
        "aria-selected": a.value === n.modelValue,
        "aria-disabled": a.disabled || void 0,
        disabled: a.disabled,
        onClick: (u) => i(a)
      }, [
        h(Dr)(a.icon) ? (k(), V(Qe, {
          key: 0,
          name: a.icon,
          size: 16,
          class: "tab__icon"
        }, null, 8, ["name"])) : G("", !0),
        N("span", Pp, K(a.label), 1),
        a.badge ? (k(), V(Ap, {
          key: 1,
          class: "tab__badge"
        }, {
          default: z(() => [
            me(K(a.badge), 1)
          ]),
          _: 2
        }, 1024)) : G("", !0)
      ], 10, Rp))), 128))
    ], 8, Ip));
  }
}), Op = /* @__PURE__ */ ae(Mp, [["__scopeId", "data-v-24f9730e"]]), gn = "__transcription__", _r = "__verbatim__", Dp = /* @__PURE__ */ j({
  __name: "TabBar",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Me(), { t: s } = de(), o = A(() => {
      const u = i.llmServices?.list.value ?? [];
      return [
        {
          value: gn,
          label: s("tabs.transcription"),
          icon: "message-circle"
        },
        {
          value: _r,
          label: s("tabs.verbatim"),
          icon: "file-text"
        },
        ...u.map((l) => ({
          value: l.id,
          label: l.label.value,
          icon: "sparkles",
          badge: s("tabs.aiBadge")
        }))
      ];
    });
    function a(u) {
      u !== t.modelValue && r("update:modelValue", u);
    }
    return (u, l) => h(i).llmServices ? (k(), V(Op, {
      key: 0,
      tabs: o.value,
      "model-value": n.modelValue,
      "onUpdate:modelValue": a
    }, null, 8, ["tabs", "model-value"])) : G("", !0);
  }
});
var _i = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, Lp = 70, $p = 1e3 / 60, Np = 350, xr = !1, ta = !1;
function Bp() {
  ta || typeof document > "u" || (document.addEventListener("mousedown", () => {
    xr = !0;
  }), document.addEventListener("mouseup", () => {
    xr = !1;
  }), document.addEventListener("click", () => {
    xr = !1;
  }), ta = !0);
}
var xi = /* @__PURE__ */ new Map();
function Ei(...n) {
  const e = {
    damping: _i.damping,
    stiffness: _i.stiffness,
    mass: _i.mass
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
  return xi.has(r) || xi.set(r, Object.freeze({ ...e })), t ? "instant" : xi.get(r);
}
function zp(n = {}) {
  Bp();
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
    const R = s();
    for (const D of t) D(R);
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
  function a(R) {
    r.scrollElement && (r.scrollElement.scrollTop = R, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function u() {
    const R = r.scrollElement, D = r.contentElement;
    return !R || !D ? 0 : R.scrollHeight - 1 - R.clientHeight;
  }
  let l;
  function c() {
    const R = r.scrollElement, D = r.contentElement;
    if (!R || !D) return 0;
    const H = u();
    if (!e.targetScrollTop) return H;
    if (l?.targetScrollTop === H) return l.calculatedScrollTop;
    const L = Math.max(Math.min(e.targetScrollTop(H, {
      scrollElement: R,
      contentElement: D
    }), H), 0);
    return l = {
      targetScrollTop: H,
      calculatedScrollTop: L
    }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      l = void 0;
    }), L;
  }
  function d() {
    return c() - o();
  }
  function f() {
    return d() <= Lp;
  }
  function p(R) {
    r.isAtBottom = R, i();
  }
  function m(R) {
    r.escapedFromLock = R, i();
  }
  function v(R) {
    r.isNearBottom = R, i();
  }
  function y() {
    if (!xr || typeof window > "u") return !1;
    const R = window.getSelection?.();
    if (!R || !R.rangeCount) return !1;
    const D = R.getRangeAt(0), H = r.scrollElement;
    if (!H) return !1;
    const L = D.commonAncestorContainer;
    return !!(L && (H.contains(L) || L.contains(H)));
  }
  const T = (R) => {
    if (R.target !== r.scrollElement) return;
    const D = o(), H = r.ignoreScrollToTop;
    let L = r.lastScrollTop ?? D;
    r.lastScrollTop = D, r.ignoreScrollToTop = void 0, H && H > D && (L = H), v(f()), setTimeout(() => {
      if (r.resizeDifference || D === H) return;
      if (y()) {
        m(!0), p(!1);
        return;
      }
      const O = D > L, P = D < L;
      if (r.animation?.ignoreEscapes) {
        a(L);
        return;
      }
      P && (m(!0), p(!1)), O && m(!1), !r.escapedFromLock && f() && p(!0);
    }, 1);
  }, S = (R) => {
    const D = r.scrollElement;
    if (!D) return;
    let H = R.target;
    for (; H && !["scroll", "auto"].includes(getComputedStyle(H).overflow); ) {
      if (!H.parentElement) return;
      H = H.parentElement;
    }
    H === D && R.deltaY < 0 && D.scrollHeight > D.clientHeight && !r.animation?.ignoreEscapes && (m(!0), p(!1));
  };
  function E(R, D) {
    C(), r.scrollElement = R, r.contentElement = D, getComputedStyle(R).overflow === "visible" && (R.style.overflow = "auto"), R.addEventListener("scroll", T, { passive: !0 }), R.addEventListener("wheel", S, { passive: !0 });
    let H;
    r.resizeObserver = new ResizeObserver((L) => {
      const O = L[0];
      if (!O) return;
      const { height: P } = O.contentRect, W = P - (H ?? P);
      if (r.resizeDifference = W, o() > u() && a(u()), v(f()), W >= 0) {
        const X = Ei(e, H ? e.resize : e.initial);
        _({
          animation: X,
          wait: !0,
          preserveScrollPosition: !0,
          duration: X === "instant" ? void 0 : Np
        });
      } else f() && (m(!1), p(!0));
      H = P, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === W && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(D);
  }
  function C() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", T), r.scrollElement.removeEventListener("wheel", S)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function B() {
    C(), t.clear();
  }
  function x(R) {
    e = {
      ...e,
      ...R
    };
  }
  function _(R = {}) {
    const D = typeof R == "string" ? { animation: R } : R;
    D.preserveScrollPosition || p(!0);
    const H = Date.now() + (Number(D.wait) || 0), L = Ei(e, D.animation), { ignoreEscapes: O = !1 } = D;
    let P, W = c();
    D.duration instanceof Promise ? D.duration.finally(() => {
      P = Date.now();
    }) : P = H + (D.duration ?? 0);
    const X = async () => {
      const ie = new Promise((se) => {
        if (typeof requestAnimationFrame > "u") {
          se(!1);
          return;
        }
        requestAnimationFrame(() => se(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const se = o(), be = typeof performance < "u" ? performance.now() : Date.now(), Ke = (be - (r.lastTick ?? be)) / $p;
        if (r.animation ||= {
          behavior: L,
          promise: ie,
          ignoreEscapes: O
        }, r.animation.behavior === L && (r.lastTick = be), y() || H > Date.now()) return X();
        if (se < Math.min(W, c())) {
          if (r.animation?.behavior === L) {
            if (L === "instant")
              return a(c()), X();
            const $t = L;
            r.velocity = ($t.damping * r.velocity + $t.stiffness * d()) / $t.mass, r.accumulated += r.velocity * Ke;
            const sn = o();
            a(sn + r.accumulated), o() !== sn && (r.accumulated = 0);
          }
          return X();
        }
        return P > Date.now() ? (W = c(), X()) : (r.animation = void 0, o() < c() ? _({
          animation: Ei(e, e.resize),
          ignoreEscapes: O,
          duration: Math.max(0, P - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return ie.then((se) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), se));
    };
    return D.wait !== !0 && (r.animation = void 0), r.animation?.behavior === L ? r.animation.promise : X();
  }
  const w = () => {
    m(!0), p(!1);
  };
  function b(R) {
    return t.add(R), () => t.delete(R);
  }
  return {
    attach: E,
    detach: C,
    destroy: B,
    setOptions: x,
    getState: s,
    onChange: b,
    scrollToBottom: _,
    stopScroll: w
  };
}
function _l(n = {}) {
  const e = M(null), t = M(null), r = M(n.initial !== !1), i = M(!1), s = M(!1), o = zp(n);
  let a = null;
  return tt((u) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((l) => {
      r.value = l.isAtBottom, i.value = l.isNearBottom, s.value = l.escapedFromLock;
    }), u(() => {
      a?.(), a = null, o.detach();
    }));
  }), gt(() => {
    o.destroy();
  }), {
    scrollRef: e,
    contentRef: t,
    isAtBottom: r,
    isNearBottom: i,
    escapedFromLock: s,
    scrollToBottom: (u) => o.scrollToBottom(u),
    stopScroll: () => o.stopScroll(),
    setOptions: (u) => o.setOptions(u)
  };
}
var Fp = /* @__PURE__ */ Symbol("StickToBottom"), qp = { style: {
  position: "relative",
  height: "100%",
  width: "100%",
  flex: "1",
  "min-height": "0"
} }, Vp = /* @__PURE__ */ j({
  name: "StickToBottom",
  __name: "StickToBottom",
  props: {
    resize: {},
    initial: { type: [Object, Boolean] },
    targetScrollTop: { type: Function },
    anchor: {},
    damping: {},
    stiffness: {},
    mass: {}
  },
  setup(n, { expose: e }) {
    const t = n, { scrollRef: r, contentRef: i, isAtBottom: s, isNearBottom: o, escapedFromLock: a, scrollToBottom: u, stopScroll: l, setOptions: c } = _l({
      resize: t.resize,
      initial: t.initial,
      targetScrollTop: t.targetScrollTop,
      damping: t.damping,
      stiffness: t.stiffness,
      mass: t.mass
    }), d = {
      scrollRef: r,
      contentRef: i,
      isAtBottom: s,
      isNearBottom: o,
      escapedFromLock: a,
      scrollToBottom: u,
      stopScroll: l
    };
    _n(Fp, d), e(d), oe(() => [
      t.resize,
      t.initial,
      t.damping,
      t.stiffness,
      t.mass,
      t.targetScrollTop
    ], () => {
      c({
        resize: t.resize,
        initial: t.initial,
        targetScrollTop: t.targetScrollTop,
        damping: t.damping,
        stiffness: t.stiffness,
        mass: t.mass
      });
    }, { flush: "post" });
    const f = A(() => t.anchor ?? "auto"), p = A(() => ({
      isAtBottom: s.value,
      isNearBottom: o.value,
      escapedFromLock: a.value,
      scrollToBottom: u,
      stopScroll: l
    }));
    return (m, v) => (k(), $("div", null, [N("div", qp, [N("div", {
      ref_key: "scrollRef",
      ref: r,
      style: Yt({
        "overflow-anchor": f.value,
        overflow: "auto",
        height: "100%",
        width: "100%",
        "scrollbar-gutter": "stable both-edges"
      })
    }, [N("div", {
      ref_key: "contentRef",
      ref: i
    }, [Q(m.$slots, "default", pt(Rt(p.value)))], 512)], 4), Q(m.$slots, "overlay", pt(Rt(p.value)))]), Q(m.$slots, "after", pt(Rt(p.value)))]));
  }
});
const Hp = /* @__PURE__ */ j({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (k(), $("span", {
      class: "speaker-indicator",
      style: Yt({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), ws = /* @__PURE__ */ ae(Hp, [["__scopeId", "data-v-9bffeda8"]]), Wp = ["datetime"], Up = {
  key: 2,
  class: "lang"
}, jp = /* @__PURE__ */ j({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    startDate: {},
    language: {},
    interactive: { type: Boolean }
  },
  setup(n) {
    const e = n, { t, locale: r } = de(), i = A(
      () => Xa(
        e.language,
        r.value,
        t("language.wildcard")
      )
    ), s = A(() => {
      if (e.startTime != null)
        return {
          text: Wn(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const u = new Date(e.startDate * 1e3);
        return {
          text: pf(e.startDate, r.value),
          datetime: u.toISOString()
        };
      }
      return null;
    }), o = A(() => e.speaker?.color ?? "transparent"), a = A(() => e.speaker?.name ?? t("speaker.unknown"));
    return (u, l) => (k(), $("div", {
      class: Te(["speaker-label", { "speaker-label--interactive": n.interactive }])
    }, [
      n.speaker ? (k(), V(ws, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : G("", !0),
      N("span", {
        class: Te(["speaker-name", { "speaker-name--unknown": !n.speaker }])
      }, K(a.value), 3),
      s.value ? (k(), $("time", {
        key: 1,
        class: "timestamp",
        datetime: s.value.datetime
      }, K(s.value.text), 9, Wp)) : G("", !0),
      i.value ? (k(), $("span", Up, K(i.value), 1)) : G("", !0)
    ], 2));
  }
}), Ci = /* @__PURE__ */ ae(jp, [["__scopeId", "data-v-075a5b82"]]);
function na(n) {
  return typeof n == "string" ? `'${n}'` : new Kp().serialize(n);
}
const Kp = /* @__PURE__ */ (function() {
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
        const [a, u] = i[o];
        s += `${this.serialize(a, !0)}:${this.serialize(u)}`, o < i.length - 1 && (s += ",");
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
function Xi(n, e) {
  return n === e || na(n) === na(e);
}
function lt(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = Gn(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (_n(r, o), o)];
}
function Ue() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function xl(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function Lr(n) {
  return n == null;
}
function ra(n, e) {
  return Lr(n) ? !1 : Array.isArray(n) ? n.some((t) => Xi(t, e)) : Xi(n, e);
}
function Ss(n) {
  return n ? n.flatMap((e) => e.type === ye ? Ss(e.children) : [e]) : [];
}
const Gp = ["INPUT", "TEXTAREA"];
function Xp(n, e, t, r = {}) {
  if (!e || r.enableIgnoredElement && Gp.includes(e.nodeName)) return null;
  const { arrowKeyOptions: i = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: o = [], loop: a = !0, dir: u = "ltr", preventScroll: l = !0, focus: c = !1 } = r, [d, f, p, m, v, y] = [
    n.key === "ArrowRight",
    n.key === "ArrowLeft",
    n.key === "ArrowUp",
    n.key === "ArrowDown",
    n.key === "Home",
    n.key === "End"
  ], T = p || m, S = d || f;
  if (!v && !y && (!T && !S || i === "vertical" && S || i === "horizontal" && T)) return null;
  const E = t ? Array.from(t.querySelectorAll(s)) : o;
  if (!E.length) return null;
  l && n.preventDefault();
  let C = null;
  return S || T ? C = El(E, e, {
    goForward: T ? m : u === "ltr" ? d : f,
    loop: a
  }) : v ? C = E.at(0) || null : y && (C = E.at(-1) || null), c && C?.focus(), C;
}
function El(n, e, t, r = n.length) {
  if (--r === 0) return null;
  const i = n.indexOf(e), s = t.goForward ? i + 1 : i - 1;
  if (!t.loop && (s < 0 || s >= n.length)) return null;
  const o = (s + n.length) % n.length, a = n[o];
  return a ? a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false" ? El(n, a, t, r) : a : null;
}
const [Ts] = lt("ConfigProvider");
function Yp(n, e) {
  var t;
  const r = Pt();
  return tt(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), ac(r);
}
function Cl(n, e) {
  return Fa() ? (qa(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Zp(n) {
  let e = !1, t;
  const r = za(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Dt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Qp = (n) => typeof n < "u", Jp = Object.prototype.toString, eh = (n) => Jp.call(n) === "[object Object]";
function Ai(n) {
  return Array.isArray(n) ? n : [n];
}
function th(n) {
  return Zt();
}
// @__NO_SIDE_EFFECTS__
function Al(n) {
  if (!Dt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = za(!0), t = r.run(() => n(...s))), Cl(i), t));
}
function nh(n, e = 1e4) {
  return oc((t, r) => {
    let i = We(n), s;
    const o = () => setTimeout(() => {
      i = We(n), r();
    }, We(e));
    return Cl(() => {
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
function rh(n, e) {
  th() && gt(n, e);
}
function ih(n, e, t) {
  return oe(n, e, {
    ...t,
    immediate: !0
  });
}
const _s = Dt ? window : void 0;
function en(n) {
  var e;
  const t = We(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Yi(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = A(() => {
    const r = Ai(We(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return ih(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => en(s))) !== null && r !== void 0 ? r : [_s].filter((s) => s != null),
      Ai(We(t.value ? n[1] : n[0])),
      Ai(h(t.value ? n[2] : n[1])),
      We(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, u) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const l = eh(o) ? { ...o } : o, c = r.flatMap((d) => i.flatMap((f) => s.map((p) => e(d, f, p, l))));
    u(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function sh() {
  const n = Pt(!1), e = Zt();
  return e && _e(() => {
    n.value = !0;
  }, e), n;
}
function oh(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function ah(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = _s, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, u = oh(e);
  return Yi(i, s, (c) => {
    c.repeat && We(a) || u(c) && t(c);
  }, o);
}
function lh(n) {
  return JSON.parse(JSON.stringify(n));
}
// @__NO_SIDE_EFFECTS__
function Zn(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: u, deep: l = !1, defaultValue: c, shouldEmit: d } = r, f = Zt(), p = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let m = u;
  e || (e = "modelValue"), m = m || `update:${e.toString()}`;
  const v = (S) => o ? typeof o == "function" ? o(S) : lh(S) : S, y = () => Qp(n[e]) ? v(n[e]) : c, T = (S) => {
    d ? d(S) && p(m, S) : p(m, S);
  };
  if (a) {
    const S = M(y());
    let E = !1;
    return oe(() => n[e], (C) => {
      E || (E = !0, S.value = v(C), Pe(() => E = !1));
    }), oe(S, (C) => {
      !E && (C !== n[e] || l) && T(C);
    }, { deep: l }), S;
  } else return A({
    get() {
      return y();
    },
    set(S) {
      T(S);
    }
  });
}
function Ii(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Zi(n, e, t = ".", r) {
  if (!Ii(e))
    return Zi(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : Ii(o) && Ii(i[s]) ? i[s] = Zi(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function uh(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => Zi(t, r, "", n), {})
  );
}
const ch = uh(), dh = /* @__PURE__ */ Al(() => {
  const n = M(/* @__PURE__ */ new Map()), e = M(), t = A(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), r = Ts({ scrollBody: M(!0) }), i = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", e.value = void 0;
  };
  return oe(t, (s, o) => {
    if (!Dt) return;
    if (!s) {
      o && i();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: a,
      margin: 0
    }, l = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? ch({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof l.padding == "number" ? `${l.padding}px` : String(l.padding), document.body.style.marginRight = typeof l.margin == "number" ? `${l.margin}px` : String(l.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), Pe(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function Il(n) {
  const e = Math.random().toString(36).substring(2, 7), t = dh();
  t.value.set(e, n ?? !1);
  const r = A({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return rh(() => {
    t.value.delete(e);
  }), r;
}
function xs(n) {
  const e = Ts({ dir: M("ltr") });
  return A(() => n?.value || e.dir?.value || "ltr");
}
function Qn(n) {
  const e = Zt(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[lc(Va(i))] = (...s) => n(i, ...s);
  }), r;
}
let Ri = 0;
function fh() {
  tt((n) => {
    if (!Dt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? ia()), document.body.insertAdjacentElement("beforeend", e[1] ?? ia()), Ri++, n(() => {
      Ri === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Ri--;
    });
  });
}
function ia() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function ph(n) {
  return A(() => We(n) ? !!en(n)?.closest("form") : !0);
}
function ke() {
  const n = Zt(), e = M(), t = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : en(e)), r = Object.assign({}, n.exposed), i = {};
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
      const a = o.$.exposed, u = Object.assign({}, i);
      for (const l in a) Object.defineProperty(u, l, {
        enumerable: !0,
        configurable: !0,
        get: () => a[l]
      });
      n.exposed = u;
    }
  }
  return {
    forwardRef: s,
    currentRef: e,
    currentElement: t
  };
}
function hh(n) {
  const e = Zt(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Ha(n);
  return A(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[Va(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function jr(n, e) {
  const t = hh(n), r = e ? Qn(e) : {};
  return A(() => ({
    ...t.value,
    ...r
  }));
}
var mh = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, hn = /* @__PURE__ */ new WeakMap(), yr = /* @__PURE__ */ new WeakMap(), br = {}, Pi = 0, Rl = function(n) {
  return n && (n.host || Rl(n.parentNode));
}, vh = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = Rl(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, gh = function(n, e, t, r) {
  var i = vh(e, Array.isArray(n) ? n : [n]);
  br[t] || (br[t] = /* @__PURE__ */ new WeakMap());
  var s = br[t], o = [], a = /* @__PURE__ */ new Set(), u = new Set(i), l = function(d) {
    !d || a.has(d) || (a.add(d), l(d.parentNode));
  };
  i.forEach(l);
  var c = function(d) {
    !d || u.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        c(f);
      else
        try {
          var p = f.getAttribute(r), m = p !== null && p !== "false", v = (hn.get(f) || 0) + 1, y = (s.get(f) || 0) + 1;
          hn.set(f, v), s.set(f, y), o.push(f), v === 1 && m && yr.set(f, !0), y === 1 && f.setAttribute(t, "true"), m || f.setAttribute(r, "true");
        } catch (T) {
          console.error("aria-hidden: cannot operate on ", f, T);
        }
    });
  };
  return c(e), a.clear(), Pi++, function() {
    o.forEach(function(d) {
      var f = hn.get(d) - 1, p = s.get(d) - 1;
      hn.set(d, f), s.set(d, p), f || (yr.has(d) || d.removeAttribute(r), yr.delete(d)), p || d.removeAttribute(t);
    }), Pi--, Pi || (hn = /* @__PURE__ */ new WeakMap(), hn = /* @__PURE__ */ new WeakMap(), yr = /* @__PURE__ */ new WeakMap(), br = {});
  };
}, yh = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = mh(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), gh(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function Pl(n) {
  let e;
  oe(() => en(n), (t) => {
    t ? e = yh(t) : e && e();
  }), Qt(() => {
    e && e();
  });
}
let bh = 0;
function Un(n, e = "reka") {
  if ("useId" in _o) return `${e}-${_o.useId?.()}`;
  const t = Ts({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++bh}`;
}
function kh(n) {
  const e = M(), t = A(() => e.value?.width ?? 0), r = A(() => e.value?.height ?? 0);
  return _e(() => {
    const i = en(n);
    if (i) {
      e.value = {
        width: i.offsetWidth,
        height: i.offsetHeight
      };
      const s = new ResizeObserver((o) => {
        if (!Array.isArray(o) || !o.length) return;
        const a = o[0];
        let u, l;
        if ("borderBoxSize" in a) {
          const c = a.borderBoxSize, d = Array.isArray(c) ? c[0] : c;
          u = d.inlineSize, l = d.blockSize;
        } else
          u = i.offsetWidth, l = i.offsetHeight;
        e.value = {
          width: u,
          height: l
        };
      });
      return s.observe(i, { box: "border-box" }), () => s.unobserve(i);
    } else e.value = void 0;
  }), {
    width: t,
    height: r
  };
}
function wh(n, e) {
  const t = M(n);
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
function Sh(n) {
  const e = nh("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Ue(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), u = a.find((f) => f.ref === o), l = a.map((f) => f.textValue), c = _h(l, e.value, u?.textValue), d = a.find((f) => f.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function Th(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function _h(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((l) => l === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = Th(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((l) => l !== t));
  const u = o.find((l) => l.toLowerCase().startsWith(i.toLowerCase()));
  return u !== t ? u : void 0;
}
function xh(n, e) {
  const t = M({}), r = M("none"), i = M(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? _s, { state: u, dispatch: l } = wh(s, {
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
    if (Dt) {
      const T = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(T);
    }
  };
  oe(n, async (y, T) => {
    const S = T !== y;
    if (await Pe(), S) {
      const E = r.value, C = kr(e.value);
      y ? (l("MOUNT"), c("enter"), C === "none" && c("after-enter")) : C === "none" || C === "undefined" || t.value?.display === "none" ? (l("UNMOUNT"), c("leave"), c("after-leave")) : T && E !== C ? (l("ANIMATION_OUT"), c("leave")) : (l("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const T = kr(e.value), S = T.includes(CSS.escape(y.animationName)), E = u.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && S && (c(`after-${E}`), l("ANIMATION_END"), !i.value)) {
      const C = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = C);
      });
    }
    y.target === e.value && T === "none" && l("ANIMATION_END");
  }, f = (y) => {
    y.target === e.value && (r.value = kr(e.value));
  }, p = oe(e, (y, T) => {
    y ? (t.value = getComputedStyle(y), y.addEventListener("animationstart", f), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (l("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), T?.removeEventListener("animationstart", f), T?.removeEventListener("animationcancel", d), T?.removeEventListener("animationend", d));
  }, { immediate: !0 }), m = oe(u, () => {
    const y = kr(e.value);
    r.value = u.value === "mounted" ? y : "none";
  });
  return Qt(() => {
    p(), m();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(u.value)) };
}
function kr(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Kr = j({
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
    const { present: r, forceMount: i } = xn(n), s = M(), { isPresent: o } = xh(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = Ss(a || []);
    const u = Zt();
    if (a && a?.length > 1) {
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
    return () => i.value || r.value || o.value ? bt(e.default({ present: o.value })[0], { ref: (l) => {
      const c = en(l);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const Qi = j({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = Ss(t.default()), i = r.findIndex((u) => u.type !== uc);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? ve(e, s.props) : e, a = cc({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), Eh = [
  "area",
  "img",
  "input"
], je = j({
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
    return typeof r == "string" && Eh.includes(r) ? () => bt(r, e) : r !== "template" ? () => bt(n.as, e, { default: t.default }) : () => bt(Qi, e, { default: t.default });
  }
});
function Ji() {
  const n = M(), e = A(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : en(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Lt, Ch] = lt("DialogRoot");
var Ah = /* @__PURE__ */ j({
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
    const t = n, i = /* @__PURE__ */ Zn(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = M(), o = M(), { modal: a } = xn(t);
    return Ch({
      open: i,
      modal: a,
      openModal: () => {
        i.value = !0;
      },
      onOpenChange: (u) => {
        i.value = u;
      },
      onOpenToggle: () => {
        i.value = !i.value;
      },
      contentId: "",
      titleId: "",
      descriptionId: "",
      triggerElement: s,
      contentElement: o
    }), (u, l) => Q(u.$slots, "default", {
      open: h(i),
      close: () => i.value = !1
    });
  }
}), Ih = Ah, Rh = /* @__PURE__ */ j({
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
    ke();
    const t = Lt();
    return (r, i) => (k(), V(h(je), ve(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => h(t).onOpenChange(!1))
    }), {
      default: z(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), Ph = Rh;
const Mh = "dismissableLayer.pointerDownOutside", Oh = "dismissableLayer.focusOutside";
function Ml(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function Dh(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = M(!1), s = M(() => {
  });
  return tt((o) => {
    if (!Dt || !We(t)) return;
    const a = async (l) => {
      const c = l.target;
      if (!(!e?.value || !c)) {
        if (Ml(e.value, c)) {
          i.value = !1;
          return;
        }
        if (l.target && !i.value) {
          let f = function() {
            xl(Mh, n, d);
          };
          const d = { originalEvent: l };
          l.pointerType === "touch" ? (r.removeEventListener("click", s.value), s.value = f, r.addEventListener("click", s.value, { once: !0 })) : f();
        } else r.removeEventListener("click", s.value);
        i.value = !1;
      }
    }, u = window.setTimeout(() => {
      r.addEventListener("pointerdown", a);
    }, 0);
    o(() => {
      window.clearTimeout(u), r.removeEventListener("pointerdown", a), r.removeEventListener("click", s.value);
    });
  }), { onPointerDownCapture: () => {
    We(t) && (i.value = !0);
  } };
}
function Lh(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = M(!1);
  return tt((s) => {
    if (!Dt || !We(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Pe(), await Pe();
      const u = a.target;
      !e.value || !u || Ml(e.value, u) || a.target && !i.value && xl(Oh, n, { originalEvent: a });
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
const et = cs({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var $h = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = A(() => s.value?.ownerDocument ?? globalThis.document), a = A(() => et.layersRoot), u = A(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), l = A(() => et.layersWithOutsidePointerEventsDisabled.size > 0), c = A(() => {
      const p = Array.from(a.value), [m] = [...et.layersWithOutsidePointerEventsDisabled].slice(-1), v = p.indexOf(m);
      return u.value >= v;
    }), d = Dh(async (p) => {
      const m = [...et.branches].some((v) => v?.contains(p.target));
      !c.value || m || (r("pointerDownOutside", p), r("interactOutside", p), await Pe(), p.defaultPrevented || r("dismiss"));
    }, s), f = Lh((p) => {
      [...et.branches].some((v) => v?.contains(p.target)) || (r("focusOutside", p), r("interactOutside", p), p.defaultPrevented || r("dismiss"));
    }, s);
    return ah("Escape", (p) => {
      u.value === a.value.size - 1 && (r("escapeKeyDown", p), p.defaultPrevented || r("dismiss"));
    }), tt((p) => {
      s.value && (t.disableOutsidePointerEvents && (et.layersWithOutsidePointerEventsDisabled.size === 0 && (et.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), et.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), p(() => {
        t.disableOutsidePointerEvents && et.layersWithOutsidePointerEventsDisabled.size === 1 && !Lr(et.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = et.originalBodyPointerEvents);
      }));
    }), tt((p) => {
      p(() => {
        s.value && (a.value.delete(s.value), et.layersWithOutsidePointerEventsDisabled.delete(s.value));
      });
    }), (p, m) => (k(), V(h(je), {
      ref: h(i),
      "as-child": p.asChild,
      as: p.as,
      "data-dismissable-layer": "",
      style: Yt({ pointerEvents: l.value ? c.value ? "auto" : "none" : void 0 }),
      onFocusCapture: h(f).onFocusCapture,
      onBlurCapture: h(f).onBlurCapture,
      onPointerdownCapture: h(d).onPointerDownCapture
    }, {
      default: z(() => [Q(p.$slots, "default")]),
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
}), Ol = $h;
const Nh = /* @__PURE__ */ Zp(() => M([]));
function Bh() {
  const n = Nh();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = sa(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = sa(n.value, e), n.value[0]?.resume();
    }
  };
}
function sa(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const Mi = "focusScope.autoFocusOnMount", Oi = "focusScope.autoFocusOnUnmount", oa = {
  bubbles: !1,
  cancelable: !0
};
function zh(n, { select: e = !1 } = {}) {
  const t = Ue();
  for (const r of n)
    if (At(r, { select: e }), Ue() !== t) return !0;
}
function Fh(n) {
  const e = Dl(n), t = aa(e, n), r = aa(e.reverse(), n);
  return [t, r];
}
function Dl(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function aa(n, e) {
  for (const t of n) if (!qh(t, { upTo: e })) return t;
}
function qh(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Vh(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function At(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Ue();
    n.focus({ preventScroll: !0 }), n !== t && Vh(n) && e && n.select();
  }
}
var Hh = /* @__PURE__ */ j({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = ke(), o = M(null), a = Bh(), u = cs({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    tt((c) => {
      if (!Dt) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(y) {
        if (u.paused || !d) return;
        const T = y.target;
        d.contains(T) ? o.value = T : At(o.value, { select: !0 });
      }
      function p(y) {
        if (u.paused || !d) return;
        const T = y.relatedTarget;
        T !== null && (d.contains(T) || At(o.value, { select: !0 }));
      }
      function m(y) {
        d.contains(o.value) || At(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const v = new MutationObserver(m);
      d && v.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), v.disconnect();
      });
    }), tt(async (c) => {
      const d = s.value;
      if (await Pe(), !d) return;
      a.add(u);
      const f = Ue();
      if (!d.contains(f)) {
        const m = new CustomEvent(Mi, oa);
        d.addEventListener(Mi, (v) => r("mountAutoFocus", v)), d.dispatchEvent(m), m.defaultPrevented || (zh(Dl(d), { select: !0 }), Ue() === f && At(d));
      }
      c(() => {
        d.removeEventListener(Mi, (y) => r("mountAutoFocus", y));
        const m = new CustomEvent(Oi, oa), v = (y) => {
          r("unmountAutoFocus", y);
        };
        d.addEventListener(Oi, v), d.dispatchEvent(m), setTimeout(() => {
          m.defaultPrevented || At(f ?? document.body, { select: !0 }), d.removeEventListener(Oi, v), a.remove(u);
        }, 0);
      });
    });
    function l(c) {
      if (!t.loop && !t.trapped || u.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, f = Ue();
      if (d && f) {
        const p = c.currentTarget, [m, v] = Fh(p);
        m && v ? !c.shiftKey && f === v ? (c.preventDefault(), t.loop && At(m, { select: !0 })) : c.shiftKey && f === m && (c.preventDefault(), t.loop && At(v, { select: !0 })) : f === p && c.preventDefault();
      }
    }
    return (c, d) => (k(), V(h(je), {
      ref_key: "currentRef",
      ref: i,
      tabindex: "-1",
      "as-child": c.asChild,
      as: c.as,
      onKeydown: l
    }, {
      default: z(() => [Q(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), Ll = Hh;
const Wh = "menu.itemSelect", es = ["Enter", " "], Uh = [
  "ArrowDown",
  "PageUp",
  "Home"
], $l = [
  "ArrowUp",
  "PageDown",
  "End"
], jh = [...Uh, ...$l];
[...es], [...es];
function Nl(n) {
  return n ? "open" : "closed";
}
function Kh(n) {
  const e = Ue();
  for (const t of n)
    if (t === e || (t.focus(), Ue() !== e)) return;
}
function Gh(n, e) {
  const { x: t, y: r } = n;
  let i = !1;
  for (let s = 0, o = e.length - 1; s < e.length; o = s++) {
    const a = e[s].x, u = e[s].y, l = e[o].x, c = e[o].y;
    u > r != c > r && t < (l - a) * (r - u) / (c - u) + a && (i = !i);
  }
  return i;
}
function Xh(n, e) {
  if (!e) return !1;
  const t = {
    x: n.clientX,
    y: n.clientY
  };
  return Gh(t, e);
}
function ts(n) {
  return n.pointerType === "mouse";
}
const Yh = "DialogTitle", Zh = "DialogContent";
function Qh({ titleName: n = Yh, contentName: e = Zh, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  _e(() => {
    document.getElementById(r) || console.warn(o);
    const l = s.value?.getAttribute("aria-describedby");
    i && l && (document.getElementById(i) || console.warn(a));
  });
}
var Jh = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Lt(), { forwardRef: s, currentElement: o } = ke();
    return i.titleId ||= Un(void 0, "reka-dialog-title"), i.descriptionId ||= Un(void 0, "reka-dialog-description"), _e(() => {
      i.contentElement = o, Ue() !== document.body && (i.triggerElement.value = Ue());
    }), process.env.NODE_ENV !== "production" && Qh({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, u) => (k(), V(h(Ll), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (l) => r("openAutoFocus", l)),
      onUnmountAutoFocus: u[6] || (u[6] = (l) => r("closeAutoFocus", l))
    }, {
      default: z(() => [q(h(Ol), ve({
        id: h(i).contentId,
        ref: h(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": h(i).descriptionId,
        "aria-labelledby": h(i).titleId,
        "data-state": h(Nl)(h(i).open.value)
      }, a.$attrs, {
        onDismiss: u[0] || (u[0] = (l) => h(i).onOpenChange(!1)),
        onEscapeKeyDown: u[1] || (u[1] = (l) => r("escapeKeyDown", l)),
        onFocusOutside: u[2] || (u[2] = (l) => r("focusOutside", l)),
        onInteractOutside: u[3] || (u[3] = (l) => r("interactOutside", l)),
        onPointerDownOutside: u[4] || (u[4] = (l) => r("pointerDownOutside", l))
      }), {
        default: z(() => [Q(a.$slots, "default")]),
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
}), Bl = Jh, em = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Lt(), s = Qn(r), { forwardRef: o, currentElement: a } = ke();
    return Pl(a), (u, l) => (k(), V(Bl, ve({
      ...t,
      ...h(s)
    }, {
      ref: h(o),
      "trap-focus": h(i).open.value,
      "disable-outside-pointer-events": !0,
      onCloseAutoFocus: l[0] || (l[0] = (c) => {
        c.defaultPrevented || (c.preventDefault(), h(i).triggerElement.value?.focus());
      }),
      onPointerDownOutside: l[1] || (l[1] = (c) => {
        const d = c.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0;
        (d.button === 2 || f) && c.preventDefault();
      }),
      onFocusOutside: l[2] || (l[2] = (c) => {
        c.preventDefault();
      })
    }), {
      default: z(() => [Q(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), tm = em, nm = /* @__PURE__ */ j({
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
    const t = n, i = Qn(e);
    ke();
    const s = Lt(), o = M(!1), a = M(!1);
    return (u, l) => (k(), V(Bl, ve({
      ...t,
      ...h(i)
    }, {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      onCloseAutoFocus: l[0] || (l[0] = (c) => {
        c.defaultPrevented || (o.value || h(s).triggerElement.value?.focus(), c.preventDefault()), o.value = !1, a.value = !1;
      }),
      onInteractOutside: l[1] || (l[1] = (c) => {
        c.defaultPrevented || (o.value = !0, c.detail.originalEvent.type === "pointerdown" && (a.value = !0));
        const d = c.target;
        h(s).triggerElement.value?.contains(d) && c.preventDefault(), c.detail.originalEvent.type === "focusin" && a.value && c.preventDefault();
      })
    }), {
      default: z(() => [Q(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), rm = nm, im = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Lt(), s = Qn(r), { forwardRef: o } = ke();
    return (a, u) => (k(), V(h(Kr), { present: a.forceMount || h(i).open.value }, {
      default: z(() => [h(i).modal.value ? (k(), V(tm, ve({
        key: 0,
        ref: h(o)
      }, {
        ...t,
        ...h(s),
        ...a.$attrs
      }), {
        default: z(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16)) : (k(), V(rm, ve({
        key: 1,
        ref: h(o)
      }, {
        ...t,
        ...h(s),
        ...a.$attrs
      }), {
        default: z(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), sm = im, om = /* @__PURE__ */ j({
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
    const e = Lt();
    return Il(!0), ke(), (t, r) => (k(), V(h(je), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": h(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: z(() => [Q(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), am = om, lm = /* @__PURE__ */ j({
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
    const e = Lt(), { forwardRef: t } = ke();
    return (r, i) => h(e)?.modal.value ? (k(), V(h(Kr), {
      key: 0,
      present: r.forceMount || h(e).open.value
    }, {
      default: z(() => [q(am, ve(r.$attrs, {
        ref: h(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: z(() => [Q(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : G("v-if", !0);
  }
}), um = lm, cm = /* @__PURE__ */ j({
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
    const e = /* @__PURE__ */ sh();
    return (t, r) => h(e) || t.forceMount ? (k(), V(dc, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [Q(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : G("v-if", !0);
  }
}), zl = cm, dm = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(zl), pt(Rt(e)), {
      default: z(() => [Q(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), fm = dm, pm = /* @__PURE__ */ j({
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
    const e = n, t = Lt();
    return ke(), (r, i) => (k(), V(h(je), ve(e, { id: h(t).titleId }), {
      default: z(() => [Q(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), hm = pm;
const la = "data-reka-collection-item";
function Es(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const c = M(/* @__PURE__ */ new Map());
    i = {
      collectionRef: M(),
      itemMap: c
    }, _n(r, i);
  } else i = Gn(r);
  const s = (c = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${la}]`)), m = Array.from(i.itemMap.value.values()).sort((v, y) => f.indexOf(v.ref) - f.indexOf(y.ref));
    return c ? m : m.filter((v) => v.ref.dataset.disabled !== "");
  }, o = j({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: m } = Ji();
      return oe(m, () => {
        i.collectionRef.value = m.value;
      }), () => bt(Qi, {
        ref: p,
        ...f
      }, d);
    }
  }), a = j({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: m } = Ji();
      return tt((v) => {
        if (m.value) {
          const y = fc(m.value);
          i.itemMap.value.set(y, {
            ref: m.value,
            value: c.value
          }), v(() => i.itemMap.value.delete(y));
        }
      }), () => bt(Qi, {
        ...f,
        [la]: "",
        ref: p
      }, d);
    }
  }), u = A(() => Array.from(i.itemMap.value.values())), l = A(() => i.itemMap.value.size);
  return {
    getItems: s,
    reactiveItems: u,
    itemMapSize: l,
    CollectionSlot: o,
    CollectionItem: a
  };
}
const mm = "rovingFocusGroup.onEntryFocus", vm = {
  bubbles: !1,
  cancelable: !0
}, gm = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function ym(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function bm(n, e, t) {
  const r = ym(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return gm[r];
}
function Fl(n, e = !1) {
  const t = Ue();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), Ue() !== t)) return;
}
function km(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [wm, Sm] = lt("RovingFocusGroup");
var Tm = /* @__PURE__ */ j({
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
    const r = n, i = t, { loop: s, orientation: o, dir: a } = xn(r), u = xs(a), l = /* @__PURE__ */ Zn(r, "currentTabStopId", i, {
      defaultValue: r.defaultCurrentTabStopId,
      passive: r.currentTabStopId === void 0
    }), c = M(!1), d = M(!1), f = M(0), { getItems: p, CollectionSlot: m } = Es({ isProvider: !0 });
    function v(T) {
      const S = !d.value;
      if (T.currentTarget && T.target === T.currentTarget && S && !c.value) {
        const E = new CustomEvent(mm, vm);
        if (T.currentTarget.dispatchEvent(E), i("entryFocus", E), !E.defaultPrevented) {
          const C = p().map((b) => b.ref).filter((b) => b.dataset.disabled !== ""), B = C.find((b) => b.getAttribute("data-active") === ""), x = C.find((b) => b.getAttribute("data-highlighted") === ""), _ = C.find((b) => b.id === l.value), w = [
            B,
            x,
            _,
            ...C
          ].filter(Boolean);
          Fl(w, r.preventScrollOnEntryFocus);
        }
      }
      d.value = !1;
    }
    function y() {
      setTimeout(() => {
        d.value = !1;
      }, 1);
    }
    return e({ getItems: p }), Sm({
      loop: s,
      dir: u,
      orientation: o,
      currentTabStopId: l,
      onItemFocus: (T) => {
        l.value = T;
      },
      onItemShiftTab: () => {
        c.value = !0;
      },
      onFocusableItemAdd: () => {
        f.value++;
      },
      onFocusableItemRemove: () => {
        f.value--;
      }
    }), (T, S) => (k(), V(h(m), null, {
      default: z(() => [q(h(je), {
        tabindex: c.value || f.value === 0 ? -1 : 0,
        "data-orientation": h(o),
        as: T.as,
        "as-child": T.asChild,
        dir: h(u),
        style: { outline: "none" },
        onMousedown: S[0] || (S[0] = (E) => d.value = !0),
        onMouseup: y,
        onFocus: v,
        onBlur: S[1] || (S[1] = (E) => c.value = !1)
      }, {
        default: z(() => [Q(T.$slots, "default")]),
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
}), _m = Tm, xm = /* @__PURE__ */ j({
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
    const e = n, t = wm(), r = Un(), i = A(() => e.tabStopId || r), s = A(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = Es();
    _e(() => {
      e.focusable && t.onFocusableItemAdd();
    }), Qt(() => {
      e.focusable && t.onFocusableItemRemove();
    });
    function u(l) {
      if (l.key === "Tab" && l.shiftKey) {
        t.onItemShiftTab();
        return;
      }
      if (l.target !== l.currentTarget) return;
      const c = bm(l, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (l.metaKey || l.ctrlKey || l.altKey || !e.allowShiftKey && l.shiftKey) return;
        l.preventDefault();
        let d = [...o().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const f = d.indexOf(l.currentTarget);
          d = t.loop.value ? km(d, f + 1) : d.slice(f + 1);
        }
        Pe(() => Fl(d));
      }
    }
    return (l, c) => (k(), V(h(a), null, {
      default: z(() => [q(h(je), {
        tabindex: s.value ? 0 : -1,
        "data-orientation": h(t).orientation.value,
        "data-active": l.active ? "" : void 0,
        "data-disabled": l.focusable ? void 0 : "",
        as: l.as,
        "as-child": l.asChild,
        onMousedown: c[0] || (c[0] = (d) => {
          l.focusable ? h(t).onItemFocus(i.value) : d.preventDefault();
        }),
        onFocus: c[1] || (c[1] = (d) => h(t).onItemFocus(i.value)),
        onKeydown: u
      }, {
        default: z(() => [Q(l.$slots, "default")]),
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
}), Em = xm, Cm = /* @__PURE__ */ j({
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
    return (e, t) => (k(), V(h(je), {
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
      default: z(() => [Q(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), Am = Cm, Im = /* @__PURE__ */ j({
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
    const e = n, { primitiveElement: t, currentElement: r } = Ji(), i = A(() => e.checked ?? e.value);
    return oe(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, u = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(u, "value").set;
      if (c && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        c.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (k(), V(Am, ve({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), ua = Im, Rm = /* @__PURE__ */ j({
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
    return (i, s) => (k(), $(ye, null, [G(" We render single input if it's required "), t.value ? (k(), V(ua, ve({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (k(!0), $(ye, { key: 1 }, ze(r.value, (o) => (k(), V(ua, ve({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), Pm = Rm;
const [Mm] = lt("CheckboxGroupRoot");
function $r(n) {
  return n === "indeterminate";
}
function ql(n) {
  return $r(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [Om, Dm] = lt("CheckboxRoot");
var Lm = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = Mm(null), a = /* @__PURE__ */ Zn(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), u = A(() => o?.disabled.value || t.disabled), l = A(() => Lr(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : ra(o.modelValue.value, t.value));
    function c() {
      if (Lr(o?.modelValue.value))
        a.value = $r(a.value) ? !0 : !a.value;
      else {
        const p = [...o.modelValue.value || []];
        if (ra(p, t.value)) {
          const m = p.findIndex((v) => Xi(v, t.value));
          p.splice(m, 1);
        } else p.push(t.value);
        o.modelValue.value = p;
      }
    }
    const d = ph(s), f = A(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return Dm({
      disabled: u,
      state: l
    }), (p, m) => (k(), V(Ht(h(o)?.rovingFocus.value ? h(Em) : h(je)), ve(p.$attrs, {
      id: p.id,
      ref: h(i),
      role: "checkbox",
      "as-child": p.asChild,
      as: p.as,
      type: p.as === "button" ? "button" : void 0,
      "aria-checked": h($r)(l.value) ? "mixed" : l.value,
      "aria-required": p.required,
      "aria-label": p.$attrs["aria-label"] || f.value,
      "data-state": h(ql)(l.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: h(o)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: Wa(De(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: z(() => [Q(p.$slots, "default", {
        modelValue: h(a),
        state: l.value
      }), h(d) && p.name && !h(o) ? (k(), V(h(Pm), {
        key: 0,
        type: "checkbox",
        checked: !!l.value,
        name: p.name,
        value: p.value,
        disabled: u.value,
        required: p.required
      }, null, 8, [
        "checked",
        "name",
        "value",
        "disabled",
        "required"
      ])) : G("v-if", !0)]),
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
}), $m = Lm, Nm = /* @__PURE__ */ j({
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
    const { forwardRef: e } = ke(), t = Om();
    return (r, i) => (k(), V(h(Kr), { present: r.forceMount || h($r)(h(t).state.value) || h(t).state.value === !0 }, {
      default: z(() => [q(h(je), ve({
        ref: h(e),
        "data-state": h(ql)(h(t).state.value),
        "data-disabled": h(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: z(() => [Q(r.$slots, "default")]),
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
}), Bm = Nm;
const [Vl, zm] = lt("PopperRoot");
var Fm = /* @__PURE__ */ j({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = M();
    return zm({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => Q(t.$slots, "default");
  }
}), qm = Fm, Vm = /* @__PURE__ */ j({
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
    const e = n, { forwardRef: t, currentElement: r } = ke(), i = Vl();
    return Ua(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (k(), V(h(je), {
      ref: h(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: z(() => [Q(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Hm = Vm;
function Wm(n) {
  return n !== null;
}
function Um(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, u = o ? 0 : n.arrowHeight, [l, c] = ns(t), d = {
        start: "0%",
        center: "50%",
        end: "100%"
      }[c], f = (i.arrow?.x ?? 0) + a / 2, p = (i.arrow?.y ?? 0) + u / 2;
      let m = "", v = "";
      return l === "bottom" ? (m = o ? d : `${f}px`, v = `${-u}px`) : l === "top" ? (m = o ? d : `${f}px`, v = `${r.floating.height + u}px`) : l === "right" ? (m = `${-u}px`, v = o ? d : `${p}px`) : l === "left" && (m = `${r.floating.width + u}px`, v = o ? d : `${p}px`), { data: {
        x: m,
        y: v
      } };
    }
  };
}
function ns(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const jm = ["top", "right", "bottom", "left"], Mt = Math.min, Ze = Math.max, Nr = Math.round, wr = Math.floor, ht = (n) => ({
  x: n,
  y: n
}), Km = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Gm = {
  start: "end",
  end: "start"
};
function rs(n, e, t) {
  return Ze(n, Mt(e, t));
}
function kt(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function wt(n) {
  return n.split("-")[0];
}
function Cn(n) {
  return n.split("-")[1];
}
function Cs(n) {
  return n === "x" ? "y" : "x";
}
function As(n) {
  return n === "y" ? "height" : "width";
}
const Xm = /* @__PURE__ */ new Set(["top", "bottom"]);
function ft(n) {
  return Xm.has(wt(n)) ? "y" : "x";
}
function Is(n) {
  return Cs(ft(n));
}
function Ym(n, e, t) {
  t === void 0 && (t = !1);
  const r = Cn(n), i = Is(n), s = As(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Br(o)), [o, Br(o)];
}
function Zm(n) {
  const e = Br(n);
  return [is(n), e, is(e)];
}
function is(n) {
  return n.replace(/start|end/g, (e) => Gm[e]);
}
const ca = ["left", "right"], da = ["right", "left"], Qm = ["top", "bottom"], Jm = ["bottom", "top"];
function ev(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? da : ca : e ? ca : da;
    case "left":
    case "right":
      return e ? Qm : Jm;
    default:
      return [];
  }
}
function tv(n, e, t, r) {
  const i = Cn(n);
  let s = ev(wt(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(is)))), s;
}
function Br(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Km[e]);
}
function nv(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Hl(n) {
  return typeof n != "number" ? nv(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function zr(n) {
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
function fa(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = ft(e), o = Is(e), a = As(o), u = wt(e), l = s === "y", c = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
  let p;
  switch (u) {
    case "top":
      p = {
        x: c,
        y: r.y - i.height
      };
      break;
    case "bottom":
      p = {
        x: c,
        y: r.y + r.height
      };
      break;
    case "right":
      p = {
        x: r.x + r.width,
        y: d
      };
      break;
    case "left":
      p = {
        x: r.x - i.width,
        y: d
      };
      break;
    default:
      p = {
        x: r.x,
        y: r.y
      };
  }
  switch (Cn(e)) {
    case "start":
      p[o] -= f * (t && l ? -1 : 1);
      break;
    case "end":
      p[o] += f * (t && l ? -1 : 1);
      break;
  }
  return p;
}
async function rv(n, e) {
  var t;
  e === void 0 && (e = {});
  const {
    x: r,
    y: i,
    platform: s,
    rects: o,
    elements: a,
    strategy: u
  } = n, {
    boundary: l = "clippingAncestors",
    rootBoundary: c = "viewport",
    elementContext: d = "floating",
    altBoundary: f = !1,
    padding: p = 0
  } = kt(e, n), m = Hl(p), y = a[f ? d === "floating" ? "reference" : "floating" : d], T = zr(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(y))) == null || t ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: l,
    rootBoundary: c,
    strategy: u
  })), S = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, E = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), C = await (s.isElement == null ? void 0 : s.isElement(E)) ? await (s.getScale == null ? void 0 : s.getScale(E)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, B = zr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: S,
    offsetParent: E,
    strategy: u
  }) : S);
  return {
    top: (T.top - B.top + m.top) / C.y,
    bottom: (B.bottom - T.bottom + m.bottom) / C.y,
    left: (T.left - B.left + m.left) / C.x,
    right: (B.right - T.right + m.right) / C.x
  };
}
const iv = async (n, e, t) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: s = [],
    platform: o
  } = t, a = s.filter(Boolean), u = await (o.isRTL == null ? void 0 : o.isRTL(e));
  let l = await o.getElementRects({
    reference: n,
    floating: e,
    strategy: i
  }), {
    x: c,
    y: d
  } = fa(l, r, u), f = r, p = {}, m = 0;
  for (let y = 0; y < a.length; y++) {
    var v;
    const {
      name: T,
      fn: S
    } = a[y], {
      x: E,
      y: C,
      data: B,
      reset: x
    } = await S({
      x: c,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: p,
      rects: l,
      platform: {
        ...o,
        detectOverflow: (v = o.detectOverflow) != null ? v : rv
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = E ?? c, d = C ?? d, p = {
      ...p,
      [T]: {
        ...p[T],
        ...B
      }
    }, x && m <= 50 && (m++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : x.rects), {
      x: c,
      y: d
    } = fa(l, f, u)), y = -1);
  }
  return {
    x: c,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: p
  };
}, sv = (n) => ({
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
      middlewareData: u
    } = e, {
      element: l,
      padding: c = 0
    } = kt(n, e) || {};
    if (l == null)
      return {};
    const d = Hl(c), f = {
      x: t,
      y: r
    }, p = Is(i), m = As(p), v = await o.getDimensions(l), y = p === "y", T = y ? "top" : "left", S = y ? "bottom" : "right", E = y ? "clientHeight" : "clientWidth", C = s.reference[m] + s.reference[p] - f[p] - s.floating[m], B = f[p] - s.reference[p], x = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l));
    let _ = x ? x[E] : 0;
    (!_ || !await (o.isElement == null ? void 0 : o.isElement(x))) && (_ = a.floating[E] || s.floating[m]);
    const w = C / 2 - B / 2, b = _ / 2 - v[m] / 2 - 1, R = Mt(d[T], b), D = Mt(d[S], b), H = R, L = _ - v[m] - D, O = _ / 2 - v[m] / 2 + w, P = rs(H, O, L), W = !u.arrow && Cn(i) != null && O !== P && s.reference[m] / 2 - (O < H ? R : D) - v[m] / 2 < 0, X = W ? O < H ? O - H : O - L : 0;
    return {
      [p]: f[p] + X,
      data: {
        [p]: P,
        centerOffset: O - P - X,
        ...W && {
          alignmentOffset: X
        }
      },
      reset: W
    };
  }
}), ov = function(n) {
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
        platform: u,
        elements: l
      } = e, {
        mainAxis: c = !0,
        crossAxis: d = !0,
        fallbackPlacements: f,
        fallbackStrategy: p = "bestFit",
        fallbackAxisSideDirection: m = "none",
        flipAlignment: v = !0,
        ...y
      } = kt(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const T = wt(i), S = ft(a), E = wt(a) === a, C = await (u.isRTL == null ? void 0 : u.isRTL(l.floating)), B = f || (E || !v ? [Br(a)] : Zm(a)), x = m !== "none";
      !f && x && B.push(...tv(a, v, m, C));
      const _ = [a, ...B], w = await u.detectOverflow(e, y), b = [];
      let R = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (c && b.push(w[T]), d) {
        const O = Ym(i, o, C);
        b.push(w[O[0]], w[O[1]]);
      }
      if (R = [...R, {
        placement: i,
        overflows: b
      }], !b.every((O) => O <= 0)) {
        var D, H;
        const O = (((D = s.flip) == null ? void 0 : D.index) || 0) + 1, P = _[O];
        if (P && (!(d === "alignment" ? S !== ft(P) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        R.every((ie) => ft(ie.placement) === S ? ie.overflows[0] > 0 : !0)))
          return {
            data: {
              index: O,
              overflows: R
            },
            reset: {
              placement: P
            }
          };
        let W = (H = R.filter((X) => X.overflows[0] <= 0).sort((X, ie) => X.overflows[1] - ie.overflows[1])[0]) == null ? void 0 : H.placement;
        if (!W)
          switch (p) {
            case "bestFit": {
              var L;
              const X = (L = R.filter((ie) => {
                if (x) {
                  const se = ft(ie.placement);
                  return se === S || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  se === "y";
                }
                return !0;
              }).map((ie) => [ie.placement, ie.overflows.filter((se) => se > 0).reduce((se, be) => se + be, 0)]).sort((ie, se) => ie[1] - se[1])[0]) == null ? void 0 : L[0];
              X && (W = X);
              break;
            }
            case "initialPlacement":
              W = a;
              break;
          }
        if (i !== W)
          return {
            reset: {
              placement: W
            }
          };
      }
      return {};
    }
  };
};
function pa(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function ha(n) {
  return jm.some((e) => n[e] >= 0);
}
const av = function(n) {
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
      } = kt(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = pa(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: ha(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = pa(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: ha(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Wl = /* @__PURE__ */ new Set(["left", "top"]);
async function lv(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = wt(t), a = Cn(t), u = ft(t) === "y", l = Wl.has(o) ? -1 : 1, c = s && u ? -1 : 1, d = kt(e, n);
  let {
    mainAxis: f,
    crossAxis: p,
    alignmentAxis: m
  } = typeof d == "number" ? {
    mainAxis: d,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: d.mainAxis || 0,
    crossAxis: d.crossAxis || 0,
    alignmentAxis: d.alignmentAxis
  };
  return a && typeof m == "number" && (p = a === "end" ? m * -1 : m), u ? {
    x: p * c,
    y: f * l
  } : {
    x: f * l,
    y: p * c
  };
}
const uv = function(n) {
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
      } = e, u = await lv(e, n);
      return o === ((t = a.offset) == null ? void 0 : t.placement) && (r = a.arrow) != null && r.alignmentOffset ? {} : {
        x: i + u.x,
        y: s + u.y,
        data: {
          ...u,
          placement: o
        }
      };
    }
  };
}, cv = function(n) {
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
        limiter: u = {
          fn: (T) => {
            let {
              x: S,
              y: E
            } = T;
            return {
              x: S,
              y: E
            };
          }
        },
        ...l
      } = kt(n, e), c = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, l), f = ft(wt(i)), p = Cs(f);
      let m = c[p], v = c[f];
      if (o) {
        const T = p === "y" ? "top" : "left", S = p === "y" ? "bottom" : "right", E = m + d[T], C = m - d[S];
        m = rs(E, m, C);
      }
      if (a) {
        const T = f === "y" ? "top" : "left", S = f === "y" ? "bottom" : "right", E = v + d[T], C = v - d[S];
        v = rs(E, v, C);
      }
      const y = u.fn({
        ...e,
        [p]: m,
        [f]: v
      });
      return {
        ...y,
        data: {
          x: y.x - t,
          y: y.y - r,
          enabled: {
            [p]: o,
            [f]: a
          }
        }
      };
    }
  };
}, dv = function(n) {
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
        mainAxis: u = !0,
        crossAxis: l = !0
      } = kt(n, e), c = {
        x: t,
        y: r
      }, d = ft(i), f = Cs(d);
      let p = c[f], m = c[d];
      const v = kt(a, e), y = typeof v == "number" ? {
        mainAxis: v,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...v
      };
      if (u) {
        const E = f === "y" ? "height" : "width", C = s.reference[f] - s.floating[E] + y.mainAxis, B = s.reference[f] + s.reference[E] - y.mainAxis;
        p < C ? p = C : p > B && (p = B);
      }
      if (l) {
        var T, S;
        const E = f === "y" ? "width" : "height", C = Wl.has(wt(i)), B = s.reference[d] - s.floating[E] + (C && ((T = o.offset) == null ? void 0 : T[d]) || 0) + (C ? 0 : y.crossAxis), x = s.reference[d] + s.reference[E] + (C ? 0 : ((S = o.offset) == null ? void 0 : S[d]) || 0) - (C ? y.crossAxis : 0);
        m < B ? m = B : m > x && (m = x);
      }
      return {
        [f]: p,
        [d]: m
      };
    }
  };
}, fv = function(n) {
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
        apply: u = () => {
        },
        ...l
      } = kt(n, e), c = await o.detectOverflow(e, l), d = wt(i), f = Cn(i), p = ft(i) === "y", {
        width: m,
        height: v
      } = s.floating;
      let y, T;
      d === "top" || d === "bottom" ? (y = d, T = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (T = d, y = f === "end" ? "top" : "bottom");
      const S = v - c.top - c.bottom, E = m - c.left - c.right, C = Mt(v - c[y], S), B = Mt(m - c[T], E), x = !e.middlewareData.shift;
      let _ = C, w = B;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (w = E), (r = e.middlewareData.shift) != null && r.enabled.y && (_ = S), x && !f) {
        const R = Ze(c.left, 0), D = Ze(c.right, 0), H = Ze(c.top, 0), L = Ze(c.bottom, 0);
        p ? w = m - 2 * (R !== 0 || D !== 0 ? R + D : Ze(c.left, c.right)) : _ = v - 2 * (H !== 0 || L !== 0 ? H + L : Ze(c.top, c.bottom));
      }
      await u({
        ...e,
        availableWidth: w,
        availableHeight: _
      });
      const b = await o.getDimensions(a.floating);
      return m !== b.width || v !== b.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Gr() {
  return typeof window < "u";
}
function tn(n) {
  return Rs(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Je(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function yt(n) {
  var e;
  return (e = (Rs(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function Rs(n) {
  return Gr() ? n instanceof Node || n instanceof Je(n).Node : !1;
}
function ot(n) {
  return Gr() ? n instanceof Element || n instanceof Je(n).Element : !1;
}
function vt(n) {
  return Gr() ? n instanceof HTMLElement || n instanceof Je(n).HTMLElement : !1;
}
function ma(n) {
  return !Gr() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof Je(n).ShadowRoot;
}
const pv = /* @__PURE__ */ new Set(["inline", "contents"]);
function Jn(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = at(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !pv.has(i);
}
const hv = /* @__PURE__ */ new Set(["table", "td", "th"]);
function mv(n) {
  return hv.has(tn(n));
}
const vv = [":popover-open", ":modal"];
function Xr(n) {
  return vv.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const gv = ["transform", "translate", "scale", "rotate", "perspective"], yv = ["transform", "translate", "scale", "rotate", "perspective", "filter"], bv = ["paint", "layout", "strict", "content"];
function Ps(n) {
  const e = Ms(), t = ot(n) ? at(n) : n;
  return gv.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || yv.some((r) => (t.willChange || "").includes(r)) || bv.some((r) => (t.contain || "").includes(r));
}
function kv(n) {
  let e = Ot(n);
  for (; vt(e) && !Sn(e); ) {
    if (Ps(e))
      return e;
    if (Xr(e))
      return null;
    e = Ot(e);
  }
  return null;
}
function Ms() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const wv = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function Sn(n) {
  return wv.has(tn(n));
}
function at(n) {
  return Je(n).getComputedStyle(n);
}
function Yr(n) {
  return ot(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function Ot(n) {
  if (tn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    ma(n) && n.host || // Fallback.
    yt(n)
  );
  return ma(e) ? e.host : e;
}
function Ul(n) {
  const e = Ot(n);
  return Sn(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : vt(e) && Jn(e) ? e : Ul(e);
}
function jn(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = Ul(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = Je(i);
  if (s) {
    const a = ss(o);
    return e.concat(o, o.visualViewport || [], Jn(i) ? i : [], a && t ? jn(a) : []);
  }
  return e.concat(i, jn(i, [], t));
}
function ss(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function jl(n) {
  const e = at(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = vt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = Nr(t) !== s || Nr(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function Os(n) {
  return ot(n) ? n : n.contextElement;
}
function kn(n) {
  const e = Os(n);
  if (!vt(e))
    return ht(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = jl(e);
  let o = (s ? Nr(t.width) : t.width) / r, a = (s ? Nr(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const Sv = /* @__PURE__ */ ht(0);
function Kl(n) {
  const e = Je(n);
  return !Ms() || !e.visualViewport ? Sv : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function Tv(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== Je(n) ? !1 : e;
}
function Gt(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = Os(n);
  let o = ht(1);
  e && (r ? ot(r) && (o = kn(r)) : o = kn(n));
  const a = Tv(s, t, r) ? Kl(s) : ht(0);
  let u = (i.left + a.x) / o.x, l = (i.top + a.y) / o.y, c = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = Je(s), p = r && ot(r) ? Je(r) : r;
    let m = f, v = ss(m);
    for (; v && r && p !== m; ) {
      const y = kn(v), T = v.getBoundingClientRect(), S = at(v), E = T.left + (v.clientLeft + parseFloat(S.paddingLeft)) * y.x, C = T.top + (v.clientTop + parseFloat(S.paddingTop)) * y.y;
      u *= y.x, l *= y.y, c *= y.x, d *= y.y, u += E, l += C, m = Je(v), v = ss(m);
    }
  }
  return zr({
    width: c,
    height: d,
    x: u,
    y: l
  });
}
function Zr(n, e) {
  const t = Yr(n).scrollLeft;
  return e ? e.left + t : Gt(yt(n)).left + t;
}
function Gl(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Zr(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function _v(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = yt(r), a = e ? Xr(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = ht(1);
  const c = ht(0), d = vt(r);
  if ((d || !d && !s) && ((tn(r) !== "body" || Jn(o)) && (u = Yr(r)), vt(r))) {
    const p = Gt(r);
    l = kn(r), c.x = p.x + r.clientLeft, c.y = p.y + r.clientTop;
  }
  const f = o && !d && !s ? Gl(o, u) : ht(0);
  return {
    width: t.width * l.x,
    height: t.height * l.y,
    x: t.x * l.x - u.scrollLeft * l.x + c.x + f.x,
    y: t.y * l.y - u.scrollTop * l.y + c.y + f.y
  };
}
function xv(n) {
  return Array.from(n.getClientRects());
}
function Ev(n) {
  const e = yt(n), t = Yr(n), r = n.ownerDocument.body, i = Ze(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = Ze(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Zr(n);
  const a = -t.scrollTop;
  return at(r).direction === "rtl" && (o += Ze(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const va = 25;
function Cv(n, e) {
  const t = Je(n), r = yt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, u = 0;
  if (i) {
    s = i.width, o = i.height;
    const c = Ms();
    (!c || c && e === "fixed") && (a = i.offsetLeft, u = i.offsetTop);
  }
  const l = Zr(r);
  if (l <= 0) {
    const c = r.ownerDocument, d = c.body, f = getComputedStyle(d), p = c.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, m = Math.abs(r.clientWidth - d.clientWidth - p);
    m <= va && (s -= m);
  } else l <= va && (s += l);
  return {
    width: s,
    height: o,
    x: a,
    y: u
  };
}
const Av = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function Iv(n, e) {
  const t = Gt(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = vt(n) ? kn(n) : ht(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, u = i * s.x, l = r * s.y;
  return {
    width: o,
    height: a,
    x: u,
    y: l
  };
}
function ga(n, e, t) {
  let r;
  if (e === "viewport")
    r = Cv(n, t);
  else if (e === "document")
    r = Ev(yt(n));
  else if (ot(e))
    r = Iv(e, t);
  else {
    const i = Kl(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return zr(r);
}
function Xl(n, e) {
  const t = Ot(n);
  return t === e || !ot(t) || Sn(t) ? !1 : at(t).position === "fixed" || Xl(t, e);
}
function Rv(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = jn(n, [], !1).filter((a) => ot(a) && tn(a) !== "body"), i = null;
  const s = at(n).position === "fixed";
  let o = s ? Ot(n) : n;
  for (; ot(o) && !Sn(o); ) {
    const a = at(o), u = Ps(o);
    !u && a.position === "fixed" && (i = null), (s ? !u && !i : !u && a.position === "static" && !!i && Av.has(i.position) || Jn(o) && !u && Xl(n, o)) ? r = r.filter((c) => c !== o) : i = a, o = Ot(o);
  }
  return e.set(n, r), r;
}
function Pv(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? Xr(e) ? [] : Rv(e, this._c) : [].concat(t), r], a = o[0], u = o.reduce((l, c) => {
    const d = ga(e, c, i);
    return l.top = Ze(d.top, l.top), l.right = Mt(d.right, l.right), l.bottom = Mt(d.bottom, l.bottom), l.left = Ze(d.left, l.left), l;
  }, ga(e, a, i));
  return {
    width: u.right - u.left,
    height: u.bottom - u.top,
    x: u.left,
    y: u.top
  };
}
function Mv(n) {
  const {
    width: e,
    height: t
  } = jl(n);
  return {
    width: e,
    height: t
  };
}
function Ov(n, e, t) {
  const r = vt(e), i = yt(e), s = t === "fixed", o = Gt(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = ht(0);
  function l() {
    u.x = Zr(i);
  }
  if (r || !r && !s)
    if ((tn(e) !== "body" || Jn(i)) && (a = Yr(e)), r) {
      const p = Gt(e, !0, s, e);
      u.x = p.x + e.clientLeft, u.y = p.y + e.clientTop;
    } else i && l();
  s && !r && i && l();
  const c = i && !r && !s ? Gl(i, a) : ht(0), d = o.left + a.scrollLeft - u.x - c.x, f = o.top + a.scrollTop - u.y - c.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Di(n) {
  return at(n).position === "static";
}
function ya(n, e) {
  if (!vt(n) || at(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return yt(n) === t && (t = t.ownerDocument.body), t;
}
function Yl(n, e) {
  const t = Je(n);
  if (Xr(n))
    return t;
  if (!vt(n)) {
    let i = Ot(n);
    for (; i && !Sn(i); ) {
      if (ot(i) && !Di(i))
        return i;
      i = Ot(i);
    }
    return t;
  }
  let r = ya(n, e);
  for (; r && mv(r) && Di(r); )
    r = ya(r, e);
  return r && Sn(r) && Di(r) && !Ps(r) ? t : r || kv(n) || t;
}
const Dv = async function(n) {
  const e = this.getOffsetParent || Yl, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: Ov(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function Lv(n) {
  return at(n).direction === "rtl";
}
const $v = {
  convertOffsetParentRelativeRectToViewportRelativeRect: _v,
  getDocumentElement: yt,
  getClippingRect: Pv,
  getOffsetParent: Yl,
  getElementRects: Dv,
  getClientRects: xv,
  getDimensions: Mv,
  getScale: kn,
  isElement: ot,
  isRTL: Lv
};
function Zl(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function Nv(n, e) {
  let t = null, r;
  const i = yt(n);
  function s() {
    var a;
    clearTimeout(r), (a = t) == null || a.disconnect(), t = null;
  }
  function o(a, u) {
    a === void 0 && (a = !1), u === void 0 && (u = 1), s();
    const l = n.getBoundingClientRect(), {
      left: c,
      top: d,
      width: f,
      height: p
    } = l;
    if (a || e(), !f || !p)
      return;
    const m = wr(d), v = wr(i.clientWidth - (c + f)), y = wr(i.clientHeight - (d + p)), T = wr(c), E = {
      rootMargin: -m + "px " + -v + "px " + -y + "px " + -T + "px",
      threshold: Ze(0, Mt(1, u)) || 1
    };
    let C = !0;
    function B(x) {
      const _ = x[0].intersectionRatio;
      if (_ !== u) {
        if (!C)
          return o();
        _ ? o(!1, _) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      _ === 1 && !Zl(l, n.getBoundingClientRect()) && o(), C = !1;
    }
    try {
      t = new IntersectionObserver(B, {
        ...E,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(B, E);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function Bv(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = r, l = Os(n), c = i || s ? [...l ? jn(l) : [], ...jn(e)] : [];
  c.forEach((T) => {
    i && T.addEventListener("scroll", t, {
      passive: !0
    }), s && T.addEventListener("resize", t);
  });
  const d = l && a ? Nv(l, t) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((T) => {
    let [S] = T;
    S && S.target === l && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var E;
      (E = p) == null || E.observe(e);
    })), t();
  }), l && !u && p.observe(l), p.observe(e));
  let m, v = u ? Gt(n) : null;
  u && y();
  function y() {
    const T = Gt(n);
    v && !Zl(v, T) && t(), v = T, m = requestAnimationFrame(y);
  }
  return t(), () => {
    var T;
    c.forEach((S) => {
      i && S.removeEventListener("scroll", t), s && S.removeEventListener("resize", t);
    }), d?.(), (T = p) == null || T.disconnect(), p = null, u && cancelAnimationFrame(m);
  };
}
const zv = uv, Fv = cv, ba = ov, qv = fv, Vv = av, Hv = sv, Wv = dv, Uv = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: $v,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return iv(n, e, {
    ...i,
    platform: s
  });
};
function jv(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function os(n) {
  if (jv(n)) {
    const e = n.$el;
    return Rs(e) && tn(e) === "#comment" ? null : e;
  }
  return n;
}
function yn(n) {
  return typeof n == "function" ? n() : h(n);
}
function Kv(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = os(yn(n.element));
      return t == null ? {} : Hv({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Ql(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function ka(n, e) {
  const t = Ql(n);
  return Math.round(e * t) / t;
}
function Gv(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = A(() => {
    var _;
    return (_ = yn(t.open)) != null ? _ : !0;
  }), s = A(() => yn(t.middleware)), o = A(() => {
    var _;
    return (_ = yn(t.placement)) != null ? _ : "bottom";
  }), a = A(() => {
    var _;
    return (_ = yn(t.strategy)) != null ? _ : "absolute";
  }), u = A(() => {
    var _;
    return (_ = yn(t.transform)) != null ? _ : !0;
  }), l = A(() => os(n.value)), c = A(() => os(e.value)), d = M(0), f = M(0), p = M(a.value), m = M(o.value), v = Pt({}), y = M(!1), T = A(() => {
    const _ = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return _;
    const w = ka(c.value, d.value), b = ka(c.value, f.value);
    return u.value ? {
      ..._,
      transform: "translate(" + w + "px, " + b + "px)",
      ...Ql(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: w + "px",
      top: b + "px"
    };
  });
  let S;
  function E() {
    if (l.value == null || c.value == null)
      return;
    const _ = i.value;
    Uv(l.value, c.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((w) => {
      d.value = w.x, f.value = w.y, p.value = w.strategy, m.value = w.placement, v.value = w.middlewareData, y.value = _ !== !1;
    });
  }
  function C() {
    typeof S == "function" && (S(), S = void 0);
  }
  function B() {
    if (C(), r === void 0) {
      E();
      return;
    }
    if (l.value != null && c.value != null) {
      S = r(l.value, c.value, E);
      return;
    }
  }
  function x() {
    i.value || (y.value = !1);
  }
  return oe([s, o, a, i], E, {
    flush: "sync"
  }), oe([l, c], B, {
    flush: "sync"
  }), oe(i, x, {
    flush: "sync"
  }), Fa() && qa(C), {
    x: fn(d),
    y: fn(f),
    strategy: fn(p),
    placement: fn(m),
    middlewareData: fn(v),
    isPositioned: fn(y),
    floatingStyles: T,
    update: E
  };
}
const Jl = {
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
}, [L1, Xv] = lt("PopperContent");
var Yv = /* @__PURE__ */ j({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ ja({
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
  }, { ...Jl }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Vl(), { forwardRef: s, currentElement: o } = ke(), a = M(), u = M(), { width: l, height: c } = kh(u), d = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), p = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), m = A(() => ({
      padding: f.value,
      boundary: p.value.filter(Wm),
      altBoundary: p.value.length > 0
    })), v = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), y = Yp(() => [
      zv({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && ba({
        ...m.value,
        ...v.value
      }),
      t.avoidCollisions && Fv({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? Wv() : void 0,
        ...m.value
      }),
      !t.prioritizePosition && t.avoidCollisions && ba({
        ...m.value,
        ...v.value
      }),
      qv({
        ...m.value,
        apply: ({ elements: H, rects: L, availableWidth: O, availableHeight: P }) => {
          const { width: W, height: X } = L.reference, ie = H.floating.style;
          ie.setProperty("--reka-popper-available-width", `${O}px`), ie.setProperty("--reka-popper-available-height", `${P}px`), ie.setProperty("--reka-popper-anchor-width", `${W}px`), ie.setProperty("--reka-popper-anchor-height", `${X}px`);
        }
      }),
      u.value && Kv({
        element: u.value,
        padding: t.arrowPadding
      }),
      Um({
        arrowWidth: l.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Vv({
        strategy: "referenceHidden",
        ...m.value
      })
    ]), T = A(() => t.reference ?? i.anchor.value), { floatingStyles: S, placement: E, isPositioned: C, middlewareData: B } = Gv(T, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...H) => Bv(...H, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: y
    }), x = A(() => ns(E.value)[0]), _ = A(() => ns(E.value)[1]);
    Ua(() => {
      C.value && r("placed");
    });
    const w = A(() => {
      const H = B.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && H;
    }), b = M("");
    tt(() => {
      o.value && (b.value = window.getComputedStyle(o.value).zIndex);
    });
    const R = A(() => B.value.arrow?.x ?? 0), D = A(() => B.value.arrow?.y ?? 0);
    return Xv({
      placedSide: x,
      onArrowChange: (H) => u.value = H,
      arrowX: R,
      arrowY: D,
      shouldHideArrow: w
    }), (H, L) => (k(), $("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Yt({
        ...h(S),
        transform: h(C) ? h(S).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: b.value,
        "--reka-popper-transform-origin": [h(B).transformOrigin?.x, h(B).transformOrigin?.y].join(" "),
        ...h(B).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(h(je), ve({ ref: h(s) }, H.$attrs, {
      "as-child": t.asChild,
      as: H.as,
      "data-side": x.value,
      "data-align": _.value,
      style: { animation: h(C) ? void 0 : "none" }
    }), {
      default: z(() => [Q(H.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Zv = Yv, Qv = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(Hm), pt(Rt(e)), {
      default: z(() => [Q(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Jv = Qv;
function eg() {
  const n = M(!1);
  return _e(() => {
    Yi("keydown", () => {
      n.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), Yi(["pointerdown", "pointermove"], () => {
      n.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), n;
}
const tg = /* @__PURE__ */ Al(eg), [Qr, ng] = lt(["MenuRoot", "MenuSub"], "MenuContext"), [Ds, rg] = lt("MenuRoot");
var ig = /* @__PURE__ */ j({
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
    const t = n, r = e, { modal: i, dir: s } = xn(t), o = xs(s), a = /* @__PURE__ */ Zn(t, "open", r), u = M(), l = tg();
    return ng({
      open: a,
      onOpenChange: (c) => {
        a.value = c;
      },
      content: u,
      onContentChange: (c) => {
        u.value = c;
      }
    }), rg({
      onClose: () => {
        a.value = !1;
      },
      isUsingKeyboardRef: l,
      dir: o,
      modal: i
    }), (c, d) => (k(), V(h(qm), null, {
      default: z(() => [Q(c.$slots, "default")]),
      _: 3
    }));
  }
}), sg = ig;
const [eu, og] = lt("MenuContent");
var ag = /* @__PURE__ */ j({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ ja({
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
  }, { ...Jl }),
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
    const t = n, r = e, i = Qr(), s = Ds(), { trapFocus: o, disableOutsidePointerEvents: a, loop: u } = xn(t);
    fh(), Il(a.value);
    const l = M(""), c = M(0), d = M(0), f = M(null), p = M("right"), m = M(0), v = M(null), y = M(), { forwardRef: T, currentElement: S } = ke(), { handleTypeaheadSearch: E } = Sh();
    oe(S, (b) => {
      i.onContentChange(b);
    }), Qt(() => {
      window.clearTimeout(c.value);
    });
    function C(b) {
      return p.value === f.value?.side && Xh(b, f.value?.area);
    }
    async function B(b) {
      r("openAutoFocus", b), !b.defaultPrevented && (b.preventDefault(), S.value?.focus({ preventScroll: !0 }));
    }
    function x(b) {
      if (b.defaultPrevented) return;
      const D = b.target.closest("[data-reka-menu-content]") === b.currentTarget, H = b.ctrlKey || b.altKey || b.metaKey, L = b.key.length === 1, O = Xp(b, Ue(), S.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (O) return O?.focus();
      if (b.code === "Space") return;
      const P = y.value?.getItems() ?? [];
      if (D && (b.key === "Tab" && b.preventDefault(), !H && L && E(b.key, P)), b.target !== S.value || !jh.includes(b.key)) return;
      b.preventDefault();
      const W = [...P.map((X) => X.ref)];
      $l.includes(b.key) && W.reverse(), Kh(W);
    }
    function _(b) {
      b?.currentTarget?.contains?.(b.target) || (window.clearTimeout(c.value), l.value = "");
    }
    function w(b) {
      if (!ts(b)) return;
      const R = b.target, D = m.value !== b.clientX;
      if (b?.currentTarget?.contains(R) && D) {
        const H = b.clientX > m.value ? "right" : "left";
        p.value = H, m.value = b.clientX;
      }
    }
    return og({
      onItemEnter: (b) => !!C(b),
      onItemLeave: (b) => {
        C(b) || (S.value?.focus(), v.value = null);
      },
      onTriggerLeave: (b) => !!C(b),
      searchRef: l,
      pointerGraceTimerRef: d,
      onPointerGraceIntentChange: (b) => {
        f.value = b;
      }
    }), (b, R) => (k(), V(h(Ll), {
      "as-child": "",
      trapped: h(o),
      onMountAutoFocus: B,
      onUnmountAutoFocus: R[7] || (R[7] = (D) => r("closeAutoFocus", D))
    }, {
      default: z(() => [q(h(Ol), {
        "as-child": "",
        "disable-outside-pointer-events": h(a),
        onEscapeKeyDown: R[2] || (R[2] = (D) => r("escapeKeyDown", D)),
        onPointerDownOutside: R[3] || (R[3] = (D) => r("pointerDownOutside", D)),
        onFocusOutside: R[4] || (R[4] = (D) => r("focusOutside", D)),
        onInteractOutside: R[5] || (R[5] = (D) => r("interactOutside", D)),
        onDismiss: R[6] || (R[6] = (D) => r("dismiss"))
      }, {
        default: z(() => [q(h(_m), {
          ref_key: "rovingFocusGroupRef",
          ref: y,
          "current-tab-stop-id": v.value,
          "onUpdate:currentTabStopId": R[0] || (R[0] = (D) => v.value = D),
          "as-child": "",
          orientation: "vertical",
          dir: h(s).dir.value,
          loop: h(u),
          onEntryFocus: R[1] || (R[1] = (D) => {
            r("entryFocus", D), h(s).isUsingKeyboardRef.value || D.preventDefault();
          })
        }, {
          default: z(() => [q(h(Zv), {
            ref: h(T),
            role: "menu",
            as: b.as,
            "as-child": b.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": h(Nl)(h(i).open.value),
            dir: h(s).dir.value,
            side: b.side,
            "side-offset": b.sideOffset,
            align: b.align,
            "align-offset": b.alignOffset,
            "avoid-collisions": b.avoidCollisions,
            "collision-boundary": b.collisionBoundary,
            "collision-padding": b.collisionPadding,
            "arrow-padding": b.arrowPadding,
            "prioritize-position": b.prioritizePosition,
            "position-strategy": b.positionStrategy,
            "update-position-strategy": b.updatePositionStrategy,
            sticky: b.sticky,
            "hide-when-detached": b.hideWhenDetached,
            reference: b.reference,
            onKeydown: x,
            onBlur: _,
            onPointermove: w
          }, {
            default: z(() => [Q(b.$slots, "default")]),
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
}), tu = ag, lg = /* @__PURE__ */ j({
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
    const e = n, t = eu(), { forwardRef: r } = ke(), { CollectionItem: i } = Es(), s = M(!1);
    async function o(u) {
      u.defaultPrevented || ts(u) && (e.disabled ? t.onItemLeave(u) : t.onItemEnter(u) || u.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function a(u) {
      await Pe(), !u.defaultPrevented && ts(u) && t.onItemLeave(u);
    }
    return (u, l) => (k(), V(h(i), { value: { textValue: u.textValue } }, {
      default: z(() => [q(h(je), ve({
        ref: h(r),
        role: "menuitem",
        tabindex: "-1"
      }, u.$attrs, {
        as: u.as,
        "as-child": u.asChild,
        "aria-disabled": u.disabled || void 0,
        "data-disabled": u.disabled ? "" : void 0,
        "data-highlighted": s.value ? "" : void 0,
        onPointermove: o,
        onPointerleave: a,
        onFocus: l[0] || (l[0] = async (c) => {
          await Pe(), !(c.defaultPrevented || u.disabled) && (s.value = !0);
        }),
        onBlur: l[1] || (l[1] = async (c) => {
          await Pe(), !c.defaultPrevented && (s.value = !1);
        })
      }), {
        default: z(() => [Q(u.$slots, "default")]),
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
}), ug = lg, cg = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = Ds(), a = eu(), u = M(!1);
    async function l() {
      const c = s.value;
      if (!t.disabled && c) {
        const d = new CustomEvent(Wh, {
          bubbles: !0,
          cancelable: !0
        });
        r("select", d), await Pe(), d.defaultPrevented ? u.value = !1 : o.onClose();
      }
    }
    return (c, d) => (k(), V(ug, ve(t, {
      ref: h(i),
      onClick: l,
      onPointerdown: d[0] || (d[0] = () => {
        u.value = !0;
      }),
      onPointerup: d[1] || (d[1] = async (f) => {
        await Pe(), !f.defaultPrevented && (u.value || f.currentTarget?.click());
      }),
      onKeydown: d[2] || (d[2] = async (f) => {
        const p = h(a).searchRef.value !== "";
        c.disabled || p && f.key === " " || h(es).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: z(() => [Q(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), dg = cg, fg = /* @__PURE__ */ j({
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
    const t = n, r = e, i = jr(t, r), s = Qr(), { forwardRef: o, currentElement: a } = ke();
    return Pl(a), (u, l) => (k(), V(tu, ve(h(i), {
      ref: h(o),
      "trap-focus": h(s).open.value,
      "disable-outside-pointer-events": h(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: l[0] || (l[0] = (c) => h(s).onOpenChange(!1)),
      onFocusOutside: l[1] || (l[1] = De((c) => r("focusOutside", c), ["prevent"]))
    }), {
      default: z(() => [Q(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), pg = fg, hg = /* @__PURE__ */ j({
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
    const i = jr(n, e), s = Qr();
    return (o, a) => (k(), V(tu, ve(h(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: a[0] || (a[0] = (u) => h(s).onOpenChange(!1))
    }), {
      default: z(() => [Q(o.$slots, "default")]),
      _: 3
    }, 16));
  }
}), mg = hg, vg = /* @__PURE__ */ j({
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
    const i = jr(n, e), s = Qr(), o = Ds();
    return (a, u) => (k(), V(h(Kr), { present: a.forceMount || h(s).open.value }, {
      default: z(() => [h(o).modal.value ? (k(), V(pg, pt(ve({ key: 0 }, {
        ...a.$attrs,
        ...h(i)
      })), {
        default: z(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16)) : (k(), V(mg, pt(ve({ key: 1 }, {
        ...a.$attrs,
        ...h(i)
      })), {
        default: z(() => [Q(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), gg = vg, yg = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(zl), pt(Rt(e)), {
      default: z(() => [Q(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), bg = yg;
const [nu, kg] = lt("DropdownMenuRoot");
var wg = /* @__PURE__ */ j({
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
    ke();
    const i = /* @__PURE__ */ Zn(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = M(), { modal: o, dir: a } = xn(t), u = xs(a);
    return kg({
      open: i,
      onOpenChange: (l) => {
        i.value = l;
      },
      onOpenToggle: () => {
        i.value = !i.value;
      },
      triggerId: "",
      triggerElement: s,
      contentId: "",
      modal: o,
      dir: u
    }), (l, c) => (k(), V(h(sg), {
      open: h(i),
      "onUpdate:open": c[0] || (c[0] = (d) => pc(i) ? i.value = d : null),
      dir: h(u),
      modal: h(o)
    }, {
      default: z(() => [Q(l.$slots, "default", { open: h(i) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), Sg = wg, Tg = /* @__PURE__ */ j({
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
    const i = jr(n, e);
    ke();
    const s = nu(), o = M(!1);
    function a(u) {
      u.defaultPrevented || (o.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), o.value = !1, u.preventDefault());
    }
    return s.contentId ||= Un(void 0, "reka-dropdown-menu-content"), (u, l) => (k(), V(h(gg), ve(h(i), {
      id: h(s).contentId,
      "aria-labelledby": h(s)?.triggerId,
      style: {
        "--reka-dropdown-menu-content-transform-origin": "var(--reka-popper-transform-origin)",
        "--reka-dropdown-menu-content-available-width": "var(--reka-popper-available-width)",
        "--reka-dropdown-menu-content-available-height": "var(--reka-popper-available-height)",
        "--reka-dropdown-menu-trigger-width": "var(--reka-popper-anchor-width)",
        "--reka-dropdown-menu-trigger-height": "var(--reka-popper-anchor-height)"
      },
      onCloseAutoFocus: a,
      onInteractOutside: l[0] || (l[0] = (c) => {
        if (c.defaultPrevented) return;
        const d = c.detail.originalEvent, f = d.button === 0 && d.ctrlKey === !0, p = d.button === 2 || f;
        (!h(s).modal.value || p) && (o.value = !0), h(s).triggerElement.value?.contains(c.target) && c.preventDefault();
      })
    }), {
      default: z(() => [Q(u.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), _g = Tg, xg = /* @__PURE__ */ j({
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
    const t = n, i = Qn(e);
    return ke(), (s, o) => (k(), V(h(dg), pt(Rt({
      ...t,
      ...h(i)
    })), {
      default: z(() => [Q(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Eg = xg, Cg = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(bg), pt(Rt(e)), {
      default: z(() => [Q(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ag = Cg, Ig = /* @__PURE__ */ j({
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
    const e = n, t = nu(), { forwardRef: r, currentElement: i } = ke();
    return _e(() => {
      t.triggerElement = i;
    }), t.triggerId ||= Un(void 0, "reka-dropdown-menu-trigger"), (s, o) => (k(), V(h(Jv), { "as-child": "" }, {
      default: z(() => [q(h(je), {
        id: h(t).triggerId,
        ref: h(r),
        type: s.as === "button" ? "button" : void 0,
        "as-child": e.asChild,
        as: s.as,
        "aria-haspopup": "menu",
        "aria-expanded": h(t).open.value,
        "aria-controls": h(t).open.value ? h(t).contentId : void 0,
        "data-disabled": s.disabled ? "" : void 0,
        disabled: s.disabled,
        "data-state": h(t).open.value ? "open" : "closed",
        onClick: o[0] || (o[0] = async (a) => {
          !s.disabled && a.button === 0 && a.ctrlKey === !1 && (h(t)?.onOpenToggle(), await Pe(), h(t).open.value && a.preventDefault());
        }),
        onKeydown: o[1] || (o[1] = Wa((a) => {
          s.disabled || (["Enter", " "].includes(a.key) && h(t).onOpenToggle(), a.key === "ArrowDown" && h(t).onOpenChange(!0), [
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
        default: z(() => [Q(s.$slots, "default")]),
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
}), Rg = Ig;
const Pg = /* @__PURE__ */ j({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (k(), V(h($m), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = De(() => {
      }, ["stop"]))
    }, {
      default: z(() => [
        q(h(Bm), { class: "checkbox-indicator" }, {
          default: z(() => [
            q(h(pl), {
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
}), Mg = /* @__PURE__ */ ae(Pg, [["__scopeId", "data-v-024ee78b"]]);
function Og(n) {
  const e = n.trim().split(/\s+/).filter(Boolean);
  return e.length === 0 ? "?" : e.slice(0, 2).map((t) => t[0].toUpperCase()).join("");
}
const Dg = ["title", "aria-label"], Lg = /* @__PURE__ */ j({
  __name: "UserAvatar",
  props: {
    name: {},
    label: {}
  },
  setup(n) {
    const e = n, t = A(() => Og(e.name)), r = A(() => e.label ?? e.name);
    return (i, s) => (k(), $("span", {
      class: "user-avatar",
      role: "img",
      title: r.value,
      "aria-label": r.value
    }, K(t.value), 9, Dg));
  }
}), $g = /* @__PURE__ */ ae(Lg, [["__scopeId", "data-v-b8c5d31d"]]);
function qn(n) {
  if (!n) return null;
  const e = n.getRootNode();
  if (e instanceof ShadowRoot) {
    const t = ru(e);
    if (t) return t;
  }
  return n.ownerDocument?.getSelection() ?? null;
}
function Ng(n) {
  const e = n.getRootNode();
  if (e instanceof ShadowRoot) {
    const r = ru(e);
    if (r?.focusNode)
      return {
        node: r.focusNode,
        offset: r.focusOffset
      };
    const i = n.ownerDocument.getSelection()?.getComposedRanges?.({ shadowRoots: [e] })[0];
    if (i) return { node: i.endContainer, offset: i.endOffset };
  }
  const t = n.ownerDocument.getSelection();
  return t?.focusNode ? { node: t.focusNode, offset: t.focusOffset } : null;
}
function ru(n) {
  return n.getSelection?.() ?? null;
}
const Bg = 3;
function zg(n, e) {
  n.focus({ preventScroll: !0 });
  const t = n.firstChild;
  if (!t || t.nodeType !== Bg) return;
  const r = Math.max(0, Math.min(e, t.nodeValue?.length ?? 0)), i = n.ownerDocument.createRange();
  i.setStart(t, r), i.collapse(!0);
  const s = qn(n);
  s && (s.removeAllRanges(), s.addRange(i));
}
const Ls = 3;
function iu(n, e, t) {
  if (e.nodeType === Ls)
    return Li(n, e) + t;
  const r = e.childNodes[t];
  return r ? Li(n, r) : su(e) + Li(n, e);
}
function Li(n, e) {
  let t = 0, r = !1;
  function i(s) {
    if (r || s === e) {
      r = !0;
      return;
    }
    if (s.nodeType === Ls) {
      t += s.nodeValue?.length ?? 0;
      return;
    }
    for (const o of Array.from(s.childNodes))
      if (i(o), r) return;
  }
  return i(n), t;
}
function su(n) {
  if (n.nodeType === Ls) return n.nodeValue?.length ?? 0;
  let e = 0;
  for (const t of Array.from(n.childNodes))
    e += su(t);
  return e;
}
function Fg(n) {
  const e = Ng(n);
  return !e || !n.contains(e.node) ? null : iu(n, e.node, e.offset);
}
const qg = ["aria-label", "textContent"], Vg = /* @__PURE__ */ j({
  __name: "TurnTextEditor",
  props: {
    text: {},
    caretOffset: {}
  },
  emits: ["save", "cancel", "split"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, { t: s } = de(), o = nt("editable");
    let a = !1;
    _e(() => {
      const f = o.value;
      f && zg(f, r.caretOffset ?? r.text.length);
    });
    function u() {
      return o.value?.innerText ?? "";
    }
    e({ getText: u });
    function l(f) {
      a || (a = !0, f());
    }
    function c(f) {
      if (f.key === "Enter") {
        f.preventDefault();
        const p = o.value, m = u(), v = (p && Fg(p)) ?? m.length;
        l(() => i("split", m, v));
      } else f.key === "Escape" && (f.preventDefault(), l(() => i("cancel")));
    }
    function d() {
      l(() => i("save", u()));
    }
    return (f, p) => (k(), $("p", {
      ref: "editable",
      class: "turn-text-editor",
      contenteditable: "plaintext-only",
      role: "textbox",
      "aria-multiline": "false",
      "aria-label": h(s)("transcription.turnEditor"),
      spellcheck: "true",
      onKeydown: c,
      onBlur: d,
      textContent: K(n.text)
    }, null, 40, qg));
  }
}), Hg = /* @__PURE__ */ ae(Vg, [["__scopeId", "data-v-89d2dec3"]]), Wg = {
  key: 0,
  class: "merge-turns"
}, Ug = /* @__PURE__ */ j({
  __name: "MergeTurnsButton",
  props: {
    firstTurnId: {},
    secondTurnId: {}
  },
  setup(n) {
    const e = n, t = Me(), { t: r } = de(), i = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.text === "edit"
    ), s = A(
      () => !!t.transcriptionEditor?.getTurnLock(e.firstTurnId) || !!t.transcriptionEditor?.getTurnLock(e.secondTurnId)
    );
    function o() {
      t.transcriptionEditor.mergeTurns(e.firstTurnId, e.secondTurnId);
    }
    return (a, u) => i.value ? (k(), $("div", Wg, [
      q(re, {
        size: "sm",
        variant: "inverse",
        icon: "merge",
        disabled: s.value,
        "aria-label": h(r)("transcription.mergeTurns"),
        onClick: De(o, ["stop"])
      }, null, 8, ["disabled", "aria-label"])
    ])) : G("", !0);
  }
}), jg = /* @__PURE__ */ ae(Ug, [["__scopeId", "data-v-1c613cb1"]]), Kg = {
  key: 0,
  class: "popover-list__items"
}, Gg = {
  key: 0,
  class: "popover-list__divider"
}, Xg = { class: "popover-list__footer" }, $s = /* @__PURE__ */ j({
  __name: "PopoverList",
  props: {
    items: {},
    itemKey: {},
    isCurrent: {},
    align: { default: "start" },
    side: { default: "bottom" },
    sideOffset: { default: 4 },
    open: { type: Boolean, default: void 0 }
  },
  emits: ["select", "update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = M(!1), s = A({
      get: () => t.open !== void 0 ? t.open : i.value,
      set: (a) => {
        i.value = a, r("update:open", a);
      }
    });
    function o(a, u) {
      return t.itemKey ? t.itemKey(a) : u;
    }
    return (a, u) => (k(), V(h(Sg), {
      open: s.value,
      "onUpdate:open": u[0] || (u[0] = (l) => s.value = l)
    }, {
      default: z(() => [
        q(h(Rg), { "as-child": "" }, {
          default: z(() => [
            Q(a.$slots, "trigger")
          ]),
          _: 3
        }),
        q(h(Ag), { disabled: "" }, {
          default: z(() => [
            q(h(_g), {
              class: "popover-list",
              "position-strategy": "absolute",
              side: n.side,
              align: n.align,
              "side-offset": n.sideOffset
            }, {
              default: z(() => [
                n.items.length > 0 ? (k(), $("ul", Kg, [
                  (k(!0), $(ye, null, ze(n.items, (l, c) => (k(), V(h(Eg), {
                    key: o(l, c),
                    as: "li",
                    class: Te(["popover-list__item", { "popover-list__item--current": n.isCurrent?.(l) }]),
                    onSelect: (d) => r("select", l)
                  }, {
                    default: z(() => [
                      Q(a.$slots, "item", { item: l })
                    ]),
                    _: 2
                  }, 1032, ["class", "onSelect"]))), 128))
                ])) : G("", !0),
                a.$slots.footer ? (k(), $(ye, { key: 1 }, [
                  n.items.length > 0 ? (k(), $("div", Gg)) : G("", !0),
                  N("div", Xg, [
                    Q(a.$slots, "footer")
                  ])
                ], 64)) : G("", !0)
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
}), Yg = {
  key: 0,
  class: "form-field__header"
}, Zg = ["for"], Qg = {
  key: 0,
  class: "form-field__required",
  "aria-hidden": "true"
}, Jg = { class: "form-field__input-wrapper" }, ey = ["id", "disabled", "required", "aria-required", "aria-invalid", "aria-describedby"], ty = ["value"], ny = ["type", "id", "disabled", "readonly", "placeholder", "autocomplete", "required", "aria-required", "aria-invalid", "aria-describedby"], ry = {
  key: 3,
  class: "form-field__actions"
}, iy = {
  key: 4,
  class: "form-field__actions form-field__actions--placeholder",
  "aria-hidden": "true"
}, sy = ["id"], oy = { class: "form-field__error" }, ay = /* @__PURE__ */ j({
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
    const r = n, i = t, { t: s } = de(), o = Hr(), a = A(() => r.inputId ?? o), u = nt("input"), l = r.modelValue ?? r.field.value ?? "", c = M(l), d = M(l), f = A(() => r.disabled ?? r.field.disabled ?? !1), p = A(() => r.field.required ?? !1), m = A(() => r.field.error ?? null), v = A(() => !!m.value), y = A(() => r.field.type ?? "text"), T = A(() => r.field.placeholder ?? void 0), S = A(() => r.field.autocomplete ?? void 0), E = A(() => c.value !== d.value), C = A(
      () => r.withConfirmation && E.value
    ), B = A(() => ({
      "form-field": !0,
      [`form-field--${r.size}`]: !0,
      "form-field--inline": r.inline,
      "form-field--disabled": f.value,
      "form-field--error": v.value,
      "form-field--with-confirmation": r.withConfirmation
    })), x = A(() => ({
      "form-field__input": !0,
      "form-field__input--fullwidth": r.fullWidth,
      "form-field__input--error": v.value
    }));
    oe(
      () => r.modelValue,
      (D) => {
        D !== void 0 && D !== c.value && (c.value = D, d.value = D);
      }
    ), oe(
      () => r.field.value,
      (D) => {
        r.modelValue === void 0 && D !== void 0 && D !== c.value && (c.value = D, d.value = D);
      }
    );
    function _() {
      r.withConfirmation || (i("update:modelValue", c.value), i("input", c.value));
    }
    function w() {
      E.value && (d.value = c.value, i("update:modelValue", c.value), i("input", c.value), i("on-confirm"));
    }
    function b() {
      E.value && (c.value = d.value), i("on-cancel");
    }
    function R(D) {
      i("keydown", D), !(!r.withConfirmation || D.defaultPrevented) && (D.key === "Enter" && E.value ? (D.preventDefault(), w()) : D.key === "Escape" && (D.preventDefault(), b()));
    }
    return _e(() => {
      r.focus && u.value?.focus();
    }), e({
      focus: () => u.value?.focus(),
      blur: () => u.value?.blur(),
      select: () => u.value?.select()
    }), (D, H) => (k(), $("div", {
      class: Te(B.value)
    }, [
      n.field.label ? (k(), $("div", Yg, [
        N("label", {
          class: "form-field__label",
          for: a.value
        }, [
          me(K(n.field.label) + " ", 1),
          p.value ? (k(), $("span", Qg, "*")) : G("", !0)
        ], 8, Zg),
        Q(D.$slots, "content-after-label", {}, void 0, !0)
      ])) : G("", !0),
      N("div", Jg, [
        Q(D.$slots, "default", {}, void 0, !0),
        D.$slots["custom-input"] ? Q(D.$slots, "custom-input", {
          key: 0,
          id: a.value,
          disabled: f.value
        }, void 0, !0) : n.select ? Hn((k(), $("select", ve({
          key: 1,
          ref: "input",
          "onUpdate:modelValue": H[0] || (H[0] = (L) => c.value = L),
          class: [x.value, "form-field__input--select"],
          id: a.value,
          disabled: f.value,
          required: p.value,
          "aria-required": p.value || void 0,
          "aria-invalid": v.value || void 0,
          "aria-describedby": v.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onChange: _,
          onKeydown: R,
          onBlur: H[1] || (H[1] = (L) => i("blur", L)),
          onFocus: H[2] || (H[2] = (L) => i("focus", L))
        }), [
          (k(!0), $(ye, null, ze(n.options, (L) => (k(), $("option", {
            key: L.value,
            value: L.value
          }, K(L.label), 9, ty))), 128))
        ], 16, ey)), [
          [hc, c.value]
        ]) : Hn((k(), $("input", ve({
          key: 2,
          ref: "input",
          "onUpdate:modelValue": H[3] || (H[3] = (L) => c.value = L),
          class: x.value,
          type: y.value,
          id: a.value,
          disabled: f.value,
          readonly: n.readonly,
          placeholder: T.value,
          autocomplete: S.value,
          required: p.value,
          "aria-required": p.value || void 0,
          "aria-invalid": v.value || void 0,
          "aria-describedby": v.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onInput: _,
          onKeydown: R,
          onBlur: H[4] || (H[4] = (L) => i("blur", L)),
          onFocus: H[5] || (H[5] = (L) => i("focus", L))
        }), null, 16, ny)), [
          [mc, c.value]
        ]),
        C.value ? (k(), $("div", ry, [
          q(re, {
            icon: "x",
            variant: "tertiary",
            size: n.size,
            "aria-label": h(s)("form.cancel"),
            onMousedown: H[6] || (H[6] = De(() => {
            }, ["prevent"])),
            onClick: b
          }, null, 8, ["size", "aria-label"]),
          q(re, {
            icon: "check",
            variant: "primary",
            size: n.size,
            "aria-label": h(s)("form.apply"),
            onMousedown: H[7] || (H[7] = De(() => {
            }, ["prevent"])),
            onClick: w
          }, null, 8, ["size", "aria-label"])
        ])) : n.withConfirmation ? (k(), $("div", iy)) : G("", !0),
        Q(D.$slots, "content-after-input", {}, void 0, !0)
      ]),
      Q(D.$slots, "content-bottom-input", {}, void 0, !0),
      v.value ? (k(), $("div", {
        key: 1,
        id: `${a.value}-error`,
        class: "form-field__info"
      }, [
        N("span", oy, K(m.value), 1)
      ], 8, sy)) : G("", !0)
    ], 2));
  }
}), An = /* @__PURE__ */ ae(ay, [["__scopeId", "data-v-31189879"]]);
function ou(n, e, t) {
  const r = t.trim(), i = n.speakers.all.get(e);
  !i || !r || r === i.name || n.speakers.update(e, { name: r });
}
function Ns(n, e, t) {
  for (const r of n.channels.values())
    for (const i of r.translations.values()) {
      const s = i.getTurn(e);
      !s || s.speakerId === t || i.updateTurn(e, { speakerId: t });
    }
}
function au(n, e, t) {
  const r = t.trim();
  if (!r) return null;
  const i = Ga(n.speakers.all, crypto.randomUUID(), r);
  return n.speakers.updateOrCreate(i), Ns(n, e, i.id), i.id;
}
function lu(n, e, t) {
  if (e !== t && !(!n.speakers.all.has(e) || !n.speakers.all.has(t))) {
    for (const r of n.channels.values())
      for (const i of r.translations.values())
        for (const s of i.turns.value)
          s.speakerId === e && i.updateTurn(s.id, { speakerId: t });
    n.speakers.delete(e);
  }
}
function ly(n, e) {
  const t = n.activeChannel.value?.activeTranslation.value;
  return t ? t.turns.value.filter((r) => r.speakerId === e).length : 0;
}
const uy = {
  type: "button",
  class: "speaker-popover-trigger"
}, cy = { class: "speaker-popover-name" }, dy = /* @__PURE__ */ j({
  __name: "SpeakerPopover",
  props: {
    turnId: {},
    currentSpeakerId: {},
    initialOpen: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Me(), { t: r } = de(), i = M(e.initialOpen ?? !1), s = M(!1), o = M(""), a = nt("newInput"), u = A(() => Array.from(t.speakers.all.values())), l = A(() => ({
      placeholder: r("speakerPopover.newSpeakerPlaceholder"),
      customParams: { "aria-label": r("speakerPopover.newSpeaker") }
    }));
    oe(i, (v) => {
      v || (s.value = !1, o.value = "");
    });
    async function c() {
      s.value = !0, o.value = "", await Pe(), a.value?.focus();
    }
    function d(v) {
      v.id !== e.currentSpeakerId && (t.transcriptionEditor ? t.transcriptionEditor.updateTurnSpeaker(e.turnId, {
        speakerId: v.id
      }) : Ns(t, e.turnId, v.id)), i.value = !1;
    }
    function f() {
      const v = o.value.trim();
      if (!v) {
        s.value = !1;
        return;
      }
      t.transcriptionEditor ? t.transcriptionEditor.updateTurnSpeaker(e.turnId, {
        speakerName: v
      }) : au(t, e.turnId, v), i.value = !1;
    }
    function p(v) {
      v.stopPropagation();
    }
    function m() {
      s.value = !1;
    }
    return (v, y) => (k(), V($s, {
      open: i.value,
      "onUpdate:open": y[1] || (y[1] = (T) => i.value = T),
      items: u.value,
      "item-key": (T) => T.id,
      "is-current": (T) => T.id === n.currentSpeakerId,
      onSelect: d
    }, {
      trigger: z(() => [
        N("button", uy, [
          Q(v.$slots, "default", {}, void 0, !0)
        ])
      ]),
      item: z(({ item: T }) => [
        q(ws, {
          color: T.color
        }, null, 8, ["color"]),
        N("span", cy, K(T.name), 1)
      ]),
      footer: z(() => [
        s.value ? (k(), V(An, {
          key: 1,
          ref: "newInput",
          modelValue: o.value,
          "onUpdate:modelValue": y[0] || (y[0] = (T) => o.value = T),
          field: l.value,
          size: "sm",
          "full-width": "",
          "with-confirmation": "",
          onKeydown: p,
          onOnConfirm: f,
          onOnCancel: m
        }, null, 8, ["modelValue", "field"])) : (k(), V(re, {
          key: 0,
          icon: "user-plus",
          variant: "transparent",
          block: "",
          onClick: c
        }, {
          default: z(() => [
            me(K(h(r)("speakerPopover.newSpeaker")), 1)
          ]),
          _: 1
        }))
      ]),
      _: 3
    }, 8, ["open", "items", "item-key", "is-current"]));
  }
}), fy = /* @__PURE__ */ ae(dy, [["__scopeId", "data-v-03fcb342"]]), uu = /* @__PURE__ */ Symbol("turnSelection");
function wa(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function py(n, e, t) {
  const r = wn(/* @__PURE__ */ new Map());
  let i = null;
  const s = A(() => r.size), o = A(() => r.size > 0);
  function a(S) {
    return r.has(S);
  }
  function u() {
    return t.transcriptionEditor !== void 0;
  }
  function l(S) {
    u() || (r.has(S) ? r.delete(S) : r.set(S, !0), i = S);
  }
  function c(S) {
    if (u()) return;
    if (i === null) {
      l(S);
      return;
    }
    const E = n.value.map((w) => w.id), C = E.indexOf(i), B = E.indexOf(S);
    if (C === -1 || B === -1) {
      l(S);
      return;
    }
    const x = Math.min(C, B), _ = Math.max(C, B);
    for (let w = x; w <= _; w++) {
      const b = E[w];
      b != null && r.set(b, !0);
    }
  }
  function d() {
    r.clear(), i = null;
  }
  async function f() {
    const E = n.value.filter((C) => r.has(C.id)).map(wa).join(`

`);
    await navigator.clipboard.writeText(E);
  }
  async function p() {
    const E = n.value.filter((C) => r.has(C.id)).map((C) => {
      const x = (C.speakerId ? e.get(C.speakerId) : void 0)?.name ?? "", _ = C.startTime != null ? Wn(C.startTime) : "", w = [x, _].filter(Boolean).join(" (") + (_ ? ")" : ""), b = wa(C);
      return w ? `${w}
${b}` : b;
    });
    await navigator.clipboard.writeText(E.join(`

`));
  }
  oe(
    () => n.value,
    (S) => {
      if (r.size === 0) return;
      const E = new Set(S.map((C) => C.id));
      for (const C of [...r.keys()])
        E.has(C) || r.delete(C);
    }
  );
  const m = t.on("channel:change", d), v = t.on("translation:change", d);
  function y(S) {
    S.key === "Escape" && r.size > 0 && d();
  }
  _e(() => {
    document.addEventListener("keydown", y);
  }), gt(() => {
    document.removeEventListener("keydown", y), m(), v();
  });
  const T = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: c,
    clear: d,
    copyText: f,
    copyWithMetadata: p
  };
  return _n(uu, T), T;
}
function cu() {
  const n = Gn(uu);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
function Bs(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function hy(n) {
  const e = [];
  let t = n.getRootNode();
  for (; t instanceof ShadowRoot; )
    e.push(t), t = t.host.getRootNode();
  return e;
}
function my(n, e, t) {
  const r = n.ownerDocument;
  if (typeof r.caretPositionFromPoint == "function") {
    const s = r.caretPositionFromPoint(e, t, {
      shadowRoots: hy(n)
    });
    return s ? { node: s.offsetNode, offset: s.offset } : null;
  }
  const i = r.caretRangeFromPoint?.(e, t);
  return i ? { node: i.startContainer, offset: i.startOffset } : null;
}
function vy(n, e, t) {
  const r = my(n, e, t);
  return !r || !n.contains(r.node) ? null : iu(n, r.node, r.offset);
}
function gy(n, e) {
  return n.find(
    (t) => t.charStart != null && t.charEnd != null && t.charStart <= e && e < t.charEnd
  );
}
const yy = ["data-turn-active", "aria-selected"], by = {
  key: 4,
  class: "turn-edit-actions"
}, ky = ["role", "tabindex", "aria-label", "aria-disabled"], wy = ["data-word-active"], Sy = /* @__PURE__ */ j({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean },
    previousTurnId: {}
  },
  setup(n) {
    const e = n, t = Me(), r = cu(), { t: i } = de(), s = A(() => e.turn.words.length > 0), o = A(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const P = t.audio.currentTime.value, { startTime: W, endTime: X, words: ie } = e.turn;
      return W == null || X == null || P < W || P > X ? null : dl(ie, P);
    }), a = A(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || kf(e.turn.words)) return !1;
      const P = t.audio.currentTime.value;
      return P >= e.turn.startTime && P <= e.turn.endTime;
    }), u = A(() => e.speaker?.color ?? "transparent"), l = A(() => r.isSelected(e.turn.id)), c = A(() => {
      const P = e.speaker?.name ?? "", W = l.value ? "selection.deselect" : "selection.select";
      return i(W).replace("{name}", P);
    }), d = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.text === "edit" && !e.partial && !e.live
    ), f = A(
      () => t.transcriptionEditor?.editingTurnId.value === e.turn.id
    ), p = A(
      () => f.value ? void 0 : t.transcriptionEditor?.getTurnLock(e.turn.id)
    ), m = A(
      () => p.value ? i("transcription.lockedBy").replace("{name}", p.value.userName) : ""
    ), v = A(() => d.value && !p.value), y = A(() => Bs(e.turn)), T = nt("editor");
    function S(P) {
      const W = P.currentTarget, X = vy(
        W,
        P.clientX,
        P.clientY
      );
      E(X), v.value && t.transcriptionEditor.beginEdit(
        e.turn.id,
        X ?? y.value.length
      );
    }
    function E(P) {
      if (!t.audio) return;
      const X = (P !== null ? gy(e.turn.words, P) : void 0)?.startTime ?? e.turn.startTime;
      X != null && (t.audio.seekTo(X), t.audio.pause());
    }
    function C(P) {
      !v.value || P.key !== "Enter" || (P.preventDefault(), t.transcriptionEditor.beginEdit(e.turn.id, 0));
    }
    function B(P) {
      t.transcriptionEditor.saveTurn(P);
    }
    function x() {
      t.transcriptionEditor.cancelEdit();
    }
    function _(P, W) {
      t.transcriptionEditor.splitTurn(P, W);
    }
    function w() {
      t.transcriptionEditor.saveTurn(
        T.value?.getText() ?? y.value
      );
    }
    function b() {
      t.transcriptionEditor.cancelEdit();
    }
    const R = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.speakers === "edit" && !e.partial && !e.live
    ), D = M(!1);
    function H() {
      D.value = !0;
    }
    function L(P) {
      f.value || (P.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id));
    }
    function O(P) {
      P.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    return (P, W) => (k(), $("section", {
      class: Te(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": l.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: Yt({ "--speaker-color": u.value }),
      "aria-selected": h(r).hasSelection.value ? l.value : void 0
    }, [
      n.previousTurnId && !n.partial && !n.live ? (k(), V(jg, {
        key: 0,
        "first-turn-id": n.previousTurnId,
        "second-turn-id": n.turn.id
      }, null, 8, ["first-turn-id", "second-turn-id"])) : G("", !0),
      n.partial ? G("", !0) : (k(), $("div", {
        key: 1,
        class: "turn-header",
        onClick: L
      }, [
        h(r).hasSelection.value ? (k(), V(Mg, {
          key: 0,
          "model-value": l.value,
          "aria-label": c.value,
          onClick: De(O, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : G("", !0),
        D.value ? (k(), V(fy, {
          key: 1,
          "turn-id": n.turn.id,
          "current-speaker-id": n.turn.speakerId,
          "initial-open": ""
        }, {
          default: z(() => [
            q(Ci, {
              speaker: n.speaker,
              "start-time": n.turn.startTime,
              "start-date": n.turn.startDate,
              language: n.turn.language,
              interactive: ""
            }, null, 8, ["speaker", "start-time", "start-date", "language"])
          ]),
          _: 1
        }, 8, ["turn-id", "current-speaker-id"])) : R.value ? (k(), $("button", {
          key: 2,
          type: "button",
          class: "speaker-trigger",
          onClick: De(H, ["stop"])
        }, [
          q(Ci, {
            speaker: n.speaker,
            "start-time": n.turn.startTime,
            "start-date": n.turn.startDate,
            language: n.turn.language,
            interactive: ""
          }, null, 8, ["speaker", "start-time", "start-date", "language"])
        ])) : (k(), V(Ci, {
          key: 3,
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          "start-date": n.turn.startDate,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])),
        f.value || p.value ? (k(), $("div", by, [
          f.value ? (k(), $(ye, { key: 0 }, [
            q(re, {
              size: "sm",
              variant: "tertiary",
              icon: "x",
              "aria-label": h(i)("transcription.cancelEdit"),
              onMousedown: W[0] || (W[0] = De(() => {
              }, ["prevent"])),
              onClick: De(b, ["stop"])
            }, null, 8, ["aria-label"]),
            q(re, {
              size: "sm",
              variant: "primary",
              icon: "check",
              "aria-label": h(i)("transcription.saveEdit"),
              onMousedown: W[1] || (W[1] = De(() => {
              }, ["prevent"])),
              onClick: De(w, ["stop"])
            }, null, 8, ["aria-label"])
          ], 64)) : (k(), V($g, {
            key: 1,
            name: p.value.userName,
            label: m.value,
            onClick: W[2] || (W[2] = De(() => {
            }, ["stop"]))
          }, null, 8, ["name", "label"]))
        ])) : G("", !0)
      ])),
      f.value ? (k(), V(Hg, {
        key: 2,
        ref: "editor",
        text: y.value,
        "caret-offset": h(t).transcriptionEditor?.editingCaretOffset.value,
        class: "turn-text",
        onSave: B,
        onCancel: x,
        onSplit: _
      }, null, 8, ["text", "caret-offset"])) : (k(), $("p", {
        key: 3,
        class: Te(["turn-text", { "turn-text--editable": v.value }]),
        role: v.value ? "button" : void 0,
        tabindex: v.value ? 0 : void 0,
        "aria-label": v.value ? h(i)("transcription.editTurn") : void 0,
        "aria-disabled": d.value && p.value ? !0 : void 0,
        onClick: S,
        onKeydown: C
      }, [
        s.value ? (k(!0), $(ye, { key: 0 }, ze(n.turn.words, (X, ie) => (k(), $(ye, {
          key: X.id
        }, [
          N("span", {
            class: Te({ "word--active": X.id === o.value }),
            "data-word-active": X.id === o.value || void 0
          }, K(X.text), 11, wy),
          me(K(ie < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (k(), $(ye, { key: 1 }, [
          me(K(n.turn.text), 1)
        ], 64)) : G("", !0)
      ], 42, ky))
    ], 14, yy));
  }
}), Sa = /* @__PURE__ */ ae(Sy, [["__scopeId", "data-v-7b4a2e52"]]), Ty = {}, _y = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function xy(n, e) {
  return k(), $("svg", _y, [...e[0] || (e[0] = [
    vc('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const Ey = /* @__PURE__ */ ae(Ty, [["render", xy]]), Cy = { class: "transcription-empty" }, Ay = { class: "message" }, Iy = /* @__PURE__ */ j({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = de();
    return (t, r) => (k(), $("div", Cy, [
      q(Ey, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      N("p", Ay, K(h(e)("transcription.empty")), 1)
    ]));
  }
}), Ry = /* @__PURE__ */ ae(Iy, [["__scopeId", "data-v-f82737e5"]]);
function du(n, e) {
  return `${n}#${e}`;
}
function Py(n) {
  const e = n.lastIndexOf("#");
  if (e <= 0) return null;
  const t = n.slice(e + 1);
  if (t === "") return null;
  const r = Number(t);
  return !Number.isInteger(r) || r < 0 ? null : { turnId: n.slice(0, e), index: r };
}
const Ta = /\S+/g;
function My(n) {
  const e = [];
  if (!n) return e;
  Ta.lastIndex = 0;
  let t;
  for (; (t = Ta.exec(n)) !== null; )
    e.push({
      text: t[0],
      charStart: t.index,
      charEnd: t.index + t[0].length
    });
  return e;
}
function Oy(n, e) {
  return My(e).map((t, r) => ({
    id: du(n, r),
    text: t.text,
    charStart: t.charStart,
    charEnd: t.charEnd
  }));
}
function fu(n, e) {
  const t = [];
  let r = 0;
  for (const i of e)
    for (const s of (i.text ?? "").split(/\s+/)) {
      if (!s) continue;
      const o = r, a = o + s.length;
      r = a + 1, t.push({
        id: du(n, t.length),
        text: s,
        charStart: o,
        charEnd: a,
        ...i.startTime !== void 0 && { startTime: i.startTime },
        ...i.endTime !== void 0 && { endTime: i.endTime },
        ...i.confidence !== void 0 && { confidence: i.confidence }
      });
    }
  return t;
}
function zs(n, e) {
  return fu(
    n,
    e.map((t) => ({
      text: t.word ?? "",
      ...t.stime !== void 0 && { startTime: t.stime },
      ...t.etime !== void 0 && { endTime: t.etime },
      ...t.confidence !== void 0 && { confidence: t.confidence }
    }))
  );
}
function Dy(n, e) {
  const t = Math.min(n.length, e.length);
  let r = 0;
  for (; r < t && n[r].text === e[r].text; ) r++;
  let i = 0;
  for (; i < t - r && n[n.length - 1 - i].text === e[e.length - 1 - i].text; )
    i++;
  return n.map((s, o) => {
    const a = o < r ? e[o] : o >= n.length - i ? e[e.length - (n.length - o)] : void 0;
    return a ? {
      ...s,
      ...a.startTime !== void 0 && { startTime: a.startTime },
      ...a.endTime !== void 0 && { endTime: a.endTime },
      ...a.confidence !== void 0 && { confidence: a.confidence }
    } : s;
  });
}
function Ly(n, e, t) {
  const r = Py(t);
  if (!r) return null;
  const s = e.activeChannel.value?.activeTranslation.value?.turns.value.find((o) => o.id === r.turnId);
  return s ? $y(n, s, r.index) : null;
}
function $y(n, e, t) {
  const r = e.words[t];
  if (!r || r.charStart == null || r.charEnd == null) return null;
  const i = n.querySelector(
    `[data-turn-id="${Ny(e.id)}"] .turn-text`
  );
  if (!i) return null;
  const s = document.createRange();
  let o = 0, a = !1;
  const u = document.createTreeWalker(i, NodeFilter.SHOW_TEXT);
  for (let l = u.nextNode(); l; l = u.nextNode()) {
    const c = l.nodeValue?.length ?? 0;
    if (!a && r.charStart < o + c && (s.setStart(l, r.charStart - o), a = !0), r.charEnd <= o + c)
      return a ? (s.setEnd(l, r.charEnd - o), s) : null;
    o += c;
  }
  return null;
}
function Ny(n) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(n) : n.replace(/["\\]/g, "\\$&");
}
const By = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function zy(n) {
  const e = Me(), t = M(!0), r = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function i() {
    const c = n.value;
    if (!c || !t.value) return;
    const d = r ? "instant" : "smooth", f = e.audio?.activeWordId.value;
    if (f) {
      const y = Ly(c, e, f)?.getBoundingClientRect();
      if (y && (y.height > 0 || y.width > 0)) {
        const T = c.getBoundingClientRect(), S = y.top + y.height / 2 - (T.top + c.clientHeight / 2);
        c.scrollBy({ top: S, behavior: d });
        return;
      }
    }
    const p = e.audio?.activeTurnId.value, m = (
      // Non-editor list view still tags the active word this way.
      c.querySelector("[data-word-active]") ?? (p ? c.querySelector(`[data-turn-id="${p}"]`) : null)
    );
    m && m.scrollIntoView({ behavior: d, block: "center" });
  }
  oe(
    () => e.audio?.activeWordId.value,
    (c) => {
      c && i();
    },
    { flush: "post" }
  ), oe(
    () => e.audio?.activeTurnId.value,
    (c) => {
      c && i();
    },
    { flush: "post" }
  ), oe(
    () => e.audio?.isPlaying.value,
    (c) => {
      c && (t.value = !0);
    }
  );
  function s() {
    t.value = !1;
  }
  function o(c) {
    By.has(c.key) && s();
  }
  function a(c) {
    const d = n.value;
    d && (d.addEventListener("wheel", c, { passive: !0 }), d.addEventListener("touchstart", c, { passive: !0 }), d.addEventListener("pointerdown", c, { passive: !0 }), d.addEventListener("keydown", o));
  }
  function u(c) {
    const d = n.value;
    d && (d.removeEventListener("wheel", c), d.removeEventListener("touchstart", c), d.removeEventListener("pointerdown", c), d.removeEventListener("keydown", o));
  }
  _e(() => {
    a(s);
  }), gt(() => {
    u(s);
  });
  function l() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: l };
}
const Fy = { class: "transcription-panel" }, qy = {
  ref: "scrollContainer",
  class: "scroll-container"
}, Vy = { class: "turns-container" }, Hy = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Wy = {
  key: 1,
  class: "history-start"
}, Uy = /* @__PURE__ */ j({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = de(), r = Me(), i = nt("scrollContainer"), s = A(() => {
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
    }), o = A(() => r.live?.hasLiveUpdate.value ?? !1), a = A(() => r.audio?.isPlaying.value ?? !1), u = A(
      () => r.activeChannel.value?.activeTranslation.value
    ), l = A(() => r.activeChannel.value), c = A(
      () => l.value?.isLoadingHistory.value ?? !1
    ), d = A(
      () => l.value?.hasMoreHistory.value ?? !1
    ), { isFollowing: f, resumeFollow: p } = zy(i), { scrollRef: m, contentRef: v, isAtBottom: y, scrollToBottom: T } = _l();
    _e(() => {
      r.live && (m.value = i.value, v.value = i.value?.querySelector(".turns-container") ?? null);
    });
    const S = A(
      () => !f.value && a.value || !y.value && o.value
    );
    function E() {
      a.value ? p() : T();
    }
    const C = ff(() => {
      const x = l.value;
      if (!x?.hasMoreHistory.value || x.isLoadingHistory.value || e.turns.length === 0) return;
      const _ = u.value;
      _ && r.emit("scroll:top", { translationId: _.id });
    }, 500);
    function B() {
      const x = i.value;
      x && x.scrollTop < 100 && C();
    }
    return oe(
      () => e.turns,
      (x, _) => {
        const w = x.length, b = _.length;
        if (w > b && !y.value && x[0]?.id != _[0]?.id) {
          const R = w - b, D = e.turns[R]?.id;
          if (!D || !m.value) return;
          Pe(() => {
            m.value?.querySelector(
              `[data-turn-id="${D}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), _e(() => {
      i.value?.addEventListener("scroll", B, {
        passive: !0
      });
    }), gt(() => {
      i.value?.removeEventListener("scroll", B);
    }), (x, _) => (k(), $("article", Fy, [
      N("div", qy, [
        N("div", Vy, [
          c.value ? (k(), $("div", Hy, [..._[2] || (_[2] = [
            N("progress", null, null, -1)
          ])])) : G("", !0),
          !d.value && n.turns.length > 0 ? (k(), $("div", Wy, K(h(t)("transcription.historyStart")), 1)) : G("", !0),
          n.turns.length === 0 && !c.value && !s.value ? (k(), V(Ry, {
            key: 2,
            class: "transcription-empty"
          })) : G("", !0),
          (k(!0), $(ye, null, ze(n.turns, (w, b, R, D) => {
            const H = [
              w,
              n.speakers.get(w.speakerId ?? ""),
              o.value && !s.value && b === n.turns.length - 1,
              n.turns[b - 1]?.id
            ];
            if (D && D.key === w.id && gc(D, H)) return D;
            const L = (k(), V(Sa, {
              "data-turn-id": w.id,
              key: w.id,
              turn: w,
              speaker: w.speakerId ? n.speakers.get(w.speakerId) : void 0,
              live: o.value && !s.value && b === n.turns.length - 1,
              "previous-turn-id": n.turns[b - 1]?.id
            }, null, 8, ["data-turn-id", "turn", "speaker", "live", "previous-turn-id"]));
            return L.memo = H, L;
          }, _, 0), 128)),
          s.value ? (k(), V(Sa, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : G("", !0)
        ]),
        q(Wr, { name: "fade-slide" }, {
          default: z(() => [
            S.value ? (k(), V(re, {
              key: 0,
              size: "sm",
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": h(t)("transcription.resumeScroll"),
              onClick: E
            }, {
              default: z(() => [
                me(K(h(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : G("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), _a = /* @__PURE__ */ ae(Uy, [["__scopeId", "data-v-873bbd6b"]]), jy = ["data-status"], Ky = {
  key: 0,
  class: "document-article__toolbar",
  role: "toolbar"
}, Gy = { class: "document-article__toolbar-left" }, Xy = { class: "document-article__toolbar-center" }, Yy = { class: "document-article__toolbar-right" }, Zy = { class: "document-article__body" }, Qy = {
  key: 0,
  class: "document-article__center document-article__center--processing",
  role: "status",
  "aria-live": "polite"
}, Jy = ["value"], eb = {
  key: 0,
  class: "document-article__progress-value"
}, tb = {
  key: 1,
  class: "document-article__center document-article__center--error",
  role: "alert"
}, nb = { class: "document-article__error-text" }, rb = /* @__PURE__ */ j({
  __name: "DocumentArticle",
  props: {
    status: { default: "done" },
    progress: {},
    errorMessage: {}
  },
  emits: ["retry"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = de(), s = A(
      () => t.errorMessage || i("llmService.errorTemporary")
    ), o = A(() => {
      const a = t.progress;
      return a == null || !Number.isFinite(a) ? null : Math.max(0, Math.min(100, Math.round(a)));
    });
    return (a, u) => (k(), $("article", {
      class: "document-article",
      "data-status": t.status
    }, [
      a.$slots["toolbar-left"] || a.$slots["toolbar-center"] || a.$slots["toolbar-right"] ? (k(), $("div", Ky, [
        N("div", Gy, [
          Q(a.$slots, "toolbar-left", {}, void 0, !0)
        ]),
        N("div", Xy, [
          Q(a.$slots, "toolbar-center", {}, void 0, !0)
        ]),
        N("div", Yy, [
          Q(a.$slots, "toolbar-right", {}, void 0, !0)
        ])
      ])) : G("", !0),
      N("div", Zy, [
        t.status === "processing" ? (k(), $("div", Qy, [
          q(Qe, {
            name: "spinner",
            spin: "",
            size: 24
          }),
          N("progress", {
            class: "document-article__progress",
            max: 100,
            value: o.value ?? void 0
          }, null, 8, Jy),
          o.value !== null ? (k(), $("span", eb, K(o.value) + "% ", 1)) : G("", !0)
        ])) : t.status === "error" ? (k(), $("div", tb, [
          N("p", nb, K(s.value), 1),
          q(re, {
            variant: "primary",
            icon: "refresh-cw",
            onClick: u[0] || (u[0] = (l) => r("retry"))
          }, {
            default: z(() => [
              me(K(h(i)("llmService.retry")), 1)
            ]),
            _: 1
          })
        ])) : Q(a.$slots, "default", { key: 2 }, void 0, !0)
      ])
    ], 8, jy));
  }
}), pu = /* @__PURE__ */ ae(rb, [["__scopeId", "data-v-e5e27610"]]), ib = /* @__PURE__ */ j({
  __name: "DownloadMenu",
  props: {
    formats: {},
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = de();
    function s(o) {
      r("select", o.format);
    }
    return (o, a) => (k(), V($s, {
      items: t.formats,
      "item-key": (u) => u.format,
      align: "end",
      onSelect: s
    }, {
      trigger: z(() => [
        q(re, {
          variant: "primary",
          icon: "download",
          "icon-right": "chevron-down",
          disabled: n.disabled,
          loading: n.loading
        }, {
          default: z(() => [
            me(K(h(i)("llmService.download")), 1)
          ]),
          _: 1
        }, 8, ["disabled", "loading"])
      ]),
      item: z(({ item: u }) => [
        N("span", null, K(h(i)(u.labelKey)), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), sb = { class: "verbatim-panel" }, ob = { class: "verbatim-panel__content" }, ab = { class: "verbatim-panel__header" }, lb = { class: "verbatim-panel__doc-title" }, ub = { class: "verbatim-panel__turns" }, cb = { class: "verbatim-panel__turn-header" }, db = { class: "verbatim-panel__speaker-name" }, fb = {
  key: 0,
  class: "verbatim-panel__meta"
}, pb = {
  key: 1,
  class: "verbatim-panel__meta"
}, hb = { class: "verbatim-panel__text" }, mb = /* @__PURE__ */ j({
  __name: "VerbatimPanel",
  setup(n) {
    const e = Me(), { locale: t } = de(), r = [
      { format: "docx", labelKey: "format.docx" },
      { format: "pdf", labelKey: "format.pdf" },
      { format: "txt", labelKey: "format.txt" },
      { format: "json", labelKey: "format.json" },
      { format: "whisperx", labelKey: "format.whisperx" }
    ], i = A(
      () => e.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), s = e.speakers.all, o = A(() => e.title.value), a = A(
      () => new Intl.DisplayNames([t.value], { type: "language" })
    );
    function u(f) {
      return f == null ? "" : s.get(f)?.name ?? f;
    }
    function l(f) {
      return f ? a.value.of(f) ?? f : "";
    }
    function c(f) {
      return f.text != null ? f.text : f.words.map((p) => p.text).join(" ");
    }
    function d(f) {
      f && e.emit("verbatim:export", { format: f });
    }
    return (f, p) => (k(), $("section", sb, [
      q(pu, {
        formats: r,
        onExport: d
      }, {
        "toolbar-right": z(() => [
          q(ib, {
            formats: r,
            onSelect: d
          })
        ]),
        default: z(() => [
          N("article", ob, [
            N("header", ab, [
              N("h1", lb, K(o.value), 1)
            ]),
            N("ul", ub, [
              (k(!0), $(ye, null, ze(i.value, (m) => (k(), $("li", {
                key: m.id,
                class: "verbatim-panel__turn"
              }, [
                N("header", cb, [
                  N("strong", db, K(u(m.speakerId)), 1),
                  m.startTime != null ? (k(), $("span", fb, [
                    p[0] || (p[0] = N("span", {
                      class: "verbatim-panel__sep",
                      "aria-hidden": "true"
                    }, "·", -1)),
                    N("time", null, K(Wn(m.startTime)), 1)
                  ])) : G("", !0),
                  m.language ? (k(), $("span", pb, [
                    p[1] || (p[1] = N("span", {
                      class: "verbatim-panel__sep",
                      "aria-hidden": "true"
                    }, "·", -1)),
                    me(" " + K(l(m.language)), 1)
                  ])) : G("", !0)
                ]),
                N("p", hb, K(c(m)), 1)
              ]))), 128))
            ])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), vb = /* @__PURE__ */ ae(mb, [["__scopeId", "data-v-3034500a"]]), gb = { class: "switch" }, yb = ["id", "checked", "disabled"], bb = ["for"], kb = /* @__PURE__ */ j({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? Hr();
    return (s, o) => (k(), $("div", gb, [
      N("input", {
        type: "checkbox",
        id: h(i),
        checked: n.modelValue,
        disabled: n.disabled,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, yb),
      N("label", { for: h(i) }, [...o[1] || (o[1] = [
        N("div", { class: "switch-slider" }, null, -1)
      ])], 8, bb)
    ]));
  }
}), Sr = /* @__PURE__ */ ae(kb, [["__scopeId", "data-v-f1919d87"]]), wb = ["disabled", "aria-label"], Sb = /* @__PURE__ */ j({
  __name: "EditableText",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue", "commit", "cancel"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = M(!1), s = M(t.modelValue), o = nt("input"), a = A(() => ({
      placeholder: t.placeholder,
      customParams: t.ariaLabel ? { "aria-label": t.ariaLabel } : void 0
    }));
    oe(
      () => t.modelValue,
      (f) => {
        i.value || (s.value = f);
      }
    );
    async function u() {
      t.disabled || (s.value = t.modelValue, i.value = !0, await Pe(), o.value?.focus(), o.value?.select());
    }
    function l() {
      if (!i.value) return;
      const f = s.value.trim();
      i.value = !1, !(!f || f === t.modelValue) && (r("update:modelValue", f), r("commit", f));
    }
    function c() {
      i.value && (i.value = !1, s.value = t.modelValue, r("cancel"));
    }
    function d(f) {
      f.key === "Enter" ? (f.preventDefault(), l()) : f.key === "Escape" && (f.preventDefault(), c());
    }
    return (f, p) => i.value ? (k(), V(An, {
      key: 0,
      ref: "input",
      modelValue: s.value,
      "onUpdate:modelValue": p[0] || (p[0] = (m) => s.value = m),
      field: a.value,
      size: "sm",
      "full-width": "",
      onKeydown: d,
      onBlur: l
    }, null, 8, ["modelValue", "field"])) : (k(), $("button", {
      key: 1,
      type: "button",
      class: "editable-text-display",
      disabled: n.disabled,
      "aria-label": n.ariaLabel,
      onClick: u
    }, K(n.modelValue || n.placeholder), 9, wb));
  }
}), Tb = /* @__PURE__ */ ae(Sb, [["__scopeId", "data-v-511d4fb4"]]), _b = ["disabled", "aria-current"], xb = {
  key: 0,
  class: "selectable-list-item__leading"
}, Eb = { class: "selectable-list-item__label" }, Cb = {
  key: 1,
  class: "selectable-list-item__trailing"
}, Ab = {
  key: 0,
  class: "selectable-list-item__actions"
}, Ib = /* @__PURE__ */ j({
  __name: "SelectableListItem",
  props: {
    current: { type: Boolean },
    disabled: { type: Boolean },
    label: {},
    size: { default: "md" }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = e;
    return (r, i) => (k(), $("div", {
      class: Te(["selectable-list-item", [
        `selectable-list-item--${n.size}`,
        { "selectable-list-item--current": n.current }
      ]])
    }, [
      N("button", {
        type: "button",
        class: "selectable-list-item__main",
        disabled: n.disabled,
        "aria-current": n.current ? "true" : void 0,
        onClick: i[0] || (i[0] = (s) => t("select"))
      }, [
        r.$slots.leading ? (k(), $("span", xb, [
          Q(r.$slots, "leading", {}, void 0, !0)
        ])) : G("", !0),
        N("span", Eb, [
          Q(r.$slots, "default", {}, () => [
            me(K(n.label), 1)
          ], !0)
        ]),
        r.$slots.trailing ? (k(), $("span", Cb, [
          Q(r.$slots, "trailing", {}, void 0, !0)
        ])) : G("", !0)
      ], 8, _b),
      r.$slots.actions ? (k(), $("div", Ab, [
        Q(r.$slots, "actions", {}, void 0, !0)
      ])) : G("", !0)
    ], 2));
  }
}), as = /* @__PURE__ */ ae(Ib, [["__scopeId", "data-v-e227a7de"]]), Rb = /* @__PURE__ */ j({
  __name: "SpeakerMenu",
  emits: ["merge"],
  setup(n, { emit: e }) {
    const t = e, { t: r } = de(), i = A(() => [
      { id: "merge", label: r("speakerMenu.merge") }
    ]);
    function s(o) {
      o.id === "merge" && t("merge");
    }
    return (o, a) => (k(), V($s, {
      items: i.value,
      "item-key": (u) => u.id,
      align: "end",
      onSelect: s
    }, {
      trigger: z(() => [
        q(re, {
          icon: "more-vertical",
          variant: "transparent",
          "aria-label": h(r)("speakerMenu.openMenu")
        }, null, 8, ["aria-label"])
      ]),
      item: z(({ item: u }) => [
        N("span", null, K(u.label), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), Pb = { class: "merge-dialog-title" }, Mb = { class: "merge-dialog-description" }, Ob = { class: "merge-dialog-actions" }, Db = /* @__PURE__ */ j({
  __name: "MergeDialog",
  props: {
    open: { type: Boolean },
    fromSpeakerId: {}
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Me(), { t: s } = de(), o = nt("dialog"), a = M(""), u = A(
      () => t.fromSpeakerId ? i.speakers.all.get(t.fromSpeakerId) : void 0
    ), l = A(
      () => Array.from(i.speakers.all.values()).filter(
        (v) => v.id !== t.fromSpeakerId
      )
    ), c = A(
      () => l.value.map((v) => ({ value: v.id, label: v.name }))
    ), d = A(() => ({
      label: s("mergeDialog.targetLabel"),
      required: !0
    })), f = A(() => t.fromSpeakerId ? ly(i, t.fromSpeakerId) : 0);
    oe(
      () => t.open,
      (v) => {
        v ? (a.value = l.value[0]?.id ?? "", o.value?.showModal()) : o.value?.close();
      }
    );
    function p() {
      r("update:open", !1);
    }
    function m() {
      !t.fromSpeakerId || !a.value || (i.transcriptionEditor ? i.transcriptionEditor.replaceSpeaker(t.fromSpeakerId, a.value) : lu(i, t.fromSpeakerId, a.value), r("update:open", !1));
    }
    return (v, y) => (k(), $("dialog", {
      ref: "dialog",
      class: "merge-dialog",
      onClose: p,
      onCancel: De(p, ["prevent"])
    }, [
      u.value ? (k(), $("form", {
        key: 0,
        class: "merge-dialog-form",
        onSubmit: De(m, ["prevent"])
      }, [
        N("h2", Pb, K(h(s)("mergeDialog.title")), 1),
        N("p", Mb, [
          N("strong", null, K(u.value.name), 1),
          me(" · " + K(f.value) + " " + K(h(s)("mergeDialog.turnsAffected")), 1)
        ]),
        q(An, {
          select: "",
          field: d.value,
          options: c.value,
          modelValue: a.value,
          "onUpdate:modelValue": y[0] || (y[0] = (T) => a.value = T)
        }, null, 8, ["field", "options", "modelValue"]),
        N("div", Ob, [
          q(re, {
            variant: "tertiary",
            type: "button",
            onClick: p
          }, {
            default: z(() => [
              me(K(h(s)("mergeDialog.cancel")), 1)
            ]),
            _: 1
          }),
          q(re, {
            variant: "primary",
            type: "submit",
            disabled: !a.value
          }, {
            default: z(() => [
              me(K(h(s)("mergeDialog.confirm")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : G("", !0)
    ], 544));
  }
}), Lb = /* @__PURE__ */ ae(Db, [["__scopeId", "data-v-695cbbe8"]]), hu = /* @__PURE__ */ j({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = de(), s = A(
      () => t.channels.map((a) => ({ value: a.id, label: a.name }))
    ), o = A(() => ({ label: i("sidebar.channelSelectLabel") }));
    return (a, u) => (k(), V(An, {
      select: "",
      field: o.value,
      options: s.value,
      "model-value": n.selectedChannelId,
      "onUpdate:modelValue": u[0] || (u[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), mu = /* @__PURE__ */ j({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = de(), o = A(
      () => Pc(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard"),
        i("sidebar.bilingual")
      )
    ), a = A(() => ({ label: i("sidebar.translationSelectLabel") }));
    return (u, l) => (k(), V(An, {
      select: "",
      field: a.value,
      options: o.value,
      "model-value": n.selectedTranslationId,
      "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedTranslationId", c))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), $b = { class: "speaker-sidebar" }, Nb = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, Bb = { class: "sidebar-title" }, zb = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, Fb = { class: "sidebar-title" }, qb = {
  key: 2,
  class: "sidebar-section"
}, Vb = { class: "sidebar-title" }, Hb = { class: "subtitle-toggle" }, Wb = { class: "subtitle-toggle-label" }, Ub = { class: "subtitle-slider" }, jb = { class: "subtitle-slider-label" }, Kb = { class: "subtitle-slider-value" }, Gb = ["value", "disabled"], Xb = {
  key: 0,
  class: "subtitle-toggle"
}, Yb = { class: "subtitle-toggle-label" }, Zb = {
  key: 1,
  class: "subtitle-toggle"
}, Qb = { class: "subtitle-toggle-label" }, Jb = {
  key: 3,
  class: "sidebar-section"
}, e0 = { class: "sidebar-title" }, t0 = { class: "subtitle-toggle" }, n0 = { class: "subtitle-toggle-label" }, r0 = { class: "sidebar-title" }, i0 = { class: "history-list" }, s0 = ["datetime"], o0 = {
  key: 0,
  class: "history-version-list"
}, a0 = ["datetime"], l0 = {
  key: 5,
  class: "sidebar-section"
}, u0 = { class: "sidebar-title" }, c0 = { class: "speaker-list" }, d0 = /* @__PURE__ */ j({
  __name: "SpeakerSidebar",
  props: {
    speakers: {},
    channels: {},
    selectedChannelId: {},
    translations: {},
    selectedTranslationId: {},
    showSpeakers: { type: Boolean, default: !0 }
  },
  emits: ["update:selectedChannelId", "update:selectedTranslationId"],
  setup(n) {
    const e = Me(), { t } = de(), r = A(
      () => e.capabilities.value.speakers === "edit"
    ), i = A(() => e.live?.ttsReady.value ?? !1), s = A(
      () => i.value ? t("voicePlayback.description") : t("voicePlayback.unavailable")
    );
    function o(x) {
      !e.live || !i.value || (x ? e.live.enableTTS() : e.live.disableTTS());
    }
    const a = M(!1), u = M(null);
    function l(x, _) {
      e.transcriptionEditor ? e.transcriptionEditor.renameSpeaker(x, _) : ou(e, x, _);
    }
    function c(x) {
      u.value = x, a.value = !0;
    }
    const d = A(() => e.llmServices?.active.value ?? null), f = new Intl.DateTimeFormat(void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }), p = A(() => [...d.value?.generations.value ?? []].sort((_, w) => w.createdAt - _.createdAt)), m = A(() => [...d.value?.versions.value ?? []].sort((_, w) => w.versionNumber - _.versionNumber)), v = A(
      () => d.value?.currentGenerationId.value ?? null
    ), y = A(
      () => d.value?.activeVersionNumber.value ?? null
    ), T = A(() => d.value?.busy.value ?? !1);
    function S(x) {
      return x === "completed" ? "check" : x === "error" ? "x" : "spinner";
    }
    function E(x) {
      return t(x === "completed" ? "sidebar.statusCompleted" : x === "error" ? "sidebar.statusError" : x === "processing" ? "sidebar.statusProcessing" : "sidebar.statusQueued");
    }
    function C(x) {
      if (T.value || x === v.value) return;
      const _ = d.value;
      _ && e.emit("llmService:selectGeneration", { id: _.id, generationId: x });
    }
    function B(x) {
      if (T.value || x === y.value) return;
      const _ = d.value;
      _ && e.emit("llmService:selectVersion", { id: _.id, versionNumber: x });
    }
    return (x, _) => (k(), $("aside", $b, [
      n.channels.length > 1 ? (k(), $("section", Nb, [
        N("h2", Bb, K(h(t)("sidebar.channel")), 1),
        q(hu, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": _[0] || (_[0] = (w) => x.$emit("update:selectedChannelId", w))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : G("", !0),
      n.translations.length > 1 ? (k(), $("section", zb, [
        N("h2", Fb, K(h(t)("sidebar.translation")), 1),
        q(mu, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": _[1] || (_[1] = (w) => x.$emit("update:selectedTranslationId", w))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : G("", !0),
      h(e).subtitle ? (k(), $("section", qb, [
        N("h2", Vb, K(h(t)("sidebar.subtitle")), 1),
        N("div", Hb, [
          N("span", Wb, K(h(t)("subtitle.show")), 1),
          q(Sr, {
            modelValue: h(e).subtitle.isVisible.value,
            "onUpdate:modelValue": _[2] || (_[2] = (w) => h(e).subtitle.isVisible.value = w)
          }, null, 8, ["modelValue"])
        ]),
        N("label", Ub, [
          N("span", jb, [
            me(K(h(t)("subtitle.fontSize")) + " ", 1),
            N("span", Kb, K(h(e).subtitle.fontSize.value) + "px", 1)
          ]),
          N("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: h(e).subtitle.fontSize.value,
            disabled: !h(e).subtitle.isVisible.value,
            onInput: _[3] || (_[3] = (w) => h(e).subtitle.fontSize.value = Number(
              w.target.value
            ))
          }, null, 40, Gb)
        ]),
        h(e).subtitle.watermark && !h(e).subtitle.watermark.readonly ? (k(), $("div", Xb, [
          N("span", Yb, K(h(t)("subtitle.showWatermark")), 1),
          q(Sr, {
            modelValue: h(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": _[4] || (_[4] = (w) => h(e).subtitle.watermark.display.value = w),
            disabled: !h(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : G("", !0),
        h(e).subtitle.watermark && !h(e).subtitle.watermark.readonly && h(e).subtitle.watermark.display.value ? (k(), $("div", Zb, [
          N("span", Qb, K(h(t)("subtitle.pinWatermark")), 1),
          q(Sr, {
            modelValue: h(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": _[5] || (_[5] = (w) => h(e).subtitle.watermark.pinned.value = w),
            disabled: !h(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : G("", !0)
      ])) : G("", !0),
      h(e).live && h(e).live.ttsAvailable ? (k(), $("section", Jb, [
        N("h2", e0, K(h(t)("sidebar.voicePlayback")), 1),
        N("div", t0, [
          N("span", n0, K(h(t)("voicePlayback.enable")), 1),
          q(Sr, {
            "model-value": h(e).live.ttsEnabled.value,
            disabled: !i.value,
            "onUpdate:modelValue": o
          }, null, 8, ["model-value", "disabled"])
        ]),
        N("p", {
          class: Te(["voice-playback-hint", { "voice-playback-hint--warning": !i.value }])
        }, K(s.value), 3)
      ])) : G("", !0),
      d.value && p.value.length ? (k(), $("section", {
        key: 4,
        class: Te(["sidebar-section", { "sidebar-section--busy": T.value }])
      }, [
        N("h2", r0, K(h(t)("sidebar.history")), 1),
        N("ul", i0, [
          (k(!0), $(ye, null, ze(p.value, (w) => (k(), $("li", {
            key: w.generationId,
            class: Te(["history-generation", {
              "history-generation--current": w.generationId === v.value
            }])
          }, [
            q(as, {
              current: w.generationId === v.value,
              disabled: T.value,
              onSelect: (b) => C(w.generationId)
            }, {
              leading: z(() => [
                q(Qe, {
                  name: S(w.status),
                  spin: w.status === "processing" || w.status === "queued",
                  size: 14,
                  class: Te(`history-generation__status--${w.status}`)
                }, null, 8, ["name", "spin", "class"])
              ]),
              trailing: z(() => [
                me(K(E(w.status)), 1)
              ]),
              default: z(() => [
                N("time", {
                  datetime: new Date(w.createdAt).toISOString()
                }, K(h(f).format(w.createdAt)), 9, s0)
              ]),
              _: 2
            }, 1032, ["current", "disabled", "onSelect"]),
            w.generationId === v.value && m.value.length ? (k(), $("ul", o0, [
              (k(!0), $(ye, null, ze(m.value, (b) => (k(), $("li", {
                key: b.versionNumber
              }, [
                q(as, {
                  size: "sm",
                  current: b.versionNumber === y.value,
                  disabled: T.value,
                  onSelect: (R) => B(b.versionNumber)
                }, {
                  trailing: z(() => [
                    N("time", {
                      datetime: new Date(b.createdAt).toISOString()
                    }, K(h(f).format(b.createdAt)), 9, a0)
                  ]),
                  default: z(() => [
                    me(" v" + K(b.versionNumber) + " ", 1)
                  ]),
                  _: 2
                }, 1032, ["current", "disabled", "onSelect"])
              ]))), 128))
            ])) : G("", !0)
          ], 2))), 128))
        ])
      ], 2)) : G("", !0),
      n.showSpeakers && n.speakers.length ? (k(), $("section", l0, [
        N("h2", u0, K(h(t)("sidebar.speakers")), 1),
        N("ul", c0, [
          (k(!0), $(ye, null, ze(n.speakers, (w) => (k(), $("li", {
            key: w.id,
            class: "speaker-item"
          }, [
            q(ws, {
              color: w.color
            }, null, 8, ["color"]),
            q(Tb, {
              class: "speaker-name",
              "model-value": w.name,
              disabled: !r.value,
              "aria-label": h(t)("sidebar.renameSpeaker"),
              onCommit: (b) => l(w.id, b)
            }, null, 8, ["model-value", "disabled", "aria-label", "onCommit"]),
            r.value && n.speakers.length > 1 ? (k(), V(Rb, {
              key: 0,
              "speaker-name": w.name,
              onMerge: (b) => c(w.id)
            }, null, 8, ["speaker-name", "onMerge"])) : G("", !0)
          ]))), 128))
        ])
      ])) : G("", !0),
      r.value ? (k(), V(Lb, {
        key: 6,
        open: a.value,
        "onUpdate:open": _[6] || (_[6] = (w) => a.value = w),
        "from-speaker-id": u.value
      }, null, 8, ["open", "from-speaker-id"])) : G("", !0)
    ]));
  }
}), xa = /* @__PURE__ */ ae(d0, [["__scopeId", "data-v-4d0d9571"]]), f0 = /* @__PURE__ */ j({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = yc(n, "open"), { t } = de();
    return (r, i) => (k(), V(h(Ih), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: z(() => [
        q(h(fm), { disabled: "" }, {
          default: z(() => [
            q(h(um), { class: "editor-overlay" }),
            q(h(sm), { class: "sidebar-drawer" }, {
              default: z(() => [
                q(h(hm), { class: "sr-only" }, {
                  default: z(() => [
                    me(K(h(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(h(Ph), {
                  class: "sidebar-close",
                  "aria-label": h(t)("header.closeSidebar")
                }, {
                  default: z(() => [
                    q(h(ks), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                Q(r.$slots, "default")
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
}), p0 = /* @__PURE__ */ j({
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
    const t = n, r = M(!1);
    let i;
    async function s() {
      if (!r.value)
        try {
          await t.copyFn(), r.value = !0, i = setTimeout(() => {
            r.value = !1;
          }, 2e3);
        } catch (u) {
          console.error(u);
        }
    }
    e({
      reset: () => {
        r.value = !1, clearTimeout(i);
      }
    });
    const o = A(() => r.value ? "check" : t.icon), a = A(() => kl[t.size ?? "sm"]);
    return (u, l) => (k(), V(re, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: Te({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: z(() => [
        q(Wr, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: z(() => [
            (k(), V(Qe, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: z(() => [
        Q(u.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Fr = /* @__PURE__ */ ae(p0, [["__scopeId", "data-v-0077b14e"]]), h0 = ["aria-label"], m0 = { class: "selection-count" }, v0 = { class: "selection-actions" }, g0 = /* @__PURE__ */ j({
  __name: "SelectionActionBar",
  setup(n) {
    const e = cu(), { t } = de();
    return (r, i) => h(e).hasSelection.value ? (k(), $("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": h(t)("selection.count")
    }, [
      N("span", m0, K(h(e).count.value) + " " + K(h(t)("selection.count")), 1),
      N("div", v0, [
        q(Fr, {
          icon: "clipboard-type",
          "copy-fn": h(e).copyText,
          variant: "secondary"
        }, {
          default: z(() => [
            me(K(h(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(Fr, {
          icon: "clipboard-list",
          "copy-fn": h(e).copyWithMetadata
        }, {
          default: z(() => [
            me(K(h(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(re, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => h(e).clear())
        }, {
          default: z(() => [
            me(K(h(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, h0)) : G("", !0);
  }
}), y0 = /* @__PURE__ */ ae(g0, [["__scopeId", "data-v-1f9dee3a"]]), b0 = "(max-width: 767px)";
function k0() {
  const n = M(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return _e(() => {
    e = window.matchMedia(b0), n.value = e.matches, e.addEventListener("change", t);
  }), gt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const w0 = { class: "editor-layout" }, S0 = { class: "editor-body" }, T0 = {
  key: 6,
  class: "mobile-selectors"
}, _0 = /* @__PURE__ */ j({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Me(), { isMobile: r } = k0(), i = M(!1), s = M(gn), o = A(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), a = t.speakers.all;
    py(o, a, t);
    const u = A(() => [...t.channels.values()]), l = A(
      () => t.activeChannel.value?.selectableTranslations ?? []
    ), c = A(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), d = A(() => Array.from(a.values())), f = A(() => s.value === gn), p = A(() => s.value === _r), m = A(() => f.value || p.value ? null : t.llmServices?.get(s.value) ?? null);
    oe(s, (T) => {
      t.llmServices && (T === gn || T === _r ? t.llmServices.setActive(null) : t.llmServices.setActive(T));
    }), oe(
      () => t.llmServices?.list.value.map((T) => T.id).join("|"),
      () => {
        s.value !== gn && s.value !== _r && !t.llmServices?.get(s.value) && (s.value = gn);
      }
    ), oe(
      () => t.activeChannelId.value,
      () => {
        t.audio?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), oe(f, (T) => {
      T || t.audio?.pause();
    });
    function v(T) {
      t.setActiveChannel(T);
    }
    function y(T) {
      t.activeChannel.value?.setActiveTranslation(T);
    }
    return (T, S) => (k(), $("div", w0, [
      e.showHeader ? (k(), V(xp, {
        key: 0,
        title: h(t).title.value,
        date: h(t).date.value,
        duration: h(t).activeChannel.value?.duration ?? 0,
        "speaker-count": h(a).size,
        "is-mobile": h(r),
        "can-ask": !!h(t).chat,
        onToggleSidebar: S[0] || (S[0] = (E) => i.value = !i.value),
        onOpenChat: S[1] || (S[1] = (E) => h(t).chat?.setDrawerOpen(!0))
      }, null, 8, ["title", "date", "duration", "speaker-count", "is-mobile", "can-ask"])) : G("", !0),
      q(Dp, {
        modelValue: s.value,
        "onUpdate:modelValue": S[2] || (S[2] = (E) => s.value = E)
      }, null, 8, ["modelValue"]),
      f.value ? (k(), V(y0, { key: 1 })) : G("", !0),
      N("main", S0, [
        f.value ? (k(), V(_a, {
          key: 0,
          turns: o.value,
          speakers: h(a)
        }, null, 8, ["turns", "speakers"])) : p.value ? (k(), V(vb, { key: 1 })) : m.value ? (k(), V(Ht(h(t).components.llmServicePanel), {
          key: m.value.id,
          service: m.value
        }, null, 8, ["service"])) : (k(), V(_a, {
          key: 3,
          turns: o.value,
          speakers: h(a)
        }, null, 8, ["turns", "speakers"])),
        h(r) ? G("", !0) : (k(), V(xa, {
          key: 4,
          speakers: d.value,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": c.value,
          "show-speakers": f.value,
          "onUpdate:selectedChannelId": v,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id", "show-speakers"])),
        h(r) ? (k(), V(f0, {
          key: 5,
          open: i.value,
          "onUpdate:open": S[3] || (S[3] = (E) => i.value = E)
        }, {
          default: z(() => [
            q(xa, {
              speakers: d.value,
              channels: u.value,
              "selected-channel-id": h(t).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": c.value,
              "show-speakers": f.value,
              "onUpdate:selectedChannelId": v,
              "onUpdate:selectedTranslationId": y
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id", "show-speakers"])
          ]),
          _: 1
        }, 8, ["open"])) : G("", !0)
      ]),
      h(t).audio?.src.value ? Hn((k(), V(Ht(h(t).components.player), {
        key: 2,
        "audio-src": h(t).audio.src.value
      }, null, 8, ["audio-src"])), [
        [Ka, f.value]
      ]) : G("", !0),
      h(t).subtitle?.isVisible.value && !h(r) && !h(t).subtitle.isFullscreen.value ? (k(), V(Ht(h(t).components.subtitleBanner), { key: 3 })) : G("", !0),
      h(t).subtitle?.isFullscreen.value ? (k(), V(Ht(h(t).components.subtitleFullscreen), { key: 4 })) : G("", !0),
      h(t).chat ? (k(), V(Ht(h(t).components.chatDrawer), { key: 5 })) : G("", !0),
      h(r) && (u.value.length > 1 || l.value.length > 1) ? (k(), $("div", T0, [
        u.value.length > 1 ? (k(), V(hu, {
          key: 0,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          "onUpdate:selectedChannelId": v
        }, null, 8, ["channels", "selected-channel-id"])) : G("", !0),
        l.value.length > 1 ? (k(), V(mu, {
          key: 1,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedTranslationId": y
        }, null, 8, ["translations", "selected-translation-id"])) : G("", !0)
      ])) : G("", !0)
    ]));
  }
}), $1 = /* @__PURE__ */ ae(_0, [["__scopeId", "data-v-88a8e0cd"]]), x0 = { class: "player-controls" }, E0 = { class: "controls-left" }, C0 = { class: "controls-time" }, A0 = { class: "time-display" }, I0 = { class: "time-display" }, R0 = { class: "controls-right" }, P0 = ["value", "aria-label", "disabled"], M0 = /* @__PURE__ */ j({
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
    const t = e, { t: r } = de(), i = M(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (k(), $("div", x0, [
      N("div", E0, [
        q(re, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": h(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (u) => t("skipBack"))
        }, {
          icon: z(() => [
            q(h(vl), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(re, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? h(r)("player.pause") : h(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (u) => t("togglePlay"))
        }, {
          icon: z(() => [
            n.isPlaying ? (k(), V(h(hl), {
              key: 0,
              size: 20
            })) : (k(), V(h(ml), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(re, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": h(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (u) => t("skipForward"))
        }, {
          icon: z(() => [
            q(h(gl), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      N("div", C0, [
        N("time", A0, K(n.currentTime), 1),
        a[7] || (a[7] = N("span", { class: "time-separator" }, "/", -1)),
        N("time", I0, K(n.duration), 1)
      ]),
      N("div", R0, [
        N("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (u) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (u) => i.value = !1)
        }, [
          q(re, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? h(r)("player.unmute") : h(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (u) => t("toggleMute"))
          }, {
            icon: z(() => [
              n.isMuted ? (k(), V(h(bl), {
                key: 0,
                size: 16
              })) : (k(), V(h(yl), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Hn(N("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": h(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, P0), [
            [Ka, i.value]
          ])
        ], 32),
        q(re, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": h(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (u) => t("cyclePlaybackRate"))
        }, {
          default: z(() => [
            me(K(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), O0 = /* @__PURE__ */ ae(M0, [["__scopeId", "data-v-c1fa47b1"]]);
function Be(n, e, t, r) {
  return new (t || (t = Promise))((function(i, s) {
    function o(l) {
      try {
        u(r.next(l));
      } catch (c) {
        s(c);
      }
    }
    function a(l) {
      try {
        u(r.throw(l));
      } catch (c) {
        s(c);
      }
    }
    function u(l) {
      var c;
      l.done ? i(l.value) : (c = l.value, c instanceof t ? c : new t((function(d) {
        d(c);
      }))).then(o, a);
    }
    u((r = r.apply(n, e || [])).next());
  }));
}
let er = class {
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
const Tr = { decode: function(n, e) {
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
        const u = Math.abs(i[a]);
        u > o && (o = u);
      }
      for (const a of r) for (let u = 0; u < s; u++) a[u] /= o;
    }
  })(n);
  const t = n.map(((r) => r instanceof Float32Array ? r : Float32Array.from(r)));
  return { duration: e, length: t[0].length, sampleRate: t[0].length / e, numberOfChannels: t.length, getChannelData: (r) => {
    const i = t[r];
    if (!i) throw new Error(`Channel ${r} not found`);
    return i;
  }, copyFromChannel: AudioBuffer.prototype.copyFromChannel, copyToChannel: AudioBuffer.prototype.copyToChannel };
} };
function vu(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(vu(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Ea(n, e, t) {
  const r = vu(n, e || {});
  return t?.appendChild(r), r;
}
var D0 = Object.freeze({ __proto__: null, createElement: Ea, default: Ea });
const L0 = { fetchBlob: function(n, e, t) {
  return Be(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Be(this, void 0, void 0, (function* () {
        if (!i.body || !i.headers) return;
        const o = i.body.getReader(), a = Number(i.headers.get("Content-Length")) || 0;
        let u = 0;
        const l = (c) => {
          u += c?.length || 0;
          const d = Math.round(u / a * 100);
          s(d);
        };
        try {
          for (; ; ) {
            const c = yield o.read();
            if (c.done) break;
            l(c.value);
          }
        } catch (c) {
          console.warn("Progress tracking error:", c);
        }
      }));
    })(r.clone(), e), r.blob();
  }));
} };
function Se(n) {
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
function Ut(n, e) {
  const t = Se(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function It(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class $0 extends er {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Se(!1), this._currentTime = Se(0), this._duration = Se(0), this._volume = Se(this.media.volume), this._muted = Se(this.media.muted), this._playbackRate = Se(this.media.playbackRate || 1), this._seeking = Se(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
function N0({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function B0({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function Ca(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function gu(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function Aa(n, e) {
  if (!gu(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function Ia({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function yu(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function z0(n) {
  const e = Se({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ut((() => (function(s) {
    const { scrollLeft: o, scrollWidth: a, clientWidth: u } = s;
    if (a === 0) return { startX: 0, endX: 1 };
    const l = o / a, c = (o + u) / a;
    return { startX: Math.max(0, Math.min(1, l)), endX: Math.max(0, Math.min(1, c)) };
  })(e.value)), [e]), r = Ut((() => (function(s) {
    return { left: s.scrollLeft, right: s.scrollLeft + s.clientWidth };
  })(e.value)), [e]), i = () => {
    e.set({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth });
  };
  return n.addEventListener("scroll", i, { passive: !0 }), { scrollData: e, percentages: t, bounds: r, cleanup: () => {
    n.removeEventListener("scroll", i), yu(e);
  } };
}
class F0 extends er {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Ca(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = Ca(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = z0(this.scrollContainer);
    const e = It((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = Se(null), u = /* @__PURE__ */ new Map(), l = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (f) => {
        if (f.button !== s || (u.set(f.pointerId, f), u.size > 1)) return;
        let p = f.clientX, m = f.clientY, v = !1;
        const y = Date.now(), T = t.getBoundingClientRect(), { left: S, top: E } = T, C = (b) => {
          if (b.defaultPrevented || u.size > 1 || l && Date.now() - y < o) return;
          const R = b.clientX, D = b.clientY, H = R - p, L = D - m;
          (v || Math.abs(H) > i || Math.abs(L) > i) && (b.preventDefault(), b.stopPropagation(), v || (a.set({ type: "start", x: p - S, y: m - E }), v = !0), a.set({ type: "move", x: R - S, y: D - E, deltaX: H, deltaY: L }), p = R, m = D);
        }, B = (b) => {
          if (u.delete(b.pointerId), v) {
            const R = b.clientX, D = b.clientY;
            a.set({ type: "end", x: R - S, y: D - E });
          }
          c();
        }, x = (b) => {
          u.delete(b.pointerId), b.relatedTarget && b.relatedTarget !== document.documentElement || B(b);
        }, _ = (b) => {
          v && (b.stopPropagation(), b.preventDefault());
        }, w = (b) => {
          b.defaultPrevented || u.size > 1 || v && b.preventDefault();
        };
        document.addEventListener("pointermove", C), document.addEventListener("pointerup", B), document.addEventListener("pointerout", x), document.addEventListener("pointercancel", x), document.addEventListener("touchmove", w, { passive: !1 }), document.addEventListener("click", _, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", C), document.removeEventListener("pointerup", B), document.removeEventListener("pointerout", x), document.removeEventListener("pointercancel", x), document.removeEventListener("touchmove", w), setTimeout((() => {
            document.removeEventListener("click", _, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), u.clear(), yu(a);
      } };
    })(this.wrapper);
    const e = It((() => {
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
    return (function({ optionsHeight: s, optionsSplitChannels: o, parentHeight: a, numberOfChannels: u, defaultHeight: l = 128 }) {
      if (s == null) return l;
      const c = Number(s);
      if (!isNaN(c)) return c;
      if (s === "auto") {
        const d = a || l;
        return o?.every(((f) => !f.overlay)) ? d / u : d;
      }
      return l;
    })({ optionsHeight: e, optionsSplitChannels: t, parentHeight: this.parent.clientHeight, numberOfChannels: i, defaultHeight: 128 });
  }
  convertColorValues(e, t) {
    return (function(r, i, s) {
      if (!Array.isArray(r)) return r || "";
      if (r.length === 0) return "#999";
      if (r.length < 2) return r[0] || "";
      const o = document.createElement("canvas"), a = o.getContext("2d"), u = s ?? o.height * i, l = a.createLinearGradient(0, 0, 0, u || i), c = 1 / (r.length - 1);
      return r.forEach(((d, f) => {
        l.addColorStop(f * c, d);
      })), l;
    })(e, this.getPixelRatio(), t?.canvas.height);
  }
  getPixelRatio() {
    return e = window.devicePixelRatio, Math.max(1, e || 1);
    var e;
  }
  renderBarWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: u, barRadius: l, barIndexScale: c, barSpacing: d, barMinHeight: f } = (function({ width: m, height: v, length: y, options: T, pixelRatio: S }) {
      const E = v / 2, C = T.barWidth ? T.barWidth * S : 1, B = T.barGap ? T.barGap * S : T.barWidth ? C / 2 : 0, x = C + B || 1;
      return { halfHeight: E, barWidth: C, barGap: B, barRadius: T.barRadius || 0, barMinHeight: T.barMinHeight ? T.barMinHeight * S : 0, barIndexScale: y > 0 ? m / x / y : 0, barSpacing: x };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: m, barIndexScale: v, barSpacing: y, barWidth: T, halfHeight: S, vScale: E, canvasHeight: C, barAlign: B, barMinHeight: x }) {
      const _ = m[0] || [], w = m[1] || _, b = _.length, R = [];
      let D = 0, H = 0, L = 0;
      for (let O = 0; O <= b; O++) {
        const P = Math.round(O * v);
        if (P > D) {
          const { topHeight: ie, totalHeight: se } = N0({ maxTop: H, maxBottom: L, halfHeight: S, vScale: E, barMinHeight: x, barAlign: B }), be = B0({ barAlign: B, halfHeight: S, topHeight: ie, totalHeight: se, canvasHeight: C });
          R.push({ x: D * y, y: be, width: T, height: se }), D = P, H = 0, L = 0;
        }
        const W = Math.abs(_[O] || 0), X = Math.abs(w[O] || 0);
        W > H && (H = W), X > L && (L = X);
      }
      return R;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: u, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const m of p) l && "roundRect" in r ? r.roundRect(m.x, m.y, m.width, m.height, l) : r.rect(m.x, m.y, m.width, m.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: u, width: l, height: c, vScale: d }) {
      const f = c / 2, p = u[0] || [];
      return [p, u[1] || p].map(((m, v) => {
        const y = m.length, T = y ? l / y : 0, S = f, E = v === 0 ? -1 : 1, C = [{ x: 0, y: S }];
        let B = 0, x = 0;
        for (let _ = 0; _ <= y; _++) {
          const w = Math.round(_ * T);
          if (w > B) {
            const R = S + (Math.round(x * f * d) || 1) * E;
            C.push({ x: B, y: R }), B = w, x = 0;
          }
          const b = Math.abs(m[_] || 0);
          b > x && (x = b);
        }
        return C.push({ x: B, y: S }), C;
      }));
    })({ channelData: e, width: s, height: o, vScale: i });
    r.beginPath();
    for (const u of a) if (u.length) {
      r.moveTo(u[0].x, u[0].y);
      for (let l = 1; l < u.length; l++) {
        const c = u[l];
        r.lineTo(c.x, c.y);
      }
    }
    r.fill(), r.closePath();
  }
  renderWaveform(e, t, r) {
    if (r.fillStyle = this.convertColorValues(t.waveColor, r), t.renderFunction) return void t.renderFunction(e, r);
    const i = (function({ channelData: s, barHeight: o, normalize: a, maxPeak: u }) {
      var l;
      const c = o || 1;
      if (!a) return c;
      const d = s[0];
      if (!d || d.length === 0) return c;
      let f = u ?? 0;
      if (!u) for (let p = 0; p < d.length; p++) {
        const m = (l = d[p]) !== null && l !== void 0 ? l : 0, v = Math.abs(m);
        v > f && (f = v);
      }
      return f ? c / f : c;
    })({ channelData: e, barHeight: t.barHeight, normalize: t.normalize, maxPeak: t.maxPeak });
    gu(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
  }
  renderSingleCanvas(e, t, r, i, s, o, a) {
    const u = this.getPixelRatio(), l = document.createElement("canvas");
    l.width = Math.round(r * u), l.height = Math.round(i * u), l.style.width = `${r}px`, l.style.height = `${i}px`, l.style.left = `${Math.round(s)}px`, o.appendChild(l);
    const c = l.getContext("2d");
    if (t.renderFunction ? (c.fillStyle = this.convertColorValues(t.waveColor, c), t.renderFunction(e, c)) : this.renderWaveform(e, t, c), l.width > 0 && l.height > 0) {
      const d = l.cloneNode(), f = d.getContext("2d");
      f.drawImage(l, 0, 0), f.globalCompositeOperation = "source-in", f.fillStyle = this.convertColorValues(t.progressColor, f), f.fillRect(0, 0, l.width, l.height), a.appendChild(d);
    }
  }
  renderMultiCanvas(e, t, r, i, s, o) {
    const a = this.getPixelRatio(), { clientWidth: u } = this.scrollContainer, l = r / a, c = (function({ clientWidth: m, totalWidth: v, options: y }) {
      return Aa(Math.min(8e3, m, v), y);
    })({ clientWidth: u, totalWidth: l, options: t });
    let d = {};
    if (c === 0) return;
    const f = (m) => {
      if (m < 0 || m >= p || d[m]) return;
      d[m] = !0;
      const v = m * c;
      let y = Math.min(l - v, c);
      if (y = Aa(y, t), y <= 0) return;
      const T = (function({ channelData: S, offset: E, clampedWidth: C, totalWidth: B }) {
        return S.map(((x) => {
          const _ = Math.floor(E / B * x.length), w = Math.floor((E + C) / B * x.length);
          return x.slice(_, w);
        }));
      })({ channelData: e, offset: v, clampedWidth: y, totalWidth: l });
      this.renderSingleCanvas(T, t, y, i, v, s, o);
    }, p = Math.ceil(l / c);
    if (!this.isScrollable) {
      for (let m = 0; m < p; m++) f(m);
      return;
    }
    if (Ia({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: l, numCanvases: p }).forEach(((m) => f(m))), p > 1) {
      const m = this.on("scroll", (() => {
        const { scrollLeft: v } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Ia({ scrollLeft: v, totalWidth: l, numCanvases: p }).forEach(((y) => f(y)));
      }));
      this.unsubscribeOnScroll.push(m);
    }
  }
  renderChannel(e, t, r, i) {
    var { overlay: s } = t, o = (function(c, d) {
      var f = {};
      for (var p in c) Object.prototype.hasOwnProperty.call(c, p) && d.indexOf(p) < 0 && (f[p] = c[p]);
      if (c != null && typeof Object.getOwnPropertySymbols == "function") {
        var m = 0;
        for (p = Object.getOwnPropertySymbols(c); m < p.length; m++) d.indexOf(p[m]) < 0 && Object.prototype.propertyIsEnumerable.call(c, p[m]) && (f[p[m]] = c[p[m]]);
      }
      return f;
    })(t, ["overlay"]);
    const a = document.createElement("div"), u = this.getHeight(o.height, o.splitChannels);
    a.style.height = `${u}px`, s && i > 0 && (a.style.marginTop = `-${u}px`), this.canvasWrapper.style.minHeight = `${u}px`, this.canvasWrapper.appendChild(a);
    const l = a.cloneNode();
    this.progressWrapper.appendChild(l), this.renderMultiCanvas(e, o, r, u, a, l);
  }
  render(e) {
    return Be(this, void 0, void 0, (function* () {
      var t;
      this.timeouts.forEach(((l) => l())), this.timeouts = [], this.canvasWrapper.innerHTML = "", this.progressWrapper.innerHTML = "", this.options.width != null && (this.scrollContainer.style.width = typeof this.options.width == "number" ? `${this.options.width}px` : this.options.width);
      const r = this.getPixelRatio(), i = this.scrollContainer.clientWidth, { scrollWidth: s, isScrollable: o, useParentWidth: a, width: u } = (function({ duration: l, minPxPerSec: c = 0, parentWidth: d, fillParent: f, pixelRatio: p }) {
        const m = Math.ceil(l * c), v = m > d, y = !!(f && !v);
        return { scrollWidth: m, isScrollable: v, useParentWidth: y, width: (y ? d : m) * p };
      })({ duration: e.duration, minPxPerSec: this.options.minPxPerSec || 0, parentWidth: i, fillParent: this.options.fillParent, pixelRatio: r });
      if (this.isScrollable = o, this.wrapper.style.width = a ? "100%" : `${s}px`, this.scrollContainer.style.overflowX = this.isScrollable ? "auto" : "hidden", this.scrollContainer.classList.toggle("noScrollbar", !!this.options.hideScrollbar), this.cursor.style.backgroundColor = `${this.options.cursorColor || this.options.progressColor}`, this.cursor.style.width = `${this.options.cursorWidth}px`, this.audioData = e, this.emit("render"), this.options.splitChannels) for (let l = 0; l < e.numberOfChannels; l++) {
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
    const { scrollLeft: r, scrollWidth: i, clientWidth: s } = this.scrollContainer, o = e * i, a = r, u = r + s, l = s / 2;
    if (this.isDragging)
      o + 30 > u ? this.scrollContainer.scrollLeft += 30 : o - 30 < a && (this.scrollContainer.scrollLeft -= 30);
    else {
      (o < a || o > u) && (this.scrollContainer.scrollLeft = o - (this.options.autoCenter ? l : 0));
      const c = o - r - l;
      t && this.options.autoCenter && c > 0 && (this.scrollContainer.scrollLeft += c);
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
        s.toBlob(((u) => {
          u ? o(u) : a(new Error("Could not export image"));
        }), e, t);
      })))));
    }));
  }
}
class q0 extends er {
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
class $i extends er {
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
const V0 = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Kn extends $0 {
  static create(e) {
    return new Kn(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new $i() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, V0, e);
    const { state: r, actions: i } = (function(a) {
      var u, l, c, d, f, p;
      const m = (u = a?.currentTime) !== null && u !== void 0 ? u : Se(0), v = (l = a?.duration) !== null && l !== void 0 ? l : Se(0), y = (c = a?.isPlaying) !== null && c !== void 0 ? c : Se(!1), T = (d = a?.isSeeking) !== null && d !== void 0 ? d : Se(!1), S = (f = a?.volume) !== null && f !== void 0 ? f : Se(1), E = (p = a?.playbackRate) !== null && p !== void 0 ? p : Se(1), C = Se(null), B = Se(null), x = Se(""), _ = Se(0), w = Se(0), b = Ut((() => !y.value), [y]), R = Ut((() => C.value !== null), [C]), D = Ut((() => R.value && v.value > 0), [R, v]), H = Ut((() => m.value), [m]), L = Ut((() => v.value > 0 ? m.value / v.value : 0), [m, v]);
      return { state: { currentTime: m, duration: v, isPlaying: y, isPaused: b, isSeeking: T, volume: S, playbackRate: E, audioBuffer: C, peaks: B, url: x, zoom: _, scrollPosition: w, canPlay: R, isReady: D, progress: H, progressPercent: L }, actions: { setCurrentTime: (O) => {
        const P = Math.max(0, Math.min(v.value || 1 / 0, O));
        m.set(P);
      }, setDuration: (O) => {
        v.set(Math.max(0, O));
      }, setPlaying: (O) => {
        y.set(O);
      }, setSeeking: (O) => {
        T.set(O);
      }, setVolume: (O) => {
        const P = Math.max(0, Math.min(1, O));
        S.set(P);
      }, setPlaybackRate: (O) => {
        const P = Math.max(0.1, Math.min(16, O));
        E.set(P);
      }, setAudioBuffer: (O) => {
        C.set(O), O && v.set(O.duration);
      }, setPeaks: (O) => {
        B.set(O);
      }, setUrl: (O) => {
        x.set(O);
      }, setZoom: (O) => {
        _.set(Math.max(0, O));
      }, setScrollPosition: (O) => {
        w.set(Math.max(0, O));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new q0();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new F0(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
    const o = this.options.url || this.getSrc() || "";
    Promise.resolve().then((() => {
      this.emit("init");
      const { peaks: a, duration: u } = this.options;
      (o || a && u) && this.load(o, a, u).catch(((l) => {
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
      const r = [];
      r.push(It((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(It((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(It((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(It((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(It((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, u = e.duration.value, l = u > 0 && a >= u;
        s && !o && l && t.emit("finish"), s = o && l;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(It((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = Tr.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = Tr.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
        const u = (c) => this.emit("loading", c);
        t = yield L0.fetchBlob(e, u, a);
        const l = this.options.blobMimeType;
        l && (t = new Blob([t], { type: l }));
      }
      this.setSrc(e, t);
      const o = yield new Promise(((a) => {
        const u = i || this.getDuration();
        u ? a(u) : this.mediaSubscriptions.push(this.onMediaEvent("loadedmetadata", (() => a(this.getDuration())), { once: !0 }));
      }));
      if (!e && !t) {
        const a = this.getMediaElement();
        a instanceof $i && (a.duration = o);
      }
      if (r) this.decodedData = Tr.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield Tr.decode(a, this.options.sampleRate);
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
      const a = this.decodedData.getChannelData(o), u = [], l = a.length / t;
      for (let c = 0; c < t; c++) {
        const d = a.slice(Math.floor(c * l), Math.ceil((c + 1) * l));
        let f = 0;
        for (let p = 0; p < d.length; p++) {
          const m = d[p];
          Math.abs(m) > Math.abs(f) && (f = m);
        }
        u.push(Math.round(f * r) / r);
      }
      s.push(u);
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
      return t != null && (this.media instanceof $i ? this.media.stopAt(t) : this.stopAtPosition = t), i;
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
Kn.BasePlugin = class extends er {
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
}, Kn.dom = D0;
class bu {
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
class H0 extends bu {
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
function ku(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(ku(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function Vn(n, e, t) {
  const r = ku(n, e || {});
  return t?.appendChild(r), r;
}
function wu(n) {
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
function Er(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function mn(n, e) {
  const t = wu(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function Vt(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Cr(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = wu(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let u = () => {
  };
  const l = (c) => {
    if (c.button !== r || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, f = c.clientY, p = !1;
    const m = Date.now(), v = n.getBoundingClientRect(), { left: y, top: T } = v, S = (_) => {
      if (_.defaultPrevented || o.size > 1 || a && Date.now() - m < i) return;
      const w = _.clientX, b = _.clientY, R = w - d, D = b - f;
      (p || Math.abs(R) > t || Math.abs(D) > t) && (_.preventDefault(), _.stopPropagation(), p || (s.set({ type: "start", x: d - y, y: f - T }), p = !0), s.set({ type: "move", x: w - y, y: b - T, deltaX: R, deltaY: D }), d = w, f = b);
    }, E = (_) => {
      if (o.delete(_.pointerId), p) {
        const w = _.clientX, b = _.clientY;
        s.set({ type: "end", x: w - y, y: b - T });
      }
      u();
    }, C = (_) => {
      o.delete(_.pointerId), _.relatedTarget && _.relatedTarget !== document.documentElement || E(_);
    }, B = (_) => {
      p && (_.stopPropagation(), _.preventDefault());
    }, x = (_) => {
      _.defaultPrevented || o.size > 1 || p && _.preventDefault();
    };
    document.addEventListener("pointermove", S), document.addEventListener("pointerup", E), document.addEventListener("pointerout", C), document.addEventListener("pointercancel", C), document.addEventListener("touchmove", x, { passive: !1 }), document.addEventListener("click", B, { capture: !0 }), u = () => {
      document.removeEventListener("pointermove", S), document.removeEventListener("pointerup", E), document.removeEventListener("pointerout", C), document.removeEventListener("pointercancel", C), document.removeEventListener("touchmove", x), setTimeout((() => {
        document.removeEventListener("click", B, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", l), { signal: s, cleanup: () => {
    u(), n.removeEventListener("pointerdown", l), o.clear(), Vt(s);
  } };
}
class Ra extends bu {
  constructor(e, t, r = 0) {
    var i, s, o, a, u, l, c, d, f, p;
    super(), this.totalDuration = t, this.numberOfChannels = r, this.element = null, this.minLength = 0, this.maxLength = 1 / 0, this.contentEditable = !1, this.subscriptions = [], this.updatingSide = void 0, this.isRemoved = !1, this.subscriptions = [], this.id = e.id || `region-${Math.random().toString(32).slice(2)}`, this.start = this.clampPosition(e.start), this.end = this.clampPosition((i = e.end) !== null && i !== void 0 ? i : e.start), this.drag = (s = e.drag) === null || s === void 0 || s, this.resize = (o = e.resize) === null || o === void 0 || o, this.resizeStart = (a = e.resizeStart) === null || a === void 0 || a, this.resizeEnd = (u = e.resizeEnd) === null || u === void 0 || u, this.color = (l = e.color) !== null && l !== void 0 ? l : "rgba(0, 0, 0, 0.1)", this.minLength = (c = e.minLength) !== null && c !== void 0 ? c : this.minLength, this.maxLength = (d = e.maxLength) !== null && d !== void 0 ? d : this.maxLength, this.channelIdx = (f = e.channelIdx) !== null && f !== void 0 ? f : -1, this.contentEditable = (p = e.contentEditable) !== null && p !== void 0 ? p : this.contentEditable, this.element = this.initElement(), this.setContent(e.content), this.setPart(), this.renderPosition(), this.initMouseEvents();
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = Vn("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = Vn("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Cr(r, { threshold: 1 }), o = Cr(i, { threshold: 1 }), a = Er((() => {
      const l = s.signal.value;
      l && (l.type === "move" && l.deltaX !== void 0 ? this.onResize(l.deltaX, "start") : l.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), u = Er((() => {
      const l = o.signal.value;
      l && (l.type === "move" && l.deltaX !== void 0 ? this.onResize(l.deltaX, "end") : l.type === "end" && this.onEndResizing("end"));
    }), [o.signal]);
    this.subscriptions.push((() => {
      a(), u(), s.cleanup(), o.cleanup();
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
    const i = Vn("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = mn(e, "click"), r = mn(e, "mouseenter"), i = mn(e, "mouseleave"), s = mn(e, "dblclick"), o = mn(e, "pointerdown"), a = mn(e, "pointerup"), u = t.subscribe(((y) => y && this.emit("click", y))), l = r.subscribe(((y) => y && this.emit("over", y))), c = i.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), f = o.subscribe(((y) => y && this.toggleCursor(!0))), p = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      u(), l(), c(), d(), f(), p(), Vt(t), Vt(r), Vt(i), Vt(s), Vt(o), Vt(a);
    }));
    const m = Cr(e), v = Er((() => {
      const y = m.signal.value;
      y && (y.type === "start" ? this.toggleCursor(!0) : y.type === "move" && y.deltaX !== void 0 ? this.onMove(y.deltaX) : y.type === "end" && (this.toggleCursor(!1), this.drag && this.emit("update-end")));
    }), [m.signal]);
    this.subscriptions.push((() => {
      v(), m.cleanup();
    })), this.contentEditable && this.content && (this.contentClickListener = (y) => this.onContentClick(y), this.contentBlurListener = () => this.onContentBlur(), this.content.addEventListener("click", this.contentClickListener), this.content.addEventListener("blur", this.contentBlurListener));
  }
  _onUpdate(e, t, r) {
    var i;
    if (!(!((i = this.element) === null || i === void 0) && i.parentElement)) return;
    const { width: s } = this.element.parentElement.getBoundingClientRect(), o = e / s * this.totalDuration;
    let a = t && t !== "start" ? this.start : this.start + o, u = t && t !== "end" ? this.end : this.end + o;
    const l = r !== void 0;
    l && this.updatingSide && this.updatingSide !== t && (this.updatingSide === "start" ? a = r : u = r), a = Math.max(0, a), u = Math.min(this.totalDuration, u);
    const c = u - a;
    this.updatingSide = t;
    const d = c >= this.minLength && c <= this.maxLength;
    a <= u && (d || l) && (this.start = a, this.end = u, this.renderPosition(), this.emit("update", t));
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
        this.content = Vn("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Fs extends H0 {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Fs(e);
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
    return Vn("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const a = i.getBoundingClientRect(), u = e.element.getBoundingClientRect(), l = u.left - a.left, c = u.right - a.left;
    l < 0 ? i.scrollLeft += l : c > s && (i.scrollLeft += c - s);
  }
  virtualAppend(e, t, r) {
    const i = () => {
      if (!this.wavesurfer) return;
      const s = this.wavesurfer.getWidth(), o = this.wavesurfer.getScroll(), a = t.clientWidth, u = this.wavesurfer.getDuration(), l = Math.round(e.start / u * a), c = l + (Math.round((e.end - e.start) / u * a) || 1) > o && l < o + s;
      c && !r.parentElement ? t.appendChild(r) : !c && r.parentElement && r.remove();
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Ra(e, i, s);
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
    const u = Cr(i, { threshold: t }), l = Er((() => {
      var c, d;
      const f = u.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), m = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: v } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / v * p;
        const y = f.x / v * p, T = (f.x + 5) / v * p;
        s = new Ra(Object.assign(Object.assign({}, e), { start: y, end: T }), p, m), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
      } else f.type === "move" && f.deltaX !== void 0 ? s && s._onUpdate(f.deltaX, f.x > o ? "end" : "start", a) : f.type === "end" && s && (this.saveRegion(s), s.updatingSide = void 0, s = null);
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
const Ni = [0.5, 0.75, 1, 1.25, 1.5, 2];
function W0(n) {
  const { containerRef: e, audioSrc: t } = n, r = Me();
  if (!r.audio)
    throw new Error("useAudioPlayer requires the audio plugin (core.audio)");
  const i = r.audio, s = Pt(null), o = Pt(null), a = i.currentTime, u = i.isPlaying, l = M(0), c = M(!1), d = M(!1), f = M(null), p = M(1), m = M(1), v = M(!1), y = A(
    () => Wn(a.value)
  ), T = A(() => Wn(l.value)), S = /* @__PURE__ */ new Map(), E = [];
  function C(Y) {
    const J = o.value;
    if (!J) return;
    if (Y.startTime == null || Y.endTime == null) {
      B(Y.id);
      return;
    }
    const Ee = Y.speakerId ? r.speakers.all.get(Y.speakerId) : void 0;
    if (!Ee || !Y.speakerId) {
      B(Y.id);
      return;
    }
    const Ie = Ao(Ee.color, 0.25), Ge = S.get(Y.id);
    if (Ge) {
      Ge.region.setOptions({
        start: Y.startTime,
        end: Y.endTime,
        color: Ie
      }), Ge.region.element?.style.setProperty(
        "--region-color",
        Ee.color
      ), Ge.speakerId = Y.speakerId;
      return;
    }
    const Tt = J.addRegion({
      start: Y.startTime,
      end: Y.endTime,
      color: Ie,
      drag: !1,
      resize: !1
    });
    Tt.element?.style.setProperty("--region-color", Ee.color), S.set(Y.id, { region: Tt, speakerId: Y.speakerId });
  }
  function B(Y) {
    const J = S.get(Y);
    J && (J.region.remove(), S.delete(Y));
  }
  function x() {
    for (const { region: Y } of S.values()) Y.remove();
    S.clear();
  }
  function _() {
    x();
    const Y = r.activeChannel.value?.activeTranslation.value.turns.value ?? [];
    for (const J of Y) C(J);
  }
  function w({ turn: Y }) {
    C(Y);
  }
  function b({ turn: Y }) {
    const J = S.get(Y.id);
    if (J) {
      const Ee = J.region.start === Y.startTime && J.region.end === Y.endTime, Ie = J.speakerId === Y.speakerId;
      if (Ee && Ie) return;
    }
    C(Y);
  }
  function R({ turnId: Y }) {
    B(Y);
  }
  function D({ speaker: Y }) {
    const J = Ao(Y.color, 0.25);
    for (const [, Ee] of S)
      Ee.speakerId === Y.id && (Ee.region.setOptions({ color: J }), Ee.region.element?.style.setProperty("--region-color", Y.color));
  }
  function H({
    speakerId: Y
  }) {
    for (const [J, Ee] of [...S])
      Ee.speakerId === Y && B(J);
  }
  function L() {
    _();
  }
  function O() {
    _();
  }
  function P() {
    x();
  }
  function W() {
    E.push(r.onActiveTranslation("turn:add", w)), E.push(r.onActiveTranslation("turn:update", b)), E.push(r.onActiveTranslation("turn:remove", R)), E.push(r.on("speaker:update", D)), E.push(r.on("speaker:remove", H)), E.push(r.on("translation:sync", L)), E.push(r.on("translation:change", O)), E.push(r.on("channel:reset", P));
  }
  function X() {
    for (const Y of E) Y();
    E.length = 0;
  }
  function ie() {
    const Y = s.value;
    Y && (c.value = !0, d.value = !1, f.value = null, l.value = Y.getDuration(), _(), W());
  }
  function se(Y) {
    a.value = Y;
  }
  function be() {
    u.value = !0;
  }
  function Ke() {
    u.value = !1;
  }
  function $t() {
    u.value = !1;
  }
  function sn(Y) {
    d.value = !1, c.value = !1, f.value = Y?.message ?? "Failed to load audio";
  }
  function fe(Y, J) {
    tr(), d.value = !0, c.value = !1, f.value = null;
    const Ee = Fs.create();
    o.value = Ee;
    const Ie = i.waveform.value, Ge = Ie?.length ? [yf(Ie)] : void 0, Tt = r.activeChannel.value?.duration, Ce = Kn.create({
      peaks: Ge,
      duration: Ge && Tt ? Tt : void 0,
      container: Y,
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
      renderFunction: bf,
      url: J,
      plugins: [Ee]
    });
    Ce.setVolume(p.value), Ce.setPlaybackRate(m.value), Ce.setMuted(v.value), Ce.on("ready", ie), Ce.on("timeupdate", se), Ce.on("play", be), Ce.on("pause", Ke), Ce.on("finish", $t), Ce.on("error", sn), s.value = Ce;
  }
  function tr() {
    X(), x(), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  function ti() {
    s.value?.play();
  }
  function nr() {
    s.value?.pause();
  }
  function ni() {
    s.value?.playPause();
  }
  function Rn(Y) {
    const J = s.value;
    !J || l.value === 0 || J.setTime(Math.max(0, Math.min(Y, l.value)));
  }
  function ri(Y) {
    Rn(a.value + Y);
  }
  function rr(Y) {
    const J = s.value;
    J && (p.value = Y, J.setVolume(Y), Y > 0 && v.value && (v.value = !1, J.setMuted(!1)));
  }
  function ii() {
    const Y = s.value;
    Y && (v.value = !v.value, Y.setMuted(v.value));
  }
  function Pn(Y) {
    const J = s.value;
    J && (m.value = Y, J.setPlaybackRate(Y));
  }
  function pe() {
    const J = (Ni.indexOf(
      m.value
    ) + 1) % Ni.length;
    Pn(Ni[J] ?? 1);
  }
  return oe(
    [e, t],
    ([Y, J]) => {
      Y && J && fe(Y, J);
    },
    { immediate: !0 }
  ), i.setSeekHandler(Rn), i.setPauseHandler(nr), gt(() => {
    i.setSeekHandler(null), i.setPauseHandler(null), tr();
  }), {
    currentTime: a,
    duration: l,
    isPlaying: u,
    isReady: c,
    isLoading: d,
    loadError: f,
    volume: p,
    playbackRate: m,
    isMuted: v,
    formattedCurrentTime: y,
    formattedDuration: T,
    play: ti,
    pause: nr,
    togglePlay: ni,
    seekTo: Rn,
    skip: ri,
    setVolume: rr,
    setPlaybackRate: Pn,
    cyclePlaybackRate: pe,
    toggleMute: ii
  };
}
const U0 = { class: "audio-player" }, j0 = /* @__PURE__ */ j({
  __name: "AudioPlayer",
  props: {
    audioSrc: {}
  },
  setup(n, { expose: e }) {
    const t = n, r = M(null), {
      isPlaying: i,
      isReady: s,
      isLoading: o,
      volume: a,
      playbackRate: u,
      isMuted: l,
      formattedCurrentTime: c,
      formattedDuration: d,
      togglePlay: f,
      seekTo: p,
      pause: m,
      skip: v,
      setVolume: y,
      cyclePlaybackRate: T,
      toggleMute: S
    } = W0({
      containerRef: r,
      audioSrc: Ha(() => t.audioSrc)
    });
    return e({ seekTo: p, pause: m }), (E, C) => (k(), $("footer", U0, [
      N("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Te(["waveform-container", { "waveform-container--loading": h(o) }])
      }, null, 2),
      q(O0, {
        "is-playing": h(i),
        "current-time": h(c),
        duration: h(d),
        volume: h(a),
        "playback-rate": h(u),
        "is-muted": h(l),
        "is-ready": h(s),
        onTogglePlay: h(f),
        onSkipBack: C[0] || (C[0] = (B) => h(v)(-10)),
        onSkipForward: C[1] || (C[1] = (B) => h(v)(10)),
        "onUpdate:volume": h(y),
        onToggleMute: h(S),
        onCyclePlaybackRate: h(T)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), K0 = /* @__PURE__ */ ae(j0, [["__scopeId", "data-v-59f8e5c5"]]), G0 = 0.05;
function B1(n = {}) {
  return {
    name: "audio",
    components: { player: K0 },
    install(e) {
      const t = M(0), r = M(!1), i = M(null), s = M(null);
      let o = null, a = null;
      const u = A(
        () => e.activeChannel.value?.activeTranslation.value.audio ?? null
      ), l = M(null), c = M(null);
      let d = null;
      function f() {
        d && (URL.revokeObjectURL(d), d = null);
      }
      const p = oe(
        u,
        async (x) => {
          if (f(), l.value = null, c.value = null, !x) return;
          const _ = n.resolveWaveform ? Promise.resolve(n.resolveWaveform(x)).catch((w) => (console.warn("[audio] resolveWaveform failed", w), null)) : Promise.resolve(null);
          try {
            const [w, b] = await Promise.all([
              n.resolveSrc ? n.resolveSrc(x) : Promise.resolve(x.src),
              _
            ]);
            c.value = b?.length ? b : null, l.value = w, w.startsWith("blob:") && (d = w);
          } catch (w) {
            console.error("[audio] resolveSrc failed", w);
          }
        },
        { immediate: !0 }
      ), m = A(() => l.value);
      let v = Number.NEGATIVE_INFINITY;
      const y = tt(() => {
        const x = t.value;
        if (r.value) {
          const b = x - v;
          if (b >= 0 && b < G0) return;
        }
        v = x;
        const w = e.activeChannel.value?.activeTranslation.value;
        if (w)
          for (const b of w.turns.value) {
            const R = b.words, D = wf(R) ?? b.startTime, H = Sf(R) ?? b.endTime;
            if (D != null && H != null && x >= D && x <= H) {
              s.value = b.id, i.value = dl(R, x);
              return;
            }
          }
      });
      function T(x) {
        o?.(x);
      }
      function S(x) {
        o = x;
      }
      function E() {
        a?.();
      }
      function C(x) {
        a = x;
      }
      const B = {
        currentTime: t,
        isPlaying: r,
        src: m,
        waveform: c,
        activeWordId: i,
        activeTurnId: s,
        seekTo: T,
        setSeekHandler: S,
        pause: E,
        setPauseHandler: C
      };
      return e.audio = B, () => {
        p(), y(), f(), e.audio = void 0;
      };
    }
  };
}
class X0 {
  intervalMs;
  timer;
  constructor(e) {
    this.intervalMs = e;
  }
  start(e) {
    this.stop(), this.timer = setInterval(e, this.intervalMs);
  }
  stop() {
    this.timer !== void 0 && (clearInterval(this.timer), this.timer = void 0);
  }
}
function Xt(n, e) {
  return `${n}/${e}`;
}
function nn(n) {
  const e = n.activeChannel.value;
  if (e)
    return e.translations.get(e.activeTranslation.value.id);
}
function Y0(n, e) {
  const t = n.core.activeChannel.value;
  if (t)
    return n.locks.get(
      Xt(t.activeTranslation.value.id, e)
    );
}
function Z0(n, e) {
  n.locks.clear();
  for (const t of e) qs(n, t);
}
function qs(n, e) {
  n.locks.set(Xt(e.translationId, e.turnId), {
    userId: e.userId,
    userName: e.userName
  });
}
function Q0(n, e) {
  n.locks.delete(Xt(e.translationId, e.turnId));
}
function Vs(n) {
  const e = n.editingRef;
  return n.editingTurnId.value = null, n.editingRef = null, n.heartbeat.stop(), e && n.locks.delete(Xt(e.translationId, e.turnId)), e;
}
async function mt(n, e) {
  try {
    await n.unlockTurn?.(e);
  } catch (t) {
    console.error("[transcriptionEditor] unlock failed:", t);
  }
}
function Su(n) {
  const e = Vs(n);
  e && mt(n.options, e);
}
async function J0(n, e) {
  try {
    const t = await n.options.lockTurn(e);
    t?.ok || ek(n, e, t?.reason);
  } catch (t) {
    console.error("[transcriptionEditor] heartbeat failed:", t);
  }
}
function ek(n, e, t) {
  !n.editingRef || n.editingRef.turnId !== e.turnId || (console.error(
    `[transcriptionEditor] lock lost on turn ${e.turnId}: ${t ?? "unknown"}`
  ), n.editingTurnId.value = null, n.editingRef = null, n.heartbeat.stop());
}
async function tk(n, e, t = 0) {
  if (n.core.capabilities.value.text !== "edit" || n.lockPending || n.editingTurnId.value === e) return;
  const r = nn(n.core);
  if (!r?.hasTurn(e) || n.locks.has(Xt(r.id, e))) return;
  n.editingTurnId.value !== null && Su(n);
  const i = { translationId: r.id, turnId: e };
  if (n.options.lockTurn) {
    n.lockPending = !0;
    try {
      const s = await n.options.lockTurn(i);
      if (!s?.ok) {
        s?.holder && qs(n, { ...i, ...s.holder });
        return;
      }
    } catch (s) {
      console.error("[transcriptionEditor] lock request failed:", s);
      return;
    } finally {
      n.lockPending = !1;
    }
  }
  n.editingRef = i, n.editingTurnId.value = e, n.editingCaretOffset.value = t, n.options.lockTurn && n.heartbeat.start(() => {
    J0(n, i);
  });
}
function Tu(n, e, t) {
  const r = Dy(Oy(n, e), t);
  return { text: r.length > 0 ? null : e, words: r };
}
async function Jr(n, e) {
  try {
    const t = await e;
    t && !t.ok && console.error(
      `[transcriptionEditor] ${n} rejected: ${t.reason ?? "unknown"}`
    );
  } catch (t) {
    console.error(`[transcriptionEditor] ${n} failed:`, t);
  }
}
async function nk(n, e) {
  await Jr("delete_turn", n.deleteTurn?.(e)), await mt(n, e);
}
async function _u(n, e) {
  try {
    const t = await n.saveTurn?.(e);
    t && !t.ok && console.error(
      `[transcriptionEditor] save rejected for turn ${e.turnId}: ${t.reason ?? "unknown"}`
    );
  } catch (t) {
    console.error(
      `[transcriptionEditor] save failed for turn ${e.turnId}:`,
      t
    );
  }
  await mt(n, {
    translationId: e.translationId,
    turnId: e.turnId
  });
}
function xu(n, e) {
  const t = n.editingTurnId.value;
  if (t === null) return;
  const r = Vs(n), i = nn(n.core), s = i?.getTurn(t);
  if (!i || !s) {
    r && mt(n.options, r);
    return;
  }
  const o = e.replace(/\s+/g, " ").trim();
  if (o === "") {
    if (i.turns.value.length <= 1) {
      r && mt(n.options, r);
      return;
    }
    if (!n.options.deleteTurn) {
      i.removeTurn(t);
      return;
    }
    nk(n.options, {
      translationId: i.id,
      turnId: t
    });
    return;
  }
  if (o === Bs(s)) {
    r && mt(n.options, r);
    return;
  }
  i.updateTurn(
    t,
    Tu(t, o, s.words)
  ), _u(n.options, {
    translationId: i.id,
    turnId: t,
    text: o
  });
}
function rk(n, e) {
  const r = n.slice(0, Math.max(0, e)).replace(/\s+/g, " ").replace(/^\s/, ""), i = n.replace(/\s+/g, " ").trim().length;
  return Math.min(r.length, i);
}
async function ik(n, e) {
  const t = { translationId: e.translationId, turnId: e.turnId };
  try {
    if (e.textChanged) {
      const s = await n.saveTurn?.({
        translationId: e.translationId,
        turnId: e.turnId,
        text: e.text
      });
      if (s && !s.ok) {
        console.error(
          `[transcriptionEditor] save rejected before split (turn ${e.turnId}): ${s.reason ?? "unknown"} — split aborted`
        ), await mt(n, t);
        return;
      }
    }
    const r = {
      translationId: e.translationId,
      turnId: e.turnId,
      offset: e.offset
    }, i = await n.splitTurn?.(r);
    i && !i.ok && console.error(
      `[transcriptionEditor] split rejected for turn ${e.turnId}: ${i.reason ?? "unknown"}`
    );
  } catch (r) {
    console.error(
      `[transcriptionEditor] split sequence failed for turn ${e.turnId}:`,
      r
    );
  }
  await mt(n, t);
}
function sk(n, e, t) {
  if (e.replace(/\s+/g, " ").trim() === "") {
    xu(n, e);
    return;
  }
  const r = n.editingTurnId.value;
  if (r === null) return;
  const i = Vs(n), s = nn(n.core), o = s?.getTurn(r);
  if (!s || !o) {
    i && mt(n.options, i);
    return;
  }
  const a = e.replace(/\s+/g, " ").trim(), u = a !== Bs(o);
  u && s.updateTurn(
    r,
    Tu(r, a, o.words)
  );
  const l = rk(e, t);
  if (l <= 0 || l >= a.length) {
    u ? _u(n.options, {
      translationId: s.id,
      turnId: r,
      text: a
    }) : i && mt(n.options, i);
    return;
  }
  ik(n.options, {
    translationId: s.id,
    turnId: r,
    text: a,
    offset: l,
    textChanged: u
  });
}
function rn(n, e, t) {
  const r = n.versions.get(e);
  return t == null || r == null ? !0 : t <= r ? !1 : t === r + 1 ? (n.versions.set(e, t), !0) : (Eu(n, e), !1);
}
function Eu(n, e) {
  n.options.refetchTranslation && (n.pendingRefetches.has(e) || (n.pendingRefetches.add(e), n.options.refetchTranslation(e).catch((t) => {
    console.error(
      `[transcriptionEditor] refetch failed for track ${e}:`,
      t
    );
  }).finally(() => {
    n.pendingRefetches.delete(e);
  })));
}
function In(n, e) {
  for (const t of n.channels.values()) {
    const r = t.translations.get(e);
    if (r) return r;
  }
}
function ok(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.turnId && n.editingRef.translationId === e.translationId)
    return;
  const t = In(n.core, e.translationId);
  if (!t || !t.hasTurn(e.turnId)) return;
  const r = zs(e.turnId, e.words);
  t.updateTurn(e.turnId, {
    // Turn contract: text carries the content only when words is empty.
    text: r.length > 0 ? null : e.text,
    words: r,
    ...e.stime !== void 0 && { startTime: e.stime },
    ...e.etime !== void 0 && { endTime: e.etime }
  });
}
function Cu(n) {
  const e = zs(n.turnId, n.words);
  return {
    id: n.turnId,
    speakerId: n.speakerId ?? null,
    // Turn contract: text carries the content only when words is empty.
    text: e.length > 0 ? null : n.text,
    words: e,
    ...n.stime !== void 0 && { startTime: n.stime },
    ...n.etime !== void 0 && { endTime: n.etime },
    language: n.language ?? ""
  };
}
function ak(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.originalTurnId && n.editingRef.translationId === e.translationId)
    return;
  const t = In(n.core, e.translationId);
  if (!t || !t.hasTurn(e.originalTurnId)) return;
  const r = e.turns.map(Cu);
  t.setTurns(
    t.turns.value.flatMap(
      (i) => i.id === e.originalTurnId ? r : [i]
    )
  );
  for (const i of r)
    i.id === e.originalTurnId ? n.core.emit("turn:update", {
      turn: i,
      translationId: e.translationId
    }) : n.core.emit("turn:add", {
      turn: i,
      translationId: e.translationId
    });
}
async function lk(n, e) {
  try {
    const t = await n.mergeTurns?.(e);
    t && !t.ok && console.error(
      `[transcriptionEditor] merge rejected (${e.firstTurnId}+${e.secondTurnId}): ${t.reason ?? "unknown"}`
    );
  } catch (t) {
    console.error(
      `[transcriptionEditor] merge failed (${e.firstTurnId}+${e.secondTurnId}):`,
      t
    );
  }
}
function uk(n, e, t) {
  if (n.core.capabilities.value.text !== "edit") return;
  const r = nn(n.core);
  r && (!r.hasTurn(e) || !r.hasTurn(t) || n.locks.has(Xt(r.id, e)) || n.locks.has(Xt(r.id, t)) || lk(n.options, {
    translationId: r.id,
    firstTurnId: e,
    secondTurnId: t
  }));
}
function ck(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.translationId === e.translationId && (n.editingRef.turnId === e.mergedTurnId || n.editingRef.turnId === e.removedTurnId))
    return;
  const t = In(n.core, e.translationId);
  if (!t || !t.hasTurn(e.mergedTurnId)) return;
  const r = Cu(e.turn);
  t.setTurns(
    t.turns.value.flatMap((i) => i.id === e.mergedTurnId ? [r] : i.id === e.removedTurnId ? [] : [i])
  ), n.core.emit("turn:update", {
    turn: r,
    translationId: e.translationId
  }), n.core.emit("turn:remove", {
    turnId: e.removedTurnId,
    translationId: e.translationId
  });
}
function Hs(n, e) {
  for (const t of n.channels.values())
    for (const r of t.translations.values())
      for (const i of r.turns.value)
        if (i.speakerId === e) return;
  n.speakers.delete(e);
}
function dk(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.turnId && n.editingRef.translationId === e.translationId)
    return;
  const t = In(n.core, e.translationId);
  !t || !t.hasTurn(e.turnId) || (t.removeTurn(e.turnId), e.removedSpeakerId && Hs(n.core, e.removedSpeakerId));
}
function fk(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit") return;
  const r = nn(n.core);
  if (!r?.hasTurn(e)) return;
  const i = t.speakerName?.trim() ?? "", s = !!t.speakerId;
  if (s !== !!i && !(s && r.getTurn(e)?.speakerId === t.speakerId)) {
    if (!n.options.updateTurnSpeaker) {
      s ? Ns(n.core, e, t.speakerId) : au(n.core, e, i);
      return;
    }
    Jr(
      "update_turn_speaker",
      n.options.updateTurnSpeaker({
        translationId: r.id,
        turnId: e,
        ...s ? { speakerId: t.speakerId } : { speakerName: i }
      })
    );
  }
}
function pk(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit") return;
  const r = t.trim(), i = n.core.speakers.all.get(e);
  if (!i || !r || r === i.name) return;
  const s = nn(n.core);
  if (!n.options.renameSpeaker || !s) {
    ou(n.core, e, r);
    return;
  }
  Jr(
    "rename_speaker",
    n.options.renameSpeaker({
      translationId: s.id,
      speakerId: e,
      name: r
    })
  );
}
function hk(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit" || e === t) return;
  const { all: r } = n.core.speakers;
  if (!r.has(e) || !r.has(t)) return;
  const i = nn(n.core);
  if (!n.options.replaceSpeaker || !i) {
    lu(n.core, e, t);
    return;
  }
  Jr(
    "replace_speaker",
    n.options.replaceSpeaker({
      translationId: i.id,
      fromSpeakerId: e,
      toSpeakerId: t
    })
  );
}
function mk(n, e) {
  if (!rn(n, e.translationId, e.version)) return;
  const { speakers: t } = n.core;
  t.ensure(e.speaker.id, e.speaker.name), t.update(e.speaker.id, { name: e.speaker.name });
  const r = In(n.core, e.translationId);
  r?.hasTurn(e.turnId) && r.updateTurn(e.turnId, { speakerId: e.speaker.id }), e.removedSpeakerId && Hs(n.core, e.removedSpeakerId);
}
function vk(n, e) {
  rn(n, e.translationId, e.version) && n.core.speakers.update(e.speakerId, { name: e.name });
}
function gk(n, e) {
  if (!rn(n, e.translationId, e.version)) return;
  n.core.speakers.ensure(e.toSpeakerId);
  const t = In(n.core, e.translationId);
  if (t)
    for (const r of t.turns.value)
      r.speakerId === e.fromSpeakerId && t.updateTurn(r.id, { speakerId: e.toSpeakerId });
  Hs(n.core, e.fromSpeakerId);
}
function yk(n, e, t) {
  n.versions.set(e, t);
}
function bk(n, e) {
  for (const [t, r] of Object.entries(e)) {
    const i = n.versions.get(t);
    i != null && r > i && Eu(n, t);
  }
}
const kk = 15e3;
class wk {
  core;
  options;
  editingTurnId = M(null);
  editingCaretOffset = M(0);
  locks = wn(/* @__PURE__ */ new Map());
  editingRef = null;
  lockPending = !1;
  heartbeat = new X0(kk);
  versions = /* @__PURE__ */ new Map();
  pendingRefetches = /* @__PURE__ */ new Set();
  constructor(e, t) {
    this.core = e, this.options = t;
  }
  beginEdit(e, t) {
    return tk(this, e, t);
  }
  cancelEdit() {
    Su(this);
  }
  saveTurn(e) {
    xu(this, e);
  }
  splitTurn(e, t) {
    sk(this, e, t);
  }
  applyTurnUpdate(e) {
    ok(this, e);
  }
  applyTurnSplit(e) {
    ak(this, e);
  }
  mergeTurns(e, t) {
    uk(this, e, t);
  }
  applyTurnsMerged(e) {
    ck(this, e);
  }
  applyTurnDeleted(e) {
    dk(this, e);
  }
  setTranslationVersion(e, t) {
    yk(this, e, t);
  }
  reconcileVersions(e) {
    bk(this, e);
  }
  updateTurnSpeaker(e, t) {
    fk(this, e, t);
  }
  renameSpeaker(e, t) {
    pk(this, e, t);
  }
  replaceSpeaker(e, t) {
    hk(this, e, t);
  }
  applyTurnSpeakerUpdated(e) {
    mk(this, e);
  }
  applySpeakerRenamed(e) {
    vk(this, e);
  }
  applySpeakerReplaced(e) {
    gk(this, e);
  }
  getTurnLock(e) {
    return Y0(this, e);
  }
  setLocks(e) {
    Z0(this, e);
  }
  setTurnLock(e) {
    qs(this, e);
  }
  clearTurnLock(e) {
    Q0(this, e);
  }
  /** Back to idle: document reload — the edit in progress and the known
   *  locks belong to the previous document (the join re-ack reseeds them). */
  reset() {
    this.editingTurnId.value = null, this.editingRef = null, this.heartbeat.stop(), this.locks.clear(), this.versions.clear(), this.pendingRefetches.clear();
  }
  destroy() {
    this.heartbeat.stop();
  }
}
function z1(n = {}) {
  return {
    name: "transcriptionEditor",
    install(e) {
      const t = new wk(e, n);
      e.transcriptionEditor = t;
      const r = e.on("document:change", () => t.reset());
      return () => {
        r(), t.destroy();
      };
    }
  };
}
const Ws = typeof window < "u" && "speechSynthesis" in window;
function ei() {
  return Ws;
}
function Sk() {
  return Ws && window.speechSynthesis.getVoices().length > 0;
}
function Tk(n) {
  if (!Ws || !n || n === "*") return null;
  const e = n.toLowerCase(), t = e.split("-")[0], r = window.speechSynthesis.getVoices(), i = r.find((s) => s.lang.toLowerCase() === e);
  return i || (r.find((s) => s.lang.toLowerCase().split("-")[0] === t) ?? null);
}
function Pa(n, e) {
  if (!ei()) return;
  const t = n.trim();
  if (!t) return;
  const r = new SpeechSynthesisUtterance(t), i = e ? Tk(e) : null;
  i && (r.voice = i, r.lang = i.lang), window.speechSynthesis.speak(r);
}
function _k() {
  ei() && window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
}
function Ma() {
  ei() && window.speechSynthesis.cancel();
}
function Oa(n) {
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
    language: n.language,
    sourceLanguage: n.language
  };
}
function Bi(n, e) {
  return {
    id: n.turnId,
    speakerId: n.speakerId,
    text: e.text,
    words: [],
    startTime: n.startTime,
    endTime: n.endTime,
    startDate: n.startDate,
    endDate: n.endDate,
    language: e.language,
    sourceLanguage: e.sourceLanguage
  };
}
function F1(n = {}) {
  const e = n.tts ?? !1;
  return {
    name: "live",
    install(t) {
      const r = Pt(null), i = M(!1), s = M(!1), o = ei(), a = M(!1);
      function u() {
        a.value = Sk();
      }
      o && (u(), window.speechSynthesis.addEventListener("voiceschanged", u));
      let l = null;
      i.value = !0;
      function c() {
        r.value = null, l = null;
      }
      function d(L, O) {
        return L.isSource ? !1 : L.languages.some((P) => Rr(P, O));
      }
      function f(L, O) {
        if (t.activeChannelId.value !== O) return;
        const P = t.activeChannel.value;
        if (!P) return;
        l = L, P.activeTranslation.value.isSource && L.text != null && (r.value = L.text);
      }
      let p = null;
      function m() {
        p === null && (p = setTimeout(() => {
          p = null, c();
        }, 150));
      }
      function v() {
        p !== null && (clearTimeout(p), p = null);
      }
      function y(L, O) {
        L.hasTurn(O.id) ? L.updateTurn(O.id, O) : L.addTurn(O);
      }
      function T(L, O) {
        L.speakerId && t.speakers.ensure(L.speakerId);
        const P = t.channels.get(O);
        if (!P) {
          C();
          return;
        }
        if (L.text != null && y(
          P.sourceTranslation,
          Oa(L)
        ), L.translations)
          for (const X of L.translations) {
            const ie = P.translations.get(X.translationId);
            ie && y(
              ie,
              Bi(L, {
                ...X,
                sourceLanguage: L.language
              })
            );
          }
        const W = t.activeChannel.value?.activeTranslation.value;
        W?.isSource && C(), s.value && W?.isSource && L.text != null && t.activeChannelId.value === O && Pa(L.text, L.language);
      }
      function S(L, O) {
        E([L], O);
      }
      function E(L, O) {
        const P = t.channels.get(O);
        if (!P) return;
        const W = /* @__PURE__ */ new Set();
        for (const se of L)
          se.speakerId && !W.has(se.speakerId) && (W.add(se.speakerId), t.speakers.ensure(se.speakerId));
        const X = [];
        for (const se of L)
          se.text != null && X.push(Oa(se));
        X.length > 0 && P.sourceTranslation.prependTurns(X);
        const ie = /* @__PURE__ */ new Map();
        for (const se of L)
          if (se.translations)
            for (const be of se.translations) {
              let Ke = ie.get(be.translationId);
              Ke || (Ke = [], ie.set(be.translationId, Ke)), Ke.push(
                Bi(se, {
                  ...be,
                  sourceLanguage: se.language
                })
              );
            }
        for (const [se, be] of ie) {
          const Ke = P.translations.get(se);
          Ke && Ke.prependTurns(be);
        }
      }
      function C() {
        v(), c();
      }
      function B(L) {
        const O = t.activeChannel.value;
        if (!O) return;
        const P = O.activeTranslation.value;
        if (!L.final) {
          P.id === jt ? L.turnId === l?.turnId && !Rr(
            L.language,
            l?.language
          ) && (r.value = L.text) : d(P, L.language) && (r.value = L.text);
          return;
        }
        const W = O.translations.get(L.language);
        if (W) {
          const X = Bi(
            { ...L },
            L
          );
          W === P || P.id === jt ? y(W, X) : W.updateOrCreateTurnSilent(X);
        }
        (d(P, L.language) || P.id === jt) && (C(), s.value && L.text && Pa(L.text, L.language));
      }
      function x() {
        s.value = !0, _k();
      }
      function _() {
        s.value = !1, Ma();
      }
      const w = {
        partial: r,
        hasLiveUpdate: i,
        ttsAvailable: e,
        ttsEnabled: s,
        ttsReady: a,
        enableTTS: x,
        disableTTS: _,
        onPartial: f,
        onFinal: T,
        prependFinal: S,
        prependFinalBatch: E,
        onTranslation: B
      }, b = t.on(
        "channel:change",
        C
      ), R = t.on(
        "translation:change",
        C
      ), D = t.on(
        "translation:sync",
        m
      ), H = t.on("channel:sync", m);
      return t.live = w, () => {
        C(), Ma(), o && window.speechSynthesis.removeEventListener(
          "voiceschanged",
          u
        ), b(), R(), D(), H(), t.live = void 0;
      };
    }
  };
}
class xk {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), a = this.removeEmpty(this.tokenize(s, r)), u = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, u, r, i);
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
    }, a = t.length, u = e.length;
    let l = 1, c = a + u;
    r.maxEditLength != null && (c = Math.min(c, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let m = this.extractCommon(p[0], t, e, 0, r);
    if (p[0].oldPos + 1 >= u && m + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, t, e));
    let v = -1 / 0, y = 1 / 0;
    const T = () => {
      for (let S = Math.max(v, -l); S <= Math.min(y, l); S += 2) {
        let E;
        const C = p[S - 1], B = p[S + 1];
        C && (p[S - 1] = void 0);
        let x = !1;
        if (B) {
          const w = B.oldPos - S;
          x = B && 0 <= w && w < a;
        }
        const _ = C && C.oldPos + 1 < u;
        if (!x && !_) {
          p[S] = void 0;
          continue;
        }
        if (!_ || x && C.oldPos < B.oldPos ? E = this.addToPath(B, !0, !1, 0, r) : E = this.addToPath(C, !1, !0, 1, r), m = this.extractCommon(E, t, e, S, r), E.oldPos + 1 >= u && m + 1 >= a)
          return o(this.buildValues(E.lastComponent, t, e)) || !0;
        p[S] = E, E.oldPos + 1 >= u && (y = Math.min(y, S - 1)), m + 1 >= a && (v = Math.max(v, S + 1));
      }
      l++;
    };
    if (i)
      (function S() {
        setTimeout(function() {
          if (l > c || Date.now() > f)
            return i(void 0);
          T() || S();
        }, 0);
      })();
    else
      for (; l <= c && Date.now() <= f; ) {
        const S = T();
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
    let u = e.oldPos, l = u - i, c = 0;
    for (; l + 1 < o && u + 1 < a && this.equals(r[u + 1], t[l + 1], s); )
      l++, u++, c++, s.oneChangePerToken && (e.lastComponent = { count: 1, previousComponent: e.lastComponent, added: !1, removed: !1 });
    return c && !s.oneChangePerToken && (e.lastComponent = { count: c, previousComponent: e.lastComponent, added: !1, removed: !1 }), e.oldPos = u, l;
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
    let a = 0, u = 0, l = 0;
    for (; a < o; a++) {
      const c = i[a];
      if (c.removed)
        c.value = this.join(r.slice(l, l + c.count)), l += c.count;
      else {
        if (!c.added && this.useLongestToken) {
          let d = t.slice(u, u + c.count);
          d = d.map(function(f, p) {
            const m = r[l + p];
            return m.length > f.length ? m : f;
          }), c.value = this.join(d);
        } else
          c.value = this.join(t.slice(u, u + c.count));
        u += c.count, c.added || (l += c.count);
      }
    }
    return i;
  }
}
class Ek extends xk {
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
const Ck = new Ek();
function Ak(n, e, t) {
  return Ck.diff(n, e, t);
}
function zi({ previousText: n, previousIndexes: e }, t, r, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), o = t.split(" "), a = Ak(s, o, {
    comparator: Rk
  }), u = Ik(a), l = [...e];
  let c = [...e], d = 0;
  for (const v of u) {
    do
      if (d < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in v && v.replaced)
      c = Ar(
        c,
        l[0],
        v.countAdded - v.countRemoved
      ), d += v.countRemoved;
    else if ("removed" in v && v.removed) {
      const y = v;
      d += y.count, c = Ar(
        c,
        l[0],
        -y.count
      );
    } else if ("added" in v && v.added) {
      const y = v;
      c = Ar(
        c,
        l[0],
        y.count
      );
    } else
      d += v.count;
  }
  const f = (v, y) => o.slice(v, y).join(" ");
  if (i && c.length > 0) {
    const v = c.length - 1, y = v > 0 ? c[v - 1] : 0, T = f(y, c[v]);
    if (i(T)) {
      const [S] = ls(
        T,
        r
      );
      S !== void 0 && (c[v] = y + S);
    }
  }
  const p = c.length > 0 ? c[c.length - 1] : 0, m = f(p);
  if (r(m)) {
    const v = ls(m, r);
    c = c.concat(v.map((y) => y + p));
  }
  return {
    previousIndexes: c,
    previousText: t
  };
}
function Ik(n) {
  const e = [];
  for (let t = 0; t < n.length; t++) {
    const r = n[t], i = n[t + 1];
    r.removed && i?.added ? (e.push({
      replaced: !0,
      removed: !0,
      added: !0,
      countRemoved: r.count,
      countAdded: i.count
    }), t++) : e.push(r);
  }
  return e;
}
function Ar(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function ls(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    Ar(
      ls(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function Rk(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class Pk {
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
class Mk extends Pk {
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
    this.resetAll(), this.currentState = zi(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this),
      this.computeIfTextOverflows.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = zi(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this),
      this.computeIfTextOverflows.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = zi(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this),
      this.computeIfTextOverflows.bind(this)
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
  textWidth(e) {
    const t = this.canvas.getContext("2d");
    return t.font = `${this.fontSize}px ${this.font}`, t.measureText(e).width;
  }
  // Normal cut threshold: keeps both inline margins free.
  computeIfTextIsTooLong(e) {
    return this.textWidth(e) > this.canvas.width - 2 * this.paddingInline;
  }
  // Overflow threshold: the text is drawn at x = paddingInline, so it reaches the
  // canvas edge once its width exceeds canvas.width - paddingInline. Spilling into
  // the inline margin is tolerated; going past this re-cuts an already-shown line.
  computeIfTextOverflows(e) {
    return this.textWidth(e) > this.canvas.width - this.paddingInline;
  }
}
function Au(n) {
  const e = Me();
  let t = null;
  _e(() => {
    n.canvasRef.value && (t = new Mk(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), oe([n.fontSize, n.lineHeight], ([u, l]) => {
    t && t.setFontSize(u, l);
  }), oe(
    () => e.live?.partial.value,
    (u) => {
      u && t && t.newPartial(u);
    }
  );
  const r = e.onActiveTranslation("turn:add", ({ turn: u }) => {
    if (!t) return;
    const l = u.words.length > 0 ? u.words.map((c) => c.text).join(" ") : u.text ?? "";
    l && t.newFinal(l);
  });
  function i() {
    t && (t.resetDrawing(), t.resetAll());
  }
  const s = e.on("translation:change", i), o = e.on("translation:sync", i), a = e.on("channel:sync", i);
  Qt(() => {
    r(), s(), o(), a(), t?.dispose(), t = null;
  });
}
function Iu(n) {
  const e = M(!1);
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
  return n && oe(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), _e(a), gt(i), { visible: e };
}
const Da = /\$(\w+)/g;
function Ok(n, e) {
  const t = [];
  let r = 0, i;
  for (Da.lastIndex = 0; (i = Da.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const Dk = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, Lk = ["src", "alt"], $k = { key: 1 }, Nk = /* @__PURE__ */ j({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = Me().subtitle?.watermark, r = A(() => t ? Ok(t.content.value, t.tokens.value) : []);
    return (i, s) => (k(), V(Wr, { name: "watermark" }, {
      default: z(() => [
        n.visible && h(t) ? (k(), $("div", Dk, [
          (k(!0), $(ye, null, ze(r.value, (o, a) => (k(), $(ye, { key: a }, [
            o.type === "token" ? (k(), $("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, Lk)) : (k(), $("span", $k, K(o.value), 1))
          ], 64))), 128))
        ])) : G("", !0)
      ]),
      _: 1
    }));
  }
}), Ru = /* @__PURE__ */ ae(Nk, [["__scopeId", "data-v-b8c2ff2b"]]), Bk = ["height"], zk = /* @__PURE__ */ j({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Me(), t = nt("canvas"), r = A(() => e.subtitle?.fontSize.value ?? 40), i = A(() => 1.2 * r.value), s = A(() => 2.4 * r.value);
    Au({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = Iu(
      e.subtitle?.watermark
    );
    return _e(() => {
      e.emit("subtitle:visible", { visible: !0, height: s.value });
    }), oe(s, (a) => {
      e.emit("subtitle:visible", { visible: !0, height: a });
    }), gt(() => {
      e.emit("subtitle:visible", { visible: !1, height: 0 });
    }), (a, u) => (k(), $("div", {
      class: "subtitle-banner",
      style: Yt({ height: s.value + "px" })
    }, [
      N("canvas", {
        ref: "canvas",
        class: Te(["subtitle-canvas", { "subtitle-canvas--shrunk": h(o) }]),
        height: s.value
      }, null, 10, Bk),
      q(Ru, { visible: h(o) }, null, 8, ["visible"])
    ], 4));
  }
}), Fk = /* @__PURE__ */ ae(zk, [["__scopeId", "data-v-d1406d58"]]), qk = {
  ref: "container",
  class: "subtitle-fullscreen"
}, Vk = ["aria-label"], Hk = /* @__PURE__ */ j({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Me(), { t } = de(), r = nt("container"), i = nt("canvas"), s = A(() => e.subtitle?.fontSize.value ?? 48), o = A(() => 1.2 * s.value);
    Au({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = Iu(
      e.subtitle?.watermark
    );
    _e(async () => {
      const c = r.value;
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
    _e(() => {
      document.addEventListener("fullscreenchange", u);
    });
    function l() {
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      }), e.subtitle?.exitFullscreen();
    }
    return Qt(() => {
      document.removeEventListener("fullscreenchange", u);
      try {
        screen.orientation.unlock();
      } catch {
      }
      document.fullscreenElement && document.exitFullscreen().catch(() => {
      });
    }), (c, d) => (k(), $("div", qk, [
      N("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": h(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        q(h(ks), { size: 24 })
      ], 8, Vk),
      N("canvas", {
        ref: "canvas",
        class: Te(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": h(a) }])
      }, null, 2),
      q(Ru, { visible: h(a) }, null, 8, ["visible"])
    ], 512));
  }
}), Wk = /* @__PURE__ */ ae(Hk, [["__scopeId", "data-v-cd7dc651"]]);
function q1(n = {}) {
  return {
    name: "subtitle",
    components: { subtitleBanner: Fk, subtitleFullscreen: Wk },
    install(e) {
      const t = M(n.fontSize ?? 40), r = M(n.isVisible ?? !1), i = M(!1);
      let s;
      const o = [];
      if (n.watermark) {
        const u = n.watermark;
        s = {
          display: M(u.display ?? !1),
          pinned: M(u.pinned ?? !1),
          content: M(u.content ?? ""),
          frequency: M(u.frequency ?? 30),
          duration: M(u.duration ?? 5),
          tokens: M(u.tokens ?? {}),
          readonly: u.readonly ?? !1
        }, o.push(
          oe(
            s.display,
            (l) => e.emit("watermark:display", { display: l })
          ),
          oe(
            s.pinned,
            (l) => e.emit("watermark:pin", { pinned: l })
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
        r.value = !1, i.value = !1, o.forEach((u) => u()), e.subtitle = void 0;
      };
    }
  };
}
function Uk(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e];
    for (var r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
  }
  return n;
}
function us(n, e) {
  return Array(e + 1).join(n);
}
function Pu(n) {
  return n.replace(/^\n*/, "");
}
function Mu(n) {
  for (var e = n.length; e > 0 && n[e - 1] === `
`; ) e--;
  return n.substring(0, e);
}
function Ou(n) {
  return Mu(Pu(n));
}
var jk = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];
function Us(n) {
  return js(n, jk);
}
var Du = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];
function Lu(n) {
  return js(n, Du);
}
function Kk(n) {
  return Nu(n, Du);
}
var $u = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];
function Gk(n) {
  return js(n, $u);
}
function Xk(n) {
  return Nu(n, $u);
}
function js(n, e) {
  return e.indexOf(n.nodeName) >= 0;
}
function Nu(n, e) {
  return n.getElementsByTagName && e.some(function(t) {
    return n.getElementsByTagName(t).length;
  });
}
var Yk = [[/\\/g, "\\\\"], [/\*/g, "\\*"], [/^-/g, "\\-"], [/^\+ /g, "\\+ "], [/^(=+)/g, "\\$1"], [/^(#{1,6}) /g, "\\$1 "], [/`/g, "\\`"], [/^~~~/g, "\\~~~"], [/\[/g, "\\["], [/\]/g, "\\]"], [/^>/g, "\\>"], [/_/g, "\\_"], [/^(\d+)\. /g, "$1\\. "]];
function Bu(n) {
  return Yk.reduce(function(e, t) {
    return e.replace(t[0], t[1]);
  }, n);
}
var $e = {};
$e.paragraph = {
  filter: "p",
  replacement: function(n) {
    return `

` + n + `

`;
  }
};
$e.lineBreak = {
  filter: "br",
  replacement: function(n, e, t) {
    return t.br + `
`;
  }
};
$e.heading = {
  filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
  replacement: function(n, e, t) {
    var r = Number(e.nodeName.charAt(1));
    if (t.headingStyle === "setext" && r < 3) {
      var i = us(r === 1 ? "=" : "-", n.length);
      return `

` + n + `
` + i + `

`;
    } else
      return `

` + us("#", r) + " " + n + `

`;
  }
};
$e.blockquote = {
  filter: "blockquote",
  replacement: function(n) {
    return n = Ou(n).replace(/^/gm, "> "), `

` + n + `

`;
  }
};
$e.list = {
  filter: ["ul", "ol"],
  replacement: function(n, e) {
    var t = e.parentNode;
    return t.nodeName === "LI" && t.lastElementChild === e ? `
` + n : `

` + n + `

`;
  }
};
$e.listItem = {
  filter: "li",
  replacement: function(n, e, t) {
    var r = t.bulletListMarker + "   ", i = e.parentNode;
    if (i.nodeName === "OL") {
      var s = i.getAttribute("start"), o = Array.prototype.indexOf.call(i.children, e);
      r = (s ? Number(s) + o : o + 1) + ".  ";
    }
    var a = /\n$/.test(n);
    return n = Ou(n) + (a ? `
` : ""), n = n.replace(/\n/gm, `
` + " ".repeat(r.length)), r + n + (e.nextSibling ? `
` : "");
  }
};
$e.indentedCodeBlock = {
  filter: function(n, e) {
    return e.codeBlockStyle === "indented" && n.nodeName === "PRE" && n.firstChild && n.firstChild.nodeName === "CODE";
  },
  replacement: function(n, e, t) {
    return `

    ` + e.firstChild.textContent.replace(/\n/g, `
    `) + `

`;
  }
};
$e.fencedCodeBlock = {
  filter: function(n, e) {
    return e.codeBlockStyle === "fenced" && n.nodeName === "PRE" && n.firstChild && n.firstChild.nodeName === "CODE";
  },
  replacement: function(n, e, t) {
    for (var r = e.firstChild.getAttribute("class") || "", i = (r.match(/language-(\S+)/) || [null, ""])[1], s = e.firstChild.textContent, o = t.fence.charAt(0), a = 3, u = new RegExp("^" + o + "{3,}", "gm"), l; l = u.exec(s); )
      l[0].length >= a && (a = l[0].length + 1);
    var c = us(o, a);
    return `

` + c + i + `
` + s.replace(/\n$/, "") + `
` + c + `

`;
  }
};
$e.horizontalRule = {
  filter: "hr",
  replacement: function(n, e, t) {
    return `

` + t.hr + `

`;
  }
};
$e.inlineLink = {
  filter: function(n, e) {
    return e.linkStyle === "inlined" && n.nodeName === "A" && n.getAttribute("href");
  },
  replacement: function(n, e) {
    var t = Ks(e.getAttribute("href")), r = Gs(qr(e.getAttribute("title"))), i = r ? ' "' + r + '"' : "";
    return "[" + n + "](" + t + i + ")";
  }
};
$e.referenceLink = {
  filter: function(n, e) {
    return e.linkStyle === "referenced" && n.nodeName === "A" && n.getAttribute("href");
  },
  replacement: function(n, e, t) {
    var r = Ks(e.getAttribute("href")), i = qr(e.getAttribute("title"));
    i && (i = ' "' + Gs(i) + '"');
    var s, o;
    switch (t.linkReferenceStyle) {
      case "collapsed":
        s = "[" + n + "][]", o = "[" + n + "]: " + r + i;
        break;
      case "shortcut":
        s = "[" + n + "]", o = "[" + n + "]: " + r + i;
        break;
      default:
        var a = this.references.length + 1;
        s = "[" + n + "][" + a + "]", o = "[" + a + "]: " + r + i;
    }
    return this.references.push(o), s;
  },
  references: [],
  append: function(n) {
    var e = "";
    return this.references.length && (e = `

` + this.references.join(`
`) + `

`, this.references = []), e;
  }
};
$e.emphasis = {
  filter: ["em", "i"],
  replacement: function(n, e, t) {
    return n.trim() ? t.emDelimiter + n + t.emDelimiter : "";
  }
};
$e.strong = {
  filter: ["strong", "b"],
  replacement: function(n, e, t) {
    return n.trim() ? t.strongDelimiter + n + t.strongDelimiter : "";
  }
};
$e.code = {
  filter: function(n) {
    var e = n.previousSibling || n.nextSibling, t = n.parentNode.nodeName === "PRE" && !e;
    return n.nodeName === "CODE" && !t;
  },
  replacement: function(n) {
    if (!n) return "";
    n = n.replace(/\r?\n|\r/g, " ");
    for (var e = /^`|^ .*?[^ ].* $|`$/.test(n) ? " " : "", t = "`", r = n.match(/`+/gm) || []; r.indexOf(t) !== -1; ) t = t + "`";
    return t + e + n + e + t;
  }
};
$e.image = {
  filter: "img",
  replacement: function(n, e) {
    var t = Bu(qr(e.getAttribute("alt"))), r = Ks(e.getAttribute("src") || ""), i = qr(e.getAttribute("title")), s = i ? ' "' + Gs(i) + '"' : "";
    return r ? "![" + t + "](" + r + s + ")" : "";
  }
};
function qr(n) {
  return n ? n.replace(/(\n+\s*)+/g, `
`) : "";
}
function Ks(n) {
  var e = n.replace(/([<>()])/g, "\\$1");
  return e.indexOf(" ") >= 0 ? "<" + e + ">" : e;
}
function Gs(n) {
  return n.replace(/"/g, '\\"');
}
function zu(n) {
  this.options = n, this._keep = [], this._remove = [], this.blankRule = {
    replacement: n.blankReplacement
  }, this.keepReplacement = n.keepReplacement, this.defaultRule = {
    replacement: n.defaultReplacement
  }, this.array = [];
  for (var e in n.rules) this.array.push(n.rules[e]);
}
zu.prototype = {
  add: function(n, e) {
    this.array.unshift(e);
  },
  keep: function(n) {
    this._keep.unshift({
      filter: n,
      replacement: this.keepReplacement
    });
  },
  remove: function(n) {
    this._remove.unshift({
      filter: n,
      replacement: function() {
        return "";
      }
    });
  },
  forNode: function(n) {
    if (n.isBlank) return this.blankRule;
    var e;
    return (e = Fi(this.array, n, this.options)) || (e = Fi(this._keep, n, this.options)) || (e = Fi(this._remove, n, this.options)) ? e : this.defaultRule;
  },
  forEach: function(n) {
    for (var e = 0; e < this.array.length; e++) n(this.array[e], e);
  }
};
function Fi(n, e, t) {
  for (var r = 0; r < n.length; r++) {
    var i = n[r];
    if (Zk(i, e, t)) return i;
  }
}
function Zk(n, e, t) {
  var r = n.filter;
  if (typeof r == "string") {
    if (r === e.nodeName.toLowerCase()) return !0;
  } else if (Array.isArray(r)) {
    if (r.indexOf(e.nodeName.toLowerCase()) > -1) return !0;
  } else if (typeof r == "function") {
    if (r.call(n, e, t)) return !0;
  } else
    throw new TypeError("`filter` needs to be a string, array, or function");
}
function Qk(n) {
  var e = n.element, t = n.isBlock, r = n.isVoid, i = n.isPre || function(d) {
    return d.nodeName === "PRE";
  };
  if (!(!e.firstChild || i(e))) {
    for (var s = null, o = !1, a = null, u = La(a, e, i); u !== e; ) {
      if (u.nodeType === 3 || u.nodeType === 4) {
        var l = u.data.replace(/[ \r\n\t]+/g, " ");
        if ((!s || / $/.test(s.data)) && !o && l[0] === " " && (l = l.substr(1)), !l) {
          u = qi(u);
          continue;
        }
        u.data = l, s = u;
      } else if (u.nodeType === 1)
        t(u) || u.nodeName === "BR" ? (s && (s.data = s.data.replace(/ $/, "")), s = null, o = !1) : r(u) || i(u) ? (s = null, o = !0) : s && (o = !1);
      else {
        u = qi(u);
        continue;
      }
      var c = La(a, u, i);
      a = u, u = c;
    }
    s && (s.data = s.data.replace(/ $/, ""), s.data || qi(s));
  }
}
function qi(n) {
  var e = n.nextSibling || n.parentNode;
  return n.parentNode.removeChild(n), e;
}
function La(n, e, t) {
  return n && n.parentNode === e || t(e) ? e.nextSibling || e.parentNode : e.firstChild || e.nextSibling || e.parentNode;
}
var Xs = typeof window < "u" ? window : {};
function Jk() {
  var n = Xs.DOMParser, e = !1;
  try {
    new n().parseFromString("", "text/html") && (e = !0);
  } catch {
  }
  return e;
}
function ew() {
  var n = function() {
  };
  return tw() ? n.prototype.parseFromString = function(e) {
    var t = new window.ActiveXObject("htmlfile");
    return t.designMode = "on", t.open(), t.write(e), t.close(), t;
  } : n.prototype.parseFromString = function(e) {
    var t = document.implementation.createHTMLDocument("");
    return t.open(), t.write(e), t.close(), t;
  }, n;
}
function tw() {
  var n = !1;
  try {
    document.implementation.createHTMLDocument("").open();
  } catch {
    Xs.ActiveXObject && (n = !0);
  }
  return n;
}
var nw = Jk() ? Xs.DOMParser : ew();
function rw(n, e) {
  var t;
  if (typeof n == "string") {
    var r = iw().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      '<x-turndown id="turndown-root">' + n + "</x-turndown>",
      "text/html"
    );
    t = r.getElementById("turndown-root");
  } else
    t = n.cloneNode(!0);
  return Qk({
    element: t,
    isBlock: Us,
    isVoid: Lu,
    isPre: e.preformattedCode ? sw : null
  }), t;
}
var Vi;
function iw() {
  return Vi = Vi || new nw(), Vi;
}
function sw(n) {
  return n.nodeName === "PRE" || n.nodeName === "CODE";
}
function ow(n, e) {
  return n.isBlock = Us(n), n.isCode = n.nodeName === "CODE" || n.parentNode.isCode, n.isBlank = aw(n), n.flankingWhitespace = lw(n, e), n;
}
function aw(n) {
  return !Lu(n) && !Gk(n) && /^\s*$/i.test(n.textContent) && !Kk(n) && !Xk(n);
}
function lw(n, e) {
  if (n.isBlock || e.preformattedCode && n.isCode)
    return {
      leading: "",
      trailing: ""
    };
  var t = uw(n.textContent);
  return t.leadingAscii && $a("left", n, e) && (t.leading = t.leadingNonAscii), t.trailingAscii && $a("right", n, e) && (t.trailing = t.trailingNonAscii), {
    leading: t.leading,
    trailing: t.trailing
  };
}
function uw(n) {
  var e = n.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
  return {
    leading: e[1],
    // whole string for whitespace-only strings
    leadingAscii: e[2],
    leadingNonAscii: e[3],
    trailing: e[4],
    // empty for whitespace-only strings
    trailingNonAscii: e[5],
    trailingAscii: e[6]
  };
}
function $a(n, e, t) {
  var r, i, s;
  return n === "left" ? (r = e.previousSibling, i = / $/) : (r = e.nextSibling, i = /^ /), r && (r.nodeType === 3 ? s = i.test(r.nodeValue) : t.preformattedCode && r.nodeName === "CODE" ? s = !1 : r.nodeType === 1 && !Us(r) && (s = i.test(r.textContent))), s;
}
var cw = Array.prototype.reduce;
function Vr(n) {
  if (!(this instanceof Vr)) return new Vr(n);
  var e = {
    rules: $e,
    headingStyle: "setext",
    hr: "* * *",
    bulletListMarker: "*",
    codeBlockStyle: "indented",
    fence: "```",
    emDelimiter: "_",
    strongDelimiter: "**",
    linkStyle: "inlined",
    linkReferenceStyle: "full",
    br: "  ",
    preformattedCode: !1,
    blankReplacement: function(t, r) {
      return r.isBlock ? `

` : "";
    },
    keepReplacement: function(t, r) {
      return r.isBlock ? `

` + r.outerHTML + `

` : r.outerHTML;
    },
    defaultReplacement: function(t, r) {
      return r.isBlock ? `

` + t + `

` : t;
    }
  };
  this.options = Uk({}, e, n), this.rules = new zu(this.options);
}
Vr.prototype = {
  /**
   * The entry point for converting a string or DOM node to Markdown
   * @public
   * @param {String|HTMLElement} input The string or DOM node to convert
   * @returns A Markdown representation of the input
   * @type String
   */
  turndown: function(n) {
    if (!pw(n))
      throw new TypeError(n + " is not a string, or an element/document/fragment node.");
    if (n === "") return "";
    var e = Fu.call(this, new rw(n, this.options));
    return dw.call(this, e);
  },
  /**
   * Add one or more plugins
   * @public
   * @param {Function|Array} plugin The plugin or array of plugins to add
   * @returns The Turndown instance for chaining
   * @type Object
   */
  use: function(n) {
    if (Array.isArray(n))
      for (var e = 0; e < n.length; e++) this.use(n[e]);
    else if (typeof n == "function")
      n(this);
    else
      throw new TypeError("plugin must be a Function or an Array of Functions");
    return this;
  },
  /**
   * Adds a rule
   * @public
   * @param {String} key The unique key of the rule
   * @param {Object} rule The rule
   * @returns The Turndown instance for chaining
   * @type Object
   */
  addRule: function(n, e) {
    return this.rules.add(n, e), this;
  },
  /**
   * Keep a node (as HTML) that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */
  keep: function(n) {
    return this.rules.keep(n), this;
  },
  /**
   * Remove a node that matches the filter
   * @public
   * @param {String|Array|Function} filter The unique key of the rule
   * @returns The Turndown instance for chaining
   * @type Object
   */
  remove: function(n) {
    return this.rules.remove(n), this;
  },
  /**
   * Escapes Markdown syntax
   * @public
   * @param {String} string The string to escape
   * @returns A string with Markdown syntax escaped
   * @type String
   */
  escape: function(n) {
    return Bu(n);
  }
};
function Fu(n) {
  var e = this;
  return cw.call(n.childNodes, function(t, r) {
    r = new ow(r, e.options);
    var i = "";
    return r.nodeType === 3 ? i = r.isCode ? r.nodeValue : e.escape(r.nodeValue) : r.nodeType === 1 && (i = fw.call(e, r)), qu(t, i);
  }, "");
}
function dw(n) {
  var e = this;
  return this.rules.forEach(function(t) {
    typeof t.append == "function" && (n = qu(n, t.append(e.options)));
  }), n.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
}
function fw(n) {
  var e = this.rules.forNode(n), t = Fu.call(this, n), r = n.flankingWhitespace;
  return (r.leading || r.trailing) && (t = t.trim()), r.leading + e.replacement(t, n, this.options) + r.trailing;
}
function qu(n, e) {
  var t = Mu(n), r = Pu(e), i = Math.max(n.length - t.length, e.length - r.length), s = `

`.substring(0, i);
  return t + s + r;
}
function pw(n) {
  return n != null && (typeof n == "string" || n.nodeType && (n.nodeType === 1 || n.nodeType === 9 || n.nodeType === 11));
}
var Na = /highlight-(?:text|source)-([a-z0-9]+)/;
function hw(n) {
  n.addRule("highlightedCodeBlock", {
    filter: function(e) {
      var t = e.firstChild;
      return e.nodeName === "DIV" && Na.test(e.className) && t && t.nodeName === "PRE";
    },
    replacement: function(e, t, r) {
      var i = t.className || "", s = (i.match(Na) || [null, ""])[1];
      return `

` + r.fence + s + `
` + t.firstChild.textContent + `
` + r.fence + `

`;
    }
  });
}
function mw(n) {
  n.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: function(e) {
      return "~" + e + "~";
    }
  });
}
var vw = Array.prototype.indexOf, gw = Array.prototype.every, Tn = {};
Tn.tableCell = {
  filter: ["th", "td"],
  replacement: function(n, e) {
    return Vu(n, e);
  }
};
Tn.tableRow = {
  filter: "tr",
  replacement: function(n, e) {
    var t = "", r = { left: ":--", right: "--:", center: ":-:" };
    if (Ys(e))
      for (var i = 0; i < e.childNodes.length; i++) {
        var s = "---", o = (e.childNodes[i].getAttribute("align") || "").toLowerCase();
        o && (s = r[o] || s), t += Vu(s, e.childNodes[i]);
      }
    return `
` + n + (t ? `
` + t : "");
  }
};
Tn.table = {
  // Only convert tables with a heading row.
  // Tables with no heading row are kept using `keep` (see below).
  filter: function(n) {
    return n.nodeName === "TABLE" && Ys(n.rows[0]);
  },
  replacement: function(n) {
    return n = n.replace(`

`, `
`), `

` + n + `

`;
  }
};
Tn.tableSection = {
  filter: ["thead", "tbody", "tfoot"],
  replacement: function(n) {
    return n;
  }
};
function Ys(n) {
  var e = n.parentNode;
  return e.nodeName === "THEAD" || e.firstChild === n && (e.nodeName === "TABLE" || yw(e)) && gw.call(n.childNodes, function(t) {
    return t.nodeName === "TH";
  });
}
function yw(n) {
  var e = n.previousSibling;
  return n.nodeName === "TBODY" && (!e || e.nodeName === "THEAD" && /^\s*$/i.test(e.textContent));
}
function Vu(n, e) {
  var t = vw.call(e.parentNode.childNodes, e), r = " ";
  return t === 0 && (r = "| "), r + n + " |";
}
function bw(n) {
  n.keep(function(t) {
    return t.nodeName === "TABLE" && !Ys(t.rows[0]);
  });
  for (var e in Tn) n.addRule(e, Tn[e]);
}
function kw(n) {
  n.addRule("taskListItems", {
    filter: function(e) {
      return e.type === "checkbox" && e.parentNode.nodeName === "LI";
    },
    replacement: function(e, t) {
      return (t.checked ? "[x]" : "[ ]") + " ";
    }
  });
}
function ww(n) {
  n.use([
    hw,
    mw,
    bw,
    kw
  ]);
}
const Sw = { class: "markdown-editor" }, Tw = ["aria-label"], _w = ["contenteditable"], xw = /* @__PURE__ */ j({
  __name: "MarkdownEditor",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = de(), s = new Vr({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      strongDelimiter: "**"
    });
    s.use(ww);
    function o(O) {
      return cf(O);
    }
    function a(O) {
      return O ? s.turndown(O) : "";
    }
    const u = nt("editorEl"), l = cs({
      bold: !1,
      italic: !1,
      strike: !1,
      h1: !1,
      h2: !1,
      h3: !1,
      bulletList: !1,
      orderedList: !1,
      blockquote: !1,
      codeBlock: !1
    });
    let c = null, d = null, f = null;
    function p(O) {
      const P = u.value;
      P && (P.innerHTML = O);
    }
    function m() {
      const O = u.value;
      return O ? a(O.innerHTML) : "";
    }
    function v() {
      d !== null && cancelAnimationFrame(d), d = requestAnimationFrame(() => {
        d = null;
        const O = m();
        c = O, O !== t.modelValue && r("update:modelValue", O);
      });
    }
    function y(O) {
      O.key === "Enter" && O.shiftKey && (O.preventDefault(), document.execCommand("insertLineBreak"));
    }
    function T(O) {
      O.preventDefault();
      const P = O.clipboardData;
      if (!P) return;
      const W = P.getData("text/plain");
      if (!W) return;
      /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|```|\*\*|__|\[.*\]\(/m.test(W) ? document.execCommand("insertHTML", !1, o(W)) : document.execCommand("insertText", !1, W);
    }
    function S() {
      u.value?.focus();
    }
    function E(O) {
      S(), document.execCommand(O), b(), v();
    }
    function C(O) {
      S();
      const P = qn(u.value), W = P?.rangeCount && H(P.anchorNode, O);
      document.execCommand("formatBlock", !1, W ? "P" : O), b(), v();
    }
    function B() {
      S();
      const O = qn(u.value);
      if (!O || !O.rangeCount) return;
      const P = D(O.anchorNode);
      if (P && P.tagName === "BLOCKQUOTE") {
        const W = P.parentNode;
        if (!W) return;
        for (; P.firstChild; )
          W.insertBefore(P.firstChild, P);
        W.removeChild(P);
      } else
        document.execCommand("formatBlock", !1, "BLOCKQUOTE");
      b(), v();
    }
    function x() {
      S();
      const O = qn(u.value);
      if (!O || !O.rangeCount) return;
      const P = H(O.anchorNode, "PRE");
      if (P) {
        const W = document.createElement("p");
        W.textContent = P.textContent ?? "", P.parentNode?.replaceChild(W, P);
        const X = document.createRange();
        X.selectNodeContents(W), X.collapse(!1), O.removeAllRanges(), O.addRange(X);
      } else {
        const W = O.getRangeAt(0), X = W.toString() || `
`, ie = document.createElement("pre"), se = document.createElement("code");
        se.textContent = X, ie.appendChild(se), W.deleteContents(), W.insertNode(ie);
        const be = document.createRange();
        be.setStartAfter(ie), be.collapse(!0), O.removeAllRanges(), O.addRange(be);
      }
      b(), v();
    }
    function _() {
      f || (f = () => b(), document.addEventListener("selectionchange", f), b());
    }
    function w() {
      f && (document.removeEventListener("selectionchange", f), f = null);
    }
    function b() {
      l.bold = document.queryCommandState("bold"), l.italic = document.queryCommandState("italic"), l.strike = document.queryCommandState("strikeThrough"), l.h1 = R("H1"), l.h2 = R("H2"), l.h3 = R("H3"), l.bulletList = document.queryCommandState("insertUnorderedList"), l.orderedList = document.queryCommandState("insertOrderedList"), l.blockquote = R("BLOCKQUOTE"), l.codeBlock = R("PRE");
    }
    function R(O) {
      const P = qn(u.value);
      return !P || !P.rangeCount ? !1 : !!H(P.anchorNode, O);
    }
    function D(O) {
      const P = u.value;
      let W = O;
      for (; W && W !== P; ) {
        if (W.nodeType === 1 && /^(P|H[1-6]|BLOCKQUOTE|PRE|UL|OL|LI|DIV)$/.test(
          W.tagName
        ))
          return W;
        W = W.parentNode;
      }
      return null;
    }
    function H(O, P) {
      const W = u.value;
      let X = O;
      for (; X && X !== W; ) {
        if (X.nodeType === 1 && X.tagName === P)
          return X;
        X = X.parentNode;
      }
      return null;
    }
    function L(O) {
      return O ? "secondary" : "tertiary";
    }
    return _e(() => {
      p(o(t.modelValue || ""));
    }), gt(() => {
      w(), d !== null && cancelAnimationFrame(d);
    }), oe(
      () => t.modelValue,
      (O) => {
        O !== c && O !== m() && (p(o(O || "")), c = null);
      }
    ), (O, P) => (k(), $("div", Sw, [
      n.disabled ? G("", !0) : (k(), $("div", {
        key: 0,
        class: "markdown-editor__toolbar",
        role: "toolbar",
        "aria-label": h(i)("mdToolbar.label")
      }, [
        q(re, {
          size: "sm",
          variant: L(l.h1),
          icon: "heading-1",
          "aria-label": h(i)("mdToolbar.h1"),
          title: h(i)("mdToolbar.h1"),
          onClick: P[0] || (P[0] = (W) => C("H1"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: L(l.h2),
          icon: "heading-2",
          "aria-label": h(i)("mdToolbar.h2"),
          title: h(i)("mdToolbar.h2"),
          onClick: P[1] || (P[1] = (W) => C("H2"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: L(l.h3),
          icon: "heading-3",
          "aria-label": h(i)("mdToolbar.h3"),
          title: h(i)("mdToolbar.h3"),
          onClick: P[2] || (P[2] = (W) => C("H3"))
        }, null, 8, ["variant", "aria-label", "title"]),
        P[9] || (P[9] = N("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(re, {
          size: "sm",
          variant: L(l.bold),
          icon: "bold",
          "aria-label": h(i)("mdToolbar.bold"),
          title: h(i)("mdToolbar.bold"),
          onClick: P[3] || (P[3] = (W) => E("bold"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: L(l.italic),
          icon: "italic",
          "aria-label": h(i)("mdToolbar.italic"),
          title: h(i)("mdToolbar.italic"),
          onClick: P[4] || (P[4] = (W) => E("italic"))
        }, null, 8, ["variant", "aria-label", "title"]),
        P[10] || (P[10] = N("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(re, {
          size: "sm",
          variant: L(l.bulletList),
          icon: "list",
          "aria-label": h(i)("mdToolbar.bulletList"),
          title: h(i)("mdToolbar.bulletList"),
          onClick: P[5] || (P[5] = (W) => E("insertUnorderedList"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: L(l.orderedList),
          icon: "list-ordered",
          "aria-label": h(i)("mdToolbar.orderedList"),
          title: h(i)("mdToolbar.orderedList"),
          onClick: P[6] || (P[6] = (W) => E("insertOrderedList"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: L(l.blockquote),
          icon: "quote",
          "aria-label": h(i)("mdToolbar.quote"),
          title: h(i)("mdToolbar.quote"),
          onClick: B
        }, null, 8, ["variant", "aria-label", "title"]),
        P[11] || (P[11] = N("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(re, {
          size: "sm",
          variant: L(l.codeBlock),
          icon: "code-block",
          "aria-label": h(i)("mdToolbar.codeBlock"),
          title: h(i)("mdToolbar.codeBlock"),
          onClick: x
        }, null, 8, ["variant", "aria-label", "title"]),
        P[12] || (P[12] = N("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(re, {
          size: "sm",
          variant: "tertiary",
          icon: "undo",
          "aria-label": h(i)("mdToolbar.undo"),
          title: h(i)("mdToolbar.undo"),
          onClick: P[7] || (P[7] = (W) => E("undo"))
        }, null, 8, ["aria-label", "title"]),
        q(re, {
          size: "sm",
          variant: "tertiary",
          icon: "redo",
          "aria-label": h(i)("mdToolbar.redo"),
          title: h(i)("mdToolbar.redo"),
          onClick: P[8] || (P[8] = (W) => E("redo"))
        }, null, 8, ["aria-label", "title"])
      ], 8, Tw)),
      N("div", {
        ref: "editorEl",
        class: "markdown-editor__content",
        contenteditable: !n.disabled,
        onInput: v,
        onKeydown: y,
        onPaste: T,
        onFocus: _,
        onBlur: w
      }, null, 40, _w)
    ]));
  }
}), Ew = /* @__PURE__ */ ae(xw, [["__scopeId", "data-v-356dd429"]]), Cw = { class: "llm-service-panel" }, Aw = {
  key: 0,
  class: "llm-service-panel__empty",
  role: "status"
}, Iw = { class: "llm-service-panel__empty-text" }, Rw = /* @__PURE__ */ j({
  __name: "LLMServicePanel",
  props: {
    service: {}
  },
  setup(n) {
    const e = n, t = Me(), { t: r } = de(), i = A(() => {
      const T = e.service.status.value;
      return T === "queued" || T === "processing" ? "processing" : T === "error" ? "error" : "done";
    }), s = A(() => e.service.progress.value), o = A(() => e.service.content.value), a = A(() => e.service.busy.value), u = A(() => e.service.dirty.value), l = A(() => e.service.versions.value), c = A(
      () => e.service.activeVersionNumber.value
    ), d = A(() => i.value !== "done" ? !1 : !o.value && l.value.length === 0), f = A(() => {
      const T = t.activeChannel.value, S = T?.activeTranslation.value.id, C = (S ? T?.translations.get(S) : void 0)?.lastModifiedAt.value ?? null;
      if (C == null) return !0;
      const x = l.value.find(
        (_) => _.versionNumber === c.value
      )?.createdAt ?? e.service.lastUpdate.value;
      return x == null ? !0 : x >= C;
    }), p = M(o.value);
    oe(o, (T) => {
      p.value = T, t.llmServices?.setDirty(e.service.id, !1);
    }), oe(p, (T) => {
      const S = T !== o.value;
      e.service.dirty.value !== S && t.llmServices?.setDirty(e.service.id, S);
    });
    function m() {
      t.emit("llmService:regenerate", { id: e.service.id });
    }
    function v() {
      t.emit("llmService:export", { id: e.service.id });
    }
    function y() {
      t.emit("llmService:saveVersion", {
        id: e.service.id,
        content: p.value
      });
    }
    return (T, S) => (k(), $("section", Cw, [
      q(pu, {
        status: i.value,
        progress: s.value,
        onRetry: m
      }, {
        "toolbar-left": z(() => [
          q(re, {
            variant: "primary",
            icon: "save",
            disabled: !u.value || a.value,
            "aria-label": h(r)("llmService.save"),
            title: h(r)("llmService.save"),
            onClick: y
          }, null, 8, ["disabled", "aria-label", "title"]),
          q(re, {
            variant: "secondary",
            icon: "refresh-cw",
            loading: i.value === "processing",
            disabled: f.value || a.value || i.value === "processing",
            "aria-label": h(r)("llmService.regenerate"),
            title: h(r)("llmService.regenerate"),
            onClick: m
          }, null, 8, ["loading", "disabled", "aria-label", "title"])
        ]),
        "toolbar-center": z(() => [
          N("span", {
            class: Te(["llm-service-panel__status", [
              f.value ? "llm-service-panel__status--ok" : "llm-service-panel__status--warn"
            ]])
          }, [
            q(Qe, {
              name: f.value ? "check" : "warning",
              size: 14
            }, null, 8, ["name"]),
            N("span", null, K(f.value ? h(r)("llmService.statusUpdated") : h(r)("llmService.statusOutdated")), 1)
          ], 2)
        ]),
        "toolbar-right": z(() => [
          q(re, {
            variant: "primary",
            icon: "download",
            disabled: i.value === "processing",
            "aria-label": h(r)("llmService.download"),
            title: h(r)("llmService.download"),
            onClick: v
          }, {
            default: z(() => [
              me(K(h(r)("llmService.download")), 1)
            ]),
            _: 1
          }, 8, ["disabled", "aria-label", "title"])
        ]),
        default: z(() => [
          d.value ? (k(), $("div", Aw, [
            N("p", Iw, K(h(r)("llmService.empty")), 1),
            q(re, {
              variant: "primary",
              icon: "sparkles",
              disabled: a.value,
              onClick: m
            }, {
              default: z(() => [
                me(K(h(r)("llmService.generate")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ])) : (k(), V(Ew, {
            key: 1,
            modelValue: p.value,
            "onUpdate:modelValue": S[0] || (S[0] = (E) => p.value = E),
            disabled: a.value
          }, null, 8, ["modelValue", "disabled"]))
        ]),
        _: 1
      }, 8, ["status", "progress"])
    ]));
  }
}), Pw = /* @__PURE__ */ ae(Rw, [["__scopeId", "data-v-3d3f7483"]]);
function Mw(n) {
  return {
    id: n.id,
    label: M(n.label),
    description: M(n.description ?? null),
    content: M(n.content ?? ""),
    status: M(n.status ?? "idle"),
    progress: M(n.progress ?? 0),
    phase: M(n.phase ?? null),
    error: M(n.error ?? null),
    lastUpdate: M(n.lastUpdate ?? null),
    versions: M(n.versions ?? []),
    activeVersionNumber: M(n.activeVersionNumber ?? null),
    generations: M(n.generations ?? []),
    currentGenerationId: M(n.currentGenerationId ?? null),
    busy: M(!1),
    dirty: M(!1)
  };
}
function Ba(n) {
  return !Number.isFinite(n) || n < 0 ? 0 : n > 100 ? 100 : n;
}
function V1() {
  return {
    name: "llmServices",
    components: { llmServicePanel: Pw },
    install(n) {
      const e = /* @__PURE__ */ new Map(), t = Pt([]), r = M(null);
      function i() {
        t.value = Array.from(e.values());
      }
      function s(w) {
        return e.get(w);
      }
      function o(w) {
        const b = e.get(w.id);
        if (b)
          return w.label !== void 0 && (b.label.value = w.label), w.description !== void 0 && (b.description.value = w.description), w.content !== void 0 && (b.content.value = w.content), w.status !== void 0 && (b.status.value = w.status), w.progress !== void 0 && (b.progress.value = Ba(w.progress)), w.phase !== void 0 && (b.phase.value = w.phase), w.error !== void 0 && (b.error.value = w.error), w.lastUpdate !== void 0 && (b.lastUpdate.value = w.lastUpdate), w.versions !== void 0 && (b.versions.value = w.versions), w.activeVersionNumber !== void 0 && (b.activeVersionNumber.value = w.activeVersionNumber), w.generations !== void 0 && (b.generations.value = w.generations), w.currentGenerationId !== void 0 && (b.currentGenerationId.value = w.currentGenerationId), b;
        const R = Mw(w);
        return e.set(w.id, R), i(), R;
      }
      function a(w) {
        e.delete(w) && (r.value === w && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function u() {
        e.size === 0 && r.value === null || (e.clear(), r.value !== null && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function l(w) {
        return e.get(w);
      }
      function c(w) {
        w !== null && !e.has(w) || r.value !== w && (r.value = w, n.emit("llmService:active", { id: w }));
      }
      function d(w, b) {
        const R = s(w);
        R && (R.label.value = b);
      }
      function f(w, b) {
        const R = s(w);
        R && (R.status.value = b, b !== "error" && (R.error.value = null), b === "complete" && (R.progress.value = 100, R.phase.value = null));
      }
      function p(w, b, R) {
        const D = s(w);
        D && (D.progress.value = Ba(b), R !== void 0 && (D.phase.value = R));
      }
      function m(w, b, R) {
        const D = s(w);
        D && (D.content.value = b, D.lastUpdate.value = R ?? Date.now());
      }
      function v(w, b) {
        const R = s(w);
        R && (R.error.value = b, b && (R.status.value = "error"));
      }
      function y(w, b) {
        const R = s(w);
        R && (R.versions.value = b);
      }
      function T(w, b) {
        const R = s(w);
        R && (R.activeVersionNumber.value = b);
      }
      function S(w, b) {
        const R = s(w);
        R && (R.generations.value = b);
      }
      function E(w, b) {
        const R = s(w);
        R && (R.currentGenerationId.value = b);
      }
      function C(w, b) {
        const R = s(w);
        R && (R.busy.value = b);
      }
      function B(w, b) {
        const R = s(w);
        R && (R.dirty.value = b);
      }
      const x = A(() => {
        const w = r.value;
        return w === null ? null : e.get(w) ?? null;
      }), _ = {
        list: t,
        activeId: r,
        active: x,
        setActive: c,
        register: o,
        unregister: a,
        clear: u,
        get: l,
        setLabel: d,
        setStatus: f,
        setProgress: p,
        setContent: m,
        setError: v,
        setVersions: y,
        setActiveVersion: T,
        setGenerations: S,
        setCurrentGeneration: E,
        setBusy: C,
        setDirty: B
      };
      return n.llmServices = _, () => {
        e.clear(), t.value = [], r.value = null, n.llmServices = void 0;
      };
    }
  };
}
const Ow = ["aria-label"], Dw = { class: "chat-session-list__header" }, Lw = { class: "chat-session-list__title" }, $w = { class: "chat-session-list__items" }, Nw = {
  key: 1,
  class: "chat-session-confirm"
}, Bw = { class: "chat-session-confirm__text" }, zw = /* @__PURE__ */ j({
  __name: "ChatSessionList",
  props: {
    sessions: {},
    activeSessionId: {}
  },
  emits: ["select", "create", "rename", "delete"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = de(), s = M(null), o = M(""), a = M(null), u = A(() => ({
      customParams: { "aria-label": i("chat.rename") }
    }));
    function l(y) {
      a.value = null, o.value = y.title, s.value = y.id;
    }
    function c() {
      const y = s.value;
      if (!y) return;
      s.value = null;
      const T = o.value.trim(), S = t.sessions.find((E) => E.id === y);
      T && T !== S?.title && r("rename", y, T);
    }
    function d() {
      s.value = null;
    }
    function f(y) {
      y.stopPropagation(), y.key === "Enter" ? c() : y.key === "Escape" && d();
    }
    function p(y) {
      a.value = y;
    }
    function m() {
      a.value = null;
    }
    function v() {
      const y = a.value;
      y && (a.value = null, r("delete", y));
    }
    return (y, T) => (k(), $("nav", {
      class: "chat-session-list",
      "aria-label": h(i)("chat.history")
    }, [
      N("header", Dw, [
        N("h3", Lw, K(h(i)("chat.history")), 1),
        q(re, {
          icon: "plus",
          variant: "transparent",
          size: "sm",
          "aria-label": h(i)("chat.newChat"),
          onClick: T[0] || (T[0] = (S) => r("create"))
        }, null, 8, ["aria-label"])
      ]),
      N("ul", $w, [
        (k(!0), $(ye, null, ze(n.sessions, (S) => (k(), $("li", {
          key: S.id,
          class: "chat-session-item"
        }, [
          s.value === S.id ? (k(), V(An, {
            key: 0,
            modelValue: o.value,
            "onUpdate:modelValue": T[1] || (T[1] = (E) => o.value = E),
            field: u.value,
            focus: !0,
            "full-width": "",
            size: "sm",
            onKeydown: f,
            onBlur: c
          }, null, 8, ["modelValue", "field"])) : a.value === S.id ? (k(), $("div", Nw, [
            N("span", Bw, K(h(i)("chat.deleteConfirm")), 1),
            q(re, {
              icon: "x",
              variant: "transparent",
              size: "sm",
              "aria-label": h(i)("chat.cancel"),
              onClick: m
            }, null, 8, ["aria-label"]),
            q(re, {
              icon: "check",
              variant: "transparent",
              intent: "destructive",
              size: "sm",
              "aria-label": h(i)("chat.confirmDelete"),
              onClick: v
            }, null, 8, ["aria-label"])
          ])) : (k(), V(as, {
            key: 2,
            current: S.id === n.activeSessionId,
            label: S.title,
            title: S.title,
            onSelect: (E) => r("select", S.id)
          }, {
            actions: z(() => [
              q(re, {
                icon: "pencil",
                variant: "transparent",
                size: "sm",
                "aria-label": h(i)("chat.rename"),
                onClick: (E) => l(S)
              }, null, 8, ["aria-label", "onClick"]),
              q(re, {
                icon: "trash",
                variant: "transparent",
                intent: "destructive",
                size: "sm",
                "aria-label": h(i)("chat.deleteSession"),
                onClick: (E) => p(S.id)
              }, null, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1032, ["current", "label", "title", "onSelect"]))
        ]))), 128))
      ])
    ], 8, Ow));
  }
}), Fw = /* @__PURE__ */ ae(zw, [["__scopeId", "data-v-d023026c"]]), qw = { class: "code-block" }, Vw = ["innerHTML"], Hw = { key: 1 }, Ww = /* @__PURE__ */ j({
  __name: "CodeBlock",
  props: {
    code: {},
    lang: {},
    streaming: { type: Boolean }
  },
  setup(n) {
    const e = n, { t } = de();
    function r() {
      return navigator.clipboard.writeText(e.code);
    }
    const i = M(null);
    let s = 0;
    return oe(
      () => [e.code, e.lang, e.streaming],
      async ([o, a, u]) => {
        const l = ++s;
        if (u || !o) {
          i.value = null;
          return;
        }
        const { highlightCode: c } = await import("./highlight-DIP8TLdw.js");
        l === s && (i.value = c(o, a ?? ""));
      },
      { immediate: !0 }
    ), (o, a) => (k(), $("div", qw, [
      n.streaming ? G("", !0) : (k(), V(Fr, {
        key: 0,
        class: "code-block__copy",
        variant: "transparent",
        size: "sm",
        "copy-fn": r,
        "aria-label": h(t)("markdown.copyCode")
      }, null, 8, ["aria-label"])),
      N("pre", null, [
        i.value ? (k(), $("code", {
          key: 0,
          innerHTML: i.value
        }, null, 8, Vw)) : (k(), $("code", Hw, K(n.code), 1))
      ])
    ]));
  }
}), Uw = /* @__PURE__ */ ae(Ww, [["__scopeId", "data-v-42abac84"]]), jw = { class: "markdown-view" }, Kw = ["innerHTML"], Gw = /* @__PURE__ */ j({
  __name: "MarkdownView",
  props: {
    source: {},
    streaming: { type: Boolean }
  },
  setup(n) {
    const e = n, t = A(() => df(e.source));
    return (r, i) => (k(), $("div", jw, [
      (k(!0), $(ye, null, ze(t.value, (s, o) => (k(), $(ye, { key: o }, [
        s.type === "html" ? (k(), $("div", {
          key: 0,
          class: "markdown-view__html",
          innerHTML: s.html
        }, null, 8, Kw)) : (k(), V(Uw, {
          key: 1,
          code: s.code,
          lang: s.lang,
          streaming: n.streaming
        }, null, 8, ["code", "lang", "streaming"]))
      ], 64))), 128))
    ]));
  }
}), Xw = /* @__PURE__ */ ae(Gw, [["__scopeId", "data-v-89c2c4e6"]]), Yw = {
  key: 0,
  class: "chat-message chat-message--user"
}, Zw = { class: "chat-message__bubble" }, Qw = {
  key: 1,
  class: "chat-message chat-message--assistant"
}, Jw = {
  class: "chat-message__marker",
  "aria-hidden": "true"
}, e1 = { class: "chat-message__body" }, t1 = {
  key: 1,
  class: "chat-message__typing",
  "aria-hidden": "true"
}, n1 = {
  key: 2,
  class: "chat-message__actions"
}, r1 = /* @__PURE__ */ j({
  __name: "ChatMessage",
  props: {
    message: {}
  },
  setup(n) {
    const e = n, { t } = de();
    function r() {
      return navigator.clipboard.writeText(e.message.content);
    }
    return (i, s) => n.message.role === "user" ? (k(), $("div", Yw, [
      N("div", Zw, K(n.message.content), 1)
    ])) : (k(), $("div", Qw, [
      N("span", Jw, [
        q(Qe, {
          name: "sparkles",
          size: 16
        })
      ]),
      N("div", e1, [
        n.message.content ? (k(), V(Xw, {
          key: 0,
          source: n.message.content,
          streaming: n.message.streaming
        }, null, 8, ["source", "streaming"])) : G("", !0),
        n.message.streaming ? (k(), $("div", t1, [...s[0] || (s[0] = [
          N("span", null, null, -1),
          N("span", null, null, -1),
          N("span", null, null, -1)
        ])])) : G("", !0),
        !n.message.streaming && n.message.content ? (k(), $("div", n1, [
          q(Fr, {
            variant: "secondary",
            size: "sm",
            "copy-fn": r,
            "aria-label": h(t)("chat.copy")
          }, {
            default: z(() => [
              me(K(h(t)("chat.copy")), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : G("", !0)
      ])
    ]));
  }
}), i1 = /* @__PURE__ */ ae(r1, [["__scopeId", "data-v-949425ba"]]), s1 = { class: "chat-message-list" }, o1 = {
  key: 0,
  class: "chat-message-list__state",
  role: "status"
}, a1 = { class: "sr-only" }, l1 = {
  key: 1,
  class: "chat-message-list__state"
}, u1 = {
  key: 2,
  class: "chat-message-list__state"
}, c1 = { class: "chat-message-list__items" }, d1 = /* @__PURE__ */ j({
  __name: "ChatMessageList",
  props: {
    messages: {},
    hasActiveSession: { type: Boolean },
    isLoading: { type: Boolean }
  },
  setup(n) {
    const { t: e } = de();
    return (t, r) => (k(), $("div", s1, [
      n.isLoading ? (k(), $("div", o1, [
        q(Qe, {
          name: "spinner",
          size: 28,
          spin: ""
        }),
        N("span", a1, K(h(e)("editor.loading")), 1)
      ])) : n.hasActiveSession ? n.messages.length === 0 ? (k(), $("div", u1, [
        N("p", null, K(h(e)("chat.emptyChat")), 1)
      ])) : (k(), V(h(Vp), {
        key: 3,
        class: "chat-message-list__scroll",
        resize: "smooth",
        initial: !0
      }, {
        default: z(() => [
          N("div", c1, [
            (k(!0), $(ye, null, ze(n.messages, (i) => (k(), V(i1, {
              key: i.id,
              message: i
            }, null, 8, ["message"]))), 128))
          ])
        ]),
        _: 1
      })) : (k(), $("div", l1, [
        N("p", null, K(h(e)("chat.emptyState")), 1)
      ]))
    ]));
  }
}), f1 = /* @__PURE__ */ ae(d1, [["__scopeId", "data-v-5e9c3599"]]), p1 = { class: "chat-composer" }, h1 = ["for"], m1 = ["id", "placeholder", "disabled"], v1 = /* @__PURE__ */ j({
  __name: "ChatComposer",
  props: {
    disabled: { type: Boolean }
  },
  emits: ["send"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = nt("chat-composer__textarea"), { t: s } = de(), o = M(""), a = Hr();
    function u() {
      const c = o.value.trim();
      !c || t.disabled || (o.value = "", r("send", c));
    }
    function l(c) {
      c.key !== "Escape" && (c.stopPropagation(), c.key === "Enter" && !c.shiftKey && (c.preventDefault(), u()));
    }
    return _e(() => {
      i.value?.focus();
    }), (c, d) => (k(), $("div", p1, [
      N("label", {
        for: h(a),
        class: "sr-only"
      }, K(h(s)("chat.placeholder")), 9, h1),
      Hn(N("textarea", {
        id: h(a),
        "onUpdate:modelValue": d[0] || (d[0] = (f) => o.value = f),
        class: "chat-composer__textarea",
        placeholder: h(s)("chat.placeholder"),
        disabled: n.disabled,
        rows: "2",
        ref: "chat-composer__textarea",
        onKeydown: l
      }, null, 40, m1), [
        [bc, o.value]
      ]),
      q(re, {
        icon: "send",
        variant: "primary",
        size: "md",
        disabled: !o.value.trim() || n.disabled,
        "aria-label": h(s)("chat.send"),
        onClick: u
      }, null, 8, ["disabled", "aria-label"])
    ]));
  }
}), g1 = /* @__PURE__ */ ae(v1, [["__scopeId", "data-v-47dca7c5"]]), y1 = ["aria-labelledby"], b1 = { class: "chat-drawer__header" }, k1 = ["id"], w1 = { class: "chat-drawer__actions" }, S1 = { class: "chat-drawer__body" }, T1 = { class: "chat-drawer__main" }, _1 = /* @__PURE__ */ j({
  __name: "ChatDrawer",
  setup(n) {
    const e = Me(), { t } = de(), r = e.chat, i = Hr(), s = M(!1);
    function o() {
      r.setDrawerOpen(!1);
    }
    function a() {
      s.value = !s.value;
    }
    function u(m) {
      m.key === "Escape" && r.drawerOpen.value && o();
    }
    oe(
      () => r.drawerOpen.value,
      (m) => {
        m ? (s.value = !1, e.emit("chat:loadSessions", void 0), window.addEventListener("keydown", u)) : window.removeEventListener("keydown", u);
      }
    ), Qt(() => window.removeEventListener("keydown", u));
    function l(m) {
      e.emit("chat:loadSession", { sessionId: m });
    }
    function c() {
      e.emit("chat:createSession", void 0);
    }
    function d(m, v) {
      e.emit("chat:renameSession", { sessionId: m, title: v });
    }
    function f(m) {
      e.emit("chat:deleteSession", { sessionId: m });
    }
    function p(m) {
      e.emit("chat:send", { content: m });
    }
    return (m, v) => (k(), V(Wr, { name: "chat-drawer" }, {
      default: z(() => [
        h(r).drawerOpen.value ? (k(), $("div", {
          key: 0,
          class: "chat-overlay",
          onClick: De(o, ["self"])
        }, [
          N("aside", {
            class: Te(["chat-drawer", { "chat-drawer--expanded": s.value }]),
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": h(i)
          }, [
            N("header", b1, [
              N("h2", {
                id: h(i),
                class: "chat-drawer__title"
              }, [
                q(Qe, {
                  name: "sparkles",
                  size: 18
                }),
                me(" " + K(h(t)("chat.title")), 1)
              ], 8, k1),
              N("div", w1, [
                q(re, {
                  class: "chat-drawer__expand",
                  icon: s.value ? "minimize" : "maximize",
                  variant: "tertiary",
                  size: "sm",
                  "aria-label": s.value ? h(t)("chat.collapse") : h(t)("chat.expand"),
                  onClick: a
                }, null, 8, ["icon", "aria-label"]),
                q(re, {
                  icon: "x",
                  variant: "tertiary",
                  size: "sm",
                  "aria-label": h(t)("chat.close"),
                  onClick: o
                }, null, 8, ["aria-label"])
              ])
            ]),
            N("div", S1, [
              q(Fw, {
                sessions: h(r).sessions.value,
                "active-session-id": h(r).activeSessionId.value,
                onSelect: l,
                onCreate: c,
                onRename: d,
                onDelete: f
              }, null, 8, ["sessions", "active-session-id"]),
              N("div", T1, [
                q(f1, {
                  messages: h(r).allMessages.value,
                  "has-active-session": h(r).activeSessionId.value !== null,
                  "is-loading": h(r).isLoadingSession.value
                }, null, 8, ["messages", "has-active-session", "is-loading"]),
                q(g1, {
                  disabled: h(r).isStreaming.value || h(r).isLoadingSession.value,
                  onSend: p
                }, null, 8, ["disabled"])
              ])
            ])
          ], 10, y1)
        ])) : G("", !0)
      ]),
      _: 1
    }));
  }
}), x1 = /* @__PURE__ */ ae(_1, [["__scopeId", "data-v-d1ddd36c"]]), E1 = "__streaming__";
function H1() {
  return {
    name: "chat",
    components: { chatDrawer: x1 },
    install(n) {
      const e = M(!1), t = M([]), r = M(null), i = M([]), s = M(!1), o = M(""), a = M(!1);
      let u = 0;
      const l = () => `local-${++u}`, c = A(() => s.value ? [
        ...i.value,
        {
          id: E1,
          role: "assistant",
          content: o.value,
          streaming: !0
        }
      ] : i.value), d = {
        drawerOpen: e,
        sessions: t,
        activeSessionId: r,
        messages: i,
        isStreaming: s,
        streamingContent: o,
        isLoadingSession: a,
        allMessages: c,
        setDrawerOpen(f) {
          e.value = f;
        },
        setSessions(f) {
          t.value = f;
        },
        setActiveSession(f) {
          r.value = f;
        },
        setMessages(f) {
          i.value = f;
        },
        addMessage(f) {
          i.value = [...i.value, f];
        },
        updateSessionTitle(f, p) {
          const m = t.value.find((v) => v.id === f);
          m && (m.title = p);
        },
        setLoadingSession(f) {
          a.value = f;
        },
        streamStart() {
          s.value = !0, o.value = "";
        },
        streamAppend(f) {
          o.value += f;
        },
        streamEnd(f, p) {
          i.value = [
            ...i.value,
            {
              id: l(),
              role: "assistant",
              content: f,
              tokenCount: p?.tokenCount
            }
          ], s.value = !1, o.value = "";
        },
        streamAbort() {
          s.value = !1, o.value = "";
        }
      };
      return n.chat = d, () => {
        t.value = [], i.value = [], r.value = null, s.value = !1, o.value = "", a.value = !1, e.value = !1, n.chat = void 0;
      };
    }
  };
}
function C1(n) {
  return n.map((e) => {
    const t = zs(e.turn_id, e.words), r = t[0]?.startTime ?? e.stime, i = t.length > 0 ? t[t.length - 1].endTime ?? e.etime : e.etime;
    return {
      id: e.turn_id,
      speakerId: e.speaker_id || null,
      text: t.length > 0 ? null : e.segment,
      words: t,
      ...r !== void 0 && { startTime: r },
      ...i !== void 0 && { endTime: i },
      // The ApiTurn type says required; real payloads disagree.
      language: e.language ?? ""
    };
  });
}
function W1(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = C1(n.text), r = n.metadata.transcription.lang ?? n.text[0]?.language ?? "fr";
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
function A1(n, e) {
  return fu(
    n,
    e.map((t) => ({
      text: t.word ?? "",
      startTime: t.start,
      endTime: t.end,
      confidence: t.score
    }))
  );
}
function U1(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = A1(`turn_${o}`, s.words);
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
  Ve as D,
  $1 as L,
  H1 as a,
  M1 as b,
  B1 as c,
  V1 as d,
  F1 as e,
  q1 as f,
  z1 as g,
  C1 as h,
  U1 as i,
  O1 as j,
  D1 as k,
  W1 as m,
  cl as p,
  Me as u,
  gf as v
};
