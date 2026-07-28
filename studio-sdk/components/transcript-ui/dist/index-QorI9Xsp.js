import * as ho from "vue";
import { shallowReactive as Un, shallowRef as Dt, ref as P, computed as A, inject as jn, provide as Sn, h as Tt, defineComponent as j, openBlock as k, createBlock as V, resolveDynamicComponent as Ia, normalizeClass as Se, normalizeStyle as Yt, createElementBlock as L, useSlots as Xu, renderSlot as Z, createCommentVNode as Y, createTextVNode as pe, toDisplayString as K, createElementVNode as B, Fragment as ye, renderList as qe, unref as h, withCtx as z, createVNode as q, watchEffect as et, onBeforeUnmount as bt, watch as re, normalizeProps as mt, guardReactiveProps as Ot, effectScope as Ra, getCurrentScope as Ma, onScopeDispose as Pa, getCurrentInstance as Zt, customRef as Yu, toValue as We, readonly as Zu, nextTick as Re, onMounted as _e, toHandlerKey as Qu, camelize as Oa, toRef as Da, onUnmounted as Qt, toRefs as _n, Comment as Ju, mergeProps as ve, cloneVNode as ec, reactive as as, Teleport as tc, markRaw as nc, withKeys as La, withModifiers as Le, watchPostEffect as $a, shallowReadonly as dn, mergeDefaults as Na, isRef as rc, useTemplateRef as Qe, useId as zr, withDirectives as Fn, vModelSelect as ic, vModelDynamic as sc, createStaticVNode as oc, isMemoSame as ac, Transition as Fr, useModel as lc, vShow as Ba, vModelText as uc } from "vue";
function cc() {
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
const mo = [
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
function za(n, e, t) {
  const r = mo[n.size % mo.length];
  return { id: e, name: t, color: r };
}
function dc(n, e, t) {
  return !e || n.has(e) ? null : za(n, e, t ?? e);
}
function vo(n, e) {
  return n.name === e.name && n.color === e.color;
}
function fc(n) {
  const e = Un(/* @__PURE__ */ new Map());
  function t(a, u) {
    const l = dc(e, a, u);
    l && (e.set(l.id, l), n("speaker:add", { speaker: l }));
  }
  function r(a, u) {
    const l = e.get(a);
    if (!l) return;
    const c = { ...l, ...u };
    vo(l, c) || (e.set(a, c), n("speaker:update", { speaker: c }));
  }
  function i(a) {
    const u = e.get(a.id);
    if (u) {
      if (vo(u, a)) return;
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
function pc(n, e) {
  return [...n, e];
}
function hc(n, e) {
  return [...e, ...n];
}
function ls(n, e) {
  return n.findIndex((t) => t.id === e);
}
function mc(n, e, t) {
  const r = ls(n, e);
  if (r === -1) return null;
  const i = { ...n[r], ...t, id: e }, s = n.slice();
  return s[r] = i, { turns: s, updated: i };
}
function vc(n, e) {
  const t = ls(n, e);
  return t === -1 ? null : n.filter((r, i) => i !== t);
}
function gc(n, e, t) {
  const r = ls(n, e);
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
function Fi(n, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of n)
    r.speakerId && !t.has(r.speakerId) && (t.add(r.speakerId), e(r.speakerId));
}
function yc(n, e, t) {
  const { id: r, languages: i, isSource: s, audio: o } = n, a = Dt(n.turns), u = P(null);
  function l(T) {
    u.value = T;
  }
  const c = /* @__PURE__ */ new Map();
  function d() {
    c.clear();
    const T = a.value;
    for (let x = 0; x < T.length; x++)
      c.set(T[x].id, x);
  }
  d();
  function f(T) {
    t(T.speakerId), c.set(T.id, a.value.length), a.value = pc(a.value, T), e("turn:add", { turn: T, translationId: r });
  }
  function p(T, x) {
    const S = mc(a.value, T, x);
    S && (a.value = S.turns, e("turn:update", { turn: S.updated, translationId: r }));
  }
  function m(T) {
    const x = vc(a.value, T);
    x && (a.value = x, d(), e("turn:remove", { turnId: T, translationId: r }));
  }
  function v(T, x) {
    const S = gc(a.value, T, x);
    S && (a.value = S.turns, e("turn:update", { turn: S.updated, translationId: r }));
  }
  function y(T) {
    Fi(T, t), a.value = hc(a.value, T), d();
  }
  function _(T) {
    Fi(T, t), a.value = T, d(), e("translation:sync", { translationId: r });
  }
  function b(T) {
    a.value = T, d();
  }
  function C(T) {
    const x = c.get(T.id);
    x !== void 0 ? a.value[x] = T : (c.set(T.id, a.value.length), a.value.push(T));
  }
  function E(T) {
    return c.has(T);
  }
  function N(T) {
    const x = c.get(T);
    if (x !== void 0)
      return a.value[x];
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
    setTurns: _,
    replaceTurns: b,
    updateOrCreateTurnSilent: C,
    hasTurn: E,
    getTurn: N
  };
}
function xr(n) {
  return n.split("-")[0];
}
function Er(n, e) {
  return n == null || e == null ? !1 : xr(n) === xr(e);
}
const jt = "cross";
function bc(n, e, t, r) {
  const i = n.languages.map(xr);
  if (i.length !== 2) return null;
  const s = /* @__PURE__ */ new Map();
  for (const v of e.values())
    if (v.id !== n.id) {
      if (v.languages.length !== 1 || !v.languages[0])
        return null;
      s.set(xr(v.languages[0]), v);
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
    const _ = Er(y.language, o) ? a : o;
    if (!_) return y;
    const b = s.get(_)?.getTurn(v);
    return b || y;
  }
  const d = [];
  function f(v, y) {
    return u.has(y) ? v.sourceLanguage == null ? !0 : !Er(v.language, v.sourceLanguage) : !1;
  }
  function p(v) {
    d.push(
      r(v, ({ turn: y, translationId: _ }) => {
        f(y, _) && t(v, { turn: y, translationId: jt });
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
function go(n, e, t, r) {
  const { id: i, name: s, description: o, duration: a } = n, u = Un(/* @__PURE__ */ new Map());
  let l;
  for (const C of n.translations) {
    const E = yc(C, e, r);
    u.set(C.id, E), C.isSource && !l && (l = E);
  }
  l || (l = u.values().next().value);
  const c = bc(
    l,
    u,
    e,
    t
  ), d = [...u.values()];
  c && d.push(c);
  const f = P(null), p = P(!1), m = P(!0), v = A(() => {
    const C = f.value;
    return C === jt ? c ?? l : C ? u.get(C) ?? l : l;
  });
  function y(C) {
    const E = C === l.id ? null : C;
    E !== f.value && (f.value = E, e("translation:change", { translationId: v.value.id }));
  }
  function _() {
    for (const C of u.values())
      C.setTurns([]);
    p.value = !1, m.value = !0, e("channel:reset", { channelId: i });
  }
  function b() {
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
    reset: _,
    dispose: b
  };
}
function kc(n) {
  const e = /* @__PURE__ */ new Set(), t = [];
  for (const [r, i] of n.speakers)
    e.add(r), t.push({ id: r, name: i.name });
  for (const r of n.channels)
    for (const i of r.translations)
      for (const s of i.turns)
        s.speakerId && !e.has(s.speakerId) && (e.add(s.speakerId), t.push({ id: s.speakerId, name: s.speakerId }));
  return t;
}
function yo(n, e) {
  const t = n.replace("#", ""), r = parseInt(t.substring(0, 2), 16), i = parseInt(t.substring(2, 4), 16), s = parseInt(t.substring(4, 6), 16);
  return `rgba(${r}, ${i}, ${s}, ${e})`;
}
function Fa(n, e, t = "*", r = !0) {
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
function wc(n, e, t, r = "*", i = "") {
  return [...n].sort(
    (o, a) => Number(a.isSource) - Number(o.isSource)
  ).map((o) => {
    const a = !o.isSource && o.languages.length > 1;
    return {
      value: o.id,
      label: o.isSource ? t : a && i ? i : o.languages.map(
        (u) => Fa(u, e, r, !1)
      ).join(", ")
    };
  });
}
function us() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Jt = us();
function qa(n) {
  Jt = n;
}
var Wt = { exec: () => null };
function fn(n) {
  let e = [];
  return (t) => {
    let r = Math.max(0, Math.min(3, t - 1)), i = e[r];
    return i || (i = n(r), e[r] = i), i;
  };
}
function ce(n, e = "") {
  let t = typeof n == "string" ? n : n.source, r = { replace: (i, s) => {
    let o = typeof s == "string" ? s : s.source;
    return o = o.replace($e.caret, "$1"), t = t.replace(i, o), r;
  }, getRegex: () => new RegExp(t, e) };
  return r;
}
var Tc = ((n = "") => {
  try {
    return !!new RegExp("(?<=1)(?<!1)" + n);
  } catch {
    return !1;
  }
})(), $e = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (n) => new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: fn((n) => new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)), hrRegex: fn((n) => new RegExp(`^ {0,${n}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)), fencesBeginRegex: fn((n) => new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)), headingBeginRegex: fn((n) => new RegExp(`^ {0,${n}}#`)), htmlBeginRegex: fn((n) => new RegExp(`^ {0,${n}}<(?:[a-z].*>|!--)`, "i")), blockquoteBeginRegex: fn((n) => new RegExp(`^ {0,${n}}>`)) }, Sc = /^(?:[ \t]*(?:\n|$))+/, _c = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, xc = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Gn = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Ec = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, cs = / {0,3}(?:[*+-]|\d{1,9}[.)])/, Va = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Ha = ce(Va).replace(/bull/g, cs).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Cc = ce(Va).replace(/bull/g, cs).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}(?:\s|$)/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), ds = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/, Ac = /^[^\n]+/, fs = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Ic = ce(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", fs).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Rc = ce(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g, cs).getRegex(), qr = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", ps = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Mc = ce("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", ps).replace("tag", qr).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Wa = (n) => ce(ds).replace("hr", Gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", n).replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qr).getRegex(), Pc = Wa(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/), Oc = Wa(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/), Dc = ce(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Oc).getRegex(), hs = { blockquote: Dc, code: _c, def: Ic, fences: xc, heading: Ec, hr: Gn, html: Mc, lheading: Ha, list: Rc, newline: Sc, paragraph: Pc, table: Wt, text: Ac }, bo = ce("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qr).getRegex(), Lc = { ...hs, lheading: Cc, table: bo, paragraph: ce(ds).replace("hr", Gn).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", bo).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", qr).getRegex() }, $c = { ...hs, html: ce(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", ps).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Wt, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: ce(ds).replace("hr", Gn).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ha).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Nc = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Bc = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, Ua = /^( {2,}|\\)\n(?!\s*$)/, zc = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, xn = /[\p{P}\p{S}]/u, Vr = /[\s\p{P}\p{S}]/u, ms = /[^\s\p{P}\p{S}]/u, Fc = ce(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vr).getRegex(), ja = /(?!~)[\p{P}\p{S}]/u, qc = /(?!~)[\s\p{P}\p{S}]/u, Vc = /(?:[^\s\p{P}\p{S}]|~)/u, Hc = ce(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Tc ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Ga = /^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/, Wc = ce(Ga, "u").replace(/punct/g, xn).getRegex(), Uc = ce(Ga, "u").replace(/punct/g, ja).getRegex(), Ka = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", jc = ce(Ka, "gu").replace(/notPunctSpace/g, ms).replace(/punctSpace/g, Vr).replace(/punct/g, xn).getRegex(), Gc = ce(Ka, "gu").replace(/notPunctSpace/g, Vc).replace(/punctSpace/g, qc).replace(/punct/g, ja).getRegex(), Kc = ce("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, ms).replace(/punctSpace/g, Vr).replace(/punct/g, xn).getRegex(), Xc = ce(/^~~?(?:((?!~)punct)|[^\s~])/, "u").replace(/punct/g, xn).getRegex(), Yc = "^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)", Zc = ce(Yc, "gu").replace(/notPunctSpace/g, ms).replace(/punctSpace/g, Vr).replace(/punct/g, xn).getRegex(), Qc = ce(/\\(punct)/, "gu").replace(/punct/g, xn).getRegex(), Jc = ce(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), ed = ce(ps).replace("(?:-->|$)", "-->").getRegex(), td = ce("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", ed).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Cr = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/, nd = ce(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label", Cr).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Xa = ce(/^!?\[(label)\]\[(ref)\]/).replace("label", Cr).replace("ref", fs).getRegex(), Ya = ce(/^!?\[(ref)\](?:\[\])?/).replace("ref", fs).getRegex(), rd = ce("reflink|nolink(?!\\()", "g").replace("reflink", Xa).replace("nolink", Ya).getRegex(), ko = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, vs = { _backpedal: Wt, anyPunctuation: Qc, autolink: Jc, blockSkip: Hc, br: Ua, code: Bc, del: Wt, delLDelim: Wt, delRDelim: Wt, emStrongLDelim: Wc, emStrongRDelimAst: jc, emStrongRDelimUnd: Kc, escape: Nc, link: nd, nolink: Ya, punctuation: Fc, reflink: Xa, reflinkSearch: rd, tag: td, text: zc, url: Wt }, id = { ...vs, link: ce(/^!?\[(label)\]\((.*?)\)/).replace("label", Cr).getRegex(), reflink: ce(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Cr).getRegex() }, qi = { ...vs, emStrongRDelimAst: Gc, emStrongLDelim: Uc, delLDelim: Xc, delRDelim: Zc, url: ce(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ko).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: ce(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ko).getRegex() }, sd = { ...qi, br: ce(Ua).replace("{2,}", "*").getRegex(), text: ce(qi.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, fr = { normal: hs, gfm: Lc, pedantic: $c }, Pn = { normal: vs, gfm: qi, breaks: sd, pedantic: id }, od = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, wo = (n) => od[n];
function ft(n, e) {
  if (e) {
    if ($e.escapeTest.test(n)) return n.replace($e.escapeReplace, wo);
  } else if ($e.escapeTestNoEncode.test(n)) return n.replace($e.escapeReplaceNoEncode, wo);
  return n;
}
function To(n) {
  try {
    n = encodeURI(n).replace($e.percentDecode, "%");
  } catch {
    return null;
  }
  return n;
}
function So(n, e) {
  let t = n.replace($e.findPipe, (s, o, a) => {
    let u = !1, l = o;
    for (; --l >= 0 && a[l] === "\\"; ) u = !u;
    return u ? "|" : " |";
  }), r = t.split($e.splitPipe), i = 0;
  if (r[0].trim() || r.shift(), r.length > 0 && !r.at(-1)?.trim() && r.pop(), e) if (r.length > e) r.splice(e);
  else for (; r.length < e; ) r.push("");
  for (; i < r.length; i++) r[i] = r[i].trim().replace($e.slashPipe, "|");
  return r;
}
function At(n, e, t) {
  let r = n.length;
  if (r === 0) return "";
  let i = 0;
  for (; i < r && n.charAt(r - i - 1) === e; )
    i++;
  return n.slice(0, r - i);
}
function _o(n) {
  let e = n.split(`
`), t = e.length - 1;
  for (; t >= 0 && $e.blankLine.test(e[t]); ) t--;
  return e.length - t <= 2 ? n : e.slice(0, t + 1).join(`
`);
}
function ad(n, e) {
  if (n.indexOf(e[1]) === -1) return -1;
  let t = 0;
  for (let r = 0; r < n.length; r++) if (n[r] === "\\") r++;
  else if (n[r] === e[0]) t++;
  else if (n[r] === e[1] && (t--, t < 0)) return r;
  return t > 0 ? -2 : -1;
}
function ld(n, e = 0) {
  let t = e, r = "";
  for (let i of n) if (i === "	") {
    let s = 4 - t % 4;
    r += " ".repeat(s), t += s;
  } else r += i, t++;
  return r;
}
function xo(n, e, t, r, i) {
  let s = e.href, o = e.title || null, a = n[1].replace(i.other.outputLinkReplace, "$1");
  r.state.inLink = !0;
  let u = { type: n[0].charAt(0) === "!" ? "image" : "link", raw: t, href: s, title: o, text: a, tokens: r.inlineTokens(a) };
  return r.state.inLink = !1, u;
}
function ud(n, e, t) {
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
var Ar = class {
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
      let r = this.options.pedantic ? t[0] : _o(t[0]), i = r.replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r, codeBlockStyle: "indented", text: i };
    }
  }
  fences(e) {
    let t = this.rules.block.fences.exec(e);
    if (t) {
      let r = t[0], i = ud(r, t[3] || "", this.rules);
      return { type: "code", raw: r, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: i };
    }
  }
  heading(e) {
    let t = this.rules.block.heading.exec(e);
    if (t) {
      let r = t[2].trim();
      if (this.rules.other.endingHash.test(r)) {
        let i = At(r, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (r = i.trim());
      }
      return { type: "heading", raw: At(t[0], `
`), depth: t[1].length, text: r, tokens: this.lexer.inline(r) };
    }
  }
  hr(e) {
    let t = this.rules.block.hr.exec(e);
    if (t) return { type: "hr", raw: At(t[0], `
`) };
  }
  blockquote(e) {
    let t = this.rules.block.blockquote.exec(e);
    if (t) {
      let r = At(t[0], `
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
          let m = p, v = m.raw + `
` + r.join(`
`), y = this.blockquote(v);
          o[o.length - 1] = y, i = i.substring(0, i.length - m.raw.length) + y.raw, s = s.substring(0, s.length - m.text.length) + y.text;
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
        let f = ld(t[2].split(`
`, 1)[0], t[1].length), p = e.split(`
`, 1)[0], m = !f.trim(), v = 0;
        if (this.options.pedantic ? (v = 2, d = f.trimStart()) : m ? v = t[1].length + 1 : (v = f.search(this.rules.other.nonSpaceChar), v = v > 4 ? 1 : v, d = f.slice(v), v += t[1].length), m && this.rules.other.blankLine.test(p) && (c += p + `
`, e = e.substring(p.length + 1), l = !0), !l) {
          let y = this.rules.other.nextBulletRegex(v), _ = this.rules.other.hrRegex(v), b = this.rules.other.fencesBeginRegex(v), C = this.rules.other.headingBeginRegex(v), E = this.rules.other.htmlBeginRegex(v), N = this.rules.other.blockquoteBeginRegex(v);
          for (; e; ) {
            let T = e.split(`
`, 1)[0], x;
            if (p = T, this.options.pedantic ? (p = p.replace(this.rules.other.listReplaceNesting, "  "), x = p) : x = p.replace(this.rules.other.tabCharGlobal, "    "), b.test(p) || C.test(p) || E.test(p) || N.test(p) || y.test(p) || _.test(p)) break;
            if (x.search(this.rules.other.nonSpaceChar) >= v || !p.trim()) d += `
` + x.slice(v);
            else {
              if (m || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || b.test(f) || C.test(f) || _.test(f)) break;
              d += `
` + p;
            }
            m = !p.trim(), c += T + `
`, e = e.substring(T.length + 1), f = x.slice(v);
          }
        }
        s.loose || (a ? s.loose = !0 : this.rules.other.doubleBlankLine.test(c) && (a = !0)), s.items.push({ type: "list_item", raw: c, task: !!this.options.gfm && this.rules.other.listIsTask.test(d), loose: !1, text: d, tokens: [] }), s.raw += c;
      }
      let u = s.items.at(-1);
      if (u) u.raw = u.raw.trimEnd(), u.text = u.text.trimEnd();
      else return;
      s.raw = s.raw.trimEnd();
      for (let l of s.items) {
        this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []);
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
        if (!s.loose) {
          let d = l.tokens.filter((p) => p.type === "space"), f = d.length > 0 && d.some((p) => this.rules.other.anyLine.test(p.raw));
          s.loose = f;
        }
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
      let r = _o(t[0]);
      return { type: "html", block: !0, raw: r, pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: r };
    }
  }
  def(e) {
    let t = this.rules.block.def.exec(e);
    if (t) {
      let r = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", s = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
      return { type: "def", tag: r, raw: At(t[0], `
`), href: i, title: s };
    }
  }
  table(e) {
    let t = this.rules.block.table.exec(e);
    if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
    let r = So(t[1]), i = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), s = t[3]?.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], o = { type: "table", raw: At(t[0], `
`), header: [], align: [], rows: [] };
    if (r.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? o.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? o.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? o.align.push("left") : o.align.push(null);
      for (let a = 0; a < r.length; a++) o.header.push({ text: r[a], tokens: this.lexer.inline(r[a]), header: !0, align: o.align[a] });
      for (let a of s) o.rows.push(So(a, o.header.length).map((u, l) => ({ text: u, tokens: this.lexer.inline(u), header: !1, align: o.align[l] })));
      return o;
    }
  }
  lheading(e) {
    let t = this.rules.block.lheading.exec(e);
    if (t) {
      let r = t[1].trim();
      return { type: "heading", raw: At(t[0], `
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
        let o = At(r.slice(0, -1), "\\");
        if ((r.length - o.length) % 2 === 0) return;
      } else {
        let o = ad(t[2], "()");
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
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(r) ? i = i.slice(1) : i = i.slice(1, -1)), xo(t, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: s && s.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
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
      return xo(r, s, r[0], this.lexer, this.rules);
    }
  }
  emStrong(e, t, r = "") {
    let i = this.rules.inline.emStrongLDelim.exec(e);
    if (!(!i || !i[1] && !i[2] && !i[3] && !i[4] || i[4] && r.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[3]) || !r || this.rules.inline.punctuation.exec(r))) {
      let s = [...i[0]].length - 1, o, a, u = s, l = 0, c = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (i = c.exec(t)) !== null; ) {
        if (o = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !o) continue;
        if (a = [...o].length, i[3] || i[4]) {
          u += a;
          continue;
        } else if ((i[5] || i[6]) && s % 3 && !((s + a) % 3)) {
          l += a;
          continue;
        }
        if (u -= a, u > 0) continue;
        a = Math.min(a, a + u + l);
        let d = [...i[0]][0].length, f = e.slice(0, s + i.index + d + a);
        if (Math.min(s, a) % 2) {
          let m = f.slice(1, -1);
          return { type: "em", raw: f, text: m, tokens: this.lexer.inlineTokens(m) };
        }
        let p = f.slice(2, -2);
        return { type: "strong", raw: f, text: p, tokens: this.lexer.inlineTokens(p) };
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
}, rt = class Vi {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Jt, this.options.tokenizer = this.options.tokenizer || new Ar(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let t = { other: $e, block: fr.normal, inline: Pn.normal };
    this.options.pedantic ? (t.block = fr.pedantic, t.inline = Pn.pedantic) : this.options.gfm && (t.block = fr.gfm, this.options.breaks ? t.inline = Pn.breaks : t.inline = Pn.gfm), this.tokenizer.rules = t;
  }
  static get rules() {
    return { block: fr, inline: Pn };
  }
  static lex(e, t) {
    return new Vi(t).lex(e);
  }
  static lexInline(e, t) {
    return new Vi(t).inlineTokens(e);
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
    r = r.replace(this.tokenizer.rules.inline.anyPunctuation, "++"), r = r.replace(this.tokenizer.rules.inline.blockSkip, (a, u, l) => {
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
}, Ir = class {
  options;
  parser;
  constructor(e) {
    this.options = e || Jt;
  }
  space(e) {
    return "";
  }
  code({ text: e, lang: t, escaped: r }) {
    let i = (t || "").match($e.notSpaceStart)?.[0], s = e.replace($e.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + ft(i) + '">' + (r ? s : ft(s, !0)) + `</code></pre>
` : "<pre><code>" + (r ? s : ft(s, !0)) + `</code></pre>
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
      let u = e.items[a];
      i += this.listitem(u);
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
    return `<code>${ft(e, !0)}</code>`;
  }
  br(e) {
    return "<br>";
  }
  del({ tokens: e }) {
    return `<del>${this.parser.parseInline(e)}</del>`;
  }
  link({ href: e, title: t, tokens: r }) {
    let i = this.parser.parseInline(r), s = To(e);
    if (s === null) return i;
    e = s;
    let o = '<a href="' + e + '"';
    return t && (o += ' title="' + ft(t) + '"'), o += ">" + i + "</a>", o;
  }
  image({ href: e, title: t, text: r, tokens: i }) {
    i && (r = this.parser.parseInline(i, this.parser.textRenderer));
    let s = To(e);
    if (s === null) return ft(r);
    e = s;
    let o = `<img src="${e}" alt="${ft(r)}"`;
    return t && (o += ` title="${ft(t)}"`), o += ">", o;
  }
  text(e) {
    return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : ft(e.text);
  }
}, gs = class {
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
}, it = class Hi {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Jt, this.options.renderer = this.options.renderer || new Ir(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new gs();
  }
  static parse(e, t) {
    return new Hi(t).parse(e);
  }
  static parseInline(e, t) {
    return new Hi(t).parseInline(e);
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
}, $n = class {
  options;
  block;
  constructor(n) {
    this.options = n || Jt;
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
    return n ? rt.lex : rt.lexInline;
  }
  provideParser(n = this.block) {
    return n ? it.parse : it.parseInline;
  }
}, cd = class {
  defaults = us();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = it;
  Renderer = Ir;
  TextRenderer = gs;
  Lexer = rt;
  Tokenizer = Ar;
  Hooks = $n;
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
        let i = this.defaults.renderer || new Ir(this.defaults);
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
        let i = this.defaults.tokenizer || new Ar(this.defaults);
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
        let i = this.defaults.hooks || new $n();
        for (let s in t.hooks) {
          if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let o = s, a = t.hooks[o], u = i[o];
          $n.passThroughHooks.has(s) ? i[o] = (l) => {
            if (this.defaults.async && $n.passThroughHooksRespectAsync.has(s)) return (async () => {
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
    return rt.lex(n, e ?? this.defaults);
  }
  parser(n, e) {
    return it.parse(n, e ?? this.defaults);
  }
  parseMarkdown(n) {
    return (e, t) => {
      let r = { ...t }, i = { ...this.defaults, ...r }, s = this.onError(!!i.silent, !!i.async);
      if (this.defaults.async === !0 && r.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (i.hooks && (i.hooks.options = i, i.hooks.block = n), i.async) return (async () => {
        let o = i.hooks ? await i.hooks.preprocess(e) : e, a = await (i.hooks ? await i.hooks.provideLexer(n) : n ? rt.lex : rt.lexInline)(o, i), u = i.hooks ? await i.hooks.processAllTokens(a) : a;
        i.walkTokens && await Promise.all(this.walkTokens(u, i.walkTokens));
        let l = await (i.hooks ? await i.hooks.provideParser(n) : n ? it.parse : it.parseInline)(u, i);
        return i.hooks ? await i.hooks.postprocess(l) : l;
      })().catch(s);
      try {
        i.hooks && (e = i.hooks.preprocess(e));
        let o = (i.hooks ? i.hooks.provideLexer(n) : n ? rt.lex : rt.lexInline)(e, i);
        i.hooks && (o = i.hooks.processAllTokens(o)), i.walkTokens && this.walkTokens(o, i.walkTokens);
        let a = (i.hooks ? i.hooks.provideParser(n) : n ? it.parse : it.parseInline)(o, i);
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
        let r = "<p>An error occurred:</p><pre>" + ft(t.message + "", !0) + "</pre>";
        return e ? Promise.resolve(r) : r;
      }
      if (e) return Promise.reject(t);
      throw t;
    };
  }
}, Gt = new cd();
function de(n, e) {
  return Gt.parse(n, e);
}
de.options = de.setOptions = function(n) {
  return Gt.setOptions(n), de.defaults = Gt.defaults, qa(de.defaults), de;
};
de.getDefaults = us;
de.defaults = Jt;
de.use = function(...n) {
  return Gt.use(...n), de.defaults = Gt.defaults, qa(de.defaults), de;
};
de.walkTokens = function(n, e) {
  return Gt.walkTokens(n, e);
};
de.parseInline = Gt.parseInline;
de.Parser = it;
de.parser = it.parse;
de.Renderer = Ir;
de.TextRenderer = gs;
de.Lexer = rt;
de.lexer = rt.lex;
de.Tokenizer = Ar;
de.Hooks = $n;
de.parse = de;
de.options;
de.setOptions;
de.use;
de.walkTokens;
de.parseInline;
it.parse;
rt.lex;
function Eo(n, e) {
  (e == null || e > n.length) && (e = n.length);
  for (var t = 0, r = Array(e); t < e; t++) r[t] = n[t];
  return r;
}
function dd(n) {
  if (Array.isArray(n)) return n;
}
function fd(n, e) {
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
function pd() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function hd(n, e) {
  return dd(n) || fd(n, e) || md(n, e) || pd();
}
function md(n, e) {
  if (n) {
    if (typeof n == "string") return Eo(n, e);
    var t = {}.toString.call(n).slice(8, -1);
    return t === "Object" && n.constructor && (t = n.constructor.name), t === "Map" || t === "Set" ? Array.from(n) : t === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? Eo(n, e) : void 0;
  }
}
const Za = Object.entries, Co = Object.setPrototypeOf, vd = Object.isFrozen, gd = Object.getPrototypeOf, yd = Object.getOwnPropertyDescriptor;
let Ie = Object.freeze, Me = Object.seal, gn = Object.create, Qa = typeof Reflect < "u" && Reflect, Wi = Qa.apply, Ui = Qa.construct;
Ie || (Ie = function(e) {
  return e;
});
Me || (Me = function(e) {
  return e;
});
Wi || (Wi = function(e, t) {
  for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), s = 2; s < r; s++)
    i[s - 2] = arguments[s];
  return e.apply(t, i);
});
Ui || (Ui = function(e) {
  for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
    r[i - 1] = arguments[i];
  return new e(...r);
});
const pn = xe(Array.prototype.forEach), bd = xe(Array.prototype.lastIndexOf), Ao = xe(Array.prototype.pop), hn = xe(Array.prototype.push), kd = xe(Array.prototype.splice), Pt = Array.isArray, Nn = xe(String.prototype.toLowerCase), vi = xe(String.prototype.toString), Io = xe(String.prototype.match), On = xe(String.prototype.replace), Ro = xe(String.prototype.indexOf), wd = xe(String.prototype.trim), Td = xe(Number.prototype.toString), Sd = xe(Boolean.prototype.toString), Mo = typeof BigInt > "u" ? null : xe(BigInt.prototype.toString), Po = typeof Symbol > "u" ? null : xe(Symbol.prototype.toString), Ae = xe(Object.prototype.hasOwnProperty), Dn = xe(Object.prototype.toString), Ce = xe(RegExp.prototype.test), Vt = _d(TypeError);
function xe(n) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), i = 1; i < t; i++)
      r[i - 1] = arguments[i];
    return Wi(n, e, r);
  };
}
function _d(n) {
  return function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    return Ui(n, t);
  };
}
function ue(n, e) {
  let t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Nn;
  if (Co && Co(n, null), !Pt(e))
    return n;
  let r = e.length;
  for (; r--; ) {
    let i = e[r];
    if (typeof i == "string") {
      const s = t(i);
      s !== i && (vd(e) || (e[r] = s), i = s);
    }
    n[i] = !0;
  }
  return n;
}
function xd(n) {
  for (let e = 0; e < n.length; e++)
    Ae(n, e) || (n[e] = null);
  return n;
}
function ze(n) {
  const e = gn(null);
  for (const r of Za(n)) {
    var t = hd(r, 2);
    const i = t[0], s = t[1];
    Ae(n, i) && (Pt(s) ? e[i] = xd(s) : s && typeof s == "object" && s.constructor === Object ? e[i] = ze(s) : e[i] = s);
  }
  return e;
}
function Ed(n) {
  switch (typeof n) {
    case "string":
      return n;
    case "number":
      return Td(n);
    case "boolean":
      return Sd(n);
    case "bigint":
      return Mo ? Mo(n) : "0";
    case "symbol":
      return Po ? Po(n) : "Symbol()";
    case "undefined":
      return Dn(n);
    case "function":
    case "object": {
      if (n === null)
        return Dn(n);
      const e = n, t = pt(e, "toString");
      if (typeof t == "function") {
        const r = t(e);
        return typeof r == "string" ? r : Dn(r);
      }
      return Dn(n);
    }
    default:
      return Dn(n);
  }
}
function pt(n, e) {
  for (; n !== null; ) {
    const r = yd(n, e);
    if (r) {
      if (r.get)
        return xe(r.get);
      if (typeof r.value == "function")
        return xe(r.value);
    }
    n = gd(n);
  }
  function t() {
    return null;
  }
  return t;
}
function Cd(n) {
  try {
    return Ce(n, ""), !0;
  } catch {
    return !1;
  }
}
const Oo = Ie(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), gi = Ie(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), yi = Ie(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Ad = Ie(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), bi = Ie(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Id = Ie(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Do = Ie(["#text"]), Lo = Ie(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), ki = Ie(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), $o = Ie(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), pr = Ie(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Rd = Me(/{{[\w\W]*|^[\w\W]*}}/g), Md = Me(/<%[\w\W]*|^[\w\W]*%>/g), Pd = Me(/\${[\w\W]*/g), Od = Me(/^data-[\-\w.\u00B7-\uFFFF]+$/), Dd = Me(/^aria-[\-\w]+$/), No = Me(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ld = Me(/^(?:\w+script|data):/i), $d = Me(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Nd = Me(/^html$/i), Bd = Me(/^[a-z][.\w]*(-[.\w]+)+$/i), Bo = Me(/<[/\w!]/g), zo = Me(/<[/\w]/g), zd = Me(/<\/no(script|embed|frames)/i), Fd = Me(/\/>/i), Ke = {
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
}, qd = function() {
  return typeof window > "u" ? null : window;
}, Vd = function(e, t) {
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
}, Fo = function() {
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
}, It = function(e, t, r, i) {
  return Ae(e, t) && Pt(e[t]) ? ue(i.base ? ze(i.base) : {}, e[t], i.transform) : r;
};
function Ja() {
  let n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : qd();
  const e = (G) => Ja(G);
  if (e.version = "3.4.12", e.removed = [], !n || !n.document || n.document.nodeType !== Ke.document || !n.Element)
    return e.isSupported = !1, e;
  let t = n.document;
  const r = t, i = r.currentScript;
  n.DocumentFragment;
  const s = n.HTMLTemplateElement, o = n.Node, a = n.Element, u = n.NodeFilter, l = n.NamedNodeMap;
  l === void 0 && (n.NamedNodeMap || n.MozNamedAttrMap), n.HTMLFormElement;
  const c = n.DOMParser, d = n.trustedTypes, f = a.prototype, p = pt(f, "cloneNode"), m = pt(f, "remove"), v = pt(f, "nextSibling"), y = pt(f, "childNodes"), _ = pt(f, "parentNode"), b = pt(f, "shadowRoot"), C = pt(f, "attributes"), E = o && o.prototype ? pt(o.prototype, "nodeType") : null, N = o && o.prototype ? pt(o.prototype, "nodeName") : null;
  if (typeof s == "function") {
    const G = t.createElement("template");
    G.content && G.content.ownerDocument && (t = G.content.ownerDocument);
  }
  let T, x = "", S, w = !1, I = 0;
  const D = function() {
    if (I > 0)
      throw Vt('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, F = function(g) {
    D(), I++;
    try {
      return T.createHTML(g);
    } finally {
      I--;
    }
  }, $ = function(g) {
    D(), I++;
    try {
      return T.createScriptURL(g);
    } finally {
      I--;
    }
  }, O = function() {
    return w || (S = Vd(d, i), w = !0), S;
  }, M = t, W = M.implementation, X = M.createNodeIterator, se = M.createDocumentFragment, oe = M.getElementsByTagName, we = r.importNode;
  let le = Fo();
  e.isSupported = typeof Za == "function" && typeof _ == "function" && W && W.createHTMLDocument !== void 0;
  const zt = Rd, sn = Md, Qr = Pd, Qn = Od, Jr = Dd, Jn = Ld, er = $d, In = Bd;
  let tr = No, me = null;
  const nr = ue({}, [...Oo, ...gi, ...yi, ...bi, ...Do]);
  let he = null;
  const rr = ue({}, [...Lo, ...ki, ...$o, ...pr]);
  let U = Object.seal(gn(null, {
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
  })), ae = null, Ee = null;
  const Oe = Object.seal(gn(null, {
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
  let lt = !0, wt = !0, Ge = !1, Xs = !0, xt = !1, Et = !0, Ft = !1, ei = !1, ti = null, ni = null, ri = !1, on = !1, ir = !1, sr = !1, Ys = !0, Zs = !1;
  const Qs = "user-content-";
  let ii = !0, si = !1, an = {}, ut = null;
  const oi = ue({}, [
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
  let Js = null;
  const eo = ue({}, ["audio", "video", "img", "source", "image", "track"]);
  let ai = null;
  const to = ue({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), or = "http://www.w3.org/1998/Math/MathML", ar = "http://www.w3.org/2000/svg", ct = "http://www.w3.org/1999/xhtml";
  let ln = ct, li = !1, ui = null;
  const Ou = ue({}, [or, ar, ct], vi), no = Ie(["mi", "mo", "mn", "ms", "mtext"]);
  let ci = ue({}, no);
  const ro = Ie(["annotation-xml"]);
  let di = ue({}, ro);
  const Du = ue({}, ["title", "style", "font", "a", "script"]);
  let Rn = null;
  const Lu = ["application/xhtml+xml", "text/html"], $u = "text/html";
  let ge = null, un = null;
  const Nu = t.createElement("form"), io = function(g) {
    return g instanceof RegExp || g instanceof Function;
  }, fi = function() {
    let g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (un && un === g)
      return;
    (!g || typeof g != "object") && (g = {}), g = ze(g), Rn = // eslint-disable-next-line unicorn/prefer-includes
    Lu.indexOf(g.PARSER_MEDIA_TYPE) === -1 ? $u : g.PARSER_MEDIA_TYPE, ge = Rn === "application/xhtml+xml" ? vi : Nn, me = It(g, "ALLOWED_TAGS", nr, {
      transform: ge
    }), he = It(g, "ALLOWED_ATTR", rr, {
      transform: ge
    }), ui = It(g, "ALLOWED_NAMESPACES", Ou, {
      transform: vi
    }), ai = It(g, "ADD_URI_SAFE_ATTR", to, {
      transform: ge,
      base: to
    }), Js = It(g, "ADD_DATA_URI_TAGS", eo, {
      transform: ge,
      base: eo
    }), ut = It(g, "FORBID_CONTENTS", oi, {
      transform: ge
    }), ae = It(g, "FORBID_TAGS", ze({}), {
      transform: ge
    }), Ee = It(g, "FORBID_ATTR", ze({}), {
      transform: ge
    }), an = Ae(g, "USE_PROFILES") ? g.USE_PROFILES && typeof g.USE_PROFILES == "object" ? ze(g.USE_PROFILES) : g.USE_PROFILES : !1, lt = g.ALLOW_ARIA_ATTR !== !1, wt = g.ALLOW_DATA_ATTR !== !1, Ge = g.ALLOW_UNKNOWN_PROTOCOLS || !1, Xs = g.ALLOW_SELF_CLOSE_IN_ATTR !== !1, xt = g.SAFE_FOR_TEMPLATES || !1, Et = g.SAFE_FOR_XML !== !1, Ft = g.WHOLE_DOCUMENT || !1, on = g.RETURN_DOM || !1, ir = g.RETURN_DOM_FRAGMENT || !1, sr = g.RETURN_TRUSTED_TYPE || !1, ri = g.FORCE_BODY || !1, Ys = g.SANITIZE_DOM !== !1, Zs = g.SANITIZE_NAMED_PROPS || !1, ii = g.KEEP_CONTENT !== !1, si = g.IN_PLACE || !1, tr = Cd(g.ALLOWED_URI_REGEXP) ? g.ALLOWED_URI_REGEXP : No, ln = typeof g.NAMESPACE == "string" ? g.NAMESPACE : ct, ci = Ae(g, "MATHML_TEXT_INTEGRATION_POINTS") && g.MATHML_TEXT_INTEGRATION_POINTS && typeof g.MATHML_TEXT_INTEGRATION_POINTS == "object" ? ze(g.MATHML_TEXT_INTEGRATION_POINTS) : ue({}, no), di = Ae(g, "HTML_INTEGRATION_POINTS") && g.HTML_INTEGRATION_POINTS && typeof g.HTML_INTEGRATION_POINTS == "object" ? ze(g.HTML_INTEGRATION_POINTS) : ue({}, ro);
    const R = Ae(g, "CUSTOM_ELEMENT_HANDLING") && g.CUSTOM_ELEMENT_HANDLING && typeof g.CUSTOM_ELEMENT_HANDLING == "object" ? ze(g.CUSTOM_ELEMENT_HANDLING) : gn(null);
    if (U = gn(null), Ae(R, "tagNameCheck") && io(R.tagNameCheck) && (U.tagNameCheck = R.tagNameCheck), Ae(R, "attributeNameCheck") && io(R.attributeNameCheck) && (U.attributeNameCheck = R.attributeNameCheck), Ae(R, "allowCustomizedBuiltInElements") && typeof R.allowCustomizedBuiltInElements == "boolean" && (U.allowCustomizedBuiltInElements = R.allowCustomizedBuiltInElements), Me(U), xt && (wt = !1), ir && (on = !0), an && (me = ue({}, Do), he = gn(null), an.html === !0 && (ue(me, Oo), ue(he, Lo)), an.svg === !0 && (ue(me, gi), ue(he, ki), ue(he, pr)), an.svgFilters === !0 && (ue(me, yi), ue(he, ki), ue(he, pr)), an.mathMl === !0 && (ue(me, bi), ue(he, $o), ue(he, pr))), Oe.tagCheck = null, Oe.attributeCheck = null, Ae(g, "ADD_TAGS") && (typeof g.ADD_TAGS == "function" ? Oe.tagCheck = g.ADD_TAGS : Pt(g.ADD_TAGS) && (me === nr && (me = ze(me)), ue(me, g.ADD_TAGS, ge))), Ae(g, "ADD_ATTR") && (typeof g.ADD_ATTR == "function" ? Oe.attributeCheck = g.ADD_ATTR : Pt(g.ADD_ATTR) && (he === rr && (he = ze(he)), ue(he, g.ADD_ATTR, ge))), Ae(g, "ADD_URI_SAFE_ATTR") && Pt(g.ADD_URI_SAFE_ATTR) && ue(ai, g.ADD_URI_SAFE_ATTR, ge), Ae(g, "FORBID_CONTENTS") && Pt(g.FORBID_CONTENTS) && (ut === oi && (ut = ze(ut)), ue(ut, g.FORBID_CONTENTS, ge)), Ae(g, "ADD_FORBID_CONTENTS") && Pt(g.ADD_FORBID_CONTENTS) && (ut === oi && (ut = ze(ut)), ue(ut, g.ADD_FORBID_CONTENTS, ge)), ii && (me["#text"] = !0), Ft && ue(me, ["html", "head", "body"]), me.table && (ue(me, ["tbody"]), delete ae.tbody), g.TRUSTED_TYPES_POLICY) {
      if (typeof g.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw Vt('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof g.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw Vt('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const H = T;
      T = g.TRUSTED_TYPES_POLICY;
      try {
        x = F("");
      } catch (Q) {
        throw T = H, Q;
      }
    } else g.TRUSTED_TYPES_POLICY === null ? (T = void 0, x = "") : (T === void 0 && (T = O()), T && typeof x == "string" && (x = F("")));
    Ie && Ie(g), un = g;
  }, so = ue({}, [...gi, ...yi, ...Ad]), oo = ue({}, [...bi, ...Id]), Bu = function(g, R, H) {
    return R.namespaceURI === ct ? g === "svg" : R.namespaceURI === or ? g === "svg" && (H === "annotation-xml" || ci[H]) : !!so[g];
  }, zu = function(g, R, H) {
    return R.namespaceURI === ct ? g === "math" : R.namespaceURI === ar ? g === "math" && di[H] : !!oo[g];
  }, Fu = function(g, R, H) {
    return R.namespaceURI === ar && !di[H] || R.namespaceURI === or && !ci[H] ? !1 : !oo[g] && (Du[g] || !so[g]);
  }, qu = function(g) {
    let R = _(g);
    (!R || !R.tagName) && (R = {
      namespaceURI: ln,
      tagName: "template"
    });
    const H = Nn(g.tagName), Q = Nn(R.tagName);
    return ui[g.namespaceURI] ? g.namespaceURI === ar ? Bu(H, R, Q) : g.namespaceURI === or ? zu(H, R, Q) : g.namespaceURI === ct ? Fu(H, R, Q) : !!(Rn === "application/xhtml+xml" && ui[g.namespaceURI]) : !1;
  }, Ct = function(g) {
    hn(e.removed, {
      element: g
    });
    try {
      _(g).removeChild(g);
    } catch {
      if (m(g), !_(g))
        throw Vt("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, lr = function(g) {
    pi(g);
    const R = y(g);
    if (R) {
      const Q = [];
      pn(R, (J) => {
        hn(Q, J);
      }), pn(Q, (J) => {
        try {
          m(J);
        } catch {
        }
      });
    }
    const H = C(g);
    if (H)
      for (let Q = H.length - 1; Q >= 0; --Q) {
        const J = H[Q], ee = J && J.name;
        if (typeof ee == "string")
          try {
            g.removeAttribute(ee);
          } catch {
          }
      }
  }, qt = function(g, R) {
    try {
      hn(e.removed, {
        attribute: R.getAttributeNode(g),
        from: R
      });
    } catch {
      hn(e.removed, {
        attribute: null,
        from: R
      });
    }
    if (R.removeAttribute(g), g === "is")
      if (on || ir)
        try {
          Ct(R);
        } catch {
        }
      else
        try {
          R.setAttribute(g, "");
        } catch {
        }
  }, Vu = function(g) {
    const R = C(g);
    if (R)
      for (let H = R.length - 1; H >= 0; --H) {
        const Q = R[H], J = Q && Q.name;
        if (!(typeof J != "string" || he[ge(J)]))
          try {
            g.removeAttribute(J);
          } catch {
          }
      }
  }, pi = function(g) {
    const R = [g];
    for (; R.length > 0; ) {
      const H = R.pop();
      (E ? E(H) : H.nodeType) === Ke.element && Vu(H);
      const J = y(H);
      if (J)
        for (let ee = J.length - 1; ee >= 0; --ee)
          R.push(J[ee]);
    }
  }, Hu = function(g) {
    if (!Et)
      return;
    const R = [g];
    for (; R.length > 0; ) {
      const H = R.pop(), Q = E ? E(H) : H.nodeType;
      if (Q === Ke.processingInstruction || Q === Ke.comment && Ce(zo, H.data)) {
        try {
          m(H);
        } catch {
        }
        continue;
      }
      if (Q === Ke.element) {
        const ee = H, be = ge(N ? N(H) : H.nodeName);
        try {
          ee.hasAttribute && ee.hasAttribute("patchsrc") && ee.removeAttribute("patchsrc"), ee.hasAttribute && ee.hasAttribute("for") && be !== "label" && be !== "output" && ee.removeAttribute("for");
        } catch {
        }
      }
      const J = y(H);
      if (J)
        for (let ee = J.length - 1; ee >= 0; --ee)
          R.push(J[ee]);
    }
  }, ao = function(g) {
    let R = null, H = null;
    if (ri)
      g = "<remove></remove>" + g;
    else {
      const ee = Io(g, /^[\r\n\t ]+/);
      H = ee && ee[0];
    }
    Rn === "application/xhtml+xml" && ln === ct && (g = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + g + "</body></html>");
    const Q = T ? F(g) : g;
    if (ln === ct)
      try {
        R = new c().parseFromString(Q, Rn);
      } catch {
      }
    if (!R || !R.documentElement) {
      R = W.createDocument(ln, "template", null);
      try {
        R.documentElement.innerHTML = li ? x : Q;
      } catch {
      }
    }
    const J = R.body || R.documentElement;
    return g && H && J.insertBefore(t.createTextNode(H), J.childNodes[0] || null), ln === ct ? oe.call(R, Ft ? "html" : "body")[0] : Ft ? R.documentElement : J;
  }, lo = function(g) {
    return X.call(
      g.ownerDocument || g,
      g,
      // eslint-disable-next-line no-bitwise
      u.SHOW_ELEMENT | u.SHOW_COMMENT | u.SHOW_TEXT | u.SHOW_PROCESSING_INSTRUCTION | u.SHOW_CDATA_SECTION,
      null
    );
  }, ur = function(g) {
    return g = On(g, zt, " "), g = On(g, sn, " "), g = On(g, Qr, " "), g;
  }, hi = function(g) {
    var R;
    g.normalize();
    const H = X.call(
      g.ownerDocument || g,
      g,
      // eslint-disable-next-line no-bitwise
      u.SHOW_TEXT | u.SHOW_COMMENT | u.SHOW_CDATA_SECTION | u.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let Q = H.nextNode();
    for (; Q; )
      Q.data = ur(Q.data), Q = H.nextNode();
    const J = (R = g.querySelectorAll) === null || R === void 0 ? void 0 : R.call(g, "template");
    J && pn(J, (ee) => {
      cn(ee.content) && hi(ee.content);
    });
  }, cr = function(g) {
    const R = N ? N(g) : null;
    return typeof R != "string" || ge(R) !== "form" ? !1 : typeof g.nodeName != "string" || typeof g.textContent != "string" || typeof g.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    g.attributes !== C(g) || typeof g.removeAttribute != "function" || typeof g.setAttribute != "function" || typeof g.namespaceURI != "string" || typeof g.insertBefore != "function" || typeof g.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    g.nodeType !== E(g) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
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
  }, cn = function(g) {
    if (!E || typeof g != "object" || g === null)
      return !1;
    try {
      return E(g) === Ke.documentFragment;
    } catch {
      return !1;
    }
  }, Mn = function(g) {
    if (!E || typeof g != "object" || g === null)
      return !1;
    try {
      return typeof E(g) == "number";
    } catch {
      return !1;
    }
  };
  function dt(G, g, R) {
    G.length !== 0 && pn(G, (H) => {
      H.call(e, g, R, un);
    });
  }
  const Wu = function(g, R) {
    return !!(Et && g.hasChildNodes() && !Mn(g.firstElementChild) && Ce(Bo, g.textContent) && Ce(Bo, g.innerHTML) || Et && g.namespaceURI === ct && R === "style" && Mn(g.firstElementChild) || g.nodeType === Ke.processingInstruction || Et && g.nodeType === Ke.comment && Ce(zo, g.data));
  }, Uu = function(g, R) {
    if (!ae[R] && fo(R) && (U.tagNameCheck instanceof RegExp && Ce(U.tagNameCheck, R) || U.tagNameCheck instanceof Function && U.tagNameCheck(R)))
      return !1;
    if (ii && !ut[R]) {
      const H = _(g), Q = y(g);
      if (Q && H) {
        const J = Q.length;
        for (let ee = J - 1; ee >= 0; --ee) {
          const be = si ? Q[ee] : p(Q[ee], !0);
          H.insertBefore(be, v(g));
        }
      }
    }
    return Ct(g), !0;
  }, uo = function(g, R) {
    if (dt(le.beforeSanitizeElements, g, null), g !== R && _(g) === null)
      return !0;
    if (cr(g))
      return Ct(g), !0;
    const H = ge(N ? N(g) : g.nodeName);
    if (dt(le.uponSanitizeElement, g, {
      tagName: H,
      allowedTags: me
    }), g !== R && _(g) === null)
      return !0;
    if (Wu(g, H))
      return Ct(g), !0;
    if (ae[H] || !(Oe.tagCheck instanceof Function && Oe.tagCheck(H)) && !me[H]) {
      const J = Uu(g, H);
      return J === !1 && dt(le.afterSanitizeElements, g, null), J;
    }
    if ((E ? E(g) : g.nodeType) === Ke.element && !qu(g) || (H === "noscript" || H === "noembed" || H === "noframes") && Ce(zd, g.innerHTML))
      return Ct(g), !0;
    if (xt && g.nodeType === Ke.text) {
      const J = ur(g.textContent);
      g.textContent !== J && (hn(e.removed, {
        element: g.cloneNode()
      }), g.textContent = J);
    }
    return dt(le.afterSanitizeElements, g, null), !1;
  }, co = function(g, R, H) {
    if (Ee[R] || Et && R === "patchsrc" || Et && R === "for" && g !== "label" && g !== "output" || Ys && (R === "id" || R === "name") && (H in t || H in Nu))
      return !1;
    const Q = he[R] || Oe.attributeCheck instanceof Function && Oe.attributeCheck(R, g);
    if (!(wt && Ce(Qn, R))) {
      if (!(lt && Ce(Jr, R))) {
        if (Q) {
          if (!ai[R]) {
            if (!Ce(tr, On(H, er, ""))) {
              if (!((R === "src" || R === "xlink:href" || R === "href") && g !== "script" && Ro(H, "data:") === 0 && Js[g])) {
                if (!(Ge && !Ce(Jn, On(H, er, "")))) {
                  if (H)
                    return !1;
                }
              }
            }
          }
        } else if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          !(fo(g) && (U.tagNameCheck instanceof RegExp && Ce(U.tagNameCheck, g) || U.tagNameCheck instanceof Function && U.tagNameCheck(g)) && (U.attributeNameCheck instanceof RegExp && Ce(U.attributeNameCheck, R) || U.attributeNameCheck instanceof Function && U.attributeNameCheck(R, g)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          R === "is" && U.allowCustomizedBuiltInElements && (U.tagNameCheck instanceof RegExp && Ce(U.tagNameCheck, H) || U.tagNameCheck instanceof Function && U.tagNameCheck(H)))
        ) return !1;
      }
    }
    return !0;
  }, ju = ue({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), fo = function(g) {
    return !ju[Nn(g)] && Ce(In, g);
  }, Gu = function(g, R, H, Q) {
    if (T && typeof d == "object" && typeof d.getAttributeType == "function" && !H)
      switch (d.getAttributeType(g, R)) {
        case "TrustedHTML":
          return F(Q);
        case "TrustedScriptURL":
          return $(Q);
      }
    return Q;
  }, Ku = function(g, R, H, Q) {
    try {
      H ? g.setAttributeNS(H, R, Q) : g.setAttribute(R, Q), cr(g) ? Ct(g) : Ao(e.removed);
    } catch {
      qt(R, g);
    }
  }, po = function(g) {
    dt(le.beforeSanitizeAttributes, g, null);
    const R = g.attributes;
    if (!R || cr(g))
      return;
    const H = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: he,
      forceKeepAttr: void 0
    };
    let Q = R.length;
    const J = ge(g.nodeName);
    for (; Q--; ) {
      const ee = R[Q], be = ee.name, De = ee.namespaceURI, tt = ee.value, Ve = ge(be), nt = tt;
      let Be = be === "value" ? nt : wd(nt);
      if (H.attrName = Ve, H.attrValue = Be, H.keepAttr = !0, H.forceKeepAttr = void 0, dt(le.uponSanitizeAttribute, g, H), Be = H.attrValue, Zs && (Ve === "id" || Ve === "name") && Ro(Be, Qs) !== 0 && (qt(be, g), Be = Qs + Be), Et && Ce(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, Be)) {
        qt(be, g);
        continue;
      }
      if (Ve === "attributename" && Io(Be, "href")) {
        qt(be, g);
        continue;
      }
      if (!H.forceKeepAttr) {
        if (!H.keepAttr) {
          qt(be, g);
          continue;
        }
        if (!Xs && Ce(Fd, Be)) {
          qt(be, g);
          continue;
        }
        if (xt && (Be = ur(Be)), !co(J, Ve, Be)) {
          qt(be, g);
          continue;
        }
        Be = Gu(J, Ve, De, Be), Be !== nt && Ku(g, be, De, Be);
      }
    }
    dt(le.afterSanitizeAttributes, g, null);
  }, dr = function(g) {
    let R = null;
    const H = lo(g);
    for (dt(le.beforeSanitizeShadowDOM, g, null); R = H.nextNode(); )
      if (dt(le.uponSanitizeShadowNode, R, null), uo(R, g), po(R), cn(R.content) && dr(R.content), (E ? E(R) : R.nodeType) === Ke.element) {
        const J = b(R);
        cn(J) && (mi(J), dr(J));
      }
    dt(le.afterSanitizeShadowDOM, g, null);
  }, mi = function(g) {
    const R = [{
      node: g,
      shadow: null
    }];
    for (; R.length > 0; ) {
      const H = R.pop();
      if (H.shadow) {
        dr(H.shadow);
        continue;
      }
      const Q = H.node, ee = (E ? E(Q) : Q.nodeType) === Ke.element, be = y(Q);
      if (be)
        for (let De = be.length - 1; De >= 0; --De)
          R.push({
            node: be[De],
            shadow: null
          });
      if (ee) {
        const De = N ? N(Q) : null;
        if (typeof De == "string" && ge(De) === "template") {
          const tt = Q.content;
          cn(tt) && R.push({
            node: tt,
            shadow: null
          });
        }
      }
      if (ee) {
        const De = b(Q);
        cn(De) && R.push({
          node: null,
          shadow: De
        }, {
          node: De,
          shadow: null
        });
      }
    }
  };
  return e.sanitize = function(G) {
    let g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, R = null, H = null, Q = null, J = null;
    if (li = !G, li && (G = "<!-->"), typeof G != "string" && !Mn(G) && (G = Ed(G), typeof G != "string"))
      throw Vt("dirty is not a string, aborting");
    if (!e.isSupported)
      return G;
    ei ? (me = ti, he = ni) : fi(g), (le.uponSanitizeElement.length > 0 || le.uponSanitizeAttribute.length > 0) && (me = ze(me)), le.uponSanitizeAttribute.length > 0 && (he = ze(he)), e.removed = [];
    const ee = si && typeof G != "string" && Mn(G);
    if (ee) {
      Hu(G);
      const Ve = N ? N(G) : G.nodeName;
      if (typeof Ve == "string") {
        const nt = ge(Ve);
        if (!me[nt] || ae[nt])
          throw lr(G), Vt("root node is forbidden and cannot be sanitized in-place");
      }
      if (cr(G))
        throw lr(G), Vt("root node is clobbered and cannot be sanitized in-place");
      try {
        mi(G);
      } catch (nt) {
        throw lr(G), nt;
      }
    } else if (Mn(G))
      R = ao("<!---->"), H = R.ownerDocument.importNode(G, !0), H.nodeType === Ke.element && H.nodeName === "BODY" || H.nodeName === "HTML" ? R = H : R.appendChild(H), mi(H);
    else {
      if (!on && !xt && !Ft && // eslint-disable-next-line unicorn/prefer-includes
      G.indexOf("<") === -1)
        return T && sr ? F(G) : G;
      if (R = ao(G), !R)
        return on ? null : sr ? x : "";
    }
    R && ri && Ct(R.firstChild);
    const be = ee ? G : R, De = lo(be);
    try {
      for (; Q = De.nextNode(); )
        uo(Q, be), po(Q), cn(Q.content) && dr(Q.content);
    } catch (Ve) {
      throw ee && (lr(G), pn(e.removed, (nt) => {
        nt.element && pi(nt.element);
      })), Ve;
    }
    if (ee)
      return pn(e.removed, (Ve) => {
        Ve.element && pi(Ve.element);
      }), xt && hi(G), G;
    if (on) {
      if (xt && hi(R), ir)
        for (J = se.call(R.ownerDocument); R.firstChild; )
          J.appendChild(R.firstChild);
      else
        J = R;
      return (he.shadowroot || he.shadowrootmode) && (J = we.call(r, J, !0)), J;
    }
    let tt = Ft ? R.outerHTML : R.innerHTML;
    return Ft && me["!doctype"] && R.ownerDocument && R.ownerDocument.doctype && R.ownerDocument.doctype.name && Ce(Nd, R.ownerDocument.doctype.name) && (tt = "<!DOCTYPE " + R.ownerDocument.doctype.name + `>
` + tt), xt && (tt = ur(tt)), T && sr ? F(tt) : tt;
  }, e.setConfig = function() {
    let G = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    fi(G), ei = !0, ti = me, ni = he;
  }, e.clearConfig = function() {
    un = null, ei = !1, ti = null, ni = null, T = S, x = "";
  }, e.isValidAttribute = function(G, g, R) {
    un || fi({});
    const H = ge(G), Q = ge(g);
    return co(H, Q, R);
  }, e.addHook = function(G, g) {
    typeof g == "function" && Ae(le, G) && hn(le[G], g);
  }, e.removeHook = function(G, g) {
    if (Ae(le, G)) {
      if (g !== void 0) {
        const R = bd(le[G], g);
        return R === -1 ? void 0 : kd(le[G], R, 1)[0];
      }
      return Ao(le[G]);
    }
  }, e.removeHooks = function(G) {
    Ae(le, G) && (le[G] = []);
  }, e.removeAllHooks = function() {
    le = Fo();
  }, e;
}
var el = Ja();
de.setOptions({ gfm: !0, breaks: !1 });
function Hd(n) {
  if (!n) return "";
  const e = de.parse(n, { async: !1 });
  return el.sanitize(e);
}
function Wd(n) {
  if (!n) return [];
  const e = de.lexer(n), t = [];
  let r = [];
  const i = () => {
    if (r.length === 0) return;
    const s = r;
    s.links = e.links, t.push({ type: "html", html: el.sanitize(de.parser(s)) }), r = [];
  };
  for (const s of e)
    s.type === "code" ? (i(), t.push({ type: "code", code: s.text, lang: s.lang ?? "" })) : r.push(s);
  return i(), t;
}
function Ud(n, e = 250) {
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
function qn(n) {
  const e = Math.floor(n), t = Math.floor(e / 3600), r = Math.floor(e % 3600 / 60), i = e % 60, s = String(r).padStart(2, "0"), o = String(i).padStart(2, "0");
  return t > 0 ? `${t}:${s}:${o}` : `${s}:${o}`;
}
function jd(n, e) {
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
function Kd(n, e) {
  const t = Gd(n);
  return t ? new Intl.DateTimeFormat(e, {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(t) : "";
}
function Xd(n, e) {
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
class He extends Error {
  path;
  constructor(e, t) {
    super(`${e}: ${t}`), this.name = "DocumentValidationError", this.path = e;
  }
}
function Yd(n) {
  if (n == null || typeof n != "object")
    throw new He("document", "must be a non-null object");
  const e = n;
  if (typeof e.title != "string")
    throw new He("document.title", "must be a string");
  if (!(e.speakers instanceof Map))
    throw new He("document.speakers", "must be a Map");
  if (!Array.isArray(e.channels))
    throw new He("document.channels", "must be an array");
  for (let t = 0; t < e.channels.length; t++) {
    const r = e.channels[t], i = `channels[${t}]`;
    if (r == null || typeof r != "object")
      throw new He(i, "must be a non-null object");
    if (typeof r.id != "string")
      throw new He(`${i}.id`, "must be a string");
    if (typeof r.name != "string")
      throw new He(`${i}.name`, "must be a string");
    if (typeof r.duration != "number")
      throw new He(`${i}.duration`, "must be a number");
    if (!Array.isArray(r.translations))
      throw new He(`${i}.translations`, "must be an array");
    for (let s = 0; s < r.translations.length; s++) {
      const o = r.translations[s], a = `${i}.translations[${s}]`;
      if (o == null || typeof o != "object")
        throw new He(a, "must be a non-null object");
      if (typeof o.id != "string")
        throw new He(`${a}.id`, "must be a string");
      if (!Array.isArray(o.languages))
        throw new He(`${a}.languages`, "must be an array");
      if (typeof o.isSource != "boolean")
        throw new He(`${a}.isSource`, "must be a boolean");
      if (!Array.isArray(o.turns))
        throw new He(`${a}.turns`, "must be an array");
    }
  }
}
function Zd(n) {
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
function Qd(n, e) {
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
function Jd(n) {
  return n.some((e) => e.startTime != null);
}
function ef(n) {
  for (const e of n) if (e.startTime != null) return e.startTime;
}
function tf(n) {
  for (let e = n.length - 1; e >= 0; e--) {
    const t = n[e].endTime;
    if (t != null) return t;
  }
}
const nf = 1;
function tl(n, e) {
  for (const t of n)
    if (!(t.startTime == null || t.endTime == null) && t.startTime - nf <= e && e <= t.endTime)
      return t.id;
  return null;
}
function d1(n = {}) {
  const e = P(""), t = P(null), r = P(n.activeChannelId ?? ""), i = P(
    n.capabilities ?? { text: "edit", speakers: "edit" }
  ), { on: s, off: o, emit: a, clear: u } = cc(), l = fc(a), c = l, d = Un(/* @__PURE__ */ new Map()), f = A(
    () => d.get(r.value) ?? [...d.values()][0]
  );
  function p(T, x) {
    return s(T, (S) => {
      const w = f.value;
      w && S.translationId === w.activeTranslation.value.id && x(S);
    });
  }
  function m(T) {
    e.value = T.title, t.value = T.date ?? null, l.clear();
    for (const x of d.values()) x.dispose();
    d.clear();
    for (const x of kc(T))
      c.ensure(x.id, x.name);
    for (const x of T.channels)
      d.set(x.id, go(x, a, s, c.ensure));
    d.size > 0 && !d.has(r.value) && (r.value = d.keys().next().value);
  }
  function v(T) {
    Yd(T), m(T), a("document:change", void 0);
  }
  function y(T) {
    T !== r.value && (r.value = T, a("channel:change", { channelId: T }));
  }
  function _(T, x) {
    if (d.has(T)) {
      for (const S of x.translations)
        Fi(S.turns, c.ensure);
      d.get(T)?.dispose(), d.set(T, go(x, a, s, c.ensure)), a("channel:sync", { channelId: T });
    }
  }
  const b = [];
  function C(T) {
    const x = T.install(N);
    x && b.push(x);
  }
  function E() {
    a("destroy", void 0), b.forEach((T) => T()), b.length = 0;
    for (const T of d.values()) T.dispose();
    u();
  }
  n.document && m(n.document);
  const N = {
    title: e,
    date: t,
    activeChannelId: r,
    capabilities: i,
    speakers: c,
    channels: d,
    activeChannel: f,
    onActiveTranslation: p,
    setDocument: v,
    setActiveChannel: y,
    setChannel: _,
    on: s,
    off: o,
    emit: a,
    use: C,
    destroy: E
  };
  return N;
}
const nl = /* @__PURE__ */ Symbol("core");
function f1(n) {
  Sn(nl, n);
}
function Pe() {
  const n = jn(nl);
  if (!n)
    throw new Error("useCore() requires a parent provideCore()");
  return n;
}
const rf = (n) => {
  for (const e in n)
    if (e.startsWith("aria-") || e === "role" || e === "title")
      return !0;
  return !1;
};
const qo = (n) => n === "";
const sf = (...n) => n.filter((e, t, r) => !!e && e.trim() !== "" && r.indexOf(e) === t).join(" ").trim();
const Vo = (n) => n.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const of = (n) => n.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (e, t, r) => r ? r.toUpperCase() : t.toLowerCase()
);
const af = (n) => {
  const e = of(n);
  return e.charAt(0).toUpperCase() + e.slice(1);
};
var Ln = {
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
const lf = ({
  name: n,
  iconNode: e,
  absoluteStrokeWidth: t,
  "absolute-stroke-width": r,
  strokeWidth: i,
  "stroke-width": s,
  size: o = Ln.width,
  color: a = Ln.stroke,
  ...u
}, { slots: l }) => Tt(
  "svg",
  {
    ...Ln,
    ...u,
    width: o,
    height: o,
    stroke: a,
    "stroke-width": qo(t) || qo(r) || t === !0 || r === !0 ? Number(i || s || Ln["stroke-width"]) * 24 / Number(o) : i || s || Ln["stroke-width"],
    class: sf(
      "lucide",
      u.class,
      ...n ? [`lucide-${Vo(af(n))}-icon`, `lucide-${Vo(n)}`] : ["lucide-icon"]
    ),
    ...!l.default && !rf(u) && { "aria-hidden": "true" }
  },
  [...e.map((c) => Tt(...c)), ...l.default ? [l.default()] : []]
);
const te = (n, e) => (t, { slots: r, attrs: i }) => Tt(
  lf,
  {
    ...i,
    ...t,
    iconNode: e,
    name: n
  },
  r
);
const uf = te("arrow-down", [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
]);
const cf = te("bold", [
  [
    "path",
    { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8", key: "mg9rjx" }
  ]
]);
const rl = te("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
const df = te("chevron-down", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
const ff = te("clipboard-list", [
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
const pf = te("clipboard-type", [
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
const hf = te("code-xml", [
  ["path", { d: "m18 16 4-4-4-4", key: "1inbqp" }],
  ["path", { d: "m6 8-4 4 4 4", key: "15zrgr" }],
  ["path", { d: "m14.5 4-5 16", key: "e7oirm" }]
]);
const mf = te("code", [
  ["path", { d: "m16 18 6-6-6-6", key: "eg8j8" }],
  ["path", { d: "m8 6-6 6 6 6", key: "ppft3o" }]
]);
const vf = te("copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
const gf = te("download", [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
]);
const yf = te("ellipsis-vertical", [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
]);
const bf = te("file-text", [
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
const kf = te("heading-1", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "m17 12 3-2v8", key: "1hhhft" }]
]);
const wf = te("heading-2", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1", key: "9jr5yi" }]
]);
const Tf = te("heading-3", [
  ["path", { d: "M4 12h8", key: "17cfdx" }],
  ["path", { d: "M4 18V6", key: "1rz3zl" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ["path", { d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2", key: "68ncm8" }],
  ["path", { d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2", key: "1ejuhz" }]
]);
const Sf = te("italic", [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
]);
const _f = te("list-ordered", [
  ["path", { d: "M11 5h10", key: "1cz7ny" }],
  ["path", { d: "M11 12h10", key: "1438ji" }],
  ["path", { d: "M11 19h10", key: "11t30w" }],
  ["path", { d: "M4 4h1v5", key: "10yrso" }],
  ["path", { d: "M4 9h2", key: "r1h2o0" }],
  ["path", { d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02", key: "xtkcd5" }]
]);
const xf = te("list", [
  ["path", { d: "M3 5h.01", key: "18ugdj" }],
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 19h.01", key: "noohij" }],
  ["path", { d: "M8 5h13", key: "1pao27" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 19h13", key: "m83p4d" }]
]);
const Ho = te("loader-circle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
const Ef = te("maximize", [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
]);
const Cf = te("merge", [
  ["path", { d: "m8 6 4-4 4 4", key: "ybng9g" }],
  ["path", { d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22", key: "1hyw0i" }],
  ["path", { d: "m20 22-5-5", key: "1m27yz" }]
]);
const Af = te("message-circle", [
  [
    "path",
    {
      d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
      key: "1sd12s"
    }
  ]
]);
const If = te("minimize", [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
]);
const il = te("pause", [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
]);
const Rf = te("pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
const sl = te("play", [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
]);
const Mf = te("plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
]);
const Pf = te("quote", [
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
const Of = te("redo-2", [
  ["path", { d: "m15 14 5-5-5-5", key: "12vg1m" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13", key: "6uklza" }]
]);
const Df = te("refresh-cw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
const Lf = te("save", [
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
const $f = te("send-horizontal", [
  [
    "path",
    {
      d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
      key: "117uat"
    }
  ],
  ["path", { d: "M6 12h16", key: "s4cdu5" }]
]);
const Nf = te("settings", [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
const ol = te("skip-back", [
  [
    "path",
    {
      d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
      key: "15892j"
    }
  ],
  ["path", { d: "M3 20V4", key: "1ptbpl" }]
]);
const al = te("skip-forward", [
  ["path", { d: "M21 4v16", key: "7j8fe9" }],
  [
    "path",
    {
      d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
      key: "zs4d6"
    }
  ]
]);
const Bf = te("sparkles", [
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
const zf = te("table", [
  ["path", { d: "M12 3v18", key: "108xh3" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }]
]);
const Ff = te("trash-2", [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
]);
const qf = te("triangle-alert", [
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
const Vf = te("undo-2", [
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11", key: "f3b9sd" }]
]);
const Hf = te("user-plus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
]);
const Wf = te("users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
]);
const ll = te("volume-2", [
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
const ul = te("volume-x", [
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
const ys = te("x", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]), Uf = {
  "arrow-down": uf,
  warning: qf,
  bold: cf,
  check: rl,
  "chevron-down": df,
  "clipboard-list": ff,
  "clipboard-type": pf,
  code: mf,
  "code-block": hf,
  copy: vf,
  download: gf,
  "heading-1": kf,
  "heading-2": wf,
  "heading-3": Tf,
  italic: Sf,
  list: xf,
  "list-ordered": _f,
  maximize: Ef,
  merge: Cf,
  minimize: If,
  pause: il,
  play: sl,
  quote: Pf,
  redo: Of,
  table: zf,
  save: Lf,
  settings: Nf,
  "skip-back": ol,
  "skip-forward": al,
  undo: Vf,
  users: Wf,
  volume: ll,
  "volume-mute": ul,
  x: ys,
  "circle-notch": Ho,
  spinner: Ho,
  "more-vertical": yf,
  "user-plus": Hf,
  plus: Mf,
  pencil: Rf,
  trash: Ff,
  send: $f,
  "file-text": bf,
  "message-circle": Af,
  "refresh-cw": Df,
  sparkles: Bf
};
function Rr(n) {
  if (n)
    return Uf[n];
}
const cl = {
  sm: 16,
  md: 20,
  lg: 24
}, jf = {
  key: 1,
  class: "editor-icon editor-icon--missing",
  "aria-hidden": "true"
}, Gf = /* @__PURE__ */ j({
  __name: "EditorIcon",
  props: {
    name: {},
    size: {},
    spin: { type: Boolean }
  },
  setup(n) {
    const e = n, t = A(() => Rr(e.name)), r = A(
      () => e.size != null ? { width: `${e.size}px`, height: `${e.size}px` } : void 0
    );
    return (i, s) => t.value ? (k(), V(Ia(t.value), {
      key: 0,
      style: Yt(r.value),
      class: Se(["editor-icon", { "editor-icon--spin": n.spin }]),
      "aria-hidden": "true"
    }, null, 8, ["style", "class"])) : (k(), L("span", jf, "?"));
  }
}), ie = (n, e) => {
  const t = n.__vccOpts || n;
  for (const [r, i] of e)
    t[r] = i;
  return t;
}, Ye = /* @__PURE__ */ ie(Gf, [["__scopeId", "data-v-210c7f09"]]), Kf = ["type", "disabled", "aria-disabled", "aria-label"], Xf = {
  key: 3,
  class: "editor-btn__label"
}, Yf = /* @__PURE__ */ j({
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
    const e = n, t = Xu(), r = A(() => !!Rr(e.icon)), i = A(() => !!Rr(e.iconRight)), s = A(() => cl[e.size]), o = A(() => e.disabled || e.loading), a = A(() => !!e.label || !!t.default), u = A(
      () => e.loading || r.value || !!t.icon
    ), l = A(() => u.value && !a.value), c = A(() => [
      "editor-btn",
      `editor-btn--${e.variant}`,
      `editor-btn--${e.intent}`,
      `editor-btn--${e.size}`,
      l.value && "editor-btn--icon-only",
      e.block && "editor-btn--block"
    ]);
    return (d, f) => (k(), L("button", {
      type: n.type,
      class: Se(c.value),
      disabled: o.value,
      "aria-disabled": o.value,
      "aria-label": n.ariaLabel
    }, [
      n.loading ? (k(), V(Ye, {
        key: 0,
        name: "spinner",
        spin: "",
        size: s.value
      }, null, 8, ["size"])) : r.value ? (k(), V(Ye, {
        key: 1,
        name: n.icon,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots.icon ? Z(d.$slots, "icon", { key: 2 }, void 0, !0) : Y("", !0),
      a.value ? (k(), L("span", Xf, [
        Z(d.$slots, "default", {}, () => [
          pe(K(n.label), 1)
        ], !0)
      ])) : Y("", !0),
      i.value ? (k(), V(Ye, {
        key: 4,
        name: n.iconRight,
        size: s.value
      }, null, 8, ["name", "size"])) : d.$slots["icon-right"] ? Z(d.$slots, "icon-right", { key: 5 }, void 0, !0) : Y("", !0)
    ], 10, Kf));
  }
}), ne = /* @__PURE__ */ ie(Yf, [["__scopeId", "data-v-d554746d"]]), dl = {
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
}, Zf = {
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
}, Wo = { fr: dl, en: Zf }, fl = /* @__PURE__ */ Symbol("i18n");
function pl(n, e) {
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
function p1(n) {
  const e = A(() => {
    const r = Wo[n.value] ?? Wo.fr;
    return (i, s) => pl(r[i] ?? i, s);
  }), t = {
    t: (r, i) => e.value(r, i),
    locale: n
  };
  return Sn(fl, t), t;
}
function fe() {
  const n = jn(fl);
  if (n) return n;
  const e = A(() => "fr");
  return {
    t: (t, r) => pl(dl[t] ?? t, r),
    locale: e
  };
}
const Qf = { class: "editor-header" }, Jf = { class: "header-main" }, ep = { class: "document-title" }, tp = {
  key: 0,
  class: "document-meta"
}, np = { class: "header-right" }, rp = { key: 0 }, ip = /* @__PURE__ */ j({
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
    const e = n, { t, locale: r } = fe(), i = A(() => e.title.replace(/-/g, " ")), s = A(
      () => e.date != null ? Kd(e.date, r.value) : ""
    ), o = A(
      () => Xd(e.duration, r.value)
    ), a = A(
      () => t("header.speakerCount", { count: e.speakerCount })
    ), u = A(
      () => [
        s.value,
        o.value,
        a.value
      ].filter(Boolean)
    );
    return (l, c) => (k(), L("header", Qf, [
      B("div", Jf, [
        B("h1", ep, K(i.value), 1),
        u.value.length ? (k(), L("div", tp, [
          (k(!0), L(ye, null, qe(u.value, (d, f) => (k(), L("span", {
            key: f,
            class: "document-meta__part"
          }, K(d), 1))), 128))
        ])) : Y("", !0)
      ]),
      B("div", np, [
        n.isMobile ? (k(), V(ne, {
          key: 0,
          variant: "transparent",
          "aria-label": h(t)("header.openSidebar"),
          onClick: c[0] || (c[0] = (d) => l.$emit("toggleSidebar"))
        }, {
          icon: z(() => [
            q(Ye, {
              name: "users",
              size: 16
            })
          ]),
          _: 1
        }, 8, ["aria-label"])) : Y("", !0),
        q(ne, {
          variant: "primary",
          "aria-label": h(t)("header.ask"),
          disabled: !e.canAsk,
          onClick: c[1] || (c[1] = (d) => l.$emit("openChat"))
        }, {
          icon: z(() => [
            q(Ye, {
              name: "sparkles",
              size: 16
            })
          ]),
          default: z(() => [
            n.isMobile ? Y("", !0) : (k(), L("span", rp, K(h(t)("header.ask")), 1))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), sp = /* @__PURE__ */ ie(ip, [["__scopeId", "data-v-cc84adfc"]]), op = ["aria-label"], ap = /* @__PURE__ */ j({
  __name: "Badge",
  props: {
    ariaLabel: {}
  },
  setup(n) {
    return (e, t) => (k(), L("span", {
      class: "editor-badge",
      "aria-label": n.ariaLabel
    }, [
      Z(e.$slots, "default", {}, void 0, !0)
    ], 8, op));
  }
}), lp = /* @__PURE__ */ ie(ap, [["__scopeId", "data-v-732d4c24"]]), up = ["aria-label"], cp = ["aria-selected", "aria-disabled", "disabled", "onClick"], dp = { class: "tab__label" }, fp = /* @__PURE__ */ j({
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
    return (s, o) => (k(), L("div", {
      class: "tabs",
      role: "tablist",
      "aria-label": n.ariaLabel
    }, [
      (k(!0), L(ye, null, qe(n.tabs, (a) => (k(), L("button", {
        key: a.value,
        type: "button",
        role: "tab",
        class: Se(["tab", { "tab--active": a.value === n.modelValue }]),
        "aria-selected": a.value === n.modelValue,
        "aria-disabled": a.disabled || void 0,
        disabled: a.disabled,
        onClick: (u) => i(a)
      }, [
        h(Rr)(a.icon) ? (k(), V(Ye, {
          key: 0,
          name: a.icon,
          size: 16,
          class: "tab__icon"
        }, null, 8, ["name"])) : Y("", !0),
        B("span", dp, K(a.label), 1),
        a.badge ? (k(), V(lp, {
          key: 1,
          class: "tab__badge"
        }, {
          default: z(() => [
            pe(K(a.badge), 1)
          ]),
          _: 2
        }, 1024)) : Y("", !0)
      ], 10, cp))), 128))
    ], 8, up));
  }
}), pp = /* @__PURE__ */ ie(fp, [["__scopeId", "data-v-24f9730e"]]), yn = "__transcription__", kr = "__verbatim__", hp = /* @__PURE__ */ j({
  __name: "TabBar",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Pe(), { t: s } = fe(), o = A(() => {
      const u = i.llmServices?.list.value ?? [];
      return [
        {
          value: yn,
          label: s("tabs.transcription"),
          icon: "message-circle"
        },
        {
          value: kr,
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
    return (u, l) => h(i).llmServices ? (k(), V(pp, {
      key: 0,
      tabs: o.value,
      "model-value": n.modelValue,
      "onUpdate:modelValue": a
    }, null, 8, ["tabs", "model-value"])) : Y("", !0);
  }
}), wi = {
  damping: 0.7,
  stiffness: 0.05,
  mass: 1.25
}, mp = 70, vp = 1e3 / 60, gp = 350;
let wr = !1, Uo = !1;
function yp() {
  Uo || typeof document > "u" || (document.addEventListener("mousedown", () => {
    wr = !0;
  }), document.addEventListener("mouseup", () => {
    wr = !1;
  }), document.addEventListener("click", () => {
    wr = !1;
  }), Uo = !0);
}
const Ti = /* @__PURE__ */ new Map();
function Si(...n) {
  const e = {
    damping: wi.damping,
    stiffness: wi.stiffness,
    mass: wi.mass
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
  return Ti.has(r) || Ti.set(r, Object.freeze({ ...e })), t ? "instant" : Ti.get(r);
}
function bp(n = {}) {
  yp();
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
    const I = s();
    for (const D of t) D(I);
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
  function a(I) {
    r.scrollElement && (r.scrollElement.scrollTop = I, r.ignoreScrollToTop = r.scrollElement.scrollTop);
  }
  function u() {
    const I = r.scrollElement, D = r.contentElement;
    return !I || !D ? 0 : I.scrollHeight - 1 - I.clientHeight;
  }
  let l;
  function c() {
    const I = r.scrollElement, D = r.contentElement;
    if (!I || !D)
      return 0;
    const F = u();
    if (!e.targetScrollTop)
      return F;
    if (l?.targetScrollTop === F)
      return l.calculatedScrollTop;
    const $ = Math.max(
      Math.min(
        e.targetScrollTop(F, {
          scrollElement: I,
          contentElement: D
        }),
        F
      ),
      0
    );
    return l = { targetScrollTop: F, calculatedScrollTop: $ }, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
      l = void 0;
    }), $;
  }
  function d() {
    return c() - o();
  }
  function f() {
    return d() <= mp;
  }
  function p(I) {
    r.isAtBottom = I, i();
  }
  function m(I) {
    r.escapedFromLock = I, i();
  }
  function v(I) {
    r.isNearBottom = I, i();
  }
  function y() {
    if (!wr || typeof window > "u")
      return !1;
    const I = window.getSelection?.();
    if (!I || !I.rangeCount)
      return !1;
    const D = I.getRangeAt(0), F = r.scrollElement;
    if (!F)
      return !1;
    const $ = D.commonAncestorContainer;
    return !!($ && (F.contains($) || $.contains(F)));
  }
  const _ = (I) => {
    if (I.target !== r.scrollElement)
      return;
    const D = o(), F = r.ignoreScrollToTop;
    let $ = r.lastScrollTop ?? D;
    r.lastScrollTop = D, r.ignoreScrollToTop = void 0, F && F > D && ($ = F), v(f()), setTimeout(() => {
      if (r.resizeDifference || D === F)
        return;
      if (y()) {
        m(!0), p(!1);
        return;
      }
      const O = D > $, M = D < $;
      if (r.animation?.ignoreEscapes) {
        a($);
        return;
      }
      M && (m(!0), p(!1)), O && m(!1), !r.escapedFromLock && f() && p(!0);
    }, 1);
  }, b = (I) => {
    const D = r.scrollElement;
    if (!D)
      return;
    let F = I.target;
    for (; F && !["scroll", "auto"].includes(getComputedStyle(F).overflow); ) {
      if (!F.parentElement)
        return;
      F = F.parentElement;
    }
    F === D && I.deltaY < 0 && D.scrollHeight > D.clientHeight && !r.animation?.ignoreEscapes && (m(!0), p(!1));
  };
  function C(I, D) {
    E(), r.scrollElement = I, r.contentElement = D, getComputedStyle(I).overflow === "visible" && (I.style.overflow = "auto"), I.addEventListener("scroll", _, { passive: !0 }), I.addEventListener("wheel", b, { passive: !0 });
    let F;
    r.resizeObserver = new ResizeObserver(($) => {
      const O = $[0];
      if (!O)
        return;
      const { height: M } = O.contentRect, W = M - (F ?? M);
      if (r.resizeDifference = W, o() > u() && a(u()), v(f()), W >= 0) {
        const X = Si(
          e,
          F ? e.resize : e.initial
        );
        x({
          animation: X,
          wait: !0,
          preserveScrollPosition: !0,
          duration: X === "instant" ? void 0 : gp
        });
      } else
        f() && (m(!1), p(!0));
      F = M, typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        setTimeout(() => {
          r.resizeDifference === W && (r.resizeDifference = 0);
        }, 1);
      });
    }), r.resizeObserver.observe(D);
  }
  function E() {
    r.scrollElement && (r.scrollElement.removeEventListener("scroll", _), r.scrollElement.removeEventListener("wheel", b)), r.resizeObserver?.disconnect(), r.resizeObserver = void 0, r.scrollElement = void 0, r.contentElement = void 0;
  }
  function N() {
    E(), t.clear();
  }
  function T(I) {
    e = { ...e, ...I };
  }
  function x(I = {}) {
    const D = typeof I == "string" ? { animation: I } : I;
    D.preserveScrollPosition || p(!0);
    const F = Date.now() + (Number(D.wait) || 0), $ = Si(e, D.animation), { ignoreEscapes: O = !1 } = D;
    let M, W = c();
    D.duration instanceof Promise ? D.duration.finally(() => {
      M = Date.now();
    }) : M = F + (D.duration ?? 0);
    const X = async () => {
      const se = new Promise((oe) => {
        if (typeof requestAnimationFrame > "u") {
          oe(!1);
          return;
        }
        requestAnimationFrame(() => oe(!0));
      }).then(() => {
        if (!r.isAtBottom)
          return r.animation = void 0, !1;
        const oe = o(), we = typeof performance < "u" ? performance.now() : Date.now(), le = (we - (r.lastTick ?? we)) / vp;
        if (r.animation ||= { behavior: $, promise: se, ignoreEscapes: O }, r.animation.behavior === $ && (r.lastTick = we), y() || F > Date.now())
          return X();
        if (oe < Math.min(W, c())) {
          if (r.animation?.behavior === $) {
            if ($ === "instant")
              return a(c()), X();
            const zt = $;
            r.velocity = (zt.damping * r.velocity + zt.stiffness * d()) / zt.mass, r.accumulated += r.velocity * le;
            const sn = o();
            a(sn + r.accumulated), o() !== sn && (r.accumulated = 0);
          }
          return X();
        }
        return M > Date.now() ? (W = c(), X()) : (r.animation = void 0, o() < c() ? x({
          animation: Si(e, e.resize),
          ignoreEscapes: O,
          duration: Math.max(0, M - Date.now()) || void 0
        }) : r.isAtBottom);
      });
      return se.then((oe) => (typeof requestAnimationFrame < "u" && requestAnimationFrame(() => {
        r.animation || (r.lastTick = void 0, r.velocity = 0);
      }), oe));
    };
    return D.wait !== !0 && (r.animation = void 0), r.animation?.behavior === $ ? r.animation.promise : X();
  }
  const S = () => {
    m(!0), p(!1);
  };
  function w(I) {
    return t.add(I), () => t.delete(I);
  }
  return {
    attach: C,
    detach: E,
    destroy: N,
    setOptions: T,
    getState: s,
    onChange: w,
    scrollToBottom: x,
    stopScroll: S
  };
}
function hl(n = {}) {
  const e = P(null), t = P(null), r = P(n.initial !== !1), i = P(!1), s = P(!1), o = bp(n);
  let a = null;
  return et((u) => {
    !e.value || !t.value || (o.attach(e.value, t.value), a = o.onChange((l) => {
      r.value = l.isAtBottom, i.value = l.isNearBottom, s.value = l.escapedFromLock;
    }), u(() => {
      a?.(), a = null, o.detach();
    }));
  }), bt(() => {
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
const kp = /* @__PURE__ */ Symbol("StickToBottom"), wp = { style: { position: "relative", height: "100%", width: "100%", flex: "1", "min-height": "0" } }, Tp = /* @__PURE__ */ j({
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
    const t = n, { scrollRef: r, contentRef: i, isAtBottom: s, isNearBottom: o, escapedFromLock: a, scrollToBottom: u, stopScroll: l, setOptions: c } = hl({
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
    Sn(kp, d), e(d), re(
      () => [
        t.resize,
        t.initial,
        t.damping,
        t.stiffness,
        t.mass,
        t.targetScrollTop
      ],
      () => {
        c({
          resize: t.resize,
          initial: t.initial,
          targetScrollTop: t.targetScrollTop,
          damping: t.damping,
          stiffness: t.stiffness,
          mass: t.mass
        });
      },
      { flush: "post" }
    );
    const f = A(() => t.anchor ?? "auto"), p = A(() => ({
      isAtBottom: s.value,
      isNearBottom: o.value,
      escapedFromLock: a.value,
      scrollToBottom: u,
      stopScroll: l
    }));
    return (m, v) => (k(), L("div", null, [
      B("div", wp, [
        B("div", {
          ref_key: "scrollRef",
          ref: r,
          style: Yt({
            "overflow-anchor": f.value,
            overflow: "auto",
            height: "100%",
            width: "100%",
            "scrollbar-gutter": "stable both-edges"
          })
        }, [
          B("div", {
            ref_key: "contentRef",
            ref: i
          }, [
            Z(m.$slots, "default", mt(Ot(p.value)))
          ], 512)
        ], 4),
        Z(m.$slots, "overlay", mt(Ot(p.value)))
      ]),
      Z(m.$slots, "after", mt(Ot(p.value)))
    ]));
  }
}), Sp = /* @__PURE__ */ j({
  __name: "SpeakerIndicator",
  props: {
    color: {}
  },
  setup(n) {
    return (e, t) => (k(), L("span", {
      class: "speaker-indicator",
      style: Yt({ backgroundColor: n.color }),
      "aria-hidden": "true"
    }, null, 4));
  }
}), bs = /* @__PURE__ */ ie(Sp, [["__scopeId", "data-v-9bffeda8"]]), _p = ["datetime"], xp = {
  key: 2,
  class: "lang"
}, Ep = /* @__PURE__ */ j({
  __name: "SpeakerLabel",
  props: {
    speaker: {},
    startTime: {},
    startDate: {},
    language: {},
    interactive: { type: Boolean }
  },
  setup(n) {
    const e = n, { t, locale: r } = fe(), i = A(
      () => Fa(
        e.language,
        r.value,
        t("language.wildcard")
      )
    ), s = A(() => {
      if (e.startTime != null)
        return {
          text: qn(e.startTime),
          datetime: `PT${e.startTime.toFixed(1)}S`
        };
      if (e.startDate != null) {
        const u = new Date(e.startDate * 1e3);
        return {
          text: jd(e.startDate, r.value),
          datetime: u.toISOString()
        };
      }
      return null;
    }), o = A(() => e.speaker?.color ?? "transparent"), a = A(() => e.speaker?.name ?? t("speaker.unknown"));
    return (u, l) => (k(), L("div", {
      class: Se(["speaker-label", { "speaker-label--interactive": n.interactive }])
    }, [
      n.speaker ? (k(), V(bs, {
        key: 0,
        color: o.value
      }, null, 8, ["color"])) : Y("", !0),
      B("span", {
        class: Se(["speaker-name", { "speaker-name--unknown": !n.speaker }])
      }, K(a.value), 3),
      s.value ? (k(), L("time", {
        key: 1,
        class: "timestamp",
        datetime: s.value.datetime
      }, K(s.value.text), 9, _p)) : Y("", !0),
      i.value ? (k(), L("span", xp, K(i.value), 1)) : Y("", !0)
    ], 2));
  }
}), _i = /* @__PURE__ */ ie(Ep, [["__scopeId", "data-v-075a5b82"]]);
function jo(n) {
  return typeof n == "string" ? `'${n}'` : new Cp().serialize(n);
}
const Cp = /* @__PURE__ */ (function() {
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
function ji(n, e) {
  return n === e || jo(n) === jo(e);
}
function at(n, e) {
  const t = typeof n == "string" && !e ? `${n}Context` : e, r = Symbol(t);
  return [(o) => {
    const a = jn(r, o);
    if (a || a === null) return a;
    throw new Error(`Injection \`${r.toString()}\` not found. Component must be used within ${Array.isArray(n) ? `one of the following components: ${n.join(", ")}` : `\`${n}\``}`);
  }, (o) => (Sn(r, o), o)];
}
function Ue() {
  let n = document.activeElement;
  if (n == null) return null;
  for (; n != null && n.shadowRoot != null && n.shadowRoot.activeElement != null; ) n = n.shadowRoot.activeElement;
  return n;
}
function ml(n, e, t) {
  const r = t.originalEvent.target, i = new CustomEvent(n, {
    bubbles: !1,
    cancelable: !0,
    detail: t
  });
  e && r.addEventListener(n, e, { once: !0 }), r.dispatchEvent(i);
}
function Mr(n) {
  return n == null;
}
function Go(n, e) {
  return Mr(n) ? !1 : Array.isArray(n) ? n.some((t) => ji(t, e)) : ji(n, e);
}
function ks(n) {
  return n ? n.flatMap((e) => e.type === ye ? ks(e.children) : [e]) : [];
}
const Ap = ["INPUT", "TEXTAREA"];
function Ip(n, e, t, r = {}) {
  if (!e || r.enableIgnoredElement && Ap.includes(e.nodeName)) return null;
  const { arrowKeyOptions: i = "both", attributeName: s = "[data-reka-collection-item]", itemsArray: o = [], loop: a = !0, dir: u = "ltr", preventScroll: l = !0, focus: c = !1 } = r, [d, f, p, m, v, y] = [
    n.key === "ArrowRight",
    n.key === "ArrowLeft",
    n.key === "ArrowUp",
    n.key === "ArrowDown",
    n.key === "Home",
    n.key === "End"
  ], _ = p || m, b = d || f;
  if (!v && !y && (!_ && !b || i === "vertical" && b || i === "horizontal" && _)) return null;
  const C = t ? Array.from(t.querySelectorAll(s)) : o;
  if (!C.length) return null;
  l && n.preventDefault();
  let E = null;
  return b || _ ? E = vl(C, e, {
    goForward: _ ? m : u === "ltr" ? d : f,
    loop: a
  }) : v ? E = C.at(0) || null : y && (E = C.at(-1) || null), c && E?.focus(), E;
}
function vl(n, e, t, r = n.length) {
  if (--r === 0) return null;
  const i = n.indexOf(e), s = t.goForward ? i + 1 : i - 1;
  if (!t.loop && (s < 0 || s >= n.length)) return null;
  const o = (s + n.length) % n.length, a = n[o];
  return a ? a.hasAttribute("disabled") && a.getAttribute("disabled") !== "false" ? vl(n, a, t, r) : a : null;
}
const [ws] = at("ConfigProvider");
function Rp(n, e) {
  var t;
  const r = Dt();
  return et(() => {
    r.value = n();
  }, {
    ...e,
    flush: (t = e?.flush) !== null && t !== void 0 ? t : "sync"
  }), Zu(r);
}
function gl(n, e) {
  return Ma() ? (Pa(n, e), !0) : !1;
}
// @__NO_SIDE_EFFECTS__
function Mp(n) {
  let e = !1, t;
  const r = Ra(!0);
  return ((...i) => (e || (t = r.run(() => n(...i)), e = !0), t));
}
const Nt = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Pp = (n) => typeof n < "u", Op = Object.prototype.toString, Dp = (n) => Op.call(n) === "[object Object]";
function xi(n) {
  return Array.isArray(n) ? n : [n];
}
function Lp(n) {
  return Zt();
}
// @__NO_SIDE_EFFECTS__
function yl(n) {
  if (!Nt) return n;
  let e = 0, t, r;
  const i = () => {
    e -= 1, r && e <= 0 && (r.stop(), t = void 0, r = void 0);
  };
  return ((...s) => (e += 1, r || (r = Ra(!0), t = r.run(() => n(...s))), gl(i), t));
}
function $p(n, e = 1e4) {
  return Yu((t, r) => {
    let i = We(n), s;
    const o = () => setTimeout(() => {
      i = We(n), r();
    }, We(e));
    return gl(() => {
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
function Np(n, e) {
  Lp() && bt(n, e);
}
function Bp(n, e, t) {
  return re(n, e, {
    ...t,
    immediate: !0
  });
}
const Ts = Nt ? window : void 0;
function en(n) {
  var e;
  const t = We(n);
  return (e = t?.$el) !== null && e !== void 0 ? e : t;
}
function Gi(...n) {
  const e = (r, i, s, o) => (r.addEventListener(i, s, o), () => r.removeEventListener(i, s, o)), t = A(() => {
    const r = xi(We(n[0])).filter((i) => i != null);
    return r.every((i) => typeof i != "string") ? r : void 0;
  });
  return Bp(() => {
    var r, i;
    return [
      (r = (i = t.value) === null || i === void 0 ? void 0 : i.map((s) => en(s))) !== null && r !== void 0 ? r : [Ts].filter((s) => s != null),
      xi(We(t.value ? n[1] : n[0])),
      xi(h(t.value ? n[2] : n[1])),
      We(t.value ? n[3] : n[2])
    ];
  }, ([r, i, s, o], a, u) => {
    if (!r?.length || !i?.length || !s?.length) return;
    const l = Dp(o) ? { ...o } : o, c = r.flatMap((d) => i.flatMap((f) => s.map((p) => e(d, f, p, l))));
    u(() => {
      c.forEach((d) => d());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function zp() {
  const n = Dt(!1), e = Zt();
  return e && _e(() => {
    n.value = !0;
  }, e), n;
}
function Fp(n) {
  return typeof n == "function" ? n : typeof n == "string" ? (e) => e.key === n : Array.isArray(n) ? (e) => n.includes(e.key) : () => !0;
}
function qp(...n) {
  let e, t, r = {};
  n.length === 3 ? (e = n[0], t = n[1], r = n[2]) : n.length === 2 ? typeof n[1] == "object" ? (e = !0, t = n[0], r = n[1]) : (e = n[0], t = n[1]) : (e = !0, t = n[0]);
  const { target: i = Ts, eventName: s = "keydown", passive: o = !1, dedupe: a = !1 } = r, u = Fp(e);
  return Gi(i, s, (c) => {
    c.repeat && We(a) || u(c) && t(c);
  }, o);
}
function Vp(n) {
  return JSON.parse(JSON.stringify(n));
}
// @__NO_SIDE_EFFECTS__
function Kn(n, e, t, r = {}) {
  var i, s;
  const { clone: o = !1, passive: a = !1, eventName: u, deep: l = !1, defaultValue: c, shouldEmit: d } = r, f = Zt(), p = t || f?.emit || (f == null || (i = f.$emit) === null || i === void 0 ? void 0 : i.bind(f)) || (f == null || (s = f.proxy) === null || s === void 0 || (s = s.$emit) === null || s === void 0 ? void 0 : s.bind(f?.proxy));
  let m = u;
  e || (e = "modelValue"), m = m || `update:${e.toString()}`;
  const v = (b) => o ? typeof o == "function" ? o(b) : Vp(b) : b, y = () => Pp(n[e]) ? v(n[e]) : c, _ = (b) => {
    d ? d(b) && p(m, b) : p(m, b);
  };
  if (a) {
    const b = P(y());
    let C = !1;
    return re(() => n[e], (E) => {
      C || (C = !0, b.value = v(E), Re(() => C = !1));
    }), re(b, (E) => {
      !C && (E !== n[e] || l) && _(E);
    }, { deep: l }), b;
  } else return A({
    get() {
      return y();
    },
    set(b) {
      _(b);
    }
  });
}
function Ei(n) {
  if (n === null || typeof n != "object")
    return !1;
  const e = Object.getPrototypeOf(n);
  return e !== null && e !== Object.prototype && Object.getPrototypeOf(e) !== null || Symbol.iterator in n ? !1 : Symbol.toStringTag in n ? Object.prototype.toString.call(n) === "[object Module]" : !0;
}
function Ki(n, e, t = ".", r) {
  if (!Ei(e))
    return Ki(n, {}, t, r);
  const i = Object.assign({}, e);
  for (const s in n) {
    if (s === "__proto__" || s === "constructor")
      continue;
    const o = n[s];
    o != null && (r && r(i, s, o, t) || (Array.isArray(o) && Array.isArray(i[s]) ? i[s] = [...o, ...i[s]] : Ei(o) && Ei(i[s]) ? i[s] = Ki(
      o,
      i[s],
      (t ? `${t}.` : "") + s.toString(),
      r
    ) : i[s] = o));
  }
  return i;
}
function Hp(n) {
  return (...e) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    e.reduce((t, r) => Ki(t, r, "", n), {})
  );
}
const Wp = Hp(), Up = /* @__PURE__ */ yl(() => {
  const n = P(/* @__PURE__ */ new Map()), e = P(), t = A(() => {
    for (const s of n.value.values()) if (s) return !0;
    return !1;
  }), r = ws({ scrollBody: P(!0) }), i = () => {
    document.body.style.paddingRight = "", document.body.style.marginRight = "", document.body.style.pointerEvents = "", document.documentElement.style.removeProperty("--scrollbar-width"), document.body.style.overflow = e.value ?? "", e.value = void 0;
  };
  return re(t, (s, o) => {
    if (!Nt) return;
    if (!s) {
      o && i();
      return;
    }
    e.value === void 0 && (e.value = document.body.style.overflow);
    const a = window.innerWidth - document.documentElement.clientWidth, u = {
      padding: a,
      margin: 0
    }, l = r.scrollBody?.value ? typeof r.scrollBody.value == "object" ? Wp({
      padding: r.scrollBody.value.padding === !0 ? a : r.scrollBody.value.padding,
      margin: r.scrollBody.value.margin === !0 ? a : r.scrollBody.value.margin
    }, u) : u : {
      padding: 0,
      margin: 0
    };
    a > 0 && (document.body.style.paddingRight = typeof l.padding == "number" ? `${l.padding}px` : String(l.padding), document.body.style.marginRight = typeof l.margin == "number" ? `${l.margin}px` : String(l.margin), document.documentElement.style.setProperty("--scrollbar-width", `${a}px`), document.body.style.overflow = "hidden"), Re(() => {
      document.body.style.pointerEvents = "none", document.body.style.overflow = "hidden";
    });
  }, {
    immediate: !0,
    flush: "sync"
  }), n;
});
function bl(n) {
  const e = Math.random().toString(36).substring(2, 7), t = Up();
  t.value.set(e, n ?? !1);
  const r = A({
    get: () => t.value.get(e) ?? !1,
    set: (i) => t.value.set(e, i)
  });
  return Np(() => {
    t.value.delete(e);
  }), r;
}
function Ss(n) {
  const e = ws({ dir: P("ltr") });
  return A(() => n?.value || e.dir?.value || "ltr");
}
function Xn(n) {
  const e = Zt(), t = e?.type.emits, r = {};
  return t?.length || console.warn(`No emitted event found. Please check component: ${e?.type.__name}`), t?.forEach((i) => {
    r[Qu(Oa(i))] = (...s) => n(i, ...s);
  }), r;
}
let Ci = 0;
function jp() {
  et((n) => {
    if (!Nt) return;
    const e = document.querySelectorAll("[data-reka-focus-guard]");
    document.body.insertAdjacentElement("afterbegin", e[0] ?? Ko()), document.body.insertAdjacentElement("beforeend", e[1] ?? Ko()), Ci++, n(() => {
      Ci === 1 && document.querySelectorAll("[data-reka-focus-guard]").forEach((t) => t.remove()), Ci--;
    });
  });
}
function Ko() {
  const n = document.createElement("span");
  return n.setAttribute("data-reka-focus-guard", ""), n.tabIndex = 0, n.style.outline = "none", n.style.opacity = "0", n.style.position = "fixed", n.style.pointerEvents = "none", n;
}
function Gp(n) {
  return A(() => We(n) ? !!en(n)?.closest("form") : !0);
}
function ke() {
  const n = Zt(), e = P(), t = A(() => ["#text", "#comment"].includes(e.value?.$el.nodeName) ? e.value?.$el.nextElementSibling : en(e)), r = Object.assign({}, n.exposed), i = {};
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
function Kp(n) {
  const e = Zt(), t = Object.keys(e?.type.props ?? {}).reduce((i, s) => {
    const o = (e?.type.props[s]).default;
    return o !== void 0 && (i[s] = o), i;
  }, {}), r = Da(n);
  return A(() => {
    const i = {}, s = e?.vnode.props ?? {};
    return Object.keys(s).forEach((o) => {
      i[Oa(o)] = s[o];
    }), Object.keys({
      ...t,
      ...i
    }).reduce((o, a) => (r.value[a] !== void 0 && (o[a] = r.value[a]), o), {});
  });
}
function Hr(n, e) {
  const t = Kp(n), r = e ? Xn(e) : {};
  return A(() => ({
    ...t.value,
    ...r
  }));
}
var Xp = function(n) {
  if (typeof document > "u")
    return null;
  var e = Array.isArray(n) ? n[0] : n;
  return e.ownerDocument.body;
}, mn = /* @__PURE__ */ new WeakMap(), hr = /* @__PURE__ */ new WeakMap(), mr = {}, Ai = 0, kl = function(n) {
  return n && (n.host || kl(n.parentNode));
}, Yp = function(n, e) {
  return e.map(function(t) {
    if (n.contains(t))
      return t;
    var r = kl(t);
    return r && n.contains(r) ? r : (console.error("aria-hidden", t, "in not contained inside", n, ". Doing nothing"), null);
  }).filter(function(t) {
    return !!t;
  });
}, Zp = function(n, e, t, r) {
  var i = Yp(e, Array.isArray(n) ? n : [n]);
  mr[t] || (mr[t] = /* @__PURE__ */ new WeakMap());
  var s = mr[t], o = [], a = /* @__PURE__ */ new Set(), u = new Set(i), l = function(d) {
    !d || a.has(d) || (a.add(d), l(d.parentNode));
  };
  i.forEach(l);
  var c = function(d) {
    !d || u.has(d) || Array.prototype.forEach.call(d.children, function(f) {
      if (a.has(f))
        c(f);
      else
        try {
          var p = f.getAttribute(r), m = p !== null && p !== "false", v = (mn.get(f) || 0) + 1, y = (s.get(f) || 0) + 1;
          mn.set(f, v), s.set(f, y), o.push(f), v === 1 && m && hr.set(f, !0), y === 1 && f.setAttribute(t, "true"), m || f.setAttribute(r, "true");
        } catch (_) {
          console.error("aria-hidden: cannot operate on ", f, _);
        }
    });
  };
  return c(e), a.clear(), Ai++, function() {
    o.forEach(function(d) {
      var f = mn.get(d) - 1, p = s.get(d) - 1;
      mn.set(d, f), s.set(d, p), f || (hr.has(d) || d.removeAttribute(r), hr.delete(d)), p || d.removeAttribute(t);
    }), Ai--, Ai || (mn = /* @__PURE__ */ new WeakMap(), mn = /* @__PURE__ */ new WeakMap(), hr = /* @__PURE__ */ new WeakMap(), mr = {});
  };
}, Qp = function(n, e, t) {
  t === void 0 && (t = "data-aria-hidden");
  var r = Array.from(Array.isArray(n) ? n : [n]), i = Xp(n);
  return i ? (r.push.apply(r, Array.from(i.querySelectorAll("[aria-live], script"))), Zp(r, i, t, "aria-hidden")) : function() {
    return null;
  };
};
function wl(n) {
  let e;
  re(() => en(n), (t) => {
    t ? e = Qp(t) : e && e();
  }), Qt(() => {
    e && e();
  });
}
let Jp = 0;
function Vn(n, e = "reka") {
  if ("useId" in ho) return `${e}-${ho.useId?.()}`;
  const t = ws({ useId: void 0 });
  return t.useId ? `${e}-${t.useId()}` : `${e}-${++Jp}`;
}
function eh(n) {
  const e = P(), t = A(() => e.value?.width ?? 0), r = A(() => e.value?.height ?? 0);
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
function th(n, e) {
  const t = P(n);
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
function nh(n) {
  const e = $p("", 1e3);
  return {
    search: e,
    handleTypeaheadSearch: (i, s) => {
      e.value = e.value + i;
      {
        const o = Ue(), a = s.map((f) => ({
          ...f,
          textValue: f.value?.textValue ?? f.ref.textContent?.trim() ?? ""
        })), u = a.find((f) => f.ref === o), l = a.map((f) => f.textValue), c = ih(l, e.value, u?.textValue), d = a.find((f) => f.textValue === c);
        return d && d.ref.focus(), d?.ref;
      }
    },
    resetTypeahead: () => {
      e.value = "";
    }
  };
}
function rh(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
function ih(n, e, t) {
  const i = e.length > 1 && Array.from(e).every((l) => l === e[0]) ? e[0] : e, s = t ? n.indexOf(t) : -1;
  let o = rh(n, Math.max(s, 0));
  i.length === 1 && (o = o.filter((l) => l !== t));
  const u = o.find((l) => l.toLowerCase().startsWith(i.toLowerCase()));
  return u !== t ? u : void 0;
}
function sh(n, e) {
  const t = P({}), r = P("none"), i = P(n), s = n.value ? "mounted" : "unmounted";
  let o;
  const a = e.value?.ownerDocument.defaultView ?? Ts, { state: u, dispatch: l } = th(s, {
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
    if (Nt) {
      const _ = new CustomEvent(y, {
        bubbles: !1,
        cancelable: !1
      });
      e.value?.dispatchEvent(_);
    }
  };
  re(n, async (y, _) => {
    const b = _ !== y;
    if (await Re(), b) {
      const C = r.value, E = vr(e.value);
      y ? (l("MOUNT"), c("enter"), E === "none" && c("after-enter")) : E === "none" || E === "undefined" || t.value?.display === "none" ? (l("UNMOUNT"), c("leave"), c("after-leave")) : _ && C !== E ? (l("ANIMATION_OUT"), c("leave")) : (l("UNMOUNT"), c("after-leave"));
    }
  }, { immediate: !0 });
  const d = (y) => {
    const _ = vr(e.value), b = _.includes(CSS.escape(y.animationName)), C = u.value === "mounted" ? "enter" : "leave";
    if (y.target === e.value && b && (c(`after-${C}`), l("ANIMATION_END"), !i.value)) {
      const E = e.value.style.animationFillMode;
      e.value.style.animationFillMode = "forwards", o = a?.setTimeout(() => {
        e.value?.style.animationFillMode === "forwards" && (e.value.style.animationFillMode = E);
      });
    }
    y.target === e.value && _ === "none" && l("ANIMATION_END");
  }, f = (y) => {
    y.target === e.value && (r.value = vr(e.value));
  }, p = re(e, (y, _) => {
    y ? (t.value = getComputedStyle(y), y.addEventListener("animationstart", f), y.addEventListener("animationcancel", d), y.addEventListener("animationend", d)) : (l("ANIMATION_END"), o !== void 0 && a?.clearTimeout(o), _?.removeEventListener("animationstart", f), _?.removeEventListener("animationcancel", d), _?.removeEventListener("animationend", d));
  }, { immediate: !0 }), m = re(u, () => {
    const y = vr(e.value);
    r.value = u.value === "mounted" ? y : "none";
  });
  return Qt(() => {
    p(), m();
  }), { isPresent: A(() => ["mounted", "unmountSuspended"].includes(u.value)) };
}
function vr(n) {
  return n && getComputedStyle(n).animationName || "none";
}
var Wr = j({
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
    const { present: r, forceMount: i } = _n(n), s = P(), { isPresent: o } = sh(r, s);
    t({ present: o });
    let a = e.default({ present: o.value });
    a = ks(a || []);
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
    return () => i.value || r.value || o.value ? Tt(e.default({ present: o.value })[0], { ref: (l) => {
      const c = en(l);
      return typeof c?.hasAttribute > "u" || (c?.hasAttribute("data-reka-popper-content-wrapper") ? s.value = c.firstElementChild : s.value = c), c;
    } }) : null;
  }
});
const Xi = j({
  name: "PrimitiveSlot",
  inheritAttrs: !1,
  setup(n, { attrs: e, slots: t }) {
    return () => {
      if (!t.default) return null;
      const r = ks(t.default()), i = r.findIndex((u) => u.type !== Ju);
      if (i === -1) return r;
      const s = r[i];
      delete s.props?.ref;
      const o = s.props ? ve(e, s.props) : e, a = ec({
        ...s,
        props: {}
      }, o);
      return r.length === 1 ? a : (r[i] = a, r);
    };
  }
}), oh = [
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
    return typeof r == "string" && oh.includes(r) ? () => Tt(r, e) : r !== "template" ? () => Tt(n.as, e, { default: t.default }) : () => Tt(Xi, e, { default: t.default });
  }
});
function Yi() {
  const n = P(), e = A(() => ["#text", "#comment"].includes(n.value?.$el.nodeName) ? n.value?.$el.nextElementSibling : en(n));
  return {
    primitiveElement: n,
    currentElement: e
  };
}
const [Bt, ah] = at("DialogRoot");
var lh = /* @__PURE__ */ j({
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
    const t = n, i = /* @__PURE__ */ Kn(t, "open", e, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), o = P(), { modal: a } = _n(t);
    return ah({
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
    }), (u, l) => Z(u.$slots, "default", {
      open: h(i),
      close: () => i.value = !1
    });
  }
}), uh = lh, ch = /* @__PURE__ */ j({
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
    const t = Bt();
    return (r, i) => (k(), V(h(je), ve(e, {
      type: r.as === "button" ? "button" : void 0,
      onClick: i[0] || (i[0] = (s) => h(t).onOpenChange(!1))
    }), {
      default: z(() => [Z(r.$slots, "default")]),
      _: 3
    }, 16, ["type"]));
  }
}), dh = ch;
const fh = "dismissableLayer.pointerDownOutside", ph = "dismissableLayer.focusOutside";
function Tl(n, e) {
  const t = e.closest("[data-dismissable-layer]"), r = n.dataset.dismissableLayer === "" ? n : n.querySelector("[data-dismissable-layer]"), i = Array.from(n.ownerDocument.querySelectorAll("[data-dismissable-layer]"));
  return !!(t && (r === t || i.indexOf(r) < i.indexOf(t)));
}
function hh(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1), s = P(() => {
  });
  return et((o) => {
    if (!Nt || !We(t)) return;
    const a = async (l) => {
      const c = l.target;
      if (!(!e?.value || !c)) {
        if (Tl(e.value, c)) {
          i.value = !1;
          return;
        }
        if (l.target && !i.value) {
          let f = function() {
            ml(fh, n, d);
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
function mh(n, e, t = !0) {
  const r = e?.value?.ownerDocument ?? globalThis?.document, i = P(!1);
  return et((s) => {
    if (!Nt || !We(t)) return;
    const o = async (a) => {
      if (!e?.value) return;
      await Re(), await Re();
      const u = a.target;
      !e.value || !u || Tl(e.value, u) || a.target && !i.value && ml(ph, n, { originalEvent: a });
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
const Je = as({
  layersRoot: /* @__PURE__ */ new Set(),
  layersWithOutsidePointerEventsDisabled: /* @__PURE__ */ new Set(),
  originalBodyPointerEvents: void 0,
  branches: /* @__PURE__ */ new Set()
});
var vh = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = A(() => s.value?.ownerDocument ?? globalThis.document), a = A(() => Je.layersRoot), u = A(() => s.value ? Array.from(a.value).indexOf(s.value) : -1), l = A(() => Je.layersWithOutsidePointerEventsDisabled.size > 0), c = A(() => {
      const p = Array.from(a.value), [m] = [...Je.layersWithOutsidePointerEventsDisabled].slice(-1), v = p.indexOf(m);
      return u.value >= v;
    }), d = hh(async (p) => {
      const m = [...Je.branches].some((v) => v?.contains(p.target));
      !c.value || m || (r("pointerDownOutside", p), r("interactOutside", p), await Re(), p.defaultPrevented || r("dismiss"));
    }, s), f = mh((p) => {
      [...Je.branches].some((v) => v?.contains(p.target)) || (r("focusOutside", p), r("interactOutside", p), p.defaultPrevented || r("dismiss"));
    }, s);
    return qp("Escape", (p) => {
      u.value === a.value.size - 1 && (r("escapeKeyDown", p), p.defaultPrevented || r("dismiss"));
    }), et((p) => {
      s.value && (t.disableOutsidePointerEvents && (Je.layersWithOutsidePointerEventsDisabled.size === 0 && (Je.originalBodyPointerEvents = o.value.body.style.pointerEvents, o.value.body.style.pointerEvents = "none"), Je.layersWithOutsidePointerEventsDisabled.add(s.value)), a.value.add(s.value), p(() => {
        t.disableOutsidePointerEvents && Je.layersWithOutsidePointerEventsDisabled.size === 1 && !Mr(Je.originalBodyPointerEvents) && (o.value.body.style.pointerEvents = Je.originalBodyPointerEvents);
      }));
    }), et((p) => {
      p(() => {
        s.value && (a.value.delete(s.value), Je.layersWithOutsidePointerEventsDisabled.delete(s.value));
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
      default: z(() => [Z(p.$slots, "default")]),
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
}), Sl = vh;
const gh = /* @__PURE__ */ Mp(() => P([]));
function yh() {
  const n = gh();
  return {
    add(e) {
      const t = n.value[0];
      e !== t && t?.pause(), n.value = Xo(n.value, e), n.value.unshift(e);
    },
    remove(e) {
      n.value = Xo(n.value, e), n.value[0]?.resume();
    }
  };
}
function Xo(n, e) {
  const t = [...n], r = t.indexOf(e);
  return r !== -1 && t.splice(r, 1), t;
}
const Ii = "focusScope.autoFocusOnMount", Ri = "focusScope.autoFocusOnUnmount", Yo = {
  bubbles: !1,
  cancelable: !0
};
function bh(n, { select: e = !1 } = {}) {
  const t = Ue();
  for (const r of n)
    if (Rt(r, { select: e }), Ue() !== t) return !0;
}
function kh(n) {
  const e = _l(n), t = Zo(e, n), r = Zo(e.reverse(), n);
  return [t, r];
}
function _l(n) {
  const e = [], t = document.createTreeWalker(n, NodeFilter.SHOW_ELEMENT, { acceptNode: (r) => {
    const i = r.tagName === "INPUT" && r.type === "hidden";
    return r.disabled || r.hidden || i ? NodeFilter.FILTER_SKIP : r.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
  } });
  for (; t.nextNode(); ) e.push(t.currentNode);
  return e;
}
function Zo(n, e) {
  for (const t of n) if (!wh(t, { upTo: e })) return t;
}
function wh(n, { upTo: e }) {
  if (getComputedStyle(n).visibility === "hidden") return !0;
  for (; n; ) {
    if (e !== void 0 && n === e) return !1;
    if (getComputedStyle(n).display === "none") return !0;
    n = n.parentElement;
  }
  return !1;
}
function Th(n) {
  return n instanceof HTMLInputElement && "select" in n;
}
function Rt(n, { select: e = !1 } = {}) {
  if (n && n.focus) {
    const t = Ue();
    n.focus({ preventScroll: !0 }), n !== t && Th(n) && e && n.select();
  }
}
var Sh = /* @__PURE__ */ j({
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
    const t = n, r = e, { currentRef: i, currentElement: s } = ke(), o = P(null), a = yh(), u = as({
      paused: !1,
      pause() {
        this.paused = !0;
      },
      resume() {
        this.paused = !1;
      }
    });
    et((c) => {
      if (!Nt) return;
      const d = s.value;
      if (!t.trapped) return;
      function f(y) {
        if (u.paused || !d) return;
        const _ = y.target;
        d.contains(_) ? o.value = _ : Rt(o.value, { select: !0 });
      }
      function p(y) {
        if (u.paused || !d) return;
        const _ = y.relatedTarget;
        _ !== null && (d.contains(_) || Rt(o.value, { select: !0 }));
      }
      function m(y) {
        d.contains(o.value) || Rt(d);
      }
      document.addEventListener("focusin", f), document.addEventListener("focusout", p);
      const v = new MutationObserver(m);
      d && v.observe(d, {
        childList: !0,
        subtree: !0
      }), c(() => {
        document.removeEventListener("focusin", f), document.removeEventListener("focusout", p), v.disconnect();
      });
    }), et(async (c) => {
      const d = s.value;
      if (await Re(), !d) return;
      a.add(u);
      const f = Ue();
      if (!d.contains(f)) {
        const m = new CustomEvent(Ii, Yo);
        d.addEventListener(Ii, (v) => r("mountAutoFocus", v)), d.dispatchEvent(m), m.defaultPrevented || (bh(_l(d), { select: !0 }), Ue() === f && Rt(d));
      }
      c(() => {
        d.removeEventListener(Ii, (y) => r("mountAutoFocus", y));
        const m = new CustomEvent(Ri, Yo), v = (y) => {
          r("unmountAutoFocus", y);
        };
        d.addEventListener(Ri, v), d.dispatchEvent(m), setTimeout(() => {
          m.defaultPrevented || Rt(f ?? document.body, { select: !0 }), d.removeEventListener(Ri, v), a.remove(u);
        }, 0);
      });
    });
    function l(c) {
      if (!t.loop && !t.trapped || u.paused) return;
      const d = c.key === "Tab" && !c.altKey && !c.ctrlKey && !c.metaKey, f = Ue();
      if (d && f) {
        const p = c.currentTarget, [m, v] = kh(p);
        m && v ? !c.shiftKey && f === v ? (c.preventDefault(), t.loop && Rt(m, { select: !0 })) : c.shiftKey && f === m && (c.preventDefault(), t.loop && Rt(v, { select: !0 })) : f === p && c.preventDefault();
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
      default: z(() => [Z(c.$slots, "default")]),
      _: 3
    }, 8, ["as-child", "as"]));
  }
}), xl = Sh;
const _h = "menu.itemSelect", Zi = ["Enter", " "], xh = [
  "ArrowDown",
  "PageUp",
  "Home"
], El = [
  "ArrowUp",
  "PageDown",
  "End"
], Eh = [...xh, ...El];
[...Zi], [...Zi];
function Cl(n) {
  return n ? "open" : "closed";
}
function Ch(n) {
  const e = Ue();
  for (const t of n)
    if (t === e || (t.focus(), Ue() !== e)) return;
}
function Ah(n, e) {
  const { x: t, y: r } = n;
  let i = !1;
  for (let s = 0, o = e.length - 1; s < e.length; o = s++) {
    const a = e[s].x, u = e[s].y, l = e[o].x, c = e[o].y;
    u > r != c > r && t < (l - a) * (r - u) / (c - u) + a && (i = !i);
  }
  return i;
}
function Ih(n, e) {
  if (!e) return !1;
  const t = {
    x: n.clientX,
    y: n.clientY
  };
  return Ah(t, e);
}
function Qi(n) {
  return n.pointerType === "mouse";
}
const Rh = "DialogTitle", Mh = "DialogContent";
function Ph({ titleName: n = Rh, contentName: e = Mh, componentLink: t = "dialog.html#title", titleId: r, descriptionId: i, contentElement: s }) {
  const o = `Warning: \`${e}\` requires a \`${n}\` for the component to be accessible for screen reader users.

If you want to hide the \`${n}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://www.reka-ui.com/docs/components/${t}`, a = `Warning: Missing \`Description\` or \`aria-describedby="undefined"\` for ${e}.`;
  _e(() => {
    document.getElementById(r) || console.warn(o);
    const l = s.value?.getAttribute("aria-describedby");
    i && l && (document.getElementById(i) || console.warn(a));
  });
}
var Oh = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Bt(), { forwardRef: s, currentElement: o } = ke();
    return i.titleId ||= Vn(void 0, "reka-dialog-title"), i.descriptionId ||= Vn(void 0, "reka-dialog-description"), _e(() => {
      i.contentElement = o, Ue() !== document.body && (i.triggerElement.value = Ue());
    }), process.env.NODE_ENV !== "production" && Ph({
      titleName: "DialogTitle",
      contentName: "DialogContent",
      componentLink: "dialog.html#title",
      titleId: i.titleId,
      descriptionId: i.descriptionId,
      contentElement: o
    }), (a, u) => (k(), V(h(xl), {
      "as-child": "",
      loop: "",
      trapped: t.trapFocus,
      onMountAutoFocus: u[5] || (u[5] = (l) => r("openAutoFocus", l)),
      onUnmountAutoFocus: u[6] || (u[6] = (l) => r("closeAutoFocus", l))
    }, {
      default: z(() => [q(h(Sl), ve({
        id: h(i).contentId,
        ref: h(s),
        as: a.as,
        "as-child": a.asChild,
        "disable-outside-pointer-events": a.disableOutsidePointerEvents,
        role: "dialog",
        "aria-describedby": h(i).descriptionId,
        "aria-labelledby": h(i).titleId,
        "data-state": h(Cl)(h(i).open.value)
      }, a.$attrs, {
        onDismiss: u[0] || (u[0] = (l) => h(i).onOpenChange(!1)),
        onEscapeKeyDown: u[1] || (u[1] = (l) => r("escapeKeyDown", l)),
        onFocusOutside: u[2] || (u[2] = (l) => r("focusOutside", l)),
        onInteractOutside: u[3] || (u[3] = (l) => r("interactOutside", l)),
        onPointerDownOutside: u[4] || (u[4] = (l) => r("pointerDownOutside", l))
      }), {
        default: z(() => [Z(a.$slots, "default")]),
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
}), Al = Oh, Dh = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Bt(), s = Xn(r), { forwardRef: o, currentElement: a } = ke();
    return wl(a), (u, l) => (k(), V(Al, ve({
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
      default: z(() => [Z(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus"]));
  }
}), Lh = Dh, $h = /* @__PURE__ */ j({
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
    const t = n, i = Xn(e);
    ke();
    const s = Bt(), o = P(!1), a = P(!1);
    return (u, l) => (k(), V(Al, ve({
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
      default: z(() => [Z(u.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Nh = $h, Bh = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Bt(), s = Xn(r), { forwardRef: o } = ke();
    return (a, u) => (k(), V(h(Wr), { present: a.forceMount || h(i).open.value }, {
      default: z(() => [h(i).modal.value ? (k(), V(Lh, ve({
        key: 0,
        ref: h(o)
      }, {
        ...t,
        ...h(s),
        ...a.$attrs
      }), {
        default: z(() => [Z(a.$slots, "default")]),
        _: 3
      }, 16)) : (k(), V(Nh, ve({
        key: 1,
        ref: h(o)
      }, {
        ...t,
        ...h(s),
        ...a.$attrs
      }), {
        default: z(() => [Z(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), zh = Bh, Fh = /* @__PURE__ */ j({
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
    const e = Bt();
    return bl(!0), ke(), (t, r) => (k(), V(h(je), {
      as: t.as,
      "as-child": t.asChild,
      "data-state": h(e).open.value ? "open" : "closed",
      style: { "pointer-events": "auto" }
    }, {
      default: z(() => [Z(t.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "data-state"
    ]));
  }
}), qh = Fh, Vh = /* @__PURE__ */ j({
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
    const e = Bt(), { forwardRef: t } = ke();
    return (r, i) => h(e)?.modal.value ? (k(), V(h(Wr), {
      key: 0,
      present: r.forceMount || h(e).open.value
    }, {
      default: z(() => [q(qh, ve(r.$attrs, {
        ref: h(t),
        as: r.as,
        "as-child": r.asChild
      }), {
        default: z(() => [Z(r.$slots, "default")]),
        _: 3
      }, 16, ["as", "as-child"])]),
      _: 3
    }, 8, ["present"])) : Y("v-if", !0);
  }
}), Hh = Vh, Wh = /* @__PURE__ */ j({
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
    const e = /* @__PURE__ */ zp();
    return (t, r) => h(e) || t.forceMount ? (k(), V(tc, {
      key: 0,
      to: t.to,
      disabled: t.disabled,
      defer: t.defer
    }, [Z(t.$slots, "default")], 8, [
      "to",
      "disabled",
      "defer"
    ])) : Y("v-if", !0);
  }
}), Il = Wh, Uh = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(Il), mt(Ot(e)), {
      default: z(() => [Z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), jh = Uh, Gh = /* @__PURE__ */ j({
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
    const e = n, t = Bt();
    return ke(), (r, i) => (k(), V(h(je), ve(e, { id: h(t).titleId }), {
      default: z(() => [Z(r.$slots, "default")]),
      _: 3
    }, 16, ["id"]));
  }
}), Kh = Gh;
const Qo = "data-reka-collection-item";
function _s(n = {}) {
  const { key: e = "", isProvider: t = !1 } = n, r = `${e}CollectionProvider`;
  let i;
  if (t) {
    const c = P(/* @__PURE__ */ new Map());
    i = {
      collectionRef: P(),
      itemMap: c
    }, Sn(r, i);
  } else i = jn(r);
  const s = (c = !1) => {
    const d = i.collectionRef.value;
    if (!d) return [];
    const f = Array.from(d.querySelectorAll(`[${Qo}]`)), m = Array.from(i.itemMap.value.values()).sort((v, y) => f.indexOf(v.ref) - f.indexOf(y.ref));
    return c ? m : m.filter((v) => v.ref.dataset.disabled !== "");
  }, o = j({
    name: "CollectionSlot",
    inheritAttrs: !1,
    setup(c, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: m } = Yi();
      return re(m, () => {
        i.collectionRef.value = m.value;
      }), () => Tt(Xi, {
        ref: p,
        ...f
      }, d);
    }
  }), a = j({
    name: "CollectionItem",
    inheritAttrs: !1,
    props: { value: { validator: () => !0 } },
    setup(c, { slots: d, attrs: f }) {
      const { primitiveElement: p, currentElement: m } = Yi();
      return et((v) => {
        if (m.value) {
          const y = nc(m.value);
          i.itemMap.value.set(y, {
            ref: m.value,
            value: c.value
          }), v(() => i.itemMap.value.delete(y));
        }
      }), () => Tt(Xi, {
        ...f,
        [Qo]: "",
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
const Xh = "rovingFocusGroup.onEntryFocus", Yh = {
  bubbles: !1,
  cancelable: !0
}, Zh = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function Qh(n, e) {
  return e !== "rtl" ? n : n === "ArrowLeft" ? "ArrowRight" : n === "ArrowRight" ? "ArrowLeft" : n;
}
function Jh(n, e, t) {
  const r = Qh(n.key, t);
  if (!(e === "vertical" && ["ArrowLeft", "ArrowRight"].includes(r)) && !(e === "horizontal" && ["ArrowUp", "ArrowDown"].includes(r)))
    return Zh[r];
}
function Rl(n, e = !1) {
  const t = Ue();
  for (const r of n)
    if (r === t || (r.focus({ preventScroll: e }), Ue() !== t)) return;
}
function em(n, e) {
  return n.map((t, r) => n[(e + r) % n.length]);
}
const [tm, nm] = at("RovingFocusGroup");
var rm = /* @__PURE__ */ j({
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
    const r = n, i = t, { loop: s, orientation: o, dir: a } = _n(r), u = Ss(a), l = /* @__PURE__ */ Kn(r, "currentTabStopId", i, {
      defaultValue: r.defaultCurrentTabStopId,
      passive: r.currentTabStopId === void 0
    }), c = P(!1), d = P(!1), f = P(0), { getItems: p, CollectionSlot: m } = _s({ isProvider: !0 });
    function v(_) {
      const b = !d.value;
      if (_.currentTarget && _.target === _.currentTarget && b && !c.value) {
        const C = new CustomEvent(Xh, Yh);
        if (_.currentTarget.dispatchEvent(C), i("entryFocus", C), !C.defaultPrevented) {
          const E = p().map((w) => w.ref).filter((w) => w.dataset.disabled !== ""), N = E.find((w) => w.getAttribute("data-active") === ""), T = E.find((w) => w.getAttribute("data-highlighted") === ""), x = E.find((w) => w.id === l.value), S = [
            N,
            T,
            x,
            ...E
          ].filter(Boolean);
          Rl(S, r.preventScrollOnEntryFocus);
        }
      }
      d.value = !1;
    }
    function y() {
      setTimeout(() => {
        d.value = !1;
      }, 1);
    }
    return e({ getItems: p }), nm({
      loop: s,
      dir: u,
      orientation: o,
      currentTabStopId: l,
      onItemFocus: (_) => {
        l.value = _;
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
    }), (_, b) => (k(), V(h(m), null, {
      default: z(() => [q(h(je), {
        tabindex: c.value || f.value === 0 ? -1 : 0,
        "data-orientation": h(o),
        as: _.as,
        "as-child": _.asChild,
        dir: h(u),
        style: { outline: "none" },
        onMousedown: b[0] || (b[0] = (C) => d.value = !0),
        onMouseup: y,
        onFocus: v,
        onBlur: b[1] || (b[1] = (C) => c.value = !1)
      }, {
        default: z(() => [Z(_.$slots, "default")]),
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
}), im = rm, sm = /* @__PURE__ */ j({
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
    const e = n, t = tm(), r = Vn(), i = A(() => e.tabStopId || r), s = A(() => t.currentTabStopId.value === i.value), { getItems: o, CollectionItem: a } = _s();
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
      const c = Jh(l, t.orientation.value, t.dir.value);
      if (c !== void 0) {
        if (l.metaKey || l.ctrlKey || l.altKey || !e.allowShiftKey && l.shiftKey) return;
        l.preventDefault();
        let d = [...o().map((f) => f.ref).filter((f) => f.dataset.disabled !== "")];
        if (c === "last") d.reverse();
        else if (c === "prev" || c === "next") {
          c === "prev" && d.reverse();
          const f = d.indexOf(l.currentTarget);
          d = t.loop.value ? em(d, f + 1) : d.slice(f + 1);
        }
        Re(() => Rl(d));
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
        default: z(() => [Z(l.$slots, "default")]),
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
}), om = sm, am = /* @__PURE__ */ j({
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
      default: z(() => [Z(e.$slots, "default")]),
      _: 3
    }, 8, [
      "as",
      "as-child",
      "aria-hidden",
      "data-hidden",
      "tabindex"
    ]));
  }
}), lm = am, um = /* @__PURE__ */ j({
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
    return re(i, (s, o) => {
      if (!r.value) return;
      const a = r.value, u = window.HTMLInputElement.prototype, c = Object.getOwnPropertyDescriptor(u, "value").set;
      if (c && s !== o) {
        const d = new Event("input", { bubbles: !0 }), f = new Event("change", { bubbles: !0 });
        c.call(a, s), a.dispatchEvent(d), a.dispatchEvent(f);
      }
    }), (s, o) => (k(), V(lm, ve({
      ref_key: "primitiveElement",
      ref: t
    }, {
      ...e,
      ...s.$attrs
    }, { as: "input" }), null, 16));
  }
}), Jo = um, cm = /* @__PURE__ */ j({
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
    return (i, s) => (k(), L(ye, null, [Y(" We render single input if it's required "), t.value ? (k(), V(Jo, ve({ key: i.name }, {
      ...e,
      ...i.$attrs
    }, {
      name: i.name,
      value: i.value
    }), null, 16, ["name", "value"])) : (k(!0), L(ye, { key: 1 }, qe(r.value, (o) => (k(), V(Jo, ve({ key: o.name }, { ref_for: !0 }, {
      ...e,
      ...i.$attrs
    }, {
      name: o.name,
      value: o.value
    }), null, 16, ["name", "value"]))), 128))], 2112));
  }
}), dm = cm;
const [fm] = at("CheckboxGroupRoot");
function Pr(n) {
  return n === "indeterminate";
}
function Ml(n) {
  return Pr(n) ? "indeterminate" : n ? "checked" : "unchecked";
}
const [pm, hm] = at("CheckboxRoot");
var mm = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = fm(null), a = /* @__PURE__ */ Kn(t, "modelValue", r, {
      defaultValue: t.defaultValue,
      passive: t.modelValue === void 0
    }), u = A(() => o?.disabled.value || t.disabled), l = A(() => Mr(o?.modelValue.value) ? a.value === "indeterminate" ? "indeterminate" : a.value : Go(o.modelValue.value, t.value));
    function c() {
      if (Mr(o?.modelValue.value))
        a.value = Pr(a.value) ? !0 : !a.value;
      else {
        const p = [...o.modelValue.value || []];
        if (Go(p, t.value)) {
          const m = p.findIndex((v) => ji(v, t.value));
          p.splice(m, 1);
        } else p.push(t.value);
        o.modelValue.value = p;
      }
    }
    const d = Gp(s), f = A(() => t.id && s.value ? document.querySelector(`[for="${t.id}"]`)?.innerText : void 0);
    return hm({
      disabled: u,
      state: l
    }), (p, m) => (k(), V(Ia(h(o)?.rovingFocus.value ? h(om) : h(je)), ve(p.$attrs, {
      id: p.id,
      ref: h(i),
      role: "checkbox",
      "as-child": p.asChild,
      as: p.as,
      type: p.as === "button" ? "button" : void 0,
      "aria-checked": h(Pr)(l.value) ? "mixed" : l.value,
      "aria-required": p.required,
      "aria-label": p.$attrs["aria-label"] || f.value,
      "data-state": h(Ml)(l.value),
      "data-disabled": u.value ? "" : void 0,
      disabled: u.value,
      focusable: h(o)?.rovingFocus.value ? !u.value : void 0,
      onKeydown: La(Le(() => {
      }, ["prevent"]), ["enter"]),
      onClick: c
    }), {
      default: z(() => [Z(p.$slots, "default", {
        modelValue: h(a),
        state: l.value
      }), h(d) && p.name && !h(o) ? (k(), V(h(dm), {
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
}), vm = mm, gm = /* @__PURE__ */ j({
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
    const { forwardRef: e } = ke(), t = pm();
    return (r, i) => (k(), V(h(Wr), { present: r.forceMount || h(Pr)(h(t).state.value) || h(t).state.value === !0 }, {
      default: z(() => [q(h(je), ve({
        ref: h(e),
        "data-state": h(Ml)(h(t).state.value),
        "data-disabled": h(t).disabled.value ? "" : void 0,
        style: { pointerEvents: "none" },
        "as-child": r.asChild,
        as: r.as
      }, r.$attrs), {
        default: z(() => [Z(r.$slots, "default")]),
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
}), ym = gm;
const [Pl, bm] = at("PopperRoot");
var km = /* @__PURE__ */ j({
  inheritAttrs: !1,
  __name: "PopperRoot",
  setup(n) {
    const e = P();
    return bm({
      anchor: e,
      onAnchorChange: (t) => e.value = t
    }), (t, r) => Z(t.$slots, "default");
  }
}), wm = km, Tm = /* @__PURE__ */ j({
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
    const e = n, { forwardRef: t, currentElement: r } = ke(), i = Pl();
    return $a(() => {
      i.onAnchorChange(e.reference ?? r.value);
    }), (s, o) => (k(), V(h(je), {
      ref: h(t),
      as: s.as,
      "as-child": s.asChild
    }, {
      default: z(() => [Z(s.$slots, "default")]),
      _: 3
    }, 8, ["as", "as-child"]));
  }
}), Sm = Tm;
function _m(n) {
  return n !== null;
}
function xm(n) {
  return {
    name: "transformOrigin",
    options: n,
    fn(e) {
      const { placement: t, rects: r, middlewareData: i } = e, o = i.arrow?.centerOffset !== 0, a = o ? 0 : n.arrowWidth, u = o ? 0 : n.arrowHeight, [l, c] = Ji(t), d = {
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
function Ji(n) {
  const [e, t = "center"] = n.split("-");
  return [e, t];
}
const Em = ["top", "right", "bottom", "left"], Lt = Math.min, Xe = Math.max, Or = Math.round, gr = Math.floor, vt = (n) => ({
  x: n,
  y: n
}), Cm = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, Am = {
  start: "end",
  end: "start"
};
function es(n, e, t) {
  return Xe(n, Lt(e, t));
}
function St(n, e) {
  return typeof n == "function" ? n(e) : n;
}
function _t(n) {
  return n.split("-")[0];
}
function En(n) {
  return n.split("-")[1];
}
function xs(n) {
  return n === "x" ? "y" : "x";
}
function Es(n) {
  return n === "y" ? "height" : "width";
}
const Im = /* @__PURE__ */ new Set(["top", "bottom"]);
function ht(n) {
  return Im.has(_t(n)) ? "y" : "x";
}
function Cs(n) {
  return xs(ht(n));
}
function Rm(n, e, t) {
  t === void 0 && (t = !1);
  const r = En(n), i = Cs(n), s = Es(i);
  let o = i === "x" ? r === (t ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return e.reference[s] > e.floating[s] && (o = Dr(o)), [o, Dr(o)];
}
function Mm(n) {
  const e = Dr(n);
  return [ts(n), e, ts(e)];
}
function ts(n) {
  return n.replace(/start|end/g, (e) => Am[e]);
}
const ea = ["left", "right"], ta = ["right", "left"], Pm = ["top", "bottom"], Om = ["bottom", "top"];
function Dm(n, e, t) {
  switch (n) {
    case "top":
    case "bottom":
      return t ? e ? ta : ea : e ? ea : ta;
    case "left":
    case "right":
      return e ? Pm : Om;
    default:
      return [];
  }
}
function Lm(n, e, t, r) {
  const i = En(n);
  let s = Dm(_t(n), t === "start", r);
  return i && (s = s.map((o) => o + "-" + i), e && (s = s.concat(s.map(ts)))), s;
}
function Dr(n) {
  return n.replace(/left|right|bottom|top/g, (e) => Cm[e]);
}
function $m(n) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...n
  };
}
function Ol(n) {
  return typeof n != "number" ? $m(n) : {
    top: n,
    right: n,
    bottom: n,
    left: n
  };
}
function Lr(n) {
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
function na(n, e, t) {
  let {
    reference: r,
    floating: i
  } = n;
  const s = ht(e), o = Cs(e), a = Es(o), u = _t(e), l = s === "y", c = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[a] / 2 - i[a] / 2;
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
  switch (En(e)) {
    case "start":
      p[o] -= f * (t && l ? -1 : 1);
      break;
    case "end":
      p[o] += f * (t && l ? -1 : 1);
      break;
  }
  return p;
}
async function Nm(n, e) {
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
  } = St(e, n), m = Ol(p), y = a[f ? d === "floating" ? "reference" : "floating" : d], _ = Lr(await s.getClippingRect({
    element: (t = await (s.isElement == null ? void 0 : s.isElement(y))) == null || t ? y : y.contextElement || await (s.getDocumentElement == null ? void 0 : s.getDocumentElement(a.floating)),
    boundary: l,
    rootBoundary: c,
    strategy: u
  })), b = d === "floating" ? {
    x: r,
    y: i,
    width: o.floating.width,
    height: o.floating.height
  } : o.reference, C = await (s.getOffsetParent == null ? void 0 : s.getOffsetParent(a.floating)), E = await (s.isElement == null ? void 0 : s.isElement(C)) ? await (s.getScale == null ? void 0 : s.getScale(C)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, N = Lr(s.convertOffsetParentRelativeRectToViewportRelativeRect ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: a,
    rect: b,
    offsetParent: C,
    strategy: u
  }) : b);
  return {
    top: (_.top - N.top + m.top) / E.y,
    bottom: (N.bottom - _.bottom + m.bottom) / E.y,
    left: (_.left - N.left + m.left) / E.x,
    right: (N.right - _.right + m.right) / E.x
  };
}
const Bm = async (n, e, t) => {
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
  } = na(l, r, u), f = r, p = {}, m = 0;
  for (let y = 0; y < a.length; y++) {
    var v;
    const {
      name: _,
      fn: b
    } = a[y], {
      x: C,
      y: E,
      data: N,
      reset: T
    } = await b({
      x: c,
      y: d,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: p,
      rects: l,
      platform: {
        ...o,
        detectOverflow: (v = o.detectOverflow) != null ? v : Nm
      },
      elements: {
        reference: n,
        floating: e
      }
    });
    c = C ?? c, d = E ?? d, p = {
      ...p,
      [_]: {
        ...p[_],
        ...N
      }
    }, T && m <= 50 && (m++, typeof T == "object" && (T.placement && (f = T.placement), T.rects && (l = T.rects === !0 ? await o.getElementRects({
      reference: n,
      floating: e,
      strategy: i
    }) : T.rects), {
      x: c,
      y: d
    } = na(l, f, u)), y = -1);
  }
  return {
    x: c,
    y: d,
    placement: f,
    strategy: i,
    middlewareData: p
  };
}, zm = (n) => ({
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
    } = St(n, e) || {};
    if (l == null)
      return {};
    const d = Ol(c), f = {
      x: t,
      y: r
    }, p = Cs(i), m = Es(p), v = await o.getDimensions(l), y = p === "y", _ = y ? "top" : "left", b = y ? "bottom" : "right", C = y ? "clientHeight" : "clientWidth", E = s.reference[m] + s.reference[p] - f[p] - s.floating[m], N = f[p] - s.reference[p], T = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(l));
    let x = T ? T[C] : 0;
    (!x || !await (o.isElement == null ? void 0 : o.isElement(T))) && (x = a.floating[C] || s.floating[m]);
    const S = E / 2 - N / 2, w = x / 2 - v[m] / 2 - 1, I = Lt(d[_], w), D = Lt(d[b], w), F = I, $ = x - v[m] - D, O = x / 2 - v[m] / 2 + S, M = es(F, O, $), W = !u.arrow && En(i) != null && O !== M && s.reference[m] / 2 - (O < F ? I : D) - v[m] / 2 < 0, X = W ? O < F ? O - F : O - $ : 0;
    return {
      [p]: f[p] + X,
      data: {
        [p]: M,
        centerOffset: O - M - X,
        ...W && {
          alignmentOffset: X
        }
      },
      reset: W
    };
  }
}), Fm = function(n) {
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
      } = St(n, e);
      if ((t = s.arrow) != null && t.alignmentOffset)
        return {};
      const _ = _t(i), b = ht(a), C = _t(a) === a, E = await (u.isRTL == null ? void 0 : u.isRTL(l.floating)), N = f || (C || !v ? [Dr(a)] : Mm(a)), T = m !== "none";
      !f && T && N.push(...Lm(a, v, m, E));
      const x = [a, ...N], S = await u.detectOverflow(e, y), w = [];
      let I = ((r = s.flip) == null ? void 0 : r.overflows) || [];
      if (c && w.push(S[_]), d) {
        const O = Rm(i, o, E);
        w.push(S[O[0]], S[O[1]]);
      }
      if (I = [...I, {
        placement: i,
        overflows: w
      }], !w.every((O) => O <= 0)) {
        var D, F;
        const O = (((D = s.flip) == null ? void 0 : D.index) || 0) + 1, M = x[O];
        if (M && (!(d === "alignment" ? b !== ht(M) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        I.every((se) => ht(se.placement) === b ? se.overflows[0] > 0 : !0)))
          return {
            data: {
              index: O,
              overflows: I
            },
            reset: {
              placement: M
            }
          };
        let W = (F = I.filter((X) => X.overflows[0] <= 0).sort((X, se) => X.overflows[1] - se.overflows[1])[0]) == null ? void 0 : F.placement;
        if (!W)
          switch (p) {
            case "bestFit": {
              var $;
              const X = ($ = I.filter((se) => {
                if (T) {
                  const oe = ht(se.placement);
                  return oe === b || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  oe === "y";
                }
                return !0;
              }).map((se) => [se.placement, se.overflows.filter((oe) => oe > 0).reduce((oe, we) => oe + we, 0)]).sort((se, oe) => se[1] - oe[1])[0]) == null ? void 0 : $[0];
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
function ra(n, e) {
  return {
    top: n.top - e.height,
    right: n.right - e.width,
    bottom: n.bottom - e.height,
    left: n.left - e.width
  };
}
function ia(n) {
  return Em.some((e) => n[e] >= 0);
}
const qm = function(n) {
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
      } = St(n, e);
      switch (i) {
        case "referenceHidden": {
          const o = await r.detectOverflow(e, {
            ...s,
            elementContext: "reference"
          }), a = ra(o, t.reference);
          return {
            data: {
              referenceHiddenOffsets: a,
              referenceHidden: ia(a)
            }
          };
        }
        case "escaped": {
          const o = await r.detectOverflow(e, {
            ...s,
            altBoundary: !0
          }), a = ra(o, t.floating);
          return {
            data: {
              escapedOffsets: a,
              escaped: ia(a)
            }
          };
        }
        default:
          return {};
      }
    }
  };
}, Dl = /* @__PURE__ */ new Set(["left", "top"]);
async function Vm(n, e) {
  const {
    placement: t,
    platform: r,
    elements: i
  } = n, s = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = _t(t), a = En(t), u = ht(t) === "y", l = Dl.has(o) ? -1 : 1, c = s && u ? -1 : 1, d = St(e, n);
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
const Hm = function(n) {
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
      } = e, u = await Vm(e, n);
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
}, Wm = function(n) {
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
          fn: (_) => {
            let {
              x: b,
              y: C
            } = _;
            return {
              x: b,
              y: C
            };
          }
        },
        ...l
      } = St(n, e), c = {
        x: t,
        y: r
      }, d = await s.detectOverflow(e, l), f = ht(_t(i)), p = xs(f);
      let m = c[p], v = c[f];
      if (o) {
        const _ = p === "y" ? "top" : "left", b = p === "y" ? "bottom" : "right", C = m + d[_], E = m - d[b];
        m = es(C, m, E);
      }
      if (a) {
        const _ = f === "y" ? "top" : "left", b = f === "y" ? "bottom" : "right", C = v + d[_], E = v - d[b];
        v = es(C, v, E);
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
}, Um = function(n) {
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
      } = St(n, e), c = {
        x: t,
        y: r
      }, d = ht(i), f = xs(d);
      let p = c[f], m = c[d];
      const v = St(a, e), y = typeof v == "number" ? {
        mainAxis: v,
        crossAxis: 0
      } : {
        mainAxis: 0,
        crossAxis: 0,
        ...v
      };
      if (u) {
        const C = f === "y" ? "height" : "width", E = s.reference[f] - s.floating[C] + y.mainAxis, N = s.reference[f] + s.reference[C] - y.mainAxis;
        p < E ? p = E : p > N && (p = N);
      }
      if (l) {
        var _, b;
        const C = f === "y" ? "width" : "height", E = Dl.has(_t(i)), N = s.reference[d] - s.floating[C] + (E && ((_ = o.offset) == null ? void 0 : _[d]) || 0) + (E ? 0 : y.crossAxis), T = s.reference[d] + s.reference[C] + (E ? 0 : ((b = o.offset) == null ? void 0 : b[d]) || 0) - (E ? y.crossAxis : 0);
        m < N ? m = N : m > T && (m = T);
      }
      return {
        [f]: p,
        [d]: m
      };
    }
  };
}, jm = function(n) {
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
      } = St(n, e), c = await o.detectOverflow(e, l), d = _t(i), f = En(i), p = ht(i) === "y", {
        width: m,
        height: v
      } = s.floating;
      let y, _;
      d === "top" || d === "bottom" ? (y = d, _ = f === (await (o.isRTL == null ? void 0 : o.isRTL(a.floating)) ? "start" : "end") ? "left" : "right") : (_ = d, y = f === "end" ? "top" : "bottom");
      const b = v - c.top - c.bottom, C = m - c.left - c.right, E = Lt(v - c[y], b), N = Lt(m - c[_], C), T = !e.middlewareData.shift;
      let x = E, S = N;
      if ((t = e.middlewareData.shift) != null && t.enabled.x && (S = C), (r = e.middlewareData.shift) != null && r.enabled.y && (x = b), T && !f) {
        const I = Xe(c.left, 0), D = Xe(c.right, 0), F = Xe(c.top, 0), $ = Xe(c.bottom, 0);
        p ? S = m - 2 * (I !== 0 || D !== 0 ? I + D : Xe(c.left, c.right)) : x = v - 2 * (F !== 0 || $ !== 0 ? F + $ : Xe(c.top, c.bottom));
      }
      await u({
        ...e,
        availableWidth: S,
        availableHeight: x
      });
      const w = await o.getDimensions(a.floating);
      return m !== w.width || v !== w.height ? {
        reset: {
          rects: !0
        }
      } : {};
    }
  };
};
function Ur() {
  return typeof window < "u";
}
function tn(n) {
  return As(n) ? (n.nodeName || "").toLowerCase() : "#document";
}
function Ze(n) {
  var e;
  return (n == null || (e = n.ownerDocument) == null ? void 0 : e.defaultView) || window;
}
function kt(n) {
  var e;
  return (e = (As(n) ? n.ownerDocument : n.document) || window.document) == null ? void 0 : e.documentElement;
}
function As(n) {
  return Ur() ? n instanceof Node || n instanceof Ze(n).Node : !1;
}
function st(n) {
  return Ur() ? n instanceof Element || n instanceof Ze(n).Element : !1;
}
function yt(n) {
  return Ur() ? n instanceof HTMLElement || n instanceof Ze(n).HTMLElement : !1;
}
function sa(n) {
  return !Ur() || typeof ShadowRoot > "u" ? !1 : n instanceof ShadowRoot || n instanceof Ze(n).ShadowRoot;
}
const Gm = /* @__PURE__ */ new Set(["inline", "contents"]);
function Yn(n) {
  const {
    overflow: e,
    overflowX: t,
    overflowY: r,
    display: i
  } = ot(n);
  return /auto|scroll|overlay|hidden|clip/.test(e + r + t) && !Gm.has(i);
}
const Km = /* @__PURE__ */ new Set(["table", "td", "th"]);
function Xm(n) {
  return Km.has(tn(n));
}
const Ym = [":popover-open", ":modal"];
function jr(n) {
  return Ym.some((e) => {
    try {
      return n.matches(e);
    } catch {
      return !1;
    }
  });
}
const Zm = ["transform", "translate", "scale", "rotate", "perspective"], Qm = ["transform", "translate", "scale", "rotate", "perspective", "filter"], Jm = ["paint", "layout", "strict", "content"];
function Is(n) {
  const e = Rs(), t = st(n) ? ot(n) : n;
  return Zm.some((r) => t[r] ? t[r] !== "none" : !1) || (t.containerType ? t.containerType !== "normal" : !1) || !e && (t.backdropFilter ? t.backdropFilter !== "none" : !1) || !e && (t.filter ? t.filter !== "none" : !1) || Qm.some((r) => (t.willChange || "").includes(r)) || Jm.some((r) => (t.contain || "").includes(r));
}
function ev(n) {
  let e = $t(n);
  for (; yt(e) && !wn(e); ) {
    if (Is(e))
      return e;
    if (jr(e))
      return null;
    e = $t(e);
  }
  return null;
}
function Rs() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const tv = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function wn(n) {
  return tv.has(tn(n));
}
function ot(n) {
  return Ze(n).getComputedStyle(n);
}
function Gr(n) {
  return st(n) ? {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  } : {
    scrollLeft: n.scrollX,
    scrollTop: n.scrollY
  };
}
function $t(n) {
  if (tn(n) === "html")
    return n;
  const e = (
    // Step into the shadow DOM of the parent of a slotted node.
    n.assignedSlot || // DOM Element detected.
    n.parentNode || // ShadowRoot detected.
    sa(n) && n.host || // Fallback.
    kt(n)
  );
  return sa(e) ? e.host : e;
}
function Ll(n) {
  const e = $t(n);
  return wn(e) ? n.ownerDocument ? n.ownerDocument.body : n.body : yt(e) && Yn(e) ? e : Ll(e);
}
function Hn(n, e, t) {
  var r;
  e === void 0 && (e = []), t === void 0 && (t = !0);
  const i = Ll(n), s = i === ((r = n.ownerDocument) == null ? void 0 : r.body), o = Ze(i);
  if (s) {
    const a = ns(o);
    return e.concat(o, o.visualViewport || [], Yn(i) ? i : [], a && t ? Hn(a) : []);
  }
  return e.concat(i, Hn(i, [], t));
}
function ns(n) {
  return n.parent && Object.getPrototypeOf(n.parent) ? n.frameElement : null;
}
function $l(n) {
  const e = ot(n);
  let t = parseFloat(e.width) || 0, r = parseFloat(e.height) || 0;
  const i = yt(n), s = i ? n.offsetWidth : t, o = i ? n.offsetHeight : r, a = Or(t) !== s || Or(r) !== o;
  return a && (t = s, r = o), {
    width: t,
    height: r,
    $: a
  };
}
function Ms(n) {
  return st(n) ? n : n.contextElement;
}
function kn(n) {
  const e = Ms(n);
  if (!yt(e))
    return vt(1);
  const t = e.getBoundingClientRect(), {
    width: r,
    height: i,
    $: s
  } = $l(e);
  let o = (s ? Or(t.width) : t.width) / r, a = (s ? Or(t.height) : t.height) / i;
  return (!o || !Number.isFinite(o)) && (o = 1), (!a || !Number.isFinite(a)) && (a = 1), {
    x: o,
    y: a
  };
}
const nv = /* @__PURE__ */ vt(0);
function Nl(n) {
  const e = Ze(n);
  return !Rs() || !e.visualViewport ? nv : {
    x: e.visualViewport.offsetLeft,
    y: e.visualViewport.offsetTop
  };
}
function rv(n, e, t) {
  return e === void 0 && (e = !1), !t || e && t !== Ze(n) ? !1 : e;
}
function Kt(n, e, t, r) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  const i = n.getBoundingClientRect(), s = Ms(n);
  let o = vt(1);
  e && (r ? st(r) && (o = kn(r)) : o = kn(n));
  const a = rv(s, t, r) ? Nl(s) : vt(0);
  let u = (i.left + a.x) / o.x, l = (i.top + a.y) / o.y, c = i.width / o.x, d = i.height / o.y;
  if (s) {
    const f = Ze(s), p = r && st(r) ? Ze(r) : r;
    let m = f, v = ns(m);
    for (; v && r && p !== m; ) {
      const y = kn(v), _ = v.getBoundingClientRect(), b = ot(v), C = _.left + (v.clientLeft + parseFloat(b.paddingLeft)) * y.x, E = _.top + (v.clientTop + parseFloat(b.paddingTop)) * y.y;
      u *= y.x, l *= y.y, c *= y.x, d *= y.y, u += C, l += E, m = Ze(v), v = ns(m);
    }
  }
  return Lr({
    width: c,
    height: d,
    x: u,
    y: l
  });
}
function Kr(n, e) {
  const t = Gr(n).scrollLeft;
  return e ? e.left + t : Kt(kt(n)).left + t;
}
function Bl(n, e) {
  const t = n.getBoundingClientRect(), r = t.left + e.scrollLeft - Kr(n, t), i = t.top + e.scrollTop;
  return {
    x: r,
    y: i
  };
}
function iv(n) {
  let {
    elements: e,
    rect: t,
    offsetParent: r,
    strategy: i
  } = n;
  const s = i === "fixed", o = kt(r), a = e ? jr(e.floating) : !1;
  if (r === o || a && s)
    return t;
  let u = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = vt(1);
  const c = vt(0), d = yt(r);
  if ((d || !d && !s) && ((tn(r) !== "body" || Yn(o)) && (u = Gr(r)), yt(r))) {
    const p = Kt(r);
    l = kn(r), c.x = p.x + r.clientLeft, c.y = p.y + r.clientTop;
  }
  const f = o && !d && !s ? Bl(o, u) : vt(0);
  return {
    width: t.width * l.x,
    height: t.height * l.y,
    x: t.x * l.x - u.scrollLeft * l.x + c.x + f.x,
    y: t.y * l.y - u.scrollTop * l.y + c.y + f.y
  };
}
function sv(n) {
  return Array.from(n.getClientRects());
}
function ov(n) {
  const e = kt(n), t = Gr(n), r = n.ownerDocument.body, i = Xe(e.scrollWidth, e.clientWidth, r.scrollWidth, r.clientWidth), s = Xe(e.scrollHeight, e.clientHeight, r.scrollHeight, r.clientHeight);
  let o = -t.scrollLeft + Kr(n);
  const a = -t.scrollTop;
  return ot(r).direction === "rtl" && (o += Xe(e.clientWidth, r.clientWidth) - i), {
    width: i,
    height: s,
    x: o,
    y: a
  };
}
const oa = 25;
function av(n, e) {
  const t = Ze(n), r = kt(n), i = t.visualViewport;
  let s = r.clientWidth, o = r.clientHeight, a = 0, u = 0;
  if (i) {
    s = i.width, o = i.height;
    const c = Rs();
    (!c || c && e === "fixed") && (a = i.offsetLeft, u = i.offsetTop);
  }
  const l = Kr(r);
  if (l <= 0) {
    const c = r.ownerDocument, d = c.body, f = getComputedStyle(d), p = c.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, m = Math.abs(r.clientWidth - d.clientWidth - p);
    m <= oa && (s -= m);
  } else l <= oa && (s += l);
  return {
    width: s,
    height: o,
    x: a,
    y: u
  };
}
const lv = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function uv(n, e) {
  const t = Kt(n, !0, e === "fixed"), r = t.top + n.clientTop, i = t.left + n.clientLeft, s = yt(n) ? kn(n) : vt(1), o = n.clientWidth * s.x, a = n.clientHeight * s.y, u = i * s.x, l = r * s.y;
  return {
    width: o,
    height: a,
    x: u,
    y: l
  };
}
function aa(n, e, t) {
  let r;
  if (e === "viewport")
    r = av(n, t);
  else if (e === "document")
    r = ov(kt(n));
  else if (st(e))
    r = uv(e, t);
  else {
    const i = Nl(n);
    r = {
      x: e.x - i.x,
      y: e.y - i.y,
      width: e.width,
      height: e.height
    };
  }
  return Lr(r);
}
function zl(n, e) {
  const t = $t(n);
  return t === e || !st(t) || wn(t) ? !1 : ot(t).position === "fixed" || zl(t, e);
}
function cv(n, e) {
  const t = e.get(n);
  if (t)
    return t;
  let r = Hn(n, [], !1).filter((a) => st(a) && tn(a) !== "body"), i = null;
  const s = ot(n).position === "fixed";
  let o = s ? $t(n) : n;
  for (; st(o) && !wn(o); ) {
    const a = ot(o), u = Is(o);
    !u && a.position === "fixed" && (i = null), (s ? !u && !i : !u && a.position === "static" && !!i && lv.has(i.position) || Yn(o) && !u && zl(n, o)) ? r = r.filter((c) => c !== o) : i = a, o = $t(o);
  }
  return e.set(n, r), r;
}
function dv(n) {
  let {
    element: e,
    boundary: t,
    rootBoundary: r,
    strategy: i
  } = n;
  const o = [...t === "clippingAncestors" ? jr(e) ? [] : cv(e, this._c) : [].concat(t), r], a = o[0], u = o.reduce((l, c) => {
    const d = aa(e, c, i);
    return l.top = Xe(d.top, l.top), l.right = Lt(d.right, l.right), l.bottom = Lt(d.bottom, l.bottom), l.left = Xe(d.left, l.left), l;
  }, aa(e, a, i));
  return {
    width: u.right - u.left,
    height: u.bottom - u.top,
    x: u.left,
    y: u.top
  };
}
function fv(n) {
  const {
    width: e,
    height: t
  } = $l(n);
  return {
    width: e,
    height: t
  };
}
function pv(n, e, t) {
  const r = yt(e), i = kt(e), s = t === "fixed", o = Kt(n, !0, s, e);
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const u = vt(0);
  function l() {
    u.x = Kr(i);
  }
  if (r || !r && !s)
    if ((tn(e) !== "body" || Yn(i)) && (a = Gr(e)), r) {
      const p = Kt(e, !0, s, e);
      u.x = p.x + e.clientLeft, u.y = p.y + e.clientTop;
    } else i && l();
  s && !r && i && l();
  const c = i && !r && !s ? Bl(i, a) : vt(0), d = o.left + a.scrollLeft - u.x - c.x, f = o.top + a.scrollTop - u.y - c.y;
  return {
    x: d,
    y: f,
    width: o.width,
    height: o.height
  };
}
function Mi(n) {
  return ot(n).position === "static";
}
function la(n, e) {
  if (!yt(n) || ot(n).position === "fixed")
    return null;
  if (e)
    return e(n);
  let t = n.offsetParent;
  return kt(n) === t && (t = t.ownerDocument.body), t;
}
function Fl(n, e) {
  const t = Ze(n);
  if (jr(n))
    return t;
  if (!yt(n)) {
    let i = $t(n);
    for (; i && !wn(i); ) {
      if (st(i) && !Mi(i))
        return i;
      i = $t(i);
    }
    return t;
  }
  let r = la(n, e);
  for (; r && Xm(r) && Mi(r); )
    r = la(r, e);
  return r && wn(r) && Mi(r) && !Is(r) ? t : r || ev(n) || t;
}
const hv = async function(n) {
  const e = this.getOffsetParent || Fl, t = this.getDimensions, r = await t(n.floating);
  return {
    reference: pv(n.reference, await e(n.floating), n.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function mv(n) {
  return ot(n).direction === "rtl";
}
const vv = {
  convertOffsetParentRelativeRectToViewportRelativeRect: iv,
  getDocumentElement: kt,
  getClippingRect: dv,
  getOffsetParent: Fl,
  getElementRects: hv,
  getClientRects: sv,
  getDimensions: fv,
  getScale: kn,
  isElement: st,
  isRTL: mv
};
function ql(n, e) {
  return n.x === e.x && n.y === e.y && n.width === e.width && n.height === e.height;
}
function gv(n, e) {
  let t = null, r;
  const i = kt(n);
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
    const m = gr(d), v = gr(i.clientWidth - (c + f)), y = gr(i.clientHeight - (d + p)), _ = gr(c), C = {
      rootMargin: -m + "px " + -v + "px " + -y + "px " + -_ + "px",
      threshold: Xe(0, Lt(1, u)) || 1
    };
    let E = !0;
    function N(T) {
      const x = T[0].intersectionRatio;
      if (x !== u) {
        if (!E)
          return o();
        x ? o(!1, x) : r = setTimeout(() => {
          o(!1, 1e-7);
        }, 1e3);
      }
      x === 1 && !ql(l, n.getBoundingClientRect()) && o(), E = !1;
    }
    try {
      t = new IntersectionObserver(N, {
        ...C,
        // Handle <iframe>s
        root: i.ownerDocument
      });
    } catch {
      t = new IntersectionObserver(N, C);
    }
    t.observe(n);
  }
  return o(!0), s;
}
function yv(n, e, t, r) {
  r === void 0 && (r = {});
  const {
    ancestorScroll: i = !0,
    ancestorResize: s = !0,
    elementResize: o = typeof ResizeObserver == "function",
    layoutShift: a = typeof IntersectionObserver == "function",
    animationFrame: u = !1
  } = r, l = Ms(n), c = i || s ? [...l ? Hn(l) : [], ...Hn(e)] : [];
  c.forEach((_) => {
    i && _.addEventListener("scroll", t, {
      passive: !0
    }), s && _.addEventListener("resize", t);
  });
  const d = l && a ? gv(l, t) : null;
  let f = -1, p = null;
  o && (p = new ResizeObserver((_) => {
    let [b] = _;
    b && b.target === l && p && (p.unobserve(e), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
      var C;
      (C = p) == null || C.observe(e);
    })), t();
  }), l && !u && p.observe(l), p.observe(e));
  let m, v = u ? Kt(n) : null;
  u && y();
  function y() {
    const _ = Kt(n);
    v && !ql(v, _) && t(), v = _, m = requestAnimationFrame(y);
  }
  return t(), () => {
    var _;
    c.forEach((b) => {
      i && b.removeEventListener("scroll", t), s && b.removeEventListener("resize", t);
    }), d?.(), (_ = p) == null || _.disconnect(), p = null, u && cancelAnimationFrame(m);
  };
}
const bv = Hm, kv = Wm, ua = Fm, wv = jm, Tv = qm, Sv = zm, _v = Um, xv = (n, e, t) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: vv,
    ...t
  }, s = {
    ...i.platform,
    _c: r
  };
  return Bm(n, e, {
    ...i,
    platform: s
  });
};
function Ev(n) {
  return n != null && typeof n == "object" && "$el" in n;
}
function rs(n) {
  if (Ev(n)) {
    const e = n.$el;
    return As(e) && tn(e) === "#comment" ? null : e;
  }
  return n;
}
function bn(n) {
  return typeof n == "function" ? n() : h(n);
}
function Cv(n) {
  return {
    name: "arrow",
    options: n,
    fn(e) {
      const t = rs(bn(n.element));
      return t == null ? {} : Sv({
        element: t,
        padding: n.padding
      }).fn(e);
    }
  };
}
function Vl(n) {
  return typeof window > "u" ? 1 : (n.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function ca(n, e) {
  const t = Vl(n);
  return Math.round(e * t) / t;
}
function Av(n, e, t) {
  t === void 0 && (t = {});
  const r = t.whileElementsMounted, i = A(() => {
    var x;
    return (x = bn(t.open)) != null ? x : !0;
  }), s = A(() => bn(t.middleware)), o = A(() => {
    var x;
    return (x = bn(t.placement)) != null ? x : "bottom";
  }), a = A(() => {
    var x;
    return (x = bn(t.strategy)) != null ? x : "absolute";
  }), u = A(() => {
    var x;
    return (x = bn(t.transform)) != null ? x : !0;
  }), l = A(() => rs(n.value)), c = A(() => rs(e.value)), d = P(0), f = P(0), p = P(a.value), m = P(o.value), v = Dt({}), y = P(!1), _ = A(() => {
    const x = {
      position: p.value,
      left: "0",
      top: "0"
    };
    if (!c.value)
      return x;
    const S = ca(c.value, d.value), w = ca(c.value, f.value);
    return u.value ? {
      ...x,
      transform: "translate(" + S + "px, " + w + "px)",
      ...Vl(c.value) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: p.value,
      left: S + "px",
      top: w + "px"
    };
  });
  let b;
  function C() {
    if (l.value == null || c.value == null)
      return;
    const x = i.value;
    xv(l.value, c.value, {
      middleware: s.value,
      placement: o.value,
      strategy: a.value
    }).then((S) => {
      d.value = S.x, f.value = S.y, p.value = S.strategy, m.value = S.placement, v.value = S.middlewareData, y.value = x !== !1;
    });
  }
  function E() {
    typeof b == "function" && (b(), b = void 0);
  }
  function N() {
    if (E(), r === void 0) {
      C();
      return;
    }
    if (l.value != null && c.value != null) {
      b = r(l.value, c.value, C);
      return;
    }
  }
  function T() {
    i.value || (y.value = !1);
  }
  return re([s, o, a, i], C, {
    flush: "sync"
  }), re([l, c], N, {
    flush: "sync"
  }), re(i, T, {
    flush: "sync"
  }), Ma() && Pa(E), {
    x: dn(d),
    y: dn(f),
    strategy: dn(p),
    placement: dn(m),
    middlewareData: dn(v),
    isPositioned: dn(y),
    floatingStyles: _,
    update: C
  };
}
const Hl = {
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
}, [h1, Iv] = at("PopperContent");
var Rv = /* @__PURE__ */ j({
  inheritAttrs: !1,
  __name: "PopperContent",
  props: /* @__PURE__ */ Na({
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
  }, { ...Hl }),
  emits: ["placed"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Pl(), { forwardRef: s, currentElement: o } = ke(), a = P(), u = P(), { width: l, height: c } = eh(u), d = A(() => t.side + (t.align !== "center" ? `-${t.align}` : "")), f = A(() => typeof t.collisionPadding == "number" ? t.collisionPadding : {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...t.collisionPadding
    }), p = A(() => Array.isArray(t.collisionBoundary) ? t.collisionBoundary : [t.collisionBoundary]), m = A(() => ({
      padding: f.value,
      boundary: p.value.filter(_m),
      altBoundary: p.value.length > 0
    })), v = A(() => ({
      mainAxis: t.sideFlip,
      crossAxis: t.alignFlip
    })), y = Rp(() => [
      bv({
        mainAxis: t.sideOffset + c.value,
        alignmentAxis: t.alignOffset
      }),
      t.prioritizePosition && t.avoidCollisions && ua({
        ...m.value,
        ...v.value
      }),
      t.avoidCollisions && kv({
        mainAxis: !0,
        crossAxis: !!t.prioritizePosition,
        limiter: t.sticky === "partial" ? _v() : void 0,
        ...m.value
      }),
      !t.prioritizePosition && t.avoidCollisions && ua({
        ...m.value,
        ...v.value
      }),
      wv({
        ...m.value,
        apply: ({ elements: F, rects: $, availableWidth: O, availableHeight: M }) => {
          const { width: W, height: X } = $.reference, se = F.floating.style;
          se.setProperty("--reka-popper-available-width", `${O}px`), se.setProperty("--reka-popper-available-height", `${M}px`), se.setProperty("--reka-popper-anchor-width", `${W}px`), se.setProperty("--reka-popper-anchor-height", `${X}px`);
        }
      }),
      u.value && Cv({
        element: u.value,
        padding: t.arrowPadding
      }),
      xm({
        arrowWidth: l.value,
        arrowHeight: c.value
      }),
      t.hideWhenDetached && Tv({
        strategy: "referenceHidden",
        ...m.value
      })
    ]), _ = A(() => t.reference ?? i.anchor.value), { floatingStyles: b, placement: C, isPositioned: E, middlewareData: N } = Av(_, a, {
      strategy: t.positionStrategy,
      placement: d,
      whileElementsMounted: (...F) => yv(...F, {
        layoutShift: !t.disableUpdateOnLayoutShift,
        animationFrame: t.updatePositionStrategy === "always"
      }),
      middleware: y
    }), T = A(() => Ji(C.value)[0]), x = A(() => Ji(C.value)[1]);
    $a(() => {
      E.value && r("placed");
    });
    const S = A(() => {
      const F = N.value.arrow?.centerOffset !== 0;
      return t.hideShiftedArrow && F;
    }), w = P("");
    et(() => {
      o.value && (w.value = window.getComputedStyle(o.value).zIndex);
    });
    const I = A(() => N.value.arrow?.x ?? 0), D = A(() => N.value.arrow?.y ?? 0);
    return Iv({
      placedSide: T,
      onArrowChange: (F) => u.value = F,
      arrowX: I,
      arrowY: D,
      shouldHideArrow: S
    }), (F, $) => (k(), L("div", {
      ref_key: "floatingRef",
      ref: a,
      "data-reka-popper-content-wrapper": "",
      style: Yt({
        ...h(b),
        transform: h(E) ? h(b).transform : "translate(0, -200%)",
        minWidth: "max-content",
        zIndex: w.value,
        "--reka-popper-transform-origin": [h(N).transformOrigin?.x, h(N).transformOrigin?.y].join(" "),
        ...h(N).hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none"
        }
      })
    }, [q(h(je), ve({ ref: h(s) }, F.$attrs, {
      "as-child": t.asChild,
      as: F.as,
      "data-side": T.value,
      "data-align": x.value,
      style: { animation: h(E) ? void 0 : "none" }
    }), {
      default: z(() => [Z(F.$slots, "default")]),
      _: 3
    }, 16, [
      "as-child",
      "as",
      "data-side",
      "data-align",
      "style"
    ])], 4));
  }
}), Mv = Rv, Pv = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(Sm), mt(Ot(e)), {
      default: z(() => [Z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Ov = Pv;
function Dv() {
  const n = P(!1);
  return _e(() => {
    Gi("keydown", () => {
      n.value = !0;
    }, {
      capture: !0,
      passive: !0
    }), Gi(["pointerdown", "pointermove"], () => {
      n.value = !1;
    }, {
      capture: !0,
      passive: !0
    });
  }), n;
}
const Lv = /* @__PURE__ */ yl(Dv), [Xr, $v] = at(["MenuRoot", "MenuSub"], "MenuContext"), [Ps, Nv] = at("MenuRoot");
var Bv = /* @__PURE__ */ j({
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
    const t = n, r = e, { modal: i, dir: s } = _n(t), o = Ss(s), a = /* @__PURE__ */ Kn(t, "open", r), u = P(), l = Lv();
    return $v({
      open: a,
      onOpenChange: (c) => {
        a.value = c;
      },
      content: u,
      onContentChange: (c) => {
        u.value = c;
      }
    }), Nv({
      onClose: () => {
        a.value = !1;
      },
      isUsingKeyboardRef: l,
      dir: o,
      modal: i
    }), (c, d) => (k(), V(h(wm), null, {
      default: z(() => [Z(c.$slots, "default")]),
      _: 3
    }));
  }
}), zv = Bv;
const [Wl, Fv] = at("MenuContent");
var qv = /* @__PURE__ */ j({
  __name: "MenuContentImpl",
  props: /* @__PURE__ */ Na({
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
  }, { ...Hl }),
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
    const t = n, r = e, i = Xr(), s = Ps(), { trapFocus: o, disableOutsidePointerEvents: a, loop: u } = _n(t);
    jp(), bl(a.value);
    const l = P(""), c = P(0), d = P(0), f = P(null), p = P("right"), m = P(0), v = P(null), y = P(), { forwardRef: _, currentElement: b } = ke(), { handleTypeaheadSearch: C } = nh();
    re(b, (w) => {
      i.onContentChange(w);
    }), Qt(() => {
      window.clearTimeout(c.value);
    });
    function E(w) {
      return p.value === f.value?.side && Ih(w, f.value?.area);
    }
    async function N(w) {
      r("openAutoFocus", w), !w.defaultPrevented && (w.preventDefault(), b.value?.focus({ preventScroll: !0 }));
    }
    function T(w) {
      if (w.defaultPrevented) return;
      const D = w.target.closest("[data-reka-menu-content]") === w.currentTarget, F = w.ctrlKey || w.altKey || w.metaKey, $ = w.key.length === 1, O = Ip(w, Ue(), b.value, {
        loop: u.value,
        arrowKeyOptions: "vertical",
        dir: s?.dir.value,
        focus: !0,
        attributeName: "[data-reka-collection-item]:not([data-disabled])"
      });
      if (O) return O?.focus();
      if (w.code === "Space") return;
      const M = y.value?.getItems() ?? [];
      if (D && (w.key === "Tab" && w.preventDefault(), !F && $ && C(w.key, M)), w.target !== b.value || !Eh.includes(w.key)) return;
      w.preventDefault();
      const W = [...M.map((X) => X.ref)];
      El.includes(w.key) && W.reverse(), Ch(W);
    }
    function x(w) {
      w?.currentTarget?.contains?.(w.target) || (window.clearTimeout(c.value), l.value = "");
    }
    function S(w) {
      if (!Qi(w)) return;
      const I = w.target, D = m.value !== w.clientX;
      if (w?.currentTarget?.contains(I) && D) {
        const F = w.clientX > m.value ? "right" : "left";
        p.value = F, m.value = w.clientX;
      }
    }
    return Fv({
      onItemEnter: (w) => !!E(w),
      onItemLeave: (w) => {
        E(w) || (b.value?.focus(), v.value = null);
      },
      onTriggerLeave: (w) => !!E(w),
      searchRef: l,
      pointerGraceTimerRef: d,
      onPointerGraceIntentChange: (w) => {
        f.value = w;
      }
    }), (w, I) => (k(), V(h(xl), {
      "as-child": "",
      trapped: h(o),
      onMountAutoFocus: N,
      onUnmountAutoFocus: I[7] || (I[7] = (D) => r("closeAutoFocus", D))
    }, {
      default: z(() => [q(h(Sl), {
        "as-child": "",
        "disable-outside-pointer-events": h(a),
        onEscapeKeyDown: I[2] || (I[2] = (D) => r("escapeKeyDown", D)),
        onPointerDownOutside: I[3] || (I[3] = (D) => r("pointerDownOutside", D)),
        onFocusOutside: I[4] || (I[4] = (D) => r("focusOutside", D)),
        onInteractOutside: I[5] || (I[5] = (D) => r("interactOutside", D)),
        onDismiss: I[6] || (I[6] = (D) => r("dismiss"))
      }, {
        default: z(() => [q(h(im), {
          ref_key: "rovingFocusGroupRef",
          ref: y,
          "current-tab-stop-id": v.value,
          "onUpdate:currentTabStopId": I[0] || (I[0] = (D) => v.value = D),
          "as-child": "",
          orientation: "vertical",
          dir: h(s).dir.value,
          loop: h(u),
          onEntryFocus: I[1] || (I[1] = (D) => {
            r("entryFocus", D), h(s).isUsingKeyboardRef.value || D.preventDefault();
          })
        }, {
          default: z(() => [q(h(Mv), {
            ref: h(_),
            role: "menu",
            as: w.as,
            "as-child": w.asChild,
            "aria-orientation": "vertical",
            "data-reka-menu-content": "",
            "data-state": h(Cl)(h(i).open.value),
            dir: h(s).dir.value,
            side: w.side,
            "side-offset": w.sideOffset,
            align: w.align,
            "align-offset": w.alignOffset,
            "avoid-collisions": w.avoidCollisions,
            "collision-boundary": w.collisionBoundary,
            "collision-padding": w.collisionPadding,
            "arrow-padding": w.arrowPadding,
            "prioritize-position": w.prioritizePosition,
            "position-strategy": w.positionStrategy,
            "update-position-strategy": w.updatePositionStrategy,
            sticky: w.sticky,
            "hide-when-detached": w.hideWhenDetached,
            reference: w.reference,
            onKeydown: T,
            onBlur: x,
            onPointermove: S
          }, {
            default: z(() => [Z(w.$slots, "default")]),
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
}), Ul = qv, Vv = /* @__PURE__ */ j({
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
    const e = n, t = Wl(), { forwardRef: r } = ke(), { CollectionItem: i } = _s(), s = P(!1);
    async function o(u) {
      u.defaultPrevented || Qi(u) && (e.disabled ? t.onItemLeave(u) : t.onItemEnter(u) || u.currentTarget?.focus({ preventScroll: !0 }));
    }
    async function a(u) {
      await Re(), !u.defaultPrevented && Qi(u) && t.onItemLeave(u);
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
          await Re(), !(c.defaultPrevented || u.disabled) && (s.value = !0);
        }),
        onBlur: l[1] || (l[1] = async (c) => {
          await Re(), !c.defaultPrevented && (s.value = !1);
        })
      }), {
        default: z(() => [Z(u.$slots, "default")]),
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
}), Hv = Vv, Wv = /* @__PURE__ */ j({
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
    const t = n, r = e, { forwardRef: i, currentElement: s } = ke(), o = Ps(), a = Wl(), u = P(!1);
    async function l() {
      const c = s.value;
      if (!t.disabled && c) {
        const d = new CustomEvent(_h, {
          bubbles: !0,
          cancelable: !0
        });
        r("select", d), await Re(), d.defaultPrevented ? u.value = !1 : o.onClose();
      }
    }
    return (c, d) => (k(), V(Hv, ve(t, {
      ref: h(i),
      onClick: l,
      onPointerdown: d[0] || (d[0] = () => {
        u.value = !0;
      }),
      onPointerup: d[1] || (d[1] = async (f) => {
        await Re(), !f.defaultPrevented && (u.value || f.currentTarget?.click());
      }),
      onKeydown: d[2] || (d[2] = async (f) => {
        const p = h(a).searchRef.value !== "";
        c.disabled || p && f.key === " " || h(Zi).includes(f.key) && (f.currentTarget.click(), f.preventDefault());
      })
    }), {
      default: z(() => [Z(c.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Uv = Wv, jv = /* @__PURE__ */ j({
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
    const t = n, r = e, i = Hr(t, r), s = Xr(), { forwardRef: o, currentElement: a } = ke();
    return wl(a), (u, l) => (k(), V(Ul, ve(h(i), {
      ref: h(o),
      "trap-focus": h(s).open.value,
      "disable-outside-pointer-events": h(s).open.value,
      "disable-outside-scroll": !0,
      onDismiss: l[0] || (l[0] = (c) => h(s).onOpenChange(!1)),
      onFocusOutside: l[1] || (l[1] = Le((c) => r("focusOutside", c), ["prevent"]))
    }), {
      default: z(() => [Z(u.$slots, "default")]),
      _: 3
    }, 16, ["trap-focus", "disable-outside-pointer-events"]));
  }
}), Gv = jv, Kv = /* @__PURE__ */ j({
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
    const i = Hr(n, e), s = Xr();
    return (o, a) => (k(), V(Ul, ve(h(i), {
      "trap-focus": !1,
      "disable-outside-pointer-events": !1,
      "disable-outside-scroll": !1,
      onDismiss: a[0] || (a[0] = (u) => h(s).onOpenChange(!1))
    }), {
      default: z(() => [Z(o.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Xv = Kv, Yv = /* @__PURE__ */ j({
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
    const i = Hr(n, e), s = Xr(), o = Ps();
    return (a, u) => (k(), V(h(Wr), { present: a.forceMount || h(s).open.value }, {
      default: z(() => [h(o).modal.value ? (k(), V(Gv, mt(ve({ key: 0 }, {
        ...a.$attrs,
        ...h(i)
      })), {
        default: z(() => [Z(a.$slots, "default")]),
        _: 3
      }, 16)) : (k(), V(Xv, mt(ve({ key: 1 }, {
        ...a.$attrs,
        ...h(i)
      })), {
        default: z(() => [Z(a.$slots, "default")]),
        _: 3
      }, 16))]),
      _: 3
    }, 8, ["present"]));
  }
}), Zv = Yv, Qv = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(Il), mt(Ot(e)), {
      default: z(() => [Z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), Jv = Qv;
const [jl, eg] = at("DropdownMenuRoot");
var tg = /* @__PURE__ */ j({
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
    const i = /* @__PURE__ */ Kn(t, "open", r, {
      defaultValue: t.defaultOpen,
      passive: t.open === void 0
    }), s = P(), { modal: o, dir: a } = _n(t), u = Ss(a);
    return eg({
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
    }), (l, c) => (k(), V(h(zv), {
      open: h(i),
      "onUpdate:open": c[0] || (c[0] = (d) => rc(i) ? i.value = d : null),
      dir: h(u),
      modal: h(o)
    }, {
      default: z(() => [Z(l.$slots, "default", { open: h(i) })]),
      _: 3
    }, 8, [
      "open",
      "dir",
      "modal"
    ]));
  }
}), ng = tg, rg = /* @__PURE__ */ j({
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
    const i = Hr(n, e);
    ke();
    const s = jl(), o = P(!1);
    function a(u) {
      u.defaultPrevented || (o.value || setTimeout(() => {
        s.triggerElement.value?.focus();
      }, 0), o.value = !1, u.preventDefault());
    }
    return s.contentId ||= Vn(void 0, "reka-dropdown-menu-content"), (u, l) => (k(), V(h(Zv), ve(h(i), {
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
      default: z(() => [Z(u.$slots, "default")]),
      _: 3
    }, 16, ["id", "aria-labelledby"]));
  }
}), ig = rg, sg = /* @__PURE__ */ j({
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
    const t = n, i = Xn(e);
    return ke(), (s, o) => (k(), V(h(Uv), mt(Ot({
      ...t,
      ...h(i)
    })), {
      default: z(() => [Z(s.$slots, "default")]),
      _: 3
    }, 16));
  }
}), og = sg, ag = /* @__PURE__ */ j({
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
    return (t, r) => (k(), V(h(Jv), mt(Ot(e)), {
      default: z(() => [Z(t.$slots, "default")]),
      _: 3
    }, 16));
  }
}), lg = ag, ug = /* @__PURE__ */ j({
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
    const e = n, t = jl(), { forwardRef: r, currentElement: i } = ke();
    return _e(() => {
      t.triggerElement = i;
    }), t.triggerId ||= Vn(void 0, "reka-dropdown-menu-trigger"), (s, o) => (k(), V(h(Ov), { "as-child": "" }, {
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
          !s.disabled && a.button === 0 && a.ctrlKey === !1 && (h(t)?.onOpenToggle(), await Re(), h(t).open.value && a.preventDefault());
        }),
        onKeydown: o[1] || (o[1] = La((a) => {
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
        default: z(() => [Z(s.$slots, "default")]),
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
}), cg = ug;
const dg = /* @__PURE__ */ j({
  __name: "EditorCheckbox",
  props: {
    modelValue: { type: Boolean },
    ariaLabel: {}
  },
  emits: ["update:modelValue"],
  setup(n) {
    return (e, t) => (k(), V(h(vm), {
      "model-value": n.modelValue,
      "aria-label": n.ariaLabel,
      class: "checkbox",
      "onUpdate:modelValue": t[0] || (t[0] = (r) => e.$emit("update:modelValue", !!r)),
      onClick: t[1] || (t[1] = Le(() => {
      }, ["stop"]))
    }, {
      default: z(() => [
        q(h(ym), { class: "checkbox-indicator" }, {
          default: z(() => [
            q(h(rl), {
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
}), fg = /* @__PURE__ */ ie(dg, [["__scopeId", "data-v-024ee78b"]]);
function pg(n) {
  const e = n.trim().split(/\s+/).filter(Boolean);
  return e.length === 0 ? "?" : e.slice(0, 2).map((t) => t[0].toUpperCase()).join("");
}
const hg = ["title", "aria-label"], mg = /* @__PURE__ */ j({
  __name: "UserAvatar",
  props: {
    name: {},
    label: {}
  },
  setup(n) {
    const e = n, t = A(() => pg(e.name)), r = A(() => e.label ?? e.name);
    return (i, s) => (k(), L("span", {
      class: "user-avatar",
      role: "img",
      title: r.value,
      "aria-label": r.value
    }, K(t.value), 9, hg));
  }
}), vg = /* @__PURE__ */ ie(mg, [["__scopeId", "data-v-b8c5d31d"]]);
function Bn(n) {
  if (!n) return null;
  const e = n.getRootNode();
  if (e instanceof ShadowRoot) {
    const t = Gl(e);
    if (t) return t;
  }
  return n.ownerDocument?.getSelection() ?? null;
}
function gg(n) {
  const e = n.getRootNode();
  if (e instanceof ShadowRoot) {
    const r = Gl(e);
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
function Gl(n) {
  return n.getSelection?.() ?? null;
}
const yg = 3;
function bg(n, e) {
  n.focus();
  const t = n.firstChild;
  if (!t || t.nodeType !== yg) return;
  const r = Math.max(0, Math.min(e, t.nodeValue?.length ?? 0)), i = n.ownerDocument.createRange();
  i.setStart(t, r), i.collapse(!0);
  const s = Bn(n);
  s && (s.removeAllRanges(), s.addRange(i));
}
const Os = 3;
function Kl(n, e, t) {
  if (e.nodeType === Os)
    return Pi(n, e) + t;
  const r = e.childNodes[t];
  return r ? Pi(n, r) : Xl(e) + Pi(n, e);
}
function Pi(n, e) {
  let t = 0, r = !1;
  function i(s) {
    if (r || s === e) {
      r = !0;
      return;
    }
    if (s.nodeType === Os) {
      t += s.nodeValue?.length ?? 0;
      return;
    }
    for (const o of Array.from(s.childNodes))
      if (i(o), r) return;
  }
  return i(n), t;
}
function Xl(n) {
  if (n.nodeType === Os) return n.nodeValue?.length ?? 0;
  let e = 0;
  for (const t of Array.from(n.childNodes))
    e += Xl(t);
  return e;
}
function kg(n) {
  const e = gg(n);
  return !e || !n.contains(e.node) ? null : Kl(n, e.node, e.offset);
}
const wg = ["aria-label", "textContent"], Tg = /* @__PURE__ */ j({
  __name: "TurnTextEditor",
  props: {
    text: {},
    caretOffset: {}
  },
  emits: ["save", "cancel", "split"],
  setup(n, { expose: e, emit: t }) {
    const r = n, i = t, { t: s } = fe(), o = Qe("editable");
    let a = !1;
    _e(() => {
      const f = o.value;
      f && bg(f, r.caretOffset ?? r.text.length);
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
        const p = o.value, m = u(), v = (p && kg(p)) ?? m.length;
        l(() => i("split", m, v));
      } else f.key === "Escape" && (f.preventDefault(), l(() => i("cancel")));
    }
    function d() {
      l(() => i("save", u()));
    }
    return (f, p) => (k(), L("p", {
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
    }, null, 40, wg));
  }
}), Sg = /* @__PURE__ */ ie(Tg, [["__scopeId", "data-v-89d2dec3"]]), _g = {
  key: 0,
  class: "merge-turns"
}, xg = /* @__PURE__ */ j({
  __name: "MergeTurnsButton",
  props: {
    firstTurnId: {},
    secondTurnId: {}
  },
  setup(n) {
    const e = n, t = Pe(), { t: r } = fe(), i = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.text === "edit"
    ), s = A(
      () => !!t.transcriptionEditor?.getTurnLock(e.firstTurnId) || !!t.transcriptionEditor?.getTurnLock(e.secondTurnId)
    );
    function o() {
      t.transcriptionEditor.mergeTurns(e.firstTurnId, e.secondTurnId);
    }
    return (a, u) => i.value ? (k(), L("div", _g, [
      q(ne, {
        size: "sm",
        variant: "inverse",
        icon: "merge",
        disabled: s.value,
        "aria-label": h(r)("transcription.mergeTurns"),
        onClick: Le(o, ["stop"])
      }, null, 8, ["disabled", "aria-label"])
    ])) : Y("", !0);
  }
}), Eg = /* @__PURE__ */ ie(xg, [["__scopeId", "data-v-1c613cb1"]]), Cg = {
  key: 0,
  class: "popover-list__items"
}, Ag = {
  key: 0,
  class: "popover-list__divider"
}, Ig = { class: "popover-list__footer" }, Ds = /* @__PURE__ */ j({
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
    const t = n, r = e, i = P(!1), s = A({
      get: () => t.open !== void 0 ? t.open : i.value,
      set: (a) => {
        i.value = a, r("update:open", a);
      }
    });
    function o(a, u) {
      return t.itemKey ? t.itemKey(a) : u;
    }
    return (a, u) => (k(), V(h(ng), {
      open: s.value,
      "onUpdate:open": u[0] || (u[0] = (l) => s.value = l)
    }, {
      default: z(() => [
        q(h(cg), { "as-child": "" }, {
          default: z(() => [
            Z(a.$slots, "trigger")
          ]),
          _: 3
        }),
        q(h(lg), { disabled: "" }, {
          default: z(() => [
            q(h(ig), {
              class: "popover-list",
              "position-strategy": "absolute",
              side: n.side,
              align: n.align,
              "side-offset": n.sideOffset
            }, {
              default: z(() => [
                n.items.length > 0 ? (k(), L("ul", Cg, [
                  (k(!0), L(ye, null, qe(n.items, (l, c) => (k(), V(h(og), {
                    key: o(l, c),
                    as: "li",
                    class: Se(["popover-list__item", { "popover-list__item--current": n.isCurrent?.(l) }]),
                    onSelect: (d) => r("select", l)
                  }, {
                    default: z(() => [
                      Z(a.$slots, "item", { item: l })
                    ]),
                    _: 2
                  }, 1032, ["class", "onSelect"]))), 128))
                ])) : Y("", !0),
                a.$slots.footer ? (k(), L(ye, { key: 1 }, [
                  n.items.length > 0 ? (k(), L("div", Ag)) : Y("", !0),
                  B("div", Ig, [
                    Z(a.$slots, "footer")
                  ])
                ], 64)) : Y("", !0)
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
}), Rg = {
  key: 0,
  class: "form-field__header"
}, Mg = ["for"], Pg = {
  key: 0,
  class: "form-field__required",
  "aria-hidden": "true"
}, Og = { class: "form-field__input-wrapper" }, Dg = ["id", "disabled", "required", "aria-required", "aria-invalid", "aria-describedby"], Lg = ["value"], $g = ["type", "id", "disabled", "readonly", "placeholder", "autocomplete", "required", "aria-required", "aria-invalid", "aria-describedby"], Ng = {
  key: 3,
  class: "form-field__actions"
}, Bg = {
  key: 4,
  class: "form-field__actions form-field__actions--placeholder",
  "aria-hidden": "true"
}, zg = ["id"], Fg = { class: "form-field__error" }, qg = /* @__PURE__ */ j({
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
    const r = n, i = t, { t: s } = fe(), o = zr(), a = A(() => r.inputId ?? o), u = Qe("input"), l = r.modelValue ?? r.field.value ?? "", c = P(l), d = P(l), f = A(() => r.disabled ?? r.field.disabled ?? !1), p = A(() => r.field.required ?? !1), m = A(() => r.field.error ?? null), v = A(() => !!m.value), y = A(() => r.field.type ?? "text"), _ = A(() => r.field.placeholder ?? void 0), b = A(() => r.field.autocomplete ?? void 0), C = A(() => c.value !== d.value), E = A(
      () => r.withConfirmation && C.value
    ), N = A(() => ({
      "form-field": !0,
      [`form-field--${r.size}`]: !0,
      "form-field--inline": r.inline,
      "form-field--disabled": f.value,
      "form-field--error": v.value,
      "form-field--with-confirmation": r.withConfirmation
    })), T = A(() => ({
      "form-field__input": !0,
      "form-field__input--fullwidth": r.fullWidth,
      "form-field__input--error": v.value
    }));
    re(
      () => r.modelValue,
      (D) => {
        D !== void 0 && D !== c.value && (c.value = D, d.value = D);
      }
    ), re(
      () => r.field.value,
      (D) => {
        r.modelValue === void 0 && D !== void 0 && D !== c.value && (c.value = D, d.value = D);
      }
    );
    function x() {
      r.withConfirmation || (i("update:modelValue", c.value), i("input", c.value));
    }
    function S() {
      C.value && (d.value = c.value, i("update:modelValue", c.value), i("input", c.value), i("on-confirm"));
    }
    function w() {
      C.value && (c.value = d.value), i("on-cancel");
    }
    function I(D) {
      i("keydown", D), !(!r.withConfirmation || D.defaultPrevented) && (D.key === "Enter" && C.value ? (D.preventDefault(), S()) : D.key === "Escape" && (D.preventDefault(), w()));
    }
    return _e(() => {
      r.focus && u.value?.focus();
    }), e({
      focus: () => u.value?.focus(),
      blur: () => u.value?.blur(),
      select: () => u.value?.select()
    }), (D, F) => (k(), L("div", {
      class: Se(N.value)
    }, [
      n.field.label ? (k(), L("div", Rg, [
        B("label", {
          class: "form-field__label",
          for: a.value
        }, [
          pe(K(n.field.label) + " ", 1),
          p.value ? (k(), L("span", Pg, "*")) : Y("", !0)
        ], 8, Mg),
        Z(D.$slots, "content-after-label", {}, void 0, !0)
      ])) : Y("", !0),
      B("div", Og, [
        Z(D.$slots, "default", {}, void 0, !0),
        D.$slots["custom-input"] ? Z(D.$slots, "custom-input", {
          key: 0,
          id: a.value,
          disabled: f.value
        }, void 0, !0) : n.select ? Fn((k(), L("select", ve({
          key: 1,
          ref: "input",
          "onUpdate:modelValue": F[0] || (F[0] = ($) => c.value = $),
          class: [T.value, "form-field__input--select"],
          id: a.value,
          disabled: f.value,
          required: p.value,
          "aria-required": p.value || void 0,
          "aria-invalid": v.value || void 0,
          "aria-describedby": v.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onChange: x,
          onKeydown: I,
          onBlur: F[1] || (F[1] = ($) => i("blur", $)),
          onFocus: F[2] || (F[2] = ($) => i("focus", $))
        }), [
          (k(!0), L(ye, null, qe(n.options, ($) => (k(), L("option", {
            key: $.value,
            value: $.value
          }, K($.label), 9, Lg))), 128))
        ], 16, Dg)), [
          [ic, c.value]
        ]) : Fn((k(), L("input", ve({
          key: 2,
          ref: "input",
          "onUpdate:modelValue": F[3] || (F[3] = ($) => c.value = $),
          class: T.value,
          type: y.value,
          id: a.value,
          disabled: f.value,
          readonly: n.readonly,
          placeholder: _.value,
          autocomplete: b.value,
          required: p.value,
          "aria-required": p.value || void 0,
          "aria-invalid": v.value || void 0,
          "aria-describedby": v.value ? `${a.value}-error` : void 0
        }, n.field.customParams, {
          onInput: x,
          onKeydown: I,
          onBlur: F[4] || (F[4] = ($) => i("blur", $)),
          onFocus: F[5] || (F[5] = ($) => i("focus", $))
        }), null, 16, $g)), [
          [sc, c.value]
        ]),
        E.value ? (k(), L("div", Ng, [
          q(ne, {
            icon: "x",
            variant: "tertiary",
            size: n.size,
            "aria-label": h(s)("form.cancel"),
            onMousedown: F[6] || (F[6] = Le(() => {
            }, ["prevent"])),
            onClick: w
          }, null, 8, ["size", "aria-label"]),
          q(ne, {
            icon: "check",
            variant: "primary",
            size: n.size,
            "aria-label": h(s)("form.apply"),
            onMousedown: F[7] || (F[7] = Le(() => {
            }, ["prevent"])),
            onClick: S
          }, null, 8, ["size", "aria-label"])
        ])) : n.withConfirmation ? (k(), L("div", Bg)) : Y("", !0),
        Z(D.$slots, "content-after-input", {}, void 0, !0)
      ]),
      Z(D.$slots, "content-bottom-input", {}, void 0, !0),
      v.value ? (k(), L("div", {
        key: 1,
        id: `${a.value}-error`,
        class: "form-field__info"
      }, [
        B("span", Fg, K(m.value), 1)
      ], 8, zg)) : Y("", !0)
    ], 2));
  }
}), Cn = /* @__PURE__ */ ie(qg, [["__scopeId", "data-v-31189879"]]);
function Yl(n, e, t) {
  const r = t.trim(), i = n.speakers.all.get(e);
  !i || !r || r === i.name || n.speakers.update(e, { name: r });
}
function Ls(n, e, t) {
  for (const r of n.channels.values())
    for (const i of r.translations.values()) {
      const s = i.getTurn(e);
      !s || s.speakerId === t || i.updateTurn(e, { speakerId: t });
    }
}
function Zl(n, e, t) {
  const r = t.trim();
  if (!r) return null;
  const i = za(n.speakers.all, crypto.randomUUID(), r);
  return n.speakers.updateOrCreate(i), Ls(n, e, i.id), i.id;
}
function Ql(n, e, t) {
  if (e !== t && !(!n.speakers.all.has(e) || !n.speakers.all.has(t))) {
    for (const r of n.channels.values())
      for (const i of r.translations.values())
        for (const s of i.turns.value)
          s.speakerId === e && i.updateTurn(s.id, { speakerId: t });
    n.speakers.delete(e);
  }
}
function Vg(n, e) {
  const t = n.activeChannel.value?.activeTranslation.value;
  return t ? t.turns.value.filter((r) => r.speakerId === e).length : 0;
}
const Hg = {
  type: "button",
  class: "speaker-popover-trigger"
}, Wg = { class: "speaker-popover-name" }, Ug = /* @__PURE__ */ j({
  __name: "SpeakerPopover",
  props: {
    turnId: {},
    currentSpeakerId: {},
    initialOpen: { type: Boolean }
  },
  setup(n) {
    const e = n, t = Pe(), { t: r } = fe(), i = P(e.initialOpen ?? !1), s = P(!1), o = P(""), a = Qe("newInput"), u = A(() => Array.from(t.speakers.all.values())), l = A(() => ({
      placeholder: r("speakerPopover.newSpeakerPlaceholder"),
      customParams: { "aria-label": r("speakerPopover.newSpeaker") }
    }));
    re(i, (v) => {
      v || (s.value = !1, o.value = "");
    });
    async function c() {
      s.value = !0, o.value = "", await Re(), a.value?.focus();
    }
    function d(v) {
      v.id !== e.currentSpeakerId && (t.transcriptionEditor ? t.transcriptionEditor.updateTurnSpeaker(e.turnId, {
        speakerId: v.id
      }) : Ls(t, e.turnId, v.id)), i.value = !1;
    }
    function f() {
      const v = o.value.trim();
      if (!v) {
        s.value = !1;
        return;
      }
      t.transcriptionEditor ? t.transcriptionEditor.updateTurnSpeaker(e.turnId, {
        speakerName: v
      }) : Zl(t, e.turnId, v), i.value = !1;
    }
    function p(v) {
      v.stopPropagation();
    }
    function m() {
      s.value = !1;
    }
    return (v, y) => (k(), V(Ds, {
      open: i.value,
      "onUpdate:open": y[1] || (y[1] = (_) => i.value = _),
      items: u.value,
      "item-key": (_) => _.id,
      "is-current": (_) => _.id === n.currentSpeakerId,
      onSelect: d
    }, {
      trigger: z(() => [
        B("button", Hg, [
          Z(v.$slots, "default", {}, void 0, !0)
        ])
      ]),
      item: z(({ item: _ }) => [
        q(bs, {
          color: _.color
        }, null, 8, ["color"]),
        B("span", Wg, K(_.name), 1)
      ]),
      footer: z(() => [
        s.value ? (k(), V(Cn, {
          key: 1,
          ref: "newInput",
          modelValue: o.value,
          "onUpdate:modelValue": y[0] || (y[0] = (_) => o.value = _),
          field: l.value,
          size: "sm",
          "full-width": "",
          "with-confirmation": "",
          onKeydown: p,
          onOnConfirm: f,
          onOnCancel: m
        }, null, 8, ["modelValue", "field"])) : (k(), V(ne, {
          key: 0,
          icon: "user-plus",
          variant: "transparent",
          block: "",
          onClick: c
        }, {
          default: z(() => [
            pe(K(h(r)("speakerPopover.newSpeaker")), 1)
          ]),
          _: 1
        }))
      ]),
      _: 3
    }, 8, ["open", "items", "item-key", "is-current"]));
  }
}), jg = /* @__PURE__ */ ie(Ug, [["__scopeId", "data-v-03fcb342"]]), Jl = /* @__PURE__ */ Symbol("turnSelection");
function da(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function Gg(n, e, t) {
  const r = Un(/* @__PURE__ */ new Map());
  let i = null;
  const s = A(() => r.size), o = A(() => r.size > 0);
  function a(b) {
    return r.has(b);
  }
  function u() {
    return t.transcriptionEditor !== void 0;
  }
  function l(b) {
    u() || (r.has(b) ? r.delete(b) : r.set(b, !0), i = b);
  }
  function c(b) {
    if (u()) return;
    if (i === null) {
      l(b);
      return;
    }
    const C = n.value.map((S) => S.id), E = C.indexOf(i), N = C.indexOf(b);
    if (E === -1 || N === -1) {
      l(b);
      return;
    }
    const T = Math.min(E, N), x = Math.max(E, N);
    for (let S = T; S <= x; S++) {
      const w = C[S];
      w != null && r.set(w, !0);
    }
  }
  function d() {
    r.clear(), i = null;
  }
  async function f() {
    const C = n.value.filter((E) => r.has(E.id)).map(da).join(`

`);
    await navigator.clipboard.writeText(C);
  }
  async function p() {
    const C = n.value.filter((E) => r.has(E.id)).map((E) => {
      const T = (E.speakerId ? e.get(E.speakerId) : void 0)?.name ?? "", x = E.startTime != null ? qn(E.startTime) : "", S = [T, x].filter(Boolean).join(" (") + (x ? ")" : ""), w = da(E);
      return S ? `${S}
${w}` : w;
    });
    await navigator.clipboard.writeText(C.join(`

`));
  }
  re(
    () => n.value,
    (b) => {
      if (r.size === 0) return;
      const C = new Set(b.map((E) => E.id));
      for (const E of [...r.keys()])
        C.has(E) || r.delete(E);
    }
  );
  const m = t.on("channel:change", d), v = t.on("translation:change", d);
  function y(b) {
    b.key === "Escape" && r.size > 0 && d();
  }
  _e(() => {
    document.addEventListener("keydown", y);
  }), bt(() => {
    document.removeEventListener("keydown", y), m(), v();
  });
  const _ = {
    count: s,
    hasSelection: o,
    isSelected: a,
    toggle: l,
    selectRange: c,
    clear: d,
    copyText: f,
    copyWithMetadata: p
  };
  return Sn(Jl, _), _;
}
function eu() {
  const n = jn(Jl);
  if (!n)
    throw new Error("useTurnSelection() requires provideTurnSelection()");
  return n;
}
function $s(n) {
  return n.words.length > 0 ? n.words.map((e) => e.text).join(" ") : n.text ?? "";
}
function Kg(n, e, t) {
  if (typeof n.caretPositionFromPoint == "function") {
    const i = n.caretPositionFromPoint(e, t);
    return i ? { node: i.offsetNode, offset: i.offset } : null;
  }
  const r = n.caretRangeFromPoint?.(e, t);
  return r ? { node: r.startContainer, offset: r.startOffset } : null;
}
function Xg(n, e, t) {
  const r = Kg(n.ownerDocument, e, t);
  return !r || !n.contains(r.node) ? null : Kl(n, r.node, r.offset);
}
function Yg(n, e) {
  return n.find(
    (t) => t.charStart != null && t.charEnd != null && t.charStart <= e && e < t.charEnd
  );
}
const Zg = ["data-turn-active", "aria-selected"], Qg = {
  key: 4,
  class: "turn-edit-actions"
}, Jg = ["role", "tabindex", "aria-label", "aria-disabled"], ey = ["data-word-active"], ty = /* @__PURE__ */ j({
  __name: "TranscriptionTurn",
  props: {
    turn: {},
    speaker: {},
    partial: { type: Boolean },
    live: { type: Boolean },
    previousTurnId: {}
  },
  setup(n) {
    const e = n, t = Pe(), r = eu(), { t: i } = fe(), s = A(() => e.turn.words.length > 0), o = A(() => {
      if (!t.audio?.src.value || !s.value) return null;
      const M = t.audio.currentTime.value, { startTime: W, endTime: X, words: se } = e.turn;
      return W == null || X == null || M < W || M > X ? null : tl(se, M);
    }), a = A(() => {
      if (!t.audio?.src.value || e.turn.startTime == null || e.turn.endTime == null || Jd(e.turn.words)) return !1;
      const M = t.audio.currentTime.value;
      return M >= e.turn.startTime && M <= e.turn.endTime;
    }), u = A(() => e.speaker?.color ?? "transparent"), l = A(() => r.isSelected(e.turn.id)), c = A(() => {
      const M = e.speaker?.name ?? "", W = l.value ? "selection.deselect" : "selection.select";
      return i(W).replace("{name}", M);
    }), d = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.text === "edit" && !e.partial && !e.live
    ), f = A(
      () => t.transcriptionEditor?.editingTurnId.value === e.turn.id
    ), p = A(
      () => f.value ? void 0 : t.transcriptionEditor?.getTurnLock(e.turn.id)
    ), m = A(
      () => p.value ? i("transcription.lockedBy").replace("{name}", p.value.userName) : ""
    ), v = A(() => d.value && !p.value), y = A(() => $s(e.turn)), _ = Qe("editor");
    function b(M) {
      const W = M.currentTarget, X = Xg(
        W,
        M.clientX,
        M.clientY
      );
      C(X), v.value && t.transcriptionEditor.beginEdit(
        e.turn.id,
        X ?? y.value.length
      );
    }
    function C(M) {
      if (!t.audio) return;
      const X = (M !== null ? Yg(e.turn.words, M) : void 0)?.startTime ?? e.turn.startTime;
      X != null && (t.audio.seekTo(X), t.audio.pause());
    }
    function E(M) {
      !v.value || M.key !== "Enter" || (M.preventDefault(), t.transcriptionEditor.beginEdit(e.turn.id, 0));
    }
    function N(M) {
      t.transcriptionEditor.saveTurn(M);
    }
    function T() {
      t.transcriptionEditor.cancelEdit();
    }
    function x(M, W) {
      t.transcriptionEditor.splitTurn(M, W);
    }
    function S() {
      t.transcriptionEditor.saveTurn(
        _.value?.getText() ?? y.value
      );
    }
    function w() {
      t.transcriptionEditor.cancelEdit();
    }
    const I = A(
      () => t.transcriptionEditor !== void 0 && t.capabilities.value.speakers === "edit" && !e.partial && !e.live
    ), D = P(!1);
    function F() {
      D.value = !0;
    }
    function $(M) {
      f.value || (M.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id));
    }
    function O(M) {
      M.shiftKey ? r.selectRange(e.turn.id) : r.toggle(e.turn.id);
    }
    return (M, W) => (k(), L("section", {
      class: Se(["turn", {
        "turn--active": a.value,
        "turn--partial": n.partial,
        "turn--selected": l.value
      }]),
      "data-turn-active": a.value || n.partial || n.live || void 0,
      style: Yt({ "--speaker-color": u.value }),
      "aria-selected": h(r).hasSelection.value ? l.value : void 0
    }, [
      n.previousTurnId && !n.partial && !n.live ? (k(), V(Eg, {
        key: 0,
        "first-turn-id": n.previousTurnId,
        "second-turn-id": n.turn.id
      }, null, 8, ["first-turn-id", "second-turn-id"])) : Y("", !0),
      n.partial ? Y("", !0) : (k(), L("div", {
        key: 1,
        class: "turn-header",
        onClick: $
      }, [
        h(r).hasSelection.value ? (k(), V(fg, {
          key: 0,
          "model-value": l.value,
          "aria-label": c.value,
          onClick: Le(O, ["stop"])
        }, null, 8, ["model-value", "aria-label"])) : Y("", !0),
        D.value ? (k(), V(jg, {
          key: 1,
          "turn-id": n.turn.id,
          "current-speaker-id": n.turn.speakerId,
          "initial-open": ""
        }, {
          default: z(() => [
            q(_i, {
              speaker: n.speaker,
              "start-time": n.turn.startTime,
              "start-date": n.turn.startDate,
              language: n.turn.language,
              interactive: ""
            }, null, 8, ["speaker", "start-time", "start-date", "language"])
          ]),
          _: 1
        }, 8, ["turn-id", "current-speaker-id"])) : I.value ? (k(), L("button", {
          key: 2,
          type: "button",
          class: "speaker-trigger",
          onClick: Le(F, ["stop"])
        }, [
          q(_i, {
            speaker: n.speaker,
            "start-time": n.turn.startTime,
            "start-date": n.turn.startDate,
            language: n.turn.language,
            interactive: ""
          }, null, 8, ["speaker", "start-time", "start-date", "language"])
        ])) : (k(), V(_i, {
          key: 3,
          speaker: n.speaker,
          "start-time": n.turn.startTime,
          "start-date": n.turn.startDate,
          language: n.turn.language
        }, null, 8, ["speaker", "start-time", "start-date", "language"])),
        f.value || p.value ? (k(), L("div", Qg, [
          f.value ? (k(), L(ye, { key: 0 }, [
            q(ne, {
              size: "sm",
              variant: "tertiary",
              icon: "x",
              "aria-label": h(i)("transcription.cancelEdit"),
              onMousedown: W[0] || (W[0] = Le(() => {
              }, ["prevent"])),
              onClick: Le(w, ["stop"])
            }, null, 8, ["aria-label"]),
            q(ne, {
              size: "sm",
              variant: "primary",
              icon: "check",
              "aria-label": h(i)("transcription.saveEdit"),
              onMousedown: W[1] || (W[1] = Le(() => {
              }, ["prevent"])),
              onClick: Le(S, ["stop"])
            }, null, 8, ["aria-label"])
          ], 64)) : (k(), V(vg, {
            key: 1,
            name: p.value.userName,
            label: m.value,
            onClick: W[2] || (W[2] = Le(() => {
            }, ["stop"]))
          }, null, 8, ["name", "label"]))
        ])) : Y("", !0)
      ])),
      f.value ? (k(), V(Sg, {
        key: 2,
        ref: "editor",
        text: y.value,
        "caret-offset": h(t).transcriptionEditor?.editingCaretOffset.value,
        class: "turn-text",
        onSave: N,
        onCancel: T,
        onSplit: x
      }, null, 8, ["text", "caret-offset"])) : (k(), L("p", {
        key: 3,
        class: Se(["turn-text", { "turn-text--editable": v.value }]),
        role: v.value ? "button" : void 0,
        tabindex: v.value ? 0 : void 0,
        "aria-label": v.value ? h(i)("transcription.editTurn") : void 0,
        "aria-disabled": d.value && p.value ? !0 : void 0,
        onClick: b,
        onKeydown: E
      }, [
        s.value ? (k(!0), L(ye, { key: 0 }, qe(n.turn.words, (X, se) => (k(), L(ye, {
          key: X.id
        }, [
          B("span", {
            class: Se({ "word--active": X.id === o.value }),
            "data-word-active": X.id === o.value || void 0
          }, K(X.text), 11, ey),
          pe(K(se < n.turn.words.length - 1 ? " " : ""), 1)
        ], 64))), 128)) : n.turn.text ? (k(), L(ye, { key: 1 }, [
          pe(K(n.turn.text), 1)
        ], 64)) : Y("", !0)
      ], 42, Jg))
    ], 14, Zg));
  }
}), fa = /* @__PURE__ */ ie(ty, [["__scopeId", "data-v-7b4a2e52"]]), ny = {}, ry = {
  viewBox: "0 0 938 604",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
function iy(n, e) {
  return k(), L("svg", ry, [...e[0] || (e[0] = [
    oc('<polygon points="331.5,533.5 331.5,520.5 702.5,428.5 705.5,443.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><polygon points="564.5,469.5 555.5,452.5 544.5,455.5 542.5,472.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-452.14416,-495.30213)"></polygon><path d="m 317.61655,19.99224 c 0,0 79.97514,-5.452851 101.78654,56.34612 21.81141,61.79897 72.70468,172.67359 92.69846,189.03214 19.99379,16.35855 41.80519,59.98136 38.16995,74.52229" stroke="#3f3d56" stroke-miterlimit="10" stroke-width="9.08808"></path><path d="m 329.43106,19.083431 c 0,8.532657 -9.0733,15.449743 -23.62902,15.449743 -14.55571,0 -21.8114,-6.917086 -21.8114,-15.449743 0,-8.532657 7.25569,-15.4497427 21.8114,-15.4497427 14.55572,0 23.62902,6.9170857 23.62902,15.4497427 z" fill="currentColor" style="fill:#999999;"></path><polygon points="691.5,439.5 364.5,521.5 377.5,602.5 666.5,602.5" fill="#3f3d56" transform="matrix(1.8176168,0,0,1.8176168,-456.32371,-492.51252)"></polygon>', 5)
  ])]);
}
const sy = /* @__PURE__ */ ie(ny, [["render", iy]]), oy = { class: "transcription-empty" }, ay = { class: "message" }, ly = /* @__PURE__ */ j({
  __name: "TranscriptionEmpty",
  setup(n) {
    const { t: e } = fe();
    return (t, r) => (k(), L("div", oy, [
      q(sy, {
        class: "illustration",
        "aria-hidden": "true"
      }),
      B("p", ay, K(h(e)("transcription.empty")), 1)
    ]));
  }
}), uy = /* @__PURE__ */ ie(ly, [["__scopeId", "data-v-f82737e5"]]);
function tu(n, e) {
  return `${n}#${e}`;
}
function cy(n) {
  const e = n.lastIndexOf("#");
  if (e <= 0) return null;
  const t = n.slice(e + 1);
  if (t === "") return null;
  const r = Number(t);
  return !Number.isInteger(r) || r < 0 ? null : { turnId: n.slice(0, e), index: r };
}
const pa = /\S+/g;
function dy(n) {
  const e = [];
  if (!n) return e;
  pa.lastIndex = 0;
  let t;
  for (; (t = pa.exec(n)) !== null; )
    e.push({
      text: t[0],
      charStart: t.index,
      charEnd: t.index + t[0].length
    });
  return e;
}
function fy(n, e) {
  return dy(e).map((t, r) => ({
    id: tu(n, r),
    text: t.text,
    charStart: t.charStart,
    charEnd: t.charEnd
  }));
}
function nu(n, e) {
  const t = [];
  let r = 0;
  for (const i of e)
    for (const s of (i.text ?? "").split(/\s+/)) {
      if (!s) continue;
      const o = r, a = o + s.length;
      r = a + 1, t.push({
        id: tu(n, t.length),
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
function Ns(n, e) {
  return nu(
    n,
    e.map((t) => ({
      text: t.word ?? "",
      ...t.stime !== void 0 && { startTime: t.stime },
      ...t.etime !== void 0 && { endTime: t.etime },
      ...t.confidence !== void 0 && { confidence: t.confidence }
    }))
  );
}
function py(n, e) {
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
function hy(n, e, t) {
  const r = cy(t);
  if (!r) return null;
  const s = e.activeChannel.value?.activeTranslation.value?.turns.value.find((o) => o.id === r.turnId);
  return s ? my(n, s, r.index) : null;
}
function my(n, e, t) {
  const r = e.words[t];
  if (!r || r.charStart == null || r.charEnd == null) return null;
  const i = n.querySelector(
    `[data-turn-id="${vy(e.id)}"] .turn-text`
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
function vy(n) {
  return typeof CSS < "u" && CSS.escape ? CSS.escape(n) : n.replace(/["\\]/g, "\\$&");
}
const gy = /* @__PURE__ */ new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " "
  // Space
]);
function yy(n) {
  const e = Pe(), t = P(!0), r = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  function i() {
    const c = n.value;
    if (!c || !t.value) return;
    const d = r ? "instant" : "smooth", f = e.audio?.activeWordId.value;
    if (f) {
      const y = hy(c, e, f)?.getBoundingClientRect();
      if (y && (y.height > 0 || y.width > 0)) {
        const _ = c.getBoundingClientRect(), b = y.top + y.height / 2 - (_.top + c.clientHeight / 2);
        c.scrollBy({ top: b, behavior: d });
        return;
      }
    }
    const p = e.audio?.activeTurnId.value, m = (
      // Non-editor list view still tags the active word this way.
      c.querySelector("[data-word-active]") ?? (p ? c.querySelector(`[data-turn-id="${p}"]`) : null)
    );
    m && m.scrollIntoView({ behavior: d, block: "center" });
  }
  re(
    () => e.audio?.activeWordId.value,
    (c) => {
      c && i();
    },
    { flush: "post" }
  ), re(
    () => e.audio?.activeTurnId.value,
    (c) => {
      c && i();
    },
    { flush: "post" }
  ), re(
    () => e.audio?.isPlaying.value,
    (c) => {
      c && (t.value = !0);
    }
  );
  function s() {
    t.value = !1;
  }
  function o(c) {
    gy.has(c.key) && s();
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
  }), bt(() => {
    u(s);
  });
  function l() {
    t.value = !0, i();
  }
  return { isFollowing: t, resumeFollow: l };
}
const by = { class: "transcription-panel" }, ky = {
  ref: "scrollContainer",
  class: "scroll-container"
}, wy = { class: "turns-container" }, Ty = {
  key: 0,
  class: "history-loading",
  role: "status"
}, Sy = {
  key: 1,
  class: "history-start"
}, _y = /* @__PURE__ */ j({
  __name: "TranscriptionPanel",
  props: {
    turns: {},
    speakers: {}
  },
  setup(n) {
    const e = n, { t } = fe(), r = Pe(), i = Qe("scrollContainer"), s = A(() => {
      const T = r.live?.partial.value ?? null;
      return T === null ? null : {
        id: "__partial__",
        speakerId: null,
        text: T,
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
    ), { isFollowing: f, resumeFollow: p } = yy(i), { scrollRef: m, contentRef: v, isAtBottom: y, scrollToBottom: _ } = hl();
    _e(() => {
      r.live && (m.value = i.value, v.value = i.value?.querySelector(".turns-container") ?? null);
    });
    const b = A(
      () => !f.value && a.value || !y.value && o.value
    );
    function C() {
      a.value ? p() : _();
    }
    const E = Ud(() => {
      const T = l.value;
      if (!T?.hasMoreHistory.value || T.isLoadingHistory.value || e.turns.length === 0) return;
      const x = u.value;
      x && r.emit("scroll:top", { translationId: x.id });
    }, 500);
    function N() {
      const T = i.value;
      T && T.scrollTop < 100 && E();
    }
    return re(
      () => e.turns,
      (T, x) => {
        const S = T.length, w = x.length;
        if (S > w && !y.value && T[0]?.id != x[0]?.id) {
          const I = S - w, D = e.turns[I]?.id;
          if (!D || !m.value) return;
          Re(() => {
            m.value?.querySelector(
              `[data-turn-id="${D}"]`
            )?.scrollIntoView({ block: "start", behavior: "instant" });
          });
        }
      },
      { flush: "pre" }
    ), _e(() => {
      i.value?.addEventListener("scroll", N, {
        passive: !0
      });
    }), bt(() => {
      i.value?.removeEventListener("scroll", N);
    }), (T, x) => (k(), L("article", by, [
      B("div", ky, [
        B("div", wy, [
          c.value ? (k(), L("div", Ty, [...x[2] || (x[2] = [
            B("progress", null, null, -1)
          ])])) : Y("", !0),
          !d.value && n.turns.length > 0 ? (k(), L("div", Sy, K(h(t)("transcription.historyStart")), 1)) : Y("", !0),
          n.turns.length === 0 && !c.value && !s.value ? (k(), V(uy, {
            key: 2,
            class: "transcription-empty"
          })) : Y("", !0),
          (k(!0), L(ye, null, qe(n.turns, (S, w, I, D) => {
            const F = [
              S,
              n.speakers.get(S.speakerId ?? ""),
              o.value && !s.value && w === n.turns.length - 1,
              n.turns[w - 1]?.id
            ];
            if (D && D.key === S.id && ac(D, F)) return D;
            const $ = (k(), V(fa, {
              "data-turn-id": S.id,
              key: S.id,
              turn: S,
              speaker: S.speakerId ? n.speakers.get(S.speakerId) : void 0,
              live: o.value && !s.value && w === n.turns.length - 1,
              "previous-turn-id": n.turns[w - 1]?.id
            }, null, 8, ["data-turn-id", "turn", "speaker", "live", "previous-turn-id"]));
            return $.memo = F, $;
          }, x, 0), 128)),
          s.value ? (k(), V(fa, {
            key: "__partial__",
            turn: s.value,
            partial: ""
          }, null, 8, ["turn"])) : Y("", !0)
        ]),
        q(Fr, { name: "fade-slide" }, {
          default: z(() => [
            b.value ? (k(), V(ne, {
              key: 0,
              size: "sm",
              icon: "arrow-down",
              class: "resume-scroll-btn",
              "aria-label": h(t)("transcription.resumeScroll"),
              onClick: C
            }, {
              default: z(() => [
                pe(K(h(t)("transcription.resumeScroll")), 1)
              ]),
              _: 1
            }, 8, ["aria-label"])) : Y("", !0)
          ]),
          _: 1
        })
      ], 512)
    ]));
  }
}), ha = /* @__PURE__ */ ie(_y, [["__scopeId", "data-v-873bbd6b"]]), xy = ["data-status"], Ey = {
  key: 0,
  class: "document-article__toolbar",
  role: "toolbar"
}, Cy = { class: "document-article__toolbar-left" }, Ay = { class: "document-article__toolbar-center" }, Iy = { class: "document-article__toolbar-right" }, Ry = { class: "document-article__body" }, My = {
  key: 0,
  class: "document-article__center document-article__center--processing",
  role: "status",
  "aria-live": "polite"
}, Py = ["value"], Oy = {
  key: 0,
  class: "document-article__progress-value"
}, Dy = {
  key: 1,
  class: "document-article__center document-article__center--error",
  role: "alert"
}, Ly = { class: "document-article__error-text" }, $y = /* @__PURE__ */ j({
  __name: "DocumentArticle",
  props: {
    status: { default: "done" },
    progress: {},
    errorMessage: {}
  },
  emits: ["retry"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = fe(), s = A(
      () => t.errorMessage || i("llmService.errorTemporary")
    ), o = A(() => {
      const a = t.progress;
      return a == null || !Number.isFinite(a) ? null : Math.max(0, Math.min(100, Math.round(a)));
    });
    return (a, u) => (k(), L("article", {
      class: "document-article",
      "data-status": t.status
    }, [
      a.$slots["toolbar-left"] || a.$slots["toolbar-center"] || a.$slots["toolbar-right"] ? (k(), L("div", Ey, [
        B("div", Cy, [
          Z(a.$slots, "toolbar-left", {}, void 0, !0)
        ]),
        B("div", Ay, [
          Z(a.$slots, "toolbar-center", {}, void 0, !0)
        ]),
        B("div", Iy, [
          Z(a.$slots, "toolbar-right", {}, void 0, !0)
        ])
      ])) : Y("", !0),
      B("div", Ry, [
        t.status === "processing" ? (k(), L("div", My, [
          q(Ye, {
            name: "spinner",
            spin: "",
            size: 24
          }),
          B("progress", {
            class: "document-article__progress",
            max: 100,
            value: o.value ?? void 0
          }, null, 8, Py),
          o.value !== null ? (k(), L("span", Oy, K(o.value) + "% ", 1)) : Y("", !0)
        ])) : t.status === "error" ? (k(), L("div", Dy, [
          B("p", Ly, K(s.value), 1),
          q(ne, {
            variant: "primary",
            icon: "refresh-cw",
            onClick: u[0] || (u[0] = (l) => r("retry"))
          }, {
            default: z(() => [
              pe(K(h(i)("llmService.retry")), 1)
            ]),
            _: 1
          })
        ])) : Z(a.$slots, "default", { key: 2 }, void 0, !0)
      ])
    ], 8, xy));
  }
}), ru = /* @__PURE__ */ ie($y, [["__scopeId", "data-v-e5e27610"]]), Ny = /* @__PURE__ */ j({
  __name: "DownloadMenu",
  props: {
    formats: {},
    disabled: { type: Boolean },
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = fe();
    function s(o) {
      r("select", o.format);
    }
    return (o, a) => (k(), V(Ds, {
      items: t.formats,
      "item-key": (u) => u.format,
      align: "end",
      onSelect: s
    }, {
      trigger: z(() => [
        q(ne, {
          variant: "primary",
          icon: "download",
          "icon-right": "chevron-down",
          disabled: n.disabled,
          loading: n.loading
        }, {
          default: z(() => [
            pe(K(h(i)("llmService.download")), 1)
          ]),
          _: 1
        }, 8, ["disabled", "loading"])
      ]),
      item: z(({ item: u }) => [
        B("span", null, K(h(i)(u.labelKey)), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), By = { class: "verbatim-panel" }, zy = { class: "verbatim-panel__content" }, Fy = { class: "verbatim-panel__header" }, qy = { class: "verbatim-panel__doc-title" }, Vy = { class: "verbatim-panel__turns" }, Hy = { class: "verbatim-panel__turn-header" }, Wy = { class: "verbatim-panel__speaker-name" }, Uy = {
  key: 0,
  class: "verbatim-panel__meta"
}, jy = {
  key: 1,
  class: "verbatim-panel__meta"
}, Gy = { class: "verbatim-panel__text" }, Ky = /* @__PURE__ */ j({
  __name: "VerbatimPanel",
  setup(n) {
    const e = Pe(), { locale: t } = fe(), r = [
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
    return (f, p) => (k(), L("section", By, [
      q(ru, {
        formats: r,
        onExport: d
      }, {
        "toolbar-right": z(() => [
          q(Ny, {
            formats: r,
            onSelect: d
          })
        ]),
        default: z(() => [
          B("article", zy, [
            B("header", Fy, [
              B("h1", qy, K(o.value), 1)
            ]),
            B("ul", Vy, [
              (k(!0), L(ye, null, qe(i.value, (m) => (k(), L("li", {
                key: m.id,
                class: "verbatim-panel__turn"
              }, [
                B("header", Hy, [
                  B("strong", Wy, K(u(m.speakerId)), 1),
                  m.startTime != null ? (k(), L("span", Uy, [
                    p[0] || (p[0] = B("span", {
                      class: "verbatim-panel__sep",
                      "aria-hidden": "true"
                    }, "·", -1)),
                    B("time", null, K(qn(m.startTime)), 1)
                  ])) : Y("", !0),
                  m.language ? (k(), L("span", jy, [
                    p[1] || (p[1] = B("span", {
                      class: "verbatim-panel__sep",
                      "aria-hidden": "true"
                    }, "·", -1)),
                    pe(" " + K(l(m.language)), 1)
                  ])) : Y("", !0)
                ]),
                B("p", Gy, K(c(m)), 1)
              ]))), 128))
            ])
          ])
        ]),
        _: 1
      })
    ]));
  }
}), Xy = /* @__PURE__ */ ie(Ky, [["__scopeId", "data-v-3034500a"]]);
function Yy(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e];
    for (var r in t)
      Object.prototype.hasOwnProperty.call(t, r) && (n[r] = t[r]);
  }
  return n;
}
function is(n, e) {
  return Array(e + 1).join(n);
}
function iu(n) {
  return n.replace(/^\n*/, "");
}
function su(n) {
  for (var e = n.length; e > 0 && n[e - 1] === `
`; ) e--;
  return n.substring(0, e);
}
function ou(n) {
  return su(iu(n));
}
var Zy = ["ADDRESS", "ARTICLE", "ASIDE", "AUDIO", "BLOCKQUOTE", "BODY", "CANVAS", "CENTER", "DD", "DIR", "DIV", "DL", "DT", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "FRAMESET", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HGROUP", "HR", "HTML", "ISINDEX", "LI", "MAIN", "MENU", "NAV", "NOFRAMES", "NOSCRIPT", "OL", "OUTPUT", "P", "PRE", "SECTION", "TABLE", "TBODY", "TD", "TFOOT", "TH", "THEAD", "TR", "UL"];
function Bs(n) {
  return zs(n, Zy);
}
var au = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];
function lu(n) {
  return zs(n, au);
}
function Qy(n) {
  return cu(n, au);
}
var uu = ["A", "TABLE", "THEAD", "TBODY", "TFOOT", "TH", "TD", "IFRAME", "SCRIPT", "AUDIO", "VIDEO"];
function Jy(n) {
  return zs(n, uu);
}
function eb(n) {
  return cu(n, uu);
}
function zs(n, e) {
  return e.indexOf(n.nodeName) >= 0;
}
function cu(n, e) {
  return n.getElementsByTagName && e.some(function(t) {
    return n.getElementsByTagName(t).length;
  });
}
var tb = [[/\\/g, "\\\\"], [/\*/g, "\\*"], [/^-/g, "\\-"], [/^\+ /g, "\\+ "], [/^(=+)/g, "\\$1"], [/^(#{1,6}) /g, "\\$1 "], [/`/g, "\\`"], [/^~~~/g, "\\~~~"], [/\[/g, "\\["], [/\]/g, "\\]"], [/^>/g, "\\>"], [/_/g, "\\_"], [/^(\d+)\. /g, "$1\\. "]];
function du(n) {
  return tb.reduce(function(e, t) {
    return e.replace(t[0], t[1]);
  }, n);
}
var Ne = {};
Ne.paragraph = {
  filter: "p",
  replacement: function(n) {
    return `

` + n + `

`;
  }
};
Ne.lineBreak = {
  filter: "br",
  replacement: function(n, e, t) {
    return t.br + `
`;
  }
};
Ne.heading = {
  filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
  replacement: function(n, e, t) {
    var r = Number(e.nodeName.charAt(1));
    if (t.headingStyle === "setext" && r < 3) {
      var i = is(r === 1 ? "=" : "-", n.length);
      return `

` + n + `
` + i + `

`;
    } else
      return `

` + is("#", r) + " " + n + `

`;
  }
};
Ne.blockquote = {
  filter: "blockquote",
  replacement: function(n) {
    return n = ou(n).replace(/^/gm, "> "), `

` + n + `

`;
  }
};
Ne.list = {
  filter: ["ul", "ol"],
  replacement: function(n, e) {
    var t = e.parentNode;
    return t.nodeName === "LI" && t.lastElementChild === e ? `
` + n : `

` + n + `

`;
  }
};
Ne.listItem = {
  filter: "li",
  replacement: function(n, e, t) {
    var r = t.bulletListMarker + "   ", i = e.parentNode;
    if (i.nodeName === "OL") {
      var s = i.getAttribute("start"), o = Array.prototype.indexOf.call(i.children, e);
      r = (s ? Number(s) + o : o + 1) + ".  ";
    }
    var a = /\n$/.test(n);
    return n = ou(n) + (a ? `
` : ""), n = n.replace(/\n/gm, `
` + " ".repeat(r.length)), r + n + (e.nextSibling ? `
` : "");
  }
};
Ne.indentedCodeBlock = {
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
Ne.fencedCodeBlock = {
  filter: function(n, e) {
    return e.codeBlockStyle === "fenced" && n.nodeName === "PRE" && n.firstChild && n.firstChild.nodeName === "CODE";
  },
  replacement: function(n, e, t) {
    for (var r = e.firstChild.getAttribute("class") || "", i = (r.match(/language-(\S+)/) || [null, ""])[1], s = e.firstChild.textContent, o = t.fence.charAt(0), a = 3, u = new RegExp("^" + o + "{3,}", "gm"), l; l = u.exec(s); )
      l[0].length >= a && (a = l[0].length + 1);
    var c = is(o, a);
    return `

` + c + i + `
` + s.replace(/\n$/, "") + `
` + c + `

`;
  }
};
Ne.horizontalRule = {
  filter: "hr",
  replacement: function(n, e, t) {
    return `

` + t.hr + `

`;
  }
};
Ne.inlineLink = {
  filter: function(n, e) {
    return e.linkStyle === "inlined" && n.nodeName === "A" && n.getAttribute("href");
  },
  replacement: function(n, e) {
    var t = Fs(e.getAttribute("href")), r = qs($r(e.getAttribute("title"))), i = r ? ' "' + r + '"' : "";
    return "[" + n + "](" + t + i + ")";
  }
};
Ne.referenceLink = {
  filter: function(n, e) {
    return e.linkStyle === "referenced" && n.nodeName === "A" && n.getAttribute("href");
  },
  replacement: function(n, e, t) {
    var r = Fs(e.getAttribute("href")), i = $r(e.getAttribute("title"));
    i && (i = ' "' + qs(i) + '"');
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
Ne.emphasis = {
  filter: ["em", "i"],
  replacement: function(n, e, t) {
    return n.trim() ? t.emDelimiter + n + t.emDelimiter : "";
  }
};
Ne.strong = {
  filter: ["strong", "b"],
  replacement: function(n, e, t) {
    return n.trim() ? t.strongDelimiter + n + t.strongDelimiter : "";
  }
};
Ne.code = {
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
Ne.image = {
  filter: "img",
  replacement: function(n, e) {
    var t = du($r(e.getAttribute("alt"))), r = Fs(e.getAttribute("src") || ""), i = $r(e.getAttribute("title")), s = i ? ' "' + qs(i) + '"' : "";
    return r ? "![" + t + "](" + r + s + ")" : "";
  }
};
function $r(n) {
  return n ? n.replace(/(\n+\s*)+/g, `
`) : "";
}
function Fs(n) {
  var e = n.replace(/([<>()])/g, "\\$1");
  return e.indexOf(" ") >= 0 ? "<" + e + ">" : e;
}
function qs(n) {
  return n.replace(/"/g, '\\"');
}
function fu(n) {
  this.options = n, this._keep = [], this._remove = [], this.blankRule = {
    replacement: n.blankReplacement
  }, this.keepReplacement = n.keepReplacement, this.defaultRule = {
    replacement: n.defaultReplacement
  }, this.array = [];
  for (var e in n.rules) this.array.push(n.rules[e]);
}
fu.prototype = {
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
    return (e = Oi(this.array, n, this.options)) || (e = Oi(this._keep, n, this.options)) || (e = Oi(this._remove, n, this.options)) ? e : this.defaultRule;
  },
  forEach: function(n) {
    for (var e = 0; e < this.array.length; e++) n(this.array[e], e);
  }
};
function Oi(n, e, t) {
  for (var r = 0; r < n.length; r++) {
    var i = n[r];
    if (nb(i, e, t)) return i;
  }
}
function nb(n, e, t) {
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
function rb(n) {
  var e = n.element, t = n.isBlock, r = n.isVoid, i = n.isPre || function(d) {
    return d.nodeName === "PRE";
  };
  if (!(!e.firstChild || i(e))) {
    for (var s = null, o = !1, a = null, u = ma(a, e, i); u !== e; ) {
      if (u.nodeType === 3 || u.nodeType === 4) {
        var l = u.data.replace(/[ \r\n\t]+/g, " ");
        if ((!s || / $/.test(s.data)) && !o && l[0] === " " && (l = l.substr(1)), !l) {
          u = Di(u);
          continue;
        }
        u.data = l, s = u;
      } else if (u.nodeType === 1)
        t(u) || u.nodeName === "BR" ? (s && (s.data = s.data.replace(/ $/, "")), s = null, o = !1) : r(u) || i(u) ? (s = null, o = !0) : s && (o = !1);
      else {
        u = Di(u);
        continue;
      }
      var c = ma(a, u, i);
      a = u, u = c;
    }
    s && (s.data = s.data.replace(/ $/, ""), s.data || Di(s));
  }
}
function Di(n) {
  var e = n.nextSibling || n.parentNode;
  return n.parentNode.removeChild(n), e;
}
function ma(n, e, t) {
  return n && n.parentNode === e || t(e) ? e.nextSibling || e.parentNode : e.firstChild || e.nextSibling || e.parentNode;
}
var Vs = typeof window < "u" ? window : {};
function ib() {
  var n = Vs.DOMParser, e = !1;
  try {
    new n().parseFromString("", "text/html") && (e = !0);
  } catch {
  }
  return e;
}
function sb() {
  var n = function() {
  };
  return ob() ? n.prototype.parseFromString = function(e) {
    var t = new window.ActiveXObject("htmlfile");
    return t.designMode = "on", t.open(), t.write(e), t.close(), t;
  } : n.prototype.parseFromString = function(e) {
    var t = document.implementation.createHTMLDocument("");
    return t.open(), t.write(e), t.close(), t;
  }, n;
}
function ob() {
  var n = !1;
  try {
    document.implementation.createHTMLDocument("").open();
  } catch {
    Vs.ActiveXObject && (n = !0);
  }
  return n;
}
var ab = ib() ? Vs.DOMParser : sb();
function lb(n, e) {
  var t;
  if (typeof n == "string") {
    var r = ub().parseFromString(
      // DOM parsers arrange elements in the <head> and <body>.
      // Wrapping in a custom element ensures elements are reliably arranged in
      // a single element.
      '<x-turndown id="turndown-root">' + n + "</x-turndown>",
      "text/html"
    );
    t = r.getElementById("turndown-root");
  } else
    t = n.cloneNode(!0);
  return rb({
    element: t,
    isBlock: Bs,
    isVoid: lu,
    isPre: e.preformattedCode ? cb : null
  }), t;
}
var Li;
function ub() {
  return Li = Li || new ab(), Li;
}
function cb(n) {
  return n.nodeName === "PRE" || n.nodeName === "CODE";
}
function db(n, e) {
  return n.isBlock = Bs(n), n.isCode = n.nodeName === "CODE" || n.parentNode.isCode, n.isBlank = fb(n), n.flankingWhitespace = pb(n, e), n;
}
function fb(n) {
  return !lu(n) && !Jy(n) && /^\s*$/i.test(n.textContent) && !Qy(n) && !eb(n);
}
function pb(n, e) {
  if (n.isBlock || e.preformattedCode && n.isCode)
    return {
      leading: "",
      trailing: ""
    };
  var t = hb(n.textContent);
  return t.leadingAscii && va("left", n, e) && (t.leading = t.leadingNonAscii), t.trailingAscii && va("right", n, e) && (t.trailing = t.trailingNonAscii), {
    leading: t.leading,
    trailing: t.trailing
  };
}
function hb(n) {
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
function va(n, e, t) {
  var r, i, s;
  return n === "left" ? (r = e.previousSibling, i = / $/) : (r = e.nextSibling, i = /^ /), r && (r.nodeType === 3 ? s = i.test(r.nodeValue) : t.preformattedCode && r.nodeName === "CODE" ? s = !1 : r.nodeType === 1 && !Bs(r) && (s = i.test(r.textContent))), s;
}
var mb = Array.prototype.reduce;
function Nr(n) {
  if (!(this instanceof Nr)) return new Nr(n);
  var e = {
    rules: Ne,
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
  this.options = Yy({}, e, n), this.rules = new fu(this.options);
}
Nr.prototype = {
  /**
   * The entry point for converting a string or DOM node to Markdown
   * @public
   * @param {String|HTMLElement} input The string or DOM node to convert
   * @returns A Markdown representation of the input
   * @type String
   */
  turndown: function(n) {
    if (!yb(n))
      throw new TypeError(n + " is not a string, or an element/document/fragment node.");
    if (n === "") return "";
    var e = pu.call(this, new lb(n, this.options));
    return vb.call(this, e);
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
    return du(n);
  }
};
function pu(n) {
  var e = this;
  return mb.call(n.childNodes, function(t, r) {
    r = new db(r, e.options);
    var i = "";
    return r.nodeType === 3 ? i = r.isCode ? r.nodeValue : e.escape(r.nodeValue) : r.nodeType === 1 && (i = gb.call(e, r)), hu(t, i);
  }, "");
}
function vb(n) {
  var e = this;
  return this.rules.forEach(function(t) {
    typeof t.append == "function" && (n = hu(n, t.append(e.options)));
  }), n.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
}
function gb(n) {
  var e = this.rules.forNode(n), t = pu.call(this, n), r = n.flankingWhitespace;
  return (r.leading || r.trailing) && (t = t.trim()), r.leading + e.replacement(t, n, this.options) + r.trailing;
}
function hu(n, e) {
  var t = su(n), r = iu(e), i = Math.max(n.length - t.length, e.length - r.length), s = `

`.substring(0, i);
  return t + s + r;
}
function yb(n) {
  return n != null && (typeof n == "string" || n.nodeType && (n.nodeType === 1 || n.nodeType === 9 || n.nodeType === 11));
}
var ga = /highlight-(?:text|source)-([a-z0-9]+)/;
function bb(n) {
  n.addRule("highlightedCodeBlock", {
    filter: function(e) {
      var t = e.firstChild;
      return e.nodeName === "DIV" && ga.test(e.className) && t && t.nodeName === "PRE";
    },
    replacement: function(e, t, r) {
      var i = t.className || "", s = (i.match(ga) || [null, ""])[1];
      return `

` + r.fence + s + `
` + t.firstChild.textContent + `
` + r.fence + `

`;
    }
  });
}
function kb(n) {
  n.addRule("strikethrough", {
    filter: ["del", "s", "strike"],
    replacement: function(e) {
      return "~" + e + "~";
    }
  });
}
var wb = Array.prototype.indexOf, Tb = Array.prototype.every, Tn = {};
Tn.tableCell = {
  filter: ["th", "td"],
  replacement: function(n, e) {
    return mu(n, e);
  }
};
Tn.tableRow = {
  filter: "tr",
  replacement: function(n, e) {
    var t = "", r = { left: ":--", right: "--:", center: ":-:" };
    if (Hs(e))
      for (var i = 0; i < e.childNodes.length; i++) {
        var s = "---", o = (e.childNodes[i].getAttribute("align") || "").toLowerCase();
        o && (s = r[o] || s), t += mu(s, e.childNodes[i]);
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
    return n.nodeName === "TABLE" && Hs(n.rows[0]);
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
function Hs(n) {
  var e = n.parentNode;
  return e.nodeName === "THEAD" || e.firstChild === n && (e.nodeName === "TABLE" || Sb(e)) && Tb.call(n.childNodes, function(t) {
    return t.nodeName === "TH";
  });
}
function Sb(n) {
  var e = n.previousSibling;
  return n.nodeName === "TBODY" && (!e || e.nodeName === "THEAD" && /^\s*$/i.test(e.textContent));
}
function mu(n, e) {
  var t = wb.call(e.parentNode.childNodes, e), r = " ";
  return t === 0 && (r = "| "), r + n + " |";
}
function _b(n) {
  n.keep(function(t) {
    return t.nodeName === "TABLE" && !Hs(t.rows[0]);
  });
  for (var e in Tn) n.addRule(e, Tn[e]);
}
function xb(n) {
  n.addRule("taskListItems", {
    filter: function(e) {
      return e.type === "checkbox" && e.parentNode.nodeName === "LI";
    },
    replacement: function(e, t) {
      return (t.checked ? "[x]" : "[ ]") + " ";
    }
  });
}
function Eb(n) {
  n.use([
    bb,
    kb,
    _b,
    xb
  ]);
}
const Cb = { class: "markdown-editor" }, Ab = ["aria-label"], Ib = ["contenteditable"], Rb = /* @__PURE__ */ j({
  __name: "MarkdownEditor",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = fe(), s = new Nr({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      strongDelimiter: "**"
    });
    s.use(Eb);
    function o(O) {
      return Hd(O);
    }
    function a(O) {
      return O ? s.turndown(O) : "";
    }
    const u = Qe("editorEl"), l = as({
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
      const M = u.value;
      M && (M.innerHTML = O);
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
    function _(O) {
      O.preventDefault();
      const M = O.clipboardData;
      if (!M) return;
      const W = M.getData("text/plain");
      if (!W) return;
      /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|```|\*\*|__|\[.*\]\(/m.test(W) ? document.execCommand("insertHTML", !1, o(W)) : document.execCommand("insertText", !1, W);
    }
    function b() {
      u.value?.focus();
    }
    function C(O) {
      b(), document.execCommand(O), w(), v();
    }
    function E(O) {
      b();
      const M = Bn(u.value), W = M?.rangeCount && F(M.anchorNode, O);
      document.execCommand("formatBlock", !1, W ? "P" : O), w(), v();
    }
    function N() {
      b();
      const O = Bn(u.value);
      if (!O || !O.rangeCount) return;
      const M = D(O.anchorNode);
      if (M && M.tagName === "BLOCKQUOTE") {
        const W = M.parentNode;
        if (!W) return;
        for (; M.firstChild; )
          W.insertBefore(M.firstChild, M);
        W.removeChild(M);
      } else
        document.execCommand("formatBlock", !1, "BLOCKQUOTE");
      w(), v();
    }
    function T() {
      b();
      const O = Bn(u.value);
      if (!O || !O.rangeCount) return;
      const M = F(O.anchorNode, "PRE");
      if (M) {
        const W = document.createElement("p");
        W.textContent = M.textContent ?? "", M.parentNode?.replaceChild(W, M);
        const X = document.createRange();
        X.selectNodeContents(W), X.collapse(!1), O.removeAllRanges(), O.addRange(X);
      } else {
        const W = O.getRangeAt(0), X = W.toString() || `
`, se = document.createElement("pre"), oe = document.createElement("code");
        oe.textContent = X, se.appendChild(oe), W.deleteContents(), W.insertNode(se);
        const we = document.createRange();
        we.setStartAfter(se), we.collapse(!0), O.removeAllRanges(), O.addRange(we);
      }
      w(), v();
    }
    function x() {
      f || (f = () => w(), document.addEventListener("selectionchange", f), w());
    }
    function S() {
      f && (document.removeEventListener("selectionchange", f), f = null);
    }
    function w() {
      l.bold = document.queryCommandState("bold"), l.italic = document.queryCommandState("italic"), l.strike = document.queryCommandState("strikeThrough"), l.h1 = I("H1"), l.h2 = I("H2"), l.h3 = I("H3"), l.bulletList = document.queryCommandState("insertUnorderedList"), l.orderedList = document.queryCommandState("insertOrderedList"), l.blockquote = I("BLOCKQUOTE"), l.codeBlock = I("PRE");
    }
    function I(O) {
      const M = Bn(u.value);
      return !M || !M.rangeCount ? !1 : !!F(M.anchorNode, O);
    }
    function D(O) {
      const M = u.value;
      let W = O;
      for (; W && W !== M; ) {
        if (W.nodeType === 1 && /^(P|H[1-6]|BLOCKQUOTE|PRE|UL|OL|LI|DIV)$/.test(
          W.tagName
        ))
          return W;
        W = W.parentNode;
      }
      return null;
    }
    function F(O, M) {
      const W = u.value;
      let X = O;
      for (; X && X !== W; ) {
        if (X.nodeType === 1 && X.tagName === M)
          return X;
        X = X.parentNode;
      }
      return null;
    }
    function $(O) {
      return O ? "secondary" : "tertiary";
    }
    return _e(() => {
      p(o(t.modelValue || ""));
    }), bt(() => {
      S(), d !== null && cancelAnimationFrame(d);
    }), re(
      () => t.modelValue,
      (O) => {
        O !== c && O !== m() && (p(o(O || "")), c = null);
      }
    ), (O, M) => (k(), L("div", Cb, [
      n.disabled ? Y("", !0) : (k(), L("div", {
        key: 0,
        class: "markdown-editor__toolbar",
        role: "toolbar",
        "aria-label": h(i)("mdToolbar.label")
      }, [
        q(ne, {
          size: "sm",
          variant: $(l.h1),
          icon: "heading-1",
          "aria-label": h(i)("mdToolbar.h1"),
          title: h(i)("mdToolbar.h1"),
          onClick: M[0] || (M[0] = (W) => E("H1"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: $(l.h2),
          icon: "heading-2",
          "aria-label": h(i)("mdToolbar.h2"),
          title: h(i)("mdToolbar.h2"),
          onClick: M[1] || (M[1] = (W) => E("H2"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: $(l.h3),
          icon: "heading-3",
          "aria-label": h(i)("mdToolbar.h3"),
          title: h(i)("mdToolbar.h3"),
          onClick: M[2] || (M[2] = (W) => E("H3"))
        }, null, 8, ["variant", "aria-label", "title"]),
        M[9] || (M[9] = B("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(ne, {
          size: "sm",
          variant: $(l.bold),
          icon: "bold",
          "aria-label": h(i)("mdToolbar.bold"),
          title: h(i)("mdToolbar.bold"),
          onClick: M[3] || (M[3] = (W) => C("bold"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: $(l.italic),
          icon: "italic",
          "aria-label": h(i)("mdToolbar.italic"),
          title: h(i)("mdToolbar.italic"),
          onClick: M[4] || (M[4] = (W) => C("italic"))
        }, null, 8, ["variant", "aria-label", "title"]),
        M[10] || (M[10] = B("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(ne, {
          size: "sm",
          variant: $(l.bulletList),
          icon: "list",
          "aria-label": h(i)("mdToolbar.bulletList"),
          title: h(i)("mdToolbar.bulletList"),
          onClick: M[5] || (M[5] = (W) => C("insertUnorderedList"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: $(l.orderedList),
          icon: "list-ordered",
          "aria-label": h(i)("mdToolbar.orderedList"),
          title: h(i)("mdToolbar.orderedList"),
          onClick: M[6] || (M[6] = (W) => C("insertOrderedList"))
        }, null, 8, ["variant", "aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: $(l.blockquote),
          icon: "quote",
          "aria-label": h(i)("mdToolbar.quote"),
          title: h(i)("mdToolbar.quote"),
          onClick: N
        }, null, 8, ["variant", "aria-label", "title"]),
        M[11] || (M[11] = B("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(ne, {
          size: "sm",
          variant: $(l.codeBlock),
          icon: "code-block",
          "aria-label": h(i)("mdToolbar.codeBlock"),
          title: h(i)("mdToolbar.codeBlock"),
          onClick: T
        }, null, 8, ["variant", "aria-label", "title"]),
        M[12] || (M[12] = B("span", {
          class: "markdown-editor__separator",
          "aria-hidden": "true"
        }, null, -1)),
        q(ne, {
          size: "sm",
          variant: "tertiary",
          icon: "undo",
          "aria-label": h(i)("mdToolbar.undo"),
          title: h(i)("mdToolbar.undo"),
          onClick: M[7] || (M[7] = (W) => C("undo"))
        }, null, 8, ["aria-label", "title"]),
        q(ne, {
          size: "sm",
          variant: "tertiary",
          icon: "redo",
          "aria-label": h(i)("mdToolbar.redo"),
          title: h(i)("mdToolbar.redo"),
          onClick: M[8] || (M[8] = (W) => C("redo"))
        }, null, 8, ["aria-label", "title"])
      ], 8, Ab)),
      B("div", {
        ref: "editorEl",
        class: "markdown-editor__content",
        contenteditable: !n.disabled,
        onInput: v,
        onKeydown: y,
        onPaste: _,
        onFocus: x,
        onBlur: S
      }, null, 40, Ib)
    ]));
  }
}), Mb = /* @__PURE__ */ ie(Rb, [["__scopeId", "data-v-356dd429"]]), Pb = { class: "llm-service-panel" }, Ob = {
  key: 0,
  class: "llm-service-panel__empty",
  role: "status"
}, Db = { class: "llm-service-panel__empty-text" }, Lb = /* @__PURE__ */ j({
  __name: "LLMServicePanel",
  props: {
    service: {}
  },
  setup(n) {
    const e = n, t = Pe(), { t: r } = fe(), i = A(() => {
      const _ = e.service.status.value;
      return _ === "queued" || _ === "processing" ? "processing" : _ === "error" ? "error" : "done";
    }), s = A(() => e.service.progress.value), o = A(() => e.service.content.value), a = A(() => e.service.busy.value), u = A(() => e.service.dirty.value), l = A(() => e.service.versions.value), c = A(
      () => e.service.activeVersionNumber.value
    ), d = A(() => i.value !== "done" ? !1 : !o.value && l.value.length === 0), f = A(() => {
      const _ = t.activeChannel.value, b = _?.activeTranslation.value.id, E = (b ? _?.translations.get(b) : void 0)?.lastModifiedAt.value ?? null;
      if (E == null) return !0;
      const T = l.value.find(
        (x) => x.versionNumber === c.value
      )?.createdAt ?? e.service.lastUpdate.value;
      return T == null ? !0 : T >= E;
    }), p = P(o.value);
    re(o, (_) => {
      p.value = _, t.llmServices?.setDirty(e.service.id, !1);
    }), re(p, (_) => {
      const b = _ !== o.value;
      e.service.dirty.value !== b && t.llmServices?.setDirty(e.service.id, b);
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
    return (_, b) => (k(), L("section", Pb, [
      q(ru, {
        status: i.value,
        progress: s.value,
        onRetry: m
      }, {
        "toolbar-left": z(() => [
          q(ne, {
            variant: "primary",
            icon: "save",
            disabled: !u.value || a.value,
            "aria-label": h(r)("llmService.save"),
            title: h(r)("llmService.save"),
            onClick: y
          }, null, 8, ["disabled", "aria-label", "title"]),
          q(ne, {
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
          B("span", {
            class: Se(["llm-service-panel__status", [
              f.value ? "llm-service-panel__status--ok" : "llm-service-panel__status--warn"
            ]])
          }, [
            q(Ye, {
              name: f.value ? "check" : "warning",
              size: 14
            }, null, 8, ["name"]),
            B("span", null, K(f.value ? h(r)("llmService.statusUpdated") : h(r)("llmService.statusOutdated")), 1)
          ], 2)
        ]),
        "toolbar-right": z(() => [
          q(ne, {
            variant: "primary",
            icon: "download",
            disabled: i.value === "processing",
            "aria-label": h(r)("llmService.download"),
            title: h(r)("llmService.download"),
            onClick: v
          }, {
            default: z(() => [
              pe(K(h(r)("llmService.download")), 1)
            ]),
            _: 1
          }, 8, ["disabled", "aria-label", "title"])
        ]),
        default: z(() => [
          d.value ? (k(), L("div", Ob, [
            B("p", Db, K(h(r)("llmService.empty")), 1),
            q(ne, {
              variant: "primary",
              icon: "sparkles",
              disabled: a.value,
              onClick: m
            }, {
              default: z(() => [
                pe(K(h(r)("llmService.generate")), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ])) : (k(), V(Mb, {
            key: 1,
            modelValue: p.value,
            "onUpdate:modelValue": b[0] || (b[0] = (C) => p.value = C),
            disabled: a.value
          }, null, 8, ["modelValue", "disabled"]))
        ]),
        _: 1
      }, 8, ["status", "progress"])
    ]));
  }
}), $b = /* @__PURE__ */ ie(Lb, [["__scopeId", "data-v-2e197000"]]), Nb = { class: "switch" }, Bb = ["id", "checked", "disabled"], zb = ["for"], Fb = /* @__PURE__ */ j({
  __name: "SwitchToggle",
  props: {
    modelValue: { type: Boolean },
    id: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = t.id ?? zr();
    return (s, o) => (k(), L("div", Nb, [
      B("input", {
        type: "checkbox",
        id: h(i),
        checked: n.modelValue,
        disabled: n.disabled,
        onChange: o[0] || (o[0] = (a) => r("update:modelValue", a.target.checked))
      }, null, 40, Bb),
      B("label", { for: h(i) }, [...o[1] || (o[1] = [
        B("div", { class: "switch-slider" }, null, -1)
      ])], 8, zb)
    ]));
  }
}), yr = /* @__PURE__ */ ie(Fb, [["__scopeId", "data-v-f1919d87"]]), qb = ["disabled", "aria-label"], Vb = /* @__PURE__ */ j({
  __name: "EditableText",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: !1 },
    placeholder: {},
    ariaLabel: {}
  },
  emits: ["update:modelValue", "commit", "cancel"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = P(!1), s = P(t.modelValue), o = Qe("input"), a = A(() => ({
      placeholder: t.placeholder,
      customParams: t.ariaLabel ? { "aria-label": t.ariaLabel } : void 0
    }));
    re(
      () => t.modelValue,
      (f) => {
        i.value || (s.value = f);
      }
    );
    async function u() {
      t.disabled || (s.value = t.modelValue, i.value = !0, await Re(), o.value?.focus(), o.value?.select());
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
    return (f, p) => i.value ? (k(), V(Cn, {
      key: 0,
      ref: "input",
      modelValue: s.value,
      "onUpdate:modelValue": p[0] || (p[0] = (m) => s.value = m),
      field: a.value,
      size: "sm",
      "full-width": "",
      onKeydown: d,
      onBlur: l
    }, null, 8, ["modelValue", "field"])) : (k(), L("button", {
      key: 1,
      type: "button",
      class: "editable-text-display",
      disabled: n.disabled,
      "aria-label": n.ariaLabel,
      onClick: u
    }, K(n.modelValue || n.placeholder), 9, qb));
  }
}), Hb = /* @__PURE__ */ ie(Vb, [["__scopeId", "data-v-511d4fb4"]]), Wb = ["disabled", "aria-current"], Ub = {
  key: 0,
  class: "selectable-list-item__leading"
}, jb = { class: "selectable-list-item__label" }, Gb = {
  key: 1,
  class: "selectable-list-item__trailing"
}, Kb = {
  key: 0,
  class: "selectable-list-item__actions"
}, Xb = /* @__PURE__ */ j({
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
    return (r, i) => (k(), L("div", {
      class: Se(["selectable-list-item", [
        `selectable-list-item--${n.size}`,
        { "selectable-list-item--current": n.current }
      ]])
    }, [
      B("button", {
        type: "button",
        class: "selectable-list-item__main",
        disabled: n.disabled,
        "aria-current": n.current ? "true" : void 0,
        onClick: i[0] || (i[0] = (s) => t("select"))
      }, [
        r.$slots.leading ? (k(), L("span", Ub, [
          Z(r.$slots, "leading", {}, void 0, !0)
        ])) : Y("", !0),
        B("span", jb, [
          Z(r.$slots, "default", {}, () => [
            pe(K(n.label), 1)
          ], !0)
        ]),
        r.$slots.trailing ? (k(), L("span", Gb, [
          Z(r.$slots, "trailing", {}, void 0, !0)
        ])) : Y("", !0)
      ], 8, Wb),
      r.$slots.actions ? (k(), L("div", Kb, [
        Z(r.$slots, "actions", {}, void 0, !0)
      ])) : Y("", !0)
    ], 2));
  }
}), ss = /* @__PURE__ */ ie(Xb, [["__scopeId", "data-v-e227a7de"]]), Yb = /* @__PURE__ */ j({
  __name: "SpeakerMenu",
  emits: ["merge"],
  setup(n, { emit: e }) {
    const t = e, { t: r } = fe(), i = A(() => [
      { id: "merge", label: r("speakerMenu.merge") }
    ]);
    function s(o) {
      o.id === "merge" && t("merge");
    }
    return (o, a) => (k(), V(Ds, {
      items: i.value,
      "item-key": (u) => u.id,
      align: "end",
      onSelect: s
    }, {
      trigger: z(() => [
        q(ne, {
          icon: "more-vertical",
          variant: "transparent",
          "aria-label": h(r)("speakerMenu.openMenu")
        }, null, 8, ["aria-label"])
      ]),
      item: z(({ item: u }) => [
        B("span", null, K(u.label), 1)
      ]),
      _: 1
    }, 8, ["items", "item-key"]));
  }
}), Zb = { class: "merge-dialog-title" }, Qb = { class: "merge-dialog-description" }, Jb = { class: "merge-dialog-actions" }, e0 = /* @__PURE__ */ j({
  __name: "MergeDialog",
  props: {
    open: { type: Boolean },
    fromSpeakerId: {}
  },
  emits: ["update:open"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Pe(), { t: s } = fe(), o = Qe("dialog"), a = P(""), u = A(
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
    })), f = A(() => t.fromSpeakerId ? Vg(i, t.fromSpeakerId) : 0);
    re(
      () => t.open,
      (v) => {
        v ? (a.value = l.value[0]?.id ?? "", o.value?.showModal()) : o.value?.close();
      }
    );
    function p() {
      r("update:open", !1);
    }
    function m() {
      !t.fromSpeakerId || !a.value || (i.transcriptionEditor ? i.transcriptionEditor.replaceSpeaker(t.fromSpeakerId, a.value) : Ql(i, t.fromSpeakerId, a.value), r("update:open", !1));
    }
    return (v, y) => (k(), L("dialog", {
      ref: "dialog",
      class: "merge-dialog",
      onClose: p,
      onCancel: Le(p, ["prevent"])
    }, [
      u.value ? (k(), L("form", {
        key: 0,
        class: "merge-dialog-form",
        onSubmit: Le(m, ["prevent"])
      }, [
        B("h2", Zb, K(h(s)("mergeDialog.title")), 1),
        B("p", Qb, [
          B("strong", null, K(u.value.name), 1),
          pe(" · " + K(f.value) + " " + K(h(s)("mergeDialog.turnsAffected")), 1)
        ]),
        q(Cn, {
          select: "",
          field: d.value,
          options: c.value,
          modelValue: a.value,
          "onUpdate:modelValue": y[0] || (y[0] = (_) => a.value = _)
        }, null, 8, ["field", "options", "modelValue"]),
        B("div", Jb, [
          q(ne, {
            variant: "tertiary",
            type: "button",
            onClick: p
          }, {
            default: z(() => [
              pe(K(h(s)("mergeDialog.cancel")), 1)
            ]),
            _: 1
          }),
          q(ne, {
            variant: "primary",
            type: "submit",
            disabled: !a.value
          }, {
            default: z(() => [
              pe(K(h(s)("mergeDialog.confirm")), 1)
            ]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : Y("", !0)
    ], 544));
  }
}), t0 = /* @__PURE__ */ ie(e0, [["__scopeId", "data-v-695cbbe8"]]), vu = /* @__PURE__ */ j({
  __name: "ChannelSelector",
  props: {
    channels: {},
    selectedChannelId: {}
  },
  emits: ["update:selectedChannelId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = fe(), s = A(
      () => t.channels.map((a) => ({ value: a.id, label: a.name }))
    ), o = A(() => ({ label: i("sidebar.channelSelectLabel") }));
    return (a, u) => (k(), V(Cn, {
      select: "",
      field: o.value,
      options: s.value,
      "model-value": n.selectedChannelId,
      "onUpdate:modelValue": u[0] || (u[0] = (l) => r("update:selectedChannelId", l))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), gu = /* @__PURE__ */ j({
  __name: "TranslationSelector",
  props: {
    translations: {},
    selectedTranslationId: {}
  },
  emits: ["update:selectedTranslationId"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i, locale: s } = fe(), o = A(
      () => wc(
        t.translations,
        s.value,
        i("sidebar.originalLanguage"),
        i("language.wildcard"),
        i("sidebar.bilingual")
      )
    ), a = A(() => ({ label: i("sidebar.translationSelectLabel") }));
    return (u, l) => (k(), V(Cn, {
      select: "",
      field: a.value,
      options: o.value,
      "model-value": n.selectedTranslationId,
      "onUpdate:modelValue": l[0] || (l[0] = (c) => r("update:selectedTranslationId", c))
    }, null, 8, ["field", "options", "model-value"]));
  }
}), n0 = { class: "speaker-sidebar" }, r0 = {
  key: 0,
  class: "sidebar-section sidebar-section--selector"
}, i0 = { class: "sidebar-title" }, s0 = {
  key: 1,
  class: "sidebar-section sidebar-section--selector"
}, o0 = { class: "sidebar-title" }, a0 = {
  key: 2,
  class: "sidebar-section"
}, l0 = { class: "sidebar-title" }, u0 = { class: "subtitle-toggle" }, c0 = { class: "subtitle-toggle-label" }, d0 = { class: "subtitle-slider" }, f0 = { class: "subtitle-slider-label" }, p0 = { class: "subtitle-slider-value" }, h0 = ["value", "disabled"], m0 = {
  key: 0,
  class: "subtitle-toggle"
}, v0 = { class: "subtitle-toggle-label" }, g0 = {
  key: 1,
  class: "subtitle-toggle"
}, y0 = { class: "subtitle-toggle-label" }, b0 = {
  key: 3,
  class: "sidebar-section"
}, k0 = { class: "sidebar-title" }, w0 = { class: "subtitle-toggle" }, T0 = { class: "subtitle-toggle-label" }, S0 = { class: "sidebar-title" }, _0 = { class: "history-list" }, x0 = ["datetime"], E0 = {
  key: 0,
  class: "history-version-list"
}, C0 = ["datetime"], A0 = {
  key: 5,
  class: "sidebar-section"
}, I0 = { class: "sidebar-title" }, R0 = { class: "speaker-list" }, M0 = /* @__PURE__ */ j({
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
    const e = Pe(), { t } = fe(), r = A(
      () => e.capabilities.value.speakers === "edit"
    ), i = A(() => e.live?.ttsReady.value ?? !1), s = A(
      () => i.value ? t("voicePlayback.description") : t("voicePlayback.unavailable")
    );
    function o(T) {
      !e.live || !i.value || (T ? e.live.enableTTS() : e.live.disableTTS());
    }
    const a = P(!1), u = P(null);
    function l(T, x) {
      e.transcriptionEditor ? e.transcriptionEditor.renameSpeaker(T, x) : Yl(e, T, x);
    }
    function c(T) {
      u.value = T, a.value = !0;
    }
    const d = A(() => e.llmServices?.active.value ?? null), f = new Intl.DateTimeFormat(void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }), p = A(() => [...d.value?.generations.value ?? []].sort((x, S) => S.createdAt - x.createdAt)), m = A(() => [...d.value?.versions.value ?? []].sort((x, S) => S.versionNumber - x.versionNumber)), v = A(
      () => d.value?.currentGenerationId.value ?? null
    ), y = A(
      () => d.value?.activeVersionNumber.value ?? null
    ), _ = A(() => d.value?.busy.value ?? !1);
    function b(T) {
      return T === "completed" ? "check" : T === "error" ? "x" : "spinner";
    }
    function C(T) {
      return t(T === "completed" ? "sidebar.statusCompleted" : T === "error" ? "sidebar.statusError" : T === "processing" ? "sidebar.statusProcessing" : "sidebar.statusQueued");
    }
    function E(T) {
      if (_.value || T === v.value) return;
      const x = d.value;
      x && e.emit("llmService:selectGeneration", { id: x.id, generationId: T });
    }
    function N(T) {
      if (_.value || T === y.value) return;
      const x = d.value;
      x && e.emit("llmService:selectVersion", { id: x.id, versionNumber: T });
    }
    return (T, x) => (k(), L("aside", n0, [
      n.channels.length > 1 ? (k(), L("section", r0, [
        B("h2", i0, K(h(t)("sidebar.channel")), 1),
        q(vu, {
          channels: n.channels,
          "selected-channel-id": n.selectedChannelId,
          "onUpdate:selectedChannelId": x[0] || (x[0] = (S) => T.$emit("update:selectedChannelId", S))
        }, null, 8, ["channels", "selected-channel-id"])
      ])) : Y("", !0),
      n.translations.length > 1 ? (k(), L("section", s0, [
        B("h2", o0, K(h(t)("sidebar.translation")), 1),
        q(gu, {
          translations: n.translations,
          "selected-translation-id": n.selectedTranslationId,
          "onUpdate:selectedTranslationId": x[1] || (x[1] = (S) => T.$emit("update:selectedTranslationId", S))
        }, null, 8, ["translations", "selected-translation-id"])
      ])) : Y("", !0),
      h(e).subtitle ? (k(), L("section", a0, [
        B("h2", l0, K(h(t)("sidebar.subtitle")), 1),
        B("div", u0, [
          B("span", c0, K(h(t)("subtitle.show")), 1),
          q(yr, {
            modelValue: h(e).subtitle.isVisible.value,
            "onUpdate:modelValue": x[2] || (x[2] = (S) => h(e).subtitle.isVisible.value = S)
          }, null, 8, ["modelValue"])
        ]),
        B("label", d0, [
          B("span", f0, [
            pe(K(h(t)("subtitle.fontSize")) + " ", 1),
            B("span", p0, K(h(e).subtitle.fontSize.value) + "px", 1)
          ]),
          B("input", {
            type: "range",
            min: 20,
            max: 80,
            step: 2,
            value: h(e).subtitle.fontSize.value,
            disabled: !h(e).subtitle.isVisible.value,
            onInput: x[3] || (x[3] = (S) => h(e).subtitle.fontSize.value = Number(
              S.target.value
            ))
          }, null, 40, h0)
        ]),
        h(e).subtitle.watermark && !h(e).subtitle.watermark.readonly ? (k(), L("div", m0, [
          B("span", v0, K(h(t)("subtitle.showWatermark")), 1),
          q(yr, {
            modelValue: h(e).subtitle.watermark.display.value,
            "onUpdate:modelValue": x[4] || (x[4] = (S) => h(e).subtitle.watermark.display.value = S),
            disabled: !h(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : Y("", !0),
        h(e).subtitle.watermark && !h(e).subtitle.watermark.readonly && h(e).subtitle.watermark.display.value ? (k(), L("div", g0, [
          B("span", y0, K(h(t)("subtitle.pinWatermark")), 1),
          q(yr, {
            modelValue: h(e).subtitle.watermark.pinned.value,
            "onUpdate:modelValue": x[5] || (x[5] = (S) => h(e).subtitle.watermark.pinned.value = S),
            disabled: !h(e).subtitle.isVisible.value
          }, null, 8, ["modelValue", "disabled"])
        ])) : Y("", !0)
      ])) : Y("", !0),
      h(e).live && h(e).live.ttsAvailable ? (k(), L("section", b0, [
        B("h2", k0, K(h(t)("sidebar.voicePlayback")), 1),
        B("div", w0, [
          B("span", T0, K(h(t)("voicePlayback.enable")), 1),
          q(yr, {
            "model-value": h(e).live.ttsEnabled.value,
            disabled: !i.value,
            "onUpdate:modelValue": o
          }, null, 8, ["model-value", "disabled"])
        ]),
        B("p", {
          class: Se(["voice-playback-hint", { "voice-playback-hint--warning": !i.value }])
        }, K(s.value), 3)
      ])) : Y("", !0),
      d.value && p.value.length ? (k(), L("section", {
        key: 4,
        class: Se(["sidebar-section", { "sidebar-section--busy": _.value }])
      }, [
        B("h2", S0, K(h(t)("sidebar.history")), 1),
        B("ul", _0, [
          (k(!0), L(ye, null, qe(p.value, (S) => (k(), L("li", {
            key: S.generationId,
            class: Se(["history-generation", {
              "history-generation--current": S.generationId === v.value
            }])
          }, [
            q(ss, {
              current: S.generationId === v.value,
              disabled: _.value,
              onSelect: (w) => E(S.generationId)
            }, {
              leading: z(() => [
                q(Ye, {
                  name: b(S.status),
                  spin: S.status === "processing" || S.status === "queued",
                  size: 14,
                  class: Se(`history-generation__status--${S.status}`)
                }, null, 8, ["name", "spin", "class"])
              ]),
              trailing: z(() => [
                pe(K(C(S.status)), 1)
              ]),
              default: z(() => [
                B("time", {
                  datetime: new Date(S.createdAt).toISOString()
                }, K(h(f).format(S.createdAt)), 9, x0)
              ]),
              _: 2
            }, 1032, ["current", "disabled", "onSelect"]),
            S.generationId === v.value && m.value.length ? (k(), L("ul", E0, [
              (k(!0), L(ye, null, qe(m.value, (w) => (k(), L("li", {
                key: w.versionNumber
              }, [
                q(ss, {
                  size: "sm",
                  current: w.versionNumber === y.value,
                  disabled: _.value,
                  onSelect: (I) => N(w.versionNumber)
                }, {
                  trailing: z(() => [
                    B("time", {
                      datetime: new Date(w.createdAt).toISOString()
                    }, K(h(f).format(w.createdAt)), 9, C0)
                  ]),
                  default: z(() => [
                    pe(" v" + K(w.versionNumber) + " ", 1)
                  ]),
                  _: 2
                }, 1032, ["current", "disabled", "onSelect"])
              ]))), 128))
            ])) : Y("", !0)
          ], 2))), 128))
        ])
      ], 2)) : Y("", !0),
      n.showSpeakers && n.speakers.length ? (k(), L("section", A0, [
        B("h2", I0, K(h(t)("sidebar.speakers")), 1),
        B("ul", R0, [
          (k(!0), L(ye, null, qe(n.speakers, (S) => (k(), L("li", {
            key: S.id,
            class: "speaker-item"
          }, [
            q(bs, {
              color: S.color
            }, null, 8, ["color"]),
            q(Hb, {
              class: "speaker-name",
              "model-value": S.name,
              disabled: !r.value,
              "aria-label": h(t)("sidebar.renameSpeaker"),
              onCommit: (w) => l(S.id, w)
            }, null, 8, ["model-value", "disabled", "aria-label", "onCommit"]),
            r.value && n.speakers.length > 1 ? (k(), V(Yb, {
              key: 0,
              "speaker-name": S.name,
              onMerge: (w) => c(S.id)
            }, null, 8, ["speaker-name", "onMerge"])) : Y("", !0)
          ]))), 128))
        ])
      ])) : Y("", !0),
      r.value ? (k(), V(t0, {
        key: 6,
        open: a.value,
        "onUpdate:open": x[6] || (x[6] = (S) => a.value = S),
        "from-speaker-id": u.value
      }, null, 8, ["open", "from-speaker-id"])) : Y("", !0)
    ]));
  }
}), ya = /* @__PURE__ */ ie(M0, [["__scopeId", "data-v-4d0d9571"]]), P0 = /* @__PURE__ */ j({
  __name: "SidebarDrawer",
  props: {
    open: { type: Boolean, required: !0 },
    openModifiers: {}
  },
  emits: ["update:open"],
  setup(n) {
    const e = lc(n, "open"), { t } = fe();
    return (r, i) => (k(), V(h(uh), {
      open: e.value,
      "onUpdate:open": i[0] || (i[0] = (s) => e.value = s)
    }, {
      default: z(() => [
        q(h(jh), { disabled: "" }, {
          default: z(() => [
            q(h(Hh), { class: "editor-overlay" }),
            q(h(zh), { class: "sidebar-drawer" }, {
              default: z(() => [
                q(h(Kh), { class: "sr-only" }, {
                  default: z(() => [
                    pe(K(h(t)("sidebar.speakers")), 1)
                  ]),
                  _: 1
                }),
                q(h(dh), {
                  class: "sidebar-close",
                  "aria-label": h(t)("header.closeSidebar")
                }, {
                  default: z(() => [
                    q(h(ys), { size: 20 })
                  ]),
                  _: 1
                }, 8, ["aria-label"]),
                Z(r.$slots, "default")
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
}), O0 = { class: "player-controls" }, D0 = { class: "controls-left" }, L0 = { class: "controls-time" }, $0 = { class: "time-display" }, N0 = { class: "time-display" }, B0 = { class: "controls-right" }, z0 = ["value", "aria-label", "disabled"], F0 = /* @__PURE__ */ j({
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
    const t = e, { t: r } = fe(), i = P(!1);
    function s(o) {
      const a = o.target;
      t("update:volume", parseFloat(a.value));
    }
    return (o, a) => (k(), L("div", O0, [
      B("div", D0, [
        q(ne, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": h(r)("player.skipBack"),
          disabled: !n.isReady,
          onClick: a[0] || (a[0] = (u) => t("skipBack"))
        }, {
          icon: z(() => [
            q(h(ol), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(ne, {
          variant: "transparent",
          size: "md",
          class: "play-button",
          "aria-label": n.isPlaying ? h(r)("player.pause") : h(r)("player.play"),
          disabled: !n.isReady,
          onClick: a[1] || (a[1] = (u) => t("togglePlay"))
        }, {
          icon: z(() => [
            n.isPlaying ? (k(), V(h(il), {
              key: 0,
              size: 20
            })) : (k(), V(h(sl), {
              key: 1,
              size: 20
            }))
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"]),
        q(ne, {
          variant: "transparent",
          size: "md",
          class: "skip-button",
          "aria-label": h(r)("player.skipForward"),
          disabled: !n.isReady,
          onClick: a[2] || (a[2] = (u) => t("skipForward"))
        }, {
          icon: z(() => [
            q(h(al), { size: 16 })
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ]),
      B("div", L0, [
        B("time", $0, K(n.currentTime), 1),
        a[7] || (a[7] = B("span", { class: "time-separator" }, "/", -1)),
        B("time", N0, K(n.duration), 1)
      ]),
      B("div", B0, [
        B("div", {
          class: "volume-group",
          onMouseenter: a[4] || (a[4] = (u) => i.value = !0),
          onMouseleave: a[5] || (a[5] = (u) => i.value = !1)
        }, [
          q(ne, {
            variant: "transparent",
            size: "md",
            "aria-label": n.isMuted ? h(r)("player.unmute") : h(r)("player.mute"),
            disabled: !n.isReady,
            onClick: a[3] || (a[3] = (u) => t("toggleMute"))
          }, {
            icon: z(() => [
              n.isMuted ? (k(), V(h(ul), {
                key: 0,
                size: 16
              })) : (k(), V(h(ll), {
                key: 1,
                size: 16
              }))
            ]),
            _: 1
          }, 8, ["aria-label", "disabled"]),
          Fn(B("input", {
            type: "range",
            class: "volume-slider",
            min: "0",
            max: "1",
            step: "0.05",
            value: n.volume,
            "aria-label": h(r)("player.volume"),
            disabled: !n.isReady,
            onInput: s
          }, null, 40, z0), [
            [Ba, i.value]
          ])
        ], 32),
        q(ne, {
          variant: "transparent",
          size: "md",
          class: "speed-button",
          "aria-label": h(r)("player.speed"),
          disabled: !n.isReady,
          onClick: a[6] || (a[6] = (u) => t("cyclePlaybackRate"))
        }, {
          default: z(() => [
            pe(K(n.playbackRate) + "x ", 1)
          ]),
          _: 1
        }, 8, ["aria-label", "disabled"])
      ])
    ]));
  }
}), q0 = /* @__PURE__ */ ie(F0, [["__scopeId", "data-v-99f700b1"]]);
function Fe(n, e, t, r) {
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
let Zn = class {
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
const br = { decode: function(n, e) {
  return Fe(this, void 0, void 0, (function* () {
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
function yu(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(yu(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function ba(n, e, t) {
  const r = yu(n, e || {});
  return t?.appendChild(r), r;
}
var V0 = Object.freeze({ __proto__: null, createElement: ba, default: ba });
const H0 = { fetchBlob: function(n, e, t) {
  return Fe(this, void 0, void 0, (function* () {
    const r = yield fetch(n, t);
    if (r.status >= 400) throw new Error(`Failed to fetch ${n}: ${r.status} (${r.statusText})`);
    return (function(i, s) {
      Fe(this, void 0, void 0, (function* () {
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
function Te(n) {
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
  const t = Te(n());
  return e.forEach(((r) => r.subscribe((() => {
    const i = n();
    Object.is(t.value, i) || t.set(i);
  })))), { get value() {
    return t.value;
  }, subscribe: (r) => t.subscribe(r) };
}
function Mt(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
class W0 extends Zn {
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
    super(), this.isExternalMedia = !1, this.reactiveMediaEventCleanups = [], e.media ? (this.media = e.media, this.isExternalMedia = !0) : this.media = document.createElement("audio"), this._isPlaying = Te(!1), this._currentTime = Te(0), this._duration = Te(0), this._volume = Te(this.media.volume), this._muted = Te(this.media.muted), this._playbackRate = Te(this.media.playbackRate || 1), this._seeking = Te(!1), this.setupReactiveMediaEvents(), e.mediaControls && (this.media.controls = !0), e.autoplay && (this.media.autoplay = !0), e.playbackRate != null && this.onMediaEvent("canplay", (() => {
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
    return Fe(this, void 0, void 0, (function* () {
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
function U0({ maxTop: n, maxBottom: e, halfHeight: t, vScale: r, barMinHeight: i = 0, barAlign: s }) {
  let o = Math.round(n * t * r), a = o + Math.round(e * t * r) || 1;
  return a < i && (a = i, s || (o = a / 2)), { topHeight: o, totalHeight: a };
}
function j0({ barAlign: n, halfHeight: e, topHeight: t, totalHeight: r, canvasHeight: i }) {
  return n === "top" ? 0 : n === "bottom" ? i - r : e - t;
}
function ka(n, e, t) {
  const r = e - n.left, i = t - n.top;
  return [r / n.width, i / n.height];
}
function bu(n) {
  return !!(n.barWidth || n.barGap || n.barAlign);
}
function wa(n, e) {
  if (!bu(e)) return n;
  const t = e.barWidth || 0.5, r = t + (e.barGap || t / 2);
  return r === 0 ? n : Math.floor(n / r) * r;
}
function Ta({ scrollLeft: n, totalWidth: e, numCanvases: t }) {
  if (e === 0) return [0];
  const r = n / e, i = Math.floor(r * t);
  return [i - 1, i, i + 1];
}
function ku(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function G0(n) {
  const e = Te({ scrollLeft: n.scrollLeft, scrollWidth: n.scrollWidth, clientWidth: n.clientWidth }), t = Ut((() => (function(s) {
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
    n.removeEventListener("scroll", i), ku(e);
  } };
}
class K0 extends Zn {
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
      const r = this.wrapper.getBoundingClientRect(), [i, s] = ka(r, t.clientX, t.clientY);
      this.emit("click", i, s);
    })), this.wrapper.addEventListener("dblclick", ((t) => {
      const r = this.wrapper.getBoundingClientRect(), [i, s] = ka(r, t.clientX, t.clientY);
      this.emit("dblclick", i, s);
    })), this.options.dragToSeek !== !0 && typeof this.options.dragToSeek != "object" || this.initDrag(), this.scrollStream = G0(this.scrollContainer);
    const e = Mt((() => {
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
      const { threshold: i = 3, mouseButton: s = 0, touchDelay: o = 100 } = r, a = Te(null), u = /* @__PURE__ */ new Map(), l = matchMedia("(pointer: coarse)").matches;
      let c = () => {
      };
      const d = (f) => {
        if (f.button !== s || (u.set(f.pointerId, f), u.size > 1)) return;
        let p = f.clientX, m = f.clientY, v = !1;
        const y = Date.now(), _ = t.getBoundingClientRect(), { left: b, top: C } = _, E = (w) => {
          if (w.defaultPrevented || u.size > 1 || l && Date.now() - y < o) return;
          const I = w.clientX, D = w.clientY, F = I - p, $ = D - m;
          (v || Math.abs(F) > i || Math.abs($) > i) && (w.preventDefault(), w.stopPropagation(), v || (a.set({ type: "start", x: p - b, y: m - C }), v = !0), a.set({ type: "move", x: I - b, y: D - C, deltaX: F, deltaY: $ }), p = I, m = D);
        }, N = (w) => {
          if (u.delete(w.pointerId), v) {
            const I = w.clientX, D = w.clientY;
            a.set({ type: "end", x: I - b, y: D - C });
          }
          c();
        }, T = (w) => {
          u.delete(w.pointerId), w.relatedTarget && w.relatedTarget !== document.documentElement || N(w);
        }, x = (w) => {
          v && (w.stopPropagation(), w.preventDefault());
        }, S = (w) => {
          w.defaultPrevented || u.size > 1 || v && w.preventDefault();
        };
        document.addEventListener("pointermove", E), document.addEventListener("pointerup", N), document.addEventListener("pointerout", T), document.addEventListener("pointercancel", T), document.addEventListener("touchmove", S, { passive: !1 }), document.addEventListener("click", x, { capture: !0 }), c = () => {
          document.removeEventListener("pointermove", E), document.removeEventListener("pointerup", N), document.removeEventListener("pointerout", T), document.removeEventListener("pointercancel", T), document.removeEventListener("touchmove", S), setTimeout((() => {
            document.removeEventListener("click", x, { capture: !0 });
          }), 10);
        };
      };
      return t.addEventListener("pointerdown", d), { signal: a, cleanup: () => {
        c(), t.removeEventListener("pointerdown", d), u.clear(), ku(a);
      } };
    })(this.wrapper);
    const e = Mt((() => {
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
    const { width: s, height: o } = r.canvas, { halfHeight: a, barWidth: u, barRadius: l, barIndexScale: c, barSpacing: d, barMinHeight: f } = (function({ width: m, height: v, length: y, options: _, pixelRatio: b }) {
      const C = v / 2, E = _.barWidth ? _.barWidth * b : 1, N = _.barGap ? _.barGap * b : _.barWidth ? E / 2 : 0, T = E + N || 1;
      return { halfHeight: C, barWidth: E, barGap: N, barRadius: _.barRadius || 0, barMinHeight: _.barMinHeight ? _.barMinHeight * b : 0, barIndexScale: y > 0 ? m / T / y : 0, barSpacing: T };
    })({ width: s, height: o, length: (e[0] || []).length, options: t, pixelRatio: this.getPixelRatio() }), p = (function({ channelData: m, barIndexScale: v, barSpacing: y, barWidth: _, halfHeight: b, vScale: C, canvasHeight: E, barAlign: N, barMinHeight: T }) {
      const x = m[0] || [], S = m[1] || x, w = x.length, I = [];
      let D = 0, F = 0, $ = 0;
      for (let O = 0; O <= w; O++) {
        const M = Math.round(O * v);
        if (M > D) {
          const { topHeight: se, totalHeight: oe } = U0({ maxTop: F, maxBottom: $, halfHeight: b, vScale: C, barMinHeight: T, barAlign: N }), we = j0({ barAlign: N, halfHeight: b, topHeight: se, totalHeight: oe, canvasHeight: E });
          I.push({ x: D * y, y: we, width: _, height: oe }), D = M, F = 0, $ = 0;
        }
        const W = Math.abs(x[O] || 0), X = Math.abs(S[O] || 0);
        W > F && (F = W), X > $ && ($ = X);
      }
      return I;
    })({ channelData: e, barIndexScale: c, barSpacing: d, barWidth: u, halfHeight: a, vScale: i, canvasHeight: o, barAlign: t.barAlign, barMinHeight: f });
    r.beginPath();
    for (const m of p) l && "roundRect" in r ? r.roundRect(m.x, m.y, m.width, m.height, l) : r.rect(m.x, m.y, m.width, m.height);
    r.fill(), r.closePath();
  }
  renderLineWaveform(e, t, r, i) {
    const { width: s, height: o } = r.canvas, a = (function({ channelData: u, width: l, height: c, vScale: d }) {
      const f = c / 2, p = u[0] || [];
      return [p, u[1] || p].map(((m, v) => {
        const y = m.length, _ = y ? l / y : 0, b = f, C = v === 0 ? -1 : 1, E = [{ x: 0, y: b }];
        let N = 0, T = 0;
        for (let x = 0; x <= y; x++) {
          const S = Math.round(x * _);
          if (S > N) {
            const I = b + (Math.round(T * f * d) || 1) * C;
            E.push({ x: N, y: I }), N = S, T = 0;
          }
          const w = Math.abs(m[x] || 0);
          w > T && (T = w);
        }
        return E.push({ x: N, y: b }), E;
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
    bu(t) ? this.renderBarWaveform(e, t, r, i) : this.renderLineWaveform(e, t, r, i);
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
      return wa(Math.min(8e3, m, v), y);
    })({ clientWidth: u, totalWidth: l, options: t });
    let d = {};
    if (c === 0) return;
    const f = (m) => {
      if (m < 0 || m >= p || d[m]) return;
      d[m] = !0;
      const v = m * c;
      let y = Math.min(l - v, c);
      if (y = wa(y, t), y <= 0) return;
      const _ = (function({ channelData: b, offset: C, clampedWidth: E, totalWidth: N }) {
        return b.map(((T) => {
          const x = Math.floor(C / N * T.length), S = Math.floor((C + E) / N * T.length);
          return T.slice(x, S);
        }));
      })({ channelData: e, offset: v, clampedWidth: y, totalWidth: l });
      this.renderSingleCanvas(_, t, y, i, v, s, o);
    }, p = Math.ceil(l / c);
    if (!this.isScrollable) {
      for (let m = 0; m < p; m++) f(m);
      return;
    }
    if (Ta({ scrollLeft: this.scrollContainer.scrollLeft, totalWidth: l, numCanvases: p }).forEach(((m) => f(m))), p > 1) {
      const m = this.on("scroll", (() => {
        const { scrollLeft: v } = this.scrollContainer;
        Object.keys(d).length > 10 && (s.innerHTML = "", o.innerHTML = "", d = {}), Ta({ scrollLeft: v, totalWidth: l, numCanvases: p }).forEach(((y) => f(y)));
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
    return Fe(this, void 0, void 0, (function* () {
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
    return Fe(this, void 0, void 0, (function* () {
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
class X0 extends Zn {
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
class $i extends Zn {
  constructor(e = new AudioContext()) {
    super(), this.bufferNode = null, this.playStartTime = 0, this.playedDuration = 0, this._muted = !1, this._playbackRate = 1, this._duration = void 0, this.buffer = null, this.currentSrc = "", this.paused = !0, this.crossOrigin = null, this.seeking = !1, this.autoplay = !1, this.addEventListener = this.on, this.removeEventListener = this.un, this.audioContext = e, this.gainNode = this.audioContext.createGain(), this.gainNode.connect(this.audioContext.destination);
  }
  load() {
    return Fe(this, void 0, void 0, (function* () {
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
    return Fe(this, void 0, void 0, (function* () {
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
    return Fe(this, void 0, void 0, (function* () {
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
const Y0 = { waveColor: "#999", progressColor: "#555", cursorWidth: 1, minPxPerSec: 0, fillParent: !0, interact: !0, dragToSeek: !1, autoScroll: !0, autoCenter: !0, sampleRate: 8e3 };
class Wn extends W0 {
  static create(e) {
    return new Wn(e);
  }
  getState() {
    return this.wavesurferState;
  }
  getRenderer() {
    return this.renderer;
  }
  constructor(e) {
    const t = e.media || (e.backend === "WebAudio" ? new $i() : void 0);
    super({ media: t, mediaControls: e.mediaControls, autoplay: e.autoplay, playbackRate: e.audioRate }), this.plugins = [], this.decodedData = null, this.stopAtPosition = null, this.subscriptions = [], this.mediaSubscriptions = [], this.abortController = null, this.reactiveCleanups = [], this.options = Object.assign({}, Y0, e);
    const { state: r, actions: i } = (function(a) {
      var u, l, c, d, f, p;
      const m = (u = a?.currentTime) !== null && u !== void 0 ? u : Te(0), v = (l = a?.duration) !== null && l !== void 0 ? l : Te(0), y = (c = a?.isPlaying) !== null && c !== void 0 ? c : Te(!1), _ = (d = a?.isSeeking) !== null && d !== void 0 ? d : Te(!1), b = (f = a?.volume) !== null && f !== void 0 ? f : Te(1), C = (p = a?.playbackRate) !== null && p !== void 0 ? p : Te(1), E = Te(null), N = Te(null), T = Te(""), x = Te(0), S = Te(0), w = Ut((() => !y.value), [y]), I = Ut((() => E.value !== null), [E]), D = Ut((() => I.value && v.value > 0), [I, v]), F = Ut((() => m.value), [m]), $ = Ut((() => v.value > 0 ? m.value / v.value : 0), [m, v]);
      return { state: { currentTime: m, duration: v, isPlaying: y, isPaused: w, isSeeking: _, volume: b, playbackRate: C, audioBuffer: E, peaks: N, url: T, zoom: x, scrollPosition: S, canPlay: I, isReady: D, progress: F, progressPercent: $ }, actions: { setCurrentTime: (O) => {
        const M = Math.max(0, Math.min(v.value || 1 / 0, O));
        m.set(M);
      }, setDuration: (O) => {
        v.set(Math.max(0, O));
      }, setPlaying: (O) => {
        y.set(O);
      }, setSeeking: (O) => {
        _.set(O);
      }, setVolume: (O) => {
        const M = Math.max(0, Math.min(1, O));
        b.set(M);
      }, setPlaybackRate: (O) => {
        const M = Math.max(0.1, Math.min(16, O));
        C.set(M);
      }, setAudioBuffer: (O) => {
        E.set(O), O && v.set(O.duration);
      }, setPeaks: (O) => {
        N.set(O);
      }, setUrl: (O) => {
        T.set(O);
      }, setZoom: (O) => {
        x.set(Math.max(0, O));
      }, setScrollPosition: (O) => {
        S.set(Math.max(0, O));
      } } };
    })({ isPlaying: this.isPlayingSignal, currentTime: this.currentTimeSignal, duration: this.durationSignal, volume: this.volumeSignal, playbackRate: this.playbackRateSignal, isSeeking: this.seekingSignal });
    this.wavesurferState = r, this.wavesurferActions = i, this.timer = new X0();
    const s = t ? void 0 : this.getMediaElement();
    this.renderer = new K0(this.options, s), this.initPlayerEvents(), this.initRendererEvents(), this.initTimerEvents(), this.initReactiveState(), this.initPlugins();
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
      r.push(Mt((() => {
        const o = e.isPlaying.value;
        t.emit(o ? "play" : "pause");
      }), [e.isPlaying])), r.push(Mt((() => {
        const o = e.currentTime.value;
        t.emit("timeupdate", o), e.isPlaying.value && t.emit("audioprocess", o);
      }), [e.currentTime, e.isPlaying])), r.push(Mt((() => {
        e.isSeeking.value && t.emit("seeking", e.currentTime.value);
      }), [e.isSeeking, e.currentTime]));
      let i = !1;
      r.push(Mt((() => {
        e.isReady.value && !i && (i = !0, t.emit("ready", e.duration.value));
      }), [e.isReady, e.duration]));
      let s = !1;
      return r.push(Mt((() => {
        const o = e.isPlaying.value, a = e.currentTime.value, u = e.duration.value, l = u > 0 && a >= u;
        s && !o && l && t.emit("finish"), s = o && l;
      }), [e.isPlaying, e.currentTime, e.duration])), r.push(Mt((() => {
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
    this.options = Object.assign({}, this.options, e), e.duration && !e.peaks && (this.decodedData = br.createBuffer(this.exportPeaks(), e.duration)), e.peaks && e.duration && (this.decodedData = br.createBuffer(e.peaks, e.duration)), this.renderer.setOptions(this.options), e.audioRate && this.setPlaybackRate(e.audioRate), e.mediaControls != null && (this.getMediaElement().controls = e.mediaControls);
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
    return Fe(this, void 0, void 0, (function* () {
      var s;
      if (this.emit("load", e), !this.options.media && this.isPlaying() && this.pause(), this.decodedData = null, this.stopAtPosition = null, (s = this.abortController) === null || s === void 0 || s.abort(), this.abortController = null, !t && !r) {
        const a = this.options.fetchParams || {};
        window.AbortController && !a.signal && (this.abortController = new AbortController(), a.signal = this.abortController.signal);
        const u = (c) => this.emit("loading", c);
        t = yield H0.fetchBlob(e, u, a);
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
      if (r) this.decodedData = br.createBuffer(r, o || 0);
      else if (t) {
        const a = yield t.arrayBuffer();
        this.decodedData = yield br.decode(a, this.options.sampleRate);
      }
      this.decodedData && (this.emit("decode", this.getDuration()), this.renderer.render(this.decodedData)), this.emit("ready", this.getDuration());
    }));
  }
  load(e, t, r) {
    return Fe(this, void 0, void 0, (function* () {
      try {
        return yield this.loadAudio(e, void 0, t, r);
      } catch (i) {
        throw this.emit("error", i), i;
      }
    }));
  }
  loadBlob(e, t, r) {
    return Fe(this, void 0, void 0, (function* () {
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
    return Fe(this, void 0, void 0, (function* () {
      e != null && this.setTime(e);
      const i = yield r.play.call(this);
      return t != null && (this.media instanceof $i ? this.media.stopAt(t) : this.stopAtPosition = t), i;
    }));
  }
  playPause() {
    return Fe(this, void 0, void 0, (function* () {
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
    return Fe(this, arguments, void 0, (function* (e = "image/png", t = 1, r = "dataURL") {
      return this.renderer.exportImage(e, t, r);
    }));
  }
  destroy() {
    var e;
    this.emit("destroy"), (e = this.abortController) === null || e === void 0 || e.abort(), this.plugins.forEach(((t) => t.destroy())), this.subscriptions.forEach(((t) => t())), this.unsubscribePlayerEvents(), this.reactiveCleanups.forEach(((t) => t())), this.reactiveCleanups = [], this.timer.destroy(), this.renderer.destroy(), super.destroy();
  }
}
Wn.BasePlugin = class extends Zn {
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
}, Wn.dom = V0;
class wu {
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
class Z0 extends wu {
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
function Tu(n, e) {
  const t = e.xmlns ? document.createElementNS(e.xmlns, n) : document.createElement(n);
  for (const [r, i] of Object.entries(e)) if (r === "children" && i) for (const [s, o] of Object.entries(i)) o instanceof Node ? t.appendChild(o) : typeof o == "string" ? t.appendChild(document.createTextNode(o)) : t.appendChild(Tu(s, o));
  else r === "style" ? Object.assign(t.style, i) : r === "textContent" ? t.textContent = i : t.setAttribute(r, i.toString());
  return t;
}
function zn(n, e, t) {
  const r = Tu(n, e || {});
  return t?.appendChild(r), r;
}
function Su(n) {
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
function Tr(n, e) {
  let t;
  const r = () => {
    t && (t(), t = void 0), t = n();
  }, i = e.map(((s) => s.subscribe(r)));
  return r(), () => {
    t && (t(), t = void 0), i.forEach(((s) => s()));
  };
}
function vn(n, e) {
  const t = Su(null), r = (i) => {
    t.set(i);
  };
  return n.addEventListener(e, r), t._cleanup = () => {
    n.removeEventListener(e, r);
  }, t;
}
function Ht(n) {
  const e = n._cleanup;
  typeof e == "function" && e();
}
function Sr(n, e = {}) {
  const { threshold: t = 3, mouseButton: r = 0, touchDelay: i = 100 } = e, s = Su(null), o = /* @__PURE__ */ new Map(), a = matchMedia("(pointer: coarse)").matches;
  let u = () => {
  };
  const l = (c) => {
    if (c.button !== r || (o.set(c.pointerId, c), o.size > 1)) return;
    let d = c.clientX, f = c.clientY, p = !1;
    const m = Date.now(), v = n.getBoundingClientRect(), { left: y, top: _ } = v, b = (x) => {
      if (x.defaultPrevented || o.size > 1 || a && Date.now() - m < i) return;
      const S = x.clientX, w = x.clientY, I = S - d, D = w - f;
      (p || Math.abs(I) > t || Math.abs(D) > t) && (x.preventDefault(), x.stopPropagation(), p || (s.set({ type: "start", x: d - y, y: f - _ }), p = !0), s.set({ type: "move", x: S - y, y: w - _, deltaX: I, deltaY: D }), d = S, f = w);
    }, C = (x) => {
      if (o.delete(x.pointerId), p) {
        const S = x.clientX, w = x.clientY;
        s.set({ type: "end", x: S - y, y: w - _ });
      }
      u();
    }, E = (x) => {
      o.delete(x.pointerId), x.relatedTarget && x.relatedTarget !== document.documentElement || C(x);
    }, N = (x) => {
      p && (x.stopPropagation(), x.preventDefault());
    }, T = (x) => {
      x.defaultPrevented || o.size > 1 || p && x.preventDefault();
    };
    document.addEventListener("pointermove", b), document.addEventListener("pointerup", C), document.addEventListener("pointerout", E), document.addEventListener("pointercancel", E), document.addEventListener("touchmove", T, { passive: !1 }), document.addEventListener("click", N, { capture: !0 }), u = () => {
      document.removeEventListener("pointermove", b), document.removeEventListener("pointerup", C), document.removeEventListener("pointerout", E), document.removeEventListener("pointercancel", E), document.removeEventListener("touchmove", T), setTimeout((() => {
        document.removeEventListener("click", N, { capture: !0 });
      }), 10);
    };
  };
  return n.addEventListener("pointerdown", l), { signal: s, cleanup: () => {
    u(), n.removeEventListener("pointerdown", l), o.clear(), Ht(s);
  } };
}
class Sa extends wu {
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
    const t = { position: "absolute", zIndex: "2", width: "6px", height: "100%", top: "0", cursor: "ew-resize", wordBreak: "keep-all" }, r = zn("div", { part: "region-handle region-handle-left", style: Object.assign(Object.assign({}, t), { left: "0", borderLeft: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "2px 0 0 2px" }) }, e), i = zn("div", { part: "region-handle region-handle-right", style: Object.assign(Object.assign({}, t), { right: "0", borderRight: "2px solid rgba(0, 0, 0, 0.5)", borderRadius: "0 2px 2px 0" }) }, e), s = Sr(r, { threshold: 1 }), o = Sr(i, { threshold: 1 }), a = Tr((() => {
      const l = s.signal.value;
      l && (l.type === "move" && l.deltaX !== void 0 ? this.onResize(l.deltaX, "start") : l.type === "end" && this.onEndResizing("start"));
    }), [s.signal]), u = Tr((() => {
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
    const i = zn("div", { style: { position: "absolute", top: `${t}%`, height: `${r}%`, backgroundColor: e ? "none" : this.color, borderLeft: e ? "2px solid " + this.color : "none", borderRadius: "2px", boxSizing: "border-box", transition: "background-color 0.2s ease", cursor: this.drag ? "grab" : "default", pointerEvents: "all" } });
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
    const t = vn(e, "click"), r = vn(e, "mouseenter"), i = vn(e, "mouseleave"), s = vn(e, "dblclick"), o = vn(e, "pointerdown"), a = vn(e, "pointerup"), u = t.subscribe(((y) => y && this.emit("click", y))), l = r.subscribe(((y) => y && this.emit("over", y))), c = i.subscribe(((y) => y && this.emit("leave", y))), d = s.subscribe(((y) => y && this.emit("dblclick", y))), f = o.subscribe(((y) => y && this.toggleCursor(!0))), p = a.subscribe(((y) => y && this.toggleCursor(!1)));
    this.subscriptions.push((() => {
      u(), l(), c(), d(), f(), p(), Ht(t), Ht(r), Ht(i), Ht(s), Ht(o), Ht(a);
    }));
    const m = Sr(e), v = Tr((() => {
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
        this.content = zn("div", { style: { padding: `0.2em ${r ? 0.2 : 0.4}em`, display: "inline-block" }, textContent: e });
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
class Ws extends Z0 {
  constructor(e) {
    super(e), this.regions = [], this.regionsContainer = this.initRegionsContainer();
  }
  static create(e) {
    return new Ws(e);
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
    return zn("div", { part: "regions-container", style: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", zIndex: "5", pointerEvents: "none" } });
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
    const i = this.wavesurfer.getDuration(), s = (r = (t = this.wavesurfer) === null || t === void 0 ? void 0 : t.getDecodedData()) === null || r === void 0 ? void 0 : r.numberOfChannels, o = new Sa(e, i, s);
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
    const u = Sr(i, { threshold: t }), l = Tr((() => {
      var c, d;
      const f = u.signal.value;
      if (f) if (f.type === "start") {
        if (o = f.x, !this.wavesurfer) return;
        const p = this.wavesurfer.getDuration(), m = (d = (c = this.wavesurfer) === null || c === void 0 ? void 0 : c.getDecodedData()) === null || d === void 0 ? void 0 : d.numberOfChannels, { width: v } = this.wavesurfer.getWrapper().getBoundingClientRect();
        a = o / v * p;
        const y = f.x / v * p, _ = (f.x + 5) / v * p;
        s = new Sa(Object.assign(Object.assign({}, e), { start: y, end: _ }), p, m), this.emit("region-initialized", s), s.element && this.regionsContainer.appendChild(s.element);
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
function Q0(n) {
  const { containerRef: e, audioSrc: t } = n, r = Pe();
  if (!r.audio)
    throw new Error("useAudioPlayer requires the audio plugin (core.audio)");
  const i = r.audio, s = Dt(null), o = Dt(null), a = i.currentTime, u = i.isPlaying, l = P(0), c = P(!1), d = P(!1), f = P(null), p = P(1), m = P(1), v = P(!1), y = A(
    () => qn(a.value)
  ), _ = A(() => qn(l.value)), b = /* @__PURE__ */ new Map(), C = [];
  function E(U) {
    const ae = o.value;
    if (!ae) return;
    if (U.startTime == null || U.endTime == null) {
      N(U.id);
      return;
    }
    const Ee = U.speakerId ? r.speakers.all.get(U.speakerId) : void 0;
    if (!Ee || !U.speakerId) {
      N(U.id);
      return;
    }
    const Oe = yo(Ee.color, 0.25), lt = b.get(U.id);
    if (lt) {
      lt.region.setOptions({
        start: U.startTime,
        end: U.endTime,
        color: Oe
      }), lt.region.element?.style.setProperty(
        "--region-color",
        Ee.color
      ), lt.speakerId = U.speakerId;
      return;
    }
    const wt = ae.addRegion({
      start: U.startTime,
      end: U.endTime,
      color: Oe,
      drag: !1,
      resize: !1
    });
    wt.element?.style.setProperty("--region-color", Ee.color), b.set(U.id, { region: wt, speakerId: U.speakerId });
  }
  function N(U) {
    const ae = b.get(U);
    ae && (ae.region.remove(), b.delete(U));
  }
  function T() {
    for (const { region: U } of b.values()) U.remove();
    b.clear();
  }
  function x() {
    T();
    const U = r.activeChannel.value?.activeTranslation.value.turns.value ?? [];
    for (const ae of U) E(ae);
  }
  function S({ turn: U }) {
    E(U);
  }
  function w({ turn: U }) {
    const ae = b.get(U.id);
    if (ae) {
      const Ee = ae.region.start === U.startTime && ae.region.end === U.endTime, Oe = ae.speakerId === U.speakerId;
      if (Ee && Oe) return;
    }
    E(U);
  }
  function I({ turnId: U }) {
    N(U);
  }
  function D({ speaker: U }) {
    const ae = yo(U.color, 0.25);
    for (const [, Ee] of b)
      Ee.speakerId === U.id && (Ee.region.setOptions({ color: ae }), Ee.region.element?.style.setProperty("--region-color", U.color));
  }
  function F({
    speakerId: U
  }) {
    for (const [ae, Ee] of [...b])
      Ee.speakerId === U && N(ae);
  }
  function $() {
    x();
  }
  function O() {
    x();
  }
  function M() {
    T();
  }
  function W() {
    C.push(r.onActiveTranslation("turn:add", S)), C.push(r.onActiveTranslation("turn:update", w)), C.push(r.onActiveTranslation("turn:remove", I)), C.push(r.on("speaker:update", D)), C.push(r.on("speaker:remove", F)), C.push(r.on("translation:sync", $)), C.push(r.on("translation:change", O)), C.push(r.on("channel:reset", M));
  }
  function X() {
    for (const U of C) U();
    C.length = 0;
  }
  function se() {
    const U = s.value;
    U && (c.value = !0, d.value = !1, f.value = null, l.value = U.getDuration(), x(), W());
  }
  function oe(U) {
    a.value = U;
  }
  function we() {
    u.value = !0;
  }
  function le() {
    u.value = !1;
  }
  function zt() {
    u.value = !1;
  }
  function sn(U) {
    d.value = !1, c.value = !1, f.value = U?.message ?? "Failed to load audio";
  }
  function Qr(U, ae) {
    Qn(), d.value = !0, c.value = !1, f.value = null;
    const Ee = Ws.create();
    o.value = Ee;
    const Oe = i.waveform.value, lt = Oe?.length ? [Zd(Oe)] : void 0, wt = r.activeChannel.value?.duration, Ge = Wn.create({
      peaks: lt,
      duration: lt && wt ? wt : void 0,
      container: U,
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
      renderFunction: Qd,
      url: ae,
      plugins: [Ee]
    });
    Ge.setVolume(p.value), Ge.setPlaybackRate(m.value), Ge.setMuted(v.value), Ge.on("ready", se), Ge.on("timeupdate", oe), Ge.on("play", we), Ge.on("pause", le), Ge.on("finish", zt), Ge.on("error", sn), s.value = Ge;
  }
  function Qn() {
    X(), T(), s.value && (s.value.destroy(), s.value = null, o.value = null);
  }
  function Jr() {
    s.value?.play();
  }
  function Jn() {
    s.value?.pause();
  }
  function er() {
    s.value?.playPause();
  }
  function In(U) {
    const ae = s.value;
    !ae || l.value === 0 || ae.setTime(Math.max(0, Math.min(U, l.value)));
  }
  function tr(U) {
    In(a.value + U);
  }
  function me(U) {
    const ae = s.value;
    ae && (p.value = U, ae.setVolume(U), U > 0 && v.value && (v.value = !1, ae.setMuted(!1)));
  }
  function nr() {
    const U = s.value;
    U && (v.value = !v.value, U.setMuted(v.value));
  }
  function he(U) {
    const ae = s.value;
    ae && (m.value = U, ae.setPlaybackRate(U));
  }
  function rr() {
    const ae = (Ni.indexOf(
      m.value
    ) + 1) % Ni.length;
    he(Ni[ae] ?? 1);
  }
  return re(
    [e, t],
    ([U, ae]) => {
      U && ae && Qr(U, ae);
    },
    { immediate: !0 }
  ), i.setSeekHandler(In), i.setPauseHandler(Jn), bt(() => {
    i.setSeekHandler(null), i.setPauseHandler(null), Qn();
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
    formattedDuration: _,
    play: Jr,
    pause: Jn,
    togglePlay: er,
    seekTo: In,
    skip: tr,
    setVolume: me,
    setPlaybackRate: he,
    cyclePlaybackRate: rr,
    toggleMute: nr
  };
}
const J0 = { class: "audio-player" }, ek = /* @__PURE__ */ j({
  __name: "AudioPlayer",
  props: {
    audioSrc: {}
  },
  setup(n, { expose: e }) {
    const t = n, r = P(null), {
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
      cyclePlaybackRate: _,
      toggleMute: b
    } = Q0({
      containerRef: r,
      audioSrc: Da(() => t.audioSrc)
    });
    return e({ seekTo: p, pause: m }), (C, E) => (k(), L("footer", J0, [
      B("div", {
        ref_key: "waveformRef",
        ref: r,
        class: Se(["waveform-container", { "waveform-container--loading": h(o) }])
      }, null, 2),
      q(q0, {
        "is-playing": h(i),
        "current-time": h(c),
        duration: h(d),
        volume: h(a),
        "playback-rate": h(u),
        "is-muted": h(l),
        "is-ready": h(s),
        onTogglePlay: h(f),
        onSkipBack: E[0] || (E[0] = (N) => h(v)(-10)),
        onSkipForward: E[1] || (E[1] = (N) => h(v)(10)),
        "onUpdate:volume": h(y),
        onToggleMute: h(b),
        onCyclePlaybackRate: h(_)
      }, null, 8, ["is-playing", "current-time", "duration", "volume", "playback-rate", "is-muted", "is-ready", "onTogglePlay", "onUpdate:volume", "onToggleMute", "onCyclePlaybackRate"])
    ]));
  }
}), tk = /* @__PURE__ */ ie(ek, [["__scopeId", "data-v-810ae1d6"]]);
class nk {
  diff(e, t, r = {}) {
    let i;
    typeof r == "function" ? (i = r, r = {}) : "callback" in r && (i = r.callback);
    const s = this.castInput(e, r), o = this.castInput(t, r), a = this.removeEmpty(this.tokenize(s, r)), u = this.removeEmpty(this.tokenize(o, r));
    return this.diffWithOptionsObj(a, u, r, i);
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
    }, a = t.length, u = e.length;
    let l = 1, c = a + u;
    r.maxEditLength != null && (c = Math.min(c, r.maxEditLength));
    const d = (s = r.timeout) !== null && s !== void 0 ? s : 1 / 0, f = Date.now() + d, p = [{ oldPos: -1, lastComponent: void 0 }];
    let m = this.extractCommon(p[0], t, e, 0, r);
    if (p[0].oldPos + 1 >= u && m + 1 >= a)
      return o(this.buildValues(p[0].lastComponent, t, e));
    let v = -1 / 0, y = 1 / 0;
    const _ = () => {
      for (let b = Math.max(v, -l); b <= Math.min(y, l); b += 2) {
        let C;
        const E = p[b - 1], N = p[b + 1];
        E && (p[b - 1] = void 0);
        let T = !1;
        if (N) {
          const S = N.oldPos - b;
          T = N && 0 <= S && S < a;
        }
        const x = E && E.oldPos + 1 < u;
        if (!T && !x) {
          p[b] = void 0;
          continue;
        }
        if (!x || T && E.oldPos < N.oldPos ? C = this.addToPath(N, !0, !1, 0, r) : C = this.addToPath(E, !1, !0, 1, r), m = this.extractCommon(C, t, e, b, r), C.oldPos + 1 >= u && m + 1 >= a)
          return o(this.buildValues(C.lastComponent, t, e)) || !0;
        p[b] = C, C.oldPos + 1 >= u && (y = Math.min(y, b - 1)), m + 1 >= a && (v = Math.max(v, b + 1));
      }
      l++;
    };
    if (i)
      (function b() {
        setTimeout(function() {
          if (l > c || Date.now() > f)
            return i(void 0);
          _() || b();
        }, 0);
      })();
    else
      for (; l <= c && Date.now() <= f; ) {
        const b = _();
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
class rk extends nk {
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
const ik = new rk();
function sk(n, e, t) {
  return ik.diff(n, e, t);
}
function Bi({ previousText: n, previousIndexes: e }, t, r, i) {
  if (!t)
    return { previousText: n, previousIndexes: e };
  const s = n.split(" "), o = t.split(" "), a = sk(s, o, {
    comparator: ak
  }), u = ok(a), l = [...e];
  let c = [...e], d = 0;
  for (const v of u) {
    do
      if (d < l[0]) break;
    while (l.shift() !== void 0);
    if (l.length === 0) break;
    if ("replaced" in v && v.replaced)
      c = _r(
        c,
        l[0],
        v.countAdded - v.countRemoved
      ), d += v.countRemoved;
    else if ("removed" in v && v.removed) {
      const y = v;
      d += y.count, c = _r(
        c,
        l[0],
        -y.count
      );
    } else if ("added" in v && v.added) {
      const y = v;
      c = _r(
        c,
        l[0],
        y.count
      );
    } else
      d += v.count;
  }
  const f = (v, y) => o.slice(v, y).join(" ");
  if (i && c.length > 0) {
    const v = c.length - 1, y = v > 0 ? c[v - 1] : 0, _ = f(y, c[v]);
    if (i(_)) {
      const [b] = os(
        _,
        r
      );
      b !== void 0 && (c[v] = y + b);
    }
  }
  const p = c.length > 0 ? c[c.length - 1] : 0, m = f(p);
  if (r(m)) {
    const v = os(m, r);
    c = c.concat(v.map((y) => y + p));
  }
  return {
    previousIndexes: c,
    previousText: t
  };
}
function ok(n) {
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
function _r(n, e, t) {
  return n.map((r) => r >= e ? r + t : r);
}
function os(n, e) {
  const t = n.split(" ");
  if (!e(n) || t.length <= 1)
    return [];
  let r;
  for (r = 0; r < t.length; r++) {
    const i = t.slice(0, r).join(" ");
    if (e(i)) break;
  }
  return [r - 1].concat(
    _r(
      os(
        t.slice(r - 1).join(" "),
        e
      ),
      0,
      r - 1
    )
  );
}
function ak(n, e) {
  const t = n.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), r = e.toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}", "gu"), ""), i = Math.min(t.length, r.length);
  let s = 0;
  for (let a = 0; a < i; a++)
    t[a] === r[a] && s++;
  return s / t.length > 0.8;
}
class lk {
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
class uk extends lk {
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
    this.resetAll(), this.currentState = Bi(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this),
      this.computeIfTextOverflows.bind(this)
    ), this.draw();
  }
  newPartial(e) {
    this.isResizing || (this.currentState = Bi(
      this.currentState,
      e.trim(),
      this.computeIfTextIsTooLong.bind(this),
      this.computeIfTextOverflows.bind(this)
    ), this.draw());
  }
  newFinal(e) {
    this.isResizing || (this.currentState = Bi(
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
function _u(n) {
  const e = Pe();
  let t = null;
  _e(() => {
    n.canvasRef.value && (t = new uk(n.canvasRef.value, {
      fontSize: n.fontSize.value,
      lineHeight: n.lineHeight.value
    }));
  }), re([n.fontSize, n.lineHeight], ([u, l]) => {
    t && t.setFontSize(u, l);
  }), re(
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
function xu(n) {
  const e = P(!1);
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
  return n && re(
    [n.display, n.pinned, n.frequency, n.duration],
    a
  ), _e(a), bt(i), { visible: e };
}
const _a = /\$(\w+)/g;
function ck(n, e) {
  const t = [];
  let r = 0, i;
  for (_a.lastIndex = 0; (i = _a.exec(n)) !== null; ) {
    i.index > r && t.push({ type: "text", value: n.slice(r, i.index) });
    const s = i[1] ?? "", o = s ? e[s] : void 0;
    o ? t.push({ type: "token", src: o.src, alt: o.alt ?? s }) : t.push({ type: "text", value: i[0] }), r = i.index + i[0].length;
  }
  return r < n.length && t.push({ type: "text", value: n.slice(r) }), t;
}
const dk = {
  key: 0,
  class: "watermark",
  "aria-hidden": "true"
}, fk = ["src", "alt"], pk = { key: 1 }, hk = /* @__PURE__ */ j({
  __name: "SubtitleWatermark",
  props: {
    visible: { type: Boolean }
  },
  setup(n) {
    const t = Pe().subtitle?.watermark, r = A(() => t ? ck(t.content.value, t.tokens.value) : []);
    return (i, s) => (k(), V(Fr, { name: "watermark" }, {
      default: z(() => [
        n.visible && h(t) ? (k(), L("div", dk, [
          (k(!0), L(ye, null, qe(r.value, (o, a) => (k(), L(ye, { key: a }, [
            o.type === "token" ? (k(), L("img", {
              key: 0,
              src: o.src,
              alt: o.alt,
              class: "watermark__img"
            }, null, 8, fk)) : (k(), L("span", pk, K(o.value), 1))
          ], 64))), 128))
        ])) : Y("", !0)
      ]),
      _: 1
    }));
  }
}), Eu = /* @__PURE__ */ ie(hk, [["__scopeId", "data-v-b8c2ff2b"]]), mk = ["height"], vk = /* @__PURE__ */ j({
  __name: "SubtitleBanner",
  setup(n) {
    const e = Pe(), t = Qe("canvas"), r = A(() => e.subtitle?.fontSize.value ?? 40), i = A(() => 1.2 * r.value), s = A(() => 2.4 * r.value);
    _u({
      canvasRef: t,
      fontSize: r,
      lineHeight: i
    });
    const { visible: o } = xu(
      e.subtitle?.watermark
    );
    return _e(() => {
      e.emit("subtitle:visible", { visible: !0, height: s.value });
    }), re(s, (a) => {
      e.emit("subtitle:visible", { visible: !0, height: a });
    }), bt(() => {
      e.emit("subtitle:visible", { visible: !1, height: 0 });
    }), (a, u) => (k(), L("div", {
      class: "subtitle-banner",
      style: Yt({ height: s.value + "px" })
    }, [
      B("canvas", {
        ref: "canvas",
        class: Se(["subtitle-canvas", { "subtitle-canvas--shrunk": h(o) }]),
        height: s.value
      }, null, 10, mk),
      q(Eu, { visible: h(o) }, null, 8, ["visible"])
    ], 4));
  }
}), gk = /* @__PURE__ */ ie(vk, [["__scopeId", "data-v-1baa0a4a"]]), yk = {
  ref: "container",
  class: "subtitle-fullscreen"
}, bk = ["aria-label"], kk = /* @__PURE__ */ j({
  __name: "SubtitleFullscreen",
  setup(n) {
    const e = Pe(), { t } = fe(), r = Qe("container"), i = Qe("canvas"), s = A(() => e.subtitle?.fontSize.value ?? 48), o = A(() => 1.2 * s.value);
    _u({
      canvasRef: i,
      fontSize: s,
      lineHeight: o
    });
    const { visible: a } = xu(
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
    }), (c, d) => (k(), L("div", yk, [
      B("button", {
        class: "subtitle-fullscreen__close",
        "aria-label": h(t)("subtitle.exitFullscreen"),
        onClick: l
      }, [
        q(h(ys), { size: 24 })
      ], 8, bk),
      B("canvas", {
        ref: "canvas",
        class: Se(["subtitle-fullscreen__canvas", { "subtitle-fullscreen__canvas--shrunk": h(a) }])
      }, null, 2),
      q(Eu, { visible: h(a) }, null, 8, ["visible"])
    ], 512));
  }
}), wk = /* @__PURE__ */ ie(kk, [["__scopeId", "data-v-e3ae14e0"]]), Tk = ["aria-label"], Sk = { class: "chat-session-list__header" }, _k = { class: "chat-session-list__title" }, xk = { class: "chat-session-list__items" }, Ek = {
  key: 1,
  class: "chat-session-confirm"
}, Ck = { class: "chat-session-confirm__text" }, Ak = /* @__PURE__ */ j({
  __name: "ChatSessionList",
  props: {
    sessions: {},
    activeSessionId: {}
  },
  emits: ["select", "create", "rename", "delete"],
  setup(n, { emit: e }) {
    const t = n, r = e, { t: i } = fe(), s = P(null), o = P(""), a = P(null), u = A(() => ({
      customParams: { "aria-label": i("chat.rename") }
    }));
    function l(y) {
      a.value = null, o.value = y.title, s.value = y.id;
    }
    function c() {
      const y = s.value;
      if (!y) return;
      s.value = null;
      const _ = o.value.trim(), b = t.sessions.find((C) => C.id === y);
      _ && _ !== b?.title && r("rename", y, _);
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
    return (y, _) => (k(), L("nav", {
      class: "chat-session-list",
      "aria-label": h(i)("chat.history")
    }, [
      B("header", Sk, [
        B("h3", _k, K(h(i)("chat.history")), 1),
        q(ne, {
          icon: "plus",
          variant: "transparent",
          size: "sm",
          "aria-label": h(i)("chat.newChat"),
          onClick: _[0] || (_[0] = (b) => r("create"))
        }, null, 8, ["aria-label"])
      ]),
      B("ul", xk, [
        (k(!0), L(ye, null, qe(n.sessions, (b) => (k(), L("li", {
          key: b.id,
          class: "chat-session-item"
        }, [
          s.value === b.id ? (k(), V(Cn, {
            key: 0,
            modelValue: o.value,
            "onUpdate:modelValue": _[1] || (_[1] = (C) => o.value = C),
            field: u.value,
            focus: !0,
            "full-width": "",
            size: "sm",
            onKeydown: f,
            onBlur: c
          }, null, 8, ["modelValue", "field"])) : a.value === b.id ? (k(), L("div", Ek, [
            B("span", Ck, K(h(i)("chat.deleteConfirm")), 1),
            q(ne, {
              icon: "x",
              variant: "transparent",
              size: "sm",
              "aria-label": h(i)("chat.cancel"),
              onClick: m
            }, null, 8, ["aria-label"]),
            q(ne, {
              icon: "check",
              variant: "transparent",
              intent: "destructive",
              size: "sm",
              "aria-label": h(i)("chat.confirmDelete"),
              onClick: v
            }, null, 8, ["aria-label"])
          ])) : (k(), V(ss, {
            key: 2,
            current: b.id === n.activeSessionId,
            label: b.title,
            title: b.title,
            onSelect: (C) => r("select", b.id)
          }, {
            actions: z(() => [
              q(ne, {
                icon: "pencil",
                variant: "transparent",
                size: "sm",
                "aria-label": h(i)("chat.rename"),
                onClick: (C) => l(b)
              }, null, 8, ["aria-label", "onClick"]),
              q(ne, {
                icon: "trash",
                variant: "transparent",
                intent: "destructive",
                size: "sm",
                "aria-label": h(i)("chat.deleteSession"),
                onClick: (C) => p(b.id)
              }, null, 8, ["aria-label", "onClick"])
            ]),
            _: 2
          }, 1032, ["current", "label", "title", "onSelect"]))
        ]))), 128))
      ])
    ], 8, Tk));
  }
}), Ik = /* @__PURE__ */ ie(Ak, [["__scopeId", "data-v-abf4cb1f"]]), Rk = /* @__PURE__ */ j({
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
    const t = n, r = P(!1);
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
    const o = A(() => r.value ? "check" : t.icon), a = A(() => cl[t.size ?? "sm"]);
    return (u, l) => (k(), V(ne, {
      variant: n.variant,
      size: n.size,
      disabled: n.disabled,
      block: n.block,
      "aria-label": n.ariaLabel,
      class: Se({ "copy-btn--copied": r.value }),
      onClick: s
    }, {
      icon: z(() => [
        q(Fr, {
          name: "copy-icon",
          mode: "out-in"
        }, {
          default: z(() => [
            (k(), V(Ye, {
              key: o.value,
              name: o.value,
              size: a.value
            }, null, 8, ["name", "size"]))
          ]),
          _: 1
        })
      ]),
      default: z(() => [
        Z(u.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["variant", "size", "disabled", "block", "aria-label", "class"]));
  }
}), Br = /* @__PURE__ */ ie(Rk, [["__scopeId", "data-v-0077b14e"]]), Mk = { class: "code-block" }, Pk = ["innerHTML"], Ok = { key: 1 }, Dk = /* @__PURE__ */ j({
  __name: "CodeBlock",
  props: {
    code: {},
    lang: {},
    streaming: { type: Boolean }
  },
  setup(n) {
    const e = n, { t } = fe();
    function r() {
      return navigator.clipboard.writeText(e.code);
    }
    const i = P(null);
    let s = 0;
    return re(
      () => [e.code, e.lang, e.streaming],
      async ([o, a, u]) => {
        const l = ++s;
        if (u || !o) {
          i.value = null;
          return;
        }
        const { highlightCode: c } = await import("./highlight-BlHabWLm.js");
        l === s && (i.value = c(o, a ?? ""));
      },
      { immediate: !0 }
    ), (o, a) => (k(), L("div", Mk, [
      n.streaming ? Y("", !0) : (k(), V(Br, {
        key: 0,
        class: "code-block__copy",
        variant: "transparent",
        size: "sm",
        "copy-fn": r,
        "aria-label": h(t)("markdown.copyCode")
      }, null, 8, ["aria-label"])),
      B("pre", null, [
        i.value ? (k(), L("code", {
          key: 0,
          innerHTML: i.value
        }, null, 8, Pk)) : (k(), L("code", Ok, K(n.code), 1))
      ])
    ]));
  }
}), Lk = /* @__PURE__ */ ie(Dk, [["__scopeId", "data-v-42abac84"]]), $k = { class: "markdown-view" }, Nk = ["innerHTML"], Bk = /* @__PURE__ */ j({
  __name: "MarkdownView",
  props: {
    source: {},
    streaming: { type: Boolean }
  },
  setup(n) {
    const e = n, t = A(() => Wd(e.source));
    return (r, i) => (k(), L("div", $k, [
      (k(!0), L(ye, null, qe(t.value, (s, o) => (k(), L(ye, { key: o }, [
        s.type === "html" ? (k(), L("div", {
          key: 0,
          class: "markdown-view__html",
          innerHTML: s.html
        }, null, 8, Nk)) : (k(), V(Lk, {
          key: 1,
          code: s.code,
          lang: s.lang,
          streaming: n.streaming
        }, null, 8, ["code", "lang", "streaming"]))
      ], 64))), 128))
    ]));
  }
}), zk = /* @__PURE__ */ ie(Bk, [["__scopeId", "data-v-89c2c4e6"]]), Fk = {
  key: 0,
  class: "chat-message chat-message--user"
}, qk = { class: "chat-message__bubble" }, Vk = {
  key: 1,
  class: "chat-message chat-message--assistant"
}, Hk = {
  class: "chat-message__marker",
  "aria-hidden": "true"
}, Wk = { class: "chat-message__body" }, Uk = {
  key: 1,
  class: "chat-message__typing",
  "aria-hidden": "true"
}, jk = {
  key: 2,
  class: "chat-message__actions"
}, Gk = /* @__PURE__ */ j({
  __name: "ChatMessage",
  props: {
    message: {}
  },
  setup(n) {
    const e = n, { t } = fe();
    function r() {
      return navigator.clipboard.writeText(e.message.content);
    }
    return (i, s) => n.message.role === "user" ? (k(), L("div", Fk, [
      B("div", qk, K(n.message.content), 1)
    ])) : (k(), L("div", Vk, [
      B("span", Hk, [
        q(Ye, {
          name: "sparkles",
          size: 16
        })
      ]),
      B("div", Wk, [
        n.message.content ? (k(), V(zk, {
          key: 0,
          source: n.message.content,
          streaming: n.message.streaming
        }, null, 8, ["source", "streaming"])) : Y("", !0),
        n.message.streaming ? (k(), L("div", Uk, [...s[0] || (s[0] = [
          B("span", null, null, -1),
          B("span", null, null, -1),
          B("span", null, null, -1)
        ])])) : Y("", !0),
        !n.message.streaming && n.message.content ? (k(), L("div", jk, [
          q(Br, {
            variant: "secondary",
            size: "sm",
            "copy-fn": r,
            "aria-label": h(t)("chat.copy")
          }, {
            default: z(() => [
              pe(K(h(t)("chat.copy")), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : Y("", !0)
      ])
    ]));
  }
}), Kk = /* @__PURE__ */ ie(Gk, [["__scopeId", "data-v-7ee16e63"]]), Xk = { class: "chat-message-list" }, Yk = {
  key: 0,
  class: "chat-message-list__state",
  role: "status"
}, Zk = { class: "sr-only" }, Qk = {
  key: 1,
  class: "chat-message-list__state"
}, Jk = {
  key: 2,
  class: "chat-message-list__state"
}, ew = { class: "chat-message-list__items" }, tw = /* @__PURE__ */ j({
  __name: "ChatMessageList",
  props: {
    messages: {},
    hasActiveSession: { type: Boolean },
    isLoading: { type: Boolean }
  },
  setup(n) {
    const { t: e } = fe();
    return (t, r) => (k(), L("div", Xk, [
      n.isLoading ? (k(), L("div", Yk, [
        q(Ye, {
          name: "spinner",
          size: 28,
          spin: ""
        }),
        B("span", Zk, K(h(e)("editor.loading")), 1)
      ])) : n.hasActiveSession ? n.messages.length === 0 ? (k(), L("div", Jk, [
        B("p", null, K(h(e)("chat.emptyChat")), 1)
      ])) : (k(), V(h(Tp), {
        key: 3,
        class: "chat-message-list__scroll",
        resize: "smooth",
        initial: !0
      }, {
        default: z(() => [
          B("div", ew, [
            (k(!0), L(ye, null, qe(n.messages, (i) => (k(), V(Kk, {
              key: i.id,
              message: i
            }, null, 8, ["message"]))), 128))
          ])
        ]),
        _: 1
      })) : (k(), L("div", Qk, [
        B("p", null, K(h(e)("chat.emptyState")), 1)
      ]))
    ]));
  }
}), nw = /* @__PURE__ */ ie(tw, [["__scopeId", "data-v-a132e63a"]]), rw = { class: "chat-composer" }, iw = ["for"], sw = ["id", "placeholder", "disabled"], ow = /* @__PURE__ */ j({
  __name: "ChatComposer",
  props: {
    disabled: { type: Boolean }
  },
  emits: ["send"],
  setup(n, { emit: e }) {
    const t = n, r = e, i = Qe("chat-composer__textarea"), { t: s } = fe(), o = P(""), a = zr();
    function u() {
      const c = o.value.trim();
      !c || t.disabled || (o.value = "", r("send", c));
    }
    function l(c) {
      c.key !== "Escape" && (c.stopPropagation(), c.key === "Enter" && !c.shiftKey && (c.preventDefault(), u()));
    }
    return _e(() => {
      i.value?.focus();
    }), (c, d) => (k(), L("div", rw, [
      B("label", {
        for: h(a),
        class: "sr-only"
      }, K(h(s)("chat.placeholder")), 9, iw),
      Fn(B("textarea", {
        id: h(a),
        "onUpdate:modelValue": d[0] || (d[0] = (f) => o.value = f),
        class: "chat-composer__textarea",
        placeholder: h(s)("chat.placeholder"),
        disabled: n.disabled,
        rows: "2",
        ref: "chat-composer__textarea",
        onKeydown: l
      }, null, 40, sw), [
        [uc, o.value]
      ]),
      q(ne, {
        icon: "send",
        variant: "primary",
        size: "md",
        disabled: !o.value.trim() || n.disabled,
        "aria-label": h(s)("chat.send"),
        onClick: u
      }, null, 8, ["disabled", "aria-label"])
    ]));
  }
}), aw = /* @__PURE__ */ ie(ow, [["__scopeId", "data-v-846654fe"]]), lw = ["aria-labelledby"], uw = { class: "chat-drawer__header" }, cw = ["id"], dw = { class: "chat-drawer__actions" }, fw = { class: "chat-drawer__body" }, pw = { class: "chat-drawer__main" }, hw = /* @__PURE__ */ j({
  __name: "ChatDrawer",
  setup(n) {
    const e = Pe(), { t } = fe(), r = e.chat, i = zr(), s = P(!1);
    function o() {
      r.setDrawerOpen(!1);
    }
    function a() {
      s.value = !s.value;
    }
    function u(m) {
      m.key === "Escape" && r.drawerOpen.value && o();
    }
    re(
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
    return (m, v) => (k(), V(Fr, { name: "chat-drawer" }, {
      default: z(() => [
        h(r).drawerOpen.value ? (k(), L("div", {
          key: 0,
          class: "chat-overlay",
          onClick: Le(o, ["self"])
        }, [
          B("aside", {
            class: Se(["chat-drawer", { "chat-drawer--expanded": s.value }]),
            role: "dialog",
            "aria-modal": "true",
            "aria-labelledby": h(i)
          }, [
            B("header", uw, [
              B("h2", {
                id: h(i),
                class: "chat-drawer__title"
              }, [
                q(Ye, {
                  name: "sparkles",
                  size: 18
                }),
                pe(" " + K(h(t)("chat.title")), 1)
              ], 8, cw),
              B("div", dw, [
                q(ne, {
                  class: "chat-drawer__expand",
                  icon: s.value ? "minimize" : "maximize",
                  variant: "tertiary",
                  size: "sm",
                  "aria-label": s.value ? h(t)("chat.collapse") : h(t)("chat.expand"),
                  onClick: a
                }, null, 8, ["icon", "aria-label"]),
                q(ne, {
                  icon: "x",
                  variant: "tertiary",
                  size: "sm",
                  "aria-label": h(t)("chat.close"),
                  onClick: o
                }, null, 8, ["aria-label"])
              ])
            ]),
            B("div", fw, [
              q(Ik, {
                sessions: h(r).sessions.value,
                "active-session-id": h(r).activeSessionId.value,
                onSelect: l,
                onCreate: c,
                onRename: d,
                onDelete: f
              }, null, 8, ["sessions", "active-session-id"]),
              B("div", pw, [
                q(nw, {
                  messages: h(r).allMessages.value,
                  "has-active-session": h(r).activeSessionId.value !== null,
                  "is-loading": h(r).isLoadingSession.value
                }, null, 8, ["messages", "has-active-session", "is-loading"]),
                q(aw, {
                  disabled: h(r).isStreaming.value || h(r).isLoadingSession.value,
                  onSend: p
                }, null, 8, ["disabled"])
              ])
            ])
          ], 10, lw)
        ])) : Y("", !0)
      ]),
      _: 1
    }));
  }
}), mw = /* @__PURE__ */ ie(hw, [["__scopeId", "data-v-3b5af03a"]]), vw = ["aria-label"], gw = { class: "selection-count" }, yw = { class: "selection-actions" }, bw = /* @__PURE__ */ j({
  __name: "SelectionActionBar",
  setup(n) {
    const e = eu(), { t } = fe();
    return (r, i) => h(e).hasSelection.value ? (k(), L("div", {
      key: 0,
      class: "selection-bar",
      role: "toolbar",
      "aria-label": h(t)("selection.count")
    }, [
      B("span", gw, K(h(e).count.value) + " " + K(h(t)("selection.count")), 1),
      B("div", yw, [
        q(Br, {
          icon: "clipboard-type",
          "copy-fn": h(e).copyText,
          variant: "secondary"
        }, {
          default: z(() => [
            pe(K(h(t)("selection.copyText")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(Br, {
          icon: "clipboard-list",
          "copy-fn": h(e).copyWithMetadata
        }, {
          default: z(() => [
            pe(K(h(t)("selection.copyWithMetadata")), 1)
          ]),
          _: 1
        }, 8, ["copy-fn"]),
        q(ne, {
          variant: "transparent",
          icon: "x",
          onClick: i[0] || (i[0] = (s) => h(e).clear())
        }, {
          default: z(() => [
            pe(K(h(t)("selection.cancel")), 1)
          ]),
          _: 1
        })
      ])
    ], 8, vw)) : Y("", !0);
  }
}), kw = /* @__PURE__ */ ie(bw, [["__scopeId", "data-v-1f9dee3a"]]), ww = "(max-width: 767px)";
function Tw() {
  const n = P(!1);
  let e = null;
  function t(r) {
    n.value = r.matches;
  }
  return _e(() => {
    e = window.matchMedia(ww), n.value = e.matches, e.addEventListener("change", t);
  }), bt(() => {
    e?.removeEventListener("change", t);
  }), { isMobile: n };
}
const Sw = { class: "editor-layout" }, _w = { class: "editor-body" }, xw = {
  key: 6,
  class: "mobile-selectors"
}, Ew = /* @__PURE__ */ j({
  __name: "Layout",
  props: {
    showHeader: { type: Boolean, default: !0 }
  },
  setup(n) {
    const e = n, t = Pe(), { isMobile: r } = Tw(), i = P(!1), s = P(yn), o = A(
      () => t.activeChannel.value?.activeTranslation.value.turns.value ?? []
    ), a = t.speakers.all;
    Gg(o, a, t);
    const u = A(() => [...t.channels.values()]), l = A(
      () => t.activeChannel.value?.selectableTranslations ?? []
    ), c = A(
      () => t.activeChannel.value?.activeTranslation.value.id ?? ""
    ), d = A(() => Array.from(a.values())), f = A(() => s.value === yn), p = A(() => s.value === kr), m = A(() => f.value || p.value ? null : t.llmServices?.get(s.value) ?? null);
    re(s, (b) => {
      t.llmServices && (b === yn || b === kr ? t.llmServices.setActive(null) : t.llmServices.setActive(b));
    }), re(
      () => t.llmServices?.list.value.map((b) => b.id).join("|"),
      () => {
        s.value !== yn && s.value !== kr && !t.llmServices?.get(s.value) && (s.value = yn);
      }
    );
    const v = Qe("audioPlayer");
    re(
      () => t.activeChannelId.value,
      () => {
        v.value?.pause(), t.audio && (t.audio.currentTime.value = 0, t.audio.isPlaying.value = !1), i.value = !1;
      }
    ), re(f, (b) => {
      b || v.value?.pause();
    });
    function y(b) {
      t.setActiveChannel(b);
    }
    function _(b) {
      t.activeChannel.value?.setActiveTranslation(b);
    }
    return (b, C) => (k(), L("div", Sw, [
      e.showHeader ? (k(), V(sp, {
        key: 0,
        title: h(t).title.value,
        date: h(t).date.value,
        duration: h(t).activeChannel.value?.duration ?? 0,
        "speaker-count": h(a).size,
        "is-mobile": h(r),
        "can-ask": !!h(t).chat,
        onToggleSidebar: C[0] || (C[0] = (E) => i.value = !i.value),
        onOpenChat: C[1] || (C[1] = (E) => h(t).chat?.setDrawerOpen(!0))
      }, null, 8, ["title", "date", "duration", "speaker-count", "is-mobile", "can-ask"])) : Y("", !0),
      q(hp, {
        modelValue: s.value,
        "onUpdate:modelValue": C[2] || (C[2] = (E) => s.value = E)
      }, null, 8, ["modelValue"]),
      f.value ? (k(), V(kw, { key: 1 })) : Y("", !0),
      B("main", _w, [
        f.value ? (k(), V(ha, {
          key: 0,
          turns: o.value,
          speakers: h(a)
        }, null, 8, ["turns", "speakers"])) : p.value ? (k(), V(Xy, { key: 1 })) : m.value ? (k(), V($b, {
          key: m.value.id,
          service: m.value
        }, null, 8, ["service"])) : (k(), V(ha, {
          key: 3,
          turns: o.value,
          speakers: h(a)
        }, null, 8, ["turns", "speakers"])),
        h(r) ? Y("", !0) : (k(), V(ya, {
          key: 4,
          speakers: d.value,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          translations: l.value,
          "selected-translation-id": c.value,
          "show-speakers": f.value,
          "onUpdate:selectedChannelId": y,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id", "show-speakers"])),
        h(r) ? (k(), V(P0, {
          key: 5,
          open: i.value,
          "onUpdate:open": C[3] || (C[3] = (E) => i.value = E)
        }, {
          default: z(() => [
            q(ya, {
              speakers: d.value,
              channels: u.value,
              "selected-channel-id": h(t).activeChannelId.value,
              translations: l.value,
              "selected-translation-id": c.value,
              "show-speakers": f.value,
              "onUpdate:selectedChannelId": y,
              "onUpdate:selectedTranslationId": _
            }, null, 8, ["speakers", "channels", "selected-channel-id", "translations", "selected-translation-id", "show-speakers"])
          ]),
          _: 1
        }, 8, ["open"])) : Y("", !0)
      ]),
      h(t).audio?.src.value ? Fn((k(), V(tk, {
        key: 2,
        ref: "audioPlayer",
        "audio-src": h(t).audio.src.value
      }, null, 8, ["audio-src"])), [
        [Ba, f.value]
      ]) : Y("", !0),
      h(t).subtitle?.isVisible.value && !h(r) && !h(t).subtitle.isFullscreen.value ? (k(), V(gk, { key: 3 })) : Y("", !0),
      h(t).subtitle?.isFullscreen.value ? (k(), V(wk, { key: 4 })) : Y("", !0),
      h(t).chat ? (k(), V(mw, { key: 5 })) : Y("", !0),
      h(r) && (u.value.length > 1 || l.value.length > 1) ? (k(), L("div", xw, [
        u.value.length > 1 ? (k(), V(vu, {
          key: 0,
          channels: u.value,
          "selected-channel-id": h(t).activeChannelId.value,
          "onUpdate:selectedChannelId": y
        }, null, 8, ["channels", "selected-channel-id"])) : Y("", !0),
        l.value.length > 1 ? (k(), V(gu, {
          key: 1,
          translations: l.value,
          "selected-translation-id": c.value,
          "onUpdate:selectedTranslationId": _
        }, null, 8, ["translations", "selected-translation-id"])) : Y("", !0)
      ])) : Y("", !0)
    ]));
  }
}), v1 = /* @__PURE__ */ ie(Ew, [["__scopeId", "data-v-5918b5b2"]]), Cw = 0.05;
function g1(n = {}) {
  return {
    name: "audio",
    install(e) {
      const t = P(0), r = P(!1), i = P(null), s = P(null);
      let o = null, a = null;
      const u = A(
        () => e.activeChannel.value?.activeTranslation.value.audio ?? null
      ), l = P(null), c = P(null);
      let d = null;
      function f() {
        d && (URL.revokeObjectURL(d), d = null);
      }
      const p = re(
        u,
        async (T) => {
          if (f(), l.value = null, c.value = null, !T) return;
          const x = n.resolveWaveform ? Promise.resolve(n.resolveWaveform(T)).catch((S) => (console.warn("[audio] resolveWaveform failed", S), null)) : Promise.resolve(null);
          try {
            const [S, w] = await Promise.all([
              n.resolveSrc ? n.resolveSrc(T) : Promise.resolve(T.src),
              x
            ]);
            c.value = w?.length ? w : null, l.value = S, S.startsWith("blob:") && (d = S);
          } catch (S) {
            console.error("[audio] resolveSrc failed", S);
          }
        },
        { immediate: !0 }
      ), m = A(() => l.value);
      let v = Number.NEGATIVE_INFINITY;
      const y = et(() => {
        const T = t.value;
        if (r.value) {
          const w = T - v;
          if (w >= 0 && w < Cw) return;
        }
        v = T;
        const S = e.activeChannel.value?.activeTranslation.value;
        if (S)
          for (const w of S.turns.value) {
            const I = w.words, D = ef(I) ?? w.startTime, F = tf(I) ?? w.endTime;
            if (D != null && F != null && T >= D && T <= F) {
              s.value = w.id, i.value = tl(I, T);
              return;
            }
          }
      });
      function _(T) {
        o?.(T);
      }
      function b(T) {
        o = T;
      }
      function C() {
        a?.();
      }
      function E(T) {
        a = T;
      }
      const N = {
        currentTime: t,
        isPlaying: r,
        src: m,
        waveform: c,
        activeWordId: i,
        activeTurnId: s,
        seekTo: _,
        setSeekHandler: b,
        pause: C,
        setPauseHandler: E
      };
      return e.audio = N, () => {
        p(), y(), f(), e.audio = void 0;
      };
    }
  };
}
class Aw {
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
function Iw(n, e) {
  const t = n.core.activeChannel.value;
  if (t)
    return n.locks.get(
      Xt(t.activeTranslation.value.id, e)
    );
}
function Rw(n, e) {
  n.locks.clear();
  for (const t of e) Us(n, t);
}
function Us(n, e) {
  n.locks.set(Xt(e.translationId, e.turnId), {
    userId: e.userId,
    userName: e.userName
  });
}
function Mw(n, e) {
  n.locks.delete(Xt(e.translationId, e.turnId));
}
function js(n) {
  const e = n.editingRef;
  return n.editingTurnId.value = null, n.editingRef = null, n.heartbeat.stop(), e && n.locks.delete(Xt(e.translationId, e.turnId)), e;
}
async function gt(n, e) {
  try {
    await n.unlockTurn?.(e);
  } catch (t) {
    console.error("[transcriptionEditor] unlock failed:", t);
  }
}
function Cu(n) {
  const e = js(n);
  e && gt(n.options, e);
}
async function Pw(n, e) {
  try {
    const t = await n.options.lockTurn(e);
    t?.ok || Ow(n, e, t?.reason);
  } catch (t) {
    console.error("[transcriptionEditor] heartbeat failed:", t);
  }
}
function Ow(n, e, t) {
  !n.editingRef || n.editingRef.turnId !== e.turnId || (console.error(
    `[transcriptionEditor] lock lost on turn ${e.turnId}: ${t ?? "unknown"}`
  ), n.editingTurnId.value = null, n.editingRef = null, n.heartbeat.stop());
}
async function Dw(n, e, t = 0) {
  if (n.core.capabilities.value.text !== "edit" || n.lockPending || n.editingTurnId.value === e) return;
  const r = nn(n.core);
  if (!r?.hasTurn(e) || n.locks.has(Xt(r.id, e))) return;
  n.editingTurnId.value !== null && Cu(n);
  const i = { translationId: r.id, turnId: e };
  if (n.options.lockTurn) {
    n.lockPending = !0;
    try {
      const s = await n.options.lockTurn(i);
      if (!s?.ok) {
        s?.holder && Us(n, { ...i, ...s.holder });
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
    Pw(n, i);
  });
}
function Au(n, e, t) {
  const r = py(fy(n, e), t);
  return { text: r.length > 0 ? null : e, words: r };
}
async function Yr(n, e) {
  try {
    const t = await e;
    t && !t.ok && console.error(
      `[transcriptionEditor] ${n} rejected: ${t.reason ?? "unknown"}`
    );
  } catch (t) {
    console.error(`[transcriptionEditor] ${n} failed:`, t);
  }
}
async function Lw(n, e) {
  await Yr("delete_turn", n.deleteTurn?.(e)), await gt(n, e);
}
async function Iu(n, e) {
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
  await gt(n, {
    translationId: e.translationId,
    turnId: e.turnId
  });
}
function Ru(n, e) {
  const t = n.editingTurnId.value;
  if (t === null) return;
  const r = js(n), i = nn(n.core), s = i?.getTurn(t);
  if (!i || !s) {
    r && gt(n.options, r);
    return;
  }
  const o = e.replace(/\s+/g, " ").trim();
  if (o === "") {
    if (i.turns.value.length <= 1) {
      r && gt(n.options, r);
      return;
    }
    if (!n.options.deleteTurn) {
      i.removeTurn(t);
      return;
    }
    Lw(n.options, {
      translationId: i.id,
      turnId: t
    });
    return;
  }
  if (o === $s(s)) {
    r && gt(n.options, r);
    return;
  }
  i.updateTurn(
    t,
    Au(t, o, s.words)
  ), Iu(n.options, {
    translationId: i.id,
    turnId: t,
    text: o
  });
}
function $w(n, e) {
  const r = n.slice(0, Math.max(0, e)).replace(/\s+/g, " ").replace(/^\s/, ""), i = n.replace(/\s+/g, " ").trim().length;
  return Math.min(r.length, i);
}
async function Nw(n, e) {
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
        ), await gt(n, t);
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
  await gt(n, t);
}
function Bw(n, e, t) {
  if (e.replace(/\s+/g, " ").trim() === "") {
    Ru(n, e);
    return;
  }
  const r = n.editingTurnId.value;
  if (r === null) return;
  const i = js(n), s = nn(n.core), o = s?.getTurn(r);
  if (!s || !o) {
    i && gt(n.options, i);
    return;
  }
  const a = e.replace(/\s+/g, " ").trim(), u = a !== $s(o);
  u && s.updateTurn(
    r,
    Au(r, a, o.words)
  );
  const l = $w(e, t);
  if (l <= 0 || l >= a.length) {
    u ? Iu(n.options, {
      translationId: s.id,
      turnId: r,
      text: a
    }) : i && gt(n.options, i);
    return;
  }
  Nw(n.options, {
    translationId: s.id,
    turnId: r,
    text: a,
    offset: l,
    textChanged: u
  });
}
function rn(n, e, t) {
  const r = n.versions.get(e);
  return t == null || r == null ? !0 : t <= r ? !1 : t === r + 1 ? (n.versions.set(e, t), !0) : (Mu(n, e), !1);
}
function Mu(n, e) {
  n.options.refetchTranslation && (n.pendingRefetches.has(e) || (n.pendingRefetches.add(e), n.options.refetchTranslation(e).catch((t) => {
    console.error(
      `[transcriptionEditor] refetch failed for track ${e}:`,
      t
    );
  }).finally(() => {
    n.pendingRefetches.delete(e);
  })));
}
function An(n, e) {
  for (const t of n.channels.values()) {
    const r = t.translations.get(e);
    if (r) return r;
  }
}
function zw(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.turnId && n.editingRef.translationId === e.translationId)
    return;
  const t = An(n.core, e.translationId);
  if (!t || !t.hasTurn(e.turnId)) return;
  const r = Ns(e.turnId, e.words);
  t.updateTurn(e.turnId, {
    // Turn contract: text carries the content only when words is empty.
    text: r.length > 0 ? null : e.text,
    words: r,
    ...e.stime !== void 0 && { startTime: e.stime },
    ...e.etime !== void 0 && { endTime: e.etime }
  });
}
function Pu(n) {
  const e = Ns(n.turnId, n.words);
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
function Fw(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.originalTurnId && n.editingRef.translationId === e.translationId)
    return;
  const t = An(n.core, e.translationId);
  if (!t || !t.hasTurn(e.originalTurnId)) return;
  const r = e.turns.map(Pu);
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
async function qw(n, e) {
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
function Vw(n, e, t) {
  if (n.core.capabilities.value.text !== "edit") return;
  const r = nn(n.core);
  r && (!r.hasTurn(e) || !r.hasTurn(t) || n.locks.has(Xt(r.id, e)) || n.locks.has(Xt(r.id, t)) || qw(n.options, {
    translationId: r.id,
    firstTurnId: e,
    secondTurnId: t
  }));
}
function Hw(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.translationId === e.translationId && (n.editingRef.turnId === e.mergedTurnId || n.editingRef.turnId === e.removedTurnId))
    return;
  const t = An(n.core, e.translationId);
  if (!t || !t.hasTurn(e.mergedTurnId)) return;
  const r = Pu(e.turn);
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
function Gs(n, e) {
  for (const t of n.channels.values())
    for (const r of t.translations.values())
      for (const i of r.turns.value)
        if (i.speakerId === e) return;
  n.speakers.delete(e);
}
function Ww(n, e) {
  if (!rn(n, e.translationId, e.version) || n.editingRef && n.editingRef.turnId === e.turnId && n.editingRef.translationId === e.translationId)
    return;
  const t = An(n.core, e.translationId);
  !t || !t.hasTurn(e.turnId) || (t.removeTurn(e.turnId), e.removedSpeakerId && Gs(n.core, e.removedSpeakerId));
}
function Uw(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit") return;
  const r = nn(n.core);
  if (!r?.hasTurn(e)) return;
  const i = t.speakerName?.trim() ?? "", s = !!t.speakerId;
  if (s !== !!i && !(s && r.getTurn(e)?.speakerId === t.speakerId)) {
    if (!n.options.updateTurnSpeaker) {
      s ? Ls(n.core, e, t.speakerId) : Zl(n.core, e, i);
      return;
    }
    Yr(
      "update_turn_speaker",
      n.options.updateTurnSpeaker({
        translationId: r.id,
        turnId: e,
        ...s ? { speakerId: t.speakerId } : { speakerName: i }
      })
    );
  }
}
function jw(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit") return;
  const r = t.trim(), i = n.core.speakers.all.get(e);
  if (!i || !r || r === i.name) return;
  const s = nn(n.core);
  if (!n.options.renameSpeaker || !s) {
    Yl(n.core, e, r);
    return;
  }
  Yr(
    "rename_speaker",
    n.options.renameSpeaker({
      translationId: s.id,
      speakerId: e,
      name: r
    })
  );
}
function Gw(n, e, t) {
  if (n.core.capabilities.value.speakers !== "edit" || e === t) return;
  const { all: r } = n.core.speakers;
  if (!r.has(e) || !r.has(t)) return;
  const i = nn(n.core);
  if (!n.options.replaceSpeaker || !i) {
    Ql(n.core, e, t);
    return;
  }
  Yr(
    "replace_speaker",
    n.options.replaceSpeaker({
      translationId: i.id,
      fromSpeakerId: e,
      toSpeakerId: t
    })
  );
}
function Kw(n, e) {
  if (!rn(n, e.translationId, e.version)) return;
  const { speakers: t } = n.core;
  t.ensure(e.speaker.id, e.speaker.name), t.update(e.speaker.id, { name: e.speaker.name });
  const r = An(n.core, e.translationId);
  r?.hasTurn(e.turnId) && r.updateTurn(e.turnId, { speakerId: e.speaker.id }), e.removedSpeakerId && Gs(n.core, e.removedSpeakerId);
}
function Xw(n, e) {
  rn(n, e.translationId, e.version) && n.core.speakers.update(e.speakerId, { name: e.name });
}
function Yw(n, e) {
  if (!rn(n, e.translationId, e.version)) return;
  n.core.speakers.ensure(e.toSpeakerId);
  const t = An(n.core, e.translationId);
  if (t)
    for (const r of t.turns.value)
      r.speakerId === e.fromSpeakerId && t.updateTurn(r.id, { speakerId: e.toSpeakerId });
  Gs(n.core, e.fromSpeakerId);
}
function Zw(n, e, t) {
  n.versions.set(e, t);
}
function Qw(n, e) {
  for (const [t, r] of Object.entries(e)) {
    const i = n.versions.get(t);
    i != null && r > i && Mu(n, t);
  }
}
const Jw = 15e3;
class e1 {
  core;
  options;
  editingTurnId = P(null);
  editingCaretOffset = P(0);
  locks = Un(/* @__PURE__ */ new Map());
  editingRef = null;
  lockPending = !1;
  heartbeat = new Aw(Jw);
  versions = /* @__PURE__ */ new Map();
  pendingRefetches = /* @__PURE__ */ new Set();
  constructor(e, t) {
    this.core = e, this.options = t;
  }
  beginEdit(e, t) {
    return Dw(this, e, t);
  }
  cancelEdit() {
    Cu(this);
  }
  saveTurn(e) {
    Ru(this, e);
  }
  splitTurn(e, t) {
    Bw(this, e, t);
  }
  applyTurnUpdate(e) {
    zw(this, e);
  }
  applyTurnSplit(e) {
    Fw(this, e);
  }
  mergeTurns(e, t) {
    Vw(this, e, t);
  }
  applyTurnsMerged(e) {
    Hw(this, e);
  }
  applyTurnDeleted(e) {
    Ww(this, e);
  }
  setTranslationVersion(e, t) {
    Zw(this, e, t);
  }
  reconcileVersions(e) {
    Qw(this, e);
  }
  updateTurnSpeaker(e, t) {
    Uw(this, e, t);
  }
  renameSpeaker(e, t) {
    jw(this, e, t);
  }
  replaceSpeaker(e, t) {
    Gw(this, e, t);
  }
  applyTurnSpeakerUpdated(e) {
    Kw(this, e);
  }
  applySpeakerRenamed(e) {
    Xw(this, e);
  }
  applySpeakerReplaced(e) {
    Yw(this, e);
  }
  getTurnLock(e) {
    return Iw(this, e);
  }
  setLocks(e) {
    Rw(this, e);
  }
  setTurnLock(e) {
    Us(this, e);
  }
  clearTurnLock(e) {
    Mw(this, e);
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
function y1(n = {}) {
  return {
    name: "transcriptionEditor",
    install(e) {
      const t = new e1(e, n);
      e.transcriptionEditor = t;
      const r = e.on("document:change", () => t.reset());
      return () => {
        r(), t.destroy();
      };
    }
  };
}
const Ks = typeof window < "u" && "speechSynthesis" in window;
function Zr() {
  return Ks;
}
function t1() {
  return Ks && window.speechSynthesis.getVoices().length > 0;
}
function n1(n) {
  if (!Ks || !n || n === "*") return null;
  const e = n.toLowerCase(), t = e.split("-")[0], r = window.speechSynthesis.getVoices(), i = r.find((s) => s.lang.toLowerCase() === e);
  return i || (r.find((s) => s.lang.toLowerCase().split("-")[0] === t) ?? null);
}
function xa(n, e) {
  if (!Zr()) return;
  const t = n.trim();
  if (!t) return;
  const r = new SpeechSynthesisUtterance(t), i = e ? n1(e) : null;
  i && (r.voice = i, r.lang = i.lang), window.speechSynthesis.speak(r);
}
function r1() {
  Zr() && window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
}
function Ea() {
  Zr() && window.speechSynthesis.cancel();
}
function Ca(n) {
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
function zi(n, e) {
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
function b1(n = {}) {
  const e = n.tts ?? !1;
  return {
    name: "live",
    install(t) {
      const r = Dt(null), i = P(!1), s = P(!1), o = Zr(), a = P(!1);
      function u() {
        a.value = t1();
      }
      o && (u(), window.speechSynthesis.addEventListener("voiceschanged", u));
      let l = null;
      i.value = !0;
      function c() {
        r.value = null, l = null;
      }
      function d($, O) {
        return $.isSource ? !1 : $.languages.some((M) => Er(M, O));
      }
      function f($, O) {
        if (t.activeChannelId.value !== O) return;
        const M = t.activeChannel.value;
        if (!M) return;
        l = $, M.activeTranslation.value.isSource && $.text != null && (r.value = $.text);
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
      function y($, O) {
        $.hasTurn(O.id) ? $.updateTurn(O.id, O) : $.addTurn(O);
      }
      function _($, O) {
        $.speakerId && t.speakers.ensure($.speakerId);
        const M = t.channels.get(O);
        if (!M) {
          E();
          return;
        }
        if ($.text != null && y(
          M.sourceTranslation,
          Ca($)
        ), $.translations)
          for (const X of $.translations) {
            const se = M.translations.get(X.translationId);
            se && y(
              se,
              zi($, {
                ...X,
                sourceLanguage: $.language
              })
            );
          }
        const W = t.activeChannel.value?.activeTranslation.value;
        W?.isSource && E(), s.value && W?.isSource && $.text != null && t.activeChannelId.value === O && xa($.text, $.language);
      }
      function b($, O) {
        C([$], O);
      }
      function C($, O) {
        const M = t.channels.get(O);
        if (!M) return;
        const W = /* @__PURE__ */ new Set();
        for (const oe of $)
          oe.speakerId && !W.has(oe.speakerId) && (W.add(oe.speakerId), t.speakers.ensure(oe.speakerId));
        const X = [];
        for (const oe of $)
          oe.text != null && X.push(Ca(oe));
        X.length > 0 && M.sourceTranslation.prependTurns(X);
        const se = /* @__PURE__ */ new Map();
        for (const oe of $)
          if (oe.translations)
            for (const we of oe.translations) {
              let le = se.get(we.translationId);
              le || (le = [], se.set(we.translationId, le)), le.push(
                zi(oe, {
                  ...we,
                  sourceLanguage: oe.language
                })
              );
            }
        for (const [oe, we] of se) {
          const le = M.translations.get(oe);
          le && le.prependTurns(we);
        }
      }
      function E() {
        v(), c();
      }
      function N($) {
        const O = t.activeChannel.value;
        if (!O) return;
        const M = O.activeTranslation.value;
        if (!$.final) {
          M.id === jt ? $.turnId === l?.turnId && !Er(
            $.language,
            l?.language
          ) && (r.value = $.text) : d(M, $.language) && (r.value = $.text);
          return;
        }
        const W = O.translations.get($.language);
        if (W) {
          const X = zi(
            { ...$ },
            $
          );
          W === M || M.id === jt ? y(W, X) : W.updateOrCreateTurnSilent(X);
        }
        (d(M, $.language) || M.id === jt) && (E(), s.value && $.text && xa($.text, $.language));
      }
      function T() {
        s.value = !0, r1();
      }
      function x() {
        s.value = !1, Ea();
      }
      const S = {
        partial: r,
        hasLiveUpdate: i,
        ttsAvailable: e,
        ttsEnabled: s,
        ttsReady: a,
        enableTTS: T,
        disableTTS: x,
        onPartial: f,
        onFinal: _,
        prependFinal: b,
        prependFinalBatch: C,
        onTranslation: N
      }, w = t.on(
        "channel:change",
        E
      ), I = t.on(
        "translation:change",
        E
      ), D = t.on(
        "translation:sync",
        m
      ), F = t.on("channel:sync", m);
      return t.live = S, () => {
        E(), Ea(), o && window.speechSynthesis.removeEventListener(
          "voiceschanged",
          u
        ), w(), I(), D(), F(), t.live = void 0;
      };
    }
  };
}
function k1(n = {}) {
  return {
    name: "subtitle",
    install(e) {
      const t = P(n.fontSize ?? 40), r = P(n.isVisible ?? !1), i = P(!1);
      let s;
      const o = [];
      if (n.watermark) {
        const u = n.watermark;
        s = {
          display: P(u.display ?? !1),
          pinned: P(u.pinned ?? !1),
          content: P(u.content ?? ""),
          frequency: P(u.frequency ?? 30),
          duration: P(u.duration ?? 5),
          tokens: P(u.tokens ?? {}),
          readonly: u.readonly ?? !1
        }, o.push(
          re(
            s.display,
            (l) => e.emit("watermark:display", { display: l })
          ),
          re(
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
function i1(n) {
  return {
    id: n.id,
    label: P(n.label),
    description: P(n.description ?? null),
    content: P(n.content ?? ""),
    status: P(n.status ?? "idle"),
    progress: P(n.progress ?? 0),
    phase: P(n.phase ?? null),
    error: P(n.error ?? null),
    lastUpdate: P(n.lastUpdate ?? null),
    versions: P(n.versions ?? []),
    activeVersionNumber: P(n.activeVersionNumber ?? null),
    generations: P(n.generations ?? []),
    currentGenerationId: P(n.currentGenerationId ?? null),
    busy: P(!1),
    dirty: P(!1)
  };
}
function Aa(n) {
  return !Number.isFinite(n) || n < 0 ? 0 : n > 100 ? 100 : n;
}
function w1() {
  return {
    name: "llmServices",
    install(n) {
      const e = /* @__PURE__ */ new Map(), t = Dt([]), r = P(null);
      function i() {
        t.value = Array.from(e.values());
      }
      function s(S) {
        return e.get(S);
      }
      function o(S) {
        const w = e.get(S.id);
        if (w)
          return S.label !== void 0 && (w.label.value = S.label), S.description !== void 0 && (w.description.value = S.description), S.content !== void 0 && (w.content.value = S.content), S.status !== void 0 && (w.status.value = S.status), S.progress !== void 0 && (w.progress.value = Aa(S.progress)), S.phase !== void 0 && (w.phase.value = S.phase), S.error !== void 0 && (w.error.value = S.error), S.lastUpdate !== void 0 && (w.lastUpdate.value = S.lastUpdate), S.versions !== void 0 && (w.versions.value = S.versions), S.activeVersionNumber !== void 0 && (w.activeVersionNumber.value = S.activeVersionNumber), S.generations !== void 0 && (w.generations.value = S.generations), S.currentGenerationId !== void 0 && (w.currentGenerationId.value = S.currentGenerationId), w;
        const I = i1(S);
        return e.set(S.id, I), i(), I;
      }
      function a(S) {
        e.delete(S) && (r.value === S && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function u() {
        e.size === 0 && r.value === null || (e.clear(), r.value !== null && (r.value = null, n.emit("llmService:active", { id: null })), i());
      }
      function l(S) {
        return e.get(S);
      }
      function c(S) {
        S !== null && !e.has(S) || r.value !== S && (r.value = S, n.emit("llmService:active", { id: S }));
      }
      function d(S, w) {
        const I = s(S);
        I && (I.label.value = w);
      }
      function f(S, w) {
        const I = s(S);
        I && (I.status.value = w, w !== "error" && (I.error.value = null), w === "complete" && (I.progress.value = 100, I.phase.value = null));
      }
      function p(S, w, I) {
        const D = s(S);
        D && (D.progress.value = Aa(w), I !== void 0 && (D.phase.value = I));
      }
      function m(S, w, I) {
        const D = s(S);
        D && (D.content.value = w, D.lastUpdate.value = I ?? Date.now());
      }
      function v(S, w) {
        const I = s(S);
        I && (I.error.value = w, w && (I.status.value = "error"));
      }
      function y(S, w) {
        const I = s(S);
        I && (I.versions.value = w);
      }
      function _(S, w) {
        const I = s(S);
        I && (I.activeVersionNumber.value = w);
      }
      function b(S, w) {
        const I = s(S);
        I && (I.generations.value = w);
      }
      function C(S, w) {
        const I = s(S);
        I && (I.currentGenerationId.value = w);
      }
      function E(S, w) {
        const I = s(S);
        I && (I.busy.value = w);
      }
      function N(S, w) {
        const I = s(S);
        I && (I.dirty.value = w);
      }
      const T = A(() => {
        const S = r.value;
        return S === null ? null : e.get(S) ?? null;
      }), x = {
        list: t,
        activeId: r,
        active: T,
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
        setActiveVersion: _,
        setGenerations: b,
        setCurrentGeneration: C,
        setBusy: E,
        setDirty: N
      };
      return n.llmServices = x, () => {
        e.clear(), t.value = [], r.value = null, n.llmServices = void 0;
      };
    }
  };
}
const s1 = "__streaming__";
function T1() {
  return {
    name: "chat",
    install(n) {
      const e = P(!1), t = P([]), r = P(null), i = P([]), s = P(!1), o = P(""), a = P(!1);
      let u = 0;
      const l = () => `local-${++u}`, c = A(() => s.value ? [
        ...i.value,
        {
          id: s1,
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
function o1(n) {
  return n.map((e) => {
    const t = Ns(e.turn_id, e.words), r = t[0]?.startTime ?? e.stime, i = t.length > 0 ? t[t.length - 1].endTime ?? e.etime : e.etime;
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
function S1(n) {
  const e = /* @__PURE__ */ new Map();
  for (const i of n.speakers)
    e.set(i.speaker_id, {
      id: i.speaker_id,
      name: i.speaker_name,
      color: ""
    });
  const t = o1(n.text), r = n.metadata.transcription.lang ?? n.text[0]?.language ?? "fr";
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
function a1(n, e) {
  return nu(
    n,
    e.map((t) => ({
      text: t.word ?? "",
      startTime: t.start,
      endTime: t.end,
      confidence: t.score
    }))
  );
}
function _1(n) {
  const e = /* @__PURE__ */ new Map();
  for (const s of n.segments)
    s.speaker && !e.has(s.speaker) && e.set(s.speaker, {
      id: s.speaker,
      name: s.speaker,
      color: ""
    });
  const t = n.language ?? "fr", r = n.segments.map((s, o) => {
    const a = a1(`turn_${o}`, s.words);
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
  He as D,
  v1 as L,
  T1 as a,
  d1 as b,
  g1 as c,
  w1 as d,
  b1 as e,
  k1 as f,
  y1 as g,
  o1 as h,
  _1 as i,
  f1 as j,
  p1 as k,
  S1 as m,
  el as p,
  Pe as u,
  Yd as v
};
